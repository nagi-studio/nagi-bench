import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const C = {
  wood: 0x6f3528,
  woodLight: 0xa15c3b,
  woodDark: 0x321f1b,
  bronze: 0xb58a45,
  gold: 0xe0bc71,
  copper: 0x8f4d2e,
  jade: 0x56bdb3,
  roof: 0x183f3c,
  stone: 0x263b3b,
  ink: 0x0c272a,
  red: 0xb94b37,
};

export function createMaterials() {
  const standard = (color, roughness = 0.6, metalness = 0) => metalness > 0.18
    ? new THREE.MeshPhongMaterial({ color, shininess: 28 + metalness * 72, specular: new THREE.Color(color).multiplyScalar(0.72) })
    : new THREE.MeshLambertMaterial({ color });
  return {
    wood: standard(C.wood, 0.58),
    woodLight: standard(C.woodLight, 0.52),
    woodDark: standard(C.woodDark, 0.72),
    bronze: standard(C.bronze, 0.31, 0.72),
    gold: standard(C.gold, 0.27, 0.78),
    copper: standard(C.copper, 0.38, 0.65),
    roof: standard(C.roof, 0.4, 0.25),
    roofEdge: standard(0x42685b, 0.38, 0.4),
    stone: standard(C.stone, 0.88),
    stoneLight: standard(0x405552, 0.78),
    ink: standard(C.ink, 0.65, 0.2),
    red: standard(C.red, 0.46, 0.12),
    cream: standard(0xe4d2a5, 0.7),
    water: new THREE.MeshPhongMaterial({ color: 0x3bafa9, shininess: 85, specular: 0x80c8bd, transparent: true, opacity: 0.76, emissive: 0x0b5556, emissiveIntensity: 0.35 }),
    waterDrop: new THREE.MeshPhongMaterial({ color: 0x8ef2e4, shininess: 95, specular: 0xb9fff3, transparent: true, opacity: 0.86, emissive: 0x1b7773, emissiveIntensity: 0.65 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xf1c47a, transparent: true, opacity: 0.8 }),
  };
}

export function mesh(parent, geometry, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

export function box(parent, w, h, d, material, x = 0, y = 0, z = 0, rz = 0) {
  const m = mesh(parent, new THREE.BoxGeometry(w, h, d), material, x, y, z);
  m.rotation.z = rz;
  return m;
}

export function roundBox(parent, w, h, d, material, x = 0, y = 0, z = 0, radius = 0.04) {
  return mesh(parent, new RoundedBoxGeometry(w, h, d, 2, radius), material, x, y, z);
}

export function cylinder(parent, r, h, material, x = 0, y = 0, z = 0, segments = 32) {
  return mesh(parent, new THREE.CylinderGeometry(r, r, h, segments), material, x, y, z);
}

export function torus(parent, radius, tube, material, x = 0, y = 0, z = 0, radial = 8, tubular = 64) {
  return mesh(parent, new THREE.TorusGeometry(radius, tube, radial, tubular), material, x, y, z);
}

export function tube(parent, points, radius, material, segments = 32) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  return mesh(parent, new THREE.TubeGeometry(curve, segments, radius, 6, false), material);
}

export function anchor(parent, x, y, z) {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  parent.add(o);
  return o;
}

/** Merge only the render geometry. Physics remains compound and independent. */
export function bakeGroup(root) {
  root.updateMatrixWorld(true);
  const inverse = root.matrixWorld.clone().invert();
  const batches = new Map();
  const originals = [];
  root.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.userData.noBake) return;
    const key = `${o.material.uuid}/${o.castShadow}/${o.receiveShadow}`;
    if (!batches.has(key)) batches.set(key, { material: o.material, geometries: [], cast: o.castShadow, receive: o.receiveShadow });
    let g = o.geometry.clone();
    if (g.index) g = g.toNonIndexed();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
    batches.get(key).geometries.push(g);
    originals.push(o);
  });
  for (const o of originals) o.removeFromParent();
  for (const batch of batches.values()) {
    const geometry = mergeGeometries(batch.geometries, false);
    if (!geometry) continue;
    const m = new THREE.Mesh(geometry, batch.material);
    m.castShadow = batch.cast;
    m.receiveShadow = batch.receive;
    root.add(m);
    for (const g of batch.geometries) g.dispose();
  }
}

function roofGeometry(side, isHip = false) {
  const positions = [], uvs = [], indices = [];
  const nu = 24, nv = 9;
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    for (let i = 0; i <= nu; i++) {
      const u = i / nu * 2 - 1;
      let x, z;
      if (!isHip) {
        x = u * (1.2 + 2.35 * v);
        z = side * (0.02 + 2.05 * v);
      } else {
        x = side * (1.2 + 2.35 * v);
        z = u * 2.07 * v;
      }
      const y = 10.08 + 0.84 * Math.pow(1 - v, 1.45) + 0.19 * Math.pow(v, 6) + 0.15 * Math.pow(Math.abs(u), 6) * v * v;
      positions.push(x, y, z);
      uvs.push(i / nu, v);
      if (i < nu && j < nv) {
        const a = j * (nu + 1) + i, b = a + nu + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function plaqueMaterial(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 768; canvas.height = 192;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#152c29'; ctx.fillRect(0, 0, 768, 192);
  ctx.strokeStyle = '#aa854c'; ctx.lineWidth = 5; ctx.strokeRect(12, 12, 744, 168);
  ctx.strokeStyle = '#5f563a'; ctx.lineWidth = 2; ctx.strokeRect(22, 22, 724, 148);
  ctx.fillStyle = '#ddc181'; ctx.font = '76px "Noto Serif CJK SC", "Songti SC", serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text.split('').join('  '), 384, 100);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map, roughness: 0.55, metalness: 0.15, emissive: 0x3c321b, emissiveIntensity: 0.16 });
}

export function buildTower(scene, M) {
  const g = new THREE.Group();
  scene.add(g);

  // An octagonal museum-like plinth keeps the cutaway visually grounded.
  const plinth = cylinder(g, 4.65, 0.34, M.stone, 0, -0.22, 0, 8);
  plinth.scale.z = 0.78; plinth.rotation.y = Math.PI / 8;
  const plinthTop = cylinder(g, 4.38, 0.08, M.stoneLight, 0, -0.01, 0, 8);
  plinthTop.scale.z = 0.76; plinthTop.rotation.y = Math.PI / 8;
  const inset = cylinder(g, 3.95, 0.025, M.ink, 0, 0.045, 0, 64);
  inset.scale.z = 0.75;
  for (const r of [3.45, 3.65]) {
    const ring = torus(g, r, 0.012, M.bronze, 0, 0.065, 0, 4, 96);
    ring.rotation.x = Math.PI / 2; ring.scale.y = 0.75;
  }

  roundBox(g, 6.5, 0.22, 3.65, M.woodDark, 0, 0.25, 0, 0.05);
  roundBox(g, 6.18, 0.12, 3.35, M.woodLight, 0, 0.4, 0, 0.03);
  // The lower basin; the front wall is deliberately cut low.
  roundBox(g, 4.8, 0.25, 2.75, M.stone, -0.55, 0.5, 0, 0.05);
  box(g, 4.35, 0.035, 2.35, M.water, -0.55, 0.64, 0);
  box(g, 4.8, 0.42, 0.15, M.stoneLight, -0.55, 0.68, -1.31);
  box(g, 0.15, 0.42, 2.75, M.stoneLight, -2.88, 0.68, 0);
  box(g, 0.15, 0.42, 2.75, M.stoneLight, 1.78, 0.68, 0);
  box(g, 4.8, 0.2, 0.12, M.stoneLight, -0.55, 0.58, 1.31);

  const postX = [-3.0, 3.0], postZ = [-1.42, 1.42];
  for (const x of postX) for (const z of postZ) {
    roundBox(g, 0.25, 9.65, 0.25, M.wood, x, 5.25, z, 0.035);
    cylinder(g, 0.24, 0.16, M.stoneLight, x, 0.5, z, 8);
    for (const y of [0.72, 3.82, 6.8, 9.82]) {
      box(g, 0.34, 0.12, 0.34, M.bronze, x, y, z);
    }
  }

  // Open floors and rear balustrades expose the entire causal chain.
  for (const y of [3.82, 6.82]) {
    roundBox(g, 6.25, 0.18, 1.15, M.woodDark, 0, y, -0.88, 0.025);
    box(g, 6.4, 0.18, 0.2, M.woodLight, 0, y, 1.42);
    box(g, 6.4, 0.24, 0.2, M.wood, 0, y - 0.24, -1.42);
    for (const x of [-3, 3]) box(g, 0.2, 0.2, 3.0, M.woodLight, x, y, 0);
    for (let x = -2.75; x <= 2.76; x += 0.5) box(g, 0.045, 0.67, 0.055, M.woodLight, x, y + 0.4, -1.35);
    box(g, 5.85, 0.07, 0.07, M.bronze, 0, y + 0.73, -1.35);
    box(g, 5.85, 0.07, 0.07, M.woodLight, 0, y + 0.24, -1.35);
    for (const x of [-2.75, 2.75]) {
      for (const z of [-0.9, -0.35, 0.2, 0.75]) box(g, 0.05, 0.65, 0.05, M.woodLight, x, y + 0.4, z);
      box(g, 0.07, 0.07, 2.2, M.bronze, x, y + 0.72, -0.1);
    }
  }

  // Rear lattice and cross-bracing, never an opaque wall.
  for (const y of [2.0, 5.25]) {
    for (const x of [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4]) box(g, 0.05, 2.45, 0.06, M.woodDark, x, y, -1.48);
    for (const dy of [-1.1, 0, 1.1]) box(g, 5.45, 0.06, 0.06, M.woodDark, 0, y + dy, -1.48);
  }
  for (const x of [-2.92, 2.92]) {
    const b1 = box(g, 0.09, 3.15, 0.08, M.woodDark, x, 2.15, -1.46, 0.72);
    b1.rotation.y = 0;
  }

  // Layered dougong brackets under the pavilion roof.
  for (const x of [-2.85, -1.45, 0, 1.45, 2.85]) for (const z of [-1.35, 1.35]) {
    box(g, 0.55, 0.12, 0.34, M.woodLight, x, 9.8, z);
    box(g, 0.36, 0.16, 0.52, M.wood, x, 9.96, z);
    box(g, 0.78, 0.1, 0.22, M.bronze, x, 10.08, z);
  }
  box(g, 6.65, 0.24, 0.25, M.woodDark, 0, 10.04, 1.46);
  box(g, 6.65, 0.24, 0.25, M.woodDark, 0, 10.04, -1.46);
  const plaque = mesh(g, new THREE.PlaneGeometry(2.25, 0.55), plaqueMaterial('水运仪象台'), 0, 9.91, 1.602);
  plaque.castShadow = false;

  for (const side of [-1, 1]) {
    mesh(g, roofGeometry(side, false), M.roof);
    mesh(g, roofGeometry(side, true), M.roof);
    const eave = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24 * 2 - 1;
      eave.push([u * 3.55, 10.27 + 0.15 * Math.pow(Math.abs(u), 6), side * 2.07]);
    }
    tube(g, eave, 0.06, M.roofEdge, 48);
    for (let i = 0; i <= 16; i++) {
      const u = i / 16 * 2 - 1, points = [];
      for (let j = 0; j <= 9; j++) {
        const v = j / 9;
        points.push([u * (1.2 + 2.35 * v), 10.095 + 0.84 * Math.pow(1 - v, 1.45) + 0.19 * Math.pow(v, 6) + 0.15 * Math.pow(Math.abs(u), 6) * v * v, side * (0.02 + 2.05 * v)]);
      }
      tube(g, points, 0.018, M.roofEdge, 18);
    }
  }
  tube(g, [[-1.42, 11.0, 0], [-1.2, 10.95, 0], [0, 10.94, 0], [1.2, 10.95, 0], [1.42, 11.0, 0]], 0.09, M.roofEdge, 36);
  for (const x of [-1.43, 1.43]) {
    const finial = mesh(g, new THREE.ConeGeometry(0.12, 0.48, 8), M.bronze, x, 11.15, 0);
    finial.rotation.z = x < 0 ? -0.65 : 0.65;
  }

  // Small lanterns add warmth without hiding the machines.
  for (const x of [-2.55, 2.55]) {
    cylinder(g, 0.015, 0.4, M.bronze, x, 6.56, 1.15, 8);
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xc45b3b, roughness: 0.6, emissive: 0xa83b18, emissiveIntensity: 0.5 });
    const lantern = cylinder(g, 0.16, 0.36, lanternMat, x, 6.22, 1.15, 12);
    lantern.scale.set(1, 1, 1);
    cylinder(g, 0.19, 0.045, M.woodDark, x, 6.42, 1.15, 12);
    cylinder(g, 0.19, 0.045, M.woodDark, x, 6.02, 1.15, 12);
  }

  bakeGroup(g);

  // Quiet astronomical drafting marks in the far background.
  const stars = [];
  let seed = 1092;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 170; i++) stars.push((random() - 0.5) * 36, random() * 18 - 1, -8 - random() * 9);
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  const starPoints = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x93b9a9, size: 0.027, transparent: true, opacity: 0.42, sizeAttenuation: true }));
  scene.add(starPoints);

  const ground = mesh(scene, new THREE.CircleGeometry(24, 64), new THREE.MeshLambertMaterial({ color: 0x0a2427 }), 0, -0.41, 0);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.castShadow = false;
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 256;
  const shadowCtx = shadowCanvas.getContext('2d');
  const shadowGradient = shadowCtx.createRadialGradient(128, 128, 25, 128, 128, 126);
  shadowGradient.addColorStop(0, 'rgba(0,0,0,.58)');
  shadowGradient.addColorStop(0.55, 'rgba(0,0,0,.28)');
  shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
  shadowCtx.fillStyle = shadowGradient; shadowCtx.fillRect(0, 0, 256, 256);
  const shadow = mesh(scene, new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }), 0, -0.399, 0);
  shadow.rotation.x = -Math.PI / 2; shadow.castShadow = false; shadow.receiveShadow = false;

  return {
    anchors: {
      towerTop: anchor(scene, 0.4, 8.8, 0.7),
      towerMiddle: anchor(scene, 0.5, 5.0, 0.8),
      towerBottom: anchor(scene, -0.9, 2.2, 0.6),
    },
  };
}

export function makeDialMaterial() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const c = 512;
  const gradient = ctx.createRadialGradient(c, c, 50, c, c, 500);
  gradient.addColorStop(0, '#24433d'); gradient.addColorStop(0.72, '#152f2e'); gradient.addColorStop(1, '#0b2225');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1024, 1024);
  ctx.translate(c, c);
  for (const [r, width, color] of [[477, 8, '#b28b4d'], [445, 2, '#756a45'], [340, 3, '#937944'], [120, 3, '#756a45']]) {
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.lineWidth = width; ctx.strokeStyle = color; ctx.stroke();
  }
  const hours = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 - Math.PI / 2;
    ctx.save(); ctx.rotate(a + Math.PI / 2);
    ctx.fillStyle = i === 6 ? '#f0b08a' : '#dbc185';
    ctx.font = `${i === 6 ? 'bold ' : ''}72px "Noto Serif CJK SC", "Songti SC", serif`;
    ctx.fillText(hours[i], 0, -390);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * 337, Math.sin(a) * 337); ctx.lineTo(Math.cos(a) * 360, Math.sin(a) * 360); ctx.strokeStyle = '#b89a5c'; ctx.lineWidth = 4; ctx.stroke();
  }
  ctx.fillStyle = '#b79a5e'; ctx.font = '30px serif'; ctx.fillText('昼 夜 时 辰 轮', 0, 55);
  ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.fillStyle = '#d1ad66'; ctx.fill();
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map, roughness: 0.52, metalness: 0.24, emissive: 0x102d28, emissiveIntensity: 0.22 });
}
