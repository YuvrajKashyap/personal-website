import { Reveal } from "@/components/motion/Reveal";
import { HeroDive } from "@/features/home/HeroDive";
import { HeroActionLinks } from "@/features/home/HeroActionLinks";
import { HeroNameHeadline } from "@/features/home/HeroNameHeadline";
import { HeroRoleCycle } from "@/features/home/HeroRoleCycle";
import { HeroRotatingText } from "@/features/home/HeroRotatingText";
import { HeroVideoBackground } from "@/features/home/HeroVideoBackground";

/**
 * Light "Ivory Observatory" hero. Rendered on the server and handed to
 * `HomePage`, which mounts it only while the light theme is active.
 */
export function HomeLight() {
  return (
    <section className="home-light-hero" aria-label="Home hero">
      <HeroDive />
      <HeroVideoBackground variant="light" />

      <div aria-hidden="true" className="observatory-field" />
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none absolute inset-0 z-0"
      />
      <div aria-hidden="true" className="observatory-wash" />

      <div className="home-light-hero-section site-container-wide">
        <div className="home-light-copy">
          <Reveal className="home-hero-role-reveal" delay={0.08}>
            <HeroRoleCycle />
          </Reveal>
          <Reveal
            className="home-hero-name-reveal"
            delay={0.14}
            variant="blur-in"
          >
            <HeroNameHeadline className="mt-5" />
          </Reveal>
          <Reveal className="home-hero-typing-reveal" delay={0.22}>
            <HeroRotatingText className="mt-7" />
          </Reveal>

          <div className="mt-10">
            <HeroActionLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
