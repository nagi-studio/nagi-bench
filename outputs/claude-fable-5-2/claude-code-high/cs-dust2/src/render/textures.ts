// Every texture in the game is painted at runtime onto a canvas — no image files.

import * as THREE from 'three';
import { RNG } from '../sim/math';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  return [c, ctx];
}

function toTexture(c: HTMLCanvasElement, repeat = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  }
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/** Per-pixel brightness noise over the whole canvas. */
function speckle(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, rng: RNG): void {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng.next() - 0.5) * amount;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
}

function stains(ctx: CanvasRenderingContext2D, w: number, h: number, count: number, rng: RNG, dark = true): void {
  for (let i = 0; i < count; i++) {
    const x = rng.next() * w;
    const y = rng.next() * h;
    const r = 10 + rng.next() * 50;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const a = 0.04 + rng.next() * 0.08;
    g.addColorStop(0, dark ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    // draw wrapped so the texture tiles
    for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) ctx.fillRect(x - r + ox, y - r + oy, r * 2, r * 2);
  }
}

function concrete(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(11);
  ctx.fillStyle = '#d9d9d6';
  ctx.fillRect(0, 0, S, S);
  stains(ctx, S, S, 26, rng, true);
  stains(ctx, S, S, 10, rng, false);
  speckle(ctx, S, S, 26, rng);
  // formwork seams
  ctx.strokeStyle = 'rgba(0,0,0,0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, S - 2, S - 2);
  ctx.beginPath();
  ctx.moveTo(0, S / 2);
  ctx.lineTo(S, S / 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (const [x, y] of [
    [20, 20],
    [S - 20, 20],
    [20, S / 2 + 20],
    [S - 20, S / 2 + 20],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return toTexture(c);
}

function brick(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(23);
  ctx.fillStyle = '#b9b3a8';
  ctx.fillRect(0, 0, S, S);
  const bw = 64;
  const bh = 32;
  for (let row = 0; row < S / bh; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let col = -1; col < S / bw + 1; col++) {
      const v = 205 + Math.floor(rng.next() * 40);
      const r = v;
      const g = v - 12 - Math.floor(rng.next() * 14);
      const b = v - 22 - Math.floor(rng.next() * 16);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(col * bw + off + 2, row * bh + 2, bw - 4, bh - 4);
    }
  }
  speckle(ctx, S, S, 22, rng);
  return toTexture(c);
}

function corrugated(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(37);
  const ribs = 8;
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const ph = ((x / S) * ribs) % 1;
      // trapezoid rib profile: bright flat, dark valley
      const wave = Math.sin(ph * Math.PI * 2);
      const v = 205 + wave * 38 + (wave > 0.85 ? 10 : 0);
      const i = (y * S + x) * 4;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // rust streaks and grime
  for (let i = 0; i < 26; i++) {
    const x = rng.next() * S;
    const y = rng.next() * S;
    const len = 20 + rng.next() * 90;
    const g = ctx.createLinearGradient(0, y, 0, y + len);
    g.addColorStop(0, `rgba(90,50,20,${0.1 + rng.next() * 0.14})`);
    g.addColorStop(1, 'rgba(90,50,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, 2 + rng.next() * 5, len);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(0, 0, S, 3);
  ctx.fillRect(0, S - 3, S, 3);
  speckle(ctx, S, S, 14, rng);
  return toTexture(c);
}

function crate(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(51);
  ctx.fillStyle = '#e6d2a8';
  ctx.fillRect(0, 0, S, S);
  // planks
  const planks = 6;
  for (let i = 0; i < planks; i++) {
    const v = 0.9 + rng.next() * 0.16;
    ctx.fillStyle = `rgb(${Math.floor(232 * v)},${Math.floor(210 * v)},${Math.floor(166 * v)})`;
    ctx.fillRect(0, (i * S) / planks, S, S / planks - 2);
    // grain
    ctx.strokeStyle = 'rgba(110,70,30,0.18)';
    ctx.lineWidth = 1;
    for (let k = 0; k < 5; k++) {
      const y = (i * S) / planks + 4 + rng.next() * (S / planks - 10);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(S * 0.3, y + rng.range(-4, 4), S * 0.6, y + rng.range(-4, 4), S, y + rng.range(-3, 3));
      ctx.stroke();
    }
  }
  // frame and cross brace
  ctx.fillStyle = '#b89462';
  const f = 26;
  ctx.fillRect(0, 0, S, f);
  ctx.fillRect(0, S - f, S, f);
  ctx.fillRect(0, 0, f, S);
  ctx.fillRect(S - f, 0, f, S);
  ctx.save();
  ctx.translate(S / 2, S / 2);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-S * 0.62, -f / 2, S * 1.24, f);
  ctx.restore();
  ctx.strokeStyle = 'rgba(60,35,10,0.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(f, f, S - f * 2, S - f * 2);
  ctx.strokeRect(1, 1, S - 2, S - 2);
  ctx.fillStyle = 'rgba(40,30,20,0.7)';
  for (const [x, y] of [
    [13, 13],
    [S - 13, 13],
    [13, S - 13],
    [S - 13, S - 13],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  speckle(ctx, S, S, 18, rng);
  return toTexture(c);
}

function metal(): THREE.Texture {
  const S = 128;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(67);
  ctx.fillStyle = '#d2d4d6';
  ctx.fillRect(0, 0, S, S);
  stains(ctx, S, S, 10, rng, true);
  speckle(ctx, S, S, 20, rng);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, S - 4, S - 4);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (const [x, y] of [
    [10, 10],
    [S - 10, 10],
    [10, S - 10],
    [S - 10, S - 10],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  return toTexture(c);
}

function plain(): THREE.Texture {
  const [c, ctx] = canvas(4, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 4, 4);
  return toTexture(c);
}

function asphalt(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(71);
  ctx.fillStyle = '#5b5e62';
  ctx.fillRect(0, 0, S, S);
  stains(ctx, S, S, 24, rng, true);
  stains(ctx, S, S, 12, rng, false);
  speckle(ctx, S, S, 34, rng);
  // cracks
  ctx.strokeStyle = 'rgba(20,20,22,0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    let x = rng.next() * S;
    let y = rng.next() * S;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let k = 0; k < 7; k++) {
      x += rng.range(-22, 22);
      y += rng.range(6, 24);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return toTexture(c);
}

function floorConcrete(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(83);
  ctx.fillStyle = '#a7a8a4';
  ctx.fillRect(0, 0, S, S);
  stains(ctx, S, S, 22, rng, true);
  stains(ctx, S, S, 12, rng, false);
  speckle(ctx, S, S, 22, rng);
  ctx.strokeStyle = 'rgba(40,40,40,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, S, S);
  return toTexture(c);
}

function interiorFloor(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(89);
  ctx.fillStyle = '#7d7f80';
  ctx.fillRect(0, 0, S, S);
  stains(ctx, S, S, 30, rng, true);
  speckle(ctx, S, S, 16, rng);
  ctx.strokeStyle = 'rgba(30,30,30,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, S, S);
  ctx.beginPath();
  ctx.moveTo(S / 2, 0);
  ctx.lineTo(S / 2, S);
  ctx.moveTo(0, S / 2);
  ctx.lineTo(S, S / 2);
  ctx.stroke();
  return toTexture(c);
}

function dock(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(97);
  ctx.fillStyle = '#8f8c84';
  ctx.fillRect(0, 0, S, S);
  // large paving slabs with a painted yellow edge line feel
  const n = 2;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = 138 + Math.floor(rng.next() * 22);
      ctx.fillStyle = `rgb(${v + 6},${v + 3},${v - 4})`;
      ctx.fillRect((i * S) / n + 2, (j * S) / n + 2, S / n - 4, S / n - 4);
    }
  }
  stains(ctx, S, S, 20, rng, true);
  speckle(ctx, S, S, 26, rng);
  return toTexture(c);
}

function gravel(): THREE.Texture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const rng = new RNG(101);
  ctx.fillStyle = '#847a6c';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 2600; i++) {
    const v = 95 + Math.floor(rng.next() * 90);
    ctx.fillStyle = `rgb(${v + 8},${v},${v - 12})`;
    const x = rng.next() * S;
    const y = rng.next() * S;
    const r = 1 + rng.next() * 2.6;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  stains(ctx, S, S, 14, rng, true);
  speckle(ctx, S, S, 20, rng);
  return toTexture(c);
}

/** `sunU` is the equirect U coordinate of the sun: atan2(dir.z, dir.x) / 2PI + 0.5. */
function sky(sunU: number, sunPitch: number): THREE.Texture {
  const W = 2048;
  const H = 1024;
  const [c, ctx] = canvas(W, H);
  const rng = new RNG(5);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2f6fb8');
  g.addColorStop(0.3, '#5c9bd6');
  g.addColorStop(0.47, '#b9d6ea');
  g.addColorStop(0.5, '#e6ded0');
  g.addColorStop(0.52, '#9fb4bf');
  g.addColorStop(1, '#6f8794');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const sx = ((sunU % 1) + 1) % 1;
  const sy = 0.5 - sunPitch / Math.PI;
  for (const ox of [-W, 0, W]) {
    const x = sx * W + ox;
    const y = sy * H;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 260);
    glow.addColorStop(0, 'rgba(255,250,225,1)');
    glow.addColorStop(0.06, 'rgba(255,244,200,0.95)');
    glow.addColorStop(0.2, 'rgba(255,236,180,0.3)');
    glow.addColorStop(1, 'rgba(255,236,180,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 260, y - 260, 520, 520);
  }
  // soft clouds
  for (let i = 0; i < 46; i++) {
    const cx = rng.next() * W;
    const cy = H * (0.2 + rng.next() * 0.24);
    const blobs = 5 + Math.floor(rng.next() * 6);
    for (let k = 0; k < blobs; k++) {
      const x = cx + rng.range(-90, 90);
      const y = cy + rng.range(-12, 12);
      const r = 26 + rng.next() * 60;
      for (const ox of [-W, 0, W]) {
        const cg = ctx.createRadialGradient(x + ox, y, 0, x + ox, y, r);
        cg.addColorStop(0, 'rgba(255,255,255,0.2)');
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.save();
        ctx.translate(x + ox, y);
        ctx.scale(1.8, 0.55);
        ctx.translate(-(x + ox), -y);
        ctx.fillRect(x + ox - r, y - r, r * 2, r * 2);
        ctx.restore();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.needsUpdate = true;
  return t;
}

function softDot(): THREE.Texture {
  const S = 64;
  const [c, ctx] = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return toTexture(c, false);
}

function muzzleFlash(): THREE.Texture {
  const S = 128;
  const [c, ctx] = canvas(S, S);
  ctx.translate(S / 2, S / 2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S / 2);
  g.addColorStop(0, 'rgba(255,255,235,1)');
  g.addColorStop(0.25, 'rgba(255,220,120,0.9)');
  g.addColorStop(0.6, 'rgba(255,150,40,0.35)');
  g.addColorStop(1, 'rgba(255,120,20,0)');
  ctx.fillStyle = g;
  // star-shaped burst
  ctx.beginPath();
  const spikes = 7;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? S * 0.5 : S * 0.16;
    const a = (i / (spikes * 2)) * Math.PI * 2;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, S * 0.2, 0, Math.PI * 2);
  ctx.fill();
  return toTexture(c, false);
}

function bulletHole(): THREE.Texture {
  const S = 64;
  const [c, ctx] = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(10,10,10,0.95)');
  g.addColorStop(0.3, 'rgba(25,22,20,0.85)');
  g.addColorStop(0.55, 'rgba(60,55,50,0.35)');
  g.addColorStop(1, 'rgba(60,55,50,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return toTexture(c, false);
}

function siteDecal(letter: string): THREE.Texture {
  const S = 512;
  const [c, ctx] = canvas(S, S);
  ctx.clearRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(240,200,60,0.85)';
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([36, 26]);
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 70, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(240,200,60,0.9)';
  ctx.font = 'bold 300px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, S / 2, S / 2 + 16);
  // worn paint
  const rng = new RNG(letter.charCodeAt(0));
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.3 + rng.next() * 0.5})`;
    ctx.fillRect(rng.next() * S, rng.next() * S, 2 + rng.next() * 7, 2 + rng.next() * 5);
  }
  ctx.globalCompositeOperation = 'source-over';
  return toTexture(c, false);
}

export function nameTag(text: string, color: string): THREE.Texture {
  const [c, ctx] = canvas(256, 64);
  ctx.clearRect(0, 0, 256, 64);
  ctx.font = 'bold 34px "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,0.75)';
  ctx.strokeText(text, 128, 34);
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 34);
  return toTexture(c, false);
}

export interface TextureSet {
  concrete: THREE.Texture;
  brick: THREE.Texture;
  corrugated: THREE.Texture;
  crate: THREE.Texture;
  metal: THREE.Texture;
  plain: THREE.Texture;
  asphalt: THREE.Texture;
  floorConcrete: THREE.Texture;
  interiorFloor: THREE.Texture;
  dock: THREE.Texture;
  gravel: THREE.Texture;
  sky: THREE.Texture;
  softDot: THREE.Texture;
  muzzleFlash: THREE.Texture;
  bulletHole: THREE.Texture;
  siteA: THREE.Texture;
  siteB: THREE.Texture;
}

export function createTextures(sunU: number, sunPitch: number): TextureSet {
  return {
    concrete: concrete(),
    brick: brick(),
    corrugated: corrugated(),
    crate: crate(),
    metal: metal(),
    plain: plain(),
    asphalt: asphalt(),
    floorConcrete: floorConcrete(),
    interiorFloor: interiorFloor(),
    dock: dock(),
    gravel: gravel(),
    sky: sky(sunU, sunPitch),
    softDot: softDot(),
    muzzleFlash: muzzleFlash(),
    bulletHole: bulletHole(),
    siteA: siteDecal('A'),
    siteB: siteDecal('B'),
  };
}

export function disposeTextures(t: TextureSet): void {
  for (const k of Object.keys(t) as (keyof TextureSet)[]) t[k].dispose();
}
