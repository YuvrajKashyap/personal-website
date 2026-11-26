/**
 * Page side of the pixel worker (see pixel.worker.ts). The worker is started
 * on first use and shared by every star and world on the page. Buffers go
 * back and forth without copies: each finished buffer is handed to the page,
 * which returns it once its pixels are on the canvas.
 *
 * If the worker cannot start or fails, `alive()` turns false and callers draw
 * on the page as they always did. A request that never comes back is never
 * waited on: callers keep drawing and treat a missing result as "not yet".
 */

import type { CosmosTheme } from "@/components/effects/cosmos-scene";
import type { WorldBake, WorldKind } from "@/components/effects/celestial-scene";
import type {
  PixelBuffer,
  PixelWorkerRequest,
  PixelWorkerResponse,
} from "@/components/effects/pixel-worker-protocol";
import type { StarRgb } from "@/components/effects/star-surface";

type Done = (pixels: PixelBuffer) => void;

let worker: Worker | null | undefined;
let nextId = 1;
const pending = new Map<number, { done: Done; world: number }>();
const spareStar: PixelBuffer[] = [];
const spareWorld = new Map<number, PixelBuffer[]>();
const liveWorlds = new Set<number>();

function fail() {
  worker?.terminate();
  worker = null;
  pending.clear();
  spareStar.length = 0;
  spareWorld.clear();
  liveWorlds.clear();
}

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  if (typeof Worker === "undefined") {
    worker = null;
    return worker;
  }
  try {
    worker = new Worker(new URL("./pixel.worker.ts", import.meta.url));
    worker.onmessage = (event: MessageEvent<PixelWorkerResponse>) => {
      const entry = pending.get(event.data.id);
      if (!entry) return;
      pending.delete(event.data.id);
      entry.done(event.data.buffer);
    };
    worker.onerror = fail;
    worker.onmessageerror = fail;
  } catch {
    worker = null;
  }
  return worker;
}

function send(message: PixelWorkerRequest, done: Done | null, world = 0) {
  const target = getWorker();
  if (!target) return false;
  if (done && "id" in message) pending.set(message.id, { done, world });
  const buffer = "buffer" in message ? message.buffer : undefined;
  target.postMessage(message, buffer ? [buffer.buffer as ArrayBuffer] : []);
  return true;
}

export const pixelWorker = {
  /** False once the worker is known to be unavailable. */
  alive() {
    return getWorker() !== null;
  },

  /** Paints the hologram star's surface at time `t`. */
  paintStar(t: number, core: StarRgb, mid: StarRgb, edge: StarRgb, done: Done) {
    const id = nextId;
    nextId += 1;
    return send({ type: "star", id, t, core, mid, edge, buffer: spareStar.pop() }, done);
  },

  /** Hands a star buffer back once its pixels are on the canvas. */
  recycleStar(pixels: PixelBuffer) {
    if (worker && spareStar.length < 2) spareStar.push(pixels);
  },

  /** Registers a world; returns its handle, or 0 if the worker is unavailable. */
  addWorld(kind: WorldKind, theme: CosmosTheme, bake: WorldBake) {
    const world = nextId;
    nextId += 1;
    // The bake is cached on the page for later mounts, so it is copied over
    // rather than transferred.
    if (!send({ type: "world-add", world, kind, theme, bake }, null)) return 0;
    liveWorlds.add(world);
    return world;
  },

  /** Turns a registered world to `turn` (rotations). */
  paintWorld(world: number, turn: number, done: Done) {
    const id = nextId;
    nextId += 1;
    return send(
      { type: "world", id, world, turn, buffer: spareWorld.get(world)?.pop() },
      done,
      world,
    );
  },

  /** Hands a world's buffer back once its pixels are on the canvas. */
  recycleWorld(world: number, pixels: PixelBuffer) {
    if (!worker || !liveWorlds.has(world)) return;
    const spares = spareWorld.get(world);
    if (!spares) spareWorld.set(world, [pixels]);
    else if (spares.length < 2) spares.push(pixels);
  },

  removeWorld(world: number) {
    if (!world) return;
    liveWorlds.delete(world);
    spareWorld.delete(world);
    for (const [id, entry] of pending) if (entry.world === world) pending.delete(id);
    send({ type: "world-remove", world }, null);
  },
};
