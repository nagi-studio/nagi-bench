import * as THREE from "three";
import { box, emissive, mat, makeHuman, sitPose, type Human } from "../voxel";

/** Smoothly blend a scalar between keyframe windows. */
function env(t: number, a: number, b: number): number {
  return THREE.MathUtils.smoothstep(t, a, b);
}

function nod(t: number, t0: number, amp = 0.12): number {
  const d = t - t0;
  if (d < 0 || d > 0.9) return 0;
  return Math.sin(d * 10) * amp * Math.exp(-d * 4);
}

export interface SceneHandle {
  group: THREE.Group;
  frame: (t: number) => void;
  setCamera: (cam: THREE.PerspectiveCamera, setup: string, t: number) => void;
}

export function buildCollector(): SceneHandle {
  const group = new THREE.Group();

  /* ---------------- room ---------------- */
  const floor = box(12, 0.2, 10, 0x3a2c20, { y: -0.1, shadow: false });
  floor.receiveShadow = true;
  group.add(floor);
  const wallMat = mat(0x4a3626, 0.95);
  const back = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.3), wallMat);
  back.position.set(0, 2.1, -4.85); back.receiveShadow = true;
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 10), wallMat);
  left.position.set(-5.85, 2.1, 0); left.receiveShadow = true;
  const right = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 10), wallMat);
  right.position.set(5.85, 2.1, 0); right.receiveShadow = true;
  const ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 10), mat(0x2e2118, 1));
  ceil.position.set(0, 4.15, 0);
  group.add(back, left, right, ceil);

  // paper window on right wall, faint warm glow (四合院老宅)
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.7, 2.6), emissive(0xffd9a0, 0.28));
  win.position.set(5.7, 2.2, 1.6);
  group.add(win);
  // window lattice
  for (let i = 0; i < 4; i++) {
    group.add(box(0.1, 1.7, 0.06, 0x2a1d12, { x: 5.68, y: 2.2, z: 0.7 + i * 0.6, shadow: false }));
  }
  group.add(box(0.1, 0.06, 2.6, 0x2a1d12, { x: 5.68, y: 2.2, z: 1.6, shadow: false }));

  // door (back-right)
  const door = box(1.3, 2.6, 0.12, 0x54371e, { x: 4.2, y: 1.3, z: -4.68 });

  /* ---------------- cabinets with stones ---------------- */
  const stoneColors = [0x4c4a48, 0x5a4f42, 0x3d3f45, 0x574638, 0x46413c];
  function cabinet(x: number, z: number, ry: number, seed: number): THREE.Group {
    const c = new THREE.Group();
    c.position.set(x, 0, z);
    c.rotation.y = ry;
    // border frame (top/bottom/sides) + back, not a solid box
    c.add(box(2.2, 0.12, 0.55, 0x33241a, { y: 2.76 }));
    c.add(box(2.2, 0.2, 0.55, 0x33241a, { y: 0.2 }));
    c.add(box(0.12, 2.7, 0.55, 0x33241a, { x: -1.04, y: 1.45 }));
    c.add(box(0.12, 2.7, 0.55, 0x33241a, { x: 1.04, y: 1.45 }));
    c.add(box(2.2, 2.7, 0.08, 0x241a12, { y: 1.45, z: -0.24 }));
    // inner lit back panel (专业灯光下的展柜)
    const glow = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.5, 0.04), emissive(0xffe4bc, 0.3));
    glow.position.set(0, 1.45, -0.19);
    c.add(glow);
    // shelf light strips (专业灯光)
    for (let s = 0; s < 4; s++) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.03, 0.03), emissive(0xfff2d8, 3.2));
      strip.position.set(0, 0.62 + s * 0.62, 0.24);
      c.add(strip);
      const shelf = box(2.0, 0.04, 0.4, 0x241a12, { y: 0.42 + s * 0.62, z: 0.06 });
      c.add(shelf);
      // stones on shelf
      let sd = seed + s * 7;
      for (let i = 0; i < 3; i++) {
        sd = (sd * 16807) % 2147483647;
        const px = -0.65 + i * 0.62 + (sd % 100) / 500;
        sd = (sd * 16807) % 2147483647;
        const sc = stoneColors[sd % stoneColors.length];
        const st = box(0.22 + (sd % 40) / 160, 0.14 + (sd % 30) / 200, 0.19, sc, {
          x: px, y: 0.54 + s * 0.62, z: 0.08, ry: (sd % 60) / 40,
        });
        c.add(st);
      }
    }
    // glass front
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(2.05, 2.55, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x8899aa, transparent: true, opacity: 0.07, roughness: 0.05, metalness: 0.4 }),
    );
    glass.position.set(0, 1.45, 0.28);
    c.add(glass);
    return c;
  }
  group.add(cabinet(-3.4, -4.4, 0, 11));
  group.add(cabinet(-0.9, -4.4, 0, 23));
  const dealCabinet = cabinet(1.6, -4.4, 0, 37);
  group.add(dealCabinet);
  group.add(cabinet(-5.4, -1.4, Math.PI / 2, 51));
  group.add(cabinet(-5.4, 1.2, Math.PI / 2, 67));

  /* ---------------- work table ---------------- */
  const workTable = new THREE.Group();
  workTable.position.set(-2.9, 0, -2.6);
  workTable.add(box(1.9, 0.09, 0.95, 0x5a4028, { y: 0.86 }));
  for (const [lx, lz] of [[-0.85, -0.38], [0.85, -0.38], [-0.85, 0.38], [0.85, 0.38]] as const) {
    workTable.add(box(0.09, 0.86, 0.09, 0x4a3420, { x: lx, y: 0.43, z: lz }));
  }
  // desk lamp
  workTable.add(box(0.08, 0.5, 0.08, 0x222222, { x: -0.7, y: 1.15, z: -0.25 }));
  const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.22), emissive(0xffe6b8, 2.2));
  lampHead.position.set(-0.55, 1.42, -0.1);
  workTable.add(lampHead);
  // magnifier + small stone on table
  workTable.add(box(0.14, 0.1, 0.12, 0x4c4a48, { x: 0.15, y: 0.96, z: 0.05, ry: 0.5 }));
  group.add(workTable);

  /* ---------------- tea table + chairs ---------------- */
  const teaTable = new THREE.Group();
  teaTable.position.set(0.8, 0, 0.6);
  teaTable.add(box(1.5, 0.08, 0.9, 0x6b4a2c, { y: 0.72 }));
  teaTable.add(box(0.12, 0.72, 0.12, 0x553a22, { x: -0.6, y: 0.36, z: -0.3 }));
  teaTable.add(box(0.12, 0.72, 0.12, 0x553a22, { x: 0.6, y: 0.36, z: -0.3 }));
  teaTable.add(box(0.12, 0.72, 0.12, 0x553a22, { x: -0.6, y: 0.36, z: 0.3 }));
  teaTable.add(box(0.12, 0.72, 0.12, 0x553a22, { x: 0.6, y: 0.36, z: 0.3 }));
  group.add(teaTable);

  function chair(): THREE.Group {
    const c = new THREE.Group();
    c.add(box(0.55, 0.07, 0.5, 0x4f3620, { y: 0.5 }));
    c.add(box(0.07, 0.5, 0.07, 0x41291a, { x: -0.22, y: 0.25, z: -0.2 }));
    c.add(box(0.07, 0.5, 0.07, 0x41291a, { x: 0.22, y: 0.25, z: -0.2 }));
    c.add(box(0.07, 0.5, 0.07, 0x41291a, { x: -0.22, y: 0.25, z: 0.2 }));
    c.add(box(0.07, 0.5, 0.07, 0x41291a, { x: 0.22, y: 0.25, z: 0.2 }));
    c.add(box(0.55, 0.7, 0.07, 0x4f3620, { y: 0.9, z: -0.22 }));
    return c;
  }
  const chairZhang = chair(); chairZhang.position.set(0.8, 0, 1.65); chairZhang.rotation.y = Math.PI;
  const chairColl = chair(); chairColl.position.set(0.8, 0, -0.45);
  const chairWork = chair(); chairWork.position.set(-2.9, 0, -1.7); chairWork.rotation.y = Math.PI;
  group.add(chairZhang, chairColl, chairWork);

  // teapot + cups
  const teapot = new THREE.Group();
  teapot.add(box(0.22, 0.18, 0.22, 0x7a4a3a, { y: 0.09 }));
  teapot.add(box(0.08, 0.06, 0.14, 0x7a4a3a, { x: 0.16, y: 0.1 }));
  teapot.add(box(0.05, 0.14, 0.05, 0x6a3f31, { x: -0.14, y: 0.1 }));
  teapot.position.set(0.45, 0.76, 0.5);
  group.add(teapot);
  const cupZ = box(0.11, 0.09, 0.11, 0xd8d0c0, { x: 0.85, y: 0.81, z: 1.0 });
  const cupC = box(0.11, 0.09, 0.11, 0xd8d0c0, { x: 0.85, y: 0.81, z: 0.15 });
  group.add(cupZ, cupC);
  const teaStream = box(0.02, 0.3, 0.02, 0xc8a25a, { shadow: false });
  teaStream.visible = false;
  group.add(teaStream);

  // tray with three iron meteorites (the deal)
  const tray = new THREE.Group();
  tray.add(box(0.8, 0.05, 0.5, 0x6a5138, { y: 0.025 }));
  const ironMat = mat(0x565b63, 0.35, 0.9);
  const stonePos: Array<[number, number]> = [[-0.24, 0], [0, 0.05], [0.24, -0.03]];
  for (const [sx, sz] of stonePos) {
    const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.17), ironMat);
    s1.position.set(sx, 0.12, sz); s1.rotation.y = sx * 5; s1.castShadow = true;
    const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.12), ironMat);
    s2.position.set(sx + 0.04, 0.21, sz - 0.02); s2.rotation.y = 0.7; s2.castShadow = true;
    tray.add(s1, s2);
  }
  tray.position.set(0.8, 0.76, 0.6);
  tray.visible = false;
  group.add(tray);

  // phone
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.02), emissive(0xbfe3ff, 1.4));
  phone.visible = false;
  group.add(phone);

  /* ---------------- hanging lamp ---------------- */
  group.add(box(0.03, 0.9, 0.03, 0x1a1a1a, { x: 0.8, y: 3.7, z: 0.6, shadow: false }));
  const shade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.5), emissive(0xffd9a0, 2.6));
  shade.position.set(0.8, 3.2, 0.6);
  group.add(shade);
  const keyLight = new THREE.PointLight(0xffc887, 24, 12, 2);
  keyLight.position.set(0.8, 3.0, 0.6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.004;
  group.add(keyLight);
  const deskLight = new THREE.PointLight(0xffe2b0, 7, 5, 2);
  deskLight.position.set(-3.4, 1.6, -2.7);
  group.add(deskLight);
  const amb = new THREE.AmbientLight(0x604a33, 0.55);
  group.add(amb);

  /* ---------------- characters ---------------- */
  const zhang = makeHuman({ face: "stern", shirt: 0x3d564b, sleeve: 0x3d564b, pants: 0x23282e, hair: "#1a1a1a", skin: "#c98f66" });
  const coll = makeHuman({ face: "kind", shirt: 0x6b5136, sleeve: 0x6b5136, pants: 0x3c342c, hair: "#8f8a80", skin: "#d9a077" });
  group.add(zhang.group, coll.group);

  // magnifier in collector hand (early scene)
  const magnifier = new THREE.Group();
  magnifier.add(box(0.03, 0.14, 0.03, 0x222222, { y: -0.07 }));
  magnifier.add(box(0.14, 0.14, 0.02, 0x888888, { y: 0.06 }));
  magnifier.visible = false;
  group.add(magnifier);

  /* ---------------- animation ---------------- */
  function walk(h: Human, phase: number, amp = 0.5): void {
    h.legL.rotation.x = Math.sin(phase) * amp;
    h.legR.rotation.x = -Math.sin(phase) * amp;
    h.armL.rotation.x = -Math.sin(phase) * amp * 0.4;
    h.armR.rotation.x = Math.sin(phase) * amp * 0.4;
    h.armL.rotation.z = 0.06;
    h.armR.rotation.z = -0.06;
  }
  function idle(h: Human, t: number): void {
    h.armL.rotation.set(0.05 * Math.sin(t * 0.8), 0, 0.07);
    h.armR.rotation.set(-0.05 * Math.sin(t * 0.8), 0, -0.07);
    h.legL.rotation.x = 0; h.legR.rotation.x = 0;
  }

  const Z_DOOR = new THREE.Vector3(4.2, 0, -3.9);
  const Z_TEA = new THREE.Vector3(0.8, 0, 1.35);
  const C_WORK = new THREE.Vector3(-2.9, 0, -1.75);
  const C_CAB = new THREE.Vector3(1.6, 0, -3.6);
  const C_TEA = new THREE.Vector3(0.8, 0, -0.15);

  function frame(t: number): void {
    /* ---- Zhang ---- */
    if (t < 9.2) {
      zhang.group.visible = false;
    } else if (t < 30) {
      zhang.group.visible = true;
      // walk in: door -> tea table area (9.2 - 14.5), then idle standing
      const k = env(t, 9.2, 14.5);
      zhang.group.position.lerpVectors(Z_DOOR, new THREE.Vector3(1.6, 0, 0.2), k);
      zhang.group.rotation.y = Math.PI + (1 - k) * 0.6;
      if (k < 1) walk(zhang, t * 6.5);
      else {
        idle(zhang, t);
        zhang.group.rotation.y = Math.PI * 0.92; // facing collector
      }
      zhang.head.rotation.x = nod(t, 19.6) + nod(t, 52.2);
      zhang.head.rotation.y = Math.sin(t * 0.3) * 0.08;
    } else if (t < 56) {
      // seated at tea table
      zhang.group.visible = true;
      zhang.group.position.set(0.8, -0.28, 1.45);
      zhang.group.rotation.y = Math.PI;
      sitPose(zhang);
      zhang.armL.rotation.set(-0.5, 0, 0.25);
      // raises cup while speaking line v04 (32-38)
      const cupK = env(t, 32.5, 33.5) * (1 - env(t, 37.5, 39));
      zhang.armR.rotation.set(-0.6 - cupK * 0.7, 0, -0.2 - cupK * 0.2);
      zhang.head.rotation.x = nod(t, 32.2) + nod(t, 52.2);
      zhang.head.rotation.y = Math.sin(t * 0.3) * 0.06;
      cupZ.position.set(0.85 - cupK * 0.15, 0.81 + cupK * 0.55, 1.0 + cupK * 0.3);
    } else {
      // stands up at 58, watches, pays with phone 66-69.5
      zhang.group.visible = true;
      const stand = env(t, 57.8, 59.2);
      zhang.group.position.set(1.35, -0.28 * (1 - stand), 1.5);
      zhang.group.rotation.y = Math.PI * (1 - stand * 0.15);
      sitPose(zhang);
      zhang.legL.rotation.x *= (1 - stand); zhang.legR.rotation.x *= (1 - stand);
      idle(zhang, t);
      const ph = env(t, 65.8, 66.6) * (1 - env(t, 69.2, 70.2));
      zhang.armR.rotation.set(-1.15 * ph - 0.05, 0, -0.15 * ph);
      phone.visible = ph > 0.05;
      phone.position.set(1.42 - 0.1 * ph, 1.0 + 0.35 * ph, 1.32 - 0.28 * ph);
      phone.rotation.set(-0.5, 0.2, 0);
      zhang.head.rotation.x = nod(t, 57.7) + nod(t, 66.2) + nod(t, 72.7) - ph * 0.15;
      cupZ.position.set(0.85, 0.81, 1.0);
    }

    /* ---- Collector ---- */
    if (t < 9.2) {
      // seated at work table with magnifier
      coll.group.visible = true;
      coll.group.position.copy(C_WORK);
      coll.group.rotation.y = Math.PI;
      sitPose(coll);
      coll.armR.rotation.set(-1.5, 0, -0.3);
      coll.armL.rotation.set(-0.4, 0, 0.2);
      coll.head.rotation.x = 0.35;
      magnifier.visible = true;
      magnifier.position.set(-2.75, 1.35, -1.98);
      magnifier.rotation.x = 0.5;
    } else if (t < 11.5) {
      // stands to greet
      const k = env(t, 9.2, 10.4);
      coll.group.position.set(C_WORK.x + k * 0.6, -0.28 * (1 - k), C_WORK.z + k * 0.75);
      coll.group.rotation.y = Math.PI * (1 - k * 0.35);
      sitPose(coll);
      coll.legL.rotation.x *= (1 - k); coll.legR.rotation.x *= (1 - k);
      coll.armR.rotation.set(-1.5 * (1 - k), 0, -0.3);
      magnifier.visible = k < 0.6;
      magnifier.position.set(-2.75 + k * 0.6, 1.35 - k * 0.5, -1.98 + k * 0.8);
    } else if (t < 30) {
      // standing, talking + gesture toward collection
      coll.group.position.set(-2.3, 0, -1.0);
      coll.group.rotation.y = Math.PI * 0.72 + Math.sin(t * 0.2) * 0.05;
      idle(coll, t);
      // welcoming wave at greeting, expansive gesture at "外星世界" (26-29)
      const wave = env(t, 11.5, 12.2) * (1 - env(t, 13.2, 14));
      coll.armR.rotation.x = -0.4 - wave * 1.2 + Math.sin(t * 5) * 0.12 * wave;
      const gK = env(t, 25.5, 26.3) * (1 - env(t, 28.8, 29.6));
      coll.armL.rotation.set(-0.9 * gK + coll.armL.rotation.x * (1 - gK), 0, 0.25 + gK * 0.5);
      coll.head.rotation.x = nod(t, 12.6) + nod(t, 22.6);
      coll.head.rotation.y = 0.15 * Math.sin(t * 0.4);
    } else if (t < 56) {
      // seated at tea table, pours tea 36-38.5
      coll.group.position.set(0.8, -0.28, -0.25);
      coll.group.rotation.y = 0;
      sitPose(coll);
      coll.armL.rotation.set(-0.5, 0, 0.25);
      const pour = env(t, 35.8, 36.6) * (1 - env(t, 37.9, 38.6));
      coll.armR.rotation.set(-0.75 - pour * 0.25, 0, -0.3);
      coll.head.rotation.x = nod(t, 39.2) + nod(t, 47.2) + pour * 0.25;
      coll.head.rotation.y = Math.sin(t * 0.35) * 0.06;
      // teapot follows hand while pouring
      if (pour > 0.02) {
        teapot.position.set(0.72, 0.76 + pour * 0.5, 0.62 + pour * 0.3);
        teapot.rotation.z = -pour * 0.7;
        teaStream.visible = pour > 0.5;
        teaStream.position.set(0.83, 0.98, 0.96);
        teaStream.scale.y = (pour - 0.5) * 2;
      } else {
        teapot.position.set(0.45, 0.76, 0.5);
        teapot.rotation.z = 0;
        teaStream.visible = false;
      }
    } else {
      // the deal: walk to cabinet, fetch tray, return
      const toCab = env(t, 56.2, 59);
      const back = env(t, 61.8, 63.6);
      coll.group.position.lerpVectors(C_TEA, C_CAB, Math.min(toCab, 1));
      if (back > 0) coll.group.position.lerpVectors(C_CAB, new THREE.Vector3(0.2, 0, -0.4), back);
      coll.group.rotation.y = toCab < 1 ? Math.PI * toCab : (back > 0 ? back * 0.85 : Math.PI * 0.97);
      const walking = (toCab > 0 && toCab < 1) || (back > 0 && back < 1);
      if (walking) walk(coll, t * 6);
      else idle(coll, t);
      // reach into cabinet
      const reach = env(t, 59.6, 60.4) * (1 - env(t, 61.6, 62.2));
      coll.armR.rotation.x = -1.3 * reach + coll.armR.rotation.x * (1 - reach);
      // carry tray back
      const carry = env(t, 62.2, 62.8) * (1 - env(t, 63.6, 64.2));
      if (carry > 0) { coll.armL.rotation.x = -0.85; coll.armR.rotation.x = -0.85; }
      tray.visible = t > 62.4;
      if (t > 62.4 && t < 64.2) {
        const p = coll.group.position;
        tray.position.set(p.x + Math.sin(coll.group.rotation.y) * 0.45, 1.0, p.z + Math.cos(coll.group.rotation.y) * 0.45);
      } else if (t >= 64.2) {
        tray.position.set(0.8, 0.76, 0.6);
      }
      coll.head.rotation.x = nod(t, 60.6) + nod(t, 69.6) + env(t, 63.8, 64.4) * 0.3;
      coll.head.rotation.y = Math.sin(t * 0.35) * 0.05;
      teaStream.visible = false;
      teapot.position.set(0.45, 0.76, 0.5);
    }

    // subtle lamp flicker (old house)
    keyLight.intensity = 24 + Math.sin(t * 13.7) * 0.5 + Math.sin(t * 31.3) * 0.3;
  }

  /* ---------------- cameras ---------------- */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  function dolly(a: THREE.Vector3, b: THREE.Vector3, t: number, t0: number, t1: number): THREE.Vector3 {
    return a.clone().lerp(b, THREE.MathUtils.smoothstep(t, t0, t1));
  }

  function setCamera(cam: THREE.PerspectiveCamera, setup: string, t: number): void {
    let pos: THREE.Vector3; let look: THREE.Vector3;
    switch (setup) {
      case "enter-wide":
        pos = dolly(V(4.9, 2.3, 4.6), V(4.3, 2.1, 3.9), t, 9, 30);
        look = V(-0.8, 1.3, -1.8);
        break;
      case "greet-med":
        pos = dolly(V(3.5, 1.9, 3.7), V(3.2, 1.85, 3.4), t, 9, 30);
        look = V(-0.6, 1.25, -1.2);
        break;
      case "tea-wide":
        pos = dolly(V(3.6, 2.0, 3.4), V(3.2, 1.85, 3.0), t, 30, 56);
        look = V(0.7, 1.0, 0.5);
        break;
      case "over-zhang": // over Zhang's shoulder to collector
        pos = V(0.15, 1.62, 2.55);
        look = V(0.85, 1.25, -0.3);
        break;
      case "over-coll": // over collector's shoulder to Zhang
        pos = V(1.55, 1.6, -1.25);
        look = V(0.75, 1.2, 1.5);
        break;
      case "cabinet-med":
        pos = dolly(V(3.6, 1.9, -0.9), V(3.2, 1.8, -1.2), t, 56, 78);
        look = V(1.0, 1.2, -3.6);
        break;
      case "stones-close":
        pos = dolly(V(-0.25, 1.62, 2.0), V(-0.1, 1.55, 1.85), t, 56, 78);
        look = V(0.82, 0.72, 0.52);
        break;
      case "pay-med":
        pos = V(3.0, 1.75, 0.9);
        look = V(0.4, 1.05, 0.5);
        break;
      default:
        pos = V(3.6, 2.0, 3.4); look = V(0.7, 1.0, 0.5);
    }
    cam.position.copy(pos);
    cam.lookAt(look);
  }

  return { group, frame, setCamera };
}
