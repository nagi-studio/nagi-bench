import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { meteoriteGeo, meteoriteSliceGeo, teacupGeo, magnifierGeo, mesh, glowSprite, solidMat } from "../props";
import { glowTexture } from "../textures";
import { Dust } from "../particles";
import { mulberry32 } from "../../util";
import type { Cast } from "../cast";

export interface CollectorSet {
  group: THREE.Group;
  dust: Dust;
  lampGlow: THREE.Sprite;
  cabinetStones: THREE.Mesh[];
  marsStone: THREE.Mesh;
  ironStones: THREE.Mesh[];
  teacup: THREE.Mesh;
  magnifier: THREE.Mesh;
  safeDoor: THREE.Mesh;
  door: THREE.Mesh;
  keyLight: THREE.PointLight;
  windowLight: THREE.DirectionalLight;
}

function woodBox(w: number, h: number, d: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), solidMat(color));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

/** Glass display cabinet with internally lit stones. */
function cabinet(stones: number, seed: number): { g: THREE.Group; stones: THREE.Mesh[] } {
  const g = new THREE.Group();
  const frame = woodBox(1.6, 2.2, 0.5, 0x3a2c20);
  frame.position.y = 1.1;
  g.add(frame);
  // glass front (thin, translucent)
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(1.44, 2.0, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x9fc4d8, transparent: true, opacity: 0.12, roughness: 0.1, metalness: 0.2 }),
  );
  glass.position.set(0, 1.15, 0.26);
  g.add(glass);
  const rng = mulberry32(seed);
  const stoneMeshes: THREE.Mesh[] = [];
  for (let s = 0; s < stones; s++) {
    const shelfY = 0.45 + s * 0.5;
    const shelf = woodBox(1.44, 0.05, 0.44, 0x2e2218);
    shelf.position.set(0, shelfY, 0);
    g.add(shelf);
    const st = mesh(meteoriteGeo(0.16 + rng() * 0.1, seed + s, 0.05), { roughness: 0.6, metalness: 0.4 });
    st.position.set((rng() - 0.5) * 0.9, shelfY + 0.16, 0);
    g.add(st);
    stoneMeshes.push(st);
    // tiny cabinet spotlight glow
    const gl = glowSprite(glowTexture("rgba(255,236,200,1)"), 0xffe6c0, 0.5);
    gl.position.set(st.position.x, shelfY + 0.42, 0.1);
    gl.material.opacity = 0.5;
    g.add(gl);
  }
  return { g, stones: stoneMeshes };
}

export function buildCollector(cast: Cast): CollectorSet {
  const group = new THREE.Group();
  group.visible = false;

  // Room shell: 8 x 3.4 x 7, dark old house.
  const floor = woodBox(8.4, 0.2, 7.4, 0x4a382a);
  floor.position.y = -0.1; floor.receiveShadow = true;
  group.add(floor);
  const ceil = woodBox(8.4, 0.2, 7.4, 0x2e2218);
  ceil.position.y = 3.4; group.add(ceil);
  const wallMat = solidMat(0x5a4636);
  const back = new THREE.Mesh(new THREE.BoxGeometry(8.4, 3.4, 0.2), wallMat);
  back.position.set(0, 1.7, -3.6); back.receiveShadow = true; group.add(back);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 7.4), wallMat);
  left.position.set(-4.2, 1.7, 0); left.receiveShadow = true; group.add(left);
  const right = left.clone(); right.position.x = 4.2; group.add(right);
  const front = new THREE.Mesh(new THREE.BoxGeometry(8.4, 3.4, 0.2), wallMat);
  front.position.set(0, 1.7, 3.6); front.receiveShadow = true; group.add(front);

  // Door on front wall (Zhang enters here).
  const door = woodBox(1.0, 2.2, 0.12, 0x6a4c33);
  door.position.set(1.6, 1.1, 3.55);
  group.add(door);
  const doorFrame = woodBox(1.2, 2.35, 0.16, 0x3a2c20);
  doorFrame.position.set(1.6, 1.17, 3.5); group.add(doorFrame);

  // Window on left wall — faint cool daylight.
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x8fa8c0, emissive: 0x3a4a5a, emissiveIntensity: 0.6, roughness: 0.4 }));
  win.position.set(-4.12, 1.9, -0.5); group.add(win);
  const winFrame = woodBox(0.1, 1.5, 1.8, 0x3a2c20);
  winFrame.position.set(-4.1, 1.9, -0.5); group.add(winFrame);

  // Cabinets along back and right walls.
  const cabinetStones: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const c = cabinet(4, 100 + i);
    c.g.position.set(-2.6 + i * 1.8, 0, -3.3);
    group.add(c.g);
    cabinetStones.push(...c.stones);
  }
  for (let i = 0; i < 2; i++) {
    const c = cabinet(4, 200 + i);
    c.g.position.set(3.9, 0, -1.6 + i * 2.0);
    c.g.rotation.y = -Math.PI / 2;
    group.add(c.g);
    cabinetStones.push(...c.stones);
  }

  // Workbench (collector's) against left-back.
  const bench = woodBox(1.8, 0.9, 0.8, 0x5a4030);
  bench.position.set(-2.6, 0.45, -1.6); group.add(bench);
  const benchTop = woodBox(1.9, 0.08, 0.9, 0x6a4c33);
  benchTop.position.set(-2.6, 0.92, -1.6); group.add(benchTop);
  const magnifier = mesh(magnifierGeo(), { roughness: 0.4, metalness: 0.3 });
  magnifier.position.set(-2.6, 1.0, -1.5);
  magnifier.rotation.x = -0.5;
  group.add(magnifier);
  const benchStone = mesh(meteoriteGeo(0.12, 55, 0.04), { roughness: 0.6, metalness: 0.4 });
  benchStone.position.set(-2.35, 1.0, -1.55); group.add(benchStone);

  // Tea table centre-right.
  const table = woodBox(1.1, 0.72, 0.7, 0x5a4030);
  table.position.set(1.4, 0.36, 0.4); group.add(table);
  const tableTop = woodBox(1.2, 0.06, 0.8, 0x6a4c33);
  tableTop.position.set(1.4, 0.74, 0.4); group.add(tableTop);
  const teacup = mesh(teacupGeo(), { roughness: 0.5 });
  teacup.position.set(1.25, 0.78, 0.4); group.add(teacup);
  const teacup2 = mesh(teacupGeo(), { roughness: 0.5 });
  teacup2.position.set(1.6, 0.78, 0.35); group.add(teacup2);
  // teapot
  const pot = mesh(buildVoxelGeometry({ size: [4, 3, 4], at: (x, y, z) => (Math.hypot(x - 1.5, z - 1.5) < 1.8 && y < 2 ? 0x7a4a30 : (y === 2 && Math.hypot(x - 1.5, z - 1.5) < 1.0 ? 0x6a4028 : null)) }, { voxel: 0.09 }), { roughness: 0.5 });
  pot.position.set(1.4, 0.82, 0.55); group.add(pot);

  // Safe (保险柜) in right-back corner, with the Mars stone.
  const safe = woodBox(0.7, 0.9, 0.6, 0x3a4048);
  safe.position.set(3.3, 0.45, -2.9); group.add(safe);
  const safeDoor = woodBox(0.62, 0.8, 0.06, 0x4a5058);
  safeDoor.position.set(3.3, 0.5, -2.58); group.add(safeDoor);
  const marsStone = mesh(meteoriteGeo(0.05, 9, 0.02), { roughness: 0.7, metalness: 0.2, color: 0x8a5a3a });
  marsStone.position.set(3.3, 0.95, -2.85); group.add(marsStone);
  // microscope
  const scope = mesh(buildVoxelGeometry({ size: [3, 6, 3], at: (x, y, z) => (x === 1 && z === 1 ? 0x2b2f36 : (y === 5 && Math.hypot(x - 1, z - 1) < 1.4 ? 0x4a5058 : null)) }, { voxel: 0.07 }), { metalness: 0.4, roughness: 0.4 });
  scope.position.set(3.0, 0.95, -2.85); group.add(scope);

  // Three iron meteorites brought out for the sale (on the tea table).
  const ironStones: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const st = mesh(meteoriteGeo(0.13, 300 + i, 0.045), { roughness: 0.5, metalness: 0.6 });
    st.position.set(1.1 + i * 0.28, 0.82, 0.25);
    st.visible = false;
    group.add(st);
    ironStones.push(st);
  }

  // Hanging tungsten lamp — the warm key.
  const cord = woodBox(0.03, 0.7, 0.03, 0x1c1812);
  cord.position.set(0.4, 3.0, 0.2); group.add(cord);
  const shade = mesh(buildVoxelGeometry({ size: [5, 2, 5], at: (x, y, z) => (Math.hypot(x - 2, z - 2) < 2.4 - y * 0.6 ? 0x2e2620 : null) }, { voxel: 0.09 }), { roughness: 0.8 });
  shade.position.set(0.4, 2.6, 0.2); group.add(shade);
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffdca0, emissiveIntensity: 2.4 }));
  bulb.position.set(0.4, 2.5, 0.2); group.add(bulb);
  const lampGlow = glowSprite(glowTexture("rgba(255,220,160,1)"), 0xffdca0, 1.6);
  lampGlow.position.set(0.4, 2.5, 0.2); group.add(lampGlow);

  const keyLight = new THREE.PointLight(0xffc98a, 22, 14, 1.8);
  keyLight.position.set(0.4, 2.45, 0.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.002;
  group.add(keyLight);

  const windowLight = new THREE.DirectionalLight(0x9ab4d0, 0.5);
  windowLight.position.set(-6, 3, -0.5);
  windowLight.target.position.set(0, 1, 0);
  group.add(windowLight, windowLight.target);

  const fill = new THREE.PointLight(0xffb070, 6, 10, 2);
  fill.position.set(-2.6, 1.6, -1.6);
  group.add(fill);

  const amb = new THREE.AmbientLight(0x3a2c22, 0.5);
  group.add(amb);

  // Dust motes drifting in the lamp beam.
  const dust = new Dust(140, new THREE.Vector3(0.4, 1.6, 0.2), new THREE.Vector3(4, 2.6, 4), 0xffdca0, 0.035, 17);
  group.add(dust.points);

  // The opening macro stone sits on the bench, etched slice facing up.
  const macro = mesh(meteoriteSliceGeo(7), { roughness: 0.45, metalness: 0.55 });
  macro.scale.setScalar(0.028);
  macro.position.set(-2.55, 0.965, -1.5);
  macro.rotation.y = 0.4;
  macro.name = "macroStone";
  group.add(macro);

  return { group, dust, lampGlow, cabinetStones, marsStone, ironStones, teacup, magnifier, safeDoor, door, keyLight, windowLight };
}
