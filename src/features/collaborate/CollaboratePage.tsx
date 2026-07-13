import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  collaborateClosingCta,
  collaborateHero,
  collaborationLanes,
} from "@/features/collaborate/collaborate-content";

function CollaborationLanes() {
  return (
    <section
      id="collaboration-lanes"
      className="lane-section site-container-wide"
      aria-label="Collaboration lanes"
    >
      <Reveal variant="fade-up">
        <p className="text-mono-label">Where alignment tends to happen</p>
      </Reveal>
      <ol className="lane-list">
        {collaborationLanes.map((lane, index) => (
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

function ClosingCta() {
  return (
    <section id="collaborate-next" className="closing-cta site-container-wide">
      <Reveal className="closing-cta-inner" variant="fade-up">
        <div className="stack-sm">
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
    </section>
  );
}

export function CollaboratePage() {
  return (
    <main className="internal-page collaborate-page">
      <PageHero
        eyebrow={collaborateHero.eyebrow}
        title={collaborateHero.title}
        description={collaborateHero.description}
        variant="compact"
        primaryAction={{ label: "Start a conversation", href: "/contact" }}
      />

      <CollaborationLanes />
      <ClosingCta />
    </main>
  );
}
