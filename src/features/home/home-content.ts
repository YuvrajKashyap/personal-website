export const homeContent = {
  eyebrow: "BUILDER. OPERATOR. FUTURE FOUNDER.",
  name: "Yuvraj Kashyap",
  headline: "I build systems that create gravity.",
  body: "I design software, products, and operating systems that turn ideas into leverage.",
  primaryCta: {
    label: "Explore My Universe",
    href: "#home-signal",
  },
  secondaryCta: {
    label: "View Projects",
    href: "/projects",
  },
  telemetry: [
    "YK / SYSTEM ONLINE",
    "DARK MODE / SINGULARITY OS",
    "CURRENT STATE / BUILDING",
    "LOCATION / RICHARDSON, TX",
  ],
  lightTelemetry: [
    "IVORY OBSERVATORY",
    "SYSTEM / ONLINE",
    "CURRENT STATE / BUILDING",
    "BASE / RICHARDSON, TX",
  ],
} as const;

export const signalItems = [
  {
    label: "Builder",
    description: "Designing and shipping software systems with leverage.",
  },
  {
    label: "Systems",
    description: "Thinking in architecture, feedback loops, and operating layers.",
  },
  {
    label: "Software",
    description: "Full-stack products, AI systems, data flows, and interfaces.",
  },
  {
    label: "Momentum",
    description: "Active projects, current focus, and continuous iteration.",
  },
] as const;

export const trackerPreview = {
  eyebrow: "Tracker Preview",
  title: "A current-state surface, built carefully.",
  description:
    "The tracker will become a grounded signal layer for what is active, changing, and worth watching.",
  cta: {
    label: "Open Tracker",
    href: "/tracker",
  },
  items: [
    {
      label: "Current mode",
      value: "Building the personal website system.",
    },
    {
      label: "Current focus",
      value:
        "Cinematic frontend, portfolio architecture, projects, and recruiter signal.",
    },
    {
      label: "Active surface",
      value: "Home, Projects, Tracker, and admin foundations.",
    },
    {
      label: "Source",
      value: "Manual current-state signal.",
    },
  ],
} as const;

export const aboutPreview = {
  eyebrow: "Origin Signal",
  title: "A builder arc shaped by movement, pressure, and systems.",
  body:
    "From Saudi to Austin to UTD, with competitive tennis shaping the discipline underneath the work. The throughline is building: software, systems, interfaces, and operating layers that turn ambition into something concrete.",
  cta: {
    label: "Read About",
    href: "/about",
  },
  path: ["Saudi", "Austin", "Tennis", "UTD", "Building"],
} as const;

export const opportunityPreview = {
  eyebrow: "Inbound Paths",
  title: "Two ways to work with the system.",
  services: {
    title: "Services",
    description:
      "Scoped build requests for people who need something designed, built, automated, or shipped.",
    href: "/services",
    cta: "Explore Services",
  },
  collaborate: {
    title: "Collaborate",
    description:
      "Aligned opportunities with founders, builders, creators, startups, and serious people.",
    href: "/collaborate",
    cta: "Start a Collaboration",
  },
} as const;

export const finalCta = {
  eyebrow: "Open Channel",
  title: "If there is gravity here, reach out.",
  body:
    "Use the contact route for aligned opportunities, serious builds, and useful conversations.",
  cta: {
    label: "Get in Touch",
    href: "/contact",
  },
} as const;
