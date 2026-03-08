export const GAME_WIDTH = 360;
export const GAME_HEIGHT = 640;
export const LANES = 4;
export const LANE_WIDTH = GAME_WIDTH / LANES;
export const STRIKE_LINE_Y = 440;
export const TILE_HEIGHT = 150;
export const MAX_ERRORS = 10;

export const DIFFICULTY = {
    easy:   { scrollSpeed: 300, label: 'Easy',   color: 0x44cc44 },
    medium: { scrollSpeed: 480, label: 'Medium', color: 0xffaa00 },
    hard:   { scrollSpeed: 660, label: 'Hard',   color: 0xff4444 },
};

export const SONGS = [
    { id: 'song1', title: 'Piano Dreams', artist: 'Procedural' },
    { id: 'song2', title: 'Energetic Beat', artist: 'Procedural' },
    { id: 'song3', title: 'Chill Vibes', artist: 'Procedural' },
];
