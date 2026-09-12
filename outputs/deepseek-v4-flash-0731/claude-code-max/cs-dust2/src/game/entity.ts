// 玩家实体：物理、碰撞、武器状态、受击判定

import { WEAPONS } from './weapons';
import { OBSTACLES, WORLD_MIN_X, WORLD_MAX_X, WORLD_MIN_Z, WORLD_MAX_Z } from './map';
import {
  PLAYER_RADIUS, GRAVITY, JUMP_SPEED,
  RUN_SPEED, EYE_HEIGHT,
  type Team, type WeaponId, type Slot, type WeaponDef,
} from './types';

export interface HitZoneResult {
  zone: string;
  mult: number;
}

export class PlayerEntity {
  index = 0;
  team: Team = 0;
  x = 0; z = 0; y = 0;
  vx = 0; vy = 0; vz = 0;
  yaw = 0; pitch = 0;
  onGround = true;

  alive = true;
  hp = 100;
  armor = 0;
  isPlayer = false; // 玩家本人（含接管模式）

  weapons: WeaponId[] = [];
  activeSlot: Slot = 'secondary';
  activeWeapon: WeaponId = 'glock';
  mag = 0;
  reserve = 0;
  reloading = false;
  reloadT = 0;
  fireCooldown = 0;
  spread = 0;
  recoilKick = 0; // 视角上扬（玩家输入用）
  switchT = 0;

  hasBomb = false;

  // 动画
  walkPhase = 0;
  moveAmount = 0;
  firingAnim = 0; // 开火后坐动画（渲染用）

  // AI
  aiMode = false;
  aiThink = 0;

  // 受击闪红
  hitFlash = 0;

  // 最近伤害来源（AI 反击目标选择）
  lastDamager = -1;
  lastDamagerT = 0;

  // AI 驱动（本地移动输入 + 意图）
  aiMoveX = 0;
  aiMoveZ = 0;
  aiFire = false;
  aiInteract = false;
  aiInteractLock = 0; // 互动意图保持（思考节流之间不丢失）
  aiGoal = { x: 0, z: 0 };
  aiState = 'idle';

  // 子弹示踪（渲染用）
  emit: { dx: number; dy: number; dz: number } | null = null;

  constructor(index: number, team: Team) {
    this.index = index;
    this.team = team;
  }

  setupLoadout(pistolRound: boolean): void {
    const ids = pistolRound
      ? (this.team === 1 ? ['glock', 'knife'] : ['usp', 'knife'])
      : (this.team === 1 ? ['ak47', 'glock', 'knife'] : ['m4a4', 'usp', 'knife']);
    this.weapons = ids as WeaponId[];
    this.armor = pistolRound ? 0 : 100;
    this.hp = 100;
    this.switchWeapon('secondary');
    if (this.activeWeapon === 'knife') this.switchWeapon('melee');
  }

  /** 获取当前可用武器列表（保持 slot 顺序） */
  weaponList(): WeaponId[] {
    return this.weapons;
  }

  hasWeapon(id: WeaponId): boolean {
    return this.weapons.includes(id);
  }

  currentDef(): WeaponDef {
    return WEAPONS[this.activeWeapon];
  }

  switchWeapon(slot: Slot): void {
    const def = WEAPONS[this.activeWeapon];
    this.switchT = def.switchTime;
    this.reloading = false;
    this.reloadT = 0;
    // 选择该槽位武器
    for (const w of this.weapons) {
      if (WEAPONS[w].slot === slot) {
        this.activeWeapon = w;
        this.activeSlot = slot;
        this.mag = WEAPONS[w].magSize;
        this.reserve = WEAPONS[w].reserve;
        this.spread = 0;
        this.recoilKick = 0;
        return;
      }
    }
    // 槽位无武器 → 最近的非空槽
    for (const w of this.weapons) {
      this.activeWeapon = w;
      this.activeSlot = WEAPONS[w].slot;
      this.mag = WEAPONS[w].magSize;
      this.reserve = WEAPONS[w].reserve;
      this.spread = 0;
      return;
    }
  }

  cycleSlot(dir: 1 | -1): void {
    const order: Slot[] = ['primary', 'secondary', 'melee'];
    let i = order.indexOf(this.activeSlot);
    for (let k = 0; k < 3; k++) {
      i = (i + dir + 3) % 3;
      const s = order[i];
      if (this.weapons.some((w) => WEAPONS[w].slot === s)) {
        this.switchWeapon(s);
        return;
      }
    }
  }

  startReload(): void {
    const def = this.currentDef();
    if (def.slot === 'melee' || this.reloading) return;
    if (this.mag >= def.magSize || this.reserve <= 0) return;
    this.reloading = true;
    this.reloadT = def.reloadTime;
  }

  updateReload(dt: number): void {
    if (!this.reloading) return;
    this.reloadT -= dt;
    if (this.reloadT <= 0) {
      const def = this.currentDef();
      const need = def.magSize - this.mag;
      const take = Math.min(need, this.reserve);
      this.mag += take;
      this.reserve -= take;
      this.reloading = false;
    }
  }

  canFire(): boolean {
    const def = this.currentDef();
    if (def.slot === 'melee') return this.fireCooldown <= 0;
    return !this.reloading && this.mag > 0 && this.fireCooldown <= 0;
  }

  /**
   * 物理更新：输入 moveX/moveZ（本地坐标 -1..1），run 是否奔跑
   * 返回是否移动
   */
  updatePhysics(dt: number, moveX: number, moveZ: number, run: boolean, speedMult: number): boolean {
    const speed = (run ? RUN_SPEED : RUN_SPEED * 0.55) * speedMult;
    // 世界前向 F = (cos yaw, sin yaw)，右向 R = (-sin yaw, cos yaw)
    // 世界位移 = F * moveZ + R * moveX
    const sinY = Math.sin(this.yaw);
    const cosY = Math.cos(this.yaw);
    const wx = moveZ * cosY - moveX * sinY;
    const wz = moveZ * sinY + moveX * cosY;
    const len = Math.hypot(wx, wz);
    let tx = this.x, tz = this.z;
    let moved = false;
    if (len > 0.01) {
      const nx = wx / len;
      const nz = wz / len;
      // X 轴独立移动 + 碰撞
      let nx2 = this.x + nx * speed * dt;
      if (!this.collideXZ(nx2, this.z)) { tx = nx2; moved = true; }
      let nz2 = this.z + nz * speed * dt;
      if (!this.collideXZ(this.x, nz2)) { tz = nz2; moved = true; }
      this.x = tx; this.z = tz;
    }
    // 跳跃与重力
    if (this.vy !== 0 || !this.onGround) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) { this.y = 0; this.vy = 0; this.onGround = true; }
      else this.onGround = false;
    }
    this.x = Math.min(WORLD_MAX_X - PLAYER_RADIUS, Math.max(WORLD_MIN_X + PLAYER_RADIUS, this.x));
    this.z = Math.min(WORLD_MAX_Z - PLAYER_RADIUS, Math.max(WORLD_MIN_Z + PLAYER_RADIUS, this.z));
    this.moveAmount = moved ? 1 : Math.max(0, this.moveAmount - dt * 4);
    return moved;
  }

  jump(): void {
    if (this.onGround) {
      this.vy = JUMP_SPEED;
      this.onGround = false;
    }
  }

  /** 与所有障碍物碰撞检测（以玩家 AABB 投影） */
  collideXZ(nx: number, nz: number): boolean {
    const r = PLAYER_RADIUS;
    for (let i = 0; i < OBSTACLES.length; i++) {
      const o = OBSTACLES[i];
      if (nx + r > o.x0 && nx - r < o.x1 && nz + r > o.z0 && nz - r < o.z1) {
        return true; // 所有障碍物均阻挡移动
      }
    }
    return false;
  }

  /** 障碍物是否在给定点阻挡视线（高度无关，2D） */
  static lineBlocked(ax: number, az: number, bx: number, bz: number): boolean {
    for (let i = 0; i < OBSTACLES.length; i++) {
      const o = OBSTACLES[i];
      if (o.height < 1.0) continue; // 矮箱不挡视线
      // 快速 AABB-线段检测
      const dx = bx - ax, dz = bz - az;
      let tMin = 0, tMax = 1;
      let ok = true;
      if (Math.abs(dx) < 1e-9) { if (ax < o.x0 || ax > o.x1) ok = false; }
      else {
        let t1 = (o.x0 - ax) / dx, t2 = (o.x1 - ax) / dx;
        if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
        tMin = Math.max(tMin, t1); tMax = Math.min(tMax, t2);
        if (tMin > tMax) ok = false;
      }
      if (!ok) continue;
      if (Math.abs(dz) < 1e-9) { if (az < o.z0 || az > o.z1) ok = false; }
      else {
        let t1 = (o.z0 - az) / dz, t2 = (o.z1 - az) / dz;
        if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
        tMin = Math.max(tMin, t1); tMax = Math.min(tMax, t2);
        if (tMin > tMax) ok = false;
      }
      if (ok && tMin > 0.001 && tMin < 1) return true;
    }
    return false;
  }

  /** 命中区判定：按射线命中高度与横向偏移 */
  static hitZoneFor(pointY: number, horizontalDist: number): HitZoneResult {
    if (horizontalDist < 0.24) {
      if (pointY > 1.42) return { zone: 'head', mult: 2 };
      if (pointY > 1.05) return { zone: 'chest', mult: 1 };
      if (pointY > 0.75) return { zone: 'stomach', mult: 1 };
      return { zone: 'legs', mult: 0.8 };
    }
    if (horizontalDist < 0.4) {
      if (pointY > 0.75) return { zone: 'arm', mult: 1 };
      return { zone: 'legs', mult: 0.8 };
    }
    return { zone: 'legs', mult: 0.8 };
  }

}

// 给引擎使用的快速命中判定
export function computeHitZoneAt(pointY: number, hDist: number): HitZoneResult {
  return PlayerEntity.hitZoneFor(pointY, hDist);
}
