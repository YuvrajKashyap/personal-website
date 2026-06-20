import type {
  Project,
  ProjectCategory,
  ProjectDetailSection,
  ProjectLink,
  ProjectLinkStatus,
  ProjectLinkType,
  ProjectMedia,
  ProjectMediaStatus,
  ProjectMediaType,
  ProjectPriority,
  ProjectRandomizerBucket,
  ProjectStatus,
  ProjectType,
  ProjectVisibility,
} from "@/types/project";
import type {
  SupabaseProjectDetailSectionRow,
  SupabaseProjectLinkRow,
  SupabaseProjectMediaRow,
  SupabaseProjectRow,
} from "@/lib/supabase/database.types";

export type SupabaseProjectWithRelations = SupabaseProjectRow & {
  project_links?: SupabaseProjectLinkRow[] | null;
  project_media?: SupabaseProjectMediaRow[] | null;
  project_detail_sections?: SupabaseProjectDetailSectionRow[] | null;
};

const projectCategories = [
  "ai_systems",
  "search_infrastructure",
  "product_system",
  "personal_os",
  "frontend_experience",
  "developer_tooling",
  "learning_practice",
  "archive",
] as const satisfies readonly ProjectCategory[];

const projectTypes = [
  "platform",
  "app",
  "system",
  "website",
  "experiment",
  "practice",
  "case_study",
] as const satisfies readonly ProjectType[];

const projectStatuses = [
  "active_build",
  "live",
  "portfolio_ready",
  "private",
  "draft",
  "archived",
  "practice",
  "needs_review",
] as const satisfies readonly ProjectStatus[];

const projectPriorities = [
  "flagship",
  "strong",
  "supporting",
  "archive",
] as const satisfies readonly ProjectPriority[];

const projectVisibilities = [
  "published",
  "draft",
  "hidden",
] as const satisfies readonly ProjectVisibility[];

const projectRandomizerBuckets = [
  "flagship",
  "systems",
  "product",
  "experimental",
  "archive",
] as const satisfies readonly ProjectRandomizerBucket[];

const projectLinkTypes = [
  "live",
  "repo",
  "demo",
  "case_study",
  "docs",
  "external",
] as const satisfies readonly ProjectLinkType[];

const projectLinkStatuses = [
  "verified",
  "needs_review",
  "unavailable",
] as const satisfies readonly ProjectLinkStatus[];

const projectMediaTypes = [
  "cover",
  "thumbnail",
  "screenshot",
  "video",
  "diagram",
] as const satisfies readonly ProjectMediaType[];

const projectMediaStatuses = [
  "ready",
  "missing",
  "needs_review",
] as const satisfies readonly ProjectMediaStatus[];

function normalizeEnum<T extends string>(
  value: string | null | undefined,
  allowedValues: readonly T[],
  fallback: T,
): T {
  return allowedValues.includes(value as T) ? (value as T) : fallback;
}

function normalizeOptionalEnum<T extends string>(
  value: string | null | undefined,
  allowedValues: readonly T[],
): T | undefined {
  return allowedValues.includes(value as T) ? (value as T) : undefined;
}

function optionalString(value: string | null | undefined) {
  return value ?? undefined;
}

function normalizeStringArray(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function sortBySortOrder<T extends { sort_order: number; id: string }>(
  rows: readonly T[] | null | undefined,
) {
  return [...(rows ?? [])].sort((rowA, rowB) => {
    if (rowA.sort_order !== rowB.sort_order) {
      return rowA.sort_order - rowB.sort_order;
    }

    return rowA.id.localeCompare(rowB.id);
  });
}

function formatSectionEyebrow(sectionKey: string) {
  return sectionKey
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapSupabaseProjectLinkRow(
  row: SupabaseProjectLinkRow,
): ProjectLink {
  return {
    label: row.label,
    href: row.href,
    type: normalizeEnum(row.type, projectLinkTypes, "external"),
    isPrimary: row.is_primary,
    status: normalizeEnum(row.status, projectLinkStatuses, "needs_review"),
    external: row.external,
    note: optionalString(row.note),
  };
}

export function mapSupabaseProjectMediaRow(
  row: SupabaseProjectMediaRow,
): ProjectMedia {
  return {
    type: normalizeEnum(row.type, projectMediaTypes, "cover"),
    src: optionalString(row.src),
    alt: row.alt ?? "",
    theme: normalizeEnum(row.theme, ["dark", "light", "both"] as const, "both"),
    status: normalizeEnum(row.status, projectMediaStatuses, "missing"),
    note: optionalString(row.note),
  };
}

export function mapSupabaseProjectDetailSectionRow(
  row: SupabaseProjectDetailSectionRow,
): ProjectDetailSection {
  return {
    eyebrow: row.section_key ? formatSectionEyebrow(row.section_key) : undefined,
    title: row.title,
    body: row.body ?? "",
  };
}

export function mapSupabaseProjectRow(
  row: SupabaseProjectWithRelations,
): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: optionalString(row.short_title),
    eyebrow: optionalString(row.eyebrow),
    summary: row.summary,
    description: row.description ?? row.summary,
    category: normalizeEnum(row.category, projectCategories, "archive"),
    type: normalizeEnum(row.type, projectTypes, "system"),
    status: normalizeEnum(row.status, projectStatuses, "draft"),
    priority: normalizeEnum(row.priority, projectPriorities, "archive"),
    visibility: normalizeEnum(row.visibility, projectVisibilities, "draft"),
    featured: row.featured,
    featuredRank: row.featured_rank ?? undefined,
    order: row.order_index,
    randomizerEligible: row.randomizer_eligible,
    randomizerBucket: normalizeOptionalEnum(
      row.randomizer_bucket,
      projectRandomizerBuckets,
    ),
    randomizerWeight: row.randomizer_weight,
    tags: normalizeStringArray(row.tags),
    stack: normalizeStringArray(row.stack),
    highlights: normalizeStringArray(row.highlights),
    problem: optionalString(row.problem),
    solution: optionalString(row.solution),
    whatItProves: optionalString(row.what_it_proves),
    timelineLabel: optionalString(row.timeline_label),
    startedAt: optionalString(row.started_at),
    shippedAt: optionalString(row.shipped_at),
    updatedAt: optionalString(row.updated_label),
    notes: optionalString(row.notes),
    attributionNotes: optionalString(row.attribution_notes),
    links: sortBySortOrder(row.project_links).map(mapSupabaseProjectLinkRow),
    media: sortBySortOrder(row.project_media).map(mapSupabaseProjectMediaRow),
    detailSections: sortBySortOrder(row.project_detail_sections).map(
      mapSupabaseProjectDetailSectionRow,
    ),
  };
}
