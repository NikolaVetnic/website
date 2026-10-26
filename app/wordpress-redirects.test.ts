import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { APPS, getAppPath } from "./desktop/apps";
import { getWordPressRedirect, WORDPRESS_PAGE_IDS, WORDPRESS_POST_IDS } from "./wordpress-redirects";

describe("getWordPressRedirect", () => {
  it("sends each old post to its page, which exists", () => {
    for (const id of WORDPRESS_POST_IDS) {
      const path = getWordPressRedirect("/", `?p=${id}`)!;
      expect(path).toMatch(/^\/blog\/[a-z0-9-]+$/);
      expect(existsSync(`content/blog/${path.slice("/blog/".length)}.md`), path).toBe(true);
    }
    expect(getWordPressRedirect("/", "?p=2074")).toBe("/blog/pixel-perfect-text-in-unity");
  });

  it("sends each old page to an app", () => {
    const paths = [getAppPath(null), ...APPS.map((app) => getAppPath(app.id))];
    for (const id of WORDPRESS_PAGE_IDS) {
      expect(paths).toContain(getWordPressRedirect("/", `?page_id=${id}`));
    }
    expect(getWordPressRedirect("/", "?page_id=1799")).toBe("/games");
  });

  it("sends unknown ids, archives and feeds somewhere sensible", () => {
    expect(getWordPressRedirect("/", "?p=1")).toBe("/blog");
    expect(getWordPressRedirect("/", "?page_id=1")).toBe("/");
    expect(getWordPressRedirect("/", "?cat=55")).toBe("/blog");
    expect(getWordPressRedirect("/", "?tag=unity")).toBe("/blog");
    expect(getWordPressRedirect("/", "?m=202010")).toBe("/blog");
    expect(getWordPressRedirect("/", "?feed=rss2")).toBe("/rss.xml");
    expect(getWordPressRedirect("/", "?p=2074&feed=rss2")).toBe("/rss.xml");
  });

  it("reads the id among other parameters and from /index.php", () => {
    expect(getWordPressRedirect("/", "?replytocom=5&p=2014")).toBe("/blog/l-verb");
    expect(getWordPressRedirect("/index.php", "?p=2014")).toBe("/blog/l-verb");
  });

  it("leaves other addresses alone", () => {
    expect(getWordPressRedirect("/", "")).toBeNull();
    expect(getWordPressRedirect("/", "?x=1")).toBeNull();
    expect(getWordPressRedirect("/", "?p=")).toBeNull();
    expect(getWordPressRedirect("/", "?p=abc")).toBeNull();
    expect(getWordPressRedirect("/", "?app=1")).toBeNull();
    expect(getWordPressRedirect("/blog", "?p=2074")).toBeNull();
  });
});
