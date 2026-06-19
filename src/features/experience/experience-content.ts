export type ExperienceEntryType =
  | "education"
  | "leadership"
  | "research"
  | "project"
  | "athletics"
  | "direction";

export type ExperienceReviewStatus = "confirmed" | "conservative";

export type ExperiencePillar = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
}>;

export type ExperienceEntry = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  organization?: string;
  context?: string;
  periodLabel?: string;
  body: string;
  signals: readonly string[];
  tags: readonly string[];
  type: ExperienceEntryType;
  reviewStatus: ExperienceReviewStatus;
  order: number;
}>;

export type ExperienceProofSurface = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}>;

export const experienceHero = {
  eyebrow: "EXPERIENCE",
  title: "Proof, trajectory, and operating layers.",
  description:
    "Roles, projects, technical work, leadership, and discipline that shape how I build.",
  status: "Trajectory map",
  meta: [
    "CS / UT Dallas",
    "Leadership / UTD Housing",
    "Current Mode / Building",
    "Background / Tennis",
  ],
} as const;

export const experiencePillars = [
  {
    id: "technical-foundation",
    eyebrow: "Technical Foundation",
    title: "Computer science, systems, and project work.",
    body:
      "The technical layer is built through UT Dallas coursework, research exposure, autonomous systems work, and shipped project surfaces.",
  },
  {
    id: "building-systems",
    eyebrow: "Building Systems",
    title: "Projects as working proof.",
    body:
      "Aletheia, Atlas, Capital, the personal website, and related systems show the current direction of software, data, AI, search, and product craft.",
  },
  {
    id: "leadership-communication",
    eyebrow: "Leadership",
    title: "Communication under responsibility.",
    body:
      "Peer advising, project leadership, and team contexts shape how I handle ownership, support, coordination, and execution.",
  },
  {
    id: "discipline-pressure",
    eyebrow: "Discipline",
    title: "Competitive pressure translated into building.",
    body:
      "Tennis is not the whole identity. It is a proof layer for repetition, composure, feedback, and standards.",
  },
] as const satisfies readonly ExperiencePillar[];

export const experienceEntries = [
  {
    id: "utd-computer-science",
    eyebrow: "Education",
    title: "Computer Science at UT Dallas",
    organization: "University of Texas at Dallas",
    periodLabel: "University",
    body:
      "A technical foundation built through software, systems, algorithms, and project work, with the broader goal of turning engineering skill into leverage.",
    signals: [
      "Computer Science foundation",
      "Software and systems focus",
      "Project-driven technical growth",
    ],
    tags: ["Education", "Computer Science", "UT Dallas"],
    type: "education",
    reviewStatus: "confirmed",
    order: 1,
  },
  {
    id: "competitive-tennis",
    eyebrow: "Athletics",
    title: "Competitive tennis",
    context: "Discipline and pressure layer",
    periodLabel: "Background",
    body:
      "A high-repetition environment that trained pressure, consistency, standards, recovery, and the ability to keep executing when feedback is immediate.",
    signals: [
      "Repetition under pressure",
      "Standards without excuses",
      "Recovery after mistakes",
    ],
    tags: ["Discipline", "Pressure", "Execution"],
    type: "athletics",
    reviewStatus: "confirmed",
    order: 2,
  },
  {
    id: "peer-advisor-utd-housing",
    eyebrow: "Leadership",
    title: "Peer Advisor, UTD Housing",
    organization: "UTD Housing",
    periodLabel: "Leadership",
    body:
      "A community-facing role centered on residents, communication, support, responsibility, and staying steady inside practical day-to-day needs.",
    signals: [
      "Resident support",
      "Communication and responsibility",
      "Community-facing leadership",
    ],
    tags: ["Leadership", "Communication", "UTD Housing"],
    type: "leadership",
    reviewStatus: "confirmed",
    order: 3,
  },
  {
    id: "uav-smart-city-research",
    eyebrow: "Research",
    title: "Undergraduate research in UAV and smart-city systems",
    context: "Research engineering exposure",
    periodLabel: "Technical research",
    body:
      "Research-oriented work around UAV and smart-city systems, approached conservatively as technical exposure to simulation, sensing constraints, and city-scale systems thinking.",
    signals: [
      "UAV and smart-city systems",
      "Simulation and sensing constraints",
      "Research engineering mindset",
    ],
    tags: ["Research", "UAV", "Smart City"],
    type: "research",
    reviewStatus: "conservative",
    order: 4,
  },
  {
    id: "nova-autonomous-driving",
    eyebrow: "Autonomous Systems",
    title: "NOVA Autonomous Driving",
    context: "Technical team experience",
    periodLabel: "Technical team",
    body:
      "Technical team involvement around autonomous systems, hardware and software workflows, sensing, perception, and the kind of engineering context where details matter.",
    signals: [
      "Autonomous systems context",
      "Hardware and software workflows",
      "Perception-oriented technical exposure",
    ],
    tags: ["Autonomy", "Perception", "Systems"],
    type: "research",
    reviewStatus: "conservative",
    order: 5,
  },
  {
    id: "consult-your-community",
    eyebrow: "Project Leadership",
    title: "Consult Your Community project leadership",
    context: "Execution and coordination",
    periodLabel: "Leadership",
    body:
      "A leadership context for project execution, stakeholder communication, operations, product thinking, and team coordination without overstating outcomes.",
    signals: [
      "Stakeholder communication",
      "Project coordination",
      "Operations and product thinking",
    ],
    tags: ["Leadership", "Execution", "Product Thinking"],
    type: "leadership",
    reviewStatus: "conservative",
    order: 6,
  },
  {
    id: "current-build-phase",
    eyebrow: "Current Build Phase",
    title: "Building software systems",
    context: "Selected work",
    periodLabel: "Current",
    body:
      "Current work focuses on software systems, project archives, frontend craft, AI and search ideas, data workflows, and surfaces that compound skill, proof, and leverage.",
    signals: [
      "Aletheia, Atlas, Capital, and personal website systems",
      "Frontend, AI, search, data, and product surfaces",
      "Builder and operator direction",
    ],
    tags: ["Projects", "Systems", "Current"],
    type: "project",
    reviewStatus: "confirmed",
    order: 7,
  },
] as const satisfies readonly ExperienceEntry[];

export const proofSurfaces = [
  {
    id: "projects",
    eyebrow: "Build Evidence",
    title: "Projects",
    body:
      "See the systems and surfaces that translate this trajectory into visible technical work.",
    href: "/projects",
    cta: "View Projects",
  },
  {
    id: "tracker",
    eyebrow: "Current State",
    title: "Tracker",
    body:
      "See the operating layer for current focus, active work, and manual signal as the system grows.",
    href: "/tracker",
    cta: "Open Tracker",
  },
  {
    id: "about",
    eyebrow: "Human Context",
    title: "About",
    body:
      "Read the background and discipline arc behind the work without turning this page into biography.",
    href: "/about",
    cta: "Read About",
  },
  {
    id: "contact",
    eyebrow: "Open Channel",
    title: "Contact",
    body:
      "Use this route for aligned opportunities, serious builds, and useful conversations.",
    href: "/contact",
    cta: "Get in Touch",
  },
] as const satisfies readonly ExperienceProofSurface[];

export const futureDirection = {
  eyebrow: "Direction",
  title: "The trajectory points toward serious software and meaningful systems.",
  body:
    "The next layer is software engineering, AI and search systems, data workflows, frontend craft, product judgment, and the founder/operator path. The goal is not noise. The goal is work that compounds.",
  signals: [
    "Software engineering depth",
    "AI, search, and data systems",
    "Product and frontend craft",
    "Founder/operator direction",
  ],
} as const;

export const experienceClosingCta = {
  eyebrow: "Next Signal",
  title: "The experience page is a map. The projects are the proof.",
  body:
    "Use the project archive for concrete systems, or open a direct conversation if there is aligned work to discuss.",
  primary: {
    label: "View Projects",
    href: "/projects",
  },
  secondary: {
    label: "Get in Touch",
    href: "/contact",
  },
} as const;
