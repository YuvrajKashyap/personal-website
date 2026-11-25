/**
 * Pixel bakes for the Home sky: the heavy, one-off math behind the nebula
 * clouds, the worlds and the gas giant's rings. Each job is pure (numbers in,
 * typed arrays out), so the same function runs in the bake worker or, as a
 * fallback, on the main thread, and the pixels are identical either way.
 * Sprite jobs (the galaxy and the comet) paint on an OffscreenCanvas and come
 * back as an ImageBitmap the page copies 1:1.
 */

import {
  bakeRings,
  bakeWorld,
  paintComet,
  paintGalaxy,
  type WorldBake,
  type WorldKind,
} from "@/components/effects/celestial-scene";
import {
  bakeNebula,
  NEBULA_PALETTES,
  type CosmosTheme,
} from "@/components/effects/cosmos-scene";

export type NebulaJob = Readonly<{ type: "nebula"; seed: number; index: number; size: number }>;
export type WorldJob = Readonly<{
  type: "world";
  kind: WorldKind;
  theme: CosmosTheme;
  size: number;
  radius: number;
}>;
export type RingsJob = Readonly<{
  type: "rings";
  theme: CosmosTheme;
  half: "back" | "front";
  size: number;
  radius: number;
}>;

export type SpriteJob = Readonly<{
  type: "sprite";
  kind: "galaxy" | "comet";
  theme: CosmosTheme;
  width: number;
  height: number;
}>;

export type BakeJob = NebulaJob | WorldJob | RingsJob | SpriteJob;

/** A nebula bake carries both themes: the costly noise field is shared. */
export type NebulaBake = Readonly<Record<CosmosTheme, Uint8ClampedArray>>;

export type BakeResult<J extends BakeJob> = J extends NebulaJob
  ? NebulaBake
  : J extends WorldJob
    ? WorldBake
    : J extends SpriteJob
      ? ImageBitmap
      : Uint8ClampedArray;

export function bakeKey(job: BakeJob): string {
  switch (job.type) {
    case "nebula":
      return `nebula:${job.seed}:${job.index}:${job.size}`;
    case "world":
      return `world:${job.kind}:${job.theme}:${job.size}:${job.radius}`;
    case "rings":
      return `rings:${job.theme}:${job.half}:${job.size}:${job.radius}`;
    case "sprite":
      return `sprite:${job.kind}:${job.theme}:${job.width}x${job.height}`;
  }
}

export function runBake<J extends BakeJob>(job: J): BakeResult<J> {
  switch (job.type) {
    case "nebula": {
      const [dark, light] = bakeNebula(job.seed, job.size, [
        NEBULA_PALETTES.dark[job.index],
        NEBULA_PALETTES.light[job.index],
      ]);
      return { dark, light } as BakeResult<J>;
    }
    case "world":
      return bakeWorld(job.kind, job.theme, job.size, job.radius) as BakeResult<J>;
    case "rings":
      return bakeRings(job.size, job.theme, job.half, job.radius) as BakeResult<J>;
    case "sprite": {
      // Throws where OffscreenCanvas is missing; the caller then paints the
      // page canvas directly, as it always did.
      const canvas = new OffscreenCanvas(job.width, job.height);
      (job.kind === "galaxy" ? paintGalaxy : paintComet)(canvas, job.theme);
      return canvas.transferToImageBitmap() as BakeResult<J>;
    }
  }
  throw new Error("Unknown bake job");
}

/** The buffers in a result, so the worker can hand them over without a copy. */
export function bakeTransfers(result: unknown): Transferable[] {
  if (typeof ImageBitmap !== "undefined" && result instanceof ImageBitmap) return [result];
  if (ArrayBuffer.isView(result)) return [result.buffer as ArrayBuffer];
  if (result && typeof result === "object") {
    return Object.values(result).flatMap((value) =>
      ArrayBuffer.isView(value) ? [value.buffer as ArrayBuffer] : [],
    );
  }
  return [];
}
