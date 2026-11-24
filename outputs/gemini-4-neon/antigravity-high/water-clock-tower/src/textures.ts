import * as THREE from 'three';

export interface ProceduralTextures {
  cedarWood: THREE.CanvasTexture;
  darkWalnut: THREE.CanvasTexture;
  cinnabarLacquer: THREE.CanvasTexture;
  bronze: THREE.CanvasTexture;
  bronzeRoughness: THREE.CanvasTexture;
  stone: THREE.CanvasTexture;
  celestialGlobe: THREE.CanvasTexture;
  drumHead: THREE.CanvasTexture;
  roofTile: THREE.CanvasTexture;
  hourPlaques: THREE.CanvasTexture[];
}

export const SHICHEN_NAMES = [
  '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
  '午时', '未时', '申时', '酉时', '戌时', '亥时',
];

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function finalizeTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1,
  isColor = true
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.needsUpdate = true;
  return tex;
}

function createWoodTexture(baseHex: string, grainHex: string, darkHex: string): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  // Fine organic wood fibers
  for (let i = 0; i < 160; i++) {
    const y = (i / 160) * 256;
    ctx.strokeStyle = i % 3 === 0 ? darkHex : grainHex;
    ctx.globalAlpha = 0.14 + (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.22;
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 32) {
      const wave = Math.sin(x * 0.03 + i * 0.45) * 3.5;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Subtle plank join lines
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = darkHex;
  ctx.fillRect(0, 127, 256, 2);
  ctx.globalAlpha = 1;
  return finalizeTexture(c, 2, 2);
}

function createBronzeTextures(): { color: THREE.CanvasTexture; roughness: THREE.CanvasTexture } {
  const [c, ctx] = makeCanvas(256, 256);
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#c69a55');
  grad.addColorStop(0.5, '#a4783a');
  grad.addColorStop(1, '#7c5c30');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const [rc, rctx] = makeCanvas(256, 256);
  rctx.fillStyle = '#6c6c6c';
  rctx.fillRect(0, 0, 256, 256);

  // Hammered antique patina spots
  let seed = 1088;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 240; i++) {
    const x = rand() * 256;
    const y = rand() * 256;
    const r = 3 + rand() * 14;
    ctx.fillStyle = i % 5 === 0 ? 'rgba(72, 110, 96, 0.14)' : 'rgba(240, 206, 138, 0.08)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    const gVal = Math.floor(80 + rand() * 85);
    rctx.fillStyle = `rgba(${gVal},${gVal},${gVal},0.25)`;
    rctx.beginPath();
    rctx.arc(x, y, r, 0, Math.PI * 2);
    rctx.fill();
  }

  return {
    color: finalizeTexture(c, 1, 1, true),
    roughness: finalizeTexture(rc, 1, 1, false),
  };
}

function createStoneTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = '#4c525b';
  ctx.fillRect(0, 0, 256, 256);

  let seed = 2026;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 600; i++) {
    const v = Math.floor(55 + rand() * 48);
    ctx.fillStyle = `rgba(${v},${v + 2},${v + 6},0.3)`;
    ctx.fillRect(rand() * 256, rand() * 256, 2 + rand() * 8, 2 + rand() * 6);
  }
  // Carved Song stone courses
  ctx.strokeStyle = 'rgba(20, 24, 30, 0.45)';
  ctx.lineWidth = 2;
  for (let y = 0; y < 256; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
    const offset = (y / 64) % 2 === 0 ? 0 : 64;
    for (let x = offset; x < 256; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
      ctx.stroke();
    }
  }
  return finalizeTexture(c, 3, 2);
}

function createRoofTileTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = '#2d3744';
  ctx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 16) {
    const grad = ctx.createLinearGradient(x, 0, x + 16, 0);
    grad.addColorStop(0, '#1e2530');
    grad.addColorStop(0.45, '#435061');
    grad.addColorStop(1, '#1c222c');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 16, 256);
  }
  ctx.strokeStyle = 'rgba(12, 16, 22, 0.55)';
  ctx.lineWidth = 2;
  for (let y = 0; y < 256; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  return finalizeTexture(c, 3, 2);
}

function createCelestialGlobeTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256);
  // Deep lacquered bronze night-sky sphere
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#1d2b3b');
  grad.addColorStop(0.5, '#152030');
  grad.addColorStop(1, '#1d2b3b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Meridians (28 mansions / 二十八宿 grid)
  ctx.strokeStyle = 'rgba(218, 179, 108, 0.28)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 28; i++) {
    const x = (i / 28) * 512;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  // Parallels
  for (let j = 1; j < 6; j++) {
    const y = (j / 6) * 256;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Celestial Equator (bright gold)
  ctx.strokeStyle = '#e8c272';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 128);
  ctx.lineTo(512, 128);
  ctx.stroke();

  // Ecliptic sine curve (vermilion-gold)
  ctx.strokeStyle = '#df7950';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  for (let x = 0; x <= 512; x += 4) {
    const y = 128 + Math.sin((x / 512) * Math.PI * 2) * 44;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Golden engraved stars & Song constellation lines
  let seed = 108809;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const stars: Array<[number, number]> = [];
  for (let i = 0; i < 160; i++) {
    const sx = rand() * 512;
    const sy = 18 + rand() * 220;
    const sr = 1.0 + rand() * 2.2;
    stars.push([sx, sy]);
    ctx.fillStyle = i % 5 === 0 ? '#fff2cc' : '#f3cb74';
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(244, 212, 136, 0.45)';
  ctx.lineWidth = 0.9;
  for (let i = 0; i < stars.length - 1; i += 3) {
    const [x1, y1] = stars[i];
    const [x2, y2] = stars[i + 1];
    if (Math.hypot(x2 - x1, y2 - y1) < 55) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  return finalizeTexture(c, 1, 1);
}

function createDrumHeadTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const rad = ctx.createRadialGradient(128, 128, 12, 128, 128, 126);
  rad.addColorStop(0, '#f3e1bc');
  rad.addColorStop(0.75, '#dcc28f');
  rad.addColorStop(1, '#9d7c4c');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 256, 256);

  // Decorative vermilion & gold rings
  ctx.strokeStyle = '#9e2a22';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 102, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#b9893e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(128, 128, 86, 0, Math.PI * 2);
  ctx.stroke();

  // Center Song seal motif
  ctx.fillStyle = '#9e2a22';
  ctx.beginPath();
  ctx.arc(128, 128, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f5dc9e';
  ctx.font = 'bold 34px "Noto Serif SC", "Songti SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('鼓', 128, 130);

  return finalizeTexture(c, 1, 1);
}

function createHourPlaqueTexture(label: string): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(128, 256);
  // Warm vermilion/gold wooden tablet
  ctx.fillStyle = '#8b241d';
  ctx.fillRect(0, 0, 128, 256);

  ctx.strokeStyle = '#e8c170';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 108, 236);

  ctx.strokeStyle = 'rgba(232, 193, 112, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 88, 216);

  ctx.fillStyle = '#fbf0d4';
  ctx.font = 'bold 64px "Noto Serif SC", "Songti SC", "Microsoft YaHei", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Vertical calligraphy layout (2 chars)
  ctx.fillText(label[0], 64, 90);
  ctx.fillText(label[1], 64, 172);

  return finalizeTexture(c, 1, 1);
}

export function createProceduralTextures(): ProceduralTextures {
  const bronzeSet = createBronzeTextures();
  return {
    cedarWood: createWoodTexture('#9e6b3f', '#bd8958', '#684122'),
    darkWalnut: createWoodTexture('#51331e', '#69442a', '#2e1b0e'),
    cinnabarLacquer: createWoodTexture('#962820', '#b5372d', '#681914'),
    bronze: bronzeSet.color,
    bronzeRoughness: bronzeSet.roughness,
    stone: createStoneTexture(),
    celestialGlobe: createCelestialGlobeTexture(),
    drumHead: createDrumHeadTexture(),
    roofTile: createRoofTileTexture(),
    hourPlaques: SHICHEN_NAMES.map(createHourPlaqueTexture),
  };
}
