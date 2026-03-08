# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A "Magic Tiles 3"-style rhythm game for **Boyan THEGAMER**, built with **Phaser 3** (v3.60.0, loaded via CDN). Mobile-friendly with touch input. Deployed on Vercel. Dark neon/fire theme.

## Development

No build system, package manager, or tests. Serve with any static file server (e.g., `python3 -m http.server`). Uses ES modules (`type="module"`).

## Architecture

Multi-file structure using ES modules. Phaser is loaded as a global from CDN; all game code imports from local modules.

```
index.html                      - HTML shell, loads Phaser CDN + tsparticles CDN + js/main.js
css/style.css                   - Dark theme styles, game wrapper positioning
js/main.js                      - Entry point, Phaser config, scene registration, tsparticles fire bg
js/constants.js                 - Game dimensions, lanes, difficulty configs, song list (with file refs)
js/audio.js                     - SFX via Phaser audio (WAV files) + BGM via MP3 files. Procedural fallback.
js/beatmaps.js                  - 9 beatmaps (3 songs x 3 difficulties), generated via helper
js/highscore.js                 - localStorage high score persistence
js/effects/index.js             - Barrel re-export for all effects (single import point)
js/effects/textures.js          - Procedural canvas textures (fire, spark, smoke, neon, ring) + LANE_COLORS
js/effects/explosions.js        - Fire + neon hit explosions, hit particles
js/effects/milestones.js        - Combo milestone celebrations (10/25/50/100)
js/effects/dramatic.js          - Lightning, fire columns, neon pulse, fire rain, border fire, random events
js/effects/tileEffects.js       - Neon tile rendering, fire trails, combo border glow, combo fire aura
js/effects/feedback.js          - Miss flash, tap ripple
js/effects/lavaExplosions.js    - Color-matched lava tile explosions (hit + miss)
js/effects/background.js        - Lava zone, strike line, lane dividers, ambient particles
js/managers/BonusNameManager.js - Bonus name spawning, animation, tap handling, cleanup
js/scenes/BootScene.js          - Splash screen + audio preloader with loading bar
js/scenes/MenuScene.js          - Song + difficulty selection, high score display
js/scenes/GameScene.js          - Core gameplay loop, input, scoring, level progression
js/scenes/GameOverScene.js      - Results, new record fanfare, play again / menu
audio/sfx/                      - 38 WAV sound effects: 24 retro SFX (CC0 Juhani Junkala) + 14 announcer voices (CC0 Kenney)
audio/music/                    - 3 MP3 music tracks (electronic/techno, CC0)
```

### Key Design Decisions

- **Audio: file-based SFX + file-based BGM** with procedural Web Audio API fallback. SFX are 8-bit retro WAV files loaded by Phaser in BootScene. BGM are MP3 tracks that loop. If files fail to load, game still works (silent or procedural fallback).
- **NEVER use external CDN URLs for audio** — Pixabay and similar services return 403 errors. Always download files and commit them to the repo.
- **Phaser rejects data URIs** for audio — don't try `data:audio/wav;base64,...`.
- **Dark theme + ADD blend mode** — fire/neon particles use `Phaser.BlendModes.ADD` which requires dark background to be visible. Game bg is `#0a0a12`.
- **tsparticles** (v3.9.1, CDN) provides ambient fire particles behind the game canvas.
- **Beatmap format**: `[timestamp_ms, lane (0-3), isLong, duration_ms]` tuples. `beatmaps.js` has a `generatePattern(startTime, bpm, notes)` helper.
- **4 difficulty modes**: easy (180), medium (300), hard (420), endless (starts level 5, speeds up every 10s).
- **Scene flow**: BootScene (preload) → MenuScene → GameScene → GameOverScene → (GameScene or MenuScene)
- **Tiles** are Phaser Graphics objects with per-lane neon colors (cyan/magenta/orange/green), animated pulse borders. Data stored via `setData('tileData', {...})`.
- **Hit detection**: lane = `Math.floor(pointer.x / LANE_WIDTH)` clamped to `[0, LANES-1]`. Vertical window controlled by constants: `HIT_WINDOW_ABOVE` (250px above), `HIT_WINDOW_BELOW` (70px below), `AUTO_MISS_THRESHOLD` (90px below), `PERFECT_THRESHOLD` (40px). All defined in `constants.js`.
- **Effects system** (`js/effects/`): modular effects split into 8 files. Textures, explosions, milestones, dramatic events, tile rendering, feedback, lava explosions, and background are separate modules. `index.js` barrel re-exports everything. `LANE_COLORS` shared constant lives in `textures.js`.
- **Lava zone depth layering**: Lava (depth 7-9) > Tiles (depth 5) > Background (depth 0-1). Explosions (depth 25+) appear above lava. Flames from lava at depth 9.
- **Level loop**: Songs loop on completion with 15% speed increase per level. Game only ends on death.
- **Announcer voices**: Kenney CC0 voice clips at combo milestones (10/25/50/100), level ups, new high scores.
- **Bonus names**: "Светльо", "Боян", "Пешко", "Цвети", "Дари" spawn every 8-15s with siren, spinning/bouncing animation, tap for bonus points.
- **Retina/HiDPI**: `resolution: window.devicePixelRatio` in Phaser config for sharp rendering.

## Code Quality Rules

- **Keep files small. Refactor early, not late.** No file should exceed ~300 lines. When a file approaches that limit, proactively split it into focused modules before adding more code. Splitting a 300-line file is easy; splitting a 1400-line file is painful.
- **One responsibility per file.** Each module should do one thing (e.g., textures, explosions, input handling). If you're adding a new feature that doesn't fit an existing file's purpose, create a new file.
- **Use barrel re-exports** (`index.js`) when splitting a module into a directory, so consumers only need one import path.
- **Extract self-contained subsystems** (like bonus names, power-ups, achievements) into `js/managers/` as standalone modules that take `scene` as a parameter.
- **When adding new effects**, add them to the appropriate file in `js/effects/` — don't dump everything into one file.

## Workflow

- The user is non-technical (a kid's dad). Make all code changes, explain in simple terms, proactively suggest improvements.
- **Always commit and push** after every change — the repo is connected to Vercel and auto-deploys on push.
- Git remote uses SSH alias `github-jubotho` for the `jubotho` GitHub account.
- Push command: `git push origin main`

## Finding Free Game Assets — FAST & EFFICIENT

### CRITICAL: Be efficient. Don't search randomly — use proven direct URLs first.

### Proven Sources (USE THESE FIRST — direct download, no searching needed)

#### Kenney.nl (CC0, best quality, direct ZIPs)
**Always try Kenney FIRST.** Professional quality, CC0, direct download URLs that always work.
- **Voiceover Pack (Fighter)**: `https://kenney.nl/media/pages/assets/voiceover-pack-fighter/fdf3a1e023-1677589837/kenney_voiceover-pack-fighter.zip` — 45 OGG clips: combo, multi_kill, flawless_victory, fight, ready, prepare_yourself, winner, etc.
- **Voiceover Pack (General)**: `https://kenney.nl/media/pages/assets/voiceover-pack/4da09a643f-1677589897/kenney_voiceover-pack.zip` — 90 OGG clips (male+female): congratulations, level_up, new_highscore, go, mission_completed, etc.
- **Browse all Kenney assets**: `https://kenney.nl/assets` — UI packs, sound packs, music, sprites, ALL CC0.

#### OpenGameArt.org (CC0, large catalog)
- **512 SFX (8-bit)** by Juhani Junkala: `https://opengameart.org/sites/default/files/The%20Essential%20Retro%20Video%20Game%20Sound%20Effects%20Collection%20%5B512%20sounds%5D.zip` (~20MB, 512 retro WAV files)
- **Cyberpunk Moonlight Sonata** (electronic MP3): `https://opengameart.org/sites/default/files/Cyberpunk%20Moonlight%20Sonata_0.mp3`
- **Music Pack 1** by phoenix1291 (electronic, per-track ZIPs): `https://opengameart.org/sites/default/files/Music_Pack1_Track_N.zip` (replace N with 1-10)

#### VoiceBosch on itch.io (CC-BY-SA, epic announcer voices)
Deep/brutal male voices. Free ($0 minimum). Requires attribution.
- **WARLORD**: `https://voicebosch.itch.io/warlord-announcer-audio-pack` — Unstoppable, Dominating, Rampage, Double Kill, Triple Kill, Annihilation
- **DRAGON**: `https://voicebosch.itch.io/dragon-announcer-audio-pack` — Killing Frenzy, Berserk, Savagery, Apocalypse (most brutal)
- **GRENADIER**: `https://voicebosch.itch.io/grenadier-announcer-audio-pack` — Kill Streak, MVP, Epic Win, Critical Hit

### Efficient Download Workflow

```bash
# 1. Download to /tmp (don't pollute project)
mkdir -p /tmp/asset_pack && cd /tmp/asset_pack
curl -L -o pack.zip "DIRECT_URL"

# 2. ALWAYS verify it's actually a ZIP (not HTML error page)
file pack.zip

# 3. Extract
unzip -o pack.zip -d extracted

# 4. Find what you need
find extracted -name "*.ogg" -o -name "*.wav" -o -name "*.mp3" | head -50

# 5. Convert OGG→WAV (Phaser prefers WAV for SFX)
afconvert input.ogg output.wav -d LEI16 -f WAVE

# 6. Copy only needed files to project
cp selected_file.wav /Users/svetoslavmitov/hobby/boyan-tiles-v1/audio/sfx/
```

### Key Rules

- **NEVER use external URLs at runtime** — download and commit. External URLs return 403/CORS errors.
- **Prefer CC0** (no attribution) over CC-BY/CC-BY-SA.
- **WAV for SFX** (small, instant playback), **MP3 for music** (compressed, 2-5MB target).
- **OGG→WAV conversion** on macOS: `afconvert input.ogg output.wav -d LEI16 -f WAVE`
- **WAV→M4A conversion** (if WAV music too large): `afconvert input.wav output.m4a -d aac -f m4af -b 128000`
- **Always `file downloaded.zip`** after download — goo.gl/shortened URLs often return HTML instead of actual files.
- **Use absolute paths** in curl/unzip commands — CWD can change between commands.

### Searching for NEW Assets (only if proven sources above don't have what you need)

1. `WebSearch` for `kenney.nl [category]` — check Kenney first
2. `WebSearch` for `opengameart CC0 [category]` — then OpenGameArt
3. `WebFetch` the page to find direct download URL (pattern: `opengameart.org/sites/default/files/...`)
4. For itch.io: browse the page, download link is usually behind a "Download Now" button
5. **Freesound.org** — CC0 sounds, but requires login to download (harder to automate)

### Integration into Game

1. Put SFX in `audio/sfx/`, music in `audio/music/`
2. Add SFX keys to `SFX_FILES` array in `audio.js` → auto-loaded by `preloadSFX()`
3. Add music to `SONGS` array in `constants.js` with `file` field → auto-loaded by BootScene
4. Create play functions in `audio.js` with `playRandom([keys], volume)` for variations
5. SFX volume: 0.15-0.3 range. Music volume: 0.8. Music should lead, SFX should not overpower it.
