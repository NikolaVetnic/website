import SectionTitle from "../SectionTitle/SectionTitle";
import "./Trailer.css";

// The no-cookie player, as in the blog's posts: YouTube sets no cookies until the video is played.
const Trailer = ({ title = "Gameplay Showcase", src = "https://www.youtube-nocookie.com/embed/AtyKzeHd0hg" }) => (
  <>
    <SectionTitle>{title}</SectionTitle>
    <div className="trailer-video">
      <iframe src={src} title={title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen"></iframe>
    </div>
  </>
);

export default Trailer;
