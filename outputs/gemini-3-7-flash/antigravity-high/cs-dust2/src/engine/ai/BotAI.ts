import * as THREE from 'three';
import { HumanoidCharacter } from '../character/HumanoidCharacter';
import { Dust2Map, Waypoint } from '../map/Dust2Map';
import { CollisionSystem } from '../physics/CollisionSystem';
import { WeaponId, WEAPON_REGISTRY } from '../weapon/WeaponTypes';

export type BotState = 'PATROL' | 'ENGAGE' | 'PLANTING' | 'DEFUSING' | 'RETAKE' | 'DEFEND_BOMB';

export interface BotEntity {
  id: string;
  name: string;
  team: 'CT' | 'T';
  isPlayer: boolean;
  character: HumanoidCharacter;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotationY: number;
  pitch: number;
  health: number;
  armor: number;
  hasHelmet: boolean;
  hasDefuseKit: boolean;
  hasC4: boolean;
  money: number;
  kills: number;
  deaths: number;
  assists: number;
  damageDealt: number;
  score: number;
  primaryWeapon: WeaponId | null;
  secondaryWeapon: WeaponId;
  currentWeapon: WeaponId;
  ammo: Record<WeaponId, { clip: number; reserve: number }>;

  // AI Brain properties
  state: BotState;
  targetWaypointId: number | null;
  path: number[];
  targetEnemy: BotEntity | null;
  reactionTimer: number;
  fireCooldown: number;
  burstCount: number;
  burstPauseTimer: number;
  strafeDir: number;
  strafeTimer: number;
  plantDefuseTimer: number;
}

export class BotAIManager {
  private map: Dust2Map;
  private collision: CollisionSystem;

  constructor(map: Dust2Map, collision: CollisionSystem) {
    this.map = map;
    this.collision = collision;
  }

  /**
   * A* Pathfinding on Dust2 tactical waypoint graph
   */
  public findPath(startPos: THREE.Vector3, targetPos: THREE.Vector3): number[] {
    const nearestStart = this.getNearestWaypoint(startPos);
    const nearestTarget = this.getNearestWaypoint(targetPos);

    if (nearestStart === nearestTarget) return [nearestTarget];

    const openSet: number[] = [nearestStart];
    const cameFrom: Map<number, number> = new Map();
    const gScore: Map<number, number> = new Map();
    const fScore: Map<number, number> = new Map();

    this.map.waypoints.forEach(wp => {
      gScore.set(wp.id, Infinity);
      fScore.set(wp.id, Infinity);
    });

    gScore.set(nearestStart, 0);
    const startWp = this.map.waypoints[nearestStart];
    const endWp = this.map.waypoints[nearestTarget];
    fScore.set(nearestStart, startWp.pos.distanceTo(endWp.pos));

    while (openSet.length > 0) {
      // Find lowest fScore in openSet
      let current = openSet[0];
      let lowestF = fScore.get(current) ?? Infinity;
      for (const node of openSet) {
        const f = fScore.get(node) ?? Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = node;
        }
      }

      if (current === nearestTarget) {
        // Reconstruct path
        const path = [current];
        let curr = current;
        while (cameFrom.has(curr)) {
          curr = cameFrom.get(curr)!;
          path.unshift(curr);
        }
        return path;
      }

      openSet.splice(openSet.indexOf(current), 1);
      const currWp = this.map.waypoints[current];

      for (const neighborId of currWp.connections) {
        const neighborWp = this.map.waypoints[neighborId];
        const tentativeG = (gScore.get(current) ?? Infinity) + currWp.pos.distanceTo(neighborWp.pos);

        if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
          cameFrom.set(neighborId, current);
          gScore.set(neighborId, tentativeG);
          fScore.set(neighborId, tentativeG + neighborWp.pos.distanceTo(endWp.pos));

          if (!openSet.includes(neighborId)) {
            openSet.push(neighborId);
          }
        }
      }
    }

    return [nearestTarget];
  }

  private getNearestWaypoint(pos: THREE.Vector3): number {
    let nearestId = 0;
    let minDist = Infinity;

    this.map.waypoints.forEach(wp => {
      const d = wp.pos.distanceTo(pos);
      if (d < minDist) {
        minDist = d;
        nearestId = wp.id;
      }
    });

    return nearestId;
  }

  /**
   * Main Bot AI update tick (perception, pathing, combat, bomb interactions)
   */
  public updateBot(
    bot: BotEntity,
    allPlayers: BotEntity[],
    c4State: { isPlanted: boolean; position: THREE.Vector3 | null; plantedSite: 'A' | 'B' | null },
    delta: number,
    onBotFire: (bot: BotEntity, targetHit: boolean) => void,
    onStartPlant: (bot: BotEntity) => void,
    onCompletePlant: (bot: BotEntity) => void,
    onStartDefuse: (bot: BotEntity) => void,
    onCompleteDefuse: (bot: BotEntity) => void
  ) {
    if (bot.health <= 0 || bot.isPlayer) return;

    // 1. PERCEPTION: Vision Scan for Enemies
    const enemies = allPlayers.filter(p => p.team !== bot.team && p.health > 0);
    let visibleEnemy: BotEntity | null = null;
    let closestEnemyDist = Infinity;

    const botEyePos = bot.position.clone().add(new THREE.Vector3(0, 1.6, 0));
    const forward = new THREE.Vector3(Math.sin(bot.rotationY), 0, Math.cos(bot.rotationY));

    for (const enemy of enemies) {
      const enemyEyePos = enemy.position.clone().add(new THREE.Vector3(0, 1.5, 0));
      const dirToEnemy = enemyEyePos.clone().sub(botEyePos);
      const dist = dirToEnemy.length();

      if (dist < 80) {
        dirToEnemy.normalize();
        const angle = forward.angleTo(dirToEnemy);

        // Vision cone: 110 degrees (or 360 degrees if very close / heard footstep)
        if (angle < Math.PI * 0.4 || dist < 6) {
          // Raycast Line of Sight
          if (this.collision.hasLineOfSight(botEyePos, enemyEyePos)) {
            if (dist < closestEnemyDist) {
              closestEnemyDist = dist;
              visibleEnemy = enemy;
            }
          }
        }
      }
    }

    // 2. COMBAT STATE HANDLING
    if (visibleEnemy) {
      bot.targetEnemy = visibleEnemy;
      bot.state = 'ENGAGE';

      // Turn towards enemy
      const toEnemy = visibleEnemy.position.clone().sub(bot.position);
      const targetAngle = Math.atan2(toEnemy.x, toEnemy.z);
      bot.rotationY = THREE.MathUtils.lerp(bot.rotationY, targetAngle, delta * 10);

      // Pitch aim towards enemy chest/head
      const dy = (visibleEnemy.position.y + 1.4) - (bot.position.y + 1.5);
      const planarDist = Math.hypot(toEnemy.x, toEnemy.z);
      bot.pitch = Math.atan2(dy, planarDist);

      // Reaction delay before opening fire
      if (bot.reactionTimer > 0) {
        bot.reactionTimer -= delta;
      } else {
        // Combat strafing behavior
        bot.strafeTimer -= delta;
        if (bot.strafeTimer <= 0) {
          bot.strafeDir = (Math.random() > 0.5 ? 1 : -1);
          bot.strafeTimer = 0.8 + Math.random() * 0.8;
        }

        // Apply strafe movement
        const strafeVec = new THREE.Vector3(Math.cos(bot.rotationY), 0, -Math.sin(bot.rotationY)).multiplyScalar(bot.strafeDir * 2.2);
        bot.velocity.x = strafeVec.x;
        bot.velocity.z = strafeVec.z;

        // Firing Logic
        const currentWeaponDef = WEAPON_REGISTRY[bot.currentWeapon];
        if (bot.fireCooldown > 0) {
          bot.fireCooldown -= delta;
        } else if (bot.burstPauseTimer > 0) {
          bot.burstPauseTimer -= delta;
        } else {
          // Check ammo
          const ammoInfo = bot.ammo[bot.currentWeapon];
          if (ammoInfo && ammoInfo.clip > 0) {
            ammoInfo.clip--;
            bot.fireCooldown = currentWeaponDef.fireRate;
            bot.burstCount++;

            // Hit chance calculation based on distance and recoil
            const hitChance = Math.max(0.35, 0.85 - (closestEnemyDist / 50));
            const isHit = Math.random() < hitChance;
            onBotFire(bot, isHit);

            // Pause after 3-4 round burst to simulate realistic recoil control
            if (currentWeaponDef.isAutomatic && bot.burstCount >= 3) {
              bot.burstCount = 0;
              bot.burstPauseTimer = 0.35 + Math.random() * 0.25;
            }
          } else if (ammoInfo && ammoInfo.reserve > 0) {
            // Auto reload
            ammoInfo.clip = Math.min(currentWeaponDef.magazineSize, ammoInfo.reserve);
            ammoInfo.reserve -= ammoInfo.clip;
            bot.fireCooldown = currentWeaponDef.reloadTime;
          }
        }
      }
    } else {
      bot.targetEnemy = null;
      bot.reactionTimer = 0.25 + Math.random() * 0.2;
      bot.burstCount = 0;

      // 3. OBJECTIVE & STRATEGY STATE MACHINE
      if (c4State.isPlanted) {
        if (bot.team === 'CT') {
          // CT Objective: Retake & Defuse Bomb!
          bot.state = 'RETAKE';
          if (c4State.position) {
            const distToC4 = bot.position.distanceTo(c4State.position);
            if (distToC4 < 2.2) {
              // Start / Hold Defusal
              bot.state = 'DEFUSING';
              bot.plantDefuseTimer += delta;
              const defuseGoal = bot.hasDefuseKit ? 5.0 : 10.0;
              onStartDefuse(bot);
              if (bot.plantDefuseTimer >= defuseGoal) {
                onCompleteDefuse(bot);
              }
              bot.velocity.set(0, 0, 0);
              return;
            } else {
              // Move directly to C4
              if (bot.path.length === 0) {
                bot.path = this.findPath(bot.position, c4State.position);
              }
            }
          }
        } else {
          // T Objective: Defend Planted Bomb!
          bot.state = 'DEFEND_BOMB';
        }
      } else {
        // Bomb Not Planted Yet:
        if (bot.team === 'T' && bot.hasC4) {
          // T Bomb Carrier: Move to A or B site to plant!
          const targetSite = this.map.plantZones[0]; // A Site or B Site
          const distToSite = bot.position.distanceTo(targetSite.center);

          if (distToSite < 6.0) {
            // Plant C4!
            bot.state = 'PLANTING';
            bot.plantDefuseTimer += delta;
            onStartPlant(bot);
            if (bot.plantDefuseTimer >= 3.2) {
              onCompletePlant(bot);
            }
            bot.velocity.set(0, 0, 0);
            return;
          } else {
            bot.state = 'PATROL';
            if (bot.path.length === 0) {
              bot.path = this.findPath(bot.position, targetSite.center);
            }
          }
        } else {
          bot.state = 'PATROL';
          if (bot.path.length === 0) {
            // Select tactical waypoint to push / hold
            const targetWp = this.selectTacticalWaypoint(bot);
            bot.path = this.findPath(bot.position, targetWp.pos);
          }
        }
      }

      // 4. WAYPOINT NAVIGATION & MOVEMENT
      if (bot.path.length > 0) {
        const nextWpId = bot.path[0];
        const nextWp = this.map.waypoints[nextWpId];
        const distToWp = Math.hypot(nextWp.pos.x - bot.position.x, nextWp.pos.z - bot.position.z);

        if (distToWp < 1.8) {
          bot.path.shift(); // Reached waypoint, advance to next
        } else {
          const moveDir = nextWp.pos.clone().sub(bot.position);
          moveDir.y = 0;
          moveDir.normalize();

          const targetAngle = Math.atan2(moveDir.x, moveDir.z);
          bot.rotationY = THREE.MathUtils.lerp(bot.rotationY, targetAngle, delta * 6);

          const moveSpeed = 4.2; // Tactical run speed
          bot.velocity.x = moveDir.x * moveSpeed;
          bot.velocity.z = moveDir.z * moveSpeed;
        }
      }
    }

    // 5. PHYSICAL COLLISION & STEPPING
    const moveRes = this.collision.moveEntity(bot.position, bot.velocity, delta, 0.35, 1.8);
    bot.position.copy(moveRes.pos);
    bot.velocity.copy(moveRes.velocity);

    // 6. UPDATE 3D HUMAN BODY RIG ANIMATIONS
    const isMoving = Math.hypot(bot.velocity.x, bot.velocity.z) > 0.4;
    const speed = Math.hypot(bot.velocity.x, bot.velocity.z);

    bot.character.group.position.copy(bot.position);
    bot.character.group.rotation.y = bot.rotationY;
    bot.character.update(delta, isMoving, speed, bot.pitch);
  }

  private selectTacticalWaypoint(bot: BotEntity): Waypoint {
    if (bot.team === 'T') {
      // Ts push towards Bombsite A (id: 15) or B (id: 23)
      const targetId = Math.random() > 0.5 ? 15 : 23;
      return this.map.waypoints[targetId];
    } else {
      // CTs defend A (id: 15), B (id: 23), or Mid (id: 26)
      const targets = [15, 17, 23, 24, 26];
      const targetId = targets[Math.floor(Math.random() * targets.length)];
      return this.map.waypoints[targetId];
    }
  }
}
