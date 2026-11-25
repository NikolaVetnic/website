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

// Drops several items at once, each on its target cell or the next free one, in the order given; the items that
// aren't moving keep their cells.
export function moveManyToCells<T extends { cell: Cell }>(items: T[], targets: Map<number, Cell>, size: GridSize): T[] {
  const occupied = items.filter((_, index) => !targets.has(index)).map((item) => item.cell);
  const cells = new Map<number, Cell>();
  for (const [index, target] of targets) {
    const cell = findFreeCell(target, occupied, size);
    occupied.push(cell);
    cells.set(index, cell);
  }

  return items.map((item, index) => (cells.has(index) ? { ...item, cell: cells.get(index)! } : item));
}

export type Box = { x: number; y: number; width: number; height: number };

// The box between two corners, whichever way it was drawn.
export function getBox(start: Point, end: Point): Box {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

// Whether two boxes share any area; touching edges don't count.
export function boxesOverlap(a: Box, b: Box): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}
