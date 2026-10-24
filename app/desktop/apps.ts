export type AppId = "about" | "blog" | "projects" | "games" | "art" | "music" | "contact";

export type DesktopApp = {
  id: AppId;
  title: string;
  icon: string;
};

// Icon order on a fresh desktop.
export const APPS: DesktopApp[] = [
  { id: "about", title: "About", icon: "/icons/about.svg" },
  { id: "blog", title: "Blog", icon: "/icons/blog.svg" },
  { id: "projects", title: "Projects", icon: "/icons/projects.svg" },
  { id: "games", title: "Games", icon: "/icons/games.svg" },
  { id: "art", title: "Art", icon: "/icons/art.svg" },
  { id: "music", title: "Music", icon: "/icons/music.svg" },
  { id: "contact", title: "Contact", icon: "/icons/contact.svg" },
];

export function getApp(id: AppId): DesktopApp {
  return APPS.find((app) => app.id === id) as DesktopApp;
}
