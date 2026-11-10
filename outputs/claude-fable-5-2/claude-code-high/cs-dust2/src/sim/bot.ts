// Bot AI: a finite state machine driven by perception (shared visibility matrix + hearing),
// team tactics (routes, hold spots, bomb duties) and the nav grid. A bot only ever writes to its
// actor's `input` and view angles — it is simulated by exactly the same code as the player.

import { Actor, resetInput } from './actor';
import { Vec3, angleDiff, clamp, dist2D, dist3D, lerp, pitchTo, RNG, v3, vcopy, wrapAngle, yawTo } from './math';
import { siteAt } from './map';
import { RULES } from './round';
import type { Simulation } from './sim';
import type { Spot } from './tactics';
import { Slot } from './weapons';

export type BotState = 'idle' | 'advance' | 'hold' | 'engage' | 'hunt' | 'plant' | 'defuse' | 'fetch' | 'guard' | 'retake';

interface Skill {
  react: number;
  err: number;
  noise: number;
  turn: number;
  head: number;
}

const SKILLS: Skill[] = [
  { react: 0.7, err: 0.13, noise: 0.03, turn: 6, head: 0.1 },
  { react: 0.46, err: 0.085, noise: 0.018, turn: 8.5, head: 0.22 },
  { react: 0.3, err: 0.055, noise: 0.011, turn: 11, head: 0.38 },
];

export class BotBrain {
  state: BotState = 'idle';
  stateSince = 0;
  private rng: RNG;
  private skill: Skill;

  // navigation
  private path: Vec3[] = [];
  private pathIdx = 0;
  private goal: Vec3 | null = null;
  private nextRepath = 0;
  private stuckPos = v3();
  private stuckCheckAt = 0;
  stuckCount = 0;
  /** Diagnostics for the headless test. */
  stuckEvents = 0;
  stuckLog: string[] = [];
  private unstuckUntil = 0;
  private unstuckDir = 1;
  private wantsMove = false;

  // perception
  target: Actor | null = null;
  targetVisible = false;
  private lastSeenPos = v3();
  private lastSeenTime = -100;
  private reactAt = 0;
  private aimErrYaw = 0;
  private aimErrPitch = 0;
  private noiseYaw = 0;
  private noisePitch = 0;
  private nextNoiseAt = 0;
  private aimHead = false;
  private alertPos: Vec3 | null = null;
  private alertUntil = 0;

  // fire control
  private burstLeft = 0;
  private burstPauseUntil = 0;
  private nextTapAt = 0;
  private lastAmmo = 0;
  private strafeDir = 1;
  private strafeUntil = 0;
  private crouchFire = false;
  private zoomTap = false;
  /** Fighting from a prepared position: stay put behind cover instead of strafing. */
  private anchored = false;
  private chestHidden = false;
  private nextCoverCheck = 0;

  // objective
  private routeIdx = 0;
  private holdOffset = 0;
  private nextSpotChange = 0;
  private plantSpot: Vec3 | null = null;
  private guardSpot: Spot | null = null;
  private startDelay = 0;
  private nextThink = 0;
  private desiredYaw = 0;
  private desiredPitch = 0;

  constructor(
    private sim: Simulation,
    readonly actor: Actor,
  ) {
    this.rng = new RNG(1337 + actor.id * 7919 + (sim.options.seed ?? 1));
    this.skill = SKILLS[clamp(sim.options.difficulty, 0, 2)];
  }

  reset(): void {
    const now = this.sim.time;
    this.state = 'idle';
    this.stateSince = now;
    this.path = [];
    this.pathIdx = 0;
    this.goal = null;
    this.nextRepath = 0;
    this.stuckCount = 0;
    this.stuckCheckAt = now + 1;
    this.target = null;
    this.targetVisible = false;
    this.lastSeenTime = -100;
    this.alertPos = null;
    this.alertUntil = 0;
    this.burstLeft = 0;
    this.burstPauseUntil = 0;
    this.nextTapAt = 0;
    this.routeIdx = 0;
    this.holdOffset = 0;
    this.nextSpotChange = now + this.rng.range(14, 26);
    this.plantSpot = null;
    this.guardSpot = null;
    this.startDelay = this.rng.range(0, 1.2);
    this.nextThink = 0;
    this.desiredYaw = this.actor.yaw;
    this.desiredPitch = 0;
    this.skill = SKILLS[clamp(this.sim.options.difficulty, 0, 2)];
  }

  // ------------------------------------------------------------------ external stimuli
  hear(pos: Vec3, kind: 'shot' | 'step'): void {
    if (this.targetVisible) return;
    const d = dist3D(this.actor.pos, pos);
    if ((kind === 'shot' && d < 45) || (kind === 'step' && d < 11)) {
      this.alertPos = vcopy(pos);
      this.alertUntil = this.sim.time + (kind === 'shot' ? 2.5 : 1.5);
    }
  }

  onDamaged(attacker: Actor): void {
    if (this.targetVisible) return;
    this.alertPos = vcopy(attacker.pos);
    this.alertUntil = this.sim.time + 3;
  }

  // ------------------------------------------------------------------ main update
  update(dt: number): void {
    const a = this.actor;
    const now = this.sim.time;
    resetInput(a.input);
    this.wantsMove = false;
    this.sense(now);
    if (now >= this.nextThink) {
      this.think(now);
      this.nextThink = now + 0.12;
    }
    switch (this.state) {
      case 'idle':
        this.actIdle();
        break;
      case 'advance':
        this.actAdvance(now);
        break;
      case 'hold':
        this.actHold(now);
        break;
      case 'engage':
        this.actEngage(dt, now);
        break;
      case 'hunt':
        this.actHunt(now);
        break;
      case 'plant':
        this.actPlant(now);
        break;
      case 'defuse':
        this.actDefuse(now);
        break;
      case 'fetch':
        this.moveTo(this.sim.round.bomb.pos, now);
        break;
      case 'guard':
      case 'retake':
        this.actGuard(now);
        break;
    }
    this.manageWeapon(now);
    this.checkStuck(now);
    this.applyLook(dt);
    const w = a.weapon;
    this.lastAmmo = w.ammo;
  }

  private setState(s: BotState): void {
    if (s === this.state) return;
    const now = this.sim.time;
    const prev = this.state;
    this.state = s;
    this.stateSince = now;
    this.goal = null;
    this.path = [];
    this.pathIdx = 0;
    this.stuckCount = 0;
    if (s === 'engage') {
      this.burstLeft = 0;
    } else if (s !== 'hold') {
      this.anchored = false;
    }
    if (s === 'guard' || s === 'retake') this.guardSpot = null;
    if (s === 'plant') this.plantSpot = null;
    if (s === 'advance' && prev !== 'idle') {
      // resume the route from the closest waypoint instead of walking back
      const asg = this.sim.tactics[this.actor.team].get(this.actor.id);
      if (asg && asg.route.length) {
        let best = this.routeIdx;
        let bd = Infinity;
        for (let i = Math.max(0, this.routeIdx - 1); i < asg.route.length; i++) {
          const d = dist2D(this.actor.pos, asg.route[i]);
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
        this.routeIdx = Math.max(this.routeIdx, best);
      }
    }
  }

  // ------------------------------------------------------------------ perception
  private sense(now: number): void {
    const sim = this.sim;
    const a = this.actor;
    let best: Actor | null = null;
    let bestScore = Infinity;
    for (const e of sim.actors) {
      if (!e.alive || e.team === a.team) continue;
      if (!sim.sees(a.id, e.id)) continue;
      let score = dist3D(a.pos, e.pos);
      if (e === this.target) score *= 0.6;
      if (score < bestScore) {
        bestScore = score;
        best = e;
      }
    }
    if (best) {
      if (best !== this.target) {
        const fresh = !this.target || now - this.lastSeenTime > 1.2;
        const sk = this.skill;
        // A bot that is planted on an angle is already aiming where the enemy appears:
        // it reacts faster and its first shots are tighter than those of someone on the move.
        const holding = (this.state === 'hold' || this.state === 'guard' || this.state === 'retake') && a.speed < 0.6;
        const edge = holding ? 0.55 : 1;
        const react = ((fresh ? sk.react : sk.react * 0.45) + this.rng.range(0, 0.22)) * edge;
        this.reactAt = now + react * (now < this.alertUntil ? 0.6 : 1);
        this.aimErrYaw = this.rng.gauss() * sk.err * edge;
        this.aimErrPitch = this.rng.gauss() * sk.err * 0.55 * edge;
        if (fresh) this.anchored = holding && a.team === 'def' && this.state === 'hold';
        this.aimHead = this.rng.chance(sk.head);
        this.target = best;
      }
      this.targetVisible = true;
      this.lastSeenPos.x = best.pos.x;
      this.lastSeenPos.y = best.pos.y;
      this.lastSeenPos.z = best.pos.z;
      this.lastSeenTime = now;
      sim.tactics[a.team].report(best);
    } else {
      this.targetVisible = false;
      if (this.target && (!this.target.alive || now - this.lastSeenTime > 5)) this.target = null;
    }
  }

  // ------------------------------------------------------------------ decision making
  private think(now: number): void {
    const sim = this.sim;
    const me = this.actor;
    const round = sim.round;
    const bomb = round.bomb;
    const tac = sim.tactics[me.team];
    if (round.phase === 'freeze' || round.phase === 'matchover') {
      this.setState('idle');
      return;
    }
    const inCombat = !!this.target && this.target.alive && (this.targetVisible || now - this.lastSeenTime < 0.7);
    if (inCombat) {
      const mustDefuse =
        this.state === 'defuse' && bomb.defuser === me.id && bomb.explodeAt - now < round.defuseNeeded(me) - me.useTime + 2.5;
      const nearlyPlanted = this.state === 'plant' && bomb.planter === me.id && me.useTime > RULES.plantTime * 0.55;
      if (!mustDefuse && !nearlyPlanted) {
        this.setState('engage');
        return;
      }
    }
    if (round.phase === 'over') {
      this.setState(me.team === 'def' ? 'hold' : 'idle');
      return;
    }
    if (round.phase === 'live' && now - (round.phaseEnd - RULES.roundTime) < this.startDelay) {
      this.setState('idle');
      return;
    }
    const recentContact = !!this.target && this.target.alive && now - this.lastSeenTime < 3.2;
    if (me.team === 'atk') {
      if (bomb.status === 'planted') return this.setState('guard');
      if (me.hasBomb) return this.setState('plant');
      if (bomb.status === 'dropped' && tac.fetcher === me.id) return this.setState('fetch');
      if (recentContact && (this.state === 'engage' || this.state === 'hunt')) return this.setState('hunt');
      return this.setState('advance');
    }
    if (bomb.status === 'planted') {
      const someoneElse = bomb.defuser >= 0 && bomb.defuser !== me.id;
      return this.setState(tac.defuser === me.id && !someoneElse ? 'defuse' : 'retake');
    }
    if (recentContact && dist2D(me.pos, this.lastSeenPos) < 16) {
      if (this.state === 'engage' || (this.state === 'hunt' && now - this.stateSince < 5)) return this.setState('hunt');
    }
    return this.setState('hold');
  }

  // ------------------------------------------------------------------ navigation helpers
  /** Walks towards a goal along the nav path. Returns true on arrival. */
  private moveTo(goal: Vec3, now: number, arriveDist = 0.35): boolean {
    const a = this.actor;
    const nav = this.sim.nav;
    if (dist2D(a.pos, goal) < arriveDist && Math.abs(a.pos.y - goal.y) < 1.2) return true;
    if (!this.goal || dist2D(this.goal, goal) > 0.8 || now >= this.nextRepath || this.pathIdx >= this.path.length) {
      const p = nav.findPath(a.pos, goal);
      this.path = p ?? [];
      this.pathIdx = 0;
      this.goal = vcopy(goal);
      this.nextRepath = now + 2.2 + this.rng.next();
      if (!p) return false;
    }
    while (this.pathIdx < this.path.length) {
      const wp = this.path[this.pathIdx];
      const last = this.pathIdx === this.path.length - 1;
      if (dist2D(a.pos, wp) < (last ? arriveDist : 0.5)) this.pathIdx++;
      else break;
    }
    if (this.pathIdx >= this.path.length) return dist2D(a.pos, goal) < arriveDist + 0.5;
    const wp = this.path[this.pathIdx];
    let moveYaw = yawTo(a.pos, wp);
    if (now < this.unstuckUntil) moveYaw += this.unstuckDir * 1.1;
    const rel = moveYaw - a.yaw;
    a.input.moveZ = Math.cos(rel);
    a.input.moveX = -Math.sin(rel);
    this.wantsMove = true;
    // look where we are going (a little further down the path), unless something drew attention
    const ahead = this.path[Math.min(this.path.length - 1, this.pathIdx + (dist2D(a.pos, wp) < 3 ? 1 : 0))];
    if (now < this.alertUntil && this.alertPos) {
      this.lookAt(this.alertPos, 1.3);
    } else {
      this.desiredYaw = yawTo(a.pos, ahead);
      this.desiredPitch = clamp((ahead.y - a.pos.y) * 0.12, -0.3, 0.3);
    }
    return false;
  }

  private lookAt(p: Vec3, height = 1.4): void {
    const eye = this.actor.eye();
    this.desiredYaw = yawTo(eye, p);
    this.desiredPitch = clamp(pitchTo(eye, { x: p.x, y: p.y + height, z: p.z }), -1.2, 1.2);
  }

  private holdAt(spot: Spot, now: number, scan = 0.35): void {
    const a = this.actor;
    // someone already stands on the spot: settle next to it instead of shoving
    let taken = false;
    const mine = dist2D(a.pos, spot.pos);
    if (mine < 2.2) {
      for (const m of this.sim.actors) {
        if (m !== a && m.alive && m.team === a.team && dist2D(m.pos, spot.pos) < 0.7 && dist2D(m.pos, spot.pos) < mine) {
          taken = true;
          break;
        }
      }
    }
    const arrived = taken || this.moveTo(spot.pos, now, 0.3);
    if (arrived || mine < 0.4) {
      a.input.moveX = 0;
      a.input.moveZ = 0;
      this.wantsMove = false;
      if (now < this.alertUntil && this.alertPos) {
        this.lookAt(this.alertPos, 1.3);
      } else {
        this.desiredYaw = yawTo(a.pos, spot.look) + Math.sin(now * 0.8 + a.id * 1.7) * scan;
        this.desiredPitch = 0;
      }
    }
  }

  private checkStuck(now: number): void {
    const a = this.actor;
    if (now < this.stuckCheckAt) return;
    this.stuckCheckAt = now + 0.5;
    const moved = dist2D(a.pos, this.stuckPos);
    this.stuckPos.x = a.pos.x;
    this.stuckPos.y = a.pos.y;
    this.stuckPos.z = a.pos.z;
    if (!this.wantsMove || this.sim.round.phase === 'freeze' || moved > 0.35) {
      this.stuckCount = 0;
      return;
    }
    this.stuckCount++;
    this.stuckEvents++;
    if (this.stuckCount >= 2 && this.stuckLog.length < 200)
      this.stuckLog.push(`${this.state}@${a.pos.x.toFixed(1)},${a.pos.y.toFixed(1)},${a.pos.z.toFixed(1)}#${this.stuckCount}`);
    this.nextRepath = 0; // force a fresh path
    if (this.stuckCount === 1) {
      a.input.jump = true;
    } else if (this.stuckCount <= 4) {
      this.unstuckDir = this.rng.chance(0.5) ? 1 : -1;
      this.unstuckUntil = now + 0.45;
      if (this.stuckCount === 3) a.input.jump = true;
    } else {
      // last resort: hop onto the nearest nav cell centre
      const p = this.sim.nav.project(a.pos.x, a.pos.z, a.pos.y);
      const c = this.sim.nav.point(this.sim.nav.nearestValid(p.x, p.z, p.y));
      if (this.sim.world.bodyFits(c.x, c.y, c.z, a.hw, a.height)) {
        a.pos.x = c.x;
        a.pos.y = c.y;
        a.pos.z = c.z;
      }
      this.stuckCount = 0;
    }
  }

  // ------------------------------------------------------------------ state behaviours
  private actIdle(): void {
    const a = this.actor;
    if (this.sim.time < this.alertUntil && this.alertPos) this.lookAt(this.alertPos, 1.3);
    else {
      this.desiredYaw = a.yaw;
      this.desiredPitch = 0;
    }
  }

  /** Follows the assigned route. Returns true when the route is finished. */
  private followRoute(now: number): boolean {
    const a = this.actor;
    const asg = this.sim.tactics[a.team].get(a.id);
    if (!asg) return true;
    while (this.routeIdx < asg.route.length && dist2D(a.pos, asg.route[this.routeIdx]) < 2.6) this.routeIdx++;
    if (this.routeIdx >= asg.route.length) return true;
    this.moveTo(asg.route[this.routeIdx], now, 1.0);
    return false;
  }

  private actAdvance(now: number): void {
    const a = this.actor;
    const sim = this.sim;
    const tac = sim.tactics[a.team];
    const asg = tac.get(a.id);
    if (!asg || asg.area === 'mid') {
      this.actIdle();
      return;
    }
    if (!this.followRoute(now)) return;
    const posts = sim.pts.sites[asg.area].post;
    this.holdAt(posts[asg.spotIdx % posts.length], now, 0.5);
  }

  private actHold(now: number): void {
    const a = this.actor;
    const tac = this.sim.tactics[a.team];
    if (now >= this.nextSpotChange) {
      // patrol: shift to another angle of the same area every so often
      this.holdOffset += this.rng.int(1, 2);
      this.nextSpotChange = now + this.rng.range(14, 28);
    }
    this.holdAt(tac.holdSpot(a, this.holdOffset), now, 0.3);
  }

  private actHunt(now: number): void {
    const arrived = this.moveTo(this.lastSeenPos, now, 1.2);
    if (arrived || now - this.stateSince > 6) {
      this.target = null;
      this.lastSeenTime = -100;
    }
  }

  private actPlant(now: number): void {
    const a = this.actor;
    const sim = this.sim;
    const tac = sim.tactics.atk;
    const round = sim.round;
    const here = siteAt(sim.map, a.pos.x, a.pos.z);
    const hurry = round.timeLeft() < 14;
    if (!this.plantSpot) this.plantSpot = this.rng.pick(sim.pts.sites[tac.site].plant);
    const near = dist2D(a.pos, this.plantSpot) < 0.9;
    if (a.onGround && ((here === tac.site && near) || (here && hurry) || (here && round.bomb.planter === a.id))) {
      a.input.use = true;
      this.desiredPitch = -0.95;
      this.desiredYaw = a.yaw;
      return;
    }
    if (!this.followRoute(now)) return;
    this.moveTo(this.plantSpot, now, 0.6);
  }

  private actDefuse(now: number): void {
    const a = this.actor;
    const bomb = this.sim.round.bomb;
    const d = dist2D(a.pos, bomb.pos);
    if (d < 1.15 && Math.abs(a.pos.y - bomb.pos.y) < 1.2) {
      a.input.use = true;
      this.lookAt(bomb.pos, 0.1);
      return;
    }
    this.moveTo(bomb.pos, now, 0.8);
  }

  private actGuard(now: number): void {
    const a = this.actor;
    const sim = this.sim;
    const bomb = sim.round.bomb;
    if (a.team === 'atk' && bomb.defuser >= 0) {
      // someone is on the bomb: collapse onto it
      const arrived = this.moveTo(bomb.pos, now, 3);
      if (arrived || sim.world.clearLine(a.eye(), { x: bomb.pos.x, y: bomb.pos.y + 0.8, z: bomb.pos.z })) this.lookAt(bomb.pos, 0.8);
      return;
    }
    if (!this.guardSpot) {
      const site = bomb.site ?? 'A';
      if (a.team === 'atk') {
        const posts = sim.pts.sites[site].post;
        const asg = sim.tactics.atk.get(a.id);
        this.guardSpot = posts[(asg ? asg.spotIdx : a.id) % posts.length];
      } else {
        // retake: close in on the bomb and cover it from a few metres away
        const ang = this.rng.range(0, Math.PI * 2);
        const r = this.rng.range(2.5, 5);
        const p = sim.nav.project(bomb.pos.x + Math.cos(ang) * r, bomb.pos.z + Math.sin(ang) * r, bomb.pos.y);
        const out = { x: p.x + (p.x - bomb.pos.x) * 4, y: p.y, z: p.z + (p.z - bomb.pos.z) * 4 };
        this.guardSpot = { pos: p, look: out };
      }
    }
    this.holdAt(this.guardSpot, now, a.team === 'def' ? 1.4 : 0.6);
  }

  private actEngage(dt: number, now: number): void {
    const me = this.actor;
    const t = this.target;
    if (!t) return;
    const def = me.def;
    const eye = me.eye();
    const sk = this.skill;
    const src = this.targetVisible ? t.pos : this.lastSeenPos;
    const chestH = lerp(1.26, 0.92, t.crouch);
    // target behind chest-high cover: only the head is a valid aim point
    if (now >= this.nextCoverCheck) {
      this.nextCoverCheck = now + 0.15;
      this.chestHidden = this.targetVisible && !this.sim.world.clearLine(eye, { x: src.x, y: src.y + chestH, z: src.z });
    }
    const aimH = this.aimHead || this.chestHidden ? t.eyeHeight - 0.03 : chestH;
    const aim = { x: src.x, y: src.y + aimH, z: src.z };
    const dist = Math.max(0.5, dist3D(eye, aim));

    // aim error: a large initial offset that settles, plus continuous hand noise
    const settle = Math.exp(-dt * 3.4);
    this.aimErrYaw *= settle;
    this.aimErrPitch *= settle;
    if (now >= this.nextNoiseAt) {
      const moving = 1 + clamp(t.speed / 5, 0, 1) * 0.9 + clamp(me.speed / 5, 0, 1) * 0.6;
      this.noiseYaw = this.rng.gauss() * sk.noise * moving;
      this.noisePitch = this.rng.gauss() * sk.noise * 0.6 * moving;
      this.nextNoiseAt = now + this.rng.range(0.2, 0.4);
    }
    const trueYaw = yawTo(eye, aim);
    const truePitch = pitchTo(eye, aim);
    const comp = 0.75; // how much of the recoil the bot pulls down
    this.desiredYaw = trueYaw + this.aimErrYaw + this.noiseYaw - me.punchYaw * comp;
    this.desiredPitch = truePitch + this.aimErrPitch + this.noisePitch - me.punchPitch * comp;

    const viewYaw = me.yaw + me.punchYaw;
    const viewPitch = me.pitch + me.punchPitch;
    const off = Math.hypot(angleDiff(viewYaw, trueYaw) * Math.cos(truePitch), viewPitch - truePitch);
    const tol = Math.max(0.022, Math.atan2(0.35, dist) * 1.25);
    const ready = this.targetVisible && now >= this.reactAt && now >= me.drawEnd && !me.reloading;
    const canFire = ready && off < tol;

    if (def.kind === 'melee') {
      this.moveTo(t.pos, now, 0.9);
      this.desiredYaw = trueYaw;
      this.desiredPitch = truePitch;
      if (this.targetVisible && dist < 1.7) me.input.fire = true;
      return;
    }

    let standStill = false;
    if (def.kind === 'sniper') {
      standStill = true;
      const needScope = dist > 8;
      if (needScope && me.zoom === 0 && me.rezoomAt === 0 && now >= me.drawEnd && !me.reloading) {
        // tap right mouse (edge triggered)
        this.zoomTap = !this.zoomTap;
        me.input.fire2 = this.zoomTap;
      }
      if (canFire && (!needScope || me.zoom > 0) && now >= this.nextTapAt && me.speed < 1.2) {
        me.input.fire = true;
        this.nextTapAt = now + this.rng.range(def.botTapInterval[0], def.botTapInterval[1]);
      }
    } else if (def.auto) {
      if (this.burstLeft <= 0 && now >= this.burstPauseUntil && canFire) {
        const mult = dist < 7 ? 3 : dist < 15 ? 1.6 : 1;
        this.burstLeft = Math.round(this.rng.int(def.botBurst[0], def.botBurst[1]) * mult);
      }
      if (this.burstLeft > 0) {
        if (ready && off < tol * 2.2) me.input.fire = true;
        const w = me.weapon;
        if (w.ammo < this.lastAmmo) this.burstLeft -= this.lastAmmo - w.ammo;
        if (this.burstLeft <= 0 || !this.targetVisible) {
          this.burstLeft = 0;
          this.burstPauseUntil = now + this.rng.range(0.2, 0.5) * clamp(dist / 18, 0.5, 1.6);
        }
        standStill = dist > 9;
      }
    } else {
      if (canFire && now >= this.nextTapAt) {
        me.input.fire = true;
        const slow = 1 + clamp(dist / 40, 0, 1.2);
        this.nextTapAt = now + this.rng.range(def.botTapInterval[0], def.botTapInterval[1]) * slow;
      }
    }

    // --- combat movement: strafe between bursts, plant the feet to shoot at range
    if (now >= this.strafeUntil) {
      const r = this.rng.next();
      this.strafeDir = r < 0.4 ? 1 : r < 0.8 ? -1 : 0;
      this.strafeUntil = now + this.rng.range(0.45, 1.1);
      this.crouchFire = dist > 12 && this.rng.chance(0.3);
    }
    if (this.anchored && this.targetVisible) {
      // hold the angle from behind cover
    } else if (!standStill) {
      me.input.moveX = this.strafeDir;
      if (def.kind === 'pistol' && dist > 16 && me.team === 'atk') me.input.moveZ = 0.7;
      if (!this.targetVisible) {
        // lost sight a moment ago: step out towards the last known position
        me.input.moveZ = 0.6;
      }
    } else if (this.crouchFire) {
      me.input.crouch = true;
    }
  }

  // ------------------------------------------------------------------ weapon handling
  private manageWeapon(now: number): void {
    const me = this.actor;
    const prim = me.weapons.primary;
    const sec = me.weapons.secondary;
    let want: Slot = me.bestSlot();
    const primEmpty = !!prim && prim.ammo === 0;
    const primDry = !!prim && prim.ammo === 0 && prim.reserve === 0;
    const secUsable = !!sec && (sec.ammo > 0 || sec.reserve > 0);
    if (primDry) want = secUsable ? 'secondary' : 'melee';
    else if (primEmpty && this.state === 'engage' && this.targetVisible && sec && sec.ammo > 0 && this.target && dist3D(me.pos, this.target.pos) < 16)
      want = 'secondary';
    else if (me.active === 'secondary' && prim && primEmpty && this.state === 'engage' && sec && sec.ammo > 0) want = 'secondary';
    if (want === 'secondary' && !secUsable) want = 'melee';
    if (!prim && !secUsable) want = 'melee';
    if (me.active !== want) {
      me.input.switchTo = want;
      return;
    }
    const w = me.weapon;
    if (w.def.kind === 'melee' || me.reloading) return;
    if (w.ammo === 0 && w.reserve > 0) me.input.reload = true;
    else if (this.state !== 'engage' && w.ammo < w.def.magSize * 0.45 && w.reserve > 0 && now - this.lastSeenTime > 2.5) me.input.reload = true;
  }

  private applyLook(dt: number): void {
    const a = this.actor;
    const maxStep = this.skill.turn * dt;
    const gain = Math.min(1, 13 * dt);
    const dy = angleDiff(this.desiredYaw, a.yaw);
    a.yaw = wrapAngle(a.yaw + clamp(dy * gain, -maxStep, maxStep));
    const dp = this.desiredPitch - a.pitch;
    a.pitch = clamp(a.pitch + clamp(dp * gain, -maxStep, maxStep), -1.4, 1.4);
  }
}
