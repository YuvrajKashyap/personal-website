import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { TelemetryCard } from "@/components/ui/TelemetryCard";

export default function TrackerPage() {
  return (
    <main className="internal-page">
      <PageHero
        eyebrow="Tracker"
        title="Tracker"
        description="Current focus, routine, metrics, and execution signal will be organized here without fake live data."
        status="Template ready"
        meta={["Manual signal", "No live metrics yet"]}
      />
      <SectionShell
        id="tracker-template-preview"
        eyebrow="Signal Framework"
        title="Prepared for real operating data"
        description="Tracker surfaces must label their source clearly so manual notes never look like automated telemetry."
      >
        <div className="responsive-grid">
          <TelemetryCard
            label="Focus"
            value="Manual"
            source="Placeholder"
            tone="active"
            description="A future slot for current focus once the real content source exists."
          />
          <TelemetryCard
            label="Routine"
            value="Pending"
            source="Placeholder"
            description="A future slot for routine signal without implying live tracking."
          />
          <TelemetryCard
            label="Metrics"
            value="Not live"
            source="No backend"
            tone="muted"
            description="No fake numbers or automatic metrics are published in this template step."
          />
        </div>
      </SectionShell>
      <SectionShell variant="compact">
        <EmptyState
          eyebrow="Content Boundary"
          title="Full tracker data comes later."
          description="This route now has the right shell, not the final operating dashboard."
        />
      </SectionShell>
    </main>
  );
}
