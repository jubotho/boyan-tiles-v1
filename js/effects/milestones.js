// ========== Combo Milestone Celebrations ==========

import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export function createComboMilestone(scene, combo) {
    const intensity = combo >= 100 ? 4 : combo >= 50 ? 3 : combo >= 25 ? 2 : 1;
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    // Full screen flash
    const colors = [0xff6600, 0x00ffff, 0xff00ff, 0xffcc00];
    const flashColor = colors[intensity - 1];
    const screenFlash = scene.add.rectangle(cx, cy, GAME_WIDTH, GAME_HEIGHT, flashColor, 0.3)
        .setDepth(40).setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
        targets: screenFlash,
        alpha: 0,
        duration: 600,
        onComplete: () => screenFlash.destroy(),
    });

    // Multiple expanding rings
    for (let r = 0; r < intensity + 1; r++) {
        const ring = scene.add.image(cx, scene.strikeLineY, r % 2 === 0 ? 'ringParticle' : 'neonRingParticle')
            .setScale(0.3)
            .setDepth(35)
            .setAlpha(0.9)
            .setBlendMode(Phaser.BlendModes.ADD);
        scene.tweens.add({
            targets: ring,
            scaleX: 5 + r * 1.5,
            scaleY: 5 + r * 1.5,
            alpha: 0,
            duration: 600 + r * 150,
            delay: r * 80,
            ease: 'Power2',
            onComplete: () => ring.destroy(),
        });
    }

    // Massive particle burst from center
    const burstCount = 30 + intensity * 15;
    for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 80 + Math.random() * 200 * intensity;
        const textures = ['fireParticle', 'neonParticle', 'neonPinkParticle', 'sparkParticle'];
        const tex = textures[Math.floor(Math.random() * textures.length)];
        const size = 0.3 + Math.random() * 0.8;

        const p = scene.add.image(cx, scene.strikeLineY, tex)
            .setScale(size)
            .setDepth(36)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: p,
            x: cx + Math.cos(angle) * vel,
            y: scene.strikeLineY + Math.sin(angle) * vel,
            scaleX: 0.05,
            scaleY: 0.05,
            alpha: 0,
            duration: 500 + Math.random() * 500,
            ease: 'Power3',
            onComplete: () => p.destroy(),
        });
    }

    // Combo text announcement
    const labels = { 10: 'ON FIRE!', 25: 'UNSTOPPABLE!', 50: 'GODLIKE!', 100: 'LEGENDARY!' };
    const label = labels[combo] || `${combo} COMBO!`;
    const comboAnnounce = scene.add.text(cx, cy - 40, label, {
        fontSize: intensity >= 3 ? '48px' : '36px',
        fill: '#' + flashColor.toString(16).padStart(6, '0'),
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 6,
    }).setOrigin(0.5).setDepth(45).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: comboAnnounce,
        scaleX: 1.5,
        scaleY: 1.5,
        y: cy - 100,
        alpha: 0,
        duration: 1200,
        ease: 'Power2',
        onComplete: () => comboAnnounce.destroy(),
    });

    // Camera shake scales with intensity
    scene.cameras.main.shake(150 + intensity * 50, 0.005 + intensity * 0.003);
}
