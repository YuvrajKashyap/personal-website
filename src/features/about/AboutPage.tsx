import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { AboutTimeline } from "@/features/about/AboutTimeline";
import {
  aboutClosingCta,
  aboutHero,
  aboutIntro,
  aboutPhases,
  disciplineIntro,
  disciplineSignals,
} from "@/features/about/about-content";

function StoryIntro() {
  return (
    <section
      id="about-story"
      className="about-story site-container-wide"
      aria-label="Introduction"
    >
      <Reveal className="about-story-copy" variant="fade-up">
        <p className="about-lead text-pretty">{aboutIntro.body}</p>
        <p className="text-body-large text-pretty">{aboutIntro.secondary}</p>
      </Reveal>
    </section>
  );
}

function DisciplineSection() {
  return (
    <SectionShell
      id="about-discipline"
      variant="wide"
      eyebrow="Discipline Transfer"
      title={disciplineIntro.title}
      description={disciplineIntro.body}
    >
      <div className="discipline-grid">
        {disciplineSignals.map((signal, index) => (
          <Reveal
            key={signal.label}
            className="discipline-item"
            delay={index * 0.06}
            variant="fade-up"
          >
            <p className="text-mono-label">{signal.label}</p>
            <h3 className="discipline-value">{signal.value}</h3>
            <p className="text-body">{signal.body}</p>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <section id="about-next" className="closing-cta site-container-wide">
      <Reveal className="closing-cta-inner" variant="fade-up">
        <div className="stack-sm">
          <h2 className="text-section-title text-balance">
            {aboutClosingCta.title}
          </h2>
          <p className="text-body-large text-pretty">{aboutClosingCta.body}</p>
        </div>
        <div className="cluster">
          <LinkButton href={aboutClosingCta.primary.href}>
            {aboutClosingCta.primary.label}
          </LinkButton>
          <LinkButton
            href={aboutClosingCta.secondary.href}
            variant="secondary"
          >
            {aboutClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}

export function AboutPage() {
  return (
    <main className="internal-page about-page">
      <PageHero
        eyebrow={aboutHero.eyebrow}
        title={aboutHero.title}
        description={aboutHero.description}
        variant="compact"
      />

      <StoryIntro />

      <SectionShell
        id="about-phases"
        variant="wide"
        eyebrow="The Arc"
        title="A short arc, kept precise."
      >
        <AboutTimeline phases={aboutPhases} />
      </SectionShell>

      <DisciplineSection />
      <ClosingCta />
    </main>
  );
}
