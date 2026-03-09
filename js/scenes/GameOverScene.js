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
        this.add.text(GAME_WIDTH / 2, 80, isWin ? 'SONG COMPLETE!' : 'GAME OVER', {
            fontSize: '36px', fill: titleColor, fontStyle: 'bold',
        }).setOrigin(0.5);

        if (!isWin) {
            this.add.text(GAME_WIDTH / 2, 115, this.reason, {
                fontSize: '16px', fill: '#aaa',
            }).setOrigin(0.5);
        }

        // Song info
        const song = SONGS.find(s => s.id === this.songId);
        this.add.text(GAME_WIDTH / 2, 145, `${song.title} - ${DIFFICULTY[this.difficulty].label}`, {
            fontSize: '14px', fill: '#888',
        }).setOrigin(0.5);

        // Score
        this.add.text(GAME_WIDTH / 2, 195, String(this.finalScore), {
            fontSize: '64px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 235, 'SCORE', {
            fontSize: '14px', fill: '#666',
        }).setOrigin(0.5);

        // Max combo
        this.add.text(GAME_WIDTH / 2, 268, `Max Combo: ${this.maxCombo}`, {
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

        // Online rank
        this.createOnlineSection();

        // Play again button
        const playAgainBtn = this.add.rectangle(GAME_WIDTH / 2, 420, 200, 50, 0x00aaff)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 420, 'PLAY AGAIN', {
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
        const menuBtn = this.add.rectangle(GAME_WIDTH / 2, 485, 200, 50, 0x444466)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 485, 'MENU', {
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
        if (isLoggedIn()) {
            const rankText = this.add.text(GAME_WIDTH / 2, 335, 'Submitting...', {
                fontSize: '14px', fill: '#ff6600',
            }).setOrigin(0.5);

            submitScore(this.songId, this.difficulty, this.finalScore, this.maxCombo)
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
        } else {
            this.add.text(GAME_WIDTH / 2, 335, 'Login to save scores online', {
                fontSize: '12px', fill: '#555',
            }).setOrigin(0.5);
        }

        // Leaderboard top 5
        this.add.text(GAME_WIDTH / 2, 540, 'LEADERBOARD', {
            fontSize: '11px', fill: '#666', fontStyle: 'bold',
        }).setOrigin(0.5);

        fetchLeaderboard(this.songId, this.difficulty).then(entries => {
            if (!this.scene || !this.scene.isActive) return;
            const me = getUsername();
            entries.slice(0, 5).forEach((entry, i) => {
                const isMe = entry.username === me;
                this.add.text(GAME_WIDTH / 2, 557 + i * 15, `${i + 1}. ${entry.username} — ${entry.score}`, {
                    fontSize: '11px',
                    fill: isMe ? '#ff6600' : '#888',
                    fontStyle: isMe ? 'bold' : 'normal',
                }).setOrigin(0.5);
            });
        }).catch(() => {});
    }
}
