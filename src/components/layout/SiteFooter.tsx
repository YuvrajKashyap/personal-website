import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const footerRoutes = siteConfig.navItems.filter(
    (item) => item.href !== "/" && item.href !== "/contact",
  );
  const githubLink = siteConfig.socialLinks.find(
    (link) => link.label === "GitHub",
  );

  return (
    <footer className="site-footer">
      <div className="site-container-wide grid gap-8 py-10 md:grid-cols-[1.2fr_2fr] md:items-start">
        <div className="stack-sm">
          <p className="text-card-title">Yuvraj Kashyap</p>
          <p className="text-caption">
            Software, systems, and current-state signal.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <nav aria-label="Footer navigation" className="cluster">
            {footerRoutes.map((item) => (
              <Link key={item.href} href={item.href} className="footer-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {githubLink ? (
              <a
                href={githubLink.href}
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
            ) : null}
            <Link href="/contact" className="footer-link">
              Contact
            </Link>
            <Link href="/admin/login" className="footer-admin-link">
              if you&apos;re me
            </Link>
          </div>
        </div>
      </div>

      <div className="site-container-wide border-t border-border py-5">
        <p className="text-caption">Built by Yuvraj Kashyap.</p>
      </div>
    </footer>
  );
}
