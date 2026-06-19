import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ExperienceEntry } from "@/features/experience/experience-content";

const typeLabels: Record<ExperienceEntry["type"], string> = {
  education: "Education",
  leadership: "Leadership",
  research: "Research",
  project: "Project",
  athletics: "Athletics",
  direction: "Direction",
};

type ExperienceEntryCardProps = Readonly<{
  entry: ExperienceEntry;
}>;

export function ExperienceEntryCard({ entry }: ExperienceEntryCardProps) {
  return (
    <li className="experience-entry">
      <div className="experience-entry-marker" aria-hidden="true">
        {String(entry.order).padStart(2, "0")}
      </div>
      <article className="experience-entry-card">
        <div className="experience-entry-heading">
          <div className="stack-xs">
            <p className="text-mono-label">{entry.eyebrow}</p>
            <h3 className="text-card-title">{entry.title}</h3>
          </div>
          <div className="experience-entry-badges">
            <StatusBadge tone="muted">{typeLabels[entry.type]}</StatusBadge>
            {entry.reviewStatus === "conservative" ? (
              <StatusBadge tone="warning">Conservative</StatusBadge>
            ) : (
              <StatusBadge tone="active">Confirmed</StatusBadge>
            )}
          </div>
        </div>

        <dl className="experience-entry-meta">
          {entry.organization ? (
            <div>
              <dt>Organization</dt>
              <dd>{entry.organization}</dd>
            </div>
          ) : null}
          {entry.context ? (
            <div>
              <dt>Context</dt>
              <dd>{entry.context}</dd>
            </div>
          ) : null}
          {entry.periodLabel ? (
            <div>
              <dt>Phase</dt>
              <dd>{entry.periodLabel}</dd>
            </div>
          ) : null}
        </dl>

        <p className="text-body-large text-pretty">{entry.body}</p>

        <div className="experience-entry-signals">
          <p className="text-mono-label">Signals</p>
          <ul>
            {entry.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>

        <div className="experience-entry-tags" aria-label={`${entry.title} tags`}>
          {entry.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </article>
    </li>
  );
}
