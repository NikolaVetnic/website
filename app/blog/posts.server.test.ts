import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { formatPostDate, getPostPath, toSummary } from "./posts";
import { getPosts, parsePost } from "./posts.server";

const post = (front: string, body = "Hello.") => `---\n${front}\n---\n${body}\n`;
const valid = "title: First post\ndate: 2026-10-25\nsummary: The first one.\ntags: [site, react]";

describe("parsePost", () => {
  it("reads the front matter and renders the Markdown", () => {
    const parsed = parsePost("first-post", post(valid, "## Why\n\nA *new* site."));

    expect(toSummary(parsed)).toEqual({
      slug: "first-post",
      title: "First post",
      date: "2026-10-25",
      summary: "The first one.",
      tags: ["site", "react"],
    });
    expect(parsed.html).toBe("<h2>Why</h2>\n<p>A <em>new</em> site.</p>\n");
  });

  it("allows a post without tags", () => {
    expect(parsePost("a", post("title: A\ndate: 2026-01-02\nsummary: S")).tags).toEqual([]);
  });

  it("refuses posts with missing or malformed fields", () => {
    expect(() => parsePost("a", "No front matter")).toThrow(/front matter missing/);
    expect(() => parsePost("a", post("date: 2026-10-25\nsummary: S"))).toThrow(/`title` missing/);
    expect(() => parsePost("a", post("title: A\ndate: 25.10.2026\nsummary: S"))).toThrow(/`date`/);
    expect(() => parsePost("a", post("title: A\ndate: 2026-13-45\nsummary: S"))).toThrow(/`date`/);
    expect(() => parsePost("a", post("title: A\ndate: 2026-10-25"))).toThrow(/`summary` missing/);
    expect(() => parsePost("a", post("title: A\ndate: 2026-10-25\nsummary: S\ntags: site"))).toThrow(/`tags`/);
  });

  it("refuses file names that would make awkward URLs", () => {
    expect(() => parsePost("First Post", post(valid))).toThrow(/file name/);
    expect(() => parsePost("first_post", post(valid))).toThrow(/file name/);
  });
});

describe("getPosts", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "posts-"));
  afterAll(() => rmSync(dir, { recursive: true }));

  it("reads every Markdown file, newest first", () => {
    writeFileSync(path.join(dir, "older.md"), post("title: Older\ndate: 2026-01-01\nsummary: S"));
    writeFileSync(path.join(dir, "b-same-day.md"), post("title: B\ndate: 2026-10-25\nsummary: S"));
    writeFileSync(path.join(dir, "a-same-day.md"), post("title: A\ndate: 2026-10-25\nsummary: S"));
    writeFileSync(path.join(dir, "notes.txt"), "not a post");

    expect(getPosts(dir).map((entry) => entry.slug)).toEqual(["a-same-day", "b-same-day", "older"]);
  });

  it("has no posts when there is no folder", () => {
    expect(getPosts(path.join(dir, "missing"))).toEqual([]);
  });
});

describe("post helpers", () => {
  it("builds the post's path and formats its day", () => {
    expect(getPostPath("first-post")).toBe("/blog/first-post");
    expect(formatPostDate("2026-10-05")).toBe("5 October 2026");
  });
});
