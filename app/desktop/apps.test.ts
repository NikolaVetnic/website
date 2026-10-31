import { describe, expect, it } from "vitest";

import { APPS, DESKTOP_APPS, getAppFromPath, getAppPath, getFolderApps, normalizePath } from "./apps";

describe("getAppPath and getAppFromPath", () => {
  it("gives each app its own path and finds the app from it", () => {
    for (const app of APPS) {
      expect(getAppFromPath(getAppPath(app.id))).toBe(app.id);
    }
  });

  it("maps the bare desktop to the root", () => {
    expect(getAppPath(null)).toBe("/");
    expect(getAppFromPath("/")).toBeNull();
  });

  it("reads the app from the first segment only", () => {
    expect(getAppFromPath("/blog/")).toBe("blog");
    expect(getAppFromPath("/blog/first-post")).toBe("blog");
    expect(getAppFromPath("/posts/blog")).toBeNull();
  });

  it("drops the trailing slash", () => {
    expect(normalizePath("/blog/")).toBe("/blog");
    expect(normalizePath("/blog/first-post/")).toBe("/blog/first-post");
    expect(normalizePath("/blog")).toBe("/blog");
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("//")).toBe("/");
  });

  it("finds an app inside another's path by the longest match", () => {
    expect(getAppPath("sodhara")).toBe("/games/sodhara");
    expect(getAppFromPath("/games/sodhara")).toBe("sodhara");
    expect(getAppFromPath("/games/sodhara/")).toBe("sodhara");
    expect(getAppFromPath("/games")).toBe("games");
    expect(getAppFromPath("/games/other")).toBe("games");
    expect(getAppFromPath("/gamessodhara")).toBeNull();
  });

  it("finds no app for unknown paths", () => {
    expect(getAppFromPath("/nothing")).toBeNull();
    expect(getAppFromPath("/Blog")).toBeNull();
  });
});

describe("folders", () => {
  it("keeps an app in a folder off the desktop and in its folder", () => {
    expect(DESKTOP_APPS.map((app) => app.id)).not.toContain("sodhara");
    expect(DESKTOP_APPS.map((app) => app.id)).toContain("games");
    expect(getFolderApps("games").map((app) => app.id)).toEqual(["sodhara", "knossos"]);
  });

  it("puts every app on the desktop or in a folder that is on it", () => {
    const desktop = new Set(DESKTOP_APPS.map((app) => app.id));
    for (const app of APPS) {
      expect(desktop.has(app.id) || desktop.has(app.folder!), app.id).toBe(true);
    }
  });
});
