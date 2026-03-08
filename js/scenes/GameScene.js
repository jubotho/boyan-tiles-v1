import { LANES, LANE_WIDTH, STRIKE_LINE_Y, TILE_HEIGHT, MAX_ERRORS, DIFFICULTY, SONGS, GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { playHit, playMiss, playSiren, initAudio, createBGM } from '../audio.js';
import { BEATMAPS } from '../beatmaps.js';
import { setHighScore } from '../highscore.js';
import {
    createGradientTile, createHitParticles, createFireExplosion, createNeonExplosion,
    createFireTextures, updateComboFireAura, createMissFlash, createRipple,
    createAnimatedBackground, createComboMilestone, spawnRandomDramaticEvent,
    createFireTrail, updateComboBorderGlow, createNeonPulseWave,
} from '../effects.js';

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

        // Random dramatic events (fire columns, lightning, neon pulses)
        if (elapsed >= this.nextDramaticEvent) {
            spawnRandomDramaticEvent(this);
            this.nextDramaticEvent = elapsed + 2500 + Math.random() * 4000;
        }

        // Combo border glow
        updateComboBorderGlow(this, this.combo);

        // Bonus names
        if (elapsed >= this.nextBonusTime) {
            this.spawnBonusName();
            this.nextBonusTime = elapsed + 8000 + Math.random() * 7000; // next one in 8-15s
        }

        // Update bonus names
        this.bonusNames = this.bonusNames.filter(b => {
            if (b.destroyed) return false;
            b.age += 1;
            // Remove after ~4 seconds (240 frames at 60fps)
            if (b.age > 240) {
                b.container.destroy();
                return false;
            }
            return true;
        });

        if (this.isEndless) {
            // Endless mode: generate tiles on the fly, speed up over time
            // Speed increases every 10 seconds
            const level = Math.floor(elapsed / 10000) + 5;
            this.scrollSpeed = 280 + (level - 1) * 40;
            // Interval decreases (faster notes), min 250ms
            this.endlessInterval = Math.max(250, 700 - (level - 1) * 50);
            this.diffLabel.setText('LVL ' + level);

            if (elapsed >= this.endlessNextTime) {
                // Pick a random lane (avoid same lane twice in a row)
                let lane;
                do {
                    lane = Math.floor(Math.random() * 4);
                } while (lane === this.endlessLastLane);
                this.endlessLastLane = lane;

                const leadTime = (this.strikeLineY / this.scrollSpeed) * 1000;
                this.spawnTile(lane, elapsed + leadTime);
                this.endlessNextTime = elapsed + this.endlessInterval;
            }
        } else {
            // Normal mode: song complete check
            if (this.nextNoteIndex >= this.beatmap.length && this.tiles.getChildren().length === 0) {
                this.endGame('SONG COMPLETE!');
                return;
            }

            // Spawn tiles from beatmap
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
        }

        // Move tiles
        this.tiles.getChildren().forEach(tileObj => {
            const tile = tileObj.getData('tileData');
            if (!tile) return;

            const timeDiff = elapsed - tile.targetTime;
            const h = tile.height;
            const newY = this.strikeLineY + (timeDiff / 1000) * this.scrollSpeed - (h / 2);

            tileObj.y = newY - tile.spawnY + (h / 2);

            // Combo fire aura on tiles
            if (!tile.isHit) {
                updateComboFireAura(this, tileObj, this.combo);
                // Fire trail behind falling tiles
                const tx = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;
                createFireTrail(this, tx, tileObj.y + tile.height / 2, this.combo);
            }

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

        const laneClicked = Phaser.Math.Clamp(Math.floor(pointer.x / LANE_WIDTH), 0, LANES - 1);
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
        const isPerfect = rating === 'PERFECT';

        // FIRE + NEON EXPLOSION!
        createFireExplosion(this, tileX, this.strikeLineY, isPerfect);
        createNeonExplosion(this, tileX, this.strikeLineY, isPerfect);
        createHitParticles(this, tileX, this.strikeLineY, color);

        // Combo milestone celebrations
        if ([10, 25, 50, 100].includes(this.combo)) {
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

    spawnBonusName() {
        const names = ['Светльо', 'Боян', 'Пешко', 'Цвети', 'Дари'];
        const name = names[Math.floor(Math.random() * names.length)];
        const colors = [0xff0000, 0xff6600, 0xffcc00, 0x00ff66, 0xff00ff, 0x00ccff];

        // Siren when bonus appears!
        playSiren();

        const x = 60 + Math.random() * (GAME_WIDTH - 120);
        const y = 80 + Math.random() * (GAME_HEIGHT - 250);

        const container = this.add.container(x, y).setDepth(20);

        // Glowing background circle
        const glow = this.add.circle(0, 0, 45, 0xffff00, 0.2);
        container.add(glow);

        // The name text
        const txt = this.add.text(0, 0, name, {
            fontSize: '28px',
            fill: '#fff',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4,
        }).setOrigin(0.5);
        container.add(txt);

        // Make it interactive
        const hitZone = this.add.circle(0, 0, 50, 0xffffff, 0.001).setInteractive();
        container.add(hitZone);

        // Spinning rotation
        this.tweens.add({
            targets: container,
            angle: { from: -15, to: 15 },
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Bouncing up and down
        this.tweens.add({
            targets: container,
            y: y - 25,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Scale pulse
        this.tweens.add({
            targets: container,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            repeat: -1,
        });

        // Flashing color change
        let colorIdx = 0;
        const flashTimer = this.time.addEvent({
            delay: 120,
            loop: true,
            callback: () => {
                colorIdx = (colorIdx + 1) % colors.length;
                const c = colors[colorIdx];
                txt.setFill('#' + c.toString(16).padStart(6, '0'));
                glow.setFillStyle(c, 0.25);
            },
        });

        const bonusData = {
            container,
            hitZone,
            txt,
            glow,
            flashTimer,
            age: 0,
            spawnTime: this.time.now - this.startTime,
            destroyed: false,
        };

        hitZone.on('pointerdown', (pointer) => {
            if (bonusData.destroyed) return;
            bonusData.destroyed = true;

            // Faster tap = more points (max 200 if tapped in first 0.5s)
            const tapTime = (this.time.now - this.startTime) - bonusData.spawnTime;
            const bonusPoints = Math.max(20, Math.floor(200 - tapTime * 0.05));

            this.score += bonusPoints;
            this.scoreText.setText(Math.floor(this.score));

            // Siren!
            playSiren();

            // Big flashy feedback
            const bonusText = this.add.text(container.x, container.y, `+${bonusPoints}`, {
                fontSize: '40px', fill: '#ffcc00', fontStyle: 'bold',
                stroke: '#ff0000', strokeThickness: 5,
            }).setOrigin(0.5).setDepth(30);

            this.tweens.add({
                targets: bonusText,
                y: bonusText.y - 80,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0,
                duration: 800,
                onComplete: () => bonusText.destroy(),
            });

            // Explosion particles
            for (let i = 0; i < 20; i++) {
                const angle = (Math.PI * 2 * i) / 20;
                const speed = 60 + Math.random() * 80;
                const c = colors[Math.floor(Math.random() * colors.length)];
                const p = this.add.circle(container.x, container.y, 3 + Math.random() * 4, c, 0.9).setDepth(25);
                this.tweens.add({
                    targets: p,
                    x: container.x + Math.cos(angle) * speed,
                    y: container.y + Math.sin(angle) * speed,
                    alpha: 0,
                    duration: 500 + Math.random() * 300,
                    onComplete: () => p.destroy(),
                });
            }

            flashTimer.destroy();
            container.destroy();
        });

        this.bonusNames.push(bonusData);
    }

    endGame(reason) {
        this.isGameOver = true;
        this.bgm.stop();
        this.bonusNames.forEach(b => {
            if (!b.destroyed) { b.flashTimer.destroy(); b.container.destroy(); }
        });

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
