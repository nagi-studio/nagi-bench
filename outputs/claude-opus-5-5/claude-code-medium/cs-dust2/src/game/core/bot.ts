// Bot AI: a hierarchical state machine.
//
//   perception  → target selection (sim provides LOS/FOV visibility lists)
//   combat      → reaction delay, aim settling, burst control, strafing
//   alert       → turn towards damage / sounds, hunt last known positions
//   objective   → T: route to site, plant, guard, fetch dropped bomb
//                 CT: hold positions, rotate on pressure, retake & defuse
//   navigation  → A* path following with stuck detection & recovery

import type { Difficulty } from './constants.ts';
import type { Entity } from './entity.ts';
import { BOMBSITES, cellCenter, siteAt, worldToCell } from './map.ts';
import type { SiteId } from './map.ts';
import { angleDiff, clamp, clone, dist2D, pick, rand, randInt, v3, wrapAngle, yawTo } from './math.ts';
import type { V3 } from './math.ts';
import type { Sim } from './sim.ts';
import type { Slot } from './weapons.ts';

export type BotState = 'idle' | 'move' | 'hold' | 'engage' | 'hunt' | 'alert' | 'plant' | 'defuse' | 'fetch' | 'guard';
export type BotRole = 'main' | 'alt' | 'A' | 'B' | 'mid';

interface Skill {
  react: [number, number];
  aimErr: number;
  settle: number;
  turn: number;
  sprayComp: number;
  headChance: number;
  fireTol: number;
}

const SKILLS: Record<Difficulty, Skill> = {
  easy: { react: [0.5, 0.85], aimErr: 0.14, settle: 2.2, turn: 4.5, sprayComp: 0.25, headChance: 0.12, fireTol: 0.035 },
  normal: { react: [0.3, 0.5], aimErr: 0.09, settle: 3.5, turn: 7, sprayComp: 0.5, headChance: 0.25, fireTol: 0.02 },
  hard: { react: [0.17, 0.3], aimErr: 0.06, settle: 5.5, turn: 10, sprayComp: 0.8, headChance: 0.4, fireTol: 0.012 },
};

const C = (c: number, r: number) => cellCenter(c, r);

/** T attack routes (waypoints in order) for each site. */
export const T_ROUTES: Record<SiteId, Record<'main' | 'alt', V3[]>> = {
  A: {
    main: [C(42, 56), C(48, 52), C(48, 34), C(48, 19)], // Long A
    alt: [C(27, 51), C(27, 31), C(34, 30), C(38, 26), C(38, 18)], // Mid → Catwalk
  },
  B: {
    main: [C(14, 56), C(8, 50), C(8, 30), C(8, 18)], // B tunnels
    alt: [C(27, 51), C(27, 40), C(22, 37), C(12, 37), C(8, 30), C(8, 18)], // Mid → lower tunnels
  },
};

const CT_HOLDS: Record<'A' | 'B' | 'mid', { p: V3; look: V3 }[]> = {
  A: [
    { p: C(48, 10), look: C(48, 22) },
    { p: C(41, 8), look: C(38, 20) },
    { p: C(44, 14), look: C(48, 24) },
    { p: C(52, 7), look: C(47, 20) },
  ],
  B: [
    { p: C(8, 9), look: C(8, 20) },
    { p: C(13, 13), look: C(8, 20) },
    { p: C(4, 9), look: C(8, 18) },
    { p: C(10, 4), look: C(8, 18) },
  ],
  mid: [
    { p: C(27, 15), look: C(27, 30) },
    { p: C(29, 12), look: C(27, 24) },
  ],
};

/** Where CTs come from, for Ts guarding a site. */
const SITE_THREATS: Record<SiteId, V3[]> = {
  A: [C(36, 8), C(38, 20), C(48, 22)],
  B: [C(17, 7), C(8, 20)],
};

const PLANT_SPOTS: Record<SiteId, V3> = { A: C(46, 9), B: C(9, 7) };

export class BotBrain {
  e: Entity;
  sim: Sim;
  state: BotState = 'idle';
  role: BotRole = 'main';

  // navigation
  private path: V3[] = [];
  private pathIdx = 0;
  private pathKey = '';
  private via: V3[] = [];
  private viaProgress = new Map<string, V3[]>();
  private holdKind = '';
  private stuckT = 0;
  private stuckPos = v3();
  private stuckCount = 0;
  private unstickUntil = 0;
  private unstickDir = 1;

  // objective
  private holdSpot: V3 | null = null;
  private holdLook: V3 | null = null;
  private plantSpot: V3 = v3();
  private startAt = 0;
  private rotateCheck = 0;

  // combat
  target: Entity | null = null;
  private targetSince = 0;
  private reactUntil = 0;
  private errYaw = 0;
  private errPitch = 0;
  private aimHead = false;
  private lastSeenPos: V3 | null = null;
  private lastSeenTime = -99;
  private heardPos: V3 | null = null;
  private heardTime = -99;
  private heardUrgent = false;
  private burstShots = 0;
  private burstLen = 0;
  private pauseUntil = 0;
  private lastMag = 0;
  private lastWeapon = '';
  private strafeDir = 1;
  private strafeUntil = 0;
  private fireToggle = false;

  constructor(e: Entity, sim: Sim) {
    this.e = e;
    this.sim = sim;
  }

  get skill(): Skill {
    return SKILLS[this.sim.cfg.difficulty];
  }

  resetRound(role: BotRole) {
    this.role = role;
    this.state = 'idle';
    this.path = [];
    this.pathIdx = 0;
    this.pathKey = '';
    this.via = [];
    this.viaProgress.clear();
    this.holdKind = '';
    this.stuckCount = 0;
    this.holdSpot = null;
    this.holdLook = null;
    this.target = null;
    this.lastSeenPos = null;
    this.heardPos = null;
    this.lastSeenTime = -99;
    this.heardTime = -99;
    this.burstLen = 0;
    this.pauseUntil = 0;
    // the bomb carrier lets the entry fraggers go first
    this.startAt = this.e.hasBomb ? rand(3, 5) : rand(0, 1.8);
    const ps = PLANT_SPOTS[this.sim.plan.site];
    this.plantSpot = { x: ps.x + rand(-1.5, 1.5), y: 0, z: ps.z + rand(-1.5, 1.5) };
  }

  onHear(pos: V3) {
    if (this.target) return;
    if (this.sim.time - this.heardTime < 0.5 && this.heardUrgent) return;
    this.heardPos = clone(pos);
    this.heardTime = this.sim.time;
    this.heardUrgent = false;
  }

  onDamaged(attacker: Entity) {
    if (this.target === attacker) return;
    this.heardPos = clone(attacker.pos);
    this.heardTime = this.sim.time;
    this.heardUrgent = true;
    this.lastSeenPos = clone(attacker.pos);
    this.lastSeenTime = this.sim.time;
  }

  // ------------------------------------------------------------------ main

  update(dt: number) {
    const e = this.e;
    const sim = this.sim;
    const inp = e.input;
    inp.moveF = 0;
    inp.moveR = 0;
    inp.fire = false;
    inp.use = false;
    inp.jump = false;
    inp.walk = false;
    inp.alt = false;
    inp.reload = false;
    inp.switchSlot = null;
    if (sim.phase === 'freeze' || sim.phase === 'over') {
      this.state = 'idle';
      return;
    }
    const now = sim.time;
    this.perceive(now);

    // Committed objective actions (planting / defusing) win over fighting
    // once they are far enough along.
    if (e.planting && (!this.target || e.plantProgress > 1.5)) {
      this.state = 'plant';
      inp.use = true;
      return;
    }
    if (e.defusing && (!this.target || sim.bomb.defuseProgress > 2)) {
      this.state = 'defuse';
      inp.use = true;
      return;
    }

    if (this.target) {
      this.state = 'engage';
      this.combat(dt, this.target, now);
      return;
    }

    this.manageWeapon(now);

    if (this.heardPos && this.heardUrgent && now - this.heardTime < 1.3) {
      this.state = 'alert';
      this.lookAt(this.heardPos, dt, this.skill.turn);
      return;
    }

    if (this.lastSeenPos && now - this.lastSeenTime < 3.5 && this.shouldHunt()) {
      this.state = 'hunt';
      const key = `hunt-${Math.round(this.lastSeenPos.x)}-${Math.round(this.lastSeenPos.z)}`;
      if (this.moveTo(this.lastSeenPos, key, dt)) this.lastSeenPos = null;
      return;
    }

    if (sim.phase === 'live' && now - sim.liveStart < this.startAt) {
      return; // staggered round start
    }

    if (e.team === 'T') this.objectiveT(dt, now);
    else this.objectiveCT(dt, now);

    // casually look towards recent sounds while holding
    if ((this.state === 'hold' || this.state === 'guard') && this.heardPos && now - this.heardTime < 2.5) {
      this.lookAt(this.heardPos, dt, this.skill.turn * 0.6);
    }
  }

  private shouldHunt(): boolean {
    const e = this.e;
    if (e.hasBomb) return false;
    if (!this.lastSeenPos) return false;
    if (dist2D(e.pos, this.lastSeenPos) > 22) return false;
    const b = this.sim.bomb;
    if (b.state === 'planted' && e.team === 'CT' && b.timeLeft < 12) return false;
    return true;
  }

  // ------------------------------------------------------------------ perception

  private perceive(now: number) {
    const sim = this.sim;
    const vis = this.e.visibleEnemies;
    if (this.target && (!this.target.alive || !vis.includes(this.target.id))) {
      if (this.target.alive) {
        this.lastSeenPos = clone(this.target.pos);
        this.lastSeenTime = now;
      }
      this.target = null;
    }
    if (!this.target && vis.length > 0) {
      let best: Entity | null = null;
      let bestD = Infinity;
      for (const id of vis) {
        const o = sim.byId.get(id);
        if (!o || !o.alive) continue;
        const d = dist2D(o.pos, this.e.pos);
        if (d < bestD) {
          bestD = d;
          best = o;
        }
      }
      if (best) {
        const sk = this.skill;
        const alerted = now - this.lastSeenTime < 1.2 || now - this.heardTime < 1.2;
        this.target = best;
        this.targetSince = now;
        this.reactUntil = now + rand(sk.react[0], sk.react[1]) * (alerted ? 0.6 : 1);
        this.errYaw = (Math.random() < 0.5 ? -1 : 1) * sk.aimErr * rand(0.5, 1);
        this.errPitch = rand(-0.5, 0.5) * sk.aimErr;
        this.aimHead = Math.random() < sk.headChance;
        this.burstLen = 0;
        this.heardUrgent = false;
      }
    }
    if (this.target) {
      this.lastSeenPos = clone(this.target.pos);
      this.lastSeenTime = now;
    }
  }

  // ------------------------------------------------------------------ combat

  private bestSlot(): Slot {
    const w = this.e.weapons;
    if (w.primary && w.primary.mag + w.primary.reserve > 0) return 'primary';
    if (w.secondary && w.secondary.mag + w.secondary.reserve > 0) return 'secondary';
    return 'melee';
  }

  private combat(dt: number, t: Entity, now: number) {
    const e = this.e;
    const sim = this.sim;
    const inp = e.input;
    const sk = this.skill;
    const w = sim.currentWeapon(e);
    const def = w.def;

    // aim
    const eye = sim.eyePos(e);
    const aimY = t.pos.y + (this.aimHead ? 1.62 : 1.22);
    const dx = t.pos.x - eye.x;
    const dz = t.pos.z - eye.z;
    const dy = aimY - eye.y;
    const hd = Math.hypot(dx, dz);
    const dist = Math.hypot(hd, dy);
    const desiredYaw = yawTo(dx, dz);
    const desiredPitch = Math.atan2(dy, hd);
    const decay = Math.exp(-sk.settle * dt);
    this.errYaw *= decay;
    this.errPitch *= decay;
    const ty = desiredYaw + this.errYaw - e.recoilYaw * sk.sprayComp;
    const tp = desiredPitch + this.errPitch - e.recoilPitch * sk.sprayComp;
    this.turnTo(ty, tp, sk.turn * (now < this.reactUntil ? 0.6 : 1), dt);

    // weapon management
    if (def.id !== this.lastWeapon) {
      this.lastWeapon = def.id;
      this.lastMag = w.mag;
      this.burstLen = 0;
    }
    const best = this.bestSlot();
    if (def.slot === 'melee' && best !== 'melee' && dist > 2.5) {
      inp.switchSlot = best;
      return;
    }
    if (def.slot !== 'melee' && w.mag === 0) {
      if (w.reserve > 0) {
        if (e.reloadUntil === 0) inp.reload = true;
        // a pistol out is faster than reloading when the enemy is close
        if (dist < 12 && e.slot === 'primary' && e.weapons.secondary && e.weapons.secondary.mag > 0) inp.switchSlot = 'secondary';
      } else if (best !== e.slot) inp.switchSlot = best;
      this.strafe(now, inp);
      return;
    }
    if (def.scopeFov && e.scope === 0 && e.resumeScope === 0 && e.reloadUntil === 0 && now >= e.drawUntil) inp.alt = true;

    // fire decision
    const shots = Math.max(0, this.lastMag - w.mag);
    this.burstShots += shots;
    this.lastMag = w.mag;
    const viewYaw = e.yaw + e.recoilYaw;
    const viewPitch = e.pitch + e.recoilPitch;
    const realYaw = desiredYaw;
    const errAng = Math.hypot(angleDiff(realYaw, viewYaw) * Math.cos(desiredPitch), desiredPitch - viewPitch);
    const tol = Math.atan2(this.aimHead ? 0.12 : 0.2, dist) + sk.fireTol;
    const canShoot = now >= this.reactUntil && now >= this.pauseUntil && e.reloadUntil === 0 && now >= e.drawUntil;
    let firing = false;
    if (def.slot === 'melee') {
      if (dist < 2.2) {
        inp.moveF = 1;
        if (canShoot && errAng < 0.35) {
          inp.fire = true;
          firing = true;
        }
      } else inp.moveF = 1;
      return;
    }
    const tolMult = def.auto ? 2 : def.scopeFov ? 0.9 : 1.4;
    if (canShoot && errAng < tol * tolMult) {
      if (def.auto) {
        if (this.burstLen === 0) {
          this.burstLen = dist < 10 ? randInt(6, 12) : dist < 25 ? randInt(3, 6) : randInt(1, 3);
          this.burstShots = 0;
        }
        if (this.burstShots >= this.burstLen) {
          this.burstLen = 0;
          this.pauseUntil = now + rand(0.18, 0.4) + (dist > 25 ? 0.25 : 0);
        } else {
          inp.fire = true;
          firing = true;
        }
      } else {
        const scopedReady = !def.scopeFov || (e.scope > 0 && now - this.targetSince > 0.25);
        if (scopedReady) {
          this.fireToggle = !this.fireToggle;
          inp.fire = this.fireToggle;
          firing = true;
          if (inp.fire && dist > 20) this.pauseUntil = now + rand(0.12, 0.3);
        }
      }
    }

    // movement: rifles stand still while firing, otherwise strafe
    if (def.scopeFov && e.scope > 0) return;
    if (firing && def.slot === 'primary') return;
    this.strafe(now, inp);
    if (dist > 40) inp.moveF = 0.5;
  }

  private strafe(now: number, inp: Entity['input']) {
    if (now > this.strafeUntil) {
      this.strafeDir = Math.random() < 0.5 ? -1 : 1;
      this.strafeUntil = now + rand(0.3, 0.85);
    }
    inp.moveR = this.strafeDir;
  }

  private manageWeapon(now: number) {
    const e = this.e;
    const inp = e.input;
    const best = this.bestSlot();
    if (e.slot !== best) {
      inp.switchSlot = best;
      return;
    }
    const w = this.sim.currentWeapon(e);
    if (w.def.slot !== 'melee' && w.mag < w.def.magSize * 0.5 && w.reserve > 0 && e.reloadUntil === 0 && now - this.lastSeenTime > 1.5) {
      inp.reload = true;
    }
    // unscope while relocating
    if (e.scope > 0 && this.state !== 'hold' && this.state !== 'guard') e.scope = 0;
  }

  // ------------------------------------------------------------------ objectives

  private objectiveT(dt: number, now: number) {
    const e = this.e;
    const sim = this.sim;
    const bomb = sim.bomb;
    const site = sim.plan.site;
    const route = T_ROUTES[site][this.role === 'alt' ? 'alt' : 'main'];

    if (bomb.state === 'planted' && bomb.site) {
      if (!this.holdSpot || this.holdKind !== 'guard') {
        const [bc, br] = worldToCell(bomb.pos.x, bomb.pos.z);
        this.holdSpot = sim.nav.randomPointIn({ c0: bc - 3, r0: br - 3, c1: bc + 3, r1: br + 3 });
        this.holdLook = pick(SITE_THREATS[bomb.site]);
        this.holdKind = 'guard';
      }
      if (this.moveTo(this.holdSpot, 'guard', dt)) {
        this.state = 'guard';
        this.holdAngle(dt, now);
      } else this.state = 'move';
      return;
    }

    if (e.hasBomb) {
      const inSite = siteAt(e.pos.x, e.pos.z) === site;
      if (inSite && (dist2D(e.pos, this.plantSpot) < 2.5 || this.stuckCount > 2)) {
        this.state = 'plant';
        e.input.use = true;
        return;
      }
      this.state = 'move';
      if (this.moveTo(this.plantSpot, 'plant-' + site, dt, route)) {
        this.state = 'plant';
        e.input.use = true;
      }
      return;
    }

    if (bomb.state === 'dropped' && this.isNearestTToBomb()) {
      this.state = 'fetch';
      const key = `fetch-${Math.round(bomb.pos.x)}-${Math.round(bomb.pos.z)}`;
      this.moveTo(bomb.pos, key, dt);
      return;
    }

    // escort: take the route into the site, then hold an angle there
    if (!this.holdSpot || this.holdKind !== 'wait') {
      this.holdSpot = sim.nav.randomPointIn(BOMBSITES[site]);
      this.holdLook = pick(SITE_THREATS[site]);
      this.holdKind = 'wait';
    }
    if (this.moveTo(this.holdSpot, 'wait-' + site, dt, route)) {
      this.state = 'hold';
      this.holdAngle(dt, now);
    } else this.state = 'move';
  }

  private isNearestTToBomb(): boolean {
    const sim = this.sim;
    let best: Entity | null = null;
    let bestD = Infinity;
    for (const o of sim.entities) {
      if (!o.alive || o.team !== 'T' || !o.isBot || o.id === sim.controlledId) continue;
      const d = dist2D(o.pos, sim.bomb.pos);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best === this.e;
  }

  private objectiveCT(dt: number, now: number) {
    const e = this.e;
    const sim = this.sim;
    const bomb = sim.bomb;

    if (bomb.state === 'planted') {
      const d = dist2D(e.pos, bomb.pos);
      const other = bomb.defuserId >= 0 && bomb.defuserId !== e.id;
      if (d < 1.1 && !other) {
        this.state = 'defuse';
        e.input.use = true;
        this.lookAt({ x: bomb.pos.x, y: bomb.pos.y, z: bomb.pos.z }, dt, this.skill.turn);
        return;
      }
      if (other && d < 7) {
        // cover the defuser
        this.state = 'guard';
        if (bomb.site) this.lookAt(pick(SITE_THREATS[bomb.site]), dt, this.skill.turn * 0.3);
        return;
      }
      this.state = 'move';
      this.moveTo(bomb.pos, 'retake', dt);
      return;
    }

    if (now > this.rotateCheck) {
      this.rotateCheck = now + 2;
      const p = sim.sitePressure('CT');
      for (const s of ['A', 'B'] as SiteId[]) {
        if (p[s] >= 2 && this.role !== s && (this.role === 'mid' || Math.random() < 0.45)) {
          this.role = s;
          this.holdSpot = null;
          break;
        }
      }
    }
    if (!this.holdSpot) {
      const h = pick(CT_HOLDS[this.role as 'A' | 'B' | 'mid'] ?? CT_HOLDS.mid);
      this.holdSpot = { x: h.p.x + rand(-0.6, 0.6), y: 0, z: h.p.z + rand(-0.6, 0.6) };
      this.holdLook = h.look;
    }
    if (this.moveTo(this.holdSpot, 'hold-' + this.role + '-' + this.holdSpot.x.toFixed(1), dt)) {
      this.state = 'hold';
      this.holdAngle(dt, now);
    } else this.state = 'move';
  }

  private holdAngle(dt: number, now: number) {
    if (!this.holdLook) return;
    const sway = Math.sin(now * 0.6 + this.e.id) * 0.25;
    const eye = this.sim.eyePos(this.e);
    const yaw = yawTo(this.holdLook.x - eye.x, this.holdLook.z - eye.z) + sway;
    this.turnTo(yaw, 0, this.skill.turn * 0.4, dt);
  }

  // ------------------------------------------------------------------ navigation

  private turnTo(yaw: number, pitch: number, rate: number, dt: number) {
    const e = this.e;
    const dy = angleDiff(yaw, e.yaw);
    const maxStep = rate * dt;
    const stepY = clamp(dy * Math.min(1, dt * 14), -maxStep, maxStep);
    e.yaw = wrapAngle(e.yaw + (Math.abs(dy) < 0.002 ? dy : stepY));
    const dp = pitch - e.pitch;
    e.pitch = clamp(e.pitch + clamp(dp * Math.min(1, dt * 14), -maxStep, maxStep), -1.4, 1.4);
  }

  private lookAt(p: V3, dt: number, rate: number) {
    const eye = this.sim.eyePos(this.e);
    const dx = p.x - eye.x;
    const dz = p.z - eye.z;
    const py = (p.y ?? 0) + 1.2 - eye.y;
    this.turnTo(yawTo(dx, dz), Math.atan2(py, Math.hypot(dx, dz)) * 0.5, rate, dt);
  }

  /** Follow a path to `goal` (optionally via waypoints). Returns true when arrived. */
  private moveTo(goal: V3, key: string, dt: number, via?: V3[]): boolean {
    const e = this.e;
    const sim = this.sim;
    const now = sim.time;
    if (key !== this.pathKey) {
      // switching objective: resume route progress if we had one for this key
      if (this.pathKey) this.viaProgress.set(this.pathKey, this.via);
      this.pathKey = key;
      this.via = this.viaProgress.get(key) ?? (via ? via.map(clone) : []);
      this.replan(goal);
    }
    // drop route waypoints once reached
    let dropped = false;
    while (this.via.length && dist2D(e.pos, this.via[0]) < 3) {
      this.via.shift();
      dropped = true;
    }
    if (dropped && this.pathIdx >= this.path.length) this.replan(goal);

    if (dist2D(e.pos, goal) < 0.8 && this.via.length === 0) return true;
    while (this.pathIdx < this.path.length && dist2D(e.pos, this.path[this.pathIdx]) < 0.6) this.pathIdx++;
    if (this.pathIdx >= this.path.length) {
      if (dist2D(e.pos, goal) < 2.0 && this.via.length === 0) return true;
      this.replan(goal);
      if (this.path.length === 0) return true; // unreachable: give up gracefully
      return false;
    }
    const wp = this.path[this.pathIdx];
    const dx = wp.x - e.pos.x;
    const dz = wp.z - e.pos.z;
    const d = Math.hypot(dx, dz) || 1;
    // face roughly along the path, but move in the exact desired direction
    this.turnTo(yawTo(dx, dz), 0, this.skill.turn * 0.7, dt);
    const sy = Math.sin(e.yaw);
    const cy = Math.cos(e.yaw);
    e.input.moveF = (-sy * dx - cy * dz) / d;
    e.input.moveR = (cy * dx - sy * dz) / d;
    // walk quietly near the final goal when holding positions
    // stuck detection
    this.stuckT += dt;
    if (this.stuckT > 0.8) {
      if (dist2D(e.pos, this.stuckPos) < 0.3) {
        this.stuckCount++;
        this.replan(goal);
        if (this.stuckCount % 2 === 0) {
          e.input.jump = true;
          this.unstickUntil = now + 0.5;
          this.unstickDir = Math.random() < 0.5 ? -1 : 1;
        }
      }
      this.stuckPos = clone(e.pos);
      this.stuckT = 0;
    }
    if (now < this.unstickUntil) e.input.moveR = this.unstickDir;
    return false;
  }

  private replan(goal: V3) {
    const e = this.e;
    this.path = this.sim.nav.findPathVia(e.pos, [...this.via, goal]) ?? [];
    this.pathIdx = 0;
    this.stuckT = 0;
    this.stuckPos = clone(e.pos);
  }
}
