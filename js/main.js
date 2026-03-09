import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import LeaderboardScene from './scenes/LeaderboardScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#0a0a12',
    transparent: false,
    resolution: window.devicePixelRatio || 1,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        antialias: true,
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene, LeaderboardScene],
};

new Phaser.Game(config);

// Initialize tsparticles fire background
async function initFireBackground() {
    if (!window.tsParticles) return;
    await window.tsParticles.load({
        id: 'fire-bg',
        options: {
            fullScreen: false,
            background: { color: 'transparent' },
            fpsLimit: 60,
            particles: {
                number: { value: 40, density: { enable: true, area: 400 } },
                color: { value: ['#ff4400', '#ff6600', '#ff8800', '#ffaa00', '#ffcc00'] },
                shape: { type: 'circle' },
                opacity: {
                    value: { min: 0.1, max: 0.5 },
                    animation: { enable: true, speed: 1, minimumValue: 0.05, sync: false },
                },
                size: {
                    value: { min: 1, max: 4 },
                    animation: { enable: true, speed: 3, minimumValue: 0.5, sync: false },
                },
                move: {
                    enable: true,
                    speed: { min: 0.5, max: 2 },
                    direction: 'top',
                    outModes: { default: 'out', bottom: 'out', top: 'out' },
                    random: true,
                    straight: false,
                },
                life: {
                    duration: { sync: false, value: { min: 2, max: 5 } },
                    count: 0,
                },
            },
            emitters: {
                position: { x: 50, y: 100 },
                size: { width: 100, height: 5 },
                rate: { quantity: 2, delay: 0.1 },
                life: { count: 0 },
            },
        },
    });
}
initFireBackground();

