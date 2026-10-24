import { describe, expect, it } from "vitest";

import { fitMenu } from "./menu";

describe("fitMenu", () => {
  const menu = { width: 180, height: 80 };
  const bounds = { width: 800, height: 600 };

  it("opens at the pointer when the menu fits", () => {
    expect(fitMenu({ x: 300, y: 200 }, menu, bounds)).toEqual({ x: 300, y: 200 });
  });

  it("shifts the menu back from the right and bottom edges", () => {
    expect(fitMenu({ x: 790, y: 590 }, menu, bounds)).toEqual({ x: 612, y: 512 });
  });

  it("keeps a margin from the top and left edges", () => {
    expect(fitMenu({ x: 2, y: 3 }, menu, bounds)).toEqual({ x: 8, y: 8 });
  });

  it("pins the menu to the top left when the bounds are smaller than the menu", () => {
    expect(fitMenu({ x: 50, y: 50 }, menu, { width: 100, height: 60 })).toEqual({ x: 8, y: 8 });
  });
});
