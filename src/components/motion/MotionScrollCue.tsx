"use client";

import { motion, useReducedMotion } from "motion/react";

import { scrollCueMotion, slowRevealTransition } from "@/lib/motion/presets";

export function MotionScrollCue() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="home-scroll-cue"
      aria-hidden="true"
      initial={shouldReduceMotion ? false : scrollCueMotion.initial}
      animate={scrollCueMotion.animate}
      transition={slowRevealTransition}
    >
      <span>Scroll</span>
      <motion.span
        className="h-10 w-px bg-[image:var(--gradient-orbital)]"
        animate={shouldReduceMotion ? undefined : scrollCueMotion.pulse}
        transition={{
          duration: 2.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}
