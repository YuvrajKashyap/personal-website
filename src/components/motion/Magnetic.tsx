"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

type MagneticProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Fraction of the cursor offset applied at the element center. */
  strength?: number;
  /** Attraction radius in px, measured from the element center. */
  radius?: number;
}>;

const magneticSpring = {
  stiffness: 260,
  damping: 22,
  mass: 0.5,
} as const;

type MagneticTarget = {
  element: HTMLDivElement;
  radius: number;
  strength: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  renderedX: MotionValue<number>;
  renderedY: MotionValue<number>;
  centerX: number;
  centerY: number;
  active: boolean;
  nearby: boolean;
};

const magneticTargets = new Set<MagneticTarget>();
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;

function measureTarget(target: MagneticTarget) {
  const rect = target.element.getBoundingClientRect();
  target.centerX =
    rect.left + window.scrollX + rect.width / 2 - target.renderedX.get();
  target.centerY =
    rect.top + window.scrollY + rect.height / 2 - target.renderedY.get();
}

function resetTarget(target: MagneticTarget) {
  if (!target.active) {
    return;
  }

  target.active = false;
  target.x.set(0);
  target.y.set(0);
}

function updateMagneticTargets() {
  pointerFrame = 0;

  magneticTargets.forEach((target) => {
    let deltaX = pointerX - (target.centerX + target.renderedX.get());
    let deltaY = pointerY - (target.centerY + target.renderedY.get());
    let distance = Math.hypot(deltaX, deltaY);

    if (distance >= target.radius + 48) {
      target.nearby = false;
    } else if (!target.nearby) {
      target.nearby = true;
      measureTarget(target);
      deltaX = pointerX - (target.centerX + target.renderedX.get());
      deltaY = pointerY - (target.centerY + target.renderedY.get());
      distance = Math.hypot(deltaX, deltaY);
    }

    if (distance >= target.radius) {
      resetTarget(target);
      return;
    }

    target.active = true;
    const pull = (1 - distance / target.radius) * target.strength;
    target.x.set(deltaX * pull);
    target.y.set(deltaY * pull);
  });
}

function handlePointerMove(event: PointerEvent) {
  pointerX = event.pageX;
  pointerY = event.pageY;

  if (!pointerFrame) {
    pointerFrame = window.requestAnimationFrame(updateMagneticTargets);
  }
}

function handlePointerLeave() {
  magneticTargets.forEach(resetTarget);
}

function measureAllTargets() {
  magneticTargets.forEach(measureTarget);
}

function registerTarget(target: MagneticTarget) {
  magneticTargets.add(target);
  measureTarget(target);

  if (magneticTargets.size === 1) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", measureAllTargets, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  }

  return () => {
    magneticTargets.delete(target);

    if (magneticTargets.size === 0) {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", measureAllTargets);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );

      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
      }
    }
  };
}

export function Magnetic({
  children,
  className,
  strength = 0.34,
  radius = 130,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, magneticSpring);
  const springY = useSpring(y, magneticSpring);

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }

    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const target: MagneticTarget = {
      element,
      radius,
      strength,
      x,
      y,
      renderedX: springX,
      renderedY: springY,
      centerX: 0,
      centerY: 0,
      active: false,
      nearby: false,
    };
    const unregister = registerTarget(target);
    const observer = new ResizeObserver(() => measureTarget(target));
    observer.observe(element);

    return () => {
      observer.disconnect();
      unregister();
    };
  }, [radius, shouldReduceMotion, springX, springY, strength, x, y]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} ref={ref} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
}
