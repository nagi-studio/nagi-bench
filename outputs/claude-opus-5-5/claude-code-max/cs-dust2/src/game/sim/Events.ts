import type * as THREE from 'three';
import type { HitGroup, RoundEndReason, SiteId, SurfaceMaterial, Team } from '../core/types';
import type { WeaponId } from '../weapons/WeaponDefs';
import type { Actor } from './Actor';

export type DamageSource = WeaponId | 'c4' | 'fall';

/** Every gameplay event the simulation can emit. Consumers: audio, effects, HUD, AI, stats. */
export interface GameEvents {
  shot: {
    actor: Actor;
    weapon: WeaponId;
    origin: THREE.Vector3;
    end: THREE.Vector3;
    hitActor: boolean;
  };
  impact: { point: THREE.Vector3; normal: THREE.Vector3; material: SurfaceMaterial };
  damage: {
    attacker: Actor | null;
    victim: Actor;
    amount: number;
    armorDamage: number;
    group: HitGroup | null;
    point: THREE.Vector3;
    dir: THREE.Vector3;
    source: DamageSource;
  };
  kill: { killer: Actor | null; victim: Actor; weapon: DamageSource; headshot: boolean };
  reload: { actor: Actor; weapon: WeaponId };
  draw: { actor: Actor; weapon: WeaponId };
  dryFire: { actor: Actor; weapon: WeaponId };
  scope: { actor: Actor; level: number };
  footstep: { actor: Actor; pos: THREE.Vector3; loud: number };
  jump: { actor: Actor };
  land: { actor: Actor; speed: number };
  knife: { actor: Actor; alt: boolean; hit: 'none' | 'wall' | 'flesh' };
  pickup: { actor: Actor; weapon: WeaponId };
  weaponDrop: { actor: Actor; weapon: WeaponId };
  bombPickup: { actor: Actor };
  bombDrop: { actor: Actor; pos: THREE.Vector3 };
  plantStart: { actor: Actor };
  plantAbort: { actor: Actor };
  bombPlanted: { actor: Actor; site: SiteId; pos: THREE.Vector3 };
  bombBeep: { pos: THREE.Vector3; urgency: number };
  defuseStart: { actor: Actor; kit: boolean };
  defuseAbort: { actor: Actor };
  bombDefused: { actor: Actor };
  bombExploded: { pos: THREE.Vector3 };
  roundStart: { round: number; pistol: boolean };
  roundLive: { round: number };
  roundEnd: { winner: Team; reason: RoundEndReason };
  matchEnd: { winner: Team };
  message: { text: string; team?: Team; duration?: number };
}
