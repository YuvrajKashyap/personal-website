import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import type { ExperiencePillar } from "@/features/experience/experience-content";

type ExperiencePillarsProps = Readonly<{
  pillars: readonly ExperiencePillar[];
}>;

export function ExperiencePillars({ pillars }: ExperiencePillarsProps) {
  return (
    <div className="experience-pillars">
      {pillars.map((pillar, index) => (
        <Reveal key={pillar.id} delay={index * 0.06} variant="scale-soft">
          <CosmicCard
            eyebrow={pillar.eyebrow}
            title={pillar.title}
            description={pillar.body}
            variant={index === 0 ? "featured" : "default"}
          />
        </Reveal>
      ))}
    </div>
  );
}
