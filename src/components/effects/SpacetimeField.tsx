"use client";

import { useEffect, useRef } from "react";

import { pixelWorker } from "@/components/effects/pixel-worker-client";
import {
  createSpacetimeScene,
  type SpacetimePalette,
  type SpacetimeVariant,
  type StarSurfaceRemote,
} from "@/components/effects/spacetime-scene";
import { createFrameLoop } from "@/lib/performance/animation-runtime";

// The star's surface is the heaviest part of the scene. The worker paints it
// a frame ahead; the scene paints it itself whenever that copy is not on time.
const starRemote: StarSurfaceRemote = {
  paint: (t, core, mid, edge, done) => pixelWorker.paintStar(t, core, mid, edge, done),
  recycle: (pixels) => pixelWorker.recycleStar(pixels),
};

type SpacetimeFieldProps = Readonly<{
  variant?: SpacetimeVariant;
  className?: string;
}>;

function readPalette(element: HTMLElement): SpacetimePalette {
  const style = getComputedStyle(element);
  const read = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    line: read("--spacetime-line", "92 124 255"),
    lineDeep: read("--spacetime-line-deep", "204 150 255"),
    body: read("--spacetime-body", "214 224 255"),
    starCore: read("--spacetime-star-core", "255 244 214"),
    starMid: read("--spacetime-star-mid", "255 186 96"),
    starEdge: read("--spacetime-star-edge", "214 84 30"),
    void: read("--spacetime-void", "3 4 6"),
    alpha: Number.parseFloat(read("--spacetime-alpha", "0.6")) || 0.6,
  };
}

/**
 * Living spacetime fabric. Decorative only: it sits behind real content,
 * never takes pointer events, pauses off screen, and renders a single still
 * frame for reduced-motion users.
 */
export function SpacetimeField({ variant = "hero", className }: SpacetimeFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const scene = createSpacetimeScene(variant, starRemote);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let rect = host.getBoundingClientRect();
    let rectDirty = true;
    let visible = false;
    let lastTime = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerSeen = false;

    const applyPalette = () =>
      scene.setPalette(
        readPalette(host),
        document.documentElement.dataset.theme === "light",
      );

    // Over the footer well the site cursor steps aside and the scene draws
    // the pointer as a tiny black hole instead.
    let holeMode = false;
    const setHoleMode = (next: boolean) => {
      if (next === holeMode) return;
      holeMode = next;
      scene.setCursorHole(next);
      if (next) document.documentElement.dataset.cursorMode = "blackhole";
      else delete document.documentElement.dataset.cursorMode;
    };

    const measure = () => {
      rect = host.getBoundingClientRect();
      rectDirty = false;
    };

    const resize = () => {
      measure();
      const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2);
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      scene.resize(width, height, dpr);
    };

    const syncInputs = () => {
      if (rectDirty) measure();

      const viewport = window.innerHeight || 1;
      const progress =
        variant === "hero"
          ? -rect.top / Math.max(1, rect.height)
          : (rect.bottom - viewport) / Math.max(1, rect.height);
      scene.setScroll(progress);

      const x = pointerX - rect.left;
      const y = pointerY - rect.top;
      const inside =
        pointerSeen && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      scene.setPointer(x, y, inside);
      if (variant === "well") {
        setHoleMode(inside && !coarsePointer && !reducedMotion.matches);
      }
    };

    const loop = createFrameLoop(
      (callback) => window.requestAnimationFrame(callback),
      (frame) => window.cancelAnimationFrame(frame),
      (time) => {
        const dt = lastTime === 0 ? 0.016 : (time - lastTime) / 1000;
        lastTime = time;
        syncInputs();
        scene.render(context, dt);
        return visible && !document.hidden && !reducedMotion.matches;
      },
    );

    const drawStill = () => {
      syncInputs();
      scene.render(context, 0, true);
    };

    // The first palette read and sizing wait for the ResizeObserver's initial
    // callback. It runs before the first paint, once style and layout are
    // already done, so mounting forces no style recalc or layout of its own.
    let ready = false;

    const wake = () => {
      if (!ready) return;
      if (reducedMotion.matches) {
        loop.stop();
        drawStill();
        return;
      }
      if (visible && !document.hidden) {
        lastTime = 0;
        loop.start();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerSeen = true;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches || !visible) return;
      if (rectDirty) measure();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      scene.pulse(x, y);
    };

    const markDirty = () => {
      rectDirty = true;
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!ready) {
        ready = true;
        applyPalette();
      }
      resize();
      wake();
    });
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (!visible) setHoleMode(false);
        wake();
      },
      { rootMargin: "80px" },
    );
    // The palette lives in CSS tokens, so a theme switch just re-reads them.
    const themeObserver = new MutationObserver(() => {
      if (!ready) return;
      applyPalette();
      wake();
    });

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", markDirty, { passive: true });
    document.addEventListener("visibilitychange", wake);
    reducedMotion.addEventListener("change", wake);

    return () => {
      loop.stop();
      setHoleMode(false);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", markDirty);
      document.removeEventListener("visibilitychange", wake);
      reducedMotion.removeEventListener("change", wake);
    };
  }, [variant]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`spacetime-field spacetime-field-${variant}${className ? ` ${className}` : ""}`}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
