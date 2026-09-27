import type * as THREE from 'three';

export type Team = 'T' | 'CT';
export type WeaponId = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type Region = 'T 出生点' | 'CT 出生点' | 'A 大' | 'A 点' | '中路' | '中门' | '猫道' | 'B 洞' | 'B 点' | '连接通道';
export type Phase = 'menu' | 'live' | 'ended';
export type BotMode = 'patrol' | 'attack' | 'plant' | 'defuse' | 'defend' | 'chase';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface Vec2 { x: number; z: number }
export interface Box2 { x: number; z: number; w: number; d: number; h: number; kind: 'wall' | 'crate' | 'door' }
export interface WeaponDef {
  id: WeaponId; name: string; slot: Slot; damage: number; rpm: number; magazine: number;
  reserve: number; reload: number; spread: number; recoil: number; range: number;
  automatic: boolean; color: number;
}
export interface Actor {
  id: number; name: string; team: Team; pos: THREE.Vector3; yaw: number; pitch: number;
  hp: number; armor: number; alive: boolean; velocityY: number; grounded: boolean;
  weapons: Partial<Record<Slot, WeaponId>>; equipped: Slot;
  ammo: Partial<Record<WeaponId, number>>; reserve: Partial<Record<WeaponId, number>>;
  nextShot: number; reloadEnd: number; shotHeat: number; recoilKick: number;
  hasBomb: boolean; kills: number; deaths: number;
  mesh: THREE.Group; gunMesh: THREE.Group;
  botMode: BotMode; goal: Vec2; path: Vec2[]; pathIndex: number; pathTimer: number;
  targetId: number | null; lastSeen: number; strafeSign: number; strafeTimer: number;
  actionProgress: number; footstepTimer: number; spawn: Vec2;
}
export interface BombState {
  mode: 'carried' | 'dropped' | 'planted' | 'none';
  pos: Vec2; carrierId: number | null; site: 'A' | 'B' | null;
  timer: number; mesh: THREE.Group | null; beepTimer: number;
}
export interface FeedItem { id: number; killer: string; victim: string; weapon: string; team: Team; headshot: boolean }
export interface MiniActor { id: number; x: number; z: number; team: Team; visible: boolean; alive: boolean; controlled: boolean }
export interface Snapshot {
  phase: Phase; team: Team; mode: 'pistol' | 'full'; round: number;
  time: number; scoreT: number; scoreCT: number; region: Region;
  hp: number; armor: number; alive: boolean; spectating: boolean; name: string;
  weapon: WeaponId; weaponName: string; ammo: number; reserve: number; reloading: boolean;
  scoped: boolean; spread: number; kills: number; deaths: number;
  tAlive: number; ctAlive: number; bomb: { mode: BombState['mode']; x: number; z: number; timer: number; site: 'A' | 'B' | null; carrierId: number | null };
  actors: MiniActor[]; feed: FeedItem[]; message: string; action: string; actionProgress: number;
  pointerLocked: boolean;
}
