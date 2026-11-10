// 场景搭建与渲染：所有运动部件的位姿都只从物理刚体读取（sync），这里不产生任何运动。
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { G } from './sim.js';

const DEG = Math.PI / 180;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}
// 简单的伪随机（固定种子，保证每次画面一致）
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function woodTex(base, dark, seed, planks = 6) {
  return canvasTex(256, 256, (g, w, h) => {
    const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      g.strokeStyle = dark; g.globalAlpha = 0.05 + r() * 0.13; g.lineWidth = 0.6 + r() * 1.6;
      const x = r() * w; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (r() - 0.5) * 10, h * 0.3, x + (r() - 0.5) * 10, h * 0.7, x + (r() - 0.5) * 6, h); g.stroke();
    }
    g.globalAlpha = 0.5; g.strokeStyle = '#000'; g.lineWidth = 2;
    for (let i = 0; i <= planks; i++) { const x = (i / planks) * w; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    g.globalAlpha = 1;
  });
}

// 软件光栅（SwiftShader / llvmpipe 等）下每个着色器变体都要编译很久，因此：
//  · 所有材质统一为"带贴图的 MeshStandardMaterial"（无贴图的用 1×1 白贴图），全片只有 3 个着色器变体；
//  · 检测到软件渲染时关闭环境贴图（省掉 PMREM 的几个着色器）并减轻阴影。
function isSoftware(gl) {
  try { const ext = gl.getExtension('WEBGL_debug_renderer_info'); const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''; return /swiftshader|llvmpipe|software|softpipe|basic render/i.test(r); } catch (e) { return false; }
}

export function buildView(canvas, sim, Q = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: Q.aa !== false, alpha: true, powerPreference: 'high-performance' });
  const soft = isSoftware(renderer.getContext());
  if (/perf/.test(location.hash)) { const gl = renderer.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info'); console.log('[boot] renderer=' + (ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'n/a') + ' soft=' + soft); }
  const QL = { shadows: true, env: !soft, lights: true, soft: !soft, smap: soft ? 1024 : 2048, ...Q };
  renderer.setPixelRatio(QL.pr ? QL.pr / 100 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = QL.shadows; renderer.shadowMap.type = QL.soft === false ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x141c26, 26, 70);
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 200);
  if (QL.env) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.55; pm.dispose(); }

  // ---------- 灯光 ----------
  scene.add(new THREE.HemisphereLight(0xbfd3ea, 0x3a2c22, QL.env ? 0.75 : 1.2));
  const key = new THREE.DirectionalLight(0xffe2b8, 2.6);
  key.position.set(7, 15, 9); key.target.position.set(0, 4, 0); scene.add(key, key.target);
  key.castShadow = QL.shadows; key.shadow.mapSize.set(QL.smap || 2048, QL.smap || 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 11, bottom: -4, near: 1, far: 40 });
  key.shadow.bias = -0.0006; key.shadow.normalBias = 0.03; key.shadow.radius = 3;
  const fill = new THREE.DirectionalLight(0x9fc4ff, 0.85); fill.position.set(-8, 7, -10); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffc890, 0.55); rim.position.set(-6, 5, 10); scene.add(rim);
  if (QL.lights) { const lamp = new THREE.PointLight(0xffb060, 14, 9, 1.6); lamp.position.set(0.6, 3.4, 2.6); scene.add(lamp);
    const lamp2 = new THREE.PointLight(0xffc27a, 9, 7, 1.6); lamp2.position.set(0, 4.4, -3.4); scene.add(lamp2); }

  // ---------- 材质 ----------
  const whiteTex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1); whiteTex.colorSpace = THREE.SRGBColorSpace; whiteTex.needsUpdate = true;
  // 没有环境贴图时金属会发黑：降低金属度、略提亮，保持铜器的观感
  const std = (o) => { const p = { map: whiteTex, ...o }; if (!QL.env && p.metalness > 0.3) { p.metalness = 0.3; p.roughness = Math.max(0.32, (p.roughness ?? 0.5) * 0.9); if (p.emissive === undefined) { p.emissive = p.color; p.emissiveIntensity = 0.12; } } if (QL.cheap) { const { roughness, metalness, ...lp } = p; return new THREE.MeshLambertMaterial(lp); } return new THREE.MeshStandardMaterial(p); };
  const wtA = woodTex('#8a5a33', '#3b2412', 11), wtB = woodTex('#6e4526', '#2a180b', 23), wtRed = woodTex('#8d2a1e', '#3d0f0a', 37, 8);
  const M = {
    wood: std({ color: 0xffffff, map: wtA, roughness: 0.78 }),
    woodDark: std({ color: 0xffffff, map: wtB, roughness: 0.82 }),
    woodLight: std({ color: 0xc79a62, roughness: 0.7 }),
    frame: std({ color: 0x4a2f1c, roughness: 0.85 }),
    red: std({ color: 0xffffff, map: wtRed, roughness: 0.62 }),
    redPlain: std({ color: 0xa5281c, roughness: 0.55 }),
    bronze: std({ color: 0xb98a4a, metalness: 0.85, roughness: 0.36 }),
    bronzeDark: std({ color: 0x7a5a30, metalness: 0.8, roughness: 0.45 }),
    gold: std({ color: 0xe9c06a, metalness: 0.9, roughness: 0.3 }),
    iron: std({ color: 0x3a3f46, metalness: 0.7, roughness: 0.5 }),
    stone: std({ color: 0x777b80, roughness: 0.95 }),
    tile: std({ color: 0x3f5a55, roughness: 0.7 }),
    plaster: std({ color: 0xd9cdb4, roughness: 0.9 }),
    robe: [std({ color: 0x2f6f7a, roughness: 0.7 }), std({ color: 0xa33a2a, roughness: 0.7 }), std({ color: 0x556b2f, roughness: 0.7 })],
    skin: std({ color: 0xe7c9a5, roughness: 0.8 }),
    water: std({ color: 0x4fc3ff, roughness: 0.1, metalness: 0, emissive: 0x0d5f9a, emissiveIntensity: 0.6 }),
    poolVol: std({ color: 0x2a8fd0, roughness: 0.2, transparent: true, opacity: 0.55, emissive: 0x0a3f6a, emissiveIntensity: 0.6, depthWrite: false }),
    pool: std({ color: 0x2f9fe0, roughness: 0.12, transparent: true, opacity: 0.82, emissive: 0x0b4a7a, emissiveIntensity: 0.5 }),
    // 擒纵各件（会随事件高亮）
    fork: std({ color: 0xd9a548, metalness: 0.75, roughness: 0.35, emissive: 0xffa030, emissiveIntensity: 0 }),
    heng: std({ color: 0x8d6a3a, metalness: 0.55, roughness: 0.45, emissive: 0xffa030, emissiveIntensity: 0 }),
    tooth: std({ color: 0xd23a26, metalness: 0.2, roughness: 0.4, emissive: 0xff5020, emissiveIntensity: 0 }),
    tiao: std({ color: 0xc9ccd2, metalness: 0.9, roughness: 0.3, emissive: 0xffc060, emissiveIntensity: 0 }),
    peg: std({ color: 0xe6d3a0, roughness: 0.6, emissive: 0xffc060, emissiveIntensity: 0 }),
  };
  const shellMats = [], facadeMats = [], roofMats = [], frameMats = [], frontMats = [];
  const fadeMat = (m, list) => { const c = m.clone(); c.transparent = true; list.push(c); return c; };
  const Sh = { wall: fadeMat(M.wood, shellMats), wallDark: fadeMat(M.woodDark, shellMats), tile: fadeMat(M.tile, shellMats), plaster: fadeMat(M.plaster, shellMats), frame: fadeMat(M.frame, shellMats) };
  const Fa = { wall: fadeMat(M.wood, facadeMats), red: fadeMat(M.red, facadeMats), redPlain: fadeMat(M.redPlain, facadeMats), gold: fadeMat(M.gold, facadeMats), tile: fadeMat(M.tile, facadeMats), dark: fadeMat(M.frame, facadeMats) };
  const Fr = { frame: fadeMat(M.frame, frameMats), front: fadeMat(M.wood, frontMats) };
  const Ro = { tile: fadeMat(M.tile, roofMats), frame: fadeMat(M.frame, roofMats), gold: fadeMat(M.gold, roofMats) };

  // ---------- 小工具 ----------
  const mesh = (geo, mat, parent, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = true; (parent || scene).add(m); return m; };
  const box = (w, h, d, mat, parent, x = 0, y = 0, z = 0) => { const m = mesh(new THREE.BoxGeometry(w, h, d), mat, parent); m.position.set(x, y, z); return m; };
  // 两点之间的圆柱
  const rod = (a, b, r, mat, parent, seg = 10) => {
    const d = b.clone().sub(a); const m = mesh(new THREE.CylinderGeometry(r, r, d.length(), seg), mat, parent);
    m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.clone().normalize()); return m;
  };
  const group = (parent) => { const g = new THREE.Group(); (parent || scene).add(g); return g; };
  const YC = G.YC;

  // ---------- 地面 / 台基 ----------
  {
    const g = mesh(new THREE.CircleGeometry(60, 64), std({ color: 0x1a222b, roughness: 1 }), scene, false); g.rotation.x = -Math.PI / 2; g.position.y = -0.6;
    box(9.0, 0.6, 6.8, M.stone, scene, 0, -0.3, 0);
    box(9.6, 0.25, 7.4, M.stone, scene, 0, -0.5, 0);
    const fl = box(7.4, 0.04, 5.2, std({ color: 0x4d3a2a, roughness: 0.95 }), scene, 0, 0.0, 0); fl.castShadow = false;
  }

  // ---------- 外壳（可淡出）、骨架（常在） ----------
  const shell = group(), frame = group(), facade = group(), roof = group(), frontWall = group();
  const T1 = { x: 3.7, z: 2.6, y0: 0, y1: 5.5 }, T2 = { x: 2.45, z: 2.05, y0: 5.5, y1: 8.2 }, T3 = { x: 2.1, z: 1.8, y0: 8.2, y1: 10.9 };
  {
    const post = (x, y0, y1, z, s = 0.2, mat = Fr.frame, parent = frame) => box(s, y1 - y0, s, mat, parent, x, (y0 + y1) / 2, z);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { post(sx * T1.x, T1.y0, T1.y1, sz * T1.z, 0.26); post(sx * T2.x, T2.y0, T2.y1, sz * T2.z, 0.2); }
    for (const sz of [-1, 1]) { box(T1.x * 2 + 0.3, 0.2, 0.22, Fr.frame, frame, 0, T1.y1 - 0.1, sz * T1.z); box(T2.x * 2 + 0.24, 0.16, 0.18, Fr.frame, frame, 0, T2.y1 - 0.08, sz * T2.z); }
    for (const sx of [-1, 1]) { box(0.22, 0.2, T1.z * 2 + 0.3, Fr.frame, frame, sx * T1.x, T1.y1 - 0.1, 0); box(0.18, 0.16, T2.z * 2 + 0.24, Fr.frame, frame, sx * T2.x, T2.y1 - 0.08, 0); }
    // 楼板（常在，薄）
    const slab1 = box(T1.x * 2 + 0.9, 0.1, T1.z * 2 + 0.9, Sh.wallDark, shell, 0, T1.y1 + 0.05, 0);
    const slab2 = box(T2.x * 2 + 0.9, 0.1, T2.z * 2 + 0.9, Sh.wallDark, shell, 0, T2.y1 + 0.05, 0);
    // 墙板
    const wall = (w, h, x, y, z, ry, mat = Sh.wall) => { const m = box(w, h, 0.07, mat, shell, x, y, z); m.rotation.y = ry; return m; };
    const h1 = T1.y1 - T1.y0 - 0.2, c1 = (T1.y0 + T1.y1 - 0.2) / 2;
    wall(T1.x * 2, h1, 0, c1, T1.z, 0); wall(T1.z * 2, h1, T1.x, c1, 0, Math.PI / 2); wall(T1.z * 2, h1, -T1.x, c1, 0, Math.PI / 2);
    const fw = (T1.x - 1.3); for (const [w, h, x, y] of [[fw, h1, -(1.3 + fw / 2), c1], [fw, h1, 1.3 + fw / 2, c1], [2.6, 0.55, 0, 0.275]]) box(w, h, 0.07, Fr.front, frontWall, x, y, -T1.z);
    const h2 = T2.y1 - T2.y0 - 0.16, c2 = (T2.y0 + T2.y1 - 0.16) / 2 + 0.05;
    for (const sz of [-1, 1]) wall(T2.x * 2, h2, 0, c2, sz * T2.z, 0, Sh.plaster);
    for (const sx of [-1, 1]) wall(T2.z * 2, h2, sx * T2.x, c2, 0, Math.PI / 2, Sh.plaster);
    // 二层直棂窗（装饰）
    for (const sx of [-1, 1]) for (let i = -1; i <= 1; i++) box(0.09, 1.1, 0.9, Sh.wallDark, shell, sx * (T2.x + 0.01), 6.9, i * 1.2);
    for (const sz of [-1, 1]) for (let i = -1; i <= 1; i++) box(1.0, 1.1, 0.09, Sh.wallDark, shell, i * 1.4, 6.9, sz * (T2.z + 0.01));
    // 腰檐
    const eave = (hx, hz, y, mat) => { const m = mesh(new THREE.CylinderGeometry(0.72, 1.0, 0.34, 4, 1, false), mat, shell); m.rotation.y = Math.PI / 4; m.scale.set(hx * 1.43, 1, hz * 1.43); m.position.y = y; return m; };
    eave(T1.x + 0.75, T1.z + 0.75, T1.y1 - 0.2, Sh.tile); eave(T2.x + 0.7, T2.z + 0.7, T2.y1 - 0.2, Sh.tile);
    // 栏杆
    const rail = (hx, hz, y) => {
      for (const sz of [-1, 1]) { box(hx * 2, 0.05, 0.05, Sh.frame, shell, 0, y + 0.55, sz * hz); box(hx * 2, 0.04, 0.04, Sh.frame, shell, 0, y + 0.28, sz * hz); }
      for (const sx of [-1, 1]) { box(0.05, 0.05, hz * 2, Sh.frame, shell, sx * hx, y + 0.55, 0); box(0.04, 0.04, hz * 2, Sh.frame, shell, sx * hx, y + 0.28, 0); }
      for (let i = -4; i <= 4; i++) for (const s of [-1, 1]) { box(0.06, 0.62, 0.06, Sh.frame, shell, (i / 4) * hx, y + 0.31, s * hz); box(0.06, 0.62, 0.06, Sh.frame, shell, s * hx, y + 0.31, (i / 4) * hz); }
    };
    rail(T1.x + 0.38, T1.z + 0.38, T1.y1 + 0.1); rail(T2.x + 0.38, T2.z + 0.38, T2.y1 + 0.1);
    // 顶层板屋（四柱 + 屋顶）
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.16, T3.y1 - T3.y0, 0.16, Ro.frame, roof, sx * T3.x, (T3.y0 + T3.y1) / 2, sz * T3.z);
    const r1 = mesh(new THREE.ConeGeometry(1, 1.25, 4, 1), Ro.tile, roof); r1.rotation.y = Math.PI / 4; r1.scale.set((T3.x + 0.8) * 1.43, 1, (T3.z + 0.8) * 1.43); r1.position.y = T3.y1 + 0.75;
    const r2 = mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.22, 4, 1), Ro.tile, roof); r2.rotation.y = Math.PI / 4; r2.scale.set((T3.x + 1.15) * 1.43, 1, (T3.z + 1.15) * 1.43); r2.position.y = T3.y1 + 0.1;
    const fin = mesh(new THREE.SphereGeometry(0.16, 16, 12), Ro.gold, roof); fin.position.y = T3.y1 + 1.45;
    box(T3.x * 2 + 0.2, 0.14, 0.14, Ro.frame, roof, 0, T3.y1 - 0.07, T3.z); box(T3.x * 2 + 0.2, 0.14, 0.14, Ro.frame, roof, 0, T3.y1 - 0.07, -T3.z);
    box(0.14, 0.14, T3.z * 2 + 0.2, Ro.frame, roof, T3.x, T3.y1 - 0.07, 0); box(0.14, 0.14, T3.z * 2 + 0.2, Ro.frame, roof, -T3.x, T3.y1 - 0.07, 0);
  }

  // ---------- 木阁（五层报时楼阁，正面）----------
  const ZFACE = -2.42;
  const FLOORS = [0.62, 1.6, 2.58, 3.56, 4.52, 5.44];
  {
    const W = 1.22;
    for (const sx of [-1, 1]) box(0.14, FLOORS[5] - 0.5, 0.14, Fa.redPlain, facade, sx * W, (FLOORS[5] + 0.5) / 2, ZFACE);
    for (let f = 0; f < 6; f++) { box(W * 2 + 0.5, 0.07, 0.36, Fa.dark, facade, 0, FLOORS[f] - 0.035, ZFACE - 0.06); if (f > 0 && f < 5) { const e = box(W * 2 + 0.56, 0.04, 0.3, Fa.tile, facade, 0, FLOORS[f] - 0.09, ZFACE - 0.14); e.rotation.x = -0.35; } }
    const panel = (x0, x1, y0, y1, mat = Fa.red) => box(x1 - x0, y1 - y0, 0.06, mat, facade, (x0 + x1) / 2, (y0 + y1) / 2, ZFACE);
    // 下三层：闭合的门
    for (let f = 0; f < 3; f++) {
      const y0 = FLOORS[f], y1 = FLOORS[f + 1] - 0.07; panel(-W, W, y0, y1);
      for (const sx of [-1, 1]) { box(0.3, 0.6, 0.03, Fa.redPlain, facade, sx * 0.16, y0 + 0.36, ZFACE - 0.04); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) box(0.03, 0.03, 0.02, Fa.gold, facade, sx * (0.09 + j * 0.14), y0 + 0.2 + i * 0.16, ZFACE - 0.06); }
      for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) box(0.03, 0.55, 0.03, Fa.dark, facade, sx * (0.62 + i * 0.13), y0 + 0.42, ZFACE - 0.04);
    }
    // 四层：报时牌的小门
    { const y0 = FLOORS[3], y1 = FLOORS[4] - 0.07, dx = 0.2, top = 4.36; panel(-W, -dx, y0, y1); panel(dx, W, y0, y1); panel(-dx, dx, top, y1); panel(-dx, dx, y0, G.FIG.y - 0.02);
      for (const sx of [-1, 1]) box(0.035, top - G.FIG.y + 0.08, 0.08, Fa.gold, facade, sx * (dx + 0.017), (top + G.FIG.y) / 2, ZFACE - 0.01); box(dx * 2 + 0.1, 0.035, 0.08, Fa.gold, facade, 0, top + 0.017, ZFACE - 0.01); }
    // 五层：击钟摇铃的敞口
    { const y0 = FLOORS[4], y1 = FLOORS[5] - 0.07, xl = -0.78, xr = 0.68, top = 5.24; panel(-W, xl, y0, y1); panel(xr, W, y0, y1); panel(xl, xr, top, y1);
      box(xr - xl + 0.08, 0.035, 0.08, Fa.gold, facade, (xl + xr) / 2, top + 0.017, ZFACE - 0.01); for (const x of [xl, xr]) box(0.035, top - y0, 0.08, Fa.gold, facade, x, (top + y0) / 2, ZFACE - 0.01); }
    // 阁顶
    const top = mesh(new THREE.CylinderGeometry(0.75, 1.0, 0.3, 4, 1), Fa.tile, facade); top.rotation.y = Math.PI / 4; top.scale.set((W + 0.4) * 1.43, 1, 0.42 * 1.43); top.position.set(0, FLOORS[5] + 0.14, ZFACE - 0.04);
  }

  // ---------- 水：天池、平水壶、水槽、退水壶 ----------
  const tankAnch = {};
  {
    const tank = (x0, x1, y0, y1, hz, surf, parent = scene) => {
      const t = 0.05, w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2;
      box(w, t, hz * 2, M.woodDark, parent, cx, y0 + t / 2, 0);
      box(t, h, hz * 2, M.woodDark, parent, x0 + t / 2, y0 + h / 2, 0); box(t, h, hz * 2, M.woodDark, parent, x1 - t / 2, y0 + h / 2, 0);
      box(w, h, t, M.woodDark, parent, cx, y0 + h / 2, -hz + t / 2);
      const fh = Math.max(0.08, (surf - y0) * 0.45); const front = box(w, fh, t, M.woodDark, parent, cx, y0 + fh / 2, hz - t / 2);
      const vol = mesh(new THREE.BoxGeometry(w - 2 * t - 0.01, surf - y0 - t, hz * 2 - 2 * t - 0.01), M.poolVol, parent, false); vol.position.set(cx, (surf + y0 + t) / 2, 0);
      box(w + 0.02, 0.012, 0.012, M.gold, parent, cx, surf, hz - 0.002).castShadow = false; // 水位线
      for (const yy of [y0 + h * 0.25, y0 + h * 0.78]) { box(w + 0.03, 0.035, hz * 2 + 0.03, M.iron, parent, cx, yy, 0); }
      const s = mesh(new THREE.PlaneGeometry(w - 2 * t, hz * 2 - 2 * t), M.pool, parent, false); s.rotation.x = -Math.PI / 2; s.position.set(cx, surf, 0);
      return front;
    };
    // 天池（高处的蓄水箱）
    tank(2.92, 3.62, YC + 1.02, YC + 1.72, 0.34, YC + 1.62);
    for (const x of [3.0, 3.54]) for (const z of [-0.26, 0.26]) box(0.1, YC + 1.02, 0.1, M.frame, scene, x, (YC + 1.02) / 2, z);
    rod(V3(2.94, YC + 1.12, 0), V3(G.TANK.x - 0.02, YC + 1.06, 0), 0.035, M.bronze, scene);
    // 平水壶
    tank(2.74, 3.3, YC + 0.36, YC + 0.84, 0.28, G.TANK.ySurf);
    box(0.62, 0.08, 0.5, M.frame, scene, 3.02, YC + 0.32, 0);
    // 溢流口：多余的水从这里溢出，水面高度因此不变
    rod(V3(3.3, G.TANK.ySurf - 0.02, 0.12), V3(3.42, G.TANK.ySurf - 0.1, 0.12), 0.025, M.bronze, scene);
    // 水槽（与物理碰撞体一致）
    const c = sim.view.chute; const ch = group(); ch.position.set(c.mx, c.my, 0); ch.rotation.z = c.ang;
    box(c.len + 0.06, 0.02, c.w + 0.04, M.bronze, ch, 0, -0.01, 0); box(c.len + 0.06, 0.07, 0.02, M.bronze, ch, 0, 0.025, c.w / 2 + 0.01); box(c.len + 0.06, 0.07, 0.02, M.bronze, ch, 0, 0.025, -c.w / 2 - 0.01);
    box(0.08, YC + 0.2, 0.08, M.frame, scene, 2.42, (YC + 0.2) / 2, -0.22); box(0.08, 0.06, 0.3, M.frame, scene, 2.42, YC + 0.25, -0.1);
    // 退水壶
    const bx0 = -2.3, bx1 = 2.75, by1 = 0.52, hz = 0.52, t = 0.06;
    box(bx1 - bx0, 0.06, hz * 2, M.woodDark, scene, (bx0 + bx1) / 2, 0.05, 0);
    box(t, by1, hz * 2, M.woodDark, scene, bx0, by1 / 2, 0); box(t, by1, hz * 2, M.woodDark, scene, bx1, by1 / 2, 0);
    box(bx1 - bx0, by1, t, M.woodDark, scene, (bx0 + bx1) / 2, by1 / 2, hz); box(bx1 - bx0, by1, t, M.woodDark, scene, (bx0 + bx1) / 2, by1 / 2, -hz);
    const s = mesh(new THREE.PlaneGeometry(bx1 - bx0 - t, hz * 2 - t), M.pool, scene, false); s.rotation.x = -Math.PI / 2; s.position.set((bx0 + bx1) / 2, G.BASIN_Y + 0.02, 0);
    tankAnch.tianchi = V3(3.27, YC + 1.72, 0.34); tankAnch.pingshui = V3(3.02, YC + 0.84, 0.28); tankAnch.basin = V3(1.6, 0.5, 0.52);
  }

  // ---------- 枢轮 ----------
  const dyn = []; // {key, obj}：画面对象 ← 物理刚体
  const bind = (key, obj) => { dyn.push({ key, obj }); return obj; };
  const wheel = bind('wheel', group());
  {
    const S = G.SCOOP, Rr = G.RH - 0.03;
    for (const z of [-S.hz, S.hz]) { const t = mesh(new THREE.TorusGeometry(Rr, 0.035, 6, 72), M.woodDark, wheel); t.position.z = z; }
    { const h = S.hz, t = 0.012; const band = mesh(new THREE.LatheGeometry([new THREE.Vector2(Rr - t, -h), new THREE.Vector2(Rr, -h), new THREE.Vector2(Rr, h), new THREE.Vector2(Rr - t, h), new THREE.Vector2(Rr - t, -h)], 72), M.wood, wheel); band.rotation.x = Math.PI / 2; }
    for (const z of [-0.12, 0.17]) { const t = mesh(new THREE.TorusGeometry(G.RP, 0.03, 6, 72), M.woodDark, wheel); t.position.z = z; }
    const hub = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.56, 24), M.woodDark, wheel); hub.rotation.x = Math.PI / 2;
    for (const z of [-0.29, 0.29]) { const c = mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 24), M.bronze, wheel); c.rotation.x = Math.PI / 2; c.position.z = z; }
    const axle = mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.0, 16), M.bronzeDark, wheel); axle.rotation.x = Math.PI / 2; axle.position.z = -0.14;
    // 辐条（两层各 36 根）
    const spoke = new THREE.InstancedMesh(new THREE.BoxGeometry(Rr - 0.18, 0.035, 0.035), M.wood, 72); spoke.castShadow = true; spoke.receiveShadow = true; wheel.add(spoke);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < 72; i++) { const a = (Math.floor(i / 2) + 0.5) * G.PITCH, z = i % 2 ? 0.13 : -0.13; const r = (Rr + 0.18) / 2; e.set(0, 0, a); q.setFromEuler(e); m4.compose(V3(r * Math.cos(a), r * Math.sin(a), z), q, V3(1, 1, 1)); spoke.setMatrixAt(i, m4); }
    // 挡销（辐端铁拨牙）
    const peg = new THREE.InstancedMesh(new THREE.CylinderGeometry(G.PEG.r, G.PEG.r, 0.2, 12), M.peg, 36); peg.castShadow = true; wheel.add(peg);
    for (let i = 0; i < 36; i++) { const a = Math.PI / 2 + i * G.PITCH; e.set(Math.PI / 2, 0, 0); q.setFromEuler(e); m4.compose(V3(G.RP * Math.cos(a), G.RP * Math.sin(a), 0.26), q, V3(1, 1, 1)); peg.setMatrixAt(i, m4); }
    // 轴上大齿轮 A
    const gz = G.ZA; const disc = mesh(new THREE.CylinderGeometry(G.RA - 0.075, G.RA - 0.075, 0.07, 48), M.woodLight, wheel); disc.rotation.x = Math.PI / 2; disc.position.z = gz;
    const dh = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 20), M.woodDark, wheel); dh.rotation.x = Math.PI / 2; dh.position.z = gz;
    for (let i = 0; i < 6; i++) { const b = box(G.RA * 2 - 0.2, 0.08, 0.09, M.woodDark, wheel, 0, 0, gz); b.rotation.z = (i * Math.PI) / 6; if (i > 2) b.visible = false; }
    const tg = new THREE.InstancedMesh(new THREE.CapsuleGeometry(G.GEAR1.r, G.GEAR1.hh * 2, 2, 7), M.woodLight, G.NA); tg.castShadow = true; wheel.add(tg);
    for (let i = 0; i < G.NA; i++) { const a = Math.PI / 2 + (i * 2 * Math.PI) / G.NA; e.set(0, 0, a - Math.PI / 2); q.setFromEuler(e); m4.compose(V3(G.RA * Math.cos(a), G.RA * Math.sin(a), gz), q, V3(1, 1, 1)); tg.setMatrixAt(i, m4); }
  }
  // 轮轴支架（静态）
  for (const z of [0.72, -0.5]) { for (const sx of [-1, 1]) rod(V3(sx * 0.55, 0, z), V3(0, YC + 0.02, z), 0.06, M.frame, scene, 8); const b = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 16), M.iron, scene); b.rotation.x = Math.PI / 2; b.position.set(0, YC, z); }

  // ---------- 受水壶（36 只，实例化）----------
  const S = G.SCOOP;
  const scoopGeo = (() => {
    const parts = []; const add = (g, x, y, z, rz = 0, rx = 0) => { g.rotateX(rx); g.rotateZ(rz); g.translate(x, y, z); parts.push(g); };
    add(new THREE.BoxGeometry(S.L, S.t, S.hz * 2), S.L / 2, -S.t / 2, 0);
    add(new THREE.BoxGeometry(S.t, S.hIn, S.hz * 2), S.t / 2, S.hIn / 2, 0);
    add(new THREE.BoxGeometry(Math.hypot(S.lip, S.hOut), S.t, S.hz * 2), S.L - S.lip / 2, S.hOut / 2, 0, Math.atan2(S.hOut, S.lip));
    for (const s of [-1, 1]) add(new THREE.BoxGeometry(S.L, S.hSide, S.t), S.L / 2, S.hSide / 2, s * (S.hz - S.t / 2));
    add(new THREE.CylinderGeometry(0.02, 0.02, S.hz * 2 + 0.06, 8), 0, 0, 0, 0, Math.PI / 2);
    return mergeGeometries(parts);
  })();
  const pinGeo = new THREE.CylinderGeometry(G.PIN.r + 0.004, G.PIN.r + 0.004, G.PIN.hh * 2 + 0.03, 8); pinGeo.rotateX(Math.PI / 2); pinGeo.translate(G.PIN.u, G.PIN.v, G.PIN.z - 0.01);
  const scoopMesh = new THREE.InstancedMesh(scoopGeo, M.woodLight, G.N); scoopMesh.castShadow = true; scoopMesh.receiveShadow = true; scoopMesh.frustumCulled = false; scene.add(scoopMesh);
  const pinMesh = new THREE.InstancedMesh(pinGeo, M.iron, G.N); pinMesh.frustumCulled = false; scene.add(pinMesh);
  const scoopLocal = []; for (let k = 0; k < G.N; k++) scoopLocal.push(new THREE.Matrix4().makeRotationZ(k * G.PITCH + S.cant));

  // ---------- 枢衡 + 格叉 + 枢权 ----------
  const F = G.FORK;
  const fork = bind('fork', group());
  {
    const tip = V3(F.tipX + F.r - F.px, F.topY - F.r - F.py, 0), root = V3(F.tipX + F.r + F.len - F.px, F.topY - F.r - F.py, 0);
    rod(tip, root, F.r + 0.006, M.fork, fork, 10); const cap = mesh(new THREE.SphereGeometry(F.r + 0.006, 10, 8), M.fork, fork); cap.position.copy(tip);
    for (const z of [-0.045, 0.045]) rod(V3(root.x - 0.02, root.y, z), V3(-0.02, -0.02, z), 0.02, M.fork, fork, 8);
    rod(V3(root.x, root.y, -0.06), V3(root.x, root.y, 0.06), 0.02, M.fork, fork, 8);
    rod(V3(-0.12, 0, 0), V3(0.62, 0, 0), 0.028, M.fork, fork, 10);
    const w = mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.2, 16), M.bronze, fork); w.position.set(0.55, -0.16, 0); rod(V3(0.55, 0, 0), V3(0.55, -0.07, 0), 0.012, M.iron, fork, 6);
    const ax = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 10), M.iron, fork); ax.rotation.x = Math.PI / 2; ax.position.z = 0.05;
    // 压板 + 两侧挡耳（钩住天条下端）
    box(0.2, 0.024, 0.12, M.fork, fork, G.ROPE.fx, G.ROPE.fy + 0.012, 0); for (const s of [-1, 1]) box(0.024, 0.09, 0.12, M.fork, fork, G.ROPE.fx + s * 0.1, G.ROPE.fy - 0.045, 0);
    // 把压板连到杆身
    rod(V3(G.ROPE.fx, G.ROPE.fy + 0.02, 0), V3(G.ROPE.fx + 0.02, (G.ROPE.fx / (root.x)) * root.y * 0.92, 0), 0.014, M.fork, fork, 6);
  }
  rod(V3(F.px, YC + F.py, F.z + 0.19), V3(F.px, 5.4, F.z + 0.19), 0.022, M.iron, scene, 8); box(0.1, 0.14, 0.03, M.iron, scene, F.px, YC + F.py, F.z + 0.19);
  // ---------- 天衡 + 天关 + 天权 ----------
  const Hg = G.HENG;
  const heng = bind('heng', group());
  let toothMesh;
  {
    box(Hg.px + Hg.right, 0.07, 0.06, M.heng, heng, (Hg.right - Hg.px) / 2, 0, 0);
    const tx = Hg.toothX0 + Hg.toothW / 2 - Hg.px;
    toothMesh = box(Hg.toothW + 0.02, Hg.toothDown + 0.2, 0.22, M.tooth, heng, tx + 0.01, (0.2 - Hg.toothDown) / 2, G.PEG.z - Hg.z);
    box(Hg.toothW + 0.06, 0.035, 0.25, M.gold, heng, tx + 0.01, 0.215, G.PEG.z - Hg.z); box(0.12, 0.07, 0.1, M.heng, heng, tx + 0.02, 0.0, -0.06);
    const w = mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.14, 14), M.bronze, heng); w.position.set(Hg.right - 0.03, -0.12, 0); rod(V3(Hg.right - 0.03, 0, 0), V3(Hg.right - 0.03, -0.06, 0), 0.01, M.iron, heng, 6);
    const ax = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.26, 10), M.iron, heng); ax.rotation.x = Math.PI / 2; ax.position.z = 0.08;
    rod(V3(G.ROPE.hx, 0, 0), V3(G.ROPE.hx, 0, G.ROPE.z - Hg.z), 0.012, M.iron, heng, 6);
  }
  rod(V3(Hg.px, YC + Hg.py, Hg.z + 0.2), V3(Hg.px, 5.4, Hg.z + 0.2), 0.022, M.iron, scene, 8); box(0.1, 0.14, 0.03, M.iron, scene, Hg.px, YC + Hg.py, Hg.z + 0.2);
  box(3.2, 0.1, 0.1, M.frame, scene, 1.7, 5.36, 0.7);
  // ---------- 天条 ----------
  const tiao = bind('tiao', group());
  {
    const n = 22; const link = new THREE.InstancedMesh(new THREE.TorusGeometry(0.022, 0.006, 5, 10), M.tiao, n); link.castShadow = true; tiao.add(link);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < n; i++) { e.set(0, i % 2 ? Math.PI / 2 : 0, 0); q.setFromEuler(e); m4.compose(V3(0, -0.03 - (i * (G.ROPE.len - 0.06)) / (n - 1), 0), q, V3(1, 1.5, 1)); link.setMatrixAt(i, m4); }
    const bar = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 10), M.tiao, tiao); bar.rotation.x = Math.PI / 2; bar.position.set(0, -G.ROPE.len, 0);
  }

  // ---------- 天柱及其上的各轮 ----------
  const shaft = bind('shaft', group());
  const SY = sim.SY;
  const tablets = [];
  {
    const y = (w) => w - SY;
    const pole = mesh(new THREE.CylinderGeometry(0.06, 0.06, 9.0, 16), M.woodDark, shaft); pole.position.y = y(4.85);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    const crown = (yc, R, n, phase, hh, r, discAbove) => {
      const d = mesh(new THREE.CylinderGeometry(R + 0.06, R + 0.06, 0.05, 40), M.woodLight, shaft); d.position.y = y(yc) + (discAbove ? 1 : -1) * (hh + r + 0.02);
      const hb = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 16), M.woodDark, shaft); hb.position.y = d.position.y;
      const im = new THREE.InstancedMesh(new THREE.CapsuleGeometry(r, hh * 2, 2, 7), M.woodLight, n); im.castShadow = true; shaft.add(im);
      for (let i = 0; i < n; i++) { const a = phase + (i * 2 * Math.PI) / n; m4.makeTranslation(R * Math.sin(a), y(yc), R * Math.cos(a)); im.setMatrixAt(i, m4); }
    };
    crown(YC + G.RA, G.RB, G.NB, Math.PI / G.NB, G.GEAR1.hh, G.GEAR1.r, true);
    crown(G.YGC, G.RC, G.NC, 0, G.GEAR2.hh, G.GEAR2.r, false);
    crown(G.YGC2, G.RC2, G.NC2, 0, G.GEAR2.hh, G.GEAR2.r, false);
    // 拨牙轮（两圈）
    const T = G.TRIP;
    for (let ring = 0; ring < 2; ring++) {
      const ys = (ring === 0 ? T.y1 : T.y2) - 0.03 + T.br, yr = ys - 0.085;
      const t = mesh(new THREE.TorusGeometry(T.r, 0.018, 5, 48), M.woodLight, shaft); t.rotation.x = Math.PI / 2; t.position.y = y(yr);
      for (let i = 0; i < 4; i++) { const b = box(T.r * 2, 0.03, 0.04, M.woodDark, shaft, 0, y(yr), 0); b.rotation.y = (i * Math.PI) / 4; }
      const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(T.br, T.br, 0.085, 8), M.gold, T.n); shaft.add(im);
      const im2 = new THREE.InstancedMesh(new THREE.SphereGeometry(T.br * 1.15, 6, 5), M.gold, T.n); shaft.add(im2);
      for (let i = 0; i < T.n; i++) { const psi = sim.tripPhase[ring] + (i * 2 * Math.PI) / T.n; m4.makeTranslation(T.r * Math.sin(psi), y(ys - 0.045), -T.r * Math.cos(psi)); im.setMatrixAt(i, m4); m4.makeTranslation(T.r * Math.sin(psi), y(ys), -T.r * Math.cos(psi)); im2.setMatrixAt(i, m4); }
    }
    // 报时牌机轮：24 个抱牌木人
    const FG = G.FIG;
    const d = mesh(new THREE.CylinderGeometry(FG.r + 0.07, FG.r + 0.07, 0.04, 48), M.woodLight, shaft); d.position.y = y(FG.y - 0.02);
    for (let i = 0; i < 4; i++) { const b = box(FG.r * 2, 0.05, 0.06, M.woodDark, shaft, 0, y(FG.y - 0.065), 0); b.rotation.y = (i * Math.PI) / 4; }
    const BR = '子丑寅卯辰巳午未申酉戌亥';
    const bodyG = new THREE.CylinderGeometry(0.045, 0.085, 0.3, 8, 1, true); bodyG.translate(0, 0.15, 0);
    const headG = new THREE.SphereGeometry(0.05, 8, 6); headG.translate(0, 0.35, 0);
    const hatG = new THREE.CylinderGeometry(0.02, 0.045, 0.05, 6); hatG.translate(0, 0.415, 0);
    // 24 块报时牌画在同一张贴图上（一个材质、一次绘制）
    const CW = 96, CH = 192, COLS = 6, ROWS = 4; const label = (i) => { const idx = (i + 4) % 24; return [BR[Math.floor(idx / 2)] + (idx % 2 ? '正' : '初'), idx % 2]; };
    const atlas = canvasTex(CW * COLS, CH * ROWS, (c) => {
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 74px "Noto Serif CJK SC","Songti SC","STSong","SimSun","PingFang SC","Microsoft YaHei",serif';
      for (let i = 0; i < FG.n; i++) {
        const [txt, zheng] = label(i); const x = (i % COLS) * CW, yy = Math.floor(i / COLS) * CH;
        c.fillStyle = zheng ? '#b3261a' : '#f3e6c4'; c.fillRect(x, yy, CW, CH); c.strokeStyle = '#c9a24a'; c.lineWidth = 8; c.strokeRect(x + 4, yy + 4, CW - 8, CH - 8);
        c.fillStyle = zheng ? '#ffe9b0' : '#1c1208'; c.fillText(txt[0], x + CW / 2, yy + CH * 0.29); c.fillText(txt[1], x + CW / 2, yy + CH * 0.71);
      }
    });
    const tabletMat = std({ map: atlas, roughness: 0.6 });
    for (let i = 0; i < FG.n; i++) {
      const psi = (i * 2 * Math.PI) / FG.n; const g = group(shaft); g.position.set(FG.r * Math.sin(psi), y(FG.y), -FG.r * Math.cos(psi)); g.rotation.y = -psi;
      mesh(bodyG, M.robe[i % 3], g); mesh(headG, M.skin, g); mesh(hatG, M.frame, g);
      box(0.13, 0.26, 0.012, M.frame, g, 0, 0.2, -0.1).castShadow = false;
      const face = new THREE.PlaneGeometry(0.122, 0.252); const uv = face.attributes.uv; const u0 = (i % COLS) / COLS, v0 = 1 - (Math.floor(i / COLS) + 1) / ROWS;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, u0 + uv.getX(k) / COLS, v0 + uv.getY(k) / ROWS);
      const fm = mesh(face, tabletMat, g, false); fm.rotation.y = Math.PI; fm.position.set(0, 0.2, -0.1065);
      tablets.push({ g, txt: label(i)[0] });
    }
  }
  box(0.5, 0.12, 0.5, M.frame, scene, 0, 0.06, G.ZS);

  // ---------- 木人落锤、钟与铃 ----------
  const ham = {};
  for (const k of ['A', 'B']) {
    const v = sim.view['ham' + k]; const A = k === 'A'; const g = bind('ham' + k, group()); ham[k] = g;
    const armZ = v.hz;
    rod(V3(0, 0, armZ), V3(v.hx, v.hy + 0.03, armZ), 0.017, M.woodLight, g, 8);
    const head = mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.09, 12), M.woodDark, g); head.position.set(v.hx, v.hy + 0.012, armZ);
    const ax = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 8), M.iron, g); ax.rotation.x = Math.PI / 2; ax.position.z = (armZ + 0.1) / 2;
    if (A) { const a = 150 * DEG; const b = box(0.13, 0.008, 0.14, M.gold, g, 0.065 * Math.cos(a), 0.065 * Math.sin(a), 0.02); b.rotation.z = a - Math.PI; }
    else { const x0 = 0.12, y0 = 0.055, x1 = 0.24, y1 = -0.014; const b = box(Math.hypot(x1 - x0, y1 - y0), 0.008, 0.14, M.gold, g, (x0 + x1) / 2, (y0 + y1) / 2, 0.02); b.rotation.z = Math.atan2(y1 - y0, x1 - x0); rod(V3(0, 0, 0.02), V3(x0 + 0.01, y0, 0.02), 0.01, M.gold, g, 6); }
    // 钟 / 铃
    const R = v.bellR; const pts = [];
    const prof = (t) => R * (0.12 + 0.88 * Math.pow(Math.sin((t * Math.PI) / 2), 0.55)) * (1 + 0.16 * Math.pow(t, 6));
    for (let i = 0; i <= 14; i++) { const t = i / 14; pts.push(new THREE.Vector2(prof(t), -t * R * 2.1)); }
    for (let i = 14; i >= 1; i--) { const t = i / 14; pts.push(new THREE.Vector2(prof(t) * 0.86, -t * R * 2.1 - 0.001)); } // 内壁（让钟有厚度，不需要双面材质）
    const bell = mesh(new THREE.LatheGeometry(pts, 28), A ? M.bronze : M.gold, scene); bell.material = (A ? M.bronze : M.gold).clone();
    bell.position.set(v.bell.x, v.bell.y + R, v.bell.z); ham['bell' + k] = bell;
    rod(V3(v.bell.x, v.bell.y + R * 0.9, v.bell.z), V3(v.bell.x, v.bell.y + R * 0.9, v.bell.z + 0.2), 0.012, M.iron, scene, 6);
    rod(V3(v.bell.x, FLOORS[4], v.bell.z + 0.2), V3(v.bell.x, v.bell.y + R, v.bell.z + 0.2), 0.016, M.frame, scene, 6);
    // 木人（静态躯干，手臂就是落锤杠杆）
    const fig = group(); const hgt = A ? 0.46 : 0.3; const sc = hgt / 0.46; fig.position.set(v.px + (A ? -0.02 : 0.02), v.py - 0.33 * sc, v.pz - 0.085); fig.scale.setScalar(sc);
    const body = mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.34, 12), M.robe[A ? 1 : 0], fig); body.position.y = 0.17;
    const hd = mesh(new THREE.SphereGeometry(0.055, 14, 10), M.skin, fig); hd.position.y = 0.4;
    const hat = mesh(new THREE.CylinderGeometry(0.025, 0.05, 0.05, 8), M.frame, fig); hat.position.y = 0.47;
  }
  box(1.7, 0.03, 0.5, M.woodDark, scene, -0.05, FLOORS[4] - 0.0, -2.12);

  // ---------- 浑象 ----------
  const nV = V3(G.n.x, G.n.y, G.n.z), qPole = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), nV);
  const globe = bind('globe', group());
  {
    const inner = group(globe); inner.quaternion.copy(qPole);
    const tex = canvasTex(1024, 512, (c, w, h) => {
      const r = rng(77); const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1b2440'); gr.addColorStop(0.5, '#10182c'); gr.addColorStop(1, '#1b2440'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(200,170,110,0.28)'; c.lineWidth = 1; for (let i = 0; i < 24; i++) { c.beginPath(); c.moveTo((i / 24) * w, 0); c.lineTo((i / 24) * w, h); c.stroke(); } for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, (i / 6) * h); c.lineTo(w, (i / 6) * h); c.stroke(); }
      c.strokeStyle = '#d6452f'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke();
      c.strokeStyle = '#e9c06a'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= w; x += 4) { const yy = h / 2 + Math.sin((x / w) * Math.PI * 2) * h * 0.13; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } c.stroke();
      for (let k = 0; k < 44; k++) { let x = r() * w, yy = h * 0.12 + r() * h * 0.76; const n = 2 + Math.floor(r() * 4); c.strokeStyle = 'rgba(240,225,180,0.55)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, yy); const ps = [[x, yy]]; for (let i = 0; i < n; i++) { x += (r() - 0.5) * 60; yy += (r() - 0.5) * 44; c.lineTo(x, yy); ps.push([x, yy]); } c.stroke(); for (const p of ps) { c.fillStyle = r() > 0.7 ? '#ffe9a8' : '#fff'; c.beginPath(); c.arc(p[0], p[1], 2.2 + r() * 2.6, 0, 7); c.fill(); } }
      for (let i = 0; i < 500; i++) { c.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.6})`; c.beginPath(); c.arc(r() * w, r() * h, 0.6 + r() * 1.3, 0, 7); c.fill(); }
    });
    mesh(new THREE.SphereGeometry(0.62, 40, 24), std({ map: tex, roughness: 0.45, metalness: 0.2, emissive: 0x1a2a4a, emissiveIntensity: 0.3 }), inner);
    const ring = mesh(new THREE.TorusGeometry(G.RD - 0.07, 0.035, 6, 60), M.bronze, inner); ring.rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) { const b = box(0.05, 0.03, G.RD - 0.07 - 0.6, M.bronze, inner, 0, 0, 0); b.position.set(Math.cos((i * Math.PI) / 2) * (0.62 + (G.RD - 0.69) / 2), 0, Math.sin((i * Math.PI) / 2) * (0.62 + (G.RD - 0.69) / 2)); b.rotation.y = -(i * Math.PI) / 2 + Math.PI / 2; }
    const ax = mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.9, 10), M.bronzeDark, inner);
    // 赤道牙（径向木齿），与物理碰撞体同位
    const im = new THREE.InstancedMesh(new THREE.CapsuleGeometry(G.GEAR2.r, G.GEAR2.hhD * 2, 2, 7), M.woodLight, G.ND); im.castShadow = true; globe.add(im);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(); const X = V3(1, 0, 0), U = V3(G.u1.x, G.u1.y, G.u1.z);
    for (let i = 0; i < G.ND; i++) { const a = Math.PI / 2 + Math.PI / G.ND + (i * 2 * Math.PI) / G.ND; const rd = X.clone().multiplyScalar(Math.cos(a)).addScaledVector(U, Math.sin(a)); q.setFromUnitVectors(V3(0, 1, 0), rd); m4.compose(rd.clone().multiplyScalar(G.RD), q, V3(1, 1, 1)); im.setMatrixAt(i, m4); }
  }
  { // 地柜（静态）
    const gc = V3(0, G.GLOBE.y, G.GLOBE.z); const hw = 0.98, y0 = T2.y0 + 0.1, y1 = G.GLOBE.y - 0.02;
    for (const s of [-1, 1]) { box(0.06, y1 - y0, hw * 2, M.red, scene, gc.x + s * hw, (y0 + y1) / 2, gc.z); box(hw * 2, y1 - y0, 0.06, M.red, scene, gc.x, (y0 + y1) / 2, gc.z + s * hw); box(0.12, 0.06, hw * 2 + 0.12, M.frame, scene, gc.x + s * hw, y1 + 0.03, gc.z); box(hw * 2 + 0.12, 0.06, 0.12, M.frame, scene, gc.x, y1 + 0.03, gc.z + s * hw); }
    for (const s of [-1, 1]) rod(gc.clone().addScaledVector(nV, s * 0.95), V3(gc.x, y1, gc.z + s * 0.95 * G.n.z), 0.03, M.bronzeDark, scene, 8);
  }

  // ---------- 浑仪 ----------
  const armil = bind('armil', group());
  const ac = V3(0, G.ARM.y, G.ARM.z);
  {
    const ringGeo = (R, t = 0.024) => new THREE.TorusGeometry(R, t, 6, 64);
    const inner = group(armil); inner.quaternion.copy(qPole);
    mesh(new THREE.CylinderGeometry(0.028, 0.028, 2.75, 10), M.bronzeDark, inner).position.y = -0.2;
    const eq = mesh(ringGeo(0.84, 0.028), M.gold, inner); eq.rotation.x = Math.PI / 2;
    const ec = mesh(ringGeo(0.82, 0.02), M.bronze, inner); ec.rotation.x = Math.PI / 2 + 23.5 * DEG;
    mesh(ringGeo(0.86, 0.022), M.bronze, inner); const col2 = mesh(ringGeo(0.86, 0.022), M.bronze, inner); col2.rotation.y = Math.PI / 2;
    const tube = mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 10), M.gold, inner); tube.rotation.z = 62 * DEG; // 望筒
    const sr = mesh(ringGeo(0.7, 0.016), M.bronzeDark, inner); sr.rotation.y = Math.PI / 2; sr.rotation.x = 0.0;
    // 天运环（从动齿轮）
    const gy = -G.ARM.dA; const d = mesh(new THREE.CylinderGeometry(G.RD2 - 0.06, G.RD2 - 0.06, 0.05, 36), M.woodLight, inner); d.position.y = gy;
    const im = new THREE.InstancedMesh(new THREE.CapsuleGeometry(G.GEAR2.r, G.GEAR2.hhD * 2, 2, 7), M.woodLight, G.ND2); im.castShadow = true; armil.add(im);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(); const X = V3(1, 0, 0), U = V3(G.u1.x, G.u1.y, G.u1.z); const c0 = nV.clone().multiplyScalar(-G.ARM.dA);
    for (let i = 0; i < G.ND2; i++) { const a = Math.PI / 2 + Math.PI / G.ND2 + (i * 2 * Math.PI) / G.ND2; const rd = X.clone().multiplyScalar(Math.cos(a)).addScaledVector(U, Math.sin(a)); q.setFromUnitVectors(V3(0, 1, 0), rd); m4.compose(c0.clone().addScaledVector(rd, G.RD2), q, V3(1, 1, 1)); im.setMatrixAt(i, m4); }
  }
  { // 六合仪（固定的外层环）与龙柱
    const fixed = group(); fixed.position.copy(ac);
    const hz = mesh(new THREE.TorusGeometry(1.0, 0.035, 6, 64), M.bronzeDark, fixed); hz.rotation.x = Math.PI / 2;
    const mer = mesh(new THREE.TorusGeometry(1.0, 0.03, 6, 64), M.bronzeDark, fixed); mer.rotation.y = Math.PI / 2;
    const eqf = mesh(new THREE.TorusGeometry(0.97, 0.02, 6, 64), M.bronzeDark, fixed); eqf.quaternion.copy(qPole).multiply(new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), Math.PI / 2));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const top = V3(sx * 0.707, 0, sz * 0.707); const bot = V3(sx * 0.85, T3.y0 + 0.1 - ac.y, sz * 0.85); rod(bot, top, 0.045, M.bronze, fixed, 10); const ft = mesh(new THREE.SphereGeometry(0.08, 10, 8), M.bronze, fixed); ft.position.copy(bot); }
    rod(V3(0, T3.y0 + 0.1 - ac.y, 0.5), V3(0, -1.0, 0.0), 0.05, M.bronze, fixed, 10);
    box(2.4, 0.08, 2.4, M.stone, scene, ac.x, T3.y0 + 0.14, ac.z);
  }

  // ---------- 水珠 ----------
  const NB = G.MAXB;
  const ballMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(G.BALL_R * 1.04, 10, 7), M.water, NB); ballMesh.frustumCulled = false; ballMesh.castShadow = true; scene.add(ballMesh);
  const TR = 3; // 每颗水珠拖 3 颗小水滴（由其物理轨迹的历史位置生成）
  const dropMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(G.BALL_R * 0.55, 0), M.water, NB * TR); dropMesh.frustumCulled = false; scene.add(dropMesh);
  const hist = new Float32Array(NB * 3 * 8); const histN = new Uint8Array(NB); let histHead = 0;

  // ---------- 合并同材质的网格：几百个零件 → 几十次绘制 ----------
  const mergeUnder = (root, stop) => {
    root.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(); const buckets = new Map(); const gone = [];
    const visit = (o) => {
      if (o !== root && stop && stop.has(o)) return;
      if (o.isMesh && !o.isInstancedMesh && !Array.isArray(o.material) && o.children.length === 0) {
        const g = o.geometry.index ? o.geometry.clone() : null; if (!g) return; g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
        const key = o.material.uuid + (o.castShadow ? 'c' : 'n'); let b = buckets.get(key); if (!b) { b = { mat: o.material, cast: o.castShadow, geos: [] }; buckets.set(key, b); } b.geos.push(g); gone.push(o); return;
      }
      for (const c of o.children.slice()) visit(c);
    };
    visit(root);
    for (const b of buckets.values()) { if (b.geos.length < 2) continue; const mg = mergeGeometries(b.geos, false); if (!mg) continue; const m = new THREE.Mesh(mg, b.mat); m.castShadow = b.cast; m.receiveShadow = true; root.add(m); b.done = true; }
    for (const o of gone) { const b = buckets.get(o.material.uuid + (o.castShadow ? 'c' : 'n')); if (b && b.done) { o.parent.remove(o); o.geometry.dispose(); } }
  };
  { const special = new Set([shell, frame, facade, roof, frontWall, ...dyn.map((d) => d.obj)]);
    for (const g of special) mergeUnder(g, null);
    mergeUnder(scene, special); }

  // ---------- 同步：物理 → 画面 ----------
  const m4 = new THREE.Matrix4(), mB = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), one = V3(1, 1, 1), zero = new THREE.Matrix4().makeScale(0, 0, 0);
  function sync() {
    for (const d of dyn) { const body = sim.bodies[d.key]; const t = body.translation(), r = body.rotation(); d.obj.position.set(t.x, t.y, t.z); d.obj.quaternion.set(r.x, r.y, r.z, r.w); }
    const sc = sim.bodies.scoops;
    for (let k = 0; k < G.N; k++) { const t = sc[k].translation(), r = sc[k].rotation(); p.set(t.x, t.y, t.z); q.set(r.x, r.y, r.z, r.w); mB.compose(p, q, one); m4.multiplyMatrices(mB, scoopLocal[k]); scoopMesh.setMatrixAt(k, m4); pinMesh.setMatrixAt(k, m4); }
    scoopMesh.instanceMatrix.needsUpdate = true; pinMesh.instanceMatrix.needsUpdate = true;
    const balls = sim.balls; histHead = (histHead + 1) % 8; let nb = 0, nd = 0;
    for (let i = 0; i < NB; i++) {
      const b = balls[i];
      if (!b || !b._on) { histN[i] = 0; continue; }
      const t = b.translation(); m4.makeTranslation(t.x, t.y, t.z); ballMesh.setMatrixAt(nb++, m4);
      const o = i * 24 + histHead * 3; hist[o] = t.x; hist[o + 1] = t.y; hist[o + 2] = t.z; if (histN[i] < 8) histN[i]++;
      for (let j = 0; j < TR; j++) {
        const back = (j + 1) * 2; if (histN[i] <= back) continue;
        const oo = i * 24 + ((histHead - back + 8) % 8) * 3; const dx = hist[oo] - t.x, dy = hist[oo + 1] - t.y, dz = hist[oo + 2] - t.z; const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 0.0016 || d2 > 0.25) continue;
        const s = 1 - j * 0.22; m4.makeScale(s, s, s); m4.setPosition(hist[oo] + ((i * 7 + j * 3) % 5 - 2) * 0.006, hist[oo + 1], hist[oo + 2] + ((i * 5 + j) % 5 - 2) * 0.006); dropMesh.setMatrixAt(nd++, m4);
      }
    }
    ballMesh.count = nb; dropMesh.count = nd; ballMesh.instanceMatrix.needsUpdate = true; dropMesh.instanceMatrix.needsUpdate = true;
  }

  // ---------- 淡入淡出 ----------
  const fogSet = (near, far) => { scene.fog.near = near; scene.fog.far = far; };
  // 半透明（幽灵化）的外壳不再投影，免得把内部机件罩在阴影里
  const setOp = (mats, grp, o) => { grp.visible = o > 0.01; for (const m of mats) { m.opacity = o; m.depthWrite = o > 0.9; } const cast = o > 0.6; if (grp.userData.cast !== cast) { grp.userData.cast = cast; grp.traverse((ch) => { if (ch.isMesh) ch.castShadow = cast; }); } };
  // ---------- 事件高亮 ----------
  const glow = { fork: 0, tiao: 0, heng: 0, tooth: 0, peg: 0, bellA: 0, bellB: 0 };
  function update(dt) {
    for (const k in glow) glow[k] = Math.max(0, glow[k] - dt * 1.6);
    M.fork.emissiveIntensity = glow.fork * 1.3; M.tiao.emissiveIntensity = glow.tiao * 1.6; M.heng.emissiveIntensity = glow.heng * 1.1; M.tooth.emissiveIntensity = 0.12 + glow.tooth * 2.0; M.peg.emissiveIntensity = glow.peg * 0.9;
    ham.bellA.material.emissive.setHex(0xffb040); ham.bellA.material.emissiveIntensity = glow.bellA * 1.2; ham.bellB.material.emissive.setHex(0xffe080); ham.bellB.material.emissiveIntensity = glow.bellB * 1.2;
  }

  // ---------- 标注锚点（世界坐标，随物理刚体移动）----------
  const tmp = new THREE.Vector3();
  const local = (obj, x, y, z) => () => tmp.set(x, y, z).applyMatrix4(obj.matrixWorld).clone();
  const fixedP = (x, y, z) => { const v = V3(x, y, z); return () => v; };
  const anchors = {
    tianchi: fixedP(3.27, YC + 1.55, 0.36), pingshui: fixedP(3.0, YC + 0.62, 0.3), chute: fixedP(2.4, YC + 0.36, 0.08), basin: fixedP(1.9, 0.5, 0.55),
    scoop: fixedP(G.RH + 0.16, YC + 0.04, 0.2), wheel: fixedP(-0.75, YC - 0.75, 0.2), wheelRim: fixedP(-1.25, YC + 1.2, 0.2),
    fork: local(fork, F.tipX + 0.1 - F.px, F.topY - F.py - 0.01, 0.05), forkW: local(fork, 0.55, -0.16, 0.05),
    tiao: local(tiao, 0, -G.ROPE.len * 0.5, 0.02), heng: local(heng, -0.55, 0.03, 0.03), tooth: local(heng, Hg.toothX0 + Hg.toothW / 2 - Hg.px, 0.07, G.PEG.z - Hg.z),
    gearA: fixedP(-0.4, YC + 0.3, G.ZA - 0.05), gearB: fixedP(0.3, YC + G.RA + 0.12, G.ZS - 0.3), shaft: fixedP(0, 4.35, G.ZS - 0.06), shaftHi: fixedP(0, 7.7, G.ZS - 0.06),
    globe: fixedP(-0.45, G.GLOBE.y + 0.35, G.GLOBE.z - 0.3), armil: fixedP(-0.7, G.ARM.y + 0.55, G.ARM.z - 0.5), gearC: fixedP(0.25, G.YGC, G.ZS + 0.2), gearC2: fixedP(0.2, G.YGC2, G.ZS + 0.1),
    door: fixedP(0.2, 4.12, ZFACE - 0.05), bellA: fixedP(sim.view.hamA.bell.x + 0.08, sim.view.hamA.bell.y, ZFACE), bellB: fixedP(sim.view.hamB.bell.x - 0.06, sim.view.hamB.bell.y, ZFACE), jack: fixedP(0.05, 5.02, ZFACE),
  };

  function resize(w, h) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  return {
    renderer, scene, camera, sync, update, resize, anchors, glow, key, setSim: (s2) => { sim = s2; histN.fill(0); },
    setFog: fogSet, setFrame: (o) => setOp(frameMats, frame, o), setFront: (o) => setOp(frontMats, frontWall, o),
    setShell: (o) => setOp(shellMats, shell, o), setFacade: (o) => setOp(facadeMats, facade, o), setRoof: (o) => setOp(roofMats, roof, o),
    render: () => renderer.render(scene, camera),
  };
}
