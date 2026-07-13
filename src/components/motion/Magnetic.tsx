"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
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

    let frame = 0;

    function onPointerMove(event: PointerEvent) {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const element = ref.current;

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const deltaX = event.clientX - (rect.left + rect.width / 2);
        const deltaY = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < radius) {
          const pull = (1 - distance / radius) * strength;
          x.set(deltaX * pull);
          y.set(deltaY * pull);
        } else {
          x.set(0);
          y.set(0);
        }
      });
    }

    function onPointerLeave() {
      x.set(0);
      y.set(0);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [radius, shouldReduceMotion, strength, x, y]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} ref={ref} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
}
