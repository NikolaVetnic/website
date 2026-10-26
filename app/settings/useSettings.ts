import { useSyncExternalStore } from "react";

import { applySettings, DEFAULT_SETTINGS, saveSettings, SETTINGS_KEY, type Settings } from "./settings";

// The settings as the page has them, shared by every component that asks. Null until the first component
// subscribes: storage is read then, after the page has hydrated, never during a render.
let current: Settings | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

// Following the system's light or dark, and settings changed in another tab.
function handleSystemChange() {
  if (current?.theme === "system") {
    applySettings(current);
  }
}

function handleStorage(event: StorageEvent) {
  if (event.key === SETTINGS_KEY) {
    current = applySettings();
    notify();
  }
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorage);
  }
  listeners.add(listener);
  if (!current) {
    current = applySettings();
    notify();
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getSnapshot(): Settings {
  return current ?? DEFAULT_SETTINGS;
}

// The defaults during pre-rendering and hydration, as in the HTML; the visitor's own settings from then on.
export default function useSettings(): [Settings, (change: Partial<Settings>) => void] {
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_SETTINGS);

  const update = (change: Partial<Settings>) => {
    current = saveSettings({ ...getSnapshot(), ...change });
    notify();
  };

  return [settings, update];
}
