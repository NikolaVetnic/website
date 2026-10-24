import type { Size } from "./drag";
import { clamp, type Point } from "./grid";

// Opens the menu at the pointer, shifted back inside the bounds where it would run past an edge.
export function fitMenu(point: Point, menu: Size, bounds: Size, margin = 8): Point {
  return {
    x: clamp(point.x, margin, Math.max(margin, bounds.width - menu.width - margin)),
    y: clamp(point.y, margin, Math.max(margin, bounds.height - menu.height - margin)),
  };
}
