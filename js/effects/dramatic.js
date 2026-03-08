// ========== Dramatic Events (Fire Columns, Lightning, Neon Pulse, Fire Rain, Border Fire) ==========

import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

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
