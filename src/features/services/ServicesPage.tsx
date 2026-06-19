import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import {
  serviceFitItems,
  serviceLanes,
  serviceNotFitItems,
  serviceProcessSteps,
  serviceProofLinks,
  servicesClosingCta,
  servicesComparison,
  servicesDefinition,
  servicesHero,
} from "@/features/services/services-content";

function ServicesHeroPanel() {
  return (
    <div className="services-hero-panel">
      <p className="text-mono-label">Request Console</p>
      <div className="services-hero-ledger" aria-label="Services request summary">
        <div>
          <span>Type</span>
          <strong>Scoped build</strong>
        </div>
        <div>
          <span>Intake</span>
          <strong>Manual</strong>
        </div>
        <div>
          <span>Route</span>
          <strong>Contact</strong>
        </div>
      </div>
      <p className="text-caption">
        A selective route for requests with enough shape to evaluate and execute.
      </p>
    </div>
  );
}

function DefinitionSection() {
  return (
    <SectionShell
      id="services-definition"
      variant="wide"
      eyebrow={servicesDefinition.eyebrow}
      title={servicesDefinition.title}
      description="A clear boundary keeps this page useful and distinct from broader collaboration."
    >
      <div className="services-definition">
        <article className="services-definition-copy stack-md">
          <p className="text-body-large text-pretty">{servicesDefinition.body}</p>
          <p className="text-body-large text-pretty">
            {servicesDefinition.secondary}
          </p>
        </article>
        <div className="services-definition-signals">
          {servicesDefinition.signals.map((signal, index) => (
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

function ServiceLaneSection() {
  return (
    <SectionShell
      id="service-lanes"
      variant="wide"
      eyebrow="Service Lanes"
      title="The requests that make sense have a real surface."
      description="Each lane is a practical build direction, not a menu of preset offers."
    >
      <div className="services-lane-grid">
        {serviceLanes.map((lane, index) => (
          <Reveal key={lane.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={lane.eyebrow}
              title={lane.title}
              description={lane.body}
              variant={index === 0 ? "featured" : "default"}
              className="service-lane-card"
            >
              <div className="services-tags">
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
  items: typeof serviceFitItems | typeof serviceNotFitItems;
  tone: "active" | "warning";
}>) {
  return (
    <article className="services-fit-panel">
      <div className="services-fit-panel-header">
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
      id="services-fit"
      variant="wide"
      eyebrow="Fit Matrix"
      title="A good request is specific enough to shape."
      description="The point is not to accept every ask. It is to route serious work cleanly."
    >
      <div className="services-fit-grid">
        <Reveal variant="scale-soft">
          <FitList
            label="Best Fit"
            title="Strong requests usually have these signals."
            items={serviceFitItems}
            tone="active"
          />
        </Reveal>
        <Reveal delay={0.08} variant="scale-soft">
          <FitList
            label="Not Fit"
            title="These requests should be redirected or declined."
            items={serviceNotFitItems}
            tone="warning"
          />
        </Reveal>
      </div>
    </SectionShell>
  );
}

function ProcessSection() {
  return (
    <SectionShell
      id="services-process"
      variant="wide"
      eyebrow="Request Process"
      title="Manual by design, clear by necessity."
      description="There is no automated intake flow here. The current path is a focused contact route and a scoped follow-up conversation."
    >
      <ol className="services-process">
        {serviceProcessSteps.map((step) => (
          <li key={step.id} className="services-process-step">
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

function ProofSection() {
  return (
    <SectionShell
      id="services-proof"
      variant="wide"
      eyebrow="Proof Surfaces"
      title="Inspect the work before sending the request."
      description="These routes show the technical direction and interface standards behind the Services page."
    >
      <div className="services-proof-grid">
        {serviceProofLinks.map((link, index) => (
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
      title="Services is not Collaborate."
      description="Both routes matter, but they are not for the same kind of conversation."
    >
      <div className="services-comparison">
        {servicesComparison.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={item.label}
              title={item.title}
              description={item.body}
              href={item.href}
              actionLabel={item.cta}
              variant={item.id === "services" ? "featured" : "quiet"}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <SectionShell id="services-next" variant="compact">
      <Reveal className="services-cta" variant="scale-soft">
        <div className="stack-sm">
          <p className="text-kicker">{servicesClosingCta.eyebrow}</p>
          <h2 className="text-section-title text-balance">
            {servicesClosingCta.title}
          </h2>
          <p className="text-body-large text-pretty">
            {servicesClosingCta.body}
          </p>
        </div>
        <div className="cluster">
          <LinkButton href={servicesClosingCta.primary.href}>
            {servicesClosingCta.primary.label}
          </LinkButton>
          <LinkButton href={servicesClosingCta.secondary.href} variant="secondary">
            {servicesClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function ServicesPage() {
  return (
    <main className="internal-page services-page">
      <PageHero
        eyebrow={servicesHero.eyebrow}
        title={servicesHero.title}
        description={servicesHero.description}
        status={servicesHero.status}
        meta={[...servicesHero.meta]}
        primaryAction={{ label: "Start a Request", href: "/contact" }}
        secondaryAction={{ label: "View Projects", href: "/projects" }}
      >
        <ServicesHeroPanel />
      </PageHero>

      <DefinitionSection />
      <ServiceLaneSection />
      <FitMatrixSection />
      <ProcessSection />
      <ProofSection />
      <ComparisonSection />

      <SectionShell
        id="services-boundary"
        variant="compact"
        headerAction={<StatusBadge tone="muted">No backend flow</StatusBadge>}
        eyebrow="Manual Boundary"
        title="Contact is the current intake path."
        description="The page explains fit and routing. It does not pretend to submit requests, automate decisions, or replace a real conversation."
      >
        <TelemetryCard
          label="Current route"
          value="Manual contact"
          description="The request starts through Contact, then gets clarified before any next move exists."
          source="No form flow"
          tone="active"
        />
      </SectionShell>

      <ClosingCta />
    </main>
  );
}
