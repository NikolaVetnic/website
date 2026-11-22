import { useEffect, useRef, useState } from "react";

import { CONTACT, getEmail, getProfileLabel, PROFILES } from "~/contact/contact";
import useBrowserValue from "~/hooks/useBrowserValue";
import "./Contact.css";

type CopyState = "idle" | "copied" | "selected";

const COPY_LABELS: Record<CopyState, string> = { idle: "Copy", copied: "Copied", selected: "Selected" };

// The Contact window: a card with the photo, the email address and the profiles.
function Contact() {
  // Empty in the pre-rendered page, filled in once the page runs (contact.ts).
  const email = useBrowserValue<string | null>(getEmail, null);
  const [copy, setCopy] = useState<CopyState>("idle");
  const addressRef = useRef<HTMLAnchorElement>(null);

  // The button says what happened for a moment, then "Copy" again.
  useEffect(() => {
    if (copy === "idle") return;
    const timer = window.setTimeout(() => setCopy("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copy]);

  const copyAddress = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopy("copied");
    } catch {
      // No clipboard (an older browser, a page not on HTTPS): select the address, for the visitor to copy.
      const selection = window.getSelection();
      if (addressRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(addressRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setCopy("selected");
    }
  };

  return (
    <div className="contact">
      <header className="contact__header">
        <img className="contact__photo" src={CONTACT.photo} alt="" width={88} height={88} />
        <div>
          <h2 className="contact__name">{CONTACT.name}</h2>
          <p className="contact__role">{CONTACT.role}</p>
        </div>
      </header>
      <p className="contact__intro">{CONTACT.intro}</p>
      <dl className="contact__rows">
        <div className="contact__row">
          <dt className="contact__label">Email</dt>
          <dd className="contact__value">
            {email ? (
              <a ref={addressRef} className="contact__link" href={`mailto:${email}`}>
                {email}
              </a>
            ) : null}
          </dd>
          <dd className="contact__action">
            <button type="button" className="contact__copy" onClick={copyAddress} disabled={!email}>
              {COPY_LABELS[copy]}
            </button>
            <span className="contact__status" role="status">
              {copy === "copied" ? "Address copied." : copy === "selected" ? "Address selected, ready to copy." : ""}
            </span>
          </dd>
        </div>
        {PROFILES.map((profile) => (
          <div key={profile.name} className="contact__row">
            <dt className="contact__label">{profile.name}</dt>
            <dd className="contact__value">
              <a className="contact__link" href={profile.url} target="_blank" rel="noopener noreferrer">
                {getProfileLabel(profile)}
                <span className="contact__external" aria-hidden="true">
                  ↗
                </span>
                <span className="contact__status">(opens in a new tab)</span>
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default Contact;
