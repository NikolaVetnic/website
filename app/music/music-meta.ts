import { getApp } from "~/desktop/apps";
import { SITE_NAME, getAppMeta, getPageMeta } from "~/meta";
import { getMusicTab, MUSIC_TABS, type MusicKind } from "./music";

// A tab's meta tags: the first is the Music app's own page, the others pages of their own.
export function getMusicTabMeta(kind: MusicKind) {
  const tab = getMusicTab(kind);
  if (tab === MUSIC_TABS[0]) {
    return getAppMeta(getApp("music"));
  }

  return getPageMeta({
    title: `${tab.title} · Music · ${SITE_NAME}`,
    description: `${tab.title} by ${SITE_NAME}.`,
    path: tab.path,
  });
}
