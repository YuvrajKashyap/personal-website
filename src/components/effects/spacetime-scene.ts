/**
 * Spacetime fabric scene.
 *
 * A perspective grid of geodesics that sags around mass. A primary body sits in
 * its own well, small bodies orbit it under real softened gravity, the cursor
 * carries mass of its own (it dents the fabric and tugs the orbits), and a
 * press sends a gravitational wave across the sheet.
 *
 * Pure canvas 2D. No DOM access, so it can be unit tested with a recording
 * context and driven by any frame loop.
 */

import type { PixelBuffer } from "@/components/effects/pixel-worker-protocol";
import {
  createStarSurfacePainter,
  ERUPTION_PERIOD,
  smoothstep,
  STAR_DISC,
  STAR_FLARES,
  STAR_SIZE,
  type StarRgb,
} from "@/components/effects/star-surface";

export type SpacetimeVariant = "hero" | "well" | "abyss";

export type SpacetimePalette = Readonly<{
  /** Space separated rgb triple, for example "240 201 106". */
  line: string;
  /** Line color deep inside a well. Shallow lines use `line`. */
  lineDeep: string;
  body: string;
  /** The primary star, hottest to coolest. */
  starCore: string;
  starMid: string;
  starEdge: string;
  void: string;
  /** Peak line opacity. */
  alpha: number;
}>;

type VariantConfig = Readonly<{
  pitch: number;
  scrollPitch: number;
  horizon: number;
  zNear: number;
  zFar: number;
  cell: number;
  anchor: readonly [number, number];
  anchorNarrow: readonly [number, number];
  mass: number;
  massNarrow: number;
  soft: number;
  orbits: readonly number[];
}>;

const WELL: VariantConfig = {
  pitch: 0.6,
  scrollPitch: 0.22,
  horizon: 0.2,
  zNear: 0.34,
  zFar: 5,
  cell: 0.12,
  anchor: [0.5, 0.6],
  anchorNarrow: [0.5, 0.58],
  mass: 0.72,
  massNarrow: 0.5,
  soft: 0.58,
  orbits: [0.92, 1.2, 1.5, 1.84, 2.22],
};

const CONFIG: Record<SpacetimeVariant, VariantConfig> = {
  /** Full-viewport well that sits low, leaving the upper half for copy. */
  abyss: { ...WELL, anchor: [0.5, 0.78], anchorNarrow: [0.5, 0.8] },
  well: WELL,
  hero: {
    pitch: 0.52,
    scrollPitch: 0.2,
    horizon: 0.3,
    zNear: 0.3,
    zFar: 5.4,
    cell: 0.17,
    anchor: [0.77, 0.5],
    anchorNarrow: [0.92, 0.2],
    mass: 0.24,
    massNarrow: 0.15,
    soft: 0.44,
    orbits: [0.6, 0.94, 1.36],
  },
};

const BUCKETS = 9;
const GM = 0.16;
// Kept low: a stronger in-plane pull folds the sheet over itself at the
// bottom of a well and the lines collapse into a spike.
const PULL = 0.13;
const CURSOR_MASS = 0.085;
const CURSOR_SOFT = 0.26;
const EJECTA = 420;
/** Share of an eruption cycle (ERUPTION_PERIOD) that an ejection stays visible. */
const EJECTION_LIFE = 0.72;
const STAR_RAYS = 34;
const STAR_SPICULES = 110;
const WORLDLET_TONES = [
  "176 160 255",
  "110 206 232",
  "236 160 220",
  "150 176 255",
  "255 190 150",
] as const;
const BODY_MASS = 0.016;
const BODY_SOFT = 0.12;
const WAVE_SPEED = 1.7;
const WAVE_SIGMA = 0.34;
const WAVE_K = 8.5;
const WAVE_TAU = 1.5;
const WAVE_LIFE = 4.2;
const MAX_WAVES = 5;
const TRAIL_POINTS = 44;
const TRAIL_STEP = 0.045;
const SETTLE_SECONDS = 1.9;
/**
 * Seconds a worker-painted star surface may be off the frame's exact time and
 * still be used. Consecutive frame times differ by under half a millisecond
 * about 98% of the time; anything further off is painted on the page. The
 * surface already repaints only every other frame (16.7 ms apart), so this
 * is a small fraction of the staleness the design shows anyway.
 */
const STAR_TIME_SLACK = 0.0005;

type Wave = { x: number; z: number; age: number; amp: number };

type Body = {
  x: number;
  z: number;
  vx: number;
  vz: number;
  radius: number;
  age: number;
  trail: Float32Array;
  count: number;
  head: number;
};

/**
 * Paints the star's surface off the page (a worker). `paint` returns false if
 * it cannot take the job; `done` may never be called, and the scene never
 * waits for it.
 */
export type StarSurfaceRemote = Readonly<{
  paint: (
    t: number,
    core: StarRgb,
    mid: StarRgb,
    edge: StarRgb,
    done: (pixels: PixelBuffer) => void,
  ) => boolean;
  recycle: (pixels: PixelBuffer) => void;
}>;

export function createSpacetimeScene(
  variant: SpacetimeVariant,
  starRemote: StarSurfaceRemote | null = null,
) {
  const config = CONFIG[variant];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let focal = 1;
  let centerX = 0;
  let centerY = 0;
  let cosP = Math.cos(config.pitch);
  let sinP = Math.sin(config.pitch);
  let parallaxY = 0;
  let scroll = 0;

  let cols = 0;
  let cell = config.cell;
  let rows = 0;
  let halfSpan = 0;
  let screenX = new Float32Array(0);
  let screenY = new Float32Array(0);
  let bucket = new Uint8Array(0);

  let palette: SpacetimePalette = {
    line: "92 124 255",
    lineDeep: "255 206 150",
    body: "214 224 255",
    starCore: "255 244 214",
    starMid: "255 186 96",
    starEdge: "214 84 30",
    void: "3 4 6",
    alpha: 0.6,
  };
  let strokeStyles: string[] = [];

  let primaryX = 0;
  let primaryZ = 2;
  let primaryMass = config.mass;
  let settle = 0;
  let elapsed = 0;
  let openingWaveSent = false;
  let trailClock = 0;

  const cursor = { x: 0, z: 2, mass: 0, targetX: 0, targetZ: 2, active: false };
  const gm = variant === "hero" ? GM : GM * 2.4;
  // The footer well gives the cursor real weight; elsewhere it is a light touch.
  const cursorMass = variant === "well" ? 0.15 : CURSOR_MASS;
  let cursorHole = false;
  let pointerX = 0;
  let pointerY = 0;
  let lightTheme = false;
  let starCore = [255, 244, 214];
  let starMid = [255, 186, 96];
  let starEdge = [214, 84, 30];
  let starScreenX = 0;
  let starScreenY = 0;
  let starRadius = 12;
  let starFrame = 0;
  // Ejecta for the coronal mass ejection. Each particle keeps a fixed place
  // in the cloud: its bearing off the launch axis, how far out it rides
  // relative to the front, and its own flicker.
  const ejectaBearing = new Float32Array(EJECTA);
  const ejectaReach = new Float32Array(EJECTA);
  const ejectaSize = new Float32Array(EJECTA);
  const ejectaPhase = new Float32Array(EJECTA);
  const ejectaHeat = new Float32Array(EJECTA);
  {
    let state = 77;
    const next = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
    const bell = () => (next() + next() + next() - 1.5) / 1.5;
    for (let index = 0; index < EJECTA; index += 1) {
      const role = index / EJECTA;
      if (role < 0.5) {
        // Leading front: a thick, ragged bubble wall, furthest out on the axis.
        const bearing = bell() * 0.62;
        ejectaBearing[index] = bearing;
        ejectaReach[index] = 1 - 0.34 * (bearing / 0.62) * (bearing / 0.62) - next() * next() * 0.42;
        ejectaHeat[index] = 0.55 + next() * 0.3;
        ejectaSize[index] = 0.7 + next() * 1.1;
      } else if (role < 0.8) {
        // Core: the dense, bright filament that trails the front.
        ejectaBearing[index] = bell() * 0.3;
        ejectaReach[index] = 0.2 + next() * 0.42;
        ejectaHeat[index] = 0.62 + next() * 0.3;
        ejectaSize[index] = 0.9 + next() * 1.4;
      } else {
        // Legs and stragglers stretching back to the surface.
        const side = next() > 0.5 ? 1 : -1;
        const along = next();
        ejectaBearing[index] = side * (0.2 + along * 0.36) + bell() * 0.05;
        ejectaReach[index] = 0.08 + along * 0.62;
        ejectaHeat[index] = 0.3 + next() * 0.3;
        ejectaSize[index] = 0.6 + next() * 0.8;
      }
      // A share of the cloud is thin haze: big, faint puffs that fill it in.
      if (index % 6 === 0) ejectaSize[index] = -(2.6 + next() * 2.4);
      ejectaPhase[index] = next() * Math.PI * 2;
    }
  }

  // Painted here on the first frame, while still, and whenever the worker's
  // copy is not back in time; otherwise the worker paints it a frame ahead.
  const starPainter = createStarSurfacePainter();
  let starSurface: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    image: ImageData;
  } | null = null;
  // The worker paint for the next repaint frame: which request, the time it
  // was asked for, and its pixels once they are back.
  let starRequest = 0;
  let starRequestTime = -1;
  let starReady: PixelBuffer | null = null;
  let lastStarDt = 0.016;
  const waves: Wave[] = [];
  const bodies: Body[] = [];

  // Reused per frame so the field loop never allocates.
  const projected = { x: 0, y: 0, scale: 0 };

  function setPitch() {
    const pitch = config.pitch + scroll * config.scrollPitch;
    cosP = Math.cos(pitch);
    sinP = Math.sin(pitch);
    parallaxY = scroll * height * 0.14;
  }

  function project(x: number, y: number, z: number) {
    const lifted = y - 1;
    const yc = lifted * cosP + z * sinP;
    const zc = Math.max(0.08, -lifted * sinP + z * cosP);
    const scale = focal / zc;
    projected.x = centerX + x * scale;
    projected.y = centerY - yc * scale + parallaxY;
    projected.scale = scale;
    return projected;
  }

  /** Screen point to the plane sitting `drop` below the flat sheet. */
  function unproject(
    sx: number,
    sy: number,
    out: { x: number; z: number },
    drop = 0,
  ) {
    const lift = 1 + drop;
    const v = (centerY + parallaxY - sy) / focal;
    const denominator = sinP - v * cosP;
    const z =
      denominator <= 0.02
        ? config.zFar
        : Math.min(
            config.zFar,
            Math.max(config.zNear, (lift * (cosP + v * sinP)) / denominator),
          );
    const zc = lift * sinP + z * cosP;
    out.x = ((sx - centerX) * zc) / focal;
    out.z = z;
    return out;
  }

  /**
   * Screen point to the spot on the curved sheet that actually sits under it.
   * The sheet's depth there depends on where "there" is (the star's well gets
   * deeper toward the star), so this walks in: guess a depth, find the point,
   * read the real depth at that point, and repeat until they agree.
   */
  function locate(
    sx: number,
    sy: number,
    out: { x: number; z: number },
    ownDepth: number,
  ) {
    let drop = ownDepth;
    for (let pass = 0; pass < 12; pass += 1) {
      unproject(sx, sy, out, drop);
      const dx = out.x - primaryX;
      const dz = out.z - primaryZ;
      const actual =
        ownDepth +
        (primaryMass * settle) / Math.sqrt(dx * dx + dz * dz + config.soft * config.soft);
      // Half steps keep it from overshooting on the steep wall near the star.
      drop += (actual - drop) * 0.5;
    }
    return unproject(sx, sy, out, drop);
  }

  function resetBody(body: Body, radius: number, angle: number) {
    const speed = Math.sqrt(gm / radius);
    body.radius = radius;
    body.x = primaryX + Math.cos(angle) * radius;
    body.z = primaryZ + Math.sin(angle) * radius;
    body.vx = -Math.sin(angle) * speed;
    body.vz = Math.cos(angle) * speed;
    body.age = 0;
    body.count = 0;
    body.head = 0;
  }

  function seedBodies() {
    bodies.length = 0;
    config.orbits.forEach((radius, index) => {
      const body: Body = {
        x: 0,
        z: 0,
        vx: 0,
        vz: 0,
        radius,
        age: 0,
        trail: new Float32Array(TRAIL_POINTS * 2),
        count: 0,
        head: 0,
      };
      resetBody(body, radius, 0.9 + index * 2.15);
      body.age = 2;
      bodies.push(body);
    });
  }

  function massHeight(x: number, z: number) {
    let dx = x - primaryX;
    let dz = z - primaryZ;
    let total =
      (primaryMass * settle) / Math.sqrt(dx * dx + dz * dz + config.soft * config.soft);
    if (cursor.mass > 0.0005) {
      dx = x - cursor.x;
      dz = z - cursor.z;
      total += cursor.mass / Math.sqrt(dx * dx + dz * dz + CURSOR_SOFT * CURSOR_SOFT);
    }
    return -total;
  }

  function waveHeight(x: number, z: number) {
    let total = 0;
    for (const wave of waves) {
      const dx = x - wave.x;
      const dz = z - wave.z;
      const u = Math.sqrt(dx * dx + dz * dz) - WAVE_SPEED * wave.age;
      if (u > WAVE_SIGMA * 3 || u < -WAVE_SIGMA * 3) continue;
      total +=
        wave.amp *
        Math.exp(-(u * u) / (WAVE_SIGMA * WAVE_SIGMA)) *
        Math.cos(u * WAVE_K) *
        Math.exp(-wave.age / WAVE_TAU);
    }
    return total;
  }

  function buildStrokeStyles() {
    const shallow = palette.line.split(" ").map(Number);
    const deep = palette.lineDeep.split(" ").map(Number);
    strokeStyles = [];
    for (let index = 0; index < BUCKETS; index += 1) {
      const t = index / (BUCKETS - 1);
      // Brighter lines sit deeper in a well, so they also shift hue.
      const mix = t * t;
      const color = shallow
        .map((channel, slot) => Math.round(channel + (deep[slot] - channel) * mix))
        .join(" ");
      strokeStyles.push(`rgb(${color} / ${(palette.alpha * t).toFixed(3)})`);
    }
  }

  function layout() {
    if (width === 0 || height === 0) return;

    const narrow = width < 760;
    focal = 0.95 * Math.min(760, Math.max(380, height));
    centerX = width / 2;
    centerY = height * config.horizon;
    primaryMass = narrow ? config.massNarrow : config.mass;

    // Anchor the primary to a screen position using the resting camera.
    const savedScroll = scroll;
    scroll = 0;
    setPitch();
    const anchor = narrow ? config.anchorNarrow : config.anchor;
    // Aim at the floor of the well, so the body lands on the anchor itself.
    const world = unproject(
      width * anchor[0],
      height * anchor[1],
      { x: 0, z: 0 },
      primaryMass / config.soft,
    );
    const shiftX = world.x - primaryX;
    const shiftZ = world.z - primaryZ;
    primaryX = world.x;
    primaryZ = world.z;

    const farDepth = sinP + config.zFar * cosP;
    halfSpan = ((width / 2 + 80) / focal) * farDepth;
    scroll = savedScroll;
    setPitch();

    // Phones get a finer weave so the sheet still reads as fabric.
    cell = narrow ? config.cell * 0.72 : config.cell;
    cols = Math.min(170, Math.ceil((halfSpan * 2) / cell) + 1);
    rows = Math.ceil((config.zFar - config.zNear) / cell) + 1;
    const total = cols * rows;
    if (screenX.length !== total) {
      screenX = new Float32Array(total);
      screenY = new Float32Array(total);
      bucket = new Uint8Array(total);
    }

    if (bodies.length === 0) {
      cursor.x = primaryX;
      cursor.z = primaryZ;
      seedBodies();
    } else {
      // Resizes keep the orbits alive: carry every body with the primary.
      for (const body of bodies) {
        body.x += shiftX;
        body.z += shiftZ;
        body.count = 0;
      }
    }
  }

  function stepBodies(dt: number) {
    const cursorPull = (cursor.mass / CURSOR_MASS) * 0.055;

    for (let index = 0; index < bodies.length; index += 1) {
      const body = bodies[index];
      body.age += dt;

      const steps = 2;
      const h = dt / steps;
      for (let step = 0; step < steps; step += 1) {
        let dx = body.x - primaryX;
        let dz = body.z - primaryZ;
        let r2 = dx * dx + dz * dz + 0.02;
        let inverse = 1 / (r2 * Math.sqrt(r2));
        let ax = -gm * dx * inverse;
        let az = -gm * dz * inverse;
        if (cursorPull > 0.0005) {
          dx = body.x - cursor.x;
          dz = body.z - cursor.z;
          r2 = dx * dx + dz * dz + 0.05;
          inverse = 1 / (r2 * Math.sqrt(r2));
          ax -= cursorPull * dx * inverse;
          az -= cursorPull * dz * inverse;
        }
        body.vx += ax * h;
        body.vz += az * h;
        body.x += body.vx * h;
        body.z += body.vz * h;
      }

      const dx = body.x - primaryX;
      const dz = body.z - primaryZ;
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance > 3.3 || distance < 0.42) {
        // Captured or flung out: a fresh body settles into the same lane.
        resetBody(body, config.orbits[index], elapsed * 0.7 + index * 2.15);
      }
    }

    trailClock += dt;
    if (trailClock >= TRAIL_STEP) {
      trailClock = 0;
      for (const body of bodies) {
        body.head = (body.head - 1 + TRAIL_POINTS) % TRAIL_POINTS;
        body.trail[body.head * 2] = body.x;
        body.trail[body.head * 2 + 1] = body.z;
        body.count = Math.min(body.count + 1, TRAIL_POINTS);
      }
    }
  }

  function computeField() {
    const depthReference = (primaryMass / config.soft) * 0.72;
    const fadeStart = config.zFar * 0.5;
    let offset = 0;

    for (let row = 0; row < rows; row += 1) {
      const z = config.zNear + row * cell;
      const distanceFade = 1 - smoothstep(fadeStart, config.zFar, z);

      for (let col = 0; col < cols; col += 1) {
        const x = -halfSpan + col * cell;
        let px = x;
        let pz = z;
        let depth = 0;

        let dx = x - primaryX;
        let dz = z - primaryZ;
        let inverse2 = 1 / (dx * dx + dz * dz + config.soft * config.soft);
        let mass = primaryMass * settle;
        depth += mass * Math.sqrt(inverse2);
        px -= dx * PULL * mass * inverse2;
        pz -= dz * PULL * mass * inverse2;

        if (cursor.mass > 0.0005) {
          dx = x - cursor.x;
          dz = z - cursor.z;
          inverse2 = 1 / (dx * dx + dz * dz + CURSOR_SOFT * CURSOR_SOFT);
          depth += cursor.mass * Math.sqrt(inverse2);
          px -= dx * PULL * cursor.mass * inverse2;
          pz -= dz * PULL * cursor.mass * inverse2;
        }

        mass = BODY_MASS * settle;
        for (const body of bodies) {
          dx = x - body.x;
          dz = z - body.z;
          depth += mass / Math.sqrt(dx * dx + dz * dz + BODY_SOFT * BODY_SOFT);
        }

        const ripple = waves.length > 0 ? waveHeight(x, z) : 0;
        const point = project(px, ripple - depth, pz);
        screenX[offset] = point.x;
        screenY[offset] = point.y;

        const intensity = Math.min(1, depth / depthReference + Math.abs(ripple) * 7);
        const alpha = (0.1 + 0.9 * Math.pow(intensity, 0.85)) * distanceFade;
        bucket[offset] = Math.round(alpha * (BUCKETS - 1));
        offset += 1;
      }
    }
  }

  function drawGrid(context: CanvasRenderingContext2D) {
    const minX = -60;
    const maxX = width + 60;
    const maxY = height + 60;

    for (let level = 1; level < BUCKETS; level += 1) {
      let open = false;
      context.beginPath();

      for (let row = 0; row < rows; row += 1) {
        const rowStart = row * cols;
        for (let col = 0; col < cols; col += 1) {
          const index = rowStart + col;
          const x = screenX[index];
          const y = screenY[index];

          if (col + 1 < cols) {
            const next = index + 1;
            if (
              Math.max(bucket[index], bucket[next]) === level &&
              !(x < minX && screenX[next] < minX) &&
              !(x > maxX && screenX[next] > maxX) &&
              !(y > maxY && screenY[next] > maxY)
            ) {
              context.moveTo(x, y);
              context.lineTo(screenX[next], screenY[next]);
              open = true;
            }
          }

          if (row + 1 < rows) {
            const below = index + cols;
            if (
              Math.max(bucket[index], bucket[below]) === level &&
              !(x < minX && screenX[below] < minX) &&
              !(x > maxX && screenX[below] > maxX) &&
              !(y > maxY && screenY[below] > maxY)
            ) {
              context.moveTo(x, y);
              context.lineTo(screenX[below], screenY[below]);
              open = true;
            }
          }
        }
      }

      if (open) {
        context.strokeStyle = strokeStyles[level];
        context.stroke();
      }
    }
  }

  function drawWorldlet(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    tone: string,
    alpha: number,
  ) {
    // Lit by the star: the bright limb faces it, the far side falls to night.
    const toStarX = starScreenX - x;
    const toStarY = starScreenY - y;
    const span = Math.hypot(toStarX, toStarY) + 0.001;
    const hx = x + (toStarX / span) * radius * 0.5;
    const hy = y + (toStarY / span) * radius * 0.5;
    const shade = context.createRadialGradient(hx, hy, radius * 0.08, x, y, radius);
    shade.addColorStop(0, `rgb(${tone} / ${alpha.toFixed(3)})`);
    shade.addColorStop(0.6, `rgb(${tone} / ${(alpha * 0.72).toFixed(3)})`);
    shade.addColorStop(1, `rgb(${palette.void} / ${alpha.toFixed(3)})`);
    context.fillStyle = `rgb(${palette.void} / ${alpha.toFixed(3)})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = shade;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function drawBodies(context: CanvasRenderingContext2D, behind: boolean) {
    for (let order = 0; order < bodies.length; order += 1) {
      const body = bodies[order];
      if (body.z > primaryZ !== behind) continue;
      const fade = Math.min(1, body.age / 1.2) * settle;
      if (fade <= 0.01) continue;
      const tone = WORLDLET_TONES[order % WORLDLET_TONES.length];

      // The trail is re-projected every frame so it hugs the moving fabric.
      let previousX = 0;
      let previousY = 0;
      for (let index = 0; index < body.count; index += 1) {
        const slot = ((body.head + index) % TRAIL_POINTS) * 2;
        const x = body.trail[slot];
        const z = body.trail[slot + 1];
        const point = project(x, massHeight(x, z), z);
        if (index > 0) {
          const life = 1 - index / body.count;
          context.strokeStyle = `rgb(${palette.body} / ${(life * life * 0.4 * fade).toFixed(3)})`;
          context.lineWidth = 0.5 + life * 0.9;
          context.beginPath();
          context.moveTo(previousX, previousY);
          context.lineTo(point.x, point.y);
          context.stroke();
        }
        previousX = point.x;
        previousY = point.y;
      }

      const point = project(body.x, massHeight(body.x, body.z), body.z);
      const radius = Math.min(7.5, Math.max(2.2, 0.03 * point.scale));
      drawWorldlet(context, point.x, point.y - radius * 0.6, radius, lightTheme ? palette.body : tone, fade);
    }
    context.lineWidth = 1;
  }

  /**
   * The cursor as a tiny black hole: an event horizon, a photon ring, and a
   * tilted accretion disc whose far side is lensed up and over the top.
   */
  function drawCursorHole(context: CanvasRenderingContext2D) {
    const grow = Math.min(1, cursor.mass / cursorMass);
    if (!cursorHole || grow < 0.03) return;
    const radius = 9.5 * grow;
    const x = pointerX;
    const y = pointerY;
    const hot = lightTheme ? palette.starEdge : palette.starCore;
    const warm = palette.starMid;
    const tilt = -0.22;
    const spin = elapsed * 2.4;

    if (!lightTheme) {
      context.globalCompositeOperation = "lighter";
      const halo = context.createRadialGradient(x, y, radius, x, y, radius * 4.6);
      halo.addColorStop(0, `rgb(${warm} / ${(0.3 * grow).toFixed(3)})`);
      halo.addColorStop(1, `rgb(${warm} / 0)`);
      context.fillStyle = halo;
      context.beginPath();
      context.arc(x, y, radius * 4.6, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = "source-over";
    }

    // Doppler beaming: the side of the disc turning toward us is brighter.
    const disc = context.createLinearGradient(x - radius * 2.6, y, x + radius * 2.6, y);
    disc.addColorStop(0, `rgb(${hot} / ${(0.95 * grow).toFixed(3)})`);
    disc.addColorStop(0.55, `rgb(${warm} / ${(0.7 * grow).toFixed(3)})`);
    disc.addColorStop(1, `rgb(${warm} / ${(0.22 * grow).toFixed(3)})`);
    context.lineCap = "round";

    // Far half of the disc, behind the horizon.
    context.strokeStyle = disc;
    context.lineWidth = Math.max(1, radius * 0.3);
    context.beginPath();
    context.ellipse(x, y, radius * 2.5, radius * 0.62, tilt, Math.PI, Math.PI * 2);
    context.stroke();

    // Light from the far side, bent over the top of the hole.
    context.strokeStyle = `rgb(${warm} / ${(0.85 * grow).toFixed(3)})`;
    context.lineWidth = Math.max(1, radius * 0.2);
    context.beginPath();
    context.arc(x, y, radius * 1.42, Math.PI * 1.06 + tilt, Math.PI * 1.94 + tilt);
    context.stroke();
    context.strokeStyle = `rgb(${warm} / ${(0.4 * grow).toFixed(3)})`;
    context.lineWidth = Math.max(0.8, radius * 0.1);
    context.beginPath();
    context.arc(x, y, radius * 1.3, Math.PI * 0.14 + tilt, Math.PI * 0.86 + tilt);
    context.stroke();

    context.fillStyle = lightTheme ? "rgb(24 14 12)" : "rgb(0 0 0)";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    // Photon ring hugging the horizon.
    context.strokeStyle = `rgb(${hot} / ${(0.95 * grow).toFixed(3)})`;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius + 0.6, 0, Math.PI * 2);
    context.stroke();

    // Near half of the disc crosses in front.
    context.strokeStyle = disc;
    context.lineWidth = Math.max(1, radius * 0.32);
    context.beginPath();
    context.ellipse(x, y, radius * 2.5, radius * 0.62, tilt, 0, Math.PI);
    context.stroke();

    // A hot clump riding the disc shows that it is turning.
    const clumpX = x + Math.cos(spin) * radius * 2.5 * Math.cos(tilt) - Math.sin(spin) * radius * 0.62 * Math.sin(tilt);
    const clumpY = y + Math.cos(spin) * radius * 2.5 * Math.sin(tilt) + Math.sin(spin) * radius * 0.62 * Math.cos(tilt);
    if (Math.sin(spin) > -0.2) {
      context.fillStyle = `rgb(${hot} / ${grow.toFixed(3)})`;
      context.beginPath();
      context.arc(clumpX, clumpY, Math.max(1, radius * 0.17), 0, Math.PI * 2);
      context.fill();
    }
    context.lineWidth = 1;
  }

  function ensureStarSurface() {
    if (starSurface) return starSurface;
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = STAR_SIZE;
    canvas.height = STAR_SIZE;
    const surfaceContext = canvas.getContext("2d");
    if (!surfaceContext) return null;
    const image = surfaceContext.createImageData(STAR_SIZE, STAR_SIZE);
    starSurface = { canvas, context: surfaceContext, image };
    return starSurface;
  }

  function paintStarSurface() {
    const surface = ensureStarSurface();
    if (!surface) return;
    starPainter.paint(surface.image.data, elapsed, starCore, starMid, starEdge);
    surface.context.putImageData(surface.image, 0, 0);
  }

  /**
   * Repaint frame: use the worker's pixels if they were painted for this
   * moment (frame times jitter by a fraction of a millisecond, so within
   * STAR_TIME_SLACK), otherwise paint here exactly as before.
   */
  function presentStarSurface() {
    const ready = starReady;
    const onTime =
      ready !== null &&
      starRequestTime >= 0 &&
      Math.abs(starRequestTime - elapsed) <= STAR_TIME_SLACK;
    starReady = null;
    starRequest += 1;
    starRequestTime = -1;
    if (!onTime || !starSurface) {
      if (ready) starRemote?.recycle(ready);
      paintStarSurface();
      return;
    }
    starSurface.context.putImageData(new ImageData(ready, STAR_SIZE, STAR_SIZE), 0, 0);
    starRemote?.recycle(ready);
  }

  /** Asks the worker for the surface at the time the next frame will have. */
  function requestStarSurface() {
    if (!starRemote) return;
    if (starReady) starRemote.recycle(starReady);
    starReady = null;
    starRequest += 1;
    const request = starRequest;
    const t = elapsed + lastStarDt;
    starRequestTime = t;
    const taken = starRemote.paint(t, starCore, starMid, starEdge, (pixels) => {
      if (request === starRequest) starReady = pixels;
      else starRemote.recycle(pixels);
    });
    if (!taken) starRequestTime = -1;
  }

  /**
   * A small living star: rotating, spotted surface; chromosphere and spicules
   * at the limb; a lopsided corona with tapered streamers; prominences that
   * lift and fall; and now and then a mass ejection blown off one side.
   */
  function drawPrimary(context: CanvasRenderingContext2D, frozen: boolean) {
    if (settle <= 0.01) return;

    const x = starScreenX;
    const y = starScreenY;
    const radius = starRadius;
    const t = elapsed;
    const mid = palette.starMid;
    const core = palette.starCore;
    const flicker = frozen ? 1 : 1 + Math.sin(t * 2.3) * 0.03 + Math.sin(t * 5.1) * 0.02;

    context.globalCompositeOperation = lightTheme ? "source-over" : "lighter";

    // Corona: wider along the equator than toward the poles.
    context.save();
    context.translate(x, y);
    context.rotate(-0.16);
    context.scale(1.3, 0.92);
    const reach = radius * 6.2 * flicker;
    const corona = context.createRadialGradient(0, 0, radius * 0.7, 0, 0, reach);
    corona.addColorStop(0, `rgb(${mid} / ${(0.55 * settle).toFixed(3)})`);
    corona.addColorStop(0.14, `rgb(${mid} / ${(0.24 * settle).toFixed(3)})`);
    corona.addColorStop(0.42, `rgb(${mid} / ${(0.07 * settle).toFixed(3)})`);
    corona.addColorStop(1, `rgb(${mid} / 0)`);
    context.fillStyle = corona;
    context.beginPath();
    context.arc(0, 0, reach, 0, Math.PI * 2);
    context.fill();
    context.restore();

    // Streamers: tapered wedges, longest near the equator.
    for (let ray = 0; ray < STAR_RAYS; ray += 1) {
      const angle = (ray / STAR_RAYS) * Math.PI * 2 + Math.sin(ray * 12.9898) * 0.22 + t * 0.01;
      const equator = Math.pow(Math.cos(angle + 0.16), 2);
      const length =
        radius *
        Math.max(
          0.35,
          0.7 + 1.7 * equator + 0.7 * Math.sin(t * 0.6 + ray * 2.4) + 0.5 * Math.sin(t * 1.27 + ray * 5.1),
        );
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const base = radius * 0.94;
      const halfWidth = radius * (ray % 3 === 0 ? 0.13 : 0.07);
      const tipX = x + cos * (radius + length);
      const tipY = y + sin * (radius + length);
      const beam = context.createLinearGradient(x + cos * base, y + sin * base, tipX, tipY);
      beam.addColorStop(0, `rgb(${core} / ${(0.3 * settle).toFixed(3)})`);
      beam.addColorStop(0.5, `rgb(${mid} / ${(0.1 * settle).toFixed(3)})`);
      beam.addColorStop(1, `rgb(${mid} / 0)`);
      context.fillStyle = beam;
      context.beginPath();
      context.moveTo(x + cos * base - sin * halfWidth, y + sin * base + cos * halfWidth);
      context.lineTo(tipX, tipY);
      context.lineTo(x + cos * base + sin * halfWidth, y + sin * base - cos * halfWidth);
      context.closePath();
      context.fill();
    }

    context.lineCap = "round";
    // Coronal mass ejection: a bubble of plasma thrown off the star. A bright
    // ragged front leads, a hollow follows, and a dense core trails behind,
    // the whole cloud widening, slowing and cooling to red as it travels.
    if (!frozen) {
      const slot = STAR_FLARES - 1;
      const clock = (t + slot * 4.1) / ERUPTION_PERIOD;
      const cycle = Math.floor(clock);
      const phase = clock - cycle;
      if (phase < EJECTION_LIFE) {
        const p = phase / EJECTION_LIFE;
        const hash = Math.sin((cycle + 1) * 78.233 + slot * 37.719) * 43758.5453;
        const axis = (hash - Math.floor(hash)) * Math.PI * 2;
        // Fast at launch, coasting later.
        const travel = radius * 4.4 * (1 - Math.exp(-p * 2.6));
        const fade = smoothstep(0, 0.06, p) * Math.pow(1 - p, 1.5) * settle;
        const cool = Math.min(1, p * 1.5);
        for (let index = 0; index < EJECTA; index += 1) {
          const wobble = Math.sin(t * 2.2 + ejectaPhase[index]);
          const bearing = axis + ejectaBearing[index] * (0.75 + p * 0.55) + wobble * 0.012;
          const distance =
            radius * 0.98 + travel * ejectaReach[index] * (1 + wobble * 0.03);
          const px = x + Math.cos(bearing) * distance;
          const py = y + Math.sin(bearing) * distance;
          const heat = ejectaHeat[index] * (1 - cool * 0.7);
          const tint = heat > 0.55 ? core : heat > 0.28 ? mid : palette.starEdge;
          const haze = ejectaSize[index] < 0;
          const alpha =
            fade * (0.08 + ejectaHeat[index] * 0.24) * (0.8 + wobble * 0.2) * (haze ? 0.3 : 1);
          if (alpha < 0.004) continue;
          const size =
            Math.abs(ejectaSize[index]) * (1 + p * 2.1) * Math.max(0.7, radius / 34);
          context.fillStyle = `rgb(${tint} / ${alpha.toFixed(3)})`;
          context.beginPath();
          context.arc(px, py, size, 0, Math.PI * 2);
          context.fill();
        }
      }
    }

    // Spicules: a restless fringe of short jets all around the limb.
    context.strokeStyle = `rgb(${mid} / ${(0.5 * settle).toFixed(3)})`;
    context.lineWidth = Math.max(0.7, radius * 0.022);
    context.beginPath();
    for (let jet = 0; jet < STAR_SPICULES; jet += 1) {
      const angle = (jet / STAR_SPICULES) * Math.PI * 2 + Math.sin(jet * 7.13) * 0.03;
      const length = radius * (0.05 + 0.07 * (0.5 + 0.5 * Math.sin(t * 3.1 + jet * 1.7)));
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      context.moveTo(x + cos * radius * 0.98, y + sin * radius * 0.98);
      context.lineTo(x + cos * (radius + length), y + sin * (radius + length));
    }
    context.stroke();

    context.globalCompositeOperation = "source-over";

    if (starSurface) {
      const drawn = (radius / STAR_DISC) * (0.7 + 0.3 * settle);
      context.globalAlpha = Math.min(1, settle * 1.4);
      context.imageSmoothingEnabled = true;
      context.drawImage(starSurface.canvas, x - drawn, y - drawn, drawn * 2, drawn * 2);
      context.globalAlpha = 1;
    }

    if (!lightTheme) {
      context.globalCompositeOperation = "lighter";
      const bloom = context.createRadialGradient(x, y, 0, x, y, radius * 1.8);
      bloom.addColorStop(0, `rgb(${core} / ${(0.1 * settle).toFixed(3)})`);
      bloom.addColorStop(0.6, `rgb(${mid} / ${(0.1 * settle).toFixed(3)})`);
      bloom.addColorStop(1, `rgb(${mid} / 0)`);
      context.fillStyle = bloom;
      context.beginPath();
      context.arc(x, y, radius * 1.8, 0, Math.PI * 2);
      context.fill();
      context.globalCompositeOperation = "source-over";
    }
    context.lineWidth = 1;
  }

  function addWave(x: number, z: number, amp: number) {
    if (waves.length >= MAX_WAVES) waves.shift();
    waves.push({ x, z, age: 0, amp });
  }

  const scratch = { x: 0, z: 0 };

  return {
    resize(nextWidth: number, nextHeight: number, nextDpr: number) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      layout();
    },

    setPalette(nextPalette: SpacetimePalette, light = false) {
      palette = nextPalette;
      lightTheme = light;
      starCore = palette.starCore.split(" ").map(Number);
      starMid = palette.starMid.split(" ").map(Number);
      starEdge = palette.starEdge.split(" ").map(Number);
      // A surface already asked for was painted in the old colours.
      starRequest += 1;
      starRequestTime = -1;
      buildStrokeStyles();
    },

    /** While on, the pointer is drawn as a tiny black hole (footer well only). */
    setCursorHole(enabled: boolean) {
      cursorHole = enabled;
    },

    /** 0 at rest. Rising values tip the camera toward the horizon. */
    setScroll(progress: number) {
      scroll = Math.min(1, Math.max(0, progress));
      setPitch();
    },

    setPointer(sx: number, sy: number, active: boolean) {
      cursor.active = active;
      if (!active) return;
      pointerX = sx;
      pointerY = sy;
      // Aim at the floor of the cursor's own dent so it sits under the pointer.
      locate(sx, sy, scratch, cursor.mass / CURSOR_SOFT);
      cursor.targetX = Math.min(halfSpan, Math.max(-halfSpan, scratch.x));
      cursor.targetZ = scratch.z;
    },

    /** Gravitational wave from a screen point. */
    pulse(sx: number, sy: number) {
      locate(sx, sy, scratch, cursor.active ? cursor.mass / CURSOR_SOFT : 0);
      addWave(scratch.x, scratch.z, 0.085);
    },

    /** True while something is still moving and another frame is worthwhile. */
    render(context: CanvasRenderingContext2D, dtSeconds: number, frozen = false) {
      if (width === 0 || height === 0) return;
      if (strokeStyles.length === 0) buildStrokeStyles();

      if (frozen) {
        settle = 1;
        cursor.mass = 0;
        waves.length = 0;
      } else {
        const dt = Math.min(0.05, Math.max(0, dtSeconds));
        elapsed += dt;
        lastStarDt = dt;
        const t = Math.min(1, elapsed / SETTLE_SECONDS);
        settle = 1 - Math.pow(1 - t, 4);

        if (!openingWaveSent && elapsed > 0.45) {
          openingWaveSent = true;
          addWave(primaryX, primaryZ, 0.07);
        }

        const follow = 1 - Math.exp(-dt * 16);
        cursor.x += (cursor.targetX - cursor.x) * follow;
        cursor.z += (cursor.targetZ - cursor.z) * follow;
        const targetMass = cursor.active ? cursorMass : 0;
        cursor.mass += (targetMass - cursor.mass) * (1 - Math.exp(-dt * 4));

        for (let index = waves.length - 1; index >= 0; index -= 1) {
          waves[index].age += dt;
          if (waves[index].age > WAVE_LIFE) waves.splice(index, 1);
        }

        stepBodies(dt);
      }

      // The frame before a repaint, ask the worker for the next surface. It
      // goes out before this frame's drawing so the pixels are back before
      // the next frame starts; the page keeps that budget for everything else.
      // (This frame will be starFrame + 1, so the next is starFrame + 2.)
      const cadence = width < 760 ? 3 : 2;
      if (starRemote && !frozen && (starFrame + 2) % cadence === 1) requestStarSurface();

      computeField();

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.lineCap = "round";
      drawGrid(context);

      const star = project(primaryX, massHeight(primaryX, primaryZ), primaryZ);
      starRadius = Math.min(60, Math.max(22, 0.2 * star.scale));
      starScreenX = star.x;
      // Rest the star on the floor of its well instead of sinking it in.
      starScreenY = star.y - starRadius * 0.55;
      starFrame += 1;
      // The plasma repaints every other frame, every third on narrow screens.
      if (frozen || !starSurface) {
        paintStarSurface();
      } else if (starFrame % cadence === 1) {
        if (starRemote) presentStarSurface();
        else paintStarSurface();
      }

      drawBodies(context, true);
      drawPrimary(context, frozen);
      drawBodies(context, false);
      drawCursorHole(context);
    },
  };
}

export type SpacetimeScene = ReturnType<typeof createSpacetimeScene>;
