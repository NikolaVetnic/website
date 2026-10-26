import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getAppFromPath } from "./desktop/apps";
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

  it("sends each old page to the desktop or into an app", () => {
    for (const id of WORDPRESS_PAGE_IDS) {
      const path = getWordPressRedirect("/", `?page_id=${id}`)!;
      expect(path === "/" || getAppFromPath(path) !== null, path).toBe(true);
    }
    expect(getWordPressRedirect("/", "?page_id=1799")).toBe("/games/sodhara");
    expect(getWordPressRedirect("/", "?page_id=746")).toBe("/games/knossos");
    expect(getWordPressRedirect("/", "?page_id=770")).toBe("/games");
    expect(getWordPressRedirect("/", "?page_id=1508")).toBe("/about/resume");
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

// The redirects in public/.htaccess, as pairs of a query string pattern and a target, in their order.
function readApacheRedirects(): [RegExp, string][] {
  const rules = readFileSync("public/.htaccess", "utf8").matchAll(
    /^RewriteCond %\{QUERY_STRING\} (\S+)\nRewriteRule \^\(index\\\.php\)\?\$ https:\/\/%\{HTTP_HOST\}(\S*)\? \[R=301,L\]$/gm,
  );
  return [...rules].map(([, pattern, target]) => [new RegExp(pattern), target]);
}

describe("public/.htaccess", () => {
  it("redirects every old link where the browser does", () => {
    const apache = readApacheRedirects();
    expect(apache.length).toBeGreaterThan(20);

    const queries = [
      ...WORDPRESS_POST_IDS.map((id) => `p=${id}`),
      ...WORDPRESS_PAGE_IDS.map((id) => `page_id=${id}`),
      "p=1",
      "page_id=1",
      "cat=55",
      "tag=unity",
      "m=202010",
      "author=1",
      "feed=rss2",
      "p=2074&feed=rss2",
      "replytocom=5&p=2014",
      "p=20140",
      "page_id=70",
      "x=1",
      "p=",
      "app=1",
    ];
    for (const query of queries) {
      const target = apache.find(([pattern]) => pattern.test(query))?.[1] ?? null;
      expect(target, query).toBe(getWordPressRedirect("/", `?${query}`));
    }
  });
});
