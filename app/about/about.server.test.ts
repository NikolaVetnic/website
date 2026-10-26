import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { getAboutPage, parseAboutPage } from "./about.server";

const page = (front: string, body = "Hello.") => `---\n${front}\n---\n${body}\n`;

describe("parseAboutPage", () => {
  it("reads the front matter and renders the Markdown, in English unless it says otherwise", () => {
    expect(parseAboutPage("bio", page("title: Bio", "A *short* bio."))).toEqual({
      title: "Bio",
      lang: "en",
      html: "<p>A <em>short</em> bio.</p>\n",
    });
    expect(parseAboutPage("bio-sr", page("title: Biografija\nlang: sr")).lang).toBe("sr");
  });

  it("keeps a link to a PDF", () => {
    expect(parseAboutPage("resume", page("title: Resume\npdf: https://example.com/cv.pdf")).pdf).toBe(
      "https://example.com/cv.pdf",
    );
  });

  it("refuses pages with missing or malformed fields", () => {
    expect(() => parseAboutPage("bio", "No front matter")).toThrow(/front matter missing/);
    expect(() => parseAboutPage("bio", page("lang: en"))).toThrow('About page "bio": `title` missing');
    expect(() => parseAboutPage("bio", page("title: Bio\nlang: Serbian"))).toThrow(/`lang`/);
    expect(() => parseAboutPage("resume", page("title: Resume\npdf: cv.pdf"))).toThrow(/`pdf`/);
  });

  it("finds the pages' own images in public/about/", () => {
    const publicDir = mkdtempSync(path.join(tmpdir(), "public-"));
    mkdirSync(path.join(publicDir, "about"));
    writeFileSync(path.join(publicDir, "about/portrait.jpg"), "");

    try {
      expect(parseAboutPage("bio", page("title: Bio", "![Me](portrait.jpg)"), publicDir).html).toContain(
        'src="/about/portrait.jpg"',
      );
      expect(() => parseAboutPage("bio", page("title: Bio", "![Me](missing.jpg)"), publicDir)).toThrow(
        /looked for public\/about\/missing.jpg/,
      );
    } finally {
      rmSync(publicDir, { recursive: true });
    }
  });
});

describe("getAboutPage", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "about-"));
  afterAll(() => rmSync(dir, { recursive: true }));

  it("reads a page by its file name", () => {
    writeFileSync(path.join(dir, "bio.md"), page("title: Bio"));
    expect(getAboutPage("bio", dir).title).toBe("Bio");
  });

  it("fails with the page's name when the file isn't there", () => {
    expect(() => getAboutPage("resume", dir)).toThrow('About page "resume": content/about/resume.md not found');
  });

  it("reads the site's own pages", () => {
    expect(getAboutPage("bio").lang).toBe("en");
    expect(getAboutPage("bio-sr").lang).toBe("sr");
    expect(getAboutPage("resume").pdf).toMatch(/^https:\/\//);
  });
});
