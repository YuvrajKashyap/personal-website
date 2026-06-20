import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { FormShell } from "@/components/ui/FormShell";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import {
  alignmentPrinciples,
  collaborationFitItems,
  collaborationLanes,
  collaborationNotFitItems,
  collaborateClosingCta,
  collaborateDefinition,
  collaborateHero,
  collaborateProcessSteps,
  collaborateProofLinks,
  servicesVsCollaborate,
} from "@/features/collaborate/collaborate-content";
import { SubmissionForm } from "@/features/submissions/SubmissionForm";
import { isSubmissionBackendConfigured } from "@/lib/submissions/config";

function CollaborateHeroPanel() {
  return (
    <div className="collaborate-hero-panel">
      <p className="text-mono-label">Alignment Console</p>
      <div
        className="collaborate-hero-ledger"
        aria-label="Collaboration route summary"
      >
        <div>
          <span>Type</span>
          <strong>Broader alignment</strong>
        </div>
        <div>
          <span>Signal</span>
          <strong>Serious context</strong>
        </div>
        <div>
          <span>Route</span>
          <strong>Contact</strong>
        </div>
      </div>
      <p className="text-caption">
        A manual route for opportunities that need clarity before shape.
      </p>
    </div>
  );
}

function DefinitionSection() {
  return (
    <SectionShell
      id="collaborate-definition"
      variant="wide"
      eyebrow={collaborateDefinition.eyebrow}
      title={collaborateDefinition.title}
      description="A clear boundary keeps this page useful and distinct from Services."
    >
      <div className="collaborate-definition">
        <article className="collaborate-definition-copy stack-md">
          <p className="text-body-large text-pretty">
            {collaborateDefinition.body}
          </p>
          <p className="text-body-large text-pretty">
            {collaborateDefinition.secondary}
          </p>
        </article>
        <div className="collaborate-definition-signals">
          {collaborateDefinition.signals.map((signal, index) => (
            <Reveal key={signal} delay={index * 0.05} variant="chip">
              <StatusBadge tone={index === 0 ? "active" : "muted"}>
                {signal}
              </StatusBadge>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function CollaborationLaneSection() {
  return (
    <SectionShell
      id="collaboration-lanes"
      variant="wide"
      eyebrow="Collaboration Lanes"
      title="The right signal can come from different surfaces."
      description="These lanes describe useful starting points without pretending every opportunity has the same shape."
    >
      <div className="collaborate-lane-grid">
        {collaborationLanes.map((lane, index) => (
          <Reveal key={lane.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={lane.eyebrow}
              title={lane.title}
              description={lane.body}
              variant={index === 0 ? "featured" : "default"}
              className="collaboration-lane-card"
            >
              <div className="collaborate-tags">
                {lane.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <StatusBadge tone="muted">{lane.status}</StatusBadge>
            </CosmicCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function FitList({
  label,
  title,
  items,
  tone,
}: Readonly<{
  label: string;
  title: string;
  items: typeof collaborationFitItems | typeof collaborationNotFitItems;
  tone: "active" | "warning";
}>) {
  return (
    <article className="collaborate-fit-panel">
      <div className="collaborate-fit-panel-header">
        <StatusBadge tone={tone}>{label}</StatusBadge>
        <h3 className="text-card-title">{title}</h3>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{String(item.order).padStart(2, "0")}</span>
            <div>
              <strong>{item.title}</strong>
              <p className="text-body">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FitMatrixSection() {
  return (
    <SectionShell
      id="collaborate-fit"
      variant="wide"
      eyebrow="Fit Matrix"
      title="Useful alignment has context, agency, and a real surface."
      description="The goal is not volume. It is finding conversations where the shape deserves careful attention."
    >
      <div className="collaborate-fit-grid">
        <Reveal variant="scale-soft">
          <FitList
            label="Best Fit"
            title="Strong opportunities usually have these signals."
            items={collaborationFitItems}
            tone="active"
          />
        </Reveal>
        <Reveal delay={0.08} variant="scale-soft">
          <FitList
            label="Not Fit"
            title="These messages should be redirected or skipped."
            items={collaborationNotFitItems}
            tone="warning"
          />
        </Reveal>
      </div>
    </SectionShell>
  );
}

function PrinciplesSection() {
  return (
    <SectionShell
      id="alignment-principles"
      variant="wide"
      eyebrow="Alignment Principles"
      title="The filter is intentionally high-signal."
      description="These principles keep broad opportunities from turning vague."
    >
      <div className="collaborate-principles">
        {alignmentPrinciples.map((principle, index) => (
          <Reveal key={principle.id} delay={index * 0.05} variant="scale-soft">
            <article className="collaborate-principle-card">
              <span>{principle.label}</span>
              <div className="stack-xs">
                <h3 className="text-card-title">{principle.title}</h3>
                <p className="text-body">{principle.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ProcessSection() {
  return (
    <SectionShell
      id="collaborate-process"
      variant="wide"
      eyebrow="How to Reach Out"
      title="Start with the context, not a performance."
      description="A clear note is more useful than a polished pitch without substance. The form route stays manual-review only."
    >
      <ol className="collaborate-process">
        {collaborateProcessSteps.map((step) => (
          <li key={step.id} className="collaborate-process-step">
            <span>{step.label}</span>
            <div className="stack-xs">
              <h3 className="text-card-title">{step.title}</h3>
              <p className="text-body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

function CollaborateSubmissionSection({
  backendEnabled,
}: Readonly<{
  backendEnabled: boolean;
}>) {
  return (
    <SectionShell
      id="collaborate-submission"
      variant="wide"
      eyebrow="Alignment Signal"
      title="Send the context behind the opportunity."
      description="Use this for broader aligned opportunities that need context before shape. Services remains the route for scoped build requests."
    >
      <Reveal variant="scale-soft">
        <FormShell
          eyebrow="Collaborate Intake"
          title="Alignment form"
          description="This form stores context only when the Supabase backend is configured. It does not create scheduling, routing, or outcome promises."
          className="submission-intake-panel"
        >
          <SubmissionForm
            submissionType="collaborate"
            backendEnabled={backendEnabled}
            sourcePath="/collaborate"
            title="Send collaboration context"
            description="Share who you are, what exists now, and why the alignment might matter."
          />
        </FormShell>
      </Reveal>
    </SectionShell>
  );
}

function ProofSection() {
  return (
    <SectionShell
      id="collaborate-proof"
      variant="wide"
      eyebrow="Proof and Context"
      title="Inspect the public signal before reaching out."
      description="These routes provide context for the kind of systems, work, and trajectory behind the Collaborate page."
    >
      <div className="collaborate-proof-grid">
        {collaborateProofLinks.map((link, index) => (
          <Reveal key={link.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={link.eyebrow}
              title={link.title}
              description={link.body}
              href={link.href}
              actionLabel={link.cta}
              variant={index === 0 ? "featured" : "default"}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ComparisonSection() {
  return (
    <SectionShell
      id="services-vs-collaborate"
      variant="wide"
      eyebrow="Routing"
      title="Collaborate is not Services."
      description="Both routes matter, but they answer different kinds of context."
    >
      <div className="collaborate-comparison">
        {servicesVsCollaborate.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={item.label}
              title={item.title}
              description={item.body}
              href={item.href}
              actionLabel={item.cta}
              variant={item.id === "collaborate" ? "featured" : "quiet"}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <SectionShell id="collaborate-next" variant="compact">
      <Reveal className="collaborate-cta" variant="scale-soft">
        <div className="stack-sm">
          <p className="text-kicker">{collaborateClosingCta.eyebrow}</p>
          <h2 className="text-section-title text-balance">
            {collaborateClosingCta.title}
          </h2>
          <p className="text-body-large text-pretty">
            {collaborateClosingCta.body}
          </p>
        </div>
        <div className="cluster">
          <LinkButton href={collaborateClosingCta.primary.href}>
            {collaborateClosingCta.primary.label}
          </LinkButton>
          <LinkButton
            href={collaborateClosingCta.secondary.href}
            variant="secondary"
          >
            {collaborateClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function CollaboratePage() {
  const backendEnabled = isSubmissionBackendConfigured();

  return (
    <main className="internal-page collaborate-page">
      <PageHero
        eyebrow={collaborateHero.eyebrow}
        title={collaborateHero.title}
        description={collaborateHero.description}
        status={collaborateHero.status}
        meta={[...collaborateHero.meta]}
        primaryAction={{ label: "Start the Conversation", href: "/contact" }}
        secondaryAction={{ label: "View Projects", href: "/projects" }}
      >
        <CollaborateHeroPanel />
      </PageHero>

      <DefinitionSection />
      <CollaborationLaneSection />
      <FitMatrixSection />
      <PrinciplesSection />
      <ProcessSection />
      <CollaborateSubmissionSection backendEnabled={backendEnabled} />
      <ProofSection />
      <ComparisonSection />

      <SectionShell
        id="collaborate-boundary"
        variant="compact"
        headerAction={
          <StatusBadge tone={backendEnabled ? "active" : "muted"}>
            {backendEnabled ? "Backend configured" : "Backend pending"}
          </StatusBadge>
        }
        eyebrow="Contact Boundary"
        title="The route stays manual and bounded."
        description={
          backendEnabled
            ? "The form route can save collaboration context for manual review. It does not automate decisions or imply that every opportunity should move forward."
            : "Submission backend is not configured yet. Use the verified channels on the Contact page for now."
        }
      >
        <TelemetryCard
          label="Current route"
          value={backendEnabled ? "Server form route" : "Verified channels"}
          description="The conversation starts with context and stays honest about shape, constraints, and fit."
          source={backendEnabled ? "Server route" : "No backend env"}
          tone="active"
        />
      </SectionShell>

      <ClosingCta />
    </main>
  );
}
