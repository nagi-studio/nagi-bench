import * as THREE from "three";
import { voxelTerrain } from "@agentbench/voxel-kit";
import { mulberry32, makeCanvasTexture } from "./util";
import {
  makeEarthCap,
  makeSunDisc,
  makeYellowRiverStation,
  makeBaseOne,
  makeShipyardSkeleton,
  makeSmallStations,
  makeDebris,
  makeCable,
  makeStars,
  makeGlowSprite,
  makeMeteorRock,
  makeMarsGrain,
  makeTeapot,
  makeTeacup,
  makePistol,
  makeScope,
  makeMagazine,
  makeRound,
  makeMeteorSegment,
  makePliers,
  makeGlueTube,
  makeKnife,
  makeClothBundle,
  makeBeefChunk,
  makePositioningUnit,
  makeCamera,
} from "./props";

/* ---------------- shared materials ---------------- */

const WOOD_DARK = new THREE.MeshStandardMaterial({ color: 0x3a2c1e, roughness: 0.95 });
const WOOD_MID = new THREE.MeshStandardMaterial({ color: 0x5a4430, roughness: 0.95 });
const WOOD_LIGHT = new THREE.MeshStandardMaterial({ color: 0x7a5f42, roughness: 0.9 });
const STONE_GRAY = new THREE.MeshStandardMaterial({ color: 0x6b6152, roughness: 1 });
const CONCRETE = new THREE.MeshStandardMaterial({ color: 0x45494f, roughness: 1 });
const CONCRETE_DARK = new THREE.MeshStandardMaterial({ color: 0x34383d, roughness: 1 });
const METAL_LIGHT = new THREE.MeshStandardMaterial({ color: 0x8a8d92, roughness: 0.5, metalness: 0.4 });
const METAL_MID = new THREE.MeshStandardMaterial({ color: 0x5c6168, roughness: 0.55, metalness: 0.45 });
const METAL_DARK = new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.6, metalness: 0.5 });
const GLASS = new THREE.MeshStandardMaterial({
  color: 0xbfd4e8,
  transparent: true,
  opacity: 0.16,
  roughness: 0.1,
  metalness: 0.2,
});
const GLASS_DARK = new THREE.MeshStandardMaterial({
  color: 0x2a4a66,
  transparent: true,
  opacity: 0.4,
  roughness: 0.15,
  metalness: 0.3,
});
const EMIS_WARM = new THREE.MeshStandardMaterial({
  color: 0xffe2b0,
  emissive: 0xffd9a0,
  emissiveIntensity: 1.6,
  roughness: 1,
});
const EMIS_COOL = new THREE.MeshStandardMaterial({
  color: 0xe8f0f8,
  emissive: 0xdfe8f4,
  emissiveIntensity: 1.5,
  roughness: 1,
});
const EMIS_RED = new THREE.MeshStandardMaterial({
  color: 0xff5a48,
  emissive: 0xff3a28,
  emissiveIntensity: 2.2,
  roughness: 1,
});
const EMIS_BLUE = new THREE.MeshStandardMaterial({
  color: 0x9fd8ff,
  emissive: 0x6cc4ff,
  emissiveIntensity: 1.4,
  roughness: 1,
});

function add(parent: THREE.Object3D, mat3: THREE.Material, w: number, h: number, d: number, x: number, y: number, z: number, ry = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat3);
  m.position.set(x, y, z);
  m.rotation.y = ry;
  parent.add(m);
  return m;
}

/* ---------------- small canvas textures ---------------- */

function plankTexture(): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = "#5a4430";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 8; i++) {
      const y = i * 16 + 3;
      ctx.fillStyle = "#4a3826";
      ctx.fillRect(0, y, s, 2);
      ctx.fillStyle = "#6a5238";
      ctx.fillRect(0, y + 4, s, 1);
      const rng = mulberry32(i * 31);
      for (let k = 0; k < 3; k++) {
        ctx.fillStyle = "#3f2f20";
        ctx.fillRect(rng() * s, y + 1 + rng() * 10, 3, 2);
      }
    }
  });
}

function brickTexture(base = "#6b6152"): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    const rng = mulberry32(5);
    for (let y = 0; y < 8; y++) {
      const off = y % 2 === 0 ? 0 : 16;
      for (let x = 0; x < 4; x++) {
        ctx.fillStyle = rng() > 0.5 ? "#7a7060" : "#5f574a";
        ctx.fillRect(x * 32 + off + 2, y * 16 + 2, 28, 12);
      }
    }
  });
}

function hazardTexture(): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = "#c8a13a";
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#20242a";
    for (let x = -s; x < s * 2; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, s);
      ctx.lineTo(x + 16, s);
      ctx.lineTo(x + 16 + s, 0);
      ctx.lineTo(x + s, 0);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function screenTexture(cols: string[]): THREE.Texture {
  return makeCanvasTexture(64, (ctx, s) => {
    ctx.fillStyle = "#101820";
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < cols.length; y++) {
      ctx.fillStyle = cols[y]!;
      ctx.fillRect(6, 8 + y * 10, 52, 3);
    }
    ctx.fillStyle = "#204060";
    ctx.fillRect(6, 8, 52, 4);
  });
}

function scrollTexture(): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = "#d8cdb2";
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = "#3a3128";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(28, 96);
    ctx.quadraticCurveTo(44, 30, 100, 34);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 60);
    ctx.quadraticCurveTo(70, 44, 104, 48);
    ctx.stroke();
    ctx.fillStyle = "#8a2c20";
    ctx.fillRect(104, 104, 12, 12);
  });
}

function stainTexture(base = "#45494f"): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    const rng = mulberry32(77);
    for (let i = 0; i < 9; i++) {
      const x = rng() * s;
      const y = rng() * s;
      const r = 6 + rng() * 22;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(20,22,26,0.35)");
      g.addColorStop(1, "rgba(20,22,26,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    }
  });
}

function whitePanelTexture(): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = "#e2e7ed";
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = "#b7c0ca";
    ctx.lineWidth = 2;
    for (const x of [0, 64]) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, s);
      ctx.stroke();
    }
    ctx.fillStyle = "#8fa0b0";
    ctx.fillRect(8, 8, 8, 4);
    ctx.fillRect(112, 112, 8, 4);
  });
}

/* ================================================================== */
/* SET 1 — courtyard (hutong, dusk)                                    */
/* ================================================================== */

function duskSkyTexture(): THREE.Texture {
  return makeCanvasTexture(128, (ctx, s) => {
    const grad = ctx.createLinearGradient(0, 0, 0, s);
    grad.addColorStop(0, "#0c1522");
    grad.addColorStop(0.42, "#22344e");
    grad.addColorStop(0.68, "#4e4a58");
    grad.addColorStop(0.82, "#8a5c48");
    grad.addColorStop(1, "#c8875c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
    const rng = mulberry32(31);
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = "rgba(255,255,255," + (0.12 + rng() * 0.5) + ")";
      ctx.fillRect(rng() * s, rng() * s * 0.5, 1, 1);
    }
  });
}

export function makeCourtyard(): THREE.Group {
  const g = new THREE.Group();
  const skyMat = new THREE.MeshBasicMaterial({ map: duskSkyTexture(), fog: false });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(56, 11), skyMat);
  sky.position.set(0, 5.2, -15);
  g.add(sky);
  const skyFront = new THREE.Mesh(new THREE.PlaneGeometry(56, 11), skyMat);
  skyFront.position.set(0, 5.2, 16);
  skyFront.rotation.y = Math.PI;
  g.add(skyFront);
  const skyTop = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshBasicMaterial({ color: 0x0c1522, fog: false }),
  );
  skyTop.position.set(0, 15.5, 0);
  skyTop.rotation.x = Math.PI / 2;
  g.add(skyTop);
  const ground = new THREE.Mesh(
    voxelTerrain(
      40, 44,
      () => 1,
      (x, y, z, top) => (top ? ((x + z * 7) % 5 === 0 ? 0x57504a : 0x615952) : 0x4a443e),
      { voxel: 0.24 },
    ),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  g.add(ground);

  const brick = new THREE.MeshStandardMaterial({ map: brickTexture(), roughness: 1 });
  // back wall with gate
  add(g, brick, 10.4, 3.1, 0.4, 0, 1.55, -4.9);
  add(g, brick, 0.5, 3.1, 0.5, -3.6, 1.55, -4.9);
  add(g, brick, 0.5, 3.1, 0.5, 3.6, 1.55, -4.9);
  add(g, STONE_GRAY, 10.6, 0.24, 0.7, 0, 3.22, -4.9); // coping
  // gate (closed double doors)
  const doorTex = plankTexture();
  const gateL = add(g, new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.95 }), 1.5, 2.6, 0.14, -0.78, 1.3, -4.66);
  const gateR = add(g, new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.95 }), 1.5, 2.6, 0.14, 0.78, 1.3, -4.66);
  gateL.name = "gateL";
  gateR.name = "gateR";
  add(g, WOOD_DARK, 3.3, 0.2, 0.24, 0, 2.72, -4.66); // lintel
  // side walls
  add(g, brick, 0.4, 3.1, 9.6, -5.1, 1.55, 0.2);
  add(g, brick, 0.4, 3.1, 9.6, 5.1, 1.55, 0.2);
  // house front wall + door
  add(g, brick, 7.2, 3.4, 0.4, 0, 1.7, 4.9);
  add(g, brick, 2.0, 0.9, 0.4, -3.6, 3.85, 4.9);
  add(g, brick, 2.0, 0.9, 0.4, 3.6, 3.85, 4.9);
  add(g, WOOD_DARK, 1.9, 2.5, 0.16, 0, 1.25, 4.72); // house door (closed)
  add(g, WOOD_DARK, 2.2, 0.18, 0.3, 0, 2.6, 4.72);
  // steps
  add(g, STONE_GRAY, 2.6, 0.18, 0.8, 0, 0.09, 4.5);
  add(g, STONE_GRAY, 2.2, 0.18, 0.6, 0, 0.27, 4.3);
  // lantern
  const lantern = new THREE.Group();
  lantern.position.set(-1.8, 2.2, 4.62);
  add(lantern, WOOD_DARK, 0.1, 0.4, 0.1, 0, 0.1, 0);
  add(lantern, EMIS_WARM, 0.34, 0.4, 0.34, 0, -0.28, 0);
  g.add(lantern);
  const lanternGlow = makeGlowSprite("rgba(255,190,110,0.9)", "rgba(255,190,110,0)");
  lanternGlow.position.set(-1.8, 1.9, 4.62);
  lanternGlow.scale.setScalar(2.2);
  g.add(lanternGlow);
  // tree
  const tree = new THREE.Group();
  tree.position.set(-2.9, 0, 0.5);
  add(tree, new THREE.MeshStandardMaterial({ color: 0x3a2c1c, roughness: 1 }), 0.42, 2.4, 0.42, 0, 1.2, 0);
  const leaves = new THREE.Mesh(
    voxelTerrain(12, 12, (x, z) => {
      const d = Math.sqrt((x - 6) ** 2 + (z - 6) ** 2);
      return Math.max(0, 7 - d * 0.8);
    }, (x, y, z, top) => {
      const rng = mulberry32(x * 13 + z * 7 + y * 3);
      return rng() > 0.35 ? 0x4a5c33 : 0x394a28;
    }, { voxel: 0.17 }),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  leaves.position.set(-0.55, 2.6, -0.5);
  tree.add(leaves);
  g.add(tree);
  // bicycle silhouette
  const bike = new THREE.Group();
  bike.position.set(2.7, 0, 2.2);
  add(bike, METAL_DARK, 0.06, 0.7, 0.06, 0, 0.55, 0);
  add(bike, METAL_DARK, 0.06, 0.4, 0.9, 0, 0.6, 0.45);
  add(bike, METAL_DARK, 0.05, 0.1, 1.0, 0, 0.9, 0.2);
  g.add(bike);
  // dusk light
  g.add(new THREE.HemisphereLight(0x6a7a95, 0x463528, 2.1));
  const dusk = new THREE.DirectionalLight(0xffc890, 2.2);
  dusk.position.set(-6, 3.2, -8);
  g.add(dusk);
  g.add(new THREE.AmbientLight(0x2c3a4e, 0.8));
  g.name = "set-courtyard";
  return g;
}

/* ================================================================== */
/* SET 2 — meteorite collector's room                                  */

export interface HutongRoomSet {
  group: THREE.Group;
  cabinetLights: THREE.PointLight[];
  workbench: THREE.Object3D;
  teaTable: THREE.Object3D;
  marsGlass: THREE.Object3D;
  keyLight: THREE.PointLight;
}

export function makeHutongRoom(): HutongRoomSet {
  const g = new THREE.Group();
  // floor
  const floor = new THREE.Mesh(
    voxelTerrain(34, 46, () => 1, (x, y, z, top) => (top ? ((x % 3 === 0 ? 0x4a3a28 : 0x513f2b)) : 0x3a2c1e), { voxel: 0.25 }),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }),
  );
  g.add(floor);
  // walls
  const wallMat = new THREE.MeshStandardMaterial({ map: brickTexture("#4f463a"), roughness: 1 });
  add(g, wallMat, 8.0, 3.6, 0.26, 0, 1.8, -5.0); // back
  add(g, wallMat, 0.26, 3.6, 10.0, -3.87, 1.8, 0.8); // left
  add(g, wallMat, 0.26, 3.6, 10.0, 3.87, 1.8, 0.8); // right
  add(g, wallMat, 8.0, 3.6, 0.26, 0, 1.8, 6.6); // front (camera side)
  add(g, new THREE.MeshStandardMaterial({ color: 0x2e261d, roughness: 1 }), 8.2, 0.22, 10.6, 0, 3.72, 0.8); // ceiling
  // baseboards
  add(g, WOOD_DARK, 8.0, 0.22, 0.06, 0, 0.11, -4.86);
  add(g, WOOD_DARK, 0.06, 0.22, 10.0, -3.73, 0.11, 0.8);
  add(g, WOOD_DARK, 0.06, 0.22, 10.0, 3.73, 0.11, 0.8);
  // pillars + beam
  for (const x of [-3.1, 3.1]) add(g, WOOD_DARK, 0.34, 3.6, 0.34, x, 1.8, -1.9);
  add(g, WOOD_DARK, 6.9, 0.3, 0.34, 0, 3.42, -1.9);
  // window (left wall)
  add(g, wallMat, 0.26, 0.9, 2.6, -3.87, 3.15, 3.2);
  add(g, wallMat, 0.26, 0.9, 2.6, -3.87, 0.45, 3.2);
  const winFrame = new THREE.Group();
  winFrame.position.set(-3.85, 1.8, 3.2);
  add(winFrame, WOOD_DARK, 0.1, 1.9, 2.7, 0, 0, 0);
  add(winFrame, WOOD_DARK, 0.16, 0.08, 2.7, 0, 0.95, 0);
  add(winFrame, WOOD_DARK, 0.16, 0.08, 2.7, 0, -0.95, 0);
  add(winFrame, WOOD_DARK, 0.16, 1.9, 0.08, 0, 0, 1.35);
  add(winFrame, WOOD_DARK, 0.16, 1.9, 0.08, 0, 0, -1.35);
  add(winFrame, WOOD_DARK, 0.08, 1.8, 0.08, 0, 0, 0); // mullion
  g.add(winFrame);
  // window light: cool evening shaft
  const shaft = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 2.6),
    new THREE.MeshBasicMaterial({
      color: 0x8fb4d8,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  shaft.position.set(-3.0, 1.9, 3.2);
  shaft.rotation.y = Math.PI / 2;
  shaft.rotation.z = 0.5;
  g.add(shaft);
  // doorway (right wall, rear)
  add(g, wallMat, 0.26, 0.7, 2.1, 3.87, 3.25, -2.6);
  const doorFrame = new THREE.Group();
  doorFrame.position.set(3.85, 1.4, -2.6);
  add(doorFrame, WOOD_DARK, 0.14, 2.9, 0.16, 0, 0, 1.0);
  add(doorFrame, WOOD_DARK, 0.14, 2.9, 0.16, 0, 0, -1.0);
  add(doorFrame, WOOD_DARK, 0.14, 0.18, 2.2, 0, 1.45, 0);
  g.add(doorFrame);
  add(g, WOOD_MID, 1.2, 0.1, 2.2, 3.85, 0.05, -2.6);
  // scroll on back wall
  const scroll = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 1.9),
    new THREE.MeshStandardMaterial({ map: scrollTexture(), roughness: 1 }),
  );
  scroll.position.set(-2.7, 2.2, -4.84);
  g.add(scroll);
  // cabinets along back wall
  const cabinetLights: THREE.PointLight[] = [];
  const specimens: [number, number][] = [[1, 0.16], [2, 0.1], [3, 0.13], [4, 0.09], [5, 0.15], [6, 0.11]];
  for (const cx of [-2.3, 2.3]) {
    const cab = new THREE.Group();
    cab.position.set(cx, 0, -4.2);
    add(cab, WOOD_MID, 1.9, 0.12, 0.6, 0, 2.32, 0); // top
    add(cab, WOOD_MID, 1.9, 0.12, 0.6, 0, 0.08, 0); // base
    add(cab, WOOD_DARK, 0.1, 2.24, 0.62, -0.95, 1.2, 0);
    add(cab, WOOD_DARK, 0.1, 2.24, 0.62, 0.95, 1.2, 0);
    add(cab, WOOD_MID, 0.02, 2.24, 0.62, 0, 1.2, 0); // back panel
    const glass = add(cab, GLASS, 1.78, 2.1, 0.02, 0, 1.22, 0.3);
    glass.name = "glass";
    for (const sy of [0.62, 1.34, 2.02]) {
      add(cab, WOOD_MID, 1.8, 0.05, 0.5, 0, sy, 0.02);
    }
    let si = 0;
    for (const sy of [0.95, 1.67, 2.34]) {
      for (const sx of [-0.5, 0.5]) {
        const spec = makeMeteorRock(specimens[si]![0], specimens[si]![1]);
        spec.position.set(sx, sy + 0.1, 0.08);
        cab.add(spec);
        const card = add(cab, new THREE.MeshStandardMaterial({ color: 0xd8d2c2, roughness: 1 }), 0.09, 0.06, 0.01, sx + 0.34, sy + 0.02, 0.12);
        card.name = "label";
        si++;
      }
    }
    const light = new THREE.PointLight(0xffdfae, 10, 5, 2);
    light.position.set(0, 1.2, 0.5);
    cab.add(light);
    cabinetLights.push(light);
    g.add(cab);
  }
  // workbench (right front)
  const workbench = new THREE.Group();
  workbench.position.set(2.45, 0, 2.6);
  add(workbench, WOOD_MID, 1.7, 0.1, 0.8, 0, 0.8, 0);
  for (const lx of [-0.75, 0.75]) {
    for (const lz of [-0.32, 0.32]) add(workbench, WOOD_DARK, 0.09, 0.8, 0.09, lx, 0.4, lz);
  }
  const magnifier = new THREE.Group();
  magnifier.position.set(0.15, 0.85, 0.1);
  add(magnifier, METAL_DARK, 0.12, 0.12, 0.18, 0, 0.02, 0);
  add(magnifier, METAL_MID, 0.05, 0.55, 0.05, 0, 0.3, 0);
  magnifier.rotation.z = 0.35;
  const lensHead = add(magnifier, METAL_MID, 0.3, 0.08, 0.3, 0, 0.62, 0);
  add(magnifier, EMIS_WARM, 0.18, 0.03, 0.18, 0, 0.58, 0.02);
  lensHead.rotation.x = 0.5;
  workbench.add(magnifier);
  // mars grain in a small glass case
  const marsGlass = new THREE.Group();
  marsGlass.position.set(-0.55, 0.85, 0.05);
  add(marsGlass, GLASS_DARK, 0.22, 0.16, 0.22, 0, 0.12, 0);
  const grain = makeMarsGrain();
  grain.position.set(0, 0.08, 0);
  marsGlass.add(grain);
  add(marsGlass, WOOD_DARK, 0.26, 0.04, 0.26, 0, 0.04, 0);
  workbench.add(marsGlass);
  const benchLight = new THREE.PointLight(0xffe6bd, 7, 4, 2);
  benchLight.position.set(0.15, 1.05, 0.4);
  workbench.add(benchLight);
  g.add(workbench);
  // tea table + stools + rug
  const teaTable = new THREE.Group();
  teaTable.position.set(-1.0, 0, 1.9);
  add(teaTable, WOOD_LIGHT, 1.3, 0.07, 0.7, 0, 0.42, 0);
  for (const lx of [-0.55, 0.55]) {
    for (const lz of [-0.27, 0.27]) add(teaTable, WOOD_DARK, 0.08, 0.42, 0.08, lx, 0.21, lz);
  }
  const pot = makeTeapot();
  pot.position.set(-0.2, 0.46, 0.05);
  teaTable.add(pot);
  const cupA = makeTeacup();
  cupA.position.set(0.25, 0.46, 0.05);
  teaTable.add(cupA);
  const cupB = makeTeacup();
  cupB.position.set(0.25, 0.46, -0.22);
  teaTable.add(cupB);
  g.add(teaTable);
  const rug = add(g, new THREE.MeshStandardMaterial({ color: 0x5a3a2a, roughness: 1 }), 2.4, 0.03, 1.9, -1.0, 0.015, 1.9);
  rug.name = "rug";
  for (const sx of [-0.5, 0.5]) {
    const stool = new THREE.Group();
    stool.position.set(-1.0 + sx, 0, 2.7);
    add(stool, WOOD_DARK, 0.5, 0.45, 0.5, 0, 0.23, 0);
    add(stool, new THREE.MeshStandardMaterial({ color: 0x8a6a48, roughness: 1 }), 0.52, 0.06, 0.52, 0, 0.48, 0);
    g.add(stool);
  }
  // hanging lamp
  const lamp = new THREE.Group();
  lamp.position.set(0.3, 3.45, 1.9);
  add(lamp, METAL_DARK, 0.03, 0.6, 0.03, 0, -0.3, 0);
  add(lamp, new THREE.MeshStandardMaterial({ color: 0x8a4a2c, roughness: 1 }), 0.46, 0.22, 0.46, 0, -0.68, 0);
  g.add(lamp);
  const keyLight = new THREE.PointLight(0xffc98f, 46, 15, 2);
  keyLight.position.set(0.3, 2.75, 1.9);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.004;
  g.add(keyLight);
  const windowLight = new THREE.DirectionalLight(0x7fa8cc, 2.4);
  windowLight.position.set(-4.8, 2.2, 3.2);
  windowLight.target.position.set(0, 0, 0);
  g.add(windowLight, windowLight.target);
  g.add(new THREE.AmbientLight(0xffe8c8, 0.8));
  g.name = "set-hutong-room";
  return { group: g, cabinetLights, workbench, teaTable, marsGlass, keyLight };
}

/* SET 3 — night office                                                */
/* ================================================================== */

export function makeOffice(): THREE.Group {
  const g = new THREE.Group();
  add(g, new THREE.MeshStandardMaterial({ map: plankTexture(), roughness: 0.9 }), 5.2, 0.1, 5.2, 0, 0.05, 0);
  const wall = new THREE.MeshStandardMaterial({ color: 0x2c333d, roughness: 1 });
  add(g, wall, 5.2, 3.0, 0.24, 0, 1.5, -2.5);
  add(g, wall, 0.24, 3.0, 5.2, -2.5, 1.5, 0);
  add(g, wall, 0.24, 3.0, 5.2, 2.5, 1.5, 0);
  add(g, new THREE.MeshStandardMaterial({ color: 0x222830, roughness: 1 }), 5.2, 0.2, 5.2, 0, 3.1, 0);
  // window
  const win = new THREE.Group();
  win.position.set(0, 1.7, -2.48);
  add(win, new THREE.MeshStandardMaterial({ color: 0x10141a, roughness: 1, emissive: 0x0a0e14, emissiveIntensity: 0.4 }), 2.4, 1.7, 0.02, 0, 0, 0.02);
  add(win, METAL_MID, 0.1, 1.8, 0.1, -1.2, 0, 0);
  add(win, METAL_MID, 0.1, 1.8, 0.1, 1.2, 0, 0);
  add(win, METAL_MID, 2.5, 0.1, 0.1, 0, 0.88, 0);
  add(win, METAL_MID, 2.5, 0.1, 0.1, 0, -0.88, 0);
  add(win, METAL_MID, 0.08, 1.7, 0.08, 0, 0, 0);
  g.add(win);
  // city lights beyond the window
  const rng = mulberry32(202);
  const city = new THREE.Group();
  for (let i = 0; i < 46; i++) {
    const b = add(
      city,
      rng() > 0.5 ? EMIS_WARM : EMIS_COOL,
      0.1 + rng() * 0.5,
      0.1 + rng() * 0.5,
      0.08,
      (rng() - 0.5) * 14,
      (rng() - 0.5) * 7,
      -2.5 - rng() * 16,
    );
    b.material = new THREE.MeshBasicMaterial({
      color: rng() > 0.5 ? 0xffcf8a : 0xa8c8e8,
      toneMapped: false,
    });
  }
  g.add(city);
  // desk + lamp + chair
  add(g, WOOD_MID, 1.9, 0.08, 0.85, 0.3, 0.78, 0.6);
  for (const lx of [-0.55, 1.15]) {
    for (const lz of [-0.32, 0.32]) add(g, WOOD_DARK, 0.09, 0.78, 0.09, lx, 0.39, 0.6 + lz);
  }
  const lamp = new THREE.Group();
  lamp.position.set(0.95, 0.82, 0.45);
  add(lamp, METAL_DARK, 0.06, 0.42, 0.06, 0, 0.21, 0);
  const shade = add(lamp, new THREE.MeshStandardMaterial({ color: 0x8a4a2c, roughness: 1 }), 0.3, 0.24, 0.3, 0, 0.5, 0);
  shade.rotation.x = 0.25;
  g.add(lamp);
  const lampLight = new THREE.PointLight(0xffc98f, 12, 6, 2);
  lampLight.position.set(0.95, 1.15, 0.45);
  g.add(lampLight);
  const screen1 = add(g, new THREE.MeshStandardMaterial({ map: screenTexture(["#2a4a6a", "#3a5a7a", "#16283a"]), roughness: 0.4, emissive: 0x8899aa, emissiveIntensity: 0.35 }), 0.5, 0.32, 0.03, -0.15, 1.0, 0.6);
  screen1.rotation.y = 0.15;
  const screen2 = add(g, new THREE.MeshStandardMaterial({ map: screenTexture(["#1a3a2a", "#224432", "#122420"]), roughness: 0.4, emissive: 0x88aa99, emissiveIntensity: 0.35 }), 0.5, 0.32, 0.03, 0.62, 1.0, 0.6);
  screen2.rotation.y = -0.12;
  // moonlight
  const moon = new THREE.DirectionalLight(0x6f8fb0, 1.9);
  moon.position.set(-1.8, 2.6, -2.0);
  g.add(moon);
  g.add(new THREE.AmbientLight(0x39445a, 0.85));
  g.name = "set-office";
  return g;
}

/* ================================================================== */
/* SET 4 — machine workshop                                            */
/* ================================================================== */

export interface WorkshopSet {
  group: THREE.Group;
  chuck: THREE.Group;
  rod: THREE.Mesh;
  carriage: THREE.Group;
  toolBit: THREE.Mesh;
  trayCylinders: THREE.Mesh[];
  toolContact: THREE.Object3D;
}

export function makeWorkshop(): WorkshopSet {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(
    voxelTerrain(36, 44, () => 1, (x, y, z, top) => (top ? (x % 6 === 0 || z % 6 === 0 ? 0x7d8188 : 0x8a8d92) : 0x5c6168), { voxel: 0.3 }),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.2 }),
  );
  g.add(floor);
  const wall = new THREE.MeshStandardMaterial({ color: 0x6e7278, roughness: 0.9, metalness: 0.1 });
  add(g, wall, 10.8, 5.0, 0.24, 0, 2.5, -6.4);
  add(g, wall, 0.24, 5.0, 13.0, -5.3, 2.5, 0);
  add(g, wall, 0.24, 5.0, 13.0, 5.3, 2.5, 0);
  add(g, new THREE.MeshStandardMaterial({ color: 0x34383d, roughness: 1 }), 10.8, 0.2, 13.0, 0, 5.1, 0);
  // hazard band
  const haz = new THREE.MeshStandardMaterial({ map: hazardTexture(), roughness: 1 });
  for (const wx of [-5.3, 5.3]) {
    const band = add(g, haz, 0.05, 0.5, 13.0, wx, 0.55, 0);
    band.rotation.y = Math.PI / 2;
  }
  add(g, haz, 10.8, 0.5, 0.05, 0, 0.55, -6.4);
  // roll door (back)
  const doorTex = makeCanvasTexture(128, (ctx, s) => {
    ctx.fillStyle = "#5c6168";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = i % 2 ? "#4a4e54" : "#676c73";
      ctx.fillRect(0, i * 8, s, 7);
    }
  });
  add(g, new THREE.MeshStandardMaterial({ map: doorTex, roughness: 0.8, metalness: 0.3 }), 3.4, 3.4, 0.1, 0, 1.7, -6.25);
  // ceiling fluorescents
  for (const z of [-4, -1, 2]) {
    const bar = add(g, EMIS_COOL, 7.5, 0.14, 0.4, 0, 4.9, z);
    bar.name = "fluo";
    const pl = new THREE.PointLight(0xd8e8f8, 38, 18, 2);
    pl.position.set(0, 4.6, z);
    g.add(pl);
  }
  // side door (right wall)
  const doorFrame = new THREE.Group();
  doorFrame.position.set(5.28, 1.5, 4.4);
  add(doorFrame, METAL_MID, 0.14, 2.9, 0.14, 0, 0, 0.9);
  add(doorFrame, METAL_MID, 0.14, 2.9, 0.14, 0, 0, -0.9);
  add(doorFrame, METAL_MID, 0.14, 0.16, 1.95, 0, 1.45, 0);
  add(doorFrame, new THREE.MeshStandardMaterial({ color: 0x4a5058, roughness: 0.7, metalness: 0.4 }), 0.1, 2.8, 1.7, 0, 0, 0);
  g.add(doorFrame);
  // shelves + stock
  for (const z of [3.6, 4.6, 5.6]) add(g, WOOD_MID, 3.4, 0.08, 0.7, -4.2, z === 3.6 ? 0.9 : 1.9, -4.2);
  add(g, METAL_MID, 0.09, 0.09, 1.2, -3.2, 1.0, -4.2);
  add(g, METAL_MID, 0.09, 0.09, 1.0, -3.5, 1.0, -4.2);
  // ---- lathe (hero) ----
  const lathe = new THREE.Group();
  lathe.position.set(0.4, 0, 0.6);
  add(lathe, new THREE.MeshStandardMaterial({ color: 0x3f444c, roughness: 0.7, metalness: 0.3 }), 2.6, 0.95, 0.75, 0, 0.47, 0);
  add(lathe, METAL_MID, 2.7, 0.22, 0.4, 0, 1.06, 0); // bed
  // headstock + chuck
  const headstock = add(lathe, METAL_MID, 0.5, 0.5, 0.55, -1.25, 1.18, 0);
  const chuck = new THREE.Group();
  chuck.position.set(-0.98, 1.18, 0);
  add(chuck, METAL_DARK, 0.3, 0.28, 0.28, 0, 0, 0);
  lathe.add(chuck);
  // meteorite rod stock
  const rod = add(lathe, new THREE.MeshStandardMaterial({ color: 0x4a443c, roughness: 0.6, metalness: 0.6 }), 1.35, 0.1, 0.1, -0.15, 1.18, 0);
  rod.name = "rod";
  // tailstock
  add(lathe, METAL_MID, 0.24, 0.36, 0.36, 1.3, 1.18, 0);
  add(lathe, METAL_DARK, 0.12, 0.16, 0.16, 1.44, 1.18, 0);
  // carriage + tool bit
  const carriage = new THREE.Group();
  carriage.position.set(0.35, 0, 0);
  add(carriage, METAL_MID, 0.55, 0.22, 0.42, 0, 0.98, 0);
  const toolBit = add(carriage, METAL_DARK, 0.16, 0.14, 0.14, 0.1, 1.16, -0.05);
  toolBit.name = "tool-bit";
  lathe.add(carriage);
  const toolContact = new THREE.Object3D();
  toolContact.position.set(0.45, 1.18, -0.03);
  carriage.add(toolContact);
  // control panel
  const panel = add(lathe, new THREE.MeshStandardMaterial({ map: screenTexture(["#3a6ea5", "#2a4a6a", "#8a4a3a", "#1a2a3a"]), roughness: 0.5, emissive: 0x8899aa, emissiveIntensity: 0.3 }), 0.5, 0.55, 0.06, -0.9, 1.5, 0.4);
  panel.rotation.y = -0.3;
  add(lathe, EMIS_RED, 0.06, 0.06, 0.02, -0.75, 1.62, 0.4);
  add(lathe, EMIS_COOL, 0.06, 0.06, 0.02, -0.6, 1.62, 0.4);
  g.add(lathe);
  // overhead articulated lamp
  const lampArm = new THREE.Group();
  lampArm.position.set(0.4, 4.9, 0.6);
  add(lampArm, METAL_DARK, 0.06, 0.8, 0.06, 0, -0.4, 0);
  add(lampArm, METAL_MID, 0.06, 0.06, 0.9, 0, -0.8, 0.4);
  add(lampArm, METAL_MID, 0.06, 0.5, 0.06, 0, -1.3, 0.85);
  add(lampArm, new THREE.MeshStandardMaterial({ color: 0x2c3138, roughness: 1 }), 0.3, 0.14, 0.3, 0, -1.52, 0.85);
  g.add(lampArm);
  const latheLight = new THREE.PointLight(0xe8f2fa, 26, 9, 2);
  latheLight.position.set(0.4, 3.4, 1.4);
  latheLight.castShadow = true;
  latheLight.shadow.mapSize.set(1024, 1024);
  latheLight.shadow.bias = -0.004;
  g.add(latheLight);
  // tray table with 36 cylinders
  const trayTable = new THREE.Group();
  trayTable.position.set(-3.3, 0, 1.4);
  add(trayTable, METAL_MID, 1.25, 0.06, 1.25, 0, 0.92, 0);
  for (const lx of [-0.55, 0.55]) for (const lz of [-0.55, 0.55]) add(trayTable, METAL_DARK, 0.08, 0.92, 0.08, lx, 0.46, lz);
  g.add(trayTable);
  const trayCylinders: THREE.Mesh[] = [];
  for (let i = 0; i < 36; i++) {
    const c = makeMeteorSegment(4);
    const row = Math.floor(i / 9);
    const col = i % 9;
    c.position.set(-3.3 - 0.45 + col * 0.115, 0.99, 1.4 - 0.42 + row * 0.115);
    c.rotation.set(Math.PI / 2, 0, 0);
    c.scale.setScalar(0.85);
    c.visible = false;
    trayCylinders.push(c);
    g.add(c);
  }
  // dust
  g.add(new THREE.AmbientLight(0x9fb0c4, 0.9));
  g.name = "set-workshop";
  return { group: g, chuck, rod, carriage, toolBit, trayCylinders, toolContact };
}

/* ================================================================== */
/* SET 5 — basement                                                    */
/* ================================================================== */

export interface BasementSet {
  group: THREE.Group;
  bag: THREE.Object3D;
  bulletHoles: THREE.Mesh[];
  muzzle: THREE.Object3D;
  table: THREE.Object3D;
  bulbLight: THREE.PointLight;
}

export function makeBasement(): BasementSet {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(
    voxelTerrain(24, 32, () => 1, (x, y, z, top) => (top ? ((x + z) % 4 === 0 ? 0x3e4248 : 0x45494f) : 0x34383d), { voxel: 0.25 }),
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  g.add(floor);
  const wall = new THREE.MeshStandardMaterial({ map: stainTexture(), roughness: 1 });
  add(g, wall, 6.0, 2.5, 0.24, 0, 1.25, -4.0);
  add(g, wall, 0.24, 2.5, 8.0, -2.88, 1.25, 0);
  add(g, wall, 0.24, 2.5, 8.0, 2.88, 1.25, 0);
  add(g, CONCRETE_DARK, 6.0, 0.2, 8.0, 0, 2.6, 0);
  // stairs down from the back door
  const stairs = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    add(stairs, CONCRETE, 1.3, 0.19 * (i + 1), 0.32, 0, 0.095 * (i + 1), -3.75 + i * 0.32);
  }
  g.add(stairs);
  // door at top of stairs
  add(g, CONCRETE, 1.5, 2.2, 0.16, 0, 2.8, -3.9);
  add(g, METAL_DARK, 0.14, 2.3, 0.14, -0.75, 2.85, -3.92);
  add(g, METAL_DARK, 0.14, 2.3, 0.14, 0.75, 2.85, -3.92);
  // hanging bulb
  const bulb = new THREE.Group();
  bulb.position.set(0, 2.5, 0.2);
  add(bulb, METAL_DARK, 0.025, 0.5, 0.025, 0, -0.24, 0);
  const bulbMat = add(bulb, EMIS_WARM, 0.13, 0.16, 0.13, 0, -0.5, 0);
  bulbMat.name = "bulb";
  g.add(bulb);
  const bulbLight = new THREE.PointLight(0xffc98f, 22, 9, 2);
  bulbLight.position.set(0, 1.95, 0.2);
  bulbLight.castShadow = true;
  bulbLight.shadow.mapSize.set(1024, 1024);
  bulbLight.shadow.bias = -0.006;
  g.add(bulbLight);
  // table with the works
  const table = new THREE.Group();
  table.position.set(0.15, 0, 1.1);
  add(table, new THREE.MeshStandardMaterial({ map: plankTexture(), roughness: 1 }), 1.5, 0.07, 0.8, 0, 0.78, 0);
  // light work mat so tools read in the dark
  add(table, new THREE.MeshStandardMaterial({ color: 0xb8ae98, roughness: 1 }), 1.4, 0.012, 0.6, -0.1, 0.82, 0.02);
  for (const lx of [-0.65, 0.65]) for (const lz of [-0.32, 0.32]) add(table, METAL_DARK, 0.07, 0.78, 0.07, lx, 0.39, lz);
  // rounds laid in rows
  for (let i = 0; i < 20; i++) {
    const r = makeRound();
    r.scale.setScalar(0.55);
    r.position.set(-0.55 + (i % 10) * 0.115, 0.82, -0.2 + Math.floor(i / 10) * 0.13);
    r.rotation.y = Math.PI / 2;
    table.add(r);
  }
  const segs: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const s = makeMeteorSegment(4);
    s.scale.setScalar(0.8);
    s.position.set(-0.5 + i * 0.14, 0.84, 0.16);
    s.rotation.y = Math.PI / 2;
    table.add(s);
    segs.push(s);
  }
  const pliers = makePliers();
  pliers.position.set(0.3, 0.82, 0.1);
  pliers.rotation.y = 0.7;
  table.add(pliers);
  const glue = makeGlueTube();
  glue.position.set(-0.45, 0.83, 0.28);
  table.add(glue);
  const knife = makeKnife();
  knife.position.set(0.55, 0.82, -0.12);
  knife.rotation.y = 0.4;
  table.add(knife);
  const pistol = makePistol();
  pistol.position.set(0.62, 0.83, 0.14);
  pistol.rotation.y = -0.5;
  table.add(pistol);
  for (let i = 0; i < 2; i++) {
    const mag = makeMagazine();
    mag.position.set(0.05 + i * 0.16, 0.83, -0.3);
    table.add(mag);
  }
  g.add(table);
  // crate with the cloth bundle + beef
  const crate = add(g, WOOD_MID, 0.9, 0.7, 0.9, -2.0, 0.35, 2.6);
  const bag = new THREE.Group();
  bag.position.set(-2.0, 0.72, 2.6);
  const bagMesh = makeClothBundle();
  bagMesh.scale.setScalar(1.15);
  bagMesh.rotation.y = 0.4;
  bag.add(bagMesh);
  bag.rotation.y = -0.3;
  g.add(bag);
  const beef = makeBeefChunk();
  beef.position.set(-1.35, 0.75, 2.7);
  beef.rotation.y = 0.9;
  g.add(beef);
  // bullet holes on the bag (4, revealed after the shot)
  const bulletHoles: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const hole = add(bag, new THREE.MeshStandardMaterial({ color: 0x17130e, roughness: 1 }), 0.045, 0.045, 0.05, -0.25 + i * 0.18, 0.45 + (i % 2) * 0.25, 0.62);
    hole.visible = false;
    bulletHoles.push(hole);
  }
  // fuse box + pipe
  add(g, METAL_DARK, 0.3, 0.45, 0.12, -2.8, 1.7, -1.5);
  add(g, METAL_MID, 0.08, 2.5, 0.08, 2.86, 1.25, -2.0);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.62, 0.83, 0.14);
  table.add(muzzle);
  g.add(new THREE.AmbientLight(0x8a6a4a, 0.38));
  // warm pool over the work table
  const pool = new THREE.PointLight(0xffd9a8, 24, 6, 2);
  pool.position.set(0.15, 1.9, 1.1);
  g.add(pool);
  // small work lamp beside the pistol
  const workLamp = new THREE.Group();
  workLamp.position.set(0.95, 0.78, 1.28);
  add(workLamp, METAL_DARK, 0.04, 0.3, 0.04, 0, 0.15, 0);
  add(workLamp, METAL_MID, 0.22, 0.1, 0.16, -0.1, 0.32, 0);
  workLamp.rotation.z = 0.4;
  add(workLamp, EMIS_WARM, 0.08, 0.03, 0.08, -0.18, 0.3, 0);
  g.add(workLamp);
  const spot = new THREE.PointLight(0xffd9a8, 60, 4, 2);
  spot.position.set(0.75, 1.2, 1.25);
  g.add(spot);
  g.name = "set-basement";
  return { group: g, bag, bulletHoles, muzzle, table, bulbLight };
}

/* ================================================================== */
/* SET 6 — space world                                                 */
/* ================================================================== */

export interface SpaceWorld {
  group: THREE.Group;
  earth: THREE.Mesh;
  sun: THREE.Mesh;
  sunGlow: THREE.Sprite;
  limbGlow: THREE.Sprite;
  station: THREE.Group;
  stationRim: THREE.Group;
  exitLamp: THREE.Mesh;
  baseOne: THREE.Group;
  beacon: THREE.Mesh;
  shipyard: THREE.Group;
  stars: THREE.Points;
}

export const SPACE = {
  station: { x: 0, y: -1600, z: -5200 },
  zhangWait: { x: 0, y: 40, z: 60 },
  groupPos: { x: 0, y: -1913, z: -5267 },
  sunDir: new THREE.Vector3(0, -0.977, -0.21).normalize(),
  baseOne: { x: 38000, y: -8000, z: 30000 },
  sunStart: { x: 0, y: -6600, z: -20000 },
};

export function makeSpaceWorld(): SpaceWorld {
  const g = new THREE.Group();
  const stars = makeStars(950);
  g.add(stars);

  const earth = makeEarthCap({ radius: 22000, voxel: 380, centerY: -23400 });
  g.add(earth);

  const limbGlow = makeGlowSprite("rgba(110,170,240,0.10)", "rgba(110,170,240,0)");
  limbGlow.position.set(0, -23400, 0);
  limbGlow.scale.setScalar(46200);
  g.add(limbGlow);

  const sun = makeSunDisc(1400, 130);
  sun.position.set(SPACE.sunStart.x, SPACE.sunStart.y, SPACE.sunStart.z);
  g.add(sun);
  const sunGlow = makeGlowSprite("rgba(255,214,150,0.95)", "rgba(255,170,80,0)");
  sunGlow.position.copy(sun.position);
  sunGlow.scale.setScalar(9000);
  g.add(sunGlow);

  const { group: station, rim: stationRim, exitDoor } = makeYellowRiverStation();
  station.position.set(SPACE.station.x, SPACE.station.y, SPACE.station.z);
  const exitLamp = exitDoor.getObjectByName("exit-lamp") as THREE.Mesh;
  g.add(station);

  const cable = makeCable(-1600, -2023, -5200);
  g.add(cable);

  const baseOne = makeBaseOne();
  baseOne.position.set(SPACE.baseOne.x, SPACE.baseOne.y, SPACE.baseOne.z);
  const beacon = baseOne.getObjectByName("base-one-beacon") as THREE.Mesh;
  g.add(baseOne);

  const shipyard = makeShipyardSkeleton();
  shipyard.position.set(-15000, -6500, -23500);
  g.add(shipyard);

  g.add(makeSmallStations(8));

  const debris = makeDebris(80);
  debris.position.set(SPACE.zhangWait.x, SPACE.zhangWait.y, SPACE.zhangWait.z);
  g.add(debris);

  // space lighting: sun from above-front, faint blue fill
  const ambient = new THREE.AmbientLight(0x7a8cac, 0.42);
  g.add(ambient);
  const sunLight = new THREE.DirectionalLight(0xffd9a8, 1.35);
  sunLight.position.set(0, 26000, 9000);
  sunLight.target.position.set(0, 0, 0);
  g.add(sunLight, sunLight.target);
  const fill = new THREE.HemisphereLight(0x46536e, 0x10151d, 0.28);
  g.add(fill);
  // camera-side key so suits and stations read against the void
  const keyFill = new THREE.DirectionalLight(0xd8e4f4, 0.9);
  keyFill.position.set(14000, 9000, 18000);
  keyFill.target.position.set(0, 0, 0);
  g.add(keyFill, keyFill.target);

  g.name = "set-space";
  return { group: g, earth, sun, sunGlow, limbGlow, station, stationRim, exitLamp, baseOne, beacon, shipyard, stars };
}

/* ================================================================== */
/* SET 7 — base one cabin (the positioning unit)                       */
/* ================================================================== */

export function makeCabin(): { group: THREE.Group; unit: THREE.Mesh } {
  const g = new THREE.Group();
  const wall = new THREE.MeshStandardMaterial({ map: whitePanelTexture(), roughness: 0.9 });
  add(g, wall, 2.6, 2.4, 0.12, 0, 1.2, -1.25);
  add(g, wall, 0.12, 2.4, 2.6, -1.25, 1.2, 0);
  add(g, wall, 0.12, 2.4, 2.6, 1.25, 1.2, 0);
  add(g, new THREE.MeshStandardMaterial({ color: 0xb9bfc6, roughness: 1 }), 2.6, 0.1, 2.6, 0, 0.05, 0);
  add(g, new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 1 }), 2.6, 0.1, 2.6, 0, 2.45, 0);
  // bunk
  add(g, new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 0.9 }), 0.9, 0.22, 2.1, -0.8, 0.5, 0.1);
  add(g, new THREE.MeshStandardMaterial({ color: 0x8fa0b0, roughness: 1 }), 0.9, 0.08, 2.1, -0.8, 0.65, 0.1);
  // locker
  add(g, new THREE.MeshStandardMaterial({ color: 0xcfd6de, roughness: 0.8, metalness: 0.2 }), 0.7, 1.6, 0.5, 0.85, 0.8, -0.6);
  add(g, EMIS_COOL, 0.06, 0.02, 0.02, 0.85, 1.55, -0.34);
  // table with the positioning unit
  add(g, new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 0.9 }), 0.5, 0.5, 0.4, 0.4, 0.85, 0.7);
  const unit = makePositioningUnit();
  unit.position.set(0.4, 1.1, 0.7);
  g.add(unit);
  const unitLed = add(g, new THREE.MeshStandardMaterial({
    color: 0xff5a48,
    emissive: 0xff3a28,
    emissiveIntensity: 2.2,
    roughness: 1,
  }), 0.05, 0.03, 0.03, 0.44, 1.13, 0.7);
  unitLed.name = "unit-led";
  // window with stars
  const win = add(g, new THREE.MeshStandardMaterial({ color: 0x0a0e16, roughness: 1 }), 0.7, 0.7, 0.02, -1.24, 1.7, 0.4);
  win.rotation.y = Math.PI / 2;
  const strip = add(g, EMIS_COOL, 1.4, 0.08, 0.14, 0, 2.4, 0.4);
  strip.name = "cabin-strip";
  const lamp = new THREE.PointLight(0xd8e8f8, 12, 6, 2);
  lamp.position.set(0, 2.2, 0.4);
  g.add(lamp);
  g.add(new THREE.AmbientLight(0x9fb0c4, 0.85));
  g.name = "set-cabin";
  return { group: g, unit };
}

/* ================================================================== */
/* SET 8 — base one interior, hibernation bay                          */
/* ================================================================== */

export interface HibernationBaySet {
  group: THREE.Group;
  podLid: THREE.Group;
  pod: THREE.Group;
  podLight: THREE.PointLight;
  monitors: THREE.Mesh[];
}

export function makeHibernationBay(): HibernationBaySet {
  const g = new THREE.Group();
  const wall = new THREE.MeshStandardMaterial({ map: whitePanelTexture(), roughness: 0.9 });
  add(g, wall, 3.6, 2.7, 0.14, 0, 1.35, -4.4);
  add(g, wall, 0.14, 2.7, 9.0, -1.73, 1.35, 0);
  add(g, wall, 0.14, 2.7, 9.0, 1.73, 1.35, 0);
  add(g, new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 1 }), 3.6, 0.12, 9.0, 0, 2.76, 0);
  const floor = add(g, new THREE.MeshStandardMaterial({ color: 0xb9bfc6, roughness: 0.9, metalness: 0.1 }), 3.6, 0.1, 9.0, 0, 0.05, 0);
  floor.name = "floor";
  // ceiling light strips
  for (const z of [-2.5, -0.5, 1.5, 3.5]) {
    add(g, EMIS_COOL, 1.0, 0.06, 1.6, 0, 2.72, z);
    const pl = new THREE.PointLight(0xd8e8f8, 15, 8, 2);
    pl.position.set(0, 2.5, z);
    g.add(pl);
  }
  // airlock door at far end
  add(g, new THREE.MeshStandardMaterial({ color: 0x9aa7b5, roughness: 0.7, metalness: 0.3 }), 1.6, 2.2, 0.12, 0, 1.1, -4.32);
  add(g, METAL_DARK, 0.1, 2.3, 0.1, -0.8, 1.15, -4.34);
  add(g, METAL_DARK, 0.1, 2.3, 0.1, 0.8, 1.15, -4.34);
  // hibernation pod
  const pod = new THREE.Group();
  pod.position.set(0, 0, 2.2);
  add(pod, new THREE.MeshStandardMaterial({ color: 0xe8ecf2, roughness: 0.6, metalness: 0.15 }), 1.5, 1.0, 2.7, 0, 0.5, 0); // base
  add(pod, new THREE.MeshStandardMaterial({ color: 0x232c3a, roughness: 0.8 }), 1.22, 0.2, 2.45, 0, 0.9, 0); // interior void
  const inner = add(pod, new THREE.MeshStandardMaterial({ color: 0x0e1622, roughness: 1, emissive: 0x0a1a2e, emissiveIntensity: 0.5 }), 1.1, 0.1, 2.35, 0, 1.02, 0);
  inner.name = "pod-inner";
  const podLight = new THREE.PointLight(0x7fc4ff, 4, 4, 2);
  podLight.position.set(0, 1.3, 0.4);
  pod.add(podLight);
  const lid = new THREE.Group();
  lid.position.set(-0.75, 1.0, 0);
  const lidMesh = add(lid, GLASS_DARK, 1.5, 0.12, 2.6, 0.75, 0, 0);
  lidMesh.name = "lid-glass";
  add(lid, new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 0.6, metalness: 0.2 }), 1.58, 0.08, 2.68, 0.75, -0.06, 0);
  pod.add(lid);
  g.add(pod);
  // monitors above pod
  const monitors: THREE.Mesh[] = [];
  const m1 = add(g, new THREE.MeshStandardMaterial({ map: screenTexture(["#2a4a6a", "#16304a", "#3a6ea5"]), roughness: 0.5, emissive: 0x99aabb, emissiveIntensity: 0.5 }), 0.7, 0.4, 0.04, -0.5, 2.1, 1.2);
  m1.rotation.y = 0.25;
  monitors.push(m1);
  const m2 = add(g, new THREE.MeshStandardMaterial({ map: screenTexture(["#1a4a3a", "#1a4a3a", "#0e2a20"]), roughness: 0.5, emissive: 0x99bbaa, emissiveIntensity: 0.5 }), 0.7, 0.4, 0.04, 0.5, 2.1, 1.2);
  m2.rotation.y = -0.25;
  monitors.push(m2);
  // IV/status rack beside pod
  add(g, new THREE.MeshStandardMaterial({ color: 0xcfd6de, roughness: 0.7, metalness: 0.2 }), 0.3, 1.6, 0.4, 1.35, 0.8, 2.2);
  const status = add(g, EMIS_BLUE, 0.05, 0.05, 0.02, 1.35, 1.4, 2.21);
  status.name = "status-led";
  g.add(new THREE.AmbientLight(0xb8c6d8, 1.0));
  g.name = "set-hibernation";
  return { group: g, podLid: lid, pod, podLight, monitors };
}

/* re-export for convenience */
export { makeCamera };
