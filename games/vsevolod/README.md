# VSEVOLOD landing page

The landing page the VSEVOLOD window shows (`/games/vsevolod` on the site), built with the site's Vite into `public/apps/vsevolod/` by `npm run build:games` and served at `/apps/vsevolod/`. See the website's AGENTS.md.

- `src/content.js`: everything the page says and links to (story, features, screenshots, soundtrack, downloads, where the project stands). Edit this to change the content. In the paragraphs, `**…**` is bold (ivory) and `*…*` emphasis (frost blue).
- `src/components/`: one component per section, each with its stylesheet. `src/App.css` has the colours, taken from the cover, and the fonts: Cormorant Garamond for titles, Inter for text.
- `src/images/`: WebP, made from the old site's uploads. Screenshots come in two sizes, `*-thumb.webp` (640 px, the grid) and full (1280 px, the lightbox).
- `src/site.js`: links to other pages of the site open in the site's own windows when the page runs inside it.

A dev server of its own: `npx vite --config games/vsevolod/vite.config.ts`.
