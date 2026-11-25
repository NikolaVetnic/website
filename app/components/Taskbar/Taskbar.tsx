import { useCallback, useRef, useState } from "react";

import { getApp, type AppId } from "~/desktop/apps";
import type { DesktopWindow } from "~/desktop/windows";
import usePhoneLayout from "~/hooks/usePhoneLayout";
import Clock from "./Clock";
import StartMenu from "./StartMenu";
import "./Taskbar.css";

type TaskbarProps = {
  windows: DesktopWindow[];
  focusedId: AppId | null;
  onToggle: (id: AppId) => void;
  onShowDesktop: () => void;
  onOpenApp: (id: AppId) => void;
};

// The logo opens the start menu, and the slim button at the far right shows the desktop. On a phone the logo is the
// home button instead, as the home screen already lists the apps.
function Taskbar({ windows, focusedId, onToggle, onShowDesktop, onOpenApp }: TaskbarProps) {
  const isPhone = usePhoneLayout();
  const homeRef = useRef<HTMLButtonElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback((refocus: boolean) => {
    setIsMenuOpen(false);
    if (refocus) {
      homeRef.current?.focus();
    }
  }, []);

  return (
    <footer className="taskbar">
      <button
        ref={homeRef}
        type="button"
        className="taskbar__home"
        aria-label={isPhone ? "Show the desktop" : "Start"}
        aria-haspopup={isPhone ? undefined : "dialog"}
        aria-expanded={isPhone ? undefined : isMenuOpen}
        onClick={isPhone ? onShowDesktop : () => setIsMenuOpen(!isMenuOpen)}
      >
        <img className="taskbar__logo" src="/icon-192.png" alt="" draggable={false} />
      </button>
      {isMenuOpen && !isPhone ? <StartMenu onOpenApp={onOpenApp} onClose={closeMenu} /> : null}
      <ul className="taskbar__windows" aria-label="Open windows">
        {windows.map(({ id, isMinimized }) => {
          const app = getApp(id);
          const className = [
            "taskbar__window",
            id === focusedId ? "taskbar__window--focused" : "",
            isMinimized ? "taskbar__window--minimized" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={id}>
              <button
                type="button"
                className={className}
                // Where its window shrinks to when minimized (launch.ts).
                data-app-id={id}
                aria-pressed={id === focusedId}
                onClick={() => onToggle(id)}
              >
                <img className="taskbar__icon" src={app.icon} alt="" draggable={false} />
                <span className="taskbar__title">{app.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Clock />
      <button
        type="button"
        className="taskbar__show-desktop"
        aria-label="Show the desktop"
        title="Show the desktop"
        onClick={onShowDesktop}
      />
    </footer>
  );
}

export default Taskbar;
