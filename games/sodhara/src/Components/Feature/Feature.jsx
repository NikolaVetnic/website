import { useState, useEffect } from "react";
import "./Feature.css";
import FeatureText from "./FeatureText/FeatureText";
import FeatureMobile from "./FeatureMobile/FeatureMobile";
import Clip from "./Clip";

const Feature = ({ text, clip, title, overtitle, highlights, textLeft }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 767);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile ? (
    <FeatureMobile text={text} clip={clip} title={title} overtitle={overtitle} highlights={highlights} />
  ) : (
    <div className={`feature ${textLeft ? "text-left" : "text-right"}`}>
      <div className="feature-content">
        <div className="text-column">
          <FeatureText overtitle={overtitle} title={title} text={text} highlights={highlights} />
        </div>
        <div className="image-column">
          <Clip clip={clip} title={title} />
        </div>
      </div>
    </div>
  );
};

export default Feature;
