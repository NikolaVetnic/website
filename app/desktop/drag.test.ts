import { describe, expect, it } from "vitest";

import { boxesOverlap, getBox, getDragPoint, moveManyToCells, moveToCell } from "./drag";

describe("getDragPoint", () => {
  const item = { width: 90, height: 90 };
  const area = { width: 500, height: 300 };

  it("moves the item by the pointer delta", () => {
    expect(getDragPoint({ x: 10, y: 10 }, 120, 40, item, area)).toEqual({ x: 130, y: 50 });
  });

  it("keeps the item inside the area", () => {
    expect(getDragPoint({ x: 10, y: 10 }, -50, -50, item, area)).toEqual({ x: 0, y: 0 });
    expect(getDragPoint({ x: 10, y: 10 }, 900, 900, item, area)).toEqual({ x: 410, y: 210 });
  });

  it("pins the item to the top left when the area is smaller than the item", () => {
    expect(getDragPoint({ x: 0, y: 0 }, 30, 30, item, { width: 60, height: 60 })).toEqual({ x: 0, y: 0 });
  });
});

describe("moveToCell", () => {
  const size = { cols: 2, rows: 2 };
  const items = [
    { id: "a", cell: { col: 0, row: 0 } },
    { id: "b", cell: { col: 0, row: 1 } },
  ];

  it("moves the item to a free target", () => {
    expect(moveToCell(items, 0, { col: 1, row: 1 }, size)).toEqual([
      { id: "a", cell: { col: 1, row: 1 } },
      { id: "b", cell: { col: 0, row: 1 } },
    ]);
  });

  it("moves the item to the next free cell when the target is taken", () => {
    expect(moveToCell(items, 0, { col: 0, row: 1 }, size)).toEqual([
      { id: "a", cell: { col: 1, row: 0 } },
      { id: "b", cell: { col: 0, row: 1 } },
    ]);
  });

  it("lets the item stay on its own cell", () => {
    expect(moveToCell(items, 1, { col: 0, row: 1 }, size)).toEqual(items);
  });
});

describe("moveManyToCells", () => {
  const size = { cols: 3, rows: 3 };
  const items = [
    { id: "a", cell: { col: 0, row: 0 } },
    { id: "b", cell: { col: 0, row: 1 } },
    { id: "c", cell: { col: 2, row: 0 } },
  ];

  it("moves a group together, keeping the others where they are", () => {
    const moved = moveManyToCells(
      items,
      new Map([
        [0, { col: 1, row: 0 }],
        [1, { col: 1, row: 1 }],
      ]),
      size,
    );
    expect(moved.map((item) => item.cell)).toEqual([
      { col: 1, row: 0 },
      { col: 1, row: 1 },
      { col: 2, row: 0 },
    ]);
  });

  it("puts an item whose cell is taken on the next free one", () => {
    const moved = moveManyToCells(
      items,
      new Map([
        [0, { col: 2, row: 0 }],
        [1, { col: 2, row: 0 }],
      ]),
      size,
    );
    expect(moved.map((item) => item.cell)).toEqual([
      { col: 2, row: 1 },
      { col: 2, row: 2 },
      { col: 2, row: 0 },
    ]);
  });
});

describe("boxes", () => {
  it("are the same whichever way they're drawn", () => {
    const box = { x: 10, y: 20, width: 30, height: 40 };
    expect(getBox({ x: 10, y: 20 }, { x: 40, y: 60 })).toEqual(box);
    expect(getBox({ x: 40, y: 60 }, { x: 10, y: 20 })).toEqual(box);
  });

  it("overlap when they share area, not when they only touch", () => {
    const icon = { x: 100, y: 100, width: 88, height: 96 };
    expect(boxesOverlap({ x: 50, y: 50, width: 60, height: 60 }, icon)).toBe(true);
    expect(boxesOverlap({ x: 120, y: 120, width: 5, height: 5 }, icon)).toBe(true);
    expect(boxesOverlap({ x: 0, y: 0, width: 100, height: 100 }, icon)).toBe(false);
    expect(boxesOverlap({ x: 300, y: 100, width: 50, height: 50 }, icon)).toBe(false);
  });
});
