import * as THREE from 'three';

export interface Dust2Textures {
  sandGround: THREE.CanvasTexture;
  sandstoneWall: THREE.CanvasTexture;
  sandstoneTrim: THREE.CanvasTexture;
  tunnelStone: THREE.CanvasTexture;
  woodCrate: THREE.CanvasTexture;
  militaryCrate: THREE.CanvasTexture;
  midDoorWood: THREE.CanvasTexture;
  blueMetal: THREE.CanvasTexture;
  siteADecal: THREE.CanvasTexture;
  siteBDecal: THREE.CanvasTexture;
  siteFloorA: THREE.CanvasTexture;
  siteFloorB: THREE.CanvasTexture;
  stairsTex: THREE.CanvasTexture;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return [c, ctx];
}

function seededRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function createSandGroundTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 512);
  const rand = seededRand(101);
  ctx.fillStyle = '#c8aa7a';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle dusty blotches
  for (let i = 0; i < 400; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 8 + rand() * 34;
    const shade = rand() > 0.5 ? 'rgba(220,192,145,0.16)' : 'rgba(150,120,80,0.14)';
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Flagstone / weathered pavement grid hints
  ctx.strokeStyle = 'rgba(110, 88, 58, 0.16)';
  ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
    const offset = (y / 64) % 2 === 0 ? 0 : 32;
    for (let x = offset; x < 512; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 64);
      ctx.stroke();
    }
  }

  // Fine sand grit
  for (let i = 0; i < 6000; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(245,230,195,0.22)' : 'rgba(95,74,48,0.2)';
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(22, 22);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSandstoneWallTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 512);
  const rand = seededRand(202);
  // Warm Tunisian ochre plaster base
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#dfc59c');
  grad.addColorStop(0.6, '#d1b383');
  grad.addColorStop(1, '#b69464');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Exposed masonry patches & courses
  for (let row = 0; row < 16; row++) {
    const y = row * 32;
    ctx.fillStyle = 'rgba(115, 88, 56, 0.12)';
    ctx.fillRect(0, y, 512, 2);
    const offset = (row % 2) * 32;
    for (let col = 0; col < 8; col++) {
      const x = col * 64 + offset;
      if (rand() < 0.28) {
        ctx.fillStyle = rand() > 0.5 ? 'rgba(170,136,92,0.24)' : 'rgba(235,212,175,0.18)';
        ctx.fillRect(x + 2, y + 2, 60, 28);
      }
      ctx.fillStyle = 'rgba(100, 76, 48, 0.1)';
      ctx.fillRect(x, y, 2, 32);
    }
  }

  // Bottom dirt weathering & upper stucco cracks
  for (let i = 0; i < 320; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 6 + rand() * 24;
    ctx.fillStyle = rand() > 0.5 ? 'rgba(120,90,55,0.08)' : 'rgba(245,232,205,0.08)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle decorative terracotta band near top
  ctx.fillStyle = 'rgba(155, 92, 62, 0.25)';
  ctx.fillRect(0, 44, 512, 14);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSandstoneTrimTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const rand = seededRand(303);
  ctx.fillStyle = '#bfa071';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(95,72,44,0.15)' : 'rgba(235,215,175,0.12)';
    ctx.fillRect(0, i * 16, 256, 8);
  }
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(80,60,35,0.18)' : 'rgba(240,220,185,0.16)';
    ctx.fillRect(rand() * 256, rand() * 256, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTunnelStoneTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 512);
  const rand = seededRand(404);
  ctx.fillStyle = '#8b775b';
  ctx.fillRect(0, 0, 512, 512);

  for (let row = 0; row < 12; row++) {
    const y = row * 42.6;
    const off = (row % 2) * 32;
    for (let col = -1; col < 9; col++) {
      const x = col * 64 + off;
      const v = Math.floor(115 + rand() * 32);
      ctx.fillStyle = `rgb(${v + 16}, ${v}, ${v - 22})`;
      ctx.fillRect(x + 2, y + 2, 60, 39);
    }
  }
  for (let i = 0; i < 2000; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(30,22,14,0.22)' : 'rgba(210,190,155,0.12)';
    ctx.fillRect(rand() * 512, rand() * 512, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWoodCrateTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const rand = seededRand(505);
  ctx.fillStyle = '#a4794b';
  ctx.fillRect(0, 0, 256, 256);

  // Horizontal wood planks
  for (let i = 0; i < 6; i++) {
    const y = i * 42.6;
    ctx.fillStyle = i % 2 === 0 ? '#9e7346' : '#ae8253';
    ctx.fillRect(0, y, 256, 41);
    ctx.fillStyle = '#5c3f21';
    ctx.fillRect(0, y + 40, 256, 3);
  }

  // Wood grain streaks
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(70,45,20,0.16)' : 'rgba(215,175,120,0.12)';
    ctx.fillRect(rand() * 256, rand() * 256, 20 + rand() * 45, 2);
  }

  // Diagonal brace & heavy outer frame
  ctx.strokeStyle = '#7c5730';
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(16, 16);
  ctx.lineTo(240, 240);
  ctx.stroke();

  ctx.strokeStyle = '#8b6339';
  ctx.lineWidth = 26;
  ctx.strokeRect(13, 13, 230, 230);

  ctx.strokeStyle = '#4e351c';
  ctx.lineWidth = 3;
  ctx.strokeRect(26, 26, 204, 204);

  // Corner bolts
  ctx.fillStyle = '#363636';
  for (const [bx, by] of [[14, 14], [242, 14], [14, 242], [242, 242]]) {
    ctx.beginPath();
    ctx.arc(bx, by, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMilitaryCrateTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const rand = seededRand(606);
  ctx.fillStyle = '#4b5b47';
  ctx.fillRect(0, 0, 256, 256);

  // Ribbed metal panels
  for (let x = 18; x < 238; x += 28) {
    ctx.fillStyle = '#3d4b39';
    ctx.fillRect(x, 22, 14, 212);
    ctx.fillStyle = '#5c6e57';
    ctx.fillRect(x + 14, 22, 4, 212);
  }

  ctx.strokeStyle = '#2f3a2c';
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, 238, 238);

  // Yellow stencil stripes
  ctx.fillStyle = 'rgba(225, 190, 70, 0.72)';
  ctx.fillRect(28, 34, 64, 10);
  ctx.font = 'bold 18px monospace';
  ctx.fillText('MIL-D2', 30, 68);

  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(20,25,20,0.16)' : 'rgba(180,175,140,0.1)';
    ctx.fillRect(rand() * 256, rand() * 256, 3, 3);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createMidDoorWoodTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 512);
  const rand = seededRand(707);
  ctx.fillStyle = '#5d3e27';
  ctx.fillRect(0, 0, 256, 512);

  // Vertical heavy wood planks
  for (let i = 0; i < 6; i++) {
    const x = i * 42.6;
    ctx.fillStyle = i % 2 === 0 ? '#624229' : '#533721';
    ctx.fillRect(x, 0, 41, 512);
    ctx.fillStyle = '#2d1c10';
    ctx.fillRect(x + 40, 0, 3, 512);
  }

  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(30,18,8,0.2)' : 'rgba(155,112,72,0.12)';
    ctx.fillRect(rand() * 256, rand() * 512, 2, 24 + rand() * 40);
  }

  // Heavy wrought-iron horizontal door bands
  ctx.fillStyle = '#2c2f33';
  for (const y of [40, 240, 440]) {
    ctx.fillRect(0, y, 256, 26);
    ctx.fillStyle = '#555b61';
    for (let rx = 20; rx < 250; rx += 42) {
      ctx.beginPath();
      ctx.arc(rx, y + 13, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#2c2f33';
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBlueMetalTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = '#2f5879';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#274c69' : '#376489';
    ctx.fillRect(0, i * 32, 256, 30);
  }
  ctx.strokeStyle = '#1c3548';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSiteDecalTexture(letter: 'A' | 'B'): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.clearRect(0, 0, 256, 256);

  // Spray-painted red/rust Dust2 bombsite emblem
  ctx.strokeStyle = 'rgba(185, 38, 30, 0.88)';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(128, 128, 102, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(195, 42, 32, 0.92)';
  ctx.font = '900 156px Impact, Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 128, 138);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSiteFloorTexture(letter: 'A' | 'B'): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 512);
  ctx.clearRect(0, 0, 512, 512);

  // Dashed hazard border
  ctx.strokeStyle = 'rgba(215, 55, 35, 0.72)';
  ctx.lineWidth = 14;
  ctx.setLineDash([36, 18]);
  ctx.strokeRect(18, 18, 476, 476);
  ctx.setLineDash([]);

  // Subtle corner brackets
  ctx.fillStyle = 'rgba(220, 62, 42, 0.24)';
  ctx.font = '900 220px Impact, Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 256, 266);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStairsTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  ctx.fillStyle = '#c5a87a';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12; i++) {
    const y = i * (256 / 12);
    ctx.fillStyle = '#b49566';
    ctx.fillRect(0, y, 256, 10);
    ctx.fillStyle = '#8b6f47';
    ctx.fillRect(0, y + 10, 256, 4);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDust2Textures(): Dust2Textures {
  return {
    sandGround: createSandGroundTexture(),
    sandstoneWall: createSandstoneWallTexture(),
    sandstoneTrim: createSandstoneTrimTexture(),
    tunnelStone: createTunnelStoneTexture(),
    woodCrate: createWoodCrateTexture(),
    militaryCrate: createMilitaryCrateTexture(),
    midDoorWood: createMidDoorWoodTexture(),
    blueMetal: createBlueMetalTexture(),
    siteADecal: createSiteDecalTexture('A'),
    siteBDecal: createSiteDecalTexture('B'),
    siteFloorA: createSiteFloorTexture('A'),
    siteFloorB: createSiteFloorTexture('B'),
    stairsTex: createStairsTexture(),
  };
}
