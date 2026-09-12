// ---------------------------------------------------------------------------
// AI 大脑：巡逻寻路 / 视野索敌 / 交战开火 / 下包 / 拆包 / 捡包
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import { Entity, IDLE_CMD, MoveCmd, SPEED_RUN } from './entities';
import { findPath, losClear } from './mapData';
import { pointInRect, rectCenter, Slot } from './types';
import type { Game } from './engine';

export type BrainState = 'route' | 'engage' | 'plant' | 'defuse' | 'fetch' | 'hold';

export class Brain {
  ent: Entity;
  state: BrainState = 'route';
  cmd: MoveCmd = { ...IDLE_CMD };

  path: { x: number; z: number }[] = [];
  pathIdx = 0;
  repathAt = 0;
  goal = new THREE.Vector2();

  target: Entity | null = null;
  lastSeenPos = new THREE.Vector3();
  lastSeenAt = -99;
  reactionAt = 0;
  burstLeft = 0;
  nextShotAt = 0;
  strafeDir = 1;
  strafeUntil = 0;

  role: 'A' | 'B' | 'mid' = 'mid';
  aggro = Math.random();          // 个性：激进程度
  skill = 0.55 + Math.random() * 0.4; // 反应/枪法
  stuckTime = 0;
  lastPos = new THREE.Vector3();
  holdUntil = 0;
  perceiveAcc = Math.random() * 0.15;

  constructor(ent: Entity) {
    this.ent = ent;
  }

  /** 回合开始：分配目标点 */
  assignRound(game: Game) {
    this.state = 'route';
    this.target = null;
    this.path = [];
    this.pathIdx = 0;
    const e = this.ent;
    if (e.team === 'T') {
      // 进攻方：按队伍策略分路（由 game 在开局设定 role）
      if (this.role === 'A') {
        const via = Math.random() < 0.5;
        this.goal.set(via ? -33 : -20, via ? -20 : -34); // A大 -> A点
      } else if (this.role === 'B') {
        this.goal.set(29, -30);
      } else {
        this.goal.set(2, -16); // 中路 -> 猫道方向
      }
    } else {
      // 防守方：分配守点
      if (this.role === 'A') this.goal.set(-22 + Math.random() * 8 - 4, -30 + Math.random() * 8 - 4);
      else if (this.role === 'B') this.goal.set(29 + Math.random() * 6 - 3, -32 + Math.random() * 6 - 3);
      else this.goal.set(3, -4); // 中门观察位
    }
    this.repath(game);
  }

  repath(game: Game) {
    const p = findPath(game.map.nav, this.ent.pos.x, this.ent.pos.z, this.goal.x, this.goal.y);
    if (p && p.length) {
      this.path = p;
      this.pathIdx = 0;
    }
    this.repathAt = game.now + 2.5 + Math.random();
  }

  update(dt: number, game: Game) {
    const e = this.ent;
    this.cmd.mx = 0; this.cmd.mz = 0; this.cmd.jump = false; this.cmd.walk = false;
    if (!e.alive || game.phase !== 'live') return;

    // ---------- 感知（分帧，每 0.15s） ----------
    this.perceiveAcc += dt;
    if (this.perceiveAcc >= 0.15) {
      this.perceiveAcc = 0;
      this.perceive(game);
    }

    // ---------- 炸弹相关全局决策 ----------
    if (this.decideBomb(game, dt)) {
      // decideBomb 已处理移动/通道
    } else if (this.target && this.target.alive) {
      this.state = 'engage';
      this.doCombat(dt, game);
    } else {
      if (this.state === 'engage') this.state = 'route';
      this.doRoute(dt, game);
    }

    // ---------- 卡住检测 ----------
    if ((this.cmd.mx !== 0 || this.cmd.mz !== 0) && e.speed2D() < 0.4) {
      this.stuckTime += dt;
      if (this.stuckTime > 0.8) {
        this.stuckTime = 0;
        this.cmd.jump = Math.random() < 0.5;
        this.repath(game);
      }
    } else this.stuckTime = 0;

    this.lastPos.copy(e.pos);
  }

  // ------------------------------------------------------------- 感知

  private perceive(game: Game) {
    const e = this.ent;
    const eye = e.eye();
    let best: Entity | null = null;
    let bestDist = Infinity;
    for (const o of game.entities) {
      if (!o.alive || o.team === e.team) continue;
      const d = e.pos.distanceTo(o.pos);
      if (d > 48) continue;
      // 视野角 110°（交战记忆目标放宽）
      const dx = o.pos.x - e.pos.x, dz = o.pos.z - e.pos.z;
      const fx = -Math.sin(e.yaw), fz = -Math.cos(e.yaw);
      const cosA = (dx * fx + dz * fz) / (Math.hypot(dx, dz) || 1);
      const fovCos = this.target === o ? -0.2 : 0.35;
      if (cosA < fovCos) continue;
      const oe = o.eye();
      if (!losClear(game.map.colliders, eye.x, eye.y, eye.z, oe.x, oe.y - 0.3, oe.z)) continue;
      if (d < bestDist) { bestDist = d; best = o; }
    }

    // 目标粘性：当前目标仍可见且差距不大时保持，避免反应时间被反复重置
    if (best && this.target && this.target.alive && this.target !== best) {
      const cur = this.target;
      const dCur = e.pos.distanceTo(cur.pos);
      const ce = cur.eye();
      const curVisible = dCur < 48 &&
        losClear(game.map.colliders, eye.x, eye.y, eye.z, ce.x, ce.y - 0.3, ce.z);
      if (curVisible && dCur < bestDist * 1.6) {
        best = cur;
        bestDist = dCur;
      }
    }

    if (best) {
      if (this.target !== best) {
        // 反应时间（距离越近反应越快）
        this.reactionAt = game.now + (0.45 - this.skill * 0.25) * (0.6 + Math.min(1, bestDist / 40));
        this.burstLeft = 0;
      }
      this.target = best;
      this.lastSeenPos.copy(best.pos);
      this.lastSeenAt = game.now;
    } else if (this.target && game.now - this.lastSeenAt > 2.5) {
      this.target = null;
    }
  }

  // ------------------------------------------------------------- 交战

  private doCombat(dt: number, game: Game) {
    const e = this.ent;
    const t = this.target!;
    const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
    const dy = (t.pos.y + 1.3) - (e.pos.y + 1.45);
    const dist = Math.hypot(dx, dz);

    // 瞄准（带误差）
    const desiredYaw = Math.atan2(-dx, -dz);
    const desiredPitch = Math.atan2(dy, dist);
    const turnSpeed = 6 + this.skill * 6;
    e.yaw = lerpAngle(e.yaw, desiredYaw, Math.min(1, turnSpeed * dt));
    e.pitch += (desiredPitch - e.pitch) * Math.min(1, turnSpeed * dt);

    // 走位：狙击原地，其他间歇横移
    if (e.weapon.def.scope) {
      this.cmd.mx = 0; this.cmd.mz = 0;
    } else {
      if (game.now > this.strafeUntil) {
        this.strafeUntil = game.now + 0.4 + Math.random() * 0.7;
        this.strafeDir = Math.random() < 0.5 ? -1 : 1;
        if (Math.random() < 0.25) this.strafeDir = 0;
      }
      this.cmd.mx = this.strafeDir * 0.8;
      if (dist > 22) this.cmd.mz = 0.7; // 远距离压近
      else if (dist < 5) this.cmd.mz = -0.5;
    }

    // 开火
    if (game.now < this.reactionAt) return;
    const w = e.weapon;
    if (w.reloadEnd > 0) return;
    if (w.def.melee) {
      if (dist < (w.def.range ?? 2)) game.entityFire(e);
      return;
    }
    if (w.mag <= 0) {
      game.startReload(e);
      return;
    }
    // 狙 / 手枪低射速直接打；步枪点射
    const isBurst = w.def.auto && !w.def.scope;
    if (isBurst) {
      if (this.burstLeft <= 0 && game.now > this.nextShotAt) {
        this.burstLeft = 3 + Math.floor(Math.random() * 4);
      }
      if (this.burstLeft > 0 && game.now > this.nextShotAt) {
        if (this.aimOnTarget(dist)) {
          game.entityFire(e);
          this.burstLeft--;
          this.nextShotAt = game.now + 60 / w.def.rpm;
          if (this.burstLeft === 0) this.nextShotAt = game.now + 0.35 + Math.random() * 0.4;
        } else {
          this.nextShotAt = game.now + 0.05;
        }
      }
    } else if (game.now > this.nextShotAt && this.aimOnTarget(dist)) {
      game.entityFire(e);
      this.nextShotAt = game.now + Math.max(60 / w.def.rpm, 0.25) + (1 - this.skill) * 0.4;
    }
  }

  private aimOnTarget(dist: number): boolean {
    const e = this.ent;
    const t = this.target!;
    const dx = t.pos.x - e.pos.x, dz = t.pos.z - e.pos.z;
    const desiredYaw = Math.atan2(-dx, -dz);
    const diff = Math.abs(angleDiff(e.yaw, desiredYaw));
    return diff < Math.atan2(1.2, dist); // 瞄准容差约肩宽
  }

  // ------------------------------------------------------------- 巡逻/推进

  private doRoute(dt: number, game: Game) {
    const e = this.ent;
    // 到达目标 -> 守点 hold
    const distGoal = Math.hypot(this.goal.x - e.pos.x, this.goal.y - e.pos.z);
    if (distGoal < 2.5 || this.pathIdx >= this.path.length) {
      if (game.now < this.repathAt) {
        // 守点：缓慢扫视
        if (Math.random() < dt * 0.4) e.yaw += (Math.random() - 0.5) * 1.6;
        // 有最后目击位置则推进调查
        if (game.now - this.lastSeenAt < 6 && this.target === null) {
          this.goal.set(this.lastSeenPos.x, this.lastSeenPos.z);
          this.repath(game);
        }
        return;
      }
      // T 未下包时持续向包点推进
      if (e.team === 'T' && game.bomb.state !== 'planted') {
        const site = this.role === 'B' ? game.map.siteB : game.map.siteA;
        const c = rectCenter(site);
        this.goal.set(c.x + (Math.random() - 0.5) * 8, c.z + (Math.random() - 0.5) * 8);
      } else if (e.team === 'CT') {
        // 防守：偶尔在点附近换位
        const site = this.role === 'B' ? game.map.siteB : this.role === 'A' ? game.map.siteA : null;
        if (site) {
          const c = rectCenter(site);
          this.goal.set(c.x + (Math.random() - 0.5) * 14, c.z + (Math.random() - 0.5) * 12);
        }
      }
      this.repath(game);
      return;
    }

    // 沿路径移动
    const wp = this.path[this.pathIdx];
    const dx = wp.x - e.pos.x, dz = wp.z - e.pos.z;
    if (Math.hypot(dx, dz) < 0.7) {
      this.pathIdx++;
      return;
    }
    const desiredYaw = Math.atan2(-dx, -dz);
    e.yaw = lerpAngle(e.yaw, desiredYaw, Math.min(1, 10 * dt));
    e.pitch *= 0.9;
    this.cmd.mz = 1;
    // 接近交火区静步
    if (game.now - this.lastSeenAt < 4) this.cmd.walk = true;
  }

  // ------------------------------------------------------------- 炸弹决策

  /** 返回 true 表示本帧已由炸弹逻辑接管 */
  private decideBomb(game: Game, dt: number): boolean {
    const e = this.ent;
    const bomb = game.bomb;

    if (e.team === 'T') {
      // 捡包：包掉了且自己是最近的存活 T bot
      if (bomb.state === 'dropped') {
        const fetcher = game.nearestAliveTBot(bomb.pos.x, bomb.pos.z);
        if (fetcher === e) {
          this.state = 'fetch';
          this.goal.set(bomb.pos.x, bomb.pos.z);
          if (Math.hypot(e.pos.x - bomb.pos.x, e.pos.z - bomb.pos.z) < 1.2) return false; // 由 game 拾取
          this.followPathTo(dt, game);
          return true;
        }
      }
      // 下包：自己带包且在包点内
      if (e.hasBomb && bomb.state === 'carried') {
        const inA = pointInRect(e.pos.x, e.pos.z, game.map.siteA);
        const inB = pointInRect(e.pos.x, e.pos.z, game.map.siteB);
        if ((inA || inB) && !this.target) {
          this.state = 'plant';
          game.channelPlant(e, dt);
          return true;
        }
        // 带包推进到包点
        if (!this.target) {
          const site = this.role === 'B' ? game.map.siteB : game.map.siteA;
          const c = rectCenter(site);
          this.goal.set(c.x, c.z);
          return false; // 走正常 route
        }
      }
      return false;
    }

    // CT 拆包
    if (bomb.state === 'planted') {
      const d = Math.hypot(e.pos.x - bomb.pos.x, e.pos.z - bomb.pos.z);
      if (d < 2.0) {
        // 若附近仍有可见敌人则先交战
        if (this.target && this.target.alive) return false;
        this.state = 'defuse';
        game.channelDefuse(e, dt);
        return true;
      }
      // 全体 CT 回防
      this.goal.set(bomb.pos.x, bomb.pos.z);
      if (this.state !== 'engage') this.state = 'route';
      return false;
    }
    return false;
  }

  /** 沿当前目标点移动（供 fetch 等复用） */
  private followPathTo(dt: number, game: Game) {
    const e = this.ent;
    if (game.now > this.repathAt || this.pathIdx >= this.path.length) this.repath(game);
    if (this.pathIdx < this.path.length) {
      const wp = this.path[this.pathIdx];
      const dx = wp.x - e.pos.x, dz = wp.z - e.pos.z;
      if (Math.hypot(dx, dz) < 0.7) this.pathIdx++;
      else {
        const desiredYaw = Math.atan2(-dx, -dz);
        e.yaw = lerpAngle(e.yaw, desiredYaw, Math.min(1, 10 * dt));
        this.cmd.mz = 1;
      }
    }
  }
}

export function angleDiff(a: number, b: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export function lerpAngle(a: number, b: number, t: number): number {
  return a + angleDiff(a, b) * t;
}
