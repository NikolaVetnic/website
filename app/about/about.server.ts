import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { isText, PUBLIC_DIR, renderMarkdown, splitFrontMatter } from "~/content/markdown.server";
import { DEFAULT_LANG, type AboutPageId, type AboutVersion } from "./about";

const ABOUT_DIR = path.resolve("content/about");

const CODE = /^[a-z]{2}$/;

// One language of a page: YAML front matter (`title`, `language`, `flag`, optional `pdf`), then Markdown.
// Anything missing or malformed throws, so the build fails with the file's name.
export function parseAboutVersion(file: string, lang: string, source: string, publicDir = PUBLIC_DIR): AboutVersion {
  const fail = (problem: string) => new Error(`About page "${file}": ${problem}`);

  const { data, body } = splitFrontMatter(source, fail);
  const { title, language, flag, pdf } = data;
  if (!isText(title)) {
    throw fail("`title` missing");
  }
  if (!isText(language)) {
    throw fail("`language` missing (the language's name, as the switch shows it)");
  }
  if (typeof flag !== "string" || !CODE.test(flag)) {
    throw fail("`flag` must be a two-letter country code");
  }
  if (!existsSync(path.join(publicDir, "flags", `${flag}.svg`))) {
    throw fail(`flag "${flag}" not found (looked for public/flags/${flag}.svg)`);
  }
  if (pdf !== undefined && (!isText(pdf) || !/^https:\/\//.test(pdf))) {
    throw fail("`pdf` must be an https:// link");
  }

  // The pages' own images are in `public/about/`.
  const html = renderMarkdown(body, { imageBase: "/about/", publicDir, fail });
  return { lang, language, flag: `/flags/${flag}.svg`, title, html, ...(pdf ? { pdf } : {}) };
}

// A page in every language it has a file for (`bio.en.md`, `bio.sr.md`, …), English first, then by code. A page
// without an English version fails the build: that's the one the pre-rendered page shows.
export function getAboutVersions(page: AboutPageId, dir = ABOUT_DIR, publicDir = PUBLIC_DIR): AboutVersion[] {
  const files = existsSync(dir) ? readdirSync(dir).filter((file) => file.startsWith(`${page}.`)) : [];

  const versions = files.map((file) => {
    const lang = /^[a-z]+\.([a-z]{2})\.md$/.exec(file)?.[1];
    if (!lang) {
      throw new Error(`About page "${file}": the file name must be ${page}.<two-letter language code>.md`);
    }
    return parseAboutVersion(file, lang, readFileSync(path.join(dir, file), "utf8"), publicDir);
  });
  if (!versions.some((version) => version.lang === DEFAULT_LANG)) {
    throw new Error(`About page "${page}": content/about/${page}.${DEFAULT_LANG}.md not found`);
  }

  return versions.sort(
    (a, b) => Number(b.lang === DEFAULT_LANG) - Number(a.lang === DEFAULT_LANG) || a.lang.localeCompare(b.lang),
  );
}
