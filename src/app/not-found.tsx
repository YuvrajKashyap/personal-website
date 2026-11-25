import type { Metadata } from "next";

import { SpacetimeField } from "@/components/effects/SpacetimeField";
import { WarpTransit } from "@/components/effects/WarpTransit";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { SiteCursor } from "@/components/motion/SiteCursor";
import { WordReveal } from "@/components/motion/WordReveal";
import { LinkButton } from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Unmatched routes resolve here, outside the `(site)` group, so this page
 * brings the public shell with it. The whole viewport is one gravity well.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="lost-page">
        <SpacetimeField variant="abyss" />
        <div className="lost-copy site-container">
          <Reveal>
            <p className="text-kicker">Error 404</p>
          </Reveal>
          <h1 className="text-page-title text-balance">
            <WordReveal text="Past the event horizon." delay={0.1} />
          </h1>
          <Reveal delay={0.3}>
            <p className="text-body-large text-pretty">
              Nothing at this address made it back out. Set a course for
              somewhere that exists.
            </p>
          </Reveal>
          <Reveal className="cluster" delay={0.4} variant="cta">
            <LinkButton href="/" magnetic>Return home</LinkButton>
            <LinkButton href="/#home-projects-preview" variant="secondary" magnetic>
              Browse projects
            </LinkButton>
          </Reveal>
        </div>
      </main>
      <WarpTransit />
      <SiteCursor />
    </div>
  );
}
