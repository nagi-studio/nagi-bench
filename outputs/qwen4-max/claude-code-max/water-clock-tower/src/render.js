// 三维场景与机构视觉：所有机构网格每帧从物理刚体同步位姿（物理驱动渲染）
import * as THREE from 'three';
import { mergeGeometries as mergeOrig } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// 统一转为非索引几何，避免 Extrude(非索引) 与 Box/Cylinder(索引) 混用导致合并失败
const mergeGeometries = (geos) => mergeOrig(geos.map(g => g.index ? g.toNonIndexed() : g));
import { L } from './sim/machine.js';

const DEG = Math.PI / 180;

// ---- 材质 ------------------------------------------------------------------
// Phong 材质（软件渲染下远比 PBR+环境贴图便宜）
function makeMaterials() {
  const wood = new THREE.MeshPhongMaterial({ color: 0x8a5438, shininess: 12 });
  const woodDark = new THREE.MeshPhongMaterial({ color: 0x5a3626, shininess: 8 });
  const bronze = new THREE.MeshPhongMaterial({ color: 0xc89a5a, specular: 0xffe0a0, shininess: 60 });
  const bronzeDark = new THREE.MeshPhongMaterial({ color: 0x8a6e42, specular: 0xd0b080, shininess: 40 });
  const iron = new THREE.MeshPhongMaterial({ color: 0x6a7078, specular: 0xa0a8b0, shininess: 50 });
  const stone = new THREE.MeshPhongMaterial({ color: 0x767c86, shininess: 4 });
  const roof = new THREE.MeshPhongMaterial({ color: 0x3a5f58, shininess: 20 });
  const water = new THREE.MeshPhongMaterial({ color: 0x8ae8ff, emissive: 0x2a9ac0, emissiveIntensity: 1.1, shininess: 80, transparent: true, opacity: 0.95 });
  const lantern = new THREE.MeshPhongMaterial({ color: 0xffb060, emissive: 0xff8030, emissiveIntensity: 1.6 });
  const figure = new THREE.MeshPhongMaterial({ color: 0xd0a870, shininess: 15 });
  const figureRobe = new THREE.MeshPhongMaterial({ color: 0xa8402f, shininess: 10 });
  const tablet = new THREE.MeshPhongMaterial({ color: 0xf0e0b8, shininess: 20 });
  return { wood, woodDark, bronze, bronzeDark, iron, stone, roof, water, lantern, figure, figureRobe, tablet };
}

// ---- 齿轮网格 --------------------------------------------------------------
function gearMesh(mat, teeth, pitchR, toothH, toothW, thick, hubR) {
  const geos = [];
  const hub = new THREE.CylinderGeometry(hubR, hubR, thick, 24);
  geos.push(hub);
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    // 梯形齿（与物理凸包一致）
    const shape = new THREE.Shape();
    const wb = toothW, wt = toothW * 0.5;
    shape.moveTo(-wb / 2, 0); shape.lineTo(wb / 2, 0);
    shape.lineTo(wt / 2, toothH); shape.lineTo(-wt / 2, toothH); shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
    g.translate(0, 0, -thick / 2);
    g.rotateX(Math.PI / 2); // 齿径向沿 +Y -> 转到 XY 平面径向
    g.translate(0, pitchR - toothH * 0.5, 0);
    g.rotateZ(-a);
    geos.push(g);
  }
  const merged = mergeGeometries(geos);
  return new THREE.Mesh(merged, mat);
}

// 水平齿轮（轴 Y）
function gearMeshH(mat, teeth, pitchR, toothH, toothW, thick, hubR) {
  const geos = [];
  geos.push(new THREE.CylinderGeometry(hubR, hubR, thick, 24));
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const shape = new THREE.Shape();
    const wb = toothW, wt = toothW * 0.5;
    shape.moveTo(-wb / 2, 0); shape.lineTo(wb / 2, 0);
    shape.lineTo(wt / 2, toothH); shape.lineTo(-wt / 2, toothH); shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
    g.translate(0, 0, -thick / 2);
    g.rotateX(-Math.PI / 2); // 径向 +Y -> +Z
    g.translate(0, 0, pitchR - toothH * 0.5);
    g.rotateY(a);
    geos.push(g);
  }
  return new THREE.Mesh(mergeGeometries(geos), mat);
}

// ---- 星空贴图（程序化） ----------------------------------------------------
function starTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const grd = ctx.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#1a2a4a'); grd.addColorStop(0.5, '#243a5e'); grd.addColorStop(1, '#1a2a4a');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512, y = Math.random() * 256;
    const r = Math.random() * 1.3 + 0.3;
    ctx.fillStyle = `rgba(255,255,${200 + Math.random() * 55 | 0},${0.4 + Math.random() * 0.6})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  // 赤道/黄道线
  ctx.strokeStyle = 'rgba(180,200,255,0.25)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 128); ctx.lineTo(512, 128); ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---- 建筑 ------------------------------------------------------------------
function buildArchitecture(M) {
  const g = new THREE.Group();
  const woodGeos = [], stoneGeos = [], roofGeos = [], darkGeos = [];
  const box = (w, h, d, x, y, z) => { const b = new THREE.BoxGeometry(w, h, d); b.translate(x, y, z); return b; };

  // 石台基
  stoneGeos.push(box(6.4, 0.6, 6.4, 0, 0.3, 0));
  stoneGeos.push(box(7.0, 0.25, 7.0, 0, 0.05, 0));
  // 台阶
  for (let i = 0; i < 3; i++) stoneGeos.push(box(2.4, 0.2, 0.5, 0, 0.1 + i * 0.2, 3.4 + i * 0.5));

  const levels = [
    { y0: 0.6, y1: 8.0, half: 2.6 },
    { y0: 8.0, y1: 10.0, half: 1.9 },
  ];
  for (const lv of levels) {
    const h = lv.y1 - lv.y0, cy = (lv.y0 + lv.y1) / 2, hf = lv.half;
    // 四角柱
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      woodGeos.push(box(0.28, h, 0.28, sx * hf, cy, sz * hf));
    }
    // 额枋（顶/底梁）
    for (const yy of [lv.y0 + 0.15, lv.y1 - 0.15]) {
      woodGeos.push(box(hf * 2 + 0.3, 0.22, 0.2, 0, yy, hf));
      woodGeos.push(box(hf * 2 + 0.3, 0.22, 0.2, 0, yy, -hf));
      woodGeos.push(box(0.2, 0.22, hf * 2 + 0.3, hf, yy, 0));
      woodGeos.push(box(0.2, 0.22, hf * 2 + 0.3, -hf, yy, 0));
    }
    // 后墙与侧墙（前侧 +Z 敞开做剖面）
    darkGeos.push(box(hf * 2, h, 0.12, 0, cy, -hf));
    darkGeos.push(box(0.12, h, hf * 2, -hf, cy, 0));
    darkGeos.push(box(0.12, h, hf * 2, hf, cy, 0));
    // 楼层板（中空，仅周边，保证剖面可见内部）
    const eave = hf + 0.65, inner = hf - 0.15;
    woodGeos.push(box(eave * 2, 0.16, eave - inner, 0, lv.y1, (eave + inner) / 2));
    woodGeos.push(box(eave * 2, 0.16, eave - inner, 0, lv.y1, -(eave + inner) / 2));
    woodGeos.push(box(eave - inner, 0.16, inner * 2, (eave + inner) / 2, lv.y1, 0));
    woodGeos.push(box(eave - inner, 0.16, inner * 2, -(eave + inner) / 2, lv.y1, 0));
    // 挑檐（周边坡檐，中心敞开）
    const skirt = (w, d, x, z, rz, rx) => {
      const b = new THREE.BoxGeometry(w, 0.1, d);
      if (rz) b.rotateZ(rz); if (rx) b.rotateX(rx);
      b.translate(x, lv.y1 + 0.28, z);
      roofGeos.push(b);
    };
    skirt(eave * 2, 0.8, 0, eave - 0.3, 0, -0.35);
    skirt(eave * 2, 0.8, 0, -(eave - 0.3), 0, 0.35);
    skirt(0.8, inner * 2, eave - 0.3, 0, 0.35, 0);
    skirt(0.8, inner * 2, -(eave - 0.3), 0, -0.35, 0);
    // 檐角起翘
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const tip = new THREE.BoxGeometry(0.5, 0.08, 0.5);
      tip.rotateZ(sx * 0.4); tip.rotateX(-sz * 0.4);
      tip.translate(sx * eave, lv.y1 + 0.45, sz * eave);
      roofGeos.push(tip);
    }
    // 顶层平台栏杆
    if (lv.y1 >= 10) {
      for (let i = -3; i <= 3; i++) {
        woodGeos.push(box(0.07, 0.45, 0.07, i * 0.55, lv.y1 + 0.3, hf));
        woodGeos.push(box(0.07, 0.45, 0.07, i * 0.55, lv.y1 + 0.3, -hf));
        woodGeos.push(box(0.07, 0.45, 0.07, hf, lv.y1 + 0.3, i * 0.55));
        woodGeos.push(box(0.07, 0.45, 0.07, -hf, lv.y1 + 0.3, i * 0.55));
      }
      woodGeos.push(box(hf * 2, 0.07, 0.07, 0, lv.y1 + 0.52, hf));
      woodGeos.push(box(hf * 2, 0.07, 0.07, 0, lv.y1 + 0.52, -hf));
      woodGeos.push(box(0.07, 0.07, hf * 2, hf, lv.y1 + 0.52, 0));
      woodGeos.push(box(0.07, 0.07, hf * 2, -hf, lv.y1 + 0.52, 0));
    }
  }

  const addMerged = (geos, mat) => {
    if (!geos.length) return;
    const m = new THREE.Mesh(mergeGeometries(geos), mat);
    m.castShadow = true; m.receiveShadow = true;
    g.add(m);
  };
  addMerged(stoneGeos, M.stone);
  addMerged(woodGeos, M.wood);
  addMerged(darkGeos, M.woodDark);
  addMerged(roofGeos, M.roof);
  return g;
}

// ---- 报时木阁（五层木人橱） ------------------------------------------------
function buildPagoda(M) {
  const g = new THREE.Group();
  const cx = L.carouselC.x, cz = L.carouselC.z;
  const geos = [];
  const box = (w, h, d, x, y, z) => { const b = new THREE.BoxGeometry(w, h, d); b.translate(x, y, z); return b; };
  // 五层框架（前面 +Z 开门）
  for (let t = 0; t < 5; t++) {
    const y = 0.75 + t * 0.42;
    geos.push(box(2.5, 0.06, 2.5, cx, y, cz)); // 隔板
    // 四角立柱
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      if (sz > 0 && Math.abs(sx) < 1) continue;
      geos.push(box(0.08, 0.42, 0.08, cx + sx * 1.2, y + 0.21, cz + sz * 1.2));
    }
    // 后/侧壁
    geos.push(box(2.4, 0.36, 0.05, cx, y + 0.21, cz - 1.2));
    geos.push(box(0.05, 0.36, 2.4, cx - 1.2, y + 0.21, cz));
    geos.push(box(0.05, 0.36, 2.4, cx + 1.2, y + 0.21, cz));
    // 前面门框（留门洞）
    geos.push(box(0.5, 0.36, 0.05, cx - 0.95, y + 0.21, cz + 1.2));
    geos.push(box(0.5, 0.36, 0.05, cx + 0.95, y + 0.21, cz + 1.2));
    geos.push(box(1.4, 0.08, 0.05, cx, y + 0.4, cz + 1.2));
  }
  // 顶盖
  const cap = new THREE.ConeGeometry(1.9, 0.6, 4, 1);
  cap.rotateY(Math.PI / 4); cap.translate(cx, 3.1, cz);
  const m = new THREE.Mesh(mergeGeometries(geos), M.wood);
  m.castShadow = true;
  g.add(m);
  const capM = new THREE.Mesh(cap, M.roof); capM.castShadow = true; g.add(capM);
  return g;
}

// ---- 机构视觉组 -------------------------------------------------------------
function buildMachineVisuals(M) {
  const groups = {};

  // 枢轮
  const wheel = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(L.wheelR, 0.06, 12, 48), M.bronzeDark);
  wheel.add(rim);
  const rim2 = new THREE.Mesh(new THREE.TorusGeometry(L.wheelR - 0.18, 0.04, 10, 48), M.bronzeDark);
  wheel.add(rim2);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.24, 20), M.bronze);
  hub.rotateX(Math.PI / 2); wheel.add(hub);
  const spokeGeos = [];
  for (let i = 0; i < 6; i++) {
    const a = i * 60 * DEG + 30 * DEG;
    const b = new THREE.BoxGeometry(0.07, 1.3, 0.07);
    b.translate(0, 0.72, 0); b.rotateZ(-a);
    spokeGeos.push(b);
  }
  wheel.add(new THREE.Mesh(mergeGeometries(spokeGeos), M.bronzeDark));
  // 36 受水壶
  const scoopGeos = [];
  for (let k = 0; k < 36; k++) {
    const a = k * 10 * DEG + 5 * DEG;
    const s = Math.sin(a), c = Math.cos(a);
    const floor = new THREE.BoxGeometry(0.25, 0.035, 0.22);
    floor.translate(0, 1.42, 0); floor.rotateZ(-a);
    scoopGeos.push(floor);
    for (const side of [-1, 1]) {
      const wh = side > 0 ? 0.08 : 0.15;
      const wall = new THREE.BoxGeometry(0.03, wh, 0.22);
      wall.translate(side * 0.105, 1.49, 0); wall.rotateZ(-a);
      scoopGeos.push(wall);
    }
  }
  wheel.add(new THREE.Mesh(mergeGeometries(scoopGeos), M.bronze));
  // 关齿
  const pegGeos = [];
  for (let k = 0; k < 36; k++) {
    if (k === 3) continue;
    const a = k * 10 * DEG + 5 * DEG;
    const p = new THREE.BoxGeometry(0.05, 0.1, 0.09);
    p.translate(0, L.pegR, 0); p.rotateZ(-a);
    pegGeos.push(p);
  }
  wheel.add(new THREE.Mesh(mergeGeometries(pegGeos), M.iron));
  // G1
  const g1 = gearMesh(M.bronze, 12, 0.30, 0.11, 0.085, 0.10, 0.24);
  g1.position.z = -L.wheelC.z; wheel.add(g1);
  groups.wheel = wheel;

  // 天衡杠杆 + 计量斗 + 天权
  const lever1 = new THREE.Group();
  const bk = L.bucket, p1 = L.p1;
  const armLen = Math.hypot(bk.x - p1.x, bk.y - p1.y);
  const armAng = Math.atan2(bk.x - p1.x, -(bk.y - p1.y));
  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, armLen, 0.08), M.wood);
  arm1.position.set((bk.x - p1.x) / 2, (bk.y - p1.y) / 2, 0);
  arm1.rotation.z = armAng + Math.PI; lever1.add(arm1);
  // 斗
  const bkL = { x: bk.x - p1.x, y: bk.y - p1.y };
  const bucketFloor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.22), M.bronzeDark);
  bucketFloor.position.set(bkL.x, bkL.y, 0); lever1.add(bucketFloor);
  const bw1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.22), M.bronzeDark);
  bw1.position.set(bkL.x - 0.13, bkL.y + 0.025, 0); lever1.add(bw1);
  const bw2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.22), M.bronzeDark);
  bw2.position.set(bkL.x + 0.13, bkL.y + 0.06, 0); lever1.add(bw2);
  // 天权
  const cw = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), M.iron);
  cw.position.set(0.45, 0.1, 0); lever1.add(cw);
  const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.06), M.wood);
  arm2.position.set(0.22, 0.05, 0); lever1.add(arm2);
  const pivot1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 12), M.iron);
  pivot1.rotateX(Math.PI / 2); lever1.add(pivot1);
  groups.lever1 = lever1;

  // 中间轴 G2 + 冠齿轮
  const gear2 = new THREE.Group();
  const g2 = gearMesh(M.bronze, 24, 0.60, 0.11, 0.075, 0.10, 0.53);
  gear2.add(g2);
  const crownHub = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.06, 24), M.bronzeDark);
  crownHub.rotateX(Math.PI / 2); crownHub.position.z = L.crownZ; gear2.add(crownHub);
  const flagGeos = [];
  for (let i = 0; i < 12; i++) {
    const a = i * 30 * DEG + 15 * DEG;
    const f = new THREE.BoxGeometry(0.09, 0.064, 0.20);
    f.translate(0, L.crownR, L.crownZ); f.rotateZ(-a);
    flagGeos.push(f);
  }
  gear2.add(new THREE.Mesh(mergeGeometries(flagGeos), M.bronze));
  groups.gear2 = gear2;

  // 天柱 + 灯笼齿轮 + 浑象 + 浑仪 + G5
  const shaft = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8.4, 12), M.iron);
  pole.position.y = 4.2; shaft.add(pole);
  const lpHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16), M.bronzeDark);
  lpHub.position.set(0, 0, L.crownZ); shaft.add(lpHub);
  const rodGeos = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45 * DEG;
    const r = new THREE.CylinderGeometry(0.032, 0.032, 0.26, 8);
    r.translate(Math.sin(a) * L.lanternR, 0, L.crownZ + Math.cos(a) * L.lanternR);
    rodGeos.push(r);
  }
  shaft.add(new THREE.Mesh(mergeGeometries(rodGeos), M.bronze));
  const g5 = gearMeshH(M.bronze, 32, 0.80, 0.10, 0.07, 0.09, 0.73);
  g5.position.y = 1.35 - 2.5; shaft.add(g5);
  // 浑象
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 18),
    new THREE.MeshPhongMaterial({ map: starTexture(), shininess: 30, emissive: 0x101830, emissiveIntensity: 0.5 }));
  globe.position.y = L.globeY - 2.5; shaft.add(globe);
  const globeRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 8, 32), M.bronze);
  globeRing.position.y = L.globeY - 2.5; globeRing.rotation.x = Math.PI / 2; shaft.add(globeRing);
  // 浑仪
  const armil = new THREE.Group();
  armil.position.y = L.armilY - 2.5;
  const ringMat = M.bronze;
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.035, 10, 40), ringMat);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.03, 10, 40), ringMat);
  r2.rotation.x = Math.PI / 2;
  const r3 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.028, 10, 40), ringMat);
  r3.rotation.y = Math.PI / 2; r3.rotation.z = 23.5 * DEG;
  const r4 = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.025, 8, 36), ringMat);
  r4.rotation.x = 66.5 * DEG;
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 10), M.bronzeDark);
  tube.rotation.z = 23.5 * DEG;
  armil.add(r1, r2, r3, r4, tube);
  shaft.add(armil);
  groups.shaft = shaft;

  // 报时机轮 + 木人
  const carousel = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.09, 32), M.woodDark);
  carousel.add(disc);
  const g6 = gearMeshH(M.bronze, 8, 0.20, 0.10, 0.085, 0.09, 0.12);
  g6.position.y = 0.3; carousel.add(g6);
  const figGeos = [], robeGeos = [], malletGeos = [], tabletGeos = [];
  for (let i = 0; i < L.figures; i++) {
    const a = i * 30 * DEG;
    const s = Math.sin(a), c = Math.cos(a);
    const fx = s * 0.8, fz = c * 0.8;
    // 躯干
    const body = new THREE.CylinderGeometry(0.07, 0.09, 0.34, 8);
    body.translate(fx, 0.27, fz); robeGeos.push(body);
    const head = new THREE.SphereGeometry(0.075, 10, 8);
    head.translate(fx, 0.5, fz); figGeos.push(head);
    // 持牌手
    const tab = new THREE.BoxGeometry(0.1, 0.16, 0.02);
    tab.translate(s * 0.66, 0.4, c * 0.66); tabletGeos.push(tab);
    // 槌（向外伸出）
    const armG = new THREE.BoxGeometry(0.04, 0.04, 0.26);
    armG.translate(0, 0, 0.13); armG.rotateY(-a); armG.translate(fx, 0.47, fz);
    // 槌头在半径 1.04
    const mh = new THREE.SphereGeometry(0.06, 10, 8);
    mh.translate(s * 1.04, 0.47, c * 1.04); malletGeos.push(mh);
    figGeos.push(armG);
  }
  carousel.add(new THREE.Mesh(mergeGeometries(robeGeos), M.figureRobe));
  carousel.add(new THREE.Mesh(mergeGeometries(figGeos), M.figure));
  carousel.add(new THREE.Mesh(mergeGeometries(malletGeos), M.woodDark));
  carousel.add(new THREE.Mesh(mergeGeometries(tabletGeos), M.tablet));
  groups.carousel = carousel;

  // 钟
  const bell = new THREE.Group();
  const bellBody = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7), M.bronze);
  bellBody.scale.y = 1.2; bell.add(bellBody);
  const bellTop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.1, 8), M.bronzeDark);
  bellTop.position.y = 0.16; bell.add(bellTop);
  groups.bell = bell;
  // 鼓
  const drum = new THREE.Group();
  const drumBody = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.2, 16), M.figureRobe);
  drumBody.rotateZ(Math.PI / 2); drum.add(drumBody);
  const drumSkin = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.02, 16), M.tablet);
  drumSkin.rotateZ(Math.PI / 2); drumSkin.position.x = 0.1; drum.add(drumSkin);
  groups.drum = drum;

  return groups;
}

// ---- 主场景 ----------------------------------------------------------------
export function buildScene(renderer) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1420, 0.018);

  const M = makeMaterials();

  // 夜空背景
  const skyGeo = new THREE.SphereGeometry(120, 32, 16);
  const skyC = document.createElement('canvas');
  skyC.width = 64; skyC.height = 256;
  const sctx = skyC.getContext('2d');
  const sg = sctx.createLinearGradient(0, 0, 0, 256);
  sg.addColorStop(0, '#050a18'); sg.addColorStop(0.45, '#0c1a30');
  sg.addColorStop(0.75, '#16304a'); sg.addColorStop(1, '#2a4a5e');
  sctx.fillStyle = sg; sctx.fillRect(0, 0, 64, 256);
  const skyTex = new THREE.CanvasTexture(skyC);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false }));
  scene.add(sky);

  // 星
  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 800; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.9);
    const r = 100;
    starPos.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.5, sizeAttenuation: true, fog: false, transparent: true, opacity: 0.8 })));

  // 远山
  const mtGeos = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const h = 8 + Math.random() * 10;
    const cone = new THREE.ConeGeometry(10 + Math.random() * 8, h, 4, 1);
    cone.translate(Math.cos(a) * 70, h / 2 - 2, Math.sin(a) * 70);
    mtGeos.push(cone);
  }
  scene.add(new THREE.Mesh(mergeGeometries(mtGeos), new THREE.MeshBasicMaterial({ color: 0x0a1826, fog: false })));

  // 地面
  const ground = new THREE.Mesh(new THREE.CircleGeometry(120, 32),
    new THREE.MeshPhongMaterial({ color: 0x141e2a, shininess: 2 }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // 灯光
  scene.add(new THREE.AmbientLight(0x30405a, 0.55));
  scene.add(new THREE.HemisphereLight(0x5a7a9a, 0x2a2018, 0.9));
  const moon = new THREE.DirectionalLight(0xbcd0f0, 1.7);
  moon.position.set(-12, 18, 8);
  scene.add(moon);
  const key = new THREE.DirectionalLight(0xffe0b0, 0.7);
  key.position.set(6, 8, 10);
  scene.add(key);
  const warm = new THREE.PointLight(0xffa050, 3.5, 16, 1.4);
  warm.position.set(0.5, 4.0, 2.2);
  scene.add(warm);
  const warm2 = new THREE.PointLight(0xff9040, 2.6, 14, 1.4);
  warm2.position.set(0, 7.2, 1.8);
  scene.add(warm2);
  const warm3 = new THREE.PointLight(0xff8040, 2.0, 10, 1.4);
  warm3.position.set(1.0, 2.0, 2.0);
  scene.add(warm3);

  // 建筑 + 木阁
  scene.add(buildArchitecture(M));
  scene.add(buildPagoda(M));

  // 灯笼
  for (const [x, y, z] of [[-3.1, 5.2, 3.1], [3.1, 5.2, 3.1], [-2.8, 8.2, 2.8], [2.8, 8.2, 2.8]]) {
    const lan = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), M.lantern);
    lan.position.set(x, y, z); lan.scale.y = 1.3;
    scene.add(lan);
  }

  // 天池 / 平水壶 / 渴乌（静态容器 + 水面）
  const tanks = new THREE.Group();
  const tianchi = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 0.7), M.woodDark);
  tianchi.position.set(L.tianchi.x, L.tianchi.y, L.tianchi.z); tanks.add(tianchi);
  const tcWater = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.6), M.water);
  tcWater.position.set(L.tianchi.x, L.tianchi.y + 0.18, L.tianchi.z); tanks.add(tcWater);
  const pinghu = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.5), M.bronzeDark);
  pinghu.position.set(L.pinghu.x, L.pinghu.y, L.pinghu.z); tanks.add(pinghu);
  const phWater = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.44), M.water);
  phWater.position.set(L.pinghu.x, L.pinghu.y + 0.13, L.pinghu.z); tanks.add(phWater);
  // 渴乌（弯管）
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(L.pinghu.x, L.pinghu.y - 0.1, L.pinghu.z),
    new THREE.Vector3(L.pinghu.x + 0.1, L.pinghu.y - 0.3, L.pinghu.z),
    new THREE.Vector3(L.nozzle.x, L.nozzle.y + 0.15, L.nozzle.z),
    new THREE.Vector3(L.nozzle.x, L.nozzle.y, L.nozzle.z),
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.035, 8), M.bronze);
  tanks.add(tube);
  // 退水槽
  const drain = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.3), M.woodDark);
  drain.position.set(L.pinghu.x - 0.1, 4.95, L.pinghu.z - 0.5); tanks.add(drain);
  scene.add(tanks);

  // 钟架 / 鼓架
  const bellFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), M.wood);
  bellFrame.position.set(L.bell.x, L.bell.y + 0.4, L.bell.z); scene.add(bellFrame);
  const drumFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), M.wood);
  drumFrame.position.set(L.drum.x, L.drum.y + 0.35, L.drum.z); scene.add(drumFrame);

  // 机构视觉组
  const groups = buildMachineVisuals(M);
  for (const k of Object.keys(groups)) scene.add(groups[k]);

  // 水滴实例
  const dropGeo = new THREE.SphereGeometry(0.045, 8, 6);
  const dropMesh = new THREE.InstancedMesh(dropGeo, M.water, 200);
  dropMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dropMesh.count = 0;
  scene.add(dropMesh);

  // 撞击涟漪（视觉特效，非机构）
  const ripples = [];
  const rippleGeo = new THREE.RingGeometry(0.1, 0.14, 24);
  const rippleMat = new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true, opacity: 0.8, side: THREE.DoubleSide });

  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 300);
  camera.position.set(8, 6, 10);

  const dummy = new THREE.Object3D();
  const bodyList = ['wheel', 'lever1', 'gear2', 'shaft', 'carousel', 'bell', 'drum'];

  function sync(machine) {
    const b = machine.bodies;
    for (const k of bodyList) {
      const body = b[k], grp = groups[k];
      if (!body || !grp) continue;
      const t = body.translation(), r = body.rotation();
      grp.position.set(t.x, t.y, t.z);
      grp.quaternion.set(r.x, r.y, r.z, r.w);
    }
    // 水滴
    const drops = machine.droplets;
    const n = Math.min(drops.length, 200);
    for (let i = 0; i < n; i++) {
      const p = drops[i].body.translation();
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      dropMesh.setMatrixAt(i, dummy.matrix);
    }
    dropMesh.count = n;
    dropMesh.instanceMatrix.needsUpdate = true;
  }

  function addRipple(pos) {
    const m = new THREE.Mesh(rippleGeo, rippleMat.clone());
    m.position.set(pos.x, pos.y, pos.z);
    m.lookAt(camera.position);
    scene.add(m);
    ripples.push({ m, t: 0 });
  }
  function updateRipples(dt) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.t += dt;
      const s = 1 + r.t * 6;
      r.m.scale.setScalar(s);
      r.m.material.opacity = Math.max(0, 0.8 - r.t * 1.6);
      r.m.lookAt(camera.position);
      if (r.t > 0.6) { scene.remove(r.m); r.m.material.dispose(); ripples.splice(i, 1); }
    }
  }

  return { scene, camera, sync, addRipple, updateRipples, M };
}
