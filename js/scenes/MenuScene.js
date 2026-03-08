import { GAME_WIDTH, GAME_HEIGHT, SONGS, DIFFICULTY } from '../constants.js';
import { getHighScore } from '../highscore.js';
import { playMenuClick, playMenuStart, initAudio } from '../audio.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.selectedSong = 0;
        this.selectedDifficulty = 'medium';

        // Background
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xf8f8ff);

        // Title
        this.add.text(GAME_WIDTH / 2, 45, 'BOYAN', {
            fontSize: '36px', fill: '#222', fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add.text(GAME_WIDTH / 2, 78, 'THEGAMER', {
            fontSize: '16px', fill: '#00aaff', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Song selection
        this.add.text(GAME_WIDTH / 2, 120, 'SELECT SONG', {
            fontSize: '14px', fill: '#888', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.songCards = [];
        SONGS.forEach((song, i) => {
            const y = 160 + i * 65;
            const card = this.add.container(GAME_WIDTH / 2, y);

            const bg = this.add.rectangle(0, 0, 300, 50, 0xffffff)
                .setStrokeStyle(2, 0xdddddd)
                .setInteractive({ useHandCursor: true });

            const title = this.add.text(-130, -10, song.title, {
                fontSize: '16px', fill: '#222', fontStyle: 'bold',
            });
            const artist = this.add.text(-130, 10, song.artist, {
                fontSize: '12px', fill: '#999',
            });

            card.add([bg, title, artist]);
            card.bg = bg;

            bg.on('pointerdown', () => {
                initAudio();
                playMenuClick();
                this.selectedSong = i;
                this.updateSelection();
            });

            this.songCards.push(card);
        });

        // Difficulty selection
        this.add.text(GAME_WIDTH / 2, 365, 'DIFFICULTY', {
            fontSize: '14px', fill: '#888', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.diffButtons = {};
        const diffs = Object.keys(DIFFICULTY);
        diffs.forEach((diff, i) => {
            const x = 70 + i * 110;
            const y = 405;
            const cfg = DIFFICULTY[diff];

            const bg = this.add.rectangle(x, y, 95, 36, 0xffffff)
                .setStrokeStyle(2, 0xdddddd)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(x, y, cfg.label, {
                fontSize: '14px', fill: '#444', fontStyle: 'bold',
            }).setOrigin(0.5);

            bg.on('pointerdown', () => {
                initAudio();
                playMenuClick();
                this.selectedDifficulty = diff;
                this.updateSelection();
            });

            this.diffButtons[diff] = { bg, label, color: cfg.color };
        });

        // High score display
        this.highScoreText = this.add.text(GAME_WIDTH / 2, 450, '', {
            fontSize: '14px', fill: '#666',
        }).setOrigin(0.5);

        // Play button
        const playBtn = this.add.rectangle(GAME_WIDTH / 2, 520, 200, 55, 0x00aaff)
            .setInteractive({ useHandCursor: true });

        this.add.text(GAME_WIDTH / 2, 520, 'PLAY', {
            fontSize: '24px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Hover effect
        playBtn.on('pointerover', () => playBtn.setFillStyle(0x0088dd));
        playBtn.on('pointerout', () => playBtn.setFillStyle(0x00aaff));

        playBtn.on('pointerdown', () => {
            initAudio();
            playMenuStart();
            const song = SONGS[this.selectedSong];
            this.scene.start('GameScene', {
                songId: song.id,
                difficulty: this.selectedDifficulty,
            });
        });

        // Footer
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, 'Boyan THEGAMER rocks!', {
            fontSize: '10px', fill: '#ccc',
        }).setOrigin(0.5);

        this.updateSelection();
    }

    updateSelection() {
        // Update song cards
        this.songCards.forEach((card, i) => {
            if (i === this.selectedSong) {
                card.bg.setFillStyle(0xe8f4ff);
                card.bg.setStrokeStyle(2, 0x00aaff);
            } else {
                card.bg.setFillStyle(0xffffff);
                card.bg.setStrokeStyle(2, 0xdddddd);
            }
        });

        // Update difficulty buttons
        Object.keys(this.diffButtons).forEach(diff => {
            const btn = this.diffButtons[diff];
            if (diff === this.selectedDifficulty) {
                btn.bg.setFillStyle(btn.color);
                btn.bg.setStrokeStyle(2, btn.color);
                btn.label.setFill('#fff');
            } else {
                btn.bg.setFillStyle(0xffffff);
                btn.bg.setStrokeStyle(2, 0xdddddd);
                btn.label.setFill('#444');
            }
        });

        // Update high score
        const song = SONGS[this.selectedSong];
        const hs = getHighScore(song.id, this.selectedDifficulty);
        this.highScoreText.setText(hs > 0 ? `Best: ${hs}` : 'No high score yet');
    }
}
