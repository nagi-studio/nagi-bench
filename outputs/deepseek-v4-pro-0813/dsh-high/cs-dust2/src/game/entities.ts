import * as THREE from 'three';
import type { HitboxZone, Team, WeaponDef, WeaponSlot } from './types';
import { WEAPONS, PLAYER_HEIGHT, PLAYER_HALF, EYE_HEIGHT } from './config';
import { createHumanoid, type HumanoidModel } from './models';
import type { BotBrain } from './ai';

export interface AmmoState {
  mag: number;
  reserve: number;
}

export interface Hitbox {
  zone: HitboxZone;
  min: THREE.Vector3;
  max: THREE.Vector3;
}

let nextId = 1;

export class Player {
  id: number;
  name: string;
  team: Team;
  isBot: boolean;
  // movement / physics
  pos: THREE.Vector3; // feet position
  vel: THREE.Vector3;
  yaw = 0;
  pitch = 0;
  grounded = false;
  moving = false;
  sprinting = false;
  walkTime = 0;
  footstepAccum = 0;
  // health
  hp = 100;
  armor = 0;
  alive = true;
  // inventory
  primary: string | null = null;
  secondary: string;
  currentSlot: WeaponSlot = 'secondary';
  ammo: Record<string, AmmoState> = {};
  // weapon runtime
  cooldown = 0;
  reloading = false;
  reloadEnd = 0;
  spread = 0;
  recoilPitchKick = 0;
  recoilYawKick = 0;
  switchTimer = 0;
  scoped = false;
  // model
  model: THREE.Group;
  limbs: HumanoidModel;
  viewModel: THREE.Group;
  // c4
  carriesBomb = false;
  // economy
  money = 0;
  kills = 0;
  // action (plant / defuse)
  action: 'plant' | 'defuse' | null = null;
  actionProgress = 0;
  actionInterrupted = false;
  beepAccum = 0;
  // ai brain
  ai: BotBrain | null = null;
  humanControlled = false;
  lastDamageTime = -10;
  // desired movement input (set by human controller or AI)
  moveF = 0;
  moveS = 0;
  jumpRequest = false;
  walkRequest = false;

  constructor(team: Team, name: string, isBot: boolean, weaponId: string) {
    this.id = nextId++;
    this.team = team;
    this.name = name;
    this.isBot = isBot;
    this.secondary = weaponId;
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.limbs = createHumanoid(team, weaponId);
    this.model = this.limbs.group;
    this.viewModel = new THREE.Group();
    this.giveWeapon(weaponId);
  }

  giveWeapon(weaponId: string): void {
    const def = WEAPONS[weaponId];
    if (!def) return;
    if (def.slot === 'primary') this.primary = weaponId;
    else if (def.slot === 'secondary') this.secondary = weaponId;
    this.ammo[weaponId] = { mag: def.magSize, reserve: def.reserve };
  }

  equipPrimary(): void {
    if (this.primary) {
      this.currentSlot = 'primary';
      this.switchTimer = 0.35;
      this.scoped = false;
    }
  }

  equipSecondary(): void {
    this.currentSlot = 'secondary';
    this.switchTimer = 0.35;
    this.scoped = false;
  }

  equipKnife(): void {
    this.currentSlot = 'knife';
    this.switchTimer = 0.25;
    this.scoped = false;
  }

  currentWeaponId(): string {
    if (this.currentSlot === 'primary') return this.primary ?? this.secondary;
    if (this.currentSlot === 'secondary') return this.secondary;
    return 'knife';
  }

  currentWeapon(): WeaponDef {
    return WEAPONS[this.currentWeaponId()];
  }

  currentAmmo(): AmmoState {
    return this.ammo[this.currentWeaponId()] ?? { mag: 0, reserve: 0 };
  }

  eyePosition(): THREE.Vector3 {
    return new THREE.Vector3(this.pos.x, this.pos.y + EYE_HEIGHT, this.pos.z);
  }

  /** axis-aligned hitboxes (world space) */
  hitboxes(): Hitbox[] {
    const p = this.pos;
    const out: Hitbox[] = [];
    const cy = p.y;
    // head
    out.push({ zone: 'head', min: new THREE.Vector3(p.x - 0.13, cy + 1.48, p.z - 0.13), max: new THREE.Vector3(p.x + 0.13, cy + 1.78, p.z + 0.13) });
    // chest
    out.push({ zone: 'chest', min: new THREE.Vector3(p.x - 0.26, cy + 1.2, p.z - 0.18), max: new THREE.Vector3(p.x + 0.26, cy + 1.46, p.z + 0.18) });
    // stomach
    out.push({ zone: 'stomach', min: new THREE.Vector3(p.x - 0.23, cy + 0.88, p.z - 0.16), max: new THREE.Vector3(p.x + 0.23, cy + 1.18, p.z + 0.16) });
    // arms (two)
    out.push({ zone: 'arm', min: new THREE.Vector3(p.x - 0.46, cy + 1.0, p.z - 0.16), max: new THREE.Vector3(p.x - 0.22, cy + 1.48, p.z + 0.16) });
    out.push({ zone: 'arm', min: new THREE.Vector3(p.x + 0.22, cy + 1.0, p.z - 0.16), max: new THREE.Vector3(p.x + 0.46, cy + 1.48, p.z + 0.16) });
    // legs (two)
    out.push({ zone: 'leg', min: new THREE.Vector3(p.x - 0.26, cy + 0.0, p.z - 0.18), max: new THREE.Vector3(p.x - 0.04, cy + 0.88, p.z + 0.18) });
    out.push({ zone: 'leg', min: new THREE.Vector3(p.x + 0.04, cy + 0.0, p.z - 0.18), max: new THREE.Vector3(p.x + 0.26, cy + 0.88, p.z + 0.18) });
    return out;
  }

  /** player AABB used for movement collision */
  aabb(): { min: THREE.Vector3; max: THREE.Vector3 } {
    return {
      min: new THREE.Vector3(this.pos.x - PLAYER_HALF, this.pos.y, this.pos.z - PLAYER_HALF),
      max: new THREE.Vector3(this.pos.x + PLAYER_HALF, this.pos.y + PLAYER_HEIGHT, this.pos.z + PLAYER_HALF),
    };
  }
}
