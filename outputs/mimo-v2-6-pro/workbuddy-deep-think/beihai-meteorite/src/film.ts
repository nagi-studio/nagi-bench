import * as THREE from 'three';
import { FilmAudio } from './audio';

export interface FilmHandle { dispose(): void }

interface Shot { t0: number; t1: number; fx: number; fy: number; fz: number; tx: number; ty: number; tz: number }

const SHOTS: Shot[] = [
  // act 1 — study
  { t0: 0, t1: 60, fx: 7.2, fy: 3.4, fz: 8.2, tx: 0.4, ty: 1.6, tz: -1.2 },
  // act 2 — station briefing hall
  { t0: 60, t1: 140, fx: -6.2, fy: 3.1, fz: 7.4, tx: 0.2, ty: 1.9, tz: -2.2 },
  // act 3 — EVA assassination
  { t0: 140, t1: 206, fx: 13.5, fy: 4.2, fz: 15.5, tx: 1.2, ty: 1.4, tz: 0.4 },
  { t0: 206, t1: 242, fx: 5.2, fy: 1.9, fz: 6.4, tx: 0.2, ty: 1.5, tz: -0.4 },
  { t0: 242, t1: 262, fx: 9.5, fy: 3.2, fz: 10.2, tx: -1.5, ty: 1.2, tz: -1.5 },
  // act 4 — departure wide
  { t0: 262, t1: 310, fx: 24, fy: 9.5, fz: 30, tx: 0, ty: 2.2, tz: -2 }
];

function box(w: number, h: number, d: number, c: number | THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    typeof c === 'number' ? new THREE.MeshStandardMaterial({ color: c, roughness: 0.72, metalness: 0.12 }) : c
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

interface Figure { group: THREE.Group; armR: THREE.Group; armL: THREE.Group; head: THREE.Group }

function makeFigure(skin: number, suit: number, trim: number): Figure {
  const g = new THREE.Group();
  const torso = box(0.62, 0.86, 0.36, suit, 0, 1.12, 0);
  const pelvis = box(0.56, 0.28, 0.34, trim, 0, 0.62, 0);
  const head = new THREE.Group();
  head.add(box(0.42, 0.42, 0.42, skin, 0, 1.86, 0));
  head.add(box(0.46, 0.16, 0.46, trim, 0, 2.1, 0));
  const armR = new THREE.Group();
  armR.position.set(0.44, 1.42, 0);
  armR.add(box(0.2, 0.72, 0.2, suit, 0, -0.3, 0));
  armR.add(box(0.18, 0.18, 0.18, skin, 0, -0.72, 0));
  const armL = new THREE.Group();
  armL.position.set(-0.44, 1.42, 0);
  armL.add(box(0.2, 0.72, 0.2, suit, 0, -0.3, 0));
  armL.add(box(0.18, 0.18, 0.18, skin, 0, -0.72, 0));
  const legR = box(0.24, 0.62, 0.26, trim, 0.17, 0.31, 0);
  const legL = box(0.24, 0.62, 0.26, trim, -0.17, 0.31, 0);
  g.add(torso, pelvis, head, armR, armL, legR, legL);
  return { group: g, armR, armL, head };
}

function makeRifle(): THREE.Group {
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x2c3138, roughness: 0.42, metalness: 0.82 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x4c3520, roughness: 0.8, metalness: 0.05 });
  g.add(box(0.1, 0.12, 1.25, metal, 0, 0, 0.35));
  g.add(box(0.12, 0.22, 0.5, wood, 0, -0.1, -0.28));
  g.add(box(0.08, 0.1, 0.36, metal, 0, 0.1, 0.62));
  g.add(box(0.05, 0.05, 0.2, metal, 0, 0.16, 0.9));
  return g;
}

export function createFilm(container: HTMLElement, audio: FilmAudio, onTime: (t: number) => void): FilmHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(container.clientWidth || 960, container.clientHeight || 540);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07090f);
  const camera = new THREE.PerspectiveCamera(42, (container.clientWidth || 960) / (container.clientHeight || 540), 0.1, 400);

  scene.add(new THREE.HemisphereLight(0x7f96c8, 0x1c1610, 0.85));
  const keyLight = new THREE.DirectionalLight(0xffe6c4, 1.35);
  keyLight.position.set(10, 16, 12);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -18; keyLight.shadow.camera.right = 18;
  keyLight.shadow.camera.top = 18; keyLight.shadow.camera.bottom = -18;
  scene.add(keyLight);
  const coolFill = new THREE.DirectionalLight(0x6f96ff, 0.5);
  coolFill.position.set(-12, 8, -8);
  scene.add(coolFill);

  /* ================= act 1 : study ================= */
  const study = new THREE.Group();
  {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.82 });
    study.add(box(14, 0.3, 12, floorMat, 0, -0.15, -1));
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x8a6a48, roughness: 0.9 });
    study.add(box(14, 5, 0.3, wallMat, 0, 2.5, -7));
    study.add(box(0.3, 5, 12, wallMat, -7, 2.5, -1));
    // window with night sky
    study.add(box(3.6, 2.6, 0.2, 0x2a4a7a, -2.2, 2.6, -6.85));
    study.add(box(3.9, 0.18, 0.28, 0x4c3520, -2.2, 1.28, -6.8));
    study.add(box(3.9, 0.18, 0.28, 0x4c3520, -2.2, 3.94, -6.8));
    study.add(box(0.18, 2.9, 0.28, 0x4c3520, -4.15, 2.6, -6.8));
    study.add(box(0.18, 2.9, 0.28, 0x4c3520, -0.25, 2.6, -6.8));
    // snow outside
    const snowGeo = new THREE.BufferGeometry();
    const n = 220;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -6 + Math.random() * 8;
      pos[i * 3 + 1] = Math.random() * 7;
      pos[i * 3 + 2] = -7.2 - Math.random() * 2;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: 0xdce8ff, size: 0.07 }));
    study.add(snow);
    // desk + lamp + books
    study.add(box(3.2, 0.18, 1.4, 0x5c3d22, 1.8, 1.15, -4.6));
    for (const [lx, lz] of [[0.5, -4.1], [0.5, -5.1], [3.1, -4.1], [3.1, -5.1]] as const) {
      study.add(box(0.18, 1.15, 0.18, 0x4c3520, lx, 0.58, lz));
    }
    study.add(box(0.5, 0.08, 0.5, 0x222428, 2.6, 1.28, -4.7));
    study.add(box(0.1, 0.5, 0.1, 0x222428, 2.6, 1.55, -4.7));
    study.add(box(0.42, 0.2, 0.42, 0xffd98a, 2.6, 1.9, -4.7));
    const lampLight = new THREE.PointLight(0xffc878, 1.15, 9);
    lampLight.position.set(2.6, 2.1, -4.7);
    study.add(lampLight);
    for (let i = 0; i < 6; i++) {
      study.add(box(0.16, 0.5, 0.62, [0x7a2c22, 0x2c4a72, 0x2c5c34][i % 3], 0.55 + i * 0.2, 1.5, -5.6));
    }
  }
  const father = makeFigure(0xd8b08c, 0x55606e, 0x3c4652);
  father.group.position.set(-1.4, 0, -3.6);
  father.group.rotation.y = 0.65;
  father.armR.rotation.x = -0.9;
  father.armL.rotation.x = -1.2;
  study.add(father.group);
  const beihai1 = makeFigure(0xd8b08c, 0x27313e, 0x1a222c);
  beihai1.group.position.set(1.15, 0, -2.5);
  beihai1.group.rotation.y = -2.35;
  study.add(beihai1.group);
  scene.add(study);

  /* ================= act 2 : station hall ================= */
  const station = new THREE.Group();
  station.visible = false;
  {
    const metal = new THREE.MeshStandardMaterial({ color: 0x565e6a, roughness: 0.48, metalness: 0.72 });
    const metalDark = new THREE.MeshStandardMaterial({ color: 0x2e343c, roughness: 0.55, metalness: 0.7 });
    station.add(box(16, 0.3, 14, metalDark, 0, -0.15, -1));
    station.add(box(16, 6, 0.3, metal, 0, 3, -8));
    station.add(box(0.3, 6, 14, metal, -8, 3, -1));
    station.add(box(0.3, 6, 14, metal, 8, 3, -1));
    // big screen
    const screen = box(7.4, 3.4, 0.18, 0x16324e, 0, 3.1, -7.7);
    (screen.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x2f6fa8);
    (screen.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
    station.add(screen);
    for (let i = 0; i < 5; i++) station.add(box(2.2, 0.7, 1.1, metalDark, -5 + i * 2.5, 0.5, -3.2));
    // indicator lights
    for (let i = 0; i < 10; i++) {
      const led = box(0.12, 0.12, 0.12, i % 3 ? 0x36c96a : 0xd84a3c, -7.6 + (i % 5) * 0.4, 1.5 + Math.floor(i / 5) * 0.4, -7.4);
      (led.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(i % 3 ? 0x36c96a : 0xd84a3c);
      (led.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.1;
      station.add(led);
    }
  }
  const beihai2 = makeFigure(0xd8b08c, 0x27313e, 0x1a222c);
  beihai2.group.position.set(0.4, 0, -1.2);
  beihai2.group.rotation.y = Math.PI;
  station.add(beihai2.group);
  const speaker = makeFigure(0xd8b08c, 0x6e4a2c, 0x4c3220);
  speaker.group.position.set(-0.2, 0, -6.4);
  speaker.armR.rotation.z = -0.75;
  station.add(speaker.group);
  scene.add(station);

  /* ================= act 3 : EVA in vacuum ================= */
  const space = new THREE.Group();
  space.visible = false;
  {
    // stars
    const n = 900;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 90 + Math.random() * 160;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    space.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xcfe0ff, size: 0.55, sizeAttenuation: true })));
    // earth
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(26, 28, 20),
      new THREE.MeshStandardMaterial({ color: 0x2a5c9e, roughness: 0.82, metalness: 0.05, emissive: 0x0a2038, emissiveIntensity: 0.35 })
    );
    earth.position.set(-42, -26, -58);
    space.add(earth);
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(26.5, 24, 18),
      new THREE.MeshStandardMaterial({ color: 0xd8e4f2, transparent: true, opacity: 0.22, roughness: 1 })
    );
    clouds.position.copy(earth.position);
    space.add(clouds);
    // station hull
    const hull = new THREE.MeshStandardMaterial({ color: 0x8c929c, roughness: 0.42, metalness: 0.85 });
    space.add(box(3.2, 2.4, 16, hull, -4.6, -1.2, -4));
    space.add(box(8, 1.6, 2.6, hull, -2.2, -1, -10.4));
    for (let i = 0; i < 6; i++) space.add(box(0.5, 0.5, 0.5, 0x3a4048, -3.2 + (i % 3) * 0.9, 0.1, -8 + i * 2.2));
  }
  const beihai3 = makeFigure(0xf2f4f8, 0xe6e9ee, 0x9aa2ac);
  beihai3.group.position.set(1.2, 0, 0.4);
  beihai3.group.rotation.y = -1.15;
  const rifle = makeRifle();
  rifle.position.set(0.42, 1.28, 0.42);
  rifle.rotation.y = -0.25;
  beihai3.armR.rotation.x = -1.35;
  beihai3.armL.rotation.x = -1.15;
  beihai3.group.add(rifle);
  space.add(beihai3.group);
  const victim = makeFigure(0xd8b08c, 0x3a4048, 0x2c3238);
  victim.group.position.set(-2.6, 0.6, -2.2);
  victim.group.rotation.y = 1.9;
  space.add(victim.group);
  // muzzle flash
  const flash = box(0.34, 0.34, 0.7, 0xffe2a0, 1.72, 1.28, 1.22);
  (flash.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xffc46a);
  (flash.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.2;
  flash.visible = false;
  space.add(flash);
  scene.add(space);

  /* ================= act 4 : ship (reuses space bg) ================= */
  const ship = new THREE.Group();
  ship.visible = false;
  {
    const hull = new THREE.MeshStandardMaterial({ color: 0x7c828c, roughness: 0.4, metalness: 0.88 });
    ship.add(box(3.4, 3.2, 22, hull, 0, 2.4, -4));
    ship.add(box(6.2, 1.2, 8, hull, 0, 2.2, -12));
    ship.add(box(1.6, 1.6, 4, hull, 0, 4.6, -2));
    for (const ex of [-1.35, 1.35]) {
      const eng = box(1.35, 1.35, 2.2, 0x33383f, ex, 2.2, 8.2);
      (eng.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x2f6fd8);
      (eng.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.3;
      ship.add(eng);
      const glow = new THREE.PointLight(0x3f7fe8, 1.2, 14);
      glow.position.set(ex, 2.2, 9.2);
      ship.add(glow);
    }
    for (let i = 0; i < 8; i++) ship.add(box(0.28, 0.28, 0.12, 0xffd98a, -2.4 + i * 0.7, 3.2, 4.05));
  }
  scene.add(ship);

  /* ================= runtime ================= */
  const clock = new THREE.Clock();
  let time = 0;
  let disposed = false;
  const fired = { shot: false, impact: false, alarm: false, rumble: false };

  function pickShot(t: number): Shot {
    for (const s of SHOTS) if (t >= s.t0 && t <= s.t1) return s;
    return SHOTS[SHOTS.length - 1];
  }

  function tick(): void {
    if (disposed) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    time = Math.min(time + dt, 310);
    const t = time;

    // act visibility
    study.visible = t < 60;
    station.visible = t >= 60 && t < 140;
    space.visible = t >= 140 && t < 262;
    ship.visible = t >= 262;

    // camera with slow drift inside each shot
    const s = pickShot(t);
    const u = Math.min(1, Math.max(0, (t - s.t0) / Math.max(0.001, s.t1 - s.t0)));
    const drift = Math.sin(t * 0.11) * 0.35;
    camera.position.set(
      s.fx + (s.fx - s.tx) * (-0.12 * u) + drift,
      s.fy + (s.fy - s.ty) * (-0.1 * u) + Math.sin(t * 0.07) * 0.18,
      s.fz + (s.fz - s.tz) * (-0.14 * u)
    );
    camera.lookAt(s.tx, s.ty, s.tz);

    // performances
    if (study.visible) {
      beihai1.group.position.y = Math.sin(t * 1.2) * 0.02;
      father.armR.rotation.x = -0.9 + Math.sin(t * 0.6) * 0.12;
    }
    if (station.visible) {
      beihai2.head.rotation.y = Math.sin(t * 0.35) * 0.22;
      speaker.armR.rotation.z = -0.75 + Math.sin(t * 1.1) * 0.28;
    }
    if (space.visible) {
      beihai3.group.rotation.y = -1.15 + Math.sin(t * 0.4) * 0.03;
      // after the shot the victim slowly tumbles away (performance, like the camera)
      if (t > 211) {
        const k = Math.min(1, (t - 211) / 40);
        victim.group.position.x = -2.6 - k * 6.5;
        victim.group.position.y = 0.6 + k * 3.2;
        victim.group.rotation.x = k * 2.4;
        victim.group.rotation.z = k * 1.7;
      }
      // recoil + muzzle flash
      const shotT = 210.6;
      flash.visible = t > shotT && t < shotT + 0.16;
      if (flash.visible) {
        const sc = 1 + (shotT + 0.16 - t) * 6;
        flash.scale.setScalar(sc);
      }
      beihai3.group.position.x = 1.2 + (t > shotT && t < shotT + 0.5 ? Math.sin((t - shotT) * 18) * 0.05 * Math.exp(-(t - shotT) * 6) : 0);
    }
    if (ship.visible) {
      ship.position.y = 2.2 + Math.sin(t * 0.22) * 0.25;
    }

    // audio events
    audio.setPhase(t);
    audio.update(dt);
    if (t > 86 && t < 86.1) audio.radio();
    if (t > 148 && t < 148.1) audio.radio();
    if (t > 210.6 && !fired.shot) { fired.shot = true; audio.muffledShot(); }
    if (t > 222 && !fired.impact) { fired.impact = true; audio.distantImpact(); }
    if (t > 246 && !fired.alarm) { fired.alarm = true; audio.alarm(); audio.radio(); }
    if (t > 281 && !fired.rumble) { fired.rumble = true; audio.engineRumble(); }

    onTime(t);
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
