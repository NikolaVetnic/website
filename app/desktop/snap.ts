import type { Size } from "./drag";
import type { Point } from "./grid";
import type { Rect } from "./windows";

// Where a window dragged by its title bar can snap to: a half of the desktop along an edge, or a quarter in a
// corner.
export type SnapZone = "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

// How close to an edge the pointer must come for its half, and how close to a corner, along the edge, for its
// quarter.
const EDGE = 12;
const CORNER = 64;

// The zone under the pointer, in the desktop's coordinates; the pointer may be past the desktop's edge (over the
// taskbar, say), which counts as at it.
export function getSnapZone(pointer: Point, area: Size): SnapZone | null {
  const left = pointer.x <= EDGE;
  const right = pointer.x >= area.width - EDGE;
  const top = pointer.y <= EDGE;
  const bottom = pointer.y >= area.height - EDGE;
  if (!left && !right && !top && !bottom) {
    return null;
  }

  // Near a corner: at one of its two edges, and within reach of the other.
  const nearTop = pointer.y <= CORNER;
  const nearBottom = pointer.y >= area.height - CORNER;
  const nearLeft = pointer.x <= CORNER;
  const nearRight = pointer.x >= area.width - CORNER;
  if ((top && nearLeft) || (left && nearTop)) return "top-left";
  if ((top && nearRight) || (right && nearTop)) return "top-right";
  if ((bottom && nearLeft) || (left && nearBottom)) return "bottom-left";
  if ((bottom && nearRight) || (right && nearBottom)) return "bottom-right";

  if (left) return "left";
  if (right) return "right";
  return top ? "top" : "bottom";
}

// The part of the desktop a zone fills.
export function getSnapRect(zone: SnapZone, area: Size): Rect {
  const halfWidth = Math.round(area.width / 2);
  const halfHeight = Math.round(area.height / 2);
  const isLeft = zone.includes("left");
  const isRight = zone.includes("right");
  const isTop = zone.includes("top");
  const isBottom = zone.includes("bottom");

  return {
    x: isRight ? halfWidth : 0,
    y: isBottom ? halfHeight : 0,
    width: isLeft ? halfWidth : isRight ? area.width - halfWidth : area.width,
    height: isTop ? halfHeight : isBottom ? area.height - halfHeight : area.height,
  };
}

// A snapped window taken by its title bar gets back the size it had, under the pointer: the pointer stays as far
// along the title bar, in proportion, and the window's top stays where it was.
export function unsnapRect(snapped: Rect, restore: Rect, pointer: Point): Rect {
  const along = snapped.width > 0 ? (pointer.x - snapped.x) / snapped.width : 0.5;
  return { ...restore, x: Math.round(pointer.x - along * restore.width), y: snapped.y };
}
