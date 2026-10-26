// A text with its words between asterisks highlighted: "a *cold* world".
const Highlighted = ({ text }) =>
  text.split(/\*([^*]+)\*/).map((part, index) =>
    index % 2 ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    ),
  );

export default Highlighted;
