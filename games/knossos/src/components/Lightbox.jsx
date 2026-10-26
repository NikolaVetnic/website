import { useEffect, useRef } from "react";

import "./Lightbox.css";

// One screenshot over the whole page, with the previous and next ones a click or an arrow key away.
const Lightbox = ({ shots, index, onChange, onClose }) => {
  const closeRef = useRef(null);
  const shot = shots[index];
  const step = (by) => onChange((index + by + shots.length) % shots.length);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.caption} onClick={onClose}>
      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img key={shot.src} className="lightbox__image" src={shot.src} alt={shot.caption} />
        <figcaption className="lightbox__caption">
          {shot.caption}
          <span className="lightbox__count">
            {index + 1} / {shots.length}
          </span>
        </figcaption>
      </figure>
      <button
        type="button"
        className="lightbox__button lightbox__button--previous"
        aria-label="Previous screenshot"
        onClick={(event) => {
          event.stopPropagation();
          step(-1);
        }}
      >
        ‹
      </button>
      <button
        type="button"
        className="lightbox__button lightbox__button--next"
        aria-label="Next screenshot"
        onClick={(event) => {
          event.stopPropagation();
          step(1);
        }}
      >
        ›
      </button>
      <button
        ref={closeRef}
        type="button"
        className="lightbox__button lightbox__button--close"
        aria-label="Close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default Lightbox;
