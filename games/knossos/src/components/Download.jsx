import { DOWNLOADS } from "../content";
import colonnade from "../images/colonnade.webp";
import "./Download.css";

const Download = () => (
  <section id="download" className="download" style={{ "--download-art": `url(${colonnade})` }}>
    <div className="download__inner">
      <h2 className="section__title">Download</h2>
      <p className="download__text">
        Play through the completed Prologue of the game today, and get a glimpse of the monster that awaits in the heart
        of the maze.
      </p>
      <div className="download__buttons">
        {DOWNLOADS.map((download) => (
          <a
            key={download.label}
            className="button button--primary"
            href={download.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download for {download.label}
          </a>
        ))}
      </div>
      <p className="download__note">Opens Google Drive in a new tab.</p>
    </div>
  </section>
);

export default Download;
