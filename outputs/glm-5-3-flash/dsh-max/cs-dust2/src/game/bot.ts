/**
 * bot.ts — bot AI. A compact state machine driving a Character:
 *
 *   perception ──► ENGAGE (visible enemy: aim / strafe / burst fire)
 *        │
 *        └─► OBJECTIVE
 *              T : take assigned route ─► plant C4 ─► hold site
 *              CT: hold assigned spot ─► rotate ─► defuse C4
 *
 * Path-finding is A* over the world grid (world.findPath) with string-pull
 * smoothing, so bots never walk through walls.
 */

import { World, Vec2 } from './world';
import { POINTS } from './mapdata';
import { Character } from './character';
import { clamp, approachAngle, randRange, angleDiff } from './util';
import { WEAPONS } from './weapons';
import type { Game } from './engine';

type BotState = 'objective' | 'engage' | 'plant' | 'defuse' | 'hold';

const T_ROUTES_A = [['long_doors', 'long_hall', 'a_cross'], ['top_mid', 'catwalk', 'short']];
const T_ROUTES_B = [['upper_tunnels', 'b_tunnels', 'b_tunnel_mouth']];
const SITE_SPOTS = {
  A: ['a_hold_1', 'a_hold_2', 'a_hold_3', 'a_plant_2'],
  B: ['b_hold_1', 'b_hold_2', 'b_hold_3', 'b_plant_2'],
};

export class BotBrain {
  char: Character;
  game: Game;
  world: World;

  state: BotState = 'objective';
  skill: number;
  /** true while the player has taken over this bot */
  paused = false;

  // navigation
  routeIdx = 0;
  goal: Vec2 | null = null;
  goalKey = '';
  path: Vec2[] = [];
  pathIdx = 0;
  pathAge = 0;
  repathCd = 0;
  stuckTime = 0;
  lastDistToGoal = 999;

  // combat
  target: Character | null = null;
  targetSeenAt = -99;
  firstSeenAt = -99;
  aimErrX = 0; aimErrY = 0;
  strafe = 0; strafeFlipAt = 0;
  burstUntil = 0; burstPauseUntil = 0;
  nextPerception = 0;
  holdSpot: Vec2 | null = null;
  nextReposition = 0;
  lastKnownEnemy: Vec2 | null = null;

  constructor(char: Character, game: Game) {
    this.char = char;
    this.game = game;
    this.world = game.world;
    this.skill = clamp(randRange(0.5, 0.9), 0, 1);
  }

  /* ------------------------------------------------------------ */

  /** next route waypoint with monotonic progress (never sends the bot backwards) */
  private nextRoutePoint(): Vec2 | null {
    const route = this.game.routes.get(this.char);
    if (!route || !route.length) return null;
    const c = this.char;
    let guard = 0;
    while (this.routeIdx < route.length && guard++ < 8) {
      const p = POINTS[route[this.routeIdx]];
      if (Math.hypot(c.x - p.x, c.z - p.z) < 9) this.routeIdx++;
      else break;
    }
    if (this.routeIdx >= route.length) return null;
    const p = POINTS[route[this.routeIdx]];
    return { x: p.x, z: p.z };
  }

  private p(name: string): Vec2 {
    const pt = POINTS[name];
    return { x: pt.x, z: pt.z };
  }

  reset() {
    this.routeIdx = 0;
    this.state = 'objective';
    this.target = null;
    this.path = []; this.pathIdx = 0; this.goal = null; this.goalKey = '';
    this.pathAge = 99; this.holdSpot = null;
    this.lastKnownEnemy = null;
    this.burstUntil = 0; this.burstPauseUntil = 0;
  }

  /* ------------------------------------------------------------ */

  update(dt: number, now: number) {
    const c = this.char;
    const g = this.game;
    if (!c.alive || g.phase === 'freeze' || g.phase === 'over') {
      c.moveFwd = 0; c.moveSide = 0; c.firing = false; c.busyAction = 'none';
      return;
    }

    if (now >= this.nextPerception) {
      this.perceive(now);
      this.nextPerception = now + randRange(0.1, 0.18);
    }

    // housekeeping: never walk around with an empty gun
    const st = c.current();
    if (WEAPONS[st.id].fireMode !== 'melee') {
      if (st.mag <= 0) c.startReload(now);
      else if (!this.target && st.mag < WEAPONS[st.id].magSize * 0.45 && now - c.lastShotAt > 1.2) c.startReload(now);
    }

    if (this.target && (!this.target.alive || now - this.targetSeenAt > 1.6)) {
      this.lastKnownEnemy = { x: this.target.x, z: this.target.z };
      this.target = null;
    }
    if (this.target) this.engage(dt, now);
    else this.objective(dt, now);
  }

  /* ---------------- perception ---------------- */

  private perceive(now: number) {
    const c = this.char;
    const g = this.game;
    let best: Character | null = null;
    let bestScore = Infinity;
    const enemies = g.characters;
    const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);

    for (const e of enemies) {
      if (!e.alive || e.team === c.team) continue;
      const dx = e.x - c.x, dz = e.z - c.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 58) continue;
      // the bomb carrier only engages close threats so the round keeps moving
      if (c.hasC4 && dist > 28) continue;
      // field of view (~110°) — but notice anything inside 5m ("hearing")
      const dot = (dx * fx + dz * fz) / Math.max(0.001, dist);
      const inFov = dot > 0.34;
      if (!inFov && dist > 5) {
        // recently fired weapons are heard through walls -> face that way
        const heard = now - e.lastShotAt < 0.7 && dist < 34;
        if (heard && dist < (this.lastKnownEnemy ? 999 : 40)) this.lastKnownEnemy = { x: e.x, z: e.z };
        continue;
      }
      if (!g.canSee(c, e)) continue;
      const score = dist - (e.hasC4 ? 4 : 0);
      if (score < bestScore) {
        bestScore = score;
        best = e;
      }
      g.markSpotted(e);
    }

    if (best) {
      if (this.target !== best) {
        this.firstSeenAt = now;
        this.aimErrX = randRange(-1, 1) * (1 - this.skill) * 0.055;
        this.aimErrY = randRange(-1, 1) * (1 - this.skill) * 0.035;
      }
      this.target = best;
      this.targetSeenAt = now;
      this.lastKnownEnemy = { x: best.x, z: best.z };
      c.busyAction = 'none';
    }
  }

  /* ---------------- combat ---------------- */

  private engage(dt: number, now: number) {
    const c = this.char;
    const t = this.target!;
    const dx = t.x - c.x, dz = t.z - c.z;
    const dist = Math.hypot(dx, dz);
    const def = c.weaponDef;
    // engagement range by weapon class (bots hold fire beyond it)
    const fireRange = def.fireMode === 'melee' ? def.melee!.range
      : def.id === 'awp' ? 85
        : def.slot === 'secondary' ? 36 : 46;

    // ---- aim ----
    const track = clamp((now - this.firstSeenAt) / 0.5, 0, 1);
    this.aimErrX *= 1 - Math.min(1, dt * (2 + 6 * this.skill * track));
    this.aimErrY *= 1 - Math.min(1, dt * (2 + 6 * this.skill * track));
    const aimY = t.y + (this.skill > 0.75 && dist > 8 ? 1.72 * (1 - t.crouchAmt * 0.26) : 1.3 * (1 - t.crouchAmt * 0.26));
    const wantYaw = Math.atan2(dx, dz) + this.aimErrX;
    const horiz = Math.max(0.5, dist);
    const wantPitch = Math.atan2(aimY - c.eyeY(), horiz) + this.aimErrY;
    const turn = (7 + 9 * this.skill) * dt;
    c.yaw = approachAngle(c.yaw, wantYaw, turn);
    c.pitch += clamp(wantPitch - c.pitch, -turn, turn);
    c.pitch = clamp(c.pitch, -1.3, 1.3);

    // ---- movement ----
    if (now > this.strafeFlipAt) {
      this.strafeFlipAt = now + randRange(0.5, 1.4);
      this.strafe = Math.random() < 0.34 ? 0 : (Math.random() < 0.5 ? -1 : 1);
    }
    const idealMin = def.fireMode === 'melee' ? 0.6 : 6;
    const idealMax = def.fireMode === 'melee' ? 1.2 : fireRange * 0.72;
    let fwd = 0;
    if (dist > idealMax) fwd = 0.9;       // push into effective range
    else if (dist < idealMin) fwd = -0.7;
    c.moveFwd = fwd;
    c.moveSide = this.strafe * 0.8;
    c.crouch = this.skill > 0.6 && dist > 16 && Math.random() < 0.02 ? true : (dist > 16 && c.crouch);
    c.walk = false;

    // ---- trigger discipline ----
    const aimAligned = Math.abs(angleDiff(wantYaw, c.yaw)) < 0.05 + 0.02 * (1 - this.skill);
    const reactionOver = now - this.firstSeenAt > randRange(0.16, 0.2) + (1 - this.skill) * 0.32;
    const los = this.game.canSee(c, t);
    let wantFire = false;

    if (def.fireMode === 'melee') {
      wantFire = dist < def.melee!.range && los;
    } else if (los && aimAligned && reactionOver && dist < fireRange) {
      if (def.fireMode === 'auto') {
        if (now > this.burstPauseUntil && now > this.burstUntil) {
          this.burstUntil = now + randRange(0.12, 0.3) + this.skill * 0.35;
          this.burstPauseUntil = this.burstUntil + randRange(0.12, 0.4);
        }
        wantFire = now < this.burstUntil;
      } else {
        const cycle = 60 / def.rpm + 0.12 + (1 - this.skill) * 0.25;
        wantFire = now - c.lastShotAt > cycle;
      }
    }

    if (c.current().mag <= 0) {
      c.startReload(now);
      wantFire = false;
      // switch to the pistol when the primary is completely dry
      if (c.slot === 'primary' && c.primary && c.primary.reserve <= 0 && c.secondary && c.secondary.mag > 0) {
        c.switchSlot('secondary', now);
      }
    }
    // standing still dramatically improves accuracy at range
    if (wantFire && dist > 15) { c.moveFwd = 0; c.moveSide = 0; }

    // stalemate breaker: if this fight has produced no shots for a while,
    // close the distance instead of staring around a corner
    const noFireFor = now - Math.max(this.firstSeenAt, c.lastShotAt);
    if (noFireFor > 2.5 && dist > 7) { c.moveFwd = 0.9; c.moveSide = 0; }
    // the carrier always keeps pushing towards the site
    if (c.hasC4 && dist > 10) c.moveFwd = Math.max(c.moveFwd, 0.55);

    const semi = def.fireMode === 'semi' || def.fireMode === 'bolt';
    const ready = !semi || now - c.lastShotAt > 60 / def.rpm + 0.04;
    c.firing = wantFire && ready;
  }

  /* ---------------- objectives ---------------- */

  private objective(dt: number, now: number) {
    const c = this.char;
    const g = this.game;
    c.firing = false;
    c.crouch = false;
    c.walk = false;

    // slow aiming recovery toward last known enemy while moving
    if (this.lastKnownEnemy && now - this.targetSeenAt < 4) {
      const dx = this.lastKnownEnemy.x - c.x, dz = this.lastKnownEnemy.z - c.z;
      const want = Math.atan2(dx, dz);
      if (Math.abs(angleDiff(want, c.yaw)) > 0.1) c.yaw = approachAngle(c.yaw, want, 4 * dt);
    }

    // ---- action states ----
    if (c.busyAction === 'plant') {
      c.moveFwd = 0; c.moveSide = 0;
      this.state = 'plant';
      return;
    }
    if (c.busyAction === 'defuse') {
      c.moveFwd = 0; c.moveSide = 0;
      this.state = 'defuse';
      return;
    }

    const bomb = g.bomb;

    if (c.team === 'T') {
      // pick up the dropped bomb if it is loose and we are closest
      if (bomb.state === 'dropped') {
        const nearest = g.nearestTToBomb();
        if (nearest === c) { this.setGoal({ x: bomb.x, z: bomb.z }, 'bomb_loose'); }
      } else if (bomb.state === 'planted') {
        if (now > this.nextReposition || !this.goal) {
          this.nextReposition = now + randRange(9, 16);
          const spots = bomb.site === 'A' ? SITE_SPOTS.A : SITE_SPOTS.B;
          this.setGoal(this.p(spots[Math.floor(Math.random() * spots.length)]), 'site_hold');
        }
      } else if (c.hasC4) {
        const site = g.tacticSite;
        const plantSpot = site === 'A' ? this.p('a_plant') : this.p('b_plant');
        if (g.inSiteOf(c) === site) {
          const d = Math.hypot(c.x - plantSpot.x, c.z - plantSpot.z);
          if (d < 3.4 && !this.target && this.world.fits(c.x, c.z, c.y, 0.45)) {
            c.busyAction = 'plant';
            this.state = 'plant';
            c.moveFwd = 0; c.moveSide = 0;
            return;
          }
          this.setGoal(plantSpot, 'plant_' + site);
        } else {
          // walk with the team route instead of cutting through enemy ground
          const wp = this.nextRoutePoint();
          if (wp) this.setGoal(wp, 'route');
          else this.setGoal(plantSpot, 'plant_' + site);
        }
      } else {
        if (now > this.nextReposition || !this.goal || this.goalKey.startsWith('route')) {
          // follow the team tactic route toward the target site
          const wp = this.nextRoutePoint();
          if (wp) this.setGoal(wp, 'route');
          else {
            const spot = g.tacticSite === 'A' ? 'a_plant_2' : 'b_plant_2';
            this.setGoal(this.p(spot), 'push_' + g.tacticSite);
          }
        }
      }
    } else {
      // CT
      if (bomb.state === 'planted') {
        const d = Math.hypot(c.x - bomb.x, c.z - bomb.z);
        if (d < 1.8 && this.world.fits(c.x, c.z, c.y, 0.4)) {
          c.busyAction = 'defuse';
          this.state = 'defuse';
          c.moveFwd = 0; c.moveSide = 0;
          c.crouch = true;
          return;
        }
        this.setGoal({ x: bomb.x, z: bomb.z }, 'retake');
      } else {
        if (now > this.nextReposition || !this.goal) {
          this.nextReposition = now + randRange(10, 20);
          const spot = this.holdSpotName ?? g.assignDefenceSpot(c);
          this.holdSpotName = spot;
          const pt = this.p(spot);
          const jitter = g.world.randomOpenPoint(pt.x, pt.z, 3);
          this.setGoal(jitter ?? pt, 'defend');
          this.state = 'hold';
        }
      }
    }

    this.followPath(dt, now);
  }

  holdSpotName: string | null = null;

  /* ---------------- path following ---------------- */

  private setGoal(g: Vec2, key: string) {
    if (this.goalKey === key && this.goal && Math.hypot(this.goal.x - g.x, this.goal.z - g.z) < 1.5) return;
    this.goal = g;
    this.goalKey = key;
    this.pathAge = 99;
  }

  private followPath(dt: number, now: number) {
    const c = this.char;
    if (!this.goal) { c.moveFwd = 0; c.moveSide = 0; return; }
    this.pathAge += dt;

    if (this.pathAge > 2.5 || this.pathIdx >= this.path.length) {
      if (now > this.repathCd) {
        const p = this.world.findPath({ x: c.x, z: c.z }, this.goal);
        this.repathCd = now + 0.5;
        if (p && p.length) { this.path = p; this.pathIdx = 0; this.pathAge = 0; }
        else { this.pathAge = 1.5; }
      }
    }
    if (!this.path.length) { c.moveFwd = 0; c.moveSide = 0; return; }

    let wp = this.path[this.pathIdx];
    let d = Math.hypot(wp.x - c.x, wp.z - c.z);
    while (d < 1.1 && this.pathIdx < this.path.length - 1) {
      this.pathIdx++;
      wp = this.path[this.pathIdx];
      d = Math.hypot(wp.x - c.x, wp.z - c.z);
    }

    const dx = wp.x - c.x, dz = wp.z - c.z;
    const want = Math.atan2(dx, dz);
    // look where we walk, unless we recently saw an enemy
    if (!(this.lastKnownEnemy && now - this.targetSeenAt < 2.5)) {
      c.yaw = approachAngle(c.yaw, want, 9 * dt);
      c.pitch += clamp(0 - c.pitch, -2 * dt, 2 * dt);
    }
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    const fwdAmt = clamp((dx * sy + dz * cy) / Math.max(0.5, d), -1, 1);
    const sideAmt = clamp((dx * cy - dz * sy) / Math.max(0.5, d), -1, 1);
    c.moveFwd = Math.abs(angleDiff(want, c.yaw)) < 1.5 ? fwdAmt : 0.25;
    c.moveSide = sideAmt * 0.6;
    c.walk = false;

    // stuck detection
    const moved = this.lastDistToGoal - d;
    this.lastDistToGoal = d;
    // "moved" is the per-frame decrease of the distance to the goal
    if (Math.abs(moved) < dt * 0.6) this.stuckTime += dt; else this.stuckTime = Math.max(0, this.stuckTime - dt * 2);
    if (this.stuckTime > 0.8) {
      c.wantJump = true;
      if (this.stuckTime > 1.6) {
        this.stuckTime = 0;
        this.pathAge = 99;
        const alt = this.world.randomOpenPoint(c.x, c.z, 4);
        if (alt) { this.goal = alt; this.goalKey = 'unstuck'; this.pathAge = 99; }
      }
    }

    // reached?
    const gd = Math.hypot(this.goal.x - c.x, this.goal.z - c.z);
    if (gd < 1.4) {
      c.moveFwd = 0; c.moveSide = 0;
      if (this.goalKey === 'defend' || this.goalKey === 'site_hold') this.state = 'hold';
    }
  }
}
