import "./Trailer.css";

// The no-cookie player, as in the blog's posts: YouTube sets no cookies until the video is played.
const Trailer = ({ title = "Gameplay Showcase", src = "https://www.youtube-nocookie.com/embed/AtyKzeHd0hg" }) => (
  <section className="trailer">
    <h2>{title}</h2>
    <div className="trailer-video">
      <iframe
        className="trailer-video"
        src={src}
        title={title}
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      ></iframe>
    </div>
  </section>
);

export default Trailer;
