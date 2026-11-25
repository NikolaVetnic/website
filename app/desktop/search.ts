import type { DesktopApp } from "./apps";

// Text as search compares it: lower case, without accents or anything but letters and digits, so "knossos" finds
// K’NOSSOS and "vetnic" finds Vetnić.
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

// The apps that every word of the query finds, in their title, their folder's title or their description: those
// whose title starts with the query first, then those whose title has it, then the rest, each in the list's order.
// An empty query finds nothing.
export function searchApps(apps: DesktopApp[], query: string, folderTitle: (app: DesktopApp) => string = () => "") {
  const words = query.split(/\s+/).map(normalize).filter(Boolean);
  if (words.length === 0) {
    return [];
  }

  const whole = normalize(query);
  const rank = (app: DesktopApp) => {
    const title = normalize(app.title);
    return title.startsWith(whole) ? 0 : title.includes(whole) ? 1 : 2;
  };

  return apps
    .filter((app) => {
      const text = [app.title, folderTitle(app), app.description].map(normalize).join(" ");
      return words.every((word) => text.includes(word));
    })
    .map((app, index) => ({ app, index, rank: rank(app) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ app }) => app);
}
