// Turns the abstract map description into a handful of merged, textured meshes.

import * as THREE from 'three';
import { CELL, F_RENDER, MATERIALS, MapData } from '../sim/map';
import { hash2 } from '../sim/math';
import { TextureSet } from './textures';

/** World metres covered by one texture repeat. */
const TEX_SCALE: Record<string, number> = {
  concrete: 3.2,
  brick: 1.8,
  corrugated: 1.6,
  crate: 1,
  metal: 1.5,
  plain: 1,
};

interface Bucket {
  pos: number[];
  nor: number[];
  uv: number[];
  col: number[];
}

const newBucket = (): Bucket => ({ pos: [], nor: [], uv: [], col: [] });

function bucketToGeometry(b: Bucket): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(b.pos), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(b.nor), 3));
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(b.uv), 2));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(b.col), 3));
  g.computeBoundingSphere();
  g.computeBoundingBox();
  return g;
}

/** Appends a box to a bucket with world-scale or per-face UVs and a fake-AO vertex gradient. */
function pushBox(
  b: Bucket,
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  color: THREE.Color,
  uvMode: 'world' | 'fit',
  scale: number,
): void {
  const geo = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).toNonIndexed();
  geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const p = geo.getAttribute('position');
  const n = geo.getAttribute('normal');
  const uv = geo.getAttribute('uv');
  const tall = y1 - y0 > 2.2;
  for (let i = 0; i < p.count; i++) {
    const px = p.getX(i);
    const py = p.getY(i);
    const pz = p.getZ(i);
    const nx = n.getX(i);
    const ny = n.getY(i);
    const nz = n.getZ(i);
    b.pos.push(px, py, pz);
    b.nor.push(nx, ny, nz);
    if (uvMode === 'world') {
      if (Math.abs(ny) > 0.5) b.uv.push(px / scale, pz / scale);
      else if (Math.abs(nx) > 0.5) b.uv.push(pz / scale, py / scale);
      else b.uv.push(px / scale, py / scale);
    } else {
      b.uv.push(uv.getX(i), uv.getY(i));
    }
    // darker towards the ground on walls, slightly brighter tops
    let shade = 1;
    if (Math.abs(ny) < 0.5) shade = tall ? (py - y0 < 0.01 ? 0.72 : 1.0) : py - y0 < 0.01 ? 0.86 : 1.0;
    else if (ny > 0) shade = 1.06;
    b.col.push(color.r * shade, color.g * shade, color.b * shade);
  }
  geo.dispose();
}

export interface MapMeshes {
  group: THREE.Group;
  lights: THREE.PointLight[];
  dispose(): void;
}

export function buildMapMeshes(map: MapData, tex: TextureSet): MapMeshes {
  const group = new THREE.Group();
  const disposables: { dispose(): void }[] = [];
  const tmpColor = new THREE.Color();

  // ------------------------------------------------------------ boxes, merged per texture
  const buckets = new Map<string, Bucket>();
  map.boxes.forEach((bx, i) => {
    if (!(bx.flags & F_RENDER)) return;
    const spec = MATERIALS[bx.mat] ?? MATERIALS.wall;
    let bucket = buckets.get(spec.tex);
    if (!bucket) {
      bucket = newBucket();
      buckets.set(spec.tex, bucket);
    }
    tmpColor.setHex(spec.color, THREE.SRGBColorSpace);
    const v = 0.93 + hash2(i * 3 + 1, i * 7 + 5) * 0.14;
    tmpColor.multiplyScalar(v);
    pushBox(bucket, bx.min.x, bx.min.y, bx.min.z, bx.max.x, bx.max.y, bx.max.z, tmpColor, spec.uv, TEX_SCALE[spec.tex] ?? 2);
  });
  const texFor: Record<string, THREE.Texture> = {
    concrete: tex.concrete,
    brick: tex.brick,
    corrugated: tex.corrugated,
    crate: tex.crate,
    metal: tex.metal,
    plain: tex.plain,
  };
  buckets.forEach((bucket, key) => {
    const geo = bucketToGeometry(bucket);
    const mat = new THREE.MeshLambertMaterial({ map: texFor[key] ?? tex.plain, vertexColors: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
    disposables.push(geo, mat);
  });

  // ------------------------------------------------------------ floors, merged per surface kind
  const floorTex: Record<number, [THREE.Texture, number, number]> = {
    [CELL.Asphalt]: [tex.asphalt, 4, 0xffffff],
    [CELL.Interior]: [tex.interiorFloor, 3, 0xffffff],
    [CELL.Concrete]: [tex.floorConcrete, 2.5, 0xffffff],
    [CELL.Dock]: [tex.dock, 4, 0xffffff],
    [CELL.Gravel]: [tex.gravel, 3, 0xffffff],
  };
  const floorBuckets = new Map<number, Bucket>();
  for (const f of map.floors) {
    const entry = floorTex[f.kind];
    if (!entry) continue;
    let b = floorBuckets.get(f.kind);
    if (!b) {
      b = newBucket();
      floorBuckets.set(f.kind, b);
    }
    const s = entry[1];
    // two triangles facing +Y (counter-clockwise seen from above)
    const quad: [number, number][] = [
      [f.x0, f.z0],
      [f.x0, f.z1],
      [f.x1, f.z1],
      [f.x0, f.z0],
      [f.x1, f.z1],
      [f.x1, f.z0],
    ];
    for (const [x, z] of quad) {
      b.pos.push(x, 0, z);
      b.nor.push(0, 1, 0);
      b.uv.push(x / s, z / s);
      b.col.push(1, 1, 1);
    }
  }
  floorBuckets.forEach((b, kind) => {
    const entry = floorTex[kind];
    const geo = bucketToGeometry(b);
    const mat = new THREE.MeshLambertMaterial({ map: entry[0], vertexColors: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
    disposables.push(geo, mat);
  });

  // ------------------------------------------------------------ decor
  const lights: THREE.PointLight[] = [];
  const barrelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.95, 14);
  const railGeoCache: THREE.BufferGeometry[] = [];
  const lampGeo = new THREE.BoxGeometry(1.2, 0.08, 0.22);
  disposables.push(barrelGeo, lampGeo);
  const barrelMats = new Map<number, THREE.Material>();
  const railMat = new THREE.MeshLambertMaterial({ color: 0x5a5148 });
  const sleeperMat = new THREE.MeshLambertMaterial({ color: 0x4a3b2c });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff1cf });
  disposables.push(railMat, sleeperMat, lampMat);
  for (const d of map.decor) {
    if (d.kind === 'barrel') {
      const c = d.color ?? 0x2f6f9f;
      let m = barrelMats.get(c);
      if (!m) {
        m = new THREE.MeshLambertMaterial({ color: c });
        barrelMats.set(c, m);
        disposables.push(m);
      }
      const mesh = new THREE.Mesh(barrelGeo, m);
      mesh.position.set(d.pos.x, d.pos.y + 0.475, d.pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      // rim rings
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.315, 0.04, 14), railMat);
      ring.position.set(d.pos.x, d.pos.y + 0.3, d.pos.z);
      const ring2 = ring.clone();
      ring2.position.y = d.pos.y + 0.66;
      group.add(ring, ring2);
      disposables.push(ring.geometry);
    } else if (d.kind === 'rail' && d.size) {
      const g = new THREE.BoxGeometry(d.size.x, d.size.y, d.size.z);
      railGeoCache.push(g);
      const mesh = new THREE.Mesh(g, railMat);
      mesh.position.set(d.pos.x, d.pos.y + d.size.y / 2 + 0.03, d.pos.z);
      group.add(mesh);
    } else if (d.kind === 'lamp') {
      const mesh = new THREE.Mesh(lampGeo, lampMat);
      mesh.position.set(d.pos.x, d.pos.y, d.pos.z);
      group.add(mesh);
    }
  }
  disposables.push(...railGeoCache);
  // railway sleepers under the mid rails (pure decoration)
  const rails = map.decor.filter((d) => d.kind === 'rail');
  if (rails.length >= 2 && rails[0].size) {
    const zc = (rails[0].pos.z + rails[1].pos.z) / 2;
    const len = rails[0].size.x;
    const count = Math.floor(len / 0.8);
    const sleeperGeo = new THREE.BoxGeometry(0.22, 0.06, 2.0);
    disposables.push(sleeperGeo);
    const inst = new THREE.InstancedMesh(sleeperGeo, sleeperMat, count);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m4.makeTranslation(rails[0].pos.x - len / 2 + 0.4 + i * 0.8, 0.03, zc);
      inst.setMatrixAt(i, m4);
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.receiveShadow = true;
    group.add(inst);
  }
  for (const l of map.lights) {
    const pl = new THREE.PointLight(l.color, l.intensity, l.dist, 1.6);
    pl.position.set(l.pos.x, l.pos.y, l.pos.z);
    group.add(pl);
    lights.push(pl);
  }

  // ------------------------------------------------------------ bomb-site markings
  const decalGeo = new THREE.PlaneGeometry(7, 7);
  decalGeo.rotateX(-Math.PI / 2);
  disposables.push(decalGeo);
  const sites: ['A' | 'B', THREE.Texture][] = [
    ['A', tex.siteA],
    ['B', tex.siteB],
  ];
  for (const [id, t] of sites) {
    const s = map.tac.sites[id];
    const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const mesh = new THREE.Mesh(decalGeo, mat);
    mesh.position.set(s.plant[0][0], 0.015, s.plant[0][1]);
    mesh.renderOrder = 1;
    group.add(mesh);
    disposables.push(mat);
  }

  // ------------------------------------------------------------ sea and far scenery
  const seaGeo = new THREE.PlaneGeometry(900, 500);
  seaGeo.rotateX(-Math.PI / 2);
  const seaMat = new THREE.MeshPhongMaterial({ color: 0x2e6f8a, specular: 0x9fc4d4, shininess: 60 });
  const sea = new THREE.Mesh(seaGeo, seaMat);
  sea.position.set(-10, -1.7, map.minZ - 246);
  group.add(sea);
  disposables.push(seaGeo, seaMat);
  // distant harbour cranes and a cargo ship, as simple silhouettes
  const farMat = new THREE.MeshLambertMaterial({ color: 0x6f8494 });
  const shipMat = new THREE.MeshLambertMaterial({ color: 0x7a4a40 });
  disposables.push(farMat, shipMat);
  const farBox = (x: number, y: number, z: number, sx: number, sy: number, sz: number, m: THREE.Material) => {
    const g = new THREE.BoxGeometry(sx, sy, sz);
    disposables.push(g);
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z);
    group.add(mesh);
  };
  for (const cx of [-70, -20, 45]) {
    const z = -170 - Math.abs(cx) * 0.3;
    farBox(cx - 6, 14, z, 1.6, 32, 1.6, farMat);
    farBox(cx + 6, 14, z, 1.6, 32, 1.6, farMat);
    farBox(cx, 30, z, 16, 2, 3, farMat);
    farBox(cx + 4, 33, z + 14, 2, 2, 46, farMat);
    farBox(cx, 38, z, 1.2, 14, 1.2, farMat);
  }
  farBox(5, 2, -120, 70, 8, 12, shipMat);
  farBox(28, 9, -120, 10, 8, 10, farMat);
  for (let i = 0; i < 7; i++) {
    const colors = [0xb5412f, 0x2f5fa3, 0x3c7d4f, 0xd1a22a];
    const m = new THREE.MeshLambertMaterial({ color: colors[i % colors.length] });
    disposables.push(m);
    farBox(-24 + i * 6.4, 7.4, -120, 6, 2.8 + (i % 3) * 2.6, 9, m);
  }

  group.updateMatrixWorld(true);
  return {
    group,
    lights,
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
