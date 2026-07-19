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

export type ResumeRole = Readonly<{
  id: string;
  role: string;
  organization: string;
  period: string;
  current?: boolean;
  bullets: readonly string[];
  skills: readonly string[];
}>;

export const resumeEducation = {
  school: "University of Texas at Dallas",
  degree:
    "B.S. Computer Science · Minor in Finance · Entrepreneurship & Innovation Certificate",
  credentials: ["Dean's List", "NCAA DII Tennis", "Class of 2027"],
} as const;

export const resumeRoles = [
  {
    id: "idk-studios-medceptor-swe-intern",
    role: "Software Engineering Intern",
    organization: "IDK Studios · Medceptor",
    period: "Apr 2026 — Present",
    current: true,
    bullets: [
      "Shipped production features for Medceptor, an AI-driven medical education platform, across Next.js, React, TypeScript, Django, and Supabase/Postgres in a small founder-led startup team.",
      "Built RN nursing question-bank and exam-mode workflows supporting 100+ generated questions, multiple question formats, track and level filtering, scoring and review flows, and internal QA.",
      "Delivered PRs spanning product, backend data modeling, content-generation imports, and validation pipelines, expanding Medceptor beyond EMT/NREMT simulations into CNA/LPN/RN exam-prep infrastructure.",
    ],
    skills: ["Next.js", "TypeScript", "Django", "Supabase/Postgres"],
  },
  {
    id: "cyc-vp-finance",
    role: "VP of Finance & Project Team Lead",
    organization: "Consult Your Community · UT Dallas",
    period: "Jan 2026 — Present",
    current: true,
    bullets: [
      "Led cross-functional consulting engagements for Glydr, a hardware company building foot-based computer control interfaces, and Get in the Path, an education nonprofit.",
      "Built Glydr's web-based gaming hub prototype and drove execution across product operations, pricing and financial strategy, go-to-market planning, and final client deliverables.",
    ],
    skills: ["Product ops", "Financial strategy", "Go-to-market", "Prototyping"],
  },
  {
    id: "uav-smart-city-researcher",
    role: "Undergraduate Researcher, UAV / Smart City Systems",
    organization: "University of Texas at Dallas",
    period: "Oct 2025 — Present",
    current: true,
    bullets: [
      "Built a geometry-driven UAV swarm simulation framework over a 4 km × 4 km OpenStreetMap/Blender urban environment to evaluate multi-agent path planning, visibility, and coverage under realistic city constraints.",
      "Modeled occlusions, non-convex obstacles, and sensing constraints with learning-guided coordination heuristics to study UAV behavior beyond simplified grid environments.",
    ],
    skills: ["Python", "Blender / OSM", "Multi-agent planning", "Simulation"],
  },
  {
    id: "peer-advisor-university-housing",
    role: "Peer Advisor, University Housing",
    organization: "University of Texas at Dallas",
    period: "May 2024 — Present",
    current: true,
    bullets: [
      "Serve as a Peer Advisor for 120+ residents, acting as the primary point of contact for academic, personal, and housing-related concerns.",
    ],
    skills: ["Leadership", "Communication", "Residence life"],
  },
  {
    id: "independent-sat-tutor",
    role: "Academic Tutor & Outreach",
    organization: "Independent · Dallas–Fort Worth",
    period: "May 2025 — Aug 2025",
    bullets: [
      "Provided volunteer 1-on-1 SAT tutoring as a skill-building and outreach activity, adapting instruction to individual student learning goals.",
    ],
    skills: ["Teaching", "Communication", "Outreach"],
  },
  {
    id: "nova-electrical-engineer",
    role: "Systems & Electrical Engineer, NOVA Autonomous Driving",
    organization: "University of Texas at Dallas",
    period: "Sep 2023 — Jun 2025",
    bullets: [
      "Built Python preprocessing pipelines for 3D sensor data, including voxel-grid point cloud downsampling that reduced scan size from 370,277 to 20,528 points while preserving geometric structure.",
      "Designed, maintained, and debugged primary and secondary power systems for an autonomous vehicle, including dual battery banks, high-voltage lines, and multiple I/O buses, translating hardware constraints into systems-level fixes.",
    ],
    skills: ["Python", "Point clouds", "Power systems", "Perception"],
  },
  {
    id: "aim-ai-ml-mentee",
    role: "Mentee, AIM — AI & Machine Learning Program",
    organization: "University of Texas at Dallas",
    period: "Sep 2023 — Apr 2024",
    bullets: [
      "Selected as a mentee in a competitive AI-focused mentorship program, collaborating on a team-based technical project.",
    ],
    skills: ["AI", "Reinforcement learning", "Collaboration"],
  },
] as const satisfies readonly ResumeRole[];

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
    id: "idk-studios-medceptor-internship",
    eyebrow: "Industry",
    title: "Software Engineering Intern, IDK Studios / Medceptor",
    organization: "IDK Studios / Medceptor",
    context: "AI-driven medical education platform",
    periodLabel: "Apr 2026 — Present",
    body:
      "Production full-stack work on Medceptor's exam-prep platform in a small founder-led startup team: RN question-bank and exam-mode systems, content-generation and validation pipelines, and release QA across Next.js, Django, and Supabase/Postgres.",
    type: "project",
    reviewStatus: "confirmed",
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
