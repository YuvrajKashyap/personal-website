import type {
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
} from "@/types/project";

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
