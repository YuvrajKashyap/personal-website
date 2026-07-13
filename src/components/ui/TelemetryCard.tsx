"use client";

import { useSpotlight } from "@/lib/motion/useSpotlight";

export type TelemetryCardProps = Readonly<{
  label: string;
  value: string;
  description?: string;
  source?: string;
  tone?: "default" | "active" | "muted" | "warning";
  children?: React.ReactNode;
}>;

export function TelemetryCard({
  label,
  value,
  description,
  source,
  tone = "default",
  children,
}: TelemetryCardProps) {
  const spotlight = useSpotlight();

  return (
    <article
      className={`telemetry-card telemetry-card-${tone}`}
      onPointerMove={spotlight.onPointerMove}
      onPointerLeave={spotlight.onPointerLeave}
    >
      <div className="telemetry-card-header">
        <p className="text-mono-label">{label}</p>
        {source ? <span>{source}</span> : null}
      </div>
      <p className="telemetry-card-value">{value}</p>
      {description ? <p className="text-body">{description}</p> : null}
      {children ? <div className="telemetry-card-body">{children}</div> : null}
    </article>
  );
}
