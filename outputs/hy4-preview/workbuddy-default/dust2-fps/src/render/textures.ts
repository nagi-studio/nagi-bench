/**
 * Every texture in the game is generated at runtime on a 2D canvas —
 * no image files are loaded.
 */

import * as THREE from 'three';

function canvas(size: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  return { c, ctx };
}

interface NoiseOpts {
  base: string;
  speckle: string;
  speckleCount: number;
  speckleSize: number;
  blotches: number;
  blotchColor: string;
  grain: number;
  lines?: { color: string; count: number; width: number };
  border?: { color: string; size: number };
}

function paint(ctx: CanvasRenderingContext2D, size: number, o: NoiseOpts): void {
  ctx.fillStyle = o.base;
  ctx.fillRect(0, 0, size, size);

  // soft blotches
  for (let i = 0; i < o.blotches; i++) {
    const r = size * (0.05 + Math.random() * 0.22);
    const x = Math.random() * size;
    const y = Math.random() * size;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, o.blotchColor);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.10 + Math.random() * 0.22;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // speckles
  for (let i = 0; i < o.speckleCount; i++) {
    ctx.fillStyle = o.speckle;
    ctx.globalAlpha = 0.12 + Math.random() * 0.4;
    const s = 1 + Math.random() * o.speckleSize;
    ctx.fillRect(Math.random() * size, Math.random() * size, s, s);
  }
  ctx.globalAlpha = 1;

  if (o.lines) {
    ctx.strokeStyle = o.lines.color;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < o.lines.count; i++) {
      ctx.lineWidth = 0.5 + Math.random() * o.lines.width;
      ctx.beginPath();
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * size * 0.6, y + (Math.random() - 0.5) * size * 0.6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (o.border) {
    ctx.strokeStyle = o.border.color;
    ctx.lineWidth = o.border.size;
    ctx.strokeRect(0, 0, size, size);
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(o.border.size, o.border.size, size - o.border.size * 2, size - o.border.size * 2);
    ctx.globalAlpha = 1;
  }

  // film grain
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * o.grain;
    d[i] = Math.max(0, Math.min(255, d[i]! + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1]! + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2]! + n));
  }
  ctx.putImageData(img, 0, 0);
}

function toTexture(c: HTMLCanvasElement, repeat: number, aniso = 4): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
}

export interface WorldTextures {
  sand: THREE.Texture;
  concrete: THREE.Texture;
  wall: THREE.Texture;
  crate: THREE.Texture;
  metal: THREE.Texture;
  sky: THREE.Texture;
}

let cache: WorldTextures | null = null;

export function worldTextures(): WorldTextures {
  if (cache) return cache;

  // --- sand floor ---
  {
    const { c, ctx } = canvas(256);
    paint(ctx, 256, {
      base: '#c8ab7c',
      speckle: '#8f7448',
      speckleCount: 4200,
      speckleSize: 2.2,
      blotches: 26,
      blotchColor: '#a98d5f',
      grain: 26,
      lines: { color: '#b09468', count: 40, width: 1.2 },
    });
    cache = {} as WorldTextures;
    (cache as WorldTextures).sand = toTexture(c, 1, 8);
  }

  // --- concrete / plaster walls ---
  {
    const { c, ctx } = canvas(256);
    paint(ctx, 256, {
      base: '#b9a583',
      speckle: '#8c7a5c',
      speckleCount: 2600,
      speckleSize: 2.0,
      blotches: 20,
      blotchColor: '#947f5f',
      grain: 22,
      lines: { color: '#8a7757', count: 26, width: 1.6 },
    });
    (cache as WorldTextures).concrete = toTexture(c, 2, 8);
  }

  // --- darker stone block walls (outdoor boundaries) ---
  {
    const { c, ctx } = canvas(256);
    paint(ctx, 256, {
      base: '#9c8a6b',
      speckle: '#6f6047',
      speckleCount: 3000,
      speckleSize: 2.4,
      blotches: 16,
      blotchColor: '#7a6a4e',
      grain: 20,
      lines: { color: '#6d5d42', count: 30, width: 2.0 },
    });
    (cache as WorldTextures).wall = toTexture(c, 1, 8);
  }

  // --- wooden crate ---
  {
    const { c, ctx } = canvas(128);
    paint(ctx, 128, {
      base: '#8a6a41',
      speckle: '#5d4626',
      speckleCount: 900,
      speckleSize: 2,
      blotches: 8,
      blotchColor: '#6d522f',
      grain: 18,
      lines: { color: '#4e3a1f', count: 18, width: 1.4 },
      border: { color: '#4a371d', size: 7 },
    });
    (cache as WorldTextures).crate = toTexture(c, 2, 4);
  }

  // --- painted metal ---
  {
    const { c, ctx } = canvas(128);
    paint(ctx, 128, {
      base: '#5c666e',
      speckle: '#3d454b',
      speckleCount: 700,
      speckleSize: 1.8,
      blotches: 6,
      blotchColor: '#454d54',
      grain: 14,
      lines: { color: '#394046', count: 10, width: 1.0 },
    });
    (cache as WorldTextures).metal = toTexture(c, 1, 4);
  }

  // --- sky gradient ---
  {
    const c2 = document.createElement('canvas');
    c2.width = 8;
    c2.height = 256;
    const ctx = c2.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.0, '#5b8fc9');
    g.addColorStop(0.45, '#9dbfd8');
    g.addColorStop(0.75, '#d8c9a8');
    g.addColorStop(1.0, '#c9ab7d');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 8, 256);
    const t = new THREE.CanvasTexture(c2);
    t.colorSpace = THREE.SRGBColorSpace;
    (cache as WorldTextures).sky = t;
  }

  return cache;
}
