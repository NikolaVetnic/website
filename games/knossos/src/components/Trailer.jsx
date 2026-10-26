import { TRAILER } from "../content";
import "./Trailer.css";

// The no-cookie player, as in the site's posts: YouTube sets no cookies until the video is played.
const Trailer = () => (
  <section id="trailer" className="section">
    <div className="section__inner">
      <p className="section__eyebrow">Trailer</p>
      <h2 className="section__title">The Prologue</h2>
      <div className="trailer">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${TRAILER.id}`}
          title={TRAILER.title}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
        />
      </div>
    </div>
  </section>
);

export default Trailer;
