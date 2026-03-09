import { GAME_WIDTH, GAME_HEIGHT, DIFFICULTY, SONGS } from '../constants.js';
import { getHighScore } from '../highscore.js';
import { playMenuClick, playFanfare, playAnnouncerNewRecord } from '../audio.js';
import { isLoggedIn, getUsername, submitScore, fetchLeaderboard } from '../auth.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score;
        this.maxCombo = data.maxCombo;
        this.level = data.level || 1;
        this.songId = data.songId;
        this.difficulty = data.difficulty;
        this.reason = data.reason;
        this.isNewRecord = data.isNewRecord;
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
        this.add.text(GAME_WIDTH / 2, 180, String(this.finalScore), {
            fontSize: '64px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 220, 'SCORE', {
            fontSize: '14px', fill: '#666',
        }).setOrigin(0.5);

        // Level + Max combo
        this.add.text(GAME_WIDTH / 2, 250, `Level ${this.level}  |  Max Combo: ${this.maxCombo}`, {
            fontSize: '16px', fill: '#00aaff',
        }).setOrigin(0.5);

        // New record
        if (this.isNewRecord) {
            playFanfare();
            playAnnouncerNewRecord();
            const recordText = this.add.text(GAME_WIDTH / 2, 282, 'NEW HIGH SCORE!', {
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
            this.add.text(GAME_WIDTH / 2, 282, `Best: ${best}`, {
                fontSize: '16px', fill: '#666',
            }).setOrigin(0.5);
        }

        // Online rank + submit
        this.createOnlineSection();

        // Play again button
        const playAgainBtn = this.add.rectangle(GAME_WIDTH / 2, 390, 200, 50, 0x00aaff)
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

        // Menu button
        const menuBtn = this.add.rectangle(GAME_WIDTH / 2, 455, 200, 50, 0x444466)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 455, 'MENU', {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x555577));
        menuBtn.on('pointerout', () => menuBtn.setFillStyle(0x444466));
        menuBtn.on('pointerdown', () => {
            playMenuClick();
            this.scene.start('MenuScene');
        });
    }

    createOnlineSection() {
        const rankText = this.add.text(GAME_WIDTH / 2, 315, 'Submitting...', {
            fontSize: '14px', fill: '#ff6600',
        }).setOrigin(0.5);

        submitScore(this.songId, this.difficulty, this.finalScore, this.maxCombo, this.level)
            .then(result => {
                if (!this.scene || !this.scene.isActive) return;
                if (result) {
                    rankText.setText(`Online Rank: #${result.rank}`);
                } else {
                    rankText.setText('');
                }
            })
            .catch(() => {
                if (this.scene && this.scene.isActive) rankText.setText('');
            });

        // Leaderboard top 5
        this.add.text(GAME_WIDTH / 2, 500, 'LEADERBOARD', {
            fontSize: '11px', fill: '#666', fontStyle: 'bold',
        }).setOrigin(0.5);

        fetchLeaderboard(this.songId, this.difficulty).then(entries => {
            if (!this.scene || !this.scene.isActive) return;
            const me = getUsername();
            entries.slice(0, 5).forEach((entry, i) => {
                const isMe = entry.username === me;
                const lvl = entry.level > 1 ? ` Lv${entry.level}` : '';
                this.add.text(GAME_WIDTH / 2, 517 + i * 16, `${i + 1}. ${entry.username} — ${entry.score}${lvl}`, {
                    fontSize: '12px',
                    fill: isMe ? '#ff6600' : '#888',
                    fontStyle: isMe ? 'bold' : 'normal',
                }).setOrigin(0.5);
            });
        }).catch(() => {});
    }
}
