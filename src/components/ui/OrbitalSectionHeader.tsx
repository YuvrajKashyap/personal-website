type HeadingLevel = 1 | 2 | 3 | 4;

export type OrbitalSectionHeaderProps = Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  index?: string;
  align?: "start" | "center";
  headingLevel?: HeadingLevel;
  id?: string;
  className?: string;
}>;

export function OrbitalSectionHeader({
  eyebrow,
  title,
  description,
  index,
  align = "start",
  headingLevel = 2,
  id,
  className,
}: OrbitalSectionHeaderProps) {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4";

  return (
    <div
      className={["orbital-section-header", `orbital-section-header-${align}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="orbital-section-meta">
        {index ? <span>{index}</span> : null}
        {eyebrow ? <span>{eyebrow}</span> : null}
      </div>
      <Heading id={id} className="text-section-title text-balance">
        {title}
      </Heading>
      {description ? (
        <p className="text-body-large text-pretty">{description}</p>
      ) : null}
    </div>
  );
}
