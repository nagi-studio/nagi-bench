/**
 * Bot AI: a hierarchical finite state machine.
 *  - Perception (vision cone + LOS raycast, hearing of gunshots, damage awareness)
 *  - Combat layer (ENGAGE / CHASE) overrides the objective layer whenever an enemy is known
 *  - Objective layer (MOVE_TO, HOLD, PLANT, DEFUSE, GET_BOMB, GUARD) driven by round state
 *  - Navigation via grid A* with string pulling and stuck recovery
 */
import * as THREE from 'three';
import type { Agent } from './agent';
import { EYE } from './agent';
import type { GameMap, Vec2 } from './map';

export type BotState = 'IDLE' | 'MOVE' | 'HOLD' | 'ENGAGE' | 'CHASE' | 'PLANT' | 'DEFUSE' | 'GET_BOMB' | 'GUARD';

export interface BombInfo {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  pos: THREE.Vector3;
  site: 'A' | 'B' | null;
  carrier: Agent | null;
  defuser: Agent | null;
}

/** what the AI is allowed to see/do in the world */
export interface WorldAPI {
  map: GameMap;
  agents: Agent[];
  now: number;
  bomb: BombInfo;
  phase: 'freeze' | 'live' | 'post';
  /** T team's chosen target site this round */
  tPlan: 'A' | 'B';
  tryFire(a: Agent): boolean;
  reload(a: Agent): void;
  /** request plant/defuse progress this frame; returns true while action continues */
  actPlant(a: Agent, dt: number): boolean;
  actDefuse(a: Agent, dt: number): boolean;
  switchWeapon(a: Agent, slot: 'primary' | 'secondary' | 'melee'): void;
}

const tmp = new THREE.Vector3();

export class BotBrain {
  state: BotState = 'IDLE';
  path: Vec2[] = [];
  pathIdx = 0;
  goal: Vec2 | null = null;
  route: Vec2[] = []; // queued strategic waypoints (e.g. via long, then site)
  target: Agent | null = null;
  targetSeenAt = 0;
  reactAt = 0;
  lastKnown: Vec2 | null = null;
  lastSeenTime = 0;
  thinkTimer = Math.random() * 0.2;
  stuckTimer = 0;
  stuckPos = new THREE.Vector3();
  stuckCount = 0;
  aimErrYaw = 0;
  aimErrPitch = 0;
  burstLeft = 0;
  burstPause = 0;
  strafeDir = 1;
  strafeTimer = 0;
  holdLookYaw = 0;
  holdTimer = 0;
  wantJump = false;
  role = '';
  skill: number;
  heardPos: Vec2 | null = null;
  heardAt = 0;

  constructor(public me: Agent) {
    this.skill = 0.45 + Math.random() * 0.35;
  }

  resetRound() {
    this.state = 'IDLE';
    this.path = [];
    this.route = [];
    this.goal = null;
    this.target = null;
    this.lastKnown = null;
    this.heardPos = null;
    this.stuckCount = 0;
  }

  /** Called by the game when a gunshot is heard or damage taken */
  hear(p: Vec2, now: number, attacker?: Agent) {
    this.heardPos = { x: p.x, z: p.z };
    this.heardAt = now;
    if (attacker && attacker.alive && !this.target) {
      // turn toward attacker quickly
      this.lastKnown = { x: attacker.pos.x, z: attacker.pos.z };
      this.lastSeenTime = now;
    }
  }

  setRoute(points: Vec2[]) {
    this.route = points.slice();
    this.nextRoutePoint();
  }

  private nextRoutePoint() {
    const p = this.route.shift();
    if (p) this.moveTo(p);
  }

  moveTo(p: Vec2, w?: WorldAPI) {
    this.goal = { x: p.x, z: p.z };
    const map = w?.map ?? this.mapRef;
    if (!map) {
      this.path = [];
      this.state = 'MOVE';
      return;
    }
    this.path = map.findPath({ x: this.me.pos.x, z: this.me.pos.z }, this.goal);
    this.pathIdx = 0;
    this.state = 'MOVE';
  }

  mapRef: GameMap | null = null;

  // -------------------------------------------------------------- perception

  private canSee(w: WorldAPI, o: Agent): boolean {
    const me = this.me;
    const dx = o.pos.x - me.pos.x, dz = o.pos.z - me.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 110) return false;
    // FOV check (wide 130° cone); very close enemies are always noticed
    if (dist > 3) {
      const fx = -Math.sin(me.yaw), fz = -Math.cos(me.yaw);
      const cos = (fx * dx + fz * dz) / dist;
      if (cos < Math.cos((65 * Math.PI) / 180)) return false;
    }
    const ey = me.pos.y + EYE;
    // check head and chest
    if (w.map.visible(me.pos.x, ey, me.pos.z, o.pos.x, o.pos.y + 1.75, o.pos.z)) return true;
    if (w.map.visible(me.pos.x, ey, me.pos.z, o.pos.x, o.pos.y + 1.3, o.pos.z)) return true;
    return false;
  }

  private perceive(w: WorldAPI) {
    let best: Agent | null = null;
    let bestD = Infinity;
    for (const o of w.agents) {
      if (!o.alive || o.team === this.me.team) continue;
      if (!this.canSee(w, o)) continue;
      // reveal on radar for the enemy team of 'o'
      o.spottedUntil = w.now + 1.0;
      const d = o.pos.distanceTo(this.me.pos);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    if (best) {
      if (best !== this.target) {
        // reaction time: lower skill reacts slower, further targets take longer
        this.reactAt = w.now + 0.18 + (1 - this.skill) * 0.45 + Math.min(0.25, bestD / 200);
        this.aimErrYaw = (Math.random() - 0.5) * 0.25 * (1.2 - this.skill);
        this.aimErrPitch = (Math.random() - 0.5) * 0.15 * (1.2 - this.skill);
        this.target = best;
        this.targetSeenAt = w.now;
      }
      this.lastKnown = { x: best.pos.x, z: best.pos.z };
      this.lastSeenTime = w.now;
      if (this.state !== 'ENGAGE' && this.state !== 'PLANT' && this.state !== 'DEFUSE') this.state = 'ENGAGE';
      if ((this.state === 'PLANT' || this.state === 'DEFUSE') && bestD < 25) this.state = 'ENGAGE';
    } else if (this.target) {
      if (!this.target.alive || w.now - this.lastSeenTime > 0.6) {
        const wasTarget = this.target;
        this.target = null;
        if (wasTarget.alive && this.lastKnown && this.state === 'ENGAGE') {
          this.state = 'CHASE';
          this.goal = this.lastKnown;
          this.path = w.map.findPath({ x: this.me.pos.x, z: this.me.pos.z }, this.lastKnown);
          this.pathIdx = 0;
        } else if (this.state === 'ENGAGE') this.state = 'IDLE';
      }
    }
  }

  // -------------------------------------------------------------- main update

  update(w: WorldAPI, dt: number): { wishX: number; wishZ: number; jump: boolean; walk: boolean } {
    const me = this.me;
    this.mapRef = w.map;
    const out = { wishX: 0, wishZ: 0, jump: false, walk: false };
    if (!me.alive) return out;
    if (w.phase === 'freeze') return out;

    this.thinkTimer -= dt;
    if (this.thinkTimer <= 0) {
      this.thinkTimer = 0.1;
      this.perceive(w);
      if (w.phase === 'live') this.decideObjective(w);
    }

    // weapon housekeeping
    const wpn = me.inv.weapon;
    if (wpn.def.slot === 'melee' || (wpn.mag === 0 && wpn.reserve === 0)) {
      const best = me.inv.best();
      if (best !== me.inv.current && (me.inv.slots[best]?.mag ?? 0) + (me.inv.slots[best]?.reserve ?? 0) > 0)
        w.switchWeapon(me, best);
      else if (me.inv.slots.secondary && me.inv.current !== 'secondary' && (me.inv.slots.secondary.mag > 0 || me.inv.slots.secondary.reserve > 0))
        w.switchWeapon(me, 'secondary');
    }
    if (wpn.mag === 0 && !wpn.reloading && wpn.reserve > 0) w.reload(me);

    switch (this.state) {
      case 'ENGAGE':
        this.doEngage(w, dt, out);
        break;
      case 'PLANT':
        if (!w.actPlant(me, dt)) this.state = 'IDLE';
        this.lookAround(dt, w.now);
        break;
      case 'DEFUSE':
        if (!w.actDefuse(me, dt)) this.state = 'IDLE';
        this.lookAround(dt, w.now);
        break;
      case 'HOLD':
      case 'GUARD':
      case 'IDLE':
        this.lookAround(dt, w.now);
        if (me.inv.weapon.mag < me.inv.weapon.def.magSize * 0.5) w.reload(me);
        break;
      default:
        this.followPath(w, dt, out);
    }
    return out;
  }

  private decideObjective(w: WorldAPI) {
    const me = this.me;
    if (this.state === 'ENGAGE') return;
    const b = w.bomb;
    const map = w.map;

    // react to sounds when idle-ish
    if ((this.state === 'HOLD' || this.state === 'IDLE' || this.state === 'GUARD') && this.heardPos && w.now - this.heardAt < 0.5) {
      const d = Math.hypot(this.heardPos.x - me.pos.x, this.heardPos.z - me.pos.z);
      if (d < 40) this.holdLookYaw = Math.atan2(-(this.heardPos.x - me.pos.x), -(this.heardPos.z - me.pos.z));
    }

    if (me.team === 'T') {
      if (me.hasBomb) {
        const site = w.tPlan === 'A' ? map.siteA : map.siteB;
        const inSite = map.inZone(site, me.pos.x, me.pos.z);
        const spot = w.tPlan === 'A' ? map.points.plantA : map.points.plantB;
        const dSpot = Math.hypot(spot.x - me.pos.x, spot.z - me.pos.z);
        if (inSite && dSpot < 3) {
          this.state = 'PLANT';
          this.path = [];
          return;
        }
        if (this.state !== 'MOVE' || !this.goal || Math.hypot(this.goal.x - spot.x, this.goal.z - spot.z) > 0.5) {
          if (this.route.length === 0 && this.state !== 'MOVE') this.moveTo(spot, w);
          else if (this.state !== 'MOVE') this.nextRoutePoint();
        }
        return;
      }
      if (b.state === 'dropped') {
        // closest living T fetches the bomb
        let closest: Agent | null = null;
        let cd = Infinity;
        for (const a of w.agents)
          if (a.alive && a.team === 'T') {
            const d = a.pos.distanceTo(b.pos);
            if (d < cd) {
              cd = d;
              closest = a;
            }
          }
        if (closest === me) {
          if (this.state !== 'GET_BOMB' || !this.goal || Math.hypot(this.goal.x - b.pos.x, this.goal.z - b.pos.z) > 1) {
            this.moveTo({ x: b.pos.x, z: b.pos.z }, w);
            this.state = 'GET_BOMB';
          }
          return;
        }
      }
      if (b.state === 'planted') {
        if (this.state !== 'GUARD' && this.state !== 'MOVE') {
          const p = map.randomWalkableNear({ x: b.pos.x, z: b.pos.z }, 4);
          this.moveTo(p, w);
        } else if (this.state === 'MOVE' && this.goal && Math.hypot(this.goal.x - b.pos.x, this.goal.z - b.pos.z) > 14) {
          this.moveTo(map.randomWalkableNear({ x: b.pos.x, z: b.pos.z }, 4), w);
        }
        return;
      }
      if (this.state === 'IDLE' || this.state === 'HOLD') {
        if (this.route.length) this.nextRoutePoint();
        else if (this.state === 'IDLE') {
          // push into the site
          const site = w.tPlan === 'A' ? map.points.siteA : map.points.siteB;
          if (Math.hypot(site.x - me.pos.x, site.z - me.pos.z) > 6) this.moveTo(map.randomWalkableNear(site, 3), w);
          else this.state = 'HOLD';
        }
      }
    } else {
      // CT
      if (b.state === 'planted') {
        const d = Math.hypot(b.pos.x - me.pos.x, b.pos.z - me.pos.z);
        if (d < 1.3) {
          if (!b.defuser || b.defuser === me) {
            this.state = 'DEFUSE';
            this.path = [];
          } else if (this.state !== 'GUARD') this.state = 'GUARD';
          return;
        }
        if (this.state !== 'MOVE' || !this.goal || Math.hypot(this.goal.x - b.pos.x, this.goal.z - b.pos.z) > 1) {
          this.moveTo({ x: b.pos.x, z: b.pos.z }, w);
        }
        return;
      }
      if (this.state === 'IDLE') {
        if (this.route.length) this.nextRoutePoint();
        else this.state = 'HOLD';
      }
    }
  }

  private lookAround(dt: number, now: number) {
    const me = this.me;
    this.holdTimer -= dt;
    if (this.holdTimer <= 0 && (!this.heardPos || now - this.heardAt > 2)) {
      this.holdTimer = 1.5 + Math.random() * 2.5;
      this.holdLookYaw = me.yaw + (Math.random() - 0.5) * 2.2;
    }
    me.yaw = approachAngle(me.yaw, this.holdLookYaw, 3 * dt);
    me.pitch += (0 - me.pitch) * Math.min(1, 4 * dt);
  }

  private followPath(w: WorldAPI, dt: number, out: { wishX: number; wishZ: number; jump: boolean; walk: boolean }) {
    const me = this.me;
    if (!this.goal) {
      this.state = 'IDLE';
      return;
    }
    if (this.pathIdx >= this.path.length) {
      // arrived
      const st = this.state;
      this.goal = null;
      if (st === 'CHASE') {
        this.state = 'IDLE';
        this.holdLookYaw = me.yaw + Math.PI * (Math.random() - 0.5);
      } else if (st === 'GET_BOMB') this.state = 'IDLE';
      else if (this.route.length) this.nextRoutePoint();
      else this.state = me.team === 'T' && w.bomb.state === 'planted' ? 'GUARD' : me.team === 'CT' ? 'HOLD' : 'IDLE';
      return;
    }
    const wp = this.path[this.pathIdx];
    const dx = wp.x - me.pos.x, dz = wp.z - me.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.7) {
      this.pathIdx++;
      return;
    }
    out.wishX = dx / d;
    out.wishZ = dz / d;
    // face movement direction (or the heard noise)
    let face = Math.atan2(-dx, -dz);
    if (this.heardPos && w.now - this.heardAt < 1.5) {
      face = Math.atan2(-(this.heardPos.x - me.pos.x), -(this.heardPos.z - me.pos.z));
    }
    me.yaw = approachAngle(me.yaw, face, 6 * dt);
    me.pitch += (0 - me.pitch) * Math.min(1, 4 * dt);

    // stuck detection
    this.stuckTimer += dt;
    if (this.stuckTimer > 0.8) {
      const moved = tmp.copy(me.pos).sub(this.stuckPos).setY(0).length();
      this.stuckPos.copy(me.pos);
      this.stuckTimer = 0;
      if (moved < 0.35) {
        this.stuckCount++;
        out.jump = this.stuckCount % 2 === 0;
        // repath from current location (with a nudge)
        const g = this.goal;
        this.path = w.map.findPath({ x: me.pos.x, z: me.pos.z }, g);
        this.pathIdx = 0;
        if (this.stuckCount > 4) {
          this.stuckCount = 0;
          const near = w.map.randomWalkableNear({ x: me.pos.x, z: me.pos.z }, 1);
          this.path.unshift(near);
        }
      } else this.stuckCount = 0;
    }
  }

  private doEngage(w: WorldAPI, dt: number, out: { wishX: number; wishZ: number; jump: boolean; walk: boolean }) {
    const me = this.me;
    const t = this.target;
    if (!t || !t.alive) {
      this.target = null;
      this.state = 'IDLE';
      return;
    }
    // aim point: head for skilled bots part of the time, else chest
    const aimHead = this.skill > 0.6 || me.inv.weapon.def.id === 'awp' ? 0.5 : 0.25;
    const aimY = t.pos.y + (this.targetSeenAt % 1 < aimHead ? 1.74 : 1.4);
    const ex = me.pos.x, ey = me.pos.y + EYE, ez = me.pos.z;
    // lead slightly with target velocity
    const tx = t.pos.x + t.vel.x * 0.05, tz = t.pos.z + t.vel.z * 0.05;
    const dx = tx - ex, dy = aimY - ey, dz = tz - ez;
    const hd = Math.hypot(dx, dz);
    // aim error decays while tracking
    this.aimErrYaw *= Math.exp(-dt * (1.5 + this.skill * 3));
    this.aimErrPitch *= Math.exp(-dt * (1.5 + this.skill * 3));
    const wantYaw = Math.atan2(-dx, -dz) + this.aimErrYaw;
    const wantPitch = Math.atan2(dy, hd) + this.aimErrPitch;
    const turn = (4 + this.skill * 8) * dt;
    me.yaw = approachAngle(me.yaw, wantYaw, turn);
    me.pitch = approach(me.pitch, wantPitch, turn);
    // recoil compensation imperfect: weapon spread handles inaccuracy

    const wpn = me.inv.weapon;
    me.scoped = !!wpn.def.scope && !wpn.reloading;
    // strafe (only with non-sniper)
    this.strafeTimer -= dt;
    if (this.strafeTimer <= 0) {
      this.strafeTimer = 0.4 + Math.random() * 0.9;
      this.strafeDir = Math.random() < 0.5 ? -1 : 1;
      if (Math.random() < 0.3) this.strafeDir = 0;
    }
    const firingNow = this.burstLeft > 0;
    if (!firingNow && wpn.def.id !== 'awp' && this.strafeDir !== 0) {
      const rx = Math.cos(me.yaw), rz = -Math.sin(me.yaw);
      out.wishX = rx * this.strafeDir;
      out.wishZ = rz * this.strafeDir;
      out.walk = hd > 15;
    }
    if (wpn.def.slot === 'melee') {
      // knife: run at target
      out.wishX = dx / hd;
      out.wishZ = dz / hd;
    }

    if (w.now < this.reactAt) return;
    const yawErr = Math.abs(angleDiff(me.yaw, Math.atan2(-dx, -dz)));
    const tolerance = Math.atan2(0.45, hd) + 0.02;
    if (this.burstPause > 0) {
      this.burstPause -= dt;
      return;
    }
    if (yawErr < tolerance + 0.05) {
      if (this.burstLeft <= 0) this.burstLeft = Math.max(1, wpn.def.aiBurst + ((Math.random() * 3) | 0) - 1);
      if (wpn.canFire(w.now)) {
        if (w.tryFire(me)) {
          this.burstLeft--;
          if (this.burstLeft <= 0) this.burstPause = wpn.def.auto ? 0.2 + Math.random() * 0.35 * (hd / 30) : 0.05 + Math.random() * 0.2;
        }
      }
    }
  }
}

export function angleDiff(a: number, b: number) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
export function approachAngle(a: number, b: number, maxStep: number) {
  const d = angleDiff(a, b);
  if (Math.abs(d) <= maxStep) return b;
  return a + Math.sign(d) * maxStep;
}
function approach(a: number, b: number, s: number) {
  if (Math.abs(b - a) <= s) return b;
  return a + Math.sign(b - a) * s;
}
