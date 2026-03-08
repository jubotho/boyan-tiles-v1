// ========== Hit Explosions (Fire + Neon + Particles) ==========

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
