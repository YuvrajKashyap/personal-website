import Link from "next/link";

import { SiteNavigation } from "@/components/layout/SiteNavigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="site-header-inner site-container-wide">
        <Link
          href="/"
          aria-label="Yuvraj Kashyap home"
          className="brand-mark focus-ring"
        >
          <span className="font-telemetry text-sm font-bold tracking-[0.24em]">
            YK
          </span>
          <span className="hidden text-sm font-semibold sm:inline">
            Yuvraj Kashyap
          </span>
        </Link>
        <SiteNavigation />
      </div>
    </header>
  );
}
