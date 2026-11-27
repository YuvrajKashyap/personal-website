/**
 * Cosmos scene: the deep-space layer behind the Home chapters.
 *
 * Two parts, both pure functions of canvas state so they can be driven by any
 * frame loop:
 *  - `paintNebula` bakes a domain-warped noise cloud into a tiny canvas once.
 *    CSS stretches and moves it, so the clouds cost nothing per frame.
 *  - `createStarfield` draws a three-depth starfield every frame: stars
 *    twinkle, slide past at different speeds as the page scrolls, stretch into
 *    streaks when the scroll is fast, lean away from the cursor, and now and
 *    then one falls.
 */

export type CosmosTheme = "dark" | "light";

type Rgb = readonly [number, number, number];

export type NebulaPalette = Readonly<{
  low: Rgb;
  high: Rgb;
  core: Rgb;
  strength: number;
}>;

export const NEBULA_PALETTES: Record<CosmosTheme, readonly NebulaPalette[]> = {
  dark: [
    { low: [58, 44, 168], high: [128, 86, 255], core: [196, 170, 255], strength: 0.58 },
    { low: [34, 78, 196], high: [186, 72, 214], core: [255, 176, 236], strength: 0.54 },
    { low: [22, 96, 150], high: [84, 104, 255], core: [158, 226, 255], strength: 0.56 },
  ],
  light: [
    { low: [214, 150, 132], high: [190, 92, 84], core: [150, 54, 54], strength: 0.3 },
    { low: [222, 184, 140], high: [200, 128, 96], core: [170, 84, 60], strength: 0.28 },
    { low: [206, 160, 150], high: [176, 104, 110], core: [140, 60, 70], strength: 0.26 },
  ],
};

const STAR_COLORS: Record<CosmosTheme, readonly string[]> = {
  dark: ["255 255 255", "214 226 255", "190 204 255", "226 206 255", "255 236 204"],
  light: ["64 38 30", "96 44 36", "127 29 29", "84 60 50", "64 38 30"],
};

/**
 * `rgb(${color} / ${alpha.toFixed(3)})`, the colour every star is drawn
 * with, built once per colour and alpha step instead of for every star in
 * every frame. It returns the same string, so the canvas paints the same
 * pixels; only the string building is saved.
 */
const inkRows = new Map<string, string[]>();
function ink(color: string, alpha: number): string {
  const scaled = alpha * 1000;
  // Math.round matches toFixed(3) everywhere except within a rounding error
  // of a half step, where the multiply above can tip it the other way. Those
  // rare values, and anything outside 0..1, take the original path.
  if (!(scaled >= 0 && scaled <= 1000) || Math.abs(scaled - Math.floor(scaled) - 0.5) < 1e-6) {
    return `rgb(${color} / ${alpha.toFixed(3)})`;
  }
  const step = Math.round(scaled);
  let row = inkRows.get(color);
  if (!row) {
    row = new Array<string>(1001);
    inkRows.set(color, row);
  }
  return (row[step] ??= `rgb(${color} / ${(step / 1000).toFixed(3)})`);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function mulberry(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createNoise(seed: number) {
  const random = mulberry(seed);
  const lattice = new Float32Array(256);
  const order = new Uint8Array(512);
  for (let index = 0; index < 256; index += 1) {
    lattice[index] = random();
    order[index] = index;
  }
  for (let index = 255; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const held = order[index];
    order[index] = order[swap];
    order[swap] = held;
  }
  for (let index = 0; index < 256; index += 1) order[index + 256] = order[index];

  const value = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const x0 = xi & 255;
    const y0 = yi & 255;
    const a = lattice[order[order[x0] + y0]];
    const b = lattice[order[order[x0 + 1] + y0]];
    const c = lattice[order[order[x0] + y0 + 1]];
    const d = lattice[order[order[x0 + 1] + y0 + 1]];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };

  return (x: number, y: number) => {
    let total = 0;
    let amplitude = 0.5;
    let frequency = 1;
    for (let octave = 0; octave < 5; octave += 1) {
      total += amplitude * value(x * frequency, y * frequency);
      amplitude *= 0.5;
      frequency *= 2.03;
    }
    return total / 0.96875;
  };
}

/**
 * Bakes one nebula cloud as RGBA pixels, once per palette. The noise field
 * does not depend on the palette, so it is sampled once and coloured for
 * every palette given (both themes at the same cost as one). Pure math, no
 * DOM, so it can run in a worker; the pixels are identical either way.
 */
export function bakeNebula(
  seed: number,
  size: number,
  palettes: readonly NebulaPalette[],
): Uint8ClampedArray[] {
  const outputs = palettes.map(() => new Uint8ClampedArray(size * size * 4));
  const fbm = createNoise(seed);
  const scale = 2.2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      // Domain warping: the noise is sampled through itself, which pulls the
      // cloud into filaments instead of round blobs.
      const warpX = fbm(u * scale + 1.7, v * scale + 9.2);
      const warpY = fbm(u * scale + 8.3, v * scale + 2.8);
      const field = fbm(u * scale + warpX * 1.9, v * scale + warpY * 1.9);

      const dx = (u - 0.5) * 2;
      const dy = (v - 0.5) * 2;
      const falloff = 1 - smoothstep(0.42, 1, Math.sqrt(dx * dx + dy * dy));
      const density = Math.pow(smoothstep(0.4, 0.86, field), 1.35) * falloff;
      const hot = smoothstep(0.62, 0.92, field) * falloff;
      const blend = smoothstep(0.3, 0.72, warpX);

      const offset = (y * size + x) * 4;
      for (let index = 0; index < palettes.length; index += 1) {
        const palette = palettes[index];
        const data = outputs[index];
        for (let channel = 0; channel < 3; channel += 1) {
          const base =
            palette.low[channel] + (palette.high[channel] - palette.low[channel]) * blend;
          data[offset + channel] = base + (palette.core[channel] - base) * hot * 0.7;
        }
        data[offset + 3] = Math.round(255 * density * palette.strength);
      }
    }
  }

  return outputs;
}

/** Writes baked RGBA pixels into a canvas of matching size. */
export function putPixels(canvas: HTMLCanvasElement, pixels: Uint8ClampedArray) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const image = context.createImageData(canvas.width, canvas.height);
  image.data.set(pixels);
  context.putImageData(image, 0, 0);
}

const CONSTELLATIONS = 9;
const FIGURE_DEPTH = 0.5;
const LENS_RADIUS = 170;
const LENS_PUSH = 26;

type Meteor = { x: number; y: number; vx: number; vy: number; life: number; span: number };

export function createStarfield(count: number) {
  const random = mulberry(20261124);
  const starX = new Float32Array(count);
  const starY = new Float32Array(count);
  const depth = new Float32Array(count);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const rate = new Float32Array(count);
  const tint = new Uint8Array(count);
  const flare = new Uint8Array(count);

  for (let index = 0; index < count; index += 1) {
    starX[index] = random();
    starY[index] = random();
    const d = 0.16 + Math.pow(random(), 1.7) * 0.84;
    depth[index] = d;
    size[index] = 0.45 + d * 1.15 + (random() > 0.965 ? 0.9 : 0);
    phase[index] = random() * Math.PI * 2;
    rate[index] = 0.5 + random() * 1.9;
    tint[index] = Math.floor(random() * 5);
    flare[index] = random() > 0.975 ? 1 : 0;
  }

  // Constellations: a handful of small figures scattered down the field,
  // each a short chain of stars joined by hairlines.
  const figures: { x: number; y: number; points: Float32Array }[] = [];
  for (let index = 0; index < CONSTELLATIONS; index += 1) {
    const links = 4 + Math.floor(random() * 3);
    const points = new Float32Array(links * 2);
    let px = 0;
    let py = 0;
    let heading = random() * Math.PI * 2;
    for (let link = 0; link < links; link += 1) {
      points[link * 2] = px;
      points[link * 2 + 1] = py;
      heading += (random() - 0.5) * 2.1;
      const step = 46 + random() * 64;
      px += Math.cos(heading) * step;
      py += Math.sin(heading) * step;
    }
    figures.push({
      x: 0.06 + random() * 0.88,
      y: (index + 0.2 + random() * 0.6) / CONSTELLATIONS,
      points,
    });
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
  let theme: CosmosTheme = "dark";
  let time = 0;
  let lastScroll = 0;
  let velocity = 0;
  let leanX = 0;
  let leanY = 0;
  let targetLeanX = 0;
  let targetLeanY = 0;
  let lensX = 0;
  let lensY = 0;
  let lensActive = false;
  // Lens mode: a shader draws the stars, so this canvas keeps only the
  // constellations and meteors and bends them with the same lens.
  let lensMode = false;
  let skyLensX = 0;
  let skyLensY = 0;
  let skyTheta = 0;
  const bent = { x: 0, y: 0 };
  let burst = 0;
  let meteorClock = 3.5;
  const meteor: Meteor = { x: 0, y: 0, vx: 0, vy: 0, life: 0, span: 0 };

  return {
    resize(nextWidth: number, nextHeight: number, nextDpr: number) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
    },

    setTheme(nextTheme: CosmosTheme) {
      theme = nextTheme;
    },

    /** Pointer position as 0..1 across the viewport. */
    setPointer(x: number, y: number) {
      targetLeanX = x - 0.5;
      targetLeanY = y - 0.5;
      lensX = x * width;
      lensY = y * height;
      lensActive = true;
    },

    /** 0..1: how hard the field is still dropping out of warp. */
    setBurst(value: number) {
      burst = Math.min(1, Math.max(0, value));
    },

    setLensMode(enabled: boolean) {
      lensMode = enabled;
    },

    /** Lens position and Einstein radius in CSS px, for lens mode. */
    setLens(x: number, y: number, theta: number) {
      skyLensX = x;
      skyLensY = y;
      skyTheta = theta;
    },

    lean() {
      return { x: leanX, y: leanY };
    },

    render(
      context: CanvasRenderingContext2D,
      dtSeconds: number,
      scroll: number,
      frozen = false,
    ) {
      if (width === 0 || height === 0) return;

      const dt = frozen ? 0 : Math.min(0.05, Math.max(0, dtSeconds));
      time += dt;

      if (dt > 0) {
        const instant = (scroll - lastScroll) / dt;
        velocity += (instant - velocity) * (1 - Math.exp(-dt * 9));
        const follow = 1 - Math.exp(-dt * 3.2);
        leanX += (targetLeanX - leanX) * follow;
        leanY += (targetLeanY - leanY) * follow;
      } else {
        velocity = 0;
      }
      lastScroll = scroll;

      const colors = STAR_COLORS[theme];
      const gain = theme === "dark" ? 1 : 0.42;
      const field = height * 3;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      for (let index = 0; !lensMode && index < count; index += 1) {
        const d = depth[index];
        let y = (starY[index] * field - scroll * d * 0.34 - leanY * d * 22) % field;
        if (y < 0) y += field;
        y -= field / 3;
        if (y < -50 || y > height + 50) continue;

        let x = starX[index] * (width + 60) - 30 - leanX * d * 30;
        const twinkle = frozen
          ? 0.85
          : 0.68 + 0.32 * Math.sin(time * rate[index] + phase[index]);
        let alpha = (0.2 + d * 0.72) * twinkle * gain;

        // The cursor bends starlight: nearby stars slide outward into a
        // faint ring and brighten, the way a lens magnifies what is behind it.
        if (lensActive && !frozen) {
          const dx = x - lensX;
          const dy = y - lensY;
          const distance2 = dx * dx + dy * dy;
          if (distance2 < LENS_RADIUS * LENS_RADIUS) {
            const distance = Math.sqrt(distance2) + 0.001;
            const pull = 1 - distance / LENS_RADIUS;
            const push = (LENS_PUSH * pull * pull) / distance;
            x += dx * push;
            y += dy * push;
            alpha = Math.min(1, alpha * (1 + pull * 1.6));
          }
        }
        const radius = size[index];
        const color = colors[tint[index]];
        // Leaving the hero: every star is still a streak flying out of the
        // singularity, and they settle into points as the chapter arrives.
        if (burst > 0.02 && !frozen) {
          const bx = x - width * 0.7;
          const by = y - height * 0.42;
          const reach = Math.sqrt(bx * bx + by * by) + 0.001;
          const length = burst * burst * (5 + reach * 0.085) * d * d;
          context.strokeStyle = ink(color, alpha * 0.85);
          context.lineWidth = Math.max(0.7, radius);
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + (bx / reach) * length, y + (by / reach) * length);
          context.stroke();
          continue;
        }

        const stretch = Math.max(-62, Math.min(62, velocity * 0.0138 * d));

        if (Math.abs(stretch) > 1.4) {
          context.strokeStyle = ink(color, alpha * 0.9);
          context.lineWidth = Math.max(0.7, radius);
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x, y + stretch);
          context.stroke();
          continue;
        }

        context.fillStyle = ink(color, alpha);
        if (radius < 1) {
          context.fillRect(x, y, radius * 1.4, radius * 1.4);
        } else {
          context.beginPath();
          context.arc(x, y, radius * 0.75, 0, Math.PI * 2);
          context.fill();
        }

        if (flare[index] === 1) {
          const reach = radius * (4.5 + 2.4 * twinkle);
          context.strokeStyle = ink(color, alpha * 0.4);
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(x - reach, y);
          context.lineTo(x + reach, y);
          context.moveTo(x, y - reach);
          context.lineTo(x, y + reach);
          context.stroke();
        }
      }

      // Constellations sit at one middle depth and drift with the stars.
      // Where a point of the sky appears once the lens has bent its light:
      // the outer image of a point mass, r' = (r + sqrt(r^2 + 4 theta^2)) / 2.
      const bend = (px: number, py: number) => {
        bent.x = px;
        bent.y = py;
        if (!lensMode || skyTheta < 1) return bent;
        const dx = px - skyLensX;
        const dy = py - skyLensY;
        const r = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const image = (r + Math.sqrt(r * r + 4 * skyTheta * skyTheta)) / 2;
        bent.x = skyLensX + (dx / r) * image;
        bent.y = skyLensY + (dy / r) * image;
        return bent;
      };

      const figureInk = theme === "dark" ? "186 190 255" : "127 29 29";
      const figureGain = theme === "dark" ? 1 : 0.7;
      for (const figure of figures) {
        let fy = (figure.y * field - scroll * FIGURE_DEPTH * 0.34 - leanY * 11) % field;
        if (fy < 0) fy += field;
        fy -= field / 3;
        if (fy < -260 || fy > height + 260) continue;
        const fx = figure.x * width - leanX * 15;
        const points = figure.points;

        context.strokeStyle = ink(figureInk, 0.17 * figureGain);
        context.lineWidth = 0.8;
        context.beginPath();
        for (let offset = 0; offset < points.length; offset += 2) {
          const at = bend(fx + points[offset], fy + points[offset + 1]);
          if (offset === 0) context.moveTo(at.x, at.y);
          else context.lineTo(at.x, at.y);
        }
        context.stroke();

        for (let offset = 0; offset < points.length; offset += 2) {
          const pulse = frozen ? 0.8 : 0.72 + 0.28 * Math.sin(time * 1.3 + offset);
          context.fillStyle = ink(figureInk, 0.82 * pulse * figureGain);
          context.beginPath();
          const at = bend(fx + points[offset], fy + points[offset + 1]);
          context.arc(at.x, at.y, 1.5, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (frozen) return;

      meteorClock -= dt;
      if (meteorClock <= 0 && meteor.life <= 0) {
        meteorClock = 4.5 + random() * 6.5;
        meteor.x = width * (0.25 + random() * 0.7);
        meteor.y = height * (0.04 + random() * 0.4);
        const speed = 760 + random() * 380;
        const heading = Math.PI * (0.78 + random() * 0.12);
        meteor.vx = Math.cos(heading) * speed;
        meteor.vy = Math.sin(heading) * speed;
        meteor.span = 0.7 + random() * 0.35;
        meteor.life = meteor.span;
      }

      if (meteor.life > 0) {
        meteor.life -= dt;
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        const progress = 1 - meteor.life / meteor.span;
        const glow = Math.sin(Math.PI * Math.min(1, Math.max(0, progress)));
        const tailX = meteor.x - meteor.vx * 0.16;
        const tailY = meteor.y - meteor.vy * 0.16;
        const trail = context.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        const head = theme === "dark" ? "236 232 255" : "127 29 29";
        const tail = theme === "dark" ? "170 160 255" : "170 70 60";
        trail.addColorStop(0, `rgb(${head} / ${(0.9 * glow).toFixed(3)})`);
        trail.addColorStop(0.3, `rgb(${tail} / ${(0.4 * glow).toFixed(3)})`);
        trail.addColorStop(1, `rgb(${tail} / 0)`);
        context.strokeStyle = trail;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(meteor.x, meteor.y);
        context.lineTo(tailX, tailY);
        context.stroke();
      }
    },
  };
}

export type Starfield = ReturnType<typeof createStarfield>;
