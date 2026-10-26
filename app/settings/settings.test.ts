import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { APPLY_SETTINGS_SCRIPT, applySettings, DEFAULT_SETTINGS, saveSettings, SETTINGS_KEY } from "./settings";

// A browser with storage, a light or dark system, and an <html> element, enough for the settings.
function stubBrowser({ stored = null as string | null, systemIsDark = false, storage = true } = {}) {
  const items = new Map<string, string>(stored === null ? [] : [[SETTINGS_KEY, stored]]);
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  const localStorage = {
    getItem: (key: string) => {
      if (!storage) throw new Error("SecurityError");
      return items.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      if (!storage) throw new Error("SecurityError");
      items.set(key, value);
    },
  };
  vi.stubGlobal("window", { localStorage, matchMedia: () => ({ matches: systemIsDark }) });
  vi.stubGlobal("document", { documentElement: root });
  return { root, items };
}

describe("applySettings", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("follows the system by default", () => {
    expect(applySettings()).toEqual(DEFAULT_SETTINGS);

    const { root } = stubBrowser({ systemIsDark: true });
    applySettings();
    expect(root.dataset.theme).toBe("dark");
    expect(root.style.colorScheme).toBe("dark");
  });

  it("applies a stored theme over the system's", () => {
    const { root } = stubBrowser({ stored: '{"theme":"light"}', systemIsDark: true });
    expect(applySettings()).toEqual({ theme: "light" });
    expect(root.dataset.theme).toBe("light");
  });

  it("falls back to the defaults for anything it can't use", () => {
    for (const stored of ["not json", "null", "[]", '{"theme":"purple"}', '{"theme":1}']) {
      stubBrowser({ stored });
      expect(applySettings(), stored).toEqual(DEFAULT_SETTINGS);
    }
    stubBrowser({ storage: false });
    expect(applySettings()).toEqual(DEFAULT_SETTINGS);
  });

  beforeEach(() => stubBrowser());
});

describe("saveSettings", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("stores the settings and applies them", () => {
    const { root, items } = stubBrowser();
    expect(saveSettings({ theme: "dark" })).toEqual({ theme: "dark" });
    expect(items.get(SETTINGS_KEY)).toBe('{"theme":"dark"}');
    expect(root.dataset.theme).toBe("dark");
  });

  it("applies them even when they can't be stored", () => {
    const { root } = stubBrowser({ storage: false });
    saveSettings({ theme: "dark" });
    expect(root.dataset.theme).toBe("dark");
  });
});

describe("the inline script", () => {
  afterEach(() => vi.unstubAllGlobals());

  // Run as the browser runs it, from its text alone: it may not use anything from outside itself.
  it("applies the stored settings on its own", () => {
    const { root } = stubBrowser({ stored: '{"theme":"dark"}' });
    new Function(APPLY_SETTINGS_SCRIPT)();
    expect(root.dataset.theme).toBe("dark");

    const fresh = stubBrowser({ systemIsDark: false });
    new Function(APPLY_SETTINGS_SCRIPT)();
    expect(fresh.root.dataset.theme).toBe("light");
  });
});
