"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectFilters } from "@/features/projects/ProjectFilters";
import {
  getProjectFilterLabel,
  matchesProjectFilter,
  projectFilters,
  type ProjectFilterId,
} from "@/features/projects/projects-page-content";
import type { Project } from "@/types/project";

type ProjectsArchiveProps = Readonly<{
  projects: Project[];
}>;

export function ProjectsArchive({ projects }: ProjectsArchiveProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterId>("all");

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        matchesProjectFilter(project, activeFilter),
      ),
    [activeFilter, projects],
  );

  return (
    <div className="projects-archive">
      <ProjectFilters
        filters={projectFilters}
        activeFilter={activeFilter}
        resultCount={filteredProjects.length}
        totalCount={projects.length}
        onFilterChange={setActiveFilter}
      />

      {filteredProjects.length > 0 ? (
        <div className="projects-archive-grid" id="projects-archive-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          eyebrow="No Matches"
          title={`No projects match ${getProjectFilterLabel(activeFilter)}.`}
          description="Choose another filter to return to available local project records."
        />
      )}
    </div>
  );
}
