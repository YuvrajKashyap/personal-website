"use client";

import { useEffect, useRef } from "react";

import { peekBake, requestBake } from "@/components/effects/bake-client";
import type { NebulaJob } from "@/components/effects/bake-jobs";
import {
  createStarfield,
  putPixels,
  type CosmosTheme,
} from "@/components/effects/cosmos-scene";
import { createLensSky, type LensTitleRect } from "@/components/effects/lens-sky";
import { createFrameLoop } from "@/lib/performance/animation-runtime";

const NEBULA_SIZE = 448;

/** Where each cloud rests, how far it travels over the scroll, and its drift. */
const NEBULA_LAYERS = [
  { seed: 11, x: 34, y: -16, travel: -34, sway: 3.2, period: 37 },
  { seed: 47, x: -44, y: 34, travel: -62, sway: 4.4, period: 53 },
  { seed: 83, x: 26, y: 82, travel: -80, sway: 3.6, period: 44 },
] as const;

/** Star ink and chapter-title ink per theme, as 0..1 rgb for the shader. */
const SKY_INK: Record<CosmosTheme, { star: number[]; title: number[] }> = {
  dark: { star: [1, 1, 1], title: [0.7, 0.67, 1] },
  light: { star: [0.36, 0.16, 0.13], title: [0.5, 0.11, 0.11] },
};

function nebulaWeight(index: number, progress: number) {
  if (index === 0) return 0.92 - progress * 0.5;
  if (index === 1) return 0.28 + 0.66 * Math.exp(-Math.pow((progress - 0.5) / 0.26, 2));
  return 0.22 + progress * 0.72;
}

function readTheme(): CosmosTheme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * Draws a chapter title the way the page sets it (same font, size, tracking)
 * into a canvas, so the sky can take it over and the lens can bend it. The
 * canvas carries padding on every side, returned so the caller can place it.
 */
function drawTitle(element: HTMLElement) {
  const style = getComputedStyle(element);
  const size = Number.parseFloat(style.fontSize);
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (!width || !height || !size) return null;

  const pad = Math.ceil(size * 0.32);
  const scale = Math.min(1.5, 2048 / (width + pad * 2));
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil((width + pad * 2) * scale);
  canvas.height = Math.ceil((height + pad * 2) * scale);
  const context = canvas.getContext("2d");
  if (!context) return null;

  const spaced = context as CanvasRenderingContext2D & { letterSpacing?: string };
  context.scale(scale, scale);
  context.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
  if ("letterSpacing" in spaced) spaced.letterSpacing = style.letterSpacing;
  context.textBaseline = "middle";
  const text = (element.textContent ?? "").trim().toUpperCase();
  const x = pad;
  const y = pad + height / 2;

  // A soft fill that fades toward the baseline, under a hairline outline.
  const fill = context.createLinearGradient(0, pad - size * 0.1, 0, pad + height + size * 0.1);
  fill.addColorStop(0, "rgb(255 255 255 / 0.16)");
  fill.addColorStop(0.8, "rgb(255 255 255 / 0)");
  context.fillStyle = fill;
  context.fillText(text, x, y);
  context.lineJoin = "round";
  context.lineWidth = 1.25;
  context.strokeStyle = "rgb(255 255 255 / 0.36)";
  context.strokeText(text, x, y);

  return { canvas, pad };
}

/**
 * Deep space behind the Home chapters. Mounted once inside `.home-sections`;
 * the stage is fixed to the viewport and clipped to that container, so the
 * chapters scroll across a universe that moves at its own, slower pace.
 *
 * On desktop the stars are a WebGL shader in which the cursor is a
 * gravitational lens, and the giant chapter names are drawn into that same
 * sky so the lens bends them too. Touch devices, reduced-motion users and
 * browsers without WebGL get the 2D starfield and the names as plain text.
 * Decorative only and paused off screen.
 */
export function CosmosBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const lensRef = useRef<HTMLCanvasElement>(null);
  const nebulaRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = starsRef.current;
    const lensCanvas = lensRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !lensCanvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const starfield = createStarfield(coarsePointer ? 420 : 860);

    const ghosts = Array.from(
      host.parentElement?.querySelectorAll<HTMLElement>(".home-chapter-ghost") ?? [],
    );
    const sky =
      coarsePointer || reducedMotion.matches
        ? null
        : createLensSky(lensCanvas, Math.max(1, ghosts.length));
    let skyLive = sky !== null;
    const titlePad = ghosts.map(() => 0);
    const rects: LensTitleRect[] = ghosts.map(() => ({ x: 0, y: 0, w: 1, h: 1, on: 1 }));

    let visible = false;
    let lastTime = 0;
    let elapsed = 0;
    let hostTop = 0;
    let hostHeight = 1;
    let viewport = 1;
    let width = 1;
    let lastScroll = 0;
    let velocity = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerSeen = false;
    let lensX = 0;
    let lensY = 0;
    let theta = 0;
    let ring = 0;

    const setSkyLive = (next: boolean) => {
      skyLive = next;
      starfield.setLensMode(next);
      lensCanvas.style.display = next ? "" : "none";
      if (next) document.documentElement.dataset.skyTitles = "on";
      else delete document.documentElement.dataset.skyTitles;
    };

    const buildTitles = () => {
      if (!sky || !skyLive) return;
      ghosts.forEach((ghost, index) => {
        const made = drawTitle(ghost);
        titlePad[index] = made?.pad ?? 0;
        sky.setTitle(index, made?.canvas ?? null);
      });
    };

    let disposed = false;
    const nebulaJob = (index: number): NebulaJob => ({
      type: "nebula",
      seed: NEBULA_LAYERS[index].seed,
      index,
      size: NEBULA_SIZE,
    });
    const drawNebula = (index: number) => {
      const target = nebulaRefs.current[index];
      const baked = peekBake(nebulaJob(index));
      if (target && baked) putPixels(target, baked[readTheme()]);
    };

    const paint = () => {
      const theme = readTheme();
      starfield.setTheme(theme);
      sky?.setTheme(theme === "light", SKY_INK[theme].star, SKY_INK[theme].title);
      // The clouds are baked off the main thread (both themes at once), so a
      // theme switch after the first bake is just a pixel copy.
      NEBULA_LAYERS.forEach((_, index) => {
        if (peekBake(nebulaJob(index))) {
          drawNebula(index);
          return;
        }
        void requestBake(nebulaJob(index)).then(() => {
          if (!disposed) drawNebula(index);
        });
      });
    };

    const measure = () => {
      const rect = host.getBoundingClientRect();
      hostTop = rect.top + window.scrollY;
      hostHeight = Math.max(1, rect.height);
      viewport = window.innerHeight || 1;
      width = window.innerWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(viewport * dpr);
      starfield.resize(width, viewport, dpr);
      sky?.resize(width, viewport, dpr);
    };

    const frame = (dt: number, frozen: boolean) => {
      const scroll = Math.max(0, window.scrollY - hostTop + viewport);
      const progress = Math.min(1, scroll / Math.max(1, hostHeight));
      elapsed += dt;

      if (sky && skyLive && sky.isLost()) setSkyLive(false);

      if (sky && skyLive) {
        // Read the titles' places before anything is written this frame.
        let slotA = -1;
        let slotB = -1;
        for (let index = 0; index < ghosts.length; index += 1) {
          if (!sky.hasTitle(index)) continue;
          const box = ghosts[index].getBoundingClientRect();
          const pad = titlePad[index];
          if (box.bottom + pad < 0 || box.top - pad > viewport) continue;
          const rect = rects[index];
          rect.x = box.left - pad;
          rect.y = box.top - pad;
          rect.w = box.width + pad * 2;
          rect.h = box.height + pad * 2;
          if (slotA < 0) slotA = index;
          else if (slotB < 0) slotB = index;
        }

        if (dt > 0) {
          const instant = (scroll - lastScroll) / dt;
          velocity += (instant - velocity) * (1 - Math.exp(-dt * 9));
        }
        // Until the pointer moves, a mass of its own wanders across the sky.
        const targetX = pointerSeen
          ? pointerX
          : width * (0.5 + 0.3 * Math.sin(elapsed * 0.23));
        const targetY = pointerSeen
          ? pointerY
          : viewport * (0.4 + 0.14 * Math.sin(elapsed * 0.31 + 1.3));
        const follow = dt > 0 ? 1 - Math.exp(-dt * 10) : 1;
        lensX += (targetX - lensX) * follow;
        lensY += (targetY - lensY) * follow;
        const size = Math.min(104, Math.max(58, Math.min(width, viewport) * 0.092));
        const ease = dt > 0 ? 1 - Math.exp(-dt * 4) : 1;
        theta += ((pointerSeen ? size : size * 0.82) - theta) * ease;
        ring += (0.16 - ring) * ease;

        starfield.setLens(lensX, lensY, theta);
        sky.render(
          {
            time: elapsed,
            scroll,
            lensX,
            lensY,
            theta,
            ring,
            stretch: Math.min(10.35, Math.abs(velocity) * 0.00414),
          },
          slotA,
          slotA >= 0 ? rects[slotA] : null,
          slotB,
          slotB >= 0 ? rects[slotB] : null,
        );
      } else {
        starfield.setBurst(1 - (scroll - viewport * 0.2) / (viewport * 0.8));
      }
      lastScroll = scroll;
      starfield.render(context, dt, scroll, frozen);

      const lean = starfield.lean();
      NEBULA_LAYERS.forEach((layer, index) => {
        const target = nebulaRefs.current[index];
        if (!target) return;
        const sway = frozen
          ? 0
          : Math.sin((elapsed / layer.period) * Math.PI * 2 + index) * layer.sway;
        const x = layer.x + sway - lean.x * (4 + index * 3);
        const y = layer.y + progress * layer.travel - lean.y * (3 + index * 2);
        target.style.transform = `translate3d(${x.toFixed(2)}vmax, ${y.toFixed(2)}vmax, 0)`;
        target.style.opacity = nebulaWeight(index, progress).toFixed(3);
      });
    };

    const loop = createFrameLoop(
      (callback) => window.requestAnimationFrame(callback),
      (handle) => window.cancelAnimationFrame(handle),
      (time) => {
        const dt = lastTime === 0 ? 0.016 : (time - lastTime) / 1000;
        lastTime = time;
        frame(dt, false);
        return visible && !document.hidden && !reducedMotion.matches;
      },
    );

    const wake = () => {
      if (reducedMotion.matches) {
        loop.stop();
        frame(0, true);
        return;
      }
      if (visible && !document.hidden) {
        lastTime = 0;
        loop.start();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      starfield.setPointer(event.clientX / window.innerWidth, event.clientY / viewport);
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerSeen) {
        pointerSeen = true;
        if (theta < 1) {
          lensX = pointerX;
          lensY = pointerY;
        }
      }
    };

    const onResize = () => {
      measure();
      buildTitles();
      wake();
    };

    // Reduced motion still follows the scroll, just without any animation.
    const onScroll = () => {
      if (reducedMotion.matches && visible) frame(0, true);
    };

    const resizeObserver = new ResizeObserver(onResize);
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      wake();
    });
    const themeObserver = new MutationObserver(() => {
      paint();
      // The two themes set the titles in different typefaces.
      buildTitles();
      wake();
    });

    setSkyLive(skyLive);
    paint();
    measure();
    lensX = width / 2;
    lensY = viewport * 0.4;
    buildTitles();
    // Web fonts may land after the first draw; redraw the titles once they do.
    void document.fonts?.ready.then(buildTitles);
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", wake);
    reducedMotion.addEventListener("change", wake);

    return () => {
      disposed = true;
      loop.stop();
      setSkyLive(false);
      sky?.dispose();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", wake);
      reducedMotion.removeEventListener("change", wake);
    };
  }, []);

  return (
    <div ref={hostRef} className="cosmos" aria-hidden="true">
      <div className="cosmos-stage">
        {NEBULA_LAYERS.map((layer, index) => (
          <canvas
            key={layer.seed}
            ref={(node) => {
              nebulaRefs.current[index] = node;
            }}
            className="cosmos-nebula"
            width={NEBULA_SIZE}
            height={NEBULA_SIZE}
          />
        ))}
        <canvas ref={lensRef} className="cosmos-stars" />
        <canvas ref={starsRef} className="cosmos-stars" />
      </div>
    </div>
  );
}
