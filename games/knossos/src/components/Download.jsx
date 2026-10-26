import { DOWNLOADS } from "../content";
import colonnade from "../images/colonnade.webp";
import "./Download.css";

const Download = () => (
  <section id="download" className="download" style={{ "--download-art": `url(${colonnade})` }}>
    <div className="download__inner">
      <p className="section__eyebrow download__eyebrow">Free download</p>
      <h2 className="section__title">Download K’NOSSOS Prologue</h2>
      <p className="download__text">
        To share our vision with you we have prepared a fully completed Prologue of the final game in English which you
        are free to download via link below.
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
