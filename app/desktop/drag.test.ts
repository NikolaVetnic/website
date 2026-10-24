import { describe, expect, it } from "vitest";

import { getDragPoint, moveToCell } from "./drag";

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
