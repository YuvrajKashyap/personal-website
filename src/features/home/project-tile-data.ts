import type { Project } from "@/types/project";

/**
 * What a Home project tile reads: what it shows, what search matches against,
 * and its repo link. The grid is a client component, so everything handed to
 * it is serialized into the page; full project records (case study, notes,
 * problem/solution) would more than double Home's inline payload for nothing.
 */
export type ProjectTileData = Readonly<
  Pick<Project, "id" | "slug" | "title" | "summary" | "eyebrow" | "category" | "tags" | "stack"> & {
    repoHref?: string;
  }
>;

export function toProjectTileData(project: Project): ProjectTileData {
  const repoHref = project.links.find(
    (link) => link.type === "repo" && link.status === "verified",
  )?.href;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    eyebrow: project.eyebrow,
    category: project.category,
    tags: project.tags,
    stack: project.stack,
    ...(repoHref ? { repoHref } : {}),
  };
}
