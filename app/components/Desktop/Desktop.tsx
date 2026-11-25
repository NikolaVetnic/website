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
import { boxesOverlap, getBox, getDragPoint, moveManyToCells, type Box } from "~/desktop/drag";
import {
  arrangeInColumns,
  cellToPoint,
  clamp,
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
import DesktopSelection from "./DesktopSelection";
import DesktopWidgets from "./DesktopWidgets";
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

// The selected icons being dragged, and how far: each moves by the same offset, kept inside the desktop.
type IconDrag = { ids: AppId[]; dx: number; dy: number };

// A selection box being drawn: where it started, and the selection it adds to (Ctrl or Cmd held), if any.
type BoxStart = { origin: Point; base: AppId[] };

const ICON_SIZE = { width: ICON_WIDTH, height: ICON_HEIGHT };

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
  const [selected, setSelected] = useState<AppId[]>([]);
  const [box, setBox] = useState<Box | null>(null);
  const boxStart = useRef<BoxStart | null>(null);
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

  const getIconPoint = (icon: PlacedIcon): Point => {
    const origin = cellToPoint(ICON_GRID, icon.cell);
    return drag?.ids.includes(icon.app.id) && size ? getDragPoint(origin, drag.dx, drag.dy, ICON_SIZE, size) : origin;
  };

  // How far the group moves: as far as the icon under the pointer can go and stay inside the desktop.
  const getDragOffset = ({ id, dx, dy }: DragMove): Point | null => {
    const icon = placed.find((entry) => entry.app.id === id);
    if (!icon || !size) {
      return null;
    }

    const origin = cellToPoint(ICON_GRID, icon.cell);
    const point = getDragPoint(origin, dx, dy, ICON_SIZE, size);
    return { x: point.x - origin.x, y: point.y - origin.y };
  };

  // An icon dragged from outside the selection is dragged alone, and becomes the selection.
  const getDraggedIds = (id: AppId) => (selected.includes(id) ? selected : [id]);

  const startDrag = usePointerDrag({
    onMove: (move) => {
      const ids = getDraggedIds(move.id as AppId);
      if (ids !== selected) {
        setSelected(ids);
      }
      const offset = getDragOffset(move);
      setDrag(offset ? { ids, dx: offset.x, dy: offset.y } : null);
    },
    onDrop: (move) => {
      const ids = getDraggedIds(move.id as AppId);
      const offset = getDragOffset(move);
      setDrag(null);
      if (!offset || !grid || !size) {
        return;
      }

      const targets = new Map<number, Cell>();
      placed.forEach((icon, index) => {
        if (ids.includes(icon.app.id)) {
          const origin = cellToPoint(ICON_GRID, icon.cell);
          targets.set(index, pointToCell(ICON_GRID, getDragPoint(origin, offset.x, offset.y, ICON_SIZE, size), grid));
        }
      });
      setIcons(moveManyToCells(placed, targets, grid));
    },
    onCancel: () => setDrag(null),
  });

  // Drawing a box over the desktop selects the icons it touches, added to the selection from before if Ctrl or Cmd
  // was held.
  const startBox = usePointerDrag({
    onMove: ({ dx, dy }) => {
      const start = boxStart.current;
      if (!start || !size) {
        return;
      }

      const end = {
        x: clamp(start.origin.x + dx, 0, size.width),
        y: clamp(start.origin.y + dy, 0, size.height),
      };
      const next = getBox(start.origin, end);
      const touched = placed
        .filter((icon) => boxesOverlap(next, { ...cellToPoint(ICON_GRID, icon.cell), ...ICON_SIZE }))
        .map((icon) => icon.app.id);
      setBox(next);
      setSelected([...start.base, ...touched.filter((id) => !start.base.includes(id))]);
    },
    onDrop: () => setBox(null),
    onCancel: () => setBox(null),
  });

  // Ctrl or Cmd and a click adds an icon to the selection, or takes it out; a plain click selects it alone.
  const handleSelect = (id: AppId, isAdding: boolean) => {
    if (!isAdding) {
      setSelected([id]);
    } else {
      setSelected(selected.includes(id) ? selected.filter((other) => other !== id) : [...selected, id]);
    }
  };

  const handleBackgroundPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const isAdding = event.ctrlKey || event.metaKey;
    if (!isAdding) {
      setSelected([]);
    }
    // The phone's home screen scrolls when a finger drags over it.
    if (!isPhone) {
      const rect = event.currentTarget.getBoundingClientRect();
      boxStart.current = {
        origin: { x: event.clientX - rect.left, y: event.clientY - rect.top },
        base: isAdding ? selected : [],
      };
      startBox("box", event);
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
      className={`desktop${isAnimated ? " desktop--animated" : ""}${box ? " desktop--selecting" : ""}`}
      style={style}
      aria-label="Desktop"
      onPointerDown={handleBackgroundPointerDown}
      onContextMenu={handleContextMenu}
    >
      {/* Before the icons, so an icon dragged over a widget stays on top of it. */}
      <DesktopWidgets />
      {placed.map((icon) => (
        <DesktopIcon
          key={icon.app.id}
          app={icon.app}
          point={getIconPoint(icon)}
          isSelected={selected.includes(icon.app.id)}
          isDragging={drag?.ids.includes(icon.app.id) ?? false}
          opensOnClick={isPhone}
          onPointerDown={isPhone ? noDrag : startDrag}
          onSelect={handleSelect}
          onOpen={(id) => onOpenApp?.(id)}
        />
      ))}
      {box ? <DesktopSelection box={box} /> : null}
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
