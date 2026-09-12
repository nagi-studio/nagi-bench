import * as THREE from 'three';
import { Actor } from '../entities/actor';
import { GameMap } from '../map/dust2';
import { Navigation } from './navigation';
import { RoundState, V } from '../types';

export interface AICtx {
  actors: Actor[];
  map: GameMap;
  nav: Navigation;
  round: RoundState;
  bombPos: THREE.Vector3 | null;
  bombSite: 'A' | 'B' | null;
  time: number;
  dt: number;
  tryFire: (bot: Actor) => void;
  move: (actor: Actor, wish: THREE.Vector3, run: boolean, dt: number) => void;
}

const VIEW_DIST = 68;
const FOV_COS = Math.cos((100 * Math.PI) / 180 / 2); // ~100deg fov

export class AIController {
  update(bot: Actor, ctx: AICtx) {
    if (!bot.alive) return;
    const dt = ctx.dt;
    bot.wantPlant = false;
    bot.wantDefuse = false;

    // ---- perception ----
    const target = this.findTarget(bot, ctx);
    if (target) {
      bot.target = target;
      bot.lastSeenTarget.copy(target.pos);
      if (bot.mode !== 'engage') {
        bot.mode = 'engage';
        bot.reactionTimer = 0.14 + Math.random() * 0.22;
      }
    } else if (bot.target && !bot.target.alive) {
      bot.target = null;
      bot.mode = 'patrol';
    } else if (bot.mode === 'engage' && (!bot.target || !this.canSee(bot, bot.target, ctx))) {
      // lost sight -> hunt last position briefly
      bot.mode = 'hunt';
      bot.path = [];
    }

    switch (bot.mode) {
      case 'engage':
        this.combat(bot, ctx);
        break;
      case 'hunt':
        this.hunt(bot, ctx);
        break;
      default:
        this.objective(bot, ctx);
    }

    // stuck detection
    const moved = bot.pos.distanceTo(bot.lastPos);
    if (moved < 0.02) bot.stuckTimer += dt;
    else bot.stuckTimer = 0;
    bot.lastPos.copy(bot.pos);
    if (bot.stuckTimer > 0.6) {
      bot.path = [];
      bot.repathTimer = 0;
      bot.stuckTimer = 0;
    }
  }

  private findTarget(bot: Actor, ctx: AICtx): Actor | null {
    let best: Actor | null = null;
    let bestD = Infinity;
    for (const a of ctx.actors) {
      if (a === bot || !a.alive || a.team === bot.team) continue;
      if (this.canSee(bot, a, ctx)) {
        const d = bot.pos.distanceToSquared(a.pos);
        if (d < bestD) {
          bestD = d;
          best = a;
        }
      }
    }
    return best;
  }

  private canSee(bot: Actor, a: Actor, ctx: AICtx): boolean {
    const dx = a.pos.x - bot.pos.x;
    const dz = a.pos.z - bot.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist > VIEW_DIST) return false;
    if (dist > 1.5) {
      const fx = Math.sin(bot.yaw);
      const fz = Math.cos(bot.yaw);
      const dot = (dx * fx + dz * fz) / dist;
      if (dot < FOV_COS) return false;
    }
    return ctx.map.lineOfSight(bot.pos.x, bot.pos.z, a.pos.x, a.pos.z);
  }

  private aimAt(bot: Actor, tx: number, ty: number, tz: number, dt: number, snap = 7) {
    const dx = tx - bot.pos.x;
    const dz = tz - bot.pos.z;
    const horiz = Math.hypot(dx, dz);
    const desiredYaw = Math.atan2(dx, dz);
    const desiredPitch = Math.atan2(ty - (bot.pos.y + 1.5), horiz);
    bot.yaw = this.turn(bot.yaw, desiredYaw, snap * dt);
    bot.pitch = this.turn(bot.pitch, desiredPitch, snap * dt);
    const err = Math.abs(this.angleDiff(bot.yaw, desiredYaw));
    return err;
  }

  private combat(bot: Actor, ctx: AICtx) {
    const t = bot.target;
    if (!t) {
      bot.mode = 'patrol';
      return;
    }
    const err = this.aimAt(bot, t.pos.x, t.pos.y + 1.35, t.pos.z, ctx.dt, 9);
    bot.reactionTimer -= ctx.dt;
    const dist = bot.pos.distanceTo(t.pos);
    // strafe / positioning: keep some distance, jiggle
    const toT = V(t.pos.x - bot.pos.x, 0, t.pos.z - bot.pos.z).normalize();
    let wish = V();
    const wep = bot.currentWeapon();
    if (dist < 6 && wep.slot !== 'melee') {
      wish.copy(toT).multiplyScalar(-1); // back off
    } else if (dist > wep.range * 0.7) {
      wish.copy(toT); // close in
    } else {
      // strafe perpendicular
      const side = Math.sin(ctx.time * 2 + bot.id) > 0 ? 1 : -1;
      wish.set(-toT.z * side, 0, toT.x * side);
    }
    ctx.move(bot, wish, false, ctx.dt);

    if (err < 0.09 && bot.reactionTimer <= 0) {
      ctx.tryFire(bot);
    }
  }

  private hunt(bot: Actor, ctx: AICtx) {
    // move to last seen position; if reached, resume objective
    const goal = bot.lastSeenTarget;
    if (bot.pos.distanceTo(goal) < 2.5) {
      bot.mode = 'patrol';
      bot.path = [];
      return;
    }
    this.followTo(bot, goal, ctx, true);
  }

  private objective(bot: Actor, ctx: AICtx) {
    const r = ctx.round;
    if (bot.team === 'T') {
      if (r.bombPlanted) {
        // defend near bomb
        this.holdNear(bot, ctx.bombPos!, ctx, 10);
        return;
      }
      if (bot.hasBomb) {
        const site = bot.pos.x < 4 ? ctx.map.aSite : ctx.map.bSite;
        const label = bot.pos.x < 4 ? 'A' : 'B';
        if (ctx.map.siteContains(label, bot.pos.x, bot.pos.z)) {
          bot.wantPlant = true;
          this.face(bot, site, ctx.dt);
          return;
        }
        this.followTo(bot, site, ctx, true);
        return;
      }
      // push toward a site (support)
      this.pushSite(bot, ctx);
    } else {
      // CT
      if (r.bombPlanted && ctx.bombPos) {
        const at = bot.pos.distanceTo(ctx.bombPos) < 2.2;
        if (at) {
          bot.wantDefuse = true;
          this.face(bot, ctx.bombPos, ctx.dt);
          return;
        }
        this.followTo(bot, ctx.bombPos, ctx, true);
        return;
      }
      // defend / patrol between sites
      this.patrol(bot, ctx);
    }
  }

  private pushSite(bot: Actor, ctx: AICtx) {
    if (!bot.patrolGoal || bot.pos.distanceTo(bot.patrolGoal) < 3) {
      bot.patrolGoal = Math.random() < 0.5 ? ctx.map.aSite.clone() : ctx.map.bSite.clone();
      bot.path = [];
    }
    this.followTo(bot, bot.patrolGoal, ctx, true);
  }

  private patrol(bot: Actor, ctx: AICtx) {
    if (!bot.patrolGoal || bot.pos.distanceTo(bot.patrolGoal) < 3) {
      const targets = ctx.map.patrolTargets();
      bot.patrolGoal = targets[Math.floor(Math.random() * targets.length)];
      bot.path = [];
    }
    this.followTo(bot, bot.patrolGoal, ctx, false);
  }

  private holdNear(bot: Actor, center: THREE.Vector3, ctx: AICtx, radius: number) {
    if (bot.pos.distanceTo(center) > radius) {
      this.followTo(bot, center, ctx, false);
    } else {
      // slow scan
      bot.yaw += Math.sin(ctx.time * 0.6 + bot.id) * 0.01;
    }
  }

  private face(bot: Actor, p: THREE.Vector3, dt: number) {
    this.aimAt(bot, p.x, p.y + 0.5, p.z, dt, 8);
  }

  private followTo(bot: Actor, goal: THREE.Vector3, ctx: AICtx, run: boolean) {
    bot.repathTimer -= ctx.dt;
    if (bot.path.length === 0 || bot.repathTimer <= 0) {
      bot.path = ctx.nav.findPath(bot.pos.x, bot.pos.z, goal.x, goal.z);
      bot.pathIndex = 0;
      bot.repathTimer = 1.0 + Math.random() * 0.6;
    }
    if (bot.path.length === 0) return;
    let node = bot.path[bot.pathIndex];
    while (node && bot.pos.distanceTo(node) < 1.6) {
      bot.pathIndex++;
      node = bot.path[bot.pathIndex];
    }
    if (!node) {
      bot.path = [];
      return;
    }
    const wish = V(node.x - bot.pos.x, 0, node.z - bot.pos.z).normalize();
    // face movement direction (unless engaging handled elsewhere)
    const desiredYaw = Math.atan2(wish.x, wish.z);
    bot.yaw = this.turn(bot.yaw, desiredYaw, 8 * ctx.dt);
    bot.pitch = this.turn(bot.pitch, 0, 4 * ctx.dt);
    ctx.move(bot, wish, run, ctx.dt);
  }

  private turn(cur: number, target: number, maxStep: number): number {
    const d = this.angleDiff(cur, target);
    if (Math.abs(d) <= maxStep) return target;
    return cur + Math.sign(d) * maxStep;
  }

  private angleDiff(a: number, b: number): number {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }
}
