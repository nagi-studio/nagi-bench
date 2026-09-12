/**
 * C4 状态机：交给某个 T -> 掉落 -> 被捡起 -> 安放 -> 倒计时 -> 拆除 / 爆炸。
 */

import type { Vec3 } from '../core/math.ts';
import { v3 } from '../core/math.ts';
import { BOMB_SITES } from '../map/dust2.ts';
import type { BombSite } from '../map/dust2.ts';

export const PLANT_TIME = 3.2;
export const DEFUSE_TIME = 7.0;
export const DEFUSE_TIME_KIT = 4.0;
export const BOMB_TIMER = 40;
export const BOMB_PICKUP_RADIUS = 1.6;
export const BOMB_DEFUSE_RADIUS = 1.8;
export const BOMB_DAMAGE_RADIUS = 22;

export type BombPhase = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface BombState {
  phase: BombPhase;
  /** 携带者 / 安放者 / 拆除者 */
  carrierId: number;
  planterId: number;
  defuserId: number;
  /** 掉落或安放后的世界位置 */
  pos: Vec3;
  site: 'A' | 'B' | null;
  /** 安放后的倒计时 */
  timer: number;
  plantProgress: number;
  defuseProgress: number;
  /** 滴滴声节拍 */
  beepAccum: number;
}

export function createBombState(): BombState {
  return {
    phase: 'carried',
    carrierId: -1,
    planterId: -1,
    defuserId: -1,
    pos: v3(),
    site: null,
    timer: BOMB_TIMER,
    plantProgress: 0,
    defuseProgress: 0,
    beepAccum: 0,
  };
}

/** 点是否在某个炸弹点范围内。 */
export function siteAt(x: number, z: number): BombSite | null {
  for (const s of BOMB_SITES) {
    if (x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1) return s;
  }
  return null;
}

export function siteById(id: 'A' | 'B'): BombSite {
  return BOMB_SITES.find((s) => s.id === id)!;
}

/** 倒计时越少滴得越快。 */
export function beepInterval(timer: number): number {
  if (timer > 25) return 1.0;
  if (timer > 15) return 0.65;
  if (timer > 7) return 0.4;
  if (timer > 3) return 0.22;
  return 0.12;
}
