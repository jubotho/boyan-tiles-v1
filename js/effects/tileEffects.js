// ========== Tile Rendering + Per-Frame Tile Effects ==========

import { LANE_WIDTH, GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { LANE_COLORS } from './textures.js';

export function createGradientTile(scene, x, y, width, height, lane) {
    const gfx = scene.add.graphics();
    const colors = LANE_COLORS[lane % 4];
    const left = x - width / 2;
    const top = y - height / 2;
    const r = 8;

    // === OUTER GLOW (wide, faint) ===
    gfx.fillStyle(colors.main, 0.06);
    gfx.fillRoundedRect(left - 6, top - 6, width + 12, height + 12, r + 4);
    gfx.fillStyle(colors.main, 0.1);
    gfx.fillRoundedRect(left - 3, top - 3, width + 6, height + 6, r + 2);

    // === DARK BODY with vertical gradient ===
    const steps = 10;
    const stepH = height / steps;
    for (let i = 0; i < steps; i++) {
        const t = i / steps;
        // Dark base that gets slightly lighter in the middle
        const midBright = 1 - Math.abs(t - 0.4) * 1.5; // peak brightness at 40%
        const r2 = ((colors.dark >> 16) & 0xff) + Math.floor(midBright * 30);
        const g2 = ((colors.dark >> 8) & 0xff) + Math.floor(midBright * 30);
        const b2 = (colors.dark & 0xff) + Math.floor(midBright * 30);
        const bodyColor = (Math.min(r2, 255) << 16) | (Math.min(g2, 255) << 8) | Math.min(b2, 255);

        gfx.fillStyle(bodyColor, 0.95);
        gfx.fillRoundedRect(
            left, top + i * stepH, width, stepH + 1,
            i === 0 ? { tl: r, tr: r, bl: 0, br: 0 } :
            i === steps - 1 ? { tl: 0, tr: 0, bl: r, br: r } : 0
        );
    }

    // === INNER NEON GLOW at edges ===
    // Left edge glow
    for (let g = 0; g < 3; g++) {
        gfx.fillStyle(colors.main, 0.12 - g * 0.03);
        gfx.fillRect(left + g * 3, top + r, 4 - g, height - r * 2);
    }
    // Right edge glow
    for (let g = 0; g < 3; g++) {
        gfx.fillStyle(colors.main, 0.12 - g * 0.03);
        gfx.fillRect(left + width - 4 + g, top + r, 4 - g, height - r * 2);
    }
    // Top edge glow
    for (let g = 0; g < 3; g++) {
        gfx.fillStyle(colors.main, 0.15 - g * 0.04);
        gfx.fillRect(left + r, top + g * 2, width - r * 2, 3 - g);
    }
    // Bottom edge glow
    for (let g = 0; g < 2; g++) {
        gfx.fillStyle(colors.glow, 0.08 - g * 0.03);
        gfx.fillRect(left + r, top + height - 3 + g, width - r * 2, 3 - g);
    }

    // === BRIGHT NEON BORDER ===
    gfx.lineStyle(2.5, colors.main, 0.7);
    gfx.strokeRoundedRect(left, top, width, height, r);

    // === INNER BORDER (subtle) ===
    gfx.lineStyle(1, colors.glow, 0.25);
    gfx.strokeRoundedRect(left + 3, top + 3, width - 6, height - 6, r - 2);

    // === TOP SHINE STREAK ===
    gfx.fillStyle(0xffffff, 0.25);
    gfx.fillRoundedRect(left + 8, top + 4, width - 16, 3, 2);
    gfx.fillStyle(colors.main, 0.2);
    gfx.fillRoundedRect(left + 12, top + 8, width - 24, 2, 1);

    // === CENTER HORIZONTAL NEON LINE ===
    const cy = top + height * 0.4;
    gfx.fillStyle(colors.main, 0.12);
    gfx.fillRect(left + 6, cy - 1, width - 12, 2);
    gfx.fillStyle(colors.glow, 0.06);
    gfx.fillRect(left + 6, cy - 4, width - 12, 8);

    // === BOTTOM FIRE GLOW ===
    gfx.fillStyle(0xff4400, 0.08);
    gfx.fillRoundedRect(left + 4, top + height - 20, width - 8, 18, { tl: 0, tr: 0, bl: r - 2, br: r - 2 });
    gfx.fillStyle(0xff6600, 0.05);
    gfx.fillRoundedRect(left + 8, top + height - 12, width - 16, 10, { tl: 0, tr: 0, bl: r - 4, br: r - 4 });

    // === CORNER ACCENTS (small bright dots) ===
    const cornerSize = 3;
    gfx.fillStyle(colors.main, 0.6);
    gfx.fillCircle(left + r, top + r, cornerSize);
    gfx.fillCircle(left + width - r, top + r, cornerSize);
    gfx.fillCircle(left + r, top + height - r, cornerSize);
    gfx.fillCircle(left + width - r, top + height - r, cornerSize);

    // === Animated neon pulse on border ===
    const pulseRect = scene.add.rectangle(x, y, width + 2, height + 2, colors.main, 0)
        .setDepth(5).setStrokeStyle(2, colors.main, 0.4);

    scene.tweens.add({
        targets: pulseRect,
        alpha: 0,
        duration: 800 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });

    // Store pulse rect for cleanup
    gfx.setData('pulseRect', pulseRect);

    // Override destroy to clean up pulse
    const origDestroy = gfx.destroy.bind(gfx);
    gfx.destroy = function () {
        if (pulseRect && !pulseRect.destroyed) pulseRect.destroy();
        origDestroy();
    };

    return gfx;
}

export function createFireTrail(scene, x, y, combo) {
    const intensity = Math.min(combo / 15, 1);
    if (Math.random() > 0.3 + intensity * 0.4) return;

    const tex = Math.random() > 0.5 ? 'sparkParticle' : 'fireParticle';
    const trail = scene.add.image(
        x + (Math.random() - 0.5) * 20,
        y - 10,
        tex
    ).setScale(0.15 + Math.random() * 0.25 + intensity * 0.2)
     .setDepth(4)
     .setBlendMode(Phaser.BlendModes.ADD)
     .setAlpha(0.4 + intensity * 0.4);

    scene.tweens.add({
        targets: trail,
        y: trail.y + 15 + Math.random() * 20,
        alpha: 0,
        scaleX: 0.05,
        scaleY: 0.05,
        duration: 200 + Math.random() * 150,
        onComplete: () => trail.destroy(),
    });
}

export function updateComboBorderGlow(scene, combo) {
    if (combo < 3) return;

    // Create pulsing border glow that intensifies with combo
    const intensity = Math.min((combo - 3) / 25, 1);
    const alpha = 0.05 + intensity * 0.15;

    // Choose color based on combo level
    let color;
    if (combo >= 50) color = 0xff00ff; // purple/pink for godlike
    else if (combo >= 25) color = 0x00ffff; // cyan for unstoppable
    else if (combo >= 10) color = 0xff6600; // orange for on fire
    else color = 0xff4400; // red for starting

    // Left and right border glows
    if (Math.random() < 0.1 + intensity * 0.2) {
        const side = Math.random() > 0.5 ? 0 : GAME_WIDTH;
        const gy = Math.random() * GAME_HEIGHT;
        const glow = scene.add.circle(side, gy, 15 + Math.random() * 20, color, alpha)
            .setDepth(2).setBlendMode(Phaser.BlendModes.ADD);
        scene.tweens.add({
            targets: glow,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 400 + Math.random() * 300,
            onComplete: () => glow.destroy(),
        });
    }
}

export function updateComboFireAura(scene, tileObj, combo) {
    if (combo < 5) return;

    const intensity = Math.min((combo - 5) / 20, 1);
    const tile = tileObj.getData('tileData');
    if (!tile) return;
    const tx = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;

    // Spawn occasional ember from tile
    if (Math.random() < 0.2 * intensity) {
        const textures = ['sparkParticle', 'fireParticle', 'neonParticle'];
        const tex = textures[Math.floor(Math.random() * textures.length)];
        const ember = scene.add.image(
            tx + (Math.random() - 0.5) * LANE_WIDTH,
            tileObj.y + (Math.random() - 0.5) * 20,
            tex
        ).setScale(0.3 + Math.random() * 0.5)
         .setDepth(6)
         .setBlendMode(Phaser.BlendModes.ADD)
         .setAlpha(0.6 + intensity * 0.4);

        scene.tweens.add({
            targets: ember,
            y: ember.y - 25 - Math.random() * 25,
            alpha: 0,
            duration: 300 + Math.random() * 200,
            onComplete: () => ember.destroy(),
        });
    }
}
