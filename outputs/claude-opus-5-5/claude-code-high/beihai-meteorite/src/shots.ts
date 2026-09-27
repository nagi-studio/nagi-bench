import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import { BASE1_DIR, HATCH, HITS, PHOTOG, SpaceSet, TARGETS, slot, sunDir } from "./sets/space";
import { HutongSet } from "./sets/hutong";
import { RoomSet } from "./sets/room";
import { ShopSet, TRAY } from "./sets/shop";
import { BasementSet, CRATE, TABLE } from "./sets/basement";
import { camPath, clamp, easeInOut, lerp, seg, setCam, setClip, shake, smooth, type CamKey, type V3 } from "./util";

export type SetName = "space" | "hutong" | "room" | "shop" | "basement" | "black";

export interface Ctx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  space: SpaceSet;
  hutong: HutongSet;
  room: RoomSet;
  shop: ShopSet;
  basement: BasementSet;
  current: SetName | "";
  duskSky: THREE.Texture;
}

const LOOKS: Record<SetName, { bg: number | "dusk"; exposure: number; fog?: [number, number, number] }> = {
  space: { bg: 0x000000, exposure: 1.15 },
  hutong: { bg: "dusk", exposure: 1.05, fog: [0x2a3246, 12, 70] },
  room: { bg: 0x080604, exposure: 1.2 },
  shop: { bg: 0x030507, exposure: 1.35, fog: [0x06090e, 7, 24] },
  basement: { bg: 0x000000, exposure: 1.1 },
  black: { bg: 0x000000, exposure: 1 },
};

export function showSet(ctx: Ctx, name: SetName): void {
  if (ctx.current === name) return;
  ctx.current = name;
  ctx.space.group.visible = name === "space";
  ctx.hutong.group.visible = name === "hutong";
  ctx.room.group.visible = name === "room";
  ctx.shop.group.visible = name === "shop";
  ctx.basement.group.visible = name === "basement";
  const look = LOOKS[name];
  ctx.scene.background = look.bg === "dusk" ? ctx.duskSky : new THREE.Color(look.bg);
  ctx.scene.fog = look.fog ? new THREE.Fog(look.fog[0], look.fog[1], look.fog[2]) : null;
  ctx.renderer.toneMappingExposure = look.exposure;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

type Cam = (ctx: Ctx, t: number, local: number, p: number) => void;

function shot(id: string, start: number, end: number, set: SetName, cam: Cam): Shot<Ctx> {
  return {
    id,
    start,
    end,
    update: ({ context: ctx, time, localTime, progress }) => {
      showSet(ctx, set);
      if (set === "space") ctx.space.update(time, ctx.camera);
      else if (set === "hutong") ctx.hutong.update(time);
      else if (set === "room") ctx.room.update(time);
      else if (set === "shop") ctx.shop.update(time);
      else if (set === "basement") ctx.basement.update(time);
      cam(ctx, time, localTime, progress);
    },
  };
}

function path(keys: CamKey[], near = 0.02, far = 400): Cam {
  return (ctx, _t, local) => {
    setClip(ctx.camera, near, far);
    camPath(ctx.camera, keys, local);
  };
}

/** Relative framing around a moving point. */
function around(ctx: Ctx, target: THREE.Vector3, offset: V3, lookOffset: V3, fov: number, t: number, amp = 0.004, near = 0.01): void {
  const s = shake(t, amp, 3);
  setClip(ctx.camera, near, 300000);
  tmpA.set(target.x + offset[0] + s[0], target.y + offset[1] + s[1], target.z + offset[2] + s[2]);
  tmpB.set(target.x + lookOffset[0], target.y + lookOffset[1], target.z + lookOffset[2]);
  setCam(ctx.camera, tmpA, tmpB, fov);
}

/** Zhang's eye through the rifle scope: long lens with residual body sway. */
function scopePOV(ctx: Ctx, t: number, look: THREE.Vector3, fov: number, steady = 1): void {
  setClip(ctx.camera, 1, 300000);
  const eye = V(0, 1.62, 0);
  const sway = 0.00006 * steady;
  const d = look.clone().sub(eye);
  const dist = d.length();
  const off = V(Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.3) * 0.4, Math.sin(t * 0.7 + 1) * 0.6 + Math.sin(t * 1.9) * 0.4, 0).multiplyScalar(sway * dist);
  setCam(ctx.camera, eye, look.clone().add(off), fov);
}

function head(ctx: Ctx, which: "zhang" | number): THREE.Vector3 {
  const a = which === "zhang" ? ctx.space.zhang : ctx.space.people[which];
  return ctx.space.headOf(a, new THREE.Vector3());
}

export function buildShots(): Shot<Ctx>[] {
  const s: Shot<Ctx>[] = [];

  // ───────────────────────────── I. Waiting in the void (0–40)
  s.push(shot("s01-void", 0, 12, "space", (ctx, t, l) => {
    // Zhang's silhouette hangs just off the setting sun, against the limb glow.
    setClip(ctx.camera, 0.05, 300000);
    const k = easeInOut(l / 12);
    const sd = sunDir(t);
    const side = new THREE.Vector3().crossVectors(sd, V(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(side, sd).normalize();
    const D = lerp(34, 9, k);
    const pos = V(0, 0.9, 0).addScaledVector(sd, -D).addScaledVector(side, D * 0.07).addScaledVector(up, D * 0.035);
    const look = pos.clone().addScaledVector(sd, 100).addScaledVector(side, 5).addScaledVector(up, -1.5);
    setCam(ctx.camera, pos, look, 34);
  }));
  s.push(shot("s02-profile", 12, 26, "space", (ctx, t, l) => {
    const h = head(ctx, "zhang");
    const face = V(Math.sin(Math.PI * 0.72), 0, Math.cos(Math.PI * 0.72));
    const side = V(face.z, 0, -face.x);
    const k = l / 14;
    const off: V3 = [face.x * 1.5 + side.x * lerp(1.1, 0.8, k), lerp(0.05, -0.02, k), face.z * 1.5 + side.z * lerp(1.1, 0.8, k)];
    around(ctx, h, off, [0, -0.08, 0], lerp(28, 24, k), t, 0.003);
  }));
  s.push(shot("s03-establish", 26, 40, "space", (ctx, t, l) => {
    setClip(ctx.camera, 0.05, 300000);
    const k = easeInOut(l / 14);
    const pos = V(lerp(-3.8, -2.6, k), lerp(2.3, 1.7, k), lerp(9.5, 7.2, k));
    const look = V(lerp(420, 380, k), lerp(-640, -700, k), -5000);
    setCam(ctx.camera, pos, look, 44);
    void t;
  }));

  // ───────────────────────────── II. Hutong (40–50)
  s.push(shot("s04a-alley", 40, 45.2, "hutong", path([
    { t: 0, pos: [-0.75, 0.42, 1.4], look: [0.05, 1.5, -14], fov: 42 },
    { t: 5.2, pos: [-0.65, 0.5, 0.2], look: [0.05, 1.55, -14], fov: 40 },
  ], 0.05, 200)));
  s.push(shot("s04b-gate", 45.2, 50, "hutong", path([
    { t: 0, pos: [1.2, 1.35, -13.35], look: [-0.1, 1.5, -11.2], fov: 40 },
    { t: 4.8, pos: [1.05, 1.4, -13.45], look: [0.0, 1.55, -12.2], fov: 36 },
  ], 0.05, 200)));

  // ───────────────────────────── III. The collector (50–148)
  s.push(shot("s05a-room-wide", 50, 56, "room", path([
    { t: 0, pos: [-3.1, 2.45, 2.45], look: [1.4, 0.95, -1.0], fov: 52 },
    { t: 6, pos: [-2.9, 2.3, 2.2], look: [1.2, 0.95, -1.3], fov: 48 },
  ])));
  s.push(shot("s05b-cabinets", 56, 62, "room", (ctx, t, l) => {
    // Pan with Zhang as he drifts along the lit cabinets.
    setClip(ctx.camera, 0.02, 400);
    const k = easeInOut(l / 6);
    const z = ctx.room.zhang.root.position;
    const pos = V(lerp(3.0, 2.5, k), lerp(1.95, 1.8, k), lerp(2.4, 2.0, k));
    const look = V(z.x - lerp(0.9, 0.5, k), 1.15, z.z - lerp(1.2, 0.6, k));
    setCam(ctx.camera, pos, look, 44);
    void t;
  }));
  s.push(shot("s06a-tea-two", 62, 69.8, "room", path([
    { t: 0, pos: [-0.8, 1.12, 2.45], look: [-0.8, 0.98, 0.4], fov: 38 },
    { t: 7.8, pos: [-0.8, 1.1, 2.15], look: [-0.8, 0.98, 0.4], fov: 36 },
  ])));
  const zhangCU: CamKey[] = [
    { t: 0, pos: [-1.45, 1.4, 0.1], look: [0.2, 1.36, 0.42], fov: 22 },
    { t: 3, pos: [-1.4, 1.4, 0.12], look: [0.2, 1.36, 0.42], fov: 21 },
  ];
  const collectorMCU: CamKey[] = [
    { t: 0, pos: [-0.35, 1.36, 0.78], look: [-1.8, 1.3, 0.36], fov: 27 },
    { t: 7, pos: [-0.45, 1.36, 0.74], look: [-1.8, 1.3, 0.36], fov: 25 },
  ];
  s.push(shot("s06b-zhang", 69.8, 72.8, "room", path(zhangCU)));
  s.push(shot("s06c-collector", 72.8, 80, "room", path(collectorMCU)));
  s.push(shot("s07a-stone", 80, 86.3, "room", path([
    { t: 0, pos: [-0.5, 1.42, 1.55], look: [-1.5, 1.36, 0.45], fov: 34 },
    { t: 6.3, pos: [-0.62, 1.44, 1.38], look: [-1.52, 1.38, 0.45], fov: 30 },
  ])));
  s.push(shot("s07b-cup", 86.3, 96.8, "room", path([
    { t: 0, pos: [-1.0, 1.42, 1.45], look: [0.1, 1.22, 0.4], fov: 32 },
    { t: 10.5, pos: [-0.85, 1.42, 1.3], look: [0.1, 1.24, 0.4], fov: 29 },
  ])));
  s.push(shot("s07c-laugh", 96.8, 100, "room", path([
    { t: 0, pos: [-0.8, 1.35, 2.5], look: [-0.8, 0.9, 0.4], fov: 40 },
    { t: 3.2, pos: [-0.8, 1.3, 2.35], look: [-0.8, 0.9, 0.4], fov: 38 },
  ])));
  s.push(shot("s08a-collector", 100, 104, "room", path(collectorMCU)));
  s.push(shot("s08b-zhang", 104, 109.6, "room", path([
    { t: 0, pos: [-1.45, 1.4, 0.1], look: [0.2, 1.36, 0.42], fov: 22 },
    { t: 5.6, pos: [-1.35, 1.4, 0.14], look: [0.2, 1.36, 0.42], fov: 19 },
  ])));
  s.push(shot("s08c-high", 109.6, 115, "room", path([
    { t: 0, pos: [-0.8, 2.45, 1.85], look: [-0.8, 0.55, 0.3], fov: 38 },
    { t: 5.4, pos: [-0.7, 2.35, 1.7], look: [-0.8, 0.55, 0.3], fov: 36 },
  ])));
  s.push(shot("s08d-iron-macro", 115, 122, "room", path([
    { t: 0, pos: [-0.7, 0.78, 0.8], look: [-0.8, 0.47, 0.4], fov: 30 },
    { t: 7, pos: [-0.76, 0.68, 0.6], look: [-0.8, 0.49, 0.4], fov: 22 },
  ])));
  s.push(shot("s09a-top", 122, 126.2, "room", path([
    { t: 0, pos: [-0.8, 1.75, 0.43], look: [-0.8, 0.4, 0.39], fov: 42 },
    { t: 4.2, pos: [-0.8, 1.6, 0.43], look: [-0.8, 0.4, 0.39], fov: 40 },
  ])));
  s.push(shot("s09b-price", 126.2, 131.4, "room", path(collectorMCU)));
  s.push(shot("s09c-phone", 131.4, 134.6, "room", path([
    { t: 0, pos: [-1.2, 1.25, 0.2], look: [0.1, 1.15, 0.42], fov: 26 },
    { t: 3.2, pos: [-1.15, 1.25, 0.22], look: [0.1, 1.15, 0.42], fov: 24 },
  ])));
  s.push(shot("s09d-awkward", 134.6, 140.3, "room", path([
    { t: 0, pos: [-0.66, 1.38, 0.66], look: [-1.8, 1.32, 0.37], fov: 26 },
    { t: 5.7, pos: [-0.76, 1.37, 0.62], look: [-1.8, 1.32, 0.37], fov: 23 },
  ])));
  s.push(shot("s09e-firm", 140.3, 142.8, "room", path(zhangCU)));
  s.push(shot("s09f-respect", 142.8, 148, "room", path([
    { t: 0, pos: [-0.95, 1.05, 1.25], look: [0.15, 1.28, 0.42], fov: 32 },
    { t: 5.2, pos: [-0.62, 1.22, 0.88], look: [0.15, 1.34, 0.42], fov: 24 },
  ], 0.02, 400)));

  // ───────────────────────────── IV. The sun touches the Earth (148–162)
  s.push(shot("s10a-limb", 148, 155, "space", (ctx, t, l) => {
    const h = head(ctx, "zhang");
    const sd = sunDir(t);
    const k = l / 7;
    around(ctx, h, [0.52 - k * 0.04, 0.16, 1.0 - k * 0.1], [sd.x * 400 - 12, sd.y * 400 + 3, sd.z * 400], 18 - k * 2, t, 0.002);
  }));
  s.push(shot("s10b-face", 155, 162, "space", (ctx, t, l) => {
    const h = head(ctx, "zhang");
    const k = l / 7;
    around(ctx, h, [lerp(-0.62, -0.5, k), -0.04, lerp(-0.78, -0.68, k)], [0, -0.03, 0], 27, t, 0.003);
  }));

  // ───────────────────────────── V. The workshop (162–190)
  s.push(shot("s11a-shop", 162, 170, "shop", path([
    { t: 0, pos: [5.6, 1.75, 5.2], look: [0.5, 1.2, 0.3], fov: 40 },
    { t: 8, pos: [3.6, 1.6, 3.3], look: [0.3, 1.2, 0.2], fov: 38 },
  ], 0.02, 100)));
  s.push(shot("s11b-chuck", 170, 176, "shop", path([
    { t: 0, pos: [-0.3, 1.38, 0.3], look: [-0.52, 1.3, -0.02], fov: 34 },
    { t: 6, pos: [-0.36, 1.35, 0.24], look: [-0.54, 1.3, -0.03], fov: 28 },
  ], 0.01, 100)));
  s.push(shot("s11c-screen", 176, 177.8, "shop", path([
    { t: 0, pos: [1.5, 1.5, 1.05], look: [1.45, 1.44, 0.52], fov: 30 },
    { t: 1.8, pos: [1.48, 1.5, 0.98], look: [1.45, 1.45, 0.52], fov: 28 },
  ], 0.01, 100)));
  s.push(shot("s11d-parting", 177.8, 181, "shop", path([
    { t: 0, pos: [-0.33, 1.34, 0.2], look: [-0.5, 1.28, -0.02], fov: 28 },
    { t: 3.2, pos: [-0.36, 1.33, 0.18], look: [-0.5, 1.26, -0.02], fov: 26 },
  ], 0.01, 100)));
  s.push(shot("s11e-tray", 181, 186, "shop", path([
    { t: 0, pos: [TRAY.x + 0.01, 1.26, TRAY.z + 0.07], look: [TRAY.x, 0.93, TRAY.z], fov: 36 },
    { t: 5, pos: [TRAY.x + 0.01, 1.2, TRAY.z + 0.05], look: [TRAY.x, 0.93, TRAY.z], fov: 33 },
  ], 0.01, 100)));
  s.push(shot("s11f-cutter", 186, 190, "shop", (ctx, t, l) => {
    setClip(ctx.camera, 0.02, 100);
    const z = ctx.shop.zhang.root.position;
    const k = l / 4;
    setCam(ctx.camera, V(lerp(2.4, 2.9, k), 1.6, lerp(3.2, 3.5, k)), V(lerp(0.9, z.x, 0.75), 1.15, lerp(0.6, z.z, 0.75)), 46);
    void t;
  }));

  // ───────────────────────────── VI. The basement (190–232)
  s.push(shot("s12a-rounds", 190, 200, "basement", path([
    { t: 0, pos: [TABLE.x - 0.02, 1.22, TABLE.z - 0.42], look: [TABLE.x - 0.06, 0.77, TABLE.z + 0.02], fov: 38 },
    { t: 10, pos: [TABLE.x - 0.06, 1.12, TABLE.z - 0.36], look: [TABLE.x - 0.1, 0.77, TABLE.z + 0.02], fov: 34 },
  ], 0.01, 50)));
  s.push(shot("s12b-load", 200, 206, "basement", path([
    { t: 0, pos: [0.8, 1.4, -0.05], look: [-0.05, 1.3, 0.85], fov: 40 },
    { t: 6, pos: [0.7, 1.38, 0.05], look: [-0.05, 1.28, 0.85], fov: 36 },
  ], 0.01, 50)));
  s.push(shot("s12c-fire", 206, 213, "basement", (ctx, t, l) => {
    setClip(ctx.camera, 0.02, 50);
    let jolt = 0;
    for (const st of [207.2, 208.5, 209.25, 210.7]) if (t >= st) jolt += Math.exp(-(t - st) * 9) * 0.02;
    const k = l / 7;
    setCam(ctx.camera, V(1.75 + jolt, 0.6 + jolt * 0.5, lerp(-1.25, -1.1, k)), V(-0.2, 1.2, 0.25), 52);
  }));
  s.push(shot("s12d-holes", 213, 219, "basement", path([
    { t: 0, pos: [CRATE.x + 0.06, 0.68, CRATE.z + 0.9], look: [CRATE.x + 0.01, 0.59, CRATE.z + 0.28], fov: 30 },
    { t: 6, pos: [CRATE.x + 0.04, 0.64, CRATE.z + 0.66], look: [CRATE.x + 0.01, 0.59, CRATE.z + 0.28], fov: 26 },
  ], 0.01, 50)));
  s.push(shot("s12e-layers", 219, 226, "basement", path([
    { t: 0, pos: [CRATE.x - 0.38, 1.28, CRATE.z + 0.5], look: [CRATE.x - 0.05, 0.56, CRATE.z - 0.05], fov: 40 },
    { t: 7, pos: [CRATE.x - 0.3, 1.18, CRATE.z + 0.42], look: [CRATE.x - 0.04, 0.57, CRATE.z - 0.03], fov: 36 },
  ], 0.01, 50)));
  s.push(shot("s12f-palm", 226, 232, "basement", (ctx, t, l) => {
    ctx.basement.zhang.root.updateMatrixWorld(true);
    const p = ctx.basement.palmAnchor.getWorldPosition(new THREE.Vector3());
    const k = smooth(l / 6);
    around(ctx, p, [lerp(0.2, 0.12, k), lerp(0.34, 0.24, k), lerp(0.22, 0.16, k)], [0, 0, 0], lerp(30, 24, k), t, 0.002, 0.005);
  }));

  // ───────────────────────────── VII. The shot (232–336)
  s.push(shot("s13a-ring", 232, 238, "space", (ctx, t, l) => {
    const h = head(ctx, "zhang");
    const sd = sunDir(t);
    const k = l / 6;
    around(ctx, h, [0.95 - k * 0.1, 0.1, 2.5 - k * 0.2], [sd.x * 300 + 4, sd.y * 300 + 6, sd.z * 300], 20, t, 0.002);
  }));
  s.push(shot("s13b-hatch-pov", 238, 246, "space", (ctx, t) => {
    const look = HATCH.clone().add(V(0, 0.1, 0)).lerp(V(0, -800.3, -4968), smooth(seg(t, 243, 246)));
    scopePOV(ctx, t, look, lerp(0.15, 0.17, seg(t, 243, 246)));
  }));
  s.push(shot("s14a-lineup-pov", 246, 254, "space", (ctx, t) => {
    scopePOV(ctx, t, V(0, -800.25, -4962), lerp(0.17, 0.12, smooth(seg(t, 246, 252))));
  }));
  s.push(shot("s14b-visors-pov", 254, 260, "space", (ctx, t) => {
    scopePOV(ctx, t, V(0, -800.6, -4961.5), lerp(0.08, 0.055, smooth(seg(t, 254, 259))));
  }));
  s.push(shot("s14c-targets-pov", 260, 266, "space", (ctx, t) => {
    const p = slot(TARGETS[1]).add(V(0, 0.55, 0));
    scopePOV(ctx, t, p, lerp(0.034, 0.028, seg(t, 260, 266)));
  }));
  s.push(shot("s15a-glove", 266, 272, "space", (ctx, t, l) => {
    ctx.space.zhang.root.updateMatrixWorld(true);
    const hand = ctx.space.zhang.fig.anchors.handR.getWorldPosition(new THREE.Vector3());
    const k = smooth(l / 6);
    around(ctx, hand, [lerp(-1.25, -1.1, k), lerp(0.42, 0.36, k), lerp(-1.05, -0.92, k)], [0.1, 0.16, 0], 30, t, 0.002);
  }));
  s.push(shot("s15b-sunhand", 272, 278, "space", (ctx, t, l) => {
    setClip(ctx.camera, 0.01, 300000);
    const k = l / 6;
    setCam(ctx.camera, V(lerp(-1.5, -1.3, k), 1.5, lerp(-2.0, -1.8, k)), V(0, 1.15, 0), 34);
    void t;
  }));
  s.push(shot("s15c-magnet", 278, 284, "space", (ctx, t, l) => {
    ctx.space.zhang.root.updateMatrixWorld(true);
    const hand = ctx.space.zhang.fig.anchors.handR.getWorldPosition(new THREE.Vector3());
    const k = smooth(l / 6);
    around(ctx, hand, [lerp(-1.0, -0.85, k), lerp(0.36, 0.3, k), lerp(-0.85, -0.72, k)], [0.05, 0.12, -0.1], 30, t, 0.0015);
  }));
  s.push(shot("s16a-crosshair", 284, 288.2, "space", (ctx, t) => {
    const p = slot(TARGETS[0]).add(V(0, 0.55, 0));
    scopePOV(ctx, t, p, 0.022, lerp(2.2, 0.15, smooth(seg(t, 284, 287.6))));
  }));
  s.push(shot("s16b-gun", 288.2, 292.1, "space", (ctx, t) => {
    ctx.space.zhang.root.updateMatrixWorld(true);
    const hand = ctx.space.zhang.fig.anchors.handR.getWorldPosition(new THREE.Vector3());
    // Profile of the pistol: every flash reads against the dark, no sound but the suit.
    around(ctx, hand, [0.62, 0.08, -0.22], [-0.05, 0.02, -0.3], 30, t, 0.002);
  }));
  s.push(shot("s16c-firefly", 292.1, 295.3, "space", (ctx, t, l) => {
    // From behind the unsuspecting group: a firefly blinking five kilometres away.
    setClip(ctx.camera, 0.05, 300000);
    const k = l / 3.2;
    const cam = V(lerp(3.2, 2.8, k), -796.8, lerp(-4973, -4972.4, k));
    const dir = V(0, 1.2, 0).sub(cam).normalize();
    dir.y -= 0.1;
    setCam(ctx.camera, cam, cam.clone().addScaledVector(dir.normalize(), 100), 38);
    void t;
  }));
  s.push(shot("s16d-face", 295.3, 298, "space", (ctx, t) => {
    const h = head(ctx, "zhang");
    around(ctx, h, [-0.52, 0.0, -0.95], [0, -0.04, 0], 28, t, 0.002);
  }));
  s.push(shot("s17a-bullet", 298, 302, "space", (ctx, t) => {
    const b = ctx.space.bulletAt(t, new THREE.Vector3());
    const tgt = slot(TARGETS[0]).add(V(0, 0.6, 0));
    const d = tgt.clone().sub(b).normalize();
    ctx.space.bullet.position.copy(b);
    ctx.space.bullet.quaternion.setFromUnitVectors(V(0, 1, 0), d);
    ctx.space.bullet.rotateY(t * 30);
    ctx.space.bullet.visible = true;
    const sideL = V(d.z, 0, -d.x).normalize();
    ctx.space.bulletLight.position.copy(b).addScaledVector(sideL, 0.03).add(V(0, 0.03, 0)).addScaledVector(d, -0.02);
    ctx.space.bulletLight.intensity = 2.2 + Math.sin(t * 30) * 0.8;
    setClip(ctx.camera, 0.002, 300000);
    const side = V(d.z, 0, -d.x).normalize();
    const cam = b.clone().addScaledVector(side, 0.05).add(V(0, 0.012, 0)).addScaledVector(d, -0.022);
    setCam(ctx.camera, cam, b.clone().addScaledVector(d, 0.012), 36);
  }));
  s.push(shot("s17b-wait-pov", 302, 305, "space", (ctx, t) => {
    ctx.space.bullet.visible = false;
    scopePOV(ctx, t, V(0, -800.6, -4961.6), 0.05, 0.3);
  }));
  s.push(shot("s17c-smile", 305, 308, "space", (ctx, t, l) => {
    setClip(ctx.camera, 0.02, 300000);
    const k = l / 3;
    const tgt = slot(TARGETS[1]).add(V(0, 1.35, 0));
    const cam = PHOTOG.clone().add(V(lerp(-2.2, -2.0, k), 2.0, lerp(-3.2, -3.6, k)));
    setCam(ctx.camera, cam, tgt, 30);
    void t;
  }));
  s.push(shot("s18a-impact-pov", 308, 313, "space", (ctx, t) => {
    scopePOV(ctx, t, V(0, -800.4, -4961.5), lerp(0.05, 0.07, seg(t, 308, 313)), 0.3);
  }));
  s.push(shot("s18b-chaos", 313, 318, "space", (ctx, t, l) => {
    setClip(ctx.camera, 0.02, 300000);
    const k = l / 5;
    setCam(ctx.camera, V(lerp(7.5, 6.5, k), -799.2, lerp(-4957, -4959, k)), V(-0.5, -800.6, -4968), 40);
    void t;
  }));
  s.push(shot("s18c-pullback-pov", 318, 324, "space", (ctx, t) => {
    const k = easeInOut(seg(t, 318.5, 323.6));
    const fov = Math.exp(lerp(Math.log(0.12), Math.log(5.5), k));
    scopePOV(ctx, t, V(0, lerp(-800, -790, k), lerp(-4990, -5100, k)), fov, 0.3);
  }));
  s.push(shot("s19a-turn", 324, 328.2, "space", (ctx, t, l) => {
    setClip(ctx.camera, 0.01, 300000);
    const k = l / 4.2;
    setCam(ctx.camera, V(lerp(-0.95, -1.1, k), 1.62, lerp(-1.25, -1.45, k)), V(0, 1.45, 0), 32);
    void t;
  }));
  s.push(shot("s19b-home", 328.2, 336, "space", (ctx, t) => {
    setClip(ctx.camera, 0.05, 300000);
    const burn = (tt: number) => Math.max(0, tt - 327.5);
    const p = (tt: number) => BASE1_DIR.clone().multiplyScalar(0.5 * 7 * burn(tt) * burn(tt));
    const side = new THREE.Vector3().crossVectors(BASE1_DIR, V(0, 1, 0)).normalize();
    const hold = Math.min(t, 331.8);
    const cam = p(hold).addScaledVector(BASE1_DIR, 9).addScaledVector(side, 2.6).add(V(0, 1.4, 0));
    const him = p(t).add(V(0, 1.0, 0));
    const away = cam.clone().addScaledVector(BASE1_DIR, -100).add(V(0, -8, 0));
    const look = him.lerp(away, smooth(seg(t, 332.2, 333.6)));
    setCam(ctx.camera, cam, look, 40);
  }));

  // ───────────────────────────── VIII. Coda (336–350)
  s.push(shot("s20a-radio", 336, 343, "room", path([
    { t: 0, pos: [3.35, 1.02, 0.35], look: [2.2, 0.98, -1.7], fov: 44 },
    { t: 7, pos: [3.3, 1.05, 0.2], look: [2.15, 1.0, -1.8], fov: 40 },
  ])));
  s.push(shot("s20b-empty-shelf", 343, 347.5, "room", path([
    { t: 0, pos: [1.0, 1.25, -0.55], look: [0.3, 1.1, -2.5], fov: 40 },
    { t: 4.5, pos: [0.42, 1.14, -1.55], look: [0.3, 1.1, -2.5], fov: 32 },
  ])));
  s.push(shot("s20c-murmur", 347.5, 350, "room", (ctx, t, l) => {
    setClip(ctx.camera, 0.02, 400);
    ctx.room.collector.root.updateMatrixWorld(true);
    const h = ctx.room.collector.fig.anchors.head.getWorldPosition(new THREE.Vector3()).add(V(0, -0.22, 0));
    const k = l / 2.5;
    setCam(ctx.camera, V(h.x + 0.72, h.y + 0.04, h.z + lerp(1.25, 1.12, k)), h, 28);
    void t;
  }));
  s.push({
    id: "s21-end",
    start: 350,
    end: 358,
    update: ({ context: ctx }) => showSet(ctx, "black"),
  });
  void clamp; void HITS;
  return s;
}
