import { useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

import type { AppId, DesktopApp } from "~/desktop/apps";
import type { Point } from "~/desktop/grid";
import "./DesktopIcon.css";

// How far a press may wander and still count as a tap rather than the end of a drag.
const TAP_DISTANCE = 10;

type Press = { pointerType: string; x: number; y: number };

type DesktopIconProps = {
  app: DesktopApp;
  point: Point;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (id: string, event: PointerEvent<HTMLElement>) => void;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
};

function DesktopIcon({ app, point, isSelected, isDragging, onPointerDown, onSelect, onOpen }: DesktopIconProps) {
  const press = useRef<Press | null>(null);

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

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    press.current = { pointerType: event.pointerType, x: event.clientX, y: event.clientY };
    onPointerDown(app.id, event);
  };

  // A mouse selects with a click and opens with a double-click; a finger or a pen opens with a single tap.
  // A click from the keyboard (Space) has no press and only selects; Enter opens.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const start = press.current;
    press.current = null;

    const isTap = start !== null && Math.hypot(event.clientX - start.x, event.clientY - start.y) < TAP_DISTANCE;
    if (isTap && start.pointerType !== "mouse") {
      onOpen(app.id);
    } else {
      onSelect(app.id);
    }
  };

  return (
    <button
      type="button"
      className={className}
      style={{ left: point.x, top: point.y }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
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
