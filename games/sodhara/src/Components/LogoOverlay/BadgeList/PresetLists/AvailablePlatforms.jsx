import "./AvailablePlatforms.css";

// Version 0.4.7 on Google Drive; the links open in a new tab, since Drive won't show inside the SODHARA window.
const VERSION = "0.4.7";
const DOWNLOADS = [
  { label: "Windows", href: "https://drive.google.com/file/d/12zs5m_L-NwICbAot_Y19LcrymbqwDK6m/view?usp=drive_link" },
  { label: "macOS", href: "https://drive.google.com/file/d/12zKE4unjpjzNZb-u7raBsL6CQgU4De8A/view?usp=drive_link" },
];

const AvailablePlatforms = () => (
  <div id="download" className="downloads">
    <p className="downloads__caption">Download version {VERSION} for</p>
    <div className="downloads__buttons">
      {DOWNLOADS.map((download) => (
        <a
          key={download.label}
          className="downloads__button"
          href={download.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {download.label}
        </a>
      ))}
    </div>
  </div>
);

export default AvailablePlatforms;
