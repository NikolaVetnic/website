import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import { normalizePath } from "~/desktop/apps";
import { getWordPressRedirect } from "~/wordpress-redirects";

const { pathname, search, hash } = window.location;

// A link to the old WordPress site (`/?p=2074`) loads the desktop's page, since the address is the root. The
// hosting doesn't apply public/.htaccess yet, which would redirect it, so load the new page instead. Not in
// place: the HTML here is the desktop's, and the post's window would not match it.
const redirect = getWordPressRedirect(pathname, search);
if (redirect) {
  window.location.replace(redirect + hash);
} else {
  // A host may serve a page at its path with a trailing slash (LiteSpeed redirects /blog to /blog/). The router
  // would then ask for /blog/_.data when it comes back to that page, a file the build doesn't have. Drop the
  // slash before the router reads the address; the pre-rendered HTML is the same page either way.
  if (normalizePath(pathname) !== pathname) {
    window.history.replaceState(window.history.state, "", normalizePath(pathname) + search + hash);
  }

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
}
