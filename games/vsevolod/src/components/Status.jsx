import { STATUS } from "../content";
import Highlighted from "./Highlighted";
import "./Status.css";

// Where the project stands, after the Prologue.
const Status = () => (
  <section id="status" className="section">
    <div className="section__inner status">
      <h2 className="section__title">The Road Ahead</h2>
      {STATUS.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="status__paragraph">
          <Highlighted text={paragraph} />
        </p>
      ))}
    </div>
  </section>
);

export default Status;
