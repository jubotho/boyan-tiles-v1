import { GAME_WIDTH, GAME_HEIGHT, DIFFICULTY, SONGS } from '../constants.js';
import { getHighScore } from '../highscore.js';
import { playMenuClick, playFanfare, playAnnouncerNewRecord } from '../audio.js';

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
        this.add.text(GAME_WIDTH / 2, 100, isWin ? 'SONG COMPLETE!' : 'GAME OVER', {
            fontSize: '36px', fill: titleColor, fontStyle: 'bold',
        }).setOrigin(0.5);

        if (!isWin) {
            this.add.text(GAME_WIDTH / 2, 140, this.reason, {
                fontSize: '16px', fill: '#aaa',
            }).setOrigin(0.5);
        }

        // Song info
        const song = SONGS.find(s => s.id === this.songId);
        this.add.text(GAME_WIDTH / 2, 180, `${song.title} - ${DIFFICULTY[this.difficulty].label}`, {
            fontSize: '14px', fill: '#888',
        }).setOrigin(0.5);

        // Score
        this.add.text(GAME_WIDTH / 2, 240, String(this.finalScore), {
            fontSize: '64px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, 280, 'SCORE', {
            fontSize: '14px', fill: '#666',
        }).setOrigin(0.5);

        // Max combo
        this.add.text(GAME_WIDTH / 2, 320, `Max Combo: ${this.maxCombo}`, {
            fontSize: '18px', fill: '#00aaff',
        }).setOrigin(0.5);

        // New record
        if (this.isNewRecord) {
            playFanfare();
            playAnnouncerNewRecord();
            const recordText = this.add.text(GAME_WIDTH / 2, 360, 'NEW HIGH SCORE!', {
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
            this.add.text(GAME_WIDTH / 2, 360, `Best: ${best}`, {
                fontSize: '16px', fill: '#666',
            }).setOrigin(0.5);
        }

        // Play again button
        const playAgainBtn = this.add.rectangle(GAME_WIDTH / 2, 440, 200, 50, 0x00aaff)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 440, 'PLAY AGAIN', {
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
        const menuBtn = this.add.rectangle(GAME_WIDTH / 2, 510, 200, 50, 0x444466)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, 510, 'MENU', {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x555577));
        menuBtn.on('pointerout', () => menuBtn.setFillStyle(0x444466));
        menuBtn.on('pointerdown', () => {
            playMenuClick();
            this.scene.start('MenuScene');
        });
    }
}
