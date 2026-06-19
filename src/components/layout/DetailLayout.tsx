export type DetailLayoutProps = Readonly<{
  children: React.ReactNode;
  aside?: React.ReactNode;
  header?: React.ReactNode;
  variant?: "default" | "compact";
  className?: string;
}>;

export function DetailLayout({
  children,
  aside,
  header,
  variant = "default",
  className,
}: DetailLayoutProps) {
  return (
    <article
      className={["detail-layout", `detail-layout-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      {header ? <header className="detail-layout-header">{header}</header> : null}
      <div className="detail-layout-grid">
        <div className="detail-layout-main">{children}</div>
        {aside ? <aside className="detail-layout-aside">{aside}</aside> : null}
      </div>
    </article>
  );
}
