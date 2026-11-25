import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { toSummary } from "../blog/posts";
import { getPosts } from "../blog/posts.server";
import { isText, PUBLIC_DIR, splitFrontMatter } from "../content/markdown.server";
import type { DesktopWidgets, Featured } from "./widgets";

// Read at build time only, by the Vite plugin that makes `virtual:desktop-widgets`, so none of this reaches the
// browser. Relative imports: the plugin runs from vite.config.ts, outside the app's `~` alias.
export const FEATURED_FILE = path.resolve("content/featured.md");
export const POSTS_DIR = path.resolve("content/blog");

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Front matter only: `title`, `text`, `date`, `link`, optional `label` and `image`. Anything missing or malformed
// throws, so the build fails instead of showing a broken card.
export function parseFeatured(source: string, publicDir = PUBLIC_DIR): Featured {
  const fail = (problem: string) => new Error(`content/featured.md: ${problem}`);
  const { data } = splitFrontMatter(source, fail);
  const { title, text, date, link, label = "Open", image } = data;

  if (!isText(title)) {
    throw fail("`title` missing");
  }
  if (!isText(text)) {
    throw fail("`text` missing");
  }
  if (typeof date !== "string" || !DATE.test(date)) {
    throw fail("`date` must be a day, YYYY-MM-DD");
  }
  if (!isText(link) || !/^(\/|https:\/\/)/.test(link)) {
    throw fail("`link` must be a page of the site (/music/…) or an https:// link");
  }
  if (!isText(label)) {
    throw fail("`label` must be text: what the button says");
  }
  if (image !== undefined) {
    if (!isText(image) || !image.startsWith("/")) {
      throw fail("`image` must be a file in public/, from the site root (/music/…/cover.webp)");
    }
    if (!existsSync(path.join(publicDir, image))) {
      throw fail(`image "${image}" not found (looked for public${image})`);
    }
  }

  return { title, text, date, link, label, ...(image ? { image } : {}) };
}

// The newest post, and the featured card if content/featured.md exists.
export function getDesktopWidgets(
  postsDir = POSTS_DIR,
  featuredFile = FEATURED_FILE,
  publicDir = PUBLIC_DIR,
): DesktopWidgets {
  const [latest] = getPosts(postsDir, publicDir);
  return {
    latestPost: latest ? toSummary(latest) : null,
    featured: existsSync(featuredFile) ? parseFeatured(readFileSync(featuredFile, "utf8"), publicDir) : null,
  };
}
