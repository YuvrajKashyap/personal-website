export type TrackerStatusCard = Readonly<{
  id: string;
  label: string;
  value: string;
  description: string;
  source: string;
  tone?: "default" | "active" | "muted" | "warning";
}>;

export type TrackerThread = Readonly<{
  id: string;
  label: string;
  items: readonly string[];
}>;

export const trackerHero = {
  eyebrow: "TRACKER",
  title: "What is on the bench right now.",
  description:
    "A manual snapshot of what I am building, learning, and turning into proof. Updated by hand, no fake feeds.",
} as const;

export const trackerStatusCards = [
  {
    id: "current-mode",
    label: "Current mode",
    value: "Building the personal website system",
    description:
      "The active public surface is being shaped into a stronger operating interface.",
    source: "Source: manual note",
    tone: "active",
  },
  {
    id: "current-focus",
    label: "Current focus",
    value: "AI, search, and data systems with product-grade interfaces",
    description:
      "Aletheia and Atlas carry the technical direction. The site carries the craft signal.",
    source: "Source: manual note",
  },
  {
    id: "training",
    label: "Training",
    value: "Standards, pressure tolerance, and recovery",
    description:
      "The tennis discipline layer stays qualitative here: no private tracking numbers, just the standard it sets.",
    source: "Source: manual note",
    tone: "muted",
  },
] as const satisfies readonly TrackerStatusCard[];

export const trackerThreads = [
  {
    id: "building",
    label: "Building",
    items: [
      "This website as a theme-aware operating interface",
      "Aletheia: retrieval, ranking, and search observability",
      "Atlas: crawl, extract, index, and search for public web content",
    ],
  },
  {
    id: "learning",
    label: "Learning",
    items: [
      "Retrieval and ranking evaluation in practice",
      "World models and embodied AI research context",
      "Frontend motion systems and interface craft",
    ],
  },
  {
    id: "next",
    label: "Next",
    items: [
      "Deeper project case studies with real artifacts",
      "Admin editing layer so this page updates faster",
      "Real measurement only when the source is clear",
    ],
  },
] as const satisfies readonly TrackerThread[];

export const trackerClosingCta = {
  title: "The proof lives in the projects.",
  body: "The tracker is the snapshot. Projects carry the technical evidence behind it.",
  primary: {
    label: "View projects",
    href: "/projects",
  },
  secondary: {
    label: "Get in touch",
    href: "/contact",
  },
} as const;
