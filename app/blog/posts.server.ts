import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { Marked, Renderer, type Tokens } from "marked";
import { parse as parseYaml } from "yaml";

import type { Post } from "./posts";

// Read at build time only: loaders and the pre-render list run in Node, so none of this reaches the browser.
const POSTS_DIR = path.resolve("content/blog");
// Where the site's static files are, so a post's images can be checked before the build ships it.
const PUBLIC_DIR = path.resolve("public");

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

// Only used to resolve image paths; any origin would do.
const SITE = "https://site.invalid";

const markdown = new Marked({
  renderer: {
    // Links out of the site open in a new tab, so the desktop stays where it was.
    link(token) {
      const html = Renderer.prototype.link.call(this, token);
      return /^https?:\/\//.test(token.href)
        ? html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
        : html;
    },
  },
});

// A post's own images are in `public/blog/<slug>/` and written by file name (`photo.jpg`), which becomes
// `/blog/<slug>/photo.jpg`. Paths from the site root stay as they are; images elsewhere on the web give null.
function resolveImage(href: string, slug: string): URL | null {
  const url = new URL(href, `${SITE}/blog/${slug}/`);
  return url.origin === SITE ? url : null;
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

// YAML front matter between `---` lines, then Markdown. Anything missing or malformed throws, so a broken
// post fails the build instead of going out half empty.
export function parsePost(slug: string, source: string, publicDir = PUBLIC_DIR): Post {
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

  const tokens = markdown.lexer(source.slice(match[0].length));
  markdown.walkTokens(tokens, (token) => {
    if (token.type !== "image") {
      return;
    }

    const image = token as Tokens.Image;
    const url = resolveImage(image.href, slug);
    if (!url) {
      return;
    }

    const file = decodeURIComponent(url.pathname);
    if (!existsSync(path.join(publicDir, file))) {
      throw fail(`image "${image.href}" not found (looked for public${file})`);
    }
    image.href = url.pathname + url.search + url.hash;
  });

  const html = markdown.parser(tokens);
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
