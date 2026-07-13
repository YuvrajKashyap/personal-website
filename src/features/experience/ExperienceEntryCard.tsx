import type { ExperienceEntry } from "@/features/experience/experience-content";

type ExperienceEntryCardProps = Readonly<{
  entry: ExperienceEntry;
}>;

export function ExperienceEntryCard({ entry }: ExperienceEntryCardProps) {
  const contextLine = entry.organization ?? entry.context;

  return (
    <li className="experience-entry">
      <div className="experience-entry-marker" aria-hidden="true">
        {String(entry.order).padStart(2, "0")}
      </div>
      <article className="experience-entry-card">
        <div className="experience-entry-heading">
          <p className="text-mono-label">{entry.eyebrow}</p>
          {entry.periodLabel ? (
            <p className="experience-entry-period">{entry.periodLabel}</p>
          ) : null}
        </div>
        <h3 className="text-card-title">{entry.title}</h3>
        {contextLine ? (
          <p className="experience-entry-context">{contextLine}</p>
        ) : null}
        <p className="text-body text-pretty">{entry.body}</p>
      </article>
    </li>
  );
}
