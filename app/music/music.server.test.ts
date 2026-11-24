import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { getMusicPath, toMusicSummary } from "./music";
import { getMusic, getMusicTabData, parseMusic } from "./music.server";

const entry = (front: string, body = "About it.") => `---\n${front}\n---\n${body}\n`;
const valid = ["title: Psalm", "kind: composition", "summary: A piece for mixed choir.", "years: 2008"].join("\n");

describe("parseMusic", () => {
  it("reads the front matter and renders the Markdown, players included", () => {
    const parsed = parseMusic(
      "psalm",
      entry(
        `${valid}\nscoring: Mixed choir\nlinks:\n  - { name: SoundCloud, url: "https://soundcloud.com/x" }`,
        "![Psalm](soundcloud:track/876670129)",
      ),
    );

    expect(toMusicSummary(parsed)).toEqual({
      slug: "psalm",
      kind: "composition",
      title: "Psalm",
      summary: "A piece for mixed choir.",
      years: "2008",
      scoring: "Mixed choir",
    });
    expect(parsed.links).toEqual([{ name: "SoundCloud", url: "https://soundcloud.com/x" }]);
    expect(parsed.html).toContain('data-player="soundcloud:track/876670129"');
    expect(getMusicPath(parsed.slug)).toBe("/music/psalm");
  });

  it("names the entry and the field that's wrong", () => {
    expect(() => parseMusic("a", entry(valid.replace("composition", "opera")))).toThrow(
      /^Music "a": `kind` must be one of composition, band, soundtrack/,
    );
    expect(() => parseMusic("a", entry(valid.replace("2008", "2008-2010")))).toThrow(/`years`/);
    expect(() => parseMusic("a", entry(`${valid}\nlinks: [https://example.com]`))).toThrow(/`links`/);
    expect(() => parseMusic("a", entry(`${valid}\nlinks:\n  - { name: X, url: "http://x.com" }`))).toThrow(/`links`/);
    expect(() => parseMusic("a", entry(valid, "![Psalm](soundcloud:song/1)"))).toThrow(/^Music "a": player/);
  });

  it("leaves the tabs' paths to the tabs", () => {
    expect(() => parseMusic("bands", entry(valid))).toThrow(/`bands` is taken/);
    expect(() => parseMusic("soundtracks", entry(valid))).toThrow(/`soundtracks` is taken/);
  });

  it("checks the card's picture is there", () => {
    expect(() => parseMusic("a", entry(`${valid}\nimage: cover.webp`), "/no/such/dir")).toThrow(
      /image "cover.webp" not found/,
    );
  });
});

describe("getMusic", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "music-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("puts the most recent first, then by title", () => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "psalm.md"), entry(valid));
    writeFileSync(path.join(dir, "svarun.md"), entry(valid.replace("Psalm", "SVARUN").replace("2008", "2008–2019")));
    writeFileSync(path.join(dir, "grind.md"), entry(valid.replace("Psalm", "GRIND").replace("2008", "2019")));
    writeFileSync(path.join(dir, "notes.txt"), "not an entry");

    expect(getMusic(dir).map((parsed) => parsed.slug)).toEqual(["grind", "svarun", "psalm"]);
  });

  it("gives each tab only its own kind", () => {
    writeFileSync(path.join(dir, "hator.md"), entry(valid.replace("Psalm", "HATOR").replace("composition", "band")));

    expect(getMusicTabData("band", dir)).toEqual({
      musicKind: "band",
      entries: [{ slug: "hator", kind: "band", title: "HATOR", summary: "A piece for mixed choir.", years: "2008" }],
    });
    expect(getMusicTabData("composition", dir).entries.map((summary) => summary.slug)).not.toContain("hator");
  });
});
