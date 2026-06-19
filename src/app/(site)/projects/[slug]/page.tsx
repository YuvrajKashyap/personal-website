import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectDetailPage } from "@/features/projects/ProjectDetailPage";
import {
  getAllProjects,
  getProjectBySlug,
  getPublishedProjects,
} from "@/lib/projects";
import type { Project } from "@/types/project";

type ProjectDetailRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getRelatedProjects(project: Project) {
  const publishedProjects = getPublishedProjects().filter(
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

function ProjectDetailBoundary({ slug }: Readonly<{ slug: string }>) {
  return (
    <main className="internal-page project-detail">
      <PageHero
        eyebrow="Project Detail"
        title="Project not available"
        description={`No public project detail is available for ${slug}.`}
        status="Content boundary"
        meta={["Local data checked", "No public case study"]}
        secondaryAction={{ label: "Back to Projects", href: "/projects" }}
        variant="detail"
      />
      <SectionShell id="project-detail-boundary" variant="wide">
        <EmptyState
          eyebrow="Project Boundary"
          title="No approved project record was found."
          description="Unknown and hidden project slugs stay behind a clear boundary instead of showing invented content."
          action={{ label: "Back to Projects", href: "/projects" }}
        />
      </SectionShell>
    </main>
  );
}

export function generateStaticParams() {
  return getAllProjects()
    .filter((project) => project.visibility !== "hidden")
    .map((project) => ({
      slug: project.slug,
    }));
}

export async function generateMetadata({
  params,
}: ProjectDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.visibility === "hidden") {
    return {
      title: "Project Not Available | Yuvraj Kashyap",
      description: "No public project detail is available for this slug.",
    };
  }

  return {
    title: `${project.title} | Yuvraj Kashyap`,
    description: project.summary,
  };
}

export default async function ProjectDetailRoute({
  params,
}: ProjectDetailRouteProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.visibility === "hidden") {
    return <ProjectDetailBoundary slug={slug} />;
  }

  return (
    <ProjectDetailPage
      project={project}
      relatedProjects={getRelatedProjects(project)}
    />
  );
}
