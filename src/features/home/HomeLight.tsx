import { Reveal } from "@/components/motion/Reveal";
import { HeroActionLinks } from "@/features/home/HeroActionLinks";
import { HeroNameHeadline } from "@/features/home/HeroNameHeadline";
import { HeroRotatingText } from "@/features/home/HeroRotatingText";
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
              <HeroRotatingText className="mt-7" />
            </Reveal>

            <Reveal className="mt-10" delay={0.32} variant="cta">
              <HeroActionLinks />
            </Reveal>
          </div>
        </div>
      </section>

      <HomeSections variant="light" />
    </main>
  );
}
