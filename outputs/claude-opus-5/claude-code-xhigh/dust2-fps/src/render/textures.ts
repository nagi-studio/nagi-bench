/**
 * 程序化贴图：不用任何外部图片，全部用 Canvas 2D 画出来再传给 three。
 * 每种材质画一张可平铺的小图，配合"按世界尺寸缩放 UV"，
 * 整张地图就能保持统一的纹理密度。
 */

import * as THREE from 'three';
import type { SurfaceKind } from '../map/dust2.ts';

const SIZE = 128;

function makeCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

/** 值噪声，用于所有材质的底色扰动。 */
function noise(ctx: CanvasRenderingContext2D, amount: number, scale = 1): void {
  const img = ctx.getImageData(0, 0, SIZE, SIZE);
  const d = img.data;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      // 低频 + 高频两层
      const n =
        (Math.sin(x * 0.21 * scale) * Math.cos(y * 0.17 * scale) * 0.5 + 0.5) * 0.5 +
        Math.random() * 0.5;
      const v = (n - 0.5) * amount;
      d[i] = clamp255(d[i] + v);
      d[i + 1] = clamp255(d[i + 1] + v);
      d[i + 2] = clamp255(d[i + 2] + v);
    }
  }
  ctx.putImageData(img, 0, 0);
}

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

function finish(canvas: HTMLCanvasElement, repeat: number): THREE.Texture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function sandTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#c6a877';
  ctx.fillRect(0, 0, SIZE, SIZE);
  // 碎石点
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * SIZE;
    const y = Math.random() * SIZE;
    const r = Math.random() * 1.6 + 0.3;
    const shade = Math.random() * 60 - 30;
    ctx.fillStyle = `rgba(${150 + shade}, ${128 + shade}, ${92 + shade}, 0.5)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  noise(ctx, 26);
  return finish(canvas, 1);
}

function stoneTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#b3a894';
  ctx.fillRect(0, 0, SIZE, SIZE);
  // 石板缝
  const cell = SIZE / 2;
  ctx.strokeStyle = 'rgba(90,80,64,0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, SIZE);
    ctx.moveTo(0, i * cell);
    ctx.lineTo(SIZE, i * cell);
    ctx.stroke();
  }
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(${140 + Math.random() * 40}, ${130 + Math.random() * 40}, ${
      110 + Math.random() * 30
    }, 0.35)`;
    ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 3, 2);
  }
  noise(ctx, 18);
  return finish(canvas, 1);
}

function wallTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#a9834f';
  ctx.fillRect(0, 0, SIZE, SIZE);
  // 砖块
  const bh = SIZE / 8;
  const bw = SIZE / 4;
  for (let row = 0; row < 8; row++) {
    const offset = (row % 2) * (bw / 2);
    for (let col = -1; col < 4; col++) {
      const x = col * bw + offset;
      const y = row * bh;
      const shade = Math.random() * 34 - 17;
      ctx.fillStyle = `rgb(${176 + shade}, ${140 + shade}, ${92 + shade})`;
      ctx.fillRect(x + 1.5, y + 1.5, bw - 3, bh - 3);
    }
  }
  noise(ctx, 22);
  return finish(canvas, 1);
}

function plasterTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#d5c8ad';
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = `rgba(160,145,120,${Math.random() * 0.25})`;
    ctx.lineWidth = Math.random() * 2;
    ctx.beginPath();
    const x = Math.random() * SIZE;
    const y = Math.random() * SIZE;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 30 - 15, y + Math.random() * 30 - 15);
    ctx.stroke();
  }
  noise(ctx, 16);
  return finish(canvas, 1);
}

function crateTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#9a6836';
  ctx.fillRect(0, 0, SIZE, SIZE);
  // 木板
  const planks = 4;
  const ph = SIZE / planks;
  for (let i = 0; i < planks; i++) {
    const shade = Math.random() * 30 - 15;
    ctx.fillStyle = `rgb(${154 + shade}, ${104 + shade}, ${54 + shade})`;
    ctx.fillRect(0, i * ph + 1, SIZE, ph - 2);
    // 木纹
    for (let g = 0; g < 14; g++) {
      ctx.strokeStyle = `rgba(90,58,28,${Math.random() * 0.35})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const y = i * ph + Math.random() * ph;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(SIZE / 3, y + 3, (SIZE / 3) * 2, y - 3, SIZE, y);
      ctx.stroke();
    }
  }
  // 边框
  ctx.strokeStyle = 'rgba(70,44,20,0.8)';
  ctx.lineWidth = 5;
  ctx.strokeRect(2.5, 2.5, SIZE - 5, SIZE - 5);
  noise(ctx, 14);
  return finish(canvas, 1);
}

function metalTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#5c6a74';
  ctx.fillRect(0, 0, SIZE, SIZE);
  // 竖向拉丝
  for (let x = 0; x < SIZE; x += 2) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.07})`;
    ctx.fillRect(x, 0, 1, SIZE);
  }
  // 铆钉
  for (let y = 8; y < SIZE; y += 30) {
    for (let x = 8; x < SIZE; x += 30) {
      ctx.fillStyle = 'rgba(30,38,44,0.7)';
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(190,200,210,0.35)';
      ctx.beginPath();
      ctx.arc(x - 0.7, y - 0.7, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 锈迹
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(120,70,40,${Math.random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(Math.random() * SIZE, Math.random() * SIZE, Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  noise(ctx, 12);
  return finish(canvas, 1);
}

function concreteTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#9b948a';
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = `rgba(${120 + Math.random() * 60}, ${118 + Math.random() * 55}, ${
      110 + Math.random() * 50
    }, 0.4)`;
    const r = Math.random() * 4;
    ctx.beginPath();
    ctx.arc(Math.random() * SIZE, Math.random() * SIZE, r, 0, Math.PI * 2);
    ctx.fill();
  }
  noise(ctx, 20);
  return finish(canvas, 1);
}

function barrelTexture(): THREE.Texture {
  const { canvas, ctx } = makeCanvas();
  ctx.fillStyle = '#7d5327';
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = 'rgba(50,32,14,0.55)';
  ctx.fillRect(0, SIZE * 0.22, SIZE, 8);
  ctx.fillRect(0, SIZE * 0.68, SIZE, 8);
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(140,90,40,${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * SIZE, Math.random() * SIZE, Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  noise(ctx, 16);
  return finish(canvas, 1);
}

let cache: Record<SurfaceKind, THREE.Texture> | null = null;

export function surfaceTextures(): Record<SurfaceKind, THREE.Texture> {
  if (cache) return cache;
  cache = {
    sand: sandTexture(),
    stone: stoneTexture(),
    wall: wallTexture(),
    plaster: plasterTexture(),
    crate: crateTexture(),
    metal: metalTexture(),
    concrete: concreteTexture(),
    barrel: barrelTexture(),
  };
  return cache;
}

/** 一张上深下浅的天空渐变图。 */
export function skyTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#2f6ea8');
  g.addColorStop(0.45, '#88b4d4');
  g.addColorStop(0.72, '#d9cfae');
  g.addColorStop(1, '#c2a173');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 圆形软光斑，用于枪焰、弹着火花等公告板。 */
export function sparkTexture(r = 255, g = 213, b = 138): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(255,255,255,1)`);
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.85)`);
  grad.addColorStop(0.65, `rgba(${r},${Math.round(g * 0.7)},${Math.round(b * 0.4)},0.35)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 简单的圆形软粒子（白色，靠材质 color 染色）。 */
export function softDotTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}
