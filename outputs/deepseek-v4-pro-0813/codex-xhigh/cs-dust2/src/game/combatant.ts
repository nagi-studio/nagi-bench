import * as THREE from 'three';
import { HumanoidModel } from './humanoid';
import { WEAPON_DEFS, createLoadout, freshAmmo } from './weapons';
import { AmmoState, Team, WeaponDef, WeaponId, WeaponSlot } from './types';
import { clamp } from './math';

export type AIMode = 'idle' | 'patrol' | 'goto' | 'combat' | 'plant' | 'defuse' | 'hold';

export interface AIState {
  mode: AIMode;
  path: Array<{ x: number; z: number }>;
  pathIndex: number;
  targetId: string | null;
  lookX: number;
  lookZ: number;
  strafeDir: number;
  strafeTimer: number;
  decisionTimer: number;
  patrolNode: string;
  holdX: number;
  holdZ: number;
}

export interface CombatantOptions {
  id: string;
  team: Team;
  isPlayer: boolean;
  pistolRound: boolean;
  loadoutOverride?: ReturnType<typeof createLoadout>;
}

export class Combatant {
  readonly id: string;
  readonly team: Team;
  isPlayer: boolean;
  readonly model: HumanoidModel;
  private readonly primary: WeaponId | null;
  private readonly secondary: WeaponId;
  private readonly melee: WeaponId;
  readonly ammo: Partial<Record<WeaponId, AmmoState>>;
  currentSlot: WeaponSlot;
  hp = 100;
  armor = 0;
  alive = true;
  x = 0;
  z = 0;
  yaw = 0;
  pitch = 0;
  recoilPitch = 0;
  recoilYaw = 0;
  spread = 0;
  velocity = new THREE.Vector3();
  onGround = true;
  verticalVelocity = 0;
  fireCooldown = 0;
  reloading = false;
  reloadTimer = 0;
  lastFootstepAt = 0;
  hasBomb = false;
  planting = false;
  defusing = false;
  interactionProgress = 0;
  visibleToPlayer = false;
  ai: AIState = {
    mode: 'idle',
    path: [],
    pathIndex: 0,
    targetId: null,
    lookX: 0,
    lookZ: 1,
    strafeDir: 0,
    strafeTimer: 0,
    decisionTimer: 0,
    patrolNode: 'tSpawn',
    holdX: 0,
    holdZ: 0,
  };

  constructor(options: CombatantOptions) {
    this.id = options.id;
    this.team = options.team;
    this.isPlayer = options.isPlayer;
    this.model = new HumanoidModel(options.team);

    const loadout = options.loadoutOverride ?? createLoadout(options.team, options.pistolRound);
    this.primary = loadout.primary;
    this.secondary = loadout.secondary;
    this.melee = loadout.melee;
    this.ammo = loadout.ammo;
    this.armor = loadout.armor;
    this.currentSlot = loadout.primary ? 'primary' : 'secondary';
    this.model.setWeapon(this.currentWeaponId);
  }

  get currentWeaponId(): WeaponId {
    if (this.currentSlot === 'primary' && this.primary) return this.primary;
    if (this.currentSlot === 'melee') return this.melee;
    return this.secondary;
  }

  get currentWeaponDef(): WeaponDef {
    return WEAPON_DEFS[this.currentWeaponId];
  }

  get currentAmmo(): AmmoState | null {
    return this.ammo[this.currentWeaponId] ?? null;
  }

  getSlotWeapon(slot: WeaponSlot): WeaponId | null {
    if (slot === 'primary') return this.primary;
    if (slot === 'secondary') return this.secondary;
    return this.melee;
  }

  get headPosition(): THREE.Vector3 {
    return new THREE.Vector3(this.x, 1.55, this.z);
  }

  get eyePosition(): THREE.Vector3 {
    return new THREE.Vector3(this.x, 1.62, this.z);
  }

  get aimDirection(): THREE.Vector3 {
    const yaw = this.yaw + this.recoilYaw;
    const pitch = this.pitch + this.recoilPitch;
    return new THREE.Vector3(
      Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      Math.cos(yaw) * Math.cos(pitch),
    ).normalize();
  }

  setPosition(x: number, z: number, yaw = this.yaw) {
    this.x = x;
    this.z = z;
    this.yaw = yaw;
    this.model.position.set(x, 0, z);
    this.model.rotation.y = yaw;
  }

  equip(slot: WeaponSlot) {
    if (!this.alive) return;
    const weapon = this.getSlotWeapon(slot);
    if (!weapon) return;
    this.currentSlot = slot;
    this.reloading = false;
    this.reloadTimer = 0;
    this.spread = 0;
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    this.model.setWeapon(weapon);
  }

  equipBest() {
    const primaryAmmo = this.primary ? this.ammo[this.primary] : null;
    const secondaryAmmo = this.ammo[this.secondary] ?? { mag: 0, reserve: 0 };
    const primaryUsable = this.primary && primaryAmmo && (primaryAmmo.mag > 0 || primaryAmmo.reserve > 0);
    if (primaryUsable) this.equip('primary');
    else if (secondaryAmmo.mag > 0 || secondaryAmmo.reserve > 0) this.equip('secondary');
    else this.equip('melee');
  }

  canFire(now: number): boolean {
    if (!this.alive || this.reloading || this.fireCooldown > 0) return false;
    if (this.currentWeaponId === 'knife') return now - this.fireCooldown > 0;
    const ammo = this.currentAmmo;
    return Boolean(ammo && ammo.mag > 0);
  }

  consumeShot() {
    if (this.currentWeaponId === 'knife') return;
    const ammo = this.currentAmmo;
    if (ammo) ammo.mag = Math.max(0, ammo.mag - 1);
  }

  startReload() {
    if (!this.alive || this.reloading || this.currentWeaponId === 'knife') return;
    const ammo = this.currentAmmo;
    if (!ammo || ammo.mag >= WEAPON_DEFS[this.currentWeaponId].magSize || ammo.reserve <= 0) return;
    this.reloading = true;
    this.reloadTimer = WEAPON_DEFS[this.currentWeaponId].reloadTime;
  }

  updateReload(dt: number, audio: (stage: 'start' | 'end') => void) {
    if (!this.reloading) return;
    this.reloadTimer -= dt;
    if (this.reloadTimer <= 0) {
      const ammo = this.currentAmmo;
      const def = WEAPON_DEFS[this.currentWeaponId];
      if (ammo) {
        const needed = def.magSize - ammo.mag;
        const take = Math.min(needed, ammo.reserve);
        ammo.mag += take;
        ammo.reserve -= take;
      }
      this.reloading = false;
      audio('end');
    }
  }

  hurt(rawDamage: number, part: string): { damage: number; dead: boolean } {
    if (!this.alive) return { damage: 0, dead: true };
    const multiplier = part === 'head' ? 2 : part === 'stomach' ? 1.25 : part.includes('Leg') ? 0.75 : part.includes('Arm') ? 0.75 : 1;
    const damage = rawDamage * multiplier;

    let healthDamage = damage;
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, damage * 0.45);
      this.armor = Math.max(0, this.armor - absorbed);
      healthDamage = damage * 0.55;
    }
    this.hp = Math.max(0, this.hp - healthDamage);
    const dead = this.hp <= 0;
    if (dead) {
      this.alive = false;
      this.model.setDead(true);
      this.velocity.set(0, 0, 0);
    }
    return { damage, dead };
  }

  giveWeapon(id: WeaponId) {
    if (id === 'knife') return;
    if (WEAPON_DEFS[id].slot === 'primary') {
      (this as unknown as { primary: WeaponId | null }).primary = id;
    } else {
      (this as unknown as { secondary: WeaponId }).secondary = id;
    }
    this.ammo[id] = freshAmmo(id);
    this.equip(WEAPON_DEFS[id].slot);
  }

  resetWeaponAnimation() {
    this.model.updateWalk(0, false, 0);
  }

  setLook(lookX: number, lookZ: number) {
    this.ai.lookX = lookX;
    this.ai.lookZ = lookZ;
  }

  updateModel(dt: number, moving: boolean, speed: number) {
    this.model.position.set(this.x, this.model.position.y, this.z);
    this.model.rotation.y = this.yaw;
    this.model.setAimPitch(clamp(this.pitch, -0.8, 0.8));
    this.model.updateWalk(dt, moving && this.alive, speed);
  }
}
