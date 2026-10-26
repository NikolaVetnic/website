import React from "react";

import "./BadgeList.css";

const Badge = ({ href, src, alt, imgHeight }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
        <img src={src} alt={alt} style={{ height: imgHeight }} />
    </a>
);

const BadgeList = ({ caption, fontSize, gap, imgHeight, badges }) => {
    return (
        <div className="badge-list">
            {caption && <h3 style={{ fontSize }}>{caption}</h3>}
            <div className="badge-list-items" style={{ gap }}>
                {badges.map((badge, index) => (
                    <Badge
                        key={index}
                        href={badge.href}
                        src={badge.src}
                        alt={badge.alt}
                        imgHeight={imgHeight}
                    />
                ))}
            </div>
        </div>
    );
};

export default BadgeList;
