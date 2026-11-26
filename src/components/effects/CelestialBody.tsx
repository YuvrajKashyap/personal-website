"use client";

import { useEffect, useRef } from "react";

import { peekBake, requestBake, takeBake } from "@/components/effects/bake-client";
import type { BakeJob, RingsJob, SpriteJob, WorldJob } from "@/components/effects/bake-jobs";
import { pixelWorker } from "@/components/effects/pixel-worker-client";
import {
  createWorld,
  paintComet,
  paintGalaxy,
  type WorldKind,
} from "@/components/effects/celestial-scene";
import { putPixels, type CosmosTheme } from "@/components/effects/cosmos-scene";

type CelestialKind =
  | "planet"
  | "moon"
  | "ice"
  | "ember"
  | "jade"
  | "galaxy"
  | "comet";

type StaticKind = "galaxy" | "comet";

type CelestialBodyProps = Readonly<{
  kind: CelestialKind;
}>;

/** Canvas resolution, the world's radius within it, and seconds per turn. */
const WORLD_SPEC: Record<
  Exclude<CelestialKind, StaticKind>,
  Readonly<{ world: WorldKind; size: number; radius: number; period: number }>
> = {
  planet: { world: "giant", size: 380, radius: 0.4737, period: 84 },
  moon: { world: "moon", size: 220, radius: 0.47, period: 120 },
  ice: { world: "ice", size: 260, radius: 0.47, period: 104 },
  ember: { world: "ember", size: 220, radius: 0.47, period: 70 },
  jade: { world: "jade", size: 320, radius: 0.47, period: 92 },
};

const RING_SIZE = 720;
const GALAXY_SIZE = 640;
const FRAME_MS = 1000 / 30;
/** Phones redraw the worlds a little less often to keep scrolling light. */
const FRAME_MS_TOUCH = 1000 / 20;

function readTheme(): CosmosTheme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * A landmark in the Home sky. Worlds are live: a lit sphere re-projected at
 * 30 frames a second while on screen, so their weather turns across the
 * face. Rings and the galaxy are painted once. Decorative only; off screen
 * nothing runs, and reduced-motion users get a single still frame.
 */
export function CelestialBody({ kind }: CelestialBodyProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const body = bodyRef.current;
    if (!host || !body) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let world: ReturnType<typeof createWorld> = null;
    let visible = false;
    let frame = 0;
    let lastDraw = 0;
    let turn = 0.08;
    let lastTime = 0;
    const frameMs = window.matchMedia("(pointer: coarse)").matches
      ? FRAME_MS_TOUCH
      : FRAME_MS;

    // The world's surface, sphere tables and rings, and the painted-once
    // galaxy and comet, are baked off the main thread (see bake-client);
    // drawing them is cheap once they exist.
    const spriteJob = (theme: CosmosTheme): SpriteJob | null =>
      kind === "galaxy" || kind === "comet"
        ? {
            type: "sprite",
            kind,
            theme,
            width: body.width,
            height: body.height,
          }
        : null;

    const jobsFor = (theme: CosmosTheme): BakeJob[] => {
      const sprite = spriteJob(theme);
      if (sprite) return [sprite];
      if (kind === "galaxy" || kind === "comet") return [];
      const spec = WORLD_SPEC[kind];
      const world: WorldJob = {
        type: "world",
        kind: spec.world,
        theme,
        size: spec.size,
        radius: spec.radius,
      };
      if (kind !== "planet") return [world];
      const ringRadius = spec.size * spec.radius;
      const ring = (half: "back" | "front"): RingsJob => ({
        type: "rings",
        theme,
        half,
        size: RING_SIZE,
        radius: ringRadius,
      });
      return [world, ring("back"), ring("front")];
    };

    let disposed = false;
    let timerDone = false;
    // This world's handle in the pixel worker (0: none), whether a turn is
    // being painted there, and the turn waiting behind it (-1: none).
    let remoteWorld = 0;
    let worldInFlight = false;
    let queuedTurn = -1;
    // Set when a sprite cannot be baked off-thread (no OffscreenCanvas); the
    // body is then painted here, exactly as before the worker existed.
    let paintHere = false;
    const prefetch = (theme: CosmosTheme) =>
      Promise.all(jobsFor(theme).map((job) => requestBake(job))).catch(() => {
        paintHere = true;
      });

    const drawSprite = (theme: CosmosTheme, job: SpriteJob) => {
      const bitmap = paintHere ? undefined : peekBake(job);
      const context = bitmap ? body.getContext("2d") : null;
      if (bitmap && context) {
        context.clearRect(0, 0, body.width, body.height);
        context.drawImage(bitmap, 0, 0);
      } else if (kind === "galaxy") {
        paintGalaxy(body, theme);
      } else {
        paintComet(body, theme);
      }
    };

    const build = () => {
      const theme = readTheme();
      if (kind === "galaxy" || kind === "comet") {
        drawSprite(theme, spriteJob(theme) as SpriteJob);
      } else {
        const spec = WORLD_SPEC[kind];
        const [worldJob, backJob, frontJob] = jobsFor(theme) as [
          WorldJob,
          RingsJob?,
          RingsJob?,
        ];
        const bake = takeBake(worldJob);
        world = createWorld(body, spec.world, theme, bake);
        world?.draw(turn);
        // Later turns are worked out in the pixel worker (see drawWorld).
        pixelWorker.removeWorld(remoteWorld);
        remoteWorld = world ? pixelWorker.addWorld(spec.world, theme, bake) : 0;
        worldInFlight = false;
        queuedTurn = -1;
        if (backJob && frontJob) {
          if (backRef.current) putPixels(backRef.current, takeBake(backJob));
          if (frontRef.current) putPixels(frontRef.current, takeBake(frontJob));
        }
      }
      host.dataset.ready = "true";
    };

    /** Builds once the first-paint delay has passed and the bakes are in. */
    const buildWhenReady = () => {
      if (disposed || !timerDone) return;
      const theme = readTheme();
      const jobs = jobsFor(theme);
      if (paintHere || jobs.every((job) => peekBake(job))) {
        build();
        wake();
        // Bake the other theme in the background so a switch is instant.
        void prefetch(theme === "dark" ? "light" : "dark");
        return;
      }
      void prefetch(theme).then(buildWhenReady);
    };

    /**
     * Turns the world to `turn`. The pixel loop runs in the worker, which
     * hands back the finished pixels to copy onto the canvas, the same bytes
     * `world.draw` would have written. Without a worker it runs here.
     */
    const drawWorld = (next: number) => {
      if (!remoteWorld || !pixelWorker.alive()) {
        world?.draw(next);
        return;
      }
      // One turn in flight at a time; the newest waiting turn goes next.
      if (worldInFlight) {
        queuedTurn = next;
        return;
      }
      const handle = remoteWorld;
      worldInFlight = true;
      const sent = pixelWorker.paintWorld(handle, next, (pixels) => {
        worldInFlight = false;
        if (disposed || handle !== remoteWorld) return;
        body
          .getContext("2d")
          ?.putImageData(new ImageData(pixels, body.width, body.height), 0, 0);
        pixelWorker.recycleWorld(handle, pixels);
        if (queuedTurn >= 0) {
          const waiting = queuedTurn;
          queuedTurn = -1;
          drawWorld(waiting);
        }
      });
      if (!sent) {
        worldInFlight = false;
        world?.draw(next);
      }
    };

    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden || reducedMotion.matches || !world) return;
      if (time - lastDraw >= frameMs) {
        const dt = lastTime === 0 ? 0 : Math.min(0.1, (time - lastTime) / 1000);
        lastTime = time;
        lastDraw = time;
        if (kind !== "galaxy" && kind !== "comet") turn += dt / WORLD_SPEC[kind].period;
        drawWorld(turn);
      }
      frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame === 0 && visible && world && !reducedMotion.matches) {
        lastTime = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    // Start the bakes now, in the worker, but keep the first draw off the
    // first paint as before.
    void prefetch(readTheme());
    const timer = window.setTimeout(() => {
      timerDone = true;
      buildWhenReady();
    }, 350);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        wake();
      },
      { rootMargin: "120px" },
    );
    const themeObserver = new MutationObserver(() => {
      // Before the first build, the pending one picks up the new theme.
      if (!timerDone || host.dataset.ready !== "true") return;
      // Usually prefetched already; if not, bake right here as before.
      build();
      wake();
    });

    intersectionObserver.observe(host);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    document.addEventListener("visibilitychange", wake);

    return () => {
      disposed = true;
      pixelWorker.removeWorld(remoteWorld);
      window.clearTimeout(timer);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [kind]);

  const bodySize =
    kind === "galaxy" || kind === "comet" ? GALAXY_SIZE : WORLD_SPEC[kind].size;
  const bodyHeight = kind === "comet" ? GALAXY_SIZE / 2 : bodySize;

  return (
    <div
      ref={hostRef}
      className={`celestial celestial-${kind}`}
      data-ready="false"
      aria-hidden="true"
    >
      <div className="celestial-drift">
        {kind === "planet" ? (
          <canvas
            ref={backRef}
            className="celestial-canvas celestial-rings"
            width={RING_SIZE}
            height={RING_SIZE}
          />
        ) : null}
        <canvas
          ref={bodyRef}
          className="celestial-canvas celestial-world"
          width={bodySize}
          height={bodyHeight}
        />
        {kind === "planet" ? (
          <canvas
            ref={frontRef}
            className="celestial-canvas celestial-rings"
            width={RING_SIZE}
            height={RING_SIZE}
          />
        ) : null}
      </div>
    </div>
  );
}
