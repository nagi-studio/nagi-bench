import * as THREE from 'three';

/** Procedural canvas textures — no external assets. */
function makeCanvas(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function speckle(ctx: CanvasRenderingContext2D, s: number, n: number, alpha: number, dark: boolean): void {
  for (let i = 0; i < n; i++) {
    const v = Math.random();
    ctx.fillStyle = dark
      ? `rgba(60,45,25,${alpha * v})`
      : `rgba(255,240,210,${alpha * v})`;
    const r = 1 + Math.random() * 2.5;
    ctx.fillRect(Math.random() * s, Math.random() * s, r, r);
  }
}

export function sandWallTexture(): THREE.CanvasTexture {
  return makeCanvas(128, (ctx, s) => {
    ctx.fillStyle = '#c8b482';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 500, 0.16, true);
    speckle(ctx, s, 300, 0.14, false);
    // sandstone block courses
    ctx.strokeStyle = 'rgba(90,72,45,0.35)';
    ctx.lineWidth = 2;
    for (let y = 0; y <= s; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y);
      ctx.stroke();
    }
    for (let row = 0; row < 4; row++) {
      const off = row % 2 === 0 ? 0 : 32;
      for (let x = off; x <= s; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, row * 32);
        ctx.lineTo(x, row * 32 + 32);
        ctx.stroke();
      }
    }
  });
}

export function sandFloorTexture(): THREE.CanvasTexture {
  return makeCanvas(128, (ctx, s) => {
    ctx.fillStyle = '#b5a276';
    ctx.fillRect(0, 0, s, s);
    speckle(ctx, s, 700, 0.18, true);
    speckle(ctx, s, 350, 0.12, false);
    ctx.strokeStyle = 'rgba(80,64,40,0.18)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * s, Math.random() * s);
      ctx.lineTo(Math.random() * s, Math.random() * s);
      ctx.stroke();
    }
  });
}

export function woodTexture(): THREE.CanvasTexture {
  return makeCanvas(128, (ctx, s) => {
    ctx.fillStyle = '#8a6b45';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 22; i++) {
      ctx.strokeStyle = `rgba(60,42,22,${0.12 + Math.random() * 0.2})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      const y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(s * 0.3, y + 4, s * 0.6, y - 4, s, y + 2);
      ctx.stroke();
    }
    speckle(ctx, s, 200, 0.1, true);
  });
}

export function crateTexture(): THREE.CanvasTexture {
  return makeCanvas(128, (ctx, s) => {
    ctx.fillStyle = '#96754c';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 18; i++) {
      ctx.strokeStyle = `rgba(60,42,22,${0.1 + Math.random() * 0.18})`;
      const y = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }
    // plank frame + diagonal brace
    ctx.strokeStyle = 'rgba(50,35,18,0.65)';
    ctx.lineWidth = 7;
    ctx.strokeRect(3, 3, s - 6, s - 6);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(6, 6);
    ctx.lineTo(s - 6, s - 6);
    ctx.moveTo(s - 6, 6);
    ctx.lineTo(6, s - 6);
    ctx.stroke();
  });
}

export function doorTexture(): THREE.CanvasTexture {
  return makeCanvas(128, (ctx, s) => {
    ctx.fillStyle = '#6e4f30';
    ctx.fillRect(0, 0, s, s);
    // vertical planks
    ctx.strokeStyle = 'rgba(35,22,10,0.6)';
    ctx.lineWidth = 3;
    for (let x = 0; x <= s; x += 21) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, s);
      ctx.stroke();
    }
    // iron bands
    ctx.fillStyle = 'rgba(40,38,36,0.85)';
    ctx.fillRect(0, 14, s, 10);
    ctx.fillRect(0, s - 26, s, 10);
    speckle(ctx, s, 160, 0.12, true);
  });
}
