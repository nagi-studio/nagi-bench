import * as THREE from 'three';

// 潮汐之后 / Tidal After — a 180s procedural voxel short.
// Everything below is authored geometry, lighting, animation and Web Audio.

const FILM_LENGTH = 180;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const fract = (v) => v - Math.floor(v);
const seeded = (n) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453123);
const v3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

const COLORS = {
  void: 0x020408,
  steel: 0x263646,
  steelDark: 0x101a24,
  steelLight: 0x55758b,
  rust: 0x7d4737,
  amber: 0xffa23a,
  warm: 0xffd18a,
  cyan: 0x73d9ff,
  blue: 0x3f72a1,
  white: 0xe9f4ff,
  red: 0xf14f52,
  moss: 0x4a6d58,
  earth: 0x2f3f38,
};

const ui = {
  stage: document.querySelector('#stage'),
  title: document.querySelector('#film-title'),
  chapter: document.querySelector('#chapter'),
  time: document.querySelector('#timecode'),
  subtitle: document.querySelector('#subtitle'),
  progress: document.querySelector('#progress'),
  play: document.querySelector('#play'),
  sound: document.querySelector('#sound'),
  fade: document.querySelector('#fade'),
};

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
ui.stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.void);
scene.fog = new THREE.FogExp2(0x071019, 0.022);

const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 240);
camera.position.set(0, 5, 19);

const hemi = new THREE.HemisphereLight(0x6d8aa3, 0x090d12, 1.4);
scene.add(hemi);
const keyLight = new THREE.DirectionalLight(0xd9edff, 2.0);
keyLight.position.set(-10, 16, 12);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.left = -30;
keyLight.shadow.camera.right = 30;
keyLight.shadow.camera.top = 30;
keyLight.shadow.camera.bottom = -30;
scene.add(keyLight);
const cyanLight = new THREE.PointLight(COLORS.cyan, 0, 20, 2);
scene.add(cyanLight);
const amberLight = new THREE.PointLight(COLORS.amber, 0, 24, 2);
scene.add(amberLight);
const redLight = new THREE.PointLight(COLORS.red, 0, 16, 2);
scene.add(redLight);

const matCache = new Map();
function mat(color, roughness = 0.82, emissive = 0x000000, emissiveIntensity = 0) {
  const key = `${color}|${roughness}|${emissive}|${emissiveIntensity}`;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness: roughness < 0.45 ? 0.72 : 0.18, emissive, emissiveIntensity }));
  return matCache.get(key);
}
function box(w, h, d, material, x = 0, y = 0, z = 0, parent = scene) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function cyl(r, h, material, x = 0, y = 0, z = 0, parent = scene, segments = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function line(points, color, opacity = 1, parent = scene) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const m = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
  const l = new THREE.Line(geo, m);
  parent.add(l);
  return l;
}

function addLabel(text, color = COLORS.white, size = 0.23, x = 0, y = 0, z = 0, parent = scene) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 44px monospace';
  ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size * 4, size), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

// ---- authored voxel actors -------------------------------------------------
function makePerson({ suit = false, coat = false, skin = 0xc88b69, accent = COLORS.blue } = {}) {
  const root = new THREE.Group();
  root.userData.baseY = 0;
  const bodyMat = mat(suit ? 0xced9dc : coat ? 0x31485a : 0x54718b);
  const darkMat = mat(suit ? 0x596d75 : 0x172431);
  const skinMat = mat(skin);
  const accentMat = mat(accent, 0.5, accent, 0.18);
  box(0.82, 1.0, 0.48, bodyMat, 0, 1.56, 0, root);
  box(0.34, 0.86, 0.38, bodyMat, -0.58, 1.6, 0, root);
  box(0.34, 0.86, 0.38, bodyMat, 0.58, 1.6, 0, root);
  box(0.3, 0.9, 0.4, darkMat, -0.22, 0.62, 0, root);
  box(0.3, 0.9, 0.4, darkMat, 0.22, 0.62, 0, root);
  box(0.7, 0.66, 0.64, skinMat, 0, 2.58, 0, root);
  if (suit) {
    box(0.54, 0.22, 0.04, accentMat, 0, 2.62, -0.34, root);
    box(0.11, 0.34, 0.06, accentMat, 0.22, 1.84, -0.27, root);
    box(0.11, 0.34, 0.06, accentMat, -0.22, 1.84, -0.27, root);
    box(0.35, 0.35, 0.14, darkMat, 0, 1.62, -0.3, root);
    cyl(0.08, 0.42, darkMat, 0, 3.05, 0, root, 6).rotation.z = Math.PI / 2;
  } else {
    box(0.74, 0.16, 0.68, darkMat, 0, 2.93, 0, root);
    box(0.22, 0.06, 0.04, accentMat, 0.22, 2.63, -0.33, root);
  }
  root.traverse((o) => { if (o.isMesh) o.userData.actorPart = true; });
  return root;
}

function makeDrone(color = COLORS.cyan) {
  const root = new THREE.Group();
  const dark = mat(0x102330, 0.36);
  const glow = mat(color, 0.28, color, 3.2);
  box(1.2, 0.26, 0.72, dark, 0, 0, 0, root);
  box(0.52, 0.18, 0.52, glow, 0, 0.18, 0, root);
  for (const s of [-1, 1]) {
    box(0.52, 0.08, 0.12, dark, s * 0.82, 0, 0, root);
    box(0.1, 0.08, 0.34, glow, s * 0.98, 0, 0, root);
  }
  const trail = box(0.12, 0.02, 1.1, mat(color, 0.5, color, 1.5), 0, -0.16, 0.42, root);
  trail.rotation.x = Math.PI / 2;
  return root;
}

// ---- sets ------------------------------------------------------------------
const world = new THREE.Group();
scene.add(world);
const sets = { bunker: new THREE.Group(), shaft: new THREE.Group(), orbit: new THREE.Group(), surface: new THREE.Group() };
Object.values(sets).forEach((g) => { g.visible = false; world.add(g); });

function makeBunker() {
  const g = sets.bunker;
  const floor = mat(0x17232b);
  const wall = mat(0x31424d);
  const wall2 = mat(0x4e6670);
  const dark = mat(0x0d151d);
  const hazard = mat(COLORS.amber, 0.55, COLORS.amber, 0.15);
  box(32, 0.5, 24, floor, 0, -0.35, 0, g);
  box(32, 9, 0.55, wall, 0, 4.15, -9.2, g);
  box(0.55, 9, 18, wall, -15.7, 4.15, 0, g);
  box(0.55, 9, 18, wall2, 15.7, 4.15, 0, g);
  // overhead beams and a hard-edged ceiling grid
  for (let z = -8; z <= 8; z += 4) box(31, 0.42, 0.38, wall2, 0, 8.45, z, g);
  for (let x = -14; x <= 14; x += 4) box(0.38, 0.42, 17, wall2, x, 8.45, 0, g);
  // central workbench / lathe silhouette
  box(6.8, 1.0, 2.1, dark, -3.4, 0.2, -1.8, g);
  box(6.0, 1.0, 0.48, wall2, -3.4, 0.85, -1.8, g);
  for (const x of [-5.8, -3.6, -1.2]) box(0.38, 1.45, 0.38, dark, x, -0.08, -1.8, g);
  cyl(0.95, 1.3, wall2, 0.7, 1.22, -1.7, g, 8).rotation.x = Math.PI / 2;
  cyl(0.6, 1.4, hazard, 0.7, 1.22, -1.0, g, 8).rotation.x = Math.PI / 2;
  // hanging cables
  for (let x = -10; x <= 10; x += 2.5) {
    const cable = line([v3(x, 8.2, -6.7), v3(x + 0.13, 6.2, -6.7)], 0x121a21, 1, g);
    cable.material.linewidth = 2;
  }
  // light banks, toggled in the shot system
  for (const x of [-11, -5, 1, 7, 13]) {
    box(2.6, 0.08, 0.5, mat(0xb3d7dc, 0.3, 0x8bd7e4, 2.8), x, 8.1, -7.8, g);
  }
  // blast door / exit at the back
  box(4.2, 5.7, 0.36, dark, 8.6, 2.65, -8.86, g);
  box(3.65, 5.15, 0.08, mat(0x263d4a), 8.6, 2.64, -9.08, g);
  for (let y = .5; y < 5; y += .85) box(3.7, 0.08, 0.1, wall2, 8.6, y, -9.16, g);
  const doorLight = box(0.16, 0.42, 0.05, hazard, 10.35, 4.8, -9.18, g);
  doorLight.userData.doorLight = true;
  // scattered voxel crates
  for (let i = 0; i < 13; i++) {
    const x = -13 + seeded(i * 4.2) * 25;
    const z = -7 + seeded(i * 7.4) * 13;
    const s = 0.55 + seeded(i * 8.1) * .75;
    box(s, s, s, i % 3 ? wall : mat(COLORS.rust), x, s / 2 - .1, z, g);
  }
  // tiny status screen
  box(1.35, 0.9, 0.08, dark, -8.2, 3.5, -8.82, g);
  box(1.05, 0.55, 0.03, mat(COLORS.cyan, .3, COLORS.cyan, 2.4), -8.2, 3.5, -8.88, g);
  addLabel('K-17', COLORS.cyan, .18, -8.2, 3.5, -8.92, g).rotation.y = Math.PI;
  return g;
}

function makeShaft() {
  const g = sets.shaft;
  const stone = mat(0x26343a);
  const stone2 = mat(0x3a504e);
  const dark = mat(0x080e12);
  box(30, 0.5, 24, dark, 0, -0.4, 0, g);
  // mine tunnel walls form a diagonal frame
  box(3.3, 10, 0.45, stone, -9, 4, -5, g);
  box(3.3, 10, 0.45, stone, 9, 4, -5, g);
  box(21, 1.2, 0.6, stone2, 0, 8.2, -5, g);
  for (let z = -7; z <= 10; z += 2.4) {
    box(17, 0.18, 0.3, stone2, 0, 7.3, z, g);
    box(.26, 7.5, .26, stone2, -8.0, 3.7, z, g);
    box(.26, 7.5, .26, stone2, 8.0, 3.7, z, g);
  }
  // lift cage and rails
  const cage = new THREE.Group(); cage.position.set(0, 2.1, 1.5); g.add(cage);
  for (const x of [-3.2, 3.2]) for (const z of [-1.8, 1.8]) box(.16, 4.8, .16, stone2, x, 0, z, cage);
  for (const y of [-2.2, 0, 2.2]) {
    box(6.5, .16, .16, stone2, 0, y, -1.8, cage);
    box(6.5, .16, .16, stone2, 0, y, 1.8, cage);
  }
  box(6.5, .22, 3.8, mat(0x162227), 0, -2.45, 0, cage);
  for (const x of [-5.8, 5.8]) box(.18, 14, .18, stone2, x, 6, 0, g);
  for (const x of [-5.8, 5.8]) box(.5, 8, .5, mat(COLORS.amber, .5, COLORS.amber, 1.4), x, 2, -2.8, g);
  // dust motes as chunky points
  for (let i = 0; i < 36; i++) {
    const p = box(.08, .08, .08, mat(0x718b86, 1), (seeded(i) - .5) * 15, seeded(i + 2) * 8, -6 + seeded(i + 4) * 17, g);
    p.userData.dust = true; p.userData.phase = seeded(i + 8) * TAU;
  }
  return g;
}

function makeOrbit() {
  const g = sets.orbit;
  const space = mat(0x09131f, 0.92);
  const station = mat(0x687c82, .42);
  const stationDark = mat(0x21313a, .4);
  const glass = mat(COLORS.cyan, .2, COLORS.cyan, 1.3);
  box(30, .5, 24, space, 0, -4, 0, g);
  // planet below, built from stepped blue blocks
  const planet = new THREE.Group(); planet.position.set(8, -7.5, -4); g.add(planet);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * TAU;
    const r = 6.3 + (i % 3) * .25;
    const b = box(1.4, 1.4, 1.4, mat(i % 4 ? 0x214365 : 0x3b7082), Math.cos(a) * r, Math.sin(a) * r * .42, (seeded(i) - .5) * 1.4, planet);
    b.rotation.y = a;
  }
  box(11, .8, 1.6, stationDark, 0, 0, 0, g);
  box(6, .55, 4.0, station, -2.4, 0, 0, g);
  box(2.8, .72, 1.0, glass, 1.8, .05, 0, g);
  box(0.55, 5.2, .55, station, 4.6, 0, 0, g);
  box(.55, 5.2, .55, station, -4.6, 0, 0, g);
  for (const x of [-4.6, 4.6]) for (const z of [-2.3, 2.3]) box(.12, .12, 4.5, glass, x, 0, z, g);
  // solar vanes with cyan-edged cells
  for (const s of [-1, 1]) {
    box(7.2, .12, 2.5, mat(0x1d4160, .3), s * 9, 0, 0, g);
    for (let i = -3; i <= 3; i++) box(.08, .03, 2.25, glass, s * (9 + i), .1, 0, g);
  }
  // star field: individual dim square stars for the voxel grammar
  for (let i = 0; i < 120; i++) {
    const star = box(.035 + seeded(i + 50) * .09, .035, .035, mat(i % 9 ? 0x8ab2c7 : COLORS.white, 1, 0x51758e, 1.5), (seeded(i + 70) - .5) * 65, seeded(i + 90) * 28 - 3, -14 - seeded(i + 100) * 30, g);
    star.userData.star = true; star.userData.phase = seeded(i + 12) * TAU;
  }
  return g;
}

function makeSurface() {
  const g = sets.surface;
  const snow = mat(0xadc5c4);
  const ice = mat(0x759eaa);
  const darkIce = mat(0x2a5566);
  const soil = mat(0x27362e);
  box(36, .4, 28, snow, 0, -0.3, 0, g);
  // horizon slabs / ocean of snow
  for (let i = 0; i < 25; i++) {
    const x = -18 + seeded(i) * 36;
    const z = -11 + seeded(i + 30) * 17;
    const s = 1.2 + seeded(i + 60) * 3;
    box(s, .5 + seeded(i + 90) * 1.6, s * .8, i % 4 ? snow : ice, x, .1 + seeded(i + 90), z, g);
  }
  // a broken antenna and beacon, the visual echo of the opening
  for (let i = 0; i < 9; i++) box(.28, 1.2, .28, darkIce, 0, i * 1.05, 0, g);
  box(1.1, .25, 1.1, darkIce, 0, 9.2, 0, g);
  const beacon = box(.34, .34, .34, mat(COLORS.amber, .25, COLORS.amber, 4), 0, 9.52, 0, g);
  beacon.userData.beacon = true;
  // buried roof hatch
  box(5.2, .22, 3.4, soil, -5.8, .17, -1.8, g);
  box(3.8, .26, 2.0, ice, -5.8, .34, -1.8, g);
  for (let x = -7.3; x < -4.3; x += .65) box(.1, .14, 2, darkIce, x, .53, -1.8, g);
  return g;
}

makeBunker(); makeShaft(); makeOrbit(); makeSurface();

// Actors and hero props live in a common stage; shot code moves/parents them.
const lina = makePerson({ coat: true, skin: 0x9a654f, accent: COLORS.amber });
lina.position.set(-5, 0, -1);
world.add(lina);
const ren = makePerson({ suit: true, skin: 0xd9ad84, accent: COLORS.cyan });
ren.position.set(4, 0, -2);
ren.visible = false;
world.add(ren);
const drone = makeDrone(); drone.visible = false; world.add(drone);

const core = new THREE.Group();
box(.68, .68, .68, mat(COLORS.amber, .26, COLORS.amber, 4), 0, 0, 0, core);
box(.82, .13, .13, mat(COLORS.white, .2, COLORS.white, 2), 0, 0, 0, core);
box(.13, .82, .13, mat(COLORS.white, .2, COLORS.white, 2), 0, 0, 0, core);
core.position.set(-2.5, 2.2, -2.5); core.visible = false; world.add(core);

const meteor = new THREE.Group();
for (let i = 0; i < 15; i++) box(.35 + seeded(i) * .65, .35 + seeded(i + 2) * .65, .35 + seeded(i + 4) * .65, mat(i % 3 ? 0x58646a : 0xa55d39), (seeded(i + 8) - .5) * 3.1, (seeded(i + 20) - .5) * 2.6, (seeded(i + 30) - .5) * 2.2, meteor);
meteor.position.set(-5, 8, -8); meteor.rotation.set(.3, .4, .2); meteor.visible = false; world.add(meteor);

// A screen-space cut / light gates are actual set dressing, but the timing system also controls them.
const cut = box(100, 100, .1, mat(0x000000), 0, 0, -30);
cut.visible = false;

// ---- voice cue sheet: the only source of spoken content and subtitles ------
const voiceCues = [
  { id: 'narr_001', kind: 'narration', speaker: '林岚 · 旁白', text: '潮汐警报响起的第七天，地面已经没有白昼。', delivery: '低声，冷静，像在记录一份迟到的报告', start: 4, end: 11 },
  { id: 'lina_001', kind: 'dialogue', speaker: '林岚', text: '别停。再切三毫米，轨道站就能听见我们。', delivery: '压着焦急，对着工作台下令', start: 18, end: 26 },
  { id: 'radio_001', kind: 'radio', speaker: '轨道站 · 远端通讯', text: 'K-17，这里是弧光站。氧气还剩十一分钟。', delivery: '断续，带静电与距离感', start: 31, end: 39 },
  { id: 'ren_001', kind: 'dialogue', speaker: '任野', text: '我下去拿芯。你把门留给我。', delivery: '耳机内，故作轻松', start: 43, end: 49 },
  { id: 'lina_002', kind: 'dialogue', speaker: '林岚', text: '任野，回来时别带着整个夜晚。', delivery: '轻声，没说出口的告别', start: 50, end: 57 },
  { id: 'ren_002', kind: 'radio', speaker: '任野 · 航天服通讯', text: '听见了。三十秒后，给我一盏灯。', delivery: '无线电，短促而坚定', start: 72, end: 79 },
  { id: 'station_001', kind: 'radio', speaker: '弧光站 · 自动广播', text: '外部舱门开启。真空作业开始。', delivery: '无情绪的女声广播，机械回响', start: 82, end: 88 },
  { id: 'lina_003', kind: 'inner', speaker: '林岚 · 内心', text: '灯不是给他看的。灯是告诉地面，我们还在。', delivery: '近距离内心独白，终于承认恐惧', start: 104, end: 113 },
  { id: 'ren_003', kind: 'radio', speaker: '任野 · 航天服通讯', text: '芯片到了。林岚，关灯。', delivery: '急促，带呼吸与闷震', start: 121, end: 127 },
  { id: 'lina_004', kind: 'dialogue', speaker: '林岚', text: '不。让它亮。', delivery: '极轻，却不可动摇', start: 130, end: 134 },
  { id: 'radio_002', kind: 'radio', speaker: '弧光站 · 远端通讯', text: '收到信标。地面坐标确认。', delivery: '从噪声里浮出的第一句清晰回话', start: 145, end: 151 },
  { id: 'ren_004', kind: 'radio', speaker: '任野 · 航天服通讯', text: '我看见了。不是太阳，是你。', delivery: '无线电里笑了一下，疲惫而温柔', start: 154, end: 161 },
  { id: 'narr_002', kind: 'narration', speaker: '林岚 · 旁白', text: '后来我们才知道，白昼不是从天上回来的。', delivery: '片尾旁白，缓慢，带余韵', start: 167, end: 174 },
];

// ---- Web Audio: environmental and designed foley, no voice synthesis -------
let audio = null;
function initAudio() {
  if (audio) return audio.ctx.resume();
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = .34; master.connect(ctx.destination);
  const ambient = ctx.createGain(); ambient.gain.value = .09; ambient.connect(master);
  const rumble = ctx.createOscillator(); rumble.type = 'sine'; rumble.frequency.value = 47; const rg = ctx.createGain(); rg.gain.value = .16; rumble.connect(rg).connect(ambient); rumble.start();
  const hiss = ctx.createBufferSource(); const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * .6; hiss.buffer = buffer; hiss.loop = true; const hf = ctx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 1300; const hg = ctx.createGain(); hg.gain.value = .014; hiss.connect(hf).connect(hg).connect(ambient); hiss.start();
  audio = { ctx, master, ambient, muted: false, last: {} };
  return ctx.resume();
}
function tone(time, frequency, duration, volume = .12, type = 'sine', destination = audio?.master) {
  if (!audio || audio.muted) return;
  const o = audio.ctx.createOscillator(); const g = audio.ctx.createGain(); o.type = type; o.frequency.setValueAtTime(frequency, time); o.connect(g).connect(destination);
  g.gain.setValueAtTime(.0001, time); g.gain.exponentialRampToValueAtTime(Math.max(.0001, volume), time + .012); g.gain.exponentialRampToValueAtTime(.0001, time + duration); o.start(time); o.stop(time + duration + .03);
}
function noise(time, duration, volume = .15, filterFreq = 900, destination = audio?.master) {
  if (!audio || audio.muted) return;
  const src = audio.ctx.createBufferSource(); const b = audio.ctx.createBuffer(1, Math.max(1, Math.floor(audio.ctx.sampleRate * duration)), audio.ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; src.buffer = b;
  const f = audio.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = filterFreq; f.Q.value = 0.8; const g = audio.ctx.createGain(); g.gain.setValueAtTime(.0001, time); g.gain.exponentialRampToValueAtTime(volume, time + .008); g.gain.exponentialRampToValueAtTime(.0001, time + duration); src.connect(f).connect(g).connect(destination); src.start(time); src.stop(time + duration + .02);
}
function ping(time, f = 660, volume = .14) { tone(time, f, .3, volume, 'triangle'); tone(time + .08, f * 1.5, .24, volume * .55, 'sine'); }
function scheduleFoley(now, t) {
  if (!audio || audio.muted) return;
  const sec = Math.floor(t);
  if (sec === audio.last.sec) return;
  audio.last.sec = sec;
  const at = now + .035;
  if (t < 30 && sec % 3 === 0) { noise(at, .08, .12, 2200); tone(at, 80, .2, .05, 'square'); }
  if (t >= 30 && t < 45 && sec % 4 === 0) { noise(at, .18, .08, 650); ping(at, 580, .08); }
  if (t >= 59 && t < 72 && sec % 2 === 0) { tone(at, 39, .15, .15, 'sine'); noise(at, .05, .04, 1800); }
  if (t >= 72 && t < 93 && sec % 3 === 0) { noise(at, .9, .035, 420); tone(at, 115, .08, .04, 'sine'); }
  if (t >= 93 && t < 128 && sec % 2 === 0) { noise(at, .035, .07, 2300); }
  if (t >= 128 && t < 150 && sec % 2 === 0) { tone(at, 420, .2, .045, 'sine'); }
  if (t >= 150 && sec % 3 === 0) { ping(at, 740, .07); }
  if (sec === 29 || sec === 70 || sec === 118) { noise(at, .55, .22, 160); tone(at, 58, .28, .1, 'square'); }
}

// ---- shot language ---------------------------------------------------------
const shot = { id: -1, name: '', from: 0, to: 0 };
function cameraLook(pos, target, roll = 0) {
  camera.position.lerp(pos, .1);
  const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(camera.position, target, v3(0, 1, 0)));
  camera.quaternion.slerp(q, .1);
  camera.rotateZ(roll);
}
function activateSet(name) {
  for (const [key, g] of Object.entries(sets)) g.visible = key === name;
}
function resetActors() {
  lina.visible = false; ren.visible = false; drone.visible = false; core.visible = false; meteor.visible = false;
  lina.rotation.set(0, 0, 0); ren.rotation.set(0, 0, 0); drone.rotation.set(0, 0, 0); core.rotation.set(0, 0, 0);
}
function chapter(text) { ui.chapter.textContent = text; }
function setLights({ key = 1, cyan = 0, amber = 0, red = 0, bg = 0x05080d, fog = 0.022 } = {}) {
  keyLight.intensity = key; cyanLight.intensity = cyan; amberLight.intensity = amber; redLight.intensity = red; scene.background.set(bg); scene.fog.color.set(bg); scene.fog.density = fog;
}

function shot01(t) { // 0-14: cold open, beacon in snow
  activateSet('surface'); resetActors(); chapter('01 / THE LAST BEACON');
  setLights({ key: .35, cyan: .3, amber: 3.0, bg: 0x07131d, fog: .014 });
  const p = smooth(clamp(t / 14, 0, 1));
  const target = v3(0, 4.7, 0);
  cameraLook(v3(10 - p * 8, 5.8 + p * 1.5, 19 - p * 11), target);
  const beacon = sets.surface.children.find((o) => o.userData.beacon);
  if (beacon) { beacon.material.emissiveIntensity = 2.5 + Math.sin(t * 4) * .6; beacon.scale.setScalar(1 + Math.max(0, Math.sin(t * 4)) * .22); }
}
function shot02(t) { // 14-30: hands / machine / decision
  activateSet('bunker'); resetActors(); chapter('02 / THE WORKSHOP');
  setLights({ key: .72, cyan: .25, amber: 1.9, bg: 0x0b1115, fog: .028 });
  lina.visible = true; lina.position.set(-3.8, 0, -1.4); lina.rotation.y = .32;
  core.visible = true; core.position.set(-1.25, 1.55, -1.5); core.scale.setScalar(.56 + Math.sin(t * 4) * .03);
  const p = clamp((t - 14) / 16, 0, 1);
  cameraLook(v3(lerp(-6.2, -1.3, smooth(p)), 2.65, lerp(3.5, -1.8, p)), v3(-1.4, 1.7, -1.7));
  if (p > .6) { amberLight.position.set(-1.2, 3, -2); }
}
function shot03(t) { // 30-42: radio makes the scale widen
  activateSet('bunker'); resetActors(); chapter('03 / ELEVEN MINUTES');
  setLights({ key: .35, cyan: 1.4, amber: .8, bg: 0x071018, fog: .035 });
  lina.visible = true; lina.position.set(-5.3, 0, -1.3); lina.rotation.y = .45;
  drone.visible = true; drone.position.set(-8.15, 3.7, -8.1); drone.rotation.y = t * .8;
  const p = clamp((t - 30) / 12, 0, 1);
  cameraLook(v3(lerp(-4, -12, smooth(p)), 4.1, lerp(8, -5, p)), v3(-4.1, 2.4, -3.8));
}
function shot04(t) { // 42-58: decision in the door frame
  activateSet('bunker'); resetActors(); chapter('04 / LEAVE THE DOOR');
  setLights({ key: .38, cyan: .6, amber: 2.4, bg: 0x0a0d12, fog: .026 });
  lina.visible = true; ren.visible = true;
  lina.position.set(4.0, 0, -5.2); lina.rotation.y = Math.PI + .22;
  ren.position.set(8.2, 0, -7.7); ren.rotation.y = Math.PI;
  const p = clamp((t - 42) / 16, 0, 1);
  ren.position.x = lerp(8.1, 7.2, smooth(p));
  cameraLook(v3(lerp(4, 10, p), 3.1, lerp(2, -7, p)), v3(6.0, 2.4, -7.2));
}
function shot05(t) { // 58-73: cage descent, the sound goes inward
  activateSet('shaft'); resetActors(); chapter('05 / BELOW THE SIGNAL');
  setLights({ key: .55, cyan: .12, amber: 2.8, bg: 0x060b0d, fog: .038 });
  ren.visible = true; ren.position.set(0, -0.2, 1.5); ren.rotation.y = .1;
  const cage = sets.shaft.children.find((o) => o.position && Math.abs(o.position.z - 1.5) < .01);
  const p = clamp((t - 58) / 15, 0, 1); const y = lerp(1.1, -5.0, easeInOut(p));
  if (cage) cage.position.y = y;
  ren.position.y = y - .75;
  amberLight.position.set(0, y + 1.6, 1.5);
  cameraLook(v3(7 - p * 3, 2.4 + p * 1.4, 8 - p * 2.5), v3(0, y + .1, 1.5));
  sets.shaft.children.filter((o) => o.userData.dust).forEach((o) => { o.position.x += Math.sin(t * .7 + o.userData.phase) * .001; o.position.y += Math.sin(t * .9 + o.userData.phase) * .002; });
}
function shot06(t) { // 73-91: airlock / impossible silence
  activateSet('orbit'); resetActors(); chapter('06 / VACUUM');
  setLights({ key: .2, cyan: 2.2, amber: 0, bg: 0x01040a, fog: .005 });
  ren.visible = true; drone.visible = true; core.visible = true;
  ren.position.set(-2.1 + Math.sin(t * .4) * .1, -1.1 + Math.sin(t * .8) * .08, 0.2); ren.rotation.y = .6;
  drone.position.set(3.8, .8 + Math.sin(t * 1.5) * .16, -1.4); drone.rotation.y += .02;
  core.position.set(1.9, -.5, -.3); core.scale.setScalar(.6);
  const p = clamp((t - 73) / 18, 0, 1);
  cameraLook(v3(12 - p * 11, 4.0 - p * .8, 15 - p * 7), v3(0, 0, 0));
}
function shot07(t) { // 91-115: retrieval and the meaning of the light
  activateSet('orbit'); resetActors(); chapter('07 / A LIGHT FOR THE GROUND');
  setLights({ key: .15, cyan: 1.4, amber: 1.4, bg: 0x030813, fog: .007 });
  ren.visible = true; core.visible = true;
  const p = clamp((t - 91) / 24, 0, 1);
  ren.position.set(lerp(-1.4, 3.2, smooth(p)), -.8 + Math.sin(t) * .07, .3);
  ren.rotation.y = lerp(.4, -1.0, p);
  core.position.set(lerp(-.3, 4.8, smooth(p)), -.35 + Math.sin(t * 1.4) * .12, -.2);
  core.scale.setScalar(.62 + .08 * Math.sin(t * 3));
  amberLight.position.copy(core.position);
  cameraLook(v3(9 - p * 6, 3.5 - p * .8, 12 - p * 4), v3(1.4, 0, 0));
}
function shot08(t) { // 115-138: light test / refusal to extinguish
  activateSet('bunker'); resetActors(); chapter('08 / DO NOT EXTINGUISH');
  setLights({ key: .08, cyan: .3, amber: 3.8, red: .25, bg: 0x08090c, fog: .03 });
  lina.visible = true; core.visible = true;
  lina.position.set(-1.0, 0, -1.7); lina.rotation.y = -.2;
  core.position.set(.3, 2.8, -1.75); core.scale.setScalar(.65 + .1 * Math.sin(t * 5));
  const p = clamp((t - 115) / 23, 0, 1);
  cameraLook(v3(lerp(-4, 1.5, smooth(p)), 3.4, lerp(2.5, -4.5, p)), v3(.2, 2.3, -1.8));
  const flash = t > 129 ? 1 + Math.sin(t * 8) * .18 : .5;
  amberLight.intensity = 3.4 * flash;
}
function shot09(t) { // 138-162: signal crosses the dark / reunion without landing
  activateSet('surface'); resetActors(); chapter('09 / THE ANSWER');
  setLights({ key: .55, cyan: .45, amber: 3.6, bg: 0x10222b, fog: .012 });
  lina.visible = true; ren.visible = true; core.visible = true;
  lina.position.set(-5.7, 0, -1.8); lina.rotation.y = .4;
  ren.position.set(5.6, 0, 1.0); ren.rotation.y = -Math.PI / 2;
  core.position.set(0, 2.6, 0); core.scale.setScalar(.7);
  const p = clamp((t - 138) / 24, 0, 1);
  cameraLook(v3(lerp(13, 7, easeInOut(p)), 5.5 + p * 2, lerp(16, 8, p)), v3(0, 3.8, 0));
  const beacon = sets.surface.children.find((o) => o.userData.beacon); if (beacon) beacon.material.emissiveIntensity = 2 + Math.sin(t * 3) * .8;
}
function shot10(t) { // 162-180: quiet epilogue, snow sees the beacon
  activateSet('surface'); resetActors(); chapter('10 / AFTER THE TIDE');
  setLights({ key: 1.0, cyan: .15, amber: 3.2, bg: 0x31566a, fog: .009 });
  const p = clamp((t - 162) / 18, 0, 1);
  cameraLook(v3(lerp(5, 0, smooth(p)), 10.5 - p * 1.4, lerp(15, 8, p)), v3(0, 4.4, 0));
  const beacon = sets.surface.children.find((o) => o.userData.beacon); if (beacon) { beacon.material.emissiveIntensity = 3 + p * 2; beacon.scale.setScalar(1 + p * .35); }
  if (p > .76) { ui.title.style.opacity = String(0.25 + (p - .76) * 2); }
}

const shots = [shot01, shot02, shot03, shot04, shot05, shot06, shot07, shot08, shot09, shot10];
const shotBounds = [0, 14, 30, 42, 58, 73, 91, 115, 138, 162, FILM_LENGTH];
function renderFilm(t) {
  const now = clamp(t, 0, FILM_LENGTH);
  let nextId = shots.length - 1;
  for (let i = 0; i < shotBounds.length - 1; i++) {
    if (now >= shotBounds[i] && now < shotBounds[i + 1]) { nextId = i; break; }
  }
  if (nextId !== shot.id) { shot.id = nextId; shot.name = shots[nextId].name; }
  shots[nextId](now);
  ui.progress.style.width = `${(now / FILM_LENGTH) * 100}%`;
  const mm = String(Math.floor(now / 60)).padStart(2, '0'); const ss = String(Math.floor(now % 60)).padStart(2, '0');
  ui.time.textContent = `${mm}:${ss} / 03:00`;
  const active = voiceCues.find((cue) => now >= cue.start && now <= cue.end);
  ui.subtitle.textContent = active ? `【${active.speaker}】${active.text}` : '';
  ui.subtitle.classList.toggle('visible', Boolean(active));
  const pulse = 1 + Math.sin(now * 1.7) * .012;
  camera.fov = lerp(camera.fov, 46 * pulse, .08); camera.updateProjectionMatrix();
  scheduleFoley(audio?.ctx.currentTime || 0, now);
}

let playing = true;
let filmTime = 0;
let lastFrame = performance.now();
function tick(now) {
  const dt = Math.min(.05, (now - lastFrame) / 1000); lastFrame = now;
  if (playing) filmTime += dt;
  if (filmTime >= FILM_LENGTH) { filmTime = FILM_LENGTH; playing = false; ui.play.textContent = '重播'; }
  renderFilm(filmTime);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

function togglePlay() {
  if (filmTime >= FILM_LENGTH) filmTime = 0;
  playing = !playing; ui.play.textContent = playing ? '暂停' : '播放'; initAudio();
}
ui.play.addEventListener('click', togglePlay);
ui.sound.addEventListener('click', async () => { await initAudio(); audio.muted = !audio.muted; ui.sound.textContent = audio.muted ? '声音 关' : '声音 开'; });
renderer.domElement.addEventListener('click', () => { initAudio(); togglePlay(); });
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight') filmTime = clamp(filmTime + 5, 0, FILM_LENGTH);
  if (e.code === 'ArrowLeft') filmTime = clamp(filmTime - 5, 0, FILM_LENGTH);
});
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

ui.fade.classList.add('ready');
renderFilm(0);
requestAnimationFrame(tick);

// Expose a tiny, intentional inspection surface for evaluators and later dubbing.
window.__film = { duration: FILM_LENGTH, voiceCues, seek: (seconds) => { filmTime = clamp(seconds, 0, FILM_LENGTH); }, play: () => { playing = true; }, pause: () => { playing = false; } };
