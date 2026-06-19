import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Project } from "@/types/project";

export type ProjectLinksPanelProps = Readonly<{
  project: Project;
}>;

export function ProjectLinksPanel({ project }: ProjectLinksPanelProps) {
  const verifiedLinks = project.links.filter((link) => link.status === "verified");
  const hasReviewLinks = project.links.some((link) => link.status === "needs_review");

  return (
    <div className="project-detail-link-panel">
      <div className="stack-sm">
        <p className="text-mono-label">Public Actions</p>
        <h3 className="text-card-title">Verified links only.</h3>
        <p className="text-body">
          Public actions are limited to reviewed links. Draft, unavailable, and
          needs-review links stay out of the action layer.
        </p>
      </div>

      <div className="project-detail-link-actions">
        {verifiedLinks.map((link) => (
          <LinkButton
            key={link.href}
            href={link.href}
            external={link.external}
            variant={link.isPrimary ? "primary" : "secondary"}
          >
            {link.label}
          </LinkButton>
        ))}
        <LinkButton href="/projects" variant="secondary">
          Back to Projects
        </LinkButton>
      </div>

      {verifiedLinks.length === 0 ? (
        <div className="project-detail-link-note">
          <StatusBadge tone={hasReviewLinks ? "warning" : "muted"}>
            {hasReviewLinks ? "Links in review" : "No public links"}
          </StatusBadge>
          <p className="text-caption">
            {hasReviewLinks
              ? "Potential links exist in the data model, but they are not shown until reviewed."
              : "No verified public link is available for this project yet."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
