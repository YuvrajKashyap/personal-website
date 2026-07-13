import { PageHero } from "@/components/layout/PageHero";
import { SectionShell } from "@/components/layout/SectionShell";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { ProjectsArchive } from "@/features/projects/ProjectsArchive";
import { RandomProjectButton } from "@/features/projects/RandomProjectButton";
import {
  getAllProjectsData,
  getFeaturedProjectsData,
  getPublishedProjectsData,
  getRandomizerPoolData,
} from "@/lib/projects";

export async function ProjectsPage() {
  const [allProjects, publishedProjects, featuredProjects, randomizerPool] =
    await Promise.all([
      getAllProjectsData(),
      getPublishedProjectsData(),
      getFeaturedProjectsData(),
      getRandomizerPoolData(),
    ]);

  return (
    <main className="internal-page projects-page">
      <PageHero
        eyebrow="BUILD ARCHIVE"
        title="Projects"
        description="Systems, products, experiments, and technical surfaces I have built or am actively shaping."
      >
        <div className="projects-hero-panel">
          <p className="text-mono-label">Discovery</p>
          <RandomProjectButton projects={randomizerPool} label="Random orbit" />
          <div
            className="projects-hero-stats"
            aria-label="Project archive summary"
          >
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
              Records
            </span>
          </div>
        </div>
      </PageHero>

      <SectionShell
        id="featured-projects"
        variant="wide"
        eyebrow="Featured Work"
        title="The systems that anchor the archive."
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
        title="The full archive."
        description="Draft and needs-review work stays labeled honestly."
      >
        <ProjectsArchive projects={allProjects} />
      </SectionShell>
    </main>
  );
}
