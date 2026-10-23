import * as THREE from 'three';

export interface Collider {
  box: THREE.Box3;
  kind: 'building' | 'crate' | 'door' | 'boundary' | 'roof';
}

export interface NavNode {
  id: string;
  position: THREE.Vector3;
  links: string[];
}

export interface MapZone {
  name: string;
  x1: number;
  x2: number;
  z1: number;
  z2: number;
}

export interface GameMap {
  group: THREE.Group;
  colliders: Collider[];
  nodes: NavNode[];
  zones: MapZone[];
  bombSites: { A: MapZone; B: MapZone };
  spawns: Record<'CT' | 'T', THREE.Vector3[]>;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
}

const sand = new THREE.MeshStandardMaterial({ color: 0xbca47c, roughness: 0.96 });
const pale = new THREE.MeshStandardMaterial({ color: 0xcab58f, roughness: 0.94 });
const darkSand = new THREE.MeshStandardMaterial({ color: 0x9b835f, roughness: 1 });
const trim = new THREE.MeshStandardMaterial({ color: 0xd5c39e, roughness: 0.9 });
const wood = new THREE.MeshStandardMaterial({ color: 0x72513a, roughness: 0.88 });
const woodEdge = new THREE.MeshStandardMaterial({ color: 0x47372a, roughness: 0.9 });
const metal = new THREE.MeshStandardMaterial({ color: 0x444b48, roughness: 0.7, metalness: 0.35 });
const dark = new THREE.MeshStandardMaterial({ color: 0x292f2c, roughness: 0.85 });
const crateMat = new THREE.MeshStandardMaterial({ color: 0x867052, roughness: 0.9 });

function boxMesh(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addSign(group: THREE.Group, text: string, subtext: string, position: THREE.Vector3, rotationY: number, color = '#e7d7ad') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 512, 256);
  ctx.strokeStyle = color;
  ctx.lineWidth = 9;
  ctx.globalAlpha = 0.82;
  ctx.strokeRect(20, 20, 472, 216);
  ctx.fillStyle = color;
  ctx.font = 'bold 142px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, subtext ? 115 : 135);
  if (subtext) {
    ctx.font = 'bold 29px Arial';
    ctx.fillText(subtext, 256, 211);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 1.9), material);
  sign.position.copy(position);
  sign.rotation.y = rotationY;
  group.add(sign);
}

export function createMap(): GameMap {
  const group = new THREE.Group();
  const colliders: Collider[] = [];
  group.name = 'Dust2 procedural map';

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(96, 94), new THREE.MeshStandardMaterial({ color: 0xa89570, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.025, 0);
  ground.receiveShadow = true;
  group.add(ground);

  const patchMaterial = new THREE.MeshStandardMaterial({ color: 0x9b8969, roughness: 1 });
  const patches: Array<[number, number, number, number]> = [
    [0, 34, 18, 17], [36, 7, 13, 38], [31, -28, 27, 22], [-36, -25, 20, 20],
    [-39, 10, 9, 36], [0, -35, 22, 16], [0, 5, 9, 42], [20, -12, 23, 8],
  ];
  for (const [x, z, w, d] of patches) {
    const patch = new THREE.Mesh(new THREE.PlaneGeometry(w, d), patchMaterial);
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(x, -0.012, z);
    patch.receiveShadow = true;
    group.add(patch);
  }

  const addCollider = (x1: number, x2: number, z1: number, z2: number, height: number, kind: Collider['kind'], y0 = 0) => {
    colliders.push({ box: new THREE.Box3(new THREE.Vector3(x1, y0, z1), new THREE.Vector3(x2, y0 + height, z2)), kind });
  };

  const addBlock = (x1: number, x2: number, z1: number, z2: number, height: number, material: THREE.Material = sand, kind: Collider['kind'] = 'building') => {
    const mesh = boxMesh(x2 - x1, height, z2 - z1, material);
    mesh.position.set((x1 + x2) / 2, height / 2, (z1 + z2) / 2);
    group.add(mesh);
    addCollider(x1, x2, z1, z2, height, kind);
    if (kind === 'building') {
      const cap = boxMesh(x2 - x1 + 0.16, 0.16, z2 - z1 + 0.16, trim);
      cap.position.set((x1 + x2) / 2, height - 0.12, (z1 + z2) / 2);
      group.add(cap);
    }
    return mesh;
  };

  addBlock(-47, -45.8, -46, 47, 7, darkSand, 'boundary');
  addBlock(45.8, 47, -46, 47, 7, pale, 'boundary');
  addBlock(-47, 47, 45.8, 47, 7, sand, 'boundary');
  addBlock(-47, 47, -46, -44.8, 7, darkSand, 'boundary');

  addBlock(-34, -5, -12, 24, 6.8, sand);
  addBlock(6, 30, -7, 25, 7.2, pale);
  addBlock(-21, -6, -28, -12, 5.7, darkSand);
  addBlock(5, 15, -29, -16, 5.4, sand);
  addBlock(-45.8, -43.6, 10, 17, 4.4, pale);
  addBlock(-15, -5, 36, 45.8, 5.2, pale);
  addBlock(12, 24, 38, 45.8, 4.8, sand);
  addBlock(38, 45.8, 34, 45.8, 5.7, pale);
  addBlock(-45.8, -37, -44.8, -39, 4.2, sand);
  addBlock(31, 45.8, -44.8, -40, 4.6, pale);

  const tunnelRoof = boxMesh(11.8, 0.28, 34, darkSand);
  tunnelRoof.position.set(-39.9, 3.35, 6.5);
  group.add(tunnelRoof);
  addCollider(-45.8, -34, -10.5, 23.5, 0.28, 'roof', 3.21);
  for (const z of [-8, 2, 12, 22]) {
    const beam = boxMesh(11.5, 0.22, 0.24, woodEdge);
    beam.position.set(-39.9, 3.12, z);
    group.add(beam);
  }

  const addCrate = (x: number, z: number, size = 1.65, height = 1.45) => {
    const crate = addBlock(x - size / 2, x + size / 2, z - size / 2, z + size / 2, height, crateMat, 'crate');
    const edges = [
      [size + 0.035, 0.11, 0.08, 0, height * 0.2, size / 2 + 0.02],
      [size + 0.035, 0.11, 0.08, 0, height * 0.8, size / 2 + 0.02],
      [0.09, height, 0.08, -size * 0.38, height / 2, size / 2 + 0.025],
      [0.09, height, 0.08, size * 0.38, height / 2, size / 2 + 0.025],
    ];
    for (const [w, h, d, ox, oy, oz] of edges) {
      const edge = boxMesh(w, h, d, woodEdge);
      edge.position.set(x + ox, oy, z + oz);
      group.add(edge);
    }
    return crate;
  };

  addCrate(38.7, -22.5, 2.1, 1.65);
  addCrate(35.8, -24.8, 1.7, 1.35);
  addCrate(25.2, -34.4, 1.8, 1.5);
  addCrate(40.5, 11.5, 1.8, 1.4);
  addCrate(32.8, 24.3, 1.55, 1.3);
  addCrate(-38.5, -26.3, 2, 1.55);
  addCrate(-27.2, -19.2, 1.7, 1.35);
  addCrate(-40.2, 18.3, 1.5, 1.3);
  addCrate(-2.8, 31.4, 1.55, 1.3);
  addCrate(5.2, -37.5, 1.7, 1.4);

  const doorZ = 4.2;
  addBlock(-5.05, -1.25, doorZ - 0.2, doorZ + 0.2, 3.8, wood, 'door');
  addBlock(1.25, 6.05, doorZ - 0.2, doorZ + 0.2, 3.8, wood, 'door');
  addBlock(-6, -5.02, doorZ - 0.34, doorZ + 0.34, 4.8, darkSand, 'door');
  addBlock(6.02, 7, doorZ - 0.34, doorZ + 0.34, 4.8, darkSand, 'door');
  for (const side of [-1, 1]) {
    const cx = side < 0 ? -3.15 : 3.65;
    for (const y of [0.55, 1.65, 2.75]) {
      const panel = boxMesh(3.1, 0.07, 0.07, woodEdge);
      panel.position.set(cx, y, doorZ - 0.245);
      group.add(panel);
    }
    for (const offset of [-1.25, 1.25]) {
      const brace = boxMesh(0.1, 3.5, 0.08, woodEdge);
      brace.position.set(cx + offset, 1.85, doorZ - 0.25);
      group.add(brace);
    }
    const handle = boxMesh(0.1, 0.42, 0.13, metal);
    handle.position.set(side * 1.48, 1.5, doorZ - 0.29);
    group.add(handle);
  }
  const header = boxMesh(13, 1.05, 0.75, darkSand);
  header.position.set(0.5, 4.3, doorZ);
  group.add(header);

  const windowPositions: Array<[number, number, number, number, number]> = [
    [-4.96, 3.5, 12, Math.PI / 2, 0], [-4.96, 3.5, 18, Math.PI / 2, 0],
    [5.96, 4.1, 9, -Math.PI / 2, 0], [5.96, 4.1, 17, -Math.PI / 2, 0],
    [15.04, 3.3, -23, Math.PI / 2, 0], [-21.04, 3.1, -19, -Math.PI / 2, 0],
  ];
  for (const [x, y, z, ry] of windowPositions) {
    const frame = boxMesh(0.09, 1.5, 1.75, trim);
    frame.position.set(x, y, z);
    group.add(frame);
    const window = boxMesh(0.105, 1.15, 1.4, dark);
    window.position.set(x + (ry > 0 ? 0.02 : -0.02), y, z);
    group.add(window);
    for (const dz of [-0.38, 0, 0.38]) {
      const bar = boxMesh(0.13, 1.18, 0.045, metal);
      bar.position.set(x + (ry > 0 ? 0.04 : -0.04), y, z + dz);
      group.add(bar);
    }
  }

  for (const [x, z, h] of [[-3, 40, 6], [42, 28, 7], [-43, -9, 6]] as Array<[number, number, number]>) {
    const pole = boxMesh(0.16, h, 0.16, woodEdge);
    pole.position.set(x, h / 2, z);
    group.add(pole);
    const cross = boxMesh(2.1, 0.13, 0.13, woodEdge);
    cross.position.set(x, h - 0.45, z);
    group.add(cross);
  }

  addSign(group, 'A', 'BOMBSITE', new THREE.Vector3(45.74, 3.2, -27), -Math.PI / 2, '#d9b687');
  addSign(group, 'B', 'BOMBSITE', new THREE.Vector3(-45.74, 3.2, -22), Math.PI / 2, '#d9b687');
  addSign(group, 'A →', 'LONG', new THREE.Vector3(29.94, 2.8, 19), -Math.PI / 2);
  addSign(group, 'B →', 'TUNNELS', new THREE.Vector3(-34.06, 2.7, 14), Math.PI / 2);
  addSign(group, 'MID', 'DOUBLE DOORS', new THREE.Vector3(-4.94, 4.6, 2), Math.PI / 2);

  const nodes: NavNode[] = [
    { id: 't', position: new THREE.Vector3(1, 0, 34), links: ['tMid', 'tLong', 'tB'] },
    { id: 'tMid', position: new THREE.Vector3(0, 0, 27), links: ['t', 'midN', 'tLong', 'tB'] },
    { id: 'midN', position: new THREE.Vector3(0, 0, 13), links: ['tMid', 'doorN'] },
    { id: 'doorN', position: new THREE.Vector3(0, 0, 7), links: ['midN', 'doorS'] },
    { id: 'doorS', position: new THREE.Vector3(0, 0, 1), links: ['doorN', 'mid'] },
    { id: 'mid', position: new THREE.Vector3(0, 0, -8), links: ['doorS', 'ctMid', 'catEntry'] },
    { id: 'ctMid', position: new THREE.Vector3(0, 0, -22), links: ['mid', 'ct'] },
    { id: 'ct', position: new THREE.Vector3(0, 0, -36), links: ['ctMid', 'ctA', 'ctB'] },
    { id: 'tLong', position: new THREE.Vector3(20, 0, 31), links: ['t', 'tMid', 'longN'] },
    { id: 'longN', position: new THREE.Vector3(36, 0, 29), links: ['tLong', 'long1'] },
    { id: 'long1', position: new THREE.Vector3(35, 0, 17), links: ['longN', 'long2'] },
    { id: 'long2', position: new THREE.Vector3(36, 0, 1), links: ['long1', 'longA'] },
    { id: 'longA', position: new THREE.Vector3(36, 0, -14), links: ['long2', 'a', 'aCross'] },
    { id: 'aCross', position: new THREE.Vector3(29, 0, -20), links: ['longA', 'a', 'cat'] },
    { id: 'a', position: new THREE.Vector3(32, 0, -30), links: ['aCross', 'longA', 'aSouth'] },
    { id: 'aSouth', position: new THREE.Vector3(28, 0, -36.5), links: ['a', 'ctA'] },
    { id: 'ctA', position: new THREE.Vector3(16, 0, -36.5), links: ['aSouth', 'ct'] },
    { id: 'catEntry', position: new THREE.Vector3(9, 0, -10), links: ['mid', 'catTurn'] },
    { id: 'catTurn', position: new THREE.Vector3(22, 0, -10), links: ['catEntry', 'cat'] },
    { id: 'cat', position: new THREE.Vector3(23, 0, -20), links: ['catTurn', 'aCross', 'a'] },
    { id: 'tB', position: new THREE.Vector3(-20, 0, 32), links: ['t', 'tMid', 'bN'] },
    { id: 'bN', position: new THREE.Vector3(-39, 0, 30), links: ['tB', 'b1'] },
    { id: 'b1', position: new THREE.Vector3(-39, 0, 20), links: ['bN', 'b2'] },
    { id: 'b2', position: new THREE.Vector3(-39, 0, 1), links: ['b1', 'bExit'] },
    { id: 'bExit', position: new THREE.Vector3(-39, 0, -14), links: ['b2', 'b'] },
    { id: 'b', position: new THREE.Vector3(-33, 0, -27), links: ['bExit', 'bSouth'] },
    { id: 'bSouth', position: new THREE.Vector3(-23, 0, -35), links: ['b', 'ctB'] },
    { id: 'ctB', position: new THREE.Vector3(-12, 0, -36), links: ['bSouth', 'ct'] },
  ];

  const bombSites = {
    A: { name: 'A点', x1: 20, x2: 44, z1: -38, z2: -18 },
    B: { name: 'B点', x1: -43, x2: -24, z1: -35, z2: -17 },
  };
  const zones: MapZone[] = [
    { name: 'T 出生点', x1: -8, x2: 11, z1: 32, z2: 45 },
    { name: 'CT 出生点', x1: -8, x2: 14, z1: -44, z2: -31 },
    { name: 'A大', x1: 30, x2: 45, z1: -17, z2: 32 },
    { name: '猫道', x1: 7, x2: 29, z1: -23, z2: -7 },
    { name: 'B洞', x1: -45, x2: -34, z1: -16, z2: 32 },
    { name: '中门', x1: -5, x2: 6, z1: -13, z2: 29 },
    bombSites.A,
    bombSites.B,
    { name: 'A 连接', x1: 14, x2: 25, z1: -40, z2: -29 },
    { name: 'B 连接', x1: -25, x2: -7, z1: -43, z2: -28 },
    { name: 'T 广场', x1: -34, x2: 30, z1: 25, z2: 38 },
  ];
  const spawns = {
    T: [[-3, 40], [0, 40], [3, 40], [-3, 36.5], [3, 36.5]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
    CT: [[-3, -41], [0, -41], [3, -41], [-2, -37.5], [8, -34]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
  };

  return { group, colliders, nodes, zones, bombSites, spawns, bounds: { minX: -45.8, maxX: 45.8, minZ: -44.8, maxZ: 45.8 } };
}

export function collidesAt(map: GameMap, x: number, z: number, y: number, radius = 0.36, height = 1.76) {
  for (const collider of map.colliders) {
    const b = collider.box;
    if (y >= b.max.y - 0.035 || y + height <= b.min.y) continue;
    const nx = Math.max(b.min.x, Math.min(x, b.max.x));
    const nz = Math.max(b.min.z, Math.min(z, b.max.z));
    const dx = x - nx;
    const dz = z - nz;
    if (dx * dx + dz * dz < radius * radius) return true;
  }
  return false;
}

export function moveWithCollisions(map: GameMap, position: THREE.Vector3, dx: number, dz: number, radius = 0.36) {
  const nextX = position.x + dx;
  if (!collidesAt(map, nextX, position.z, position.y, radius)) position.x = nextX;
  const nextZ = position.z + dz;
  if (!collidesAt(map, position.x, nextZ, position.y, radius)) position.z = nextZ;
}

export function supportHeight(map: GameMap, position: THREE.Vector3, nextY: number, radius = 0.32) {
  let support = 0;
  if (nextY <= 0) return 0;
  for (const { box } of map.colliders) {
    if (box.max.y > position.y + 0.06 || box.max.y < nextY - 0.01) continue;
    if (position.x < box.min.x - radius || position.x > box.max.x + radius || position.z < box.min.z - radius || position.z > box.max.z + radius) continue;
    support = Math.max(support, box.max.y);
  }
  return support;
}

export function raycastWorld(map: GameMap, origin: THREE.Vector3, direction: THREE.Vector3, maxDistance: number) {
  const ray = new THREE.Ray(origin, direction);
  let closest = maxDistance;
  let hit: THREE.Vector3 | null = null;
  for (const { box } of map.colliders) {
    const point = ray.intersectBox(box, new THREE.Vector3());
    if (!point) continue;
    const distance = point.distanceTo(origin);
    if (distance < closest && distance > 0.015) {
      closest = distance;
      hit = point;
    }
  }
  if (direction.y < -0.0001) {
    const distance = -origin.y / direction.y;
    if (distance > 0 && distance < closest) {
      closest = distance;
      hit = origin.clone().addScaledVector(direction, distance);
    }
  }
  return hit ? { distance: closest, point: hit } : null;
}

export function hasLineOfSight(map: GameMap, from: THREE.Vector3, to: THREE.Vector3) {
  const delta = to.clone().sub(from);
  const distance = delta.length();
  if (distance < 0.001) return true;
  const hit = raycastWorld(map, from, delta.multiplyScalar(1 / distance), distance);
  return !hit || hit.distance >= distance - 0.12;
}

export function segmentWalkable(map: GameMap, from: THREE.Vector3, to: THREE.Vector3, radius = 0.4) {
  const distance = from.distanceTo(to);
  const steps = Math.max(1, Math.ceil(distance / 0.35));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = THREE.MathUtils.lerp(from.x, to.x, t);
    const z = THREE.MathUtils.lerp(from.z, to.z, t);
    if (collidesAt(map, x, z, 0, radius)) return false;
  }
  return true;
}

export function locationAt(map: GameMap, x: number, z: number) {
  for (const zone of map.zones) {
    if (x >= zone.x1 && x <= zone.x2 && z >= zone.z1 && z <= zone.z2) return zone.name;
  }
  return 'Dust2';
}

export function bombSiteAt(map: GameMap, x: number, z: number): 'A' | 'B' | null {
  for (const key of ['A', 'B'] as const) {
    const site = map.bombSites[key];
    if (x >= site.x1 && x <= site.x2 && z >= site.z1 && z <= site.z2) return key;
  }
  return null;
}
