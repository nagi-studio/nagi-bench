import * as THREE from "three";
import { at, ORIGINS, type FilmWorld } from "./world";
import { nk, sampleNum, sampleVec, vk, type EaseFn, type NumKey, type VecKey } from "../lib/cameraRig";
import {
  clamp01,
  easeInCubic,
  easeInOutCubic,
  easeInOutSine,
  easeOutCubic,
  easeOutExpo,
  lerp,
  smoothstep
} from "../lib/rng";
import type { Shot } from "./types";
import type { EnvState } from "./types";
import type { VoxelActor } from "../art/characters";

/* ============================================================== helpers */

type Key = [number, number, number, number, EaseFn?];

interface ShotDef {
  id: string;
  start: number;
  end: number;
  set: string;
  note: string;
  pos: Key[];
  look: Key[];
  fov?: [number, number, EaseFn?][];
  handheld?: number;
  env?: Partial<EnvState>;
  act?: (w: FilmWorld, p: number) => void;
}

/* colour script — one environment per look */
const ENV = {
  space: { bg: new THREE.Color(0x02030a), fog: new THREE.Color(0x02030a), fogDensity: 0.0011, exposure: 0.95, bloom: 0.8 },
  council: { bg: new THREE.Color(0x090d13), fog: new THREE.Color(0x0d131b), fogDensity: 0.02, exposure: 1.08, bloom: 0.5 },
  corridor: { bg: new THREE.Color(0x080b10), fog: new THREE.Color(0x0b1017), fogDensity: 0.03, exposure: 1.0, bloom: 0.5 },
  market: { bg: new THREE.Color(0x3a2a18), fog: new THREE.Color(0x4a3520), fogDensity: 0.016, exposure: 1.06, bloom: 0.62 },
  workshop: { bg: new THREE.Color(0x0d0905), fog: new THREE.Color(0x1a120a), fogDensity: 0.032, exposure: 1.14, bloom: 0.72 },
  rangeExt: { bg: new THREE.Color(0x080c14), fog: new THREE.Color(0x0f1620), fogDensity: 0.015, exposure: 0.96, bloom: 0.5 },
  rangeIn: { bg: new THREE.Color(0x05070a), fog: new THREE.Color(0x0a0d11), fogDensity: 0.034, exposure: 1.0, bloom: 0.5 },
  lab: { bg: new THREE.Color(0x11161c), fog: new THREE.Color(0x1b2228), fogDensity: 0.022, exposure: 1.06, bloom: 0.45 },
  review: { bg: new THREE.Color(0x090d13), fog: new THREE.Color(0x0d131b), fogDensity: 0.02, exposure: 1.05, bloom: 0.5 },
  modelshop: { bg: new THREE.Color(0x04070d), fog: new THREE.Color(0x090f18), fogDensity: 0.02, exposure: 1.0, bloom: 0.62 },
  teststand: { bg: new THREE.Color(0x04060c), fog: new THREE.Color(0x0a1420), fogDensity: 0.005, exposure: 1.0, bloom: 1.15 }
} satisfies Record<string, Partial<EnvState>>;

function wpath(set: string, keys: Key[]): VecKey[] {
  const o = ORIGINS[set];
  return keys.map(([t, x, y, z, e]) => vk(t, o.x + x, y, o.z + z, e));
}

function put(a: VoxelActor, set: string, x: number, y: number, z: number, yaw: number): void {
  const p = at(set, x, y, z);
  a.setPosition(p.x, p.y, p.z);
  a.setYaw(yaw);
  a.root.visible = true;
}

function hideAll(w: FilmWorld): void {
  const cast = w.cast as Record<string, VoxelActor>;
  for (const k of Object.keys(cast)) {
    const a = cast[k];
    a.root.visible = false;
    a.reset();
    a.fallAngle = 0;
    a.fallSpin = 0;
    a.fallDrop = 0;
  }
  w.pistol.visible = false;
}

function seated(a: VoxelActor): void {
  a.setPose({ hipLX: -1.28, kneeLX: 1.5, hipRX: -1.28, kneeRX: 1.5, torsoX: 0.09 });
}

function fallTo(a: VoxelActor, k: number, dir = 1): void {
  const e = clamp01(k);
  a.fallAngle = -e * Math.PI * 0.47;
  a.fallDrop = -e * 0.14;
  a.fallSpin = dir * e * 0.45;
}

function handsFolded(a: VoxelActor): void {
  a.setPose({ shoulderLX: -0.42, elbowLX: 1.3, shoulderRX: -0.42, elbowRX: 1.3, torsoX: 0.05 });
}

/** world position of the muzzle in a given set (approx., for flashes) */
const _mz = new THREE.Vector3();
function muzzleWorld(w: FilmWorld, set: string, x: number, y: number, z: number): THREE.Vector3 {
  return at(set, x, y, z, _mz);
}

/* ============================================================== shot list */

const DEFS: ShotDef[] = [
  /* ---------------------------------------------------------- prologue */
  {
    id: "p1",
    start: 0,
    end: 6,
    set: "space",
    note: "陨石在星海里缓缓翻滚 / the stone turns in the dark",
    env: ENV.space,
    pos: [
      [0, 2.0, 0.8, 8.0, easeOutCubic],
      [6, 0.7, 0.1, 5.4, easeInOutSine]
    ],
    look: [[0, 0, 0, 0], [6, 0, 0, 0]],
    fov: [[0, 34], [6, 36]],
    handheld: 0
  },
  {
    id: "p2",
    start: 6,
    end: 13,
    set: "space",
    note: "片名 / main title",
    env: ENV.space,
    pos: [
      [6, 0.9, 0.1, 6.2, easeInOutSine],
      [13, 1.4, 0.5, 7.0, easeInOutSine]
    ],
    look: [[6, 0, 0, 0], [13, 0, 0, 0]],
    fov: [[6, 36], [13, 38]],
    handheld: 0
  },
  {
    id: "p3",
    start: 13,
    end: 20,
    set: "space",
    note: "三体舰队爬过群星 / the fleet crawls across the stars",
    env: ENV.space,
    pos: [
      [13, 2.2, 1.2, -24, easeInOutSine],
      [20, 0.4, -0.6, -50, easeOutCubic]
    ],
    look: [[13, 0, 0, -150], [20, 0, 2, -190]],
    fov: [[13, 40], [20, 44]],
    handheld: 0.02
  },

  /* ------------------------------------------------------------- act I */
  {
    id: "a1",
    start: 20,
    end: 34,
    set: "council",
    note: "评审会 · 全景 / the review, wide",
    env: ENV.council,
    pos: [
      [20, 2.6, 1.05, 3.9, easeInOutSine],
      [34, 1.6, 1.25, 3.0, easeInOutSine]
    ],
    look: [
      [20, -0.3, 1.3, -0.9],
      [34, -0.2, 1.3, -0.9]
    ],
    fov: [[20, 36], [34, 33]],
    handheld: 0.045,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3, zhang } = w.cast;
      put(old1, "council", -2.6, -0.42, -1.15, 0.06);
      put(old2, "council", 0, -0.42, -1.15, -0.03);
      put(old3, "council", 2.6, -0.42, -1.15, 0.03);
      put(zhang, "council", 0.15, -0.42, 1.2, Math.PI);
      for (const a of [old1, old2, old3]) seated(a);
      handsFolded(zhang);
      // the speaker gestures; the others listen
      const g = Math.sin(w.time * 2.2);
      old1.setPose({ shoulderRX: -0.55 + g * 0.15, elbowRX: 0.9 + g * 0.25, neckY: -0.12, torsoY: -0.08 });
      old2.setPose({ neckY: 0.12, neckX: 0.05 });
      old3.setPose({ neckY: -0.06 });
      zhang.lookAtWorld(at("council", p > 0.8 ? -0.2 : -0.5, 1.4, -1.1));
    }
  },
  {
    id: "a2",
    start: 34,
    end: 46,
    set: "council",
    note: "老航天乙 / the second old man",
    env: ENV.council,
    pos: [
      [34, 1.8, 1.35, 1.7, easeInOutSine],
      [46, 0.9, 1.3, 1.0, easeInOutSine]
    ],
    look: [
      [34, 0.2, 1.32, -1.1],
      [46, 0.6, 1.3, -1.1]
    ],
    fov: [[34, 31], [46, 28]],
    handheld: 0.05,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3, zhang } = w.cast;
      put(old1, "council", -2.6, -0.42, -1.15, 0.08);
      put(old2, "council", 0, -0.42, -1.15, -0.02);
      put(old3, "council", 2.6, -0.42, -1.15, 0.05);
      put(zhang, "council", 0.15, -0.42, 1.2, Math.PI);
      for (const a of [old1, old2, old3]) seated(a);
      handsFolded(zhang);
      const g = Math.sin(w.time * 2.6);
      old2.setPose({ shoulderRX: -0.5 + g * 0.12, elbowRX: 1.0 + g * 0.2, neckY: 0.1 });
      old1.setPose({ neckY: -0.1, neckX: 0.04 });
      old3.setPose({ neckY: -0.05 });
      zhang.lookAtWorld(at("council", 0, 1.4, -1.1));
    }
  },
  {
    id: "a3",
    start: 46,
    end: 58,
    set: "council",
    note: "章北海 · 沉默 / Zhang, silent",
    env: ENV.council,
    pos: [
      [46, 1.15, 1.52, 2.7, easeInOutSine],
      [58, 0.5, 1.46, 2.15, easeInOutSine]
    ],
    look: [
      [46, 0.12, 1.5, 1.15],
      [58, 0.08, 1.44, 1.15]
    ],
    fov: [[46, 28], [58, 26]],
    handheld: 0.035,
    act(w, p) {
      hideAll(w);
      const { zhang, old1, old2, old3 } = w.cast;
      put(zhang, "council", 0.15, -0.42, 1.2, Math.PI);
      seated(zhang);
      handsFolded(zhang);
      put(old1, "council", -2.6, -0.42, -1.15, 0.06);
      put(old2, "council", 0, -0.42, -1.15, 0);
      put(old3, "council", 2.6, -0.42, -1.15, 0);
      for (const a of [old1, old2, old3]) seated(a);
      zhang.lookAtWorld(at("council", -0.3 + p * 0.5, 1.42, -1.1));
      zhang.setPose({ neckX: 0.02 });
    }
  },
  {
    id: "a4",
    start: 58,
    end: 70,
    set: "corridor",
    note: "走廊 · 敬礼 / the salute",
    env: ENV.corridor,
    pos: [
      [58, 0.0, 1.62, 11, easeInOutSine],
      [70, -0.35, 1.58, 14.2, easeInOutSine]
    ],
    look: [
      [58, 0, 1.5, 2.0],
      [70, 0, 1.5, 4.5]
    ],
    fov: [[58, 36], [70, 34]],
    handheld: 0.055,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3, zhang } = w.cast;
      const t = w.time;
      const z = -8.5 + (t - 58) * 1.02;
      put(old1, "corridor", -0.55, 0, z, 0);
      put(old2, "corridor", 0.05, 0, z - 1.1, 0);
      put(old3, "corridor", 0.6, 0, z - 2.2, 0);
      for (const a of [old1, old2, old3]) a.startWalk(1);
      put(zhang, "corridor", -1.15, 0, 1.4, Math.PI);
      const saluting = p > 0.12 && p < 0.86;
      zhang.salute(saluting ? 1 : 0);
      zhang.lookAtWorld(at("corridor", 0.05, 1.45, z - 1.1), 0.85);
      if (p > 0.9) {
        zhang.setPose({ neckY: 0.55, torsoY: 0.12 });
      }
    }
  },

  /* ------------------------------------------------------------ act II */
  {
    id: "b1",
    start: 70,
    end: 82,
    set: "market",
    note: "古玩市场 · 阿勒泰陨铁 / the market",
    env: ENV.market,
    pos: [
      [70, 2.6, 1.55, -0.1, easeInOutSine],
      [82, 1.55, 1.35, -0.95, easeInOutSine]
    ],
    look: [
      [70, -0.1, 1.2, -2.2],
      [82, -0.1, 1.1, -2.7]
    ],
    fov: [[70, 34], [82, 30]],
    handheld: 0.06,
    act(w, p) {
      hideAll(w);
      const { vendor, zhang } = w.cast;
      put(vendor, "market", 0, 0, -3.5, 0);
      put(zhang, "market", 0.3, 0, -1.3, Math.PI);
      vendor.setPose({ shoulderRX: -0.5 + Math.sin(w.time * 2.4) * 0.15, elbowRX: 0.9, neckX: 0.1, neckY: -0.05 });
      zhang.lookAtWorld(at("market", 0, 1.0, -2.3), 0.9);
      zhang.setPose({ shoulderRX: -0.7, elbowRX: 0.8, torsoX: 0.08 });
      if (p > 0.55) zhang.setPose({ shoulderRX: -0.9, elbowRX: 1.0 });
    }
  },
  {
    id: "b2",
    start: 82,
    end: 94,
    set: "market",
    note: "称重 / weighing the iron",
    env: ENV.market,
    pos: [
      [82, 0.75, 1.28, -1.45, easeInOutSine],
      [94, 0.5, 1.02, -1.7, easeInOutSine]
    ],
    look: [
      [82, 0, 0.98, -2.1],
      [94, 0, 1.06, -2.1]
    ],
    fov: [[82, 27], [94, 24]],
    handheld: 0.035,
    act(w, p) {
      hideAll(w);
      const { zhang } = w.cast;
      put(zhang, "market", 0.3, 0, -1.3, Math.PI);
      zhang.setPose({ shoulderRX: -1.0, elbowRX: 0.9, torsoX: 0.14 });
      zhang.lookAtWorld(at("market", 0, 1.0, -2.1), 1);
      const s = w.sets.market.root.getObjectByName("meteorSample");
      if (s) {
        const lift = smoothstep(0.42, 0.62, p) * 0.34;
        s.position.y = 0.95 + lift;
        s.rotation.y = w.time * 0.5;
      }
    }
  },
  {
    id: "b3",
    start: 94,
    end: 110,
    set: "workshop",
    note: "老工匠 · 车床 / the gunsmith",
    env: ENV.workshop,
    pos: [
      [94, -1.0, 1.55, 2.7, easeInOutSine],
      [110, -1.5, 1.45, 2.0, easeInOutSine]
    ],
    look: [
      [94, -2.6, 1.3, -1.3],
      [110, -2.7, 1.25, -1.3]
    ],
    fov: [[94, 33], [110, 29]],
    handheld: 0.05,
    act(w, p) {
      hideAll(w);
      const { smith, zhang } = w.cast;
      put(smith, "workshop", -2.35, 0, -1.6, -1.9);
      put(zhang, "workshop", -3.0, 0, 0.95, -0.35);
      smith.setPose({ shoulderRX: -1.15, elbowRX: 0.75, neckX: 0.2, neckY: -0.2, torsoX: 0.1 });
      zhang.setPose({ shoulderLX: -0.15, shoulderRX: -0.15, torsoX: 0.02 });
      zhang.lookAtWorld(at("workshop", -2.35, 1.3, -1.6), 0.9);
      if (p > 0.42) smith.setPose({ neckY: -0.05, neckX: 0.28 });
      if (p > 0.6) smith.setPose({ neckY: 0.1, neckX: 0.24 });
      // lathe sparks, synced to the cut
      if (p > 0.06 && p < 0.9 && Math.floor(w.time * 14) !== Math.floor((w.time - w.dt) * 14)) {
        w.fx.sparkBurst(at("workshop", -3.4, 1.25, -1.0), 14, 0xffc27a, 2.6);
      }
    }
  },
  {
    id: "b4",
    start: 110,
    end: 124,
    set: "workshop",
    note: "弹芯 / the cores",
    env: ENV.workshop,
    pos: [
      [110, -2.9, 1.22, 1.55, easeInOutSine],
      [124, -3.25, 1.02, 1.15, easeInOutSine]
    ],
    look: [
      [110, -3.4, 0.98, 0.9],
      [124, -3.4, 0.97, 0.9]
    ],
    fov: [[110, 26], [124, 23]],
    handheld: 0.03,
    act(w) {
      hideAll(w);
      const { smith, zhang } = w.cast;
      put(smith, "workshop", -2.35, 0, -1.6, -1.9);
      put(zhang, "workshop", -3.0, 0, 0.95, -0.35);
      smith.setPose({ shoulderRX: -1.1, elbowRX: 0.8, neckX: 0.24, neckY: -0.1 });
      zhang.setPose({ shoulderLX: -0.12, shoulderRX: -0.12, torsoX: 0.02 });
      zhang.lookAtWorld(at("workshop", -3.4, 0.98, 0.9), 0.8);
      const block = w.sets.workshop.root.getObjectByName("meteorBlock");
      if (block) block.rotation.y = w.time * 0.2;
      if (Math.floor(w.time * 8) !== Math.floor((w.time - w.dt) * 8)) {
        w.fx.sparkBurst(at("workshop", -3.4, 1.25, -1.0), 8, 0xffc27a, 2.0);
      }
    }
  },
  {
    id: "b5",
    start: 124,
    end: 136,
    set: "workshop",
    note: "交易完成 / done",
    env: ENV.workshop,
    pos: [
      [124, -0.8, 1.65, 2.4, easeInOutSine],
      [136, 0.6, 1.55, 3.2, easeInOutSine]
    ],
    look: [
      [124, -2.8, 1.2, -1.2],
      [136, -2.6, 1.15, -1.4]
    ],
    fov: [[124, 32], [136, 36]],
    handheld: 0.045,
    act(w, p) {
      hideAll(w);
      const { smith, zhang } = w.cast;
      put(smith, "workshop", -2.35, 0, -1.6, -1.9);
      put(zhang, "workshop", -3.0, 0, 0.95, -0.35);
      smith.setPose({ shoulderRX: -1.15, elbowRX: 0.7, neckX: 0.3, neckY: -0.05 });
      zhang.setPose({ shoulderLX: -0.1, shoulderRX: -0.1 });
      zhang.lookAtWorld(at("workshop", -2.35, 1.3, -1.6), 0.7);
      if (p > 0.7) {
        zhang.setPose({ neckY: -0.5 });
        zhang.lookAtWorld(at("workshop", -1.0, 1.4, 3.0), 0.8);
      }
    }
  },

  /* ----------------------------------------------------------- act III */
  {
    id: "c1",
    start: 136,
    end: 150,
    set: "basement",
    note: "城郊 · 地下室靶场 / the range, outside",
    env: ENV.rangeExt,
    pos: [
      [136, 3.2, 1.6, 25, easeInOutSine],
      [150, 1.0, 1.5, 19.5, easeInOutSine]
    ],
    look: [
      [136, 0, 2.1, 11.5],
      [150, 0, 1.85, 11.8]
    ],
    fov: [[136, 34], [150, 32]],
    handheld: 0.06,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3 } = w.cast;
      const k = smoothstep(0.05, 0.62, p);
      const x = lerp(7.5, 0.8, k);
      const z = lerp(15.5, 12.3, k);
      put(old1, "basement", x, 0, z, -Math.PI * 0.75);
      put(old2, "basement", x - 0.8, 0, z + 0.6, -Math.PI * 0.75);
      put(old3, "basement", x - 1.6, 0, z + 1.2, -Math.PI * 0.75);
      for (const a of [old1, old2, old3]) if (k < 0.98) a.startWalk(1);
      if (k >= 0.98) {
        for (const a of [old1, old2, old3]) a.stopWalk();
        old1.setPose({ neckY: 0.1 });
      }
    }
  },
  {
    id: "c2",
    start: 150,
    end: 164,
    set: "basement",
    note: "靶场 · 每周一次 / their weekly practice",
    env: ENV.rangeIn,
    pos: [
      [150, 1.6, 1.5, 6.8, easeInOutSine],
      [164, -1.6, 1.4, 6.0, easeInOutSine]
    ],
    look: [
      [150, 0, 1.3, 3.4],
      [164, 0, 1.25, 3.6]
    ],
    fov: [[150, 36], [164, 33]],
    handheld: 0.065,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3 } = w.cast;
      const z = lerp(8.5, 3.6, smoothstep(0.0, 0.55, p));
      put(old1, "basement", -3.4, 0, z, Math.PI);
      put(old2, "basement", 0, 0, z, Math.PI);
      put(old3, "basement", 3.4, 0, z, Math.PI);
      for (const a of [old1, old2, old3]) if (p < 0.55) a.startWalk(1);
      else a.stopWalk();
      if (p > 0.55) {
        old1.setPose({ shoulderRX: -0.9, elbowRX: 0.7, neckX: 0.15 });
        old2.setPose({ shoulderRX: -0.8, elbowRX: 0.8, neckX: 0.12 });
        old3.setPose({ neckY: -0.1, neckX: 0.1 });
      }
      // the watcher in the dark alcove: just a hint of shoulders
      const { zhang } = w.cast;
      put(zhang, "basement", -4.7, 0, 8.0, Math.PI * 0.92);
      zhang.setPose({ shoulderLX: -0.1, shoulderRX: -0.1, torsoX: 0.05 });
      zhang.lookAtWorld(at("basement", 0, 1.35, 3.6), 0.9);
    }
  },
  {
    id: "c3",
    start: 164,
    end: 176,
    set: "basement",
    note: "阴影里 / out of the shadow",
    env: ENV.rangeIn,
    pos: [
      [164, -4.05, 1.55, 7.6, easeInOutSine],
      [170, -3.5, 1.45, 7.15, easeInOutSine],
      [176, -1.9, 1.65, 7.6, easeInOutSine]
    ],
    look: [
      [164, -3.2, 1.55, 7.2],
      [170, -3.2, 1.5, 7.2],
      [176, 0, 1.35, 3.6]
    ],
    fov: [[164, 27], [170, 25], [176, 30]],
    handheld: 0.04,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3, zhang } = w.cast;
      put(old1, "basement", -3.4, 0, 3.6, Math.PI);
      put(old2, "basement", 0, 0, 3.6, Math.PI);
      put(old3, "basement", 3.4, 0, 3.6, Math.PI);
      old1.setPose({ shoulderRX: -0.85, elbowRX: 0.75, neckX: 0.15 });
      old2.setPose({ shoulderRX: -0.8, elbowRX: 0.8, neckX: 0.12 });
      old3.setPose({ neckY: -0.1, neckX: 0.1 });
      put(zhang, "basement", -3.2, 0, 6.6, Math.PI);
      w.pistol.visible = true;
      const aim = smoothstep(0.45, 0.92, p);
      zhang.aim(aim);
      zhang.lookAtWorld(at("basement", 0, 1.3, 3.6), 0.8);
      if (p < 0.42) zhang.setPose({ shoulderRX: -0.2, elbowRX: 0.3, neckY: 0.1 });
    }
  },
  {
    id: "c4",
    start: 176,
    end: 186,
    set: "basement",
    note: "三声 / three shots",
    env: ENV.rangeIn,
    pos: [
      [176, -1.9, 1.6, 7.8, easeInOutSine],
      [186, -0.6, 1.35, 6.4, easeInOutSine]
    ],
    look: [
      [176, 0, 1.3, 3.6],
      [186, 0, 0.85, 2.4]
    ],
    fov: [[176, 30], [186, 28]],
    handheld: 0.03,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3, zhang } = w.cast;
      put(old1, "basement", -3.4, 0, 3.6, Math.PI);
      put(old2, "basement", 0, 0, 3.6, Math.PI);
      put(old3, "basement", 3.4, 0, 3.6, Math.PI);
      put(zhang, "basement", -3.2, 0, 6.6, Math.PI);
      w.pistol.visible = true;
      zhang.aim(1, 0.02);
      zhang.lookAtWorld(at("basement", 0, 1.3, 3.6), 0.6);

      const shots = [177.0, 178.2, 179.4];
      const targets = [old1, old2, old3];
      const dirs = [1, -1, 1];
      const muzzle = muzzleWorld(w, "basement", -3.2, 1.42, 5.8);
      for (let i = 0; i < 3; i++) {
        const dtShot = w.time - shots[i];
        const fk = clamp01((dtShot - 0.04) / 0.8);
        fallTo(targets[i], fk, dirs[i]);
      }
      // muzzle flashes + casings, fired once per shot
      for (let i = 0; i < 3; i++) {
        if (w.time >= shots[i] && w.time < shots[i] + w.dt + 0.001 && !fired[i]) {
          fired[i] = true;
          w.fx.flash(muzzle, 0xffd9a0, 90, 9);
          w.fx.sparkBurst(muzzle, 26, 0xffb457, 3.4);
          w.fx.smoke(muzzle, 5, 0x9aa0a6, 0.5);
          w.fx.debris(muzzle, 3, 0xc79a4a, 1.4);
          w.rig.punch(1.1);
        }
      }
      if (w.time > shots[2] + 2.5 && p > 0.6) {
        zhang.setPose({ shoulderRX: -0.5, elbowRX: 1.1, torsoX: 0.08, neckX: 0.12 });
      }
    }
  },
  {
    id: "c5",
    start: 186,
    end: 198,
    set: "basement",
    note: "余响 / the ringing",
    env: ENV.rangeIn,
    pos: [
      [186, -1.2, 0.7, 5.4, easeInOutSine],
      [198, 1.6, 1.35, 3.4, easeInOutSine]
    ],
    look: [
      [186, 0, 0.5, 3.4],
      [198, 0, 0.6, 2.2]
    ],
    fov: [[186, 30], [198, 32]],
    handheld: 0.05,
    act(w, p) {
      hideAll(w);
      const { old1, old2, old3, zhang } = w.cast;
      put(old1, "basement", -3.4, 0, 3.6, Math.PI);
      put(old2, "basement", 0, 0, 3.6, Math.PI);
      put(old3, "basement", 3.4, 0, 3.6, Math.PI);
      fallTo(old1, 1, 1);
      fallTo(old2, 1, -1);
      fallTo(old3, 1, 1);
      put(zhang, "basement", -3.2, 0, 6.6, Math.PI);
      w.pistol.visible = p < 0.72;
      zhang.setPose({ shoulderRX: lerp(-0.6, -0.05, smoothstep(0.2, 0.8, p)), elbowRX: 0.9, torsoX: 0.05 });
      zhang.lookAtWorld(at("basement", 0, 0.6, 3.6), 0.7);
      if (Math.floor(w.time * 3) !== Math.floor((w.time - w.dt) * 3)) {
        w.fx.smoke(at("basement", -3.2, 1.4, 5.8), 2, 0x8a9096, 0.4);
        w.fx.smoke(at("basement", 0, 0.4, 3.4), 1, 0x8a9096, 0.3);
      }
      if (p > 0.85) zhang.setPose({ neckY: 0.5, torsoY: 0.15 });
    }
  },

  /* ------------------------------------------------------------ act IV */
  {
    id: "d1",
    start: 198,
    end: 216,
    set: "lab",
    note: "法医 · 铁镍碎片 / the fragments",
    env: ENV.lab,
    pos: [
      [198, -4.6, 1.55, 2.8, easeInOutSine],
      [216, 3.4, 1.42, 2.1, easeInOutSine]
    ],
    look: [
      [198, -3.6, 1.0, 0.6],
      [216, 3.6, 1.0, 0.6]
    ],
    fov: [[198, 32], [216, 30]],
    handheld: 0.035,
    act(w, p) {
      hideAll(w);
      const { investigator } = w.cast;
      const x = lerp(-3.6, 3.4, smoothstep(0.05, 0.95, p));
      put(investigator, "lab", x, 0, -0.5, 0.15);
      investigator.setPose({ shoulderRX: -1.1, elbowRX: 1.05, neckX: 0.32, torsoX: 0.12 });
      investigator.lookAtWorld(at("lab", x, 0.98, 0.5), 0.9);
    }
  },
  {
    id: "d2",
    start: 216,
    end: 228,
    set: "lab",
    note: "报告 / the report",
    env: ENV.lab,
    pos: [
      [216, -3.15, 1.28, 1.35, easeInOutSine],
      [228, -3.55, 1.1, 0.95, easeInOutSine]
    ],
    look: [
      [216, -3.6, 0.99, 0.5],
      [228, -3.6, 0.99, 0.5]
    ],
    fov: [[216, 26], [228, 23]],
    handheld: 0.03,
    act(w) {
      hideAll(w);
      const { investigator } = w.cast;
      put(investigator, "lab", -3.6, 0, -1.0, 0.1);
      investigator.setPose({ shoulderRX: -1.2, elbowRX: 1.0, neckX: 0.4, torsoX: 0.16 });
      investigator.lookAtWorld(at("lab", -3.6, 0.99, 0.5), 1);
    }
  },
  {
    id: "d3",
    start: 228,
    end: 240,
    set: "review",
    note: "评审 · 通过 / approved",
    env: ENV.review,
    pos: [
      [228, 6.5, 1.8, 4.0, easeInOutSine],
      [240, -5.5, 1.7, 4.2, easeInOutSine]
    ],
    look: [
      [228, 0, 1.4, 0],
      [240, 0, 1.4, 0]
    ],
    fov: [[228, 34], [240, 34]],
    handheld: 0.04,
    act(w, p) {
      hideAll(w);
      const { chair, delegateA, delegateB, zhang } = w.cast;
      put(chair, "review", -1.4, -0.42, -1.15, 0.1);
      put(delegateA, "review", 1.4, -0.42, -1.15, -0.05);
      put(delegateB, "review", 3.6, -0.42, -1.15, 0.05);
      put(zhang, "review", 0.6, -0.42, 1.15, Math.PI);
      for (const a of [chair, delegateA, delegateB, zhang]) seated(a);
      chair.setPose({ shoulderRX: -0.7, elbowRX: 0.9, neckY: -0.1 });
      const raise = smoothstep(0.12, 0.4, p);
      delegateA.setPose({ shoulderRX: -1.2 * raise, elbowRX: 1.3 * raise });
      delegateB.setPose({ shoulderRX: -1.1 * raise, elbowRX: 1.2 * raise });
      handsFolded(zhang);
      zhang.lookAtWorld(at("review", -1.4, 1.4, -1.1), 0.5);
    }
  },
  {
    id: "d4",
    start: 240,
    end: 246,
    set: "corridor",
    note: "走廊 · 灯灭 / the lights go out",
    env: ENV.corridor,
    pos: [
      [240, 0, 1.62, 9, easeInOutSine],
      [246, 0, 1.6, 4.5, easeInOutSine]
    ],
    look: [
      [240, 0, 1.45, 1.0],
      [246, 0, 1.4, -6.0]
    ],
    fov: [[240, 36], [246, 36]],
    handheld: 0.05,
    act(w) {
      hideAll(w);
      const { zhang } = w.cast;
      put(zhang, "corridor", 0, 0, -1.0, Math.PI);
      zhang.startWalk(1);
      // lights die behind him, in sequence
      const zc = 9 - (w.time - 240) * 2.6;
      w.sets.corridor.root.traverse((o) => {
        const l = o as THREE.PointLight;
        if ((l as unknown as { isPointLight?: boolean }).isPointLight) {
          l.intensity = l.position.z < zc ? 0 : 2.2;
        }
      });
    }
  },

  /* ------------------------------------------------------------- act V */
  {
    id: "e1",
    start: 246,
    end: 262,
    set: "modelshop",
    note: "模型车间 · 夜 / the model shop at night",
    env: ENV.modelshop,
    pos: [
      [246, 0, 1.5, -1.6, easeInOutSine],
      [262, 0.35, 1.6, 1.1, easeInOutSine]
    ],
    look: [
      [246, 0, 1.5, 3.4],
      [262, 0, 1.55, 4.0]
    ],
    fov: [[246, 34], [262, 31]],
    handheld: 0.03,
    act(w) {
      hideAll(w);
      const { zhang } = w.cast;
      put(zhang, "modelshop", 0, 0, 2.6, 0);
      zhang.setPose({ shoulderLX: 0.05, shoulderRX: 0.05, torsoX: -0.02 });
      const df = w.sets.modelshop.root.getObjectByName("distantFlame");
      const plume = df?.children.find((c) => c instanceof THREE.Group && c.name !== "distantFlame") as
        | { setPower?: (p: number) => void }
        | undefined;
      if (plume?.setPower) plume.setPower(0);
    }
  },
  {
    id: "e2",
    start: 262,
    end: 276,
    set: "modelshop",
    note: "回忆 · 闪回 / memory",
    env: ENV.modelshop,
    pos: [
      [262, -0.95, 1.6, 1.55, easeInOutSine],
      [276, 0.75, 1.52, 1.95, easeInOutSine]
    ],
    look: [
      [262, 0, 1.62, 3.0],
      [276, 0, 1.6, 3.2]
    ],
    fov: [[262, 28], [276, 26]],
    handheld: 0.03,
    act(w) {
      hideAll(w);
      const { zhang, old1, old2, old3 } = w.cast;
      put(zhang, "modelshop", 0, 0, 2.6, 0);
      zhang.setPose({ shoulderLX: 0.05, shoulderRX: 0.05 });
      // the three old men, only for a few frames, like reflections
      const windows = [264.0, 266.6, 269.2, 271.8];
      let on = false;
      for (let i = 0; i < windows.length; i++) {
        const s = windows[i];
        if (w.time >= s && w.time < s + 0.24) {
          on = true;
          if (memFlash < i + 1) {
            memFlash = i + 1;
            w.fx.flash(at("modelshop", 0, 1.9, 4.4), 0xbfe0ff, 26, 7);
          }
        }
      }
      if (on) {
        put(old1, "modelshop", -1.2, 0, 3.7, Math.PI);
        put(old2, "modelshop", 0, 0, 3.7, Math.PI);
        put(old3, "modelshop", 1.2, 0, 3.7, Math.PI);
        old1.setPose({ shoulderRX: -0.5, elbowRX: 0.8, neckY: -0.1 });
        old2.setPose({ shoulderRX: -0.5, elbowRX: 0.8, neckY: 0.1 });
        old3.setPose({ neckY: 0 });
      }
      // the muzzle-flash memory
      if (w.time >= 273.4 && w.time < 273.7 && !muzzleMem) {
        muzzleMem = true;
        w.fx.flash(at("modelshop", 0, 1.5, 3.2), 0xffd9a0, 40, 8);
        w.fx.sparkBurst(at("modelshop", 0, 1.5, 3.2), 20, 0xffb457, 2.6);
      }
    }
  },
  {
    id: "e3",
    start: 276,
    end: 290,
    set: "modelshop",
    note: "窗前 / at the window",
    env: ENV.modelshop,
    pos: [
      [276, 1.4, 2.2, 1.0, easeInOutSine],
      [290, 4.6, 2.7, -1.0, easeInOutSine]
    ],
    look: [
      [276, 0, 1.6, 4.0],
      [290, 0, 1.8, 4.5]
    ],
    fov: [[276, 34], [290, 36]],
    handheld: 0.03,
    act(w, p) {
      hideAll(w);
      const { zhang } = w.cast;
      put(zhang, "modelshop", 0, 0, 2.6, 0);
      zhang.setPose({ shoulderLX: 0.05, shoulderRX: 0.05, neckX: 0.04 });
      const df = w.sets.modelshop.root.getObjectByName("distantFlame");
      const plume = df?.children.find((c) => c instanceof THREE.Group) as { setPower?: (p: number) => void } | undefined;
      if (plume?.setPower) plume.setPower(smoothstep(0.7, 1, p) * 0.22);
    }
  },
  {
    id: "e4",
    start: 290,
    end: 314,
    set: "teststand",
    note: "点火 / ignition",
    env: ENV.teststand,
    pos: [
      [290, 30, 7, 42, easeInOutSine],
      [300, 20, 5, 28, easeInOutSine],
      [306, 15, 4.5, 21, easeOutCubic],
      [314, 54, 34, 78, easeInOutSine]
    ],
    look: [
      [290, 0, 12, 0],
      [300, 0, 14, 0],
      [306, 0, 15, 0],
      [314, 0, 22, 0]
    ],
    fov: [[290, 38], [306, 42], [314, 44]],
    handheld: 0.02,
    act(w, p) {
      hideAll(w);
      const plume = w.plume();
      if (!plume) return;
      const t = w.time;
      // hold, then light
      if (t < 305.6) {
        plume.setPower(0);
      } else {
        const k = smoothstep(305.6, 309.0, t);
        plume.setPower(k);
        if (!ignitionLatched) {
          ignitionLatched = true;
          w.fx.flash(at("teststand", 0, 7, 0), 0xbfe6ff, 600, 2.2);
          w.fx.sparkBurst(at("teststand", 0, 6, 0), 120, 0x9fd0ff, 14);
          w.fx.smoke(at("teststand", 0, 3, 0), 40, 0xbfd0e0, 3.5);
          w.fx.debris(at("teststand", 0, 3, 0), 40, 0x8a9096, 5);
          w.rig.punch(2.6);
        }
        if (t > 309 && Math.floor(t * 6) !== Math.floor((t - w.dt) * 6)) {
          w.fx.sparkBurst(at("teststand", 0, 5, 0), 26, 0x8fc8ff, 9);
          w.fx.smoke(at("teststand", 0, 2, 0), 6, 0xc8d8e8, 2.2);
        }
        if (t > 309) w.rig.punch(0.35);
      }
      // ship shakes a little once lit
      const ship = w.sets.teststand.root.getObjectByName("ship");
      if (ship) ship.position.x = Math.sin(t * 60) * 0.02 * smoothstep(305.6, 308, t);
    }
  },
  {
    id: "e5",
    start: 314,
    end: 326,
    set: "modelshop",
    note: "回望 / looking back",
    env: ENV.modelshop,
    pos: [
      [314, -3.0, 1.2, 0.6, easeInOutSine],
      [326, -2.0, 1.55, -0.6, easeInOutSine]
    ],
    look: [
      [314, 0, 1.7, 4.5],
      [326, 0, 1.8, 4.5]
    ],
    fov: [[314, 36], [326, 38]],
    handheld: 0.025,
    act(w, p) {
      hideAll(w);
      const { zhang } = w.cast;
      put(zhang, "modelshop", 0, 0, 2.6, 0);
      zhang.setPose({ shoulderLX: 0.05, shoulderRX: 0.05, neckX: -0.04 });
      const df = w.sets.modelshop.root.getObjectByName("distantFlame");
      const plume = df?.children.find((c) => c instanceof THREE.Group) as { setPower?: (p: number) => void } | undefined;
      if (plume?.setPower) plume.setPower(0.6 + smoothstep(0, 1, p) * 0.5);
    }
  },

  /* ------------------------------------------------------------ credits */
  {
    id: "z1",
    start: 326,
    end: 344,
    set: "space",
    note: "片尾 / credits",
    env: ENV.space,
    pos: [
      [326, 2.4, 1.2, 8.0, easeInOutSine],
      [344, -1.4, 0.4, 3.6, easeInOutSine]
    ],
    look: [
      [326, 0, 0, 0],
      [344, 0, 0, 0]
    ],
    fov: [[326, 40], [344, 46]],
    handheld: 0.01
  }
];

/* module-level latches for one-shot effects */
const fired: boolean[] = [false, false, false];
let ignitionLatched = false;
let memFlash = 0;
let muzzleMem = false;

export function resetShotLatches(): void {
  fired[0] = fired[1] = fired[2] = false;
  ignitionLatched = false;
  memFlash = 0;
  muzzleMem = false;
}

/* build the runtime shots */
let envShot = "";
export const SHOTS: Shot[] = DEFS.map((d) => {
  const posKeys = wpath(d.set, d.pos);
  const lookKeys = wpath(d.set, d.look);
  const fovKeys: NumKey[] | undefined = d.fov?.map(([t, v, e]) => nk(t, v, e));
  return {
    id: d.id,
    start: d.start,
    end: d.end,
    set: d.set,
    note: d.note,
    update(w, p) {
      if (d.env && envShot !== d.id) {
        envShot = d.id;
        (w as unknown as FilmWorld).applyEnv(d.env, true);
      }
      sampleVec(posKeys, w.time, w.rig.pos);
      sampleVec(lookKeys, w.time, w.rig.target);
      if (fovKeys) w.rig.fov = sampleNum(fovKeys, w.time);
      w.rig.handheld = d.handheld ?? 0.03;
      d.act?.(w as unknown as FilmWorld, p);
    }
  };
});

export function resetEnvShot(): void {
  envShot = "";
}

export const FILM_DURATION = DEFS[DEFS.length - 1].end;

export interface TitleCard {
  start: number;
  end: number;
  main: string;
  sub: string;
}

export const CARDS: TitleCard[] = [
  { start: 2.6, end: 8.2, main: "北 海 · 陨 石", sub: "危机纪元第四年" },
  { start: 8.6, end: 13.4, main: "", sub: "三体舰队还有四百年到达\n但人类选择了太慢的飞船" },
  { start: 14.0, end: 19.4, main: "", sub: "太空军 · 推进方式评审" },
  { start: 327.0, end: 343.0, main: "北 海 · 陨 石", sub: "改编自《三体Ⅱ · 黑暗森林》\n程序化体素影像 · Three.js\n谨以此片纪念那些不被记住的夜晚" }
];

export function cardAt(t: number): TitleCard | undefined {
  return CARDS.find((c) => t >= c.start && t < c.end);
}
