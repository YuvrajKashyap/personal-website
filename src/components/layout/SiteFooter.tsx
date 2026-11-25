import { SpacetimeField } from "@/components/effects/SpacetimeField";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-horizon" aria-hidden="true">
        <SpacetimeField variant="well" />
      </div>
      <p className="site-footer-line">developed by yuvraj kashyap</p>
    </footer>
  );
}
