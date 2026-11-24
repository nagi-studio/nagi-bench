import * as THREE from 'three';
import { PHYSICS, ROUND_CONFIG } from '../config';
import { Combatant } from '../entities/Combatant';
import { Dust2MapData, getPlantZoneAt } from '../map/dust2Data';
import { NavGraph } from '../map/navGraph';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { Team, WeaponId } from '../types';
import { WEAPONS } from '../weapons/weaponData';

export interface BotWorldContext {
  time: number;
  roundPhase: string;
  isPistolRound: boolean;
  combatants: Combatant[];
  bombState: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  bombPos: THREE.Vector3;
  bombSite: 'A' | 'B' | null;
  tExecuteSite: 'A' | 'B';
  onBotFire: (bot: Combatant, targetPoint: THREE.Vector3) => void;
  onBotPlantComplete: (bot: Combatant, site: 'A' | 'B') => void;
  onBotDefuseComplete: (bot: Combatant) => void;
  onBotKeypadBeep: (pos: THREE.Vector3) => void;
  onBotDefuseStart: (pos: THREE.Vector3) => void;
}

type BotRole = 'a_long' | 'a_short' | 'mid' | 'b_site' | 'b_tun';

export class BotController {
  private nav: NavGraph;
  private physics: PhysicsWorld;
  private mapData: Dust2MapData;

  private roleMap = new Map<string, BotRole>();
  private pathMap = new Map<string, Array<{ x: number; y: number; z: number }>>();
  private pathIndexMap = new Map<string, number>();
  private repathTimerMap = new Map<string, number>();
  private strafeDirMap = new Map<string, number>();
  private strafeTimerMap = new Map<string, number>();
  private reactionTimerMap = new Map<string, number>();
  private lastTargetMap = new Map<string, string | null>();
  private lastPosMap = new Map<string, THREE.Vector3>();
  private stuckTimerMap = new Map<string, number>();
  private keypadTimerMap = new Map<string, number>();
  private holdTimerMap = new Map<string, number>();

  constructor(nav: NavGraph, physics: PhysicsWorld, mapData: Dust2MapData) {
    this.nav = nav;
    this.physics = physics;
    this.mapData = mapData;
  }

  public resetForRound(combatants: Combatant[], isPistolRound: boolean, tExecuteSite: 'A' | 'B'): void {
    this.pathMap.clear();
    this.pathIndexMap.clear();
    this.repathTimerMap.clear();
    this.reactionTimerMap.clear();
    this.lastTargetMap.clear();
    this.stuckTimerMap.clear();
    this.holdTimerMap.clear();

    const ctRoles: BotRole[] = ['a_long', 'a_short', 'mid', 'b_site', 'b_site'];
    const tRolesA: BotRole[] = ['a_long', 'a_long', 'a_short', 'a_short', 'mid'];
    const tRolesB: BotRole[] = ['b_tun', 'b_tun', 'b_tun', 'mid', 'a_short'];

    let ctIdx = 0;
    let tIdx = 0;

    for (const c of combatants) {
      if (c.team === 'CT') {
        this.roleMap.set(c.id, ctRoles[ctIdx % ctRoles.length]);
        ctIdx++;
      } else {
        const list = tExecuteSite === 'A' ? tRolesA : tRolesB;
        this.roleMap.set(c.id, list[tIdx % list.length]);
        tIdx++;
      }
      this.strafeDirMap.set(c.id, Math.random() < 0.5 ? -1 : 1);
      this.strafeTimerMap.set(c.id, 0.8 + Math.random() * 1.2);
      this.lastPosMap.set(c.id, c.pos.clone());
      this.repathTimerMap.set(c.id, Math.random() * 0.4);

      if (!c.isHuman) {
        this.botBuyEquipment(c, isPistolRound);
      }
    }
  }

  private botBuyEquipment(bot: Combatant, isPistolRound: boolean): void {
    if (isPistolRound) {
      // Pistol round: keep default Glock/USP & pistol round Kevlar; small chance to buy Deagle
      if (bot.money >= WEAPONS.deagle.price && Math.random() < 0.25) {
        bot.money -= WEAPONS.deagle.price;
        bot.equipWeapon('deagle');
      }
      return;
    }

    // Buy armor + helmet if affordable
    if (bot.armor < 80 && bot.money >= ROUND_CONFIG.ARMOR_COST) {
      bot.money -= ROUND_CONFIG.ARMOR_COST;
      bot.armor = 100;
    }
    if (!bot.hasHelmet && bot.armor > 0 && bot.money >= ROUND_CONFIG.HELMET_COST) {
      bot.money -= ROUND_CONFIG.HELMET_COST;
      bot.hasHelmet = true;
    }

    // Buy primary weapon if bot doesn't already have one
    if (!bot.primary) {
      const role = this.roleMap.get(bot.id) ?? 'mid';
      const wantsAwp = (role === 'mid' || role === 'a_long') && Math.random() < 0.38;
      if (wantsAwp && bot.money >= WEAPONS.awp.price) {
        bot.money -= WEAPONS.awp.price;
        bot.equipWeapon('awp');
      } else if (bot.team === 'T' && bot.money >= WEAPONS.ak47.price) {
        bot.money -= WEAPONS.ak47.price;
        bot.equipWeapon('ak47');
      } else if (bot.team === 'CT' && bot.money >= WEAPONS.m4a4.price) {
        bot.money -= WEAPONS.m4a4.price;
        bot.equipWeapon('m4a4');
      } else if (bot.money >= WEAPONS.ak47.price) {
        bot.money -= WEAPONS.ak47.price;
        bot.equipWeapon(bot.team === 'T' ? 'ak47' : 'm4a4');
      } else if (bot.money >= WEAPONS.deagle.price && bot.secondary?.id !== 'deagle') {
        bot.money -= WEAPONS.deagle.price;
        bot.equipWeapon('deagle');
      }
    }
  }

  public updateBot(bot: Combatant, dt: number, ctx: BotWorldContext): void {
    if (!bot.alive || bot.isHuman) return;

    // During freeze time, stand ready and look ahead
    if (ctx.roundPhase === 'freeze') {
      bot.vel.x *= 0.8;
      bot.vel.z *= 0.8;
      this.physics.moveCharacter(bot.pos, bot.vel, dt, PHYSICS.PLAYER_HEIGHT);
      return;
    }

    // Update timers
    if (bot.fireCooldown > 0) bot.fireCooldown -= dt;
    bot.updateReload(dt);
    const activeCfg = WEAPONS[bot.getActiveWeaponId()];
    bot.recoilSpread = Math.max(0, bot.recoilSpread - activeCfg.recoilRecovery * 0.015 * dt);

    // Ensure best weapon selected
    if (!bot.isPlanting && !bot.isDefusing) {
      this.ensureCombatWeapon(bot);
    }

    // 1. Vision & Enemy Detection (Strict LOS through PhysicsWorld!)
    const enemy = this.findVisibleEnemy(bot, ctx.combatants, ctx.time);

    // 2. If bot is currently planting C4
    if (bot.isPlanting) {
      if (!bot.hasC4 || ctx.bombState !== 'carried') {
        bot.isPlanting = false;
        bot.plantProgress = 0;
      } else if (enemy && enemy.pos.distanceTo(bot.pos) < 11) {
        // Abort plant to fight close threat
        bot.isPlanting = false;
        bot.plantProgress = 0;
        this.ensureCombatWeapon(bot);
      } else {
        bot.vel.x = 0;
        bot.vel.z = 0;
        bot.crouching = true;
        bot.plantProgress += dt / ROUND_CONFIG.PLANT_TIME;
        const kt = (this.keypadTimerMap.get(bot.id) ?? 0) - dt;
        if (kt <= 0) {
          ctx.onBotKeypadBeep(bot.pos);
          this.keypadTimerMap.set(bot.id, 0.45);
        } else {
          this.keypadTimerMap.set(bot.id, kt);
        }

        if (bot.plantProgress >= 1.0) {
          const site = getPlantZoneAt(this.mapData, bot.pos.x, bot.pos.y, bot.pos.z) ?? ctx.tExecuteSite;
          bot.isPlanting = false;
          bot.plantProgress = 0;
          bot.crouching = false;
          ctx.onBotPlantComplete(bot, site);
        }
        this.physics.moveCharacter(bot.pos, bot.vel, dt, PHYSICS.PLAYER_CROUCH_HEIGHT);
        return;
      }
    }

    // 3. If bot is currently defusing C4
    if (bot.isDefusing) {
      const distToBomb = bot.pos.distanceTo(ctx.bombPos);
      if (ctx.bombState !== 'planted' || distToBomb > 3.0) {
        bot.isDefusing = false;
        bot.defuseProgress = 0;
      } else if (enemy && enemy.pos.distanceTo(bot.pos) < 12 && bot.defuseProgress < 0.72) {
        // Fight close attacker unless almost done sticking the defuse
        bot.isDefusing = false;
        bot.defuseProgress = 0;
      } else {
        bot.vel.x = 0;
        bot.vel.z = 0;
        bot.crouching = true;
        this.aimAtPoint(bot, ctx.bombPos, dt, 6.0);
        bot.defuseProgress += dt / ROUND_CONFIG.DEFUSE_TIME;
        if (bot.defuseProgress >= 1.0) {
          bot.isDefusing = false;
          bot.defuseProgress = 0;
          bot.crouching = false;
          ctx.onBotDefuseComplete(bot);
        }
        this.physics.moveCharacter(bot.pos, bot.vel, dt, PHYSICS.PLAYER_CROUCH_HEIGHT);
        return;
      }
    }

    bot.crouching = false;

    // 4. Combat Engagement when enemy is visible
    if (enemy) {
      const prevTarget = this.lastTargetMap.get(bot.id);
      if (prevTarget !== enemy.id) {
        this.lastTargetMap.set(bot.id, enemy.id);
        this.reactionTimerMap.set(bot.id, 0.22 + Math.random() * 0.24);
      }

      const targetPoint = enemy.pos.clone();
      targetPoint.y += 1.28; // Aim at upper chest / head region

      this.aimAtPoint(bot, targetPoint, dt, 9.5);

      // Combat strafing (stop moving when using AWP for accuracy!)
      const weaponId = bot.getActiveWeaponId();
      const dist = bot.pos.distanceTo(enemy.pos);
      if (weaponId === 'awp') {
        bot.vel.x *= Math.max(0, 1 - dt * 10);
        bot.vel.z *= Math.max(0, 1 - dt * 10);
      } else {
        let sTimer = (this.strafeTimerMap.get(bot.id) ?? 0.6) - dt;
        if (sTimer <= 0) {
          this.strafeDirMap.set(bot.id, -(this.strafeDirMap.get(bot.id) ?? 1));
          sTimer = 0.45 + Math.random() * 0.7;
        }
        this.strafeTimerMap.set(bot.id, sTimer);

        const dirToEnemy = new THREE.Vector3(enemy.pos.x - bot.pos.x, 0, enemy.pos.z - bot.pos.z).normalize();
        const right = new THREE.Vector3(-dirToEnemy.z, 0, dirToEnemy.x);
        const strafeDir = this.strafeDirMap.get(bot.id) ?? 1;
        const moveVec = right.multiplyScalar(strafeDir * 0.65);
        if (dist > 26) moveVec.addScaledVector(dirToEnemy, 0.4);
        else if (dist < 6) moveVec.addScaledVector(dirToEnemy, -0.45);
        moveVec.normalize();

        const speed = PHYSICS.BASE_MOVE_SPEED * activeCfg.moveSpeedMult * 0.58;
        bot.vel.x = moveVec.x * speed;
        bot.vel.z = moveVec.z * speed;
      }

      // Reaction delay before firing
      const react = (this.reactionTimerMap.get(bot.id) ?? 0) - dt;
      this.reactionTimerMap.set(bot.id, react);

      if (react <= 0 && !bot.reloading && bot.fireCooldown <= 0) {
        const inst = bot.getActiveWeaponInstance();
        if (inst && inst.ammoInMag <= 0) {
          if (inst.reserveAmmo > 0) {
            bot.startReload();
          } else if (bot.activeSlot === 'primary' && bot.secondary) {
            bot.switchSlot('secondary');
          }
        } else if (weaponId !== 'knife' && weaponId !== 'c4') {
          // Check alignment before firing
          const look = bot.getLookDirection();
          const toTarget = targetPoint.clone().sub(bot.getEyePosition()).normalize();
          if (look.dot(toTarget) > 0.94) {
            // Slight human aim jitter so fights feel intense & fair
            const jitter = weaponId === 'awp' ? 0.24 : 0.34;
            const aimPoint = targetPoint.clone().add(
              new THREE.Vector3(
                (Math.random() - 0.5) * jitter,
                (Math.random() - 0.42) * jitter * 0.85,
                (Math.random() - 0.5) * jitter
              )
            );
            ctx.onBotFire(bot, aimPoint);
          }
        }
      }

      this.applyGravityAndMove(bot, dt);
      return;
    } else {
      this.lastTargetMap.set(bot.id, null);
    }

    // Reload when safe if mag < 40%
    const inst = bot.getActiveWeaponInstance();
    if (inst && !bot.reloading && inst.ammoInMag < WEAPONS[inst.id].magSize * 0.4 && inst.reserveAmmo > 0) {
      bot.startReload();
    }

    // 5. Objective-driven Navigation & Tactical Positioning
    const goal = this.chooseObjectiveGoal(bot, ctx);

    // Check if T carrier arrived in plant zone and can plant C4
    if (
      bot.team === 'T' &&
      bot.hasC4 &&
      ctx.bombState === 'carried' &&
      ctx.roundPhase === 'live'
    ) {
      const site = getPlantZoneAt(this.mapData, bot.pos.x, bot.pos.y, bot.pos.z);
      if (site) {
        bot.isPlanting = true;
        bot.plantProgress = 0;
        bot.switchSlot('c4');
        this.keypadTimerMap.set(bot.id, 0.15);
        bot.vel.x = 0;
        bot.vel.z = 0;
        this.applyGravityAndMove(bot, dt);
        return;
      }
    }

    // Check if CT reached planted C4 and should start defusing
    if (
      bot.team === 'CT' &&
      ctx.bombState === 'planted' &&
      bot.pos.distanceTo(ctx.bombPos) < 2.25
    ) {
      // Only one CT defuses at a time; others guard
      const anotherDefusing = ctx.combatants.some(
        (c) => c.alive && c.team === 'CT' && c.id !== bot.id && c.isDefusing
      );
      if (!anotherDefusing) {
        bot.isDefusing = true;
        bot.defuseProgress = 0;
        ctx.onBotDefuseStart(ctx.bombPos);
        bot.vel.x = 0;
        bot.vel.z = 0;
        this.applyGravityAndMove(bot, dt);
        return;
      }
    }

    // Navigate along A* path toward goal
    this.followPathTo(bot, goal, dt, activeCfg.moveSpeedMult);
    this.applyGravityAndMove(bot, dt);
  }

  private ensureCombatWeapon(bot: Combatant): void {
    if (bot.primary && (bot.primary.ammoInMag > 0 || bot.primary.reserveAmmo > 0)) {
      if (bot.activeSlot !== 'primary') bot.switchSlot('primary');
    } else if (bot.secondary && (bot.secondary.ammoInMag > 0 || bot.secondary.reserveAmmo > 0)) {
      if (bot.activeSlot !== 'secondary') bot.switchSlot('secondary');
    } else if (bot.activeSlot !== 'melee') {
      bot.switchSlot('melee');
    }
  }

  private chooseObjectiveGoal(bot: Combatant, ctx: BotWorldContext): { x: number; y: number; z: number } {
    const role = this.roleMap.get(bot.id) ?? 'mid';

    if (bot.team === 'T') {
      // 1. If bomb is planted, defend planted site!
      if (ctx.bombState === 'planted') {
        const tag = ctx.bombSite === 'A' ? 'a_site' : 'b_site';
        const spots = this.nav.getNodesByTag(tag);
        if (spots.length > 0) {
          const idx = Math.abs(this.hashId(bot.id)) % spots.length;
          return spots[idx];
        }
        return { x: ctx.bombPos.x, y: ctx.bombPos.y, z: ctx.bombPos.z };
      }

      // 2. If bomb is dropped on ground, nearest available T retrieves it
      if (ctx.bombState === 'dropped') {
        const nearestT = this.findClosestAliveTeamMember(ctx.combatants, 'T', ctx.bombPos);
        if (nearestT && nearestT.id === bot.id) {
          return { x: ctx.bombPos.x, y: ctx.bombPos.y, z: ctx.bombPos.z };
        }
      }

      // 3. C4 carrier goes straight to target bombsite plant zone
      if (bot.hasC4) {
        const plantNode = this.nav.getNode(ctx.tExecuteSite === 'A' ? 'a_site_plant' : 'b_site_plant');
        if (plantNode) return plantNode;
      }

      // 4. Escorts execute along their assigned Dust2 lane toward the target bombsite
      if (ctx.tExecuteSite === 'A') {
        if (role === 'a_long') return this.nav.getNode('a_site_goose')!;
        if (role === 'a_short') return this.nav.getNode('a_site_nw')!;
        return this.nav.getNode('a_site_s')!;
      } else {
        if (role === 'b_tun') return this.nav.getNode('b_site_plant')!;
        if (role === 'mid') return this.nav.getNode('b_site_e')!;
        return this.nav.getNode('b_site_back')!;
      }
    } else {
      // CT Team logic
      // 1. If bomb is planted, ALL surviving CTs rotate to planted site!
      if (ctx.bombState === 'planted') {
        const closestCT = this.findClosestAliveTeamMember(ctx.combatants, 'CT', ctx.bombPos);
        if (closestCT && closestCT.id === bot.id) {
          return { x: ctx.bombPos.x, y: ctx.bombPos.y, z: ctx.bombPos.z };
        }
        const tag = ctx.bombSite === 'A' ? 'a_site' : 'b_site';
        const spots = this.nav.getNodesByTag(tag);
        if (spots.length > 0) {
          const idx = Math.abs(this.hashId(bot.id)) % spots.length;
          return spots[idx];
        }
        return { x: ctx.bombPos.x, y: ctx.bombPos.y, z: ctx.bombPos.z };
      }

      // 2. Otherwise hold classic Dust2 defensive positions & patrol slightly
      let holdTimer = (this.holdTimerMap.get(bot.id) ?? 0) + 0.016;
      this.holdTimerMap.set(bot.id, holdTimer);
      const patrolToggle = Math.floor(holdTimer / 14) % 2 === 0;

      if (role === 'a_long') {
        return patrolToggle ? this.nav.getNode('a_long_n')! : this.nav.getNode('a_site_goose')!;
      }
      if (role === 'a_short') {
        return patrolToggle ? this.nav.getNode('cat_bridge')! : this.nav.getNode('a_site_nw')!;
      }
      if (role === 'mid') {
        return patrolToggle ? this.nav.getNode('ct_mid_s')! : this.nav.getNode('cat_mid')!;
      }
      // B defenders
      const altB = this.hashId(bot.id) % 2 === 0;
      if (altB) {
        return patrolToggle ? this.nav.getNode('b_site_back')! : this.nav.getNode('b_site_ne')!;
      }
      return patrolToggle ? this.nav.getNode('b_site_e')! : this.nav.getNode('ct_mid_w')!;
    }
  }

  private followPathTo(
    bot: Combatant,
    goal: { x: number; y: number; z: number },
    dt: number,
    moveSpeedMult: number
  ): void {
    const distToGoal = Math.hypot(goal.x - bot.pos.x, goal.z - bot.pos.z);
    if (distToGoal < 1.35 && Math.abs(goal.y - bot.pos.y) < 1.5) {
      // Reached defensive/tactical spot — hold position and scan
      bot.vel.x *= Math.max(0, 1 - dt * 10);
      bot.vel.z *= Math.max(0, 1 - dt * 10);
      // Gently sweep look angle to scan sightlines
      bot.yaw += Math.sin(performance.now() * 0.0007 + this.hashId(bot.id)) * 0.35 * dt;
      bot.pitch *= Math.max(0, 1 - dt * 6);
      return;
    }

    // Recompute A* path periodically or if missing
    let repathTimer = (this.repathTimerMap.get(bot.id) ?? 0) - dt;
    let path = this.pathMap.get(bot.id);
    if (!path || path.length === 0 || repathTimer <= 0) {
      path = this.nav.findPath(bot.pos, goal);
      this.pathMap.set(bot.id, path);
      this.pathIndexMap.set(bot.id, 0);
      this.repathTimerMap.set(bot.id, 1.4 + Math.random() * 0.8);
    } else {
      this.repathTimerMap.set(bot.id, repathTimer);
    }

    let idx = this.pathIndexMap.get(bot.id) ?? 0;
    while (idx < path.length - 1) {
      const wp = path[idx];
      if (Math.hypot(wp.x - bot.pos.x, wp.z - bot.pos.z) < 1.45 && Math.abs(wp.y - bot.pos.y) < 1.6) {
        idx++;
      } else {
        break;
      }
    }
    this.pathIndexMap.set(bot.id, idx);

    const wp = path[Math.min(idx, path.length - 1)];
    const dx = wp.x - bot.pos.x;
    const dz = wp.z - bot.pos.z;
    const dist = Math.hypot(dx, dz) || 1;
    let dirX = dx / dist;
    let dirZ = dz / dist;

    // Stuck detection & lateral recovery nudge
    const prevPos = this.lastPosMap.get(bot.id);
    if (prevPos) {
      const moved = Math.hypot(bot.pos.x - prevPos.x, bot.pos.z - prevPos.z);
      if (moved < 0.015) {
        const stuck = (this.stuckTimerMap.get(bot.id) ?? 0) + dt;
        this.stuckTimerMap.set(bot.id, stuck);
        if (stuck > 0.45) {
          // Strafe sideways to clear corner & force repath
          const side = this.strafeDirMap.get(bot.id) ?? 1;
          dirX = dirX * 0.35 - dirZ * side * 0.9;
          dirZ = dirZ * 0.35 + dirX * side * 0.9;
          if (stuck > 1.1) {
            this.strafeDirMap.set(bot.id, -side);
            this.repathTimerMap.set(bot.id, 0);
            this.stuckTimerMap.set(bot.id, 0);
            if (bot.grounded) bot.vel.y = PHYSICS.JUMP_SPEED * 0.75;
          }
        }
      } else {
        this.stuckTimerMap.set(bot.id, 0);
      }
    }
    this.lastPosMap.set(bot.id, bot.pos.clone());

    const speed = PHYSICS.BASE_MOVE_SPEED * moveSpeedMult * 0.88;
    bot.vel.x = dirX * speed;
    bot.vel.z = dirZ * speed;

    // Face direction of movement smoothly
    const desiredYaw = Math.atan2(-dirX, -dirZ);
    bot.yaw = this.lerpAngle(bot.yaw, desiredYaw, Math.min(1, dt * 8.5));
    bot.pitch *= Math.max(0, 1 - dt * 8);
  }

  private findVisibleEnemy(bot: Combatant, combatants: Combatant[], now: number): Combatant | null {
    const eye = bot.getEyePosition();
    const forward = bot.getLookDirection();
    let best: Combatant | null = null;
    let bestDist = 68; // Max sight range in Dust2

    for (const other of combatants) {
      if (!other.alive || other.team === bot.team) continue;

      const targetChest = other.pos.clone();
      targetChest.y += 1.25;
      const toEnemy = targetChest.clone().sub(eye);
      const dist = toEnemy.length();
      if (dist > bestDist) continue;

      const dir = toEnemy.clone().divideScalar(dist);
      const dot = forward.dot(dir);

      // 120-deg forward vision cone OR 360-deg close awareness (< 11m)
      if (dot < 0.35 && dist > 11.5) continue;

      // Strict raycast LOS against Dust2 solid walls/boxes/ramps
      if (this.physics.hasLineOfSight(eye, targetChest)) {
        other.lastSpottedTime = now;
        bestDist = dist;
        best = other;
      }
    }
    return best;
  }

  private findClosestAliveTeamMember(
    combatants: Combatant[],
    team: Team,
    pos: THREE.Vector3
  ): Combatant | null {
    let best: Combatant | null = null;
    let bestD = Infinity;
    for (const c of combatants) {
      if (!c.alive || c.team !== team) continue;
      const d = c.pos.distanceTo(pos);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    return best;
  }

  private aimAtPoint(bot: Combatant, target: THREE.Vector3, dt: number, turnSpeed: number): void {
    const eye = bot.getEyePosition();
    const dx = target.x - eye.x;
    const dy = target.y - eye.y;
    const dz = target.z - eye.z;
    const horiz = Math.hypot(dx, dz) || 0.001;

    const desiredYaw = Math.atan2(-dx, -dz);
    const desiredPitch = Math.max(-1.2, Math.min(1.2, Math.atan2(dy, horiz)));

    bot.yaw = this.lerpAngle(bot.yaw, desiredYaw, Math.min(1, dt * turnSpeed));
    bot.pitch += (desiredPitch - bot.pitch) * Math.min(1, dt * turnSpeed);
  }

  private applyGravityAndMove(bot: Combatant, dt: number): void {
    bot.vel.y -= PHYSICS.GRAVITY * dt;
    const h = bot.crouching ? PHYSICS.PLAYER_CROUCH_HEIGHT : PHYSICS.PLAYER_HEIGHT;
    const res = this.physics.moveCharacter(bot.pos, bot.vel, dt, h);
    bot.grounded = res.grounded;
  }

  private lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return a + diff * t;
  }

  private hashId(id: string): number {
    let h = 0;
    for (let i = 0; i < id.length; i++) {
      h = (h * 31 + id.charCodeAt(i)) | 0;
    }
    return h;
  }
}
