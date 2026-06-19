import { Reveal } from "@/components/motion/Reveal";
import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";

type PageHeroAction = Readonly<{
  label: string;
  href: string;
  external?: boolean;
}>;

export type PageHeroProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: PageHeroAction;
  secondaryAction?: PageHeroAction;
  meta?: string[];
  status?: string;
  variant?: "default" | "compact" | "detail";
  align?: "start" | "center";
  children?: React.ReactNode;
}>;

export function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  meta = [],
  status,
  variant = "default",
  align = "start",
  children,
}: PageHeroProps) {
  return (
    <section className={`page-hero page-hero-${variant} page-hero-${align}`}>
      <PageBackdrop />
      <div className="site-container-wide page-hero-inner">
        <div className="page-hero-copy">
          <Reveal>
            <p className="text-kicker">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06} variant="blur-in">
            <h1 className="text-page-title text-balance">{title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-body-large text-pretty">{description}</p>
          </Reveal>
          {meta.length > 0 || status ? (
            <Reveal className="page-hero-meta cluster" delay={0.18} variant="chip">
              {status ? <StatusBadge tone="active">{status}</StatusBadge> : null}
              {meta.map((item) => (
                <StatusBadge key={item} tone="muted">
                  {item}
                </StatusBadge>
              ))}
            </Reveal>
          ) : null}
          {primaryAction || secondaryAction ? (
            <Reveal className="cluster" delay={0.24} variant="cta">
              {primaryAction ? (
                <LinkButton href={primaryAction.href} external={primaryAction.external}>
                  {primaryAction.label}
                </LinkButton>
              ) : null}
              {secondaryAction ? (
                <LinkButton
                  href={secondaryAction.href}
                  external={secondaryAction.external}
                  variant="secondary"
                >
                  {secondaryAction.label}
                </LinkButton>
              ) : null}
            </Reveal>
          ) : null}
        </div>
        {children ? (
          <Reveal className="page-hero-aside" delay={0.16} variant="scale-soft">
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
