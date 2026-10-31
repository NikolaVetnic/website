import { describe, expect, it } from "vitest";

import { getApp } from "./apps";
import { getWindowTitle } from "./window-title";

describe("getWindowTitle", () => {
  it("puts an app's folder before it", () => {
    expect(getWindowTitle(getApp("sodhara"))).toBe("Games/SODHARA");
    expect(getWindowTitle(getApp("knossos"))).toBe("Games/K’NOSSOS");
  });

  it("puts a post after the Blog", () => {
    const data = { post: { slug: "a-post", title: "A post", date: "2026-10-31", summary: "", tags: [], html: "" } };
    expect(getWindowTitle(getApp("blog"), data)).toBe("Blog/A post");
  });

  it("puts the resume after About", () => {
    expect(getWindowTitle(getApp("about"), { page: "resume", versions: [] })).toBe("About/Resume");
    expect(getWindowTitle(getApp("about"), { page: "bio", versions: [] })).toBe("About");
  });

  it("is just the app on its own page, or before its data has loaded", () => {
    expect(getWindowTitle(getApp("blog"), { posts: [] })).toBe("Blog");
    expect(getWindowTitle(getApp("blog"), { missing: true })).toBe("Blog");
    expect(getWindowTitle(getApp("games"))).toBe("Games");
  });
});
