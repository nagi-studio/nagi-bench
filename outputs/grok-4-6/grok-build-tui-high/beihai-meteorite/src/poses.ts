import { aim, float, idle, lerpPose, type Pose, walk } from "@agentbench/voxel-kit";

export function compose(base: Pose, overlay: Pose, t = 1): Pose {
  return lerpPose(base, { ...base, ...overlay }, t);
}

export const rest: Pose = {};

export function breathIdle(time: number, amount = 1): Pose {
  const b = idle(time);
  if (amount === 1) return b;
  return lerpPose(rest, b, amount);
}

export const leanInspect: Pose = {
  hips: [0.22, 0.15, 0],
  neck: [0.42, 0.18, 0],
  armR: [-1.05, 0.35, 0.42],
  armL: [-0.35, -0.12, -0.18],
  lift: -0.4,
};

export const holdCup: Pose = {
  neck: [0.08, 0.12, 0],
  armR: [-1.05, 0.22, 0.55],
  armL: [-0.18, 0, -0.12],
};

export const offerStone: Pose = {
  neck: [0.18, -0.2, 0],
  armR: [-0.95, 0.45, 0.2],
  armL: [-0.7, -0.2, -0.28],
};

export const pointCabinet: Pose = {
  hips: [0, 0.35, 0],
  neck: [0.05, 0.4, 0],
  armR: [-1.35, 0.55, 0.15],
  armL: [-0.15, 0, -0.1],
};

export const operateCnc: Pose = {
  hips: [0.12, 0.08, 0],
  neck: [0.32, 0.1, 0],
  armR: [-0.82, 0.28, 0.22],
  armL: [-0.7, -0.18, -0.2],
};

export const benchWork: Pose = {
  hips: [0.16, 0, 0],
  neck: [0.5, 0.06, 0],
  armR: [-1.12, 0.18, 0.32],
  armL: [-0.95, -0.12, -0.28],
  lift: -0.6,
};

export const drawPistol: Pose = {
  hips: [0, 0.12, 0],
  neck: [0.08, 0.16, 0],
  armR: [-1.42, 0.1, 0.12],
  armL: [-0.35, 0, -0.2],
};

export const inspectPalm: Pose = {
  hips: [0.08, 0, 0],
  neck: [0.55, 0, 0],
  armR: [-0.85, 0.55, 0.7],
  armL: [-0.4, 0, -0.1],
};

export const twistGlove: Pose = {
  hips: [-0.12, 0.2, 0],
  neck: [0.18, 0.22, 0],
  armR: [-0.55, 0.4, 0.85],
  armL: [-1.15, -0.3, -0.4],
  legR: [-0.4, 0, 0.12],
  legL: [-0.3, 0, -0.1],
  lift: 0.4,
};

export function spaceAim(pitch: number, yaw: number, time: number): Pose {
  const drifting = float(time);
  const aimed = aim(pitch, yaw);
  return {
    hips: [drifting.hips![0]! * 0.35, yaw * 0.4, drifting.hips![2]!],
    neck: [pitch * 0.55, yaw * 0.45, 0],
    armR: aimed.armR,
    armL: [-0.85 + pitch * 0.2, yaw * 0.2, -0.28],
    legR: drifting.legR,
    legL: drifting.legL,
    lift: drifting.lift,
  };
}

export function limpFloat(time: number, seed: number): Pose {
  const f = float(time * 0.7 + seed);
  return {
    hips: [0.55 + Math.sin(time + seed) * 0.08, f.hips![1], 0.3],
    neck: [0.5, 0.2, 0.15],
    armR: [-0.2, 0, 0.7],
    armL: [-0.15, 0, -0.75],
    legR: [-0.15, 0, 0.2],
    legL: [-0.1, 0, -0.18],
    lift: f.lift,
  };
}

export function photoPose(time: number, index: number): Pose {
  const f = float(time * 0.45 + index * 0.7);
  const wave = index % 3 === 0 ? -0.2 : 0;
  return {
    hips: [-0.05, f.hips![1]! * 0.4, 0],
    neck: [0.02, Math.sin(time * 0.2 + index) * 0.08, 0],
    armR: [-0.25 + wave, 0, 0.18],
    armL: [-0.25, 0, -0.18],
    legR: [-0.12, 0, 0.06],
    legL: [-0.08, 0, -0.06],
    lift: f.lift! * 0.4,
  };
}

export { aim, float, idle, lerpPose, walk };
