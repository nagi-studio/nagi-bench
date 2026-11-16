import * as THREE from "three";
import { applyPose, idle, walk, aim, float, lerpPose, type Pose, type Figure } from "@agentbench/voxel-kit";
import { pistolGeo, scopeGeo, magazineGeo, teacupGeo, magnifierGeo, pliersGeo, glueTubeGeo, meteoriteGeo, mesh, solidBox } from "../world/props";
import { clamp01, lerp } from "../util";

export { applyPose, idle, walk, aim, float, lerpPose };
export type { Pose };

/** Reusable hand-held props, built once. */
export interface HandProps {
  teacup: THREE.Mesh;
  magnifier: THREE.Mesh;
  mars: THREE.Mesh;
  phone: THREE.Mesh;
  pliers: THREE.Mesh;
  glue: THREE.Mesh;
  pistolRig: THREE.Group;
  pistol: THREE.Mesh;
  scope: THREE.Mesh;
  magazine: THREE.Mesh;
  case_: THREE.Mesh;
  iron: THREE.Mesh;
}

let _props: HandProps | null = null;
export function props(): HandProps {
  if (_props) return _props;
  const pistol = mesh(pistolGeo(), { metalness: 0.5, roughness: 0.4 });
  const scope = mesh(scopeGeo(), { metalness: 0.4, roughness: 0.4 });
  scope.position.set(0, 0.55, 0.35);
  scope.visible = false;
  const magazine = mesh(magazineGeo(), { metalness: 0.4, roughness: 0.5 });
  magazine.position.set(0, -0.5, 0.05);
  const pistolRig = new THREE.Group();
  pistolRig.add(pistol, scope, magazine);
  const phone = solidBox(0.16, 0.3, 0.03, 0x1c1f24, { roughness: 0.3, metalness: 0.2 });
  const case_ = solidBox(0.5, 0.36, 0.16, 0x3a3228, { roughness: 0.7 });
  _props = {
    teacup: mesh(teacupGeo(), { roughness: 0.5 }),
    magnifier: mesh(magnifierGeo(), { roughness: 0.4, metalness: 0.3 }),
    mars: mesh(meteoriteGeo(0.05, 9, 0.02), { color: 0x8a5a3a, roughness: 0.7 }),
    phone,
    pliers: mesh(pliersGeo(), { metalness: 0.5, roughness: 0.4 }),
    glue: mesh(glueTubeGeo(), { roughness: 0.6 }),
    pistolRig, pistol, scope, magazine,
    case_,
    iron: mesh(meteoriteGeo(0.13, 301, 0.045), { metalness: 0.6, roughness: 0.45 }),
  };
  return _props;
}

/** Parent a prop to a hand anchor (or detach with null). Idempotent per frame. */
export function hold(fig: Figure, anchor: "handR" | "handL", obj: THREE.Object3D | null): void {
  const a = fig.anchors[anchor];
  if (obj) {
    if (obj.parent !== a) {
      // clear any other prop currently in this hand
      for (const child of [...a.children]) if (child.userData.isProp) a.remove(child);
      obj.removeFromParent();
      a.add(obj);
      obj.position.set(0, 0, 0);
      obj.rotation.set(0, 0, 0);
      obj.scale.setScalar(1);
    }
  } else {
    // remove any prop currently held (children added by us)
    for (const child of [...a.children]) {
      if (child.userData.isProp) a.remove(child);
    }
  }
  if (obj) obj.userData.isProp = true;
}

export function detachAll(fig: Figure): void {
  for (const name of ["handR", "handL"] as const) {
    const a = fig.anchors[name];
    for (const child of [...a.children]) a.remove(child);
  }
}

/** Standing conversation: breath + head nods + a gesturing right arm. */
export function converse(time: number, seed = 0, gesture = 0.5): Pose {
  const base = idle(time + seed);
  const nod = Math.sin(time * 1.3 + seed) * 0.05;
  const g = Math.max(0, Math.sin(time * 0.7 + seed)) * gesture;
  return {
    ...base,
    neck: [nod + 0.02, Math.sin(time * 0.4 + seed) * 0.16, 0],
    armR: [-0.3 - g * 0.9, 0.1, 0.18 + g * 0.2],
    armL: [base.armL?.[0] ?? 0, 0, -0.12],
  };
}

/** Seated leaning over a bench, arms forward working. */
export function workPose(time: number, reach = 1): Pose {
  const breath = Math.sin(time * 1.6) * 0.02;
  return {
    hips: [0.28, 0, 0],
    neck: [0.4 + breath, Math.sin(time * 0.5) * 0.06, 0],
    armR: [-1.15 * reach + breath, 0.12, 0.1],
    armL: [-1.0 * reach - breath, -0.1, -0.16],
    legR: [-1.35, 0, 0.06],
    legL: [-1.2, 0, -0.06],
    lift: -3.2,
  };
}

/** Two-handed precision work at a table (pliers / glue / loading). */
export function tableWork(time: number, active = 1): Pose {
  const f = Math.sin(time * 3.2) * 0.06 * active;
  return {
    hips: [0.16, 0, 0],
    neck: [0.34, Math.sin(time * 0.6) * 0.05, 0],
    armR: [-1.25 + f, 0.18, 0.12],
    armL: [-1.15 - f, -0.16, -0.2],
    legR: [0, 0, 0.04],
    legL: [0, 0, -0.04],
  };
}

/** Raise a cup to chest height, tilting it slightly. */
export function raiseCup(time: number): Pose {
  const base = idle(time);
  return {
    ...base,
    neck: [0.05, 0.1, 0],
    armR: [-1.5, 0.25, 0.35],
    armL: [-0.2, 0, -0.1],
  };
}

/** Present an object forward with both hands. */
export function present(time: number): Pose {
  const base = idle(time);
  return {
    ...base,
    neck: [0.08, 0, 0],
    armR: [-1.35, 0.1, 0.2],
    armL: [-1.2, -0.1, -0.22],
  };
}

/** Zero-g drift with a slow deliberate turn (Zhang waiting). */
export function drift(time: number): Pose {
  const f = float(time);
  return { ...f, hips: [-0.12 + Math.sin(time * 0.3) * 0.05, Math.sin(time * 0.2) * 0.1, 0] };
}

/** Blend two poses by a smooth 0..1 window. */
export function blendWindow(a: Pose, b: Pose, time: number, start: number, end: number): Pose {
  return lerpPose(a, b, clamp01((time - start) / (end - start)));
}

export { clamp01, lerp };
