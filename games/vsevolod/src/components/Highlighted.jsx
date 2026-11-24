// A text with its words between double asterisks in bold and those between single ones highlighted:
// "a **cold** *sunken* world".
const Highlighted = ({ text }) =>
  text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span key={index} className="highlight">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });

export default Highlighted;
