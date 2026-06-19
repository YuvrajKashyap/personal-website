export type StatusBadgeProps = Readonly<{
  children: React.ReactNode;
  tone?: "default" | "active" | "muted" | "warning" | "danger" | "success";
  className?: string;
}>;

export function StatusBadge({
  children,
  tone = "default",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={["status-badge", `status-badge-${tone}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
