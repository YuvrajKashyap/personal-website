import { siteConfig } from "@/config/site";

export type ContactChannel = Readonly<{
  id: string;
  label: string;
  href: string;
  detail: string;
  external: boolean;
}>;

export const contactHero = {
  eyebrow: "CONTACT",
  title: "Open a direct channel.",
  description:
    "Scoped builds, collaborations, or a serious conversation. Send context through the form or reach out on a public channel.",
} as const;

export const contactChannels = siteConfig.socialLinks.map((link) => ({
  id: link.label.toLowerCase(),
  label: link.label,
  href: link.href,
  detail:
    link.label === "GitHub"
      ? "Code and project signal"
      : link.label === "LinkedIn"
        ? "Professional profile"
        : link.label === "X"
          ? "Thinking out loud"
          : link.label === "YouTube"
            ? "Builds in motion"
            : "Off the clock",
  external: link.external,
})) satisfies readonly ContactChannel[];

export const messageGuidance = [
  "Who you are and what this is about",
  "Why it might fit the way I build",
  "Links or public context that sharpen it",
] as const;
