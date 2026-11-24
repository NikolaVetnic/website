import { getMusicTab, MUSIC_TABS, type MusicKind } from "~/music/music";
import { getApp, type DesktopApp } from "./apps";

// The page an app's window shows below the app itself, if any: a post in the Blog, a project or the open-source
// contributions in Projects, a piece or a tab other than the first in Music, the bio or resume in About.
function getPageTitle(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  if ("post" in data && typeof data.post === "object" && data.post !== null && "title" in data.post) {
    return String(data.post.title);
  }
  if ("project" in data && typeof data.project === "object" && data.project !== null && "title" in data.project) {
    return String(data.project.title);
  }
  if (
    "musicEntry" in data &&
    typeof data.musicEntry === "object" &&
    data.musicEntry !== null &&
    "title" in data.musicEntry
  ) {
    return String(data.musicEntry.title);
  }
  if ("musicKind" in data && data.musicKind !== MUSIC_TABS[0].kind) {
    return getMusicTab(data.musicKind as MusicKind).title;
  }
  if ("openSource" in data) {
    return "Open source";
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
