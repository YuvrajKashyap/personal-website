"use client";

import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  CURSOR_TRAIL_EVENT,
  isCursorTrailEnabled,
} from "@/components/theme/CursorTrailToggle";

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
const TRAIL_MAX_POINTS = 70;
const TRAIL_COLOR = "232, 38, 45";

export function SiteCursor() {
  const shouldReduceMotion = useReducedMotion();
  const hasFinePointer = useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
  const isActive = hasFinePointer && !shouldReduceMotion;
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isHiddenZone, setIsHiddenZone] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    document.documentElement.dataset.customCursor = "true";

    // Fading red ribbon that chases the dot, drawn on its own canvas so the
    // cursor itself stays untouched. The rAF loop only runs while points are
    // alive and stops on its own once the trail has fully faded.
    const trailCanvas = trailRef.current;
    const trailCtx = trailCanvas?.getContext("2d");
    const trailPoints: Array<{ x: number; y: number; t: number }> = [];
    let trailFrame = 0;
    let trailDpr = 1;
    let trailEnabled = isCursorTrailEnabled();

    function onTrailToggle() {
      trailEnabled = isCursorTrailEnabled();

      if (!trailEnabled) {
        trailPoints.length = 0;

        if (trailCtx && trailCanvas) {
          trailCtx.setTransform(1, 0, 0, 1, 0, 0);
          trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        }
      }
    }

    function sizeTrailCanvas() {
      if (!trailCanvas) {
        return;
      }

      trailDpr = Math.min(window.devicePixelRatio || 1, 2);
      trailCanvas.width = Math.round(window.innerWidth * trailDpr);
      trailCanvas.height = Math.round(window.innerHeight * trailDpr);
    }

    function drawTrail() {
      trailFrame = 0;

      if (!trailCtx || !trailCanvas) {
        return;
      }

      const now = performance.now();

      while (trailPoints.length && now - trailPoints[0].t > TRAIL_LIFE_MS) {
        trailPoints.shift();
      }

      trailCtx.setTransform(trailDpr, 0, 0, trailDpr, 0, 0);
      trailCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (trailPoints.length > 1) {
        trailCtx.globalCompositeOperation = "lighter";
        trailCtx.lineCap = "round";
        trailCtx.lineJoin = "round";

        for (let i = 1; i < trailPoints.length; i += 1) {
          const from = trailPoints[i - 1];
          const to = trailPoints[i];
          const strength = Math.max(0, 1 - (now - to.t) / TRAIL_LIFE_MS);

          // soft glow pass under a crisp core pass
          trailCtx.strokeStyle = `rgba(${TRAIL_COLOR}, ${strength * 0.12})`;
          trailCtx.lineWidth = 2 + strength * 9;
          trailCtx.beginPath();
          trailCtx.moveTo(from.x, from.y);
          trailCtx.lineTo(to.x, to.y);
          trailCtx.stroke();

          trailCtx.strokeStyle = `rgba(${TRAIL_COLOR}, ${strength * 0.55})`;
          trailCtx.lineWidth = 0.6 + strength * 2.6;
          trailCtx.beginPath();
          trailCtx.moveTo(from.x, from.y);
          trailCtx.lineTo(to.x, to.y);
          trailCtx.stroke();
        }

        trailCtx.globalCompositeOperation = "source-over";
      }

      if (trailPoints.length) {
        trailFrame = window.requestAnimationFrame(drawTrail);
      }
    }

    sizeTrailCanvas();

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);

      if (!trailEnabled) {
        return;
      }

      trailPoints.push({
        x: event.clientX,
        y: event.clientY,
        t: performance.now(),
      });

      if (trailPoints.length > TRAIL_MAX_POINTS) {
        trailPoints.shift();
      }

      if (!trailFrame) {
        trailFrame = window.requestAnimationFrame(drawTrail);
      }
    }

    function onPointerOver(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      setIsHiddenZone(Boolean(target.closest(TEXT_FIELD_SELECTOR)));
      setIsPointer(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    }

    function onPointerDown() {
      setIsDown(true);
    }

    function onPointerUp() {
      setIsDown(false);
    }

    function onLeaveWindow() {
      setIsVisible(false);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("blur", onLeaveWindow);
    window.addEventListener("resize", sizeTrailCanvas, { passive: true });
    window.addEventListener(CURSOR_TRAIL_EVENT, onTrailToggle);

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener(
        "pointerleave",
        onLeaveWindow,
      );
      window.removeEventListener("blur", onLeaveWindow);
      window.removeEventListener("resize", sizeTrailCanvas);
      window.removeEventListener(CURSOR_TRAIL_EVENT, onTrailToggle);

      if (trailFrame) {
        window.cancelAnimationFrame(trailFrame);
      }
    };
  }, [isActive, x, y]);

  if (!isActive) {
    return null;
  }

  const stateClass = [
    isVisible && !isHiddenZone ? "is-visible" : "",
    isPointer ? "is-pointer" : "",
    isDown ? "is-down" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`site-cursor ${stateClass}`} aria-hidden="true">
      <canvas ref={trailRef} className="site-cursor-trail" />
      <motion.span className="site-cursor-anchor" style={{ x, y }}>
        <span className="site-cursor-halo" />
        <span className="site-cursor-dot" />
      </motion.span>
    </div>
  );
}
