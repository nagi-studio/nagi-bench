/**
 * Actor: everything that walks, shoots and dies. Players and bots share this type — the
 * only difference is whether a `BotBrain` or the input system fills in the movement
 * command each tick, which keeps physics and combat perfectly symmetric.
 */

import { Vec3, clamp } from '../core/math.ts';
import {
  ACTOR_CROUCH_HEIGHT,
  ACTOR_HEIGHT,
  EYE_HEIGHT,
  EYE_HEIGHT_CROUCH,
  MAX_ARMOR,
  MAX_HEALTH,
  type Team,
} from './constants.ts';
import type { WeaponDef, WeaponId, WeaponSlot, Loadout } from './weapons.ts';
import { WEAPONS, weaponDef } from './weapons.ts';

export interface MoveCommand {
  /** -1 back .. +1 forward */
  forward: number;
  /** -1 left .. +1 right */
  right: number;
  jump: boolean;
  crouch: boolean;
  walk: boolean;
}

export function emptyCommand(): MoveCommand {
  return { forward: 0, right: 0, jump: false, crouch: false, walk: false };
}

export interface AmmoState {
  mag: number;
  reserve: number;
}

export type ActorController = 'player' | 'bot';

export class Actor {
  readonly id: number;
  name: string;
  team: Team;
  controller: ActorController = 'bot';

  readonly pos = new Vec3();
  readonly vel = new Vec3();
  yaw = 0;
  pitch = 0;

  health = MAX_HEALTH;
  armor = 0;
  helmet = false;
  alive = true;
  onGround = true;
  crouching = false;
  /** Horizontal speed last tick, used for footsteps, spread and animation. */
  speed = 0;

  /** Inventory: one weapon per slot. */
  loadoutSlots: Record<WeaponSlot, WeaponId | null> = {
    primary: null,
    secondary: 'usp',
    melee: 'knife',
  };
  slot: WeaponSlot = 'secondary';
  ammo = new Map<WeaponId, AmmoState>();

  nextFireAt = 0;
  reloadEndsAt = 0;
  deployEndsAt = 0;
  reloading = false;
  /** 0 = hip fire, 1..n = zoom steps of a scoped weapon. */
  scopeLevel = 0;
  /** Accumulated inaccuracy cone (radians). */
  spreadAccum = 0;
  /** Recoil applied to the view; decays back towards zero. */
  viewPunchPitch = 0;
  viewPunchYaw = 0;
  shotIndex = 0;
  /** Set while the trigger is held, so automatic weapons keep firing. */
  triggerHeld = false;

  hasBomb = false;
  hasDefuseKit = false;
  plantProgress = 0;
  defuseProgress = 0;

  kills = 0;
  deaths = 0;
  damageDealt = 0;
  /** Last actor that damaged this one — used for kill attribution on bomb deaths. */
  lastAttacker = -1;
  killedBy = -1;

  /** Animation / audio helpers driven by the sim, consumed by the renderer. */
  stepPhase = 0;
  footstepAccum = 0;
  respawnAt = 0;
  /** Cached name of the map area the actor is standing in. */
  areaLabel = '';

  command: MoveCommand = emptyCommand();

  constructor(id: number, name: string, team: Team) {
    this.id = id;
    this.name = name;
    this.team = team;
  }

  get height(): number {
    return this.crouching ? ACTOR_CROUCH_HEIGHT : ACTOR_HEIGHT;
  }

  get eyeHeight(): number {
    return this.crouching ? EYE_HEIGHT_CROUCH : EYE_HEIGHT;
  }

  eyePos(out = new Vec3()): Vec3 {
    return out.set(this.pos.x, this.pos.y + this.eyeHeight, this.pos.z);
  }

  weapon(): WeaponDef {
    const id = this.loadoutSlots[this.slot] ?? 'knife';
    return weaponDef(id);
  }

  weaponId(): WeaponId {
    return this.loadoutSlots[this.slot] ?? 'knife';
  }

  ammoFor(id: WeaponId): AmmoState {
    let a = this.ammo.get(id);
    if (!a) {
      const def = WEAPONS[id];
      a = { mag: def.magazine, reserve: def.reserveAmmo };
      this.ammo.set(id, a);
    }
    return a;
  }

  currentAmmo(): AmmoState {
    return this.ammoFor(this.weaponId());
  }

  hasSlot(slot: WeaponSlot): boolean {
    return this.loadoutSlots[slot] !== null;
  }

  /** Switch weapons; returns false when the slot is empty. */
  equip(slot: WeaponSlot, now: number): boolean {
    if (!this.hasSlot(slot) || slot === this.slot) return false;
    this.slot = slot;
    this.reloading = false;
    this.scopeLevel = 0;
    this.spreadAccum = 0;
    this.deployEndsAt = now + (slot === 'melee' ? 0.4 : 0.65);
    this.nextFireAt = Math.max(this.nextFireAt, this.deployEndsAt);
    return true;
  }

  /** Best weapon available, preferring primary > secondary > knife. */
  equipBest(now: number): void {
    if (this.hasSlot('primary') && this.ammoTotal('primary') > 0) this.equip('primary', now);
    else if (this.hasSlot('secondary') && this.ammoTotal('secondary') > 0) this.equip('secondary', now);
    else this.equip('melee', now);
  }

  ammoTotal(slot: WeaponSlot): number {
    const id = this.loadoutSlots[slot];
    if (!id) return 0;
    if (WEAPONS[id].slot === 'melee') return Infinity;
    const a = this.ammoFor(id);
    return a.mag + a.reserve;
  }

  applyLoadout(loadout: Loadout): void {
    // Swapping the inventory cancels anything the old weapon was in the middle of.
    this.reloading = false;
    this.reloadEndsAt = 0;
    this.nextFireAt = 0;
    this.deployEndsAt = 0;
    this.scopeLevel = 0;
    this.spreadAccum = 0;
    this.shotIndex = 0;
    this.loadoutSlots.primary = loadout.primary;
    this.loadoutSlots.secondary = loadout.secondary;
    this.loadoutSlots.melee = 'knife';
    this.armor = loadout.armor;
    this.helmet = loadout.helmet;
    this.ammo.clear();
    for (const id of [loadout.primary, loadout.secondary, 'knife' as WeaponId]) {
      if (!id) continue;
      const def = WEAPONS[id];
      this.ammo.set(id, { mag: def.magazine, reserve: def.reserveAmmo });
    }
    this.slot = loadout.primary ? 'primary' : 'secondary';
  }

  resetForRound(x: number, y: number, z: number, yaw: number, loadout: Loadout): void {
    this.pos.set(x, y, z);
    this.vel.set(0, 0, 0);
    this.yaw = yaw;
    this.pitch = 0;
    this.health = MAX_HEALTH;
    this.alive = true;
    this.crouching = false;
    this.onGround = true;
    this.reloading = false;
    this.scopeLevel = 0;
    this.spreadAccum = 0;
    this.viewPunchPitch = 0;
    this.viewPunchYaw = 0;
    this.shotIndex = 0;
    this.nextFireAt = 0;
    this.reloadEndsAt = 0;
    this.deployEndsAt = 0;
    this.hasBomb = false;
    this.plantProgress = 0;
    this.defuseProgress = 0;
    this.lastAttacker = -1;
    this.killedBy = -1;
    this.triggerHeld = false;
    this.command = emptyCommand();
    this.applyLoadout(loadout);
  }

  takeArmor(amount: number): void {
    this.armor = clamp(this.armor - amount, 0, MAX_ARMOR);
  }
}
