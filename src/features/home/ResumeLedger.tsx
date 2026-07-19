"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type PointerEvent, type RefObject } from "react";

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

type LedgerNodeProps = Readonly<{
  current?: boolean;
  progress: MotionValue<number>;
  railRef: RefObject<HTMLSpanElement | null>;
  reduceMotion: boolean;
}>;

/**
 * Timeline node that fills solid accent the moment the rail's comet reaches
 * it, popping in with a spring; scrolling back up drains it again in step
 * with the rail. Every node carries the pulse ring; ongoing roles are marked
 * separately by a small satellite dot orbiting the node. Each node measures
 * its own fraction along the rail so the fill always matches the comet.
 */
function LedgerNode({ current, progress, railRef, reduceMotion }: LedgerNodeProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  // Start beyond the rail's end so nothing fills before measurement.
  const frac = useMotionValue(2);

  useEffect(() => {
    const node = nodeRef.current;
    const rail = railRef.current;

    if (!node || !rail) {
      return undefined;
    }

    function measure() {
      if (!node || !rail) {
        return;
      }

      const railRect = rail.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();

      if (railRect.height > 0) {
        frac.set(
          (nodeRect.top + nodeRect.height / 2 - railRect.top) /
            railRect.height,
        );
      }
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);

    return () => observer.disconnect();
  }, [frac, railRef]);

  const reached = useTransform(() => {
    const gap = progress.get() - frac.get();
    return Math.min(1, Math.max(0, (gap + 0.008) / 0.016));
  });
  const fill = useSpring(reached, { stiffness: 420, damping: 21, mass: 0.6 });

  return (
    <motion.span
      ref={nodeRef}
      className="resume-node"
      variants={nodeVariants}
      aria-hidden="true"
    >
      <motion.span
        className="resume-node-fill"
        style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: fill, scale: fill }}
      />
      <motion.span
        className="resume-node-pulse-gate"
        style={reduceMotion ? undefined : { opacity: fill }}
      >
        <span className="resume-node-pulse" />
      </motion.span>
      {current ? (
        <span className="resume-node-orbit">
          <span className="resume-node-orbit-dot" />
        </span>
      ) : null}
    </motion.span>
  );
}

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
  const railRef = useRef<HTMLSpanElement>(null);
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
      <span ref={railRef} className="resume-rail" aria-hidden="true">
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
          <LedgerNode
            current={entry.current}
            progress={railProgress}
            railRef={railRef}
            reduceMotion={shouldReduceMotion ?? false}
          />

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
