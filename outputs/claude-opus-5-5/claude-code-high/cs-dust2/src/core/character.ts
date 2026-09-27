// Character state (shared by the human player and bots) + per-tick weapon state machine.

import { BODY } from './skeleton.ts';
import type { HoldPose } from './skeleton.ts';
import type { Body } from './physics.ts';
import type { Vec3 } from './math.ts';
import { makeWeapon } from './weapons.ts';
import type { Slot, WeaponDef, WeaponId, WeaponInstance } from './weapons.ts';

export type Team = 'T' | 'CT';
export const otherTeam = (t: Team): Team => (t === 'T' ? 'CT' : 'T');

export interface ControlInput {
  forward: number;
  right: number;
  jump: boolean;
  walk: boolean;
  fire: boolean;
  alt: boolean;
  reload: boolean;
  use: boolean;
  slot: Slot | null;
  /** switch to previously used weapon */
  lastWeapon: boolean;
}

export const emptyInput = (): ControlInput => ({
  forward: 0,
  right: 0,
  jump: false,
  walk: false,
  fire: false,
  alt: false,
  reload: false,
  use: false,
  slot: null,
  lastWeapon: false,
});

export const SLOT_ORDER: Slot[] = ['primary', 'secondary', 'melee', 'bomb'];

export class Character {
  readonly id: number;
  name: string;
  team: Team;
  isBot = true;

  body: Body;
  yaw = 0;
  pitch = 0;
  /** recoil view punch (radians) added to aim */
  punchPitch = 0;
  punchYaw = 0;

  health = 100;
  armor = 0;
  helmet = false;
  hasKit = false;
  alive = true;

  weapons: Partial<Record<Slot, WeaponInstance>> = {};
  active: Slot = 'secondary';
  lastSlot: Slot = 'melee';

  nextAttack = 0;
  reloadStart = 0;
  reloadEnd = 0;
  deployEnd = 0;
  scope = 0;
  rescopeAt = 0;
  rescopeLevel = 0;
  shotsFired = 0;
  spreadAccum = 0;
  lastShotTime = -10;
  prevFire = false;
  prevAlt = false;
  prevJump = false;
  meleeSwingEnd = 0;
  meleeAlt = false;

  input: ControlInput = emptyInput();

  kills = 0;
  deaths = 0;
  headshots = 0;
  damageDealt = 0;
  roundKills = 0;

  stepAccum = 0;
  deathTime = 0;
  deathYaw = 0;
  killerId = -1;
  lastHurtTime = -10;
  lastHurtFrom: Vec3 = { x: 0, y: 0, z: 0 };
  lastHurtBy = -1;

  /** planting / defusing progress (0..1), -1 when idle */
  plantProgress = -1;
  defuseProgress = -1;

  /** smoothed horizontal speed for animation */
  animSpeed = 0;
  walkPhase = 0;
  /** incremented on each shot, lets views trigger muzzle flashes */
  shotCounter = 0;
  lastShotHit = false;

  constructor(id: number, name: string, team: Team) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.body = {
      pos: { x: 0, y: 0, z: 0 },
      vel: { x: 0, y: 0, z: 0 },
      radius: BODY.radius,
      height: BODY.height,
      onGround: true,
      landImpact: 0,
    };
  }

  get pos(): Vec3 {
    return this.body.pos;
  }

  get weapon(): WeaponInstance | undefined {
    return this.weapons[this.active];
  }

  get def(): WeaponDef | undefined {
    return this.weapon?.def;
  }

  get eyeY(): number {
    return this.body.pos.y + BODY.eyeHeight;
  }

  get holdPose(): HoldPose {
    const d = this.def;
    if (!d) return 'rifle';
    if (d.slot === 'primary') return 'rifle';
    if (d.slot === 'secondary') return 'pistol';
    if (d.slot === 'melee') return 'knife';
    return 'bomb';
  }

  get reloading(): boolean {
    return this.reloadEnd > 0;
  }

  hasBomb(): boolean {
    return !!this.weapons.bomb;
  }

  give(id: WeaponId) {
    const w = makeWeapon(id);
    this.weapons[w.def.slot] = w;
  }

  /** best available slot (primary > secondary > knife) */
  bestSlot(): Slot {
    if (this.weapons.primary) return 'primary';
    if (this.weapons.secondary) return 'secondary';
    return 'melee';
  }

  resetForRound() {
    this.health = 100;
    this.alive = true;
    this.weapons = {};
    this.scope = 0;
    this.rescopeAt = 0;
    this.reloadEnd = 0;
    this.deployEnd = 0;
    this.nextAttack = 0;
    this.punchPitch = 0;
    this.punchYaw = 0;
    this.spreadAccum = 0;
    this.shotsFired = 0;
    this.plantProgress = -1;
    this.defuseProgress = -1;
    this.body.vel.x = this.body.vel.y = this.body.vel.z = 0;
    this.body.onGround = true;
    this.input = emptyInput();
    this.killerId = -1;
    this.lastHurtTime = -10;
    this.roundKills = 0;
    this.meleeSwingEnd = 0;
  }
}
