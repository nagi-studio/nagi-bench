import * as THREE from 'three';
import { PHYS } from '../core/config';
import { dirFromAngles, lerp } from '../core/math';
import type { Team } from '../core/types';
import { CharacterModel } from '../gfx/CharacterModel';
import type { Hull } from '../world/Collision';
import { WEAPONS, WeaponInstance, type WeaponId, type WeaponSlot } from '../weapons/WeaponDefs';
import type { BotBrain } from '../ai/BotBrain';

/** Per-tick intent produced by a controller (human input or bot brain). */
export interface ActorInput {
  forward: number;
  right: number;
  jump: boolean;
  walk: boolean;
  crouch: boolean;
  fire: boolean;
  firePressed: boolean;
  alt: boolean;
  altPressed: boolean;
  reload: boolean;
  use: boolean;
  usePressed: boolean;
  slot: WeaponSlot | null;
  lastWeapon: boolean;
  drop: boolean;
}

export function emptyInput(): ActorInput {
  return {
    forward: 0,
    right: 0,
    jump: false,
    walk: false,
    crouch: false,
    fire: false,
    firePressed: false,
    alt: false,
    altPressed: false,
    reload: false,
    use: false,
    usePressed: false,
    slot: null,
    lastWeapon: false,
    drop: false,
  };
}

export function clearInput(i: ActorInput): void {
  i.forward = 0;
  i.right = 0;
  i.jump = false;
  i.walk = false;
  i.crouch = false;
  i.fire = false;
  i.firePressed = false;
  i.alt = false;
  i.altPressed = false;
  i.reload = false;
  i.use = false;
  i.usePressed = false;
  i.slot = null;
  i.lastWeapon = false;
  i.drop = false;
}

/**
 * A combatant (human or bot). Holds physics hull, vitals, inventory and weapon-handling state.
 * Controllers only write `input`, `yaw` and `pitch`; all game rules live in the World systems.
 */
export class Actor implements Hull {
  // identity
  readonly id: number;
  name: string;
  readonly team: Team;
  /** Driven by AI. False while the human controls this actor. */
  isBot = true;
  /** This is the human's own roster slot. */
  readonly isHumanSlot: boolean;

  // physics (Hull)
  readonly pos = new THREE.Vector3();
  readonly prevPos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  radius: number = PHYS.radius;
  height: number = PHYS.height;
  onGround = true;
  crouchAmt = 0;
  jumpHeld = false;

  // view
  yaw = 0;
  pitch = 0;
  prevYaw = 0;
  prevPitch = 0;

  // vitals
  health = 100;
  armor = 0;
  helmet = false;
  hasKit = false;
  alive = true;
  deathTime = 0;
  fallDir = 1;
  fallSide = 0;
  lastDamageTime = -100;
  lastAttacker: Actor | null = null;
  /** World-space direction the last damage came from (for HUD indicators). */
  readonly lastDamageFrom = new THREE.Vector3();

  // inventory: [primary, secondary, melee, bomb]
  readonly weapons: (WeaponInstance | null)[] = [null, null, null, null];
  slot: WeaponSlot = 2;
  lastSlot: WeaponSlot = 1;

  // weapon handling
  nextAttack = 0;
  drawEnd = 0;
  reloading = false;
  reloadStart = 0;
  reloadEnd = 0;
  scopeLevel = 0;
  rezoomAt = 0;
  rezoomLevel = 0;
  spreadBloom = 0;
  recoilIndex = 0;
  /** Accumulated recoil in degrees (pitch up, yaw right). */
  recoilPitch = 0;
  recoilYaw = 0;
  lastShotTime = -100;
  kick = 0;

  // bomb interaction
  planting = false;
  plantProgress = 0;
  defusing = false;
  defuseProgress = 0;

  // spotting: game time until which this actor shows on the enemy radar
  readonly spottedUntil: Record<Team, number> = { CT: -1, T: -1 };

  // stats
  kills = 0;
  deaths = 0;
  headshots = 0;
  roundKills = 0;
  damageDealt = 0;

  // audio helpers
  stepAccum = 0;

  readonly input: ActorInput = emptyInput();
  readonly model: CharacterModel;
  brain: BotBrain | null = null;

  constructor(id: number, name: string, team: Team, isHumanSlot: boolean) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.isHumanSlot = isHumanSlot;
    this.model = new CharacterModel(team);
  }

  get weapon(): WeaponInstance | null {
    return this.weapons[this.slot];
  }

  get weaponId(): WeaponId | null {
    return this.weapons[this.slot]?.def.id ?? null;
  }

  get hasBomb(): boolean {
    return this.weapons[3] !== null;
  }

  get eyeHeight(): number {
    return lerp(PHYS.eyeHeight, PHYS.crouchEyeHeight, this.crouchAmt);
  }

  eyePos(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + this.eyeHeight, this.pos.z);
  }

  viewDir(out: THREE.Vector3): THREE.Vector3 {
    return dirFromAngles(this.yaw, this.pitch, out);
  }

  /** Horizontal speed cap for current weapon/stance. */
  maxSpeed(): number {
    const w = this.weapon;
    let s = w ? w.def.moveSpeed : 5.75;
    if (w?.def.scope && this.scopeLevel > 0) s = w.def.scope.scopedMoveSpeed;
    if (this.input.walk) s *= PHYS.walkFactor;
    if (this.crouchAmt > 0.5) s *= PHYS.crouchFactor;
    return s;
  }

  /** Bomb planting / defusing roots the actor in place. */
  get rooted(): boolean {
    return this.planting || this.defusing;
  }

  give(id: WeaponId): WeaponInstance {
    const inst = new WeaponInstance(WEAPONS[id]);
    this.weapons[inst.def.slot] = inst;
    return inst;
  }

  /** Reset per-round state (vitals and handling, not stats). */
  resetForRound(): void {
    this.health = 100;
    this.armor = 0;
    this.helmet = false;
    this.hasKit = false;
    this.alive = true;
    this.vel.set(0, 0, 0);
    this.onGround = true;
    this.crouchAmt = 0;
    this.height = PHYS.height;
    this.weapons.fill(null);
    this.slot = 2;
    this.lastSlot = 1;
    this.nextAttack = 0;
    this.drawEnd = 0;
    this.reloading = false;
    this.scopeLevel = 0;
    this.rezoomAt = 0;
    this.spreadBloom = 0;
    this.recoilIndex = 0;
    this.recoilPitch = 0;
    this.recoilYaw = 0;
    this.kick = 0;
    this.planting = false;
    this.plantProgress = 0;
    this.defusing = false;
    this.defuseProgress = 0;
    this.lastAttacker = null;
    this.lastDamageTime = -100;
    this.roundKills = 0;
    this.spottedUntil.CT = -1;
    this.spottedUntil.T = -1;
    this.model.setVisible(true);
  }
}
