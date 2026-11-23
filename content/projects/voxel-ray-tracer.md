---
title: Voxel ray tracer
summary: Ray tracing voxel terrain, meshes and quadric surfaces, with the voxel traversal taken from brute force to octrees.
years: 2020–2021
status: finished
tech: [Java, JavaFX]
repo: https://github.com/NikolaVetnic/RG2_GI
image: card.webp
---

A ray tracer from the Computer Graphics 2 course at the Faculty of Sciences in Novi Sad, built on a core renderer by the course's professor, Marko Savić. The work here is the solids the renderer draws, above all voxels, and making them fast. It later became the subject of the master's thesis.

![Valles Marineris on Mars as voxel terrain, in four palettes: arctic, pastoral, desert and magma](valles-marineris.webp "Valles Marineris on Mars, as voxel terrain in four palettes")

## Voxels

A VoxelWorld stores a solid as a grid of voxels. Finding where a ray hits it went through four algorithms: brute force; then one that follows the ray's direction; then a "grid march", which checks only the one of the seven possible neighbours that the ray's direction points to; and last, octrees, which store the voxels so that empty space is skipped in large steps.

![A green voxel object, lit directly](voxel-world.webp)
![A yellow voxel object, lit with global illumination](voxel-world-gi.webp)

## Meshes, quadrics and solid geometry

- Triangle meshes loaded from OBJ files, with textures and smooth shading from the surface normals.
- Every quadric surface: sphere, cylinder, cone, ellipsoid, paraboloid, hyperboloid and hyperbolic paraboloid.
- Constructive solid geometry: complex solids made from simple ones joined by Boolean operations.

![A shiny teapot, loaded from an OBJ mesh, in a coloured room](teapot.webp)
![A glass sphere in a coloured room](glass-sphere.webp)
![A spacecraft mesh as a wireframe, with global illumination](spacecraft.webp)
