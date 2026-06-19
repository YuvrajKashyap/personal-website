export type TrackerStatusCard = Readonly<{
  id: string;
  label: string;
  value: string;
  description: string;
  source: string;
  tone?: "default" | "active" | "muted" | "warning";
}>;

export type TrackerFocusArea = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: readonly string[];
}>;

export type TrackerPillar = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
}>;

export type TrackerSurfaceLink = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  status: string;
}>;

export type TrackerRoadmapItem = Readonly<{
  id: string;
  label: string;
  title: string;
  body: string;
  status: string;
}>;

export const trackerHero = {
  eyebrow: "TRACKER",
  title: "Current state, active systems, and operating signal.",
  description:
    "A manual snapshot of what I am building, focusing on, and turning into proof.",
  status: "Manual signal",
  meta: [
    "Source / Local content",
    "Mode / Building",
    "Surface / Current State",
    "Next / Admin Layer",
  ],
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
    value: "Projects, Tracker, frontend polish, and recruiter signal",
    description:
      "The current focus is about making the proof surfaces clearer, sharper, and easier to navigate.",
    source: "Source: local content",
  },
  {
    id: "active-surface",
    label: "Active surface",
    value: "Home, About, Experience, Projects, and details",
    description:
      "These routes carry the strongest public signal right now and remain the core site path.",
    source: "Source: route map",
  },
  {
    id: "signal-source",
    label: "Signal source",
    value: "Manual current-state signal",
    description:
      "The page is intentionally honest about being maintained as structured local content.",
    source: "Source: local model",
    tone: "muted",
  },
] as const satisfies readonly TrackerStatusCard[];

export const trackerFocusAreas = [
  {
    id: "website-system",
    eyebrow: "Website System",
    title: "Turning the site into an operating interface.",
    body:
      "The website is being built as a premium public system, not a static portfolio shell.",
    tags: ["Interface", "Architecture", "Signal"],
  },
  {
    id: "project-proof",
    eyebrow: "Project Proof",
    title: "Making the project archive easier to trust.",
    body:
      "The project layer is the visible proof surface for systems, product judgment, and technical range.",
    tags: ["Projects", "Case Studies", "Proof"],
  },
  {
    id: "career-signal",
    eyebrow: "Career Signal",
    title: "Clarifying recruiter and collaborator context.",
    body:
      "The current pages are being shaped so visitors can quickly understand trajectory, work, and fit.",
    tags: ["Recruiting", "Context", "Clarity"],
  },
  {
    id: "ai-search-data",
    eyebrow: "AI / Search / Data",
    title: "Keeping the technical direction visible.",
    body:
      "The build direction continues to point toward AI, search, data workflows, and product-grade systems.",
    tags: ["AI", "Search", "Data"],
  },
  {
    id: "discipline-layer",
    eyebrow: "Discipline Layer",
    title: "Keeping standards connected to daily execution.",
    body:
      "The discipline layer is qualitative here: standards, training mindset, focus, and recovery without private tracking details.",
    tags: ["Discipline", "Standards", "Focus"],
  },
] as const satisfies readonly TrackerFocusArea[];

export const trackerOperatingPillars = [
  {
    id: "build",
    label: "01",
    title: "Build",
    body:
      "Turn ideas into working systems, visible surfaces, and reviewable proof.",
  },
  {
    id: "learn",
    label: "02",
    title: "Learn",
    body:
      "Keep technical depth moving through projects, research context, and deliberate study.",
  },
  {
    id: "train",
    label: "03",
    title: "Train",
    body:
      "Preserve pressure tolerance, feedback loops, standards, and recovery.",
  },
  {
    id: "publish",
    label: "04",
    title: "Publish",
    body:
      "Make the work inspectable through routes, writing, project pages, and clear public context.",
  },
] as const satisfies readonly TrackerPillar[];

export const trackerActiveSurfaces = [
  {
    id: "projects",
    eyebrow: "Build Archive",
    title: "Projects",
    body:
      "The strongest route for concrete systems, product surfaces, and technical proof.",
    href: "/projects",
    cta: "View Projects",
    status: "Active surface",
  },
  {
    id: "experience",
    eyebrow: "Trajectory",
    title: "Experience",
    body:
      "The structured route for education, leadership, research context, discipline, and current building.",
    href: "/experience",
    cta: "Open Experience",
    status: "Active surface",
  },
  {
    id: "about",
    eyebrow: "Origin Layer",
    title: "About",
    body:
      "The human context behind the standards, trajectory, and systems-thinking direction.",
    href: "/about",
    cta: "Read About",
    status: "Active surface",
  },
  {
    id: "services",
    eyebrow: "Future Offer Surface",
    title: "Services",
    body:
      "A route reserved for scoped work, useful builds, and clear engagement boundaries.",
    href: "/services",
    cta: "Open Services",
    status: "Prepared route",
  },
  {
    id: "collaborate",
    eyebrow: "Opportunity Surface",
    title: "Collaborate",
    body:
      "A route for aligned opportunities, serious builders, and future collaboration paths.",
    href: "/collaborate",
    cta: "Open Collaborate",
    status: "Prepared route",
  },
  {
    id: "contact",
    eyebrow: "Open Channel",
    title: "Contact",
    body:
      "The direct route for aligned conversations, useful opportunities, and focused outreach.",
    href: "/contact",
    cta: "Get in Touch",
    status: "Active route",
  },
] as const satisfies readonly TrackerSurfaceLink[];

export const trackerRoadmap = [
  {
    id: "tracker-model",
    label: "Next 01",
    title: "Tracker content model",
    body:
      "Keep the current-state surface structured so future admin editing can use the same shape.",
    status: "Ready for later",
  },
  {
    id: "services-collaborate",
    label: "Next 02",
    title: "Services and Collaborate pages",
    body:
      "Build the remaining public routes with clear boundaries and no borrowed claims.",
    status: "Future page work",
  },
  {
    id: "contact-flow",
    label: "Next 03",
    title: "Contact flow",
    body:
      "Create a focused contact route that supports serious messages without adding noise.",
    status: "Future page work",
  },
  {
    id: "admin-layer",
    label: "Next 04",
    title: "Supabase and admin layer",
    body:
      "Connect real editing and data boundaries later while keeping public copy honest.",
    status: "Future system",
  },
  {
    id: "measurement-layer",
    label: "Next 05",
    title: "Measurement layer",
    body:
      "Add real measurement only when the project is ready for it and the source is clear.",
    status: "Future system",
  },
] as const satisfies readonly TrackerRoadmapItem[];

export const trackerSourceNote = {
  eyebrow: "Source Boundary",
  title: "This is manual current-state content.",
  body:
    "This page is maintained as local content right now. Future steps can connect it to admin controls, Supabase, and real integrations when those systems exist.",
  badges: ["Updated manually", "No fake feeds", "No private details"],
} as const;

export const trackerClosingCta = {
  eyebrow: "Next Signal",
  title: "Use the tracker as the surface map, then inspect the proof.",
  body:
    "Projects carry the technical evidence. Contact is the route for aligned work, serious conversations, and useful opportunities.",
  primary: {
    label: "View Projects",
    href: "/projects",
  },
  secondary: {
    label: "Get in Touch",
    href: "/contact",
  },
} as const;
