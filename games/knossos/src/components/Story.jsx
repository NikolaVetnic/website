import { STORY } from "../content";
import garden from "../images/shots/chapter-5-garden-thumb.webp";
import Highlighted from "./Highlighted";
import "./Story.css";

const Story = () => (
  <section id="story" className="section story">
    <div className="section__inner story__inner">
      <div className="story__text">
        <p className="section__eyebrow">The story</p>
        <h2 className="section__title">A journey to a sunken world</h2>
        {STORY.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="story__paragraph">
            <Highlighted text={paragraph} />
          </p>
        ))}
      </div>
      <figure className="story__figure">
        <img
          src={garden}
          width={720}
          height={506}
          alt="A garden of orange trees among strange architecture"
          loading="lazy"
        />
        <figcaption>Chapter V</figcaption>
      </figure>
    </div>
  </section>
);

export default Story;
