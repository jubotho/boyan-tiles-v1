let audioCtx;
let currentBgm = null;
let sfxLoaded = false;
let phaserSound = null; // Phaser sound manager reference

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Store Phaser sound manager reference
export function setSoundManager(soundManager) {
    phaserSound = soundManager;
    sfxLoaded = true;
}

// Play a random sound from a set of keys
function playRandom(keys, volume = 0.5) {
    if (!phaserSound || !sfxLoaded) return false;
    const key = keys[Math.floor(Math.random() * keys.length)];
    try {
        phaserSound.play(key, { volume });
        return true;
    } catch (e) {
        return false;
    }
}

// Procedural fallback
function playTone(freq, duration, type = 'sine', volume = 0.3) {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
}

export function playHit() {
    if (!playRandom(['hit1', 'hit2', 'hit3'], 0.5)) {
        playTone(880, 0.15, 'sine', 0.4);
    }
}

export function playHitPerfect() {
    if (!playRandom(['hit_perfect1', 'hit_perfect2', 'hit_perfect3'], 0.6)) {
        playTone(880, 0.15, 'sine', 0.4);
        setTimeout(() => playTone(1320, 0.1, 'sine', 0.3), 50);
    }
}

export function playMiss() {
    if (!playRandom(['miss1', 'miss2', 'miss3'], 0.5)) {
        playTone(220, 0.25, 'sawtooth', 0.3);
    }
}

export function playExplosion() {
    if (!playRandom(['explosion1', 'explosion2', 'explosion3'], 0.4)) {
        playTone(80, 0.3, 'sawtooth', 0.2);
    }
}

export function playCombo(level) {
    // level 1-4 maps to combo1-combo4
    const idx = Math.min(level, 4);
    if (!playRandom([`combo${idx}`], 0.6)) {
        playTone(440 + level * 220, 0.2, 'sine', 0.3);
    }
}

export function playImpact() {
    if (!playRandom(['impact1', 'impact2'], 0.5)) {
        playTone(100, 0.15, 'square', 0.2);
    }
}

export function playFanfare() {
    if (!playRandom(['fanfare1', 'fanfare2'], 0.6)) {
        playTone(440, 0.1, 'sine', 0.3);
        setTimeout(() => playTone(660, 0.1, 'sine', 0.3), 100);
        setTimeout(() => playTone(880, 0.15, 'sine', 0.3), 200);
    }
}

export function playMenuClick() {
    if (!playRandom(['menu_click'], 0.4)) {
        playTone(660, 0.08, 'sine', 0.2);
    }
}

export function playMenuStart() {
    if (!playRandom(['menu_start'], 0.5)) {
        playTone(440, 0.1, 'sine', 0.3);
        setTimeout(() => playTone(660, 0.1, 'sine', 0.3), 100);
        setTimeout(() => playTone(880, 0.15, 'sine', 0.3), 200);
    }
}

export function playSiren() {
    if (playRandom(['siren'], 0.4)) return;
    // Procedural fallback
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.45);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
}

export function initAudio() {
    getContext();
}

// ========== Audio Preloader for Phaser ==========

const SFX_FILES = [
    'hit1', 'hit2', 'hit3',
    'hit_perfect1', 'hit_perfect2', 'hit_perfect3',
    'miss1', 'miss2', 'miss3',
    'combo1', 'combo2', 'combo3', 'combo4',
    'explosion1', 'explosion2', 'explosion3',
    'impact1', 'impact2',
    'menu_click', 'menu_move', 'menu_start',
    'fanfare1', 'fanfare2',
    'siren',
];

export function preloadSFX(scene) {
    SFX_FILES.forEach(name => {
        scene.load.audio(name, `audio/sfx/${name}.wav`);
    });
}

// ========== BGM System (file-based with procedural fallback) ==========

class FileBGM {
    constructor(songId) {
        this.songId = songId;
        this.key = `music_${songId}`;
        this.sound = null;
    }

    play() {
        if (!phaserSound) return;
        try {
            this.sound = phaserSound.add(this.key, { loop: true, volume: 0.5 });
            this.sound.play();
        } catch (e) {
            // Silent fail — no music but game still works
        }
    }

    stop() {
        if (this.sound) {
            this.sound.stop();
            this.sound.destroy();
            this.sound = null;
        }
    }
}

export function createBGM(songId) {
    return new FileBGM(songId);
}

export function stopCurrentBGM() {
    if (currentBgm) {
        currentBgm.stop();
        currentBgm = null;
    }
}
