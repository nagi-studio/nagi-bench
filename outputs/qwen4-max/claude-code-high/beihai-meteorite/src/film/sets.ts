import * as THREE from "three";
import { buildVoxelGeometry, voxelSphere, voxelTerrain, voxelModel, voxelMaterial } from "@agentbench/voxel-kit";
import { mulberry, hash } from "./helpers";

/* Small construction helpers — everything stays in the block language. */

export function box(w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0, opts: THREE.MeshStandardMaterialParameters = {}): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0, ...opts }));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function voxMesh(geo: THREE.BufferGeometry, x = 0, y = 0, z = 0, opts: THREE.MeshStandardMaterialParameters = {}): THREE.Mesh {
  const m = new THREE.Mesh(geo, voxelMaterial(opts));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function emissive(color: number, intensity = 1): THREE.MeshStandardMaterialParameters {
  return { emissive: color, emissiveIntensity: intensity, roughness: 1 };
}

/* ================================================================== */
/* HUTONG — dusk exterior, a warm window in the old city.              */
/* ================================================================== */

export interface HutongSet { group: THREE.Group; door: THREE.Vector3; lantern: THREE.Mesh; }

export function buildHutong(): HutongSet {
  const group = new THREE.Group();
  group.name = "hutong";

  // cobble ground
  const ground = voxMesh(voxelTerrain(40, 40, (x, z) => 1 + (hash(x * 3.1 + z * 7.7) > 0.8 ? 1 : 0),
    (x, y, z, top) => top ? (hash(x + z * 2.3) > 0.5 ? 0x4a4a50 : 0x404046) : 0x33333a, { voxel: 0.5 }), 0, -0.5, 0);
  ground.receiveShadow = true;
  group.add(ground);

  // courtyard house body
  const wall = 0x5a5048;
  group.add(box(10, 3.4, 6, wall, 0, 1.7, -4));
  // tiled roof (voxel stepped)
  const roof = voxMesh(buildVoxelGeometry({
    size: [22, 5, 14],
    at(x, y, z) {
      const ridge = 6 - Math.abs(z - 7);
      if (y > ridge) return null;
      if (y === ridge && (x % 2 === 0)) return 0x2c2c30;
      return y % 2 === 0 ? 0x33333a : 0x2a2a30;
    },
  }, { voxel: 0.5, anchor: "min" }), -5.5, 3.4, -7);
  group.add(roof);

  // door (recessed, warm)
  group.add(box(1.5, 2.4, 0.2, 0x3a2a1c, 0, 1.2, -0.95));
  const doorGlow = box(1.3, 2.2, 0.05, 0xffb36b, 0, 1.2, -0.9, emissive(0xffa855, 1.4));
  group.add(doorGlow);
  // steps
  group.add(box(2.2, 0.2, 0.8, 0x4a4a50, 0, 0.1, -0.4));

  // warm windows
  for (const wx of [-3.2, 3.2]) {
    group.add(box(1.6, 1.4, 0.1, 0xffc07a, wx, 1.9, -0.95, emissive(0xffa855, 1.1)));
    group.add(box(1.8, 0.1, 0.2, 0x2c241c, wx, 2.7, -0.9));
    group.add(box(1.8, 0.1, 0.2, 0x2c241c, wx, 1.15, -0.9));
  }

  // red lantern
  const lantern = voxMesh(voxelSphere(2.2, (x, y, z, d) => d > 0.8 ? 0xc0392b : 0xe74c3c, { voxel: 0.16 }), 1.9, 2.7, -0.6, emissive(0xff5a3a, 1.6));
  group.add(lantern);
  group.add(box(0.05, 0.5, 0.05, 0x2c241c, 1.9, 3.1, -0.6));

  // bare tree
  const trunk = voxMesh(buildVoxelGeometry({
    size: [3, 12, 3],
    at(x, y, z) {
      if (x === 1 && z === 1 && y < 9) return 0x3a2f26;
      if (y >= 6 && y < 11 && Math.abs(x - 1) + Math.abs(z - 1) === (y - 5) % 3) return 0x33291f;
      return null;
    },
  }, { voxel: 0.3, anchor: "min" }), -5, 0, 1);
  group.add(trunk);

  // distant rooftop silhouettes
  for (let i = 0; i < 7; i++) {
    const bx = -16 + i * 5 + hash(i) * 2;
    group.add(box(4, 2 + hash(i * 3) * 2, 4, 0x23262e, bx, 1, -12 - hash(i * 5) * 4));
  }

  // lighting: cool dusk fill + warm door spill + lantern
  const moon = new THREE.DirectionalLight(0x6a7fb0, 0.5);
  moon.position.set(-8, 12, 6);
  group.add(moon);
  const spill = new THREE.PointLight(0xffa855, 14, 12, 2);
  spill.position.set(0, 1.8, 0.4);
  spill.castShadow = true;
  spill.shadow.mapSize.set(1024, 1024);
  group.add(spill);
  const lanternLight = new THREE.PointLight(0xff6a4a, 6, 6, 2);
  lanternLight.position.set(1.9, 2.6, -0.4);
  group.add(lanternLight);
  group.add(new THREE.AmbientLight(0x2a3040, 0.5));

  return { group, door: new THREE.Vector3(0, 1.2, -0.6), lantern };
}

/* ================================================================== */
/* COLLECTOR'S ROOM — a small geological museum, warm and still.       */
/* ================================================================== */

export interface RoomSet {
  group: THREE.Group;
  bench: THREE.Vector3;
  teaTable: THREE.Vector3;
  lampSpot: THREE.SpotLight;
  dust: THREE.Points;
  cabinetStones: THREE.Mesh[];
  marsStone: THREE.Mesh;
  ironStones: THREE.Mesh[];
  safe: THREE.Mesh;
}

export function buildRoom(): RoomSet {
  const group = new THREE.Group();
  group.name = "room";
  const W = 7, D = 6, H = 3.2;

  // floor / walls / ceiling
  const floor = voxMesh(voxelTerrain(14, 12, () => 1, (x, y, z, top) => top ? (hash(x * 1.7 + z) > 0.5 ? 0x6a5240 : 0x5e4836) : 0x4a3828, { voxel: 0.5 }), 0, -0.5, 0);
  group.add(floor);
  group.add(box(W, H, 0.2, 0x4a4038, 0, H / 2, -D / 2)); // back
  group.add(box(0.2, H, D, 0x453c34, -W / 2, H / 2, 0)); // left
  group.add(box(0.2, H, D, 0x453c34, W / 2, H / 2, 0)); // right
  group.add(box(W, 0.2, D, 0x3a322a, 0, H, 0)); // ceiling

  // glass cabinets along back + side walls, with spotlit stones
  const cabinetStones: THREE.Mesh[] = [];
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x9fb4c8, transparent: true, opacity: 0.12, roughness: 0.1, metalness: 0.2 });
  function cabinet(cx: number, cz: number, rotY: number) {
    const cab = new THREE.Group();
    cab.position.set(cx, 0, cz);
    cab.rotation.y = rotY;
    cab.add(box(1.6, 2.2, 0.5, 0x3a2f26, 0, 1.1, 0));
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.0, 0.45), glassMat);
    glass.position.set(0, 1.15, 0.03);
    cab.add(glass);
    // shelves + stones
    for (let s = 0; s < 3; s++) {
      const sy = 0.55 + s * 0.62;
      cab.add(box(1.5, 0.04, 0.4, 0x2c241c, 0, sy, 0));
      cab.add(box(1.5, 0.02, 0.02, 0xffd9a0, 0, sy + 0.5, 0.18, emissive(0xffc07a, 1.2))); // light strip
      for (let k = 0; k < 3; k++) {
        const stone = voxMesh(voxelSphere(1.6 + hash(s * 3 + k) * 1.2,
          (x, y, z, d) => d > 0.85 ? 0x4a4d52 : (hash(x + y * 2 + z * 3 + s + k) > 0.6 ? 0x5a5f66 : 0x3a3d42), { voxel: 0.1 }),
          -0.5 + k * 0.5, sy + 0.12, 0);
        cab.add(stone);
        cabinetStones.push(stone);
      }
    }
    group.add(cab);
  }
  cabinet(-2.2, -2.7, 0);
  cabinet(0, -2.7, 0);
  cabinet(2.2, -2.7, 0);
  cabinet(-3.2, -0.5, Math.PI / 2);
  cabinet(-3.2, 1.4, Math.PI / 2);

  // workbench (collector's place) with magnifier lamp
  const benchPos = new THREE.Vector3(2.4, 0, 1.4);
  group.add(box(1.8, 0.9, 0.8, 0x5a4632, benchPos.x, 0.45, benchPos.z));
  group.add(box(1.9, 0.06, 0.9, 0x6a5640, benchPos.x, 0.92, benchPos.z));
  // desk lamp
  group.add(box(0.06, 0.7, 0.06, 0x2c2c30, benchPos.x - 0.6, 1.3, benchPos.z - 0.2));
  const lampHead = box(0.3, 0.16, 0.3, 0xffe0b0, benchPos.x - 0.5, 1.62, benchPos.z - 0.1, emissive(0xffd9a0, 2.2));
  group.add(lampHead);
  const lampSpot = new THREE.SpotLight(0xffc07a, 30, 6, Math.PI / 5, 0.5, 1.6);
  lampSpot.position.set(benchPos.x - 0.5, 1.6, benchPos.z - 0.1);
  lampSpot.target.position.set(benchPos.x, 0.95, benchPos.z);
  lampSpot.castShadow = true;
  lampSpot.shadow.mapSize.set(1024, 1024);
  group.add(lampSpot, lampSpot.target);

  // the Mars meteorite (tiny, precious) + microscope
  const marsStone = voxMesh(voxelSphere(1.2, 0x8a5a3a, { voxel: 0.06 }), benchPos.x + 0.3, 1.0, benchPos.z);
  group.add(marsStone);
  group.add(box(0.16, 0.4, 0.16, 0x2c2c30, benchPos.x + 0.55, 1.15, benchPos.z + 0.1));

  // tea table + two chairs
  const teaTable = new THREE.Vector3(-0.6, 0, 1.2);
  group.add(box(1.0, 0.5, 0.7, 0x5a4632, teaTable.x, 0.25, teaTable.z));
  group.add(box(1.1, 0.05, 0.8, 0x6a5640, teaTable.x, 0.52, teaTable.z));
  for (const cz of [teaTable.z + 0.7, teaTable.z - 0.7]) {
    group.add(box(0.5, 0.5, 0.5, 0x4a3826, teaTable.x, 0.25, cz));
    group.add(box(0.5, 0.6, 0.08, 0x4a3826, teaTable.x, 0.75, cz + (cz > teaTable.z ? 0.22 : -0.22)));
  }

  // safe in the corner
  const safe = box(0.7, 0.8, 0.6, 0x3a3f47, 3.0, 0.4, -2.2, { metalness: 0.5, roughness: 0.5 });
  group.add(safe);

  // three iron meteorites displayed on a cloth (revealed in the trade)
  const ironStones: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const st = voxMesh(voxelSphere(2.4, (x, y, z, d) => d > 0.82 ? 0x33363b : (hash(x + y + z + i) > 0.7 ? 0x565b62 : 0x2c2f34), { voxel: 0.11 }),
      teaTable.x - 0.3 + i * 0.3, 0.62, teaTable.z);
    st.visible = false;
    group.add(st);
    ironStones.push(st);
  }

  // paper lantern fill
  const lantern = voxMesh(voxelSphere(2.6, 0xf0d9a8, { voxel: 0.14 }), -1.5, 2.5, 0.5, emissive(0xffcf90, 1.3));
  group.add(lantern);
  const fill = new THREE.PointLight(0xffb870, 10, 9, 2);
  fill.position.set(-1.5, 2.4, 0.5);
  group.add(fill);
  group.add(new THREE.AmbientLight(0x3a2f26, 0.55));
  const rim = new THREE.DirectionalLight(0x8a9ac0, 0.25);
  rim.position.set(4, 3, 4);
  group.add(rim);

  // dust motes in the lamp beam
  const dustGeo = new THREE.BufferGeometry();
  const dn = 160, dp = new Float32Array(dn * 3);
  const rng = mulberry(99);
  for (let i = 0; i < dn; i++) {
    dp[i * 3] = benchPos.x - 1 + rng() * 2;
    dp[i * 3 + 1] = 0.9 + rng() * 1.4;
    dp[i * 3 + 2] = benchPos.z - 0.8 + rng() * 1.6;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.02, transparent: true, opacity: 0.5, depthWrite: false }));
  group.add(dust);

  return { group, bench: benchPos, teaTable, lampSpot, dust, cabinetStones, marsStone, ironStones, safe };
}

/* ================================================================== */
/* WORKSHOP — night, empty, a CNC machine under cold light.            */
/* ================================================================== */

export interface WorkshopSet { group: THREE.Group; machine: THREE.Group; spindle: THREE.Mesh; cutPoint: THREE.Vector3; sparks: THREE.Points; panel: THREE.Mesh; }

export function buildWorkshop(): WorkshopSet {
  const group = new THREE.Group();
  group.name = "workshop";
  const floor = voxMesh(voxelTerrain(16, 14, () => 1, (x, y, z, top) => top ? 0x4a4e54 : 0x3a3e44, { voxel: 0.5 }), 0, -0.5, 0);
  group.add(floor);
  group.add(box(12, 3.6, 0.2, 0x3a3e46, 0, 1.8, -4));
  group.add(box(0.2, 3.6, 10, 0x363a42, -6, 1.8, 0));
  group.add(box(0.2, 3.6, 10, 0x363a42, 6, 1.8, 0));
  group.add(box(12, 0.2, 10, 0x2c3038, 0, 3.6, 0));

  // fluorescent fixtures
  for (const fx of [-3, 0, 3]) {
    group.add(box(1.8, 0.08, 0.3, 0xdfe6f0, fx, 3.5, -1, emissive(0xcfe0ff, 1.6)));
    const pl = new THREE.PointLight(0xcfe0ff, 8, 8, 2);
    pl.position.set(fx, 3.3, -1);
    group.add(pl);
  }
  group.add(new THREE.AmbientLight(0x30405a, 0.5));

  // CNC machine
  const machine = new THREE.Group();
  machine.position.set(0, 0, -1.6);
  machine.add(box(3.0, 0.9, 1.4, 0x3a4048, 0, 0.45, 0)); // base
  machine.add(box(3.2, 0.12, 1.5, 0x565c66, 0, 0.95, 0)); // bed
  machine.add(box(0.3, 1.6, 0.3, 0x4a5058, -1.4, 1.7, 0)); // column L
  machine.add(box(0.3, 1.6, 0.3, 0x4a5058, 1.4, 1.7, 0)); // column R
  machine.add(box(3.1, 0.3, 0.4, 0x565c66, 0, 2.5, 0)); // gantry
  const spindle = box(0.3, 0.7, 0.3, 0x8a9098, 0, 2.0, 0, { metalness: 0.6, roughness: 0.4 });
  machine.add(spindle);
  machine.add(box(0.08, 0.3, 0.08, 0xc0c6ce, 0, 1.55, 0, { metalness: 0.8, roughness: 0.3 })); // tool
  // the meteorite block on the bed
  machine.add(voxMesh(voxelSphere(2.6, 0x33363b, { voxel: 0.12 }), 0, 1.12, 0));
  // control panel
  const panel = box(0.7, 0.9, 0.2, 0x2c3038, 1.9, 1.3, 0.4);
  machine.add(panel);
  machine.add(box(0.5, 0.3, 0.02, 0x1a3a2a, 1.9, 1.5, 0.51, emissive(0x3ad07a, 1.2)));
  for (let i = 0; i < 4; i++) machine.add(box(0.08, 0.08, 0.02, i === 0 ? 0xd05a4a : 0x5a626c, 1.72 + i * 0.12, 1.15, 0.51, emissive(i === 0 ? 0xd05a4a : 0x000000, 0.8)));
  group.add(machine);

  // sparks at the cut point
  const cutPoint = new THREE.Vector3(0, 1.4, -1.6);
  const sparkGeo = new THREE.BufferGeometry();
  const sn = 80, sp = new Float32Array(sn * 3);
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xffb060, size: 0.035, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(sparks);

  const key = new THREE.SpotLight(0xdfe8ff, 20, 10, Math.PI / 4, 0.6, 1.5);
  key.position.set(0, 3.4, 0.5);
  key.target.position.copy(cutPoint);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  group.add(key, key.target);

  return { group, machine, spindle, cutPoint, sparks, panel };
}

/* ================================================================== */
/* BASEMENT — a bare bulb, concrete, the test that seals the plan.     */
/* ================================================================== */

export interface BasementSet {
  group: THREE.Group; bulb: THREE.PointLight; bulbMesh: THREE.Mesh;
  table: THREE.Vector3; bundle: THREE.Group; muzzle: THREE.PointLight; muzzleFlash: THREE.Mesh;
  rounds: THREE.Group; gunAnchor: THREE.Vector3;
}

export function buildBasement(): BasementSet {
  const group = new THREE.Group();
  group.name = "basement";
  const S = 4, H = 2.6;
  const floor = voxMesh(voxelTerrain(8, 8, () => 1, (x, y, z, top) => top ? 0x4a4a4e : 0x3a3a3e, { voxel: 0.5 }), 0, -0.5, 0);
  group.add(floor);
  const concrete = 0x55555a;
  group.add(box(S, H, 0.2, concrete, 0, H / 2, -S / 2));
  group.add(box(S, H, 0.2, concrete, 0, H / 2, S / 2));
  group.add(box(0.2, H, S, concrete, -S / 2, H / 2, 0));
  group.add(box(0.2, H, S, concrete, S / 2, H / 2, 0));
  group.add(box(S, 0.2, S, 0x48484c, 0, H, 0));
  // stains
  group.add(box(1.2, 1.4, 0.02, 0x3f3f44, -0.8, 1.3, -S / 2 + 0.11));

  // hanging bare bulb
  group.add(box(0.03, 0.5, 0.03, 0x1a1a1a, 0, H - 0.25, 0));
  const bulbMesh = voxMesh(voxelSphere(1.4, 0xfff0d0, { voxel: 0.07 }), 0, H - 0.55, 0, emissive(0xffe6b0, 2.6));
  group.add(bulbMesh);
  const bulb = new THREE.PointLight(0xffe0a8, 16, 8, 2);
  bulb.position.set(0, H - 0.6, 0);
  bulb.castShadow = true;
  bulb.shadow.mapSize.set(1024, 1024);
  group.add(bulb);
  group.add(new THREE.AmbientLight(0x2a2620, 0.35));

  // work table with rounds
  const table = new THREE.Vector3(-0.7, 0, -0.6);
  group.add(box(1.4, 0.8, 0.7, 0x4a4038, table.x, 0.4, table.z));
  group.add(box(1.5, 0.05, 0.8, 0x5a5048, table.x, 0.82, table.z));
  const rounds = new THREE.Group();
  rounds.position.set(table.x, 0.86, table.z);
  for (let i = 0; i < 12; i++) {
    const r = box(0.05, 0.05, 0.16, 0x8a8f98, -0.5 + (i % 6) * 0.18, 0, -0.15 + Math.floor(i / 6) * 0.22, { metalness: 0.5, roughness: 0.5 });
    rounds.add(r);
  }
  group.add(rounds);
  // pliers + glue
  group.add(box(0.06, 0.04, 0.3, 0x6a3a2a, table.x + 0.5, 0.86, table.z + 0.1));
  group.add(box(0.08, 0.14, 0.08, 0x3a6ea8, table.x + 0.55, 0.92, table.z - 0.2));

  // cloth-wrapped beef bundle in the corner (target)
  const bundle = new THREE.Group();
  bundle.position.set(1.3, 0, -1.3);
  bundle.add(box(0.5, 0.7, 0.5, 0x6a6f78, 0, 0.35, 0)); // stand
  const cloth = box(0.6, 0.5, 0.6, 0xb9bcc4, 0, 0.95, 0); // spacesuit cloth wrap
  bundle.add(cloth);
  bundle.add(box(0.5, 0.4, 0.5, 0x8a3a3a, 0, 0.95, 0)); // beef inside (hidden by cloth)
  group.add(bundle);

  // muzzle flash light + billboard at the gun corner
  const muzzle = new THREE.PointLight(0xffd080, 0, 10, 2);
  muzzle.position.set(-0.2, 1.3, 0.8);
  group.add(muzzle);
  const muzzleFlash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  muzzleFlash.position.set(-0.2, 1.3, 0.6);
  group.add(muzzleFlash);

  return { group, bulb, bulbMesh, table, bundle, muzzle, muzzleFlash, rounds, gunAnchor: new THREE.Vector3(-0.2, 1.3, 0.8) };
}