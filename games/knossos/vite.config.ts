import path from "node:path";

import { defineConfig } from "vite";

// The K’NOSSOS landing page, a small React app of its own, which the K’NOSSOS window shows in an iframe so that its
// responsive design follows the window's size. Built into public/apps/knossos, where the site's dev server and
// build serve it as static files at /apps/knossos/.
export default defineConfig({
  root: import.meta.dirname,
  base: "/apps/knossos/",
  build: {
    outDir: path.resolve(import.meta.dirname, "../../public/apps/knossos"),
    emptyOutDir: true,
  },
});
