import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  serviceFit,
  serviceLanes,
  servicesClosingCta,
  servicesHero,
} from "@/features/services/services-content";

function ServiceLanes() {
  return (
    <section
      id="service-lanes"
      className="lane-section site-container-wide"
      aria-label="Build lanes"
    >
      <Reveal variant="fade-up">
        <p className="text-mono-label">What I take on</p>
      </Reveal>
      <ol className="lane-list">
        {serviceLanes.map((lane, index) => (
          <Reveal key={lane.id} delay={index * 0.06} variant="fade-up">
            <li className="lane-row">
              <span className="lane-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="lane-copy">
                <h2 className="lane-title">{lane.title}</h2>
                <p className="lane-body">{lane.body}</p>
              </div>
              <p className="lane-tags">{lane.tags.join(" / ")}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function FitSection() {
  return (
    <section
      id="service-fit"
      className="fit-section site-container-wide"
      aria-label="Request fit"
    >
      <div className="fit-columns">
        <Reveal className="fit-column" variant="fade-up">
          <p className="text-mono-label">{serviceFit.strong.label}</p>
          <ul aria-label={serviceFit.strong.label}>
            {serviceFit.strong.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal
          className="fit-column fit-column-weak"
          delay={0.08}
          variant="fade-up"
        >
          <p className="text-mono-label">{serviceFit.weak.label}</p>
          <ul aria-label={serviceFit.weak.label}>
            {serviceFit.weak.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section id="services-next" className="closing-cta site-container-wide">
      <Reveal className="closing-cta-inner" variant="fade-up">
        <div className="stack-sm">
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
          <LinkButton
            href={servicesClosingCta.secondary.href}
            variant="secondary"
          >
            {servicesClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}

export function ServicesPage() {
  return (
    <main className="internal-page services-page">
      <PageHero
        eyebrow={servicesHero.eyebrow}
        title={servicesHero.title}
        description={servicesHero.description}
        variant="compact"
        primaryAction={{ label: "Start a request", href: "/contact" }}
      />

      <ServiceLanes />
      <FitSection />
      <ClosingCta />
    </main>
  );
}
