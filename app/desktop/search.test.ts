import { describe, expect, it } from "vitest";

import { APPS, getApp, type DesktopApp } from "./apps";
import { normalize, searchApps } from "./search";

const folderTitle = (app: DesktopApp) => (app.folder ? getApp(app.folder).title : "");
const find = (query: string) => searchApps(APPS, query, folderTitle).map((app) => app.id);

describe("normalize", () => {
  it("drops case, accents and punctuation", () => {
    expect(normalize("K’NOSSOS")).toBe("knossos");
    expect(normalize("Vetnić")).toBe("vetnic");
    expect(normalize("Rogue C")).toBe("roguec");
  });
});

describe("searchApps", () => {
  it("finds apps by title, apps in folders too", () => {
    expect(find("knossos")).toEqual(["knossos"]);
    // Dungeon Gunner is a roguelike, so it's found too, after the title that has the word.
    expect(find("rogue")).toEqual(["rogue-c", "dungeon-gunner"]);
  });

  it("puts titles that start with the query first", () => {
    expect(find("set")[0]).toBe("settings");
    expect(find("mu")[0]).toBe("music");
  });

  it("finds apps by their folder and description, every word counting", () => {
    expect(find("games")).toContain("sodhara");
    expect(find("posts")).toEqual(["blog"]);
    expect(find("games unity")).toEqual(["dungeon-gunner"]);
  });

  it("finds nothing for an empty query or one nothing has", () => {
    expect(find("  ")).toEqual([]);
    expect(find("zzz")).toEqual([]);
  });
});
