import "./Trailer.css";

const Trailer = ({ title = "Gameplay Showcase", src = "https://www.youtube.com/embed/AtyKzeHd0hg" }) => (
  <section className="trailer">
    <h2>{title}</h2>
    <div className="trailer-video">
      <iframe className="trailer-video" src={src} title={title} allowFullScreen></iframe>
    </div>
  </section>
);

export default Trailer;
