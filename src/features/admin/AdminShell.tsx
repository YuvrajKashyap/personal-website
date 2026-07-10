import Link from "next/link";

import { SiteEmblemLink } from "@/components/layout/SiteEmblemLink";

export function AdminShell({
  eyebrow,
  title,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <main className="admin-shell">
      <div className="admin-shell-backdrop" aria-hidden="true" />
      <div className="admin-shell-inner">
        <header className="admin-shell-header">
          <SiteEmblemLink
            ariaLabel="Go to public site"
            className="admin-emblem-link focus-ring"
          />
          <Link className="admin-quiet-link focus-ring" href="/">
            Public site
          </Link>
        </header>
        <section className="admin-panel">
          <p className="text-mono-label text-accent">{eyebrow}</p>
          <h1 className="text-page-title">{title}</h1>
          {children}
        </section>
      </div>
    </main>
  );
}
