import { siteConfig } from "@/config/site";

export type ContactChannel = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
  href: string;
  type: string;
  external: boolean;
  status: "verified" | "needs_review";
  actionLabel: string;
  order: number;
}>;

export type ContactRouteCard = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  external?: boolean;
  cta: string;
  order: number;
}>;

export type MessageBriefItem = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
  order: number;
}>;

export type ContactProofLink = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  order: number;
}>;

const githubLink = siteConfig.socialLinks.find(
  (link) => link.label === "GitHub",
);

export const contactHero = {
  eyebrow: "CONTACT",
  title: "Open a direct channel.",
  description:
    "For scoped build requests, broader collaborations, project context, or serious opportunities, send clear context through the verified channels below.",
  status: "Manual route",
  meta: [
    "Source / Manual",
    "Intake / Direct",
    "Scope / Services + Collaborate",
    "Next Step / Send Context",
  ],
} as const;

export const contactChannels = [
  ...(githubLink
    ? [
        {
          id: "github",
          label: "GitHub",
          title: "GitHub",
          body:
            "Verified public profile for project context, repository signal, and direct public identity.",
          href: githubLink.href,
          type: "Public profile",
          external: githubLink.external,
          status: "verified",
          actionLabel: "Open GitHub",
          order: 1,
        } as const,
      ]
    : []),
  {
    id: "website",
    label: "Website",
    title: siteConfig.domain,
    body:
      "Canonical public home for routes, project context, services, collaboration, and contact routing.",
    href: siteConfig.url,
    type: "Canonical site",
    external: true,
    status: "verified",
    actionLabel: "Open Website",
    order: 2,
  },
] as const satisfies readonly ContactChannel[];

export const contactRouteCards = [
  {
    id: "services-request",
    eyebrow: "Scoped Request",
    title: "Services Request",
    body:
      "Use this route when there is a product surface, workflow, prototype, or system with a clear build shape.",
    href: "/services",
    cta: "Open Services",
    order: 1,
  },
  {
    id: "collaborate",
    eyebrow: "Broader Alignment",
    title: "Collaborate",
    body:
      "Use this route when the opportunity is broader than a scoped request and needs context before shape.",
    href: "/collaborate",
    cta: "Open Collaborate",
    order: 2,
  },
  {
    id: "projects-context",
    eyebrow: "Proof Surface",
    title: "Projects Context",
    body:
      "Use this route when the message is tied to a project, case study, technical system, or proof surface.",
    href: "/projects",
    cta: "View Projects",
    order: 3,
  },
  {
    id: "direct-message",
    eyebrow: "Manual Channel",
    title: "Direct Message",
    body:
      "Use a verified public channel for serious context that does not fit the routes above.",
    href: githubLink?.href ?? siteConfig.url,
    external: true,
    cta: githubLink ? "Open GitHub" : "Open Website",
    order: 4,
  },
] as const satisfies readonly ContactRouteCard[];

export const messageBriefItems = [
  {
    id: "who-you-are",
    label: "01",
    title: "Who you are",
    body: "A short identity line, role, team, or public context is enough.",
    order: 1,
  },
  {
    id: "what-this-is-about",
    label: "02",
    title: "What this is about",
    body:
      "Name the project, request, system, opportunity, or question clearly.",
    order: 2,
  },
  {
    id: "why-it-might-fit",
    label: "03",
    title: "Why this might fit",
    body:
      "Explain the link between the context and the way Yuvraj builds or thinks.",
    order: 3,
  },
  {
    id: "scope-or-timing",
    label: "04",
    title: "Scope or timing",
    body:
      "Share useful constraints if they matter, without adding private details.",
    order: 4,
  },
  {
    id: "links-or-context",
    label: "05",
    title: "Links or context",
    body:
      "Include public references, project pages, repositories, docs, or notes when they clarify the message.",
    order: 5,
  },
  {
    id: "next-decision",
    label: "06",
    title: "The next decision",
    body:
      "Say what decision, route, or clarification would make the next move cleaner.",
    order: 6,
  },
] as const satisfies readonly MessageBriefItem[];

export const contactSourceNote = {
  eyebrow: "Manual Boundary",
  title: "Manual now, backend later.",
  body:
    "Contact is intentionally direct in this step. A future intake system can be added later, but there is no live backend flow here.",
  label: "Current route",
  value: "Verified channels",
  source: "No backend flow",
} as const;

export const contactProofLinks = [
  {
    id: "projects",
    eyebrow: "Build Archive",
    title: "Projects",
    body:
      "Review the systems, interfaces, and technical directions behind the public proof surface.",
    href: "/projects",
    cta: "View Projects",
    order: 1,
  },
  {
    id: "experience",
    eyebrow: "Trajectory",
    title: "Experience",
    body:
      "Open the structured route for education, leadership, technical work, discipline, and direction.",
    href: "/experience",
    cta: "Open Experience",
    order: 2,
  },
  {
    id: "about",
    eyebrow: "Context",
    title: "About",
    body:
      "Read the background and operating layer behind how Yuvraj thinks and builds.",
    href: "/about",
    cta: "Read About",
    order: 3,
  },
  {
    id: "services",
    eyebrow: "Scoped Work",
    title: "Services",
    body:
      "Use this route when the message is a clear product surface, workflow, prototype, or system request.",
    href: "/services",
    cta: "See Services",
    order: 4,
  },
  {
    id: "collaborate",
    eyebrow: "Alignment",
    title: "Collaborate",
    body:
      "Use this route when the fit is broader than a single scoped request.",
    href: "/collaborate",
    cta: "Open Collaborate",
    order: 5,
  },
] as const satisfies readonly ContactProofLink[];

export const contactClosingCta = {
  eyebrow: "Route First",
  title: "Choose the route that matches the context.",
  body:
    "Start with Services for scoped requests, Collaborate for broader alignment, or Projects if the proof surface should come first.",
  primary: {
    label: "Start with Services",
    href: "/services",
  },
  secondary: {
    label: "Explore Collaborate",
    href: "/collaborate",
  },
} as const;
