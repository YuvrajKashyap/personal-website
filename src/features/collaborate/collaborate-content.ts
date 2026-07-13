export type CollaborationLane = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: readonly string[];
}>;

export const collaborateHero = {
  eyebrow: "COLLABORATE",
  title: "Aligned work with serious builders.",
  description:
    "For broader opportunities with founders, builders, creators, startups, and technical teams where the fit is bigger than a single scoped request.",
} as const;

export const collaborationLanes = [
  {
    id: "founder-startup-conversations",
    eyebrow: "Founder / Startup",
    title: "Founder and Startup Conversations",
    body: "Product, technical, and operating conversations with people building serious things and thinking beyond a single page or feature.",
    tags: ["Product", "Systems", "Operator Context"],
  },
  {
    id: "technical-product-opportunities",
    eyebrow: "Technical Product",
    title: "Technical Product Opportunities",
    body: "AI, search, data, web products, interfaces, or systems where my project background and product taste are relevant.",
    tags: ["AI", "Search", "Data", "Interfaces"],
  },
  {
    id: "creator-distribution-experiments",
    eyebrow: "Creative Systems",
    title: "Creator and Distribution Experiments",
    body: "Software, storytelling, content systems, or audience-building experiments with real execution behind them.",
    tags: ["Software", "Storytelling", "Distribution"],
  },
  {
    id: "research-technical-groups",
    eyebrow: "Research / Technical",
    title: "Research and Technical Groups",
    body: "Projects or teams around systems, autonomy, AI, search, data, or technical exploration where the work has substance.",
    tags: ["Research", "Autonomy", "Systems"],
  },
  {
    id: "long-term-aligned-work",
    eyebrow: "Long Arc",
    title: "Long-Term Aligned Work",
    body: "Opportunities where the right fit, standards, and direction matter more than a narrow immediate deliverable.",
    tags: ["Long-Term", "Alignment", "Direction"],
  },
] as const satisfies readonly CollaborationLane[];

export const collaborateClosingCta = {
  title: "Think there is alignment?",
  body: "Send enough context to tell what this is and why it fits. If it is already a defined deliverable, Services is the cleaner route.",
  primary: {
    label: "Start a conversation",
    href: "/contact",
  },
  secondary: {
    label: "See Services instead",
    href: "/services",
  },
} as const;
