"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { CSSProperties } from "react";

type SplitTextRevealProps = Readonly<{
  text: string;
  /** "rise": letters float up out of a blur. "flip": letters flip up from flat. */
  variant?: "rise" | "flip";
  /** Adds the gold hover-wave ripple on top of the entrance animation. */
  hoverWave?: boolean;
  className?: string;
}>;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.038, delayChildren: 0.06 },
  },
};

const charVariants: Record<"rise" | "flip", Variants> = {
  rise: {
    hidden: { y: "0.85em", opacity: 0, filter: "blur(8px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 340, damping: 26, mass: 0.8 },
    },
  },
  flip: {
    hidden: { rotateX: -95, y: "0.3em", opacity: 0 },
    visible: {
      rotateX: 0,
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 290, damping: 19, mass: 0.7 },
    },
  },
};

/**
 * Per-letter scroll-triggered reveal: "rise" floats letters up out of a blur,
 * "flip" swings them up from flat like tiles, both staggered left-to-right.
 * With `hoverWave`, letters also ripple gold on hover (the wave lives on a
 * wrapper span so it never conflicts with the entrance transform).
 */
export function SplitTextReveal({
  text,
  variant = "rise",
  hoverWave = false,
  className,
}: SplitTextRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`split-text split-text-${variant}${hoverWave ? " hover-wave" : ""}${className ? ` ${className}` : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.7 }}
      variants={containerVariants}
      aria-label={text}
    >
      {Array.from(text).map((char, index) => {
        const glyph = (
          <motion.span
            key={hoverWave ? undefined : `${char}-${index}`}
            aria-hidden={hoverWave ? undefined : "true"}
            className="split-text-char"
            variants={charVariants[variant]}
          >
            {char === " " ? " " : char}
          </motion.span>
        );

        return hoverWave ? (
          <span
            key={`${char}-${index}`}
            aria-hidden="true"
            className="hover-wave-char"
            style={{ "--wave-i": index } as CSSProperties}
          >
            {glyph}
          </span>
        ) : (
          glyph
        );
      })}
    </motion.span>
  );
}
