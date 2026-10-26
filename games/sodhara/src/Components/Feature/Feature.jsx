import React, { useState, useEffect } from "react";
import "./Feature.css";
import FeatureText from "./FeatureText/FeatureText";
import FeatureMobile from "./FeatureMobile/FeatureMobile";

const Feature = ({ text, image, title, overtitle, highlights, textLeft }) => {
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
        <FeatureMobile
            text={text}
            image={image}
            title={title}
            overtitle={overtitle}
            highlights={highlights}
        />
    ) : (
        <div className={`feature ${textLeft ? "text-left" : "text-right"}`}>
            <div className="feature-content">
                <div className="text-column">
                    <FeatureText
                        overtitle={overtitle}
                        title={title}
                        text={text}
                        highlights={highlights}
                    />
                </div>
                <div className="image-column">
                    <img src={image} alt={title} />
                </div>
            </div>
        </div>
    );
};

export default Feature;
