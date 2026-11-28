---
title: Rogue C
summary: A roguelike in C, in the terminal, a desktop window and the browser; ten levels down for the Sunstone and back up to the daylight.
years: 2022–2026
status: finished
tech: [C, raylib, ncurses, WebAssembly]
repo: https://github.com/NikolaVetnic/RogueC
image: card.webp
---

A roguelike in C. Go down ten levels, find the Sunstone and carry it back up to the daylight. It began in 2022 as practice, a recreation of the classic Rogue, and grew into a whole game: a procedurally generated dungeon (rooms and corridors at the top, caves below), monsters that hunt you, unidentified potions and scrolls, weapons, armour and hunger, ray-cast line of sight with fog of war, permadeath, and a choice of turn-based or real-time play.

**[Play it in its window](/games/rogue-c)**, in Games. With a keyboard, move with WASD, the arrow keys or `hjkl`, and press `?` for the rest; a click on the map walks there. On a phone or tablet, tap where to go, tap a monster next to you to attack it, and use the buttons along the bottom for items, the stairs, resting and the menu. The game saves when its window closes and picks up where it left off.

## How it's built

- The game logic is pure C, with no input, output or globals, and deterministic for a seed: the same seed, the same dungeon.
- Three frontends share it: ncurses in the terminal, raylib in a desktop window, and the same raylib frontend compiled to WebAssembly with Emscripten for the browser, which is what plays here.
- Caves come from a cellular automaton trimmed to one connected region, the upper levels from rooms joined by corridors. Monsters find their way with distance maps, and the field of view is cast along Bresenham lines.
- Unit tests run with AddressSanitizer and UndefinedBehaviorSanitizer.

![The field of view uncovering a cave](line-of-sight.webm "The line of sight in the 2022 version")
