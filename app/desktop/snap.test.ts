import { describe, expect, it } from "vitest";

import { getSnapRect, getSnapZone, unsnapRect } from "./snap";

const area = { width: 1200, height: 800 };

describe("getSnapZone", () => {
  it("finds no zone away from the edges", () => {
    expect(getSnapZone({ x: 600, y: 400 }, area)).toBeNull();
    expect(getSnapZone({ x: 20, y: 400 }, area)).toBeNull();
  });

  it("gives the half along each edge", () => {
    expect(getSnapZone({ x: 0, y: 400 }, area)).toBe("left");
    expect(getSnapZone({ x: 1195, y: 400 }, area)).toBe("right");
    expect(getSnapZone({ x: 600, y: 4 }, area)).toBe("top");
    expect(getSnapZone({ x: 600, y: 790 }, area)).toBe("bottom");
  });

  it("counts a pointer past the edge, over the taskbar, as at it", () => {
    expect(getSnapZone({ x: 600, y: 830 }, area)).toBe("bottom");
    expect(getSnapZone({ x: -5, y: 400 }, area)).toBe("left");
  });

  it("gives the quarter near each corner, along either of its edges", () => {
    expect(getSnapZone({ x: 0, y: 30 }, area)).toBe("top-left");
    expect(getSnapZone({ x: 50, y: 0 }, area)).toBe("top-left");
    expect(getSnapZone({ x: 1200, y: 0 }, area)).toBe("top-right");
    expect(getSnapZone({ x: 0, y: 780 }, area)).toBe("bottom-left");
    expect(getSnapZone({ x: 1180, y: 800 }, area)).toBe("bottom-right");
  });
});

describe("getSnapRect", () => {
  it("fills a half", () => {
    expect(getSnapRect("left", area)).toEqual({ x: 0, y: 0, width: 600, height: 800 });
    expect(getSnapRect("right", area)).toEqual({ x: 600, y: 0, width: 600, height: 800 });
    expect(getSnapRect("top", area)).toEqual({ x: 0, y: 0, width: 1200, height: 400 });
    expect(getSnapRect("bottom", area)).toEqual({ x: 0, y: 400, width: 1200, height: 400 });
  });

  it("fills a quarter, the halves meeting without a gap on odd sizes", () => {
    expect(getSnapRect("bottom-right", area)).toEqual({ x: 600, y: 400, width: 600, height: 400 });
    expect(getSnapRect("top-left", { width: 1001, height: 701 })).toEqual({ x: 0, y: 0, width: 501, height: 351 });
    expect(getSnapRect("bottom-right", { width: 1001, height: 701 })).toEqual({
      x: 501,
      y: 351,
      width: 500,
      height: 350,
    });
  });
});

describe("unsnapRect", () => {
  it("gives the window its size back under the pointer, as far along its title bar", () => {
    const snapped = { x: 0, y: 0, width: 600, height: 800 };
    const restore = { x: 300, y: 200, width: 400, height: 300 };

    expect(unsnapRect(snapped, restore, { x: 150, y: 10 })).toEqual({ x: 50, y: 0, width: 400, height: 300 });
  });
});
