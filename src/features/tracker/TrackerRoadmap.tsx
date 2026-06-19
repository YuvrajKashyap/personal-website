import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TrackerRoadmapItem } from "@/features/tracker/tracker-content";

export function TrackerRoadmap({
  items,
}: Readonly<{
  items: readonly TrackerRoadmapItem[];
}>) {
  return (
    <ol className="tracker-roadmap" aria-label="Tracker next-up roadmap">
      {items.map((item, index) => (
        <Reveal key={item.id} delay={index * 0.05} variant="chip">
          <li className="tracker-roadmap-item">
            <span className="tracker-roadmap-index">{item.label}</span>
            <div className="stack-xs">
              <div className="tracker-roadmap-heading">
                <h3 className="text-card-title">{item.title}</h3>
                <StatusBadge tone="muted">{item.status}</StatusBadge>
              </div>
              <p className="text-body">{item.body}</p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
