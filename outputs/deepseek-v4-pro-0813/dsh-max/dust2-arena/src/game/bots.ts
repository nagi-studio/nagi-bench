// ============================================================================
// AI 状态机 —— 巡逻/索敌/交火/下包/拆包，寻路走 NavMesh，视线用射线判定
// ============================================================================
import { MAP } from './map/dust2';
import type { Game, Ent } from './engine';
import type { WeaponDef } from './types';

type AIState = 'freeze' | 'goto' | 'combat' | 'plant' | 'defuse' | 'hold' | 'idle';

export class BotAI {
  state: AIState = 'idle';
  role: string = '';
  path: [number, number][] = [];
  pathIdx = 0;
  repathT = 0;
  stuckT = 0;
  lastX = 0;
  lastZ = 0;
  target: Ent | null = null;
  lastSeenT = 0;
  lastKnown: [number, number] | null = null;
  reactT = 0;
  burstLeft = 0;
  burstPauseT = 0;
  strafeDir = 1;
  strafeT = 0;
  thinkT = 0;
  aimError = 0.03;
  reaction = 0.25;
  aggressiveness = 0.7;
  defendPos: [number, number] | null = null;
  defendYaw = 0;
  defusing = false;
  gotoDone = false;
  plantSpot: [number, number] | null = null;
  planReady = false;
  preferredDist = 10;
  investigate: [number, number] | null = null;
  investigateT = 0;
  lastBombGo = 0;
  holdT = 5;

  constructor(skill: number) {
    this.aimError = 0.055 - skill * 0.02;       // 0.02..0.055
    this.reaction = 0.42 - skill * 0.18;        // 0.15..0.42
    this.aggressiveness = 0.5 + skill * 0.25;
  }

  reset() {
    this.state = 'freeze';
    this.path = [];
    this.target = null;
    this.defusing = false;
    this.plantSpot = null;
    this.planReady = false;
    this.investigate = null;
  }

  goto(g: Game, e: Ent, target: [number, number]) {
    this.state = 'goto';
    this.pathIdx = 0;
    this.stuckT = 0;
    this.lastX = e.x;
    this.lastZ = e.z;
    this.repathT = 0;
    const p = g.nav.findPath(e.x, e.z, target[0], target[1]);
    this.path = p || [];
    this.gotoDone = false;
  }

  update(dt: number, g: Game, e: Ent) {
    if (!e.alive || g.phase !== 'live') {
      if (g.phase === 'freeze' || g.phase === 'ended') {
        this.state = 'freeze';
        g.aiMoveTo(e, 0, 0, 0, dt);
        e.bodyYaw = e.spawnYaw;
        e.yaw = e.spawnYaw;
      }
      return;
    }

    this.thinkT -= dt;
    if (this.thinkT <= 0) {
      this.thinkT = 0.12 + Math.random() * 0.06;
      this.perceive(g, e);
    }

    // 索敌：有目标且在战斗
    if (this.target && !this.target.alive) {
      this.target = null;
      this.lastSeenT = 0;
    }

    const def = e.weapons[e.currentSlot]?.def;

    switch (this.state) {
      case 'freeze':
        this.plan(g, e);
        break;
      case 'goto':
        if (this.target) { this.enterCombat(g, e); this.combat(dt, g, e); break; }
        this.followPath(dt, g, e, def);
        break;
      case 'combat':
        this.combat(dt, g, e);
        break;
      case 'plant':
        this.doPlant(dt, g, e);
        break;
      case 'defuse':
        this.doDefuse(dt, g, e);
        break;
      case 'hold':
        if (this.target) { this.enterCombat(g, e); this.combat(dt, g, e); break; }
        this.doHold(dt, g, e);
        break;
      case 'idle':
        if (this.target) { this.enterCombat(g, e); this.combat(dt, g, e); break; }
        break;
      default:
        break;
    }
    // 交战中的移动输出已被 combat 设置
  }

  private perceive(g: Game, e: Ent) {
    let best: Ent | null = null;
    let bestD = 1e9;
    for (const o of g.ents) {
      if (!o.alive || o.team === e.team) continue;
      const d = Math.hypot(o.x - e.x, o.z - e.z);
      if (d > 60) continue;
      if (!g.visibleTo(e, o)) continue;
      if (d < bestD) { bestD = d; best = o; }
      if (o.team !== g.selfTeam && e.team === g.selfTeam) g.lastSeenBy.set(o.id, g.time);
    }
    if (best) {
      if (this.target !== best) {
        this.reactT = this.reaction * (0.7 + Math.random() * 0.6);
      }
      this.target = best;
      this.lastSeenT = g.time;
      this.lastKnown = [best.x, best.z];
    } else if (this.target) {
      if (g.time - this.lastSeenT > 2.2) {
        if (this.lastKnown && g.phase === 'live') {
          this.investigate = this.lastKnown;
          this.investigateT = 4;
        }
        this.target = null;
        this.lastSeenT = 0;
      }
    }
    // 听到枪声调查（engine 广播）
    if (!this.target && g.heardShot) {
      const dx = g.heardShot[0] - e.x, dz = g.heardShot[1] - e.z;
      const d = Math.hypot(dx, dz);
      if (d < 26 && Math.random() < 0.4) {
        this.investigate = [g.heardShot[0] + (Math.random() - 0.5) * 4, g.heardShot[1] + (Math.random() - 0.5) * 4];
        this.investigateT = 3.5;
      }
    }
  }

  private enterCombat(g: Game, e: Ent) {
    if (this.state !== 'combat') {
      this.state = 'combat';
      this.strafeDir = Math.random() < 0.5 ? -1 : 1;
      this.strafeT = 0.3 + Math.random() * 0.8;
      this.burstLeft = 0;
      this.burstPauseT = 0;
    }
  }

  private plan(g: Game, e: Ent) {
    // 回合开始决策
    const isT = e.team === 'T';
    if (isT) {
      const site = g.tStrategy.site;
      const idx = g.tStrategy.members.indexOf(e.id);
      if (idx === 0) {
        // 炸弹携带者（若无则主力）→ 下包点
        this.role = 'planter';
        const spots = MAP.plantSpots[site];
        this.plantSpot = spots[g.tStrategy.spotIdx % spots.length];
        this.defendPos = this.plantSpot;
      } else if (idx < 3) {
        this.role = 'entry';
      } else if (idx === 3) {
        this.role = 'support';
      } else {
        this.role = 'lurk';
      }
    } else {
      this.role = g.ctAssign.get(e.id) || 'mid';
    }
    this.planReady = true;
    this.state = 'goto';
    this.chooseRoute(g, e);
  }

  private chooseRoute(g: Game, e: Ent) {
    if (!e.alive) return;
    if (e.team === 'T') {
      const site = g.tStrategy.site;
      if (this.role === 'lurk' && site === 'A') {
        this.goto(g, e, MAP.waypoints.midT[1]);
        return;
      }
      if (this.role === 'lurk' && site === 'B') {
        this.goto(g, e, MAP.waypoints.midT[0]);
        return;
      }
      if (site === 'A') {
        if (this.role === 'planter' || this.role === 'entry') {
          this.goto(g, e, MAP.waypoints.longPlaza[0]);   // A大路线
        } else {
          this.goto(g, e, MAP.waypoints.catTop[0]);      // 中→猫道路线
        }
      } else {
        if (this.role === 'support') {
          this.goto(g, e, MAP.waypoints.ctMid[0]);       // 中→B门路线
        } else {
          this.goto(g, e, MAP.waypoints.bTunnelLow[0]);  // B洞路线
        }
      }
    } else {
      switch (this.role) {
        case 'a1': this.goto(g, e, MAP.waypoints.aSite[0]); break;
        case 'a2': this.goto(g, e, MAP.waypoints.aSiteShort[0]); break;
        case 'b1': this.goto(g, e, MAP.waypoints.bSite[2]); break;
        case 'b2': this.goto(g, e, MAP.waypoints.bSite[0]); break;
        case 'mid': this.goto(g, e, MAP.waypoints.ctMid[0]); break;
        default: this.goto(g, e, MAP.waypoints.ctSpawn[0]); break;
      }
    }
  }

  private followPath(dt: number, g: Game, e: Ent, def: WeaponDef | undefined) {
    const speed = g.runSpeed(e);
    // 调查点优先
    if (this.investigate && this.investigateT > 0) {
      this.investigateT -= dt;
      const dx = this.investigate[0] - e.x, dz = this.investigate[1] - e.z;
      const d = Math.hypot(dx, dz);
      if (d < 1.2) { this.investigate = null; }
      else { g.aiMoveTo(e, dx / d, dz / d, speed, dt); return; }
    }

    // 到达后选择下一步（推进计划）
    if (this.gotoDone) {
      this.advancePlan(g, e);
      this.gotoDone = false;
      if (!this.path.length) { this.state = 'hold'; return; }
    }

    if (this.pathIdx >= this.path.length) {
      this.advancePlan(g, e);
      return;
    }
    const [tx, tz] = this.path[this.pathIdx];
    const dx = tx - e.x, dz = tz - e.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.8) {
      this.pathIdx++;
      if (this.pathIdx >= this.path.length) {
        this.gotoDone = true;
        return;
      }
    } else {
      g.aiMoveTo(e, dx / d, dz / d, speed, dt);
    }
    // 卡住检测
    this.stuckT += dt;
    if (this.stuckT > 1.1) {
      const moved = Math.hypot(e.x - this.lastX, e.z - this.lastZ);
      if (moved < 0.45) {
        this.repathT++;
        const target = this.path[this.path.length - 1];
        if (this.repathT < 3 && target) this.goto(g, e, target);
        else if (this.repathT < 5 && target) {
          // 抖动：侧移再重试
          g.aiMoveTo(e, Math.cos(this.repathT), Math.sin(this.repathT), speed, 0.5);
        }
      }
      this.stuckT = 0;
      this.lastX = e.x;
      this.lastZ = e.z;
    }
  }

  private advancePlan(g: Game, e: Ent) {
    if (!e.alive) return;
    if (e.team === 'T') {
      const site = g.tStrategy.site;
      // 携带炸弹：必须推进到下包点
      if (e.hasBomb) {
        if (!this.plantSpot) {
          const spots = MAP.plantSpots[site];
          this.plantSpot = spots[Math.floor(Math.random() * spots.length)];
        }
        const d = Math.hypot(this.plantSpot[0] - e.x, this.plantSpot[1] - e.z);
        if (d < 1.6) { this.state = 'plant'; return; }
        this.goto(g, e, this.plantSpot);
        return;
      }
      // 没有炸弹：去站点占位/支援
      const key = site === 'A' ? 'aSite' : 'bSite';
      const spots = MAP.waypoints[key];
      const pick = spots[Math.floor(Math.random() * spots.length)];
      const d = Math.hypot(pick[0] - e.x, pick[1] - e.z);
      if (d < 3) { this.defendPos = pick; this.state = 'hold'; return; }
      this.goto(g, e, pick);
    } else {
      if (g.bombState === 'planted') {
        const d = Math.hypot(g.bombPos[0] - e.x, g.bombPos[1] - e.z);
        if (d < 2.4) { this.state = 'defuse'; return; }
        this.goto(g, e, [g.bombPos[0], g.bombPos[1]]);
        return;
      }
      // 巡逻：在职责区域兜圈
      const area = this.role.startsWith('a') ? 'aSite' : this.role.startsWith('b') ? 'bSite' : 'ctMid';
      const spots = MAP.waypoints[area];
      const pick = spots[Math.floor(Math.random() * spots.length)];
      const d = Math.hypot(pick[0] - e.x, pick[1] - e.z);
      if (d < 2.5) { this.defendPos = pick; this.state = 'hold'; return; }
      this.goto(g, e, pick);
    }
  }

  private combat(dt: number, g: Game, e: Ent) {
    // CT：炸弹已安放且近在咫尺 → 优先拆包（如同 CS 中按住 E 不放）
    if (e.team === 'CT' && g.bombState === 'planted') {
      const d = Math.hypot(g.bombPos[0] - e.x, g.bombPos[1] - e.z);
      if (d < 4) { this.state = 'defuse'; return; }
    }
    const t = this.target;
    if (!t || !t.alive) {
      // 战斗结束：继续原计划（而非从出生点重新出发）
      this.state = 'goto';
      this.path = [];
      this.pathIdx = 0;
      this.gotoDone = true;
      return;
    }
    const dx = t.x - e.x, dz = t.z - e.z;
    const dist = Math.hypot(dx, dz);
    const speed = g.runSpeed(e) * (dist > 4 ? 1 : 0.35);

    // 瞄准
    const aimY = t.y + (t.crouch ? 1.05 : 1.45);
    const targetYaw = Math.atan2(dx, dz) + Math.PI;
    const dp = Math.atan2(aimY - (e.y + 1.5), dist);
    const turnRate = 7.5;
    let dyaw = targetYaw - e.yaw;
    dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
    e.yaw += dyaw * Math.min(1, turnRate * dt);
    e.bodyYaw = e.yaw;
    e.pitch += (dp - e.pitch) * Math.min(1, 8 * dt);

    // 是否开火
    this.reactT -= dt;
    this.burstPauseT -= dt;
    const aligned = Math.abs(dyaw) < 0.16 && this.reactT <= 0;
    const visible = g.time - this.lastSeenT < 0.25;
    let wantFire = aligned && visible && this.burstPauseT <= 0;

    // 移动：横移 + 保持距离
    const prefer = e.weapons[e.currentSlot]?.def;
    const wantDist = prefer ? (prefer.id === 'awp' ? 18 : prefer.slot === 2 ? 9 : 11) : 10;
    let mx = 0, mz = 0;
    // 炸弹已安放：CT 交战时也要向炸弹推进（回防紧迫性）
    if (e.team === 'CT' && g.bombState === 'planted') {
      const bdx = g.bombPos[0] - e.x, bdz = g.bombPos[1] - e.z;
      const bd = Math.hypot(bdx, bdz);
      if (bd > 3.5) {
        mx += (bdx / bd) * 0.85;
        mz += (bdz / bd) * 0.85;
      }
    }
    this.strafeT -= dt;
    if (this.strafeT <= 0) {
      this.strafeDir = Math.random() < 0.5 ? -1 : 1;
      this.strafeT = 0.4 + Math.random() * 1.1;
    }
    // 横移方向（垂直于目标方向）
    const perpX = -Math.sin(e.yaw), perpZ = Math.cos(e.yaw);
    // 炸弹已安放：CT 向炸弹的推进方向（叠加在任何移动之上）
    let bombPX = 0, bombPZ = 0;
    if (e.team === 'CT' && g.bombState === 'planted') {
      const bdx = g.bombPos[0] - e.x, bdz = g.bombPos[1] - e.z;
      const bd = Math.hypot(bdx, bdz);
      if (bd > 3.5) { bombPX = (bdx / bd) * 0.85; bombPZ = (bdz / bd) * 0.85; }
    }
    if (wantFire) {
      // 射击间歇小横移
      mx = perpX * this.strafeDir * 0.55 + bombPX;
      mz = perpZ * this.strafeDir * 0.55 + bombPZ;
      if (dist > wantDist + 4) { mx += Math.sin(e.yaw) * 0.7; mz += -Math.cos(e.yaw) * 0.7; }
      if (dist < wantDist - 3) { mx -= Math.sin(e.yaw) * 0.7; mz -= -Math.cos(e.yaw) * 0.7; }
    } else if (dist > wantDist + 6) {
      mx = Math.sin(e.yaw) + bombPX; mz = -Math.cos(e.yaw) + bombPZ;
      wantFire = false;
    } else if (dist < 3.5) {
      mx = -Math.sin(e.yaw); mz = Math.cos(e.yaw);
    }
    const ml = Math.hypot(mx, mz);
    if (ml > 0.01) { mx /= ml; mz /= ml; }
    g.aiMoveTo(e, mx, mz, speed, dt);

    // 开火控制
    if (wantFire) {
      const def = e.weapons[e.currentSlot]?.def;
      if (def) {
        if (this.burstLeft <= 0) {
          this.burstLeft = def.id === 'awp' ? 1 : def.slot === 2 ? 2 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 5);
          this.burstPauseT = 0;
        }
        // 射击散布：移动 + 距离 + 技巧
        const movePenalty = Math.hypot(e.vx || 0, e.vz || 0) * 0.02;
        const distPenalty = dist * 0.0006;
        const err = this.aimError + movePenalty + distPenalty + e.bloom;
        g.botTryFire(e, err, dt);
        if (g.lastBotFired) {
          this.burstLeft--;
          if (this.burstLeft <= 0) {
            this.burstPauseT = 0.35 + Math.random() * 0.5;
          }
        }
      }
    }
  }

  private doPlant(dt: number, g: Game, e: Ent) {
    if (!e.hasBomb) { this.state = 'goto'; this.chooseRoute(g, e); return; }
    const site = g.siteAt(e.x, e.z);
    if (!site) {
      // 不在点内：去下包点
      if (this.plantSpot) this.goto(g, e, this.plantSpot);
      this.state = 'goto';
      return;
    }
    g.aiMoveTo(e, 0, 0, 0, dt);
    g.botPlant(e, dt);
    if (g.bombState === 'planted') {
      this.state = 'hold';
      this.defendPos = [g.bombPos[0], g.bombPos[1]];
    }
  }

  private doDefuse(dt: number, g: Game, e: Ent) {
    if (g.bombState !== 'planted') { this.state = 'goto'; this.chooseRoute(g, e); return; }
    const d = Math.hypot(g.bombPos[0] - e.x, g.bombPos[1] - e.z);
    if (d > 2.4) {
      this.goto(g, e, [g.bombPos[0], g.bombPos[1]]);
      this.state = 'goto';
      return;
    }
    g.aiMoveTo(e, 0, 0, 0, dt);
    e.yaw = Math.atan2(g.bombPos[0] - e.x, g.bombPos[1] - e.z) + Math.PI;
    g.botDefuse(e, dt);
  }

  private doHold(dt: number, g: Game, e: Ent) {
    // 炸弹已安放：立刻转拆包
    if (g.bombState === 'planted' && e.team === 'CT') {
      this.advancePlan(g, e);
      return;
    }
    // 周期重规划（CT 轮转 / T 支援）
    this.holdT -= dt;
    if (this.holdT <= 0) {
      this.holdT = 4 + Math.random() * 4;
      if (Math.random() < 0.3) {
        this.advancePlan(g, e);
        return;
      }
    }
    if (!this.defendPos) { this.chooseRoute(g, e); return; }
    // 朝向威胁方向 / 扫视
    const target = this.target;
    if (target && target.alive) {
      const dy = Math.atan2(target.x - e.x, target.z - e.z) + Math.PI;
      e.yaw += (dy - e.yaw) * Math.min(1, 6 * dt);
      e.bodyYaw = e.yaw;
      this.enterCombat(g, e);
      return;
    }
    // 缓慢扫视
    this.defendYaw += dt * 0.35;
    e.yaw = this.defendYaw;
    e.bodyYaw = e.yaw;
    const dx = this.defendPos[0] - e.x, dz = this.defendPos[1] - e.z;
    if (Math.hypot(dx, dz) > 1.5) {
      g.aiMoveTo(e, dx / (Math.abs(dx) + 1e-6) * 0.4, dz / (Math.abs(dz) + 1e-6) * 0.4, g.runSpeed(e) * 0.5, dt);
    } else {
      g.aiMoveTo(e, 0, 0, 0, dt);
    }
  }
}
