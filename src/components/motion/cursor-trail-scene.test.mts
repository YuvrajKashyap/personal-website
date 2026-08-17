import assert from "node:assert/strict";
import test from "node:test";

const sceneModuleUrl = new URL("./cursor-trail-scene.ts", import.meta.url).href;
const { createCursorTrailScene } = (await import(sceneModuleUrl)) as typeof import(
  "./cursor-trail-scene"
);

function createRecordingContext() {
  const counts = { clears: 0, strokes: 0, transforms: [] as number[][] };
  const canvas = { width: 0, height: 0 };
  const context = {
    canvas,
    globalCompositeOperation: "source-over",
    lineCap: "butt",
    lineJoin: "miter",
    lineWidth: 1,
    strokeStyle: "",
    beginPath() {},
    clearRect() {
      counts.clears += 1;
    },
    lineTo() {},
    moveTo() {},
    setTransform(...values: number[]) {
      counts.transforms.push(values);
    },
    stroke() {
      counts.strokes += 1;
    },
  };
  return { canvas, context, counts };
}

test("cursor trail keeps exact density and draws both existing stroke passes", () => {
  const { canvas, context, counts } = createRecordingContext();
  const scene = createCursorTrailScene(context as unknown as CanvasRenderingContext2D);

  scene.resize(100, 80, 2);
  scene.pushPoint(10, 10, 0);
  scene.pushPoint(20, 20, 100);
  scene.pushPoint(30, 30, 200);

  assert.equal(scene.renderFrame(250), true);
  assert.deepEqual({ width: canvas.width, height: canvas.height }, { width: 200, height: 160 });
  assert.deepEqual(counts.transforms.at(-1), [2, 0, 0, 2, 0, 0]);
  assert.equal(counts.clears, 1);
  assert.equal(counts.strokes, 4);
});

test("cursor trail expires at the same lifetime and never exceeds seventy points", () => {
  const { context, counts } = createRecordingContext();
  const scene = createCursorTrailScene(context as unknown as CanvasRenderingContext2D);
  scene.resize(100, 80, 1);

  for (let index = 0; index < 72; index += 1) {
    scene.pushPoint(index, index, index);
  }

  assert.equal(scene.renderFrame(72), true);
  assert.equal(counts.strokes, 138);
  assert.equal(scene.renderFrame(500), false);
});
