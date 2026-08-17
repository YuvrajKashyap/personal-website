export type CursorTrailWorkerMessage =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      width: number;
      height: number;
      dpr: number;
      timeOrigin: number;
    }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "point"; x: number; y: number; time: number }
  | { type: "frame"; time: number };

export type CursorTrailWorkerResponse =
  | { type: "ready"; autonomous: boolean }
  | { type: "rendered"; active: boolean };
