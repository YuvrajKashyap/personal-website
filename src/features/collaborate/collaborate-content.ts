export type CollaborationLane = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: readonly string[];
  status: string;
  order: number;
}>;

export type CollaborationFitItem = Readonly<{
  id: string;
  title: string;
  body: string;
  order: number;
}>;

export type AlignmentPrinciple = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
  order: number;
}>;

export type CollaborationProcessStep = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
  order: number;
}>;

export type CollaborationProofLink = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  order: number;
}>;

export type CollaborationComparisonItem = Readonly<{
  id: "services" | "collaborate";
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}>;

export const collaborateHero = {
  eyebrow: "COLLABORATE",
  title: "Aligned work with serious builders.",
  description:
    "For broader opportunities with founders, builders, creators, startups, and technical teams where the fit is bigger than a single scoped request.",
  status: "Alignment route",
  meta: [
    "Mode / Alignment",
    "Scope / Broader Opportunities",
    "Signal / Serious Context",
    "Next Step / Contact",
  ],
} as const;

export const collaborateDefinition = {
  eyebrow: "Definition",
  title: "Collaborate means broader alignment.",
  body:
    "This page is for opportunities where the shape may be product, software, technical, creative, research-oriented, or startup-adjacent, but the useful first step is deciding whether there is real alignment.",
  secondary:
    "If the request already has a defined deliverable, Services is the cleaner route. Collaborate is for serious context that needs conversation before it becomes a narrow build path.",
  signals: [
    "Broader context",
    "Serious intent",
    "Mutual signal",
    "Contact first",
  ],
} as const;

export const collaborationLanes = [
  {
    id: "founder-startup-conversations",
    eyebrow: "Founder / Startup",
    title: "Founder and Startup Conversations",
    body:
      "Product, technical, and operating conversations with people building serious things and thinking beyond a single page or feature.",
    tags: ["Product", "Systems", "Operator Context"],
    status: "Conversation",
    order: 1,
  },
  {
    id: "technical-product-opportunities",
    eyebrow: "Technical Product",
    title: "Technical Product Opportunities",
    body:
      "AI, search, data, web products, interfaces, or systems where my project background and product taste are relevant.",
    tags: ["AI", "Search", "Data", "Interfaces"],
    status: "Technical",
    order: 2,
  },
  {
    id: "creator-distribution-experiments",
    eyebrow: "Creative Systems",
    title: "Creator and Distribution Experiments",
    body:
      "Software, storytelling, content systems, or audience-building experiments with real execution behind them.",
    tags: ["Software", "Storytelling", "Distribution"],
    status: "Experiment",
    order: 3,
  },
  {
    id: "research-technical-groups",
    eyebrow: "Research / Technical",
    title: "Research and Technical Groups",
    body:
      "Projects or teams around systems, autonomy, AI, search, data, or technical exploration where the work has substance.",
    tags: ["Research", "Autonomy", "Systems"],
    status: "Technical group",
    order: 4,
  },
  {
    id: "long-term-aligned-work",
    eyebrow: "Long Arc",
    title: "Long-Term Aligned Work",
    body:
      "Opportunities where the right fit, standards, and direction matter more than a narrow immediate deliverable.",
    tags: ["Long-Term", "Alignment", "Direction"],
    status: "Fit first",
    order: 5,
  },
] as const satisfies readonly CollaborationLane[];

export const collaborationFitItems = [
  {
    id: "clear-context",
    title: "Clear context",
    body:
      "The opportunity explains what exists, what is changing, who is involved, and why the conversation matters.",
    order: 1,
  },
  {
    id: "serious-builder",
    title: "Serious builder",
    body:
      "The person or team has real direction, ownership, and willingness to move with clarity.",
    order: 2,
  },
  {
    id: "meaningful-surface",
    title: "Meaningful surface",
    body:
      "There is a technical, product, creative, or strategic surface with enough substance to explore.",
    order: 3,
  },
  {
    id: "honest-constraints",
    title: "Honest constraints",
    body:
      "The ask is direct about limits, unknowns, incentives, and what still needs to be figured out.",
    order: 4,
  },
] as const satisfies readonly CollaborationFitItem[];

export const collaborationNotFitItems = [
  {
    id: "vague-networking",
    title: "Vague networking",
    body:
      "A generic connect message without context, direction, or a useful reason to talk is not a strong fit.",
    order: 1,
  },
  {
    id: "spammy-pitches",
    title: "Spammy pitches",
    body:
      "Mass outreach, unclear incentives, and copy-paste asks should use another path.",
    order: 2,
  },
  {
    id: "scoped-build-asks",
    title: "Scoped build asks",
    body:
      "If the request is really a defined surface or workflow to build, Services is the clearer route.",
    order: 3,
  },
  {
    id: "large-team-needs",
    title: "Large-team needs",
    body:
      "Requests that immediately need a dedicated multi-role organization should be routed elsewhere.",
    order: 4,
  },
] as const satisfies readonly CollaborationFitItem[];

export const alignmentPrinciples = [
  {
    id: "build-first",
    label: "01",
    title: "Build first",
    body:
      "The strongest conversations point toward making something real, sharper, or more useful.",
    order: 1,
  },
  {
    id: "clear-context",
    label: "02",
    title: "Clear context",
    body:
      "Good alignment starts with the actual situation, not vague energy or inflated language.",
    order: 2,
  },
  {
    id: "high-agency",
    label: "03",
    title: "High agency",
    body:
      "The people worth hearing from take ownership, decide clearly, and respect momentum.",
    order: 3,
  },
  {
    id: "taste-matters",
    label: "04",
    title: "Taste matters",
    body:
      "The work should care about quality, craft, and how a system feels when someone uses it.",
    order: 4,
  },
  {
    id: "long-term-signal",
    label: "05",
    title: "Long-term signal",
    body:
      "The best opportunities compound skill, proof, relationships, and direction over time.",
    order: 5,
  },
  {
    id: "honest-scope",
    label: "06",
    title: "Honest scope",
    body:
      "The first useful move is naming what is real, what is unknown, and what should happen next.",
    order: 6,
  },
] as const satisfies readonly AlignmentPrinciple[];

export const collaborateProcessSteps = [
  {
    id: "send-context",
    label: "01",
    title: "Send context",
    body:
      "Use Contact to explain who you are, what you are building, and why the conversation may fit.",
    order: 1,
  },
  {
    id: "explain-fit",
    label: "02",
    title: "Explain the possible fit",
    body:
      "Share the technical, product, creative, or strategic surface that makes this worth exploring.",
    order: 2,
  },
  {
    id: "share-constraint",
    label: "03",
    title: "Share the opportunity or constraint",
    body:
      "Useful outreach is honest about what exists, what is missing, and what decision needs to happen.",
    order: 3,
  },
  {
    id: "choose-route",
    label: "04",
    title: "Choose the right route",
    body:
      "The next move may be Contact, Services, Projects, or a clean no if the shape is not right.",
    order: 4,
  },
] as const satisfies readonly CollaborationProcessStep[];

export const collaborateProofLinks = [
  {
    id: "projects",
    eyebrow: "Proof Surface",
    title: "Projects",
    body:
      "The archive shows the systems, interfaces, and product directions behind the public signal.",
    href: "/projects",
    cta: "View Projects",
    order: 1,
  },
  {
    id: "experience",
    eyebrow: "Trajectory",
    title: "Experience",
    body:
      "The structured proof route for education, leadership, technical work, discipline, and current direction.",
    href: "/experience",
    cta: "Open Experience",
    order: 2,
  },
  {
    id: "about",
    eyebrow: "Human Context",
    title: "About",
    body:
      "The background and discipline layer behind how I think, build, and keep standards visible.",
    href: "/about",
    cta: "Read About",
    order: 3,
  },
  {
    id: "services",
    eyebrow: "Scoped Execution",
    title: "Services",
    body:
      "Use this route when the opportunity is really a clear product surface, workflow, or prototype to build.",
    href: "/services",
    cta: "See Services",
    order: 4,
  },
  {
    id: "aletheia",
    eyebrow: "AI / Search",
    title: "Aletheia",
    body:
      "A retrieval, ranking, evaluation, and search observability system direction.",
    href: "/projects/aletheia",
    cta: "Open Aletheia",
    order: 5,
  },
  {
    id: "atlas",
    eyebrow: "Data Infrastructure",
    title: "Atlas",
    body:
      "A crawl, extract, index, and search platform direction for public web content.",
    href: "/projects/atlas",
    cta: "Open Atlas",
    order: 6,
  },
] as const satisfies readonly CollaborationProofLink[];

export const servicesVsCollaborate = [
  {
    id: "services",
    label: "Services",
    title: "Scoped build request",
    body:
      "A defined deliverable, workflow, prototype, or product surface that needs practical execution.",
    href: "/services",
    cta: "See Services",
  },
  {
    id: "collaborate",
    label: "Collaborate",
    title: "Broader aligned opportunity",
    body:
      "A serious conversation where the shape, timing, or long-term direction needs to be explored first.",
    href: "/collaborate",
    cta: "You are here",
  },
] as const satisfies readonly CollaborationComparisonItem[];

export const collaborateClosingCta = {
  eyebrow: "Opening Signal",
  title: "Send the context that makes the alignment real.",
  body:
    "The current path is intentionally manual. Use Contact for broader aligned opportunities, or use Services if the request already has a scoped build shape.",
  primary: {
    label: "Start the Conversation",
    href: "/contact",
  },
  secondary: {
    label: "See Services",
    href: "/services",
  },
} as const;
