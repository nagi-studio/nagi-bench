import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  CELL,
  COLS,
  ROWS,
  MIN_X,
  MIN_Z,
  walkGrid,
  cellPos,
  OBSTACLES,
  SITES,
} from "./map";
import type { Team, WeaponId } from "./types";

const mats = new Map<string, THREE.MeshStandardMaterial>();
export function material(
  color: string | number,
  metalness = 0,
  roughness = 0.8,
) {
  const key = `${color}-${metalness}-${roughness}`;
  if (!mats.has(key))
    mats.set(
      key,
      new THREE.MeshStandardMaterial({ color, metalness, roughness }),
    );
  return mats.get(key)!;
}
export function box(
  parent: THREE.Object3D,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function cylinder(
  parent: THREE.Object3D,
  r: number,
  h: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  segments = 12,
) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}
// Batch immutable geometry by material; preserve raycast geometry for collision queries.
function batchStatic(
  group: THREE.Group,
  preserve: THREE.Object3D[] = [],
  retainHitboxes = false,
) {
  group.updateMatrixWorld(true);
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  for (const mesh of [...group.children])
    if (mesh instanceof THREE.Mesh && !Array.isArray(mesh.material)) {
      const list = batches.get(mesh.material) || [];
      list.push(mesh.geometry.clone().applyMatrix4(mesh.matrix));
      batches.set(mesh.material, list);
      if (retainHitboxes && preserve.includes(mesh)) mesh.visible = false;
      else group.remove(mesh);
      if (!preserve.includes(mesh)) mesh.geometry.dispose();
    }
  for (const [mat, geometries] of batches) {
    const geometry = mergeGeometries(geometries, false);
    for (const g of geometries) g.dispose();
    if (geometry) {
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }
}
let seed = 129;
function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
function surface(base: string, type: "plaster" | "ground" | "wood") {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const c = canvas.getContext("2d")!;
  c.fillStyle = base;
  c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12000; i++) {
    const a = random() * 0.09;
    c.fillStyle = `rgba(${random() > 0.5 ? "255,244,220" : "50,35,20"},${a})`;
    c.fillRect(
      random() * 256,
      random() * 256,
      random() * 3 + 0.4,
      random() * 2 + 0.4,
    );
  }
  if (type === "wood") {
    for (let i = 0; i < 8; i++) {
      c.fillStyle = "rgba(30,20,10,.3)";
      c.fillRect(i * 32, 0, 2, 256);
      for (let j = 0; j < 15; j++) {
        c.fillStyle = "rgba(50,29,10,.14)";
        c.fillRect(i * 32 + random() * 28, random() * 256, 1, random() * 120);
      }
    }
  }
  if (type === "plaster") {
    for (let i = 0; i < 16; i++) {
      c.fillStyle = "rgba(90,69,40,.025)";
      c.fillRect(0, i * 16, 256, 1);
    }
  }
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(type === "ground" ? 45 : 1, type === "ground" ? 45 : 1);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function sign(
  parent: THREE.Object3D,
  text: string,
  x: number,
  y: number,
  z: number,
  rotation = 0,
  w = 2.3,
  h = 1.4,
  bg = "#a9472d",
  fg = "#fff1cd",
) {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 256;
  const c = cv.getContext("2d")!;
  c.fillStyle = bg;
  c.fillRect(0, 0, 512, 256);
  c.strokeStyle = fg;
  c.lineWidth = 7;
  c.strokeRect(14, 14, 484, 228);
  c.fillStyle = fg;
  c.font = `bold ${text.length < 4 ? 170 : 57}px Arial`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, 256, 132, 460);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }),
  );
  m.position.set(x, y, z);
  m.rotation.y = rotation;
  parent.add(m);
  return m;
}
export interface World {
  group: THREE.Group;
  occluders: THREE.Object3D[];
  bombModel: THREE.Group;
  bombLight: THREE.Mesh;
}
export function createWorld(scene: THREE.Scene): World {
  const group = new THREE.Group();
  scene.add(group);
  const occluders: THREE.Object3D[] = [];
  const plaster = new THREE.MeshStandardMaterial({
    color: "#dfc6a1",
    map: surface("#c6b08c", "plaster"),
    roughness: 0.95,
  });
  const pale = material("#d9c6a6"),
    trim = material("#b5a080"),
    dark = material("#474d48"),
    wood = new THREE.MeshStandardMaterial({
      map: surface("#857451", "wood"),
      roughness: 0.92,
    });
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240),
    new THREE.MeshStandardMaterial({
      color: "#c4b596",
      map: surface("#c3b69b", "ground"),
      roughness: 1,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);
  // Merge the boundary of the corridor union into wall runs. No invisible maze geometry.
  const edges: { x: number; z: number; w: number; d: number; axis: string }[] =
    [];
  for (let row = 0; row < ROWS; row++)
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col;
      if (!walkGrid[i]) continue;
      const p = cellPos(i);
      if (row === 0 || !walkGrid[i - COLS])
        edges.push({ x: p.x, z: p.z - CELL / 2, w: CELL, d: 0.38, axis: "n" });
      if (row === ROWS - 1 || !walkGrid[i + COLS])
        edges.push({ x: p.x, z: p.z + CELL / 2, w: CELL, d: 0.38, axis: "s" });
      if (col === 0 || !walkGrid[i - 1])
        edges.push({ x: p.x - CELL / 2, z: p.z, w: 0.38, d: CELL, axis: "w" });
      if (col === COLS - 1 || !walkGrid[i + 1])
        edges.push({ x: p.x + CELL / 2, z: p.z, w: 0.38, d: CELL, axis: "e" });
    }
  const merged: typeof edges = [];
  for (const axis of ["n", "s", "w", "e"]) {
    const horizontal = axis === "n" || axis === "s";
    const sorted = edges
      .filter((e) => e.axis === axis)
      .sort((a, b) =>
        horizontal ? a.z - b.z || a.x - b.x : a.x - b.x || a.z - b.z,
      );
    for (const e of sorted) {
      const prev = merged[merged.length - 1];
      if (
        prev &&
        prev.axis === axis &&
        (horizontal
          ? prev.z === e.z &&
            Math.abs(prev.x + prev.w / 2 - (e.x - e.w / 2)) < 0.01
          : prev.x === e.x &&
            Math.abs(prev.z + prev.d / 2 - (e.z - e.d / 2)) < 0.01)
      ) {
        if (horizontal) {
          prev.x += e.w / 2;
          prev.w += e.w;
        } else {
          prev.z += e.d / 2;
          prev.d += e.d;
        }
      } else merged.push({ ...e });
    }
  }
  for (const e of merged) {
    const h = 5.4 + (Math.abs(e.x * 3 + e.z) % 3) * 0.5;
    occluders.push(box(group, e.w, h, e.d, e.x, h / 2, e.z, plaster));
    box(group, e.w + 0.12, 0.23, e.d + 0.12, e.x, h - 0.05, e.z, pale);
    box(group, e.w + 0.04, 0.55, e.d + 0.04, e.x, 0.275, e.z, trim);
    const length = Math.max(e.w, e.d);
    for (let v = 2; v < length - 1; v += 4.5) {
      const horizontal = e.w > e.d;
      const xx = horizontal ? e.x - e.w / 2 + v : e.x,
        zz = horizontal ? e.z : e.z - e.d / 2 + v;
      const offset = e.axis === "n" || e.axis === "w" ? 1 : -1;
      const window = box(
        group,
        horizontal ? 1 : 0.08,
        1.3,
        horizontal ? 0.08 : 1,
        xx + (horizontal ? 0 : 0.24 * offset),
        3.5,
        zz + (horizontal ? 0.24 * offset : 0),
        material("#55605a"),
      );
      for (const k of [-0.27, 0, 0.27])
        box(
          group,
          horizontal ? 0.035 : 0.1,
          1.3,
          horizontal ? 0.1 : 0.035,
          window.position.x + (horizontal ? k : 0),
          3.5,
          window.position.z + (horizontal ? 0 : k),
          dark,
        );
    }
  }
  for (const o of OBSTACLES) {
    const m = box(
      group,
      o.w,
      o.h,
      o.d,
      o.x + o.w / 2,
      o.h / 2,
      o.z + o.d / 2,
      wood,
    );
    occluders.push(m);
    if (o.kind === "door") {
      for (const y of [0.45, o.h - 0.45])
        box(
          group,
          o.w + 0.03,
          0.12,
          o.d + 0.08,
          m.position.x,
          y,
          m.position.z,
          material("#45423a", 0.65),
        );
      for (let x = 0.25; x < o.w; x += 0.65)
        for (const y of [0.45, o.h - 0.45]) {
          const bolt = new THREE.Mesh(
            new THREE.SphereGeometry(0.035, 6, 6),
            dark,
          );
          bolt.position.set(o.x + x, y, o.z + o.d + 0.04);
          group.add(bolt);
        }
    } else {
      for (const y of [0.16, o.h - 0.16])
        box(
          group,
          o.w + 0.04,
          0.14,
          o.d + 0.04,
          m.position.x,
          y,
          m.position.z,
          trim,
        );
      for (const dx of [-o.w / 2 + 0.1, o.w / 2 - 0.1])
        box(
          group,
          0.15,
          o.h + 0.02,
          o.d + 0.04,
          m.position.x + dx,
          o.h / 2,
          m.position.z,
          trim,
        );
      sign(
        group,
        "↑",
        m.position.x,
        o.h / 2,
        o.z + o.d + 0.025,
        0,
        Math.min(o.w * 0.35, 0.65),
        0.6,
        "#857451",
        "#3e3b2e",
      );
    }
  }
  // Tunnel roof and repeating beams; the entrance remains open at both ends.
  occluders.push(box(group, 10.1, 0.35, 28, -27, 4.5, 7, plaster));
  for (let z = -5; z < 21; z += 4)
    box(group, 10, 0.25, 0.32, -27, 4.2, z, trim);
  const lampMat = new THREE.MeshStandardMaterial({
    color: "#ffdf9f",
    emissive: "#ffd080",
    emissiveIntensity: 1,
  });
  for (const z of [-2, 9, 19]) {
    box(group, 0.4, 0.1, 0.7, -27, 4.27, z, lampMat);
    const l = new THREE.PointLight("#ffce89", 10, 10, 2);
    l.position.set(-27, 3.7, z);
    group.add(l);
  }
  // Portal lintels over the two sets of playable wooden doors.
  for (const p of [
    { x: 0, z: -8.5, w: 12 },
    { x: 35, z: 12.5, w: 10 },
  ]) {
    occluders.push(box(group, p.w, 1.2, 1.1, p.x, 4.5, p.z, plaster));
    box(group, p.w + 0.1, 0.25, 1.2, p.x, 5.2, p.z, pale);
  }
  // Distinctive local callouts and painted bomb-site circles.
  sign(group, "A  →", 28, 3, 19.78, Math.PI, 3, 1.5);
  sign(group, "A", 39.78, 2.9, -22, -Math.PI / 2, 2.4, 2.3);
  sign(group, "B", -37.78, 2.8, -22, Math.PI / 2, 2.3, 2.2);
  sign(group, "←  B", -5.78, 2.5, 7, Math.PI / 2, 2.4, 1.1, "#5c766e");
  sign(group, "سوق المدينة", 5.78, 3.4, 18, -Math.PI / 2, 3.4, 1.2, "#486e73");
  sign(group, "HOTEL AURORE", 30.22, 3.9, -3, Math.PI / 2, 4, 1, "#56696a");
  sign(group, "MID DOORS", 0, 4.5, -7.91, 0, 2.7, 0.55, "#b7a184", "#4a493c");
  for (const site of SITES) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.7, 3.83, 64),
      new THREE.MeshBasicMaterial({
        color: "#ae6344",
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(site.x, 0.016, site.z);
    group.add(ring);
    const letter = sign(
      group,
      site.name,
      site.x,
      0.025,
      site.z,
      0,
      3,
      3,
      "#b5a184",
      "#995333",
    );
    letter.rotation.x = -Math.PI / 2;
  }
  // Rooftops and distant skyline are procedural geometry, outside the playable boundary.
  for (const p of [
    { x: 22, z: 6, w: 10, d: 18, h: 8 },
    { x: 22, z: 36, w: 15, d: 10, h: 10 },
    { x: -12, z: -32, w: 18, d: 8, h: 9 },
    { x: 45, z: -9, w: 10, d: 21, h: 9 },
    { x: -42, z: 12, w: 8, d: 22, h: 7 },
  ]) {
    box(group, p.w, p.h, p.d, p.x, p.h / 2, p.z, plaster);
    box(group, p.w + 0.25, 0.25, p.d + 0.25, p.x, p.h, p.z, pale);
    for (let j = 0; j < 3; j++)
      box(
        group,
        0.6,
        1.1,
        1,
        p.x - p.w / 2 + 2 + j * 3,
        p.h + 0.55,
        p.z + p.d / 2,
        plaster,
      );
  }
  const towerX = -17,
    towerZ = -36;
  cylinder(group, 2.5, 15, towerX, 7.5, towerZ, pale, 8);
  cylinder(group, 3.1, 0.5, towerX, 14.8, towerZ, trim, 12);
  cylinder(group, 1.6, 3, towerX, 16.5, towerZ, pale, 12);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    material("#a6af9b"),
  );
  dome.position.set(towerX, 18, towerZ);
  group.add(dome);
  cylinder(group, 0.08, 2, towerX, 19.5, towerZ, dark);
  for (const p of [
    { x: 42, z: -30 },
    { x: -40, z: -31 },
    { x: 21, z: 33 },
  ]) {
    cylinder(group, 0.22, 8, p.x, 4, p.z, material("#8d7b55"));
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      const leaf = box(
        group,
        4.5,
        0.08,
        0.6,
        p.x + Math.cos(a) * 1.7,
        8,
        p.z + Math.sin(a) * 1.7,
        material("#6b7861"),
      );
      leaf.rotation.set(Math.sin(a) * 0.22, -a, Math.cos(a) * 0.22);
    }
  }
  for (const z of [-4, 7]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(30, 5, z),
      new THREE.Vector3(35, 4.6, z),
      new THREE.Vector3(40, 5, z),
    ]);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)),
      new THREE.LineBasicMaterial({ color: "#41483e" }),
    );
    group.add(line);
  }
  // The single C4 model is moved by the round engine.
  const bombModel = new THREE.Group();
  box(bombModel, 0.48, 0.16, 0.34, 0, 0.08, 0, material("#4b5b3c"));
  box(bombModel, 0.2, 0.025, 0.16, 0, 0.175, 0, material("#1c211b"));
  const bombLight = box(
    bombModel,
    0.035,
    0.015,
    0.035,
    0.13,
    0.175,
    0.1,
    material("#eb613d"),
  );
  bombModel.visible = false;
  group.add(bombModel);
  batchStatic(group, occluders);
  return { group, occluders, bombModel, bombLight };
}

export function createGun(id: WeaponId, firstPerson = false) {
  const g = new THREE.Group(),
    metal = material("#434e4e", 0.35, 0.48),
    black = material("#242c2c", 0.2, 0.6),
    steel = material("#84908e", 0.55, 0.3),
    wood = material("#895231", 0.1, 0.65),
    olive = material("#5b6550", 0.1, 0.7);
  // The barrel points down local -Z, in both world and first-person space.
  if (id === "knife") {
    box(g, 0.065, 0.11, 0.29, 0, 0, 0.05, black);
    box(g, 0.18, 0.025, 0.045, 0, 0.02, -0.1, steel);
    const blade = box(g, 0.025, 0.09, 0.38, 0, 0.025, -0.31, steel);
    blade.rotation.z = 0.15;
  } else if (["glock", "usp", "deagle"].includes(id)) {
    box(g, 0.09, 0.15, 0.15, 0, -0.075, 0.02, black).rotation.x = -0.2;
    box(
      g,
      id === "deagle" ? 0.12 : 0.1,
      0.105,
      id === "deagle" ? 0.35 : 0.26,
      0,
      0.035,
      -0.09,
      id === "deagle" ? steel : metal,
    );
    box(g, 0.035, 0.03, 0.035, 0, 0.105, -0.2, black);
    box(g, 0.07, 0.025, 0.04, 0, 0.1, 0.025, black);
    if (id === "usp") {
      const s = cylinder(g, 0.033, 0.18, 0, 0.035, -0.31, black);
      s.rotation.x = Math.PI / 2;
    }
    box(g, 0.065, 0.02, 0.12, 0, -0.09, -0.09, metal);
  } else {
    const isAK = id === "ak47",
      isAWP = id === "awp";
    box(
      g,
      0.115,
      0.15,
      isAWP ? 0.47 : 0.36,
      0,
      0.025,
      -0.15,
      isAWP ? olive : metal,
    );
    box(g, 0.09, 0.16, 0.11, 0, -0.1, -0.02, black).rotation.x = -0.25;
    box(
      g,
      0.12,
      0.13,
      0.23,
      0,
      0.03,
      0.13,
      isAK ? wood : isAWP ? olive : black,
    );
    box(g, 0.13, 0.21, 0.055, 0, 0, 0.265, black);
    box(
      g,
      0.1,
      0.095,
      0.26,
      0,
      0.015,
      -0.43,
      isAK ? wood : isAWP ? olive : black,
    );
    const barrel = cylinder(
      g,
      0.023,
      isAWP ? 0.4 : 0.28,
      0,
      0.04,
      isAWP ? -0.73 : -0.66,
      metal,
    );
    barrel.rotation.x = Math.PI / 2;
    const mag = box(
      g,
      0.075,
      isAWP ? 0.11 : 0.25,
      0.13,
      0,
      -0.13,
      -0.18,
      black,
    );
    mag.rotation.x = isAK ? -0.24 : 0;
    box(g, 0.045, 0.055, 0.025, 0, 0.1, -0.59, black);
    if (isAWP) {
      box(g, 0.045, 0.07, 0.2, 0, 0.14, -0.16, metal);
      const scope = cylinder(g, 0.049, 0.32, 0, 0.2, -0.18, black);
      scope.rotation.x = Math.PI / 2;
      const glass = cylinder(
        g,
        0.045,
        0.014,
        0,
        0.2,
        -0.347,
        material("#4d9293", 0.6, 0.2),
      );
      glass.rotation.x = Math.PI / 2;
    } else {
      box(g, 0.045, 0.04, 0.13, 0, 0.12, -0.13, black);
      for (let i = 0; i < 5; i++)
        box(g, 0.125, 0.015, 0.012, 0, 0.1, -0.32 - i * 0.035, metal);
    }
  }
  if (firstPerson) {
    const glove = material("#3c4640"),
      sleeve = material("#777963"),
      skin = material("#c29a75");
    box(g, 0.115, 0.13, 0.14, 0.015, -0.1, 0.065, glove).rotation.x = -0.3;
    const arm = box(g, 0.14, 0.14, 0.41, 0.08, -0.18, 0.29, sleeve);
    arm.rotation.set(-0.2, -0.18, 0);
    if (WEAPON_LONG(id)) {
      const hand = box(g, 0.12, 0.12, 0.15, -0.055, -0.08, -0.39, glove);
      hand.rotation.z = -0.15;
      const left = box(g, 0.14, 0.15, 0.47, -0.19, -0.17, -0.2, sleeve);
      left.rotation.set(0.2, -0.6, 0);
      box(g, 0.11, 0.03, 0.08, -0.055, -0.05, -0.4, skin);
    }
  }
  batchStatic(g);
  return g;
}
const WEAPON_LONG = (id: WeaponId) => ["ak47", "m4a4", "awp"].includes(id);
export function createActor(team: Team, id: WeaponId) {
  const g = new THREE.Group(),
    hitboxes: THREE.Mesh[] = [],
    limbs: THREE.Group[] = [];
  const uniform = material(team === "CT" ? "#4b6570" : "#ac8d61"),
    pants = material(team === "CT" ? "#374c55" : "#746c56"),
    vest = material(team === "CT" ? "#253d49" : "#695e42"),
    skin = material("#b58c69"),
    boot = material("#252e2b"),
    headgear = material(team === "CT" ? "#344951" : "#827c68");
  function hit(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    m: THREE.Material,
    zone: string,
    parent: THREE.Object3D = g,
  ) {
    const mesh = box(parent, w, h, d, x, y, z, m);
    mesh.userData.zone = zone;
    hitboxes.push(mesh);
    return mesh;
  }
  hit(0.46, 0.45, 0.27, 0, 1.23, 0, uniform, "chest");
  hit(0.38, 0.25, 0.25, 0, 0.91, 0, pants, "abdomen");
  box(g, 0.49, 0.37, 0.09, 0, 1.24, -0.15, vest);
  for (const x of [-0.15, 0.15]) box(g, 0.1, 0.15, 0.08, x, 1.15, -0.22, vest);
  hit(0.25, 0.29, 0.26, 0, 1.65, 0, skin, "head");
  box(g, 0.29, 0.12, 0.29, 0, 1.79, 0.015, headgear);
  box(
    g,
    0.23,
    0.085,
    0.04,
    0,
    1.68,
    -0.14,
    team === "CT" ? material("#1b2a2f", 0.6) : headgear,
  );
  if (team === "T") box(g, 0.265, 0.1, 0.04, 0, 1.55, -0.14, headgear);
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.13, 0.79, 0);
    g.add(leg);
    limbs.push(leg);
    hit(0.18, 0.64, 0.21, 0, -0.33, 0, pants, "leg", leg);
    box(leg, 0.2, 0.15, 0.31, 0, -0.72, -0.035, boot);
    const arm = new THREE.Group();
    arm.position.set(side * 0.31, 1.4, -0.01);
    arm.rotation.set(0.6, side === -1 ? -0.4 : 0.12, -side * 0.2);
    g.add(arm);
    hit(0.17, 0.36, 0.19, 0, -0.16, 0, uniform, "arm", arm);
    const fore = hit(0.15, 0.32, 0.17, 0, -0.39, -0.12, uniform, "arm", arm);
    fore.rotation.x = 1;
    box(arm, 0.14, 0.13, 0.14, 0, -0.47, -0.24, boot);
    batchStatic(arm, hitboxes, true);
  }
  const weapon = createGun(id);
  weapon.position.set(0.12, 1.16, -0.44);
  g.add(weapon);
  // Patches remain visible from behind and support instant team identification.
  box(
    g,
    0.3,
    0.08,
    0.015,
    0,
    1.35,
    0.151,
    material(team === "CT" ? "#a8c7cf" : "#d1b582"),
  );
  batchStatic(g, hitboxes, true);
  return { model: g, hitboxes, limbs, weapon };
}
