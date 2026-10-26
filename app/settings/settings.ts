// The visitor's appearance settings, kept in their browser. The pre-rendered page has the defaults; a script in
// the page's <head> applies the stored ones before the first paint (see root.tsx), and SettingsProvider keeps
// them in step afterwards.

export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export type Settings = { theme: Theme };

export const DEFAULT_SETTINGS: Settings = { theme: "system" };

export const SETTINGS_KEY = "appearance";

// The allowed values of each setting, so stored values are checked rather than trusted.
export const SETTING_VALUES: { [Name in keyof Settings]: readonly Settings[Name][] } = { theme: THEMES };

// Puts settings on <html>, where the stylesheets read them (`data-theme`, and `color-scheme` for scrollbars and
// form controls), and returns them: the given ones, else the stored ones. A setting that is missing or not allowed
// gets its default, so an old or edited entry never breaks the page, and storage can be unavailable (private
// windows, blocked site data). Self-contained, with no imports or outside names, because its source also runs as
// the inline script in <head>, before anything else.
export function applyStoredSettings(
  key: string,
  allowed: Record<string, readonly string[]>,
  defaults: Settings,
  given?: Settings,
): Settings {
  let source: Record<string, unknown> = given ?? {};
  if (!given) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "{}");
      source = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
    } catch {
      // Unavailable or not JSON: the defaults.
    }
  }

  const settings: Settings = { ...defaults };
  for (const name of Object.keys(defaults) as (keyof Settings)[]) {
    const value = source[name];
    if (typeof value === "string" && allowed[name].includes(value)) {
      settings[name] = value as Settings[typeof name];
    }
  }

  const dark =
    settings.theme === "dark" ||
    (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  root.style.colorScheme = dark ? "dark" : "light";

  return settings;
}

// Applies the stored settings, or the given ones.
export function applySettings(given?: Settings): Settings {
  return applyStoredSettings(SETTINGS_KEY, SETTING_VALUES, DEFAULT_SETTINGS, given);
}

// Stores the settings and applies them. Without storage they last until the visitor leaves the page.
export function saveSettings(settings: Settings): Settings {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Not stored; applied all the same.
  }
  return applySettings(settings);
}

// The inline script for <head>: applyStoredSettings with this module's key, values and defaults.
export const APPLY_SETTINGS_SCRIPT = `(${applyStoredSettings.toString()})(${JSON.stringify(SETTINGS_KEY)}, ${JSON.stringify(
  SETTING_VALUES,
)}, ${JSON.stringify(DEFAULT_SETTINGS)});`;
