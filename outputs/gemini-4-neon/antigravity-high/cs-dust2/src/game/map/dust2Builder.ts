import * as THREE from 'three';
import { Dust2MapData, MapBox, MapRamp, MaterialKind } from './dust2Data';

function createProceduralTexture(kind: MaterialKind): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const rand = (seed: number) => {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  if (kind === 'sand') {
    ctx.fillStyle = '#d4b483';
    ctx.fillRect(0, 0, size, size);
    // Subtle sand ripples & pebbles
    for (let y = 0; y < size; y += 8) {
      ctx.fillStyle = y % 16 === 0 ? 'rgba(180,140,85,0.16)' : 'rgba(245,225,185,0.12)';
      ctx.fillRect(0, y, size, 4);
    }
    for (let i = 0; i < 1600; i++) {
      const px = Math.floor(rand(i) * size);
      const py = Math.floor(rand(i + 5000) * size);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(120,90,55,0.16)' : 'rgba(255,240,210,0.18)';
      ctx.fillRect(px, py, 2, 2);
    }
  } else if (kind === 'stone_floor') {
    ctx.fillStyle = '#b9a68a';
    ctx.fillRect(0, 0, size, size);
    const tile = 64;
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const shade = (rand(x * 13 + y * 31) - 0.5) * 18;
        ctx.fillStyle = `rgb(${185 + shade}, ${166 + shade}, ${138 + shade})`;
        ctx.fillRect(x + 2, y + 2, tile - 4, tile - 4);
        ctx.strokeStyle = 'rgba(85,72,54,0.35)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, tile - 2, tile - 2);
      }
    }
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = 'rgba(70,60,45,0.12)';
      ctx.fillRect(rand(i) * size, rand(i + 999) * size, 2, 2);
    }
  } else if (kind === 'wall_sandstone') {
    ctx.fillStyle = '#ceb086';
    ctx.fillRect(0, 0, size, size);
    // Masonry sandstone courses
    const rows = 8;
    const rowH = size / rows;
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * 32;
      for (let x = -32; x < size; x += 64) {
        const v = (rand(r * 97 + x * 17) - 0.5) * 20;
        ctx.fillStyle = `rgb(${208 + v}, ${176 + v}, ${134 + v})`;
        ctx.fillRect(x + offset + 2, r * rowH + 2, 60, rowH - 4);
      }
      ctx.fillStyle = 'rgba(110,85,55,0.32)';
      ctx.fillRect(0, r * rowH, size, 2);
    }
    // Weathering grime at bottom
    const grad = ctx.createLinearGradient(0, size * 0.65, 0, size);
    grad.addColorStop(0, 'rgba(90,68,42,0)');
    grad.addColorStop(1, 'rgba(90,68,42,0.22)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  } else if (kind === 'wall_plaster') {
    ctx.fillStyle = '#dfd0b4';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i++) {
      const px = rand(i) * size;
      const py = rand(i + 2000) * size;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(160,135,100,0.14)' : 'rgba(255,248,235,0.16)';
      ctx.fillRect(px, py, 6, 4);
    }
    // Trim horizontal bands
    ctx.fillStyle = 'rgba(155,126,88,0.35)';
    ctx.fillRect(0, 0, size, 12);
    ctx.fillRect(0, size - 16, size, 16);
  } else if (kind === 'wall_dark') {
    ctx.fillStyle = '#7d6e5d';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 32) {
      ctx.fillStyle = 'rgba(40,34,28,0.28)';
      ctx.fillRect(0, y, size, 2);
    }
    for (let i = 0; i < 700; i++) {
      ctx.fillStyle = 'rgba(30,24,20,0.18)';
      ctx.fillRect(rand(i) * size, rand(i + 4000) * size, 3, 3);
    }
  } else if (kind === 'crate_wood') {
    ctx.fillStyle = '#9c7344';
    ctx.fillRect(0, 0, size, size);
    // Horizontal planks
    for (let y = 0; y < size; y += 32) {
      const v = (rand(y * 7) - 0.5) * 18;
      ctx.fillStyle = `rgb(${156 + v}, ${115 + v}, ${68 + v})`;
      ctx.fillRect(0, y + 1, size, 30);
      ctx.fillStyle = 'rgba(55,35,16,0.45)';
      ctx.fillRect(0, y, size, 2);
    }
    // Outer frame + diagonal brace
    ctx.strokeStyle = '#5c3f20';
    ctx.lineWidth = 18;
    ctx.strokeRect(9, 9, size - 18, size - 18);
    ctx.beginPath();
    ctx.moveTo(14, 14);
    ctx.lineTo(size - 14, size - 14);
    ctx.stroke();
    ctx.strokeStyle = '#b48752';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, size - 36, size - 36);
  } else if (kind === 'crate_green') {
    ctx.fillStyle = '#4f6246';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#313f2b';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, size - 16, size - 16);
    // Military stencil stripe
    ctx.fillStyle = '#c8b45c';
    ctx.fillRect(28, size / 2 - 10, size - 56, 20);
    ctx.fillStyle = '#2d3728';
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SUPPLY', size / 2, size / 2 + 8);
  } else if (kind === 'door_wood') {
    // Classic Dust2 Mid/B heavy wood & steel banded doors
    ctx.fillStyle = '#735032';
    ctx.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 28) {
      ctx.fillStyle = 'rgba(35,22,12,0.38)';
      ctx.fillRect(x, 0, 3, size);
    }
    // Iron reinforcement bars
    ctx.fillStyle = '#383d42';
    ctx.fillRect(0, 26, size, 16);
    ctx.fillRect(0, size / 2 - 8, size, 16);
    ctx.fillRect(0, size - 42, size, 16);
    ctx.strokeStyle = '#24272b';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, size - 10, size - 10);
  } else if (kind === 'door_metal') {
    // Long Doors blue-steel heavy doors
    ctx.fillStyle = '#475c6e';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#263440';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, size - 14, size - 14);
    ctx.fillStyle = '#314250';
    ctx.fillRect(24, 24, size - 48, size / 2 - 36);
    ctx.fillRect(24, size / 2 + 12, size - 48, size / 2 - 36);
  } else if (kind === 'roof') {
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 32) {
      ctx.fillStyle = 'rgba(40,30,20,0.32)';
      ctx.fillRect(x, 0, 6, size);
    }
  } else if (kind === 'car_metal') {
    ctx.fillStyle = '#5c6b73';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(130,80,45,0.28)';
    ctx.fillRect(0, size * 0.7, size, size * 0.3);
    ctx.strokeStyle = '#2c353b';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, size - 8, size - 8);
  } else if (kind === 'site_a' || kind === 'site_b') {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(210, 180, 130, 0.25)';
    ctx.fillRect(0, 0, size, size);
    // Dashed warning border
    ctx.strokeStyle = '#d93829';
    ctx.lineWidth = 10;
    ctx.setLineDash([22, 12]);
    ctx.strokeRect(10, 10, size - 20, size - 20);
    ctx.setLineDash([]);
    // Big bold stencil A or B
    ctx.fillStyle = 'rgba(217, 56, 41, 0.85)';
    ctx.font = 'bold 148px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(kind === 'site_a' ? 'A' : 'B', size / 2, size / 2 + 6);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function buildRampGeometry(ramp: MapRamp): THREE.BufferGeometry {
  const { x1, z1, x2, z2, yStart, yEnd, axis, thickness } = ramp;

  // Four top corners (TL, TR, BR, BL in XZ)
  const y00 = axis === 'x' ? yStart : yStart; // (x1, z1)
  const y10 = axis === 'x' ? yEnd : yStart;   // (x2, z1)
  const y11 = axis === 'x' ? yEnd : yEnd;     // (x2, z2)
  const y01 = axis === 'x' ? yStart : yEnd;   // (x1, z2)

  const b00 = Math.min(y00, y10, y11, y01) - thickness;

  // 8 vertices of the sloped slab
  const v = [
    [x1, y00, z1], // 0 top NW
    [x2, y10, z1], // 1 top NE
    [x2, y11, z2], // 2 top SE
    [x1, y01, z2], // 3 top SW
    [x1, b00, z1], // 4 bot NW
    [x2, b00, z1], // 5 bot NE
    [x2, b00, z2], // 6 bot SE
    [x1, b00, z2], // 7 bot SW
  ];

  const positions: number[] = [];
  const uvs: number[] = [];

  const pushQuad = (a: number, b: number, c: number, d: number, uScale = 0.25, vScale = 0.25) => {
    const va = v[a], vb = v[b], vc = v[c], vd = v[d];
    const w = Math.hypot(vb[0] - va[0], vb[1] - va[1], vb[2] - va[2]) * uScale;
    const h = Math.hypot(vd[0] - va[0], vd[1] - va[1], vd[2] - va[2]) * vScale;
    // Triangle 1: a, d, c  (CCW when viewed from outside)
    positions.push(...va, ...vd, ...vc);
    uvs.push(0, 0, 0, h, w, h);
    // Triangle 2: a, c, b
    positions.push(...va, ...vc, ...vb);
    uvs.push(0, 0, w, h, w, 0);
  };

  // Top surface (normal points up)
  pushQuad(0, 1, 2, 3);
  // North side (z1)
  pushQuad(1, 0, 4, 5);
  // South side (z2)
  pushQuad(3, 2, 6, 7);
  // West side (x1)
  pushQuad(0, 3, 7, 4);
  // East side (x2)
  pushQuad(2, 1, 5, 6);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

export function buildDust2Scene(scene: THREE.Scene, mapData: Dust2MapData): THREE.Group {
  const mapGroup = new THREE.Group();
  mapGroup.name = 'Dust2Map';

  // Procedural sky dome + sunlit desert atmosphere
  scene.background = new THREE.Color('#8ec5e8');
  scene.fog = new THREE.FogExp2('#d9c8ae', 0.0052);

  // Sky gradient dome
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 16;
  skyCanvas.height = 256;
  const sctx = skyCanvas.getContext('2d')!;
  const sgrad = sctx.createLinearGradient(0, 0, 0, 256);
  sgrad.addColorStop(0.0, '#2c6eb5');
  sgrad.addColorStop(0.45, '#6baad9');
  sgrad.addColorStop(0.75, '#d5c8b0');
  sgrad.addColorStop(1.0, '#d4b483');
  sctx.fillStyle = sgrad;
  sctx.fillRect(0, 0, 16, 256);
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(165, 24, 16),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })
  );
  scene.add(skyDome);

  // Warm Dust2 desert lighting
  const hemi = new THREE.HemisphereLight('#b9dcff', '#a88352', 0.78);
  hemi.position.set(0, 60, 0);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight('#fff2d6', 1.45);
  sun.position.set(48, 72, 36);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 190;
  const d = 64;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // Warm tunnel fill lights inside B Tunnels & Long Doors Room so indoor tunnels read clearly
  const tunnelLight1 = new THREE.PointLight('#ffcc88', 22, 26, 1.5);
  tunnelLight1.position.set(-35, 5.2, 16);
  mapGroup.add(tunnelLight1);

  const tunnelLight2 = new THREE.PointLight('#ffcc88', 22, 26, 1.5);
  tunnelLight2.position.set(-35, 5.2, -2);
  mapGroup.add(tunnelLight2);

  const lowerTunnelLight = new THREE.PointLight('#ffd299', 18, 20, 1.5);
  lowerTunnelLight.position.set(-18, 4.6, -4);
  mapGroup.add(lowerTunnelLight);

  const longRoomLight = new THREE.PointLight('#ffe0b2', 20, 24, 1.5);
  longRoomLight.position.set(36, 6.8, 18);
  mapGroup.add(longRoomLight);

  // Cache base textures
  const baseTextures = new Map<MaterialKind, THREE.CanvasTexture>();
  const kinds: MaterialKind[] = [
    'sand', 'stone_floor', 'wall_sandstone', 'wall_plaster', 'wall_dark',
    'crate_wood', 'crate_green', 'door_wood', 'door_metal', 'roof',
    'site_a', 'site_b', 'car_metal',
  ];
  for (const k of kinds) {
    baseTextures.set(k, createProceduralTexture(k));
  }

  const getMaterialForBox = (box: MapBox): THREE.MeshStandardMaterial => {
    const w = box.x2 - box.x1;
    const h = box.y2 - box.y1;
    const depth = box.z2 - box.z1;

    if (box.material === 'site_a' || box.material === 'site_b') {
      return new THREE.MeshStandardMaterial({
        map: baseTextures.get(box.material)!,
        transparent: true,
        roughness: 0.9,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });
    }

    const baseTex = baseTextures.get(box.material)!;
    const isCrateOrDoor =
      box.material === 'crate_wood' ||
      box.material === 'crate_green' ||
      box.material === 'door_wood' ||
      box.material === 'door_metal' ||
      box.material === 'car_metal';

    let tex = baseTex;
    if (!isCrateOrDoor) {
      tex = baseTex.clone();
      tex.needsUpdate = true;
      const majorSpan = Math.max(w, depth);
      const minorSpan = Math.max(h, Math.min(w, depth));
      tex.repeat.set(Math.max(1, majorSpan / 5), Math.max(1, minorSpan / 5));
    }

    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: box.material === 'car_metal' || box.material === 'door_metal' ? 0.55 : 0.88,
      metalness: box.material === 'car_metal' || box.material === 'door_metal' ? 0.35 : 0.04,
    });
  };

  for (const b of mapData.boxes) {
    const w = b.x2 - b.x1;
    const h = b.y2 - b.y1;
    const depth = b.z2 - b.z1;
    const geom = new THREE.BoxGeometry(w, h, depth);
    const mat = getMaterialForBox(b);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set((b.x1 + b.x2) * 0.5, (b.y1 + b.y2) * 0.5, (b.z1 + b.z2) * 0.5);
    mesh.castShadow = b.solid && b.radarType !== 'floor' && b.radarType !== 'none';
    mesh.receiveShadow = true;
    mesh.userData = { mapSolid: b.solid, boxId: b.id };
    mapGroup.add(mesh);
  }

  for (const r of mapData.ramps) {
    const geom = buildRampGeometry(r);
    const mat = new THREE.MeshStandardMaterial({
      map: baseTextures.get(r.material)!,
      roughness: 0.9,
      metalness: 0.02,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.userData = { mapSolid: true, rampId: r.id };
    mapGroup.add(mesh);
  }

  // Add subtle architectural desert trim / parapet cornices & site signboards for Dust2 landmarks
  addSiteWallSign(mapGroup, 'A', 47.8, 6.2, -37.0, -Math.PI / 2);
  addSiteWallSign(mapGroup, 'B', -45.8, 3.6, -31.5, Math.PI / 2);
  addSiteWallSign(mapGroup, 'MID', -8.0, 6.2, -18.7, 0);

  // Decorative rooftop domes / desert minaret towers outside playable bounds for Dust2 skyline feel
  const skylineMat = new THREE.MeshStandardMaterial({ color: '#d7be98', roughness: 0.92 });
  const domeMat = new THREE.MeshStandardMaterial({ color: '#c4a678', roughness: 0.85 });
  const towerPositions = [
    [-56, 11, -35],
    [56, 13, -38],
    [20, 12, -55],
    [-26, 12, 56],
    [54, 11, 20],
  ];
  for (const [tx, ty, tz] of towerPositions) {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(8, ty * 2, 8), skylineMat);
    tower.position.set(tx, ty, tz);
    mapGroup.add(tower);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(3.8, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    dome.position.set(tx, ty * 2, tz);
    mapGroup.add(dome);
  }

  scene.add(mapGroup);
  return mapGroup;
}

function addSiteWallSign(
  group: THREE.Group,
  label: string,
  x: number,
  y: number,
  z: number,
  rotY: number
): void {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'rgba(205, 175, 132, 0.1)';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#c82d20';
  ctx.font = 'bold 92px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 128, 66);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.1),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  plane.position.set(x, y, z);
  plane.rotation.y = rotY;
  group.add(plane);
}
