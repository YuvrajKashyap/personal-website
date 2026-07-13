"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

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

const ringSpring = { stiffness: 560, damping: 42, mass: 0.5 } as const;

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
  const ringX = useSpring(x, ringSpring);
  const ringY = useSpring(y, ringSpring);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    document.documentElement.dataset.customCursor = "true";

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);
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
      <motion.span
        className="site-cursor-ring"
        style={{ x: ringX, y: ringY }}
      >
        <span className="site-cursor-ring-inner">
          <span className="site-cursor-ring-base" />
          <span className="site-cursor-ring-arc" />
        </span>
      </motion.span>
      <motion.span className="site-cursor-core" style={{ x, y }}>
        <span className="site-cursor-dot" />
      </motion.span>
    </div>
  );
}
