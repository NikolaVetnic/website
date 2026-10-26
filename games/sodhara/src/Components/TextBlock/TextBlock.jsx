import React from "react";
import "./TextBlock.css";

const TextBlock = ({ title, paragraphs, highlights = [] }) => {
  return (
    <div className="text-block">
      <TitleContainer title={title} />
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text">
          {highlightText(paragraph, highlights)}
        </p>
      ))}
    </div>
  );
};

const highlightText = (text, highlights = []) => {
  if (!highlights.length) return text;

  const regex = new RegExp(`(${highlights.join("|")})`, "gi");
  return text.split(regex).map((part, i) =>
    highlights.includes(part.toLowerCase()) ? (
      <span key={i} className="highlight">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const TitleContainer = ({ title }) => (
  <div className="title-container">
    <div className="line"></div>
    <h2 className="title">{title}</h2>
    <div className="line"></div>
  </div>
);

export default TextBlock;
