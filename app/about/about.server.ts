import { readFileSync } from "node:fs";
import path from "node:path";

import { isText, PUBLIC_DIR, renderMarkdown, splitFrontMatter } from "~/content/markdown.server";
import type { AboutPage } from "./about";

const ABOUT_DIR = path.resolve("content/about");

// YAML front matter (`title`, optional `lang` and `pdf`), then Markdown. Anything missing or malformed throws,
// so the build fails with the page's name.
export function parseAboutPage(name: string, source: string, publicDir = PUBLIC_DIR): AboutPage {
  const fail = (problem: string) => new Error(`About page "${name}": ${problem}`);

  const { data, body } = splitFrontMatter(source, fail);
  const { title, lang = "en", pdf } = data;
  if (!isText(title)) {
    throw fail("`title` missing");
  }
  if (!isText(lang) || !/^[a-z]{2}$/.test(lang)) {
    throw fail("`lang` must be a two-letter language code");
  }
  if (pdf !== undefined && (!isText(pdf) || !/^https:\/\//.test(pdf))) {
    throw fail("`pdf` must be an https:// link");
  }

  // The pages' own images are in `public/about/`.
  const html = renderMarkdown(body, { imageBase: "/about/", publicDir, fail });
  return { title, lang, html, ...(pdf ? { pdf } : {}) };
}

// One of the pages in content/about, by file name; a missing file fails the build.
export function getAboutPage(name: string, dir = ABOUT_DIR, publicDir = PUBLIC_DIR): AboutPage {
  const file = path.join(dir, `${name}.md`);
  let source: string;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    throw new Error(`About page "${name}": content/about/${name}.md not found`);
  }
  return parseAboutPage(name, source, publicDir);
}
