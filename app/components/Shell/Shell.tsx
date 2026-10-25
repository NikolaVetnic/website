import { useEffect, useReducer, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import Desktop from "~/components/Desktop/Desktop";
import Taskbar from "~/components/Taskbar/Taskbar";
import AppWindow from "~/components/Window/AppWindow";
import { getApp, getAppFromPath, normalizePath, type AppId } from "~/desktop/apps";
import {
  NO_WINDOWS,
  getFocusedId,
  getFocusedPath,
  keepOnDesktop,
  windowsReducer,
  type WindowAction,
} from "~/desktop/windows";
import useElementSize from "~/hooks/useElementSize";
import "./Shell.css";

// Stacked above the desktop icons and below the desktop context menu.
const WINDOW_Z_INDEX = 10;

function Shell() {
  const workspaceRef = useRef<HTMLElement | null>(null);
  const area = useElementSize(workspaceRef);
  const navigate = useNavigate();
  const path = normalizePath(useLocation().pathname);

  // The page's own window is open from the first render, so the pre-rendered HTML shows it too.
  const [state, dispatch] = useReducer(windowsReducer, path, (initialPath) => {
    const id = getAppFromPath(initialPath);
    return id ? windowsReducer(NO_WINDOWS, { type: "open", id, area: null, path: initialPath }) : NO_WINDOWS;
  });
  const focusedId = getFocusedId(state);
  const focusedPath = getFocusedPath(state);

  // The effect below reads these without running again when they change.
  const latest = useRef({ focusedPath, area });
  useEffect(() => {
    latest.current = { focusedPath, area };
  });

  // The URL is the focused window's path. Each change on the page is a new history entry; the URL follows
  // once the navigation lands, so it is compared with the state before the change, not with the URL.
  const act = (action: WindowAction) => {
    const nextPath = getFocusedPath(windowsReducer(state, action));
    dispatch(action);
    if (nextPath !== focusedPath) {
      navigate(nextPath);
    }
  };

  // A URL from outside the page (a link, Back, Forward) brings its window to the front at that path;
  // the bare desktop minimizes them all.
  useEffect(() => {
    const current = latest.current;
    if (current.focusedPath === path) {
      return;
    }

    const id = getAppFromPath(path);
    dispatch(id ? { type: "open", id, area: current.area, path } : { type: "showDesktop" });
  }, [path]);

  // Windows open before the workspace was measured get their rect, right where CSS has been showing them.
  useEffect(() => {
    if (area) {
      dispatch({ type: "place", area });
    }
  }, [area]);

  const openApp = (id: AppId) => act({ type: "open", id, area });

  return (
    <div className="shell">
      <main ref={workspaceRef} className="shell__workspace">
        <Desktop onOpenApp={openApp} />
        {state.windows.map((window) => {
          const app = getApp(window.id);

          return (
            <AppWindow
              key={window.id}
              app={app}
              rect={window.rect && area ? keepOnDesktop(window.rect, area) : null}
              area={area}
              zIndex={WINDOW_Z_INDEX + state.stack.indexOf(window.id)}
              isFocused={window.id === focusedId}
              isMinimized={window.isMinimized}
              isMaximized={window.isMaximized}
              dispatch={act}
            >
              <p className="shell__placeholder">{app.title} is on its way.</p>
            </AppWindow>
          );
        })}
      </main>
      <Taskbar windows={state.windows} focusedId={focusedId} onToggle={(id) => act({ type: "toggle", id })} />
    </div>
  );
}

export default Shell;
