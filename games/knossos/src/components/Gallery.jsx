import { useRef, useState } from "react";

import { SCREENSHOTS } from "../content";
import Lightbox from "./Lightbox";
import "./Gallery.css";

const Gallery = () => {
  const [open, setOpen] = useState(null);
  const buttons = useRef([]);

  // Back to the thumbnail of the screenshot last shown, for the keyboard.
  const close = () => {
    buttons.current[open]?.focus();
    setOpen(null);
  };

  return (
    <section id="screenshots" className="section section--alt">
      <div className="section__inner">
        <h2 className="section__title section__title--right">Screenshots</h2>
        <ul className="gallery">
          {SCREENSHOTS.map((shot, index) => (
            <li key={shot.caption}>
              <button
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                type="button"
                className="gallery__item"
                onClick={() => setOpen(index)}
              >
                <img src={shot.thumb} alt={shot.caption} loading="lazy" />
                <span className="gallery__caption">{shot.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {open !== null ? <Lightbox shots={SCREENSHOTS} index={open} onChange={setOpen} onClose={close} /> : null}
    </section>
  );
};

export default Gallery;
