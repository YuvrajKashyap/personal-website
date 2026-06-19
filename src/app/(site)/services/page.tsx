import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { FormShell } from "@/components/ui/FormShell";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ServicesPage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Services"
        title="Services"
        description="Scoped build requests for serious work will be framed here once the service content is ready."
        status="Template ready"
        meta={["Scoped work", "No intake form yet"]}
      />
      <SectionShell id="services-template-preview" variant="wide">
        <FormShell
          eyebrow="Future Intake"
          title="Service request shell"
          description="This wrapper is ready for a future form, but no submission flow exists in this step."
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
