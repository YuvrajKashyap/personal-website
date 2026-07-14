"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxDriftProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Total vertical drift in px across the element's scroll range. */
  range?: number;
}>;

export function ParallaxDrift({
  children,
  className,
  range = 26,
}: ParallaxDriftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
