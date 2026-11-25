import { existsSync } from "node:fs";
import path from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type Plugin } from "vite";

import { FEATURED_FILE, getDesktopWidgets, POSTS_DIR } from "./app/desktop/widgets.server";

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

// What the desktop's widgets show (the newest post, the featured card) as a module made from the content at build
// time, `virtual:desktop-widgets`: the desktop is drawn around every page, so this reaches every page, the
// pre-rendered HTML included, without a request. In development a change to a post or to the card reloads the page.
function desktopWidgets(): Plugin {
  const id = "virtual:desktop-widgets";
  const resolvedId = `\0${id}`;

  return {
    name: "desktop-widgets",
    resolveId(source) {
      return source === id ? resolvedId : null;
    },
    load(moduleId) {
      return moduleId === resolvedId ? `export default ${JSON.stringify(getDesktopWidgets())};` : null;
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (file !== FEATURED_FILE && !file.startsWith(POSTS_DIR + path.sep)) {
          return;
        }
        for (const environment of Object.values(server.environments)) {
          const module = environment.moduleGraph.getModuleById(resolvedId);
          if (module) {
            environment.moduleGraph.invalidateModule(module);
          }
        }
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.add([FEATURED_FILE, POSTS_DIR]);
      server.watcher.on("add", refresh).on("change", refresh).on("unlink", refresh);
    },
  };
}

export default defineConfig({
  plugins: [reactRouter(), servePagesLikeTheHosting(), serveFolderPagesInDev(), desktopWidgets()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
