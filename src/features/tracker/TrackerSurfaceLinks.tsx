import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TrackerSurfaceLink } from "@/features/tracker/tracker-content";

export function TrackerSurfaceLinks({
  surfaces,
}: Readonly<{
  surfaces: readonly TrackerSurfaceLink[];
}>) {
  return (
    <div className="tracker-surface-grid">
      {surfaces.map((surface, index) => (
        <Reveal key={surface.id} delay={index * 0.05} variant="scale-soft">
          <CosmicCard
            eyebrow={surface.eyebrow}
            title={surface.title}
            description={surface.body}
            href={surface.href}
            actionLabel={surface.cta}
          >
            <StatusBadge tone={surface.status.includes("Active") ? "active" : "muted"}>
              {surface.status}
            </StatusBadge>
          </CosmicCard>
        </Reveal>
      ))}
    </div>
  );
}
