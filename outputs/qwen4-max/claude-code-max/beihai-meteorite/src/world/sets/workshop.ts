import * as THREE from "three";
import { buildVoxelGeometry, voxelMaterial } from "@agentbench/voxel-kit";
import { meteoriteGeo, slugGeo, mesh, glowSprite, solidMat } from "../props";
import { glowTexture } from "../textures";
import { Sparks } from "../particles";
import { mulberry32 } from "../../util";
import type { Cast } from "../cast";

export interface WorkshopSet {
  group: THREE.Group;
  spindle: THREE.Mesh;
  chuck: THREE.Mesh;
  rawStone: THREE.Mesh;
  slugTray: THREE.Group;
  slugs: THREE.Mesh[];
  sparks: Sparks;
  toolBit: THREE.Mesh;
  shavings: THREE.Mesh;
  screen: THREE.Mesh;
  keyLight: THREE.SpotLight;
  panelGlow: THREE.Sprite;
}

function box(w: number, h: number, d: number, color: number, metal = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), solidMat(color, { metalness: metal, roughness: metal ? 0.5 : 0.9 }));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function buildWorkshop(cast: Cast): WorkshopSet {
  const group = new THREE.Group();
  group.visible = false;

  // Industrial shell.
  const floor = box(12, 0.2, 10, 0x4a4e52);
  floor.position.y = -0.1; group.add(floor);
  const ceil = box(12, 0.2, 10, 0x2e3236);
  ceil.position.y = 4.2; group.add(ceil);
  const wallMat = solidMat(0x565c62);
  const back = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallMat);
  back.position.set(0, 2.1, -5); back.receiveShadow = true; group.add(back);
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 10), wallMat);
  left.position.set(-6, 2.1, 0); group.add(left);
  const right = left.clone(); right.position.x = 6; group.add(right);

  // Fluorescent strips (cool).
  for (let i = -1; i <= 1; i++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.24),
      new THREE.MeshStandardMaterial({ color: 0xeaf2f6, emissive: 0xcfe0e8, emissiveIntensity: 1.6 }));
    strip.position.set(i * 3.4, 4.05, -0.5); group.add(strip);
    const gl = glowSprite(glowTexture("rgba(210,232,240,1)"), 0xcfe0e8, 2.2);
    gl.position.set(i * 3.4, 3.95, -0.5); gl.material.opacity = 0.35; group.add(gl);
  }

  // CNC machine: bed + column + spindle head + enclosure.
  const bed = box(3.2, 0.7, 1.6, 0x3a4048, 0.3);
  bed.position.set(0, 0.35, -1.6); group.add(bed);
  const column = box(0.7, 2.4, 0.9, 0x4a5058, 0.3);
  column.position.set(-1.2, 1.6, -2.1); group.add(column);
  const head = box(1.0, 0.7, 0.9, 0x565c62, 0.4);
  head.position.set(-0.2, 2.0, -1.7); group.add(head);
  const spindle = mesh(buildVoxelGeometry({ size: [3, 6, 3], at: (x, y, z) => (Math.hypot(x - 1, z - 1) < 1.3 ? 0x6e747a : null) }, { voxel: 0.09 }), { metalness: 0.6, roughness: 0.35 });
  spindle.position.set(-0.2, 1.5, -1.5);
  group.add(spindle);
  const chuck = mesh(buildVoxelGeometry({ size: [4, 2, 4], at: (x, y, z) => (Math.hypot(x - 1.5, z - 1.5) < 1.8 ? 0x3a4048 : null) }, { voxel: 0.08 }), { metalness: 0.5, roughness: 0.4 });
  chuck.position.set(-0.2, 1.15, -1.5); group.add(chuck);
  // raw meteorite clamped in the chuck
  const rawStone = mesh(meteoriteGeo(0.2, 77, 0.05), { metalness: 0.6, roughness: 0.45 });
  rawStone.position.set(-0.2, 1.0, -1.5); group.add(rawStone);
  const toolBit = box(0.06, 0.4, 0.06, 0x9aa0a6, 0.7);
  toolBit.position.set(0.15, 1.2, -1.5); group.add(toolBit);

  // Control screen with glowing panel.
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x0e1a14, emissive: 0x2a6a4a, emissiveIntensity: 1.1 }));
  screen.position.set(1.5, 1.5, -1.9); screen.rotation.y = -0.3; group.add(screen);
  const panelGlow = glowSprite(glowTexture("rgba(120,220,160,1)"), 0x7fd6a0, 1.0);
  panelGlow.position.set(1.48, 1.5, -1.85); panelGlow.material.opacity = 0.4; group.add(panelGlow);
  const console_ = box(0.9, 1.1, 0.5, 0x3a4048, 0.2);
  console_.position.set(1.5, 0.55, -2.0); group.add(console_);

  // Workbench with the tray of finished slugs.
  const bench = box(2.6, 0.85, 0.9, 0x4a4038);
  bench.position.set(2.6, 0.42, 0.6); group.add(bench);
  const benchTop = box(2.7, 0.07, 1.0, 0x5a4c3e);
  benchTop.position.set(2.6, 0.88, 0.6); group.add(benchTop);
  const slugTray = new THREE.Group();
  slugTray.position.set(2.6, 0.93, 0.6);
  group.add(slugTray);
  const trayBase = box(1.5, 0.05, 0.7, 0x2e3236, 0.2);
  slugTray.add(trayBase);
  const slugs: THREE.Mesh[] = [];
  const slugGeoShared = slugGeo();
  for (let i = 0; i < 36; i++) {
    const s = new THREE.Mesh(slugGeoShared, voxelMaterial({ metalness: 0.6, roughness: 0.4 }));
    const row = Math.floor(i / 9);
    const col = i % 9;
    s.position.set(-0.6 + col * 0.15, 0.06, -0.24 + row * 0.16);
    s.rotation.x = Math.PI / 2;
    s.visible = false;
    s.castShadow = true;
    slugTray.add(s);
    slugs.push(s);
  }
  // shavings pile (collected carefully)
  const shavings = mesh(buildVoxelGeometry({ size: [6, 2, 6], at: (x, y, z) => { const r = mulberry32(x * 11 + z * 23 + 5); return Math.hypot(x - 2.5, z - 2.5) < 2.6 - y && r() > 0.3 ? 0x6e747a : null; } }, { voxel: 0.04 }), { metalness: 0.5, roughness: 0.5 });
  shavings.position.set(2.0, 0.93, 0.9); shavings.visible = false; group.add(shavings);

  // Tool rack on back wall.
  const rack = box(2.0, 1.2, 0.12, 0x3a3228);
  rack.position.set(-3.6, 1.8, -4.9); group.add(rack);
  for (let i = 0; i < 6; i++) {
    const tool = box(0.06, 0.5, 0.06, 0x6e747a, 0.6);
    tool.position.set(-4.3 + i * 0.28, 1.8, -4.82); group.add(tool);
  }

  // Lighting: cool overhead key + machine glow.
  const keyLight = new THREE.SpotLight(0xdfeaf0, 60, 16, 0.7, 0.5, 1.6);
  keyLight.position.set(0.5, 4.0, 0.5);
  keyLight.target.position.set(0, 0.8, -1.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.002;
  group.add(keyLight, keyLight.target);
  const fill = new THREE.PointLight(0x9ab4c8, 8, 12, 2);
  fill.position.set(-3, 2.4, 2); group.add(fill);
  const amb = new THREE.AmbientLight(0x2e3a42, 0.7); group.add(amb);

  const sparks = new Sparks(new THREE.Vector3(-0.05, 1.0, -1.5), 90, 0xffb060, 0.05, 23);
  group.add(sparks.points);

  return { group, spindle, chuck, rawStone, slugTray, slugs, sparks, toolBit, shavings, screen, keyLight, panelGlow };
}
