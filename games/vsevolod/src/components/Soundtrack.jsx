import { useState } from "react";

import { SOUNDTRACK } from "../content";
import { openInSite } from "../site";
import "./Soundtrack.css";

// SoundCloud's player sets its own cookies, so it loads only when asked for.
const Soundtrack = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section id="soundtrack" className="section">
      <div className="section__inner">
        <h2 className="section__title">Soundtrack</h2>
        <div className="soundtrack">
          <p className="soundtrack__text">
            Written for the Prologue in 2012, and given a proper mix and master in 2017.{" "}
            <a href={SOUNDTRACK.path} onClick={(event) => openInSite(event, SOUNDTRACK.path)}>
              More about the music
            </a>
          </p>
          {isLoaded ? (
            <iframe className="soundtrack__player" src={SOUNDTRACK.player} title={SOUNDTRACK.title} allow="autoplay" />
          ) : (
            <div className="soundtrack__placeholder">
              <button type="button" className="button button--primary" onClick={() => setIsLoaded(true)}>
                ▶ Listen to the Soundtrack
              </button>
              <p className="soundtrack__note">Loads the SoundCloud player, which may set cookies.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Soundtrack;
