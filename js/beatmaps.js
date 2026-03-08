// Beatmap format: [timestamp_ms, lane (0-3), isLong, duration_ms]
// duration_ms only needed when isLong=true

function generatePattern(startTime, bpm, notes) {
    const interval = 60000 / bpm;
    return notes.map((n, i) => {
        const time = startTime + i * interval;
        if (Array.isArray(n)) {
            return [time, n[0], true, n[1]];
        }
        return [time, n, false];
    });
}

// ============ SONG 1: Piano Dreams ============
const song1Easy = [
    // Gentle intro
    ...generatePattern(1500, 90, [0, 2, 1, 3, 0, 1, 2, 3]),
    // Verse 1
    ...generatePattern(7000, 100, [1, 3, 0, 2, 1, 0, 3, 2, 0, 1, 2, 3]),
    // Chorus
    ...generatePattern(14500, 110, [0, 2, 1, 3, 2, 0, 3, 1, 0, 2]),
    // Verse 2
    ...generatePattern(20500, 100, [3, 1, 2, 0, 3, 2, 1, 0, 2, 3, 0, 1]),
    // Outro
    ...generatePattern(28000, 90, [0, 1, 2, 3, 1, 2, 0, 3]),
];

const song1Medium = [
    // Intro
    ...generatePattern(1000, 110, [0, 2, 1, 3, [0, 800], 2, 3, 1]),
    // Verse 1
    ...generatePattern(5500, 120, [1, 3, 0, 2, [1, 900], 3, 0, 2, 1, 3, 0, 2]),
    // Build-up
    ...generatePattern(12000, 130, [0, 1, 2, 3, 0, 1, 2, 3, [2, 1000], 0, 1, 3]),
    // Chorus
    ...generatePattern(18000, 140, [0, 2, 1, 3, 2, 0, 3, 1, [0, 800], 2, 3, 1, 0, 2]),
    // Verse 2
    ...generatePattern(24500, 120, [3, 1, [2, 900], 0, 3, 2, 1, 0, 2, 3, [0, 1000], 1]),
    // Outro
    ...generatePattern(31000, 110, [0, 1, 2, 3, [1, 800], 2, 0, 3]),
];

const song1Hard = [
    // Fast intro
    ...generatePattern(800, 140, [0, 2, 1, 3, [0, 700], 2, 1, 3, 0, 2]),
    // Verse 1 - rapid
    ...generatePattern(5200, 160, [1, 3, 0, 2, [1, 800], 3, 0, 2, 1, 3, 0, 2, [3, 600], 1]),
    // Build-up - dense
    ...generatePattern(10700, 170, [0, 1, 2, 3, 0, 1, 2, 3, [2, 900], 0, 1, 3, 2, 0]),
    // Chorus - intense
    ...generatePattern(15800, 180, [0, 2, 1, 3, [2, 700], 0, 3, 1, 0, 2, 3, 1, [0, 800], 2, 3, 1]),
    // Bridge
    ...generatePattern(21300, 160, [3, 1, [2, 1000], 0, 3, 2, 1, 0, 2, 3, [0, 900], 1, 2, 3]),
    // Final chorus
    ...generatePattern(27000, 180, [0, 1, 2, 3, [1, 700], 0, 2, 3, 1, 0, [2, 800], 3, 0, 1, 2, 3]),
    // Outro
    ...generatePattern(32500, 140, [0, 2, 1, 3, [0, 1000], 2, 1, 3]),
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
    ...generatePattern(800, 120, [0, 1, [2, 800], 3, 2, 1, 0, 3, 1, 2]),
    ...generatePattern(6000, 130, [1, 0, 3, [2, 900], 0, 3, 1, 2, 3, 0, 1, 2]),
    ...generatePattern(12000, 140, [2, 3, [0, 800], 1, 3, 2, 1, 0, [2, 1000], 1, 3, 0]),
    ...generatePattern(18000, 140, [0, 2, 1, [3, 800], 0, 2, 3, 1, 0, 2, [1, 900], 3]),
    ...generatePattern(24000, 130, [3, [2, 800], 1, 0, 1, 2, 3, 0, 2, 1]),
    ...generatePattern(29000, 120, [0, 1, 2, 3, [0, 1000], 2, 1, 3]),
];

const song2Hard = [
    ...generatePattern(500, 150, [0, 1, [2, 700], 3, 2, 1, 0, 3, 1, 2, [0, 600], 3]),
    ...generatePattern(5500, 170, [1, 0, 3, [2, 800], 0, 3, 1, 2, 3, 0, 1, 2, [3, 700], 0]),
    ...generatePattern(10500, 180, [2, 3, [0, 700], 1, 3, 2, 1, 0, [2, 900], 1, 3, 0, 2, 1]),
    ...generatePattern(15500, 190, [0, 2, 1, [3, 600], 0, 2, 3, 1, 0, 2, [1, 800], 3, 0, 2, 1, 3]),
    ...generatePattern(20800, 180, [3, [2, 700], 1, 0, 1, 2, 3, 0, [2, 600], 1, 3, 0, 2, 1]),
    ...generatePattern(25500, 170, [0, 1, [2, 800], 3, 0, 1, 2, 3, [1, 700], 0, 2, 3]),
    ...generatePattern(30000, 160, [0, 1, 2, 3, [0, 1000], 2, 1, 3, 0, 2]),
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
    ...generatePattern(1500, 95, [0, 2, [1, 1000], 3, 0, 2, 1, 3, 0, 2]),
    ...generatePattern(8000, 100, [1, 3, [0, 900], 2, 1, 3, 2, 0, [1, 1000], 3, 0, 2]),
    ...generatePattern(15500, 105, [2, 0, 3, [1, 800], 2, 0, 3, 1, 0, [2, 900], 3, 1]),
    ...generatePattern(23000, 100, [3, [1, 1000], 0, 2, 3, 1, 2, 0, [3, 800], 1, 0, 2]),
    ...generatePattern(30000, 95, [0, 1, [2, 1000], 3, 0, 1, 2, 3, [0, 900], 1]),
];

const song3Hard = [
    ...generatePattern(1000, 120, [0, 2, [1, 800], 3, 0, 2, 1, 3, [0, 700], 2, 1, 3]),
    ...generatePattern(7500, 130, [1, 3, [0, 800], 2, 1, 3, 2, 0, [1, 900], 3, 0, 2, 1, 3]),
    ...generatePattern(14000, 140, [2, 0, 3, [1, 700], 2, 0, 3, 1, 0, [2, 800], 3, 1, 0, 2]),
    ...generatePattern(20500, 140, [3, [1, 900], 0, 2, 3, 1, 2, 0, [3, 700], 1, 0, 2, 3, 1]),
    ...generatePattern(27000, 130, [0, 1, [2, 800], 3, 0, 1, 2, 3, [0, 900], 1, 2, 3, 0, 1]),
    ...generatePattern(33000, 120, [2, 3, [0, 1000], 1, 2, 3, 0, 1]),
];

export const BEATMAPS = {
    song1: { easy: song1Easy, medium: song1Medium, hard: song1Hard },
    song2: { easy: song2Easy, medium: song2Medium, hard: song2Hard },
    song3: { easy: song3Easy, medium: song3Medium, hard: song3Hard },
};
