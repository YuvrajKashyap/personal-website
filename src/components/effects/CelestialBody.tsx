"use client";

import { useEffect, useRef } from "react";

import {
  createWorld,
  paintComet,
  paintGalaxy,
  paintRings,
  type WorldKind,
} from "@/components/effects/celestial-scene";
import type { CosmosTheme } from "@/components/effects/cosmos-scene";

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

    const build = () => {
      const theme = readTheme();
      if (kind === "galaxy") {
        paintGalaxy(body, theme);
      } else if (kind === "comet") {
        paintComet(body, theme);
      } else {
        const spec = WORLD_SPEC[kind];
        world = createWorld(body, spec.world, theme, spec.radius);
        world?.draw(turn);
        if (kind === "planet") {
          const ringRadius = spec.size * spec.radius;
          if (backRef.current) paintRings(backRef.current, theme, "back", ringRadius);
          if (frontRef.current) paintRings(frontRef.current, theme, "front", ringRadius);
        }
      }
      host.dataset.ready = "true";
    };

    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden || reducedMotion.matches || !world) return;
      if (time - lastDraw >= frameMs) {
        const dt = lastTime === 0 ? 0 : Math.min(0.1, (time - lastTime) / 1000);
        lastTime = time;
        lastDraw = time;
        if (kind !== "galaxy" && kind !== "comet") turn += dt / WORLD_SPEC[kind].period;
        world.draw(turn);
      }
      frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame === 0 && visible && world && !reducedMotion.matches) {
        lastTime = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    // Building a surface map takes a few tens of milliseconds; keep it off
    // the first paint.
    const timer = window.setTimeout(() => {
      build();
      wake();
    }, 350);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        wake();
      },
      { rootMargin: "120px" },
    );
    const themeObserver = new MutationObserver(() => {
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
