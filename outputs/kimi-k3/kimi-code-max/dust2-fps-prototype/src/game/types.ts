import * as THREE from 'three';

export type Team = 'T' | 'CT';
export type Slot = 'primary' | 'secondary' | 'melee';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type HitPart = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface Rect {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
}

export interface FloorRect extends Rect {
  y: number;
}

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  damage: number;
  rpm: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  auto: boolean;
  /** degrees */
  spreadBase: number;
  spreadMax: number;
  bloomPerShot: number;
  recoilPitch: number;
  recoilYaw: number;
  /** damage falloff per meter */
  falloff: number;
  moveSpeed: number;
  scope: boolean;
  melee?: boolean;
  meleeRange?: number;
  tracer: number;
}

export interface WeaponState {
  def: WeaponDef;
  mag: number;
  reserve: number;
  reloadUntil: number;
}

export interface DoorPanel {
  mesh: THREE.Mesh;
  half: THREE.Vector3;
  closedPos: THREE.Vector3;
  openPos: THREE.Vector3;
  box: AABB;
}

export interface Door {
  x: number;
  z: number;
  panels: DoorPanel[];
  open: number; // 0 closed .. 1 open
}

export type BombState = 'idle' | 'carried' | 'dropped' | 'planted' | 'exploded' | 'defused';

export interface Bomb {
  state: BombState;
  pos: THREE.Vector3;
  carrierId: number;
  site: 'A' | 'B' | null;
  plantedAt: number;
  explodeAt: number;
  nextBeepAt: number;
  mesh: THREE.Group | null;
}

export interface Channel {
  kind: 'plant' | 'defuse';
  t: number;
  need: number;
}

export interface Entity {
  id: number;
  team: Team;
  name: string;
  isPlayer: boolean;
  alive: boolean;
  hp: number;
  armor: number;
  helmet: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  yaw: number;
  pitch: number;
  onGround: boolean;
  weapons: Record<Slot, WeaponState | null>;
  slot: Slot;
  switchUntil: number;
  nextFireAt: number;
  bloom: number;
  /** recoil pitch offset in degrees, recovers over time */
  recoil: number;
  hasBomb: boolean;
  channel: Channel | null;
  kills: number;
  deaths: number;
  deathAt: number;
  deathDir: number;
  stepAcc: number;
  lastSeenByT: number;
  lastSeenByCT: number;
  rig: import('./character').CharacterRig;
  bot: import('./ai').BotState | null;
}

export type RoundPhase = 'freeze' | 'live' | 'end';

export interface KillEvent {
  id: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  time: number;
}

export interface NavGrid {
  ox: number;
  oz: number;
  cell: number;
  w: number;
  h: number;
  walk: Uint8Array;
  hgt: Float32Array;
}
