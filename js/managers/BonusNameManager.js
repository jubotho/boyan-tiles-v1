// ========== Bonus Name Spawning & Lifecycle ==========

import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { playSiren } from '../audio.js';

const BONUS_NAMES = ['Светльо', 'Боян', 'Пешко', 'Цвети', 'Дари'];
const BONUS_COLORS = [0xff0000, 0xff6600, 0xffcc00, 0x00ff66, 0xff00ff, 0x00ccff];

export function spawnBonusName(scene) {
    const name = BONUS_NAMES[Math.floor(Math.random() * BONUS_NAMES.length)];

    // Siren when bonus appears!
    playSiren();

    const x = 60 + Math.random() * (GAME_WIDTH - 120);
    const y = 80 + Math.random() * (GAME_HEIGHT - 250);

    const container = scene.add.container(x, y).setDepth(20);

    // Glowing background circle
    const glow = scene.add.circle(0, 0, 45, 0xffff00, 0.2);
    container.add(glow);

    // The name text
    const txt = scene.add.text(0, 0, name, {
        fontSize: '28px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4,
    }).setOrigin(0.5);
    container.add(txt);

    // Make it interactive
    const hitZone = scene.add.circle(0, 0, 50, 0xffffff, 0.001).setInteractive();
    container.add(hitZone);

    // Spinning rotation
    scene.tweens.add({
        targets: container,
        angle: { from: -15, to: 15 },
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });

    // Bouncing up and down
    scene.tweens.add({
        targets: container,
        y: y - 25,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
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
            const speed = 60 + Math.random() * 80;
            const c = BONUS_COLORS[Math.floor(Math.random() * BONUS_COLORS.length)];
            const p = scene.add.circle(container.x, container.y, 3 + Math.random() * 4, c, 0.9).setDepth(25);
            scene.tweens.add({
                targets: p,
                x: container.x + Math.cos(angle) * speed,
                y: container.y + Math.sin(angle) * speed,
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
    scene.bonusNames = scene.bonusNames.filter(b => {
        if (b.destroyed) return false;
        b.age += 1;
        // Remove after ~4 seconds (240 frames at 60fps)
        if (b.age > 240) {
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
