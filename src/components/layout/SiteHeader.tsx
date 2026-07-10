import { SiteEmblemLink } from "@/components/layout/SiteEmblemLink";
import { SiteNavigation } from "@/components/layout/SiteNavigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="site-header-inner site-container-wide">
        <SiteEmblemLink />
        <SiteNavigation />
      </div>
    </header>
  );
}
