// Simulation -> presentation events (audio, effects, HUD). The sim pushes, the client drains.

import type { Vec3 } from './math.ts';
import type { Team } from './character.ts';
import type { HitGroup, WeaponId } from './weapons.ts';

export type BombAction =
  | 'given'
  | 'pickup'
  | 'drop'
  | 'plant_start'
  | 'plant_abort'
  | 'planted'
  | 'defuse_start'
  | 'defuse_abort'
  | 'defused'
  | 'exploded'
  | 'beep';

export type RoundEndReason = 'elimination' | 'bomb_exploded' | 'bomb_defused' | 'time';

export type GameEvent =
  | {
      type: 'shot';
      shooter: number;
      weapon: WeaponId;
      from: Vec3;
      to: Vec3;
      /** surface normal if the bullet hit the world */
      normal: Vec3 | null;
      hitChar: number;
      tracer: boolean;
    }
  | { type: 'melee'; shooter: number; alt: boolean; hit: boolean; hitWorld: boolean }
  | {
      type: 'damage';
      victim: number;
      attacker: number;
      amount: number;
      group: HitGroup;
      pos: Vec3;
      killed: boolean;
      weapon: WeaponId;
      armorHit: boolean;
    }
  | { type: 'kill'; killer: number; victim: number; weapon: WeaponId; headshot: boolean }
  | { type: 'reload'; who: number; weapon: WeaponId; duration: number }
  | { type: 'switch'; who: number; weapon: WeaponId }
  | { type: 'scope'; who: number; level: number }
  | { type: 'empty'; who: number }
  | { type: 'footstep'; who: number; pos: Vec3; foot: number }
  | { type: 'jump'; who: number; pos: Vec3 }
  | { type: 'land'; who: number; pos: Vec3; impact: number }
  | { type: 'bomb'; action: BombAction; who: number; pos: Vec3; site?: 'A' | 'B' }
  | { type: 'round_start'; round: number; pistol: boolean }
  | { type: 'freeze_end' }
  | { type: 'round_end'; winner: Team; reason: RoundEndReason }
  | { type: 'match_end'; winner: Team };
