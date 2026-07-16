"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type PointerEvent } from "react";

import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import type { ResumeRole } from "@/features/experience/experience-content";
import { gravitationalEase } from "@/lib/motion/presets";

type ResumeLedgerProps = Readonly<{
  roles: readonly ResumeRole[];
}>;

const entryVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: gravitationalEase },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: gravitationalEase },
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
 * head, nodes that pop as each role reveals, flip-in role titles, staggered
 * bullets and skill chips, and a cursor-tracking spotlight per entry.
 */
export function ResumeLedger({ roles }: ResumeLedgerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
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
    <div ref={ref} className="resume-ledger">
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
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ amount: 0.35, once: true }}
          variants={entryVariants}
        >
          <motion.span
            className="resume-node"
            variants={nodeVariants}
            aria-hidden="true"
          >
            {entry.current ? <span className="resume-node-pulse" /> : null}
          </motion.span>

          <motion.div className="resume-entry-when" variants={itemVariants}>
            <p className="resume-entry-period">{entry.period}</p>
            {entry.current ? (
              <p className="resume-entry-live">Active</p>
            ) : null}
          </motion.div>

          <div
            className="resume-entry-body"
            onPointerMove={trackSpotlight}
          >
            <motion.h3 variants={itemVariants}>
              <SplitTextReveal text={entry.role} variant="flip" hoverWave />
            </motion.h3>
            <motion.p className="resume-entry-org" variants={itemVariants}>
              {entry.organization}
            </motion.p>
            <ul className="resume-entry-points">
              {entry.bullets.map((bullet) => (
                <motion.li key={bullet} variants={itemVariants}>
                  {bullet}
                </motion.li>
              ))}
            </ul>
            <ul className="resume-entry-skills" aria-label="Skills used">
              {entry.skills.map((skill) => (
                <motion.li key={skill} variants={chipVariants}>
                  {skill}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
