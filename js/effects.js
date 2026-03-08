import { LANE_WIDTH, LANES, GAME_WIDTH, GAME_HEIGHT } from './constants.js';

export function createGradientTile(scene, x, y, width, height, isLong) {
    const gfx = scene.add.graphics();
    const steps = 8;
    const stepH = height / steps;

    for (let i = 0; i < steps; i++) {
        let color;
        if (isLong) {
            // Blue gradient
            const r = 0;
            const g = Math.floor(100 + (i / steps) * 80);
            const b = Math.floor(180 + (i / steps) * 75);
            color = (r << 16) | (g << 8) | b;
        } else {
            // Dark gradient
            const v = Math.floor(20 + (i / steps) * 40);
            color = (v << 16) | (v << 8) | v;
        }
        gfx.fillStyle(color, 1);
        gfx.fillRoundedRect(
            x - width / 2,
            y - height / 2 + i * stepH,
            width,
            stepH + 1,
            i === 0 ? { tl: 6, tr: 6, bl: 0, br: 0 } :
            i === steps - 1 ? { tl: 0, tr: 0, bl: 6, br: 6 } :
            0
        );
    }

    // Add shine line at top
    gfx.fillStyle(0xffffff, 0.15);
    gfx.fillRoundedRect(x - width / 2 + 4, y - height / 2 + 2, width - 8, 3, 2);

    return gfx;
}

export function createHitParticles(scene, x, y, color = 0x00ff88) {
    const particles = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 80 + Math.random() * 60;
        const size = 2 + Math.random() * 3;
        const p = scene.add.circle(x, y, size, color, 0.8).setDepth(15);
        particles.push(p);
        scene.tweens.add({
            targets: p,
            x: x + Math.cos(angle) * speed,
            y: y + Math.sin(angle) * speed,
            alpha: 0,
            scale: 0.2,
            duration: 350 + Math.random() * 150,
            ease: 'Power2',
            onComplete: () => p.destroy(),
        });
    }
}

export function createMissFlash(scene) {
    const flash = scene.add.rectangle(
        GAME_WIDTH / 2, GAME_HEIGHT / 2,
        GAME_WIDTH, GAME_HEIGHT,
        0xff0000, 0.15
    ).setDepth(50);
    scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 200,
        onComplete: () => flash.destroy(),
    });
}

export function createRipple(scene, x, y) {
    const ripple = scene.add.circle(x, y, 2, 0x00aaff, 0.4).setDepth(15);
    scene.tweens.add({
        targets: ripple,
        radius: 40,
        alpha: 0,
        duration: 250,
        onComplete: () => ripple.destroy(),
    });
}

export function createAnimatedBackground(scene) {
    // Grid lines
    const bg = scene.add.graphics().setDepth(0);
    bg.lineStyle(1, 0xe8e8e8);
    for (let i = 1; i < LANES; i++) {
        bg.lineBetween(i * LANE_WIDTH, 0, i * LANE_WIDTH, GAME_HEIGHT);
    }

    // Strike line with glow
    const glowLine = scene.add.graphics().setDepth(1);
    glowLine.fillStyle(0x00aaff, 0.08);
    glowLine.fillRect(0, scene.strikeLineY - 15, GAME_WIDTH, 30);
    glowLine.lineStyle(2, 0x00aaff, 0.5);
    glowLine.lineBetween(0, scene.strikeLineY, GAME_WIDTH, scene.strikeLineY);

    // Floating particles in background
    for (let i = 0; i < 15; i++) {
        const px = Math.random() * GAME_WIDTH;
        const py = Math.random() * GAME_HEIGHT;
        const dot = scene.add.circle(px, py, 1 + Math.random() * 2, 0x00aaff, 0.1).setDepth(0);
        scene.tweens.add({
            targets: dot,
            y: py - 40 - Math.random() * 40,
            alpha: 0,
            duration: 3000 + Math.random() * 3000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
        });
    }
}
