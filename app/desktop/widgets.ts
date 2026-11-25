import type { PostSummary } from "~/blog/posts";

// The featured card on the desktop, from content/featured.md: something to point visitors at for now.
export type Featured = {
  title: string;
  // One or two sentences.
  text: string;
  // When it was written, `2026-11-25`, shown so a visitor can tell how fresh it is.
  date: string;
  // Where it leads: a page of the site (`/music/lonesome-night`), which opens in its window, or an https:// link.
  link: string;
  // What the link's button says.
  label: string;
  // A picture from the site root (`/music/lonesome-night/cover.webp`), if it has one.
  image?: string;
};

// What the desktop's widgets show, made at build time (see vite.config.ts, `virtual:desktop-widgets`).
export type DesktopWidgets = {
  latestPost: PostSummary | null;
  featured: Featured | null;
};
