import { LinkButton } from "@/components/ui/LinkButton";

export type EmptyStateAction = Readonly<{
  label: string;
  href: string;
}>;

export type EmptyStateProps = Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}>;

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={["empty-state", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="text-mono-label">{eyebrow}</p> : null}
      <h2 className="text-section-title text-balance">{title}</h2>
      {description ? <p className="text-body-large text-pretty">{description}</p> : null}
      {action ? (
        <LinkButton href={action.href} variant="secondary">
          {action.label}
        </LinkButton>
      ) : null}
    </div>
  );
}
