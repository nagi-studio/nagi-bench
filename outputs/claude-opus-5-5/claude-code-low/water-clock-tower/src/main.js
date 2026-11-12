import * as THREE from 'three';
import { Clockwork, GEO } from './mechanism.js';
import { Sound } from './audio.js';
import { SHOTS, CAPTIONS, CHAIN, LABELS, chainIndex, FILM_END } from './film.js';

const Y0 = 2.4;                       // wheel axle height (world)
const SHAFT = new THREE.Vector3(0, 0, -1.45);
const ST = { x: -3.3, y: 1.0, zBell: 0.75, zDrum: 0.15, zPlac: -0.6 };
const P = (x, y, z = 0) => new THREE.Vector3(x, y + Y0, z);

// ------------------------------------------------------------------ renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 200);
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// sky gradient (procedural canvas)
{
  const c = document.createElement('canvas'); c.width = 4; c.height = 256;
  const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#16233d'); gr.addColorStop(0.45, '#4a3a4a'); gr.addColorStop(0.75, '#b0704a'); gr.addColorStop(1, '#3a2418');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  scene.background = tex;
}
scene.fog = new THREE.Fog(0x3a2a24, 22, 60);

scene.add(new THREE.HemisphereLight(0xffe2c0, 0x3a2a20, 1.0));
const sun = new THREE.DirectionalLight(0xffd6a0, 2.4);
sun.position.set(9, 16, 12); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 13, bottom: -3, near: 1, far: 50 });
sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.02;
scene.add(sun);
const fill = new THREE.DirectionalLight(0x8fb0ff, 0.55); fill.position.set(-10, 6, 6); scene.add(fill);
const lamp = new THREE.PointLight(0xffb060, 6, 9, 1.6); lamp.position.set(-0.8, 5.2, 2.4); scene.add(lamp);
const lamp3 = new THREE.PointLight(0xffc880, 5, 6, 1.5); lamp3.position.set(0.3, 8.3, 0.4); scene.add(lamp3);
const lamp2 = new THREE.PointLight(0xffb060, 4, 7, 1.6); lamp2.position.set(-3.0, 2.8, 2.2); scene.add(lamp2);

// ------------------------------------------------------------------ helpers
const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...o });
const C = {
  wood: 0x9a6438, dark: 0x5b3920, red: 0x8f2c1c, bronze: 0xc0924a, iron: 0x3d3b39, stone: 0x8a8070,
  roof: 0x2e3436, gold: 0xe0b050,
};
function mesh(geo, mat, parent, pos, rot) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.copy(pos);
  if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
  m.castShadow = true; m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}
function box(w, h, d, mat, parent, x = 0, y = 0, z = 0) { return mesh(new THREE.BoxGeometry(w, h, d), mat, parent, new THREE.Vector3(x, y, z)); }
function cyl(r, len, mat, parent, axis = 'y', pos = new THREE.Vector3(), seg = 16) {
  const m = mesh(new THREE.CylinderGeometry(r, r, len, seg), mat, parent, pos);
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  return m;
}
// a bar between two points
function bar(a, b, r, mat, parent) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  const m = mesh(new THREE.CylinderGeometry(r, r, len, 10), mat, parent);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}
function beamBox(a, b, w, mat, parent) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  const m = mesh(new THREE.BoxGeometry(w, len, w), mat, parent);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}
// toothed gear in the XY plane, axis along Z, centred on z
function gearGeo(r, teeth, depth, th = 0.06) {
  const s = new THREE.Shape();
  const n = teeth * 4;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, ph = i % 4;
    const rr = (ph === 1 || ph === 2) ? r + th : r - th * 0.3;
    if (i === 0) s.moveTo(rr * Math.cos(a), rr * Math.sin(a)); else s.lineTo(rr * Math.cos(a), rr * Math.sin(a));
  }
  const hole = new THREE.Path(); hole.absarc(0, 0, r * 0.25, 0, Math.PI * 2, true); s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 4 });
  g.translate(0, 0, -depth / 2);
  return g;
}
function gear(r, teeth, depth, mat, parent, axis = 'z') {
  const g = new THREE.Group();
  const m = mesh(gearGeo(r, teeth, depth, Math.min(0.06, r * 0.12)), mat, g);
  // spokes look
  for (let i = 0; i < 4; i++) {
    const s = mesh(new THREE.BoxGeometry(r * 1.6, r * 0.12, depth * 1.2), mat, g);
    s.rotation.z = i * Math.PI / 4;
  }
  if (axis === 'x') m.parent.rotation.y = Math.PI / 2;
  if (axis === 'y') m.parent.rotation.x = Math.PI / 2;
  const holder = new THREE.Group(); holder.add(g);
  if (parent) parent.add(holder);
  return holder;
}
function textTex(txt, w = 128, h = 256, bg = '#e9d2a0', fg = '#5a1a0c', vertical = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#7a4a20'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `bold ${vertical ? w * 0.62 : h * 0.6}px "Noto Serif CJK SC", "Noto Sans CJK SC", serif`;
  if (vertical) { const chars = [...txt]; chars.forEach((ch, i) => g.fillText(ch, w / 2, h * (i + 0.5) / chars.length)); }
  else g.fillText(txt, w / 2, h / 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// highlightable materials
const glowSets = {};
function gmat(name, color, o = {}) {
  const m = M(color, o);
  (glowSets[name] ||= []).push(m);
  m.userData.baseEm = m.emissive.clone();
  return m;
}

// ------------------------------------------------------------------ physics
let cw = new Clockwork();
const DT = 1 / 600;

// ------------------------------------------------------------------ static architecture
const mats = {
  wood: M(C.wood), dark: M(C.dark), red: M(C.red, { roughness: 0.6 }), stone: M(C.stone, { roughness: 0.95 }),
  roof: M(C.roof, { roughness: 0.6 }), iron: M(C.iron, { metalness: 0.6, roughness: 0.5 }),
  bronze: M(C.bronze, { metalness: 0.8, roughness: 0.35 }), gold: M(C.gold, { metalness: 0.9, roughness: 0.3 }),
};
const waterMat = new THREE.MeshStandardMaterial({ color: 0x3f9ad8, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.82, emissive: 0x0b3050, emissiveIntensity: 0.6 });

{
  // ground and stone base
  const ground = mesh(new THREE.CircleGeometry(60, 48), M(0x3d3026, { roughness: 1 }), scene);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.36;
  box(11.5, 0.24, 6.4, mats.stone, scene, -0.7, -0.24, -0.5);
  box(10.9, 0.12, 5.9, M(0x9a9080, { roughness: 0.9 }), scene, -0.7, -0.06, -0.5);
  // tower frame (cut-away: the front is open)
  const xs = [-5.3, -2.5, 2.9], zs = [-2.9, 1.7];
  for (const x of xs) for (const z of zs) {
    if (z > 0 && x !== -5.3) continue;
    cyl(0.12, 9.3, mats.red, scene, 'y', new THREE.Vector3(x, 4.65, z));
  }
  cyl(0.12, 9.3, mats.red, scene, 'y', new THREE.Vector3(3.6, 4.65, -2.9));
  // middle floor and top platform
  for (const [y, d] of [[6.75, 0.16], [9.25, 0.2]]) {
    box(9.0, d, 4.7, mats.wood, scene, -1.2, y, -0.6);
    // eaves
    const eave = mesh(new THREE.CylinderGeometry(5.3, 6.6, 0.55, 4, 1, true), mats.roof, scene, new THREE.Vector3(-1.2, y - 0.4, -0.6));
    eave.rotation.y = Math.PI / 4; eave.scale.set(1.25, 1, 0.66);
    eave.material.side = THREE.DoubleSide;
    box(9.3, 0.14, 0.14, mats.red, scene, -1.2, y - 0.18, 1.72);
  }
  // balustrade on top platform
  for (let i = 0; i <= 18; i++) cyl(0.035, 0.5, mats.red, scene, 'y', new THREE.Vector3(-5.6 + i * 0.49, 9.6, 1.6));
  box(9.0, 0.06, 0.06, mats.red, scene, -1.2, 9.85, 1.6);
  // back wall panels (dark lattice) for contrast
  const wall = M(0x3a2618, { roughness: 0.9 });
  box(9.0, 6.6, 0.08, wall, scene, -1.2, 3.35, -3.0);
  box(9.0, 2.4, 0.08, wall, scene, -1.2, 7.95, -3.0);
  for (let i = 0; i < 10; i++) box(0.06, 6.6, 0.1, mats.dark, scene, -5.5 + i * 0.95, 3.35, -2.94);
  // hanging hangers for the escapement levers
  bar(P(GEO.forkPivot[0], GEO.forkPivot[1], 0.55), new THREE.Vector3(GEO.forkPivot[0], 6.7, 0.55), 0.012, mats.iron, scene);
  bar(P(GEO.beamPivot[0], GEO.beamPivot[1], 0.55), new THREE.Vector3(GEO.beamPivot[0], 6.7, 0.55), 0.012, mats.iron, scene);
  cyl(0.035, 0.3, mats.bronze, scene, 'z', new THREE.Vector3(GEO.forkPivot[0], GEO.forkPivot[1] + Y0, 0.45));
  cyl(0.035, 0.3, mats.bronze, scene, 'z', new THREE.Vector3(GEO.beamPivot[0], GEO.beamPivot[1] + Y0, 0.45));
  // wheel bearings
  box(0.3, Y0 + 0.1, 0.3, mats.dark, scene, 0, (Y0 - 0.1) / 2, -0.75);
  // shaft bearings
  for (const y of [0.4, 3.5, 6.75, 9.25]) box(0.36, 0.14, 0.36, mats.dark, scene, SHAFT.x, y, SHAFT.z);
}

// ------------------------------------------------------------------ tanks & pipes
const tanks = {};
{
  const t1 = GEO.tank1, t2 = GEO.tank2;
  const tankMat = M(0x6b4426, { roughness: 0.8 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x6b4426, transparent: true, opacity: 0.25, roughness: 0.5, side: THREE.DoubleSide, depthWrite: false });
  const mkTank = (t, depth, name) => {
    const g = new THREE.Group();
    const w = t.x1 - t.x0, h = t.y1 - t.y0;
    g.position.copy(P((t.x0 + t.x1) / 2, t.y0, 0));
    const mm = gmat(name, 0x6b4426);
    box(w + 0.08, 0.05, depth + 0.08, mm, g, 0, -0.025, 0);
    box(0.04, h, depth + 0.08, mm, g, -w / 2 - 0.02, h / 2, 0);
    box(0.04, h, depth + 0.08, mm, g, w / 2 + 0.02, h / 2, 0);
    box(w, h, 0.04, mm, g, 0, h / 2, -depth / 2 - 0.02);
    box(w, h, 0.03, glass, g, 0, h / 2, depth / 2 + 0.02).castShadow = false;
    for (const yy of [0.05, h - 0.05]) box(w + 0.12, 0.05, depth + 0.12, mats.dark, g, 0, yy, 0);
    const water = mesh(new THREE.BoxGeometry(w - 0.01, 1, depth - 0.01), waterMat, g);
    scene.add(g);
    return { g, water, w, depth };
  };
  tanks.t1 = mkTank(t1, 0.6, 'tank1');
  tanks.t2 = mkTank(t2, 0.5, 'tank2');
  // stands
  for (const sx of [t1.x0 + 0.05, t1.x1 - 0.05]) for (const sz of [-0.25, 0.25]) bar(P(sx, t1.y0, sz), new THREE.Vector3(sx, 6.75, sz).setY(Y0 + t1.y0 - 0.01).setY(0.0), 0.04, mats.dark, scene);
  for (const sz of [-0.2, 0.2]) bar(P(t2.x1 - 0.05, t2.y0, sz), P(t1.x0 + 0.05, t1.y0 - 0.25, sz), 0.03, mats.dark, scene);
  box(1.3, 0.06, 0.06, mats.dark, scene, (t1.x0 + t1.x1) / 2, Y0 + t1.y0 - 0.25, 0.25);
  const pipeMat = gmat('pipes', 0x7a5a3a, { metalness: 0.3 });
  // tank1 -> spout above tank2
  bar(P(t1.x0, t1.y0 + 0.05), P(1.0, 3.03), 0.03, pipeMat, scene);
  // tank2 nozzle
  bar(P(0.5, t2.y0), P(0.5, 2.33), 0.028, pipeMat, scene);
  bar(P(0.5, 2.33), P(0.36, 2.33), 0.028, pipeMat, scene);
  bar(P(0.36, 2.34), P(0.36, GEO.spout2[1] + 0.01), 0.024, pipeMat, scene);
  // overflow pipe (behind the wheel) to the sump
  const ov = [P(t2.x1, 2.66, 0), P(1.15, 2.66, 0), P(1.15, 2.66, -0.55), P(2.05, 2.66, -0.55), P(2.05, -1.6, -0.55), P(2.05, -1.6, 0), P(2.05, -1.72, 0)];
  for (let i = 0; i < ov.length - 1; i++) bar(ov[i], ov[i + 1], 0.03, pipeMat, scene);
  for (const p of ov) mesh(new THREE.SphereGeometry(0.032, 10, 8), pipeMat, scene, p);
  // sump
  const s = GEO.sump;
  const sg = new THREE.Group(); sg.position.copy(P((s.x0 + s.x1) / 2, s.y0, 0)); scene.add(sg);
  const sw = s.x1 - s.x0, sm = gmat('sump', 0x5e3e24);
  box(sw, 0.05, 0.9, sm, sg, 0, 0.0, 0);
  box(sw, 0.34, 0.05, sm, sg, 0, 0.17, 0.45); box(sw, 0.34, 0.05, sm, sg, 0, 0.17, -0.45);
  box(0.05, 0.34, 0.9, sm, sg, -sw / 2, 0.17, 0); box(0.05, 0.34, 0.9, sm, sg, sw / 2, 0.17, 0);
  tanks.sump = mesh(new THREE.BoxGeometry(sw - 0.06, 1, 0.84), waterMat, sg);
}

// ------------------------------------------------------------------ scoop wheel
const wheelG = new THREE.Group(); wheelG.position.copy(P(0, 0, 0)); scene.add(wheelG);
{
  const wm = gmat('wheel', 0x9a6438);
  for (const z of [-0.27, 0.27]) {
    mesh(new THREE.TorusGeometry(GEO.R, 0.04, 8, 72), wm, wheelG, new THREE.Vector3(0, 0, z));
    mesh(new THREE.TorusGeometry(GEO.R * 0.55, 0.03, 8, 48), wm, wheelG, new THREE.Vector3(0, 0, z));
    for (let k = 0; k < GEO.N; k++) {
      const a = GEO.station + k * Math.PI * 2 / GEO.N;
      const s = box(GEO.R, 0.06, 0.06, wm, wheelG, Math.cos(a) * GEO.R / 2, Math.sin(a) * GEO.R / 2, z);
      s.rotation.z = a;
    }
  }
  cyl(0.24, 0.7, mats.dark, wheelG, 'z');
  cyl(0.07, 1.95, mats.iron, wheelG, 'z', new THREE.Vector3(0, 0, -0.25));
  // hinge pins
  for (let k = 0; k < GEO.N; k++) {
    const a = GEO.station + k * Math.PI * 2 / GEO.N;
    cyl(0.025, 0.58, mats.iron, wheelG, 'z', new THREE.Vector3(Math.cos(a) * GEO.R, Math.sin(a) * GEO.R, 0));
  }
  // front peg ring with the pegs the stop-tooth catches
  const pm = gmat('pegs', 0xd8b070, { metalness: 0.5 });
  mesh(new THREE.TorusGeometry(GEO.pegR, 0.035, 8, 64), wm, wheelG, new THREE.Vector3(0, 0, 0.32));
  for (const [x, y, r] of cw.pegs) {
    cyl(r, 0.26, pm, wheelG, 'z', new THREE.Vector3(x, y, 0.41));
    box(0.05, 0.05, 0.6, wm, wheelG, x, y, 0.05);
  }
  // axle drive gear
  const ag = gear(0.42, 16, 0.1, gmat('drive', C.bronze, { metalness: 0.7, roughness: 0.4 }), wheelG);
  ag.position.z = -0.95;
}
const bucketMeshes = cw.buckets.map(() => {
  const g = new THREE.Group();
  const bm = gmat('bucket', 0xb07a45);
  const w = GEO.bucketW, h = GEO.bucketH, d = 0.42, t = 0.025;
  box(w, t, d, bm, g, 0, -h / 2 + t / 2, 0);
  box(t, h, d, bm, g, -w / 2, 0, 0); box(t, h, d, bm, g, w / 2, 0, 0);
  box(w, h, t, bm, g, 0, 0, -d / 2); box(w, h, t, bm, g, 0, 0, d / 2);
  box(w + 0.04, 0.03, d + 0.04, mats.dark, g, 0, h / 2, 0);
  const water = mesh(new THREE.BoxGeometry(w - 0.04, 1, d - 0.04), waterMat, g);
  water.castShadow = false;
  scene.add(g);
  return { g, water };
});

// ------------------------------------------------------------------ fork, beam, rod
const forkG = new THREE.Group(); scene.add(forkG);
{
  const fm = gmat('fork', 0xc08848);
  box(1.1, 0.07, 0.07, fm, forkG, 0, 0, 0.42);
  box(0.13, 0.13, 0.12, gmat('fork', C.bronze, { metalness: 0.7, roughness: 0.4 }), forkG, 0.15, -0.09, 0.42);
  const [rx, ry, rr] = cw.forkRoller;
  cyl(rr, 0.75, fm, forkG, 'z', new THREE.Vector3(rx, ry, 0.08));
  box(0.07, 0.12, 0.07, fm, forkG, rx, ry, 0.42);
  // forked prongs
  box(0.05, 0.05, 0.55, fm, forkG, rx + 0.05, ry - 0.02, 0.15);
}
const beamG = new THREE.Group(); scene.add(beamG);
{
  const bmm = gmat('beam', 0xc08848);
  const tl = cw.toothLocal;
  box(1.95, 0.09, 0.09, bmm, beamG, -0.83, 0.78, 0.42);
  bar(new THREE.Vector3(0, 0, 0.42), new THREE.Vector3(0.0, 0.78, 0.42), 0.04, bmm, beamG);
  box(0.16, 0.16, 0.14, gmat('beam', C.bronze, { metalness: 0.7, roughness: 0.4 }), beamG, -0.65, 0.68, 0.42);
  // stop tooth (天关)
  const tm = gmat('tooth', 0xe0a050);
  box(0.03, tl[1] - tl[3], 0.1, tm, beamG, tl[0], (tl[1] + tl[3]) / 2, 0.42);
  box(0.09, 0.06, 0.12, tm, beamG, tl[0], tl[3] + 0.03, 0.42);
}
const rodMesh = mesh(new THREE.CylinderGeometry(0.022, 0.022, 1, 8), gmat('rod', 0xe8c070, { metalness: 0.5 }), scene);

// ------------------------------------------------------------------ drive train
const shaftG = new THREE.Group(); shaftG.position.set(SHAFT.x, 0, SHAFT.z); scene.add(shaftG);
{
  const sm = gmat('shaft', 0xb0743c);
  cyl(0.085, 10.2, sm, shaftG, 'y', new THREE.Vector3(0, 5.25, 0), 12);
  for (let i = 0; i < 9; i++) box(0.2, 0.04, 0.2, mats.dark, shaftG, 0, 1 + i * 1.0, 0);
  const crown = gear(0.42, 16, 0.1, gmat('drive', C.bronze, { metalness: 0.7, roughness: 0.4 }), shaftG, 'y');
  crown.position.y = Y0 + 0.5;
  const low = gear(0.3, 12, 0.08, gmat('drive', C.bronze, { metalness: 0.7, roughness: 0.4 }), shaftG, 'y');
  low.position.y = 1.3;
  const up = gear(0.38, 14, 0.08, gmat('astro', C.bronze, { metalness: 0.7, roughness: 0.4 }), shaftG, 'y');
  up.position.y = 7.05;
  const top = gear(0.32, 12, 0.08, gmat('astro', C.bronze, { metalness: 0.7, roughness: 0.4 }), shaftG, 'y');
  top.position.y = 9.55;
}
const layG = new THREE.Group(); layG.position.set(-1.65, 1.0, SHAFT.z); scene.add(layG);
{
  const lm = gmat('drive', 0xb0743c);
  cyl(0.06, 3.0, lm, layG, 'x');
  const g1 = gear(0.3, 12, 0.08, gmat('drive', C.bronze, { metalness: 0.7, roughness: 0.4 }), layG, 'x'); g1.position.x = 1.35;
  const g2 = gear(0.3, 12, 0.08, gmat('drive', C.bronze, { metalness: 0.7, roughness: 0.4 }), layG, 'x'); g2.position.x = -1.35;
  box(0.2, 1.0, 0.2, mats.dark, scene, -2.4, 0.5, SHAFT.z);
}
const camG = new THREE.Group(); camG.position.set(ST.x, ST.y, 0); scene.add(camG);
const strikerG = {};
{
  const am = gmat('drive', 0xb0743c);
  cyl(0.06, 2.3, am, camG, 'z', new THREE.Vector3(0, 0, -0.2));
  const g = gear(0.3, 12, 0.08, gmat('drive', C.bronze, { metalness: 0.7, roughness: 0.4 }), camG); g.position.z = -1.2;
  // cams with trip pegs (拨牙)
  const camDisk = (pegs, z) => {
    const cm = gmat('cams', 0xa86a38);
    mesh(new THREE.CylinderGeometry(GEO.strikeCamR - 0.05, GEO.strikeCamR - 0.05, 0.06, 32), cm, camG, new THREE.Vector3(0, 0, z), [Math.PI / 2, 0, 0]);
    for (const [x, y, r] of pegs) cyl(r * 0.8, 0.1, gmat('cams', 0xf0c070, { metalness: 0.5 }), camG, 'z', new THREE.Vector3(x, y, z + 0.03));
  };
  camDisk(cw.bellPegs, ST.zBell); camDisk(cw.drumPegs, ST.zDrum);
  // placard wheel (时辰牌)
  const names = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 36), gmat('placard', 0x7a4a26), camG, new THREE.Vector3(0, 0, ST.zPlac), [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 12; i++) {
    // tablets arranged so successive ones come to the top as the wheel turns clockwise
    const a = Math.PI / 2 + i * Math.PI / 6;
    const tab = new THREE.Group(); tab.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, ST.zPlac + 0.04); tab.rotation.z = a - Math.PI / 2;
    const tex = textTex(names[i] + '时', 96, 192);
    mesh(new THREE.BoxGeometry(0.16, 0.3, 0.03), [mats.dark, mats.dark, mats.dark, mats.dark, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mats.dark], tab, new THREE.Vector3(0, 0.08, 0));
    camG.add(tab);
  }
  // levers with the wooden figures, bell and drum
  const mk = (name, z) => {
    const lg = new THREE.Group(); scene.add(lg);
    const lm = gmat(name, 0xc8925a);
    const s = cw.strikers[name];
    box(s.tail[2] + 0.05, 0.05, 0.06, lm, lg, s.tail[2] / 2, 0, 0);
    bar(new THREE.Vector3(0, 0, 0), new THREE.Vector3(s.hammer[0], s.hammer[1], 0), 0.03, lm, lg);
    const head = cyl(s.hammer[2], 0.2, gmat(name, 0x7a3a1a), lg, 'z', new THREE.Vector3(s.hammer[0], s.hammer[1], 0));
    cyl(0.04, 0.16, mats.iron, lg, 'z');
    strikerG[name] = { lg, z, lever: s.lever };
    // wooden figure standing behind the lever
    const fig = new THREE.Group(); fig.position.set(ST.x - 0.82, ST.y - 1.0, z - 0.16); scene.add(fig);
    const robe = gmat(name, name === 'bell' ? 0x2f6a5a : 0x7a2a2a);
    mesh(new THREE.ConeGeometry(0.2, 0.95, 16), robe, fig, new THREE.Vector3(0, 0.48, 0));
    mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.4, 12), robe, fig, new THREE.Vector3(0, 1.0, 0));
    mesh(new THREE.SphereGeometry(0.11, 16, 12), M(0xe2c29a), fig, new THREE.Vector3(0, 1.3, 0));
    mesh(new THREE.CylinderGeometry(0.06, 0.14, 0.1, 12), M(0x1a1a1a), fig, new THREE.Vector3(0, 1.43, 0));
    // shoulder to pivot (static arm stub)
    bar(new THREE.Vector3(0.05, 1.12, 0), new THREE.Vector3(0.2, 1.24, 0.12), 0.035, robe, fig);
    // target
    const tx = ST.x + s.target[0], ty = ST.y + (s.target[1] + s.target[3]) / 2;
    if (name === 'bell') {
      const pts = [];
      for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new THREE.Vector2(0.09 + 0.11 * Math.pow(t, 1.6), 0.22 - t * 0.44)); }
      pts.push(new THREE.Vector2(0.17, -0.22));
      const bell = mesh(new THREE.LatheGeometry(pts, 32), gmat('bellBody', C.bronze, { metalness: 0.85, roughness: 0.3, side: THREE.DoubleSide }), scene, new THREE.Vector3(tx + 0.2, ty, z));
      strikerG.bellMesh = bell;
      bar(new THREE.Vector3(tx + 0.2, ty + 0.22, z), new THREE.Vector3(tx + 0.2, ty + 0.5, z), 0.02, mats.iron, scene);
      box(0.06, 0.06, 0.6, mats.dark, scene, tx + 0.2, ty + 0.5, z);
    } else {
      const dm = gmat('drumBody', 0x8f2c1c);
      const drum = cyl(0.24, 0.2, dm, scene, 'x', new THREE.Vector3(tx + 0.1, ty, z), 28);
      cyl(0.235, 0.205, M(0xe8d8b0), scene, 'x', new THREE.Vector3(tx + 0.1, ty, z), 28);
      strikerG.drumMesh = drum;
      bar(new THREE.Vector3(tx + 0.1, ty - 0.24, z), new THREE.Vector3(tx + 0.1, -0.0, z), 0.03, mats.dark, scene);
    }
  };
  mk('bell', ST.zBell); mk('drum', ST.zDrum);
  // pagoda (木阁) facade: small stacked eaves over the striking room
  const pm = mats.red;
  for (const x of [-4.75, -2.45]) for (const z of [-1.1, 1.15]) cyl(0.07, 4.2, pm, scene, 'y', new THREE.Vector3(x, 2.1, z));
  for (let i = 0; i < 3; i++) {
    const y = 2.75 + i * 0.75;
    const e = mesh(new THREE.CylinderGeometry(1.25 - i * 0.12, 1.75 - i * 0.12, 0.3, 4, 1, true), mats.roof, scene, new THREE.Vector3(-3.6, y, 0.02));
    e.rotation.y = Math.PI / 4; e.scale.set(1.0, 1, 1.0); e.material.side = THREE.DoubleSide;
    box(2.3, 0.08, 2.3, mats.wood, scene, -3.6, y - 0.18, 0.02);
  }
}

// ------------------------------------------------------------------ astronomy: celestial globe and armillary sphere
const LAT = 35 * Math.PI / 180;
const globeG = new THREE.Group(); globeG.position.set(-1.05, 7.95, SHAFT.z); scene.add(globeG);
const globeSpin = new THREE.Group(); globeG.add(globeSpin); globeG.rotation.z = -(Math.PI / 2 - LAT) * 0.6;
{
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#122244'; g.fillRect(0, 0, 1024, 512);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 520; i++) {
    const x = rnd() * 1024, y = 40 + rnd() * 432, r = rnd() < 0.1 ? 3.4 : 1.6 + rnd();
    g.fillStyle = rnd() < 0.3 ? '#ffd27a' : '#f4f0e0'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  g.strokeStyle = 'rgba(255,215,140,.55)'; g.lineWidth = 2;
  for (let i = 0; i < 28; i++) { g.beginPath(); g.moveTo(i * 1024 / 28, 20); g.lineTo(i * 1024 / 28, 492); g.stroke(); }
  g.strokeStyle = 'rgba(255,120,80,.8)'; g.lineWidth = 3; g.beginPath();
  for (let x = 0; x <= 1024; x += 8) { const y = 256 + Math.sin(x / 1024 * Math.PI * 2) * 95; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  g.strokeStyle = 'rgba(160,220,255,.7)'; g.beginPath(); g.moveTo(0, 256); g.lineTo(1024, 256); g.stroke();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  mesh(new THREE.SphereGeometry(0.72, 48, 32), gmat('globe', 0xffffff, { map: tex, roughness: 0.55, emissiveMap: tex, emissive: 0x9a9a9a }), globeSpin);
  cyl(0.025, 1.8, mats.iron, globeG, 'y');
  const ring = mesh(new THREE.TorusGeometry(0.82, 0.03, 8, 64), mats.bronze, globeG); ring.rotation.y = Math.PI / 2;
  // housing box / horizon
  const hz = mesh(new THREE.TorusGeometry(0.85, 0.05, 8, 64), M(0x6b4426), scene, new THREE.Vector3(-1.05, 7.95, SHAFT.z)); hz.rotation.x = Math.PI / 2;
  box(1.9, 0.1, 1.9, M(0x6b4426), scene, -1.05, 7.12, SHAFT.z);
  for (const [dx, dz] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) cyl(0.04, 0.85, mats.dark, scene, 'y', new THREE.Vector3(-1.05 + dx, 7.55, SHAFT.z + dz));
  const gg = gear(0.6, 20, 0.07, gmat('astro', C.bronze, { metalness: 0.7, roughness: 0.4 }), scene, 'y');
  gg.position.set(-1.05 + 0.06, 7.05, SHAFT.z); globeG.userData.gear = gg;
}
const armG = new THREE.Group(); armG.position.set(0, 10.45, SHAFT.z); scene.add(armG);
const armSpin = new THREE.Group();
{
  const bm = gmat('armillary', C.bronze, { metalness: 0.85, roughness: 0.3 });
  const fixedM = mats.bronze;
  // fixed: horizon ring and meridian ring, dragon pillars
  const hz = mesh(new THREE.TorusGeometry(0.95, 0.04, 8, 72), fixedM, armG); hz.rotation.x = Math.PI / 2;
  const mer = mesh(new THREE.TorusGeometry(0.92, 0.035, 8, 72), fixedM, armG);
  for (const [dx, dz] of [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]]) bar(new THREE.Vector3(dx, -1.05, dz), new THREE.Vector3(dx * 0.95, 0, dz * 0.4), 0.05, mats.red, armG);
  box(2.3, 0.12, 1.5, mats.dark, armG, 0, -1.08, 0);
  // polar axis tilted by latitude
  const polar = new THREE.Group(); polar.rotation.x = -(Math.PI / 2 - LAT); armG.add(polar);
  polar.add(armSpin);
  cyl(0.02, 1.9, mats.iron, polar, 'y');
  const eq = mesh(new THREE.TorusGeometry(0.8, 0.035, 8, 72), bm, armSpin); eq.rotation.x = Math.PI / 2;
  mesh(new THREE.TorusGeometry(0.78, 0.03, 8, 72), bm, armSpin);
  const r3 = mesh(new THREE.TorusGeometry(0.76, 0.028, 8, 72), bm, armSpin); r3.rotation.y = Math.PI / 2;
  const ecl = mesh(new THREE.TorusGeometry(0.7, 0.03, 8, 72), gmat('armillary', 0xe0a050, { metalness: 0.8 }), armSpin); ecl.rotation.x = Math.PI / 2 - 0.41;
  // sighting tube
  const tube = cyl(0.04, 1.4, bm, armSpin, 'y'); tube.rotation.z = 0.7;
  // roof canopy over the platform (cut away at the front)
  const roofM = mats.roof;
  for (const [x, z] of [[-1.6, -1.2], [1.6, -1.2]]) cyl(0.07, 2.3, mats.red, scene, 'y', new THREE.Vector3(x, 10.45, SHAFT.z + z));
  const r = mesh(new THREE.ConeGeometry(2.6, 1.0, 4, 1, true), roofM, scene, new THREE.Vector3(0, 12.0, SHAFT.z - 0.6)); r.rotation.y = Math.PI / 4; r.scale.set(1.1, 1, 0.75); r.material.side = THREE.DoubleSide;
}

// ------------------------------------------------------------------ water droplets
const MAXP = 1400;
const dropMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 8, 6), new THREE.MeshStandardMaterial({ color: 0x7cc8ff, roughness: 0.1, emissive: 0x1a5a90, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 }), MAXP);
dropMesh.frustumCulled = false; scene.add(dropMesh);
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3();

// ------------------------------------------------------------------ sync visuals from physics
function syncVisuals() {
  wheelG.rotation.z = cw.wheel.a;
  cw.buckets.forEach((b, i) => {
    const m = bucketMeshes[i];
    m.g.position.set(b.x, b.y + Y0, 0); m.g.rotation.z = b.a;
    const f = Math.min(1, b.water / 1.9);
    m.water.visible = f > 0.01;
    const h = Math.max(0.001, f * (GEO.bucketH - 0.04));
    m.water.scale.y = h; m.water.position.y = -GEO.bucketH / 2 + 0.025 + h / 2;
  });
  forkG.position.copy(P(cw.fork.x, cw.fork.y)); forkG.rotation.z = cw.fork.a;
  beamG.position.copy(P(cw.beam.x, cw.beam.y)); beamG.rotation.z = cw.beam.a;
  const [ra, rb] = cw.rod.ends();
  const a = P(ra[0], ra[1], 0.42), b = P(rb[0], rb[1], 0.42), d = b.clone().sub(a);
  rodMesh.position.copy(a).addScaledVector(d, 0.5); rodMesh.scale.set(1, d.length(), 1);
  rodMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  shaftG.rotation.y = -cw.shaft.a;
  layG.rotation.x = cw.lay.a;
  camG.rotation.z = cw.camAxle.a;
  for (const name of ['bell', 'drum']) {
    const s = strikerG[name], L = s.lever;
    s.lg.position.set(ST.x + L.x, ST.y + L.y, s.z); s.lg.rotation.z = L.a;
  }
  globeSpin.rotation.y = -cw.globe.a * 1.0;
  globeG.userData.gear.rotation.y = cw.globe.a * 0.63;
  armSpin.rotation.y = -cw.armillary.a;
  // tanks
  const t1 = tanks.t1, t1h = Math.max(0.01, Math.min(0.8, cw.h1 * 1.0 + 0.0));
  t1.water.scale.y = t1h; t1.water.position.y = t1h / 2 + 0.01;
  const t2h = Math.max(0.01, cw.h2 + 0.03);
  tanks.t2.water.scale.y = t2h; tanks.t2.water.position.y = t2h / 2 + 0.01;
  const sh = 0.06 + Math.min(0.2, cw.sumpWater * 0.004);
  tanks.sump.scale.y = sh; tanks.sump.position.y = sh / 2 + 0.03;
  // drops
  const ps = cw.particles, n = Math.min(ps.length, MAXP);
  for (let i = 0; i < n; i++) {
    const p = ps[i];
    const sp = Math.min(3, Math.hypot(p.vx, p.vy));
    tmpP.set(p.x, p.y + Y0, p.z);
    tmpQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(p.vy, p.vx) + Math.PI / 2);
    tmpS.set(1, 1 + sp * 0.9, 1);
    tmpM.compose(tmpP, tmpQ, tmpS);
    dropMesh.setMatrixAt(i, tmpM);
  }
  dropMesh.count = n;
  dropMesh.instanceMatrix.needsUpdate = true;
}

// ------------------------------------------------------------------ film direction
const capEl = document.getElementById('capText');
const chainEl = document.getElementById('chain');
const titleEl = document.getElementById('title');
const labelsEl = document.getElementById('labels');
CHAIN.forEach((t, i) => {
  if (i) { const s = document.createElement('span'); s.className = 'sep'; s.textContent = '→'; chainEl.appendChild(s); }
  const n = document.createElement('span'); n.className = 'node'; n.textContent = t; chainEl.appendChild(n);
});
const chainNodes = [...chainEl.querySelectorAll('.node')];
let curCap = null;

// anchors used by labels
const stationBucket = () => {
  let best = null, bd = 1e9;
  for (const b of cw.buckets) { const a = Math.atan2(b.y, b.x), d = Math.abs(a - GEO.station - 0.12); if (d < bd) { bd = d; best = b; } }
  return best;
};
const anchors = {
  tank1: () => P((GEO.tank1.x0 + GEO.tank1.x1) / 2, GEO.tank1.y1, 0),
  tank2: () => P(GEO.tank2.x0 + 0.1, GEO.tank2.y1, 0),
  overflow: () => P(1.15, 2.66, -0.3),
  stream: () => P(GEO.spout2[0], 1.98, 0),
  bucket: () => { const b = stationBucket(); return P(b.x - 0.05, b.y + 0.1, 0.0); },
  fork: () => { const p = cw.fork.wp(cw.forkRoller[0], cw.forkRoller[1]); return P(p[0], p[1] - 0.04, 0.3); },
  forkBody: () => { const p = cw.fork.wp(0.25, 0); return P(p[0], p[1], 0.42); },
  rod: () => { const [a, b] = cw.rod.ends(); return P((a[0] + b[0]) / 2 + 0.02, (a[1] + b[1]) / 2, 0.42); },
  beam: () => { const p = cw.beam.wp(-1.0, 0.78); return P(p[0], p[1] + 0.05, 0.42); },
  tooth: () => { const t = cw.toothLocal; const p = cw.beam.wp(t[0], t[1] - 0.1); return P(p[0], p[1], 0.45); },
  wheel: () => P(-1.1, -0.9, 0.3),
  axleGear: () => P(0.3, 0.35, -0.95),
  shaft: () => new THREE.Vector3(SHAFT.x + 0.08, 5.0, SHAFT.z),
  crown: () => new THREE.Vector3(SHAFT.x + 0.4, Y0 + 0.5, SHAFT.z),
  lay: () => new THREE.Vector3(-1.6, 1.08, SHAFT.z),
  cam: () => new THREE.Vector3(ST.x + 0.2, ST.y + 0.35, ST.zBell + 0.08),
  bellFig: () => new THREE.Vector3(ST.x - 0.8, ST.y + 0.45, ST.zBell),
  bell: () => new THREE.Vector3(ST.x - 0.35, ST.y + 1.2, ST.zBell),
  drum: () => new THREE.Vector3(ST.x - 0.45, ST.y + 1.24, ST.zDrum),
  placard: () => new THREE.Vector3(ST.x, ST.y + 0.95, ST.zPlac),
  globe: () => new THREE.Vector3(-1.05, 8.7, SHAFT.z),
  armillary: () => new THREE.Vector3(0, 11.25, SHAFT.z),
  pagoda: () => new THREE.Vector3(-3.6, 4.4, 0),
};
const labelEls = LABELS.map((L) => {
  const el = document.createElement('div'); el.className = 'lbl' + (L.water ? ' water' : '');
  el.innerHTML = `<span class="tx"></span><div class="ln"></div><div class="dt"></div>`;
  el.style.opacity = 0; labelsEl.appendChild(el);
  return { L, el, tx: el.querySelector('.tx'), last: '' };
});
const v3 = new THREE.Vector3();
function updateLabels(t) {
  const W = window.innerWidth, H = window.innerHeight;
  for (const o of labelEls) {
    const L = o.L;
    const on = t >= L.t0 && t < L.t1;
    if (!on) { o.el.style.opacity = 0; continue; }
    v3.copy(anchors[L.a]()).project(camera);
    if (v3.z > 1) { o.el.style.opacity = 0; continue; }
    const x = (v3.x * 0.5 + 0.5) * W, y = (-v3.y * 0.5 + 0.5) * H;
    o.el.style.left = x + 'px'; o.el.style.top = (y + 4) + 'px';
    o.el.querySelector('.ln').style.height = (L.h ?? 26) + 'px';
    let txt = L.text;
    if (L.dyn === 'fill') { const b = stationBucket(); txt += `<small>水量 ${Math.min(100, Math.round(b.water / 1.5 * 100))}%</small>`; }
    if (txt !== o.last) { o.tx.innerHTML = txt; o.last = txt; }
    const fade = Math.min(1, (t - L.t0) / 0.4, (L.t1 - t) / 0.4);
    o.el.style.opacity = fade;
  }
}
function setGlow(names, t) {
  const pulse = 0.35 + 0.25 * Math.sin(t * 6);
  for (const [name, list] of Object.entries(glowSets)) {
    const on = names.includes(name);
    for (const m of list) {
      if (on) { m.emissive.setRGB(0.42, 0.24, 0.06); m.emissiveIntensity = pulse * 0.8; }
      else { m.emissive.copy(m.userData.baseEm); m.emissiveIntensity = 1; }
    }
  }
}
const ease = (x) => x * x * (3 - 2 * x);
const cpos = new THREE.Vector3(), ctgt = new THREE.Vector3();
function cameraAt(t) {
  const K = SHOTS;
  if (t <= K[0].t) { cpos.fromArray(K[0].p); ctgt.fromArray(K[0].l); }
  else if (t >= K[K.length - 1].t) { cpos.fromArray(K[K.length - 1].p); ctgt.fromArray(K[K.length - 1].l); }
  else {
    let i = 0; while (K[i + 1].t < t) i++;
    const a = K[i], b = K[i + 1], u = b.cut ? 0 : ease((t - a.t) / (b.t - a.t));
    cpos.fromArray(a.p).lerp(tmpP.fromArray(b.p), u);
    ctgt.fromArray(a.l).lerp(tmpP.fromArray(b.l), u);
  }
  camera.position.copy(cpos);
  camera.position.y += Math.sin(t * 0.5) * 0.04;
  camera.lookAt(ctgt);
}
function direct(t) {
  cameraAt(t);
  titleEl.classList.toggle('hidden', !(t > 0.3 && t < 4.0));
  const cap = CAPTIONS.find((c) => t >= c.t0 && t < c.t1);
  const html = cap ? cap.html : '';
  if (html !== curCap) { capEl.innerHTML = html; curCap = html; }
  const ci = chainIndex(t);
  chainEl.style.opacity = t > 3.8 ? 1 : 0;
  chainNodes.forEach((n, i) => { n.classList.toggle('on', i === ci || ci === 99); n.classList.toggle('done', i < ci); });
  const shot = CAPTIONS.find((c) => t >= c.t0 && t < c.t1);
  setGlow(shot?.glow || [], t);
  updateLabels(t);
  document.getElementById('end').classList.toggle('hidden', t < FILM_END);
}

// ------------------------------------------------------------------ audio events
const sound = new Sound();
let lastSplash = 0, dripBudget = 0;
function handleEvents(dtFrame) {
  for (const e of cw.world.events) {
    if (e.tag === 'tooth' && e.impulse > 1) sound.clack(e.impulse / 12);
    else if (e.tag === 'fork' && e.impulse > 0.3) sound.thunk(e.impulse / 2);
    else if (e.tag === 'bell') sound.bell(e.impulse / 0.25);
    else if (e.tag === 'drum') sound.drum(e.impulse / 0.25);
  }
  cw.world.events.length = 0;
  dripBudget = Math.min(3, dripBudget + dtFrame * 9);
  const ns = cw.splashes - lastSplash; lastSplash = cw.splashes;
  if (ns > 0 && dripBudget >= 1) { dripBudget -= 1; sound.drip(0.8); }
  const d = camera.position.distanceTo(P(0.4, 1.5, 0));
  sound.update(Math.min(1.3, cw.flow2 / 0.6), Math.abs(cw.wheel.w), Math.max(0, Math.min(1, 1 - (d - 3) / 10)));
}

// ------------------------------------------------------------------ main loop
const params = new URLSearchParams(location.search);
let started = false, startWall = 0, offset = Number(params.get('t') || 0);
function stepTo(target, cap = 1200) {
  let n = 0;
  while (cw.world.time + DT * 0.5 < target && n < cap) { cw.step(DT); n++; }
}
function start() {
  if (started) return;
  started = true;
  document.getElementById('start').classList.add('hidden');
  try { sound.start(); sound.music(36 - offset); } catch (e) { console.warn(e); }
  startWall = performance.now();
}
function restart() {
  cw = new Clockwork();
  rebuildRefs();
  lastSplash = 0;
  startWall = performance.now(); offset = 0;
  if (sound.ok) sound.music(36);
}
function rebuildRefs() { /* meshes read from cw each frame; nothing cached */ }
document.getElementById('play').addEventListener('click', start);
document.getElementById('replay').addEventListener('click', restart);
if ((navigator.webdriver || params.has('auto')) && !params.has('freeze')) start();
if (params.has('freeze')) document.getElementById('start').classList.add('hidden');
if (offset > 0) { stepTo(offset, 1e9); cw.world.events.length = 0; }

let prev = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dtF = Math.min(0.1, (now - prev) / 1000); prev = now;
  let t = offset;
  if (started) {
    // film clock follows the wall clock, but never jumps more than 0.25 s per frame
    t = offset + (now - startWall) / 1000;
    if (t > cw.world.time + 0.25) { startWall += (t - cw.world.time - 0.25) * 1000; t = cw.world.time + 0.25; }
    stepTo(t);
    t = cw.world.time;
    handleEvents(dtF);
  }
  syncVisuals();
  direct(t);
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
window.__film = { get t() { return cw.world.time; }, cw };
