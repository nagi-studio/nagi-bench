import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial, voxelSphere } from "@agentbench/voxel-kit";
import { roundGeo, slugGeo, mesh, glowSprite, solidMat } from "../props";
import { glowTexture } from "../textures";
import { Burst } from "../particles";
import { mulberry32 } from "../../util";
import type { Cast } from "../cast";

export interface BasementSet {
  group: THREE.Group;
  rounds: THREE.Mesh[];
  bundle: THREE.Mesh;
  beef: THREE.Mesh;
  holes: THREE.Mesh[];
  gravel: THREE.Mesh;
  bulbGlow: THREE.Sprite;
  keyLight: THREE.PointLight;
  flash: THREE.PointLight;
  smoke: Burst;
  table: THREE.Mesh;
}

function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), solidMat(color, { roughness: 0.95 }));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function buildBasement(cast: Cast): BasementSet {
  const group = new THREE.Group();
  group.visible = false;

  // Small concrete cell, 4 x 2.8 x 4.
  const floor = box(4.4, 0.2, 4.4, 0x4a4e4a);
  floor.position.y = -0.1; group.add(floor);
  const ceil = box(4.4, 0.2, 4.4, 0x3a3e3a);
  ceil.position.y = 2.8; group.add(ceil);
  const wallMat = solidMat(0x565c56, { roughness: 1 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.8, 0.2), wallMat);
  back.position.set(0, 1.4, -2.2); back.receiveShadow = true; group.add(back);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 4.4), wallMat);
  left.position.set(-2.2, 1.4, 0); left.receiveShadow = true; group.add(left);
  const right = left.clone(); right.position.x = 2.2; group.add(right);
  const front = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.8, 0.2), wallMat);
  front.position.set(0, 1.4, 2.2); group.add(front);
  // damp stains
  const stain = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.02), solidMat(0x3e443e));
  stain.position.set(-1.0, 1.0, -2.08); group.add(stain);

  // Bare hanging bulb — the single harsh source.
  const cord = box(0.025, 0.6, 0.025, 0x1c1c1c);
  cord.position.set(0, 2.5, 0); group.add(cord);
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xfff4e0, emissive: 0xffe8c0, emissiveIntensity: 3 }));
  bulb.position.set(0, 2.16, 0); group.add(bulb);
  const bulbGlow = glowSprite(glowTexture("rgba(255,236,200,1)"), 0xffe8c0, 1.1);
  bulbGlow.position.set(0, 2.16, 0); group.add(bulbGlow);
  const keyLight = new THREE.PointLight(0xffe0b0, 16, 9, 1.9);
  keyLight.position.set(0, 2.1, 0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.003;
  group.add(keyLight);
  const amb = new THREE.AmbientLight(0x2a2e2a, 0.35); group.add(amb);

  // Small work table.
  const table = box(1.5, 0.78, 0.8, 0x4a4038);
  table.position.set(0, 0.39, -0.7); group.add(table);
  const tableTop = box(1.6, 0.06, 0.9, 0x5a4c3e);
  tableTop.position.set(0, 0.8, -0.7); group.add(tableTop);

  // 36 caseless rounds laid out in rows on the table.
  const rounds: THREE.Mesh[] = [];
  const rGeo = roundGeo(true);
  for (let i = 0; i < 36; i++) {
    const r = new THREE.Mesh(rGeo, voxelMaterial({ roughness: 0.7 }));
    const row = Math.floor(i / 12);
    const col = i % 12;
    r.position.set(-0.62 + col * 0.11, 0.84, -0.92 + row * 0.2);
    r.rotation.x = -Math.PI / 2;
    r.castShadow = true;
    r.visible = false;
    group.add(r);
    rounds.push(r);
  }

  // Cloth-wrapped bundle in the corner (spacesuit material, layered).
  const bundle = mesh(voxelSphere(4, (x, y, z, d) => {
    const rng = mulberry32(x * 31 + y * 17 + z * 7);
    return d > 0.9 ? 0xb9bcc2 : (rng() > 0.7 ? 0xc9cdd3 : 0xaeb2b8);
  }, { voxel: 0.075 }), { roughness: 0.9 });
  bundle.scale.set(1, 0.85, 0.9);
  bundle.position.set(-1.5, 0.42, -1.5);
  group.add(bundle);
  // a stand under it
  const stand = box(0.5, 0.3, 0.5, 0x3a3228);
  stand.position.set(-1.5, 0.15, -1.5); group.add(stand);

  // Beef inside (revealed when the bundle is opened).
  const beef = mesh(voxelSphere(3, (x, y, z, d) => {
    const rng = mulberry32(x * 13 + y * 29 + z * 5);
    return d > 0.85 ? 0x7e2a22 : (rng() > 0.6 ? 0x9c3a2e : (rng() > 0.3 ? 0xb04a3a : 0xd8c0b0));
  }, { voxel: 0.07 }), { roughness: 0.85 });
  beef.position.set(-1.5, 0.42, -1.5);
  beef.visible = false;
  group.add(beef);

  // Bullet holes on the bundle face (toward the table / shooter).
  const holes: THREE.Mesh[] = [];
  const holeGeo = buildVoxelGeometry({ size: [2, 2, 1], at: () => 0x14161a }, { voxel: 0.02 });
  const rng = mulberry32(5);
  for (let i = 0; i < 4; i++) {
    const h = new THREE.Mesh(holeGeo, voxelMaterial({ color: 0x14161a }));
    h.position.set(-1.5 + (rng() - 0.5) * 0.22, 0.45 + (rng() - 0.5) * 0.2, -1.28);
    h.visible = false;
    group.add(h);
    holes.push(h);
  }

  // Gravel in the palm — shattered meteorite fragments.
  const gravel = mesh(buildVoxelGeometry({
    size: [7, 2, 7],
    at: (x, y, z) => {
      const r = mulberry32(x * 7 + z * 13 + 3);
      return Math.hypot(x - 3, z - 3) < 3 - y && r() > 0.35 ? (r() > 0.5 ? 0x6e747a : 0x565c62) : null;
    },
  }, { voxel: 0.022 }), { metalness: 0.5, roughness: 0.5 });
  gravel.position.set(0.3, 0.86, -0.55);
  gravel.visible = false;
  group.add(gravel);

  // Muzzle flash light (fired toward the corner bundle).
  const flash = new THREE.PointLight(0xffd090, 0, 8, 2);
  flash.position.set(-0.6, 1.1, -0.6);
  group.add(flash);

  // Gunsmoke in the confined air.
  const smoke = new Burst(120, 0x9a958c, 0.16, 31, 0.7);
  group.add(smoke.points);

  return { group, rounds, bundle, beef, holes, gravel, bulbGlow, keyLight, flash, smoke, table };
}
