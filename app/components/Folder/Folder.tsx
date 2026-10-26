import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";

import { getAppPath, type AppId, type DesktopApp } from "~/desktop/apps";
import usePhoneLayout from "~/hooks/usePhoneLayout";
import "./Folder.css";

type FolderProps = {
  apps: DesktopApp[];
};

// A folder app's window: its apps as icons, which open the way desktop icons do. A click selects and a double
// click or Enter opens; on the phone layout a tap opens.
function Folder({ apps }: FolderProps) {
  const navigate = useNavigate();
  const isPhone = usePhoneLayout();
  const [selectedId, setSelectedId] = useState<AppId | null>(null);

  // The app's own address; the Shell opens its window from there.
  const open = (id: AppId) => navigate(getAppPath(id));

  const handleKeyDown = (id: AppId, event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      open(id);
    }
  };

  return (
    <div className="folder">
      <ul className="folder__items">
        {apps.map((app) => (
          <li key={app.id}>
            <button
              type="button"
              className={`folder__item${selectedId === app.id ? " folder__item--selected" : ""}`}
              aria-pressed={selectedId === app.id}
              onClick={() => (isPhone ? open(app.id) : setSelectedId(app.id))}
              onDoubleClick={() => open(app.id)}
              onKeyDown={(event) => handleKeyDown(app.id, event)}
            >
              <img className="folder__icon" src={app.icon} alt="" width={56} height={56} draggable={false} />
              <span className="folder__caption">{app.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="folder__status">{apps.length === 1 ? "1 item" : `${apps.length} items`}</p>
    </div>
  );
}

export default Folder;
