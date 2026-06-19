import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { FormShell } from "@/components/ui/FormShell";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ContactPage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Get in Touch"
        title="Get in Touch"
        description="Direct ways to reach out will live here once the final contact path is ready."
        status="Template ready"
        meta={["Contact", "No form submission yet"]}
      />
      <SectionShell id="contact-template-preview" variant="wide">
        <FormShell
          eyebrow="Future Channel"
          title="Contact shell"
          description="This wrapper prepares the contact page without adding a fake email flow or backend."
          footer={
            <span>
              <StatusBadge tone="muted">No submission</StatusBadge>
            </span>
          }
        >
          <div className="stack-md">
            <div className="form-shell-placeholder" aria-hidden="true">
              <div className="form-shell-placeholder-row" />
              <div className="form-shell-placeholder-row" />
              <div className="form-shell-placeholder-row" />
            </div>
            <LinkButton href="https://github.com/YuvrajKashyap" external variant="secondary">
              View GitHub
            </LinkButton>
          </div>
        </FormShell>
      </SectionShell>
    </main>
  );
}
