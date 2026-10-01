import * as THREE from 'three';
import { angleDelta, clamp, DEG, dist2D, pitchFromDir, wrapAngle, yawFromDir } from '../core/math';
import type { Difficulty, SiteId } from '../core/types';
import { clearInput, type Actor } from '../sim/Actor';
import { bestSlot } from '../sim/Combat';
import type { World } from '../sim/World';
import type { NavPoint } from '../world/NavGrid';

export interface BotSkill {
  /** Reaction delay range (s) before the first shot at a newly seen enemy. */
  reaction: [number, number];
  /** Max view turn rate (deg/s). */
  turnRate: number;
  /** Exponential view tracking rate (1/s). */
  trackRate: number;
  /** Initial aim error (deg, 1 sigma). */
  aimError: number;
  errDecay: number;
  headshot: number;
  recoilComp: number;
  fov: number;
  strafe: number;
}

export const SKILLS: Record<Difficulty, BotSkill> = {
  easy: { reaction: [0.55, 0.85], turnRate: 260, trackRate: 7, aimError: 4.2, errDecay: 1.8, headshot: 0.1, recoilComp: 0.3, fov: 100, strafe: 0.15 },
  normal: { reaction: [0.33, 0.52], turnRate: 420, trackRate: 11, aimError: 2.7, errDecay: 2.8, headshot: 0.24, recoilComp: 0.6, fov: 120, strafe: 0.45 },
  hard: { reaction: [0.2, 0.32], turnRate: 640, trackRate: 16, aimError: 1.6, errDecay: 4.2, headshot: 0.4, recoilComp: 0.85, fov: 130, strafe: 0.75 },
};

export type TaskKind = 'idle' | 'route' | 'hold' | 'plant' | 'pickup' | 'defuse' | 'hunt';

/** High-level order given by TeamAI; BotBrain turns it into movement/look/actions. */
export interface BotTask {
  kind: TaskKind;
  points?: NavPoint[];
  index?: number;
  /** Route index at which to wait until the group is released. */
  holdAt?: number;
  released?: boolean;
  group?: string;
  dest?: NavPoint;
  look?: NavPoint;
  patrol?: NavPoint[];
  nextPatrol?: number;
  site?: SiteId;
  then?: BotTask;
}

const _eye = new THREE.Vector3();
const _p = new THREE.Vector3();

/**
 * Per-bot state machine. Layers, highest priority first:
 *  1. Engage: visible enemy -> reaction delay -> aim (turn-rate limited, decaying error, recoil
 *     compensation) -> weapon-specific fire control (bursts / taps / scoped shots) -> counter-strafe.
 *  2. Objective actions (plant / defuse) when safe.
 *  3. Task execution: path following on the nav grid with smoothing, avoidance and stuck recovery.
 *  4. Awareness: pre-aim last known enemy positions, react to sounds and damage.
 */
export class BotBrain {
  readonly skill: BotSkill;
  readonly fovHalf: number;
  task: BotTask = { kind: 'idle' };

  // navigation
  private path: NavPoint[] = [];
  private pathIdx = 0;
  private pathGoal: NavPoint | null = null;
  private nextRepath = 0;
  private nextLineCheck = 0;
  private pathFailures = 0;
  private progressPos = new THREE.Vector3();
  private progressTime = 0;
  private unstuckUntil = 0;
  private unstuckDir = 0;
  private stuckCount = 0;

  // combat
  target: Actor | null = null;
  private reactionAt = 0;
  private lastSeenTime = -100;
  private readonly lastSeenPos = new THREE.Vector3();
  private aimHead = false;
  private errYaw = 0;
  private errPitch = 0;
  private burstLeft = 0;
  private burstPauseUntil = 0;
  private nextTapAt = 0;
  private seenShotTime = -100;
  private strafeDir = 0;
  private strafeUntil = 0;
  private scopeRequestedAt = -10;

  // awareness
  private readonly alertPos = new THREE.Vector3();
  private alertUntil = -1;
  private scanPhase = 0;

  constructor(
    private readonly world: World,
    readonly actor: Actor,
    difficulty: Difficulty,
  ) {
    this.skill = SKILLS[difficulty];
    this.fovHalf = (this.skill.fov / 2) * DEG;
    this.scanPhase = world.rng.range(0, 10);
  }

  resetForRound(): void {
    this.task = { kind: 'idle' };
    this.path.length = 0;
    this.pathGoal = null;
    this.target = null;
    this.lastSeenTime = -100;
    this.alertUntil = -1;
    this.burstLeft = 0;
    this.burstPauseUntil = 0;
    this.stuckCount = 0;
    this.unstuckUntil = 0;
    this.progressTime = this.world.time;
    this.progressPos.copy(this.actor.pos);
    this.seenShotTime = -100;
  }

  setTask(task: BotTask): void {
    this.task = task;
    this.path.length = 0;
    this.pathGoal = null;
    this.pathFailures = 0;
  }

  get hasRecentContact(): boolean {
    return this.world.time - this.lastSeenTime < 3;
  }

  // ================================================================== external stimuli

  hear(source: Actor, pos: THREE.Vector3): void {
    if (this.target && this.world.sees(this.actor, this.target)) return;
    // close noises are always noticed, distant ones only sometimes
    const near = source.pos.distanceToSquared(this.actor.pos) < 15 * 15;
    if (near || this.world.rng.chance(0.75)) {
      this.alertPos.copy(pos);
      this.alertPos.y += 1.2;
      this.alertUntil = this.world.time + 2.2;
    }
  }

  onDamaged(attacker: Actor): void {
    if (attacker.team === this.actor.team) return;
    if (!this.target || !this.world.sees(this.actor, this.target)) {
      this.alertPos.set(attacker.pos.x, attacker.pos.y + 1.4, attacker.pos.z);
      this.alertUntil = this.world.time + 2.5;
    }
  }

  // ================================================================== main update

  update(dt: number): void {
    const a = this.actor;
    const w = this.world;
    const inp = a.input;
    clearInput(inp);
    if (!a.alive) return;
    const now = w.time;

    if (w.phase === 'freeze') {
      this.lookAround(dt, now);
      return;
    }

    this.updateTarget(now);
    this.manageWeapon(now);

    const tgt = this.target;
    if (tgt && tgt.alive && w.sees(a, tgt)) {
      if (a.defusing && this.mustKeepDefusing()) {
        inp.use = true;
        this.aimAtActor(tgt, dt, false);
        return;
      }
      this.combat(tgt, dt, now);
      return;
    }

    // keep planting / defusing when no enemy is in sight
    this.executeTask(dt, now);
  }

  // ================================================================== perception

  private updateTarget(now: number): void {
    const w = this.world;
    const a = this.actor;
    let best: Actor | null = null;
    let bestD = Infinity;
    for (const e of w.actors) {
      if (!e.alive || e.team === a.team || !w.sees(a, e)) continue;
      const d = e.pos.distanceToSquared(a.pos);
      // stick to the current target while it stays visible
      const bias = e === this.target ? 0.6 : 1;
      if (d * bias < bestD) {
        bestD = d * bias;
        best = e;
      }
    }
    if (best) {
      if (best !== this.target || now - this.lastSeenTime > 1.2) {
        const recentlySameTarget = best === this.target && now - this.lastSeenTime < 2.5;
        const r = w.rng.range(this.skill.reaction[0], this.skill.reaction[1]);
        // peripheral targets take longer to react to
        a.eyePos(_eye);
        const yawTo = yawFromDir(best.pos.x - _eye.x, best.pos.z - _eye.z);
        const off = Math.abs(angleDelta(a.yaw, yawTo));
        this.reactionAt = now + r * (recentlySameTarget ? 0.35 : 1) * (1 + off * 0.35);
        const errScale = this.skill.aimError * DEG * (1 + off * 0.6);
        this.errYaw = w.rng.gaussian() * errScale;
        this.errPitch = w.rng.gaussian() * errScale * 0.6;
        this.aimHead = w.rng.chance(this.skill.headshot);
        this.burstLeft = 0;
      }
      this.target = best;
      this.lastSeenTime = now;
      this.lastSeenPos.copy(best.pos);
    } else if (this.target && (now - this.lastSeenTime > 4 || !this.target.alive)) {
      this.target = null;
    }
  }

  private mustKeepDefusing(): boolean {
    const w = this.world;
    const a = this.actor;
    const need = (a.hasKit ? 5 : 10) - a.defuseProgress;
    return w.bomb.timeLeft < need + 2.5 || a.defuseProgress > need * 0.6;
  }

  // ================================================================== combat

  private aimPoint(t: Actor, out: THREE.Vector3): THREE.Vector3 {
    if (this.aimHead) return t.model.headWorld(out);
    return out.set(t.pos.x, t.pos.y + 1.22 - t.crouchAmt * 0.35, t.pos.z);
  }

  /** Turns towards the target; returns angular error (rad) to the true aim point. */
  private aimAtActor(t: Actor, dt: number, compensate: boolean): number {
    const a = this.actor;
    a.eyePos(_eye);
    this.aimPoint(t, _p);
    const dx = _p.x - _eye.x;
    const dy = _p.y - _eye.y;
    const dz = _p.z - _eye.z;
    let yaw = yawFromDir(dx, dz);
    let pitch = pitchFromDir(dx, dy, dz);
    if (compensate) {
      pitch -= a.recoilPitch * DEG * this.skill.recoilComp;
      yaw += a.recoilYaw * DEG * this.skill.recoilComp;
    }
    const decay = Math.exp(-this.skill.errDecay * dt);
    this.errYaw *= decay;
    this.errPitch *= decay;
    // tracking a strafing target re-introduces some error
    const lateral = Math.abs(t.vel.x * Math.cos(yaw) - t.vel.z * Math.sin(yaw));
    this.errYaw += (this.world.rng.next() - 0.5) * lateral * 0.0025;
    this.turnTowards(yaw + this.errYaw, pitch + this.errPitch, dt, this.skill.turnRate, this.skill.trackRate);
    const ey = angleDelta(a.yaw, yaw);
    const ep = pitch - a.pitch;
    return Math.hypot(ey, ep);
  }

  private combat(t: Actor, dt: number, now: number): void {
    const a = this.actor;
    const inp = a.input;
    const w = a.weapon;
    if (!w) return;
    const def = w.def;
    const dist = a.pos.distanceTo(t.pos);

    // detect a shot fired in the previous tick (bursts)
    if (a.lastShotTime > this.seenShotTime) {
      this.seenShotTime = a.lastShotTime;
      if (this.burstLeft > 0) {
        this.burstLeft--;
        if (this.burstLeft === 0) {
          this.burstPauseUntil = now + (dist > 28 ? 0.42 : dist > 14 ? 0.28 : 0.16) * this.world.rng.range(0.8, 1.3);
        }
      }
    }

    const angErr = this.aimAtActor(t, dt, true);
    const radius = this.aimHead ? 0.12 : 0.22;
    const tol = Math.atan2(radius, Math.max(1, dist)) * 1.25 + 0.35 * DEG;
    const ready = now >= this.reactionAt && now >= a.drawEnd && !a.reloading && w.ammo > 0;
    let shooting = false;

    if (def.kind === 'knife') {
      // close in and slash
      this.steerDirect(t.pos.x, t.pos.z);
      if (dist < 1.7 && ready) {
        inp.fire = true;
        inp.firePressed = true;
      }
      return;
    }

    if (def.kind === 'sniper') {
      if (a.scopeLevel === 0 && !a.reloading && now >= a.drawEnd && now - this.scopeRequestedAt > 0.4 && a.rezoomAt === 0) {
        inp.altPressed = true;
        this.scopeRequestedAt = now;
      }
      const still = Math.hypot(a.vel.x, a.vel.z) < 1.2;
      if (ready && a.scopeLevel > 0 && now - this.scopeRequestedAt > 0.18 && angErr < tol * 0.9 && still) {
        inp.fire = true;
        inp.firePressed = true;
        shooting = true;
      }
    } else if (def.kind === 'pistol') {
      if (ready && angErr < tol * 1.3 && now >= this.nextTapAt) {
        inp.fire = true;
        inp.firePressed = true;
        shooting = true;
        this.nextTapAt = now + def.fireInterval + this.world.rng.range(0.04, dist > 15 ? 0.32 : 0.16);
      }
    } else {
      // rifles: bursts scaled by distance
      if (ready && now >= this.burstPauseUntil && angErr < Math.max(tol * 1.4, 1.1 * DEG)) {
        if (this.burstLeft <= 0) {
          const r = this.world.rng;
          this.burstLeft = dist > 28 ? r.int(1, 3) : dist > 14 ? r.int(3, 5) : r.int(6, 12);
          inp.firePressed = true;
        }
        inp.fire = true;
        shooting = true;
      }
    }

    // ---- combat movement: stop to shoot (counter-strafe), strafe between bursts
    if (a.planting || a.defusing) return;
    const speed = Math.hypot(a.vel.x, a.vel.z);
    if (shooting || (now < this.reactionAt && dist > 10)) {
      if (speed > 0.6) this.counterStrafe();
    } else if (this.skill.strafe > 0 && def.kind !== 'sniper') {
      if (now >= this.strafeUntil) {
        const r = this.world.rng;
        this.strafeDir = r.chance(this.skill.strafe) ? (r.chance(0.5) ? 1 : -1) : 0;
        this.strafeUntil = now + r.range(0.25, 0.6);
      }
      inp.right = this.strafeDir;
      inp.walk = dist > 25;
    }
  }

  private counterStrafe(): void {
    const a = this.actor;
    const sy = Math.sin(a.yaw);
    const cy = Math.cos(a.yaw);
    const vf = a.vel.x * -sy + a.vel.z * -cy;
    const vr = a.vel.x * cy + a.vel.z * -sy;
    a.input.forward = Math.abs(vf) > 0.5 ? -Math.sign(vf) : 0;
    a.input.right = Math.abs(vr) > 0.5 ? -Math.sign(vr) : 0;
  }

  private manageWeapon(now: number): void {
    const a = this.actor;
    const inp = a.input;
    const w = a.weapon;
    const inCombat = this.target !== null && now - this.lastSeenTime < 1.5;
    if (a.planting || a.defusing) return;
    if (!w) {
      inp.slot = bestSlot(a);
      return;
    }
    if (w.def.kind === 'c4' || (w.def.kind === 'knife' && (a.weapons[0] || a.weapons[1]))) {
      inp.slot = bestSlot(a);
      return;
    }
    if (w.def.magSize > 0 && w.ammo === 0) {
      if (inCombat && a.slot === 0 && a.weapons[1] && a.weapons[1].ammo > 0) inp.slot = 1;
      else if (w.reserve > 0) inp.reload = true;
      else inp.slot = a.slot === 0 && a.weapons[1] ? 1 : 2;
      return;
    }
    if (!inCombat) {
      if (a.slot !== 0 && a.weapons[0] && (a.weapons[0].ammo > 0 || a.weapons[0].reserve > 0)) {
        inp.slot = 0;
        return;
      }
      if (w.def.magSize > 0 && w.ammo < w.def.magSize * 0.45 && w.reserve > 0 && now - this.lastSeenTime > 2.5) inp.reload = true;
      // un-scope to travel at full speed
      if (a.scopeLevel > 0 && now - this.lastSeenTime > 3 && this.task.kind !== 'hold') {
        a.scopeLevel = 0;
        a.rezoomAt = 0;
      }
    }
  }

  // ================================================================== tasks

  private executeTask(dt: number, now: number): void {
    const a = this.actor;
    const inp = a.input;
    const w = this.world;
    const task = this.task;
    let moving = false;
    let lookTarget: NavPoint | null = null;

    switch (task.kind) {
      case 'route': {
        const pts = task.points ?? [];
        let i = task.index ?? 0;
        if (i >= pts.length) {
          this.setTask(task.then ?? { kind: 'idle' });
          return this.executeTask(dt, now);
        }
        const waiting = task.holdAt !== undefined && i === task.holdAt && !task.released;
        const p = pts[i];
        if (this.moveTo(p, waiting ? 1.6 : 2.2, now)) {
          if (waiting) {
            lookTarget = pts[Math.min(i + 1, pts.length - 1)];
          } else {
            i++;
            task.index = i;
          }
        } else moving = true;
        if (moving) lookTarget = this.pathLookPoint();
        break;
      }
      case 'hold': {
        const dest = task.dest!;
        if (this.moveTo(dest, 0.7, now)) {
          lookTarget = task.look ?? null;
          if (task.patrol && task.patrol.length > 1) {
            if (task.nextPatrol === undefined) task.nextPatrol = now + w.rng.range(6, 14);
            if (now >= task.nextPatrol && !this.hasRecentContact) {
              const next = w.rng.pick(task.patrol);
              task.dest = next;
              task.nextPatrol = now + w.rng.range(7, 16);
            }
          }
        } else {
          moving = true;
          lookTarget = this.pathLookPoint();
        }
        break;
      }
      case 'plant': {
        if (!a.hasBomb) {
          this.setTask({ kind: 'idle' });
          break;
        }
        const dest = task.dest!;
        const inSite = w.level.bombsiteAt(a.pos.x, a.pos.z);
        if (dist2D(a.pos.x, a.pos.z, dest.x, dest.z) > 1.2 || !inSite) {
          this.moveTo(dest, 0.6, now);
          moving = true;
          lookTarget = this.pathLookPoint();
        } else {
          inp.use = true;
          this.lookAt(a.pos.x + Math.sin(-a.yaw) * 2, a.pos.y + 0.2, a.pos.z - Math.cos(a.yaw) * 2, dt, 240);
          return;
        }
        break;
      }
      case 'pickup': {
        const b = w.bomb;
        if (b.state !== 'dropped') {
          this.setTask({ kind: 'idle' });
          break;
        }
        this.moveTo({ x: b.pos.x, z: b.pos.z }, 0.3, now);
        moving = true;
        lookTarget = this.pathLookPoint();
        break;
      }
      case 'defuse': {
        const b = w.bomb;
        if (b.state !== 'planted') {
          this.setTask({ kind: 'idle' });
          break;
        }
        if (!w.inBombReach(a)) {
          this.moveTo({ x: b.pos.x, z: b.pos.z }, 0.5, now);
          moving = true;
          lookTarget = this.pathLookPoint();
        } else {
          // only start when no threat is known nearby, or time is running out
          const threat = this.hasRecentContact && now - this.lastSeenTime < 1.2;
          if (!threat || a.defusing) {
            inp.use = true;
            this.lookAt(b.pos.x, b.pos.y + 0.1, b.pos.z, dt, 300);
            return;
          }
          lookTarget = { x: this.lastSeenPos.x, z: this.lastSeenPos.z };
        }
        break;
      }
      case 'hunt': {
        if (this.moveTo(task.dest!, 1.5, now)) {
          this.setTask({ kind: 'idle' });
        } else {
          moving = true;
          lookTarget = this.pathLookPoint();
        }
        break;
      }
      case 'idle':
      default:
        break;
    }

    // ---- look behaviour
    const recentLoss = this.target && now - this.lastSeenTime < 2.5;
    if (recentLoss) {
      // pre-aim where the enemy disappeared
      this.lookAt(this.lastSeenPos.x, this.lastSeenPos.y + 1.4, this.lastSeenPos.z, dt, this.skill.turnRate * 0.7);
    } else if (now < this.alertUntil) {
      this.lookAt(this.alertPos.x, this.alertPos.y, this.alertPos.z, dt, this.skill.turnRate * 0.6);
    } else if (!moving && this.intelLook(dt)) {
      // looking at a teammate-reported enemy
    } else if (lookTarget) {
      const gy = w.nav.heightAt(lookTarget.x, lookTarget.z) + 1.55;
      const scan = moving ? 0 : Math.sin(now * 0.7 + this.scanPhase) * 0.25;
      const yawTo = yawFromDir(lookTarget.x - a.pos.x, lookTarget.z - a.pos.z) + scan;
      const d = Math.max(1, dist2D(a.pos.x, a.pos.z, lookTarget.x, lookTarget.z));
      a.eyePos(_eye);
      const pitch = Math.atan2(gy - _eye.y, d);
      this.turnTowards(yawTo, clamp(pitch, -0.6, 0.6), dt, moving ? 300 : 160, moving ? 6 : 4);
    } else {
      this.lookAround(dt, now);
    }
  }

  /** Look towards a fresh, nearby enemy position reported by the team (radar awareness). */
  private intelLook(dt: number): boolean {
    const a = this.actor;
    const intel = this.world.intel[a.team];
    let best: { x: number; y: number; z: number } | null = null;
    let bestD = 30 * 30;
    for (const e of intel.values()) {
      if (this.world.time - e.time > 3) continue;
      const d = (e.x - a.pos.x) ** 2 + (e.z - a.pos.z) ** 2;
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    if (!best) return false;
    this.lookAt(best.x, best.y + 1.4, best.z, dt, 200);
    return true;
  }

  private lookAround(dt: number, now: number): void {
    const a = this.actor;
    const target = a.yaw + Math.sin(now * 0.5 + this.scanPhase) * 0.004;
    this.turnTowards(target, 0, dt, 60, 2);
  }

  private lookAt(x: number, y: number, z: number, dt: number, rate: number): void {
    const a = this.actor;
    a.eyePos(_eye);
    const dx = x - _eye.x;
    const dz = z - _eye.z;
    if (dx * dx + dz * dz < 0.04) return;
    const yaw = yawFromDir(dx, dz);
    const pitch = pitchFromDir(dx, y - _eye.y, dz);
    this.turnTowards(yaw, pitch, dt, rate, 8);
  }

  private turnTowards(yaw: number, pitch: number, dt: number, maxRateDeg: number, track: number): void {
    const a = this.actor;
    const k = 1 - Math.exp(-track * dt);
    let sy = angleDelta(a.yaw, yaw) * k;
    let sp = (pitch - a.pitch) * k;
    const maxStep = maxRateDeg * DEG * dt;
    const mag = Math.hypot(sy, sp);
    if (mag > maxStep) {
      sy *= maxStep / mag;
      sp *= maxStep / mag;
    }
    a.yaw = wrapAngle(a.yaw + sy);
    a.pitch = clamp(a.pitch + sp, -1.4, 1.4);
  }

  // ================================================================== locomotion

  private pathLookPoint(): NavPoint | null {
    if (this.pathIdx < this.path.length) {
      const p = this.path[Math.min(this.pathIdx + 1, this.path.length - 1)];
      const q = this.path[this.pathIdx];
      const a = this.actor;
      // look ahead to the following corner once close to the current one
      return dist2D(a.pos.x, a.pos.z, q.x, q.z) < 3 ? p : q;
    }
    return this.pathGoal;
  }

  /** Follow a nav path to `goal`; true once within `arrive` meters. */
  moveTo(goal: NavPoint, arrive: number, now: number): boolean {
    const a = this.actor;
    const w = this.world;
    const d = dist2D(a.pos.x, a.pos.z, goal.x, goal.z);
    if (d <= arrive) {
      this.progressTime = now;
      this.progressPos.copy(a.pos);
      return true;
    }
    const goalChanged = !this.pathGoal || dist2D(this.pathGoal.x, this.pathGoal.z, goal.x, goal.z) > 0.75;
    if ((goalChanged || this.pathIdx >= this.path.length) && now >= this.nextRepath) {
      const ok = w.nav.findPath(a.pos.x, a.pos.z, goal.x, goal.z, this.path, a.pos.y);
      this.pathIdx = 0;
      this.pathGoal = { x: goal.x, z: goal.z };
      this.nextRepath = now + 0.3;
      if (!ok) {
        this.pathFailures++;
        this.path.length = 0;
        this.nextRepath = now + 1;
        return false;
      }
      this.pathFailures = 0;
    }
    if (this.pathIdx >= this.path.length) return false;

    let tp = this.path[this.pathIdx];
    while (this.pathIdx < this.path.length - 1 && dist2D(a.pos.x, a.pos.z, tp.x, tp.z) < 0.65) {
      this.pathIdx++;
      tp = this.path[this.pathIdx];
    }
    // shortcut: skip a corner when the next one is already in a straight walkable line
    if (this.pathIdx < this.path.length - 1) {
      const nx = this.path[this.pathIdx + 1];
      if (dist2D(a.pos.x, a.pos.z, tp.x, tp.z) < 2 && w.nav.lineWalkable(a.pos.x, a.pos.z, nx.x, nx.z)) {
        this.pathIdx++;
        tp = nx;
      }
    }
    // drifted off the smoothed line (avoidance, pushes, inertia)? re-plan from where we are
    if (now >= this.nextLineCheck) {
      this.nextLineCheck = now + 0.2;
      if (w.nav.isWalkable(a.pos.x, a.pos.z) && !w.nav.lineWalkable(a.pos.x, a.pos.z, tp.x, tp.z) && now >= this.nextRepath) {
        if (w.nav.findPath(a.pos.x, a.pos.z, goal.x, goal.z, this.path, a.pos.y)) {
          this.pathIdx = 0;
          tp = this.path[0];
        }
        this.nextRepath = now + 0.3;
      }
    }

    this.steerDirect(tp.x, tp.z);
    if (now < this.unstuckUntil) {
      // wiggle sideways (and hop if repeatedly stuck) on top of the recovery steering
      a.input.right += this.unstuckDir * 0.8;
      a.input.jump = this.stuckCount >= 3;
    }
    this.checkStuck(now);
    return false;
  }

  /**
   * Converts a world-space move goal into forward/right input. Adds teammate avoidance (only
   * if it keeps us on walkable ground) and pulls the bot back onto the nav grid whenever it has
   * been pushed into an inflated (too-close-to-geometry) cell.
   */
  private steerDirect(x: number, z: number): void {
    const a = this.actor;
    const nav = this.world.nav;
    let dx = x - a.pos.x;
    let dz = z - a.pos.z;
    const len = Math.hypot(dx, dz);
    if (len < 1e-3) return;
    dx /= len;
    dz /= len;
    let ax = 0;
    let az = 0;
    for (const o of this.world.actors) {
      if (o === a || !o.alive) continue;
      const ox = a.pos.x - o.pos.x;
      const oz = a.pos.z - o.pos.z;
      const d2 = ox * ox + oz * oz;
      if (d2 > 1.6 * 1.6 || d2 < 1e-6 || Math.abs(o.pos.y - a.pos.y) > 1.5) continue;
      const d = Math.sqrt(d2);
      if (-(ox * dx + oz * dz) / d < -0.2) continue;
      const s = (1.6 - d) / 1.6;
      const side = dx * oz - dz * ox > 0 ? 1 : -1;
      ax += -dz * side * s * 0.9 + (ox / d) * s * 0.4;
      az += dx * side * s * 0.9 + (oz / d) * s * 0.4;
    }
    let fx = dx + ax;
    let fz = dz + az;
    let fl = Math.hypot(fx, fz) || 1;
    fx /= fl;
    fz /= fl;
    if ((ax !== 0 || az !== 0) && !nav.isWalkable(a.pos.x + fx * 0.7, a.pos.z + fz * 0.7)) {
      fx = dx;
      fz = dz;
    }
    if (!nav.isWalkable(a.pos.x, a.pos.z)) {
      const idx = nav.nearestWalkableIndex(a.pos.x, a.pos.z, 1.6, a.pos.y);
      if (idx >= 0) {
        const rx = nav.cellCenterX(idx) - a.pos.x;
        const rz = nav.cellCenterZ(idx) - a.pos.z;
        const rl = Math.hypot(rx, rz);
        if (rl > 0.05) {
          fx = fx * 0.35 + rx / rl;
          fz = fz * 0.35 + rz / rl;
          fl = Math.hypot(fx, fz) || 1;
          fx /= fl;
          fz /= fl;
        }
      }
    }
    const sy = Math.sin(a.yaw);
    const cy = Math.cos(a.yaw);
    a.input.forward = fx * -sy + fz * -cy;
    a.input.right = fx * cy + fz * -sy;
  }

  private checkStuck(now: number): void {
    const a = this.actor;
    if (now - this.progressTime < 0.9) return;
    const moved = dist2D(a.pos.x, a.pos.z, this.progressPos.x, this.progressPos.z);
    if (moved < 0.35 && !a.rooted) {
      this.stuckCount++;
      this.unstuckUntil = now + 0.45;
      this.unstuckDir = this.world.rng.chance(0.5) ? 1 : -1;
      this.path.length = 0;
      this.pathGoal = null;
      this.nextRepath = now;
      if (this.stuckCount > 6 && this.pathIdx < this.path.length) this.pathIdx++;
    } else if (moved > 1) {
      this.stuckCount = 0;
    }
    this.progressTime = now;
    this.progressPos.copy(a.pos);
  }
}
