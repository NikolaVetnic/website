import React from "react";
import "./FeatureMobile.css";
import FeatureText from "../FeatureText/FeatureText";

const FeatureMobile = ({ text, image, title, overtitle, highlights }) => {
    return (
        <div className="feature-mobile">
            <div className="feature-mobile-text">
                <FeatureText
                    overtitle={overtitle}
                    title={title}
                    text={text}
                    highlights={highlights}
                />
            </div>
            <div className="feature-mobile-image">
                <img src={image} alt={title} />
            </div>
        </div>
    );
};

export default FeatureMobile;
