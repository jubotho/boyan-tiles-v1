import { LANES, LANE_WIDTH, STRIKE_LINE_Y, TILE_HEIGHT, MAX_ERRORS, DIFFICULTY, SONGS, GAME_WIDTH, GAME_HEIGHT, HIT_WINDOW_BELOW, AUTO_MISS_THRESHOLD, PERFECT_THRESHOLD } from '../constants.js';
import { playHit, playHitPerfect, playMiss, playExplosion, playCombo, playImpact, initAudio, createBGM, playAnnouncerCombo, playAnnouncerLevelUp } from '../audio.js';
import { BEATMAPS } from '../beatmaps.js';
import { setHighScore } from '../highscore.js';
import {
    createGradientTile, createHitParticles, createFireExplosion, createNeonExplosion,
    createFireTextures, updateComboFireAura, createMissFlash, createRipple,
    createAnimatedBackground, createComboMilestone, spawnRandomDramaticEvent,
    createFireTrail, updateComboBorderGlow, createNeonPulseWave,
    createLavaTileExplosion, createLavaMissExplosion,
} from '../effects/index.js';
import { spawnBonusName, updateBonusNames, cleanupBonusNames } from '../managers/BonusNameManager.js';
import { RewindManager, REWIND_SPEED_FACTOR } from '../managers/RewindManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.songId = data.songId;
        this.difficulty = data.difficulty;
        this.scrollSpeed = DIFFICULTY[this.difficulty].scrollSpeed;
        this.strikeLineY = STRIKE_LINE_Y;

        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.errors = 0;
        this.isGameOver = false;
        this.gameStarted = false;
        this.nextNoteIndex = 0;
        this.startTime = 0;
        this.bonusNames = [];
        this.nextBonusTime = 5000 + Math.random() * 5000;
        this.isEndless = this.difficulty === 'endless';
        this.endlessNextTime = 1500;
        this.endlessInterval = 700; // ms between notes, decreases over time
        this.endlessLastLane = -1;
        this.nextDramaticEvent = 3000 + Math.random() * 4000;
        this.prevCombo = 0;
        this.level = 1;
        this.beatmapTimeOffset = 0;
        this.gameTime = 0;
        this.lastRealTime = 0;
    }

    create() {
        createFireTextures(this);
        createAnimatedBackground(this);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Boyan THEGAMER\nrocks!', {
            fontSize: '32px', fill: '#fff', fontStyle: 'bold', align: 'center',
        }).setOrigin(0.5).setAlpha(0.04).setDepth(0);

        this.tiles = this.add.group();
        this.beatmap = this.isEndless ? [] : BEATMAPS[this.songId][this.difficulty];

        const songCfg = SONGS.find(s => s.id === this.songId);
        this.bgm = createBGM(this.songId);

        // UI
        this.scoreText = this.add.text(GAME_WIDTH / 2, 50, '0', {
            fontSize: '64px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(10);

        this.comboText = this.add.text(GAME_WIDTH / 2, 105, '', {
            fontSize: '22px', fill: '#00aaff', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(10);

        this.errorText = this.add.text(20, 16, 'LIVES: ' + (MAX_ERRORS - this.errors), {
            fontSize: '14px', fill: '#ff4444', fontStyle: 'bold',
        }).setDepth(10);

        this.diffLabel = this.add.text(GAME_WIDTH - 20, 16, DIFFICULTY[this.difficulty].label.toUpperCase(), {
            fontSize: '12px', fill: this.isEndless ? '#aa00ff' : '#888', fontStyle: 'bold',
        }).setOrigin(1, 0).setDepth(10);

        this.feedbackText = this.add.text(GAME_WIDTH / 2, 260, '', {
            fontSize: '32px', fill: '#00aaff', fontStyle: 'bold',
        }).setOrigin(0.5).setAlpha(0).setDepth(10);

        // Start overlay
        const startGroup = this.add.container(0, 0).setDepth(100);
        const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
        const songTitle = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, songCfg.title, {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);
        const startBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'TAP TO START', {
            fontSize: '24px', fill: '#fff', fontStyle: 'bold',
            backgroundColor: '#00aaff', padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startGroup.add([overlay, songTitle, startBtn]);

        this.rewindManager = new RewindManager(this);

        startBtn.on('pointerdown', () => {
            initAudio();
            this.gameStarted = true;
            this.startTime = this.time.now;
            this.lastRealTime = this.time.now;
            this.bgm.play();
            startGroup.destroy();
        });

        this.input.on('pointerdown', this.handleDown, this);
    }

    update(time) {
        if (this.isGameOver || !this.gameStarted) return;

        // Time tracking
        const realElapsed = time - this.startTime;
        const realDelta = time - this.lastRealTime;
        this.lastRealTime = time;

        // Update rewind effect
        this.rewindManager.update(realElapsed, realDelta);
        this.gameTime += realDelta * this.rewindManager.forwardFactor;
        const elapsed = this.gameTime;
        const rewindActive = this.rewindManager.isActive();

        // Random dramatic events (skip during rewind)
        if (!rewindActive && realElapsed >= this.nextDramaticEvent) {
            spawnRandomDramaticEvent(this);
            this.nextDramaticEvent = realElapsed + 2500 + Math.random() * 4000;
        }

        // Combo border glow
        updateComboBorderGlow(this, this.combo);

        // Bonus names (skip spawning during rewind)
        if (!rewindActive && realElapsed >= this.nextBonusTime) {
            spawnBonusName(this);
            this.nextBonusTime = realElapsed + 8000 + Math.random() * 7000;
        }
        updateBonusNames(this);

        if (this.isEndless) {
            const level = Math.floor(realElapsed / 10000) + 5;
            this.scrollSpeed = 180 + (level - 1) * 25;
            this.endlessInterval = Math.max(250, 700 - (level - 1) * 50);
            this.diffLabel.setText('LVL ' + level);

            if (!rewindActive && realElapsed >= this.endlessNextTime) {
                let lane;
                do {
                    lane = Math.floor(Math.random() * 4);
                } while (lane === this.endlessLastLane);
                this.endlessLastLane = lane;

                const leadTime = (this.strikeLineY / this.scrollSpeed) * 1000;
                this.spawnTile(lane, elapsed + leadTime);
                this.endlessNextTime = realElapsed + this.endlessInterval;
            }
        } else {
            if (!rewindActive && this.nextNoteIndex >= this.beatmap.length && this.tiles.getChildren().length === 0) {
                this.levelUp(elapsed);
            }

            if (!rewindActive) {
                const leadTime = (this.strikeLineY / this.scrollSpeed) * 1000;
                while (this.nextNoteIndex < this.beatmap.length) {
                    const note = this.beatmap[this.nextNoteIndex];
                    const [noteTime] = note;
                    const adjustedTime = noteTime + this.beatmapTimeOffset;
                    if (elapsed < adjustedTime - leadTime) break;
                    const [, lane] = note;
                    this.spawnTile(lane, adjustedTime);
                    this.nextNoteIndex++;
                }
            }
        }

        // Move tiles
        this.tiles.getChildren().forEach(tileObj => {
            const tile = tileObj.getData('tileData');
            if (!tile) return;

            if (tile.isRewindTile) {
                // Rewind tile: move upward at 60% scroll speed
                tile.centerY -= this.scrollSpeed * REWIND_SPEED_FACTOR * this.rewindManager.reverseFactor * (realDelta / 1000);
                tileObj.y = tile.centerY - tile.spawnY;

                const pulseRect = tileObj.getData('pulseRect');
                if (pulseRect && !pulseRect.destroyed) {
                    pulseRect.y = tile.centerY;
                }

                if (!tile.isHit) {
                    updateComboFireAura(this, tileObj, this.combo);
                    const tx = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;
                    createFireTrail(this, tx, tile.centerY - tile.height / 2, this.combo);
                }

                // Auto-miss: off top of screen
                if (!tile.isHit && tile.centerY < -tile.height) {
                    tile.isHit = true;
                    this.handleError('MISS!');
                    tileObj.destroy();
                }
            } else {
                // Normal tile: time-based positioning
                const timeDiff = elapsed - tile.targetTime;
                const h = tile.height;
                const newY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed - (h / 2);

                tileObj.y = newY - tile.spawnY + (h / 2);

                const pulseRect = tileObj.getData('pulseRect');
                if (pulseRect && !pulseRect.destroyed) {
                    pulseRect.y = tileObj.y + tile.spawnY;
                }

                if (!tile.isHit) {
                    updateComboFireAura(this, tileObj, this.combo);
                    const tx = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;
                    createFireTrail(this, tx, tileObj.y + tile.height / 2, this.combo);
                }

                if (!tile.isHit) {
                    const headY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed;
                    if (headY > this.strikeLineY + AUTO_MISS_THRESHOLD) {
                        tile.isHit = true;
                        const tx = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;
                        createLavaMissExplosion(this, tx, this.strikeLineY + 30, tile.lane);
                        this.handleError('MISS!');
                        tileObj.destroy();
                    }
                }
            }
        });
    }

    spawnTile(lane, targetTime) {
        const x = lane * LANE_WIDTH + (LANE_WIDTH / 2);
        const h = TILE_HEIGHT;
        const spawnY = -200;

        const gfx = createGradientTile(this, x, spawnY, LANE_WIDTH - 6, h, lane);
        gfx.setDepth(5);

        gfx.setData('tileData', {
            lane,
            targetTime,
            isHit: false,
            height: h,
            spawnY,
        });

        this.tiles.add(gfx);
    }

    spawnRewindTile(lane) {
        const x = lane * LANE_WIDTH + (LANE_WIDTH / 2);
        const h = TILE_HEIGHT;
        const centerY = GAME_HEIGHT + h;

        const gfx = createGradientTile(this, x, centerY, LANE_WIDTH - 6, h, lane);
        gfx.setDepth(5);

        gfx.setData('tileData', {
            lane,
            targetTime: 0,
            isHit: false,
            height: h,
            spawnY: centerY,
            isRewindTile: true,
            centerY: centerY,
        });

        this.tiles.add(gfx);
    }

    handleDown(pointer) {
        if (this.isGameOver || !this.gameStarted) return;

        const laneClicked = Phaser.Math.Clamp(Math.floor(pointer.x / LANE_WIDTH), 0, LANES - 1);
        let hitFound = false;

        createRipple(this, pointer.x, pointer.y);

        const elapsed = this.gameTime;

        this.tiles.getChildren().forEach(tileObj => {
            if (hitFound) return;
            const tile = tileObj.getData('tileData');
            if (!tile || tile.lane !== laneClicked || tile.isHit) return;

            // During REVERSING, skip normal tiles (only rewind tiles tappable)
            if (!tile.isRewindTile && this.rewindManager.isReversing()) return;

            if (tile.isRewindTile) {
                const hitY = tile.centerY;
                if (hitY <= this.strikeLineY + HIT_WINDOW_BELOW && hitY > 0) {
                    const dist = Math.abs(this.strikeLineY - hitY);
                    this.processHit(tileObj, dist);
                    hitFound = true;
                }
            } else {
                const timeDiff = elapsed - tile.targetTime;
                const headY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed;

                if (headY <= this.strikeLineY + HIT_WINDOW_BELOW && headY > 0) {
                    const distAbove = this.strikeLineY - headY;
                    this.processHit(tileObj, distAbove);
                    hitFound = true;
                }
            }
        });

        if (!hitFound) this.handleError('TAP!');
    }

    processHit(tileObj, dist) {
        const tile = tileObj.getData('tileData');
        tile.isHit = true;

        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        // dist = how far above the line (0 = on line, bigger = higher above)
        let rating = 'PERFECT';
        let points = 50;
        let color = 0x00ff88;

        if (dist > PERFECT_THRESHOLD) { rating = 'GREAT'; points = 30; color = 0x44ccff; }

        // Play different sound for PERFECT vs GREAT
        if (rating === 'PERFECT') {
            playHitPerfect();
        } else {
            playHit();
        }

        this.score += points + this.combo * 2;
        this.scoreText.setText(Math.floor(this.score));
        this.comboText.setText(this.combo > 1 ? this.combo + ' COMBO' : '');
        this.showFeedback(rating, color);

        const tileX = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const isPerfect = rating === 'PERFECT';

        // BRUTAL LAVA + COLOR EXPLOSION!
        createLavaTileExplosion(this, tileX, this.strikeLineY, tile.lane, isPerfect);
        createFireExplosion(this, tileX, this.strikeLineY, isPerfect);
        createNeonExplosion(this, tileX, this.strikeLineY, isPerfect);
        createHitParticles(this, tileX, this.strikeLineY, color);

        // Combo milestone celebrations with epic sounds + announcer
        if ([10, 25, 50, 100].includes(this.combo)) {
            const level = this.combo >= 100 ? 4 : this.combo >= 50 ? 3 : this.combo >= 25 ? 2 : 1;
            playCombo(level);
            playExplosion();
            playAnnouncerCombo(this.combo);
            createComboMilestone(this, this.combo);
        }

        // Neon pulse wave every 5 combos
        if (this.combo > 0 && this.combo % 5 === 0 && this.combo < 10) {
            createNeonPulseWave(this, this.strikeLineY);
        }

        // Camera punch on perfect (stronger at higher combo)
        if (isPerfect) {
            const shakeIntensity = 0.003 + Math.min(this.combo / 200, 0.005);
            this.cameras.main.shake(80, shakeIntensity);
        }

        this.tweens.add({
            targets: tileObj,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 150,
            onComplete: () => tileObj.destroy(),
        });
    }

    handleError(reason) {
        this.errors++;
        this.combo = 0;
        this.comboText.setText('');
        this.errorText.setText('LIVES: ' + (MAX_ERRORS - this.errors));
        this.showFeedback(reason, 0xff4444);
        playMiss();
        createMissFlash(this);
        this.cameras.main.shake(100, 0.005);

        if (this.errors >= MAX_ERRORS) this.endGame('OUT OF LIVES');
    }

    showFeedback(text, color) {
        const hex = '#' + color.toString(16).padStart(6, '0');
        this.feedbackText.setText(text).setFill(hex).setAlpha(1).y = 260;
        this.tweens.add({
            targets: this.feedbackText,
            alpha: 0,
            y: 230,
            duration: 500,
        });
    }

    levelUp(elapsed) {
        this.level++;
        // Speed up 15% each level
        this.scrollSpeed = DIFFICULTY[this.difficulty].scrollSpeed * (1 + (this.level - 1) * 0.15);

        // Calculate offset: last note time + 2s gap
        const lastNote = this.beatmap[this.beatmap.length - 1];
        this.beatmapTimeOffset = elapsed + 1500; // 1.5s gap before next loop starts
        this.nextNoteIndex = 0;

        // Update UI
        this.diffLabel.setText('LVL ' + this.level);

        // Show LEVEL COMPLETE announcement
        const cx = GAME_WIDTH / 2;
        const cy = GAME_HEIGHT / 2;

        const lvlText = this.add.text(cx, cy - 30, 'LEVEL COMPLETE!', {
            fontSize: '32px', fill: '#00ff88', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 6,
        }).setOrigin(0.5).setDepth(50);

        const speedText = this.add.text(cx, cy + 15, `SPEED UP! LVL ${this.level}`, {
            fontSize: '22px', fill: '#ffaa00', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(50);

        // Animate out
        this.tweens.add({
            targets: lvlText,
            scaleX: 1.5, scaleY: 1.5, y: cy - 80, alpha: 0,
            duration: 1500, ease: 'Power2',
            onComplete: () => lvlText.destroy(),
        });
        this.tweens.add({
            targets: speedText,
            scaleX: 1.3, scaleY: 1.3, y: cy - 30, alpha: 0,
            duration: 1500, delay: 200, ease: 'Power2',
            onComplete: () => speedText.destroy(),
        });

        // Epic visual celebration
        createComboMilestone(this, this.level * 10);

        // Play fanfare sound + announcer
        playCombo(Math.min(this.level, 4));
        playAnnouncerLevelUp();
    }

    endGame(reason) {
        this.isGameOver = true;
        this.bgm.stop();
        if (this.rewindManager) this.rewindManager.cleanup();
        cleanupBonusNames(this.bonusNames);

        const isNewRecord = setHighScore(this.songId, this.difficulty, this.score);

        this.scene.start('GameOverScene', {
            score: Math.floor(this.score),
            maxCombo: this.maxCombo,
            songId: this.songId,
            difficulty: this.difficulty,
            reason,
            isNewRecord,
        });
    }
}
