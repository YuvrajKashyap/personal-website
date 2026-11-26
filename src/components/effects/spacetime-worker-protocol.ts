/**
 * Messages between SpacetimeField (the page) and spacetime.worker.ts, which
 * runs the whole scene off the page. The page still works out every input
 * (scroll, pointer, palette, size) exactly as before and sends them with each
 * frame, so the scene sees the same calls in the same order on either thread.
 * The worker draws into its own canvas and hands back the finished frame,
 * which the page copies pixel for pixel onto the canvas in the document.
 */

import type {
  SpacetimePalette,
  SpacetimeVariant,
} from "@/components/effects/spacetime-scene";

export type SpacetimeFrame = {
  type: "frame";
  dt: number;
  frozen: boolean;
  scroll: number;
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
};

export type SpacetimeWorkerRequest =
  | { type: "init"; variant: SpacetimeVariant }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "palette"; palette: SpacetimePalette; light: boolean }
  | { type: "hole"; enabled: boolean }
  | { type: "pulse"; x: number; y: number }
  | SpacetimeFrame;

export type SpacetimeWorkerResponse =
  | { type: "drawn"; frame: ImageBitmap | null }
  | { type: "failed" };
