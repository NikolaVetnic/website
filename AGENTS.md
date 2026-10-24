# AGENTS.md

Conventions for anyone (human or coding agent) working in this repo.

## What this is

The personal site at [nikolapacekvetnic.rs](https://nikolapacekvetnic.rs): a desktop-style interface (icons, windows, taskbar) with a blog, portfolio and music. It replaces an older WordPress site.

## Stack

- React 19, TypeScript, React Router 8 in framework mode, Vite 8.
- `ssr: false` with pre-rendering (`react-router.config.ts`): the build in `build/client` is static HTML, JS and CSS.
- Plain CSS, one stylesheet per component, BEM-style class names (`desktop-icon__caption`).
- Hosting is shared Apache hosting (PHP and MySQL available, no Node runtime). Anything dynamic later goes into small PHP scripts under `api/`.

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
- Every page is a child of the layout route in `app/routes.ts`, which draws the desktop. A page route exports `meta` (built with `getPageMeta` from `app/meta.ts`) and renders nothing; the URL names the focused window, and `Shell` keeps the two in step.
- Keep components small and match the surrounding style.

## Git and pull requests

- `main` is the trunk. Branch from it as `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<issue>-<slug>` or `ci/<issue>-<slug>`.
- One logical change per commit. Short imperative titles; the body explains why, one line per paragraph, ending with `Refs #N`.
- PR descriptions list the commits and say "Closes #N". The owner reviews and merges every PR.
- No AI attribution lines in commits or PR descriptions.
- CI (format check, lint, typecheck, build) must pass before merging.
