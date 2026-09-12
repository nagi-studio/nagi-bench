import * as THREE from 'three';
import { Team, WeaponId, WeaponSlot, V } from '../types';
import { Loadout, WEAPONS } from '../weapons/weapons';
import { buildHumanoid, HumanoidParts } from '../characters/humanoid';

export type AIMode = 'patrol' | 'engage' | 'plant' | 'defuse' | 'push' | 'hunt';

export interface AmmoState {
  mag: number;
  reserve: number;
}

export const EYE_HEIGHT = 1.62;
export const PLAYER_RADIUS = 0.42;

export class Actor {
  id: number;
  name: string;
  team: Team;
  isPlayer = false; // currently human-controlled
  isBot = true;

  pos = V();
  vel = V();
  yaw = 0;
  pitch = 0;
  onGround = true;

  health = 100;
  armor = 0;
  helmet = false;
  alive = true;

  loadout: Loadout;
  currentSlot: WeaponSlot = 'secondary';
  ammo: Partial<Record<WeaponId, AmmoState>> = {};

  reloading = false;
  reloadEnd = 0;
  lastShot = 0;
  spread = 0; // current bloom radians
  scoped = false;

  hasBomb = false;
  planting = 0;
  defusing = 0;
  wantPlant = false;
  wantDefuse = false;

  model: THREE.Group;
  parts: HumanoidParts;
  walkPhase = 0;

  // AI state
  mode: AIMode = 'patrol';
  path: THREE.Vector3[] = [];
  pathIndex = 0;
  repathTimer = 0;
  target: Actor | null = null;
  lastSeenTarget = V();
  reactionTimer = 0;
  aimYaw = 0;
  aimPitch = 0;
  patrolGoal: THREE.Vector3 | null = null;
  stuckTimer = 0;
  lastPos = V();
  fireCooldown = 0;

  constructor(id: number, name: string, team: Team, loadout: Loadout) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.loadout = loadout;
    this.parts = buildHumanoid(team);
    this.model = this.parts.group;
    this.initAmmo();
  }

  initAmmo() {
    this.ammo = {};
    const add = (w: WeaponId | null) => {
      if (!w) return;
      const def = WEAPONS[w];
      this.ammo[w] = { mag: def.magSize, reserve: def.reserveAmmo };
    };
    add(this.loadout.primary);
    add(this.loadout.secondary);
    add(this.loadout.melee);
    this.currentSlot = this.loadout.primary ? 'primary' : 'secondary';
  }

  weaponIdForSlot(slot: WeaponSlot): WeaponId | null {
    if (slot === 'primary') return this.loadout.primary;
    if (slot === 'secondary') return this.loadout.secondary;
    return this.loadout.melee;
  }

  currentWeaponId(): WeaponId {
    return this.weaponIdForSlot(this.currentSlot) ?? this.loadout.secondary;
  }

  currentWeapon() {
    return WEAPONS[this.currentWeaponId()];
  }

  currentAmmo(): AmmoState {
    return this.ammo[this.currentWeaponId()]!;
  }

  eyePos(): THREE.Vector3 {
    return V(this.pos.x, this.pos.y + EYE_HEIGHT, this.pos.z);
  }

  forward(): THREE.Vector3 {
    return V(Math.sin(this.yaw), 0, Math.cos(this.yaw)).normalize();
  }

  aimDir(): THREE.Vector3 {
    const cp = Math.cos(this.pitch);
    return V(
      Math.sin(this.yaw) * cp,
      Math.sin(this.pitch),
      Math.cos(this.yaw) * cp
    ).normalize();
  }

  canSwitchTo(slot: WeaponSlot): boolean {
    return this.weaponIdForSlot(slot) !== null;
  }

  reset(pos: THREE.Vector3, loadout: Loadout) {
    this.pos.copy(pos);
    this.pos.y = 0;
    this.vel.set(0, 0, 0);
    this.health = 100;
    this.alive = true;
    this.loadout = loadout;
    this.reloading = false;
    this.spread = 0;
    this.scoped = false;
    this.hasBomb = false;
    this.planting = 0;
    this.defusing = 0;
    this.mode = 'patrol';
    this.path = [];
    this.pathIndex = 0;
    this.target = null;
    this.initAmmo();
    this.model.visible = true;
  }
}
