import Link from "next/link";

export type LinkButtonProps = Readonly<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "quiet";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  className?: string;
}>;

function linkButtonClassName({
  variant,
  size,
  className,
}: Pick<LinkButtonProps, "variant" | "size" | "className">) {
  return [
    "link-button focus-ring",
    `link-button-${variant ?? "primary"}`,
    `link-button-${size ?? "md"}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className,
}: LinkButtonProps) {
  const classes = linkButtonClassName({ variant, size, className });

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
