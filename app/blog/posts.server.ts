import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { Marked, Renderer } from "marked";
import { parse as parseYaml } from "yaml";

import type { Post } from "./posts";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
const POSTS_DIR = path.resolve("content/blog");

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

// Links out of the site open in a new tab, so the desktop stays where it was.
const markdown = new Marked({
  renderer: {
    link(token) {
      const html = Renderer.prototype.link.call(this, token);
      return /^https?:\/\//.test(token.href)
        ? html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
        : html;
    },
  },
});

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

// YAML front matter between `---` lines, then Markdown. Anything missing or malformed throws, so a broken
// post fails the build instead of going out half empty.
export function parsePost(slug: string, source: string): Post {
  const fail = (problem: string) => new Error(`Blog post "${slug}": ${problem}`);

  if (!SLUG.test(slug)) {
    throw fail("the file name must be lowercase letters and digits joined by hyphens");
  }

  const match = FRONT_MATTER.exec(source);
  if (!match) {
    throw fail("front matter missing (a `---` block at the top)");
  }

  const { title, date, summary, tags = [] } = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
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

  const html = markdown.parse(source.slice(match[0].length), { async: false });
  return { slug, title, date, summary, tags, html };
}

// Newest first; posts from the same day by slug, so the order never depends on the file system.
export function getPosts(dir = POSTS_DIR): Post[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parsePost(file.slice(0, -3), readFileSync(path.join(dir, file), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
