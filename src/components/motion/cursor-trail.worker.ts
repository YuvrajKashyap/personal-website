import { createCursorTrailScene } from "./cursor-trail-scene";
import type {
  CursorTrailWorkerMessage,
  CursorTrailWorkerResponse,
} from "./cursor-trail-worker-protocol";
import {
  createFrameLoop,
  translateFrameTime,
} from "../../lib/performance/animation-runtime";

let scene: ReturnType<typeof createCursorTrailScene> | null = null;
let pageTimeOrigin = 0;
let autonomousLoop: ReturnType<typeof createFrameLoop> | null = null;

type AnimationWorkerScope = typeof self & {
  requestAnimationFrame?: (callback: (time: number) => void) => number;
  cancelAnimationFrame?: (frame: number) => void;
};

const animationScope = self as AnimationWorkerScope;

self.onmessage = (event: MessageEvent<CursorTrailWorkerMessage>) => {
  const message = event.data;
  if (message.type === "init") {
    const context = message.canvas.getContext("2d");
    if (!context) return;
    scene = createCursorTrailScene(context);
    scene.resize(message.width, message.height, message.dpr);
    pageTimeOrigin = message.timeOrigin;

    const requestFrame = animationScope.requestAnimationFrame?.bind(animationScope);
    const cancelFrame = animationScope.cancelAnimationFrame?.bind(animationScope);
    if (requestFrame && cancelFrame) {
      autonomousLoop = createFrameLoop(requestFrame, cancelFrame, (time) =>
        scene?.renderFrame(
          translateFrameTime(time, performance.timeOrigin, pageTimeOrigin),
        ) ?? false,
      );
    }

    self.postMessage({
      type: "ready",
      autonomous: autonomousLoop !== null,
    } satisfies CursorTrailWorkerResponse);
    return;
  }
  if (!scene) return;

  switch (message.type) {
    case "resize":
      scene.resize(message.width, message.height, message.dpr);
      break;
    case "point":
      scene.pushPoint(message.x, message.y, message.time);
      autonomousLoop?.start();
      break;
    case "frame":
      if (!autonomousLoop) {
        self.postMessage({
          type: "rendered",
          active: scene.renderFrame(message.time),
        } satisfies CursorTrailWorkerResponse);
      }
      break;
  }
};
