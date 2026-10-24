import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { APPS, type AppId, type DesktopApp } from "~/desktop/apps";
import {
  arrangeInColumns,
  cellToPoint,
  clamp,
  findFreeCell,
  fitIntoGrid,
  getGridSize,
  pointToCell,
  type Cell,
  type GridSpec,
  type Point,
} from "~/desktop/grid";
import useElementSize from "~/hooks/useElementSize";
import usePointerDrag, { type DragMove } from "~/hooks/usePointerDrag";
import DesktopIcon from "./DesktopIcon";
import "./Desktop.css";

const ICON_WIDTH = 88;
const ICON_HEIGHT = 96;

const ICON_GRID: GridSpec = {
  cellWidth: 96,
  cellHeight: 104,
  offsetX: 12,
  offsetY: 12,
  itemWidth: ICON_WIDTH,
  itemHeight: ICON_HEIGHT,
};

type PlacedIcon = { app: DesktopApp; cell: Cell };

type IconDrag = { id: string; point: Point };

// One tall column; the first measurement in the browser folds it into the real grid.
function getInitialIcons(): PlacedIcon[] {
  const cells = arrangeInColumns(APPS.length, { cols: 1, rows: APPS.length });
  return APPS.map((app, index) => ({ app, cell: cells[index] }));
}

type DesktopProps = {
  onOpenApp?: (id: AppId) => void;
};

function Desktop({ onOpenApp }: DesktopProps) {
  const desktopRef = useRef<HTMLElement | null>(null);
  const size = useElementSize(desktopRef);
  const grid = useMemo(() => (size ? getGridSize(ICON_GRID, size.width, size.height) : null), [size]);

  const [icons, setIcons] = useState(getInitialIcons);
  const [selectedId, setSelectedId] = useState<AppId | null>(null);
  const [drag, setDrag] = useState<IconDrag | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Stored cells can fall outside the grid when the screen shrinks; show those icons inside it.
  const placed = useMemo(() => (grid ? fitIntoGrid(icons, grid) : icons), [icons, grid]);

  // Icons slide into place only after the first measured layout has been painted, so the page
  // does not open with icons gliding from the build-time column into the real grid.
  useEffect(() => {
    if (!size || isAnimated) {
      return;
    }

    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsAnimated(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [size, isAnimated]);

  const getDragPoint = ({ id, dx, dy }: DragMove): Point | null => {
    const icon = placed.find((entry) => entry.app.id === id);
    if (!icon || !size) {
      return null;
    }

    const origin = cellToPoint(ICON_GRID, icon.cell);
    return {
      x: clamp(origin.x + dx, 0, Math.max(0, size.width - ICON_WIDTH)),
      y: clamp(origin.y + dy, 0, Math.max(0, size.height - ICON_HEIGHT)),
    };
  };

  const startDrag = usePointerDrag({
    onMove: (move) => {
      const point = getDragPoint(move);
      setDrag(point ? { id: move.id, point } : null);
    },
    onDrop: (move) => {
      const point = getDragPoint(move);
      setDrag(null);
      if (!point || !grid) {
        return;
      }

      const target = pointToCell(ICON_GRID, point, grid);
      const others = placed.filter((entry) => entry.app.id !== move.id).map((entry) => entry.cell);
      const cell = findFreeCell(target, others, grid);

      setIcons(placed.map((entry) => (entry.app.id === move.id ? { ...entry, cell } : entry)));
    },
    onCancel: () => setDrag(null),
  });

  const handleBackgroundPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      setSelectedId(null);
    }
  };

  const style = {
    "--desktop-icon-width": `${ICON_WIDTH}px`,
    "--desktop-icon-height": `${ICON_HEIGHT}px`,
  } as CSSProperties;

  return (
    <main
      ref={desktopRef}
      className={`desktop${isAnimated ? " desktop--animated" : ""}`}
      style={style}
      aria-label="Desktop"
      onPointerDown={handleBackgroundPointerDown}
    >
      {placed.map(({ app, cell }) => (
        <DesktopIcon
          key={app.id}
          app={app}
          point={drag?.id === app.id ? drag.point : cellToPoint(ICON_GRID, cell)}
          isSelected={selectedId === app.id}
          isDragging={drag?.id === app.id}
          onPointerDown={startDrag}
          onSelect={setSelectedId}
          onOpen={(id) => onOpenApp?.(id)}
        />
      ))}
    </main>
  );
}

export default Desktop;
