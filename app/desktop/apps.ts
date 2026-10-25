export type AppId = "about" | "blog" | "projects" | "games" | "art" | "music" | "contact";

export type DesktopApp = {
  id: AppId;
  title: string;
  icon: string;
  // Shown by search engines and link previews for the app's page.
  description: string;
};

// Icon order on a fresh desktop.
export const APPS: DesktopApp[] = [
  {
    id: "about",
    title: "About",
    icon: "/icons/about.svg",
    description: "Who Nikola Pacek Vetnić is: software developer, game developer and musician.",
  },
  {
    id: "blog",
    title: "Blog",
    icon: "/icons/blog.svg",
    description: "Posts by Nikola Pacek Vetnić on software, games and music.",
  },
  {
    id: "projects",
    title: "Projects",
    icon: "/icons/projects.svg",
    description: "Software projects by Nikola Pacek Vetnić.",
  },
  { id: "games", title: "Games", icon: "/icons/games.svg", description: "Games made by Nikola Pacek Vetnić." },
  { id: "art", title: "Art", icon: "/icons/art.svg", description: "Art by Nikola Pacek Vetnić." },
  { id: "music", title: "Music", icon: "/icons/music.svg", description: "Music by Nikola Pacek Vetnić." },
  {
    id: "contact",
    title: "Contact",
    icon: "/icons/contact.svg",
    description: "How to get in touch with Nikola Pacek Vetnić.",
  },
];

export function getApp(id: AppId): DesktopApp {
  return APPS.find((app) => app.id === id) as DesktopApp;
}

// Each app lives at its id (`/blog`); no app at all is the bare desktop (`/`).
export function getAppPath(id: AppId | null): string {
  return id ? `/${id}` : "/";
}

// Without the trailing slash, which the hosting may add to pre-rendered pages (`/blog/` for `/blog`).
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

// The app a path belongs to, by its first segment, so `/blog/` and later `/blog/<slug>` are the Blog too.
export function getAppFromPath(pathname: string): AppId | null {
  const segment = pathname.split("/")[1];
  return APPS.find((app) => app.id === segment)?.id ?? null;
}
