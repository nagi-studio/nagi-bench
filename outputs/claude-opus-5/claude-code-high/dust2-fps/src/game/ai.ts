import { angleDelta, approachAngle, clamp, dirToYaw, dist2D, vclone } from '../core/math.ts';
import type { Rng, Vec3 } from '../core/math.ts';
import type { RoundPhase } from '../core/types.ts';
import type { NavGraph } from '../map/nav.ts';
import type { World } from '../map/world.ts';
import type { Actor } from './actor.ts';
import {
  activeDef,
  activeWeapon,
  canReload,
  chestPos,
  eyePos,
  isReloading,
  startReload,
  switchSlot,
} from './actor.ts';
import type { CombatCtx } from './combat.ts';
import { currentSpread, tryFire } from './combat.ts';
import { NO_INPUT } from './physics.ts';
import type { MoveIntent } from './physics.ts';

/** The slice of round state the bots reason about. */
export interface RoundView {
  phase: RoundPhase;
  bombPlanted: boolean;
  bombDropped: boolean;
  /** World position of the bomb (planted, dropped, or on its carrier). */
  bombPos: Vec3 | null;
  bombCarrierId: number;
  bombSite: 'A' | 'B' | null;
  /** Site the attacking side is committed to this round. */
  targetSite: 'A' | 'B';
  timeLeft: number;
}

export interface AICtx {
  world: World;
  nav: NavGraph;
  actors: Actor[];
  rng: Rng;
  time: number;
  dt: number;
  round: RoundView;
  combat: CombatCtx;
}

export interface BotOutput {
  intent: MoveIntent;
  wantPlant: boolean;
  wantDefuse: boolean;
}

const VIEW_RANGE = 75;
const FOV_COS = Math.cos(1.05); // ~120 degrees total
const REPATH_INTERVAL = 1.4;

/**
 * One tick of bot behaviour: perceive -> decide -> act.
 * Everything is driven off the same movement/combat code the human uses, so a
 * bot the player takes over behaves identically.
 */
export function updateBot(a: Actor, ctx: AICtx): BotOutput {
  const out: BotOutput = { intent: { ...NO_INPUT }, wantPlant: false, wantDefuse: false };
  const ai = a.ai;
  if (!a.alive) return out;

  ai.decisionTimer -= ctx.dt;
  ai.repathTimer -= ctx.dt;
  ai.reactionTimer -= ctx.dt;
  ai.aimErrorTimer -= ctx.dt;
  ai.fireTimer -= ctx.dt;
  ai.burstTimer -= ctx.dt;
  ai.strafeTimer -= ctx.dt;

  if (ctx.round.phase === 'freeze') {
    lookAt(a, ctx, forwardAnchor(a, ctx));
    return out;
  }

  const target = perceive(a, ctx);

  if (ai.decisionTimer <= 0) {
    ai.decisionTimer = 0.25 + ctx.rng.next() * 0.25;
    decideMode(a, ctx, target);
  }

  switch (ai.mode) {
    case 'engage':
      engage(a, ctx, target, out);
      break;
    case 'plant':
      out.wantPlant = doPlant(a, ctx, out);
      break;
    case 'defuse':
      out.wantDefuse = doDefuse(a, ctx, out);
      break;
    case 'hold':
      hold(a, ctx, out);
      break;
    case 'hunt':
    case 'advance':
    case 'rotate':
    default:
      travel(a, ctx, out);
      break;
  }

  manageWeapon(a, ctx, target);
  return out;
}

// ---------------------------------------------------------------- perception

function perceive(a: Actor, ctx: AICtx): Actor | null {
  const ai = a.ai;
  const eye = eyePos(a);
  let best: Actor | null = null;
  let bestScore = -Infinity;

  for (const other of ctx.actors) {
    if (!other.alive || other.team === a.team) continue;
    const d = dist2D(a.pos, other.pos);
    if (d > VIEW_RANGE) continue;
    const chest = chestPos(other);
    const dx = chest.x - eye.x;
    const dz = chest.z - eye.z;
    const len = Math.hypot(dx, dz) || 1;
    // Field of view (bots are not omniscient) — very close enemies are always noticed.
    if (d > 3) {
      const fx = -Math.sin(a.yaw);
      const fz = -Math.cos(a.yaw);
      if ((dx / len) * fx + (dz / len) * fz < FOV_COS) continue;
    }
    if (!ctx.world.losClear(eye, chest)) continue;

    // Prefer close, already-engaged, low-health targets.
    let score = 100 - d;
    if (other.id === ai.targetId) score += 25;
    if (other.health < 50) score += 15;
    if (score > bestScore) {
      bestScore = score;
      best = other;
    }
  }

  if (best) {
    if (ai.targetId !== best.id) {
      // New contact: reaction delay scales inversely with skill.
      ai.reactionTimer = 0.34 - 0.22 * ai.skill + ctx.rng.next() * 0.12;
      ai.targetId = best.id;
    }
    ai.lastSeen = vclone(best.pos);
    ai.lastSeenTime = ctx.time;
  } else if (ctx.time - ai.lastSeenTime > 2.5) {
    ai.targetId = -1;
  }
  return best;
}

/** Called by the engine when a shot is fired nearby: bots hear it. */
export function hearNoise(a: Actor, pos: Vec3, time: number, loudness: number): void {
  if (!a.alive) return;
  const d = dist2D(a.pos, pos);
  if (d > 45 * loudness) return;
  const ai = a.ai;
  if (ai.alertPos && time - ai.alertTime < 1.5 && dist2D(ai.alertPos, a.pos) < d) return;
  ai.alertPos = vclone(pos);
  ai.alertTime = time;
}

// ------------------------------------------------------------------ decision

function decideMode(a: Actor, ctx: AICtx, target: Actor | null): void {
  const ai = a.ai;
  const r = ctx.round;

  if (target) {
    ai.mode = 'engage';
    return;
  }

  const attacking = a.team === 'T';

  // --- bomb duties come first ------------------------------------------
  if (attacking && a.hasBomb && !r.bombPlanted) {
    const site = ctx.world.siteAt(a.pos);
    if (site && a.grounded) {
      ai.mode = 'plant';
      return;
    }
    ai.mode = 'advance';
    setGoalSite(a, ctx, ai.site ?? r.targetSite);
    return;
  }
  if (!attacking && r.bombPlanted && r.bombPos) {
    const d = dist2D(a.pos, r.bombPos);
    if (d < 1.6) {
      ai.mode = 'defuse';
      return;
    }
    ai.mode = 'rotate';
    setGoal(a, ctx, r.bombPos, 'bomb');
    return;
  }
  if (attacking && r.bombDropped && r.bombPos && !r.bombPlanted && nearestTToBomb(a, ctx)) {
    ai.mode = 'advance';
    setGoal(a, ctx, r.bombPos, 'pickup_bomb');
    return;
  }

  // --- investigate recent contact ---------------------------------------
  const memory = ai.lastSeen && ctx.time - ai.lastSeenTime < 6;
  const alerted = ai.alertPos && ctx.time - ai.alertTime < 7;
  if (memory && ai.lastSeen) {
    ai.mode = 'hunt';
    setGoal(a, ctx, ai.lastSeen, 'last_seen');
    return;
  }
  if (alerted && ai.alertPos && ai.aggression > 0.35) {
    ai.mode = 'hunt';
    setGoal(a, ctx, ai.alertPos, 'noise');
    return;
  }

  // --- default objective play -------------------------------------------
  if (attacking) {
    if (r.bombPlanted && r.bombPos) {
      // Post-plant: hold an angle covering the bomb.
      if (!ai.holdSpot || dist2D(a.pos, ai.holdSpot) < 2.5) {
        ai.holdSpot = pickHoldSpot(a, ctx, r.bombPos, 16);
      }
      if (ai.holdSpot && dist2D(a.pos, ai.holdSpot) > 2.0) {
        ai.mode = 'advance';
        setGoal(a, ctx, ai.holdSpot, 'post_plant');
      } else {
        ai.mode = 'hold';
      }
      return;
    }
    const site = ai.site ?? r.targetSite;
    const inSite = ctx.world.siteAt(a.pos) === site;
    if (inSite) {
      ai.mode = 'hold';
      if (!ai.holdSpot) ai.holdSpot = pickHoldSpot(a, ctx, a.pos, 8);
      return;
    }
    ai.mode = 'advance';
    setGoalSite(a, ctx, site);
    return;
  }

  // Defenders: sit on their assigned site, occasionally shuffling positions.
  const site = ai.site ?? 'A';
  const zone = ctx.world.bombsites[site];
  const inSite =
    a.pos.x > zone.x1 - 12 && a.pos.x < zone.x2 + 12 && a.pos.z > zone.z1 - 12 && a.pos.z < zone.z2 + 12;
  if (!inSite) {
    ai.mode = 'advance';
    setGoalSite(a, ctx, site);
    return;
  }
  if (!ai.holdSpot || dist2D(a.pos, ai.holdSpot) < 1.5) {
    if (!ai.holdSpot || ctx.rng.next() < 0.5) {
      ai.holdSpot = pickHoldSpot(a, ctx, { x: (zone.x1 + zone.x2) / 2, y: 0, z: (zone.z1 + zone.z2) / 2 }, 13);
    }
  }
  if (ai.holdSpot && dist2D(a.pos, ai.holdSpot) > 2) {
    ai.mode = 'advance';
    setGoal(a, ctx, ai.holdSpot, 'hold_spot');
  } else {
    ai.mode = 'hold';
  }
}

function nearestTToBomb(a: Actor, ctx: AICtx): boolean {
  if (!ctx.round.bombPos) return false;
  const myDist = dist2D(a.pos, ctx.round.bombPos);
  for (const o of ctx.actors) {
    if (!o.alive || o.team !== a.team || o.id === a.id) continue;
    if (dist2D(o.pos, ctx.round.bombPos) < myDist - 0.5) return false;
  }
  return true;
}

function pickHoldSpot(a: Actor, ctx: AICtx, center: Vec3, radius: number): Vec3 | null {
  let best: Vec3 | null = null;
  let bestScore = -Infinity;
  for (let i = 0; i < 10; i++) {
    const ang = ctx.rng.next() * Math.PI * 2;
    const r = 2 + ctx.rng.next() * radius;
    const x = center.x + Math.cos(ang) * r;
    const z = center.z + Math.sin(ang) * r;
    if (ctx.world.grid.isSolidAt(x, z)) continue;
    const y = ctx.world.grid.floorAt(x, z);
    if (!ctx.world.circleFree(x, z, y, 0.45)) continue;
    const p = { x, y, z };
    // Prefer spots near cover that still see the objective.
    const clearance = ctx.world.clearanceAt(x, z);
    const sees = ctx.world.losClear({ x, y: y + 1.5, z }, { x: center.x, y: center.y + 1.0, z: center.z });
    const score = (sees ? 20 : 0) - Math.abs(clearance - 3) * 2 + ctx.rng.next() * 4;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

function forwardAnchor(a: Actor, ctx: AICtx): Vec3 {
  const site = a.ai.site ?? ctx.round.targetSite;
  const zone = ctx.world.bombsites[site];
  return { x: (zone.x1 + zone.x2) / 2, y: 1.5, z: (zone.z1 + zone.z2) / 2 };
}

// -------------------------------------------------------------------- goals

function setGoal(a: Actor, ctx: AICtx, goal: Vec3, name: string): void {
  const ai = a.ai;
  if (ai.goalName === name && ai.goal && dist2D(ai.goal, goal) < 2 && ai.path.length > 0) return;
  ai.goal = vclone(goal);
  ai.goalName = name;
  requestPath(a, ctx);
}

function setGoalSite(a: Actor, ctx: AICtx, site: 'A' | 'B'): void {
  const ai = a.ai;
  const name = `site_${site}`;
  if (ai.goalName === name && ai.path.length > 0 && ai.pathIndex < ai.path.length) return;
  const anchors = ctx.world.anchors(site === 'A' ? 'a_site' : 'b_site');
  const pick = anchors[Math.floor(ctx.rng.next() * anchors.length)];
  ai.goal = { x: pick.x, y: 0, z: pick.z };
  ai.goalName = name;
  requestPath(a, ctx);
}

function requestPath(a: Actor, ctx: AICtx): void {
  const ai = a.ai;
  if (!ai.goal) return;
  const path = ctx.nav.findPath(a.pos, ai.goal);
  ai.path = path ?? [];
  ai.pathIndex = 0;
  ai.pathAge = 0;
  ai.repathTimer = REPATH_INTERVAL + ctx.rng.next() * 0.6;
}

// ------------------------------------------------------------------ movement

/** Walk the current path; handles arrival, staleness and getting stuck. */
function travel(a: Actor, ctx: AICtx, out: BotOutput): void {
  const ai = a.ai;
  ai.pathAge += ctx.dt;

  if (ai.goal && (ai.path.length === 0 || ai.repathTimer <= 0)) {
    requestPath(a, ctx);
  }
  if (ai.path.length === 0 || ai.pathIndex >= ai.path.length) {
    lookAt(a, ctx, ai.goal ?? forwardAnchor(a, ctx));
    return;
  }

  const wp = ai.path[ai.pathIndex];
  const d = dist2D(a.pos, wp);
  if (d < 0.9) {
    ai.pathIndex++;
    if (ai.pathIndex >= ai.path.length) {
      ai.path = [];
      return;
    }
  }

  const nextWp = ai.path[Math.min(ai.pathIndex, ai.path.length - 1)];
  moveToward(a, ctx, nextWp, out, true);

  // --- stuck recovery ----------------------------------------------------
  const moved = dist2D(a.pos, ai.lastPos);
  ai.lastPos.x = a.pos.x;
  ai.lastPos.y = a.pos.y;
  ai.lastPos.z = a.pos.z;
  if (moved < 0.012) {
    ai.stuckTimer += ctx.dt;
    if (ai.stuckTimer > 0.45) {
      // Sidestep, then force a fresh path.
      out.intent.strafe = ai.strafeDir || (ctx.rng.next() < 0.5 ? -1 : 1);
      ai.strafeDir = out.intent.strafe;
      if (ai.stuckTimer > 0.9) {
        out.intent.jump = true;
        requestPath(a, ctx);
        ai.stuckTimer = 0;
        ai.strafeDir = 0;
      }
    }
  } else {
    ai.stuckTimer = Math.max(0, ai.stuckTimer - ctx.dt * 2);
  }
}

/** Steer toward a point, optionally aiming where we are going. */
function moveToward(a: Actor, ctx: AICtx, point: Vec3, out: BotOutput, faceIt: boolean): void {
  const dx = point.x - a.pos.x;
  const dz = point.z - a.pos.z;
  const desiredYaw = dirToYaw(dx, dz);
  if (faceIt) {
    const turn = (5.5 + a.ai.skill * 4) * ctx.dt;
    a.yaw = approachAngle(a.yaw, desiredYaw, turn);
    a.pitch = approachAngle(a.pitch, 0, 2 * ctx.dt);
  }
  // Convert the world-space desire into local forward/strafe.
  const err = angleDelta(a.yaw, desiredYaw);
  out.intent.forward = Math.cos(err);
  out.intent.strafe = Math.sin(err);
  if (out.intent.forward < 0.2 && Math.abs(err) > 1.2) {
    out.intent.forward = 0.35;
  }
}

function lookAt(a: Actor, ctx: AICtx, point: Vec3 | null): void {
  if (!point) return;
  const desired = dirToYaw(point.x - a.pos.x, point.z - a.pos.z);
  a.yaw = approachAngle(a.yaw, desired, 3.2 * ctx.dt);
}

function hold(a: Actor, ctx: AICtx, out: BotOutput): void {
  const ai = a.ai;
  // Re-pick the angle now and then, then sweep gently across it.
  if (ai.strafeTimer <= 0) {
    ai.strafeTimer = 2.5 + ctx.rng.next() * 3.5;
    ai.watchYaw = pickWatchYaw(a, ctx);
  }
  const sweep = Math.sin(ctx.time * 0.55 + a.id) * 0.4;
  a.yaw = approachAngle(a.yaw, ai.watchYaw + sweep, 1.6 * ctx.dt);
  a.pitch = approachAngle(a.pitch, 0.02, 1.5 * ctx.dt);
  out.intent.forward = 0;
  out.intent.strafe = 0;
}

/**
 * Choose a direction worth watching: sample sight lines around the bot and
 * favour the ones that both see far and point at where the enemy will come
 * from (their spawn, or the planted bomb when we are guarding it).
 */
function pickWatchYaw(a: Actor, ctx: AICtx): number {
  const eye = eyePos(a);
  let threatX: number;
  let threatZ: number;
  if (ctx.round.bombPlanted && ctx.round.bombPos && a.team === 'T') {
    threatX = ctx.round.bombPos.x - a.pos.x;
    threatZ = ctx.round.bombPos.z - a.pos.z;
  } else {
    const enemySpawns = ctx.world.spawns(a.team === 'CT' ? 'T' : 'CT');
    const s = enemySpawns[0];
    threatX = s.x - a.pos.x;
    threatZ = s.z - a.pos.z;
  }
  const tl = Math.hypot(threatX, threatZ) || 1;
  threatX /= tl;
  threatZ /= tl;

  let bestYaw = a.yaw;
  let bestScore = -Infinity;
  const samples = 12;
  for (let i = 0; i < samples; i++) {
    const yaw = (i / samples) * Math.PI * 2 - Math.PI;
    const dx = -Math.sin(yaw);
    const dz = -Math.cos(yaw);
    const hit = ctx.world.raycast({ x: eye.x, y: eye.y, z: eye.z }, { x: dx, y: 0, z: dz }, 28);
    const clear = hit.hit ? hit.dist : 28;
    const alignment = dx * threatX + dz * threatZ;
    const score = clear * (0.55 + 0.45 * alignment) + ctx.rng.next() * 3;
    if (score > bestScore) {
      bestScore = score;
      bestYaw = yaw;
    }
  }
  return bestYaw;
}

// ------------------------------------------------------------------- combat

function engage(a: Actor, ctx: AICtx, target: Actor | null, out: BotOutput): void {
  const ai = a.ai;
  if (!target) {
    // Lost sight — push to the last known position.
    if (ai.lastSeen) {
      ai.mode = 'hunt';
      setGoal(a, ctx, ai.lastSeen, 'last_seen');
    } else {
      ai.mode = 'advance';
    }
    travel(a, ctx, out);
    return;
  }

  const def = activeDef(a);
  const eye = eyePos(a);
  const aimPoint = chestPos(target);
  const dist = dist2D(a.pos, target.pos);

  // Aim error: re-rolled on a timer, tighter for skilled bots and near targets.
  if (ai.aimErrorTimer <= 0) {
    ai.aimErrorTimer = 0.18 + ctx.rng.next() * 0.3;
    const base = (1.06 - ai.skill) * 0.05;
    const scale = base * clamp(dist / 18, 0.35, 2.2);
    ai.aimErrorYaw = ctx.rng.gauss(scale);
    ai.aimErrorPitch = ctx.rng.gauss(scale * 0.55);
  }
  // Skilled bots aim slightly higher, at the head.
  const headBias = ai.skill > 0.7 ? 0.3 * (ai.skill - 0.7) / 0.3 : 0;
  const targetY = aimPoint.y + headBias * 0.32;

  const dx = aimPoint.x - eye.x;
  const dz = aimPoint.z - eye.z;
  const dy = targetY - eye.y;
  const flat = Math.hypot(dx, dz) || 0.001;
  const desiredYaw = dirToYaw(dx, dz) + ai.aimErrorYaw;
  const desiredPitch = Math.atan2(dy, flat) + ai.aimErrorPitch;

  const turnRate = (7 + ai.skill * 9) * ctx.dt;
  a.yaw = approachAngle(a.yaw, desiredYaw, turnRate);
  a.pitch = clamp(approachAngle(a.pitch, desiredPitch, turnRate), -1.2, 1.2);

  // --- movement while fighting -------------------------------------------
  const preferred = preferredRange(def.id);
  if (dist > preferred * 1.6 && ai.aggression > 0.4) {
    moveToward(a, ctx, target.pos, out, false);
    out.intent.forward *= 0.9;
  } else if (dist < preferred * 0.45) {
    out.intent.forward = -0.7;
  } else {
    // Strafe for a harder shot, but stop moving to take accurate shots.
    if (ai.strafeTimer <= 0) {
      ai.strafeTimer = 0.5 + ctx.rng.next() * 0.9;
      ai.strafeDir = ctx.rng.next() < 0.5 ? -1 : 1;
      if (ctx.rng.next() < 0.35) ai.strafeDir = 0;
    }
    out.intent.strafe = ai.strafeDir * 0.85;
    out.intent.forward = 0;
  }
  if (dist > 26 && ai.skill > 0.5) {
    out.intent.strafe *= 0.25;
    out.intent.crouch = ctx.rng.next() < 0.02 ? true : a.crouching && ctx.rng.next() < 0.9;
  }

  // --- trigger discipline -------------------------------------------------
  const ws = activeWeapon(a);
  if (!ws || ws.mag <= 0) {
    if (canReload(a, ctx.time)) startReload(a, ctx.time);
    return;
  }
  if (ai.reactionTimer > 0 || isReloading(a, ctx.time)) return;
  if (dist > def.range) return;

  const yawErr = Math.abs(angleDelta(a.yaw, desiredYaw - ai.aimErrorYaw));
  const pitchErr = Math.abs(angleDelta(a.pitch, desiredPitch - ai.aimErrorPitch));
  const cone = Math.max(0.035, currentSpread(a) * 1.4);
  const aligned = yawErr < cone + 0.03 && pitchErr < cone + 0.03;
  if (!aligned) return;
  if (!ctx.world.losClear(eye, aimPoint)) return;

  // Scoped rifles: bots use the scope at range.
  if (def.scope) {
    a.wantsScope = dist > 14;
  }

  if (def.mode === 'auto') {
    if (ai.burstTimer > 0) return;
    tryFire(ctx.combat, a, true, true);
    ai.fireTimer -= ctx.dt;
    if (ai.fireTimer <= 0) {
      // Burst length shrinks with distance; pause to let the spray reset.
      const burst = dist < 12 ? 0.55 + ctx.rng.next() * 0.5 : dist < 28 ? 0.25 + ctx.rng.next() * 0.2 : 0.1;
      ai.fireTimer = burst;
      ai.burstTimer = 0.16 + (1 - ai.skill) * 0.4 + ctx.rng.next() * 0.15;
    }
  } else {
    if (ai.burstTimer > 0) return;
    if (tryFire(ctx.combat, a, true, false)) {
      ai.burstTimer = def.mode === 'bolt' ? 1.5 : 0.16 + (1 - ai.skill) * 0.35;
    }
  }
}

function preferredRange(id: string): number {
  switch (id) {
    case 'awp':
      return 34;
    case 'ak47':
    case 'm4a4':
      return 20;
    case 'knife':
      return 1.2;
    default:
      return 12;
  }
}

/** Reload / weapon switching outside of a firefight. */
function manageWeapon(a: Actor, ctx: AICtx, target: Actor | null): void {
  if (isReloading(a, ctx.time)) return;
  const ws = activeWeapon(a);
  const def = activeDef(a);

  if (!ws || def.mode === 'none') {
    // Holding the bomb or nothing useful: draw a real weapon.
    const slot = a.weapons.primary ? 'primary' : a.weapons.secondary ? 'secondary' : 'melee';
    switchSlot(a, slot, ctx.time);
    return;
  }
  if (ws.mag === 0 && ws.reserve === 0) {
    if (a.activeSlot === 'primary' && a.weapons.secondary) switchSlot(a, 'secondary', ctx.time);
    else if (a.activeSlot !== 'melee') switchSlot(a, 'melee', ctx.time);
    return;
  }
  if (a.activeSlot !== 'primary' && a.weapons.primary) {
    const p = a.weapons.primary;
    if (p.mag > 0 || p.reserve > 0) {
      switchSlot(a, 'primary', ctx.time);
      return;
    }
  }
  const lowMag = ws.mag <= Math.max(1, Math.floor(def.magSize * 0.25));
  if (!target && lowMag && canReload(a, ctx.time)) startReload(a, ctx.time);
  if (ws.mag === 0 && canReload(a, ctx.time)) startReload(a, ctx.time);
  if (!target && a.wantsScope) a.wantsScope = false;
}

// -------------------------------------------------------------- bomb duties

function doPlant(a: Actor, ctx: AICtx, out: BotOutput): boolean {
  const site = ctx.world.siteAt(a.pos);
  if (!site) {
    a.ai.mode = 'advance';
    setGoalSite(a, ctx, a.ai.site ?? ctx.round.targetSite);
    return false;
  }
  out.intent.forward = 0;
  out.intent.strafe = 0;
  a.pitch = approachAngle(a.pitch, 0.55, 3 * ctx.dt);
  return true;
}

function doDefuse(a: Actor, ctx: AICtx, out: BotOutput): boolean {
  const bomb = ctx.round.bombPos;
  if (!bomb) return false;
  const d = dist2D(a.pos, bomb);
  if (d > 1.4) {
    moveToward(a, ctx, bomb, out, true);
    return false;
  }
  out.intent.forward = 0;
  out.intent.strafe = 0;
  out.intent.crouch = true;
  const desired = dirToYaw(bomb.x - a.pos.x, bomb.z - a.pos.z);
  a.yaw = approachAngle(a.yaw, desired, 4 * ctx.dt);
  a.pitch = approachAngle(a.pitch, 0.8, 3 * ctx.dt);
  return true;
}

/** Round-start role assignment: spread the defenders, commit the attackers. */
export function assignRoles(actors: Actor[], targetSite: 'A' | 'B', rng: Rng): void {
  const cts = actors.filter((a) => a.team === 'CT');
  const ts = actors.filter((a) => a.team === 'T');
  // Defenders: 2 per site plus a rotator who starts mid.
  const sites: ('A' | 'B')[] = ['A', 'B', 'A', 'B', rng.next() < 0.5 ? 'A' : 'B'];
  cts.forEach((a, i) => {
    a.ai.site = sites[i % sites.length];
    a.ai.holdSpot = null;
    a.ai.aggression = 0.25 + rng.next() * 0.3;
  });
  ts.forEach((a) => {
    a.ai.site = targetSite;
    a.ai.holdSpot = null;
    a.ai.aggression = 0.45 + rng.next() * 0.45;
  });
  for (const a of actors) {
    a.ai.mode = 'idle';
    a.ai.path = [];
    a.ai.pathIndex = 0;
    a.ai.goal = null;
    a.ai.goalName = '';
    a.ai.targetId = -1;
    a.ai.lastSeen = null;
    a.ai.lastSeenTime = -99;
    a.ai.alertPos = null;
    a.ai.stuckTimer = 0;
  }
}
