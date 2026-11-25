import Link from "next/link";

import { Magnetic } from "@/components/motion/Magnetic";

export type LinkButtonProps = Readonly<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "quiet";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  /** Leans toward the cursor before it arrives. For standalone CTAs. */
  magnetic?: boolean;
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
  magnetic = false,
  className,
}: LinkButtonProps) {
  const classes = linkButtonClassName({ variant, size, className });

  const link = external ? (
    <a href={href} className={classes} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );

  if (!magnetic) {
    return link;
  }

  return (
    <Magnetic className="magnetic-inline" strength={0.28} radius={96}>
      {link}
    </Magnetic>
  );
}
