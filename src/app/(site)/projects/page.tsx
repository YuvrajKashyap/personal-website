import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import {
  getFeaturedProjects,
  getPublishedProjects,
  getRandomizerPool,
} from "@/lib/projects";

export default function ProjectsPage() {
  const publishedProjects = getPublishedProjects();
  const featuredProjects = getFeaturedProjects();
  const randomizerPool = getRandomizerPool();

  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Projects"
        title="Projects"
        description="Build archive, flagship systems, experiments, and shipped surfaces are now backed by a typed local project model."
        status="Local model ready"
        meta={["Archive", "Systems", "Proof of work"]}
      />
      <SectionShell
        id="projects-template-preview"
        eyebrow="Project Data Model"
        title="A safe foundation for future case studies"
        description="The route now reads real local project metadata without publishing incomplete links, fake media, or invented outcomes."
      >
        <div className="responsive-grid">
          <TelemetryCard
            label="Published entries"
            value={String(publishedProjects.length)}
            description="Project records marked for public visibility."
            source="Local data"
            tone="active"
          />
          <TelemetryCard
            label="Featured preview"
            value={String(featuredProjects.length)}
            description="Entries available for the Home gateway and future project surfaces."
            source="Local data"
          />
          <TelemetryCard
            label="Randomizer pool"
            value={String(randomizerPool.length)}
            description="Eligible entries for a future project discovery interaction."
            source="Local data"
          />
        </div>
      </SectionShell>
      <SectionShell
        id="projects-future-surfaces"
        eyebrow="Archive Framework"
        title="Built for future case studies"
        description="This page is prepared for a real project system without publishing incomplete claims or fake links."
      >
        <div className="responsive-grid">
          <CosmicCard
            eyebrow="Index"
            title="Project grid"
            description="A future grid for selected builds once the real project content is ready."
          />
          <CosmicCard
            eyebrow="Case Studies"
            title="Detail routes"
            description="A future route pattern for deeper technical writeups and product context."
          />
          <CosmicCard
            eyebrow="Proof"
            title="Evidence first"
            description="A future content model for real links, outcomes, and artifacts only."
          />
        </div>
      </SectionShell>
      <SectionShell variant="compact">
        <EmptyState
          eyebrow="Content Boundary"
          title="Full project archive comes later."
          description="The data model exists now. The full project grid, filters, randomizer, and case study UI remain future work."
        />
      </SectionShell>
    </main>
  );
}
