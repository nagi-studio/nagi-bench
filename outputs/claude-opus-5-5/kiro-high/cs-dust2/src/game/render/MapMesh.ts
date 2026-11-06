// Builds merged, world-UV-mapped meshes for the procedural map (one draw call per material).

import * as THREE from 'three';
import type { Box, MapData, MatKind } from '../world/MapData';
import { hash2 } from '../math';
import * as tex from './textures';

class GeoBuilder {
  pos: number[] = [];
  nor: number[] = [];
  uv: number[] = [];
  col: number[] = [];
  idx: number[] = [];

  quad(
    v: [number, number, number][],
    n: [number, number, number],
    uvs: [number, number][],
    colors: [number, number, number][],
  ) {
    const base = this.pos.length / 3;
    for (let k = 0; k < 4; k++) {
      this.pos.push(v[k][0], v[k][1], v[k][2]);
      this.nor.push(n[0], n[1], n[2]);
      this.uv.push(uvs[k][0], uvs[k][1]);
      this.col.push(colors[k][0], colors[k][1], colors[k][2]);
    }
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

const TEX_SCALE: Record<MatKind, number> = {
  wall: 1 / 3,
  platform: 1 / 3,
  ceiling: 1 / 3,
  lintel: 1 / 3,
  crate: 1 / 1.1,
  crateDark: 1 / 1.1,
  door: 1 / 1.6,
  metal: 1 / 2.2,
};

function addBox(gb: GeoBuilder, b: Box, opts: { skipTop?: boolean; grime?: boolean; tint: number; uvScale: number }) {
  const { minX: x0, minY: y0, minZ: z0, maxX: x1, maxY: y1, maxZ: z1 } = b;
  const s = opts.uvScale;
  const shade = (y: number): [number, number, number] => {
    let k = opts.tint;
    if (opts.grime) k *= 0.72 + 0.28 * Math.min(1, Math.max(0, (y - y0) / 3.2));
    return [k, k * 0.98, k * 0.95];
  };
  const cb = shade(y0), ct = shade(y1);
  const sideCols: [number, number, number][] = [cb, cb, ct, ct];
  // +X
  gb.quad(
    [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],
    [1, 0, 0],
    [[-z1 * s, y0 * s], [-z0 * s, y0 * s], [-z0 * s, y1 * s], [-z1 * s, y1 * s]],
    sideCols,
  );
  // -X
  gb.quad(
    [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]],
    [-1, 0, 0],
    [[z0 * s, y0 * s], [z1 * s, y0 * s], [z1 * s, y1 * s], [z0 * s, y1 * s]],
    sideCols,
  );
  // +Z
  gb.quad(
    [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
    [0, 0, 1],
    [[x0 * s, y0 * s], [x1 * s, y0 * s], [x1 * s, y1 * s], [x0 * s, y1 * s]],
    sideCols,
  );
  // -Z
  gb.quad(
    [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]],
    [0, 0, -1],
    [[-x1 * s, y0 * s], [-x0 * s, y0 * s], [-x0 * s, y1 * s], [-x1 * s, y1 * s]],
    sideCols,
  );
  if (!opts.skipTop) {
    const c: [number, number, number] = opts.grime ? [opts.tint * 1.02, opts.tint, opts.tint * 0.96] : ct;
    gb.quad(
      [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]],
      [0, 1, 0],
      [[x0 * s, -z1 * s], [x1 * s, -z1 * s], [x1 * s, -z0 * s], [x0 * s, -z0 * s]],
      [c, c, c, c],
    );
  }
  // bottom face for floating geometry (lintels, ceilings) so tunnels have a roof
  if (y0 > 0.5) {
    const c: [number, number, number] = [opts.tint * 0.7, opts.tint * 0.68, opts.tint * 0.65];
    gb.quad(
      [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
      [0, -1, 0],
      [[x0 * s, z0 * s], [x1 * s, z0 * s], [x1 * s, z1 * s], [x0 * s, z1 * s]],
      [c, c, c, c],
    );
  }
}

export interface MapVisuals {
  group: THREE.Group;
  dispose(): void;
}

export function buildMapMeshes(map: MapData): MapVisuals {
  const group = new THREE.Group();
  const disposables: { dispose(): void }[] = [];

  const wallTex = tex.sandstoneWall();
  const mats: Record<string, THREE.MeshStandardMaterial> = {
    wall: new THREE.MeshStandardMaterial({ map: wallTex, vertexColors: true, roughness: 0.95, metalness: 0 }),
    crate: new THREE.MeshStandardMaterial({ map: tex.crateTexture(false), vertexColors: true, roughness: 0.9 }),
    crateDark: new THREE.MeshStandardMaterial({ map: tex.crateTexture(true), vertexColors: true, roughness: 0.9 }),
    door: new THREE.MeshStandardMaterial({ map: tex.doorTexture(), vertexColors: true, roughness: 0.85 }),
    metal: new THREE.MeshStandardMaterial({ map: tex.metalTexture(), vertexColors: true, roughness: 0.6, metalness: 0.3 }),
  };
  const matFor = (m: MatKind) => (m === 'platform' || m === 'ceiling' || m === 'lintel' ? 'wall' : m);

  const builders: Record<string, GeoBuilder> = {};
  for (const b of map.boxes) {
    const key = matFor(b.mat);
    const gb = (builders[key] ??= new GeoBuilder());
    const isStone = key === 'wall';
    const tint = isStone ? 0.9 + hash2(b.id, 7) * 0.14 : 0.92 + hash2(b.id, 3) * 0.12;
    addBox(gb, b, { skipTop: b.mat === 'platform', grime: isStone, tint, uvScale: TEX_SCALE[b.mat] });
  }
  for (const [key, gb] of Object.entries(builders)) {
    const geo = gb.build();
    const mesh = new THREE.Mesh(geo, mats[key]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    disposables.push(geo);
  }

  // Floors
  const floorMats = [0, 1, 2, 3].map(
    (k) => new THREE.MeshStandardMaterial({ map: tex.floorTexture(k), vertexColors: true, roughness: 1, metalness: 0 }),
  );
  const fb = floorMats.map(() => new GeoBuilder());
  const fs = 1 / 3;
  for (const q of map.floorQuads) {
    const y = q.h + 0.001;
    const c: [number, number, number] = [1, 1, 1];
    fb[q.kind].quad(
      [[q.x0, y, q.z1], [q.x1, y, q.z1], [q.x1, y, q.z0], [q.x0, y, q.z0]],
      [0, 1, 0],
      [[q.x0 * fs, -q.z1 * fs], [q.x1 * fs, -q.z1 * fs], [q.x1 * fs, -q.z0 * fs], [q.x0 * fs, -q.z0 * fs]],
      [c, c, c, c],
    );
  }
  for (const r of map.ramps) {
    const h = (x: number, z: number) => {
      const t = r.axis === 'x' ? (x - r.x0) / (r.x1 - r.x0) : (z - r.z0) / (r.z1 - r.z0);
      return r.h0 + (r.h1 - r.h0) * t;
    };
    const s = (r.h1 - r.h0) / (r.axis === 'x' ? r.x1 - r.x0 : r.z1 - r.z0);
    const len = Math.hypot(s, 1);
    const n: [number, number, number] = r.axis === 'x' ? [-s / len, 1 / len, 0] : [0, 1 / len, -s / len];
    const c: [number, number, number] = [0.95, 0.95, 0.95];
    fb[r.kind].quad(
      [
        [r.x0, h(r.x0, r.z1), r.z1],
        [r.x1, h(r.x1, r.z1), r.z1],
        [r.x1, h(r.x1, r.z0), r.z0],
        [r.x0, h(r.x0, r.z0), r.z0],
      ],
      n,
      [[r.x0 * fs, -r.z1 * fs], [r.x1 * fs, -r.z1 * fs], [r.x1 * fs, -r.z0 * fs], [r.x0 * fs, -r.z0 * fs]],
      [c, c, c, c],
    );
  }
  fb.forEach((gb, k) => {
    if (gb.pos.length === 0) return;
    const geo = gb.build();
    const mesh = new THREE.Mesh(geo, floorMats[k]);
    mesh.receiveShadow = true;
    group.add(mesh);
    disposables.push(geo);
  });

  // Outer desert ground (visible only when peeking over walls)
  const groundTex = tex.floorTexture(0);
  groundTex.repeat.set(120, 120);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(700, 700),
    new THREE.MeshStandardMaterial({ map: groundTex, color: 0xd8b98a, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(map.W / 2, -0.03, map.D / 2);
  ground.receiveShadow = true;
  group.add(ground);
  disposables.push(ground.geometry, ground.material as THREE.Material, groundTex);

  // Painted site letters on walls
  const letter = (text: string, x: number, y: number, z: number, rotY: number) => {
    const t = tex.letterTexture(text);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }),
    );
    m.position.set(x, y, z);
    m.rotation.y = rotY;
    group.add(m);
    disposables.push(m.geometry, m.material as THREE.Material, t);
  };
  letter('A', 113.98, 4.2, 18, -Math.PI / 2);
  letter('A', 98, 4.2, 6.02, 0);
  letter('B', 6.02, 3.2, 28, Math.PI / 2);
  letter('B', 20, 3.2, 8.02, 0);

  // Sky dome with vertex-colored gradient
  const skyGeo = new THREE.SphereGeometry(600, 32, 16);
  const colors: number[] = [];
  const top = new THREE.Color(0x5d8fd0);
  const hor = new THREE.Color(0xe8d9bc);
  const p = skyGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = Math.max(0, p.getY(i) / 600);
    const c = hor.clone().lerp(top, Math.pow(t, 0.55));
    colors.push(c.r, c.g, c.b);
  }
  skyGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const sky = new THREE.Mesh(
    skyGeo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }),
  );
  sky.position.set(map.W / 2, 0, map.D / 2);
  sky.renderOrder = -1;
  group.add(sky);
  disposables.push(skyGeo, sky.material as THREE.Material);

  for (const m of [...Object.values(mats), ...floorMats]) {
    disposables.push(m);
    if (m.map) disposables.push(m.map);
  }

  return {
    group,
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
