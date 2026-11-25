import { SpacetimeField } from "@/components/effects/SpacetimeField";

export function PageBackdrop() {
  return (
    <div className="page-backdrop" aria-hidden="true">
      <div className="page-backdrop-gradient" />
      <SpacetimeField variant="hero" />
    </div>
  );
}
