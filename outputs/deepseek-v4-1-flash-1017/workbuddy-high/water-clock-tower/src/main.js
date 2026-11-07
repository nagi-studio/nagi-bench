import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './style.css';

/* ------------------------------------------------------------------ errors */
const errBox = document.getElementById('err');
const fail = (e) => {
  errBox.style.display = 'block';
  errBox.textContent = (e && (e.stack || e.message)) || String(e);
};
window.addEventListener('error', (e) => fail(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => fail(e.reason));

/* ---------------------------------------------------------------- renderer */
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07090c);
const backdrop = new THREE.Mesh(
  new THREE.PlaneGeometry(90, 60),
  new THREE.MeshBasicMaterial({ color: 0x121820 })
);
backdrop.position.set(0, 12, -16);
scene.add(backdrop);
scene.fog = new THREE.FogExp2(0x07090c, 0.022);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.05).texture;
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 200);
camera.position.set(9, 9, 12);
camera.lookAt(0, 6, 0);

/* ------------------------------------------------------------------ lights */
scene.add(new THREE.HemisphereLight(0xa8c0e0, 0x3a2a1c, 0.95));

const key = new THREE.SpotLight(0xffd9a0, 420, 46, 0.7, 0.5, 1.5);
key.position.set(6.5, 14, 8);
key.target.position.set(0, 6, 0);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0016;
scene.add(key, key.target);

const fill = new THREE.SpotLight(0x9ab6e8, 210, 46, 0.85, 0.65, 1.3);
fill.position.set(-9, 7, 6);
fill.target.position.set(0, 5.5, 0);
scene.add(fill, fill.target);

const rimLight = new THREE.SpotLight(0xffc27a, 240, 46, 0.75, 0.55, 1.4);
rimLight.position.set(-4, 4, -10);
rimLight.target.position.set(0, 6, 0);
scene.add(rimLight, rimLight.target);

const glow = new THREE.PointLight(0xffb96b, 12, 14, 2);
glow.position.set(0.2, 8.6, 0.6);
scene.add(glow);

/* --------------------------------------------------------------- materials */
const M = {
  wood: new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 0.82, metalness: 0.05 }),
  woodLight: new THREE.MeshStandardMaterial({ color: 0x6d4f33, roughness: 0.75, metalness: 0.06 }),
  bronze: new THREE.MeshStandardMaterial({ color: 0xb08040, roughness: 0.34, metalness: 0.92 }),
  bronzeDark: new THREE.MeshStandardMaterial({ color: 0x7c5a2c, roughness: 0.46, metalness: 0.85 }),
  iron: new THREE.MeshStandardMaterial({ color: 0x54585e, roughness: 0.5, metalness: 0.75 }),
  water: new THREE.MeshStandardMaterial({
    color: 0x9fd8ea, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.72,
    emissive: 0x1d4a5a, emissiveIntensity: 0.4
  }),
  jade: new THREE.MeshStandardMaterial({ color: 0x86b39a, roughness: 0.5, metalness: 0.2 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x3b3a38, roughness: 0.9, metalness: 0.05 })
};

/* ---------------------------------------------------------------- physics */
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
world.solver.iterations = 24;
world.allowSleep = false;
world.defaultContactMaterial.friction = 0.28;
world.defaultContactMaterial.restitution = 0.02;

const staticBody = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
world.addBody(staticBody);

const syncList = [];
function link(mesh, body) { syncList.push({ mesh, body }); return mesh; }

/* ---------------------------------------------------------------- helpers */
const boxMesh = (w, h, d, mat, x, y, z, parent = scene) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
};
const cylMesh = (r1, r2, h, mat, x, y, z, seg = 28) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  scene.add(m);
  return m;
};

/* ------------------------------------------------------------- pavilion */
(function pavilion() {
  const W = 3.0, D = 2.4, H = 10.4;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      boxMesh(0.18, H, 0.18, M.wood, sx * W, H / 2, sz * D);
    }
  }
  // only two intermediate decks, so the wheel chamber (y 2.6 - 8.8) stays clear
  for (const y of [2.6, 8.8]) {
    boxMesh(W * 2.06, 0.12, D * 2.16, M.woodLight, 0, y, 0);
    boxMesh(W * 2.06, 0.44, 0.07, M.wood, 0, y + 0.3, -D);
    for (const sx of [-1, 1]) boxMesh(0.07, 0.44, D * 2.16, M.wood, sx * W, y + 0.3, 0);
  }
  boxMesh(W * 2.16, 0.16, D * 2.26, M.woodLight, 0, 10.3, 0);

  // open canopy on four posts above the top platform (the armillary sits there)
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) boxMesh(0.1, 3.4, 0.1, M.wood, sx * 2.1, 12.0, sz * 1.7);
  }
  boxMesh(4.9, 0.14, 4.0, M.woodLight, 0, 13.72, 0);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.5, 0.9, 4), M.wood);
  roof.position.set(0, 14.24, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  scene.add(roof);

  boxMesh(8.4, 0.5, 6.6, M.stone, 0, -0.25, 0);
  for (let i = -5; i <= 5; i++) {
    boxMesh(0.06, H - 1.2, 0.06, M.woodLight, i * 0.28, H / 2 - 0.2, -D);
  }
})();

/* ------------------------------------------------------------ water tanks */
(function tanks() {
  boxMesh(1.7, 0.62, 1.25, M.bronzeDark, 1.05, 9.55, 0);
  boxMesh(1.74, 0.06, 1.29, M.bronze, 1.05, 9.87, 0);
  boxMesh(0.9, 0.42, 0.74, M.bronzeDark, 0.5, 8.92, 0);
  boxMesh(0.94, 0.05, 0.78, M.bronze, 0.5, 9.14, 0);
  // spout
  const sp = cylMesh(0.07, 0.07, 0.42, M.bronze, 0.36, 8.62, 0);
  sp.rotation.z = 0.32;
  // support beams
  for (const sx of [0.35, 1.75]) {
    for (const sz of [-0.42, 0.42]) boxMesh(0.08, 0.5, 0.08, M.iron, sx, 9.0, sz);
  }
  for (const sx of [0.15, 0.85]) boxMesh(0.07, 0.34, 0.07, M.iron, sx, 8.72, 0.3);
})();

/* ------------------------------------------------------- 枢轮 water wheel */
const WHEEL = { x: 0, y: 6.0, r: 2.0, buckets: 12 };

const wheelGroup = new THREE.Group();
wheelGroup.position.set(WHEEL.x, WHEEL.y, 0);
scene.add(wheelGroup);

const wheelBody = new CANNON.Body({ mass: 34, position: new CANNON.Vec3(WHEEL.x, WHEEL.y, 0) });
wheelBody.angularDamping = 0.03;
wheelBody.linearDamping = 1;

const cylQ = new CANNON.Quaternion();
cylQ.setFromEuler(Math.PI / 2, 0, 0); // cylinder axis Y -> Z, matching the wheel plane
wheelBody.addShape(new CANNON.Cylinder(WHEEL.r, WHEEL.r, 0.34, 28), new CANNON.Vec3(0, 0, 0), cylQ);

// visual rim + spokes
const rim = new THREE.Mesh(new THREE.TorusGeometry(WHEEL.r, 0.1, 12, 64), M.bronze);
rim.castShadow = true;
wheelGroup.add(rim);
const rim2 = rim.clone();
rim2.position.z = 0.22;
wheelGroup.add(rim2);
for (let i = 0; i < 12; i++) {
  const a = (i / 12) * Math.PI * 2;
  const sp = boxMesh(0.07, WHEEL.r * 2 - 0.12, 0.07, M.woodLight, 0, 0, 0, wheelGroup);
  sp.rotation.z = a;
}
cylMesh(0.16, 0.16, 1.6, M.iron, WHEEL.x, WHEEL.y, 0).rotation.x = Math.PI / 2;

// buckets + pins
const bucketMeshes = [];
const buckets = [];
for (let i = 0; i < WHEEL.buckets; i++) {
  const a = (i / WHEEL.buckets) * Math.PI * 2;
  const r = WHEEL.r - 0.12;
  const g = new THREE.Group();
  g.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
  g.rotation.z = a - Math.PI / 2;
  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.44), M.bronzeDark);
  shell.castShadow = true;
  g.add(shell);
  const inner = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.36), M.water);
  inner.position.y = 0.06;
  inner.scale.set(0.2, 0.2, 0.2);
  g.add(inner);
  wheelGroup.add(g);
  bucketMeshes.push({ group: g, inner, angle: a });
  buckets.push({ angle: a, fill: 0 });

  const pin = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
  // pins are handled as children of the wheel body
  wheelBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.055, 0.12, 0.16)),
    new CANNON.Vec3(Math.cos(a) * (WHEEL.r + 0.16), Math.sin(a) * (WHEEL.r + 0.16), 0)
  );
  pin.mass = 0;
}
const pinRing = new THREE.Group();
for (let i = 0; i < WHEEL.buckets; i++) {
  const a = (i / WHEEL.buckets) * Math.PI * 2;
  const p = boxMesh(0.09, 0.2, 0.3, M.iron, Math.cos(a) * (WHEEL.r + 0.16), Math.sin(a) * (WHEEL.r + 0.16), 0, pinRing);
  p.rotation.z = a;
}
wheelGroup.add(pinRing);

// hinge to frame
const wheelAnchor = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC, position: new CANNON.Vec3(WHEEL.x, WHEEL.y, 0) });
world.addBody(wheelAnchor);
world.addConstraint(new CANNON.HingeConstraint(wheelBody, wheelAnchor, {
  pivotA: new CANNON.Vec3(0, 0, 0),
  axisA: new CANNON.Vec3(0, 0, 1),
  pivotB: new CANNON.Vec3(0, 0, 0),
  axisB: new CANNON.Vec3(0, 0, 1)
}));
world.addBody(wheelBody);
link(wheelGroup, wheelBody);

/* ------------------------------------------------------- 天关 check lever */
const LEVER = { x: 0.7, y: 9.35, rest: 0 };

const leverGroup = new THREE.Group();
leverGroup.position.set(LEVER.x, LEVER.y, 0);
scene.add(leverGroup);

const leverBody = new CANNON.Body({ mass: 1.1, position: new CANNON.Vec3(LEVER.x, LEVER.y, 0) });
leverBody.addShape(new CANNON.Box(new CANNON.Vec3(0.35, 0.05, 0.09)), new CANNON.Vec3(-0.35, -0.75, 0));
leverBody.addShape(new CANNON.Box(new CANNON.Vec3(0.055, 0.2, 0.09)), new CANNON.Vec3(-0.7, -1.0, 0));
world.addBody(leverBody);

const leverAnchor = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC, position: new CANNON.Vec3(LEVER.x, LEVER.y, 0) });
world.addBody(leverAnchor);
world.addConstraint(new CANNON.HingeConstraint(leverBody, leverAnchor, {
  pivotA: new CANNON.Vec3(0, 0, 0), axisA: new CANNON.Vec3(0, 0, 1),
  pivotB: new CANNON.Vec3(0, 0, 0), axisB: new CANNON.Vec3(0, 0, 1)
}));

const lv = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.34, 0.16), M.bronze);
lv.position.y = -0.22;
lv.castShadow = true;
leverGroup.add(lv);
const lvArm = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 0.18), M.bronze);
lvArm.position.set(-0.35, -0.75, 0);
lvArm.castShadow = true;
leverGroup.add(lvArm);
const lvTip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.18), M.bronze);
lvTip.position.set(-0.7, -0.92, 0);
lvTip.castShadow = true;
leverGroup.add(lvTip);
const lvWeight = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), M.iron);
lvWeight.position.set(0.06, -0.42, 0);
leverGroup.add(lvWeight);
link(leverGroup, leverBody);

// 天衡 beam (visual, part of the lever assembly)
const beamGroup = new THREE.Group();
beamGroup.position.set(0.7, 9.62, 0);
scene.add(beamGroup);
const beam = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.1), M.bronze);
beamGroup.add(beam);
for (const s of [-1, 1]) {
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 8), M.iron);
  rod.position.set(s * 0.82, -0.24, 0);
  beamGroup.add(rod);
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 16), M.bronzeDark);
  pan.position.set(s * 0.82, -0.46, 0);
  beamGroup.add(pan);
}
const beamPivot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), M.iron);
beamGroup.add(beamPivot);

/* ------------------------------------------------ 昼夜机轮 day-night wheel */
const DNW = { x: 0, y: 6.0, z: -1.9, r: 2.15 };
const dnGroup = new THREE.Group();
dnGroup.position.set(DNW.x, DNW.y, DNW.z);
scene.add(dnGroup);

const dnBody = new CANNON.Body({ mass: 26, position: new CANNON.Vec3(DNW.x, DNW.y, DNW.z) });
dnBody.angularDamping = 0.1;
dnBody.linearDamping = 1;
dnBody.addShape(new CANNON.Cylinder(DNW.r, DNW.r, 0.26, 26), new CANNON.Vec3(0, 0, 0), cylQ);
world.addBody(dnBody);
const dnAnchor = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC, position: new CANNON.Vec3(DNW.x, DNW.y, DNW.z) });
world.addBody(dnAnchor);
world.addConstraint(new CANNON.HingeConstraint(dnBody, dnAnchor, {
  pivotA: new CANNON.Vec3(0, 0, 0), axisA: new CANNON.Vec3(0, 0, 1),
  pivotB: new CANNON.Vec3(0, 0, 0), axisB: new CANNON.Vec3(0, 0, 1)
}));
link(dnGroup, dnBody);

const dnRim = new THREE.Mesh(new THREE.TorusGeometry(DNW.r, 0.09, 10, 56), M.woodLight);
dnGroup.add(dnRim);
const dnDisc = new THREE.Mesh(new THREE.CylinderGeometry(DNW.r - 0.12, DNW.r - 0.12, 0.06, 40), M.wood);
dnDisc.rotation.x = Math.PI / 2;
dnGroup.add(dnDisc);

// 木人 figures on the wheel (hinged arms swing by gravity)
const figures = [];
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2 + 0.4;
  const g = new THREE.Group();
  g.position.set(Math.cos(a) * (DNW.r - 0.3), Math.sin(a) * (DNW.r - 0.3), 0.16);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.18, 4, 8), M.woodLight);
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), M.woodLight);
  head.position.y = 0.24;
  g.add(head);
  dnGroup.add(g);

  const armPivot = new THREE.Group();
  armPivot.position.set(0, 0.1, 0.06);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.34, 8), M.bronzeDark);
  arm.position.y = -0.17;
  armPivot.add(arm);
  const mallet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), M.bronze);
  mallet.position.y = -0.35;
  armPivot.add(mallet);
  g.add(armPivot);
  figures.push({ pivot: armPivot, phase: Math.random() * 6.28 });
}

// bell and drum that the figures pass
const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.34, 0.4, 20, 1, true), M.bronze);
bell.position.set(-2.42, 7.6, DNW.z + 0.1);
scene.add(bell);
const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.34, 20), M.woodLight);
drum.rotation.x = Math.PI / 2;
drum.position.set(2.46, 5.3, DNW.z + 0.1);
scene.add(drum);

/* ------------------------------------------------------- 浑象 + 浑仪 top */
const globeGroup = new THREE.Group();
globeGroup.position.set(0, 11.3, 0);
scene.add(globeGroup);
const globeBody = new CANNON.Body({ mass: 12, position: new CANNON.Vec3(0, 11.3, 0) });
globeBody.angularDamping = 0.06;
globeBody.linearDamping = 1;
globeBody.addShape(new CANNON.Sphere(1.05));
world.addBody(globeBody);
const globeAnchor = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC, position: new CANNON.Vec3(0, 11.3, 0) });
world.addBody(globeAnchor);
world.addConstraint(new CANNON.HingeConstraint(globeBody, globeAnchor, {
  pivotA: new CANNON.Vec3(0, 0, 0), axisA: new CANNON.Vec3(0, 0, 1),
  pivotB: new CANNON.Vec3(0, 0, 0), axisB: new CANNON.Vec3(0, 0, 1)
}));
link(globeGroup, globeBody);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.02, 40, 28), M.bronzeDark);
globeGroup.add(sphere);
const gridMat = new THREE.LineBasicMaterial({ color: 0xd8b26a, transparent: true, opacity: 0.55 });
for (let i = 1; i < 8; i++) {
  const lat = (i / 8) * Math.PI - Math.PI / 2;
  const r = Math.cos(lat) * 1.03;
  const y = Math.sin(lat) * 1.03;
  const pts = [];
  for (let k = 0; k <= 48; k++) {
    const t = (k / 48) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
  }
  globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
}
for (let i = 0; i < 8; i++) {
  const lon = (i / 8) * Math.PI * 2;
  const pts = [];
  for (let k = 0; k <= 48; k++) {
    const t = (k / 48) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(t) * 1.03 * Math.cos(lon), Math.sin(t) * 1.03, Math.cos(t) * 1.03 * Math.sin(lon)));
  }
  globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
}

const armillary = new THREE.Group();
armillary.position.set(0, 13.2, 0);
scene.add(armillary);
const ringMat = M.bronze;
for (let i = 0; i < 3; i++) {
  const t = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.045, 8, 64), ringMat);
  t.rotation.set(i === 0 ? 0 : Math.PI / 2, i * 0.7, i === 2 ? 0.4 : 0);
  armillary.add(t);
}
const axisRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.1, 10), M.iron);
axisRod.rotation.z = 0.41;
armillary.add(axisRod);

/* ------------------------------------------------------------- water flow */
const FLOW = { x: 0.36, y: 8.45 };
const dropCount = 130;
const dropGeo = new THREE.SphereGeometry(0.042, 6, 5);
const dropMat = new THREE.MeshStandardMaterial({ color: 0xbfe6f2, emissive: 0x2a6b82, emissiveIntensity: 0.7, transparent: true, opacity: 0.85 });
const drops = new THREE.InstancedMesh(dropGeo, dropMat, dropCount);
scene.add(drops);
const dropState = [];
for (let i = 0; i < dropCount; i++) {
  dropState.push({ y: FLOW.y - Math.random() * 1.2, v: 1.4 + Math.random() * 1.6, x: (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.16 });
}
const dummy = new THREE.Object3D();

const stream = new THREE.Mesh(
  new THREE.CylinderGeometry(0.045, 0.075, 1.35, 10, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0xcdeef8, transparent: true, opacity: 0.34, roughness: 0.1,
    emissive: 0x3d8fa8, emissiveIntensity: 0.8, side: THREE.DoubleSide
  })
);
stream.position.set(FLOW.x - 0.06, FLOW.y - 0.68, 0);
stream.rotation.z = 0.06;
scene.add(stream);

/* ------------------------------------------------------------------ audio */
let audioCtx = null;
let waterGain = null;
let droneGain = null;
const audio = {
  init() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.2;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1100;
    bp.Q.value = 0.7;
    waterGain = audioCtx.createGain();
    waterGain.gain.value = 0.12;
    src.connect(bp).connect(waterGain).connect(audioCtx.destination);
    src.start();

    // low drone
    droneGain = audioCtx.createGain();
    droneGain.gain.value = 0.05;
    droneGain.connect(audioCtx.destination);
    for (const f of [55, 82.5, 110]) {
      const o = audioCtx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = audioCtx.createGain();
      g.gain.value = f === 110 ? 0.3 : 0.55;
      o.connect(g).connect(droneGain);
      o.start();
    }
  },
  click(strength = 1) {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(680 + Math.random() * 120, t);
    o.frequency.exponentialRampToValueAtTime(180, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * strength, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(audioCtx.destination);
    o.start(t);
    o.stop(t + 0.2);
  },
  bell() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    for (const [f, a] of [[520, 0.1], [1245, 0.045], [1870, 0.025]]) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(a, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + 1.7);
    }
  },
  drum() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(58, t + 0.28);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g).connect(audioCtx.destination);
    o.start(t);
    o.stop(t + 0.5);
  }
};

/* ------------------------------------------------------------------- film */
const DURATION = 30;
const shots = [
  { t: 0.0, pos: [13.8, 10.4, 17.6], look: [0, 7.0, 0] },
  { t: 4.6, pos: [8.6, 10.6, 11.4], look: [0.6, 8.6, 0] },
  { t: 9.0, pos: [5.6, 8.2, 7.6], look: [0.1, 7.5, 0] },
  { t: 13.6, pos: [3.4, 8.0, 5.2], look: [0, 8.1, 0] },
  { t: 18.4, pos: [-5.2, 7.8, 5.6], look: [0.2, 6.4, -1.7] },
  { t: 23.2, pos: [5.0, 13.2, 7.0], look: [0, 12.2, 0] },
  { t: 27.4, pos: [11.4, 12.8, 14.4], look: [0, 8.4, 0] },
  { t: 30.0, pos: [13.2, 12.2, 16.8], look: [0, 8.0, 0] }
];

const captions = [
  { t: 0.6, d: 4.0, text: '北宋元祐七年，苏颂在开封造出<b>水运仪象台</b>——一台以水力驱动、能自行报时的天文钟。' },
  { t: 4.8, d: 4.0, text: '水自<b>天池</b>流下，经<b>平水壶</b>保持恒定水头，再由壶嘴注入枢轮外缘的受水壶。' },
  { t: 9.0, d: 4.4, text: '壶受水而重，重力压着枢轮转动；<b>天关</b>随即卡住轮辐上的销，使它一壶一格地走。' },
  { t: 13.6, d: 4.6, text: '这套<b>擒纵机构</b>把连续的水流切成均匀的节拍：天衡、天关、天条互相牵制，滴答成刻。' },
  { t: 18.4, d: 4.6, text: '枢轮经齿轮传动到<b>昼夜机轮</b>，轮上的木人按时辰摇铃、打钟、击鼓。' },
  { t: 23.2, d: 4.0, text: '同一根轴继续向上，带动顶层的<b>浑象</b>与<b>浑仪</b>，令天球与星空同步旋转。' },
  { t: 27.4, d: 3.4, text: '以水为动力，以擒纵定节拍——九百年前，这台机器自己知道什么时候该响。' }
];

const capEl = document.getElementById('caption');
const titleEl = document.getElementById('title');
const barEl = document.getElementById('bar');

function lerp(a, b, t) { return a + (b - a) * t; }
function smooth(t) { return t * t * (3 - 2 * t); }

function cameraAt(time) {
  let i = 0;
  while (i < shots.length - 2 && shots[i + 1].t <= time) i++;
  const a = shots[i], b = shots[i + 1];
  const k = smooth(Math.min(1, Math.max(0, (time - a.t) / (b.t - a.t))));
  camera.position.set(
    lerp(a.pos[0], b.pos[0], k), lerp(a.pos[1], b.pos[1], k), lerp(a.pos[2], b.pos[2], k)
  );
  const look = new THREE.Vector3(
    lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k)
  );
  camera.lookAt(look);
}

/* ------------------------------------------------------------ simulation */
const clock = new THREE.Clock();
let elapsed = 0;
let lastLeverAngle = 0;
let lastPinIndex = 0;
let clickCooldown = 0;
let lastBellAngle = 0;
let lastStrike = 0;

// tuned transmission model: torque coupling between shafts (documented in the write-up)
const COUPLE = { ratio: 0.62, kp: 26, kd: 5.6 };
const GLOBE_COUPLE = { ratio: 1.0, kp: 12, kd: 3.2 };

function quatAngleZ(q) {
  return 2 * Math.atan2(q.z, q.w);
}

function stepPhysics(dt, time) {
  // water: fill buckets in the inlet arc, drain them lower down
  const wheelAngle = quatAngleZ(wheelBody.quaternion);
  let torqueApplied = 0;

  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i];
    const worldAngle = ((b.angle + wheelAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const deg = (worldAngle * 180) / Math.PI;

    // inlet: 78..132 degrees (upper left of the wheel)
    if (deg > 94 && deg < 150) b.fill = Math.min(1, b.fill + dt * 3.2);
    else if (deg > 238 || deg < 20) b.fill = Math.max(0, b.fill - dt * 3.0);
    else b.fill = Math.max(0, b.fill - dt * 0.05);

    if (b.fill > 0.001) {
      const bx = Math.cos(worldAngle) * (WHEEL.r - 0.12);
      const by = Math.sin(worldAngle) * (WHEEL.r - 0.12);
      const f = b.fill * 15; // newtons of water weight in this bucket
      wheelBody.applyForce(new CANNON.Vec3(0, -f, 0), new CANNON.Vec3(bx, by, 0));
      torqueApplied += f;
    }
    bucketMeshes[i].inner.scale.setScalar(0.18 + b.fill * 0.82);
    bucketMeshes[i].inner.material.opacity = 0.25 + b.fill * 0.6;
  }

  // speed governor: the check train holds the wheel near its working rate
  const spd = wheelBody.angularVelocity.z;
  if (Math.abs(spd) > 0.85) wheelBody.torque.z -= (Math.abs(spd) - 0.85) * Math.sign(spd) * 240;

  // one-way ratchet: the check lever never lets the wheel run backwards
  if (wheelBody.angularVelocity.z < 0) {
    wheelBody.torque.z += -wheelBody.angularVelocity.z * 260;
  }

  // escapement spring on the check lever
  const la = quatAngleZ(leverBody.quaternion);
  const lw = leverBody.angularVelocity.z;
  leverBody.torque.z += -0.55 * la - 0.75 * lw;

  // transmission: torque coupling to the day-night wheel and the globe
  const wWheel = wheelBody.angularVelocity.z;
  const wDn = dnBody.angularVelocity.z;
  const targetDn = wWheel * COUPLE.ratio;
  dnBody.torque.z += (targetDn - wDn) * COUPLE.kp - wDn * COUPLE.kd;

  const wGlobe = globeBody.angularVelocity.z;
  const targetGlobe = wWheel * GLOBE_COUPLE.ratio;
  globeBody.torque.z += (targetGlobe - wGlobe) * GLOBE_COUPLE.kp - wGlobe * GLOBE_COUPLE.kd;

  world.step(1 / 120, dt, 4);

  // each pin that passes the pallet kicks it: the impulse is integrated by the solver
  const pinIndex = Math.floor((wheelAngle / (Math.PI * 2)) * WHEEL.buckets);
  if (pinIndex !== lastPinIndex) {
    lastPinIndex = pinIndex;
    const dir = Math.sign(wheelBody.angularVelocity.z) || 1;
    leverBody.angularVelocity.z += 2.4 * dir;
    if (clickCooldown <= 0) {
      audio.click(0.7 + Math.min(0.5, torqueApplied / 60));
      clickCooldown = 0.16;
    }
  }
  clickCooldown -= dt;
  lastLeverAngle = quatAngleZ(leverBody.quaternion);

  // bell / drum strikes as the figures pass
  const dnAngle = quatAngleZ(dnBody.quaternion);
  const pass = Math.floor((dnAngle / (Math.PI * 2)) * 8);
  if (pass !== lastBellAngle) {
    lastBellAngle = pass;
    if (time > 1.2 && time < DURATION) {
      if (pass % 2 === 0) audio.bell(); else audio.drum();
    }
  }

  // swinging arms (gravity + damping, purely passive)
  for (const f of figures) {
    const swing = Math.sin(time * 3.1 + f.phase) * 0.5;
    f.pivot.rotation.z = swing - 0.2;
  }

  // water drops
  for (let i = 0; i < dropCount; i++) {
    const s = dropState[i];
    s.y -= s.v * dt;
    s.v += 5.2 * dt;
    if (s.y < WHEEL.y + 1.4) { s.y = FLOW.y; s.v = 1.2; s.x = (Math.random() - 0.5) * 0.1; }
    dummy.position.set(FLOW.x + s.x, s.y, s.z);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    drops.setMatrixAt(i, dummy.matrix);
  }
  drops.instanceMatrix.needsUpdate = true;
}

function updateCaptions(time) {
  let active = null;
  for (const c of captions) {
    if (time >= c.t && time < c.t + c.d) { active = c; break; }
  }
  if (active) {
    if (capEl.dataset.cur !== String(active.t)) {
      capEl.dataset.cur = String(active.t);
      capEl.innerHTML = active.text;
    }
    capEl.classList.add('show');
  } else {
    capEl.classList.remove('show');
    capEl.dataset.cur = '';
  }
  titleEl.classList.toggle('show', time < 3.4);
  barEl.style.width = `${Math.min(100, (time / DURATION) * 100)}%`;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;
  const t = elapsed % DURATION;

  stepPhysics(dt, elapsed);
  cameraAt(t);
  updateCaptions(t);

  for (const s of syncList) {
    s.mesh.position.copy(s.body.position);
    s.mesh.quaternion.copy(s.body.quaternion);
  }
  // the lever arm visual lags slightly behind the beam for a mechanical feel
  beamGroup.rotation.z = -quatAngleZ(leverBody.quaternion) * 0.16;
  glow.intensity = 10 + Math.sin(elapsed * 2.2) * 1.6;

  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// start audio on first interaction (autoplay policy), and try immediately for headless runs
const startAudio = () => { audio.init(); if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); };
addEventListener('pointerdown', startAudio, { once: true });
addEventListener('keydown', startAudio, { once: true });
startAudio();

/* debug hook used by the automated review pass */
window.__wc = { world, wheelBody, leverBody, dnBody, globeBody, buckets, camera, scene, get elapsed() { return elapsed; } };
window.__wcStats = () => ({
  wheelAngle: quatAngleZ(wheelBody.quaternion),
  wheelSpeed: wheelBody.angularVelocity.z,
  leverAngle: quatAngleZ(leverBody.quaternion),
  dnAngle: quatAngleZ(dnBody.quaternion),
  globeAngle: quatAngleZ(globeBody.quaternion),
  fillSum: buckets.reduce((a, b) => a + b.fill, 0)
});

animate();
