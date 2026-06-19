export type ProjectStatus =
  | "active_build"
  | "live"
  | "portfolio_ready"
  | "private"
  | "draft"
  | "archived"
  | "practice"
  | "needs_review";

export type ProjectPriority = "flagship" | "strong" | "supporting" | "archive";

export type ProjectVisibility = "published" | "draft" | "hidden";

export type ProjectCategory =
  | "ai_systems"
  | "search_infrastructure"
  | "product_system"
  | "personal_os"
  | "frontend_experience"
  | "developer_tooling"
  | "learning_practice"
  | "archive";

export type ProjectType =
  | "platform"
  | "app"
  | "system"
  | "website"
  | "experiment"
  | "practice"
  | "case_study";

export type ProjectLinkType =
  | "live"
  | "repo"
  | "demo"
  | "case_study"
  | "docs"
  | "external";

export type ProjectLinkStatus = "verified" | "needs_review" | "unavailable";

export type ProjectMediaType =
  | "cover"
  | "thumbnail"
  | "screenshot"
  | "video"
  | "diagram";

export type ProjectMediaStatus = "ready" | "missing" | "needs_review";

export type ProjectRandomizerMode = "full_random" | "curated_bucket";

export type ProjectRandomizerButtonBehavior = "open_project_route";

export type ProjectRandomizerBucket =
  | "flagship"
  | "systems"
  | "product"
  | "experimental"
  | "archive";

export type ProjectLink = {
  label: string;
  href: string;
  type: ProjectLinkType;
  isPrimary?: boolean;
  status: ProjectLinkStatus;
  external?: boolean;
  note?: string;
};

export type ProjectMedia = {
  type: ProjectMediaType;
  src?: string;
  alt: string;
  theme?: "dark" | "light" | "both";
  status: ProjectMediaStatus;
  note?: string;
};

export type ProjectDetailSection = {
  title: string;
  body: string;
  eyebrow?: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  eyebrow?: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  visibility: ProjectVisibility;
  featured: boolean;
  featuredRank?: number;
  order: number;
  randomizerEligible: boolean;
  randomizerBucket?: ProjectRandomizerBucket;
  randomizerWeight?: number;
  tags: string[];
  stack: string[];
  highlights: string[];
  problem?: string;
  solution?: string;
  whatItProves?: string;
  timelineLabel?: string;
  startedAt?: string;
  shippedAt?: string;
  updatedAt?: string;
  notes?: string;
  attributionNotes?: string;
  links: ProjectLink[];
  media: ProjectMedia[];
  detailSections?: ProjectDetailSection[];
};

export type ProjectRandomizerSettings = {
  mode: ProjectRandomizerMode;
  curatedBucketSlugs: string[];
  buttonBehavior: ProjectRandomizerButtonBehavior;
  defaultEligibleVisibility: ProjectVisibility;
  allowNeedsReviewLinks: boolean;
};
