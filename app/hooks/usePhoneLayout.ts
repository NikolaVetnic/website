import { useSyncExternalStore } from "react";

// When the screen gets the phone layout: narrow, or too short for windows (a phone on its side). The stylesheets
// that draw it repeat this query: Desktop.css, DesktopIcon.css, AppWindow.css, Taskbar.css.
export const PHONE_LAYOUT_QUERY = "(max-width: 699px), (max-height: 499px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE_LAYOUT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Whether the phone layout is on. Always false in the pre-rendered page and while it hydrates: CSS draws the
// layout, so this only switches behaviour (dragging, what a tap does) and never changes the first paint.
function usePhoneLayout(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_LAYOUT_QUERY).matches,
    () => false,
  );
}

export default usePhoneLayout;
