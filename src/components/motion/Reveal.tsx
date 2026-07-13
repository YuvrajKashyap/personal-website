"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  blurIn,
  chipReveal,
  ctaReveal,
  fadeIn,
  fadeUp,
  getRevealTransition,
  reducedMotionReveal,
  scaleSoft,
} from "@/lib/motion/presets";

type RevealVariant = "fade-up" | "fade-in" | "scale-soft" | "chip" | "cta" | "blur-in";

type RevealProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
  variant?: RevealVariant;
}>;

const revealVariants = {
  "fade-up": fadeUp,
  "fade-in": fadeIn,
  "scale-soft": scaleSoft,
  chip: chipReveal,
  cta: ctaReveal,
  "blur-in": blurIn,
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
  inView = true,
  variant = "fade-up",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { amount: 0.2, once: true } : undefined}
      variants={shouldReduceMotion ? reducedMotionReveal : revealVariants[variant]}
      transition={getRevealTransition(shouldReduceMotion ? 0 : delay)}
    >
      {children}
    </motion.div>
  );
}
