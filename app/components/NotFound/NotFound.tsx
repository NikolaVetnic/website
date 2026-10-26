import type { KeyboardEvent } from "react";

import "./NotFound.css";

type NotFoundProps = {
  path: string;
  onClose: () => void;
};

// Shown on the desktop for an address the site doesn't have.
function NotFound({ path, onClose }: NotFoundProps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <section className="not-found" role="dialog" aria-labelledby="not-found-title" onKeyDown={handleKeyDown}>
      <h2 id="not-found-title" className="not-found__title">
        Nothing here
      </h2>
      <p className="not-found__text">
        There is no page at <code className="not-found__path">{path}</code>. The link may be wrong, or the page has
        moved.
      </p>
      <button type="button" className="not-found__button" onClick={onClose} autoFocus>
        Go to the desktop
      </button>
    </section>
  );
}

export default NotFound;
