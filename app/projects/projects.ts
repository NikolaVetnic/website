export const PROJECT_STATUSES = ["finished", "in-progress"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatus, string> = { finished: "Finished", "in-progress": "In progress" };

export type ProjectSummary = {
  slug: string;
  title: string;
  // One line, for the card and for search engines.
  summary: string;
  // When it was worked on, as it reads: `2021`, `2020–2021`.
  years: string;
  status: ProjectStatus;
  tech: string[];
  // Where its code is, an https:// link.
  repo: string;
  // The card's picture, from the site root (`/projects/<slug>/card.webp`), if it has one.
  image?: string;
};

export type Project = ProjectSummary & {
  // Rendered from Markdown at build time.
  html: string;
};

export function getProjectPath(slug: string): string {
  return `/projects/${slug}`;
}

export function toProjectSummary({ slug, title, summary, years, status, tech, repo, image }: Project): ProjectSummary {
  return { slug, title, summary, years, status, tech, repo, ...(image ? { image } : {}) };
}
