import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { AABB } from './types';

export const CELL = 2;
export const BOUNDS = { minX: -56, maxX: 58, minZ: -48, maxZ: 52 };
export const COLS = (BOUNDS.maxX - BOUNDS.minX) / CELL;
export const ROWS = (BOUNDS.maxZ - BOUNDS.minZ) / CELL;
export interface Area { name: string; x1: number; x2: number; z1: number; z2: number; color: string }
// An intentionally compressed, fully connected Dust II layout. North is CT, south is T.
export const AREAS: Area[] = [
  { name: 'T SPAWN', x1: -18, x2: 20, z1: 34, z2: 48, color: '#b5a077' },
  { name: 'T RAMP', x1: -6, x2: 8, z1: 12, z2: 40, color: '#b5a077' },
  { name: 'OUTSIDE LONG', x1: 14, x2: 38, z1: 28, z2: 42, color: '#ad9977' },
  { name: 'LONG DOORS', x1: 28, x2: 42, z1: 18, z2: 34, color: '#a99779' },
  { name: 'LONG A', x1: 38, x2: 52, z1: -30, z2: 26, color: '#bca980' },
  { name: 'PIT', x1: 44, x2: 56, z1: 12, z2: 28, color: '#aa9879' },
  { name: 'A SITE', x1: 24, x2: 48, z1: -40, z2: -20, color: '#beac88' },
  { name: 'A RAMP', x1: 8, x2: 32, z1: -38, z2: -28, color: '#aa9a80' },
  { name: 'CATWALK', x1: 4, x2: 22, z1: 8, z2: 20, color: '#b2a286' },
  { name: 'CATWALK', x1: 12, x2: 22, z1: -20, z2: 14, color: '#b2a286' },
  { name: 'SHORT A', x1: 16, x2: 32, z1: -26, z2: -16, color: '#b2a286' },
  { name: 'TOP MID', x1: -10, x2: 10, z1: 4, z2: 24, color: '#a39274' },
  { name: 'MID', x1: -10, x2: 10, z1: -22, z2: 8, color: '#a39274' },
  { name: 'CT SPAWN', x1: -16, x2: 16, z1: -42, z2: -20, color: '#a89982' },
  { name: 'B DOORS', x1: -34, x2: -8, z1: -36, z2: -24, color: '#a89982' },
  { name: 'B SITE', x1: -52, x2: -28, z1: -42, z2: -14, color: '#b5a382' },
  { name: 'UPPER TUNNELS', x1: -46, x2: -34, z1: -18, z2: 28, color: '#96876d' },
  { name: 'OUTSIDE TUNNELS', x1: -44, x2: -10, z1: 26, z2: 42, color: '#b09b79' },
  { name: 'LOWER TUNNELS', x1: -38, x2: -16, z1: 4, z2: 14, color: '#96876d' },
  { name: 'LOWER MID', x1: -24, x2: 0, z1: -4, z2: 8, color: '#a39274' },
];
export const SITES = { A: new THREE.Vector3(34, 0, -30), B: new THREE.Vector3(-40, 0, -28) };
export const SPAWNS = { T: new THREE.Vector3(0, 0, 41), CT: new THREE.Vector3(0, 0, -35) };
export const ROUTES = {
  long: [[0, 40], [22, 35], [34, 26], [45, 18], [45, -12], [36, -30]],
  cat: [[0, 40], [0, 20], [17, 14], [17, -12], [24, -21], [34, -30]],
  mid: [[0, 40], [0, 17], [0, -7], [0, -17], [0, -31], [20, -33], [34, -30]],
  tunnels: [[-4, 40], [-25, 34], [-40, 22], [-40, 2], [-40, -12], [-40, -28]],
  lower: [[-4, 40], [-25, 34], [-40, 18], [-34, 9], [-20, 7], [-14, 1], [0, -2], [0, -30]],
};
export function locationAt(x: number, z: number): string {
  // More specific named sites take precedence over connecting halls.
  if (x > 24 && z < -20) return 'A SITE';
  if (x < -28 && z < -14) return 'B SITE';
  if (Math.abs(x) < 10 && z < -9 && z > -16) return 'MID DOORS';
  return AREAS.find(a => x >= a.x1 && x <= a.x2 && z >= a.z1 && z <= a.z2)?.name ?? 'DUST II';
}
export function siteAt(pos: THREE.Vector3): 'A' | 'B' | null {
  return pos.distanceTo(SITES.A) < 8 ? 'A' : pos.distanceTo(SITES.B) < 9 ? 'B' : null;
}
export function cellPoint(index: number): THREE.Vector3 {
  return new THREE.Vector3(BOUNDS.minX + (index % COLS + .5) * CELL, 0, BOUNDS.minZ + (Math.floor(index / COLS) + .5) * CELL);
}
export function pointCell(x: number, z: number): number {
  const c = Math.floor((x - BOUNDS.minX) / CELL), r = Math.floor((z - BOUNDS.minZ) / CELL);
  return c < 0 || r < 0 || c >= COLS || r >= ROWS ? -1 : r * COLS + c;
}
export const FLOOR = new Uint8Array(COLS * ROWS);
for (let i = 0; i < FLOOR.length; i++) {
  const p = cellPoint(i);
  FLOOR[i] = AREAS.some(a => p.x > a.x1 && p.x < a.x2 && p.z > a.z1 && p.z < a.z2) ? 1 : 0;
}

export class WorldMap {
  group = new THREE.Group();
  colliders: AABB[] = [];
  solids: THREE.Mesh[] = [];
  nav = new Uint8Array(FLOOR);
  private materials: THREE.Material[] = [];
  private sand: THREE.MeshStandardMaterial;
  private blue: THREE.MeshStandardMaterial;
  private stone: THREE.MeshStandardMaterial;
  private wood: THREE.MeshStandardMaterial;
  private metal: THREE.MeshStandardMaterial;
  private rng = 173;

  constructor() {
    this.sand = this.material('#c7b38e', .95, this.plaster());
    this.blue = this.material('#809795', .95, this.plaster());
    this.stone = this.material('#d6c5a1', .95);
    this.wood = this.material('#7f6040', 1, this.plaster());
    this.metal = this.material('#424a44', .6);
    this.buildFloor();
    this.buildWalls();
    this.buildProps();
    this.buildDetails();
    for (let i = 0; i < this.nav.length; i++) {
      const p = cellPoint(i);
      if (this.collides(p.x, p.z, .44, 0, 1.85)) this.nav[i] = 0;
    }
    this.batchStaticGeometry();
  }
  private batchStaticGeometry() {
    // One draw call per material/shadow state, not one per brick/window.
    // Collision meshes retain their exact frozen matrices for authoritative hitscan.
    this.group.updateMatrixWorld(true);
    const batches = new Map<string, { meshes: THREE.Mesh[]; material: THREE.Material; cast: boolean; receive: boolean }>();
    for (const child of [...this.group.children]) {
      if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) continue;
      const key = `${child.material.uuid}/${child.castShadow}/${child.receiveShadow}`;
      if (!batches.has(key)) batches.set(key, { meshes: [], material: child.material, cast: child.castShadow, receive: child.receiveShadow });
      batches.get(key)!.meshes.push(child);
    }
    for (const batch of batches.values()) {
      if (batch.meshes.length < 2) continue;
      const geometries = batch.meshes.map(m => m.geometry.clone().applyMatrix4(m.matrixWorld));
      const merged = mergeGeometries(geometries, false);
      geometries.forEach(g => g.dispose());
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, batch.material); mesh.castShadow = batch.cast; mesh.receiveShadow = batch.receive;
      this.group.add(mesh);
      for (const original of batch.meshes) {
        this.group.remove(original);
        if (!this.solids.includes(original)) original.geometry.dispose();
      }
    }
  }
  disposeCollisionGeometry() { for (const mesh of this.solids) if (!mesh.parent) mesh.geometry.dispose(); }
  private rand() { this.rng = (this.rng * 1664525 + 1013904223) >>> 0; return this.rng / 4294967296; }
  private plaster() {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const data = ctx.createImageData(128, 128);
    for (let i = 0; i < data.data.length; i += 4) {
      const v = 218 + this.rand() * 35;
      data.data[i] = v; data.data[i + 1] = v; data.data[i + 2] = v; data.data[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    const texture = new THREE.CanvasTexture(canvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(2, 2); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  private material(color: string, roughness: number, map?: THREE.Texture) {
    const m = new THREE.MeshStandardMaterial({ color, roughness, map }); this.materials.push(m); return m;
  }
  box(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, collision = true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; this.group.add(m);
    if (collision) { this.colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, minY: y - h / 2, maxY: y + h / 2 }); this.solids.push(m); }
    return m;
  }
  private buildFloor() {
    const vertices: number[] = [], colors: number[] = [], normals: number[] = [], uvs: number[] = [];
    for (let i = 0; i < FLOOR.length; i++) {
      if (!FLOOR[i]) continue;
      const p = cellPoint(i), a = AREAS.find(a => p.x > a.x1 && p.x < a.x2 && p.z > a.z1 && p.z < a.z2)!;
      const c = new THREE.Color(a.color).multiplyScalar(.96 + this.rand() * .08);
      for (const [dx, dz] of [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]) {
        vertices.push(p.x + dx, 0, p.z + dz); normals.push(0, 1, 0); colors.push(c.r, c.g, c.b); uvs.push((p.x + dx) / 8, (p.z + dz) / 8);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, map: this.plaster() }); this.materials.push(mat);
    const floor = new THREE.Mesh(geo, mat); floor.receiveShadow = true; this.group.add(floor); this.solids.push(floor);
    const terrain = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), this.material('#b5a287', 1)); terrain.rotation.x = -Math.PI / 2; terrain.position.y = -.07; terrain.receiveShadow = true; this.group.add(terrain);
  }
  private buildWalls() {
    // Merge exposed grid edges into solid continuous walls, never put a wall between connected areas.
    for (const axis of ['x', 'z'] as const) {
      const outer = axis === 'x' ? ROWS + 1 : COLS + 1, inner = axis === 'x' ? COLS : ROWS;
      for (let k = 0; k < outer; k++) {
        let start = -1, side = 0;
        for (let j = 0; j <= inner; j++) {
          const c = axis === 'x' ? j : k, r = axis === 'x' ? k : j;
          const a = j < inner && (axis === 'x' ? r > 0 && FLOOR[(r - 1) * COLS + c] : c > 0 && FLOOR[r * COLS + c - 1]);
          const b = j < inner && (axis === 'x' ? r < ROWS && FLOOR[r * COLS + c] : c < COLS && FLOOR[r * COLS + c]);
          const s = a && !b ? 1 : b && !a ? -1 : 0;
          if (start >= 0 && s !== side) {
            const length = (j - start) * CELL;
            const x = BOUNDS.minX + (axis === 'x' ? (start + j) / 2 : k) * CELL;
            const z = BOUNDS.minZ + (axis === 'x' ? k : (start + j) / 2) * CELL;
            const height = 5.2 + this.rand() * 2.8;
            const mat = x > 24 && z < 24 && this.rand() > .48 ? this.blue : this.sand;
            this.box(x, height / 2, z, axis === 'x' ? length + .45 : .6, height, axis === 'z' ? length + .45 : .6, mat);
            this.box(x, height + .12, z, axis === 'x' ? length + .65 : .85, .24, axis === 'z' ? length + .65 : .85, this.stone, false);
            this.box(x, .3, z, axis === 'x' ? length + .3 : .7, .6, axis === 'z' ? length + .3 : .7, this.stone, false);
            if (length >= 8) {
              for (let n = -length / 2 + 3; n < length / 2 - 1; n += 5.5) {
                const wx = x + (axis === 'x' ? n : -.34 * side), wz = z + (axis === 'z' ? n : -.34 * side);
                this.box(wx, 3.6, wz, axis === 'x' ? 1.1 : .07, 1.5, axis === 'z' ? 1.1 : .07, this.metal, false);
                this.box(wx, 2.82, wz, axis === 'x' ? 1.32 : .3, .12, axis === 'z' ? 1.32 : .3, this.stone, false);
                for (let q = -.32; q <= .33; q += .32) this.box(wx + (axis === 'x' ? q : -.02 * side), 3.6, wz + (axis === 'z' ? q : -.02 * side), axis === 'x' ? .035 : .09, 1.5, axis === 'z' ? .035 : .09, this.stone, false);
              }
            }
            start = -1;
          }
          if (s && start < 0) { start = j; side = s; }
        }
      }
    }
  }
  private crate(x: number, z: number, w = 3, h = 2.5, d = 3) {
    this.box(x, h / 2, z, w, h, d, this.wood);
    for (const y of [.18, h - .18]) this.box(x, y, z, w + .08, .18, d + .08, this.metal, false);
    for (const dx of [-w / 2 + .1, w / 2 - .1]) this.box(x + dx, h / 2, z, .15, h, d + .1, this.stone, false);
    for (let dx = -w / 2 + .45; dx < w / 2; dx += .55) this.box(x + dx, h / 2, z + d / 2 + .013, .025, h - .3, .015, this.metal, false);
  }
  private door(x: number, z: number, horizontal = false) {
    // Two solid leaves with a central 3.6m passable opening. Their visible geometry and collider match.
    for (const s of [-1, 1]) {
      const dx = horizontal ? 0 : s * 3.1, dz = horizontal ? s * 3.1 : 0;
      const w = horizontal ? .45 : 2.6, d = horizontal ? 2.6 : .45;
      this.box(x + dx, 1.75, z + dz, w, 3.5, d, this.wood);
      for (const y of [.5, 1.6, 2.9]) this.box(x + dx, y, z + dz, w + .08, .13, d + .08, this.metal, false);
      this.box(x + (horizontal ? 0 : s * 4.65), 2.3, z + (horizontal ? s * 4.65 : 0), horizontal ? 1.1 : .7, 4.6, horizontal ? .7 : 1.1, this.stone);
    }
    this.box(x, 4.35, z, horizontal ? 1.1 : 10, .7, horizontal ? 10 : 1.1, this.stone);
  }
  private buildProps() {
    this.door(0, -12); this.door(-24, -30, true); this.door(35, 24);
    this.crate(33, -33, 4, 2.9, 3); this.crate(39, -24, 3, 2.1, 3);
    this.crate(28, -26, 2.4, 1.25, 2.4); this.crate(46, -10, 3, 2.1, 3);
    this.crate(-44, -29, 4, 2.8, 3); this.crate(-33, -36, 3, 2.6, 3);
    this.crate(-47, -20, 2.8, 1.3, 2.8); this.crate(-5, 1, 2.5, 2.5, 3.5);
    this.crate(6, -24, 2.5, 2.6, 2.5); this.crate(-17, 32, 3, 2.5, 3);
    this.crate(17, 35, 2.8, 2.4, 3); this.crate(-43, 12, 2, 2.4, 3);
    // Tunnel roof, ribs and warm lights: only overhead collision, no artificial blocked routes.
    this.box(-40, 4.4, 2, 12.4, .55, 29, this.sand);
    this.box(-28, 4.4, 9, 19, .55, 10, this.sand);
    for (const z of [-10, -2, 6, 14]) {
      this.box(-40, 3.9, z, 12, .25, .5, this.stone);
      const light = new THREE.PointLight('#ffc77b', 14, 14, 1.7); light.position.set(-40, 3.5, z); this.group.add(light);
      this.box(-40, 4.02, z, .8, .09, .45, new THREE.MeshBasicMaterial({ color: '#ffe1a4' }), false);
    }
    // B site car silhouette: body, cabin, wheels all procedurally built.
    const car = this.material('#798d86', .6);
    this.box(-48, .65, -37, 2.5, 1.1, 5.3, car);
    this.box(-48, 1.45, -37, 2.15, .65, 2.6, this.metal);
    for (const x of [-49.2, -46.8]) for (const z of [-38.6, -35.4]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.48, .48, .27, 12), this.metal); wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .45, z); this.group.add(wheel);
    }
    // Short A reads as a raised stone causeway, but its walkable collision remains flat for reliable bot traversal.
    for (let z = -15; z < 9; z += 4) this.box(21.55, .4, z, .45, .8, 3.9, this.stone);
  }
  private label(text: string, color: string, width: number, height: number) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256;
    const ctx = c.getContext('2d')!; ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = 'bold 150px Arial'; ctx.fillText(text, 256, 133);
    const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide }); this.materials.push(m);
    return new THREE.Mesh(new THREE.PlaneGeometry(width, height), m);
  }
  private buildDetails() {
    for (const [site, pos] of Object.entries(SITES)) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(5.4, 5.55, 64), new THREE.MeshBasicMaterial({ color: '#b15d37', side: THREE.DoubleSide, transparent: true, opacity: .8 }));
      ring.rotation.x = -Math.PI / 2; ring.position.copy(pos).y = .025; this.group.add(ring);
      const letter = this.label(site, '#a94b2b', 5, 2.5); letter.rotation.x = -Math.PI / 2; letter.position.copy(pos).y = .03; this.group.add(letter);
    }
    const a = this.label('A →', '#974529', 4.5, 2.25); a.position.set(9.65, 2.5, -4); a.rotation.y = -Math.PI / 2; this.group.add(a);
    const b = this.label('← B', '#974529', 4.5, 2.25); b.position.set(-9.65, 2.4, -18); b.rotation.y = Math.PI / 2; this.group.add(b);
    const wallA = this.label('A', '#a84a27', 3.8, 3.8); wallA.position.set(34, 3, -39.64); this.group.add(wallA);
    const wallB = this.label('B', '#a84a27', 3.8, 3.8); wallB.position.set(-40, 3, -41.64); this.group.add(wallB);
    // Distant skyline only, always outside the playable boundary.
    for (let i = 0; i < 24; i++) {
      const x = -78 + this.rand() * 155, z = -59 - this.rand() * 15, h = 6 + this.rand() * 13;
      this.box(x, h / 2 - .1, z, 7 + this.rand() * 10, h, 7 + this.rand() * 6, i % 4 === 0 ? this.blue : this.sand, false);
    }
    // Antennas, rooftop tanks and utility wires provide scale without any assets.
    for (const [x, z] of [[-54, -30], [26, -44], [54, 3], [-28, 19], [25, 43]]) {
      this.box(x, 7, z, 5, 14, 5, this.sand, false);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.5, 16), this.stone); tank.position.set(x, 15, z); tank.castShadow = true; this.group.add(tank);
      this.box(x + 1, 17, z, .06, 5, .06, this.metal, false); this.box(x + 1, 18.5, z, 2, .05, .05, this.metal, false);
    }
    const wireMat = new THREE.LineBasicMaterial({ color: '#4c4a40' });
    for (const z of [-5, 21]) {
      const points = Array.from({ length: 17 }, (_, i) => new THREE.Vector3(38 + i * .875, 7 - Math.sin(i / 16 * Math.PI) * 1.2, z));
      this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), wireMat));
    }
  }
  collides(x: number, z: number, radius: number, y = 0, height = 1.85): boolean {
    return this.colliders.some(b => y + height > b.minY + .02 && y < b.maxY - .02 && x + radius > b.minX && x - radius < b.maxX && z + radius > b.minZ && z - radius < b.maxZ);
  }
  move(pos: THREE.Vector3, dx: number, dz: number, radius = .36) {
    // Swept in substeps to prevent tunnelling, with axis sliding along every wall/box.
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / .18));
    for (let i = 0; i < steps; i++) {
      if (!this.collides(pos.x + dx / steps, pos.z, radius, pos.y)) pos.x += dx / steps;
      if (!this.collides(pos.x, pos.z + dz / steps, radius, pos.y)) pos.z += dz / steps;
    }
  }
  support(x: number, z: number, bottom: number) {
    let ground = 0;
    for (const b of this.colliders) if (x + .3 > b.minX && x - .3 < b.maxX && z + .3 > b.minZ && z - .3 < b.maxZ && b.maxY <= bottom + .12) ground = Math.max(ground, b.maxY);
    return ground;
  }
  segmentClear(a: THREE.Vector3, b: THREE.Vector3, radius = .43): boolean {
    const n = Math.ceil(a.distanceTo(b) / .65);
    for (let i = 1; i <= n; i++) {
      const t = i / n, x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      const index = pointCell(x, z);
      if (index < 0 || !FLOOR[index] || this.collides(x, z, radius)) return false;
    }
    return true;
  }
}
