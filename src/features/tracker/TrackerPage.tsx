import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import { TrackerRoadmap } from "@/features/tracker/TrackerRoadmap";
import { TrackerStatusBoard } from "@/features/tracker/TrackerStatusBoard";
import { TrackerSurfaceLinks } from "@/features/tracker/TrackerSurfaceLinks";
import {
  trackerActiveSurfaces,
  trackerClosingCta,
  trackerFocusAreas,
  trackerHero,
  trackerOperatingPillars,
  trackerRoadmap,
  trackerSourceNote,
  trackerStatusCards,
} from "@/features/tracker/tracker-content";

function TrackerHeroPanel() {
  return (
    <div className="tracker-hero-panel">
      <p className="text-mono-label">Current-State Console</p>
      <div className="tracker-hero-ledger" aria-label="Tracker source summary">
        <div>
          <span>Signal</span>
          <strong>Manual</strong>
        </div>
        <div>
          <span>Source</span>
          <strong>Local</strong>
        </div>
        <div>
          <span>Boundary</span>
          <strong>Honest</strong>
        </div>
      </div>
      <p className="text-caption">
        A public operating surface for focus, active systems, and next-up work
        without pretending the data source is more advanced than it is.
      </p>
    </div>
  );
}

function FocusAreas() {
  return (
    <SectionShell
      id="tracker-focus"
      variant="wide"
      eyebrow="Focus Areas"
      title="The current signal is qualitative by design."
      description="These areas describe attention and direction without inventing numbers or private tracking data."
    >
      <div className="tracker-focus-grid">
        {trackerFocusAreas.map((area, index) => (
          <Reveal key={area.id} delay={index * 0.05} variant="scale-soft">
            <CosmicCard
              eyebrow={area.eyebrow}
              title={area.title}
              description={area.body}
              variant={index === 0 ? "featured" : "default"}
            >
              <div className="tracker-tags">
                {area.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </CosmicCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function OperatingPillars() {
  return (
    <SectionShell
      id="tracker-operating-pillars"
      variant="wide"
      eyebrow="Operating Pillars"
      title="A simple loop for staying oriented."
      description="The tracker is not a scoreboard. It is a structured reminder of the operating loop."
    >
      <div className="tracker-pillar-grid">
        {trackerOperatingPillars.map((pillar, index) => (
          <Reveal key={pillar.id} delay={index * 0.05} variant="chip">
            <article className="tracker-pillar-card">
              <span>{pillar.label}</span>
              <h3 className="text-card-title">{pillar.title}</h3>
              <p className="text-body">{pillar.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function SourceNote() {
  return (
    <SectionShell id="tracker-source-note" variant="compact">
      <Reveal className="tracker-source-note" variant="scale-soft">
        <div className="stack-sm">
          <p className="text-kicker">{trackerSourceNote.eyebrow}</p>
          <h2 className="text-section-title text-balance">
            {trackerSourceNote.title}
          </h2>
          <p className="text-body-large text-pretty">{trackerSourceNote.body}</p>
        </div>
        <div className="cluster">
          {trackerSourceNote.badges.map((badge) => (
            <StatusBadge key={badge} tone="muted">
              {badge}
            </StatusBadge>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <SectionShell id="tracker-next" variant="compact">
      <Reveal className="tracker-cta" variant="scale-soft">
        <p className="text-kicker">{trackerClosingCta.eyebrow}</p>
        <h2 className="text-section-title text-balance">
          {trackerClosingCta.title}
        </h2>
        <p className="text-body-large text-pretty">{trackerClosingCta.body}</p>
        <div className="cluster">
          <LinkButton href={trackerClosingCta.primary.href}>
            {trackerClosingCta.primary.label}
          </LinkButton>
          <LinkButton href={trackerClosingCta.secondary.href} variant="secondary">
            {trackerClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function TrackerPage() {
  return (
    <main className="internal-page tracker-page">
      <PageHero
        eyebrow={trackerHero.eyebrow}
        title={trackerHero.title}
        description={trackerHero.description}
        status={trackerHero.status}
        meta={[...trackerHero.meta]}
        primaryAction={{ label: "View Projects", href: "/projects" }}
        secondaryAction={{ label: "Get in Touch", href: "/contact" }}
      >
        <TrackerHeroPanel />
      </PageHero>

      <SectionShell
        id="tracker-current-state"
        variant="wide"
        eyebrow="Current State Board"
        title="A manual board for what is active right now."
        description="Every status-like card carries a source label so the page never pretends to be a connected feed."
      >
        <TrackerStatusBoard cards={trackerStatusCards} />
      </SectionShell>

      <FocusAreas />
      <OperatingPillars />

      <SectionShell
        id="tracker-active-surfaces"
        variant="wide"
        eyebrow="Active Systems"
        title="Routes that carry the public operating surface."
        description="The tracker points outward to the routes that hold deeper evidence and context."
      >
        <TrackerSurfaceLinks surfaces={trackerActiveSurfaces} />
      </SectionShell>

      <SectionShell
        id="tracker-roadmap"
        variant="wide"
        eyebrow="Roadmap"
        title="Next up, clearly separated from what exists now."
        description="These are future work boundaries, not public claims that the systems already exist."
      >
        <div className="tracker-roadmap-shell">
          <TrackerRoadmap items={trackerRoadmap} />
          <TelemetryCard
            label="Boundary"
            value="Future systems are labeled"
            description="The roadmap is intentionally written as upcoming work so the tracker stays truthful."
            source="Source: local content"
            tone="warning"
          />
        </div>
      </SectionShell>

      <SourceNote />
      <ClosingCta />
    </main>
  );
}
