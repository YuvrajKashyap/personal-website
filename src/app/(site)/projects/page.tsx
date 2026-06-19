import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProjectsPage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Projects"
        title="Projects"
        description="Build archive, flagship systems, experiments, and shipped surfaces will be organized here."
        status="Template ready"
        meta={["Archive", "Systems", "Proof of work"]}
      />
      <SectionShell
        id="projects-template-preview"
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
          description="The project page remains a premium placeholder until real project entries are authored."
        />
      </SectionShell>
    </main>
  );
}
