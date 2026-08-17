"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { MAIL_OPENED_EVENT, MAIL_SENT_EVENT } from "@/features/mail/mail-events";
import {
  createMailRoutesScene,
  type MailRoutesPalette,
} from "@/features/mail/mail-routes-scene";
import type {
  MailRoutesWorkerMessage,
  MailRoutesWorkerResponse,
} from "@/features/mail/mail-routes-worker-protocol";
import { createLatestFrameScheduler } from "@/lib/performance/runtime-utils";

type RouteCanvasProps = Readonly<{
  className?: string;
}>;

function readPalette(element: HTMLElement): MailRoutesPalette {
  const computed = getComputedStyle(element);
  const dark = element.dataset.theme !== "light";
  return {
    dark,
    accent: computed.getPropertyValue("--accent").trim() || "#f0c96a",
    secondary:
      computed.getPropertyValue("--accent-secondary").trim() || "#7db7ff",
    foreground:
      computed.getPropertyValue("--foreground").trim() || "#f6f1e8",
    plane: dark
      ? computed.getPropertyValue("--accent").trim() || "#f0c96a"
      : "#b8352c",
  };
}

function measureCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  };
}

/**
 * The sky of the page: dashed flight arcs with paper planes riding them, each
 * dragging a fading comet trail, plus ambient depth specks. The exact existing
 * renderer is shared by the main-thread fallback and an OffscreenCanvas worker;
 * supported browsers keep its painting work away from UI input and scrolling.
 */
export function MailRoutesCanvas({ className }: RouteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [workerFailed, setWorkerFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion === true;

  useEffect(() => {
    let disposed = false;
    let teardownRuntime: (() => void) | undefined;

    // Deferring one frame avoids transferring the same canvas twice during
    // React's development-only strict effect replay.
    const setupFrame = window.requestAnimationFrame(() => {
      if (disposed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (reduceMotion) {
        const context = canvas.getContext("2d");
        if (!context) return;
        const scene = createMailRoutesScene(context);
        scene.setPalette(readPalette(document.documentElement));

        const draw = () => {
          const size = measureCanvas(canvas);
          scene.resize(size.width, size.height, size.dpr);
          scene.drawStatic();
        };
        draw();

        const resizeObserver = new ResizeObserver(draw);
        resizeObserver.observe(canvas);
        const themeObserver = new MutationObserver(() => {
          scene.setPalette(readPalette(document.documentElement));
          scene.drawStatic();
        });
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"],
        });

        teardownRuntime = () => {
          resizeObserver.disconnect();
          themeObserver.disconnect();
        };
        return;
      }

      let animationFrame = 0;
      let worker: Worker | null = null;
      let workerReady = false;
      let workerAutonomous = false;
      let running = true;
      let visible = true;
      let pointerTargetX = 0;
      let pointerTargetY = 0;
      let pointerDirty = true;
      let syncAnimationDriver = () => {};

      type Driver = {
        resize: (width: number, height: number, dpr: number) => void;
        renderFrame: (time: number) => void;
        resetTiming: () => void;
        setPointerTarget: (x: number, y: number) => void;
        setPalette: (palette: MailRoutesPalette) => void;
        triggerOpened: () => void;
        triggerSent: () => void;
        pause: () => void;
        resume: () => void;
      };

      let driver: Driver;
      const canTransfer =
        !workerFailed &&
        typeof Worker !== "undefined" &&
        typeof canvas.transferControlToOffscreen === "function";

      if (canTransfer) {
        worker = new Worker(new URL("./mail-routes.worker.ts", import.meta.url), {
          type: "module",
          name: "mail-routes",
        });
        const offscreen = canvas.transferControlToOffscreen();
        const size = measureCanvas(canvas);
        worker.onerror = () => {
          if (!disposed) setWorkerFailed(true);
        };
        worker.onmessage = (event: MessageEvent<MailRoutesWorkerResponse>) => {
          if (event.data.type === "ready") {
            workerAutonomous = event.data.autonomous;
            workerReady = true;
            if (workerAutonomous) {
              worker?.postMessage({
                type: "pointer",
                x: pointerTargetX,
                y: pointerTargetY,
              } satisfies MailRoutesWorkerMessage);
              pointerDirty = false;
            }
            syncAnimationDriver();
          } else {
            workerReady = true;
          }
        };
        worker.postMessage(
          {
            type: "init",
            canvas: offscreen,
            ...size,
            palette: readPalette(document.documentElement),
            timeOrigin: performance.timeOrigin,
          } satisfies MailRoutesWorkerMessage,
          [offscreen],
        );

        const post = (message: MailRoutesWorkerMessage) => worker?.postMessage(message);
        driver = {
          resize: (width, height, dpr) =>
            post({ type: "resize", width, height, dpr }),
          renderFrame: (time) => {
            if (!workerReady || workerAutonomous) return;
            workerReady = false;
            post({ type: "frame", time });
          },
          resetTiming: () => post({ type: "reset-timing" }),
          setPointerTarget: (x, y) => post({ type: "pointer", x, y }),
          setPalette: (palette) => post({ type: "palette", palette }),
          triggerOpened: () => post({ type: "opened" }),
          triggerSent: () => post({ type: "sent" }),
          pause: () => post({ type: "pause" }),
          resume: () => post({ type: "resume" }),
        };
      } else {
        const context = canvas.getContext("2d");
        if (!context) return;
        const scene = createMailRoutesScene(context);
        scene.setPalette(readPalette(document.documentElement));
        const size = measureCanvas(canvas);
        scene.resize(size.width, size.height, size.dpr);
        driver = {
          resize: scene.resize,
          renderFrame: scene.renderFrame,
          resetTiming: scene.resetTiming,
          setPointerTarget: scene.setPointerTarget,
          setPalette: scene.setPalette,
          triggerOpened: scene.triggerOpened,
          triggerSent: scene.triggerSent,
          pause: () => {},
          resume: () => {},
        };
      }

      const pointerScheduler = createLatestFrameScheduler<{
        x: number;
        y: number;
      }>(
        (callback) => window.requestAnimationFrame(callback),
        (frame) => window.cancelAnimationFrame(frame),
        ({ x, y }) => {
          driver.setPointerTarget(x, y);
          pointerDirty = false;
        },
      );
      const flushPointerTarget = () => {
        if (!pointerDirty) return;
        pointerDirty = false;
        driver.setPointerTarget(pointerTargetX, pointerTargetY);
      };
      const shouldRun = () => running && visible && !document.hidden;
      const stopMainFrames = () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      };
      const renderFrame = (time: number) => {
        flushPointerTarget();
        driver.renderFrame(time);
        animationFrame = shouldRun() && !workerAutonomous
          ? window.requestAnimationFrame(renderFrame)
          : 0;
      };
      const startMainFrames = () => {
        if (!animationFrame && shouldRun()) {
          driver.resetTiming();
          animationFrame = window.requestAnimationFrame(renderFrame);
        }
      };
      syncAnimationDriver = () => {
        if (shouldRun()) {
          driver.resume();
          if (workerAutonomous) stopMainFrames();
          else startMainFrames();
        } else {
          driver.pause();
          stopMainFrames();
        }
      };
      const resize = () => {
        const size = measureCanvas(canvas);
        driver.resize(size.width, size.height, size.dpr);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
        syncAnimationDriver();
      });
      intersectionObserver.observe(canvas);
      const themeObserver = new MutationObserver(() => {
        driver.setPalette(readPalette(document.documentElement));
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      const handleVisibility = () => {
        syncAnimationDriver();
      };
      const handlePointerMove = (event: PointerEvent) => {
        pointerTargetX = (event.clientX / window.innerWidth - 0.5) * 2;
        pointerTargetY = (event.clientY / window.innerHeight - 0.5) * 2;
        pointerDirty = true;
        if (workerAutonomous) {
          pointerScheduler.schedule({ x: pointerTargetX, y: pointerTargetY });
        }
      };
      const handleOpened = () => driver.triggerOpened();
      const handleSent = () => driver.triggerSent();

      document.addEventListener("visibilitychange", handleVisibility);
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener(MAIL_OPENED_EVENT, handleOpened);
      window.addEventListener(MAIL_SENT_EVENT, handleSent);
      syncAnimationDriver();

      teardownRuntime = () => {
        running = false;
        syncAnimationDriver();
        pointerScheduler.cancel();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        themeObserver.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener(MAIL_OPENED_EVENT, handleOpened);
        window.removeEventListener(MAIL_SENT_EVENT, handleSent);
        worker?.terminate();
      };
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(setupFrame);
      teardownRuntime?.();
    };
  }, [reduceMotion, workerFailed]);

  return (
    <canvas
      key={workerFailed ? "main" : "worker"}
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
