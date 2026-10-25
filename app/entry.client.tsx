import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import { normalizePath } from "~/desktop/apps";

// A host may serve a page at its path with a trailing slash (LiteSpeed redirects /blog to /blog/). The router
// would then ask for /blog/_.data when it comes back to that page, a file the build doesn't have. Drop the slash
// before the router reads the address; the pre-rendered HTML is the same page either way.
const { pathname, search, hash } = window.location;
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
