import {
  useEffect,
  useId,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type PointerEvent,
  type CSSProperties,
  type ReactNode,
} from "react";

import type { DesktopApp } from "~/desktop/apps";
import type { Size } from "~/desktop/drag";
import type { Point } from "~/desktop/grid";
import { getSnapZone, unsnapRect, type SnapZone } from "~/desktop/snap";
import { moveRect, resizeRect, type Rect, type ResizeEdge, type WindowAction } from "~/desktop/windows";
import usePhoneLayout from "~/hooks/usePhoneLayout";
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
  // The zone it's snapped to, and its rect from before, which it gets back when dragged away.
  snap: SnapZone | null;
  restoreRect: Rect | null;
  dispatch: Dispatch<WindowAction>;
  // Tells the desktop where the window would snap if dropped now, so it can show it; null when nowhere.
  onSnapPreview: (zone: SnapZone | null) => void;
  // Changes when the window shows another page of its app, which then starts scrolled to the top.
  contentKey: string;
  // The title bar's text: a path to what the window shows ("Games / SODHARA", "Blog / <post>").
  title: string;
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
  snap,
  restoreRect,
  dispatch,
  onSnapPreview,
  contentKey,
  title,
  children,
}: AppWindowProps) {
  const windowRef = useRef<HTMLElement | null>(null);
  const startRect = useRef(rect);
  // Where the pointer took the title bar, in the desktop's coordinates.
  const grabPoint = useRef<Point>({ x: 0, y: 0 });
  const [isBusy, setIsBusy] = useState(false);
  const titleId = useId();
  const id = app.id;
  // In the phone layout every window fills the screen, so it can't be moved or maximized.
  const isPhone = usePhoneLayout();

  // Focus follows the window to the top, unless the click that raised it already put focus inside.
  useEffect(() => {
    const element = windowRef.current;
    if (isFocused && element && !element.contains(document.activeElement)) {
      element.focus({ preventScroll: true });
    }
  }, [isFocused]);

  const setRect = (next: Rect) => dispatch({ type: "setRect", id, rect: next });

  // The zone under the pointer, moved by the drag so far.
  const getZone = (dx: number, dy: number) =>
    area ? getSnapZone({ x: grabPoint.current.x + dx, y: grabPoint.current.y + dy }, area) : null;

  const startMove = usePointerDrag({
    onMove: ({ dx, dy }) => {
      setIsBusy(true);
      if (startRect.current && area) {
        setRect(moveRect(startRect.current, dx, dy, area));
        onSnapPreview(getZone(dx, dy));
      }
    },
    // Dropped in a zone, the window fills it; anywhere else, it stays where it was let go.
    onDrop: ({ dx, dy }) => {
      setIsBusy(false);
      onSnapPreview(null);
      if (startRect.current && area) {
        const zone = getZone(dx, dy);
        if (zone) {
          dispatch({ type: "snap", id, zone, area });
        } else {
          setRect(moveRect(startRect.current, dx, dy, area));
        }
      }
    },
    onCancel: () => {
      setIsBusy(false);
      onSnapPreview(null);
    },
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
    if (!rect || isMaximized || isPhone || (event.target as Element).closest("button")) {
      return;
    }

    const desktop = windowRef.current?.parentElement?.getBoundingClientRect();
    grabPoint.current = { x: event.clientX - (desktop?.left ?? 0), y: event.clientY - (desktop?.top ?? 0) };
    // A snapped window moves at the size it had before it snapped, under the pointer.
    startRect.current = snap && restoreRect ? unsnapRect(rect, restoreRect, grabPoint.current) : rect;
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
    rect ? "app-window--placed" : "app-window--unplaced",
    isBusy ? "app-window--busy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Custom properties rather than `left` and `top`, so the stylesheet decides where they apply.
  const style = (
    rect
      ? {
          "--window-x": `${rect.x}px`,
          "--window-y": `${rect.y}px`,
          "--window-width": `${rect.width}px`,
          "--window-height": `${rect.height}px`,
          zIndex,
        }
      : {
          // Until measured, CSS opens the window at its app's size, as getOpenRect will.
          ...(app.windowSize
            ? { "--open-width": `${app.windowSize.width}px`, "--open-height": `${app.windowSize.height}px` }
            : {}),
          zIndex,
        }
  ) as CSSProperties;

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
          if (!isPhone && !(event.target as Element).closest("button")) {
            dispatch({ type: "toggleMaximize", id });
          }
        }}
      >
        <img className="app-window__icon" src={app.icon} alt="" draggable={false} />
        <h2 id={titleId} className="app-window__title">
          {title}
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
      <div
        key={contentKey}
        className={`app-window__content${app.page ? " app-window__content--page" : app.fills ? " app-window__content--fill" : ""}`}
      >
        {children}
      </div>
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
