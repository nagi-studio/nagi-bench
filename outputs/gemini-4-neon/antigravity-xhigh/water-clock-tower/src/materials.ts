import * as THREE from 'three';
import { SHICHEN_NAMES } from './physics/clockPhysics';

export interface TowerMaterials {
  nanmuWood: THREE.MeshStandardMaterial;
  walnutWood: THREE.MeshStandardMaterial;
  lightPineWood: THREE.MeshStandardMaterial;
  cinnabarLacquer: THREE.MeshStandardMaterial;
  brightBronze: THREE.MeshStandardMaterial;
  agedBronze: THREE.MeshStandardMaterial;
  darkIron: THREE.MeshStandardMaterial;
  carvedStone: THREE.MeshStandardMaterial;
  songRoofTile: THREE.MeshStandardMaterial;
  waterGloss: THREE.MeshPhysicalMaterial;
  waterStream: THREE.MeshPhysicalMaterial;
  drumSkin: THREE.MeshStandardMaterial;
  celestialGlobe: THREE.MeshStandardMaterial;
  lanternGlow: THREE.MeshStandardMaterial;
  robeRed: THREE.MeshStandardMaterial;
  robeJade: THREE.MeshStandardMaterial;
  robeIndigo: THREE.MeshStandardMaterial;
  skinWood: THREE.MeshStandardMaterial;
  plaqueMain: THREE.MeshStandardMaterial;
  plaquePavilion: THREE.MeshStandardMaterial;
  shichenTablets: THREE.MeshStandardMaterial[];
  envMap: THREE.Texture;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function createWoodTexture(
  baseHex: string,
  grainHex: string,
  streakHex: string,
  seed: number
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  // Subtle plank bands & longitudinal fibers
  for (let i = 0; i < 240; i++) {
    const y = rnd() * 512;
    const thickness = 1 + rnd() * 3.5;
    ctx.fillStyle = rnd() > 0.45 ? grainHex : streakHex;
    ctx.globalAlpha = 0.08 + rnd() * 0.14;
    ctx.beginPath();
    ctx.moveTo(0, y);
    const amp = 2 + rnd() * 5;
    const freq = 0.008 + rnd() * 0.014;
    const phase = rnd() * Math.PI * 2;
    for (let x = 0; x <= 512; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * freq + phase) * amp);
    }
    ctx.lineWidth = thickness;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
  }

  // Subtle dark pore speckles
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#1b0f07';
  for (let i = 0; i < 600; i++) {
    ctx.fillRect(rnd() * 512, rnd() * 512, 6 + rnd() * 14, 1);
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStoneTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#5c656c';
  ctx.fillRect(0, 0, 512, 512);

  let s = 4421;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  // Ashlar stone courses
  const rows = 8;
  const rowH = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const cols = 4;
    const colW = 512 / cols;
    const offset = (r % 2) * (colW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const shade = 82 + Math.floor(rnd() * 24);
      ctx.fillStyle = `rgb(${shade - 4}, ${shade + 2}, ${shade + 8})`;
      ctx.fillRect(c * colW + offset + 2, r * rowH + 2, colW - 4, rowH - 4);
    }
  }

  // Mineral grain speckles
  for (let i = 0; i < 3200; i++) {
    const g = rnd() > 0.5 ? 255 : 20;
    ctx.fillStyle = `rgba(${g},${g},${g},${0.03 + rnd() * 0.06})`;
    ctx.fillRect(rnd() * 512, rnd() * 512, 2 + rnd() * 4, 2 + rnd() * 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createRoofTileTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  ctx.fillStyle = '#33424f';
  ctx.fillRect(0, 0, 512, 512);

  // Vertical bamboo-style glazed Song roof tile ribs
  const ribW = 32;
  for (let x = 0; x < 512; x += ribW) {
    const grad = ctx.createLinearGradient(x, 0, x + ribW, 0);
    grad.addColorStop(0.0, '#222d37');
    grad.addColorStop(0.28, '#465c6e');
    grad.addColorStop(0.55, '#597285');
    grad.addColorStop(0.85, '#2b3844');
    grad.addColorStop(1.0, '#1c252d');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, ribW, 512);
  }

  // Horizontal overlapping tile courses
  for (let y = 0; y < 512; y += 64) {
    ctx.fillStyle = 'rgba(12, 16, 22, 0.42)';
    ctx.fillRect(0, y, 512, 4);
    ctx.fillStyle = 'rgba(180, 210, 230, 0.14)';
    ctx.fillRect(0, y + 4, 512, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDrumSkinTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 512);
  const cx = 256;
  const cy = 256;

  // Warm parchment cowhide radial gradient
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 250);
  grad.addColorStop(0, '#f2dfb8');
  grad.addColorStop(0.72, '#dec18c');
  grad.addColorStop(1, '#a98552');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Song ceremonial painted concentric rings & stylized cloud motif
  ctx.strokeStyle = '#9c251c';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, 198, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#c9933a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 182, 0, Math.PI * 2);
  ctx.stroke();

  // Center stylized Song medallion
  ctx.fillStyle = 'rgba(156, 37, 28, 0.82)';
  ctx.beginPath();
  ctx.arc(cx, cy, 62, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#e5be6b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI * 2);
  ctx.stroke();

  // Inscribed character 「鼓」 in center
  ctx.fillStyle = '#f8e6bd';
  ctx.font = 'bold 58px "Songti SC", "STSong", "SimSun", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('报', cx, cy + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCelestialGlobeTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(1024, 512);

  // Deep Song indigo-bronze celestial patina background
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#132035');
  grad.addColorStop(0.5, '#192a42');
  grad.addColorStop(1, '#101b2c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // 28 Lunar Mansions (二十八宿) longitude lines
  ctx.strokeStyle = 'rgba(220, 178, 98, 0.28)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 28; i++) {
    const x = (i / 28) * 1024;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Latitude circles (declination parallels)
  for (let j = 1; j < 8; j++) {
    const y = (j / 8) * 512;
    ctx.strokeStyle = j === 4 ? 'rgba(240, 200, 112, 0.78)' : 'rgba(220, 178, 98, 0.25)';
    ctx.lineWidth = j === 4 ? 3.2 : 1.3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Tilted Golden Ecliptic Sine Curve (黄道)
  ctx.strokeStyle = 'rgba(244, 158, 72, 0.85)';
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  for (let x = 0; x <= 1024; x += 8) {
    const y = 256 - Math.sin((x / 1024) * Math.PI * 2) * 84;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Golden stars & traditional asterism connecting lines
  let s = 1088;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const stars: Array<[number, number, number]> = [];
  for (let i = 0; i < 260; i++) {
    const x = rnd() * 1024;
    const y = 28 + rnd() * 456;
    const r = 1.2 + Math.pow(rnd(), 2.2) * 3.8;
    stars.push([x, y, r]);
  }
  // Connect nearby bright stars into traditional Chinese star-map asterisms
  ctx.strokeStyle = 'rgba(246, 218, 146, 0.45)';
  ctx.lineWidth = 1.1;
  for (let i = 0; i < stars.length; i += 4) {
    const [x1, y1] = stars[i];
    const [x2, y2] = stars[(i + 1) % stars.length];
    if (Math.hypot(x2 - x1, y2 - y1) < 110) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
  for (const [x, y, r] of stars) {
    ctx.fillStyle = r > 3.2 ? '#fff4d0' : '#f1c76b';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPlaqueTexture(text: string, bgColor: string, borderColor: string): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(512, 160);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 160);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 492, 140);
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, 468, 116);

  ctx.fillStyle = '#f5d98a';
  ctx.font = 'bold 66px "Songti SC", "STSong", "SimSun", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 84);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createShichenTabletTexture(label: string): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(160, 320);
  ctx.fillStyle = '#8b1e18';
  ctx.fillRect(0, 0, 160, 320);

  ctx.strokeStyle = '#e5be67';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 144, 304);

  ctx.fillStyle = '#fff0c2';
  ctx.font = 'bold 84px "Songti SC", "STSong", "SimSun", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Render vertical traditional calligraphy (two characters stacked)
  ctx.fillText(label[0] ?? '', 80, 112);
  ctx.fillText(label[1] ?? '', 80, 214);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#182131');

  // Warm key softbox panel
  const warmPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe0ab').multiplyScalar(2.6), side: THREE.DoubleSide })
  );
  warmPanel.position.set(10, 12, 10);
  warmPanel.lookAt(0, 4, 0);
  envScene.add(warmPanel);

  // Cool sky celadon fill panel
  const coolPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 14),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#8ec8e8').multiplyScalar(1.7), side: THREE.DoubleSide })
  );
  coolPanel.position.set(-12, 10, -4);
  coolPanel.lookAt(0, 4, 0);
  envScene.add(coolPanel);

  // Warm amber floor bounce
  const floorPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#6a482d'), side: THREE.DoubleSide })
  );
  floorPanel.position.set(0, -6, 0);
  floorPanel.rotation.x = -Math.PI / 2;
  envScene.add(floorPanel);

  // Lantern rim accent
  const rimPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffaa55').multiplyScalar(2.2), side: THREE.DoubleSide })
  );
  rimPanel.position.set(2, 6, -12);
  rimPanel.lookAt(0, 5, 0);
  envScene.add(rimPanel);

  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}

export function createTowerMaterials(renderer: THREE.WebGLRenderer): TowerMaterials {
  const envMap = createStudioEnvMap(renderer);

  const nanmuTex = createWoodTexture('#9b6538', '#734520', '#b77f4c', 101);
  const walnutTex = createWoodTexture('#553520', '#382011', '#6e472d', 202);
  const pineTex = createWoodTexture('#c7965b', '#a87840', '#dbaf74', 303);
  const stoneTex = createStoneTexture();
  const roofTex = createRoofTileTexture();
  const drumTex = createDrumSkinTexture();
  const globeTex = createCelestialGlobeTexture();

  const nanmuWood = new THREE.MeshStandardMaterial({
    map: nanmuTex,
    roughness: 0.62,
    metalness: 0.05,
    envMapIntensity: 0.55,
  });

  const walnutWood = new THREE.MeshStandardMaterial({
    map: walnutTex,
    roughness: 0.72,
    metalness: 0.04,
    envMapIntensity: 0.45,
  });

  const lightPineWood = new THREE.MeshStandardMaterial({
    map: pineTex,
    roughness: 0.58,
    metalness: 0.04,
    envMapIntensity: 0.5,
  });

  const cinnabarLacquer = new THREE.MeshStandardMaterial({
    color: '#a82c23',
    roughness: 0.34,
    metalness: 0.08,
    envMapIntensity: 0.85,
  });

  const brightBronze = new THREE.MeshStandardMaterial({
    color: '#e0af54',
    roughness: 0.25,
    metalness: 0.86,
    envMapIntensity: 1.35,
  });

  const agedBronze = new THREE.MeshStandardMaterial({
    color: '#51675d',
    roughness: 0.42,
    metalness: 0.72,
    envMapIntensity: 1.0,
  });

  const darkIron = new THREE.MeshStandardMaterial({
    color: '#343a40',
    roughness: 0.48,
    metalness: 0.78,
    envMapIntensity: 0.9,
  });

  const carvedStone = new THREE.MeshStandardMaterial({
    map: stoneTex,
    roughness: 0.86,
    metalness: 0.04,
    envMapIntensity: 0.35,
  });

  const songRoofTile = new THREE.MeshStandardMaterial({
    map: roofTex,
    roughness: 0.44,
    metalness: 0.16,
    envMapIntensity: 0.9,
  });

  const waterGloss = new THREE.MeshPhysicalMaterial({
    color: '#5ee3eb',
    emissive: '#144d58',
    emissiveIntensity: 0.38,
    roughness: 0.08,
    metalness: 0.05,
    transmission: 0.35,
    transparent: true,
    opacity: 0.88,
    envMapIntensity: 1.4,
  });

  const waterStream = new THREE.MeshPhysicalMaterial({
    color: '#88f2f7',
    emissive: '#227585',
    emissiveIntensity: 0.52,
    roughness: 0.1,
    metalness: 0.05,
    transparent: true,
    opacity: 0.78,
    envMapIntensity: 1.5,
  });

  const drumSkin = new THREE.MeshStandardMaterial({
    map: drumTex,
    roughness: 0.72,
    metalness: 0.03,
  });

  const celestialGlobe = new THREE.MeshStandardMaterial({
    map: globeTex,
    roughness: 0.34,
    metalness: 0.42,
    emissive: '#1d2d44',
    emissiveIntensity: 0.35,
    envMapIntensity: 1.1,
  });

  const lanternGlow = new THREE.MeshStandardMaterial({
    color: '#ffe8b6',
    emissive: '#ffaa44',
    emissiveIntensity: 1.85,
    roughness: 0.3,
  });

  const robeRed = new THREE.MeshStandardMaterial({ color: '#b83227', roughness: 0.58 });
  const robeJade = new THREE.MeshStandardMaterial({ color: '#2e7c6d', roughness: 0.58 });
  const robeIndigo = new THREE.MeshStandardMaterial({ color: '#334e7d', roughness: 0.58 });
  const skinWood = new THREE.MeshStandardMaterial({ color: '#e6c29b', roughness: 0.55 });

  const plaqueMain = new THREE.MeshStandardMaterial({
    map: createPlaqueTexture('水運儀象臺', '#1e2838', '#d9ad54'),
    roughness: 0.45,
    metalness: 0.15,
  });

  const plaquePavilion = new THREE.MeshStandardMaterial({
    map: createPlaqueTexture('報時木閣', '#7d1c16', '#e0b75e'),
    roughness: 0.42,
    metalness: 0.15,
  });

  const shichenTablets = SHICHEN_NAMES.map(
    (label) =>
      new THREE.MeshStandardMaterial({
        map: createShichenTabletTexture(label),
        roughness: 0.45,
        metalness: 0.12,
        emissive: '#3a1a08',
        emissiveIntensity: 0.25,
      })
  );

  return {
    nanmuWood,
    walnutWood,
    lightPineWood,
    cinnabarLacquer,
    brightBronze,
    agedBronze,
    darkIron,
    carvedStone,
    songRoofTile,
    waterGloss,
    waterStream,
    drumSkin,
    celestialGlobe,
    lanternGlow,
    robeRed,
    robeJade,
    robeIndigo,
    skinWood,
    plaqueMain,
    plaquePavilion,
    shichenTablets,
    envMap,
  };
}
