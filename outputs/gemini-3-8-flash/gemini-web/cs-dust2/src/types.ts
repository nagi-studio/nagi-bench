import * as THREE from 'three';

export type Team = 'CT' | 'T';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'deagle' | 'usp' | 'knife' | 'c4';

export interface WeaponSpec {
  id: WeaponId;
  name: string;
  sub: string;
  slot: number;
  damage: number;
  armorPen: number;
  fireInterval: number;
  recoilKick: number;
  spread: number;
  magSize: number;
  reserve: number;
  reloadTime: number;
  color: number;
  isSniper?: boolean;
  isPistol?: boolean;
  isMelee?: boolean;
  isC4?: boolean;
  range?: number;
}

export type HitboxZone = 'head' | 'chest' | 'abdomen' | 'arms' | 'legs';

export interface HitboxData {
  zone: HitboxZone;
  mult: number;
  owner: Soldier;
}

export interface ObstacleBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  maxY: number;
  cx: number;
  cz: number;
  w: number;
  d: number;
}

export interface BombSite {
  name: string;
  x: number;
  z: number;
  radius: number;
}

export type C4State = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export type SoldierState = 'patrol' | 'combat' | 'plant' | 'defuse' | 'search';

export interface Soldier {
  id: string;
  name: string;
  team: Team;
  isHuman: boolean;
  alive: boolean;
  hp: number;
  armor: number;
  pos: THREE.Vector3;
  velY: number;
  yaw: number;
  pitch: number;
  root: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  heldGun: THREE.Mesh;
  hitboxes: THREE.Mesh[];
  weaponId: WeaponId;
  mag: number;
  reserve: number;
  fireCooldown: number;
  reloadTimer: number;
  hasC4: boolean;
  route: [number, number][];
  waypointIdx: number;
  strafeTimer: number;
  strafeDir: number;
  state: SoldierState;
  target: Soldier | null;
  reactionTimer: number;
}

export interface KillfeedItem {
  id: string;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weaponName: string;
  isHeadshot: boolean;
}

export interface RadarSoldier {
  id: string;
  team: Team;
  x: number;
  z: number;
  yaw: number;
  isHuman: boolean;
  alive: boolean;
}

export interface GameSnapshot {
  hp: number;
  armor: number;
  playerName: string;
  playerTeam: Team;
  weaponId: WeaponId;
  weaponName: string;
  weaponSub: string;
  mag: number;
  reserve: number;
  isScoped: boolean;
  ctScore: number;
  tScore: number;
  ctAlive: number;
  tAlive: number;
  roundTime: number;
  c4Status: C4State;
  c4Countdown: number;
  c4Progress: number;
  isActionHolding: boolean;
  actionText: string;
  banner: string;
  zone: string;
  soldiers: RadarSoldier[];
  c4Position: { x: number; z: number } | null;
  isPistolRound: boolean;
  crosshairSpread: number;
}
