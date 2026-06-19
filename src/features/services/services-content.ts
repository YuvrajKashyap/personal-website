export type ServiceLane = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: readonly string[];
  status: string;
  order: number;
}>;

export type ServiceFitItem = Readonly<{
  id: string;
  title: string;
  body: string;
  order: number;
}>;

export type ServiceProcessStep = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
  order: number;
}>;

export type ServiceProofLink = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  order: number;
}>;

export type ServiceComparisonItem = Readonly<{
  id: "services" | "collaborate";
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}>;

export const servicesHero = {
  eyebrow: "SERVICES",
  title: "Scoped builds for serious requests.",
  description:
    "For people who need a product surface, workflow, prototype, or system designed and built with taste, structure, and execution.",
  status: "Scoped intake",
  meta: [
    "Scope / Build Requests",
    "Mode / Selective",
    "Source / Manual Intake",
    "Next Step / Contact",
  ],
} as const;

export const servicesDefinition = {
  eyebrow: "Definition",
  title: "Services means a scoped build path.",
  body:
    "This page is for requests with a concrete surface, workflow, prototype, or system that can be clarified, shaped, and executed. It is not the route for broad networking or open-ended partnership conversations.",
  secondary:
    "If the request is wider than a defined build, Collaborate is the better route. Services stays focused on practical execution with clear boundaries.",
  signals: [
    "Defined surface",
    "Practical execution",
    "Manual intake",
    "Contact first",
  ],
} as const;

export const serviceLanes = [
  {
    id: "product-interfaces",
    eyebrow: "Surface",
    title: "Product Interfaces",
    body:
      "Premium frontend surfaces, landing pages, dashboards, and web app interfaces where structure, taste, and responsiveness matter.",
    tags: ["Frontend", "Product Surface", "Responsive UI"],
    status: "Design and build",
    order: 1,
  },
  {
    id: "internal-tools",
    eyebrow: "Systems",
    title: "Internal Tools",
    body:
      "Lightweight systems for workflows, operations, admin surfaces, structured data, and decision-support interfaces.",
    tags: ["Workflow", "Operations", "Structured Data"],
    status: "Tooling",
    order: 2,
  },
  {
    id: "ai-search-data",
    eyebrow: "Prototype",
    title: "AI, Search, and Data Prototypes",
    body:
      "Retrieval, search, AI workspace, data-flow, or prototype systems where architecture matters as much as the interface.",
    tags: ["AI", "Search", "Data Flow"],
    status: "Prototype",
    order: 3,
  },
  {
    id: "build-polish-rescue",
    eyebrow: "Rescue",
    title: "Build Polish and Rescue",
    body:
      "Improving structure, UX, product clarity, and implementation quality in an existing surface that needs stronger direction.",
    tags: ["UX Polish", "Structure", "Rebuild Support"],
    status: "Reshape",
    order: 4,
  },
] as const satisfies readonly ServiceLane[];

export const serviceFitItems = [
  {
    id: "clear-problem",
    title: "Clear problem",
    body:
      "There is a specific product, workflow, or technical surface that needs to become real or become sharper.",
    order: 1,
  },
  {
    id: "defined-workflow",
    title: "Defined workflow",
    body:
      "The request has a known audience, operating context, or repeatable flow that can be mapped.",
    order: 2,
  },
  {
    id: "real-reason",
    title: "Real reason",
    body:
      "There is a meaningful constraint, launch pressure, or quality problem behind the request.",
    order: 3,
  },
  {
    id: "fast-feedback",
    title: "Fast feedback",
    body:
      "The founder, operator, builder, or team can give direct context and make decisions quickly.",
    order: 4,
  },
] as const satisfies readonly ServiceFitItem[];

export const serviceNotFitItems = [
  {
    id: "vague-app",
    title: "Vague app asks",
    body:
      "Requests that only say make me an app without a real problem, audience, or workflow are not a strong fit.",
    order: 1,
  },
  {
    id: "clone-requests",
    title: "Clone requests",
    body:
      "Requests built around copying another product without clear product judgment or ownership are not the target.",
    order: 2,
  },
  {
    id: "speculative-work",
    title: "Speculative work",
    body:
      "Unpaid trial work, vague competitions, and unclear ownership structures should use another route.",
    order: 3,
  },
  {
    id: "team-scale",
    title: "Large-team needs",
    body:
      "Requests that immediately require many specialized roles are better routed to a dedicated team.",
    order: 4,
  },
] as const satisfies readonly ServiceFitItem[];

export const serviceProcessSteps = [
  {
    id: "send-context",
    label: "01",
    title: "Send context",
    body:
      "Use Contact to explain the surface, workflow, audience, constraint, and what needs to change.",
    order: 1,
  },
  {
    id: "clarify-scope",
    label: "02",
    title: "Clarify scope",
    body:
      "The next step is deciding what the request actually is, what can be built, and what should stay out of scope.",
    order: 2,
  },
  {
    id: "decide-fit",
    label: "03",
    title: "Decide fit",
    body:
      "If the work is scoped, useful, and aligned with the way I build, the request can move forward.",
    order: 3,
  },
  {
    id: "define-next-move",
    label: "04",
    title: "Define the next move",
    body:
      "The request either becomes a build path, gets redirected to a better route, or closes cleanly.",
    order: 4,
  },
] as const satisfies readonly ServiceProcessStep[];

export const serviceProofLinks = [
  {
    id: "projects",
    eyebrow: "Archive",
    title: "Projects",
    body:
      "The project archive is the broadest proof surface for systems, interfaces, and technical direction.",
    href: "/projects",
    cta: "View Projects",
    order: 1,
  },
  {
    id: "aletheia",
    eyebrow: "AI / Search",
    title: "Aletheia",
    body:
      "A retrieval, ranking, evaluation, and search observability system direction.",
    href: "/projects/aletheia",
    cta: "Open Aletheia",
    order: 2,
  },
  {
    id: "atlas",
    eyebrow: "Data Infrastructure",
    title: "Atlas",
    body:
      "A crawl, extract, index, and search platform direction for public web content.",
    href: "/projects/atlas",
    cta: "Open Atlas",
    order: 3,
  },
  {
    id: "personal-website",
    eyebrow: "Interface System",
    title: "Personal Website",
    body:
      "The live system you are inside, built as a theme-aware public operating interface.",
    href: "/projects/personal-website",
    cta: "Open Case Study",
    order: 4,
  },
] as const satisfies readonly ServiceProofLink[];

export const servicesComparison = [
  {
    id: "services",
    label: "Services",
    title: "Scoped build request",
    body:
      "A concrete surface, workflow, prototype, or system with a practical execution boundary.",
    href: "/services",
    cta: "You are here",
  },
  {
    id: "collaborate",
    label: "Collaborate",
    title: "Broader aligned opportunity",
    body:
      "Founders, creators, startups, builders, partnerships, and long-term possibilities that are not only a scoped build.",
    href: "/collaborate",
    cta: "Open Collaborate",
  },
] as const satisfies readonly ServiceComparisonItem[];

export const servicesClosingCta = {
  eyebrow: "Start Point",
  title: "Send the request with enough context to judge the shape.",
  body:
    "The current path is intentionally manual. Use Contact for scoped build requests, and use Projects if you want to inspect the proof surface first.",
  primary: {
    label: "Start a Request",
    href: "/contact",
  },
  secondary: {
    label: "View Projects",
    href: "/projects",
  },
} as const;
