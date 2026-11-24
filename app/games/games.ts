// The small games in the Games folder that open a page of their own (Dungeon Gunner, Rogue C), as opposed to
// those with a landing page (SODHARA, K’NOSSOS, VSEVOLOD).
export type Game = {
  slug: string;
  title: string;
  // One line, under the title and for search engines.
  summary: string;
  // When, as it reads: `2021`, `2020–2021`.
  years: string;
  // What it's built with (`Unity`, `C#`).
  tech: string[];
  // Where its code is, if it's public.
  repo?: string;
  // Rendered from Markdown at build time.
  html: string;
};

export function getGamePath(slug: string): string {
  return `/games/${slug}`;
}
