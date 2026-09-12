import * as THREE from "three";
import { box, emissive, mat, makeHuman, radialSprite, rng, type Human } from "../voxel";
import { Puff, Tracer } from "../particles";
import type { SceneHandle } from "./collector";

function env(t: number, a: number, b: number): number {
  return THREE.MathUtils.smoothstep(t, a, b);
}

/* Key beats */
export const FIRE_TIMES: number[] = (() => {
  const out: number[] = [];
  for (let i = 0; i < 10; i++) out.push(271 + i * 0.42);       // target 1
  for (let i = 0; i < 10; i++) out.push(278 + i * 0.42);       // target 2
  for (let i = 0; i < 10; i++) out.push(285 + i * 0.42);       // target 3
  return out;
})();
export const MAG_CHANGES = [276.2, 283.2];
export const HIT_START = 300;

function earthTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#1a3f6e");
  grad.addColorStop(0.5, "#20508c");
  grad.addColorStop(1, "#173a66");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 512);
  const r = rng(7);
  // continents
  for (let i = 0; i < 46; i++) {
    const x = r() * 1024, y = 60 + r() * 390;
    const w = 30 + r() * 120, h = 18 + r() * 70;
    g.fillStyle = r() > 0.45 ? "#3d6b3a" : "#6b6242";
    g.globalAlpha = 0.55 + r() * 0.35;
    g.beginPath();
    g.ellipse(x, y, w, h, r() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  // polar caps
  g.globalAlpha = 0.9;
  g.fillStyle = "#dfe8ee";
  g.fillRect(0, 0, 1024, 26);
  g.fillRect(0, 488, 1024, 24);
  // clouds
  g.fillStyle = "#ffffff";
  for (let i = 0; i < 90; i++) {
    g.globalAlpha = 0.08 + r() * 0.16;
    const x = r() * 1024, y = r() * 512;
    g.beginPath();
    g.ellipse(x, y, 40 + r() * 110, 6 + r() * 16, (r() - 0.5) * 0.6, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildSpace(): SceneHandle {
  const group = new THREE.Group();

  /* ---------------- stars ---------------- */
  {
    const r = rng(99);
    const n = 2600;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      const rad = 1200 + r() * 600;
      pos[i * 3] = s * Math.cos(th) * rad;
      pos[i * 3 + 1] = u * rad;
      pos[i * 3 + 2] = s * Math.sin(th) * rad;
      const b = 0.35 + r() * 0.65;
      col[i * 3] = b; col[i * 3 + 1] = b; col[i * 3 + 2] = b * (0.85 + r() * 0.15);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const stars = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 2.2, vertexColors: true, sizeAttenuation: false, transparent: true, opacity: 0.9, depthWrite: false,
    }));
    stars.frustumCulled = false;
    group.add(stars);
  }

  /* ---------------- earth & sun ---------------- */
  const EARTH_C = new THREE.Vector3(-300, -340, -980);
  const EARTH_R = 380;
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_R, 48, 32),
    new THREE.MeshStandardMaterial({
      map: earthTexture(), roughness: 1, metalness: 0,
      emissive: new THREE.Color(0x16283e), emissiveIntensity: 0.4,
    }),
  );
  earth.position.copy(EARTH_C);
  earth.rotation.z = 0.3;
  group.add(earth);
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_R * 1.025, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x5a9adf, transparent: true, opacity: 0.14, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  atmo.position.copy(EARTH_C);
  group.add(atmo);

  const sunLight = new THREE.DirectionalLight(0xfff4e0, 3.2);
  sunLight.position.set(300, 140, 60);
  group.add(sunLight);
  group.add(sunLight.target);
  const earthShine = new THREE.DirectionalLight(0x6a8fc8, 0.75);
  earthShine.position.set(-300, -200, -700);
  group.add(earthShine);
  group.add(earthShine.target);
  group.add(new THREE.AmbientLight(0x223040, 0.5));

  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialSprite("rgba(255,246,220,1)", "rgba(255,160,60,0)", 256),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sunSprite.scale.setScalar(190);
  group.add(sunSprite);

  /* ---------------- Yellow River Station (wheel) ---------------- */
  const station = new THREE.Group();
  station.position.set(-78, 8, -118);
  const ringMat = mat(0x9aa4ae, 0.5, 0.7);
  const R = 10;
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const seg = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 2.2), ringMat);
    seg.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
    seg.rotation.z = a + Math.PI / 2;
    station.add(seg);
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.8, R, 0.8), ringMat);
    spoke.position.set(Math.cos(a) * R / 2, Math.sin(a) * R / 2, 0);
    spoke.rotation.z = a - Math.PI / 2;
    station.add(spoke);
  }
  const hub = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 6), ringMat);
  station.add(hub);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 22), ringMat);
  station.add(spine);
  // docked module + airlock block facing the shooter
  const airlock = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 2.5), mat(0x8b959f, 0.5, 0.7));
  airlock.position.set(0, -4.5, 10.5);
  station.add(airlock);
  const airlockDoor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 0.3), mat(0x5c666f, 0.6, 0.6));
  airlockDoor.position.set(0, -4.5, 11.9);
  station.add(airlockDoor);
  const airlockLight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), emissive(0xff3830, 2.5));
  airlockLight.position.set(1.6, -3.2, 11.8);
  station.add(airlockLight);
  // blinking nav lights
  const navs: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const nav = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), emissive(0xffffff, 2));
    nav.position.set(Math.cos(a) * R, Math.sin(a) * R, 1.2);
    station.add(nav);
    navs.push(nav);
  }
  group.add(station);

  /* ---------------- distant Base One ---------------- */
  const base = new THREE.Group();
  base.position.set(90, -14, 55);
  base.add(box(4, 4, 4, 0x8b959f));
  base.add(box(1, 1, 10, 0x77818b));
  const baseLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), emissive(0x7fd8ff, 3));
  baseLight.position.set(0, 2.4, 0);
  base.add(baseLight);
  group.add(base);

  /* ---------------- the photo group (30 astronauts) ---------------- */
  const crowd = new THREE.Group();
  const PHOTO_P = new THREE.Vector3(-56, 3, -88);
  crowd.position.copy(PHOTO_P);
  group.add(crowd);
  // station work floodlight so the group reads after sunset
  const flood = new THREE.PointLight(0xdfe8ff, 0, 70, 1.8);
  flood.position.set(PHOTO_P.x + 7, PHOTO_P.y + 7, PHOTO_P.z + 9);
  group.add(flood);

  interface Astro { h: Human; home: THREE.Vector3; hitAt: number; isTarget: boolean; }
  const astros: Astro[] = [];
  const HIT_INDICES = new Set([3, 4, 5, 10, 17]); // three targets front-center + two bystanders
  const r30 = rng(30);
  for (let i = 0; i < 30; i++) {
    const row = Math.floor(i / 10);
    const colI = i % 10;
    const h = makeHuman({ suit: true, helmet: true, face: i % 3 === 0 ? "calm" : "plain", skin: "#d9a077", hair: "#3a3430" });
    const x = (colI - 4.5) * 1.5 + (r30() - 0.5) * 0.3;
    const y = (1 - row) * 1.9 + (r30() - 0.5) * 0.25;
    const z = -row * 2.2 + (r30() - 0.5) * 0.4;
    h.group.position.set(x, y, z);
    // rank stripe on chest for the three targets (front row center)
    const isTarget = i === 3 || i === 4 || i === 5;
    if (isTarget) {
      const stripe = box(0.34, 0.07, 0.03, 0xc8a03a, { y: 0.05, z: 0.24, shadow: false });
      h.torso.add(stripe);
    }
    crowd.add(h.group);
    astros.push({ h, home: new THREE.Vector3(x, y, z), hitAt: -1, isTarget });
  }
  // photographer to the side
  const photog = makeHuman({ suit: true, helmet: true, face: "plain" });
  photog.group.position.set(9.5, 0.5, 3.5);
  crowd.add(photog.group);
  const camBox = box(0.22, 0.16, 0.3, 0x22262a, { y: -0.7, z: 0.15 });
  photog.armR.add(camBox);
  photog.armR.rotation.x = -1.2;

  /* ---------------- Zhang in suit ---------------- */
  const zhang = makeHuman({ suit: true, helmet: true, face: "stern", skin: "#c98f66", hair: "#1a1a1a" });
  group.add(zhang.group);

  // right glove (removable) + thin inner glove
  const glove = box(0.2, 0.15, 0.23, 0xe0e4e8, { y: -0.72 });
  const innerGlove = box(0.17, 0.13, 0.2, 0x3a3d40, { y: -0.72 });
  innerGlove.visible = false;
  zhang.armR.add(glove, innerGlove);

  // pistol + scope (assembled 258-264)
  const pistol = new THREE.Group();
  pistol.add(box(0.06, 0.1, 0.34, 0x2a2c2e, { y: 0.05 }));
  pistol.add(box(0.05, 0.15, 0.08, 0x1f2123, { y: -0.05, z: -0.12, rx: 0.25 }));
  const scope = box(0.06, 0.06, 0.24, 0x3d4146, { y: 0.14, z: 0.02 });
  const scopeLens = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02), emissive(0x7fb8e8, 0.8));
  scopeLens.position.set(0, 0.14, 0.14);
  pistol.add(scope, scopeLens);
  group.add(pistol);

  // handheld spotting scope (before assembly)
  const spotScope = box(0.07, 0.07, 0.26, 0x3d4146);
  group.add(spotScope);

  // muzzle flash sprite
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialSprite("rgba(255,240,200,1)", "rgba(255,150,50,0)"),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  flash.scale.setScalar(0.001);
  group.add(flash);

  /* ---------------- thruster flames ---------------- */
  function makeFlame(parent: THREE.Object3D, y = 0): THREE.Mesh {
    const f = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.6, 6),
      new THREE.MeshBasicMaterial({ color: 0xbfe0ff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    f.position.set(0, -0.2 + y, -0.55);
    f.rotation.x = -Math.PI / 2;
    f.visible = false;
    parent.add(f);
    return f;
  }
  const zhangFlame = makeFlame(zhang.torso);
  const crowdFlames: THREE.Mesh[] = astros.map(a => makeFlame(a.h.torso));

  /* ---------------- tracers & hit puffs ---------------- */
  const tracers: Tracer[] = [];
  for (let i = 0; i < 30; i++) {
    const tr = new Tracer();
    group.add(tr.group);
    tracers.push(tr);
  }
  const gasPuffs: Puff[] = [];
  for (let i = 0; i < 6; i++) {
    const p = new Puff(70, 0.35, 100 + i);
    group.add(p.points);
    gasPuffs.push(p);
  }
  const bloodPuff = new Puff(50, 0.16, 77);
  group.add(bloodPuff.points);

  /* ---------------- choreography state ---------------- */
  // facing: he must actually face the photo group for the aim/scope shots
  const RY = Math.atan2(PHOTO_P.x, PHOTO_P.z); // toward the crowd
  const FRONT = new THREE.Vector3(Math.sin(RY), 0, Math.cos(RY));
  const RIGHT = new THREE.Vector3(FRONT.z, 0, -FRONT.x);
  const firedTracer = new Set<number>();
  let bloodFired = false;
  let bigBurstFired = false;

  function gunPos(t: number): THREE.Vector3 {
    // world position of the pistol (assembled at chest, raised to aim)
    const k = env(t, 264, 270);
    const d = THREE.MathUtils.lerp(0.42, 0.55, k);
    const h = THREE.MathUtils.lerp(1.15, 1.5, k);
    return zhang.group.position.clone()
      .add(FRONT.clone().multiplyScalar(d))
      .add(RIGHT.clone().multiplyScalar(0.2 * (1 - k)))
      .add(new THREE.Vector3(0, h, 0));
  }

  function frame(t: number): void {
    /* sun path: sets behind earth limb 205 -> 232 */
    const sunK = THREE.MathUtils.smoothstep(t, 202, 234);
    const sunDir = new THREE.Vector3(0.85, 0.55 - sunK * 0.85, 0.28).normalize();
    sunLight.position.copy(sunDir).multiplyScalar(400);
    sunLight.intensity = 3.2 * (1 - sunK * 0.86);
    sunLight.color.setHSL(0.1 - sunK * 0.03, 0.3 + sunK * 0.35, 0.65 - sunK * 0.1);
    // glow sprite pinned on earth limb along sun direction
    const limb = EARTH_C.clone().add(sunDir.clone().multiplyScalar(EARTH_R * 0.99));
    sunSprite.position.copy(limb);
    sunSprite.material.opacity = 1 - sunK * 0.92;
    atmo.material.opacity = Math.max(0.14 * (1 - sunK * 0.5), (sunK - 0.8) * 0.55);
    earthShine.intensity = t >= 318 ? 1.15 : 0.75 + sunK * 0.3;
    flood.intensity = t >= 222 ? 90 : 0;

    /* station */
    station.rotation.z = t * 0.03;
    navs.forEach((n, i) => {
      (n.material as THREE.MeshStandardMaterial).emissiveIntensity = (Math.sin(t * 2.2 + i * 1.7) > 0.4) ? 2.4 : 0.15;
    });
    // airlock: light green at 223, door opens 224-226, closes 313-315
    const openK = env(t, 224, 226.5) * (1 - env(t, 313, 315));
    airlockDoor.position.y = -4.5 + openK * 1.9;
    const lampGreen = t >= 223 ? 1 : 0;
    (airlockLight.material as THREE.MeshStandardMaterial).emissive.set(lampGreen ? 0x30ff60 : 0xff3830);

    /* crowd: exit airlock 224-236, form up, visors clear 244-250, hit 300+, retreat 306-315 */
    const exitK = env(t, 224.5, 236);
    const retreatK = env(t, 306, 314.5);
    astros.forEach((a, i) => {
      const stagger = i / 30;
      const myExit = THREE.MathUtils.smoothstep(t, 224.5 + stagger * 8, 229 + stagger * 8);
      const home = a.home;
      const start = new THREE.Vector3(-22 + 78, -7.5 - 3, -30 + 118).sub(PHOTO_P); // airlock in crowd space
      // airlock world pos = station pos + (0,-4.5,11.9); convert to crowd local:
      const airW = new THREE.Vector3(-78, 8 - 4.5, -118 + 11.9).sub(PHOTO_P);
      const pos = airW.clone().lerp(home, myExit);
      // drift while forming up
      if (myExit >= 1 && retreatK === 0 && a.hitAt < 0) {
        pos.x += Math.sin(t * 0.5 + i) * 0.12;
        pos.y += Math.cos(t * 0.4 + i * 2) * 0.1;
      }
      // hit knockback
      if (a.hitAt > 0 && t > a.hitAt) {
        const d = t - a.hitAt;
        pos.x += Math.min(d * 1.2, 3) * 0.4;
        pos.y += Math.min(d * 0.8, 2) * 0.3;
        a.h.group.rotation.z = Math.min(d * 0.8, 1.2) * (i % 2 ? 1 : -1);
      }
      // retreat: everyone flies back to airlock; hit ones dragged by a neighbor
      if (retreatK > 0) {
        const dragged = a.hitAt > 0;
        const k = dragged ? retreatK * 0.85 : retreatK;
        pos.lerp(airW, k);
        a.h.group.rotation.z *= (1 - k);
      }
      a.h.group.position.copy(pos);
      // visors clear as light dims 244-250
      const clear = env(t, 244 + stagger, 250);
      a.h.setVisor(clear);
      // cracked visor on target 1 after the blood hit — pure function of t
      if (i === 3 && a.h.visor) {
        if (t >= 303.4) {
          a.h.visor.color.set(0x8a95a0);
          a.h.visor.roughness = 0.9;
          a.h.visor.opacity = 0.9;
        } else {
          a.h.visor.color.set(0x2a2013);
          a.h.visor.roughness = 0.15;
        }
      }
      // panic flail after hits
      if (t > HIT_START + 3) {
        const p = Math.sin(t * 7 + i * 3) * 0.5;
        a.h.armL.rotation.set(-0.4 + p, 0, 0.4);
        a.h.armR.rotation.set(-0.4 - p, 0, -0.4);
      } else {
        a.h.armL.rotation.set(0.05 * Math.sin(t * 0.8 + i), 0, 0.08);
        a.h.armR.rotation.set(-0.05 * Math.sin(t * 0.8 + i), 0, -0.08);
      }
      // thruster flames during exit & retreat
      const flaming = (myExit > 0 && myExit < 1) || (retreatK > 0 && a.hitAt < 0);
      crowdFlames[i].visible = flaming && Math.sin(t * 21 + i * 7) > -0.4;
    });
    photog.group.position.set(9.5 - retreatK * 20, 0.5, 3.5 - retreatK * 12);
    photog.armR.rotation.x = -1.2 + retreatK * 0.9;

    /* hits: schedule */
    const hitList = [3, 4, 5, 10, 17];
    hitList.forEach((idx, n) => {
      const hitT = HIT_START + n * 1.1;
      if (t >= hitT && astros[idx].hitAt < 0) {
        astros[idx].hitAt = hitT;
        const wp = astros[idx].h.group.position.clone().add(PHOTO_P);
        gasPuffs[n].burst({
          at: wp, t0: hitT, life: 3.5, dir: new THREE.Vector3(0.6, 0.3, 0.7), cone: 0.6,
          speed: 3.2, drag: 1.1, color1: 0xffffff, color2: 0x9ab8d8,
        });
      }
    });
    // big propellant burst between rows
    if (t >= 302.2 && !bigBurstFired) {
      bigBurstFired = true;
      const wp = PHOTO_P.clone().add(new THREE.Vector3(0.5, -0.8, -1.6));
      gasPuffs[5].burst({
        at: wp, t0: 302.2, life: 5, dir: new THREE.Vector3(0.3, 0.1, 0.8), cone: 0.4,
        speed: 5.5, drag: 0.9, color1: 0xffffff, color2: 0x7fa8d0,
      });
    }
    // blood freezing inside cracked visor (target 1)
    if (t >= 303.4 && !bloodFired) {
      bloodFired = true;
      const wp = astros[3].h.group.position.clone().add(PHOTO_P).add(new THREE.Vector3(0, 1.6, 0.3));
      bloodPuff.burst({
        at: wp, t0: 303.4, life: 3, dir: new THREE.Vector3(0.4, 0.2, 0.6), cone: 0.5,
        speed: 1.1, drag: 0.6, color1: 0xb01818, color2: 0xe8f2ff,
      });
    }
    gasPuffs.forEach(p => p.update(t));
    bloodPuff.update(t);

    /* ---------------- Zhang ---------------- */
    const zp = zhang.group.position;
    if (t < 318) {
      // gentle float drift; from 190 on he faces the station group
      zp.set(Math.sin(t * 0.11) * 0.35, Math.sin(t * 0.13 + 2) * 0.3, Math.cos(t * 0.09) * 0.3);
      zhang.group.rotation.z = Math.sin(t * 0.07) * 0.05;
      const turn = env(t, 189, 191.5);
      zhang.group.rotation.y = (1 - turn) * Math.sin(t * 0.05) * 0.4 + turn * RY;
      zhang.group.rotation.x = 0;
    } else {
      // epilogue: thrust away toward Base One
      const k = env(t, 320, 344);
      const dir = new THREE.Vector3(90, -14, 55).normalize();
      zp.set(dir.x * k * 55, dir.y * k * 55 - 2, dir.z * k * 55);
      zhang.group.rotation.y = Math.atan2(dir.x, dir.z);
      zhang.group.rotation.x = 0.9 * k;
    }
    zhangFlame.visible = t >= 319 && t < 344 && Math.sin(t * 18) > -0.6;
    // helper: point in front of his face/chest along his facing
    const ahead = (d: number, h: number, side = 0) => zp.clone()
      .add(FRONT.clone().multiplyScalar(d))
      .add(RIGHT.clone().multiplyScalar(side))
      .add(new THREE.Vector3(0, h, 0));

    // arms/head per phase
    if (t < 190) {
      zhang.armL.rotation.set(0.06 * Math.sin(t * 0.8), 0, 0.1);
      zhang.armR.rotation.set(-0.06 * Math.sin(t * 0.8), 0, -0.1);
      zhang.head.rotation.y = Math.sin(t * 0.2) * 0.15;
    } else if (t < 205) {
      // raises spotting scope to eye
      const k = env(t, 190, 192);
      zhang.armR.rotation.set(-1.35 * k, 0, -0.25 * k);
      spotScope.visible = k > 0.1;
      spotScope.position.copy(ahead(0.36, 1.52, 0.14));
      spotScope.rotation.y = RY;
    } else if (t < 252) {
      // scope floats free in front of him
      zhang.armR.rotation.set(-0.2, 0, -0.1);
      zhang.armL.rotation.set(0.1, 0, 0.15);
      spotScope.visible = true;
      spotScope.position.copy(ahead(0.4, 1.35 + Math.sin(t * 0.7) * 0.02, 0.22));
      spotScope.rotation.y = RY + 0.3;
      spotScope.rotation.z = 0.1;
      if (t > 216) zhang.head.rotation.y = 0.2; // glances at sun
    } else if (t < 258) {
      // glove off (252-256): hides glove, rotates hand to the weakening sun
      const k = env(t, 252, 256);
      glove.visible = k < 0.5;
      innerGlove.visible = k >= 0.5;
      zhang.armR.rotation.set(-0.35 - k * 0.2, 0, -0.5 - k * 0.3);
      spotScope.visible = true;
      spotScope.position.copy(ahead(0.4, 1.35, 0.22));
    } else if (t < 264) {
      // fetches pistol & mags from thigh pouch, assembles
      const k = env(t, 258, 263);
      zhang.armR.rotation.set(-0.6 - k * 0.3, 0, -0.4 + k * 0.2);
      zhang.armL.rotation.set(-0.7, 0, 0.3 - k * 0.2);
      spotScope.visible = true;
      spotScope.position.copy(ahead(0.4, 1.35, 0.22));
    } else {
      // aiming
      const k = env(t, 264, 270);
      zhang.armR.rotation.set(-1.5 * k, 0, -0.1);
      zhang.armL.rotation.set(-1.35 * k, 0, 0.25 * (1 - k));
      zhang.head.rotation.y = 0;
      spotScope.visible = false;
      // recoil
      let rec = 0;
      for (const ft of FIRE_TIMES) {
        const d = t - ft;
        if (d >= 0 && d < 0.3) rec = Math.max(rec, Math.exp(-d * 11) * 0.12);
      }
      zhang.armR.rotation.x += rec; zhang.armR.rotation.x += rec;
    }

    // pistol follows hands 258+
    pistol.visible = t >= 258.5;
    if (pistol.visible) {
      const gp = gunPos(t);
      pistol.position.copy(gp);
      const aimK = env(t, 264, 270);
      pistol.rotation.set(0.5 * (1 - aimK), RY, 0);
      // scope attached at 260
      scope.visible = t >= 260;
      scopeLens.visible = t >= 260;
    }

    // muzzle flashes
    let fk = 0;
    for (const ft of FIRE_TIMES) {
      const d = t - ft;
      if (d >= 0 && d < 0.1) fk = Math.max(fk, 1 - d / 0.1);
    }
    // in the telescopic view the flash is a tiny blink; outside, a visible firefly
    const inScope = (t >= 214 && t < 222) || (t >= 236 && t < 244) ||
      (t >= 270 && t < 276) || (t >= 278 && t < 283) || (t >= 285 && t < 290) || (t >= 303 && t < 306);
    flash.material.opacity = inScope ? 0 : fk;
    flash.scale.setScalar(0.16 + fk * 0.22);
    if (fk > 0) {
      const gp = gunPos(t);
      const dir = PHOTO_P.clone().sub(gp).normalize();
      flash.position.copy(gp).add(dir.multiplyScalar(inScope ? 3.2 : 0.75));
    }

    /* tracers: launch with shots, all arrive ~HIT_START */
    FIRE_TIMES.forEach((ft, i) => {
      if (t >= ft && !firedTracer.has(i)) {
        firedTracer.add(i);
        const targetIdx = i < 10 ? 3 : i < 20 ? 4 : 5;
        const jitter = rng(i * 13 + 5);
        const aim = astros[targetIdx].home.clone().add(PHOTO_P);
        aim.x += (jitter() - 0.5) * 0.5;
        aim.y += (jitter() - 0.5) * 0.5 + 1.1;
        const arrive = HIT_START - 0.4 + (i % 10) * 0.12 + (i >= 20 ? 2.2 : i >= 10 ? 1.1 : 0);
        const muzzle = gunPos(ft);
        const lead = muzzle.clone().add(aim.clone().sub(muzzle).normalize().multiplyScalar(20));
        tracers[i].launch(lead, aim, ft + 0.15, arrive);
      }
      tracers[i].update(t);
      // bullets are invisible to the naked eye / scope — only wide shots show them
      if (inScope) tracers[i].group.visible = false;
    });
  }

  /* ---------------- cameras ---------------- */
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  function setCamera(cam: THREE.PerspectiveCamera, setup: string, t: number): void {
    let pos: THREE.Vector3; let look: THREE.Vector3; let fov = 46;
    const zp = zhang.group.position;
    switch (setup) {
      case "float-wide": // 180-205: vast space, Earth + station
        pos = V(zp.x + 6 + t * 0.008, zp.y + 2.2, zp.z + 9);
        look = V(-50, 0, -90);
        fov = 50;
        break;
      case "float-rev": // reverse: his silhouette against Earth
        pos = V(zp.x - 4.5, zp.y + 1.4, zp.z - 6.5);
        look = V(zp.x, zp.y + 1.2, zp.z);
        fov = 42;
        break;
      case "scope-view": // what he sees through the scope (just ahead of his visor)
        pos = zp.clone().add(FRONT.clone().multiplyScalar(0.9)).add(V(0, 1.62, 0));
        look = t < 222
          ? V(-78, 3.5, -106) // the sealed airlock door
          : V(PHOTO_P.x, PHOTO_P.y + 1, PHOTO_P.z);
        fov = 7;
        break;
      case "crowd-med": // closer look at the group forming up
        pos = V(PHOTO_P.x + 13, PHOTO_P.y + 3, PHOTO_P.z + 16);
        look = V(PHOTO_P.x, PHOTO_P.y + 0.3, PHOTO_P.z);
        fov = 30;
        break;
      case "assemble-close": // front-right, waist-up: glove off, pistol assembly
        pos = zp.clone().add(RIGHT.clone().multiplyScalar(3.4)).add(FRONT.clone().multiplyScalar(2.4)).add(V(0, 2.0, 0));
        look = zp.clone().add(FRONT.clone().multiplyScalar(0.3)).add(V(0, 1.1, 0));
        fov = 30;
        break;
      case "aim-side": { // long-lens profile from behind-right: him left, group downrange
        pos = zp.clone().add(RIGHT.clone().multiplyScalar(2.2)).sub(FRONT.clone().multiplyScalar(4.5)).add(V(0, 1.2, 0));
        look = zp.clone().add(FRONT.clone().multiplyScalar(6)).add(V(0, 0.9, 0));
        fov = 38;
        break;
      }
      case "flight": // bullets crossing the void
        pos = V(zp.x - 12, zp.y + 3, zp.z - 22);
        look = V(PHOTO_P.x + 6, PHOTO_P.y, PHOTO_P.z + 6);
        fov = 44;
        break;
      case "hit-close":
        pos = V(PHOTO_P.x + 7.5, PHOTO_P.y + 2.2, PHOTO_P.z + 9.5);
        look = V(PHOTO_P.x, PHOTO_P.y + 0.5, PHOTO_P.z);
        fov = 30;
        break;
      case "retreat-wide":
        pos = V(PHOTO_P.x + 22, PHOTO_P.y + 8, PHOTO_P.z + 30);
        look = V(-70, 2, -100);
        fov = 40;
        break;
      case "epilogue": {
        // camera sits between Earth and him: he recedes toward Base One with the dark Earth behind
        const toEarth = new THREE.Vector3(-300, -340, -980).sub(zp).normalize();
        pos = zp.clone().add(toEarth.multiplyScalar(8 + (t - 318) * 0.35)).add(V(0, 2.2 + (t - 318) * 0.12, 0));
        look = V(zp.x, zp.y + 1, zp.z);
        fov = 40;
        break;
      }
      default:
        pos = V(6, 2.2, 9); look = V(-50, 0, -90);
    }
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    cam.position.copy(pos);
    cam.lookAt(look);
  }

  return { group, frame, setCamera };
}
