import { useEffect, useLayoutEffect, useRef } from "react";

import type { Size } from "~/desktop/drag";
import type { Point } from "~/desktop/grid";
import { fitMenu } from "~/desktop/menu";
import "./DesktopContextMenu.css";

type DesktopContextMenuProps = {
  point: Point;
  bounds: Size;
  onAutoArrange: () => void;
  onClose: () => void;
};

function DesktopContextMenu({ point, bounds, onAutoArrange, onClose }: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Placed once its size is known and before it is painted, so it never runs off the desktop.
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const { x, y } = fitMenu(point, { width: menu.offsetWidth, height: menu.offsetHeight }, bounds);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.querySelector("button")?.focus();
  }, [point, bounds]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("pointerdown", onClose);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);

    return () => {
      window.removeEventListener("pointerdown", onClose);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="desktop-context-menu"
      role="menu"
      aria-label="Desktop menu"
      onPointerDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <p className="desktop-context-menu__header">Icons</p>
      <button type="button" className="desktop-context-menu__item" role="menuitem" onClick={onAutoArrange}>
        Auto Arrange
      </button>
    </div>
  );
}

export default DesktopContextMenu;
