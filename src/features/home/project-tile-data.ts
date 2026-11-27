import type { Project } from "@/types/project";

type ProjectLink = Project["links"][number];

/**
 * What a Home project tile reads: what it shows, what search matches against,
 * where it links and its archive cover. The grid is a client component, so
 * everything handed to it is serialized into the page; full project records
 * (case study, notes, problem/solution) would more than double Home's inline
 * payload for nothing.
 */
export type ProjectTileData = Readonly<
  Pick<Project, "id" | "slug" | "title" | "summary" | "eyebrow" | "category" | "tags" | "stack"> & {
    /** The verified repo, or failing that the verified primary live site. */
    archiveLink?: Readonly<Pick<ProjectLink, "href" | "type">>;
    /** A ready media item marked for the archive card, shown instead of the preview. */
    archiveCover?: string;
  }
>;

export function toProjectTileData(project: Project): ProjectTileData {
  const link =
    project.links.find((item) => item.type === "repo" && item.status === "verified") ??
    project.links.find((item) => item.type === "live" && item.isPrimary && item.status === "verified");
  const archiveCover = project.media.find(
    (item) => item.showOnArchiveCard && item.status === "ready",
  )?.src;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    eyebrow: project.eyebrow,
    category: project.category,
    tags: project.tags,
    stack: project.stack,
    ...(link ? { archiveLink: { href: link.href, type: link.type } } : {}),
    ...(archiveCover ? { archiveCover } : {}),
  };
}
