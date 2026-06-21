import Link from "next/link";

import { MotionScrollCue } from "@/components/motion/MotionScrollCue";
import { Reveal } from "@/components/motion/Reveal";
import { OrbitalNavigation } from "@/components/navigation/OrbitalNavigation";
import { orbitalDestinations } from "@/config/site";
import { HeroVideoBackground } from "@/features/home/HeroVideoBackground";
import { HomeSections } from "@/features/home/HomeSections";
import { homeContent } from "@/features/home/home-content";

export function HomeDark() {
  return (
    <main className="home-page home-page-dark">
      <section className="home-hero home-hero-dark" aria-label="Home hero">
        <HeroVideoBackground />

        <div aria-hidden="true" className="home-hero-shade" />
        <div
          aria-hidden="true"
          className="grain-overlay pointer-events-none absolute inset-0 z-[1]"
        />
        <svg
          aria-hidden="true"
          className="home-hero-orbit"
          viewBox="0 0 760 760"
          fill="none"
        >
          <circle className="orbital-line" cx="380" cy="380" r="248" />
          <circle
            className="orbital-line"
            cx="380"
            cy="380"
            r="316"
            strokeDasharray="2 22"
          />
          <path
            className="orbital-line"
            d="M116 408C190 244 363 152 538 200"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="home-dark-hero-section site-container-wide">
          <div className="home-dark-copy">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              {homeContent.telemetry.map((item, index) => (
                <Reveal key={item} variant="chip" delay={0.34 + index * 0.045}>
                  <span className="hero-chip">{item}</span>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.08}>
              <p className="text-kicker">{homeContent.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.14} variant="blur-in">
              <h1 className="mt-5 max-w-4xl text-display text-balance">
                {homeContent.headline}
              </h1>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-7 text-body-large text-pretty">
                {homeContent.body}
              </p>
            </Reveal>

            <Reveal className="cluster mt-10" delay={0.3} variant="cta">
              <Link
                href={homeContent.primaryCta.href}
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_0_32px_var(--glow-soft)] transition hover:bg-[var(--interactive-hover)]"
              >
                {homeContent.primaryCta.label}
              </Link>
              <Link
                href={homeContent.secondaryCta.href}
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface-glass px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-strong"
              >
                {homeContent.secondaryCta.label}
              </Link>
            </Reveal>
          </div>

          <Reveal
            className="home-dark-orbital-nav"
            delay={0.42}
            variant="scale-soft"
          >
            <OrbitalNavigation
              items={orbitalDestinations}
              variant="dark"
              eyebrow="Orbital Destinations"
              title="Navigate the system"
            />
          </Reveal>
        </div>

        <MotionScrollCue />
      </section>

      <HomeSections variant="dark" />
    </main>
  );
}
