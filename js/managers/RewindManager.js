// ========== Time Rewind Effect ==========
// State machine: NORMAL → SLOWING → REVERSING → RESUMING → NORMAL
// During SLOWING: tiles + music slow to a stop
// During REVERSING: reversed music plays, tiles spawn from bottom moving up
// During RESUMING: reverse slows, then forward play resumes

import { GAME_WIDTH, GAME_HEIGHT, LANES } from '../constants.js';

const NORMAL = 0, SLOWING = 1, REVERSING = 2, RESUMING = 3;
const SLOW_MS = 1500;
const REV_MIN = 8000, REV_MAX = 15000;
const RESUME_MS = 1500;
const COOLDOWN_MIN = 40000, COOLDOWN_MAX = 60000;
const FIRST_MIN = 25000, FIRST_MAX = 45000;
const SPAWN_INTERVAL = 600;

export const REWIND_SPEED_FACTOR = 0.6;

function easeIn(t) { return t * t * t; }
function easeOut(t) { return 1 - (1 - t) ** 3; }

export class RewindManager {
    constructor(scene) {
        this.scene = scene;
        this.state = NORMAL;
        this.stateStart = 0;
        this.forwardFactor = 1;
        this.reverseFactor = 0;
        this.revDuration = 0;
        this.nextTime = FIRST_MIN + Math.random() * (FIRST_MAX - FIRST_MIN);
        this.savedMusicPos = 0;
        this.didResumeMusic = false;
        this.lastSpawnTime = 0;
        this.lastSpawnLane = -1;
        this.ui = {};
    }

    isActive() { return this.state !== NORMAL; }
    isReversing() { return this.state === REVERSING; }

    update(realElapsed, realDelta) {
        if (this.state === NORMAL) {
            if (realElapsed >= this.nextTime) this._begin(realElapsed);
            return;
        }
        const t = realElapsed - this.stateStart;
        if (this.state === SLOWING) this._slow(t, realElapsed);
        else if (this.state === REVERSING) this._rev(t, realElapsed);
        else if (this.state === RESUMING) this._resume(t, realElapsed);
    }

    _begin(re) {
        this.state = SLOWING;
        this.stateStart = re;
        this.revDuration = REV_MIN + Math.random() * (REV_MAX - REV_MIN);
        this.savedMusicPos = this.scene.bgm.getPosition();
        this._showUI();
    }

    _slow(t, re) {
        const p = Math.min(t / SLOW_MS, 1);
        this.forwardFactor = 1 - easeIn(p);
        this.scene.bgm.setRate(Math.max(0.05, this.forwardFactor));
        if (p >= 1) {
            this.forwardFactor = 0;
            this.scene.bgm.pauseForRewind();
            this.scene.bgm.startReverse(this.savedMusicPos);
            this.state = REVERSING;
            this.stateStart = re;
            this.lastSpawnTime = re;
        }
    }

    _rev(t, re) {
        const ramp = 500;
        this.reverseFactor = t < ramp ? easeOut(t / ramp) : 1;
        this.scene.bgm.setReverseRate(Math.max(0.05, this.reverseFactor));

        if (re - this.lastSpawnTime >= SPAWN_INTERVAL) {
            this._spawnTile();
            this.lastSpawnTime = re;
        }

        if (this.ui.label) this.ui.label.setAlpha(0.6 + 0.4 * Math.sin(t * 0.005));

        if (t >= this.revDuration) {
            this.state = RESUMING;
            this.stateStart = re;
            this.didResumeMusic = false;
        }
    }

    _resume(t, re) {
        const p = Math.min(t / RESUME_MS, 1);
        if (p < 0.5) {
            this.reverseFactor = 1 - easeIn(p * 2);
            this.scene.bgm.setReverseRate(Math.max(0.05, this.reverseFactor));
        } else {
            if (!this.didResumeMusic) {
                this.didResumeMusic = true;
                this.scene.bgm.stopReverse();
                this.scene.bgm.resumeForward();
                this.reverseFactor = 0;
                this._destroyRewindTiles();
            }
            this.forwardFactor = easeOut((p - 0.5) * 2);
            this.scene.bgm.setRate(Math.max(0.05, this.forwardFactor));
        }
        if (p >= 1) {
            this.forwardFactor = 1;
            this.scene.bgm.setRate(1);
            this.state = NORMAL;
            this.nextTime = re + COOLDOWN_MIN + Math.random() * (COOLDOWN_MAX - COOLDOWN_MIN);
            this._hideUI();
        }
    }

    _spawnTile() {
        let lane;
        do { lane = Math.floor(Math.random() * LANES); } while (lane === this.lastSpawnLane);
        this.lastSpawnLane = lane;
        this.scene.spawnRewindTile(lane);
    }

    _destroyRewindTiles() {
        const children = [...this.scene.tiles.getChildren()];
        children.forEach(obj => {
            const td = obj.getData('tileData');
            if (td && td.isRewindTile) obj.destroy();
        });
    }

    _showUI() {
        const s = this.scene;
        this.ui.overlay = s.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT,
            0x6600aa, 0.1
        ).setDepth(45).setBlendMode(Phaser.BlendModes.ADD);

        this.ui.scanlines = s.add.graphics().setDepth(46).setAlpha(0.04);
        for (let y = 0; y < GAME_HEIGHT; y += 4) {
            this.ui.scanlines.fillStyle(0x000000, 1);
            this.ui.scanlines.fillRect(0, y, GAME_WIDTH, 2);
        }

        this.ui.label = s.add.text(GAME_WIDTH / 2, 180, '⏪ REWIND ⏪', {
            fontSize: '28px', fill: '#aa66ff', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(50);
    }

    _hideUI() {
        Object.values(this.ui).forEach(obj => { if (obj) obj.destroy(); });
        this.ui = {};
    }

    cleanup() {
        this._hideUI();
        if (this.state !== NORMAL) this.scene.bgm.stopReverse();
        this._destroyRewindTiles();
    }
}
