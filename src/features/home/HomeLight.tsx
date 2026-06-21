import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { HeroNameHeadline } from "@/features/home/HeroNameHeadline";
import { HeroVideoBackground } from "@/features/home/HeroVideoBackground";
import { HomeSections } from "@/features/home/HomeSections";
import { homeContent } from "@/features/home/home-content";

export function HomeLight() {
  return (
    <main className="home-page home-page-light">
      <section className="home-light-hero" aria-label="Home hero">
        <HeroVideoBackground variant="light" />

        <div aria-hidden="true" className="observatory-field" />
        <div
          aria-hidden="true"
          className="grain-overlay pointer-events-none absolute inset-0 z-0"
        />
        <div aria-hidden="true" className="observatory-wash" />

        <div className="home-light-hero-section site-container-wide">
          <div className="home-light-copy">
            <Reveal delay={0.08}>
              <p className="text-kicker">{homeContent.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <HeroNameHeadline className="mt-5" />
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-7 text-body-large text-pretty">
                {homeContent.body}
              </p>
            </Reveal>

            <Reveal className="cluster mt-10" delay={0.32} variant="cta">
              <Link
                href={homeContent.primaryCta.href}
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition hover:bg-[var(--interactive-hover)]"
              >
                {homeContent.primaryCta.label}
              </Link>
              <Link
                href={homeContent.secondaryCta.href}
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong bg-surface-glass px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-strong"
              >
                {homeContent.secondaryCta.label}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <HomeSections variant="light" />
    </main>
  );
}
