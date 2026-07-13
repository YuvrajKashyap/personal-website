"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

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

const TEXT_FIELD_SELECTOR = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea';

const ringSpring = { stiffness: 620, damping: 38, mass: 0.55 } as const;
const trailSprings = [
  { stiffness: 420, damping: 34, mass: 0.6 },
  { stiffness: 300, damping: 32, mass: 0.65 },
  { stiffness: 210, damping: 30, mass: 0.7 },
  { stiffness: 150, damping: 28, mass: 0.75 },
] as const;

export function VortexCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isHiddenZone, setIsHiddenZone] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, ringSpring);
  const ringY = useSpring(y, ringSpring);
  const trail0X = useSpring(ringX, trailSprings[0]);
  const trail0Y = useSpring(ringY, trailSprings[0]);
  const trail1X = useSpring(trail0X, trailSprings[1]);
  const trail1Y = useSpring(trail0Y, trailSprings[1]);
  const trail2X = useSpring(trail1X, trailSprings[2]);
  const trail2Y = useSpring(trail1Y, trailSprings[2]);
  const trail3X = useSpring(trail2X, trailSprings[3]);
  const trail3Y = useSpring(trail2Y, trailSprings[3]);

  const trailDots = [
    { x: trail0X, y: trail0Y },
    { x: trail1X, y: trail1Y },
    { x: trail2X, y: trail2Y },
    { x: trail3X, y: trail3Y },
  ];

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }

    setIsActive(true);
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
  }, [shouldReduceMotion, x, y]);

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
    <div className={`vortex-cursor ${stateClass}`} aria-hidden="true">
      {trailDots.map((dot, index) => (
        <motion.span
          key={index}
          className={`vortex-cursor-trail vortex-cursor-trail-${index}`}
          style={{ x: dot.x, y: dot.y }}
        />
      ))}
      <motion.span
        className="vortex-cursor-ring"
        style={{ x: ringX, y: ringY }}
      >
        <span className="vortex-cursor-ring-inner">
          <span className="vortex-cursor-swirl" />
          <span className="vortex-cursor-swirl vortex-cursor-swirl-reverse" />
        </span>
      </motion.span>
      <motion.span className="vortex-cursor-core" style={{ x, y }}>
        <span className="vortex-cursor-core-dot" />
      </motion.span>
    </div>
  );
}
