import * as THREE from "three";
import { Vox } from "../lib/vox";
import { makeGlow } from "../lib/fx";
import { hash3, jit } from "../lib/util";

/**
 * The courtyard deep in a hutong, at dusk: grey brick, grey tile, one golden
 * ginkgo, and warm windows. The world outside may be arming; here it is evening.
 * World metres = grid × 0.2; the yard spans x 0..18, z 0..18.
 */
const S = 0.2;

export interface YardSet {
  group: THREE.Group;
  sky: number;
}

export function buildYard(): YardSet {
  const group = new THREE.Group();
  group.name = "set:yard";
  const v = new Vox(90, 46, 90), lume = new Vox(90, 46, 90);

  // Flagstones, with a paler cross path from gate to door.
  v.box(0, 0, 0, 90, 1, 90, (x, _y, z) => {
    const seam = x % 5 === 0 || z % 5 === 0;
    const path = Math.abs(x - 45) < 5;
    return seam ? 0x3a3a3c : jit(path ? 0x6a6a68 : 0x555557, Math.floor(x / 5), 0, Math.floor(z / 5), 0.12);
  });

  const brick = (x: number, y: number, z: number): number => {
    const along = x + z;
    const mortar = (along + (y % 2) * 2) % 4 === 0;
    return mortar ? 0x4a4b4e : jit(0x6a6c70, along >> 2, y, 1, 0.1);
  };
  const tile = (x: number, y: number, z: number, alongX: boolean): number => {
    const rib = (alongX ? x : z) % 2 === 0;
    return jit(rib ? 0x34363a : 0x26282c, x, y, z, 0.08);
  };
  const timber = (x: number, y: number, z: number): number => jit(0x4a1710, x, y, z, 0.1);

  // Main house on the north side.
  v.box(14, 1, 4, 76, 16, 22, brick);
  v.carve(15, 1, 5, 75, 16, 21);
  for (const x of [14, 29, 44, 46, 61, 75]) v.box(x, 1, 21, x + 1, 16, 22, timber);
  v.box(14, 15, 21, 76, 16, 22, timber);
  for (let z = 1; z <= 25; z++) {
    const h = 16 + Math.round((12 - Math.abs(z - 13)) * 0.62);
    v.box(12, h, z, 78, h + 1, z + 1, (x, y, zz) => tile(x, y, zz, true));
    if (z > 3 && z < 23) v.box(14, 16, z, 15, h, z + 1, brick).box(75, 16, z, 76, h, z + 1, brick);
  }
  v.box(12, 24, 13, 78, 25, 14, 0x1c1d20);
  // Door and two lattice windows, lit from inside.
  v.carve(42, 1, 21, 48, 12, 22);
  v.box(41, 1, 21, 42, 13, 22, timber).box(48, 1, 21, 49, 13, 22, timber).box(41, 12, 21, 49, 13, 22, timber);
  v.box(42, 1, 21, 45, 12, 22, (x, y) => (y === 6 || x === 42 ? 0x5a1810 : 0x7a2015));
  lume.box(45, 1, 20, 48, 12, 21, 0xffc980);
  for (const x0 of [20, 54]) {
    v.carve(x0, 5, 21, x0 + 16, 13, 22);
    v.box(x0, 5, 21, x0 + 16, 13, 22, (x, y) => {
      const lx = x - x0, ly = y - 5;
      return lx % 4 === 0 || ly % 4 === 0 || lx === 15 || ly === 7 ? 0x3a130d : null;
    });
    lume.box(x0, 5, 20, x0 + 16, 13, 21, (x, y, z) => jit(0xffb866, x >> 2, y >> 2, z, 0.12));
  }
  v.box(40, 0, 22, 50, 1, 26, 0x77777a);
  v.box(40, 1, 22, 50, 2, 24, 0x6f6f72);

  // Wing houses east and west.
  for (const [x0, x1] of [[2, 16], [74, 88]] as Array<[number, number]>) {
    v.box(x0, 1, 32, x1, 13, 70, brick);
    v.carve(x0 + 1, 1, 33, x1 - 1, 13, 69);
    for (let x = x0 - 2; x <= x1 + 1; x++) {
      const mid = (x0 + x1) / 2;
      const h = 13 + Math.round((9 - Math.abs(x + 0.5 - mid)) * 0.6);
      v.box(x, h, 30, x + 1, h + 1, 72, (xx, y, z) => tile(xx, y, z, false));
    }
    const face = x0 < 40 ? x1 - 1 : x0;
    for (const z0 of [38, 54]) {
      v.box(face, 5, z0, face + 1, 11, z0 + 10, (_x, y, z) => ((z - z0) % 3 === 0 || (y - 5) % 3 === 0 ? 0x3a130d : null));
      lume.box(face + (x0 < 40 ? -1 : 1), 5, z0, face + (x0 < 40 ? 0 : 2), 11, z0 + 10, x0 < 40 ? 0x6a5a48 : 0xd99a50);
    }
  }

  // South wall and gate.
  v.box(0, 1, 84, 90, 13, 86, brick);
  v.box(0, 13, 83, 90, 14, 87, (x, y, z) => tile(x, y, z, true));
  v.carve(41, 1, 84, 49, 12, 86);
  v.box(39, 1, 83, 41, 15, 87, timber).box(49, 1, 83, 51, 15, 87, timber);
  for (let z = 80; z <= 89; z++) {
    const h = 15 + Math.round((5 - Math.abs(z - 84.5)) * 0.6);
    v.box(37, h, z, 53, h + 1, z + 1, (x, y, zz) => tile(x, y, zz, true));
  }
  v.box(41, 1, 86, 42, 12, 89, 0x7a2015);
  v.box(48, 1, 86, 49, 12, 89, 0x7a2015);
  // Side walls close the yard.
  v.box(0, 1, 0, 2, 13, 90, brick).box(88, 1, 0, 90, 13, 90, brick);

  // The ginkgo, gold in autumn, and what it has dropped.
  v.box(23, 1, 59, 25, 18, 61, (x, y, z) => jit(0x3a2a1c, x, y, z, 0.15));
  v.box(25, 12, 60, 29, 13, 61, 0x3a2a1c).box(19, 14, 60, 23, 15, 61, 0x3a2a1c);
  v.box(10, 14, 46, 39, 33, 75, (x, y, z) => {
    const dx = (x - 24) / 13, dy = (y - 23) / 8.5, dz = (z - 60) / 13;
    const d = dx * dx + dy * dy + dz * dz;
    if (d > 1 || hash3(x, y, z) < 0.3 + d * 0.3) return null;
    const h = hash3(x >> 1, y >> 1, z >> 1);
    return jit(h > 0.6 ? 0xd6a62a : h > 0.25 ? 0xb88a22 : 0x8a7420, x, y, z, 0.12);
  });
  v.box(8, 1, 44, 44, 2, 78, (x, _y, z) => {
    const dx = x - 24, dz = z - 60;
    return hash3(x, 7, z) > 0.86 + (dx * dx + dz * dz) / 2600 ? 0xc79a28 : null;
  });

  // A stone table, two drums, a glazed water vat, pots.
  v.box(60, 1, 56, 61, 4, 57, 0x77777a).box(57, 4, 53, 64, 5, 60, (x, y, z) => jit(0x8a8a8c, x, y, z, 0.06));
  v.box(55, 1, 56, 57, 3, 58, 0x6f6f72).box(64, 1, 56, 66, 3, 58, 0x6f6f72);
  v.box(30, 1, 25, 35, 6, 30, (x, y, z) => ((x === 30 || x === 34) && (z === 25 || z === 29) ? null : jit(0x3a2c26, x, y, z, 0.08)));
  v.box(31, 5, 26, 34, 6, 29, 0x1a2a34);
  for (const [x, z] of [[52, 24], [56, 24], [18, 30]] as Array<[number, number]>) {
    v.box(x, 1, z, x + 2, 3, z + 2, 0x7a4a3a);
    v.box(x - 1, 3, z - 1, x + 3, 6, z + 3, (xx, y, zz) => (hash3(xx, y, zz) > 0.4 ? jit(0x3a5a34, xx, y, zz, 0.2) : null));
  }
  // Red lanterns either side of the door.
  for (const x of [39, 50]) {
    v.box(x, 12, 23, x + 1, 14, 24, 0x1a1a1a);
    lume.box(x - 1, 9, 22, x + 2, 12, 25, (xx, y, zz) => ((xx + zz) % 2 === 0 && y === 10 ? 0xffb050 : 0xff4a22));
  }

  const solid = v.mesh(S);
  solid.position.set(0, -S, 0);
  group.add(solid);
  const lit = new THREE.Mesh(lume.geometry(S), new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }));
  lit.position.copy(solid.position);
  group.add(lit);

  // Rooftops of the neighbourhood beyond the walls, to give the sky an edge.
  const far = new Vox(60, 8, 60);
  far.each((x, y, z) => {
    const inside = x > 18 && x < 42 && z > 16 && z < 44;
    if (inside) return null;
    const block = hash3(x >> 3, 0, z >> 3);
    const h = 2 + Math.floor(block * 3) + (hash3(x >> 3, 1, z >> 3) > 0.85 ? 3 : 0);
    if (y >= h || (x % 8 === 0 || z % 8 === 0)) return null;
    return y === h - 1 ? jit(0x24262b, x, y, z, 0.1) : hash3(x, y, z) > 0.93 ? 0xffc070 : 0x3a3b40;
  });
  const farMesh = far.mesh(1.2, { shadow: false });
  farMesh.position.set(9 - 36, -0.4, 9 - 36);
  group.add(farMesh);

  // Light: cold sky, a last warm rake from the west, and lamplight at the door.
  const sky = 0x34406a;
  group.add(new THREE.HemisphereLight(0x7186c0, 0x3a2e28, 1.7));
  const glow = new THREE.DirectionalLight(0xff9a66, 1.5);
  glow.position.set(-9, 15, 15);
  glow.target.position.set(9, 0, 9);
  glow.castShadow = true;
  glow.shadow.mapSize.set(2048, 2048);
  glow.shadow.camera.left = -16; glow.shadow.camera.right = 16; glow.shadow.camera.top = 14; glow.shadow.camera.bottom = -14;
  glow.shadow.camera.near = 1; glow.shadow.camera.far = 60;
  glow.shadow.bias = -0.002; glow.shadow.normalBias = 0.06;
  group.add(glow, glow.target);
  for (const [x, y, z, i] of [[9, 1.6, 5.3, 9], [5.6, 1.8, 5.4, 5], [12.4, 1.8, 5.4, 5]] as Array<[number, number, number, number]>) {
    const l = new THREE.PointLight(0xffb060, i, 12, 1.6);
    l.position.set(x, y, z);
    group.add(l);
  }
  for (const x of [7.9, 10.1]) {
    const gl = makeGlow(0xff6a30, 2.2, 0.55);
    gl.position.set(x, 1.9, 4.8);
    group.add(gl);
  }
  const doorGlow = makeGlow(0xffc070, 4, 0.35);
  doorGlow.position.set(9.2, 1.2, 4.6);
  group.add(doorGlow);

  return { group, sky };
}
