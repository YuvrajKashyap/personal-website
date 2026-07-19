"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { HoverWaveText } from "@/components/motion/HoverWaveText";
import { Magnetic } from "@/components/motion/Magnetic";
import { useSectionReveal } from "@/components/motion/SectionRevealContext";
import { siteConfig } from "@/config/site";
import { gravitationalEase } from "@/lib/motion/presets";
import { CONTACT_COPY_EVENT } from "@/features/home/contact-events";
import {
  getReachOutActions,
  HeroActionButton,
} from "@/features/home/HeroActionLinks";

const COPY_RESET_MS = 2000;

// Focus-pull: the contact copy resolves out of a soft blur, each line rising
// and sharpening in sequence — a calmer, distinct signature from the projects'
// 3D deal-in above it.
const contactStageVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const contactLineVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: gravitationalEase },
  },
};

const socialsVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
};

const socialItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.7 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 24, mass: 0.7 },
  },
};

const statusSwapVariants = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
} as const;

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-email-glyph">
      <rect
        x="8.5"
        y="8.5"
        width="11"
        height="11"
        rx="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 5.5v-.6A2.4 2.4 0 0 0 13.1 2.5H6.9a2.4 2.4 0 0 0-2.4 2.4v6.2a2.4 2.4 0 0 0 2.4 2.4h.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-email-glyph">
      <path
        d="M5 12.6 10 17.6 19 7.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function writeToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const scratch = document.createElement("textarea");
  scratch.value = text;
  scratch.setAttribute("readonly", "");
  scratch.style.position = "fixed";
  scratch.style.opacity = "0";
  document.body.appendChild(scratch);
  scratch.select();
  document.execCommand("copy");
  document.body.removeChild(scratch);
  return Promise.resolve();
}

function EmailCopyCard() {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function copyEmail() {
    try {
      await writeToClipboard(siteConfig.email);
    } catch {
      return;
    }

    setCopied(true);
    window.dispatchEvent(new CustomEvent(CONTACT_COPY_EVENT));
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(
      () => setCopied(false),
      COPY_RESET_MS,
    );
  }

  const statusContent = (
    <span
      key={copied ? "copied" : "idle"}
      className="contact-email-status-text"
    >
      {copied ? "Copied to clipboard" : "Click to copy"}
    </span>
  );

  const iconContent = copied ? (
    <span key="check" className="contact-email-glyph-slot">
      <CheckIcon />
    </span>
  ) : (
    <span key="copy" className="contact-email-glyph-slot">
      <CopyIcon />
    </span>
  );

  return (
    <Magnetic className="contact-email-magnet" strength={0.14} radius={170}>
      <button
        type="button"
        className={`contact-email focus-ring${copied ? " is-copied" : ""}`}
        onClick={copyEmail}
        aria-label={`Copy email address ${siteConfig.email}`}
      >
        <span className="contact-email-status" aria-live="polite">
          {shouldReduceMotion ? (
            statusContent
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "idle"}
                className="contact-email-status-text"
                variants={statusSwapVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {copied ? "Copied to clipboard" : "Click to copy"}
              </motion.span>
            </AnimatePresence>
          )}
        </span>

        <span className="contact-email-row">
          <span className="contact-email-address">{siteConfig.email}</span>
          <span
            className={`contact-email-icon${copied ? " is-copied" : ""}`}
            aria-hidden="true"
          >
            {shouldReduceMotion ? (
              iconContent
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "check" : "copy"}
                  className="contact-email-glyph-slot"
                  initial={{
                    scale: 0.4,
                    rotate: copied ? -30 : 30,
                    opacity: 0,
                  }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.4, rotate: copied ? 30 : -30, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 24,
                    mass: 0.6,
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </motion.span>
              </AnimatePresence>
            )}
          </span>
        </span>
      </button>
    </Magnetic>
  );
}

/**
 * Home contact section: one-click email copy as the centerpiece, a mailto
 * escape hatch, and the same magnetic social buttons used in the hero.
 */
export function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
  const socialActions = getReachOutActions();
  const section = useSectionReveal();
  const sectionDriven = !shouldReduceMotion && section !== null;
  const sectionAnimate = sectionDriven
    ? section
      ? "visible"
      : "hidden"
    : undefined;

  return (
    <div className="home-contact-stage">
      <motion.div
        className="home-contact-copy"
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={sectionAnimate}
        whileInView={
          shouldReduceMotion || sectionDriven ? undefined : "visible"
        }
        viewport={sectionDriven ? undefined : { once: false, amount: 0.4 }}
        variants={shouldReduceMotion ? undefined : contactStageVariants}
      >
        <motion.h2
          className="text-page-title text-balance"
          variants={shouldReduceMotion ? undefined : contactLineVariants}
        >
          <HoverWaveText text="get in touch." />
        </motion.h2>

        <motion.div variants={shouldReduceMotion ? undefined : contactLineVariants}>
          <EmailCopyCard />
        </motion.div>

        <motion.div
          className="contact-mail-links"
          variants={shouldReduceMotion ? undefined : contactLineVariants}
        >
          <span className="contact-mail-lead">
            or open your mail app
            <span aria-hidden="true"> &rarr;</span>
          </span>
          <Magnetic strength={0.22} radius={90}>
            <a
              className="contact-mail-app focus-ring"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Compose an email to ${siteConfig.email} in Gmail`}
            >
              Gmail
              <span className="contact-mail-app-arrow" aria-hidden="true">
                &#8599;
              </span>
            </a>
          </Magnetic>
          <span className="contact-mail-divider" aria-hidden="true" />
          <Magnetic strength={0.22} radius={90}>
            <a
              className="contact-mail-app focus-ring"
              href={`ms-outlook://compose?to=${siteConfig.email}`}
              aria-label={`Compose an email to ${siteConfig.email} in the Outlook app`}
            >
              Outlook
              <span className="contact-mail-app-arrow" aria-hidden="true">
                &#8599;
              </span>
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          className="contact-socials"
          aria-label="Social and resume links"
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={sectionAnimate}
          whileInView={
            shouldReduceMotion || sectionDriven ? undefined : "visible"
          }
          viewport={sectionDriven ? undefined : { once: false, amount: 0.4 }}
          variants={shouldReduceMotion ? undefined : socialsVariants}
        >
          {socialActions.map((action) => (
            <motion.div
              key={action.id}
              className="hero-action-slot"
              variants={shouldReduceMotion ? undefined : socialItemVariants}
            >
              <HeroActionButton action={action} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
