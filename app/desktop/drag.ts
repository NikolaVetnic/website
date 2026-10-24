import { clamp, findFreeCell, type Cell, type GridSize, type Point } from "./grid";

export type Size = { width: number; height: number };

// Where a dragged item is drawn: its start point moved by the pointer, kept fully inside the area.
export function getDragPoint(origin: Point, dx: number, dy: number, item: Size, area: Size): Point {
  return {
    x: clamp(origin.x + dx, 0, Math.max(0, area.width - item.width)),
    y: clamp(origin.y + dy, 0, Math.max(0, area.height - item.height)),
  };
}

// Drops the item at `index` on the target cell, or on the next free cell when another item holds it.
export function moveToCell<T extends { cell: Cell }>(items: T[], index: number, target: Cell, size: GridSize): T[] {
  const others = items.filter((_, other) => other !== index).map((item) => item.cell);
  const cell = findFreeCell(target, others, size);

  return items.map((item, other) => (other === index ? { ...item, cell } : item));
}
