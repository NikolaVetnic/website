import { useReducer, useRef } from "react";

import Desktop from "~/components/Desktop/Desktop";
import Taskbar from "~/components/Taskbar/Taskbar";
import AppWindow from "~/components/Window/AppWindow";
import { getApp, type AppId } from "~/desktop/apps";
import { NO_WINDOWS, getFocusedId, keepOnDesktop, windowsReducer } from "~/desktop/windows";
import useElementSize from "~/hooks/useElementSize";
import "./Shell.css";

// Stacked above the desktop icons and below the desktop context menu.
const WINDOW_Z_INDEX = 10;

function Shell() {
  const workspaceRef = useRef<HTMLElement | null>(null);
  const area = useElementSize(workspaceRef);
  const [state, dispatch] = useReducer(windowsReducer, NO_WINDOWS);
  const focusedId = getFocusedId(state);

  const openApp = (id: AppId) => {
    if (area) {
      dispatch({ type: "open", id, area });
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
                  dispatch={dispatch}
                >
                  <p className="shell__placeholder">{app.title} is on its way.</p>
                </AppWindow>
              );
            })
          : null}
      </main>
      <Taskbar windows={state.windows} focusedId={focusedId} onToggle={(id) => dispatch({ type: "toggle", id })} />
    </div>
  );
}

export default Shell;
