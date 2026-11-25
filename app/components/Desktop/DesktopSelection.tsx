import type { Box } from "~/desktop/drag";
import "./DesktopSelection.css";

// The box being drawn over the desktop to select icons (Desktop.tsx).
function DesktopSelection({ box }: { box: Box }) {
  return (
    <div
      className="desktop-selection"
      aria-hidden="true"
      style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
    />
  );
}

export default DesktopSelection;
