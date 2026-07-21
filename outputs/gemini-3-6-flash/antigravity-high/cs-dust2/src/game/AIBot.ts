import * as THREE from 'three';
import { CharacterState, Team, WeaponType } from '../types/game';
import { WEAPON_DEFINITIONS } from './Weapons';
import { navMesh } from './NavMesh';
import { PhysicsEngine } from './Physics';

export type AIBehaviorState = 'PATROL' | 'ATTACK' | 'PLANT_C4' | 'DEFUSE_C4' | 'COVER';

export class AIBotController {
  public state: CharacterState;
  public behaviorState: AIBehaviorState = 'PATROL';

  private currentPath: THREE.Vector3[] = [];
  private pathIndex: number = 0;
  private targetEnemy: CharacterState | null = null;
  private shootTimer: number = 0;
  private reactionTimer: number = 0;
  private repathTimer: number = 0;

  constructor(state: CharacterState) {
    this.state = state;
  }

  public update(
    dt: number,
    allCharacters: CharacterState[],
    c4State: { isPlanted: boolean; isDropped: boolean; position: THREE.Vector3 },
    onFire: (bot: CharacterState, targetPos: THREE.Vector3) => void
  ) {
    if (this.state.isDead) return;

    this.shootTimer += dt;
    this.repathTimer += dt;

    // 1. Perception & Line of Sight target detection
    this.updatePerception(allCharacters);

    // 2. State Machine Logic
    if (this.targetEnemy && !this.targetEnemy.isDead) {
      this.behaviorState = 'ATTACK';
    } else if (this.state.team === 'T' && this.state.hasC4 && !c4State.isPlanted) {
      // T with C4 moves to plant site A or B
      const distA = this.state.position.distanceTo(new THREE.Vector3(40, 0, -15));
      const distB = this.state.position.distanceTo(new THREE.Vector3(-40, 0, -25));

      if (distA < 6 || distB < 6) {
        this.behaviorState = 'PLANT_C4';
      } else {
        this.behaviorState = 'PATROL';
        if (this.repathTimer > 3.0 || this.currentPath.length === 0) {
          const targetSite = distA < distB ? new THREE.Vector3(40, 0, -15) : new THREE.Vector3(-40, 0, -25);
          this.currentPath = navMesh.findPath(this.state.position, targetSite);
          this.pathIndex = 0;
          this.repathTimer = 0;
        }
      }
    } else if (this.state.team === 'CT' && c4State.isPlanted) {
      // CT rotate to defuse C4
      const distC4 = this.state.position.distanceTo(c4State.position);
      if (distC4 < 2.5) {
        this.behaviorState = 'DEFUSE_C4';
      } else {
        this.behaviorState = 'PATROL';
        if (this.repathTimer > 2.0 || this.currentPath.length === 0) {
          this.currentPath = navMesh.findPath(this.state.position, c4State.position);
          this.pathIndex = 0;
          this.repathTimer = 0;
        }
      }
    } else {
      this.behaviorState = 'PATROL';
    }

    // 3. Execute Behavior
    if (this.behaviorState === 'ATTACK' && this.targetEnemy) {
      this.executeAttack(dt, onFire);
    } else if (this.behaviorState === 'PLANT_C4') {
      this.state.isPlantingC4 = true;
      this.state.plantTimer += dt;
      this.state.velocity.set(0, 0, 0);
    } else if (this.behaviorState === 'DEFUSE_C4') {
      this.state.isDefusingC4 = true;
      this.state.defuseTimer += dt;
      this.state.velocity.set(0, 0, 0);
    } else {
      this.state.isPlantingC4 = false;
      this.state.isDefusingC4 = false;
      this.executePatrol(dt);
    }

    // Apply movement & physics sliding
    if (!this.state.isPlantingC4 && !this.state.isDefusingC4) {
      const newPos = PhysicsEngine.collideAndSlide(this.state.position, this.state.velocity);
      this.state.position.copy(newPos);
      if (this.state.velocity.lengthSq() > 0.01) {
        this.state.walkCycle += dt;
      }
    }
  }

  private updatePerception(allCharacters: CharacterState[]) {
    let closestEnemy: CharacterState | null = null;
    let minDst = Infinity;

    const eyePos = this.state.position.clone().add(new THREE.Vector3(0, 1.5, 0));

    for (const other of allCharacters) {
      if (other.isDead || other.team === this.state.team) continue;

      const targetEye = other.position.clone().add(new THREE.Vector3(0, 1.5, 0));
      const dst = eyePos.distanceTo(targetEye);

      if (dst < minDst && dst < 50) {
        // Line of Sight check
        const hasLOS = PhysicsEngine.checkLineOfSight(eyePos, targetEye);
        if (hasLOS) {
          minDst = dst;
          closestEnemy = other;
        }
      }
    }

    this.targetEnemy = closestEnemy;
  }

  private executeAttack(
    dt: number,
    onFire: (bot: CharacterState, targetPos: THREE.Vector3) => void
  ) {
    if (!this.targetEnemy) return;

    // Face target enemy
    const targetHead = this.targetEnemy.position.clone().add(new THREE.Vector3(0, 1.5, 0));
    const dir = targetHead.clone().sub(this.state.position);
    this.state.yaw = Math.atan2(-dir.x, -dir.z);

    // Stop to shoot accurately
    this.state.velocity.set(0, 0, 0);

    const weaponData = WEAPON_DEFINITIONS[this.state.currentWeapon];
    const fireInterval = 1.0 / weaponData.fireRate;

    if (this.shootTimer >= fireInterval) {
      this.shootTimer = 0;

      // Add slight bot inaccuracy offset
      const spreadOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      );

      onFire(this.state, targetHead.add(spreadOffset));
    }
  }

  private executePatrol(dt: number) {
    if (this.currentPath.length === 0 || this.pathIndex >= this.currentPath.length) {
      // Pick random destination waypoint
      const targetWp = navMesh.getRandomWaypointInZone(
        this.state.team === 'T' ? (Math.random() > 0.5 ? 'A_SITE' : 'B_SITE') : 'MID'
      );
      this.currentPath = navMesh.findPath(this.state.position, targetWp.position);
      this.pathIndex = 0;
    }

    if (this.pathIndex < this.currentPath.length) {
      const targetPos = this.currentPath[this.pathIndex];
      const dir = targetPos.clone().sub(this.state.position);
      dir.y = 0;

      if (dir.length() < 1.0) {
        this.pathIndex++;
      } else {
        dir.normalize();
        this.state.yaw = Math.atan2(-dir.x, -dir.z);
        const speed = 4.5;
        this.state.velocity.set(dir.x * speed * dt, 0, dir.z * speed * dt);
      }
    }
  }
}
