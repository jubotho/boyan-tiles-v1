# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A "Magic Tiles 3"-style rhythm game built as a single-file web app (`index.html`) using **Phaser 3** (v3.60.0, loaded via CDN). The game is designed for mobile-friendly play with touch input.

## Development

No build system, package manager, or tests. Open `index.html` directly in a browser or serve it with any static file server (e.g., `python3 -m http.server`).

## Architecture

Everything lives in `index.html` — HTML, CSS, inline JavaScript, and game logic. Key structure:

- **Phaser config**: Single scene with `preload`, `create`, `update` lifecycle functions
- **Game constants**: `LANES` (4), `LANE_WIDTH`, `STRIKE_LINE_Y` (hit target line), `TILE_HEIGHT`, `SCROLL_SPEED`, `MAX_ERRORS` (lives system)
- **Beatmap**: Hardcoded array of `[timestamp_ms, lane_index, isLong, duration_ms]` tuples that define when/where tiles appear
- **Tile types**: Regular tap tiles (black) and long hold tiles (blue) with duration
- **Scoring**: PERFECT/GREAT/GOOD ratings based on distance from strike line, combo multiplier system
- **Audio**: BGM loaded via Phaser from Pixabay CDN; hit/miss SFX generated with Web Audio API oscillators (Phaser rejects data URIs)

## Key Game Mechanics

- Tiles scroll downward; player taps when the tile bottom reaches the strike line at y=520
- Hold tiles require sustained touch until duration expires
- Misses (tapping empty lanes, missing tiles, releasing holds early) cost lives
- Game ends when lives reach 0; reloads page to restart

## Workflow

- The user is non-technical. Make all code changes, explain in simple terms, and proactively suggest improvements.
- **Always commit and push** after every change — the repo is connected to Vercel and auto-deploys on push.
- Git remote uses SSH alias `github-jubotho` for the `jubotho` GitHub account.
- Push command: `git push origin main`
