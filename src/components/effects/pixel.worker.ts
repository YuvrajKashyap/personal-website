/// <reference lib="webworker" />

import { createWorldPainter } from "@/components/effects/celestial-scene";
import type {
  PixelBuffer,
  PixelWorkerRequest,
  PixelWorkerResponse,
} from "@/components/effects/pixel-worker-protocol";
import { createStarSurfacePainter, STAR_SIZE } from "@/components/effects/star-surface";

const scope = self as unknown as DedicatedWorkerGlobalScope;

// Every star asks for the same thing (the surface at a time, in its colours),
// so one painter serves them all; it keeps no state between paints.
const star = createStarSurfacePainter();
const worlds = new Map<
  number,
  { paint: ReturnType<typeof createWorldPainter>; base: Uint8ClampedArray }
>();

function reply(id: number, buffer: PixelBuffer) {
  scope.postMessage({ id, buffer } satisfies PixelWorkerResponse, [buffer.buffer]);
}

scope.onmessage = (event: MessageEvent<PixelWorkerRequest>) => {
  const message = event.data;
  switch (message.type) {
    case "star": {
      // A fresh buffer is all transparent. A reused one was painted by this
      // same painter, which writes the same set of pixels every time, so the
      // rest of it is still transparent.
      const buffer = message.buffer ?? new Uint8ClampedArray(STAR_SIZE * STAR_SIZE * 4);
      star.paint(buffer, message.t, message.core, message.mid, message.edge);
      reply(message.id, buffer);
      break;
    }
    case "world-add":
      worlds.set(message.world, {
        paint: createWorldPainter(message.kind, message.theme, message.bake),
        base: message.bake.data,
      });
      break;
    case "world": {
      const world = worlds.get(message.world);
      if (!world) return;
      // Buffers start as a copy of the bake; a returned one belongs to this
      // same world, and every face pixel is rewritten on each turn.
      const buffer = message.buffer ?? new Uint8ClampedArray(world.base);
      world.paint(buffer, message.turn);
      reply(message.id, buffer);
      break;
    }
    case "world-remove":
      worlds.delete(message.world);
      break;
  }
};
