import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
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
