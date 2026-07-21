import { Reveal } from "@/components/motion/Reveal";
import { OrbitalSectionHeader } from "@/components/ui/OrbitalSectionHeader";

export type SectionShellProps = Readonly<{
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "default" | "compact" | "wide" | "split";
  className?: string;
  headerAction?: React.ReactNode;
}>;

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  variant = "default",
  className,
  headerAction,
}: SectionShellProps) {
  const headingId = title && id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={["internal-section", `internal-section-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={
          variant === "wide" ? "site-container-wide" : "site-container"
        }
      >
        {title ? (
          <Reveal className="internal-section-heading">
            <div className="internal-section-heading-main">
              <OrbitalSectionHeader
                eyebrow={eyebrow}
                title={title}
                description={description}
                id={headingId}
              />
            </div>
            {headerAction ? (
              <div className="internal-section-heading-action">{headerAction}</div>
            ) : null}
          </Reveal>
        ) : null}
        <Reveal delay={title ? 0.1 : 0} viewportAmount="some">
          {children}
        </Reveal>
      </div>
    </section>
  );
}
