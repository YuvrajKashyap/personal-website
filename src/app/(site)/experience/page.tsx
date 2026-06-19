import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ExperiencePage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Experience"
        title="Experience"
        description="Roles, leadership, technical growth, and professional direction will be organized here."
        status="Template ready"
        meta={["Roles", "Leadership", "Growth"]}
      />
      <SectionShell
        id="experience-template-preview"
        eyebrow="Structure"
        title="A future timeline without resume clutter"
        description="The final page can use these primitives for context, impact, and progression without becoming a generic resume template."
      >
        <div className="responsive-grid">
          <CosmicCard
            eyebrow="Role Layer"
            title="Responsibilities"
            description="A future section for real roles, responsibilities, and scope."
          />
          <CosmicCard
            eyebrow="Signal Layer"
            title="Leadership"
            description="A future section for collaboration, ownership, and decision-making patterns."
          />
          <CosmicCard
            eyebrow="Trajectory Layer"
            title="Direction"
            description="A future section for where the work is pointing next."
          />
        </div>
      </SectionShell>
      <SectionShell variant="compact">
        <EmptyState
          eyebrow="Content Boundary"
          title="Full experience content is not published yet."
          description="This is a page template scaffold, not a completed experience archive."
        />
      </SectionShell>
    </main>
  );
}
