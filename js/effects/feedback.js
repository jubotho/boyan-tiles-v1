// ========== Miss/Hit Visual Feedback ==========

import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export function createMissFlash(scene) {
    const flash = scene.add.rectangle(
        GAME_WIDTH / 2, GAME_HEIGHT / 2,
        GAME_WIDTH, GAME_HEIGHT,
        0xff0000, 0.25
    ).setDepth(50);
    scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 300,
        onComplete: () => flash.destroy(),
    });
}

export function createRipple(scene, x, y) {
    // Fire ripple
    const ripple = scene.add.circle(x, y, 2, 0xff8800, 0.6).setDepth(15)
        .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
        targets: ripple,
        radius: 50,
        alpha: 0,
        duration: 300,
        onComplete: () => ripple.destroy(),
    });

    // Neon ripple (slightly delayed)
    const neonRipple = scene.add.circle(x, y, 2, 0x00ffff, 0.4).setDepth(15)
        .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
        targets: neonRipple,
        radius: 35,
        alpha: 0,
        duration: 250,
        delay: 50,
        onComplete: () => neonRipple.destroy(),
    });
}
