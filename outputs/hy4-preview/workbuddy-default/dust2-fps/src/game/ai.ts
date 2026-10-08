/**
 * Bot brain: perception -> decision -> navigation -> combat.
 *
 * - Perception: field of view + range + real ray-cast line of sight.
 * - Decision: role driven objectives that react to the bomb state.
 * - Navigation: A* over the map grid with path smoothing, stuck recovery and
 *   simple separation from team mates.
 * - Combat: aim with turn-rate limiting + error, weapon-appropriate bursts.
 */

import { NAV_POINTS, SITES } from './map/dust2';
import type { NavGrid } from './map/grid';
import type { Box } from './map/dust2';
import { CHARACTER, weaponDef } from './weapons';
import { anglesTo, dirFromAngles, eyePosition, rightVector } from './entities';
import { angleDelta, clamp, dist2D, dist2DSq, moveAngleTowards, randRange } from './mathUtils';
import { accelerate, moveHorizontal, moveVertical, type Body } from './physics';
import type { Bomb, Combatant, RoundPhase } from './types';

export interface AIWorld {
  grid: NavGrid;
  blockBoxes: Box[];
  /** everything a body can collide with (walls handled by the grid) */
  collideBoxes: Box[];
  combatants: Combatant[];
  bomb: Bomb;
  time: number;
  phase: RoundPhase;
  /** site the T side is committing to this round */
  attackSite: 'A' | 'B';
  lineOfSight(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean;
  /** fire the current weapon; returns true when a round left the barrel */
  tryFire(c: Combatant): boolean;
  /** ask the engine to start a reload */
  reload(c: Combatant): void;
  /** where the bot should stand while defending a planted bomb */
  defendSpot(c: Combatant): { x: number; z: number };
  /** most recent enemy gunshot the bot could plausibly hear */
  recentEnemyNoise(c: Combatant, maxAge: number, maxDist: number): { x: number; z: number } | null;
}

const VIEW_RANGE = 62;
const VIEW_HALF_ANGLE = Math.cos((112 * Math.PI) / 180 / 2);
const REACTION_MIN = 0.13;
const REACTION_MAX = 0.34;
const WAYPOINT_REACH = 2.4;
const WAYPOINT_REACH_GOAL = 1.6;
const SEPARATION_RADIUS = 1.05;
const BOMB_GRAB_DIST = 1.6;
const TAU = Math.PI * 2;

function byId(list: Combatant[], id: number | null): Combatant | null {
  if (id === null) return null;
  for (const c of list) if (c.id === id) return c;
  return null;
}

// ---------------------------------------------------------------------------
// Perception
// ---------------------------------------------------------------------------

function perceive(world: AIWorld, c: Combatant, dt: number): void {
  const brain = c.brain!;
  const eye = eyePosition(c);
  const fwd = dirFromAngles(c.yaw, 0);

  let best: Combatant | null = null;
  let bestScore = -Infinity;

  for (const e of world.combatants) {
    if (!e.alive || e.team === c.team || e.id === c.id) continue;
    const d = dist2D(c.body.x, c.body.z, e.body.x, e.body.z);
    if (d > VIEW_RANGE) continue;

    // field of view
    const dirX = (e.body.x - c.body.x) / (d || 1);
    const dirZ = (e.body.z - c.body.z) / (d || 1);
    const facing = dirX * fwd.x + dirZ * fwd.z;
    if (facing < VIEW_HALF_ANGLE - 0.35) continue; // allow a little peripheral

    const chestY = e.body.y + CHARACTER.height * 0.68;
    if (!world.lineOfSight(eye.x, eye.y, eye.z, e.body.x, chestY, e.body.z)) continue;

    let score = 120 - d * 0.9;
    if (brain.targetId === e.id) score += 26;
    if (e.hasBomb) score += 18;
    if (score > bestScore) { bestScore = score; best = e; }
  }

  if (best) {
    if (brain.targetId !== best.id) {
      brain.targetId = best.id;
      brain.reactionTimer = randRange(REACTION_MIN, REACTION_MAX);
      brain.trackTime = 0;
      brain.burstLeft = 0;
      brain.burstPause = 0;
    } else {
      brain.trackTime += dt;
    }
    brain.visible = true;
    brain.lastSeenX = best.body.x;
    brain.lastSeenZ = best.body.z;
    brain.lastSeenTime = world.time;
  } else {
    if (brain.visible) {
      brain.visible = false;
      brain.reactionTimer = randRange(REACTION_MIN, REACTION_MAX) * 0.7;
    }
    brain.trackTime = Math.max(0, brain.trackTime - dt * 1.5);
    if (world.time - brain.lastSeenTime > 5) brain.targetId = null;
  }
}

// ---------------------------------------------------------------------------
// Objectives
// ---------------------------------------------------------------------------

function siteSpot(site: 'A' | 'B'): { x: number; z: number } {
  return SITES.find((s) => s.id === site)!.plantSpot;
}

function siteBox(site: 'A' | 'B') {
  return SITES.find((s) => s.id === site)!;
}

function inSite(c: Combatant, site: 'A' | 'B'): boolean {
  const s = siteBox(site);
  return c.body.x >= s.x0 && c.body.x <= s.x1 && c.body.z >= s.z0 && c.body.z <= s.z1;
}

/**
 * The ordered waypoints a bot walks before it reaches its objective.
 * T routes always approach through a corridor that actually leads to the
 * site the team committed to, so nobody has to back-track across the map.
 */
function routeForRole(c: Combatant, world: AIWorld): { x: number; z: number }[] {
  const site = world.attackSite;
  const i = c.id % 5;

  if (c.team === 'T') {
    const approach = site === 'A'
      ? (['long', 'mid', 'long', 'mid', 'long'] as const)[i]!
      : (['tunnel', 'mid', 'tunnel', 'tunnel', 'mid'] as const)[i]!;

    if (approach === 'long') {
      return [NAV_POINTS.A_LONG_START!, NAV_POINTS.A_LONG_MID!, NAV_POINTS.A_LONG_END!, siteSpot(site)];
    }
    if (approach === 'tunnel') {
      return [NAV_POINTS.UPPER_TUNNEL!, NAV_POINTS.TUNNEL_BEND!, NAV_POINTS.B_TUNNEL!, siteSpot(site)];
    }
    return [
      NAV_POINTS.T_MID_EXIT, NAV_POINTS.MID, NAV_POINTS.MID_DOORS, NAV_POINTS.TOP_MID,
      site === 'A' ? NAV_POINTS.CATWALK! : NAV_POINTS.B_DOORS!,
      siteSpot(site),
    ];
  }

  // CT: take a post and hold it
  const role = c.brain!.role;
  if (role === 'anchorMid') return [NAV_POINTS.TOP_MID!];
  if (role === 'anchorA') return [NAV_POINTS.A_SITE!];
  if (role === 'anchorB') return [NAV_POINTS.B_SITE!];
  return [NAV_POINTS.CT_MID!];
}

/** A per-bot offset so five team mates do not stack on the same spot. */
function spreadSpot(c: Combatant, base: { x: number; z: number }, radius: number): { x: number; z: number } {
  const ang = (c.id * 2.399963) % TAU;
  const r = radius * (0.55 + ((c.id * 7) % 10) / 20);
  return { x: base.x + Math.cos(ang) * r, z: base.z + Math.sin(ang) * r };
}

function chooseGoal(world: AIWorld, c: Combatant): void {
  const brain = c.brain!;
  const bomb = world.bomb;

  if (c.team === 'T') {
    if (bomb.state === 'planted') {
      brain.goal = world.defendSpot(c);
      const d = dist2D(c.body.x, c.body.z, brain.goal.x, brain.goal.z);
      brain.state = d < 2.6 ? 'hold' : 'advance';
      return;
    }
    if (bomb.state === 'dropped') {
      const d = dist2D(c.body.x, c.body.z, bomb.x, bomb.z);
      let closest = true;
      for (const m of world.combatants) {
        if (!m.alive || m.team !== c.team || m.id === c.id) continue;
        if (dist2D(m.body.x, m.body.z, bomb.x, bomb.z) < d) { closest = false; break; }
      }
      if (closest && d < 45) {
        brain.goal = { x: bomb.x, z: bomb.z };
        brain.state = d < BOMB_GRAB_DIST ? 'hold' : 'advance';
        return;
      }
    }
    if (c.hasBomb) {
      // walk to a personal plant position inside the site, then plant
      const target = spreadSpot(c, siteSpot(world.attackSite), 4.2);
      brain.goal = target;
      brain.state = inSite(c, world.attackSite) &&
        dist2D(c.body.x, c.body.z, target.x, target.z) < 2.4 ? 'plant' : 'advance';
      return;
    }
    // route follower — once the route is exhausted, hold around the objective
    if (brain.route.length === 0) brain.route = routeForRole(c, world);
    const last = brain.route[brain.route.length - 1]!;
    if (brain.routeIndex >= brain.route.length - 1 &&
      dist2D(c.body.x, c.body.z, last.x, last.z) < 6.0) {
      brain.state = 'hold';
      // shuffle a little so campers are not perfectly static
      const base = spreadSpot(c, last, 6.5);
      brain.goal = {
        x: base.x + randRange(-2.2, 2.2),
        z: base.z + randRange(-2.2, 2.2),
      };
      return;
    }
    const idx = Math.min(brain.routeIndex, brain.route.length - 1);
    brain.goal = brain.route[idx]!;
    brain.state = 'advance';
    return;
  }

  // ---- CT ----
  if (bomb.state === 'planted') {
    brain.goal = { x: bomb.x, z: bomb.z };
    brain.state = dist2D(c.body.x, c.body.z, bomb.x, bomb.z) < 1.9 ? 'defuse' : 'advance';
    return;
  }
  if (bomb.state === 'dropped') {
    // guard the drop so T cannot recover it
    brain.goal = { x: bomb.x + randRange(-6, 6), z: bomb.z + randRange(-6, 6) };
    brain.state = 'advance';
    return;
  }
  const noise = world.recentEnemyNoise(c, 2.5, 42);
  if (noise && (brain.role === 'rotator' || brain.role === 'anchorMid')) {
    brain.goal = noise;
    brain.state = 'advance';
    return;
  }
  if (brain.route.length === 0) brain.route = routeForRole(c, world);
  const idx = Math.min(brain.routeIndex, brain.route.length - 1);
  const anchor = brain.route[idx]!;
  brain.state = dist2D(c.body.x, c.body.z, anchor.x, anchor.z) < 3.0 ? 'hold' : 'advance';
  brain.goal = brain.state === 'hold'
    ? { x: anchor.x + randRange(-3.5, 3.5), z: anchor.z + randRange(-3.5, 3.5) }
    : anchor;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function repath(world: AIWorld, c: Combatant): void {
  const brain = c.brain!;
  if (!brain.goal) return;
  const path = world.grid.findPath(c.body.x, c.body.z, brain.goal.x, brain.goal.z);
  brain.path = path;
  brain.pathIndex = 0;
  brain.repathTimer = 0.7 + Math.random() * 0.6;
}

function separation(world: AIWorld, c: Combatant, out: { x: number; z: number }): void {
  let sx = 0, sz = 0;
  for (const o of world.combatants) {
    if (o.id === c.id || !o.alive) continue;
    const dx = c.body.x - o.body.x;
    const dz = c.body.z - o.body.z;
    const dsq = dx * dx + dz * dz;
    if (dsq > SEPARATION_RADIUS * SEPARATION_RADIUS || dsq < 1e-6) continue;
    const d = Math.sqrt(dsq);
    const push = (SEPARATION_RADIUS - d) / SEPARATION_RADIUS;
    sx += (dx / d) * push;
    sz += (dz / d) * push;
  }
  out.x = sx;
  out.z = sz;
}

const SEP = { x: 0, z: 0 };

/** Returns the world-space movement direction the bot wants this frame. */
function navigationDir(world: AIWorld, c: Combatant, dt: number): { x: number; z: number } {
  const brain = c.brain!;
  brain.repathTimer -= dt;

  if (brain.repathTimer <= 0 || (brain.path.length === 0 && brain.goal)) {
    repath(world, c);
  }

  if (brain.path.length === 0) return { x: 0, z: 0 };

  // advance along the smoothed waypoints
  while (brain.pathIndex < brain.path.length) {
    const wp = brain.path[brain.pathIndex]!;
    const d = dist2D(c.body.x, c.body.z, wp.x, wp.z);
    const isLast = brain.pathIndex === brain.path.length - 1;
    if (d < (isLast ? WAYPOINT_REACH_GOAL : WAYPOINT_REACH)) brain.pathIndex++;
    else break;
  }

  if (brain.pathIndex >= brain.path.length) return { x: 0, z: 0 };

  const wp = brain.path[brain.pathIndex]!;
  let dx = wp.x - c.body.x;
  let dz = wp.z - c.body.z;
  const len = Math.hypot(dx, dz) || 1;
  dx /= len; dz /= len;

  separation(world, c, SEP);
  dx += SEP.x * 1.5;
  dz += SEP.z * 1.5;
  const l2 = Math.hypot(dx, dz) || 1;
  return { x: dx / l2, z: dz / l2 };
}

function stuckCheck(world: AIWorld, c: Combatant, dt: number, wantsToMove: boolean): void {
  const brain = c.brain!;
  const moved = dist2D(c.body.x, c.body.z, brain.lastX, brain.lastZ);
  if (wantsToMove && moved < 0.035) {
    brain.stuckTimer += dt;
    if (brain.stuckTimer > 0.9) {
      // try a fresh path first, then a random nearby detour
      if (brain.path.length > 0) {
        repath(world, c);
      }
      if (brain.stuckTimer > 1.8) {
        const jitter = world.grid.nearestWalkable(
          c.body.x + randRange(-6, 6),
          c.body.z + randRange(-6, 6),
        );
        if (jitter) {
          brain.goal = jitter;
          repath(world, c);
        }
        brain.stuckTimer = 0;
        brain.strafeDir *= -1;
      }
    }
  } else {
    brain.stuckTimer = Math.max(0, brain.stuckTimer - dt * 0.5);
  }
  brain.lastX = c.body.x;
  brain.lastZ = c.body.z;
}

// ---------------------------------------------------------------------------
// Combat
// ---------------------------------------------------------------------------

function aimAndFire(world: AIWorld, c: Combatant, target: Combatant, dt: number): void {
  const brain = c.brain!;
  const eye = eyePosition(c);

  // Bots mostly go for the torso. A head-line is chosen for a minority of
  // engagements (and more often up close), so headshots stay special.
  const dist = dist2D(c.body.x, c.body.z, target.body.x, target.body.z);
  const wantHead = brain.aimHigh;
  const aimY = target.body.y + (wantHead ? CHARACTER.height * 0.90 : CHARACTER.height * 0.72);
  const aim = anglesTo(eye.x, eye.y, eye.z, target.body.x, aimY, target.body.z);

  // error shrinks the longer the bot stays on the same target
  const track = clamp(brain.trackTime / 0.9, 0, 1);
  const errScale = (1 - track * 0.7) * (0.030 + (1 - brain.aggression) * 0.028)
    + (dist > 25 ? 0.006 : 0);
  const errYaw = Math.sin(world.time * 3.1 + c.id) * errScale;
  const errPitch = Math.cos(world.time * 2.3 + c.id * 1.7) * errScale * 0.75;

  const turnRate = 5.5 + brain.aggression * 3.5;
  const dYaw = angleDelta(c.yaw, aim.yaw + errYaw);
  c.yaw += clamp(dYaw, -turnRate * dt, turnRate * dt);
  c.pitch = moveAngleTowards(c.pitch, clamp(aim.pitch + errPitch, -1.2, 1.2), turnRate * dt);

  if (brain.reactionTimer > 0) {
    brain.reactionTimer -= dt;
    return;
  }

  // only shoot when reasonably on target
  const aimError = Math.abs(angleDelta(c.yaw, aim.yaw)) + Math.abs(c.pitch - aim.pitch) * 0.5;
  const tolerance = clamp(0.7 / Math.max(4, dist), 0.009, 0.10);
  if (aimError > tolerance) return;

  // burst cadence
  if (brain.burstPause > 0) {
    brain.burstPause -= dt;
    return;
  }
  const fired = world.tryFire(c);
  if (fired) {
    brain.burstLeft--;
    if (brain.burstLeft <= 0) {
      const isSniper = c.primaryId === 'awp' && c.slot === 'primary';
      brain.burstLeft = isSniper ? 1 : Math.round(randRange(2, 6));
      brain.burstPause = isSniper ? randRange(1.1, 1.6) : randRange(0.12, 0.42) * (dist > 30 ? 2.2 : 1);
      // re-roll the aim line for the next burst
      brain.aimHigh = Math.random() < (dist < 11 ? 0.26 : 0.16);
    }
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function updateBot(world: AIWorld, c: Combatant, dt: number): void {
  const brain = c.brain!;
  if (!c.alive) return;

  perceive(world, c, dt);

  brain.decisionTimer -= dt;
  if (brain.decisionTimer <= 0 || brain.goal === null) {
    brain.decisionTimer = 0.4 + Math.random() * 0.4;
    chooseGoal(world, c);
  }

  const target = byId(world.combatants, brain.targetId);
  const seesTarget = !!target && brain.visible;

  // ---- route progression ----
  if (brain.goal && c.team === 'T' && brain.route.length > 0 && brain.routeIndex < brain.route.length - 1) {
    const wp = brain.route[brain.routeIndex]!;
    if (dist2DSq(c.body.x, c.body.z, wp.x, wp.z) < 3.2 * 3.2) {
      brain.routeIndex++;
      brain.path = [];
      brain.repathTimer = 0;
    }
  }

  // ---- desired movement ----
  let wishX = 0, wishZ = 0;
  let speed = 4.6;

  if (brain.state === 'plant' || brain.state === 'defuse') {
    wishX = 0; wishZ = 0;
  } else if (seesTarget && target) {
    // combat movement: strafe, close distance if far
    brain.strafeTimer -= dt;
    if (brain.strafeTimer <= 0) {
      brain.strafeTimer = randRange(0.35, 1.1);
      if (Math.random() < 0.45) brain.strafeDir *= -1;
    }
    const d = dist2D(c.body.x, c.body.z, target.body.x, target.body.z);
    const r = rightVector(c.yaw);
    const towardsX = (target.body.x - c.body.x) / (d || 1);
    const towardsZ = (target.body.z - c.body.z) / (d || 1);
    const approach = d > 22 ? 0.75 : d < 7 ? -0.35 : 0.12;
    wishX = r.x * brain.strafeDir * 0.85 + towardsX * approach;
    wishZ = r.z * brain.strafeDir * 0.85 + towardsZ * approach;
    speed = 3.4;
  } else if (brain.goal) {
    const nav = navigationDir(world, c, dt);
    const distToGoal = dist2D(c.body.x, c.body.z, brain.goal.x, brain.goal.z);
    if (distToGoal > 1.8 || (c.team === 'T' && brain.state === 'advance')) {
      wishX = nav.x;
      wishZ = nav.z;
      speed = c.team === 'T' ? 4.9 : 4.4;
    }
  }

  // look where you are going when there is nothing to shoot
  if (!seesTarget && (wishX !== 0 || wishZ !== 0)) {
    const wantYaw = Math.atan2(-wishX, -wishZ);
    const d = angleDelta(c.yaw, wantYaw);
    c.yaw += clamp(d, -4.5 * dt, 4.5 * dt);
    c.pitch = moveAngleTowards(c.pitch, 0, 2.5 * dt);
  } else if (!seesTarget && brain.goal && brain.state === 'hold') {
    // scan around while holding an angle
    const wantYaw = Math.atan2(-(brain.goal.x - c.body.x), -(brain.goal.z - c.body.z)) + Math.sin(world.time * 0.5 + c.id) * 0.7;
    const d = angleDelta(c.yaw, wantYaw);
    c.yaw += clamp(d, -2.0 * dt, 2.0 * dt);
  }

  // ---- combat ----
  if (seesTarget && target) {
    aimAndFire(world, c, target, dt);
  }

  // ---- integrate ----
  const body: Body = c.body;
  accelerate(body, {
    wishX, wishZ,
    speed,
    accel: 9.0,
    friction: 8.0,
    airAccel: 0.22,
  }, dt);

  moveHorizontal(world.grid, world.collideBoxes, body, body.vx * dt, body.vz * dt);
  moveVertical(world.grid, world.collideBoxes, body, dt);

  stuckCheck(world, c, dt, wishX !== 0 || wishZ !== 0);

  // ---- ammo management ----
  const ws = c.weapons[c.slot];
  if (ws && !ws.reloading && !seesTarget) {
    const def = weaponDef(ws.id);
    if (def.category !== 'melee') {
      if (ws.ammo === 0 && ws.reserve > 0) world.reload(c);
      else if (ws.ammo < def.magSize * 0.34 && ws.reserve > 0 && Math.random() < 0.6 * dt) world.reload(c);
    }
  }
}
