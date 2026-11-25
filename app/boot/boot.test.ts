import { afterEach, describe, expect, it, vi } from "vitest";

import { BOOT_DURATION, BOOT_KEY, BOOT_SCRIPT, startBoot } from "./boot";

// A browser at an address, with session storage, a motion preference and an <html> element, enough for the boot.
function stubBrowser({ pathname = "/", search = "", booted = false, lessMotion = false, storage = true } = {}) {
  const items = new Map<string, string>(booted ? [[BOOT_KEY, "1"]] : []);
  const listeners = new Map<string, () => void>();
  const timers: (() => void)[] = [];
  const root = { dataset: {} as Record<string, string> };
  const sessionStorage = {
    getItem: (key: string) => {
      if (!storage) throw new Error("SecurityError");
      return items.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      if (!storage) throw new Error("SecurityError");
      items.set(key, value);
    },
  };
  vi.stubGlobal("window", {
    location: { pathname, search },
    sessionStorage,
    matchMedia: () => ({ matches: lessMotion }),
    addEventListener: (type: string, listener: () => void) => listeners.set(type, listener),
    removeEventListener: (type: string) => listeners.delete(type),
    setTimeout: (callback: () => void) => timers.push(callback),
  });
  vi.stubGlobal("document", { documentElement: root });
  return { root, items, listeners, timers };
}

describe("startBoot", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("plays on the visit's first page, the home page, and remembers it", () => {
    const { root, items } = stubBrowser();
    expect(startBoot(BOOT_KEY, BOOT_DURATION)).toBe(true);
    expect(root.dataset.boot).toBe("");
    expect(items.get(BOOT_KEY)).toBe("1");
  });

  it("ends by itself, or at the first press or key", () => {
    const timed = stubBrowser();
    startBoot(BOOT_KEY, BOOT_DURATION);
    timed.timers[0]();
    expect(timed.root.dataset.boot).toBeUndefined();
    expect(timed.listeners.size).toBe(0);

    const pressed = stubBrowser();
    startBoot(BOOT_KEY, BOOT_DURATION);
    pressed.listeners.get("pointerdown")!();
    expect(pressed.root.dataset.boot).toBeUndefined();
  });

  it("doesn't play twice in a visit, away from the home page, or for less motion", () => {
    for (const browser of [
      { booted: true },
      { pathname: "/blog/first-post" },
      { search: "?p=2074" },
      { lessMotion: true },
      { storage: false },
    ]) {
      const { root } = stubBrowser(browser);
      expect(startBoot(BOOT_KEY, BOOT_DURATION)).toBe(false);
      expect(root.dataset.boot).toBeUndefined();
    }
  });

  it("runs as the inline script from its text", () => {
    const { root } = stubBrowser();
    new Function(BOOT_SCRIPT)();
    expect(root.dataset.boot).toBe("");
  });
});
