import * as THREE from 'three';
import { Team, WeaponId, HitboxZone } from '../types/game';
import { ProceduralCharacter } from '../procedural/character';
import { WaypointGraph } from './WaypointGraph';
import { Dust2Map } from '../map/Dust2Map';
import { WEAPON_CONFIGS } from '../procedural/weapons';
import { soundSynth } from '../audio/SoundSynthesizer';

export type AIState = 'freeze' | 'navigate' | 'combat' | 'plant' | 'defuse' | 'reload';

export interface CombatTarget {
  id: string;
  position: THREE.Vector3;
  team: Team;
  isAlive: boolean;
  distance: number;
}

export class AIBot {
  public id: string;
  public name: string;
  public team: Team;
  public character: ProceduralCharacter;
  
  public health: number = 100;
  public armor: number = 100;
  public isAlive: boolean = true;
  public hasC4: boolean = false;
  
  public position: THREE.Vector3 = new THREE.Vector3();
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public rotationY: number = 0;
  
  // Weapons
  public primaryWeapon: WeaponId | null = null;
  public secondaryWeapon: WeaponId = 'glock';
  public equippedWeapon: WeaponId = 'glock';
  public currentAmmo: number = 20;
  public reserveAmmo: number = 120;
  
  // Tactical State
  public state: AIState = 'navigate';
  public targetSite: 'A' | 'B' = 'A';
  public path: THREE.Vector3[] = [];
  public currentPathIndex: number = 0;
  
  // Combat variables
  public currentEnemyTarget: CombatTarget | null = null;
  public isSpottedByPlayer: boolean = false;
  private shootCooldown: number = 0;
  private reloadTimer: number = 0;
  private actionTimer: number = 0; // planting / defusing timer
  private reactionDelay: number = 0.2; // human reaction time
  private strafeDir: number = 1;
  private strafeTimer: number = 0;

  constructor(id: string, name: string, team: Team, scene: THREE.Scene, initialWeapon: WeaponId = 'glock') {
    this.id = id;
    this.name = name;
    this.team = team;
    this.secondaryWeapon = team === 'CT' ? 'usp' : 'glock';
    this.equippedWeapon = initialWeapon;

    this.character = new ProceduralCharacter(id, team, this.equippedWeapon);
    scene.add(this.character.root);

    const config = WEAPON_CONFIGS[this.equippedWeapon];
    this.currentAmmo = config.magazineSize;
    this.reserveAmmo = config.maxReserveAmmo;
  }

  // Setup weapons for the round
  public setLoadout(primary: WeaponId | null, secondary: WeaponId) {
    this.primaryWeapon = primary;
    this.secondaryWeapon = secondary;
    this.equippedWeapon = primary ? primary : secondary;
    this.character.setWeapon(this.equippedWeapon);
    const config = WEAPON_CONFIGS[this.equippedWeapon];
    this.currentAmmo = config.magazineSize;
    this.reserveAmmo = config.maxReserveAmmo;
  }

  public spawn(pos: THREE.Vector3, rotY: number = 0) {
    this.position.copy(pos);
    this.velocity.set(0, 0, 0);
    this.rotationY = rotY;
    this.character.root.position.copy(pos);
    this.character.root.rotation.y = rotY;
    this.health = 100;
    this.armor = 100;
    this.isAlive = true;
    this.hasC4 = false;
    this.state = 'navigate';
    this.path = [];
    this.currentPathIndex = 0;
    this.currentEnemyTarget = null;
    this.actionTimer = 0;
    this.character.reset(this.team, this.equippedWeapon);
  }

  // Take damage with armor calculation
  public takeDamage(dmg: number, penetration: number = 0.7): { fatal: boolean; actualDmg: number } {
    if (!this.isAlive) return { fatal: false, actualDmg: 0 };

    let finalDmg = dmg;
    if (this.armor > 0) {
      const absorbed = dmg * (1 - penetration);
      const dealtToArmor = absorbed * 0.5;
      finalDmg = dmg * penetration;
      this.armor = Math.max(0, this.armor - dealtToArmor);
    }

    finalDmg = Math.round(finalDmg);
    this.health -= finalDmg;

    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
      this.character.setDead();
      return { fatal: true, actualDmg: finalDmg };
    }

    return { fatal: false, actualDmg: finalDmg };
  }

  // AI Perception: Scan for visible enemies
  public updatePerception(
    enemies: { id: string; position: THREE.Vector3; team: Team; isAlive: boolean }[],
    map: Dust2Map
  ): CombatTarget | null {
    if (!this.isAlive) return null;

    let bestTarget: CombatTarget | null = null;
    let closestDist = Infinity;

    const eyePos = this.position.clone().add(new THREE.Vector3(0, 1.65, 0));
    const forward = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));

    for (const enemy of enemies) {
      if (!enemy.isAlive || enemy.team === this.team) continue;

      const enemyEyePos = enemy.position.clone().add(new THREE.Vector3(0, 1.65, 0));
      const dist = eyePos.distanceTo(enemyEyePos);

      // Vision max range 90m
      if (dist > 90) continue;

      const toEnemy = enemyEyePos.clone().sub(eyePos).normalize();
      const dot = forward.dot(toEnemy);

      // 120 degree field of view cone (dot > 0.3) or hearing range (dist < 8)
      if (dot > 0.3 || dist < 8) {
        // Line of sight raycast through Dust2 walls
        if (map.checkLineOfSight(eyePos, enemyEyePos)) {
          if (dist < closestDist) {
            closestDist = dist;
            bestTarget = {
              id: enemy.id,
              position: enemy.position.clone(),
              team: enemy.team,
              isAlive: true,
              distance: dist,
            };
          }
        }
      }
    }

    this.currentEnemyTarget = bestTarget;
    return bestTarget;
  }

  // Decision Making & Movement Update
  public update(
    dt: number,
    navGraph: WaypointGraph,
    map: Dust2Map,
    c4State: { status: string; position: THREE.Vector3; plantedSite: 'A' | 'B' | null },
    allPlayers: { id: string; position: THREE.Vector3; team: Team; isAlive: boolean; takeDamage: (dmg: number, pen: number) => { fatal: boolean } }[],
    onBotFire: (bot: AIBot, hitPlayerId: string | null, zone: HitboxZone | null) => void,
    onPlantComplete: () => void,
    onDefuseComplete: () => void
  ) {
    if (!this.isAlive) {
      this.character.update(dt, 0);
      return;
    }

    this.shootCooldown = Math.max(0, this.shootCooldown - dt);

    // 1. Handle Reloading
    if (this.state === 'reload') {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        const config = WEAPON_CONFIGS[this.equippedWeapon];
        const needed = config.magazineSize - this.currentAmmo;
        const take = Math.min(needed, this.reserveAmmo);
        this.currentAmmo += take;
        this.reserveAmmo -= take;
        this.state = this.currentEnemyTarget ? 'combat' : 'navigate';
      }
      this.character.update(dt, 0);
      return;
    }

    // 2. Tactical State Evaluation
    if (this.currentEnemyTarget && this.currentEnemyTarget.isAlive) {
      this.state = 'combat';
    } else if (c4State.status === 'planted' && this.team === 'CT') {
      // CT Priority: Retake and Defuse C4
      const distToC4 = this.position.distanceTo(c4State.position);
      if (distToC4 < 2.5) {
        this.state = 'defuse';
      } else {
        this.state = 'navigate';
        if (this.path.length === 0 || this.currentPathIndex >= this.path.length) {
          this.path = navGraph.findPath(this.position, c4State.position);
          this.currentPathIndex = 0;
        }
      }
    } else if (this.hasC4 && this.team === 'T') {
      // T Carrier Priority: Move to site and Plant
      const site = map.getPlantSiteAt(this.position);
      if (site) {
        this.state = 'plant';
      } else {
        this.state = 'navigate';
      }
    } else if (this.state === 'plant' || this.state === 'defuse') {
      // If we were planting/defusing but conditions no longer met
      this.state = 'navigate';
    }

    // 3. State Execution
    let moveSpeed = 0;

    switch (this.state) {
      case 'combat': {
        if (!this.currentEnemyTarget) {
          this.state = 'navigate';
          break;
        }

        // Face enemy
        const toTarget = this.currentEnemyTarget.position.clone().sub(this.position);
        this.rotationY = Math.atan2(toTarget.x, toTarget.z);

        // Tactical strafe left/right during combat
        this.strafeTimer += dt;
        if (this.strafeTimer > 1.2) {
          this.strafeTimer = 0;
          this.strafeDir *= -1;
        }
        const rightVec = new THREE.Vector3(Math.cos(this.rotationY), 0, -Math.sin(this.rotationY));
        this.position.addScaledVector(rightVec, this.strafeDir * 2.2 * dt);
        moveSpeed = 2.2;

        // Fire at enemy
        if (this.shootCooldown <= 0 && this.currentAmmo > 0) {
          this.fireWeapon(allPlayers, onBotFire);
        } else if (this.currentAmmo === 0 && this.reserveAmmo > 0) {
          this.state = 'reload';
          this.reloadTimer = WEAPON_CONFIGS[this.equippedWeapon].reloadTime;
          soundSynth.playReload(this.equippedWeapon);
        }
        break;
      }

      case 'navigate': {
        // Generate path if none exists
        if (this.path.length === 0 || this.currentPathIndex >= this.path.length) {
          let dest: THREE.Vector3;
          if (c4State.status === 'planted' && this.team === 'CT') {
            dest = c4State.position.clone();
          } else if (this.team === 'T') {
            // Push towards designated site (A or B)
            dest = this.targetSite === 'A'
              ? new THREE.Vector3(38, 1.5, -56) // A Site Default
              : new THREE.Vector3(-64, 0.8, -38); // B Site Default
          } else {
            // CT Anchor defense zones
            dest = this.targetSite === 'A'
              ? new THREE.Vector3(42, 1.5, -58) // Defend A
              : new THREE.Vector3(-60, 0.8, -34); // Defend B
          }
          this.path = navGraph.findPath(this.position, dest);
          this.currentPathIndex = 0;
        }

        // Follow path waypoints
        if (this.currentPathIndex < this.path.length) {
          const targetWaypoint = this.path[this.currentPathIndex];
          const toWaypoint = targetWaypoint.clone().sub(this.position);
          toWaypoint.y = 0; // ignore vertical for direction
          const dist = toWaypoint.length();

          if (dist < 1.2) {
            this.currentPathIndex++;
          } else {
            toWaypoint.normalize();
            this.rotationY = Math.atan2(toWaypoint.x, toWaypoint.z);

            const speed = 4.8; // Bot running speed
            this.position.addScaledVector(toWaypoint, speed * dt);
            moveSpeed = speed;
          }
        }
        break;
      }

      case 'plant': {
        // T Bomb Carrier planting C4 (3.2 seconds required)
        this.actionTimer += dt;
        soundSynth.playC4ButtonPress();
        if (this.actionTimer >= 3.2) {
          this.actionTimer = 0;
          this.hasC4 = false;
          onPlantComplete();
          this.state = 'navigate';
        }
        break;
      }

      case 'defuse': {
        // CT defusing planted C4 (5.0 seconds required)
        this.actionTimer += dt;
        if (Math.random() < 0.2) soundSynth.playDefuseCut();
        if (this.actionTimer >= 5.0) {
          this.actionTimer = 0;
          onDefuseComplete();
          this.state = 'navigate';
        }
        break;
      }
    }

    // Physics collision resolution with Dust2 walls
    const resolved = map.resolveCollision(this.position, 0.45, 1.8);
    this.position.copy(resolved.position);

    // Update 3D Character Transform & Procedural Animation
    this.character.root.position.copy(this.position);
    this.character.root.rotation.y = this.rotationY;
    this.character.update(dt, moveSpeed);
  }

  // AI Weapon Firing logic
  private fireWeapon(
    allPlayers: { id: string; position: THREE.Vector3; team: Team; isAlive: boolean; takeDamage: (dmg: number, pen: number) => { fatal: boolean } }[],
    onBotFire: (bot: AIBot, hitPlayerId: string | null, zone: HitboxZone | null) => void
  ) {
    const config = WEAPON_CONFIGS[this.equippedWeapon];
    this.shootCooldown = 1 / config.fireRate;
    this.currentAmmo--;

    // Bot weapon recoil and animation kick
    this.character.triggerRecoil();
    soundSynth.playGunshot(this.equippedWeapon, 15); // Bot shot sound

    if (!this.currentEnemyTarget) return;

    // Simulated aim inaccuracy & hit probability based on distance
    const dist = this.currentEnemyTarget.distance;
    const hitChance = Math.max(0.3, 0.85 - (dist / 80) * 0.5);

    if (Math.random() < hitChance) {
      // Hit! Determine zone (Headshot 20%, Body 80%)
      const isHeadshot = Math.random() < 0.22;
      const zone: HitboxZone = isHeadshot ? 'head' : (Math.random() < 0.6 ? 'chest' : 'stomach');
      onBotFire(this, this.currentEnemyTarget.id, zone);
    } else {
      // Missed shot
      onBotFire(this, null, null);
    }
  }
}
