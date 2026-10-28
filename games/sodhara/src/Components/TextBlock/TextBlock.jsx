import SectionTitle from "../SectionTitle/SectionTitle";
import "./TextBlock.css";

const TextBlock = ({ title, paragraphs, highlights = [] }) => {
  return (
    <div className="text-block">
      <SectionTitle>{title}</SectionTitle>
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

export default TextBlock;
