import * as THREE from "three";
import { easeInOutCubic, smoothstep } from "@agentbench/cinematic-player";

/**
 * 摄影机。
 *
 * 每一个机位都是绝对时间的纯函数：给定 t，机位、焦距、俯仰完全确定。
 * 所以拖动进度条得到的画面和正常播放到那一刻的画面是同一格。
 */

export interface Framing {
  /** 机位。 */
  pos: [number, number, number];
  /** 视点。 */
  look: [number, number, number];
  /** 视场角，默认 38（略长于标准，适合这部片子的克制） */
  fov?: number;
  /** 横滚，弧度。 */
  roll?: number;
}

const positionA = new THREE.Vector3();
const positionB = new THREE.Vector3();
const targetA = new THREE.Vector3();
const targetB = new THREE.Vector3();

export function applyFraming(camera: THREE.PerspectiveCamera, framing: Framing): void {
  camera.position.set(...framing.pos);
  camera.up.set(0, 1, 0);
  camera.lookAt(framing.look[0], framing.look[1], framing.look[2]);
  if (framing.roll) camera.rotateZ(framing.roll);
  const fov = framing.fov ?? 38;
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

export type Ease = (t: number) => number;

export const linear: Ease = (t) => t;
export const easeOut: Ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 2.4);
export const easeIn: Ease = (t) => Math.pow(Math.min(1, Math.max(0, t)), 2.2);
export const easeBoth: Ease = easeInOutCubic;
export const settle: Ease = (t) => smoothstep(t);

/** 在两个机位之间走一条直线，用于推、拉、摇、移。 */
export function move(
  camera: THREE.PerspectiveCamera,
  from: Framing,
  to: Framing,
  amount: number,
  ease: Ease = easeBoth,
): void {
  const t = ease(Math.min(1, Math.max(0, amount)));
  positionA.set(...from.pos);
  positionB.set(...to.pos);
  targetA.set(...from.look);
  targetB.set(...to.look);
  positionA.lerp(positionB, t);
  targetA.lerp(targetB, t);
  camera.position.copy(positionA);
  camera.up.set(0, 1, 0);
  camera.lookAt(targetA);
  const roll = (from.roll ?? 0) + ((to.roll ?? 0) - (from.roll ?? 0)) * t;
  if (roll) camera.rotateZ(roll);
  const fov = (from.fov ?? 38) + ((to.fov ?? 38) - (from.fov ?? 38)) * t;
  if (Math.abs(camera.fov - fov) > 1e-4) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
}

/**
 * 手持的微颤。完全由时间决定，所以 seek 之后抖动的相位也一样。
 * 地球段落用它，真空段落不用 —— 那里没有人在扛机器。
 */
export function handheld(camera: THREE.PerspectiveCamera, time: number, amount = 1): void {
  if (amount <= 0) return;
  const a = amount * 0.0016;
  camera.position.x += Math.sin(time * 1.31 + 0.4) * a * 6;
  camera.position.y += Math.sin(time * 1.07 + 2.1) * a * 5;
  camera.rotateX(Math.sin(time * 0.83 + 1.2) * a * 1.6);
  camera.rotateY(Math.sin(time * 0.61 + 0.3) * a * 2.0);
  camera.rotateZ(Math.sin(time * 0.47 + 2.7) * a * 1.1);
}

/** 失重里的漂移：极慢、无阻尼、没有"上"。 */
export function drift(camera: THREE.PerspectiveCamera, time: number, amount = 1): void {
  camera.position.x += Math.sin(time * 0.17) * amount * 0.5;
  camera.position.y += Math.sin(time * 0.13 + 1.4) * amount * 0.42;
  camera.rotateZ(Math.sin(time * 0.09 + 0.8) * amount * 0.02);
}
