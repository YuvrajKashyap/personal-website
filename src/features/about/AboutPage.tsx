import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import { AboutTimeline } from "@/features/about/AboutTimeline";
import {
  aboutClosingCta,
  aboutHero,
  aboutIntro,
  aboutPhases,
  disciplineSignals,
  operatingLinks,
} from "@/features/about/about-content";

function AboutHeroPanel() {
  return (
    <div className="about-hero-panel">
      <p className="text-mono-label">Identity Dossier</p>
      <div className="about-hero-grid" aria-label="About page identity signals">
        <div>
          <span>Base</span>
          <strong>UT Dallas</strong>
        </div>
        <div>
          <span>Field</span>
          <strong>Computer Science</strong>
        </div>
        <div>
          <span>Signal</span>
          <strong>Builder mode</strong>
        </div>
      </div>
      <p className="text-caption">
        Human context for the projects, systems, and operating interface.
      </p>
    </div>
  );
}

function StoryIntro() {
  return (
    <SectionShell
      id="about-story"
      variant="wide"
      eyebrow={aboutIntro.eyebrow}
      title={aboutIntro.title}
      description="A controlled biography layer for the person behind the work."
    >
      <div className="about-intro">
        <article className="about-intro-card stack-md">
          <p className="text-body-large text-pretty">{aboutIntro.body}</p>
          <p className="text-body-large text-pretty">{aboutIntro.secondary}</p>
        </article>
        <div className="about-intro-telemetry">
          <TelemetryCard
            label="Discipline source"
            value="Tennis"
            description="Competition, repetition, standards, and recovery."
            source="Background"
            tone="active"
          />
          <TelemetryCard
            label="Current layer"
            value="Building"
            description="Software, systems, project surfaces, and career leverage."
            source="Now"
            tone="muted"
          />
        </div>
      </div>
    </SectionShell>
  );
}

function DisciplineSection() {
  return (
    <SectionShell
      id="about-discipline"
      variant="wide"
      eyebrow="Discipline Transfer"
      title="Tennis is not the theme. It is the evidence."
      description="The useful part is the operating standard it created."
    >
      <div className="about-discipline">
        <div className="about-discipline-copy stack-md">
          <StatusBadge tone="active">Supporting Signal</StatusBadge>
          <h2 className="text-section-title text-balance">
            Sport made execution less abstract.
          </h2>
          <p className="text-body-large text-pretty">
            Tennis gave the work a baseline: show up, repeat the fundamentals,
            handle pressure, recover quickly, and keep standards visible when the
            environment gets noisy.
          </p>
          <p className="text-body-large text-pretty">
            The current work is different, but the transfer is direct. Building
            software asks for the same patience with details, the same tolerance
            for feedback, and the same refusal to confuse activity with progress.
          </p>
        </div>
        <div className="about-discipline-grid">
          {disciplineSignals.map((signal, index) => (
            <Reveal key={signal.label} delay={index * 0.06} variant="scale-soft">
              <CosmicCard
                eyebrow={signal.label}
                title={signal.value}
                description={signal.body}
                variant="quiet"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function OperatingLayer() {
  return (
    <SectionShell
      id="about-operating-layer"
      variant="wide"
      eyebrow="Current Operating Layer"
      title="The biography points into active surfaces."
      description="About gives context. The rest of the site shows where that context is being converted into work."
    >
      <div className="about-operating-layer">
        {operatingLinks.map((link, index) => (
          <Reveal key={link.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={link.eyebrow}
              title={link.title}
              description={link.body}
              href={link.href}
              actionLabel={link.cta}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <SectionShell id="about-next" variant="compact">
      <Reveal className="about-cta" variant="scale-soft">
        <p className="text-kicker">{aboutClosingCta.eyebrow}</p>
        <h2 className="text-section-title text-balance">
          {aboutClosingCta.title}
        </h2>
        <p className="text-body-large text-pretty">{aboutClosingCta.body}</p>
        <div className="cluster">
          <LinkButton href={aboutClosingCta.primary.href}>
            {aboutClosingCta.primary.label}
          </LinkButton>
          <LinkButton href={aboutClosingCta.secondary.href} variant="secondary">
            {aboutClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function AboutPage() {
  return (
    <main className="internal-page about-page">
      <PageHero
        eyebrow={aboutHero.eyebrow}
        title={aboutHero.title}
        description={aboutHero.description}
        status={aboutHero.status}
        meta={[...aboutHero.meta]}
        primaryAction={{ label: "View Projects", href: "/projects" }}
        secondaryAction={{ label: "Open Tracker", href: "/tracker" }}
      >
        <AboutHeroPanel />
      </PageHero>

      <StoryIntro />

      <SectionShell
        id="about-phases"
        variant="wide"
        eyebrow="Life Phases"
        title="A short arc, kept precise."
        description="The page keeps the public story structured and grounded while preserving room for deeper Experience content later."
      >
        <AboutTimeline phases={aboutPhases} />
      </SectionShell>

      <DisciplineSection />
      <OperatingLayer />
      <ClosingCta />
    </main>
  );
}
