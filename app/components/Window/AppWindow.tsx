import {
  useEffect,
  useId,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import type { DesktopApp } from "~/desktop/apps";
import type { Size } from "~/desktop/drag";
import { moveRect, resizeRect, type Rect, type ResizeEdge, type WindowAction } from "~/desktop/windows";
import usePointerDrag from "~/hooks/usePointerDrag";
import "./AppWindow.css";

const RESIZE_EDGES: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

type AppWindowProps = {
  app: DesktopApp;
  // Both null until the workspace has been measured: the window is placed by CSS and can't move yet.
  rect: Rect | null;
  area: Size | null;
  zIndex: number;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  dispatch: Dispatch<WindowAction>;
  children: ReactNode;
};

function AppWindow({
  app,
  rect,
  area,
  zIndex,
  isFocused,
  isMinimized,
  isMaximized,
  dispatch,
  children,
}: AppWindowProps) {
  const windowRef = useRef<HTMLElement | null>(null);
  const startRect = useRef(rect);
  const [isBusy, setIsBusy] = useState(false);
  const titleId = useId();
  const id = app.id;

  // Focus follows the window to the top, unless the click that raised it already put focus inside.
  useEffect(() => {
    const element = windowRef.current;
    if (isFocused && element && !element.contains(document.activeElement)) {
      element.focus({ preventScroll: true });
    }
  }, [isFocused]);

  const setRect = (next: Rect) => dispatch({ type: "setRect", id, rect: next });

  const startMove = usePointerDrag({
    onMove: ({ dx, dy }) => {
      setIsBusy(true);
      if (startRect.current && area) {
        setRect(moveRect(startRect.current, dx, dy, area));
      }
    },
    onDrop: ({ dx, dy }) => {
      setIsBusy(false);
      if (startRect.current && area) {
        setRect(moveRect(startRect.current, dx, dy, area));
      }
    },
    onCancel: () => setIsBusy(false),
  });

  const startResize = usePointerDrag({
    threshold: 0,
    onMove: ({ id: edge, dx, dy }) => {
      setIsBusy(true);
      if (startRect.current && area) {
        setRect(resizeRect(startRect.current, edge as ResizeEdge, dx, dy, area));
      }
    },
    onDrop: ({ id: edge, dx, dy }) => {
      setIsBusy(false);
      if (startRect.current && area) {
        setRect(resizeRect(startRect.current, edge as ResizeEdge, dx, dy, area));
      }
    },
    onCancel: () => setIsBusy(false),
  });

  const handleTitlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!rect || isMaximized || (event.target as Element).closest("button")) {
      return;
    }

    startRect.current = rect;
    startMove(id, event);
  };

  const handleResizePointerDown = (edge: ResizeEdge, event: PointerEvent<HTMLElement>) => {
    if (!rect) {
      return;
    }

    startRect.current = rect;
    startResize(edge, event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      dispatch({ type: "close", id });
    }
  };

  const className = [
    "app-window",
    isFocused ? "app-window--focused" : "",
    isMaximized ? "app-window--maximized" : "",
    rect ? "" : "app-window--unplaced",
    isBusy ? "app-window--busy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style =
    isMaximized || !rect ? { zIndex } : { left: rect.x, top: rect.y, width: rect.width, height: rect.height, zIndex };

  return (
    <section
      ref={windowRef}
      className={className}
      style={style}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={isMinimized}
      onPointerDownCapture={() => dispatch({ type: "focus", id })}
      onFocus={() => dispatch({ type: "focus", id })}
      onKeyDown={handleKeyDown}
    >
      <header
        className="app-window__titlebar"
        onPointerDown={handleTitlePointerDown}
        onDoubleClick={(event) => {
          if (!(event.target as Element).closest("button")) {
            dispatch({ type: "toggleMaximize", id });
          }
        }}
      >
        <img className="app-window__icon" src={app.icon} alt="" draggable={false} />
        <h2 id={titleId} className="app-window__title">
          {app.title}
        </h2>
        <div className="app-window__controls">
          <button
            type="button"
            className="app-window__control"
            aria-label={`Minimize ${app.title}`}
            onClick={() => dispatch({ type: "minimize", id })}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1 5.5h8" />
            </svg>
          </button>
          <button
            type="button"
            className="app-window__control"
            aria-label={`${isMaximized ? "Restore" : "Maximize"} ${app.title}`}
            onClick={() => dispatch({ type: "toggleMaximize", id })}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true">
              {isMaximized ? <path d="M1.5 3.5h5v5h-5zM3.5 3.5v-2h5v5h-2" /> : <path d="M1.5 1.5h7v7h-7z" />}
            </svg>
          </button>
          <button
            type="button"
            className="app-window__control app-window__control--close"
            aria-label={`Close ${app.title}`}
            onClick={() => dispatch({ type: "close", id })}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
            </svg>
          </button>
        </div>
      </header>
      <div className="app-window__content">{children}</div>
      {isMaximized
        ? null
        : RESIZE_EDGES.map((edge) => (
            <div
              key={edge}
              className={`app-window__resize app-window__resize--${edge}`}
              aria-hidden="true"
              onPointerDown={(event) => handleResizePointerDown(edge, event)}
            />
          ))}
    </section>
  );
}

export default AppWindow;
