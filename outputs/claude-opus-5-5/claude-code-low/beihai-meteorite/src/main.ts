import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type Shot,
} from "@agentbench/cinematic-player";
import { applyPose, float as floatPose, idle, walk, aim, lerpPose, type Figure, type Pose } from "@agentbench/voxel-kit";
import { DURATION, voiceCues, soundCues, SHOT_TIMES, ROOM_SHOTS } from "./cues";
import { registerSounds } from "./audio";
import {
  rng, fbm, pixelTex, box, std, rockGeom, makeSkins, figure, lifePack, pistolGeom, scopeGeom, cupGeom, magnifierGeom, slugGeom,
  earthMesh, atmosphereMesh, sunMesh, glowSprite, stars, wheelStation, shipyard, voxelMaterial, buildVoxelGeometry,
} from "./world";

export { voiceCues };

/* ═════════════ 渲染器 ═════════════ */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 30000);
const NO_GL = !!(globalThis as any).__NO_GL;
const renderer: THREE.WebGLRenderer = NO_GL ? ({ shadowMap: {} } as any) : new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const context = { scene, camera };

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const sm = (x: number) => x * x * (3 - 2 * x);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const _tgt = new THREE.Vector3();

function cam(p: THREE.Vector3, target: THREE.Vector3, fov = 40, near = 0.05, roll = 0) {
  camera.position.copy(p);
  camera.up.set(0, 1, 0);
  camera.lookAt(target);
  if (roll) camera.rotateZ(roll);
  if (camera.fov !== fov || camera.near !== near) {
    camera.fov = fov;
    camera.near = near;
    camera.updateProjectionMatrix();
  }
}
function camLerp(a: THREE.Vector3, b: THREE.Vector3, ta: THREE.Vector3, tb: THREE.Vector3, k: number, fov = 40, near = 0.05) {
  cam(a.clone().lerp(b, k), ta.clone().lerp(tb, k), fov, near);
}
/** 确定性的手持感 / 冲击震动 */
function shake(t: number, amp: number) {
  camera.position.x += Math.sin(t * 13.1) * amp + Math.sin(t * 31.7) * amp * 0.5;
  camera.position.y += Math.sin(t * 17.3 + 1) * amp + Math.sin(t * 27.1) * amp * 0.4;
}
function face(fig: Figure, x: number, z: number, yaw: number, y = 0) {
  fig.root.position.set(x, y, z);
  fig.root.rotation.set(0, yaw, 0);
}
function reparent(obj: THREE.Object3D, parent: THREE.Object3D) {
  if (obj.parent !== parent) parent.add(obj);
}
const P = (p: Pose) => p;

const skins = makeSkins();

/* ═════════════ 场景集合 ═════════════ */
type SetName = "space" | "hutong" | "house" | "shop" | "base";
const sets: Record<SetName, THREE.Group> = {
  space: new THREE.Group(), hutong: new THREE.Group(), house: new THREE.Group(), shop: new THREE.Group(), base: new THREE.Group(),
};
for (const g of Object.values(sets)) { g.visible = false; scene.add(g); }
const setLook: Record<SetName, { bg: number; fog?: [number, number, number]; exposure: number }> = {
  space: { bg: 0x000000, exposure: 1.0 },
  hutong: { bg: 0xb9b2a4, fog: [0xb9b2a4, 8, 34], exposure: 1.0 },
  house: { bg: 0x0d0a08, fog: [0x0d0a08, 6, 16], exposure: 1.15 },
  shop: { bg: 0x05070a, fog: [0x05070a, 5, 22], exposure: 1.1 },
  base: { bg: 0x050302, fog: [0x050302, 3, 9], exposure: 1.1 },
};
function useSet(name: SetName) {
  for (const [k, g] of Object.entries(sets)) g.visible = k === name;
  const l = setLook[name];
  scene.background = new THREE.Color(l.bg);
  scene.fog = l.fog ? new THREE.Fog(l.fog[0], l.fog[1], l.fog[2]) : null;
  renderer.toneMappingExposure = l.exposure;
}

/* ═══════════════════════════ 胡同 ═══════════════════════════ */
const H = sets.hutong;
const greyBrick = pixelTex(16, 16, (x, y) => {
  const row = Math.floor(y / 4);
  const off = row % 2 ? 4 : 0;
  if (y % 4 === 3 || (x + off) % 8 === 7) return "#8e8a82";
  const n = fbm(x * 0.7, y * 0.7, row);
  return `hsl(30,4%,${42 + n * 14}%)`;
});
const paving = pixelTex(16, 16, (x, y) => (x % 8 === 0 || y % 8 === 0 ? "#6f6c66" : `hsl(35,5%,${48 + fbm(x, y, 2) * 10}%)`));
{
  const wallT = greyBrick.clone(); wallT.repeat.set(10, 2); wallT.needsUpdate = true;
  const wallMat = std(0xffffff, { map: wallT });
  const pv = paving.clone(); pv.repeat.set(3, 12); pv.needsUpdate = true;
  box(5, 0.1, 26, std(0xffffff, { map: pv }), 0, -0.05, -3, H);
  const wl1 = greyBrick.clone(); wl1.repeat.set(6, 2); wl1.needsUpdate = true;
  const wl2 = greyBrick.clone(); wl2.repeat.set(4, 2); wl2.needsUpdate = true;
  box(0.5, 3.2, 15.15, std(0xffffff, { map: wl1 }), -2.3, 1.6, -8.425, H);
  box(0.5, 3.2, 9.15, std(0xffffff, { map: wl2 }), -2.3, 1.6, 5.425, H);
  box(0.5, 3.2, 26, wallMat, 2.3, 1.6, -3, H);
  box(3.0, 0.1, 3.0, std(0xffffff, { map: paving }), -3.9, -0.04, 0, H);
  box(0.3, 2.8, 2.6, std(0xffffff, { map: greyBrick }), -5.2, 1.4, 0, H);
  const tile = std(0x3e3c3a);
  for (let z = -16; z < 10; z += 0.5) {
    box(0.9, 0.18, 0.46, tile, -2.3, 3.28, z, H);
    box(0.9, 0.18, 0.46, tile, 2.3, 3.28, z, H);
  }
  // 门楼
  const red = std(0x7a1e1a);
  box(0.6, 2.6, 0.2, std(0x3a3a3c), -2.3, 1.3, 0.95, H);
  box(0.6, 2.6, 0.2, std(0x3a3a3c), -2.3, 1.3, -0.95, H);
  box(0.6, 0.3, 1.9, std(0x2a2a2c), -2.3, 2.45, 0, H);
  const doorL = new THREE.Group(); doorL.position.set(-1.95, 0, -0.75); H.add(doorL);
  const doorR = new THREE.Group(); doorR.position.set(-1.95, 0, 0.75); H.add(doorR);
  box(0.08, 2.2, 0.74, red, 0, 1.1, 0.37, doorL);
  box(0.08, 2.2, 0.74, red, 0, 1.1, -0.37, doorR);
  for (const d of [doorL, doorR]) for (const k of [-1, 1]) box(0.1, 0.06, 0.06, std(0xc9a040, { metalness: 0.6 }), 0.05, 1.2, (d === doorL ? 0.62 : -0.62) + 0 * k, d);
  box(0.9, 0.3, 2.4, tile, -2.2, 2.55, 0, H);
  box(0.4, 0.2, 0.4, std(0x5a5650), -1.85, 0.1, 1.05, H);
  box(0.4, 0.2, 0.4, std(0x5a5650), -1.85, 0.1, -1.05, H);
  (H as any).doors = [doorL, doorR];
  // 院内槐树（越过墙头）
  const crown = new THREE.Mesh(rockGeom(5, 9, [0x6b7a3a, 0x7c8a40, 0x8a8a3c, 0x5a6a30], 0.22), voxelMaterial());
  crown.position.set(-4.2, 4.6, -2); H.add(crown);
  const crown2 = new THREE.Mesh(rockGeom(9, 7, [0x9a8a40, 0x7c8a40, 0xa08030], 0.22), voxelMaterial());
  crown2.position.set(3.9, 4.2, -9); H.add(crown2);
  // 远处的电线
  for (const y of [3.9, 4.05]) box(5, 0.015, 0.015, std(0x111111), 0, y, -7, H);
  const hemi = new THREE.HemisphereLight(0xdfe4ea, 0x5a5048, 1.3); H.add(hemi);
  const sun = new THREE.DirectionalLight(0xffd6a0, 2.2);
  sun.position.set(6, 9, 4); sun.target.position.set(0, 0, -2);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, far: 40 });
  H.add(sun, sun.target);
}
const zHutong = figure(skins.zhangBody.texture, skins.zhangCivil.texture, 1.8);
H.add(zHutong.root);

/* ═══════════════════════════ 收藏者的老宅 ═══════════════════════════ */
const R = sets.house;
const plaster = pixelTex(16, 16, (x, y) => `hsl(38,14%,${30 + fbm(x * 0.5, y * 0.5, 4) * 10}%)`, [6, 2]);
const woodFloor = pixelTex(16, 16, (x, y) => (y % 4 === 0 ? "#2a1a10" : `hsl(24,32%,${20 + fbm(x * 0.3, y, 6) * 10}%)`), [4, 4]);
const widman = pixelTex(16, 16, (x, y) => {
  const a = Math.abs(((x + y) % 6) - 3) < 1, b = Math.abs(((x - y + 32) % 5) - 2) < 1, c = x % 7 === 3;
  return a || b || c ? "#c8c6c0" : `hsl(30,4%,${28 + fbm(x, y, 1) * 8}%)`;
});
let meteorBig: THREE.Mesh[] = [];
let meteorSmall: THREE.Mesh;
let rCup: THREE.Mesh, zCup: THREE.Mesh, phone: THREE.Mesh, magnifier: THREE.Mesh;
const caseLights: THREE.Object3D[] = [];
{
  box(8.4, 0.1, 6.4, std(0xffffff, { map: woodFloor }), 0, -0.05, 0, R);
  box(8.4, 3.2, 0.2, std(0xffffff, { map: plaster }), 0, 1.6, -3.1, R);
  box(0.2, 3.2, 6.4, std(0xffffff, { map: plaster }), -4.1, 1.6, 0, R);
  box(0.2, 3.2, 6.4, std(0xffffff, { map: plaster }), 4.1, 1.6, 0, R);
  box(8.4, 0.2, 6.4, std(0x1e1610), 0, 3.25, 0, R);
  for (let x = -3.5; x <= 3.5; x += 1.4) box(0.22, 0.26, 6.4, std(0x3a2414), x, 3.05, 0, R);
  // 右墙格子窗（宣纸透光）
  const paper = new THREE.MeshStandardMaterial({ color: 0xffe2b0, emissive: 0xffc070, emissiveIntensity: 0.9 });
  box(0.05, 1.3, 1.8, paper, 4.0, 1.75, 0.6, R);
  const lattice = std(0x2a1a0e);
  for (let i = 0; i <= 6; i++) box(0.08, 1.32, 0.04, lattice, 3.97, 1.75, -0.3 + i * 0.3, R);
  for (let i = 0; i <= 4; i++) box(0.08, 0.04, 1.82, lattice, 3.97, 1.1 + i * 0.325, 0.6, R);
  const win = new THREE.SpotLight(0xffc88a, 32, 12, 0.7, 0.8, 1.2);
  win.position.set(5, 2.6, 0.6); win.target.position.set(0.5, 0.3, -0.2);
  win.castShadow = true; win.shadow.mapSize.set(1024, 1024);
  R.add(win, win.target);
  R.add(new THREE.HemisphereLight(0x8a7a66, 0x1a120a, 0.55));

  // 玻璃陈列柜
  const glass = new THREE.MeshStandardMaterial({ color: 0xc8dce0, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.2, depthWrite: false });
  const wood = std(0x3b2414);
  const mkCase = (x: number, z: number, yaw: number, seed: number) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = yaw; R.add(g);
    box(1.5, 0.9, 0.55, wood, 0, 0.45, 0, g);
    box(1.5, 1.35, 0.55, glass, 0, 1.6, 0, g).castShadow = false;
    box(1.54, 0.06, 0.58, wood, 0, 2.3, 0, g);
    for (const sx of [-0.75, 0.75]) box(0.05, 1.35, 0.05, wood, sx, 1.6, 0.27, g);
    const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.02, 0.05), new THREE.MeshBasicMaterial({ color: 0xfff1d6 }));
    lightStrip.position.set(0, 2.24, 0.1); g.add(lightStrip);
    const r = rng(seed);
    for (const sy of [1.05, 1.55]) {
      box(1.4, 0.03, 0.5, std(0xd8d0c0), 0, sy - 0.02, 0, g);
      for (let i = 0; i < 4; i++) {
        const pal = r() > 0.5 ? [0x3a3632, 0x4a4540, 0x2c2a28] : [0x5a4632, 0x6b5440, 0x3e2e22];
        const m = new THREE.Mesh(rockGeom(seed * 10 + i + sy * 7, 2 + r() * 1.6, pal, 0.025), voxelMaterial({ roughness: 0.6, metalness: 0.3 }));
        m.position.set(-0.52 + i * 0.35, sy + 0.06, (r() - 0.5) * 0.12);
        m.rotation.y = r() * 3;
        g.add(m);
        const card = box(0.08, 0.004, 0.05, std(0xf2ece0), m.position.x + 0.1, sy + 0.005, 0.16, g);
        card.castShadow = false;
      }
    }
    const pl = new THREE.PointLight(0xffe2b8, 2.2, 2.4, 1.6);
    pl.position.set(0, 2.05, 0.15); g.add(pl); caseLights.push(pl);
  };
  mkCase(-2.2, -2.75, 0, 1);
  mkCase(0.0, -2.75, 0, 2);
  mkCase(2.2, -2.75, 0, 3);
  mkCase(-3.75, -1.0, Math.PI / 2, 4);
  mkCase(-3.75, 1.0, Math.PI / 2, 5);

  // 工作台
  box(1.7, 0.08, 0.85, std(0x4a2c18), 0.6, 0.82, -0.6, R);
  for (const [dx, dz] of [[-0.78, -0.36], [0.78, -0.36], [-0.78, 0.36], [0.78, 0.36]]) box(0.07, 0.8, 0.07, std(0x3a2214), 0.6 + dx, 0.4, -0.6 + dz, R);
  box(1.6, 0.012, 0.6, std(0x2e4a36), 0.6, 0.866, -0.6, R); // 绿色台垫
  // 台灯
  box(0.14, 0.03, 0.14, std(0x1a1a1a), -0.05, 0.875, -0.85, R);
  box(0.03, 0.42, 0.03, std(0x1a1a1a), -0.05, 1.08, -0.85, R);
  box(0.34, 0.1, 0.16, std(0x1e5a32, { roughness: 0.4 }), 0.08, 1.3, -0.75, R);
  const lampBulb = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.01, 0.12), new THREE.MeshBasicMaterial({ color: 0xfff2d0 }));
  lampBulb.position.set(0.08, 1.245, -0.75); R.add(lampBulb);
  const lamp = new THREE.SpotLight(0xffe0b0, 6, 3, 0.9, 0.6, 1.5);
  lamp.position.set(0.08, 1.24, -0.75); lamp.target.position.set(0.55, 0.85, -0.5);
  lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024);
  R.add(lamp, lamp.target);
  // 台上小物
  magnifier = new THREE.Mesh(magnifierGeom(), voxelMaterial());
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(rockGeom(40 + i, 1.6, [0x3a3632, 0x504840], 0.02), voxelMaterial());
    m.position.set(0.1 + i * 0.12, 0.89, -0.85); R.add(m);
  }
  // 茶具
  const teapot = new THREE.Mesh(buildVoxelGeometry({
    size: [7, 6, 7], at(x, y, z) { const d = (x - 3) ** 2 + (z - 3) ** 2; if (y < 5 && d < 9 + (y === 2 ? 2 : 0)) return 0x5a2a1a; if (y === 5 && d < 2) return 0x4a2014; if (y === 3 && x === 6 && z === 3) return 0x5a2a1a; return null; },
  }, { voxel: 0.026, anchor: "min" }), voxelMaterial({ roughness: 0.5 }));
  teapot.position.set(1.15, 0.87, -0.95); R.add(teapot);
  rCup = new THREE.Mesh(cupGeom(), voxelMaterial({ roughness: 0.3 }));
  zCup = new THREE.Mesh(cupGeom(), voxelMaterial({ roughness: 0.3 }));
  // 手机
  phone = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.01), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x5a8ab0, emissiveIntensity: 0.6 }));
  // 铁陨石
  const ironPal = [0x2c2a28, 0x3a3734, 0x47423c, 0x5a524a, 0x26221e];
  meteorSmall = new THREE.Mesh(rockGeom(77, 2.6, ironPal, 0.016), voxelMaterial({ roughness: 0.45, metalness: 0.6 }));
  meteorBig = [101, 202, 303].map((s, i) => {
    const m = new THREE.Mesh(rockGeom(s, 3.6, ironPal, 0.019), voxelMaterial({ roughness: 0.45, metalness: 0.6 }));
    const cut = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.003, 0.075), std(0xffffff, { map: widman, metalness: 0.8, roughness: 0.3 }));
    cut.position.y = 0.03; m.add(cut);
    m.position.set(0.32 + i * 0.2, 0.9, -0.45);
    m.rotation.y = i * 1.3;
    R.add(m);
    return m;
  });
  meteorSmall.position.set(0.85, 0.89, -0.38); R.add(meteorSmall);
}
const zHouse = figure(skins.zhangBody.texture, skins.zhangCivil.texture, 1.8);
const collector = figure(skins.collectorBody.texture, skins.collectorClothes.texture, 1.72);
R.add(zHouse.root, collector.root);
zHouse.anchors.handR.add(zCup); zCup.position.set(0, -1.2, 0.6); zCup.scale.setScalar(17.5);
collector.anchors.handR.add(rCup); rCup.position.set(0, -1.2, 0.6); rCup.scale.setScalar(17.5);
collector.anchors.handR.add(magnifier); magnifier.position.set(0, 0, 0.5);
zHouse.anchors.handR.add(phone); phone.position.set(0, 0, 1.4); phone.scale.setScalar(17.5);

/* ═══════════════════════════ 车间 ═══════════════════════════ */
const W = sets.shop;
const concrete = pixelTex(16, 16, (x, y) => `hsl(210,4%,${22 + fbm(x * 0.4, y * 0.4, 9) * 12}%)`, [12, 8]);
let chuck: THREE.Group, toolPost: THREE.Mesh, work: THREE.Mesh, screenTex: THREE.CanvasTexture, screenCtx: CanvasRenderingContext2D;
let trayGroup: THREE.Group, shopLamp: THREE.SpotLight, shopLampShade: THREE.Mesh, chips: THREE.Points, cutter: THREE.Mesh;
{
  box(26, 0.1, 18, std(0xffffff, { map: concrete }), 0, -0.05, 0, W);
  box(26, 7, 0.3, std(0x16191d), 0, 3.5, -8, W);
  // 高窗透进的月光
  for (let i = -3; i <= 3; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.05), new THREE.MeshBasicMaterial({ color: 0x2a3e5a }));
    win.position.set(i * 3.4, 5.2, -7.8); W.add(win);
  }
  const moon = new THREE.DirectionalLight(0x6f8ab8, 0.35);
  moon.position.set(-3, 8, -10); W.add(moon);
  W.add(new THREE.AmbientLight(0x1a2230, 0.6));
  // 被罩布盖着的其他机床
  const cloth = std(0x4a4e52);
  const r = rng(12);
  for (let i = 0; i < 8; i++) {
    const m = box(1.6 + r(), 1.1 + r() * 0.6, 1.0 + r() * 0.5, cloth, -9 + i * 2.6, 0.6, -4.5 + (i % 2) * 1.2, W);
    m.position.y = (m.geometry as THREE.BoxGeometry).parameters.height / 2;
  }
  // 数控车床
  const body = std(0x5a6a62, { roughness: 0.6, metalness: 0.3 });
  const dark = std(0x23272b, { roughness: 0.5, metalness: 0.5 });
  box(2.4, 0.85, 0.7, body, 0, 0.425, 0, W);
  box(2.2, 0.16, 0.42, dark, 0.1, 0.93, 0, W);
  box(0.56, 0.6, 0.6, body, -0.95, 1.15, 0, W);
  box(0.36, 0.5, 0.5, body, 1.0, 1.1, 0, W);
  chuck = new THREE.Group(); chuck.position.set(-0.6, 1.18, 0); W.add(chuck);
  const chuckGeo = buildVoxelGeometry({
    size: [3, 9, 9], at(x, y, z) { const d = (y - 4) ** 2 + (z - 4) ** 2; if (d > 17) return null; if (x === 2 && d < 3) return null; return (y === 4 || z === 4) && d > 4 ? 0x9aa0a6 : 0x4a4f55; },
  }, { voxel: 0.03 });
  chuck.add(new THREE.Mesh(chuckGeo, voxelMaterial({ metalness: 0.7, roughness: 0.35 })));
  work = new THREE.Mesh(rockGeom(303, 3.4, [0x2c2a28, 0x3a3734, 0x47423c], 0.022), voxelMaterial({ metalness: 0.6, roughness: 0.4 }));
  work.position.set(0.1, 0, 0); chuck.add(work);
  toolPost = box(0.14, 0.12, 0.14, dark, 0, 1.08, 0.12, W);
  cutter = box(0.02, 0.02, 0.1, std(0xd8c070, { metalness: 0.9, roughness: 0.2 }), 0, 0.02, -0.1, toolPost);
  // 防护罩框架
  box(2.0, 0.04, 0.04, std(0x8a9690), 0.1, 1.75, 0.38, W);
  // 控制面板 + 屏幕
  box(0.5, 0.7, 0.12, dark, 1.45, 1.4, 0.3, W);
  const sc = document.createElement("canvas"); sc.width = 64; sc.height = 48;
  screenCtx = sc.getContext("2d")!;
  screenTex = new THREE.CanvasTexture(sc); screenTex.magFilter = THREE.NearestFilter; screenTex.minFilter = THREE.NearestFilter;
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.27), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  scr.position.set(1.45, 1.48, 0.365); W.add(scr);
  // 吊灯
  shopLampShade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.5), new THREE.MeshStandardMaterial({ color: 0x1c2420, emissive: 0xfff0d0, emissiveIntensity: 0 }));
  shopLampShade.position.set(0, 3.2, 0.3); W.add(shopLampShade);
  box(0.02, 3, 0.02, std(0x111111), 0, 4.8, 0.3, W);
  shopLamp = new THREE.SpotLight(0xfff0d8, 40, 9, 0.55, 0.5, 1.2);
  shopLamp.position.set(0, 3.1, 0.3); shopLamp.target.position.set(0, 1, 0);
  shopLamp.castShadow = true; shopLamp.shadow.mapSize.set(1024, 1024);
  W.add(shopLamp, shopLamp.target);
  // 料盘
  box(0.7, 0.75, 0.5, dark, 1.5, 0.375, 0.9, W);
  box(0.5, 0.03, 0.34, std(0x8a8f94, { metalness: 0.6 }), 1.5, 0.765, 0.9, W);
  trayGroup = new THREE.Group(); trayGroup.position.set(1.5, 0.78, 0.9); W.add(trayGroup);
  const sg = slugGeom();
  for (let i = 0; i < 36; i++) {
    const m = new THREE.Mesh(sg, voxelMaterial({ metalness: 0.6, roughness: 0.4 }));
    m.scale.setScalar(1.6);
    m.position.set(-0.2 + (i % 9) * 0.045, 0, -0.12 + Math.floor(i / 9) * 0.07);
    trayGroup.add(m);
  }
  // 铁屑
  const cg = new THREE.BufferGeometry();
  cg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(120 * 3), 3));
  chips = new THREE.Points(cg, new THREE.PointsMaterial({ color: 0xffc070, size: 0.012, toneMapped: false }));
  W.add(chips);
}
const zShop = figure(skins.zhangBody.texture, skins.zhangCivil.texture, 1.8);
W.add(zShop.root);
function drawScreen(count: number, running: boolean) {
  const g = screenCtx;
  g.fillStyle = "#06140c"; g.fillRect(0, 0, 64, 48);
  g.fillStyle = running ? "#5cff8a" : "#2a8a4a";
  g.font = "8px monospace";
  g.fillText("PRG O0036", 3, 9);
  g.fillText(running ? "RUN" : "STOP", 44, 9);
  g.font = "bold 20px monospace";
  g.fillText(String(count).padStart(2, "0"), 6, 34);
  g.font = "8px monospace";
  g.fillText("/36", 36, 34);
  g.fillRect(3, 40, Math.round((count / 36) * 58), 4);
  screenTex.needsUpdate = true;
}

/* ═══════════════════════════ 地下室 ═══════════════════════════ */
const B = sets.base;
const redBrick = pixelTex(16, 16, (x, y) => {
  const row = Math.floor(y / 4);
  const off = row % 2 ? 4 : 0;
  if (y % 4 === 3 || (x + off) % 8 === 7) return "#3a2c24";
  return `hsl(12,38%,${22 + fbm(x * 0.8, y * 0.8, row) * 12}%)`;
}, [3, 2]);
let bulbLight: THREE.PointLight, bulbMesh: THREE.Mesh, flash: THREE.PointLight, bundle: THREE.Mesh, bundleHoles: THREE.Mesh, beef: THREE.Mesh;
const heads: THREE.Mesh[] = [], props: THREE.Mesh[] = [], slugs: THREE.Mesh[] = [];
let smoke: THREE.Points, fragments: THREE.Group, ammoLid: THREE.Mesh, knife: THREE.Mesh, basePistol: THREE.Mesh, baseFlash: THREE.Sprite;
{
  box(4, 0.1, 4, std(0xffffff, { map: concrete }), 0, -0.05, 0, B);
  const wm = std(0xffffff, { map: redBrick });
  box(4, 2.6, 0.2, wm, 0, 1.3, -1.9, B);
  box(0.2, 2.6, 4, wm, -1.9, 1.3, 0, B);
  box(0.2, 2.6, 4, wm, 1.9, 1.3, 0, B);
  box(4, 2.6, 0.2, wm, 0, 1.3, 1.9, B);
  box(4, 0.15, 4, std(0x2a2420), 0, 2.6, 0, B);
  // 楼梯
  for (let i = 0; i < 7; i++) box(0.8, 0.12, 0.3, std(0x4a4440), 1.4, 0.15 + i * 0.32, 1.6 - i * 0.28, B);
  // 灯泡
  box(0.006, 0.5, 0.006, std(0x111111), 0, 2.33, 0.2, B);
  bulbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.06), new THREE.MeshBasicMaterial({ color: 0xffd890, toneMapped: false }));
  bulbMesh.position.set(0, 2.05, 0.2); B.add(bulbMesh);
  bulbLight = new THREE.PointLight(0xffc880, 6, 7, 1.4);
  bulbLight.position.set(0, 1.98, 0.2);
  bulbLight.castShadow = true; bulbLight.shadow.mapSize.set(1024, 1024); bulbLight.shadow.bias = -0.002;
  B.add(bulbLight);
  B.add(new THREE.AmbientLight(0x30201a, 0.4));
  flash = new THREE.PointLight(0xffd0a0, 0, 8, 1.2); B.add(flash);
  // 桌子
  box(1.1, 0.05, 0.65, std(0x5a4030), 0, 0.75, 0.25, B);
  for (const [dx, dz] of [[-0.5, -0.27], [0.5, -0.27], [-0.5, 0.27], [0.5, 0.27]]) box(0.05, 0.75, 0.05, std(0x3a2a20), dx, 0.375, 0.25 + dz, B);
  // 三十六发无壳弹：发射药块 + 弹头
  const prop = std(0x8a7a52, { roughness: 0.8 });
  const copper = std(0xb87333, { metalness: 0.8, roughness: 0.3 });
  const sg = slugGeom();
  for (let i = 0; i < 36; i++) {
    const x = -0.2 + (i % 6) * 0.05, z = 0.15 + Math.floor(i / 6) * 0.04;
    const pr = box(0.022, 0.04, 0.022, prop, x, 0.795, z, B);
    const hd = box(0.016, 0.022, 0.016, copper, x, 0.826, z, B);
    const sl = new THREE.Mesh(sg, voxelMaterial({ metalness: 0.6, roughness: 0.4 }));
    sl.scale.setScalar(1.25);
    sl.position.set(x - 0.011, 0.815, z - 0.011);
    B.add(sl);
    props.push(pr); heads.push(hd); slugs.push(sl);
  }
  // 弹头碟
  box(0.12, 0.012, 0.12, std(0xb0b0b0, { metalness: 0.7 }), 0.32, 0.78, 0.15, B);
  // 子弹盒
  box(0.24, 0.06, 0.14, std(0x3a4a32), 0.34, 0.805, 0.4, B);
  ammoLid = box(0.24, 0.012, 0.14, std(0x2e3c28), 0.34, 0.84, 0.4, B);
  // 墙角：木箱上的布包（航天服材料，夹层）
  box(0.6, 0.6, 0.6, std(0x6a5038), -1.4, 0.3, -1.4, B);
  const suitCloth = pixelTex(8, 8, (x, y) => ((x + y) % 4 === 0 ? "#c9c6bc" : y % 3 === 0 ? "#b0ad a4".replace(" ", "") : "#dedbd2"));
  bundle = box(0.42, 0.32, 0.34, std(0xffffff, { map: suitCloth }), -1.4, 0.76, -1.4, B);
  bundleHoles = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.33, 0.35), new THREE.MeshBasicMaterial({
    map: pixelTex(16, 16, (x, y) => ([[6, 7], [9, 6], [7, 9], [10, 9]].some(([a, b]) => a === x && b === y) ? "#120806" : "#00000000")),
    transparent: true, alphaTest: 0.5,
  }));
  bundleHoles.position.copy(bundle.position); B.add(bundleHoles);
  // 生牛肉 + 碎屑
  beef = new THREE.Mesh(rockGeom(55, 5, [0x8a1e1a, 0x9a2a22, 0x7a1612, 0xd8c0b0], 0.025), voxelMaterial({ roughness: 0.4 }));
  beef.position.set(0.05, 0.85, 0.42); B.add(beef);
  fragments = new THREE.Group(); fragments.position.set(-0.3, 0.78, 0.45); B.add(fragments);
  const fr = rng(4);
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(rockGeom(500 + i, 1 + fr(), [0x3a3734, 0x4a4540, 0x2a2826], 0.006), voxelMaterial({ metalness: 0.6, roughness: 0.4 }));
    m.position.set((fr() - 0.5) * 0.08, 0, (fr() - 0.5) * 0.06); fragments.add(m);
  }
  box(0.2, 0.004, 0.16, std(0xe8e4dc), -0.3, 0.776, 0.45, B);
  knife = box(0.012, 0.004, 0.16, std(0xcfd4d8, { metalness: 0.9, roughness: 0.2 }), 0.25, 0.79, 0.5, B);
  // 烟
  const sgeo = new THREE.BufferGeometry();
  sgeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(200 * 3), 3));
  smoke = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0x8a8580, size: 0.09, transparent: true, opacity: 0.35, depthWrite: false }));
  B.add(smoke);
}
const zBase = figure(skins.zhangBody.texture, skins.zhangCivil.texture, 1.8);
B.add(zBase.root);
basePistol = new THREE.Mesh(pistolGeom(), voxelMaterial({ metalness: 0.5, roughness: 0.4 }));
zBase.anchors.handR.add(basePistol); basePistol.position.set(0, -0.6, 1.0);
baseFlash = glowSprite("rgba(255,200,120,1)", 6); baseFlash.position.set(0, 0.6, 3.6); basePistol.add(baseFlash);

/* ═══════════════════════════ 太空 ═══════════════════════════ */
const S = sets.space;
const EARTH = V(-150, -560, -2300);
const earth = earthMesh(); earth.position.copy(EARTH); S.add(earth);
const atmo = atmosphereMesh(); atmo.position.copy(EARTH); S.add(atmo);
const sun = sunMesh(); S.add(sun);
const sunGlow = glowSprite("rgba(255,214,160,1)", 2400); S.add(sunGlow);
const sunRim = glowSprite("rgba(255,120,40,1)", 3600); S.add(sunRim);
S.add(stars(3500, 12000));
const sunLight = new THREE.DirectionalLight(0xffd2a0, 3);
S.add(sunLight, sunLight.target);
const spaceAmb = new THREE.HemisphereLight(0x223048, 0x1a3a6a, 0.35); S.add(spaceAmb);
const station = new THREE.Group(); station.position.set(640, 0, 0); station.rotation.y = 0.55; S.add(station);
station.add(wheelStation(110, 4));
// 舱门
const hatch = new THREE.Group(); hatch.position.set(-129.5, 0, 0); hatch.rotation.y = -Math.PI / 2; station.add(hatch);
box(9, 9, 0.6, std(0x8c9096, { metalness: 0.5, roughness: 0.5 }), 0, 0, 0, hatch);
const hatchDoor = box(6.4, 6.4, 0.5, std(0x5a6068, { metalness: 0.6, roughness: 0.4 }), 0, 0, 0.3, hatch);
const hatchInside = new THREE.Mesh(new THREE.BoxGeometry(6.2, 6.2, 0.1), new THREE.MeshBasicMaterial({ color: 0xcfe6ff }));
hatchInside.position.set(0, 0, 0.32); hatch.add(hatchInside);
const signal = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.3), new THREE.MeshBasicMaterial({ color: 0xff2a1a, toneMapped: false }));
signal.position.set(4.0, 3.8, 0.5); hatch.add(signal);
const signalGlow = glowSprite("rgba(255,60,40,1)", 6); signalGlow.position.copy(signal.position); hatch.add(signalGlow);
// 太空电梯缆绳
{
  const top = station.position.clone();
  const dir = EARTH.clone().sub(top).normalize();
  const len = EARTH.distanceTo(top) - 700;
  const cable = new THREE.Mesh(new THREE.BoxGeometry(1.4, len, 1.4), new THREE.MeshBasicMaterial({ color: 0x8a9aaa }));
  cable.position.copy(top).addScaledVector(dir, len / 2);
  cable.quaternion.setFromUnitVectors(V(0, 1, 0), dir.clone().negate());
  S.add(cable);
  const terminus = box(18, 10, 18, std(0x9a9ea4, { metalness: 0.4 }), 0, 0, 0, S);
  terminus.position.copy(top).addScaledVector(dir, 260);
  const up = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2000, 1.4), new THREE.MeshBasicMaterial({ color: 0x5a6672 }));
  up.position.copy(top).addScaledVector(dir, -1000);
  up.quaternion.copy(cable.quaternion);
  S.add(up);
}
const yard = shipyard(6); yard.position.set(-520, 140, -760); yard.rotation.y = 0.4; S.add(yard);
const baseOne = new THREE.Group(); baseOne.position.set(-1500, 60, 900); S.add(baseOne);
{ const w = wheelStation(26, 2); baseOne.add(w); }
const baseBlink = glowSprite("rgba(120,200,255,1)", 40); baseOne.add(baseBlink);
// 漂浮的建材与垃圾
const debris: THREE.Mesh[] = [];
{
  const r = rng(31);
  for (let i = 0; i < 70; i++) {
    const m = box(1 + r() * 4, 0.6 + r() * 2, 1 + r() * 6, std(r() > 0.5 ? 0x8a8e94 : 0x6a5a48, { metalness: 0.4 }), 0, 0, 0, S);
    const ang = r() * Math.PI * 2, rad = 120 + r() * 700;
    m.position.set(200 + Math.cos(ang) * rad, (r() - 0.5) * 260, Math.sin(ang) * rad);
    (m as any).spin = [r() * 0.1, r() * 0.1, r() * 0.1];
    m.castShadow = false;
    debris.push(m);
  }
}
// 远处穿行的“太空自行车”
const commuters: THREE.Sprite[] = [];
for (let i = 0; i < 6; i++) { const sp = glowSprite("rgba(255,255,255,1)", 6); S.add(sp); commuters.push(sp); }

// 章北海（太空）
const zSpace = figure(skins.zhangSpaceBody.texture, skins.zhangSuit.texture, 1.8);
lifePack(zSpace, 0x7c8593);
S.add(zSpace.root);
const spacePistol = new THREE.Mesh(pistolGeom(), voxelMaterial({ metalness: 0.5, roughness: 0.4 }));
spacePistol.position.set(0, -0.6, 1.0);
const muzzle = glowSprite("rgba(255,210,150,1)", 9); muzzle.position.set(0, 0.6, 3.8); spacePistol.add(muzzle);
const scope = new THREE.Mesh(scopeGeom(), voxelMaterial({ metalness: 0.4, roughness: 0.5 }));
const glove = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 4.2), std(0x5a606a));

// 合影者
const HATCH_POS = new THREE.Vector3(), HATCH_N = new THREE.Vector3();
station.updateMatrixWorld(true);
hatch.getWorldPosition(HATCH_POS);
HATCH_N.set(0, 0, 1).applyQuaternion(hatch.getWorldQuaternion(new THREE.Quaternion())).normalize();
const GROUP_C = HATCH_POS.clone().addScaledVector(HATCH_N, 24);
const LAT = V(HATCH_N.z, 0, -HATCH_N.x).normalize();
const PHOTO_POS = HATCH_POS.clone().addScaledVector(HATCH_N, 36).addScaledVector(LAT, -1);
const groupYaw = Math.atan2(HATCH_N.x, HATCH_N.z);
type Member = { f: Figure; slot: THREE.Vector3; order: number; target: boolean; victim: boolean; elder: boolean; seed: number; scream?: boolean };
const crew: Member[] = [];
{
  const rows = [9, 10, 10];
  let order = 0;
  rows.forEach((n, r) => {
    for (let c = 0; c < n; c++) {
      const isTarget = r === 0 && c >= 3 && c <= 5;
      const isVictim = isTarget || (r === 0 && c === 6) || (r === 1 && c === 4);
      const elder = isTarget || (r === 0 && (c === 2 || c === 6));
      const body = isTarget ? skins.elderBodies[c - 3] : elder ? skins.elderBodies[(c + 1) % 3] : skins.crewBodies[(c + r) % 4];
      const f = figure(body.texture, skins.whiteDark.texture, 1.72 + ((c * 7 + r) % 5) * 0.03);
      lifePack(f);
      const slot = GROUP_C.clone()
        .addScaledVector(LAT, (c - (n - 1) / 2) * 1.3 + (r % 2 ? 0.3 : 0))
        .addScaledVector(V(0, 1, 0), r * 1.05 - 1.0)
        .addScaledVector(HATCH_N, -r * 0.9);
      S.add(f.root);
      crew.push({ f, slot, order: order++, target: isTarget, victim: isVictim, elder, seed: r * 10 + c, scream: r === 0 && c === 1 });
    }
  });
}
const photographer = figure(skins.crewBodies[1].texture, skins.whiteDark.texture, 1.75);
lifePack(photographer);
S.add(photographer.root);
const photoLamp = new THREE.PointLight(0xfff4e6, 260, 60, 1.6);
photoLamp.position.copy(PHOTO_POS).add(V(0, 3, 0)).addScaledVector(LAT, 4);
S.add(photoLamp);
const photoCam = box(5, 4, 4, std(0x1a1a1a), 0, 0, 2, photographer.anchors.handR);
void photoCam;

/* ── 粒子：喷气、白雾、血与冰晶 ── */
type Emitter = { t0: number; t1: number; at: (t: number) => THREE.Vector3; dir: THREE.Vector3; speed: number; spread: number; rate: number; life: number; color: [number, number, number]; to?: [number, number, number]; seed: number };
const emitters: Emitter[] = [];
const MAXP = 9000;
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAXP * 3), 3));
pGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(MAXP * 3), 3));
const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
particles.frustumCulled = false;
S.add(particles);
function updateParticles(t: number) {
  const pos = pGeo.attributes.position.array as Float32Array;
  const col = pGeo.attributes.color.array as Float32Array;
  let n = 0;
  for (const e of emitters) {
    if (t < e.t0) continue;
    const total = Math.floor((Math.min(t, e.t1) - e.t0) * e.rate);
    const first = Math.max(0, Math.floor((t - e.life - e.t0) * e.rate));
    for (let k = first; k <= total && n < MAXP; k++) {
      const te = e.t0 + k / e.rate;
      const age = t - te;
      if (age < 0 || age > e.life) continue;
      const h1 = Math.sin(k * 12.9898 + e.seed * 78.233) * 43758.5453, r1 = h1 - Math.floor(h1);
      const h2 = Math.sin(k * 39.346 + e.seed * 11.135) * 24634.6345, r2 = h2 - Math.floor(h2);
      const h3 = Math.sin(k * 73.156 + e.seed * 52.235) * 12345.678, r3 = h3 - Math.floor(h3);
      const o = e.at(te);
      const sp = e.speed * (0.6 + r3 * 0.8);
      pos[n * 3] = o.x + (e.dir.x + (r1 - 0.5) * e.spread) * sp * age;
      pos[n * 3 + 1] = o.y + (e.dir.y + (r2 - 0.5) * e.spread) * sp * age;
      pos[n * 3 + 2] = o.z + (e.dir.z + (r3 - 0.5) * e.spread) * sp * age;
      const lf = 1 - age / e.life;
      const c = e.color, d = e.to ?? e.color;
      const m = e.to ? clamp(age / (e.life * 0.35)) : 0;
      col[n * 3] = mix(c[0], d[0], m) * lf;
      col[n * 3 + 1] = mix(c[1], d[1], m) * lf;
      col[n * 3 + 2] = mix(c[2], d[2], m) * lf;
      n++;
    }
  }
  for (let i = n; i < MAXP; i++) { pos[i * 3 + 1] = -99999; }
  pGeo.attributes.position.needsUpdate = true;
  pGeo.attributes.color.needsUpdate = true;
  pGeo.setDrawRange(0, n);
}

/* ── 太空时间函数 ── */
function sunY(t: number) {
  const tt = t < 200 ? 252 : t;
  const keys: Array<[number, number]> = [[200, 1500], [242, 860], [250, 650], [258, 560], [300, 380], [348, 200]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, ya] = keys[i], [b, yb] = keys[i + 1];
    if (tt <= b) return mix(ya, yb, clamp((tt - a) / (b - a)));
  }
  return 200;
}
function updateSky(t: number) {
  const y = sunY(t);
  const p = V(-520, y, -9000);
  sun.position.copy(p); sun.scale.setScalar(1);
  sunGlow.position.copy(p);
  sunRim.position.copy(p).add(V(0, -150, 0));
  const vis = clamp((y - 420) / 500);
  sunLight.position.copy(p).normalize().multiplyScalar(2000);
  sunLight.intensity = 0.15 + 3.2 * vis;
  sunLight.color.setHSL(0.07 + 0.04 * vis, 0.9, 0.6 + 0.1 * vis);
  (sunRim.material as THREE.SpriteMaterial).opacity = 0.6 * (1 - Math.abs(vis - 0.35) * 1.4);
  (sunGlow.material as THREE.SpriteMaterial).opacity = 0.9;
  earth.rotation.y = t * 0.002;
  for (const d of debris) { const s = (d as any).spin; d.rotation.set(t * s[0], t * s[1], t * s[2]); }
  commuters.forEach((c, i) => {
    const k = ((t * 0.01 + i * 0.17) % 1);
    const a = V(640, 0, 0), b = V(-500 + i * 80, -120 + i * 60, 400 - i * 200);
    c.position.copy(a).lerp(b, k);
    c.visible = true;
  });
  const blink = Math.sin(t * 3) > 0.7;
  baseBlink.visible = blink;
}

/* ── 章北海在太空中的表演 ── */
function zhangSpace(t: number) {
  const f = zSpace;
  const base = floatPose(t * 0.7);
  const calm: Pose = lerpPose(base, { hips: [-0.05, 0, 0], legR: [-0.25, 0, 0.05], legL: [-0.1, 0, -0.05], armR: [-0.3, 0, 0.25], armL: [-0.3, 0, -0.25] }, 0.6);
  let pose = calm;
  // 视镜：240–262 举起瞄准镜当望远镜
  const scopeUp = seg(t, 242, 244) * (1 - seg(t, 261.6, 262.6));
  const scopeHold: Pose = { ...calm, armR: [-1.9, 0.2, 0.42], neck: [0.05, 0, 0] };
  pose = lerpPose(pose, scopeHold, sm(scopeUp));
  // 摘手套 263–266
  const gl = seg(t, 262.6, 263.4) * (1 - seg(t, 265.6, 266.2));
  pose = lerpPose(pose, { ...calm, armR: [-1.2, 0, 0.2], armL: [-1.3, 0, -0.6], neck: [0.4, 0, 0] }, sm(gl));
  // 侧身让阳光照到手 + 取枪 266–270
  const draw = seg(t, 266, 267.5) * (1 - seg(t, 269.6, 270.2));
  pose = lerpPose(pose, { ...calm, armR: [-0.4, 0, 0.6], armL: [-0.8, 0, -0.3], neck: [0.3, 0.3, 0] }, sm(draw));
  // 装镜、上弹 270–274，瞄准 274–289
  const am = seg(t, 270, 271.2) * (1 - seg(t, 289.5, 292));
  const aimPose = aim(0.02 + Math.sin(t * 0.8) * 0.008, 0);
  const reloadDip = Math.max(0, 1 - Math.abs(t - 280.1) / 0.5) + Math.max(0, 1 - Math.abs(t - 284.0) / 0.5) + Math.max(0, 1 - Math.abs(t - 272.9) / 0.6);
  aimPose.armL = [-1.1 + reloadDip * 0.3, 0.2, -0.5];
  // 后坐力
  let recoil = 0;
  for (const st of SHOT_TIMES) { const d = t - st; if (d >= 0 && d < 0.18) recoil = Math.max(recoil, 1 - d / 0.18); }
  aimPose.armR = [-Math.PI / 2 - recoil * 0.12, 0, 0.09];
  aimPose.neck = [0.02, -0.12, 0];
  pose = lerpPose(pose, aimPose, sm(am));
  applyPose(f, pose);
  // 根节点：位置与朝向
  let yaw = Math.PI / 2;
  yaw += draw * -0.5;
  const turn = sm(seg(t, 312, 318));
  yaw = mix(yaw, -1.03, turn);
  const away = V(-1500, 60, 900).normalize();
  const d = Math.pow(Math.max(0, t - 316), 2) * 0.9;
  f.root.position.set(0, Math.sin(t * 0.4) * 0.05, 0).addScaledVector(away, d);
  f.root.rotation.order = "YXZ";
  f.root.rotation.set(turn * 1.1, yaw, 0);
  // 服装：面罩
  const tex = t >= 263.2 && t < 336 ? skins.zhangSuitGloveOff : t >= 233 ? skins.zhangSuitClear : skins.zhangSuit;
  if ((f as any)._tex !== tex) { f.setClothes(tex.texture); (f as any)._tex = tex; }
  // 道具
  const holdGun = t >= 267.2 && t < 336;
  spacePistol.visible = holdGun || t < 15;
  reparent(spacePistol, f.anchors.handR);
  if (t < 15) applyPose(f, lerpPose(calm, { ...aimPose, armR: [-Math.PI / 2, 0, 0.09], neck: [0.02, -0.1, 0] }, 1));
  // 瞄准镜
  if (t < 15 || t >= 270.9) {
    reparent(scope, spacePistol); scope.position.set(0, 1.5, 0.6); scope.rotation.set(0, 0, 0); scope.visible = true;
  } else if (t >= 242 && t < 262.6) {
    reparent(scope, f.anchors.handR); scope.position.set(0, 0, 1.2); scope.rotation.set(0, 0, 0); scope.visible = true;
  } else if (t >= 262.6 && t < 270.9) {
    reparent(scope, f.root); scope.visible = true;
    const k = seg(t, 270.0, 270.9);
    scope.position.set(4, 22 + Math.sin(t) * 0.3, 9 + k * 1);
    scope.rotation.set(Math.sin(t * 0.3) * 0.2, 1.2 + t * 0.05, 0.1);
  } else scope.visible = false;
  // 手套漂在身旁
  reparent(glove, f.root);
  glove.visible = t >= 263.6 && t < 336;
  glove.position.set(-7 - (t - 263.6) * 0.5, 16 + (t - 263.6) * 0.2, 6);
  glove.rotation.set(t * 0.4, t * 0.3, 0);
  // 枪口火光：真空中没有声音，只有光
  let fl = 0;
  const shots = t < 15 ? [6.2, 6.6, 7.0] : SHOT_TIMES;
  for (const st of shots) { const dd = t - st; if (dd >= 0 && dd < 0.07) fl = 1; }
  muzzle.visible = fl > 0;
  muzzle.scale.setScalar(t < 15 ? 30 : 9);
}

/* ── 合影者 ── */
const victimHitTimes = [300.4, 300.9, 301.5, 302.2, 302.9];
/** 合影者的位置是时间的纯函数，粒子可以从历史位置发射，拖出真正留在原地的白雾。 */
function memberPos(m: Member, t: number) {
  const flee = 304.6;
  const tOut = 247.2 + m.order * 0.18;
  const k = seg(t, tOut, tOut + 4.5);
  const drift = V(Math.sin(t * 0.3 + m.seed) * 0.12, Math.sin(t * 0.37 + m.seed * 2) * 0.12, Math.cos(t * 0.29 + m.seed) * 0.12);
  const p = HATCH_POS.clone().lerp(m.slot, ease(k)).add(drift);
  // 一个目标在等待中缓缓漂移（悬念），随后又被同伴拉回
  if (m.target && m.seed === 4) p.addScaledVector(LAT, Math.sin(seg(t, 292, 300) * Math.PI) * 0.6);
  const vi = (m as any).vi ?? ((m as any).vi = crew.filter((c) => c.victim).indexOf(m));
  const hitT = vi >= 0 ? victimHitTimes[vi] : 1e9;
  // 撤回舱门
  const back = seg(t, flee + (m.victim ? 1.2 : 0) + (m.order % 7) * 0.15, flee + 7 + (m.victim ? 1.5 : 0));
  p.lerp(HATCH_POS, ease(back));
  // 中弹冲击
  let jolt = 0;
  if (t > hitT) jolt = Math.min(1, (t - hitT) * 4);
  if (t > hitT) p.addScaledVector(HATCH_N, -Math.min(1.2, (t - hitT) * 0.5));
  return { p, k, back, jolt };
}
function crewUpdate(t: number) {
  const flee = 304.6;
  for (const m of crew) {
    const f = m.f;
    const tOut = 247.2 + m.order * 0.18;
    const visible = t >= tOut && t < 316 + (m.victim ? 1.5 : 0);
    f.root.visible = visible;
    if (!visible) continue;
    const { p, k, back, jolt } = memberPos(m, t);
    f.root.position.copy(p);
    f.root.rotation.set(-jolt * 0.5 + Math.sin(t * 0.5 + m.seed) * 0.04, groupYaw + Math.sin(t * 0.2 + m.seed) * 0.08 - back * Math.PI, jolt * 0.3 * (m.seed % 2 ? 1 : -1));
    let pose = lerpPose(floatPose(t + m.seed), { armR: [-0.2, 0, 0.15], armL: [-0.2, 0, -0.15], legR: [-0.1, 0, 0], legL: [-0.05, 0, 0] }, 0.6);
    if (k < 1) pose = lerpPose(pose, { hips: [0.5, 0, 0], armR: [0.4, 0, 0.3], armL: [0.4, 0, -0.3], legR: [0.2, 0, 0], legL: [0.2, 0, 0] }, 1 - k);
    if (jolt > 0) pose = lerpPose(pose, { hips: [0.6, 0, 0.3], neck: [0.7, 0, 0.2], armR: [-0.4, 0, 1.4], armL: [-0.2, 0, -1.6], legR: [-0.8, 0, 0], legL: [-0.4, 0, 0] }, jolt);
    else if (t > 300.3 && t < 306) pose = lerpPose(pose, { neck: [-0.2, 0.3, 0], armR: [-2.6, 0, 0.6], armL: [-2.4, 0, -0.6] }, seg(t, 300.5 + m.order * 0.03, 301.4));
    applyPose(f, pose);
    // 面罩：日光转弱后逐个调透明
    const clearT = 256 + (m.order % 10) * 0.35;
    let tex = t > clearT ? skins.whiteClear : skins.whiteDark;
    if (m.target && m.seed === 4 && t > 301.5) tex = skins.whiteCrack;
    if ((f as any)._tex !== tex) { f.setClothes(tex.texture); (f as any)._tex = tex; }
    const bodyTex = m.scream && t > 303.6 && t < 312 ? skins.screamBody : null;
    if ((f as any)._body !== bodyTex) {
      f.setBody((bodyTex ?? (m.elder ? skins.elderBodies[0] : skins.crewBodies[m.seed % 4])).texture);
      (f as any)._body = bodyTex;
    }
  }
  // 摄影师
  const pk = seg(t, 246.8, 251);
  photographer.root.visible = t > 246.8 && t < 315;
  const pp = HATCH_POS.clone().lerp(PHOTO_POS, ease(pk)).lerp(HATCH_POS, ease(seg(t, flee, flee + 6)));
  photographer.root.position.copy(pp);
  photographer.root.rotation.set(0, groupYaw + Math.PI + seg(t, flee, flee + 1) * Math.PI, 0);
  applyPose(photographer, lerpPose(floatPose(t), { armR: [-1.4 + Math.sin(t * 2) * 0.1, 0, 0.1], armL: [-1.4 + (t > 249 && t < 255 ? Math.sin(t * 5) * 0.5 : 0), 0, -0.3] }, 0.8));
  // 舱门与信号灯
  const open = seg(t, 246.8, 247.4) * (1 - seg(t, 316.5, 317.5));
  hatchDoor.position.x = open * 7;
  const green = t >= 246.3 && t < 304.6;
  (signal.material as THREE.MeshBasicMaterial).color.set(green ? 0x30ff60 : 0xff2a1a);
  (signalGlow.material as THREE.SpriteMaterial).color.set(green ? 0x30ff60 : 0xff3a2a);
  hatchInside.visible = open > 0.05;
}
function chestOf(f: Figure, out = new THREE.Vector3()) { return f.parts.torso.getWorldPosition(out); }
function buildEmitters() {
  // 合影者出舱与归队时推进器的白雾
  for (const m of crew) {
    const tOut = 247.2 + m.order * 0.18;
    emitters.push({ t0: tOut, t1: tOut + 3.5, at: (te) => memberPos(m, te).p.add(V(0, 1, 0)), dir: HATCH_N.clone().negate(), speed: 3, spread: 0.6, rate: 18, life: 4, color: [0.5, 0.5, 0.52], seed: m.order });
    emitters.push({ t0: 305 + (m.order % 7) * 0.15, t1: 312, at: (te) => memberPos(m, te).p.add(V(0, 1, 0)), dir: HATCH_N.clone(), speed: 6, spread: 0.5, rate: 22, life: 3.5, color: [0.55, 0.55, 0.58], seed: 100 + m.order });
  }
  // 中弹：泄漏的白汽，背后推进器被击穿的大团白汽，血与冰晶
  const victims = crew.filter((c) => c.victim);
  victims.forEach((m, i) => {
    const t0 = victimHitTimes[i];
    const at = (te: number) => memberPos(m, te).p.add(V(0, 1.15, 0));
    for (let j = 0; j < 3; j++) {
      const dir = HATCH_N.clone().negate().add(V(Math.sin(i * 3 + j) * 0.5, Math.cos(i * 2 + j) * 0.5, 0)).normalize();
      emitters.push({ t0: t0 + j * 0.25, t1: t0 + 9, at, dir, speed: 4.5, spread: 0.35, rate: 70, life: 2.4, color: [0.9, 0.92, 0.95], seed: 300 + i * 10 + j });
    }
    if (i === 1 || i === 3) emitters.push({ t0: t0 + 0.4, t1: t0 + 1.6, at, dir: HATCH_N.clone(), speed: 7, spread: 1.6, rate: 400, life: 3, color: [1, 1, 1], seed: 400 + i });
    if (m.target && m.seed === 4) emitters.push({ t0: t0 + 0.2, t1: t0 + 3, at: (te) => memberPos(m, te).p.add(V(0, 1.55, 0)), dir: HATCH_N.clone().negate(), speed: 3, spread: 0.8, rate: 120, life: 3, color: [0.9, 0.05, 0.03], to: [0.85, 0.9, 1.0], seed: 500 });
  });
}
buildEmitters();

/* 子弹特写用的大号陨石弹头 */
const flySlug = new THREE.Mesh(slugGeom(0x3e3c38), voxelMaterial({ metalness: 0.7, roughness: 0.35 }));
flySlug.scale.setScalar(5);
S.add(flySlug);

/* ═════════════ 镜头表 ═════════════ */
type ShotDef = { id: string; start: number; end: number; set: SetName; scope?: boolean; run: (t: number, lt: number, p: number) => void };
const Z0 = V(0, 0, 0);

function houseActors(t: number) {
  // 收藏者：放大镜 → 端茶 → 讲解 → 去柜子 → 回来 → 摆陨石
  const toCase = seg(t, 93.6, 95.4), fromCase = seg(t, 95.6, 97.2);
  const cx = mix(mix(0.6, -3.0, sm(toCase)), 0.6, sm(fromCase));
  const cz = mix(mix(-1.35, -1.2, sm(toCase)), -1.35, sm(fromCase));
  const walking = (toCase > 0 && toCase < 1) || (fromCase > 0 && fromCase < 1);
  const cyaw = walking ? (toCase < 1 ? -Math.PI / 2 : Math.PI / 2) : toCase >= 1 && fromCase <= 0 ? -Math.PI / 2 - 0.3 : 0;
  face(collector, cx, cz, cyaw);
  let cp: Pose = idle(t);
  const magnify = 1 - seg(t, 44, 46);
  cp = lerpPose(cp, { hips: [0.35, 0, 0], neck: [0.5, 0, 0], armR: [-1.1, 0, 0.1], armL: [-0.7, 0, -0.1] }, magnify);
  magnifier.visible = t < 46;
  const tea = seg(t, 47.6, 48.6) * (1 - seg(t, 50.6, 51.4));
  cp = lerpPose(cp, { armR: [-1.15, 0, 0.05], neck: [0.15, 0, 0] }, tea);
  rCup.visible = t > 47.6 && t < 51;
  zCup.visible = t > 50.4 && t < 84;
  const gestures = (a: number, b: number, amt: number) => seg(t, a, a + 0.6) * (1 - seg(t, b - 0.6, b));
  cp = lerpPose(cp, { armR: [-1.0 + Math.sin(t * 2.2) * 0.25, 0.2, 0.3], armL: [-0.4, 0, -0.1] }, gestures(65.4, 71.8, 1));
  cp = lerpPose(cp, { armR: [-1.4, 0, 0.1], neck: [-0.1, 0.1, 0.05], hips: [-0.06, 0, 0] }, gestures(82.4, 86.6, 1)); // 指点着笑
  cp = lerpPose(cp, { armR: [-0.7, 0, 0.1], armL: [-0.7, 0, -0.1], hips: [0.3, 0, 0], neck: [0.3, 0, 0] }, gestures(97.6, 103, 1) + gestures(104, 106.2, 1));
  cp = lerpPose(cp, { armR: [-2.6, 0, -0.4], neck: [0.15, 0.2, 0] }, gestures(118.2, 121.6, 1)); // 挠头
  if (walking) cp = walk(t, 1.6);
  applyPose(collector, cp);
  // 章北海
  const enter = seg(t, 38, 44);
  face(zHouse, mix(3.4, 0.6, sm(enter)), mix(1.2, 0.25, sm(enter)), enter < 1 ? -Math.PI / 2 - 0.6 * enter - 0.4 : Math.PI);
  let zp: Pose = enter > 0 && enter < 1 ? walk(t, 1.3) : idle(t * 0.8);
  zp = lerpPose(zp, { armR: [-1.0, 0, 0.1] }, seg(t, 50.4, 51.2) * (1 - seg(t, 83.4, 84)));
  zp = lerpPose(zp, { armR: [-1.7, 0, 0.12], neck: [-0.05, 0, 0] }, seg(t, 78.2, 79) * (1 - seg(t, 81.4, 82)));
  zp = lerpPose(zp, { armR: [-1.0, 0, 0.2], armL: [-0.9, 0, -0.25], neck: [0.45, 0, 0] }, seg(t, 111.6, 112.3) * (1 - seg(t, 116.4, 117)));
  zp = lerpPose(zp, { neck: [0.4, 0, 0] }, seg(t, 124.8, 126));
  if (t < 38) zHouse.root.visible = false; else zHouse.root.visible = true;
  phone.visible = t > 111.6 && t < 117;
  applyPose(zHouse, zp);
  meteorSmall.visible = t > 96;
  meteorBig.forEach((m, i) => (m.visible = t > [104.2, 105.0, 105.7][i]));
}

function shopUpdate(t: number) {
  const on = t > 134.2 && t < 156.6;
  shopLamp.intensity = on ? 40 : t < 134.2 ? 0 : 0;
  (shopLampShade.material as THREE.MeshStandardMaterial).emissiveIntensity = on ? 1.2 : 0;
  const run = t > 136.5 && t < 151.5;
  chuck.rotation.x = run ? (t - 136.5) * 40 : 0;
  const prog = seg(t, 137, 151);
  const count = Math.floor(prog * 36);
  if ((screenTex as any)._c !== count + (run ? 100 : 0)) { drawScreen(count, run); (screenTex as any)._c = count + (run ? 100 : 0); }
  toolPost.position.x = -0.35 + ((t * 0.6) % 1) * 0.35;
  cutter.visible = t < 153;
  work.scale.setScalar(1 - prog * 0.6);
  trayGroup.children.forEach((c, i) => (c.visible = i < count));
  // 铁屑
  const arr = chips.geometry.attributes.position.array as Float32Array;
  for (let i = 0; i < 120; i++) {
    const ph = ((t * 2.3 + i * 0.137) % 1);
    const a = i * 2.39996;
    const live = run && prog < 1;
    arr[i * 3] = live ? toolPost.position.x + Math.cos(a) * ph * 0.4 : 0;
    arr[i * 3 + 1] = live ? 1.18 + Math.sin(a) * ph * 0.25 + ph * 0.15 - ph * ph * 0.6 : -10;
    arr[i * 3 + 2] = live ? 0.08 + ph * 0.35 : 0;
  }
  chips.geometry.attributes.position.needsUpdate = true;
  // 章北海
  const walkIn = seg(t, 132.4, 134.6);
  face(zShop, mix(-3, 0.3, sm(walkIn)), mix(2.5, 0.85, sm(walkIn)), walkIn < 1 ? 2.2 : Math.PI);
  let p: Pose = walkIn < 1 ? walk(t, 1.2) : idle(t);
  p = lerpPose(p, { armR: [-1.0, 0.3, 0.2], neck: [0.35, 0, 0] }, seg(t, 135, 136) * (1 - seg(t, 152, 152.5)));
  p = lerpPose(p, { hips: [0.3, 0, 0], armR: [-1.2, 0, 0.1], armL: [-1.2, 0, -0.1], neck: [0.4, 0, 0] }, seg(t, 152.5, 153) * (1 - seg(t, 155.8, 156.2)));
  if (t > 156.2) p = lerpPose(p, walk(t, 1.2), seg(t, 156.6, 157));
  applyPose(zShop, p);
  if (t > 156.8) zShop.root.position.x -= (t - 156.8) * 1.2;
}

function baseUpdate(t: number) {
  // 灯泡轻微闪烁
  const flick = 1 + Math.sin(t * 37) * 0.03 + (Math.sin(t * 3.3) > 0.97 ? -0.3 : 0);
  const lightsOff = t > 199.3;
  bulbLight.intensity = lightsOff ? 0 : 6 * flick;
  (bulbMesh.material as THREE.MeshBasicMaterial).color.set(lightsOff ? 0x111111 : 0xffd890);
  // 拔弹头
  const pulled = Math.floor(seg(t, 159.4, 165) * 36);
  const glued = Math.floor(seg(t, 166.4, 171.5) * 36);
  const loaded = t > 176.2 ? 4 : t > 175.5 ? 3 : t > 174.8 ? 2 : t > 174.1 ? 1 : 0;
  const packed = t > 195.6;
  for (let i = 0; i < 36; i++) {
    heads[i].visible = i >= pulled;
    const isLoaded = i < loaded;
    slugs[i].visible = i < glued && !isLoaded && !packed;
    props[i].visible = !isLoaded && !packed;
  }
  ammoLid.position.y = packed ? 0.84 : 0.9;
  ammoLid.rotation.x = packed ? 0 : -1.2;
  // 布包与牛肉
  bundleHoles.visible = t > 181.0;
  const opened = t > 186.4;
  bundle.visible = !opened;
  bundleHoles.visible = bundleHoles.visible && !opened;
  beef.visible = opened && t < 196;
  fragments.visible = t > 189.8 && t < 196;
  knife.visible = t > 186.4 && t < 196;
  knife.position.set(0.22 - seg(t, 187.4, 188.4) * 0.1, 0.8, 0.5);
  // 枪火与烟
  let fl = 0;
  for (const st of ROOM_SHOTS) { const d = t - st; if (d >= 0 && d < 0.06) fl = 1 - d / 0.06; }
  flash.intensity = fl * 60;
  baseFlash.visible = fl > 0;
  basePistol.getWorldPosition(flash.position);
  const sm_ = smoke.geometry.attributes.position.array as Float32Array;
  for (let i = 0; i < 200; i++) {
    const st = ROOM_SHOTS[i % 4];
    const age = t - st;
    const live = age > 0 && t < 196;
    const r1 = Math.sin(i * 12.9) * 0.5, r2 = Math.cos(i * 7.3) * 0.5, r3 = Math.sin(i * 3.1);
    sm_[i * 3] = live ? -0.35 + r1 * Math.min(age, 6) * 0.25 - Math.min(age, 1) * 0.5 : 0;
    sm_[i * 3 + 1] = live ? 1.35 + r2 * 0.4 + age * 0.03 : -10;
    sm_[i * 3 + 2] = live ? -0.1 + r3 * Math.min(age, 6) * 0.2 - Math.min(age, 1) * 0.5 : 0;
  }
  smoke.geometry.attributes.position.needsUpdate = true;
  // 章北海
  const aiming = seg(t, 179.4, 180.4) * (1 - seg(t, 184.2, 185.2));
  const yawToBundle = Math.atan2(-1.4 - 0.1, -1.4 - 0.95);
  face(zBase, 0.05, 0.95, mix(Math.PI, yawToBundle, sm(aiming)));
  let p: Pose = idle(t);
  const bent: Pose = { hips: [0.42, 0, 0], neck: [0.45, 0, 0], armR: [-1.1 + Math.sin(t * 4) * 0.08, 0, 0.15], armL: [-1.0, 0, -0.2], legR: [-0.2, 0, 0], legL: [-0.2, 0, 0] };
  p = lerpPose(p, bent, seg(t, 158, 159) * (1 - seg(t, 178.6, 179.4)) + seg(t, 186.2, 187) * (1 - seg(t, 195.8, 196.6)));
  let recoil = 0;
  for (const st of ROOM_SHOTS) { const d = t - st; if (d >= 0 && d < 0.2) recoil = Math.max(recoil, 1 - d / 0.2); }
  const ap = aim(0.22 - recoil * 0.3, 0);
  p = lerpPose(p, ap, sm(aiming));
  if (t > 196.8) { p = walk(t, 1.1); zBase.root.position.set(0.05 + (t - 196.8) * 0.4, 0, 0.95 + (t - 196.8) * 0.1); zBase.root.rotation.y = 1.4; }
  applyPose(zBase, p);
  basePistol.visible = t > 173 && t < 196.2;
}

const shotDefs: ShotDef[] = [];
const add = (id: string, start: number, end: number, set: SetName, run: ShotDef["run"], scope = false) => shotDefs.push({ id, start, end, set, run, scope });

/* ─── 冷开场：闪前。萤火虫 ─── */
add("01-firefly", 0, 21, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(0); updateParticles(0);
  const k = sm(seg(lt, 0, 15));
  camLerp(V(-26, 6, 70), V(-14, 3, 40), V(4, 0, -40), V(2, -1, -30), k, 32);
});

/* ─── 胡同 ─── */
add("02-hutong", 21, 33, "hutong", (t, lt) => {
  const k = seg(t, 22, 30);
  face(zHutong, mix(0.5, -1.2, sm(seg(t, 28.6, 30))), mix(8, 0.4, k), k < 1 ? Math.PI : -Math.PI / 2);
  applyPose(zHutong, k < 1 ? walk(t, 1.25) : lerpPose(idle(t), { armR: [-1.3, 0, 0.1], armL: [-1.3, 0, -0.1] }, seg(t, 30, 30.6)));
  const [dl, dr] = (H as any).doors as THREE.Group[];
  const op = sm(seg(t, 30.3, 32));
  dl.rotation.y = -op * 1.4; dr.rotation.y = op * 1.4;
  camLerp(V(0.9, 0.9, 11.5), V(0.6, 1.2, 9.5), V(-0.6, 1.6, 0), V(-1.4, 1.4, 0), sm(seg(lt, 0, 12)), 38);
});

/* ─── 老宅：小小的地质博物馆 ─── */
add("03-museum", 33, 48, "house", (t, lt) => {
  houseActors(t);
  const k = sm(seg(lt, 0, 15));
  camLerp(V(-3.0, 1.55, 0.3), V(-0.4, 1.45, 1.9), V(-3.6, 1.4, -1.5), V(0.6, 1.1, -1.2), k, 42);
});
add("04-tea", 48, 58, "house", (t, lt) => {
  houseActors(t);
  cam(V(2.9, 1.35, -0.55 + lt * 0.01), V(0.6, 1.25, -0.6), 36);
});
add("05-z-soldier", 58, 61, "house", (t) => {
  houseActors(t);
  cam(V(1.02, 1.62, -1.75), V(0.58, 1.6, 0.25), 30);
});
add("06-collector-world", 61, 72, "house", (t, lt) => {
  houseActors(t);
  camLerp(V(0.12, 1.6, 0.95), V(0.16, 1.58, 0.75), V(0.6, 1.45, -1.35), V(0.6, 1.45, -1.35), sm(seg(lt, 0, 11)), 32);
});
add("07-z-cup", 72, 82, "house", (t, lt) => {
  houseActors(t);
  camLerp(V(1.08, 1.6, -1.7), V(1.02, 1.6, -1.5), V(0.58, 1.55, 0.25), V(0.58, 1.55, 0.25), sm(seg(lt, 0, 10)), 30);
});
add("08-laugh", 82, 87, "house", (t) => {
  houseActors(t);
  cam(V(2.4, 1.4, 0.6), V(0.6, 1.3, -0.6), 34);
});
add("09-spec", 87, 93.4, "house", (t, lt) => {
  houseActors(t);
  camLerp(V(1.05, 1.62, -1.8), V(1.0, 1.62, -1.5), V(0.58, 1.6, 0.25), V(0.58, 1.6, 0.25), sm(seg(lt, 0, 6)), 26);
});
add("10-cabinet", 93.4, 97.3, "house", (t) => {
  houseActors(t);
  cam(V(1.6, 1.5, 1.8), V(-1.3, 1.2, -1.2), 44);
});
add("11-iron", 97.3, 103.4, "house", (t, lt) => {
  houseActors(t);
  const target = meteorSmall.position.clone();
  camLerp(target.clone().add(V(0.32, 0.22, 0.32)), target.clone().add(V(0.2, 0.12, 0.2)), target, target, sm(seg(lt, 0, 6)), 30, 0.02);
});
add("12-three", 103.4, 111.4, "house", (t, lt) => {
  houseActors(t);
  cam(V(2.3, 1.55, -0.1 - lt * 0.02), V(0.6, 1.1, -0.6), 34);
});
add("13-pay", 111.4, 117.6, "house", (t, lt) => {
  houseActors(t);
  if (t < 115.4) cam(V(1.05, 1.58, -1.7), V(0.55, 1.35, 0.3), 30);
  else cam(V(0.12, 1.6, 0.95), V(0.6, 1.5, -1.35), 30);
});
add("14-awkward", 117.6, 122.2, "house", (t) => {
  houseActors(t);
  cam(V(0.12, 1.6, 0.95), V(0.6, 1.5, -1.35), 28);
});
add("15-respect", 122.2, 125.6, "house", (t, lt) => {
  houseActors(t);
  camLerp(V(1.0, 1.64, -1.6), V(0.96, 1.64, -1.35), V(0.58, 1.62, 0.25), V(0.58, 1.62, 0.25), sm(seg(lt, 0, 3.4)), 24);
});
add("16-stones", 125.6, 132.6, "house", (t, lt) => {
  houseActors(t);
  const c = V(0.52, 0.92, -0.45);
  camLerp(V(0.12, 1.22, -0.02), V(0.3, 1.06, -0.18), c, c, sm(seg(lt, 0, 7)), 32, 0.02);
});

/* ─── 车间：夜，空无一人 ─── */
add("17-shop-wide", 132.6, 139, "shop", (t, lt) => {
  shopUpdate(t);
  camLerp(V(-5.5, 2.2, 6), V(-4.6, 2.0, 5.2), V(0, 1.1, 0), V(0, 1.1, 0), sm(seg(lt, 0, 6.4)), 36);
});
add("18-lathe", 139, 146, "shop", (t, lt) => {
  shopUpdate(t);
  camLerp(V(-0.2, 1.32, 0.62), V(0.05, 1.3, 0.55), V(-0.45, 1.18, 0), V(-0.2, 1.18, 0), sm(seg(lt, 0, 7)), 34, 0.02);
});
add("19-count", 146, 151.6, "shop", (t, lt) => {
  shopUpdate(t);
  if (lt < 2.8) cam(V(1.45, 1.48, 0.85), V(1.45, 1.48, 0.36), 30, 0.02);
  else camLerp(V(1.5, 1.25, 1.3), V(1.5, 1.1, 1.15), V(1.5, 0.78, 0.9), V(1.5, 0.78, 0.9), sm(seg(lt, 2.8, 5.6)), 34, 0.02);
});
add("20-cutter", 151.6, 158, "shop", (t, lt) => {
  shopUpdate(t);
  cam(V(2.8, 1.8, 3.2), V(0.2, 1.1, 0.3), 38);
});

/* ─── 地下室 ─── */
add("21-heads", 158, 166.2, "base", (t, lt) => {
  baseUpdate(t);
  camLerp(V(-0.5, 1.2, 0.5), V(-0.52, 1.1, 0.38), V(-0.06, 0.8, 0.25), V(-0.08, 0.8, 0.25), sm(seg(lt, 0, 8)), 32, 0.02);
});
add("22-glue", 166.2, 172.8, "base", (t, lt) => {
  baseUpdate(t);
  camLerp(V(-0.4, 0.93, 0.24), V(-0.34, 0.9, 0.24), V(-0.02, 0.81, 0.25), V(-0.06, 0.81, 0.25), sm(seg(lt, 0, 6.6)), 30, 0.01);
});
add("23-load", 172.8, 179, "base", (t, lt) => {
  baseUpdate(t);
  const hand = new THREE.Vector3(); zBase.anchors.handR.getWorldPosition(hand);
  cam(V(0.7, 1.35, 1.5), hand.lerp(V(0, 0.9, 0.4), 0.4), 30);
});
add("24-fire", 179, 186.2, "base", (t, lt) => {
  baseUpdate(t);
  cam(V(1.5, 1.7, 1.6), V(-0.8, 0.9, -0.8), 46);
  let s = 0;
  for (const st of ROOM_SHOTS) { const d = t - st; if (d >= 0 && d < 0.35) s = Math.max(s, (1 - d / 0.35) * 0.03); }
  shake(t, s);
});
add("25-meat", 186.2, 194.2, "base", (t, lt) => {
  baseUpdate(t);
  const c = V(-0.12, 0.8, 0.44);
  camLerp(V(-0.6, 1.12, 0.78), V(-0.52, 0.98, 0.66), c, V(-0.3, 0.78, 0.45), sm(seg(lt, 0, 8)), 32, 0.01);
});
add("26-pack", 194.2, 200, "base", (t, lt) => {
  baseUpdate(t);
  cam(V(-1.4, 1.9, 1.5), V(0.4, 0.9, 0.3), 46);
});

/* ─── 同步轨道 ─── */
add("27-orbit", 200, 214, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const k = sm(seg(lt, 0, 14));
  camLerp(V(-240, 70, 300), V(-180, 50, 220), V(260, -40, -260), V(300, -30, -200), k, 50);
});
add("28-helmet", 214, 226.4, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const head = new THREE.Vector3(); zSpace.parts.head.getWorldPosition(head);
  camLerp(head.clone().add(V(-2.4, 0.35, -0.65)), head.clone().add(V(-1.9, 0.3, -0.5)), V(640, 0, 0), V(640, 0, 0), sm(seg(lt, 0, 12)), 30);
});
add("29-alone", 226.4, 235, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  camLerp(V(14, 2, 34), V(20, 3, 60), V(-4, -2, -60), V(-6, -3, -80), sm(seg(lt, 0, 8.6)), 30);
});
add("30-father", 235, 242, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const head = new THREE.Vector3(); zSpace.parts.head.getWorldPosition(head);
  camLerp(head.clone().add(V(2.3, 0.05, 0.3)), head.clone().add(V(1.7, 0.05, 0.25)), head, head, sm(seg(lt, 0, 7)), 28);
});
add("31-sunring", 242, 246, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  cam(V(1.6, 0.4, 7), V(-0.4, 1.4, -10), 38);
});
const scopePos = (dist: number) => GROUP_C.clone().add(Z0.clone().sub(GROUP_C).normalize().multiplyScalar(dist));
add("32-scope-hatch", 246, 250, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const wob = V(Math.sin(t * 1.3) * 0.15, Math.sin(t * 1.7) * 0.12, 0);
  cam(scopePos(40), HATCH_POS.clone().add(wob), 14);
}, true);
add("33-photo-wide", 250, 255.2, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const side = GROUP_C.clone().addScaledVector(LAT, 22).addScaledVector(HATCH_N, 26).add(V(0, 5, 0));
  camLerp(side, side.clone().addScaledVector(LAT, -4), GROUP_C, GROUP_C.clone().add(V(0, 0.5, 0)), sm(seg(lt, 0, 5.2)), 40);
});
add("34-scope-faces", 255.2, 262.4, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const k = sm(seg(lt, 2.5, 6));
  const wob = V(Math.sin(t * 1.1) * 0.08, Math.sin(t * 1.5) * 0.06, 0);
  const center = crew[4].slot.clone().add(V(0, 1.5, 0));
  cam(scopePos(mix(30, 14, k)), center.add(wob), mix(16, 12, k));
}, true);
add("35-glove", 262.4, 266.2, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const hand = new THREE.Vector3(); zSpace.anchors.handR.getWorldPosition(hand);
  cam(hand.clone().add(V(-0.3, 0.6, 1.1)), hand, 34);
});
add("36-draw", 266.2, 273.6, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const hand = new THREE.Vector3(); zSpace.anchors.handR.getWorldPosition(hand);
  const chest = new THREE.Vector3(); zSpace.parts.torso.getWorldPosition(chest);
  cam(chest.clone().add(V(0.6, 0.9, 2.0)), hand.lerp(chest, 0.3), 38);
});
add("37-reticle", 273.6, 277, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const tg = crew[3].f.parts.head.getWorldPosition(new THREE.Vector3());
  const wob = V(Math.sin(t * 2.1) * 0.06 * (1 - seg(lt, 0, 3)), Math.sin(t * 1.7) * 0.05 * (1 - seg(lt, 0, 3)), 0);
  cam(scopePos(9), tg.add(V(0, -0.4, 0)).add(wob), 9);
}, true);
add("38-fire-close", 277, 280.7, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const chest = new THREE.Vector3(); zSpace.parts.torso.getWorldPosition(chest);
  cam(chest.clone().add(V(0.5, 0.45, 2.6)), chest.clone().add(V(0.6, 0.25, 0)), 34);
});
add("39-fire-far", 280.7, 284.6, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  muzzle.scale.setScalar(70);
  cam(V(-30, 8, 90), V(0, 0, -20), 30);
});
add("40-fire-hands", 284.6, 288.6, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const hand = new THREE.Vector3(); zSpace.anchors.handR.getWorldPosition(hand);
  cam(hand.clone().add(V(-1.4, 0.45, 0.7)), hand.clone().add(V(1.5, 0, 0)), 36);
});
add("41-slug", 288.6, 293.6, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  // 一枚陨石弹头在真空中笔直前进，不减速、不翻滚
  const dir = GROUP_C.clone().normalize();
  const along = 120 + lt * 18;
  const p = dir.clone().multiplyScalar(along);
  flySlug.visible = true;
  flySlug.position.copy(p);
  flySlug.quaternion.setFromUnitVectors(V(0, 1, 0), dir);
  flySlug.rotateY(t * 6);
  const side = V(-dir.z, 0.25, dir.x).normalize();
  cam(p.clone().addScaledVector(side, 0.32).addScaledVector(dir, -0.25), p.clone().addScaledVector(dir, 0.6), 40, 0.01);
});
add("42-wait", 293.6, 300.3, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const center = crew[4].slot.clone().add(V(0, 1.2, 0));
  cam(scopePos(mix(12, 10, seg(lt, 0, 6.7))), center, 12);
}, true);
add("43-hit", 300.3, 304, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const side = GROUP_C.clone().addScaledVector(LAT, 7).addScaledVector(HATCH_N, 8).add(V(0, 1, 0));
  cam(side, GROUP_C.clone().addScaledVector(LAT, 0.5).add(V(0, 0.4, 0)), 38);
});
add("44-scream", 304, 306.6, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const m = crew.find((c) => c.scream)!;
  const head = m.f.parts.head.getWorldPosition(new THREE.Vector3());
  cam(head.clone().addScaledVector(HATCH_N, 1.4).addScaledVector(LAT, 0.2), head, 30);
});
add("45-flee", 306.6, 312.6, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const p = GROUP_C.clone().addScaledVector(HATCH_N, 30).addScaledVector(LAT, -16).add(V(0, 8, 0));
  cam(p, HATCH_POS.clone().lerp(GROUP_C, 0.4), 42);
});
add("46-turn", 312.6, 322, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  const head = zSpace.parts.head.getWorldPosition(new THREE.Vector3());
  const offset = V(2.6, 0.5, 2.4);
  cam(lt < 4.5 ? head.clone().add(offset) : V(2.6, 1, 3.4).add(V(0, 0, 0)), lt < 4.5 ? head : head, lt < 4.5 ? 32 : 40);
});
add("47-away", 322, 348, "space", (t, lt) => {
  updateSky(t); zhangSpace(t); crewUpdate(t); updateParticles(t);
  camLerp(V(30, 12, -40), V(40, 30, -60), zSpace.root.position, zSpace.root.position.clone().add(V(-200, -30, 100)), sm(seg(lt, 0, 14)), 36);
});

/* 镜头表 → 播放器 Shot[] */
const shots: Shot<typeof context>[] = shotDefs.map((d) => ({
  id: d.id,
  start: d.start,
  end: d.end,
  update: ({ time, localTime, progress }) => {
    useSet(d.set);
    flySlug.visible = false;
    d.run(time, localTime, progress);
    currentScope = !!d.scope;
  },
}));
let currentScope = false;

/* ═════════════ 叠加层：黑场、字卡、瞄准镜 ═════════════ */
const fadeKeys: Array<[number, number]> = [
  [0, 0.35], [2.6, 0], [13.6, 0], [15.0, 1], [21.0, 1], [22.6, 0],
  [131.4, 0], [132.6, 1], [133.4, 1], [134.2, 0.15], [135, 0],
  [157.4, 0], [158.0, 1], [158.4, 1], [159.4, 0],
  [199.5, 0], [200.0, 1], [200.4, 1], [202.4, 0],
  [330.5, 0], [335.5, 1], [348, 1],
];
function fadeAt(t: number) {
  for (let i = 0; i < fadeKeys.length - 1; i++) {
    const [a, va] = fadeKeys[i], [b, vb] = fadeKeys[i + 1];
    if (t >= a && t <= b) return mix(va, vb, (t - a) / Math.max(1e-6, b - a));
  }
  return 1;
}
const cards: Array<{ a: number; b: number; html: string }> = [
  { a: 15.6, b: 20.6, html: `<div class="big">萤火</div><div class="small">据刘慈欣《三体Ⅱ·黑暗森林》片段改编</div>` },
  { a: 22.6, b: 27.4, html: `<div class="small">四个月前 · 北京 · 胡同深处</div>` },
  { a: 201.0, b: 206.6, html: `<div class="small">地球同步轨道 · 黄河空间站外五公里</div>` },
  { a: 336.4, b: 347.6, html: `<div class="big">萤火</div><div class="small">一个人在虚空中开出的三十枪</div><div class="tiny">体素造型、镜头与声音均由代码实时生成 · 所有对白以字幕呈现，待配音</div>` },
];
const fadeEl = document.getElementById("fade")!;
const cardEl = document.getElementById("card")!;
const scopeEl = document.getElementById("scope")!;
let cardIdx = -1;
function overlays(t: number) {
  fadeEl.style.opacity = String(fadeAt(t));
  const i = cards.findIndex((c) => t >= c.a && t <= c.b);
  if (i !== cardIdx) { cardEl.innerHTML = i >= 0 ? cards[i].html : ""; cardIdx = i; }
  if (i >= 0) {
    const c = cards[i];
    cardEl.style.opacity = String(Math.min(1, (t - c.a) / 0.9, (c.b - t) / 0.9));
  } else cardEl.style.opacity = "0";
  const def = shotDefs.find((d) => t >= d.start && t < d.end);
  scopeEl.style.opacity = def?.scope ? "1" : "0";
}

/* ═════════════ 播放器 ═════════════ */
validateVoiceCues(voiceCues, DURATION);
const player = new CinematicPlayer({ duration: DURATION, context, shots, cues: [...voiceCues, ...soundCues] });
player.addTypedEventListener("frame", ({ detail }) => overlays(detail.time));
const stage = NO_GL ? null : new ThreeStage({ player, renderer, scene, camera: () => context.camera, container: document.querySelector("#stage")!, maxPixelRatio: 2 });
const audio = new WebAudioCueBus(player);
audio.setGroupGain("music", 0.8);
registerSounds(audio);
const controls = NO_GL ? null : mountCinematicControls({ player, audio });
void stage; void controls; void currentScope; void P;

const q = NO_GL ? null : new URLSearchParams(location.search).get("t");
if (q) player.seek(Number(q));
else player.seek(0.0);
(globalThis as any).__player = player;
(globalThis as any).__scene = scene;
(globalThis as any).__probe = { shotDefs, figs: { zHutong, zHouse, collector, zShop, zBase, zSpace, photographer, target: crew[4].f, scream: crew.find((c) => c.scream)!.f } };
(globalThis as any).__camera = camera;
