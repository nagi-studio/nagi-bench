import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import { applyPose, idle, walk, aim, float } from "@agentbench/voxel-kit";
import type { FilmContext } from "./context";
import { sampleCam, applyCam, handheld, seg, clamp01, lerp, easeInOut, easeOut, v3, type CamKey } from "../util";
import { props, hold, detachAll, converse, workPose, tableWork, raiseCup, present, drift } from "./acting";
import { updateDelegates, delegatePos, sunDir, T, HIT } from "../world/sets/space";
import { FIRE, RELOADS, IMPACT_T, FLIGHT_START, THRUST_IGNITE } from "./constants";

type Ctx = FilmContext;
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();

/** Swap a figure's clothing only when the texture actually changes. */
function clothe(fig: { clothing: Record<string, THREE.Mesh>; setClothes: (t: THREE.Texture) => void }, tex: THREE.Texture): void {
  const mat = fig.clothing.torso.material as THREE.MeshStandardMaterial;
  if (mat.map !== tex) fig.setClothes(tex);
}

// ===========================================================================
// ACT 1 · THE COLLECTOR — blocking & performance
// ===========================================================================
function updateCollector(ctx: Ctx, t: number): void {
  const { cast, sets } = ctx;
  const c = sets.collector;
  const P = props();
  c.dust.update(t);
  c.keyLight.intensity = 22 + Math.sin(t * 7.3) * 0.4 + Math.sin(t * 13.1) * 0.2;

  // ---- Zhang ----
  const z = cast.civilian;
  z.root.removeFromParent();
  c.group.add(z.root);
  let zx = 1.4, zz = 1.5, zrot = Math.PI;
  if (t < 8) { zx = 1.6; zz = 3.3; applyPose(z, idle(t)); }
  else if (t < 13.5) {
    const x = easeInOut(seg(t, 8, 13.5));
    zx = lerp(1.6, 1.4, x); zz = lerp(3.3, 1.5, x);
    applyPose(z, walk(t, 1.5));
  } else if (t > 117.5) {
    const x = easeInOut(seg(t, 117.5, 120));
    zx = lerp(1.4, 1.6, x); zz = lerp(1.5, 3.3, x);
    applyPose(z, walk(t, 1.5));
  }
  z.root.position.set(zx, 0, zz);
  z.root.rotation.set(0, zrot, 0);
  if (t >= 13.5 && t <= 117.5) {
    if (t >= 58 && t <= 80) applyPose(z, raiseCup(t));
    else if (t >= 105 && t <= 109) applyPose(z, { ...idle(t), armR: [-1.4, 0.2, 0.3], neck: [0.05, 0.1, 0] });
    else applyPose(z, converse(t, 1, t >= 92 ? 0.7 : 0.4));
  }
  // Zhang hand props
  if (t >= 58 && t <= 80) hold(z, "handR", P.teacup);
  else if (t >= 105 && t <= 109) hold(z, "handR", P.phone);
  else if (t > 117) hold(z, "handR", P.case_);
  else hold(z, "handR", null);
  hold(z, "handL", null);

  // ---- Collector ----
  const col = cast.collector;
  col.root.removeFromParent();
  c.group.add(col.root);
  let cx = 1.4, cz = -0.7, crot = 0;
  if (t < 16) { cx = -2.4; cz = -1.25; crot = 0.5; applyPose(col, workPose(t, 1)); }
  else if (t < 20.5) {
    const x = easeInOut(seg(t, 16, 20.5));
    cx = lerp(-2.4, 1.4, x); cz = lerp(-1.25, -0.7, x); crot = lerp(0.5, 0, x);
    applyPose(col, walk(t, 1.4));
  } else {
    if (t >= 17 && t <= 20.5) applyPose(col, present(t));
    else if (t >= 85 && t <= 92) applyPose(col, present(t));
    else if (t >= 109 && t <= 112.5) applyPose(col, { ...idle(t), neck: [0.12, 0.2, 0.06], armR: [-0.5, 0, 0.4], armL: [-0.4, 0, -0.35] });
    else applyPose(col, converse(t, 5, 0.6));
  }
  col.root.position.set(cx, 0, cz);
  col.root.rotation.set(0, crot, 0);
  if (t < 16) hold(col, "handR", P.magnifier);
  else if (t >= 17 && t <= 20.5) hold(col, "handR", P.teacup);
  else if (t >= 85 && t <= 92) hold(col, "handR", P.mars);
  else hold(col, "handR", null);
  hold(col, "handL", null);

  // iron stones appear on the table during the sale
  c.ironStones.forEach((s, i) => { s.visible = t > 93 + i * 0.6; });
  // safe door opens for the Mars stone insert
  c.safeDoor.rotation.y = -1.1 * clamp01(seg(t, 84, 86)) * (1 - clamp01(seg(t, 92, 94)));
  c.marsStone.visible = t >= 84 && t <= 94;
}

// ===========================================================================
// ACT 2 · THE BRIDGE
// ===========================================================================
function updateBridge(ctx: Ctx, t: number): void {
  const { cast, sets } = ctx;
  const b = sets.bridge;
  b.climber.position.y = -8 + ((t * 12) % 300);
  b.sunGlow.material.opacity = 0.7 + Math.sin(t * 0.5) * 0.05;
  if (b.office.visible) {
    const z = cast.civilian;
    z.root.removeFromParent(); b.office.add(z.root);
    z.root.position.set(-0.7, 0, -1.0); z.root.rotation.set(0, Math.PI, 0);
    applyPose(z, t >= 135 && t <= 141 ? converse(t, 2, 0.5) : idle(t));
    hold(z, "handR", null); hold(z, "handL", null);
    const ch = cast.chang;
    ch.root.removeFromParent(); b.office.add(ch.root);
    ch.root.position.set(0.75, 0, -1.25); ch.root.rotation.set(0, Math.PI - 0.2, 0);
    applyPose(ch, t >= 141 ? { ...idle(t), neck: [0.1, -0.15, 0], armR: [-0.3, 0, 0.15] } : idle(t));
  }
}

// ===========================================================================
// ACT 3 · THE WORKSHOP
// ===========================================================================
function updateWorkshop(ctx: Ctx, t: number): void {
  const { cast, sets } = ctx;
  const w = sets.workshop;
  const z = cast.civilian;
  z.root.removeFromParent(); w.group.add(z.root);
  z.root.position.set(0.35, 0, -0.55); z.root.rotation.set(0, Math.PI, 0);
  const cutting = t >= 152.5 && t <= 159.5;
  applyPose(z, tableWork(t, cutting ? 1 : 0.5));
  hold(z, "handR", null); hold(z, "handL", null);

  // spindle spins while cutting
  w.spindle.rotation.y = cutting ? t * 30 : t * 2;
  w.chuck.rotation.y = w.spindle.rotation.y;
  w.rawStone.rotation.y = w.spindle.rotation.y;
  w.rawStone.visible = t < 159.5;
  w.sparks.update(t, 153.2, 159.4, 0.45);
  // slugs accumulate in the tray
  const made = Math.floor(clamp01(seg(t, 153, 162)) * 36);
  w.slugs.forEach((s, i) => { s.visible = i < made; });
  w.shavings.visible = t >= 160.5;
  w.toolBit.visible = t < 163.4;
  w.screen.material.emissiveIntensity = 1.0 + Math.sin(t * 4) * 0.2;
  w.panelGlow.material.opacity = 0.35 + Math.sin(t * 4) * 0.08;
}

// ===========================================================================
// ACT 4 · THE BASEMENT
// ===========================================================================
function updateBasement(ctx: Ctx, t: number): void {
  const { cast, sets } = ctx;
  const b = sets.basement;
  const P = props();
  const z = cast.civilian;
  z.root.removeFromParent(); b.group.add(z.root);
  b.keyLight.intensity = 16 + Math.sin(t * 9) * 0.5;

  const aiming = t >= 186;
  let zx = 0.3, zz = 0.15, zrot = Math.PI;
  if (aiming) { zx = 0.5; zz = 0.35; zrot = Math.PI + 0.5; } // turn toward the corner bundle
  z.root.position.set(zx, 0, zz);
  z.root.rotation.set(0, zrot, 0);

  if (t < 186) {
    applyPose(z, tableWork(t, t >= 174 ? 1 : 0.4));
    if (t >= 174 && t <= 179) hold(z, "handR", P.pliers);
    else if (t >= 181 && t <= 185) hold(z, "handR", P.glue);
    else hold(z, "handR", null);
    hold(z, "handL", null);
  } else {
    // two-handed aim toward the bundle
    const recoil = FIRE_RECOIL(t, 189.0);
    applyPose(z, aim(-0.12 + recoil * 0.1, 0.5));
    hold(z, "handR", P.pistolRig);
    P.scope.visible = false;
    hold(z, "handL", null);
    z.joints.armL.rotation.set(-1.3, -0.2, -0.3);
  }

  // rounds appear as they are assembled
  const made = Math.floor(clamp01(seg(t, 174, 186)) * 36);
  b.rounds.forEach((r, i) => { r.visible = i < made; });

  // the test shot
  const sinceShot = t - 189.0;
  if (sinceShot >= 0 && sinceShot < 0.1) {
    b.flash.intensity = 18 * (1 - sinceShot / 0.1);
  } else b.flash.intensity = 0;
  b.smoke.update(t, 189.0, v3(-0.7, 1.15, -0.7), 2.6);
  b.holes.forEach((h) => { h.visible = t >= 189.1; });
  // bundle opened, beef revealed
  const open = clamp01(seg(t, 193, 194.5));
  b.bundle.scale.set(1 - open * 0.5, 0.85 - open * 0.4, 0.9 - open * 0.5);
  b.bundle.position.y = 0.42 - open * 0.1;
  b.beef.visible = t >= 193.5;
  b.gravel.visible = t >= 196;
}

/** Small recoil kick derived from time since a trigger pull. */
function FIRE_RECOIL(t: number, shotTime: number): number {
  const d = t - shotTime;
  if (d < 0 || d > 0.25) return 0;
  return Math.exp(-d * 18) * Math.sin(d * 60);
}

// ===========================================================================
// ACT 5 · SPACE
// ===========================================================================
function updateSpace(ctx: Ctx, t: number): void {
  const { cast, sets } = ctx;
  const s = sets.space;
  const P = props();
  const z = cast.suitZhang;
  z.root.removeFromParent();
  s.group.add(z.root);

  // ---- environment ----
  const sd = sunDir(t, _v);
  s.sun.position.copy(sd).multiplyScalar(900);
  s.sunGlow.position.copy(s.sun.position);
  s.sunFlare.position.copy(s.sun.position);
  const sunset = clamp01(seg(t, T.sunsetStart, T.sunsetStart + 50));
  s.sunGlow.material.opacity = 0.85 - sunset * 0.3;
  s.sunFlare.material.opacity = 0.5 * (1 - sunset * 0.6);
  s.sunLight.position.copy(sd).multiplyScalar(140);
  s.sunLight.target.position.set(0, 4, -55);
  s.sunLight.intensity = 3.0 - sunset * 0.8;
  s.atmo.material.opacity = 0.25 + sunset * 0.5;
  s.atmo.position.set(sd.x * 300, -30 + sd.y * 200, -360);
  s.wheel.rotation.z = t * 0.04;
  s.baseBeacon.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * 2));
  s.debris.children.forEach((d) => { const sp = d.userData.spin as number; d.rotation.x = t * sp; d.rotation.y = t * sp * 0.7; });

  // airlock: red -> green, door slides open
  const green = t >= T.exitStart;
  (s.airlockLight.material as THREE.MeshStandardMaterial).color.setHex(green ? 0x40ff60 : 0xff4040);
  (s.airlockLight.material as THREE.MeshStandardMaterial).emissive.setHex(green ? 0x20ff40 : 0xff2020);
  s.airlockGlow.material.color.setHex(green ? 0x40ff60 : 0xff4030);
  s.airlockDoor.position.x = -2.6 * clamp01(seg(t, T.exitStart, T.exitStart + 1.6));

  // ---- delegates ----
  updateDelegates(cast, t, _v2);

  // ---- Zhang pose & props ----
  const prep = t >= 268;
  const firing = t >= 278 && t <= 292;
  const watching = t > 292 && t < 322;
  const coda = t >= 322;

  // base floating position; coda accelerates toward Base One
  let px = 0, py = 0, pz = 0, rotY = Math.PI;
  if (coda) {
    const x = easeInOut(seg(t, THRUST_IGNITE, 352));
    // drift toward Base One at (-150,16,70)
    px = lerp(0, -55, x); py = lerp(0, 7, x); pz = lerp(0, 26, x);
    rotY = Math.PI + lerp(0, -0.9, clamp01(seg(t, 322, 328)));
  }
  z.root.position.set(px, py, pz);
  z.root.rotation.set(0, rotY, 0);

  if (coda) {
    applyPose(z, { ...float(t), armR: [-0.4, 0, 0.2], armL: [-0.4, 0, -0.2], legR: [-0.2, 0, 0.05], legL: [-0.2, 0, -0.05] });
    hold(z, "handR", null); hold(z, "handL", null);
    clothe(z, cast.tex.zhangUp);
  } else if (prep || firing || watching) {
    // glove off at 271
    clothe(z, t >= 271 ? cast.tex.zhangGloveOff : cast.tex.zhangUp);
    if (t >= 268 && t < 271) {
      // left hand twists the right glove ring
      applyPose(z, { ...float(t), armR: [-0.9, 0.3, 0.4], armL: [-1.3, -0.5, -0.5], neck: [0.2, 0.3, 0] });
      hold(z, "handR", null); hold(z, "handL", null);
    } else if (t >= 271 && t < 275) {
      // reach into the side pouch
      applyPose(z, { ...float(t), armR: [-0.5, 0.2, 0.6], armL: [-0.7, 0, -0.3], neck: [0.15, 0.2, 0] });
      hold(z, "handR", null); hold(z, "handL", null);
    } else {
      // armed: aim toward the station
      const recoil = nearestRecoil(t);
      applyPose(z, aim(-0.06 + recoil * 0.08, 0));
      hold(z, "handR", P.pistolRig);
      P.scope.visible = t >= 275.5;
      P.magazine.visible = true;
      // support hand
      z.joints.armL.rotation.set(-1.35, -0.15, -0.28);
      if (watching) { z.joints.armR.rotation.x += 0.12; } // slightly lowered, observing
    }
  } else {
    clothe(z, cast.tex.zhangUp);
    applyPose(z, drift(t));
    hold(z, "handR", null); hold(z, "handL", null);
  }

  // ---- muzzle flashes (silent in vacuum; visible firefly) ----
  let flash = 0;
  for (const ft of FIRE) {
    const d = t - ft;
    if (d >= 0 && d < 0.07) flash = Math.max(flash, 1 - d / 0.07);
  }
  s.flash.material.opacity = flash;
  s.flashLight.intensity = flash * 8;
  // place flash at the pistol muzzle, ahead of Zhang toward the station
  _v.set(0, 1.35, -1.0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY).add(z.root.position);
  s.flash.position.copy(_v);
  s.flashLight.position.copy(_v);
  s.flash.scale.setScalar(0.6 + flash * 1.2);

  // ---- bullet in flight (tracking shot) ----
  if (t >= FLIGHT_START && t <= IMPACT_T + 0.3) {
    s.bullet.visible = true;
    const x = clamp01(seg(t, FLIGHT_START, IMPACT_T));
    const start = v3(0, 1.35, -1.0);
    const end = delegatePos(0, IMPACT_T, _v2);
    s.bullet.position.lerpVectors(start, end, x);
    s.bullet.rotation.x = t * 20;
  } else s.bullet.visible = false;

  // ---- impacts: gas jets + blood-ice ----
  for (let i = 0; i < HIT.length; i++) {
    const idx = HIT[i]!;
    const pos = delegatePos(idx, IMPACT_T + 0.2, _v2);
    const born = IMPACT_T + i * 0.18;
    s.impacts[i]!.update(t, born, pos, 2.4);
    s.ice[i]!.update(t, born + 0.25, pos, 5.5, i === 0 ? 1 : 0.4);
  }
  // thruster trails during the return burn
  s.trails.update(t, T.returnStart, T.returnEnd, 1.5);
}

function nearestRecoil(t: number): number {
  let best = 0;
  for (const ft of FIRE) {
    const d = t - ft;
    if (d >= 0 && d < 0.22) best = Math.max(best, Math.exp(-d * 16) * Math.sin(d * 55));
  }
  for (const rt of RELOADS) {
    const d = t - rt;
    if (d >= 0 && d < 0.3) best = Math.max(best, Math.exp(-d * 12) * 0.3);
  }
  return best;
}

// ===========================================================================
// SHOT DEFINITIONS
// ===========================================================================
function cam(keys: CamKey[], localTime: number, camera: THREE.PerspectiveCamera, shake = 0): void {
  const s = sampleCam(keys, localTime);
  applyCam(camera, s);
  if (shake) handheld(camera, localTime, shake);
}

export function buildShots(ctx: Ctx): Shot<Ctx>[] {
  const shots: Shot<Ctx>[] = [];
  const add = (s: Shot<Ctx>) => shots.push(s);

  // ---- TITLE ----
  add({
    id: "title", start: 0, end: 6,
    enter: ({ context }) => {
      context.setStage(["collector"]);
      context.scope.off();
      context.cards.show("title", { zh: "陨石雨", en: "Meteorite Shower", sub: "改编自《三体 II · 黑暗森林》" });
    },
    update: ({ context, localTime }) => {
      updateCollector(context, 6); // hold the room at its opening state
      cam([
        { t: 0, pos: [-2.15, 1.3, -0.85], look: [-2.55, 0.97, -1.5], fov: 34 },
        { t: 6, pos: [-2.3, 1.15, -1.0], look: [-2.55, 0.97, -1.5], fov: 30 },
      ], localTime, context.camera, 0.004);
      if (localTime > 4.6) context.cards.hide("title");
    },
    leave: ({ context }) => { context.cards.hide("title"); },
  });

  // ---- COLLECTOR ----
  const collectorShot = (id: string, start: number, end: number, keys: CamKey[], shake = 0.006) => add({
    id, start, end,
    enter: ({ context }) => { context.setStage(["collector"]); context.scope.off(); },
    update: ({ context, time, localTime }) => { updateCollector(context, time); cam(keys, localTime, context.camera, shake); },
  });

  collectorShot("c_enter", 6, 19, [
    { t: 0, pos: [-3.4, 2.2, 3.0], look: [1.2, 1.0, -2.0], fov: 55 },
    { t: 13, pos: [-3.0, 2.0, 2.6], look: [1.0, 1.1, -1.8], fov: 52 },
  ]);
  collectorShot("c_soldier", 19, 32, [
    { t: 0, pos: [3.4, 1.6, 0.5], look: [1.3, 1.35, 0.3], fov: 40 },
    { t: 13, pos: [3.2, 1.55, 0.45], look: [1.35, 1.35, 0.25], fov: 38 },
  ]);
  collectorShot("c_survey", 32, 42, [
    { t: 0, pos: [3.0, 1.6, 0.0], look: [1.4, 1.5, -0.7], fov: 32 },
    { t: 5, pos: [2.9, 1.6, -0.1], look: [1.4, 1.5, -0.7], fov: 32 },
    { t: 10, pos: [3.1, 1.65, 1.1], look: [1.4, 1.58, 1.5], fov: 32 },
  ]);
  collectorShot("c_meteor", 42, 58, [
    { t: 0, pos: [0.5, 1.6, 1.6], look: [-1.5, 1.3, -3.3], fov: 46 },
    { t: 8, pos: [1.8, 1.55, 1.2], look: [0.0, 1.3, -3.3], fov: 44 },
    { t: 16, pos: [3.0, 1.6, 0.0], look: [1.4, 1.5, -0.7], fov: 34 },
  ]);
  collectorShot("c_tea", 58, 79, [
    { t: 0, pos: [3.1, 1.66, 1.1], look: [1.4, 1.58, 1.5], fov: 32 },
    { t: 10, pos: [2.95, 1.62, 1.25], look: [1.4, 1.55, 1.5], fov: 33 },
    { t: 21, pos: [3.0, 1.56, 0.0], look: [1.4, 1.5, -0.7], fov: 34 },
  ]);
  collectorShot("c_mars", 79, 92, [
    { t: 0, pos: [2.5, 1.15, -2.0], look: [3.3, 0.95, -2.85], fov: 32 },
    { t: 6, pos: [2.7, 1.05, -2.2], look: [3.3, 0.95, -2.85], fov: 28 },
    { t: 13, pos: [3.0, 1.55, 0.1], look: [1.4, 1.35, -0.7], fov: 36 },
  ]);
  collectorShot("c_business", 92, 109, [
    { t: 0, pos: [3.4, 1.6, 0.5], look: [1.3, 1.3, 0.3], fov: 40 },
    { t: 9, pos: [2.3, 1.25, 1.1], look: [1.4, 0.85, 0.35], fov: 32 },
    { t: 17, pos: [3.2, 1.55, 0.5], look: [1.35, 1.3, 0.25], fov: 38 },
  ]);
  collectorShot("c_respect", 109, 120, [
    { t: 0, pos: [3.0, 1.6, 0.0], look: [1.4, 1.5, -0.7], fov: 33 },
    { t: 4, pos: [3.1, 1.66, 1.1], look: [1.4, 1.58, 1.5], fov: 32 },
    { t: 11, pos: [3.6, 2.0, 3.0], look: [1.4, 1.2, 0.6], fov: 46 },
  ]);

  // ---- BRIDGE ----
  add({
    id: "b_vista", start: 120, end: 135,
    enter: ({ context }) => {
      context.setStage(["bridge"]);
      context.sets.bridge.vista.visible = true;
      context.sets.bridge.office.visible = false;
      context.scope.off();
      context.cards.show("era", { zh: "危机纪元", en: "The Crisis Era", place: true });
    },
    update: ({ context, localTime }) => {
      updateBridge(context, 120 + localTime);
      cam([
        { t: 0, pos: [0, 1.7, 8], look: [20, 20, -300], fov: 58 },
        { t: 15, pos: [0, 3.2, 5], look: [38, 60, -360], fov: 52 },
      ], localTime, context.camera, 0.01);
      if (localTime > 6) context.cards.hide("era");
    },
    leave: ({ context }) => { context.cards.hide("era"); },
  });
  add({
    id: "b_office", start: 135, end: 146,
    enter: ({ context }) => {
      context.setStage(["bridge"]);
      context.sets.bridge.vista.visible = false;
      context.sets.bridge.office.visible = true;
      context.scope.off();
    },
    update: ({ context, time, localTime }) => {
      updateBridge(context, time);
      cam([
        { t: 0, pos: [0.1, 1.62, 1.8], look: [0, 1.5, -2.2], fov: 45 },
        { t: 11, pos: [0.1, 1.58, 1.5], look: [0, 1.5, -2.4], fov: 42 },
      ], localTime, context.camera, 0.005);
    },
    leave: ({ context }) => { context.sets.bridge.office.visible = false; },
  });

  // ---- WORKSHOP ----
  add({
    id: "w_est", start: 146, end: 152.5,
    enter: ({ context }) => { context.setStage(["workshop"]); context.scope.off(); context.cards.show("shop", { zh: "太空军某研究所 · 模型车间", en: "After Hours", place: true }); },
    update: ({ context, time, localTime }) => {
      updateWorkshop(context, time);
      cam([
        { t: 0, pos: [3.6, 2.0, 3.0], look: [0, 1.2, -1.5], fov: 50 },
        { t: 6.5, pos: [3.0, 1.8, 2.4], look: [0, 1.15, -1.5], fov: 46 },
      ], localTime, context.camera, 0.006);
      if (localTime > 4) context.cards.hide("shop");
    },
    leave: ({ context }) => { context.cards.hide("shop"); },
  });
  add({
    id: "w_cut", start: 152.5, end: 160,
    enter: ({ context }) => { context.setStage(["workshop"]); context.scope.off(); },
    update: ({ context, time, localTime }) => {
      updateWorkshop(context, time);
      cam([
        { t: 0, pos: [2.2, 1.7, 0.8], look: [0, 1.1, -1.4], fov: 40 },
        { t: 7.5, pos: [1.9, 1.6, 0.6], look: [-0.1, 1.05, -1.45], fov: 38 },
      ], localTime, context.camera, 0.004);
    },
  });
  add({
    id: "w_finish", start: 160, end: 166,
    enter: ({ context }) => { context.setStage(["workshop"]); context.scope.off(); },
    update: ({ context, time, localTime }) => {
      updateWorkshop(context, time);
      cam([
        { t: 0, pos: [2.6, 1.5, 2.0], look: [2.6, 0.95, 0.6], fov: 40 },
        { t: 6, pos: [2.5, 1.3, 1.7], look: [2.55, 0.95, 0.6], fov: 36 },
      ], localTime, context.camera, 0.005);
    },
  });

  // ---- BASEMENT ----
  add({
    id: "bs_est", start: 166, end: 174,
    enter: ({ context }) => { context.setStage(["basement"]); context.scope.off(); context.cards.show("base", { zh: "某处 · 地下室", en: "The Basement", place: true }); },
    update: ({ context, time, localTime }) => {
      updateBasement(context, time);
      cam([
        { t: 0, pos: [1.7, 1.7, 1.7], look: [0, 1.0, -0.8], fov: 48 },
        { t: 8, pos: [1.5, 1.6, 1.4], look: [0, 0.95, -0.8], fov: 44 },
      ], localTime, context.camera, 0.006);
      if (localTime > 4) context.cards.hide("base");
    },
    leave: ({ context }) => { context.cards.hide("base"); },
  });
  add({
    id: "bs_work", start: 174, end: 186,
    enter: ({ context }) => { context.setStage(["basement"]); context.scope.off(); },
    update: ({ context, time, localTime }) => {
      updateBasement(context, time);
      cam([
        { t: 0, pos: [1.6, 1.5, 0.9], look: [0, 0.9, -0.7], fov: 40 },
        { t: 12, pos: [1.4, 1.4, 0.7], look: [0, 0.88, -0.75], fov: 38 },
      ], localTime, context.camera, 0.003);
    },
  });
  add({
    id: "bs_aim", start: 186, end: 189,
    enter: ({ context }) => { context.setStage(["basement"]); context.scope.off(); },
    update: ({ context, time, localTime }) => {
      updateBasement(context, time);
      cam([
        { t: 0, pos: [1.8, 1.5, 1.3], look: [-0.6, 0.9, -1.2], fov: 42 },
        { t: 3, pos: [1.6, 1.45, 1.1], look: [-0.9, 0.8, -1.3], fov: 40 },
      ], localTime, context.camera, 0.004);
    },
  });
  add({
    id: "bs_fire", start: 189, end: 193,
    enter: ({ context }) => { context.setStage(["basement"]); context.scope.off(); },
    update: ({ context, time, localTime }) => {
      updateBasement(context, time);
      cam([
        { t: 0, pos: [1.3, 1.6, 1.3], look: [-1.5, 0.5, -1.5], fov: 40 },
        { t: 0.1, pos: [1.32, 1.62, 1.32], look: [-1.5, 0.5, -1.5], fov: 40 },
        { t: 4, pos: [1.15, 1.5, 1.15], look: [-1.5, 0.5, -1.5], fov: 38 },
      ], localTime, context.camera, 0.02);
    },
  });
  add({
    id: "bs_examine", start: 193, end: 204,
    enter: ({ context }) => { context.setStage(["basement"]); context.scope.off(); },
    update: ({ context, time, localTime }) => {
      updateBasement(context, time);
      cam([
        { t: 0, pos: [-0.9, 0.95, -0.8], look: [-1.5, 0.45, -1.5], fov: 34 },
        { t: 4, pos: [-1.0, 0.85, -0.9], look: [-1.5, 0.42, -1.5], fov: 30 },
        { t: 7, pos: [0.9, 1.2, 0.3], look: [0.3, 0.9, -0.55], fov: 32 },
        { t: 11, pos: [1.6, 1.6, 1.5], look: [0.2, 1.0, -0.7], fov: 44 },
      ], localTime, context.camera, 0.004);
    },
  });

  // ---- SPACE ----
  const spaceShot = (id: string, start: number, end: number, keys: CamKey[], opts: { scope?: string | false; shake?: number; card?: () => void; hideCard?: string } = {}) => add({
    id, start, end,
    enter: ({ context }) => {
      context.setStage(["space"]);
      if (opts.scope) context.scope.on(opts.scope); else context.scope.off();
      if (opts.hideCard) context.cards.hide(opts.hideCard);
      opts.card?.();
    },
    update: ({ context, time, localTime }) => { updateSpace(context, time); cam(keys, localTime, context.camera, opts.shake ?? 0.008); },
    leave: ({ context }) => { context.scope.off(); },
  });

  spaceShot("sp_wide", 204, 222, [
    { t: 0, pos: [6, 2.5, 10], look: [0, 2, -60], fov: 55 },
    { t: 18, pos: [-5, 3.5, 7], look: [0, 3, -70], fov: 52 },
  ], { shake: 0.012, card: () => ctx.cards.show("orbit", { zh: "同步轨道 · 黄河空间站外五公里", en: "Geosynchronous Orbit", place: true }) });

  spaceShot("sp_void", 222, 240, [
    { t: 0, pos: [2.2, 1.7, 3.2], look: [0, 1.4, 0], fov: 42 },
    { t: 9, pos: [1.6, 1.9, 2.4], look: [0, 1.5, -0.5], fov: 38 },
    { t: 18, pos: [0.4, 1.75, 2.0], look: [0, 1.5, -2], fov: 40 },
  ], { shake: 0.01, hideCard: "orbit" });

  spaceShot("sp_sunset", 240, 246, [
    { t: 0, pos: [0.5, 1.6, 1.5], look: [70, -70, -880], fov: 38 },
    { t: 6, pos: [0.3, 1.6, 1.0], look: [78, -100, -890], fov: 32 },
  ], { shake: 0.006 });

  spaceShot("sp_airlock", 246, 253, [
    { t: 0, pos: [0, 1.5, 0.2], look: [0, 6, -90], fov: 9 },
    { t: 7, pos: [0, 1.5, 0.2], look: [0, 5, -70], fov: 11 },
  ], { scope: "过渡舱 · 气压已抽空", shake: 0.004 });

  spaceShot("sp_form", 253, 260, [
    { t: 0, pos: [0, 1.5, 0.2], look: [0, 5, -55], fov: 13 },
    { t: 7, pos: [0, 1.5, 0.2], look: [0, 5, -55], fov: 11 },
  ], { scope: "合影 · 队形整理中", shake: 0.004 });

  spaceShot("sp_visor", 260, 268, [
    { t: 0, pos: [0, 1.5, 0.2], look: [-6, 4.5, -52], fov: 10 },
    { t: 3, pos: [0, 1.5, 0.2], look: [0, 4.2, -52], fov: 8 },
    { t: 8, pos: [0, 1.5, 0.2], look: [1, 4.1, -52], fov: 7 },
  ], { scope: "目标确认 · 前排正中", shake: 0.003 });

  spaceShot("sp_prep", 268, 278, [
    { t: 0, pos: [1.8, 1.6, 1.6], look: [0, 1.3, 0], fov: 40 },
    { t: 5, pos: [1.2, 1.5, 1.0], look: [0, 1.3, -0.2], fov: 36 },
    { t: 10, pos: [0.7, 1.55, 0.8], look: [0, 1.4, -0.5], fov: 34 },
  ], { shake: 0.006 });

  spaceShot("sp_aim", 278, 282, [
    { t: 0, pos: [0, 1.5, 0.2], look: [-1, 4.2, -52], fov: 7 },
    { t: 4, pos: [0, 1.5, 0.2], look: [-1, 4.1, -52], fov: 6.5 },
  ], { scope: "距离 5.0 km · 弹道直线 · 真空", shake: 0.002 });

  spaceShot("sp_fire", 282, 292, [
    { t: 0, pos: [2.4, 1.7, 1.8], look: [0, 1.4, -30], fov: 42 },
    { t: 10, pos: [2.0, 1.6, 1.4], look: [0, 1.5, -40], fov: 40 },
  ], { shake: 0.01 });

  spaceShot("sp_flight", 292, 304, [
    { t: 0, pos: [0.6, 1.5, -2], look: [0, 1.4, -20], fov: 40 },
    { t: 6, pos: [0.4, 2.6, -22], look: [-0.5, 3.4, -45], fov: 36 },
    { t: 12, pos: [-0.6, 3.6, -44], look: [-1, 4.1, -52], fov: 30 },
  ], { shake: 0.006 });

  spaceShot("sp_impact", 304, 316, [
    { t: 0, pos: [0, 1.5, 0.2], look: [0, 4.2, -52], fov: 8 },
    { t: 4, pos: [0, 1.5, 0.2], look: [-1, 4.2, -52], fov: 7 },
    { t: 12, pos: [0, 1.5, 0.2], look: [1, 4.3, -52], fov: 7.5 },
  ], { scope: "命中 · 五名 · 气体泄漏", shake: 0.003 });

  spaceShot("sp_return", 316, 326, [
    { t: 0, pos: [0, 1.5, 0.2], look: [0, 5, -60], fov: 12 },
    { t: 10, pos: [0, 1.6, 0.4], look: [0, 6, -80], fov: 16 },
  ], { scope: "全体撤回 · 推进器全功率", shake: 0.005 });

  spaceShot("sp_coda", 326, 340, [
    { t: 0, pos: [3, 2, 5], look: [0, 1.5, 0], fov: 46 },
    { t: 14, pos: [-8, 3, 12], look: [-20, 4, 10], fov: 50 },
  ], { shake: 0.012 });

  spaceShot("sp_end", 340, 352, [
    { t: 0, pos: [-14, 4, 18], look: [-30, 5, 15], fov: 52 },
    { t: 12, pos: [-22, 6, 26], look: [-45, 6, 20], fov: 55 },
  ], { shake: 0.01, card: () => ctx.cards.show("end", { zh: "陨石雨", en: "Meteorite Shower", sub: "画面 · 声音 · 表演 全部由代码程序化生成" }) });

  return shots;
}
