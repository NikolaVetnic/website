# Rogue C in the browser

The browser build of [Rogue C](https://github.com/NikolaVetnic/RogueC), a roguelike in C drawn with raylib and compiled
to WebAssembly with Emscripten. The Rogue C window shows it in an iframe, at `/apps/rogue-c/`.

It isn't built here: building it needs Emscripten and raylib, which the site's CI doesn't have. `www/` holds the files
the RogueC repository's `make web` writes to its `build/www/` (the page, its script, the WebAssembly and the font data,
with the font's licence, `OFL.txt`), as they came out; `npm run build:games` copies them to `public/apps/rogue-c/`.

To update it, in the RogueC repository:

```
make web
cp build/www/index.html build/www/index.js build/www/index.wasm build/www/index.data <website>/games/rogue-c/www/
```

Now from RogueC 38e9fb5, built with Emscripten 7.0.1.

The game keeps its save, options and high scores in the browser's local storage (`roguec_*`), on the site's origin,
and saves when its window closes.
