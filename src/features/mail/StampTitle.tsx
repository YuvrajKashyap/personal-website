"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { useSectionReveal } from "@/components/motion/SectionRevealContext";

import styles from "./MailPage.module.css";

type StampTitleProps = Readonly<{
  text: string;
  className?: string;
}>;

/** Deterministic rubber-stamp rotation jitter per letter. */
const STAMP_TILTS = [-7, 5, -3, 6, -5, 3, -6, 4, -2, 5, -4, 6, -3, 4, -5];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.062,
      delayChildren: 0.18,
    },
  },
};

function stampVariants(tilt: number): Variants {
  return {
    hidden: {
      opacity: 0,
      scale: 2.1,
      rotate: tilt,
      y: -8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        opacity: { duration: 0.12, ease: [0.4, 0, 0.2, 1] },
        default: { type: "spring", stiffness: 520, damping: 26, mass: 0.7 },
      },
    },
  };
}

/**
 * "Stamp cascade" headline: each letter slams down like a rubber stamp,
 * oversized and slightly rotated, snapping flat with a heavy spring. Letters
 * lift on hover via a CSS transform on the outer span (the inner motion span
 * owns the entrance transform, so the two never clobber each other).
 */
export function StampTitle({ text, className }: StampTitleProps) {
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  const sectionDriven = section !== null;
  const words = text.split(" ");
  let letterIndex = 0;

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`${styles.stampTitle} ${className ?? ""}`}
      aria-label={text}
      role="text"
      initial="hidden"
      animate={sectionDriven ? (section ? "visible" : "hidden") : undefined}
      whileInView={sectionDriven ? undefined : "visible"}
      viewport={sectionDriven ? undefined : { amount: 0.4, once: false }}
      variants={containerVariants}
    >
      {words.map((word, wordIndex) => (
        <span className={styles.stampWord} key={`${word}-${wordIndex}`} aria-hidden="true">
          {Array.from(word).map((char, charInWord) => {
            const tilt = STAMP_TILTS[letterIndex % STAMP_TILTS.length];
            letterIndex += 1;
            return (
              <span className={styles.stampChar} key={`${char}-${charInWord}`}>
                <motion.span
                  className={styles.stampCharInner}
                  variants={stampVariants(tilt)}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}
