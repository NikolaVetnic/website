import React from "react";
import "./FeatureText.css";

const FeatureText = ({ overtitle, title, text, highlights }) => {
    // Function to apply highlights to text
    const highlightText = (text, highlights) => {
        if (!highlights) return text;

        const regex = new RegExp(`(${highlights.join("|")})`, "gi");
        return text.split(regex).map((part, i) =>
            highlights.includes(part.toLowerCase()) ? (
                <span key={i} className="highlight">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="feature-text">
            <div className="overtitle">{overtitle}</div>
            <h2 className="title">{title}</h2>
            <hr className="divider" />
            <p className="text">{highlightText(text, highlights)}</p>
        </div>
    );
};

export default FeatureText;
