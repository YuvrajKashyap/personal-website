import { siteConfig } from "@/config/site";

type HeroActionIconName =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "github"
  | "grok"
  | "instagram"
  | "linkedin"
  | "resume"
  | "x"
  | "youtube";

type HeroAction = Readonly<{
  id: string;
  label: string;
  href: string;
  icon: HeroActionIconName;
  group: "ai" | "reach-out";
  external?: true;
  openInNewTab?: true;
  ariaLabel: string;
}>;

const aiContextHref = `${siteConfig.url}/ai/yuvraj-kashyap-recruiter-brief.md`;

const aiBriefPrompt = [
  "You are helping a recruiter or serious collaborator understand Yuvraj Kashyap.",
  `First read this public briefing: ${aiContextHref}.`,
  `Then inspect the public site at ${siteConfig.url}, especially /about, /experience, /projects, /tracker, /services, /collaborate, and /contact.`,
  "Summarize his builder identity, background, strongest software and AI systems signal, project themes, current focus, and useful interview questions.",
  "Use public evidence only. Do not invent credentials, employers, metrics, awards, GPA, roles, adoption, revenue, or private details.",
  "If browsing is unavailable, ask the visitor to paste the briefing file before answering.",
].join(" ");

const chatGptHref = `https://chatgpt.com/?${new URLSearchParams({
  hints: "search",
  q: aiBriefPrompt,
  "temporary-chat": "true",
}).toString()}`;

const claudeHref = `https://claude.ai/new?${new URLSearchParams({
  q: aiBriefPrompt,
}).toString()}`;

const geminiHref = `https://gemini.google.com/app?${new URLSearchParams({
  q: aiBriefPrompt,
}).toString()}`;

const grokHref = `https://grok.com/?${new URLSearchParams({
  q: aiBriefPrompt,
}).toString()}`;

const socialIconByLabel: Record<string, HeroActionIconName> = {
  GitHub: "github",
  Instagram: "instagram",
  LinkedIn: "linkedin",
  X: "x",
  YouTube: "youtube",
};

const reachOutSocialOrder = ["GitHub", "LinkedIn", "X", "YouTube", "Instagram"];

const aiActions = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    href: chatGptHref,
    icon: "chatgpt",
    group: "ai",
    external: true,
    ariaLabel: "Ask ChatGPT about Yuvraj Kashyap",
  },
  {
    id: "claude",
    label: "Claude",
    href: claudeHref,
    icon: "claude",
    group: "ai",
    external: true,
    ariaLabel: "Ask Claude about Yuvraj Kashyap",
  },
  {
    id: "gemini",
    label: "Gemini",
    href: geminiHref,
    icon: "gemini",
    group: "ai",
    external: true,
    ariaLabel: "Ask Gemini about Yuvraj Kashyap",
  },
  {
    id: "grok",
    label: "Grok",
    href: grokHref,
    icon: "grok",
    group: "ai",
    external: true,
    ariaLabel: "Ask Grok about Yuvraj Kashyap",
  },
] satisfies HeroAction[];

function getReachOutActions(): HeroAction[] {
  const socialActions = reachOutSocialOrder.flatMap<HeroAction>((label) => {
    const link = siteConfig.socialLinks.find((item) => item.label === label);

    return link
      ? [
          {
            id: link.label.toLowerCase(),
            label: link.label,
            href: link.href,
            icon: socialIconByLabel[link.label] ?? "github",
            group: "reach-out",
            external: link.external,
            ariaLabel: `Open ${link.label}`,
          },
        ]
      : [];
  });

  return [
    {
      id: "resume",
      label: siteConfig.resume.label,
      href: siteConfig.resume.href,
      icon: "resume",
      group: "reach-out",
      openInNewTab: true,
      ariaLabel: "Open Yuvraj Kashyap resume in a new tab",
    },
    ...socialActions,
  ] satisfies HeroAction[];
}

function HeroActionIcon({ icon }: Readonly<{ icon: HeroActionIconName }>) {
  switch (icon) {
    case "chatgpt":
    case "claude":
    case "gemini":
    case "grok":
      return (
        <span
          aria-hidden="true"
          className={`hero-action-logo hero-action-logo-${icon}`}
        />
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="currentColor"
            d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.82 1.31 3.51 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.48c1.02 0 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            d="M7.4 2.9h9.2a4.5 4.5 0 0 1 4.5 4.5v9.2a4.5 4.5 0 0 1-4.5 4.5H7.4a4.5 4.5 0 0 1-4.5-4.5V7.4a4.5 4.5 0 0 1 4.5-4.5Z"
          />
          <circle
            cx="12"
            cy="12"
            r="3.7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          />
          <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.34V8.98h3.42v1.57h.05a3.75 3.75 0 0 1 3.37-1.85c3.61 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z"
          />
        </svg>
      );
    case "resume":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
            d="M6.5 2.8h7.3l3.7 3.8v14.6h-11V2.8Zm7 0v4.1h4M8.8 11.1h6.4M8.8 14.6h6.4M8.8 18.1h4.1"
          />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="currentColor"
            d="M18.9 2.25h3.28l-7.17 8.2 8.44 11.3h-6.61l-5.18-6.86-5.93 6.86H2.44l7.67-8.87L2.02 2.25h6.78l4.68 6.25 5.42-6.25Zm-1.15 17.51h1.82L7.8 4.13H5.84l11.91 15.63Z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="currentColor"
            d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.58 12 3.58 12 3.58s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31.28 31.28 0 0 0 0 12a31.28 31.28 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.28 31.28 0 0 0 24 12a31.28 31.28 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.87 12 9.6 15.57Z"
          />
        </svg>
      );
  }
}

function HeroActionButton({ action }: Readonly<{ action: HeroAction }>) {
  const opensInNewTab = action.external || action.openInNewTab;

  return (
    <a
      href={action.href}
      aria-label={action.ariaLabel}
      className={`hero-action-button hero-action-button-${action.group} hero-action-button-${action.id} focus-ring`}
      target={opensInNewTab ? "_blank" : undefined}
      rel={opensInNewTab ? "noreferrer" : undefined}
    >
      <span className="hero-action-icon-shell" aria-hidden="true">
        <HeroActionIcon icon={action.icon} />
      </span>
      <span className="hero-action-label">{action.label}</span>
    </a>
  );
}

export function HeroActionLinks() {
  const reachOutActions = getReachOutActions();

  return (
    <div className="hero-action-list" aria-label="Primary external links">
      <div className="hero-action-row" aria-label="Reach out links">
        {reachOutActions.map((action) => (
          <HeroActionButton action={action} key={action.id} />
        ))}
      </div>
      <div className="hero-action-row hero-action-row-ai" aria-label="Ask AI links">
        {aiActions.map((action) => (
          <HeroActionButton action={action} key={action.id} />
        ))}
      </div>
    </div>
  );
}
