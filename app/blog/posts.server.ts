import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { isText, PUBLIC_DIR, renderMarkdown, splitFrontMatter } from "../content/markdown.server";
import type { Post } from "./posts";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
const POSTS_DIR = path.resolve("content/blog");

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

// YAML front matter between `---` lines, then Markdown. Anything missing or malformed throws, so a broken
// post fails the build instead of going out half empty.
export function parsePost(slug: string, source: string, publicDir = PUBLIC_DIR): Post {
  const fail = (problem: string) => new Error(`Blog post "${slug}": ${problem}`);

  if (!SLUG.test(slug)) {
    throw fail("the file name must be lowercase letters and digits joined by hyphens");
  }

  const { data, body } = splitFrontMatter(source, fail);
  const { title, date, summary, tags = [] } = data;
  if (!isText(title)) {
    throw fail("`title` missing");
  }
  if (typeof date !== "string" || !DATE.test(date) || Number.isNaN(Date.parse(date))) {
    throw fail("`date` must be a day written as YYYY-MM-DD");
  }
  if (!isText(summary)) {
    throw fail("`summary` missing");
  }
  if (!Array.isArray(tags) || !tags.every(isText)) {
    throw fail("`tags` must be a list of words");
  }

  // A post's own images are in `public/blog/<slug>/`.
  const html = renderMarkdown(body, { imageBase: `/blog/${slug}/`, publicDir, fail });
  return { slug, title, date, summary, tags, html };
}

// Newest first; posts from the same day by slug, so the order never depends on the file system.
export function getPosts(dir = POSTS_DIR, publicDir = PUBLIC_DIR): Post[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parsePost(file.slice(0, -3), readFileSync(path.join(dir, file), "utf8"), publicDir))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
