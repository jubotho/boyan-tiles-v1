import { GAME_WIDTH, GAME_HEIGHT, SONGS } from '../constants.js';
import { preloadSFX, setSoundManager } from '../audio.js';
import { initSupabase, ensureAuth } from '../supabase.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Loading bar
        const barW = 200;
        const barH = 16;
        const barX = GAME_WIDTH / 2 - barW / 2;
        const barY = GAME_HEIGHT / 2 + 50;

        const barBg = this.add.rectangle(GAME_WIDTH / 2, barY + barH / 2, barW, barH, 0x222244)
            .setStrokeStyle(1, 0x444466);
        const barFill = this.add.rectangle(barX, barY, 0, barH, 0xff6600).setOrigin(0, 0);

        const loadText = this.add.text(GAME_WIDTH / 2, barY + 30, 'Loading...', {
            fontSize: '12px', fill: '#666',
        }).setOrigin(0.5);

        this.load.on('progress', (val) => {
            barFill.width = barW * val;
        });

        this.load.on('complete', () => {
            loadText.setText('Ready!');
        });

        // Load all SFX files
        preloadSFX(this);

        // Load music tracks
        SONGS.forEach(song => {
            if (song.file) {
                this.load.audio(`music_${song.id}`, `audio/music/${song.file}.mp3`);
            }
        });
    }

    create() {
        // Pass Phaser sound manager to audio module
        setSoundManager(this.sound);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'BOYAN', {
            fontSize: '42px', fill: '#ff6600', fontStyle: 'bold',
        }).setOrigin(0.5);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'THEGAMER', {
            fontSize: '18px', fill: '#ffaa00', fontStyle: 'bold',
        }).setOrigin(0.5);

        // Initialize Supabase (non-blocking — game works without it)
        initSupabase();
        ensureAuth().catch(() => {});

        this.time.delayedCall(600, () => {
            this.scene.start('MenuScene');
        });
    }
}
