// 运行时程序化生成的贴图（不使用任何外部图片文件）
import * as THREE from 'three';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, repeat = [1, 1], srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// 木纹
export function woodTexture(base = '#7a4a26', dark = '#4a2a14', seed = 1, w = 256, h = 256) {
  const [c, g] = canvas(w, h);
  const r = rng(seed);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const y = r() * h;
    g.strokeStyle = dark;
    g.globalAlpha = 0.08 + r() * 0.18;
    g.lineWidth = 0.6 + r() * 2.2;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= w; x += 16) g.lineTo(x, y + Math.sin(x * 0.03 + i) * (2 + r() * 3));
    g.stroke();
  }
  g.globalAlpha = 1;
  // 细噪点
  const id = g.getImageData(0, 0, w, h);
  for (let i = 0; i < id.data.length; i += 4) {
    const n = (r() - 0.5) * 18;
    id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n;
  }
  g.putImageData(id, 0, 0);
  return tex(c);
}

// 红漆（带轻微斑驳）
export function lacquerTexture(seed = 3) {
  const [c, g] = canvas(128, 128);
  const r = rng(seed);
  g.fillStyle = '#8e2216'; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 400; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(60,10,6,0.10)' : 'rgba(190,70,40,0.06)';
    g.fillRect(r() * 128, r() * 128, 1 + r() * 4, 1 + r() * 10);
  }
  return tex(c);
}

// 青铜（铜绿斑）
export function bronzeTexture(seed = 5) {
  const [c, g] = canvas(256, 256);
  const r = rng(seed);
  g.fillStyle = '#9a7442'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 260; i++) {
    const x = r() * 256, y = r() * 256, rad = 2 + r() * 14;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const verd = r() > 0.75;
    gr.addColorStop(0, verd ? 'rgba(70,130,105,0.35)' : 'rgba(60,40,20,0.25)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  return tex(c);
}

// 青瓦（屋面）
export function tileTexture() {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#2f3438'; g.fillRect(0, 0, 128, 128);
  for (let x = 0; x < 128; x += 16) {
    const gr = g.createLinearGradient(x, 0, x + 16, 0);
    gr.addColorStop(0, '#1d2124'); gr.addColorStop(0.5, '#4a5258'); gr.addColorStop(1, '#1d2124');
    g.fillStyle = gr; g.fillRect(x, 0, 16, 128);
  }
  for (let y = 0; y < 128; y += 32) { g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, y, 128, 3); }
  return tex(c);
}

// 石板地面
export function stoneTexture(seed = 9) {
  const [c, g] = canvas(256, 256);
  const r = rng(seed);
  g.fillStyle = '#6d675d'; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 64) {
    const off = (y / 64) % 2 ? 32 : 0;
    for (let x = -64; x < 256; x += 64) {
      const v = 95 + r() * 30;
      g.fillStyle = `rgb(${v},${v - 6},${v - 14})`;
      g.fillRect(x + off + 2, y + 2, 60, 60);
    }
  }
  const id = g.getImageData(0, 0, 256, 256);
  for (let i = 0; i < id.data.length; i += 4) { const n = (r() - 0.5) * 20; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n; }
  g.putImageData(id, 0, 0);
  return tex(c);
}

// 浑象星图：深蓝底 + 金色星点 + 少量星官连线 + 赤道/黄道
export function starGlobeTexture() {
  const [c, g] = canvas(1024, 512);
  const r = rng(42);
  const bg = g.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, '#0d1a3a'); bg.addColorStop(0.5, '#132650'); bg.addColorStop(1, '#0d1a3a');
  g.fillStyle = bg; g.fillRect(0, 0, 1024, 512);
  // 赤道
  g.strokeStyle = 'rgba(230,190,110,0.8)'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, 256); g.lineTo(1024, 256); g.stroke();
  // 黄道（正弦）
  g.strokeStyle = 'rgba(220,120,80,0.7)'; g.lineWidth = 2.5;
  g.beginPath();
  for (let x = 0; x <= 1024; x += 8) { const y = 256 - Math.sin(x / 1024 * Math.PI * 2) * 66; x ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke();
  // 经线
  g.strokeStyle = 'rgba(200,170,110,0.18)'; g.lineWidth = 1;
  for (let x = 0; x < 1024; x += 1024 / 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }
  // 星官：随机小星群连线
  for (let k = 0; k < 40; k++) {
    let x = r() * 1024, y = 40 + r() * 432;
    const n = 3 + Math.floor(r() * 5);
    g.strokeStyle = 'rgba(240,210,150,0.45)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(x, y);
    const pts = [[x, y]];
    for (let i = 0; i < n; i++) { x += (r() - 0.5) * 60; y += (r() - 0.5) * 40; g.lineTo(x, y); pts.push([x, y]); }
    g.stroke();
    for (const [px, py] of pts) { g.fillStyle = '#ffe2a0'; g.beginPath(); g.arc(px, py, 2.6, 0, Math.PI * 2); g.fill(); }
  }
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(255,${220 + r() * 35},${150 + r() * 80},${0.3 + r() * 0.6})`;
    g.beginPath(); g.arc(r() * 1024, r() * 512, 0.6 + r() * 1.3, 0, Math.PI * 2); g.fill();
  }
  return tex(c, [1, 1]);
}

// 文字牌（时辰牌等）
export function textTexture(text, { w = 128, h = 256, bg = '#e9d7a8', fg = '#7a1a10', font = 'bold 92px "Noto Serif CJK SC","Songti SC","SimSun",serif', vertical = true, border = '#5a3a1a' } = {}) {
  const [c, g] = canvas(w, h);
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
  g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (vertical) {
    const chars = [...text];
    const step = (h - 30) / chars.length;
    chars.forEach((ch, i) => g.fillText(ch, w / 2, 15 + step * (i + 0.5)));
  } else g.fillText(text, w / 2, h / 2);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// 水面（带细波纹的法线感：用颜色近似）
export function waterTexture() {
  const [c, g] = canvas(256, 256);
  const r = rng(77);
  g.fillStyle = '#2e6f8e'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 120; i++) {
    g.strokeStyle = `rgba(190,230,255,${0.05 + r() * 0.12})`;
    g.lineWidth = 1 + r() * 2;
    g.beginPath();
    const y = r() * 256;
    g.moveTo(0, y);
    for (let x = 0; x <= 256; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + i) * 3);
    g.stroke();
  }
  return tex(c);
}
