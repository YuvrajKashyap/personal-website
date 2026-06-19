import { Reveal } from "@/components/motion/Reveal";
import { ExperienceEntryCard } from "@/features/experience/ExperienceEntryCard";
import type { ExperienceEntry } from "@/features/experience/experience-content";

type ExperienceTimelineProps = Readonly<{
  entries: readonly ExperienceEntry[];
}>;

export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <ol className="experience-timeline" aria-label="Experience trajectory">
      {entries.map((entry, index) => (
        <Reveal key={entry.id} delay={index * 0.05} variant="fade-up">
          <ExperienceEntryCard entry={entry} />
        </Reveal>
      ))}
    </ol>
  );
}
