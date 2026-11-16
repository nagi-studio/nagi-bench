import * as THREE from 'three';
import { Soldier, Team, WeaponId, HitboxZone } from '../types';
import { Dust2Map, BOMB_SITES } from './Dust2Map';
import { WEAPON_SPECS, SoundManager, WeaponFXManager } from './WeaponSystem';

export class BotAIManager {
  private scene: THREE.Scene;
  private map: Dust2Map;
  private fxManager: WeaponFXManager;

  constructor(scene: THREE.Scene, map: Dust2Map, fxManager: WeaponFXManager) {
    this.scene = scene;
    this.map = map;
    this.fxManager = fxManager;
  }

  public createSoldier(
    team: Team,
    name: string,
    spawnX: number,
    spawnZ: number,
    isHuman = false,
    weaponId: WeaponId = team === 'CT' ? 'm4a4' : 'ak47'
  ): Soldier {
    const root = new THREE.Group();
    root.position.set(spawnX, 0, spawnZ);
    this.scene.add(root);

    const isCT = team === 'CT';
    const uniformMat = new THREE.MeshLambertMaterial({
      color: isCT ? 0x1d4ed8 : 0xd97706
    });
    const vestMat = new THREE.MeshLambertMaterial({
      color: isCT ? 0x0f172a : 0x451a03
    });
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xfdba74 });
    const gunMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });

    const hitboxes: THREE.Mesh[] = [];

    const addPart = (
      geom: THREE.BufferGeometry,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number,
      zone: HitboxZone,
      mult: number
    ): THREE.Mesh => {
      const m = new THREE.Mesh(geom, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.userData = { zone, mult };
      root.add(m);
      hitboxes.push(m);
      return m;
    };

    // Head (2.0x Headshot multiplier) & Helmet
    addPart(new THREE.BoxGeometry(0.42, 0.44, 0.42), skinMat, 0, 1.66, 0, 'head', 2.0);
    addPart(new THREE.BoxGeometry(0.46, 0.22, 0.46), vestMat, 0, 1.82, 0, 'head', 2.0);

    // Torso: Chest (1.0x) & Abdomen (0.95x)
    addPart(new THREE.BoxGeometry(0.58, 0.46, 0.32), vestMat, 0, 1.22, 0, 'chest', 1.0);
    addPart(new THREE.BoxGeometry(0.52, 0.34, 0.28), uniformMat, 0, 0.82, 0, 'abdomen', 0.95);

    // Articulated Arms (0.75x)
    const leftArm = addPart(new THREE.BoxGeometry(0.18, 0.56, 0.18), uniformMat, -0.38, 1.20, -0.18, 'arms', 0.75);
    leftArm.rotation.x = Math.PI / 3;
    const rightArm = addPart(new THREE.BoxGeometry(0.18, 0.56, 0.18), uniformMat, 0.38, 1.20, -0.18, 'arms', 0.75);
    rightArm.rotation.x = Math.PI / 3;

    // Handheld Gun
    const heldGun = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 0.78), gunMat);
    heldGun.position.set(0.24, 1.18, -0.48);
    root.add(heldGun);

    // Articulated Legs (0.75x)
    const leftLeg = addPart(new THREE.BoxGeometry(0.22, 0.68, 0.24), uniformMat, -0.16, 0.34, 0, 'legs', 0.75);
    const rightLeg = addPart(new THREE.BoxGeometry(0.22, 0.68, 0.24), uniformMat, 0.16, 0.34, 0, 'legs', 0.75);

    const spec = WEAPON_SPECS[weaponId];

    const soldier: Soldier = {
      id: `${team}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      team,
      isHuman,
      alive: true,
      hp: 100,
      armor: 100,
      pos: new THREE.Vector3(spawnX, 0, spawnZ),
      velY: 0,
      yaw: isCT ? Math.PI : 0,
      pitch: 0,
      root,
      leftLeg,
      rightLeg,
      heldGun,
      hitboxes,
      weaponId,
      mag: spec.magSize,
      reserve: spec.reserve,
      fireCooldown: 0,
      reloadTimer: 0,
      hasC4: false,
      route: [],
      waypointIdx: 0,
      strafeTimer: 0,
      strafeDir: 1,
      state: 'patrol',
      target: null,
      reactionTimer: 0
    };

    hitboxes.forEach((hb) => {
      hb.userData.owner = soldier;
    });

    return soldier;
  }

  public updateBot(
    bot: Soldier,
    dt: number,
    allSoldiers: Soldier[],
    c4Status: string,
    c4Pos: THREE.Vector3 | null,
    onBotFire: (shooter: Soldier, targetPos: THREE.Vector3) => void
  ): void {
    if (!bot.alive || bot.isHuman) return;

    // Cooldown timers
    if (bot.fireCooldown > 0) bot.fireCooldown -= dt;
    if (bot.reloadTimer > 0) {
      bot.reloadTimer -= dt;
      if (bot.reloadTimer <= 0) {
        const spec = WEAPON_SPECS[bot.weaponId];
        const needed = spec.magSize - bot.mag;
        const taken = Math.min(needed, bot.reserve);
        bot.mag += taken;
        bot.reserve -= taken;
      }
    }

    // 1. Sight detection & Target acquisition
    let bestTarget: Soldier | null = null;
    let closestDist = Infinity;

    for (const other of allSoldiers) {
      if (other.alive && other.team !== bot.team) {
        const d = bot.pos.distanceTo(other.pos);
        if (d < 50 && this.map.hasLineOfSight(bot.pos, other.pos)) {
          if (d < closestDist) {
            closestDist = d;
            bestTarget = other;
          }
        }
      }
    }

    bot.target = bestTarget;

    // 2. State decisions
    if (bestTarget) {
      bot.state = 'combat';
    } else if (bot.team === 'CT' && c4Status === 'planted' && c4Pos) {
      bot.state = 'defuse';
    } else if (bot.team === 'T' && bot.hasC4 && c4Status === 'carried') {
      const site = this.map.getBombSiteAt(bot.pos);
      if (site) {
        bot.state = 'plant';
      } else {
        bot.state = 'patrol';
      }
    } else {
      bot.state = 'patrol';
    }

    // 3. State execution
    if (bot.state === 'combat' && bot.target) {
      // Aim at target
      const dx = bot.target.pos.x - bot.pos.x;
      const dz = bot.target.pos.z - bot.pos.z;
      const targetYaw = Math.atan2(-dx, -dz);
      bot.yaw = targetYaw;

      // Strafe slightly while in combat
      bot.strafeTimer -= dt;
      if (bot.strafeTimer <= 0) {
        bot.strafeDir *= -1;
        bot.strafeTimer = 0.8 + Math.random() * 0.8;
      }

      const strafeSpeed = 2.2;
      const moveX = Math.cos(bot.yaw) * bot.strafeDir * strafeSpeed * dt;
      const moveZ = -Math.sin(bot.yaw) * bot.strafeDir * strafeSpeed * dt;

      if (!this.map.checkWallCollision(bot.pos.x + moveX, bot.pos.z, 0.45)) {
        bot.pos.x += moveX;
      }
      if (!this.map.checkWallCollision(bot.pos.x, bot.pos.z + moveZ, 0.45)) {
        bot.pos.z += moveZ;
      }

      // Check weapon reload
      if (bot.mag <= 0 && bot.reserve > 0 && bot.reloadTimer <= 0) {
        const spec = WEAPON_SPECS[bot.weaponId];
        bot.reloadTimer = spec.reloadTime;
      }

      // Fire weapon with humanized reaction delay and burst rhythm
      if (bot.fireCooldown <= 0 && bot.reloadTimer <= 0 && bot.mag > 0) {
        const spec = WEAPON_SPECS[bot.weaponId];
        bot.fireCooldown = spec.fireInterval + (Math.random() * 0.08);

        // Aim towards target center with slight spread
        const targetPos = new THREE.Vector3(
          bot.target.pos.x + (Math.random() - 0.5) * 0.4,
          1.4 + (Math.random() - 0.5) * 0.3,
          bot.target.pos.z + (Math.random() - 0.5) * 0.4
        );

        onBotFire(bot, targetPos);
      }

    } else if (bot.state === 'defuse' && c4Pos) {
      // Navigate towards planted C4
      const dx = c4Pos.x - bot.pos.x;
      const dz = c4Pos.z - bot.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 1.8) {
        bot.yaw = Math.atan2(-dx, -dz);
        const speed = 4.2;
        const stepX = -Math.sin(bot.yaw) * speed * dt;
        const stepZ = -Math.cos(bot.yaw) * speed * dt;
        if (!this.map.checkWallCollision(bot.pos.x + stepX, bot.pos.z, 0.45)) bot.pos.x += stepX;
        if (!this.map.checkWallCollision(bot.pos.x, bot.pos.z + stepZ, 0.45)) bot.pos.z += stepZ;
      }

    } else if (bot.state === 'patrol' && bot.route.length > 0) {
      // Follow tactical waypoint route
      const wp = bot.route[bot.waypointIdx];
      const dx = wp[0] - bot.pos.x;
      const dz = wp[1] - bot.pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 2.0) {
        bot.waypointIdx = Math.min(bot.route.length - 1, bot.waypointIdx + 1);
      }

      bot.yaw = Math.atan2(-dx, -dz);
      const speed = 3.8;
      const stepX = -Math.sin(bot.yaw) * speed * dt;
      const stepZ = -Math.cos(bot.yaw) * speed * dt;
      if (!this.map.checkWallCollision(bot.pos.x + stepX, bot.pos.z, 0.45)) bot.pos.x += stepX;
      if (!this.map.checkWallCollision(bot.pos.x, bot.pos.z + stepZ, 0.45)) bot.pos.z += stepZ;
    }

    // Update 3D mesh transform & leg oscillation animation
    bot.root.position.set(bot.pos.x, bot.pos.y, bot.pos.z);
    bot.root.rotation.y = bot.yaw;

    const moving = bot.state !== 'plant' && bot.state !== 'combat';
    if (moving) {
      const legAngle = Math.sin(Date.now() * 0.009) * 0.45;
      bot.leftLeg.rotation.x = legAngle;
      bot.rightLeg.rotation.x = -legAngle;
    } else {
      bot.leftLeg.rotation.x = 0;
      bot.rightLeg.rotation.x = 0;
    }
  }

  public damageSoldier(
    attacker: Soldier,
    victim: Soldier,
    baseDmg: number,
    armorPen: number,
    zone: HitboxZone,
    mult: number,
    weaponName: string,
    onKill: (attacker: Soldier, victim: Soldier, weaponName: string, isHeadshot: boolean) => void
  ): boolean {
    if (!victim.alive || attacker.team === victim.team) return false;

    let dmg = baseDmg * mult;
    if (victim.armor > 0 && zone !== 'legs') {
      const absorbed = dmg * (1 - armorPen) * 0.5;
      victim.armor = Math.max(0, Math.round(victim.armor - absorbed));
      dmg *= armorPen;
    }

    victim.hp = Math.max(0, Math.round(victim.hp - dmg));

    // Impact FX
    const impactPos = victim.pos.clone().add(new THREE.Vector3(0, 1.2, 0));
    this.fxManager.createImpactSparks(impactPos, true);

    if (attacker.isHuman) {
      SoundManager.play(zone === 'head' ? 'headshot' : 'hit');
    }

    if (victim.hp <= 0) {
      victim.alive = false;
      // Death animation: collapse to ground
      victim.root.rotation.x = -Math.PI / 2;
      victim.root.position.y = 0.22;
      onKill(attacker, victim, weaponName, zone === 'head');
      return true;
    }

    return false;
  }
}
