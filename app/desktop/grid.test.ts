import { describe, expect, it } from "vitest";

import {
  arrangeInColumns,
  cellToPoint,
  findFreeCell,
  fitIntoGrid,
  getGridSize,
  pointToCell,
  type GridSpec,
} from "./grid";

const spec: GridSpec = { cellWidth: 100, cellHeight: 100, offsetX: 10, offsetY: 10, itemWidth: 90, itemHeight: 90 };

describe("getGridSize", () => {
  it("counts only cells where the whole item fits", () => {
    // 10 + 2 * 100 + 90 = 300 fits three columns; 299 fits only two.
    expect(getGridSize(spec, 300, 300)).toEqual({ cols: 3, rows: 3 });
    expect(getGridSize(spec, 299, 299)).toEqual({ cols: 2, rows: 2 });
  });

  it("never returns an empty grid", () => {
    expect(getGridSize(spec, 0, 0)).toEqual({ cols: 1, rows: 1 });
  });
});

describe("cellToPoint and pointToCell", () => {
  const size = { cols: 3, rows: 4 };

  it("round-trips a cell", () => {
    const cell = { col: 2, row: 3 };
    expect(pointToCell(spec, cellToPoint(spec, cell), size)).toEqual(cell);
  });

  it("snaps to the nearest cell", () => {
    expect(pointToCell(spec, { x: 155, y: 64 }, size)).toEqual({ col: 1, row: 1 });
    expect(pointToCell(spec, { x: 164, y: 55 }, size)).toEqual({ col: 2, row: 0 });
  });

  it("clamps points outside the grid to the edge cells", () => {
    expect(pointToCell(spec, { x: -500, y: 5000 }, size)).toEqual({ col: 0, row: 3 });
  });
});

describe("findFreeCell", () => {
  const size = { cols: 2, rows: 3 };

  it("returns the target when it is free", () => {
    expect(findFreeCell({ col: 1, row: 1 }, [{ col: 0, row: 0 }], size)).toEqual({ col: 1, row: 1 });
  });

  it("goes down the column, then to the next column", () => {
    const occupied = [
      { col: 0, row: 1 },
      { col: 0, row: 2 },
    ];
    expect(findFreeCell({ col: 0, row: 1 }, occupied, size)).toEqual({ col: 1, row: 0 });
  });

  it("wraps around from the last cell to the first", () => {
    expect(findFreeCell({ col: 1, row: 2 }, [{ col: 1, row: 2 }], size)).toEqual({ col: 0, row: 0 });
  });

  it("returns the target when the grid is full", () => {
    const occupied = arrangeInColumns(6, size);
    expect(findFreeCell({ col: 1, row: 1 }, occupied, size)).toEqual({ col: 1, row: 1 });
  });
});

describe("arrangeInColumns", () => {
  it("fills each column top to bottom", () => {
    expect(arrangeInColumns(5, { cols: 3, rows: 2 })).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: 1 },
      { col: 1, row: 0 },
      { col: 1, row: 1 },
      { col: 2, row: 0 },
    ]);
  });
});

describe("fitIntoGrid", () => {
  const size = { cols: 2, rows: 2 };

  it("leaves items that fit where they are", () => {
    const items = [
      { id: "a", cell: { col: 1, row: 1 } },
      { id: "b", cell: { col: 0, row: 0 } },
    ];
    expect(fitIntoGrid(items, size)).toEqual(items);
  });

  it("moves items outside the grid into free cells near the edge", () => {
    const items = [
      { id: "a", cell: { col: 0, row: 1 } },
      { id: "b", cell: { col: 0, row: 7 } },
    ];
    expect(fitIntoGrid(items, size)).toEqual([
      { id: "a", cell: { col: 0, row: 1 } },
      { id: "b", cell: { col: 1, row: 0 } },
    ]);
  });

  it("separates items that share a cell", () => {
    const items = [
      { id: "a", cell: { col: 0, row: 0 } },
      { id: "b", cell: { col: 0, row: 0 } },
    ];
    expect(fitIntoGrid(items, size).map((item) => item.cell)).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: 1 },
    ]);
  });

  it("does not let a moved item take a cell that a later item keeps", () => {
    const items = [
      { id: "a", cell: { col: 5, row: 0 } },
      { id: "b", cell: { col: 1, row: 0 } },
    ];
    expect(fitIntoGrid(items, size).map((item) => item.cell)).toEqual([
      { col: 1, row: 1 },
      { col: 1, row: 0 },
    ]);
  });
});
