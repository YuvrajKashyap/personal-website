import { projectRandomizerSettings } from "@/data/project-randomizer";
import { projects } from "@/data/projects";
import type {
  Project,
  ProjectCategory,
  ProjectLink,
  ProjectPriority,
  ProjectRandomizerSettings,
} from "@/types/project";

export type ProjectLinkOptions = Readonly<{
  includeNeedsReview?: boolean;
  includeUnavailable?: boolean;
}>;

function byProjectOrder(projectA: Project, projectB: Project) {
  const featuredRankA = projectA.featuredRank ?? Number.POSITIVE_INFINITY;
  const featuredRankB = projectB.featuredRank ?? Number.POSITIVE_INFINITY;

  if (featuredRankA !== featuredRankB) {
    return featuredRankA - featuredRankB;
  }

  if (projectA.order !== projectB.order) {
    return projectA.order - projectB.order;
  }

  return projectA.title.localeCompare(projectB.title);
}

export function sortProjects(projectList: readonly Project[]): Project[] {
  return [...projectList].sort(byProjectOrder);
}

export function getAllProjects(): Project[] {
  return sortProjects(projects);
}

export function getPublishedProjects(): Project[] {
  return sortProjects(
    projects.filter((project) => project.visibility === "published"),
  );
}

export function getFeaturedProjects(): Project[] {
  return sortProjects(
    projects.filter(
      (project) => project.featured && project.visibility === "published",
    ),
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return sortProjects(
    projects.filter((project) => project.category === category),
  );
}

export function getProjectsByPriority(priority: ProjectPriority): Project[] {
  return sortProjects(
    projects.filter((project) => project.priority === priority),
  );
}

export function getRandomizerPool(
  settings: ProjectRandomizerSettings = projectRandomizerSettings,
): Project[] {
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

export function getProjectLinks(
  project: Project,
  options: ProjectLinkOptions = {},
): ProjectLink[] {
  const { includeNeedsReview = false, includeUnavailable = false } = options;

  return project.links.filter((link) => {
    if (link.status === "verified") {
      return true;
    }

    if (link.status === "needs_review") {
      return includeNeedsReview;
    }

    return includeUnavailable;
  });
}
