import { describe, expect, it } from "vitest";

import { getPlayerSource, getPlayerVariant, parsePlayer, toHex } from "./players";

const colours = { background: "ffffff", accent: "1d5fa8" };

describe("parsePlayer", () => {
  it("reads each service's references", () => {
    expect(parsePlayer("bandcamp:album/1622045203")).toEqual({ service: "bandcamp", kind: "album", id: "1622045203" });
    expect(parsePlayer("soundcloud:playlist/334289683")).toEqual({
      service: "soundcloud",
      kind: "playlist",
      id: "334289683",
    });
    expect(parsePlayer("youtube:xFvrRx15Mqo")).toEqual({ service: "youtube", id: "xFvrRx15Mqo" });
    expect(parsePlayer("youtube:29XxZAPfF0U?t=600")).toEqual({ service: "youtube", id: "29XxZAPfF0U", start: 600 });
  });

  it("refuses anything else", () => {
    expect(parsePlayer("bandcamp:album/divide-ut-regnes")).toBeNull();
    expect(parsePlayer("soundcloud:tracks/1")).toBeNull();
    expect(parsePlayer("youtube:short")).toBeNull();
    expect(parsePlayer("youtube:29XxZAPfF0U?t=10m")).toBeNull();
    expect(parsePlayer("photo.jpg")).toBeNull();
  });
});

describe("getPlayerSource", () => {
  it("colours Bandcamp's player like the window", () => {
    expect(getPlayerSource({ service: "bandcamp", kind: "album", id: "1" }, colours)).toBe(
      "https://bandcamp.com/EmbeddedPlayer/album=1/size=large/bgcol=ffffff/linkcol=1d5fa8/tracklist=false/artwork=small/transparent=true/",
    );
  });

  it("starts SoundCloud's player in the accent", () => {
    const source = getPlayerSource({ service: "soundcloud", kind: "playlist", id: "2" }, colours);
    expect(source).toMatch(
      /^https:\/\/w\.soundcloud\.com\/player\/\?url=https%3A%2F%2Fapi\.soundcloud\.com%2Fplaylists%2F2&/,
    );
    expect(source).toContain("color=%231d5fa8");
    expect(source).toContain("auto_play=true");
  });

  it("plays YouTube without its cookies", () => {
    expect(getPlayerSource({ service: "youtube", id: "xFvrRx15Mqo" }, colours)).toBe(
      "https://www.youtube-nocookie.com/embed/xFvrRx15Mqo?autoplay=1",
    );
    expect(getPlayerSource({ service: "youtube", id: "29XxZAPfF0U", start: 600 }, colours)).toBe(
      "https://www.youtube-nocookie.com/embed/29XxZAPfF0U?autoplay=1&start=600",
    );
  });
});

describe("getPlayerVariant", () => {
  it("tells SoundCloud's tracks from its playlists", () => {
    expect(getPlayerVariant({ service: "soundcloud", kind: "track", id: "1" })).toBe("soundcloud-track");
    expect(getPlayerVariant({ service: "bandcamp", kind: "track", id: "1" })).toBe("bandcamp");
  });
});

describe("toHex", () => {
  it("turns a colour token into hex digits", () => {
    expect(toHex(" 29 95 168")).toBe("1d5fa8");
    expect(toHex("0 0 0")).toBe("000000");
  });
});
