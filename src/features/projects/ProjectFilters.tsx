"use client";

import type { ProjectFilter, ProjectFilterId } from "@/features/projects/projects-page-content";

type ProjectFiltersProps = Readonly<{
  filters: readonly ProjectFilter[];
  activeFilter: ProjectFilterId;
  resultCount: number;
  totalCount: number;
  onFilterChange: (filterId: ProjectFilterId) => void;
}>;

export function ProjectFilters({
  filters,
  activeFilter,
  resultCount,
  totalCount,
  onFilterChange,
}: ProjectFiltersProps) {
  return (
    <div className="project-filter-shell" aria-label="Project archive filters">
      <div className="project-filter-meta">
        <p className="text-mono-label">Archive Filter</p>
        <p className="project-result-count" aria-live="polite">
          {resultCount} of {totalCount} shown
        </p>
      </div>
      <div className="project-filter-grid" role="list">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              className={[
                "project-filter-button focus-ring",
                isActive ? "project-filter-button-active" : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.id)}
              title={filter.description}
            >
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
