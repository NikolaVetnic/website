import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { isText, PUBLIC_DIR, renderMarkdown, splitFrontMatter } from "../content/markdown.server";
import { MUSIC_KINDS, MUSIC_TABS, toMusicSummary, type MusicEntry, type MusicKind, type MusicLink } from "./music";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
const MUSIC_DIR = path.resolve("content/music");

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YEARS = /^\d{4}(?:–\d{4})?$/;

// The tabs' own paths under /music, which no entry can take.
const TAB_SLUGS = MUSIC_TABS.map((tab) => tab.path.split("/")[2]).filter(Boolean);

function parseLinks(links: unknown, fail: (problem: string) => Error): MusicLink[] {
  if (links === undefined) {
    return [];
  }
  if (
    !Array.isArray(links) ||
    !links.every(
      (link: unknown) =>
        typeof link === "object" &&
        link !== null &&
        isText((link as MusicLink).name) &&
        isText((link as MusicLink).url) &&
        /^https:\/\//.test((link as MusicLink).url),
    )
  ) {
    throw fail("`links` must be a list of `name` and `url` (an https:// link)");
  }
  return (links as MusicLink[]).map(({ name, url }) => ({ name, url }));
}

// YAML front matter (`title`, `kind`, `summary`, `years`, optional `scoring`, `role`, `image` and `links`), then
// Markdown. Anything missing or malformed throws, so the build fails with the entry's name.
export function parseMusic(slug: string, source: string, publicDir = PUBLIC_DIR): MusicEntry {
  const fail = (problem: string) => new Error(`Music "${slug}": ${problem}`);

  if (!SLUG.test(slug)) {
    throw fail("the file name must be lowercase letters and digits joined by hyphens");
  }
  if (TAB_SLUGS.includes(slug)) {
    throw fail(`\`${slug}\` is taken: /music/${slug} is a tab`);
  }

  const { data, body } = splitFrontMatter(source, fail);
  const { title, kind, summary, years, scoring, role, image, links } = data;
  if (!isText(title)) {
    throw fail("`title` missing");
  }
  if (typeof kind !== "string" || !(MUSIC_KINDS as readonly string[]).includes(kind)) {
    throw fail(`\`kind\` must be one of ${MUSIC_KINDS.join(", ")}`);
  }
  if (!isText(summary)) {
    throw fail("`summary` missing");
  }
  const yearsText = typeof years === "number" ? String(years) : years;
  if (typeof yearsText !== "string" || !YEARS.test(yearsText)) {
    throw fail("`years` must be a year (2014) or two joined by an en dash (2008–2019)");
  }
  if (scoring !== undefined && !isText(scoring)) {
    throw fail("`scoring` must be text: what the piece is written for");
  }
  if (role !== undefined && !isText(role)) {
    throw fail("`role` must be text: what you did");
  }

  // An entry's own images are in `public/music/<slug>/`, the card's too.
  const imageBase = `/music/${slug}/`;
  let cardImage: string | undefined;
  if (image !== undefined) {
    if (!isText(image) || image.includes("/")) {
      throw fail("`image` must be a file name in public/music/<slug>/");
    }
    if (!existsSync(path.join(publicDir, imageBase, image))) {
      throw fail(`image "${image}" not found (looked for public${imageBase}${image})`);
    }
    cardImage = imageBase + image;
  }

  return {
    slug,
    kind: kind as MusicKind,
    title,
    summary,
    years: yearsText,
    ...(scoring ? { scoring } : {}),
    ...(role ? { role } : {}),
    ...(cardImage ? { image: cardImage } : {}),
    links: parseLinks(links, fail),
    html: renderMarkdown(body, { imageBase, publicDir, fail }),
  };
}

// The last year of an entry, for the order.
function lastYear(years: string): number {
  return Number(years.slice(-4));
}

// The most recent first; entries of the same year by title, so the order never depends on the file system.
export function getMusic(dir = MUSIC_DIR, publicDir = PUBLIC_DIR): MusicEntry[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseMusic(file.slice(0, -3), readFileSync(path.join(dir, file), "utf8"), publicDir))
    .sort((a, b) => lastYear(b.years) - lastYear(a.years) || a.title.localeCompare(b.title));
}

// What a tab's route loads: its kind, and its entries' cards.
export function getMusicTabData(kind: MusicKind, dir = MUSIC_DIR, publicDir = PUBLIC_DIR) {
  return {
    musicKind: kind,
    entries: getMusic(dir, publicDir)
      .filter((entry) => entry.kind === kind)
      .map(toMusicSummary),
  };
}
