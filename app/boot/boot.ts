// The boot screen: the logo, the name and a progress line, shown once per visit on the home page before the
// desktop (Boot.tsx draws it, Boot.css plays it). Whether it plays is decided by the inline script in <head>,
// before the first paint, which sets `data-boot` on <html>; the stylesheet shows the screen only while that is
// set and fades it out by itself, so it never depends on the rest of the site's script.

export const BOOT_KEY = "booted";

// How long `data-boot` stays: past the screen's fade and the desktop's entrance (Boot.css), so neither is cut short.
export const BOOT_DURATION = 1800;

// Plays the boot screen if this is the visit's first page, it's the home page, and the visitor hasn't asked for
// less motion; any press or key ends it at once. Without session storage it doesn't play, rather than playing on
// every page. Self-contained, with no imports or outside names, because its source runs as the inline script in
// <head>, before anything else.
export function startBoot(key: string, duration: number): boolean {
  try {
    if (
      window.location.pathname !== "/" ||
      window.location.search !== "" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.sessionStorage.getItem(key) !== null
    ) {
      return false;
    }
    window.sessionStorage.setItem(key, "1");
  } catch {
    return false;
  }

  const root = document.documentElement;
  const end = () => {
    delete root.dataset.boot;
    window.removeEventListener("pointerdown", end, true);
    window.removeEventListener("keydown", end, true);
  };
  root.dataset.boot = "";
  window.addEventListener("pointerdown", end, true);
  window.addEventListener("keydown", end, true);
  window.setTimeout(end, duration);
  return true;
}

// The inline script for <head>: startBoot with this module's key and duration.
export const BOOT_SCRIPT = `(${startBoot.toString()})(${JSON.stringify(BOOT_KEY)}, ${BOOT_DURATION});`;
