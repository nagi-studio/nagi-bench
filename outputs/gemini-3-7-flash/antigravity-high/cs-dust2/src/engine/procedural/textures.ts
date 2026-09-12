import * as THREE from 'three';

// Cache generated canvas textures so we don't regenerate them constantly
const textureCache = new Map<string, THREE.CanvasTexture>();

function createNoise(ctx: CanvasRenderingContext2D, width: number, height: number, opacity: number = 0.08) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 255 * opacity;
    data[i] = Math.min(255, Math.max(0, data[i] + val));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + val));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + val));
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Sandstone Wall Texture (Dust 2 Sand-colored walls)
 */
export function getSandstoneWallTexture(): THREE.CanvasTexture {
  const key = 'sandstone_wall';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base sandy tone
  ctx.fillStyle = '#cfb58c';
  ctx.fillRect(0, 0, 512, 512);

  // Brick / Block grid
  ctx.strokeStyle = '#9a815a';
  ctx.lineWidth = 4;
  const rowHeight = 64;
  const colWidth = 128;

  for (let y = 0; y < 512; y += rowHeight) {
    const offset = (y / rowHeight) % 2 === 0 ? 0 : colWidth / 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    for (let x = -offset; x < 512; x += colWidth) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + rowHeight);
      ctx.stroke();

      // Subtle block tint variation
      const tint = (Math.random() - 0.5) * 20;
      ctx.fillStyle = `rgba(${190 + tint}, ${165 + tint}, ${125 + tint}, 0.25)`;
      ctx.fillRect(x + 2, y + 2, colWidth - 4, rowHeight - 4);
    }
  }

  // Weathering and stains at bottom
  const grad = ctx.createLinearGradient(0, 400, 0, 512);
  grad.addColorStop(0, 'rgba(100, 80, 50, 0)');
  grad.addColorStop(1, 'rgba(90, 70, 45, 0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 400, 512, 112);

  createNoise(ctx, 512, 512, 0.12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Sand & Stone Ground Texture
 */
export function getGroundTexture(): THREE.CanvasTexture {
  const key = 'ground_sand';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Desert sand base
  ctx.fillStyle = '#bfa275';
  ctx.fillRect(0, 0, 512, 512);

  // Irregular flagstones / paving
  ctx.strokeStyle = '#8c724b';
  ctx.lineWidth = 3;
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const size = 30 + Math.random() * 50;
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(170, 140, 100, 0.15)';
    ctx.fill();
  }

  createNoise(ctx, 512, 512, 0.18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Wood Tactical Crate Texture
 */
export function getWoodCrateTexture(siteTag?: string): THREE.CanvasTexture {
  const key = `wood_crate_${siteTag || 'std'}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base wood color
  ctx.fillStyle = '#9e6d3c';
  ctx.fillRect(0, 0, 256, 256);

  // Planks
  ctx.fillStyle = '#825529';
  ctx.lineWidth = 4;
  for (let y = 0; y < 256; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.strokeStyle = '#4e3318';
    ctx.stroke();

    // Wood grain lines
    for (let x = 0; x < 256; x += 16) {
      ctx.fillStyle = 'rgba(60, 35, 15, 0.12)';
      ctx.fillRect(x, y + 2, 8 + Math.random() * 6, 38);
    }
  }

  // Border metal brace frame
  ctx.fillStyle = '#5c4838';
  ctx.fillRect(0, 0, 256, 18);
  ctx.fillRect(0, 238, 256, 18);
  ctx.fillRect(0, 0, 18, 256);
  ctx.fillRect(238, 0, 18, 256);

  // Diagonal brace
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#5c4838';
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(246, 246);
  ctx.stroke();

  // Corner rivets
  ctx.fillStyle = '#222';
  [[12, 12], [244, 12], [12, 244], [244, 244], [128, 128]].forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.arc(rx - 1, ry - 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
  });

  // Stenciled Site or Danger Label
  if (siteTag) {
    ctx.save();
    ctx.font = 'bold 84px Arial, sans-serif';
    ctx.fillStyle = 'rgba(235, 60, 40, 0.85)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(siteTag, 128, 128);
    ctx.restore();
  } else {
    ctx.save();
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.fillStyle = 'rgba(30, 25, 20, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('FRAGILE', 128, 75);
    ctx.fillText('MILITARY', 128, 185);
    ctx.restore();
  }

  createNoise(ctx, 256, 256, 0.1);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Metal Mid Door / Container Texture
 */
export function getMetalDoorTexture(variant: 'mid_door' | 'container' = 'mid_door'): THREE.CanvasTexture {
  const key = `metal_door_${variant}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Heavy oxidized olive-green steel
  ctx.fillStyle = variant === 'mid_door' ? '#465646' : '#2b5066';
  ctx.fillRect(0, 0, 512, 512);

  // Metal panel indentations
  ctx.strokeStyle = '#222b22';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 472, 472);

  // Inset panels
  ctx.fillStyle = variant === 'mid_door' ? '#3b4b3b' : '#234356';
  ctx.fillRect(35, 35, 442, 210);
  ctx.fillRect(35, 265, 442, 210);

  // Yellow & Black hazard stripes at bottom of door
  const stripeW = 30;
  for (let x = -50; x < 550; x += stripeW * 2) {
    ctx.fillStyle = '#e6b800';
    ctx.beginPath();
    ctx.moveTo(x, 475);
    ctx.lineTo(x + stripeW, 475);
    ctx.lineTo(x + stripeW + 35, 512);
    ctx.lineTo(x + 35, 512);
    ctx.fill();
  }

  // Rivets along edges
  ctx.fillStyle = '#1a221a';
  for (let y = 30; y <= 480; y += 45) {
    ctx.beginPath();
    ctx.arc(28, y, 4, 0, Math.PI * 2);
    ctx.arc(484, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // CS / Dust2 Stencil decal
  ctx.save();
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('DO NOT BLOCK', 256, 140);
  ctx.font = 'bold 24px monospace';
  ctx.fillText('WARNING: MILITARY ZONE', 256, 370);
  ctx.restore();

  createNoise(ctx, 512, 512, 0.15);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Plant Site Wall Graffiti Decal (e.g. "SITE A ->" or "<- SITE B")
 */
export function getSiteSignTexture(site: 'A' | 'B'): THREE.CanvasTexture {
  const key = `site_sign_${site}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'transparent';
  ctx.clearRect(0, 0, 256, 256);

  ctx.save();
  ctx.font = 'bold 120px Impact, Arial, sans-serif';
  ctx.fillStyle = '#d8382c';
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 8;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeText(site, 128, 110);
  ctx.fillText(site, 128, 110);

  ctx.font = 'bold 36px Impact, Arial, sans-serif';
  ctx.strokeText(`BOMBSITE ${site}`, 128, 200);
  ctx.fillText(`BOMBSITE ${site}`, 128, 200);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * C4 Explosive Top Surface Texture
 */
export function getC4KeypadTexture(): THREE.CanvasTexture {
  const key = 'c4_keypad';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Tan clay explosive bricks wrapped with tape
  ctx.fillStyle = '#bc9363';
  ctx.fillRect(0, 0, 256, 256);

  // Black duct tape bands
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(0, 25, 256, 40);
  ctx.fillRect(0, 190, 256, 40);

  // Central timer electronic module
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(35, 75, 186, 105);

  // Digital LED Display
  ctx.fillStyle = '#0f1f0f';
  ctx.fillRect(50, 85, 156, 35);
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#22ee33';
  ctx.textAlign = 'center';
  ctx.fillText('7355608', 128, 110);

  // Keypad buttons
  ctx.fillStyle = '#888';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 6; c++) {
      ctx.fillRect(55 + c * 25, 128 + r * 22, 18, 16);
    }
  }

  // Blinking LED diode mount
  ctx.fillStyle = '#cc0000';
  ctx.beginPath();
  ctx.arc(200, 92, 5, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Weapon Wood Grain Texture (AK-47 stock & handguard)
 */
export function getAK47WoodTexture(): THREE.CanvasTexture {
  const key = 'ak47_wood';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6e2b0e'; // Rich reddish dark wood
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#421705';
  ctx.lineWidth = 2;
  for (let y = 0; y < 128; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(40, y + 4, 80, y - 4, 128, y);
    ctx.stroke();
  }

  createNoise(ctx, 128, 128, 0.06);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Camo Texture for Character Uniforms (CT vs T)
 */
export function getUniformTexture(team: 'CT' | 'T'): THREE.CanvasTexture {
  const key = `uniform_${team}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  if (team === 'CT') {
    // Navy / SWAT blue-grey tactical camouflage
    ctx.fillStyle = '#223244';
    ctx.fillRect(0, 0, 128, 128);

    const colors = ['#1a2636', '#2d4056', '#141d28'];
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      ctx.fillRect(x, y, 16 + Math.random() * 20, 12 + Math.random() * 16);
    }
  } else {
    // Desert Tan / Khaki / Guerilla camo
    ctx.fillStyle = '#9e8563';
    ctx.fillRect(0, 0, 128, 128);

    const colors = ['#6e5b42', '#baa07b', '#4d3e2b'];
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = colors[i % colors.length];
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      ctx.fillRect(x, y, 16 + Math.random() * 20, 12 + Math.random() * 16);
    }
  }

  createNoise(ctx, 128, 128, 0.08);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}
