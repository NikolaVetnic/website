import type { AppId } from "./apps";
import type { Size } from "./drag";
import { clamp } from "./grid";

export type Rect = { x: number; y: number; width: number; height: number };

export type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type DesktopWindow = {
  id: AppId;
  rect: Rect;
  isMinimized: boolean;
  isMaximized: boolean;
};

// Windows stay in the order they were opened, so their DOM nodes never move (which would drop focus
// and scroll positions); `stack` holds the same ids from the bottom window to the top one.
export type WindowsState = {
  windows: DesktopWindow[];
  stack: AppId[];
};

export type WindowAction =
  | { type: "open"; id: AppId; area: Size }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "toggleMaximize"; id: AppId }
  | { type: "toggle"; id: AppId }
  | { type: "setRect"; id: AppId; rect: Rect }
  | { type: "showDesktop" };

export const NO_WINDOWS: WindowsState = { windows: [], stack: [] };

export const MIN_WINDOW_SIZE: Size = { width: 280, height: 180 };

const DEFAULT_WINDOW_SIZE: Size = { width: 640, height: 440 };

const CASCADE_OFFSET = 32;
const CASCADE_STEPS = 6;

// How much of a window must stay on the desktop so its title bar can still be grabbed.
const GRAB_WIDTH = 96;
const GRAB_HEIGHT = 40;

// Centred on the desktop, each further window a step down and to the right, never larger than the desktop.
export function getOpenRect(area: Size, index: number): Rect {
  const width = Math.min(DEFAULT_WINDOW_SIZE.width, area.width);
  const height = Math.min(DEFAULT_WINDOW_SIZE.height, area.height);
  const step = (index % CASCADE_STEPS) * CASCADE_OFFSET;

  return {
    x: clamp(Math.round((area.width - width) / 2) + step, 0, area.width - width),
    y: clamp(Math.round((area.height - height) / 3) + step, 0, area.height - height),
    width,
    height,
  };
}

// Shrinks a window that is larger than the desktop and pulls its title bar back within reach.
export function keepOnDesktop(rect: Rect, area: Size): Rect {
  const width = Math.min(rect.width, area.width);
  const height = Math.min(rect.height, area.height);

  return {
    x: clamp(rect.x, Math.min(0, GRAB_WIDTH - width), Math.max(0, area.width - GRAB_WIDTH)),
    y: clamp(rect.y, 0, Math.max(0, area.height - GRAB_HEIGHT)),
    width,
    height,
  };
}

export function moveRect(rect: Rect, dx: number, dy: number, area: Size): Rect {
  return keepOnDesktop({ ...rect, x: rect.x + dx, y: rect.y + dy }, area);
}

// Moves the dragged edges only, keeping the window at least the minimum size and inside the desktop.
export function resizeRect(rect: Rect, edge: ResizeEdge, dx: number, dy: number, area: Size): Rect {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  let { x, y, width, height } = rect;

  if (edge.includes("e")) {
    width = clamp(rect.width + dx, MIN_WINDOW_SIZE.width, Math.max(MIN_WINDOW_SIZE.width, area.width - rect.x));
  }
  if (edge.includes("w")) {
    x = clamp(rect.x + dx, Math.min(0, rect.x), right - MIN_WINDOW_SIZE.width);
    width = right - x;
  }
  if (edge.includes("s")) {
    height = clamp(rect.height + dy, MIN_WINDOW_SIZE.height, Math.max(MIN_WINDOW_SIZE.height, area.height - rect.y));
  }
  if (edge.includes("n")) {
    y = clamp(rect.y + dy, 0, bottom - MIN_WINDOW_SIZE.height);
    height = bottom - y;
  }

  return { x, y, width, height };
}

// The window that has focus: the topmost one that is not minimized.
export function getFocusedId(state: WindowsState): AppId | null {
  for (let index = state.stack.length - 1; index >= 0; index--) {
    const window = state.windows.find((entry) => entry.id === state.stack[index]);
    if (window && !window.isMinimized) {
      return window.id;
    }
  }

  return null;
}

function raise(stack: AppId[], id: AppId): AppId[] {
  return [...stack.filter((entry) => entry !== id), id];
}

function update(state: WindowsState, id: AppId, change: Partial<DesktopWindow>): DesktopWindow[] {
  return state.windows.map((window) => (window.id === id ? { ...window, ...change } : window));
}

function show(state: WindowsState, id: AppId): WindowsState {
  return { windows: update(state, id, { isMinimized: false }), stack: raise(state.stack, id) };
}

export function windowsReducer(state: WindowsState, action: WindowAction): WindowsState {
  if (action.type === "showDesktop") {
    return state.windows.every((window) => window.isMinimized)
      ? state
      : { ...state, windows: state.windows.map((window) => ({ ...window, isMinimized: true })) };
  }

  const current = state.windows.find((window) => window.id === action.id);

  if (action.type === "open") {
    if (current) {
      return show(state, action.id);
    }

    const window = {
      id: action.id,
      rect: getOpenRect(action.area, state.windows.length),
      isMinimized: false,
      isMaximized: false,
    };
    return { windows: [...state.windows, window], stack: [...state.stack, action.id] };
  }

  if (!current) {
    return state;
  }

  switch (action.type) {
    case "close":
      return {
        windows: state.windows.filter((window) => window.id !== action.id),
        stack: state.stack.filter((id) => id !== action.id),
      };
    case "focus":
      return getFocusedId(state) === action.id ? state : show(state, action.id);
    case "minimize":
      return { ...state, windows: update(state, action.id, { isMinimized: true }) };
    case "toggleMaximize":
      return {
        windows: update(state, action.id, { isMaximized: !current.isMaximized, isMinimized: false }),
        stack: raise(state.stack, action.id),
      };
    case "toggle":
      return getFocusedId(state) === action.id
        ? { ...state, windows: update(state, action.id, { isMinimized: true }) }
        : show(state, action.id);
    case "setRect":
      return { ...state, windows: update(state, action.id, { rect: action.rect }) };
  }
}
