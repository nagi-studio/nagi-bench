// Procedural canvas textures (no external image files).

import * as THREE from 'three';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function noise(ctx: CanvasRenderingContext2D, size: number, amount: number, seed: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const r = rng(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * amount;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n * 0.9));
  }
  ctx.putImageData(img, 0, 0);
}

function blotches(ctx: CanvasRenderingContext2D, size: number, count: number, color: string, maxR: number, seed: number) {
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = r() * size, y = r() * size, rad = 4 + r() * maxR;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
}

function finish(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

export function sandstoneWall(): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S);
  ctx.fillStyle = '#cfae78';
  ctx.fillRect(0, 0, S, S);
  blotches(ctx, S, 40, 'rgba(160,120,70,0.25)', 40, 3);
  blotches(ctx, S, 30, 'rgba(240,220,180,0.25)', 30, 4);
  // block courses
  const r = rng(11);
  const rowH = 32;
  ctx.strokeStyle = 'rgba(110,80,45,0.55)';
  ctx.lineWidth = 2;
  for (let y = 0; y < S; y += rowH) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(S, y + 0.5);
    ctx.stroke();
    const off = (y / rowH) % 2 === 0 ? 0 : 32;
    for (let x = off; x < S + 64; x += 64) {
      const jx = x + Math.floor((r() - 0.5) * 6);
      ctx.beginPath();
      ctx.moveTo(jx + 0.5, y);
      ctx.lineTo(jx + 0.5, y + rowH);
      ctx.stroke();
      // subtle per-block shade
      ctx.fillStyle = `rgba(${r() > 0.5 ? '255,240,210' : '120,90,50'},${0.05 + r() * 0.08})`;
      ctx.fillRect(jx + 1, y + 1, 63, rowH - 2);
    }
  }
  noise(ctx, S, 26, 5);
  return finish(c);
}

export function floorTexture(kind: number): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S);
  const r = rng(100 + kind);
  if (kind === 1) {
    // stone slabs (bomb sites)
    ctx.fillStyle = '#b9a07a';
    ctx.fillRect(0, 0, S, S);
    const T = 64;
    for (let y = 0; y < S; y += T)
      for (let x = 0; x < S; x += T) {
        const v = 0.85 + r() * 0.25;
        ctx.fillStyle = `rgb(${Math.floor(185 * v)},${Math.floor(160 * v)},${Math.floor(122 * v)})`;
        ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
      }
    blotches(ctx, S, 25, 'rgba(90,70,40,0.18)', 30, 7);
    noise(ctx, S, 22, 8);
  } else if (kind === 2) {
    // concrete (tunnels / catwalk)
    ctx.fillStyle = '#9d907c';
    ctx.fillRect(0, 0, S, S);
    blotches(ctx, S, 50, 'rgba(60,55,45,0.18)', 40, 9);
    blotches(ctx, S, 30, 'rgba(200,190,170,0.15)', 30, 10);
    ctx.strokeStyle = 'rgba(60,50,40,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, S - 2, S - 2);
    noise(ctx, S, 30, 11);
  } else if (kind === 3) {
    // spawn tiles
    ctx.fillStyle = '#a8916c';
    ctx.fillRect(0, 0, S, S);
    const T = 32;
    for (let y = 0; y < S; y += T)
      for (let x = 0; x < S; x += T) {
        const v = ((x + y) / T) % 2 === 0 ? 1 : 0.9;
        ctx.fillStyle = `rgba(${Math.floor(190 * v)},${Math.floor(165 * v)},${Math.floor(125 * v)},1)`;
        ctx.fillRect(x + 1, y + 1, T - 2, T - 2);
      }
    noise(ctx, S, 18, 12);
  } else {
    // packed sand
    ctx.fillStyle = '#c8a874';
    ctx.fillRect(0, 0, S, S);
    blotches(ctx, S, 60, 'rgba(150,115,70,0.25)', 36, 13);
    blotches(ctx, S, 40, 'rgba(235,210,165,0.3)', 28, 14);
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = `rgba(90,70,45,${0.15 + r() * 0.3})`;
      ctx.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2);
    }
    noise(ctx, S, 30, 15);
  }
  return finish(c);
}

export function crateTexture(dark: boolean): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = canvas(S);
  const base = dark ? [92, 70, 44] : [150, 112, 64];
  ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
  ctx.fillRect(0, 0, S, S);
  const r = rng(dark ? 21 : 22);
  for (let y = 0; y < S; y += 16) {
    const v = 0.85 + r() * 0.25;
    ctx.fillStyle = `rgb(${Math.floor(base[0] * v)},${Math.floor(base[1] * v)},${Math.floor(base[2] * v)})`;
    ctx.fillRect(0, y + 1, S, 15);
  }
  ctx.strokeStyle = dark ? '#3a2a18' : '#5c4123';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, S - 10, S - 10);
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(8, 8);
  ctx.lineTo(S - 8, S - 8);
  ctx.stroke();
  noise(ctx, S, 24, 23);
  return finish(c);
}

export function doorTexture(): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = canvas(S);
  ctx.fillStyle = '#4f6f73';
  ctx.fillRect(0, 0, S, S);
  const r = rng(31);
  for (let x = 0; x < S; x += 16) {
    const v = 0.8 + r() * 0.3;
    ctx.fillStyle = `rgb(${Math.floor(79 * v)},${Math.floor(111 * v)},${Math.floor(115 * v)})`;
    ctx.fillRect(x + 1, 0, 14, S);
  }
  blotches(ctx, S, 12, 'rgba(160,130,90,0.35)', 20, 32); // worn paint showing wood
  noise(ctx, S, 26, 33);
  return finish(c);
}

export function metalTexture(): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = canvas(S);
  ctx.fillStyle = '#3d5f86';
  ctx.fillRect(0, 0, S, S);
  for (let x = 0; x < S; x += 12) {
    ctx.fillStyle = 'rgba(20,35,60,0.45)';
    ctx.fillRect(x, 0, 3, S);
    ctx.fillStyle = 'rgba(150,180,210,0.18)';
    ctx.fillRect(x + 4, 0, 2, S);
  }
  blotches(ctx, S, 14, 'rgba(120,70,40,0.4)', 16, 41); // rust
  noise(ctx, S, 20, 42);
  return finish(c);
}

export function letterTexture(text: string, color = 'rgba(40,30,20,0.85)'): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S);
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = color;
  ctx.font = 'bold 200px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, S / 2, S / 2 + 10);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function flashTexture(): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = canvas(S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,230,1)');
  g.addColorStop(0.25, 'rgba(255,210,120,0.95)');
  g.addColorStop(0.6, 'rgba(255,140,40,0.35)');
  g.addColorStop(1, 'rgba(255,100,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  // star spikes
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = 'rgba(255,230,160,0.8)';
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(S / 2, S / 2);
    ctx.lineTo(S / 2 + Math.cos(a) * S * 0.48, S / 2 + Math.sin(a) * S * 0.48);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function glowTexture(): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = canvas(S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
