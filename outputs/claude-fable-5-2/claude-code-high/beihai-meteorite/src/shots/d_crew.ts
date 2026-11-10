import * as THREE from "three";
import type { Pose } from "@agentbench/voxel-kit";
import type { Ctx } from "../film";
import { PHOTOGRAPHER, STRAYS, TARGETS, suit } from "../cast/cast";
import { mix } from "../cast/actors";
import { SPACE } from "../sets/space";
import { HATCH_OPEN, IMPACT, RETREAT, VISORS_CLEAR } from "../timeline";
import { clamp, easeIO, easeIn, hash1, lerp, seg, sstep, wobble, type V3 } from "../lib/util";

/**
 * The group photo: thirty-one suited figures leave the airlock, line up in three
 * rows against the hull, clear their visors for the camera, are hit, and flee.
 * Everything is a pure function of absolute time.
 */

const HATCH: V3 = [SPACE.hatch[0], SPACE.hatch[1], 886.6];

/** When each victim is struck. */
export const HIT_AT: Record<number, number> = {
  [TARGETS[0]!]: IMPACT + 0.55,
  [TARGETS[1]!]: IMPACT,
  [TARGETS[2]!]: IMPACT + 1.15,
  [STRAYS[0]!]: IMPACT + 0.25,
  [STRAYS[1]!]: IMPACT + 1.6,
};
/** Who hauls whom back to the airlock. */
const CARRIER: Record<number, number> = { [TARGETS[0]!]: 3, [TARGETS[1]!]: 14, [TARGETS[2]!]: 7, [STRAYS[0]!]: 16, [STRAYS[1]!]: 1 };

const exitAt = (i: number): number => HATCH_OPEN + 0.9 + (i === PHOTOGRAPHER ? 0 : 0.5 + i * 0.27);
const exitDur = (i: number): number => 5.4 + hash1(i * 3.3) * 1.6;
const retreatAt = (i: number): number => RETREAT + hash1(i * 5.1 + 2) * 2.4 + (i === PHOTOGRAPHER ? 1.2 : 0);
const retreatDur = (i: number): number => 7.0 + hash1(i * 7.7 + 1) * 3.0;

function slotAt(i: number, T: number): V3 {
  if (i === PHOTOGRAPHER) return SPACE.photographer;
  const s = SPACE.slot(i);
  // The back row starts ragged and wide, and is asked to close up.
  if (i >= 20) {
    const k = 1 - sstep(seg(T, 223.4, 228.2));
    s[0] *= 1 + 0.42 * k;
    s[1] += (hash1(i) - 0.4) * 1.2 * k;
  } else if (i >= 10) {
    const k = 1 - sstep(seg(T, 221.5, 226));
    s[0] *= 1 + 0.2 * k;
  }
  return s;
}

export interface CrewState {
  pos: V3;
  visible: boolean;
  /** 0 flying prone, 1 upright in formation. */
  upright: number;
  yaw: number;
  moving: boolean;
}

/** Position of crew member i ignoring being carried. */
function selfPos(i: number, T: number): CrewState {
  const e = exitAt(i);
  if (T < e) return { pos: HATCH, visible: false, upright: 0, yaw: Math.PI, moving: false };
  const s = slotAt(i, T);
  const u = seg(T, e, e + exitDur(i));
  if (u < 1) {
    const k = easeIO(u);
    const arc = Math.sin(Math.PI * u);
    const side = (hash1(i * 1.7) - 0.5) * 5, rise = (hash1(i * 2.9) - 0.5) * 3;
    return {
      pos: [lerp(HATCH[0], s[0], k) + side * arc, lerp(HATCH[1], s[1], k) + rise * arc, lerp(HATCH[2], s[2], k)],
      visible: true, upright: sstep(seg(u, 0.62, 1)), yaw: Math.PI, moving: u > 0.02 && u < 0.9,
    };
  }
  const hit = HIT_AT[i];
  const bob: V3 = [wobble(T * 0.33, i) * 0.07, wobble(T * 0.29, i + 40) * 0.07, wobble(T * 0.25, i + 80) * 0.05];
  if (hit !== undefined && T >= hit) {
    const dt = T - hit;
    // Knocked back and left drifting.
    const drift = 0.55 * (1 - Math.exp(-dt * 1.4)) + 0.12 * dt;
    return {
      pos: [s[0] + (hash1(i) - 0.5) * 0.5 * dt, s[1] + (hash1(i + 9) - 0.3) * 0.35 * dt, s[2] + drift],
      visible: true, upright: 1, yaw: Math.PI, moving: false,
    };
  }
  const r = retreatAt(i);
  if (T < r) return { pos: [s[0] + bob[0], s[1] + bob[1], s[2] + bob[2]], visible: true, upright: 1, yaw: Math.PI, moving: false };
  const v = seg(T, r, r + retreatDur(i));
  const k = easeIn(v) * 0.55 + v * 0.45;
  const turn = sstep(seg(T, r - 0.2, r + 0.9));
  return {
    pos: [lerp(s[0], HATCH[0] + (hash1(i) - 0.5) * 1.2, k), lerp(s[1], HATCH[1] + (hash1(i + 3) - 0.5) * 1.2, k), lerp(s[2], HATCH[2] + 1.5, k)],
    visible: v < 0.985, upright: 1 - sstep(seg(v, 0.05, 0.3)) * 0.85, yaw: Math.PI * (1 - turn), moving: v > 0.02,
  };
}

export function crewState(i: number, T: number): CrewState {
  const carrier = CARRIER[i];
  if (carrier !== undefined) {
    const grab = retreatAt(carrier) + 0.8;
    if (T > grab) {
      const c = selfPos(carrier, T);
      const own = selfPos(i, grab);
      const k = sstep(seg(T, grab, grab + 1.2));
      return {
        pos: [lerp(own.pos[0], c.pos[0] + 0.5, k), lerp(own.pos[1], c.pos[1] - 0.7, k), lerp(own.pos[2], c.pos[2] - 0.9, k)],
        visible: c.visible, upright: 1, yaw: Math.PI, moving: false,
      };
    }
  }
  return selfPos(i, T);
}

const FLY: Pose = { hips: [0, 0, 0], neck: [-0.9, 0, 0], armR: [-0.25, 0, -0.12], armL: [-0.25, 0, 0.12], legR: [0.12, 0, 0.04], legL: [0.05, 0, -0.04] };
const LIMP: Pose = { hips: [-0.25, 0.1, 0.05], neck: [0.5, 0.2, 0.15], armR: [-0.9, 0, -0.7], armL: [-0.55, 0, 0.9], legR: [-0.5, 0, 0.3], legL: [0.25, 0, -0.25] };

function posed(i: number, T: number): Pose {
  const b = wobble(T * 0.5, i * 3);
  const stand: Pose = {
    hips: [-0.04 + b * 0.02, 0, wobble(T * 0.3, i) * 0.03],
    neck: [0.03, wobble(T * 0.4, i + 5) * 0.12, 0],
    armR: [-0.28 + b * 0.05, 0, -0.14],
    armL: [-0.24 - b * 0.05, 0, 0.14],
    legR: [-0.16 + b * 0.03, 0, 0.06],
    legL: [-0.06 - b * 0.03, 0, -0.06],
  };
  return stand;
}

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();

/** Pose, dress and place the whole group for time T. Returns head positions of interest. */
export function stageCrew(ctx: Ctx, T: number): { heads: Record<number, V3> } {
  const { cast } = ctx;
  const heads: Record<number, V3> = {};
  for (let i = 0; i <= PHOTOGRAPHER; i++) {
    const a = cast.crew[i]!;
    const st = crewState(i, T);
    a.show(st.visible);
    if (!st.visible) continue;
    const hit = HIT_AT[i];
    const isHit = hit !== undefined && T >= hit;
    const react = IMPACT + 0.5 + hash1(i * 4.4) * 0.9;
    const panic = T > react;

    // Orientation.
    let pitch = lerp(1.25, 0, st.upright);
    let yaw = st.yaw, roll = wobble(T * 0.2, i + 20) * 0.04;
    if (i === PHOTOGRAPHER && T < retreatAt(i)) {
      yaw = lerp(Math.PI, 0.12, sstep(seg(T, exitAt(i) + 3.6, exitAt(i) + 5.4)));
      pitch = lerp(pitch, -0.12, st.upright);
    }
    if (isHit) {
      const dt = T - hit;
      const spin = (1 - Math.exp(-dt * 0.9)) * 1.6 + dt * 0.16;
      pitch -= spin * (0.7 + hash1(i) * 0.5);
      roll += spin * (hash1(i + 2) - 0.5) * 1.3;
      yaw += spin * (hash1(i + 4) - 0.5) * 0.9;
    } else if (panic && T < retreatAt(i)) {
      // Heads snap toward the centre of the front row.
      const s = SPACE.slot(5);
      yaw += clamp((s[0] - st.pos[0]) * -0.07, -0.5, 0.5) * sstep(seg(T, react, react + 0.4));
    }
    a.root.position.set(st.pos[0], st.pos[1], st.pos[2]);
    _e.set(pitch, yaw, roll, "YXZ");
    a.root.quaternion.setFromEuler(_e);

    // Performance.
    let pose = mix(FLY, posed(i, T), st.upright);
    const wave = i !== PHOTOGRAPHER && hash1(i * 9.1) > 0.72 ? Math.max(0, Math.sin((T - 229) * 0.9 + i)) * sstep(seg(T, 229, 230)) * (1 - seg(T, 238, 239)) : 0;
    if (wave > 0) pose = { ...pose, armL: [-2.6 + Math.sin(T * 7 + i) * 0.25 * wave, 0, lerp(0.14, 0.5, wave)] };
    if (i === PHOTOGRAPHER && T < retreatAt(i)) {
      const up = sstep(seg(T, exitAt(i) + 5, exitAt(i) + 6.4));
      const directing = (T > 222.8 && T < 227.2) || (T > 228 && T < 232.4) ? 1 : 0;
      pose = { ...pose, armR: [lerp(-0.28, -1.5, up), 0, 0.2], armL: [lerp(-0.24, -1.35 - directing * (0.5 + Math.sin(T * 5) * 0.3), up), 0, -0.25 - directing * 0.5] };
    }
    if (isHit) pose = mix(pose, LIMP, sstep(seg(T, hit, hit + 0.9)));
    else if (panic) {
      const k = sstep(seg(T, react, react + 0.35));
      const flail = Math.sin(T * 9 + i * 2) * 0.25;
      const fleeing = T >= retreatAt(i);
      pose = mix(pose, fleeing
        ? { hips: [0, 0, 0], neck: [-0.7, 0, 0], armR: [-2.7, 0, -0.1], armL: [-2.7, 0, 0.1], legR: [0.2 + flail * 0.4, 0, 0], legL: [0.2 - flail * 0.4, 0, 0] }
        : { hips: [-0.15, 0, 0], neck: [-0.05, 0, 0], armR: [-1.4 + flail, 0, -0.5], armL: [-1.2 - flail, 0, 0.5], legR: [-0.4, 0, 0.15], legL: [0.1, 0, -0.15] }, k);
    }
    a.pose(pose);

    // Visor and face.
    const clearAt = VISORS_CLEAR + hash1(i * 6.3) * 2.0 + (i === PHOTOGRAPHER ? 30 : 0) + (TARGETS.includes(i) ? TARGETS.indexOf(i) * 0.35 - 0.2 : 0);
    let visor: "dark" | "clear" | "cracked" | "bloody" = T > clearAt ? "clear" : "dark";
    if (i === TARGETS[1] && isHit) visor = T - hit! > 0.22 ? "bloody" : "cracked";
    if (i === TARGETS[0] && isHit) visor = "cracked";
    a.clothes(suit({ visor, stripe: cast.crewStripe[i]! }));
    if (isHit) a.face(STRAYS.includes(i) ? "wide" : "shut", STRAYS.includes(i) ? "gape" : "shut");
    else if (panic) a.face("wide", hash1(Math.floor(T * 6) + i) > 0.4 ? "gape" : "open");
    else a.live(T, { mouth: T > 229.5 && hash1(i * 2.2) > 0.25 ? "smile" : "shut" });

    if (TARGETS.includes(i) || i === 16 || i === 3 || i === PHOTOGRAPHER || i === 11) {
      a.root.updateWorldMatrix(true, true);
      const v = a.figure.anchors.head.getWorldPosition(new THREE.Vector3());
      const c = a.root.position;
      heads[i] = [lerp(c.x, v.x, 0.72), lerp(c.y, v.y, 0.72), lerp(c.z, v.z, 0.72)];
    }
  }
  void _q;
  return { heads };
}

/** Cold-gas wake of everyone who is under thrust, the leaks, the red ice. */
export function crewParticles(ctx: Ctx, T: number): void {
  const { space } = ctx;
  const puffs = space.puffs.begin();
  for (let i = 0; i <= PHOTOGRAPHER; i++) {
    const legs: Array<[number, number, number, number]> = [
      [exitAt(i), exitAt(i) + exitDur(i) * 0.92, 0.3, 2.2],
      [retreatAt(i), retreatAt(i) + retreatDur(i), 0.17, 3.0],
    ];
    for (const [a, b, step, life] of legs) {
      if (T < a || T > b + life) continue;
      const first = Math.max(0, Math.ceil((T - life - a) / step));
      const last = Math.floor((Math.min(T, b) - a) / step);
      for (let k = first; k <= last; k++) {
        const born = a + k * step;
        const age = T - born;
        if (age < 0 || age > life) continue;
        const p = crewState(i, born).pos;
        const h = hash1(i * 13.1 + k * 1.7);
        const size = (0.16 + age * 0.34) * (1 - Math.pow(age / life, 2));
        puffs.put(p[0] + (h - 0.5) * 0.5 * age, p[1] - 0.2 + (hash1(k + i) - 0.5) * 0.5 * age, p[2] + (a < RETREAT ? 0.7 : -0.6) + (hash1(k * 3 + i) - 0.5) * 0.4, size, 0xe9eef5, h * 6 + age);
      }
    }
  }
  puffs.end();

  const gas = space.gas.begin();
  const blood = space.blood.begin();
  for (const key of Object.keys(HIT_AT)) {
    const i = Number(key), hit = HIT_AT[i]!;
    if (T < hit) continue;
    const big = i === STRAYS[0]; // a round went through into the thruster pack behind
    const n = big ? 110 : 46;
    for (let k = 0; k < n; k++) {
      const born = hit + (big ? Math.pow(k / n, 2) * 1.2 : (k / n) * 5.5);
      const age = T - born;
      const life = big ? 3.6 : 2.0;
      if (age < 0 || age > life) continue;
      const src = crewState(i, born).pos;
      const h1 = hash1(i * 31 + k * 1.31), h2 = hash1(i * 17 + k * 2.17), h3 = hash1(i * 7 + k * 3.03);
      const speed = (big ? 2.6 : 1.7) * (0.4 + h3);
      const dir: V3 = big
        ? [(h1 - 0.5) * 2, (h2 - 0.5) * 2, (h3 - 0.5) * 1.6 - 0.3]
        : [(h1 - 0.5) * 1.1 + (i % 2 ? 0.5 : -0.5), (h2 - 0.3) * 1.1, -0.9 - h3 * 0.5];
      const d = speed * (1 - Math.exp(-age * 1.3)) * 1.4 + age * 0.25;
      const size = (0.07 + age * (big ? 0.3 : 0.18)) * (1 - Math.pow(age / life, 2.5));
      gas.put(src[0] + dir[0] * d, src[1] + 0.25 + dir[1] * d, src[2] - 0.2 + dir[2] * d, size, 0xf2f5fa, h1 * 6 + age * 1.5);
    }
    if (i === TARGETS[1] || i === TARGETS[0]) {
      // Blood leaves with the air and freezes into pink snow.
      const m = i === TARGETS[1] ? 110 : 50;
      for (let k = 0; k < m; k++) {
        const born = hit + 0.2 + (k / m) * 4.2;
        const age = T - born;
        if (age < 0 || age > 9) continue;
        const src = crewState(i, born).pos;
        const h1 = hash1(i * 3 + k * 5.31), h2 = hash1(i * 5 + k * 1.77), h3 = hash1(i * 11 + k * 0.93);
        const d = (0.6 + h3 * 1.4) * (1 - Math.exp(-age * 1.1)) + age * 0.18;
        const frozen = sstep(age / 1.2);
        const col = frozen > 0.6 ? (h1 > 0.5 ? 0xd8727c : 0xb23a48) : 0x8c0d16;
        const tw = 0.7 + 0.6 * Math.abs(Math.sin(age * 5 + k));
        blood.put(src[0] + (h1 - 0.5) * 1.3 * d, src[1] + 0.62 + (h2 - 0.4) * 1.0 * d, src[2] - 0.3 - d * 1.2, 0.045 + h3 * 0.05, col, age * 2 + k, tw);
      }
    }
  }
  gas.end();
  blood.end();
}
