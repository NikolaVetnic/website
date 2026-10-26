import { existsSync } from "node:fs";
import path from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type Plugin } from "vite";

// `vite preview` falls back to the root index.html for any path without a file, which hydrates a page with
// the wrong HTML. Serve pages the way the hosting will instead: a pre-rendered page at its path without the
// trailing slash, anything else from the SPA fallback (public/.htaccess has the same rules for Apache). React
// Router's own pre-render requests are left alone.
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

// The dev server serves public/ file by file, so a folder's address, such as a game's page at /apps/knossos/,
// would get the site's own HTML instead, and its "nothing here". Serve the folder's index.html there, as the
// hosting does.
function serveFolderPagesInDev(): Plugin {
  return {
    name: "serve-folder-pages-in-dev",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const page = path.join(decodeURIComponent(url.pathname), "index.html");
        if (url.pathname.endsWith("/") && existsSync(path.join(server.config.publicDir, page))) {
          req.url = page + url.search;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [reactRouter(), servePagesLikeTheHosting(), serveFolderPagesInDev()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
