export type AboutPage = {
  title: string;
  // The language the page is written in, `en` unless the front matter says otherwise.
  lang: string;
  // Rendered from Markdown at build time.
  html: string;
  // A link to the page as a PDF (the resume).
  pdf?: string;
};

// What the About window shows at each of its paths.
export type AboutData = { page: "bio"; bio: AboutPage; bioSr: AboutPage } | { page: "resume"; resume: AboutPage };

export const ABOUT_TABS = [
  { page: "bio", title: "Bio", path: "/about" },
  { page: "resume", title: "Resume", path: "/about/resume" },
] as const;
