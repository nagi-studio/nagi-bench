import type { Group } from 'three';

export type Team = 'T' | 'CT';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type HitZone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';
export type Phase = 'menu' | 'freeze' | 'live' | 'over';
export type BotState = 'advance' | 'patrol' | 'engage' | 'plant' | 'defuse' | 'retrieve';
export interface Point { x: number; z: number }
export interface Box { x: number; z: number; w: number; d: number; minY: number; maxY: number; kind: 'wall' | 'crate' | 'door' | 'roof' }
export interface Rect { x1: number; x2: number; z1: number; z2: number; name: string }
export interface Ammo { mag: number; reserve: number }
export interface Settings { team: Team; pistolOpening: boolean; primary: 'ak47' | 'm4a4' | 'awp'; sidearm: 'default' | 'deagle'; sensitivity: number; volume: number }
export interface CharacterVisual {
  root: Group;
  leftLeg: Group;
  rightLeg: Group;
  leftArm: Group;
  rightArm: Group;
  weapon: Group;
  flash: Group;
}
export interface Actor {
  id: number; name: string; team: Team;
  x: number; y: number; z: number; prevX: number; prevY: number; prevZ: number;
  yaw: number; pitch: number; vy: number; grounded: boolean;
  hp: number; armor: number; alive: boolean;
  primary: WeaponId | null; secondary: WeaponId; slot: Slot;
  ammo: Partial<Record<WeaponId, Ammo>>;
  nextShot: number; reloadEnd: number; reloading: WeaponId | null;
  bloom: number; recoil: number; walk: number; step: number; moving: boolean;
  kills: number; deaths: number; damage: number;
  state: BotState; path: Point[]; pathIndex: number; repathAt: number;
  destination: Point | null; route: Point[]; routeIndex: number;
  target: number | null; reactionAt: number; thinkAt: number; strafe: number;
  actionProgress: number; lastHurt: number; lastSeen: number;
  visual: CharacterVisual;
}
export interface Bomb {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  carrier: number | null; x: number; y: number; z: number;
  site: 'A' | 'B' | null; plantedAt: number; explodeAt: number;
  actionActor: number | null; progress: number; nextBeep: number;
  vy?: number;
}
export interface FeedItem { id: number; killer: string; victim: string; team: Team; weapon: WeaponId | 'c4'; headshot: boolean; at: number; player: boolean }
export interface RadarActor { id: number; name: string; team: Team; x: number; z: number; yaw: number; hp: number; alive: boolean; visible: boolean; kills: number; deaths: number; weapon: WeaponId }
export interface Snapshot {
  phase: Phase; paused: boolean; started: boolean; time: number; round: number; timer: number;
  scoreT: number; scoreCT: number; team: Team; aliveT: number; aliveCT: number;
  player: { id: number; name: string; hp: number; armor: number; x: number; z: number; yaw: number; zone: string; weapon: WeaponId; primary: WeaponId | null; secondary: WeaponId; slot: Slot; mag: number; reserve: number; reloading: boolean; reloadProgress: number; hasBomb: boolean; scoped: boolean; spread: number };
  actors: RadarActor[]; feed: FeedItem[]; bomb: Bomb; spectating: boolean; winner: Team | null; reason: string;
  action: { label: string; progress: number } | null; hint: string; hitMarker: number; headshot: boolean; hurt: number; fps: number; pistol: boolean;
}
