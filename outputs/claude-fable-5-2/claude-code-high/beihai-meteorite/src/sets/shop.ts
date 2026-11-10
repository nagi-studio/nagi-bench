import * as THREE from "three";
import { voxelMaterial } from "@agentbench/voxel-kit";
import { Vox, lumpVox, block } from "../lib/vox";
import { CubeFX, makeGlow } from "../lib/fx";
import { clamp, easeIn, hash1, hash3, jit, lerp, seg, sstep, type V3 } from "../lib/util";
import { slugGeometry, slugMaterial, stoneColour } from "../cast/props";
import { DRILL_PLUNGES, LIGHTS_OUT, TRAY_END, TRAY_START } from "../timeline";

/**
 * The model workshop, after hours. One machine is awake. Inside its enclosure a
 * core drill takes rods out of a meteorite and a cut-off wheel turns the rods
 * into thirty-six short cylinders.
 * World metres = grid × 0.125; the hall spans x 0..12, z 0..9.
 */
const S = 0.125;

export const SHOP = {
  /** Centre of the machine bed, where the stone is clamped. */
  bed: [5.5, 0.875, 2.3] as V3,
  /** Where the rod is parted off, and the tray under it. */
  cutter: [6.25, 0.875, 2.3] as V3,
  operator: [5.8, 0, 3.85] as V3,
};

export interface ShopSet {
  group: THREE.Group;
  /** Drive every moving part of the machine from absolute time. */
  animate(T: number): { contact: number; cutting: number; count: number };
  stoneTop: number;
}

export function buildShop(): ShopSet {
  const group = new THREE.Group();
  group.name = "set:shop";
  const v = new Vox(96, 36, 72), lume = new Vox(96, 36, 72);

  v.box(0, 0, 0, 96, 1, 72, (x, _y, z) => {
    if (z === 44 || z === 45) return jit(0x8a7a2a, x >> 1, 0, z, 0.15);
    const joint = x % 16 === 0 || z % 16 === 0;
    return joint ? 0x2c2d2f : jit(0x47494b, x >> 1, 0, z >> 1, 0.07);
  });
  const wall = (x: number, y: number, z: number): number => (y < 10 ? jit(0x2a4a40, x >> 1, y >> 1, z >> 1, 0.05) : y === 10 ? 0x1c342c : jit(0x7d7f79, x >> 2, y >> 2, z >> 2, 0.04));
  v.box(0, 1, 0, 96, 36, 1, wall).box(0, 1, 71, 96, 36, 72, wall).box(0, 1, 0, 1, 36, 72, wall).box(95, 1, 0, 96, 36, 72, wall);
  v.box(0, 35, 0, 96, 36, 72, 0x1a1b1d);
  for (const z of [18, 40, 62]) v.box(1, 32, z, 95, 35, z + 2, 0x2a2c2f);
  // High windows: night.
  for (const x0 of [8, 30, 52, 74]) {
    v.carve(x0, 22, 0, x0 + 14, 30, 1);
    lume.box(x0, 22, 0, x0 + 14, 30, 1, (x, y) => ((x - x0) % 7 === 0 || y === 26 ? 0x0a0e18 : 0x16233c));
  }

  // Sleeping machines along the wall and across the aisle.
  const sleeper = (x0: number, z0: number, w: number, d: number, h: number, c: number): void => {
    v.box(x0, 1, z0, x0 + w, h, z0 + d, (x, y, z) => jit(y < 3 ? 0x1c1d20 : c, x >> 1, y >> 1, z >> 1, 0.05));
    v.box(x0 + 2, 6, z0 + d, x0 + w - 6, h - 3, z0 + d + 1, 0x0c0d10);
    lume.set(x0 + w - 3, h - 4, z0 + d, 0xff3322).set(x0 + w - 3, h - 6, z0 + d, 0x33ff66);
  };
  sleeper(6, 8, 20, 12, 15, 0x4a5058);
  sleeper(66, 8, 22, 13, 17, 0x55584f);
  sleeper(8, 54, 18, 10, 13, 0x4a4438);
  sleeper(40, 56, 16, 9, 12, 0x3f4650);
  sleeper(70, 54, 18, 11, 15, 0x4a5058);

  // The lathe/mill that is awake: pale enclosure, blue stripe, open window.
  v.box(34, 1, 9, 62, 19, 25, (x, y, z) => jit(y < 4 ? 0x2a2c30 : y === 17 ? 0x2a4a7a : 0xb4b7bb, x >> 1, y >> 1, z >> 1, 0.03));
  v.carve(36, 7, 11, 58, 17, 25);
  v.box(36, 7, 11, 58, 8, 25, (x, y, z) => jit(0x3a3d42, x, y, z, 0.05)); // bed
  v.box(36, 8, 11, 58, 17, 12, (x, y, z) => jit(0x2c2f34, x >> 1, y >> 1, z, 0.05));
  v.box(36, 15, 24, 58, 17, 25, 0xb4b7bb).box(36, 7, 24, 58, 9, 25, 0xb4b7bb);
  v.box(36, 9, 24, 37, 15, 25, 0x8d9096).box(57, 9, 24, 58, 15, 25, 0x8d9096);
  // Control pendant.
  v.box(58, 8, 25, 62, 16, 26, 0x1c1d20);
  lume.box(59, 12, 26, 61, 15, 27, (x, y) => ((x + y) % 2 === 0 ? 0x2bd66a : 0x0f5a2a));
  lume.set(59, 10, 26, 0xffb020).set(60, 10, 26, 0xff3322).set(59, 9, 26, 0x40a0ff);
  // Parts cart beside the operator.
  v.box(64, 1, 28, 72, 2, 34, 0x2a2c30).box(64, 6, 28, 72, 7, 34, (x, y, z) => jit(0x70757e, x, y, z, 0.05));
  for (const [x, z] of [[64, 28], [71, 28], [64, 33], [71, 33]] as Array<[number, number]>) v.box(x, 1, z, x + 1, 7, z + 1, 0x2a2c30);
  // Fluorescent fitting over the machine.
  v.box(38, 31, 29, 58, 32, 32, 0x2a2c2f);
  lume.box(39, 30, 30, 57, 31, 31, 0xeaf4ff);

  const solid = v.mesh(S);
  solid.position.set(0, -S, 0);
  group.add(solid);
  const tubeMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const lit = new THREE.Mesh(lume.geometry(S), tubeMat);
  lit.position.copy(solid.position);
  group.add(lit);

  /* ----- the work ----- */
  const steel = voxelMaterial({ roughness: 0.5, metalness: 0.5 });
  const rig = new THREE.Group();
  rig.position.set(...SHOP.bed);
  group.add(rig);
  const base = block(0.42, 0.06, 0.3, 0x3a3d42, steel);
  base.position.y = 0.03;
  rig.add(base);
  for (const sx of [-1, 1]) {
    const jaw = block(0.06, 0.12, 0.24, 0x70757e, steel);
    jaw.position.set(sx * 0.125, 0.12, 0);
    rig.add(jaw);
  }
  // The meteorite, faced flat on top so the drill can start true.
  const sv = 0.0125;
  const lump = lumpVox(7.2, 6, 7.2, 41, stoneColour("iron", 41), 0.3);
  const faceY = lump.sy - 4;
  lump.carve(0, faceY, 0, lump.sx, lump.sy, lump.sz);
  lump.each((x, y, z, cur) => (cur !== null && y === faceY - 1 ? jit(hash3(x, 1, z) > 0.8 ? 0xb9bcc2 : 0x8d8f96, x, y, z, 0.06) : undefined));
  const stone = new THREE.Mesh(lump.geometry(sv, "center"), voxelMaterial({ roughness: 0.55, metalness: 0.4 }));
  stone.castShadow = true;
  const stoneBase = 0.06;
  stone.position.y = stoneBase + (lump.sy * sv) / 2 - sv;
  rig.add(stone);
  const stoneTop = stoneBase + faceY * sv - sv;

  const holeSpots: Array<[number, number]> = [[-0.042, -0.036], [0.042, -0.036], [0, 0.004], [-0.042, 0.044], [0.042, 0.044]];
  const holes = holeSpots.map(([x, z]) => {
    const hv = new Vox(3, 1, 3);
    hv.box(0, 0, 0, 3, 1, 3, 0x050505);
    const h = new THREE.Mesh(hv.geometry(0.011, "center"), new THREE.MeshBasicMaterial({ vertexColors: true }));
    h.position.set(x, stoneTop + 0.004, z);
    rig.add(h);
    return h;
  });

  // Spindle and core bit.
  const spindle = new THREE.Group();
  rig.add(spindle);
  const head = block(0.14, 0.22, 0.14, 0x4a4e55, steel);
  head.position.y = 0.34;
  spindle.add(head);
  const quill = new THREE.Group();
  spindle.add(quill);
  const chuckV = new Vox(5, 4, 5);
  chuckV.box(0, 0, 0, 5, 4, 5, (x, y, z) => ((x === 0 || x === 4) && (z === 0 || z === 4) ? null : jit(y % 2 ? 0x55585e : 0x3a3d42, x, y, z, 0.1)));
  const chuck = new THREE.Mesh(chuckV.geometry(0.016, "center"), steel);
  chuck.position.y = 0.2;
  quill.add(chuck);
  const bitV = new Vox(3, 12, 3);
  bitV.box(0, 0, 0, 3, 12, 3, (x, y, z) => {
    if (x === 1 && z === 1) return y < 2 ? null : 0x1a1a1c;
    return y < 2 ? 0xc9a23a : (x + z + y) % 3 === 0 ? 0x2a2c30 : 0x55585e;
  });
  const bit = new THREE.Mesh(bitV.geometry(0.011, "center"), steel);
  bit.position.y = 0.11;
  quill.add(bit);

  // Rods taken so far, stood in a rack.
  const rack = block(0.2, 0.03, 0.06, 0x2a2c30, steel);
  rack.position.set(0.02, 0.015, 0.24);
  rig.add(rack);
  const rods = holeSpots.map((_s, i) => {
    const r = new THREE.Mesh(slugGeometry(0.011, 9), slugMaterial());
    r.rotation.x = -Math.PI / 2;
    r.position.set(-0.06 + i * 0.04, 0.03 + 0.05, 0.24);
    rig.add(r);
    return r;
  });

  // Parting-off station and the tray.
  const cut = new THREE.Group();
  cut.position.set(...SHOP.cutter);
  group.add(cut);
  const collet = block(0.1, 0.1, 0.1, 0x55585e, steel);
  collet.position.set(-0.16, 0.26, 0);
  cut.add(collet);
  const feed = new THREE.Mesh(slugGeometry(0.011, 12), slugMaterial());
  feed.rotation.y = Math.PI / 2;
  cut.add(feed);
  const wheelV = new Vox(1, 13, 13);
  wheelV.each((_x, y, z) => {
    const d = Math.hypot(y - 6, z - 6);
    if (d > 6.4) return null;
    return d < 1.6 ? 0x2a2c30 : (Math.floor(Math.atan2(y - 6, z - 6) * 3 + 20) % 2 === 0 ? 0x9a6a3a : 0x7a5230);
  });
  const wheel = new THREE.Mesh(wheelV.geometry(0.011, "center"), voxelMaterial({ roughness: 0.8 }));
  cut.add(wheel);
  const tray = new Vox(16, 2, 16);
  tray.box(0, 0, 0, 16, 2, 16, (x, y, z) => (y === 1 && x > 0 && x < 15 && z > 0 && z < 15 ? null : jit(0x2c2f34, x, y, z, 0.06)));
  const trayMesh = tray.mesh(0.02, { anchor: "center", material: steel });
  trayMesh.position.set(0.04, 0.02, 0.02);
  cut.add(trayMesh);
  const slugs = new THREE.InstancedMesh(slugGeometry(0.011, 3), slugMaterial(), 36);
  slugs.castShadow = true;
  slugs.frustumCulled = false;
  cut.add(slugs);

  const sparks = new CubeFX(150, { additive: true });
  group.add(sparks.mesh);

  /* ----- light ----- */
  const hemi = new THREE.HemisphereLight(0x2c3848, 0x0a0a0c, 0.55);
  group.add(hemi);
  const key = new THREE.SpotLight(0xdce8ff, 30, 12, 0.72, 0.7, 1.5);
  key.position.set(5.9, 3.75, 4.4);
  key.target.position.set(5.9, 0.6, 3.0);
  key.castShadow = false;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.002;
  key.shadow.normalBias = 0.03;
  group.add(key, key.target);
  const work = new THREE.PointLight(0xeaf2ff, 2.0, 3.6, 1.5);
  work.position.set(5.1, 1.75, 2.65);
  group.add(work);
  const workGlow = makeGlow(0xeaf2ff, 0.5, 0.6);
  workGlow.position.copy(work.position);
  group.add(workGlow);
  const sparkLight = new THREE.PointLight(0xffa040, 0, 3.5, 1.6);
  group.add(sparkLight);
  const tubeGlow = makeGlow(0xdce8ff, 2.6, 0.35);
  tubeGlow.position.set(6, 3.7, 3.8);
  group.add(tubeGlow);

  const dummy = new THREE.Object3D();

  const animate = (T: number): { contact: number; cutting: number; count: number } => {
    // Core drill: approach, plunge, retract, move to the next spot.
    let index = 0, depth = 0, contact = 0;
    DRILL_PLUNGES.forEach(([a, b], i) => {
      if (T >= a - 0.55) index = i;
      holes[i]!.visible = T > a + 0.25;
      rods[i]!.visible = T > b + 0.5;
    });
    const [a, b] = DRILL_PLUNGES[index]!;
    const down = sstep(seg(T, a - 0.45, a));
    const bite = seg(T, a, b);
    const up = sstep(seg(T, b, b + 0.35));
    depth = (down * 0.035 + bite * 0.085) * (1 - up);
    contact = T >= a && T <= b ? 1 : 0;
    const prev = holeSpots[Math.max(0, index - 1)]!, spot = holeSpots[index]!;
    const travel = index === 0 ? 1 : sstep(seg(T, a - 1.0, a - 0.5));
    const done = T > DRILL_PLUNGES[DRILL_PLUNGES.length - 1]![1] + 0.4;
    spindle.position.set(lerp(prev[0], spot[0], travel), 0, lerp(prev[1], spot[1], travel));
    const spin = clamp(1 - seg(T, LIGHTS_OUT - 3.6, LIGHTS_OUT - 2.2));
    quill.position.y = stoneTop + 0.04 - depth + (done ? sstep(seg(T, 136.8, 137.4)) * 0.08 : 0);
    quill.rotation.y = T * 38 * spin;

    // Parting off: the wheel dips once per segment.
    const span = (TRAY_END - TRAY_START) / 36;
    const count = clamp(Math.floor((T - TRAY_START) / span) + 1, 0, 36);
    const phase = T < TRAY_START || T > TRAY_END ? 0 : ((T - TRAY_START) / span) % 1;
    const dip = phase < 0.6 ? Math.sin((phase / 0.6) * Math.PI) : 0;
    const cutting = T >= TRAY_START && T <= TRAY_END && phase < 0.6 ? 1 : 0;
    wheel.position.set(0.0, 0.26 + 0.09 - dip * 0.075, 0);
    wheel.rotation.x = T * 55 * spin;
    feed.position.set(-0.07 + phase * 0.02, 0.26, 0);
    feed.visible = T < TRAY_END + 0.1;
    slugs.count = count;
    for (let i = 0; i < count; i++) {
      const born = TRAY_START + i * span + span * 0.55;
      const fall = easeIn(seg(T, born, born + 0.28));
      const col = i % 6, row = Math.floor(i / 6);
      const sx = 0.04 + (col - 2.5) * 0.046, sz = 0.02 + (row - 2.5) * 0.046;
      dummy.position.set(lerp(0.012, sx, fall), lerp(0.26, 0.045, fall) + Math.sin(fall * Math.PI) * 0.03, lerp(0, sz, fall));
      dummy.rotation.set((1 - fall) * 2.4 + (hash1(i) - 0.5) * 0.3, Math.PI / 2 + (hash1(i + 9) - 0.5) * 0.5 * fall, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      slugs.setMatrixAt(i, dummy.matrix);
    }
    slugs.instanceMatrix.needsUpdate = true;

    // Sparks from whichever tool is cutting.
    sparks.begin();
    const src = contact
      ? new THREE.Vector3(SHOP.bed[0] + spindle.position.x, SHOP.bed[1] + stoneTop + 0.005, SHOP.bed[2] + spindle.position.z)
      : cutting
        ? new THREE.Vector3(SHOP.cutter[0] + 0.004, SHOP.cutter[1] + 0.27, SHOP.cutter[2])
        : null;
    if (src) {
      for (let k = 0; k < 70; k++) {
        const life = 0.22 + hash1(k * 3.7) * 0.3;
        const age = (T * (1 + hash1(k) * 0.3) + hash1(k * 1.9) * life) % life;
        const ang = hash1(k * 5.3 + Math.floor(T / life)) * Math.PI * 2;
        const sp = 0.5 + hash1(k * 7.1) * 1.3;
        const vx = Math.cos(ang) * sp * (contact ? 1 : 0.5), vz = Math.sin(ang) * sp * (contact ? 1 : 0.4) + (contact ? 0 : 0.9), vy = 0.5 + hash1(k * 2.3) * 1.2;
        const f = 1 - age / life;
        sparks.put(src.x + vx * age, src.y + vy * age - 3.2 * age * age, src.z + vz * age, 0.006 + f * 0.008, f > 0.6 ? 0xfff2c0 : f > 0.3 ? 0xffb040 : 0xff5a18, k, 1.6);
      }
      sparkLight.position.copy(src).add(new THREE.Vector3(0, 0.08, 0.1));
      sparkLight.intensity = 1.6 + hash1(Math.floor(T * 40)) * 1.6;
    } else sparkLight.intensity = 0;
    sparks.end();

    // House lights.
    const on = T < LIGHTS_OUT ? 1 : 0;
    key.intensity = 30 * on;
    work.intensity = 2.0 * on;
    workGlow.visible = on > 0;
    tubeGlow.visible = on > 0;
    tubeMat.color.setScalar(on ? 1 : 0.16);
    hemi.intensity = on ? 0.55 : 0.2;
    return { contact, cutting, count };
  };

  return { group, animate, stoneTop: SHOP.bed[1] + stoneTop };
}
