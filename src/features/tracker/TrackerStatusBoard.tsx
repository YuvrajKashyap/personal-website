import { Reveal } from "@/components/motion/Reveal";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import type { TrackerStatusCard } from "@/features/tracker/tracker-content";

export function TrackerStatusBoard({
  cards,
}: Readonly<{
  cards: readonly TrackerStatusCard[];
}>) {
  return (
    <div className="tracker-status-board">
      {cards.map((card, index) => (
        <Reveal key={card.id} delay={index * 0.05} variant="scale-soft">
          <div className="tracker-status-card">
            <TelemetryCard
              label={card.label}
              value={card.value}
              description={card.description}
              source={card.source}
              tone={card.tone}
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
