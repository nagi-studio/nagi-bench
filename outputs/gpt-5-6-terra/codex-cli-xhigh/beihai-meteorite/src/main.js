import * as THREE from 'three';

/*
 * 北海陨星 / A Signal Under Ice
 * All imagery, geometry, texture-like marks and sound are generated at runtime.
 * The film is deliberately 200 seconds: room for silence inside the 360s limit.
 */

const DURATION = 200;
const canvas = document.querySelector('#stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020811');
scene.fog = new THREE.FogExp2('#06131e', 0.012);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .05, 1200);
const clock = new THREE.Clock();
const look = new THREE.Vector3();
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const smooth = (a, b, t) => { t = clamp((t - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const C = {
  ice: '#9bc9cf', iceDark: '#122d39', night: '#04111d', steel: '#25434d', steel2: '#54717a',
  amber: '#ffb957', red: '#fa5b46', cyan: '#72eceb', white: '#e9f3ee', black: '#050a0d',
  suit: '#d8e5df', visor: '#142d38', orange: '#e68a45', rock: '#39515a', signal: '#c3ffea'
};
const mat = (color, roughness = .72, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const basic = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 });
const mats = {
  ice: mat(C.ice, .9), iceDark: mat(C.iceDark, .93), steel: mat(C.steel, .48, .7), steel2: mat(C.steel2, .5, .68),
  wall: mat('#1a3039', .7, .42), orange: mat(C.orange, .6, .2), suit: mat(C.suit, .9), visor: mat(C.visor, .2, .82),
  rock: mat(C.rock, .98), black: mat(C.black, .9), amber: basic(C.amber), red: basic(C.red), cyan: basic(C.cyan), white: basic(C.white), signal: basic(C.signal)
};

function cube(parent, x, y, z, sx, sy, sz, material, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
  m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m;
}
function cylinder(parent, x, y, z, r, h, material, sides = 8, rot = null) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, sides), material);
  m.position.set(x, y, z); if (rot) m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
function glow(parent, x, y, z, color, scale = 1) {
  const g = new THREE.PointLight(color, 1.4 * scale, 16 * scale, 2);
  g.position.set(x, y, z); parent.add(g);
  const core = new THREE.Mesh(new THREE.BoxGeometry(.18 * scale, .18 * scale, .06 * scale), basic(color));
  core.position.copy(g.position); parent.add(core); return { g, core };
}
function groupAt(x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); return g; }
function roundedBox(parent, x, y, z, sx, sy, sz, material) { return cube(parent, x, y, z, sx, sy, sz, material); }

// ---- ENVIRONMENT: surface, underground operation, and the vast upper sky ----
const surface = groupAt(0, 0, 0);
const lab = groupAt(118, 0, 0);
const airlock = groupAt(235, 0, 0);
const space = groupAt(0, 0, -310);
const atmos = groupAt(0, 0, 0);

const keySun = new THREE.DirectionalLight('#91c8e4', 1.6); keySun.position.set(-40, 65, 25); keySun.castShadow = true; keySun.shadow.mapSize.set(1024, 1024); scene.add(keySun);
const fillSky = new THREE.HemisphereLight('#75a7ca', '#0a1317', 1.15); scene.add(fillSky);
const labFill = new THREE.HemisphereLight('#a7e2dc', '#071014', .23); scene.add(labFill);

// Star field has slight voxel quantization and is reused through the finale.
const starGeo = new THREE.BufferGeometry();
const starCount = 700, starPos = new Float32Array(starCount * 3), starCol = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const a = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1), r = 280 + Math.random() * 180;
  starPos[i * 3] = Math.cos(a) * Math.sin(v) * r;
  starPos[i * 3 + 1] = Math.cos(v) * r + 45;
  starPos[i * 3 + 2] = Math.sin(a) * Math.sin(v) * r;
  const tint = .55 + Math.random() * .45; starCol.set([tint, tint * (.86 + Math.random() * .14), 1], i * 3);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: .65, vertexColors: true, sizeAttenuation: true })); scene.add(stars);

function makeIcefield() {
  const g = new THREE.Group(); surface.add(g);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260, 28, 28), mats.iceDark); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);
  const p = ground.geometry.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getY(i); p.setZ(i, Math.sin(x * .12) * .3 + Math.cos(z * .11) * .32 + Math.sin((x + z) * .06) * .5 - 1.2); }
  ground.geometry.computeVertexNormals();
  // facets, floes, and a restrained station silhouette
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - .5) * 190, z = (Math.random() - .5) * 190;
    if (Math.abs(x) < 28 && Math.abs(z) < 32) continue;
    const s = 1 + Math.random() * 5;
    const floe = cube(g, x, -.35, z, s, .12 + Math.random() * .25, s * (.45 + Math.random()), mats.ice, false); floe.rotation.y = Math.random() * 1.6;
  }
  // Station: a heavy rectangular outpost, warm only at the human scale.
  cube(g, -14, 3, 6, 23, 5.5, 12, mats.wall); cube(g, -14, 6.25, 6, 24, .35, 13, mats.steel2);
  cube(g, -25, 2, 6, 2.6, 7, 5, mats.steel); cube(g, -2.2, 2, 6, 2.6, 7, 5, mats.steel);
  for (let x = -22; x < -5; x += 4.2) { cube(g, x, 3.8, -.08, 2.4, 1.5, .1, basic('#d58f50')); glow(g, x, 3.8, -.2, '#ffb15f', .35); }
  const antenna = cylinder(g, -19, 10, 8, .16, 8, mats.steel2, 6); antenna.rotation.z = -.25; cube(g, -20, 13, 8, 5, .22, .22, mats.steel2);
  for (let i = 0; i < 4; i++) cube(g, -18 + i * .7, 14, 8, .24, .24, .24, mats.red);
  // Landing pad and marker lamps
  cube(g, 15, -.55, 4, 19, .28, 19, mats.steel);
  for (const [x, z] of [[7,-4],[23,-4],[7,12],[23,12]]) glow(g, x, -.05, z, C.amber, .25);
  return g;
}
makeIcefield();

function makeAurora() {
  const g = new THREE.Group(); atmos.add(g);
  const bands = [];
  for (let b = 0; b < 4; b++) {
    const pts = []; const startX = -100 + b * 8;
    for (let i = 0; i <= 32; i++) { const x = startX + i * 6; pts.push(new THREE.Vector3(x, 26 + b * 4 + Math.sin(i * .36 + b) * 4, -62 - b * 8)); }
    const curve = new THREE.CatmullRomCurve3(pts); const geo = new THREE.TubeGeometry(curve, 70, .35 + b * .09, 4, false);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: b % 2 ? '#3be6d1' : '#618dff', transparent: true, opacity: .11, blending: THREE.AdditiveBlending, depthWrite: false })); g.add(mesh); bands.push(mesh);
  }
  return bands;
}
const aurora = makeAurora();

function makeLab() {
  const g = new THREE.Group(); lab.add(g);
  // an underground research room: close walls force portrait-like framing.
  cube(g, 0, -.7, 0, 42, 1, 30, mats.black); cube(g, 0, 7.5, 13.8, 42, 16, 1, mats.wall);
  cube(g, -20.3, 7.5, 0, 1, 16, 30, mats.wall); cube(g, 20.3, 7.5, 0, 1, 16, 30, mats.wall); cube(g, 0, 15.5, 0, 42, 1, 30, mats.wall);
  for (let x = -17; x <= 17; x += 8.5) { cube(g, x, 14.8, 0, .3, .15, 25, mats.steel2); glow(g, x, 14.35, -3, '#78d6db', .45); }
  // diagnostic wall, information is geometric and coded by color rather than texture
  for (let i = 0; i < 5; i++) {
    const panel = cube(g, -14 + i * 5.5, 7.2, 13.12, 4.4, 5.8, .2, mat('#09222d', .4, .4));
    for (let j = 0; j < 8; j++) cube(g, -15.6 + i * 5.5 + (j % 4) * .82, 5.3 + Math.floor(j / 4) * .9, 12.95, .58, .45, .03, j === 7 ? mats.amber : mats.cyan, false);
    panel.userData.panel = true;
  }
  const table = cube(g, 1, 2.3, 1, 13, .6, 7, mats.steel); cylinder(g, -3.7, 1, -1.3, .35, 3, mats.steel2, 6); cylinder(g, 5.7, 1, -1.3, .35, 3, mats.steel2, 6);
  // thin visible cables
  for (let i = 0; i < 7; i++) { const wire = cylinder(g, -12 + i * 4, 2.6, 8.3, .055, 11 + (i % 2) * 2, mats.steel2, 5, [Math.PI / 2, 0, 0]); wire.rotation.z = .25 - i * .07; }
  for (const [x,z] of [[-16,-8],[16,-8],[-16,9],[16,9]]) glow(g,x,6,z,'#e58b49',.38);
  return g;
}
makeLab();

function makeAirlock() {
  const g = new THREE.Group(); airlock.add(g);
  // axis: a pressurized bridge cut through black ice.
  cube(g, 0, -.7, 0, 44, 1, 16, mats.black); cube(g, 0, 8.4, 7.7, 44, 18, .6, mats.wall); cube(g, 0, 8.4, -7.7, 44, 18, .6, mats.wall); cube(g, 0, 17, 0, 44, .6, 16, mats.wall);
  for (let x = -19; x < 20; x += 4) { cube(g, x, 1.8, -7.1, .28, 3, .3, mats.steel2); cube(g, x, 1.8, 7.1, .28, 3, .3, mats.steel2); glow(g, x, 12.7, 0, '#81dde0', .28); }
  // airlock ring at positive x
  const ring = new THREE.Group(); ring.position.set(15, 7, 0); g.add(ring);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const plate = cube(ring, 0, Math.cos(a) * 5.6, Math.sin(a) * 5.6, .7, 1.7, 2.1, mats.steel2); plate.rotation.x = a; }
  cube(g, 15.5, 7, 0, .8, 8.8, 8.8, mats.black);
  const door = cube(g, 16, 7, 0, .25, 8, 8, mats.steel);
  door.userData.airlockDoor = true;
  for (let i = 0; i < 5; i++) glow(g, 13.9, 10.8 - i * 1.8, -5.5, C.red, .24);
  // Emergency patch crate + booster pack rack
  cube(g, -12, 1.3, 4.9, 5.3, 2.6, 2.6, mats.orange); cube(g, -12, 2.7, 3.52, 4.4, .38, .08, mats.amber);
  return g;
}
makeAirlock();

// A clean voxel human: square proportions, individual articulated limbs, no borrowed game models.
function makeHuman(name, suitColor = C.suit, accent = C.orange) {
  const g = new THREE.Group(); g.name = name;
  const suit = mat(suitColor, .86), accentMat = mat(accent, .6, .25);
  const pelvis = cube(g, 0, 3.15, 0, 1.55, .8, .82, suit); const torso = cube(g, 0, 4.55, 0, 1.9, 2.25, 1.05, suit);
  cube(g, 0, 5.05, .57, 1.35, .75, .15, accentMat); cube(g, 0, 4.1, -.57, 1.4, .65, .13, mats.steel2);
  const head = cube(g, 0, 6.75, 0, 1.48, 1.42, 1.27, suit); const visor = cube(g, 0, 6.8, .67, 1.16, .73, .08, mats.visor, false);
  const armL = new THREE.Group(), armR = new THREE.Group(), legL = new THREE.Group(), legR = new THREE.Group();
  armL.position.set(-1.25, 5.25, 0); armR.position.set(1.25, 5.25, 0); legL.position.set(-.53, 2.85, 0); legR.position.set(.53, 2.85, 0); g.add(armL, armR, legL, legR);
  cube(armL, 0, -1.04, 0, .62, 2.08, .67, suit); cube(armR, 0, -1.04, 0, .62, 2.08, .67, suit); cube(armL, 0, -2.05, 0, .7, .48, .74, mats.steel2); cube(armR, 0, -2.05, 0, .7, .48, .74, mats.steel2);
  cube(legL, 0, -1.28, 0, .72, 2.55, .78, suit); cube(legR, 0, -1.28, 0, .72, 2.55, .78, suit); cube(legL, 0, -2.58, .18, .93, .42, 1.2, mats.steel2); cube(legR, 0, -2.58, .18, .93, .42, 1.2, mats.steel2);
  const pack = cube(g, 0, 4.9, -.72, 1.45, 1.75, .38, mats.steel2); cube(g, -.43, 5.58, -.97, .2, .24, .12, mats.cyan, false);
  g.userData = { pelvis, torso, head, visor, armL, armR, legL, legR, pack, baseY: 0, walkPhase: Math.random() * 6.28 };
  return g;
}
const maraSurface = makeHuman('MARA_SURFACE'); maraSurface.position.set(7, -.1, 1); surface.add(maraSurface);
const maraLab = makeHuman('MARA_LAB'); maraLab.position.set(-18, 0, 0); lab.add(maraLab);
const maraAir = makeHuman('MARA_AIR'); maraAir.position.set(-20, 0, 0); airlock.add(maraAir);
const maraSpace = makeHuman('MARA_SPACE'); maraSpace.position.set(20, 10, 35); space.add(maraSpace); maraSpace.visible = false;

function animateHuman(human, t, mode = 'idle', intensity = 1) {
  const u = human.userData, w = t * (mode === 'walk' ? 5.3 : 1.6) + u.walkPhase;
  if (mode === 'walk') {
    human.position.y = u.baseY + Math.abs(Math.sin(w)) * .12;
    u.legL.rotation.x = Math.sin(w) * .65 * intensity; u.legR.rotation.x = -Math.sin(w) * .65 * intensity;
    u.armL.rotation.x = -Math.sin(w) * .48 * intensity; u.armR.rotation.x = Math.sin(w) * .48 * intensity;
  } else if (mode === 'reach') { u.armR.rotation.x = -1.32; u.armL.rotation.x = -.22; u.head.rotation.x = .14; }
  else if (mode === 'brace') { u.armR.rotation.x = -1.05; u.armL.rotation.x = -1.05; u.legL.rotation.x = .25; u.legR.rotation.x = -.25; }
  else { human.position.y = u.baseY + Math.sin(w) * .025; u.armL.rotation.x = Math.sin(w) * .04; u.armR.rotation.x = -Math.sin(w) * .04; }
}

// The fallen object is intentionally neither natural nor familiar: a dark cuboid seed encased in ice.
const meteor = new THREE.Group(); meteor.position.set(15, .4, 4); surface.add(meteor);
const meteorCore = cube(meteor, 0, .7, 0, 2.25, 2.25, 2.25, mat('#061014', .25, .92)); meteorCore.rotation.set(.22, .62, .12);
const meteorHalo = new THREE.Mesh(new THREE.BoxGeometry(3.15, 3.15, 3.15), new THREE.MeshBasicMaterial({ color: '#5af1db', wireframe: true, transparent: true, opacity: .22 })); meteor.add(meteorHalo);
const meteorLight = new THREE.PointLight('#4de6db', 0, 19, 2); meteorLight.position.y = 1; meteor.add(meteorLight);
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; cube(meteor, Math.cos(a) * 2.3, -.15, Math.sin(a) * 2.3, .7, .18, .7, mats.ice, false); }

// In lab the same object becomes a specimen, then a beacon core in the launch module.
const specimen = meteor.clone(); specimen.position.set(1.5, 3.1, 1); specimen.scale.setScalar(.63); lab.add(specimen); specimen.visible = false;
const beacon = new THREE.Group(); beacon.position.set(1, 3, 0); airlock.add(beacon); beacon.visible = false;
cube(beacon, 0, 0, 0, 3.7, 2.1, 3.7, mats.steel); const beaconCore = cube(beacon, 0, .1, 0, 1.55, 1.55, 1.55, mats.signal); beaconCore.rotation.set(.3,.3,.1);
for (let i = 0; i < 4; i++) cylinder(beacon, 0, .1, 0, 2.5 + i*.5, .18, mats.steel2, 8, [0,0,Math.PI/2]);

const beaconBeam = new THREE.Mesh(new THREE.CylinderGeometry(.23, 2.3, 26, 8, 1, true), new THREE.MeshBasicMaterial({ color:'#8fffe7', transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false })); beaconBeam.position.set(2, 18, 0); airlock.add(beaconBeam);
const beaconGlow = new THREE.PointLight('#7fffe0', 0, 45, 2); beaconGlow.position.set(1, 3, 0); airlock.add(beaconGlow);

function makeOrbit() {
  const g = new THREE.Group(); space.add(g);
  // chunked globe, made of subtly varied planar tiles.
  const globe = new THREE.Mesh(new THREE.IcosahedronGeometry(82, 3), mat('#0a2737', .78, .15)); globe.position.set(0,-69,-110); g.add(globe);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(82.5, 30, 18, 0,Math.PI*2,0,.46), mat('#b9d9d6', .95)); cap.position.copy(globe.position); cap.position.y += 3; g.add(cap);
  // Unknown orbital receiver, mathematically simple and distant.
  const relay = new THREE.Group(); relay.position.set(0, 22, -65); g.add(relay);
  cube(relay, 0,0,0,8,3,5,mats.steel2); cube(relay,-11,0,0,14,.25,6,mats.steel); cube(relay,11,0,0,14,.25,6,mats.steel);
  cylinder(relay,0,4,0,2.7,.35,mats.steel2,8); const dish = new THREE.Mesh(new THREE.ConeGeometry(4.7,1.7,10,1,true),mats.steel); dish.position.y=5; dish.rotation.x=Math.PI; relay.add(dish);
  const relayLight = new THREE.PointLight('#d3fff2',0,36,2); relayLight.position.set(0,4,0); relay.add(relayLight);
  return { globe, relay, relayLight };
}
const orbit = makeOrbit();

// small physical particles: snow at the exterior, dust / steam in buildings, stars never use texture files.
function makeParticles(count, color, size, bounds) {
  const geo = new THREE.BufferGeometry(), pos = new Float32Array(count * 3), seed = new Float32Array(count);
  for (let i=0;i<count;i++) { pos[i*3]=(Math.random()-.5)*bounds.x; pos[i*3+1]=Math.random()*bounds.y; pos[i*3+2]=(Math.random()-.5)*bounds.z; seed[i]=Math.random(); }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3)); geo.setAttribute('seed',new THREE.BufferAttribute(seed,1));
  const points = new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity:.65,depthWrite:false})); scene.add(points); return {points,pos,seed,bounds};
}
const snow = makeParticles(360,'#bde5e4',.12,V3(140,34,120));
const dust = makeParticles(170,'#c5f6e7',.05,V3(40,15,28)); dust.points.position.set(118,0,0); dust.points.visible=false;
const vent = makeParticles(140,'#e9ffff',.1,V3(18,11,12)); vent.points.position.set(235,0,0); vent.points.visible=false;

// ---- Dialogue / voice handoff manifest. This is the only source used by subtitle playback. ----
export const voiceCues = [
  { id:'cue_001', kind:'radio', speaker:'北海站自动台', text:'北海站第七观测窗：记录到一次非自然坠落。', delivery:'冷静、带轻微无线电失真', start:14, end:20 },
  { id:'cue_002', kind:'dialogue', speaker:'玛拉', text:'它没有烧穿冰层。它是在等我。', delivery:'压低声音，惊异而克制', start:28, end:34 },
  { id:'cue_003', kind:'radio', speaker:'未知信号', text:'……请……回答……', delivery:'断续、遥远、非人类的窄带通讯', start:58, end:64 },
  { id:'cue_004', kind:'dialogue', speaker:'玛拉', text:'这是求救信标。可这组坐标……在云层上面。', delivery:'迅速推理，最后一句近乎自语', start:77, end:86 },
  { id:'cue_005', kind:'alarm', speaker:'北海站自动台', text:'外壳裂缝扩大。预计失压：三分十二秒。', delivery:'中性、清晰、无情绪', start:102, end:109 },
  { id:'cue_006', kind:'inner', speaker:'玛拉', text:'它一路掉到这里，只为了把这句话送出去。', delivery:'内心独白，安静而坚定', start:115, end:122 },
  { id:'cue_007', kind:'dialogue', speaker:'玛拉', text:'那就让它回到能被听见的地方。', delivery:'面对风暴，大声但稳定', start:133, end:139 },
  { id:'cue_008', kind:'radio', speaker:'北海站自动台', text:'气闸开启。祝你好运，维修员玛拉。', delivery:'警报下的电子女声，尾音被噪声吞没', start:151, end:158 },
  { id:'cue_009', kind:'inner', speaker:'玛拉', text:'别再坠落了。向上。', delivery:'在头盔内轻声说，几乎是呼吸', start:169, end:174 },
  { id:'cue_010', kind:'radio', speaker:'未知信号', text:'收到。我们看见你了。', delivery:'终于完整、温柔、仍带微弱星际延迟', start:184, end:191 }
];

// ---- Web Audio score / foley: no sampled voice, only synthesised environment and signals. ----
class SoundDirector {
  constructor() { this.ctx = null; this.master = null; this.started = false; this.muted = false; this.last = -1; this.drone = null; }
  start() {
    if (this.started) return; this.started = true;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = .22; this.master.connect(this.ctx.destination);
    const drone = this.ctx.createOscillator(), gain = this.ctx.createGain(), low = this.ctx.createBiquadFilter(); drone.type='sine'; drone.frequency.value=43; low.type='lowpass'; low.frequency.value=180; gain.gain.value=.025; drone.connect(low).connect(gain).connect(this.master); drone.start(); this.drone={drone,gain};
  }
  setMuted(m) { this.muted=m; if(this.master) this.master.gain.setTargetAtTime(m?0:.22,this.ctx.currentTime,.04); }
  tone(freq, duration=.12, type='sine', volume=.1, slide=0) {
    if(!this.ctx||this.muted)return; const now=this.ctx.currentTime, o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type=type;o.frequency.setValueAtTime(freq,now);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(8,freq+slide),now+duration);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g).connect(this.master);o.start(now);o.stop(now+duration+.02);
  }
  noise(duration=.15, volume=.06, filter=900) {
    if(!this.ctx||this.muted)return; const now=this.ctx.currentTime, b=this.ctx.createBuffer(1,Math.floor(this.ctx.sampleRate*duration),this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();f.type='bandpass';f.frequency.value=filter;f.Q.value=.8;g.gain.value=volume;s.buffer=b;s.connect(f).connect(g).connect(this.master);s.start(now);
  }
  event(name) { if(!this.ctx||this.muted)return; if(name==='step'){this.noise(.09,.065,190);this.tone(66,.08,'triangle',.05,-22);} if(name==='ping'){this.tone(860,.22,'sine',.11,-340);this.tone(1280,.28,'sine',.04,-600);} if(name==='alarm'){this.tone(670,.19,'square',.07,-260);setTimeout(()=>this.tone(470,.17,'square',.055,100),125);} if(name==='hiss'){this.noise(.55,.12,1400);} if(name==='thump'){this.noise(.19,.18,120);this.tone(48,.22,'sine',.15,-18);} if(name==='thruster'){/* vacuum: suit-frame vibration, never an external engine roar */this.tone(58,.52,'sine',.035,16);this.tone(116,.18,'triangle',.017,-9);} if(name==='beacon'){this.tone(440,.15,'sine',.08,440);setTimeout(()=>this.tone(880,.32,'sine',.065,-340),100);} }
  update(t) {
    if(!this.ctx)return; if(this.drone){ const target=t<35?.023:t<105?.038:t<150?.05:t<177?.018:.034;this.drone.gain.gain.setTargetAtTime(target,this.ctx.currentTime,.4);this.drone.drone.frequency.setTargetAtTime(t>170?58:43,this.ctx.currentTime,.6); }
    const second=Math.floor(t); if(second!==this.last){ this.last=second; if((t>21&&t<34&&second%3===0)||(t>39&&t<54&&second%2===0))this.event('step'); if(t>56&&t<75&&second%4===0)this.event('ping'); if(t>101&&t<121&&second%3===0)this.event('alarm'); if(t>122&&t<151&&second%5===0)this.event('thump'); if(t>159&&t<178&&second%2===0)this.event('thruster'); if(t>181&&t<196&&second%3===0)this.event('beacon'); }
  }
}
const sound = new SoundDirector();

const ui = {
  title: document.querySelector('#titles'), subtitle:document.querySelector('#subtitle'), start:document.querySelector('#start'), startButton:document.querySelector('#start-button'),
  play:document.querySelector('#play'), mute:document.querySelector('#mute'), scrub:document.querySelector('#scrub'), clock:document.querySelector('#clock'), scene:document.querySelector('#scene'), end:document.querySelector('#endcard'), replay:document.querySelector('#replay')
};
let filmTime = 0, previousTime = 0, playing = false, started = false;
const chapterFor = (t) => t<13?'PRELUDE / 01':t<37?'CONTACT / 02':t<94?'THE OBJECT / 03':t<124?'FAULTLINE / 04':t<158?'ASCENT / 05':t<181?'VACUUM / 06':'REPLY / 07';

function cameraShot(t) {
  let p, target, fov=45;
  // Every interval composes a genuine shot. Small hand-held disturbances are added afterward only in danger scenes.
  if(t<12){ p=V3(35,18,49);target=V3(-8,3,2);fov=43; }
  else if(t<23){ const a=smooth(12,23,t);p=V3(30-18*a,8-2*a,26-10*a);target=V3(15,1,4);fov=38; }
  else if(t<37){p=V3(9,5.9,13);target=V3(15,1,4);fov=54;}
  else if(t<49){p=V3(101,5.5,9);target=V3(111,4,0);fov=46;}
  else if(t<62){p=V3(110,6.2,12.3);target=V3(119,3.3,1);fov=38;}
  else if(t<77){p=V3(128,8.5,10);target=V3(119,3.1,1);fov=48;}
  else if(t<94){ const a=smooth(77,94,t);p=V3(123+6*a,5.8,8-5*a);target=V3(119.5,3.4,1);fov=44; }
  else if(t<105){p=V3(128,8,11);target=V3(116,5,4);fov=52;}
  else if(t<124){p=V3(108,5,8);target=V3(118,3.5,1);fov=50;}
  else if(t<139){p=V3(215,6,10);target=V3(233,4,0);fov=44;}
  else if(t<151){p=V3(230,5.5,7);target=V3(237,3.5,0);fov=49;}
  else if(t<160){p=V3(245,10,20);target=V3(236,4,0);fov=42;}
  else if(t<174){ const a=smooth(160,174,t);p=V3(35-15*a,18+8*a,43-13*a);target=V3(20,4+10*a,-2);fov=42;}
  else if(t<182){p=V3(15,27,-275);target=V3(12,18,-300);fov=50;}
  else { const a=smooth(182,200,t);p=V3(20-11*a,31-6*a,-267-12*a);target=V3(0,22,-375);fov=42; }
  if(t>101&&t<150){const j=Math.sin(t*18)*.07*smooth(101,104,t);p.add(V3(j,j*.4,-j));}
  camera.position.copy(p); camera.fov=lerp(camera.fov,fov,.09);camera.updateProjectionMatrix();look.copy(target);camera.lookAt(look);
}

function updateWorld(t, dt) {
  stars.rotation.y = t*.002;
  aurora.forEach((b,i)=>{b.rotation.z=Math.sin(t*.07+i)*.035;b.position.y=Math.sin(t*.09+i)*1.5;});
  const snowAttr=snow.points.geometry.attributes.position; for(let i=0;i<snowAttr.count;i++){let y=snowAttr.getY(i)-dt*(1.7+(i%3)*.35); if(y<-1)y=34;snowAttr.setY(i,y); snowAttr.setX(i,snowAttr.getX(i)+Math.sin(t*.4+i)*dt*.14);} snowAttr.needsUpdate=true;
  const dustAttr=dust.points.geometry.attributes.position; for(let i=0;i<dustAttr.count;i++){dustAttr.setY(i,(dustAttr.getY(i)+dt*.13)%15); }dustAttr.needsUpdate=true;
  const ventAttr=vent.points.geometry.attributes.position; for(let i=0;i<ventAttr.count;i++){ventAttr.setX(i,((ventAttr.getX(i)+9+dt*3)%18)-9);ventAttr.setY(i,((ventAttr.getY(i)+dt*1.2)%11));}ventAttr.needsUpdate=true;
  dust.points.visible=t>37&&t<124; vent.points.visible=t>124&&t<160;
  snow.points.visible=t<37||t>157;
  // meteor makes the first refusal of the natural world: rhythmic but not human-beat regular.
  const pulse=.25+.75*Math.pow(Math.max(0,Math.sin(t*1.72)),7); meteorHalo.rotation.y+=dt*.13; meteorHalo.scale.setScalar(1+pulse*.14);meteorLight.intensity=(t>13&&t<37)?1.6*pulse:0;
  specimen.visible=t>=48&&t<124; specimen.rotation.y+=dt*.35; specimen.children[1].material.opacity=.14+pulse*.3; specimen.children[2].intensity=.3+pulse*1.3;
  if(t<37){maraSurface.visible=true;maraLab.visible=false;maraAir.visible=false;maraSpace.visible=false; maraSurface.position.x=t<22?7:11.5+Math.min(1,(t-22)/10)*1.5;animateHuman(maraSurface,t,t>21?'walk':'idle');maraSurface.userData.head.rotation.y=.16;}
  else if(t<124){maraSurface.visible=false;maraLab.visible=true;maraAir.visible=false;maraSpace.visible=false;animateHuman(maraLab,t,t<50?'walk':t<94?'reach':'brace'); maraLab.position.set(t<50?-18+(t-37)*.8:2,0,0);}
  else if(t<160){maraSurface.visible=false;maraLab.visible=false;maraAir.visible=true;maraSpace.visible=false;animateHuman(maraAir,t,t<140?'walk':t<150?'reach':'brace'); maraAir.position.x=t<142?-20+(t-124)*.68:-3;}
  else {maraSurface.visible=false;maraLab.visible=false;maraAir.visible=false;maraSpace.visible=true;animateHuman(maraSpace,t,'brace'); maraSpace.rotation.z=Math.sin(t*.8)*.08; maraSpace.position.set(20-(t-160)*.8,10+(t-160)*.53,35-(t-160)*.8);}
  // escalating practical lights, one important hard cut at the loss of pressure
  const warning=t>100&&t<160; airlock.traverse(o=>{if(o.isPointLight&&o.color.getHexString()==='fa5b46')o.intensity=warning?(Math.sin(t*7)>0?1.7:.12):.2;});
  const breach=smooth(123,137,t); beacon.visible=t>132&&t<160; beacon.position.y=3+breach*.2; beacon.rotation.y+=dt*.55; beaconCore.material.color.set(t>132?'#d2ffed':'#ffffff');beaconGlow.intensity=breach*4;beaconBeam.material.opacity=breach*.25;beaconBeam.scale.y=1+breach*4;
  // Opening view of the sky reclaims the blue / warm palette from confined walls.
  const spacePhase=smooth(157,173,t);scene.fog.density=lerp(.012,.0005,spacePhase);fillSky.intensity=lerp(1.15,.12,spacePhase);keySun.intensity=lerp(1.6,2.2,spacePhase);
  meteor.visible=t<=157;
  if(t>157&&t<180){ beacon.visible=false; }
  if(t>177){ orbit.relayLight.intensity=smooth(181,189,t)*4; orbit.relay.scale.setScalar(1+smooth(182,199,t)*.06); }
  else {orbit.relayLight.intensity=0;}
  // a white-green answer crosses the camera only during the ending; external sound remains deliberately almost empty.
  const endPulse=smooth(184,193,t); if(endPulse>.01){orbit.relay.rotation.y=endPulse*.25;}
}

function updateUI(t) {
  ui.clock.textContent=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;ui.scene.textContent=chapterFor(t);ui.scrub.value=t;
  ui.title.style.opacity=t<10?String(1-smooth(6,11,t)): '0';
  const cue=voiceCues.find(c=>t>=c.start&&t<c.end);ui.subtitle.textContent=cue?`【${cue.speaker}】${cue.text}`:'';
  ui.end.classList.toggle('visible',t>195); 
}
function triggerTransitions(t, old) {
  const hits=(time,name)=>{if(old<time&&t>=time)sound.event(name);};
  hits(14,'ping');hits(57,'ping');hits(101,'alarm');hits(123,'hiss');hits(151,'hiss');hits(158,'thump');hits(168,'thruster');hits(184,'beacon');
}
function render() {
  const dt=Math.min(clock.getDelta(),.07); if(playing){previousTime=filmTime;filmTime=Math.min(DURATION,filmTime+dt);if(filmTime>=DURATION)playing=false;triggerTransitions(filmTime,previousTime);sound.update(filmTime);} 
  updateWorld(filmTime,dt);cameraShot(filmTime);updateUI(filmTime);renderer.render(scene,camera);requestAnimationFrame(render);
}

function begin() { if(!started){started=true;ui.start.classList.remove('visible');sound.start();}playing=true;clock.getDelta(); }
function setTime(t){filmTime=clamp(t,0,DURATION);previousTime=filmTime;ui.end.classList.remove('visible');}
ui.startButton.addEventListener('click',begin); ui.play.addEventListener('click',()=>{if(!started)begin();else {playing=!playing;ui.play.textContent=playing?'Ⅱ':'▶';clock.getDelta();}});ui.mute.addEventListener('click',()=>{sound.setMuted(!sound.muted);ui.mute.textContent=sound.muted?'×':'♬';});ui.scrub.addEventListener('input',e=>setTime(+e.target.value));ui.replay.addEventListener('click',()=>{setTime(0);begin();});
addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();ui.play.click();}if(e.code==='ArrowRight')setTime(filmTime+5);if(e.code==='ArrowLeft')setTime(filmTime-5);if(e.key.toLowerCase()==='m')ui.mute.click();if(e.key.toLowerCase()==='r'){setTime(0);begin();}});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
render();
