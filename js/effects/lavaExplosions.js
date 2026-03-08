// ========== Lava Tile Explosions (Color-Matched) ==========

import { LANE_WIDTH } from '../constants.js';
import { LANE_COLORS } from './textures.js';

export function createLavaTileExplosion(scene, x, y, lane, isPerfect) {
    const colors = LANE_COLORS[lane % 4];
    const mainColor = colors.main;
    const glowColor = colors.glow;

    // Explosion depth must be ABOVE lava (lava is 7-9)
    const EXPLODE_DEPTH = 25;

    // === TILE FRAGMENTS — LOTS of colored rectangles flying everywhere ===
    const fragCount = isPerfect ? 60 : 35;
    for (let i = 0; i < fragCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 80 + Math.random() * (isPerfect ? 280 : 180);
        const fragW = 4 + Math.random() * 14;
        const fragH = 3 + Math.random() * 8;

        const frag = scene.add.rectangle(
            x + (Math.random() - 0.5) * 30, y,
            fragW, fragH, mainColor, 1
        ).setDepth(EXPLODE_DEPTH)
         .setRotation(Math.random() * Math.PI * 2);

        const targetX = x + Math.cos(angle) * vel;
        const targetY = y + Math.sin(angle) * vel * 0.7;

        scene.tweens.add({
            targets: frag,
            x: targetX,
            y: targetY,
            rotation: frag.rotation + (Math.random() - 0.5) * 10,
            alpha: 0,
            scaleX: 0.15,
            scaleY: 0.15,
            duration: 500 + Math.random() * 500,
            ease: 'Power2',
            onComplete: () => frag.destroy(),
        });
    }

    // === BRIGHT NEON CHUNKS — larger glowing pieces ===
    const chunkCount = isPerfect ? 20 : 12;
    for (let i = 0; i < chunkCount; i++) {
        const angle = -Math.PI + Math.random() * Math.PI * 2;
        const vel = 60 + Math.random() * 200;
        const sz = 6 + Math.random() * 12;

        const chunk = scene.add.rectangle(
            x + (Math.random() - 0.5) * 20, y,
            sz, sz * (0.4 + Math.random() * 0.6), glowColor, 1
        ).setDepth(EXPLODE_DEPTH + 1)
         .setRotation(Math.random() * Math.PI * 2);

        scene.tweens.add({
            targets: chunk,
            x: chunk.x + Math.cos(angle) * vel,
            y: chunk.y + Math.sin(angle) * vel,
            rotation: chunk.rotation + (Math.random() - 0.5) * 12,
            alpha: 0,
            duration: 400 + Math.random() * 400,
            ease: 'Power3',
            onComplete: () => chunk.destroy(),
        });
    }

    // === SPARKING DOTS — tiny bright colored sparks ===
    const sparkCount = isPerfect ? 30 : 18;
    for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 100 + Math.random() * 250;

        const spark = scene.add.circle(
            x + (Math.random() - 0.5) * 20, y,
            2 + Math.random() * 3, mainColor, 1
        ).setDepth(EXPLODE_DEPTH + 2);

        scene.tweens.add({
            targets: spark,
            x: spark.x + Math.cos(angle) * vel,
            y: spark.y + Math.sin(angle) * vel,
            alpha: 0,
            scaleX: 0.1,
            scaleY: 0.1,
            duration: 300 + Math.random() * 400,
            ease: 'Power3',
            onComplete: () => spark.destroy(),
        });
    }

    // === LAVA SPLASH — molten drops flying UP ===
    const splashCount = isPerfect ? 20 : 10;
    for (let i = 0; i < splashCount; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.7;
        const vel = 80 + Math.random() * 160;
        const lavaColors = [0xff4400, 0xff6600, 0xffaa00, 0xffcc00];
        const c = lavaColors[Math.floor(Math.random() * lavaColors.length)];

        const drop = scene.add.circle(
            x + (Math.random() - 0.5) * 40, y,
            3 + Math.random() * 5, c, 1
        ).setDepth(EXPLODE_DEPTH);

        scene.tweens.add({
            targets: drop,
            x: drop.x + Math.cos(angle) * vel,
            y: drop.y + Math.sin(angle) * vel + 50,
            alpha: 0,
            scaleX: 0.2,
            scaleY: 0.2,
            duration: 500 + Math.random() * 400,
            ease: 'Power2',
            onComplete: () => drop.destroy(),
        });
    }

    // === BIG COLOR FLASH ===
    const flash = scene.add.circle(x, y, isPerfect ? 55 : 35, mainColor, isPerfect ? 0.8 : 0.6)
        .setDepth(EXPLODE_DEPTH + 3)
        .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: flash,
        scaleX: 4,
        scaleY: 4,
        alpha: 0,
        duration: 350,
        ease: 'Power2',
        onComplete: () => flash.destroy(),
    });

    // === COLORED SHOCKWAVE RING ===
    const ring = scene.add.circle(x, y, 10, mainColor, 0)
        .setDepth(EXPLODE_DEPTH + 2)
        .setStrokeStyle(4, mainColor, 0.9);

    scene.tweens.add({
        targets: ring,
        scaleX: isPerfect ? 6 : 3.5,
        scaleY: isPerfect ? 6 : 3.5,
        alpha: 0,
        duration: isPerfect ? 500 : 350,
        ease: 'Power2',
        onComplete: () => ring.destroy(),
    });
}

export function createLavaMissExplosion(scene, x, y, lane) {
    const colors = LANE_COLORS[lane % 4];
    const EXPLODE_DEPTH = 25;

    // Colored fragments flying up from lava
    for (let i = 0; i < 25; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
        const vel = 40 + Math.random() * 120;
        const fragW = 3 + Math.random() * 10;
        const fragH = 2 + Math.random() * 6;

        const frag = scene.add.rectangle(
            x + (Math.random() - 0.5) * LANE_WIDTH * 0.6, y,
            fragW, fragH, colors.main, 0.9
        ).setDepth(EXPLODE_DEPTH)
         .setRotation(Math.random() * Math.PI * 2);

        scene.tweens.add({
            targets: frag,
            x: frag.x + Math.cos(angle) * vel,
            y: frag.y + Math.sin(angle) * vel + 30,
            rotation: frag.rotation + (Math.random() - 0.5) * 8,
            alpha: 0,
            duration: 350 + Math.random() * 300,
            ease: 'Power2',
            onComplete: () => frag.destroy(),
        });
    }

    // Lava splash upward
    for (let i = 0; i < 12; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.5;
        const vel = 50 + Math.random() * 100;
        const lavaC = [0xff4400, 0xff6600, 0xffaa00][Math.floor(Math.random() * 3)];

        const drop = scene.add.circle(
            x + (Math.random() - 0.5) * 30, y,
            3 + Math.random() * 4, lavaC, 0.9
        ).setDepth(EXPLODE_DEPTH);

        scene.tweens.add({
            targets: drop,
            x: drop.x + Math.cos(angle) * vel,
            y: drop.y + Math.sin(angle) * vel + 25,
            alpha: 0,
            duration: 400 + Math.random() * 200,
            onComplete: () => drop.destroy(),
        });
    }

    // Red flash
    const flash = scene.add.circle(x, y, 30, 0xff2200, 0.5)
        .setDepth(EXPLODE_DEPTH)
        .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
        targets: flash,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 300,
        onComplete: () => flash.destroy(),
    });
}
