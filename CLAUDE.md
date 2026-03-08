# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A "Magic Tiles 3"-style rhythm game for **Boyan THEGAMER**, built with **Phaser 3** (v3.60.0, loaded via CDN). Mobile-friendly with touch input. Deployed on Vercel.

## Development

No build system, package manager, or tests. Serve with any static file server (e.g., `python3 -m http.server`). Uses ES modules (`type="module"`).

## Architecture

Multi-file structure using ES modules. Phaser is loaded as a global from CDN; all game code imports from local modules.

```
index.html              - HTML shell, loads Phaser CDN + js/main.js
css/style.css           - Styles with animated gradient background
js/main.js              - Entry point, Phaser config, scene registration
js/constants.js         - Game dimensions, lanes, difficulty configs, song list
js/audio.js             - All audio via Web Audio API (procedural BGM + SFX)
js/beatmaps.js          - 9 beatmaps (3 songs x 3 difficulties), generated via helper
js/highscore.js         - localStorage high score persistence
js/effects.js           - Gradient tiles, hit particles, miss flash, ripple, animated bg
js/scenes/BootScene.js  - Splash screen
js/scenes/MenuScene.js  - Song + difficulty selection, high score display
js/scenes/GameScene.js  - Core gameplay loop (largest file)
js/scenes/GameOverScene.js - Results, new record display, play again / menu
```

### Key Design Decisions

- **All audio is procedural** (Web Audio API oscillators) — no external audio files. External CDN URLs (Pixabay) are unreliable (403 errors). BGM uses `ProceduralBGM` class in `audio.js` with melody, bass, and percussion patterns per song.
- **Beatmap format**: `[timestamp_ms, lane (0-3), isLong, duration_ms]` tuples. `beatmaps.js` has a `generatePattern(startTime, bpm, notes)` helper to create patterns at a given BPM.
- **Difficulty** varies `scrollSpeed` (300/480/660). Constants in `DIFFICULTY` object.
- **Scene flow**: BootScene → MenuScene → GameScene → GameOverScene → (GameScene or MenuScene)
- **Tiles** are Phaser Graphics objects with gradient fills (via `effects.js`), stored data via `setData('tileData', {...})`.

## Workflow

- The user is non-technical. Make all code changes, explain in simple terms, and proactively suggest improvements.
- **Always commit and push** after every change — the repo is connected to Vercel and auto-deploys on push.
- Git remote uses SSH alias `github-jubotho` for the `jubotho` GitHub account.
- Push command: `git push origin main`
