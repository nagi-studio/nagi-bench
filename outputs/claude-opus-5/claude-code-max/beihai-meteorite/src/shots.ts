import * as THREE from "three";
import { clamp01, lerp, segmentProgress, smoothstep, type Shot } from "@agentbench/cinematic-player";
import { applyPose, lerpPose, walk, float, type Figure, type Pose } from "@agentbench/voxel-kit";

import { TARGET_INDICES, type Cast } from "./cast";
import { drift, easeIn, easeOut, handheld, move, applyFraming, type Framing } from "./lib/camera";
import type { CameraOverlay } from "./lib/overlay";
import type { Screen } from "./lib/screen";
import type { Courtyard } from "./sets/courtyard";
import type { Basement, Workshop } from "./sets/industry";
import { setSun, STAGE_ORIGIN, type SpaceSet } from "./sets/space";
import { T } from "./timeline";

export interface Ctx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cast: Cast;
  yard: Courtyard;
  shop: Workshop;
  cellar: Basement;
  space: SpaceSet;
  scope: CameraOverlay;
  visor: CameraOverlay;
  screen: Screen;
}

type World = "yard-out" | "yard-in" | "shop" | "cellar" | "space" | "void";

const BACKGROUNDS: Record<World, number> = {
  "yard-out": 0x241a12,
  "yard-in": 0x0c0805,
  shop: 0x090c10,
  cellar: 0x030302,
  space: 0x000104,
  void: 0x000000,
};

function setWorld(ctx: Ctx, world: World): void {
  ctx.yard.exterior.visible = world === "yard-out";
  ctx.yard.interior.visible = world === "yard-in";
  ctx.shop.root.visible = world === "shop";
  ctx.cellar.root.visible = world === "cellar";
  ctx.space.root.visible = world === "space" || world === "void";
  ctx.scene.background = new THREE.Color(BACKGROUNDS[world]);
  if (world === "yard-in") ctx.scene.fog = new THREE.FogExp2(0x160e08, 0.048);
  else if (world === "yard-out") ctx.scene.fog = new THREE.FogExp2(0x2a1e14, 0.024);
  else if (world === "shop") ctx.scene.fog = new THREE.FogExp2(0x0d1116, 0.035);
  else if (world === "cellar") ctx.scene.fog = new THREE.FogExp2(0x040403, 0.16);
  else ctx.scene.fog = null;
  ctx.scope.set(0);
  ctx.visor.set(0);
}

// ── 表演 ────────────────────────────────────────────────────────────────
/** 站着。重心在一条腿上，呼吸很慢。章北海全片都是这个底子。 */
function stand(t: number, phase = 0): Pose {
  const breath = Math.sin(t * 1.42 + phase);
  const sway = Math.sin(t * 0.33 + phase * 1.7);
  return {
    hips: [0, sway * 0.05, 0.01],
    neck: [breath * 0.018, sway * 0.14, 0],
    armR: [breath * 0.025, 0, 0.075],
    armL: [-breath * 0.025, 0, -0.075],
    legR: [0, 0, 0.012],
    legL: [0, 0, -0.012],
    lift: breath * 0.06,
  };
}

/** 说话。收藏者的手一直在动，这是他和章北海最大的区别。 */
function talk(t: number, energy = 1, phase = 0): Pose {
  const a = Math.sin(t * 3.3 + phase);
  const b = Math.sin(t * 2.1 + phase * 2.2);
  const c = Math.sin(t * 1.1 + phase);
  return {
    hips: [0, c * 0.07, 0],
    neck: [a * 0.055 * energy, c * 0.22, b * 0.035],
    armR: [-0.75 - a * 0.42 * energy, 0.34, 0.46 + b * 0.16 * energy],
    armL: [-0.28 - b * 0.3 * energy, -0.26, -0.34 - a * 0.1],
    legR: [0, 0, 0.02],
    legL: [0, 0, -0.02],
    lift: Math.sin(t * 1.5 + phase) * 0.09,
  };
}

/** 双手在身前捧着或操作着什么：茶杯、手机、钳子。 */
function handsFront(t: number, height: number, spread = 0.26): Pose {
  const breath = Math.sin(t * 1.5);
  return {
    hips: [0, 0, 0],
    neck: [0.16 + breath * 0.02, 0, 0],
    armR: [-height + breath * 0.02, 0.16, spread],
    armL: [-height * 0.92 - breath * 0.02, -0.16, -spread],
    legR: [0, 0, 0.012],
    legL: [0, 0, -0.012],
    lift: breath * 0.05,
  };
}

/** 伸出一只手：递东西、指柜子、取石头。 */
function reach(t: number, pitch: number, yaw: number): Pose {
  const breath = Math.sin(t * 1.5);
  return {
    hips: [0, yaw * 0.28, 0],
    neck: [pitch * 0.4, yaw * 0.5, 0],
    armR: [-pitch + breath * 0.02, yaw * 0.4, 0.2],
    armL: [-0.14, 0, -0.1],
    legR: [0, 0, 0.012],
    legL: [0, 0, -0.012],
    lift: breath * 0.05,
  };
}

/** 低头俯身操作台面。车间和地下室的姿势。 */
function workBench(t: number, intensity = 1): Pose {
  const a = Math.sin(t * 4.2) * intensity;
  const b = Math.sin(t * 2.7 + 1.3) * intensity;
  return {
    hips: [0.2, 0.04, 0],
    neck: [0.34 + a * 0.03, b * 0.06, 0],
    armR: [-1.28 + a * 0.14, 0.22, 0.24],
    armL: [-1.16 + b * 0.1, -0.2, -0.24],
    legR: [-0.06, 0, 0.02],
    legL: [0.02, 0, -0.02],
    lift: -0.22 + Math.sin(t * 1.4) * 0.04,
  };
}

/** 失重。膝盖收起，四肢拖在后面，没有一处是"站着"的。 */
function weightless(t: number, phase = 0): Pose {
  return float(t + phase);
}

/** 举枪。上身来自失重，手臂来自瞄准 —— 两者混起来才像在真空里射击。 */
function aimInVoid(t: number, pitch: number, yaw: number, phase = 0): Pose {
  const base = float(t + phase);
  const breath = Math.sin(t * 0.9) * 0.012;
  return {
    hips: [(base.hips?.[0] ?? 0) * 0.35 - 0.06, (base.hips?.[1] ?? 0) * 0.2 + yaw * 0.2, (base.hips?.[2] ?? 0) * 0.3],
    neck: [0.06 + pitch * 0.5, yaw * 0.4, 0],
    armR: [-Math.PI / 2 + pitch + breath, yaw * 0.22, 0.1],
    armL: [-Math.PI / 2 + pitch * 0.94 + breath, yaw * 0.22, -0.3],
    legR: [-0.62, 0, 0.14],
    legL: [-0.34, 0, -0.16],
    lift: (base.lift ?? 0) * 0.4,
  };
}

function place(figure: Figure, x: number, y: number, z: number, yaw: number): void {
  figure.root.position.set(x, y, z);
  figure.root.rotation.set(0, yaw, 0);
  figure.root.visible = true;
}

function pointsFrom(
  points: THREE.Points,
  count: number,
  emit: (index: number, seed: number[], out: THREE.Vector3) => void,
): void {
  const data = points.geometry.userData.data as number[][];
  const attribute = points.geometry.attributes.position as THREE.BufferAttribute;
  const vector = new THREE.Vector3();
  for (let i = 0; i < Math.min(count, data.length); i += 1) {
    vector.set(0, 0, 0);
    emit(i, data[i]!, vector);
    attribute.setXYZ(i, vector.x, vector.y, vector.z);
  }
  for (let i = count; i < data.length; i += 1) attribute.setXYZ(i, 0, -99999, 0);
  attribute.needsUpdate = true;
}

function setOpacity(object: THREE.Points | THREE.Mesh, value: number): void {
  const material = object.material as THREE.Material & { opacity: number };
  material.opacity = value;
  object.visible = value > 0.003;
}

// ── 分镜 ────────────────────────────────────────────────────────────────
export function buildShots(): Shot<Ctx>[] {
  const shots: Shot<Ctx>[] = [];
  const add = (shot: Shot<Ctx>): void => {
    shots.push(shot);
  };

  // ══ 序 · 一块铁陨石 ══════════════════════════════════════════════════
  add({
    id: "t0-meteorite",
    start: T.t0[0],
    end: T.t0[1],
    enter: ({ context }) => {
      setWorld(context, "void");
      const { space, cast } = context;
      space.stage.visible = false;
      space.bulletCloseup.visible = false;
      space.heroStone.visible = true;
      space.distantCrowd.visible = false;
      space.bullets.visible = false;
      cast.zhang.root.visible = false;
      cast.collector.root.visible = false;
      setSun(space, -6);
      space.earth.visible = false;
      space.nightLights.visible = false;
      space.atmosphere.visible = false;
      space.wheel.visible = false;
      space.shipyard.visible = false;
      space.baseOne.visible = false;
      space.elevator.visible = false;
      space.debris.group.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { space, camera } = context;
      // 一块石头。第一格就该看得见，所以它不从纯黑里升起。
      space.heroStone.position.set(0, 0, 0);
      space.heroStone.rotation.set(localTime * 0.13 + 0.6, localTime * 0.19 + 1.1, localTime * 0.08);
      space.stars.rotation.y = time * 0.004;
      move(
        camera,
        { pos: [0.34, 0.2, 0.72], look: [0, 0, 0], fov: 30 },
        { pos: [0.2, 0.06, 0.48], look: [0, 0, 0], fov: 26 },
        localTime / 9,
        easeOut,
      );
      drift(camera, time, 0.02);
    },
    leave: ({ context }) => {
      context.space.heroStone.visible = false;
    },
  });

  // ══ 钩子 · 同步轨道上的一个白点 ══════════════════════════════════════
  add({
    id: "t1-hook",
    start: T.t1[0],
    end: T.t1[1],
    enter: ({ context }) => {
      setWorld(context, "space");
      const { space, cast } = context;
      space.bulletCloseup.visible = false;
      space.earth.visible = true;
      space.nightLights.visible = true;
      space.atmosphere.visible = true;
      space.wheel.visible = true;
      space.shipyard.visible = true;
      space.baseOne.visible = true;
      space.elevator.visible = true;
      space.debris.group.visible = true;
      space.stage.visible = false;
      setSun(space, -6.5);
      cast.zhang.setClothes(cast.costumes.suit);
      place(cast.zhang, 0, 0, 0, 2.5);
      cast.zhang.anchors.back.children.forEach((child) => { child.visible = true; });
      Object.values(cast.props).forEach((prop) => { prop.visible = false; });
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space } = context;
      applyPose(cast.zhang, weightless(time * 0.5, 3));
      cast.zhang.root.rotation.y = 2.5 + Math.sin(time * 0.08) * 0.1;
      space.debris.tumble(time);
      space.stars.rotation.y = time * 0.004;
      // 从很远推到勉强看得出是个人，然后停住。
      move(
        camera,
        { pos: [23, 12, 44], look: [0.2, 1.0, 0], fov: 32 },
        { pos: [1.7, 1.85, 4.8], look: [0.05, 1.0, 0], fov: 27 },
        localTime / 12,
        easeOut,
      );
      drift(camera, time, 0.1);
    },
  });

  // ══ 四合院 ══════════════════════════════════════════════════════════
  const yardIn = (context: Ctx): void => {
    setWorld(context, "yard-in");
    const { cast, yard } = context;
    cast.zhang.setClothes(cast.costumes.civil);
    cast.zhang.anchors.back.children.forEach((child) => { child.visible = false; });
    // 两个人隔着工作台面对面：一个背对窗（暖的逆光），一个正对镜头。
    place(cast.zhang, 0.16, 0, 0.16, Math.PI + 0.1);
    place(cast.collector, 0.04, 0, -2.12, 0.05);
    Object.values(cast.props).forEach((prop) => { prop.visible = false; });
    yard.safeDoor.rotation.y = 0;
    void yard;
  };

  // 胡同 · 院门
  add({
    id: "c0-hutong",
    start: T.c0[0],
    end: T.c0[1],
    enter: ({ context }) => {
      setWorld(context, "yard-out");
      const { cast } = context;
      cast.collector.root.visible = false;
      cast.zhang.setClothes(cast.costumes.civil);
      cast.zhang.anchors.back.children.forEach((child) => { child.visible = false; });
      Object.values(cast.props).forEach((prop) => { prop.visible = false; });
      place(cast.zhang, -0.2, 0, -3.6, Math.PI);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, yard } = context;
      const walkPhase = clamp01(localTime / 5.6);
      const z = lerp(-3.6, -7.9, smoothstep(walkPhase));
      cast.zhang.root.position.z = z;
      if (walkPhase < 0.97) {
        applyPose(cast.zhang, walk(time, 0.72));
      } else {
        applyPose(cast.zhang, lerpPose(walk(time, 0.72), stand(time), clamp01((localTime - 5.4) / 1.2)));
      }
      // 门在他走到之前先开一条缝
      const open = smoothstep(segmentProgress(localTime, 3.4, 6.2));
      yard.gateRight.rotation.y = -open * 1.15;
      yard.gateLeft.rotation.y = open * 1.05;
      move(
        camera,
        { pos: [0.55, 1.72, 0.4], look: [-0.2, 1.35, -6.0], fov: 40 },
        { pos: [0.1, 1.5, -4.2], look: [-0.2, 1.28, -8.6], fov: 34 },
        localTime / 9,
        easeOut,
      );
      handheld(camera, time, 0.7);
    },
  });

  // 收藏室 · 见面
  add({
    id: "c1-room",
    start: T.c1[0],
    end: T.c1[1],
    enter: ({ context }) => {
      yardIn(context);
      const { cast } = context;
      place(cast.zhang, 0.16, 0, 1.25, Math.PI + 0.1);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, yard } = context;
      const step = clamp01(localTime / 3.2);
      cast.zhang.root.position.z = lerp(1.25, 0.16, smoothstep(step));
      applyPose(
        cast.zhang,
        step < 0.94 ? walk(time, 0.62) : lerpPose(walk(time, 0.62), stand(time), clamp01((localTime - 3.0) / 1.4)),
      );
      applyPose(cast.collector, talk(time, localTime < 4 ? 1.1 : 0.55, 0.6));
      cast.collector.root.rotation.y = 0.04 + Math.sin(time * 0.4) * 0.06;
      // 茶端上来
      const tea = localTime > 7.4;
      yard.teacups.forEach((cup) => { cup.visible = tea; });
      // 从门口的高处慢慢落到桌面高度，把整间屋子交代掉
      move(
        camera,
        { pos: [2.5, 2.05, 2.5], look: [0.05, 1.2, -1.6], fov: 46 },
        { pos: [1.86, 1.72, 1.62], look: [0.02, 1.32, -1.9], fov: 40 },
        localTime / 11,
      );
      handheld(camera, time, 0.55);
    },
  });

  // 「您是军人吧」
  add({
    id: "c2-soldier",
    start: T.c2[0],
    end: T.c2[1],
    enter: ({ context }) => {
      yardIn(context);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, yard } = context;
      yard.teacups.forEach((cup) => { cup.visible = true; });
      applyPose(cast.collector, lerpPose(talk(time, 0.9, 0.2), reach(time, 0.9, 0.35), smoothstep(segmentProgress(localTime, 0.4, 2.2)) * (localTime < 3.6 ? 1 : 0)));
      applyPose(cast.zhang, stand(time, 1.4));
      cast.zhang.joints.neck.rotation.y = Math.sin(time * 0.4) * 0.05 - 0.04;
      // 两次反打：先越过章北海的肩看收藏者，再切到章北海不说话的脸
      if (localTime < 5.6) {
        move(
          camera,
          { pos: [1.52, 1.66, 2.28], look: [0.02, 1.48, -2.12], fov: 26 },
          { pos: [1.4, 1.65, 2.02], look: [0.02, 1.47, -2.12], fov: 23 },
          localTime / 5.6,
        );
      } else {
        move(
          camera,
          { pos: [-0.42, 1.64, -2.98], look: [0.16, 1.54, 0.16], fov: 28 },
          { pos: [-0.38, 1.63, -2.84], look: [0.16, 1.53, 0.16], fov: 25 },
          (localTime - 5.6) / 4.4,
        );
      }
      handheld(camera, time, 0.5);
    },
  });

  // 南极 · 保险柜
  add({
    id: "c3-antarctic",
    start: T.c3[0],
    end: T.c3[1],
    enter: ({ context }) => {
      yardIn(context);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, yard } = context;
      yard.teacups.forEach((cup) => { cup.visible = true; });
      applyPose(cast.zhang, stand(time, 1.4));
      applyPose(cast.collector, talk(time, 1.25, 1.1));
      // 保险柜打开，镇宅之宝在冷光里
      const open = smoothstep(segmentProgress(localTime, 4.6, 6.4));
      yard.safeDoor.rotation.y = -open * 1.9;
      if (localTime < 4.4) {
        move(
          camera,
          { pos: [0.42, 1.62, -0.42], look: [0.03, 1.48, -2.12], fov: 30 },
          { pos: [0.36, 1.61, -0.58], look: [0.03, 1.48, -2.12], fov: 28 },
          localTime / 4.4,
        );
      } else if (localTime < 8.0) {
        // 摇到墙角的保险柜
        move(
          camera,
          { pos: [1.28, 1.44, 0.28], look: [2.32, 0.98, 0.62], fov: 34 },
          { pos: [1.58, 1.18, 0.5], look: [2.44, 0.78, 0.86], fov: 26 },
          (localTime - 4.4) / 3.6,
          easeOut,
        );
      } else {
        // 保险柜里的镇宅之宝：一块指甲盖大的火星陨石
        move(
          camera,
          { pos: [1.94, 0.94, 1.06], look: [2.5, 0.66, 0.9], fov: 22 },
          { pos: [2.06, 0.8, 0.96], look: [2.5, 0.64, 0.9], fov: 16 },
          (localTime - 8.0) / 3.0,
        );
      }
      handheld(camera, time, 0.6);
    },
  });

  // 茶杯里盛的也是陨石
  add({
    id: "c4-teacup",
    start: T.c4[0],
    end: T.c4[1],
    enter: ({ context }) => {
      yardIn(context);
      context.yard.safeDoor.rotation.y = -1.9;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, yard } = context;
      const lifted = localTime > 3.4 && localTime < 8.6;
      yard.teacups[1]!.visible = !lifted;
      yard.teacups[0]!.visible = true;
      cast.props.teacup.visible = lifted;
      applyPose(
        cast.zhang,
        lifted
          ? lerpPose(stand(time, 1.4), handsFront(time, 1.24, 0.2), smoothstep(segmentProgress(localTime, 3.4, 4.4)))
          : stand(time, 1.4),
      );
      applyPose(
        cast.collector,
        localTime < 7.4 ? stand(time, 0.3) : talk(time, 1.5, 2.2),
      );
      if (localTime < 4.2) {
        move(
          camera,
          { pos: [-0.46, 1.62, -2.86], look: [0.16, 1.54, 0.16], fov: 27 },
          { pos: [-0.42, 1.6, -2.7], look: [0.16, 1.53, 0.16], fov: 24 },
          localTime / 4.2,
        );
      } else if (localTime < 7.6) {
        // 举起来的茶杯，特写
        move(
          camera,
          { pos: [-0.28, 1.5, -1.42], look: [0.2, 1.4, -0.2], fov: 24 },
          { pos: [-0.2, 1.46, -1.2], look: [0.2, 1.39, -0.2], fov: 19 },
          (localTime - 4.2) / 3.4,
        );
      } else {
        move(
          camera,
          { pos: [0.44, 1.62, -0.34], look: [0.03, 1.48, -2.12], fov: 30 },
          { pos: [0.4, 1.61, -0.46], look: [0.03, 1.48, -2.12], fov: 27 },
          (localTime - 7.6) / 2.4,
        );
      }
      handheld(camera, time, 0.55);
    },
  });

  // 需求 →「要雕刻是吧」
  add({
    id: "c5-order",
    start: T.c5[0],
    end: T.c5[1],
    enter: ({ context }) => {
      yardIn(context);
      context.yard.safeDoor.rotation.y = -1.9;
      context.yard.teacups.forEach((cup) => { cup.visible = true; });
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast } = context;
      applyPose(cast.collector, talk(time, localTime > 7.2 ? 1.4 : 0.8, 0.9));
      // 报要求时他微微前倾，两只手第一次抬起来
      const listing = smoothstep(segmentProgress(localTime, 3.0, 4.2)) * (1 - smoothstep(segmentProgress(localTime, 7.2, 8.4)));
      applyPose(cast.zhang, lerpPose(stand(time, 1.4), handsFront(time, 0.72, 0.34), listing * 0.8));
      if (localTime < 3.0) {
        move(
          camera,
          { pos: [0.4, 1.61, -0.46], look: [0.03, 1.48, -2.12], fov: 27 },
          { pos: [0.38, 1.61, -0.56], look: [0.03, 1.48, -2.12], fov: 26 },
          localTime / 3.0,
        );
      } else if (localTime < 7.4) {
        // 章北海的正面。全片他说话最长的一次，机器一动不动。
        move(
          camera,
          { pos: [-0.22, 1.62, -1.98], look: [0.16, 1.54, 0.16], fov: 28 },
          { pos: [-0.18, 1.61, -1.8], look: [0.16, 1.54, 0.16], fov: 25 },
          (localTime - 3.0) / 4.4,
        );
      } else {
        // 收藏者接话：「要雕刻是吧」。他笑着，一无所知。
        move(
          camera,
          { pos: [0.3, 1.62, -0.72], look: [0.03, 1.49, -2.12], fov: 26 },
          { pos: [0.26, 1.61, -0.86], look: [0.03, 1.49, -2.12], fov: 23 },
          (localTime - 7.4) / 4.6,
        );
      }
      handheld(camera, time, 0.5);
    },
  });

  // 三块铁陨石 · 报价
  add({
    id: "c6-iron",
    start: T.c6[0],
    end: T.c6[1],
    enter: ({ context }) => {
      yardIn(context);
      context.yard.safeDoor.rotation.y = -1.9;
      context.yard.teacups.forEach((cup) => { cup.visible = true; });
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, yard } = context;
      // 三块石头一块一块被放到台面上
      yard.tableStones.forEach((stone, index) => {
        stone.visible = localTime > 3.4 + index * 0.7;
        stone.position.y = 1.02 + Math.max(0, 0.16 - (localTime - (3.4 + index * 0.7)) * 0.4);
      });
      applyPose(cast.collector, lerpPose(talk(time, 1.2, 1.7), reach(time, 1.15, -0.3), smoothstep(segmentProgress(localTime, 2.6, 4.0)) * (localTime < 6 ? 1 : 0.2)));
      applyPose(cast.zhang, stand(time, 1.4));
      if (localTime < 6.2) {
        // 俯拍台面：三块石头、放大镜、两只茶杯
        move(
          camera,
          { pos: [0.36, 1.78, 0.16], look: [0.1, 0.94, -1.06], fov: 34 },
          { pos: [0.22, 1.52, -0.16], look: [0.08, 0.93, -1.1], fov: 26 },
          localTime / 6.2,
          easeOut,
        );
      } else {
        move(
          camera,
          { pos: [0.34, 1.62, -0.6], look: [0.03, 1.49, -2.12], fov: 27 },
          { pos: [0.3, 1.61, -0.72], look: [0.03, 1.49, -2.12], fov: 24 },
          (localTime - 6.2) / 3.8,
        );
      }
      handheld(camera, time, 0.5);
    },
  });

  // 付款 ·「对要送的人的尊重」
  add({
    id: "c7-respect",
    start: T.c7[0],
    end: T.c7[1],
    enter: ({ context }) => {
      yardIn(context);
      context.yard.safeDoor.rotation.y = -1.9;
      context.yard.teacups.forEach((cup) => { cup.visible = true; });
      context.yard.tableStones.forEach((stone) => {
        stone.visible = true;
        stone.position.y = 1.02;
      });
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast } = context;
      const paying = localTime < 4.0;
      cast.props.phone.visible = paying;
      applyPose(
        cast.zhang,
        paying
          ? handsFront(time, 1.06, 0.22)
          : lerpPose(handsFront(time, 1.06, 0.22), stand(time, 1.4), smoothstep(segmentProgress(localTime, 4.0, 5.2))),
      );
      applyPose(
        cast.collector,
        localTime < 3.2
          ? talk(time, 1.0, 2.6)
          : lerpPose(talk(time, 1.0, 2.6), stand(time, 0.8), smoothstep(segmentProgress(localTime, 3.2, 4.6))),
      );
      if (localTime < 3.4) {
        // 手机。付款只用三秒钟。
        move(
          camera,
          { pos: [-0.24, 1.46, -0.98], look: [0.2, 1.28, -0.1], fov: 26 },
          { pos: [-0.18, 1.44, -0.86], look: [0.2, 1.27, -0.1], fov: 22 },
          localTime / 3.4,
        );
      } else if (localTime < 6.4) {
        // 收藏者尴尬地笑
        move(
          camera,
          { pos: [0.26, 1.62, -0.82], look: [0.03, 1.49, -2.12], fov: 25 },
          { pos: [0.22, 1.61, -0.94], look: [0.03, 1.49, -2.12], fov: 23 },
          (localTime - 3.4) / 3.0,
        );
      } else {
        // 最后一句。极慢地推到章北海脸上，然后停在那里不动。
        move(
          camera,
          { pos: [-0.18, 1.62, -2.32], look: [0.16, 1.55, 0.16], fov: 26 },
          { pos: [-0.08, 1.61, -1.64], look: [0.16, 1.55, 0.16], fov: 19 },
          (localTime - 6.4) / 4.6,
          easeIn,
        );
      }
      handheld(camera, time, 0.42);
    },
  });

  // ══ 增援未来 ════════════════════════════════════════════════════════
  add({
    id: "m0-elevator",
    start: T.m0[0],
    end: T.m0[1],
    enter: ({ context }) => {
      setWorld(context, "space");
      const { space, cast } = context;
      cast.zhang.root.visible = false;
      cast.collector.root.visible = false;
      space.stage.visible = false;
      space.bulletCloseup.visible = false;
      space.distantCrowd.visible = false;
      space.bullets.visible = false;
      space.earth.visible = true;
      space.nightLights.visible = true;
      space.atmosphere.visible = true;
      space.wheel.visible = true;
      space.shipyard.visible = true;
      space.baseOne.visible = true;
      space.elevator.visible = true;
      space.debris.group.visible = true;
      setSun(space, -4);
    },
    update: ({ context, localTime, time }) => {
      const { camera, space } = context;
      space.debris.tumble(time);
      space.wheel.rotation.z = 0.12 + time * 0.012;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -4 - localTime * 0.16);
      if (localTime < 5.4) {
        // 电梯：从地球边缘一路升上来
        move(
          camera,
          { pos: [64, -96, 26], look: [-4, -34, -142], fov: 40 },
          { pos: [46, -34, 8], look: [-6, 6, -168], fov: 36 },
          localTime / 5.4,
          easeOut,
        );
      } else if (localTime < 10.2) {
        // 黄河站：目前太空中规模最大的人造物体
        move(
          camera,
          { pos: [58, 30, -78], look: [-6, 10, -186], fov: 34 },
          { pos: [30, 20, -104], look: [-6, 10, -186], fov: 32 },
          (localTime - 5.4) / 4.8,
        );
      } else {
        // 船坞：只有一副骨骼
        move(
          camera,
          { pos: [-238, -18, -32], look: [-420, -70, -190], fov: 38 },
          { pos: [-282, -32, -58], look: [-420, -70, -190], fov: 33 },
          (localTime - 10.2) / 4.8,
        );
      }
      drift(camera, time, 0.4);
    },
  });

  // ══ 车间 ════════════════════════════════════════════════════════════
  const shopIn = (context: Ctx): void => {
    setWorld(context, "shop");
    const { cast } = context;
    cast.collector.root.visible = false;
    cast.zhang.setClothes(cast.costumes.uniform);
    cast.zhang.anchors.back.children.forEach((child) => { child.visible = false; });
    Object.values(cast.props).forEach((prop) => { prop.visible = false; });
    place(cast.zhang, 0.62, 0, 0.6, Math.PI - 0.5);
  };

  add({
    id: "w0-shop",
    start: T.w0[0],
    end: T.w0[1],
    enter: ({ context }) => {
      shopIn(context);
      context.shop.slugs.visible = false;
      context.shop.sparks.visible = false;
      context.shop.billet.visible = true;
      context.shop.billet.scale.setScalar(1);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, shop } = context;
      // 灯一排一排亮起来
      shop.ceilingLights.forEach((light, index) => {
        const on = smoothstep(segmentProgress(localTime, 0.5 + index * 0.22, 0.9 + index * 0.22));
        const flicker = on > 0.5 && localTime < 2.6 ? (Math.sin(localTime * 47 + index) > -0.2 ? 1 : 0.25) : 1;
        light.intensity = 46 * on * flicker;
        (shop.ceilingPanels[index]!.material as THREE.MeshBasicMaterial).opacity = on * flicker;
        shop.ceilingPanels[index]!.visible = on > 0.02;
      });
      const walking = localTime > 1.4 && localTime < 6.0;
      const wp = clamp01((localTime - 1.4) / 4.6);
      cast.zhang.root.position.set(lerp(2.9, 0.58, smoothstep(wp)), 0, lerp(2.4, 0.72, smoothstep(wp)));
      cast.zhang.root.rotation.y = lerp(Math.PI + 0.6, Math.PI - 0.42, smoothstep(wp));
      applyPose(
        cast.zhang,
        walking
          ? walk(time, 0.7)
          : localTime <= 1.4
            ? stand(time, 0.4)
            : lerpPose(walk(time, 0.7), reach(time, 0.95, -0.5), smoothstep(segmentProgress(localTime, 6.0, 7.4))),
      );
      // 机床起转
      const spin = smoothstep(segmentProgress(localTime, 8.2, 11.5));
      shop.chuck.rotation.x = -(localTime > 8.2 ? (localTime - 8.2) * (localTime - 8.2) * 0.6 : 0);
      (shop.screen.material as THREE.MeshBasicMaterial).opacity = 0.55 + spin * 0.4;
      if (localTime < 5.4) {
        move(
          camera,
          { pos: [6.6, 2.9, 7.4], look: [0.5, 1.2, -1.0], fov: 44 },
          { pos: [4.3, 2.25, 4.5], look: [0.4, 1.15, -1.1], fov: 40 },
          localTime / 5.4,
        );
      } else if (localTime < 9.2) {
        move(
          camera,
          { pos: [3.7, 1.78, 2.75], look: [0.35, 1.24, -0.45], fov: 32 },
          { pos: [3.2, 1.68, 2.2], look: [0.32, 1.22, -0.55], fov: 29 },
          (localTime - 5.4) / 3.8,
        );
      } else {
        // 卡盘特写：那块石头开始转
        move(
          camera,
          { pos: [1.15, 1.8, 0.32], look: [-0.42, 1.36, -1.4], fov: 26 },
          { pos: [0.98, 1.68, 0.08], look: [-0.42, 1.36, -1.4], fov: 21 },
          (localTime - 9.2) / 3.8,
        );
      }
      handheld(camera, time, 0.35);
    },
  });

  add({
    id: "w1-cut",
    start: T.w1[0],
    end: T.w1[1],
    enter: ({ context }) => {
      shopIn(context);
      context.shop.slugs.visible = false;
      context.shop.sparks.visible = true;
      context.shop.billet.visible = true;
      place(context.cast.zhang, 0.58, 0, 0.72, Math.PI - 0.42);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, shop } = context;
      shop.ceilingLights.forEach((light, i) => {
        light.intensity = 46;
        (shop.ceilingPanels[i]!.material as THREE.MeshBasicMaterial).opacity = 1;
        shop.ceilingPanels[i]!.visible = true;
      });
      applyPose(cast.zhang, lerpPose(reach(time, 0.95, -0.5), workBench(time, 0.5), 0.4 + Math.sin(time * 0.7) * 0.1));
      // 转、走刀、进给
      shop.chuck.rotation.x = -localTime * 16;
      const pass = (localTime % 2.2) / 2.2;
      shop.toolPost.position.z = lerp(-0.68, 0.16, pass);
      shop.toolPost.position.x = 0.1 - Math.floor(localTime / 2.2) * 0.012;
      // 工件一段段变短
      const consumed = clamp01(localTime / 11.5);
      shop.billet.scale.setScalar(1 - consumed * 0.62);
      // 切屑
      const sparkBurst = pass > 0.06 && pass < 0.92;
      shop.sparks.visible = sparkBurst;
      if (sparkBurst) {
        pointsFrom(shop.sparks, 160, (index, seed, out) => {
          const life = (localTime * 2.6 + seed[0]! * 3) % 1;
          const spread = life * (0.16 + seed[1]! * 0.3);
          out.set(
            0.34 + (seed[2]! - 0.5) * 0.04,
            1.36 + Math.sin(seed[0]! * 9.1) * spread - life * life * 0.5,
            lerp(-0.68, 0.16, pass) + Math.cos(seed[1]! * 7.3) * spread,
          );
          void index;
        });
        (shop.sparks.material as THREE.PointsMaterial).opacity = 0.9;
      }
      // 切完之后，三十六段摆出来
      shop.slugs.visible = localTime > 9.6;
      if (localTime < 4.6) {
        // 刀尖
        move(
          camera,
          { pos: [0.86, 1.58, -0.58], look: [0.16, 1.32, -1.7], fov: 22 },
          { pos: [0.74, 1.5, -0.76], look: [0.16, 1.32, -1.7], fov: 18 },
          localTime / 4.6,
        );
      } else if (localTime < 9.2) {
        // 他的脸，被机床的绿屏映着
        move(
          camera,
          { pos: [-0.95, 1.74, -0.9], look: [0.58, 1.55, 0.72], fov: 30 },
          { pos: [-0.78, 1.72, -0.64], look: [0.58, 1.54, 0.72], fov: 26 },
          (localTime - 4.6) / 4.6,
        );
      } else {
        // 三十六段
        move(
          camera,
          { pos: [-3.48, 1.96, 2.12], look: [-3.6, 1.14, 0.86], fov: 26 },
          { pos: [-3.62, 1.6, 1.66], look: [-3.62, 1.12, 0.84], fov: 21 },
          (localTime - 9.2) / 3.8,
          easeOut,
        );
      }
      handheld(camera, time, 0.3);
    },
    leave: ({ context }) => {
      context.shop.sparks.visible = false;
    },
  });

  add({
    id: "w2-erase",
    start: T.w2[0],
    end: T.w2[1],
    enter: ({ context }) => {
      shopIn(context);
      context.shop.slugs.visible = true;
      context.shop.sparks.visible = false;
      context.shop.billet.visible = false;
      place(context.cast.zhang, 0.5, 0, 0.9, Math.PI - 0.3);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, shop } = context;
      shop.chuck.rotation.x = -133 * 16;
      // 收碎屑、拆刀具、熄灯
      const sweeping = localTime < 3.2;
      const removing = localTime >= 3.2 && localTime < 5.6;
      applyPose(
        cast.zhang,
        sweeping ? workBench(time, 1.1) : removing ? workBench(time, 0.55) : stand(time, 0.9),
      );
      shop.cutter.visible = localTime < 4.6;
      const off = segmentProgress(localTime, 6.4, 7.4);
      shop.ceilingLights.forEach((light, index) => {
        const alive = clamp01(1 - segmentProgress(localTime, 6.4 + index * 0.16, 6.9 + index * 0.16));
        light.intensity = 46 * alive;
        (shop.ceilingPanels[index]!.material as THREE.MeshBasicMaterial).opacity = alive;
        shop.ceilingPanels[index]!.visible = alive > 0.02;
      });
      (shop.screen.material as THREE.MeshBasicMaterial).opacity = 0.95 * (1 - off);
      if (localTime < 5.6) {
        move(
          camera,
          { pos: [2.95, 1.66, 2.35], look: [0.5, 1.2, 0.6], fov: 32 },
          { pos: [2.6, 1.52, 1.95], look: [0.5, 1.18, 0.62], fov: 28 },
          localTime / 5.6,
        );
      } else {
        // 空车间。灯灭，人走。
        move(
          camera,
          { pos: [4.6, 2.4, 5.6], look: [0.2, 1.1, -1.0], fov: 42 },
          { pos: [5.2, 2.5, 6.6], look: [0.2, 1.1, -1.0], fov: 44 },
          (localTime - 5.6) / 3.4,
        );
        const leaving = clamp01((localTime - 5.6) / 3.4);
        cast.zhang.root.position.set(lerp(0.5, 3.4, leaving), 0, lerp(0.9, 4.2, leaving));
        cast.zhang.root.rotation.y = 0.72;
        applyPose(cast.zhang, walk(time, 0.72));
      }
      handheld(camera, time, 0.3);
    },
  });

  // ══ 地下室 ══════════════════════════════════════════════════════════
  const cellarIn = (context: Ctx): void => {
    setWorld(context, "cellar");
    const { cast, cellar } = context;
    cast.collector.root.visible = false;
    cast.zhang.setClothes(cast.costumes.uniform);
    cast.zhang.anchors.back.children.forEach((child) => { child.visible = false; });
    Object.values(cast.props).forEach((prop) => { prop.visible = false; });
    place(cast.zhang, 0.1, 0, 0.06, Math.PI);
    cellar.rounds.visible = true;
    cellar.flashLight.intensity = 0;
    cellar.flashQuad.visible = false;
    cellar.gravel.visible = false;
    cellar.fabric.visible = false;
    cellar.bundleOpen.visible = false;
    cellar.smoke.visible = false;
    context.screen.setFlash(0);
  };

  add({
    id: "b0-pliers",
    start: T.b0[0],
    end: T.b0[1],
    enter: ({ context }) => {
      cellarIn(context);
      context.cellar.rounds.children.forEach((round, index) => {
        round.visible = true;
        (round as THREE.Mesh).geometry = (context.cellar.rounds.children[0] as THREE.Mesh).geometry;
        void index;
      });
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, cellar } = context;
      // 灯泡在轻轻晃 —— 他刚碰过它
      cellar.bulb.rotation.z = Math.sin(time * 1.35) * 0.045 * Math.exp(-localTime * 0.18);
      cellar.bulb.rotation.x = Math.cos(time * 1.12) * 0.03 * Math.exp(-localTime * 0.18);
      applyPose(cast.zhang, workBench(time, localTime > 6 ? 1.3 : 0.6));
      if (localTime < 4.2) {
        // 门关上，一个人，一只灯泡
        move(
          camera,
          { pos: [2.55, 2.05, 2.2], look: [-0.4, 1.05, -1.1], fov: 46 },
          { pos: [2.05, 1.9, 1.75], look: [-0.35, 1.02, -1.1], fov: 42 },
          localTime / 4.2,
          easeOut,
        );
      } else if (localTime < 8.4) {
        // 桌面：三十六发子弹排成三行。机位在桌子对面，人在桌子后面。
        move(
          camera,
          { pos: [0.12, 1.72, -2.15], look: [0.05, 0.96, -0.95], fov: 32 },
          { pos: [0.08, 1.55, -1.98], look: [0.05, 0.94, -0.95], fov: 25 },
          (localTime - 4.2) / 4.2,
        );
      } else {
        // 钳子。一颗一颗把弹头拧下来。
        move(
          camera,
          { pos: [-0.62, 1.42, -1.95], look: [-0.12, 0.98, -0.9], fov: 24 },
          { pos: [-0.55, 1.36, -1.85], look: [-0.12, 0.97, -0.9], fov: 19 },
          (localTime - 8.4) / 4.6,
        );
      }
      handheld(camera, time, 0.45);
    },
  });

  add({
    id: "b1-glue",
    start: T.b1[0],
    end: T.b1[1],
    enter: ({ context }) => {
      cellarIn(context);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, cellar } = context;
      cellar.bulb.rotation.z = Math.sin(time * 1.35) * 0.012;
      applyPose(cast.zhang, workBench(time, 1.15));
      // 弹头一颗颗换成陨石段
      cellar.rounds.children.forEach((round, index) => {
        round.visible = true;
        round.rotation.y = index * 0.4;
      });
      if (localTime < 5.4) {
        move(
          camera,
          { pos: [0.62, 1.36, -1.92], look: [0.16, 0.98, -0.88], fov: 22 },
          { pos: [0.56, 1.3, -1.82], look: [0.16, 0.97, -0.88], fov: 18 },
          localTime / 5.4,
        );
      } else if (localTime < 8.4) {
        // 他的脸。没有表情，只有专注。
        move(
          camera,
          { pos: [0.14, 1.58, -1.62], look: [0.1, 1.5, 0.06], fov: 30 },
          { pos: [0.12, 1.56, -1.45], look: [0.1, 1.49, 0.06], fov: 26 },
          (localTime - 5.4) / 3.0,
        );
      } else {
        // 三十六颗，排得整整齐齐
        move(
          camera,
          { pos: [0.06, 1.82, -2.05], look: [0.05, 0.94, -0.95], fov: 32 },
          { pos: [0.05, 1.58, -1.9], look: [0.05, 0.93, -0.95], fov: 24 },
          (localTime - 8.4) / 2.6,
          easeOut,
        );
      }
      handheld(camera, time, 0.4);
    },
  });

  // 试射
  const SHOT_TIMES = [183.4, 184.2, 185.0, 185.8];
  add({
    id: "b2-testfire",
    start: T.b2[0],
    end: T.b2[1],
    enter: ({ context }) => {
      cellarIn(context);
      // 转过身，对着墙角的布包
      place(context.cast.zhang, 0.55, 0, -0.35, -2.28);
      context.cast.props.pistol.visible = false;
    },
    update: ({ context, localTime, time, progress }) => {
      const { camera, cast, cellar, screen } = context;
      const armed = localTime > 2.2;
      cast.props.pistol.visible = armed;
      cast.props.magazine.visible = localTime > 0.4 && localTime < 3.0;
      const aiming = localTime > 3.4;
      applyPose(
        cast.zhang,
        aiming
          ? {
              hips: [0, -0.12, 0],
              neck: [0.04, -0.14, 0],
              armR: [-1.62, -0.1, 0.12],
              armL: [-1.5, 0.06, -0.28],
              legR: [0, 0, 0.02],
              legL: [0, 0, -0.02],
              lift: Math.sin(time * 1.4) * 0.03,
            }
          : lerpPose(workBench(time, 0.9), handsFront(time, 1.0, 0.2), smoothstep(localTime / 2.4)),
      );
      // 四发。每一发都把整个房间照亮一次。
      let flash = 0;
      let recoil = 0;
      SHOT_TIMES.forEach((t, index) => {
        const dt = time - t;
        if (dt >= 0 && dt < 0.42) {
          flash = Math.max(flash, Math.exp(-dt * 34));
          recoil = Math.max(recoil, Math.exp(-dt * 12));
          const hole = cellar.holes.children[index];
          if (hole) hole.visible = true;
        }
        if (time >= t) {
          const hole = cellar.holes.children[index];
          if (hole) hole.visible = true;
        }
      });
      if (time < SHOT_TIMES[0]!) {
        cellar.holes.children.forEach((hole) => { hole.visible = false; });
      }
      cellar.flashLight.intensity = flash * 120;
      cellar.flashLight.position.set(0.05, 1.3, -0.85);
      cellar.flashQuad.visible = flash > 0.05;
      cellar.flashQuad.position.set(0.05, 1.3, -0.9);
      cellar.flashQuad.scale.setScalar(0.6 + flash * 1.5);
      (cellar.flashQuad.material as THREE.MeshBasicMaterial).opacity = flash;
      screen.setFlash(flash * 0.42, "#ffe9c8");
      // 硝烟
      const smokeAmount = clamp01((time - SHOT_TIMES[0]!) / 1.4) * (1 - clamp01((time - SHOT_TIMES[3]! - 0.5) / 5));
      cellar.smoke.visible = smokeAmount > 0.02;
      if (cellar.smoke.visible) {
        const age = Math.max(0, time - SHOT_TIMES[0]!);
        pointsFrom(cellar.smoke, 90, (index, seed, out) => {
          const life = (age * 0.35 + seed[0]!) % 1;
          out.set(
            0.05 + (seed[1]! - 0.5) * 0.5 * (0.3 + life),
            1.28 + life * 0.6 + (seed[2]! - 0.5) * 0.2,
            -0.9 - life * 0.9 + (seed[0]! - 0.5) * 0.3,
          );
          void index;
        });
        (cellar.smoke.material as THREE.PointsMaterial).opacity = smokeAmount * 0.34;
      }
      // 灯泡被枪声震得晃起来
      const shake = SHOT_TIMES.reduce((acc, t) => acc + (time > t ? Math.exp(-(time - t) * 1.2) : 0), 0);
      cellar.bulb.rotation.z = Math.sin(time * 6.2) * 0.06 * shake;
      cellar.bulb.rotation.x = Math.cos(time * 5.1) * 0.05 * shake;

      if (localTime < 3.6) {
        // 装弹
        move(
          camera,
          { pos: [1.62, 1.5, 0.86], look: [0.62, 1.14, -0.05], fov: 26 },
          { pos: [1.5, 1.44, 0.72], look: [0.62, 1.13, -0.05], fov: 22 },
          localTime / 3.6,
        );
      } else if (localTime < 7.4) {
        // 侧面：人、枪、墙角的布包，全在一格里
        move(
          camera,
          { pos: [2.55, 1.62, 0.55], look: [-0.9, 1.1, -1.3], fov: 44 },
          { pos: [2.35, 1.58, 0.35], look: [-1.0, 1.06, -1.45], fov: 42 },
          (localTime - 3.6) / 3.8,
        );
        camera.position.x += recoil * 0.03;
      } else {
        // 布包上的弹洞
        move(
          camera,
          { pos: [-0.65, 1.35, -0.35], look: [-2.3, 0.5, -1.95], fov: 30 },
          { pos: [-0.95, 1.15, -0.68], look: [-2.3, 0.48, -1.98], fov: 24 },
          (localTime - 7.4) / 3.6,
          easeOut,
        );
      }
      handheld(camera, time, 0.5 + recoil * 3.4);
      void progress;
    },
    leave: ({ context }) => {
      context.screen.setFlash(0);
      context.cellar.flashLight.intensity = 0;
      context.cellar.flashQuad.visible = false;
      context.cellar.smoke.visible = false;
    },
  });

  add({
    id: "b3-reveal",
    start: T.b3[0],
    end: T.b3[1],
    enter: ({ context }) => {
      cellarIn(context);
      place(context.cast.zhang, 0.05, 0, 0.06, Math.PI);
      context.cellar.holes.children.forEach((hole) => { hole.visible = true; });
      // 子弹已经收走了，桌上只剩要检查的东西
      context.cellar.rounds.visible = false;
      context.cellar.bundleOpen.visible = false;
      context.cellar.gravel.visible = false;
      context.cellar.fabric.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, cellar } = context;
      cellar.bulb.rotation.z = Math.sin(time * 1.35) * 0.02;
      cellar.bundle.visible = localTime < 2.4;
      cellar.bundleOpen.visible = localTime >= 2.0;
      cellar.gravel.visible = localTime > 5.4;
      cellar.gravel.position.set(0.34, 1.06, -0.62);
      cellar.fabric.visible = localTime > 8.6;
      applyPose(
        cast.zhang,
        localTime < 5.0
          ? workBench(time, 0.8)
          : localTime < 8.4
            ? handsFront(time, 1.18, 0.1)
            : workBench(time, 0.35),
      );
      if (localTime < 4.8) {
        // 割开布包，牛肉
        move(
          camera,
          { pos: [-0.55, 1.55, -2.15], look: [-0.28, 0.98, -0.98], fov: 30 },
          { pos: [-0.48, 1.42, -2.0], look: [-0.28, 0.96, -0.98], fov: 23 },
          localTime / 4.8,
        );
      } else if (localTime < 8.4) {
        // 掌心里的一小堆碎石
        move(
          camera,
          { pos: [0.68, 1.36, -1.5], look: [0.36, 1.06, -0.62], fov: 24 },
          { pos: [0.6, 1.28, -1.34], look: [0.36, 1.05, -0.62], fov: 16 },
          (localTime - 4.8) / 3.6,
          easeOut,
        );
      } else {
        // 揭示：那块布是航天服材料，夹层里是保温海绵和塑胶管道
        move(
          camera,
          { pos: [0.62, 1.5, -1.72], look: [0.42, 0.9, -0.84], fov: 30 },
          { pos: [0.52, 1.28, -1.55], look: [0.42, 0.89, -0.84], fov: 20 },
          (localTime - 8.4) / 4.6,
          easeOut,
        );
      }
      handheld(camera, time, 0.4);
    },
  });

  // ══ 太空 ════════════════════════════════════════════════════════════
  const spaceIn = (context: Ctx, elevation: number): void => {
    setWorld(context, "space");
    const { space, cast } = context;
    cast.collector.root.visible = false;
    cast.zhang.setClothes(cast.costumes.suit);
    cast.zhang.anchors.back.children.forEach((child) => { child.visible = true; });
    Object.values(cast.props).forEach((prop) => { prop.visible = false; });
    space.earth.visible = true;
    space.nightLights.visible = true;
    space.atmosphere.visible = true;
    space.wheel.visible = true;
    space.shipyard.visible = true;
    space.baseOne.visible = true;
    space.elevator.visible = true;
    space.debris.group.visible = true;
    space.bulletCloseup.visible = false;
    space.bullets.visible = false;
    space.stage.visible = false;
    setSun(space, elevation);
  };

  // 一号基地 · 留下定位单元
  add({
    id: "s0-base",
    start: T.s0[0],
    end: T.s0[1],
    enter: ({ context }) => {
      spaceIn(context, -7.2);
      place(context.cast.zhang, 148.4, 26.6, 98.6, -0.9);
      context.space.distantCrowd.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space } = context;
      space.debris.tumble(time);
      space.stars.rotation.y = time * 0.004;
      applyPose(cast.zhang, weightless(time * 0.7, 5));
      cast.zhang.root.rotation.set(0.2, -0.9 + Math.sin(time * 0.2) * 0.1, 0.14);
      if (localTime < 5.4) {
        // 一号基地：规模只有黄河站的五分之一
        move(
          camera,
          { pos: [176, 44, 132], look: [150, 26, 96], fov: 34 },
          { pos: [162, 34, 116], look: [150, 26, 96], fov: 30 },
          localTime / 5.4,
          easeOut,
        );
      } else {
        // 他离开基地。定位单元留在了舱室里。
        const out = clamp01((localTime - 5.4) / 5.6);
        cast.zhang.root.position.set(
          lerp(148.4, 128, easeOut(out)),
          lerp(26.6, 22.4, easeOut(out)),
          lerp(98.6, 74, easeOut(out)),
        );
        move(
          camera,
          { pos: [156, 30, 108], look: [148, 26, 98], fov: 30 },
          { pos: [142, 26, 92], look: [130, 22.4, 76], fov: 34 },
          out,
        );
      }
      drift(camera, time, 0.25);
    },
  });

  // 太空全景
  add({
    id: "s1-vista",
    start: T.s1[0],
    end: T.s1[1],
    enter: ({ context }) => {
      spaceIn(context, -7.6);
      place(context.cast.zhang, 0, 0, 0, 2.6);
      context.space.distantCrowd.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, visor } = context;
      space.debris.tumble(time);
      space.wheel.rotation.z = 0.12 + time * 0.012;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -7.6 - localTime * 0.055);
      applyPose(cast.zhang, weightless(time * 0.5, 3));
      cast.zhang.root.rotation.y = 2.6 + Math.sin(time * 0.07) * 0.08;
      if (localTime < 5.6) {
        // 他自己的视点：隔着面罩，慢慢摇过整片工地
        cast.zhang.root.visible = false;
        visor.set(0.8);
        const pan = easeOut(localTime / 5.6);
        applyFraming(camera, {
          pos: [0, 1.55, 0],
          look: [lerp(150, -46, pan), lerp(34, 8, pan), lerp(-52, -190, pan)],
          fov: 46,
        });
      } else if (localTime < 10.6) {
        cast.zhang.root.visible = true;
        visor.set(0);
        // 船坞的骨骼
        move(
          camera,
          { pos: [-215, 4, -18], look: [-420, -70, -190], fov: 40 },
          { pos: [-262, -14, -48], look: [-420, -70, -190], fov: 34 },
          (localTime - 5.6) / 5.0,
        );
      } else {
        // 回到那个人：他在这一切的正中间，小得像一块垃圾
        cast.zhang.root.visible = true;
        visor.set(0);
        move(
          camera,
          { pos: [17, 9, 26], look: [0.2, 1.0, -2], fov: 40 },
          { pos: [6.5, 3.4, 11], look: [0.2, 1.0, -2], fov: 34 },
          (localTime - 10.6) / 4.4,
          easeOut,
        );
      }
      drift(camera, time, 0.35);
    },
  });

  // 悬浮 · 父亲
  add({
    id: "s2-float",
    start: T.s2[0],
    end: T.s2[1],
    enter: ({ context }) => {
      spaceIn(context, -8.6);
      place(context.cast.zhang, 0, 0, 0, 2.9);
      context.space.distantCrowd.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space } = context;
      space.debris.tumble(time);
      space.stars.rotation.y = time * 0.004;
      setSun(space, -8.6 - localTime * 0.055);
      applyPose(cast.zhang, weightless(time * 0.45, 7));
      cast.zhang.root.rotation.set(
        Math.sin(time * 0.06) * 0.1,
        2.9 + time * 0.014,
        Math.sin(time * 0.05 + 1) * 0.08,
      );
      if (localTime < 6.4) {
        // 绕着他转半圈：脚下没有大地，四周只有空间
        const a = localTime / 6.4;
        const angle = lerp(0.4, 2.2, smoothstep(a));
        applyFraming(camera, {
          pos: [Math.sin(angle) * 5.4, 1.6 + Math.sin(a * 2) * 0.5, Math.cos(angle) * 5.4],
          look: [0, 1.0, 0],
          fov: 36,
        });
      } else {
        // 他的背影，和整颗地球
        move(
          camera,
          { pos: [1.7, 2.6, 4.2], look: [0.1, 1.1, -1.4], fov: 34 },
          { pos: [1.1, 3.4, 6.6], look: [0.0, 0.4, -6.0], fov: 40 },
          (localTime - 6.4) / 7.6,
          easeOut,
        );
      }
      drift(camera, time, 0.2);
    },
  });

  // 日落 · 标志灯由红变绿
  add({
    id: "s3-sunset",
    start: T.s3[0],
    end: T.s3[1],
    enter: ({ context }) => {
      spaceIn(context, -9.6);
      place(context.cast.zhang, 0, 0, 0, 3.05);
      context.space.stage.visible = true;
      context.space.hatchDoor.visible = true;
      context.space.hatchDoor.position.set(0, 0, 0);
      context.space.crowdAnchor.visible = false;
      context.cast.props.looseScope.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, scope } = context;
      space.debris.tumble(time);
      space.stars.rotation.y = time * 0.004;
      setSun(space, -9.6 - localTime * 0.16);
      applyPose(cast.zhang, weightless(time * 0.45, 7));
      // 标志灯由红变绿
      const green = time > 249.6;
      (space.hatchLamp.material as THREE.MeshBasicMaterial).color.setHex(green ? 0x46e07a : 0xff3b2f);
      space.hatchLamp.scale.setScalar(1 + (green ? 0.3 : 0) * (0.6 + 0.4 * Math.sin(time * 9)));

      if (localTime < 5.4) {
        // 太阳开始接触地球的边缘：它成了地球上一个光芒四射的戒指
        move(
          camera,
          { pos: [5.0, 3.4, 8.6], look: [-42, -33, -180], fov: 40 },
          { pos: [2.7, 2.0, 5.2], look: [-46, -36, -196], fov: 29 },
          localTime / 5.4,
          easeOut,
        );
        scope.set(0);
      } else {
        // 举起瞄准镜当望远镜看闸门
        const into = smoothstep(segmentProgress(localTime, 5.4, 6.6));
        scope.set(into);
        const wobble = Math.sin(time * 0.7) * 0.5;
        applyFraming(camera, {
          pos: [STAGE_ORIGIN.x + wobble * 0.4, STAGE_ORIGIN.y + 2.4, STAGE_ORIGIN.z + 26],
          look: [STAGE_ORIGIN.x, STAGE_ORIGIN.y + 1.5, STAGE_ORIGIN.z - 23],
          fov: lerp(15, 11, (localTime - 5.4) / 6.6),
        });
        camera.rotateX(Math.sin(time * 0.53) * 0.004);
        camera.rotateY(Math.cos(time * 0.41) * 0.005);
      }
    },
    leave: ({ context }) => {
      context.scope.set(0);
    },
  });

  // 合影 · 面罩透明 · 锁定
  add({
    id: "s4-photo",
    start: T.s4[0],
    end: T.s4[1],
    enter: ({ context }) => {
      spaceIn(context, -11.6);
      place(context.cast.zhang, 0, 0, 0, 3.05);
      const { space, cast } = context;
      space.stage.visible = true;
      space.crowdAnchor.visible = true;
      space.hatchDoor.visible = true;
      cast.crowd.forEach((figure, index) => {
        figure.setClothes(cast.crowdVisor.mirror[index % cast.crowdVisor.mirror.length]!);
      });
      cast.photographer.setClothes(cast.crowdVisor.mirror[0]!);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, scope } = context;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -11.6 - localTime * 0.075);
      scope.set(1);

      // 闸门滑开
      const doorOpen = smoothstep(segmentProgress(localTime, 0.2, 1.6));
      space.hatchDoor.position.x = -doorOpen * 7.4;
      (space.hatchLamp.material as THREE.MeshBasicMaterial).color.setHex(0x46e07a);

      // 三十个人鱼贯而出，向外飞一段，然后在失重里排队
      cast.crowd.forEach((figure, index) => {
        const row = Math.floor(index / 7);
        const column = index % 7;
        const delay = 0.7 + index * 0.16;
        const out = smoothstep(clamp01((localTime - delay) / 3.6));
        const settled = smoothstep(clamp01((localTime - delay - 3.2) / 3.4));
        const targetX = (column - 3) * 1.42 + row * 0.2;
        const targetY = -row * 0.36 + 0.2;
        const targetZ = -row * 1.5;
        figure.root.position.set(
          lerp(0, targetX, out) + Math.sin(time * 0.5 + index) * 0.05 * (1 - settled * 0.7),
          lerp(1.2, targetY, out) + Math.sin(time * 0.42 + index * 1.7) * 0.06 * (1 - settled * 0.7),
          lerp(-12.4, targetZ, out),
        );
        figure.root.rotation.set(
          Math.sin(time * 0.3 + index) * 0.12 * (1 - settled * 0.85),
          Math.sin(time * 0.24 + index * 2.1) * 0.2 * (1 - settled * 0.9),
          Math.sin(time * 0.27 + index * 0.7) * 0.1 * (1 - settled * 0.9),
        );
        applyPose(figure, weightless(time * (0.5 + (index % 5) * 0.05), index * 1.7));
        // 面罩一个一个调成透明
        const clearAt = 10.4 + ((index * 7) % 11) * 0.28;
        if (localTime > clearAt) {
          figure.setClothes(cast.crowdVisor.clear[index % cast.crowdVisor.clear.length]!);
        } else {
          figure.setClothes(cast.crowdVisor.mirror[index % cast.crowdVisor.mirror.length]!);
        }
      });
      cast.photographer.root.position.set(2.9, -1.35 + Math.sin(time * 0.4) * 0.1, 8.6);
      applyPose(cast.photographer, weightless(time * 0.6, 11));

      // 推进器喷出的白雾
      const mist = clamp01(1 - segmentProgress(localTime, 4.0, 9.0)) * clamp01(localTime / 1.2);
      setOpacity(space.thrusterMist, mist * 0.5);
      if (mist > 0.01) {
        pointsFrom(space.thrusterMist, 220, (index, seed, out) => {
          const owner = index % 21;
          const row = Math.floor(owner / 7);
          const column = owner % 7;
          const life = (localTime * 0.5 + seed[0]!) % 1;
          out.set(
            (column - 3) * 1.42 + row * 0.2 + (seed[1]! - 0.5) * 0.5,
            -row * 0.36 + 0.6 + (seed[2]! - 0.5) * 0.4,
            -row * 1.5 - 0.7 - life * 2.4,
          );
        });
      }

      if (localTime < 8.6) {
        // 瞄准镜视点：他们从闸门里飞出来
        const wobble = Math.sin(time * 0.7) * 0.4;
        applyFraming(camera, {
          pos: [STAGE_ORIGIN.x + wobble * 0.3, STAGE_ORIGIN.y + 2.2, STAGE_ORIGIN.z + 25],
          look: [STAGE_ORIGIN.x, STAGE_ORIGIN.y + 1.75, STAGE_ORIGIN.z - 20],
          fov: lerp(13, 10.5, localTime / 8.6),
        });
        camera.rotateX(Math.sin(time * 0.53) * 0.003);
        camera.rotateY(Math.cos(time * 0.41) * 0.004);
      } else if (localTime < 15.0) {
        // 摄影师指挥队形
        move(
          camera,
          { pos: [STAGE_ORIGIN.x + 4.4, STAGE_ORIGIN.y + 2.7, STAGE_ORIGIN.z + 0.6], look: [STAGE_ORIGIN.x, STAGE_ORIGIN.y + 1.72, STAGE_ORIGIN.z - 12], fov: 28 },
          { pos: [STAGE_ORIGIN.x + 2.5, STAGE_ORIGIN.y + 2.25, STAGE_ORIGIN.z - 2.9], look: [STAGE_ORIGIN.x, STAGE_ORIGIN.y + 1.75, STAGE_ORIGIN.z - 12], fov: 23 },
          (localTime - 8.6) / 6.4,
        );
        scope.set(0);
      } else {
        // 回到瞄准镜。十字线扫过前排，停在正中的三个人身上。
        scope.set(1);
        const sweep = smoothstep((localTime - 15.0) / 6.0);
        const targetX = lerp(-3.4, 0.35, sweep);
        applyFraming(camera, {
          pos: [STAGE_ORIGIN.x + Math.sin(time * 0.6) * 0.18, STAGE_ORIGIN.y + 1.9, STAGE_ORIGIN.z + 14],
          look: [STAGE_ORIGIN.x + targetX, STAGE_ORIGIN.y + 1.88, STAGE_ORIGIN.z - 12],
          fov: lerp(9, 5.2, sweep),
        });
        camera.rotateX(Math.sin(time * 0.53) * 0.0018);
        camera.rotateY(Math.cos(time * 0.41) * 0.002);
      }
    },
    leave: ({ context }) => {
      context.scope.set(0);
      setOpacity(context.space.thrusterMist, 0);
    },
  });

  /** 合影队形的定格：从这一刻起，他们不再移动。 */
  const holdCrowd = (context: Ctx, time: number, spread = 1): void => {
    const { cast } = context;
    cast.crowd.forEach((figure, index) => {
      const row = Math.floor(index / 7);
      const column = index % 7;
      figure.root.position.set(
        (column - 3) * 1.42 + row * 0.2 + Math.sin(time * 0.5 + index) * 0.015 * spread,
        -row * 0.36 + 0.2 + Math.sin(time * 0.42 + index * 1.7) * 0.018 * spread,
        -row * 1.5,
      );
      figure.root.rotation.set(0, Math.sin(time * 0.24 + index * 2.1) * 0.02 * spread, 0);
      applyPose(figure, weightless(time * 0.18, index * 1.7));
      figure.setClothes(cast.crowdVisor.clear[index % cast.crowdVisor.clear.length]!);
    });
    cast.photographer.root.position.set(2.9, -1.35, 8.6);
    applyPose(cast.photographer, weightless(time * 0.3, 11));
  };

  // 摘手套 · 取枪 · 装瞄准镜
  add({
    id: "s5-ready",
    start: T.s5[0],
    end: T.s5[1],
    enter: ({ context }) => {
      spaceIn(context, -13.3);
      place(context.cast.zhang, 0, 0, 0, 3.05);
      const { space, cast } = context;
      space.stage.visible = true;
      space.crowdAnchor.visible = true;
      space.hatchDoor.position.x = -7.4;
      cast.props.looseScope.visible = false;
      if (!cast.props.looseScope.parent) space.root.add(cast.props.looseScope);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space } = context;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -13.3 - localTime * 0.06);
      holdCrowd(context, time);

      // 摘掉右手手套：航天服换成"右手裸露"的那一张贴图
      const bare = localTime > 1.8;
      cast.zhang.setClothes(bare ? cast.costumes.suitBareHand : cast.costumes.suit);
      // 取枪、装镜
      const armed = localTime > 6.6;
      cast.props.pistol.visible = armed;
      cast.props.scope.visible = localTime > 10.4;
      cast.props.magazine.visible = localTime > 7.6 && localTime < 11.2;
      cast.props.looseScope.visible = localTime > 2.4 && localTime < 10.4;
      cast.props.looseScope.position.set(
        0.42 + Math.sin(time * 0.4) * 0.02,
        1.34 + Math.sin(time * 0.31) * 0.02,
        0.52,
      );
      cast.props.looseScope.rotation.set(time * 0.12, 1.2 + time * 0.08, 0.3);

      const reachOut = smoothstep(segmentProgress(localTime, 0.4, 2.2));
      const pocket = smoothstep(segmentProgress(localTime, 4.8, 6.6));
      const mount = smoothstep(segmentProgress(localTime, 8.8, 10.6));
      let pose: Pose = weightless(time * 0.4, 7);
      pose = lerpPose(pose, reach(time, 1.3, 0.4), reachOut * (1 - pocket));
      pose = lerpPose(pose, reach(time, 0.5, -0.55), pocket * (1 - mount));
      pose = lerpPose(pose, handsFront(time, 1.32, 0.16), mount);
      pose.lift = (pose.lift ?? 0) - 0.4;
      applyPose(cast.zhang, pose);
      cast.zhang.root.rotation.set(-0.16, 3.05, 0.06);

      if (localTime < 4.6) {
        // 他把身体转了个角度，让还剩的一点阳光照到那只手上
        move(
          camera,
          { pos: [3.05, 2.0, 2.75], look: [0.15, 1.22, 0.05], fov: 30 },
          { pos: [2.25, 1.62, 1.95], look: [0.16, 1.2, 0.06], fov: 24 },
          localTime / 4.6,
          easeOut,
        );
      } else if (localTime < 9.4) {
        // 从工作袋里取出枪和两个弹夹
        move(
          camera,
          { pos: [2.65, 1.58, 2.0], look: [0.12, 1.05, 0.08], fov: 32 },
          { pos: [2.15, 1.44, 1.55], look: [0.14, 1.02, 0.12], fov: 27 },
          (localTime - 4.6) / 4.8,
        );
      } else {
        // 磁铁夹具坐上滑套。咔哒一声，全片准备结束。
        move(
          camera,
          { pos: [2.3, 1.62, 1.65], look: [0.18, 1.16, 0.15], fov: 26 },
          { pos: [1.78, 1.48, 1.25], look: [0.2, 1.14, 0.16], fov: 20 },
          (localTime - 9.4) / 5.6,
          easeOut,
        );
      }
      drift(camera, time, 0.1);
    },
    leave: ({ context }) => {
      context.cast.props.looseScope.visible = false;
    },
  });

  // 三十次击发
  const VOLLEY = [296.0, 297.95, 299.9];
  const SHOT_INTERVAL = 0.2311;
  const muzzleAt = (time: number): number => {
    let flash = 0;
    for (const base of VOLLEY) {
      for (let i = 0; i < 10; i += 1) {
        const dt = time - (base + i * SHOT_INTERVAL);
        if (dt >= 0 && dt < 0.1) flash = Math.max(flash, Math.exp(-dt * 60));
      }
    }
    return flash;
  };

  add({
    id: "s6-fire",
    start: T.s6[0],
    end: T.s6[1],
    enter: ({ context }) => {
      spaceIn(context, -14.3);
      place(context.cast.zhang, 0, 0, 0, 3.05);
      const { space, cast } = context;
      space.stage.visible = true;
      space.crowdAnchor.visible = true;
      space.hatchDoor.position.x = -7.4;
      cast.zhang.setClothes(cast.costumes.suitBareHand);
      cast.props.pistol.visible = true;
      cast.props.scope.visible = true;
      cast.props.muzzleFlash.visible = true;
      cast.props.magazine.visible = false;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, scope } = context;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -14.3 - localTime * 0.06);
      holdCrowd(context, time);

      const flash = muzzleAt(time);
      cast.props.muzzleFlash.visible = flash > 0.02;
      (cast.props.muzzleFlash.material as THREE.MeshBasicMaterial).opacity = flash;
      cast.props.muzzleFlash.scale.setScalar(0.55 + flash * 0.9);
      cast.props.muzzleFlash.lookAt(camera.position);
      const muzzleLight = cast.props.muzzleLight as THREE.PointLight;
      muzzleLight.visible = true;
      muzzleLight.intensity = flash * 9;
      // 换弹夹的两个瞬间
      const swapping = (time > 297.7 && time < 297.95) || (time > 299.65 && time < 299.9);
      cast.props.magazine.visible = swapping;

      const recoil = flash * 0.06;
      const yaw = time < 297.9 ? 0.0 : time < 299.85 ? 0.02 : 0.04;
      applyPose(cast.zhang, aimInVoid(time * 0.4, -0.04 + recoil, yaw, 7));
      cast.zhang.root.rotation.set(-0.14, 3.05 + yaw * 0.5, 0.04);

      if (localTime < 5.0) {
        // 举枪的侧面。真空里没有声音，只有后坐力。
        move(
          camera,
          { pos: [3.8, 1.75, -0.5], look: [0.1, 1.24, -0.05], fov: 30 },
          { pos: [3.2, 1.66, -0.75], look: [0.12, 1.22, -0.05], fov: 26 },
          localTime / 5.0,
        );
        camera.position.x += recoil * 0.9;
      } else if (localTime < 9.2) {
        // 枪口正对镜头：镜头站在弹道上
        move(
          camera,
          { pos: [-1.55, 1.42, -3.4], look: [0.05, 1.24, -0.2], fov: 26 },
          { pos: [-1.28, 1.38, -2.85], look: [0.05, 1.23, -0.2], fov: 22 },
          (localTime - 5.0) / 4.2,
        );
      } else {
        // 从黄河站那边看回来：黑暗背景上的一只萤火虫
        move(
          camera,
          { pos: [-4, 3.5, -46], look: [0, 1.0, 0], fov: 26 },
          { pos: [-3, 3.0, -38], look: [0, 1.0, 0], fov: 24 },
          (localTime - 9.2) / 3.8,
        );
      }
      scope.set(0);
      drift(camera, time, 0.08);
    },
    leave: ({ context }) => {
      (context.cast.props.muzzleFlash.material as THREE.MeshBasicMaterial).opacity = 0;
      context.cast.props.muzzleFlash.visible = false;
      (context.cast.props.muzzleLight as THREE.PointLight).intensity = 0;
      context.cast.props.muzzleLight.visible = false;
    },
  });

  // 十秒
  add({
    id: "s7-tenseconds",
    start: T.s7[0],
    end: T.s7[1],
    enter: ({ context }) => {
      spaceIn(context, -15.2);
      place(context.cast.zhang, 0, 0, 0, 3.05);
      const { space, cast } = context;
      space.stage.visible = true;
      space.crowdAnchor.visible = true;
      space.hatchDoor.position.x = -7.4;
      space.bulletCloseup.visible = false;
      cast.zhang.setClothes(cast.costumes.suitBareHand);
      cast.props.pistol.visible = true;
      cast.props.scope.visible = true;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, scope, visor } = context;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -15.2 - localTime * 0.05);
      holdCrowd(context, time);
      applyPose(cast.zhang, aimInVoid(time * 0.4, -0.04, 0.02, 7));
      cast.zhang.root.rotation.set(-0.14, 3.06, 0.04);

      if (localTime < 4.6) {
        // 五段还带着车床痕迹的陨石，在绝对的寂静里翻滚
        space.bulletCloseup.visible = true;
        space.bulletCloseup.position.set(0, 1.1, -20 - localTime * 3.2);
        space.bulletCloseup.children.forEach((slug, index) => {
          const spin = slug.userData.spin as number[];
          const rate = slug.userData.rate as number;
          slug.rotation.set(time * spin[0]! * rate, time * spin[1]! * rate, time * spin[2]! * rate);
          void index;
        });
        move(
          camera,
          { pos: [2.4, 1.4, -22.4], look: [0, 1.1, -21.8], fov: 26 },
          { pos: [1.7, 1.25, -35.6], look: [0, 1.1, -35.0], fov: 22 },
          localTime / 4.6,
        );
        scope.set(0);
        visor.set(0);
      } else if (localTime < 10.6) {
        // 瞄准镜里：他们还在笑，还在等摄影师数一二三
        space.bulletCloseup.visible = false;
        scope.set(1);
        applyFraming(camera, {
          pos: [STAGE_ORIGIN.x + Math.sin(time * 0.6) * 0.12, STAGE_ORIGIN.y + 1.8, STAGE_ORIGIN.z + 12],
          look: [STAGE_ORIGIN.x + 0.35, STAGE_ORIGIN.y + 1.9, STAGE_ORIGIN.z - 12],
          fov: lerp(5.4, 4.6, (localTime - 4.6) / 6.0),
        });
        camera.rotateX(Math.sin(time * 0.53) * 0.0012);
        camera.rotateY(Math.cos(time * 0.41) * 0.0014);
      } else {
        // 他自己。面罩是镀膜的，看不见脸，只有一整片星空的倒影。
        space.bulletCloseup.visible = false;
        scope.set(0);
        move(
          camera,
          { pos: [0.5, 1.72, 1.42], look: [0.02, 1.5, 0.1], fov: 22 },
          { pos: [0.36, 1.66, 1.14], look: [0.02, 1.49, 0.1], fov: 17 },
          (localTime - 10.6) / 5.4,
          easeOut,
        );
      }
      drift(camera, time, 0.06);
    },
    leave: ({ context }) => {
      context.space.bulletCloseup.visible = false;
      context.scope.set(0);
    },
  });

  // 命中
  // 三个目标，外加两个"故意走偏"打中的人 —— 为了减少可能出现的怀疑。
  const HIT_INDICES = [...TARGET_INDICES, 9, 12];
  const HIT_TIME = 321.6;
  add({
    id: "s8-impact",
    start: T.s8[0],
    end: T.s8[1],
    enter: ({ context }) => {
      spaceIn(context, -16.1);
      place(context.cast.zhang, 0, 0, 0, 3.05);
      const { space, cast } = context;
      space.stage.visible = true;
      space.crowdAnchor.visible = true;
      space.hatchDoor.position.x = -7.4;
      cast.zhang.setClothes(cast.costumes.suitBareHand);
      cast.props.pistol.visible = true;
      cast.props.scope.visible = true;
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, scope } = context;
      space.stars.rotation.y = time * 0.004;
      setSun(space, -16.1 - localTime * 0.04);

      const since = time - HIT_TIME;
      const flee = clamp01((time - 333.6) / 4.2);

      cast.crowd.forEach((figure, index) => {
        const row = Math.floor(index / 7);
        const column = index % 7;
        const hitOrder = HIT_INDICES.indexOf(index);
        const hit = hitOrder >= 0 && since > hitOrder * 0.22;
        const baseX = (column - 3) * 1.42 + row * 0.2;
        const baseY = -row * 0.36 + 0.2;
        const baseZ = -row * 1.5;
        // 被击中的人开始不受控地翻滚；其他人全功率推进器逃回闸门
        const tumble = hit ? clamp01((since - hitOrder * 0.22) / 2.4) : 0;
        const escape = hit ? flee * 0.55 : flee;
        figure.root.position.set(
          baseX + tumble * Math.sin(index * 2.3) * 0.5 - escape * baseX * 0.55,
          baseY + tumble * Math.cos(index * 1.7) * 0.4 + escape * (1.0 - baseY) * 0.8,
          baseZ + tumble * 0.5 + escape * (12 + baseZ) * 0.94,
        );
        figure.root.rotation.set(
          tumble * Math.sin(index * 3.1) * 2.4,
          hit ? tumble * Math.cos(index * 2.2) * 2.0 : escape * 0.2,
          tumble * Math.sin(index * 1.3) * 1.8,
        );
        applyPose(
          figure,
          hit
            ? weightless(time * 0.9 + tumble * 4, index * 1.7)
            : lerpPose(weightless(time * 0.18, index * 1.7), weightless(time * 1.4, index * 2.3), flee),
        );
        // 面罩：布满裂纹，血在里面
        if (hit && hitOrder < 3) {
          figure.setClothes(cast.crowdVisor.hit[hitOrder % cast.crowdVisor.hit.length]!);
        } else {
          figure.setClothes(cast.crowdVisor.clear[index % cast.crowdVisor.clear.length]!);
        }
      });
      cast.photographer.root.position.set(2.9, -1.35 + flee * 1.6, 8.6 + flee * 6);
      applyPose(cast.photographer, weightless(time * (0.3 + flee * 1.5), 11));

      // 泄漏的气体
      const venting = clamp01(since / 0.5) * (1 - clamp01((since - 9) / 4));
      setOpacity(space.ventGas, Math.max(0, venting) * 0.55);
      if (venting > 0.01) {
        pointsFrom(space.ventGas, 180, (index, seed, out) => {
          const owner = HIT_INDICES[index % HIT_INDICES.length]!;
          const row = Math.floor(owner / 7);
          const column = owner % 7;
          const age = Math.max(0, since - (index % 5) * 0.22);
          const life = (age * 0.55 + seed[0]!) % 1;
          const dir = new THREE.Vector3(seed[0]! - 0.5, seed[1]! - 0.5, seed[2]! - 0.5).normalize();
          out.set(
            (column - 3) * 1.42 + row * 0.2 + dir.x * life * 3.4,
            -row * 0.36 + 1.0 + dir.y * life * 3.0,
            -row * 1.5 + dir.z * life * 2.6 + life * 1.4,
          );
        });
      }
      // 血喷出来，很快冷凝成雪花状的冰晶
      const ice = clamp01((since - 4.2) / 1.2) * (1 - clamp01((since - 13) / 3));
      setOpacity(space.iceCrystals, Math.max(0, ice) * 0.85);
      if (ice > 0.01) {
        pointsFrom(space.iceCrystals, 140, (index, seed, out) => {
          const owner = HIT_INDICES[index % 3]!;
          const column = owner % 7;
          const age = Math.max(0, since - 4.2);
          const life = clamp01(age * 0.28 + seed[0]! * 0.4);
          const dir = new THREE.Vector3(seed[0]! - 0.5, seed[1]! - 0.3, seed[2]! - 0.5).normalize();
          out.set(
            (column - 3) * 1.42 + dir.x * life * 4.6,
            1.28 + dir.y * life * 4.0,
            dir.z * life * 3.2 + life * 1.6,
          );
        });
        const material = space.iceCrystals.material as THREE.PointsMaterial;
        material.color.setRGB(1, 0.72 + clamp01(age(since) * 0.2) * 0.24, 0.72 + clamp01(age(since) * 0.2) * 0.26);
      }
      // 全员推进器的白雾
      setOpacity(space.thrusterMist, flee * 0.45);
      if (flee > 0.01) {
        pointsFrom(space.thrusterMist, 220, (index, seed, out) => {
          const owner = index % 21;
          const row = Math.floor(owner / 7);
          const column = owner % 7;
          const life = (time * 0.9 + seed[0]!) % 1;
          out.set(
            (column - 3) * 1.42 + row * 0.2 - flee * ((column - 3) * 1.42) * 0.55 + (seed[1]! - 0.5) * 0.4,
            -row * 0.36 + 0.6 + flee * 0.8 + (seed[2]! - 0.5) * 0.4,
            -row * 1.5 + flee * (12 - row * 1.5) * 0.94 - 1.0 - life * 3.4,
          );
        });
      }

      applyPose(cast.zhang, aimInVoid(time * 0.4, -0.04, 0.02, 7));
      cast.zhang.root.rotation.set(-0.14, 3.06, 0.04);

      if (localTime < 8.0) {
        // 瞄准镜里：白气、裂纹、血
        scope.set(1);
        applyFraming(camera, {
          pos: [STAGE_ORIGIN.x + Math.sin(time * 0.6) * 0.1, STAGE_ORIGIN.y + 1.8, STAGE_ORIGIN.z + 11],
          look: [STAGE_ORIGIN.x + 0.35, STAGE_ORIGIN.y + 1.95, STAGE_ORIGIN.z - 12],
          fov: lerp(4.4, 5.4, localTime / 8.0),
        });
        camera.rotateX(Math.sin(time * 0.53) * 0.001);
      } else if (localTime < 13.6) {
        // 舞台侧面：他们的口型在喊「陨石雨」，没有一点声音
        scope.set(0);
        move(
          camera,
          { pos: [STAGE_ORIGIN.x + 6.0, STAGE_ORIGIN.y + 2.6, STAGE_ORIGIN.z - 3.0], look: [STAGE_ORIGIN.x + 0.2, STAGE_ORIGIN.y + 1.1, STAGE_ORIGIN.z - 11], fov: 30 },
          { pos: [STAGE_ORIGIN.x + 3.6, STAGE_ORIGIN.y + 2.2, STAGE_ORIGIN.z - 6.4], look: [STAGE_ORIGIN.x + 0.2, STAGE_ORIGIN.y + 1.15, STAGE_ORIGIN.z - 11], fov: 26 },
          (localTime - 8.0) / 5.6,
        );
      } else {
        // 拉开：三十个人拖着白雾冲回闸门，五个被别人拖着
        move(
          camera,
          { pos: [STAGE_ORIGIN.x + 11, STAGE_ORIGIN.y + 5.0, STAGE_ORIGIN.z + 6], look: [STAGE_ORIGIN.x, STAGE_ORIGIN.y + 1.4, STAGE_ORIGIN.z - 12], fov: 42 },
          { pos: [STAGE_ORIGIN.x + 16, STAGE_ORIGIN.y + 7.0, STAGE_ORIGIN.z + 12], look: [STAGE_ORIGIN.x, STAGE_ORIGIN.y + 1.6, STAGE_ORIGIN.z - 12], fov: 46 },
          (localTime - 13.6) / 4.4,
        );
      }
    },
    leave: ({ context }) => {
      setOpacity(context.space.ventGas, 0);
      setOpacity(context.space.iceCrystals, 0);
      setOpacity(context.space.thrusterMist, 0);
      context.scope.set(0);
    },
  });

  // 撤离
  add({
    id: "s9-leave",
    start: T.s9[0],
    end: T.s9[1],
    enter: ({ context }) => {
      spaceIn(context, -17.0);
      const { space, cast } = context;
      space.stage.visible = false;
      space.crowdAnchor.visible = false;
      cast.zhang.setClothes(cast.costumes.suit);
      cast.props.pistol.visible = true;
      cast.props.scope.visible = true;
      place(cast.zhang, 0, 0, 0, 0.6);
    },
    update: ({ context, localTime, time }) => {
      const { camera, cast, space, visor } = context;
      space.debris.tumble(time);
      space.stars.rotation.y = time * 0.004;
      setSun(space, -17.0 - localTime * 0.09);
      const run = easeOut(clamp01(localTime / 13));
      // 向一号基地加速
      cast.zhang.root.position.set(run * 46, run * 9, run * 34);
      cast.zhang.root.rotation.set(-0.34, 0.62, 0.05);
      const pose = weightless(time * 0.4, 13);
      pose.armR = [-0.3, 0, 0.4];
      pose.armL = [-0.3, 0, -0.4];
      pose.legR = [0.18, 0, 0.1];
      pose.legL = [0.1, 0, -0.1];
      applyPose(cast.zhang, pose);
      cast.props.pistol.visible = localTime < 2.2;
      cast.props.scope.visible = localTime < 2.2;

      // 摄影机跟着他走，但一路被落下：他先是一个人，最后只是一块朝深渊飞的东西。
      const follow = easeOut(clamp01(localTime / 14));
      const px = cast.zhang.root.position.x;
      const py = cast.zhang.root.position.y;
      const pz = cast.zhang.root.position.z;
      const back = lerp(4.2, 26, follow);
      const up = lerp(1.9, 9.5, follow);
      // 机位在他前方：这样反光补光正打在他身上，而地球留在他身后。
      applyFraming(camera, {
        pos: [px + back * 0.78, py + up, pz + back * 0.66],
        look: [px + 0.2, py + 1.0, pz + 0.2],
        fov: lerp(34, 44, follow),
      });
      visor.set(0);
      drift(camera, time, 0.14);
    },
  });

  // ══ 片尾 ════════════════════════════════════════════════════════════
  add({
    id: "e0-end",
    start: T.e0[0],
    end: T.e0[1],
    enter: ({ context }) => {
      setWorld(context, "void");
      const { space, cast } = context;
      cast.zhang.root.visible = false;
      cast.collector.root.visible = false;
      space.stage.visible = false;
      space.earth.visible = false;
      space.nightLights.visible = false;
      space.atmosphere.visible = false;
      space.wheel.visible = false;
      space.shipyard.visible = false;
      space.baseOne.visible = false;
      space.elevator.visible = false;
      space.debris.group.visible = false;
      space.bulletCloseup.visible = false;
      space.sun.visible = false;
      space.sunGlow.visible = false;
    },
    update: ({ context, time }) => {
      const { camera, space } = context;
      space.stars.rotation.y = time * 0.004;
      applyFraming(camera, { pos: [0, 0, 6], look: [0, 0, 0], fov: 36 });
    },
    leave: ({ context }) => {
      context.space.sun.visible = true;
      context.space.sunGlow.visible = true;
    },
  });

  return shots;
}

function age(since: number): number {
  return Math.max(0, since - 4.2);
}

// ── 全片统一的转场、片名、颗粒 ────────────────────────────────────────
interface Dip {
  at: number;
  out: number;
  in: number;
}

// 开场不排黑场：第一格就该有一块石头可看，起始画面的暗底由 poster 层负责，
// 它在按下播放的那一刻淡出，本身就是全片的淡入。
const DIPS: Dip[] = [
  { at: T.c0[0], out: 0.75, in: 0.55 },
  { at: T.m0[0], out: 0.7, in: 0.9 },
  { at: T.w0[0], out: 0.55, in: 0.8 },
  { at: T.b0[0], out: 0.5, in: 0.9 },
  { at: T.s0[0], out: 0.8, in: 1.0 },
  { at: T.e0[0], out: 1.4, in: 1.2 },
];

export function fadeAt(time: number): number {
  let value = 0;
  for (const dip of DIPS) {
    if (time < dip.at) {
      if (time > dip.at - dip.out) value = Math.max(value, segmentProgress(time, dip.at - dip.out, dip.at));
    } else if (time < dip.at + dip.in) {
      value = Math.max(value, 1 - segmentProgress(time, dip.at, dip.at + dip.in));
    }
  }
  // 片尾黑到底
  if (time > T.e0[1] - 1.6) value = Math.max(value, segmentProgress(time, T.e0[1] - 1.6, T.e0[1]));
  return clamp01(value);
}

export const TITLES = [
  {
    start: 4.3,
    end: 8.9,
    title: "陨　石",
    line: "根据刘慈欣《三体 · 黑暗森林》改编",
  },
  {
    start: 352.4,
    end: 355.6,
    quote: "「就算表示我，对要送的人的尊重吧。」",
  },
  {
    start: 355.9,
    end: 358,
    title: "陨　石",
    line: "全片画面与声音均由代码程序化生成",
  },
];

export function titleAt(time: number): { card: (typeof TITLES)[number] | null; amount: number } {
  for (const card of TITLES) {
    if (time >= card.start - 0.6 && time <= card.end + 0.6) {
      const amount =
        segmentProgress(time, card.start - 0.6, card.start + 0.4) *
        (1 - segmentProgress(time, card.end - 0.4, card.end + 0.6));
      return { card, amount: smoothstep(amount) };
    }
  }
  return { card: null, amount: 0 };
}
