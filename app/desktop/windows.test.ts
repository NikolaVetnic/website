import { describe, expect, it } from "vitest";

import {
  NO_WINDOWS,
  getFocusedId,
  getOpenRect,
  keepOnDesktop,
  moveRect,
  resizeRect,
  windowsReducer,
  type WindowAction,
  type WindowsState,
} from "./windows";

const area = { width: 1200, height: 800 };

function run(...actions: WindowAction[]): WindowsState {
  return actions.reduce(windowsReducer, NO_WINDOWS);
}

describe("getOpenRect", () => {
  it("centres the first window horizontally", () => {
    expect(getOpenRect(area, 0)).toEqual({ x: 280, y: 120, width: 640, height: 440 });
  });

  it("cascades further windows down and to the right", () => {
    expect(getOpenRect(area, 2)).toEqual({ x: 344, y: 184, width: 640, height: 440 });
  });

  it("starts the cascade over after a few steps", () => {
    expect(getOpenRect(area, 6)).toEqual(getOpenRect(area, 0));
  });

  it("fills a desktop smaller than a window", () => {
    expect(getOpenRect({ width: 360, height: 300 }, 3)).toEqual({ x: 0, y: 0, width: 360, height: 300 });
  });
});

describe("keepOnDesktop and moveRect", () => {
  const rect = { x: 100, y: 100, width: 400, height: 300 };

  it("moves a window by the pointer delta", () => {
    expect(moveRect(rect, 50, -20, area)).toEqual({ ...rect, x: 150, y: 80 });
  });

  it("keeps the title bar within reach", () => {
    expect(moveRect(rect, -1000, -1000, area)).toEqual({ ...rect, x: -304, y: 0 });
    expect(moveRect(rect, 2000, 2000, area)).toEqual({ ...rect, x: 1104, y: 760 });
  });

  it("shrinks a window that is larger than the desktop", () => {
    expect(keepOnDesktop({ x: 0, y: 0, width: 900, height: 700 }, { width: 600, height: 500 })).toEqual({
      x: 0,
      y: 0,
      width: 600,
      height: 500,
    });
  });
});

describe("resizeRect", () => {
  const rect = { x: 100, y: 100, width: 400, height: 300 };

  it("moves the right and bottom edges", () => {
    expect(resizeRect(rect, "se", 50, 40, area)).toEqual({ ...rect, width: 450, height: 340 });
  });

  it("moves the left and top edges while the opposite edges stay put", () => {
    expect(resizeRect(rect, "nw", -50, 30, area)).toEqual({ x: 50, y: 130, width: 450, height: 270 });
  });

  it("only changes the dragged edge", () => {
    expect(resizeRect(rect, "e", 50, 999, area)).toEqual({ ...rect, width: 450 });
    expect(resizeRect(rect, "n", 999, -20, area)).toEqual({ ...rect, y: 80, height: 320 });
  });

  it("keeps the minimum size", () => {
    expect(resizeRect(rect, "se", -1000, -1000, area)).toEqual({ ...rect, width: 280, height: 180 });
    expect(resizeRect(rect, "nw", 1000, 1000, area)).toEqual({ x: 220, y: 220, width: 280, height: 180 });
  });

  it("stops at the desktop edges", () => {
    expect(resizeRect(rect, "se", 5000, 5000, area)).toEqual({ ...rect, width: 1100, height: 700 });
    expect(resizeRect(rect, "nw", -5000, -5000, area)).toEqual({ x: 0, y: 0, width: 500, height: 400 });
  });
});

describe("windowsReducer", () => {
  it("opens a window on top with focus", () => {
    const state = run({ type: "open", id: "about", area }, { type: "open", id: "blog", area });

    expect(state.windows.map((window) => window.id)).toEqual(["about", "blog"]);
    expect(state.stack).toEqual(["about", "blog"]);
    expect(getFocusedId(state)).toBe("blog");
  });

  it("brings an open window back instead of opening it twice", () => {
    const state = run(
      { type: "open", id: "about", area },
      { type: "open", id: "blog", area },
      { type: "minimize", id: "about" },
      { type: "open", id: "about", area },
    );

    expect(state.windows).toHaveLength(2);
    expect(state.windows[0].isMinimized).toBe(false);
    expect(getFocusedId(state)).toBe("about");
  });

  it("raises a focused window without changing the open order", () => {
    const state = run(
      { type: "open", id: "about", area },
      { type: "open", id: "blog", area },
      { type: "focus", id: "about" },
    );

    expect(state.windows.map((window) => window.id)).toEqual(["about", "blog"]);
    expect(state.stack).toEqual(["blog", "about"]);
  });

  it("returns the same state when focusing the focused window", () => {
    const state = run({ type: "open", id: "about", area });
    expect(windowsReducer(state, { type: "focus", id: "about" })).toBe(state);
  });

  it("passes focus to the next window when one is minimized or closed", () => {
    const opened = run({ type: "open", id: "about", area }, { type: "open", id: "blog", area });

    expect(getFocusedId(windowsReducer(opened, { type: "minimize", id: "blog" }))).toBe("about");
    expect(getFocusedId(windowsReducer(opened, { type: "close", id: "blog" }))).toBe("about");
    expect(getFocusedId(run({ type: "open", id: "about", area }, { type: "minimize", id: "about" }))).toBeNull();
  });

  it("toggles from the taskbar: focus, then minimize, then restore", () => {
    const opened = run({ type: "open", id: "about", area }, { type: "open", id: "blog", area });

    const focused = windowsReducer(opened, { type: "toggle", id: "about" });
    expect(getFocusedId(focused)).toBe("about");

    const minimized = windowsReducer(focused, { type: "toggle", id: "about" });
    expect(minimized.windows[0].isMinimized).toBe(true);
    expect(getFocusedId(minimized)).toBe("blog");

    const restored = windowsReducer(minimized, { type: "toggle", id: "about" });
    expect(restored.windows[0].isMinimized).toBe(false);
    expect(getFocusedId(restored)).toBe("about");
  });

  it("maximizes and restores, keeping the window's own rect", () => {
    const opened = run({ type: "open", id: "about", area }, { type: "open", id: "blog", area });
    const maximized = windowsReducer(opened, { type: "toggleMaximize", id: "about" });

    expect(maximized.windows[0].isMaximized).toBe(true);
    expect(getFocusedId(maximized)).toBe("about");
    expect(windowsReducer(maximized, { type: "toggleMaximize", id: "about" }).windows[0]).toEqual(opened.windows[0]);
  });

  it("updates the rect of one window", () => {
    const rect = { x: 1, y: 2, width: 300, height: 200 };
    const state = run({ type: "open", id: "about", area }, { type: "setRect", id: "about", rect });

    expect(state.windows[0].rect).toEqual(rect);
  });

  it("minimizes every window to show the desktop, keeping the stack", () => {
    const opened = run({ type: "open", id: "about", area }, { type: "open", id: "blog", area });
    const desktop = windowsReducer(opened, { type: "showDesktop" });

    expect(desktop.windows.every((window) => window.isMinimized)).toBe(true);
    expect(desktop.stack).toEqual(opened.stack);
    expect(getFocusedId(desktop)).toBeNull();
    expect(windowsReducer(desktop, { type: "showDesktop" })).toBe(desktop);
  });

  it("opens a window without a rect before the workspace is measured", () => {
    expect(run({ type: "open", id: "blog", area: null }).windows[0].rect).toBeNull();
  });

  it("places unmeasured windows where they would have opened, once", () => {
    const state = run({ type: "open", id: "blog", area: null });
    const placed = windowsReducer(state, { type: "place", area });

    expect(placed.windows[0].rect).toEqual(getOpenRect(area, 0));
    expect(windowsReducer(placed, { type: "place", area })).toBe(placed);
  });

  it("ignores actions for windows that are not open", () => {
    const state = run({ type: "open", id: "about", area });
    expect(windowsReducer(state, { type: "close", id: "blog" })).toBe(state);
  });
});
