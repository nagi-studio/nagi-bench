// Soldier = simulation state for any combatant (human-controlled or bot).

import * as THREE from 'three';
import type { Team, Intent } from '../types';
import { emptyIntent } from '../types';
import { BODY_RADIUS, CROUCH_HEIGHT, EYE_CROUCH, EYE_STAND, MAX_HEALTH, STAND_HEIGHT } from '../config';
import { WEAPONS, type Slot, type WeaponDef, type WeaponId, type Loadout } from '../weapons/WeaponDefs';
import { lerp } from '../math';
import type { SoldierModel } from './SoldierModel';
import type { BotBrain } from '../ai/BotBrain';

export class WeaponInstance {
  readonly def: WeaponDef;
  ammo: number;
  reserve: number;
  nextFire = 0;
  reloadStart = 0;
  reloadEnd = 0;
  bloom = 0; // accumulated spread (deg)
  shots = 0; // consecutive shots in current spray
  lastShot = -100;
  zoom = 0; // 0 = unscoped, 1..n zoom level
  resumeZoom = 0; // zoom level to restore after bolt cycle

  constructor(id: WeaponId) {
    this.def = WEAPONS[id];
    this.ammo = this.def.magSize;
    this.reserve = this.def.reserve;
  }

  get reloading(): boolean {
    return this.reloadEnd > 0;
  }
}

let nextId = 1;

export class Soldier {
  readonly id = nextId++;
  name: string;
  team: Team;
  /** Index within the team (spawn slot). */
  slotIndex: number;
  /** The soldier is currently driven by the human player. */
  human = false;

  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  onGround = true;
  crouching = false;
  crouch = 0; // smoothed 0..1
  radius = BODY_RADIUS;
  height = STAND_HEIGHT;

  health = MAX_HEALTH;
  armor = 0;
  helmet = false;
  kit = false;
  alive = true;
  hasBomb = false;

  weapons: Partial<Record<Slot, WeaponInstance>> = {};
  current: Slot = 'secondary';
  lastSlot: Slot = 'melee';
  drawEnd = 0;
  drawStart = 0;
  punchPitch = 0; // deg
  punchYaw = 0; // deg

  kills = 0;
  deaths = 0;
  headshots = 0;
  roundKills = 0;

  deathTime = -100;
  pickupBlockedUntil = 0;
  lastHurtTime = -100;
  lastAttackerId = 0;
  slowUntil = 0;
  footstepDist = 0;
  lastSeenByEnemy = -100;

  plantProgress = 0;
  defuseProgress = 0;

  readonly intent: Intent = emptyIntent();
  brain: BotBrain | null = null;
  model: SoldierModel | null = null;

  constructor(name: string, team: Team, slotIndex: number) {
    this.name = name;
    this.team = team;
    this.slotIndex = slotIndex;
  }

  get weapon(): WeaponInstance {
    return (this.weapons[this.current] ?? this.weapons.melee)!;
  }

  get eyeHeight(): number {
    return lerp(EYE_STAND, EYE_CROUCH, this.crouch);
  }

  eye(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + this.eyeHeight, this.pos.z);
  }

  /** Head center used for AI aiming / visibility. */
  head(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + 1.66 - 0.38 * this.crouch, this.pos.z);
  }

  chest(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + 1.28 - 0.38 * this.crouch, this.pos.z);
  }

  get horizontalSpeed(): number {
    return Math.hypot(this.vel.x, this.vel.z);
  }

  get scoped(): boolean {
    const w = this.weapons[this.current];
    return !!w && w.zoom > 0;
  }

  get maxSpeed(): number {
    const w = this.weapon;
    if (w.def.scope && w.zoom > 0) return w.def.scope.moveSpeed;
    return w.def.moveSpeed;
  }

  applyLoadout(l: Loadout, keepPrimary: boolean): void {
    const oldPrimary = keepPrimary ? this.weapons.primary : undefined;
    this.weapons = {
      melee: new WeaponInstance('knife'),
      secondary: new WeaponInstance(l.secondary),
    };
    if (oldPrimary) {
      this.weapons.primary = new WeaponInstance(oldPrimary.def.id);
    } else if (l.primary) this.weapons.primary = new WeaponInstance(l.primary);
    this.armor = l.armor;
    this.helmet = l.helmet;
    this.kit = l.kit;
    this.current = this.weapons.primary ? 'primary' : 'secondary';
    this.lastSlot = this.weapons.primary ? 'secondary' : 'melee';
  }

  give(id: WeaponId): void {
    const def = WEAPONS[id];
    this.weapons[def.slot] = new WeaponInstance(id);
  }

  resetForRound(x: number, y: number, z: number, yaw: number): void {
    this.pos.set(x, y, z);
    this.vel.set(0, 0, 0);
    this.yaw = yaw;
    this.pitch = 0;
    this.health = MAX_HEALTH;
    this.alive = true;
    this.hasBomb = false;
    this.crouching = false;
    this.crouch = 0;
    this.height = STAND_HEIGHT;
    this.punchPitch = 0;
    this.punchYaw = 0;
    this.plantProgress = 0;
    this.defuseProgress = 0;
    this.roundKills = 0;
    this.slowUntil = 0;
    this.lastHurtTime = -100;
    this.onGround = true;
  }

  setCrouchHeight(): void {
    this.height = lerp(STAND_HEIGHT, CROUCH_HEIGHT, this.crouch);
  }
}
