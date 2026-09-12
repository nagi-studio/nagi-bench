/**
 * 引擎 -> 表现层的事件总线。
 * 模拟层只管往队列里丢事件，渲染层（特效）和音频层各自消费，互不知道对方存在。
 */

import type { SurfaceKind } from '../map/dust2.ts';
import type { HitboxName, WeaponId } from './weapons.ts';
import type { Team } from './actor.ts';

export type BombEventKind =
  | 'plantStart'
  | 'plantAbort'
  | 'planted'
  | 'defuseStart'
  | 'defuseAbort'
  | 'defused'
  | 'exploded'
  | 'beep'
  | 'pickup'
  | 'dropped';

export type GameEvent =
  | {
      type: 'shot';
      actorId: number;
      weapon: WeaponId;
      x: number;
      y: number;
      z: number;
      dx: number;
      dy: number;
      dz: number;
      /** 是否是本地玩家开的枪（音量/镜头抖动不同） */
      local: boolean;
    }
  | {
      type: 'tracer';
      x0: number;
      y0: number;
      z0: number;
      x1: number;
      y1: number;
      z1: number;
      weapon: WeaponId;
    }
  | {
      type: 'impact';
      x: number;
      y: number;
      z: number;
      nx: number;
      ny: number;
      nz: number;
      surface: SurfaceKind;
    }
  | {
      type: 'hit';
      attackerId: number;
      victimId: number;
      damage: number;
      hitbox: HitboxName;
      headshot: boolean;
      x: number;
      y: number;
      z: number;
    }
  | {
      type: 'kill';
      attackerId: number;
      victimId: number;
      weapon: WeaponId;
      headshot: boolean;
    }
  | { type: 'reload'; actorId: number; weapon: WeaponId; x: number; y: number; z: number }
  | { type: 'empty'; actorId: number }
  | { type: 'switch'; actorId: number; weapon: WeaponId }
  | { type: 'scope'; actorId: number; on: boolean }
  | {
      type: 'footstep';
      actorId: number;
      x: number;
      y: number;
      z: number;
      surface: SurfaceKind;
    }
  | { type: 'land'; actorId: number; x: number; y: number; z: number; hard: boolean }
  | { type: 'bomb'; kind: BombEventKind; x: number; y: number; z: number }
  | {
      type: 'round';
      kind: 'freeze' | 'live' | 'end';
      winner?: Team;
      reason?: string;
      round?: number;
    };

export type EventSink = (e: GameEvent) => void;
