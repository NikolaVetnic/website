---
title: Algorithmically Augmented Percussion
summary: A live electronic-drum performance steering a precomposed system of formal processes, which answers in sound and image.
years: 2026
status: in-progress
tech: [Python, Max, MSP, Jitter]
repo: https://github.com/NikolaVetnic/AAP_PoC
featured: true
---

A proof of concept for computer music built from hierarchical, multi-parametric, partially independent and sometimes conflicting formal processes, and for future pieces written the same way.

A simple live performance on electronic drums supplies structure, timing and energy. A precomposed system in Python reads it according to the piece's current formal state, its memory and several processes at once, settles their conflicts, and answers through Max with musical phrases, sound and visuals.

The premise: **compositional complexity does not require equivalent physical performance complexity.** How the work is shared between performer and machine is itself part of the composition.

```mermaid
flowchart TD
  drums["Electronic drums"] --> maxIn["Max"]
  score["Composition JSON"] --> model["Precomposed formal model"]
  maxIn --> python
  model --> python
  subgraph python["Python"]
    direction TB
    analyze["Analyze the gesture, determine the state"] --> memory["Consult memory, run the processes"]
    memory --> negotiate["Negotiate conflicts, apply constraints"]
  end
  python --> phrase["Generated phrase"]
  phrase --> maxOut["Max"]
  maxOut --> audio["MSP: audio"]
  maxOut --> visuals["Jitter: visuals"]
```

## Where it stands

It is built in stages, each ending in listening rather than in a passing test suite. Reading the drums into Max works; the next steps need the real kit in front of it: its pads and zones, the hi-hat pedal, and the delay from strike to sound.
