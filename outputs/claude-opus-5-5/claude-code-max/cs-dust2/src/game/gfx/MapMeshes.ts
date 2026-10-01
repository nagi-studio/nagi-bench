import * as THREE from 'three';
import { hash01, smoothstep } from '../core/math';
import { RASTER_RES, type Level } from '../world/Level';
import type { BoxDef, FloorDef } from '../world/MapData';
import { GeoBuilder, vcMaterial } from './GeoBuilder';
import { getMaterials, siteLetterTexture, type MaterialSet } from './Textures';

/**
 * Turns the compiled Level into a handful of merged meshes (one per material) with world-space
 * UVs and baked vertex-colour ambient occlusion. Static geometry is ~10 draw calls total.
 */
class Bucket {
  pos: number[] = [];
  nor: number[] = [];
  uv: number[] = [];
  col: number[] = [];
  idx: number[] = [];

  quad(
    a: THREE.Vector3Tuple,
    b: THREE.Vector3Tuple,
    c: THREE.Vector3Tuple,
    d: THREE.Vector3Tuple,
    n: THREE.Vector3Tuple,
    uvs: [number, number][],
    cols: [number, number, number][],
  ): void {
    const base = this.pos.length / 3;
    for (const p of [a, b, c, d]) this.pos.push(p[0], p[1], p[2]);
    for (let i = 0; i < 4; i++) this.nor.push(n[0], n[1], n[2]);
    for (const t of uvs) this.uv.push(t[0], t[1]);
    for (const k of cols) this.col.push(k[0], k[1], k[2]);
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  mesh(material: THREE.Material, name: string): THREE.Mesh | null {
    if (!this.pos.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, material);
    m.name = name;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
}

const TEX_SCALE = 1 / 4; // textures cover 4 m

/** Fake ambient occlusion: darker near ground level, brighter towards the top. */
function ao(y: number, ground: number): number {
  return 0.58 + 0.42 * smoothstep(ground - 0.3, ground + 2.6, y);
}

type Tint = [number, number, number];

interface BoxOpts {
  tint?: Tint;
  ground?: number;
  /** World-space UVs (walls/floors) vs. 0..1 per face (crates/doors). */
  uvMode?: 'world' | 'face';
  /** Skip faces: bitmask 1=+x 2=-x 4=+y 8=-y 16=+z 32=-z */
  skip?: number;
  /** Separate bucket for the top face. */
  top?: Bucket;
  /** Vertical split heights for smoother AO gradients on tall faces. */
  splits?: number[];
}

/** Emit an axis-aligned box into buckets. */
function addBox(bucket: Bucket, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, o: BoxOpts = {}): void {
  const tint = o.tint ?? [1, 1, 1];
  const ground = o.ground ?? 0;
  const skip = o.skip ?? 0;
  const face = o.uvMode === 'face';
  const col = (y: number): [number, number, number] => {
    const s = face ? 1 : ao(y, ground);
    return [tint[0] * s, tint[1] * s, tint[2] * s];
  };
  // vertical bands for AO
  const ys = [y0];
  for (const s of o.splits ?? [ground + 0.05, ground + 1.2, ground + 3]) if (s > y0 + 0.05 && s < y1 - 0.05) ys.push(s);
  ys.push(y1);

  const side = (axis: 'x' | 'z', sign: number) => {
    for (let k = 0; k < ys.length - 1; k++) {
      const ya = ys[k];
      const yb = ys[k + 1];
      if (axis === 'x') {
        const x = sign > 0 ? x1 : x0;
        const za = sign > 0 ? z1 : z0;
        const zb = sign > 0 ? z0 : z1;
        const u0 = face ? 0 : za * TEX_SCALE * -sign;
        const u1 = face ? 1 : zb * TEX_SCALE * -sign;
        const v0 = face ? (ya - y0) / (y1 - y0) : ya * TEX_SCALE;
        const v1 = face ? (yb - y0) / (y1 - y0) : yb * TEX_SCALE;
        bucket.quad(
          [x, ya, za],
          [x, ya, zb],
          [x, yb, zb],
          [x, yb, za],
          [sign, 0, 0],
          [
            [u0, v0],
            [u1, v0],
            [u1, v1],
            [u0, v1],
          ],
          [col(ya), col(ya), col(yb), col(yb)],
        );
      } else {
        const z = sign > 0 ? z1 : z0;
        const xa = sign > 0 ? x0 : x1;
        const xb = sign > 0 ? x1 : x0;
        const u0 = face ? 0 : xa * TEX_SCALE * sign;
        const u1 = face ? 1 : xb * TEX_SCALE * sign;
        const v0 = face ? (ya - y0) / (y1 - y0) : ya * TEX_SCALE;
        const v1 = face ? (yb - y0) / (y1 - y0) : yb * TEX_SCALE;
        bucket.quad(
          [xa, ya, z],
          [xb, ya, z],
          [xb, yb, z],
          [xa, yb, z],
          [0, 0, sign],
          [
            [u0, v0],
            [u1, v0],
            [u1, v1],
            [u0, v1],
          ],
          [col(ya), col(ya), col(yb), col(yb)],
        );
      }
    }
  };
  if (!(skip & 1)) side('x', 1);
  if (!(skip & 2)) side('x', -1);
  if (!(skip & 16)) side('z', 1);
  if (!(skip & 32)) side('z', -1);
  if (!(skip & 4)) {
    const tb = o.top ?? bucket;
    const c = face ? tint : ([tint[0] * 0.97, tint[1] * 0.97, tint[2] * 0.97] as Tint);
    tb.quad(
      [x0, y1, z1],
      [x1, y1, z1],
      [x1, y1, z0],
      [x0, y1, z0],
      [0, 1, 0],
      face
        ? [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ]
        : [
            [x0 * TEX_SCALE, -z1 * TEX_SCALE],
            [x1 * TEX_SCALE, -z1 * TEX_SCALE],
            [x1 * TEX_SCALE, -z0 * TEX_SCALE],
            [x0 * TEX_SCALE, -z0 * TEX_SCALE],
          ],
      [c, c, c, c],
    );
  }
  if (!(skip & 8)) {
    const c = col(y0);
    bucket.quad(
      [x0, y0, z0],
      [x1, y0, z0],
      [x1, y0, z1],
      [x0, y0, z1],
      [0, -1, 0],
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      [c, c, c, c],
    );
  }
}

/** Ramp wedge: sloped top + sides. */
function addRamp(top: Bucket, sides: Bucket, f: FloorDef, bottom: number): void {
  const { x0, z0, x1, z1 } = f;
  const yA = f.y; // at min edge
  const yB = f.y2!;
  const h = (x: number, z: number) => (f.axis === 'x' ? yA + ((x - x0) / (x1 - x0)) * (yB - yA) : yA + ((z - z0) / (z1 - z0)) * (yB - yA));
  const p00: THREE.Vector3Tuple = [x0, h(x0, z0), z0];
  const p10: THREE.Vector3Tuple = [x1, h(x1, z0), z0];
  const p11: THREE.Vector3Tuple = [x1, h(x1, z1), z1];
  const p01: THREE.Vector3Tuple = [x0, h(x0, z1), z1];
  const n = new THREE.Vector3()
    .crossVectors(new THREE.Vector3(...p01).sub(new THREE.Vector3(...p00)), new THREE.Vector3(...p10).sub(new THREE.Vector3(...p00)))
    .normalize();
  const uv = (p: THREE.Vector3Tuple): [number, number] => [p[0] * TEX_SCALE, -p[2] * TEX_SCALE];
  const c: [number, number, number] = [0.98, 0.98, 0.98];
  top.quad(p01, p11, p10, p00, [n.x, n.y, n.z], [uv(p01), uv(p11), uv(p10), uv(p00)], [c, c, c, c]);
  // side walls of the wedge (quads with a sloped top edge)
  const sideQuad = (a: THREE.Vector3Tuple, b: THREE.Vector3Tuple, nn: THREE.Vector3Tuple, alongX: boolean) => {
    const a0: THREE.Vector3Tuple = [a[0], bottom, a[2]];
    const b0: THREE.Vector3Tuple = [b[0], bottom, b[2]];
    const u = (p: THREE.Vector3Tuple) => (alongX ? p[0] : p[2]) * TEX_SCALE;
    const cc = (y: number): [number, number, number] => {
      const s = ao(y, 0);
      return [s, s, s];
    };
    sides.quad(a0, b0, b, a, nn, [
      [u(a0), bottom * TEX_SCALE],
      [u(b0), bottom * TEX_SCALE],
      [u(b), b[1] * TEX_SCALE],
      [u(a), a[1] * TEX_SCALE],
    ], [cc(bottom), cc(bottom), cc(b[1]), cc(a[1])]);
  };
  sideQuad(p10, p00, [0, 0, -1], true);
  sideQuad(p01, p11, [0, 0, 1], true);
  sideQuad(p00, p01, [-1, 0, 0], false);
  sideQuad(p11, p10, [1, 0, 0], false);
}

export interface MapVisual {
  group: THREE.Group;
  materials: MaterialSet;
}

/** Build all static scenery for a level. */
export function buildMapMeshes(level: Level): MapVisual {
  const M = getMaterials();
  const group = new THREE.Group();
  group.name = 'map';
  const B = {
    wall: new Bucket(),
    wallAlt: new Bucket(),
    wallTop: new Bucket(),
    floorSand: new Bucket(),
    floorTiles: new Bucket(),
    floorStone: new Bucket(),
    floorConcrete: new Bucket(),
    crate: new Bucket(),
    door: new Bucket(),
    metal: new Bucket(),
    wood: new Bucket(),
    trim: new Bucket(),
    cap: new Bucket(),
  };
  const floorBucket = (f: FloorDef): Bucket =>
    f.tex === 'tiles' ? B.floorTiles : f.tex === 'stone' ? B.floorStone : f.tex === 'concrete' ? B.floorConcrete : B.floorSand;

  // ---- floors
  for (const f of level.def.floors) {
    if (f.y2 !== undefined && f.axis) {
      addRamp(floorBucket(f), B.wall, f, -4);
    } else {
      addBox(B.wall, f.x0, -4, f.z0, f.x1, f.y, f.z1, { top: floorBucket(f), skip: 8, ground: f.y - 1.2, splits: [f.y - 0.6] });
    }
  }

  // ---- walls (buildings): plaster vs stone blocks, warm tint variations
  for (const w of level.walls) {
    const h = hash01(w.x0, w.z0, 3);
    const alt = h < 0.3;
    const t = 0.9 + hash01(w.x0, w.z0, 7) * 0.16;
    const tint: Tint = [t, t * (0.97 + h * 0.04), t * (0.92 + h * 0.06)];
    const bucket = alt ? B.wallAlt : B.wall;
    const ground = level.nav.heightAt((w.x0 + w.x1) / 2, (w.z0 + w.z1) / 2);
    const g = Number.isFinite(ground) ? Math.min(ground, 1.6) : 0;
    if (w.window) {
      addBox(bucket, w.x0, w.bottom, w.z0, w.x1, w.window.sill, w.z1, { tint, ground: g, top: B.trim });
      addBox(bucket, w.x0, w.window.top, w.z0, w.x1, w.top, w.z1, { tint, ground: g, top: B.wallTop, skip: 0 });
    } else {
      addBox(bucket, w.x0, w.bottom, w.z0, w.x1, w.top, w.z1, { tint, ground: g, top: B.wallTop });
    }
  }

  // ---- adobe details: parapet caps on every block and protruding roof beams ("vigas")
  const bnd = level.def.bounds;
  const floorAt = (x: number, z: number): number => {
    const i = Math.floor((x - bnd.x0) / RASTER_RES);
    const j = Math.floor((z - bnd.z0) / RASTER_RES);
    if (i < 0 || j < 0 || i >= level.cols || j >= level.rows) return NaN;
    return level.floorHeight[j * level.cols + i];
  };
  for (const w of level.walls) {
    const top = w.top;
    addBox(B.cap, w.x0 - 0.1, top, w.z0 - 0.1, w.x1 + 0.1, top + 0.22, w.z1 + 0.1, { tint: [0.95, 0.95, 0.95], ground: top - 20, top: B.cap });
    if (hash01(w.x0, w.z1, 11) < 0.4) continue;
    const y = top - 0.9;
    const faces: [boolean, number, number, number, number][] = [
      [true, w.x1, 1, w.z0, w.z1],
      [true, w.x0, -1, w.z0, w.z1],
      [false, w.z1, 1, w.x0, w.x1],
      [false, w.z0, -1, w.x0, w.x1],
    ];
    for (const [alongZ, fixed, dir, a, b] of faces) {
      if (b - a < 3) continue;
      for (let s = a + 1.1; s < b - 0.7; s += 2.3) {
        const px = alongZ ? fixed + dir * 0.3 : s;
        const pz = alongZ ? s : fixed + dir * 0.3;
        const fh = floorAt(px, pz);
        if (Number.isNaN(fh) || y - fh < 3.4) continue;
        const o = fixed + dir * 0.42;
        if (alongZ) addBox(B.wood, Math.min(fixed, o), y - 0.08, s - 0.08, Math.max(fixed, o), y + 0.08, s + 0.08, { uvMode: 'face', tint: [0.7, 0.7, 0.7] });
        else addBox(B.wood, s - 0.08, y - 0.08, Math.min(fixed, o), s + 0.08, y + 0.08, Math.max(fixed, o), { uvMode: 'face', tint: [0.7, 0.7, 0.7] });
      }
    }
  }

  // ---- decorative blue doors set into walls (visual only)
  const decoDoors: [number, number, number, number, number][] = [
    [64, 3.92, 65.5, 4.06, 0],
    [50, 97.94, 51.5, 98.08, 1.6],
    [76.5, 91.94, 78, 92.08, 0],
    [3.92, 12, 4.06, 13.5, 0],
    [41.94, 36, 42.08, 37.5, 0],
    [103.94, 48, 104.08, 49.5, 0],
    [44, 9.92, 45.5, 10.06, 0],
    [29.94, 70, 30.08, 71.5, 0.8],
  ];
  for (const [x0, z0, x1, z1, y0] of decoDoors) {
    addBox(B.door, x0, y0, z0, x1, y0 + 2.7, z1, { uvMode: 'face', tint: [1, 1, 1] });
    addBox(B.wood, Math.min(x0, x1) - 0.1, y0 + 2.7, Math.min(z0, z1) - 0.1, Math.max(x0, x1) + 0.1, y0 + 2.92, Math.max(z0, z1) + 0.1, { uvMode: 'face', tint: [0.7, 0.7, 0.7] });
  }

  // ---- props
  for (const b of level.def.boxes) addProp(B, b, group);

  // ---- door leaves (rotated meshes, colliders are approximations in Level)
  const doorGeo = new GeoBuilder();
  for (const d of level.def.doors) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(d.length, d.height, d.thickness), M.doorLeaf);
    const mid = d.length / 2;
    leaf.position.set(d.hx + Math.cos(d.angle) * mid, d.y0 + d.height / 2, d.hz + Math.sin(d.angle) * mid);
    leaf.rotation.y = -d.angle;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    group.add(leaf);
    // hinges & frame posts
    doorGeo.box(0.16, d.height + 0.2, 0.16, d.hx, d.y0 + d.height / 2, d.hz, 0x4a3a28);
  }
  const doorFrame = new THREE.Mesh(doorGeo.build(), vcMaterial('matte'));
  doorFrame.castShadow = true;
  group.add(doorFrame);

  // ---- bombsite letters painted on nearby walls
  addSiteLetter(group, 'A', 104 - 0.02, 3.6, 17, -Math.PI / 2);
  addSiteLetter(group, 'B', 4 + 0.02, 2.6, 17, Math.PI / 2);

  const add = (b: Bucket, m: THREE.Material, name: string) => {
    const mesh = b.mesh(m, name);
    if (mesh) group.add(mesh);
  };
  add(B.wall, M.wall, 'walls');
  add(B.wallAlt, M.wallAlt, 'walls-plaster');
  add(B.wallTop, M.wallTop, 'wall-tops');
  add(B.floorSand, M.floorSand, 'floor-sand');
  add(B.floorTiles, M.floorTiles, 'floor-tiles');
  add(B.floorStone, M.floorStone, 'floor-stone');
  add(B.floorConcrete, M.floorConcrete, 'floor-concrete');
  add(B.crate, M.crate, 'crates');
  add(B.door, M.door, 'doors');
  add(B.metal, M.metal, 'metal');
  add(B.wood, M.wood, 'wood');
  add(B.trim, M.trim, 'trim');
  add(B.cap, M.wallTop, 'wall-caps');
  return { group, materials: M };
}

function addProp(B: Record<string, Bucket>, b: BoxDef, group: THREE.Group): void {
  switch (b.kind) {
    case 'crate':
    case 'crateBig': {
      const t = 0.92 + hash01(b.x0, b.z0) * 0.16;
      addBox(B.crate, b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, { uvMode: 'face', tint: [t, t, t] });
      break;
    }
    case 'container': {
      addBox(B.metal, b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, { uvMode: 'face', tint: [1, 1, 1] });
      break;
    }
    case 'ceiling':
      addBox(B.wood, b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, { tint: [0.8, 0.8, 0.8], ground: b.y0 - 3, top: B.wallTop });
      // support beams under the roof
      for (let z = b.z0 + 1; z < b.z1 - 0.5; z += 3.2) addBox(B.wood, b.x0, b.y0 - 0.22, z, b.x1, b.y0, z + 0.3, { uvMode: 'face', tint: [0.75, 0.75, 0.75] });
      break;
    case 'lintel':
      addBox(B.wall, b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, { tint: [0.95, 0.93, 0.88], ground: b.y0 - 2.5, top: B.wallTop });
      addBox(B.wood, b.x0 - 0.05, b.y0 - 0.25, b.z0 - 0.05, b.x1 + 0.05, b.y0, b.z1 + 0.05, { uvMode: 'face', tint: [0.8, 0.8, 0.8] });
      break;
    case 'beam':
      addBox(B.wood, b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, { uvMode: 'face', tint: [0.8, 0.8, 0.8] });
      break;
    case 'barrel': {
      const r = (b.x1 - b.x0) / 2;
      const g = new GeoBuilder()
        .cyl(r, b.y1 - b.y0, 0, 0, 0, 0x6b4a2b, 'y', 14)
        .cyl(r + 0.015, 0.06, 0, (b.y1 - b.y0) * 0.3, 0, 0x2a2a2a, 'y', 14)
        .cyl(r + 0.015, 0.06, 0, -(b.y1 - b.y0) * 0.3, 0, 0x2a2a2a, 'y', 14);
      const m = new THREE.Mesh(g.build(), vcMaterial('metal'));
      m.position.set((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2);
      m.castShadow = true;
      m.receiveShadow = true;
      group.add(m);
      break;
    }
    case 'car':
      group.add(buildCar(b));
      break;
    default:
      addBox(B.trim, b.x0, b.y0, b.z0, b.x1, b.y1, b.z1, {});
  }
}

/** Boxy old sedan (Dust2 has a couple of wrecks), fits the collider footprint. */
function buildCar(b: BoxDef): THREE.Object3D {
  const len = Math.max(b.x1 - b.x0, b.z1 - b.z0);
  const wid = Math.min(b.x1 - b.x0, b.z1 - b.z0);
  const alongX = b.x1 - b.x0 >= b.z1 - b.z0;
  const g = new GeoBuilder();
  const body = 0x7d8f96;
  const rust = 0x7a4a2a;
  g.box(len, 0.55, wid, 0, 0.55, 0, body);
  g.box(len * 0.55, 0.5, wid * 0.92, -len * 0.05, 1.07, 0, body);
  g.box(len * 0.5, 0.42, wid * 0.94, -len * 0.05, 1.07, 0, 0x2b3a44); // windows
  g.box(len * 0.22, 0.12, wid * 0.9, len * 0.36, 0.86, 0, rust);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.cyl(0.32, 0.22, sx * len * 0.32, 0.32, sz * wid * 0.48, 0x161616, 'z', 12);
  g.box(0.06, 0.18, wid * 0.9, len / 2, 0.55, 0, 0x2a2a2a);
  g.box(0.06, 0.18, wid * 0.9, -len / 2, 0.55, 0, 0x2a2a2a);
  const m = new THREE.Mesh(g.build(), vcMaterial('metal'));
  m.position.set((b.x0 + b.x1) / 2, b.y0, (b.z0 + b.z1) / 2);
  if (!alongX) m.rotation.y = Math.PI / 2;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function addSiteLetter(group: THREE.Group, letter: string, x: number, y: number, z: number, rotY: number): void {
  const mat = new THREE.MeshStandardMaterial({ map: siteLetterTexture(letter), transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), mat);
  m.position.set(x, y + 1.3, z);
  m.rotation.y = rotY;
  m.receiveShadow = true;
  group.add(m);
}
