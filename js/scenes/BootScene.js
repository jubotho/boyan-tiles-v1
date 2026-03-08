import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        // No assets to preload — all audio is procedural
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xf8f8ff);
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Boyan THEGAMER', {
            fontSize: '28px', fill: '#00aaff', fontStyle: 'bold',
        }).setOrigin(0.5);

        this.time.delayedCall(600, () => {
            this.scene.start('MenuScene');
        });
    }
}
