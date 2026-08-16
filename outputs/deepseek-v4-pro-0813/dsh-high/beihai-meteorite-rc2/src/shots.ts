import * as THREE from "three";
import type { Shot } from "@agentbench/cinematic-player";
import { applyPose, walk, idle, float, aim, type Pose } from "@agentbench/voxel-kit";
import type { Film } from "./film";
import { setClothesOnce } from "./film";
import { applyCamKeys, clamp01, smoothstep, easeOutCubic } from "./util";
import { zhangUniform, zhangSpaceSuit } from "./skins";
import { STATION_POS } from "./world";

type Ctx = Film;

// ---------------------------------------------------------------------------
// Pose helpers (performance is built on top of the kit presets)
// ---------------------------------------------------------------------------

function talkPose(t: number, seed = 0): Pose {
  const p = idle(t + seed);
  const w = Math.sin(t * 2.1 + seed);
  p.armR = [w * 0.55 - 0.3, 0, 0.16];
  p.armL = [Math.sin(t * 1.7 + seed + 2) * 0.4 - 0.22, 0, -0.12];
  return p;
}

function standPose(t: number, seed = 0): Pose {
  return idle(t + seed);
}

function reachPose(t: number): Pose {
  const breath = Math.sin(t * 1.4) * 0.02;
  return {
    neck: [0.14 + breath, 0, 0],
    armR: [-0.82 + Math.sin(t * 3.1) * 0.06, 0, 0.12],
    armL: [-0.74 + Math.cos(t * 2.6) * 0.06, 0, -0.08],
    lift: breath * 0.1,
  };
}

function floatPose(t: number, drift = 0): Pose {
  const f = float(t + drift);
  return f;
}

// ---------------------------------------------------------------------------
// Figure visibility helpers
// ---------------------------------------------------------------------------

function showFigures(
  film: Film,
  opts: { zhang?: boolean; collector?: boolean; targets?: boolean; crew?: boolean },
): void {
  film.cast.zhang.root.visible = opts.zhang ?? false;
  film.cast.collector.root.visible = opts.collector ?? false;
  for (const f of film.cast.targets) f.root.visible = opts.targets ?? false;
  for (const f of film.cast.crew) f.root.visible = opts.crew ?? false;
}

function showSet(film: Film, set: "house" | "shop" | "basement" | "space"): void {
  film.world.house.visible = set === "house";
  film.world.shop.visible = set === "shop";
  film.world.basement.visible = set === "basement";
  film.world.space.visible = set === "space";
}

// ---------------------------------------------------------------------------
// Photo group layout
// ---------------------------------------------------------------------------

const PHOTO_BASE = new THREE.Vector3(STATION_POS.x + 2.5, STATION_POS.y + 26, STATION_POS.z);

function placePhotoGroup(film: Film, spread = 1, time = 0): void {
  const { targets, crew } = film.cast;
  const o = PHOTO_BASE;
  // targets: front row, spread along z
  for (let i = 0; i < 3; i++) {
    const f = targets[i];
    const z = (i - 1) * 2.1;
    f.root.position.set(o.x + 1.3 + (1 - spread) * 2.2, o.y + Math.sin(time * 0.6 + i) * 0.08, o.z + z);
    f.root.rotation.y = Math.PI / 2;
    applyPose(f, floatPose(time, i * 1.3));
  }
  for (let i = 0; i < crew.length; i++) {
    const f = crew[i];
    const row = i < 7 ? 0 : 1;
    const col = i % 7;
    const z = (col - 3) * 1.9 + (row ? 0.8 : -0.2);
    const y = o.y + 0.4 + (row ? 0.35 : 0) + Math.sin(time * 0.5 + i * 0.7) * 0.09;
    const x = o.x - 0.6 - row * 1.5 + (1 - spread) * 2.4;
    f.root.position.set(x, y, o.z + z);
    f.root.rotation.y = Math.PI / 2;
    applyPose(f, floatPose(time, i * 0.9));
  }
}

// ---------------------------------------------------------------------------
// Fire scheduling (matches the gun-burst audio)
// ---------------------------------------------------------------------------

const FIRE_TIMES: number[] = (() => {
  const t: number[] = [];
  let cur = 0.0;
  const gap = 0.31;
  const reload = 0.82;
  for (let v = 0; v < 3; v++) {
    for (let i = 0; i < 10; i++) {
      t.push(cur);
      cur += gap;
    }
    cur += reload - gap;
  }
  return t;
})();

function muzzleLevel(localTime: number): number {
  let level = 0;
  for (const ft of FIRE_TIMES) {
    const dt = localTime - ft;
    if (dt >= 0 && dt < 0.09) {
      const e = 1 - dt / 0.09;
      level = Math.max(level, e);
    }
  }
  return level;
}

function lastFireDelta(localTime: number): number {
  let last = -1;
  for (const ft of FIRE_TIMES) {
    if (localTime >= ft) last = ft;
  }
  return last < 0 ? 999 : localTime - last;
}

function recoil(fireList: number[], localTime: number): number {
  let last = -1;
  for (const f of fireList) {
    if (localTime >= f) last = f;
  }
  if (last < 0) return 0;
  const dt = localTime - last;
  return dt < 0.16 ? 1 - dt / 0.16 : 0;
}

// ---------------------------------------------------------------------------
// Shots
// ---------------------------------------------------------------------------

export function buildShots(film: Film): Shot<Ctx>[] {
  const zhangUniformTex = zhangUniform().texture;
  const zhangSuitTex = zhangSpaceSuit().texture;

  const shots: Shot<Ctx>[] = [];

  // ===== 0 · 片头 (stars, cold-open flash, title) ==========================
  shots.push({
    id: "title",
    start: 0,
    end: 20,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, {});
      context.pistol.visible = false;
      context.world.sun.visible = true;
    },
    update: ({ context, localTime }) => {
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0, 0, 0], look: [-60, 6, 30], fov: 50 },
          { t: 0.5, pos: [4, 1.4, 5], look: [-50, 8, 36], fov: 46 },
          { t: 1, pos: [9, 2.6, 9], look: [-38, 10, 44], fov: 42 },
        ],
        localTime / 20,
        50,
      );
    },
  });

  // ===== 1 · 收藏者家：进门 =================================================
  shots.push({
    id: "house-arrival",
    start: 20,
    end: 30,
    enter: ({ context }) => {
      showSet(context, "house");
      showFigures(context, { zhang: true, collector: true });
      setClothesOnce(context, "zhang", context.cast.zhang, zhangUniformTex);
      context.pistol.visible = false;
      context.cast.collector.root.position.set(-0.15, 0, -2.35);
      context.cast.collector.root.rotation.y = 0;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      const from = new THREE.Vector3(3.5, 0, 1.2);
      const to = new THREE.Vector3(0.3, 0, 0.75);
      const p = easeOutCubic(clamp01(localTime / 5.5));
      zhang.root.position.lerpVectors(from, to, p);
      zhang.root.rotation.y = Math.PI;
      applyPose(zhang, p < 0.9 ? walk(localTime * 1.35) : standPose(localTime));
      const collector = context.cast.collector;
      collector.root.rotation.y = Math.sin(localTime * 0.5) * 0.25;
      applyPose(collector, standPose(localTime, 1));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [3.4, 1.7, 3.8], look: [0.2, 1.3, -1.4], fov: 40 },
          { t: 1, pos: [2.6, 1.6, 2.9], look: [0.1, 1.3, -1.2], fov: 38 },
        ],
        progress,
      );
    },
  });

  // ===== 2 · 对话：军人 =====================================================
  shots.push({
    id: "house-chat",
    start: 30,
    end: 48,
    enter: ({ context }) => {
      showSet(context, "house");
      showFigures(context, { zhang: true, collector: true });
      context.pistol.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0.3, 0, 0.75);
      zhang.root.rotation.y = Math.PI;
      applyPose(zhang, standPose(localTime));
      const collector = context.cast.collector;
      collector.root.position.set(-0.15, 0, -2.35);
      collector.root.rotation.y = Math.sin(localTime * 0.4) * 0.2;
      applyPose(collector, talkPose(localTime, 2));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [3.7, 1.72, -0.5], look: [0.2, 1.5, -0.9], fov: 44 },
          { t: 1, pos: [2.9, 1.68, -0.5], look: [0.2, 1.5, -0.9], fov: 42 },
        ],
        progress,
      );
    },
  });

  // ===== 3 · 镇宅之宝 =======================================================
  shots.push({
    id: "house-treasure",
    start: 48,
    end: 64,
    enter: ({ context }) => {
      showSet(context, "house");
      showFigures(context, { zhang: true, collector: true });
      context.pistol.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0.3, 0, 0.75);
      zhang.root.rotation.y = Math.PI;
      applyPose(zhang, standPose(localTime, 1));
      const collector = context.cast.collector;
      collector.root.position.set(-0.15, 0, -2.35);
      collector.root.rotation.y = 0;
      applyPose(collector, {
        neck: [0.1, 0, 0],
        armR: [-0.9 + Math.sin(localTime * 2.2) * 0.08, 0, 0.14],
        armL: [-0.4, 0, -0.1],
      });
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.5, 1.6, 0.6], look: [-0.15, 1.4, -1.9], fov: 34 },
          { t: 1, pos: [0.7, 1.5, -0.1], look: [-0.15, 1.4, -2.0], fov: 28 },
        ],
        progress,
      );
    },
  });

  // ===== 4 · 砍价 ===========================================================
  shots.push({
    id: "house-bargain",
    start: 64,
    end: 80,
    enter: ({ context }) => {
      showSet(context, "house");
      showFigures(context, { zhang: true, collector: true });
      context.pistol.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0.3, 0, 0.75);
      zhang.root.rotation.y = Math.PI;
      applyPose(zhang, talkPose(localTime, 4));
      const collector = context.cast.collector;
      collector.root.position.set(-0.15, 0, -2.35);
      collector.root.rotation.y = 0;
      // laughs, tips head back
      applyPose(collector, {
        neck: [-0.12 + Math.sin(localTime * 3.0) * 0.1, 0, 0],
        armR: [0.2 + Math.sin(localTime * 2.4) * 0.3, 0, 0.12],
        armL: [-0.2, 0, -0.08],
      });
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [-1.7, 1.66, -1.1], look: [0.3, 1.5, 0.7], fov: 34 },
          { t: 1, pos: [-1.25, 1.62, -0.7], look: [0.3, 1.5, 0.7], fov: 32 },
        ],
        progress,
      );
    },
  });

  // ===== 5 · 成交 ===========================================================
  shots.push({
    id: "house-deal",
    start: 80,
    end: 96,
    enter: ({ context }) => {
      showSet(context, "house");
      showFigures(context, { zhang: true, collector: true });
      context.pistol.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0.3, 0, 0.75);
      zhang.root.rotation.y = Math.PI;
      applyPose(zhang, standPose(localTime));
      const collector = context.cast.collector;
      collector.root.position.set(-0.15, 0, -2.35);
      collector.root.rotation.y = 0;
      applyPose(collector, talkPose(localTime, 6));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0.35, 1.05, 0.05], look: [0, 0.95, -1.3], fov: 42 },
          { t: 0.5, pos: [0.75, 1.6, 1.0], look: [0.3, 1.48, 0.75], fov: 34 },
          { t: 1, pos: [1.05, 1.6, 1.6], look: [0.3, 1.45, 0.75], fov: 32 },
        ],
        progress,
      );
    },
  });

  // ===== 6 · 车间：车削 =====================================================
  shots.push({
    id: "shop",
    start: 96,
    end: 116,
    enter: ({ context }) => {
      showSet(context, "shop");
      showFigures(context, { zhang: true });
      setClothesOnce(context, "zhang", context.cast.zhang, zhangUniformTex);
      context.pistol.visible = false;
      context.cast.zhang.root.position.set(-0.4, 0, -0.1);
      context.cast.zhang.root.rotation.y = Math.PI;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      applyPose(zhang, reachPose(localTime));
      context.world.latheSpindle.rotation.z = localTime * 9;
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.75, 1.55, 1.25], look: [-0.55, 1.3, -1.0], fov: 38 },
          { t: 0.5, pos: [1.05, 1.4, 0.75], look: [-0.7, 1.25, -1.3], fov: 32 },
          { t: 1, pos: [0.65, 1.32, 0.5], look: [-0.75, 1.25, -1.4], fov: 28 },
        ],
        progress,
      );
    },
  });

  // ===== 7 · 地下室：造弹 ===================================================
  shots.push({
    id: "basement-craft",
    start: 116,
    end: 140,
    enter: ({ context }) => {
      showSet(context, "basement");
      showFigures(context, { zhang: true });
      context.pistol.visible = false;
      context.cast.zhang.root.position.set(0, 0, 0.15);
      context.cast.zhang.root.rotation.y = Math.PI;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      applyPose(zhang, reachPose(localTime + 2));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.5, 1.65, 1.3], look: [0, 1.3, -0.5], fov: 36 },
          { t: 0.5, pos: [1.1, 1.6, 0.9], look: [0, 1.25, -0.7], fov: 32 },
          { t: 1, pos: [0.85, 1.55, 0.7], look: [0, 1.25, -0.8], fov: 30 },
        ],
        progress,
      );
    },
  });

  // ===== 8 · 试射 ===========================================================
  shots.push({
    id: "basement-fire",
    start: 140,
    end: 154,
    enter: ({ context }) => {
      showSet(context, "basement");
      showFigures(context, { zhang: true });
      context.cast.zhang.root.position.set(0, 0, 0.15);
      context.cast.zhang.root.rotation.y = 0.9;
      context.pistol.visible = true;
      context.scope.visible = false;
    },
    update: ({ context, localTime }) => {
      const zhang = context.cast.zhang;
      // fires at 140.4 / 143.4 / 146.4 absolute → local 0.4 / 3.4 / 6.4
      const fire = [0.4, 3.4, 6.4];
      const level = Math.max(...fire.map((f) => (localTime >= f && localTime < f + 0.09 ? 1 - (localTime - f) / 0.09 : 0)));
      context.world.muzzleFlash.visible = level > 0.05;
      context.world.muzzleLight.intensity = level * 30;
      context.world.muzzleFlash.scale.setScalar(1 + level * 0.8);
      applyPose(zhang, aim(0.08, 0));
      const shake = recoil(fire, localTime) * 0.045;
      const jx = Math.sin(localTime * 70) * shake;
      const jy = Math.cos(localTime * 57) * shake;
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0.15 + jx, 1.65 + jy, 2.9], look: [0.8, 1.1, 0.85], fov: 38 },
          { t: 1, pos: [0.35 + jx, 1.55 + jy, 2.5], look: [0.85, 1.1, 0.9], fov: 36 },
        ],
        localTime / 14,
      );
    },
    leave: ({ context }) => {
      context.world.muzzleFlash.visible = false;
      context.world.muzzleLight.intensity = 0;
    },
  });

  // ===== 9 · 结果 ===========================================================
  shots.push({
    id: "basement-result",
    start: 154,
    end: 160,
    enter: ({ context }) => {
      showSet(context, "basement");
      showFigures(context, { zhang: true });
      context.pistol.visible = false;
    },
    update: ({ context, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0.4, 0, 0.6);
      zhang.root.rotation.y = 0.9;
      applyPose(zhang, { neck: [0.15, 0, 0], armR: [-0.5, 0, 0.1], armL: [-0.3, 0, -0.08] });
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.1, 1.3, 2.3], look: [1.6, 0.95, 1.5], fov: 32 },
          { t: 1, pos: [1.4, 1.15, 1.9], look: [1.65, 0.95, 1.5], fov: 28 },
        ],
        progress,
      );
    },
  });

  // ===== 10 · 太空：到达 ====================================================
  shots.push({
    id: "space-arrive",
    start: 160,
    end: 180,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true });
      setClothesOnce(context, "zhang", context.cast.zhang, zhangSuitTex);
      context.pistol.visible = false;
      context.world.sun.visible = true;
      context.world.sun.position.set(-52, 6, -168);
    },
    update: ({ context, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, floatPose(progress * 18));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [15, 6, 36], look: [0, 0, 0], fov: 46 },
          { t: 1, pos: [7, 2.6, 19], look: [0, 0.1, 0], fov: 40 },
        ],
        progress,
      );
    },
  });

  // ===== 11 · 太空：隐踪 ====================================================
  shots.push({
    id: "space-stealth",
    start: 180,
    end: 198,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true });
      context.pistol.visible = false;
    },
    update: ({ context, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, {
        hips: [-0.1, 0, 0],
        neck: [0.15, 0, 0],
        armR: [-0.7 + Math.sin(progress * 8) * 0.1, 0, 0.25],
        armL: [-0.6 + Math.cos(progress * 7) * 0.1, 0, -0.3],
        legR: [-0.3, 0, 0.1],
        legL: [-0.2, 0, -0.1],
      });
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [2.6, 0.5, 2.3], look: [0, 0.1, 0], fov: 34 },
          { t: 1, pos: [1.5, 0.25, 1.5], look: [0, 0.05, 0], fov: 30 },
        ],
        progress,
      );
    },
  });

  // ===== 12 · 太空：理由 ====================================================
  shots.push({
    id: "space-why",
    start: 198,
    end: 226,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true });
      context.pistol.visible = false;
    },
    update: ({ context, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, floatPose(progress * 20));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.1, 0.25, 1.0], look: [0, 0.1, 0], fov: 30 },
          { t: 0.45, pos: [0.5, 0.1, 0.45], look: [0, 0.05, 0], fov: 26 },
          { t: 0.62, pos: [-3, 1.6, -4], look: [0, 0, 0], fov: 40 },
          { t: 1, pos: [-6, 1.2, -6], look: [150, 2, 24], fov: 38 },
        ],
        progress,
      );
    },
  });

  // ===== 13 · 太空：等待 / 日落 ============================================
  shots.push({
    id: "space-wait",
    start: 226,
    end: 244,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true });
      context.pistol.visible = false;
    },
    update: ({ context, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(1.6, 0.4, -1.2);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, floatPose(progress * 16));
      // sun sinks behind Earth's limb
      context.world.sun.position.set(-52, 6 - progress * 26, -168);
      context.world.sunLight.position.copy(context.world.sun.position);
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0, 1.5, 15], look: [0, -4, -170], fov: 40 },
          { t: 1, pos: [0, 1.8, 12], look: [-6, -4, -170], fov: 34 },
        ],
        progress,
      );
    },
  });

  // ===== 14 · 太空：合影 ====================================================
  shots.push({
    id: "space-photo",
    start: 244,
    end: 260,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true, targets: true, crew: true });
      for (const t of context.cast.targets) setClothesOnce(context, `target-suit`, t, context.cast.targetSuit);
      context.pistol.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, floatPose(localTime));
      const spread = smoothstep(clamp01((localTime - 1) / 5));
      placePhotoGroup(context, spread, localTime);
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0, 0, 0], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 26 },
          { t: 1, pos: [48, 7, 7], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 20 },
        ],
        progress,
      );
    },
  });

  // ===== 15 · 准备 (摘手套 / 取枪) =========================================
  shots.push({
    id: "fire-prep",
    start: 260,
    end: 276,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true, targets: true, crew: true });
      for (const t of context.cast.targets) setClothesOnce(context, `target-suit`, t, context.cast.targetSuit);
      placePhotoGroup(context, 1, 8);
      context.pistol.visible = true;
      context.scope.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, {
        hips: [-0.12, 0, 0],
        neck: [0.2, 0, 0],
        armR: [-0.85 + Math.sin(localTime * 2.4) * 0.08, 0, 0.22],
        armL: [-0.7 + Math.cos(localTime * 2.0) * 0.08, 0, -0.26],
        legR: [-0.4, 0, 0.12],
        legL: [-0.25, 0, -0.12],
      });
      context.scope.visible = localTime > 7.5;
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.35, 0.25, 1.15], look: [0, 0.1, 0], fov: 32 },
          { t: 1, pos: [0.75, 0.1, 0.7], look: [0, 0.08, 0], fov: 28 },
        ],
        progress,
      );
    },
  });

  // ===== 16 · 瞄准 ===========================================================
  shots.push({
    id: "fire-aim",
    start: 276,
    end: 292,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true, targets: true, crew: true });
      for (const t of context.cast.targets) setClothesOnce(context, `target-suit`, t, context.cast.targetSuit);
      placePhotoGroup(context, 1, 16);
      context.pistol.visible = true;
      context.scope.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, aim(0.04, 0));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0, 0.16, 0], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 9 },
          { t: 1, pos: [0, 0.16, 0], look: [PHOTO_BASE.x, PHOTO_BASE.y + 0.2, PHOTO_BASE.z], fov: 7.5 },
        ],
        progress,
      );
    },
  });

  // ===== 17 · 射击 ===========================================================
  shots.push({
    id: "fire-shoot",
    start: 292,
    end: 304,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true, targets: true, crew: true });
      for (const t of context.cast.targets) setClothesOnce(context, `target-suit`, t, context.cast.targetSuit);
      placePhotoGroup(context, 1, 22);
      context.pistol.visible = true;
      context.scope.visible = true;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, aim(0.04, 0));
      const level = muzzleLevel(localTime);
      context.world.muzzleFlash.visible = level > 0.05;
      context.world.muzzleLight.intensity = level * 26;
      context.world.muzzleFlash.scale.setScalar(1 + level * 0.7);
      const dt = lastFireDelta(localTime);
      const shake = dt < 0.16 ? 0.03 * (1 - dt / 0.16) : 0;
      const jx = Math.sin(localTime * 83) * shake;
      const jy = Math.cos(localTime * 71) * shake;
      // wide "firefly" angle: Zhang in the foreground, the wheel station far off
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [-2.4 + jx, 1.45 + jy, 1.1], look: [55, 1, 7], fov: 42 },
          { t: 1, pos: [-1.9 + jx, 1.4 + jy, 0.9], look: [70, 1, 8], fov: 40 },
        ],
        progress,
      );
    },
    leave: ({ context }) => {
      context.world.muzzleFlash.visible = false;
      context.world.muzzleLight.intensity = 0;
    },
  });

  // ===== 18 · 子弹飞行 =======================================================
  shots.push({
    id: "fire-flight",
    start: 304,
    end: 322,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true, targets: true, crew: true });
      for (const t of context.cast.targets) setClothesOnce(context, `target-suit`, t, context.cast.targetSuit);
      placePhotoGroup(context, 1, 30);
      context.pistol.visible = false;
      context.scope.visible = false;
    },
    update: ({ context, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, aim(0.02, 0));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [0, 0.14, 0], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 7.5 },
          { t: 1, pos: [55, 9, 8], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 8.5 },
        ],
        progress,
      );
    },
  });

  // ===== 19 · 命中 ===========================================================
  shots.push({
    id: "fire-impact",
    start: 322,
    end: 334,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { targets: true, crew: true });
      placePhotoGroup(context, 1, 40);
      context.pistol.visible = false;
      context.scope.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      placePhotoGroup(context, 1, 40 + localTime * 0.3);
      const hitTimes = [0.5, 1.2, 1.9];
      for (let i = 0; i < 3; i++) {
        const t = context.cast.targets[i];
        const dt = localTime - hitTimes[i];
        const jet = context.gasJets[i];
        if (dt >= 0) {
          setClothesOnce(context, `target-hit-${i}`, t, context.hitTex);
          jet.visible = true;
          const grow = 1 + dt * 2.2;
          jet.scale.setScalar(grow);
          context.gasMat.opacity = Math.max(0, 0.9 * (1 - dt / 2.0));
        } else {
          setClothesOnce(context, `target-hit-${i}`, t, context.cast.targetSuit);
          jet.visible = false;
        }
      }
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [158, 23, 24], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 14 },
          { t: 1, pos: [162, 24, 25], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 11 },
        ],
        progress,
      );
    },
    leave: ({ context }) => {
      for (const jet of context.gasJets) jet.visible = false;
    },
  });

  // ===== 20 · 余波 ===========================================================
  shots.push({
    id: "aftermath",
    start: 334,
    end: 344,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true, targets: true, crew: true });
      for (const t of context.cast.targets) setClothesOnce(context, `target-hit-all`, t, context.hitTex);
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      zhang.root.position.set(0, 0, 0);
      zhang.root.rotation.y = Math.PI / 2;
      applyPose(zhang, floatPose(localTime));
      // panicked scattering
      placePhotoGroup(context, 1, 40 + localTime * 0.5);
      for (let i = 0; i < context.cast.crew.length; i++) {
        const f = context.cast.crew[i];
        const dir = i % 2 === 0 ? 1 : -1;
        f.root.position.x += Math.sin(localTime * 1.2 + i) * 1.4 * dir;
        f.root.position.y += Math.cos(localTime * 0.9 + i) * 0.6;
        f.root.position.z += Math.sin(localTime * 1.1 + i * 0.5) * 1.2;
      }
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [150, 22, 22], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 18 },
          { t: 1, pos: [144, 20, 20], look: [PHOTO_BASE.x, PHOTO_BASE.y, PHOTO_BASE.z], fov: 16 },
        ],
        progress,
      );
    },
  });

  // ===== 21 · 尾声 ===========================================================
  shots.push({
    id: "epilogue",
    start: 344,
    end: 356,
    enter: ({ context }) => {
      showSet(context, "space");
      showFigures(context, { zhang: true });
      context.pistol.visible = false;
      context.scope.visible = false;
    },
    update: ({ context, localTime, progress }) => {
      const zhang = context.cast.zhang;
      // drifts away, calm
      const p = easeOutCubic(progress);
      zhang.root.position.set(-p * 26, p * 6, -p * 18);
      zhang.root.rotation.y = Math.PI / 2 + Math.sin(localTime * 0.3) * 0.15;
      applyPose(zhang, floatPose(localTime));
      applyCamKeys(
        context.camera,
        [
          { t: 0, pos: [1.7, 0.4, 1.3], look: [0, 0.1, 0], fov: 28 },
          { t: 1, pos: [16, 6, 18], look: [-10, 2, -6], fov: 34 },
        ],
        progress,
      );
    },
  });

  return shots;
}
