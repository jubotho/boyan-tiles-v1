import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { preloadSFX, setSoundManager } from '../audio.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Show loading text
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'Loading sounds...', {
            fontSize: '12px', fill: '#666',
        }).setOrigin(0.5);

        // Load all SFX files
        preloadSFX(this);
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

        this.time.delayedCall(600, () => {
            this.scene.start('MenuScene');
        });
    }
}
