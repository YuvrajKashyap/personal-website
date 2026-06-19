import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { FormShell } from "@/components/ui/FormShell";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function CollaboratePage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Collaborate"
        title="Collaborate"
        description="Aligned opportunities with founders, builders, creators, startups, and serious people will be directed here."
        status="Template ready"
        meta={["Opportunities", "No intake form yet"]}
      />
      <SectionShell id="collaborate-template-preview" variant="wide">
        <FormShell
          eyebrow="Future Intake"
          title="Collaboration shell"
          description="This wrapper reserves space for future collaboration routing without pretending a form exists."
          footer={
            <span>
              <StatusBadge tone="muted">No submission</StatusBadge>
            </span>
          }
        >
          <div className="form-shell-placeholder" aria-hidden="true">
            <div className="form-shell-placeholder-row" />
            <div className="form-shell-placeholder-row" />
            <div className="form-shell-placeholder-row" />
          </div>
        </FormShell>
      </SectionShell>
    </main>
  );
}
