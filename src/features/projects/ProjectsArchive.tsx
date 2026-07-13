"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  const shouldReduceMotion = useReducedMotion();

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
        <motion.div className="projects-archive-grid" id="projects-archive-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.36,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                  ease: [0.22, 0.8, 0.28, 1],
                }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          eyebrow="No Matches"
          title={`No projects match ${getProjectFilterLabel(activeFilter)}.`}
          description="Choose another filter to return to available project records."
        />
      )}
    </div>
  );
}
