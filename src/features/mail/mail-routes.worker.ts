import { createMailRoutesScene } from "./mail-routes-scene";
import type {
  MailRoutesWorkerMessage,
  MailRoutesWorkerResponse,
} from "./mail-routes-worker-protocol";
import {
  createFrameLoop,
  translateFrameTime,
} from "../../lib/performance/animation-runtime";

let scene: ReturnType<typeof createMailRoutesScene> | null = null;
let pageTimeOrigin = 0;
let running = true;
let autonomousLoop: ReturnType<typeof createFrameLoop> | null = null;

type AnimationWorkerScope = typeof self & {
  requestAnimationFrame?: (callback: (time: number) => void) => number;
  cancelAnimationFrame?: (frame: number) => void;
};

const animationScope = self as AnimationWorkerScope;

self.onmessage = (event: MessageEvent<MailRoutesWorkerMessage>) => {
  const message = event.data;

  if (message.type === "init") {
    const context = message.canvas.getContext("2d");
    if (!context) return;
    scene = createMailRoutesScene(context);
    scene.setPalette(message.palette);
    scene.resize(message.width, message.height, message.dpr);
    pageTimeOrigin = message.timeOrigin;

    const requestFrame = animationScope.requestAnimationFrame?.bind(animationScope);
    const cancelFrame = animationScope.cancelAnimationFrame?.bind(animationScope);
    if (requestFrame && cancelFrame) {
      autonomousLoop = createFrameLoop(requestFrame, cancelFrame, (time) => {
        if (!scene || !running) return false;
        scene.renderFrame(
          translateFrameTime(time, performance.timeOrigin, pageTimeOrigin),
        );
        return running;
      });
      autonomousLoop.start();
    }

    self.postMessage({
      type: "ready",
      autonomous: autonomousLoop !== null,
    } satisfies MailRoutesWorkerResponse);
    return;
  }

  if (!scene) return;

  switch (message.type) {
    case "resize":
      scene.resize(message.width, message.height, message.dpr);
      break;
    case "frame":
      if (running && !autonomousLoop) {
        scene.renderFrame(message.time);
        self.postMessage({ type: "rendered" } satisfies MailRoutesWorkerResponse);
      }
      break;
    case "pointer":
      scene.setPointerTarget(message.x, message.y);
      break;
    case "palette":
      scene.setPalette(message.palette);
      break;
    case "opened":
      scene.triggerOpened();
      break;
    case "sent":
      scene.triggerSent();
      break;
    case "pause":
      running = false;
      autonomousLoop?.stop();
      break;
    case "resume":
      if (!running) {
        running = true;
        scene.resetTiming();
      }
      autonomousLoop?.start();
      break;
    case "reset-timing":
      scene.resetTiming();
      break;
  }
};
