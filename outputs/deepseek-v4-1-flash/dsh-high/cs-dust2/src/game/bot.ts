import { angleDelta, clamp, rand } from '../core/math';
import type { NavPoint } from '../ai/navigation';
import type { NavGrid } from '../ai/navigation';
import type { Actor } from './actor';
import { emptyInput, type ActorInput, type Brain, type Team } from './types';

export interface BotGame {
  readonly nav: NavGrid;
  readonly time: number;
  readonly bombPlanted: boolean;
  readonly bombPos: { x: number; z: number } | null;
  findVisibleEnemy(self: Actor): Actor | null;
  teamSite(team: Team): { x: number; z: number };
  randomPatrol(team: Team, self: Actor): { x: number; z: number };
  hasLOS(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean;
}

type BotState = 'patrol' | 'advance' | 'engage' | 'hold' | 'plant' | 'defuse' | 'investigate';

export class BotBrain implements Brain {
  readonly self: Actor;
  private game: BotGame;
  private input: ActorInput = emptyInput();

  state: BotState = 'patrol';
  private target: Actor | null = null;  private lastSeen: { x: number; z: number } | null = null;
  private lastSeenAt = -99;

  private path: NavPoint[] = [];
  private pathGoal: { x: number; z: number } | null = null;
  private repathAt = 0;

  private skill: number;
  private aimErrBase: number;
  private turnRate: number;
  private reaction = 0;
  private aimNoiseYaw = 0;
  private aimNoisePitch = 0;
  private noiseAt = 0;

  private desiredYaw = 0;
  private desiredPitch = 0;

  private strafeDir = 1;
  private strafeUntil = 0;
  private burstOn = false;
  private burstUntil = 0;

  private patrolPoint: NavPoint | null = null;
  private patrolWaitUntil = 0;
  private moveDir: { x: number; z: number } | null = null;
  private pushTarget: NavPoint | null = null;

  private stuckTimer = 0;
  private lastPos = { x: 0, z: 0 };
  private siteOffset: { x: number; z: number };

  constructor(self: Actor, game: BotGame) {
    this.self = self;
    this.game = game;
    this.skill = rand(0.48, 0.9);
    this.aimErrBase = (1 - this.skill) * 0.075 + 0.004;
    this.turnRate = 6.5 + this.skill * 9;
    this.desiredYaw = self.yaw;
    this.lastPos = { x: self.pos.x, z: self.pos.z };
    this.siteOffset = { x: rand(-4, 4), z: rand(-4, 4) };
  }

  getInput(): ActorInput {
    return this.input;
  }

  /** Brain interface entry point (Game drives bots through this). */
  update(dt: number) {
    this.think(dt);
  }

  think(dt: number) {
    const self = this.self;
    this.input = emptyInput();
    if (!self.alive) return;

    // --- Perception -------------------------------------------------------
    const enemy = this.game.findVisibleEnemy(self);
    if (enemy) {
      if (this.target !== enemy) {
        this.reaction = 0.14 + (1 - this.skill) * 0.5;
        this.aimNoiseYaw = 0;
        this.aimNoisePitch = 0;
      }
      this.target = enemy;
      this.lastSeen = { x: enemy.pos.x, z: enemy.pos.z };
      this.lastSeenAt = this.game.time;
    } else if (this.target && (!this.target.alive || this.game.time - this.lastSeenAt > 2.5)) {
      this.target = null;
    }
    if (this.target && !this.target.alive) this.target = null;

    // --- Behaviour --------------------------------------------------------
    if (this.target) {
      this.state = 'engage';
      this.engage(dt, this.target);
    } else {
      this.objective(dt);
    }

    this.applyAim(dt);
    this.updateStuck(dt);
  }

  private reRollAimNoise() {
    const spread = this.aimErrBase * (1 + this.self.horizontalSpeed() * 0.35);
    this.aimNoiseYaw = rand(-1, 1) * spread;
    this.aimNoisePitch = rand(-1, 1) * spread * 0.7;
  }

  private engage(dt: number, enemy: Actor) {
    const self = this.self;
    const dist = Math.hypot(enemy.pos.x - self.pos.x, enemy.pos.z - self.pos.z);
    const def = self.currentDef();

    // Aim at upper chest / head area.
    const aimY = enemy.pos.y + (Math.random() < 0.25 ? 1.58 : 1.3);
    this.aimAt(enemy.pos.x, aimY, enemy.pos.z, dt);

    // Sniper handling.
    if (def?.scoped) {
      self.scoped = dist > 12;
    }

    // Reaction delay.
    if (this.reaction > 0) {
      this.reaction -= dt;
    } else {
      const los = this.game.hasLOS(
        self.pos.x,
        self.pos.y + self.eyeHeight,
        self.pos.z,
        enemy.pos.x,
        enemy.pos.y + 1.3,
        enemy.pos.z,
      );
      const yawErr = Math.abs(angleDelta(self.yaw, this.desiredYaw));
      const pitchErr = Math.abs(self.pitch - this.desiredPitch);
      const aimed = yawErr < 0.05 && pitchErr < 0.06;
      const inRange = dist < (def ? def.range * 1.15 : 30);
      if (los && aimed && inRange) {
        this.fireControl(def?.auto ?? false);
      }
    }

    // Movement while fighting. If the bot still has an objective it keeps
    // pushing toward it while shooting, instead of being baited off-site.
    if (this.pushTarget && dist > 13) {
      const arrived = this.navigateTo(this.pushTarget.x, this.pushTarget.z);
      if (arrived) this.pushTarget = null;
      return;
    }
    const toX = (enemy.pos.x - self.pos.x) / (dist || 1);
    const toZ = (enemy.pos.z - self.pos.z) / (dist || 1);
    let mx = 0;
    let mz = 0;
    if (dist > 19) {
      mx = toX;
      mz = toZ;
    } else if (dist < 5 && def?.kind === 'sniper') {
      mx = -toX;
      mz = -toZ;
    } else {
      if (this.game.time > this.strafeUntil) {
        const roll = Math.random();
        this.strafeDir = roll < 0.4 ? -1 : roll < 0.8 ? 1 : 0;
        this.strafeUntil = this.game.time + rand(0.35, 1.1);
      }
      mx = -toZ * this.strafeDir;
      mz = toX * this.strafeDir;
      const err = dist - 12;
      if (Math.abs(err) > 3.5) {
        mx += toX * Math.sign(err) * 0.5;
        mz += toZ * Math.sign(err) * 0.5;
      }
    }
    this.setMoveWorld(mx, mz);
  }

  private fireControl(auto: boolean) {
    if (!auto) {
      this.input.fire = true;
      return;
    }
    if (this.game.time > this.burstUntil) {
      this.burstOn = !this.burstOn;
      this.burstUntil = this.game.time + (this.burstOn ? rand(0.16, 0.34) : rand(0.1, 0.26));
    }
    this.input.fire = this.burstOn;
  }

  private objective(dt: number) {
    const self = this.self;
    if (self.team === 'T') {
      if (this.game.bombPlanted && this.game.bombPos) {
        this.state = 'hold';
        const b = this.game.bombPos;
        const dist = Math.hypot(b.x - self.pos.x, b.z - self.pos.z);
        if (dist > 7) {
          this.pushTarget = { x: b.x, z: b.z };
          this.navigateTo(b.x, b.z);
        } else {
          this.pushTarget = null;
          this.input.moveX = 0;
          this.input.moveZ = 0;
          this.turnToward(Math.atan2(-(b.x - self.pos.x), -(b.z - self.pos.z)), dt, 3);
        }
        return;
      }
      if (self.hasBomb) {
        this.state = 'plant';
        const site = this.game.teamSite('T');
        const tx = site.x + this.siteOffset.x * 0.4;
        const tz = site.z + this.siteOffset.z * 0.4;
        const dist = Math.hypot(tx - self.pos.x, tz - self.pos.z);
        if (dist > 2.5) {
          this.pushTarget = { x: tx, z: tz };
          this.navigateTo(tx, tz);
        } else {
          this.pushTarget = null;
          this.input.moveX = 0;
          this.input.moveZ = 0;
          this.input.use = true;
        }
        return;
      }
      this.state = 'advance';
      const site = this.game.teamSite('T');
      const ax = site.x + this.siteOffset.x;
      const az = site.z + this.siteOffset.z;
      this.pushTarget = { x: ax, z: az };
      if (this.navigateTo(ax, az)) this.pushTarget = null;
      return;
    }

    // CT.
    if (this.game.bombPlanted && this.game.bombPos) {
      this.state = 'defuse';
      const b = this.game.bombPos;
      const dist = Math.hypot(b.x - self.pos.x, b.z - self.pos.z);
      if (dist > 1.5) {
        this.pushTarget = { x: b.x, z: b.z };
        this.navigateTo(b.x, b.z);
      } else {
        this.pushTarget = null;
        this.input.moveX = 0;
        this.input.moveZ = 0;
        this.input.use = true;
        this.turnToward(Math.atan2(-(b.x - self.pos.x), -(b.z - self.pos.z)), dt, 4);
      }
      return;
    }
    if (this.lastSeen && this.game.time - this.lastSeenAt < 8) {
      this.state = 'investigate';
      const d = Math.hypot(this.lastSeen.x - self.pos.x, this.lastSeen.z - self.pos.z);
      if (d > 2) {
        this.pushTarget = { x: this.lastSeen.x, z: this.lastSeen.z };
        this.navigateTo(this.lastSeen.x, this.lastSeen.z);
        return;
      }
      this.lastSeen = null;
    }
    this.state = 'patrol';
    if (!this.patrolPoint) this.patrolPoint = this.game.randomPatrol('CT', self);
    if (this.game.time > this.patrolWaitUntil) {
      this.pushTarget = { x: this.patrolPoint.x, z: this.patrolPoint.z };
      const arrived = this.navigateTo(this.patrolPoint.x, this.patrolPoint.z);
      if (arrived) {
        this.pushTarget = null;
        this.patrolWaitUntil = this.game.time + rand(1.5, 4.0);
        this.patrolPoint = this.game.randomPatrol('CT', self);
      }
    }
  }

  /** Returns true when the current path is exhausted (arrived). */
  private navigateTo(x: number, z: number): boolean {
    const self = this.self;
    const goalMoved = !this.pathGoal || Math.hypot(this.pathGoal.x - x, this.pathGoal.z - z) > 2.0;
    if (goalMoved || this.game.time > this.repathAt) {
      this.path = this.game.nav.findPath(self.pos.x, self.pos.z, x, z);
      this.pathGoal = { x, z };
      this.repathAt = this.game.time + 1.0;
    }
    if (this.path.length === 0) {
      this.setMoveWorld(0, 0);
      return true;
    }
    let wp = this.path[0];
    while (wp && Math.hypot(wp.x - self.pos.x, wp.z - self.pos.z) < 1.25) {
      this.path.shift();
      wp = this.path[0];
    }
    if (!wp) {
      this.setMoveWorld(0, 0);
      return true;
    }
    this.setMoveWorld(wp.x - self.pos.x, wp.z - self.pos.z);
    return false;
  }

  private setMoveWorld(wx: number, wz: number) {
    const len = Math.hypot(wx, wz);
    if (len < 1e-4) {
      this.input.moveX = 0;
      this.input.moveZ = 0;
      this.moveDir = null;
      return;
    }
    wx /= len;
    wz /= len;
    this.moveDir = { x: wx, z: wz };
    const self = this.self;
    const fx = -Math.sin(self.yaw);
    const fz = -Math.cos(self.yaw);
    const rx = Math.cos(self.yaw);
    const rz = -Math.sin(self.yaw);
    this.input.moveZ = clamp(wx * fx + wz * fz, -1, 1);
    this.input.moveX = clamp(wx * rx + wz * rz, -1, 1);
  }

  private aimAt(tx: number, ty: number, tz: number, dt: number) {
    const self = this.self;
    const dx = tx - self.pos.x;
    const dz = tz - self.pos.z;
    const horiz = Math.hypot(dx, dz);
    const dy = ty - (self.pos.y + self.eyeHeight);
    this.desiredYaw = Math.atan2(-dx, -dz);
    this.desiredPitch = Math.atan2(dy, Math.max(0.2, horiz));
    if (this.game.time > this.noiseAt) {
      this.reRollAimNoise();
      this.noiseAt = this.game.time + 0.14;
    }
    this.turnToward(this.desiredYaw + this.aimNoiseYaw, dt, this.turnRate);
    self.pitch += (clamp(this.desiredPitch + this.aimNoisePitch, -1.45, 1.45) - self.pitch) * (1 - Math.exp(-this.turnRate * dt));
  }

  private applyAim(dt: number) {
    if (this.target) return;
    if (this.moveDir) {
      this.turnToward(Math.atan2(-this.moveDir.x, -this.moveDir.z), dt, 6);
    }
    this.self.pitch += (0 - this.self.pitch) * (1 - Math.exp(-5 * dt));
  }

  private turnToward(yaw: number, dt: number, rate: number) {
    this.self.yaw += angleDelta(this.self.yaw, yaw) * (1 - Math.exp(-rate * dt));
  }

  private updateStuck(dt: number) {
    const self = this.self;
    const moved = Math.hypot(self.pos.x - this.lastPos.x, self.pos.z - this.lastPos.z);
    const wantsMove = Math.abs(this.input.moveX) + Math.abs(this.input.moveZ) > 0.1;
    if (wantsMove && moved < 0.02) {
      this.stuckTimer += dt;
      if (this.stuckTimer > 0.7) {
        this.stuckTimer = 0;
        this.path = [];
        this.repathAt = 0;
        // Nudge sideways to escape corners.
        this.input.moveX += rand(-1, 1);
        this.input.moveZ += rand(-0.3, 1);
      }
    } else {
      this.stuckTimer = 0;
    }
    this.lastPos.x = self.pos.x;
    this.lastPos.z = self.pos.z;
  }
}
