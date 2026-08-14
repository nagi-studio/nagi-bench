import * as THREE from 'three';
import { CharacterState, Team, WeaponId } from '../types/game';
import { HumanoidModel } from '../entities/HumanoidModel';
import { NavGraph } from '../navigation/NavGraph';
import { Dust2Map } from '../map/Dust2Map';
import { WEAPON_CONFIGS } from '../weapons/WeaponConfig';
import { soundManager } from '../audio/SoundManager';

export type BotRole = 'carrier' | 'entry' | 'support' | 'anchor' | 'lurker';
export type BotState = 'patrol' | 'rush_site' | 'hold_angle' | 'plant_bomb' | 'defuse_bomb' | 'engage' | 'retake_site';

export class BotController {
  public state: CharacterState;
  public model: HumanoidModel;
  public navGraph: NavGraph;
  public map: Dust2Map;

  public role: BotRole = 'entry';
  public botState: BotState = 'patrol';
  public targetSite: 'A' | 'B' = 'A';

  // Navigation
  public path: THREE.Vector3[] = [];
  public currentPathIndex = 0;
  public moveSpeed = 4.8; // m/s
  public targetLookDir = new THREE.Vector3();

  // Combat & Perception
  public targetEnemy: CharacterState | null = null;
  public reactionTimer = 0;
  public shootCooldown = 0;
  public burstCount = 0;
  public burstMax = 4;
  public burstPauseTimer = 0;
  public aimInaccuracy = new THREE.Vector3();

  // Plant / Defuse timers
  public actionTimer = 0;

  constructor(
    id: string,
    name: string,
    team: Team,
    pos: THREE.Vector3,
    navGraph: NavGraph,
    map: Dust2Map
  ) {
    this.navGraph = navGraph;
    this.map = map;

    this.state = {
      id,
      name,
      team,
      isPlayer: false,
      isAlive: true,
      health: 100,
      maxHealth: 100,
      armor: 100,
      hasHelmet: true,
      hasDefuseKit: team === 'CT',
      position: pos.clone(),
      velocity: new THREE.Vector3(),
      rotation: { yaw: 0, pitch: 0 },
      isGrounded: true,
      isCrouching: false,
      isPlanting: false,
      isDefusing: false,
      isReloading: false,
      isScoped: false,
      currentWeapon: team === 'T' ? 'ak47' : 'm4a4',
      inventory: {
        primary: team === 'T' ? 'ak47' : 'm4a4',
        secondary: team === 'T' ? 'glock' : 'usp',
        knife: 'knife',
        c4: false,
        currentSlot: 'primary',
        ammo: {
          ak47: { current: 30, reserve: 90 },
          m4a4: { current: 30, reserve: 90 },
          awp: { current: 5, reserve: 30 },
          deagle: { current: 7, reserve: 35 },
          glock: { current: 20, reserve: 120 },
          usp: { current: 12, reserve: 24 },
          knife: { current: 1, reserve: 1 },
          c4: { current: 1, reserve: 1 },
        },
      },
      kills: 0,
      deaths: 0,
      assists: 0,
      score: 0,
      ping: Math.floor(15 + Math.random() * 35),
    };

    this.model = new HumanoidModel(team, false);
    this.model.root.position.copy(pos);
    this.model.setWeapon(this.state.currentWeapon);
  }

  // Setup round strategy for bot
  public initRoundStrategy(isPistolRound: boolean, isCarrier: boolean, chosenSite: 'A' | 'B') {
    this.state.isAlive = true;
    this.state.health = 100;
    this.state.armor = isPistolRound ? 0 : 100;
    this.state.hasHelmet = !isPistolRound;
    this.state.isPlanting = false;
    this.state.isDefusing = false;
    this.state.isReloading = false;
    this.targetEnemy = null;
    this.reactionTimer = 0;
    this.shootCooldown = 0;

    if (isPistolRound) {
      this.state.inventory.primary = null;
      this.state.inventory.currentSlot = 'secondary';
      this.state.currentWeapon = this.state.team === 'T' ? 'glock' : 'usp';
    } else {
      if (Math.random() < 0.25) {
        this.state.inventory.primary = 'awp';
        this.state.currentWeapon = 'awp';
      } else {
        this.state.inventory.primary = this.state.team === 'T' ? 'ak47' : 'm4a4';
        this.state.currentWeapon = this.state.team === 'T' ? 'ak47' : 'm4a4';
      }
      this.state.inventory.currentSlot = 'primary';
    }

    // Reset ammo
    const w = this.state.currentWeapon;
    const config = WEAPON_CONFIGS[w];
    this.state.inventory.ammo[w] = { current: config.magSize, reserve: config.maxReserve };

    this.model.reset();
    this.model.setWeapon(this.state.currentWeapon);

    this.targetSite = chosenSite;
    this.state.inventory.c4 = isCarrier;

    if (this.state.team === 'T') {
      if (isCarrier) {
        this.role = 'carrier';
        this.botState = 'rush_site';
        this.planPathToSite(this.targetSite);
      } else {
        this.role = Math.random() < 0.6 ? 'entry' : 'support';
        this.botState = 'rush_site';
        this.planPathToSite(this.targetSite);
      }
    } else {
      // CT Defense setup
      this.role = 'anchor';
      this.botState = 'hold_angle';
      this.planCTDefensePath();
    }
  }

  // Plan path to target bomb site
  public planPathToSite(site: 'A' | 'B') {
    const siteNodeId = site === 'A' ? 'A_SITE_DEFAULT' : 'B_SITE_DEFAULT';
    const targetWp = this.navGraph.waypoints.get(siteNodeId);
    if (targetWp) {
      this.path = this.navGraph.findPath(this.state.position, targetWp.position);
      this.currentPathIndex = 0;
    }
  }

  // Plan CT initial defensive positions
  private planCTDefensePath() {
    const defenseNodes = ['A_SITE_DEFAULT', 'A_SITE_GOOSE', 'MID_DOORS_CT_SIDE', 'B_SITE_DEFAULT', 'B_SITE_BACK_PLAT'];
    const chosenNodeId = defenseNodes[Math.floor(Math.random() * defenseNodes.length)];
    const targetWp = this.navGraph.waypoints.get(chosenNodeId);
    if (targetWp) {
      this.path = this.navGraph.findPath(this.state.position, targetWp.position);
      this.currentPathIndex = 0;
    }
  }

  // Update perception: check for visible enemies
  public updatePerception(allEntities: CharacterState[]) {
    if (!this.state.isAlive) return;

    let closestEnemy: CharacterState | null = null;
    let closestDist = Infinity;

    const myEyePos = this.state.position.clone().add(new THREE.Vector3(0, 1.65, 0));
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.state.rotation.yaw);

    for (const other of allEntities) {
      if (other.id === this.state.id || !other.isAlive || other.team === this.state.team) {
        continue;
      }

      const enemyPos = other.position.clone().add(new THREE.Vector3(0, 1.4, 0));
      const dist = myEyePos.distanceTo(enemyPos);
      if (dist > 75) continue; // max vision range

      // Check FOV cone (~120 degrees)
      const toEnemy = enemyPos.clone().sub(myEyePos).normalize();
      const dot = forward.dot(toEnemy);

      // If in front (dot > 0.35) or very close (dist < 5m)
      if (dot > 0.35 || dist < 6) {
        // Raycast against map walls
        const hit = this.map.raycast(myEyePos, toEnemy, dist);
        if (!hit || hit.distance >= dist - 0.5) {
          // Line of sight clear!
          if (dist < closestDist) {
            closestDist = dist;
            closestEnemy = other;
          }
        }
      }
    }

    if (closestEnemy) {
      if (this.targetEnemy?.id !== closestEnemy.id) {
        this.targetEnemy = closestEnemy;
        this.reactionTimer = 0.25 + Math.random() * 0.15; // 250-400ms human reaction time
      }
    } else {
      this.targetEnemy = null;
    }
  }

  // Bot logic tick
  public update(
    dt: number,
    allEntities: CharacterState[],
    roundBombPlanted: boolean,
    bombPosition: THREE.Vector3 | null,
    onFireBullet: (
      shooter: CharacterState,
      origin: THREE.Vector3,
      dir: THREE.Vector3,
      weaponId: WeaponId
    ) => void
  ) {
    if (!this.state.isAlive) return;

    // Update perception
    this.updatePerception(allEntities);

    // React to bomb planted for CT
    if (roundBombPlanted && this.state.team === 'CT' && this.botState !== 'defuse_bomb' && this.botState !== 'engage') {
      if (bombPosition) {
        this.botState = 'retake_site';
        this.path = this.navGraph.findPath(this.state.position, bombPosition);
        this.currentPathIndex = 0;
      }
    }

    // State Execution
    if (this.targetEnemy && this.targetEnemy.isAlive) {
      this.executeCombat(dt, onFireBullet);
    } else {
      this.executeObjectives(dt, roundBombPlanted, bombPosition);
    }

    // Apply movement physics and collision
    this.executeMovement(dt);

    // Sync 3D Humanoid Model
    this.model.root.position.copy(this.state.position);
    this.model.setAimPosture(this.state.rotation.pitch, this.state.rotation.yaw);
    this.model.updateHitboxes();

    const speed = new THREE.Vector2(this.state.velocity.x, this.state.velocity.z).length();
    this.model.updateAnimation(dt, speed, this.state.isGrounded, this.state.isCrouching);
  }

  // Combat execution (aiming, recoil spray, burst fire)
  private executeCombat(
    dt: number,
    onFireBullet: (
      shooter: CharacterState,
      origin: THREE.Vector3,
      dir: THREE.Vector3,
      weaponId: WeaponId
    ) => void
  ) {
    if (!this.targetEnemy) return;

    const myEye = this.state.position.clone().add(new THREE.Vector3(0, 1.65, 0));
    // Aim at upper torso / head
    const targetHead = this.targetEnemy.position.clone().add(new THREE.Vector3(0, 1.5, 0));
    const aimDir = targetHead.clone().sub(myEye).normalize();

    // Smoothly turn aim towards enemy
    const targetYaw = Math.atan2(-aimDir.x, -aimDir.z);
    const targetPitch = Math.asin(aimDir.y);

    let deltaYaw = targetYaw - this.state.rotation.yaw;
    while (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
    while (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;

    this.state.rotation.yaw += deltaYaw * Math.min(1.0, 12 * dt);
    this.state.rotation.pitch += (targetPitch - this.state.rotation.pitch) * Math.min(1.0, 12 * dt);

    // Reaction timer countdown
    if (this.reactionTimer > 0) {
      this.reactionTimer -= dt;
      return;
    }

    // Reload check
    const ammoInfo = this.state.inventory.ammo[this.state.currentWeapon];
    if (ammoInfo.current <= 0) {
      if (!this.state.isReloading && ammoInfo.reserve > 0) {
        this.reload();
      }
      return;
    }

    // Fire weapon burst
    this.shootCooldown -= dt;
    this.burstPauseTimer -= dt;

    if (this.burstPauseTimer <= 0 && this.shootCooldown <= 0) {
      const config = WEAPON_CONFIGS[this.state.currentWeapon];

      // Calculate shot direction with recoil & spread
      const spread = (Math.random() - 0.5) * config.spreadBase * 2;
      const bulletDir = aimDir.clone();
      bulletDir.x += spread + (Math.random() - 0.5) * 0.02;
      bulletDir.y += spread * 0.5 + (Math.random() - 0.5) * 0.02;
      bulletDir.z += spread + (Math.random() - 0.5) * 0.02;
      bulletDir.normalize();

      // Consume ammo
      ammoInfo.current--;
      this.shootCooldown = 1.0 / config.fireRate;
      this.burstCount++;

      // Trigger animation and sound
      this.model.triggerShootAnim();
      soundManager.playWeaponShot(this.state.currentWeapon, 0.7);

      // Dispatch bullet
      onFireBullet(this.state, myEye, bulletDir, this.state.currentWeapon);

      if (this.burstCount >= this.burstMax) {
        this.burstCount = 0;
        this.burstPauseTimer = 0.35 + Math.random() * 0.25; // pause between bursts
      }
    }
  }

  // Objectives: Plant / Defuse / Move along path
  private executeObjectives(dt: number, roundBombPlanted: boolean, bombPosition: THREE.Vector3 | null) {
    // 1. T Bomb Carrier: Plant C4 if inside site
    if (this.state.team === 'T' && this.state.inventory.c4 && !roundBombPlanted) {
      const currentSite = this.map.getBombSiteAt(this.state.position);
      if (currentSite) {
        this.botState = 'plant_bomb';
        this.state.isPlanting = true;
        this.actionTimer += dt;
        soundManager.playC4Planting(0.3);

        if (this.actionTimer >= 3.0) {
          // Plant complete!
          this.state.isPlanting = false;
          this.state.inventory.c4 = false;
          this.actionTimer = 0;
        }
        return;
      }
    }

    // 2. CT: Defuse C4 if nearby
    if (this.state.team === 'CT' && roundBombPlanted && bombPosition) {
      const distToBomb = this.state.position.distanceTo(bombPosition);
      if (distToBomb < 2.5) {
        this.botState = 'defuse_bomb';
        this.state.isDefusing = true;
        this.actionTimer += dt;
        soundManager.playC4Defusing(0.4);

        const defuseGoal = this.state.hasDefuseKit ? 5.0 : 10.0;
        if (this.actionTimer >= defuseGoal) {
          this.state.isDefusing = false;
          this.actionTimer = 0;
        }
        return;
      }
    }

    this.state.isPlanting = false;
    this.state.isDefusing = false;
    this.actionTimer = 0;

    // Follow waypoint path
    if (this.path.length > 0 && this.currentPathIndex < this.path.length) {
      const nextTarget = this.path[this.currentPathIndex];
      const flatPos = new THREE.Vector2(this.state.position.x, this.state.position.z);
      const flatTarget = new THREE.Vector2(nextTarget.x, nextTarget.z);
      const dist = flatPos.distanceTo(flatTarget);

      if (dist < 1.2) {
        this.currentPathIndex++;
      } else {
        const moveDir = nextTarget.clone().sub(this.state.position);
        moveDir.y = 0;
        moveDir.normalize();

        this.state.velocity.x = moveDir.x * this.moveSpeed;
        this.state.velocity.z = moveDir.z * this.moveSpeed;

        // Turn body towards movement direction
        const targetYaw = Math.atan2(-moveDir.x, -moveDir.z);
        let deltaYaw = targetYaw - this.state.rotation.yaw;
        while (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
        while (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;
        this.state.rotation.yaw += deltaYaw * Math.min(1.0, 8 * dt);
      }
    } else {
      this.state.velocity.x *= 0.8;
      this.state.velocity.z *= 0.8;
    }
  }

  // Reload weapon
  public reload() {
    const config = WEAPON_CONFIGS[this.state.currentWeapon];
    const ammoInfo = this.state.inventory.ammo[this.state.currentWeapon];
    if (this.state.isReloading || ammoInfo.current >= config.magSize || ammoInfo.reserve <= 0) return;

    this.state.isReloading = true;
    this.model.triggerReloadAnim(config.reloadTime);
    soundManager.playReload(0.5);

    setTimeout(() => {
      if (this.state.isAlive) {
        const needed = config.magSize - ammoInfo.current;
        const toLoad = Math.min(needed, ammoInfo.reserve);
        ammoInfo.current += toLoad;
        ammoInfo.reserve -= toLoad;
        this.state.isReloading = false;
      }
    }, config.reloadTime * 1000);
  }

  // Movement & physics step
  private executeMovement(dt: number) {
    if (this.state.isPlanting || this.state.isDefusing) {
      this.state.velocity.x = 0;
      this.state.velocity.z = 0;
    }

    // Apply gravity
    this.state.velocity.y -= 18.0 * dt;

    // Tentative position
    const nextPos = this.state.position.clone();
    nextPos.x += this.state.velocity.x * dt;
    nextPos.y += this.state.velocity.y * dt;
    nextPos.z += this.state.velocity.z * dt;

    // World collision
    const col = this.map.checkEntityCollision(nextPos, 0.45, 1.8);
    this.state.position.copy(col.position);
    this.state.isGrounded = col.isGrounded;

    if (col.isGrounded && this.state.velocity.y < 0) {
      this.state.velocity.y = 0;
    }
  }

  // Take damage from bullet hit
  public takeDamage(
    amount: number,
    attacker: CharacterState,
    zone: string
  ): { isKilled: boolean; finalDamage: number } {
    if (!this.state.isAlive) return { isKilled: false, finalDamage: 0 };

    let dmg = amount;

    // Armor reduction calculation
    if (this.state.armor > 0) {
      const config = WEAPON_CONFIGS[attacker.currentWeapon];
      const armorBonus = config.armorPenetration;
      const armoredDmg = dmg * armorBonus;
      const armorLost = (dmg - armoredDmg) * 0.5;

      this.state.armor = Math.max(0, this.state.armor - armorLost);
      dmg = armoredDmg;
    }

    this.state.health = Math.max(0, this.state.health - Math.round(dmg));

    if (this.state.health <= 0) {
      this.state.isAlive = false;
      this.state.deaths++;
      this.model.kill();
      return { isKilled: true, finalDamage: Math.round(dmg) };
    }

    return { isKilled: false, finalDamage: Math.round(dmg) };
  }
}
