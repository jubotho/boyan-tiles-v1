// ========== Animated Background + Lava Zone + Strike Line ==========

import { LANE_WIDTH, LANES, GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export function createAnimatedBackground(scene) {
    const bg = scene.add.graphics().setDepth(0);

    // Lane dividers with neon glow
    for (let i = 1; i < LANES; i++) {
        bg.lineStyle(5, 0x0044aa, 0.08);
        bg.lineBetween(i * LANE_WIDTH, 0, i * LANE_WIDTH, GAME_HEIGHT);
        bg.lineStyle(1, 0x1144aa, 0.25);
        bg.lineBetween(i * LANE_WIDTH, 0, i * LANE_WIDTH, GAME_HEIGHT);
    }

    // ========== BRUTAL LAVA ZONE (below strike line) ==========
    // DEPTH 7-9: ABOVE tiles (depth 5) so tiles fall BEHIND the lava
    const lavaTop = scene.strikeLineY;
    const lavaHeight = GAME_HEIGHT - lavaTop;

    // --- Create lava canvas texture for a real molten look ---
    if (!scene.textures.exists('lavaTexture')) {
        const lavaCanvas = scene.textures.createCanvas('lavaTexture', GAME_WIDTH, lavaHeight);
        const lCtx = lavaCanvas.getContext();

        // Base gradient: dark crimson bottom → bright orange/yellow top
        const baseGrad = lCtx.createLinearGradient(0, 0, 0, lavaHeight);
        baseGrad.addColorStop(0, '#ff6600');
        baseGrad.addColorStop(0.08, '#ee4400');
        baseGrad.addColorStop(0.2, '#cc2200');
        baseGrad.addColorStop(0.4, '#881100');
        baseGrad.addColorStop(0.7, '#440800');
        baseGrad.addColorStop(1, '#220400');
        lCtx.fillStyle = baseGrad;
        lCtx.fillRect(0, 0, GAME_WIDTH, lavaHeight);

        // Hot veins / bright magma streaks
        for (let i = 0; i < 25; i++) {
            const vx = Math.random() * GAME_WIDTH;
            const vy = Math.random() * lavaHeight * 0.7;
            const vw = 15 + Math.random() * 60;
            const vh = 4 + Math.random() * 12;
            const vGrad = lCtx.createRadialGradient(vx, vy, 0, vx, vy, vw);
            vGrad.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
            vGrad.addColorStop(0.3, 'rgba(255, 120, 0, 0.5)');
            vGrad.addColorStop(0.7, 'rgba(200, 50, 0, 0.2)');
            vGrad.addColorStop(1, 'rgba(100, 20, 0, 0)');
            lCtx.fillStyle = vGrad;
            lCtx.fillEllipse ? null : null; // no fillEllipse, use arc
            lCtx.beginPath();
            lCtx.ellipse(vx, vy, vw, vh, Math.random() * Math.PI, 0, Math.PI * 2);
            lCtx.fill();
        }

        // Dark crust/rock patches
        for (let i = 0; i < 15; i++) {
            const cx = Math.random() * GAME_WIDTH;
            const cy = 10 + Math.random() * (lavaHeight - 20);
            const cw = 20 + Math.random() * 60;
            const ch = 8 + Math.random() * 15;
            lCtx.fillStyle = `rgba(20, 5, 0, ${0.4 + Math.random() * 0.4})`;
            lCtx.beginPath();
            lCtx.ellipse(cx, cy, cw / 2, ch / 2, Math.random() * Math.PI, 0, Math.PI * 2);
            lCtx.fill();
        }

        // Super bright surface glow (top portion)
        const surfGlowH = Math.min(20, lavaHeight * 0.2);
        const surfGrad = lCtx.createLinearGradient(0, 0, 0, surfGlowH);
        surfGrad.addColorStop(0, 'rgba(255, 220, 80, 0.9)');
        surfGrad.addColorStop(0.3, 'rgba(255, 150, 0, 0.6)');
        surfGrad.addColorStop(0.7, 'rgba(255, 80, 0, 0.3)');
        surfGrad.addColorStop(1, 'rgba(200, 40, 0, 0)');
        lCtx.fillStyle = surfGrad;
        lCtx.fillRect(0, 0, GAME_WIDTH, surfGlowH);

        // Bright spots (glowing magma pools)
        for (let i = 0; i < 12; i++) {
            const sx = Math.random() * GAME_WIDTH;
            const sy = Math.random() * lavaHeight * 0.5;
            const sr = 10 + Math.random() * 25;
            const sGrad = lCtx.createRadialGradient(sx, sy, 0, sx, sy, sr);
            sGrad.addColorStop(0, 'rgba(255, 255, 100, 0.6)');
            sGrad.addColorStop(0.4, 'rgba(255, 180, 0, 0.3)');
            sGrad.addColorStop(1, 'rgba(255, 80, 0, 0)');
            lCtx.fillStyle = sGrad;
            lCtx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
        }

        lavaCanvas.refresh();
    }

    // Place lava texture — DEPTH 7 = ABOVE tiles (depth 5)
    const lavaImg = scene.add.image(GAME_WIDTH / 2, lavaTop + lavaHeight / 2, 'lavaTexture')
        .setDepth(7)
        .setAlpha(1);

    // === LAVA SURFACE GLOW — bright pulsing line at top ===
    const lavaGlow = scene.add.rectangle(GAME_WIDTH / 2, lavaTop + 3, GAME_WIDTH, 10, 0xff8800, 0.5)
        .setDepth(8).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: lavaGlow,
        alpha: 0.2,
        scaleY: 2,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });

    const lavaGlow2 = scene.add.rectangle(GAME_WIDTH / 2, lavaTop + 2, GAME_WIDTH, 4, 0xffcc00, 0.6)
        .setDepth(8).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: lavaGlow2,
        alpha: 0.15,
        scaleY: 3,
        duration: 700,
        yoyo: true,
        repeat: -1,
        delay: 250,
        ease: 'Sine.easeInOut',
    });

    // === LAVA BUBBLES — glowing circles that rise and pop ===
    for (let i = 0; i < 8; i++) {
        const bx = Math.random() * GAME_WIDTH;
        const by = lavaTop + 15 + Math.random() * (lavaHeight - 25);
        const bubbleSize = 4 + Math.random() * 10;
        const bubbleColors = [0xff6600, 0xff8800, 0xffaa00, 0xffcc00, 0xffff44];
        const bc = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

        const bubble = scene.add.circle(bx, by, bubbleSize, bc, 0.4 + Math.random() * 0.4)
            .setDepth(8)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: bubble,
            y: lavaTop + 8,
            scaleX: 1.8 + Math.random(),
            scaleY: 1.8 + Math.random(),
            alpha: 0,
            duration: 1200 + Math.random() * 1500,
            repeat: -1,
            delay: Math.random() * 3000,
            ease: 'Sine.easeOut',
            onRepeat: () => {
                bubble.x = Math.random() * GAME_WIDTH;
                bubble.y = lavaTop + 15 + Math.random() * (lavaHeight - 25);
                bubble.setScale(1);
                bubble.setAlpha(0.4 + Math.random() * 0.4);
            },
        });
    }

    // === FLAMES SHOOTING UP from lava — ABOVE lava (depth 9) ===
    for (let i = 0; i < 20; i++) {
        const fx = Math.random() * GAME_WIDTH;
        const fy = lavaTop + Math.random() * 5;
        const flameSize = 0.3 + Math.random() * 0.7;
        const tex = Math.random() > 0.4 ? 'fireParticle' : 'bigFireParticle';

        const flame = scene.add.image(fx, fy, tex)
            .setScale(flameSize)
            .setDepth(9)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setAlpha(0.6 + Math.random() * 0.4);

        scene.tweens.add({
            targets: flame,
            y: fy - 40 - Math.random() * 100,
            x: fx + (Math.random() - 0.5) * 40,
            scaleX: flameSize * 0.05,
            scaleY: flameSize * 0.05,
            alpha: 0,
            duration: 500 + Math.random() * 700,
            repeat: -1,
            delay: Math.random() * 2000,
            ease: 'Power2',
            onRepeat: () => {
                flame.x = Math.random() * GAME_WIDTH;
                flame.y = lavaTop + Math.random() * 5;
                flame.setScale(0.3 + Math.random() * 0.7);
                flame.setAlpha(0.6 + Math.random() * 0.4);
            },
        });
    }

    // === LARGE SPORADIC FLAME BURSTS ===
    for (let i = 0; i < 5; i++) {
        const fx = Math.random() * GAME_WIDTH;

        const bigFlame = scene.add.image(fx, lavaTop, 'bigFireParticle')
            .setScale(0.1)
            .setDepth(9)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setAlpha(0);

        scene.tweens.add({
            targets: bigFlame,
            y: lavaTop - 70 - Math.random() * 60,
            scaleX: 1.0 + Math.random() * 0.8,
            scaleY: 1.2 + Math.random() * 1.0,
            alpha: { from: 0.8, to: 0 },
            duration: 700 + Math.random() * 500,
            repeat: -1,
            delay: Math.random() * 4000,
            repeatDelay: 1500 + Math.random() * 2500,
            ease: 'Power2',
            onRepeat: () => {
                bigFlame.x = Math.random() * GAME_WIDTH;
                bigFlame.y = lavaTop;
            },
        });
    }

    // === SPARK SPRAY from lava ===
    for (let i = 0; i < 15; i++) {
        const sx = Math.random() * GAME_WIDTH;
        const sy = lavaTop;

        const spark = scene.add.image(sx, sy, 'sparkParticle')
            .setScale(0.4 + Math.random() * 0.6)
            .setDepth(9)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setAlpha(0.7 + Math.random() * 0.3);

        scene.tweens.add({
            targets: spark,
            y: sy - 60 - Math.random() * 140,
            x: sx + (Math.random() - 0.5) * 70,
            alpha: 0,
            scaleX: 0.05,
            scaleY: 0.05,
            duration: 700 + Math.random() * 1000,
            repeat: -1,
            delay: Math.random() * 3000,
            ease: 'Sine.easeOut',
            onRepeat: () => {
                spark.x = Math.random() * GAME_WIDTH;
                spark.y = lavaTop;
                spark.setScale(0.4 + Math.random() * 0.6);
                spark.setAlpha(0.7 + Math.random() * 0.3);
            },
        });
    }

    // ========== STRIKE LINE (ABOVE lava, depth 9) ==========
    const glowLine = scene.add.graphics().setDepth(9);

    // Heat haze glow above strike line
    glowLine.fillStyle(0xff2200, 0.08);
    glowLine.fillRect(0, scene.strikeLineY - 50, GAME_WIDTH, 50);
    glowLine.fillStyle(0xff4400, 0.15);
    glowLine.fillRect(0, scene.strikeLineY - 30, GAME_WIDTH, 30);
    glowLine.fillStyle(0xff6600, 0.25);
    glowLine.fillRect(0, scene.strikeLineY - 15, GAME_WIDTH, 15);

    // Main bright line
    glowLine.lineStyle(4, 0xff8800, 1);
    glowLine.lineBetween(0, scene.strikeLineY, GAME_WIDTH, scene.strikeLineY);

    // White-hot core
    glowLine.lineStyle(2, 0xffdd88, 0.8);
    glowLine.lineBetween(0, scene.strikeLineY, GAME_WIDTH, scene.strikeLineY);

    // Neon accent lines
    glowLine.lineStyle(1, 0x00ffff, 0.25);
    glowLine.lineBetween(0, scene.strikeLineY - 3, GAME_WIDTH, scene.strikeLineY - 3);
    glowLine.lineStyle(1, 0xff00ff, 0.15);
    glowLine.lineBetween(0, scene.strikeLineY + 3, GAME_WIDTH, scene.strikeLineY + 3);

    // Pulsing strike line glow
    const pulseGlow = scene.add.rectangle(
        GAME_WIDTH / 2, scene.strikeLineY, GAME_WIDTH, 8, 0xff6600, 0.4
    ).setDepth(9).setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
        targets: pulseGlow,
        alpha: 0.1,
        scaleY: 3,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });

    // Ambient floating neon particles in upper area
    for (let i = 0; i < 12; i++) {
        const px = Math.random() * GAME_WIDTH;
        const py = Math.random() * scene.strikeLineY;
        const nColors = [0x00ffff, 0xff00ff, 0x4488ff];
        const c = nColors[Math.floor(Math.random() * nColors.length)];
        const dot = scene.add.circle(px, py, 1 + Math.random() * 1.5, c, 0.1 + Math.random() * 0.15)
            .setDepth(1)
            .setBlendMode(Phaser.BlendModes.ADD);

        scene.tweens.add({
            targets: dot,
            y: py - 30 - Math.random() * 40,
            x: px + (Math.random() - 0.5) * 30,
            duration: 3000 + Math.random() * 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        scene.tweens.add({
            targets: dot,
            alpha: 0.05,
            duration: 1500 + Math.random() * 1500,
            yoyo: true,
            repeat: -1,
        });
    }
}
