export type Team = 'CT' | 'T';
export type ZoneId =
  | 't-spawn' | 'ct-spawn' | 'long' | 'site-a' | 'mid' | 'mid-door'
  | 'catwalk' | 'tunnel' | 'site-b';

export interface Wall {
  x1: number; z1: number; x2: number; z2: number; h: number;
}

export type HitZone = 'head' | 'chest' | 'belly' | 'arm' | 'leg';

export interface WeaponDef {
  id: string;
  name: string;
  slot: 'primary' | 'secondary' | 'melee';
  damage: number;
  headMult: number;
  rpm: number;
  mag: number;
  reserve: number;
  spread: number;
  recoil: number;
  range: number;
  auto: boolean;
  scoped?: boolean;
  armorPen: number;
}

export interface FighterState {
  id: number;
  name: string;
  team: Team;
  hp: number;
  armor: number;
  alive: boolean;
  hasBomb: boolean;
  primary: WeaponDef | null;
  secondary: WeaponDef;
  melee: WeaponDef;
  slot: 'primary' | 'secondary' | 'melee';
  x: number; z: number; y: number;
  yaw: number;
}

export interface KillMsg {
  killer: string;
  victim: string;
  weapon: string;
  headshot: boolean;
  teamKill: boolean;
}

export interface HudState {
  hp: number;
  armor: number;
  mag: number;
  reserve: number;
  weapon: string;
  slot: string;
  round: number;
  scoreCT: number;
  scoreT: number;
  phase: string;
  bomb: string;
  scoped: boolean;
  dead: boolean;
  kills: KillMsg[];
  c4x: number | null;
  c4z: number | null;
  actors: { x: number; z: number; team: Team; me: boolean; seen: boolean }[];
  msg: string;
}
