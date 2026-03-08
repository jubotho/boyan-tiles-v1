export const GAME_WIDTH = 360;
export const GAME_HEIGHT = 640;
export const LANES = 4;
export const LANE_WIDTH = GAME_WIDTH / LANES;
export const STRIKE_LINE_Y = 540;
export const TILE_HEIGHT = 110;
export const MAX_ERRORS = 10;

// Hit detection windows (pixels relative to strike line)
export const HIT_WINDOW_ABOVE = 500;
export const HIT_WINDOW_BELOW = 70;
export const AUTO_MISS_THRESHOLD = 90;
export const PERFECT_THRESHOLD = 40;

export const DIFFICULTY = {
    easy:     { scrollSpeed: 180, label: 'Easy',     color: 0x44cc44 },
    medium:   { scrollSpeed: 300, label: 'Medium',   color: 0xffaa00 },
    hard:     { scrollSpeed: 420, label: 'Hard',     color: 0xff4444 },
    endless:  { scrollSpeed: 180, label: 'Endless',  color: 0xaa00ff },
};

export const SONGS = [
    { id: 'song1', title: 'Cyberpunk Dreams', artist: 'CC0 Electronic', file: 'cyberpunk_moonlight' },
    { id: 'song2', title: 'Energetic Beat', artist: 'phoenix1291', file: 'energetic_beat' },
    { id: 'song3', title: 'Neon Rush', artist: 'phoenix1291', file: 'neon_rush' },
];
