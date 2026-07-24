/**
 * Simulation -> presentation event queue.
 *
 * The sim never talks to three.js, the DOM or the audio context directly. It appends
 * events to a queue that the renderer, the audio engine and the React store all drain
 * once per frame. That is the whole sim/render contract.
 */

import type { Vec3 } from '../core/math.ts';
import type { Team } from './constants.ts';
import type { HitPart } from './hitbox.ts';
import type { SolidKind } from './map/collision.ts';
import type { WeaponId } from './weapons.ts';

export type RoundEndReason = 'tEliminated' | 'ctEliminated' | 'bombExploded' | 'bombDefused' | 'timeout';

export type GameEvent =
  | {
      type: 'shot';
      actorId: number;
      weapon: WeaponId;
      origin: Vec3;
      dir: Vec3;
      end: Vec3;
      hitActor: number;
      firstPerson: boolean;
    }
  | { type: 'impact'; point: Vec3; normal: Vec3; surface: SolidKind }
  | { type: 'dryfire'; actorId: number; firstPerson: boolean }
  | {
      type: 'hit';
      attacker: number;
      victim: number;
      part: HitPart;
      damage: number;
      point: Vec3;
      byPlayer: boolean;
      onPlayer: boolean;
    }
  | {
      type: 'kill';
      attacker: number;
      victim: number;
      attackerName: string;
      victimName: string;
      attackerTeam: Team;
      victimTeam: Team;
      weapon: WeaponId | 'bomb' | 'world';
      headshot: boolean;
      byPlayer: boolean;
      onPlayer: boolean;
    }
  | { type: 'reload'; actorId: number; weapon: WeaponId; firstPerson: boolean; pos: Vec3 }
  | { type: 'reloadDone'; actorId: number; weapon: WeaponId; firstPerson: boolean; pos: Vec3 }
  | { type: 'switch'; actorId: number; weapon: WeaponId; firstPerson: boolean; pos: Vec3 }
  | { type: 'scope'; actorId: number; level: number; firstPerson: boolean }
  | { type: 'footstep'; actorId: number; pos: Vec3; loud: boolean }
  | { type: 'jump'; actorId: number; pos: Vec3 }
  | { type: 'land'; actorId: number; pos: Vec3; hard: boolean }
  | { type: 'bombPickup'; actorId: number }
  | { type: 'bombDrop'; pos: Vec3 }
  | { type: 'plantStart'; actorId: number; pos: Vec3 }
  | { type: 'plantAbort'; actorId: number }
  | { type: 'plantDone'; actorId: number; site: 'A' | 'B'; pos: Vec3 }
  | { type: 'defuseStart'; actorId: number; pos: Vec3; kit: boolean }
  | { type: 'defuseAbort'; actorId: number }
  | { type: 'defuseDone'; actorId: number; pos: Vec3 }
  | { type: 'bombBeep'; pos: Vec3; urgency: number }
  | { type: 'explode'; pos: Vec3 }
  | { type: 'roundStart'; round: number; pistolRound: boolean }
  | { type: 'roundEnd'; winner: Team; reason: RoundEndReason; scoreCT: number; scoreT: number }
  | { type: 'matchEnd'; winner: Team }
  | { type: 'takeover'; actorId: number; name: string };

export type EventQueue = GameEvent[];
