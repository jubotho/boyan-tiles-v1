import { GAME_WIDTH, GAME_HEIGHT, DIFFICULTY, SONGS } from '../constants.js';
import { getHighScore } from '../highscore.js';
import { playMenuClick, playFanfare, playAnnouncerNewRecord } from '../audio.js';
import { submitScore, getPlayerRank, isOnline } from '../supabase.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score;
        this.maxCombo = data.maxCombo;
        this.songId = data.songId;
        this.difficulty = data.difficulty;
        this.reason = data.reason;
        this.isNewRecord = data.isNewRecord;
        this.level = data.level || 1;
    }

    create() {
        // Background
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x111122);

        // Title
        const isWin = this.reason === 'SONG COMPLETE!';
        const titleColor = isWin ? '#00ff88' : '#ff4444';
        this.add.text(GAME_WIDTH / 2, 70, isWin ? 'SONG COMPLETE!' : 'GAME OVER', {
            fontSize: '36px', fill: titleColor, fontStyle: 'bold',
        }).setOrigin(0.5);

        if (!isWin) {
            this.add.text(GAME_WIDTH / 2, 105, this.reason, {
                fontSize: '16px', fill: '#aaa',
            }).setOrigin(0.5);
        }

        // Song info
        const song = SONGS.find(s => s.id === this.songId);
        this.add.text(GAME_WIDTH / 2, 135, `${song.title} - ${DIFFICULTY[this.difficulty].label}`, {
            fontSize: '14px', fill: '#888',
        }).setOrigin(0.5);

        // Score
        this.add.text(GAME_WIDTH / 2, 190, String(this.finalScore), {
            fontSize: '64px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 230, 'SCORE', {
            fontSize: '14px', fill: '#666',
        }).setOrigin(0.5);

        // Max combo
        this.add.text(GAME_WIDTH / 2, 265, `Max Combo: ${this.maxCombo}`, {
            fontSize: '18px', fill: '#00aaff',
        }).setOrigin(0.5);

        // New record
        if (this.isNewRecord) {
            playFanfare();
            playAnnouncerNewRecord();
            const recordText = this.add.text(GAME_WIDTH / 2, 300, 'NEW HIGH SCORE!', {
                fontSize: '22px', fill: '#ffaa00', fontStyle: 'bold',
            }).setOrigin(0.5);

            this.tweens.add({
                targets: recordText,
                scale: 1.15,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        } else {
            const best = getHighScore(this.songId, this.difficulty);
            this.add.text(GAME_WIDTH / 2, 300, `Best: ${best}`, {
                fontSize: '16px', fill: '#666',
            }).setOrigin(0.5);
        }

        // Leaderboard rank (async — shows when ready)
        this.rankText = this.add.text(GAME_WIDTH / 2, 330, '', {
            fontSize: '14px', fill: '#ff6600',
        }).setOrigin(0.5);

        // Submit score to leaderboard (fire-and-forget)
        this.submitAndShowRank();

        // Play again button
        const playAgainBtn = this.add.rectangle(GAME_WIDTH / 2, 390, 200, 46, 0x00aaff)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 390, 'PLAY AGAIN', {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        playAgainBtn.on('pointerover', () => playAgainBtn.setFillStyle(0x0088dd));
        playAgainBtn.on('pointerout', () => playAgainBtn.setFillStyle(0x00aaff));
        playAgainBtn.on('pointerdown', () => {
            playMenuClick();
            this.scene.start('GameScene', {
                songId: this.songId,
                difficulty: this.difficulty,
            });
        });

        // Leaderboard button
        const lbBtn = this.add.rectangle(GAME_WIDTH / 2, 445, 200, 46, 0x1a1a2e)
            .setStrokeStyle(2, 0xff6600)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 445, 'LEADERBOARD', {
            fontSize: '16px', fill: '#ff6600', fontStyle: 'bold',
        }).setOrigin(0.5);

        lbBtn.on('pointerover', () => lbBtn.setFillStyle(0x2a1a0a));
        lbBtn.on('pointerout', () => lbBtn.setFillStyle(0x1a1a2e));
        lbBtn.on('pointerdown', () => {
            playMenuClick();
            this.scene.start('LeaderboardScene', {
                songId: this.songId,
                difficulty: this.difficulty,
                fromScene: 'MenuScene',
            });
        });

        // Menu button
        const menuBtn = this.add.rectangle(GAME_WIDTH / 2, 500, 200, 46, 0x444466)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 500, 'MENU', {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x555577));
        menuBtn.on('pointerout', () => menuBtn.setFillStyle(0x444466));
        menuBtn.on('pointerdown', () => {
            playMenuClick();
            this.scene.start('MenuScene');
        });
    }

    async submitAndShowRank() {
        if (!isOnline()) return;
        try {
            await submitScore({
                songId: this.songId,
                difficulty: this.difficulty,
                score: this.finalScore,
                maxCombo: this.maxCombo,
                level: this.level,
            });
            const rank = await getPlayerRank({
                songId: this.songId,
                difficulty: this.difficulty,
                score: this.finalScore,
            });
            if (rank && this.rankText && !this.rankText.destroyed) {
                this.rankText.setText(`Leaderboard rank: #${rank}`);
            }
        } catch (e) {
            // Silently fail — game works without leaderboard
        }
    }
}
