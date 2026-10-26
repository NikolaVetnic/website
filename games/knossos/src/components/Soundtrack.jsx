import { useState } from "react";

import { SOUNDTRACK } from "../content";
import "./Soundtrack.css";

// SoundCloud's player sets its own cookies, so it loads only when asked for.
const Soundtrack = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section id="soundtrack" className="section">
      <div className="section__inner soundtrack">
        <div>
          <p className="section__eyebrow">Soundtrack</p>
          <h2 className="section__title">Music for the deep</h2>
          <p className="soundtrack__text">
            A cross-genre experimental soundtrack, written for the game: the K’NOSSOS Official Soundtrack.
          </p>
        </div>
        {isLoaded ? (
          <iframe className="soundtrack__player" src={SOUNDTRACK.player} title={SOUNDTRACK.title} allow="autoplay" />
        ) : (
          <div className="soundtrack__placeholder">
            <button type="button" className="button button--primary" onClick={() => setIsLoaded(true)}>
              ▶ Listen to the soundtrack
            </button>
            <p className="soundtrack__note">Loads the player from SoundCloud, which may set cookies.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Soundtrack;
