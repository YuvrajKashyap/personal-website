/**
 * The hologram star's living surface: a rotating, spotted photosphere with
 * plasma wisps and flares off the limb, worked out pixel by pixel.
 *
 * Pure math over a pixel buffer (no DOM), so the spacetime scene can run it
 * on the page or hand it to a worker; both produce the same bytes for the
 * same time and colors.
 */

import { createNoise } from "@/components/effects/cosmos-scene";

export const STAR_SIZE = 184;
/** Share of the star canvas the disc itself fills; the rest is plasma. */
export const STAR_DISC = 0.56;
export const STAR_FLARES = 4;
/** Seconds between eruptions. */
export const ERUPTION_PERIOD = 12.5;

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export type StarRgb = readonly number[];

function buildGeometry() {
  const pixels: number[] = [];
  const longitudes: number[] = [];
  const latitudes: number[] = [];
  const limbs: number[] = [];
  const radii: number[] = [];
  const dirXs: number[] = [];
  const dirYs: number[] = [];
  const half = STAR_SIZE / 2;
  const disc = half * STAR_DISC;
  for (let y = 0; y < STAR_SIZE; y += 1) {
    for (let x = 0; x < STAR_SIZE; x += 1) {
      const nx = (x + 0.5 - half) / disc;
      const ny = (y + 0.5 - half) / disc;
      const r = Math.sqrt(nx * nx + ny * ny);
      if (r > 1 / STAR_DISC) continue;
      const clamped = Math.min(1, r);
      const sx = r > 1 ? nx / r : nx;
      const sy = r > 1 ? ny / r : ny;
      const mu = Math.sqrt(Math.max(0, 1 - clamped * clamped));
      pixels.push((y * STAR_SIZE + x) * 4);
      // True sphere coordinates, so features foreshorten toward the limb
      // and rotate across the face.
      longitudes.push(Math.atan2(sx, mu + 0.0001));
      latitudes.push(Math.asin(Math.max(-1, Math.min(1, sy))));
      limbs.push(0.6 + 0.4 * Math.pow(mu, 0.6));
      radii.push(r);
      dirXs.push(r > 0.0001 ? nx / r : 0);
      dirYs.push(r > 0.0001 ? ny / r : 0);
    }
  }
  return {
    pixel: Uint32Array.from(pixels),
    u: Float32Array.from(longitudes),
    v: Float32Array.from(latitudes),
    limb: Float32Array.from(limbs),
    rad: Float32Array.from(radii),
    dirX: Float32Array.from(dirXs),
    dirY: Float32Array.from(dirYs),
  };
}

/** One painter per star; it keeps its own noise and flare state. */
export function createStarSurfacePainter() {
  const starNoise = createNoise(909);
  const starFlares = Array.from({ length: STAR_FLARES }, () => ({
    dirX: 1,
    dirY: 0,
    height: 0.2,
    width: 0.15,
    strength: 0,
    seed: 0,
    eruption: false,
  }));
  let geometry: ReturnType<typeof buildGeometry> | null = null;

  return {
    /**
     * Writes the surface at time `t` (seconds) into `data`, an RGBA buffer of
     * STAR_SIZE x STAR_SIZE. Only the pixels inside the star's reach are
     * written; the rest are left as they are (transparent in a fresh buffer).
     */
    paint(
      data: Uint8ClampedArray,
      t: number,
      starCore: StarRgb,
      starMid: StarRgb,
      starEdge: StarRgb,
    ) {
      if (!geometry) geometry = buildGeometry();
      const { pixel, u, v, limb, rad, dirX, dirY } = geometry;
      const turn = t * 0.05;
      const reach = 1 / STAR_DISC - 1;

      // Flares live for one cycle each at a fresh spot on the limb. Three are
      // loop prominences (arches of plasma held up by the magnetic field) and
      // one is an eruption that sprays straight out and breaks apart.
      for (let slot = 0; slot < STAR_FLARES; slot += 1) {
        const flare = starFlares[slot];
        const eruption = slot === STAR_FLARES - 1;
        const period = eruption ? ERUPTION_PERIOD : 8.5 + slot * 2.9;
        const clock = (t + slot * 4.1) / period;
        const cycle = Math.floor(clock);
        const phase = clock - cycle;
        const hashA = Math.sin((cycle + 1) * 78.233 + slot * 37.719) * 43758.5453;
        const hashB = Math.sin((cycle + 5) * 12.9898 + slot * 91.7) * 24634.6345;
        const hashC = Math.sin((cycle + 9) * 45.164 + slot * 17.31) * 13758.1453;
        const angle = (hashA - Math.floor(hashA)) * Math.PI * 2;
        const tall = hashB - Math.floor(hashB);
        const wide = hashC - Math.floor(hashC);
        flare.dirX = Math.cos(angle);
        flare.dirY = Math.sin(angle);
        flare.seed = slot * 31.7 + (cycle % 97) * 3.3;
        flare.eruption = eruption;
        if (eruption) {
          const active = Math.min(1, phase / 0.55);
          flare.height = 0.2 + 0.54 * active;
          flare.width = 0.06;
          flare.strength =
            phase < 0.55 ? smoothstep(0, 0.1, active) * Math.pow(1 - active, 1.1) * 1.25 : 0;
        } else {
          // Rises quickly, hangs, then drains back down.
          const rise = smoothstep(0, 0.3, phase) * (1 - 0.35 * smoothstep(0.7, 1, phase));
          flare.height = (0.3 + 0.36 * tall) * (0.25 + 0.75 * rise);
          flare.width = 0.16 + 0.16 * wide;
          flare.strength = Math.pow(Math.sin(Math.PI * phase), 0.75);
        }
      }

      for (let index = 0; index < pixel.length; index += 1) {
        const r = rad[index];
        const ex = dirX[index];
        const ey = dirY[index];
        // The limb is not a clean circle: it boils in and out a few percent.
        const rim = 1 + 0.07 * (starNoise(ex * 3.3 + 12, ey * 3.3 + 12 + t * 0.2) - 0.5);
        const inside = 1 - smoothstep(rim - 0.07, rim + 0.03, r);

        let red = 0;
        let green = 0;
        let blue = 0;

        if (inside > 0.002) {
          const lon = u[index] + turn;
          const lat = v[index];
          const cells = starNoise(lon * 2.4 + t * 0.04 + 20, lat * 2.4 - t * 0.05 + 20);
          const grain = starNoise(lon * 9.5 - t * 0.21 + 51, lat * 9.5 + t * 0.17 + 45);
          // Ridged noise draws the bright lanes between convection cells.
          const lanes = 1 - Math.abs(2 * grain - 1);
          const patch = starNoise(lon * 1.5 + 70, lat * 2.3 + 30);
          const band = 1 - smoothstep(0.55, 0.95, Math.abs(lat));
          // Sunspots, and the hot bright plage that crowds around them.
          const spot = smoothstep(0.66, 0.76, patch) * band;
          const plage = smoothstep(0.52, 0.64, patch) * (1 - spot) * band;
          const heat = Math.min(
            1.2,
            Math.max(
              0,
              (cells * 0.72 + lanes * 0.52 + grain * 0.2 - 0.36) * limb[index] * (1 - 0.72 * spot) +
                plage * (0.1 + lanes * 0.26),
            ),
          );
          for (let channel = 0; channel < 3; channel += 1) {
            let value: number;
            if (heat < 0.5) {
              const h = heat * 2;
              value =
                starEdge[channel] * (0.3 + 0.7 * h) + (starMid[channel] - starEdge[channel]) * h;
            } else if (heat < 1) {
              value = starMid[channel] + (starCore[channel] - starMid[channel]) * (heat - 0.5) * 2;
            } else {
              value = starCore[channel] + (255 - starCore[channel]) * (heat - 1) * 4;
            }
            if (channel === 0) red = value;
            else if (channel === 1) green = value;
            else blue = value;
          }
        }

        let glow = 0;
        if (inside < 0.998) {
          // Plasma streaming off the surface: wisps that thin out with height
          // and drift outward over time.
          const lift = Math.max(0, r - rim + 0.06);
          const flow = lift * 2.6 - t * 0.28;
          const broad = starNoise(ex * 2.2 + flow * 0.8 + 50, ey * 2.2 + flow * 0.6 + 50);
          const fine = starNoise(ex * 6.4 - flow * 1.3 + 90, ey * 6.4 + flow * 1.1 + 90);
          const wisp = broad * broad * (0.45 + fine * 1.1);
          const falloff = Math.exp(-lift * 4.2) * (1 - smoothstep(reach * 0.7, reach, lift));
          glow = Math.min(1, falloff * (0.16 + wisp * 2.3));
        }

        let fire = 0;
        if (r > 0.9 && inside < 0.998) {
          const px = ex * r;
          const py = ey * r;
          for (let slot = 0; slot < STAR_FLARES; slot += 1) {
            const flare = starFlares[slot];
            if (flare.strength < 0.01) continue;
            // Flare-local frame: `along` runs across the limb, `up` away from it.
            const relX = px - flare.dirX * 0.95;
            const relY = py - flare.dirY * 0.95;
            const up = relX * flare.dirX + relY * flare.dirY;
            const along = -relX * flare.dirY + relY * flare.dirX;
            if (up < -0.04 || up > flare.height + 0.2) continue;

            if (flare.eruption) {
              if (up > flare.height) continue;
              // A fan that widens with height and shreds into clumps.
              const spread = flare.width + up * 0.44;
              if (along > spread * 2.4 || along < -spread * 2.4) continue;
              const column = Math.exp(-(along * along) / (spread * spread));
              const coarse = starNoise(along * 8 + flare.seed, up * 5.5 - t * 1.7 + flare.seed);
              const shred = starNoise(along * 19 + 3, up * 13 - t * 3.1 + flare.seed);
              const fade = Math.pow(1 - up / flare.height, 0.7);
              fire +=
                column * fade * (0.2 + coarse * coarse * 2.5 + shred * 0.55) * flare.strength;
              continue;
            }

            if (along > flare.width + 0.2 || along < -flare.width - 0.2) continue;
            const qa = along / flare.width;
            const qb = Math.max(0, up) / flare.height;
            const q = Math.sqrt(qa * qa + qb * qb);
            const span = Math.min(flare.width, flare.height);
            const arc = Math.atan2(qb, qa);
            // Plasma runs along the arch, so the texture slides with time.
            const knots = starNoise(arc * 3.4 + flare.seed + t * 0.8, q * 5 + flare.seed);
            const braid = starNoise(arc * 8.5 - t * 1.3 + flare.seed, q * 11 + 7);
            const outer = Math.abs(q - 1) * span;
            const outerWidth = 0.02 + 0.05 * knots * knots;
            const inner = Math.abs(q - 0.76 - 0.07 * Math.sin(arc * 3 + flare.seed)) * span;
            // The faint curtain of cooler plasma hanging inside the loop.
            const curtain = q < 1 ? 0.3 * (0.2 + knots) * smoothstep(0.2, 1, q) : 0;
            fire +=
              (Math.exp(-(outer * outer) / (outerWidth * outerWidth)) * (0.35 + knots * 1.5) +
                Math.exp(-(inner * inner) / 0.0007) * (0.1 + braid * braid * 1.6) * 0.8 +
                curtain * (0.5 + braid * 0.7)) *
              flare.strength;
          }
          fire = Math.min(1.6, fire);
        }

        const outside = 1 - inside;
        const target = pixel[index];
        // Thin plasma is deep red, dense plasma runs through orange to white.
        const hot = Math.min(1, glow * 1.5 + fire * 1.1);
        const white = Math.max(0, Math.min(1, fire * 1.15 - 0.6));
        for (let channel = 0; channel < 3; channel += 1) {
          let plasma = starEdge[channel] + (starMid[channel] - starEdge[channel]) * hot;
          plasma += (starCore[channel] - plasma) * white;
          const surface = channel === 0 ? red : channel === 1 ? green : blue;
          data[target + channel] = surface * inside + plasma * outside;
        }
        data[target + 3] = Math.round(
          255 * Math.min(1, inside + Math.min(1, glow + fire) * outside),
        );
      }
    },
  };
}
