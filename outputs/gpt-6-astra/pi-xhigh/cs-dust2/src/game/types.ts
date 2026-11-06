import type * as THREE from 'three';

export type Team = 'T' | 'CT';
export type WeaponId = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type Zone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';
export type Task = 'advance' | 'engage' | 'plant' | 'defuse' | 'recover' | 'guard';
export interface WeaponData {
  id: WeaponId; name: string; slot: Slot; damage: number; magazine: number; reserve: number;
  interval: number; reload: number; recoil: number; spread: number; range: number; automatic: boolean;
}
export interface Gun { id: WeaponId; ammo: number; reserve: number }
export interface Inventory { primary: Gun | null; secondary: Gun; melee: Gun }
export interface CharacterModel {
  group: THREE.Group; head: THREE.Group; legs: THREE.Group[]; arms: THREE.Group[];
  weapon: THREE.Group; hitboxes: THREE.Mesh[];
}
export interface Actor {
  id: number; name: string; team: Team; pos: THREE.Vector3; yaw: number; pitch: number;
  velocityY: number; grounded: boolean; hp: number; armor: number; alive: boolean;
  inventory: Inventory; slot: Slot; reloadUntil: number; nextShot: number; recoil: number;
  model: CharacterModel; path: THREE.Vector3[]; goal: THREE.Vector3 | null; repathAt: number;
  target: number | null; task: Task; reactionAt: number; moving: boolean;
  stepAt: number; lastSeen: number; lastAttacker: number | null; route: THREE.Vector3[];
  routeIndex: number; stuckTime: number; oldPos: THREE.Vector3; personality: number;
}
export interface AABB { minX: number; maxX: number; minZ: number; maxZ: number; minY: number; maxY: number }
export interface Bomb {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'; carrier: number | null;
  pos: THREE.Vector3; site: 'A' | 'B' | null; explodeAt: number; actor: number | null;
  progress: number; beepAt: number;
}
export interface Feed { id: number; killer: string; victim: string; team: Team; weapon: string; head: boolean; at: number }
export interface RoundResult { winner: Team; reason: string }
export interface Settings { team: Team; pistol: boolean; primary: WeaponId; secondary: WeaponId; volume: number; sensitivity: number }
export interface Snapshot {
  mode: 'menu' | 'playing'; locked: boolean; round: number; time: number; timeLeft: number;
  scores: Record<Team, number>; playerId: number; hp: number; armor: number; weapon: WeaponId;
  inventory: Inventory; ammo: number; reserve: number; reload: number; scoped: boolean;
  spread: number; hit: number; hurt: number; kills: number; deaths: number; fps: number;
  actors: { id: number; name: string; team: Team; x: number; z: number; yaw: number; alive: boolean; hp: number; seen: boolean; kills: number; deaths: number }[];
  feed: Feed[]; bomb: { state: Bomb['state']; carrier: number | null; x: number; z: number; site: string | null; remaining: number; progress: number; action: string };
  prompt: string; location: string; result: RoundResult | null; nextRound: number; buyAllowed: boolean;
}
