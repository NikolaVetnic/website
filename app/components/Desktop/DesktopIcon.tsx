import type { KeyboardEvent, PointerEvent } from "react";

import type { DesktopApp } from "~/desktop/apps";
import type { Point } from "~/desktop/grid";
import "./DesktopIcon.css";

type DesktopIconProps = {
  app: DesktopApp;
  point: Point;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (id: string, event: PointerEvent<HTMLElement>) => void;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
};

function DesktopIcon({ app, point, isSelected, isDragging, onPointerDown, onSelect, onOpen }: DesktopIconProps) {
  const className = [
    "desktop-icon",
    isSelected ? "desktop-icon--selected" : "",
    isDragging ? "desktop-icon--dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onOpen(app.id);
    }
  };

  return (
    <button
      type="button"
      className={className}
      style={{ left: point.x, top: point.y }}
      onPointerDown={(event) => onPointerDown(app.id, event)}
      onClick={() => onSelect(app.id)}
      onFocus={() => onSelect(app.id)}
      onDoubleClick={() => onOpen(app.id)}
      onKeyDown={handleKeyDown}
    >
      <img className="desktop-icon__image" src={app.icon} alt="" draggable={false} />
      <span className="desktop-icon__caption">{app.title}</span>
    </button>
  );
}

export default DesktopIcon;
