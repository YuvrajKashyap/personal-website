export const adminStatusCards = [
  {
    label: "Auth",
    title: "Supabase Auth",
    description: "Magic-link authentication is wired through Supabase SSR.",
  },
  {
    label: "Guard",
    title: "Server protected",
    description:
      "Admin access is checked server-side with verified claims and admin_users.",
  },
  {
    label: "Scope",
    title: "Read-only foundation",
    description:
      "Content editing and submissions management are intentionally not built.",
  },
] as const;

type FutureAdminArea = Readonly<{
  title: string;
  description: string;
  previewHref?: string;
}>;

export const futureAdminAreas: readonly FutureAdminArea[] = [
  {
    title: "Projects",
    description: "Future management surface for approved project records.",
    previewHref: "/projects",
  },
  {
    title: "About",
    description: "Future management surface for structured About content.",
    previewHref: "/about",
  },
  {
    title: "Experience",
    description: "Future management surface for trajectory and proof content.",
    previewHref: "/experience",
  },
  {
    title: "Tracker",
    description: "Future management surface for manual current-state signal.",
    previewHref: "/tracker",
  },
  {
    title: "Services",
    description: "Future management surface for scoped build request content.",
    previewHref: "/services",
  },
  {
    title: "Collaborate",
    description:
      "Future management surface for broader aligned opportunity content.",
    previewHref: "/collaborate",
  },
  {
    title: "Contact",
    description: "Future management surface for verified channel guidance.",
    previewHref: "/contact",
  },
  {
    title: "Submissions",
    description:
      "Future private inbox for validated Contact, Services, and Collaborate submissions.",
  },
  {
    title: "Site Settings",
    description:
      "Future management surface for public site settings and safe metadata.",
  },
];

export const adminSetupSteps = [
  "Create or select the Supabase project.",
  "Apply the local migrations from the Supabase runbook.",
  "Add public Supabase env values outside Git.",
  "Create the Supabase Auth user manually.",
  "Insert the matching active admin_users row manually.",
  "Use the magic-link login from this admin entry.",
] as const;
