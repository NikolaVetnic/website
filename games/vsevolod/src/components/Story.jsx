import { STORY } from "../content";
import laboratory from "../images/laboratory.webp";
import Highlighted from "./Highlighted";
import "./Story.css";

const Story = () => (
  <section id="story" className="section story">
    <div className="section__inner">
      <h2 className="section__title">Story</h2>
      <div className="story__inner">
        <div className="story__text">
          {STORY.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="story__paragraph">
              <Highlighted text={paragraph} />
            </p>
          ))}
        </div>
        <figure className="story__figure">
          <img
            src={laboratory}
            width={1280}
            height={720}
            alt="A cave turned laboratory, lit by a lamp under its pipes"
            loading="lazy"
          />
          <figcaption>The Laboratory</figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default Story;
