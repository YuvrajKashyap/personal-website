type FrameCallback = (time: number) => void;
type RequestFrame = (callback: FrameCallback) => number;
type CancelFrame = (frame: number) => void;

type PhasePreservingAnimation = {
  currentTime: CSSNumberish | null;
  pause: () => void;
  playbackRate: number;
  play: () => void;
  playState: AnimationPlayState;
};

export function createFrameLoop(
  requestFrame: RequestFrame,
  cancelFrame: CancelFrame,
  renderFrame: (time: number) => boolean,
) {
  let frame: number | null = null;

  const start = () => {
    if (frame === null) {
      frame = requestFrame(run);
    }
  };

  const run = (time: number) => {
    frame = null;
    if (renderFrame(time)) {
      start();
    }
  };

  return {
    start,
    stop() {
      if (frame !== null) {
        cancelFrame(frame);
        frame = null;
      }
    },
    isRunning() {
      return frame !== null;
    },
  };
}

export function translateFrameTime(
  timestamp: number,
  sourceTimeOrigin: number,
  targetTimeOrigin: number,
) {
  return timestamp + sourceTimeOrigin - targetTimeOrigin;
}

export function createPhasePreservingAnimationController(
  getAnimations: () => readonly PhasePreservingAnimation[],
  now: () => number,
) {
  let pausedAt: number | null = null;
  let pausedAnimations: PhasePreservingAnimation[] = [];

  return {
    pause() {
      if (pausedAt !== null) return;

      pausedAt = now();
      pausedAnimations = getAnimations().filter(
        (animation) => animation.playState === "running",
      );
      for (const animation of pausedAnimations) animation.pause();
    },
    resume() {
      if (pausedAt === null) return;

      const elapsed = Math.max(0, now() - pausedAt);
      for (const animation of pausedAnimations) {
        if (animation.playState === "idle") continue;
        if (typeof animation.currentTime === "number") {
          animation.currentTime += elapsed * animation.playbackRate;
        }
        animation.play();
      }
      pausedAnimations = [];
      pausedAt = null;
    },
  };
}
