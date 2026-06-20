import Image from "next/image";

import { DetailLayout } from "@/components/layout/DetailLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import type { Project, ProjectStatus } from "@/types/project";
import { ProjectDetailSection } from "@/features/projects/ProjectDetailSection";
import { ProjectLinksPanel } from "@/features/projects/ProjectLinksPanel";
import { ProjectStackList } from "@/features/projects/ProjectStackList";
import { RelatedProjects } from "@/features/projects/RelatedProjects";
import {
  projectCategoryLabels,
  projectPriorityLabels,
  projectStatusLabels,
} from "@/features/projects/projects-page-content";

export type ProjectDetailPageProps = Readonly<{
  project: Project;
  relatedProjects: readonly Project[];
}>;

function statusTone(status: ProjectStatus): "active" | "success" | "warning" | "muted" {
  if (status === "live" || status === "portfolio_ready") {
    return "success";
  }

  if (status === "active_build") {
    return "active";
  }

  if (status === "needs_review" || status === "draft") {
    return "warning";
  }

  return "muted";
}

function telemetryTone(status: ProjectStatus): "active" | "warning" | "muted" {
  if (status === "live" || status === "portfolio_ready" || status === "active_build") {
    return "active";
  }

  if (status === "needs_review" || status === "draft") {
    return "warning";
  }

  return "muted";
}

function formatProjectType(type: Project["type"]) {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ProjectDetailMedia({ project }: Readonly<{ project: Project }>) {
  const readyMedia = project.media.find(
    (media) => media.status === "ready" && media.src,
  );

  if (readyMedia?.src) {
    return (
      <div className="project-detail-media project-detail-media-ready">
        <Image
          src={readyMedia.src}
          alt={readyMedia.alt}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div
      className="project-detail-media project-detail-media-placeholder"
      aria-label={`${project.title} media placeholder`}
      role="img"
    >
      <span className="project-detail-media-orbit" aria-hidden="true" />
      <span className="project-detail-media-axis" aria-hidden="true" />
      <span className="project-detail-media-node" aria-hidden="true" />
      <span className="project-detail-media-label">
        {project.shortTitle ?? project.title}
      </span>
      <span className="project-detail-media-caption">
        Visual media pending review
      </span>
    </div>
  );
}

function ProjectHeroPanel({ project }: Readonly<{ project: Project }>) {
  return (
    <div className="project-detail-hero-panel">
      <p className="text-mono-label">Project Dossier</p>
      <div className="project-detail-hero-status">
        <StatusBadge tone={statusTone(project.status)}>
          {projectStatusLabels[project.status]}
        </StatusBadge>
        <StatusBadge tone={project.priority === "flagship" ? "active" : "muted"}>
          {projectPriorityLabels[project.priority]}
        </StatusBadge>
      </div>
      <dl className="project-detail-hero-meta">
        <div>
          <dt>Category</dt>
          <dd>{projectCategoryLabels[project.category]}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{formatProjectType(project.type)}</dd>
        </div>
        <div>
          <dt>Status source</dt>
          <dd>Project model</dd>
        </div>
      </dl>
    </div>
  );
}

export function ProjectDetailPage({
  project,
  relatedProjects,
}: ProjectDetailPageProps) {
  const verifiedLinks = project.links.filter((link) => link.status === "verified");
  const primaryLink = verifiedLinks.find((link) => link.isPrimary) ?? verifiedLinks[0];
  const detailSections = project.detailSections ?? [];

  return (
    <main className="internal-page project-detail">
      <PageHero
        eyebrow={`${projectCategoryLabels[project.category]} / ${projectStatusLabels[project.status]}`}
        title={project.title}
        description={project.summary}
        status={project.timelineLabel ?? projectStatusLabels[project.status]}
        meta={[
          projectPriorityLabels[project.priority],
          formatProjectType(project.type),
          project.visibility === "published" ? "Published record" : "Content boundary",
        ]}
        primaryAction={
          primaryLink
            ? {
                label: primaryLink.label,
                href: primaryLink.href,
                external: primaryLink.external,
              }
            : undefined
        }
        secondaryAction={{ label: "Back to Projects", href: "/projects" }}
        variant="detail"
      >
        <ProjectHeroPanel project={project} />
      </PageHero>

      <SectionShell
        id="project-detail-dossier"
        variant="wide"
        eyebrow="Project Detail"
        title="A structured read on the build."
        description="The page uses approved project data and keeps current-state boundaries visible."
      >
        <DetailLayout
          className="project-detail-layout"
          header={
            <div className="project-detail-intro">
              <StatusBadge tone={statusTone(project.status)}>
                {projectStatusLabels[project.status]}
              </StatusBadge>
              <div className="stack-sm">
                <h2 className="text-section-title text-balance">
                  {project.description}
                </h2>
                <p className="text-body-large">
                  Stack, status, evidence, and public actions are rendered from
                  the typed project record.
                </p>
              </div>
            </div>
          }
          aside={
            <div className="project-detail-sidebar stack-md">
              <TelemetryCard
                label="Status"
                value={projectStatusLabels[project.status]}
                description={project.timelineLabel ?? "Project model status"}
                source="Project data"
                tone={telemetryTone(project.status)}
              />
              <TelemetryCard
                label="Stack items"
                value={String(project.stack.length)}
                description="Technologies listed in the project model."
                source="Typed record"
                tone="muted"
              />
              <ProjectLinksPanel project={project} />
            </div>
          }
        >
          <div className="project-detail-main stack-lg">
            <Reveal variant="scale-soft">
              <ProjectDetailMedia project={project} />
            </Reveal>

            <div className="project-detail-summary-grid">
              <div>
                <p className="text-mono-label">Category</p>
                <p className="text-card-title">
                  {projectCategoryLabels[project.category]}
                </p>
              </div>
              <div>
                <p className="text-mono-label">Type</p>
                <p className="text-card-title">{formatProjectType(project.type)}</p>
              </div>
              <div>
                <p className="text-mono-label">Priority</p>
                <p className="text-card-title">
                  {projectPriorityLabels[project.priority]}
                </p>
              </div>
            </div>

            <ProjectDetailSection
              id="project-overview"
              eyebrow="Overview"
              title="What this project is"
            >
              <p className="text-body-large">{project.description}</p>
              <div className="project-detail-tags" aria-label={`${project.title} tags`}>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </ProjectDetailSection>

            <ProjectDetailSection
              id="project-problem"
              eyebrow="Problem"
              title="Why it matters"
            >
              <p className="text-body-large">
                {project.problem ??
                  "The project addresses the system space described in the local project record."}
              </p>
            </ProjectDetailSection>

            <ProjectDetailSection
              id="project-solution"
              eyebrow="Solution"
              title="Approach"
            >
              <p className="text-body-large">
                {project.solution ??
                  "The current public record describes the project direction without claiming final outcomes."}
              </p>
            </ProjectDetailSection>

            <ProjectDetailSection
              id="project-architecture"
              eyebrow="Architecture"
              title="System shape and stack"
            >
              {detailSections.length > 0 ? (
                <div className="project-detail-notes-grid">
                  {detailSections.map((section) => (
                    <article key={section.title} className="premium-card stack-sm">
                      {section.eyebrow ? (
                        <p className="text-mono-label">{section.eyebrow}</p>
                      ) : null}
                      <h4 className="text-card-title">{section.title}</h4>
                      <p className="text-body">{section.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  eyebrow="Architecture"
                  title="Architecture notes are still limited."
                  description="The public record has stack information, but deeper diagrams and system notes are not published yet."
                />
              )}
              <ProjectStackList
                items={project.stack}
                label={`${project.title} technology stack`}
              />
            </ProjectDetailSection>

            <ProjectDetailSection
              id="project-highlights"
              eyebrow="Technical Highlights"
              title="Visible technical signal"
            >
              <ul className="project-detail-list">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </ProjectDetailSection>

            <ProjectDetailSection
              id="project-proof"
              eyebrow="What It Proves"
              title="Builder signal"
            >
              <p className="text-body-large">
                {project.whatItProves ??
                  "The project is kept in the archive as a conservative signal of product and technical direction."}
              </p>
            </ProjectDetailSection>

            {project.attributionNotes || project.notes ? (
              <ProjectDetailSection
                id="project-boundaries"
                eyebrow="Boundaries"
                title="Context that should stay visible"
              >
                {project.attributionNotes ? (
                  <p className="text-body-large">{project.attributionNotes}</p>
                ) : null}
                {project.notes ? (
                  <p className="text-body-large">{project.notes}</p>
                ) : null}
              </ProjectDetailSection>
            ) : null}
          </div>
        </DetailLayout>
      </SectionShell>

      <SectionShell
        id="project-related"
        variant="wide"
        eyebrow="Next Orbit"
        title="Related projects"
        description="A small set of published records for continued exploration."
      >
        <RelatedProjects projects={relatedProjects} />
      </SectionShell>
    </main>
  );
}
