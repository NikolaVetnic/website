import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getDesktopWidgets, parseFeatured } from "./widgets.server";

const featured = (front: string) => `---\n${front}\n---\n`;
const valid = ["title: Out now", "text: The album.", "date: 2026-11-25", "link: /music/album"].join("\n");

describe("parseFeatured", () => {
  it("reads the card, its button saying Open unless told otherwise", () => {
    expect(parseFeatured(featured(valid))).toEqual({
      title: "Out now",
      text: "The album.",
      date: "2026-11-25",
      link: "/music/album",
      label: "Open",
    });
    expect(parseFeatured(featured(`${valid}\nlabel: Listen`)).label).toBe("Listen");
  });

  it("fails on a missing or malformed field, or a picture that isn't there", () => {
    expect(() => parseFeatured(featured(valid.replace("title: Out now\n", "")))).toThrow(
      "content/featured.md: `title` missing",
    );
    expect(() => parseFeatured(featured(valid.replace("2026-11-25", "25 November")))).toThrow(/`date`/);
    expect(() => parseFeatured(featured(valid.replace("/music/album", "music/album")))).toThrow(/`link`/);
    expect(() => parseFeatured(featured(`${valid}\nimage: /nowhere.webp`), tmpdir())).toThrow(
      'image "/nowhere.webp" not found',
    );
  });
});

describe("getDesktopWidgets", () => {
  it("shows the newest post, and the card only when its file exists", () => {
    const root = mkdtempSync(path.join(tmpdir(), "widgets-"));
    const posts = path.join(root, "blog");
    mkdirSync(posts);
    const post = (title: string, date: string) =>
      `---\ntitle: ${title}\ndate: ${date}\nsummary: About ${title}.\n---\nText.\n`;
    writeFileSync(path.join(posts, "older.md"), post("Older", "2026-01-01"));
    writeFileSync(path.join(posts, "newer.md"), post("Newer", "2026-02-01"));
    const file = path.join(root, "featured.md");

    expect(getDesktopWidgets(posts, file, root)).toEqual({
      latestPost: { slug: "newer", title: "Newer", date: "2026-02-01", summary: "About Newer.", tags: [] },
      featured: null,
    });
    writeFileSync(file, featured(valid));
    expect(getDesktopWidgets(posts, file, root).featured?.title).toBe("Out now");
  });

  it("reads the site's own content", () => {
    const { latestPost, featured: card } = getDesktopWidgets();
    expect(latestPost).not.toBeNull();
    expect(card?.link).toBe("/music/lonesome-night");
  });
});
