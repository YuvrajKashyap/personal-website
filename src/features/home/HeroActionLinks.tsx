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
  download?: string;
  ariaLabel: string;
}>;

const aiBriefPrompt = [
  "Give a recruiter a concise, evidence-backed briefing on Yuvraj Kashyap.",
  "Use public sources first: yuvrajkashyap.com, github.com/YuvrajKashyap, and linkedin.com/in/yuvraj-kashyap.",
  "Summarize his builder identity, strongest software and AI systems signal, project themes, current focus, and useful interview questions.",
  "Do not invent credentials, employers, metrics, awards, or claims that are not publicly verified.",
].join(" ");

const chatGptHref = `https://chatgpt.com/?${new URLSearchParams({
  hints: "search",
  q: aiBriefPrompt,
  "temporary-chat": "true",
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
    href: "https://claude.ai/",
    icon: "claude",
    group: "ai",
    external: true,
    ariaLabel: "Ask Claude about Yuvraj Kashyap",
  },
  {
    id: "gemini",
    label: "Gemini",
    href: "https://gemini.google.com/",
    icon: "gemini",
    group: "ai",
    external: true,
    ariaLabel: "Ask Gemini about Yuvraj Kashyap",
  },
  {
    id: "grok",
    label: "Grok",
    href: "https://grok.com/",
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
      download: siteConfig.resume.download,
      ariaLabel: "Download Yuvraj Kashyap resume",
    },
    ...socialActions,
  ] satisfies HeroAction[];
}

function HeroActionIcon({ icon }: Readonly<{ icon: HeroActionIconName }>) {
  switch (icon) {
    case "chatgpt":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.55"
            d="M8.15 4.33a4.33 4.33 0 0 1 7.38-.86 4.33 4.33 0 0 1 5.02 5.78 4.33 4.33 0 0 1-2.34 7.16 4.33 4.33 0 0 1-7.39 3.11 4.33 4.33 0 0 1-5.47-5.25 4.33 4.33 0 0 1 .7-7.66 4.3 4.3 0 0 1 2.1-2.28Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.55"
            d="m8.2 4.35 3.78 2.18 3.55-2.05M5.35 14.27l3.75-2.17V7.85m1.72 11.67v-4.31l-3.62-2.09m10.99 3.29-3.7-2.14-3.67 2.12m9.73-7.14-3.74 2.16v4.18m-1.28-11.11v4.3l3.67 2.12M9.1 7.85l3.78 2.18 3.93-2.25M9.1 12.1l3.78-2.07 3.93 2.25m-5.99 2.93v-4.34"
          />
        </svg>
      );
    case "claude":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="currentColor"
            d="M11.98 2.35 14.76 8l6.24.9-4.51 4.39 1.06 6.2-5.57-2.93-5.57 2.93 1.06-6.2L2.96 8.9 9.2 8l2.78-5.65Z"
          />
          <circle cx="12" cy="12" r="2.15" fill="currentColor" opacity="0.36" />
        </svg>
      );
    case "gemini":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="currentColor"
            d="M12 1.85c.73 4.94 3.21 8.42 8.15 9.15-4.94.73-7.42 4.21-8.15 9.15-.73-4.94-3.21-8.42-8.15-9.15 4.94-.73 7.42-4.21 8.15-9.15Z"
          />
          <path
            fill="currentColor"
            d="M18.1 2.85c.34 2.28 1.49 3.89 3.78 4.22-2.29.34-3.44 1.95-3.78 4.23-.34-2.28-1.48-3.89-3.77-4.23 2.29-.33 3.43-1.94 3.77-4.22Z"
            opacity="0.58"
          />
        </svg>
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
    case "grok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="hero-action-icon">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6.7 7.05a7.2 7.2 0 0 1 10.1.13 7.02 7.02 0 0 1 .38 9.52 6.56 6.56 0 0 1-5.07 2.3 6.03 6.03 0 0 1-5.92-5.93 5.5 5.5 0 0 1 5.52-5.49h4.98"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="m15.4 4.15 3.05 3.03-3.05 3.03"
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
          <circle cx="12" cy="12" r="3.7" fill="none" stroke="currentColor" strokeWidth="1.9" />
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
  return (
    <a
      href={action.href}
      aria-label={action.ariaLabel}
      className={`hero-action-button hero-action-button-${action.group} focus-ring`}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noreferrer" : undefined}
      download={action.download}
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
