"use client";

import { useEffect, useRef } from "react";

import { SiteEmblemLink } from "@/components/layout/SiteEmblemLink";
import { ParallaxDrift } from "@/components/motion/ParallaxDrift";
import { Reveal } from "@/components/motion/Reveal";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { EnvelopeCenterpiece } from "@/features/mail/EnvelopeCenterpiece";
import { KitSignupForm } from "@/features/mail/KitSignupForm";
import { MailRoutesCanvas } from "@/features/mail/MailRoutesCanvas";
import { mailPageContent } from "@/features/mail/mail-content";
import { PaperPlaneOverlay } from "@/features/mail/PaperPlaneOverlay";
import { Postmark } from "@/features/mail/Postmark";
import { StampTitle } from "@/features/mail/StampTitle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { createPhasePreservingAnimationController } from "@/lib/performance/animation-runtime";

import styles from "./MailPage.module.css";

type MailPageProps = Readonly<{
  confirmed?: boolean;
}>;

const READOUT_ITEMS = ["Ideas", "Updates", "Discoveries", "Rabbit holes"];

const TAGLINE_WORDS = [
  ...["A", "weekly", "letter", "about"].map((text) => ({ text, emph: false })),
  ...["whatever", "has", "my", "attention."].map((text) => ({ text, emph: true })),
];

export function MailPage({ confirmed = false }: MailPageProps) {
  const auroraOneRef = useRef<HTMLDivElement>(null);
  const auroraTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof CSSAnimation === "undefined") return undefined;

    const elements = [auroraOneRef.current, auroraTwoRef.current].filter(
      (element): element is HTMLDivElement => element !== null,
    );
    const controllers = new Map(
      elements.map((element) => [
        element,
        createPhasePreservingAnimationController(
          () =>
            element
              .getAnimations()
              .filter((animation) => animation instanceof CSSAnimation),
          () => performance.now(),
        ),
      ]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const controller = controllers.get(entry.target as HTMLDivElement);
          if (!controller) continue;
          if (entry.isIntersecting) controller.resume();
          else controller.pause();
        }
      },
      { rootMargin: "96px 0px" },
    );
    for (const element of elements) observer.observe(element);

    return () => {
      observer.disconnect();
      for (const controller of controllers.values()) controller.resume();
    };
  }, []);

  return (
    <main className={`internal-page ${styles.page}`}>
      <div className={styles.sky} aria-hidden="true">
        <div className={styles.skyGlowTop} />
        <div className={styles.skyOrb} />
        <div ref={auroraOneRef} className={styles.skyAuroraOne} />
        <div ref={auroraTwoRef} className={styles.skyAuroraTwo} />
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
      <PaperPlaneOverlay />
    </main>
  );
}
