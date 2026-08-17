import type { MailRoutesPalette } from "./mail-routes-scene";

export type MailRoutesWorkerMessage =
  | {
      type: "init";
      canvas: OffscreenCanvas;
      width: number;
      height: number;
      dpr: number;
      palette: MailRoutesPalette;
      timeOrigin: number;
    }
  | { type: "resize"; width: number; height: number; dpr: number }
  | { type: "frame"; time: number }
  | { type: "pointer"; x: number; y: number }
  | { type: "palette"; palette: MailRoutesPalette }
  | { type: "opened" }
  | { type: "sent" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "reset-timing" };

export type MailRoutesWorkerResponse =
  | { type: "ready"; autonomous: boolean }
  | { type: "rendered" };
