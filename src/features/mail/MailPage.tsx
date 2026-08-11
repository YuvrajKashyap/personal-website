"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { SiteEmblemLink } from "@/components/layout/SiteEmblemLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { Reveal } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { useSectionReveal } from "@/components/motion/SectionRevealContext";
import { EnvelopeCenterpiece } from "@/features/mail/EnvelopeCenterpiece";
import { KitSignupForm } from "@/features/mail/KitSignupForm";
import { MailRoutesCanvas } from "@/features/mail/MailRoutesCanvas";
import { mailPageContent } from "@/features/mail/mail-content";
import { PaperPlaneOverlay } from "@/features/mail/PaperPlaneOverlay";
import { Postmark } from "@/features/mail/Postmark";
import { StampTitle } from "@/features/mail/StampTitle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { gravitationalEase } from "@/lib/motion/presets";

import styles from "./MailPage.module.css";

type MailPageProps = Readonly<{
  confirmed?: boolean;
}>;

const READOUT_ITEMS = ["Ideas", "Updates", "Discoveries", "Rabbit holes"];

const TAGLINE_WORDS = [
  ...["A", "weekly", "letter", "about"].map((text) => ({ text, emph: false })),
  ...["whatever", "has", "my", "attention."].map((text) => ({ text, emph: true })),
];

const noteVariants: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    x: -16,
  },
  visible: (index: number = 0) => ({
    clipPath: "inset(0 0% 0 0)",
    x: 0,
    transition: {
      duration: 0.95,
      ease: gravitationalEase,
      delay: index * 0.16,
    },
  }),
};

const noteBarVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: (index: number = 0) => ({
    scaleX: 1,
    transition: {
      duration: 0.75,
      ease: gravitationalEase,
      delay: 0.2 + index * 0.16,
    },
  }),
};

type ManifestNoteProps = Readonly<{
  index: number;
  code: string;
  title: string;
  body: string;
}>;

/**
 * "Airmail unseal" entrance: the striped airmail edge draws itself across,
 * then the note content wipes open left to right — distinct from both the
 * stamp cascade and the envelope drop above it.
 */
function ManifestNote({ index, code, title, body }: ManifestNoteProps) {
  const shouldReduceMotion = useReducedMotion();
  const section = useSectionReveal();
  const state = section ? "visible" : "hidden";

  if (shouldReduceMotion) {
    return (
      <article className={styles.note}>
        <div className={styles.noteBar} aria-hidden="true" />
        <p className={styles.noteCode}>{code}</p>
        <h2 className={styles.noteTitle}>{title}</h2>
        <p className={styles.noteBody}>{body}</p>
      </article>
    );
  }

  return (
    <article className={styles.note}>
      <motion.div
        className={styles.noteBar}
        custom={index}
        initial="hidden"
        animate={state}
        variants={noteBarVariants}
        style={{ transformOrigin: "0% 50%" }}
        aria-hidden="true"
      />
      <motion.div custom={index} initial="hidden" animate={state} variants={noteVariants}>
        <p className={styles.noteCode}>{code}</p>
        <h2 className={styles.noteTitle}>{title}</h2>
        <p className={styles.noteBody}>{body}</p>
      </motion.div>
    </article>
  );
}

export function MailPage({ confirmed = false }: MailPageProps) {
  return (
    <main className={`internal-page ${styles.page}`}>
      <div className={styles.sky} aria-hidden="true">
        <div className={styles.skyGlowTop} />
        <div className={styles.skyOrb} />
        <div className={styles.skyAuroraOne} />
        <div className={styles.skyAuroraTwo} />
        <div className={styles.skyHorizon} />
      </div>

      <header className={styles.topBar}>
        <SiteEmblemLink ariaLabel="Back to yuvrajkashyap.com" />
        <ThemeToggle />
      </header>

      <SectionReveal>
        <section className={styles.heroShell}>
          <MailRoutesCanvas className={styles.routes} />

          <div className={styles.floaters} aria-hidden="true">
            <ParallaxDrift className={styles.floaterOne} range={38}>
              <div className={styles.stampDecal}>
                <svg width="30" height="30" viewBox="0 0 46 46" fill="none">
                  <path
                    d="M4 26 L42 8 L30 40 L22 28 Z"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Par avion</span>
              </div>
            </ParallaxDrift>
            <ParallaxDrift className={styles.floaterTwo} range={20}>
              <div className={styles.postmarkDecal}>
                <Postmark markId="floating-mark" centerTop="AIR" centerBottom="MAIL" />
              </div>
            </ParallaxDrift>
          </div>

          <div className={`site-container-wide ${styles.hero}`}>
            <div className={styles.intro}>
              <Reveal delay={0.05}>
                <p className={`text-kicker ${styles.kicker}`}>A letter from Yuvraj</p>
              </Reveal>
              <h1 className={`text-page-title ${styles.title}`}>
                <StampTitle text={mailPageContent.title} />
              </h1>
              <Reveal delay={0.55} variant="blur-in">
                <p
                  className={styles.tagline}
                  aria-label="A weekly letter about whatever has my attention."
                >
                  {TAGLINE_WORDS.map((word, index) => (
                    <span
                      key={`${word.text}-${index}`}
                      aria-hidden="true"
                      className={`${styles.taglineWord}${
                        word.emph ? ` ${styles.taglineEmph}` : ""
                      }`}
                      style={{ "--wi": index } as React.CSSProperties}
                    >
                      {word.text}
                    </span>
                  ))}
                </p>
              </Reveal>
              <Reveal delay={0.68}>
                <ul className={styles.readout} aria-label="What the letters cover">
                  {READOUT_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.82}>
                <Magnetic className={styles.scrollHintMagnet} strength={0.28} radius={110}>
                  <a className={styles.scrollHint} href="#the-letter">
                    <span className={styles.scrollHintArrow} aria-hidden="true">
                      →
                    </span>
                    {confirmed
                      ? "You're on the list. The first letter is en route."
                      : "A sealed letter is waiting. Break the wax."}
                  </a>
                </Magnetic>
              </Reveal>
            </div>

            <div className={styles.letterColumn} id="the-letter">
              <EnvelopeCenterpiece confirmed={confirmed}>
                <div className={styles.letterhead} aria-hidden="true">
                  From the desk of Yuvraj Kashyap
                </div>
                {confirmed ? (
                  <div className={styles.confirmed} role="status">
                    <p className={styles.confirmedTitle}>you&apos;re in.</p>
                    <p className={styles.confirmedBody}>
                      Welcome to Yuv Got Mail. The first letter will find you soon.
                    </p>
                    <p className={styles.signature}>from Yuvraj</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.letterHeading}>
                      <p className={styles.letterLabel}>Yuv Got Mail</p>
                      <p className={styles.issueMark}>Weekly, roughly</p>
                    </div>
                    <h2 className={styles.letterTitle}>stay up to date.</h2>
                    <p className={styles.letterLede}>
                      One letter a week. Ideas worth chasing, things I&apos;m
                      building, and the occasional rabbit hole worth falling
                      into.
                    </p>
                    <KitSignupForm formUid={mailPageContent.formUid} />
                    <div className={styles.letterRule} aria-hidden="true">
                      <span>✦</span>
                    </div>
                    <p className={styles.signature}>from Yuvraj</p>
                  </>
                )}
              </EnvelopeCenterpiece>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <section
          className={`site-container-wide ${styles.notes}`}
          aria-label="What to expect"
        >
          <ManifestNote
            index={0}
            code="Manifest / 01"
            title="What shows up"
            body={mailPageContent.relationshipNote}
          />
          <ManifestNote
            index={1}
            code="Manifest / 02"
            title="When it shows up"
            body={mailPageContent.scheduleNote}
          />
          <ManifestNote
            index={2}
            code="Manifest / 03"
            title="The fine print"
            body={mailPageContent.privacyNote}
          />
        </section>
      </SectionReveal>

      <SectionReveal>
        <Reveal>
          <p className={styles.signoff}>
            <svg width="18" height="18" viewBox="0 0 46 46" fill="none" aria-hidden="true">
              <path
                d="M4 26 L42 8 L30 40 L22 28 Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
            Posted from the desk of Yuvraj Kashyap
          </p>
        </Reveal>
      </SectionReveal>

      <PaperPlaneOverlay />
    </main>
  );
}
