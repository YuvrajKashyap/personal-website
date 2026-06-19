import type {
  Project,
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
} from "@/types/project";

export type ProjectFilterId =
  | "all"
  | "featured"
  | "flagship"
  | "active-live"
  | "ai-systems"
  | "infrastructure"
  | "product-systems"
  | "supporting";

export type ProjectFilter = Readonly<{
  id: ProjectFilterId;
  label: string;
  description: string;
}>;

export const projectFilters = [
  {
    id: "all",
    label: "All",
    description: "Every local project record.",
  },
  {
    id: "featured",
    label: "Featured",
    description: "Pinned proof surfaces.",
  },
  {
    id: "flagship",
    label: "Flagship",
    description: "Highest-priority systems.",
  },
  {
    id: "active-live",
    label: "Active/Live",
    description: "Live or actively shaped work.",
  },
  {
    id: "ai-systems",
    label: "AI Systems",
    description: "Retrieval, AI workspace, and evaluation work.",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Search, crawl, and platform foundations.",
  },
  {
    id: "product-systems",
    label: "Product Systems",
    description: "Operating systems and product surfaces.",
  },
  {
    id: "supporting",
    label: "Supporting",
    description: "Supporting and experimental builds.",
  },
] satisfies ProjectFilter[];

export const projectCategoryLabels = {
  ai_systems: "AI Systems",
  search_infrastructure: "Search Infrastructure",
  product_system: "Product System",
  personal_os: "Personal OS",
  frontend_experience: "Frontend Experience",
  developer_tooling: "Developer Tooling",
  learning_practice: "Learning Practice",
  archive: "Archive",
} satisfies Record<ProjectCategory, string>;

export const projectPriorityLabels = {
  flagship: "Flagship",
  strong: "Strong",
  supporting: "Supporting",
  archive: "Archive",
} satisfies Record<ProjectPriority, string>;

export const projectStatusLabels = {
  active_build: "Active Build",
  live: "Live",
  portfolio_ready: "Portfolio Ready",
  private: "Private",
  draft: "Draft",
  archived: "Archived",
  practice: "Practice",
  needs_review: "Needs Review",
} satisfies Record<ProjectStatus, string>;

export function getProjectFilterLabel(filterId: ProjectFilterId) {
  return projectFilters.find((filter) => filter.id === filterId)?.label ?? "All";
}

export function matchesProjectFilter(
  project: Project,
  filterId: ProjectFilterId,
) {
  switch (filterId) {
    case "featured":
      return project.featured;
    case "flagship":
      return project.priority === "flagship";
    case "active-live":
      return project.status === "active_build" || project.status === "live";
    case "ai-systems":
      return project.category === "ai_systems";
    case "infrastructure":
      return project.category === "search_infrastructure";
    case "product-systems":
      return (
        project.category === "product_system" ||
        project.category === "personal_os"
      );
    case "supporting":
      return project.priority === "supporting";
    case "all":
    default:
      return true;
  }
}
