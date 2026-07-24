/**
 * 全局状态引擎。
 *
 * 三条时间线的耦合方式：
 *   渲染循环(rAF, 可变帧率) -> engine.step(dtReal)
 *      -> 内部按固定步长 1/64s 跑 fixedUpdate（物理/AI/武器/炸弹永远确定性）
 *      -> 渲染层用 prevPos/pos + alpha 做插值，所以画面平滑与物理频率解耦
 *   React 只订阅 20Hz 的快照（HUD 不需要 60Hz），小地图直接读引擎，
 *   都不会反过来驱动模拟。
 */

import { clamp, vdist2D, vdist2DSq } from '../core/math.ts';
import { Rng } from '../core/rng.ts';
import { buildMap, areaAt } from '../map/build.ts';
import type { BuiltMap } from '../map/build.ts';
import { NavGrid } from '../map/nav.ts';
import { CT_SPAWNS, T_SPAWNS } from '../map/dust2.ts';
import type { Actor, Team } from './actor.ts';
import {
  activeWeapon,
  activeWeaponDef,
  bestSlot,
  createActor,
  giveWeapon,
  resetActorIds,
  switchSlot,
} from './actor.ts';
import { moveActor, placeActor, separateActors } from './physics.ts';
import { updateWeapon, canSee } from './combat.ts';
import type { CombatCtx } from './combat.ts';
import { alertBot, assignTeamRoles, createBotState, rotateDefenders, updateBot } from './ai.ts';
import type { AiCtx } from './ai.ts';
import {
  BOMB_DAMAGE_RADIUS,
  BOMB_DEFUSE_RADIUS,
  BOMB_PICKUP_RADIUS,
  BOMB_TIMER,
  DEFUSE_TIME,
  PLANT_TIME,
  beepInterval,
  createBombState,
  siteAt,
} from './bomb.ts';
import type { BombState } from './bomb.ts';
import type { GameEvent } from './events.ts';
import type { WeaponId } from './weapons.ts';
import {
  ARMOR_HELMET_PRICE,
  ARMOR_PRICE,
  WEAPONS,
  defaultLoadout,
  pistolRoundLoadout,
} from './weapons.ts';

export const FIXED_DT = 1 / 64;
export const FREEZE_TIME = 6;
export const ROUND_TIME = 115;
export const ROUND_END_TIME = 5;
export const MAX_ROUNDS = 16;

export type RoundPhase = 'warmup' | 'freeze' | 'live' | 'over';

export interface KillfeedEntry {
  id: number;
  attacker: string;
  attackerTeam: Team | null;
  victim: string;
  victimTeam: Team;
  weapon: WeaponId;
  headshot: boolean;
  time: number;
}

export interface EngineOptions {
  /** 固定随机种子，方便复现 */
  seed?: number;
  /** 只打手枪局（每一回合都是手枪局） */
  pistolOnly?: boolean;
  /** 玩家阵营 */
  playerTeam?: Team;
  /** bot 平均技能 0..1 */
  botSkill?: number;
  playerName?: string;
}

const BOT_NAMES_T = ['Ivan', 'Rico', 'Zed', 'Kabu', 'Nomad', 'Vex', 'Sable', 'Onyx'];
const BOT_NAMES_CT = ['Sierra', 'Falk', 'Ridge', 'Nova', 'Quinn', 'Halo', 'Ember', 'Vault'];

export class GameEngine {
  readonly map: BuiltMap;
  readonly nav: NavGrid;
  readonly actors: Actor[] = [];
  readonly rng: Rng;
  readonly bomb: BombState = createBombState();

  time = 0;
  phase: RoundPhase = 'warmup';
  phaseTimer = 0;
  roundNumber = 0;
  scoreT = 0;
  scoreCT = 0;
  lastWinner: Team | null = null;
  lastReason = '';
  /** 连败计数，用于经济补偿 */
  private lossStreak: Record<Team, number> = { T: 1, CT: 1 };

  localActorId = -1;
  playerTeam: Team;
  pistolOnly: boolean;
  botSkill: number;

  events: GameEvent[] = [];
  killfeed: KillfeedEntry[] = [];
  private killfeedSeq = 1;

  /** 本队视野内的敌人（小地图用），index 与 actors 对齐 */
  enemyVisible: Uint8Array;
  private visTimer = 0;

  private accumulator = 0;
  private combatCtx: CombatCtx;
  private aiCtx: AiCtx;
  private bounds: { x0: number; z0: number; x1: number; z1: number };

  /** HUD 订阅 */
  private listeners = new Set<() => void>();
  private snapshotTimer = 0;
  private snapshotCache: HudSnapshot | null = null;
  private snapshotVersion = 0;

  /** 本回合是否已经买过（简单经济） */
  buyOpen = false;
  message = '';
  messageTimer = 0;

  constructor(opts: EngineOptions = {}) {
    this.rng = new Rng(opts.seed ?? 0x1337c5);
    this.playerTeam = opts.playerTeam ?? 'CT';
    this.pistolOnly = opts.pistolOnly ?? false;
    this.botSkill = opts.botSkill ?? 0.55;

    this.map = buildMap();
    this.nav = new NavGrid(this.map.world);
    this.bounds = this.map.world.bounds();

    resetActorIds();
    this.spawnTeams(opts.playerName ?? 'YOU');
    this.enemyVisible = new Uint8Array(this.actors.length);

    this.combatCtx = {
      world: this.map.world,
      actors: this.actors,
      rng: this.rng,
      time: 0,
      emit: (e) => this.emit(e),
      localActorId: this.localActorId,
      onKill: (victim, attacker, weapon, headshot) =>
        this.handleKill(victim, attacker, weapon, headshot),
    };
    this.aiCtx = {
      world: this.map.world,
      nav: this.nav,
      actors: this.actors,
      bomb: this.bomb,
      rng: this.rng,
      time: 0,
      live: false,
    };
  }

  /* ------------------------------------------------------------------ */
  /* 初始化                                                              */
  /* ------------------------------------------------------------------ */

  private spawnTeams(playerName: string): void {
    const mkTeam = (team: Team, names: string[]) => {
      for (let i = 0; i < 5; i++) {
        const isPlayer = team === this.playerTeam && i === 0;
        const a = createActor(team, isPlayer ? playerName : names[i], !isPlayer);
        // 玩家角色也带一份 AI，死亡后交还给电脑 / 玩家接管 bot 时可互换
        a.ai = createBotState(
          this.rng,
          clamp(this.botSkill + this.rng.range(-0.16, 0.16), 0.08, 0.98),
        );
        if (isPlayer) this.localActorId = a.id;
        this.actors.push(a);
      }
    };
    mkTeam('T', BOT_NAMES_T);
    mkTeam('CT', BOT_NAMES_CT);
  }

  get localActor(): Actor | null {
    return this.actors.find((a) => a.id === this.localActorId) ?? null;
  }

  actorById(id: number): Actor | null {
    return this.actors.find((a) => a.id === id) ?? null;
  }

  teamActors(team: Team): Actor[] {
    return this.actors.filter((a) => a.team === team);
  }

  aliveCount(team: Team): number {
    let n = 0;
    for (const a of this.actors) if (a.team === team && a.alive) n++;
    return n;
  }

  /* ------------------------------------------------------------------ */
  /* 回合流程                                                            */
  /* ------------------------------------------------------------------ */

  startMatch(): void {
    this.roundNumber = 0;
    this.scoreT = 0;
    this.scoreCT = 0;
    this.lossStreak = { T: 1, CT: 1 };
    for (const a of this.actors) {
      a.money = 800;
      a.kills = 0;
      a.deaths = 0;
      a.assists = 0;
    }
    this.startRound();
  }

  startRound(): void {
    this.roundNumber++;
    this.phase = 'freeze';
    this.phaseTimer = FREEZE_TIME;
    this.killfeed.length = 0;
    this.bombReset();

    const pistolRound = this.pistolOnly || this.roundNumber === 1;

    const tSpawns = this.rng.shuffle([...T_SPAWNS]);
    const ctSpawns = this.rng.shuffle([...CT_SPAWNS]);
    let ti = 0;
    let ci = 0;

    for (const a of this.actors) {
      const sp = a.team === 'T' ? tSpawns[ti++ % tSpawns.length] : ctSpawns[ci++ % ctSpawns.length];
      a.alive = true;
      a.health = 100;
      a.armor = 0;
      a.helmet = false;
      a.flinch = 0;
      a.hasBomb = false;
      a.plantProgress = 0;
      a.defuseProgress = 0;
      a.busy = false;
      a.deathTime = 0;
      a.punchPitch = 0;
      a.punchYaw = 0;
      a.spread = 0;
      a.recoilIndex = 0;
      a.scoped = false;
      a.scopeLevel = 0;
      a.reloadTimer = 0;
      a.fireCooldown = 0;
      a.inventory = {};
      a.yaw = sp.yaw;
      a.pitch = 0;
      a.prevYaw = sp.yaw;
      placeActor(this.map.world, a, sp.x, sp.z, 4);
      a.prevPos.x = a.pos.x;
      a.prevPos.y = a.pos.y;
      a.prevPos.z = a.pos.z;
      if (a.ai) {
        a.ai.holdYaw = sp.yaw;
        a.ai.mode = 'idle';
        a.ai.path.length = 0;
        a.ai.targetId = -1;
      }

      // 配枪
      giveWeapon(a, 'knife');
      const loadout = pistolRound
        ? pistolRoundLoadout(a.team)
        : this.autoLoadout(a, pistolRound);
      giveWeapon(a, loadout.secondary);
      if (loadout.primary) giveWeapon(a, loadout.primary);
      a.armor = loadout.armor;
      a.helmet = loadout.helmet;
      a.activeSlot = bestSlot(a);
      a.deployTimer = 0;
    }

    // 把包交给随机一个 T
    const ts = this.actors.filter((a) => a.team === 'T');
    const carrier = ts[this.rng.int(0, ts.length)];
    this.giveBombTo(carrier);

    assignTeamRoles(this.actors, 'T', this.rng);
    assignTeamRoles(this.actors, 'CT', this.rng);

    this.buyOpen = true;
    this.emit({ type: 'round', kind: 'freeze', round: this.roundNumber });
    this.setMessage(pistolRound ? '手枪局！' : `第 ${this.roundNumber} 回合`, 3);
    this.notify();
  }

  /** AI 的自动配装：钱够就买步枪，每队最多一把 AWP。 */
  private autoLoadout(a: Actor, pistolRound: boolean) {
    if (pistolRound) return pistolRoundLoadout(a.team);
    const teamMates = this.actors.filter((x) => x.team === a.team);
    const awpTaken = teamMates.some((x) => x.inventory.primary?.id === 'awp');
    const wantAwp = !awpTaken && a.money >= WEAPONS.awp.price && this.rng.bool(0.45);
    const base = defaultLoadout(a.team, wantAwp);

    let money = a.money;
    const out = { primary: undefined as WeaponId | undefined, secondary: base.secondary, armor: 0, helmet: false };
    const primaryPrice = base.primary ? WEAPONS[base.primary].price : 0;
    if (base.primary && money >= primaryPrice + 300) {
      out.primary = base.primary;
      money -= primaryPrice;
    } else if (money >= WEAPONS.deagle.price + 300) {
      out.secondary = 'deagle';
      money -= WEAPONS.deagle.price;
    }
    if (money >= ARMOR_HELMET_PRICE) {
      out.armor = 100;
      out.helmet = true;
      money -= ARMOR_HELMET_PRICE;
    } else if (money >= ARMOR_PRICE) {
      out.armor = 100;
      money -= ARMOR_PRICE;
    }
    a.money = money;
    return out;
  }

  private bombReset(): void {
    const b = this.bomb;
    b.phase = 'carried';
    b.carrierId = -1;
    b.planterId = -1;
    b.defuserId = -1;
    b.site = null;
    b.timer = BOMB_TIMER;
    b.plantProgress = 0;
    b.defuseProgress = 0;
    b.beepAccum = 0;
    b.pos.x = 0;
    b.pos.y = 0;
    b.pos.z = 0;
  }

  private giveBombTo(a: Actor): void {
    this.bomb.phase = 'carried';
    this.bomb.carrierId = a.id;
    a.hasBomb = true;
    giveWeapon(a, 'c4');
    this.bomb.pos.x = a.pos.x;
    this.bomb.pos.y = a.pos.y;
    this.bomb.pos.z = a.pos.z;
  }

  private endRound(winner: Team, reason: string): void {
    if (this.phase === 'over') return;
    this.phase = 'over';
    this.phaseTimer = ROUND_END_TIME;
    this.lastWinner = winner;
    this.lastReason = reason;
    if (winner === 'T') this.scoreT++;
    else this.scoreCT++;

    const loser: Team = winner === 'T' ? 'CT' : 'T';
    this.lossStreak[loser] = Math.min(4, this.lossStreak[loser] + 1);
    this.lossStreak[winner] = 1;
    const loseReward = 1400 + (this.lossStreak[loser] - 1) * 500;
    for (const a of this.actors) {
      a.money = Math.min(16000, a.money + (a.team === winner ? 3250 : loseReward));
    }

    this.emit({ type: 'round', kind: 'end', winner, reason, round: this.roundNumber });
    this.setMessage(`${winner === 'T' ? '恐怖分子' : '反恐精英'}获胜 — ${reason}`, ROUND_END_TIME);
    this.notify();
  }

  private checkRoundEnd(): void {
    if (this.phase !== 'live') return;
    const tAlive = this.aliveCount('T');
    const ctAlive = this.aliveCount('CT');

    if (this.bomb.phase === 'planted') {
      if (ctAlive === 0) {
        this.endRound('T', '消灭所有 CT');
      }
      return;
    }
    if (this.bomb.phase === 'defused') {
      this.endRound('CT', '成功拆除炸弹');
      return;
    }
    if (this.bomb.phase === 'exploded') {
      this.endRound('T', '炸弹爆炸');
      return;
    }
    if (tAlive === 0) {
      this.endRound('CT', '消灭所有 T');
      return;
    }
    if (ctAlive === 0) {
      this.endRound('T', '消灭所有 CT');
      return;
    }
    if (this.phaseTimer <= 0) {
      this.endRound('CT', '时间到，未安放炸弹');
    }
  }

  /* ------------------------------------------------------------------ */
  /* 主循环                                                              */
  /* ------------------------------------------------------------------ */

  step(dtReal: number): void {
    // 卡顿保护：一帧最多补 5 个物理步
    this.accumulator += Math.min(dtReal, 0.25);
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < 5) {
      this.fixedUpdate(FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps++;
    }
    if (steps === 5) this.accumulator = 0;

    this.snapshotTimer -= dtReal;
    if (this.snapshotTimer <= 0) {
      this.snapshotTimer = 0.05;
      this.notify();
    }
  }

  /** 渲染插值系数 0..1 */
  get alpha(): number {
    return clamp(this.accumulator / FIXED_DT, 0, 1);
  }

  private fixedUpdate(dt: number): void {
    this.time += dt;
    this.combatCtx.time = this.time;
    this.combatCtx.localActorId = this.localActorId;
    this.aiCtx.time = this.time;
    this.aiCtx.live = this.phase === 'live';

    if (this.messageTimer > 0) {
      this.messageTimer -= dt;
      if (this.messageTimer <= 0) this.message = '';
    }

    // ---- 阶段推进 ----
    this.phaseTimer -= dt;
    if (this.phase === 'freeze' && this.phaseTimer <= 0) {
      this.phase = 'live';
      this.phaseTimer = ROUND_TIME;
      this.buyOpen = false;
      this.emit({ type: 'round', kind: 'live', round: this.roundNumber });
      this.notify();
    } else if (this.phase === 'over' && this.phaseTimer <= 0) {
      if (this.scoreT >= MAX_ROUNDS || this.scoreCT >= MAX_ROUNDS) {
        this.phase = 'warmup';
        this.setMessage('比赛结束', 999);
      } else {
        this.startRound();
      }
      return;
    }

    const live = this.phase === 'live';

    // ---- AI ----
    for (const a of this.actors) {
      if (a.alive && a.bot && a.ai) updateBot(this.aiCtx, a, dt);
    }

    // ---- 移动 ----
    for (const a of this.actors) {
      a.prevPos.x = a.pos.x;
      a.prevPos.y = a.pos.y;
      a.prevPos.z = a.pos.z;
      a.prevYaw = a.yaw;
      if (!a.alive) {
        a.deathTime += dt;
        continue;
      }
      if (a.flinch > 0) a.flinch = Math.max(0, a.flinch - dt * 2.2);

      // 冻结阶段不能动
      if (!live) {
        a.intent.forward = 0;
        a.intent.strafe = 0;
        a.intent.jump = false;
        a.intent.fire = false;
        a.intent.firePressed = false;
      }

      const def = activeWeaponDef(a);
      let maxSpeed = def.moveSpeed;
      if (a.scoped && def.scope) maxSpeed = def.scope.moveSpeed;
      if (a.intent.walk) maxSpeed *= 0.52;
      if (a.crouching) maxSpeed *= 0.46;
      if (a.busy) maxSpeed = 0;

      const res = moveActor(this.map.world, a, dt, maxSpeed, this.bounds);
      if (res.landed) {
        this.emit({
          type: 'land',
          actorId: a.id,
          x: a.pos.x,
          y: a.pos.y,
          z: a.pos.z,
          hard: res.landSpeed > 9,
        });
        if (res.landSpeed > 11) {
          const dmg = Math.round((res.landSpeed - 11) * 9);
          if (dmg > 0) this.damageActor(a, dmg, null);
        }
      }

      // 脚步
      if (a.grounded && a.speed > 1.6 && !a.intent.walk) {
        a.footstepAccum += a.speed * dt;
        if (a.footstepAccum > 2.15) {
          a.footstepAccum = 0;
          const surface = this.map.world.supportSurface(a.pos.x, a.pos.z, a.pos.y, 0.35);
          this.emit({
            type: 'footstep',
            actorId: a.id,
            x: a.pos.x,
            y: a.pos.y,
            z: a.pos.z,
            surface,
          });
          // 脚步声会惊动附近的敌人
          this.alertNearby(a, 17, true);
        }
      } else if (!a.grounded || a.speed < 0.5) {
        a.footstepAccum = Math.min(a.footstepAccum, 1.2);
      }

      a.animPhase += a.speed * dt * 1.65;
    }

    separateActors(this.actors, this.map.world, dt);

    // ---- 武器 ----
    for (const a of this.actors) {
      if (!a.alive) continue;
      if (a.intent.switchTo) {
        if (switchSlot(a, a.intent.switchTo)) {
          const w = a.inventory[a.activeSlot];
          if (w) this.emit({ type: 'switch', actorId: a.id, weapon: w.id });
        }
        a.intent.switchTo = null;
      }
      updateWeapon(this.combatCtx, a, dt);
      a.intent.firePressed = false;
    }

    // ---- 炸弹 ----
    if (live || this.phase === 'over') this.updateBomb(dt);

    // ---- 敌人可见性（给小地图用，8Hz 足够）----
    this.visTimer -= dt;
    if (this.visTimer <= 0) {
      this.visTimer = 0.125;
      this.updateVisibility();
    }

    this.checkRoundEnd();
  }

  /* ------------------------------------------------------------------ */
  /* 炸弹                                                                */
  /* ------------------------------------------------------------------ */

  private updateBomb(dt: number): void {
    const b = this.bomb;

    if (b.phase === 'carried') {
      const carrier = this.actorById(b.carrierId);
      if (carrier && carrier.alive) {
        b.pos.x = carrier.pos.x;
        b.pos.y = carrier.pos.y;
        b.pos.z = carrier.pos.z;

        const site = siteAt(carrier.pos.x, carrier.pos.z);
        const wantPlant =
          carrier.intent.use && site !== null && carrier.grounded && this.phase === 'live';
        if (wantPlant) {
          // 玩家不需要手动切 C4，按住 E 自动切
          if (carrier.activeSlot !== 'bomb' && carrier.inventory.bomb) {
            switchSlot(carrier, 'bomb');
          }
          if (carrier.speed < 1.2) {
            if (b.plantProgress === 0) {
              this.emit({ type: 'bomb', kind: 'plantStart', x: b.pos.x, y: b.pos.y, z: b.pos.z });
            }
            carrier.busy = true;
            b.plantProgress += dt;
            carrier.plantProgress = b.plantProgress / PLANT_TIME;
            if (b.plantProgress >= PLANT_TIME) {
              this.plantBomb(carrier, site!.id);
            }
          }
        } else if (b.plantProgress > 0) {
          b.plantProgress = 0;
          carrier.plantProgress = 0;
          carrier.busy = false;
          this.emit({ type: 'bomb', kind: 'plantAbort', x: b.pos.x, y: b.pos.y, z: b.pos.z });
        }
      }
      return;
    }

    if (b.phase === 'dropped') {
      // 被 T 捡起
      for (const a of this.actors) {
        if (!a.alive || a.team !== 'T') continue;
        if (vdist2DSq(a.pos, b.pos) < BOMB_PICKUP_RADIUS * BOMB_PICKUP_RADIUS &&
            Math.abs(a.pos.y - b.pos.y) < 2.5) {
          this.giveBombTo(a);
          this.emit({ type: 'bomb', kind: 'pickup', x: b.pos.x, y: b.pos.y, z: b.pos.z });
          if (a.id === this.localActorId) this.setMessage('你捡起了 C4', 2);
          break;
        }
      }
      return;
    }

    if (b.phase === 'planted') {
      b.timer -= dt;
      b.beepAccum += dt;
      if (b.beepAccum >= beepInterval(b.timer)) {
        b.beepAccum = 0;
        this.emit({ type: 'bomb', kind: 'beep', x: b.pos.x, y: b.pos.y, z: b.pos.z });
      }

      // 拆包
      let defuser: Actor | null = null;
      for (const a of this.actors) {
        if (!a.alive || a.team !== 'CT' || !a.intent.use) continue;
        if (
          vdist2DSq(a.pos, b.pos) < BOMB_DEFUSE_RADIUS * BOMB_DEFUSE_RADIUS &&
          Math.abs(a.pos.y - b.pos.y) < 2.2 &&
          a.grounded &&
          a.speed < 1.2
        ) {
          defuser = a;
          break;
        }
      }
      if (defuser) {
        if (b.defuseProgress === 0) {
          this.emit({ type: 'bomb', kind: 'defuseStart', x: b.pos.x, y: b.pos.y, z: b.pos.z });
        }
        b.defuserId = defuser.id;
        defuser.busy = true;
        b.defuseProgress += dt;
        defuser.defuseProgress = b.defuseProgress / DEFUSE_TIME;
        if (b.defuseProgress >= DEFUSE_TIME) {
          b.phase = 'defused';
          defuser.busy = false;
          defuser.defuseProgress = 0;
          defuser.money = Math.min(16000, defuser.money + 300);
          this.emit({ type: 'bomb', kind: 'defused', x: b.pos.x, y: b.pos.y, z: b.pos.z });
        }
      } else if (b.defuseProgress > 0) {
        const prev = this.actorById(b.defuserId);
        if (prev) {
          prev.busy = false;
          prev.defuseProgress = 0;
        }
        b.defuseProgress = 0;
        b.defuserId = -1;
        this.emit({ type: 'bomb', kind: 'defuseAbort', x: b.pos.x, y: b.pos.y, z: b.pos.z });
      }

      if (b.timer <= 0) {
        this.explodeBomb();
      }
    }
  }

  private plantBomb(carrier: Actor, site: 'A' | 'B'): void {
    const b = this.bomb;
    b.phase = 'planted';
    b.site = site;
    b.timer = BOMB_TIMER;
    b.planterId = carrier.id;
    b.plantProgress = 0;
    b.pos.x = carrier.pos.x;
    b.pos.y = carrier.pos.y;
    b.pos.z = carrier.pos.z;
    carrier.hasBomb = false;
    carrier.busy = false;
    carrier.plantProgress = 0;
    delete carrier.inventory.bomb;
    switchSlot(carrier, bestSlot(carrier));
    carrier.money = Math.min(16000, carrier.money + 300);
    this.emit({ type: 'bomb', kind: 'planted', x: b.pos.x, y: b.pos.y, z: b.pos.z });
    this.setMessage(`炸弹已安放在 ${site} 点`, 3);
    // 全场都听得见
    for (const a of this.actors) {
      if (a.bot && a.ai) alertBot(a, b.pos.x, b.pos.y, b.pos.z, this.time);
    }
    this.notify();
  }

  private explodeBomb(): void {
    const b = this.bomb;
    b.phase = 'exploded';
    this.emit({ type: 'bomb', kind: 'exploded', x: b.pos.x, y: b.pos.y, z: b.pos.z });
    for (const a of this.actors) {
      if (!a.alive) continue;
      const d = vdist2D(a.pos, b.pos);
      if (d < BOMB_DAMAGE_RADIUS) {
        const dmg = Math.round(500 * (1 - d / BOMB_DAMAGE_RADIUS) ** 1.5);
        this.damageActor(a, Math.max(1, dmg), null);
      }
    }
  }

  /** 非武器伤害（爆炸 / 摔落）。 */
  private damageActor(a: Actor, dmg: number, attacker: Actor | null): void {
    a.health -= dmg;
    a.flinch = 1;
    if (a.health <= 0) {
      a.health = 0;
      this.emit({
        type: 'kill',
        attackerId: attacker ? attacker.id : -1,
        victimId: a.id,
        weapon: 'c4',
        headshot: false,
      });
      this.handleKill(a, attacker, 'c4', false);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 死亡 / 击杀                                                         */
  /* ------------------------------------------------------------------ */

  private handleKill(
    victim: Actor,
    attacker: Actor | null,
    weapon: WeaponId,
    headshot: boolean,
  ): void {
    victim.alive = false;
    victim.deaths++;
    victim.deathTime = 0;
    victim.deathYaw = victim.yaw;
    victim.busy = false;
    victim.plantProgress = 0;
    victim.defuseProgress = 0;
    victim.vel.x = 0;
    victim.vel.z = 0;

    if (attacker && attacker !== victim && attacker.team !== victim.team) {
      attacker.kills++;
      attacker.money = Math.min(16000, attacker.money + WEAPONS[weapon].killAward);
    }

    this.killfeed.unshift({
      id: this.killfeedSeq++,
      attacker: attacker ? attacker.name : '世界',
      attackerTeam: attacker ? attacker.team : null,
      victim: victim.name,
      victimTeam: victim.team,
      weapon,
      headshot,
      time: this.time,
    });
    if (this.killfeed.length > 6) this.killfeed.length = 6;

    // 掉包
    if (victim.hasBomb) {
      victim.hasBomb = false;
      delete victim.inventory.bomb;
      this.bomb.phase = 'dropped';
      this.bomb.carrierId = -1;
      this.bomb.pos.x = victim.pos.x;
      this.bomb.pos.y = victim.pos.y;
      this.bomb.pos.z = victim.pos.z;
      this.emit({
        type: 'bomb',
        kind: 'dropped',
        x: victim.pos.x,
        y: victim.pos.y,
        z: victim.pos.z,
      });
    }

    // 队友会警觉；防守方还会往出事的点换防
    this.alertNearby(victim, 30, false);
    rotateDefenders(this.actors, victim.team, victim.pos.x, victim.pos.z, this.time);
    if (attacker) {
      rotateDefenders(this.actors, attacker.team, attacker.pos.x, attacker.pos.z, this.time);
    }

    // 玩家死了 -> 自动进入观战
    if (victim.id === this.localActorId) {
      this.setMessage('你阵亡了 — 空格切换队友视角，F 接管该队友', 5);
    }
    this.notify();
  }

  /** 通知附近的 bot 有动静。 */
  private alertNearby(source: Actor, radius: number, enemiesOnly: boolean): void {
    const r2 = radius * radius;
    for (const a of this.actors) {
      if (!a.alive || !a.bot || !a.ai || a === source) continue;
      if (enemiesOnly && a.team === source.team) continue;
      if (vdist2DSq(a.pos, source.pos) > r2) continue;
      alertBot(a, source.pos.x, source.pos.y, source.pos.z, this.time);
    }
  }

  private updateVisibility(): void {
    const myTeam = this.localActor?.team ?? this.playerTeam;
    for (let i = 0; i < this.actors.length; i++) {
      const e = this.actors[i];
      if (!e.alive || e.team === myTeam) {
        this.enemyVisible[i] = 0;
        continue;
      }
      let seen = 0;
      for (const mate of this.actors) {
        if (!mate.alive || mate.team !== myTeam) continue;
        if (vdist2DSq(mate.pos, e.pos) > 120 * 120) continue;
        if (canSee(this.map.world, mate, e)) {
          seen = 1;
          break;
        }
      }
      this.enemyVisible[i] = seen;
    }
  }

  /* ------------------------------------------------------------------ */
  /* 玩家操作接口                                                        */
  /* ------------------------------------------------------------------ */

  /** 观战下一个存活队友。 */
  spectateNext(dir = 1): void {
    const me = this.localActor;
    const team = me?.team ?? this.playerTeam;
    const mates = this.actors.filter((a) => a.team === team && a.alive);
    if (!mates.length) return;
    const curIdx = mates.findIndex((a) => a.id === this.spectateId);
    const next = mates[(curIdx + dir + mates.length * 2) % mates.length];
    this.spectateId = next.id;
    this.notify();
  }

  /** 当前观战对象（活着时就是自己）。 */
  spectateId = -1;

  get viewActor(): Actor | null {
    const me = this.localActor;
    if (me && me.alive) return me;
    if (this.spectateId >= 0) {
      const s = this.actorById(this.spectateId);
      if (s && s.alive) return s;
    }
    const team = me?.team ?? this.playerTeam;
    const mate = this.actors.find((a) => a.team === team && a.alive);
    if (mate) this.spectateId = mate.id;
    return mate ?? null;
  }

  /** 接管当前观战的队友（把 bot 变成玩家操控）。 */
  takeControl(): boolean {
    const me = this.localActor;
    if (me && me.alive) return false;
    const target = this.viewActor;
    if (!target || !target.alive) return false;
    // 原来的角色（尸体）交还给 AI，新角色交给玩家
    if (me) me.bot = true;
    target.bot = false;
    target.intent.forward = 0;
    target.intent.strafe = 0;
    this.localActorId = target.id;
    this.combatCtx.localActorId = target.id;
    this.setMessage(`已接管 ${target.name}`, 2.5);
    this.notify();
    return true;
  }

  /** 购买（只在冻结阶段可用）。 */
  buy(item: WeaponId | 'armor' | 'helmet'): boolean {
    const a = this.localActor;
    if (!a || !a.alive || this.phase !== 'freeze') return false;
    if (item === 'armor' || item === 'helmet') {
      const price = item === 'helmet' ? ARMOR_HELMET_PRICE : ARMOR_PRICE;
      if (a.money < price) return false;
      a.money -= price;
      a.armor = 100;
      if (item === 'helmet') a.helmet = true;
      this.notify();
      return true;
    }
    const def = WEAPONS[item];
    if (a.money < def.price) return false;
    a.money -= def.price;
    giveWeapon(a, item);
    switchSlot(a, def.slot);
    this.notify();
    return true;
  }

  setMessage(text: string, seconds: number): void {
    this.message = text;
    this.messageTimer = seconds;
  }

  /* ------------------------------------------------------------------ */
  /* 事件 / 快照                                                         */
  /* ------------------------------------------------------------------ */

  private emit(e: GameEvent): void {
    this.events.push(e);
    if (this.events.length > 400) this.events.splice(0, this.events.length - 400);
    // 枪声会惊动附近的 bot
    if (e.type === 'shot') {
      const shooter = this.actorById(e.actorId);
      if (shooter) this.alertNearby(shooter, 42, false);
    }
  }

  /** 表现层每帧取走事件。 */
  drainEvents(): GameEvent[] {
    if (this.events.length === 0) return EMPTY_EVENTS;
    const out = this.events;
    this.events = [];
    return out;
  }

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };

  private notify(): void {
    this.snapshotCache = null;
    this.snapshotVersion++;
    for (const l of this.listeners) l();
  }

  getSnapshot = (): HudSnapshot => {
    if (!this.snapshotCache) this.snapshotCache = this.buildSnapshot();
    return this.snapshotCache;
  };

  private buildSnapshot(): HudSnapshot {
    const me = this.localActor;
    const view = this.viewActor;
    const spectating = !me || !me.alive;
    const subject = spectating ? view : me;

    let weapon: HudWeapon | null = null;
    if (subject) {
      const ws = activeWeapon(subject);
      const def = activeWeaponDef(subject);
      weapon = {
        id: def.id,
        name: def.cn,
        slot: def.slot,
        ammo: ws ? ws.ammo : 0,
        reserve: ws ? ws.reserve : 0,
        magSize: def.magSize,
        reloading: subject.reloadTimer > 0,
        reloadPct: subject.reloadTimer > 0 ? 1 - subject.reloadTimer / def.reloadTime : 1,
        scoped: subject.scoped,
      };
    }

    const area = subject ? areaAt(subject.pos.x, subject.pos.z) : null;

    return {
      version: this.snapshotVersion,
      phase: this.phase,
      phaseTimer: Math.max(0, this.phaseTimer),
      roundNumber: this.roundNumber,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      aliveT: this.aliveCount('T'),
      aliveCT: this.aliveCount('CT'),
      playerTeam: me?.team ?? this.playerTeam,
      message: this.message,
      buyOpen: this.buyOpen && this.phase === 'freeze' && !!me?.alive,
      spectating,
      spectateName: spectating && view ? view.name : '',
      location: area?.label ?? '',
      local: subject
        ? {
            id: subject.id,
            name: subject.name,
            team: subject.team,
            alive: subject.alive,
            health: Math.ceil(subject.health),
            armor: Math.ceil(subject.armor),
            helmet: subject.helmet,
            money: subject.money,
            hasBomb: subject.hasBomb,
            plantProgress: subject.plantProgress,
            defuseProgress: subject.defuseProgress,
            kills: subject.kills,
            deaths: subject.deaths,
            weapon,
          }
        : null,
      bomb: {
        phase: this.bomb.phase,
        timer: Math.max(0, this.bomb.timer),
        site: this.bomb.site,
        defusing: this.bomb.defuseProgress > 0,
        defusePct: this.bomb.defuseProgress / DEFUSE_TIME,
      },
      killfeed: this.killfeed.map((k) => ({ ...k })),
      players: this.actors.map((a) => ({
        id: a.id,
        name: a.name,
        team: a.team,
        alive: a.alive,
        health: Math.ceil(a.health),
        kills: a.kills,
        deaths: a.deaths,
        money: a.money,
        isLocal: a.id === this.localActorId,
        hasBomb: a.hasBomb,
      })),
      lastWinner: this.lastWinner,
      lastReason: this.lastReason,
    };
  }
}

const EMPTY_EVENTS: GameEvent[] = [];

export interface HudWeapon {
  id: WeaponId;
  name: string;
  slot: string;
  ammo: number;
  reserve: number;
  magSize: number;
  reloading: boolean;
  reloadPct: number;
  scoped: boolean;
}

export interface HudPlayer {
  id: number;
  name: string;
  team: Team;
  alive: boolean;
  health: number;
  kills: number;
  deaths: number;
  money: number;
  isLocal: boolean;
  hasBomb: boolean;
}

export interface HudSnapshot {
  version: number;
  phase: RoundPhase;
  phaseTimer: number;
  roundNumber: number;
  scoreT: number;
  scoreCT: number;
  aliveT: number;
  aliveCT: number;
  playerTeam: Team;
  message: string;
  buyOpen: boolean;
  spectating: boolean;
  spectateName: string;
  location: string;
  local: {
    id: number;
    name: string;
    team: Team;
    alive: boolean;
    health: number;
    armor: number;
    helmet: boolean;
    money: number;
    hasBomb: boolean;
    plantProgress: number;
    defuseProgress: number;
    kills: number;
    deaths: number;
    weapon: HudWeapon | null;
  } | null;
  bomb: {
    phase: BombState['phase'];
    timer: number;
    site: 'A' | 'B' | null;
    defusing: boolean;
    defusePct: number;
  };
  killfeed: KillfeedEntry[];
  players: HudPlayer[];
  lastWinner: Team | null;
  lastReason: string;
}
