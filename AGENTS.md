# AGENTS.md

Conventions for anyone (human or coding agent) working in this repo.

## What this is

The personal site at [nikolapacekvetnic.rs](https://nikolapacekvetnic.rs): a desktop-style interface (icons, windows, taskbar) with a blog, portfolio and music. It replaces an older WordPress site.

## Stack

- React 19, TypeScript, React Router 8 in framework mode, Vite 8.
- `ssr: false` with pre-rendering (`react-router.config.ts`): the build in `build/client` is static HTML, JS and CSS.
- Plain CSS, one stylesheet per component, BEM-style class names (`desktop-icon__caption`). Colours in window content, accents and the wallpaper come from the tokens on `:root` in `app/app.css`, as `rgb(var(--text))` or `rgb(var(--accent) / 0.1)`, so the appearance settings reach them; never write those as literals.
- Hosting is shared Apache hosting (PHP and MySQL available, no Node runtime). Anything dynamic later goes into small PHP scripts under `api/`.
- Apache serves the build by the rules in `public/.htaccess`: a page at its path, with or without a trailing slash, unknown paths from `__spa-fallback.html` with a 404, never another page's HTML. `npm run preview` serves the same HTML at the same URLs (`vite.config.ts`), so change the two together. The hosting's LiteSpeed applies only part of the file and adds a trailing slash to folders whatever it says, so never redirect a slash away there (the two redirects loop), and the app doesn't rely on the file: `entry.client.tsx` drops a trailing slash from the address before the router starts.
- Every push to `main` that passes CI is deployed to staging.nikolapacekvetnic.rs over FTPS (the `deploy-staging` job, secrets in the `staging` environment). Staging is kept out of search engines.

## Commands

| Command                           | What it does                         |
| --------------------------------- | ------------------------------------ |
| `npm run dev`                     | Dev server on http://localhost:3000  |
| `npm run build`                   | Production build into `build/client` |
| `npm run preview`                 | Serve the production build locally   |
| `npm run typecheck`               | Generate route types, then `tsc`     |
| `npm run lint`                    | ESLint                               |
| `npm run format` / `format:check` | Prettier                             |

Node version is in `.nvmrc` (at least 22.22, required by React Router 8).

## Rules for the code

- Every route is rendered at build time in Node. Do not touch `window`, `document` or `localStorage` during render; use effects or event handlers.
- No `action` or `headers` exports in routes: there is no server to run them.
- Route modules (`app/routes/*`) may use `loader` only for data that is known at build time.
- Every page is a child of the layout route in `app/routes.ts`, which draws the desktop. A page route exports `meta` (built with `getPageMeta` from `app/meta.ts`), may export a build-time `loader`, and renders nothing: its window shows the loaded data through `AppContent`. The URL is the focused window's path, and `Shell` keeps the two in step. Any other address matches the catch-all `routes/not-found.tsx`: the desktop with a notice. A route the host serves through the SPA fallback (unknown posts, unknown addresses) needs a `clientLoader`, so its first render is as empty as that HTML.
- Code that needs Node (the file system, Markdown) lives in `*.server.ts` files, so it never reaches the browser bundle.
- Small screens get the phone layout: a home screen and full-screen apps. Media queries draw it, so the pre-rendered page is right before any script runs; `usePhoneLayout` only switches behaviour (dragging, what a tap does). The query is written out in `usePhoneLayout.ts` and in each stylesheet that uses it, so change them together.
- The visitor's appearance settings live in `app/settings/settings.ts` and in their browser's storage. `applyStoredSettings` puts them on `<html>` (`data-theme`, …), where the stylesheets read them; its source also runs as the inline script in `<head>` that applies them before the first paint, so it must stay self-contained: no imports or names from outside the function (a test runs it from its text). A new setting goes into `Settings`, `SETTING_VALUES` and `DEFAULT_SETTINGS`, and into that function if the stylesheets need it. Components read settings with `useSettings`.
- A game's landing page is a small React app of its own in `games/<game>/` (plain JavaScript, its own look), built by `npm run build:games` into `public/apps/<game>/` (ignored by git) before `dev` and `build`, and served at `/apps/<game>/`. Edit it there; `npx vite --config games/sodhara/vite.config.ts` gives it a dev server of its own. Keep its media light: clips as WebM with an MP4 fallback, images as WebP.
- Keep components small and match the surrounding style.

## Content

- Blog posts are `content/blog/<slug>.md`: YAML front matter with `title`, `date` (`YYYY-MM-DD`), `summary` and optional `tags`, then Markdown. The file name is the URL (`/blog/<slug>`): lowercase letters and digits joined by hyphens.
- A post's images go in `public/blog/<slug>/` and are written by file name: `![Alt text](photo.jpg "Caption")`. An image on a line of its own becomes a figure, its title the caption.
- A post with a missing or malformed field, or a local image that isn't there, fails the build, with the post's name in the message.
- The About window's pages are `content/about/<page>.<lang>.md`, one file per language (`bio.en.md`, `bio.sr.md`, `bio.no.md`, `resume.en.md`); every page needs an English one. Front matter: `title`, `language` (its name in itself, as the switch shows it), `flag` (a country code with an SVG in `public/flags/`) and optional `pdf` (an `https://` link), then Markdown; images in `public/about/`. A page with more than one language gets the language switch. A new flag goes in `public/flags/` at 4:3, from flag-icons (MIT, notice in `public/flags/LICENSE.txt`) where possible. Any Markdown is rendered by `app/content/markdown.server.ts` and shown with the `Prose` component, so it reads and links like a post.
- The posts from the old WordPress site, and the pages listed in its `PAGES` (so far the About pages), were imported by `npm run import:wordpress` (`scripts/import-wordpress.ts`). Running it again overwrites them, so edits to an imported post or page are lost until the old site is gone and the script retired.
- Links to the old site (`/?p=<id>`, `/?page_id=<id>`, archives, feeds) are redirected to their new pages, from the table in `app/wordpress-redirects.ts` by `entry.client.tsx` and with the same rules in `public/.htaccess`. Change the two together; a test fails when they disagree. A page imported later can get its own path in both.
- Keep at least one post: with none, `blog/:slug` has a loader but nothing to pre-render, which React Router refuses with `ssr: false`.

## Git and pull requests

- `main` is the trunk. Branch from it as `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<issue>-<slug>` or `ci/<issue>-<slug>`.
- One logical change per commit. Short imperative titles; the body explains why, one line per paragraph, ending with `Refs #N`.
- PR descriptions list the commits and say "Closes #N". The owner reviews and merges every PR.
- No AI attribution lines in commits or PR descriptions.
- CI (format check, lint, typecheck, build) must pass before merging.
