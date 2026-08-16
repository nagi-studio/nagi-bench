import * as THREE from "three";
import { walk as walkPose, idle as idlePose } from "@agentbench/voxel-kit";
import type { FilmWorld, GroupMember } from "./world";
import { BULLET_AIMS } from "./world";
import { keyedPose, poseFigure, spaceFloatPose, spaceAimPose, groupPose } from "./world";
import { suitClothesSkin, suitClothesPainter } from "./characters";
import { FIRES, FLIGHT_TIME, HITS } from "./sfx";
import { clamp01, seg, mulberry32 } from "./util";

/* All state changes are pure functions of absolute time t, so pause, replay
 * and seeking always land on identical frames. */

const SMOOTH = (v: number) => v * v * (3 - 2 * v);

/* ---------------- cached once flags ---------------- */

interface Flags {
  gunSmoke: boolean;
  sparkCuts: Set<number>;
  departPuffs: boolean;
  screamCracked: boolean;
  smokeDone: boolean;
}

const flags: Flags = { gunSmoke: false, sparkCuts: new Set(), departPuffs: false, screamCracked: false, smokeDone: false };

function groupWorldPos(world: FilmWorld, i: number, t: number): THREE.Vector3 {
  const m = world.figures.group[i]!;
  return m.figure.root.position.clone();
}

/* ===================== hutong staging ===================== */

const ZHANG_WALK: Array<{ t: number; pos: [number, number, number]; yaw: number }> = [
  { t: 30, pos: [0, 0, -3.7], yaw: 0 },
  { t: 37.8, pos: [0, 0, 3.5], yaw: 0 },
  { t: 38.6, pos: [3.0, 0, -2.4], yaw: -2.3 },
  { t: 44.5, pos: [-0.9, 0, 1.9], yaw: 1.55 },
  { t: 84.5, pos: [-0.9, 0, 1.9], yaw: 1.55 },
  { t: 88.5, pos: [-0.05, 0, -1.7], yaw: 1.9 },
  { t: 108.5, pos: [-0.05, 0, -1.7], yaw: 1.9 },
  { t: 116.5, pos: [-1.0, 0, 2.75], yaw: Math.PI },
  { t: 142, pos: [-1.0, 0, 2.75], yaw: Math.PI },
  { t: 143, pos: [0, 0, -2.1], yaw: Math.PI }, // office window
];

const COLLECTOR_WALK: Array<{ t: number; pos: [number, number, number]; yaw: number }> = [
  { t: 38.5, pos: [2.45, 0, 2.6], yaw: -2.2 },
  { t: 47, pos: [1.5, 0, 2.0], yaw: -1.59 },
  { t: 84.5, pos: [1.5, 0, 2.0], yaw: -1.59 },
  { t: 88, pos: [-1.75, 0, -3.6], yaw: 0.35 },
  { t: 108.5, pos: [-1.75, 0, -3.6], yaw: 0.35 },
  { t: 114.5, pos: [0.3, 0, 1.75], yaw: -1.1 },
];

function sampleWalk(keys: Array<{ t: number; pos: [number, number, number]; yaw: number }>, t: number): { pos: [number, number, number]; yaw: number; moving: boolean } {
  if (t <= keys[0]!.t) return { pos: keys[0]!.pos, yaw: keys[0]!.yaw, moving: false };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!;
    const b = keys[i + 1]!;
    if (t >= a.t && t <= b.t) {
      const k = (t - a.t) / Math.max(1e-5, b.t - a.t);
      const e = SMOOTH(k);
      const dist = Math.hypot(b.pos[0] - a.pos[0], b.pos[2] - a.pos[2]);
      return {
        pos: [
          a.pos[0] + (b.pos[0] - a.pos[0]) * e,
          a.pos[1] + (b.pos[1] - a.pos[1]) * e,
          a.pos[2] + (b.pos[2] - a.pos[2]) * e,
        ],
        yaw: a.yaw + (b.yaw - a.yaw) * e,
        moving: dist > 0.5 && k < 0.95 && k > 0.02,
      };
    }
  }
  const last = keys[keys.length - 1]!;
  return { pos: last.pos, yaw: last.yaw, moving: false };
}

function zhangRoomPose(t: number): Parameters<typeof poseFigure>[1] {
  // subtle life: idle + small gestures
  if (t >= 122.5 && t <= 125.2) {
    return keyedPose([
      { t: 122.3, pose: { armR: [0, 0, 0.05] } },
      { t: 123.0, pose: { armR: [-1.0, 0, 0.3], neck: [0, 0.25, 0] } },
      { t: 125.6, pose: { armR: [-1.0, 0, 0.3], neck: [0, 0.25, 0] } },
      { t: 126.4, pose: { armR: [0, 0, 0.05], neck: [0, 0, 0] } },
    ], t);
  }
  if (t >= 96 && t <= 101.5) {
    // teacup lift
    return keyedPose([
      { t: 95.6, pose: {} },
      { t: 97.0, pose: { armL: [-1.25, 0, -0.15], neck: [0.06, 0, 0] } },
      { t: 101.2, pose: { armL: [-1.25, 0, -0.15] } },
      { t: 102.2, pose: { armL: [0, 0, 0] } },
    ], t);
  }
  if (t >= 136.8 && t <= 140) {
    return keyedPose([
      { t: 136.5, pose: {} },
      { t: 138.0, pose: { armR: [-0.85, 0, 0.25] } },
      { t: 140.2, pose: {} },
    ], t);
  }
  return idlePose(t * 0.8);
}

function collectorPose(t: number): Parameters<typeof poseFigure>[1] {
  if (t >= 56.2 && t <= 59.0) {
    // pouring
    return keyedPose([
      { t: 56.0, pose: {} },
      { t: 56.8, pose: { armR: [-0.95, 0, 0.3], neck: [0.15, 0, 0] } },
      { t: 58.6, pose: { armR: [-0.95, 0, 0.3] } },
      { t: 59.6, pose: {} },
    ], t);
  }
  if (t >= 86.5 && t <= 92.5) {
    // showing the specimen
    return keyedPose([
      { t: 86.2, pose: {} },
      { t: 87.5, pose: { armL: [-0.75, 0, -0.2] } },
      { t: 92.0, pose: { armL: [-0.75, 0, -0.2] } },
      { t: 93.2, pose: {} },
    ], t);
  }
  if (t >= 103 && t <= 106) {
    // laugh: head back
    return keyedPose([
      { t: 102.8, pose: {} },
      { t: 103.6, pose: { neck: [-0.25, 0.1, 0], hips: [0, 0.15, 0] } },
      { t: 105.6, pose: {} },
    ], t);
  }
  if (t >= 126.5 && t <= 131.5) {
    // embarrassment
    return keyedPose([
      { t: 126.2, pose: {} },
      { t: 127.5, pose: { neck: [0.28, -0.2, 0], armR: [0, 0, 0.1] } },
      { t: 131.5, pose: { neck: [0.28, -0.2, 0] } },
      { t: 132.5, pose: {} },
    ], t);
  }
  return idlePose(t * 0.7 + 2);
}

/* ===================== workshop staging ===================== */

function zhangWorkshopStage(t: number): { pos: [number, number, number]; yaw: number; moving: boolean } {
  if (t < 152.5) return { pos: [4.4, 0, 4.6], yaw: -2.1, moving: false };
  if (t >= 152.5 && t <= 160.5) {
    const e = SMOOTH(seg(t, 152.5, 160.5));
    return { pos: [4.4 - 2.8 * e, 0, 4.6 - 3.3 * e], yaw: -2.1, moving: true };
  }
  return { pos: [1.6, 0, 1.3], yaw: -2.1, moving: false };
}

function zhangWorkshopPose(t: number): Parameters<typeof poseFigure>[1] {
  if (t >= 162.0 && t <= 163.4) {
    return keyedPose([
      { t: 161.7, pose: {} },
      { t: 162.5, pose: { armR: [-1.1, 0, 0.3] } },
      { t: 163.6, pose: {} },
    ], t);
  }
  if (t >= 166.0 && t <= 168.0) {
    return keyedPose([
      { t: 165.7, pose: {} },
      { t: 166.6, pose: { armR: [-0.7, 0.25, 0.2] } },
      { t: 168.2, pose: {} },
    ], t);
  }
  if (t >= 193.5 && t <= 195.4) {
    return keyedPose([
      { t: 193.2, pose: {} },
      { t: 194.2, pose: { armR: [-0.5, 0.4, 0.15], hips: [0, 0.3, 0] } },
      { t: 195.6, pose: {} },
    ], t);
  }
  return idlePose(t * 0.6 + 1);
}

/* ===================== basement staging ===================== */

function zhangBasementStage(t: number): { pos: [number, number, number]; yaw: number; moving: boolean } {
  if (t < 198.5) return { pos: [0, 0, -3.2], yaw: -2.41, moving: false };
  if (t >= 198.5 && t <= 204.2) {
    const e = SMOOTH(seg(t, 198.5, 204.2));
    return { pos: [0.75 * e, 0, -3.2 + 4.98 * e], yaw: -2.41, moving: true };
  }
  let yaw = -2.41;
  if (t >= 222.5 && t <= 224.5) {
    yaw = -2.41 + (-1.28 - -2.41) * SMOOTH(seg(t, 222.5, 224.0));
  } else if (t >= 224.5) {
    yaw = -1.28;
  }
  return { pos: [0.75, 0, 1.78], yaw, moving: false };
}

function zhangBasementPose(t: number): Parameters<typeof poseFigure>[1] {
  if (t >= 211.2 && t <= 213.8) {
    return keyedPose([
      { t: 210.9, pose: {} },
      { t: 211.7, pose: { armR: [-1.05, 0, 0.2], neck: [0.3, 0, 0] } },
      { t: 213.9, pose: {} },
    ], t);
  }
  if (t >= 215.0 && t <= 217.2) {
    return keyedPose([
      { t: 214.7, pose: {} },
      { t: 215.6, pose: { armR: [-0.8, 0, -0.1], armL: [-0.9, 0, 0.1], neck: [0.25, 0, 0] } },
      { t: 217.4, pose: {} },
    ], t);
  }
  if (t >= 219.0 && t <= 221.0) {
    return keyedPose([
      { t: 218.7, pose: {} },
      { t: 219.6, pose: { armR: [-0.85, 0, 0.2] } },
      { t: 221.2, pose: { armR: [-0.85, 0, 0.2] } },
      { t: 222.0, pose: { armR: [-1.45, 0, 0.12] } },
    ], t);
  }
  if (t >= 224.3 && t <= 226.2) {
    // recoil + settle
    return keyedPose([
      { t: 224.25, pose: { armR: [-1.45, 0, 0.12], hips: [0, 0, 0] } },
      { t: 224.42, pose: { armR: [-1.62, 0, 0.2], hips: [-0.08, 0, 0] } },
      { t: 225.4, pose: { armR: [-1.45, 0, 0.12] } },
      { t: 226.4, pose: { armR: [-0.95, 0, 0.15] } },
    ], t);
  }
  if (t >= 227.2 && t <= 228.6) {
    return keyedPose([
      { t: 226.9, pose: {} },
      { t: 227.6, pose: { armL: [-0.9, 0, 0.2], neck: [0.2, -0.15, 0] } },
      { t: 228.8, pose: {} },
    ], t);
  }
  if (t >= 229.0 && t <= 232.0) {
    // palm up with gravel
    return keyedPose([
      { t: 228.8, pose: {} },
      { t: 229.8, pose: { armL: [-1.15, 0, -0.75], neck: [0.2, 0, 0] } },
      { t: 232.2, pose: { armL: [-1.15, 0, -0.75] } },
    ], t);
  }
  return idlePose(t * 0.6 + 3);
}

/* ===================== bay staging ===================== */

function zhangBayStage(t: number): { pos: [number, number, number]; yaw: number } {
  if (t < 340.5) return { pos: [0, 0, -4.4], yaw: 0 };
  if (t <= 342.6) {
    const e = SMOOTH(seg(t, 340.5, 342.6));
    return { pos: [1.05 - 1.05 * e, 0, -4.4 + 6.5 * e], yaw: 0 };
  }
  return { pos: [0, 0, 2.1], yaw: 0 };
}

/* ===================== the master update ===================== */

export function updateWorld(world: FilmWorld, t: number): void {
  const w = world;

  /* ---- overlay chrome ---- */
  w.overlay.update(t);

  /* ---- figures visibility ---- */
  const zhang = w.figures.zhang;
  const collector = w.figures.collector;
  zhang.root.visible = false;
  if (t >= 30 && t <= 142.5) {
    const s = sampleWalk(ZHANG_WALK, t);
    zhang.root.position.set(...s.pos);
    zhang.root.rotation.y = s.yaw;
    zhang.root.visible = true;
    const pose = s.moving ? walkPose(t * 1.15) : zhangRoomPose(t);
    poseFigure(zhang, pose);
  } else if (t > 142.5 && t <= 152.5) {
    // office
    zhang.root.position.set(0, 0, -2.1);
    zhang.root.rotation.y = Math.PI;
    zhang.root.visible = true;
    poseFigure(zhang, idlePose(t * 0.5));
  } else {
    poseFigure(zhang, {});
  }

  collector.root.visible = t >= 38.5 && t <= 142.5;
  if (collector.root.visible) {
    const s = sampleWalk(COLLECTOR_WALK, t);
    collector.root.position.set(...s.pos);
    collector.root.rotation.y = s.yaw;
    const pose = s.moving ? walkPose(t * 1.1 + 5) : collectorPose(t);
    poseFigure(collector, pose);
    // rock in hand while showing
    w.props.rockHand.visible = t >= 87.5 && t <= 93.0;
  } else {
    poseFigure(collector, {});
  }

  // teacup / phone / wrap
  w.props.phone.visible = t >= 123.0 && t <= 125.6;
  for (let i = 0; i < 3; i++) {
    const r = w.props.saleRocks[i]!;
    r.visible = t >= 116.5 + i && t <= 137.2;
  }
  w.props.clothWrap.visible = t >= 136.9 && t <= 142.5;

  /* ---- workshop ---- */
  const zws = w.figures.zhangWorkshop;
  zws.root.visible = t >= 152.5 && t <= 196.5;
  if (zws.root.visible) {
    const s = zhangWorkshopStage(t);
    zws.root.position.set(...s.pos);
    zws.root.rotation.y = s.yaw;
    poseFigure(zws, s.moving ? walkPose(t * 1.2 + 2) : zhangWorkshopPose(t));
  } else {
    poseFigure(zws, {});
  }

  // lathe animation
  const ws = w.sets.workshop;
  if (t >= 166 && t <= 194.5) {
    ws.chuck.rotation.x = (t - 166) * 42;
  }
  ws.carriage.position.x = 0.35 + 0.4 * SMOOTH(seg(t, 168, 192));
  const trayCount = Math.floor(seg(t, 189.2, 191.8) * 36);
  ws.trayCylinders.forEach((c, i) => {
    c.visible = i < trayCount;
  });
  // fluorescent light-on flash
  const fluo = ws.group.children.filter((o) => o.name === "fluo") as THREE.Mesh[];
  for (const f of fluo) {
    const m = f.material as THREE.MeshStandardMaterial;
    const on = t >= 162.2 ? 1.5 : 0.15;
    m.emissiveIntensity = on + (t >= 162.2 && t <= 162.9 ? Math.sin((t - 162.2) * 90) * 1.2 : 0);
  }
  // sparks at the cut instants
  const cutTimes = [170.5, 176.5, 182.5];
  for (const ct of cutTimes) {
    if (t >= ct && !flags.sparkCuts.has(ct)) {
      flags.sparkCuts.add(ct);
      const p = new THREE.Vector3();
      ws.toolContact.getWorldPosition(p);
      const rng = mulberry32(ct * 17);
      for (let i = 0; i < 46; i++) {
        w.fx.sparks.addEvent({
          t: ct + rng() * 0.4,
          pos: [p.x, p.y, p.z],
          dir: [rng() - 0.5, rng() * 0.8 + 0.2, rng() - 0.5],
          count: 1,
          speed: 1.6 + rng() * 2.4,
          spread: 0.9,
          life: 0.5,
          size: 0.045,
          color: [1.0, 0.72, 0.3],
          colorB: [0.7, 0.25, 0.05],
          additive: true,
          gravity: 9,
          drag: 0.4,
          seed: Math.floor(ct * 100 + i),
        });
      }
    }
  }

  /* ---- basement ---- */
  const zbs = w.figures.zhangBasement;
  zbs.root.visible = t >= 198.5 && t <= 233.5;
  if (zbs.root.visible) {
    const s = zhangBasementStage(t);
    zbs.root.position.set(...s.pos);
    zbs.root.rotation.y = s.yaw;
    poseFigure(zbs, s.moving ? walkPose(t * 1.25 + 1) : zhangBasementPose(t));
  } else {
    poseFigure(zbs, {});
  }

  const bm = w.sets.basement;
  // bullet holes + bag jolt after the shot
  const shotAt = 224.3;
  const jolt = t > shotAt ? Math.exp(-(t - shotAt) / 0.16) * 0.05 : 0;
  bm.bag.position.y = 0.72 + jolt;
  bm.bag.rotation.z = jolt * 2.4;
  for (const h of bm.bulletHoles) h.visible = t >= 224.65;

  // gun smoke + muzzle flash in the basement
  if (t >= shotAt && !flags.gunSmoke) {
    flags.gunSmoke = true;
    const p = new THREE.Vector3();
    zbs.anchors.handR.getWorldPosition(p);
    const rng = mulberry32(411);
    for (let i = 0; i < 26; i++) {
      w.fx.smoke.addEvent({
        t: shotAt + rng() * 0.3,
        pos: [p.x, p.y, p.z],
        dir: [0.1 + rng() * 0.3, 0.2 + rng() * 0.5, -rng() * 0.4],
        count: 1,
        speed: 0.5 + rng() * 0.7,
        spread: 1.2,
        life: 1.4 + rng() * 1.2,
        size: 0.16 + rng() * 0.2,
        color: [0.55, 0.53, 0.5],
        colorB: [0.3, 0.29, 0.28],
        grow: 3.2,
        drag: 0.85,
        seed: Math.floor(i * 7.3),
      });
    }
  }

  /* ---- space world ---- */
  const space = w.sets.space;
  const zhangS = w.figures.zhangSpace;
  const zhangP = w.figures.zhangSpacePrologue;
  zhangP.root.visible = t < 30.5;
  if (zhangP.root.visible) {
    poseFigure(zhangP, spaceFloatPose(t, 0));
    zhangP.root.position.set(0, 40 + Math.sin(t * 0.4) * 0.4, 60);
  } else {
    poseFigure(zhangP, {});
  }

  zhangS.root.visible = t >= 233.5 && t <= 341;
  if (zhangS.root.visible) {
    // aim window
    const aiming = t >= 289.5 && t <= 312.6;
    const pose = aiming ? spaceAimPose(t, 0, 0.02) : spaceFloatPose(t, 1);
    poseFigure(zhangS, pose);
    w.props.zhangPistol.visible = t >= 289.5;
    w.props.zhangScope.visible = t >= 290.9;
    w.props.spareMag.visible = (t >= 291.2 && t <= 292.0) || (t >= 307.0 && t <= 308.2) || (t >= 301.8 && t <= 303.3);
    // turn toward base one and depart
    if (t < 336.5) {
      zhangS.root.rotation.y = Math.PI;
      zhangS.root.position.set(0, 40 + Math.sin(t * 0.5) * 0.6, 60);
    } else {
      const k = SMOOTH(seg(t, 336.5, 337.6));
      zhangS.root.rotation.y = Math.PI + (0.904 - Math.PI) * k;
      const acc = 26 * SMOOTH(seg(t, 337.2, 340));
      const dt = Math.max(0, t - 337.2);
      const dist = 0.5 * acc * dt * dt;
      const dir = new THREE.Vector3(38000, -8040, 29940).normalize();
      zhangS.root.position.set(0 + dir.x * dist, 40 + dir.y * dist, 60 + dir.z * dist);
      // departure plume
      if (t >= 337.2 && !flags.departPuffs) {
        flags.departPuffs = true;
        const rng = mulberry32(55);
        for (let i = 0; i < 40; i++) {
          w.fx.thrusterPuffs.addEvent({
            t: 337.2 + rng() * 0.8,
            pos: [0, 40, 60],
            dir: [-dir.x * 0.8, -dir.y * 0.8, -dir.z * 0.8],
            count: 1,
            speed: 3 + rng() * 4,
            spread: 0.55,
            life: 0.9 + rng() * 0.7,
            size: 0.5 + rng() * 0.5,
            color: [0.85, 0.9, 1.0],
            grow: 2.4,
            drag: 0.5,
            seed: Math.floor(i * 3.1),
          });
        }
      }
    }
  } else {
    poseFigure(zhangS, {});
  }

  // sun descent
  const sunK = Math.pow(SMOOTH(seg(t, 233.5, 337.5)), 1.1);
  const sunY = -6600 - 3000 * sunK;
  space.sun.position.y = sunY;
  space.sunGlow.position.copy(space.sun.position);

  // station rotation + door
  space.stationRim.rotation.y = t * 0.012;
  const exitPanel = space.station.getObjectByName("exit-panel") as THREE.Mesh;
  const exitLamp = space.exitLamp;
  if (exitPanel) {
    exitPanel.position.y = t >= 271.4 ? 2.4 * SMOOTH(seg(t, 271.4, 272.4)) : 0;
  }
  if (exitLamp) {
    const mat = exitLamp.material as THREE.MeshStandardMaterial;
    if (t >= 270.8) {
      mat.color.setHex(0x7dff9a);
      mat.emissive.setHex(0x2aff6a);
    } else {
      mat.color.setHex(0xff5a48);
      mat.emissive.setHex(0xff3a28);
    }
  }

  // beacon blink
  const bMat = space.beacon.material as THREE.MeshStandardMaterial;
  bMat.emissiveIntensity = 1.2 + 0.9 * Math.abs(Math.sin(t * 3.1));

  // debris drift
  space.stars.rotation.y = t * 0.0015;

  /* ---- group staging ---- */
  const emergeStart = 271.4;
  const emergeEnd = 278.8;
  const panicBase = SMOOTH(seg(t, 325.6, 329));
  const fleeK = SMOOTH(seg(t, 326.6, 333.4));
  const exitPoint = new THREE.Vector3(0, -1618, -5193);

  for (let i = 0; i < w.figures.group.length; i++) {
    const m: GroupMember = w.figures.group[i]!;
    const vis = t >= emergeStart && t <= 341;
    m.figure.root.visible = vis;
    if (!vis) continue;
    let pos: THREE.Vector3;
    if (t < emergeStart) {
      pos = exitPoint.clone();
    } else if (t < emergeEnd) {
      const e = SMOOTH(seg(t, emergeStart, emergeEnd));
      pos = exitPoint.clone().lerp(m.base, e);
    } else {
      pos = m.base.clone();
      if (fleeK > 0) {
        const dirToStation = new THREE.Vector3(0, -1600, -5200).sub(m.base).normalize();
        pos.addScaledVector(dirToStation, fleeK * 210);
      }
    }
    // gentle drift
    pos.x += Math.sin(t * 0.3 + m.phase) * 0.35;
    pos.y += Math.sin(t * 0.24 + m.phase * 1.7) * 0.3;
    pos.z += Math.cos(t * 0.28 + m.phase) * 0.35;
    m.figure.root.position.copy(pos);
    const p = m.hit ? 1 : panicBase * (0.7 + 0.3 * Math.sin(m.phase * 3));
    poseFigure(m.figure, groupPose(t, m, p));
  }

  // photographer
  const ph = w.figures.photographer;
  ph.root.visible = t >= 272 && t <= 341;
  if (ph.root.visible) {
    const base = w.figures.group[8]!.base.clone().addScaledVector(new THREE.Vector3(0.21, 0, 0.978), 2.6).addScaledVector(new THREE.Vector3(0, -0.977, -0.21), -1.2);
    let pos: THREE.Vector3;
    if (t < emergeEnd) {
      const e = SMOOTH(seg(t, emergeStart, emergeEnd));
      pos = exitPoint.clone().lerp(base, e);
    } else {
      pos = base.clone();
      if (fleeK > 0) {
        const dirToStation = new THREE.Vector3(0, -1600, -5200).sub(base).normalize();
        pos.addScaledVector(dirToStation, fleeK * 210);
      }
    }
    ph.root.position.copy(pos);
    poseFigure(ph, groupPose(t, { figure: ph, target: -1, base, phase: 9, hit: false }, panicBase));
  } else {
    poseFigure(ph, {});
  }

  /* ---- scream figure swap + cracked visor ---- */
  const scream = w.figures.scream;
  const aMember = w.figures.group[0]!;
  const swapAt = 310.34 + 0.4;
  if (t >= swapAt && t <= 341) {
    aMember.figure.root.visible = false;
    scream.root.visible = true;
    scream.root.position.copy(groupWorldPos(w, 0, t));
    poseFigure(scream, groupPose(t, { figure: scream, target: -1, base: aMember.base, phase: 0, hit: true }, 1));
    if (!flags.screamCracked) {
      flags.screamCracked = true;
      const skin = suitClothesSkin("scream", { band: "gold", bodyFace: SCREAM_FACE_REF });
      skin.repaint(suitClothesPainter({ band: "gold", bodyFace: SCREAM_FACE_REF, cracked: true }));
    }
  } else if (t < swapAt) {
    scream.root.visible = false;
  }

  /* ---- impact effects (gas / blood) added lazily, deterministically ---- */
  for (const hit of HITS) {
    if (t >= hit.t && !hitSpawned(hit.bullet)) {
      markHitSpawned(hit.bullet);
      spawnHitEffects(w, hit);
    }
  }

  /* ---- muzzle flash + firefly ---- */
  let amp = 0;
  for (const tf of FIRES) {
    if (t >= tf) amp = Math.max(amp, Math.exp(-(t - tf) / 0.055));
  }
  const flashOn = amp > 0.02 && t >= 289 && t <= 315;
  w.fx.muzzleFlash.visible = flashOn;
  w.fx.firefly.visible = flashOn;
  if (flashOn) {
    const p = new THREE.Vector3();
    zhangS.anchors.handR.getWorldPosition(p);
    w.fx.muzzleFlash.position.copy(p);
    w.fx.muzzleFlash.scale.setScalar(0.6 + amp * 2.6);
    (w.fx.muzzleFlash.material as THREE.SpriteMaterial).opacity = clamp01(amp);
    w.fx.muzzleLight.position.copy(p);
    w.fx.muzzleLight.intensity = amp * 2600;
    const camDist = w.camera.position.distanceTo(w.fx.firefly.position);
    w.fx.firefly.position.set(0, 41, 62);
    w.fx.firefly.scale.setScalar(Math.min(420, camDist * 0.045 + amp * camDist * 0.05));
    (w.fx.firefly.material as THREE.SpriteMaterial).opacity = clamp01(amp * 0.9);
  } else {
    w.fx.muzzleLight.intensity = 0;
  }

  /* ---- tracers ---- */
  const zhangPos = new THREE.Vector3(0, 40, 60);
  for (let b = 0; b < 30; b++) {
    const tr = w.fx.tracers[b]!;
    const tf = FIRES[b]!;
    const k = (t - tf) / FLIGHT_TIME;
    if (k > 0.02 && k < 0.985) {
      const aim = bulletAimPoint(w, b);
      const dir = aim.clone().sub(zhangPos).normalize();
      const dist = aim.distanceTo(zhangPos);
      const pos = zhangPos.clone().addScaledVector(dir, k * dist);
      tr.visible = true;
      tr.position.copy(pos);
      tr.lookAt(pos.clone().add(dir));
      const fade = k > 0.9 ? (0.985 - k) / 0.085 : 1;
      (tr.material as THREE.MeshBasicMaterial).opacity = 0.7 * fade;
    } else {
      tr.visible = false;
    }
  }

  /* ---- fx systems ---- */
  w.fx.sparks.update(t);
  w.fx.smoke.update(t);
  w.fx.gas.update(t);
  w.fx.blood.update(t);
  w.fx.thrusterPuffs.update(t);
  w.fx.dustRoom.update(t);
  w.fx.dustWorkshop.update(t);

  /* ---- bay ---- */
  const zbay = w.figures.zhangBay;
  zbay.root.visible = t >= 340.5 && t <= 348;
  if (zbay.root.visible) {
    const s = zhangBayStage(t);
    zbay.root.position.set(...s.pos);
    zbay.root.rotation.y = s.yaw;
    // lie down into the pod
    if (t >= 343.2) {
      const k = SMOOTH(seg(t, 343.2, 344.3));
      zbay.root.rotation.x = Math.PI / 2 * k;
      zbay.root.position.y = 0.98 * k;
      zbay.root.position.z = 2.1 - 1.35 * k;
      poseFigure(zbay, { armR: [0, 0, 0.06], armL: [0, 0, -0.06] });
    } else {
      poseFigure(zbay, idlePose(t * 0.5 + 4));
    }
  } else {
    poseFigure(zbay, {});
  }
  const bay = w.sets.bay;
  bay.podLid.rotation.z = -2.5 * (1 - SMOOTH(seg(t, 344.5, 345.9)));
  bay.podLight.intensity = t >= 344.8 ? 11 + 2.4 * Math.sin(t * 2.2) : 4;
  // dim the white ceiling lights once the lid closes, letting the pod glow take over
  const ceilingK = t >= 344.5 ? 0.18 : 1;
  for (const child of bay.group.children) {
    if ((child as THREE.PointLight).isPointLight && child.position.y > 2) {
      (child as THREE.PointLight).intensity = 15 * ceilingK;
    }
  }

  /* ---- cabin insert led ---- */
  const led = w.sets.cabin.group.getObjectByName("unit-led") as THREE.Mesh | null;
  if (led) {
    const m = led.material as THREE.MeshStandardMaterial;
    m.emissiveIntensity = Math.sin(t * 5) > 0 ? 2.4 : 0.15;
  }

  /* ---- reticle overlay ---- */
  const reticle = document.getElementById("reticle");
  if (reticle) {
    const a = t >= 286.5 && t <= 322 ? clamp01(Math.min(seg(t, 286.5, 287.6), seg(322, 321.2, 322))) : 0;
    reticle.style.opacity = String(0.9 * a);
    // jolt on each shot
    let joltX = 0;
    let joltY = 0;
    for (const tf of FIRES) {
      if (t >= tf && t <= tf + 0.25) {
        const jk = Math.exp(-(t - tf) / 0.06);
        joltX = Math.sin(tf * 13.7) * 9 * jk;
        joltY = Math.cos(tf * 9.1) * 9 * jk;
        break;
      }
    }
    reticle.style.transform = `translate(calc(-50% + ${joltX.toFixed(2)}px), calc(-50% + ${joltY.toFixed(2)}px))`;
  }

  /* ---- play hint after first play is handled by main.ts ---- */
}

/* ---------------- hit effects ---------------- */

const hitSpawnedSet = new Set<number>();
function hitSpawned(b: number): boolean {
  return hitSpawnedSet.has(b);
}
function markHitSpawned(b: number): void {
  hitSpawnedSet.add(b);
}

const SCREAM_FACE_REF = {
  skin: "#d4ab7f", skinShade: "#b98d5e", hair: "#e2e6ec", hairTopRows: 2, hairSideRows: 3,
  brows: "#c9cdd4", eyes: [1, 5] as [number, number], mouth: "open" as const, browY: 2,
  ageLines: true, nose: true,
};

function spawnHitEffects(w: FilmWorld, hit: (typeof HITS)[number]): void {
  const member = w.figures.group[hit.target]!;
  const pos = member.base.clone();
  const zhangPos = new THREE.Vector3(0, 40, 60);
  const dirIn = pos.clone().sub(zhangPos).normalize();

  // white gas jet
  const rng = mulberry32(hit.bullet * 91 + 7);
  for (let i = 0; i < 14; i++) {
    w.fx.gas.addEvent({
      t: hit.t + rng() * 0.12,
      pos: [pos.x, pos.y, pos.z],
      dir: [dirIn.x, dirIn.y, dirIn.z],
      count: 1,
      speed: 1.2 + rng() * 3.2,
      spread: 1.15,
      life: 1.3 + rng() * 1.4,
      size: 0.24 + rng() * 0.3,
      color: [0.95, 0.97, 1.0],
      colorB: [0.6, 0.68, 0.8],
      grow: 2.6,
      drag: 0.55,
      seed: Math.floor(hit.bullet * 40 + i * 3.3),
    });
  }
  if (hit.burst) {
    // ruptured thruster: big plume
    for (let i = 0; i < 30; i++) {
      w.fx.gas.addEvent({
        t: hit.t + 0.15 + rng() * 0.5,
        pos: [pos.x + 0.5, pos.y - 0.2, pos.z + 0.7],
        dir: [dirIn.x * 0.4, dirIn.y * 0.4 - 0.5, dirIn.z * 0.4],
        count: 1,
        speed: 2 + rng() * 5,
        spread: 0.8,
        life: 1.6 + rng() * 1.6,
        size: 0.5 + rng() * 0.8,
        color: [1.0, 1.0, 1.0],
        colorB: [0.7, 0.75, 0.85],
        grow: 3.0,
        drag: 0.4,
        seed: Math.floor(1000 + i * 5.1),
      });
    }
  }
  if (hit.blood) {
    for (let i = 0; i < 16; i++) {
      w.fx.blood.addEvent({
        t: hit.t + rng() * 0.15,
        pos: [pos.x, pos.y + 0.2, pos.z],
        dir: [dirIn.x * 0.5, dirIn.y * 0.5 + 0.3, dirIn.z * 0.5],
        count: 1,
        speed: 0.5 + rng() * 1.6,
        spread: 1.2,
        life: 2.4 + rng() * 2.2,
        size: 0.07 + rng() * 0.1,
        color: [0.78, 0.1, 0.08],
        colorB: [0.98, 0.75, 0.8],
        grow: 1.4,
        drag: 0.9,
        seed: Math.floor(2000 + hit.bullet * 60 + i * 2.7),
      });
    }
  }
}

function bulletAimPoint(w: FilmWorld, b: number): THREE.Vector3 {
  const aimDef = BULLET_AIMS[b]!;
  if (aimDef.member === null) {
    const base = w.figures.group[4]!.base;
    return base.clone().add(aimDef.offset);
  }
  const m = w.figures.group[aimDef.member]!;
  return m.base.clone().add(aimDef.offset);
}
