import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';
import { fetchLeaderboard, getUsername } from '../auth.js';

const APPROACH_THRESHOLD = 300; // points below rival to start showing line
const LINE_Y_TOP = -10;
const LINE_Y_BOTTOM = GAME_HEIGHT / 2 + 40;

export class RivalLineManager {
    constructor(scene, songId, difficulty) {
        this.scene = scene;
        this.songId = songId;
        this.difficulty = difficulty;
        this.rivals = [];
        this.nextRivalIdx = 0;
        this.container = null;
        this.active = false;
        this.surpassed = false;

        this.fetchRivals();
    }

    async fetchRivals() {
        try {
            const entries = await fetchLeaderboard(this.songId, this.difficulty);
            const me = getUsername();
            // All scores except mine, sorted ascending (lowest first)
            this.rivals = entries
                .filter(e => e.username !== me)
                .sort((a, b) => a.score - b.score);
        } catch {
            this.rivals = [];
        }
    }

    update(currentScore) {
        if (this.rivals.length === 0) return;

        // Find next rival to surpass
        while (this.nextRivalIdx < this.rivals.length &&
               currentScore >= this.rivals[this.nextRivalIdx].score) {
            // Player surpassed this rival!
            this.showSurpassed(this.rivals[this.nextRivalIdx]);
            this.nextRivalIdx++;
            this.hideRivalLine();
        }

        if (this.nextRivalIdx >= this.rivals.length) {
            // Surpassed everyone
            if (this.active) this.hideRivalLine();
            return;
        }

        const rival = this.rivals[this.nextRivalIdx];
        const gap = rival.score - currentScore;

        if (gap <= APPROACH_THRESHOLD && gap > 0) {
            // Show/update rival line
            const progress = 1 - (gap / APPROACH_THRESHOLD); // 0=just appeared, 1=about to surpass
            this.showRivalLine(rival, progress);
        } else if (this.active) {
            this.hideRivalLine();
        }
    }

    showRivalLine(rival, progress) {
        const scene = this.scene;
        const targetY = LINE_Y_TOP + progress * (LINE_Y_BOTTOM - LINE_Y_TOP);

        if (!this.container) {
            this.active = true;
            this.container = scene.add.container(0, targetY).setDepth(45);

            // Glowing line across the full width
            const line = scene.add.rectangle(GAME_WIDTH / 2, 0, GAME_WIDTH + 20, 3, 0xff2200);
            line.setAlpha(0.9);
            this.line = line;

            // Outer glow (wider, more transparent)
            const glow = scene.add.rectangle(GAME_WIDTH / 2, 0, GAME_WIDTH + 20, 10, 0xff4400);
            glow.setAlpha(0.3);
            this.glow = glow;

            // Rival name + score label
            const label = scene.add.text(GAME_WIDTH / 2, -14, '', {
                fontSize: '13px', fill: '#ff6600', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 4,
            }).setOrigin(0.5);
            this.label = label;

            // Pulsing arrow indicators on both sides
            const arrowL = scene.add.text(8, -1, '>>>', {
                fontSize: '11px', fill: '#ff4400', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 3,
            }).setOrigin(0, 0.5);
            const arrowR = scene.add.text(GAME_WIDTH - 8, -1, '<<<', {
                fontSize: '11px', fill: '#ff4400', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 3,
            }).setOrigin(1, 0.5);
            this.arrowL = arrowL;
            this.arrowR = arrowR;

            this.container.add([glow, line, label, arrowL, arrowR]);

            // Entrance animation
            this.container.setAlpha(0);
            scene.tweens.add({
                targets: this.container,
                alpha: 1,
                duration: 400,
                ease: 'Power2',
            });

            // Pulsing glow
            this.glowTween = scene.tweens.add({
                targets: [this.glow, this.arrowL, this.arrowR],
                alpha: { from: 0.3, to: 0.8 },
                duration: 500,
                yoyo: true,
                repeat: -1,
            });
        }

        // Update position smoothly
        this.container.y = targetY;

        // Update label
        const lvl = rival.level > 1 ? ` Lv${rival.level}` : '';
        this.label.setText(`${rival.username} — ${rival.score}${lvl}`);

        // Intensify color as player gets closer
        const r = Math.floor(0xff);
        const g = Math.floor(0x22 + progress * 0x44);
        const b = Math.floor(progress * 0x22);
        const color = (r << 16) | (g << 8) | b;
        this.line.setFillStyle(color);

        // Scale line thickness as approaching
        const thickness = 3 + progress * 3;
        this.line.setSize(GAME_WIDTH + 20, thickness);
    }

    hideRivalLine() {
        if (!this.container) return;
        this.active = false;

        if (this.glowTween) {
            this.glowTween.stop();
            this.glowTween = null;
        }

        const c = this.container;
        this.container = null;
        this.line = null;
        this.glow = null;
        this.label = null;
        this.arrowL = null;
        this.arrowR = null;

        this.scene.tweens.add({
            targets: c,
            alpha: 0,
            duration: 200,
            onComplete: () => c.destroy(),
        });
    }

    showSurpassed(rival) {
        const scene = this.scene;
        const cx = GAME_WIDTH / 2;
        const cy = GAME_HEIGHT / 2 - 60;

        // Big "SURPASSED!" text
        const txt = scene.add.text(cx, cy, `BEAT ${rival.username}!`, {
            fontSize: '28px', fill: '#ff6600', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 6,
        }).setOrigin(0.5).setDepth(50).setAlpha(0);

        const scoreTxt = scene.add.text(cx, cy + 35, `${rival.score} CRUSHED!`, {
            fontSize: '18px', fill: '#ffaa00', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 4,
        }).setOrigin(0.5).setDepth(50).setAlpha(0);

        // Animate in
        scene.tweens.add({
            targets: txt,
            alpha: 1, scaleX: { from: 2, to: 1 }, scaleY: { from: 2, to: 1 },
            duration: 300, ease: 'Back.easeOut',
        });
        scene.tweens.add({
            targets: scoreTxt,
            alpha: 1, y: cy + 30,
            duration: 300, delay: 150,
        });

        // Animate out
        scene.tweens.add({
            targets: txt,
            alpha: 0, y: cy - 40, scaleX: 1.3, scaleY: 1.3,
            duration: 800, delay: 1200, ease: 'Power2',
            onComplete: () => txt.destroy(),
        });
        scene.tweens.add({
            targets: scoreTxt,
            alpha: 0, y: cy - 10,
            duration: 800, delay: 1300,
            onComplete: () => scoreTxt.destroy(),
        });

        // Camera shake for impact
        scene.cameras.main.shake(150, 0.006);
    }

    cleanup() {
        if (this.glowTween) {
            this.glowTween.stop();
            this.glowTween = null;
        }
        if (this.container && !this.container.destroyed) {
            this.container.destroy();
        }
        this.container = null;
    }
}
