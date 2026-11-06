// Bot AI: an explicit state machine driving the same Intent interface as the player.
//
//   FREEZE ──► OBJECTIVE (route / hold / plant / defuse / guard / fetch bomb)
//                 │  ▲
//      enemy seen │  │ target lost (timeout) / dead
//                 ▼  │
//               ENGAGE ──► CHASE (last known position) ──► OBJECTIVE
//
// Perception: FOV + line-of-sight raycasts (walls block vision), hearing of gunfire and
// footsteps, damage awareness. Aiming: limited turn rate, decaying aim error, reaction
// delay, recoil compensation and burst control.

import * as THREE from 'three';
import type { Game } from '../Game';
import type { Soldier } from '../entities/Soldier';
import type { HoldSpot } from '../world/MapData';
import type { PathPoint } from '../nav/NavGrid';
import type { SiteId } from '../types';
import { clearIntent, type Intent } from '../types';
import { DEG, approachAngle, clamp, pick, pitchToward, rand, randInt, randSym, wrapAngle, yawToward, type V2 } from '../math';
import { rectContains } from '../world/MapData';

export type BotState = 'freeze' | 'route' | 'hold' | 'engage' | 'chase' | 'plant' | 'defuse' | 'guard' | 'fetch' | 'investigate' | 'dead';

export type BotGoal = { kind: 'route'; route: string[]; site: SiteId } | { kind: 'hold'; spot: HoldSpot };

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpEye = new THREE.Vector3();

export class BotBrain {
  readonly s: Soldier;
  private g: Game;
  skill: number;
  state: BotState = 'freeze';
  goal: BotGoal | null = null;

  // navigation
  private path: PathPoint[] = [];
  private pathIdx = 0;
  private pathGoal: V2 | null = null;
  private repathAt = 0;
  private stuckCheckAt = 0;
  private stuckPos = new THREE.Vector3();
  private stuckCount = 0;
  private unstickUntil = 0;
  private unstickDir = 1;

  // objective
  private routeIdx = 0;
  private sitePoint: V2 | null = null;
  private plantSpot: V2 | null = null;
  private guardPoint: V2 | null = null;
  private guardLook: V2 | null = null;
  private idleSweep = 0;
  private crouchHold = false;
  fetchBomb = false;

  // combat
  target: Soldier | null = null;
  private targetVisible = false;
  private lastSeen = -100;
  private lastSeenPos = new THREE.Vector3();
  private reactionAt = 0;
  private errYaw = 0;
  private errPitch = 0;
  private aimYaw = 0;
  private aimPitch = 0;
  private aimHead = false;
  private burstLeft = 0;
  private pauseUntil = 0;
  private nextSemiAt = 0;
  private strafeDir = 1;
  private strafeUntil = 0;
  private lastShotSeen = -1;
  private sprayCrouch = false;
  private nextPerceive = 0;
  visible: Soldier[] = [];

  // hearing
  private heardPos = new THREE.Vector3();
  private heardAt = -100;

  constructor(s: Soldier, g: Game, skill: number) {
    this.s = s;
    this.g = g;
    this.skill = skill;
  }

  resetForRound(goal: BotGoal | null) {
    this.goal = goal;
    this.state = 'freeze';
    this.path = [];
    this.pathIdx = 0;
    this.pathGoal = null;
    this.routeIdx = 0;
    this.sitePoint = null;
    this.plantSpot = null;
    this.guardPoint = null;
    this.guardLook = null;
    this.target = null;
    this.targetVisible = false;
    this.lastSeen = -100;
    this.heardAt = -100;
    this.fetchBomb = false;
    this.stuckCount = 0;
    this.visible = [];
    this.crouchHold = Math.random() < 0.3;
    this.idleSweep = Math.random() * 10;
  }

  hear(pos: THREE.Vector3) {
    this.heardPos.copy(pos);
    this.heardAt = this.g.time;
  }

  onDamaged(attacker: Soldier | null) {
    if (!attacker) return;
    this.hear(attacker.pos);
    this.nextPerceive = 0;
  }

  // ------------------------------------------------------------------ perception
  private perceive() {
    const s = this.s, g = this.g, t = g.time;
    s.eye(tmpEye);
    let best: Soldier | null = null;
    let bestScore = Infinity;
    this.visible.length = 0;
    const recentlyHurt = t - s.lastHurtTime < 1.2;
    const heardRecently = t - this.heardAt < 1.5;
    for (const o of g.soldiers) {
      if (!o.alive || o.team === s.team) continue;
      const dx = o.pos.x - s.pos.x, dz = o.pos.z - s.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > 110) continue;
      const ang = Math.abs(wrapAngle(yawToward(dx, dz) - s.yaw));
      const nearHeard = heardRecently && o.pos.distanceTo(this.heardPos) < 6;
      const fovOk = ang < 68 * DEG || d < 4 || (recentlyHurt && o.id === s.lastAttackerId) || (nearHeard && ang < 120 * DEG);
      if (!fovOk) continue;
      const vis =
        g.world.segmentClear(tmpEye.x, tmpEye.y, tmpEye.z, o.pos.x, o.pos.y + 1.62 - 0.38 * o.crouch, o.pos.z) ||
        g.world.segmentClear(tmpEye.x, tmpEye.y, tmpEye.z, o.pos.x, o.pos.y + 1.0 - 0.3 * o.crouch, o.pos.z);
      if (!vis) continue;
      this.visible.push(o);
      o.lastSeenByEnemy = t;
      g.planner.reportSighting(s.team, o);
      let score = d + ang * 25;
      if (o === this.target) score -= 15; // target stickiness
      if (o.id === s.lastAttackerId && recentlyHurt) score -= 20;
      if (score < bestScore) {
        bestScore = score;
        best = o;
      }
    }
    if (best) {
      if (best !== this.target || !this.targetVisible) this.acquire(best);
      this.targetVisible = true;
      this.lastSeen = t;
      this.lastSeenPos.copy(best.pos);
    } else {
      this.targetVisible = false;
    }
  }

  private acquire(o: Soldier) {
    const s = this.s, t = this.g.time;
    const fresh = this.target !== o || t - this.lastSeen > 1.0;
    this.target = o;
    if (!fresh) return;
    const dx = o.pos.x - s.pos.x, dz = o.pos.z - s.pos.z;
    const d = Math.hypot(dx, dz);
    const ang = Math.abs(wrapAngle(yawToward(dx, dz) - s.yaw));
    const sk = this.skill;
    this.reactionAt = t + (0.34 - sk * 0.2) + Math.random() * 0.16 + (ang > 40 * DEG ? 0.12 : 0);
    const errScale = (5.5 - sk * 3.8) * clamp(18 / Math.max(d, 4), 0.5, 1.6);
    this.errYaw = randSym() * errScale * DEG;
    this.errPitch = (randSym() * 0.6 - 0.25) * errScale * DEG;
    this.aimYaw = s.yaw;
    this.aimPitch = s.pitch;
    this.aimHead = Math.random() < 0.2 + sk * 0.35 && d < 35;
    this.burstLeft = 0;
    this.pauseUntil = 0;
    this.sprayCrouch = sk > 0.55 && d > 16 && Math.random() < 0.4;
  }

  // ------------------------------------------------------------------ main tick
  think(dt: number) {
    const s = this.s, g = this.g, t = g.time;
    const intent = clearIntent(s.intent);
    if (!s.alive) {
      this.state = 'dead';
      return;
    }
    if (g.round.phase === 'freeze') {
      this.state = 'freeze';
      this.idleSweep += dt;
      s.yaw += Math.sin(this.idleSweep * 0.7) * 0.3 * dt;
      return;
    }
    if (t >= this.nextPerceive) {
      this.perceive();
      this.nextPerceive = t + 0.09 + Math.random() * 0.05;
    }

    if (this.target && (!this.target.alive || t - this.lastSeen > 4)) {
      this.target = null;
      this.targetVisible = false;
    }

    if (this.target && this.targetVisible) {
      this.state = 'engage';
      this.engage(dt, intent);
      return;
    }

    const w = s.weapon;
    // housekeeping when no enemy visible
    if (!w.reloading && w.def.slot !== 'melee' && w.ammo < w.def.magSize * 0.5 && w.reserve > 0 && t - this.lastSeen > 1.2) intent.reload = true;
    if (s.current !== 'primary' && s.weapons.primary && !w.reloading && t - this.lastSeen > 1.5) {
      const p = s.weapons.primary;
      if (p.ammo > 0 || p.reserve > 0) intent.switchSlot = 'primary';
    } else if (s.current === 'melee' && s.weapons.secondary) intent.switchSlot = 'secondary';
    if (w.def.scope && w.zoom > 0 && t - this.lastSeen > 2.5 && this.state !== 'hold') w.zoom = 0; // unscope to move at full speed

    // chase / pre-aim the last known position for a while
    if (this.target && t - this.lastSeen < 2.5) {
      this.state = 'chase';
      tmpA.copy(this.lastSeenPos);
      tmpA.y += 1.3;
      const holdAngle = s.team === 'CT' && this.goal?.kind === 'hold' && !g.round.bombPlanted;
      if (holdAngle || w.def.scope) {
        this.lookAt(tmpA, dt, 420);
        this.markStill();
      } else {
        this.navTo({ x: this.lastSeenPos.x, z: this.lastSeenPos.z }, intent, dt, { arrive: 1.5, look: tmpA, walk: false });
      }
      return;
    }

    // react to sounds
    if (t - this.heardAt < 1.8 && this.s.pos.distanceTo(this.heardPos) > 2) {
      tmpA.copy(this.heardPos);
      tmpA.y += 1.3;
      this.objective(dt, intent, tmpA);
      return;
    }

    this.objective(dt, intent, null);
  }

  // ------------------------------------------------------------------ objectives
  private objective(dt: number, intent: Intent, look: THREE.Vector3 | null) {
    const s = this.s, g = this.g;
    const b = g.round.bomb;
    const map = g.map;

    if (s.team === 'T') {
      if (b.state === 'planted') {
        this.state = 'guard';
        if (!this.guardPoint) {
          const r = 8;
          const rect = { x0: b.pos.x - r, z0: b.pos.z - r, x1: b.pos.x + r, z1: b.pos.z + r };
          this.guardPoint = g.nav.randomPointIn(rect) ?? { x: b.pos.x, z: b.pos.z };
          const site = b.site ?? 'A';
          this.guardLook = site === 'A' ? pick([map.waypoints.ctToA, map.waypoints.aShort, map.waypoints.aRamp]) : pick([map.waypoints.bDoors, map.waypoints.bEntrance]);
        }
        const arrived = this.navTo(this.guardPoint, intent, dt, { arrive: 1.2, look, walk: false });
        if (arrived) this.holdPose(intent, dt, this.guardLook!, look);
        return;
      }
      if (b.state === 'dropped' && this.fetchBomb) {
        this.state = 'fetch';
        this.navTo({ x: b.pos.x, z: b.pos.z }, intent, dt, { arrive: 0.3, look, walk: false });
        return;
      }
      const goal = this.goal;
      if (goal?.kind !== 'route') return;
      // follow the route waypoints
      if (this.routeIdx < goal.route.length) {
        this.state = 'route';
        const wp = map.waypoints[goal.route[this.routeIdx]];
        if (this.navTo(wp, intent, dt, { arrive: 2.2, look, walk: false })) this.routeIdx++;
        return;
      }
      const site = goal.site;
      if (s.hasBomb) {
        this.state = 'plant';
        if (!this.plantSpot) this.plantSpot = pick(map.plantSpots[site]);
        const inSite = rectContains(map.sites[site], s.pos.x, s.pos.z);
        if (this.navTo(this.plantSpot, intent, dt, { arrive: 0.7, look, walk: false }) && inSite) {
          intent.use = true;
          intent.forward = 0;
          intent.right = 0;
          tmpA.set(s.pos.x + 1, s.pos.y, s.pos.z);
          this.lookAt(tmpA, dt, 200, -40 * DEG);
          this.markStill();
        }
        return;
      }
      // clear the site and hold an angle
      this.state = 'hold';
      if (!this.sitePoint) this.sitePoint = g.nav.randomPointIn(map.sites[site]) ?? map.plantSpots[site][0];
      if (this.navTo(this.sitePoint, intent, dt, { arrive: 1.2, look, walk: false })) {
        const lookAtPt = site === 'A' ? map.waypoints.ctToA : map.waypoints.bDoors;
        this.holdPose(intent, dt, lookAtPt, look);
      }
      return;
    }

    // ---------------- CT
    if (b.state === 'planted') {
      this.state = 'defuse';
      const arrived = this.navTo({ x: b.pos.x, z: b.pos.z }, intent, dt, { arrive: 0.8, look, walk: false });
      if (arrived) {
        intent.use = true;
        intent.forward = 0;
        intent.right = 0;
        tmpA.copy(b.pos);
        this.lookAt(tmpA, dt, 240);
        this.markStill();
      }
      return;
    }
    const goal = this.goal;
    if (goal?.kind !== 'hold') return;
    this.state = 'hold';
    const arrived = this.navTo(goal.spot.pos, intent, dt, { arrive: 1.0, look, walk: false });
    if (arrived) this.holdPose(intent, dt, goal.spot.look, look);
  }

  /** Standing at a position, watching an angle with small sweeps. */
  private holdPose(intent: Intent, dt: number, lookPt: V2, override: THREE.Vector3 | null) {
    const s = this.s;
    this.markStill();
    this.idleSweep += dt;
    if (override) {
      this.lookAt(override, dt, 300);
    } else {
      const baseYaw = yawToward(lookPt.x - s.pos.x, lookPt.z - s.pos.z);
      const sweep = Math.sin(this.idleSweep * 0.6) * 14 * DEG;
      s.yaw = approachAngle(s.yaw, baseYaw + sweep, 140 * DEG * dt);
      s.pitch = approachAngle(s.pitch, 0, 60 * DEG * dt);
    }
    intent.crouch = this.crouchHold;
    // AWPers scope in while holding
    const w = s.weapon;
    if (w.def.scope && w.zoom === 0 && w.resumeZoom === 0 && !w.reloading && this.g.time >= s.drawEnd) intent.altPressed = true;
  }

  private markStill() {
    this.stuckPos.copy(this.s.pos);
    this.stuckCheckAt = this.g.time + 0.8;
    this.stuckCount = 0;
  }

  private lookAt(p: THREE.Vector3, dt: number, speedDeg: number, pitchOverride?: number) {
    const s = this.s;
    s.eye(tmpEye);
    const yaw = yawToward(p.x - tmpEye.x, p.z - tmpEye.z);
    const pitch = pitchOverride ?? pitchToward(p.x - tmpEye.x, p.y - tmpEye.y, p.z - tmpEye.z);
    s.yaw = approachAngle(s.yaw, yaw, speedDeg * DEG * dt);
    s.pitch = approachAngle(s.pitch, clamp(pitch, -1.2, 1.2), speedDeg * 0.6 * DEG * dt);
  }

  // ------------------------------------------------------------------ navigation
  private navTo(goal: V2, intent: Intent, dt: number, opts: { arrive: number; look: THREE.Vector3 | null; walk: boolean }): boolean {
    const s = this.s, g = this.g, t = g.time;
    const d = Math.hypot(goal.x - s.pos.x, goal.z - s.pos.z);
    if (d < opts.arrive) return true;

    const needPath =
      !this.pathGoal ||
      Math.hypot(this.pathGoal.x - goal.x, this.pathGoal.z - goal.z) > 0.75 ||
      t > this.repathAt ||
      (this.pathIdx >= this.path.length && d > opts.arrive + 0.5);
    if (needPath) {
      this.path = g.nav.findPath(s.pos.x, s.pos.z, goal.x, goal.z) ?? [];
      this.pathIdx = 0;
      this.pathGoal = { x: goal.x, z: goal.z };
      this.repathAt = t + 3 + Math.random() * 2;
    }
    while (this.pathIdx < this.path.length) {
      const p = this.path[this.pathIdx];
      const last = this.pathIdx === this.path.length - 1;
      if (Math.hypot(p.x - s.pos.x, p.z - s.pos.z) < (last ? 0.3 : 0.75)) this.pathIdx++;
      else break;
    }
    const tgt = this.pathIdx < this.path.length ? this.path[this.pathIdx] : goal;
    let dx = tgt.x - s.pos.x, dz = tgt.z - s.pos.z;
    let len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;

    // teammate separation
    for (const o of g.soldiers) {
      if (o === s || !o.alive) continue;
      const ox = s.pos.x - o.pos.x, oz = s.pos.z - o.pos.z;
      const od = Math.hypot(ox, oz);
      if (od < 1.3 && od > 0.01) {
        const k = ((1.3 - od) / 1.3) * 0.9;
        dx += (ox / od) * k;
        dz += (oz / od) * k;
      }
    }
    if (t < this.unstickUntil) {
      const ux = dz * this.unstickDir, uz = -dx * this.unstickDir;
      dx = dx * 0.3 + ux;
      dz = dz * 0.3 + uz;
    }
    len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;

    if (opts.look) this.lookAt(opts.look, dt, 360);
    else {
      const yaw = yawToward(dx, dz);
      s.yaw = approachAngle(s.yaw, yaw, 300 * DEG * dt);
      s.pitch = approachAngle(s.pitch, 0, 90 * DEG * dt);
    }

    const fx = -Math.sin(s.yaw), fz = -Math.cos(s.yaw);
    const rx = Math.cos(s.yaw), rz = -Math.sin(s.yaw);
    intent.forward = dx * fx + dz * fz;
    intent.right = dx * rx + dz * rz;
    intent.walk = opts.walk;

    // stuck detection
    if (t >= this.stuckCheckAt) {
      const moved = Math.hypot(s.pos.x - this.stuckPos.x, s.pos.z - this.stuckPos.z);
      if (moved < 0.4) {
        this.stuckCount++;
        this.repathAt = 0;
        if (this.stuckCount >= 2) {
          this.unstickUntil = t + 0.7;
          this.unstickDir = Math.random() < 0.5 ? 1 : -1;
          if (this.stuckCount >= 3) intent.jump = true;
        }
      } else this.stuckCount = 0;
      this.stuckPos.copy(s.pos);
      this.stuckCheckAt = t + 0.8;
    }
    return false;
  }

  // ------------------------------------------------------------------ combat
  private engage(dt: number, intent: Intent) {
    const s = this.s, g = this.g, t = g.time;
    const o = this.target!;
    const w = s.weapon;
    const def = w.def;
    s.eye(tmpEye);
    if (this.aimHead) o.head(tmpB);
    else o.chest(tmpB);
    const dx = tmpB.x - tmpEye.x, dy = tmpB.y - tmpEye.y, dz = tmpB.z - tmpEye.z;
    const dist = Math.hypot(dx, dz);
    const wantYaw = yawToward(dx, dz);
    const wantPitch = pitchToward(dx, dy, dz);

    const sk = this.skill;
    const turn = (240 + sk * 420) * DEG * dt;
    this.aimYaw = approachAngle(this.aimYaw, wantYaw, turn);
    this.aimPitch = approachAngle(this.aimPitch, wantPitch, turn * 0.8);
    const decay = Math.exp(-dt * (1.3 + sk * 2.6));
    this.errYaw *= decay;
    this.errPitch *= decay;
    const comp = 0.45 + sk * 0.45;
    s.yaw = this.aimYaw + this.errYaw - s.punchYaw * DEG * comp;
    s.pitch = clamp(this.aimPitch + this.errPitch - s.punchPitch * DEG * comp, -1.3, 1.3);

    const bulletYaw = s.yaw + s.punchYaw * DEG;
    const bulletPitch = s.pitch + s.punchPitch * DEG;
    const off = Math.abs(wrapAngle(bulletYaw - wantYaw)) + Math.abs(bulletPitch - wantPitch);
    const tol = Math.atan2(0.24, Math.max(dist, 1)) + 0.4 * DEG;
    const ready = t >= this.reactionAt && t >= s.drawEnd && !w.reloading;

    if (w.lastShot !== this.lastShotSeen) {
      this.lastShotSeen = w.lastShot;
      if (this.burstLeft > 0) {
        this.burstLeft--;
        if (this.burstLeft === 0) this.pauseUntil = t + rand(0.18, 0.42) * (dist > 20 ? 1.5 : 1);
      }
    }

    // ammo management
    if (def.slot !== 'melee' && w.ammo === 0 && !w.reloading) {
      const sec = s.weapons.secondary;
      if (s.current === 'primary' && sec && sec.ammo > 0 && dist < 25) intent.switchSlot = 'secondary';
      else if (w.reserve > 0) intent.reload = true;
      else if (sec && sec.ammo > 0) intent.switchSlot = 'secondary';
      else intent.switchSlot = 'melee';
    }
    if (s.current === 'melee' && dist > 3 && (s.weapons.secondary?.ammo ?? 0) > 0) intent.switchSlot = 'secondary';

    let firing = false;
    if (def.melee) {
      if (dist < 1.6 && ready && off < 20 * DEG) {
        intent.fire = true;
        firing = true;
      }
    } else if (def.scope) {
      if (w.zoom === 0 && w.resumeZoom === 0 && t >= s.drawEnd && !w.reloading) intent.altPressed = true;
      if (ready && w.zoom > 0 && s.horizontalSpeed < 1.2 && off < tol * 1.2) {
        intent.firePressed = true;
        firing = true;
      }
    } else if (def.auto) {
      if (this.burstLeft <= 0 && t >= this.pauseUntil) {
        this.burstLeft = dist > 32 ? randInt(2, 3) : dist > 15 ? randInt(3, 6) : randInt(6, 12);
      }
      if (ready && this.burstLeft > 0 && t >= this.pauseUntil && off < tol * 2.4) {
        intent.fire = true;
        firing = true;
      }
    } else {
      if (ready && t >= this.nextSemiAt && off < tol * 2) {
        intent.firePressed = true;
        firing = true;
        this.nextSemiAt = t + 60 / def.rpm + rand(0.12, 0.3) * (1.2 - sk * 0.5) + (dist > 25 ? 0.15 : 0);
      }
    }

    // movement: counter-strafe to shoot, strafe between bursts
    if (firing || (def.scope && w.zoom > 0)) {
      intent.forward = 0;
      intent.right = 0;
      intent.crouch = this.sprayCrouch && def.auto;
    } else {
      if (t >= this.strafeUntil) {
        const r = Math.random();
        this.strafeDir = r < 0.4 ? -1 : r < 0.8 ? 1 : 0;
        this.strafeUntil = t + rand(0.3, 0.8);
      }
      intent.right = this.strafeDir;
      if (def.melee || (def.slot === 'secondary' && dist > 30)) intent.forward = 1;
      intent.crouch = false;
    }
    this.markStill();
  }
}
