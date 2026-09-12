import * as THREE from "three";
import { box, emissive, mat, makeHuman, type Human } from "../voxel";
import { Puff } from "../particles";
import type { SceneHandle } from "./collector";

function env(t: number, a: number, b: number): number {
  return THREE.MathUtils.smoothstep(t, a, b);
}

const CUTS: Array<[number, number]> = [[85, 88], [92, 95], [100, 103], [106, 109]];

export function buildWorkshop(): SceneHandle {
  const group = new THREE.Group();

  /* ---------------- room ---------------- */
  const floor = box(16, 0.2, 12, 0x2c3136, { y: -0.1, shadow: false });
  floor.receiveShadow = true;
  group.add(floor);
  const wallMat = mat(0x39404a, 0.9);
  for (const [w, h, d, x, y, z] of [
    [16, 5, 0.3, 0, 2.5, -5.85],
    [0.3, 5, 12, -7.85, 2.5, 0],
    [0.3, 5, 12, 7.85, 2.5, 0],
  ] as const) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    m.position.set(x, y, z); m.receiveShadow = true;
    group.add(m);
  }
  group.add(box(16, 0.3, 12, 0x22262b, { y: 5.05, shadow: false }));
  // high windows with cold night light
  for (let i = 0; i < 3; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.06), emissive(0x9ab8d8, 0.5));
    win.position.set(-4 + i * 4, 3.8, -5.68);
    group.add(win);
  }
  // hanging industrial lamps (only one lit — after hours)
  for (let i = 0; i < 3; i++) {
    group.add(box(0.04, 1.2, 0.04, 0x14171a, { x: -4 + i * 4, y: 4.4, z: 0, shadow: false }));
    const shade = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.25, 0.7),
      i === 1 ? emissive(0xd8ecda, 1.8) : mat(0x2c3236, 0.7),
    );
    shade.position.set(-4 + i * 4, 3.75, 0);
    group.add(shade);
  }
  const key = new THREE.PointLight(0xd8ecda, 30, 16, 2);
  key.position.set(0, 3.6, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.004;
  group.add(key);
  group.add(new THREE.AmbientLight(0x36414f, 0.7));

  /* ---------------- CNC machine ---------------- */
  const cnc = new THREE.Group();
  cnc.position.set(-1.6, 0, -1.2);
  cnc.add(box(3.2, 0.9, 1.6, 0x46525e, { y: 0.45 })); // base
  cnc.add(box(3.2, 1.5, 0.35, 0x39434d, { y: 1.6, z: -0.62 })); // back panel
  cnc.add(box(0.35, 1.5, 1.6, 0x39434d, { x: -1.42, y: 1.6 })); // left wall
  cnc.add(box(0.35, 1.5, 1.6, 0x39434d, { x: 1.42, y: 1.6 })); // right wall
  cnc.add(box(3.2, 0.3, 1.6, 0x2e363e, { y: 2.5 })); // top
  // window door (slides open)
  const doorGlass = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.3, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x9ab4c8, transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0.3 }),
  );
  doorGlass.position.set(0, 1.6, 0.78);
  cnc.add(doorGlass);
  // spindle + chuck
  const spindle = new THREE.Group();
  spindle.position.set(-0.85, 1.55, 0);
  const chuck = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.5), mat(0x8a929c, 0.35, 0.9));
  chuck.castShadow = true;
  spindle.add(chuck);
  // workpiece (rotating rod being cut)
  const workpiece = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.55), mat(0x3b3f45, 0.45, 0.9));
  workpiece.position.z = 0.5;
  workpiece.castShadow = true;
  spindle.add(workpiece);
  cnc.add(spindle);
  // tool post
  const tool = new THREE.Group();
  tool.position.set(0.55, 1.3, 0.1);
  tool.add(box(0.5, 0.35, 0.4, 0x59636d, { y: 0.1 }));
  tool.add(box(0.08, 0.3, 0.08, 0xb8c0c8, { x: -0.28, y: 0.35 }));
  cnc.add(tool);
  // interior work light
  const cncLight = new THREE.PointLight(0xf0f6ff, 3.5, 4, 2);
  cncLight.position.set(-0.3, 2.1, 0.3);
  cnc.add(cncLight);
  // control panel
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.08), emissive(0x77e0c8, 0.9));
  panel.position.set(1.42, 1.7, 0.85);
  cnc.add(panel);
  group.add(cnc);

  /* ---------------- bench with stones / rods / segments ---------------- */
  const bench = new THREE.Group();
  bench.position.set(2.6, 0, 0.8);
  bench.add(box(2.6, 0.09, 1.1, 0x4f565e, { y: 0.9 }));
  for (const [lx, lz] of [[-1.2, -0.45], [1.2, -0.45], [-1.2, 0.45], [1.2, 0.45]] as const) {
    bench.add(box(0.09, 0.9, 0.09, 0x3a4046, { x: lx, y: 0.45, z: lz }));
  }
  group.add(bench);

  const ironMat = mat(0x3b3f45, 0.45, 0.9);
  // three raw stones on bench
  const stones: THREE.Mesh[] = [];
  [[-0.8, -0.2], [-0.45, 0.15], [-0.7, 0.35]].forEach(([sx, sz], i) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.18), ironMat);
    s.position.set(sx, 1.03, sz);
    s.rotation.y = i * 0.8;
    s.castShadow = true;
    bench.add(s);
    stones.push(s);
  });
  // cut rods (appear after cuts 1..3)
  const rods: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.5), mat(0x54585e, 0.35, 0.95));
    r.position.set(0.15 + (i % 3) * 0.14, 0.98 + Math.floor(i / 3) * 0.07, -0.25);
    r.castShadow = true;
    r.visible = false;
    bench.add(r);
    rods.push(r);
  }
  // tray with 36 segments
  const tray = new THREE.Group();
  tray.position.set(0.75, 0.945, 0.25);
  tray.add(box(0.7, 0.04, 0.55, 0x30353a, { y: 0.02 }));
  const segs: THREE.Mesh[] = [];
  for (let i = 0; i < 36; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.09), mat(0x5c6066, 0.3, 0.95));
    s.position.set(-0.28 + (i % 9) * 0.07, 0.065, -0.2 + Math.floor(i / 9) * 0.13);
    s.castShadow = true;
    tray.add(s);
    segs.push(s);
  }
  tray.visible = false;
  bench.add(tray);

  /* ---------------- sparks ---------------- */
  const sparks = new Puff(90, 0.09, 42);
  group.add(sparks.points);
  const sparkLight = new THREE.PointLight(0xffa040, 0, 5, 2);
  sparkLight.position.set(-2.1, 1.6, -0.6);
  group.add(sparkLight);

  /* ---------------- character ---------------- */
  const zhang = makeHuman({ face: "stern", shirt: 0x3d564b, sleeve: 0x3d564b, pants: 0x23282e, hair: "#1a1a1a", skin: "#c98f66" });
  group.add(zhang.group);

  function idle(h: Human, t: number): void {
    h.armL.rotation.set(0.05 * Math.sin(t * 0.8), 0, 0.07);
    h.armR.rotation.set(-0.05 * Math.sin(t * 0.8), 0, -0.07);
  }

  const SPARK_AT = new THREE.Vector3(-2.32, 1.55, -0.65);
  let lastCut = -1;

  function frame(t: number): void {
    /* machine state */
    let cutting = false;
    let cutIndex = -1;
    CUTS.forEach(([a, b], i) => { if (t >= a && t <= b) { cutting = true; cutIndex = i; } });

    if (cutting && cutIndex !== lastCut) {
      lastCut = cutIndex;
      sparks.burst({
        at: SPARK_AT, t0: t, life: CUTS[cutIndex][1] - CUTS[cutIndex][0] + 0.6,
        dir: new THREE.Vector3(-0.5, 0.7, 0.6), cone: 0.55,
        speed: 3.4, drag: 1.4, color1: 0xffd080, color2: 0xff5010,
      });
    }
    sparks.update(t, -1.5);
    sparkLight.intensity = cutting ? 14 + Math.sin(t * 47) * 6 : 0;

    // spindle spin: ramp up at 84, stop at 110.8 — pure function of t
    const spin = env(t, 84, 85.2) * (1 - env(t, 109.5, 110.8));
    const spinT = THREE.MathUtils.clamp(t, 84, 110.8) - 84;
    spindle.rotation.z = spinT * 38;

    // tool advance during cuts
    let toolIn = 0;
    CUTS.forEach(([a, b]) => { toolIn = Math.max(toolIn, env(t, a, a + 1.2) * (1 - env(t, b - 0.4, b + 0.6))); });
    tool.position.x = 0.55 - toolIn * 0.75;

    // door glass slides shut at 84, opens at 110.5
    const doorK = env(t, 83.2, 84.2) * (1 - env(t, 110.5, 111.5));
    doorGlass.position.x = (1 - doorK) * 1.4;

    // panel glow pulses while running
    (panel.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9 + spin * (0.5 + Math.sin(t * 6) * 0.3);

    /* stones -> rods -> segments */
    stones.forEach((s, i) => { s.visible = t < CUTS[Math.min(i, 2)][1] - 0.2; });
    rods.forEach((r, i) => {
      const appear = CUTS[Math.min(Math.floor(i / 2), 2)][1] + 0.3;
      r.visible = t >= appear && t < 109.2;
    });
    tray.visible = t >= 110.2;
    segs.forEach((s, i) => {
      const a = 110.3 + i * 0.09;
      const k = env(t, a, a + 0.25);
      s.scale.setScalar(Math.max(k, 0.001));
    });

    /* Zhang choreography */
    if (t < 84) {
      // placing stone into chuck
      const k = env(t, 79.5, 83.5);
      zhang.group.position.set(-1.15, 0, 0.35);
      zhang.group.rotation.y = Math.PI * 0.94;
      zhang.armR.rotation.set(-0.5 - k * 0.75, 0, -0.2);
      zhang.armL.rotation.set(-0.3, 0, 0.15);
      zhang.head.rotation.x = 0.3 * k;
    } else if (t < 110) {
      // supervising at panel, occasional glance
      zhang.group.position.set(0.35, 0, 0.75);
      zhang.group.rotation.y = Math.PI * 0.88;
      idle(zhang, t);
      const reach = env(t, 84, 84.6) * (1 - env(t, 85.2, 85.8));
      zhang.armR.rotation.x = -0.9 * reach + zhang.armR.rotation.x * (1 - reach);
      zhang.head.rotation.x = 0.15 + (cutting ? 0.1 : 0);
      zhang.head.rotation.y = Math.sin(t * 0.25) * 0.12;
    } else if (t < 114) {
      // opens door, takes tray -> moves toward bench
      const k = env(t, 110.5, 113);
      zhang.group.position.lerpVectors(new THREE.Vector3(-0.9, 0, 0.4), new THREE.Vector3(2.5, 0, 1.7), k);
      zhang.group.rotation.y = Math.PI * (0.94 + k * 0.1);
      if (k > 0 && k < 1) {
        zhang.legL.rotation.x = Math.sin(t * 6.5) * 0.5;
        zhang.legR.rotation.x = -Math.sin(t * 6.5) * 0.5;
      }
      zhang.armL.rotation.set(-0.75, 0, 0.2);
      zhang.armR.rotation.set(-0.75, 0, -0.2);
    } else {
      // collects debris + removes tool bit (114-118)
      zhang.group.position.set(2.5, 0, 1.7);
      zhang.group.rotation.y = Math.PI;
      const bend = 0.5 + Math.sin(t * 1.4) * 0.25;
      zhang.armL.rotation.set(-bend, 0, 0.25);
      zhang.armR.rotation.set(-bend * 0.8, 0, -0.25);
      zhang.head.rotation.x = 0.4;
    }
  }

  /* ---------------- cameras ---------------- */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  function setCamera(cam: THREE.PerspectiveCamera, setup: string, t: number): void {
    let pos: THREE.Vector3; let look: THREE.Vector3;
    switch (setup) {
      case "shop-wide":
        pos = V(5.6 - t * 0.02, 2.6, 4.6);
        look = V(-1.4, 1.2, -1.2);
        break;
      case "machine-close":
        pos = V(0.95, 2.0, 1.55);
        look = V(-2.2, 1.45, -0.95);
        break;
      case "chuck-macro":
        pos = V(-0.55, 2.05, 1.55);
        look = V(-2.35, 1.45, -0.95);
        break;
      case "bench-close":
        pos = V(3.9, 1.7, 2.2);
        look = V(2.7, 0.95, 0.7);
        break;
      case "tray-macro":
        pos = V(4.5, 1.95, 2.35);
        look = V(3.3, 0.92, 1.0);
        break;
      default:
        pos = V(5.6, 2.6, 4.6); look = V(-1.4, 1.2, -1.2);
    }
    cam.position.copy(pos);
    cam.lookAt(look);
  }

  return { group, frame, setCamera };
}
