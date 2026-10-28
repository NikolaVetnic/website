import { FEATURES } from "../content";
import Motif from "./Motif";
import "./Features.css";

const Features = () => (
  <section id="features" className="section section--alt">
    <div className="section__inner">
      <h2 className="section__title">Features</h2>
      <ul className="features">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="feature">
            <Motif name={feature.motif} />
            <h3 className="feature__title">{feature.title}</h3>
            <p className="feature__text">{feature.text}</p>
          </li>
        ))}
      </ul>
      <p className="features__engine">K’NOSSOS is built in Unity using the Adventure Creator toolkit.</p>
    </div>
  </section>
);

export default Features;
