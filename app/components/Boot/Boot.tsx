import { SITE_NAME } from "~/meta";
import "./Boot.css";

// The boot screen (see app/boot/boot.ts): in every page, shown by the stylesheet only while <html> has `data-boot`.
// Hidden from screen readers, which go straight to the page.
function Boot() {
  return (
    <div className="boot" aria-hidden="true">
      <img className="boot__logo" src="/icon-192.png" alt="" draggable={false} />
      <span className="boot__name">{SITE_NAME}</span>
      <span className="boot__bar" />
    </div>
  );
}

export default Boot;
