import type { ReactNode } from "react";

import type { Accent, Settings as SettingsValues, TextSize, Theme, Wallpaper } from "~/settings/settings";
import useSettings from "~/settings/useSettings";
import "./Settings.css";

type Option<Value> = { value: Value; label: string };

const THEME_OPTIONS: Option<Theme>[] = [
  { value: "system", label: "Match system" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const ACCENT_OPTIONS: Option<Accent>[] = [
  { value: "blue", label: "Blue" },
  { value: "teal", label: "Teal" },
  { value: "purple", label: "Purple" },
  { value: "orange", label: "Orange" },
  { value: "rose", label: "Rose" },
];

const WALLPAPER_OPTIONS: Option<Wallpaper>[] = [
  { value: "ocean", label: "Ocean" },
  { value: "dusk", label: "Dusk" },
  { value: "forest", label: "Forest" },
  { value: "ember", label: "Ember" },
  { value: "graphite", label: "Graphite" },
];

const TEXT_SIZE_OPTIONS: Option<TextSize>[] = [
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
];

// One setting as a group of radio buttons drawn as cards, each with a picture of its choice above its label.
function Choice<Name extends keyof SettingsValues>({
  name,
  legend,
  options,
  preview,
  compact = false,
}: {
  name: Name;
  legend: string;
  options: Option<SettingsValues[Name]>[];
  preview: (value: SettingsValues[Name]) => ReactNode;
  compact?: boolean;
}) {
  const [settings, update] = useSettings();

  return (
    <fieldset className="settings__field">
      <legend className="settings__label">{legend}</legend>
      <div className={`settings__options${compact ? " settings__options--compact" : ""}`}>
        {options.map((option) => (
          <label key={option.value} className="settings__option">
            <input
              className="settings__radio"
              type="radio"
              name={name}
              value={option.value}
              checked={settings[name] === option.value}
              onChange={() => update({ [name]: option.value })}
            />
            {preview(option.value)}
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// The Settings window: how the site looks, for this visitor, in this browser.
function Settings() {
  return (
    <div className="settings">
      <section className="settings__section" aria-labelledby="settings-appearance">
        <h2 id="settings-appearance" className="settings__heading">
          Appearance
        </h2>
        <Choice
          name="theme"
          legend="Theme"
          options={THEME_OPTIONS}
          preview={(theme) => (
            <span className={`settings__preview settings__preview--${theme}`} aria-hidden="true">
              <span className="settings__preview-bar" />
              <span className="settings__preview-line" />
              <span className="settings__preview-line settings__preview-line--short" />
            </span>
          )}
        />
        <Choice
          name="accent"
          legend="Accent colour"
          options={ACCENT_OPTIONS}
          compact
          preview={(accent) => <span className="settings__swatch" data-accent={accent} aria-hidden="true" />}
        />
        <Choice
          name="wallpaper"
          legend="Wallpaper"
          options={WALLPAPER_OPTIONS}
          compact
          preview={(wallpaper) => (
            <span className="settings__wallpaper" data-wallpaper={wallpaper} aria-hidden="true" />
          )}
        />
        <Choice
          name="textSize"
          legend="Text size in windows"
          options={TEXT_SIZE_OPTIONS}
          compact
          preview={(size) => (
            <span className={`settings__sample settings__sample--${size}`} aria-hidden="true">
              Aa
            </span>
          )}
        />
        <p className="settings__note">Settings are kept in this browser only.</p>
      </section>
    </div>
  );
}

export default Settings;
