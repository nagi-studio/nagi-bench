import * as THREE from "three";
import { box, emissive, mat, makeHuman, radialSprite, sitPose, type Human } from "../voxel";
import { Puff } from "../particles";
import type { SceneHandle } from "./collector";

function env(t: number, a: number, b: number): number {
  return THREE.MathUtils.smoothstep(t, a, b);
}

export const SHOT_TIMES = [149, 151.2, 153.4, 155.6];

export function buildBasement(): SceneHandle {
  const group = new THREE.Group();

  /* ---------------- room ---------------- */
  const floor = box(7, 0.2, 7, 0x35322e, { y: -0.1, shadow: false });
  floor.receiveShadow = true;
  group.add(floor);
  const wallMat = mat(0x454038, 0.98);
  for (const [w, h, d, x, y, z] of [
    [7, 3.2, 0.25, 0, 1.6, -3.4],
    [7, 3.2, 0.25, 0, 1.6, 3.4],
    [0.25, 3.2, 7, -3.4, 1.6, 0],
    [0.25, 3.2, 7, 3.4, 1.6, 0],
  ] as const) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    m.position.set(x, y, z); m.receiveShadow = true;
    group.add(m);
  }
  group.add(box(7, 0.25, 7, 0x2a2723, { y: 3.25, shadow: false }));
  // pipes along ceiling
  group.add(box(0.14, 0.14, 6.8, 0x554f45, { x: -2.8, y: 3.0, z: 0 }));
  group.add(box(0.1, 0.1, 6.8, 0x4a443c, { x: -2.55, y: 2.95, z: 0 }));

  /* ---------------- swinging bulb ---------------- */
  const bulbRig = new THREE.Group();
  bulbRig.position.set(0, 3.2, 0);
  const cord = box(0.02, 0.85, 0.02, 0x111111, { y: -0.42, shadow: false });
  const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.14), emissive(0xffd9a8, 3.2));
  bulb.position.y = -0.9;
  const key = new THREE.PointLight(0xffc48a, 32, 11, 2);
  key.position.y = -0.95;
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.004;
  bulbRig.add(cord, bulb, key);
  group.add(bulbRig);
  group.add(new THREE.AmbientLight(0x4a3d2c, 0.65));
  // cool fill from the stairwell side so the shooter reads against concrete
  const fill = new THREE.PointLight(0x4a5a70, 5, 9, 2);
  fill.position.set(2.6, 2.3, 2.6);
  group.add(fill);

  /* ---------------- table & props ---------------- */
  const table = new THREE.Group();
  table.position.set(0, 0, 0.4);
  table.add(box(1.7, 0.07, 0.9, 0x4c4438, { y: 0.78 }));
  for (const [lx, lz] of [[-0.75, -0.35], [0.75, -0.35], [-0.75, 0.35], [0.75, 0.35]] as const) {
    table.add(box(0.07, 0.78, 0.07, 0x3a332a, { x: lx, y: 0.39, z: lz }));
  }
  group.add(table);

  // 36 meteorite bullets (assembled one by one during 119-141)
  const bullets: THREE.Mesh[] = [];
  const bulletMat = mat(0x6e5433, 0.45, 0.7);   // propellant body
  const tipMat = mat(0x565a60, 0.35, 0.95);     // meteorite tip
  for (let i = 0; i < 36; i++) {
    const b = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.042, 0.075), bulletMat);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.038, 0.045), tipMat);
    tip.position.z = 0.058;
    b.add(body, tip);
    b.position.set(-0.72 + (i % 12) * 0.085, 0.85, -0.28 + Math.floor(i / 12) * 0.13);
    b.rotation.y = Math.PI / 2;
    table.add(b);
    bullets.push(b as unknown as THREE.Mesh);
  }
  // pliers + glue tube
  const pliers = new THREE.Group();
  pliers.add(box(0.03, 0.02, 0.16, 0x883333, { x: -0.015 }));
  pliers.add(box(0.03, 0.02, 0.16, 0x883333, { x: 0.015, ry: 0.2 }));
  pliers.position.set(0.5, 0.83, 0.2);
  table.add(pliers);
  const glue = box(0.05, 0.05, 0.16, 0xb8b0a0, { x: 0.62, y: 0.845, z: -0.15 });
  table.add(glue);

  // pistol on table
  const pistol = new THREE.Group();
  const pBody = box(0.05, 0.09, 0.28, 0x2a2c2e, { y: 0.05 });
  const pGrip = box(0.045, 0.14, 0.07, 0x1f2123, { y: -0.05, z: -0.1, rx: 0.25 });
  const pMag = box(0.04, 0.1, 0.055, 0x3a3d40, { y: -0.13, z: -0.1, rx: 0.25 });
  pistol.add(pBody, pGrip, pMag);
  pistol.position.set(0.1, 0.83, 0.25);
  pistol.rotation.y = -0.6;
  table.add(pistol);

  /* ---------------- bundle with beef in corner ---------------- */
  const bundle = new THREE.Group();
  bundle.position.set(-2.3, 0, -2.2);
  const clothMat = mat(0x7a8894, 0.95); // spacesuit fabric
  bundle.add(box(0.85, 0.75, 0.5, 0x7a8894, { y: 0.38, material: clothMat }));
  const flapL = box(0.4, 0.7, 0.06, 0x8593a0, { x: -0.22, y: 0.4, z: 0.28 });
  const flapR = box(0.4, 0.7, 0.06, 0x8593a0, { x: 0.22, y: 0.4, z: 0.28 });
  bundle.add(flapL, flapR);
  const beef = box(0.55, 0.5, 0.35, 0x7d2a22, { y: 0.4, z: 0.05 });
  beef.visible = false;
  bundle.add(beef);
  // bullet holes on cloth (5, appear with shots)
  const holes: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const h = box(0.045, 0.045, 0.02, 0x0a0806, {
      x: -0.2 + (i % 3) * 0.18, y: 0.25 + Math.floor(i / 3) * 0.22, z: 0.26, shadow: false,
    });
    h.visible = false;
    bundle.add(h);
    holes.push(h);
  }
  group.add(bundle);

  /* ---------------- smoke & flash ---------------- */
  const smoke = new Puff(60, 0.14, 7);
  group.add(smoke.points);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialSprite("rgba(255,240,200,1)", "rgba(255,120,20,0)"),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  flash.scale.setScalar(0.001);
  group.add(flash);
  const flashLight = new THREE.PointLight(0xffc060, 0, 9, 2);
  group.add(flashLight);

  // fragments in palm (final insert)
  const frags = new THREE.Group();
  const palm = box(0.17, 0.05, 0.17, 0, { y: -0.02 });
  palm.material = new THREE.MeshStandardMaterial({ color: 0xc98f66, roughness: 0.9 });
  frags.add(palm);
  for (let i = 0; i < 9; i++) {
    const f = box(0.02 + (i % 3) * 0.006, 0.015, 0.018, 0x565a60, {
      x: -0.05 + (i % 3) * 0.045, y: 0.015, z: -0.04 + Math.floor(i / 3) * 0.04, ry: i * 0.7,
    });
    frags.add(f);
  }
  frags.visible = false;
  group.add(frags);

  /* ---------------- character ---------------- */
  const zhang = makeHuman({ face: "stern", shirt: 0x3d564b, sleeve: 0x3d564b, pants: 0x23282e, hair: "#1a1a1a", skin: "#c98f66" });
  group.add(zhang.group);
  const stool = box(0.4, 0.5, 0.4, 0x3a332a, { x: 0, y: 0.25, z: 1.3 });
  group.add(stool);

  const BUNDLE_AT = new THREE.Vector3(-2.3, 0.45, -2.2);
  const MUZZLE = new THREE.Vector3();

  function idle(h: Human, t: number): void {
    h.armL.rotation.set(0.05 * Math.sin(t * 0.8), 0, 0.07);
    h.armR.rotation.set(-0.05 * Math.sin(t * 0.8), 0, -0.07);
  }

  function frame(t: number): void {
    // bulb gentle sway, heavier after shots
    let sway = Math.sin(t * 0.9) * 0.02;
    for (const st of SHOT_TIMES) {
      const d = t - st;
      if (d > 0 && d < 4) sway += Math.sin(d * 5) * 0.1 * Math.exp(-d * 1.2);
    }
    bulbRig.rotation.z = sway;
    bulbRig.rotation.x = sway * 0.6;

    // assembly progress: bullets appear one by one 119-141
    bullets.forEach((b, i) => {
      const appear = 119.5 + i * 0.58;
      b.visible = t >= appear && t < 145;
      if (t >= 145) b.visible = false;
    });

    // holes appear with shots + one pre-existing? 4 shots => 4 holes + 1 from final
    holes.forEach((h, i) => { h.visible = SHOT_TIMES.some((st, j) => j === i && t > st + 0.1); });

    // smoke puffs per shot
    for (const st of SHOT_TIMES) {
      if (t >= st && t < st + 0.12 && !smokeFired.has(st)) {
        smokeFired.add(st);
        smoke.burst({
          at: MUZZLE.lengthSq() > 0 ? MUZZLE.clone() : new THREE.Vector3(-0.9, 1.35, -0.5),
          t0: st + 0.05, life: 7, dir: new THREE.Vector3(0, 0.6, -0.4), cone: 0.4,
          speed: 0.5, drag: 0.7, color1: 0x5a5348, color2: 0x2c2824,
        });
      }
    }
    smoke.update(t, 0.15);

    // muzzle flash
    let flashK = 0;
    for (const st of SHOT_TIMES) {
      const d = t - st;
      if (d >= 0 && d < 0.14) flashK = Math.max(flashK, 1 - d / 0.14);
    }
    flash.material.opacity = flashK;
    flash.scale.setScalar(0.4 + flashK * 0.9);
    flashLight.intensity = flashK * 90;
    if (flashK > 0) {
      flash.position.copy(muzzlePos(t));
      flashLight.position.copy(flash.position);
    }

    /* ---- choreography ---- */
    if (t < 142) {
      // seated assembling
      zhang.group.visible = true;
      zhang.group.position.set(0, -0.28, 1.25);
      zhang.group.rotation.y = Math.PI;
      sitPose(zhang);
      const work = Math.sin(t * 5.2);
      zhang.armL.rotation.set(-0.85 + work * 0.12, 0, 0.3);
      zhang.armR.rotation.set(-0.85 - work * 0.12, 0, -0.3);
      zhang.head.rotation.x = 0.42;
      pistol.position.set(0.1, 0.83, 0.25);
      pistol.rotation.set(0, -0.6, 0);
    } else if (t < 147) {
      // loads magazine, picks up pistol
      const k = env(t, 142, 145.5);
      zhang.group.position.set(0, -0.28, 1.25);
      zhang.group.rotation.y = Math.PI;
      sitPose(zhang);
      zhang.armL.rotation.set(-0.9, 0, 0.28);
      zhang.armR.rotation.set(-0.9 - k * 0.15, 0, -0.28);
      zhang.head.rotation.x = 0.45;
      // pistol lifted into hands
      pistol.position.set(0.02 + k * 0.05, 0.83 + k * 0.32, 0.55 - k * 0.25);
      pistol.rotation.set(-0.2, Math.PI + 0.15, 0);
    } else if (t < 158) {
      // stands, turns to bundle, aims two-handed
      const stand = env(t, 147, 148.2);
      const aim = env(t, 148.2, 148.9);
      zhang.group.position.set(-0.5 - aim * 0.3, -0.28 * (1 - stand), 0.4 - aim * 0.5);
      zhang.group.rotation.y = Math.PI + aim * 0.75;
      sitPose(zhang);
      zhang.legL.rotation.x *= (1 - stand); zhang.legR.rotation.x *= (1 - stand);
      zhang.armL.rotation.set(-aim * 1.35, 0, 0.12 * (1 - aim));
      zhang.armR.rotation.set(-aim * 1.35, 0, -0.12 * (1 - aim));
      zhang.head.rotation.x = 0.15 * (1 - aim);
      zhang.head.rotation.y = 0;
      // recoil per shot
      let rec = 0;
      for (const st of SHOT_TIMES) {
        const d = t - st;
        if (d >= 0 && d < 0.35) rec = Math.max(rec, Math.exp(-d * 9) * 0.3);
      }
      zhang.armL.rotation.x += rec; zhang.armR.rotation.x += rec;
      zhang.group.rotation.x = -rec * 0.15;
      // pistol in hands, pointing at bundle
      pistol.position.set(-0.72 - aim * 0.35, 1.32 * aim + 0.6 * (1 - aim), -0.05 - aim * 0.65);
      pistol.rotation.set(0, Math.PI * 0.72, 0);
      const mp = muzzlePos(t);
      if (flashK > 0) flash.position.copy(mp);
    } else {
      // walks to bundle, kneels, opens cloth
      const w = env(t, 158, 160.5);
      const kneel = env(t, 160.8, 162.2);
      zhang.group.position.lerpVectors(new THREE.Vector3(-0.8, 0, -0.1), new THREE.Vector3(-1.7, 0, -1.5), w);
      zhang.group.position.y = -kneel * 0.55;
      zhang.group.rotation.y = Math.PI * 0.78;
      zhang.group.rotation.x = 0;
      if (w > 0 && w < 1) {
        zhang.legL.rotation.x = Math.sin(t * 6.5) * 0.5;
        zhang.legR.rotation.x = -Math.sin(t * 6.5) * 0.5;
      } else if (kneel > 0) {
        zhang.legL.rotation.x = -1.9 * kneel;
        zhang.legR.rotation.x = -0.4 * kneel;
      }
      // cloth opens
      const open = env(t, 163, 165);
      flapL.rotation.z = open * 1.9;
      flapR.rotation.z = -open * 1.9;
      flapL.position.y = 0.4 - open * 0.2;
      flapR.position.y = 0.4 - open * 0.2;
      beef.visible = open > 0.4;
      const dig = env(t, 166, 167) * (1 - env(t, 171, 172));
      zhang.armR.rotation.set(-0.9 - dig * 0.3 + Math.sin(t * 4) * 0.08 * dig, 0, 0.2);
      zhang.armR.rotation.set(-0.7 - dig * 0.2, 0, -0.2);
      zhang.head.rotation.x = 0.5;
      // fragments revealed in palm 172+
      const show = env(t, 172, 172.8);
      frags.visible = show > 0;
      if (show > 0) {
        frags.position.set(-1.55, 0.85 + show * 0.35, -1.05);
        frags.rotation.y = 0.4;
        zhang.armL.rotation.set(-1.05, 0, 0.15);
        zhang.armR.rotation.set(-0.55, 0, -0.35);
        zhang.head.rotation.x = 0.38 - show * 0.08;
      }
      pistol.visible = false;
    }

    function muzzlePos(tt: number): THREE.Vector3 {
      MUZZLE.set(-0.72 - 0.35, 1.34, -0.05 - 0.65);
      MUZZLE.z -= 0.28; // barrel tip forward
      MUZZLE.x -= 0.12;
      return MUZZLE;
    }
  }

  const smokeFired = new Set<number>();

  /* ---------------- cameras ---------------- */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  function setCamera(cam: THREE.PerspectiveCamera, setup: string, t: number): void {
    let pos: THREE.Vector3; let look: THREE.Vector3;
    switch (setup) {
      case "base-wide":
        pos = V(2.7, 1.9, 1.3);
        look = V(-0.5, 0.85, 0.3);
        break;
      case "table-close":
        pos = V(0.75, 1.3, 1.55);
        look = V(-0.35, 0.8, 0.1);
        break;
      case "aim-side":
        pos = V(1.6, 1.5, -0.9);
        look = V(-1.6, 1.0, -1.6);
        break;
      case "aim-rear": // high over his right shoulder toward bundle
        pos = V(1.9, 2.25, 1.5);
        look = V(-2.3, 0.45, -2.2);
        break;
      case "bundle-close":
        pos = V(-1.15, 0.85, -0.85);
        look = V(-2.35, 0.42, -2.25);
        break;
      case "palm-macro":
        pos = V(-1.2, 1.85, -0.4);
        look = V(-1.55, 1.12, -1.05);
        break;
      default:
        pos = V(2.5, 2.1, 2.9); look = V(-0.4, 0.9, -0.5);
    }
    // camera shake on gunshots
    let shake = 0;
    for (const st of SHOT_TIMES) {
      const d = t - st;
      if (d >= 0 && d < 0.4) shake = Math.max(shake, Math.exp(-d * 8));
    }
    if (shake > 0) {
      pos.x += Math.sin(t * 71) * 0.05 * shake;
      pos.y += Math.cos(t * 89) * 0.04 * shake;
    }
    cam.position.copy(pos);
    cam.lookAt(look);
  }

  return { group, frame, setCamera };
}
