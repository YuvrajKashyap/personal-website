"use client";

import { useEffect, useRef } from "react";

import { pixelWorker } from "@/components/effects/pixel-worker-client";
import type {
  SpacetimePalette,
  SpacetimeVariant,
  StarSurfaceRemote,
} from "@/components/effects/spacetime-scene";
import type {
  SpacetimeFrame,
  SpacetimeWorkerRequest,
  SpacetimeWorkerResponse,
} from "@/components/effects/spacetime-worker-protocol";
import { createFrameLoop } from "@/lib/performance/animation-runtime";

/** The scene calls SpacetimeField makes, wherever the scene runs. */
type SceneHandle = Readonly<{
  resize: (width: number, height: number, dpr: number) => void;
  setPalette: (palette: SpacetimePalette, light: boolean) => void;
  setCursorHole: (enabled: boolean) => void;
  setScroll: (progress: number) => void;
  setPointer: (x: number, y: number, active: boolean) => void;
  pulse: (x: number, y: number) => void;
  render: (dt: number, frozen?: boolean) => void;
  dispose: () => void;
}>;

function startSceneWorker(): Worker | null {
  if (
    typeof Worker === "undefined" ||
    typeof OffscreenCanvas === "undefined" ||
    typeof createImageBitmap !== "function"
  ) {
    return null;
  }
  try {
    return new Worker(new URL("./spacetime.worker.ts", import.meta.url));
  } catch {
    return null;
  }
}

/**
 * The scene in a worker (spacetime.worker.ts), so none of its drawing happens
 * on the page's thread. Inputs are kept and sent with each frame, in the
 * order the scene would have received them. The worker hands back each
 * finished frame and it is copied pixel for pixel onto the page's canvas, so
 * the canvas the browser puts on screen is the same kind it always was.
 *
 * One frame is drawn at a time: if the worker is still busy, the newest frame
 * waits and carries the time that passed, as a slow frame on the page would.
 * If the worker fails, `onFail` puts the scene back on the page.
 */
function remoteScene(
  worker: Worker,
  canvas: HTMLCanvasElement,
  variant: SpacetimeVariant,
  onFail: () => void,
): SceneHandle | null {
  const context = canvas.getContext("2d");
  if (!context) return null;
  let scroll = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let busy = false;
  let waiting: SpacetimeFrame | null = null;
  const post = (message: SpacetimeWorkerRequest) => worker.postMessage(message);
  const flush = () => {
    if (busy || !waiting) return;
    busy = true;
    post(waiting);
    waiting = null;
  };
  worker.onmessage = (event: MessageEvent<SpacetimeWorkerResponse>) => {
    const message = event.data;
    if (message.type === "failed") {
      onFail();
      return;
    }
    busy = false;
    const frame = message.frame;
    if (frame) {
      // A frame drawn before a resize is dropped; the next one fits.
      if (frame.width === canvas.width && frame.height === canvas.height) {
        context.globalCompositeOperation = "copy";
        context.drawImage(frame, 0, 0);
      }
      frame.close();
    }
    flush();
  };
  worker.onerror = onFail;
  worker.onmessageerror = onFail;
  post({ type: "init", variant });
  return {
    resize: (width, height, dpr) => {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      post({ type: "resize", width, height, dpr });
    },
    setPalette: (palette, light) => post({ type: "palette", palette, light }),
    setCursorHole: (enabled) => post({ type: "hole", enabled }),
    setScroll: (progress) => {
      scroll = progress;
    },
    setPointer: (x, y, active) => {
      pointerX = x;
      pointerY = y;
      pointerActive = active;
    },
    pulse: (x, y) => post({ type: "pulse", x, y }),
    render: (dt, frozen = false) => {
      const carried = waiting && !waiting.frozen ? waiting.dt : 0;
      waiting = {
        type: "frame",
        dt: frozen ? 0 : carried + dt,
        frozen,
        scroll,
        pointerX,
        pointerY,
        pointerActive,
      };
      flush();
    },
    dispose: () => {
      worker.onmessage = null;
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
    },
  };
}

// Without a scene worker the scene runs here, as it always did, and the pixel
// worker paints the star's surface a frame ahead when it can.
const starRemote: StarSurfaceRemote = {
  paint: (t, core, mid, edge, done) => pixelWorker.paintStar(t, core, mid, edge, done),
  recycle: (pixels) => pixelWorker.recycleStar(pixels),
};

async function localScene(
  canvas: HTMLCanvasElement,
  variant: SpacetimeVariant,
): Promise<SceneHandle | null> {
  const context = canvas.getContext("2d");
  if (!context) return null;
  const { createSpacetimeScene } = await import("@/components/effects/spacetime-scene");
  const scene = createSpacetimeScene(variant, starRemote);
  return {
    resize: (width, height, dpr) => {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      scene.resize(width, height, dpr);
    },
    setPalette: scene.setPalette,
    setCursorHole: scene.setCursorHole,
    setScroll: scene.setScroll,
    setPointer: scene.setPointer,
    pulse: scene.pulse,
    render: (dt, frozen = false) => scene.render(context, dt, frozen),
    dispose: () => {},
  };
}

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
    if (!host || !canvas) return;

    let disposed = false;
    let stop: (() => void) | null = null;
    const run = (scene: SceneHandle | null) => {
      if (disposed || !scene) {
        scene?.dispose();
        return;
      }
      stop = runField(host, scene, variant);
    };
    const runHere = () => void localScene(canvas, variant).then(run);
    // The page's canvas is never handed over, so a failed worker just puts
    // the scene back on the page.
    const fallBack = () => {
      stop?.();
      stop = null;
      if (!disposed) runHere();
    };

    const worker = startSceneWorker();
    const remote = worker ? remoteScene(worker, canvas, variant, fallBack) : null;
    if (remote) run(remote);
    else {
      worker?.terminate();
      runHere();
    }

    return () => {
      disposed = true;
      stop?.();
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

/** Drives the scene from the page: size, palette, scroll, pointer, frames. */
function runField(host: HTMLDivElement, scene: SceneHandle, variant: SpacetimeVariant) {
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
      scene.render(dt);
      return visible && !document.hidden && !reducedMotion.matches;
    },
  );

  const drawStill = () => {
    syncInputs();
    scene.render(0, true);
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
    scene.dispose();
  };
}
