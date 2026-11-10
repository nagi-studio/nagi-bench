import * as THREE from "three";
import { voxelMaterial } from "@agentbench/voxel-kit";
import { Vox } from "../lib/vox";
import { CubeFX, makeGlow } from "../lib/fx";
import { clamp, hash1, hash3, jit, seg, type V3 } from "../lib/util";
import { slugGeometry, slugMaterial } from "../cast/props";
import { TEST_SHOTS } from "../timeline";

/**
 * A concrete basement with one bare bulb. A table of caseless rounds; at the far
 * wall, a bundle wrapped in the cloth that pressure suits are made of.
 * World metres = grid × 0.1; the room spans x 0..5, z 0..6.5.
 */
const S = 0.1;

export const CELLAR = {
  table: [2.5, 0.8, 4.2] as V3,
  stand: [2.5, 0, 5.15] as V3,
  bundle: [2.5, 1.22, 0.62] as V3,
  bulb: [2.5, 2.05, 3.4] as V3,
  /** Position of round i on the table (6 × 6). */
  round(i: number): V3 {
    return [2.5 + ((i % 6) - 2.5) * 0.075, 0.8, 4.2 + (Math.floor(i / 6) - 2.5) * 0.075];
  },
  /** Where each test round goes through the cloth. */
  holes: [[-0.09, 0.08], [0.07, 0.11], [0.02, -0.06], [-0.05, -0.02]] as Array<[number, number]>,
};

export interface CellarSet {
  group: THREE.Group;
  bundle: THREE.Group;
  crumbs: THREE.Mesh;
  /** Drive rounds, bulb swing, muzzle blast and smoke. `muzzle` is the pistol's muzzle in world space. */
  animate(T: number, muzzle: THREE.Vector3 | null, opened: number): { flash: number };
}

export function buildCellar(): CellarSet {
  const group = new THREE.Group();
  group.name = "set:cellar";
  const v = new Vox(52, 29, 67);

  const concrete = (x: number, y: number, z: number): number => {
    const stain = hash3(Math.floor(x / 6), Math.floor(y / 5), Math.floor(z / 6));
    const form = y % 9 === 0 || (x + z) % 13 === 0;
    let c = stain > 0.75 ? 0x4a4b48 : stain < 0.2 ? 0x5e5f5a : 0x555651;
    if (form) c = 0x464743;
    if (y < 4 && hash3(x, y, z) > 0.7) c = 0x3a3f36; // damp at the foot of the wall
    return jit(c, x, y, z, 0.05);
  };
  v.box(0, 0, 0, 52, 1, 67, (x, _y, z) => jit(hash3(x >> 3, 0, z >> 3) > 0.8 ? 0x3d3e3b : 0x484945, x, 0, z, 0.06));
  v.box(0, 1, 0, 52, 29, 1, concrete).box(0, 1, 66, 52, 29, 67, concrete).box(0, 1, 0, 1, 29, 67, concrete).box(51, 1, 0, 52, 29, 67, concrete);
  v.box(0, 28, 0, 52, 29, 67, (x, y, z) => jit(0x3a3b38, x >> 1, y, z >> 1, 0.05));
  // Pipes under the ceiling and down one wall.
  v.box(1, 25, 12, 51, 27, 14, (x, y, z) => jit(x % 12 === 0 ? 0x2a2c2f : 0x5a3a2a, x, y, z, 0.06));
  v.box(44, 24, 1, 46, 26, 66, (x, y, z) => jit(z % 14 === 0 ? 0x2a2c2f : 0x4a4e52, x, y, z, 0.06));
  v.box(4, 1, 1, 6, 28, 3, (x, y, z) => jit(y % 10 === 0 ? 0x2a2c2f : 0x5a3a2a, x, y, z, 0.06));
  // Steps up to the door in the south-east corner.
  for (let i = 0; i < 9; i++) v.box(40, 1, 64 - i * 2, 51, 2 + i * 2, 66 - i * 2, (x, y, z) => jit(0x4d4e4a, x, y, z, 0.05));
  v.box(40, 19, 44, 51, 20, 48, 0x4d4e4a);
  v.box(42, 20, 44, 50, 28, 45, (x, y) => (x === 42 || x === 49 || y === 27 ? 0x2a2c2f : jit(0x3a4a44, x, y, 0, 0.05)));
  // Work table and a stool.
  v.box(17, 7, 37, 33, 9, 47, (x, y, z) => jit(0x4a3423, x >> 1, y, z, 0.1));
  for (const [x, z] of [[17, 37], [32, 37], [17, 46], [32, 46]] as Array<[number, number]>) v.box(x, 1, z, x + 1, 7, z + 1, 0x2e1f15);
  v.box(8, 1, 44, 12, 5, 48, 0x3a2a1c);
  // Felt cloth the rounds stand on.
  v.box(21, 8, 39, 29, 9, 46, (x, y, z) => jit(0x2c3a33, x, y, z, 0.06));
  // Crate against the north wall, sandbags behind the target.
  v.box(19, 1, 2, 31, 9, 10, (x, y, z) => (x === 19 || x === 30 || y === 8 || y === 1 || (x + y) % 6 === 0 ? 0x4a3a26 : jit(0x6a5536, x, y, z, 0.08)));
  v.box(14, 1, 1, 36, 20, 3, (x, y, z) => ((y % 4 === 0 || (x + (y >> 2) * 3) % 7 === 0) ? 0x55503f : jit(0x7a7258, x, y, z, 0.08)));
  // Shelf with tins on the west wall.
  v.box(1, 13, 20, 5, 14, 40, 0x3a2a1c);
  for (const z of [22, 27, 31, 36]) v.box(2, 14, z, 4, 17, z + 2, [0x5a6a4a, 0x8a3a2a, 0x4a5a6a, 0x7a7a3a][(z >> 1) % 4]!);

  const solid = v.mesh(S);
  solid.position.set(-S, -S, -S);
  group.add(solid);

  /* ----- the rounds ----- */
  const N = 36;
  const dummy = new THREE.Object3D();
  const bodies = new THREE.InstancedMesh(new THREE.BoxGeometry(0.034, 0.05, 0.034), new THREE.MeshStandardMaterial({ color: 0x8c7a46, roughness: 0.9 }), N);
  const coppers = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.034, 0.03), new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.45, metalness: 0.6 }), N);
  const stones = new THREE.InstancedMesh(slugGeometry(0.015, 3), slugMaterial(), N);
  const loose = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.03, 0.034), coppers.material, N);
  for (const m of [bodies, coppers, stones, loose]) {
    m.castShadow = true;
    m.frustumCulled = false;
    group.add(m);
  }
  // A dish for the pulled bullets, a tube of hull-patch adhesive.
  const dish = new Vox(7, 2, 7);
  dish.box(0, 0, 0, 7, 2, 7, (x, y, z) => (y === 1 && x > 0 && x < 6 && z > 0 && z < 6 ? null : 0x9da2aa));
  const dishMesh = dish.mesh(0.03, { anchor: "center" });
  dishMesh.position.set(2.5 + 0.47, 0.83, 4.2 + 0.12);
  group.add(dishMesh);
  const tube = new Vox(2, 2, 7);
  tube.box(0, 0, 0, 2, 2, 7, (_x, _y, z) => (z === 6 ? 0xc73a34 : z === 5 ? 0x2a2c30 : 0xd9dce0));
  const tubeMesh = tube.mesh(0.02, { anchor: "center" });
  tubeMesh.position.set(2.5 - 0.42, 0.82, 4.2 + 0.2);
  tubeMesh.rotation.y = 0.6;
  group.add(tubeMesh);

  /* ----- the bundle: suit cloth round a slab of raw beef ----- */
  const bundle = new THREE.Group();
  bundle.position.set(...CELLAR.bundle);
  group.add(bundle);
  const closed = new Vox(14, 14, 8);
  closed.box(0, 0, 0, 14, 14, 8, (x, y, z) => {
    const corner = (x === 0 || x === 13 ? 1 : 0) + (y === 0 || y === 13 ? 1 : 0) + (z === 0 || z === 7 ? 1 : 0);
    if (corner >= 2) return null;
    if (y === 6 || x === 7) return 0xb4b8c0; // seams
    if (y === 10 && x > 1 && x < 6) return 0x8d929b;
    return jit(0xe4e5e8, x, y, z, 0.03);
  });
  const closedMesh = closed.mesh(0.045, { anchor: "center" });
  bundle.add(closedMesh);
  // The same bundle with its face cut away: cloth, sponge, coolant tubing, meat.
  const open = new Vox(14, 14, 8);
  open.box(0, 0, 0, 14, 14, 8, (x, y, z) => {
    const corner = (x === 0 || x === 13 ? 1 : 0) + (y === 0 || y === 13 ? 1 : 0) + (z === 0 || z === 7 ? 1 : 0);
    if (corner >= 2) return null;
    const cutaway = z >= 6 && x > 1 && x < 12 && y > 1 && y < 12;
    if (cutaway) return null;
    const edge = Math.min(x, 13 - x, y, 13 - y);
    if (z === 5 && edge > 1) {
      if (edge === 2) return jit(0xe9eaec, x, y, z, 0.02);
      if (edge === 3) return jit(0xd9c46a, x, y, z, 0.08); // insulation sponge
      if (edge === 4) return (x + y) % 2 === 0 ? 0x3a78c8 : 0xd9dce0; // tubing
      return jit(hash3(x, y, 3) > 0.75 ? 0xd9a0a0 : 0xa3202a, x, y, z, 0.1); // beef
    }
    return jit(0xe4e5e8, x, y, z, 0.03);
  });
  const openMesh = open.mesh(0.045, { anchor: "center" });
  bundle.add(openMesh);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
  const holes = CELLAR.holes.map(([x, y]) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.01), holeMat);
    h.position.set(x, y, 0.045 * 4 + 0.003);
    bundle.add(h);
    return h;
  });

  // What is left of four rounds: gravel.
  const cv = new Vox(9, 3, 7);
  cv.each((x, y, z) => {
    const h = hash3(x, y, z);
    const d = Math.hypot(x - 4, z - 3) / 4.2;
    if (h < 0.35 + d * 0.5 + y * 0.22) return null;
    return h > 0.9 ? 0xa7a9ae : h > 0.6 ? 0x6a625a : 0x4a443e;
  });
  const crumbs = new THREE.Mesh(cv.geometry(0.02, "center"), voxelMaterial({ roughness: 0.6, metalness: 0.3 }));
  crumbs.castShadow = true;
  group.add(crumbs);

  /* ----- light ----- */
  group.add(new THREE.HemisphereLight(0x3a3f4a, 0x14110e, 0.4));
  const pivot = new THREE.Group();
  pivot.position.set(CELLAR.bulb[0], 2.7, CELLAR.bulb[2]);
  group.add(pivot);
  const wire = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.6, 0.02), new THREE.MeshBasicMaterial({ color: 0x0c0c0c }));
  wire.position.y = -0.3;
  pivot.add(wire);
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.5, 1.6) }));
  bulb.position.y = -0.65;
  pivot.add(bulb);
  const bulbGlow = makeGlow(0xffd28a, 1.5, 0.7);
  bulbGlow.position.y = -0.65;
  pivot.add(bulbGlow);
  const lamp = new THREE.SpotLight(0xffd9a0, 30, 9, 1.25, 0.6, 1.5);
  lamp.position.set(0, -0.7, 0);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(1024, 1024);
  lamp.shadow.bias = -0.002;
  lamp.shadow.normalBias = 0.03;
  lamp.shadow.camera.near = 0.2;
  lamp.shadow.camera.far = 8;
  pivot.add(lamp);
  const lampTarget = new THREE.Object3D();
  lampTarget.position.set(0, -3, 0);
  pivot.add(lampTarget);
  lamp.target = lampTarget;
  const spill = new THREE.PointLight(0xffc98a, 2.2, 8, 1.5);
  spill.position.set(0, -0.6, 0);
  pivot.add(spill);

  // A little cool bounce at the target so the suit cloth still reads as white.
  const targetFill = new THREE.PointLight(0xdfe8ff, 1.5, 3.2, 1.5);
  targetFill.position.set(2.75, 1.7, 1.55);
  group.add(targetFill);
  const flashLight = new THREE.PointLight(0xffe0a0, 0, 14, 1.3);
  group.add(flashLight);
  const flashGlow = makeGlow(0xffe6b0, 2.2, 0);
  group.add(flashGlow);
  const flash = new CubeFX(24, { additive: true });
  const smoke = new CubeFX(160, { opacity: 0.13 });
  (smoke.mesh.material as THREE.MeshBasicMaterial).color.setHex(0x8a8780);
  group.add(flash.mesh, smoke.mesh);

  const lastMuzzle = new THREE.Vector3(2.5, 1.35, 4.5);

  const animate = (T: number, muzzle: THREE.Vector3 | null, opened: number): { flash: number } => {
    // Thirty-six rounds: bullets pulled, then meteorite set in their place.
    const pulled = Math.floor(36 * seg(T, 150.6, 155.6));
    const glued = Math.floor(36 * seg(T, 154.8, 160.5));
    const spent = T > 161.2 ? 4 : 0;
    for (let i = 0; i < N; i++) {
      const p = CELLAR.round(i);
      const gone = i < spent;
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(p[0], p[1] + 0.025, p[2]);
      dummy.scale.setScalar(gone ? 0 : 1);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      dummy.position.set(p[0], p[1] + 0.067, p[2]);
      dummy.scale.setScalar(i < pulled || gone ? 0 : 1);
      dummy.updateMatrix();
      coppers.setMatrixAt(i, dummy.matrix);
      dummy.position.set(p[0], p[1] + 0.05 + 0.0225, p[2]);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.setScalar(i < glued && !gone ? 1 : 0);
      dummy.updateMatrix();
      stones.setMatrixAt(i, dummy.matrix);
      // Pulled bullets pile up in the dish.
      const a = hash1(i * 3.3) * 6.28, r = hash1(i * 1.7) * 0.06;
      dummy.position.set(2.97 + Math.cos(a) * r, 0.83 + 0.016 + Math.floor(i / 14) * 0.022, 4.32 + Math.sin(a) * r);
      dummy.rotation.set(hash1(i) * 3, hash1(i + 4) * 3, 0);
      dummy.scale.setScalar(i < pulled ? 1 : 0);
      dummy.updateMatrix();
      loose.setMatrixAt(i, dummy.matrix);
    }
    for (const m of [bodies, coppers, stones, loose]) m.instanceMatrix.needsUpdate = true;

    // The bulb swings after each concussion.
    let swing = 0, jolt = 0, fl = 0, shot = -1;
    TEST_SHOTS.forEach((s, i) => {
      const dt = T - s;
      holes[i]!.visible = dt > 0.02 && opened < 0.5;
      if (dt < 0) return;
      swing += 0.14 * Math.exp(-dt / 3.2) * Math.sin(dt * 4.4);
      jolt += Math.exp(-dt / 0.12);
      if (dt < 0.09) { fl = 1 - dt / 0.09; shot = i; }
    });
    pivot.rotation.set(swing, 0, swing * 0.6 + Math.sin(T * 0.7) * 0.012);
    bundle.position.set(CELLAR.bundle[0], CELLAR.bundle[1], CELLAR.bundle[2] - clamp(jolt, 0, 1.2) * 0.02);
    bundle.rotation.x = -clamp(jolt, 0, 1.2) * 0.05;
    closedMesh.visible = opened < 0.5;
    openMesh.visible = opened >= 0.5;

    if (muzzle) lastMuzzle.copy(muzzle);
    flash.begin();
    flashLight.intensity = 0;
    (flashGlow.material as THREE.SpriteMaterial).opacity = 0;
    if (fl > 0) {
      const age = 1 - fl;
      for (let k = 0; k < 12; k++) {
        const h1 = hash1(shot * 9 + k), h2 = hash1(shot * 5 + k * 3), h3 = hash1(shot + k * 7);
        const d = 0.05 + age * 0.4;
        flash.put(lastMuzzle.x + (h1 - 0.5) * d, lastMuzzle.y + (h2 - 0.5) * d, lastMuzzle.z - 0.06 - h3 * d * 1.8, 0.09 * fl + 0.02, k % 3 === 0 ? 0xfff6d8 : 0xffa838, h1 * 6, 1.6);
      }
      flashLight.position.copy(lastMuzzle).add(new THREE.Vector3(0, 0.05, -0.25));
      flashLight.intensity = 150 * fl;
      flashGlow.position.copy(flashLight.position);
      (flashGlow.material as THREE.SpriteMaterial).opacity = fl;
    }
    flash.end();

    // Powder smoke that has nowhere to go, and dust shaken off the ceiling.
    smoke.begin();
    TEST_SHOTS.forEach((s, i) => {
      for (let k = 0; k < 18; k++) {
        const born = s + hash1(i * 11 + k) * 0.25;
        const age = T - born;
        if (age < 0 || age > 9) continue;
        const h1 = hash1(i * 7 + k * 1.3), h2 = hash1(i * 3 + k * 2.9), h3 = hash1(i + k * 5.1);
        const out = 1 - Math.exp(-age * 2.2);
        const size = (0.04 + out * 0.14 + age * 0.012) * (1 - Math.pow(age / 9, 2));
        smoke.put(lastMuzzle.x + (h1 - 0.5) * 0.7 * out, lastMuzzle.y + (h2 - 0.3) * 0.5 * out + age * 0.05, lastMuzzle.z - 0.2 - h3 * 1.3 * out, size, 0xffffff, h1 * 6 + age * 0.2);
      }
      for (let k = 0; k < 10; k++) {
        const age = T - s - hash1(i * 13 + k) * 0.4;
        if (age < 0 || age > 1.6) continue;
        const x = 1 + hash1(i * 17 + k * 3) * 3, z = 1 + hash1(i * 19 + k * 7) * 4.5;
        smoke.put(x, 2.68 - age * age * 0.9, z, 0.025, 0xffffff, k);
      }
    });
    smoke.end();
    return { flash: fl };
  };

  return { group, bundle, crumbs, animate };
}
