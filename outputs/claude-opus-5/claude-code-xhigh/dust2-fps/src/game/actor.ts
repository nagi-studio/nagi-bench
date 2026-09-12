/**
 * 角色实体：玩家和 AI 用完全相同的数据结构与物理，区别只在于"谁来填 intent"。
 * 这样接管 bot 只是把 controlledBy 改一下，不需要任何特殊处理。
 */

import type { Vec3 } from '../core/math.ts';
import { v3 } from '../core/math.ts';
import type { HitboxName, WeaponId, WeaponSlot } from './weapons.ts';
import { HITBOX_MULT, WEAPONS } from './weapons.ts';

export type Team = 'T' | 'CT';

export const PLAYER_RADIUS = 0.4;
export const STAND_HEIGHT = 1.8;
export const CROUCH_HEIGHT = 1.32;
export const STAND_EYE = 1.66;
export const CROUCH_EYE = 1.16;

export interface WeaponState {
  id: WeaponId;
  ammo: number;
  reserve: number;
}

/** 每帧的操作意图，玩家由输入填，bot 由 AI 填。 */
export interface Intent {
  /** 前后 -1..1（+1 前进） */
  forward: number;
  /** 左右 -1..1（+1 右） */
  strafe: number;
  jump: boolean;
  crouch: boolean;
  walk: boolean;
  fire: boolean;
  /** 上一帧未按、这一帧按下（半自动武器用） */
  firePressed: boolean;
  reload: boolean;
  use: boolean;
  scope: boolean;
  switchTo: WeaponSlot | null;
}

export function createIntent(): Intent {
  return {
    forward: 0,
    strafe: 0,
    jump: false,
    crouch: false,
    walk: false,
    fire: false,
    firePressed: false,
    reload: false,
    use: false,
    scope: false,
    switchTo: null,
  };
}

export type BotMode =
  | 'idle'
  | 'advance'
  | 'engage'
  | 'search'
  | 'plant'
  | 'defuse'
  | 'hold'
  | 'retreat'
  | 'pickup';

export interface BotState {
  mode: BotMode;
  /** 技能 0..1，影响反应时间、瞄准误差、开火节奏 */
  skill: number;
  /** 当前路径与进度 */
  path: Vec3[];
  pathIndex: number;
  repathTimer: number;
  /** 最终目的地 */
  goal: Vec3;
  goalKind: 'site' | 'stage' | 'hold' | 'roam' | 'bomb' | 'enemy' | 'none';
  /** 目标敌人 */
  targetId: number;
  /** 看到目标的时间（用于反应延迟） */
  seenAt: number;
  /** 发现目标那一刻，准星离目标差多少弧度——架点预瞄的人这个值很小，反应就快 */
  acquireOffset: number;
  lostAt: number;
  lastKnown: Vec3;
  /** 瞄准误差状态 */
  aimYawErr: number;
  aimPitchErr: number;
  aimErrTimer: number;
  /** 开火节奏 */
  burstTimer: number;
  burstShots: number;
  /** 卡住检测 */
  stuckTimer: number;
  lastPos: Vec3;
  /** 防守朝向 */
  holdYaw: number;
  /** 下一次决策时间 */
  thinkTimer: number;
  /** 分配的站位（A/B/中） */
  assignment: 'A' | 'B' | 'mid';
  /** 侧身走位计时 */
  strafeDir: number;
  strafeTimer: number;
}

export interface Actor {
  id: number;
  team: Team;
  name: string;
  /** 是否由 AI 驱动（玩家接管后为 false） */
  bot: boolean;

  alive: boolean;
  health: number;
  armor: number;
  helmet: boolean;

  /** 脚底位置 */
  pos: Vec3;
  /** 上一物理帧位置，渲染插值用 */
  prevPos: Vec3;
  vel: Vec3;
  yaw: number;
  pitch: number;
  /** 上一物理帧朝向，渲染插值用 */
  prevYaw: number;
  grounded: boolean;
  crouching: boolean;
  height: number;
  eyeHeight: number;

  /** 水平速度大小，动画与精度用 */
  speed: number;

  inventory: Partial<Record<WeaponSlot, WeaponState>>;
  activeSlot: WeaponSlot;
  /** 切枪剩余时间 */
  deployTimer: number;
  reloadTimer: number;
  fireCooldown: number;
  /** 上一次开火时间，用于后坐力复位 */
  lastShotTime: number;
  recoilIndex: number;
  /** 当前累计扩散（弧度） */
  spread: number;
  /** 视角冲击（会加到瞄准方向上，并缓慢回落） */
  punchPitch: number;
  punchYaw: number;
  /** 回落目标，用于 CS 式"抬起来再放回去" */
  punchPitchVel: number;
  punchYawVel: number;
  scoped: boolean;
  scopeLevel: number;

  hasBomb: boolean;
  plantProgress: number;
  defuseProgress: number;
  /** 正在下包/拆包，锁定移动 */
  busy: boolean;

  money: number;
  kills: number;
  deaths: number;
  assists: number;

  /** 受击闪烁与击退动画 */
  flinch: number;
  lastHitBy: number;
  lastHitTime: number;

  /** 行走动画相位 */
  animPhase: number;
  footstepAccum: number;
  /** 死亡动画计时 */
  deathTime: number;
  deathYaw: number;

  intent: Intent;
  ai: BotState | null;
}

let nextActorId = 1;

export function createActor(team: Team, name: string, bot: boolean): Actor {
  return {
    id: nextActorId++,
    team,
    name,
    bot,
    alive: true,
    health: 100,
    armor: 0,
    helmet: false,
    pos: v3(),
    prevPos: v3(),
    vel: v3(),
    yaw: 0,
    pitch: 0,
    prevYaw: 0,
    grounded: true,
    crouching: false,
    height: STAND_HEIGHT,
    eyeHeight: STAND_EYE,
    speed: 0,
    inventory: {},
    activeSlot: 'melee',
    deployTimer: 0,
    reloadTimer: 0,
    fireCooldown: 0,
    lastShotTime: -99,
    recoilIndex: 0,
    spread: 0,
    punchPitch: 0,
    punchYaw: 0,
    punchPitchVel: 0,
    punchYawVel: 0,
    scoped: false,
    scopeLevel: 0,
    hasBomb: false,
    plantProgress: 0,
    defuseProgress: 0,
    busy: false,
    money: 800,
    kills: 0,
    deaths: 0,
    assists: 0,
    flinch: 0,
    lastHitBy: -1,
    lastHitTime: -99,
    animPhase: 0,
    footstepAccum: 0,
    deathTime: 0,
    deathYaw: 0,
    intent: createIntent(),
    ai: null,
  };
}

export function resetActorIds(): void {
  nextActorId = 1;
}

export function activeWeapon(a: Actor): WeaponState | null {
  return a.inventory[a.activeSlot] ?? null;
}

export function activeWeaponDef(a: Actor) {
  const w = activeWeapon(a);
  return w ? WEAPONS[w.id] : WEAPONS.knife;
}

export function eyePos(a: Actor, out: Vec3): Vec3 {
  out.x = a.pos.x;
  out.y = a.pos.y + a.eyeHeight;
  out.z = a.pos.z;
  return out;
}

export function giveWeapon(a: Actor, id: WeaponId, ammoFull = true): void {
  const def = WEAPONS[id];
  a.inventory[def.slot] = {
    id,
    ammo: ammoFull ? def.magSize : 0,
    reserve: def.reserve,
  };
}

export function dropWeapon(a: Actor, slot: WeaponSlot): void {
  delete a.inventory[slot];
}

/** 切到某个槽位；没有该武器就忽略。 */
export function switchSlot(a: Actor, slot: WeaponSlot): boolean {
  if (slot === a.activeSlot) return false;
  const w = a.inventory[slot];
  if (!w) return false;
  a.activeSlot = slot;
  a.deployTimer = WEAPONS[w.id].deployTime;
  a.reloadTimer = 0;
  a.recoilIndex = 0;
  a.spread = 0;
  a.scoped = false;
  return true;
}

/** 最佳可用槽位（AI 切枪用）。 */
export function bestSlot(a: Actor): WeaponSlot {
  if (a.inventory.primary && a.inventory.primary.ammo + a.inventory.primary.reserve > 0) {
    return 'primary';
  }
  if (a.inventory.secondary && a.inventory.secondary.ammo + a.inventory.secondary.reserve > 0) {
    return 'secondary';
  }
  return 'melee';
}

/* -------------------------------------------------------------------------- */
/* 命中盒                                                                      */
/* -------------------------------------------------------------------------- */

export interface HitboxDef {
  name: HitboxName;
  /** 局部中心（脚底为原点，朝向 -Z） */
  cx: number;
  cy: number;
  cz: number;
  /** 半尺寸 */
  hx: number;
  hy: number;
  hz: number;
}

/** 站立姿态的命中盒；蹲下时整体按比例压低。 */
export const HITBOXES: HitboxDef[] = [
  { name: 'head', cx: 0, cy: 1.63, cz: 0, hx: 0.13, hy: 0.14, hz: 0.13 },
  { name: 'chest', cx: 0, cy: 1.28, cz: 0, hx: 0.2, hy: 0.19, hz: 0.14 },
  { name: 'stomach', cx: 0, cy: 0.98, cz: 0, hx: 0.17, hy: 0.15, hz: 0.13 },
  { name: 'arm', cx: -0.29, cy: 1.25, cz: 0, hx: 0.085, hy: 0.26, hz: 0.1 },
  { name: 'arm', cx: 0.29, cy: 1.25, cz: 0, hx: 0.085, hy: 0.26, hz: 0.1 },
  { name: 'leg', cx: -0.11, cy: 0.42, cz: 0, hx: 0.1, hy: 0.42, hz: 0.11 },
  { name: 'leg', cx: 0.11, cy: 0.42, cz: 0, hx: 0.1, hy: 0.42, hz: 0.11 },
];

export interface ActorHit {
  hitbox: HitboxName;
  t: number;
  /** 命中点世界坐标 */
  x: number;
  y: number;
  z: number;
}

/**
 * 射线与角色命中盒求交。射线先变换到角色局部坐标系再逐盒测试。
 */
export function raycastActor(
  a: Actor,
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  maxT: number,
): ActorHit | null {
  if (!a.alive) return null;
  const cos = Math.cos(a.yaw);
  const sin = Math.sin(a.yaw);
  // 世界 -> 局部
  const rx = ox - a.pos.x;
  const rz = oz - a.pos.z;
  const lox = cos * rx - sin * rz;
  const loz = sin * rx + cos * rz;
  const loy = oy - a.pos.y;
  const ldx = cos * dx - sin * dz;
  const ldz = sin * dx + cos * dz;
  const ldy = dy;

  const yScale = a.crouching ? CROUCH_HEIGHT / STAND_HEIGHT : 1;

  let best = maxT;
  let bestName: HitboxName | null = null;

  for (let i = 0; i < HITBOXES.length; i++) {
    const hb = HITBOXES[i];
    const minX = hb.cx - hb.hx;
    const maxX = hb.cx + hb.hx;
    const minY = (hb.cy - hb.hy) * yScale;
    const maxY = (hb.cy + hb.hy) * yScale;
    const minZ = hb.cz - hb.hz;
    const maxZ = hb.cz + hb.hz;

    let tmin = 0;
    let tmax = best;
    let ok = true;

    // X
    if (Math.abs(ldx) < 1e-9) {
      if (lox < minX || lox > maxX) ok = false;
    } else {
      const inv = 1 / ldx;
      let t1 = (minX - lox) * inv;
      let t2 = (maxX - lox) * inv;
      if (t1 > t2) {
        const tt = t1;
        t1 = t2;
        t2 = tt;
      }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) ok = false;
    }
    // Y
    if (ok) {
      if (Math.abs(ldy) < 1e-9) {
        if (loy < minY || loy > maxY) ok = false;
      } else {
        const inv = 1 / ldy;
        let t1 = (minY - loy) * inv;
        let t2 = (maxY - loy) * inv;
        if (t1 > t2) {
          const tt = t1;
          t1 = t2;
          t2 = tt;
        }
        if (t1 > tmin) tmin = t1;
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) ok = false;
      }
    }
    // Z
    if (ok) {
      if (Math.abs(ldz) < 1e-9) {
        if (loz < minZ || loz > maxZ) ok = false;
      } else {
        const inv = 1 / ldz;
        let t1 = (minZ - loz) * inv;
        let t2 = (maxZ - loz) * inv;
        if (t1 > t2) {
          const tt = t1;
          t1 = t2;
          t2 = tt;
        }
        if (t1 > tmin) tmin = t1;
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) ok = false;
      }
    }

    if (ok && tmin < best) {
      best = tmin;
      bestName = hb.name;
    }
  }

  if (!bestName) return null;
  return {
    hitbox: bestName,
    t: best,
    x: ox + dx * best,
    y: oy + dy * best,
    z: oz + dz * best,
  };
}

/** 粗略包围球，射线做快速剔除用。 */
export function actorBoundsRadius(): number {
  return 1.05;
}

export interface DamageResult {
  damage: number;
  armorLoss: number;
}

/**
 * 伤害计算：部位倍率 -> 距离衰减 -> 护甲减伤。
 * 腿部不受护甲保护；头部只有戴头盔才受护甲保护。
 */
export function computeDamage(
  weaponId: WeaponId,
  hitbox: HitboxName,
  distance: number,
  armor: number,
  helmet: boolean,
): DamageResult {
  const w = WEAPONS[weaponId];
  let dmg = w.damage * HITBOX_MULT[hitbox];
  if (w.falloff < 1) dmg *= Math.pow(w.falloff, distance / 20);

  const armorProtects =
    armor > 0 && hitbox !== 'leg' && (hitbox !== 'head' || helmet);
  if (!armorProtects) return { damage: Math.max(1, Math.round(dmg)), armorLoss: 0 };

  const after = dmg * w.armorPen;
  const armorLoss = Math.min(armor, (dmg - after) * 0.5);
  return { damage: Math.max(1, Math.round(after)), armorLoss };
}
