import assert from "node:assert/strict";
import test from "node:test";

const sceneModuleUrl = new URL("./mail-routes-scene.ts", import.meta.url).href;
const sceneModule = (await import(sceneModuleUrl)) as typeof import("./mail-routes-scene");
const { createMailRoutesScene, sampleQuadraticRoute } = sceneModule;

test("route arrows move continuously between cached path samples", () => {
  const geometry = {
    startX: 0,
    startY: 0,
    controlX: 10,
    controlY: 0,
    endX: 10,
    endY: 10,
  };

  const first = sampleQuadraticRoute(geometry, 0.101);
  const second = sampleQuadraticRoute(geometry, 0.102);

  assert.ok(Math.abs(first.x - 1.91799) < 1e-10);
  assert.ok(Math.abs(first.y - 0.10201) < 1e-10);
  assert.ok(Math.abs(second.x - 1.93596) < 1e-10);
  assert.ok(Math.abs(second.y - 0.10404) < 1e-10);
  assert.notDeepEqual(second, first);
});

test("route arrow rotation follows the exact curve tangent", () => {
  const geometry = {
    startX: 0,
    startY: 0,
    controlX: 10,
    controlY: 0,
    endX: 10,
    endY: 10,
  };

  assert.deepEqual(sampleQuadraticRoute(geometry, 0), { x: 0, y: 0, angle: 0 });
  assert.deepEqual(sampleQuadraticRoute(geometry, 0.5), {
    x: 7.5,
    y: 2.5,
    angle: Math.PI / 4,
  });
  const end = sampleQuadraticRoute(geometry, 1);
  assert.deepEqual({ x: end.x, y: end.y }, { x: 10, y: 10 });
  assert.ok(Math.abs(end.angle - Math.PI / 2) < 1e-12);
});

type DrawCounts = {
  arcs: number;
  clears: Array<[number, number, number, number]>;
  fills: number;
  strokes: number;
  transforms: Array<[number, number, number, number, number, number]>;
};

function createRecordingContext() {
  const counts: DrawCounts = {
    arcs: 0,
    clears: [],
    fills: 0,
    strokes: 0,
    transforms: [],
  };
  const canvas = { width: 0, height: 0 };
  const context = {
    canvas,
    fillStyle: "",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    lineCap: "butt",
    lineDashOffset: 0,
    lineWidth: 1,
    strokeStyle: "",
    arc() {
      counts.arcs += 1;
    },
    beginPath() {},
    clearRect(x: number, y: number, width: number, height: number) {
      counts.clears.push([x, y, width, height]);
    },
    closePath() {},
    fill() {
      counts.fills += 1;
    },
    lineTo() {},
    moveTo() {},
    restore() {},
    rotate() {},
    save() {},
    scale() {},
    setLineDash() {},
    setTransform(...values: [number, number, number, number, number, number]) {
      counts.transforms.push(values);
    },
    stroke() {
      counts.strokes += 1;
    },
    translate() {},
  };
  return { canvas, context, counts };
}

function createRecordingPath() {
  return { moveTo() {}, lineTo() {}, closePath() {} };
}

test("paper-plane geometry is created once and reused across frames", () => {
  const { context } = createRecordingContext();
  const paths: Array<Array<[string, ...number[]]>> = [];
  const createPath = () => {
    const commands: Array<[string, ...number[]]> = [];
    paths.push(commands);
    return {
      moveTo(x: number, y: number) {
        commands.push(["moveTo", x, y]);
      },
      lineTo(x: number, y: number) {
        commands.push(["lineTo", x, y]);
      },
      closePath() {
        commands.push(["closePath"]);
      },
    };
  };
  const scene = createMailRoutesScene(
    context as unknown as CanvasRenderingContext2D,
    createPath as unknown as () => Path2D,
  );

  scene.resize(100, 80, 1);
  scene.renderFrame(100);
  scene.renderFrame(116.7);

  assert.equal(paths.length, 7);
  assert.deepEqual(paths[0], [
    ["moveTo", 7, 0],
    ["lineTo", -5, 4.2],
    ["lineTo", -2.4, 0],
    ["lineTo", -5, -4.2],
    ["closePath"],
  ]);
  assert.deepEqual(paths[1], [
    ["moveTo", 7, 0],
    ["lineTo", -2.4, 0],
    ["lineTo", -5, 4.2],
    ["closePath"],
  ]);
});

test("mail route scene keeps the exact canvas density and visual element counts", () => {
  const { canvas, context, counts } = createRecordingContext();
  const scene = createMailRoutesScene(
    context as unknown as CanvasRenderingContext2D,
    createRecordingPath as unknown as () => Path2D,
  );

  scene.resize(100, 80, 2);
  scene.drawStatic();

  assert.deepEqual({ width: canvas.width, height: canvas.height }, { width: 200, height: 160 });
  assert.deepEqual(counts.transforms.at(-1), [2, 0, 0, 2, 0, 0]);
  assert.deepEqual(counts.clears, [[0, 0, 100, 80]]);
  assert.equal(counts.arcs, 51);
  assert.equal(counts.fills, 61);
  assert.equal(counts.strokes, 5);
});

test("animated route scene advances every route and preserves every trail segment", () => {
  const { context, counts } = createRecordingContext();
  const scene = createMailRoutesScene(
    context as unknown as CanvasRenderingContext2D,
    createRecordingPath as unknown as () => Path2D,
  );

  scene.resize(100, 80, 1);
  scene.renderFrame(100);
  scene.renderFrame(116.7);

  assert.equal(counts.clears.length, 2);
  assert.equal(counts.arcs, 102);
  assert.equal(counts.fills, 122);
  assert.equal(counts.strokes, 15);
  assert.equal(context.globalCompositeOperation, "source-over");
});
