import { describe, expect, it } from "vitest";

import { APPS, getAppFromPath, getAppPath } from "./apps";

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

  it("finds no app for unknown paths", () => {
    expect(getAppFromPath("/nothing")).toBeNull();
    expect(getAppFromPath("/Blog")).toBeNull();
  });
});
