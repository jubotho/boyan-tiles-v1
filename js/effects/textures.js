// ========== Texture Generation + Shared Color Constants ==========

let texturesCreated = false;

// Per-lane neon color schemes (shared across effects modules)
export const LANE_COLORS = [
    { main: 0x00ffff, dark: 0x003344, mid: 0x006688, glow: 0x00ccff, name: 'cyan' },
    { main: 0xff00ff, dark: 0x330033, mid: 0x660066, glow: 0xcc00ff, name: 'magenta' },
    { main: 0xff6600, dark: 0x331100, mid: 0x662200, glow: 0xff8800, name: 'orange' },
    { main: 0x00ff66, dark: 0x003311, mid: 0x006622, glow: 0x00ff88, name: 'green' },
];

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
