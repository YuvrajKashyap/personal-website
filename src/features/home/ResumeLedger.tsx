"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type PointerEvent } from "react";

import { HoverWaveText } from "@/components/motion/HoverWaveText";
import { useSectionReveal } from "@/components/motion/SectionRevealContext";
import type { ResumeRole } from "@/features/experience/experience-content";
import { gravitationalEase } from "@/lib/motion/presets";

type ResumeLedgerProps = Readonly<{
  roles: readonly ResumeRole[];
}>;

// The ledger orchestrates the whole section: roles cascade down the rail when
// it scrolls in and clear together when it leaves — none toggle on their own.
const ledgerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.28, delayChildren: 0.08 },
  },
};

const entryVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.06 },
  },
};

// Classy "dossier unseal": the whole role body wipes in left-to-right,
// emerging slightly from the timeline rail — no per-letter reveal. Its skill
// chips settle in afterwards as a quiet finishing flourish. Kept to
// GPU-friendly transform + opacity (plus the clip wipe) — no animated blur,
// which was the source of the scroll jank.
const bodyVariants = {
  hidden: {
    opacity: 0,
    x: -18,
    clipPath: "inset(0 100% 0 0 round 1rem)",
  },
  visible: {
    opacity: 1,
    x: 0,
    clipPath: "inset(0 0% 0 0 round 1rem)",
    transition: {
      duration: 1.15,
      ease: gravitationalEase,
      opacity: { duration: 0.75, ease: gravitationalEase },
      delayChildren: 0.7,
      staggerChildren: 0.08,
    },
  },
};

const whenVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease: gravitationalEase },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 340, damping: 20 },
  },
};

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 18 },
  },
};

function trackSpotlight(event: PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--spot-x",
    `${event.clientX - bounds.left}px`,
  );
  event.currentTarget.style.setProperty(
    "--spot-y",
    `${event.clientY - bounds.top}px`,
  );
}

/**
 * Resume-style experience ledger: a scroll-drawn timeline rail with a comet
 * head, nodes that pop as each role reveals, roles that unseal from the rail
 * with a clip-wipe, staggered bullets and skill chips, and a cursor-tracking
 * spotlight per entry. Reveals are driven section-wide: roles cascade in as
 * the section scrolls into view and clear together once it fully leaves.
 */
export function ResumeLedger({ roles }: ResumeLedgerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  const sectionDriven = section !== null;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });
  const railProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    mass: 0.9,
  });
  const cometTop = useTransform(railProgress, (value) => `${value * 100}%`);

  return (
    <motion.div
      ref={ref}
      className="resume-ledger"
      initial={shouldReduceMotion ? false : "hidden"}
      animate={sectionDriven ? (section ? "visible" : "hidden") : undefined}
      whileInView={sectionDriven ? undefined : "visible"}
      viewport={sectionDriven ? undefined : { amount: 0.15, once: false }}
      variants={shouldReduceMotion ? undefined : ledgerVariants}
    >
      <span className="resume-rail" aria-hidden="true">
        <motion.span
          className="resume-rail-fill"
          style={{ scaleY: shouldReduceMotion ? 1 : railProgress }}
        />
        {shouldReduceMotion ? null : (
          <motion.span className="resume-rail-comet" style={{ top: cometTop }} />
        )}
      </span>

      {roles.map((entry) => (
        <motion.article
          key={entry.id}
          className="resume-entry"
          variants={entryVariants}
        >
          <motion.span
            className="resume-node"
            variants={nodeVariants}
            aria-hidden="true"
          >
            {entry.current ? <span className="resume-node-pulse" /> : null}
          </motion.span>

          <motion.div className="resume-entry-when" variants={whenVariants}>
            <p className="resume-entry-period">{entry.period}</p>
            {entry.current ? (
              <p className="resume-entry-live">Active</p>
            ) : null}
          </motion.div>

          <motion.div
            className="resume-entry-body"
            variants={bodyVariants}
            onPointerMove={trackSpotlight}
          >
            <h3>
              <HoverWaveText text={entry.role} />
            </h3>
            <p className="resume-entry-org">{entry.organization}</p>
            <ul className="resume-entry-points">
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <ul className="resume-entry-skills" aria-label="Skills used">
              {entry.skills.map((skill) => (
                <motion.li key={skill} variants={chipVariants}>
                  {skill}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.article>
      ))}
    </motion.div>
  );
}
