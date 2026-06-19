import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import { ExperiencePillars } from "@/features/experience/ExperiencePillars";
import { ExperienceTimeline } from "@/features/experience/ExperienceTimeline";
import {
  experienceClosingCta,
  experienceEntries,
  experienceHero,
  experiencePillars,
  futureDirection,
  proofSurfaces,
} from "@/features/experience/experience-content";

function ExperienceHeroPanel() {
  return (
    <div className="experience-hero-panel">
      <p className="text-mono-label">Proof Dossier</p>
      <div className="experience-hero-metrics" aria-label="Experience page summary">
        <div>
          <span>Records</span>
          <strong>{experienceEntries.length}</strong>
        </div>
        <div>
          <span>Mode</span>
          <strong>Proof</strong>
        </div>
        <div>
          <span>Source</span>
          <strong>Local model</strong>
        </div>
      </div>
      <p className="text-caption">
        A structured trajectory page for education, leadership, technical work,
        discipline, and current building direction.
      </p>
    </div>
  );
}

function ProofSurfaces() {
  return (
    <SectionShell
      id="experience-proof-surfaces"
      variant="wide"
      eyebrow="Proof Surfaces"
      title="The deeper routes carry the evidence."
      description="Experience stays structured. Projects, Tracker, About, and Contact carry the next layer of context."
    >
      <div className="experience-proof-grid">
        {proofSurfaces.map((surface, index) => (
          <Reveal key={surface.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={surface.eyebrow}
              title={surface.title}
              description={surface.body}
              href={surface.href}
              actionLabel={surface.cta}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function FutureDirection() {
  return (
    <SectionShell
      id="experience-direction"
      variant="wide"
      eyebrow={futureDirection.eyebrow}
      title={futureDirection.title}
      description="A concise read on where the trajectory points next."
    >
      <div className="experience-direction">
        <div className="experience-direction-copy stack-md">
          <StatusBadge tone="active">Current Direction</StatusBadge>
          <p className="text-body-large text-pretty">{futureDirection.body}</p>
        </div>
        <div className="experience-direction-grid">
          {futureDirection.signals.map((signal, index) => (
            <Reveal key={signal} delay={index * 0.05} variant="chip">
              <TelemetryCard
                label={`Direction ${String(index + 1).padStart(2, "0")}`}
                value={signal}
                description="Forward signal, not a completed outcome claim."
                source="Trajectory"
                tone={index === 0 ? "active" : "muted"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <SectionShell id="experience-next" variant="compact">
      <Reveal className="experience-cta" variant="scale-soft">
        <p className="text-kicker">{experienceClosingCta.eyebrow}</p>
        <h2 className="text-section-title text-balance">
          {experienceClosingCta.title}
        </h2>
        <p className="text-body-large text-pretty">
          {experienceClosingCta.body}
        </p>
        <div className="cluster">
          <LinkButton href={experienceClosingCta.primary.href}>
            {experienceClosingCta.primary.label}
          </LinkButton>
          <LinkButton href={experienceClosingCta.secondary.href} variant="secondary">
            {experienceClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function ExperiencePage() {
  return (
    <main className="internal-page experience-page">
      <PageHero
        eyebrow={experienceHero.eyebrow}
        title={experienceHero.title}
        description={experienceHero.description}
        status={experienceHero.status}
        meta={[...experienceHero.meta]}
        primaryAction={{ label: "View Projects", href: "/projects" }}
        secondaryAction={{ label: "Get in Touch", href: "/contact" }}
      >
        <ExperienceHeroPanel />
      </PageHero>

      <SectionShell
        id="experience-pillars"
        variant="wide"
        eyebrow="Experience Pillars"
        title="Four layers behind the work."
        description="A recruiter-useful summary without flattening the page into a resume."
      >
        <ExperiencePillars pillars={experiencePillars} />
      </SectionShell>

      <SectionShell
        id="experience-trajectory"
        variant="wide"
        eyebrow="Trajectory"
        title="A timeline with conservative boundaries."
        description="The entries show progression across education, leadership, technical work, discipline, and current building without inventing dates or outcomes."
      >
        <ExperienceTimeline entries={experienceEntries} />
      </SectionShell>

      <ProofSurfaces />
      <FutureDirection />
      <ClosingCta />
    </main>
  );
}
