"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

type TimelineRailProps = Readonly<{
  children: ReactNode;
  className: string;
  ariaLabel: string;
}>;

export function TimelineRail({ children, className, ariaLabel }: TimelineRailProps) {
  const railRef = useRef<HTMLOListElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.82", "end 0.4"],
  });

  return (
    <ol ref={railRef} aria-label={ariaLabel} className={className}>
      {!shouldReduceMotion ? (
        <motion.span
          className="timeline-progress-fill"
          aria-hidden="true"
          style={{ scaleY: scrollYProgress }}
        />
      ) : null}
      {children}
    </ol>
  );
}
