import * as THREE from 'three';

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void, repeat = 1): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function noise(ctx: CanvasRenderingContext2D, s: number, amount: number, alpha: number): void {
  for (let i = 0; i < amount; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    const r = Math.random() * 2 + 0.5;
    const shade = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${alpha * Math.random()})`;
    ctx.fillRect(x, y, r, r);
  }
}

export function makeSandstone(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#c8b489';
    ctx.fillRect(0, 0, s, s);
    // brick courses
    ctx.strokeStyle = 'rgba(120,100,70,0.35)';
    ctx.lineWidth = 2;
    const rows = 6;
    for (let r = 0; r <= rows; r++) {
      const y = (r / rows) * s;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y);
      ctx.stroke();
      const offset = (r % 2) * (s / 6);
      for (let c = 0; c < 3; c++) {
        const x = offset + (c / 3) * s;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + s / rows);
        ctx.stroke();
      }
    }
    noise(ctx, s, 2600, 0.06);
  }, 2);
}

export function makeFloor(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#b6a377';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(90,78,55,0.28)';
    ctx.lineWidth = 2;
    const tiles = 4;
    for (let i = 0; i <= tiles; i++) {
      const p = (i / tiles) * s;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(s, p); ctx.stroke();
    }
    noise(ctx, s, 3000, 0.07);
  }, 8);
}

export function makeCrate(): THREE.CanvasTexture {
  return canvasTexture(128, (ctx, s) => {
    ctx.fillStyle = '#8a6a3f';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(60,42,22,0.6)';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, s - 8, s - 8);
    ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(s - 4, s - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s - 4, 4); ctx.lineTo(4, s - 4); ctx.stroke();
    ctx.strokeStyle = 'rgba(70,50,28,0.4)';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      const y = (i / 4) * s;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
    }
    noise(ctx, s, 900, 0.08);
  }, 1);
}

export function makeMetal(): THREE.CanvasTexture {
  return canvasTexture(128, (ctx, s) => {
    ctx.fillStyle = '#6d737b';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(40,44,50,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, s - 6, s - 6);
    noise(ctx, s, 1200, 0.1);
  }, 1);
}

export function makeWoodDoor(): THREE.CanvasTexture {
  return canvasTexture(128, (ctx, s) => {
    ctx.fillStyle = '#7a5a34';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(50,34,18,0.55)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const x = (i / 5) * s + 6;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(40,28,14,0.5)';
    ctx.fillRect(0, s * 0.45, s, 6);
    noise(ctx, s, 800, 0.07);
  }, 1);
}

export function makeSkyGradient(): THREE.CanvasTexture {
  return canvasTexture(256, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, '#8fb6d9');
    g.addColorStop(0.5, '#cfd8d2');
    g.addColorStop(1, '#e6d9b8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }, 1);
}

export function flashSprite(): THREE.CanvasTexture {
  return canvasTexture(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,240,180,1)');
    g.addColorStop(0.3, 'rgba(255,180,60,0.8)');
    g.addColorStop(1, 'rgba(255,120,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }, 1);
}

export function smokeSprite(): THREE.CanvasTexture {
  return canvasTexture(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(120,110,100,0.7)');
    g.addColorStop(1, 'rgba(120,110,100,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }, 1);
}
