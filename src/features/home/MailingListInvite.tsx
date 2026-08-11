"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { Magnetic } from "@/components/motion/Magnetic";
import { useSectionReveal } from "@/components/motion/SectionRevealContext";
import { gravitationalEase } from "@/lib/motion/presets";

import styles from "./MailingListInvite.module.css";

/**
 * Contact-section invite to /mail: a miniature sealed envelope that opens on
 * hover (flap swings back, letter peeks out, wax seal fades) while a tiny
 * paper plane crosses the card — the whole Yuv Got Mail identity in one row.
 */
/**
 * The invite mounted as its own rail beside the contact block: a thin divider
 * and a "rather just follow along?" kicker keep it clearly separate from the
 * reach-out flow. Sits to the right on wide screens, below the section on
 * narrow ones. The outer div owns the CSS centering transform; the inner
 * motion div owns the slide-in, so the two transforms never clobber.
 */
export function MailingListRail() {
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  const sectionDriven = !shouldReduceMotion && section !== null;

  const hidden = { opacity: 0, x: 44 };
  const visible = { opacity: 1, x: 0 };

  return (
    <div className={styles.rail}>
      <motion.div
        className={styles.railInner}
        initial={shouldReduceMotion ? undefined : hidden}
        animate={
          sectionDriven ? (section ? visible : hidden) : undefined
        }
        whileInView={shouldReduceMotion || sectionDriven ? undefined : visible}
        viewport={
          shouldReduceMotion || sectionDriven
            ? undefined
            : { once: false, amount: 0.5 }
        }
        transition={{ duration: 0.85, ease: gravitationalEase, delay: 0.45 }}
      >
        <span className={styles.railKicker}>or rather just follow along?</span>
        <MailingListInvite />
      </motion.div>
    </div>
  );
}

export function MailingListInvite() {
  return (
    <Magnetic className={styles.magnet} strength={0.16} radius={160}>
      <Link
        href="/mail"
        className={`${styles.invite} focus-ring`}
        aria-label="Join Yuv Got Mail, the weekly letter"
      >
        <span className={styles.stripe} aria-hidden="true" />

        <span className={styles.envelope} aria-hidden="true">
          <span className={styles.envBack} />
          <span className={styles.flapUp} />
          <span className={styles.envLetter} />
          <span className={styles.envBody} />
          <span className={styles.flapDown} />
          <span className={styles.seal} />
        </span>

        <span className={styles.text}>
          <span className={styles.label}>Yuv Got Mail</span>
          <span className={styles.line}>join the mailing list</span>
        </span>

        <span className={styles.arrow} aria-hidden="true">
          &rarr;
        </span>

        <svg
          className={styles.plane}
          width="22"
          height="22"
          viewBox="0 0 46 46"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 24 L44 4 L30 42 L22 28 Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
        </svg>
      </Link>
    </Magnetic>
  );
}
