import { DetailLayout } from "@/components/layout/DetailLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProjectBySlug, getProjectLinks } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const isPublishedProject = project?.visibility === "published";

  if (!project || !isPublishedProject) {
    return (
      <main className="internal-page">
        <PageHero
          eyebrow="Project Detail"
          title="Project not published"
          description={`No published project case study is available for ${slug}.`}
          status="Content boundary"
          meta={["Case study route", "Local data checked"]}
          variant="detail"
        />
        <SectionShell id="project-detail-boundary" variant="wide">
          <DetailLayout
            header={
              <div className="stack-sm">
                <StatusBadge tone="muted">Safe placeholder</StatusBadge>
                <h2 className="text-section-title text-balance">
                  Project detail shell
                </h2>
                <p className="text-body-large">
                  This route is ready for future project content, but unpublished
                  and unknown slugs stay behind a clear boundary.
                </p>
              </div>
            }
            aside={
              <EmptyState
                eyebrow="Metadata"
                title="No public record."
                description="Draft and needs-review projects are not presented as public case studies."
              />
            }
          >
            <EmptyState
              eyebrow="Content Boundary"
              title="No published details are available."
              description="The slug is displayed safely while the final project case study system waits for approved content."
              action={{ label: "Back to Projects", href: "/projects" }}
            />
          </DetailLayout>
        </SectionShell>
      </main>
    );
  }

  const verifiedLinks = getProjectLinks(project);

  return (
    <main className="internal-page">
      <PageHero
        eyebrow={project.eyebrow ?? "Project Detail"}
        title={project.title}
        description={project.summary}
        status={project.timelineLabel ?? project.status}
        meta={[project.priority, project.category, project.type]}
        variant="detail"
      />
      <SectionShell id="project-detail-template" variant="wide">
        <DetailLayout
          header={
            <div className="stack-sm">
              <StatusBadge tone="active">Local project record</StatusBadge>
              <h2 className="text-section-title text-balance">
                Case study shell
              </h2>
              <p className="text-body-large">
                {project.description}
              </p>
            </div>
          }
          aside={
            <EmptyState
              eyebrow="Project Metadata"
              title={project.timelineLabel ?? project.status}
              description={`Stack ready for future display: ${project.stack.join(", ")}.`}
            />
          }
        >
          <div className="stack-md">
            {project.whatItProves ? (
              <div className="premium-card stack-sm">
                <p className="text-mono-label">What it proves</p>
                <p className="text-body-large">{project.whatItProves}</p>
              </div>
            ) : null}

            {verifiedLinks.length > 0 ? (
              <div className="cluster">
                {verifiedLinks.map((link) => (
                  <LinkButton
                    key={link.href}
                    href={link.href}
                    external={link.external}
                    variant="secondary"
                  >
                    {link.label}
                  </LinkButton>
                ))}
              </div>
            ) : null}
          </div>
          <EmptyState
            eyebrow="Content Boundary"
            title="Full project details come later."
            description="The typed project record exists now. Narrative case studies, media, and deeper evidence remain future assigned work."
            action={{ label: "Back to Projects", href: "/projects" }}
          />
        </DetailLayout>
      </SectionShell>
    </main>
  );
}
