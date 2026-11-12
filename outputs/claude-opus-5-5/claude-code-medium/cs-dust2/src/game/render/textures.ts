// Procedurally painted canvas textures (no external image assets).
import * as THREE from 'three';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function addNoise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function finish(c: HTMLCanvasElement, repeat = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export function sandstoneTexture(): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = '#cfae7f';
  ctx.fillRect(0, 0, S, S);
  const rowH = 32;
  for (let y = 0; y < S; y += rowH) {
    const off = (y / rowH) % 2 ? 0 : 40;
    for (let x = -80; x < S + 80; x += 80) {
      const l = rnd(-14, 14);
      ctx.fillStyle = `rgb(${207 + l},${174 + l},${127 + l * 0.8})`;
      ctx.fillRect(x + off + 2, y + 2, 76, rowH - 3);
    }
    ctx.fillStyle = 'rgba(110,80,45,0.45)';
    ctx.fillRect(0, y, S, 2);
    for (let x = -80; x < S + 80; x += 80) ctx.fillRect(x + off, y, 2, rowH);
  }
  // weathering streaks
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(120,90,50,${rnd(0.03, 0.09)})`;
    ctx.fillRect(rnd(0, S), rnd(0, S), rnd(2, 6), rnd(20, 80));
  }
  addNoise(ctx, S, S, 22);
  return finish(c);
}

export function plasterTexture(): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = '#d9c4a0';
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(${rnd(150, 200)},${rnd(120, 160)},${rnd(80, 110)},${rnd(0.05, 0.15)})`;
    ctx.beginPath();
    ctx.arc(rnd(0, S), rnd(0, S), rnd(6, 40), 0, Math.PI * 2);
    ctx.fill();
  }
  addNoise(ctx, S, S, 18);
  return finish(c);
}

export function floorTexture(): THREE.CanvasTexture {
  const S = 512;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = '#bf9f6c';
  ctx.fillRect(0, 0, S, S);
  // flagstones
  const tile = 128;
  for (let y = 0; y < S; y += tile)
    for (let x = 0; x < S; x += tile) {
      const l = rnd(-12, 12);
      ctx.fillStyle = `rgb(${190 + l},${158 + l},${108 + l})`;
      ctx.fillRect(x + 3, y + 3, tile - 6, tile - 6);
    }
  ctx.fillStyle = 'rgba(95,70,40,0.35)';
  for (let i = 0; i <= S; i += tile) {
    ctx.fillRect(i - 2, 0, 4, S);
    ctx.fillRect(0, i - 2, S, 4);
  }
  // sand drifts & pebbles
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(${rnd(120, 230)},${rnd(100, 190)},${rnd(60, 130)},${rnd(0.1, 0.4)})`;
    ctx.fillRect(rnd(0, S), rnd(0, S), rnd(1, 4), rnd(1, 4));
  }
  for (let i = 0; i < 25; i++) {
    ctx.strokeStyle = `rgba(90,65,35,${rnd(0.15, 0.3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    let x = rnd(0, S);
    let y = rnd(0, S);
    ctx.moveTo(x, y);
    for (let k = 0; k < 5; k++) {
      x += rnd(-20, 20);
      y += rnd(-20, 20);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  addNoise(ctx, S, S, 26);
  return finish(c);
}

export function crateTexture(): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = '#8f6838';
  ctx.fillRect(0, 0, S, S);
  for (let x = 0; x < S; x += 32) {
    const l = rnd(-18, 18);
    ctx.fillStyle = `rgb(${143 + l},${104 + l},${56 + l})`;
    ctx.fillRect(x + 1, 0, 30, S);
    ctx.fillStyle = 'rgba(60,40,15,0.5)';
    ctx.fillRect(x, 0, 2, S);
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = 'rgba(80,55,25,0.25)';
      ctx.fillRect(x + rnd(3, 28), rnd(0, S), 1, rnd(20, 90));
    }
  }
  ctx.strokeStyle = '#5a3d1c';
  ctx.lineWidth = 22;
  ctx.strokeRect(11, 11, S - 22, S - 22);
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(18, 18);
  ctx.lineTo(S - 18, S - 18);
  ctx.stroke();
  ctx.fillStyle = '#2e2e2e';
  for (const [x, y] of [
    [12, 12],
    [S - 12, 12],
    [12, S - 12],
    [S - 12, S - 12],
  ])
    ctx.fillRect(x - 4, y - 4, 8, 8);
  addNoise(ctx, S, S, 20);
  return finish(c);
}

export function metalTexture(): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = '#4f6470';
  ctx.fillRect(0, 0, S, S);
  for (let x = 0; x < S; x += 24) {
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, 0, 6, S);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x + 18, 0, 6, S);
  }
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(140,80,40,${rnd(0.1, 0.35)})`;
    ctx.beginPath();
    ctx.arc(rnd(0, S), rnd(0, S), rnd(2, 12), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#2c3a42';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, S - 10, S - 10);
  addNoise(ctx, S, S, 16);
  return finish(c);
}

export function doorTexture(): THREE.CanvasTexture {
  const W = 128;
  const H = 256;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = '#3d6b78';
  ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 16) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x, 0, 2, H);
  }
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 40, W, 8);
  ctx.fillRect(0, H - 50, W, 8);
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(200,180,140,${rnd(0.08, 0.3)})`;
    ctx.fillRect(rnd(0, W), rnd(0, H), rnd(3, 14), rnd(2, 8));
  }
  addNoise(ctx, W, H, 18);
  return finish(c);
}

export function siteLetterTexture(letter: string): THREE.CanvasTexture {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.clearRect(0, 0, S, S);
  ctx.font = 'bold 200px Impact, Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(190,30,25,0.85)';
  ctx.shadowColor = 'rgba(190,30,25,0.6)';
  ctx.shadowBlur = 12;
  ctx.fillText(letter, S / 2, S / 2 + 10);
  // spray speckles
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(190,30,25,${rnd(0.1, 0.5)})`;
    ctx.fillRect(S / 2 + rnd(-110, 110), S / 2 + rnd(-110, 110), 2, 2);
  }
  return finish(c, false);
}

export function radialTexture(inner: string, outer: string): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return finish(c, false);
}

export function bulletHoleTexture(): THREE.CanvasTexture {
  const S = 64;
  const [c, ctx] = canvas(S, S);
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(10,8,6,1)');
  g.addColorStop(0.3, 'rgba(30,22,15,0.9)');
  g.addColorStop(0.6, 'rgba(70,55,35,0.4)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return finish(c, false);
}

export function muzzleFlashTexture(): THREE.CanvasTexture {
  const S = 128;
  const [c, ctx] = canvas(S, S);
  ctx.translate(S / 2, S / 2);
  for (let i = 0; i < 7; i++) {
    ctx.rotate((Math.PI * 2) / 7 + rnd(-0.2, 0.2));
    const g = ctx.createLinearGradient(0, 0, S / 2, 0);
    g.addColorStop(0, 'rgba(255,250,210,1)');
    g.addColorStop(0.4, 'rgba(255,190,70,0.8)');
    g.addColorStop(1, 'rgba(255,120,20,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(S / 2 * rnd(0.6, 1), 0);
    ctx.lineTo(0, 6);
    ctx.fill();
  }
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
  g.addColorStop(0, 'rgba(255,255,240,1)');
  g.addColorStop(1, 'rgba(255,200,90,0)');
  ctx.fillStyle = g;
  ctx.fillRect(-30, -30, 60, 60);
  return finish(c, false);
}

/** Give a BoxGeometry world-scale UVs so textures tile instead of stretching. */
export function boxGeometry(w: number, h: number, d: number, texScale = 2): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const dims = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++)
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / texScale, (uv.getY(i) * dims[f][1]) / texScale);
    }
  uv.needsUpdate = true;
  return g;
}
