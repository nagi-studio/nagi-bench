import * as THREE from "three";
import { buildVoxelGeometry } from "@agentbench/voxel-kit";
import { EMISSIVE_MATERIAL, GLASS_MATERIAL, VOXEL_MATERIAL, VoxelCanvas, fbm, hash, rockCanvas, vnoise, type Paint } from "./voxels";

/** Interior block size: half a metre, so a head is about one block. */
export const S = 0.5;

/** Place a block given in metres. Dimensions are snapped to the 0.5 m grid. */
function blk(vc: VoxelCanvas, x: number, y: number, z: number, w: number, h: number, d: number, paint: Paint): void {
  vc.box(Math.round(x / S), Math.round(y / S), Math.round(z / S), Math.round(w / S), Math.round(h / S), Math.round(d / S), paint);
}

/** Pick a palette colour per block so surfaces read as built material, not flat paint. */
function mottled(palette: number[], seed: number): Paint {
  return (x, y, z) => palette[Math.floor(hash(x, y, z, seed) * palette.length)];
}

const BRICK = [0x6c665e, 0x625c55, 0x77706a, 0x575149];
const PLASTER = [0x5d4b3a, 0x574535, 0x644f3d];
const PLANK_A = 0x6a4a2e, PLANK_B = 0x5f4128;
const CONCRETE = [0x3a3d42, 0x3f4247, 0x35383d];
const STEEL = [0x6c7480, 0x5f6670, 0x7a828c];
const IRON = [0x4a4d52, 0x60646b, 0x2d2f33, 0x8c9096, 0x3a3e44];
const STONE = [0x2b2623, 0x3b3530, 0x55493f, 0x6a5e52, 0x8a8175];

function rockMesh(radius: number, seed: number, palette: number[]): THREE.Mesh {
  return rockCanvas(3, palette, seed, 0.3).mesh(radius / 3, VOXEL_MATERIAL, true);
}

export interface Sets {
  root: THREE.Group;
  hutong: THREE.Group;
  door: THREE.Group;
  collector: THREE.Group;
  collectorLights: THREE.Light[];
  bench: THREE.Group;
  trayStones: THREE.Mesh[];
  lathe: THREE.Group;
  lathePellets: THREE.Mesh[];
  latheSparks: THREE.Points;
  underground: THREE.Group;
  bulbLight: THREE.PointLight;
  bundle: THREE.Group;
  bundleHoles: THREE.Mesh[];
  shards: THREE.Mesh[];
  space: THREE.Group;
  sunGroup: THREE.Group;
  sunLight: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  earth: THREE.Group;
  station: THREE.Group;
  stationDoor: THREE.Mesh;
  base: THREE.Group;
  baseSlot: THREE.Vector3;
  locator: THREE.Group;
  stars: THREE.Points;
  scope: THREE.Group;
  scopeRing: THREE.Mesh;
  scopeReticle: THREE.Group;
  muzzle: THREE.Sprite;
  hutongLights: THREE.Light[];
}

export function buildSets(scene: THREE.Scene, camera: THREE.Camera): Sets {
  const root = new THREE.Group();
  root.name = "sets";
  scene.add(root);

  const hutong = buildHutong();
  const collector = buildCollector();
  const lathe = buildLathe();
  const underground = buildUnderground();
  const space = buildSpace();
  for (const group of [hutong.group, collector.group, lathe.group, underground.group, space.group]) root.add(group);

  const scope = buildScope();
  camera.add(scope.group);
  scene.add(camera);

  return {
    root,
    hutong: hutong.group,
    door: hutong.door,
    hutongLights: hutong.lights,
    collector: collector.group,
    collectorLights: collector.lights,
    bench: collector.bench,
    trayStones: collector.trayStones,
    lathe: lathe.group,
    lathePellets: lathe.pellets,
    latheSparks: lathe.sparks,
    underground: underground.group,
    bulbLight: underground.bulbLight,
    bundle: underground.bundle,
    bundleHoles: underground.holes,
    shards: underground.shards,
    space: space.group,
    sunGroup: space.sunGroup,
    sunLight: space.sunLight,
    hemi: space.hemi,
    earth: space.earth,
    station: space.station,
    stationDoor: space.stationDoor,
    base: space.base,
    baseSlot: space.baseSlot,
    locator: space.locator,
    stars: space.stars,
    scope: scope.group,
    scopeRing: scope.ring,
    scopeReticle: scope.reticle,
    muzzle: scope.muzzle,
  };
}

/* ------------------------------------------------------------------ hutong */

function buildHutong(): { group: THREE.Group; door: THREE.Group; lights: THREE.Light[] } {
  const group = new THREE.Group();
  group.name = "hutong";
  const vc = new VoxelCanvas();

  // Lane floor, running away from the camera.
  blk(vc, -5.5, -0.5, -40, 11, 0.5, 40.5, mottled(BRICK, 4));
  // Side walls with a window course every few metres.
  for (const wallX of [-5.5, 5]) {
    blk(vc, wallX, 0, -40, 0.5, 4.5, 40.5, mottled(BRICK, 8 + wallX));
    blk(vc, wallX, 4.5, -40, 0.5, 0.5, 40.5, 0x4b4640);
    for (let z = -36; z < -2; z += 6) {
      blk(vc, wallX, 2, z, 0.5, 1, 1.5, 0x1e2630);
    }
  }
  // Gate wall across the lane, with the door opening at x in [-1, 1].
  blk(vc, -5.5, 0, 0, 4.5, 3.5, 0.5, mottled(BRICK, 21));
  blk(vc, 1, 0, 0, 4.5, 3.5, 0.5, mottled(BRICK, 22));
  blk(vc, -1, 3, 0, 2, 0.5, 0.5, 0x4b4640);
  blk(vc, -5.5, 3.5, 0, 11, 0.5, 0.5, 0x4b4640);
  // Stepped grey-tile roof over the gate.
  blk(vc, -3, 4, -1, 6, 0.5, 2.5, 0x3a3c40);
  blk(vc, -2.5, 4.5, -1, 5, 0.5, 2.5, 0x3a3c40);
  blk(vc, -2, 5, -0.5, 4, 0.5, 1.5, 0x44474c);
  // Painted lintel beam.
  blk(vc, -1, 2.6, -0.1, 2, 0.4, 0.2, 0x7a2e23);
  // Courtyard tree silhouetted above the far wall: a trunk and a voxel canopy.
  blk(vc, -0.25, 3.5, 5.75, 0.5, 3.0, 0.5, 0x3d2c1f);
  for (let x = -5; x <= 5; x++) {
    for (let y = -4; y <= 4; y++) {
      for (let z = -5; z <= 5; z++) {
        if (x * x + y * y * 1.3 + z * z > 17) continue;
        vc.set(x, 14 + y, 12 + z, [0x3f5e34, 0x4d6f3c, 0x35502c][Math.floor(hash(x, y, z, 5) * 3)]);
      }
    }
  }
  group.add(vc.mesh(S));

  // Hanging lanterns on the lane side of the gate.
  const lanterns = new VoxelCanvas();
  blk(lanterns, -4.5, 2.5, -1, 0.5, 0.5, 0.5, 0xffb55a);
  blk(lanterns, 3.5, 2.5, -1, 0.5, 0.5, 0.5, 0xffb55a);
  group.add(lanterns.mesh(S, EMISSIVE_MATERIAL));

  // Gate door: a leaf hinged at its left edge, pivoting on the group origin.
  const door = new THREE.Group();
  door.name = "gate-door";
  door.position.set(-1, 0, 0);
  const leaf = new VoxelCanvas();
  blk(leaf, 0, 0, 0, 2, 3, 0.5, (x, y) => (y % 4 === 0 ? 0x4a2f1f : 0x5e3d28) + (x % 3 === 0 ? 0x080402 : 0));
  door.add(leaf.mesh(S));
  group.add(door);

  const lights: THREE.Light[] = [];
  const hemi = new THREE.HemisphereLight(0x6d7fa8, 0x2b2218, 0.9);
  const moon = new THREE.DirectionalLight(0xa8b8e0, 0.6);
  moon.position.set(-8, 20, -12);
  group.add(hemi, moon);
  lights.push(hemi, moon);
  for (const x of [-4, 3.8]) {
    const lamp = new THREE.PointLight(0xffa550, 14, 9, 1.6);
    lamp.position.set(x, 2.8, -0.8);
    group.add(lamp);
    lights.push(lamp);
  }
  return { group, door, lights };
}

/* ---------------------------------------------------------------- collector */

function buildCollector(): { group: THREE.Group; bench: THREE.Group; trayStones: THREE.Mesh[]; lights: THREE.Light[] } {
  const group = new THREE.Group();
  group.name = "collector";
  const vc = new VoxelCanvas();
  // Floor of planks, striped along the room.
  blk(vc, -6, -0.5, -5, 12, 0.5, 10, (x, y, z) => (Math.floor(z / 2) % 2 === 0 ? PLANK_A : PLANK_B));
  // Walls with a doorway in the front wall.
  blk(vc, -6.5, 0, -5.5, 0.5, 5, 11.5, mottled(PLASTER, 31));
  blk(vc, 6, 0, -5.5, 0.5, 5, 11.5, mottled(PLASTER, 32));
  blk(vc, -6.5, 0, -6, 13, 5, 0.5, mottled(PLASTER, 33));
  blk(vc, -6, 0, 5, 4.9, 5, 0.5, mottled(PLASTER, 34));
  blk(vc, 1, 0, 5, 5, 5, 0.5, mottled(PLASTER, 35));
  blk(vc, -1, 3, 5, 2, 2, 0.5, mottled(PLASTER, 36));
  // Ceiling beams.
  blk(vc, -6.5, 5, -6, 13, 0.5, 12, 0x2a2219);
  for (let z = -5; z <= 5; z += 2.5) blk(vc, -6, 4.5, z, 12, 0.5, 0.5, 0x3d2e20);
  group.add(vc.mesh(S));

  // Glass cabinets along the left and right walls.
  const frame = new VoxelCanvas();
  const glass = new VoxelCanvas();
  const rocks = new THREE.Group();
  const cabinets: Array<{ z0: number; z1: number; facing: 1 | -1 }> = [
    { z0: -4.5, z1: -1.9, facing: 1 },
    { z0: -1.7, z1: 0.9, facing: 1 },
    { z0: 1.1, z1: 3.7, facing: 1 },
    { z0: -4.5, z1: -1.5, facing: -1 },
    { z0: 0.5, z1: 3.5, facing: -1 },
  ];
  const lights: THREE.Light[] = [];
  cabinets.forEach((cab, index) => {
    // Left cabinets stand at x in [-6, -4.5]; right cabinets at x in [4.5, 6].
    const left = cab.facing === 1;
    const frameX = left ? -6 : 4.5;
    const backX = left ? -6 : 5.5;
    const glassX = left ? -4.5 : 4.5;
    const stoneX = left ? -5.0 : 5.25;
    const dz = cab.z1 - cab.z0;
    const walnut = 0x3b2616;
    blk(frame, backX, 0, cab.z0, 0.5, 4.5, dz, walnut);
    blk(frame, frameX, 4.0, cab.z0, 1.5, 0.5, dz, walnut);
    blk(frame, frameX, 0, cab.z0, 1.5, 0.5, dz, walnut);
    blk(frame, frameX, 0, cab.z0, 1.5, 4.5, 0.5, walnut);
    blk(frame, frameX, 0, cab.z1 - 0.5, 1.5, 4.5, 0.5, walnut);
    for (const shelf of [1.0, 2.0, 3.0]) blk(frame, frameX, shelf, cab.z0, 1.5, 0.5, dz, 0x4b2f1c);
    blk(glass, glassX, 0.5, cab.z0, 0.5, 3.5, dz, 0xffffff);
    // Stones sit on each shelf; the count and the material vary by cabinet.
    [1.5, 2.5, 3.5].forEach((shelfTop, row) => {
      const count = 2 + ((index + row) % 3);
      for (let k = 0; k < count; k++) {
        const z = cab.z0 + 0.4 + (k + 0.5) * ((dz - 0.8) / count);
        const palette = (index + row + k) % 3 === 0 ? IRON : STONE;
        const rock = rockMesh(0.2 + hash(index, row, k, 9) * 0.16, index * 31 + row * 7 + k, palette);
        rock.position.set(stoneX, shelfTop + 0.25, z);
        rock.rotation.set(hash(k, row, index, 2) * 3, hash(index, k, row, 4) * 3, 0);
        rocks.add(rock);
      }
    });
    const spot = new THREE.SpotLight(0xffd9a0, 36, 14, Math.PI / 6, 0.5, 1.6);
    spot.position.set(left ? -2.2 : 2.6, 4.3, (cab.z0 + cab.z1) / 2);
    spot.target.position.set(stoneX, 2, (cab.z0 + cab.z1) / 2);
    group.add(spot, spot.target);
    lights.push(spot);
  });
  group.add(frame.mesh(S), glass.mesh(S, GLASS_MATERIAL), rocks);

  // Workbench in the middle of the room: a top with four corner legs.
  const bench = new THREE.Group();
  bench.name = "bench";
  const table = new VoxelCanvas();
  blk(table, -1.2, 0.5, -0.6, 2.4, 0.5, 1.2, 0x7b5a3a);
  for (const [lx, lz] of [[-1.2, -0.6], [1.0, -0.6], [-1.2, 0.1], [1.0, 0.1]]) blk(table, lx, 0, lz, 0.2, 0.5, 0.5, 0x4a3320);
  bench.add(table.mesh(S));
  // Green felt tray on the bench, holding the three iron meteorites.
  const tray = new VoxelCanvas();
  blk(tray, -0.6, 1.0, -0.4, 1.6, 0.06, 0.8, 0x1e4b3f);
  bench.add(tray.mesh(S));
  const trayStones: THREE.Mesh[] = [];
  [[-0.45, 0.1, 0.36], [0.15, 0.1, -0.1], [0.5, 0.1, 0.2]].forEach(([x, , z], i) => {
    const stone = rockMesh(0.26, 90 + i, IRON);
    stone.position.set(x, 1.22, z);
    stone.visible = false;
    bench.add(stone);
    trayStones.push(stone);
  });
  // A pale stone under the magnifier, which the collector is looking at.
  const inspected = rockMesh(0.16, 77, STONE);
  inspected.position.set(-0.2, 1.2, 0.5);
  bench.add(inspected);
  const lens = new VoxelCanvas();
  blk(lens, 0.5, 1.0, 0.1, 0.5, 0.06, 0.5, 0xbfe6ff);
  bench.add(lens.mesh(S, GLASS_MATERIAL));
  group.add(bench);

  // Pendant lamp over the bench.
  const lamp = new VoxelCanvas();
  blk(lamp, -0.25, 3.9, -0.25, 0.5, 0.5, 0.5, 0xfff0cc);
  group.add(lamp.mesh(S, EMISSIVE_MATERIAL));
  const pendant = new THREE.PointLight(0xffc98a, 10, 9, 1.4);
  pendant.position.set(0, 3.6, 0);
  group.add(pendant);
  lights.push(pendant);
  const ambient = new THREE.HemisphereLight(0xffe2b8, 0x20160e, 0.45);
  group.add(ambient);
  lights.push(ambient);
  return { group, bench, trayStones, lights };
}

/* -------------------------------------------------------------------- lathe */

function buildLathe(): { group: THREE.Group; pellets: THREE.Mesh[]; sparks: THREE.Points } {
  const group = new THREE.Group();
  group.name = "lathe";
  const vc = new VoxelCanvas();
  blk(vc, -6, -0.5, -6, 12, 0.5, 12, mottled(CONCRETE, 51));
  blk(vc, -6.5, 0, -6.5, 0.5, 5, 13, 0x2f3840);
  blk(vc, 6, 0, -6.5, 0.5, 5, 13, 0x2f3840);
  blk(vc, -6.5, 0, -6.5, 13, 5, 0.5, 0x2f3840);
  blk(vc, -6.5, 0, 6, 13, 5, 0.5, 0x2f3840);
  blk(vc, -6.5, 4.5, -6.5, 13, 0.5, 13, 0x1f262d);
  // The machine: a steel bed, a headstock, a chuck and a control panel.
  blk(vc, 1.2, 0, -2.6, 2.6, 1.0, 2.4, mottled(STEEL, 52));
  blk(vc, 1.2, 1.0, -2.6, 2.6, 1.6, 0.8, 0x4c5560);
  blk(vc, 1.4, 1.5, -2.6, 0.8, 0.5, 0.5, 0x2a2f36);
  blk(vc, 2.6, 2.0, -2.2, 1.6, 0.3, 0.6, 0x2a2f36);
  blk(vc, 2.4, 1.6, -2.0, 0.5, 0.5, 0.5, 0x9aa1a9);
  blk(vc, 0.8, 1.2, -2.5, 0.3, 1.2, 0.3, 0x2a2f36);
  // Workpiece bar and the cutting tool.
  blk(vc, 2.9, 1.9, -1.9, 1.4, 0.4, 0.4, IRON[3]);
  blk(vc, 2.9, 1.8, -1.6, 0.4, 0.2, 0.4, 0x5a3010);
  // Output table for the pellets.
  blk(vc, 1.2, 0, 0.8, 2.8, 0.5, 1.6, 0x6a4a2e);
  group.add(vc.mesh(S));

  // Screen on the panel: a warm readout that stays lit.
  const screen = new VoxelCanvas();
  blk(screen, 1.3, 1.1, -1.85, 0.6, 0.4, 0.05, 0x4fd3ff);
  group.add(screen.mesh(S, EMISSIVE_MATERIAL));

  const lights: THREE.Light[] = [];
  const hemi = new THREE.HemisphereLight(0xdff0ff, 0x1a2028, 0.5);
  group.add(hemi);
  const panel = new THREE.SpotLight(0xeaf6ff, 40, 16, Math.PI / 4, 0.6, 1.4);
  panel.position.set(0, 4.3, -1);
  panel.target.position.set(2.5, 1.2, -1);
  group.add(panel, panel.target);
  lights.push(panel);

  // 36 pellets on a 6 by 6 grid, revealed one at a time.
  const pelletGeometry = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const pelletMaterial = new THREE.MeshStandardMaterial({ color: 0x77808a, roughness: 0.5, metalness: 0.7 });
  const pellets: THREE.Mesh[] = [];
  for (let i = 0; i < 36; i++) {
    const pellet = new THREE.Mesh(pelletGeometry, pelletMaterial);
    pellet.position.set(1.7 + (i % 6) * 0.3, 1.07, 0.7 + Math.floor(i / 6) * 0.3);
    pellet.visible = false;
    group.add(pellet);
    pellets.push(pellet);
  }

  // Sparks from the cutting point, animated from absolute time in the shot.
  const count = 180;
  const positions = new Float32Array(count * 3);
  const sparks = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(positions, 3)),
    new THREE.PointsMaterial({ color: 0xffb35a, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false }),
  );
  sparks.name = "lathe-sparks";
  group.add(sparks);
  return { group, pellets, sparks };
}

/* -------------------------------------------------------------- underground */

function buildUnderground(): { group: THREE.Group; bulbLight: THREE.PointLight; bundle: THREE.Group; holes: THREE.Mesh[]; shards: THREE.Mesh[] } {
  const group = new THREE.Group();
  group.name = "underground";
  const vc = new VoxelCanvas();
  blk(vc, -3.5, -0.5, -4.5, 7, 0.5, 9, mottled(CONCRETE, 61));
  blk(vc, -4, 0, -5, 0.5, 3, 10, mottled(CONCRETE, 62));
  blk(vc, 3.5, 0, -5, 0.5, 3, 10, mottled(CONCRETE, 63));
  blk(vc, -4, 0, -5, 8, 3, 0.5, mottled(CONCRETE, 64));
  blk(vc, -4, 0, 4.5, 8, 3, 0.5, mottled(CONCRETE, 65));
  blk(vc, -4, 3, -5, 8, 0.5, 10, 0x2b2e33);
  // A wooden table, then a crate in the corner holding the beef bundle.
  blk(vc, -1, 0.5, -2.2, 2, 0.5, 1.4, 0x6b4b30);
  for (const [lx, lz] of [[-1, -2.2], [0.5, -2.2], [-1, -0.8], [0.5, -0.8]]) blk(vc, lx, 0, lz, 0.5, 0.5, 0.5, 0x4a3320);
  blk(vc, 1.2, 0, -3.6, 1.8, 1, 1.4, 0x5d4026);
  group.add(vc.mesh(S));

  // Bare bulb hanging from the ceiling.
  const bulb = new VoxelCanvas();
  blk(bulb, -0.25, 2.5, -0.5, 0.5, 0.5, 0.5, 0xffe2a8);
  group.add(bulb.mesh(S, EMISSIVE_MATERIAL));
  const bulbLight = new THREE.PointLight(0xffc57a, 9, 9, 1.5);
  bulbLight.position.set(0, 2.2, -0.5);
  group.add(bulbLight);
  const ambient = new THREE.HemisphereLight(0x8b9099, 0x18191c, 0.25);
  group.add(ambient);

  // Beef wrapped in suit fabric: a red core, a padded fabric shell, and five holes punched later.
  const bundle = new THREE.Group();
  bundle.name = "bundle";
  const core = new VoxelCanvas();
  blk(core, 1.5, 1.0, -3.4, 1.2, 0.8, 0.8, 0x8c2a24);
  blk(core, 1.6, 1.1, -3.3, 1.0, 0.6, 0.6, 0x6f1f1b);
  const wrap = new VoxelCanvas();
  blk(wrap, 1.2, 0.9, -3.6, 1.8, 1.2, 1.2, (x, y, z) => ((x + y + z) % 3 === 0 ? 0xc2c8ce : 0xa3aab2));
  bundle.add(core.mesh(S), wrap.mesh(S));
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const holes: THREE.Mesh[] = [];
  const holeGeometry = new THREE.BoxGeometry(0.22, 0.22, 0.05);
  for (let i = 0; i < 5; i++) {
    const hole = new THREE.Mesh(holeGeometry, holeMat);
    hole.position.set(1.7 + (i % 3) * 0.45, 1.25 + Math.floor(i / 3) * 0.4, -2.36);
    hole.visible = false;
    bundle.add(hole);
    holes.push(hole);
  }
  group.add(bundle);

  // Rock shards left on the table after the shots.
  const shards: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const shard = rockMesh(0.09, 120 + i, IRON);
    shard.position.set(-0.6 + i * 0.22, 1.12, -1.2 + (i % 2) * 0.2);
    shard.visible = false;
    group.add(shard);
    shards.push(shard);
  }
  return { group, bulbLight, bundle, holes, shards };
}

/* -------------------------------------------------------------------- space */

function earthGeometries(): { land: THREE.BufferGeometry; clouds: THREE.BufferGeometry } {
  const N = 82;
  const C = N / 2;
  const R = 40;
  const at = (x: number, y: number, z: number) => {
    const dx = x + 0.5 - C, dy = y + 0.5 - C, dz = z + 0.5 - C;
    return { dx, dy, dz, d: Math.hypot(dx, dy, dz) };
  };
  const land = buildVoxelGeometry({
    size: [N, N, N],
    at(x, y, z) {
      const { dx, dy, dz, d } = at(x, y, z);
      if (d > R) return null;
      const nx = dx / d, ny = dy / d, nz = dz / d;
      const continent = fbm(nx * 2.2 + 3, ny * 2.2, nz * 2.2, 5, 4);
      if (Math.abs(ny) > 0.86 + (vnoise(nx * 6, ny * 6, nz * 6, 3) - 0.5) * 0.08) return 0xf1f6fa;
      if (continent > 0.53) {
        const detail = fbm(nx * 5, ny * 5, nz * 5, 9, 2);
        return detail > 0.6 ? 0x8a7a4c : detail > 0.5 ? 0x4f8a45 : 0x3d6e3a;
      }
      return continent > 0.48 ? 0x2a6a8e : fbm(nx * 4, ny * 4, nz * 4, 13, 2) > 0.5 ? 0x235f92 : 0x1b4b7a;
    },
  }, { voxel: 20 });
  const clouds = buildVoxelGeometry({
    size: [N, N, N],
    at(x, y, z) {
      const { dx, dy, dz, d } = at(x, y, z);
      if (d > R + 1 || d < R) return null;
      const nx = dx / d, ny = dy / d, nz = dz / d;
      return fbm(nx * 3 + 11, ny * 3, nz * 3, 21, 3) > 0.57 ? 0xf4f7fa : null;
    },
  }, { voxel: 20 });
  return { land, clouds };
}

function buildSpace(): {
  group: THREE.Group;
  sunGroup: THREE.Group;
  sunLight: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  earth: THREE.Group;
  station: THREE.Group;
  stationDoor: THREE.Mesh;
  base: THREE.Group;
  baseSlot: THREE.Vector3;
  locator: THREE.Group;
  stars: THREE.Points;
} {
  const group = new THREE.Group();
  group.name = "space";

  // Stars: single-pixel points, the only non-block primitive in the film.
  const random = (seed: number) => (n: number) => hash(n, seed, 0, 77);
  const starCount = 2400;
  const starPositions = new Float32Array(starCount * 3);
  const starColours = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = random(1)(i) * 2 - 1, v = random(2)(i) * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    starPositions.set([r * Math.cos(v) * 9000, u * 9000, r * Math.sin(v) * 9000], i * 3);
    const tint = random(3)(i);
    starColours.set([0.8 + tint * 0.2, 0.85 + tint * 0.15, 1], i * 3);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColours, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true }));
  stars.name = "stars";
  group.add(stars);

  // Earth: block continents and oceans, a separate cloud shell.
  const earth = new THREE.Group();
  earth.name = "earth";
  const { land, clouds } = earthGeometries();
  earth.add(new THREE.Mesh(land, VOXEL_MATERIAL));
  earth.add(new THREE.Mesh(clouds, VOXEL_MATERIAL));
  group.add(earth);

  // Sun: a voxel disc far away, lit only by its own material.
  const sunGroup = new THREE.Group();
  sunGroup.name = "sun";
  const sunVoxels = new VoxelCanvas();
  for (let x = -13; x <= 13; x++) for (let y = -13; y <= 13; y++) for (let z = -13; z <= 13; z++) {
    const d = Math.hypot(x, y, z);
    if (d > 13) continue;
    sunVoxels.set(x, y, z, d > 11 ? 0xffd58a : d > 6 ? 0xfff0c8 : 0xffffff);
  }
  sunGroup.add(sunVoxels.mesh(40, EMISSIVE_MATERIAL, true));
  group.add(sunGroup);

  const sunLight = new THREE.DirectionalLight(0xfff0d8, 3.0);
  const hemi = new THREE.HemisphereLight(0x3a4f7a, 0x0c0c14, 0.35);
  group.add(sunLight, sunLight.target, hemi);

  // Elevator cable from the surface to the station hub.
  const cable = new THREE.Mesh(
    new THREE.BoxGeometry(3, 260, 3),
    new THREE.MeshStandardMaterial({ color: 0x9aa5b0, roughness: 0.5, metalness: 0.4 }),
  );
  cable.position.set(0, 930, 0);
  group.add(cable);

  // Wheel station: a ring, four spokes and a hub, built on a 4 m grid.
  const station = new THREE.Group();
  station.name = "station";
  const ring = new VoxelCanvas();
  for (let x = -44; x <= 44; x++) {
    for (let z = -44; z <= 44; z++) {
      const r = Math.hypot(x, z);
      if (r < 37 || r > 41) continue;
      for (let y = -1; y <= 1; y++) {
        const angle = Math.atan2(z, x);
        const sector = Math.round(((angle + Math.PI) / (Math.PI / 12)) + 0.5) % 2;
        ring.set(x, y, z, sector === 0 ? 0xc7ccd2 : 0x3b6fa0);
      }
    }
  }
  for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    for (let t = 0; t <= 38; t++) {
      const x = Math.round(Math.cos(angle) * t), z = Math.round(Math.sin(angle) * t);
      ring.set(x, 0, z, 0x8b949e).set(x, 1, z, 0x8b949e);
    }
  }
  for (let x = -4; x <= 4; x++) for (let y = -3; y <= 3; y++) for (let z = -4; z <= 4; z++) {
    if (x * x + z * z <= 16) ring.set(x, y, z, 0x9aa3ad);
  }
  // Rim door facing the photographers' side of the station.
  for (let y = -1; y <= 1; y++) ring.set(0, y, 41, 0xffd27a).set(1, y, 41, 0xffd27a);
  const stationBlock = ring.mesh(4, VOXEL_MATERIAL, true);
  station.add(stationBlock);
  station.position.set(0, 1060, 0);
  group.add(station);
  // Door panel rendered as an emissive block so it reads at distance.
  const doorVoxels = new VoxelCanvas();
  for (let y = -1; y <= 1; y++) doorVoxels.set(0, y, 41, 0xffd27a).set(1, y, 41, 0xffd27a);
  const stationDoor = doorVoxels.mesh(4, EMISSIVE_MATERIAL, true);
  stationDoor.position.copy(station.position);
  group.add(stationDoor);

  // Shipyard frame, far off to the side, like a skeleton.
  const yard = new THREE.Group();
  yard.name = "shipyard";
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x5a626c, roughness: 0.7, metalness: 0.5 });
  for (let i = 0; i < 4; i++) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 520), beamMat);
    beam.position.set(380 + i * 40, 1040, -120);
    yard.add(beam);
  }
  for (let i = 0; i < 8; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(6, 360, 6), beamMat);
    rib.position.set(340 + (i % 4) * 40, 1040 + (i < 4 ? -40 : 60), -120 + (i < 4 ? -120 : 120));
    yard.add(rib);
  }
  group.add(yard);

  // Base No. 1: a small cluster of modules with a solar wing.
  const base = new THREE.Group();
  base.name = "base-1";
  const baseVoxels = new VoxelCanvas();
  for (let x = -2; x <= 2; x++) for (let y = -1; y <= 1; y++) for (let z = -2; z <= 2; z++) baseVoxels.set(x, y, z, 0xb9bfc7);
  baseVoxels.box(-2, 0, -3, 5, 1, 1, 0x3b6fa0);
  for (let x = -1; x <= 1; x++) baseVoxels.set(x, 1, 1, 0xffe6a0);
  base.add(baseVoxels.mesh(2.2, VOXEL_MATERIAL, true));
  const wing = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 4), new THREE.MeshStandardMaterial({ color: 0x2a4f7a, roughness: 0.3, metalness: 0.6 }));
  wing.position.set(0, 0, 9);
  base.add(wing);
  base.position.set(-255, 1100, 40);
  group.add(base);
  const baseSlot = new THREE.Vector3(-255 + 1.2, 1100 + 0.5, 40 - 1.5);
  const locator = new THREE.Group();
  locator.name = "locator";
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0x20262e, roughness: 0.6 }));
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), new THREE.MeshBasicMaterial({ color: 0x66ff88 }));
  led.position.set(0, 0.1, 0.27);
  locator.add(body, led);
  locator.visible = false;
  group.add(locator);

  return { group, sunGroup, sunLight, hemi, earth, station, stationDoor, base, baseSlot, locator, stars };
}

/* -------------------------------------------------------------------- scope */

function buildScope(): { group: THREE.Group; ring: THREE.Mesh; reticle: THREE.Group; muzzle: THREE.Sprite } {
  // Everything lives in camera space, so the scope mask follows the lens.
  const group = new THREE.Group();
  group.name = "scope";
  group.position.set(0, 0, -0.3);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.92, 4, 128),
    new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false }),
  );
  ring.renderOrder = 999;
  group.add(ring);
  const reticle = new THREE.Group();
  const line = new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false });
  const horizontal = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.012, 0.001), line);
  const vertical = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.7, 0.001), line);
  const dot = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.001), line);
  horizontal.renderOrder = vertical.renderOrder = dot.renderOrder = 1000;
  reticle.add(horizontal, vertical, dot);
  group.add(reticle);
  const flashCanvas = document.createElement("canvas");
  flashCanvas.width = flashCanvas.height = 64;
  const ctx = flashCanvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,240,200,0.8)");
  gradient.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const muzzle = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(flashCanvas),
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
  }));
  muzzle.renderOrder = 1001;
  muzzle.visible = false;
  group.add(muzzle);
  group.visible = false;
  return { group, ring, reticle, muzzle };
}

