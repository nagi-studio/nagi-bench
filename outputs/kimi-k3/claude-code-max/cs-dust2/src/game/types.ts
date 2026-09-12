// ---------------------------------------------------------------------------
// 共享类型定义
// ---------------------------------------------------------------------------

export type Team = 'CT' | 'T';

export enum Slot {
  Primary = 0,
  Secondary = 1,
  Melee = 2,
}

export interface AABB {
  minX: number; minY: number; minZ: number;
  maxX: number; maxY: number; maxZ: number;
}

export type HitPart = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface Hitbox extends AABB {
  part: HitPart;
}

/** 命中部位伤害倍率（爆头 = 身体 2 倍） */
export const PART_MULTIPLIER: Record<HitPart, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.0,
  arm: 0.9,
  leg: 0.85,
};

export interface KillEntry {
  id: number;
  attacker: string;
  victim: string;
  weapon: string;
  headshot: boolean;
  atkTeam: Team;
  vicTeam: Team;
  time: number; // performance 时间戳（秒）
}

export type BombState = 'idle' | 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export type RoundPhase = 'freeze' | 'live' | 'end';

export type RoundEndReason =
  | 'elimination_t'   // T 清空 CT
  | 'elimination_ct'  // CT 清空 T
  | 'bomb_exploded'
  | 'bomb_defused'
  | 'time_up';        // 时间耗尽且未下包 -> CT 胜

export interface Rect {
  x0: number; z0: number; x1: number; z1: number;
}

export function pointInRect(x: number, z: number, r: Rect): boolean {
  return x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
}

export function rectCenter(r: Rect): { x: number; z: number } {
  return { x: (r.x0 + r.x1) / 2, z: (r.z0 + r.z1) / 2 };
}
