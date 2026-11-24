import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { isText, PUBLIC_DIR, renderMarkdown, splitFrontMatter } from "../content/markdown.server";
import type { Game } from "./games";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
const GAMES_DIR = path.resolve("content/games");

const YEARS = /^\d{4}(?:–\d{4})?$/;

// YAML front matter (`title`, `summary`, `years`, `tech`, optional `repo`), then Markdown; images in
// `public/games/<slug>/`. Anything missing or malformed throws, so the build fails with the game's name.
export function parseGame(slug: string, source: string, publicDir = PUBLIC_DIR): Game {
  const fail = (problem: string) => new Error(`Game "${slug}": ${problem}`);

  const { data, body } = splitFrontMatter(source, fail);
  const { title, summary, years, tech, repo } = data;
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
  if (!Array.isArray(tech) || tech.length === 0 || !tech.every(isText)) {
    throw fail("`tech` must be a list of what it's built with");
  }
  if (repo !== undefined && (!isText(repo) || !/^https:\/\//.test(repo))) {
    throw fail("`repo` must be an https:// link");
  }

  return {
    slug,
    title,
    summary,
    years: yearsText,
    tech,
    ...(repo ? { repo } : {}),
    html: renderMarkdown(body, { imageBase: `/games/${slug}/`, publicDir, fail }),
  };
}

// Every game page, by its file name (`content/games/rogue-c.md` is `rogue-c`), which is its app's id.
export function getGames(dir = GAMES_DIR, publicDir = PUBLIC_DIR): Game[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => parseGame(file.slice(0, -3), readFileSync(path.join(dir, file), "utf8"), publicDir));
}
