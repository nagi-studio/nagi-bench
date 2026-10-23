import * as THREE from "three";
import type { HitZone, Team, WeaponId } from "./types";

const materials = new Map<string, THREE.MeshStandardMaterial>();
export function material(
  color: number | string,
  roughness = 0.85,
  metalness = 0,
) {
  const key = `${color}-${roughness}-${metalness}`;
  if (!materials.has(key))
    materials.set(
      key,
      new THREE.MeshStandardMaterial({ color, roughness, metalness }),
    );
  return materials.get(key)!;
}
const cube = new THREE.BoxGeometry(1, 1, 1);
export function box(
  parent: THREE.Object3D,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  color: number | string,
  roughness = 0.85,
  metalness = 0,
) {
  const mesh = new THREE.Mesh(cube, material(color, roughness, metalness));
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
export function cylinder(
  parent: THREE.Object3D,
  r1: number,
  r2: number,
  h: number,
  x: number,
  y: number,
  z: number,
  color: number | string,
  segments = 10,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(r1, r2, h, segments),
    material(color),
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function barrel(
  parent: THREE.Object3D,
  r: number,
  length: number,
  x: number,
  y: number,
  z: number,
  color: number,
) {
  const mesh = cylinder(parent, r, r, length, x, y, z, color);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

export function createWeapon(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  g.name = id;
  const steel = 0x292e2b,
    dark = 0x171c1b,
    wood = 0x85502e,
    green = 0x606642;
  if (id === "knife") {
    box(g, 0.075, 0.09, 0.24, 0, 0, 0.08, dark);
    box(g, 0.18, 0.035, 0.045, 0, 0, -0.07, 0x545c56, 0.32, 0.65);
    const shape = new THREE.Shape();
    shape.moveTo(-0.045, -0.07);
    shape.lineTo(0.045, -0.07);
    shape.lineTo(0.035, -0.43);
    shape.lineTo(-0.015, -0.54);
    shape.lineTo(-0.045, -0.4);
    shape.closePath();
    const blade = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 0.016, bevelEnabled: false }),
      material(0xc0c8c3, 0.28, 0.75),
    );
    blade.rotation.x = Math.PI / 2;
    g.add(blade);
    return g;
  }
  const pistol = ["glock", "usp", "deagle"].includes(id);
  if (pistol) {
    const silver = id === "deagle" ? 0xa6aaa2 : steel;
    box(
      g,
      id === "deagle" ? 0.105 : 0.085,
      0.095,
      0.3,
      0,
      0.055,
      -0.09,
      silver,
      0.32,
      0.7,
    );
    box(g, 0.078, 0.075, 0.24, 0, -0.017, -0.05, dark);
    const grip = box(
      g,
      0.075,
      0.19,
      0.105,
      0,
      -0.105,
      0.035,
      id === "deagle" ? 0x303631 : dark,
    );
    grip.rotation.x = -0.2;
    box(g, 0.018, 0.028, 0.05, 0, 0.117, 0.035, dark);
    box(g, 0.012, 0.026, 0.023, 0, 0.117, -0.215, dark);
    box(g, 0.022, 0.025, 0.1, 0.055, -0.055, -0.06, steel);
    if (id === "usp") barrel(g, 0.035, 0.22, 0, 0.05, -0.32, dark);
    else barrel(g, 0.019, 0.06, 0, 0.05, -0.26, dark);
    box(g, 0.065, 0.018, 0.09, 0, -0.2, 0.055, steel);
    return g;
  }
  const ak = id === "ak47",
    awp = id === "awp";
  box(g, 0.11, 0.14, 0.36, 0, 0, 0, awp ? green : steel, 0.55, 0.5);
  box(
    g,
    0.1,
    0.09,
    awp ? 0.48 : 0.28,
    0,
    -0.01,
    -0.32,
    ak ? wood : awp ? green : dark,
  );
  barrel(
    g,
    awp ? 0.024 : 0.019,
    awp ? 0.63 : 0.44,
    0,
    0.018,
    awp ? -0.78 : -0.62,
    steel,
  );
  barrel(g, 0.031, 0.085, 0, 0.018, awp ? -1.12 : -0.86, dark);
  box(g, 0.08, 0.07, 0.12, 0, 0.005, 0.22, steel);
  const stock = box(
    g,
    0.105,
    0.18,
    0.3,
    0,
    -0.025,
    0.39,
    ak ? wood : awp ? green : dark,
  );
  stock.rotation.x = 0.04;
  box(g, 0.12, 0.22, 0.035, 0, -0.03, 0.55, dark);
  const grip = box(g, 0.072, 0.2, 0.09, 0, -0.15, 0.09, ak ? wood : dark);
  grip.rotation.x = -0.2;
  if (ak) {
    for (let i = 0; i < 4; i++) {
      const m = box(
        g,
        0.078,
        0.095,
        0.12,
        0,
        -0.12 - i * 0.065,
        -0.07 + i * 0.016,
        dark,
      );
      m.rotation.x = -0.14 - i * 0.1;
    }
    barrel(g, 0.012, 0.36, 0, 0.09, -0.4, steel);
  } else {
    const mag = box(
      g,
      0.073,
      awp ? 0.12 : 0.27,
      0.13,
      0,
      awp ? -0.12 : -0.2,
      -0.035,
      dark,
    );
    mag.rotation.x = -0.12;
    if (!awp)
      for (let i = 0; i < 6; i++)
        box(g, 0.115, 0.014, 0.022, 0, 0.078, -0.23 - i * 0.037, steel);
  }
  if (awp) {
    box(g, 0.08, 0.075, 0.15, 0, 0.12, -0.02, steel);
    barrel(g, 0.053, 0.39, 0, 0.19, -0.09, dark);
    barrel(g, 0.068, 0.1, 0, 0.19, -0.31, steel);
    barrel(g, 0.063, 0.075, 0, 0.19, 0.13, steel);
    barrel(g, 0.054, 0.008, 0, 0.19, -0.365, 0x203e38);
    const bolt = barrel(g, 0.012, 0.12, 0.105, 0.045, 0.1, steel);
    bolt.rotation.z = Math.PI / 2;
  } else {
    box(g, 0.018, 0.105, 0.026, 0, 0.08, -0.64, steel);
    box(g, 0.06, 0.026, 0.05, 0, 0.092, 0.08, steel);
  }
  // Trigger guard, charging handle, ejection port.
  box(g, 0.014, 0.07, 0.13, 0.055, -0.102, 0.038, steel);
  box(g, 0.008, 0.045, 0.1, 0.06, 0.02, -0.02, dark);
  box(g, 0.054, 0.018, 0.03, 0.086, 0.045, 0.05, steel);
  return g;
}

export interface CharacterModel {
  group: THREE.Group;
  hitMeshes: THREE.Mesh[];
  legs: THREE.Group[];
  gun: THREE.Group;
  flash: THREE.Mesh;
  head: THREE.Group;
}

export function createCharacter(
  team: Team,
  id: number,
  weapon: WeaponId,
): CharacterModel {
  const group = new THREE.Group(),
    hitMeshes: THREE.Mesh[] = [],
    legs: THREE.Group[] = [];
  const shirt = team === "CT" ? 0x354d5c : 0x8a6950,
    pants = team === "CT" ? 0x303f49 : 0x71674b,
    vest = team === "CT" ? 0x192d35 : 0x473b30;
  const tag = (mesh: THREE.Mesh, zone: HitZone) => {
    mesh.userData = { actorId: id, zone };
    hitMeshes.push(mesh);
    return mesh;
  };
  const body = (
    p: THREE.Object3D,
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    color: number,
    zone: HitZone,
  ) => tag(box(p, w, h, d, x, y, z, color), zone);
  body(group, 0.59, 0.46, 0.3, 0, 1.27, 0, shirt, "chest");
  body(group, 0.5, 0.22, 0.29, 0, 0.95, 0, pants, "abdomen");
  body(group, 0.53, 0.4, 0.11, 0, 1.28, -0.19, vest, "chest");
  body(group, 0.51, 0.35, 0.09, 0, 1.28, 0.19, vest, "chest");
  for (let i = -1; i <= 1; i++)
    body(
      group,
      0.12,
      0.13,
      0.08,
      i * 0.15,
      1.17,
      -0.28,
      team === "CT" ? 0x4a625f : 0x746845,
      "chest",
    );
  body(group, 0.5, 0.055, 0.33, 0, 0.85, 0, 0x272d28, "abdomen");
  body(group, 0.055, 0.065, 0.02, 0, 0.85, -0.177, 0x91967e, "abdomen");
  const head = new THREE.Group();
  head.position.y = 1.66;
  group.add(head);
  const skull = new THREE.Mesh(
    new THREE.SphereGeometry(0.185, 10, 8),
    material(team === "CT" ? 0xb79877 : 0xb18a69),
  );
  head.add(skull);
  tag(skull, "head");
  skull.castShadow = true;
  if (team === "CT") {
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.205, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62),
      material(0x2c4449),
    );
    helmet.position.y = 0.045;
    head.add(helmet);
    tag(helmet, "head");
    body(head, 0.29, 0.073, 0.045, 0, 0.015, -0.174, 0x1c2e30, "head");
    body(head, 0.24, 0.085, 0.035, 0, -0.065, -0.167, 0x3a4744, "head");
  } else {
    const mask = new THREE.Mesh(
      new THREE.SphereGeometry(0.192, 10, 8),
      material(0x3d3a31),
    );
    head.add(mask);
    tag(mask, "head");
    body(head, 0.26, 0.041, 0.035, 0, 0.04, -0.181, 0xbfa482, "head");
    body(head, 0.034, 0.04, 0.04, 0, 0.04, -0.2, 0x36382f, "head");
    body(group, 0.46, 0.11, 0.35, 0, 1.49, -0.01, 0x9c593f, "chest");
  }
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.155, 0.86, 0);
    group.add(leg);
    legs.push(leg);
    body(leg, 0.235, 0.39, 0.245, 0, -0.2, 0, pants, "leg");
    body(leg, 0.2, 0.34, 0.21, 0, -0.55, 0.005, pants, "leg");
    body(leg, 0.22, 0.115, 0.32, 0, -0.8, -0.05, 0x232b28, "leg");
    body(
      leg,
      0.18,
      0.12,
      0.035,
      0,
      -0.4,
      -0.13,
      team === "CT" ? 0x1f3035 : 0x5d563f,
      "leg",
    );
    const shoulder = new THREE.Vector3(side * 0.33, 1.41, -0.01),
      elbow = new THREE.Vector3(side * 0.35, 1.15, -0.22),
      hand = new THREE.Vector3(
        side === 1 ? 0.15 : -0.06,
        1.28,
        side === 1 ? -0.46 : -0.65,
      );
    for (const [a, b, color] of [
      [shoulder, elbow, shirt],
      [elbow, hand, shirt],
    ] as const) {
      const center = a.clone().add(b).multiplyScalar(0.5),
        length = a.distanceTo(b);
      const arm = body(
        group,
        0.18,
        length,
        0.18,
        center.x,
        center.y,
        center.z,
        color,
        "arm",
      );
      arm.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        b.clone().sub(a).normalize(),
      );
    }
    body(group, 0.135, 0.12, 0.14, hand.x, hand.y, hand.z, 0x303830, "arm");
    body(
      group,
      0.05,
      0.11,
      0.19,
      side * 0.42,
      1.38,
      -0.015,
      team === "CT" ? 0x66b7c7 : 0xd7b765,
      "arm",
    );
  }
  const gun = createWeapon(weapon);
  gun.scale.setScalar(0.8);
  gun.position.set(0.13, 1.29, -0.47);
  group.add(gun);
  const flash = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.36, 5),
    new THREE.MeshBasicMaterial({
      color: 0xffdc8b,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    }),
  );
  flash.rotation.x = -Math.PI / 2;
  flash.position.set(0.13, 1.31, weapon === "awp" ? -1.35 : -1.13);
  flash.visible = false;
  group.add(flash);
  return { group, hitMeshes, legs, gun, flash, head };
}

export function createViewWeapon(id: WeaponId, team: Team) {
  const group = new THREE.Group(),
    gun = createWeapon(id);
  group.add(gun);
  const sleeve = team === "CT" ? 0x354a52 : 0x826950;
  for (const side of [-1, 1]) {
    const hand =
      side === 1
        ? new THREE.Vector3(0.015, -0.12, 0.09)
        : new THREE.Vector3(-0.03, -0.055, -0.34);
    const wrist =
      side === 1
        ? new THREE.Vector3(0.17, -0.36, 0.3)
        : new THREE.Vector3(-0.23, -0.3, 0.12);
    const center = hand.clone().add(wrist).multiplyScalar(0.5);
    const arm = box(
      group,
      0.12,
      hand.distanceTo(wrist),
      0.12,
      center.x,
      center.y,
      center.z,
      sleeve,
    );
    arm.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      hand.clone().sub(wrist).normalize(),
    );
    box(group, 0.11, 0.105, 0.12, hand.x, hand.y, hand.z, 0x303a30);
    box(
      group,
      0.075,
      0.035,
      0.07,
      hand.x,
      hand.y + 0.04,
      hand.z - 0.01,
      0x9d8061,
    );
  }
  const flash = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.28, 5),
    new THREE.MeshBasicMaterial({
      color: 0xffe3a2,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
    }),
  );
  flash.rotation.x = -Math.PI / 2;
  flash.position.set(
    0,
    0.02,
    id === "awp"
      ? -1.18
      : id === "usp"
        ? -0.45
        : ["glock", "deagle"].includes(id)
          ? -0.32
          : -0.95,
  );
  flash.visible = false;
  group.add(flash);
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = false;
  });
  return { group, flash };
}

export function createBomb() {
  const g = new THREE.Group();
  box(g, 0.33, 0.11, 0.24, 0, 0.075, 0, 0x3e4331);
  box(g, 0.2, 0.025, 0.13, 0, 0.145, -0.025, 0x202a24);
  box(g, 0.13, 0.012, 0.04, 0, 0.162, -0.05, 0x91b866);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      box(
        g,
        0.027,
        0.012,
        0.022,
        -0.045 + i * 0.04,
        0.162,
        0.005 + j * 0.028,
        0x999b7c,
      );
  for (let i = 0; i < 3; i++)
    cylinder(
      g,
      0.027,
      0.027,
      0.27,
      -0.11 + i * 0.1,
      0.08,
      0,
      0x93734e,
      8,
    ).rotation.z = Math.PI / 2;
  const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xf04a33 }),
  );
  led.position.set(0.12, 0.15, -0.07);
  g.add(led);
  return { group: g, led };
}

/** Dispose only resources owned by a model; shared boxes and palette stay reusable. */
export function releaseModel(root: THREE.Object3D) {
  const palette = new Set(materials.values());
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    if (object.geometry !== cube) object.geometry.dispose();
    for (const mat of Array.isArray(object.material)
      ? object.material
      : [object.material])
      if (!palette.has(mat)) mat.dispose();
  });
}
