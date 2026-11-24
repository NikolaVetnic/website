---
title: LibreTranslate CLI
summary: Translating from the command line through a self-hosted LibreTranslate server, so the text never leaves the machine.
years: 2026
status: finished
tech: [Python, Docker]
repo: https://github.com/NikolaVetnic/libretranslate-cli
---

A small command-line translator, `lt`, backed by a [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) server running in Docker on the same machine. The translation runs locally, so the text never leaves it, and the CLI itself uses nothing but Python's standard library.

```text
ltn God morgen, hvordan har du det?   # Norwegian to English
lte "Where is the train station?"     # English to Norwegian
ltn brev.txt                          # whole files
ltw skrev                             # a word in Bokmålsordboka
```

## The server only runs when it's needed

- A command that needs the server starts it: about four seconds the first time, half a second after that.
- A small background watcher stops it after fifteen minutes without use.
- With English and Norwegian loaded it uses about 250 MB of memory, against 1.5 GB with LibreTranslate's default four workers.
- It never starts on its own when Docker does.
