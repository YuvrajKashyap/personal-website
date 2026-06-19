import Image from "next/image";
import type { CSSProperties } from "react";

import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Project } from "@/types/project";
import {
  projectCategoryLabels,
  projectPriorityLabels,
  projectStatusLabels,
} from "@/features/projects/projects-page-content";

type ProjectCardProps = Readonly<{
  project: Project;
  variant?: "featured" | "archive";
  index?: number;
}>;

function statusTone(project: Project): "active" | "success" | "warning" | "muted" {
  if (project.status === "live" || project.status === "portfolio_ready") {
    return "success";
  }

  if (project.status === "active_build") {
    return "active";
  }

  if (project.status === "needs_review" || project.visibility !== "published") {
    return "warning";
  }

  return "muted";
}

function ProjectMediaSurface({ project }: Readonly<{ project: Project }>) {
  const readyMedia = project.media.find(
    (media) => media.status === "ready" && media.src,
  );

  if (readyMedia?.src) {
    return (
      <div className="project-card-media project-card-media-ready">
        <Image
          src={readyMedia.src}
          alt={readyMedia.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
    );
  }

  return (
    <div className="project-card-media project-card-media-placeholder" aria-hidden="true">
      <span className="project-card-media-orbit" />
      <span className="project-card-media-axis" />
      <span className="project-card-media-node" />
      <span className="project-card-media-code">
        {project.shortTitle ?? project.title}
      </span>
    </div>
  );
}

export function ProjectCard({
  project,
  variant = "archive",
  index = 0,
}: ProjectCardProps) {
  const verifiedLinks = project.links.filter((link) => link.status === "verified");
  const hasReviewLinks = project.links.some((link) => link.status === "needs_review");
  const visibleStack = project.stack.slice(0, variant === "featured" ? 5 : 4);
  const hiddenStackCount = project.stack.length - visibleStack.length;
  const visibleHighlights = project.highlights.slice(0, variant === "featured" ? 3 : 2);
  const titleId = `project-card-${project.slug}-title`;

  return (
    <article
      className={[
        "project-card",
        `project-card-${variant}`,
        project.featured ? "project-card-is-featured" : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
      style={{ "--project-card-index": index } as CSSProperties}
    >
      <ProjectMediaSurface project={project} />

      <div className="project-card-body">
        <div className="project-card-topline">
          <span className="project-card-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{projectCategoryLabels[project.category]}</span>
        </div>

        <div className="project-card-heading">
          <p className="text-mono-label">{project.eyebrow ?? project.type}</p>
          <h3 id={titleId} className="text-card-title">
            {project.title}
          </h3>
          <p className="text-body">{project.summary}</p>
        </div>

        <div className="project-card-badges">
          <StatusBadge tone={statusTone(project)}>
            {projectStatusLabels[project.status]}
          </StatusBadge>
          <StatusBadge tone={project.priority === "flagship" ? "active" : "muted"}>
            {projectPriorityLabels[project.priority]}
          </StatusBadge>
          {project.featured ? <StatusBadge tone="success">Featured</StatusBadge> : null}
        </div>

        {visibleHighlights.length > 0 ? (
          <ul className="project-card-highlights" aria-label={`${project.title} highlights`}>
            {visibleHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}

        <div className="project-card-stack" aria-label={`${project.title} stack`}>
          {visibleStack.map((item) => (
            <span key={item}>{item}</span>
          ))}
          {hiddenStackCount > 0 ? <span>+{hiddenStackCount}</span> : null}
        </div>

        <div className="project-card-actions">
          <LinkButton href={`/projects/${project.slug}`} variant="secondary" size="sm">
            View archive entry
          </LinkButton>
          {verifiedLinks.map((link) => (
            <LinkButton
              key={link.href}
              href={link.href}
              external={link.external}
              variant="quiet"
              size="sm"
            >
              {link.label}
            </LinkButton>
          ))}
          {hasReviewLinks && verifiedLinks.length === 0 ? (
            <span className="project-card-review-note">Links in review</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
