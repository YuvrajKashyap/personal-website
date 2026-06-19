import { StatusBadge } from "@/components/ui/StatusBadge";
import type { AboutPhase } from "@/features/about/about-content";

type AboutPhaseCardProps = Readonly<{
  phase: AboutPhase;
}>;

export function AboutPhaseCard({ phase }: AboutPhaseCardProps) {
  return (
    <li className="about-phase-card">
      <div className="about-phase-index" aria-hidden="true">
        {String(phase.order).padStart(2, "0")}
      </div>
      <article className="about-phase-body">
        <div className="about-phase-heading">
          <p className="text-mono-label">{phase.eyebrow}</p>
          <h3 className="text-card-title">{phase.title}</h3>
        </div>
        <p className="text-body-large">{phase.body}</p>
        <div className="about-phase-signal">
          <span>Signal</span>
          <p>{phase.signal}</p>
        </div>
        <div className="about-phase-tags" aria-label={`${phase.title} tags`}>
          {phase.tags.map((tag) => (
            <StatusBadge key={tag} tone="muted">
              {tag}
            </StatusBadge>
          ))}
        </div>
      </article>
    </li>
  );
}
