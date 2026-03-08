# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A "Magic Tiles 3"-style rhythm game for **Boyan THEGAMER**, built with **Phaser 3** (v3.60.0, loaded via CDN). Mobile-friendly with touch input. Deployed on Vercel. Dark neon/fire theme.

## Development

No build system, package manager, or tests. Serve with any static file server (e.g., `python3 -m http.server`). Uses ES modules (`type="module"`).

## Architecture

Multi-file structure using ES modules. Phaser is loaded as a global from CDN; all game code imports from local modules.

```
index.html              - HTML shell, loads Phaser CDN + tsparticles CDN + js/main.js
css/style.css           - Dark theme styles, game wrapper positioning
js/main.js              - Entry point, Phaser config, scene registration, tsparticles fire bg
js/constants.js         - Game dimensions, lanes, difficulty configs, song list (with file refs)
js/audio.js             - SFX via Phaser audio (WAV files) + BGM via MP3 files. Procedural fallback.
js/beatmaps.js          - 9 beatmaps (3 songs x 3 difficulties), generated via helper
js/highscore.js         - localStorage high score persistence
js/effects.js           - MASSIVE effects system: neon tiles, fire/neon explosions, combo milestones,
                          lightning, fire columns, fire rain, border fire, neon pulses, fire trails
js/scenes/BootScene.js  - Splash screen + audio preloader with loading bar
js/scenes/MenuScene.js  - Song + difficulty selection, high score display
js/scenes/GameScene.js  - Core gameplay loop (largest file), dramatic events, combo system
js/scenes/GameOverScene.js - Results, new record fanfare, play again / menu
audio/sfx/              - 24 WAV sound effects (8-bit retro, CC0)
audio/music/            - 3 MP3 music tracks (electronic/techno, CC0)
```

### Key Design Decisions

- **Audio: file-based SFX + file-based BGM** with procedural Web Audio API fallback. SFX are 8-bit retro WAV files loaded by Phaser in BootScene. BGM are MP3 tracks that loop. If files fail to load, game still works (silent or procedural fallback).
- **NEVER use external CDN URLs for audio** — Pixabay and similar services return 403 errors. Always download files and commit them to the repo.
- **Phaser rejects data URIs** for audio — don't try `data:audio/wav;base64,...`.
- **Dark theme + ADD blend mode** — fire/neon particles use `Phaser.BlendModes.ADD` which requires dark background to be visible. Game bg is `#0a0a12`.
- **tsparticles** (v3.9.1, CDN) provides ambient fire particles behind the game canvas.
- **Beatmap format**: `[timestamp_ms, lane (0-3), isLong, duration_ms]` tuples. `beatmaps.js` has a `generatePattern(startTime, bpm, notes)` helper.
- **4 difficulty modes**: easy (300), medium (480), hard (660), endless (starts level 5, speeds up every 10s).
- **Scene flow**: BootScene (preload) → MenuScene → GameScene → GameOverScene → (GameScene or MenuScene)
- **Tiles** are Phaser Graphics objects with per-lane neon colors (cyan/magenta/orange/green), animated pulse borders. Data stored via `setData('tileData', {...})`.
- **Hit detection**: lane = `Math.floor(pointer.x / LANE_WIDTH)` clamped to `[0, LANES-1]`. Vertical window: tile center from -250 to +70 relative to strike line. Auto-miss at +90.
- **Effects system** (`effects.js`): canvas-generated textures (fire, neon, smoke, ring particles), combo milestones at 10/25/50/100, random dramatic events every 2.5-6.5s, fire trails behind tiles, combo border glow.
- **Bonus names**: "Светльо", "Боян", "Пешко", "Цвети", "Дари" spawn every 8-15s with siren, spinning/bouncing animation, tap for bonus points.

## Workflow

- The user is non-technical (a kid's dad). Make all code changes, explain in simple terms, proactively suggest improvements.
- **Always commit and push** after every change — the repo is connected to Vercel and auto-deploys on push.
- Git remote uses SSH alias `github-jubotho` for the `jubotho` GitHub account.
- Push command: `git push origin main`

## Finding Free Game Assets (IMPORTANT)

### Sound Effects

**Best source: [OpenGameArt.org](https://opengameart.org)** — always filter for **CC0** license (no attribution required).

Proven working packs:
- **"512 Sound Effects (8-bit style)" by Juhani Junkala** — CC0, 512 retro game sounds organized by category (coins, impacts, explosions, powerups, menu, alarms, etc.). ZIP download: `https://opengameart.org/sites/default/files/The%20Essential%20Retro%20Video%20Game%20Sound%20Effects%20Collection%20%5B512%20sounds%5D.zip` (~20MB)
- **"100 CC0 SFX"** — CC0, 100 effects (hits, explosions, metal, springs). ZIP: `https://opengameart.org/sites/default/files/100-CC0-SFX_0.zip` (~3MB)

Search strategy:
1. Search OpenGameArt: `WebSearch` for `opengameart CC0 [category] sound effects`
2. Fetch individual pages with `WebFetch` to get direct download URLs (look for `opengameart.org/sites/default/files/...`)
3. Download ZIP with `curl -L -o file.zip "URL"`
4. Extract only needed files: `unzip -j archive.zip "*.wav"` or specific files with `cp`
5. **Keep WAV format** — universally supported by browsers and Phaser
6. Clean up: delete ZIPs and extracted pack folders, keep only selected files in `audio/sfx/`

### Music Tracks

**Best source: [OpenGameArt.org](https://opengameart.org)** CC0 collections.

Proven working sources:
- **"Cyberpunk Moonlight Sonata"** — CC0 electronic, MP3 2.3MB. Direct: `https://opengameart.org/sites/default/files/Cyberpunk%20Moonlight%20Sonata_0.mp3`
- **"Music Pack 1" by phoenix1291** — CC0, 10 electronic tracks in ZIP (each track is a separate ZIP with FLAC/MP3/OGG/WAV). Individual track ZIPs: `https://opengameart.org/sites/default/files/Music_Pack1_Track_N.zip`
- **CC0 Upbeat/Electronic Music collection page**: `https://opengameart.org/content/cc0-dance-electronic-music` (50+ tracks, browse individual pages for download links)

Search strategy:
1. `WebSearch` for `opengameart CC0 electronic techno dance music mp3`
2. `WebFetch` individual track pages to find direct download URLs
3. Download with `curl -L -o name.mp3 "URL"`
4. For ZIP packs: extract only MP3 (`unzip -j pack.zip "*.mp3"`)
5. If only WAV available, convert: `afconvert input.wav output.m4a -d aac -f m4af -b 128000` (macOS)
6. **Target size: 2-5MB per track** (MP3). WAV files 10MB+ are too large — convert or find MP3.
7. Keep files in `audio/music/`, reference in `constants.js` SONGS array `file` field.

### General Tips for Finding Assets

- **Always prefer CC0** over CC-BY (no attribution hassle) or CC-BY-SA (viral license).
- **NEVER link to external URLs at runtime** — always download and commit to repo. External URLs break (403, CORS, removed).
- **OpenGameArt download URLs** follow pattern: `https://opengameart.org/sites/default/files/[filename]`
- **Check file type after download**: `file downloaded.zip` — sometimes you get HTML (broken link) instead of actual file.
- **goo.gl and other shortened URLs** often fail — use direct OpenGameArt URLs instead.
- Other CC0 sources (less tested): Freesound.org, itch.io (filter CC0), Pixabay (had 403 issues before).
- **Mixkit.co** has game sounds but no easy direct download URLs — harder to automate.
- For **sprites/images**: OpenGameArt also has 2D assets. Kenney.nl has excellent CC0 game assets.

### Integration Pattern

When adding new audio to the game:
1. Put SFX files in `audio/sfx/`, music in `audio/music/`
2. Add SFX keys to `SFX_FILES` array in `audio.js` → auto-loaded by `preloadSFX()`
3. Add music to `SONGS` array in `constants.js` with `file` field → auto-loaded by BootScene
4. Create play functions in `audio.js` with `playRandom([keys], volume)` for variations
5. Always add procedural fallback in case files don't load
