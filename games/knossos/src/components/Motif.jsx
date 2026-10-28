// Small geometric marks for the features, after the circles, triangles and lines of Kandinsky's compositions.
const SHAPES = {
  circles: (
    <>
      <circle cx="26" cy="28" r="16" fill="var(--violet)" />
      <circle cx="40" cy="22" r="9" fill="none" stroke="var(--gold)" strokeWidth="2" />
      <circle cx="40" cy="22" r="3" fill="var(--ember)" />
    </>
  ),
  triangle: (
    <>
      <path d="M8 50 L32 10 L56 50 Z" fill="none" stroke="var(--gold)" strokeWidth="2" />
      <circle cx="32" cy="38" r="7" fill="var(--teal)" />
    </>
  ),
  orbit: (
    <>
      <ellipse
        cx="32"
        cy="32"
        rx="24"
        ry="10"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2"
        transform="rotate(-24 32 32)"
      />
      <circle cx="32" cy="32" r="8" fill="var(--violet-bright)" />
      <circle cx="52" cy="22" r="3" fill="var(--ember)" />
    </>
  ),
  lines: (
    <>
      <path d="M10 18 H46 M10 30 H54 M10 42 H34" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      <rect x="40" y="36" width="14" height="14" fill="var(--violet)" />
    </>
  ),
  waves: (
    <>
      <path d="M6 32 C14 14, 22 50, 32 32 S50 14, 58 32" fill="none" stroke="var(--gold)" strokeWidth="2" />
      <path d="M6 44 C14 30, 22 58, 32 44 S50 30, 58 44" fill="none" stroke="var(--teal)" strokeWidth="2" />
      <circle cx="18" cy="16" r="4" fill="var(--ember)" />
    </>
  ),
};

const Motif = ({ name }) => (
  <svg className="motif" viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
    {SHAPES[name]}
  </svg>
);

export default Motif;
