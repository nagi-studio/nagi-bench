/**
 * Bot AI.
 *
 * Each bot owns a `BotBrain`: a small state machine (advance / engage / search / hold /
 * plant / defuse / pickup) fed by throttled perception (FOV cone + line of sight ray) and
 * driven by A* paths. Brains only ever write a `MoveCommand` plus a look direction, then
 * call the same fire/reload functions the player uses — so bots obey identical physics,
 * spread and recoil rules.
 */

import {
  Rng,
  Vec3,
  angleDelta,
  clamp,
  dirFromAngles,
  forwardFromYaw,
  moveTowards,
  pitchTo,
  rightFromYaw,
  yawTo,
} from '../../core/math.ts';
import type { Actor } from '../actor.ts';
import { AI_FOV, AI_HEAR_RADIUS, AI_VIEW_DISTANCE, type Team, otherTeam } from '../constants.ts';
import type { SimContext } from '../context.ts';
import { aimPointFor } from '../hitbox.ts';
import {
  CT_ANCHORS,
  T_ROUTES,
  WAYPOINTS,
  type WaypointId,
  bombSiteCenter,
} from '../map/dust2.ts';
import { currentSpread, toggleScope, traceBullet, tryFire, tryReload } from './combat.ts';
import { canDefuseHere, canPlantHere, updateDefuse, updatePlant } from './bomb.ts';

export type BotState =
  | 'idle'
  | 'advance'
  | 'engage'
  | 'search'
  | 'hold'
  | 'plant'
  | 'defuse'
  | 'pickupBomb';

export type BotRole = 'entry' | 'support' | 'anchor' | 'rotator' | 'lurker';

const tmpDir = new Vec3();
const tmpAim = new Vec3();
const tmpEye = new Vec3();
const tmpFwd = new Vec3();
const tmpRight = new Vec3();
const tmpTargetEye = new Vec3();

export interface Sighting {
  pos: Vec3;
  time: number;
}

export class BotBrain {
  readonly actor: Actor;
  readonly rng: Rng;
  /** 0 = easy bot, 1 = very hard bot. Drives reaction time, aim error and discipline. */
  skill: number;
  state: BotState = 'idle';
  role: BotRole = 'support';
  site: 'A' | 'B' = 'A';

  private route: WaypointId[] = [];
  private routeIndex = 0;
  /** Position a defender is responsible for (CT only). */
  private anchor: WaypointId | null = null;
  private path: Vec3[] = [];
  private pathIndex = 0;
  private repathAt = 0;
  private readonly goal = new Vec3();
  private hasGoal = false;

  private targetId = -1;
  private targetVisible = false;
  private lastSawTargetAt = -99;
  private readonly lastKnown = new Vec3();
  private hasLastKnown = false;
  private perceiveAt = 0;
  private reactionUntil = 0;

  private strafeDir = 0;
  private strafeUntil = 0;
  private burstUntil = 0;
  private burstPauseUntil = 0;
  private holdSpot: Vec3 | null = null;
  private holdYaw = 0;
  private repositionAt = 0;
  private rotateCheckAt = 0;
  private lastRotateAt = -99;
  private plantYawAt = 0;

  private readonly lastPos = new Vec3();
  private stuckFor = 0;
  private unstickUntil = 0;
  private unstickYaw = 0;

  constructor(actor: Actor, skill: number, seed: number) {
    this.actor = actor;
    this.skill = skill;
    this.rng = new Rng(seed);
    this.lastPos.copy(actor.pos);
  }

  // ---------------------------------------------------------------- planning

  assignRoute(site: 'A' | 'B', route: WaypointId[], role: BotRole): void {
    this.site = site;
    this.route = route;
    this.routeIndex = 0;
    this.anchor = null;
    this.role = role;
    this.state = 'advance';
    this.path = [];
    this.hasGoal = false;
    this.holdSpot = null;
    this.targetId = -1;
    this.hasLastKnown = false;
    this.repathAt = 0;
    this.repositionAt = 0;
  }

  assignAnchor(site: 'A' | 'B', anchor: WaypointId, role: BotRole): void {
    this.site = site;
    this.role = role;
    this.route = [anchor];
    this.routeIndex = 0;
    this.anchor = anchor;
    this.state = 'advance';
    this.path = [];
    this.hasGoal = false;
    this.holdSpot = null;
    this.targetId = -1;
    this.hasLastKnown = false;
    this.repathAt = 0;
    this.repositionAt = 0;
  }

  // ------------------------------------------------------------------ update

  update(ctx: SimContext, dt: number): void {
    const a = this.actor;
    if (!a.alive) return;

    a.command.forward = 0;
    a.command.right = 0;
    a.command.jump = false;
    a.command.walk = false;
    a.command.crouch = false;

    this.perceive(ctx);
    this.chooseWeapon(ctx);
    this.think(ctx, dt);
    this.updateStuck(ctx, dt);
  }

  /**
   * Runs perception only, without any decision making. Used for the human player's actor
   * so that what *they* see also feeds the team's shared intel — it lights up the minimap
   * and lets bot team mates react to contacts the player calls out by spotting them.
   */
  observeOnly(ctx: SimContext): void {
    if (!this.actor.alive) return;
    this.perceive(ctx);
  }

  // -------------------------------------------------------------- perception

  private perceive(ctx: SimContext): void {
    const a = this.actor;
    if (ctx.time < this.perceiveAt) {
      // Between full scans, still track whether the current target stays visible.
      if (this.targetId >= 0) {
        const t = ctx.actors.find((o) => o.id === this.targetId);
        if (!t || !t.alive) this.dropTarget();
      }
      return;
    }
    this.perceiveAt = ctx.time + 0.08 + this.rng.next() * 0.06;

    a.eyePos(tmpEye);
    forwardFromYaw(a.yaw, tmpFwd);

    let best: Actor | null = null;
    let bestScore = -Infinity;

    for (const other of ctx.actors) {
      if (!other.alive || other.team === a.team) continue;
      const dist = a.pos.distanceTo(other.pos);
      if (dist > AI_VIEW_DISTANCE) continue;

      tmpDir.subVectors(other.pos, a.pos);
      const horiz = Math.hypot(tmpDir.x, tmpDir.z);
      const facing = horiz > 0.001 ? (tmpDir.x * tmpFwd.x + tmpDir.z * tmpFwd.z) / horiz : 1;
      const withinFov = Math.acos(clamp(facing, -1, 1)) < AI_FOV / 2;
      // Enemies you can hear moving nearby also count as "noticed".
      const heard = dist < AI_HEAR_RADIUS && other.speed > 2.5;
      if (!withinFov && !heard) continue;

      aimPointFor(other.pos, 'chest', other.crouching, tmpAim);
      let visible = !ctx.collision.losBlocked(tmpEye, tmpAim);
      if (!visible) {
        aimPointFor(other.pos, 'head', other.crouching, tmpAim);
        visible = !ctx.collision.losBlocked(tmpEye, tmpAim);
      }
      if (!visible) continue;

      this.shareIntel(ctx, other);

      // Prefer close, low-health and already-targeted enemies.
      let score = 100 - dist + (100 - other.health) * 0.2;
      if (other.id === this.targetId) score += 25;
      if (!withinFov) score -= 30;
      if (score > bestScore) {
        bestScore = score;
        best = other;
      }
    }

    if (best) {
      if (this.targetId !== best.id) {
        this.targetId = best.id;
        // Reaction time: good bots snap on, weak bots take a beat. A bot that was already
        // standing still watching an angle is effectively pre-aimed and reacts quicker —
        // this is what gives defenders their usual edge over someone running in.
        const preAimed = a.speed < 0.7 ? 0.55 : 1;
        this.reactionUntil =
          ctx.time + (0.34 - this.skill * 0.24 + this.rng.next() * 0.12) * preAimed;
      }
      this.targetVisible = true;
      this.lastSawTargetAt = ctx.time;
      this.lastKnown.copy(best.pos);
      this.hasLastKnown = true;
    } else {
      this.targetVisible = false;
      if (this.targetId >= 0 && ctx.time - this.lastSawTargetAt > 1.6) {
        this.dropTarget();
        this.pullIntel(ctx);
      } else if (this.targetId < 0) {
        this.pullIntel(ctx);
      }
    }
  }

  private dropTarget(): void {
    this.targetId = -1;
    this.targetVisible = false;
  }

  private shareIntel(ctx: SimContext, enemy: Actor): void {
    const map = ctx.intel[this.actor.team];
    map.set(enemy.id, { pos: enemy.pos.clone(), time: ctx.time });
  }

  /** Use teammates' recent sightings when we have nothing of our own. */
  private pullIntel(ctx: SimContext): void {
    const map = ctx.intel[this.actor.team];
    let bestTime = -Infinity;
    let bestPos: Vec3 | null = null;
    for (const [id, s] of map) {
      const enemy = ctx.actors.find((o) => o.id === id);
      if (!enemy || !enemy.alive) continue;
      if (ctx.time - s.time > 8) continue;
      if (s.time > bestTime) {
        bestTime = s.time;
        bestPos = s.pos;
      }
    }
    if (bestPos && !this.hasLastKnown) {
      this.lastKnown.copy(bestPos);
      this.hasLastKnown = true;
    }
  }

  // ------------------------------------------------------------ weapon logic

  private chooseWeapon(ctx: SimContext): void {
    const a = this.actor;
    if (ctx.time < a.deployEndsAt) return;

    const primaryAmmo = a.ammoTotal('primary');
    const secondaryAmmo = a.ammoTotal('secondary');
    const wanted =
      primaryAmmo > 0 ? 'primary' : secondaryAmmo > 0 ? 'secondary' : 'melee';
    if (a.slot !== wanted) {
      a.equip(wanted, ctx.time);
      ctx.events.push({
        type: 'switch',
        actorId: a.id,
        weapon: a.weaponId(),
        firstPerson: false,
        pos: a.pos.clone(),
      });
      return;
    }

    const def = a.weapon();
    const ammo = a.currentAmmo();
    if (def.slot !== 'melee' && !a.reloading) {
      const empty = ammo.mag === 0;
      const lowAndSafe = ammo.mag / def.magazine < 0.3 && !this.targetVisible;
      if ((empty || lowAndSafe) && ammo.reserve > 0) tryReload(ctx, a);
    }
  }

  // ---------------------------------------------------------------- thinking

  private think(ctx: SimContext, dt: number): void {
    const a = this.actor;
    const bomb = ctx.bomb;

    // --- objective interrupts -------------------------------------------------
    if (a.team === 'T') {
      if (bomb.state === 'dropped' && this.isClosestTo(ctx, bomb.pos, 'T')) {
        this.state = 'pickupBomb';
      } else if (a.hasBomb && canPlantHere(a) && this.shouldPlantNow(ctx)) {
        this.state = 'plant';
      }
    } else if (bomb.state === 'planted') {
      if (canDefuseHere(ctx, a) && (!this.targetVisible || a.defuseProgress > 0)) {
        this.state = 'defuse';
      } else if (this.state !== 'engage' && this.state !== 'defuse') {
        this.state = 'advance';
      }
    }

    if (this.targetVisible && ctx.time >= this.reactionUntil && this.state !== 'plant' && this.state !== 'defuse') {
      this.state = 'engage';
    }

    switch (this.state) {
      case 'engage':
        this.doEngage(ctx, dt);
        break;
      case 'search':
        this.doSearch(ctx, dt);
        break;
      case 'plant':
        this.doPlant(ctx, dt);
        break;
      case 'defuse':
        this.doDefuse(ctx, dt);
        break;
      case 'pickupBomb':
        this.doPickupBomb(ctx, dt);
        break;
      case 'hold':
        this.doHold(ctx, dt);
        break;
      default:
        this.doAdvance(ctx, dt);
        break;
    }
  }

  private isClosestTo(ctx: SimContext, pos: Vec3, team: Team): boolean {
    const a = this.actor;
    const myDist = a.pos.distanceTo2D(pos);
    for (const other of ctx.actors) {
      if (!other.alive || other.team !== team || other.id === a.id) continue;
      if (other.pos.distanceTo2D(pos) < myDist - 0.5) return false;
    }
    return true;
  }

  private shouldPlantNow(ctx: SimContext): boolean {
    // Plant when the site looks clear, or when the round clock forces the issue.
    if (!this.targetVisible) return true;
    const enemiesNear = ctx.actors.some(
      (o) => o.alive && o.team !== this.actor.team && o.pos.distanceTo2D(this.actor.pos) < 12,
    );
    return !enemiesNear;
  }

  // ------------------------------------------------------------------ states

  private doAdvance(ctx: SimContext, dt: number): void {
    const a = this.actor;
    const bomb = ctx.bomb;

    let goal: Vec3 | null = null;

    if (a.team === 'CT' && bomb.state === 'planted') {
      goal = bomb.pos;
    } else if (a.team === 'T' && a.hasBomb) {
      const c = bombSiteCenter(this.site);
      goal = new Vec3(c.x, 0, c.z);
    } else if (this.routeIndex < this.route.length) {
      const wp = WAYPOINTS[this.route[this.routeIndex]];
      goal = new Vec3(wp.x, 0, wp.z);
      if (a.pos.distanceTo2D(goal) < 3.0) {
        this.routeIndex++;
        if (this.routeIndex >= this.route.length) {
          this.state = 'hold';
          this.holdSpot = null;
          return;
        }
        const next = WAYPOINTS[this.route[this.routeIndex]];
        goal = new Vec3(next.x, 0, next.z);
      }
    } else {
      this.state = 'hold';
      return;
    }

    this.navigateTo(ctx, goal, dt);
    this.lookAlongPath(dt);
  }

  private doHold(ctx: SimContext, dt: number): void {
    const a = this.actor;

    if (a.team === 'CT' && ctx.bomb.state !== 'planted' && this.considerRotation(ctx)) return;

    if (!this.holdSpot || ctx.time > this.repositionAt) {
      // Hold an angle for a while: a bot that keeps wandering is a bot that keeps getting
      // caught moving.
      this.repositionAt = ctx.time + 9 + this.rng.next() * 11;
      this.holdSpot = this.pickHoldSpot(ctx);
      this.holdYaw = this.pickHoldYaw(ctx, this.holdSpot);
    }

    if (this.holdSpot && a.pos.distanceTo2D(this.holdSpot) > 1.6) {
      this.navigateTo(ctx, this.holdSpot, dt);
      this.lookAlongPath(dt);
      a.command.walk = this.rng.next() < 0.3;
    } else {
      this.path = [];
      // Hold an angle, sweeping slowly so bots do not look frozen.
      const sway = Math.sin(ctx.time * 0.6 + this.actor.id) * 0.35;
      this.turnTowards(this.holdYaw + sway, 0, dt, 2.6);
    }

    if (this.hasLastKnown && ctx.time - this.lastSawTargetAt < 6) this.state = 'search';
  }

  /**
   * Defenders react to information: recent sightings (including where team mates were
   * killed from) point at the site under pressure, and off-site CTs rotate to it.
   */
  private considerRotation(ctx: SimContext): boolean {
    if (ctx.time < this.rotateCheckAt) return false;
    this.rotateCheckAt = ctx.time + 1.5;
    // Rotating across the map is expensive and gets bots killed in the open, so commit
    // rarely: only for a site that is clearly being hit while ours is quiet.
    if (ctx.time - this.lastRotateAt < 12) return false;

    const centres = { A: bombSiteCenter('A'), B: bombSiteCenter('B') };
    const pressure = { A: 0, B: 0 };
    let hottest = -Infinity;
    let threatened: 'A' | 'B' | null = null;

    for (const [id, sighting] of ctx.intel[this.actor.team]) {
      const enemy = ctx.actors.find((o) => o.id === id);
      if (!enemy || !enemy.alive) continue;
      const age = ctx.time - sighting.time;
      if (age > 8) continue;
      for (const site of ['A', 'B'] as const) {
        const d = Math.hypot(sighting.pos.x - centres[site].x, sighting.pos.z - centres[site].z);
        if (d > 18) continue;
        pressure[site] += 1 - age / 8;
        if (pressure[site] > hottest) {
          hottest = pressure[site];
          threatened = site;
        }
      }
    }

    if (!threatened || threatened === this.site) return false;
    // Two independent contacts before abandoning a site, and nothing happening on ours.
    if (pressure[threatened] < 1.2) return false;
    if (pressure[this.site] > 0.2) return false;

    // Do not strip a site of its last defender unless we are clearly needed elsewhere.
    const mySite = bombSiteCenter(this.site);
    const defendersHere = ctx.actors.filter(
      (o) =>
        o.alive &&
        o.team === this.actor.team &&
        o.id !== this.actor.id &&
        Math.hypot(o.pos.x - mySite.x, o.pos.z - mySite.z) < 20,
    ).length;
    if (defendersHere === 0 && this.rng.next() < 0.6) return false;

    const anchors = CT_ANCHORS[threatened];
    this.assignAnchor(threatened, anchors[this.rng.int(0, Math.min(2, anchors.length))], 'rotator');
    this.lastRotateAt = ctx.time;
    return true;
  }

  private pickHoldSpot(ctx: SimContext): Vec3 {
    const a = this.actor;
    const bomb = ctx.bomb;
    let base: { x: number; z: number };

    if (bomb.state === 'planted') {
      base = { x: bomb.pos.x, z: bomb.pos.z };
    } else if (a.team === 'CT') {
      // Mostly hold the assigned spot, occasionally drift to another angle on the site.
      const anchors = CT_ANCHORS[this.site];
      base =
        this.anchor && this.rng.next() < 0.65
          ? WAYPOINTS[this.anchor]
          : WAYPOINTS[anchors[this.rng.int(0, anchors.length)]];
    } else {
      const c = bombSiteCenter(this.site);
      base = { x: c.x, z: c.z };
    }

    const radius = bomb.state === 'planted' ? 9 : 7;
    for (let i = 0; i < 12; i++) {
      const ang = this.rng.next() * Math.PI * 2;
      const r = 1.5 + this.rng.next() * radius;
      const x = base.x + Math.cos(ang) * r;
      const z = base.z + Math.sin(ang) * r;
      const idx = ctx.nav.nearestWalkable(x, z, 2);
      if (idx >= 0) {
        return new Vec3(
          ctx.nav.cellX(idx % ctx.nav.cols),
          ctx.nav.height[idx],
          ctx.nav.cellZ(Math.floor(idx / ctx.nav.cols)),
        );
      }
    }
    return new Vec3(base.x, a.pos.y, base.z);
  }

  /**
   * Which way to watch while holding. Facing the enemy spawn directly usually means facing
   * a wall, so instead we path from their spawn to this position and look back up that
   * route — the spot an attacker will actually walk out of.
   */
  private pickHoldYaw(ctx: SimContext, spot: Vec3): number {
    const a = this.actor;
    const spawn = otherTeam(a.team) === 'T' ? WAYPOINTS.tSpawn : WAYPOINTS.ctSpawn;
    tmpDir.set(spawn.x, spot.y, spawn.z);

    const path = ctx.nav.findPath(tmpDir, spot);
    if (path && path.length >= 2) {
      let back = 0;
      for (let i = path.length - 1; i > 0; i--) {
        back += path[i].distanceTo2D(path[i - 1]);
        if (back > 8) return yawTo(spot, path[i - 1]);
      }
      return yawTo(spot, path[0]);
    }
    return yawTo(spot, tmpDir);
  }

  private doSearch(ctx: SimContext, dt: number): void {
    const a = this.actor;
    if (!this.hasLastKnown || ctx.time - this.lastSawTargetAt > 12) {
      this.hasLastKnown = false;
      this.state = this.route.length > 0 && this.routeIndex < this.route.length ? 'advance' : 'hold';
      return;
    }
    if (a.pos.distanceTo2D(this.lastKnown) < 2.5) {
      this.hasLastKnown = false;
      this.state = 'hold';
      return;
    }
    this.navigateTo(ctx, this.lastKnown, dt);
    this.lookAlongPath(dt);
  }

  private doPickupBomb(ctx: SimContext, dt: number): void {
    const a = this.actor;
    if (ctx.bomb.state !== 'dropped') {
      this.state = 'advance';
      return;
    }
    this.navigateTo(ctx, ctx.bomb.pos, dt);
    this.lookAlongPath(dt);
    if (a.hasBomb) this.state = 'advance';
  }

  private doPlant(ctx: SimContext, dt: number): void {
    const a = this.actor;
    if (!canPlantHere(a)) {
      this.state = 'advance';
      updatePlant(ctx, a, false, dt);
      return;
    }
    a.command.forward = 0;
    a.command.right = 0;
    // Watch the way the CTs will come in while the plant runs; recomputed rarely because
    // it costs a path query.
    if (ctx.time > this.plantYawAt) {
      this.plantYawAt = ctx.time + 1.5;
      this.holdYaw = this.pickHoldYaw(ctx, a.pos);
    }
    this.turnTowards(this.holdYaw, 0, dt, 3);
    const planting = updatePlant(ctx, a, true, dt);
    if (!planting) {
      this.state = ctx.bomb.state === 'planted' ? 'hold' : 'advance';
      this.holdSpot = null;
    }
  }

  private doDefuse(ctx: SimContext, dt: number): void {
    const a = this.actor;
    const bomb = ctx.bomb;
    if (bomb.state !== 'planted') {
      this.state = 'advance';
      return;
    }
    if (!canDefuseHere(ctx, a)) {
      updateDefuse(ctx, a, false, dt);
      this.navigateTo(ctx, bomb.pos, dt);
      this.lookAlongPath(dt);
      return;
    }
    // Under fire, back out of the defuse and fight instead.
    if (this.targetVisible && a.defuseProgress < 0.15 && this.rng.next() < 0.5) {
      updateDefuse(ctx, a, false, dt);
      this.state = 'engage';
      return;
    }
    a.command.forward = 0;
    a.command.right = 0;
    tmpDir.set(bomb.pos.x, a.pos.y, bomb.pos.z);
    this.turnTowards(yawTo(a.pos, tmpDir), -0.5, dt, 4);
    const defusing = updateDefuse(ctx, a, true, dt);
    if (!defusing) this.state = 'advance';
  }

  private doEngage(ctx: SimContext, dt: number): void {
    const a = this.actor;
    const target = ctx.actors.find((o) => o.id === this.targetId);

    if (!target || !target.alive) {
      this.dropTarget();
      this.state = this.hasLastKnown ? 'search' : 'hold';
      return;
    }

    if (!this.targetVisible) {
      if (ctx.time - this.lastSawTargetAt > 1.2) {
        this.state = 'search';
        return;
      }
    }

    const dist = a.pos.distanceTo(target.pos);
    const def = a.weapon();

    // --- aim ---------------------------------------------------------------
    const wantHead = this.rng.next() < 0.18 + this.skill * 0.35 && dist < 35;
    aimPointFor(target.pos, wantHead ? 'head' : 'chest', target.crouching, tmpAim);
    // Lead the shot slightly for moving targets.
    const lead = clamp(dist / 220, 0, 0.12) * (0.4 + this.skill * 0.8);
    tmpAim.x += target.vel.x * lead;
    tmpAim.z += target.vel.z * lead;

    a.eyePos(tmpEye);
    const desiredYaw = yawTo(tmpEye, tmpAim);
    const desiredPitch = pitchTo(tmpEye, tmpAim);

    // Aim error shrinks the longer a bot has been tracking the same target.
    const settle = clamp((ctx.time - this.reactionUntil) * 1.4, 0, 1);
    const steady = a.speed < 0.7 ? 0.75 : 1;
    const errorScale = ((1 - this.skill) * 0.06 * (1 - settle * 0.75) + 0.004) * steady;
    const jitter = Math.sin(ctx.time * 7.3 + a.id) * 0.15 + this.rng.gauss() * 0.5;
    const turnRate = 4.5 + this.skill * 11;

    // Bots compensate their own recoil, better bots more completely.
    const compPitch = a.viewPunchPitch * (0.35 + this.skill * 0.6);
    const compYaw = a.viewPunchYaw * (0.35 + this.skill * 0.6);

    this.turnTowards(
      desiredYaw + jitter * errorScale - compYaw,
      desiredPitch + jitter * errorScale * 0.6 - compPitch,
      dt,
      turnRate,
    );

    // --- scope discipline (AWP) --------------------------------------------
    if (def.scope) {
      const wantScope = dist > 16 && a.speed < 2.5;
      if (wantScope && a.scopeLevel === 0) toggleScope(ctx, a);
      else if (!wantScope && a.scopeLevel > 0) toggleScope(ctx, a);
    }

    // --- movement ----------------------------------------------------------
    const preferred = def.botPreferredRange;
    if (dist > preferred * 1.35 && def.slot !== 'melee') {
      this.navigateTo(ctx, target.pos, dt, true);
    } else if (dist < preferred * 0.35 && def.slot !== 'melee') {
      // Too close: back off along the line to the target.
      tmpDir.subVectors(a.pos, target.pos).normalize();
      this.moveInWorldDir(tmpDir);
      this.path = [];
    } else if (def.slot === 'melee') {
      this.navigateTo(ctx, target.pos, dt, true);
    } else {
      this.path = [];
      if (ctx.time > this.strafeUntil) {
        this.strafeUntil = ctx.time + 0.5 + this.rng.next() * 0.9;
        this.strafeDir = this.rng.bool() ? 1 : -1;
        if (this.rng.next() < 0.25) this.strafeDir = 0;
      }
      // Accurate bots stop to shoot (counter-strafing), sloppy ones spray on the move.
      const holdStill = this.skill > 0.45 && dist > 8 && ctx.time < this.burstUntil;
      a.command.right = holdStill ? 0 : this.strafeDir;
      a.command.forward = 0;
      a.command.walk = dist > 30 && this.skill > 0.5;
    }

    // --- trigger -----------------------------------------------------------
    if (!this.targetVisible || ctx.time < this.reactionUntil) return;

    const aimError = Math.abs(angleDelta(a.yaw, desiredYaw)) + Math.abs(a.pitch - desiredPitch) * 0.5;
    const cone = currentSpread(a) + 0.02 + (def.slot === 'melee' ? 0.5 : 0);
    const angularSize = Math.atan2(0.55, Math.max(1, dist));
    if (aimError > Math.max(cone, angularSize * 0.9)) return;
    if (def.slot === 'melee' && dist > def.maxRange) return;

    // Never shoot through a teammate.
    dirFromAngles(a.yaw + a.viewPunchYaw, a.pitch + a.viewPunchPitch, tmpDir);
    const trace = traceBullet(ctx, a, tmpEye, tmpDir, def.maxRange);
    if (trace.actor && trace.actor.team === a.team) return;

    if (ctx.time < this.burstPauseUntil) return;
    if (ctx.time > this.burstUntil) {
      if (def.automatic) {
        this.burstUntil = ctx.time + 0.18 + this.skill * 0.4 + this.rng.next() * 0.2;
        this.burstPauseUntil = this.burstUntil + 0.12 + (1 - this.skill) * 0.4;
      } else {
        this.burstUntil = ctx.time + 0.02;
        this.burstPauseUntil = this.burstUntil + 0.1 + (1 - this.skill) * 0.35;
      }
    }
    tryFire(ctx, a);
  }

  // --------------------------------------------------------------- utilities

  /** Follows (and refreshes) an A* path towards `goal`. */
  private navigateTo(ctx: SimContext, goal: Vec3, _dt: number, sprint = false): void {
    const a = this.actor;

    const goalMoved = !this.hasGoal || this.goal.distanceTo2D(goal) > 2.5;
    if (goalMoved || ctx.time > this.repathAt || this.path.length === 0) {
      this.goal.copy(goal);
      this.hasGoal = true;
      this.repathAt = ctx.time + 0.6 + this.rng.next() * 0.6;
      const path = ctx.nav.findPath(a.pos, goal);
      this.path = path ?? [];
      this.pathIndex = 0;
    }

    if (this.path.length === 0) {
      // No route: at least push towards the goal so we do not stand still forever.
      tmpDir.subVectors(goal, a.pos);
      tmpDir.y = 0;
      if (tmpDir.length2D() > 0.5) this.moveInWorldDir(tmpDir.normalize());
      return;
    }

    let wp = this.path[this.pathIndex];
    while (wp && a.pos.distanceTo2D(wp) < 1.1) {
      this.pathIndex++;
      wp = this.path[this.pathIndex];
    }
    if (!wp) {
      this.path = [];
      return;
    }

    tmpDir.subVectors(wp, a.pos);
    tmpDir.y = 0;
    if (tmpDir.length2D() > 0.001) {
      tmpDir.normalize();
      this.moveInWorldDir(tmpDir);
      if (!sprint && this.rng.next() < 0.002) a.command.walk = true;
    }
  }

  /** Converts a world-space direction into the actor's local move command. */
  private moveInWorldDir(dir: Vec3): void {
    const a = this.actor;
    forwardFromYaw(a.yaw, tmpFwd);
    rightFromYaw(a.yaw, tmpRight);
    a.command.forward = clamp(dir.x * tmpFwd.x + dir.z * tmpFwd.z, -1, 1);
    a.command.right = clamp(dir.x * tmpRight.x + dir.z * tmpRight.z, -1, 1);
  }

  private lookAlongPath(dt: number): void {
    const a = this.actor;
    let lookTarget: Vec3 | null = null;
    if (this.path.length > 0) {
      lookTarget = this.path[Math.min(this.pathIndex + 1, this.path.length - 1)];
    } else if (this.hasGoal) {
      lookTarget = this.goal;
    }
    if (!lookTarget) return;
    tmpTargetEye.set(lookTarget.x, a.pos.y + a.eyeHeight * 0.9, lookTarget.z);
    a.eyePos(tmpEye);
    this.turnTowards(yawTo(tmpEye, tmpTargetEye), pitchTo(tmpEye, tmpTargetEye) * 0.35, dt, 5.5);
  }

  private turnTowards(yaw: number, pitch: number, dt: number, rate: number): void {
    const a = this.actor;
    const dYaw = angleDelta(a.yaw, yaw);
    a.yaw += clamp(dYaw, -rate * dt, rate * dt);
    a.pitch = moveTowards(a.pitch, clamp(pitch, -1.2, 1.2), rate * dt);
  }

  /** Detects bots grinding against geometry and nudges them free. */
  private updateStuck(ctx: SimContext, dt: number): void {
    const a = this.actor;
    const wantsToMove = Math.abs(a.command.forward) + Math.abs(a.command.right) > 0.2;

    if (wantsToMove && a.speed < 1.2) this.stuckFor += dt;
    else this.stuckFor = Math.max(0, this.stuckFor - dt * 2);

    if (ctx.time < this.unstickUntil) {
      forwardFromYaw(this.unstickYaw, tmpDir);
      this.moveInWorldDir(tmpDir);
      return;
    }

    if (this.stuckFor > 0.7) {
      this.stuckFor = 0;
      this.path = [];
      this.repathAt = 0;
      this.unstickUntil = ctx.time + 0.35 + this.rng.next() * 0.3;
      this.unstickYaw = a.yaw + (this.rng.bool() ? 1 : -1) * (0.8 + this.rng.next() * 1.4);
      if (this.rng.next() < 0.25) a.command.jump = true;
    }

    this.lastPos.copy(a.pos);
  }

  get debugState(): string {
    return this.state;
  }

  get currentTarget(): number {
    return this.targetId;
  }
}

/**
 * Assigns the round's tactics: the T side picks a site and spreads over the classic
 * routes, the CT side splits 2 / 2 with a mid roamer.
 */
export function planRound(ctx: SimContext, brains: BotBrain[], rng: Rng): 'A' | 'B' {
  const site: 'A' | 'B' = rng.bool() ? 'A' : 'B';
  const routes = T_ROUTES[site];

  const ts = ctx.actors.filter((a) => a.team === 'T');
  const cts = ctx.actors.filter((a) => a.team === 'CT');

  const otherSite: 'A' | 'B' = site === 'A' ? 'B' : 'A';

  let tIndex = 0;
  for (const a of ts) {
    const brain = brains.find((b) => b.actor.id === a.id);
    if (!brain) {
      tIndex++;
      continue;
    }
    // Real T sides rarely five-stack: the last player lurks the other site, both to hold
    // the CTs there honest and to be in position if the round swings.
    const isLurker = tIndex === ts.length - 1 && !a.hasBomb;
    const targetSite = isLurker ? otherSite : site;
    const pool = isLurker ? T_ROUTES[otherSite] : routes;
    const route = pool[tIndex % pool.length];
    const role: BotRole = tIndex === 0 ? 'entry' : isLurker ? 'lurker' : 'support';
    brain.assignRoute(targetSite, [...route], role);
    tIndex++;
  }

  // Two defenders per site holding depth inside it, plus a flex player at the rotation
  // hub. Without smokes and flashes, forward positions out in long or in tunnels just
  // trade themselves out against a stacked push, so the bots play the sites.
  const anchorPlan: Array<{ site: 'A' | 'B'; anchor: WaypointId; role: BotRole }> = [
    { site: 'A', anchor: 'aSite', role: 'anchor' },
    { site: 'B', anchor: 'bSite', role: 'anchor' },
    { site: 'A', anchor: 'aSiteBack', role: 'anchor' },
    { site: 'B', anchor: 'bSiteBack', role: 'anchor' },
    { site: rng.bool() ? 'A' : 'B', anchor: 'ctSpawn', role: 'rotator' },
  ];

  let ctIndex = 0;
  for (const a of cts) {
    const brain = brains.find((b) => b.actor.id === a.id);
    if (!brain) {
      ctIndex++;
      continue;
    }
    const plan = anchorPlan[ctIndex % anchorPlan.length];
    brain.assignAnchor(plan.site, plan.anchor, plan.role);
    ctIndex++;
  }

  return site;
}
