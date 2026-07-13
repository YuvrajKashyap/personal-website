import { Reveal } from "@/components/motion/Reveal";
import { TimelineRail } from "@/components/motion/TimelineRail";
import { ExperienceEntryCard } from "@/features/experience/ExperienceEntryCard";
import type { ExperienceEntry } from "@/features/experience/experience-content";

type ExperienceTimelineProps = Readonly<{
  entries: readonly ExperienceEntry[];
}>;

export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <TimelineRail className="experience-timeline" ariaLabel="Experience trajectory">
      {entries.map((entry, index) => (
        <Reveal key={entry.id} delay={index * 0.05} variant="fade-up">
          <ExperienceEntryCard entry={entry} />
        </Reveal>
      ))}
    </TimelineRail>
  );
}
