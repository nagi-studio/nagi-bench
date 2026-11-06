// 场景搭建：静态建筑 + 与物理刚体一一对应的可动部件
import * as THREE from 'three';
import { Builder, addGear, quatFromY, mat } from './geo.js';
import { makeMaterials, placardTexture } from './materials.js';
import { WHEEL, LEVER, WATER, SHAFT, JILUN, GLOBE, ARMILLARY, POLAR, SOUTH, STRIKER, CELESTIAL } from '../sim/layout.js';

const V3 = (a) => new THREE.Vector3(...a);
const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 生成与刚体绑定的组：几何按世界坐标建模，再整体偏移到刚体初始位置 */
function bodyGroup(body, build, ref) {
  const g = new THREE.Group();
  const inner = new THREE.Group();
  // ref：刚体在"零姿态"（单位四元数）时的位置；几何体按该姿态建模
  const r = ref || [body.position.x, body.position.y, body.position.z];
  inner.position.set(-r[0], -r[1], -r[2]);
  g.add(inner);
  const b = new Builder();
  build(b);
  b.merge(inner);
  g.userData.body = body;
  syncGroup(g);
  return g;
}

function syncGroup(g) {
  const b = g.userData.body;
  g.position.set(b.position.x, b.position.y, b.position.z);
  g.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
}

/** 带自发光的材质副本，用于"正在动作"的高亮 */
function glowCopy(m, color = 0x8a4a12) {
  const c = m.clone();
  c.emissive = new THREE.Color(color);
  c.emissiveIntensity = 0;
  c.userData.baseEmissive = 0;
  return c;
}

export function buildWorld(scene, sim) {
  const M = makeMaterials();
  const dyn = []; // 需同步的组
  const glow = {}; // 高亮材质
  const anchors = {}; // 标签锚点（世界坐标）
  const [wx, wy] = WHEEL.center;

  // ================= 天空、地面 =================
  {
    const starGeo = new THREE.BufferGeometry();
    const N = 2600;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    let s = 12345;
    const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < N; i++) {
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const y = Math.abs(u) * 0.95 + 0.05;
      const rr = Math.sqrt(1 - y * y);
      const R = 90;
      pos.set([R * rr * Math.cos(th), R * y, R * rr * Math.sin(th)], i * 3);
      const w = 0.55 + r() * 0.45;
      const tint = r();
      col.set([w * (tint > 0.85 ? 1 : 0.85), w * 0.9, w * (tint < 0.15 ? 0.7 : 1)], i * 3);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9, fog: false }));
    scene.add(stars);
    // 银河：一条淡淡的星带
    const mw = new THREE.BufferGeometry();
    const NM = 3000;
    const mp = new Float32Array(NM * 3);
    for (let i = 0; i < NM; i++) {
      const t = r() * Math.PI * 2;
      const off = (r() + r() + r() - 1.5) * 0.18;
      const v = new THREE.Vector3(Math.cos(t), Math.sin(t) * 0.35 + 0.55 + off, Math.sin(t) * 0.9 + off).normalize().multiplyScalar(88);
      if (v.y < 3) v.y = 3 + r() * 6;
      mp.set([v.x, v.y, v.z], i * 3);
    }
    mw.setAttribute('position', new THREE.BufferAttribute(mp, 3));
    scene.add(new THREE.Points(mw, new THREE.PointsMaterial({ size: 1.0, sizeAttenuation: false, color: 0x9fb4e6, transparent: true, opacity: 0.35, fog: false })));
    // 月亮
    const moon = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff1c8, fog: false }));
    moon.position.set(-62, 30, -30);
    scene.add(moon);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(5.5, 24, 16), new THREE.MeshBasicMaterial({ color: 0x8090c0, transparent: true, opacity: 0.12, fog: false, depthWrite: false }));
    halo.position.copy(moon.position);
    scene.add(halo);

    const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), M.stone.clone());
    ground.material.map = M.stone.map.clone();
    ground.material.map.repeat.set(24, 24);
    ground.material.map.needsUpdate = true;
    ground.material.color = new THREE.Color(0x6a6660);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  // ================= 静态建筑 =================
  const S = new Builder();
  // 台基
  S.box(9.6, 0.3, 5.4, M.stone, [2.0, -0.15, -0.9]);
  S.box(10.2, 0.08, 6.0, M.stone, [2.0, -0.26, -0.9]);
  // 台阶
  for (let i = 0; i < 3; i++) S.box(2.0, 0.1, 0.35, M.stone, [-0.5, -0.25 + i * 0.1 - 0.0, 2.05 - i * 0.3]);

  // ---- 退水壶（承接倒出的水）----
  const sp = sim.sump;
  S.box(sp.x1 - sp.x0 + 0.2, 0.06, 0.72, M.woodDark, [(sp.x0 + sp.x1) / 2, sp.y - 0.03, 0]);
  S.box(sp.x1 - sp.x0 + 0.2, 0.42, 0.05, M.woodDark, [(sp.x0 + sp.x1) / 2, sp.y + 0.18, -0.36]);
  S.box(0.06, 0.42, 0.72, M.woodDark, [sp.x0 - 0.05, sp.y + 0.18, 0]);
  S.box(0.06, 0.42, 0.72, M.woodDark, [sp.x1 + 0.05, sp.y + 0.18, 0]);
  S.box(sp.x1 - sp.x0 + 0.2, 0.16, 0.05, M.woodDark, [(sp.x0 + sp.x1) / 2, sp.y + 0.05, 0.36]);
  anchors.sump = [sp.x1 - 0.5, sp.y + 0.35, 0.3];

  // ---- 枢轮机架 ----
  const frameZ = [-0.42, 0.68];
  for (const z of frameZ) {
    S.beam([wx - 0.25, 0, z], [wx, wy, z], 0.12, 0.12, M.woodDark);
    S.beam([wx + 0.25, 0, z], [wx, wy, z], 0.12, 0.12, M.woodDark);
    S.box(0.24, 0.16, 0.16, M.iron, [wx, wy, z]);
  }
  // 天柱轴承架
  const TZ = SHAFT.tianzhu;
  for (const y of [0.45, 1.6, 3.2, 4.6, 6.2, 7.2]) {
    S.box(0.16, 0.08, 0.16, M.iron, [TZ.x, y, TZ.z]);
    S.beam([TZ.x, y, TZ.z], [TZ.x, y, TZ.z - 0.75], 0.06, 0.06, M.woodDark);
  }
  S.box(0.12, 7.6, 0.12, M.woodDark, [TZ.x, 3.8, TZ.z - 0.8]);
  // 横轴轴承
  for (const x of [0.5, 1.6, 2.5]) {
    S.box(0.1, 0.6, 0.1, M.woodDark, [x, 0.3, SHAFT.L1.z]);
    S.box(0.14, 0.08, 0.14, M.iron, [x, SHAFT.L1.y, SHAFT.L1.z]);
  }

  // ---- 水路：天池 → 平水壶 → 渴乌（注水管） ----
  const nz = sim.nozzle;
  const tianchi = { x: 5.55, y: 4.55, w: 1.1, h: 0.62, d: 0.9 };
  const pingshui = { x: 4.88, y: 3.86, w: 0.56, h: 0.42, d: 0.5 };
  const tank = (t, waterLevel) => {
    const { x, y, w, h, d } = t;
    S.box(w, 0.05, d, M.wood, [x, y - h / 2, 0]);
    S.box(w, h, 0.05, M.wood, [x, y, -d / 2]);
    S.box(0.05, h, d, M.wood, [x - w / 2, y, 0]);
    S.box(0.05, h, d, M.wood, [x + w / 2, y, 0]);
    S.box(w, h * 0.35, 0.05, M.wood, [x, y - h * 0.325, d / 2]); // 前板截短（剖面）
    for (const sx of [-1, 1]) S.box(0.07, h + 0.04, 0.07, M.woodDark, [x + (sx * w) / 2, y, d / 2]);
    const surf = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, d - 0.06), M.waterSurface);
    surf.rotation.x = -Math.PI / 2;
    surf.position.set(x, y - h / 2 + waterLevel, 0);
    scene.add(surf);
    const body = new THREE.Mesh(new THREE.BoxGeometry(w - 0.06, waterLevel - 0.03, d - 0.08), M.water);
    body.position.set(x, y - h / 2 + 0.025 + (waterLevel - 0.03) / 2, 0);
    scene.add(body);
    return surf;
  };
  const tcSurf = tank(tianchi, 0.48);
  const psSurf = tank(pingshui, 0.3);
  // 支架
  for (const [x, z] of [
    [tianchi.x - 0.5, -0.4],
    [tianchi.x + 0.5, -0.4],
    [tianchi.x - 0.5, 0.4],
    [tianchi.x + 0.5, 0.4],
  ])
    S.box(0.1, tianchi.y - tianchi.h / 2 + 0.3, 0.1, M.woodDark, [x, (tianchi.y - tianchi.h / 2 - 0.3) / 2, z]);
  S.box(0.08, pingshui.y - pingshui.h / 2 - 1.3, 0.08, M.woodDark, [pingshui.x + 0.2, (pingshui.y - pingshui.h / 2 + 1.3) / 2, -0.22]);
  // 天池 → 平水壶 的出水管
  S.rod([tianchi.x - 0.45, tianchi.y - 0.2, 0.1], [pingshui.x + 0.16, pingshui.y + 0.28, 0.1], 0.035, M.bronzeDark);
  // 平水壶溢流管（保持水位恒定）
  S.rod([pingshui.x + 0.26, pingshui.y + 0.05, -0.1], [pingshui.x + 0.5, pingshui.y - 0.9, -0.1], 0.025, M.bronzeDark);
  // 渴乌（虹吸注水管）：从壶中弯出，落到受水壶上方
  {
    const pts = [
      [pingshui.x - 0.12, pingshui.y - 0.05, 0],
      [pingshui.x - 0.12, pingshui.y + 0.32, 0],
      [pingshui.x - 0.33, pingshui.y + 0.38, 0],
      [nz[0], pingshui.y + 0.2, 0],
      [nz[0], nz[1] + 0.06, 0],
    ];
    for (let i = 0; i < pts.length - 1; i++) S.rod(pts[i], pts[i + 1], 0.03, M.bronze);
    for (const p of pts) S.sphere(0.034, M.bronze, p, 10);
    S.cyl(0.045, 0.035, 0.06, M.bronze, [nz[0], nz[1] + 0.04, 0]);
  }
  anchors.tianchi = [tianchi.x, tianchi.y + 0.4, 0.2];
  anchors.pingshui = [pingshui.x + 0.05, pingshui.y + 0.32, 0.25];
  anchors.nozzle = [nz[0] - 0.05, nz[1] + 0.12, 0.05];

  // ---- 枢衡支座 ----
  const LV = sim.lever;
  S.box(0.14, LV.pivot[1], 0.14, M.woodDark, [LV.pivot[0], LV.pivot[1] / 2, LEVER.padZ - 0.2]);
  S.box(0.2, 0.2, 0.08, M.iron, [LV.pivot[0], LV.pivot[1], LEVER.padZ - 0.14]);

  // ---- 木阁（五层报时楼）----
  const ge = { x0: -1.55, x1: 0.55, zf: 0.1, zb: -2.1 };
  const floors = [0.25, 1.27, 2.07, 2.87, 3.6, 4.3];
  for (const y of floors) {
    S.box(ge.x1 - ge.x0 + 0.3, 0.07, 0.12, M.lacquer, [(ge.x0 + ge.x1) / 2, y, ge.zf]);
    S.box(ge.x1 - ge.x0 + 0.2, 0.05, ge.zf - ge.zb, M.woodDark, [(ge.x0 + ge.x1) / 2, y - 0.04, (ge.zf + ge.zb) / 2]);
  }
  for (const x of [ge.x0, -1.02, 0.02, ge.x1]) {
    S.box(0.1, floors[5], 0.1, M.lacquer, [x, floors[5] / 2, ge.zf]);
    S.box(0.1, floors[5], 0.1, M.lacquer, [x, floors[5] / 2, ge.zb]);
  }
  // 楼层之间的门窗格扇（两侧），中间留出报时窗口
  for (let i = 0; i < 5; i++) {
    const y0 = floors[i];
    const y1 = floors[i + 1];
    const yc = (y0 + y1) / 2;
    for (const [xa, xb] of [
      [ge.x0, -1.02],
      [0.02, ge.x1],
    ]) {
      // 剖面：右侧第 2~4 层的格扇拆去，露出里面的机轮与拨牙
      if (xa > 0 && i >= 1 && i <= 3) continue;
      S.box(xb - xa - 0.1, y1 - y0 - 0.12, 0.03, M.woodLight, [(xa + xb) / 2, yc, ge.zf - 0.03]);
      for (let k = 1; k < 4; k++) S.box(0.02, y1 - y0 - 0.12, 0.05, M.woodDark, [xa + ((xb - xa) * k) / 4, yc, ge.zf - 0.01]);
      S.box(xb - xa - 0.1, 0.02, 0.05, M.woodDark, [(xa + xb) / 2, yc, ge.zf - 0.01]);
    }
    // 窗口上方的楣额
    S.box(1.04, 0.1, 0.06, M.lacquer, [-0.5, y1 - 0.08, ge.zf + 0.02]);
    if (i === 0) S.box(1.0, y1 - y0 - 0.15, 0.04, M.woodLight, [-0.5, yc, ge.zf - 0.03]);
    if (i === 4) S.box(1.0, y1 - y0 - 0.15, 0.04, M.woodLight, [-0.5, yc, ge.zf - 0.03]);
    // 平座栏杆
    if (i >= 1 && i <= 3) {
      S.box(1.04, 0.04, 0.42, M.woodDark, [-0.5, y0 + 0.02, ge.zf + 0.21]);
      S.box(1.04, 0.035, 0.035, M.lacquer, [-0.5, y0 + 0.24, ge.zf + 0.42]);
      for (let k = 0; k <= 6; k++) S.box(0.025, 0.24, 0.025, M.lacquer, [-1.02 + (1.04 * k) / 6, y0 + 0.12, ge.zf + 0.42]);
    }
  }
  // 木阁屋顶（歇山式简化）
  const roof = (cx, cz, w, d, y, h, over = 0.45) => {
    S.box(w + over * 2, 0.12, d + over * 2, M.lacquer, [cx, y, cz]);
    const slope = new THREE.Shape();
    slope.moveTo(-(w / 2 + over), 0);
    slope.quadraticCurveTo(-(w / 4), h * 0.25, -w * 0.18, h);
    slope.lineTo(w * 0.18, h);
    slope.quadraticCurveTo(w / 4, h * 0.25, w / 2 + over, 0);
    slope.lineTo(-(w / 2 + over), 0);
    const geom = new THREE.ExtrudeGeometry(slope, { depth: d + over * 2, bevelEnabled: false });
    geom.translate(0, 0, -(d + over * 2) / 2);
    S.add(geom, M.tile, mat([cx, y + 0.06, cz]));
    S.box(w * 0.36 + 0.2, 0.1, 0.12, M.tile, [cx, y + h + 0.1, cz]);
  };
  roof(-0.5, (ge.zf + ge.zb) / 2, ge.x1 - ge.x0, ge.zf - ge.zb, floors[5] + 0.05, 0.55);
  anchors.mujia = [-1.3, 3.9, 0.35];

  // ---- 中层（浑象室）与顶层（浑仪台）----
  const up = { x0: -0.65, x1: 3.55, z0: -3.0, z1: -0.15 };
  const midFloor = 4.4;
  const topDeck = 6.95;
  S.box(up.x1 - up.x0, 0.1, up.z1 - up.z0, M.woodDark, [(up.x0 + up.x1) / 2, midFloor, (up.z0 + up.z1) / 2]);
  S.box(up.x1 - up.x0 + 0.3, 0.14, up.z1 - up.z0 + 0.3, M.lacquer, [(up.x0 + up.x1) / 2, topDeck, (up.z0 + up.z1) / 2]);
  for (const x of [up.x0, 1.45, up.x1])
    for (const z of [up.z0, up.z1]) {
      S.box(0.14, topDeck - midFloor, 0.14, M.lacquer, [x, (topDeck + midFloor) / 2, z]);
      S.box(0.16, midFloor, 0.16, M.lacquer, [x, midFloor / 2, z]);
    }
  // 后墙（灰白壁）
  S.box(up.x1 - up.x0, topDeck - midFloor, 0.06, M.plaster, [(up.x0 + up.x1) / 2, (topDeck + midFloor) / 2, up.z0 + 0.04]);
  // 斗拱示意
  for (const x of [up.x0, 1.45, up.x1]) S.box(0.42, 0.14, 0.42, M.woodLight, [x, topDeck - 0.12, up.z1]);
  // 顶层栏杆
  for (const z of [up.z0 - 0.1, up.z1 + 0.1]) {
    S.box(up.x1 - up.x0 + 0.2, 0.04, 0.04, M.lacquer, [(up.x0 + up.x1) / 2, topDeck + 0.42, z]);
    for (let k = 0; k <= 16; k++) S.box(0.03, 0.36, 0.03, M.lacquer, [up.x0 - 0.1 + ((up.x1 - up.x0 + 0.2) * k) / 16, topDeck + 0.24, z]);
  }
  // 浑象的地柜（浑象一半藏在柜中，柜面即地平）
  const G = GLOBE.center;
  S.box(1.9, 0.08, 1.9, M.lacquer, [G[0], G[1], G[2]]);
  S.box(1.8, G[1] - midFloor - 0.04, 0.06, M.woodLight, [G[0], (G[1] + midFloor) / 2, G[2] + 0.92]);
  S.box(0.06, G[1] - midFloor - 0.04, 1.8, M.woodLight, [G[0] - 0.92, (G[1] + midFloor) / 2, G[2]]);
  // 浑仪的固定环：地平环、子午环、赤道环 + 龙柱
  const A = ARMILLARY.center;
  const AR = ARMILLARY.radius;
  S.torus(AR, 0.028, M.bronze, A, new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), 96);
  S.torus(AR - 0.02, 0.026, M.bronze, A, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)), 96);
  S.torus(AR - 0.06, 0.022, M.bronzeDark, A, new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), V3(POLAR)), 96);
  for (const [dx, dz] of [
    [-0.7, -0.7],
    [0.7, -0.7],
    [-0.7, 0.7],
    [0.7, 0.7],
  ]) {
    S.rod([A[0] + dx, topDeck, A[2] + dz], [A[0] + dx * 0.92, A[1] - 0.05, A[2] + dz * 0.92], 0.045, M.bronzeDark);
  }
  S.box(0.5, 0.3, 0.5, M.stone, [A[0], topDeck + 0.15, A[2]]);
  S.rod([A[0], topDeck + 0.3, A[2]], [A[0], A[1] - AR, A[2]], 0.06, M.bronzeDark);

  // 灯笼（暖光源的可见实体）
  const lanternPos = [
    [-1.85, 3.9, 0.55],
    [0.85, 3.9, 0.55],
    [1.0, 6.4, -0.3],
  ];
  for (const p of lanternPos) {
    S.cyl(0.11, 0.11, 0.24, M.clothRed, p, null, 12);
    S.rod([p[0], p[1] + 0.12, p[2]], [p[0], p[1] + 0.4, p[2]], 0.01, M.black, 4);
  }
  S.merge(scene);
  // 灯笼发光
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffb060, transparent: true, opacity: 0.8 });
  for (const p of lanternPos) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.18, 12), lanternMat);
    l.position.set(...p);
    scene.add(l);
  }

  // ================= 枢轮 =================
  const wheelB = sim.wheel.body;
  const wheelGlow = glowCopy(M.wood, 0x6a3a10);
  const pinGlow = glowCopy(M.iron, 0xb06a20);
  glow.wheel = wheelGlow;
  glow.pins = pinGlow;
  const wheelG = bodyGroup(wheelB, (b) => {
    const C = [wx, wy];
    b.cyl(0.075, 0.075, 1.36, M.iron, [wx, wy, -0.1], new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)));
    b.cyl(0.24, 0.24, 0.5, wheelGlow, [wx, wy, 0], new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), 20);
    for (const z of [-0.22, 0.22]) {
      b.torus(WHEEL.rPivot, 0.035, wheelGlow, [wx, wy, z], null, 80);
      b.torus(0.6, 0.03, wheelGlow, [wx, wy, z], null, 48);
    }
    b.torus(WHEEL.rPin, 0.03, wheelGlow, [wx, wy, WHEEL.pinZ - 0.05], null, 96);
    for (let i = 0; i < WHEEL.n; i++) {
      const th = sim.wheel.phase0 + i * WHEEL.pitch;
      const d = [Math.sin(th), Math.cos(th)];
      for (const z of [-0.22, 0.22]) b.beam([C[0] + d[0] * 0.2, C[1] + d[1] * 0.2, z], [C[0] + d[0] * (WHEEL.rPivot + 0.03), C[1] + d[1] * (WHEEL.rPivot + 0.03), z], 0.06, 0.05, wheelGlow);
      // 壶铰轴
      b.rod([C[0] + d[0] * WHEEL.rPivot, C[1] + d[1] * WHEEL.rPivot, -0.24], [C[0] + d[0] * WHEEL.rPivot, C[1] + d[1] * WHEEL.rPivot, 0.24], 0.018, M.iron, 6);
      // 前方辐条：伸到销圈
      const tp = th - sim.wheel.pinLag;
      const e = [Math.sin(tp), Math.cos(tp)];
      b.beam([C[0] + e[0] * 0.2, C[1] + e[1] * 0.2, WHEEL.pinZ - 0.05], [C[0] + e[0] * (WHEEL.rPin + 0.02), C[1] + e[1] * (WHEEL.rPin + 0.02), WHEEL.pinZ - 0.05], 0.045, 0.04, wheelGlow);
      b.rod([C[0] + e[0] * WHEEL.rPin, C[1] + e[1] * WHEEL.rPin, WHEEL.pinZ - 0.08], [C[0] + e[0] * WHEEL.rPin, C[1] + e[1] * WHEEL.rPin, WHEEL.pinZ + 0.06], WHEEL.pinR, pinGlow, 10);
    }
    b.cyl(0.24, 0.24, 0.06, wheelGlow, [wx, wy, WHEEL.pinZ - 0.05], new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), 20);
    // 地毂：枢轮轴后端的伞齿
    addGear(b, { kind: 'bevel', teeth: 16, r: SHAFT.wheelBevelR, width: 0.06, toothH: 0.06, center: [wx, wy, SHAFT.wheelBevelZ], axis: [0, 0, -1], meshDir: [0, -1, 0], material: M.bronze });
  });
  scene.add(wheelG);
  dyn.push(wheelG);
  anchors.wheel = [wx - 0.95, wy + 0.45, 0.6];
  anchors.dihu = [wx, wy - 0.15, SHAFT.wheelBevelZ - 0.05];

  // ================= 受水壶 =================
  const cupGlow = glowCopy(M.woodLight, 0x60c0ff);
  glow.cup = cupGlow;
  const fillCupGlow = glowCopy(M.woodLight, 0x7fd0ff);
  glow.fillCup = fillCupGlow;
  const cupFront = M.glass;
  sim.buckets.forEach((bk, idx) => {
    const g = bodyGroup(bk.body, (b) => {
      const th = bk.th;
      const d = [Math.sin(th), Math.cos(th)];
      const hinge = [wx + d[0] * WHEEL.rPivot, wy + d[1] * WHEEL.rPivot];
      const cup = [wx + d[0] * WHEEL.rCup, wy + d[1] * WHEEL.rCup];
      const bal = [wx + d[0] * WHEEL.rBalance, wy + d[1] * WHEEL.rBalance];
      const lug = [wx + d[0] * WHEEL.rLug, wy + d[1] * WHEEL.rLug];
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), bk.gamma);
      const cm = idx === sim.fillIndex ? fillCupGlow : cupGlow;
      const L = (lx, ly) => new THREE.Vector3(lx, ly, 0).applyQuaternion(q).add(new THREE.Vector3(cup[0], cup[1], 0));
      const hw = WHEEL.inner / 2 + WHEEL.wall;
      const zt = WHEEL.halfZ + WHEEL.wall;
      b.box(hw * 2, WHEEL.wall, zt * 2, cm, L(0, -WHEEL.depth / 2), q);
      b.box(WHEEL.wall, WHEEL.depth, zt * 2, cm, L(-(hw - WHEEL.wall / 2), 0), q);
      b.box(WHEEL.wall, WHEEL.depth, zt * 2, cm, L(hw - WHEEL.wall / 2, 0), q);
      b.box(hw * 2, WHEEL.depth, WHEEL.wall, cm, L(0, 0).add(new THREE.Vector3(0, 0, -zt)), q);
      // 前板做成剖面玻璃，便于看见壶中水量
      b.box(hw * 2, WHEEL.depth, 0.01, cupFront, L(0, 0).add(new THREE.Vector3(0, 0, zt)), q);
      // 铜箍
      b.box(hw * 2 + 0.01, 0.03, zt * 2 + 0.01, M.bronzeDark, L(0, WHEEL.depth / 2 - 0.02), q);
      // 壶臂与平衡块
      for (const z of [-0.2, 0.2]) b.beam([bal[0], bal[1], z], [cup[0] - d[0] * 0.1, cup[1] - d[1] * 0.1, z], 0.04, 0.03, M.woodDark);
      b.box(0.14, 0.1, 0.36, M.iron, [bal[0], bal[1], 0], new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -th));
      b.cyl(0.04, 0.04, 0.48, M.iron, [hinge[0], hinge[1], 0], new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), 8);
      // 凸耳（压在格叉上）
      b.rod([lug[0] - d[0] * 0.14, lug[1] - d[1] * 0.14, WHEEL.lugZ - 0.12], [lug[0], lug[1], WHEEL.lugZ], 0.018, M.iron, 6);
      b.sphere(WHEEL.lugR, M.bronze, [lug[0], lug[1], WHEEL.lugZ], 12);
    }, [bk.com[0], bk.com[1], 0]);
    scene.add(g);
    dyn.push(g);
  });
  {
    const th = WHEEL.fillTheta;
    anchors.fillCup = [wx + Math.sin(th) * 1.5 + 0.05, wy + Math.cos(th) * 1.5 + 0.12, 0.25];
  }

  // ================= 枢衡（格叉 + 天关 + 枢权） =================
  const leverGlow = glowCopy(M.woodLight, 0x8a4a10);
  const stopGlow = glowCopy(M.iron, 0xc05a20);
  glow.lever = leverGlow;
  glow.stop = stopGlow;
  const leverG = bodyGroup(LV.body, (b) => {
    const P = LV.pivot;
    const z = LEVER.padZ;
    const zs = LEVER.stopZ;
    // 长臂：支点 → 格叉
    b.beam([P[0], P[1], z + 0.06], [LV.padC[0], LV.padC[1] - 0.06, z], 0.07, 0.06, leverGlow);
    // 长臂：支点 → 天关
    b.beam([P[0], P[1], zs], [LV.stopC[0], LV.stopC[1], zs], 0.07, 0.06, leverGlow);
    // 枢权臂与枢权
    b.beam([P[0], P[1], z + 0.06], [LV.cwC[0], LV.cwC[1], z + 0.06], 0.06, 0.05, leverGlow);
    b.rod([LV.cwC[0], LV.cwC[1], z + 0.06], [LV.cwC[0], LV.cwC[1] - 0.2, z + 0.06], 0.01, M.black, 4);
    b.cyl(0.09, 0.11, 0.18, M.bronze, [LV.cwC[0], LV.cwC[1] - 0.29, z + 0.06], null, 16);
    // 格叉（叉形托板）
    const pc = LV.padC;
    b.box(LEVER.padHalfW * 2 + 0.04, LEVER.padHalfT * 2, 0.12, leverGlow, [pc[0], pc[1], z]);
    for (const s of [-1, 1]) b.box(0.03, 0.08, 0.12, leverGlow, [pc[0] + s * (LEVER.padHalfW + 0.02), pc[1] + 0.04, z]);
    // 天关挡块（与物理形状一致）
    const qs = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -LEVER.stopTheta + LEVER.faceTilt);
    b.box(LEVER.stopHalfT * 2, LV.stopLen, 0.1, stopGlow, [LV.stopC[0], LV.stopC[1], zs], qs);
    b.cyl(0.07, 0.07, 0.3, M.iron, [P[0], P[1], z + 0.08], new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), 14);
  });
  scene.add(leverG);
  dyn.push(leverG);
  anchors.fork = [LV.padC[0] + 0.25, LV.padC[1] - 0.1, LEVER.padZ + 0.1];
  anchors.lever = [LV.pivot[0] + 0.15, LV.pivot[1] + 0.05, LEVER.padZ + 0.15];
  anchors.weight = [LV.cwC[0] + 0.15, LV.cwC[1] - 0.3, LEVER.padZ + 0.1];
  anchors.stop = [LV.stopC[0] - 0.05, LV.stopC[1] - 0.12, LEVER.stopZ + 0.1];

  // ================= 天柱与传动轴 =================
  const shaftGlow = glowCopy(M.bronze, 0x7a5018);
  glow.shaft = shaftGlow;
  const tzG = bodyGroup(sim.tianzhu.body, (b) => {
    b.rod([TZ.x, TZ.y0, TZ.z], [TZ.x, 7.7, TZ.z], 0.065, M.woodDark, 12);
    // 地毂所啮合的伞齿（在枢轮轴下方）
    addGear(b, { kind: 'bevel', teeth: 16, r: SHAFT.wheelBevelR, width: 0.06, toothH: 0.06, center: [TZ.x, SHAFT.tianzhuWheelGearY, TZ.z], axis: [0, 1, 0], meshDir: [0, 0, 1], gap: true, material: shaftGlow });
    addGear(b, { kind: 'bevel', teeth: 12, r: SHAFT.bevelR, width: 0.05, toothH: 0.05, center: [TZ.x, SHAFT.L1.y + SHAFT.bevelR, TZ.z], axis: [0, -1, 0], meshDir: [-1, 0, 0], material: shaftGlow });
    addGear(b, { kind: 'bevel', teeth: 12, r: SHAFT.bevelR, width: 0.05, toothH: 0.05, center: [TZ.x, GLOBE.lineY - SHAFT.bevelR, TZ.z], axis: [0, 1, 0], meshDir: [-1, 0, 0], material: shaftGlow });
    addGear(b, { kind: 'bevel', teeth: 12, r: SHAFT.bevelR, width: 0.05, toothH: 0.05, center: [TZ.x, ARMILLARY.lineY - SHAFT.bevelR, TZ.z], axis: [0, 1, 0], meshDir: [-1, 0, 0], material: shaftGlow });
    // 天柱上的标记条，方便看出转动
    for (const y of [1.3, 3.6, 6.0]) b.box(0.16, 0.5, 0.03, M.lacquer, [TZ.x, y, TZ.z + 0.06]);
  });
  scene.add(tzG);
  dyn.push(tzG);
  anchors.tianzhu = [TZ.x + 0.15, 4.0, TZ.z + 0.2];

  const L1G = bodyGroup(sim.L1.body, (b) => {
    const L = SHAFT.L1;
    b.rod([L.x0 - 0.1, L.y, L.z], [L.x1 + 0.08, L.y, L.z], 0.05, M.woodDark, 10);
    addGear(b, { kind: 'bevel', teeth: 12, r: SHAFT.bevelR, width: 0.05, toothH: 0.05, center: [L.x1, L.y, L.z], axis: [1, 0, 0], meshDir: [0, 1, 0], gap: true, material: shaftGlow });
    addGear(b, { kind: 'spur', teeth: 8, r: JILUN.pinionR - 0.03, width: 0.1, toothH: 0.06, center: [L.x0, L.y, L.z], axis: [1, 0, 0], meshDir: [0, -1, 0], material: shaftGlow });
    for (const x of [0.9, 2.0]) b.box(0.4, 0.03, 0.12, M.lacquer, [x, L.y + 0.05, L.z]);
  });
  scene.add(L1G);
  dyn.push(L1G);

  const upperShaft = (Ls, cel) => {
    const g = bodyGroup(Ls.body, (b) => {
      b.rod([Ls.x0 - 0.08, cel.lineY, TZ.z], [Ls.x1 + 0.08, cel.lineY, TZ.z], 0.04, M.woodDark, 10);
      addGear(b, { kind: 'bevel', teeth: 12, r: SHAFT.bevelR, width: 0.05, toothH: 0.05, center: [Ls.x1, cel.lineY, TZ.z], axis: [1, 0, 0], meshDir: [0, -1, 0], gap: true, material: shaftGlow });
      addGear(b, { kind: 'spur', teeth: 8, r: CELESTIAL.pinionR - 0.02, width: 0.07, toothH: 0.04, center: [Ls.x0, cel.lineY, TZ.z], axis: [1, 0, 0], meshDir: SOUTH.map((v) => -v), material: shaftGlow });
    });
    scene.add(g);
    dyn.push(g);
  };
  upperShaft(sim.L2, GLOBE);
  upperShaft(sim.L3, ARMILLARY);

  // ================= 浑象 =================
  const S3 = V3(SOUTH);
  const globeG = bodyGroup(sim.globe.body, (b) => {
    b.add(new THREE.SphereGeometry(GLOBE.radius, 48, 32), M.globe, mat(GLOBE.center, new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), V3(POLAR))));
    const c = V3(GLOBE.center);
    b.rod(c.clone().addScaledVector(S3, -0.95).toArray(), c.clone().addScaledVector(S3, 0.86).toArray(), 0.03, M.bronze, 8);
    const cc = c.clone().addScaledVector(S3, CELESTIAL.crownOff);
    addGear(b, { kind: 'crown', teeth: 24, r: CELESTIAL.crownR, width: 0.03, toothH: 0.04, center: cc.toArray(), axis: SOUTH, meshDir: [1, 0, 0], gap: true, material: M.bronze });
  });
  scene.add(globeG);
  dyn.push(globeG);
  anchors.globe = [GLOBE.center[0] - 0.6, GLOBE.center[1] + 0.75, GLOBE.center[2] + 0.4];

  // ================= 浑仪（可转动的四游仪） =================
  const armG = bodyGroup(sim.armillary.body, (b) => {
    const c = V3(ARMILLARY.center);
    const pol = V3(POLAR);
    // 四游双环：所在平面包含极轴
    const qRing = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0));
    for (const off of [-0.03, 0.03]) {
      const p = c.clone().add(new THREE.Vector3(off, 0, 0));
      b.torus(0.78, 0.022, shaftGlow, p.toArray(), qRing.clone().premultiply(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pol)), 96);
    }
    // 望筒
    const tubeDir = pol.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.6);
    b.rod(c.clone().addScaledVector(tubeDir, -0.74).toArray(), c.clone().addScaledVector(tubeDir, 0.74).toArray(), 0.035, M.gold, 12);
    b.rod(c.clone().addScaledVector(pol, -0.95).toArray(), c.clone().addScaledVector(pol, 0.95).toArray(), 0.025, M.bronze, 8);
    const cc = c.clone().addScaledVector(S3, CELESTIAL.crownOff);
    addGear(b, { kind: 'crown', teeth: 24, r: CELESTIAL.crownR, width: 0.03, toothH: 0.04, center: cc.toArray(), axis: SOUTH, meshDir: [1, 0, 0], gap: true, material: M.bronze });
  });
  scene.add(armG);
  dyn.push(armG);
  anchors.armillary = [ARMILLARY.center[0] - 0.95, ARMILLARY.center[1] + 0.25, ARMILLARY.center[2] + 0.6];

  // ================= 昼夜机轮 =================
  const jlB = sim.jilun.body;
  const jlGlow = glowCopy(M.woodLight, 0x7a4512);
  const tripGlow = glowCopy(M.bronze, 0xb07a28);
  glow.jilun = jlGlow;
  glow.trip = tripGlow;
  const placardMats = [];
  const jlG = bodyGroup(jlB, (b) => {
    const x = JILUN.x;
    const z = JILUN.z;
    b.rod([x, JILUN.y0, z], [x, JILUN.y1, z], 0.07, M.woodDark, 12);
    addGear(b, { kind: 'crown', teeth: 24, r: JILUN.crownR, width: 0.05, toothH: 0.06, center: [x, JILUN.crownY, z], axis: [0, 1, 0], meshDir: [1, 0, 0], gap: true, material: shaftGlow });
    for (const y of [JILUN.drumY, JILUN.bellY, JILUN.placardY]) {
      b.cyl(JILUN.tierR, JILUN.tierR, JILUN.discHalf * 2, jlGlow, [x, y, z], null, 48);
      b.torus(JILUN.tierR, 0.02, M.bronzeDark, [x, y + JILUN.discHalf, z], new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), 64);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        b.beam([x, y - 0.06, z], [x + Math.sin(a) * JILUN.tierR * 0.95, y - 0.06, z + Math.cos(a) * JILUN.tierR * 0.95], 0.04, 0.04, M.woodDark, [0, 1, 0]);
      }
    }
    // 拨牙：按物理形状绘制
    jlB.shapes.forEach((s, i) => {
      const o = jlB.shapeOffsets[i];
      const q = jlB.shapeOrientations[i];
      const he = s.halfExtents;
      b.box(he.x * 2, he.y * 2, he.z * 2, tripGlow, [o.x + jlB.position.x, o.y + jlB.position.y, o.z + jlB.position.z], new THREE.Quaternion(q.x, q.y, q.z, q.w));
    });
  });
  // 司辰木人：每个时辰一人，手举时辰牌
  {
    const inner = jlG.children[0];
    const placardPhase = (5.2 * Math.PI) / 180;
    for (let k = 0; k < 12; k++) {
      const a = placardPhase + (k * Math.PI * 2) / 12;
      const name = SHICHEN[(6 + k) % 12] + '时';
      const r0 = 0.6;
      const px = JILUN.x + Math.sin(a) * r0;
      const pz = JILUN.z + Math.cos(a) * r0;
      const y0 = JILUN.placardY + JILUN.discHalf;
      const fig = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.26, 10), k % 2 ? M.cloth : M.clothRed);
      body.position.y = 0.13;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), M.skin);
      head.position.y = 0.31;
      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.05, 10), M.black);
      hat.position.y = 0.36;
      const pm = new THREE.MeshStandardMaterial({ map: placardTexture(name), roughness: 0.8, emissive: 0x332211, emissiveIntensity: 0.4 });
      placardMats.push(pm);
      const plank = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.24), pm);
      plank.position.set(0, 0.36, 0.07);
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 4), M.woodDark);
      stick.position.set(0, 0.2, 0.065);
      fig.add(body, head, hat, plank, stick);
      fig.position.set(px, y0, pz);
      fig.rotation.y = a; // 面朝外
      fig.traverse((o) => {
        if (o.isMesh) o.castShadow = true;
      });
      inner.add(fig);
    }
  }
  scene.add(jlG);
  dyn.push(jlG);
  anchors.jilun = [JILUN.x + 0.85, JILUN.bellY - 0.2, JILUN.z + 0.5];
  anchors.trip = [JILUN.x + 0.42, JILUN.drumY + 0.12, JILUN.z + 0.55];
  anchors.placard = [JILUN.x, JILUN.placardY + 0.55, 0.3];

  // ================= 木人与钟鼓 =================
  const strikerGlow = glowCopy(M.woodLight, 0x7a4512);
  glow.striker = strikerGlow;
  const instruments = {};
  for (const name of ['drum', 'bell']) {
    const st = sim.strikers[name];
    const [px, py] = st.pivot;
    const g = bodyGroup(st.body, (b) => {
      const tailBottom = py - STRIKER.tailLen;
      b.beam([px, py, st.frontZ], [px, tailBottom, st.frontZ], 0.03, 0.06, strikerGlow);
      b.rod([px, py, st.frontZ - 0.05], [px, py, STRIKER.frontZ + 0.04], 0.022, M.iron, 8);
      // 木人手臂与槌
      b.beam([px, py, STRIKER.frontZ], [px, st.malletC[1] + 0.05, STRIKER.frontZ], 0.045, 0.05, M.clothRed);
      b.sphere(0.03, M.skin, [px, st.malletC[1] + 0.06, STRIKER.frontZ], 10);
      if (name === 'drum') b.cyl(0.04, 0.04, 0.12, M.lacquer, [px + 0.02, st.malletC[1], STRIKER.frontZ], new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)), 10);
      else b.sphere(0.05, M.woodLight, [px, st.malletC[1], STRIKER.frontZ], 12);
    });
    scene.add(g);
    dyn.push(g);
    // 木人身体（静态）：肩部在支点处
    const fig = new Builder();
    const fx = px - 0.02;
    const baseY = py - 0.56;
    const fz = STRIKER.frontZ - 0.07;
    fig.cyl(0.08, 0.12, 0.5, name === 'drum' ? M.cloth : M.clothRed, [fx, baseY + 0.25, fz], null, 12);
    fig.cyl(0.13, 0.13, 0.05, M.woodDark, [fx, baseY - 0.02, fz], null, 14);
    fig.sphere(0.075, M.skin, [fx, py + 0.09, fz], 14);
    fig.cyl(0.05, 0.085, 0.08, M.black, [fx, py + 0.18, fz], null, 12);
    fig.box(0.05, 0.3, 0.05, M.clothRed, [fx - 0.11, py - 0.16, fz], new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.25)));
    fig.box(0.24, 0.07, 0.12, name === 'drum' ? M.cloth : M.clothRed, [fx, py - 0.02, fz]);
    // 乐器
    const ip = st.instPos;
    if (name === 'drum') {
      const qx = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2));
      fig.cyl(0.15, 0.15, 0.2, M.lacquer, [ip[0] + 0.08, ip[1], ip[2]], qx, 24);
      fig.cyl(0.152, 0.152, 0.01, M.drumSkin, [ip[0] - 0.025, ip[1], ip[2]], qx, 24);
      fig.cyl(0.152, 0.152, 0.01, M.drumSkin, [ip[0] + 0.185, ip[1], ip[2]], qx, 24);
      fig.box(0.04, ip[1] - (baseY - 0.02), 0.04, M.woodDark, [ip[0] + 0.08, (ip[1] + baseY) / 2 - 0.08, ip[2]]);
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        fig.sphere(0.012, M.gold, [ip[0] - 0.018, ip[1] + Math.sin(a) * 0.14, ip[2] + Math.cos(a) * 0.14], 6);
      }
    } else {
      const prof = [];
      for (let k = 0; k <= 12; k++) {
        const t = k / 12;
        prof.push(new THREE.Vector2(0.05 + 0.1 * Math.pow(t, 1.4) + (t > 0.9 ? 0.015 : 0), 0.16 - t * 0.3));
      }
      const bellGeo = new THREE.LatheGeometry(prof, 28);
      fig.add(bellGeo, M.bronze, mat([ip[0] + 0.07, ip[1] + 0.04, ip[2]]));
      fig.rod([ip[0] + 0.07, ip[1] + 0.2, ip[2]], [ip[0] + 0.07, ip[1] + 0.36, ip[2]], 0.012, M.black, 4);
      fig.beam([ip[0] - 0.12, ip[1] + 0.36, ip[2]], [ip[0] + 0.26, ip[1] + 0.36, ip[2]], 0.04, 0.04, M.lacquer);
      fig.box(0.04, 0.6, 0.04, M.lacquer, [ip[0] + 0.26, ip[1] + 0.07, ip[2]]);
    }
    fig.merge(scene);
    instruments[name] = ip;
    anchors[name] = [ip[0] + 0.2, ip[1] + 0.22, ip[2] + 0.1];
    anchors[name + 'Figure'] = [fx - 0.05, py - 0.25, fz + 0.12];
  }

  // ================= 水 =================
  const maxP = WATER.maxParticles;
  const waterMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(WATER.r * 1.45, 10, 8), M.water, maxP);
  waterMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  waterMesh.frustumCulled = false;
  waterMesh.castShadow = false;
  scene.add(waterMesh);
  const tmpM = new THREE.Matrix4();
  const tmpQ = new THREE.Quaternion();
  const tmpS = new THREE.Vector3();
  const tmpP = new THREE.Vector3();
  const vdir = new THREE.Vector3();
  const yAxis = new THREE.Vector3(0, 1, 0);

  function updateWater(simNow) {
    const ps = simNow.particles;
    const n = Math.min(ps.length, maxP);
    for (let i = 0; i < n; i++) {
      const p = ps[i];
      const b = p.body;
      // 每个水滴有固定的 z 偏移，让二维水流在壶的厚度方向铺开
      const h = Math.sin(p.id * 12.9898) * 43758.5453;
      const zoff = (h - Math.floor(h) - 0.5) * 0.24;
      tmpP.set(b.position.x, b.position.y, zoff);
      vdir.set(b.velocity.x, b.velocity.y, 0);
      const sp = vdir.length();
      if (sp > 0.3) {
        tmpQ.setFromUnitVectors(yAxis, vdir.multiplyScalar(1 / sp));
        const st = Math.min(1.9, 1 + sp * 0.3);
        const th = 0.78 / Math.sqrt(st);
        tmpS.set(th, st, th);
      } else {
        tmpQ.identity();
        tmpS.set(1, 1, 1);
      }
      tmpM.compose(tmpP, tmpQ, tmpS);
      waterMesh.setMatrixAt(i, tmpM);
    }
    waterMesh.count = n;
    waterMesh.instanceMatrix.needsUpdate = true;
  }

  // ================= 灯光 =================
  const hemi = new THREE.HemisphereLight(0x7f96d8, 0x3a2c20, 0.9);
  scene.add(hemi);
  const moonLight = new THREE.DirectionalLight(0xc6d4ff, 1.7);
  moonLight.position.set(-6, 14, 9);
  moonLight.target.position.set(1.8, 3, -1);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);
  const sc = moonLight.shadow.camera;
  sc.left = -7;
  sc.right = 7;
  sc.top = 7;
  sc.bottom = -5;
  sc.near = 2;
  sc.far = 32;
  moonLight.shadow.bias = -0.0006;
  moonLight.shadow.normalBias = 0.02;
  scene.add(moonLight, moonLight.target);
  const warm = [
    [[-0.5, 3.0, 1.4], 2.2, 6],
    [[4.2, 2.6, 2.0], 3.0, 7],
    [[1.2, 6.1, 0.6], 2.0, 6],
    [[1.3, 1.4, 1.6], 1.6, 6],
  ];
  for (const [p, i, d] of warm) {
    const l = new THREE.PointLight(0xffb469, i, d, 1.6);
    l.position.set(...p);
    scene.add(l);
  }
  const rim = new THREE.DirectionalLight(0xffd2a0, 0.5);
  rim.position.set(8, 5, -6);
  scene.add(rim);

  // 帧间插值：记录上一物理步的姿态，渲染时按剩余时间比例插值（高刷新率屏幕更顺滑）
  const prevP = dyn.map(() => new THREE.Vector3());
  const prevQ = dyn.map(() => new THREE.Quaternion());
  const curQ = new THREE.Quaternion();
  let hasPrev = false;
  function snapshot() {
    dyn.forEach((g, i) => {
      const b = g.userData.body;
      prevP[i].set(b.position.x, b.position.y, b.position.z);
      prevQ[i].set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
    });
    hasPrev = true;
  }
  function update(simNow, alpha = 1) {
    dyn.forEach((g, i) => {
      const b = g.userData.body;
      if (!hasPrev || alpha >= 1) {
        syncGroup(g);
        return;
      }
      g.position.set(b.position.x, b.position.y, b.position.z).sub(prevP[i]).multiplyScalar(alpha).add(prevP[i]);
      curQ.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
      g.quaternion.copy(prevQ[i]).slerp(curQ, alpha);
    });
    updateWater(simNow);
  }

  /** 重播时换用新的仿真：按刚体在世界中的序号重新绑定（机构刚体总在水滴之前创建） */
  function rebind(oldSim, newSim) {
    for (const g of dyn) {
      const idx = oldSim.world.bodies.indexOf(g.userData.body);
      g.userData.body = newSim.world.bodies[idx];
    }
    hasPrev = false;
  }

  return { update, snapshot, rebind, anchors, glow, materials: M, placardMats, instruments, waterMesh, surfaces: [tcSurf, psSurf] };
}
