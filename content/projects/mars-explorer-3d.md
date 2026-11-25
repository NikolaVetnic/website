---
title: Mars Explorer 3D
summary: An isometric 3D viewer for height maps of Mars, with a movable light and changeable palettes.
years: 2020
status: finished
tech: [Java, JavaFX]
repo: https://github.com/NikolaVetnic/Course_CG1/tree/main/Mars3D
image: card.webp
---

A 3D isometric viewer for terrain height maps, from the Computer Graphics 1 course at the Faculty of Sciences in Novi Sad. It reads a grey-scale picture of a region of Mars, brighter for higher, and draws it as a landscape, shaded by a light that can be moved around it.

![The same terrain in the four palettes](palettes.webp "One terrain in the four palettes, two with water in the low ground and two arid")

![Mars Explorer 3D showcase](youtube:C4ohcrA8Abw "The showcase")

## What it does

- A minimap of the whole height map, with a box that picks the part to draw, so the view moves across the map.
- Zoom, tilt, turn and the height of the relief, all changed while it runs, and a water level that floods the low ground.
- Shading from a light source that can be moved.
- Four palettes, two with water and two arid, which can be mixed with the brightness of the original picture.
- The terrain drawn as triangles or as raised tiles.

## The maps

Five height maps of Mars come with it: Ares Vallis (close and wide), Deuteronilus Mensae, Mellas and Candor Chasma, and Noctis Labyrinthus.

![The height map of Ares Vallis, wide](ares-vallis-wide.webp)
![The height map of Noctis Labyrinthus](noctis-labyrinthus.webp)
![The height map of Mellas and Candor Chasma](mellas-candor-chasma.webp)
