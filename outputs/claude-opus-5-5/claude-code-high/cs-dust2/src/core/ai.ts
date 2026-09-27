// Bot AI: hierarchical state machine (objective layer + combat layer) on top of the nav grid.
// Bots produce the same ControlInput a human does, so they obey identical movement/weapon rules.

import type { Character } from './character.ts';
import type { Sim } from './sim.ts';
import type { P2 } from './nav.ts';
import { BOMBSITES, CT_HOLDS, POSTPLANT_HOLDS, T_ROUTES } from './mapData.ts';
import { clamp, pitchTo, wrapAngle, yawTo } from './math.ts';
import type { Vec3 } from './math.ts';
import { BOT_FOV_COS } from './constants.ts';
import { ROUND_CFG } from './round.ts';

export type BotState =
  | 'idle'
  | 'route'
  | 'hold'
  | 'engage'
  | 'investigate'
  | 'plant'
  | 'defuse'
  | 'getBomb'
  | 'guard'
  | 'retake'
  | 'rotate'
  | 'hunt';

const approachAngle = (cur: number, target: number, maxStep: number) => {
  const d = wrapAngle(target - cur);
  if (Math.abs(d) <= maxStep) return target;
  return cur + Math.sign(d) * maxStep;
};

export class BotBrain {
  readonly c: Character;
  readonly sim: Sim;
  skill: number;
  state: BotState = 'idle';

  // navigation
  path: P2[] = [];
  pathIdx = 0;
  pathGoal: P2 | null = null;
  repathAt = 0;
  private stuckCheckAt = 0;
  private stuckPos: P2 = [0, 0];
  private stuckCount = 0;
  private detour: P2 | null = null;
  private detourUntil = 0;

  // objective
  route: P2[] = [];
  routeIdx = 0;
  routeId = '';
  holdPos: P2 | null = null;
  holdLook: P2 | null = null;
  holdSite: 'A' | 'B' | 'mid' = 'mid';
  guardPos: P2 | null = null;
  guardLook: P2 | null = null;
  plantSpot: P2 | null = null;
  retakeSpot: P2 | null = null;
  rotatedFor = -1;

  // combat
  target: Character | null = null;
  private acquiredAt = 0;
  private reactionDone = 0;
  private aimErrYaw = 0;
  private aimErrPitch = 0;
  private aimHead = false;
  lastSeenPos: Vec3 | null = null;
  lastSeenTime = -99;
  private burstCount = 0;
  private burstPauseUntil = 0;
  private burstLen = 3;
  private strafeDir = 1;
  private strafeUntil = 0;
  private scopedSince = 0;
  private nextThink = 0;
  private lookAt: Vec3 | null = null;
  private lookUntil = 0;
  private idleLookYaw = 0;
  private idleLookAt = 0;
  private waitUntil = 0;

  constructor(sim: Sim, c: Character, skill: number) {
    this.sim = sim;
    this.c = c;
    this.skill = skill;
  }

  get reactionTime() {
    return 0.7 - 0.5 * this.skill;
  }

  onRoundStart() {
    const c = this.c;
    this.target = null;
    this.lastSeenPos = null;
    this.lastSeenTime = -99;
    this.path = [];
    this.pathGoal = null;
    this.detour = null;
    this.stuckCount = 0;
    this.lookAt = null;
    this.guardPos = null;
    this.plantSpot = null;
    this.retakeSpot = null;
    this.rotatedFor = -1;
    this.state = 'idle';
    this.nextThink = this.sim.time + Math.random() * 0.1;
    this.waitUntil = this.sim.time + ROUND_CFG.freezeTime + Math.random() * 1.5;
    const mates = this.sim.chars.filter((o) => o.team === c.team);
    const idx = mates.indexOf(c);
    if (c.team === 'T') {
      this.assignTRoute(idx);
      // the bomb carrier trails the entry fraggers a little
      if (c.hasBomb()) this.waitUntil += 3.5;
    } else this.assignCTHold(idx);
  }

  private assignTRoute(idx: number) {
    // One plan per round for the whole team (seeded by the round number) + slight variety.
    const sim = this.sim;
    const planSite = sim.round.tPlan;
    const routes = T_ROUTES.filter((r) => r.site === planSite);
    let r = routes[idx % routes.length];
    // bomb carrier and one more use the main route (first entry)
    if (this.c.hasBomb() || idx === 0) r = routes[0];
    this.routeId = r.id;
    this.route = r.points.map((p) => [p[0] + (Math.random() - 0.5) * 2, p[1] + (Math.random() - 0.5) * 2] as P2);
    this.routeIdx = 0;
  }

  private assignCTHold(idx: number) {
    // AWPer takes long or mid, others fill remaining spots
    const order = ['a_long', 'b_site', 'mid', 'a_short', 'b_plat'];
    let id = order[idx % order.length];
    if (this.c.weapons.primary?.def.id === 'awp') id = Math.random() < 0.5 ? 'a_long' : 'mid';
    const hold = CT_HOLDS.find((h) => h.id === id)!;
    this.holdPos = [hold.pos[0] + (Math.random() - 0.5) * 1.5, hold.pos[1] + (Math.random() - 0.5) * 1.5];
    this.holdLook = hold.look;
    this.holdSite = hold.site;
  }

  // ------------------------------------------------------------------ tick
  update(dt: number) {
    const c = this.c;
    const sim = this.sim;
    const t = sim.time;
    const inp = c.input;
    inp.forward = 0;
    inp.right = 0;
    inp.jump = false;
    inp.walk = false;
    inp.use = false;
    const prevFire = inp.fire;
    inp.fire = false;
    inp.alt = false;

    if (sim.round.phase === 'freeze') {
      this.idleLook(dt);
      return;
    }
    if (t >= this.nextThink) {
      this.nextThink = t + 0.1;
      this.perceive();
      this.decide();
    }
    this.act(dt, prevFire);
  }

  // ------------------------------------------------------------------ perception
  private perceive() {
    const c = this.c;
    const sim = this.sim;
    const t = sim.time;
    let best: Character | null = null;
    let bestD = Infinity;
    let currentVisible = false;
    for (const e of sim.chars) {
      if (!e.alive || e.team === c.team) continue;
      const d = Math.hypot(e.pos.x - c.pos.x, e.pos.z - c.pos.z);
      // bots notice enemies right behind them only when very close
      if (!sim.canSee(c, e, d < 4 ? -1 : BOT_FOV_COS)) continue;
      if (e === this.target) currentVisible = true;
      // threat-weighted distance: prefer enemies looking at us
      const w = d * (e.target === c ? 0.8 : 1);
      if (w < bestD) {
        bestD = w;
        best = e;
      }
    }
    if (currentVisible && this.target) best = this.target;
    if (best && best !== this.target) {
      this.target = best;
      this.acquiredAt = t;
      const surprise = this.state === 'engage' ? 0.5 : 1;
      this.reactionDone = t + this.reactionTime * surprise * (0.8 + Math.random() * 0.5);
      const err = (0.14 - 0.11 * this.skill) * (1 + bestD / 40);
      this.aimErrYaw = (Math.random() - 0.5) * 2 * err;
      this.aimErrPitch = (Math.random() - 0.5) * err;
      this.aimHead = Math.random() < 0.12 + 0.5 * this.skill;
      this.burstCount = 0;
    }
    if (this.target) {
      if (best === this.target) {
        this.lastSeenPos = { ...this.target.pos };
        this.lastSeenTime = t;
      } else if (!this.target.alive || t - this.lastSeenTime > 0.35) {
        this.target = null;
      }
    }
    // pain: look toward whoever shot us
    if (!this.target && t - c.lastHurtTime < 0.25) {
      this.lookAt = { ...c.lastHurtFrom };
      this.lookUntil = t + 2;
      if (this.c.team === 'CT' || Math.random() < 0.5) {
        this.lastSeenPos = { x: c.lastHurtFrom.x, y: c.lastHurtFrom.y - 1.6, z: c.lastHurtFrom.z };
        this.lastSeenTime = t;
      }
    }
    // hearing
    if (!this.target) {
      for (const n of sim.noises) {
        if (n.team === c.team || t - n.time > 0.35) continue;
        const d = Math.hypot(n.x - c.pos.x, n.z - c.pos.z);
        if (d > n.radius) continue;
        if (!this.lookAt || t > this.lookUntil - 1) {
          this.lookAt = { x: n.x, y: n.y + 1.4, z: n.z };
          this.lookUntil = t + 1.6;
        }
      }
    }
  }

  // ------------------------------------------------------------------ decisions
  private decide() {
    const c = this.c;
    const sim = this.sim;
    const t = sim.time;
    const bomb = sim.bomb;
    if (this.target) {
      // finish a plant/defuse that is almost done instead of turning around
      if (c.plantProgress > 0.7 || (c.defuseProgress > 0 && bomb.explodeTime - t < bomb.defuseDuration * (1 - c.defuseProgress) + 1.5)) {
        return;
      }
      this.state = 'engage';
      return;
    }
    const recent = this.lastSeenPos && t - this.lastSeenTime < 3.5;
    if (c.team === 'T') {
      if (bomb.state === 'dropped' && this.isClosestTo(bomb.pos, 'T')) {
        this.state = 'getBomb';
        return;
      }
      if (c.hasBomb()) {
        const site = this.route.length ? this.routeSite() : 'A';
        const zone = BOMBSITES[site];
        if (!this.plantSpot) {
          this.plantSpot = sim.nav.randomFreeNear(zone.plant[0], zone.plant[1], 3.5);
        }
        const inSite = sim.siteAt(c.pos) !== null;
        const nearSpot = Math.hypot(c.pos.x - this.plantSpot[0], c.pos.z - this.plantSpot[1]) < 1.6;
        if ((inSite && nearSpot) || (inSite && c.plantProgress >= 0)) {
          this.state = 'plant';
          return;
        }
        if (recent && Math.hypot(this.lastSeenPos!.x - c.pos.x, this.lastSeenPos!.z - c.pos.z) < 12) {
          this.state = 'investigate';
          return;
        }
        this.state = this.routeIdx < this.route.length && !this.lateRound() ? 'route' : 'plant';
        return;
      }
      if (bomb.state === 'planted') {
        if (!this.guardPos) this.pickGuard(bomb.site ?? 'A');
        this.state = recent ? 'investigate' : 'guard';
        return;
      }
      if (recent) {
        this.state = 'investigate';
        return;
      }
      if (this.routeIdx < this.route.length && !this.lateRound()) {
        this.state = 'route';
        return;
      }
      // at the site without the bomb: cover the carrier / wait there
      if (!this.guardPos) this.pickGuard(this.routeSite());
      this.state = 'guard';
      return;
    }
    // --- CT
    if (bomb.state === 'planted') {
      if (this.isClosestTo(bomb.pos, 'CT')) {
        this.state = 'defuse';
      } else {
        if (!this.retakeSpot) this.retakeSpot = sim.nav.randomFreeNear(bomb.pos.x, bomb.pos.z, 7);
        this.state = recent ? 'investigate' : 'retake';
      }
      return;
    }
    if (recent && this.lastSeenPos && Math.hypot(this.lastSeenPos.x - c.pos.x, this.lastSeenPos.z - c.pos.z) < 25) {
      this.state = 'investigate';
      return;
    }
    // rotate toward the site where Ts were spotted
    const intel = sim.intel.CT;
    if (intel.site && t - intel.time < 20 && this.holdSite !== intel.site && this.rotatedFor !== Math.floor(intel.time)) {
      this.rotatedFor = Math.floor(intel.time);
      if (Math.random() < 0.55) {
        const holds = CT_HOLDS.filter((h) => h.site === intel.site);
        const h = holds[Math.floor(Math.random() * holds.length)];
        this.holdPos = sim.nav.randomFreeNear(h.pos[0], h.pos[1], 3);
        this.holdLook = h.look;
        this.holdSite = intel.site;
      }
    }
    // when the Ts are almost all dead and time is running, go hunt
    const aliveT = sim.aliveCount('T');
    if (aliveT <= 1 && sim.round.timeLeft() < 60 && sim.aliveCount('CT') >= 2) {
      this.state = 'hunt';
      return;
    }
    this.state = 'hold';
  }

  private routeSite(): 'A' | 'B' {
    return T_ROUTES.find((r) => r.id === this.routeId)?.site ?? 'A';
  }

  private lateRound(): boolean {
    return this.sim.round.timeLeft() < 40;
  }

  private pickGuard(site: 'A' | 'B') {
    const list = POSTPLANT_HOLDS[site];
    const idx = this.sim.chars.filter((o) => o.team === this.c.team).indexOf(this.c);
    const g = list[idx % list.length];
    this.guardPos = this.sim.nav.randomFreeNear(g.pos[0], g.pos[1], 1.5);
    this.guardLook = g.look;
  }

  /** Is this bot the closest living bot of its team to a point (for bomb pickup / defuse duty)? */
  private isClosestTo(p: Vec3, team: 'T' | 'CT'): boolean {
    let best: Character | null = null;
    let bd = Infinity;
    for (const o of this.sim.chars) {
      if (!o.alive || o.team !== team || !o.isBot) continue;
      const d = Math.hypot(o.pos.x - p.x, o.pos.z - p.z);
      if (d < bd) {
        bd = d;
        best = o;
      }
    }
    return best === this.c;
  }

  // ------------------------------------------------------------------ actions
  private act(dt: number, prevFire: boolean) {
    const c = this.c;
    const sim = this.sim;
    const t = sim.time;
    const bomb = sim.bomb;
    this.manageWeapon();

    switch (this.state) {
      case 'engage':
        this.engage(dt, prevFire);
        return;
      case 'investigate': {
        const p = this.lastSeenPos;
        if (!p) break;
        const arrived = this.moveTo([p.x, p.z], 1.5);
        this.lookToward(this.lookAt && t < this.lookUntil ? this.lookAt : { x: p.x, y: p.y + 1.5, z: p.z }, dt, 5);
        if (arrived || t - this.lastSeenTime > 3.5) this.lastSeenPos = null;
        return;
      }
      case 'route': {
        if (t < this.waitUntil) {
          this.idleLook(dt);
          return;
        }
        const wp = this.route[this.routeIdx];
        if (!wp) {
          this.decide();
          return;
        }
        const last = this.routeIdx === this.route.length - 1;
        const arrived = this.moveTo(wp, last ? 1.2 : 2.5);
        if (arrived) this.routeIdx++;
        this.lookAlongPath(dt);
        return;
      }
      case 'plant': {
        const site = sim.siteAt(c.pos);
        if (!site || (this.plantSpot && Math.hypot(c.pos.x - this.plantSpot[0], c.pos.z - this.plantSpot[1]) > 1.6 && c.plantProgress < 0)) {
          const goal: P2 = this.plantSpot ?? BOMBSITES[this.routeSite()].plant;
          this.moveTo(goal, 0.8);
          this.lookAlongPath(dt);
          return;
        }
        c.input.use = true;
        c.pitch = approachAngle(c.pitch, -0.6, dt * 2);
        return;
      }
      case 'getBomb': {
        this.moveTo([bomb.pos.x, bomb.pos.z], 0.3);
        this.lookAlongPath(dt);
        return;
      }
      case 'guard': {
        if (!this.guardPos) return;
        const arrived = this.moveTo(this.guardPos, 1.0);
        if (arrived) this.holdAndWatch(this.guardLook, dt);
        else this.lookAlongPath(dt);
        return;
      }
      case 'defuse': {
        const d = Math.hypot(c.pos.x - bomb.pos.x, c.pos.z - bomb.pos.z);
        if (d > 1.0 && c.defuseProgress < 0) {
          this.moveTo([bomb.pos.x, bomb.pos.z], 0.6);
          this.lookAlongPath(dt);
        } else {
          c.input.use = true;
          c.pitch = approachAngle(c.pitch, -0.7, dt * 2);
        }
        return;
      }
      case 'retake': {
        const spot = this.retakeSpot ?? [bomb.pos.x, bomb.pos.z];
        const arrived = this.moveTo(spot, 1.2);
        if (arrived) this.holdAndWatch([bomb.pos.x + (Math.random() - 0.5), bomb.pos.z], dt);
        else this.lookAlongPath(dt);
        return;
      }
      case 'hold': {
        if (!this.holdPos) return;
        const arrived = this.moveTo(this.holdPos, 0.8);
        if (arrived) this.holdAndWatch(this.holdLook, dt);
        else this.lookAlongPath(dt);
        return;
      }
      case 'hunt': {
        // go to the last known T position, or sweep bomb sites
        let goal: P2 = BOMBSITES.A.plant;
        let bestT = -99;
        for (const e of sim.chars) {
          if (!e.alive || e.team === c.team) continue;
          if (sim.spotted[c.team][e.id] > bestT) {
            bestT = sim.spotted[c.team][e.id];
            goal = [e.pos.x, e.pos.z];
          }
        }
        this.moveTo(goal, 3);
        this.lookAlongPath(dt);
        return;
      }
      default:
        this.idleLook(dt);
    }
  }

  private manageWeapon() {
    const c = this.c;
    const w = c.weapon;
    if (c.plantProgress >= 0 || c.defuseProgress >= 0) return;
    // prefer a gun with bullets
    const p = c.weapons.primary;
    const s = c.weapons.secondary;
    if (c.active === 'bomb' || c.active === 'melee') {
      const best = c.bestSlot();
      if (best !== c.active && !(this.state === 'engage' && this.target && c.active === 'melee' && !p && !s)) c.input.slot = best;
    }
    if (c.active === 'primary' && p && p.mag === 0 && p.reserve === 0 && s) c.input.slot = 'secondary';
    if (c.active === 'secondary' && s && s.mag === 0 && s.reserve === 0) c.input.slot = p && (p.mag > 0 || p.reserve > 0) ? 'primary' : 'melee';
    // tactical reload when nothing is going on
    if (!this.target && w && w.def.magSize > 0 && w.mag < w.def.magSize * 0.4 && w.reserve > 0 && !c.reloading) {
      if (this.sim.time - this.lastSeenTime > 2) c.input.reload = true;
    }
    // unscope when not fighting
    if (!this.target && c.scope > 0 && this.sim.time - this.lastSeenTime > 3 && this.state !== 'hold' && !c.prevAlt) {
      c.input.alt = true;
    }
  }

  private engage(dt: number, prevFire: boolean) {
    const c = this.c;
    const e = this.target;
    const sim = this.sim;
    const t = sim.time;
    if (!e) return;
    const def = c.def;
    const eye = sim.eye(c);
    const dist = Math.hypot(e.pos.x - c.pos.x, e.pos.z - c.pos.z);
    const aimY = this.aimHead ? 1.63 : 1.28;
    // lead slightly toward the target's velocity
    const lead = 0.06;
    const ap = { x: e.pos.x + e.body.vel.x * lead, y: e.pos.y + aimY, z: e.pos.z + e.body.vel.z * lead };
    const dYaw = yawTo(eye.x, eye.z, ap.x, ap.z);
    const dPitch = pitchTo(eye, ap);
    const since = t - this.acquiredAt;
    const errScale = Math.exp(-since * (1.8 + 4 * this.skill));
    const comp = 0.35 + 0.55 * this.skill;
    const yT = dYaw + this.aimErrYaw * errScale - c.punchYaw * comp;
    const pT = dPitch + this.aimErrPitch * errScale - c.punchPitch * comp;
    const turn = (3.5 + 9 * this.skill) * dt;
    const yd = wrapAngle(yT - c.yaw);
    const pd = pT - c.pitch;
    c.yaw = approachAngle(c.yaw, yT, Math.max(turn, Math.abs(yd) * Math.min(1, dt * 14)));
    c.pitch = clamp(c.pitch + clamp(pd, -turn, turn), -1.4, 1.4);

    const aimErr = Math.hypot(wrapAngle(c.yaw + c.punchYaw - dYaw), c.pitch + c.punchPitch - dPitch);
    const tol = Math.atan2(0.3, Math.max(dist, 1)) * (1.5 - this.skill * 0.5) + 0.006;
    const ready = t >= this.reactionDone;

    // --- movement: knife rush, otherwise counter-strafe peeks
    if (!def || def.slot === 'melee') {
      this.moveTo([e.pos.x, e.pos.z], 0.8);
      if (dist < 2.2 && ready) c.input.fire = true;
      return;
    }
    let firing = false;
    const speed = Math.hypot(c.body.vel.x, c.body.vel.z);
    // counter-strafe: only pull the trigger once (almost) stopped
    const steady = speed < def.speed * (def.slot === 'secondary' ? 0.55 : 0.34);
    const onTarget = ready && aimErr < tol && c.weapon && c.weapon.mag > 0 && !c.reloading;
    if (onTarget && !steady) {
      firing = true; // stop strafing this tick so we decelerate
    } else if (onTarget) {
      if (def.scope) {
        if (c.scope === 0 && c.rescopeAt === 0 && t >= c.nextAttack && dist > 4) {
          if (!c.prevAlt) c.input.alt = true;
          this.scopedSince = t;
          firing = true;
        } else if ((c.scope > 0 && t - this.scopedSince > 0.3 - this.skill * 0.12) || dist <= 4) {
          c.input.fire = !prevFire && t >= c.nextAttack;
          firing = true;
        } else firing = true;
      } else if (def.automatic) {
        const spray = dist < 10;
        if (t >= this.burstPauseUntil) {
          c.input.fire = true;
          firing = true;
          if (c.lastShotTime >= t - dt * 1.01 && prevFire) this.burstCount++;
          const len = spray ? 12 : this.burstLen;
          if (this.burstCount >= len) {
            this.burstCount = 0;
            this.burstLen = 2 + Math.floor(Math.random() * 3) + (dist < 18 ? 2 : 0);
            this.burstPauseUntil = t + 0.18 + Math.random() * 0.25 + dist / 120;
          }
        }
      } else {
        // semi-auto: tap with a rhythm that lets spread recover a bit
        const rhythm = Math.max(def.fireInterval, 0.12 + dist / 150 - this.skill * 0.08);
        if (!prevFire && t - c.lastShotTime >= rhythm) {
          c.input.fire = true;
          firing = true;
        }
      }
    }

    // strafe between bursts (skilled bots), stand still while shooting
    const wantsStrafe = !firing && !def.scope && this.skill > (def.slot === 'secondary' ? 0.3 : 0.45);
    if (wantsStrafe) {
      if (t > this.strafeUntil) {
        this.strafeDir = Math.random() < 0.5 ? -1 : 1;
        this.strafeUntil = t + 0.35 + Math.random() * 0.5;
      }
      c.input.right = this.strafeDir;
      // do not strafe into walls
      const sy = Math.sin(c.yaw);
      const cy = Math.cos(c.yaw);
      const nx = c.pos.x + cy * this.strafeDir * 0.8;
      const nz = c.pos.z - sy * this.strafeDir * 0.8;
      if (!sim.nav.isFreeAt(nx, nz)) {
        this.strafeDir *= -1;
        c.input.right = this.strafeDir;
      }
    }
    // pistol vs far rifle: close the distance a bit
    if (def.slot === 'secondary' && dist > 25 && !firing) c.input.forward = 1;
  }

  // ------------------------------------------------------------------ helpers
  private holdAndWatch(look: P2 | null, dt: number) {
    const t = this.sim.time;
    if (this.lookAt && t < this.lookUntil) {
      this.lookToward(this.lookAt, dt, 5);
      return;
    }
    if (!look) return;
    if (t > this.idleLookAt) {
      this.idleLookAt = t + 1.5 + Math.random() * 2.5;
      this.idleLookYaw = (Math.random() - 0.5) * 0.5;
    }
    const c = this.c;
    const y = yawTo(c.pos.x, c.pos.z, look[0], look[1]) + this.idleLookYaw;
    c.yaw = approachAngle(c.yaw, y, dt * 3);
    c.pitch = approachAngle(c.pitch, 0, dt * 2);
  }

  private idleLook(dt: number) {
    const c = this.c;
    const t = this.sim.time;
    if (t > this.idleLookAt) {
      this.idleLookAt = t + 1 + Math.random() * 2;
      this.idleLookYaw = c.yaw + (Math.random() - 0.5) * 1.2;
    }
    c.yaw = approachAngle(c.yaw, this.idleLookYaw, dt * 2);
    c.pitch = approachAngle(c.pitch, 0, dt);
  }

  private lookToward(p: Vec3, dt: number, rate: number) {
    const c = this.c;
    const eye = this.sim.eye(c);
    c.yaw = approachAngle(c.yaw, yawTo(eye.x, eye.z, p.x, p.z), dt * rate);
    c.pitch = approachAngle(c.pitch, clamp(pitchTo(eye, p), -0.6, 0.6), dt * rate * 0.6);
  }

  private lookAlongPath(dt: number) {
    const c = this.c;
    const t = this.sim.time;
    if (this.lookAt && t < this.lookUntil) {
      this.lookToward(this.lookAt, dt, 6);
      return;
    }
    const wp = this.detour ?? this.path[this.pathIdx];
    if (!wp) return;
    const d = Math.hypot(wp[0] - c.pos.x, wp[1] - c.pos.z);
    if (d < 0.3) return;
    c.yaw = approachAngle(c.yaw, yawTo(c.pos.x, c.pos.z, wp[0], wp[1]), dt * 5);
    c.pitch = approachAngle(c.pitch, 0, dt * 2);
  }

  /** Follow a nav path toward goal. Returns true when within `tol` of the goal. */
  moveTo(goal: P2, tol: number): boolean {
    const c = this.c;
    const sim = this.sim;
    const t = sim.time;
    const dGoal = Math.hypot(goal[0] - c.pos.x, goal[1] - c.pos.z);
    if (dGoal <= tol) {
      this.path = [];
      this.pathGoal = null;
      return true;
    }
    const goalMoved = !this.pathGoal || Math.hypot(goal[0] - this.pathGoal[0], goal[1] - this.pathGoal[1]) > 1.5;
    if ((goalMoved || t >= this.repathAt || this.path.length === 0) && sim.pathBudget > 0) {
      sim.pathBudget--;
      const p = sim.nav.findPath(c.pos.x, c.pos.z, goal[0], goal[1]);
      this.pathGoal = [goal[0], goal[1]];
      this.repathAt = t + 4 + Math.random() * 2;
      if (p && p.length) {
        this.path = p;
        this.pathIdx = p.length > 1 ? 1 : 0;
      } else {
        this.path = [[goal[0], goal[1]]];
        this.pathIdx = 0;
      }
    }
    let wp: P2 | undefined;
    if (this.detour && t < this.detourUntil) wp = this.detour;
    else {
      this.detour = null;
      while (this.pathIdx < this.path.length) {
        const p = this.path[this.pathIdx];
        const last = this.pathIdx === this.path.length - 1;
        if (Math.hypot(p[0] - c.pos.x, p[1] - c.pos.z) < (last ? 0.25 : 0.55)) this.pathIdx++;
        else break;
      }
      wp = this.path[this.pathIdx];
    }
    if (!wp) return dGoal <= tol * 2;
    let dx = wp[0] - c.pos.x;
    let dz = wp[1] - c.pos.z;
    const dl = Math.hypot(dx, dz) || 1;
    dx /= dl;
    dz /= dl;
    // separation from teammates
    for (const o of sim.chars) {
      if (o === c || !o.alive) continue;
      const ox = c.pos.x - o.pos.x;
      const oz = c.pos.z - o.pos.z;
      const od = Math.hypot(ox, oz);
      if (od < 1.3 && od > 1e-3) {
        dx += (ox / od) * (1.3 - od) * 0.8;
        dz += (oz / od) * (1.3 - od) * 0.8;
      }
    }
    const l2 = Math.hypot(dx, dz) || 1;
    dx /= l2;
    dz /= l2;
    const sy = Math.sin(c.yaw);
    const cy = Math.cos(c.yaw);
    // world dir -> local input (forward = (-sin, -cos), right = (cos, -sin))
    c.input.forward = dx * -sy + dz * -cy;
    c.input.right = dx * cy + dz * -sy;
    // slow down to walk near the final point of a precise goal
    if (dGoal < 1.2 && tol < 1) c.input.walk = true;

    // stuck detection
    if (t >= this.stuckCheckAt) {
      const moved = Math.hypot(c.pos.x - this.stuckPos[0], c.pos.z - this.stuckPos[1]);
      if (moved < 0.3) this.stuckCount++;
      else this.stuckCount = 0;
      this.stuckPos = [c.pos.x, c.pos.z];
      this.stuckCheckAt = t + 0.5;
      if (this.stuckCount === 2) {
        this.repathAt = 0;
        c.input.jump = true;
      } else if (this.stuckCount >= 4) {
        this.detour = sim.nav.randomFreeNear(c.pos.x, c.pos.z, 3);
        this.detourUntil = t + 1.2;
        this.stuckCount = 0;
        this.repathAt = t + 1.2;
      }
    }
    return false;
  }
}

