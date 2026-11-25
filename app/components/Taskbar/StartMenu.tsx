import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { BOOT_KEY } from "~/boot/boot";
import { DESKTOP_APPS, getApp, getFolderApps, type AppId, type DesktopApp } from "~/desktop/apps";
import { notePress } from "~/desktop/launch";
import { searchApps } from "~/desktop/search";
import { SITE_NAME } from "~/meta";
import "./StartMenu.css";

// The apps on the desktop, then each folder's, under the folder's title.
const SECTIONS = [
  { title: "Apps", apps: DESKTOP_APPS },
  ...DESKTOP_APPS.filter((folder) => getFolderApps(folder.id).length > 0).map((folder) => ({
    title: folder.title,
    apps: getFolderApps(folder.id),
  })),
];
const ALL_APPS = SECTIONS.flatMap((section) => section.apps);

// Tiles per row (StartMenu.css), for the arrow keys.
const COLUMNS = 4;

const getFolderTitle = (app: DesktopApp) => (app.folder ? getApp(app.folder).title : "");

// Starts the site again from the boot screen, which plays only on a visit's first page (boot.ts).
function restart() {
  try {
    window.sessionStorage.removeItem(BOOT_KEY);
  } catch {
    // Without storage the boot screen doesn't play; the desktop just loads again.
  }
  window.location.assign("/");
}

type StartMenuProps = {
  // On a phone the search field waits for a tap, rather than raising the keyboard over the menu.
  isPhone: boolean;
  onOpenApp: (id: AppId) => void;
  // Closes the menu; `refocus` puts focus back on the button that opened it (Escape).
  onClose: (refocus: boolean) => void;
};

// The taskbar's start menu: every app as a tile, and a search field that has focus, so typing finds an app, the
// arrow keys move between the tiles and Enter opens the one that's lit.
function StartMenu({ isPhone, onOpenApp, onClose }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const optionId = (index: number) => `${listId}-${index}`;

  const results = query.trim() ? searchApps(ALL_APPS, query, getFolderTitle) : null;
  const shown = results ?? ALL_APPS;
  const sections = results ? [{ title: results.length ? "Results" : "No apps match", apps: results }] : SECTIONS;

  // A press anywhere else closes it, as does leaving the page; the start button toggles it itself.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!menuRef.current?.contains(target) && !target.closest?.(".taskbar__home")) {
        onClose(false);
      }
    };
    const handleBlur = () => onClose(false);

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("blur", handleBlur);
    };
  }, [onClose]);

  const open = (index: number) => {
    const app = shown[index];
    if (app) {
      // The window grows out of the tile (launch.ts), which goes as the menu closes.
      notePress(document.getElementById(optionId(index)));
      onOpenApp(app.id);
      onClose(false);
    }
  };

  const move = (step: number) => {
    if (shown.length > 0) {
      setActive(Math.min(Math.max(active + step, 0), shown.length - 1));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -COLUMNS, ArrowDown: COLUMNS };
    if (event.key in steps) {
      // Left and right move the caret while there's text to move it through.
      if (query && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        return;
      }
      event.preventDefault();
      move(steps[event.key]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      open(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose(true);
    }
  };

  let index = 0;
  return (
    <div ref={menuRef} className="start-menu" role="dialog" aria-label="Start">
      <div className="start-menu__search">
        <svg className="start-menu__search-icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" />
        </svg>
        <input
          className="start-menu__input"
          type="search"
          placeholder="Search apps"
          aria-label="Search apps"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={shown.length > 0 ? optionId(active) : undefined}
          autoComplete="off"
          spellCheck={false}
          autoFocus={!isPhone}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div id={listId} className="start-menu__apps" role="listbox" aria-label="Apps">
        {sections.map((section) => (
          <div key={section.title} role="group" aria-label={section.title}>
            <h3 className="start-menu__heading" aria-hidden="true">
              {section.title}
            </h3>
            <div className="start-menu__tiles">
              {section.apps.map((app) => {
                const tileIndex = index++;
                return (
                  <div
                    key={app.id}
                    id={optionId(tileIndex)}
                    className={`start-menu__tile${tileIndex === active ? " start-menu__tile--active" : ""}`}
                    role="option"
                    aria-selected={tileIndex === active}
                    onPointerMove={() => setActive(tileIndex)}
                    onClick={() => open(tileIndex)}
                  >
                    <img className="start-menu__icon" src={app.icon} alt="" draggable={false} />
                    <span className="start-menu__title">{app.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="start-menu__footer">
        <img className="start-menu__logo" src="/icon-192.png" alt="" draggable={false} />
        <span className="start-menu__name">{SITE_NAME}</span>
        <button type="button" className="start-menu__restart" title="Restart" aria-label="Restart" onClick={restart}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 2v5.5" />
            <path d="M4.6 4.2a5 5 0 1 0 6.8 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default StartMenu;
