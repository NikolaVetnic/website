# K’NOSSOS landing page

The landing page the K’NOSSOS window shows (`/games/knossos` on the site), built with the site's Vite into `public/apps/knossos/` by `npm run build:games` and served at `/apps/knossos/`. See the website's AGENTS.md.

- `src/content.js`: everything the page says and links to (story, features, downloads, trailer, soundtrack, screenshots, devlog posts, the Kickstarter campaign, footer links). Edit this to change the content. In the story's paragraphs, `**…**` is bold (gold) and `*…*` emphasis (grey).
- `src/components/`: one component per section, each with its stylesheet. `src/App.css` has the colours and fonts: Jost for headings (titles ask for Futura Bk BT first, which can't be embedded), Inter for text.
- `src/images/`: WebP, made from the old site's uploads. Screenshots come in two sizes, `*-thumb.webp` (720 px, the grid) and full (up to 1920 px, the lightbox).
- `src/site.js`: links to other pages of the site open in the site's own windows when the page runs inside it.

A dev server of its own: `npx vite --config games/knossos/vite.config.ts`.
