// ========== Bonus Name Spawning & Lifecycle ==========

import { GAME_WIDTH, GAME_HEIGHT, STRIKE_LINE_Y } from '../constants.js';
import { playSiren } from '../audio.js';
import { getUsername } from '../auth.js';

const BONUS_COLORS = [0xff0000, 0xff6600, 0xffcc00, 0x00ff66, 0xff00ff, 0x00ccff];

export function spawnBonusName(scene) {
    const name = getUsername() || 'PLAYER';

    // Siren when bonus appears!
    playSiren();

    // Spawn from a random edge
    const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x, y, vx, vy;
    const speed = 120 + Math.random() * 100; // pixels per second

    switch (edge) {
        case 0: // from top
            x = 60 + Math.random() * (GAME_WIDTH - 120);
            y = -30;
            vx = (Math.random() - 0.5) * speed;
            vy = speed * (0.6 + Math.random() * 0.4);
            break;
        case 1: // from right
            x = GAME_WIDTH + 30;
            y = 80 + Math.random() * (STRIKE_LINE_Y - 160);
            vx = -speed * (0.6 + Math.random() * 0.4);
            vy = (Math.random() - 0.5) * speed * 0.5;
            break;
        case 2: // from bottom
            x = 60 + Math.random() * (GAME_WIDTH - 120);
            y = STRIKE_LINE_Y + 30;
            vx = (Math.random() - 0.5) * speed;
            vy = -speed * (0.6 + Math.random() * 0.4);
            break;
        case 3: // from left
            x = -30;
            y = 80 + Math.random() * (STRIKE_LINE_Y - 160);
            vx = speed * (0.6 + Math.random() * 0.4);
            vy = (Math.random() - 0.5) * speed * 0.5;
            break;
    }

    const container = scene.add.container(x, y).setDepth(20);

    // Glowing background circle
    const glow = scene.add.circle(0, 0, 45, 0xffff00, 0.2);
    container.add(glow);

    // The name text
    const txt = scene.add.text(0, 0, name, {
        fontSize: name.length > 8 ? '20px' : '28px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4,
    }).setOrigin(0.5);
    container.add(txt);

    // Make it interactive
    const hitZone = scene.add.circle(0, 0, 55, 0xffffff, 0.001).setInteractive();
    container.add(hitZone);

    // Spinning rotation
    scene.tweens.add({
        targets: container,
        angle: 360,
        duration: 1500 + Math.random() * 1000,
        repeat: -1,
    });

    // Scale pulse
    scene.tweens.add({
        targets: container,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
        repeat: -1,
    });

    // Flashing color change
    let colorIdx = 0;
    const flashTimer = scene.time.addEvent({
        delay: 120,
        loop: true,
        callback: () => {
            if (!txt || !txt.scene) return;
            colorIdx = (colorIdx + 1) % BONUS_COLORS.length;
            const c = BONUS_COLORS[colorIdx];
            txt.setFill('#' + c.toString(16).padStart(6, '0'));
            glow.setFillStyle(c, 0.25);
        },
    });

    const bonusData = {
        container,
        hitZone,
        txt,
        glow,
        flashTimer,
        vx,
        vy,
        age: 0,
        spawnTime: scene.time.now - scene.startTime,
        destroyed: false,
    };

    hitZone.on('pointerdown', () => {
        if (bonusData.destroyed) return;
        bonusData.destroyed = true;

        // Faster tap = more points (max 200 if tapped in first 0.5s)
        const tapTime = (scene.time.now - scene.startTime) - bonusData.spawnTime;
        const bonusPoints = Math.max(20, Math.floor(200 - tapTime * 0.05));

        scene.score += bonusPoints;
        scene.scoreText.setText(Math.floor(scene.score));

        // Siren!
        playSiren();

        // Big flashy feedback
        const bonusText = scene.add.text(container.x, container.y, `+${bonusPoints}`, {
            fontSize: '40px', fill: '#ffcc00', fontStyle: 'bold',
            stroke: '#ff0000', strokeThickness: 5,
        }).setOrigin(0.5).setDepth(30);

        scene.tweens.add({
            targets: bonusText,
            y: bonusText.y - 80,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 800,
            onComplete: () => bonusText.destroy(),
        });

        // Explosion particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const pSpeed = 60 + Math.random() * 80;
            const c = BONUS_COLORS[Math.floor(Math.random() * BONUS_COLORS.length)];
            const p = scene.add.circle(container.x, container.y, 3 + Math.random() * 4, c, 0.9).setDepth(25);
            scene.tweens.add({
                targets: p,
                x: container.x + Math.cos(angle) * pSpeed,
                y: container.y + Math.sin(angle) * pSpeed,
                alpha: 0,
                duration: 500 + Math.random() * 300,
                onComplete: () => p.destroy(),
            });
        }

        flashTimer.destroy();
        container.destroy();
    });

    scene.bonusNames.push(bonusData);
}

export function updateBonusNames(scene) {
    const dt = 1 / 60; // approximate frame time
    scene.bonusNames = scene.bonusNames.filter(b => {
        if (b.destroyed) return false;
        b.age += 1;

        // Move the container
        b.container.x += b.vx * dt;
        b.container.y += b.vy * dt;

        // Remove when fully off-screen or after ~6 seconds
        const x = b.container.x;
        const y = b.container.y;
        const offScreen = x < -80 || x > GAME_WIDTH + 80 || y < -80 || y > GAME_HEIGHT + 80;
        if (offScreen || b.age > 360) {
            b.flashTimer.destroy();
            b.container.destroy();
            return false;
        }
        return true;
    });
}

export function cleanupBonusNames(bonusNames) {
    bonusNames.forEach(b => {
        if (!b.destroyed) { b.flashTimer.destroy(); b.container.destroy(); }
    });
}
