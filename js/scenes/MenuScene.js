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

        // Title
        this.add.text(GAME_WIDTH / 2, 40, 'BOYAN', {
            fontSize: '36px', fill: '#ff6600', fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add.text(GAME_WIDTH / 2, 72, 'THEGAMER', {
            fontSize: '16px', fill: '#ffaa00', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Song selection
        this.add.text(GAME_WIDTH / 2, 105, 'SELECT SONG', {
            fontSize: '14px', fill: '#666', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.songCards = [];
        SONGS.forEach((song, i) => {
            const y = 135 + i * 45;
            const card = this.add.container(GAME_WIDTH / 2, y);

            const bg = this.add.rectangle(0, 0, 300, 38, 0x1a1a2e)
                .setStrokeStyle(2, 0x333355)
                .setInteractive({ useHandCursor: true });

            const title = this.add.text(-130, -8, song.title, {
                fontSize: '14px', fill: '#ddd', fontStyle: 'bold',
            });
            const artist = this.add.text(-130, 8, song.artist, {
                fontSize: '10px', fill: '#777',
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
        const diffY = 135 + SONGS.length * 45 + 25;
        this.add.text(GAME_WIDTH / 2, diffY, 'DIFFICULTY', {
            fontSize: '14px', fill: '#666', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.diffButtons = {};
        const diffs = Object.keys(DIFFICULTY);
        diffs.forEach((diff, i) => {
            const x = 45 + i * 90;
            const y = diffY + 35;
            const cfg = DIFFICULTY[diff];

            const bg = this.add.rectangle(x, y, 78, 36, 0x1a1a2e)
                .setStrokeStyle(2, 0x333355)
                .setInteractive({ useHandCursor: true });

            const label = this.add.text(x, y, cfg.label, {
                fontSize: '12px', fill: '#999', fontStyle: 'bold',
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
        this.highScoreText = this.add.text(GAME_WIDTH / 2, diffY + 75, '', {
            fontSize: '14px', fill: '#888',
        }).setOrigin(0.5);

        // Play button
        const playBtnY = diffY + 115;
        const playBtn = this.add.rectangle(GAME_WIDTH / 2, playBtnY, 200, 55, 0xff6600)
            .setInteractive({ useHandCursor: true });

        this.add.text(GAME_WIDTH / 2, playBtnY, 'PLAY', {
            fontSize: '24px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);

        playBtn.on('pointerover', () => playBtn.setFillStyle(0xff8800));
        playBtn.on('pointerout', () => playBtn.setFillStyle(0xff6600));

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
            fontSize: '10px', fill: '#444',
        }).setOrigin(0.5);

        this.updateSelection();
    }

    updateSelection() {
        this.songCards.forEach((card, i) => {
            if (i === this.selectedSong) {
                card.bg.setFillStyle(0x2a1a0a);
                card.bg.setStrokeStyle(2, 0xff6600);
            } else {
                card.bg.setFillStyle(0x1a1a2e);
                card.bg.setStrokeStyle(2, 0x333355);
            }
        });

        Object.keys(this.diffButtons).forEach(diff => {
            const btn = this.diffButtons[diff];
            if (diff === this.selectedDifficulty) {
                btn.bg.setFillStyle(btn.color);
                btn.bg.setStrokeStyle(2, btn.color);
                btn.label.setFill('#fff');
            } else {
                btn.bg.setFillStyle(0x1a1a2e);
                btn.bg.setStrokeStyle(2, 0x333355);
                btn.label.setFill('#999');
            }
        });

        const song = SONGS[this.selectedSong];
        const hs = getHighScore(song.id, this.selectedDifficulty);
        this.highScoreText.setText(hs > 0 ? `Best: ${hs}` : 'No high score yet');
    }
}
