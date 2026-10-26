import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { DESKTOP_APPS, type AppId, type DesktopApp } from "~/desktop/apps";
import { getDragPoint, moveToCell } from "~/desktop/drag";
import {
  arrangeInColumns,
  cellToPoint,
  fitIntoGrid,
  getGridSize,
  pointToCell,
  type Cell,
  type GridSize,
  type GridSpec,
  type Point,
} from "~/desktop/grid";
import useElementSize from "~/hooks/useElementSize";
import usePhoneLayout from "~/hooks/usePhoneLayout";
import usePointerDrag, { type DragMove } from "~/hooks/usePointerDrag";
import DesktopContextMenu from "./DesktopContextMenu";
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

const noDrag = () => {};

// The icons in their fresh-desktop order, filling the grid column by column.
function arrangeIcons(size: GridSize): PlacedIcon[] {
  const cells = arrangeInColumns(DESKTOP_APPS.length, size);
  return DESKTOP_APPS.map((app, index) => ({ app, cell: cells[index] }));
}

// One tall column; the first measurement in the browser folds it into the real grid.
function getInitialIcons(): PlacedIcon[] {
  return arrangeIcons({ cols: 1, rows: DESKTOP_APPS.length });
}

type DesktopProps = {
  onOpenApp?: (id: AppId) => void;
};

function Desktop({ onOpenApp }: DesktopProps) {
  const desktopRef = useRef<HTMLElement | null>(null);
  const size = useElementSize(desktopRef);
  // The phone layout's home screen is a plain grid: icons stay in their order and there is no menu to arrange them.
  const isPhone = usePhoneLayout();
  const grid = useMemo(() => (size ? getGridSize(ICON_GRID, size.width, size.height) : null), [size]);

  const [icons, setIcons] = useState(getInitialIcons);
  const [selectedId, setSelectedId] = useState<AppId | null>(null);
  const [drag, setDrag] = useState<IconDrag | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [menuPoint, setMenuPoint] = useState<Point | null>(null);

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

  const getIconDragPoint = ({ id, dx, dy }: DragMove): Point | null => {
    const icon = placed.find((entry) => entry.app.id === id);
    if (!icon || !size) {
      return null;
    }

    return getDragPoint(cellToPoint(ICON_GRID, icon.cell), dx, dy, { width: ICON_WIDTH, height: ICON_HEIGHT }, size);
  };

  const startDrag = usePointerDrag({
    onMove: (move) => {
      const point = getIconDragPoint(move);
      setDrag(point ? { id: move.id, point } : null);
    },
    onDrop: (move) => {
      const point = getIconDragPoint(move);
      setDrag(null);
      if (!point || !grid) {
        return;
      }

      const index = placed.findIndex((entry) => entry.app.id === move.id);
      setIcons(moveToCell(placed, index, pointToCell(ICON_GRID, point, grid), grid));
    },
    onCancel: () => setDrag(null),
  });

  const handleBackgroundPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      setSelectedId(null);
    }
  };

  const handleContextMenu = (event: MouseEvent<HTMLElement>) => {
    if (isPhone || event.target !== event.currentTarget) {
      return;
    }

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const closeMenu = useCallback(() => setMenuPoint(null), []);

  const handleAutoArrange = () => {
    closeMenu();
    if (grid) {
      setIcons(arrangeIcons(grid));
    }
  };

  const handlePersonalize = () => {
    closeMenu();
    onOpenApp?.("settings");
  };

  const style = {
    "--desktop-icon-width": `${ICON_WIDTH}px`,
    "--desktop-icon-height": `${ICON_HEIGHT}px`,
  } as CSSProperties;

  return (
    <section
      ref={desktopRef}
      className={`desktop${isAnimated ? " desktop--animated" : ""}`}
      style={style}
      aria-label="Desktop"
      onPointerDown={handleBackgroundPointerDown}
      onContextMenu={handleContextMenu}
    >
      {placed.map(({ app, cell }) => (
        <DesktopIcon
          key={app.id}
          app={app}
          point={drag?.id === app.id ? drag.point : cellToPoint(ICON_GRID, cell)}
          isSelected={selectedId === app.id}
          isDragging={drag?.id === app.id}
          opensOnClick={isPhone}
          onPointerDown={isPhone ? noDrag : startDrag}
          onSelect={setSelectedId}
          onOpen={(id) => onOpenApp?.(id)}
        />
      ))}
      {menuPoint && size ? (
        <DesktopContextMenu
          point={menuPoint}
          bounds={size}
          onAutoArrange={handleAutoArrange}
          onPersonalize={handlePersonalize}
          onClose={closeMenu}
        />
      ) : null}
    </section>
  );
}

export default Desktop;
