// 程序化材质（运行时用 canvas 生成纹理，不加载任何图片文件）
import * as THREE from 'three';

function rand(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTex(w, h, draw, { repeat = [1, 1], srgb = true } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function woodTexture(base, dark, seed) {
  const r = rand(seed);
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      const y0 = r() * h;
      const amp = 2 + r() * 6;
      const f = 0.01 + r() * 0.03;
      g.strokeStyle = dark;
      g.globalAlpha = 0.12 + r() * 0.25;
      g.lineWidth = 0.6 + r() * 2.2;
      g.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = y0 + Math.sin(x * f + i) * amp + Math.sin(x * 0.11 + i * 3) * 0.8;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
  });
}

function noiseTexture(base, spot, seed, n = 900) {
  const r = rand(seed);
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) {
      g.fillStyle = spot;
      g.globalAlpha = r() * 0.25;
      const s = 1 + r() * 4;
      g.fillRect(r() * w, r() * h, s, s);
    }
    g.globalAlpha = 1;
  });
}

function tileTexture() {
  return canvasTex(
    256,
    256,
    (g, w, h) => {
      g.fillStyle = '#3a3f46';
      g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 16) {
        const grd = g.createLinearGradient(x, 0, x + 16, 0);
        grd.addColorStop(0, '#2a2e33');
        grd.addColorStop(0.5, '#59606a');
        grd.addColorStop(1, '#2a2e33');
        g.fillStyle = grd;
        g.fillRect(x + 1, 0, 14, h);
      }
      g.fillStyle = 'rgba(0,0,0,0.25)';
      for (let y = 0; y < h; y += 24) g.fillRect(0, y, w, 2);
    },
    { repeat: [4, 2] },
  );
}

/** 星图纹理（浑象表面）：二十八宿风格的星点与连线 */
export function starChartTexture() {
  const r = rand(11);
  return canvasTex(1024, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#0f1f45');
    grd.addColorStop(0.5, '#16306a');
    grd.addColorStop(1, '#0f1f45');
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    // 赤道与黄道
    g.strokeStyle = 'rgba(255,220,140,0.55)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(0, h / 2);
    g.lineTo(w, h / 2);
    g.stroke();
    g.strokeStyle = 'rgba(255,150,110,0.45)';
    g.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y = h / 2 - Math.sin((x / w) * Math.PI * 2) * h * 0.13;
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    // 经线（二十八宿分野）
    g.strokeStyle = 'rgba(255,220,140,0.18)';
    g.lineWidth = 1;
    for (let i = 0; i < 28; i++) {
      const x = (i / 28) * w;
      g.beginPath();
      g.moveTo(x, h * 0.08);
      g.lineTo(x, h * 0.92);
      g.stroke();
    }
    // 星官：每组若干星以细线相连
    for (let k = 0; k < 60; k++) {
      const cx = r() * w;
      const cy = h * 0.1 + r() * h * 0.8;
      const n = 2 + Math.floor(r() * 5);
      let px = cx;
      let py = cy;
      g.strokeStyle = 'rgba(255,240,200,0.5)';
      g.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        const nx = px + (r() - 0.5) * 50;
        const ny = py + (r() - 0.5) * 36;
        g.beginPath();
        g.moveTo(px, py);
        g.lineTo(nx, ny);
        g.stroke();
        g.fillStyle = r() < 0.2 ? '#ffd27a' : '#fff6e0';
        g.beginPath();
        g.arc(nx, ny, 1.4 + r() * 2.2, 0, Math.PI * 2);
        g.fill();
        px = nx;
        py = ny;
      }
    }
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`;
      g.fillRect(r() * w, r() * h, 1.2, 1.2);
    }
  });
}

/** 写有文字的牌子纹理（时辰牌） */
export function placardTexture(text) {
  return canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = '#f3e6c4';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#8c2a1c';
    g.lineWidth = 8;
    g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = '#2a1a10';
    g.font = 'bold 84px "KaiTi","STKaiti","SimSun","Songti SC",serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const chars = [...text];
    chars.forEach((ch, i) => g.fillText(ch, w / 2, h / 2 + (i - (chars.length - 1) / 2) * 96));
  });
}

export function makeMaterials() {
  const woodMap = woodTexture('#8a5a33', '#3b2210', 3);
  const woodLight = woodTexture('#b58450', '#5a3418', 5);
  const woodDarkMap = woodTexture('#4a2c18', '#1a0d05', 9);
  const lacquerMap = woodTexture('#8f2418', '#3d0b06', 21);
  const stoneMap = noiseTexture('#5d5a55', '#1f1d1b', 4, 1600);
  const m = {
    wood: new THREE.MeshStandardMaterial({ map: woodMap, roughness: 0.75, metalness: 0.0 }),
    woodLight: new THREE.MeshStandardMaterial({ map: woodLight, roughness: 0.7, metalness: 0.0 }),
    woodDark: new THREE.MeshStandardMaterial({ map: woodDarkMap, roughness: 0.8 }),
    lacquer: new THREE.MeshStandardMaterial({ map: lacquerMap, roughness: 0.45, metalness: 0.05 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0xc9964e, roughness: 0.32, metalness: 0.85 }),
    bronzeDark: new THREE.MeshStandardMaterial({ color: 0x7d5a2c, roughness: 0.45, metalness: 0.8 }),
    iron: new THREE.MeshStandardMaterial({ color: 0x3b3d42, roughness: 0.5, metalness: 0.7 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xffc35a, roughness: 0.3, metalness: 0.9, emissive: 0x332000 }),
    stone: new THREE.MeshStandardMaterial({ map: stoneMap, roughness: 0.95 }),
    tile: new THREE.MeshStandardMaterial({ map: tileTexture(), roughness: 0.7, metalness: 0.1 }),
    plaster: new THREE.MeshStandardMaterial({ color: 0xd9cfbb, roughness: 0.95 }),
    water: new THREE.MeshStandardMaterial({
      color: 0x3f9fe0,
      roughness: 0.08,
      metalness: 0.0,
      emissive: 0x0a3a66,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.88,
    }),
    waterSurface: new THREE.MeshStandardMaterial({
      color: 0x2a7fc0,
      roughness: 0.05,
      metalness: 0.1,
      emissive: 0x0a2a50,
      transparent: true,
      opacity: 0.85,
    }),
    glass: new THREE.MeshStandardMaterial({ color: 0xbfd8e8, roughness: 0.1, transparent: true, opacity: 0.16, depthWrite: false }),
    cloth: new THREE.MeshStandardMaterial({ color: 0x2f5e8a, roughness: 0.9 }),
    clothRed: new THREE.MeshStandardMaterial({ color: 0xa8321f, roughness: 0.85 }),
    skin: new THREE.MeshStandardMaterial({ color: 0xe0b48a, roughness: 0.7 }),
    black: new THREE.MeshStandardMaterial({ color: 0x15100c, roughness: 0.6 }),
    drumSkin: new THREE.MeshStandardMaterial({ color: 0xe8d6a8, roughness: 0.8 }),
    globe: new THREE.MeshStandardMaterial({ map: starChartTexture(), roughness: 0.45, metalness: 0.1, emissive: 0x0c1a3c, emissiveIntensity: 0.5 }),
  };
  return m;
}

export { canvasTex };
