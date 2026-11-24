import { FEATURES } from "../content";
import "./Features.css";

const Features = () => (
  <section id="features" className="section section--alt">
    <div className="section__inner">
      <h2 className="section__title">Features</h2>
      <ul className="features">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="features__item">
            <span className="features__numeral" aria-hidden="true">
              {feature.numeral}
            </span>
            <h3 className="features__title">{feature.title}</h3>
            <p className="features__text">{feature.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Features;
