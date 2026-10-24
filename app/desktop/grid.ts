export type Point = { x: number; y: number };

export type Cell = { col: number; row: number };

export type GridSpec = {
  cellWidth: number;
  cellHeight: number;
  offsetX: number;
  offsetY: number;
  itemWidth: number;
  itemHeight: number;
};

export type GridSize = { cols: number; rows: number };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// How many whole items fit; always at least one cell so nothing gets lost on tiny screens.
export function getGridSize(spec: GridSpec, width: number, height: number): GridSize {
  const cols = Math.floor((width - spec.offsetX - spec.itemWidth) / spec.cellWidth) + 1;
  const rows = Math.floor((height - spec.offsetY - spec.itemHeight) / spec.cellHeight) + 1;

  return { cols: Math.max(1, cols), rows: Math.max(1, rows) };
}

export function cellToPoint(spec: GridSpec, cell: Cell): Point {
  return {
    x: spec.offsetX + cell.col * spec.cellWidth,
    y: spec.offsetY + cell.row * spec.cellHeight,
  };
}

export function pointToCell(spec: GridSpec, point: Point, size: GridSize): Cell {
  return {
    col: clamp(Math.round((point.x - spec.offsetX) / spec.cellWidth), 0, size.cols - 1),
    row: clamp(Math.round((point.y - spec.offsetY) / spec.cellHeight), 0, size.rows - 1),
  };
}

export function isInGrid(cell: Cell, size: GridSize): boolean {
  return cell.col >= 0 && cell.col < size.cols && cell.row >= 0 && cell.row < size.rows;
}

function cellKey(cell: Cell): string {
  return `${cell.col}:${cell.row}`;
}

// Walks the grid column by column (top to bottom, then the next column), starting at the target
// and wrapping around to the first cell. Returns the target itself when the grid is full.
export function findFreeCell(target: Cell, occupied: Cell[], size: GridSize): Cell {
  const taken = new Set(occupied.map(cellKey));
  const total = size.cols * size.rows;
  const start = target.col * size.rows + target.row;

  for (let step = 0; step < total; step++) {
    const index = (start + step) % total;
    const cell = { col: Math.floor(index / size.rows), row: index % size.rows };

    if (!taken.has(cellKey(cell))) {
      return cell;
    }
  }

  return target;
}

export function arrangeInColumns(count: number, size: GridSize): Cell[] {
  return Array.from({ length: count }, (_, index) => ({
    col: Math.floor(index / size.rows),
    row: index % size.rows,
  }));
}

// Keeps every item that is inside the grid on a cell of its own, and moves the rest
// (outside the grid, or on a cell another item already holds) to the nearest free cell.
export function fitIntoGrid<T extends { cell: Cell }>(items: T[], size: GridSize): T[] {
  const placed: Cell[] = [];
  const keys = new Set<string>();

  const kept = items.map((item) => {
    if (isInGrid(item.cell, size) && !keys.has(cellKey(item.cell))) {
      placed.push(item.cell);
      keys.add(cellKey(item.cell));
      return item;
    }

    return null;
  });

  return items.map((item, index) => {
    if (kept[index]) {
      return item;
    }

    const target = { col: clamp(item.cell.col, 0, size.cols - 1), row: clamp(item.cell.row, 0, size.rows - 1) };
    const cell = findFreeCell(target, placed, size);
    placed.push(cell);

    return { ...item, cell };
  });
}
