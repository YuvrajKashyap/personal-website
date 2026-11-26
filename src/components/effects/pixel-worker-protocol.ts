import type { CosmosTheme } from "@/components/effects/cosmos-scene";
import type { WorldBake, WorldKind } from "@/components/effects/celestial-scene";
import type { StarRgb } from "@/components/effects/star-surface";

/** Pixel buffers travel between threads, so they always own a plain ArrayBuffer. */
export type PixelBuffer = Uint8ClampedArray<ArrayBuffer>;

/**
 * Messages for the pixel worker, which runs the per-frame pixel loops (the
 * hologram star's surface, the turning worlds) so the page only has to copy
 * the finished pixels onto its canvases.
 */
export type PixelWorkerRequest =
  | {
      type: "star";
      id: number;
      t: number;
      core: StarRgb;
      mid: StarRgb;
      edge: StarRgb;
      /** A buffer handed back for reuse, if there is one. */
      buffer?: PixelBuffer;
    }
  | { type: "world-add"; world: number; kind: WorldKind; theme: CosmosTheme; bake: WorldBake }
  | { type: "world"; id: number; world: number; turn: number; buffer?: PixelBuffer }
  | { type: "world-remove"; world: number };

export type PixelWorkerResponse = { id: number; buffer: PixelBuffer };
