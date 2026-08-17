import assert from "node:assert/strict";
import test from "node:test";

const runtimeUtilsUrl = new URL("./runtime-utils.ts", import.meta.url).href;
const runtimeUtils = (await import(runtimeUtilsUrl)) as typeof import("./runtime-utils");
const {
  createElementRectCache,
  createLatestFrameScheduler,
  createLazyEventSink,
  createPointTrail,
  getTrailPointOffset,
  pushTrailPoint,
  tracePolyline,
} = runtimeUtils;

test("element geometry is read once until layout invalidates it", () => {
  let reads = 0;
  const cache = createElementRectCache(() => {
    reads += 1;
    return { left: 10, top: 20, width: 300, height: 180 };
  });

  assert.deepEqual(cache.read(), { left: 10, top: 20, width: 300, height: 180 });
  assert.deepEqual(cache.read(), { left: 10, top: 20, width: 300, height: 180 });
  assert.equal(reads, 1);

  cache.invalidate();
  cache.read();
  assert.equal(reads, 2);
});

test("point trails keep newest-first draw order after wrapping", () => {
  const trail = createPointTrail(3);

  pushTrailPoint(trail, 1, 2);
  pushTrailPoint(trail, 3, 4);
  pushTrailPoint(trail, 5, 6);
  pushTrailPoint(trail, 7, 8);

  assert.equal(trail.count, 3);
  assert.deepEqual(
    [0, 1, 2].map((index) => {
      const offset = getTrailPointOffset(trail, index);
      return [trail.points[offset], trail.points[offset + 1]];
    }),
    [
      [7, 8],
      [5, 6],
      [3, 4],
    ],
  );
});

test("route tracing preserves every sampled line segment", () => {
  const commands: Array<[string, number, number]> = [];
  const path = {
    moveTo(x: number, y: number) {
      commands.push(["moveTo", x, y]);
    },
    lineTo(x: number, y: number) {
      commands.push(["lineTo", x, y]);
    },
  };

  tracePolyline(path, new Float32Array([1, 2, 3, 4, 5, 6]));

  assert.deepEqual(commands, [
    ["moveTo", 1, 2],
    ["lineTo", 3, 4],
    ["lineTo", 5, 6],
  ]);
});

test("pointer work runs once per display frame with the latest sample", () => {
  const callbacks = new Map<number, () => void>();
  const cancelled: number[] = [];
  const flushed: string[] = [];
  let nextFrame = 1;
  const scheduler = createLatestFrameScheduler<string>(
    (callback) => {
      const frame = nextFrame;
      nextFrame += 1;
      callbacks.set(frame, callback);
      return frame;
    },
    (frame) => cancelled.push(frame),
    (sample) => flushed.push(sample),
  );

  scheduler.schedule("first");
  scheduler.schedule("latest");
  assert.equal(callbacks.size, 1);
  callbacks.get(1)?.();
  assert.deepEqual(flushed, ["latest"]);

  scheduler.schedule("cancelled");
  scheduler.cancel();
  assert.deepEqual(cancelled, [2]);
});

test("analytics events wait for one shared client load and retain order", async () => {
  type Client = { name: string };
  type Event = { name: string };
  let resolveClient: ((client: Client) => void) | undefined;
  let loadCount = 0;
  const delivered: string[] = [];
  const sink = createLazyEventSink<Client, Event>(
    () => {
      loadCount += 1;
      return new Promise<Client>((resolve) => {
        resolveClient = resolve;
      });
    },
    (_client, event) => delivered.push(event.name),
  );

  const first = sink.push({ name: "pageview" });
  const second = sink.push({ name: "click" });
  assert.equal(loadCount, 1);
  assert.deepEqual(delivered, []);

  resolveClient?.({ name: "posthog" });
  await Promise.all([first, second]);

  assert.deepEqual(delivered, ["pageview", "click"]);
});
