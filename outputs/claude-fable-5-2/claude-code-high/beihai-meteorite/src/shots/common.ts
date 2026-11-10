import * as THREE from "three";
import type { Actor } from "../cast/actors";
import type { ShotDef } from "../film";
import { shootCam, type V3 } from "../lib/util";

/** Staging helpers shared by every sequence. */

export function cut(id: string, start: number, end: number, update: (t: number, T: number) => void): ShotDef {
  return { id, start, end, update };
}

/** Heading (radians) that makes an actor at `from` face `to`. */
export function yawTo(from: V3, to: V3): number {
  return Math.atan2(to[0] - from[0], to[2] - from[2]);
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _down = new THREE.Vector3(0, -1, 0);

/** World position of one of an actor's prop anchors. */
export function anchorPos(actor: Actor, name: "handR" | "handL" | "head" | "back" | "hipR" | "hipL", out = new THREE.Vector3()): THREE.Vector3 {
  actor.root.updateWorldMatrix(true, true);
  return actor.figure.anchors[name].getWorldPosition(out);
}

/** Aim a whole arm so the fist points at a world position (overrides the pose's arm). */
export function pointArm(actor: Actor, arm: "armR" | "armL", target: THREE.Vector3 | V3, blend = 1): void {
  const joint = actor.figure.joints[arm];
  actor.root.updateWorldMatrix(true, true);
  joint.getWorldPosition(_a);
  if (Array.isArray(target)) _b.set(target[0], target[1], target[2]);
  else _b.copy(target);
  _b.sub(_a).normalize();
  joint.parent!.getWorldQuaternion(_q).invert();
  _b.applyQuaternion(_q);
  _q.setFromUnitVectors(_down, _b);
  if (blend >= 1) joint.quaternion.copy(_q);
  else joint.quaternion.slerp(_q, Math.max(0, blend));
}

/** Put a free prop in an actor's hand, kept upright with the actor's heading. */
export function holdUpright(prop: THREE.Object3D, actor: Actor, hand: "handR" | "handL", lift = 0, yaw = 0): THREE.Vector3 {
  anchorPos(actor, hand, _a);
  prop.position.set(_a.x, _a.y + lift, _a.z);
  prop.rotation.set(0, actor.root.rotation.y + yaw, 0);
  prop.visible = true;
  return prop.position;
}

/** Figure-pixel → metre scale for props that live in world space. */
export const PXM = 0.05625;

/**
 * Frame a subject by size instead of by distance: the camera is placed along
 * `from` (a direction from the subject toward the lens) so that `frameH` metres
 * fill the frame height at the subject. Block figures have 45 cm heads, so
 * shot sizes are easier to reason about this way.
 */
export function frameCam(
  cam: THREE.PerspectiveCamera,
  target: V3,
  from: V3,
  frameH: number,
  fov: number,
  roll = 0,
  nudge: V3 = [0, 0, 0],
): void {
  const l = Math.hypot(from[0], from[1], from[2]) || 1;
  const d = frameH / (2 * Math.tan((fov * Math.PI) / 360));
  shootCam(
    cam,
    [target[0] + (from[0] / l) * d + nudge[0], target[1] + (from[1] / l) * d + nudge[1], target[2] + (from[2] / l) * d + nudge[2]],
    target,
    fov,
    roll,
  );
}

/** Shot sizes in metres of frame height at the subject, for 1.8 m block figures. */
export const SIZE = { ecu: 0.42, cu: 0.66, mcu: 1.0, ms: 1.5, mls: 2.1, full: 2.7 } as const;
