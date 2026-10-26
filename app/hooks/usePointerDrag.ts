import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

export type DragMove = {
  id: string;
  dx: number;
  dy: number;
};

type UsePointerDragOptions = {
  onMove: (move: DragMove) => void;
  onDrop: (move: DragMove) => void;
  onCancel?: (id: string) => void;
  // Pixels the pointer must travel before a press counts as a drag, so clicks and double-clicks stay clicks.
  threshold?: number;
};

type ActiveDrag = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
};

function usePointerDrag({ onMove, onDrop, onCancel, threshold = 4 }: UsePointerDragOptions) {
  const callbacks = useRef({ onMove, onDrop, onCancel });
  const active = useRef<ActiveDrag | null>(null);
  const detach = useRef<(() => void) | null>(null);

  useEffect(() => {
    callbacks.current = { onMove, onDrop, onCancel };
  });

  useEffect(() => () => detach.current?.(), []);

  const startDrag = useCallback(
    (id: string, event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || active.current) {
        return;
      }

      active.current = { id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
      const element = event.currentTarget;

      const getMove = (drag: ActiveDrag, pointer: PointerEvent): DragMove => ({
        id: drag.id,
        dx: pointer.clientX - drag.startX,
        dy: pointer.clientY - drag.startY,
      });

      const handleMove = (pointer: PointerEvent) => {
        const drag = active.current;
        if (!drag || pointer.pointerId !== drag.pointerId) {
          return;
        }

        const move = getMove(drag, pointer);
        if (!drag.moved && Math.hypot(move.dx, move.dy) < threshold) {
          return;
        }

        if (!drag.moved) {
          // From here on the pointer's events stay with the dragged element, even over an iframe (a game's page),
          // which would otherwise take them. Not before: a click on a button inside it must stay that button's.
          try {
            element.setPointerCapture(drag.pointerId);
          } catch {
            // The pointer is already gone; its up or cancel event ends the drag.
          }
        }
        drag.moved = true;
        callbacks.current.onMove(move);
      };

      const handleUp = (pointer: PointerEvent) => {
        const drag = active.current;
        if (!drag || pointer.pointerId !== drag.pointerId) {
          return;
        }

        stop();
        if (drag.moved) {
          callbacks.current.onDrop(getMove(drag, pointer));
        }
      };

      const handleCancel = (pointer: PointerEvent) => {
        const drag = active.current;
        if (!drag || pointer.pointerId !== drag.pointerId) {
          return;
        }

        stop();
        if (drag.moved) {
          callbacks.current.onCancel?.(drag.id);
        }
      };

      const stop = () => {
        active.current = null;
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleCancel);
        detach.current = null;
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleCancel);
      detach.current = stop;
    },
    [threshold],
  );

  return startDrag;
}

export default usePointerDrag;
