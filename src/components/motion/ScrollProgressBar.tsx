"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.3,
  });

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
