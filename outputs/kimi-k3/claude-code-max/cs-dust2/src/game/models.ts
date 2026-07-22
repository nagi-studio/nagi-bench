// ---------------------------------------------------------------------------
// 程序化模型：类人角色（头/躯干/双臂/双腿/武器）、第一人称手模、地图网格
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import { Team } from './types';
import { MapData, WALL_H } from './mapData';

// ---------------------------------------------------------------- 材质缓存

const matCache = new Map<string, THREE.MeshLambertMaterial>();
export function mat(color: number): THREE.MeshLambertMaterial {
  const key = String(color);
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color });
    matCache.set(key, m);
  }
  return m;
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
export function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(boxGeo, mat(color));
  m.scale.set(w, h, d);
  return m;
}

// ---------------------------------------------------------------- 武器模型

export function buildWeaponMesh(id: string): THREE.Group {
  const g = new THREE.Group();
  const metal = 0x22252a;
  const wood = 0x6e4a2a;
  if (id === 'ak47') {
    const recv = box(0.06, 0.09, 0.5, metal); recv.position.set(0, 0, -0.1);
    const barrel = box(0.03, 0.03, 0.34, metal); barrel.position.set(0, 0.015, -0.48);
    const gripWood = box(0.055, 0.05, 0.3, wood); gripWood.position.set(0, -0.02, -0.32);
    const magz = box(0.045, 0.16, 0.09, wood); magz.position.set(0, -0.11, -0.12); magz.rotation.x = 0.35;
    const stock = box(0.05, 0.1, 0.2, wood); stock.position.set(0, -0.02, 0.22);
    g.add(recv, barrel, gripWood, magz, stock);
  } else if (id === 'm4a4') {
    const recv = box(0.06, 0.09, 0.46, metal); recv.position.set(0, 0, -0.08);
    const barrel = box(0.028, 0.028, 0.36, metal); barrel.position.set(0, 0.01, -0.46);
    const rail = box(0.05, 0.03, 0.34, 0x353a40); rail.position.set(0, 0.06, -0.2);
    const magz = box(0.045, 0.14, 0.08, 0x3a3f45); magz.position.set(0, -0.1, -0.1); magz.rotation.x = 0.15;
    const stock = box(0.05, 0.09, 0.18, 0x2a2e33); stock.position.set(0, -0.01, 0.2);
    g.add(recv, barrel, rail, magz, stock);
  } else if (id === 'awp') {
    const body = box(0.06, 0.1, 0.72, 0x2e5233); body.position.set(0, 0, -0.14);
    const barrel = box(0.032, 0.032, 0.5, metal); barrel.position.set(0, 0.01, -0.68);
    const scopeG = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 10), mat(0x15181c));
    scopeG.rotation.x = Math.PI / 2; scopeG.position.set(0, 0.1, -0.12);
    const magz = box(0.05, 0.12, 0.1, 0x24402a); magz.position.set(0, -0.09, -0.05);
    const stock = box(0.055, 0.11, 0.22, 0x2e5233); stock.position.set(0, -0.02, 0.26);
    g.add(body, barrel, scopeG, magz, stock);
  } else if (id === 'glock' || id === 'usp' || id === 'deagle') {
    const c = id === 'deagle' ? 0x4a4e55 : metal;
    const slide = box(0.045, 0.05, id === 'deagle' ? 0.26 : 0.2, c); slide.position.set(0, 0.02, -0.04);
    const grip = box(0.04, 0.11, 0.06, 0x2c2f34); grip.position.set(0, -0.05, 0.04); grip.rotation.x = 0.25;
    g.add(slide, grip);
  } else if (id === 'knife') {
    const blade = box(0.02, 0.045, 0.24, 0xb8c0c8); blade.position.set(0, 0, -0.14);
    const handle = box(0.03, 0.05, 0.12, 0x33302a); handle.position.set(0, 0, 0.04);
    g.add(blade, handle);
  }
  return g;
}

// ---------------------------------------------------------------- 类人角色

export interface HumanoidParts {
  root: THREE.Group;      // 位于脚底
  torso: THREE.Mesh;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  gunMount: THREE.Group;
  gun: THREE.Group | null;
}

export interface TeamSkin {
  torso: number; legs: number; arms: number; head: number; helmet: number | null; boots: number;
}

export const SKINS: Record<Team, TeamSkin> = {
  CT: { torso: 0x2e4d72, legs: 0x24384f, arms: 0x2a4462, head: 0xc9a37e, helmet: 0x1d2733, boots: 0x1a1d22 },
  T:  { torso: 0x8a6b3f, legs: 0x5c4a2f, arms: 0x7d5f38, head: 0x3a332a, helmet: null, boots: 0x2a241c },
};

export function buildHumanoid(team: Team): HumanoidParts {
  const s = SKINS[team];
  const root = new THREE.Group();

  // 腿（髋关节枢轴）
  const mkLeg = (side: number) => {
    const hip = new THREE.Group();
    hip.position.set(0.14 * side, 0.82, 0);
    const thigh = box(0.23, 0.82, 0.27, s.legs);
    thigh.position.y = -0.41;
    const boot = box(0.24, 0.14, 0.34, s.boots);
    boot.position.set(0, -0.78, -0.03);
    hip.add(thigh, boot);
    return hip;
  };
  const legL = mkLeg(-1), legR = mkLeg(1);

  // 躯干（带胸挂背心配色区分）
  const torso = box(0.56, 0.68, 0.34, s.torso);
  torso.position.y = 1.16;
  const vest = box(0.5, 0.4, 0.4, team === 'CT' ? 0x22354d : 0x6d542f);
  vest.position.y = 1.2;
  root.add(vest);

  // 手臂（肩关节枢轴，默认前伸持枪）
  const mkArm = (side: number) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.36 * side, 1.44, 0);
    const arm = box(0.16, 0.58, 0.19, s.arms);
    arm.position.y = -0.27;
    const hand = box(0.13, 0.12, 0.14, 0xc9a37e);
    hand.position.y = -0.56;
    shoulder.add(arm, hand);
    return shoulder;
  };
  const armL = mkArm(-1), armR = mkArm(1);

  // 头（含 CT 头盔 / T 头巾）
  const headG = new THREE.Group();
  headG.position.y = 1.62;
  const skull = box(0.3, 0.3, 0.3, s.head);
  skull.position.y = 0.15;
  headG.add(skull);
  if (s.helmet !== null) {
    const helm = box(0.34, 0.16, 0.34, s.helmet);
    helm.position.y = 0.26;
    const visor = box(0.26, 0.07, 0.05, 0x11151a);
    visor.position.set(0, 0.12, -0.16);
    headG.add(helm, visor);
  } else {
    const band = box(0.32, 0.08, 0.32, 0x7a2e2e);
    band.position.y = 0.26;
    headG.add(band);
  }

  // 武器挂点（胸前右侧，随身体朝向）
  const gunMount = new THREE.Group();
  gunMount.position.set(0.22, 1.28, -0.35);

  root.add(legL, legR, torso, armL, armR, headG, gunMount);
  return { root, torso, head: headG, armL, armR, legL, legR, gunMount, gun: null };
}

/** 设置角色持枪姿态（朝向由 root.rotation.y 控制，俯仰作用到手臂和枪） */
export function poseHumanoid(p: HumanoidParts, opts: {
  pitch: number; walkPhase: number; walkAmp: number; dead: boolean; knife: boolean;
}) {
  if (opts.dead) return; // 死亡姿态由外部一次性设置
  const swing = Math.sin(opts.walkPhase) * opts.walkAmp;
  p.legL.rotation.x = swing;
  p.legR.rotation.x = -swing;
  // 持枪姿态：双臂前伸
  const aimX = -1.25 - opts.pitch * 0.8;
  if (opts.knife) {
    p.armR.rotation.set(-0.7 - opts.pitch * 0.5, 0, -0.25);
    p.armL.rotation.set(-0.15, 0, 0.15);
  } else {
    p.armR.rotation.set(aimX, 0, -0.12);
    p.armL.rotation.set(aimX + 0.08, 0.5, 0.3);
  }
  p.gunMount.rotation.x = -opts.pitch * 0.85;
  p.head.rotation.x = -opts.pitch * 0.5;
}

export function setDeadPose(p: HumanoidParts) {
  p.root.rotation.x = -Math.PI / 2 + 0.08;
  p.root.position.y = 0.25;
  p.armL.rotation.set(0, 0, 0.6);
  p.armR.rotation.set(0, 0, -0.4);
  p.legL.rotation.x = 0.15;
  p.legR.rotation.x = -0.1;
}

export function revivePose(p: HumanoidParts) {
  p.root.rotation.x = 0;
  p.root.position.y = 0;
}

// ---------------------------------------------------------------- 第一人称手模

export interface ViewModel {
  group: THREE.Group;
  gunHolder: THREE.Group;
  armMesh: THREE.Mesh;
  currentId: string;
}

export function buildViewModel(): ViewModel {
  const group = new THREE.Group();
  const gunHolder = new THREE.Group();
  const armMesh = box(0.09, 0.09, 0.34, 0x2a4462);
  armMesh.position.set(0.02, -0.06, 0.18);
  group.add(gunHolder, armMesh);
  group.position.set(0.26, -0.24, -0.45);
  return { group, gunHolder, armMesh, currentId: '' };
}

export function setViewModelWeapon(vm: ViewModel, id: string, team: Team) {
  if (vm.currentId === id) return;
  vm.currentId = id;
  while (vm.gunHolder.children.length) vm.gunHolder.remove(vm.gunHolder.children[0]);
  const w = buildWeaponMesh(id);
  w.scale.setScalar(1.15);
  vm.gunHolder.add(w);
  (vm.armMesh.material as THREE.Material) = mat(team === 'CT' ? 0x2a4462 : 0x7d5f38);
}

// ---------------------------------------------------------------- 地图网格

/** 程序生成地面文字贴图（A / B 点位标识） */
function makeTextTexture(text: string, color: string, size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.font = `bold ${size * 0.72}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.55;
  ctx.fillText(text, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function makeGroundTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#8a7a5c';
  ctx.fillRect(0, 0, 512, 512);
  // 噪点
  for (let i = 0; i < 9000; i++) {
    const v = Math.random();
    ctx.fillStyle = v > 0.5 ? 'rgba(255,240,210,0.05)' : 'rgba(40,30,15,0.06)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2.5, 2.5);
  }
  // 石板缝
  ctx.strokeStyle = 'rgba(50,40,25,0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo(i * 128, 0); ctx.lineTo(i * 128, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * 128); ctx.lineTo(512, i * 128); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 12);
  tex.anisotropy = 8;
  return tex;
}

function makeWallTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#b39a72';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const v = Math.random();
    ctx.fillStyle = v > 0.5 ? 'rgba(255,245,220,0.06)' : 'rgba(60,45,25,0.07)';
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  }
  ctx.fillStyle = 'rgba(90,70,45,0.35)';
  ctx.fillRect(0, 236, 256, 20); // 底部踢脚
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

export function buildMapMeshes(map: MapData): THREE.Group {
  const group = new THREE.Group();

  // 地面
  const groundTex = makeGroundTexture();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(84, 100),
    new THREE.MeshLambertMaterial({ map: groundTex }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // 墙体（逐碰撞盒，共享几何体）
  const wallTex = makeWallTexture();
  const wallMat = new THREE.MeshLambertMaterial({ map: wallTex });
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  for (const c of map.colliders) {
    const isCrate = (c as { kind?: string }).kind !== undefined;
    if (isCrate) continue;
    const w = c.maxX - c.minX, h = c.maxY - c.minY, d = c.maxZ - c.minZ;
    const m = new THREE.Mesh(unitBox, wallMat);
    m.scale.set(w, h, d);
    m.position.set((c.minX + c.maxX) / 2, h / 2, (c.minZ + c.maxZ) / 2);
    group.add(m);
  }

  // 箱子 / 门
  const crateMat = new THREE.MeshLambertMaterial({ color: 0x7a5c34 });
  const crateMatDark = new THREE.MeshLambertMaterial({ color: 0x64492a });
  const doorMat = new THREE.MeshLambertMaterial({ color: 0x4a3826 });
  let ci = 0;
  for (const c of map.crates) {
    const w = c.maxX - c.minX, h = c.maxY - c.minY, d = c.maxZ - c.minZ;
    const m = new THREE.Mesh(unitBox, c.kind === 'door' ? doorMat : (ci++ % 2 ? crateMat : crateMatDark));
    m.scale.set(w, h, d);
    m.position.set((c.minX + c.maxX) / 2, h / 2, (c.minZ + c.maxZ) / 2);
    group.add(m);
    if (c.kind === 'crate') {
      // 顶部边框装饰
      const trim = new THREE.Mesh(unitBox, crateMatDark);
      trim.scale.set(w + 0.04, 0.06, d + 0.04);
      trim.position.set(m.position.x, c.maxY - 0.03, m.position.z);
      group.add(trim);
    }
  }

  // A / B 点位地面标识
  const mkDecal = (text: string, x: number, z: number, size: number, color: string) => {
    const p = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: makeTextTexture(text, color), transparent: true, depthWrite: false }),
    );
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, 0.02, z);
    group.add(p);
  };
  mkDecal('A', -21, -34, 10, '#c8321e');
  mkDecal('B', 29, -33, 10, '#c8321e');

  return group;
}

/** C4 炸弹模型 */
export function buildBombMesh(): THREE.Group {
  const g = new THREE.Group();
  const body = box(0.34, 0.12, 0.24, 0x3a3f35);
  body.position.y = 0.06;
  const screen = box(0.12, 0.03, 0.08, 0x61d17a);
  screen.position.set(0.06, 0.135, 0);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 6), mat(0x222222));
  antenna.position.set(-0.13, 0.2, 0);
  g.add(body, screen, antenna);
  return g;
}
