import { describe, expect, it } from "vitest";

import type { PostSummary } from "./posts";
import { getAllTags, isFiltering, matchesFilter, normalize, toPlainText } from "./search";

const post = (fields: Partial<PostSummary>): PostSummary => ({
  slug: "a-post",
  title: "A post",
  date: "2026-10-31",
  summary: "What it is about.",
  tags: [],
  ...fields,
});

describe("normalize", () => {
  it("drops case and accents", () => {
    expect(normalize("Vetnić")).toBe("vetnic");
    expect(normalize("Đorđe ŠĆ")).toBe("dorde sc");
  });
});

describe("toPlainText", () => {
  it("drops the markup and decodes entities", () => {
    expect(toPlainText("<p>Fish &amp; <em>chips</em></p>\n<pre><code>a &lt; b</code></pre>")).toBe(
      "Fish & chips a < b",
    );
  });
});

describe("getAllTags", () => {
  it("lists each tag once, alphabetically", () => {
    expect(getAllTags([post({ tags: ["unity", "code"] }), post({ tags: ["code", "game dev"] })])).toEqual([
      "code",
      "game dev",
      "unity",
    ]);
  });
});

describe("matchesFilter", () => {
  const unity = post({ title: "Pixel perfect text in Unity", summary: "Crisp fonts.", tags: ["code", "unity"] });

  it("lets everything through without a filter", () => {
    expect(isFiltering({ query: "  ", tags: [] })).toBe(false);
    expect(matchesFilter(unity, { query: "", tags: [] })).toBe(true);
  });

  it("needs every chosen tag", () => {
    expect(matchesFilter(unity, { query: "", tags: ["code"] })).toBe(true);
    expect(matchesFilter(unity, { query: "", tags: ["code", "unity"] })).toBe(true);
    expect(matchesFilter(unity, { query: "", tags: ["code", "sap"] })).toBe(false);
  });

  it("needs every word, in any field, in any case", () => {
    expect(matchesFilter(unity, { query: "PIXEL crisp", tags: [] })).toBe(true);
    expect(matchesFilter(unity, { query: "pixel godot", tags: [] })).toBe(false);
    expect(matchesFilter(unity, { query: "unity", tags: [] })).toBe(true);
  });

  it("searches the post's text once it is there", () => {
    expect(matchesFilter(unity, { query: "orthographic", tags: [] })).toBe(false);
    expect(matchesFilter(unity, { query: "orthographic", tags: [] }, "Set the camera to orthographic.")).toBe(true);
  });

  it("ignores accents in the query and the post", () => {
    const serbian = post({ title: "Učenje jezika", tags: ["in serbian"] });
    expect(matchesFilter(serbian, { query: "ucenje", tags: [] })).toBe(true);
  });
});
