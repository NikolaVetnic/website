import type { Theme } from "~/settings/settings";
import useSettings from "~/settings/useSettings";
import "./Settings.css";

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "system", label: "Match system" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

// The Settings window: how the site looks, for this visitor, in this browser.
function Settings() {
  const [settings, update] = useSettings();

  return (
    <div className="settings">
      <section className="settings__section" aria-labelledby="settings-appearance">
        <h2 id="settings-appearance" className="settings__heading">
          Appearance
        </h2>
        <fieldset className="settings__field">
          <legend className="settings__label">Theme</legend>
          <div className="settings__options">
            {THEME_OPTIONS.map((option) => (
              <label key={option.value} className="settings__option">
                <input
                  className="settings__radio"
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={settings.theme === option.value}
                  onChange={() => update({ theme: option.value })}
                />
                <span className={`settings__preview settings__preview--${option.value}`} aria-hidden="true">
                  <span className="settings__preview-bar" />
                  <span className="settings__preview-line" />
                  <span className="settings__preview-line settings__preview-line--short" />
                </span>
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="settings__note">Settings are kept in this browser only.</p>
      </section>
    </div>
  );
}

export default Settings;
