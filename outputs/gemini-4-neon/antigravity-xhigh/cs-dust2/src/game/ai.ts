import { AABB, AIState, BombState, Team, Vec3 } from './types';
import { Dust2NavGraph } from './navgraph';
import { hasLineOfSight } from './physics';

export interface AIActorView {
  id: string;
  team: Team;
  alive: boolean;
  pos: Vec3;
  yaw: number;
  pitch: number;
  hasBomb: boolean;
  hp: number;
  isReloading: boolean;
  activeMag: number;
  hasPrimary: boolean;
  primaryWeaponId: string | null;
}

export interface AICommandOutput {
  moveX: number; // world X desired dir (-1..1)
  moveZ: number; // world Z desired dir (-1..1)
  walk: boolean;
  crouch: boolean;
  targetYaw: number;
  targetPitch: number;
  fire: boolean;
  reload: boolean;
  wantPlant: boolean;
  wantDefuse: boolean;
  spottedEnemyIds: string[];
}

export interface RoundTacticsContext {
  targetSite: 'A' | 'B';
  bombState: BombState;
  bombPos: Vec3 | null;
  bombSite: 'A' | 'B' | null;
  siteACenter: Vec3;
  siteBCenter: Vec3;
  defuserId: string | null;
}

const CT_DEFEND_SPOTS: Record<number, string[]> = {
  0: ['a_site_goose', 'a_site_plant', 'a_ramp_top'],
  1: ['a_long_north', 'a_site_short', 'cat_short'],
  2: ['mid_doors_n', 'ct_mid', 'cat_north'],
  3: ['b_site_plant', 'b_site_plat', 'b_site_doors'],
  4: ['b_site_window', 'b_site_south', 'ct_mid_w'],
};

const T_ATTACK_ROUTES_A: string[][] = [
  ['long_doors_room', 'a_long_corner', 'a_ramp_top', 'a_site_plant'],
  ['long_doors_room', 'a_long_mid', 'a_site_goose'],
  ['top_mid', 'cat_stairs_top', 'cat_north', 'a_site_short', 'a_site_plant'],
  ['top_mid', 'cat_stairs_top', 'cat_mid', 'a_site_back'],
  ['mid_center', 'mid_doors_n', 'ct_spawn_mid', 'a_site_ct'],
];

const T_ATTACK_ROUTES_B: string[][] = [
  ['b_tun_entry', 'b_tun_junction', 'b_site_entry', 'b_site_plant'],
  ['b_tun_entry', 'b_tun_upper_w', 'b_site_entry', 'b_site_plat'],
  ['b_tun_entry', 'b_tun_junction', 'b_site_south', 'b_site_doors'],
  ['mid_lower', 'b_tun_lower_w', 'b_tun_exit', 'b_site_plant'],
  ['mid_xbox', 'mid_doors_n', 'ct_mid_w', 'b_site_doors'],
];

function normalizeAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export class BotBrain {
  public state: AIState = 'PATROL';
  private path: Vec3[] = [];
  private pathIndex = 0;
  private goalPos: Vec3 | null = null;
  private repathTimer = 0;
  private reactionTimer = 0;
  private burstTimer = 0;
  private burstPause = 0;
  private strafeDir = 1;
  private strafeTimer = 0;

  // Stuck detection
  private lastCheckPos: Vec3 = { x: 0, y: 0, z: 0 };
  private stuckTimer = 0;
  private unstuckNudgeTimer = 0;
  private unstuckDir = { x: 0, z: 0 };

  // Tactical route index per round
  private routeNodes: string[] = [];
  private routeStep = 0;
  private alertTargetPos: Vec3 | null = null;
  private alertTimer = 0;
  private aimJitterX = 0;
  private aimJitterY = 0;
  private jitterTimer = 0;

  constructor(public readonly slotIndex: number, public readonly team: Team) {}

  public resetForRound(tactics: RoundTacticsContext): void {
    this.path = [];
    this.pathIndex = 0;
    this.goalPos = null;
    this.repathTimer = 0.1 + Math.random() * 0.35;
    this.reactionTimer = 0;
    this.burstTimer = 0;
    this.burstPause = 0;
    this.stuckTimer = 0;
    this.unstuckNudgeTimer = 0;
    this.alertTargetPos = null;
    this.alertTimer = 0;
    this.routeStep = 0;

    if (this.team === 'CT') {
      const spots = CT_DEFEND_SPOTS[this.slotIndex % 5];
      this.routeNodes = [spots[Math.floor(Math.random() * spots.length)]];
      this.state = 'PATROL';
    } else {
      const routes = tactics.targetSite === 'A' ? T_ATTACK_ROUTES_A : T_ATTACK_ROUTES_B;
      this.routeNodes = [...routes[this.slotIndex % routes.length]];
      this.state = 'ADVANCE_SITE';
    }
  }

  public notifyDamageFrom(attackerPos: Vec3): void {
    this.alertTargetPos = { ...attackerPos };
    this.alertTimer = 3.5;
  }

  public update(
    dt: number,
    self: AIActorView,
    allActors: AIActorView[],
    nav: Dust2NavGraph,
    colliders: AABB[],
    tactics: RoundTacticsContext
  ): AICommandOutput {
    const out: AICommandOutput = {
      moveX: 0,
      moveZ: 0,
      walk: false,
      crouch: false,
      targetYaw: self.yaw,
      targetPitch: 0,
      fire: false,
      reload: false,
      wantPlant: false,
      wantDefuse: false,
      spottedEnemyIds: [],
    };

    if (!self.alive) return out;

    this.repathTimer -= dt;
    this.alertTimer = Math.max(0, this.alertTimer - dt);
    this.jitterTimer -= dt;
    if (this.jitterTimer <= 0) {
      this.jitterTimer = 0.18 + Math.random() * 0.2;
      this.aimJitterX = (Math.random() - 0.5) * 0.045;
      this.aimJitterY = (Math.random() - 0.5) * 0.032;
    }

    // 1. VISION CHECK (strictly wall-occluded raycast + FOV cone!)
    const selfEye: Vec3 = { x: self.pos.x, y: self.pos.y + 1.56, z: self.pos.z };
    let closestEnemy: AIActorView | null = null;
    let closestEnemyDist = Infinity;

    // Character forward vector in Three.js (yaw=0 looks along -Z)
    const fwdX = -Math.sin(self.yaw);
    const fwdZ = -Math.cos(self.yaw);

    for (let i = 0; i < allActors.length; i++) {
      const other = allActors[i];
      if (!other.alive || other.team === self.team) continue;

      const dx = other.pos.x - self.pos.x;
      const dy = other.pos.y - self.pos.y;
      const dz = other.pos.z - self.pos.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > 78) continue;

      // FOV check (~130 deg wide, or 360 deg within 5.5m close proximity)
      const horizDist = Math.hypot(dx, dz) + 0.0001;
      const dot = (dx * fwdX + dz * fwdZ) / horizDist;
      const inFov = dist < 6.0 || dot > 0.34;
      if (!inFov) continue;

      const targetChest: Vec3 = { x: other.pos.x, y: other.pos.y + 1.25, z: other.pos.z };
      const targetHead: Vec3 = { x: other.pos.x, y: other.pos.y + 1.62, z: other.pos.z };
      if (
        hasLineOfSight(selfEye, targetChest, colliders) ||
        hasLineOfSight(selfEye, targetHead, colliders)
      ) {
        out.spottedEnemyIds.push(other.id);
        if (dist < closestEnemyDist) {
          closestEnemyDist = dist;
          closestEnemy = other;
        }
      }
    }

    // 2. HIGH-LEVEL OBJECTIVE SELECTION (C4 plant / retrieve / defuse / attack / defend)
    const targetSiteCenter = tactics.targetSite === 'A' ? tactics.siteACenter : tactics.siteBCenter;

    let desiredGoal: Vec3 | null = null;
    let wantPlant = false;
    let wantDefuse = false;

    if (self.team === 'T') {
      if (tactics.bombState === 'planted' && tactics.bombPos) {
        // Defend the planted bomb near the bombsite
        this.state = 'DEFEND_BOMB';
        const ang = (this.slotIndex * 1.35) % (Math.PI * 2);
        desiredGoal = {
          x: tactics.bombPos.x + Math.cos(ang) * 4.5,
          y: tactics.bombPos.y,
          z: tactics.bombPos.z + Math.sin(ang) * 4.5,
        };
      } else if (tactics.bombState === 'dropped' && tactics.bombPos) {
        // Nearest/assigned Ts retrieve dropped C4
        this.state = 'HUNT_BOMB';
        desiredGoal = tactics.bombPos;
      } else if (self.hasBomb) {
        const dSite = Math.hypot(
          self.pos.x - targetSiteCenter.x,
          self.pos.z - targetSiteCenter.z
        );
        const sameElev = Math.abs(self.pos.y - targetSiteCenter.y) < 0.9;
        if (dSite < 3.2 && sameElev && !closestEnemy) {
          this.state = 'PLANT_BOMB';
          wantPlant = true;
          desiredGoal = null;
        } else {
          this.state = 'ADVANCE_SITE';
          desiredGoal = this.getRouteOrFallback(self.pos, nav, targetSiteCenter);
        }
      } else {
        this.state = 'ADVANCE_SITE';
        desiredGoal = this.getRouteOrFallback(self.pos, nav, targetSiteCenter);
      }
    } else {
      // CT Team logic
      if (tactics.bombState === 'planted' && tactics.bombPos) {
        const dBomb = Math.hypot(
          self.pos.x - tactics.bombPos.x,
          self.pos.z - tactics.bombPos.z
        );
        const amDesignatedDefuser = tactics.defuserId === self.id;
        if (amDesignatedDefuser && dBomb < 2.2 && (!closestEnemy || closestEnemyDist > 12)) {
          this.state = 'DEFUSE_BOMB';
          wantDefuse = true;
          desiredGoal = null;
        } else {
          this.state = 'ROTATE_DEFUSE';
          desiredGoal = tactics.bombPos;
        }
      } else {
        // Patrol / Hold assigned Dust2 site & rotate occasionally
        this.state = 'PATROL';
        desiredGoal = this.getRouteOrFallback(self.pos, nav, tactics.siteACenter);
        if (desiredGoal && Math.hypot(self.pos.x - desiredGoal.x, self.pos.z - desiredGoal.z) < 2.2) {
          this.state = 'HOLD_ANGLE';
          // After holding awhile, rotate patrol spots so CTs actively sweep Dust2
          if (this.repathTimer <= -7.5) {
            const spots = CT_DEFEND_SPOTS[this.slotIndex % 5];
            this.routeNodes = [spots[Math.floor(Math.random() * spots.length)]];
            this.routeStep = 0;
            this.repathTimer = 0.2;
          }
        }
      }
    }

    // 3. COMBAT ENGAGEMENT (takes priority over walking when enemy is visible)
    if (closestEnemy) {
      this.state = 'ENGAGE';
      this.alertTargetPos = { ...closestEnemy.pos };
      this.alertTimer = 3.0;
      this.reactionTimer += dt;

      // Aim smoothly toward enemy chest/head with realistic slight offset
      const aimHeight = closestEnemyDist < 22 && Math.random() < 0.3 ? 1.58 : 1.28;
      const dx = closestEnemy.pos.x - self.pos.x;
      const dy = closestEnemy.pos.y + aimHeight - (self.pos.y + 1.56);
      const dz = closestEnemy.pos.z - self.pos.z;
      const horiz = Math.hypot(dx, dz) + 0.001;

      const idealYaw = Math.atan2(-dx, -dz) + this.aimJitterX;
      const idealPitch = Math.atan2(dy, horiz) + this.aimJitterY;

      // Smooth angular tracking
      const yawDiff = normalizeAngle(idealYaw - self.yaw);
      out.targetYaw = self.yaw + Math.max(-dt * 8.5, Math.min(dt * 8.5, yawDiff));
      out.targetPitch = Math.max(-0.85, Math.min(0.85, idealPitch));

      // Combat micro-strafing (stop briefly when shooting AWP for precision)
      this.strafeTimer -= dt;
      if (this.strafeTimer <= 0) {
        this.strafeTimer = 0.45 + Math.random() * 0.65;
        this.strafeDir = Math.random() > 0.5 ? 1 : -1;
      }

      const isSniper = self.primaryWeaponId === 'awp';
      if (!isSniper && closestEnemyDist > 5) {
        const rightX = Math.cos(self.yaw);
        const rightZ = -Math.sin(self.yaw);
        out.moveX = rightX * this.strafeDir * 0.65;
        out.moveZ = rightZ * this.strafeDir * 0.65;
      } else if (closestEnemyDist < 4.5) {
        // Backpedal slightly in point-blank range
        out.moveX = -dx / horiz;
        out.moveZ = -dz / horiz;
      }

      // Burst firing cadence after brief realistic human reaction delay (~0.22s)
      if (this.reactionTimer > 0.22 && Math.abs(yawDiff) < 0.24) {
        if (this.burstPause > 0) {
          this.burstPause -= dt;
        } else {
          out.fire = true;
          this.burstTimer += dt;
          if (this.burstTimer > (isSniper ? 0.15 : 0.45 + Math.random() * 0.35)) {
            this.burstTimer = 0;
            this.burstPause = isSniper ? 0.3 : 0.22 + Math.random() * 0.22;
          }
        }
      }

      if (self.activeMag === 0 && !self.isReloading) {
        out.reload = true;
      }
      return out;
    }

    // No enemy currently visible
    this.reactionTimer = Math.max(0, this.reactionTimer - dt * 2);
    out.wantPlant = wantPlant;
    out.wantDefuse = wantDefuse;

    if (wantPlant || wantDefuse) {
      out.crouch = true;
      if (tactics.bombPos && wantDefuse) {
        const dx = tactics.bombPos.x - self.pos.x;
        const dz = tactics.bombPos.z - self.pos.z;
        out.targetYaw = Math.atan2(-dx, -dz);
        out.targetPitch = -0.5;
      }
      return out;
    }

    // Reload safely when out of combat and low on ammo
    if (self.activeMag <= 4 && !self.isReloading && self.activeMag >= 0) {
      out.reload = true;
    }

    // 4. A* PATHFINDING & NAVIGATION
    if (desiredGoal) {
      const needNewPath =
        this.path.length === 0 ||
        this.pathIndex >= this.path.length ||
        !this.goalPos ||
        Math.hypot(desiredGoal.x - this.goalPos.x, desiredGoal.z - this.goalPos.z) > 3.5 ||
        this.repathTimer <= 0;

      if (needNewPath) {
        this.goalPos = { ...desiredGoal };
        this.path = nav.findPath(self.pos, desiredGoal);
        this.pathIndex = 0;
        this.repathTimer = 1.6 + Math.random() * 0.8;
      }

      // Advance waypoints cleanly
      while (this.pathIndex < this.path.length) {
        const wp = this.path[this.pathIndex];
        const dist2D = Math.hypot(wp.x - self.pos.x, wp.z - self.pos.z);
        if (dist2D < 1.35) {
          this.pathIndex++;
        } else {
          break;
        }
      }

      if (this.pathIndex < this.path.length) {
        const wp = this.path[this.pathIndex];
        const dx = wp.x - self.pos.x;
        const dz = wp.z - self.pos.z;
        const len = Math.hypot(dx, dz) + 0.0001;

        // Stuck detection + automatic lateral sidestep & repath
        this.stuckTimer += dt;
        if (this.stuckTimer > 0.65) {
          const moved = Math.hypot(
            self.pos.x - this.lastCheckPos.x,
            self.pos.z - this.lastCheckPos.z
          );
          this.lastCheckPos = { ...self.pos };
          this.stuckTimer = 0;
          if (moved < 0.28) {
            this.unstuckNudgeTimer = 0.45;
            const side = Math.random() > 0.5 ? 1 : -1;
            this.unstuckDir = { x: (-dz / len) * side, z: (dx / len) * side };
            this.repathTimer = 0.05;
          }
        }

        if (this.unstuckNudgeTimer > 0) {
          this.unstuckNudgeTimer -= dt;
          out.moveX = this.unstuckDir.x * 0.85 + (dx / len) * 0.35;
          out.moveZ = this.unstuckDir.z * 0.85 + (dz / len) * 0.35;
        } else {
          out.moveX = dx / len;
          out.moveZ = dz / len;
        }

        // Look toward alert direction if recently shot, else along movement path
        if (this.alertTargetPos && this.alertTimer > 0) {
          const adx = this.alertTargetPos.x - self.pos.x;
          const adz = this.alertTargetPos.z - self.pos.z;
          const lookYaw = Math.atan2(-adx, -adz);
          const diff = normalizeAngle(lookYaw - self.yaw);
          out.targetYaw = self.yaw + Math.max(-dt * 5.5, Math.min(dt * 5.5, diff));
        } else {
          const moveYaw = Math.atan2(-dx, -dz);
          const diff = normalizeAngle(moveYaw - self.yaw);
          out.targetYaw = self.yaw + Math.max(-dt * 5.2, Math.min(dt * 5.2, diff));
        }
      } else {
        // Reached destination: hold angle & scan for enemies
        const scanTarget =
          this.alertTargetPos && this.alertTimer > 0
            ? this.alertTargetPos
            : self.team === 'CT'
            ? { x: 0, y: 0, z: 20 } // Face toward T side
            : { x: 0, y: 0, z: -20 };
        const sdx = scanTarget.x - self.pos.x;
        const sdz = scanTarget.z - self.pos.z;
        const baseYaw = Math.atan2(-sdx, -sdz) + Math.sin(performance.now() * 0.001 + this.slotIndex) * 0.45;
        const diff = normalizeAngle(baseYaw - self.yaw);
        out.targetYaw = self.yaw + Math.max(-dt * 2.5, Math.min(dt * 2.5, diff));
      }
    }

    // Teammate separation steering so bots spread tactically instead of stacking on top of each other
    for (let i = 0; i < allActors.length; i++) {
      const other = allActors[i];
      if (!other.alive || other.id === self.id) continue;
      const sx = self.pos.x - other.pos.x;
      const sz = self.pos.z - other.pos.z;
      const d = Math.hypot(sx, sz);
      if (d > 0.01 && d < 1.35) {
        const push = (1.35 - d) * 0.85;
        out.moveX += (sx / d) * push;
        out.moveZ += (sz / d) * push;
      }
    }

    const mag = Math.hypot(out.moveX, out.moveZ);
    if (mag > 1) {
      out.moveX /= mag;
      out.moveZ /= mag;
    }

    return out;
  }

  private getRouteOrFallback(pos: Vec3, nav: Dust2NavGraph, fallback: Vec3): Vec3 {
    while (this.routeStep < this.routeNodes.length) {
      const node = nav.getNode(this.routeNodes[this.routeStep]);
      if (!node) {
        this.routeStep++;
        continue;
      }
      if (Math.hypot(node.x - pos.x, node.z - pos.z) < 2.6 && this.routeStep < this.routeNodes.length - 1) {
        this.routeStep++;
      } else {
        return { x: node.x, y: node.y, z: node.z };
      }
    }
    return fallback;
  }
}
