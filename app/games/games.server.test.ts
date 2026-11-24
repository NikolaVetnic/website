import { describe, expect, it } from "vitest";

import { APPS } from "~/desktop/apps";
import { getGamePath } from "./games";
import { getGames, parseGame } from "./games.server";

const game = (front: string, body = "About it.") => `---\n${front}\n---\n${body}\n`;
const valid = ["title: Rogue C", "summary: Rogue in C.", "years: 2022", "tech: [C]"].join("\n");

describe("parseGame", () => {
  it("reads the front matter and renders the Markdown", () => {
    const parsed = parseGame("rogue-c", game(`${valid}\nrepo: https://github.com/example/rogue`, "With *rays*."));

    expect(parsed).toEqual({
      slug: "rogue-c",
      title: "Rogue C",
      summary: "Rogue in C.",
      years: "2022",
      tech: ["C"],
      repo: "https://github.com/example/rogue",
      html: "<p>With <em>rays</em>.</p>\n",
    });
    expect(getGamePath(parsed.slug)).toBe("/games/rogue-c");
  });

  it("needs no repo", () => {
    expect(parseGame("rogue-c", game(valid)).repo).toBeUndefined();
  });

  it("fails with the game's name on a missing or malformed field", () => {
    expect(() => parseGame("rogue-c", game("summary: Rogue in C.\nyears: 2022\ntech: [C]"))).toThrow(
      'Game "rogue-c": `title` missing',
    );
    expect(() => parseGame("rogue-c", game(valid.replace("2022", "2022-2023")))).toThrow(/`years`/);
    expect(() => parseGame("rogue-c", game(valid.replace("tech: [C]", "tech: []")))).toThrow(/`tech`/);
    expect(() => parseGame("rogue-c", game(`${valid}\nrepo: http://example.com`))).toThrow(/`repo`/);
  });
});

describe("the game pages", () => {
  it("are the pages of the apps that show one, and no others", () => {
    const apps = APPS.filter((app) => app.content === "games").map((app) => app.id);
    expect(getGames().map((entry) => entry.slug)).toEqual([...apps].sort());
    for (const app of APPS.filter((entry) => entry.content === "games")) {
      expect(app.path, app.id).toBe(getGamePath(app.id));
    }
  });
});
