import { describe, expect, it } from "vitest";

import { getRssFeed, getSitemap } from "./feeds";

const channel = { siteUrl: "https://example.com", title: "Blog", description: "Posts & notes" };
const posts = [
  { slug: "second", title: "Tom & Jerry <3", date: "2026-10-25", summary: "Newer.", tags: ["site", "react"] },
  { slug: "first", title: "First", date: "2026-01-02", summary: "Older.", tags: [] },
];

describe("getRssFeed", () => {
  it("lists the posts with absolute links, RSS dates and escaped text", () => {
    const feed = getRssFeed(posts, channel);

    expect(feed).toContain("<description>Posts &amp; notes</description>");
    expect(feed).toContain("<lastBuildDate>Sun, 25 Oct 2026 00:00:00 GMT</lastBuildDate>");
    expect(feed).toContain(
      "    <item>\n" +
        "      <title>Tom &amp; Jerry &lt;3</title>\n" +
        "      <link>https://example.com/blog/second</link>\n" +
        '      <guid isPermaLink="true">https://example.com/blog/second</guid>\n' +
        "      <pubDate>Sun, 25 Oct 2026 00:00:00 GMT</pubDate>\n" +
        "      <description>Newer.</description>\n" +
        "      <category>site</category>\n" +
        "      <category>react</category>\n" +
        "    </item>\n",
    );
    expect(feed.indexOf("/blog/second")).toBeLessThan(feed.indexOf("/blog/first"));
  });

  it("is a valid, empty channel without posts", () => {
    const feed = getRssFeed([], channel);

    expect(feed).not.toContain("<item>");
    expect(feed).not.toContain("lastBuildDate");
    expect(feed).toContain('<atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml"/>');
  });
});

describe("getSitemap", () => {
  it("lists absolute URLs, with a date where one is known", () => {
    expect(
      getSitemap([{ path: "/" }, { path: "/blog/first", lastModified: "2026-01-02" }], "https://example.com"),
    ).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "  <url>\n    <loc>https://example.com/</loc>\n  </url>\n" +
        "  <url>\n    <loc>https://example.com/blog/first</loc>\n    <lastmod>2026-01-02</lastmod>\n  </url>\n" +
        "</urlset>\n",
    );
  });
});
