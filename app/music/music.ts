// The Music window's entries: compositions, bands and soundtracks, each on a tab of its own.
export const MUSIC_KINDS = ["composition", "band", "soundtrack"] as const;
export type MusicKind = (typeof MUSIC_KINDS)[number];

export type MusicTab = { kind: MusicKind; title: string; path: string };

// The tabs, in their order; the first is the window's own page.
export const MUSIC_TABS: MusicTab[] = [
  { kind: "composition", title: "Compositions", path: "/music" },
  { kind: "band", title: "Bands", path: "/music/bands" },
  { kind: "soundtrack", title: "Soundtracks", path: "/music/soundtracks" },
];

export type MusicSummary = {
  slug: string;
  kind: MusicKind;
  title: string;
  // One line, for the card and for search engines.
  summary: string;
  // When, as it reads: `2014`, `2008–2019`.
  years: string;
  // What a composition is written for (`Mixed choir`).
  scoring?: string;
  // What Nikola did in a band or on a soundtrack (`Drums`).
  role?: string;
  // The card's picture, from the site root (`/music/<slug>/cover.webp`), if it has one.
  image?: string;
};

export type MusicLink = { name: string; url: string };

export type MusicEntry = MusicSummary & {
  // Where else to hear it (Bandcamp, Spotify, YouTube), shown as buttons.
  links: MusicLink[];
  // Rendered from Markdown at build time.
  html: string;
};

export function getMusicPath(slug: string): string {
  return `/music/${slug}`;
}

export function getMusicTab(kind: MusicKind): MusicTab {
  return MUSIC_TABS.find((tab) => tab.kind === kind) ?? MUSIC_TABS[0];
}

export function toMusicSummary({ slug, kind, title, summary, years, scoring, role, image }: MusicEntry): MusicSummary {
  return {
    slug,
    kind,
    title,
    summary,
    years,
    ...(scoring ? { scoring } : {}),
    ...(role ? { role } : {}),
    ...(image ? { image } : {}),
  };
}
