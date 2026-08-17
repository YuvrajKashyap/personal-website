"use client";

import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useCursorTrailEnabled } from "@/components/theme/CursorTrailToggle";
import { createCursorTrailScene } from "@/components/motion/cursor-trail-scene";
import type {
  CursorTrailWorkerMessage,
  CursorTrailWorkerResponse,
} from "@/components/motion/cursor-trail-worker-protocol";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToFinePointer(callback: () => void) {
  const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="submit"]',
  "select",
  "summary",
  "label",
  "[data-cursor-pointer]",
].join(", ");

const TEXT_FIELD_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea';
const TRAIL_LIFE_MS = 380;

type TrailController = {
  pushPoint: (x: number, y: number, time: number) => void;
};

export function SiteCursor() {
  const shouldReduceMotion = useReducedMotion();
  const hasFinePointer = useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
  const isActive = hasFinePointer && !shouldReduceMotion;
  const trailEnabled = useCursorTrailEnabled();
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isHiddenZone, setIsHiddenZone] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [trailWorkerFailed, setTrailWorkerFailed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const trailControllerRef = useRef<TrailController | null>(null);
  const visibleRef = useRef(false);
  const pointerRef = useRef(false);
  const hiddenZoneRef = useRef(false);
  const downRef = useRef(false);

  useEffect(() => {
    if (!isActive) return undefined;

    document.documentElement.dataset.customCursor = "true";

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;

      x.set(event.clientX);
      y.set(event.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
      trailControllerRef.current?.pushPoint(
        event.clientX,
        event.clientY,
        performance.now(),
      );
    }

    function onPointerOver(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const nextHiddenZone = Boolean(target.closest(TEXT_FIELD_SELECTOR));
      const nextPointer = Boolean(target.closest(INTERACTIVE_SELECTOR));
      if (nextHiddenZone !== hiddenZoneRef.current) {
        hiddenZoneRef.current = nextHiddenZone;
        setIsHiddenZone(nextHiddenZone);
      }
      if (nextPointer !== pointerRef.current) {
        pointerRef.current = nextPointer;
        setIsPointer(nextPointer);
      }
    }

    function onPointerDown() {
      if (!downRef.current) {
        downRef.current = true;
        setIsDown(true);
      }
    }

    function onPointerUp() {
      if (downRef.current) {
        downRef.current = false;
        setIsDown(false);
      }
    }

    function onLeaveWindow() {
      if (visibleRef.current) {
        visibleRef.current = false;
        setIsVisible(false);
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("blur", onLeaveWindow);

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("blur", onLeaveWindow);
    };
  }, [isActive, x, y]);

  useEffect(() => {
    if (!isActive || !trailEnabled) {
      trailControllerRef.current = null;
      return undefined;
    }

    let disposed = false;
    let teardownRuntime: (() => void) | undefined;
    const setupFrame = window.requestAnimationFrame(() => {
      if (disposed) return;
      const canvas = trailRef.current;
      if (!canvas) return;

      let frame = 0;
      let lastPointAt = Number.NEGATIVE_INFINITY;
      let trailWasActive = false;
      let worker: Worker | null = null;
      let workerReady = false;
      let workerAutonomous = false;

      type Driver = {
        pushPoint: (x: number, y: number, time: number) => void;
        renderFrame: (time: number) => boolean | undefined;
        resize: () => void;
      };
      let driver: Driver;

      const canvasSize = () => ({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      const canTransfer =
        !trailWorkerFailed &&
        typeof Worker !== "undefined" &&
        typeof canvas.transferControlToOffscreen === "function";

      if (canTransfer) {
        worker = new Worker(new URL("./cursor-trail.worker.ts", import.meta.url), {
          type: "module",
          name: "cursor-trail",
        });
        const offscreen = canvas.transferControlToOffscreen();
        worker.onerror = () => {
          if (!disposed) setTrailWorkerFailed(true);
        };
        worker.onmessage = (event: MessageEvent<CursorTrailWorkerResponse>) => {
          workerReady = true;
          if (event.data.type === "ready") {
            workerAutonomous = event.data.autonomous;
            if (workerAutonomous && frame) {
              window.cancelAnimationFrame(frame);
              frame = 0;
            }
          } else {
            trailWasActive = event.data.active;
          }
        };
        worker.postMessage(
          {
            type: "init",
            canvas: offscreen,
            ...canvasSize(),
            timeOrigin: performance.timeOrigin,
          } satisfies CursorTrailWorkerMessage,
          [offscreen],
        );
        const post = (message: CursorTrailWorkerMessage) => worker?.postMessage(message);
        driver = {
          pushPoint: (pointX, pointY, time) =>
            post({ type: "point", x: pointX, y: pointY, time }),
          renderFrame: (time) => {
            if (!workerReady) return undefined;
            workerReady = false;
            post({ type: "frame", time });
            return undefined;
          },
          resize: () => post({ type: "resize", ...canvasSize() }),
        };
      } else {
        const context = canvas.getContext("2d");
        if (!context) return;
        const scene = createCursorTrailScene(context);
        const resize = () => {
          const size = canvasSize();
          scene.resize(size.width, size.height, size.dpr);
        };
        resize();
        workerReady = true;
        driver = {
          pushPoint: scene.pushPoint,
          renderFrame: scene.renderFrame,
          resize,
        };
      }

      const schedule = () => {
        if (!frame) frame = window.requestAnimationFrame(drawTrail);
      };
      const drawTrail = () => {
        frame = 0;
        const now = performance.now();
        const withinLifetime = now - lastPointAt <= TRAIL_LIFE_MS;
        if (worker) {
          if (workerAutonomous) return;
          if (workerReady && (withinLifetime || trailWasActive)) {
            driver.renderFrame(now);
          }
          if (withinLifetime || trailWasActive || !workerReady) schedule();
          return;
        }

        trailWasActive = driver.renderFrame(now) ?? false;
        if (trailWasActive) schedule();
      };

      const controller: TrailController = {
        pushPoint(pointX, pointY, time) {
          lastPointAt = time;
          trailWasActive = true;
          driver.pushPoint(pointX, pointY, time);
          if (!workerAutonomous) schedule();
        },
      };
      trailControllerRef.current = controller;
      window.addEventListener("resize", driver.resize, { passive: true });

      teardownRuntime = () => {
        if (trailControllerRef.current === controller) {
          trailControllerRef.current = null;
        }
        window.removeEventListener("resize", driver.resize);
        if (frame) window.cancelAnimationFrame(frame);
        worker?.terminate();
      };
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(setupFrame);
      teardownRuntime?.();
    };
  }, [isActive, trailEnabled, trailWorkerFailed]);

  if (!isActive) return null;

  const stateClass = [
    isVisible && !isHiddenZone ? "is-visible" : "",
    isPointer ? "is-pointer" : "",
    isDown ? "is-down" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`site-cursor ${stateClass}`} aria-hidden="true">
      {trailEnabled ? (
        <canvas
          key={trailWorkerFailed ? "main" : "worker"}
          ref={trailRef}
          className="site-cursor-trail"
        />
      ) : null}
      <motion.span className="site-cursor-anchor" style={{ x, y }}>
        <span className="site-cursor-halo" />
        <span className="site-cursor-dot" />
      </motion.span>
    </div>
  );
}
