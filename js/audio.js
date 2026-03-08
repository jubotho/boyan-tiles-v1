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

// ========== Procedural BGM System ==========

const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
};

const SONG_DEFS = {
    song1: {
        name: 'Piano Dreams',
        bpm: 110,
        melodyNotes: ['E4', 'G4', 'A4', 'B4', 'C5', 'B4', 'A4', 'G4',
                      'A4', 'B4', 'C5', 'D5', 'E5', 'D5', 'C5', 'B4',
                      'C5', 'A4', 'G4', 'E4', 'D4', 'E4', 'G4', 'A4',
                      'G4', 'E4', 'C4', 'D4', 'E4', 'G4', 'A4', 'G4'],
        bassNotes: ['C3', 'G3', 'A3', 'E3', 'F3', 'C3', 'G3', 'D3'],
        melodyType: 'sine',
        melodyVolume: 0.12,
        bassVolume: 0.08,
        swingFeel: false,
    },
    song2: {
        name: 'Energetic Beat',
        bpm: 140,
        melodyNotes: ['C5', 'E5', 'G5', 'E5', 'C5', 'D5', 'F5', 'D5',
                      'E5', 'G5', 'A5', 'G5', 'E5', 'D5', 'C5', 'D5',
                      'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'D5', 'C5',
                      'B4', 'A4', 'G4', 'A4', 'B4', 'C5', 'E5', 'C5'],
        bassNotes: ['C3', 'C3', 'G3', 'G3', 'A3', 'A3', 'F3', 'G3'],
        melodyType: 'square',
        melodyVolume: 0.08,
        bassVolume: 0.06,
        swingFeel: false,
    },
    song3: {
        name: 'Chill Vibes',
        bpm: 85,
        melodyNotes: ['G4', 'B4', 'D5', 'B4', 'A4', 'G4', 'E4', 'G4',
                      'A4', 'C5', 'E5', 'C5', 'B4', 'A4', 'G4', 'A4',
                      'D4', 'G4', 'B4', 'A4', 'G4', 'E4', 'D4', 'E4',
                      'G4', 'A4', 'B4', 'D5', 'C5', 'B4', 'A4', 'G4'],
        bassNotes: ['G3', 'D3', 'E3', 'C3', 'G3', 'A3', 'D3', 'G3'],
        melodyType: 'triangle',
        melodyVolume: 0.15,
        bassVolume: 0.1,
        swingFeel: true,
    },
};

class ProceduralBGM {
    constructor(songId) {
        this.def = SONG_DEFS[songId];
        this.isPlaying = false;
        this.intervalId = null;
        this.melodyIndex = 0;
        this.bassIndex = 0;
        this.beatCount = 0;
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        const ctx = getContext();
        const beatMs = 60000 / this.def.bpm;

        const tick = () => {
            if (!this.isPlaying) return;

            const def = this.def;

            // Melody note
            const melodyNote = def.melodyNotes[this.melodyIndex % def.melodyNotes.length];
            const freq = NOTES[melodyNote];
            if (freq) {
                const noteDur = (beatMs / 1000) * 0.8;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = def.melodyType;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(def.melodyVolume, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + noteDur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + noteDur);
            }
            this.melodyIndex++;

            // Bass note every 4 beats
            if (this.beatCount % 4 === 0) {
                const bassNote = def.bassNotes[this.bassIndex % def.bassNotes.length];
                const bassFreq = NOTES[bassNote];
                if (bassFreq) {
                    const bassDur = (beatMs * 3.5) / 1000;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = bassFreq;
                    gain.gain.setValueAtTime(def.bassVolume, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + bassDur);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + bassDur);
                }
                this.bassIndex++;
            }

            // Simple percussion on every beat
            const noiseOsc = ctx.createOscillator();
            const noiseGain = ctx.createGain();
            noiseOsc.type = 'triangle';
            noiseOsc.frequency.value = this.beatCount % 4 === 0 ? 80 : 120;
            noiseGain.gain.setValueAtTime(this.beatCount % 4 === 0 ? 0.06 : 0.03, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            noiseOsc.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noiseOsc.start();
            noiseOsc.stop(ctx.currentTime + 0.08);

            this.beatCount++;
        };

        tick();
        this.intervalId = setInterval(tick, 60000 / this.def.bpm);
    }

    stop() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export function createBGM(songId) {
    return new ProceduralBGM(songId);
}

export function stopCurrentBGM() {
    if (currentBgm) {
        currentBgm.stop();
        currentBgm = null;
    }
}
