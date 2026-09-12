import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import type { SceneHandle } from "./scenes/collector";
import { buildTitle } from "./scenes/title";
import { buildCollector } from "./scenes/collector";
import { buildWorkshop } from "./scenes/workshop";
import { buildBasement } from "./scenes/basement";
import { buildSpace } from "./scenes/space";

export interface FilmContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

type Builder = () => SceneHandle;

/** Camera cut map: [fromTime, setupName] */
type CutMap = Array<[number, string]>;

function pick(cuts: CutMap, t: number): string {
  let current = cuts[0][1];
  for (const [at, name] of cuts) if (t >= at) current = name;
  return current;
}

const CUTS_COLLECTOR: CutMap = [
  [9, "enter-wide"],
  [21, "greet-med"],
  [30, "tea-wide"],
  [39.5, "over-zhang"],
  [46, "over-zhang"],
  [50.5, "over-coll"],
  [56, "pay-med"],
  [59, "cabinet-med"],
  [64.3, "stones-close"],
  [66.5, "pay-med"],
];

const CUTS_WORKSHOP: CutMap = [
  [78, "shop-wide"],
  [84.5, "machine-close"],
  [89, "shop-wide"],
  [92, "chuck-macro"],
  [95.5, "machine-close"],
  [100, "chuck-macro"],
  [103.5, "machine-close"],
  [106, "chuck-macro"],
  [109.5, "bench-close"],
  [113.5, "tray-macro"],
];

const CUTS_BASEMENT: CutMap = [
  [118, "base-wide"],
  [128, "table-close"],
  [136, "base-wide"],
  [142, "table-close"],
  [148, "aim-rear"],
  [157.5, "aim-side"],
  [158.5, "bundle-close"],
  [171.5, "palm-macro"],
];

const CUTS_SPACE: CutMap = [
  [180, "float-wide"],
  [189, "float-rev"],
  [196, "float-wide"],
  [205, "float-rev"],
  [214, "scope-view"],
  [222, "crowd-med"],
  [236, "scope-view"],
  [244, "crowd-med"],
  [252, "assemble-close"],
  [264, "aim-side"],
  [270, "scope-view"],
  [276, "aim-side"],
  [278, "scope-view"],
  [283, "aim-side"],
  [285, "scope-view"],
  [290, "aim-side"],
  [296, "flight"],
  [300, "hit-close"],
  [303, "scope-view"],
  [306, "retreat-wide"],
  [315, "aim-side"],
  [318, "epilogue"],
];

/** Is the telescopic-sight overlay visible at time t? */
export function scopeActive(t: number): boolean {
  return (t >= 214 && t < 222) || (t >= 236 && t < 244) ||
    (t >= 270 && t < 276) || (t >= 278 && t < 283) ||
    (t >= 285 && t < 290) || (t >= 303 && t < 306);
}

function sceneShot(
  id: string,
  start: number,
  end: number,
  build: Builder,
  cuts: CutMap | null,
): Shot<FilmContext> {
  let handle: SceneHandle | null = null;
  return {
    id, start, end,
    enter: ({ context }) => {
      handle = build(); // fresh build on every enter: deterministic re-seek
      context.scene.add(handle.group);
    },
    update: ({ context, time }) => {
      if (!handle) return;
      handle.frame(time);
      handle.setCamera(context.camera, cuts ? pick(cuts, time) : "", time);
    },
    leave: ({ context }) => {
      if (handle) context.scene.remove(handle.group);
      handle = null;
    },
  };
}

export function buildShots(): Shot<FilmContext>[] {
  return [
    sceneShot("title", 0, 9, buildTitle, null),
    sceneShot("collector", 9, 78, buildCollector, CUTS_COLLECTOR),
    sceneShot("workshop", 78, 118, buildWorkshop, CUTS_WORKSHOP),
    sceneShot("basement", 118, 180, buildBasement, CUTS_BASEMENT),
    sceneShot("space", 180, 345, buildSpace, CUTS_SPACE),
  ];
}
