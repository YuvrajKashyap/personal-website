"use client";

import { motion, useReducedMotion } from "motion/react";

import { useSectionReveal } from "@/components/motion/SectionRevealContext";
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
  viewportAmount?: number | "some" | "all";
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
  viewportAmount = 0.2,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  // Driven by the surrounding section when one is present and this Reveal is in
  // its scroll-triggered ("inView") mode — so it reveals/hides with the whole
  // section rather than on its own threshold.
  const sectionDriven = inView && section !== null;

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={
        sectionDriven
          ? section
            ? "visible"
            : "hidden"
          : inView
            ? undefined
            : "visible"
      }
      whileInView={sectionDriven || !inView ? undefined : "visible"}
      viewport={
        sectionDriven || !inView
          ? undefined
          : { amount: viewportAmount, once: false }
      }
      variants={shouldReduceMotion ? reducedMotionReveal : revealVariants[variant]}
      transition={getRevealTransition(shouldReduceMotion ? 0 : delay)}
    >
      {children}
    </motion.div>
  );
}
