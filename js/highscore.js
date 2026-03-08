const PREFIX = 'boyan_tiles_hs_';

function key(songId, difficulty) {
    return `${PREFIX}${songId}_${difficulty}`;
}

export function getHighScore(songId, difficulty) {
    const val = localStorage.getItem(key(songId, difficulty));
    return val ? parseInt(val, 10) : 0;
}

export function setHighScore(songId, difficulty, score) {
    const current = getHighScore(songId, difficulty);
    if (score > current) {
        localStorage.setItem(key(songId, difficulty), String(Math.floor(score)));
        return true; // new record
    }
    return false;
}

export function getAllHighScores() {
    const scores = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(PREFIX)) {
            scores[k.replace(PREFIX, '')] = parseInt(localStorage.getItem(k), 10);
        }
    }
    return scores;
}
