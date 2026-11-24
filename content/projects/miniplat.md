---
title: MiniPlat
summary: "A course platform for a preschool teachers' college: a public catalogue of subjects, and an editor behind a login for their lecturers."
years: 2026
status: finished
tech: [.NET, PostgreSQL, OpenIddict, React, Docker]
repo: https://github.com/NikolaVetnic/MiniPlat
image: card.webp
featured: true
---

A small course platform for the preschool teachers' college in Novi Sad: a public catalogue of subjects that anyone can read, and an editor behind a login for the lecturers who own them.

Visitors see the subjects grouped by level, year and semester, each with its topics, descriptions and links to materials; no account is needed, and subjects that aren't running are left out. A lecturer who signs in gets the same pages with editing on their own subjects: rename a topic, reorder the list, hide one from students, attach a link, bring back a deleted one. An administrator can register accounts, assign staff to subjects, and export the live catalogue as YAML in the shape the seeder reads back.

![A subject as its lecturer sees it, with the editing buttons](subject-lecturer.webp)
![The same subject for a visitor, signed out](subject-visitor.webp)

The interface is in Serbian, Norwegian and English.

## How it's built

- An ASP.NET Core API on .NET 10 with clean architecture, commands and queries through MediatR, EF Core on PostgreSQL, and OpenIddict for signing in.
- A React 19 and TypeScript front end, built with Vite.
- The whole stack as one Docker Compose project: nginx terminating TLS and serving the front end, the API, which migrates and seeds the database when it starts, and PostgreSQL.
- Continuous integration for the back end, the front end, end-to-end tests and the Compose stack.
