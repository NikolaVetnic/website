import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { isText, PUBLIC_DIR, renderMarkdown, splitFrontMatter } from "../content/markdown.server";
import { PROJECT_STATUSES, type Project, type ProjectStatus } from "./projects";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
const PROJECTS_DIR = path.resolve("content/projects");

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YEARS = /^\d{4}(?:–\d{4})?$/;

// YAML front matter (`title`, `summary`, `years`, `status`, `tech`, `repo`, optional `image`), then Markdown.
// Anything missing or malformed throws, so the build fails with the project's name.
export function parseProject(slug: string, source: string, publicDir = PUBLIC_DIR): Project {
  const fail = (problem: string) => new Error(`Project "${slug}": ${problem}`);

  if (!SLUG.test(slug)) {
    throw fail("the file name must be lowercase letters and digits joined by hyphens");
  }

  const { data, body } = splitFrontMatter(source, fail);
  const { title, summary, years, status, tech, repo, image } = data;
  if (!isText(title)) {
    throw fail("`title` missing");
  }
  if (!isText(summary)) {
    throw fail("`summary` missing");
  }
  const yearsText = typeof years === "number" ? String(years) : years;
  if (typeof yearsText !== "string" || !YEARS.test(yearsText)) {
    throw fail("`years` must be a year (2021) or two joined by an en dash (2020–2021)");
  }
  if (typeof status !== "string" || !(PROJECT_STATUSES as readonly string[]).includes(status)) {
    throw fail(`\`status\` must be one of ${PROJECT_STATUSES.join(", ")}`);
  }
  if (!Array.isArray(tech) || tech.length === 0 || !tech.every(isText)) {
    throw fail("`tech` must be a list of what it's built with");
  }
  if (!isText(repo) || !/^https:\/\//.test(repo)) {
    throw fail("`repo` must be an https:// link");
  }

  // A project's own images are in `public/projects/<slug>/`, the card's too.
  const imageBase = `/projects/${slug}/`;
  let cardImage: string | undefined;
  if (image !== undefined) {
    if (!isText(image) || image.includes("/")) {
      throw fail("`image` must be a file name in public/projects/<slug>/");
    }
    if (!existsSync(path.join(publicDir, imageBase, image))) {
      throw fail(`image "${image}" not found (looked for public${imageBase}${image})`);
    }
    cardImage = imageBase + image;
  }

  const html = renderMarkdown(body, { imageBase, publicDir, fail });
  return {
    slug,
    title,
    summary,
    years: yearsText,
    status: status as ProjectStatus,
    tech,
    repo,
    ...(cardImage ? { image: cardImage } : {}),
    html,
  };
}

// The last year a project was worked on, for the order.
function lastYear(years: string): number {
  return Number(years.slice(-4));
}

// The most recent first; projects of the same year by title, so the order never depends on the file system.
export function getProjects(dir = PROJECTS_DIR, publicDir = PUBLIC_DIR): Project[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseProject(file.slice(0, -3), readFileSync(path.join(dir, file), "utf8"), publicDir))
    .sort((a, b) => lastYear(b.years) - lastYear(a.years) || a.title.localeCompare(b.title));
}
