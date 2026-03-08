import { LANE_WIDTH, LANES, GAME_WIDTH, GAME_HEIGHT } from './constants.js';

// ========== Texture Generation ==========

let texturesCreated = false;

export function createFireTextures(scene) {
    if (texturesCreated) return;
    texturesCreated = false; // allow re-creation per scene

    // Fire particle texture — soft glowing circle with orange/yellow
    const fireCanvas = scene.textures.createCanvas('fireParticle', 32, 32);
    const fCtx = fireCanvas.getContext();
    const fireGrad = fCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    fireGrad.addColorStop(0, 'rgba(255, 255, 100, 1)');
    fireGrad.addColorStop(0.3, 'rgba(255, 180, 0, 0.8)');
    fireGrad.addColorStop(0.6, 'rgba(255, 80, 0, 0.4)');
    fireGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
    fCtx.fillStyle = fireGrad;
    fCtx.fillRect(0, 0, 32, 32);
    fireCanvas.refresh();

    // Ember/spark texture — tiny bright dot
    const sparkCanvas = scene.textures.createCanvas('sparkParticle', 8, 8);
    const sCtx = sparkCanvas.getContext();
    const sparkGrad = sCtx.createRadialGradient(4, 4, 0, 4, 4, 4);
    sparkGrad.addColorStop(0, 'rgba(255, 255, 200, 1)');
    sparkGrad.addColorStop(0.5, 'rgba(255, 200, 50, 0.8)');
    sparkGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
    sCtx.fillStyle = sparkGrad;
    sCtx.fillRect(0, 0, 8, 8);
    sparkCanvas.refresh();

    // Smoke texture — soft grey circle
    const smokeCanvas = scene.textures.createCanvas('smokeParticle', 24, 24);
    const smCtx = smokeCanvas.getContext();
    const smokeGrad = smCtx.createRadialGradient(12, 12, 0, 12, 12, 12);
    smokeGrad.addColorStop(0, 'rgba(100, 100, 100, 0.3)');
    smokeGrad.addColorStop(0.5, 'rgba(60, 60, 60, 0.15)');
    smokeGrad.addColorStop(1, 'rgba(30, 30, 30, 0)');
    smCtx.fillStyle = smokeGrad;
    smCtx.fillRect(0, 0, 24, 24);
    smokeCanvas.refresh();

    // Shockwave ring texture
    const ringCanvas = scene.textures.createCanvas('ringParticle', 64, 64);
    const rCtx = ringCanvas.getContext();
    rCtx.strokeStyle = 'rgba(255, 160, 0, 0.6)';
    rCtx.lineWidth = 3;
    rCtx.beginPath();
    rCtx.arc(32, 32, 28, 0, Math.PI * 2);
    rCtx.stroke();
    ringCanvas.refresh();

    texturesCreated = true;
}

// ========== FIRE EXPLOSION on Hit ==========

export function createFireExplosion(scene, x, y, isPerfect) {
    const count = isPerfect ? 28 : 16;
    const speed = isPerfect ? 140 : 90;
    const lifetime = isPerfect ? 600 : 400;

    // Fire particles — fly upward like flames
    for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (isPerfect ? Math.PI * 1.2 : Math.PI * 0.8);
        const vel = speed * (0.5 + Math.random() * 0.8);
        const size = 0.4 + Math.random() * (isPerfect ? 0.8 : 0.5);

        const p = scene.add.image(x, y, 'fireParticle')
            .setScale(size)
            .setDepth(16)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: p,
            x: x + Math.cos(angle) * vel,
            y: y + Math.sin(angle) * vel,
            scaleX: size * 0.1,
            scaleY: size * 0.1,
            alpha: 0,
            duration: lifetime + Math.random() * 200,
            ease: 'Power2',
            onComplete: () => p.destroy(),
        });
    }

    // Sparks — fast tiny bright particles
    const sparkCount = isPerfect ? 20 : 10;
    for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 60 + Math.random() * (isPerfect ? 160 : 100);

        const s = scene.add.image(x, y, 'sparkParticle')
            .setScale(0.5 + Math.random() * 1.0)
            .setDepth(17)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: s,
            x: x + Math.cos(angle) * vel,
            y: y + Math.sin(angle) * vel * 0.7 - 30, // bias upward
            alpha: 0,
            scaleX: 0.1,
            scaleY: 0.1,
            duration: 300 + Math.random() * 300,
            ease: 'Power3',
            onComplete: () => s.destroy(),
        });
    }

    // Smoke — rises slowly after the fire
    if (isPerfect) {
        for (let i = 0; i < 6; i++) {
            const sx = x + (Math.random() - 0.5) * 30;
            const smoke = scene.add.image(sx, y, 'smokeParticle')
                .setScale(0.3)
                .setDepth(14)
                .setAlpha(0.4);

            scene.tweens.add({
                targets: smoke,
                y: y - 60 - Math.random() * 40,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0,
                duration: 800 + Math.random() * 400,
                delay: 100 + Math.random() * 150,
                ease: 'Sine.easeOut',
                onComplete: () => smoke.destroy(),
            });
        }
    }

    // Shockwave ring — expanding ring
    const ring = scene.add.image(x, y, 'ringParticle')
        .setScale(0.2)
        .setDepth(15)
        .setAlpha(isPerfect ? 0.8 : 0.5)
        .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: ring,
        scaleX: isPerfect ? 2.5 : 1.5,
        scaleY: isPerfect ? 2.5 : 1.5,
        alpha: 0,
        duration: isPerfect ? 400 : 300,
        ease: 'Power2',
        onComplete: () => ring.destroy(),
    });

    // Flash at impact point
    const flash = scene.add.circle(x, y, isPerfect ? 30 : 18, 0xffcc00, isPerfect ? 0.7 : 0.4)
        .setDepth(18)
        .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: flash,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 250,
        ease: 'Power2',
        onComplete: () => flash.destroy(),
    });
}

// ========== Combo Fire Aura on Tiles ==========

export function updateComboFireAura(scene, tileObj, combo) {
    if (combo < 5) return;

    // Add flickering fire glow around tiles at high combo
    const intensity = Math.min((combo - 5) / 20, 1); // 0 to 1
    const tile = tileObj.getData('tileData');
    if (!tile) return;
    const tx = tile.lane * LANE_WIDTH + LANE_WIDTH / 2;

    // Spawn occasional ember from tile
    if (Math.random() < 0.15 * intensity) {
        const ember = scene.add.image(
            tx + (Math.random() - 0.5) * LANE_WIDTH,
            tileObj.y + (Math.random() - 0.5) * 20,
            'sparkParticle'
        ).setScale(0.3 + Math.random() * 0.4)
         .setDepth(6)
         .setBlendMode(Phaser.BlendModes.ADD)
         .setAlpha(0.6 + intensity * 0.4);

        scene.tweens.add({
            targets: ember,
            y: ember.y - 20 - Math.random() * 20,
            alpha: 0,
            duration: 300 + Math.random() * 200,
            onComplete: () => ember.destroy(),
        });
    }
}

// ========== Original effects (updated) ==========

export function createGradientTile(scene, x, y, width, height, isLong) {
    const gfx = scene.add.graphics();
    const steps = 8;
    const stepH = height / steps;

    for (let i = 0; i < steps; i++) {
        const v = Math.floor(20 + (i / steps) * 40);
        const color = (v << 16) | (v << 8) | v;
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

    gfx.fillStyle(0xffffff, 0.15);
    gfx.fillRoundedRect(x - width / 2 + 4, y - height / 2 + 2, width - 8, 3, 2);

    return gfx;
}

export function createHitParticles(scene, x, y, color = 0x00ff88) {
    // Kept as a simple fallback, main effect is now createFireExplosion
    const count = 8;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 50 + Math.random() * 40;
        const size = 2 + Math.random() * 2;
        const p = scene.add.circle(x, y, size, color, 0.6).setDepth(15);
        scene.tweens.add({
            targets: p,
            x: x + Math.cos(angle) * speed,
            y: y + Math.sin(angle) * speed,
            alpha: 0,
            scale: 0.2,
            duration: 250 + Math.random() * 100,
            ease: 'Power2',
            onComplete: () => p.destroy(),
        });
    }
}

export function createMissFlash(scene) {
    const flash = scene.add.rectangle(
        GAME_WIDTH / 2, GAME_HEIGHT / 2,
        GAME_WIDTH, GAME_HEIGHT,
        0xff0000, 0.2
    ).setDepth(50);
    scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 250,
        onComplete: () => flash.destroy(),
    });
}

export function createRipple(scene, x, y) {
    const ripple = scene.add.circle(x, y, 2, 0xff8800, 0.5).setDepth(15);
    scene.tweens.add({
        targets: ripple,
        radius: 45,
        alpha: 0,
        duration: 300,
        onComplete: () => ripple.destroy(),
    });
}

export function createAnimatedBackground(scene) {
    const bg = scene.add.graphics().setDepth(0);
    bg.lineStyle(1, 0xe8e8e8);
    for (let i = 1; i < LANES; i++) {
        bg.lineBetween(i * LANE_WIDTH, 0, i * LANE_WIDTH, GAME_HEIGHT);
    }

    // Strike line with fire glow
    const glowLine = scene.add.graphics().setDepth(1);
    glowLine.fillStyle(0xff6600, 0.06);
    glowLine.fillRect(0, scene.strikeLineY - 20, GAME_WIDTH, 40);
    glowLine.fillStyle(0xff3300, 0.04);
    glowLine.fillRect(0, scene.strikeLineY - 10, GAME_WIDTH, 20);
    glowLine.lineStyle(2, 0xff6600, 0.6);
    glowLine.lineBetween(0, scene.strikeLineY, GAME_WIDTH, scene.strikeLineY);

    // Embers floating up from strike line
    for (let i = 0; i < 20; i++) {
        const px = Math.random() * GAME_WIDTH;
        const py = scene.strikeLineY + Math.random() * 20 - 10;
        const dot = scene.add.circle(px, py, 1 + Math.random() * 1.5, 0xff6600, 0.15).setDepth(0);
        scene.tweens.add({
            targets: dot,
            y: py - 60 - Math.random() * 80,
            x: px + (Math.random() - 0.5) * 30,
            alpha: 0,
            duration: 2000 + Math.random() * 3000,
            repeat: -1,
            ease: 'Sine.easeOut',
            onComplete: () => { dot.x = Math.random() * GAME_WIDTH; dot.y = py; dot.alpha = 0.15; },
        });
    }
}
