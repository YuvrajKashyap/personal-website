"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { gravitationalEase } from "@/lib/motion/presets";

type WordRevealProps = Readonly<{
  text: string;
  className?: string;
  delay?: number;
  /** Re-run whenever the heading scrolls back into view. */
  inView?: boolean;
}>;

const containerVariants: Variants = {
  hidden: {},
  visible: (delay: number = 0) => ({
    transition: { staggerChildren: 0.055, delayChildren: delay },
  }),
};

const wordVariants: Variants = {
  hidden: { y: "108%", rotate: 4 },
  visible: {
    y: "0%",
    rotate: 0,
    transition: { duration: 0.86, ease: gravitationalEase },
  },
};

/**
 * Masked word-by-word rise for headings. Words stay whole, so titles wrap and
 * balance exactly as plain text would, and each one lifts out from behind its
 * own baseline like a title card.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  inView = false,
}: WordRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span
      className={`word-reveal${className ? ` ${className}` : ""}`}
      aria-label={text}
      custom={delay}
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { once: false, amount: 0.6 } : undefined}
      variants={containerVariants}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="word-reveal-mask">
            <motion.span className="word-reveal-word" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
