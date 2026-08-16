import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import type { FilmWorld } from "./world";
import { updateWorld } from "./animate";
import { CamRig } from "./util";
import { FIRES, HITS } from "./sfx";

type Frame = {
  context: FilmWorld;
  time: number;
  localTime: number;
  progress: number;
  [k: string]: unknown;
};

const _look = new THREE.Vector3();

function rig(world: FilmWorld, camera: THREE.PerspectiveCamera, r: CamRig, t: number, wobbleSeed = 0): void {
  r.apply(camera, t, wobbleSeed);
}

/** camera kick for the basement gunshot */
function gunKick(t: number): number {
  if (t < 224.3) return 0;
  return Math.exp(-(t - 224.3) / 0.13);
}

/** camera kick for impacts (c10) */
function impactKick(t: number): number {
  let k = 0;
  for (const h of HITS) {
    if (t >= h.t) k = Math.max(k, Math.exp(-(t - h.t) / 0.2));
  }
  return k;
}

/** deterministic jitter direction */
function jitter(seed: number, t: number): [number, number, number] {
  return [
    Math.sin(t * 23.7 + seed * 7.1) + Math.sin(t * 11.3 + seed),
    Math.sin(t * 19.1 + seed * 3.3) + Math.sin(t * 13.7 + seed * 2),
    Math.sin(t * 17.3 + seed * 5.7) + Math.sin(t * 9.1 + seed * 4),
  ];
}

interface ShotSpec {
  id: string;
  start: number;
  end: number;
  rig?: CamRig;
  shake?: (t: number) => number;
  shakeAmp?: number;
  shakeSeed?: number;
  show?: Array<"courtyard" | "room" | "office" | "workshop" | "basement" | "space" | "cabin" | "bay">;
  lookAt?: (world: FilmWorld, t: number, out: THREE.Vector3) => void;
}

const SET_KEYS = ["courtyard", "room", "office", "workshop", "basement", "space", "cabin", "bay"] as const;
type SetKey = (typeof SET_KEYS)[number];

function setGroup(world: FilmWorld, key: SetKey): THREE.Group {
  const s = world.sets[key];
  return "group" in (s as object) ? (s as { group: THREE.Group }).group : (s as THREE.Group);
}

function makeShot(world: FilmWorld, spec: ShotSpec): Shot<FilmWorld> {
  const camera = world.camera;
  return {
    id: spec.id,
    start: spec.start,
    end: spec.end,
    enter: () => {
      if (spec.show) {
        for (const key of SET_KEYS) {
          setGroup(world, key).visible = spec.show.includes(key);
        }
      }
    },
    update: (frame) => {
      const t = frame.time;
      if (spec.rig) rig(world, camera, spec.rig, frame.localTime, spec.id.length);
      if (spec.lookAt) {
        spec.lookAt(world, t, _look);
        camera.lookAt(_look);
      }
      let kick = 0;
      if (spec.shake) kick = spec.shake(t);
      const amp = (spec.shakeAmp ?? 0.06) * kick;
      if (amp > 0.0001) {
        const [jx, jy, jz] = jitter(spec.shakeSeed ?? 1, t);
        camera.position.x += jx * amp;
        camera.position.y += jy * amp;
        camera.position.z += jz * amp;
      }
    },
  };
}

export function buildShots(world: FilmWorld): Shot<FilmWorld>[] {
  const shots: Shot<FilmWorld>[] = [];

  /* master: all world animation, chrome, fx — runs for the whole film */
  shots.push({
    id: "master",
    start: 0,
    end: 348,
    update: (frame) => updateWorld(world, frame.time),
  });

  const S = (spec: ShotSpec) => shots.push(makeShot(world, spec));

  /* ================= prologue: the void ================= */

  S({
    id: "p1-void-wide",
    start: 0, end: 12,
    rig: new CamRig([
      { t: 0, pos: [-430, -70, 1080], look: [0, -2600, -8600], fov: 38 },
      { t: 12, pos: [-380, -55, 960], look: [0, -2650, -8800], fov: 37 },
    ], 0.4),
    show: ["space"],
  });

  S({
    id: "p2-figure",
    start: 12, end: 26,
    rig: new CamRig([
      { t: 12, pos: [15, 50, 86], look: [1, 39, 57], fov: 38 },
      { t: 26, pos: [9, 44, 74], look: [0, 40, 56], fov: 34 },
    ], 0.12),
    show: ["space"],
  });

  S({
    id: "p3-exit",
    start: 26, end: 30.5,
    rig: new CamRig([
      { t: 26, pos: [7, 41, 69], look: [0, 41, 56], fov: 30 },
      { t: 30.5, pos: [5, 39, 64], look: [0, 41, 56], fov: 28 },
    ], 0.1),
    show: ["space"],
  });

  /* ================= act I: the stone ================= */

  S({
    id: "a1-courtyard",
    start: 30, end: 38.5,
    rig: new CamRig([
      { t: 30, pos: [0, 1.5, -3.75], look: [0, 1.15, -1.6], fov: 37 },
      { t: 34, pos: [0, 1.48, -3.35], look: [0, 1.2, 0.8], fov: 37 },
      { t: 38.5, pos: [0, 1.45, -3.1], look: [0, 1.25, 3.2], fov: 37 },
    ], 0.04),
    show: ["courtyard"],
  });

  S({
    id: "a2-enter",
    start: 38.5, end: 46,
    rig: new CamRig([
      { t: 38.5, pos: [-3.2, 1.4, 4.7], look: [0.9, 1.2, 0.6], fov: 34 },
      { t: 46, pos: [-2.9, 1.42, 4.4], look: [0.4, 1.2, 1.5], fov: 32 },
    ], 0.04),
    show: ["room"],
  });

  S({
    id: "a3-greeting",
    start: 46, end: 56,
    rig: new CamRig([
      { t: 46, pos: [0.7, 1.5, 4.4], look: [0.3, 1.25, 1.7], fov: 30 },
      { t: 56, pos: [0.55, 1.48, 4.15], look: [0.25, 1.2, 1.6], fov: 29 },
    ], 0.05),
    show: ["room"],
  });

  S({
    id: "a4-tea",
    start: 56, end: 72.5,
    rig: new CamRig([
      { t: 56, pos: [2.5, 1.5, 4.0], look: [-0.6, 1.2, 1.6], fov: 28 },
      { t: 72.5, pos: [2.25, 1.5, 3.7], look: [-0.65, 1.2, 1.55], fov: 27 },
    ], 0.04),
    show: ["room"],
  });

  S({
    id: "a5-zhang-face",
    start: 72.5, end: 80.5,
    rig: new CamRig([
      { t: 72.5, pos: [0.1, 1.55, 3.75], look: [-0.72, 1.5, 1.98], fov: 24 },
      { t: 80.5, pos: [0.25, 1.5, 3.3], look: [-0.75, 1.5, 1.95], fov: 22 },
    ], 0.04),
    show: ["room"],
  });

  S({
    id: "a5b-cabinet",
    start: 80.5, end: 85,
    rig: new CamRig([
      { t: 80.5, pos: [-1.1, 1.4, -1.9], look: [-2.3, 1.25, -4.2], fov: 30 },
      { t: 85, pos: [-1.2, 1.35, -1.7], look: [-2.3, 1.2, -4.2], fov: 29 },
    ], 0.03),
    show: ["room"],
  });

  S({
    id: "a6-at-cabinet",
    start: 84.5, end: 108.5,
    rig: new CamRig([
      { t: 84.5, pos: [-0.7, 1.55, -1.2], look: [-0.9, 1.3, -3.1], fov: 28 },
      { t: 100, pos: [-0.75, 1.5, -1.0], look: [-1.4, 1.3, -3.4], fov: 27 },
      { t: 108.5, pos: [-1.0, 1.5, -0.8], look: [-1.7, 1.4, -3.55], fov: 26 },
    ], 0.05),
    show: ["room"],
  });

  S({
    id: "a8-rocks",
    start: 108.5, end: 118.5,
    rig: new CamRig([
      { t: 108.5, pos: [0.7, 1.65, 4.1], look: [-1.0, 0.95, 1.9], fov: 30 },
      { t: 118.5, pos: [0.55, 1.6, 3.85], look: [-1.0, 0.95, 1.9], fov: 28 },
    ], 0.04),
    show: ["room"],
  });

  S({
    id: "a9-rock-macro",
    start: 118.5, end: 125,
    rig: new CamRig([
      { t: 118.5, pos: [-1.0, 1.12, 2.95], look: [-1.0, 0.78, 1.9], fov: 22 },
      { t: 125, pos: [-1.0, 1.12, 2.8], look: [-1.0, 0.78, 1.9], fov: 21 },
    ], 0.03),
    show: ["room"],
  });

  S({
    id: "a10-price",
    start: 125, end: 137,
    rig: new CamRig([
      { t: 125, pos: [-0.55, 1.5, 4.3], look: [-0.4, 1.25, 1.85], fov: 28 },
      { t: 132.5, pos: [-0.65, 1.5, 4.05], look: [-0.55, 1.25, 1.8], fov: 27 },
      { t: 137, pos: [-0.75, 1.5, 3.9], look: [-0.7, 1.3, 1.7], fov: 26 },
    ], 0.04),
    show: ["room"],
  });

  S({
    id: "a11-wrap",
    start: 137, end: 142.5,
    rig: new CamRig([
      { t: 137, pos: [-1.0, 2.35, 2.9], look: [-1.0, 0.55, 1.9], fov: 26 },
      { t: 142.5, pos: [-1.0, 2.2, 2.7], look: [-1.0, 0.55, 1.9], fov: 24 },
    ], 0.03),
    show: ["room"],
  });

  S({
    id: "a12-office",
    start: 142, end: 152.5,
    rig: new CamRig([
      { t: 142, pos: [-1.65, 1.5, 1.75], look: [-0.05, 1.25, -2.1], fov: 30 },
      { t: 152.5, pos: [-1.35, 1.5, 1.5], look: [-0.02, 1.28, -2.12], fov: 28 },
    ], 0.04),
    show: ["office"],
  });

  /* ================= act II: the bullet ================= */

  S({
    id: "b1-workshop-wide",
    start: 152.5, end: 163,
    rig: new CamRig([
      { t: 152.5, pos: [-0.6, 1.5, -5.7], look: [0.4, 1.1, 0.6], fov: 34 },
      { t: 163, pos: [-0.2, 1.5, -5.2], look: [0.4, 1.1, 0.6], fov: 33 },
    ], 0.06),
    show: ["workshop"],
  });

  S({
    id: "b2-approach",
    start: 163, end: 168,
    rig: new CamRig([
      { t: 163, pos: [1.75, 1.55, 2.75], look: [0.45, 1.1, 0.7], fov: 26 },
      { t: 168, pos: [1.5, 1.5, 2.4], look: [0.4, 1.1, 0.6], fov: 25 },
    ], 0.05),
    show: ["workshop"],
  });

  S({
    id: "b3-chuck",
    start: 168, end: 176,
    rig: new CamRig([
      { t: 168, pos: [0.05, 1.15, 1.4], look: [-0.72, 1.18, 0], fov: 24 },
      { t: 176, pos: [0.1, 1.15, 1.25], look: [-0.6, 1.18, 0], fov: 23 },
    ], 0.015),
    show: ["workshop"],
  });

  S({
    id: "b4-cut-a",
    start: 176, end: 183,
    rig: new CamRig([
      { t: 176, pos: [0.32, 1.25, 0.4], look: [0.42, 1.16, -0.02], fov: 26 },
      { t: 183, pos: [0.36, 1.22, 0.34], look: [0.5, 1.15, -0.02], fov: 25 },
    ], 0.02),
    show: ["workshop"],
  });

  S({
    id: "b4-cut-b",
    start: 183, end: 190,
    rig: new CamRig([
      { t: 183, pos: [-0.45, 1.1, 1.25], look: [0.3, 1.18, -0.1], fov: 24 },
      { t: 190, pos: [-0.3, 1.08, 1.1], look: [0.35, 1.18, -0.05], fov: 23 },
    ], 0.02),
    show: ["workshop"],
  });

  S({
    id: "b5-tray",
    start: 190, end: 196.5,
    rig: new CamRig([
      { t: 190, pos: [-3.3, 1.5, 2.75], look: [-3.3, 1.0, 1.4], fov: 24 },
      { t: 196.5, pos: [-3.3, 1.4, 2.4], look: [-3.3, 1.0, 1.4], fov: 22 },
    ], 0.02),
    show: ["workshop"],
  });

  S({
    id: "b6-basement-enter",
    start: 198.5, end: 204.5,
    rig: new CamRig([
      { t: 198.5, pos: [0, 1.68, -2.9], look: [0, 1.1, -3.8], fov: 38 },
      { t: 204.5, pos: [0, 1.52, -0.5], look: [0, 0.9, 0.7], fov: 36 },
    ], 0.025),
    show: ["basement"],
  });

  S({
    id: "b7-table-work",
    start: 204.5, end: 218,
    rig: new CamRig([
      { t: 204.5, pos: [-0.35, 1.4, 2.75], look: [0.35, 0.9, 1.05], fov: 30 },
      { t: 218, pos: [-0.25, 1.38, 2.55], look: [0.32, 0.9, 1.05], fov: 29 },
    ], 0.03),
    show: ["basement"],
  });

  S({
    id: "b8-load",
    start: 218, end: 223.5,
    rig: new CamRig([
      { t: 218, pos: [0.3, 1.1, 0.5], look: [0.62, 0.84, 1.15], fov: 19 },
      { t: 223.5, pos: [0.25, 1.06, 0.38], look: [0.6, 0.86, 1.16], fov: 18 },
    ], 0.03),
    show: ["basement"],
  });

  S({
    id: "b9-the-shot",
    start: 223.5, end: 226.5,
    rig: new CamRig([
      { t: 223.5, pos: [1.15, 1.32, 1.62], look: [-1.15, 0.92, 2.62], fov: 26 },
      { t: 226.5, pos: [1.06, 1.3, 1.5], look: [-1.25, 0.92, 2.66], fov: 25 },
    ], 0.02),
    shake: gunKick,
    shakeAmp: 0.085,
    shakeSeed: 2,
    show: ["basement"],
  });

  S({
    id: "b10-aftermath",
    start: 226.5, end: 233.5,
    rig: new CamRig([
      { t: 226.5, pos: [-1.25, 1.18, 3.4], look: [-1.7, 0.8, 2.6], fov: 25 },
      { t: 229, pos: [-1.1, 1.14, 3.1], look: [-1.7, 0.8, 2.6], fov: 24 },
      { t: 229.2, pos: [-0.2, 1.15, 2.35], look: [0.45, 1.0, 1.75], fov: 20 },
      { t: 233.5, pos: [-0.1, 1.12, 2.2], look: [0.5, 1.0, 1.72], fov: 19 },
    ], 0.03),
    show: ["basement"],
  });

  /* ================= act III: the void ================= */

  S({
    id: "c0-void-wide",
    start: 233.5, end: 244.5,
    rig: new CamRig([
      { t: 233.5, pos: [330, 205, 1220], look: [0, 10, 60], fov: 40 },
      { t: 244.5, pos: [215, 130, 780], look: [0, 30, 60], fov: 38 },
    ], 0.4),
    show: ["space"],
  });

  S({
    id: "c1-cabin",
    start: 244.5, end: 248.5,
    rig: new CamRig([
      { t: 244.5, pos: [-0.28, 1.25, 2.05], look: [0.4, 1.05, 0.7], fov: 30 },
      { t: 248.5, pos: [-0.2, 1.25, 1.9], look: [0.4, 1.05, 0.7], fov: 29 },
    ], 0.02),
    show: ["cabin"],
  });

  S({
    id: "c2-zhang-mid",
    start: 248.5, end: 262,
    rig: new CamRig([
      { t: 248.5, pos: [30, 36, 160], look: [0, 14, -8], fov: 30 },
      { t: 262, pos: [22, 32, 130], look: [0, 16, -4], fov: 28 },
    ], 0.09),
    show: ["space"],
  });

  S({
    id: "c3-station-tele",
    start: 262, end: 271.8,
    rig: new CamRig([
      { t: 262, pos: [18, 8, 102], look: [0, -1590, -5190], fov: 7 },
      { t: 271.8, pos: [14, 7, 90], look: [0, -1600, -5192], fov: 7 },
    ], 0.03),
    show: ["space"],
  });

  S({
    id: "c4-group-emerge",
    start: 271.8, end: 278.5,
    rig: new CamRig([
      { t: 271.8, pos: [640, -1560, -4680], look: [0, -1890, -5250], fov: 26 },
      { t: 278.5, pos: [560, -1590, -4720], look: [0, -1900, -5260], fov: 24 },
    ], 0.12),
    show: ["space"],
  });

  S({
    id: "c5-group-faces",
    start: 278.5, end: 286.5,
    rig: new CamRig([
      { t: 278.5, pos: [0, 46, 88], look: [0, -1913, -5267], fov: 6.2 },
      { t: 286.5, pos: [0, 46, 86], look: [0, -1913, -5267], fov: 6.2 },
    ], 0.02),
    show: ["space"],
  });

  S({
    id: "c6-scope-mount",
    start: 286.5, end: 289.5,
    rig: new CamRig([
      { t: 286.5, pos: [0, 45, 79], look: [0, 42.5, 64.5], fov: 13 },
      { t: 289.5, pos: [0, 45, 78], look: [0, 42.5, 64.5], fov: 13 },
    ], 0.02),
    show: ["space"],
  });

  S({
    id: "c7a-aim-tele",
    start: 289.5, end: 292.5,
    rig: new CamRig([{ t: 289.5, pos: [0, 46, 88], look: [0, -1913, -5267], fov: 6.2 }], 0.02),
    show: ["space"],
  });

  S({
    id: "c7b-prep-profile",
    start: 292.5, end: 296.5,
    rig: new CamRig([
      { t: 292.5, pos: [27, 51, 138], look: [0, 44, 58], fov: 18 },
      { t: 296.5, pos: [23, 49, 122], look: [0, 44, 58], fov: 17 },
    ], 0.03),
    show: ["space"],
  });

  S({
    id: "c8a-raise",
    start: 296.5, end: 298.2,
    rig: new CamRig([{ t: 296.5, pos: [24, 49, 122], look: [0, 43, 58], fov: 17 }], 0.03),
    show: ["space"],
  });

  S({
    id: "c8b-burst1",
    start: 298.2, end: 300.6,
    rig: new CamRig([{ t: 298.2, pos: [0, 46, 88], look: [0, -1913, -5267], fov: 6.2 }], 0.02),
    shake: (t) => { let k = 0; for (const tf of FIRES) if (t >= tf && t <= tf + 0.3) k = Math.max(k, Math.exp(-(t - tf) / 0.08)); return k; },
    shakeAmp: 0.35,
    shakeSeed: 3,
    show: ["space"],
  });

  S({
    id: "c8c-magswap1",
    start: 300.6, end: 303.2,
    rig: new CamRig([{ t: 300.6, pos: [0, 45, 79], look: [0, 42.5, 64.5], fov: 13 }], 0.02),
    show: ["space"],
  });

  S({
    id: "c8d-burst2",
    start: 303.2, end: 305.6,
    rig: new CamRig([{ t: 303.2, pos: [0, 46, 88], look: [0, -1913, -5267], fov: 6.2 }], 0.02),
    shake: (t) => { let k = 0; for (const tf of FIRES) if (t >= tf && t <= tf + 0.3) k = Math.max(k, Math.exp(-(t - tf) / 0.08)); return k; },
    shakeAmp: 0.35,
    shakeSeed: 4,
    show: ["space"],
  });

  S({
    id: "c8e-magswap2",
    start: 305.6, end: 308.2,
    rig: new CamRig([{ t: 305.6, pos: [0, 45, 79], look: [0, 42.5, 64.5], fov: 13 }], 0.02),
    show: ["space"],
  });

  S({
    id: "c8f-burst3",
    start: 308.2, end: 311.4,
    rig: new CamRig([{ t: 308.2, pos: [0, 46, 88], look: [0, -1913, -5267], fov: 6.2 }], 0.02),
    shake: (t) => { let k = 0; for (const tf of FIRES) if (t >= tf && t <= tf + 0.3) k = Math.max(k, Math.exp(-(t - tf) / 0.08)); return k; },
    shakeAmp: 0.35,
    shakeSeed: 5,
    show: ["space"],
  });

  S({
    id: "c8g-slide-lock",
    start: 311.4, end: 312.5,
    rig: new CamRig([{ t: 311.4, pos: [24, 49, 122], look: [0, 43, 58], fov: 17 }], 0.03),
    show: ["space"],
  });

  S({
    id: "c9a-flight",
    start: 312.5, end: 315.6,
    rig: new CamRig([
      { t: 312.5, pos: [620, -936, -2603], look: [0, -936, -2603], fov: 12 },
      { t: 315.6, pos: [520, -936, -2580], look: [0, -936, -2600], fov: 12 },
    ], 0.06),
    lookAt: (world, t, out) => {
      // track the centroid of bullets currently in flight
      const zhangPos = new THREE.Vector3(0, 40, 60);
      let cx = 0, cy = 0, cz = 0, n = 0;
      const flight = 11.3;
      for (let b = 0; b < 30; b++) {
        const tf = 298.4 + Math.floor(b / 10) * 5.0 + (b % 10) * 0.32;
        const k = (t - tf) / flight;
        if (k > 0.12 && k < 0.92) {
          const member = b % 3;
          const base = world.figures.group[member]!.base;
          const aim = base.clone();
          cx += zhangPos.x + (aim.x - zhangPos.x) * k;
          cy += zhangPos.y + (aim.y - zhangPos.y) * k;
          cz += zhangPos.z + (aim.z - zhangPos.z) * k;
          n++;
        }
      }
      if (n > 0) out.set(cx / n, cy / n, cz / n);
      else out.set(0, -936, -2603);
    },
    show: ["space"],
  });

  S({
    id: "c9b-face",
    start: 315.6, end: 319.5,
    rig: new CamRig([
      { t: 315.6, pos: [15, 48, 108], look: [0, 44, 58], fov: 15 },
      { t: 319.5, pos: [12.5, 47.5, 98], look: [0, 44, 58], fov: 14.5 },
    ], 0.02),
    show: ["space"],
  });

  S({
    id: "c10-impacts",
    start: 319.5, end: 324.7,
    rig: new CamRig([{ t: 319.5, pos: [0, 46, 88], look: [0, -1913, -5267], fov: 6.2 }], 0.02),
    shake: impactKick,
    shakeAmp: 0.6,
    shakeSeed: 6,
    show: ["space"],
  });

  S({
    id: "c11a-chaos",
    start: 324.7, end: 330.5,
    rig: new CamRig([
      { t: 324.7, pos: [190, -1510, -4960], look: [0, -1900, -5260], fov: 22 },
      { t: 330.5, pos: [150, -1490, -4940], look: [0, -1900, -5260], fov: 21 },
    ], 0.15),
    show: ["space"],
  });

  S({
    id: "c11b-scream",
    start: 326.6, end: 328.8,
    rig: new CamRig([{ t: 326.6, pos: [24, -1870, -5145], look: [0, -1905, -5263], fov: 10 }], 0.04),
    show: ["space"],
  });

  S({
    id: "c12-depart",
    start: 330.5, end: 337.5,
    rig: new CamRig([
      { t: 330.5, pos: [72, 86, 238], look: [0, 42, 60], fov: 22 },
      { t: 337.5, pos: [58, 74, 200], look: [0, 42, 60], fov: 21 },
    ], 0.12),
    show: ["space"],
  });

  /* ================= act IV: the future ================= */

  S({
    id: "d0-bay-wide",
    start: 340.5, end: 343.2,
    rig: new CamRig([
      { t: 340.5, pos: [1.45, 1.4, 5.5], look: [0, 0.95, 2.2], fov: 30 },
      { t: 343.2, pos: [1.3, 1.35, 5.0], look: [0, 0.95, 2.2], fov: 29 },
    ], 0.03),
    show: ["bay"],
  });

  S({
    id: "d1-pod-close",
    start: 343.2, end: 345.3,
    rig: new CamRig([
      { t: 343.2, pos: [1.6, 1.25, 3.7], look: [0, 1.0, 2.2], fov: 22 },
      { t: 345.3, pos: [1.35, 1.2, 3.45], look: [0, 1.0, 2.25], fov: 21 },
    ], 0.02),
    show: ["bay"],
  });

  S({
    id: "d2-face-glass",
    start: 345.2, end: 348,
    rig: new CamRig([
      { t: 345.2, pos: [0.75, 1.38, 3.3], look: [0, 1.1, 1.7], fov: 19 },
      { t: 348, pos: [0.5, 1.32, 2.95], look: [0, 1.1, 1.7], fov: 18 },
    ], 0.02),
    show: ["bay"],
  });

  return shots;
}
