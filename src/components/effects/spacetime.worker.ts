/// <reference lib="webworker" />

import { createSpacetimeScene, type SpacetimeScene } from "@/components/effects/spacetime-scene";
import type {
  SpacetimeWorkerRequest,
  SpacetimeWorkerResponse,
} from "@/components/effects/spacetime-worker-protocol";

/**
 * Runs a SpacetimeField's scene off the page. The scene code is the same
 * module the page would run; here it paints the star's surface itself, at the
 * exact time of each frame. Every frame is drawn into this worker's own canvas
 * and handed back as a bitmap for the page to put on screen.
 */
const scope = self as unknown as DedicatedWorkerGlobalScope;

let canvas: OffscreenCanvas | null = null;
let context: CanvasRenderingContext2D | null = null;
let scene: SpacetimeScene | null = null;

function reply(message: SpacetimeWorkerResponse, transfer: Transferable[] = []) {
  scope.postMessage(message, transfer);
}

scope.onmessage = (event: MessageEvent<SpacetimeWorkerRequest>) => {
  const message = event.data;
  if (message.type === "init") {
    canvas = new OffscreenCanvas(1, 1);
    // Same drawing API as the page's canvas context.
    context = canvas.getContext("2d") as unknown as CanvasRenderingContext2D | null;
    if (!context) {
      reply({ type: "failed" });
      return;
    }
    scene = createSpacetimeScene(message.variant);
    return;
  }
  if (!canvas || !context || !scene) return;

  switch (message.type) {
    case "resize":
      canvas.width = Math.round(message.width * message.dpr);
      canvas.height = Math.round(message.height * message.dpr);
      scene.resize(message.width, message.height, message.dpr);
      break;
    case "palette":
      scene.setPalette(message.palette, message.light);
      break;
    case "hole":
      scene.setCursorHole(message.enabled);
      break;
    case "pulse":
      scene.pulse(message.x, message.y);
      break;
    case "frame": {
      scene.setScroll(message.scroll);
      scene.setPointer(message.pointerX, message.pointerY, message.pointerActive);
      scene.render(context, message.dt, message.frozen);
      if (canvas.width === 0 || canvas.height === 0) {
        reply({ type: "drawn", frame: null });
        break;
      }
      // Handing the frame over blanks this canvas, but the page's canvas keeps
      // its pixels between frames. That matters at fractional sizes, where the
      // scene's per-frame clear only half-covers the last column and row,
      // which keep a trace of earlier frames. So the frame is put straight
      // back, pixel for pixel, before it is sent: a draw on the GPU, where
      // copying it out with createImageBitmap would stall on a read-back.
      const frame = canvas.transferToImageBitmap();
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "copy";
      context.filter = "none";
      context.shadowColor = "transparent";
      context.drawImage(frame, 0, 0);
      context.restore();
      reply({ type: "drawn", frame }, [frame]);
      break;
    }
  }
};
