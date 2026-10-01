import * as THREE from 'three';

/**
 * Procedural canvas textures (no image files). Every texture is painted at load time with
 * value-noise + simple 2D drawing, then uploaded as a repeating sRGB texture (+ optional bump).
 */

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  return [c, ctx];
}

/** Deterministic lattice hash noise. */
function hash2(x: number, y: number, seed: number): number {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function valueNoise(x: number, y: number, seed: number, period: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const p = (n: number) => ((n % period) + period) % period;
  const a = hash2(p(xi), p(yi), seed);
  const b = hash2(p(xi + 1), p(yi), seed);
  const c = hash2(p(xi), p(yi + 1), seed);
  const d = hash2(p(xi + 1), p(yi + 1), seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Tileable fractal noise in [0,1] for pixel (x,y) of a size x size texture. */
function fbm(x: number, y: number, size: number, baseCells: number, octaves: number, seed: number): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let cells = baseCells;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise((x / size) * cells, (y / size) * cells, seed + o * 17, cells);
    norm += amp;
    amp *= 0.5;
    cells *= 2;
  }
  return sum / norm;
}

/** Applies per-pixel grain/variation over whatever was drawn. */
function grain(ctx: CanvasRenderingContext2D, size: number, strength: number, baseCells: number, seed: number, speck = 0.0): void {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x, y, size, baseCells, 4, seed) - 0.5;
      let m = 1 + n * strength;
      if (speck > 0) {
        const s = hash2(x, y, seed + 99);
        if (s < speck) m *= 0.78;
        else if (s > 1 - speck) m *= 1.12;
      }
      d[i] = Math.min(255, d[i] * m);
      d[i + 1] = Math.min(255, d[i + 1] * m);
      d[i + 2] = Math.min(255, d[i + 2] * m);
    }
  }
  ctx.putImageData(img, 0, 0);
}

function toTexture(canvas: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}

/** Grayscale bump map from the luminance of a color canvas (with optional contrast). */
function bumpFrom(src: HTMLCanvasElement, contrast = 1.4): THREE.CanvasTexture {
  const size = src.width;
  const [c, ctx] = makeCanvas(size, src.height);
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, size, src.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    let l = (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255;
    l = Math.min(1, Math.max(0, (l - 0.5) * contrast + 0.5));
    d[i] = d[i + 1] = d[i + 2] = l * 255;
  }
  ctx.putImageData(img, 0, 0);
  return toTexture(c, false);
}

// ------------------------------------------------------------------------------------------

function sandstoneBlocks(seed: number, base: [number, number, number], mortar: string): HTMLCanvasElement {
  const S = 512; // 4 m
  const [c, ctx] = makeCanvas(S, S);
  ctx.fillStyle = mortar;
  ctx.fillRect(0, 0, S, S);
  const rowH = 64; // 0.5 m courses
  let r = seed;
  const rnd = () => {
    r = (r * 16807) % 2147483647;
    return r / 2147483647;
  };
  for (let row = 0; row < S / rowH; row++) {
    let x = -Math.floor(rnd() * 120);
    while (x < S) {
      const w = 70 + Math.floor(rnd() * 110);
      const shade = 0.9 + rnd() * 0.2;
      const [br, bg, bb] = base;
      ctx.fillStyle = `rgb(${Math.min(255, br * shade)},${Math.min(255, bg * shade)},${Math.min(255, bb * shade)})`;
      const y = row * rowH;
      const drawBlock = (bx: number) => {
        ctx.fillRect(bx + 2, y + 2, w - 3, rowH - 3);
        // soft bevel highlights
        ctx.fillStyle = 'rgba(255,240,210,0.10)';
        ctx.fillRect(bx + 2, y + 2, w - 3, 3);
        ctx.fillStyle = 'rgba(60,40,20,0.12)';
        ctx.fillRect(bx + 2, y + rowH - 5, w - 3, 3);
        ctx.fillStyle = `rgb(${Math.min(255, br * shade)},${Math.min(255, bg * shade)},${Math.min(255, bb * shade)})`;
      };
      drawBlock(x);
      if (x + w > S) drawBlock(x - S);
      if (x < 0) drawBlock(x + S);
      x += w;
    }
  }
  // erosion pits & cracks
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(90,62,30,${0.08 + rnd() * 0.12})`;
    ctx.beginPath();
    ctx.ellipse(rnd() * S, rnd() * S, 2 + rnd() * 9, 1 + rnd() * 5, rnd() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(80,55,30,0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    let px = rnd() * S;
    let py = rnd() * S;
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (let k = 0; k < 6; k++) {
      px += (rnd() - 0.5) * 30;
      py += rnd() * 18;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  grain(ctx, S, 0.28, 8, seed, 0.02);
  return c;
}

function plasterWall(seed: number): HTMLCanvasElement {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  const d = img.data;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x, y, S, 4, 5, seed);
      const stain = fbm(x, y, S, 2, 3, seed + 50);
      const v = 0.86 + (n - 0.5) * 0.25 - Math.max(0, stain - 0.6) * 0.4;
      const i = (y * S + x) * 4;
      d[i] = 222 * v;
      d[i + 1] = 196 * v;
      d[i + 2] = 152 * v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // exposed bricks where plaster fell off
  let r = seed;
  const rnd = () => {
    r = (r * 48271) % 2147483647;
    return r / 2147483647;
  };
  for (let p = 0; p < 4; p++) {
    const px = rnd() * S;
    const py = rnd() * S;
    for (let k = 0; k < 7; k++) {
      ctx.fillStyle = `rgba(${150 + rnd() * 30},${105 + rnd() * 20},${70},0.85)`;
      ctx.fillRect(px + (k % 3) * 22 - 20, py + Math.floor(k / 3) * 12, 20, 10);
    }
  }
  grain(ctx, S, 0.12, 16, seed + 3, 0.015);
  return c;
}

function sandFloor(seed: number): HTMLCanvasElement {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  const d = img.data;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x, y, S, 6, 5, seed);
      const m = fbm(x, y, S, 2, 3, seed + 9);
      const v = 0.82 + (n - 0.5) * 0.3 + (m - 0.5) * 0.15;
      const i = (y * S + x) * 4;
      d[i] = 214 * v;
      d[i + 1] = 182 * v;
      d[i + 2] = 132 * v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  let r = seed;
  const rnd = () => {
    r = (r * 16807) % 2147483647;
    return r / 2147483647;
  };
  for (let i = 0; i < 260; i++) {
    const g = 120 + rnd() * 80;
    ctx.fillStyle = `rgba(${g},${g * 0.85},${g * 0.65},0.55)`;
    ctx.beginPath();
    ctx.arc(rnd() * S, rnd() * S, 0.8 + rnd() * 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  grain(ctx, S, 0.1, 32, seed + 1, 0.04);
  return c;
}

function flagstones(seed: number, base: [number, number, number], small: boolean): HTMLCanvasElement {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  ctx.fillStyle = '#7d6a4f';
  ctx.fillRect(0, 0, S, S);
  let r = seed;
  const rnd = () => {
    r = (r * 16807) % 2147483647;
    return r / 2147483647;
  };
  const cell = small ? 42 : 96;
  for (let y = 0; y < S; y += cell) {
    const off = (Math.floor(y / cell) % 2) * (cell / 2);
    for (let x = -cell; x < S + cell; x += cell) {
      const shade = 0.82 + rnd() * 0.26;
      const [br, bg, bb] = base;
      ctx.fillStyle = `rgb(${br * shade},${bg * shade},${bb * shade})`;
      const jx = (rnd() - 0.5) * 4;
      const jy = (rnd() - 0.5) * 4;
      const bx = x + off + jx + 3;
      const by = y + jy + 3;
      ctx.fillRect(bx, by, cell - 6, cell - 6);
      if (bx + cell > S) ctx.fillRect(bx - S, by, cell - 6, cell - 6);
      ctx.fillStyle = 'rgba(255,245,220,0.08)';
      ctx.fillRect(bx, by, cell - 6, 2);
    }
  }
  grain(ctx, S, 0.2, 16, seed, 0.03);
  return c;
}

function concrete(seed: number): HTMLCanvasElement {
  const S = 512;
  const [c, ctx] = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  const d = img.data;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x, y, S, 8, 5, seed);
      const v = 0.78 + (n - 0.5) * 0.28;
      const i = (y * S + x) * 4;
      d[i] = 178 * v;
      d[i + 1] = 166 * v;
      d[i + 2] = 146 * v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  ctx.strokeStyle = 'rgba(70,60,48,0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 256);
    ctx.lineTo(S, i * 256);
    ctx.moveTo(i * 256, 0);
    ctx.lineTo(i * 256, S);
    ctx.stroke();
  }
  grain(ctx, S, 0.1, 32, seed + 2, 0.05);
  return c;
}

function crateFace(): HTMLCanvasElement {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  ctx.fillStyle = '#9a6a35';
  ctx.fillRect(0, 0, S, S);
  // planks
  for (let i = 0; i < 6; i++) {
    const shade = 0.85 + ((i * 37) % 10) / 40;
    ctx.fillStyle = `rgb(${158 * shade},${110 * shade},${58 * shade})`;
    ctx.fillRect(0, i * (S / 6) + 1, S, S / 6 - 2);
    ctx.fillStyle = 'rgba(60,35,15,0.5)';
    ctx.fillRect(0, i * (S / 6), S, 2);
  }
  // frame
  ctx.fillStyle = '#7a4f24';
  const f = 26;
  ctx.fillRect(0, 0, S, f);
  ctx.fillRect(0, S - f, S, f);
  ctx.fillRect(0, 0, f, S);
  ctx.fillRect(S - f, 0, f, S);
  // diagonal brace
  ctx.save();
  ctx.translate(S / 2, S / 2);
  ctx.rotate(-Math.PI / 4);
  ctx.fillRect(-S * 0.7, -f / 2, S * 1.4, f);
  ctx.restore();
  ctx.strokeStyle = 'rgba(40,22,8,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, S - 2, S - 2);
  ctx.strokeRect(f, f, S - 2 * f, S - 2 * f);
  // nails
  ctx.fillStyle = '#3a3a3a';
  for (const [x, y] of [
    [12, 12],
    [S - 12, 12],
    [12, S - 12],
    [S - 12, S - 12],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  grain(ctx, S, 0.25, 8, 77, 0.03);
  return c;
}

function paintedDoor(): HTMLCanvasElement {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  for (let i = 0; i < 8; i++) {
    const shade = 0.88 + ((i * 53) % 12) / 50;
    ctx.fillStyle = `rgb(${46 * shade},${110 * shade},${128 * shade})`;
    ctx.fillRect(i * 32, 0, 31, S);
    ctx.fillStyle = 'rgba(20,40,40,0.5)';
    ctx.fillRect(i * 32 + 31, 0, 1, S);
  }
  // peeling paint revealing wood
  let r = 31;
  const rnd = () => {
    r = (r * 16807) % 2147483647;
    return r / 2147483647;
  };
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${130 + rnd() * 30},${90 + rnd() * 20},50,0.9)`;
    ctx.beginPath();
    ctx.ellipse(rnd() * S, rnd() * S, 2 + rnd() * 10, 1 + rnd() * 4, rnd() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(30,30,30,0.85)';
  ctx.fillRect(0, 40, S, 10);
  ctx.fillRect(0, S - 50, S, 10);
  grain(ctx, S, 0.2, 8, 5, 0.03);
  return c;
}

function corrugated(): HTMLCanvasElement {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  for (let x = 0; x < S; x++) {
    const v = 0.75 + 0.25 * Math.sin((x / S) * Math.PI * 2 * 16);
    ctx.fillStyle = `rgb(${50 * v},${86 * v},${132 * v})`;
    ctx.fillRect(x, 0, 1, S);
  }
  ctx.fillStyle = 'rgba(120,70,30,0.35)';
  let r = 9;
  const rnd = () => {
    r = (r * 16807) % 2147483647;
    return r / 2147483647;
  };
  for (let i = 0; i < 50; i++) ctx.fillRect(rnd() * S, rnd() * S, 3 + rnd() * 12, 1 + rnd() * 20);
  grain(ctx, S, 0.2, 8, 12, 0.02);
  return c;
}

function darkWood(): HTMLCanvasElement {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  for (let i = 0; i < 8; i++) {
    const shade = 0.75 + ((i * 29) % 10) / 30;
    ctx.fillStyle = `rgb(${92 * shade},${64 * shade},${40 * shade})`;
    ctx.fillRect(0, i * 32, S, 31);
    ctx.fillStyle = 'rgba(20,12,6,0.7)';
    ctx.fillRect(0, i * 32 + 31, S, 1);
  }
  grain(ctx, S, 0.3, 16, 44, 0.04);
  return c;
}

/** Painted site letter decal (white paint, worn). */
export function siteLetterTexture(letter: string): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = makeCanvas(S, S);
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = 'rgba(245,240,230,0.92)';
  ctx.font = 'bold 200px Arial Black, Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, S / 2, S / 2 + 10);
  // wear
  const img = ctx.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const x = (i / 4) % S;
    const y = Math.floor(i / 4 / S);
    if (fbm(x, y, S, 16, 3, 5) < 0.38) img.data[i + 3] *= 0.3;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Soft radial sprite (particles, flashes). */
export function radialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)'): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = makeCanvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Star-shaped muzzle flash sprite. */
export function muzzleFlashTexture(): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = makeCanvas(S, S);
  ctx.translate(S / 2, S / 2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S / 2);
  g.addColorStop(0, 'rgba(255,255,230,1)');
  g.addColorStop(0.25, 'rgba(255,210,120,0.95)');
  g.addColorStop(0.6, 'rgba(255,140,40,0.4)');
  g.addColorStop(1, 'rgba(255,100,20,0)');
  ctx.fillStyle = g;
  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(S / 2, 0);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, S / 5, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Bullet hole decal. */
export function bulletHoleTexture(): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = makeCanvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(10,8,6,1)');
  g.addColorStop(0.3, 'rgba(25,18,12,0.95)');
  g.addColorStop(0.55, 'rgba(60,45,30,0.5)');
  g.addColorStop(1, 'rgba(60,45,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface MaterialSet {
  wall: THREE.MeshStandardMaterial;
  wallAlt: THREE.MeshStandardMaterial;
  wallTop: THREE.MeshStandardMaterial;
  floorSand: THREE.MeshStandardMaterial;
  floorTiles: THREE.MeshStandardMaterial;
  floorStone: THREE.MeshStandardMaterial;
  floorConcrete: THREE.MeshStandardMaterial;
  crate: THREE.MeshStandardMaterial;
  door: THREE.MeshStandardMaterial;
  doorLeaf: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  trim: THREE.MeshStandardMaterial;
}

let cached: MaterialSet | null = null;

/** Build (once) the full procedural material set used by the level. */
export function getMaterials(): MaterialSet {
  if (cached) return cached;
  const wallC = sandstoneBlocks(11, [214, 182, 128], '#a88a5c');
  const wallAltC = plasterWall(23);
  const sandC = sandFloor(5);
  const tilesC = flagstones(8, [196, 170, 126], false);
  const stoneC = flagstones(13, [186, 160, 118], true);
  const concreteC = concrete(17);
  const crateC = crateFace();
  const doorC = paintedDoor();
  const metalC = corrugated();
  const woodC = darkWood();
  const std = (canvas: HTMLCanvasElement, rough: number, bump: number, metal = 0) =>
    new THREE.MeshStandardMaterial({
      map: toTexture(canvas),
      bumpMap: bump > 0 ? bumpFrom(canvas) : null,
      bumpScale: bump,
      roughness: rough,
      metalness: metal,
      vertexColors: true,
    });
  cached = {
    wall: std(wallC, 0.92, 2.2),
    wallAlt: std(wallAltC, 0.95, 1.2),
    wallTop: new THREE.MeshStandardMaterial({ color: 0xc9ab7b, roughness: 0.95, vertexColors: true }),
    floorSand: std(sandC, 0.97, 0.8),
    floorTiles: std(tilesC, 0.9, 2),
    floorStone: std(stoneC, 0.9, 2),
    floorConcrete: std(concreteC, 0.92, 0.8),
    crate: std(crateC, 0.85, 1.5),
    door: std(doorC, 0.75, 1.2),
    doorLeaf: new THREE.MeshStandardMaterial({ map: toTexture(doorC), roughness: 0.75 }),
    metal: std(metalC, 0.55, 2.5, 0.45),
    wood: std(woodC, 0.85, 1.2),
    trim: new THREE.MeshStandardMaterial({ color: 0x8e7350, roughness: 0.9, vertexColors: true }),
  };
  return cached;
}
