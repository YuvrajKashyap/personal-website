import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import {
  contactChannels,
  contactHero,
  messageGuidance,
} from "@/features/contact/contact-content";
import { SubmissionForm } from "@/features/submissions/SubmissionForm";
import { isSubmissionBackendConfigured } from "@/lib/submissions/config";

function ContactChannels() {
  return (
    <div className="contact-channel-list">
      <p className="text-mono-label">Elsewhere</p>
      <ul aria-label="Public channels">
        {contactChannels.map((channel) => (
          <li key={channel.id}>
            <a
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noreferrer" : undefined}
              className="contact-channel-row focus-ring"
            >
              <span className="contact-channel-label">{channel.label}</span>
              <span className="contact-channel-detail">{channel.detail}</span>
              <span aria-hidden="true" className="contact-channel-arrow">
                &#8599;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageGuidance() {
  return (
    <div className="contact-guidance">
      <p className="text-mono-label">A useful first message covers</p>
      <ul aria-label="What to include in a message">
        {messageGuidance.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ContactPage() {
  const backendEnabled = isSubmissionBackendConfigured();

  return (
    <main className="internal-page contact-page">
      <PageHero
        eyebrow={contactHero.eyebrow}
        title={contactHero.title}
        description={contactHero.description}
        variant="compact"
      />

      <section id="contact-main" className="contact-main site-container-wide">
        <Reveal className="contact-form-column" variant="fade-up">
          <SubmissionForm
            submissionType="contact"
            backendEnabled={backendEnabled}
            sourcePath="/contact"
            title="Send a message"
            description="Short and specific beats long and vague. No private details needed."
          />
        </Reveal>
        <div className="contact-side-column">
          <Reveal delay={0.08} variant="fade-up">
            <ContactChannels />
          </Reveal>
          <Reveal delay={0.16} variant="fade-up">
            <MessageGuidance />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
