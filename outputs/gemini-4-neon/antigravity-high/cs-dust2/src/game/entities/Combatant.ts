import * as THREE from 'three';
import { HITBOX_MULTIPLIERS, PHYSICS, ROUND_CONFIG } from '../config';
import { HitboxZone, Team, WeaponId, WeaponInstance, WeaponSlot } from '../types';
import { WEAPONS } from '../weapons/weaponData';
import { HumanoidModel } from './HumanoidModel';

export class Combatant {
  public readonly id: string;
  public readonly name: string;
  public readonly team: Team;
  public isHuman: boolean;

  public pos = new THREE.Vector3();
  public vel = new THREE.Vector3();
  public yaw = 0;
  public pitch = 0;

  public hp = 100;
  public armor = 0;
  public hasHelmet = false;
  public money = ROUND_CONFIG.PISTOL_ROUND_MONEY;
  public alive = true;
  public grounded = false;
  public crouching = false;
  public walking = false;

  public primary: WeaponInstance | null = null;
  public secondary: WeaponInstance | null = null;
  public hasC4 = false;
  public activeSlot: WeaponSlot = 'secondary';

  public fireCooldown = 0;
  public reloading = false;
  public reloadTimer = 0;
  public reloadDuration = 0;
  public scopeLevel = 0;

  // Dynamic recoil bloom & visual recoil pitch offset
  public recoilSpread = 0;
  public recoilPitchAccum = 0;
  public shotsFiredBurst = 0;

  // Bomb interaction
  public isPlanting = false;
  public plantProgress = 0;
  public isDefusing = false;
  public defuseProgress = 0;

  // Footstep cadence
  public footstepAccum = 0;

  // Match stats
  public kills = 0;
  public deaths = 0;
  public assists = 0;

  // Radar visibility tracking (spotted by opposite team)
  public lastSpottedTime = -99;

  public readonly model: HumanoidModel;

  constructor(id: string, name: string, team: Team, isHuman: boolean) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.isHuman = isHuman;
    this.model = new HumanoidModel(id, team);
    this.giveDefaultPistol();
  }

  public giveDefaultPistol(): void {
    const pistolId: WeaponId = this.team === 'CT' ? 'usp' : 'glock';
    const cfg = WEAPONS[pistolId];
    this.secondary = {
      id: pistolId,
      ammoInMag: cfg.magSize,
      reserveAmmo: cfg.reserveAmmo,
    };
  }

  public resetForRound(
    spawn: { x: number; y: number; z: number; yaw: number },
    isPistolRound: boolean,
    keepWeapons: boolean
  ): void {
    this.pos.set(spawn.x, spawn.y, spawn.z);
    this.vel.set(0, 0, 0);
    this.yaw = spawn.yaw;
    this.pitch = 0;
    this.hp = 100;
    this.alive = true;
    this.grounded = true;
    this.crouching = false;
    this.walking = false;
    this.fireCooldown = 0;
    this.reloading = false;
    this.reloadTimer = 0;
    this.scopeLevel = 0;
    this.recoilSpread = 0;
    this.recoilPitchAccum = 0;
    this.shotsFiredBurst = 0;
    this.isPlanting = false;
    this.plantProgress = 0;
    this.isDefusing = false;
    this.defuseProgress = 0;
    this.hasC4 = false;
    this.lastSpottedTime = -99;

    if (isPistolRound) {
      // Standard CS Pistol Round configuration: default pistol only, no primary, pistol-round Kevlar
      this.primary = null;
      this.giveDefaultPistol();
      this.armor = ROUND_CONFIG.PISTOL_ROUND_ARMOR;
      this.hasHelmet = false;
      this.activeSlot = 'secondary';
    } else if (!keepWeapons) {
      this.primary = null;
      this.giveDefaultPistol();
      this.armor = 0;
      this.hasHelmet = false;
      this.activeSlot = 'secondary';
    } else {
      // Survivor keeps weapons and refills ammo for next round
      if (this.primary) {
        const cfg = WEAPONS[this.primary.id];
        this.primary.ammoInMag = cfg.magSize;
        this.primary.reserveAmmo = cfg.reserveAmmo;
      }
      if (this.secondary) {
        const cfg = WEAPONS[this.secondary.id];
        this.secondary.ammoInMag = cfg.magSize;
        this.secondary.reserveAmmo = cfg.reserveAmmo;
      } else {
        this.giveDefaultPistol();
      }
      this.activeSlot = this.primary ? 'primary' : 'secondary';
    }

    this.model.setDead(false);
    this.model.setWeapon(this.getActiveWeaponId());
  }

  public getActiveWeaponId(): WeaponId {
    if (this.activeSlot === 'primary' && this.primary) return this.primary.id;
    if (this.activeSlot === 'secondary' && this.secondary) return this.secondary.id;
    if (this.activeSlot === 'c4' && this.hasC4) return 'c4';
    return 'knife';
  }

  public getActiveWeaponInstance(): WeaponInstance | null {
    if (this.activeSlot === 'primary') return this.primary;
    if (this.activeSlot === 'secondary') return this.secondary;
    return null;
  }

  public switchSlot(slot: WeaponSlot): boolean {
    if (slot === 'primary' && !this.primary) return false;
    if (slot === 'secondary' && !this.secondary) return false;
    if (slot === 'c4' && !this.hasC4) return false;
    if (this.activeSlot === slot) return false;

    this.activeSlot = slot;
    this.reloading = false;
    this.reloadTimer = 0;
    this.scopeLevel = 0;
    this.isPlanting = false;
    this.plantProgress = 0;
    this.model.setWeapon(this.getActiveWeaponId());
    return true;
  }

  public equipWeapon(id: WeaponId): void {
    const cfg = WEAPONS[id];
    const inst: WeaponInstance = {
      id,
      ammoInMag: cfg.magSize,
      reserveAmmo: cfg.reserveAmmo,
    };
    if (cfg.slot === 'primary') {
      this.primary = inst;
      this.activeSlot = 'primary';
    } else if (cfg.slot === 'secondary') {
      this.secondary = inst;
      if (!this.primary) this.activeSlot = 'secondary';
    }
    this.reloading = false;
    this.scopeLevel = 0;
    this.model.setWeapon(this.getActiveWeaponId());
  }

  public startReload(): boolean {
    const inst = this.getActiveWeaponInstance();
    if (!inst || this.reloading) return false;
    const cfg = WEAPONS[inst.id];
    if (inst.ammoInMag >= cfg.magSize || inst.reserveAmmo <= 0) return false;

    this.reloading = true;
    this.reloadDuration = cfg.reloadTime;
    this.reloadTimer = cfg.reloadTime;
    this.scopeLevel = 0;
    return true;
  }

  public updateReload(dt: number): boolean {
    if (!this.reloading) return false;
    this.reloadTimer -= dt;
    if (this.reloadTimer <= 0) {
      const inst = this.getActiveWeaponInstance();
      if (inst) {
        const cfg = WEAPONS[inst.id];
        const needed = cfg.magSize - inst.ammoInMag;
        const load = Math.min(needed, inst.reserveAmmo);
        inst.ammoInMag += load;
        inst.reserveAmmo -= load;
      }
      this.reloading = false;
      this.reloadTimer = 0;
      return true; // reload finished this tick
    }
    return false;
  }

  public getEyePosition(): THREE.Vector3 {
    const eyeH = this.crouching ? PHYSICS.CROUCH_EYE_HEIGHT : PHYSICS.EYE_HEIGHT;
    return new THREE.Vector3(this.pos.x, this.pos.y + eyeH, this.pos.z);
  }

  public getLookDirection(): THREE.Vector3 {
    const cosPitch = Math.cos(this.pitch);
    return new THREE.Vector3(
      -Math.sin(this.yaw) * cosPitch,
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * cosPitch
    ).normalize();
  }

  /**
   * Computes exact zone-based hitbox damage with armor & helmet mitigation.
   * Headshot multiplier is strictly 2.0x chest (body); legs bypass armor.
   */
  public applyHitDamage(
    baseDamage: number,
    armorPenetration: number,
    zone: HitboxZone
  ): { finalDamage: number; killed: boolean } {
    if (!this.alive) return { finalDamage: 0, killed: false };

    const zoneMult = HITBOX_MULTIPLIERS[zone];
    let dmg = baseDamage * zoneMult;

    // Armor mitigation: legs bypass armor; head requires helmet; chest/stomach/arm use Kevlar
    const protectedByArmor =
      this.armor > 0 &&
      zone !== 'leg' &&
      (zone !== 'head' || this.hasHelmet);

    if (protectedByArmor) {
      const penetrated = dmg * armorPenetration;
      const absorbed = dmg - penetrated;
      const armorLoss = Math.ceil(absorbed * 0.55);
      if (this.armor >= armorLoss) {
        this.armor -= armorLoss;
        dmg = penetrated;
      } else {
        // Armor breaks mid-hit
        const ratio = this.armor / Math.max(1, armorLoss);
        dmg = dmg - absorbed * ratio;
        this.armor = 0;
        this.hasHelmet = false;
      }
    }

    const finalDamage = Math.max(1, Math.round(dmg));
    this.hp = Math.max(0, this.hp - finalDamage);
    const killed = this.hp <= 0;
    if (killed) {
      this.alive = false;
      this.deaths += 1;
      this.isPlanting = false;
      this.isDefusing = false;
      this.reloading = false;
      this.scopeLevel = 0;
      this.model.setDead(true);
    }

    return { finalDamage, killed };
  }
}
