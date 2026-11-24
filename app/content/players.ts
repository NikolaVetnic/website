// Players from Bandcamp, SoundCloud, Spotify and YouTube, written in Markdown like an image on a line of its own:
// `![Divide ut Regnes](bandcamp:album/1622045203 "Self-released, 2019")`. The page shows a button; the service's
// player loads only when it's pressed, so nothing is sent to the service until the reader asks for it (see
// markdown.server.ts for the button, Prose.tsx for the loading).

export const PLAYER_SERVICES = {
  bandcamp: "Bandcamp",
  soundcloud: "SoundCloud",
  spotify: "Spotify",
  youtube: "YouTube",
} as const;
export type PlayerService = keyof typeof PLAYER_SERVICES;

export type Player =
  | { service: "bandcamp"; kind: "album" | "track"; id: string }
  | { service: "soundcloud"; kind: "track" | "playlist"; id: string }
  | { service: "spotify"; kind: "album" | "track" | "playlist"; id: string }
  | { service: "youtube"; id: string; start?: number };

const PLAYER_SCHEME = /^(bandcamp|soundcloud|spotify|youtube):/;

// Whether a link is meant as a player, well written or not.
export function isPlayerReference(href: string): boolean {
  return PLAYER_SCHEME.test(href);
}

// `bandcamp:album/<id>`, `bandcamp:track/<id>`, `soundcloud:track/<id>`, `soundcloud:playlist/<id>` (the numbers
// in the services' embed codes), `spotify:album/<id>`, `spotify:track/<id>`, `spotify:playlist/<id>` (the id in the
// Spotify link) or `youtube:<video id>`, optionally from a time in seconds (`youtube:<video id>?t=600`);
// null for anything else.
export function parsePlayer(href: string): Player | null {
  let match = /^bandcamp:(album|track)\/(\d+)$/.exec(href);
  if (match) {
    return { service: "bandcamp", kind: match[1] as "album" | "track", id: match[2] };
  }
  match = /^soundcloud:(track|playlist)\/(\d+)$/.exec(href);
  if (match) {
    return { service: "soundcloud", kind: match[1] as "track" | "playlist", id: match[2] };
  }
  match = /^spotify:(album|track|playlist)\/([A-Za-z0-9]{22})$/.exec(href);
  if (match) {
    return { service: "spotify", kind: match[1] as "album" | "track" | "playlist", id: match[2] };
  }
  match = /^youtube:([\w-]{11})(?:\?t=(\d+))?$/.exec(href);
  if (match) {
    return { service: "youtube", id: match[1], ...(match[2] ? { start: Number(match[2]) } : {}) };
  }
  return null;
}

// Its shape, for the stylesheet: how tall the player is.
export function getPlayerVariant(player: Player): string {
  if (player.service === "soundcloud") {
    return `soundcloud-${player.kind}`;
  }
  if (player.service === "spotify") {
    return player.kind === "track" ? "spotify-track" : "spotify-list";
  }
  return player.service;
}

// Colours as six hex digits, no `#`: the window's background and the accent, so the player matches the page.
export type PlayerColours = { background: string; accent: string };

// The address of the service's player, started where the service allows it (the reader just pressed play).
export function getPlayerSource(player: Player, { background, accent }: PlayerColours): string {
  switch (player.service) {
    case "bandcamp":
      return `https://bandcamp.com/EmbeddedPlayer/${player.kind}=${player.id}/size=large/bgcol=${background}/linkcol=${accent}/tracklist=false/artwork=small/transparent=true/`;
    case "soundcloud": {
      const url = encodeURIComponent(`https://api.soundcloud.com/${player.kind}s/${player.id}`);
      return `https://w.soundcloud.com/player/?url=${url}&color=%23${accent}&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
    }
    // Spotify takes its colours from the cover, and doesn't start on its own.
    case "spotify":
      return `https://open.spotify.com/embed/${player.kind}/${player.id}`;
    case "youtube":
      return `https://www.youtube-nocookie.com/embed/${player.id}?autoplay=1${player.start ? `&start=${player.start}` : ""}`;
  }
}

// A colour token's value (`29 95 168`) as hex digits (`1d5fa8`).
export function toHex(rgb: string): string {
  return rgb
    .trim()
    .split(/\s+/)
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("");
}
