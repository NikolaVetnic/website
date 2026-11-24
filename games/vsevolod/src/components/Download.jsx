import { DOWNLOADS } from "../content";
import graveyard from "../images/shots/graveyard.webp";
import "./Download.css";

const Download = () => (
  <section id="download" className="download" style={{ "--download-art": `url(${graveyard})` }}>
    <div className="download__inner">
      <h2 className="section__title">Download</h2>
      <p className="download__text">
        Play through the Prologue on your Windows PC, and if you get stuck, the walkthrough will see you through.
      </p>
      <div className="download__buttons">
        {[DOWNLOADS.game, DOWNLOADS.walkthrough].map((download, index) => (
          <a
            key={download.label}
            className={`button ${index === 0 ? "button--primary" : "button--ghost"}`}
            href={download.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {download.label}
          </a>
        ))}
      </div>
      <p className="download__note">Windows only. Opens Google Drive in a new tab.</p>
    </div>
  </section>
);

export default Download;
