import "./SectionTitle.css";

// A section's title between two orange lines, the same for About, Features, the gallery and the video.
const SectionTitle = ({ children }) => (
  <div className="section-title">
    <div className="section-title__line"></div>
    <h2 className="section-title__text">{children}</h2>
    <div className="section-title__line"></div>
  </div>
);

export default SectionTitle;
