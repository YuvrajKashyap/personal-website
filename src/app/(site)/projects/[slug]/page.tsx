import { DetailLayout } from "@/components/layout/DetailLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Project Detail"
        title="Project Detail"
        description={`A future project case study route for ${slug}.`}
        status="Template ready"
        meta={["Case study route", "No data fetch yet"]}
        variant="detail"
      />
      <SectionShell id="project-detail-template" variant="wide">
        <DetailLayout
          header={
            <div className="stack-sm">
              <StatusBadge tone="muted">Placeholder route</StatusBadge>
              <h2 className="text-section-title text-balance">Case study shell</h2>
              <p className="text-body-large">
                This layout is ready for future project content, but no project
                data is fetched or invented in this step.
              </p>
            </div>
          }
          aside={
            <EmptyState
              eyebrow="Future Aside"
              title="Metadata will live here."
              description="Stack, status, links, and source details can appear after real project data exists."
            />
          }
        >
          <EmptyState
            eyebrow="Content Boundary"
            title="No project details are published yet."
            description="The slug is displayed safely while the final project system waits for real content."
            action={{ label: "Back to Projects", href: "/projects" }}
          />
        </DetailLayout>
      </SectionShell>
    </main>
  );
}
