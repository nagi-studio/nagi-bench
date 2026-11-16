import * as THREE from 'three';
import { PhysicsWorld, DropletPool, collideDroplet, collideSlab, type Body } from './physics';
import { SoundScape } from './audio';

export interface SceneHandle { dispose(): void }

interface CamKey { t: number; px: number; py: number; pz: number; tx: number; ty: number; tz: number }

const CAM_KEYS: CamKey[] = [
  { t: 0, px: 14, py: 11, pz: 19, tx: 0, ty: 6.5, tz: 0 },
  { t: 4.5, px: 8.5, py: 13.5, pz: 11, tx: 2.6, ty: 11.2, tz: 0 },
  { t: 9, px: 5.6, py: 9.4, pz: 8.6, tx: 2.6, ty: 8.6, tz: 0 },
  { t: 13.5, px: 3.2, py: 6.8, pz: 7.2, tx: 0.2, ty: 6.1, tz: 0 },
  { t: 18, px: 6.4, py: 5.2, pz: 10.4, tx: 0.2, ty: 3.2, tz: 0 },
  { t: 22.5, px: -1.6, py: 8.4, pz: 11.6, tx: -4.2, ty: 8.2, tz: 0 },
  { t: 26.5, px: -3.2, py: 12.2, pz: 10.4, tx: -4.2, ty: 11.2, tz: 0 },
  { t: 30, px: 8.2, py: 5.4, pz: 9.2, tx: 5.2, ty: 4.4, tz: 0 },
  { t: 34, px: 13, py: 10.5, pz: 17, tx: 0, ty: 6.5, tz: 0 }
];

const CAPTION_TIMES = [0, 4.2, 8.6, 12.8, 17.2, 21.8, 26.2, 30.4];
export function captionIndexAt(t: number): number {
  let idx = 0;
  for (let i = 0; i < CAPTION_TIMES.length; i++) if (t >= CAPTION_TIMES[i]) idx = i;
  return idx;
}
export const FILM_LENGTH = 34;

export function createScene(container: HTMLElement, sound: SoundScape, onCaption: (i: number) => void): SceneHandle {
  /* ---------------- renderer & scene ---------------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(container.clientWidth || 960, container.clientHeight || 540);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a2238);
  scene.fog = new THREE.Fog(0x1a2238, 26, 78);

  const camera = new THREE.PerspectiveCamera(46, (container.clientWidth || 960) / (container.clientHeight || 540), 0.1, 200);
  camera.position.set(14, 11, 19);

  const hemi = new THREE.HemisphereLight(0x8fb4ff, 0x2c2418, 1.18);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe2b0, 1.95);
  key.position.set(14, 22, 12);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -18; key.shadow.camera.right = 18;
  key.shadow.camera.top = 22; key.shadow.camera.bottom = -6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fa8ff, 0.55);
  rim.position.set(-12, 10, -10);
  scene.add(rim);

  /* ---------------- materials ---------------- */
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 0.8, metalness: 0.05 });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x5c3c20, roughness: 0.85, metalness: 0.05 });
  const woodLight = new THREE.MeshStandardMaterial({ color: 0xa97a48, roughness: 0.72, metalness: 0.06 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x9c7b3f, roughness: 0.42, metalness: 0.85 });
  const bronzeDark = new THREE.MeshStandardMaterial({ color: 0x6e5426, roughness: 0.5, metalness: 0.82 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x3f5878, roughness: 0.55, metalness: 0.12 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x5c6472, roughness: 0.9, metalness: 0.04 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x2f86d8, roughness: 0.18, metalness: 0.15, transparent: true, opacity: 0.82 });
  const dropMat = new THREE.MeshStandardMaterial({ color: 0x63b8f2, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.92 });
  const glowMat = new THREE.MeshStandardMaterial({ color: 0xffd789, emissive: 0xff9d3c, emissiveIntensity: 0.9, roughness: 0.5 });

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
    const ms = new THREE.Mesh(g, m);
    ms.position.set(x, y, z);
    ms.castShadow = true;
    ms.receiveShadow = true;
    return ms;
  };
  const box = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh =>
    mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
  const cyl = (r1: number, r2: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 24): THREE.Mesh =>
    mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m, x, y, z);

  /* ---------------- ground & tower ---------------- */
  const ground = mesh(new THREE.CylinderGeometry(30, 30, 0.8, 48), stone, 0, -0.4, 0);
  scene.add(ground);
  const waterPool = mesh(new THREE.CylinderGeometry(26, 26, 0.24, 48), waterMat, 0, 0.1, 0);
  scene.add(waterPool);

  const tower = new THREE.Group();
  // three-tier pagoda skeleton
  for (const [w, y] of [[16, 0.4], [12.4, 5.2], [9, 9.6]] as const) {
    tower.add(box(w, 0.6, w * 0.72, woodDark, 0, y, 0));
    tower.add(box(w * 0.92, 0.34, w * 0.66, woodLight, 0, y + 0.55, 0));
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      tower.add(box(0.72, 4.6, 0.72, wood, sx * w * 0.42, y + 2.6, sz * w * 0.32));
    }
    // roof
    tower.add(cyl(w * 0.62, w * 0.34, 1.5, woodDark, 0, y + 5.1, 0, 4));
    tower.add(box(w * 1.06, 0.28, w * 0.78, woodDark, 0, y + 4.35, 0));
  }
  tower.add(cyl(0.5, 0.16, 3.4, bronze, 0, 16.6, 0, 12));
  scene.add(tower);

  /* ---------------- physics world ---------------- */
  const world = new PhysicsWorld();
  const drops = new DropletPool(world, 70);

  // tipping bucket (受水壶)
  const bucketPivot = { x: 2.6, y: 9.2 };
  const bucket: Body = world.addBody({ x: bucketPivot.x, y: bucketPivot.y, radius: 1, mass: 1.4, inertia: 1.6, label: 'bucket' });
  bucket.angleLimit = { min: -1.15, max: 0.42 };
  world.pin(bucket, bucketPivot.x, bucketPivot.y, 0.99);

  // escape wheel (擒纵轮)
  const escapeWheel: Body = world.addBody({ x: 0.2, y: 6.15, radius: 1.15, mass: 3, inertia: 4.2, label: 'escape' });
  world.pin(escapeWheel, 0.2, 6.15, 0.99);
  const pawl: Body = world.addBody({ x: 1.35, y: 7.05, radius: 0.16, mass: 0.3, inertia: 0.05, label: 'pawl' });
  pawl.angleLimit = { min: -0.35, max: 0.5 };
  world.pin(pawl, 1.35, 7.05, 0.97);
  world.addRatchet(escapeWheel, pawl, 12, 1);

  // main drive wheel (枢轮)
  const driveWheel: Body = world.addBody({ x: 0.2, y: 2.75, radius: 2.5, mass: 14, inertia: 36, label: 'drive' });
  world.pin(driveWheel, 0.2, 2.75, 0.99);
  world.addGear(escapeWheel, driveWheel, -0.42, 0.85);

  // celestial globe shaft (浑象) & armillary shaft (浑仪)
  const globeShaft: Body = world.addBody({ x: -4.4, y: 7.4, radius: 1.55, mass: 8, inertia: 12, label: 'globe' });
  world.pin(globeShaft, -4.4, 7.4, 0.99);
  world.addGear(driveWheel, globeShaft, -0.24, 0.85);

  const armillaryShaft: Body = world.addBody({ x: -4.4, y: 11.6, radius: 1.15, mass: 5, inertia: 6, label: 'armillary' });
  world.pin(armillaryShaft, -4.4, 11.6, 0.99);
  world.addGear(globeShaft, armillaryShaft, -0.52, 0.85);

  // hour wheel with cam (时轮凸轮)
  const hourWheel: Body = world.addBody({ x: 4.15, y: 3.35, radius: 2.1, mass: 10, inertia: 18, label: 'hour' });
  world.pin(hourWheel, 4.15, 3.35, 0.99);
  world.addGear(driveWheel, hourWheel, -0.115, 0.85);

  // hammer / figure arm (木人手臂) — lifted by cam contact, released by gravity
  const hammer: Body = world.addBody({ x: 6.15, y: 4.55, radius: 0.22, mass: 0.9, inertia: 0.55, label: 'hammer' });
  hammer.angleLimit = { min: -1.15, max: 0.72 };
  world.pin(hammer, 6.15, 4.55, 0.99);

  /* ---------------- mechanism visuals ---------------- */
  const bucketGroup = new THREE.Group();
  {
    const bowl = mesh(new THREE.CylinderGeometry(0.92, 0.62, 1.25, 18, 1, true), ceramic);
    bowl.rotation.x = Math.PI / 2;
    bucketGroup.add(bowl);
    const lip = mesh(new THREE.TorusGeometry(0.92, 0.09, 8, 20), bronze);
    lip.position.z = 0.62;
    bucketGroup.add(lip);
    const base = mesh(new THREE.CircleGeometry(0.62, 18), ceramic);
    base.position.z = -0.62;
    bucketGroup.add(base);
    const counter = box(0.5, 0.5, 0.5, bronzeDark, -1.25, 0, 0);
    bucketGroup.add(counter);
  }
  bucketGroup.position.set(bucketPivot.x, bucketPivot.y, 1.9);
  scene.add(bucketGroup);
  const bucketWater = mesh(new THREE.CylinderGeometry(0.72, 0.55, 0.5, 16), waterMat, 0, 0, 0);
  bucketWater.rotation.x = Math.PI / 2;
  bucketGroup.add(bucketWater);

  function makeWheel(radius: number, teeth: number, thickness: number, mat: THREE.Material): THREE.Group {
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(radius, radius, thickness, 32), mat));
    const rim = mesh(new THREE.TorusGeometry(radius, thickness * 0.42, 8, 32), mat);
    rim.rotation.x = Math.PI / 2;
    g.add(rim);
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const t = box(0.3, radius * 0.32, thickness * 0.95, mat, Math.cos(a) * radius, Math.sin(a) * radius, 0);
      t.rotation.z = a;
      g.add(t);
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const spoke = box(radius * 1.7, 0.18, thickness * 0.55, mat, 0, 0, 0);
      spoke.rotation.z = a;
      g.add(spoke);
    }
    g.rotation.x = Math.PI / 2;
    return g;
  }

  const escapeGroup = makeWheel(1.15, 12, 0.34, bronze);
  escapeGroup.position.set(0.2, 6.15, 1.35);
  scene.add(escapeGroup);
  const driveGroup = makeWheel(2.5, 18, 0.6, woodLight);
  driveGroup.position.set(0.2, 2.75, 1.5);
  scene.add(driveGroup);
  // drive wheel buckets (枢轮水斗)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const bkt = box(0.85, 0.62, 0.72, ceramic, Math.cos(a) * 2.28, Math.sin(a) * 2.28, 1.5);
    bkt.rotation.z = a;
    driveGroup.add(bkt);
  }
  const globeGroup = makeWheel(1.55, 14, 0.5, bronzeDark);
  globeGroup.position.set(-4.4, 7.4, 1.2);
  scene.add(globeGroup);
  const globeSphere = mesh(new THREE.SphereGeometry(1.28, 22, 16), new THREE.MeshStandardMaterial({ color: 0x2c4a74, roughness: 0.6, metalness: 0.3 }), -4.4, 7.4, 1.2);
  scene.add(globeSphere);
  const armGroup = new THREE.Group();
  {
    const ring1 = mesh(new THREE.TorusGeometry(1.05, 0.07, 8, 26), bronze);
    const ring2 = mesh(new THREE.TorusGeometry(1.05, 0.07, 8, 26), bronze);
    ring2.rotation.y = Math.PI / 2;
    const ring3 = mesh(new THREE.TorusGeometry(1.05, 0.07, 8, 26), bronze);
    ring3.rotation.x = Math.PI / 2;
    armGroup.add(ring1, ring2, ring3);
    armGroup.add(mesh(new THREE.SphereGeometry(0.22, 12, 10), glowMat));
  }
  armGroup.position.set(-4.4, 11.6, 1.1);
  scene.add(armGroup);

  const hourGroup = makeWheel(2.1, 20, 0.46, bronzeDark);
  hourGroup.position.set(4.15, 3.35, 1.1);
  scene.add(hourGroup);
  // cam lobe
  const camLobe = mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.34, 16), bronze, 0.95, 0, 0);
  camLobe.rotation.x = Math.PI / 2;
  hourGroup.add(camLobe);

  // wooden figure + hammer arm (报时木人)
  const figure = new THREE.Group();
  figure.add(box(0.85, 1.5, 0.6, woodLight, 6.15, 2.6, 0.4));
  figure.add(mesh(new THREE.SphereGeometry(0.42, 14, 12), woodLight, 6.15, 3.72, 0.4));
  figure.add(box(0.62, 1.2, 0.5, woodDark, 6.15, 1.35, 0.4));
  scene.add(figure);
  const hammerGroup = new THREE.Group();
  {
    const arm = box(1.35, 0.26, 0.26, woodLight, 0.62, 0, 0);
    const malletHead = cyl(0.34, 0.34, 0.5, woodDark, 1.38, 0, 0, 12);
    malletHead.rotation.z = Math.PI / 2;
    hammerGroup.add(arm, malletHead);
  }
  hammerGroup.position.set(6.15, 4.55, 0.4);
  scene.add(hammerGroup);
  // bell (钟)
  const bell = new THREE.Group();
  bell.add(mesh(new THREE.CylinderGeometry(0.85, 1.15, 1.35, 18, 1, true), bronze));
  bell.add(mesh(new THREE.TorusGeometry(1.15, 0.12, 8, 20), bronzeDark));
  bell.add(box(0.3, 0.3, 0.3, bronzeDark, 0, 0.85, 0));
  bell.position.set(7.9, 4.9, 0.4);
  scene.add(bell);

  /* ---------------- water system visuals ---------------- */
  const reservoir = new THREE.Group();
  reservoir.add(box(2.6, 1.5, 2.2, ceramic, 2.6, 13.2, 0));
  reservoir.add(box(2.2, 0.35, 1.8, waterMat, 2.6, 13.95, 0));
  reservoir.add(box(0.42, 1.2, 0.42, bronze, 2.6, 12.15, 0));
  const spout = box(0.5, 0.32, 0.32, bronze, 2.6, 11.45, 0);
  reservoir.add(spout);
  scene.add(reservoir);
  // drain channel
  scene.add(box(5.2, 0.32, 1.4, woodDark, 4.6, 0.75, 1.9));
  const drainPool = mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.3, 18), waterMat, 6.9, 0.65, 1.9);
  scene.add(drainPool);

  /* ---------------- droplet visuals ---------------- */
  const dropGeo = new THREE.SphereGeometry(0.11, 8, 6);
  const dropMeshes: THREE.InstancedMesh = new THREE.InstancedMesh(dropGeo, dropMat, 70);
  dropMeshes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(dropMeshes);
  const dummy = new THREE.Object3D();

  /* ---------------- runtime state ---------------- */
  let fill = 0.25;                 // water inside tipping bucket (drives mass & torque)
  let tipped = false;
  let filmTime = 0;
  let lastCaption = -1;
  let lastTickSound = 0;
  let lastCreak = 0;
  let lastBell = -10;
  let spawnAcc = 0;
  let disposed = false;

  function smoothstep(a: number, b: number, x: number): number {
    const k = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return k * k * (3 - 2 * k);
  }

  function updateCamera(t: number): void {
    let k0 = CAM_KEYS[0], k1 = CAM_KEYS[CAM_KEYS.length - 1];
    for (let i = 0; i < CAM_KEYS.length - 1; i++) {
      if (t >= CAM_KEYS[i].t && t <= CAM_KEYS[i + 1].t) { k0 = CAM_KEYS[i]; k1 = CAM_KEYS[i + 1]; break; }
    }
    const u = smoothstep(k0.t, k1.t, t);
    camera.position.set(
      k0.px + (k1.px - k0.px) * u,
      k0.py + (k1.py - k0.py) * u,
      k0.pz + (k1.pz - k0.pz) * u
    );
    camera.lookAt(
      k0.tx + (k1.tx - k0.tx) * u,
      k0.ty + (k1.ty - k0.ty) * u,
      k0.tz + (k1.tz - k0.tz) * u
    );
  }

  /* ---------------- main loop ---------------- */
  const clock = new THREE.Clock();
  function tick(): void {
    if (disposed) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    filmTime += dt;
    const t = filmTime;

    // captions
    const ci = captionIndexAt(t);
    if (ci !== lastCaption) { lastCaption = ci; onCaption(ci); }

    // --- water inflow: physics droplets from the spout ---
    spawnAcc += dt * 11;
    while (spawnAcc >= 1) {
      spawnAcc -= 1;
      drops.spawn(2.6 + (Math.random() - 0.5) * 0.12, 11.15, (Math.random() - 0.5) * 0.2, -1.6);
    }
    for (const d of drops.drops) {
      // funnel lip + channel floor
      collideSlab(d, 1.55, 8.15, 3.65, 8.45);
      collideSlab(d, 1.35, 7.2, 1.65, 8.5);
      collideSlab(d, 3.55, 7.2, 3.85, 8.5);
      collideSlab(d, 2.1, 0.55, 7.3, 0.95);
      collideDroplet(d, 6.9, 0.85, 1.5, 0.1);
      // collection: drops entering the bucket mouth add to fill
      const b = d.body;
      if (Math.abs(b.x - bucketPivot.x) < 1.0 && Math.abs(b.y - bucketPivot.y) < 1.0 && Math.abs(b.vx) < 6) {
        const bi = world.bodies.indexOf(b);
        if (bi >= 0) world.bodies.splice(bi, 1);
        const di = drops.drops.indexOf(d);
        if (di >= 0) drops.drops.splice(di, 1);
        fill = Math.min(1, fill + 0.055);
      }
    }
    drops.reap(-2);

    // --- tipping bucket dynamics: mass + gravity torque + return spring ---
    bucket.mass = 1.15 + fill * 6.2;
    bucket.invMass = 1 / bucket.mass;
    bucket.inertia = 1.35 + fill * 2.1;
    bucket.invInertia = 1 / bucket.inertia;
    const comOffset = 0.62;
    world.applyTorque(bucket, -bucket.mass * 9.81 * comOffset * Math.cos(bucket.angle) * 0.42);
    // counterweight spring back toward rest
    world.applyTorque(bucket, (0.32 - bucket.angle) * 3.4);
    // fluid damping
    bucket.va *= Math.exp(-2.4 * dt);

    if (!tipped && bucket.angle < -0.82) {
      tipped = true;
      fill = 0.02;
      sound.splash();
      // escapement release: one-tooth advance impulse (physics torque)
      world.applyTorque(escapeWheel, 46);
      if (t - lastTickSound > 0.2) { sound.tick(); lastTickSound = t; }
    }
    if (tipped && bucket.angle > 0.12) tipped = false;

    // --- cam contact on hammer (penalty force from cam profile) ---
    const camAngle = hourWheel.angle;
    const camR = 0.62 + 0.5 * Math.max(0, Math.cos(camAngle * 3 - 0.6));
    const hx = hammer.x - hourWheel.x, hy = hammer.y - hourWheel.y;
    const dist = Math.hypot(hx, hy);
    const target = hourWheel.y + camR + 0.28;
    const contact = hammer.y - target;
    if (contact < 0 && dist < 3.4) {
      // cam lifting the hammer arm
      world.applyTorque(hammer, (-contact) * 34);
      hammer.va *= 0.92;
    } else {
      world.applyTorque(hammer, -3.2); // gravity drop on release
    }
    // strike detection: hammer falling fast downward
    if (hammer.va < -1.9 && t - lastBell > 3.2 && t > 24) {
      lastBell = t;
      sound.bell();
    }

    // ambient mechanism sounds
    if (Math.abs(driveWheel.va) > 0.045 && t - lastCreak > 1.7) {
      lastCreak = t;
      sound.creak();
    }
    sound.setTrickle(0.05 + Math.sin(t * 1.7) * 0.012);

    // --- step physics (all mechanism motion originates here) ---
    world.step(Math.min(dt, 0.033));

    // --- copy physics transforms to visuals ---
    bucketGroup.rotation.z = bucket.angle;
    bucketGroup.position.set(bucket.x, bucket.y, 1.9);
    bucketWater.scale.setScalar(0.25 + fill * 0.75);
    bucketWater.material = waterMat;
    bucketWater.visible = fill > 0.03;

    escapeGroup.rotation.y = -escapeWheel.angle;   // wheels rendered with x=PI/2 spin about z
    driveGroup.rotation.y = -driveWheel.angle;
    globeGroup.rotation.y = -globeShaft.angle;
    globeSphere.rotation.y = -globeShaft.angle * 0.6;
    armGroup.rotation.y = -armillaryShaft.angle;
    armGroup.rotation.x = Math.sin(armillaryShaft.angle * 0.5) * 0.35;
    hourGroup.rotation.y = -hourWheel.angle;
    hammerGroup.rotation.z = hammer.angle;

    // droplets to instanced mesh
    let di = 0;
    for (const d of drops.drops) {
      if (di >= 70) break;
      dummy.position.set(d.body.x, d.body.y, 1.9);
      dummy.updateMatrix();
      dropMeshes.setMatrixAt(di++, dummy.matrix);
    }
    dropMeshes.count = di;
    dropMeshes.instanceMatrix.needsUpdate = true;

    updateCamera(t);
    renderer.render(scene, camera);
    if (!disposed) requestAnimationFrame(tick);
  }

  function onResize(): void {
    const w = container.clientWidth || 960;
    const h = container.clientHeight || 540;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
  onCaption(0);
  tick();

  return {
    dispose(): void {
      disposed = true;
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    }
  };
}
