export type AboutPhase = Readonly<{
  id: "origin" | "austin" | "tennis" | "utd" | "building" | "direction";
  eyebrow: string;
  title: string;
  body: string;
  order: number;
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
} as const;

export const aboutIntro = {
  body:
    "I am Yuvraj Kashyap, a Computer Science student at the University of Texas at Dallas, an ex-college tennis player, and a software builder focused on systems, interfaces, and ideas that compound.",
  secondary:
    "The throughline is movement under pressure: adapting across places, training through competition, and turning that discipline into software, product thinking, and builder momentum.",
} as const;

export const aboutHomePreview = {
  body:
    "Hey, I'm Yuvraj, and I study computer science at UT Dallas. I love building engineering projects across AI agents, world models, embodied and multimodal AI, computer vision, full-stack products, and space systems software.\n\nI'm also drawn to entrepreneurship and turning technical ideas into things people can actually use. More than anything, I enjoy learning quickly, taking on difficult challenges, and working alongside ambitious people who care deeply about what they build.",
} as const;

export const aboutPhases = [
  {
    id: "origin",
    eyebrow: "Saudi",
    title: "Movement started early.",
    body:
      "The early arc starts in Saudi, with movement, adaptation, and distance shaping how I read systems, environments, and opportunity.",
    order: 1,
  },
  {
    id: "austin",
    eyebrow: "Austin",
    title: "Austin made the transition concrete.",
    body:
      "Texas became the place where the path sharpened through school, competition, peers, and the pressure to turn potential into a repeatable standard.",
    order: 2,
  },
  {
    id: "tennis",
    eyebrow: "Tennis",
    title: "Competition made standards non-negotiable.",
    body:
      "Competitive tennis taught repetition under pressure. You do not get to negotiate with the scoreboard, your preparation, or the next point.",
    order: 3,
  },
  {
    id: "utd",
    eyebrow: "UT Dallas",
    title: "Computer Science gave the discipline a technical surface.",
    body:
      "At UT Dallas, the work moved into software: interfaces, data flows, AI and search ideas, product systems, and architecture.",
    order: 4,
  },
  {
    id: "building",
    eyebrow: "Now",
    title: "The current phase is active construction.",
    body:
      "Right now the focus is shipping: the personal website system, project archive, frontend craft, AI and search ideas, data workflows, and surfaces that can compound.",
    order: 5,
  },
  {
    id: "direction",
    eyebrow: "Direction",
    title: "Builder, operator, founder path.",
    body:
      "The target is serious software and meaningful systems, not noise. I am building toward work where product taste, technical depth, and execution meet.",
    order: 6,
  },
] as const satisfies readonly AboutPhase[];

export const disciplineIntro = {
  title: "Tennis is not the theme. It is the evidence.",
  body:
    "Sport made execution less abstract: show up, repeat the fundamentals, handle pressure, recover quickly, and keep standards visible when the environment gets noisy. Building software asks for the same patience with details and the same refusal to confuse activity with progress.",
} as const;

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

export const aboutClosingCta = {
  title: "The work says the rest.",
  body: "Projects carry the proof. Contact is open if the context fits.",
  primary: {
    label: "View projects",
    href: "/projects",
  },
  secondary: {
    label: "Get in touch",
    href: "/contact",
  },
} as const;
