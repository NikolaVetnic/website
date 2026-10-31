import type { Size } from "./drag";

export type AppId =
  "about" | "blog" | "projects" | "games" | "art" | "music" | "contact" | "settings" | "sodhara" | "knossos";

export type DesktopApp = {
  id: AppId;
  title: string;
  icon: string;
  // Shown by search engines and link previews for the app's page.
  description: string;
  // Where the app lives, when not at its id from the root (`/blog`): `/games/sodhara`.
  path?: string;
  // The folder app that shows it, instead of the desktop.
  folder?: AppId;
  // The size its window opens at, when not the usual (windows.ts); never more than the desktop.
  windowSize?: Size;
  // A page of its own that the window shows edge to edge, in an iframe (`/apps/sodhara/`).
  page?: string;
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
  {
    id: "settings",
    title: "Settings",
    icon: "/icons/settings.svg",
    description: "Change how the site looks: light or dark, and more to come.",
  },
  {
    id: "sodhara",
    title: "SODHARA",
    icon: "/apps/sodhara/icon-128.png",
    description: "SODHARA, a retro-styled 2D sci-fi action platformer in the spirit of Super Metroid.",
    path: "/games/sodhara",
    folder: "games",
    windowSize: { width: 1040, height: 720 },
    page: "/apps/sodhara/",
  },
  {
    id: "knossos",
    title: "K’NOSSOS",
    icon: "/apps/knossos/icon-128.png",
    description: "K’NOSSOS, a cold surreal point-n’-click adventure across the unknown reaches of the cosmos.",
    path: "/games/knossos",
    folder: "games",
    windowSize: { width: 1040, height: 720 },
    page: "/apps/knossos/",
  },
];

// The apps with an icon on the desktop; the others are in a folder app.
export const DESKTOP_APPS = APPS.filter((app) => !app.folder);

// The apps a folder app shows.
export function getFolderApps(folder: AppId): DesktopApp[] {
  return APPS.filter((app) => app.folder === folder);
}

export function getApp(id: AppId): DesktopApp {
  return APPS.find((app) => app.id === id) as DesktopApp;
}

// Each app lives at its path, or at its id (`/blog`); no app at all is the bare desktop (`/`).
export function getAppPath(id: AppId | null): string {
  return id ? (getApp(id).path ?? `/${id}`) : "/";
}

// Without the trailing slash, which the hosting may add to pre-rendered pages (`/blog/` for `/blog`).
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

// The app a path belongs to: the one whose path it starts with, segment by segment, and the longest of those, so
// `/blog/` and `/blog/<slug>` are the Blog, `/games` is Games and `/games/sodhara` is SODHARA.
export function getAppFromPath(pathname: string): AppId | null {
  const segments = pathname.split("/").filter(Boolean);
  let found: AppId | null = null;
  let length = 0;
  for (const app of APPS) {
    const own = getAppPath(app.id).split("/").filter(Boolean);
    if (own.length > length && own.every((segment, index) => segments[index] === segment)) {
      found = app.id;
      length = own.length;
    }
  }
  return found;
}
