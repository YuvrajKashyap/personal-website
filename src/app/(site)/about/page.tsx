import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AboutPage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="About"
        title="About"
        description="Life story, background, principles, and trajectory will live here in a structured internal page."
        status="Template ready"
        meta={["Origin", "Trajectory", "Principles"]}
      />
      <SectionShell
        id="about-template-preview"
        eyebrow="Future Structure"
        title="Built for a sharper biography"
        description="This page is intentionally held as a premium scaffold until the full About content is written."
      >
        <div className="responsive-grid">
          <CosmicCard
            eyebrow="01"
            title="Origin"
            description="A future section for place, family, early interests, and the beginning of the builder path."
          />
          <CosmicCard
            eyebrow="02"
            title="Trajectory"
            description="A future section for education, work rhythm, creative growth, and technical direction."
          />
          <CosmicCard
            eyebrow="03"
            title="Principles"
            description="A future section for the operating beliefs behind the work and the systems being built."
          />
        </div>
      </SectionShell>
      <SectionShell variant="compact">
        <EmptyState
          eyebrow="Content Boundary"
          title="Full About narrative comes later."
          description="Step 19 only establishes the internal page system. It does not publish a full biography."
        />
      </SectionShell>
    </main>
  );
}
