import path from "node:path";

import { defineConfig } from "vite";

// The SODHARA landing page, a small React app of its own, which the SODHARA window shows in an iframe so that its
// responsive design follows the window's size. Built into public/apps/sodhara, where the site's dev server and
// build serve it as static files at /apps/sodhara/.
export default defineConfig({
  root: import.meta.dirname,
  base: "/apps/sodhara/",
  build: {
    outDir: path.resolve(import.meta.dirname, "../../public/apps/sodhara"),
    emptyOutDir: true,
  },
});
