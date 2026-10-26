import "./FeatureMobile.css";
import FeatureText from "../FeatureText/FeatureText";
import Clip from "../Clip";

const FeatureMobile = ({ text, clip, title, overtitle, highlights }) => {
  return (
    <div className="feature-mobile">
      <div className="feature-mobile-text">
        <FeatureText overtitle={overtitle} title={title} text={text} highlights={highlights} />
      </div>
      <div className="feature-mobile-image">
        <Clip clip={clip} title={title} />
      </div>
    </div>
  );
};

export default FeatureMobile;
