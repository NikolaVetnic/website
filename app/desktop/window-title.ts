import { getApp, type DesktopApp } from "./apps";

// The page an app's window shows below the app itself, if any: a post in the Blog, the bio or resume in About.
function getPageTitle(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  if ("post" in data && typeof data.post === "object" && data.post !== null && "title" in data.post) {
    return String(data.post.title);
  }
  if ("page" in data && data.page === "bio") {
    return "Bio";
  }
  if ("page" in data && data.page === "resume") {
    return "Resume";
  }
  return null;
}

// What a window's title bar says, as a path to what it shows: "Games / SODHARA", "Blog / <post>",
// "About / Bio", or just "Blog".
export function getWindowTitle(app: DesktopApp, data?: unknown): string {
  const page = getPageTitle(data);
  return [app.folder ? getApp(app.folder).title : null, app.title, page].filter(Boolean).join(" / ");
}
