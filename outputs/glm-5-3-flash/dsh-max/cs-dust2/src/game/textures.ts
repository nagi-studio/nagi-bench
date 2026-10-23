/**
 * textures.ts — every texture is painted at runtime into a <canvas>
 * (procedural, zero external asset files).
 */

import * as THREE from 'three';

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function noise(ctx: CanvasRenderingContext2D, size: number, amount: number, alpha: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    d[i + 3] = Math.min(255, d[i + 3] * alpha + 255 * (1 - alpha));
  }
  ctx.putImageData(img, 0, 0);
}

function tex(c: HTMLCanvasElement, repeat = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.anisotropy = 4;
  return t;
}

/** sandy stucco wall (dust2 signature) */
export function sandTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(256);
  ctx.fillStyle = '#c8ac7c';
  ctx.fillRect(0, 0, 256, 256);
  // horizontal banding
  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.04})`;
    ctx.fillRect(0, y, 256, 2);
  }
  // blotches
  for (let i = 0; i < 220; i++) {
    const r = 4 + Math.random() * 22;
    ctx.fillStyle = `rgba(${120 + Math.random() * 60 | 0},${95 + Math.random() * 50 | 0},${55 + Math.random() * 40 | 0},${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // cracks
  ctx.strokeStyle = 'rgba(90,70,45,0.35)';
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    let x = Math.random() * 256, y = Math.random() * 256;
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) { x += (Math.random() - 0.5) * 40; y += Math.random() * 26; ctx.lineTo(x, y); }
    ctx.lineWidth = 0.6 + Math.random();
    ctx.stroke();
  }
  noise(ctx, 256, 26, 1);
  return tex(c);
}

/** dusty ground */
export function groundTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(256);
  ctx.fillStyle = '#a8905f';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) {
    const r = 1 + Math.random() * 3.5;
    const g = 150 + Math.random() * 70 | 0;
    ctx.fillStyle = `rgba(${g},${g - 25},${g - 60 | 0},${0.12 + Math.random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = `rgba(90,72,45,${0.08 + Math.random() * 0.14})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    const x = Math.random() * 256, y = Math.random() * 256;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60);
    ctx.stroke();
  }
  noise(ctx, 256, 20, 1);
  return tex(c);
}

/** wooden crate */
export function crateTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(256);
  ctx.fillStyle = '#9a7443';
  ctx.fillRect(0, 0, 256, 256);
  // planks
  for (let y = 0; y < 256; y += 32) {
    ctx.fillStyle = `rgba(${120 + Math.random() * 50 | 0},${85 + Math.random() * 35 | 0},${45 + Math.random() * 20 | 0},0.55)`;
    ctx.fillRect(0, y, 256, 30);
    ctx.strokeStyle = 'rgba(60,40,20,0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-2, y, 260, 30);
    for (let i = 0; i < 20; i++) {
      ctx.strokeStyle = `rgba(70,48,22,${0.1 + Math.random() * 0.2})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const yy = y + Math.random() * 30;
      ctx.moveTo(0, yy);
      ctx.bezierCurveTo(80, yy + Math.random() * 6 - 3, 170, yy + Math.random() * 6 - 3, 256, yy);
      ctx.stroke();
    }
  }
  // frame + brace
  ctx.strokeStyle = 'rgba(70,48,22,0.85)';
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, 240, 240);
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(16, 16); ctx.lineTo(240, 240); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(240, 16); ctx.lineTo(16, 240); ctx.stroke();
  noise(ctx, 256, 22, 1);
  return tex(c);
}

/** rusty metal (barrels, doors) */
export function metalTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(128);
  ctx.fillStyle = '#5c6a5a';
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = `rgba(${110 + Math.random() * 60 | 0},${70 + Math.random() * 40 | 0},${30 + Math.random() * 20 | 0},${0.1 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 128, Math.random() * 128, 2 + Math.random() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(30,34,30,0.5)';
  for (let y = 16; y < 128; y += 32) ctx.fillRect(0, y, 128, 4);
  noise(ctx, 128, 18, 1);
  return tex(c);
}

/** bombsite ground marker */
export function siteMarkerTexture(letter: string): THREE.CanvasTexture {
  const [c, ctx] = canvas(256);
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(235,225,190,0.85)';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 228, 228);
  ctx.font = 'bold 190px "Arial Black", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(235,225,190,0.8)';
  ctx.fillText(letter, 128, 138);
  return tex(c, false);
}

/** sky gradient */
export function skyTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(256);
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#3f74b8');
  g.addColorStop(0.42, '#8fbede');
  g.addColorStop(0.62, '#dcd2b4');
  g.addColorStop(1, '#c2a678');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  // soft clouds
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * 256, y = Math.random() * 90 + 20;
    const r = 12 + Math.random() * 30;
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
