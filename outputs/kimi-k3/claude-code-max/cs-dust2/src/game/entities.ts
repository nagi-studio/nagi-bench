// ---------------------------------------------------------------------------
// 实体：玩家与 AI 共用 —— 物理（AABB 碰撞/重力/跳跃/台阶）、Hitbox、武器
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import { AABB, HitPart, Hitbox, Slot, Team } from './types';
import { WeaponInstance } from './weapons';
import { HumanoidParts } from './models';

export const GRAVITY = 22;
export const JUMP_V = 7.6;
export const SPEED_RUN = 4.6;
export const SPEED_WALK = 2.3;
export const RADIUS = 0.36;
export const HEIGHT = 1.8;
export const EYE = 1.62;
export const STEP_H = 0.55;

export interface MoveCmd {
  /** 本地坐标输入：x 右，z 前（-1..1） */
  mx: number;
  mz: number;
  jump: boolean;
  walk: boolean;
}

export const IDLE_CMD: MoveCmd = { mx: 0, mz: 0, jump: false, walk: false };

let nextId = 1;

export class Entity {
  id = nextId++;
  name: string;
  team: Team;
  isPlayer: boolean;

  pos = new THREE.Vector3();      // 脚底中心
  vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  onGround = true;

  hp = 100;
  armor = 0;
  helmet = false;
  alive = true;
  deathTime = 0;

  weapons: (WeaponInstance | null)[] = [null, null, null];
  slot: Slot = Slot.Secondary;
  lastSlot: Slot = Slot.Secondary;

  hasBomb = false;

  // 开火状态
  bloom = 0;               // 当前扩散增量（度）
  recoilP = 0;             // 剩余后坐力上扬（度，渲染层消费）
  recoilY = 0;
  nextFireAt = 0;
  swingUntil = 0;          // 刀挥动动画
  walkPhase = 0;
  stepAcc = 0;
  stepAlt = false;

  model: HumanoidParts;

  constructor(name: string, team: Team, isPlayer: boolean, model: HumanoidParts) {
    this.name = name;
    this.team = team;
    this.isPlayer = isPlayer;
    this.model = model;
  }

  get weapon(): WeaponInstance { return this.weapons[this.slot]!; }

  eye(): THREE.Vector3 {
    return new THREE.Vector3(this.pos.x, this.pos.y + EYE, this.pos.z);
  }

  speed2D(): number { return Math.hypot(this.vel.x, this.vel.z); }

  /** 当前总散布（度） */
  currentSpread(): number {
    const w = this.weapon;
    const move = Math.min(1, this.speed2D() / SPEED_RUN) * w.def.spreadMove;
    const air = this.onGround ? 1 : 2.2;
    return (w.def.spreadBase + this.bloom + move) * air;
  }

  switchSlot(s: Slot, now: number, onSwitch?: () => void) {
    if (s === this.slot || !this.weapons[s]) return;
    this.lastSlot = this.slot;
    this.slot = s;
    const w = this.weapon;
    w.reloadEnd = 0;
    // 切枪后短暂不能开火
    this.nextFireAt = Math.max(this.nextFireAt, now + (w.def.melee ? 0.3 : 0.5));
    this.bloom = 0;
    onSwitch?.();
  }

  // ------------------------------------------------------------- 物理更新

  update(dt: number, cmd: MoveCmd, colliders: AABB[]) {
    if (!this.alive) return;

    // 水平目标速度
    let tx = 0, tz = 0;
    if (cmd.mx !== 0 || cmd.mz !== 0) {
      const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
      // 前向 (-sin, -cos)，右向 (cos, -sin)
      let dx = -sin * cmd.mz + cos * cmd.mx;
      let dz = -cos * cmd.mz - sin * cmd.mx;
      const len = Math.hypot(dx, dz) || 1;
      const speed = (cmd.walk ? SPEED_WALK : SPEED_RUN) * (this.slot === Slot.Melee ? 1.08 : 1);
      tx = (dx / len) * speed;
      tz = (dz / len) * speed;
    }
    const accel = this.onGround ? 14 : 3.5;
    this.vel.x += (tx - this.vel.x) * Math.min(1, accel * dt);
    this.vel.z += (tz - this.vel.z) * Math.min(1, accel * dt);

    // 重力 / 跳跃
    this.vel.y -= GRAVITY * dt;
    if (cmd.jump && this.onGround) {
      this.vel.y = JUMP_V;
      this.onGround = false;
    }

    // 分轴移动 + 碰撞
    this.moveAxis(colliders, this.vel.x * dt, 0);
    this.moveAxis(colliders, this.vel.z * dt, 2);

    this.pos.y += this.vel.y * dt;
    const gh = this.groundHeight(colliders);
    if (this.pos.y <= gh) {
      this.pos.y = gh;
      if (this.vel.y < 0) this.vel.y = 0;
      this.onGround = true;
    } else {
      this.onGround = this.pos.y - gh < 0.02;
    }

    // 世界地板兜底
    if (this.pos.y < 0) { this.pos.y = 0; this.vel.y = 0; this.onGround = true; }

    // 走路相位
    const sp = this.speed2D();
    if (this.onGround && sp > 0.5) {
      this.walkPhase += dt * sp * 2.2;
      this.stepAcc += dt * sp;
      if (this.stepAcc > 2.4) {
        this.stepAcc = 0;
        this.stepAlt = !this.stepAlt;
        this.onStep?.();
      }
    }
    // 扩散回复
    this.bloom = Math.max(0, this.bloom - dt * 6);
  }

  onStep: (() => void) | null = null;

  private moveAxis(colliders: AABB[], delta: number, axis: 0 | 2) {
    if (delta === 0) return;
    if (axis === 0) this.pos.x += delta; else this.pos.z += delta;
    const feet = this.pos.y;
    const head = this.pos.y + HEIGHT;
    for (const c of colliders) {
      // 垂直方向不重叠则可通行（含台阶高度）
      if (c.maxY <= feet + STEP_H || c.minY >= head) continue;
      const overlapX = this.pos.x + RADIUS > c.minX && this.pos.x - RADIUS < c.maxX;
      const overlapZ = this.pos.z + RADIUS > c.minZ && this.pos.z - RADIUS < c.maxZ;
      if (!overlapX || !overlapZ) continue;
      // 尝试台阶：顶面不高于台阶高度时已在上面被跳过，这里处理贴墙推开
      if (axis === 0) {
        if (delta > 0) this.pos.x = c.minX - RADIUS;
        else this.pos.x = c.maxX + RADIUS;
        this.vel.x = 0;
      } else {
        if (delta > 0) this.pos.z = c.minZ - RADIUS;
        else this.pos.z = c.maxZ + RADIUS;
        this.vel.z = 0;
      }
    }
  }

  /** 脚下地面高度（含箱子顶面，支持 ≤ 台阶高度的站上） */
  groundHeight(colliders: AABB[]): number {
    let g = 0;
    const feet = this.pos.y;
    for (const c of colliders) {
      if (c.maxY > feet + STEP_H + 0.01) continue;
      const shrink = RADIUS * 0.5;
      if (
        this.pos.x + shrink > c.minX && this.pos.x - shrink < c.maxX &&
        this.pos.z + shrink > c.minZ && this.pos.z - shrink < c.maxZ
      ) {
        if (c.maxY > g) g = c.maxY;
      }
    }
    return g;
  }

  // ------------------------------------------------------------- Hitbox

  /** 世界空间分区 Hitbox */
  hitboxes(out?: Hitbox[]): Hitbox[] {
    const boxes = out ?? [];
    boxes.length = 0;
    const p = this.pos;
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    // 右侧向量 (cos, -sin)
    const rx = cos, rz = -sin;

    const push = (part: HitPart, cx: number, cy: number, cz: number, hx: number, hy: number, hz: number) => {
      boxes.push({
        part,
        minX: cx - hx, minY: cy - hy, minZ: cz - hz,
        maxX: cx + hx, maxY: cy + hy, maxZ: cz + hz,
      });
    };

    if (!this.alive) {
      // 倒地后整体一个低盒
      push('chest', p.x, p.y + 0.3, p.z, 0.9, 0.3, 0.5);
      return boxes;
    }

    push('leg', p.x, p.y + 0.41, p.z, 0.27, 0.41, 0.24);
    push('stomach', p.x, p.y + 1.0, p.z, 0.3, 0.18, 0.24);
    push('chest', p.x, p.y + 1.32, p.z, 0.32, 0.22, 0.26);
    push('head', p.x, p.y + 1.77, p.z, 0.19, 0.18, 0.19);
    // 手臂（肩侧）
    const ax = 0.4;
    push('arm', p.x + rx * ax, p.y + 1.25, p.z + rz * ax, 0.14, 0.35, 0.14);
    push('arm', p.x - rx * ax, p.y + 1.25, p.z - rz * ax, 0.14, 0.35, 0.14);
    return boxes;
  }
}
