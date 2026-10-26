import { useEffect, useReducer, useRef, useState } from "react";
import { useLocation, useMatches, useNavigate } from "react-router";

import AppContent from "~/components/AppContent/AppContent";
import Desktop from "~/components/Desktop/Desktop";
import NotFound from "~/components/NotFound/NotFound";
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
import usePhoneLayout from "~/hooks/usePhoneLayout";
import "./Shell.css";

// Stacked above the desktop icons and below the desktop context menu.
const WINDOW_Z_INDEX = 10;

function Shell() {
  const workspaceRef = useRef<HTMLElement | null>(null);
  const area = useElementSize(workspaceRef);
  const navigate = useNavigate();
  const path = normalizePath(useLocation().pathname);
  const isPhone = usePhoneLayout();

  // What the page's route loaded, kept per path for windows that are no longer in the URL. Updating it during
  // render (React's pattern for state that follows a value) redoes the render before anything is shown.
  const matches = useMatches();
  const pageData = matches[matches.length - 1]?.loaderData;
  const [pages, setPages] = useState<Record<string, unknown>>({});
  if (pageData !== undefined && pages[path] !== pageData) {
    setPages({ ...pages, [path]: pageData });
  }
  // An address the site doesn't have (see routes/not-found.tsx) is the bare desktop, even under an app's path.
  const isNotFound = typeof pageData === "object" && pageData !== null && "notFound" in pageData;
  const pathApp = isNotFound ? null : getAppFromPath(path);

  // The page's own window is open from the first render, so the pre-rendered HTML shows it too.
  const [state, dispatch] = useReducer(windowsReducer, NO_WINDOWS, (empty) =>
    pathApp ? windowsReducer(empty, { type: "open", id: pathApp, area: null, path }) : empty,
  );
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

    dispatch(pathApp ? { type: "open", id: pathApp, area: current.area, path } : { type: "showDesktop" });
  }, [path, pathApp]);

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
              contentKey={window.path}
            >
              <AppContent app={app} data={window.path === path ? pageData : pages[window.path]} />
            </AppWindow>
          );
        })}
        {isNotFound ? <NotFound path={path} onClose={() => navigate("/", { replace: true })} /> : null}
      </main>
      <Taskbar
        windows={state.windows}
        focusedId={focusedId}
        // On a phone the app on screen is the focused one, so its button only switches to it, never hides it.
        onToggle={(id) => act({ type: isPhone ? "focus" : "toggle", id })}
        onShowDesktop={() => act({ type: "showDesktop" })}
      />
    </div>
  );
}

export default Shell;
