import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectDetailPage } from "@/features/projects/ProjectDetailPage";
import {
  getAllProjects,
  getProjectBySlugData,
  getRelatedProjectsData,
} from "@/lib/projects";
import { createProjectMetadata } from "@/lib/seo/metadata";

type ProjectDetailRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

function ProjectDetailBoundary({ slug }: Readonly<{ slug: string }>) {
  return (
    <main className="internal-page project-detail">
      <PageHero
        eyebrow="Project Detail"
        title="Project not available"
        description={`No public project detail is available for ${slug}.`}
        status="Content boundary"
        meta={["Project data checked", "No public case study"]}
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
  const project = await getProjectBySlugData(slug);

  if (!project || project.visibility === "hidden") {
    return createProjectMetadata();
  }

  return createProjectMetadata(project);
}

export default async function ProjectDetailRoute({
  params,
}: ProjectDetailRouteProps) {
  const { slug } = await params;
  const project = await getProjectBySlugData(slug);

  if (!project || project.visibility === "hidden") {
    return <ProjectDetailBoundary slug={slug} />;
  }

  return (
    <ProjectDetailPage
      project={project}
      relatedProjects={await getRelatedProjectsData(project)}
    />
  );
}
