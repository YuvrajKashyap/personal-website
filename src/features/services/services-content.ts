export type ServiceLane = Readonly<{
  id: string;
  title: string;
  body: string;
  tags: readonly string[];
}>;

export const servicesHero = {
  eyebrow: "SERVICES",
  title: "Scoped builds for serious requests.",
  description:
    "For people who need a product surface, workflow, prototype, or system designed and built with taste, structure, and execution.",
} as const;

export const serviceLanes = [
  {
    id: "product-interfaces",
    title: "Product Interfaces",
    body: "Premium frontend surfaces, landing pages, dashboards, and web app interfaces where structure, taste, and responsiveness matter.",
    tags: ["Frontend", "Product Surface", "Responsive UI"],
  },
  {
    id: "internal-tools",
    title: "Internal Tools",
    body: "Lightweight systems for workflows, operations, admin surfaces, structured data, and decision-support interfaces.",
    tags: ["Workflow", "Operations", "Structured Data"],
  },
  {
    id: "ai-search-data",
    title: "AI, Search, and Data Prototypes",
    body: "Retrieval, search, AI workspace, data-flow, or prototype systems where architecture matters as much as the interface.",
    tags: ["AI", "Search", "Data Flow"],
  },
  {
    id: "build-polish-rescue",
    title: "Build Polish and Rescue",
    body: "Improving structure, UX, product clarity, and implementation quality in an existing surface that needs stronger direction.",
    tags: ["UX Polish", "Structure", "Rebuild Support"],
  },
] as const satisfies readonly ServiceLane[];

export const serviceFit = {
  strong: {
    label: "A strong request has",
    items: [
      "A specific surface or workflow that needs to become real",
      "A known audience or operating context",
      "A real constraint: launch pressure, quality, or clarity",
      "Someone who can give context and decide quickly",
    ],
  },
  weak: {
    label: "Better routed elsewhere",
    items: [
      "“Make me an app” without a problem or audience",
      "Cloning another product without ownership",
      "Unpaid trials or unclear ownership structures",
      "Work that immediately needs a large team",
    ],
  },
} as const;

export const servicesClosingCta = {
  title: "Have a build in mind?",
  body: "Send the request with enough context to judge the shape. If it is broader than a defined build, Collaborate is the better route.",
  primary: {
    label: "Start a request",
    href: "/contact",
  },
  secondary: {
    label: "View projects first",
    href: "/projects",
  },
} as const;
