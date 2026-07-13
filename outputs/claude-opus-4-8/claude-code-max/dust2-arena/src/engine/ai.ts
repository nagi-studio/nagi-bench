// Bot brain: a compact state machine driving perception, navigation (grid A*),
// combat (face + strafe + burst fire with reaction delay + aim error) and the
// C4 objective (T push/plant, CT hold/defuse). It only sets an actor's intents
// and calls world combat helpers; physics + firing live in GameWorld.

import { AI } from './constants';
import { findPath } from './navmesh';
import { angleDelta, moveAngleToward, rand, yawFromDir } from './mathUtils';
import { BombState, Team } from './types';
import { WEAPONS } from './weapons';
import type { Actor, GameWorld } from './world';

export type BotMode = 'advance' | 'engage' | 'search' | 'hold' | 'plant' | 'defuse' | 'pickup';

export interface BotState {
  mode: BotMode;
  path: { x: number; z: number }[];
  pathIdx: number;
  repath: number;
  goalX: number;
  goalZ: number;
  hasGoal: boolean;
  target: number;
  lastSeen: number;
  lastSeenX: number;
  lastSeenZ: number;
  reactAt: number;
  nextBurst: number;
  burstUntil: number;
  strafeDir: number;
  strafeUntil: number;
  wanderYaw: number;
  targetSite?: 'A' | 'B';
  defendSite?: 'A' | 'B';
}

export function initBotState(s?: BotState): BotState {
  const base: BotState = {
    mode: 'advance',
    path: [],
    pathIdx: 0,
    repath: 0,
    goalX: 0,
    goalZ: 0,
    hasGoal: false,
    target: -1,
    lastSeen: -99,
    lastSeenX: 0,
    lastSeenZ: 0,
    reactAt: 0,
    nextBurst: 0,
    burstUntil: 0,
    strafeDir: 1,
    strafeUntil: 0,
    wanderYaw: 0,
  };
  if (s) {
    const keepT = s.targetSite;
    const keepD = s.defendSite;
    Object.assign(s, base);
    s.targetSite = keepT;
    s.defendSite = keepD;
    return s;
  }
  return base;
}

function setGoal(world: GameWorld, a: Actor, gx: number, gz: number): void {
  const bs = a.bs;
  const moved = (gx - bs.goalX) ** 2 + (gz - bs.goalZ) ** 2 > 9;
  bs.goalX = gx;
  bs.goalZ = gz;
  bs.hasGoal = true;
  if (moved || !bs.path.length || bs.repath <= 0) {
    const p = findPath(world.grid, a.x, a.z, gx, gz);
    bs.path = p ?? [];
    bs.pathIdx = 0;
    bs.repath = AI.repathInterval;
  }
}

// steer along the current path; returns false when the path is exhausted
function followPath(a: Actor): boolean {
  const bs = a.bs;
  if (bs.pathIdx >= bs.path.length) return false;
  let wp = bs.path[bs.pathIdx];
  let dx = wp.x - a.x;
  let dz = wp.z - a.z;
  let d = Math.hypot(dx, dz);
  while (d < 1.1 && bs.pathIdx < bs.path.length - 1) {
    bs.pathIdx++;
    wp = bs.path[bs.pathIdx];
    dx = wp.x - a.x;
    dz = wp.z - a.z;
    d = Math.hypot(dx, dz);
  }
  if (bs.pathIdx >= bs.path.length - 1 && d < 1.1) {
    bs.pathIdx = bs.path.length;
    return false;
  }
  if (d > 1e-3) {
    a.moveX = dx / d;
    a.moveZ = dz / d;
  }
  return true;
}

export function updateBot(world: GameWorld, a: Actor, dt: number, canMove: boolean): void {
  const bs = a.bs;
  bs.repath -= dt;
  a.moveX = 0;
  a.moveZ = 0;
  a.wantRun = true;
  a.action = 'none';

  // --- perception ---
  const seen = world.nearestVisibleEnemy(a, AI.fovDeg);
  if (seen) {
    if (bs.target !== seen.id) {
      bs.target = seen.id;
      bs.reactAt = world.time + AI.reactionTime + rand(0, 0.12);
    }
    bs.lastSeen = world.time;
    bs.lastSeenX = seen.x;
    bs.lastSeenZ = seen.z;
    bs.mode = 'engage';
  } else if (bs.mode === 'engage') {
    bs.mode = world.time - bs.lastSeen < 3 ? 'search' : 'advance';
    bs.target = -1;
  }

  if (!canMove) {
    // during freeze, just face forward
    return;
  }

  const bomb = world.bombInfo();

  if (bs.mode === 'engage' && seen) {
    combat(world, a, seen, dt);
    return;
  }

  // --- objective / navigation ---
  if (bs.mode === 'search') {
    setGoal(world, a, bs.lastSeenX, bs.lastSeenZ);
    if ((bs.lastSeenX - a.x) ** 2 + (bs.lastSeenZ - a.z) ** 2 < 4 || !followPathOrArrive(world, a)) {
      bs.mode = 'advance';
    }
    faceMovement(a, dt);
    return;
  }

  if (a.team === Team.T) {
    objectiveT(world, a, bomb.state, bomb.x, bomb.z);
  } else {
    objectiveCT(world, a, bomb.state, bomb.x, bomb.z);
  }
  faceMovement(a, dt);
}

function followPathOrArrive(world: GameWorld, a: Actor): boolean {
  const moving = followPath(a);
  if (!moving) {
    // recompute once toward goal in case we stalled
    if (a.bs.hasGoal) {
      const d2 = (a.bs.goalX - a.x) ** 2 + (a.bs.goalZ - a.z) ** 2;
      if (d2 > 4 && a.bs.repath <= 0) setGoal(world, a, a.bs.goalX, a.bs.goalZ);
    }
    return false;
  }
  return true;
}

function objectiveT(world: GameWorld, a: Actor, bombState: BombState, bx: number, bz: number): void {
  const bs = a.bs;
  const site = world.dust2.sites[(bs.targetSite ?? 'A') as 'A' | 'B'];

  if (bombState === BombState.Dropped) {
    // nearest T without bomb goes for the pickup
    if (isNearestTeammateTo(world, a, bx, bz)) {
      setGoal(world, a, bx, bz);
      followPathOrArrive(world, a);
      world.pickupBomb(a);
      return;
    }
  }

  if (a.hasBomb && bombState === BombState.Carried) {
    const inSite = world.isInSite(a) === bs.targetSite || world.isInSite(a) !== null;
    if (inSite && a.grounded) {
      // plant if no enemy currently threatening
      a.action = 'plant';
      a.moveX = a.moveZ = 0;
      return;
    }
    setGoal(world, a, site.center.x, site.center.z);
    followPathOrArrive(world, a);
    return;
  }

  if (bombState === BombState.Planted) {
    // defend near the bomb
    const spot = spreadAround(a, bx, bz, 8);
    setGoal(world, a, spot.x, spot.z);
    followPathOrArrive(world, a);
    return;
  }

  // support push toward the target site
  const spot = spreadAround(a, site.center.x, site.center.z, 7);
  setGoal(world, a, spot.x, spot.z);
  followPathOrArrive(world, a);
}

function objectiveCT(world: GameWorld, a: Actor, bombState: BombState, bx: number, bz: number): void {
  const bs = a.bs;
  if (bombState === BombState.Planted) {
    // rotate to defuse
    const dist2 = (bx - a.x) ** 2 + (bz - a.z) ** 2;
    if (dist2 < 2.3 * 2.3 && a.grounded) {
      a.action = 'defuse';
      a.moveX = a.moveZ = 0;
      return;
    }
    setGoal(world, a, bx, bz);
    followPathOrArrive(world, a);
    return;
  }
  // hold the assigned site
  const site = world.dust2.sites[(bs.defendSite ?? 'A') as 'A' | 'B'];
  const d2 = (site.center.x - a.x) ** 2 + (site.center.z - a.z) ** 2;
  if (d2 > 10 * 10) {
    setGoal(world, a, site.center.x, site.center.z);
    followPathOrArrive(world, a);
  } else {
    // patrol slowly around the site
    if (world.time > a.bs.strafeUntil) {
      a.bs.strafeUntil = world.time + rand(2, 4);
      const ang = rand(0, Math.PI * 2);
      setGoal(world, a, site.center.x + Math.cos(ang) * 6, site.center.z + Math.sin(ang) * 6);
    }
    a.wantRun = false;
    followPathOrArrive(world, a);
  }
}

function isNearestTeammateTo(world: GameWorld, a: Actor, x: number, z: number): boolean {
  const myD = (a.x - x) ** 2 + (a.z - z) ** 2;
  for (const t of world.actors) {
    if (!t.alive || t.team !== a.team || t.id === a.id || t.isPlayer) continue;
    const d = (t.x - x) ** 2 + (t.z - z) ** 2;
    if (d < myD) return false;
  }
  return true;
}

function spreadAround(a: Actor, x: number, z: number, spread: number): { x: number; z: number } {
  // deterministic per-bot offset so bots don't stack on one point
  const ang = (a.id * 1.3) % (Math.PI * 2);
  return { x: x + Math.cos(ang) * spread * 0.7, z: z + Math.sin(ang) * spread * 0.7 };
}

function faceMovement(a: Actor, dt: number): void {
  if (Math.abs(a.moveX) + Math.abs(a.moveZ) > 1e-3) {
    const desired = yawFromDir(a.moveX, a.moveZ);
    a.yaw = moveAngleToward(a.yaw, desired, AI.aimSpeed * dt);
  }
  a.pitch += (0 - a.pitch) * Math.min(1, dt * 6);
}

function combat(world: GameWorld, a: Actor, target: Actor, dt: number): void {
  const bs = a.bs;
  const dx = target.x - a.x;
  const dz = target.z - a.z;
  const dist = Math.hypot(dx, dz);

  // aim (with error)
  const err = AI.aimError;
  const desiredYaw = yawFromDir(dx, dz) + rand(-err, err);
  const eyeY = a.y + a.eyeH;
  const targetY = target.y + 1.15;
  const desiredPitch = Math.atan2(targetY - eyeY, Math.max(0.5, dist)) + rand(-err, err);
  a.yaw = moveAngleToward(a.yaw, desiredYaw, AI.aimSpeed * dt);
  a.pitch += (desiredPitch - a.pitch) * Math.min(1, dt * 10);

  // movement: strafe + keep an ideal range
  if (world.time > bs.strafeUntil) {
    bs.strafeUntil = world.time + rand(0.5, 1.3);
    bs.strafeDir = Math.random() < 0.5 ? 1 : -1;
  }
  const perpX = -dz / (dist || 1);
  const perpZ = dx / (dist || 1);
  let mx = perpX * bs.strafeDir;
  let mz = perpZ * bs.strafeDir;
  const ideal = a.current === 'awp' ? 24 : 14;
  if (dist > ideal + 6) {
    mx += dx / dist;
    mz += dz / dist;
  } else if (dist < ideal - 6) {
    mx -= dx / dist;
    mz -= dz / dist;
  }
  const ml = Math.hypot(mx, mz) || 1;
  a.moveX = mx / ml;
  a.moveZ = mz / ml;
  a.wantRun = false; // walk while fighting = more accurate

  // fire control
  const w = WEAPONS[a.current];
  const ammo = a.ammo[a.current];
  if (ammo && ammo.mag <= 0) {
    world.startReload(a);
    return;
  }
  const aligned = Math.abs(angleDelta(a.yaw, desiredYaw)) < 0.13;
  const reacted = world.time >= bs.reactAt;
  if (!reacted || !aligned) return;
  if (!world.canSee(a, target, 200)) return;

  if (w.automatic) {
    if (world.time > bs.nextBurst) {
      bs.burstUntil = world.time + rand(AI.burstMin, AI.burstMax);
      bs.nextBurst = bs.burstUntil + rand(0.18, 0.45);
    }
    if (world.time <= bs.burstUntil) world.fireWeapon(a);
  } else {
    world.fireWeapon(a);
  }
}
