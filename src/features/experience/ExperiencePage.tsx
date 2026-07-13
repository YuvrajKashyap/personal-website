import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { ExperienceTimeline } from "@/features/experience/ExperienceTimeline";
import {
  experienceClosingCta,
  experienceEntries,
  experienceHero,
} from "@/features/experience/experience-content";

function ClosingCta() {
  return (
    <section id="experience-next" className="closing-cta site-container-wide">
      <Reveal className="closing-cta-inner" variant="fade-up">
        <div className="stack-sm">
          <h2 className="text-section-title text-balance">
            {experienceClosingCta.title}
          </h2>
          <p className="text-body-large text-pretty">
            {experienceClosingCta.body}
          </p>
        </div>
        <div className="cluster">
          <LinkButton href={experienceClosingCta.primary.href}>
            {experienceClosingCta.primary.label}
          </LinkButton>
          <LinkButton
            href={experienceClosingCta.secondary.href}
            variant="secondary"
          >
            {experienceClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}

export function ExperiencePage() {
  return (
    <main className="internal-page experience-page">
      <PageHero
        eyebrow={experienceHero.eyebrow}
        title={experienceHero.title}
        description={experienceHero.description}
        variant="compact"
      />

      <SectionShell
        id="experience-trajectory"
        variant="wide"
        eyebrow="Trajectory"
        title="A timeline with conservative boundaries."
      >
        <ExperienceTimeline entries={experienceEntries} />
      </SectionShell>

      <ClosingCta />
    </main>
  );
}
