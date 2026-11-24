import type { ReactNode } from "react";
import { Link } from "react-router";

import Prose from "~/components/Prose/Prose";
import Tabs from "~/components/Tabs/Tabs";
import {
  describeContributions,
  formatContributionDate,
  getLinkLabel,
  OPEN_SOURCE_PATH,
  type UpstreamProject,
} from "~/projects/open-source";
import {
  getProjectPath,
  STATUS_LABELS,
  type Project,
  type ProjectStatus,
  type ProjectSummary,
} from "~/projects/projects";
import "./Projects.css";

type ProjectsProps = {
  // What the Projects routes loaded: the cards (`/projects`), the open-source contributions
  // (`/projects/open-source`), one project (`/projects/<slug>`), or one that doesn't exist.
  data: unknown;
};

const PROJECTS_TABS = [
  { title: "Projects", path: "/projects" },
  { title: "Open source", path: OPEN_SOURCE_PATH },
];

function isListPage(data: unknown): data is { projects: ProjectSummary[] } {
  return typeof data === "object" && data !== null && "projects" in data;
}

function isOpenSourcePage(data: unknown): data is { openSource: UpstreamProject[] } {
  return typeof data === "object" && data !== null && "openSource" in data;
}

function isProjectPage(data: unknown): data is { project: Project } {
  return typeof data === "object" && data !== null && "project" in data;
}

function isMissingProject(data: unknown): boolean {
  return typeof data === "object" && data !== null && "missing" in data;
}

// Where the code is, as a button says it.
function getRepoLabel(repo: string): string {
  const host = new URL(repo).hostname;
  if (host === "github.com") return "Code on GitHub";
  if (host === "gitlab.com") return "Code on GitLab";
  return "Code";
}

function ProjectFacts({ years, status, tech }: Pick<ProjectSummary, "years" | "status" | "tech">) {
  return (
    <div className="projects__facts">
      <span className="projects__years">{years}</span>
      <StatusBadge status={status} />
      <ul className="projects__tech" aria-label="Built with">
        {tech.map((name) => (
          <li key={name} className="projects__tag">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`projects__status projects__status--${status}`}>{STATUS_LABELS[status]}</span>;
}

// A card: its picture (or, without one, what it's built with in large type), title, line and facts. The title's
// link covers the whole card.
function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <li className="projects__card">
      {project.image ? (
        <img className="projects__image" src={project.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="projects__image projects__image--plain" aria-hidden="true">
          {project.tech[0]}
        </span>
      )}
      <div className="projects__body">
        <h2 className="projects__title">
          <Link className="projects__link" to={getProjectPath(project.slug)}>
            {project.title}
          </Link>
        </h2>
        <p className="projects__summary">{project.summary}</p>
        <ProjectFacts years={project.years} status={project.status} tech={project.tech} />
      </div>
    </li>
  );
}

function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return <p className="projects__empty">No projects yet.</p>;
  }

  return (
    <ul className="projects">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </ul>
  );
}

// The window's two pages, under its tabs.
function TabPage({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="projects-page">
      <Tabs label="Projects" tabs={PROJECTS_TABS} current={current} />
      {children}
    </div>
  );
}

// Each upstream project once, with what it is, and its contributions newest first.
function OpenSource({ projects }: { projects: UpstreamProject[] }) {
  if (projects.length === 0) {
    return <p className="projects__empty">No contributions yet.</p>;
  }

  return (
    <div className="open-source">
      <p className="open-source__count">{describeContributions(projects)}</p>
      {projects.map((project) => (
        <section key={project.name} className="open-source__project" aria-label={project.name}>
          <h2 className="open-source__name">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
          </h2>
          <p className="open-source__about">{project.about}</p>
          <ul className="open-source__list">
            {project.contributions.map((contribution) => (
              <li key={contribution.link} className="open-source__item">
                <span className="open-source__summary">{contribution.summary}</span>
                <span className="open-source__meta">
                  <time dateTime={contribution.date}>{formatContributionDate(contribution.date)}</time>
                  {" · "}
                  <a href={contribution.link} target="_blank" rel="noopener noreferrer">
                    {getLinkLabel(contribution.link)}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function BackLink() {
  return (
    <Link className="projects__back" to="/projects">
      ← All projects
    </Link>
  );
}

function ProjectPage({ project }: { project: Project }) {
  return (
    <article className="project">
      <BackLink />
      <h1 className="project__title">{project.title}</h1>
      <p className="project__summary">{project.summary}</p>
      <div className="project__bar">
        <ProjectFacts years={project.years} status={project.status} tech={project.tech} />
        <a className="project__repo" href={project.repo} target="_blank" rel="noopener noreferrer">
          {getRepoLabel(project.repo)}
        </a>
      </div>
      <Prose className="project__body" html={project.html} />
    </article>
  );
}

// The Projects window: the cards or the open-source contributions, under tabs, or one project's page.
function Projects({ data }: ProjectsProps) {
  if (isProjectPage(data)) {
    return <ProjectPage project={data.project} />;
  }
  if (isListPage(data)) {
    return (
      <TabPage current="/projects">
        <ProjectList projects={data.projects} />
      </TabPage>
    );
  }
  if (isOpenSourcePage(data)) {
    return (
      <TabPage current={OPEN_SOURCE_PATH}>
        <OpenSource projects={data.openSource} />
      </TabPage>
    );
  }
  if (isMissingProject(data)) {
    return (
      <div className="project">
        <BackLink />
        <p className="projects__empty">This project doesn't exist, or it has moved.</p>
      </div>
    );
  }

  return <p className="projects__empty">Loading…</p>;
}

export default Projects;
