// Beatmap format: [timestamp_ms, lane (0-3), isLong (always false)]

function generatePattern(startTime, bpm, notes) {
    const interval = 60000 / bpm;
    return notes.map((n, i) => [startTime + i * interval, n, false]);
}

// ============ SONG 1: Piano Dreams ============
const song1Easy = [
    ...generatePattern(1500, 90, [0, 2, 1, 3, 0, 1, 2, 3]),
    ...generatePattern(7000, 100, [1, 3, 0, 2, 1, 0, 3, 2, 0, 1, 2, 3]),
    ...generatePattern(14500, 110, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2]),
    ...generatePattern(20500, 100, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1]),
    ...generatePattern(28000, 90, [0, 1, 2, 3, 1, 2, 0, 3]),
];

const song1Medium = [
    ...generatePattern(1000, 110, [0, 2, 1, 3, 0, 2, 3, 1]),
    ...generatePattern(5500, 120, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2]),
    ...generatePattern(12000, 130, [0, 1, 2, 3, 0, 1, 2, 3, 2, 0, 1, 3]),
    ...generatePattern(18000, 140, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(24500, 120, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1]),
    ...generatePattern(31000, 110, [0, 1, 2, 3, 1, 2, 0, 3]),
];

const song1Hard = [
    ...generatePattern(800, 140, [0, 2, 1, 3, 0, 2, 1, 3, 0, 2]),
    ...generatePattern(5200, 160, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 3, 1]),
    ...generatePattern(10700, 170, [0, 1, 2, 3, 0, 1, 2, 3, 2, 0, 1, 3, 2, 0]),
    ...generatePattern(15800, 180, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 3, 1, 0, 2, 3, 1]),
    ...generatePattern(21300, 160, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1, 2, 3]),
    ...generatePattern(27000, 180, [0, 1, 2, 3, 1, 0, 2, 3, 1, 0, 2, 3, 0, 1, 2, 3]),
    ...generatePattern(32500, 140, [0, 2, 1, 3, 0, 2, 1, 3]),
];

// ============ SONG 2: Energetic Beat ============
const song2Easy = [
    ...generatePattern(1000, 100, [0, 1, 2, 3, 2, 1, 0, 3]),
    ...generatePattern(6000, 110, [1, 0, 3, 2, 0, 3, 1, 2, 3, 0]),
    ...generatePattern(12000, 110, [2, 3, 0, 1, 3, 2, 1, 0, 2, 1]),
    ...generatePattern(18000, 100, [0, 2, 1, 3, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(24000, 90, [3, 2, 1, 0, 1, 2, 3, 0]),
];

const song2Medium = [
    ...generatePattern(800, 120, [0, 1, 2, 3, 2, 1, 0, 3, 1, 2]),
    ...generatePattern(6000, 130, [1, 0, 3, 2, 0, 3, 1, 2, 3, 0, 1, 2]),
    ...generatePattern(12000, 140, [2, 3, 0, 1, 3, 2, 1, 0, 2, 1, 3, 0]),
    ...generatePattern(18000, 140, [0, 2, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3]),
    ...generatePattern(24000, 130, [3, 2, 1, 0, 1, 2, 3, 0, 2, 1]),
    ...generatePattern(29000, 120, [0, 1, 2, 3, 0, 2, 1, 3]),
];

const song2Hard = [
    ...generatePattern(500, 150, [0, 1, 2, 3, 2, 1, 0, 3, 1, 2, 0, 3]),
    ...generatePattern(5500, 170, [1, 0, 3, 2, 0, 3, 1, 2, 3, 0, 1, 2, 3, 0]),
    ...generatePattern(10500, 180, [2, 3, 0, 1, 3, 2, 1, 0, 2, 1, 3, 0, 2, 1]),
    ...generatePattern(15500, 190, [0, 2, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(20800, 180, [3, 2, 1, 0, 1, 2, 3, 0, 2, 1, 3, 0, 2, 1]),
    ...generatePattern(25500, 170, [0, 1, 2, 3, 0, 1, 2, 3, 1, 0, 2, 3]),
    ...generatePattern(30000, 160, [0, 1, 2, 3, 0, 2, 1, 3, 0, 2]),
];

// ============ SONG 3: Chill Vibes ============
const song3Easy = [
    ...generatePattern(2000, 80, [0, 2, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(8500, 85, [1, 3, 0, 2, 1, 3, 2, 0, 1, 3]),
    ...generatePattern(16000, 85, [2, 0, 3, 1, 2, 0, 3, 1, 0, 2]),
    ...generatePattern(23500, 80, [3, 1, 0, 2, 3, 1, 2, 0, 3, 1]),
    ...generatePattern(31000, 75, [0, 1, 2, 3, 0, 1, 2, 3]),
];

const song3Medium = [
    ...generatePattern(1500, 95, [0, 2, 1, 3, 0, 2, 1, 3, 0, 2]),
    ...generatePattern(8000, 100, [1, 3, 0, 2, 1, 3, 2, 0, 1, 3, 0, 2]),
    ...generatePattern(15500, 105, [2, 0, 3, 1, 2, 0, 3, 1, 0, 2, 3, 1]),
    ...generatePattern(23000, 100, [3, 1, 0, 2, 3, 1, 2, 0, 3, 1, 0, 2]),
    ...generatePattern(30000, 95, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1]),
];

const song3Hard = [
    ...generatePattern(1000, 120, [0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(7500, 130, [1, 3, 0, 2, 1, 3, 2, 0, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(14000, 140, [2, 0, 3, 1, 2, 0, 3, 1, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(20500, 140, [3, 1, 0, 2, 3, 1, 2, 0, 3, 1, 0, 2, 3, 1]),
    ...generatePattern(27000, 130, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1]),
    ...generatePattern(33000, 120, [2, 3, 0, 1, 2, 3, 0, 1]),
];

// ============ SONG 4: Moonlight v2 (~108 BPM) ============
const song4Easy = [
    ...generatePattern(1500, 85, [0, 2, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(7500, 95, [1, 3, 0, 2, 1, 0, 3, 2, 0, 1]),
    ...generatePattern(14000, 100, [2, 0, 3, 1, 0, 2, 3, 1, 2, 0]),
    ...generatePattern(20500, 95, [3, 1, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2]),
    ...generatePattern(28000, 85, [0, 2, 1, 3, 0, 1, 2, 3]),
];

const song4Medium = [
    ...generatePattern(1000, 108, [0, 2, 1, 3, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(6500, 115, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2]),
    ...generatePattern(13000, 120, [2, 0, 3, 1, 2, 0, 3, 1, 0, 2, 3, 1]),
    ...generatePattern(19500, 115, [3, 1, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2, 3, 1]),
    ...generatePattern(27000, 108, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2]),
];

const song4Hard = [
    ...generatePattern(800, 140, [0, 2, 1, 3, 0, 2, 1, 3, 2, 0, 1, 3]),
    ...generatePattern(6000, 155, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 3, 1]),
    ...generatePattern(11500, 165, [2, 0, 3, 1, 2, 0, 3, 1, 0, 2, 3, 1, 2, 0]),
    ...generatePattern(17000, 175, [3, 1, 0, 2, 3, 1, 2, 0, 1, 3, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(22500, 155, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 3, 1, 2, 0]),
    ...generatePattern(28000, 140, [0, 1, 2, 3, 0, 2, 1, 3, 0, 2]),
];

// ============ SONG 5: Für Elise Remix (~140 BPM dubstep) ============
const song5Easy = [
    ...generatePattern(2000, 100, [0, 1, 2, 3, 0, 1, 2, 3]),
    ...generatePattern(7000, 110, [2, 0, 3, 1, 2, 0, 1, 3, 2, 0]),
    ...generatePattern(13000, 110, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(19000, 100, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1]),
    ...generatePattern(26000, 95, [0, 2, 1, 3, 0, 1, 2, 3]),
];

const song5Medium = [
    ...generatePattern(1500, 120, [0, 1, 2, 3, 0, 1, 3, 2, 0, 1]),
    ...generatePattern(6500, 135, [2, 0, 3, 1, 2, 0, 1, 3, 2, 0, 3, 1]),
    ...generatePattern(12000, 140, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2]),
    ...generatePattern(17500, 140, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1, 2, 3]),
    ...generatePattern(24000, 130, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3]),
    ...generatePattern(30000, 120, [0, 1, 2, 3, 0, 2, 1, 3]),
];

const song5Hard = [
    ...generatePattern(1000, 150, [0, 1, 2, 3, 0, 1, 3, 2, 0, 1, 2, 3]),
    ...generatePattern(6000, 170, [2, 0, 3, 1, 2, 0, 1, 3, 2, 0, 3, 1, 0, 2]),
    ...generatePattern(11000, 180, [1, 3, 0, 2, 1, 3, 0, 2, 1, 3, 0, 2, 3, 1]),
    ...generatePattern(16000, 190, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1, 2, 3, 0, 1]),
    ...generatePattern(21500, 180, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(26500, 170, [1, 3, 0, 2, 1, 0, 3, 2, 0, 1, 2, 3]),
    ...generatePattern(31000, 150, [0, 1, 2, 3, 0, 2, 1, 3, 0, 2]),
];

// ============ SONG 6: Mozart Remix (~130 BPM) ============
const song6Easy = [
    ...generatePattern(1500, 95, [0, 2, 1, 3, 0, 2, 1, 3]),
    ...generatePattern(7000, 100, [1, 0, 3, 2, 0, 3, 1, 2, 0, 1]),
    ...generatePattern(13000, 105, [3, 1, 0, 2, 3, 1, 2, 0, 3, 1]),
    ...generatePattern(19500, 100, [2, 0, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3]),
    ...generatePattern(27000, 90, [0, 1, 2, 3, 1, 2, 0, 3]),
];

const song6Medium = [
    ...generatePattern(1000, 115, [0, 2, 1, 3, 0, 2, 3, 1, 0, 2]),
    ...generatePattern(6500, 125, [1, 0, 3, 2, 0, 3, 1, 2, 0, 1, 3, 2]),
    ...generatePattern(12500, 130, [3, 1, 0, 2, 3, 1, 2, 0, 3, 1, 0, 2]),
    ...generatePattern(18500, 130, [2, 0, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 2, 0]),
    ...generatePattern(25500, 120, [0, 1, 2, 3, 1, 2, 0, 3, 2, 1, 0, 3]),
    ...generatePattern(31500, 115, [0, 2, 1, 3, 0, 1, 2, 3]),
];

const song6Hard = [
    ...generatePattern(800, 145, [0, 2, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3]),
    ...generatePattern(6000, 160, [1, 0, 3, 2, 0, 3, 1, 2, 0, 1, 3, 2, 1, 0]),
    ...generatePattern(11500, 175, [3, 1, 0, 2, 3, 1, 2, 0, 3, 1, 0, 2, 3, 1]),
    ...generatePattern(16500, 185, [2, 0, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3, 2, 0, 1, 3]),
    ...generatePattern(22000, 175, [0, 1, 2, 3, 1, 2, 0, 3, 2, 1, 3, 0, 1, 2]),
    ...generatePattern(27000, 160, [3, 0, 2, 1, 3, 0, 1, 2, 3, 0, 2, 1]),
    ...generatePattern(32000, 145, [0, 1, 2, 3, 0, 2, 1, 3, 0, 2]),
];

export const BEATMAPS = {
    song1: { easy: song1Easy, medium: song1Medium, hard: song1Hard },
    song2: { easy: song2Easy, medium: song2Medium, hard: song2Hard },
    song3: { easy: song3Easy, medium: song3Medium, hard: song3Hard },
    song4: { easy: song4Easy, medium: song4Medium, hard: song4Hard },
    song5: { easy: song5Easy, medium: song5Medium, hard: song5Hard },
    song6: { easy: song6Easy, medium: song6Medium, hard: song6Hard },
};
