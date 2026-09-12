// 游戏引擎：回合状态机、战斗、C4、事件、快照

import { PlayerEntity } from './entity';
import { WEAPONS } from './weapons';
import { T_SPAWNS, CT_SPAWNS, isInSite, OBSTACLES } from './map';
import { SoundManager } from './audio';
import { AIController } from './ai';
import {
  TEAM_CT, TEAM_T, EYE_HEIGHT, PLANT_TIME, DEFUSE_TIME, BOMB_FUSE,
  ROUND_TIME, type Team, type WeaponId, type GameEvent, type HudState,
  type MinimapData, type Slot,
} from './types';

export interface InputState {
  mx: number; // 鼠标横向增量（每帧直接累加）
  mz: number; // 鼠标纵向增量
  moveX: number; // -1..1 左右移动
  moveZ: number; // -1..1 前后移动
  run: boolean;
  fire: boolean;
  zoom: boolean;
  reload: boolean;
  jump: boolean;
  interact: boolean;
  cycleSlot: 0 | 1 | -1;
  slotSelect: Slot | null;
}

export interface RoundResult {
  winner: Team;
  reason: string;
}

const EMPTY_INPUT: InputState = {
  mx: 0, mz: 0, moveX: 0, moveZ: 0, run: false, fire: false, zoom: false,
  reload: false, jump: false, interact: false, cycleSlot: 0, slotSelect: null,
};

export class GameEngine {
  players: PlayerEntity[] = [];
  audio: SoundManager;
  onEvent: (e: GameEvent) => void;

  phase: 'freeze' | 'live' | 'over' = 'freeze';
  phaseT = 3.5;
  roundTime = ROUND_TIME;
  roundNum = 1;
  scoreCT = 0;
  scoreT = 0;
  lastWinner: Team | -1 = -1;
  lastReason = '';
  gameOver = false;

  // C4
  bombCarrier = -1;
  bombPlanted = false;
  bombDropped = false;
  bombX = 0; bombZ = 0;
  bombTime = BOMB_FUSE;
  plantProgress = 0;
  defuseProgress = 0;
  plantingEntity = -1;
  defusingEntity = -1;
  private beepTimer = 0;

  input: InputState = { ...EMPTY_INPUT };
  simTime = 0; // 全局模拟时间（秒）
  camIndex = 0; // 视角实体（玩家或接管的队友）
  playerAlive = true;
  playerZoom = false;
  private snapT = 0;
  private aiLoopT = 0;
  seenByTeam = new Set<number>(); // 被 CT 或 T 看到的敌人
  aiControllers: AIController[] = [];
  private meleeCool = new Map<number, number>();
  private overT = 0;

  constructor(audio: SoundManager, onEvent: (e: GameEvent) => void) {
    this.audio = audio;
    this.onEvent = onEvent;
    for (let i = 0; i < 5; i++) {
      const p = new PlayerEntity(i, TEAM_CT);
      this.players.push(p);
    }
    for (let i = 5; i < 10; i++) {
      const p = new PlayerEntity(i, TEAM_T);
      this.players.push(p);
    }
    this.players[0].isPlayer = true;
    for (let i = 0; i < 10; i++) {
      this.aiControllers.push(new AIController());
    }
    this.startRound(true);
  }

  // ---------------- 回合管理 ----------------
  startRound(pistol: boolean): void {
    this.phase = 'freeze';
    this.phaseT = 3.5;
    this.roundTime = ROUND_TIME;
    this.bombPlanted = false;
    this.bombDropped = false;
    this.bombTime = BOMB_FUSE;
    this.plantProgress = 0;
    this.defuseProgress = 0;
    this.plantingEntity = -1;
    this.defusingEntity = -1;
    this.seenByTeam.clear();
    this.playerZoom = false;
    this.input.mx = 0;
    this.input.mz = 0;

    const spawns = this.players.map((p) => (p.team === TEAM_T ? T_SPAWNS : CT_SPAWNS));
    for (let i = 0; i < 10; i++) {
      const p = this.players[i];
      const s = spawns[i][i % 5];
      p.x = s.x; p.z = s.z; p.y = 0;
      p.vx = 0; p.vy = 0; p.vz = 0;
      p.yaw = s.yaw + (Math.random() - 0.5) * 0.4;
      p.pitch = 0;
      p.alive = true;
      p.hasBomb = false;
      p.hitFlash = 0;
      p.recoilKick = 0;
      p.spread = 0;
      p.reloading = false;
      p.fireCooldown = 0;
      p.setupLoadout(pistol);
      this.aiControllers[i].reset();
    }
    // C4 交给随机 T
    const ts = this.players.filter((p) => p.team === TEAM_T);
    const carrier = ts[Math.floor(Math.random() * ts.length)];
    carrier.hasBomb = true;
    this.bombCarrier = carrier.index;

    // AI 职责分配与主武器切换
    AIController.assignRoles(this);

    this.camIndex = 0;
    this.players[0].isPlayer = true;
    this.playerAlive = true;
    for (const p of this.players) p.isPlayer = p.index === 0;

    this.audio.play('roundStart');
    this.onEvent({ type: 'roundStart', roundNum: this.roundNum, pistol });
  }

  resetGame(): void {
    this.roundNum = 1;
    this.scoreCT = 0;
    this.scoreT = 0;
    this.gameOver = false;
    this.startRound(true);
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase === 'over') return;
    this.phase = 'over';
    this.overT = 2.8;
    this.lastWinner = winner;
    this.lastReason = reason;
    if (winner === TEAM_CT) this.scoreCT++; else this.scoreT++;
    if (this.scoreCT >= 8 || this.scoreT >= 8) this.gameOver = true;
    this.audio.play('roundEnd');
    this.onEvent({ type: 'roundEnd', winner, reason });
  }

  private checkRoundEnd(): void {
    const aliveCT = this.players.filter((p) => p.team === TEAM_CT && p.alive);
    const aliveT = this.players.filter((p) => p.team === TEAM_T && p.alive);
    if (aliveCT.length === 0) {
      this.endRound(TEAM_T, 'CT 全灭');
      return;
    }
    if (aliveT.length === 0 && !this.bombPlanted) {
      this.endRound(TEAM_CT, 'T 全灭');
      return;
    }
    // T 全灭但已下包：等待拆包或爆炸
  }

  // ---------------- 主更新 ----------------
  update(dt: number): void {
    this.simTime += dt;
    this.phaseT -= dt;
    if (this.phase === 'freeze' && this.phaseT <= 0) {
      this.phase = 'live';
      this.audio.play('roundStart');
    }
    if (this.phase === 'over') {
      this.overT -= dt;
      if (this.overT <= 0 && !this.gameOver) {
        this.roundNum++;
        this.startRound(this.roundNum === 1); // 只有第 1 回合是手枪局
      } else if (this.overT <= 0) {
        // 游戏结束，等待 UI 重置
      }
      // over 阶段仍更新动画
      for (const p of this.players) this.updateEntityFx(p, dt);
      return;
    }

    if (this.phase === 'live') {
      this.roundTime -= dt;
      if (this.roundTime <= 0) {
        if (this.bombPlanted) this.endRound(TEAM_T, '时间耗尽（炸弹已安放）');
        else this.endRound(TEAM_CT, '时间耗尽');
      }
    }

    // 玩家输入 → 受控实体
    const cam = this.players[this.camIndex];
    if (cam.alive && this.phase === 'live') {
      this.applyPlayerInput(cam, dt);
    } else if (cam.alive && this.phase !== 'live') {
      // 冻结期可以转身
      cam.yaw += this.input.mx;
      cam.pitch = Math.max(-1.4, Math.min(1.4, cam.pitch - this.input.mz));
      this.input.mx = 0;
      this.input.mz = 0;
    }

    // AI 思考（节流）
    this.aiLoopT -= dt;
    if (this.aiLoopT <= 0) {
      this.aiLoopT = 0.12;
      for (let i = 0; i < 10; i++) {
        const p = this.players[i];
        if (!p.alive || p.isPlayer) continue;
        if (this.phase !== 'live') continue;
        this.aiControllers[i].think(this, p);
      }
    }

    // 物理与动画
    for (const p of this.players) {
      if (!p.alive) continue;
      this.updateEntityFx(p, dt);
      if (p.isPlayer) continue; // 玩家物理由 applyPlayerInput 驱动
      if (this.phase !== 'live') { p.updatePhysics(dt, 0, 0, false, 1); continue; }
      const def = WEAPONS[p.activeWeapon];
      p.updatePhysics(dt, p.aiMoveX, p.aiMoveZ, true, def.moveSpeedMult);
      if (p.aiFire && p.canFire()) this.tryFire(p);
      if (p.aiInteract) p.aiInteractLock = 0.15; // 保持互动意图
      p.aiInteractLock = Math.max(0, p.aiInteractLock - dt);
      if (p.aiInteractLock > 0) this.tryInteract(p);
    }

    // 安放 / 拆除进度（按 dt 累积）
    this.updateActions(dt);

    // C4 逻辑
    this.updateBomb(dt);

    // 回合结束检查
    this.checkRoundEnd();

    // 可见敌人（供小地图）
    this.updateVision();
  }

  private updateEntityFx(p: PlayerEntity, dt: number): void {
    p.fireCooldown -= dt;
    p.firingAnim = Math.max(0, p.firingAnim - dt * 4);
    p.hitFlash = Math.max(0, p.hitFlash - dt * 3);
    p.recoilKick = Math.max(0, p.recoilKick - dt * 3.2);
    p.updateReload(dt);
    if (p.mag <= 0 && !p.reloading && p.alive) p.startReload();
  }

  // 玩家（含接管 bot）输入应用
  private applyPlayerInput(p: PlayerEntity, dt: number): void {
    const inp = this.input;
    const def = WEAPONS[p.activeWeapon];
    // 转身
    p.yaw += inp.mx;
    p.pitch = Math.max(-1.45, Math.min(1.45, p.pitch - inp.mz));
    inp.mx = 0;
    inp.mz = 0;
    // 武器切换
    if (inp.cycleSlot !== 0) {
      p.cycleSlot(inp.cycleSlot);
      inp.cycleSlot = 0;
    }
    if (inp.slotSelect) {
      p.switchWeapon(inp.slotSelect);
      inp.slotSelect = null;
    }
    // 换弹
    if (inp.reload) { p.startReload(); inp.reload = false; }
    // 跳跃
    if (inp.jump) { p.jump(); inp.jump = false; }
    // 移动（植物/拆包时不可移动）
    const doingAction = this.plantingEntity === p.index || this.defusingEntity === p.index;
    const zoomed = this.playerZoom;
    const speedMult = def.moveSpeedMult * (zoomed ? 0.55 : 1);
    if (!doingAction && this.phase === 'live') {
      p.updatePhysics(dt, inp.moveX, inp.moveZ, inp.run, speedMult);
    }
    // 开火
    if (inp.fire && this.phase === 'live') {
      this.tryFire(p);
    }
    // 互动（E）
    if (inp.interact && this.phase === 'live') {
      this.tryInteract(p);
    }
  }

  // ---------------- 战斗 ----------------
  tryFire(p: PlayerEntity): void {
    const def = WEAPONS[p.activeWeapon];
    if (!p.canFire()) {
      if (def.slot !== 'melee' && p.mag <= 0 && !p.reloading) this.audio.play('dryfire');
      return;
    }
    p.fireCooldown = def.fireInterval;

    if (def.slot === 'melee') {
      this.meleeAttack(p);
      return;
    }

    // 消耗弹药
    p.mag--;
    p.spread = Math.min(p.spread + def.spreadPerShot, def.spreadMax);
    p.recoilKick = Math.min(p.recoilKick + def.recoilPitch, 0.5);
    p.firingAnim = 1;
    // 射击音效
    this.audio.play(p.activeWeapon);

    // 弹道方向（含散布）
    const sp = p.spread;
    const yaw = p.yaw + (Math.random() - 0.5) * 2 * sp;
    const pitch = p.pitch + (Math.random() - 0.5) * 2 * sp * 0.8 - p.recoilKick * 0.5;
    const dx = Math.cos(yaw) * Math.cos(pitch);
    const dy = Math.sin(pitch);
    const dz = Math.sin(yaw) * Math.cos(pitch);
    const hit = this.rayTrace(p, dx, dy, dz, def.range);
    if (hit) {
      this.applyDamage(p, hit, def);
    }
    // AWP 开火后自动关镜
    if (def.scope && this.playerZoom) {
      this.playerZoom = false;
      this.audio.play('zoom');
    }
    // 子弹示踪（渲染用）
    p.emit = { dx, dy, dz };
  }

  private meleeAttack(p: PlayerEntity): void {
    p.firingAnim = 1;
    this.audio.play('knife');
    let best: PlayerEntity | null = null;
    let bestD = Infinity;
    for (const e of this.players) {
      if (e.team === p.team || !e.alive) continue;
      const dx = e.x - p.x, dz = e.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d > 1.9) continue;
      const ang = Math.atan2(dz, dx) - p.yaw;
      const a = Math.atan2(Math.sin(ang), Math.cos(ang));
      if (Math.abs(a) > 1.1) continue;
      if (d < bestD) { bestD = d; best = e; }
    }
    if (best) {
      const dmg = 55;
      this.dealDamage(p, best, dmg, 'chest', false);
    }
  }

  /** 射线检测：返回命中的敌人与部位 */
  private rayTrace(attacker: PlayerEntity, dx: number, dy: number, dz: number, range: number): { target: PlayerEntity; zone: string; mult: number } | null {
    const ox = attacker.x, oy = EYE_HEIGHT, oz = attacker.z;
    // 最近墙体
    const wallT = this.rayWallDistance(ox, oz, dx, dz, range);
    let best: { target: PlayerEntity; zone: string; mult: number; t: number } | null = null;
    for (const e of this.players) {
      if (e.team === attacker.team || !e.alive) continue;
      const ex = e.x - ox, ez = e.z - oz;
      const hLen2 = dx * dx + dz * dz;
      if (hLen2 < 1e-9) continue;
      let t = (ex * dx + ez * dz) / hLen2;
      if (t < 0) t = 0;
      if (t > range || t > wallT) continue;
      const hx = ox + dx * t - e.x;
      const hz = oz + dz * t - e.z;
      const hDist = Math.hypot(hx, hz);
      if (hDist > 0.42) continue;
      const py = oy + dy * t;
      if (py < 0.05 || py > 1.85) continue;
      const zr = PlayerEntity.hitZoneFor(py, hDist);
      if (!best || t < best.t) best = { target: e, zone: zr.zone, mult: zr.mult, t };
    }
    if (!best) return null;
    return { target: best.target, zone: best.zone, mult: best.mult };
  }

  private rayWallDistance(ox: number, oz: number, dx: number, dz: number, maxT: number): number {
    let best = Infinity;
    for (let i = 0; i < OBSTACLES.length; i++) {
      const o = OBSTACLES[i];
      let tMin = 0, tMax = 1;
      let ok = true;
      if (Math.abs(dx) < 1e-9) { if (ox < o.x0 || ox > o.x1) ok = false; }
      else {
        let t1 = (o.x0 - ox) / dx, t2 = (o.x1 - ox) / dx;
        if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
        tMin = Math.max(tMin, t1); tMax = Math.min(tMax, t2);
        if (tMin > tMax) ok = false;
      }
      if (!ok) continue;
      if (Math.abs(dz) < 1e-9) { if (oz < o.z0 || oz > o.z1) ok = false; }
      else {
        let t1 = (o.z0 - oz) / dz, t2 = (o.z1 - oz) / dz;
        if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
        tMin = Math.max(tMin, t1); tMax = Math.min(tMax, t2);
        if (tMin > tMax) ok = false;
      }
      if (ok && tMin > 0.02 && tMin < best && tMin <= maxT) best = tMin;
    }
    return Math.min(best, maxT);
  }

  private applyDamage(attacker: PlayerEntity, hit: { target: PlayerEntity; zone: string; mult: number }, def: { damage: number; headMult: number; pen: number }): void {
    const t = hit.target;
    const zone = hit.zone;
    const head = zone === 'head';
    const mult = head ? def.headMult : hit.mult;
    let dmg = def.damage * mult;
    const armoredZone = zone !== 'legs';
    let absorbed = 0;
    if (armoredZone && t.armor > 0) {
      absorbed = dmg * (1 - def.pen) * 0.85;
      dmg -= absorbed;
      t.armor = Math.max(0, t.armor - absorbed);
    }
    this.dealDamage(attacker, t, Math.max(1, Math.round(dmg)), zone, head);
  }

  private dealDamage(attacker: PlayerEntity, victim: PlayerEntity, dmg: number, zone: string, head: boolean): void {
    victim.hp -= dmg;
    victim.hitFlash = 1;
    victim.lastDamager = attacker.index;
    victim.lastDamagerT = this.simTime;
    // 音效反馈
    if (victim.isPlayer) {
      this.audio.play(zone === 'head' ? 'headshot' : victim.armor > 0 ? 'armorHit' : 'hit');
    }
    if (attacker.isPlayer) {
      this.audio.play('hit');
      this.onEvent({ type: 'hit', fatal: victim.hp <= 0, headshot: head });
    }
    if (victim.hp <= 0) {
      victim.hp = 0;
      victim.alive = false;
      this.onKill(attacker, victim, attacker.activeWeapon, head);
    }
  }

  private onKill(killer: PlayerEntity, victim: PlayerEntity, weapon: WeaponId, head: boolean): void {
    this.audio.play('kill');
    if (victim.isPlayer) {
      this.audio.play('death');
      this.playerZoom = false;
    }
    // 掉落 C4
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bombCarrier = -1;
      this.bombDropped = true;
      this.bombX = victim.x + (Math.random() - 0.5);
      this.bombZ = victim.z + (Math.random() - 0.5);
      this.onEvent({ type: 'bombDropped' });
      this.audio.play('pickup');
    }
    this.onEvent({ type: 'kill', killer: killer.index, victim: victim.index, weapon, headshot: head });
    // 玩家阵亡 → 切换视角到存活队友
    if (victim.isPlayer) {
      this.playerAlive = false;
      this.assignSpectate();
    }
    this.checkRoundEnd();
  }

  private assignSpectate(): void {
    const prev = this.players[this.camIndex];
    if (prev) prev.isPlayer = false;
    const aliveCT = this.players.filter((p) => p.team === TEAM_CT && p.alive);
    if (aliveCT.length > 0) {
      // 优先选择当前 camIndex 的下一个
      const idxs = aliveCT.map((p) => p.index);
      let pick = idxs[0];
      for (const i of idxs) {
        if (i > this.camIndex) { pick = i; break; }
      }
      this.camIndex = pick;
      this.players[pick].isPlayer = true;
      this.onEvent({ type: 'playerTakeover', index: pick });
    }
  }

  cycleSpectate(): void {
    if (this.players[0].alive) return;
    const aliveCT = this.players.filter((p) => p.team === TEAM_CT && p.alive);
    if (aliveCT.length === 0) return;
    const idxs = aliveCT.map((p) => p.index);
    const cur = idxs.indexOf(this.camIndex);
    this.players[this.camIndex].isPlayer = false;
    this.camIndex = idxs[(cur + 1) % idxs.length];
    this.players[this.camIndex].isPlayer = true;
    this.onEvent({ type: 'playerTakeover', index: this.camIndex });
  }

  // ---------------- 互动：安放 / 拆除 / 捡包 ----------------
  /** 发起互动（每帧按住时调用；进度累积在 updateActions） */
  tryInteract(p: PlayerEntity): void {
    // 捡包（T）
    if (!p.hasBomb && p.team === TEAM_T && this.bombDropped && !this.bombPlanted) {
      const d = Math.hypot(p.x - this.bombX, p.z - this.bombZ);
      if (d < 1.0) {
        p.hasBomb = true;
        this.bombCarrier = p.index;
        this.bombDropped = false;
        this.audio.play('pickup');
        this.onEvent({ type: 'bombPicked' });
        return;
      }
    }
    // 下包（T）
    if (p.hasBomb && !this.bombPlanted && this.phase === 'live') {
      const site = isInSite(p.x, p.z);
      if (site && this.plantingEntity === -1) {
        this.plantingEntity = p.index;
        this.plantProgress = 0;
        return;
      }
    }
    // 拆包（CT）
    if (p.team === TEAM_CT && this.bombPlanted && this.defusingEntity === -1) {
      const d = Math.hypot(p.x - this.bombX, p.z - this.bombZ);
      if (d < 1.3) {
        this.defusingEntity = p.index;
        this.defuseProgress = 0;
      }
    }
  }

  /** 安放 / 拆除进度累积（dt 驱动） */
  private updateActions(dt: number): void {
    // 安放
    if (this.plantingEntity >= 0) {
      const p = this.players[this.plantingEntity];
      const holding = p.isPlayer ? this.input.interact : p.aiInteractLock > 0;
      const valid = p.alive && p.hasBomb && !this.bombPlanted && this.phase === 'live'
        && !!isInSite(p.x, p.z) && holding;
      if (!valid) {
        this.plantingEntity = -1;
        this.plantProgress = 0;
      } else {
        this.plantProgress += dt / PLANT_TIME;
        if (this.plantProgress >= 1) {
          this.plantingEntity = -1;
          this.plantProgress = 0;
          p.hasBomb = false;
          this.bombPlanted = true;
          this.bombCarrier = -1;
          this.bombX = p.x; this.bombZ = p.z;
          this.bombTime = BOMB_FUSE;
          this.audio.play('plant');
          this.onEvent({ type: 'plant' });
        }
      }
    }
    // 拆除
    if (this.defusingEntity >= 0) {
      const p = this.players[this.defusingEntity];
      const holding = p.isPlayer ? this.input.interact : p.aiInteractLock > 0;
      const d = Math.hypot(p.x - this.bombX, p.z - this.bombZ);
      const valid = p.alive && p.team === TEAM_CT && this.bombPlanted && d < 1.3 && holding;
      if (!valid) {
        this.defusingEntity = -1;
        this.defuseProgress = 0;
      } else {
        this.defuseProgress += dt / DEFUSE_TIME;
        if (this.defuseProgress >= 1) {
          this.defusingEntity = -1;
          this.defuseProgress = 0;
          this.bombPlanted = false;
          this.audio.play('defuse');
          this.onEvent({ type: 'defuse' });
          this.endRound(TEAM_CT, '成功拆包');
        }
      }
    }
  }

  private updateBomb(dt: number): void {
    // 玩家自动捡包
    const cam = this.players[this.camIndex];
    if (cam.alive && !cam.hasBomb && cam.team === TEAM_T && this.bombDropped && !this.bombPlanted) {
      const d = Math.hypot(cam.x - this.bombX, cam.z - this.bombZ);
      if (d < 0.7) {
        cam.hasBomb = true;
        this.bombCarrier = cam.index;
        this.bombDropped = false;
        this.audio.play('pickup');
        this.onEvent({ type: 'bombPicked' });
      }
    }
    if (!this.bombPlanted) return;
    this.bombTime -= dt;
    // 倒计时提示音（越来越快）
    this.beepTimer -= dt;
    const interval = Math.max(0.15, this.bombTime / 12);
    if (this.beepTimer <= 0 && this.bombTime > 0) {
      this.beepTimer = interval;
      this.audio.play('beep');
    }
    if (this.bombTime <= 0) {
      this.bombTime = 0;
      this.bombPlanted = false;
      this.audio.play('explode');
      this.onEvent({ type: 'explode' });
      // 爆炸伤害：范围内全部死亡
      for (const p of this.players) {
        if (!p.alive) continue;
        const d = Math.hypot(p.x - this.bombX, p.z - this.bombZ);
        if (d < 16) {
          p.hp = 0;
          p.alive = false;
          if (p.isPlayer) {
            this.playerAlive = false;
            this.assignSpectate();
          }
        }
      }
      this.endRound(TEAM_T, '炸弹爆炸');
    }
  }

  /** 开镜切换（玩家） */
  setZoom(on: boolean): void {
    const cam = this.players[this.camIndex];
    if (!cam.alive) return;
    const def = WEAPONS[cam.activeWeapon];
    if (!def.scope) return;
    if (this.playerZoom !== on) this.audio.play('zoom');
    this.playerZoom = on;
  }

  // ---------------- 视野（小地图） ----------------
  private updateVision(): void {
    for (const p of this.players) {
      if (!p.alive) continue;
      for (const e of this.players) {
        if (e.team === p.team || !e.alive) continue;
        const d = Math.hypot(e.x - p.x, e.z - p.z);
        if (d > 45) continue;
        if (!PlayerEntity.lineBlocked(p.x, p.z, e.x, e.z)) {
          this.seenByTeam.add(e.index);
        }
      }
    }
  }

  // 供 AI 使用的视野查询
  canSee(from: PlayerEntity, target: PlayerEntity, maxDist = 45): boolean {
    if (!target.alive) return false;
    const dx = target.x - from.x, dz = target.z - from.z;
    const d = Math.hypot(dx, dz);
    if (d > maxDist || d < 0.01) return false;
    if (PlayerEntity.lineBlocked(from.x, from.z, target.x, target.z)) return false;
    return true;
  }

  // ---------------- 快照 ----------------
  buildSnapshot(): HudState {
    const cam = this.players[this.camIndex];
    const minData: MinimapData = {
      self: { x: cam.x, z: cam.z, yaw: cam.yaw, alive: cam.alive },
      allies: [],
      enemies: [],
      bomb: this.bombPlanted
        ? { x: this.bombX, z: this.bombZ, state: 'planted' }
        : this.bombDropped
          ? { x: this.bombX, z: this.bombZ, state: 'dropped' }
          : this.bombCarrier >= 0
            ? { x: this.players[this.bombCarrier].x, z: this.players[this.bombCarrier].z, state: 'carried' }
            : null,
    };
    for (const p of this.players) {
      if (p.index === this.camIndex) continue;
      if (p.team === cam.team) {
        minData.allies.push({ x: p.x, z: p.z, alive: p.alive });
      } else if (p.alive && this.seenByTeam.has(p.index)) {
        minData.enemies.push({ x: p.x, z: p.z, alive: true });
      }
    }
    const actionLabel =
      this.plantingEntity >= 0 ? '正在安放炸弹...' :
      this.defusingEntity >= 0 ? '正在拆除炸弹...' : '';
    return {
      phase: this.phase,
      roundNum: this.roundNum,
      roundTime: Math.max(0, Math.ceil(this.roundTime)),
      roundTimeMax: ROUND_TIME,
      freezeTime: this.phase === 'freeze' ? Math.max(0, Math.ceil(this.phaseT)) : 0,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      lastRoundWinner: this.lastWinner,
      lastRoundReason: this.lastReason,
      camIndex: this.camIndex,
      spectating: this.camIndex !== 0 || !this.playerAlive,
      aliveCT: this.players.filter((p) => p.team === TEAM_CT && p.alive).length,
      aliveT: this.players.filter((p) => p.team === TEAM_T && p.alive).length,
      playerAlive: this.playerAlive,
      hp: Math.max(0, Math.round(cam.hp)),
      armor: Math.round(cam.armor),
      slot: cam.activeSlot,
      weapons: cam.weaponList().map((w) => ({ id: w, name: WEAPONS[w].name, slot: WEAPONS[w].slot })),
      ammoMag: Math.min(cam.mag, WEAPONS[cam.activeWeapon].magSize),
      ammoReserve: cam.reserve,
      reloading: cam.reloading,
      spread: cam.spread,
      zooming: this.playerZoom && cam.alive && WEAPONS[cam.activeWeapon].scope,
      hasBomb: cam.hasBomb,
      bombPlanted: this.bombPlanted,
      bombTime: Math.max(0, Math.ceil(this.bombTime)),
      plantProgress: this.plantingEntity === cam.index ? this.plantProgress : -1,
      defuseProgress: this.defusingEntity === cam.index ? this.defuseProgress : -1,
      actionLabel,
      weaponName: WEAPONS[cam.activeWeapon].name,
      killfeed: [],
      hitmark: 0,
      damageFlash: 0,
      minimap: minData,
    };
  }
}
