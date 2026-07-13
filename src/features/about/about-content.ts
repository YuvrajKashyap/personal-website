export type AboutPhase = Readonly<{
  id: "origin" | "austin" | "tennis" | "utd" | "building" | "direction";
  eyebrow: string;
  title: string;
  body: string;
  signal: string;
  tags: readonly string[];
  order: number;
}>;

export type AboutOperatingLink = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}>;

export type AboutSignal = Readonly<{
  label: string;
  value: string;
  body: string;
}>;

export const aboutHero = {
  eyebrow: "ABOUT",
  title: "A life built around systems, discipline, and momentum.",
  description:
    "From Saudi to Austin to UT Dallas, from competitive tennis into computer science, I have been moving toward the same thing: building systems that create leverage.",
  status: "Current mode: Building",
  meta: ["CS / UT Dallas", "Background / Tennis", "Current Mode / Building"],
} as const;

export const aboutIntro = {
  eyebrow: "Human Context",
  title: "The site is a living interface, not a static resume.",
  body:
    "I am Yuvraj Kashyap, a Computer Science student at the University of Texas at Dallas, an ex-college tennis player, and a software builder focused on systems, interfaces, projects, and current-state signal. This About page gives the human arc behind the work without turning the site into a resume dump.",
  secondary:
    "The throughline is movement under pressure: adapting across places, training through competition, and turning that discipline into software, product thinking, and builder momentum.",
} as const;

export const aboutHomePreview = {
  body:
    "I'm Yuvraj Kashyap, a Computer Science student at the University of Texas at Dallas, an ex-college tennis player, and a software builder drawn to ambitious systems, thoughtful interfaces, and ideas that create leverage.",
} as const;

export const aboutPhases = [
  {
    id: "origin",
    eyebrow: "01 / ORIGIN",
    title: "Movement started early.",
    body:
      "The early arc starts in Saudi, with movement, adaptation, and distance shaping how I read systems, environments, and opportunity.",
    signal: "A global starting point with a bias for adaptation.",
    tags: ["Saudi", "Origin", "Adaptation"],
    order: 1,
  },
  {
    id: "austin",
    eyebrow: "02 / AUSTIN",
    title: "Austin made the transition concrete.",
    body:
      "Texas became the place where the path sharpened through school, competition, peers, and the pressure to turn potential into a repeatable standard.",
    signal: "Transition into a more deliberate operating rhythm.",
    tags: ["Austin", "Texas", "Transition"],
    order: 2,
  },
  {
    id: "tennis",
    eyebrow: "03 / TENNIS",
    title: "Competition made standards non-negotiable.",
    body:
      "Competitive tennis taught repetition under pressure. You do not get to negotiate with the scoreboard, your preparation, or the next point.",
    signal: "Pressure, recovery, repetition, and execution.",
    tags: ["Discipline", "Pressure", "Standards"],
    order: 3,
  },
  {
    id: "utd",
    eyebrow: "04 / UT DALLAS",
    title: "Computer Science gave the discipline a technical surface.",
    body:
      "At UT Dallas, the work moved into software: interfaces, data flows, AI and search ideas, product systems, and architecture.",
    signal: "A shift from athletic repetition to engineering leverage.",
    tags: ["UT Dallas", "Computer Science", "Engineering"],
    order: 4,
  },
  {
    id: "building",
    eyebrow: "05 / BUILDING",
    title: "The current phase is active construction.",
    body:
      "Right now the focus is shipping: the personal website system, project archive, frontend craft, AI and search ideas, data workflows, and surfaces that can compound.",
    signal: "Build public proof while sharpening the private operating system.",
    tags: ["Projects", "Systems", "Momentum"],
    order: 5,
  },
  {
    id: "direction",
    eyebrow: "06 / DIRECTION",
    title: "The direction is builder, operator, founder path.",
    body:
      "The target is serious software and meaningful systems, not noise. I am building toward work where product taste, technical depth, and execution meet.",
    signal: "A founder path grounded in shipping, learning, and leverage.",
    tags: ["Builder", "Operator", "Future Founder"],
    order: 6,
  },
] as const satisfies readonly AboutPhase[];

export const disciplineSignals = [
  {
    label: "Repetition",
    value: "Practice becomes proof.",
    body:
      "Tennis made the value of repeated fundamentals obvious. The same standard now shows up in design reviews, rebuilds, and technical iteration.",
  },
  {
    label: "Pressure",
    value: "The point is always live.",
    body:
      "Competitive environments train calm execution. Building software asks for the same thing when constraints, bugs, and decisions stack up.",
  },
  {
    label: "Standards",
    value: "No scoreboard excuses.",
    body:
      "Sport keeps the feedback loop brutally clear. The goal now is to bring that clarity into projects, interfaces, and operating systems.",
  },
  {
    label: "Recovery",
    value: "Reset, then continue.",
    body:
      "A bad point only matters if it changes the next one. That rhythm carries into debugging, learning, and staying steady inside long builds.",
  },
] as const satisfies readonly AboutSignal[];

export const operatingLinks = [
  {
    id: "projects",
    eyebrow: "Proof Surface",
    title: "Projects",
    body:
      "A typed archive of systems, products, experiments, and technical work with honest boundaries.",
    href: "/projects",
    cta: "View Projects",
  },
  {
    id: "tracker",
    eyebrow: "Current State",
    title: "Tracker",
    body:
      "A signal layer for what is active, changing, and worth watching as the operating interface grows.",
    href: "/tracker",
    cta: "Open Tracker",
  },
  {
    id: "services",
    eyebrow: "Build Path",
    title: "Services",
    body:
      "A future surface for scoped build requests when there is a concrete problem to design or ship.",
    href: "/services",
    cta: "Explore Services",
  },
  {
    id: "collaborate",
    eyebrow: "Aligned Work",
    title: "Collaborate",
    body:
      "A route for serious opportunities with builders, founders, creators, startups, and teams.",
    href: "/collaborate",
    cta: "Start a Conversation",
  },
] as const satisfies readonly AboutOperatingLink[];

export const aboutClosingCta = {
  eyebrow: "Next Orbit",
  title: "The story is only useful if it points somewhere.",
  body:
    "The next layer is the work itself: projects, current-state signal, and the conversations worth opening.",
  primary: {
    label: "View Projects",
    href: "/projects",
  },
  secondary: {
    label: "Get in Touch",
    href: "/contact",
  },
} as const;
