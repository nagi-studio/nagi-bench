// Shared enums / interfaces used across engine + UI.

export enum Team {
  T = 0,
  CT = 1,
}

export enum HitZone {
  Head = 0,
  Chest = 1,
  Stomach = 2,
  Arm = 3,
  Leg = 4,
}

export type WeaponSlot = 'primary' | 'secondary' | 'melee';

export type WeaponId =
  | 'ak47'
  | 'm4a4'
  | 'awp'
  | 'glock'
  | 'usp'
  | 'deagle'
  | 'knife';

export enum RoundPhase {
  Warmup = 0,
  Freeze = 1,
  Live = 2,
  Over = 3,
}

export enum BombState {
  Carried = 0,
  Dropped = 1,
  Planted = 2,
  Defused = 3,
  Exploded = 4,
}

export interface KillEvent {
  id: number;
  attacker: string;
  victim: string;
  attackerTeam: Team;
  victimTeam: Team;
  weapon: WeaponId;
  headshot: boolean;
  time: number;
}
