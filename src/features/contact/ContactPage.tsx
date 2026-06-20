import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { CosmicCard } from "@/components/ui/CosmicCard";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import {
  contactChannels,
  contactClosingCta,
  contactHero,
  contactProofLinks,
  contactRouteCards,
  contactSourceNote,
  messageBriefItems,
  type ContactChannel,
  type ContactRouteCard,
} from "@/features/contact/contact-content";

function ContactHeroPanel() {
  return (
    <div className="contact-hero-panel">
      <p className="text-mono-label">Channel Console</p>
      <div className="contact-hero-ledger" aria-label="Contact route summary">
        <div>
          <span>Channel</span>
          <strong>Verified public</strong>
        </div>
        <div>
          <span>Mode</span>
          <strong>Manual</strong>
        </div>
        <div>
          <span>Routing</span>
          <strong>Context first</strong>
        </div>
      </div>
      <p className="text-caption">
        A clear contact surface for serious context without pretending a backend
        flow exists.
      </p>
    </div>
  );
}

function ContactChannelCard({
  channel,
}: Readonly<{
  channel: ContactChannel;
}>) {
  return (
    <a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noreferrer" : undefined}
      className="contact-channel-card focus-ring"
    >
      <div className="contact-channel-card-header">
        <p className="text-mono-label">{channel.label}</p>
        <StatusBadge tone="active">Verified</StatusBadge>
      </div>
      <div className="stack-xs">
        <h3 className="text-card-title">{channel.title}</h3>
        <p className="text-body">{channel.body}</p>
      </div>
      <div className="contact-channel-meta">
        <span>{channel.type}</span>
        <span>{channel.actionLabel}</span>
      </div>
    </a>
  );
}

function ContactChannelsSection() {
  const verifiedChannels = contactChannels.filter(
    (channel) => channel.status === "verified",
  );

  return (
    <SectionShell
      id="contact-channels"
      variant="wide"
      eyebrow="Verified Channels"
      title="Use the public channels that are actually verified."
      description="Only channels already present in the project configuration are shown here."
    >
      <div className="contact-channel-grid">
        {verifiedChannels.map((channel, index) => (
          <Reveal key={channel.id} delay={index * 0.06} variant="scale-soft">
            <ContactChannelCard channel={channel} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ContactRouteCard({
  route,
}: Readonly<{
  route: ContactRouteCard;
}>) {
  if (route.external) {
    return (
      <a
        href={route.href}
        target="_blank"
        rel="noreferrer"
        className="cosmic-card cosmic-card-default contact-route-card focus-ring"
      >
        <p className="text-mono-label">{route.eyebrow}</p>
        <h3 className="text-card-title">{route.title}</h3>
        <p className="text-body">{route.body}</p>
        <span className="cosmic-card-action">{route.cta}</span>
      </a>
    );
  }

  return (
    <CosmicCard
      eyebrow={route.eyebrow}
      title={route.title}
      description={route.body}
      href={route.href}
      actionLabel={route.cta}
      variant={route.id === "services-request" ? "featured" : "default"}
      className="contact-route-card"
    />
  );
}

function RouteGuidanceSection() {
  return (
    <SectionShell
      id="contact-routing"
      variant="wide"
      eyebrow="Route The Message"
      title="Choose the clearest path before reaching out."
      description="The right route makes the first message sharper and keeps Services, Collaborate, Projects, and direct context distinct."
    >
      <div className="contact-route-grid">
        {contactRouteCards.map((route, index) => (
          <Reveal key={route.id} delay={index * 0.06} variant="scale-soft">
            <ContactRouteCard route={route} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function MessageBriefSection() {
  return (
    <SectionShell
      id="message-brief"
      variant="wide"
      eyebrow="Message Brief"
      title="Send the context that makes the signal clear."
      description="A strong first message is short, specific, and grounded in why this route fits."
    >
      <div className="contact-message-brief">
        <div className="stack-sm">
          <p className="text-kicker">What To Include</p>
          <h3 className="text-section-title text-balance">
            Make the first pass useful.
          </h3>
          <p className="text-body-large text-pretty">
            Do not include private details. Keep the message focused on public
            context, the request, and the next decision.
          </p>
        </div>
        <ol className="contact-brief-list">
          {messageBriefItems.map((item) => (
            <li key={item.id}>
              <span>{item.label}</span>
              <div className="stack-xs">
                <h4 className="text-card-title">{item.title}</h4>
                <p className="text-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}

function ManualBoundarySection() {
  return (
    <SectionShell
      id="contact-boundary"
      variant="compact"
      headerAction={<StatusBadge tone="muted">No backend flow</StatusBadge>}
      eyebrow={contactSourceNote.eyebrow}
      title={contactSourceNote.title}
      description={contactSourceNote.body}
    >
      <div className="contact-source-note">
        <TelemetryCard
          label={contactSourceNote.label}
          value={contactSourceNote.value}
          description="Use the verified channels and route guidance on this page. A future intake system can reuse this content model without changing the public boundary."
          source={contactSourceNote.source}
          tone="active"
        />
      </div>
    </SectionShell>
  );
}

function ProofSection() {
  return (
    <SectionShell
      id="contact-proof"
      variant="wide"
      eyebrow="Proof and Context"
      title="Review the public context before sending the message."
      description="These routes help clarify whether the message belongs in Services, Collaborate, Projects, or a direct channel."
    >
      <div className="contact-proof-grid">
        {contactProofLinks.map((link, index) => (
          <Reveal key={link.id} delay={index * 0.06} variant="scale-soft">
            <CosmicCard
              eyebrow={link.eyebrow}
              title={link.title}
              description={link.body}
              href={link.href}
              actionLabel={link.cta}
              variant={index === 0 ? "featured" : "default"}
            />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function ClosingCta() {
  return (
    <SectionShell id="contact-next" variant="compact">
      <Reveal className="contact-cta" variant="scale-soft">
        <div className="stack-sm">
          <p className="text-kicker">{contactClosingCta.eyebrow}</p>
          <h2 className="text-section-title text-balance">
            {contactClosingCta.title}
          </h2>
          <p className="text-body-large text-pretty">
            {contactClosingCta.body}
          </p>
        </div>
        <div className="cluster">
          <LinkButton href={contactClosingCta.primary.href}>
            {contactClosingCta.primary.label}
          </LinkButton>
          <LinkButton href={contactClosingCta.secondary.href} variant="secondary">
            {contactClosingCta.secondary.label}
          </LinkButton>
        </div>
      </Reveal>
    </SectionShell>
  );
}

export function ContactPage() {
  return (
    <main className="internal-page contact-page">
      <PageHero
        eyebrow={contactHero.eyebrow}
        title={contactHero.title}
        description={contactHero.description}
        status={contactHero.status}
        meta={[...contactHero.meta]}
        primaryAction={{
          label: contactChannels[0]?.actionLabel ?? "View Projects",
          href: contactChannels[0]?.href ?? "/projects",
          external: contactChannels[0]?.external,
        }}
        secondaryAction={{ label: "View Projects", href: "/projects" }}
      >
        <ContactHeroPanel />
      </PageHero>

      <ContactChannelsSection />
      <RouteGuidanceSection />
      <MessageBriefSection />
      <ManualBoundarySection />
      <ProofSection />
      <ClosingCta />
    </main>
  );
}
