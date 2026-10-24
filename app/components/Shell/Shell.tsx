import { useEffect, useReducer, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import Desktop from "~/components/Desktop/Desktop";
import Taskbar from "~/components/Taskbar/Taskbar";
import AppWindow from "~/components/Window/AppWindow";
import { getApp, getAppFromPath, getAppPath, type AppId } from "~/desktop/apps";
import { NO_WINDOWS, getFocusedId, keepOnDesktop, windowsReducer, type WindowAction } from "~/desktop/windows";
import useElementSize from "~/hooks/useElementSize";
import "./Shell.css";

// Stacked above the desktop icons and below the desktop context menu.
const WINDOW_Z_INDEX = 10;

function Shell() {
  const workspaceRef = useRef<HTMLElement | null>(null);
  const area = useElementSize(workspaceRef);
  const [state, dispatch] = useReducer(windowsReducer, NO_WINDOWS);
  const focusedId = getFocusedId(state);
  const navigate = useNavigate();
  const pathAppId = getAppFromPath(useLocation().pathname);

  // The effect below reads these without running again when they change.
  const latest = useRef({ focusedId, area });
  useEffect(() => {
    latest.current = { focusedId, area };
  });

  // The URL names the focused window. Each change of focus on the page is a new history entry; the URL
  // follows once the navigation lands, so it is compared with the focus before the change, not with the URL.
  const act = (action: WindowAction) => {
    const nextId = getFocusedId(windowsReducer(state, action));
    dispatch(action);
    if (nextId !== focusedId) {
      navigate(getAppPath(nextId));
    }
  };

  // A URL from outside the page (the first load, Back, Forward) brings its window to the front;
  // the bare desktop minimizes them all. Runs once the workspace is measured, as opening needs its size.
  const isMeasured = area !== null;
  useEffect(() => {
    const current = latest.current;
    if (!current.area || current.focusedId === pathAppId) {
      return;
    }

    dispatch(pathAppId ? { type: "open", id: pathAppId, area: current.area } : { type: "showDesktop" });
  }, [pathAppId, isMeasured]);

  const openApp = (id: AppId) => {
    if (area) {
      act({ type: "open", id, area });
    }
  };

  return (
    <div className="shell">
      <main ref={workspaceRef} className="shell__workspace">
        <Desktop onOpenApp={openApp} />
        {area
          ? state.windows.map((window) => {
              const app = getApp(window.id);

              return (
                <AppWindow
                  key={window.id}
                  app={app}
                  rect={keepOnDesktop(window.rect, area)}
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
            })
          : null}
      </main>
      <Taskbar windows={state.windows} focusedId={focusedId} onToggle={(id) => act({ type: "toggle", id })} />
    </div>
  );
}

export default Shell;
