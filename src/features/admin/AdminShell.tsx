import Link from "next/link";

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
          <Link className="admin-brand focus-ring" href="/" aria-label="Go to public site">
            <span>YK</span>
            <span>Admin</span>
          </Link>
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
