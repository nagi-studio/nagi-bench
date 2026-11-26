import { aim, float, idle, lerpPose, walk, type Pose } from "@agentbench/voxel-kit";

/**
 * Authored acting poses & deterministic choreography helpers.
 * Every pose blends and extends the kit's joint mechanics so characters act
 * with weight, stillness, precision, or zero-G physicality — never stiff presets.
 */

export function poseMilitaryStand(t: number, headYaw = 0, headPitch = 0): Pose {
  const base = idle(t);
  return {
    hips: [0, 0, 0],
    neck: [headPitch + Math.sin(t * 1.1) * 0.015, headYaw, 0],
    armR: [0.04, 0, 0.06],
    armL: [0.04, 0, -0.06],
    legR: [0, 0, 0.02],
    legL: [0, 0, -0.02],
    lift: (base.lift ?? 0) * 0.5,
  };
}

export function poseWalkMilitary(t: number, headYaw = 0): Pose {
  const w = walk(t, 1.25);
  return {
    ...w,
    neck: [0.02, headYaw, 0],
  };
}

/** Collector hunched gently over his workbench examining a meteorite with magnifier. */
export function poseInspectWorkbench(t: number): Pose {
  const sway = Math.sin(t * 1.3);
  return {
    hips: [0.16, 0.04 * sway, 0],
    neck: [0.36 + Math.sin(t * 2.1) * 0.03, -0.08 + sway * 0.05, 0],
    armR: [-0.92 + Math.sin(t * 1.8) * 0.05, -0.18, 0.16],
    armL: [-0.72, 0.22, -0.18],
    legR: [-0.14, 0, 0.04],
    legL: [-0.14, 0, -0.04],
    lift: -0.45,
  };
}

/** Collector welcoming & speaking warmly across the table. */
export function poseWarmTalk(t: number, gesture = 1): Pose {
  const g = Math.sin(t * 2.4) * gesture;
  const g2 = Math.cos(t * 1.7) * gesture;
  return {
    hips: [0.04, Math.sin(t * 0.7) * 0.05, 0],
    neck: [-0.03 + Math.sin(t * 1.9) * 0.04, Math.sin(t * 0.9) * 0.1, 0],
    armR: [-0.62 + g * 0.18, -0.18, 0.18 + g2 * 0.06],
    armL: [-0.48 - g2 * 0.14, 0.15, -0.16],
    legR: [0, 0, 0.03],
    legL: [0, 0, -0.03],
    lift: Math.sin(t * 1.5) * 0.06,
  };
}

/** Collector pouring steaming tea into cups. */
export function posePourTea(t: number, pourAmount: number): Pose {
  return {
    hips: [0.12 * pourAmount, -0.08, 0],
    neck: [0.22 * pourAmount, -0.12, 0],
    armR: [-0.88 - 0.32 * pourAmount, -0.25, 0.18 + 0.22 * pourAmount],
    armL: [-0.52, 0.2, -0.12],
    lift: -0.2 * pourAmount + Math.sin(t * 1.4) * 0.04,
  };
}

/** Zhang Beihai raising ceramic teacup thoughtfully ("这茶杯里面盛的也是陨石"). */
export function poseHoldTeacup(t: number, raiseAmount: number): Pose {
  const b = Math.sin(t * 1.4) * 0.02;
  return {
    hips: [0.02, -0.04, 0],
    neck: [0.04 - 0.06 * raiseAmount, 0.06, 0],
    armR: [-0.35 - 0.85 * raiseAmount + b, -0.26 * raiseAmount, 0.12],
    armL: [-0.15, 0, -0.08],
    lift: b * 2,
  };
}

/** Zhang Beihai lifting phone to immediately transfer 180,000 yuan. */
export function poseHoldPhone(t: number, liftAmt: number): Pose {
  return {
    hips: [0, 0, 0],
    neck: [0.14 * liftAmt, 0.04, 0],
    armR: [-0.25 - 0.82 * liftAmt, -0.22 * liftAmt, 0.1],
    armL: [-0.2 - 0.48 * liftAmt, 0.24 * liftAmt, -0.14],
    lift: Math.sin(t * 1.3) * 0.05,
  };
}

/** Zhang Beihai operating CNC console & monitoring spinning meteorite chuck. */
export function poseOperateCNC(t: number, inspectLathe: number): Pose {
  const typing = Math.sin(t * 8.5) * 0.05 * (1 - inspectLathe);
  return {
    hips: [0.08, -0.15 + 0.35 * inspectLathe, 0],
    neck: [0.16, -0.18 + 0.48 * inspectLathe, 0],
    armR: [-0.95 + typing, -0.15 + 0.2 * inspectLathe, 0.12],
    armL: [-0.88 - typing, 0.2, -0.12],
    lift: -0.15,
  };
}

/** Precise tabletop assembly in the basement (pliers, gluing meteorite bullets, loading mags). */
export function poseBasementCraft(t: number, phaseCycle: number): Pose {
  const work = Math.sin(phaseCycle * Math.PI * 2);
  return {
    hips: [0.18, 0, 0],
    neck: [0.42, Math.sin(t * 0.8) * 0.06, 0],
    armR: [-1.05 + work * 0.12, -0.28, 0.12],
    armL: [-0.98 - work * 0.08, 0.28, -0.12],
    legR: [-0.12, 0, 0.05],
    legL: [-0.12, 0, -0.05],
    lift: -0.6,
  };
}

/** Two-handed pistol stance with crisp upward muzzle recoil impulse! */
export function poseBasementShoot(pitch: number, yaw: number, recoil: number): Pose {
  const base = aim(pitch - recoil * 0.24, yaw);
  return {
    ...base,
    hips: [-0.04 - recoil * 0.04, yaw * 0.35 - 0.12, 0],
    neck: [pitch * 0.5 - recoil * 0.06, yaw * 0.35 + 0.08, 0],
    legR: [-0.2, 0.08, 0.06],
    legL: [0.16, -0.06, -0.06],
    lift: -0.35,
  };
}

/** Weightless waiting in deep synchronous orbit — serene, suspended, detached. */
export function poseOrbitSolitude(t: number): Pose {
  const f = float(t * 0.72);
  return {
    hips: [
      (f.hips?.[0] ?? -0.2) * 0.85,
      Math.sin(t * 0.22) * 0.08,
      Math.cos(t * 0.28) * 0.04,
    ],
    neck: [0.06 + Math.sin(t * 0.38) * 0.05, Math.sin(t * 0.26) * 0.08, 0],
    armR: [-0.45 + Math.sin(t * 0.44) * 0.1, -0.12, 0.26],
    armL: [-0.38 + Math.cos(t * 0.4) * 0.1, 0.14, -0.3],
    legR: [-0.48 + Math.sin(t * 0.36) * 0.08, 0, 0.1],
    legL: [-0.22 + Math.cos(t * 0.34) * 0.08, 0, -0.12],
    lift: Math.sin(t * 0.45) * 0.42,
  };
}

/** Holding modified rifle scope up to helmet visor in zero-G. */
export function poseOrbitScopeScan(t: number, scanYaw = 0): Pose {
  const drift = poseOrbitSolitude(t);
  return {
    ...drift,
    hips: [-0.14, scanYaw * 0.25, 0.03 * Math.sin(t * 0.5)],
    neck: [-0.04, scanYaw * 0.5, 0],
    armR: [-1.42, -0.36, 0.16], // raises scope right to eye level
    armL: [-0.52, 0.16, -0.34],
  };
}

/** Removing the right spacesuit glove in -100°C vacuum (left hand twists right wrist ring). */
export function poseRemoveGlove(t: number, progress: number): Pose {
  const drift = poseOrbitSolitude(t);
  if (progress < 0.42) {
    // Twisting wrist lock ring & pulling glove off
    const p = progress / 0.42;
    return {
      ...drift,
      hips: [-0.1, 0.12 * p, 0],
      neck: [0.22, -0.08, 0],
      armR: [-1.05, -0.26, 0.15],
      armL: [-1.18 + 0.14 * Math.sin(p * Math.PI * 3), 0.48 - 0.12 * p, -0.1],
    };
  }
  if (progress < 0.72) {
    // Reaching right cloth-gloved hand to side work pouch for pistol & warming in sunset
    const p = (progress - 0.42) / 0.3;
    return {
      ...drift,
      hips: [-0.08, 0.18 * (1 - p), 0],
      neck: [0.14, -0.12 * p, 0],
      armR: [-0.45 - 0.45 * p, -0.15, 0.32 * (1 - p) + 0.12],
      armL: [-1.12, 0.18, -0.22], // reaching for floating scope
    };
  }
  // Snapping magnetic scope onto pistol rail!
  const p = (progress - 0.72) / 0.28;
  return {
    ...drift,
    hips: [-0.08, 0, 0],
    neck: [0.1, 0, 0],
    armR: [-1.32 - 0.18 * p, -0.18, 0.08],
    armL: [-1.38 - 0.14 * p, 0.32 * (1 - p) + 0.18, -0.14],
  };
}

/** Zero-G precision pistol firing (3 bursts of 10 + crisp zero-G magazine swaps!). */
export function poseOrbitPistolFire(
  t: number,
  yaw: number,
  recoil: number,
  reloading: number,
): Pose {
  const drift = poseOrbitSolitude(t);
  const aimingPose: Pose = {
    hips: [-0.12 - recoil * 0.05, yaw * 0.3, 0],
    neck: [-0.02 - recoil * 0.04, yaw * 0.4, 0],
    armR: [-Math.PI / 2 - recoil * 0.18, yaw * 0.22 - 0.08, 0.06],
    armL: [-Math.PI / 2 - recoil * 0.16, yaw * 0.22 + 0.24, -0.22],
    legR: drift.legR,
    legL: drift.legL,
    lift: drift.lift,
  };
  if (reloading <= 0.001) return aimingPose;

  const reloadPose: Pose = {
    hips: [-0.14, yaw * 0.2, 0],
    neck: [0.22, yaw * 0.2, 0],
    armR: [-1.05, -0.22, 0.14],
    armL: [-0.72, 0.36, -0.18],
    legR: drift.legR,
    legL: drift.legL,
    lift: drift.lift,
  };
  return lerpPose(aimingPose, reloadPose, Math.sin(reloading * Math.PI));
}

/** Astronauts floating politely in zero-G rows waiting for the group photo. */
export function posePhotoLineup(t: number, seed: number): Pose {
  const phase = t * 0.6 + seed * 1.9;
  return {
    hips: [-0.08 + Math.sin(phase) * 0.04, Math.sin(phase * 0.7) * 0.07, Math.cos(phase * 0.5) * 0.03],
    neck: [0.02, Math.sin(phase * 0.4) * 0.08, 0],
    armR: [-0.32 + Math.sin(phase) * 0.08, -0.06, 0.24],
    armL: [-0.28 + Math.cos(phase) * 0.08, 0.06, -0.24],
    legR: [-0.22 + Math.sin(phase * 0.8) * 0.05, 0, 0.08],
    legL: [-0.14 + Math.cos(phase * 0.8) * 0.05, 0, -0.08],
    lift: Math.sin(phase) * 0.3,
  };
}

/** Photographer floating opposite the group holding the orbital camera up. */
export function posePhotographer(t: number): Pose {
  const s = Math.sin(t * 0.8);
  return {
    hips: [-0.1, s * 0.05, 0],
    neck: [0.05, 0, 0],
    armR: [-1.35, -0.28, 0.14],
    armL: [-1.32, 0.28, -0.14],
    legR: [-0.38, 0, 0.12],
    legL: [-0.2, 0, -0.12],
    lift: s * 0.35,
  };
}

/** Struck casualty tumbling limply / jolting backward in zero-G. */
export function poseCasualtyImpact(t: number, sinceHit: number, seed: number): Pose {
  const shock = Math.min(1, sinceHit * 2.4);
  const limp = Math.sin(t * 1.4 + seed);
  return {
    hips: [-0.45 * shock + limp * 0.12, seed * 0.3 + sinceHit * 0.35, 0.32 * Math.sin(sinceHit * 1.8 + seed)],
    neck: [-0.32 * shock, 0.22 * limp, 0.18 * shock],
    armR: [-1.8 * shock + limp * 0.25, -0.3, 0.65 * shock],
    armL: [-1.4 * shock - limp * 0.25, 0.25, -0.72 * shock],
    legR: [-0.7 * shock, 0, 0.24],
    legL: [0.22 * shock, 0, -0.28],
    lift: limp * 0.4,
  };
}

/** Panicked colleague firing full backpack thrusters & racing back to airlock. */
export function posePanicEvac(t: number, seed: number): Pose {
  const p = t * 4.5 + seed * 2.1;
  return {
    hips: [0.48, Math.sin(p * 0.5) * 0.12, 0],
    neck: [-0.36, Math.sin(p) * 0.22, 0],
    armR: [-1.45 + Math.sin(p) * 0.28, -0.12, 0.35],
    armL: [-1.25 - Math.cos(p) * 0.28, 0.12, -0.35],
    legR: [0.35 + Math.sin(p) * 0.18, 0, 0.1],
    legL: [0.2 - Math.sin(p) * 0.18, 0, -0.1],
    lift: Math.sin(p * 0.6) * 0.3,
  };
}
