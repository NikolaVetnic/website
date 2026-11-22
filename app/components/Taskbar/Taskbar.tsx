import { getApp, type AppId } from "~/desktop/apps";
import type { DesktopWindow } from "~/desktop/windows";
import Clock from "./Clock";
import "./Taskbar.css";

type TaskbarProps = {
  windows: DesktopWindow[];
  focusedId: AppId | null;
  onToggle: (id: AppId) => void;
  onShowDesktop: () => void;
};

function Taskbar({ windows, focusedId, onToggle, onShowDesktop }: TaskbarProps) {
  return (
    <footer className="taskbar">
      <button type="button" className="taskbar__home" aria-label="Show the desktop" onClick={onShowDesktop}>
        <img className="taskbar__logo" src="/icon-192.png" alt="" draggable={false} />
      </button>
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
              <button type="button" className={className} aria-pressed={id === focusedId} onClick={() => onToggle(id)}>
                <img className="taskbar__icon" src={app.icon} alt="" draggable={false} />
                <span className="taskbar__title">{app.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Clock />
    </footer>
  );
}

export default Taskbar;
