import { MotionScrollCue } from "@/components/motion/MotionScrollCue";
import { Reveal } from "@/components/motion/Reveal";
import { HeroActionLinks } from "@/features/home/HeroActionLinks";
import { HeroVideoBackground } from "@/features/home/HeroVideoBackground";
import { HeroNameHeadline } from "@/features/home/HeroNameHeadline";
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
            <Reveal delay={0.08}>
              <p className="text-kicker">{homeContent.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.14} variant="blur-in">
              <HeroNameHeadline className="mt-5" />
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-7 text-body-large text-pretty">
                {homeContent.body}
              </p>
            </Reveal>

            <Reveal className="mt-10" delay={0.3} variant="cta">
              <HeroActionLinks />
            </Reveal>
          </div>
        </div>

        <MotionScrollCue />
      </section>

      <HomeSections variant="dark" />
    </main>
  );
}
