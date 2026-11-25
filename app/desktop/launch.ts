import type { Rect } from "./windows";

// Windows grow out of what opened them (a desktop icon, a folder's icon, a link, a widget) and shrink into their
// taskbar button. What opened a window is the control pressed just before it appeared, wherever on the page that
// was, so no caller has to pass it along.

// The controls a window can grow out of.
const CONTROL = "a, button, [role='button'], [role='option']";

// How long after a press a window still counts as opened by it: time for a double-click and for a page to load.
const PRESS_AGE = 1000;

function getVisibleRect(element: Element | null | undefined): Rect | null {
  if (!element?.isConnected) {
    return null;
  }
  const { x, y, width, height } = element.getBoundingClientRect();
  return width > 0 && height > 0 ? { x, y, width, height } : null;
}

// Where the control was when pressed: it may be gone by the time its window opens (the start menu closes then).
let lastPress: { rect: Rect; time: number } | null = null;

// Notes a press on a control; the page's presses are noted by trackPresses, and a control chosen some other way (the
// start menu's, by Enter in its search field) can be noted here.
export function notePress(target: EventTarget | null) {
  const rect = getVisibleRect(target instanceof Element ? target.closest(CONTROL) : null);
  lastPress = rect ? { rect, time: performance.now() } : null;
}

const onPointerDown = (event: PointerEvent) => notePress(event.target);
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    notePress(document.activeElement);
  }
};

// Keeps track of the controls the visitor presses, by pointer or key, until the returned function is called.
export function trackPresses(): () => void {
  window.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("keydown", onKeyDown, true);
  return () => {
    window.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("keydown", onKeyDown, true);
  };
}

// Where on screen the control pressed a moment ago was.
export function getPressedRect(): Rect | null {
  return lastPress && performance.now() - lastPress.time <= PRESS_AGE ? lastPress.rect : null;
}

// Where on screen an app's taskbar button is (Taskbar.tsx).
export function getTaskbarButtonRect(id: string): Rect | null {
  return getVisibleRect(document.querySelector(`.taskbar__window[data-app-id="${id}"]`));
}

export function prefersLessMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const round = (value: number, digits = 1) => Number(value.toFixed(digits));

// The transform that lays a window (`to`) over a smaller control (`from`): centred on it, scaled down as a whole,
// never stretched, until the window's longer side spans the control's.
export function getLaunchTransform(from: Rect, to: Rect): string {
  const scale = Math.min(1, Math.max(from.width / to.width, from.height / to.height));
  const dx = from.x + from.width / 2 - (to.x + to.width / 2);
  const dy = from.y + from.height / 2 - (to.y + to.height / 2);
  return `translate(${round(dx)}px, ${round(dy)}px) scale(${round(scale, 3)})`;
}

// A window growing out of a control, fading in on the way.
export function getOpenKeyframes(from: Rect, to: Rect): Keyframe[] {
  return [
    { transform: getLaunchTransform(from, to), opacity: 0 },
    { opacity: 1, offset: 0.35 },
    { transform: "none", opacity: 1 },
  ];
}

// A window shrinking into its taskbar button, fading out at the end.
export function getMinimizeKeyframes(windowRect: Rect, button: Rect): Keyframe[] {
  return [
    { transform: "none", opacity: 1 },
    { opacity: 1, offset: 0.6 },
    { transform: getLaunchTransform(button, windowRect), opacity: 0 },
  ];
}

export const OPEN_TIMING: KeyframeAnimationOptions = { duration: 280, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
export const MINIMIZE_TIMING: KeyframeAnimationOptions = {
  duration: 220,
  easing: "cubic-bezier(0.4, 0, 1, 1)",
  fill: "forwards",
};

// For visitors who ask for less motion, a window being minimized only fades, as it fades in when it opens.
export const FADE_KEYFRAMES: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];
export const FADE_TIMING: KeyframeAnimationOptions = { duration: 120, easing: "ease-out", fill: "forwards" };
