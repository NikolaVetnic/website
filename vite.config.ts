import { existsSync } from "node:fs";
import path from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type Plugin } from "vite";

// `vite preview` falls back to the root index.html for any path without a file, which hydrates a page with
// the wrong HTML. Serve pages the way the hosting will instead: a pre-rendered page at its path without the
// trailing slash, anything else from the SPA fallback. React Router's own pre-render requests are left alone.
function servePagesLikeTheHosting(): Plugin {
  return {
    name: "serve-pages-like-the-hosting",
    configurePreviewServer(server) {
      const outDir = path.resolve(server.config.root, server.config.build.outDir);

      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (process.env.IS_RR_BUILD_REQUEST === "yes" || path.extname(url.pathname)) {
          return next();
        }

        const page = path.join(decodeURIComponent(url.pathname), "index.html");
        req.url = (existsSync(path.join(outDir, page)) ? page : "/__spa-fallback.html") + url.search;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [reactRouter(), servePagesLikeTheHosting()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
