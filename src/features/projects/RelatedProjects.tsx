import { CosmicCard } from "@/components/ui/CosmicCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Project } from "@/types/project";
import {
  projectCategoryLabels,
  projectStatusLabels,
} from "@/features/projects/projects-page-content";

export type RelatedProjectsProps = Readonly<{
  projects: readonly Project[];
}>;

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="project-detail-related">
      {projects.map((project) => (
        <CosmicCard
          key={project.slug}
          eyebrow={projectCategoryLabels[project.category]}
          title={project.title}
          description={project.summary}
          href={`/projects/${project.slug}`}
          actionLabel="Open detail"
        >
          <StatusBadge tone={project.status === "live" ? "success" : "active"}>
            {projectStatusLabels[project.status]}
          </StatusBadge>
        </CosmicCard>
      ))}
    </div>
  );
}
