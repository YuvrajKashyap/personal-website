export type ExperienceEntryType =
  | "education"
  | "leadership"
  | "research"
  | "project"
  | "athletics";

export type ExperienceReviewStatus = "confirmed" | "conservative";

export type ExperienceEntry = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  organization?: string;
  context?: string;
  periodLabel?: string;
  body: string;
  type: ExperienceEntryType;
  reviewStatus: ExperienceReviewStatus;
  order: number;
}>;

export const experienceHero = {
  eyebrow: "EXPERIENCE",
  title: "Proof, trajectory, and operating layers.",
  description:
    "Roles, projects, technical work, leadership, and discipline that shape how I build.",
} as const;

export const experienceEntries = [
  {
    id: "current-build-phase",
    eyebrow: "Now",
    title: "Building software systems",
    context: "Selected work",
    periodLabel: "Current",
    body:
      "Aletheia, Atlas, Capital, and this website: software systems, frontend craft, AI and search ideas, data workflows, and surfaces that compound skill, proof, and leverage.",
    type: "project",
    reviewStatus: "confirmed",
    order: 1,
  },
  {
    id: "utd-computer-science",
    eyebrow: "Education",
    title: "Computer Science at UT Dallas",
    organization: "University of Texas at Dallas",
    periodLabel: "University",
    body:
      "A technical foundation built through software, systems, algorithms, and project work, with the broader goal of turning engineering skill into leverage.",
    type: "education",
    reviewStatus: "confirmed",
    order: 2,
  },
  {
    id: "uav-smart-city-research",
    eyebrow: "Research",
    title: "Undergraduate research in UAV and smart-city systems",
    context: "Research engineering exposure",
    periodLabel: "Technical research",
    body:
      "Research-oriented work around UAV and smart-city systems: simulation, sensing constraints, and city-scale systems thinking.",
    type: "research",
    reviewStatus: "conservative",
    order: 3,
  },
  {
    id: "nova-autonomous-driving",
    eyebrow: "Autonomous Systems",
    title: "NOVA Autonomous Driving",
    context: "Technical team experience",
    periodLabel: "Technical team",
    body:
      "Technical team involvement around autonomous systems: hardware and software workflows, sensing, perception, and the kind of engineering context where details matter.",
    type: "research",
    reviewStatus: "conservative",
    order: 4,
  },
  {
    id: "peer-advisor-utd-housing",
    eyebrow: "Leadership",
    title: "Peer Advisor, UTD Housing",
    context: "Community-facing role",
    body:
      "A community-facing role centered on residents, communication, support, responsibility, and staying steady inside practical day-to-day needs.",
    type: "leadership",
    reviewStatus: "confirmed",
    order: 5,
  },
  {
    id: "consult-your-community",
    eyebrow: "Project Leadership",
    title: "Consult Your Community project leadership",
    context: "Execution and coordination",
    body:
      "A leadership context for project execution, stakeholder communication, operations, product thinking, and team coordination.",
    type: "leadership",
    reviewStatus: "conservative",
    order: 6,
  },
  {
    id: "competitive-tennis",
    eyebrow: "Athletics",
    title: "Competitive tennis",
    context: "Discipline and pressure layer",
    periodLabel: "Background",
    body:
      "A high-repetition environment that trained pressure, consistency, standards, recovery, and the ability to keep executing when feedback is immediate.",
    type: "athletics",
    reviewStatus: "confirmed",
    order: 7,
  },
] as const satisfies readonly ExperienceEntry[];

export const experienceClosingCta = {
  title: "The map is here. The proof is in the projects.",
  body: "The direction is software engineering, AI and search systems, and the founder path. Open the archive for the concrete systems behind this page.",
  primary: {
    label: "View projects",
    href: "/projects",
  },
  secondary: {
    label: "Get in touch",
    href: "/contact",
  },
} as const;
