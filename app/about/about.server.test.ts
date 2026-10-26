import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { getAboutVersions, parseAboutVersion } from "./about.server";

const page = (front: string, body = "Hello.") => `---\n${front}\n---\n${body}\n`;
const english = "title: Bio\nlanguage: English\nflag: gb";

// A public folder with the flags the tests use.
const publicDir = mkdtempSync(path.join(tmpdir(), "public-"));
mkdirSync(path.join(publicDir, "flags"));
mkdirSync(path.join(publicDir, "about"));
for (const flag of ["gb", "no", "rs"]) {
  writeFileSync(path.join(publicDir, "flags", `${flag}.svg`), "");
}
writeFileSync(path.join(publicDir, "about/portrait.jpg"), "");
afterAll(() => rmSync(publicDir, { recursive: true }));

const parse = (source: string) => parseAboutVersion("bio.en.md", "en", source, publicDir);

describe("parseAboutVersion", () => {
  it("reads the front matter and renders the Markdown", () => {
    expect(parse(page(english, "A *short* bio."))).toEqual({
      lang: "en",
      language: "English",
      flag: "/flags/gb.svg",
      title: "Bio",
      html: "<p>A <em>short</em> bio.</p>\n",
    });
  });

  it("keeps a link to a PDF", () => {
    expect(parse(page(`${english}\npdf: https://example.com/cv.pdf`)).pdf).toBe("https://example.com/cv.pdf");
  });

  it("refuses versions with missing or malformed fields", () => {
    expect(() => parse("No front matter")).toThrow(/front matter missing/);
    expect(() => parse(page("language: English\nflag: gb"))).toThrow('About page "bio.en.md": `title` missing');
    expect(() => parse(page("title: Bio\nflag: gb"))).toThrow(/`language` missing/);
    expect(() => parse(page("title: Bio\nlanguage: English\nflag: GB"))).toThrow(/`flag`/);
    expect(() => parse(page("title: Bio\nlanguage: English\nflag: fr"))).toThrow(
      'flag "fr" not found (looked for public/flags/fr.svg)',
    );
    expect(() => parse(page(`${english}\npdf: cv.pdf`))).toThrow(/`pdf`/);
  });

  it("finds the pages' own images in public/about/", () => {
    expect(parse(page(english, "![Me](portrait.jpg)")).html).toContain('src="/about/portrait.jpg"');
    expect(() => parse(page(english, "![Me](missing.jpg)"))).toThrow(/looked for public\/about\/missing.jpg/);
  });
});

describe("getAboutVersions", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "about-"));
  afterAll(() => rmSync(dir, { recursive: true }));

  it("reads every language of a page, English first, then by code", () => {
    writeFileSync(path.join(dir, "bio.sr.md"), page("title: Biografija\nlanguage: Srpski\nflag: rs"));
    writeFileSync(path.join(dir, "bio.en.md"), page(english));
    writeFileSync(path.join(dir, "bio.no.md"), page("title: Bio\nlanguage: Norsk\nflag: no"));
    writeFileSync(path.join(dir, "resume.en.md"), page("title: Resume\nlanguage: English\nflag: gb"));

    expect(getAboutVersions("bio", dir, publicDir).map((version) => version.lang)).toEqual(["en", "no", "sr"]);
    expect(getAboutVersions("resume", dir, publicDir).map((version) => version.lang)).toEqual(["en"]);
  });

  it("fails when a page has no English version, or a file is misnamed", () => {
    const other = mkdtempSync(path.join(tmpdir(), "about-"));
    try {
      writeFileSync(path.join(other, "bio.sr.md"), page("title: Biografija\nlanguage: Srpski\nflag: rs"));
      expect(() => getAboutVersions("bio", other, publicDir)).toThrow(
        'About page "bio": content/about/bio.en.md not found',
      );

      writeFileSync(path.join(other, "bio.english.md"), page(english));
      expect(() => getAboutVersions("bio", other, publicDir)).toThrow(/bio.<two-letter language code>.md/);
    } finally {
      rmSync(other, { recursive: true });
    }
  });

  it("reads the site's own pages", () => {
    expect(getAboutVersions("bio").map((version) => version.lang)).toEqual(["en", "no", "sr"]);
    expect(getAboutVersions("resume")[0].pdf).toMatch(/^https:\/\//);
  });
});
