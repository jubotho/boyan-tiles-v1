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
    if (!playRandom(['hit1', 'hit2', 'hit3'], 0.2)) {
        playTone(880, 0.15, 'sine', 0.15);
    }
}

export function playHitPerfect() {
    if (!playRandom(['hit_perfect1', 'hit_perfect2', 'hit_perfect3'], 0.25)) {
        playTone(880, 0.15, 'sine', 0.15);
        setTimeout(() => playTone(1320, 0.1, 'sine', 0.1), 50);
    }
}

export function playMiss() {
    if (!playRandom(['miss1', 'miss2', 'miss3'], 0.2)) {
        playTone(220, 0.25, 'sawtooth', 0.1);
    }
}

export function playExplosion() {
    if (!playRandom(['explosion1', 'explosion2', 'explosion3'], 0.15)) {
        playTone(80, 0.3, 'sawtooth', 0.08);
    }
}

export function playCombo(level) {
    // level 1-4 maps to combo1-combo4
    const idx = Math.min(level, 4);
    if (!playRandom([`combo${idx}`], 0.25)) {
        playTone(440 + level * 220, 0.2, 'sine', 0.1);
    }
}

export function playImpact() {
    if (!playRandom(['impact1', 'impact2'], 0.2)) {
        playTone(100, 0.15, 'square', 0.08);
    }
}

export function playFanfare() {
    if (!playRandom(['fanfare1', 'fanfare2'], 0.3)) {
        playTone(440, 0.1, 'sine', 0.12);
        setTimeout(() => playTone(660, 0.1, 'sine', 0.12), 100);
        setTimeout(() => playTone(880, 0.15, 'sine', 0.12), 200);
    }
}

export function playMenuClick() {
    if (!playRandom(['menu_click'], 0.2)) {
        playTone(660, 0.08, 'sine', 0.1);
    }
}

export function playMenuStart() {
    if (!playRandom(['menu_start'], 0.25)) {
        playTone(440, 0.1, 'sine', 0.12);
        setTimeout(() => playTone(660, 0.1, 'sine', 0.12), 100);
        setTimeout(() => playTone(880, 0.15, 'sine', 0.12), 200);
    }
}

// ========== ANNOUNCER VOICE LINES ==========

export function playAnnouncerCombo(combo) {
    // Escalating announcer calls at combo milestones
    if (combo >= 100) {
        playRandom(['voice_flawless_victory'], 0.7);
    } else if (combo >= 50) {
        playRandom(['voice_multi_kill', 'voice_kill_it'], 0.7);
    } else if (combo >= 25) {
        playRandom(['voice_combo', 'voice_fight'], 0.6);
    } else if (combo >= 10) {
        playRandom(['voice_combo', 'voice_go'], 0.5);
    }
}

export function playAnnouncerLevelUp() {
    playRandom(['voice_level_up', 'voice_ready', 'voice_prepare_yourself'], 0.6);
}

export function playAnnouncerNewRecord() {
    playRandom(['voice_new_highscore', 'voice_congratulations', 'voice_winner', 'voice_flawless_victory'], 0.7);
}

export function playAnnouncerGameOver() {
    playRandom(['voice_sudden_death', 'voice_you_win'], 0.6);
}

export function playSiren() {
    if (playRandom(['siren'], 0.2)) return;
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
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
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
    // Announcer voice lines (Kenney CC0)
    'voice_combo', 'voice_multi_kill', 'voice_flawless_victory',
    'voice_fight', 'voice_prepare_yourself', 'voice_ready',
    'voice_winner', 'voice_you_win', 'voice_kill_it', 'voice_sudden_death',
    'voice_congratulations', 'voice_level_up', 'voice_new_highscore', 'voice_go',
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
        this.reversedBuffer = null;
        this.reverseSource = null;
        this.reverseGain = null;
        this.audioCtx = null;
    }

    play() {
        if (!phaserSound) return;
        try {
            this.sound = phaserSound.add(this.key, { loop: true, volume: 0.8 });
            this.sound.play();
            this._prepareReversedBuffer();
        } catch (e) {}
    }

    _prepareReversedBuffer() {
        try {
            if (!phaserSound || !phaserSound.context) return;
            this.audioCtx = phaserSound.context;
            const buffer = phaserSound.game.cache.audio.get(this.key);
            if (!buffer) return;
            this.reversedBuffer = this.audioCtx.createBuffer(
                buffer.numberOfChannels, buffer.length, buffer.sampleRate
            );
            for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
                const src = buffer.getChannelData(ch);
                const dst = this.reversedBuffer.getChannelData(ch);
                for (let i = 0; i < src.length; i++) {
                    dst[i] = src[src.length - 1 - i];
                }
            }
        } catch (e) {}
    }

    getPosition() {
        if (this.sound && this.sound.isPlaying) return this.sound.seek;
        return 0;
    }

    setRate(rate) {
        if (this.sound) {
            try { this.sound.setRate(Math.max(0.01, rate)); } catch (e) {}
        }
    }

    pauseForRewind() {
        if (this.sound) {
            try { this.sound.pause(); } catch (e) {}
        }
    }

    startReverse(forwardPosition) {
        if (!this.reversedBuffer || !this.audioCtx) return;
        try {
            const dur = this.reversedBuffer.duration;
            const reversePos = Math.max(0, dur - (forwardPosition % dur));
            this.reverseGain = this.audioCtx.createGain();
            this.reverseGain.gain.value = 0.8;
            this.reverseGain.connect(this.audioCtx.destination);
            this.reverseSource = this.audioCtx.createBufferSource();
            this.reverseSource.buffer = this.reversedBuffer;
            this.reverseSource.connect(this.reverseGain);
            this.reverseSource.start(0, reversePos);
        } catch (e) {}
    }

    setReverseRate(rate) {
        if (this.reverseSource) {
            try { this.reverseSource.playbackRate.value = Math.max(0.01, rate); } catch (e) {}
        }
    }

    stopReverse() {
        try {
            if (this.reverseSource) {
                this.reverseSource.stop();
                this.reverseSource.disconnect();
                this.reverseSource = null;
            }
            if (this.reverseGain) {
                this.reverseGain.disconnect();
                this.reverseGain = null;
            }
        } catch (e) {}
    }

    resumeForward() {
        if (this.sound) {
            try {
                this.sound.resume();
                this.sound.setRate(0.05);
            } catch (e) {}
        }
    }

    stop() {
        this.stopReverse();
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
