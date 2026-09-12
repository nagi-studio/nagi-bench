// AI 控制器：寻路、巡逻、索敌开火、下包 / 拆包决策

import { NAV, NAV_EDGES, SITES, navNode } from './map';
import { EYE_HEIGHT, TEAM_CT, TEAM_T } from './types';
import { PlayerEntity } from './entity';
import type { GameEngine } from './engine';

function normAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export class AIController {
  role = 'defA'; // carrier / carrierM8 / attackA / attackB / midLurk / defA / defB / midDef / roam
  siteTarget: 'A' | 'B' = 'A'; // 进攻方主攻包点
  path: number[] = [];
  goalNode = -1;
  state: 'move' | 'hold' | 'combat' = 'move';
  targetEnemy = -1;
  fireDelay = 0;
  stuckT = 0;
  lastX = 0;
  lastZ = 0;
  holdT = 0;
  scanT = 0;

  reset(): void {
    this.path = [];
    this.state = 'move';
    this.targetEnemy = -1;
    this.fireDelay = 0;
    this.stuckT = 0;
    this.holdT = 0;
    this.scanT = 0;
  }

  /** 回合开始时的职责分配 */
  static assignRoles(eng: GameEngine): void {
    const ts = eng.players.filter((p) => p.team === TEAM_T);
    const cs = eng.players.filter((p) => p.team === TEAM_CT);
    const site: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    const other: 'A' | 'B' = site === 'A' ? 'B' : 'A';
    for (const p of ts) {
      const c = eng.aiControllers[p.index];
      c.siteTarget = site;
      c.role = p.index === eng.bombCarrier ? 'carrier' : (Math.random() < 0.5 ? `attack${site}` : `attack${other}`);
    }
    const others = ts.filter((p) => p.index !== eng.bombCarrier);
    if (others.length >= 2) {
      eng.aiControllers[others[0].index].role = `attack${site}`;
      eng.aiControllers[others[1].index].role = `attack${other}`;
    }
    if (others.length >= 3) eng.aiControllers[others[2].index].role = 'midLurk';
    if (others.length >= 4) eng.aiControllers[others[3].index].role = `attack${other}`;

    const defs: ('defA' | 'defB' | 'midDef' | 'roam')[] = ['defA', 'defB', 'midDef', 'roam', 'roam'];
    cs.forEach((p, i) => {
      eng.aiControllers[p.index].role = defs[i];
    });
    // 切换默认主武器
    for (const p of eng.players) {
      if (p.team === TEAM_T && p.hasWeapon('ak47')) p.switchWeapon('primary');
      else if (p.team === TEAM_CT && p.hasWeapon('m4a4')) p.switchWeapon('primary');
    }
  }

  private nearestNode(x: number, z: number): number {
    let best = 0;
    let bestD = Infinity;
    for (const n of NAV) {
      const d = (n.x - x) * (n.x - x) + (n.z - z) * (n.z - z);
      if (d < bestD) { bestD = d; best = n.id; }
    }
    return best;
  }

  /** BFS 寻路（waypoint 图） */
  private computePath(fromX: number, fromZ: number, toNode: number): number[] {
    const start = this.nearestNode(fromX, fromZ);
    if (start === toNode) return [];
    const prev = new Map<number, number>();
    const visited = new Set<number>([start]);
    const queue: number[] = [start];
    let found = false;
    while (queue.length > 0 && !found) {
      const cur = queue.shift()!;
      for (const [a, b] of NAV_EDGES) {
        const nxt = a === cur ? b : b === cur ? a : -1;
        if (nxt < 0 || visited.has(nxt)) continue;
        visited.add(nxt);
        prev.set(nxt, cur);
        if (nxt === toNode) { found = true; break; }
        queue.push(nxt);
      }
    }
    if (!found) return [];
    const path: number[] = [];
    let cur = toNode;
    while (cur !== start) {
      path.unshift(cur);
      cur = prev.get(cur) ?? start;
    }
    return path;
  }

  /** 当前角色目标节点 */
  private goalFor(eng: GameEngine, bot: PlayerEntity): number {
    const planted = eng.bombPlanted;
    const bomb = { x: eng.bombX, z: eng.bombZ };
    if (bot.team === TEAM_T) {
      if (planted) {
        // 防守炸弹：围绕炸弹的固定偏移（确定性，避免每帧换目标）
        const ox = bomb.x + ((bot.index * 13) % 15) - 7;
        const oz = bomb.z + ((bot.index * 7) % 11) - 5;
        return this.nearestNode(ox, oz);
      }
      // 炸弹掉落时去捡
      if (eng.bombDropped && !bot.hasBomb) {
        return this.nearestNode(bomb.x, bomb.z);
      }
      switch (this.role) {
        case 'carrier':
        case 'carrierM8': return this.siteTarget === 'A' ? 29 : 9;
        case 'attackA': return 29;
        case 'attackB': return 9;
        case 'midLurk': return 19;
        default: return this.siteTarget === 'A' ? 29 : 9;
      }
    } else {
      if (planted) return this.nearestNode(bomb.x, bomb.z);
      switch (this.role) {
        case 'defA': return 29;
        case 'defB': return 9;
        case 'midDef': return 19;
        default: return 24; // roam 猫道 / CT 通道
      }
    }
  }

  think(eng: GameEngine, bot: PlayerEntity): void {
    bot.aiFire = false;
    bot.aiInteract = false;
    const dt = 0.12;

    // ---- 目标动作优先：捡包 / 下包 / 拆包（挨打也要继续执行） ----
    if (bot.team === TEAM_T && eng.bombDropped && !eng.bombPlanted && !bot.hasBomb) {
      if (Math.hypot(eng.bombX - bot.x, eng.bombZ - bot.z) < 1.1) {
        bot.aiInteract = true;
        bot.aiMoveX = 0;
        bot.aiMoveZ = 0;
        return;
      }
    }
    if (bot.team === TEAM_T && bot.hasBomb && !eng.bombPlanted) {
      const site = this.siteTarget === 'A' ? SITES[0] : SITES[1];
      const d = Math.hypot(bot.x - site.x, bot.z - site.z);
      if (d < site.radius * 0.5) {
        bot.aiInteract = true;
        bot.aiMoveX = 0;
        bot.aiMoveZ = 0;
        bot.yaw = Math.atan2(site.z - bot.z, site.x - bot.x);
        return;
      }
    }
    // ---- 拆包（已开始则坚持拆完；其余 CT 先清场再拆） ----
    if (bot.team === TEAM_CT && eng.bombPlanted) {
      const d = Math.hypot(bot.x - eng.bombX, bot.z - eng.bombZ);
      if (eng.defusingEntity === bot.index) {
        bot.aiInteract = true; // 已分配拆包：继续执行
        bot.aiMoveX = 0;
        bot.aiMoveZ = 0;
        return;
      }
      if (d < 1.15 && eng.defusingEntity === -1) {
        bot.aiInteract = true;
        bot.aiMoveX = 0;
        bot.aiMoveZ = 0;
        bot.yaw = Math.atan2(eng.bombZ - bot.z, eng.bombX - bot.x);
        return;
      }
    }

    // ---- 索敌（30m 内；优先反击最近伤害来源，避免被远距离目标带离路线） ----
    let visible: PlayerEntity | null = null;
    let bestScore = Infinity;
    for (const e of eng.players) {
      if (e.team === bot.team || !e.alive) continue;
      const d = Math.hypot(e.x - bot.x, e.z - bot.z);
      if (d > 30) continue;
      const ang = Math.atan2(e.z - bot.z, e.x - bot.x);
      if (Math.abs(normAngle(ang - bot.yaw)) > 2.1) continue;
      if (PlayerEntity.lineBlocked(bot.x, bot.z, e.x, e.z)) continue;
      const isDamager = e.index === bot.lastDamager && eng.simTime - bot.lastDamagerT < 3;
      const score = d - (isDamager ? 100 : 0);
      if (score < bestScore) {
        visible = e;
        bestScore = score;
      }
    }

    if (visible) {
      const newTarget = this.targetEnemy !== visible.index;
      this.state = 'combat';
      this.targetEnemy = visible.index;
      if (newTarget) {
        // CT 反应更快（回防拆包有利）
        this.fireDelay = bot.team === TEAM_CT ? 0.12 + Math.random() * 0.28 : 0.3 + Math.random() * 0.5;
      }
      this.fireDelay = Math.max(0, this.fireDelay - dt);
      const dist = Math.hypot(visible.x - bot.x, visible.z - bot.z);
      const desired = Math.atan2(visible.z - bot.z, visible.x - bot.x);
      const diff = normAngle(desired - bot.yaw);
      bot.yaw += Math.max(-6, Math.min(6, diff)) * dt;
      bot.pitch = Math.max(-1.4, Math.min(1.4, Math.atan2(EYE_HEIGHT - 0.35 - EYE_HEIGHT, dist)));
      if (Math.abs(diff) < 0.3 && dist < 36 && this.fireDelay <= 0) {
        bot.aiFire = true;
      }
      // 拆包优先：CT 在炸弹附近或时间紧迫时不停下缠斗
      const defuseUrgent =
        bot.team === TEAM_CT && eng.bombPlanted &&
        (Math.hypot(bot.x - eng.bombX, bot.z - eng.bombZ) < 35 || eng.bombTime < 25);
      if (dist <= 22 && !defuseUrgent) {
        bot.aiMoveX = 0;
        bot.aiMoveZ = 0;
        return;
      }
      if (defuseUrgent) {
        // 边打边冲向炸弹
        const bd = Math.atan2(eng.bombZ - bot.z, eng.bombX - bot.x);
        const bdiff = normAngle(bd - bot.yaw);
        bot.aiMoveX = Math.sin(bdiff);
        bot.aiMoveZ = Math.cos(bdiff);
        return;
      }
      // 远距离：向敌人推进（边走边打），避免远距离站桩对峙
      const pushDiff = normAngle(desired - bot.yaw);
      bot.aiMoveX = Math.sin(pushDiff) * 0.7;
      bot.aiMoveZ = Math.cos(pushDiff) * 0.7;
      return;
    }
    if (this.state === 'combat') {
      this.state = 'move';
      this.targetEnemy = -1;
    }

    // ---- 移动寻路 ----
    const goalNode = this.goalFor(eng, bot);
    if (this.goalNode !== goalNode || this.path.length === 0) {
      this.goalNode = goalNode;
      this.path = this.computePath(bot.x, bot.z, goalNode);
      this.stuckT = 0;
      this.lastX = bot.x;
      this.lastZ = bot.z;
    }

    const target = this.path.length > 0 ? navNode(this.path[0]) : navNode(goalNode);
    let tx = target.x, tz = target.z;
    // CT 拆包冲刺：路径走完后直奔炸弹精确位置
    const rushDefuse = bot.team === TEAM_CT && eng.bombPlanted && this.path.length === 0;
    if (rushDefuse) {
      tx = eng.bombX;
      tz = eng.bombZ;
    }
    const dGoal = Math.hypot(tx - bot.x, tz - bot.z);
    if (dGoal < 1.4) {
      if (this.path.length > 0) this.path.shift();
      else if (!rushDefuse) {
        this.state = 'hold';
        this.holdT = 2 + Math.random() * 5;
      }
    }

    // 卡住检测
    const moved = Math.hypot(bot.x - this.lastX, bot.z - this.lastZ);
    this.stuckT += moved < 0.05 ? dt : 0;
    this.lastX = bot.x;
    this.lastZ = bot.z;
    if (this.stuckT > 1.2) {
      this.stuckT = 0;
      if (this.path.length > 1) this.path.shift();
      else this.path = [];
    }

    if (this.state === 'hold') {
      this.holdT -= dt;
      // 驻守：缓慢转动扫描
      this.scanT += dt;
      const cur = navNode(this.nearestNode(bot.x, bot.z));
      const ang = Math.atan2(cur.z - bot.z, cur.x - bot.x);
      bot.yaw += normAngle(ang + Math.sin(this.scanT * 1.2 + bot.index) * 0.8 - bot.yaw) * 0.04;
      bot.aiMoveX = 0;
      bot.aiMoveZ = 0;
      if (this.holdT <= 0) {
        this.state = 'move';
        // 巡逻到相邻节点
        const neighbors: number[] = [];
        for (const [a, b] of NAV_EDGES) {
          if (a === this.goalNode) neighbors.push(b);
          if (b === this.goalNode) neighbors.push(a);
        }
        if (neighbors.length > 0) {
          const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
          this.goalNode = pick;
          this.path = [pick];
        }
      }
      return;
    }

    // 朝目标移动（本地输入：mx 横向 / mz 纵向）
    const desiredYaw = Math.atan2(tz - bot.z, tx - bot.x);
    const diff = normAngle(desiredYaw - bot.yaw);
    bot.yaw += Math.max(-5.5, Math.min(5.5, diff)) * dt;
    let repX = 0, repZ = 0;
    for (const mate of eng.players) {
      if (mate === bot || !mate.alive || mate.team !== bot.team) continue;
      const dx = bot.x - mate.x, dz = bot.z - mate.z;
      const d = Math.hypot(dx, dz);
      if (d < 1.3 && d > 0.01) {
        repX += (dx / d) * (1.3 - d) * 2;
        repZ += (dz / d) * (1.3 - d) * 2;
      }
    }
    const fdiff = normAngle(Math.atan2(tz + repZ - bot.z, tx + repX - bot.x) - bot.yaw);
    bot.aiMoveX = Math.sin(fdiff);
    bot.aiMoveZ = Math.cos(fdiff);
  }
}
