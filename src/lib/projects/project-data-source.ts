import "server-only";

import { projectRandomizerSettings } from "@/data/project-randomizer";
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getPublishedProjects,
  getRandomizerPool,
  sortProjects,
} from "@/lib/projects/projects";
import {
  mapSupabaseProjectRow,
  type SupabaseProjectWithRelations,
} from "@/lib/projects/project-mappers";
import {
  getSupabaseDataLayerConfig,
  type SiteDataSourceMode,
} from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public-client";
import type { Project, ProjectRandomizerSettings } from "@/types/project";

export type ProjectDataSourceName = "local" | "supabase" | "local_fallback";

export type ProjectsDataSourceStatus = Readonly<{
  mode: SiteDataSourceMode;
  source: ProjectDataSourceName;
  supabaseConfigured: boolean;
  reason?: string;
}>;

type ProjectsDataResult = Readonly<{
  projects: Project[];
  source: ProjectDataSourceName;
  reason?: string;
}>;

const SUPABASE_PROJECTS_SELECT = `
  *,
  project_links(*),
  project_media(*),
  project_detail_sections(*)
`;

function localProjectsResult(reason?: string): ProjectsDataResult {
  return {
    projects: getAllProjects(),
    source: reason ? "local_fallback" : "local",
    reason,
  };
}

async function getSupabaseProjects(): Promise<Project[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    throw new Error("Supabase public reads are not configured.");
  }

  const { data, error } = await supabase
    .from("projects")
    .select(SUPABASE_PROJECTS_SELECT)
    .eq("visibility", "published")
    .not("published_at", "is", null)
    .order("featured_rank", { ascending: true })
    .order("order_index", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Supabase project read failed: ${error.message}`);
  }

  return sortProjects(
    ((data ?? []) as unknown as SupabaseProjectWithRelations[]).map(
      mapSupabaseProjectRow,
    ),
  );
}

async function loadProjectsData(): Promise<ProjectsDataResult> {
  const config = getSupabaseDataLayerConfig();

  if (config.mode === "local") {
    return localProjectsResult();
  }

  if (!config.isConfigured) {
    if (config.mode === "supabase") {
      throw new Error(config.reason ?? "Supabase public reads are not configured.");
    }

    return localProjectsResult(config.reason);
  }

  try {
    return {
      projects: await getSupabaseProjects(),
      source: "supabase",
    };
  } catch (error) {
    if (config.mode === "supabase") {
      throw error;
    }

    return localProjectsResult(
      error instanceof Error
        ? error.message
        : "Supabase project read failed for an unknown reason.",
    );
  }
}

function getPublishedProjectsFrom(projects: readonly Project[]): Project[] {
  return sortProjects(
    projects.filter((project) => project.visibility === "published"),
  );
}

function getFeaturedProjectsFrom(projects: readonly Project[]): Project[] {
  return sortProjects(
    projects.filter(
      (project) => project.featured && project.visibility === "published",
    ),
  );
}

function getRandomizerPoolFrom(projects: readonly Project[]): Project[] {
  const settings: ProjectRandomizerSettings = projectRandomizerSettings;
  const publishedEligibleProjects = projects.filter(
    (project) =>
      project.randomizerEligible &&
      project.visibility === settings.defaultEligibleVisibility,
  );

  if (settings.mode === "curated_bucket") {
    return sortProjects(
      publishedEligibleProjects.filter((project) =>
        settings.curatedBucketSlugs.includes(project.slug),
      ),
    );
  }

  return sortProjects(publishedEligibleProjects);
}

export async function getAllProjectsData(): Promise<Project[]> {
  const { projects } = await loadProjectsData();
  return sortProjects(projects);
}

export async function getPublishedProjectsData(): Promise<Project[]> {
  const { projects, source } = await loadProjectsData();

  if (source === "local") {
    return getPublishedProjects();
  }

  return getPublishedProjectsFrom(projects);
}

export async function getFeaturedProjectsData(): Promise<Project[]> {
  const { projects, source } = await loadProjectsData();

  if (source === "local") {
    return getFeaturedProjects();
  }

  return getFeaturedProjectsFrom(projects);
}

export async function getProjectBySlugData(
  slug: string,
): Promise<Project | undefined> {
  const { projects, source } = await loadProjectsData();

  if (source === "local") {
    return getProjectBySlug(slug);
  }

  return projects.find((project) => project.slug === slug);
}

export async function getRandomizerPoolData(): Promise<Project[]> {
  const { projects, source } = await loadProjectsData();

  if (source === "local") {
    return getRandomizerPool();
  }

  return getRandomizerPoolFrom(projects);
}

export async function getRelatedProjectsData(
  project: Project,
): Promise<Project[]> {
  const publishedProjects = (await getPublishedProjectsData()).filter(
    (candidate) => candidate.slug !== project.slug,
  );

  const preferredProjects = [
    ...publishedProjects.filter(
      (candidate) => candidate.category === project.category,
    ),
    ...publishedProjects.filter(
      (candidate) => candidate.priority === project.priority,
    ),
    ...publishedProjects,
  ];

  const seenSlugs = new Set<string>();

  return preferredProjects
    .filter((candidate) => {
      if (seenSlugs.has(candidate.slug)) {
        return false;
      }

      seenSlugs.add(candidate.slug);
      return true;
    })
    .slice(0, 3);
}

export function getProjectsDataSourceStatus(): ProjectsDataSourceStatus {
  const config = getSupabaseDataLayerConfig();

  if (config.mode === "local") {
    return {
      mode: config.mode,
      source: "local",
      supabaseConfigured: config.isConfigured,
    };
  }

  if (!config.isConfigured) {
    return {
      mode: config.mode,
      source: config.mode === "auto" ? "local_fallback" : "supabase",
      supabaseConfigured: false,
      reason: config.reason,
    };
  }

  return {
    mode: config.mode,
    source: "supabase",
    supabaseConfigured: true,
  };
}
