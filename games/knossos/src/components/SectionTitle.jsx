import devlog from "../images/titles/devlog.webp";
import download from "../images/titles/download.webp";
import features from "../images/titles/features.webp";
import mark from "../images/titles/mark.webp";
import screenshots from "../images/titles/screenshots.webp";
import soundtrack from "../images/titles/soundtrack.webp";
import story from "../images/titles/story.webp";
import trailer from "../images/titles/trailer.webp";
import "./SectionTitle.css";

// The Kandinsky icons of the Kickstarter campaign's title images, one per section.
const ICONS = { devlog, download, features, screenshots, soundtrack, story, trailer };

// A section's title drawn like the campaign's title images (680 × 145): the word in gold with a violet shadow, over a
// violet banner with an olive edge, a line beneath, the section's icon on the left and a small mark on the right. The
// drawing scales with the width; the word is the heading's text.
const SectionTitle = ({ icon, children }) => (
  <h2 className="section-title">
    <span className="visually-hidden">{children}</span>
    <svg className="section-title__art" viewBox="0 0 680 145" aria-hidden="true">
      <polygon className="section-title__banner" points="171,57 552,57 437,128 283,128" />
      <rect className="section-title__line" x="100" y="129" width="430" height="2" />
      <image href={ICONS[icon]} x="0" y="0" width="112" height="145" />
      <image href={mark} x="526" y="82" width="122" height="62" />
      <text className="section-title__shadow" x="115" y="115">
        {children}
      </text>
      <text className="section-title__word" x="113" y="113">
        {children}
      </text>
    </svg>
  </h2>
);

export default SectionTitle;
