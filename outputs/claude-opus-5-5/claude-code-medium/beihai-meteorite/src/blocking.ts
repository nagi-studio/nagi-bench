import * as THREE from "three";
import { applyPose, walk, float, idle, aim, lerpPose, PX_METRES, type Pose, type Figure } from "@agentbench/voxel-kit";
import type { World, GroupMember } from "./world";
import type { Actor } from "./characters";
import { voiceCues, SHOT_TIMES, TEST_SHOTS } from "./cues";
import { seg, sseg, eseg, mix, hash3, worldPosOffset, v3 } from "./util";
import { sunDirection, EARTH_CENTER, HATCH, BASE1, SUN_DIST, earthDir } from "./space";
import type { Emitter } from "./particles";

const PI = Math.PI;

/* ------------------------------------------------------------------ */
/* pose utilities                                                      */
/* ------------------------------------------------------------------ */

type J = "hips" | "neck" | "armR" | "armL" | "legR" | "legL";
const JOINTS: J[] = ["hips", "neck", "armR", "armL", "legR", "legL"];

export function over(...poses: Pose[]): Pose {
  const out: Pose = {};
  for (const p of poses) {
    for (const j of JOINTS) if (p[j]) out[j] = [...p[j]!] as [number, number, number];
    if (p.lift !== undefined) out.lift = p.lift;
  }
  return out;
}
export function add(a: Pose, b: Pose): Pose {
  const out: Pose = {};
  for (const j of JOINTS) {
    const x = a[j] ?? [0, 0, 0], y = b[j] ?? [0, 0, 0];
    out[j] = [x[0] + y[0], x[1] + y[1], x[2] + y[2]];
  }
  out.lift = (a.lift ?? 0) + (b.lift ?? 0);
  return out;
}
export const blend = (a: Pose, b: Pose, t: number) => lerpPose(a, b, Math.max(0, Math.min(1, t)));

export function liftFor(actor: Actor, hipHeightM: number) {
  const px = (PX_METRES * actor.fig.root.scale.x) / PX_METRES * PX_METRES; // metres per px after scaling
  const metresPerPx = actor.fig.root.scale.x;
  void px;
  return hipHeightM / metresPerPx - 12;
}

export function seated(actor: Actor, seatY = 0.52): Pose {
  return {
    legR: [-PI / 2 + 0.05, 0, 0.06],
    legL: [-PI / 2 + 0.05, 0, -0.06],
    armR: [-0.62, 0, 0.12],
    armL: [-0.62, 0, -0.12],
    lift: liftFor(actor, seatY),
  };
}

/** Standing in weightlessness: legs loosely together, arms drifting. */
export function hover(t: number, seed = 0): Pose {
  const s = Math.sin(t * 0.6 + seed);
  return {
    hips: [Math.sin(t * 0.4 + seed) * 0.05, Math.sin(t * 0.27 + seed * 2) * 0.06, Math.sin(t * 0.33 + seed) * 0.04],
    neck: [Math.sin(t * 0.5 + seed) * 0.05, Math.sin(t * 0.3 + seed * 3) * 0.1, 0],
    armR: [-0.25 + s * 0.06, 0, 0.32 + Math.sin(t * 0.7 + seed) * 0.05],
    armL: [-0.2 - s * 0.06, 0, -0.32 - Math.sin(t * 0.8 + seed) * 0.05],
    legR: [-0.12 + Math.sin(t * 0.45 + seed) * 0.05, 0, 0.05],
    legL: [0.05 + Math.sin(t * 0.5 + seed + 1) * 0.05, 0, -0.05],
  };
}

/** Lip flap derived from the speech manifest. */
export function speaking(t: number, speaker: string): boolean {
  for (const c of voiceCues) {
    if (c.kind !== "dialogue") continue;
    if (c.speaker === speaker && t >= c.start && t < c.end - 0.15) return true;
  }
  return false;
}
export function face(actor: Actor, t: number, speaker: string, base: string) {
  const talking = speaking(t, speaker);
  const open = Math.sin(t * 17.3) + Math.sin(t * 7.1 + 1.3) * 0.8 > 0.1;
  actor.setExpr(talking && open ? "talk" : base);
}

export function place(fig: Figure, parent: THREE.Object3D, x: number, y: number, z: number, rotY: number) {
  if (fig.root.parent !== parent) parent.add(fig.root);
  fig.root.position.set(x, y, z);
  fig.root.rotation.set(0, rotY, 0);
  fig.root.visible = true;
}

export function headWorld(fig: Figure, out = new THREE.Vector3()) {
  return worldPosOffset(fig.joints.neck, v3(0, 4, 1), out);
}
export function eyeWorld(fig: Figure, out = new THREE.Vector3()) {
  return worldPosOffset(fig.joints.neck, v3(0, 4.3, 4.2), out);
}
export function chestWorld(fig: Figure, out = new THREE.Vector3()) {
  return worldPosOffset(fig.joints.hips, v3(0, 8, 2), out);
}
export function handWorld(fig: Figure, which: "handR" | "handL", out = new THREE.Vector3()) {
  return worldPosOffset(fig.anchors[which], v3(0, 0, 0), out);
}

/* ------------------------------------------------------------------ */
/* World blocking                                                      */
/* ------------------------------------------------------------------ */

export function makeBlocking(W: World) {
  const { zhang, collector, zProps, cProps, zhangGear, room, hutong, workshop, basement, cabin } = W;
  const allZ = Object.values(zProps);
  const allC = Object.values(cProps);
  const zParent = (m: THREE.Object3D, anchor: THREE.Object3D) => { if (m.parent !== anchor) anchor.add(m); };

  function resetProps() {
    for (const m of allZ) m.visible = false;
    for (const m of allC) m.visible = false;
    zhangGear.helmet.visible = false;
    zhangGear.pack.visible = false;
    W.flashSprite.visible = false;
    W.flashLight.intensity = 0;
    W.zhang.fig.root.visible = false;
    W.collector.fig.root.visible = false;
  }

  function dress(mode: "coat" | "suit" | "suitBare", visorClear = 1) {
    const tex = mode === "coat" ? W.zhangCoat : mode === "suit" ? W.zhangSuit : W.zhangSuitBare;
    if ((zhang.fig.clothing.torso.material as THREE.MeshStandardMaterial).map !== tex) zhang.fig.setClothes(tex);
    const suit = mode !== "coat";
    zhangGear.helmet.visible = suit;
    zhangGear.pack.visible = suit;
    if (suit) zhangGear.setVisor(visorClear);
  }

  /* ============================ HUTONG ============================ */
  function hutongState(t: number) {
    const g = hutong.set.group;
    dress("coat");
    if (t < 100) {
      // arrival
      const w = seg(t, 45, 55);
      const z = mix(-24, -9.6, w);
      let rot = 0;
      let x = 0.4;
      let pose: Pose = walk(t, 0.9);
      if (t > 55) {
        const k = eseg(t, 55, 56.2);
        rot = mix(0, PI / 2, k);
        x = mix(0.4, 1.4, k);
        pose = blend(walk(t, 0.9), idle(t), k);
      }
      place(zhang.fig, g, x, 0, z, rot);
      applyPose(zhang.fig, add(pose, { neck: [0.05, t > 52 ? 0.25 * sseg(t, 52, 54) : 0, 0] }));
      zhang.setExpr("neutral");
    } else {
      // leaving with the stones wrapped in cloth
      const w = seg(t, 158.3, 163);
      place(zhang.fig, g, mix(1.6, 0.3, sseg(t, 158.3, 159.5)), 0, mix(-9.3, -16.5, w), PI);
      applyPose(zhang.fig, over(walk(t, 0.85), { armR: [-0.25, 0, 0.12] }));
      zParent(zProps.shards, zhang.fig.anchors.handR);
      zProps.shards.visible = false;
      zhang.setExpr("neutral");
    }
    for (const l of hutong.lanterns) l.intensity = 4 + Math.sin(t * 9.1) * 0.15;
  }

  /* ============================ ROOM ============================ */
  const tableTop = 0.55;
  function roomState(t: number) {
    const g = room.set.group;
    dress("coat");
    // ---- Zhang ----
    if (t < 62.5) {
      const k = eseg(t, 57.2, 62.3);
      const x = mix(-0.3, -2.1, k), z = mix(2.5, 1.0, k);
      const rot = mix(PI, -PI / 2, eseg(t, 59.5, 62.3));
      place(zhang.fig, g, x, 0, z, rot);
      applyPose(zhang.fig, add(blend(walk(t, 0.8), idle(t), seg(t, 61.6, 62.4)), { neck: [0, Math.sin(t * 0.7) * 0.4, 0] }));
      zhang.setExpr("neutral");
    } else if (t < 69.6) {
      place(zhang.fig, g, -2.1, 0, 1.0, -PI / 2);
      const look = Math.sin((t - 62.5) * 0.45);
      applyPose(zhang.fig, add(idle(t), { neck: [0.18, look * 0.45, 0], hips: [0, look * 0.12, 0], armL: [0, 0, 0], armR: [-0.1, 0, 0.1] }));
      zhang.setExpr("neutral");
    } else if (t < 71.4) {
      const k = eseg(t, 69.6, 71.2);
      place(zhang.fig, g, mix(-2.1, -1.25, k), 0, mix(1.0, 0.8, k), mix(-PI / 2, PI / 2 + 2 * PI * 0, k) + (k > 0 ? PI * k : 0));
      applyPose(zhang.fig, blend(walk(t, 0.8), seated(zhang), sseg(t, 70.4, 71.3)));
    } else {
      place(zhang.fig, g, -1.25, 0, 0.8, PI / 2);
      let pose = seated(zhang);
      // drinking / gesturing / phone
      if (t > 96.4 && t < 101.4) {
        const up = sseg(t, 96.4, 97.2) * (1 - sseg(t, 100.4, 101.3));
        pose = add(pose, { armR: [-0.95 * up, 0.0, 0.25 * up] });
      }
      if (t > 92.9 && t < 96.4) pose = add(pose, { armL: [-0.35 * Math.abs(Math.sin((t - 92.9) * 2.2)), 0, 0] });
      if (t > 139.4) {
        const up = sseg(t, 139.4, 140.4);
        pose = add(pose, { armR: [-0.55 * up, 0.0, 0.28 * up], neck: [0.25 * up * (t < 153 ? 1 : 1 - sseg(t, 153, 154)), 0, 0] });
      }
      if (t > 112 && t < 120.2) pose = add(pose, { neck: [0, 0, 0], armL: [-0.15 * Math.sin((t - 112) * 1.7), 0, 0] });
      if (t > 117.8 && t < 125) pose = add(pose, { neck: [0, 0.6 * sseg(t, 119.6, 120.6), 0] });
      if (t > 127.6 && t < 135.2) pose = add(pose, { neck: [0.35, 0, 0] });
      applyPose(zhang.fig, pose);
      const base = t > 153.4 ? "narrow" : t > 112 && t < 127.8 ? "stern" : t > 92.9 && t < 100.9 ? "smile" : "neutral";
      face(zhang, t, "章北海", base);
    }
    // cup in hand
    const drinking = t > 96.8 && t < 101.0;
    room.cupA.visible = !drinking;
    if (drinking) { zParent(zProps.cup, zhang.fig.anchors.handR); zProps.cup.visible = true; }
    // phone
    if (t > 139.8) {
      zParent(zProps.phone, zhang.fig.anchors.handR);
      zProps.phone.visible = true;
      (W.phoneScreen.material as THREE.MeshBasicMaterial).map = t > 155.6 ? W.phoneScreenPaid : W.phoneScreenIdle;
    }

    // ---- Collector ----
    const C = collector;
    if (t < 59) {
      place(C.fig, g, 2.4, 0, -0.3, PI);
      applyPose(C.fig, add(idle(t), { hips: [0.3, 0, 0], legR: [-0.3, 0, 0], legL: [-0.3, 0, 0], neck: [0.25, 0, 0], armR: [-1.5, 0, 0.25], armL: [-0.7, 0, -0.2] }));
      cProps.magnifier.visible = true;
      C.setExpr("neutral");
    } else if (t < 66) {
      const k = eseg(t, 59, 60.4);
      place(C.fig, g, 2.4, 0, -0.3, mix(PI, PI * 1.72, k));
      applyPose(C.fig, add(idle(t), { hips: [0.3 * (1 - k), 0, 0], legR: [-0.3 * (1 - k), 0, 0], legL: [-0.3 * (1 - k), 0, 0], armR: [-1.5 * (1 - k) - 0.3 * k * Math.abs(Math.sin(t * 3)), 0, 0.25], armL: [-0.6 * k, 0, -0.5 * k] }));
      cProps.magnifier.visible = t < 60.2;
      face(C, t, "收藏者", "smile");
    } else if (t < 71.3) {
      const k = eseg(t, 66, 70.4);
      place(C.fig, g, mix(2.4, 1.25, k), 0, mix(-0.3, 0.8, k), mix(PI * 1.72, PI * 1.5, k));
      applyPose(C.fig, blend(walk(t, 0.85), seated(C), sseg(t, 70.2, 71.2)));
      face(C, t, "收藏者", "smile");
    } else if (t < 103.9) {
      place(C.fig, g, 1.25, 0, 0.8, -PI / 2);
      let pose = seated(C);
      const pour = sseg(t, 71.4, 72.2) * (1 - sseg(t, 75.0, 75.8));
      pose = add(pose, { armR: [-0.55 * pour, 0, -0.35 * pour], hips: [0.15 * pour, 0, 0] });
      if (speaking(t, "收藏者")) pose = add(pose, { armL: [-0.25 - 0.25 * Math.abs(Math.sin(t * 2.3)), 0, -0.1] });
      if (t > 84.3 && t < 92.6) pose = add(pose, { neck: [-0.15, 0.25, 0] });
      if (t > 101) {
        const pt = sseg(t, 101, 101.4);
        pose = add(pose, { armR: [-0.85 * pt, 0, 0.0], hips: [-0.12 * pt * (1 + 0.4 * Math.sin(t * 13)), 0, 0] });
      }
      applyPose(C.fig, pose);
      face(C, t, "收藏者", t > 101 && t < 103.2 ? "laugh" : "smile");
    } else if (t < 112.2) {
      // at the safe (front right), then microscope on top of it
      const k = eseg(t, 103.9, 105.0);
      place(C.fig, g, mix(1.25, 3.25, k), 0, mix(0.8, 1.6, k), mix(-PI / 2, -2.5, k));
      applyPose(C.fig, k < 1 ? blend(seated(C), walk(t, 0.9), k) : add(idle(t), { hips: [0.35, 0, 0], legR: [-0.35, 0, 0], legL: [-0.35, 0, 0], neck: [0.3, 0, 0], armR: [-1.1, 0, 0.1], armL: [-0.8, 0, -0.1] }));
      face(C, t, "收藏者", "smile");
    } else if (t < 127.6) {
      // to the glass cabinet on the back wall, then to the table
      let x = 3.25, z = 1.6, rot = -2.5;
      let pose: Pose = idle(t);
      if (t < 115.6) {
        rot = -2.5;
        pose = add(idle(t), { neck: [0, -0.3, 0] });
      } else if (t < 118.6) {
        const k = eseg(t, 115.6, 118.6);
        x = mix(3.25, 1.0, k); z = mix(1.6, -1.9, k);
        rot = mix(-2.5, -PI, sseg(t, 115.6, 116.4));
        pose = walk(t, 0.95);
      } else if (t < 122.6) {
        x = 1.0; z = -1.9;
        rot = mix(PI, 0, sseg(t, 121.2, 122.2));
        pose = add(idle(t), { armR: [-1.1 * sseg(t, 118.8, 119.6), 0, 0.1], armL: [-0.9 * sseg(t, 119.2, 119.8) * (1 - sseg(t, 120.6, 121.2)), 0, -0.1] });
        cProps.walnutInHand.visible = t > 119.8;
      } else if (t < 125.4) {
        const k = eseg(t, 122.6, 125.2);
        x = mix(1.0, 0.85, k); z = mix(-1.9, 1.5, k);
        rot = mix(0, -2.25, sseg(t, 124.4, 125.2));
        pose = over(walk(t, 0.95), { armR: [-0.9, 0, 0.1] });
        cProps.walnutInHand.visible = true;
      } else {
        x = 0.85; z = 1.5; rot = -2.25;
        pose = add(idle(t), { hips: [0.25, 0, 0], legR: [-0.25, 0, 0], legL: [-0.25, 0, 0], neck: [0.3, 0, 0], armR: [-1.0 * (1 - sseg(t, 126.0, 126.6)) - 0.7, 0, 0.1] });
      }
      if (t > 125.4) cProps.walnutInHand.visible = false;
      place(C.fig, g, x, 0, z, rot);
      applyPose(C.fig, pose);
      face(C, t, "收藏者", "smile");
    } else if (t < 135.2) {
      place(C.fig, g, 0.85, 0, 1.5, -2.25);
      const point = Math.sin((t - 127.6) * 1.3);
      applyPose(C.fig, add(idle(t), { hips: [0.3, 0, 0], legR: [-0.3, 0, 0], legL: [-0.3, 0, 0], neck: [0.35, 0, 0], armR: [-1.15 + point * 0.08, point * 0.12, 0.05] }));
      face(C, t, "收藏者", "smile");
    } else {
      place(C.fig, g, 1.25, 0, 0.8, -PI / 2);
      let pose = seated(C);
      if (speaking(t, "收藏者")) pose = add(pose, { armL: [-0.3 - 0.2 * Math.abs(Math.sin(t * 2.1)), 0, -0.1] });
      if (t > 142.2 && t < 145) pose = add(pose, { neck: [-0.1, 0, 0] });
      if (t > 145 && t < 148.6) pose = add(pose, { neck: [0.18, -0.2, 0.12], armL: [-0.2, 0, -0.1] }); // eyes drop, head tilts
      applyPose(C.fig, pose);
      const base = t > 153.4 ? "neutral" : t > 142.2 ? "awkward" : "smile";
      face(C, t, "收藏者", base);
    }

    // teapot follows the pouring hand
    if (t > 71.4 && t < 75.8) {
      const hp = handWorld(C.fig, "handR");
      const k = sseg(t, 71.4, 72.2) * (1 - sseg(t, 75.0, 75.8));
      room.teapot.position.set(mix(0.0, hp.x - 0.04, k), mix(0.62, hp.y - 0.06, k), mix(0.8, hp.z, k));
      room.teapot.rotation.set(0, PI, -0.5 * sseg(t, 72.2, 72.6) * (1 - sseg(t, 74.8, 75.2)) * k);
    } else {
      room.teapot.position.set(0.0, 0.62, 0.8);
      room.teapot.rotation.set(0, PI, 0);
    }
    room.walnut.visible = t > 122.6 && t < 160;
    room.walnut.position.set(-0.05 + 0.2, tableTop + 0.035, 0.98);
    room.irons.forEach((m, i) => { m.visible = t > [126.3, 126.9, 127.4][i]!; });
    room.safeDoorPivot.rotation.y = 1.75 * eseg(t, 105.2, 106.3);
    room.pendulum.rotation.z = Math.sin(t * PI) * 0.18;
    room.radioDial.visible = true;
  }

  /* ============================ WORKSHOP ============================ */
  function spinAngle(t: number) {
    const a = 164.4, b = 178.4, w = 9;
    if (t < a) return 0;
    const up = Math.min(t - a, 1.5);
    let ang = 0.5 * (w / 1.5) * up * up + w * Math.max(0, Math.min(t, b - 1.2) - (a + 1.5));
    if (t > b - 1.2) { const d = Math.min(t - (b - 1.2), 1.2); ang += w * d - 0.5 * (w / 1.2) * d * d; }
    return ang;
  }
  const cutWindows: Array<[number, number]> = [[165.6, 170.0], [171.2, 174.5], [175.0, 177.8]];
  W.sparks.emitters = cutWindows.map(([a, b], i): Emitter => ({
    start: a, end: b, rate: 140, life: 0.45,
    pos: () => v3(-0.36, 1.27, 0.07),
    vel: (_born, k) => v3((hash3(k, i, 1) - 0.3) * 2.0, 0.6 + hash3(k, i, 2) * 1.5, 1.2 + hash3(k, i, 3) * 1.6),
    size: [0.02, 0.006], color: new THREE.Color(1.0, 0.7, 0.3), alpha: 1, spread: 0.6, gravity: 9.8, seed: i + 3,
  }));
  function workshopState(t: number) {
    const g = workshop.set.group;
    dress("coat");
    let pose: Pose = add(idle(t), { armR: [-1.05, 0, 0.12], armL: [-0.95, 0, -0.2], neck: [0.32, 0, 0] });
    if (t < 164) pose = add(idle(t), { armR: [-1.4 * sseg(t, 162.6, 163.1) * (1 - sseg(t, 163.4, 163.9)), 0, 0], neck: [0.1, 0, 0] });
    if (t > 179.3 && t < 180.6) pose = add(pose, { armR: [-0.35, 0, 0.25] });
    if (t > 180.6 && t < 182.4) pose = add(pose, { armR: [-0.2 + 0.25 * Math.sin((t - 180.6) * 9), 0, -0.2], armL: [0.3, 0, 0], hips: [0, 0.4, 0] });
    if (t > 183.2) pose = add(pose, { armR: [-1.0 * sseg(t, 183.2, 183.6), 0, 0] });
    place(zhang.fig, g, 0.0, 0, 0.92, PI);
    applyPose(zhang.fig, pose);
    zhang.setExpr(t > 171 && t < 175 ? "narrow" : "stern");
    workshop.spindle.rotation.x = spinAngle(t);
    const cutP = seg(t, 165.6, 177.8);
    workshop.stock.visible = t < 177.8;
    workshop.stock.scale.setScalar(1 - 0.55 * cutP);
    workshop.rod.visible = t > 166.5 && t < 178.4;
    const rods = Math.floor(seg(t, 170, 178) * 6.99);
    workshop.rods.forEach((r, i) => { r.visible = i < rods && t < 179.0 + i * 0.15; });
    const slugs = Math.floor(seg(t, 174.2, 179.0) * 36.99);
    workshop.slugs.forEach((s, i) => { s.visible = i < slugs; });
    // cutter removed into his hand at 179.8
    workshop.cutter.visible = t < 179.9;
    workshop.bag.visible = t > 181.6;
    const on = t > 163.2 && t < 183.6 ? 1 : 0;
    const flick = t > 163.2 && t < 163.6 ? (Math.sin(t * 90) > 0 ? 1 : 0.2) : 1;
    workshop.work.intensity = 40 * on * flick;
  }

  /* ============================ BASEMENT ============================ */
  const shotKick = (t: number, times: number[], decay = 10) => {
    let k = 0;
    for (const s of times) if (t >= s) k += Math.exp(-(t - s) * decay);
    return k;
  };
  W.smoke.emitters = TEST_SHOTS.map((s, i): Emitter => ({
    start: s, end: s + 0.12, rate: 140, life: 6,
    pos: () => v3(-0.65, 1.3, 0.2),
    vel: (_b, k) => v3(0.6 + hash3(k, i, 4) * 0.4, 0.05 + hash3(k, i, 5) * 0.12, -0.45),
    size: [0.08, 0.9], color: new THREE.Color(0.55, 0.52, 0.5), alpha: 0.32, spread: 1.2, drag: 1.4, seed: 40 + i,
  }));
  W.dust.emitters = TEST_SHOTS.map((s, i): Emitter => ({
    start: s + 0.05, end: s + 0.6, rate: 120, life: 3.2,
    pos: (_b, k) => v3(-1.8 + hash3(k, i, 7) * 3.6, 2.36, -1.6 + hash3(k, i, 8) * 3),
    vel: () => v3(0, -0.05, 0),
    size: [0.015, 0.02], color: new THREE.Color(0.75, 0.66, 0.55), alpha: 0.8, spread: 2, gravity: 0.3, seed: 60 + i,
  }));
  function basementState(t: number) {
    const g = basement.set.group;
    dress("coat");
    const B = basement;
    // rounds on the table
    B.rounds.forEach((r, i) => {
      const headOff = 186.4 + i * 0.21;
      const slugOn = 190.2 + i * 0.24;
      r.head.visible = t < headOff;
      r.slug.visible = t > slugOn;
      const loaded = i < 4 && t > [201.0, 201.4, 201.8, 202.2][i]!;
      const packed = i >= 4 && t > 224.2;
      r.body.parent!.visible = !loaded && !packed;
    });
    B.ammoCase.visible = t > 223.6;
    B.pliers.visible = t > 194.6;
    B.pistolOnTable.visible = t < 202.6;
    B.magOnTable.visible = t < 200.4;
    B.holes.forEach((h, i) => { h.visible = t > TEST_SHOTS[i]! + 0.01 && t < 215.2; });
    B.bundle.visible = t < 215.2;
    B.opened.visible = t >= 215.2;
    // bulb swings from the muzzle blasts
    let sw = 0;
    for (const s of TEST_SHOTS) if (t > s) sw += 0.07 * Math.exp(-(t - s) * 0.6) * Math.sin((t - s) * 3.4);
    B.bulbPivot.rotation.set(sw * 0.6, 0, sw);
    const kick = shotKick(t, TEST_SHOTS, 30);
    B.flashLight.intensity = 60 * kick;
    B.flashLight.position.set(-0.7, 1.32, 0.15);
    B.bulbLight.intensity = 7 * (t > 225.4 ? 1 - sseg(t, 225.4, 225.9) : 1);

    if (t < 203.4) {
      place(zhang.fig, g, -0.35, 0, 0.62, PI);
      let pose = add(seated(zhang, 0.47), { armR: [-0.62, 0, 0.12], armL: [-0.58, 0, -0.12], neck: [0.5, 0, 0], hips: [0.12, 0, 0] });
      if (t < 194.5) {
        pose = add(pose, { armR: [-0.12 + 0.08 * Math.sin(t * 6), 0, 0] });
        zParent(zProps.pliers, zhang.fig.anchors.handR);
        zProps.pliers.visible = true;
      }
      if (t > 190 && t < 199.5) { zParent(zProps.heldSlug, zhang.fig.anchors.handL); zProps.heldSlug.visible = true; }
      if (t > 200.3) {
        zParent(zProps.magL, zhang.fig.anchors.handL);
        zProps.magL.visible = true;
        pose = add(pose, { armL: [-0.15, 0, 0.1], armR: [-0.1 + 0.08 * Math.sin(t * 9), 0, 0.15] });
      }
      if (t > 202.6) {
        zParent(zProps.pistol, zhang.fig.anchors.handR);
        zProps.pistol.visible = true;
      }
      applyPose(zhang.fig, pose);
      zhang.setExpr("stern");
    } else if (t < 213.8) {
      const k = eseg(t, 203.4, 204.4);
      place(zhang.fig, g, mix(-0.35, -1.0, k), 0, mix(0.62, 0.75, k), mix(PI, 2.16, k));
      const kick = shotKick(t, TEST_SHOTS, 14);
      let pose = blend(seated(zhang, 0.47), aim(0.16, 0), sseg(t, 203.4, 204.6));
      pose = add(pose, { armR: [-0.35 * kick, 0, 0], armL: [-0.3 * kick, 0, 0], neck: [-0.05 * kick, 0, 0] });
      if (t > 209) pose = blend(pose, add(idle(t), { armR: [-0.4, 0, 0.1] }), sseg(t, 209, 210.5));
      applyPose(zhang.fig, pose);
      zParent(zProps.pistol, zhang.fig.anchors.handR);
      zProps.pistol.visible = true;
      zhang.setExpr(t > 205 && t < 207.2 ? "narrow" : "stern");
      W.flashSprite.visible = kick > 0.02;
      (W.flashSprite.material as THREE.SpriteMaterial).opacity = Math.min(1, kick * 2.5);
      W.flashSprite.scale.setScalar(3 + kick * 4);
    } else {
      // at the bundle with the knife, then shards in palm, then packing
      if (t < 223.6) {
        if (t < 217.6) place(zhang.fig, g, 0.95, 0, -0.62, 2.45);
        else place(zhang.fig, g, -0.1, 0, 0.62, PI);
        let pose = add(idle(t), { hips: [0.35, 0, 0], legR: [-0.35, 0, 0], legL: [-0.35, 0, 0], neck: [0.45, 0, 0] });
        if (t < 217.6) {
          pose = add(pose, { armR: [-1.05 + 0.12 * Math.sin(t * 7), 0, 0.1], armL: [-0.9, 0, -0.15] });
          zParent(zProps.knife, zhang.fig.anchors.handR);
          zProps.knife.visible = true;
        } else {
          pose = add(pose, { armL: [-1.15, 0.0, 0.28], armR: [-0.3, 0, 0.1], neck: [0.5, -0.12, 0], hips: [-0.3, 0, 0], legR: [0.3, 0, 0], legL: [0.3, 0, 0] });
          zParent(zProps.shards, zhang.fig.anchors.handL);
          zProps.shards.visible = true;
        }
        applyPose(zhang.fig, pose);
      } else {
        place(zhang.fig, g, -0.6, 0, 0.45, PI);
        applyPose(zhang.fig, add(idle(t), { armR: [-0.9 * (1 - sseg(t, 224.6, 225.2)), 0, 0.1], armL: [-0.8 * (1 - sseg(t, 224.6, 225.2)), 0, -0.1], neck: [0.4, 0, 0] }));
      }
      zhang.setExpr("stern");
    }
  }

  /* ============================ CABIN ============================ */
  function cabinState(t: number) {
    const g = cabin.set.group;
    dress("suit", 1);
    const out = eseg(t, 230.8, 233.6);
    place(zhang.fig, g, mix(0.1, 0.2, out), 0.28 + Math.sin(t * 0.8) * 0.03, mix(-0.3, 3.4, out), mix(-PI / 2, 0, sseg(t, 230.2, 231.4)));
    let pose = hover(t, 1);
    if (t > 227.4 && t < 229.6) {
      pose = add(pose, { armR: [-1.1, 0, 0.6], neck: [0.4, 0, 0] });
      zParent(zProps.locatorProp, zhang.fig.anchors.handR);
      zProps.locatorProp.visible = true;
    }
    if (t > 229.0 && t < 230.2) pose = add(pose, { armR: [-1.3, 0, 0.0] });
    if (t > 230.6) pose = add(pose, { armL: [-2.3 * (1 - sseg(t, 231.2, 232.2)), 0, 0] });
    applyPose(zhang.fig, pose);
    zhang.setExpr("stern");
    cabin.locator.visible = t > 229.4;
    const on = t > 229.4 && ((t - 229.4) % 1) < 0.25;
    cabin.ledMat.opacity = on ? 1 : 0.0;
    cabin.led.visible = t > 229.4;
  }

  /* ============================ SPACE ============================ */
  const sunDir = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  function limbOffset(t: number) {
    if (t < 40) return mix(1.25, 0.72, seg(t, 0, 37));
    if (t < 248) return 2.6;
    if (t < 262) return mix(0.1, -0.2, seg(t, 248, 262));
    if (t < 278) return mix(-0.22, -0.42, seg(t, 262, 278));
    if (t < 342) return mix(-0.42, -0.62, seg(t, 278, 342));
    return mix(-0.62, -2.5, seg(t, 342, 353));
  }
  function sunState(t: number) {
    const off = limbOffset(t);
    sunDirection(off, sunDir);
    W.sun.group.position.copy(sunDir).multiplyScalar(SUN_DIST);
    const vis = THREE.MathUtils.clamp((off + 0.75) / 1.5, 0, 1);
    const warm = new THREE.Color().setRGB(1.0, mix(0.48, 0.82, vis), mix(0.22, 0.6, vis));
    W.sunLight.color.copy(warm);
    W.sunLight.intensity = 3.2 * Math.pow(vis, 0.8);
    W.sunLight.position.copy(HATCH).addScaledVector(sunDir, 120);
    W.sunLight.target.position.copy(HATCH).add(v3(0, 0, 24));
    W.zhangSun.color.copy(warm);
    W.zhangSun.intensity = 3.0 * Math.pow(vis, 0.8);
    W.zhangSun.position.copy(sunDir).multiplyScalar(15);
    W.zhangSun.target.position.set(0, 0.9, 0);
    (W.sun.halo.material as THREE.SpriteMaterial).opacity = 0.25 + 0.45 * vis;
    // Earth: an artist's terminator so the sunset band crosses the visible disc
    const toSun = tmp.copy(W.sun.group.position).sub(EARTH_CENTER).normalize();
    const bias = 0.95 * THREE.MathUtils.clamp((off + 1.4) / 1.6, 0, 1);
    const lit = toSun.addScaledVector(earthDir, -bias).normalize();
    (W.earth.gm.uniforms.uSun!.value as THREE.Vector3).copy(lit);
    const dusk = THREE.MathUtils.clamp((off + 2.5) / 3, 0, 1);
    W.earth.gm.uniforms.uDim!.value = 0.35 + 0.65 * dusk;
    W.earth.cm.uniforms.uDim!.value = 0.35 + 0.65 * dusk;
    W.earth.cityMat.uniforms.uAmt!.value = 1.2 - 0.7 * dusk;
    W.earth.atmoMat.opacity = 0.55 + 0.3 * dusk;
    return vis;
  }

  // group member choreography
  const emergeT = (m: GroupMember) => 257.2 + m.seed * 0.2;
  const hitT = (m: GroupMember) => {
    if (!m.hit) return Infinity;
    if (m.target) return 322.0 + (m.idx - 3) * 0.45;
    return m.idx === 4 ? 323.2 : 323.7;
  };
  const retreatT = (m: GroupMember) => 331.0 + (m.hit ? 1.4 : 0) + hash3(m.seed, 3, 3) * 1.6;
  const crowdPos = (m: GroupMember, t: number, out: THREE.Vector3) => {
    const start = emergeT(m);
    const door = v3(0, 0, HATCH.z + 1.2);
    if (t < start) return out.copy(door);
    const k = eseg(t, start, start + 3.4);
    out.lerpVectors(door, m.slot, k);
    // small weightless drift around the slot
    out.x += Math.sin(t * 0.37 + m.seed) * 0.05;
    out.y += Math.sin(t * 0.29 + m.seed * 2) * 0.06;
    // back rows still settling
    if (m.row > 0 && t < 292) out.x += Math.sin(t * 0.9 + m.seed) * 0.15 * (1 - seg(t, 280, 292));
    const h = hitT(m);
    if (t > h) {
      const d = t - h;
      out.z -= 0.35 * (1 - Math.exp(-d * 2)) + 0.05 * d;
      out.y += (m.idx % 2 ? 0.08 : -0.06) * d;
    }
    const r = retreatT(m);
    if (t > r) {
      const k2 = eseg(t, r, r + 4.2);
      const from = out.clone();
      out.lerpVectors(from, door, k2);
    }
    return out;
  };

  // gas: thrusters during emergence, settling, retreat; leaks after hits
  const gasEmitters: Emitter[] = [];
  for (const m of W.crowd) {
    const s = emergeT(m);
    const back = (b: number) => crowdPos(m, b, new THREE.Vector3()).add(v3(0, 1.1, -0.4));
    gasEmitters.push({ start: s, end: s + 2.6, rate: 18, life: 2.2, pos: back, vel: () => v3(0, 0, -1.6), size: [0.25, 1.4], color: new THREE.Color(0.85, 0.86, 0.9), alpha: 0.35, spread: 0.6, seed: m.seed });
    if (m.row > 0) gasEmitters.push({ start: 284 + hash3(m.seed, 1, 1) * 5, end: 284.8 + hash3(m.seed, 1, 1) * 5, rate: 14, life: 3, pos: back, vel: () => v3(hash3(m.seed, 2, 2) - 0.5, 0, -1.2), size: [0.3, 1.6], color: new THREE.Color(0.85, 0.86, 0.9), alpha: 0.3, spread: 0.7, seed: m.seed + 100 });
    const r = retreatT(m);
    gasEmitters.push({ start: r, end: r + 3.5, rate: 26, life: 2.6, pos: (b) => crowdPos(m, b, new THREE.Vector3()).add(v3(0, 1.0, 0.4)), vel: () => v3(0, 0, 3.2), size: [0.25, 1.8], color: new THREE.Color(0.9, 0.9, 0.95), alpha: 0.4, spread: 0.5, seed: m.seed + 200 });
    const h = hitT(m);
    if (h < Infinity) {
      gasEmitters.push({ start: h, end: h + 9, rate: 60, life: 1.6, pos: (b) => crowdPos(m, b, new THREE.Vector3()).add(v3(0.1, 1.35, 0.25)), vel: () => v3(0, 0.3, 4.5), size: [0.08, 1.0], color: new THREE.Color(0.95, 0.96, 1.0), alpha: 0.55, spread: 0.35, seed: m.seed + 300 });
      gasEmitters.push({ start: h + 0.05, end: h + 6, rate: 40, life: 1.6, pos: (b) => crowdPos(m, b, new THREE.Vector3()).add(v3(-0.1, 1.2, -0.6)), vel: () => v3(0, -0.2, -3.5), size: [0.08, 1.0], color: new THREE.Color(0.95, 0.96, 1.0), alpha: 0.45, spread: 0.4, seed: m.seed + 400 });
      if (m.idx === 4 && m.row === 0) {
        // thruster pack ruptured: one big white burst between the rows
        gasEmitters.push({ start: h + 0.15, end: h + 0.9, rate: 260, life: 3.2, pos: (b) => crowdPos(m, b, new THREE.Vector3()).add(v3(0, 1.0, -0.6)), vel: () => v3(0, 0.4, -2.4), size: [0.3, 3.2], color: new THREE.Color(1, 1, 1), alpha: 0.5, spread: 1.4, seed: 999 });
      }
    }
  }
  // the photographer's camera thruster and Zhang's own puffs
  const zhangFlyIn = (t: number, out: THREE.Vector3) => {
    const k = eseg(t, 234, 247);
    return out.set(mix(60, 0, k), mix(14, 0, k), mix(70, 0, k));
  };
  gasEmitters.push({ start: 236.0, end: 238.6, rate: 30, life: 3, pos: (b) => zhangFlyIn(b, new THREE.Vector3()).add(v3(0, 1, 0.4)), vel: () => v3(3, 0.6, 3.4), size: [0.2, 1.8], color: new THREE.Color(0.9, 0.9, 0.95), alpha: 0.4, spread: 0.5, seed: 7 });
  gasEmitters.push({ start: 244.6, end: 246.4, rate: 30, life: 3, pos: (b) => zhangFlyIn(b, new THREE.Vector3()).add(v3(0, 1, -0.4)), vel: () => v3(-2.6, -0.5, -3), size: [0.2, 1.5], color: new THREE.Color(0.9, 0.9, 0.95), alpha: 0.35, spread: 0.5, seed: 8 });
  const zhangDepart = (t: number, out: THREE.Vector3) => {
    const d = Math.max(0, t - 343);
    const dir = tmp.copy(BASE1).normalize();
    return out.set(0, 0, 0).addScaledVector(dir, 0.5 * 3.2 * d * d);
  };
  gasEmitters.push({ start: 343, end: 349, rate: 40, life: 4, pos: (b) => zhangDepart(b, new THREE.Vector3()).add(v3(0, 1, 0)), vel: () => BASE1.clone().normalize().multiplyScalar(-4), size: [0.3, 3], color: new THREE.Color(0.9, 0.9, 0.95), alpha: 0.4, spread: 0.5, seed: 9 });
  // commuters crossing the establishing shot
  const commuterPath = (i: number, t: number, out: THREE.Vector3) => {
    const k = seg(t, 232, 250);
    const paths = [
      [v3(-700, 160, -900), v3(500, 60, -500)],
      [v3(400, -300, -300), v3(-500, 100, -1100)],
      [v3(-200, -500, 600), v3(150, 200, -900)],
      [v3(700, 300, 900), v3(-300, 120, -700)],
    ][i]!;
    return out.lerpVectors(paths[0]!, paths[1]!, k);
  };
  W.commuters.forEach((_c, i) => {
    gasEmitters.push({ start: 232, end: 250, rate: 12, life: 4, pos: (b) => commuterPath(i, b, new THREE.Vector3()), vel: () => v3(0, 0, 0.1), size: [6, 26], color: new THREE.Color(0.9, 0.9, 0.95), alpha: 0.45, spread: 0.2, seed: 20 + i });
  });
  W.gas.emitters = gasEmitters;

  // blood → ice from the cracked visor (centre target)
  const centre = W.crowd.find((m) => m.target && m.idx === 4)!;
  const visorPoint = (b: number) => crowdPos(centre, b, new THREE.Vector3()).add(v3(0.05, 1.55, 0.36));
  W.blood.emitters = [{ start: hitT(centre) + 0.3, end: hitT(centre) + 1.8, rate: 70, life: 0.7, pos: visorPoint, vel: () => v3(0.2, 0.25, 1.6), size: [0.05, 0.03], color: new THREE.Color(0.55, 0.03, 0.04), alpha: 0.95, spread: 0.6, seed: 31 }];
  W.ice.emitters = [{ start: hitT(centre) + 0.6, end: hitT(centre) + 6, rate: 90, life: 4.5, pos: (b) => visorPoint(b).add(v3(0, 0, 0.3)), vel: () => v3(0.15, 0.2, 1.1), size: [0.04, 0.06], color: new THREE.Color(0.9, 0.95, 1.0), alpha: 0.9, spread: 0.9, seed: 32 }];

  function zhangSpace(t: number) {
    const g = W.spaceSet.group;
    const bare = t > 281.6 && t < 360;
    dress(bare ? "suitBare" : "suit", 1);
    let pos = v3(0, 0, 0);
    let rot = PI;
    let pose: Pose = hover(t, 0.5);
    const sx = sunDir.x, sz = sunDir.z;
    const faceSun = Math.atan2(sx, sz);
    const scopeR = () => { zParent(zProps.scope, zhang.fig.anchors.handR); zProps.scope.position.set(0, 0.6, 0.6); zProps.scope.rotation.set(0, 0, 0); zProps.scope.visible = true; };
    const scopeEye: Pose = { armR: [-2.25, 0.1, 0.62], neck: [0.0, 0.0, 0], armL: [-0.5, 0, -0.3] };
    if (t < 40) {
      rot = mix(faceSun + 0.25, PI, eseg(t, 26.6, 29.2));
      const raise = sseg(t, 27.4, 29.0);
      pose = add(hover(t, 0.5), { neck: [-0.18 * (1 - raise), 0, 0] });
      pose = blend(pose, over(pose, scopeEye), raise);
      scopeR();
    } else if (t < 248) {
      zhangFlyIn(t, pos);
      rot = mix(PI * 1.25, PI, sseg(t, 240, 247));
      pose = add(hover(t, 0.5), { hips: [0.35 * (1 - sseg(t, 242, 247)), 0, 0] });
    } else if (t < 278) {
      // turn the head to the sinking sun, then the scope
      const look = sseg(t, 248.2, 249.6) * (1 - sseg(t, 251.2, 252));
      pose = add(hover(t, 0.5), { neck: [-0.1 * look, 1.0 * look, 0], hips: [0, 0.55 * look, 0] });
      const raise = sseg(t, 251.4, 252.2);
      pose = blend(pose, over(pose, scopeEye), raise);
      if (t > 251.4) scopeR();
    } else if (t < 294) {
      pose = hover(t, 0.5);
      // scope released: floats in front of the visor
      if (t < 286.4) {
        const fp = headWorldAt(t);
        if (zProps.scope.parent !== g) g.add(zProps.scope);
        zProps.scope.visible = true;
        zProps.scope.scale.setScalar(0.05625);
        zProps.scope.position.set(fp.x - 0.12 + (t - 278) * 0.004, fp.y + 0.05 + (t - 278) * 0.006, fp.z - 0.45);
        zProps.scope.rotation.set(0.2 + (t - 278) * 0.05, PI + 0.3 + (t - 278) * 0.08, 0.1);
      }
      if (t < 280) pose = add(pose, { armR: [-2.25 * (1 - sseg(t, 278.2, 279.4)), 0, 0.62 * (1 - sseg(t, 278.2, 279.4))] });
      if (t >= 280 && t < 282.2) pose = add(pose, { armR: [-1.15, 0.2, 0.2], armL: [-1.25, 0, 0.75], neck: [0.45, -0.1, 0] });
      if (t >= 282.2 && t < 283.6) {
        rot = mix(PI, PI + 0.65, sseg(t, 282.2, 282.9));
        pose = add(pose, { armR: [-1.4, 0, -0.5], neck: [0.2, -0.4, 0] });
      }
      if (t >= 283.6 && t < 285.6) {
        rot = mix(PI + 0.65, PI, sseg(t, 284.8, 285.6));
        pose = add(pose, { armR: [0.15 - 0.9 * sseg(t, 284.2, 285.0), 0, -0.1], neck: [0.35, 0, 0] });
      }
      if (t >= 285.6 && t < 290) pose = add(pose, { armR: [-1.2, 0, 0.3], armL: [-1.3 + 0.3 * sseg(t, 286.4, 288), 0, 0.5 * sseg(t, 286.4, 288)], neck: [0.4, 0, 0] });
      if (t >= 290) pose = blend(pose, aim(0, 0), sseg(t, 290, 291.4));
      if (t >= 284.4) { zParent(zProps.pistol, zhang.fig.anchors.handR); zProps.pistol.visible = true; }
      if (t >= 286.4) {
        zProps.scope.scale.setScalar(1);
        if (t < 288.2) { zParent(zProps.scope, zhang.fig.anchors.handL); zProps.scope.position.set(0, 0.5, 1.2); zProps.scope.rotation.set(0, 0, 0); }
        else { zParent(zProps.scope, zProps.pistol); zProps.scope.position.copy(W.scopeOnPistol); zProps.scope.rotation.set(0, 0, 0); }
        zProps.scope.visible = true;
      }
      if (t >= 284.4 && t < 288.2) { zParent(zProps.magR, zhang.fig.anchors.handL); zProps.magR.visible = t < 286.0; }
    } else if (t < 342) {
      // firing: aim, recoil, two magazine changes
      const kick = shotKick(t, SHOT_TIMES, 16);
      pose = add(over(hover(t, 0.5), aim(0, 0)), { armR: [-0.16 * kick, 0, 0], armL: [-0.12 * kick, 0, 0] });
      for (const mc of [297.3, 301.7]) {
        const m = sseg(t, mc, mc + 0.35) * (1 - sseg(t, mc + 0.7, mc + 1.05));
        pose = add(pose, { armL: [0.6 * m, 0, 0.35 * m], armR: [0.15 * m, 0, 0] });
      }
      if (t > 338) pose = blend(pose, hover(t, 0.5), sseg(t, 338, 341));
      zParent(zProps.pistol, zhang.fig.anchors.handR);
      zProps.pistol.visible = true;
      zParent(zProps.scope, zProps.pistol);
      zProps.scope.position.copy(W.scopeOnPistol);
      zProps.scope.rotation.set(0, 0, 0);
      zProps.scope.scale.setScalar(1);
      zProps.scope.visible = true;
      // muzzle flash
      W.flashSprite.visible = kick > 0.05 && t < 307;
      (W.flashSprite.material as THREE.SpriteMaterial).opacity = Math.min(1, kick * 1.6);
      W.flashSprite.scale.setScalar(2 + kick * 3);
      W.flashLight.intensity = t < 307 ? 30 * kick : 0;
    } else {
      zhangDepart(t, pos);
      rot = mix(PI, Math.atan2(BASE1.x, BASE1.z), sseg(t, 342, 344));
      pose = add(hover(t, 0.5), { hips: [0.6 * sseg(t, 343, 345), 0, 0], armR: [0.2, 0, 0.1], armL: [0.2, 0, -0.1] });
      zParent(zProps.pistol, zhang.fig.anchors.handR);
      zProps.pistol.visible = t < 343.2;
    }
    place(zhang.fig, g, pos.x, pos.y, pos.z, rot);
    applyPose(zhang.fig, pose);
    zhang.setExpr(t > 290 && t < 342 ? "narrow" : t < 30 ? "closed" : "stern");
    if (t < 26 && t > 19) zhang.setExpr(t < 21.6 ? "closed" : "neutral");
  }

  const headTmp = new THREE.Vector3();
  function headWorldAt(_t: number) {
    return eyeWorld(zhang.fig, headTmp);
  }

  function crowdState(t: number) {
    const g = W.spaceSet.group;
    for (const m of W.crowd) {
      const fig = m.actor.fig;
      const start = emergeT(m);
      const r = retreatT(m);
      const visible = t > start && t < r + 4.0;
      fig.root.visible = visible;
      if (!visible) continue;
      if (fig.root.parent !== g) g.add(fig.root);
      crowdPos(m, t, fig.root.position);
      const h = hitT(m);
      let pose: Pose = add(hover(t, m.seed), { legR: [0.1, 0, -0.03], legL: [-0.02, 0, 0.03], armR: [0.05, 0, -0.2], armL: [0.05, 0, 0.2] });
      let rotY = 0, rotX = 0, rotZ = 0;
      const moving = eseg(t, start, start + 3.4);
      if (moving < 1) { pose = add(pose, { hips: [0.5 * (1 - moving), 0, 0] }); rotX = -0.2 * (1 - moving); }
      if (t > h) {
        const d = t - h;
        const jolt = Math.exp(-d * 3);
        pose = add(pose, { armR: [0.5 + 0.4 * jolt, 0, -0.9 - 0.3 * jolt], armL: [0.4 + 0.4 * jolt, 0, 0.9 + 0.3 * jolt], neck: [-0.25 * (1 - 0.5 * jolt) - 0.1, 0, 0.1], hips: [-0.15, 0, 0], legR: [-0.5, 0, 0], legL: [-0.15, 0, 0] });
        rotX = -0.28 * (1 - Math.exp(-d * 2)) - 0.012 * d;
        rotZ = (m.idx % 2 ? 0.05 : -0.05) * d;
        m.actor.setExpr("pain");
      } else if (t > 323.3) {
        m.actor.setExpr(Math.sin(t * 15 + m.seed) > 0 ? "panic" : "talk");
        pose = add(pose, { armR: [-0.8 - 0.3 * Math.sin(t * 5 + m.seed), 0, 0.4], neck: [0, Math.sin(t * 3 + m.seed) * 0.6, 0] });
      } else {
        m.actor.setExpr(t > 272.4 && t < 275.6 && m.seed % 4 === 0 ? (Math.sin(t * 16) > 0 ? "talk" : "smile") : t > 270 ? "smile" : "neutral");
      }
      if (t > r) {
        const k = eseg(t, r, r + 0.8);
        rotY = mix(rotY, PI, k);
        pose = add(pose, { hips: [0.6 * k, 0, 0] });
      }
      fig.root.rotation.set(rotX, rotY, rotZ);
      applyPose(fig, pose);
      // visors: gold until the light drops, then clear one by one
      const clear = sseg(t, 270.6 + (m.seed % 11) * 0.12, 271.4 + (m.seed % 11) * 0.12);
      m.gear.setVisor(clear);
      if (m.target && m.idx === 4) {
        const crack = sseg(t, h + 0.05, h + 0.5);
        const blood = sseg(t, h + 0.2, h + 0.9);
        const frost = sseg(t, h + 1.5, h + 5);
        if (crack > 0) m.gear.paintVisor(crack, blood, frost, 5);
      }
    }
    // the photographer
    const P = W.photographer;
    const pv = t > 256 && t < 336;
    P.fig.root.visible = pv;
    if (pv) {
      if (P.fig.root.parent !== g) g.add(P.fig.root);
      const flee = eseg(t, 331, 336);
      P.fig.root.position.set(mix(3.2, 0, flee), mix(-1.6, 0, flee), mix(HATCH.z + 48, HATCH.z + 2, flee));
      P.fig.root.rotation.set(0, PI, 0);
      let pose = add(hover(t, 9), { armR: [-1.3, 0, 0.2] });
      if (t > 262.8 && t < 268) pose = add(pose, { armL: [-1.6 - 0.4 * Math.sin(t * 5), 0, -0.4] });
      applyPose(P.fig, pose);
    }
    // commuters (only for the establishing shot)
    W.commuters.forEach((c, i) => {
      const vis = t > 232 && t < 250;
      c.actor.fig.root.visible = vis;
      if (vis) {
        commuterPath(i, t, c.actor.fig.root.position);
        c.actor.fig.root.scale.setScalar(PX_METRES * 6);
        applyPose(c.actor.fig, float(t + i));
      }
    });
    // bullets
    W.bullets.forEach((b, i) => {
      const fire = SHOT_TIMES[i]!;
      const burst = Math.floor(i / 10);
      const target = W.crowd.filter((m) => m.target)[burst]!;
      const arrive = hitT(target) + (i % 10) * 0.025;
      const vis = t > fire && t < arrive;
      b.visible = vis;
      if (!vis) return;
      const from = v3(-0.25, 1.42, -0.7);
      const aimAt = target.slot.clone().add(v3(0, 1.2, 0));
      // a few rounds deliberately drift toward the people around the targets
      if (i % 10 === 7) aimAt.add(v3(0.6, 1.1, -1.1));
      if (i % 10 === 9) aimAt.add(v3(-0.7, 1.15, -1.1));
      aimAt.x += (hash3(i, 1, 1) - 0.5) * 0.25;
      aimAt.y += (hash3(i, 2, 1) - 0.5) * 0.3;
      const k = (t - fire) / (arrive - fire);
      b.position.lerpVectors(from, aimAt, k);
      b.lookAt(aimAt);
      b.rotation.z = t * 2 + i;
    });
  }

  function stationState(t: number) {
    const S = W.station;
    const open = eseg(t, 254.9, 256.6) * (1 - eseg(t, 339.4, 341.2));
    S.doorMesh.position.x = 7.6 * open;
    const green = t > 254.0 && t < 341.4;
    S.lampMat.color.set(green ? 0x30ff60 : 0xff2a20);
    (S.lampGlow.material as THREE.SpriteMaterial).color.set(green ? 0x30ff60 : 0xff3020);
    W.sur.updateDebris(t);
    (W.sur.beacon.material as THREE.SpriteMaterial).opacity = 0.6 + 0.4 * Math.sin(t * 3);
  }

  function spaceState(t: number) {
    sunState(t);
    stationState(t);
    zhangSpace(t);
    crowdState(t);
  }

  return {
    resetProps, dress, hutongState, roomState, workshopState, basementState, cabinState, spaceState,
    sunDir, crowdPos, hitT, emergeT, zhangDepart, zhangFlyIn, commuterPath, centre,
  };
}

export type Blocking = ReturnType<typeof makeBlocking>;
export { PI };
