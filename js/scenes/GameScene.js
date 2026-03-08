import { LANE_WIDTH, STRIKE_LINE_Y, TILE_HEIGHT, MAX_ERRORS, DIFFICULTY, SONGS, GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { playHit, playMiss, initAudio, createBGM } from '../audio.js';
import { BEATMAPS } from '../beatmaps.js';
import { setHighScore } from '../highscore.js';
import { createGradientTile, createHitParticles, createMissFlash, createRipple, createAnimatedBackground } from '../effects.js';

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
    }

    create() {
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xffffff);
        createAnimatedBackground(this);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Boyan THEGAMER\nrocks!', {
            fontSize: '32px', fill: '#000', fontStyle: 'bold', align: 'center',
        }).setOrigin(0.5).setAlpha(0.03).setDepth(0);

        this.tiles = this.add.group();
        this.beatmap = BEATMAPS[this.songId][this.difficulty];

        const songCfg = SONGS.find(s => s.id === this.songId);
        this.bgm = createBGM(this.songId);

        // UI
        this.scoreText = this.add.text(GAME_WIDTH / 2, 50, '0', {
            fontSize: '64px', fill: '#222', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(10);

        this.comboText = this.add.text(GAME_WIDTH / 2, 105, '', {
            fontSize: '22px', fill: '#00aaff', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(10);

        this.errorText = this.add.text(20, 16, 'LIVES: ' + (MAX_ERRORS - this.errors), {
            fontSize: '14px', fill: '#ff4444', fontStyle: 'bold',
        }).setDepth(10);

        this.add.text(GAME_WIDTH - 20, 16, DIFFICULTY[this.difficulty].label.toUpperCase(), {
            fontSize: '12px', fill: '#888', fontStyle: 'bold',
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

        startBtn.on('pointerdown', () => {
            initAudio();
            this.gameStarted = true;
            this.startTime = this.time.now;
            this.bgm.play();
            startGroup.destroy();
        });

        this.input.on('pointerdown', this.handleDown, this);
    }

    update(time) {
        if (this.isGameOver || !this.gameStarted) return;

        const elapsed = time - this.startTime;

        // Song complete
        if (this.nextNoteIndex >= this.beatmap.length && this.tiles.getChildren().length === 0) {
            this.endGame('SONG COMPLETE!');
            return;
        }

        // Spawn tiles
        if (this.nextNoteIndex < this.beatmap.length) {
            const note = this.beatmap[this.nextNoteIndex];
            const [noteTime] = note;
            const leadTime = (this.strikeLineY / this.scrollSpeed) * 1000;

            if (elapsed >= noteTime - leadTime) {
                const [, lane] = note;
                this.spawnTile(lane, noteTime);
                this.nextNoteIndex++;
            }
        }

        // Move tiles
        this.tiles.getChildren().forEach(tileObj => {
            const tile = tileObj.getData('tileData');
            if (!tile) return;

            const timeDiff = elapsed - tile.targetTime;
            const h = tile.height;
            const newY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed - (h / 2);

            tileObj.y = newY - tile.spawnY + (h / 2);

            // Below the line = lose a life
            if (!tile.isHit) {
                const headY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed;
                if (headY > this.strikeLineY + 40) {
                    tile.isHit = true;
                    this.handleError('MISS!');
                    tileObj.destroy();
                }
            }
        });
    }

    spawnTile(lane, targetTime) {
        const x = lane * LANE_WIDTH + (LANE_WIDTH / 2);
        const h = TILE_HEIGHT;
        const spawnY = -200;

        const gfx = createGradientTile(this, x, spawnY, LANE_WIDTH - 6, h, false);
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

    handleDown(pointer) {
        if (this.isGameOver || !this.gameStarted) return;

        const laneClicked = Math.floor(pointer.x / LANE_WIDTH);
        let hitFound = false;

        createRipple(this, pointer.x, pointer.y);

        const elapsed = this.time.now - this.startTime;

        this.tiles.getChildren().forEach(tileObj => {
            if (hitFound) return;
            const tile = tileObj.getData('tileData');
            if (!tile || tile.lane !== laneClicked || tile.isHit) return;

            const timeDiff = elapsed - tile.targetTime;
            const headY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed;

            // Only tappable if tile is above or on the line (not below)
            if (headY <= this.strikeLineY + 20 && headY > this.strikeLineY - 200) {
                const distAbove = this.strikeLineY - headY; // positive = above line, ~0 = on line
                this.processHit(tileObj, distAbove);
                hitFound = true;
            }
        });

        if (!hitFound) this.handleError('TAP!');
    }

    processHit(tileObj, dist) {
        const tile = tileObj.getData('tileData');
        tile.isHit = true;
        playHit();

        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        // dist = how far above the line (0 = on line, bigger = higher above)
        let rating = 'PERFECT';
        let points = 50;
        let color = 0x00ff88;

        if (dist > 40) { rating = 'GREAT'; points = 30; color = 0x44ccff; }

        this.score += points + this.combo * 2;
        this.scoreText.setText(Math.floor(this.score));
        this.comboText.setText(this.combo > 1 ? this.combo + ' COMBO' : '');
        this.showFeedback(rating, color);

        const tileX = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;
        createHitParticles(this, tileX, this.strikeLineY, color);

        this.tweens.add({
            targets: tileObj,
            alpha: 0,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
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

    endGame(reason) {
        this.isGameOver = true;
        this.bgm.stop();

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
