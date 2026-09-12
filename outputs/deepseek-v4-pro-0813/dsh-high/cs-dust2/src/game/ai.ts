import * as THREE from 'three';
import type { Player } from './entities';
import type { NavNode } from './map';
import { findPath } from './nav';

export interface EngineApi {
  allPlayers: Player[];
  c4State: 'carried' | 'dropped' | 'planted' | 'none';
  c4Position: THREE.Vector3 | null;
  c4Carrier(): Player | null;
  hasLOS(a: THREE.Vector3, b: THREE.Vector3): boolean;
  fireBot(bot: Player, target: THREE.Vector3): void;
  requestPlant(bot: Player): void;
  requestDefuse(bot: Player): void;
  requestPickup(bot: Player): void;
}

export type BotRole = 'A' | 'B' | 'MID';

export class BotBrain {
  bot: Player;
  engine: EngineApi;
  role: BotRole = 'A';
  homePos = new THREE.Vector3();
  path: NavNode[] = [];
  pathIndex = 0;
  repathTimer = 0;
  thinkTimer = 0;
  targetEnemy: Player | null = null;
  strafeDir = 1;
  strafeTimer = 0;

  constructor(bot: Player, engine: EngineApi) {
    this.bot = bot;
    this.engine = engine;
  }

  setRole(role: BotRole, home: THREE.Vector3): void {
    this.role = role;
    this.homePos.copy(home);
    this.path = [];
    this.targetEnemy = null;
  }

  update(dt: number): void {
    const bot = this.bot;
    if (!bot.alive) {
      bot.moveF = 0;
      bot.moveS = 0;
      return;
    }
    // while planting / defusing: stand still, but abort if an enemy threatens
    if (bot.action) {
      bot.moveF = 0;
      bot.moveS = 0;
      this.thinkTimer -= dt;
      if (this.thinkTimer <= 0) {
        this.thinkTimer = 0.15;
        const enemy = this.findVisibleEnemy();
        if (enemy) {
          bot.action = null;
          bot.actionProgress = 0;
          this.targetEnemy = enemy;
        }
      }
      return;
    }

    this.thinkTimer -= dt;
    if (this.thinkTimer <= 0) {
      this.thinkTimer = 0.12 + Math.random() * 0.12;
      this.think();
    }

    // update target validity
    if (this.targetEnemy && (!this.targetEnemy.alive || !this.canSee(this.targetEnemy))) {
      this.targetEnemy = null;
    }

    if (this.targetEnemy) {
      this.engage(dt);
    } else {
      this.navigate(dt);
    }
  }

  think(): void {
    const bot = this.bot;
    const enemy = this.findVisibleEnemy();
    if (enemy) {
      this.targetEnemy = enemy;
      return;
    }
    this.targetEnemy = null;
    this.repathTimer -= 0.15;
    const goal = this.computeGoal();
    if (goal && (this.repathTimer <= 0 || this.path.length === 0)) {
      this.path = findPath(bot.pos.x, bot.pos.z, goal.x, goal.z);
      this.pathIndex = 0;
      this.repathTimer = 1.2;
    }
  }

  computeGoal(): THREE.Vector3 | null {
    const bot = this.bot;
    const eng = this.engine;

    if (eng.c4State === 'planted' && eng.c4Position) {
      // everyone rushes the planted bomb: CT defuse, T guard
      return eng.c4Position;
    }

    if (bot.team === 'T') {
      if (bot.carriesBomb) {
        return this.homePos; // homePos is the chosen plant site for carriers
      }
      if (eng.c4State === 'dropped' && eng.c4Position) {
        return eng.c4Position; // pick the bomb back up
      }
      const carrier = eng.c4Carrier();
      if (carrier && carrier.alive) {
        return new THREE.Vector3(carrier.pos.x, 0, carrier.pos.z);
      }
      return this.homePos; // push the site anyway
    }

    // CT
    if (eng.c4State === 'carried') {
      // rotate between home site and mid to intercept
      return this.homePos;
    }
    return this.homePos;
  }

  navigate(dt: number): void {
    const bot = this.bot;
    // check plant / defuse / pickup whenever close enough
    this.trySiteAction();
    if (this.path.length === 0) {
      bot.moveF = 0;
      bot.moveS = 0;
      return;
    }
    let wp = this.path[this.pathIndex];
    const dx = wp.x - bot.pos.x;
    const dz = wp.z - bot.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 1.1) {
      this.pathIndex++;
      if (this.pathIndex >= this.path.length) {
        this.path = [];
        bot.moveF = 0;
        bot.moveS = 0;
        return;
      }
      wp = this.path[this.pathIndex];
    }
    const dx2 = wp.x - bot.pos.x;
    const dz2 = wp.z - bot.pos.z;
    const targetYaw = Math.atan2(-dx2, -dz2); // forward is -Z in three.js
    this.rotateToward(bot, targetYaw, 6 * dt);
    bot.moveF = 1;
    bot.moveS = 0;

    // near site / bomb -> start plant / defuse / pickup
    this.trySiteAction();
  }

  trySiteAction(): void {
    const bot = this.bot;
    const eng = this.engine;
    if (bot.team === 'T' && bot.carriesBomb) {
      const goal = this.homePos;
      const d = Math.hypot(bot.pos.x - goal.x, bot.pos.z - goal.z);
      if (d < 7) eng.requestPlant(bot);
    }
    if (bot.team === 'CT' && eng.c4State === 'planted' && eng.c4Position) {
      const d = bot.pos.distanceTo(eng.c4Position);
      if (d < 3.2) eng.requestDefuse(bot);
    }
    if (bot.team === 'T' && eng.c4State === 'dropped' && eng.c4Position && !bot.carriesBomb) {
      const d = bot.pos.distanceTo(eng.c4Position);
      if (d < 2) eng.requestPickup(bot);
    }
  }

  engage(dt: number): void {
    const bot = this.bot;
    const enemy = this.targetEnemy;
    if (!enemy) return;
    const target = enemy.eyePosition().clone();
    // aim slightly at chest for rifles, head for pistols sometimes
    target.y -= Math.random() < 0.25 ? 0 : 0.15;

    const dir = target.clone().sub(bot.eyePosition());
    const dist = dir.length();
    dir.normalize();
    const targetYaw = Math.atan2(-dir.x, -dir.z);
    const targetPitch = Math.asin(dir.y);
    this.rotateToward(bot, targetYaw, 10 * dt, targetPitch, 8 * dt);

    // movement: keep range, strafe
    this.strafeTimer -= dt;
    if (this.strafeTimer <= 0) {
      this.strafeTimer = 0.6 + Math.random() * 0.8;
      this.strafeDir *= -1;
    }
    const ideal = bot.currentWeapon().range * 0.4;
    bot.moveS = this.strafeDir;
    if (dist > ideal) bot.moveF = 0.6;
    else if (dist < ideal * 0.3) bot.moveF = -0.5;
    else bot.moveF = 0;

    // fire when on target
    const yawErr = angleDiff(bot.yaw, targetYaw);
    const pitchErr = Math.abs(bot.pitch - targetPitch);
    if (yawErr < 0.06 && pitchErr < 0.09 && dist < bot.currentWeapon().range) {
      this.engine.fireBot(bot, target);
    }
  }

  findVisibleEnemy(): Player | null {
    const bot = this.bot;
    const eye = bot.eyePosition();
    let best: Player | null = null;
    let bestDist = Infinity;
    for (const p of this.engine.allPlayers) {
      if (p === bot || !p.alive || p.team === bot.team) continue;
      const d = p.pos.distanceTo(bot.pos);
      if (d > 50) continue;
      // field of view check
      const to = p.eyePosition().sub(eye);
      const yawTo = Math.atan2(-to.x, -to.z);
      if (angleDiff(bot.yaw, yawTo) > 1.1) continue;
      if (!this.engine.hasLOS(eye, p.eyePosition())) continue;
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    return best;
  }

  canSee(p: Player): boolean {
    return this.engine.hasLOS(this.bot.eyePosition(), p.eyePosition());
  }

  rotateToward(bot: Player, targetYaw: number, yawSpeed: number, targetPitch?: number, pitchSpeed?: number): void {
    const dy = angleDiff(targetYaw, bot.yaw);
    bot.yaw += THREE.MathUtils.clamp(dy, -yawSpeed, yawSpeed);
    if (targetPitch !== undefined && pitchSpeed !== undefined) {
      const dp = targetPitch - bot.pitch;
      bot.pitch += THREE.MathUtils.clamp(dp, -pitchSpeed, pitchSpeed);
    }
    bot.pitch = THREE.MathUtils.clamp(bot.pitch, -1.45, 1.45);
  }
}

function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
