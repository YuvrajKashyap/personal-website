import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { TrackerStatusBoard } from "@/features/tracker/TrackerStatusBoard";
import {
  trackerClosingCta,
  trackerHero,
  trackerStatusCards,
  trackerThreads,
} from "@/features/tracker/tracker-content";

function TrackerThreads() {
  return (
    <section
      id="tracker-threads"
      className="tracker-threads site-container-wide"
      aria-label="Current threads"
    >
      <div className="tracker-thread-columns">
        {trackerThreads.map((thread, index) => (
          <Reveal
            key={thread.id}
            className="tracker-thread"
            delay={index * 0.08}
            variant="fade-up"
          >
            <p className="text-mono-label">{thread.label}</p>
            <ul aria-label={thread.label}>
              {thread.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section id="tracker-next" className="closing-cta site-container-wide">
      <Reveal className="closing-cta-inner" variant="fade-up">
        <div className="stack-sm">
          <h2 className="text-section-title text-balance">
            {trackerClosingCta.title}
          </h2>
          <p className="text-body-large text-pretty">{trackerClosingCta.body}</p>
        </div>
        <div className="cluster">
          <LinkButton href={trackerClosingCta.primary.href}>
            {trackerClosingCta.primary.label}
          </LinkButton>
          <LinkButton
            href={trackerClosingCta.secondary.href}
            variant="secondary"
          >
            {trackerClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}

export function TrackerPage() {
  return (
    <main className="internal-page tracker-page">
      <PageHero
        eyebrow={trackerHero.eyebrow}
        title={trackerHero.title}
        description={trackerHero.description}
        variant="compact"
      />

      <section
        id="tracker-current-state"
        className="tracker-board site-container-wide"
        aria-label="Current state board"
      >
        <TrackerStatusBoard cards={trackerStatusCards} />
      </section>

      <TrackerThreads />
      <ClosingCta />
    </main>
  );
}
