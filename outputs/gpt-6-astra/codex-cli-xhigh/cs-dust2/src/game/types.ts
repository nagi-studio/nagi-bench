import type * as THREE from 'three';
import type { HitZone, Slot, WeaponId, WeaponState } from './weapons';

export type Team = 'CT' | 'T';
export type AIState = 'advance' | 'engage' | 'recover' | 'plant' | 'defuse' | 'guard';
export interface Actor {
  id: number; name: string; team: Team; position: THREE.Vector3; velocityY: number;
  yaw: number; hp: number; armor: number; alive: boolean; grounded: boolean;
  inventory: Partial<Record<Slot, WeaponState>>; slot: Slot;
  cooldown: number; reloadTime: number; kills: number; deaths: number;
  group: THREE.Group; hitboxes: THREE.Mesh[]; limbs: THREE.Group[];
  ai: { state: AIState; path: THREE.Vector3[]; think: number; target: number | null; destination: THREE.Vector3 | null; route: number; reaction: number; repath: number };
  moving: number; step: number; lastSeen: number;
}
export interface GameConfig { team: Team; pistolRound: boolean; primary: 'ak47' | 'm4a4' | 'awp'; secondary: 'default' | 'deagle' }
export interface KillEvent { id: number; attacker: string; victim: string; team: Team; weapon: WeaponId; headshot: boolean; time: number }
export interface BombState { state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'; carrier: number | null; position: THREE.Vector3; timer: number; progress: number; actor: number | null; site: 'A' | 'B' | null }
export interface GameSnapshot {
  ready: boolean; started: boolean; paused: boolean; locked: boolean; error: string;
  phase: 'freeze' | 'live' | 'over'; round: number; timer: number; score: Record<Team, number>;
  winner: Team | null; result: string; playerId: number; team: Team; hp: number; armor: number;
  weapon: WeaponId; ammo: number; reserve: number; reload: number; slots: Partial<Record<Slot, WeaponId>>;
  scoped: boolean; spread: number; hit: number; headshot: boolean; hurt: number; kills: KillEvent[];
  actors: { id: number; name: string; team: Team; hp: number; armor: number; alive: boolean; x: number; z: number; yaw: number; visible: boolean; kills: number; deaths: number; weapon: WeaponId; bomb: boolean }[];
  bomb: { state: BombState['state']; carrier: number | null; x: number; z: number; timer: number; progress: number; site: 'A' | 'B' | null };
  interaction: string; progress: number; location: string; alive: boolean; spectator: string;
  muted: boolean; elapsed: number; lastHitZone: HitZone | null; fps: number;
}
