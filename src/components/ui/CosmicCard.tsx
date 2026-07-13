"use client";

import Link from "next/link";

import { useSpotlight } from "@/lib/motion/useSpotlight";

export type CosmicCardProps = Readonly<{
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  href?: string;
  actionLabel?: string;
  variant?: "default" | "featured" | "quiet";
  className?: string;
}>;

function CosmicCardContent({
  eyebrow,
  title,
  description,
  children,
  actionLabel,
}: Omit<CosmicCardProps, "href" | "variant" | "className">) {
  return (
    <>
      {eyebrow ? <p className="text-mono-label">{eyebrow}</p> : null}
      {title ? <h3 className="text-card-title">{title}</h3> : null}
      {description ? <p className="text-body">{description}</p> : null}
      {children ? <div className="cosmic-card-content">{children}</div> : null}
      {actionLabel ? <span className="cosmic-card-action">{actionLabel}</span> : null}
    </>
  );
}

export function CosmicCard({
  eyebrow,
  title,
  description,
  children,
  href,
  actionLabel,
  variant = "default",
  className,
}: CosmicCardProps) {
  const classes = ["cosmic-card", `cosmic-card-${variant}`, className]
    .filter(Boolean)
    .join(" ");
  const spotlight = useSpotlight();

  if (href) {
    return (
      <Link
        href={href}
        className={`${classes} focus-ring`}
        onPointerMove={spotlight.onPointerMove}
        onPointerLeave={spotlight.onPointerLeave}
      >
        <CosmicCardContent
          eyebrow={eyebrow}
          title={title}
          description={description}
          actionLabel={actionLabel}
        >
          {children}
        </CosmicCardContent>
      </Link>
    );
  }

  return (
    <article
      className={classes}
      onPointerMove={spotlight.onPointerMove}
      onPointerLeave={spotlight.onPointerLeave}
    >
      <CosmicCardContent
        eyebrow={eyebrow}
        title={title}
        description={description}
        actionLabel={actionLabel}
      >
        {children}
      </CosmicCardContent>
    </article>
  );
}
