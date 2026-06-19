import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectsArchive } from "@/features/projects/ProjectsArchive";
import { RandomProjectButton } from "@/features/projects/RandomProjectButton";
import {
  getAllProjects,
  getFeaturedProjects,
  getPublishedProjects,
  getRandomizerPool,
} from "@/lib/projects";

export function ProjectsPage() {
  const allProjects = getAllProjects();
  const publishedProjects = getPublishedProjects();
  const featuredProjects = getFeaturedProjects();
  const randomizerPool = getRandomizerPool();

  return (
    <main className="internal-page projects-page">
      <PageHero
        eyebrow="BUILD ARCHIVE"
        title="Projects"
        description="Systems, products, experiments, and technical surfaces I have built or am actively shaping."
        status="Typed archive"
        meta={["Flagship systems", "Local data", "Evidence first"]}
      >
        <div className="projects-hero-panel">
          <p className="text-mono-label">Discovery Control</p>
          <h2 className="text-card-title">Enter the archive through orbit.</h2>
          <p className="text-caption">
            Random discovery uses the eligible published pool from the local
            project model.
          </p>
          <RandomProjectButton projects={randomizerPool} />
          <div className="projects-hero-stats" aria-label="Project archive summary">
            <span>
              <strong>{featuredProjects.length}</strong>
              Featured
            </span>
            <span>
              <strong>{publishedProjects.length}</strong>
              Published
            </span>
            <span>
              <strong>{allProjects.length}</strong>
              Local records
            </span>
          </div>
        </div>
      </PageHero>

      <SectionShell
        id="featured-projects"
        variant="wide"
        eyebrow="Featured Work"
        title="Flagship systems with the strongest signal."
        description="A focused read on the builds that currently anchor the project universe."
        headerAction={<StatusBadge tone="active">Hierarchy matters</StatusBadge>}
      >
        <div className="projects-featured-grid">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.07} variant="scale-soft">
              <ProjectCard project={project} variant="featured" index={index} />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="project-archive"
        variant="wide"
        eyebrow="Project Index"
        title="A searchable archive with honest boundaries."
        description="Filter the local project archive by hierarchy, state, and system category. Draft and needs-review work stays labeled honestly."
      >
        <ProjectsArchive projects={allProjects} />
      </SectionShell>

      <SectionShell id="project-discovery" variant="compact">
        <div className="projects-discovery-panel">
          <div className="stack-sm">
            <p className="text-mono-label">Randomizer Model</p>
            <h2 className="text-section-title text-balance">
              Discovery is constrained by published eligibility.
            </h2>
            <p className="text-body-large">
              The random project control only draws from projects marked as
              eligible in the local model. Hidden and draft records are kept out
              of that orbit.
            </p>
          </div>
          <div className="projects-discovery-actions">
            <RandomProjectButton projects={randomizerPool} label="Pick a Build" />
            <TelemetryCard
              label="Randomizer pool"
              value={String(randomizerPool.length)}
              description="Eligible published records available for random discovery."
              source="Local data"
              tone="active"
            />
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
