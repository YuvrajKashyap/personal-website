export type FormShellProps = Readonly<{
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}>;

export function FormShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: FormShellProps) {
  return (
    <section className={["form-shell", className].filter(Boolean).join(" ")}>
      <div className="form-shell-header">
        {eyebrow ? <p className="text-mono-label">{eyebrow}</p> : null}
        {title ? <h2 className="text-section-title text-balance">{title}</h2> : null}
        {description ? <p className="text-body-large text-pretty">{description}</p> : null}
      </div>
      <div className="form-shell-body">{children}</div>
      {footer ? <div className="form-shell-footer">{footer}</div> : null}
    </section>
  );
}
