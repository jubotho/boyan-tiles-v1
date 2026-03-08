let audioCtx;
let currentBgm = null;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

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
    playTone(880, 0.15, 'sine', 0.4);
}

export function playMiss() {
    playTone(220, 0.25, 'sawtooth', 0.3);
}

export function playMenuClick() {
    playTone(660, 0.08, 'sine', 0.2);
}

export function playMenuStart() {
    playTone(440, 0.1, 'sine', 0.3);
    setTimeout(() => playTone(660, 0.1, 'sine', 0.3), 100);
    setTimeout(() => playTone(880, 0.15, 'sine', 0.3), 200);
}

export function initAudio() {
    getContext();
}

// ========== Procedural BGM System ==========

// Note frequencies (octave 4 and 5)
const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
};

// Song definitions with melody patterns, bass patterns, and settings
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

        // Play one melody note per beat, one bass note every 4 beats
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

        // Start immediately
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
