---
title: This website
summary: "The site you're on: a desktop in the browser, with windows, a taskbar and a phone layout, built as static pages."
years: 2026
status: in-progress
tech: [React, TypeScript, React Router, Vite, CSS]
repo: https://github.com/NikolaVetnic/website
image: card.webp
---

This site replaced a WordPress blog in October 2026. It works like a desktop: icons open windows that can be moved, resized and minimized, each window has its own address, and Back and Forward move between them. On a phone it becomes a home screen whose apps fill the screen.

![The desktop with the Blog open](desktop.webp)

## How it's built

- React 19, TypeScript and React Router in framework mode, built with Vite. Every page is rendered to plain HTML when the site is built, so the hosting serves only static files, and every window's address is a real page.
- Posts, projects and pages are Markdown files kept next to the code and checked when the site is built: a missing field or image stops the build.
- Visitors choose the theme, accent colour, wallpaper, text size and clock. The choice is applied before the page first appears, so it never shows in the wrong colours.
- Every change is checked (formatting, lint, types, tests, the build) and goes to a staging copy of the site automatically.

![A post on a phone, in the dark theme](phone-post.webp)
![Settings on a phone, with the teal accent and the forest wallpaper](phone-settings.webp)
