// One language of an About page, from its file `content/about/<page>.<lang>.md`.
export type AboutVersion = {
  // The language code from the file name (`en`), also the text's `lang` attribute.
  lang: string;
  // The language's name in itself (`Norsk`) and its flag (`/flags/no.svg`), for the language switch.
  language: string;
  flag: string;
  title: string;
  // Rendered from Markdown at build time.
  html: string;
  // A link to this version as a PDF (the resume).
  pdf?: string;
};

export type AboutPageId = "bio" | "resume";

// What the About window shows at each of its paths: the page in every language it's written in, English first.
export type AboutData = { page: AboutPageId; versions: AboutVersion[] };

export const ABOUT_TABS: { page: AboutPageId; title: string; path: string }[] = [
  { page: "bio", title: "Bio", path: "/about" },
  { page: "resume", title: "Resume", path: "/about/resume" },
];

// The language the pre-rendered page shows, and the one every page has.
export const DEFAULT_LANG = "en";
