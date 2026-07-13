import { Reveal } from "@/components/motion/Reveal";
import { TimelineRail } from "@/components/motion/TimelineRail";
import { AboutPhaseCard } from "@/features/about/AboutPhaseCard";
import type { AboutPhase } from "@/features/about/about-content";

type AboutTimelineProps = Readonly<{
  phases: readonly AboutPhase[];
}>;

export function AboutTimeline({ phases }: AboutTimelineProps) {
  return (
    <TimelineRail className="about-timeline" ariaLabel="Yuvraj Kashyap life phases">
      {phases.map((phase, index) => (
        <Reveal key={phase.id} delay={index * 0.05} variant="fade-up">
          <AboutPhaseCard phase={phase} />
        </Reveal>
      ))}
    </TimelineRail>
  );
}
