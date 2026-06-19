export type ProjectDetailSectionProps = Readonly<{
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}>;

export function ProjectDetailSection({
  id,
  eyebrow,
  title,
  children,
}: ProjectDetailSectionProps) {
  return (
    <section className="project-detail-section" aria-labelledby={id}>
      {eyebrow ? <p className="text-mono-label">{eyebrow}</p> : null}
      <h3 id={id} className="text-card-title">
        {title}
      </h3>
      <div className="project-detail-section-body">{children}</div>
    </section>
  );
}
