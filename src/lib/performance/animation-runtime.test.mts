import assert from "node:assert/strict";
import test from "node:test";

const runtimeModuleUrl = new URL("./animation-runtime.ts", import.meta.url).href;
const {
  createFrameLoop,
  createPhasePreservingAnimationController,
  translateFrameTime,
} = (await import(
  runtimeModuleUrl
)) as typeof import("./animation-runtime");

test("frame loop never queues more than one display callback", () => {
  const callbacks = new Map<number, (time: number) => void>();
  let nextFrame = 1;
  const rendered: number[] = [];
  const loop = createFrameLoop(
    (callback) => {
      const frame = nextFrame;
      nextFrame += 1;
      callbacks.set(frame, callback);
      return frame;
    },
    () => {},
    (time) => {
      rendered.push(time);
      return true;
    },
  );

  loop.start();
  loop.start();
  assert.equal(callbacks.size, 1);

  const first = callbacks.get(1);
  callbacks.delete(1);
  first?.(16.7);
  assert.deepEqual(rendered, [16.7]);
  assert.equal(callbacks.size, 1);
});

test("frame loop becomes idle when rendering has no remaining work", () => {
  const callbacks = new Map<number, (time: number) => void>();
  const cancelled: number[] = [];
  let nextFrame = 1;
  const loop = createFrameLoop(
    (callback) => {
      const frame = nextFrame;
      nextFrame += 1;
      callbacks.set(frame, callback);
      return frame;
    },
    (frame) => {
      cancelled.push(frame);
      callbacks.delete(frame);
    },
    () => false,
  );

  loop.start();
  const first = callbacks.get(1);
  callbacks.delete(1);
  first?.(20);
  assert.equal(callbacks.size, 0);
  assert.equal(loop.isRunning(), false);

  loop.start();
  loop.stop();
  assert.deepEqual(cancelled, [2]);
  assert.equal(callbacks.size, 0);
  assert.equal(loop.isRunning(), false);
});

test("worker timestamps stay on the page animation timeline", () => {
  assert.equal(translateFrameTime(500, 1_200, 1_000), 700);
});

test("offscreen animations resume at the phase they would have reached", () => {
  let now = 100;
  const running = {
    currentTime: 40,
    playbackRate: 1,
    playState: "running" as AnimationPlayState,
    pauseCalls: 0,
    playCalls: 0,
    pause() {
      this.pauseCalls += 1;
      this.playState = "paused";
    },
    play() {
      this.playCalls += 1;
      this.playState = "running";
    },
  };
  const alreadyPaused = {
    currentTime: 25,
    playbackRate: 1,
    playState: "paused" as AnimationPlayState,
    pauseCalls: 0,
    playCalls: 0,
    pause() {
      this.pauseCalls += 1;
    },
    play() {
      this.playCalls += 1;
    },
  };
  const controller = createPhasePreservingAnimationController(
    () => [running, alreadyPaused],
    () => now,
  );

  controller.pause();
  assert.equal(running.pauseCalls, 1);
  assert.equal(alreadyPaused.pauseCalls, 0);

  now = 260;
  controller.resume();

  assert.equal(running.currentTime, 200);
  assert.equal(running.playCalls, 1);
  assert.equal(alreadyPaused.currentTime, 25);
  assert.equal(alreadyPaused.playCalls, 0);
});
