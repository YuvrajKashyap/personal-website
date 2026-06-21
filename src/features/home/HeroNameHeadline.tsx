import { homeContent } from "@/features/home/home-content";

type HeroNameHeadlineProps = {
  className?: string;
};

export function HeroNameHeadline({ className }: HeroNameHeadlineProps) {
  return (
    <h1
      aria-label={homeContent.headline.label}
      className={`hero-name-lockup${className ? ` ${className}` : ""}`}
    >
      <span className="visually-hidden">{homeContent.headline.label}</span>
      {homeContent.headline.lines.map((line, index) => (
        <span
          aria-hidden="true"
          className={`hero-name-line${index === 1 ? " hero-name-line-offset" : ""}`}
          key={line}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
