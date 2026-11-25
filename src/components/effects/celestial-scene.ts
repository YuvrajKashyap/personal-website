/**
 * Celestial landmarks for the Home scroll.
 *
 * Worlds are real spheres: each has an equirectangular surface map that is
 * built once, then re-projected onto a lit sphere every frame at a new
 * rotation, so cloud bands and storms turn across the face and slip over the
 * terminator. Rings and the galaxy are painted once and left to CSS.
 */

import { createNoise, type CosmosTheme } from "@/components/effects/cosmos-scene";

type Rgb = readonly [number, number, number];

export type WorldKind = "giant" | "moon" | "ice" | "ember" | "jade";

type WorldStyle = Readonly<{
  stops: readonly Rgb[];
  rim: Rgb;
  storm?: Rgb;
  /** Cloud bands (gas giant) or blotchy terrain (rocky and icy bodies). */
  surface: "bands" | "terrain";
  ambient: number;
  seed: number;
}>;

const WORLD_STYLES: Record<string, Record<CosmosTheme, WorldStyle>> = {
  giant: {
    dark: {
      stops: [
        [44, 34, 110],
        [92, 70, 196],
        [150, 118, 240],
        [226, 176, 230],
        [120, 132, 236],
        [58, 52, 150],
      ],
      rim: [170, 190, 255],
      storm: [255, 196, 222],
      surface: "bands",
      ambient: 0.035,
      seed: 7,
    },
    light: {
      stops: [
        [150, 84, 70],
        [196, 132, 104],
        [226, 184, 150],
        [206, 142, 124],
        [170, 96, 84],
        [132, 62, 58],
      ],
      rim: [220, 150, 130],
      storm: [150, 46, 46],
      surface: "bands",
      ambient: 0.55,
      seed: 7,
    },
  },
  moon: {
    dark: {
      stops: [
        [58, 60, 104],
        [104, 108, 164],
        [168, 168, 214],
        [206, 202, 236],
        [132, 130, 190],
      ],
      rim: [190, 196, 255],
      surface: "terrain",
      ambient: 0.03,
      seed: 31,
    },
    light: {
      stops: [
        [166, 124, 108],
        [200, 164, 144],
        [226, 200, 180],
        [236, 218, 200],
        [190, 150, 132],
      ],
      rim: [226, 176, 156],
      surface: "terrain",
      ambient: 0.58,
      seed: 31,
    },
  },
  ice: {
    dark: {
      stops: [
        [18, 54, 110],
        [36, 104, 176],
        [84, 168, 226],
        [186, 232, 255],
        [70, 122, 214],
      ],
      rim: [150, 226, 255],
      surface: "terrain",
      ambient: 0.03,
      seed: 67,
    },
    light: {
      stops: [
        [150, 96, 88],
        [186, 134, 120],
        [214, 176, 160],
        [238, 220, 206],
        [176, 120, 110],
      ],
      rim: [214, 160, 150],
      surface: "terrain",
      ambient: 0.58,
      seed: 67,
    },
  },
};

/** A volcanic world: basalt crust split by glowing lava. */
WORLD_STYLES.ember = {
  dark: {
    stops: [
      [26, 10, 14],
      [70, 22, 20],
      [150, 46, 22],
      [255, 150, 60],
      [96, 30, 24],
    ],
    rim: [255, 150, 90],
    surface: "terrain",
    ambient: 0.1,
    seed: 97,
  },
  light: {
    stops: [
      [110, 44, 40],
      [150, 62, 50],
      [196, 100, 70],
      [232, 170, 120],
      [140, 56, 48],
    ],
    rim: [226, 140, 110],
    surface: "terrain",
    ambient: 0.58,
    seed: 97,
  },
};

/** A second gas giant in teal and jade, with its own storm. */
WORLD_STYLES.jade = {
  dark: {
    stops: [
      [14, 62, 82],
      [28, 124, 138],
      [96, 200, 190],
      [206, 244, 226],
      [52, 150, 170],
      [20, 78, 110],
    ],
    rim: [150, 255, 232],
    storm: [236, 255, 240],
    surface: "bands",
    ambient: 0.035,
    seed: 131,
  },
  light: {
    stops: [
      [136, 92, 76],
      [176, 130, 104],
      [212, 178, 148],
      [234, 212, 186],
      [190, 146, 118],
      [150, 100, 84],
    ],
    rim: [214, 170, 140],
    storm: [127, 29, 29],
    surface: "bands",
    ambient: 0.58,
    seed: 131,
  },
};

const MAP_WIDTH = 512;
const MAP_HEIGHT = 256;
const RING_TILT = -0.42;
const RING_SQUASH = 0.26;

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

/** Smooth 1D value noise, for ring lanes and band structure. */
function createBands(seed: number) {
  const random = mulberry(seed);
  const lattice = new Float32Array(512);
  for (let index = 0; index < 512; index += 1) lattice[index] = random();

  const sample = (x: number) => {
    const xi = Math.floor(x);
    const xf = x - xi;
    const u = xf * xf * (3 - 2 * xf);
    const a = lattice[xi & 511];
    const b = lattice[(xi + 1) & 511];
    return a + (b - a) * u;
  };

  return (x: number) =>
    sample(x) * 0.55 + sample(x * 2.3 + 17) * 0.28 + sample(x * 5.1 + 41) * 0.17;
}

function ramp(stops: readonly Rgb[], t: number, out: number[]) {
  const scaled = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const index = Math.floor(scaled);
  const mix = scaled - index;
  for (let channel = 0; channel < 3; channel += 1) {
    out[channel] =
      stops[index][channel] + (stops[index + 1][channel] - stops[index][channel]) * mix;
  }
}

/** Surface map, longitude across and latitude down, seamless at the wrap. */
function buildSurface(style: WorldStyle) {
  const map = new Uint8ClampedArray(MAP_WIDTH * MAP_HEIGHT * 3);
  const fbm = createNoise(style.seed);
  const bands = createBands(style.seed + 2);
  const color = [0, 0, 0];
  const terrain = style.surface === "terrain";
  const span = terrain ? 5.2 : 3.4;

  for (let row = 0; row < MAP_HEIGHT; row += 1) {
    const latitude = (row / MAP_HEIGHT - 0.5) * Math.PI;
    for (let col = 0; col < MAP_WIDTH; col += 1) {
      const u = col / MAP_WIDTH;
      // Crossfading two samples one period apart makes the map wrap cleanly.
      const y = latitude * (terrain ? 2.4 : 1.8) + 20;
      const field =
        fbm(u * span + 3, y) * (1 - u) + fbm((u - 1) * span + 3, y) * u;

      if (terrain) {
        const detail =
          fbm(u * span * 3 + 40, y * 3) * (1 - u) + fbm((u - 1) * span * 3 + 40, y * 3) * u;
        ramp(style.stops, smoothstep(0.3, 0.74, field * 0.72 + detail * 0.28), color);
        // Polar caps brighten toward the top stop.
        const cap = smoothstep(1.02, 1.4, Math.abs(latitude));
        const top = style.stops[style.stops.length - 2];
        for (let channel = 0; channel < 3; channel += 1) {
          color[channel] += (top[channel] - color[channel]) * cap * 0.8;
        }
      } else {
        ramp(style.stops, bands(latitude * 4.2 + (field - 0.5) * 1.5 + 60), color);
      }

      if (style.storm) {
        // One long-lived oval storm riding a southern band.
        let du = u - 0.32;
        if (du > 0.5) du -= 1;
        if (du < -0.5) du += 1;
        const dl = latitude + 0.34;
        const oval = (du * du) / (0.052 * 0.052) + (dl * dl) / (0.15 * 0.15);
        if (oval < 1.9) {
          const core = 1 - smoothstep(0.35, 1.9, oval);
          const eye = smoothstep(0.12, 0.5, oval);
          for (let channel = 0; channel < 3; channel += 1) {
            color[channel] += (style.storm[channel] - color[channel]) * core * eye * 0.85;
          }
        }
      }

      const offset = (row * MAP_WIDTH + col) * 3;
      map[offset] = color[0];
      map[offset + 1] = color[1];
      map[offset + 2] = color[2];
    }
  }

  return map;
}

/**
 * A lit sphere that can be redrawn at any rotation. Everything geometric is
 * worked out once per pixel; a frame is one pass of table lookups.
 */
export function createWorld(
  canvas: HTMLCanvasElement,
  kind: WorldKind,
  theme: CosmosTheme,
  radiusFraction: number,
) {
  const context = canvas.getContext("2d");
  if (!context) return null;

  const style = WORLD_STYLES[kind][theme];
  const map = buildSurface(style);
  const size = canvas.width;
  const center = size / 2;
  const radius = size * radiusFraction;
  const image = context.createImageData(size, size);
  const data = image.data;
  const tilt = kind === "giant" ? RING_TILT : kind === "jade" ? 0.3 : -0.28;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  // Light from the upper left, slightly toward the viewer.
  const lx = -0.6;
  const ly = -0.48;
  const lz = 0.64;

  const pixels: number[] = [];
  const rows: number[] = [];
  const longitudes: number[] = [];
  const lights: number[] = [];
  const rims: number[] = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x + 0.5 - center;
      const dy = y + 0.5 - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius + 1.5) continue;

      const nx = dx / radius;
      const ny = dy / radius;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      // Into the world's own frame: the spin axis leans with the tilt.
      const px = nx * cosT + ny * sinT;
      const py = Math.max(-1, Math.min(1, -nx * sinT + ny * cosT));
      const latitude = Math.asin(py);
      const longitude = Math.atan2(px, nz) / (Math.PI * 2);

      const diffuse = Math.max(0, nx * lx + ny * ly + nz * lz);
      const offset = (y * size + x) * 4;
      pixels.push(offset);
      rows.push(
        Math.min(MAP_HEIGHT - 1, Math.floor((latitude / Math.PI + 0.5) * MAP_HEIGHT)) *
          MAP_WIDTH,
      );
      longitudes.push(longitude);
      lights.push(style.ambient + (1 - style.ambient) * Math.pow(diffuse, 0.85));
      rims.push(Math.pow(1 - nz, 3) * diffuse * 0.9);
      data[offset + 3] = Math.round(
        255 * (1 - smoothstep(radius - 1.5, radius + 1.5, distance)),
      );
    }
  }

  const count = pixels.length;
  const pixel = Uint32Array.from(pixels);
  const row = Uint32Array.from(rows);
  const longitude = Float32Array.from(longitudes);
  const light = Float32Array.from(lights);
  const rim = Float32Array.from(rims);

  return {
    /** `turn` is rotations: 0.25 is a quarter of the way round. */
    draw(turn: number) {
      const shift = turn - Math.floor(turn) + 1;
      for (let index = 0; index < count; index += 1) {
        const u = longitude[index] + shift;
        const source = (row[index] + (Math.floor((u - Math.floor(u)) * MAP_WIDTH))) * 3;
        const target = pixel[index];
        const lit = light[index];
        const glow = rim[index];
        data[target] = map[source] * lit + style.rim[0] * glow;
        data[target + 1] = map[source + 1] * lit + style.rim[1] * glow;
        data[target + 2] = map[source + 2] * lit + style.rim[2] * glow;
      }
      context.putImageData(image, 0, 0);
    },
  };
}

const RING_COLOR: Record<CosmosTheme, Rgb> = {
  dark: [206, 196, 255],
  light: [150, 70, 62],
};

/**
 * Ring system for the gas giant, split so the far half can sit behind the
 * world and the near half in front of it. `radius` is the world's radius in
 * this canvas's pixels.
 */
export function paintRings(
  canvas: HTMLCanvasElement,
  theme: CosmosTheme,
  half: "back" | "front",
  radius: number,
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const size = canvas.width;
  const image = context.createImageData(size, size);
  const data = image.data;
  const center = size / 2;
  const cosT = Math.cos(RING_TILT);
  const sinT = Math.sin(RING_TILT);
  const inner = radius * 1.34;
  const outer = radius * 1.96;
  const lanes = createBands(53);
  const color = RING_COLOR[theme];
  const strength = theme === "dark" ? 0.64 : 0.5;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const rx = dx * cosT + dy * sinT;
      const ry = -dx * sinT + dy * cosT;
      if (half === "front" ? ry <= 0 : ry > 0) continue;

      const distance = Math.sqrt(rx * rx + (ry / RING_SQUASH) * (ry / RING_SQUASH));
      if (distance <= inner || distance >= outer) continue;

      const t = (distance - inner) / (outer - inner);
      const gap = 1 - smoothstep(0.02, 0, Math.abs(t - 0.58) - 0.025);
      const edge = smoothstep(0, 0.06, t) * (1 - smoothstep(0.9, 1, t));
      // The world throws a shadow across the rings on its night side.
      const shadow = rx > 0 && Math.abs(ry / RING_SQUASH) < radius * 0.96 ? 0.16 : 1;
      const density = (0.25 + lanes(t * 26) * 0.75) * gap * edge * shadow;

      const offset = (y * size + x) * 4;
      data[offset] = color[0];
      data[offset + 1] = color[1];
      data[offset + 2] = color[2];
      data[offset + 3] = Math.round(255 * density * strength);
    }
  }

  context.putImageData(image, 0, 0);
}

/**
 * Face-on spiral galaxy: a warm core, two main arms and two faint ones laid
 * down as thousands of additive points along logarithmic spirals. CSS tilts
 * and slowly rotates it.
 */
export function paintGalaxy(canvas: HTMLCanvasElement, theme: CosmosTheme) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const size = canvas.width;
  const center = size / 2;
  const reach = size * 0.46;
  const random = mulberry(404);
  const dark = theme === "dark";

  context.clearRect(0, 0, size, size);
  context.globalCompositeOperation = dark ? "lighter" : "source-over";

  const halo = context.createRadialGradient(center, center, 0, center, center, reach);
  if (dark) {
    halo.addColorStop(0, "rgb(255 232 208 / 0.5)");
    halo.addColorStop(0.08, "rgb(214 176 255 / 0.22)");
    halo.addColorStop(0.4, "rgb(96 108 255 / 0.06)");
    halo.addColorStop(1, "rgb(60 70 200 / 0)");
  } else {
    halo.addColorStop(0, "rgb(127 29 29 / 0.3)");
    halo.addColorStop(0.1, "rgb(170 70 60 / 0.12)");
    halo.addColorStop(0.45, "rgb(190 110 90 / 0.04)");
    halo.addColorStop(1, "rgb(190 110 90 / 0)");
  }
  context.fillStyle = halo;
  context.fillRect(0, 0, size, size);

  const gaussian = () => (random() + random() + random() - 1.5) / 1.5;

  const scatter = (count: number, arms: number, armPhase: number, weight: number) => {
    for (let index = 0; index < count; index += 1) {
      const t = Math.pow(random(), 0.62);
      const arm = index % arms;
      const spread = 0.16 + t * 0.34;
      const angle =
        3.3 * Math.log(1 + 5.5 * t) +
        (arm * Math.PI * 2) / arms +
        armPhase +
        gaussian() * spread;
      const distance = t * reach * (1 + gaussian() * 0.05);
      const x = center + Math.cos(angle) * distance;
      const y = center + Math.sin(angle) * distance;
      const fade = (1 - t * 0.72) * weight;
      const roll = random();

      let color: string;
      if (!dark) color = roll > 0.86 ? "127 29 29" : "96 50 40";
      else if (t < 0.16) color = "255 232 206";
      else if (roll > 0.93) color = "255 150 214";
      else if (roll > 0.5) color = "150 172 255";
      else color = "196 170 255";

      const dot = 0.4 + random() * (roll > 0.97 ? 1.7 : 0.9);
      context.fillStyle = `rgb(${color} / ${((0.1 + random() * 0.42) * fade).toFixed(3)})`;
      context.beginPath();
      context.arc(x, y, dot, 0, Math.PI * 2);
      context.fill();

      // Soft dust around a fraction of the stars gives the arms their body.
      if (index % 11 === 0) {
        const cloud = 8 + random() * 22;
        const haze = context.createRadialGradient(x, y, 0, x, y, cloud);
        haze.addColorStop(0, `rgb(${color} / ${(0.05 * fade).toFixed(3)})`);
        haze.addColorStop(1, `rgb(${color} / 0)`);
        context.fillStyle = haze;
        context.fillRect(x - cloud, y - cloud, cloud * 2, cloud * 2);
      }
    }
  };

  scatter(5200, 2, 0, 1);
  scatter(1700, 2, Math.PI / 2, 0.5);
  context.globalCompositeOperation = "source-over";
}

/**
 * Comet: a bright coma, a straight blue ion tail and a broad, curved dust
 * tail fanning away from it. Painted once; CSS carries it across the sky.
 */
export function paintComet(canvas: HTMLCanvasElement, theme: CosmosTheme) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;
  const random = mulberry(1986);
  const dark = theme === "dark";
  const headX = width * 0.86;
  const headY = height * 0.26;

  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = dark ? "lighter" : "source-over";

  // Ion tail: thin, straight, pointing directly away.
  const ion = context.createLinearGradient(headX, headY, width * 0.06, height * 0.5);
  ion.addColorStop(0, dark ? "rgb(150 214 255 / 0.5)" : "rgb(127 29 29 / 0.3)");
  ion.addColorStop(1, dark ? "rgb(110 150 255 / 0)" : "rgb(127 29 29 / 0)");
  context.strokeStyle = ion;
  context.lineCap = "round";
  for (let strand = 0; strand < 5; strand += 1) {
    context.lineWidth = 1 + strand * 0.7;
    context.globalAlpha = 0.5 - strand * 0.08;
    context.beginPath();
    context.moveTo(headX, headY);
    context.lineTo(width * 0.06, height * (0.5 + (strand - 2) * 0.012));
    context.stroke();
  }
  context.globalAlpha = 1;

  // Dust tail: thousands of grains along a curve that bends as it spreads.
  for (let index = 0; index < 5200; index += 1) {
    const t = Math.pow(random(), 0.75);
    const spread = (random() - 0.5) * (0.04 + t * 0.42);
    const x = headX - t * width * 0.78;
    const y = headY + t * t * height * 0.56 + spread * height * (0.2 + t);
    const fade = (1 - t) * (1 - Math.abs(spread) * 1.6);
    if (fade <= 0) continue;
    const warm = random() > 0.4;
    const color = dark
      ? warm
        ? "255 232 206"
        : "206 196 255"
      : warm
        ? "150 70 60"
        : "127 29 29";
    context.fillStyle = `rgb(${color} / ${(fade * (0.05 + random() * 0.2)).toFixed(3)})`;
    const dot = 0.5 + random() * 1.2;
    context.fillRect(x, y, dot, dot);
  }

  const coma = context.createRadialGradient(headX, headY, 0, headX, headY, height * 0.2);
  if (dark) {
    coma.addColorStop(0, "rgb(255 255 255 / 1)");
    coma.addColorStop(0.12, "rgb(214 240 255 / 0.7)");
    coma.addColorStop(0.45, "rgb(130 190 255 / 0.16)");
    coma.addColorStop(1, "rgb(110 150 255 / 0)");
  } else {
    coma.addColorStop(0, "rgb(127 29 29 / 0.9)");
    coma.addColorStop(0.2, "rgb(170 70 60 / 0.35)");
    coma.addColorStop(1, "rgb(190 110 90 / 0)");
  }
  context.fillStyle = coma;
  context.beginPath();
  context.arc(headX, headY, height * 0.2, 0, Math.PI * 2);
  context.fill();
  context.globalCompositeOperation = "source-over";
}
