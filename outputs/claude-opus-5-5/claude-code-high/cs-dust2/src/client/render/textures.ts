// Procedural canvas textures (no image files): sandstone, plaster, floors, crates, doors...
import * as THREE from 'three';
import { makeRng } from '../../core/math.ts';

type Ctx = CanvasRenderingContext2D;

function makeCanvas(w: number, h: number): [HTMLCanvasElement, Ctx] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function addNoise(ctx: Ctx, w: number, h: number, amount: number, rng: () => number, mono = true) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng() - 0.5) * amount;
    if (mono) {
      d[i] += n;
      d[i + 1] += n;
      d[i + 2] += n;
    } else {
      d[i] += (rng() - 0.5) * amount;
      d[i + 1] += (rng() - 0.5) * amount;
      d[i + 2] += (rng() - 0.5) * amount;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function blotches(ctx: Ctx, w: number, h: number, n: number, color: string, rMin: number, rMax: number, alpha: number, rng: () => number) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const r = rMin + rng() * (rMax - rMin);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha * (0.5 + rng() * 0.5);
    ctx.fillStyle = g;
    // draw wrapped so the texture tiles seamlessly
    for (const ox of [-w, 0, w])
      for (const oy of [-h, 0, h]) {
        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.restore();
      }
  }
  ctx.restore();
}

function toTexture(c: HTMLCanvasElement, repeat = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

const shade = (hex: string, f: number) => {
  const c = new THREE.Color(hex);
  c.multiplyScalar(f);
  return `#${c.getHexString()}`;
};

/** Sandstone block wall. Tile = 4m x 4m. */
export function sandstoneTexture(seed = 1): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#b39468';
  ctx.fillRect(0, 0, S, S);
  const rowH = S / 8; // 0.5 m courses
  for (let r = 0; r < 8; r++) {
    let x = -rng() * 60;
    while (x < S) {
      const bw = 70 + rng() * 110;
      const f = 0.9 + rng() * 0.18;
      ctx.fillStyle = shade('#dcc293', f);
      ctx.fillRect(x + 2, r * rowH + 2, bw - 3, rowH - 3);
      // wrap
      if (x + bw > S) ctx.fillRect(x + 2 - S, r * rowH + 2, bw - 3, rowH - 3);
      // chipped edges
      ctx.fillStyle = 'rgba(120,90,55,0.25)';
      ctx.fillRect(x + 2, r * rowH + rowH - 6, bw - 3, 4);
      x += bw;
    }
  }
  blotches(ctx, S, S, 40, 'rgba(110,80,45,1)', 10, 60, 0.12, rng);
  blotches(ctx, S, S, 25, 'rgba(255,240,210,1)', 10, 50, 0.1, rng);
  addNoise(ctx, S, S, 22, rng);
  return toTexture(c);
}

/** Smooth plaster with cracks and patches (Dust2 houses). Tile = 4m. */
export function plasterTexture(seed = 2): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#e1c9a0';
  ctx.fillRect(0, 0, S, S);
  blotches(ctx, S, S, 60, 'rgba(180,140,95,1)', 20, 90, 0.18, rng);
  blotches(ctx, S, S, 30, 'rgba(250,235,205,1)', 20, 70, 0.2, rng);
  // exposed bricks patches
  for (let i = 0; i < 4; i++) {
    const px = rng() * S;
    const py = rng() * S;
    for (let b = 0; b < 6; b++) {
      ctx.fillStyle = shade('#b9895a', 0.85 + rng() * 0.2);
      ctx.fillRect(px + (b % 3) * 26 + (Math.floor(b / 3) % 2) * 12, py + Math.floor(b / 3) * 14, 24, 12);
    }
  }
  ctx.strokeStyle = 'rgba(90,65,40,0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 12; i++) {
    let x = rng() * S;
    let y = rng() * S;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) {
      x += (rng() - 0.5) * 40;
      y += rng() * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  addNoise(ctx, S, S, 16, rng);
  return toTexture(c);
}

/** Dusty ground. Tile = 4m. */
export function sandFloorTexture(seed = 3): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#c9ab7c';
  ctx.fillRect(0, 0, S, S);
  blotches(ctx, S, S, 70, 'rgba(150,115,75,1)', 20, 80, 0.16, rng);
  blotches(ctx, S, S, 50, 'rgba(235,215,175,1)', 15, 60, 0.16, rng);
  for (let i = 0; i < 500; i++) {
    const g = 100 + rng() * 70;
    ctx.fillStyle = `rgba(${g + 30},${g + 10},${g - 20},0.6)`;
    const s = 1 + rng() * 3;
    ctx.fillRect(rng() * S, rng() * S, s, s);
  }
  addNoise(ctx, S, S, 26, rng);
  return toTexture(c);
}

/** Irregular stone slabs (bombsites / courtyards). Tile = 4m. */
export function stoneTilesTexture(seed = 4): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#8c7353';
  ctx.fillRect(0, 0, S, S);
  const n = 4;
  const cs = S / n;
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const off = j % 2 ? cs / 2 : 0;
      ctx.fillStyle = shade('#c4a67c', 0.85 + rng() * 0.25);
      const x = i * cs + off;
      ctx.fillRect(x + 3, j * cs + 3, cs - 6, cs - 6);
      if (x + cs > S) ctx.fillRect(x + 3 - S, j * cs + 3, cs - 6, cs - 6);
    }
  blotches(ctx, S, S, 50, 'rgba(100,75,45,1)', 15, 60, 0.18, rng);
  addNoise(ctx, S, S, 24, rng);
  return toTexture(c);
}

/** Wooden crate face (UV 0..1 per face). */
export function crateTexture(seed = 5): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#9b6a36';
  ctx.fillRect(0, 0, S, S);
  const planks = 5;
  for (let p = 0; p < planks; p++) {
    ctx.fillStyle = shade('#b07c44', 0.85 + rng() * 0.25);
    ctx.fillRect(0, p * (S / planks) + 1, S, S / planks - 2);
    ctx.strokeStyle = 'rgba(80,45,15,0.35)';
    for (let g = 0; g < 6; g++) {
      ctx.beginPath();
      const y = p * (S / planks) + rng() * (S / planks);
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(S * 0.3, y + (rng() - 0.5) * 6, S * 0.6, y + (rng() - 0.5) * 6, S, y + (rng() - 0.5) * 4);
      ctx.stroke();
    }
  }
  // frame + brace
  ctx.fillStyle = '#6e4520';
  const b = 22;
  ctx.fillRect(0, 0, S, b);
  ctx.fillRect(0, S - b, S, b);
  ctx.fillRect(0, 0, b, S);
  ctx.fillRect(S - b, 0, b, S);
  ctx.save();
  ctx.translate(S / 2, S / 2);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-S * 0.7, -b / 2, S * 1.4, b);
  ctx.restore();
  ctx.fillStyle = '#3b2a1a';
  for (const [x, y] of [
    [b / 2, b / 2],
    [S - b / 2, b / 2],
    [b / 2, S - b / 2],
    [S - b / 2, S - b / 2],
  ])
    ctx.fillRect(x - 3, y - 3, 6, 6);
  addNoise(ctx, S, S, 22, rng);
  return toTexture(c, false);
}

/** Painted wooden door (teal/blue, worn). */
export function doorTexture(seed = 6): THREE.CanvasTexture {
  const W = 256;
  const H = 512;
  const [c, ctx] = makeCanvas(W, H);
  const rng = makeRng(seed);
  ctx.fillStyle = '#2e5a6a';
  ctx.fillRect(0, 0, W, H);
  const n = 6;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = shade('#3f7a8c', 0.85 + rng() * 0.2);
    ctx.fillRect(i * (W / n) + 2, 0, W / n - 4, H);
  }
  // worn paint exposing wood
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(150,105,60,${0.3 + rng() * 0.5})`;
    const w = 4 + rng() * 30;
    const h = 2 + rng() * 14;
    ctx.fillRect(rng() * W, rng() * H, w, h);
  }
  ctx.fillStyle = '#26404a';
  ctx.fillRect(0, 60, W, 18);
  ctx.fillRect(0, H - 80, W, 18);
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < n; i++) {
    ctx.fillRect(i * (W / n) + W / n / 2 - 3, 66, 6, 6);
    ctx.fillRect(i * (W / n) + W / n / 2 - 3, H - 74, 6, 6);
  }
  addNoise(ctx, W, H, 20, rng);
  return toTexture(c, false);
}

/** Corrugated metal (shipping container). Tile = 2m. */
export function containerTexture(seed = 7): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  for (let x = 0; x < S; x++) {
    const v = 0.75 + 0.25 * Math.sin((x / S) * Math.PI * 2 * 10);
    ctx.fillStyle = shade('#2f6a8f', v);
    ctx.fillRect(x, 0, 1, S);
  }
  blotches(ctx, S, S, 30, 'rgba(130,80,40,1)', 5, 30, 0.35, rng);
  addNoise(ctx, S, S, 18, rng);
  return toTexture(c);
}

export function concreteTexture(seed = 8): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#bfb29a';
  ctx.fillRect(0, 0, S, S);
  blotches(ctx, S, S, 30, 'rgba(100,90,70,1)', 10, 40, 0.2, rng);
  addNoise(ctx, S, S, 30, rng);
  return toTexture(c);
}

export function woodBeamTexture(seed = 9): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(seed);
  ctx.fillStyle = '#5a3d22';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = shade('#6d4a2a', 0.8 + rng() * 0.3);
    ctx.fillRect(0, i * 32 + 1, S, 30);
  }
  addNoise(ctx, S, S, 20, rng);
  return toTexture(c);
}

/** Spray-painted bombsite letter with transparent background. */
export function siteLetterTexture(letter: string): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  const rng = makeRng(letter.charCodeAt(0));
  ctx.clearRect(0, 0, S, S);
  ctx.font = 'bold 200px Impact, Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(190,40,30,0.85)';
  ctx.shadowColor = 'rgba(190,40,30,0.7)';
  ctx.shadowBlur = 8;
  ctx.fillText(letter, S / 2, S / 2 + 10);
  // drips + overspray speckles
  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = `rgba(190,40,30,${rng() * 0.4})`;
    const a = rng() * Math.PI * 2;
    const r = 60 + rng() * 60;
    ctx.fillRect(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r, 2, 2);
  }
  const t = toTexture(c, false);
  return t;
}

/** Bullet-hole decal. */
export function bulletHoleTexture(): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = makeCanvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(10,8,5,1)');
  g.addColorStop(0.25, 'rgba(25,20,12,0.95)');
  g.addColorStop(0.5, 'rgba(60,45,30,0.5)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return toTexture(c, false);
}

/** Soft round sprite for particles, muzzle flash and smoke. */
export function softDotTexture(): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = makeCanvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return toTexture(c, false);
}

/** Star-shaped muzzle flash. */
export function muzzleFlashTexture(): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = makeCanvas(S, S);
  ctx.translate(S / 2, S / 2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S / 2);
  g.addColorStop(0, 'rgba(255,255,230,1)');
  g.addColorStop(0.3, 'rgba(255,200,90,0.9)');
  g.addColorStop(1, 'rgba(255,120,20,0)');
  ctx.fillStyle = g;
  for (let i = 0; i < 7; i++) {
    ctx.rotate((Math.PI * 2) / 7);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(S / 2, 0);
    ctx.lineTo(0, 6);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, S / 5, 0, Math.PI * 2);
  ctx.fill();
  return toTexture(c, false);
}
