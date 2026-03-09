import { GAME_WIDTH, GAME_HEIGHT, SONGS, DIFFICULTY } from '../constants.js';
import { getLeaderboard } from '../supabase.js';
import { playMenuClick } from '../audio.js';

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super('LeaderboardScene');
    }

    init(data) {
        this.songId = data?.songId || null;
        this.difficulty = data?.difficulty || null;
        this.fromScene = data?.fromScene || 'MenuScene';
    }

    async create() {
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a12);

        // Title
        this.add.text(GAME_WIDTH / 2, 30, 'LEADERBOARD', {
            fontSize: '28px', fill: '#ff6600', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Filter tabs
        this.createFilterTabs();

        // Loading
        this.listContainer = this.add.container(0, 0);
        await this.loadScores();

        // Back button
        const backBtn = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 45, 200, 46, 0x444466)
            .setInteractive({ useHandCursor: true });
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 45, 'BACK', {
            fontSize: '20px', fill: '#fff', fontStyle: 'bold',
        }).setOrigin(0.5);
        backBtn.on('pointerover', () => backBtn.setFillStyle(0x555577));
        backBtn.on('pointerout', () => backBtn.setFillStyle(0x444466));
        backBtn.on('pointerdown', () => {
            playMenuClick();
            this.scene.start(this.fromScene);
        });
    }

    createFilterTabs() {
        const tabY = 60;
        const tabs = [
            { label: 'ALL', songId: null, difficulty: null },
            { label: 'THIS SONG', songId: this.songId, difficulty: null },
            { label: 'SONG+DIFF', songId: this.songId, difficulty: this.difficulty },
        ];

        // Only show song-specific tabs if a song is selected
        const activeTabs = this.songId ? tabs : [tabs[0]];

        activeTabs.forEach((tab, i) => {
            const x = GAME_WIDTH / 2 + (i - (activeTabs.length - 1) / 2) * 110;
            const isActive = tab.songId === this.songId && tab.difficulty === this.difficulty;

            const bg = this.add.rectangle(x, tabY, 100, 26, isActive ? 0xff6600 : 0x1a1a2e)
                .setStrokeStyle(1, isActive ? 0xff6600 : 0x333355)
                .setInteractive({ useHandCursor: true });

            this.add.text(x, tabY, tab.label, {
                fontSize: '9px', fill: isActive ? '#fff' : '#888', fontStyle: 'bold',
            }).setOrigin(0.5);

            bg.on('pointerdown', () => {
                playMenuClick();
                this.scene.restart({
                    songId: tab.songId,
                    difficulty: tab.difficulty,
                    fromScene: this.fromScene,
                });
            });
        });

        // Show filter description
        let filterDesc = 'Top scores — all songs';
        if (this.songId) {
            const song = SONGS.find(s => s.id === this.songId);
            filterDesc = song ? song.title : this.songId;
            if (this.difficulty) {
                filterDesc += ' — ' + DIFFICULTY[this.difficulty].label;
            }
        }
        this.add.text(GAME_WIDTH / 2, tabY + 22, filterDesc, {
            fontSize: '10px', fill: '#555',
        }).setOrigin(0.5);
    }

    async loadScores() {
        this.listContainer.removeAll(true);

        const loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Loading...', {
            fontSize: '18px', fill: '#666',
        }).setOrigin(0.5);
        this.listContainer.add(loadingText);

        const scores = await getLeaderboard({
            songId: this.songId,
            difficulty: this.difficulty,
            limit: 15,
        });

        this.listContainer.removeAll(true);

        if (scores.length === 0) {
            const empty = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'No scores yet!\nBe the first!', {
                fontSize: '18px', fill: '#666', align: 'center',
            }).setOrigin(0.5);
            this.listContainer.add(empty);
            return;
        }

        // Table header
        const headerY = 100;
        const hStyle = { fontSize: '10px', fill: '#555', fontStyle: 'bold' };
        this.listContainer.add([
            this.add.text(15, headerY, '#', hStyle),
            this.add.text(35, headerY, 'PLAYER', hStyle),
            this.add.text(180, headerY, 'SCORE', hStyle),
            this.add.text(245, headerY, 'COMBO', hStyle),
            this.add.text(300, headerY, 'LVL', hStyle),
        ]);

        // Score rows
        const medalColors = ['#ffaa00', '#cccccc', '#cc8844'];
        scores.forEach((entry, i) => {
            const y = 120 + i * 30;
            const color = medalColors[i] || '#777';
            const bold = i < 3 ? 'bold' : '';

            this.listContainer.add([
                this.add.text(15, y, `${i + 1}`, { fontSize: '13px', fill: color, fontStyle: bold }),
                this.add.text(35, y, (entry.username || 'Player').slice(0, 12), { fontSize: '13px', fill: color, fontStyle: bold }),
                this.add.text(180, y, String(entry.score), { fontSize: '13px', fill: color, fontStyle: 'bold' }),
                this.add.text(245, y, String(entry.max_combo || 0), { fontSize: '12px', fill: '#555' }),
                this.add.text(300, y, String(entry.level || 1), { fontSize: '12px', fill: '#555' }),
            ]);
        });
    }
}
