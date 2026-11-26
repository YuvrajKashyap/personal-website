"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

import { scrollCueMotion, slowRevealTransition } from "@/lib/motion/presets";

export function MotionScrollCue() {
  const shouldReduceMotion = useReducedMotion();
  const pulseRef = useRef<HTMLSpanElement>(null);

  // The line's endless pulse is a CSS animation (home-scroll-cue-pulse in
  // globals.css: the same curves and period it had as a motion animation),
  // so the compositor runs it instead of a script restyling the
  // line every frame for as long as the page is open. It starts when the
  // page hydrates, the moment the motion version started.
  useEffect(() => {
    const line = pulseRef.current;
    if (!line || shouldReduceMotion) return;
    line.classList.add("home-scroll-cue-pulse");
    return () => line.classList.remove("home-scroll-cue-pulse");
  }, [shouldReduceMotion]);

  return (
    <motion.div
      className="home-scroll-cue"
      aria-hidden="true"
      initial={shouldReduceMotion ? false : scrollCueMotion.initial}
      animate={scrollCueMotion.animate}
      transition={slowRevealTransition}
    >
      <span>Scroll</span>
      <span ref={pulseRef} className="h-10 w-px bg-[image:var(--gradient-orbital)]" />
    </motion.div>
  );
}
