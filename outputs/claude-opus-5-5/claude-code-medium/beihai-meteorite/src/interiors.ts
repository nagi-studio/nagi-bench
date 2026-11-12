import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelTerrain } from "@agentbench/voxel-kit";
import { canvasTexture, hash3, fbm, glowTexture, rng } from "./util";
import {
  voxMesh, sharedVoxelMat, ironMeteorite, plainStone, teacupGeometry, teapotGeometry, magnifierGeometry,
  slab, slugGeometry, roundGeometry, bulletHeadGeometry, cylinderVox, lumpGeometry, pistolGeometry, magazineGeometry, pliersGeometry,
} from "./props";
import type { SetDef } from "./context";

function skyTexture(stops: Array<[number, string]>) {
  return canvasTexture(4, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    for (const [o, c] of stops) g.addColorStop(o, c);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
  });
}

const box = (w: number, h: number, d: number, voxel: number, fn: (x: number, y: number, z: number) => number | null) =>
  voxMesh(slab(Math.round(w / voxel), Math.round(h / voxel), Math.round(d / voxel), voxel, fn));

/* =============================== HUTONG =============================== */

export function buildHutong() {
  const group = new THREE.Group();
  const V = 0.25;
  // lane ground: x -4..4, z -36..8
  const ground = voxelTerrain(32, 176, (x, z) => 2 + (hash3(x, z, 1) > 0.93 ? 1 : 0) + (Math.abs(x - 15.5) > 11 ? 1 : 0), (x, y, z, top) => {
    if (!top) return 0x3a3734;
    const brick = ((x >> 1) + (z >> 2)) % 2 === 0;
    const n = hash3(x, z, 3);
    return brick ? (n > 0.5 ? 0x625e58 : 0x58544f) : (n > 0.5 ? 0x6c6862 : 0x5f5b55);
  }, { voxel: V, anchor: "min" });
  const gm = voxMesh(ground);
  gm.position.set(-4, -0.75, -36);
  gm.castShadow = false;
  group.add(gm);

  const wallFn = (seed: number) => (x: number, y: number, z: number) => {
    if (y >= 13) {
      // tiled coping
      if (y === 13) return 0x2c302e;
      if (y === 14) return (z % 2 === 0) ? 0x3a403d : 0x323735;
      return null;
    }
    const row = y % 2 === 0;
    const joint = ((z + (row ? 0 : 1)) % 3 === 0);
    const n = hash3(x, y, z, seed);
    if (y < 2) return 0x47423e;
    if (joint) return 0x7d7a74;
    return n > 0.85 ? 0x5c5c5a : n > 0.5 ? 0x6e6e6c : 0x666664;
  };
  // left wall (full), right wall with a gap for the gate
  const left = box(1, 3.75, 44, V, wallFn(4));
  left.position.set(-3.5, -0.25, -36);
  group.add(left);
  const right1 = box(1, 3.75, 25, V, wallFn(5));
  right1.position.set(2.5, -0.25, -36);
  group.add(right1);
  const right2 = box(1, 3.75, 15.5, V, wallFn(6));
  right2.position.set(2.5, -0.25, -7.5);
  group.add(right2);

  // gate: recessed red leaves, lintel and small roof, stone drums
  const gate = new THREE.Group();
  const leaves = box(0.25, 2.5, 3.5, V, (_x, y, z) => {
    if (z === 6 || z === 7) return 0x3a1612;
    if (y % 4 === 0) return 0x6e1d16;
    if ((z === 3 || z === 10) && y % 3 === 1) return 0xc89a3a; // studs
    return 0x8a2a20;
  });
  leaves.position.set(3.1, -0.25, -11);
  gate.add(leaves);
  const lintel = box(1.25, 0.75, 4.5, V, (_x, y, z) => (y === 2 ? 0x2c302e : (z % 3 === 0 ? 0x2f5a4a : 0x7a2a22)));
  lintel.position.set(2.25, 2.25, -11.5);
  gate.add(lintel);
  const roof = box(2, 0.5, 5.5, V, (_x, y, z) => (y === 1 ? ((z % 2) ? 0x323735 : 0x3a403d) : 0x2a2e2c));
  roof.position.set(1.75, 3.0, -12);
  gate.add(roof);
  for (const z of [-11.4, -7.1]) {
    const drum = voxMesh(cylinderVox(2, 3, 0.2, (_x, y) => (y === 2 ? 0x8a8780 : 0x9a968e), "z"));
    drum.position.set(2.0, -0.05, z);
    drum.rotation.y = Math.PI / 2;
    gate.add(drum);
  }
  // door plate
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshStandardMaterial({
    map: canvasTexture(20, 10, (ctx) => { ctx.fillStyle = "#1f3f6a"; ctx.fillRect(0, 0, 20, 10); ctx.fillStyle = "#e6e2d8"; ctx.fillRect(3, 4, 14, 2); }, true),
  }));
  plate.position.set(2.48, 1.7, -6.8);
  plate.rotation.y = -Math.PI / 2;
  gate.add(plate);
  group.add(gate);

  // lanterns
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xff5a30 });
  const lanterns: THREE.PointLight[] = [];
  for (const z of [-11.8, -6.6]) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.4, 0.32), lanternMat);
    l.position.set(2.15, 2.15, z);
    group.add(l);
    const tasselTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.2), new THREE.MeshBasicMaterial({ color: 0x1a1a1a }));
    tasselTop.position.set(2.15, 2.38, z);
    group.add(tasselTop);
    const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xff6a30, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.6 }));
    g.scale.setScalar(1.6);
    g.position.copy(l.position);
    group.add(g);
    const pl = new THREE.PointLight(0xff7a40, 4, 9, 1.6);
    pl.position.set(1.9, 2.0, z);
    group.add(pl);
    lanterns.push(pl);
  }
  // warm window on the left wall
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), new THREE.MeshBasicMaterial({
    map: canvasTexture(20, 14, (ctx) => {
      ctx.fillStyle = "#f2b46a"; ctx.fillRect(0, 0, 20, 14);
      ctx.fillStyle = "#3a2216";
      for (let i = 0; i <= 20; i += 5) ctx.fillRect(i, 0, 1, 14);
      for (let j = 0; j <= 14; j += 4) ctx.fillRect(0, j, 20, 1);
    }, true),
  }));
  win.position.set(-2.49, 1.6, -18);
  win.rotation.y = Math.PI / 2;
  group.add(win);

  // scholar tree at lane end
  const trunk = box(0.5, 4, 0.5, V, () => 0x3a2a1e);
  trunk.position.set(-1.2, -0.25, -30);
  group.add(trunk);
  const canopy = voxMesh(lumpGeometry(8, 9, 0.3, (_x, _y, _z, n) => (n > 0.55 ? 0x2f4a2a : n > 0.45 ? 0x3d5a32 : 0x263d24), [1.3, 0.7, 1.1]));
  canopy.position.set(-1, 4.6, -29.8);
  group.add(canopy);

  // bicycle (blocky)
  const bike = voxMesh(buildVoxelGeometry({
    size: [1, 9, 16],
    at(_x, y, z) {
      const w1 = Math.hypot(y - 3, z - 3), w2 = Math.hypot(y - 3, z - 12);
      if ((w1 > 2 && w1 < 3.1) || (w2 > 2 && w2 < 3.1)) return 0x1c1c1c;
      if (y === 6 && z > 4 && z < 12) return 0x2a4a5a;
      if ((z === 5 && y >= 3 && y <= 7) || (z === 11 && y >= 3 && y <= 8)) return 0x2a4a5a;
      if (y === 8 && z >= 3 && z <= 6) return 0x2b2016;
      if (y === 8 && z >= 10 && z <= 13) return 0x8a8a8a;
      return null;
    },
  }, { voxel: 0.1, anchor: "min" }));
  bike.position.set(-2.4, -0.25, -15);
  bike.rotation.z = 0.12;
  group.add(bike);

  // overhead wires
  for (const [y, s] of [[3.9, 0.3], [4.1, -0.4]] as const) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 44), new THREE.MeshBasicMaterial({ color: 0x0c0c0e }));
    w.position.set(s, y, -14);
    w.rotation.x = 0.01;
    group.add(w);
  }

  const hemi = new THREE.HemisphereLight(0x7a8fb8, 0x3a3029, 0.9);
  group.add(hemi);
  const sun = new THREE.DirectionalLight(0xffa060, 1.6);
  sun.position.set(-6, 5, -40);
  sun.target.position.set(0, 0, -5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -12; sc.right = 12; sc.top = 12; sc.bottom = -12; sc.near = 1; sc.far = 80;
  sun.shadow.bias = -0.0008;
  group.add(sun, sun.target);

  const bg = skyTexture([[0, "#1a2340"], [0.45, "#4a4f72"], [0.75, "#c07a5a"], [1, "#e8a060"]]);
  const set: SetDef = {
    name: "hutong",
    group,
    background: bg,
    fog: new THREE.Fog(0x6b5f6a, 14, 46),
    exposure: 1.0,
  };
  return { set, lanterns };
}

/* =============================== COLLECTOR'S ROOM =============================== */

export function buildRoom() {
  const group = new THREE.Group();
  const W = 7, D = 7.4, H = 3.2, Z0 = -2.8;
  // floor planks
  const floor = box(W, 0.1, D, 0.1, (x, _y, z) => {
    const plank = Math.floor(x / 3);
    const n = hash3(plank, Math.floor((z + plank * 7) / 18), 1);
    const base = n > 0.6 ? 0x4a3020 : n > 0.3 ? 0x553826 : 0x3f2a1c;
    return (z + plank * 7) % 18 === 0 ? 0x2a1a10 : base;
  });
  floor.position.set(-W / 2, -0.1, Z0);
  floor.castShadow = false;
  group.add(floor);
  const wallMat = voxelMaterial({ roughness: 1 });
  const wallFn = (seed: number) => (x: number, y: number, z: number) => {
    if (y < 3) return 0x2a1d14;
    if ((x + z) % 16 === 0) return 0x3b2a1c; // timber posts
    const n = fbm(x * 0.2, y * 0.2, z * 0.2, 2, seed);
    return n > 0.55 ? 0x6a5a48 : 0x5f5040;
  };
  const back = voxMesh(slab(Math.round(W / 0.2), Math.round(H / 0.2), 1, 0.2, wallFn(2)), wallMat);
  back.position.set(-W / 2, 0, Z0 - 0.2);
  group.add(back);
  const leftW = voxMesh(slab(1, Math.round(H / 0.2), Math.round(D / 0.2), 0.2, wallFn(3)), wallMat);
  leftW.position.set(-W / 2 - 0.2, 0, Z0);
  group.add(leftW);
  const rightW = voxMesh(slab(1, Math.round(H / 0.2), Math.round(D / 0.2), 0.2, (x, y, z) => {
    // lattice window cut-out region handled by an emissive panel in front
    return wallFn(4)(x, y, z);
  }), wallMat);
  rightW.position.set(W / 2, 0, Z0);
  group.add(rightW);
  const frontW = voxMesh(slab(Math.round(W / 0.2), Math.round(H / 0.2), 1, 0.2, wallFn(5)), wallMat);
  frontW.position.set(-W / 2, 0, Z0 + D);
  group.add(frontW);
  // ceiling beams
  for (let i = 0; i < 6; i++) {
    const b = box(W, 0.25, 0.25, 0.25, () => 0x2a1c12);
    b.position.set(-W / 2, H - 0.25, Z0 + 0.4 + i * 1.2);
    group.add(b);
  }
  const ceil = box(W, 0.1, D, 0.5, () => 0x241a12);
  ceil.position.set(-W / 2, H, Z0);
  group.add(ceil);

  // lattice window on the right wall
  const latticeTex = canvasTexture(48, 32, (ctx) => {
    ctx.fillStyle = "#5c7aa8"; ctx.fillRect(0, 0, 48, 32);
    const g = ctx.createLinearGradient(0, 0, 0, 32); g.addColorStop(0, "rgba(40,50,90,0.6)"); g.addColorStop(1, "rgba(220,140,90,0.5)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 48, 32);
    ctx.fillStyle = "#2a1a10";
    for (let x = 0; x <= 48; x += 4) ctx.fillRect(x, 0, 1, 32);
    for (let y = 0; y <= 32; y += 4) ctx.fillRect(0, y, 48, 1);
    ctx.fillRect(0, 0, 48, 2); ctx.fillRect(0, 30, 48, 2); ctx.fillRect(0, 0, 2, 32); ctx.fillRect(46, 0, 2, 32);
  }, true);
  const lattice = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), new THREE.MeshBasicMaterial({ map: latticeTex }));
  lattice.position.set(W / 2 - 0.01, 1.7, 1.2);
  lattice.rotation.y = -Math.PI / 2;
  group.add(lattice);

  // glass cabinets
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xa8c0d0, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1, depthWrite: false });
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xfff1d8 });
  const stones = new THREE.Group();
  const cabLights: THREE.Light[] = [];
  const makeCabinet = (x: number, z: number, rotY: number, seed: number) => {
    const cab = new THREE.Group();
    const frame = box(1.4, 2.3, 0.5, 0.1, (xx, yy, zz) => {
      const edge = xx === 0 || xx === 13 || yy === 0 || yy === 22 || zz === 0 || yy % 5 === 0 && yy > 2;
      if (!edge) return null;
      if (zz === 4 && !(xx === 0 || xx === 13 || yy === 0 || yy === 22)) return null;
      return yy < 3 ? 0x2a1a10 : 0x3a2414;
    });
    frame.position.set(-0.7, 0, -0.25);
    cab.add(frame);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.9), glassMat);
    glass.position.set(0, 1.3, 0.255);
    cab.add(glass);
    const r = rng(seed);
    for (let shelf = 0; shelf < 4; shelf++) {
      const y = 0.5 + shelf * 0.5;
      const strip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.02), stripMat);
      strip.position.set(0, y + 0.43, 0.18);
      cab.add(strip);
      for (let k = 0; k < 4; k++) {
        const tint = [0x5a4a40, 0x3a3532, 0x7a6450, 0x4a4040, 0x6a5a5a][Math.floor(r() * 5)]!;
        const st = voxMesh(plainStone(seed * 10 + shelf * 4 + k, 3 + r() * 3, 0.018, tint));
        st.position.set(-0.45 + k * 0.3 + (r() - 0.5) * 0.05, y + 0.08, -0.02);
        st.rotation.y = r() * 3;
        cab.add(st);
        stones.add(st);
      }
    }
    cab.position.set(x, 0, z);
    cab.rotation.y = rotY;
    group.add(cab);
    return cab;
  };
  makeCabinet(-2.2, -2.5, 0, 1);
  makeCabinet(-0.6, -2.5, 0, 2);
  makeCabinet(1.0, -2.5, 0, 3);
  makeCabinet(-3.2, -0.9, Math.PI / 2, 4);
  makeCabinet(-3.2, 0.7, Math.PI / 2, 5);
  for (const [x, z] of [[-0.6, -1.7], [-2.4, -0.1]] as const) {
    const l = new THREE.PointLight(0xffe2b8, 3.2, 4.5, 1.5);
    l.position.set(x, 1.7, z);
    group.add(l);
    cabLights.push(l);
  }

  // workbench + desk lamp + magnifier
  const bench = box(1.6, 0.8, 0.8, 0.1, (x, y, z) => {
    if (y === 7) return (x + z) % 5 === 0 ? 0x4a3020 : 0x5a3a26;
    if ((x < 1 || x > 14) && (z < 1 || z > 6)) return 0x3a2414;
    return null;
  });
  bench.position.set(1.6, 0, -1.6);
  group.add(bench);
  const lampArm = box(0.06, 0.55, 0.06, 0.03, () => 0x2a2a2a);
  lampArm.position.set(3.0, 0.8, -1.4);
  group.add(lampArm);
  const lampHead = box(0.24, 0.12, 0.24, 0.04, (_x, y) => (y === 0 ? null : 0x1d3a2a));
  lampHead.position.set(2.62, 1.3, -1.45);
  group.add(lampHead);
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), new THREE.MeshBasicMaterial({ color: 0xfff0c0 }));
  bulb.position.set(2.74, 1.3, -1.33);
  group.add(bulb);
  const deskLight = new THREE.SpotLight(0xffd59a, 14, 4, 0.8, 0.5, 1.4);
  deskLight.position.set(2.74, 1.28, -1.33);
  deskLight.target.position.set(2.4, 0.8, -1.2);
  deskLight.castShadow = true;
  deskLight.shadow.mapSize.set(1024, 1024);
  group.add(deskLight, deskLight.target);
  const magnifier = voxMesh(magnifierGeometry());
  magnifier.position.set(2.2, 0.82, -1.1);
  magnifier.rotation.x = -Math.PI / 2;
  group.add(magnifier);
  const benchStone = voxMesh(plainStone(91, 3, 0.012, 0x4a3f38));
  benchStone.position.set(2.4, 0.84, -1.3);
  group.add(benchStone);

  // tea table + chairs
  const table = box(1.0, 0.55, 0.7, 0.05, (x, y, z) => {
    if (y >= 9) return (x + z) % 7 === 0 ? 0x3a2012 : 0x4a2a18;
    if ((x < 2 || x > 17) && (z < 2 || z > 11)) return 0x3a2012;
    return null;
  });
  table.position.set(-0.5, 0, 0.45);
  group.add(table);
  const chair = (rotY: number, x: number, z: number) => {
    const g = new THREE.Group();
    const m = box(0.55, 1.0, 0.5, 0.05, (xx, y, zz) => {
      if (y === 9) return 0x3a2012;
      if (zz === 9 && y > 9) return (xx % 3 === 0) ? 0x2a160c : 0x3a2012;
      if ((xx < 1 || xx > 9) && (zz < 1 || zz > 8) && y < 9) return 0x2a160c;
      return null;
    });
    m.position.set(-0.275, 0, -0.2);
    g.add(m);
    g.rotation.y = rotY;
    g.position.set(x, 0, z);
    group.add(g);
    return g;
  };
  chair(-Math.PI / 2, -1.25, 0.8);
  chair(Math.PI / 2, 1.25, 0.8);
  const teapot = voxMesh(teapotGeometry());
  teapot.position.set(0.0, 0.62, 0.8);
  group.add(teapot);
  const cupA = voxMesh(teacupGeometry());
  cupA.position.set(-0.32, 0.585, 0.82);
  group.add(cupA);
  const cupB = voxMesh(teacupGeometry());
  cupB.position.set(0.28, 0.585, 0.82);
  group.add(cupB);

  // safe with microscope
  const safe = box(0.6, 0.7, 0.55, 0.05, (x, y, z) => ((x + y + z) % 9 === 0 ? 0x26332c : 0x2f3f36));
  safe.position.set(2.6, 0, 0.6);
  group.add(safe);
  const safeDoorPivot = new THREE.Group();
  safeDoorPivot.position.set(3.2, 0.05, 1.16);
  const safeDoor = box(0.6, 0.6, 0.05, 0.05, (x, y) => (x === 2 && y > 4 && y < 8 ? 0xc0a050 : 0x34463c));
  safeDoor.position.set(-0.6, 0, -0.05);
  const safeGlow = new THREE.PointLight(0xffe0b0, 0.6, 1.2, 2);
  safeGlow.position.set(2.9, 0.4, 0.9);
  group.add(safeGlow);
  safeDoorPivot.add(safeDoor);
  group.add(safeDoorPivot);
  const micro = box(0.2, 0.4, 0.25, 0.05, (x, y, z) => {
    if (y === 0) return 0x2a2a2a;
    if (x >= 1 && x <= 2 && z >= 1 && z <= 2) return y > 5 ? 0x3a3a3a : 0xd8d8d8;
    if (y === 3 && z <= 3) return 0x2a2a2a;
    return null;
  });
  micro.position.set(2.75, 0.7, 0.72);
  group.add(micro);
  const marsStone = voxMesh(lumpGeometry(55, 7, 0.0018, (x, y, z, n) => {
    const pit = hash3(x >> 1, y >> 1, z >> 1, 9) > 0.86;
    if (pit) return 0x3a1a12;
    return n > 0.55 ? 0x9a5a3a : n > 0.45 ? 0x8a4a30 : 0x7a3e28;
  }));
  marsStone.position.set(2.86, 0.725, 0.98);
  group.add(marsStone);

  // clock with pendulum
  const clock = box(0.4, 0.9, 0.18, 0.05, (x, y) => {
    if (y > 11 && x > 1 && x < 6) return y === 14 ? 0x222222 : 0xe8e0c8;
    return 0x3a2012;
  });
  clock.position.set(-3.35, 1.4, 1.55);
  clock.rotation.y = Math.PI / 2;
  group.add(clock);
  const pendulum = new THREE.Group();
  const bob = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.35, 0.02), new THREE.MeshStandardMaterial({ color: 0xc0a050, metalness: 0.8, roughness: 0.3 }));
  bob.position.y = -0.17;
  const bobDisc = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), bob.material);
  bobDisc.position.y = -0.36;
  pendulum.add(bob, bobDisc);
  pendulum.position.set(-3.16, 1.95, 1.35);
  pendulum.rotation.y = Math.PI / 2;
  group.add(pendulum);

  // old radio on a side shelf
  const radio = box(0.4, 0.25, 0.18, 0.025, (x, y) => {
    if (y > 2 && y < 8 && x > 1 && x < 8) return (x + y) % 2 === 0 ? 0x5a4a30 : 0x3a2e1e;
    if (y > 2 && y < 6 && x > 10 && x < 14) return 0xd8b060;
    return 0x6a3a1e;
  });
  const radioShelf = box(0.8, 0.05, 0.3, 0.05, () => 0x3a2414);
  radioShelf.position.set(2.0, 1.55, -2.75);
  radio.position.set(2.1, 1.6, -2.7);
  group.add(radioShelf, radio);
  const radioDial = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.01), new THREE.MeshBasicMaterial({ color: 0xffc070 }));
  radioDial.position.set(2.4, 1.71, -2.515);
  group.add(radioDial);

  // three iron meteorites (shown on the table when chosen)
  const irons = [0, 1, 2].map((i) => {
    const m = voxMesh(ironMeteorite(300 + i, 5.5, 0.0085));
    m.position.set(-0.55 + i * 0.22, 0.6, 0.62);
    m.rotation.y = i * 1.3;
    group.add(m);
    return m;
  });
  const walnut = voxMesh(ironMeteorite(299, 3, 0.008));
  walnut.position.set(-0.05, 0.59, 0.55);
  group.add(walnut);

  // phone and cloth bundle (for exit)
  const ambient = new THREE.AmbientLight(0x8a7a6a, 0.85);
  const frontFill = new THREE.DirectionalLight(0xd8d0c8, 0.7);
  frontFill.position.set(1.5, 2.5, 5);
  group.add(frontFill);
  const windowFill = new THREE.DirectionalLight(0x7f9ccf, 0.55);
  windowFill.position.set(6, 3, 1);
  const warmKey = new THREE.PointLight(0xffb070, 2.5, 7, 1.2);
  warmKey.position.set(0, 2.6, 1.2);
  group.add(ambient, windowFill, warmKey);

  const set: SetDef = { name: "room", group, background: new THREE.Color(0x0b0806), fog: new THREE.Fog(0x120c08, 6, 16), exposure: 1.05 };
  return { set, irons, walnut, cupA, cupB, teapot, pendulum, safeDoorPivot, marsStone, magnifier, stones, radioDial, micro };
}

/* =============================== WORKSHOP =============================== */

export function buildWorkshop() {
  const group = new THREE.Group();
  const floor = voxMesh(voxelTerrain(48, 40, () => 1, (x, _y, z) => ((x % 8 === 0 || z % 8 === 0) ? 0x3a3c3e : hash3(x, z, 5) > 0.5 ? 0x4a4c4e : 0x464849), { voxel: 0.25, anchor: "min" }));
  floor.position.set(-6, -0.25, -5);
  floor.castShadow = false;
  group.add(floor);
  // background machines in shadow
  for (let i = 0; i < 5; i++) {
    const m = box(1.2 + (i % 2) * 0.8, 1.4 + (i % 3) * 0.5, 1.0, 0.2, (x, y) => ((x + y) % 4 === 0 ? 0x2f3a44 : 0x26303a));
    m.position.set(-5.5 + i * 2.6, 0, -4.6);
    group.add(m);
  }
  // CNC lathe: base cabinet, bed, headstock, enclosure frame
  const lathe = new THREE.Group();
  const base = box(2.6, 0.9, 1.0, 0.1, (x, y, z) => (y === 8 ? 0x55606a : (z === 0 && x % 6 === 0) ? 0x2a3540 : 0x3c6a8a));
  base.position.set(-1.3, 0, -0.5);
  lathe.add(base);
  const head = box(0.7, 0.7, 0.8, 0.1, (_x, y) => (y === 6 ? 0x5a6670 : 0x3c6a8a));
  head.position.set(-1.3, 0.9, -0.4);
  lathe.add(head);
  const tail = box(0.4, 0.45, 0.5, 0.1, () => 0x4a5560);
  tail.position.set(0.8, 0.9, -0.25);
  lathe.add(tail);
  const encl = box(2.6, 1.0, 1.0, 0.1, (x, y, z) => {
    const edge = (x === 0 || x === 25) && (z === 0 || z === 9) || (y === 9 && (z === 0 || z === 9 || x === 0 || x === 25));
    return edge ? 0x2a3540 : null;
  });
  encl.position.set(-1.3, 0.9, -0.5);
  lathe.add(encl);
  const guard = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), new THREE.MeshStandardMaterial({ color: 0x9ab8c8, transparent: true, opacity: 0.15, roughness: 0.1, depthWrite: false }));
  guard.position.set(0.3, 1.35, 0.51);
  lathe.add(guard);
  // control panel screen
  const screenTex = canvasTexture(24, 16, (ctx) => {
    ctx.fillStyle = "#06222a"; ctx.fillRect(0, 0, 24, 16);
    ctx.fillStyle = "#3ad0c8";
    for (let i = 0; i < 5; i++) ctx.fillRect(2, 2 + i * 3, 6 + ((i * 7) % 12), 1);
    ctx.fillStyle = "#e0f060"; ctx.fillRect(18, 2, 4, 4);
  }, true);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.24), new THREE.MeshBasicMaterial({ map: screenTex }));
  screen.position.set(1.1, 1.45, 0.52);
  lathe.add(screen);
  // spinning chuck + stock
  const spindle = new THREE.Group();
  spindle.position.set(-0.6, 1.25, 0);
  const chuck = voxMesh(cylinderVox(4, 3, 0.04, (x, _y, z) => ((x + z) % 3 === 0 ? 0x8a9096 : 0x6a7076), "y"));
  chuck.rotation.z = Math.PI / 2;
  chuck.position.set(0, 0, 0);
  spindle.add(chuck);
  const stock = voxMesh(ironMeteorite(310, 5.5, 0.012));
  stock.position.set(0.2, 0, 0);
  spindle.add(stock);
  const rod = voxMesh(cylinderVox(1.5, 30, 0.01, (_x, y) => (y % 4 === 0 ? 0x8a8a86 : 0x6a6662), "y"));
  rod.rotation.z = -Math.PI / 2;
  rod.position.set(0.12, 0, 0);
  spindle.add(rod);
  lathe.add(spindle);
  const toolPost = box(0.16, 0.18, 0.2, 0.02, (x, y) => (y > 6 && x > 5 ? 0xe0c040 : 0x5a5f66));
  toolPost.position.set(-0.3, 1.05, 0.06);
  lathe.add(toolPost);
  lathe.position.set(0, 0, 0);
  group.add(lathe);

  // side bench with tray of cut slugs
  const bench = box(1.2, 0.9, 0.6, 0.1, (x, y, z) => (y === 8 ? 0x6a6e72 : (x < 1 || x > 10) && (z < 1 || z > 4) ? 0x3a3e42 : null));
  bench.position.set(1.7, 0, 0.6);
  group.add(bench);
  const tray = box(0.3, 0.02, 0.3, 0.02, (x, _y, z) => (x === 0 || x === 14 || z === 0 || z === 14 ? 0x9a9ea2 : 0x8a8e90));
  tray.position.set(2.1, 0.9, 0.75);
  group.add(tray);
  const slugGeo = slugGeometry(0.0022, 6, 2);
  const slugs: THREE.Mesh[] = [];
  for (let i = 0; i < 36; i++) {
    const s = voxMesh(slugGeo);
    s.position.set(2.14 + (i % 6) * 0.042, 0.925, 0.79 + Math.floor(i / 6) * 0.042);
    s.rotation.x = -Math.PI / 2;
    s.visible = false;
    group.add(s);
    slugs.push(s);
  }
  // rods lying on the bench
  const rods: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const r = voxMesh(cylinderVox(1.5, 26, 0.0045, (_x, y) => (y % 3 === 0 ? 0x7a7672 : 0x55524e), "y"));
    r.rotation.z = Math.PI / 2;
    r.position.set(1.95, 0.915, 0.65 + i * 0.03);
    r.visible = false;
    group.add(r);
    rods.push(r);
  }
  // special cutting tool (removed at the end)
  const cutter = box(0.05, 0.02, 0.12, 0.01, () => 0xe0c040);
  cutter.position.set(-0.26, 1.24, 0.12);
  group.add(cutter);
  // chips bag
  const bag = voxMesh(lumpGeometry(12, 4, 0.025, () => 0xd8d4c8));
  bag.position.set(1.45, 0.97, 0.7);
  bag.visible = false;
  group.add(bag);

  const work = new THREE.SpotLight(0xdfeaff, 40, 7, 0.55, 0.6, 1.3);
  work.position.set(0.2, 3.2, 1.2);
  work.target.position.set(0.1, 1.0, 0);
  work.castShadow = true;
  work.shadow.mapSize.set(1024, 1024);
  group.add(work, work.target);
  const amb = new THREE.AmbientLight(0x3a4a66, 0.35);
  group.add(amb);
  const faceBounce = new THREE.PointLight(0xbfd8ff, 1.6, 2.2, 1.6);
  faceBounce.position.set(0.0, 1.45, 0.25);
  group.add(faceBounce);
  const benchLamp = new THREE.PointLight(0xfff0d8, 2.2, 2.0, 1.6);
  benchLamp.position.set(2.2, 1.55, 0.95);
  group.add(benchLamp);
  const screenGlow = new THREE.PointLight(0x40d0c8, 0.8, 2.5, 2);
  screenGlow.position.set(1.1, 1.45, 0.8);
  group.add(screenGlow);

  const set: SetDef = { name: "workshop", group, background: new THREE.Color(0x05070a), fog: new THREE.Fog(0x05070a, 5, 14), exposure: 1.0 };
  return { set, spindle, stock, rod, slugs, rods, cutter, bag, work, toolPost };
}

/* =============================== BASEMENT =============================== */

export function buildBasement() {
  const group = new THREE.Group();
  const V = 0.12;
  const brick = (seed: number) => (x: number, y: number, z: number) => {
    const row = y % 2 === 0;
    const joint = ((x + z + (row ? 0 : 1)) % 3 === 0) || y % 2 === 1 && hash3(x, y, z, seed) > 0.9;
    const n = hash3(x, y, z, seed);
    if (joint) return 0x3a3430;
    return n > 0.8 ? 0x6a3a2a : n > 0.4 ? 0x5a3224 : 0x4e2c20;
  };
  const back = box(4.2, 2.4, V, V, brick(1));
  back.position.set(-2.1, 0, -1.9);
  group.add(back);
  const left = box(V, 2.4, 3.8, V, brick(2));
  left.position.set(-2.1, 0, -1.9);
  group.add(left);
  const right = box(V, 2.4, 3.8, V, brick(3));
  right.position.set(2.0, 0, -1.9);
  group.add(right);
  const floor = box(4.2, 0.1, 3.8, 0.2, (x, _y, z) => (hash3(x, z, 7) > 0.7 ? 0x3e3c3a : 0x353331));
  floor.position.set(-2.1, -0.1, -1.9);
  floor.castShadow = false;
  group.add(floor);
  const ceil = box(4.2, 0.12, 3.8, 0.2, () => 0x2a2826);
  ceil.position.set(-2.1, 2.4, -1.9);
  group.add(ceil);
  for (const z of [-1.2, -0.6]) {
    const pipe = box(4.2, 0.12, 0.12, 0.06, (x) => (x % 10 === 0 ? 0x6a5a4a : 0x4a443e));
    pipe.position.set(-2.1, 2.2, z);
    group.add(pipe);
  }

  const stool = box(0.35, 0.45, 0.35, 0.05, (x, y, z) => (y === 8 ? 0x4a3826 : (x === 0 || x === 6) && (z === 0 || z === 6) ? 0x3a2a1a : null));
  stool.position.set(-0.35, 0, 0.45);
  group.add(stool);
  // table
  const table = box(1.2, 0.75, 0.7, 0.05, (x, y, z) => {
    if (y >= 14) return (x + z) % 9 === 0 ? 0x4a3826 : 0x5a4430;
    if ((x < 2 || x > 21) && (z < 2 || z > 11)) return 0x3a2a1a;
    return null;
  });
  table.position.set(-0.6, 0, -0.35);
  group.add(table);
  const mat = box(0.7, 0.01, 0.45, 0.01, () => 0x2e3a2e);
  mat.position.set(-0.35, 0.75, -0.25);
  mat.castShadow = false;
  group.add(mat);

  // 36 rounds: 6x6, each with removable bullet head + slug
  const roundGeo = roundGeometry(false);
  const headGeo = bulletHeadGeometry();
  const slugGeo = slugGeometry(0.0028, 4, 1.6, 0x5a5654, 0x3a3634);
  const rounds: Array<{ body: THREE.Mesh; head: THREE.Mesh; slug: THREE.Mesh }> = [];
  for (let i = 0; i < 36; i++) {
    const g = new THREE.Group();
    const body = voxMesh(roundGeo);
    const head = voxMesh(headGeo);
    head.position.y = 0.0168 + 0.0056;
    const slug = voxMesh(slugGeo);
    slug.rotation.x = -Math.PI / 2;
    slug.position.y = 0.0168 + 0.0056 - 0.002;
    slug.visible = false;
    g.add(body, head, slug);
    g.position.set(-0.25 + (i % 6) * 0.03, 0.76 + 0.0084, -0.2 + Math.floor(i / 6) * 0.03);
    group.add(g);
    rounds.push({ body, head, slug });
  }
  // dish of copper heads removed
  const dish = box(0.1, 0.015, 0.1, 0.01, (x, _y, z) => (x === 0 || x === 9 || z === 0 || z === 9 ? 0xb0b4b8 : 0x8a8e92));
  dish.position.set(0.05, 0.76, -0.1);
  group.add(dish);
  const pliers = voxMesh(pliersGeometry());
  pliers.scale.setScalar(0.05625);
  pliers.position.set(0.1, 0.77, 0.02);
  pliers.rotation.set(0, 0.6, Math.PI / 2);
  group.add(pliers);
  const glue = box(0.03, 0.03, 0.12, 0.01, (_x, _y, z) => (z > 9 ? 0xd0d0d0 : 0x2a6a9a));
  glue.position.set(-0.45, 0.76, 0.0);
  group.add(glue);
  const pistolOnTable = voxMesh(pistolGeometry());
  pistolOnTable.scale.setScalar(0.05625);
  pistolOnTable.position.set(-0.45, 0.78, -0.25);
  pistolOnTable.rotation.set(0, 0.4, Math.PI / 2);
  group.add(pistolOnTable);
  const magOnTable = voxMesh(magazineGeometry());
  magOnTable.scale.setScalar(0.05625);
  magOnTable.position.set(-0.36, 0.77, -0.06);
  magOnTable.rotation.set(Math.PI / 2, 0, 0.3);
  group.add(magOnTable);
  // ammo case
  const ammoCase = box(0.22, 0.06, 0.16, 0.02, (x, y, z) => (y === 2 ? 0x3a4a3a : (x === 0 || x === 10 || z === 0 || z === 7) ? 0x2a362a : null));
  ammoCase.position.set(-0.6, 0.76, -0.3);
  ammoCase.visible = false;
  group.add(ammoCase);

  // crate + cloth bundle in the corner
  const crate = box(0.6, 0.5, 0.6, 0.1, (x, y, z) => ((x + y + z) % 2 === 0 ? 0x5a4a32 : 0x4a3a28));
  crate.position.set(1.2, 0, -1.65);
  group.add(crate);
  const bundleGeo = lumpGeometry(41, 7, 0.035, (x, y, z, n) => {
    if ((x + z) % 6 === 0) return 0x9aa0a6;
    return n > 0.5 ? 0xe4e4de : 0xd4d4ce;
  }, [1.2, 0.8, 1]);
  const bundle = voxMesh(bundleGeo);
  bundle.position.set(1.5, 0.75, -1.35);
  group.add(bundle);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x120c0a });
  const holes: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const h = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.025), holeMat);
    h.position.set(1.42 + (i % 2) * 0.06 - 0.03, 0.78 + Math.floor(i / 2) * 0.05, -1.35 + 0.22);
    h.rotation.y = -0.7;
    h.position.set(1.38 + i * 0.03, 0.74 + (i % 2) * 0.05, -1.16 + i * 0.02);
    h.visible = false;
    group.add(h);
    holes.push(h);
  }
  // opened bundle: layers + raw beef
  const opened = new THREE.Group();
  const layers = box(0.5, 0.06, 0.45, 0.025, (x, y, z) => {
    if (y === 0) return 0xe4e4de;
    if (y === 1) return (x + z) % 4 === 0 ? 0x5a8aaa : 0xd8c860; // insulation + tubing
    return null;
  });
  layers.position.set(-0.25, 0, -0.225);
  opened.add(layers);
  const beef = voxMesh(lumpGeometry(51, 5, 0.03, (x, y, z, n) => ((x + y * 2 + z) % 5 === 0 ? 0xe8d8d0 : n > 0.5 ? 0x9a2a2a : 0x7a1e20), [1.3, 0.6, 1]));
  beef.position.set(0, 0.1, 0);
  opened.add(beef);
  opened.position.set(1.5, 0.52, -1.35);
  opened.visible = false;
  group.add(opened);

  // bulb on a cord
  const bulbPivot = new THREE.Group();
  bulbPivot.position.set(0.0, 2.38, -0.2);
  const cord = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.6, 0.012), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  cord.position.y = -0.3;
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 0.07), new THREE.MeshBasicMaterial({ color: 0xffe0a0 }));
  bulb.position.y = -0.65;
  const bulbLight = new THREE.PointLight(0xffc880, 7, 7, 1.4);
  bulbLight.position.y = -0.7;
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(1024, 1024);
  bulbLight.shadow.bias = -0.002;
  bulbPivot.add(cord, bulb, bulbLight);
  group.add(bulbPivot);
  const amb = new THREE.AmbientLight(0x3a2a20, 0.25);
  group.add(amb);
  const flashLight = new THREE.PointLight(0xffd8a0, 0, 6, 1.5);
  group.add(flashLight);

  const set: SetDef = { name: "basement", group, background: new THREE.Color(0x040302), fog: new THREE.Fog(0x080604, 3, 9), exposure: 1.0 };
  return { set, stool, rounds, bulbPivot, bulbLight, bundle, holes, opened, ammoCase, pistolOnTable, magOnTable, flashLight, pliers };
}

/* =============================== BASE 1 CABIN =============================== */

export function buildCabin() {
  const group = new THREE.Group();
  const V = 0.1;
  const panel = (x: number, y: number, z: number) => ((x % 6 === 0 || y % 6 === 0 || z % 6 === 0) ? 0xb4bac0 : 0xd8dce0);
  const shell = box(2.6, 2.4, 3.2, V, (x, y, z) => {
    const edge = x === 0 || x === 25 || y === 0 || y === 23 || z === 0;
    if (!edge) return null;
    // porthole on right wall
    if (x === 25 && Math.hypot(y - 13, z - 12) < 3.4) return null;
    // hatch opening at front (z max not drawn)
    return panel(x, y, z);
  });
  shell.position.set(-1.3, 0, -1.6);
  group.add(shell);
  const porthole = new THREE.Mesh(new THREE.CircleGeometry(0.34, 8), new THREE.MeshBasicMaterial({
    map: canvasTexture(32, 32, (ctx) => {
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = "#1c4f8c"; ctx.beginPath(); ctx.arc(20, 30, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e8eef4"; ctx.fillRect(10, 18, 6, 2); ctx.fillRect(18, 22, 8, 2);
      ctx.fillStyle = "#fff"; ctx.fillRect(4, 6, 1, 1); ctx.fillRect(12, 3, 1, 1); ctx.fillRect(25, 8, 1, 1);
    }, true),
  }));
  porthole.position.set(1.29, 1.3, -0.4);
  porthole.rotation.y = -Math.PI / 2;
  group.add(porthole);
  // sleeping bag strapped to wall
  const bag = box(0.7, 1.9, 0.25, 0.05, (x, y) => (y % 9 === 0 ? 0x2a3a5a : x === 0 || x === 13 ? 0x2a3a5a : 0x3c5a8a));
  bag.position.set(-1.15, 0.3, -1.5);
  group.add(bag);
  // handrails
  for (const y of [0.5, 2.0]) {
    const rail = box(0.05, 0.05, 2.6, 0.05, () => 0xe0c040);
    rail.position.set(-1.2, y, -1.4);
    group.add(rail);
  }
  // locator unit
  const locator = box(0.12, 0.08, 0.05, 0.02, (x, y) => (x === 4 && y === 2 ? 0x30ff60 : 0x30353a));
  locator.position.set(-1.0, 1.3, -1.25);
  group.add(locator);
  const ledMat = new THREE.SpriteMaterial({ map: glowTexture(), color: 0x30ff60, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
  const led = new THREE.Sprite(ledMat);
  led.scale.setScalar(0.12);
  led.position.set(-0.9, 1.35, -1.19);
  group.add(led);
  const panelLight = new THREE.RectAreaLight(0xe8f0ff, 0, 1, 1);
  void panelLight;
  const top = new THREE.PointLight(0xe8f0ff, 6, 5, 1.4);
  const cabinFill = new THREE.DirectionalLight(0xdfe8ff, 0.9);
  cabinFill.position.set(1.2, 1.8, 2.5);
  group.add(cabinFill);
  top.position.set(0, 2.1, 0);
  const amb = new THREE.AmbientLight(0x8090a0, 1.2);
  group.add(top, amb);
  const set: SetDef = { name: "cabin", group, background: new THREE.Color(0x000000), fog: null, exposure: 1.0 };
  return { set, locator, led, ledMat };
}

export { sharedVoxelMat };
