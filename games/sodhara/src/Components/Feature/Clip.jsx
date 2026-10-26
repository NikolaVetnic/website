// A gameplay clip, playing on its own like the GIF it replaces: muted, looping, inline on phones. WebM is a third
// the size of the GIF; browsers that can't play it get the MP4.
const Clip = ({ clip, title }) => (
  <video autoPlay muted loop playsInline aria-label={title}>
    <source src={clip.webm} type="video/webm" />
    <source src={clip.mp4} type="video/mp4" />
  </video>
);

export default Clip;
