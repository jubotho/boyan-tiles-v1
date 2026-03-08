import { LANE_WIDTH, LANES, GAME_WIDTH, GAME_HEIGHT } from './constants.js';

// ========== Texture Generation ==========

let texturesCreated = false;

export function createFireTextures(scene) {
    if (texturesCreated) return;
    texturesCreated = false;

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

    // === NEON TEXTURES ===

    // Neon particle — cyan/blue glow
    const neonCanvas = scene.textures.createCanvas('neonParticle', 32, 32);
    const nCtx = neonCanvas.getContext();
    const neonGrad = nCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    neonGrad.addColorStop(0, 'rgba(100, 255, 255, 1)');
    neonGrad.addColorStop(0.3, 'rgba(0, 200, 255, 0.8)');
    neonGrad.addColorStop(0.6, 'rgba(0, 100, 255, 0.4)');
    neonGrad.addColorStop(1, 'rgba(0, 50, 200, 0)');
    nCtx.fillStyle = neonGrad;
    nCtx.fillRect(0, 0, 32, 32);
    neonCanvas.refresh();

    // Neon pink/purple particle
    const neonPinkCanvas = scene.textures.createCanvas('neonPinkParticle', 32, 32);
    const npCtx = neonPinkCanvas.getContext();
    const npGrad = npCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    npGrad.addColorStop(0, 'rgba(255, 100, 255, 1)');
    npGrad.addColorStop(0.3, 'rgba(200, 0, 255, 0.8)');
    npGrad.addColorStop(0.6, 'rgba(150, 0, 200, 0.4)');
    npGrad.addColorStop(1, 'rgba(100, 0, 150, 0)');
    npCtx.fillStyle = npGrad;
    npCtx.fillRect(0, 0, 32, 32);
    neonPinkCanvas.refresh();

    // Neon ring texture — cyan
    const neonRingCanvas = scene.textures.createCanvas('neonRingParticle', 64, 64);
    const nrCtx = neonRingCanvas.getContext();
    nrCtx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
    nrCtx.lineWidth = 3;
    nrCtx.beginPath();
    nrCtx.arc(32, 32, 28, 0, Math.PI * 2);
    nrCtx.stroke();
    nrCtx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
    nrCtx.lineWidth = 6;
    nrCtx.beginPath();
    nrCtx.arc(32, 32, 28, 0, Math.PI * 2);
    nrCtx.stroke();
    neonRingCanvas.refresh();

    // Big fire glow texture — for fire columns
    const bigFireCanvas = scene.textures.createCanvas('bigFireParticle', 64, 64);
    const bfCtx = bigFireCanvas.getContext();
    const bfGrad = bfCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    bfGrad.addColorStop(0, 'rgba(255, 255, 150, 1)');
    bfGrad.addColorStop(0.2, 'rgba(255, 200, 0, 0.8)');
    bfGrad.addColorStop(0.5, 'rgba(255, 100, 0, 0.5)');
    bfGrad.addColorStop(0.8, 'rgba(200, 30, 0, 0.2)');
    bfGrad.addColorStop(1, 'rgba(100, 0, 0, 0)');
    bfCtx.fillStyle = bfGrad;
    bfCtx.fillRect(0, 0, 64, 64);
    bigFireCanvas.refresh();

    texturesCreated = true;
}

// ========== FIRE EXPLOSION on Hit ==========

export function createFireExplosion(scene, x, y, isPerfect) {
    const count = isPerfect ? 32 : 18;
    const speed = isPerfect ? 160 : 100;
    const lifetime = isPerfect ? 650 : 420;

    // Fire particles — fly upward like flames
    for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (isPerfect ? Math.PI * 1.4 : Math.PI * 0.9);
        const vel = speed * (0.5 + Math.random() * 0.8);
        const size = 0.5 + Math.random() * (isPerfect ? 1.0 : 0.6);

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
    const sparkCount = isPerfect ? 24 : 12;
    for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 70 + Math.random() * (isPerfect ? 180 : 110);

        const s = scene.add.image(x, y, 'sparkParticle')
            .setScale(0.5 + Math.random() * 1.2)
            .setDepth(17)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: s,
            x: x + Math.cos(angle) * vel,
            y: y + Math.sin(angle) * vel * 0.7 - 30,
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
        for (let i = 0; i < 8; i++) {
            const sx = x + (Math.random() - 0.5) * 40;
            const smoke = scene.add.image(sx, y, 'smokeParticle')
                .setScale(0.3)
                .setDepth(14)
                .setAlpha(0.5);

            scene.tweens.add({
                targets: smoke,
                y: y - 70 - Math.random() * 50,
                scaleX: 1.8,
                scaleY: 1.8,
                alpha: 0,
                duration: 900 + Math.random() * 400,
                delay: 80 + Math.random() * 150,
                ease: 'Sine.easeOut',
                onComplete: () => smoke.destroy(),
            });
        }
    }

    // Shockwave ring — expanding ring
    const ring = scene.add.image(x, y, 'ringParticle')
        .setScale(0.2)
        .setDepth(15)
        .setAlpha(isPerfect ? 0.9 : 0.5)
        .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: ring,
        scaleX: isPerfect ? 3.0 : 1.8,
        scaleY: isPerfect ? 3.0 : 1.8,
        alpha: 0,
        duration: isPerfect ? 450 : 300,
        ease: 'Power2',
        onComplete: () => ring.destroy(),
    });

    // Flash at impact point
    const flash = scene.add.circle(x, y, isPerfect ? 35 : 20, 0xffcc00, isPerfect ? 0.8 : 0.5)
        .setDepth(18)
        .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: flash,
        scaleX: 3.5,
        scaleY: 3.5,
        alpha: 0,
        duration: 280,
        ease: 'Power2',
        onComplete: () => flash.destroy(),
    });
}

// ========== NEON EXPLOSION on Hit ==========

export function createNeonExplosion(scene, x, y, isPerfect) {
    const count = isPerfect ? 20 : 10;
    const textures = ['neonParticle', 'neonPinkParticle'];

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 50 + Math.random() * (isPerfect ? 130 : 80);
        const size = 0.3 + Math.random() * 0.6;
        const tex = textures[Math.floor(Math.random() * textures.length)];

        const p = scene.add.image(x, y, tex)
            .setScale(size)
            .setDepth(16)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: p,
            x: x + Math.cos(angle) * vel,
            y: y + Math.sin(angle) * vel,
            scaleX: size * 0.05,
            scaleY: size * 0.05,
            alpha: 0,
            duration: 400 + Math.random() * 200,
            ease: 'Power2',
            onComplete: () => p.destroy(),
        });
    }

    // Neon ring
    const nRing = scene.add.image(x, y, 'neonRingParticle')
        .setScale(0.15)
        .setDepth(15)
        .setAlpha(0.8)
        .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: nRing,
        scaleX: isPerfect ? 2.5 : 1.5,
        scaleY: isPerfect ? 2.5 : 1.5,
        alpha: 0,
        duration: 350,
        ease: 'Power2',
        onComplete: () => nRing.destroy(),
    });
}

// ========== COMBO MILESTONE EXPLOSION ==========

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

// ========== FIRE COLUMN ==========

export function createFireColumn(scene, x) {
    const baseY = GAME_HEIGHT;
    const count = 25;

    for (let i = 0; i < count; i++) {
        const tex = Math.random() > 0.3 ? 'fireParticle' : 'bigFireParticle';
        const size = 0.4 + Math.random() * 1.0;
        const targetY = -50 + Math.random() * 100;
        const delay = Math.random() * 200;

        const p = scene.add.image(
            x + (Math.random() - 0.5) * 40,
            baseY + Math.random() * 20,
            tex
        ).setScale(size).setDepth(3).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.8);

        scene.tweens.add({
            targets: p,
            y: targetY,
            x: p.x + (Math.random() - 0.5) * 60,
            scaleX: size * 0.2,
            scaleY: size * 0.2,
            alpha: 0,
            duration: 800 + Math.random() * 600,
            delay,
            ease: 'Power2',
            onComplete: () => p.destroy(),
        });
    }

    // Ground flash
    const gFlash = scene.add.circle(x, baseY, 40, 0xff6600, 0.6)
        .setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
        targets: gFlash,
        scaleX: 3,
        scaleY: 0.5,
        alpha: 0,
        duration: 500,
        onComplete: () => gFlash.destroy(),
    });
}

// ========== LIGHTNING BOLT ==========

export function createLightningBolt(scene) {
    const gfx = scene.add.graphics().setDepth(30).setBlendMode(Phaser.BlendModes.ADD);
    const startX = 30 + Math.random() * (GAME_WIDTH - 60);
    let x = startX;
    let y = 0;
    const endY = GAME_HEIGHT;
    const segments = 12 + Math.floor(Math.random() * 8);
    const segH = endY / segments;

    // Draw jagged lightning
    gfx.lineStyle(3, 0x88ccff, 0.9);
    gfx.beginPath();
    gfx.moveTo(x, y);
    for (let i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * 60;
        x = Phaser.Math.Clamp(x, 10, GAME_WIDTH - 10);
        y += segH;
        gfx.lineTo(x, y);
    }
    gfx.strokePath();

    // Thicker glow behind
    const glow = scene.add.graphics().setDepth(29).setBlendMode(Phaser.BlendModes.ADD);
    glow.lineStyle(8, 0x4488ff, 0.3);
    glow.beginPath();
    let gx = startX;
    let gy = 0;
    glow.moveTo(gx, gy);
    // Reuse approximate path
    for (let i = 0; i < segments; i++) {
        gx += (Math.random() - 0.5) * 70;
        gx = Phaser.Math.Clamp(gx, 10, GAME_WIDTH - 10);
        gy += segH;
        glow.lineTo(gx, gy);
    }
    glow.strokePath();

    // Screen flash
    const flash = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x4488ff, 0.15)
        .setDepth(28).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: [gfx, glow, flash],
        alpha: 0,
        duration: 300,
        onComplete: () => { gfx.destroy(); glow.destroy(); flash.destroy(); },
    });
}

// ========== NEON PULSE WAVE ==========

export function createNeonPulseWave(scene, fromY) {
    const y = fromY || scene.strikeLineY;
    const colors = [0x00ffff, 0xff00ff, 0x00ff88, 0xff6600];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Horizontal line that expands vertically
    const wave = scene.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH, 4, color, 0.7)
        .setDepth(25).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: wave,
        scaleY: 40,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => wave.destroy(),
    });

    // Sparkles along the wave
    for (let i = 0; i < 15; i++) {
        const sx = Math.random() * GAME_WIDTH;
        const tex = Math.random() > 0.5 ? 'neonParticle' : 'neonPinkParticle';
        const spark = scene.add.image(sx, y, tex)
            .setScale(0.3 + Math.random() * 0.4)
            .setDepth(26)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: spark,
            y: y + (Math.random() - 0.5) * 200,
            alpha: 0,
            scaleX: 0.05,
            scaleY: 0.05,
            duration: 300 + Math.random() * 300,
            delay: Math.random() * 100,
            onComplete: () => spark.destroy(),
        });
    }
}

// ========== FIRE RAIN ==========

export function createFireRain(scene) {
    const count = 20;
    for (let i = 0; i < count; i++) {
        const x = Math.random() * GAME_WIDTH;
        const tex = Math.random() > 0.5 ? 'fireParticle' : 'sparkParticle';
        const size = 0.2 + Math.random() * 0.5;
        const delay = Math.random() * 800;

        const drop = scene.add.image(x, -20, tex)
            .setScale(size)
            .setDepth(3)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setAlpha(0.6 + Math.random() * 0.4);

        scene.tweens.add({
            targets: drop,
            y: GAME_HEIGHT + 20,
            x: x + (Math.random() - 0.5) * 80,
            alpha: 0,
            duration: 1000 + Math.random() * 800,
            delay,
            ease: 'Sine.easeIn',
            onComplete: () => drop.destroy(),
        });
    }
}

// ========== SCREEN BORDER FIRE GLOW ==========

export function createBorderFireBurst(scene) {
    // Fire sparks from all edges
    const edges = ['top', 'bottom', 'left', 'right'];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const count = 15;

    for (let i = 0; i < count; i++) {
        let x, y, targetX, targetY;
        if (edge === 'top') {
            x = Math.random() * GAME_WIDTH; y = 0;
            targetX = x + (Math.random() - 0.5) * 60; targetY = 40 + Math.random() * 60;
        } else if (edge === 'bottom') {
            x = Math.random() * GAME_WIDTH; y = GAME_HEIGHT;
            targetX = x + (Math.random() - 0.5) * 60; targetY = GAME_HEIGHT - 40 - Math.random() * 60;
        } else if (edge === 'left') {
            x = 0; y = Math.random() * GAME_HEIGHT;
            targetX = 40 + Math.random() * 60; targetY = y + (Math.random() - 0.5) * 60;
        } else {
            x = GAME_WIDTH; y = Math.random() * GAME_HEIGHT;
            targetX = GAME_WIDTH - 40 - Math.random() * 60; targetY = y + (Math.random() - 0.5) * 60;
        }

        const tex = Math.random() > 0.4 ? 'fireParticle' : 'neonParticle';
        const p = scene.add.image(x, y, tex)
            .setScale(0.3 + Math.random() * 0.5)
            .setDepth(3)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: p,
            x: targetX,
            y: targetY,
            alpha: 0,
            scaleX: 0.05,
            scaleY: 0.05,
            duration: 400 + Math.random() * 300,
            delay: Math.random() * 200,
            onComplete: () => p.destroy(),
        });
    }
}

// ========== RANDOM DRAMATIC EVENT ==========

export function spawnRandomDramaticEvent(scene) {
    const events = ['fireColumn', 'lightning', 'neonPulse', 'fireRain', 'borderFire', 'doubleFireColumn'];
    const event = events[Math.floor(Math.random() * events.length)];

    switch (event) {
        case 'fireColumn':
            createFireColumn(scene, Math.random() * GAME_WIDTH);
            break;
        case 'doubleFireColumn':
            createFireColumn(scene, GAME_WIDTH * 0.25);
            createFireColumn(scene, GAME_WIDTH * 0.75);
            break;
        case 'lightning':
            createLightningBolt(scene);
            break;
        case 'neonPulse':
            createNeonPulseWave(scene);
            break;
        case 'fireRain':
            createFireRain(scene);
            break;
        case 'borderFire':
            createBorderFireBurst(scene);
            break;
    }
}

// ========== FIRE TRAIL behind tiles ==========

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

// ========== COMBO BORDER GLOW ==========

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

// ========== Combo Fire Aura on Tiles ==========

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

// ========== NEON GRADIENT TILE ==========

export function createGradientTile(scene, x, y, width, height, isLong) {
    const gfx = scene.add.graphics();
    const steps = 8;
    const stepH = height / steps;

    for (let i = 0; i < steps; i++) {
        const v = Math.floor(220 - (i / steps) * 80);
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

    // Shine at top
    gfx.fillStyle(0xffffff, 0.3);
    gfx.fillRoundedRect(x - width / 2 + 4, y - height / 2 + 2, width - 8, 3, 2);

    // Neon edge glow — left and right borders
    gfx.lineStyle(2, 0x00ccff, 0.3);
    gfx.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 6);

    // Inner subtle neon line
    gfx.lineStyle(1, 0x00ffff, 0.15);
    gfx.strokeRoundedRect(x - width / 2 + 2, y - height / 2 + 2, width - 4, height - 4, 4);

    return gfx;
}

export function createHitParticles(scene, x, y, color = 0x00ff88) {
    const count = 10;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 50 + Math.random() * 50;
        const size = 2 + Math.random() * 3;
        const p = scene.add.circle(x, y, size, color, 0.7).setDepth(15)
            .setBlendMode(Phaser.BlendModes.ADD);
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

export function createAnimatedBackground(scene) {
    const bg = scene.add.graphics().setDepth(0);

    // Lane dividers with neon glow
    for (let i = 1; i < LANES; i++) {
        // Outer glow
        bg.lineStyle(5, 0x0044aa, 0.08);
        bg.lineBetween(i * LANE_WIDTH, 0, i * LANE_WIDTH, GAME_HEIGHT);
        // Inner line
        bg.lineStyle(1, 0x1144aa, 0.25);
        bg.lineBetween(i * LANE_WIDTH, 0, i * LANE_WIDTH, GAME_HEIGHT);
    }

    // Strike line — fiery glow layers (enhanced)
    const glowLine = scene.add.graphics().setDepth(1);

    // Wide outer fire glow
    glowLine.fillStyle(0xff2200, 0.06);
    glowLine.fillRect(0, scene.strikeLineY - 40, GAME_WIDTH, 80);
    glowLine.fillStyle(0xff4400, 0.12);
    glowLine.fillRect(0, scene.strikeLineY - 25, GAME_WIDTH, 50);
    glowLine.fillStyle(0xff6600, 0.18);
    glowLine.fillRect(0, scene.strikeLineY - 12, GAME_WIDTH, 24);
    glowLine.fillStyle(0xffaa00, 0.12);
    glowLine.fillRect(0, scene.strikeLineY - 4, GAME_WIDTH, 8);

    // Main bright line
    glowLine.lineStyle(3, 0xff6600, 0.9);
    glowLine.lineBetween(0, scene.strikeLineY, GAME_WIDTH, scene.strikeLineY);

    // Neon accent lines
    glowLine.lineStyle(1, 0x00ffff, 0.25);
    glowLine.lineBetween(0, scene.strikeLineY - 2, GAME_WIDTH, scene.strikeLineY - 2);
    glowLine.lineStyle(1, 0xff00ff, 0.15);
    glowLine.lineBetween(0, scene.strikeLineY + 2, GAME_WIDTH, scene.strikeLineY + 2);

    // Embers rising from strike line (more of them)
    for (let i = 0; i < 40; i++) {
        const px = Math.random() * GAME_WIDTH;
        const py = scene.strikeLineY + Math.random() * 10 - 5;
        const fireColors = [0xff4400, 0xff6600, 0xff8800, 0xffaa00, 0xffcc00];
        const neonColors = [0x00ffff, 0xff00ff, 0x00ff88];
        const allColors = [...fireColors, ...fireColors, ...neonColors]; // bias toward fire
        const c = allColors[Math.floor(Math.random() * allColors.length)];
        const dot = scene.add.circle(px, py, 1 + Math.random() * 2.5, c, 0.4 + Math.random() * 0.4)
            .setDepth(2)
            .setBlendMode(Phaser.BlendModes.ADD);
        scene.tweens.add({
            targets: dot,
            y: py - 100 - Math.random() * 150,
            x: px + (Math.random() - 0.5) * 50,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 1500 + Math.random() * 2000,
            repeat: -1,
            delay: Math.random() * 2000,
            ease: 'Sine.easeOut',
        });
    }

    // Ambient floating neon particles in background
    for (let i = 0; i < 12; i++) {
        const px = Math.random() * GAME_WIDTH;
        const py = Math.random() * GAME_HEIGHT;
        const nColors = [0x00ffff, 0xff00ff, 0x4488ff];
        const c = nColors[Math.floor(Math.random() * nColors.length)];
        const dot = scene.add.circle(px, py, 1 + Math.random() * 1.5, c, 0.1 + Math.random() * 0.15)
            .setDepth(1)
            .setBlendMode(Phaser.BlendModes.ADD);

        // Slow float
        scene.tweens.add({
            targets: dot,
            y: py - 30 - Math.random() * 40,
            x: px + (Math.random() - 0.5) * 30,
            duration: 3000 + Math.random() * 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Slow pulse
        scene.tweens.add({
            targets: dot,
            alpha: 0.05,
            duration: 1500 + Math.random() * 1500,
            yoyo: true,
            repeat: -1,
        });
    }

    // Pulsing strike line glow
    const pulseGlow = scene.add.rectangle(
        GAME_WIDTH / 2, scene.strikeLineY, GAME_WIDTH, 6, 0xff6600, 0.3
    ).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: pulseGlow,
        alpha: 0.1,
        scaleY: 3,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });

    // Neon pulse on strike line
    const neonPulse = scene.add.rectangle(
        GAME_WIDTH / 2, scene.strikeLineY, GAME_WIDTH, 2, 0x00ffff, 0.15
    ).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: neonPulse,
        alpha: 0.05,
        scaleY: 5,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        delay: 400,
        ease: 'Sine.easeInOut',
    });
}
