// 游戏引擎核心：纯逻辑，无 DOM 依赖（可在 Node 中无头运行）
import { AI, HITBOX_MULT, Loadout, PHYS, PISTOL_LOADOUT, ROUND, Team, WEAPONS, WeaponDef, WeaponId, WeaponSlot, rifleLoadout } from './config';
import {
  AABB, V3, angleDelta, clamp, dist2D, dist3D, groundHeight, lerp, mulberry32,
  rayAABB, resolveMove, spreadDir, turnToward, v3,
} from './math';
import {
  colliders as mapColliders, doorCollider, doorDef, holdPoints, inSite, losClear, navGrid,
  patrolPoints, plantPoints, spawns, zoneOf,
} from './map';
import type { SoundApi } from './audio';

export type Phase = 'menu' | 'freeze' | 'live' | 'planted' | 'roundEnd' | 'matchEnd';

export interface Hitbox {
  part: 'head' | 'chest' | 'stomach' | 'arms' | 'legs';
  box: AABB;
}

export interface Combatant {
  id: number;
  team: Team;
  name: string;
  isPlayer: boolean;
  alive: boolean;
  pos: V3;
  vel: V3;
  yaw: number;
  pitch: number;
  hp: number;
  armor: number;
  slots: Partial<Record<WeaponSlot, WeaponId | null>>;
  curSlot: WeaponSlot;
  ammo: Partial<Record<WeaponId, { mag: number; reserve: number }>>;
  reloading: boolean;
  reloadT: number;
  drawT: number;
  fireCd: number;
  spread: number;
  recoil: number;
  zoom: number;
  carriesBomb: boolean;
  plantT: number;
  defuseT: number;
  anim: {
    movePhase: number; speed: number; state: 'idle' | 'run' | 'plant' | 'defuse' | 'dead';
    fireFlash: number; crouch: number; deadT: number;
  };
  kills: number;
  deaths: number;
  brain: Brain | null;
  hurtT: number;
  footT: number;
  lastAttackerId: number;
}

interface Brain {
  mode: 'patrol' | 'combat' | 'goto' | 'plant' | 'defuse' | 'hold';
  path: { x: number; z: number; y: number }[];
  pathIdx: number;
  goal: { x: number; z: number } | null;
  repathT: number;
  stuckT: number;
  lastX: number;
  lastZ: number;
  targetId: number | null;
  lastSeen: { x: number; z: number; t: number } | null;
  reactT: number;
  burstN: number;
  burstCd: number;
  strafeDir: number;
  strafeT: number;
  aimYaw: number;
  aimPitch: number;
  aimError: number;
  patrolIdx: number;
  holdPt: { x: number; z: number } | null;
  tickT: number;
  wanderT: number;
  chainIdx: number;
  lastFireT: number;
  lastNodeD: number;
}

export interface EffectEvent {
  type: 'shot' | 'tracer' | 'blood' | 'explosion' | 'footstep' | 'muzzle' | 'door' | 'plantDone' | 'defused' | 'bombBeep' | 'kill' | 'hitmarker' | 'plantTick' | 'defuseTick' | 'reload' | 'scope' | 'switch' | 'pickup' | 'roundStart' | 'roundEnd' | 'hurt';
  x?: number; y?: number; z?: number;
  x2?: number; y2?: number; z2?: number;
  weapon?: WeaponId;
  headshot?: boolean;
  win?: boolean;
  run?: boolean;
  reload?: 'rifle' | 'pistol' | 'awp' | 'none';
  on?: boolean;
}

export interface KillfeedEntry { text: string; t: number; team: Team; headshot: boolean }

export interface HudState {
  phase: Phase;
  hp: number;
  armor: number;
  weaponName: string;
  mag: number;
  reserve: number;
  slots: { key: string; label: string; has: boolean; cur: boolean }[];
  scoreT: number;
  scoreCT: number;
  roundNum: number;
  timer: number;
  timerLabel: string;
  bombCarried: boolean;
  bombDropped: boolean;
  bombPlanted: boolean;
  bombX: number;
  bombZ: number;
  siteHint: string;
  killfeed: KillfeedEntry[];
  spectate: { name: string; index: number; list: { id: number; name: string; alive: boolean; hp: number }[]; takeover: boolean } | null;
  dead: boolean;
  hitmarkerT: number;
  hitHead: boolean;
  hurtFlash: number;
  roundEndText: string;
  matchEnd: { scoreT: number; scoreCT: number; winner: Team } | null;
  interact: { label: string; progress: number } | null;
  minimap: {
    px: number; pz: number; pyaw: number;
    teammates: { x: number; z: number; id: number; hp: number }[];
    enemies: { x: number; z: number }[];
    bomb: { x: number; z: number; carried: boolean; planted: boolean } | null;
    carrierId: number | null;
  };
  spread: number;
  zoom: number;
  kills: number;
  deaths: number;
  playersAlive: { t: number; ct: number };
}

export interface GameOptions {
  team: Team;
  primary: 'rifle' | 'awp';
  headless?: boolean;
}

const SLOT_ORDER: WeaponSlot[] = ['primary', 'secondary', 'melee', 'bomb'];
const SLOT_LABEL: Record<WeaponSlot, string> = { primary: '主武器', secondary: '副武器', melee: '近战', bomb: 'C4' };

export class Game {
  team: Team;
  opts: GameOptions;
  audio: SoundApi | null = null;
  combatants: Combatant[] = [];
  playerIdx = 0;
  colliders: AABB[] = [];
  doorOpen = false;
  phase: Phase = 'menu';
  freezeT = 0;
  roundT = 0;
  bombT = 0;
  endT = 0;
  roundNum = 0;
  scoreT = 0;
  scoreCT = 0;
  bomb = {
    state: 'carried' as 'carried' | 'dropped' | 'planted',
    carrierId: -1,
    x: 0, y: 0, z: 0,
    timer: ROUND.bombTime,
    beepT: 0,
  };
  tSite: 'A' | 'B' = 'A';
  private tPlantPoint: { x: number; z: number } = { x: -40, z: -45 };
  events: EffectEvent[] = [];
  killfeed: KillfeedEntry[] = [];
  spotted: Record<number, { x: number; z: number; t: number }> = {};
  time = 0;
  roundEndText = '';
  winner: Team | null = null;
  specIdx = 0;
  hitmarkerT = 0;
  hitHead = false;
  hurtFlash = 0;
  input = {
    keys: new Set<string>(),
    mx: 0, my: 0,
    lmb: false, rmb: false,
    lmbPressed: false, rmbPressed: false,
    interact: false, interactPressed: false,
    takePressed: false,
    wheel: 0,
  };
  private hudTimer = 0;
  private rng: () => number = Math.random;
  private endReason = '';

  constructor(opts: GameOptions) {
    this.opts = opts;
    this.team = opts.team;
    this.rng = mulberry32((Date.now() ^ 0x9e3779b9) >>> 0);
    this.colliders = [...mapColliders];
    this.createCombatants();
  }

  // ================= 初始化 =================
  private createCombatants(): void {
    const names = ['1', '2', '3', '4', '5'];
    let id = 0;
    for (const team of ['CT', 'T'] as Team[]) {
      for (let i = 0; i < 5; i++) {
        const isPlayer = team === this.team && i === 0;
        this.combatants.push({
          id: id++, team, name: `${team}-${names[i]}`, isPlayer,
          alive: true, pos: v3(0, 0, 0), vel: v3(),
          yaw: 0, pitch: 0, hp: 100, armor: 0,
          slots: {}, curSlot: 'secondary',
          ammo: {}, reloading: false, reloadT: 0, drawT: 0, fireCd: 0,
          spread: 0, recoil: 0, zoom: 0,
          carriesBomb: false, plantT: 0, defuseT: 0,
          anim: { movePhase: 0, speed: 0, state: 'idle', fireFlash: 0, crouch: 0, deadT: 0 },
          kills: 0, deaths: 0, brain: null, hurtT: 0, footT: 0, lastAttackerId: -1,
        });
      }
    }
    for (const c of this.combatants) if (!c.isPlayer) c.brain = this.newBrain();
    this.playerIdx = this.combatants.find((c) => c.isPlayer)!.id;
  }

  private newBrain(): Brain {
    return {
      mode: 'patrol', path: [], pathIdx: 0, goal: null, repathT: 0, stuckT: 0,
      lastX: 0, lastZ: 0, targetId: null, lastSeen: null, reactT: 0, burstN: 0, burstCd: 0,
      strafeDir: 1, strafeT: 0, aimYaw: 0, aimPitch: 0, aimError: 0.04,
      patrolIdx: 0, holdPt: null, tickT: 0, wanderT: 0, chainIdx: 0, lastFireT: -99, lastNodeD: Infinity,
    };
  }

  /** T 方进攻路线链（避免 A* 绕行 CT 侧） */
  private tChain(): { x: number; z: number }[] {
    if (this.tSite === 'A') return [{ x: 60, z: -8 }, { x: 30, z: -52 }, { ...this.tPlantPoint }];
    return [{ x: 36, z: -18 }, { ...this.tPlantPoint }];
  }

  /** 推进路线链：到达当前目标后切换下一个 */
  private advanceChain(c: Combatant, b: Brain): { x: number; z: number } {
    const chain = this.tChain();
    const ref = b.goal ?? { x: chain[Math.min(b.chainIdx, chain.length - 1)].x, z: chain[Math.min(b.chainIdx, chain.length - 1)].z };
    const d = dist2D(c.pos.x, c.pos.z, ref.x, ref.z);
    if (d < 3.5 && b.chainIdx < chain.length - 1) b.chainIdx++;
    return chain[Math.min(b.chainIdx, chain.length - 1)];
  }

  /** CT 方防守路线链 */
  private ctChain(b: Brain): { x: number; z: number }[] {
    const hp = b.holdPt ?? holdPoints.aSite[0];
    if (Math.abs(hp.x - 36) < 20 && hp.z < -25) return [{ x: 8, z: -15 }, { x: 22, z: -30 }, { ...hp }]; // B 点
    if (hp.z < -30) return [{ x: -48, z: -18 }, { ...hp }]; // A 点
    return [{ x: -2, z: -4 }, { ...hp }]; // 中路
  }

  giveWeapon(c: Combatant, slot: WeaponSlot, id: WeaponId | null): void {
    if (id === null) {
      delete c.slots[slot];
      return;
    }
    c.slots[slot] = id;
    const def = WEAPONS[id];
    c.ammo[id] = { mag: def.magSize, reserve: def.reserve };
  }

  curWeapon(c: Combatant): WeaponDef | null {
    const id = c.slots[c.curSlot];
    return id ? WEAPONS[id] : null;
  }

  // ================= 回合 =================
  startMatch(): void {
    this.scoreT = 0;
    this.scoreCT = 0;
    this.roundNum = 0;
    this.winner = null;
    this.phase = 'menu';
    this.startRound();
  }

  startRound(): void {
    this.roundNum++;
    this.phase = 'freeze';
    this.freezeT = ROUND.freezeTime;
    this.roundT = ROUND.liveTime;
    this.bombT = ROUND.bombTime;
    this.roundEndText = '';
    this.endReason = '';
    this.doorOpen = false;
    this.colliders = [...mapColliders, doorCollider];
    this.bomb.state = 'carried';
    this.bomb.carrierId = -1;
    this.tSite = this.rng() < 0.5 ? 'A' : 'B';
    this.tPlantPoint = { ...plantPoints[this.tSite][Math.floor(this.rng() * plantPoints[this.tSite].length)] };
    // 复活与配置
    for (let i = 0; i < this.combatants.length; i++) {
      const c = this.combatants[i];
      const spawn = spawns[c.team][c.team === 'CT' ? (c.id % 5) : (c.id % 5)];
      c.alive = true;
      c.pos = v3(spawn.x, 0, spawn.z);
      c.vel = v3();
      c.hp = 100;
      c.armor = 0;
      c.yaw = c.team === 'T' ? Math.PI / 2 : -Math.PI / 2;
      c.pitch = 0;
      c.reloading = false;
      c.drawT = 0;
      c.fireCd = 0;
      c.spread = 0;
      c.recoil = 0;
      c.zoom = 0;
      c.carriesBomb = false;
      c.plantT = 0;
      c.defuseT = 0;
      c.anim.state = 'idle';
      c.anim.speed = 0;
      c.anim.crouch = 0;
      c.anim.deadT = 0;
      c.slots = {};
      c.ammo = {};
      // 配装
      const loadout = this.loadoutFor(c);
      this.giveWeapon(c, 'primary', loadout.primary);
      this.giveWeapon(c, 'secondary', loadout.secondary);
      this.giveWeapon(c, 'melee', 'knife');
      c.armor = loadout.armor;
      c.curSlot = loadout.primary ? 'primary' : 'secondary';
      if (c.brain) this.resetBrain(c.brain, c);
    }
    // 炸弹给随机 T
    const ts = this.combatants.filter((c) => c.team === 'T');
    const carrier = ts[Math.floor(this.rng() * ts.length)];
    carrier.carriesBomb = true;
    this.bomb.carrierId = carrier.id;
    // T：开局推点（沿路线链，无包者跟随持包者）
    for (const t of ts) {
      if (!t.brain) continue;
      const chain = this.tChain();
      t.brain.chainIdx = 0;
      if (t.carriesBomb) {
        t.brain.mode = 'plant';
        t.brain.goal = { ...chain[0] };
      } else {
        t.brain.mode = 'goto';
        const near = navGrid.randomPointNear(carrier.pos.x, carrier.pos.z, 6, this.rng);
        t.brain.goal = near ?? { x: carrier.pos.x, z: carrier.pos.z };
      }
      this.setPath(t, t.brain, t.brain.goal);
    }
    // CT 防守点分配（沿路线链前往）
    const cts = this.combatants.filter((c) => c.team === 'CT');
    cts.forEach((c, i) => {
      if (c.brain) {
        const pts = i % 2 === 0 ? holdPoints.aSite : holdPoints.bSite;
        c.brain.holdPt = pts[Math.floor(this.rng() * pts.length)];
        if (i === 4) c.brain.holdPt = holdPoints.mid[0];
        c.brain.mode = 'goto';
        const chain = this.ctChain(c.brain);
        c.brain.chainIdx = 0;
        c.brain.goal = { ...chain[0] };
        this.setPath(c, c.brain, c.brain.goal);
      }
    });
    this.events.push({ type: 'roundStart' });
    this.emitHud();
  }

  private loadoutFor(c: Combatant): Loadout {
    if (this.roundNum === 1) return PISTOL_LOADOUT[c.team];
    if (c.isPlayer) {
      const p = this.opts.primary === 'awp' ? 'awp' : (c.team === 'T' ? 'ak47' : 'm4a4');
      return { primary: p, secondary: 'deagle', armor: 100 };
    }
    // bot：一名狙击手（id % 5 == 2）
    const isAwper = c.id % 5 === 2;
    const p = isAwper ? 'awp' : (c.team === 'T' ? 'ak47' : 'm4a4');
    return { primary: p, secondary: isAwper ? 'deagle' : (c.team === 'T' ? 'glock' : 'usp'), armor: 100 };
  }

  private resetBrain(b: Brain, c: Combatant): void {
    b.mode = 'patrol';
    b.path = [];
    b.pathIdx = 0;
    b.goal = null;
    b.targetId = null;
    b.lastSeen = null;
    b.reactT = 0;
    b.burstN = 0;
    b.burstCd = 0;
    b.stuckT = 0;
    b.tickT = this.rng() * AI.tick;
    b.patrolIdx = Math.floor(this.rng() * 4);
    b.aimYaw = c.yaw;
    b.aimPitch = 0;
    b.lastX = c.pos.x;
    b.lastZ = c.pos.z;
    b.chainIdx = 0;
  }

  endRound(winner: Team, reason: string): void {
    if (this.phase === 'roundEnd' || this.phase === 'matchEnd') return;
    this.phase = 'roundEnd';
    this.endT = ROUND.endTime;
    this.winner = winner;
    this.endReason = reason;
    if (winner === 'T') this.scoreT++;
    else this.scoreCT++;
    this.roundEndText = `${winner === 'T' ? 'T方' : 'CT方'}胜利 — ${reason}`;
    this.events.push({ type: 'roundEnd', win: winner === this.team });
    this.emitHud();
  }

  private checkWin(): void {
    const ctAlive = this.combatants.some((c) => c.team === 'CT' && c.alive);
    const tAlive = this.combatants.some((c) => c.team === 'T' && c.alive);
    const planted = this.bomb.state === 'planted';
    if (planted && this.bomb.timer <= 0) {
      this.explodeBomb();
      return;
    }
    if (planted) {
      if (!ctAlive) { this.endRound('T', 'CT全灭且炸弹已安放'); return; }
      if (!tAlive) return; // 继续拆弹/爆炸
    } else {
      if (!ctAlive) { this.endRound('T', 'CT全灭'); return; }
      if (!tAlive) { this.endRound('CT', 'T全灭'); return; }
      if (this.roundT <= 0) { this.endRound('CT', '时间耗尽'); return; }
    }
  }

  // ================= C4 =================
  private explodeBomb(): void {
    const bx = this.bomb.x, by = this.bomb.y, bz = this.bomb.z;
    this.events.push({ type: 'explosion', x: bx, y: by, z: bz });
    for (const c of this.combatants) {
      if (!c.alive) continue;
      const d = dist3D(c.pos, { x: bx, y: c.pos.y, z: bz });
      if (d < ROUND.bombRadius) {
        const dmg = ROUND.bombDamage * Math.max(0, 1 - d / ROUND.bombRadius);
        this.applyDamage(c, dmg, 'chest', null);
      }
    }
    this.bomb.state = 'planted';
    this.bomb.timer = -1;
    this.endRound('T', 'C4 爆炸');
  }

  private updateBombCarrier(): void {
    const carrier = this.combatants[this.bomb.carrierId];
    if (carrier && carrier.alive && carrier.carriesBomb) {
      this.bomb.x = carrier.pos.x;
      this.bomb.y = carrier.pos.y + 1.3;
      this.bomb.z = carrier.pos.z;
    }
  }

  // ================= 物理 =================
  moveEntity(c: Combatant, dt: number, wishX: number, wishZ: number, speed: number, canJump: boolean): void {
    if (this.phase === 'freeze' || !c.alive) {
      c.anim.speed = 0;
      return;
    }
    const accel = 40;
    const tx = wishX * speed, tz = wishZ * speed;
    c.vel.x = lerp(c.vel.x, tx, Math.min(1, accel * dt));
    c.vel.z = lerp(c.vel.z, tz, Math.min(1, accel * dt));
    c.vel.y -= PHYS.gravity * dt;
    // 水平移动
    const prev = { ...c.pos };
    const intended = {
      ...c.pos,
      x: c.pos.x + c.vel.x * dt,
      z: c.pos.z + c.vel.z * dt,
    };
    const next = { ...intended };
    const r = resolveMove(prev, next, PHYS.hw, PHYS.height, this.colliders, { stepMax: PHYS.stepMax });
    if (r.hitWallX || r.hitWallZ) {
      const liftedPrev = { ...prev, y: prev.y + PHYS.stepMax };
      const liftedNext = { ...intended, y: prev.y + PHYS.stepMax };
      const r2 = resolveMove(liftedPrev, liftedNext, PHYS.hw, PHYS.height, this.colliders, { stepMax: PHYS.stepMax });
      const d1 = dist2D(prev.x, prev.z, next.x, next.z);
      const d2 = dist2D(prev.x, prev.z, liftedNext.x, liftedNext.z);
      // 抬升后能站上某个台阶顶：即使水平位移没增加也接受（爬台阶）
      let clearedStep = false;
      for (const b of this.colliders) {
        if (!b.step) continue;
        if (liftedNext.y < b.maxY - 1e-4) continue;
        if (
          liftedNext.x + PHYS.hw > b.minX && liftedNext.x - PHYS.hw < b.maxX &&
          liftedNext.z + PHYS.hw > b.minZ && liftedNext.z - PHYS.hw < b.maxZ
        ) {
          clearedStep = true;
          break;
        }
      }
      if (d2 > d1 + 0.005 || clearedStep) {
        c.pos.x = liftedNext.x;
        c.pos.z = liftedNext.z;
        c.pos.y = liftedNext.y;
      } else {
        c.pos.x = next.x;
        c.pos.z = next.z;
      }
    } else {
      c.pos.x = next.x;
      c.pos.z = next.z;
    }
    // 竖直移动
    const prev2 = { ...c.pos };
    c.pos.y += c.vel.y * dt;
    resolveMove(prev2, c.pos, PHYS.hw, PHYS.height, this.colliders, { stepMax: PHYS.stepMax });
    // 地面吸附（允许一步抬升到台阶顶）
    const gh = groundHeight(c.pos.x, c.pos.z, PHYS.hw, c.pos.y + 0.05, this.colliders, undefined, true);
    if (gh !== -Infinity) {
      c.pos.y = gh;
      c.vel.y = 0;
    }
    const grounded = gh !== -Infinity;
    if (canJump && grounded) c.vel.y = PHYS.jumpVel;
    // 动画
    const speed2D = Math.hypot(c.vel.x, c.vel.z);
    c.anim.speed = speed2D;
    if (speed2D > 0.5 && grounded) {
      c.anim.movePhase += dt * (6 + speed2D * 1.8);
      c.footT -= dt;
      if (c.footT <= 0) {
        c.footT = 0.42 - Math.min(0.15, speed2D * 0.02);
        this.events.push({ type: 'footstep', x: c.pos.x, y: c.pos.y, z: c.pos.z, run: speed2D > 3.4 });
      }
    } else {
      c.anim.movePhase = 0;
    }
  }

  // ================= 命中判定 =================
  hitboxes(c: Combatant): Hitbox[] {
    const crouch = c.anim.state === 'plant' || c.anim.state === 'defuse' ? 0.45 : 0;
    const y0 = c.pos.y - crouch;
    const hw = 0.32;
    const hb = (part: Hitbox['part'], minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): Hitbox => ({
      part,
      box: {
        minX: c.pos.x + minX, maxX: c.pos.x + maxX,
        minY: y0 + minY, maxY: y0 + maxY,
        minZ: c.pos.z + minZ, maxZ: c.pos.z + maxZ,
      },
    });
    return [
      hb('head', -0.14, 0.14, 1.5, 1.8, -0.14, 0.14),
      hb('chest', -0.21, 0.21, 1.22, 1.5, -0.18, 0.18),
      hb('stomach', -0.2, 0.2, 0.92, 1.22, -0.17, 0.17),
      hb('arms', -hw, -0.2, 0.98, 1.5, -0.14, 0.14),
      hb('arms', 0.2, hw, 0.98, 1.5, -0.14, 0.14),
      hb('legs', -0.16, -0.05, 0, 0.92, -0.15, 0.15),
      hb('legs', 0.05, 0.16, 0, 0.92, -0.15, 0.15),
    ];
  }

  private fireBullet(shooter: Combatant, dir: V3, def: WeaponDef): void {
    const eyeY = shooter.pos.y + PHYS.eye;
    const ox = shooter.pos.x, oy = eyeY, oz = shooter.pos.z;
    let dmgMult = 1;
    let traveled = 0;
    let hitPos: V3 | null = null;
    for (let pass = 0; pass < 3; pass++) {
      let bestT = Infinity;
      let bestC: Combatant | null = null;
      let bestPart: Hitbox['part'] = 'chest';
      let bestWall: AABB | null = null;
      for (const c of this.combatants) {
        if (!c.alive || c.id === shooter.id) continue;
        for (const hb of this.hitboxes(c)) {
          const t = rayAABB(ox, oy, oz, dir.x, dir.y, dir.z, hb.box);
          if (t >= 0 && t + traveled < bestT) {
            bestT = t + traveled;
            bestC = c;
            bestPart = hb.part;
            bestWall = null;
          }
        }
      }
      for (const b of this.colliders) {
        const t = rayAABB(ox, oy, oz, dir.x, dir.y, dir.z, b);
        if (t >= 0 && t + traveled < bestT) {
          bestT = t + traveled;
          bestC = null;
          bestWall = b;
        }
      }
      if (bestC) {
        const tLocal = bestT - traveled;
        hitPos = { x: ox + dir.x * tLocal, y: oy + dir.y * tLocal, z: oz + dir.z * tLocal };
        const dmg = def.damage * HITBOX_MULT[bestPart] * dmgMult;
        this.applyDamage(bestC, dmg, bestPart, shooter, def);
        this.events.push({ type: 'blood', x: hitPos.x, y: hitPos.y, z: hitPos.z });
        return;
      }
      if (bestWall) {
        const tLocal = bestT - traveled;
        hitPos = { x: ox + dir.x * tLocal, y: oy + dir.y * tLocal, z: oz + dir.z * tLocal };
        if (bestWall.penetrable) {
          dmgMult *= 0.55;
          traveled = bestT + 0.05;
          continue;
        }
        return;
      }
      return;
    }
  }

  applyDamage(target: Combatant, rawDmg: number, part: Hitbox['part'], attacker: Combatant | null, def?: WeaponDef): void {
    if (!target.alive || this.phase === 'roundEnd') return;
    const absorbRatio = def ? def.armorAbsorb : 0.5;
    let dmg = rawDmg;
    if (target.armor > 0 && part !== 'head') {
      const absorbed = Math.min(target.armor, dmg * absorbRatio);
      target.armor -= absorbed;
      dmg -= absorbed;
    } else if (target.armor > 0 && part === 'head') {
      // 头盔减伤（护甲值仍在时头部也有一定减免）
      const absorbed = Math.min(target.armor, dmg * absorbRatio * 0.6);
      target.armor -= absorbed;
      dmg -= absorbed;
    }
    dmg = Math.round(dmg);
    target.hp -= dmg;
    target.hurtT = 0.35;
    target.lastAttackerId = attacker ? attacker.id : -1;
    if (attacker && attacker.isPlayer) {
      this.hitmarkerT = 0.18;
      this.hitHead = part === 'head';
      this.events.push({ type: 'hitmarker', headshot: part === 'head' });
    }
    if (attacker && target.isPlayer) {
      this.hurtFlash = 0.4;
      this.events.push({ type: 'hurt' });
    }
    if (target.hp <= 0) this.kill(target, attacker, part);
  }

  private kill(target: Combatant, attacker: Combatant | null, part: Hitbox['part']): void {
    if (!target.alive) return;
    target.alive = false;
    target.deaths++;
    target.anim.state = 'dead';
    target.anim.deadT = 0;
    target.reloading = false;
    target.plantT = 0;
    target.defuseT = 0;
    if (attacker) attacker.kills++;
    const wName = attacker && this.curWeapon(attacker) ? this.curWeapon(attacker)!.name : 'C4';
    const attackerName = attacker ? (attacker.isPlayer ? '你' : attacker.name) : 'C4';
    const head = part === 'head';
    const text = `${attackerName} [${wName}]${head ? ' 爆头' : ''} ${target.isPlayer ? '你' : target.name}`;
    this.killfeed.unshift({ text, t: this.time, team: target.team, headshot: head });
    if (this.killfeed.length > 6) this.killfeed.pop();
    if (attacker && attacker.isPlayer) this.events.push({ type: 'kill' });
    // 掉包
    if (target.carriesBomb) {
      target.carriesBomb = false;
      this.bomb.state = 'dropped';
      this.bomb.x = target.pos.x;
      this.bomb.y = target.pos.y;
      this.bomb.z = target.pos.z;
      this.bomb.carrierId = -1;
    }
    if (target.isPlayer) {
      // 切到存活队友观战
      this.specIdx = -1;
      this.cycleSpectate();
    }
    this.checkWin();
    this.emitHud();
  }

  // ================= 玩家输入处理 =================
  private updatePlayer(dt: number): void {
    const c = this.combatants[this.playerIdx];
    if (!c || !c.alive) return;
    const k = this.input.keys;
    let wx = 0, wz = 0;
    if (k.has('KeyW')) wz -= 1;
    if (k.has('KeyS')) wz += 1;
    if (k.has('KeyA')) wx -= 1;
    if (k.has('KeyD')) wx += 1;
    const len = Math.hypot(wx, wz);
    if (len > 0) { wx /= len; wz /= len; }
    const sy = Math.sin(c.yaw), cy = Math.cos(c.yaw);
    const worldX = wx * cy - wz * sy;
    const worldZ = -(wx * sy + wz * cy);
    const walk = k.has('ShiftLeft') || k.has('ShiftRight');
    const speed = walk ? PHYS.playerWalk : PHYS.playerRun;
    this.moveEntity(c, dt, worldX, worldZ, speed, k.has('Space'));

    // 视角
    c.yaw -= this.input.mx * 0.0021;
    c.pitch += this.input.my * 0.0021;
    c.pitch = clamp(c.pitch, -1.53, 1.53);
    this.input.mx = 0;
    this.input.my = 0;

    // 武器系统
    const w = this.curWeapon(c);
    if (w) {
      const movePen = w.slot === 'melee' ? 0 : (Math.hypot(c.vel.x, c.vel.z) > 3.4 ? w.spreadMove : Math.hypot(c.vel.x, c.vel.z) > 0.4 ? w.spreadMove * 0.4 : 0);
      c.spread = Math.max(w.spreadBase + movePen, c.spread - dt * 0.22);
      c.recoil = Math.max(0, c.recoil - dt * 16);
    }
    // 开镜（AWP）
    if (this.input.rmbPressed && w && w.id === 'awp' && c.drawT <= 0) {
      c.zoom = (c.zoom + 1) % 3;
      this.events.push({ type: 'scope', on: c.zoom > 0 });
    }
    // 换弹
    if (k.has('KeyR')) this.startReload(c);
    // 切枪
    if (this.input.keys.has('Digit1')) this.switchSlot(c, 'primary');
    if (this.input.keys.has('Digit2')) this.switchSlot(c, 'secondary');
    if (this.input.keys.has('Digit3')) this.switchSlot(c, 'melee');
    if (this.input.keys.has('Digit4') && c.carriesBomb) this.switchSlot(c, 'bomb');
    if (this.input.wheel !== 0) {
      const order = SLOT_ORDER.filter((s) => s !== 'bomb' || c.carriesBomb);
      const idx = order.indexOf(c.curSlot);
      const next = order[(idx + (this.input.wheel > 0 ? 1 : order.length - 1)) % order.length];
      this.switchSlot(c, next);
      this.input.wheel = 0;
    }
    // 开火
    const wantFire = this.input.lmb && w && w.slot !== 'bomb';
    if (wantFire) {
      if (w.auto || this.input.lmbPressed) this.tryFire(c, true);
    } else if (w && c.curSlot === 'bomb' && this.input.lmb && c.carriesBomb) {
      // 下包
      if (this.canPlant(c)) {
        c.anim.state = 'plant';
        c.plantT += dt;
        if (c.plantT >= ROUND.plantTime) this.plantBomb(c);
      }
    } else if (!wantFire && c.curSlot === 'bomb') {
      c.plantT = 0;
      if (c.anim.state === 'plant') c.anim.state = 'idle';
    }
    // 拆包
    if (this.input.interact && this.bomb.state === 'planted' && c.team === 'CT' && dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z) < 1.3) {
      c.anim.state = 'defuse';
      c.defuseT += dt;
      if (c.defuseT >= ROUND.defuseTime) this.defuseBomb(c);
    } else if (c.anim.state === 'defuse') {
      c.anim.state = 'idle';
      c.defuseT = 0;
    }
    // 捡包
    if (c.team === 'T' && !c.carriesBomb && this.bomb.state === 'dropped' && dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z) < 1.0) {
      this.pickupBomb(c);
    }
    this.input.lmbPressed = false;
    this.input.rmbPressed = false;
    this.input.takePressed = false;
    this.input.interactPressed = false;
    this.input.wheel = 0;
  }

  private canPlant(c: Combatant): boolean {
    return c.team === 'T' && c.carriesBomb && (inSite(c.pos.x, c.pos.z, 'A') || inSite(c.pos.x, c.pos.z, 'B'));
  }

  private plantBomb(c: Combatant): void {
    c.carriesBomb = false;
    c.curSlot = c.slots.primary ? 'primary' : 'secondary';
    this.bomb.state = 'planted';
    this.bomb.x = c.pos.x;
    this.bomb.y = c.pos.y;
    this.bomb.z = c.pos.z;
    this.bomb.timer = ROUND.bombTime;
    this.bomb.beepT = 0;
    this.phase = 'planted';
    c.anim.state = 'idle';
    this.events.push({ type: 'plantDone', x: this.bomb.x, y: this.bomb.y, z: this.bomb.z });
    this.emitHud();
  }

  private defuseBomb(c: Combatant): void {
    this.bomb.state = 'dropped';
    c.anim.state = 'idle';
    c.defuseT = 0;
    this.events.push({ type: 'defused' });
    this.endRound('CT', '成功拆弹');
  }

  private pickupBomb(c: Combatant): void {
    c.carriesBomb = true;
    this.bomb.state = 'carried';
    this.bomb.carrierId = c.id;
    this.events.push({ type: 'pickup' });
    // 中途捡包：直接去包点，不再走开局路线链
    if (c.brain) {
      const chain = this.tChain();
      c.brain.chainIdx = chain.length - 1;
      c.brain.mode = 'plant';
      c.brain.goal = { ...chain[chain.length - 1] };
      this.setPath(c, c.brain, c.brain.goal);
    }
    this.emitHud();
  }

  // ================= 武器 =================
  switchSlot(c: Combatant, slot: WeaponSlot): void {
    if (c.curSlot === slot) return;
    if (!c.slots[slot]) return;
    if (c.reloading && c.curSlot === 'primary') c.reloading = false;
    c.curSlot = slot;
    const w = this.curWeapon(c);
    c.drawT = w ? w.drawTime : 0.3;
    c.plantT = 0;
    c.zoom = 0;
    this.events.push({ type: 'switch' });
  }

  startReload(c: Combatant): void {
    const w = this.curWeapon(c);
    if (!w || w.id === 'knife' || c.reloading || c.drawT > 0) return;
    const am = c.ammo[w.id];
    if (!am || am.mag >= w.magSize || am.reserve <= 0) return;
    c.reloading = true;
    c.reloadT = w.reloadTime;
    c.zoom = 0;
    this.events.push({ type: 'reload', reload: w.reloadSound });
  }

  tryFire(c: Combatant, isPlayer: boolean): void {
    const w = this.curWeapon(c);
    if (!w || c.reloading || c.drawT > 0 || c.fireCd > 0) return;
    if (w.id === 'knife') {
      this.knifeSwing(c);
      return;
    }
    const am = c.ammo[w.id];
    if (!am || am.mag <= 0) {
      this.startReload(c);
      return;
    }
    c.fireCd = 60 / w.rpm;
    am.mag--;
    const moveSpeed = Math.hypot(c.vel.x, c.vel.z);
    const movePen = moveSpeed > 3.4 ? w.spreadMove : moveSpeed > 0.4 ? w.spreadMove * 0.35 : 0;
    c.spread = Math.min(w.spreadMax, c.spread + w.spreadPerShot + movePen);
    c.recoil = Math.min(w.recoilMax, c.recoil + w.recoilKick * (0.6 + this.rng() * 0.4));
    // 视角上仰
    c.pitch += w.recoilKick * 0.016 * (0.75 + this.rng() * 0.5);
    // 弹道
    const scoped = w.id === 'awp' && c.zoom > 0;
    const sp = scoped && w.spreadScoped !== undefined ? w.spreadScoped : c.spread;
    const base = this.aimDir(c);
    const dir = spreadDir(base.x, base.y, base.z, sp, this.rng);
    this.fireBullet(c, dir, w);
    c.anim.fireFlash = 0.06;
    const m = this.muzzlePos(c);
    this.events.push({ type: 'shot', x: m.x, y: m.y, z: m.z, weapon: w.id });
    if (w.id === 'awp' && c.zoom > 0) {
      // 开镜大后座
      c.pitch += 0.02;
    }
    this.emitHud();
  }

  private knifeSwing(c: Combatant): void {
    c.fireCd = 0.55;
    const dir = this.aimDir(c);
    for (const t of this.combatants) {
      if (!t.alive || t.id === c.id) continue;
      const dx = t.pos.x - c.pos.x, dz = t.pos.z - c.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 1.9) {
        const ang = Math.acos(clamp((dx * dir.x + dz * dir.z) / (d || 1), -1, 1));
        if (ang < 0.9) {
          this.applyDamage(t, 40, 'chest', c);
          c.anim.fireFlash = 0.1;
          return;
        }
      }
    }
    this.events.push({ type: 'shot', x: c.pos.x, y: c.pos.y + 1.4, z: c.pos.z, weapon: 'knife' });
  }

  aimDir(c: Combatant): V3 {
    return {
      x: -Math.sin(c.yaw) * Math.cos(c.pitch),
      y: Math.sin(c.pitch),
      z: -Math.cos(c.yaw) * Math.cos(c.pitch),
    };
  }

  muzzlePos(c: Combatant): V3 {
    const dir = this.aimDir(c);
    const eye = c.pos.y + PHYS.eye;
    return { x: c.pos.x + dir.x * 0.8, y: eye + dir.y * 0.8, z: c.pos.z + dir.z * 0.8 };
  }

  // ================= AI =================
  private canSee(a: Combatant, b: Combatant): boolean {
    if (!b.alive) return false;
    const d = dist2D(a.pos.x, a.pos.z, b.pos.x, b.pos.z);
    if (d > AI.viewDist) return false;
    // 视锥
    const dir = { x: b.pos.x - a.pos.x, z: b.pos.z - a.pos.z };
    const ang = Math.abs(angleDelta(Math.atan2(-dir.x, -dir.z), a.yaw));
    if (ang > AI.fov / 2 && d > 6) return false;
    const eyeA = a.pos.y + PHYS.eye;
    return (
      losClear(a.pos.x, eyeA, a.pos.z, b.pos.x, b.pos.y + PHYS.eye, b.pos.z) ||
      losClear(a.pos.x, eyeA, a.pos.z, b.pos.x, b.pos.y + 1.2, b.pos.z)
    );
  }

  private aiTickBrain(c: Combatant, b: Brain, dt: number): void {
    // 感知
    let target: Combatant | null = null;
    let bestD = Infinity;
    for (const e of this.combatants) {
      if (e.team === c.team || !e.alive) continue;
      if (this.canSee(c, e)) {
        const d = dist2D(c.pos.x, c.pos.z, e.pos.x, e.pos.z);
        if (d < bestD) { bestD = d; target = e; }
        this.spotted[e.id] = { x: e.pos.x, z: e.pos.z, t: this.time };
      }
    }
    if (target) {
      b.targetId = target.id;
      b.lastSeen = { x: target.pos.x, z: target.pos.z, t: this.time };
      if (b.mode !== 'combat') {
        b.mode = 'combat';
        b.reactT = AI.reactionMin + this.rng() * (AI.reactionMax - AI.reactionMin);
        b.burstN = 0;
      }
    } else if (b.mode === 'combat' && b.lastSeen && this.time - b.lastSeen.t > 2.5) {
      // 追击最后目击点（持包 T 直接回归下包任务，不追远）
      if (c.team === 'T' && c.carriesBomb && this.bomb.state !== 'planted') {
        b.mode = 'plant';
        b.goal = { ...this.advanceChain(c, b) };
        this.setPath(c, b, b.goal);
      } else {
        b.mode = 'goto';
        b.goal = { x: b.lastSeen.x, z: b.lastSeen.z };
        this.setPath(c, b, b.goal);
      }
    }
    // 目标更新
    if (b.targetId !== null && b.mode === 'combat') {
      const t = this.combatants[b.targetId];
      if (t && t.alive && this.canSee(c, t)) {
        b.lastSeen = { x: t.pos.x, z: t.pos.z, t: this.time };
      } else {
        b.targetId = null;
      }
    }
    // 炸弹事件感知
    if (c.team === 'CT' && this.bomb.state === 'planted' && b.mode !== 'defuse') {
      b.mode = 'goto';
      b.goal = { x: this.bomb.x, z: this.bomb.z };
      this.setPath(c, b, b.goal);
    }
    if (c.team === 'T' && this.bomb.state === 'planted' && b.mode !== 'hold' && b.mode !== 'combat') {
      b.mode = 'hold';
      b.goal = null;
    }
    if (c.team === 'T' && this.bomb.state === 'dropped' && !c.carriesBomb && b.mode !== 'combat') {
      const carrier = this.combatants.find((x) => x.carriesBomb);
      if (!carrier) {
        b.mode = 'goto';
        b.goal = { x: this.bomb.x, z: this.bomb.z };
        this.setPath(c, b, b.goal);
      }
    }
    // 持包 T 始终回归下包任务
    if (c.team === 'T' && c.carriesBomb && this.bomb.state !== 'planted' && b.mode !== 'plant' && b.mode !== 'combat') {
      b.mode = 'plant';
      b.goal = { ...this.advanceChain(c, b) };
      this.setPath(c, b, b.goal);
    }
    // 无包 T：跟随持包者推进
    if (c.team === 'T' && !c.carriesBomb && this.bomb.state === 'carried' && b.mode === 'patrol') {
      const carrier = this.combatants.find((x) => x.carriesBomb);
      if (carrier) {
        b.mode = 'goto';
        const near = navGrid.randomPointNear(carrier.pos.x, carrier.pos.z, 6, this.rng);
        b.goal = near ?? { x: carrier.pos.x, z: carrier.pos.z };
        this.setPath(c, b, b.goal);
      }
    }
    // CT 沿防守路线链推进
    if (c.team === 'CT' && this.bomb.state !== 'planted' && b.mode === 'patrol' && b.holdPt) {
      const chain = this.ctChain(b);
      const ref = chain[Math.min(b.chainIdx, chain.length - 1)];
      const d = dist2D(c.pos.x, c.pos.z, ref.x, ref.z);
      if (b.chainIdx < chain.length - 1 && d < 4) {
        b.chainIdx++;
        b.mode = 'goto';
        b.goal = { ...chain[b.chainIdx] };
        this.setPath(c, b, b.goal);
      }
    }
  }

  private setPath(c: Combatant, b: Brain, goal: { x: number; z: number }): void {
    const p = navGrid.path(c.pos.x, c.pos.y, c.pos.z, goal.x, goal.z, this.floorNear(goal.x, goal.z));
    if (p && p.length > 0) {
      b.path = p;
      b.pathIdx = 0;
    } else {
      b.path = [];
    }
    b.repathT = AI.repathInterval * (0.6 + this.rng() * 0.8); // 错峰重寻路，避免同帧多查询
    b.stuckT = 0;
    b.lastX = c.pos.x;
    b.lastZ = c.pos.z;
    b.lastNodeD = Infinity;
  }

  private floorNear(x: number, z: number): number | undefined {
    const y = navGrid.floorYAt(x, z);
    return y ?? undefined;
  }

  private aiMoveAlong(c: Combatant, b: Brain, dt: number, speed: number, faceMove: boolean): void {
    let wx = 0, wz = 0;
    if (b.path.length > 0) {
      const node = b.path[b.pathIdx] ?? b.path[b.path.length - 1];
      const dx = node.x - c.pos.x, dz = node.z - c.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.35) {
        if (node.y > c.pos.y + 0.35) {
          // 同格爬升节点：朝下一个节点移动，物理会自动登台阶
          const next2 = b.path[Math.min(b.pathIdx + 1, b.path.length - 1)];
          const dx2 = next2.x - c.pos.x, dz2 = next2.z - c.pos.z;
          const d2 = Math.hypot(dx2, dz2) || 1;
          wx = dx2 / d2;
          wz = dz2 / d2;
        } else if (b.pathIdx < b.path.length - 1) {
          b.pathIdx++;
          b.lastNodeD = Infinity;
        } else {
          b.path = [];
        }
      } else {
        wx = dx / d;
        wz = dz / d;
      }
    }
    this.moveEntity(c, dt, wx, wz, speed, false);
    if (faceMove && (wx !== 0 || wz !== 0)) {
      const targetYaw = Math.atan2(-wx, -wz);
      c.yaw = turnToward(c.yaw, targetYaw, 8 * dt);
    }
    // 卡住检测：朝当前节点推进无进展（滑墙也算）
    b.stuckT += dt;
    if (b.stuckT > 0.7) {
      const cur = b.path[b.pathIdx];
      const dNow = cur ? dist2D(c.pos.x, c.pos.z, cur.x, cur.z) : -1;
      const progress = b.lastNodeD - dNow;
      const moved = dist2D(c.pos.x, c.pos.z, b.lastX, b.lastZ);
      if ((dNow > 0.8 && progress < 0.35 && moved < 2.4) || moved < 0.35) {
        b.path = [];
        const near = navGrid.nearestWalkable(c.pos.x, c.pos.z);
        if (near) {
          // 先走到最近的可行走格（再快速重新寻路，不直接连目标点）
          const first = navGrid.path(c.pos.x, c.pos.y, c.pos.z, near.x, near.z, near.y);
          if (first && b.goal) {
            const rest = navGrid.path(near.x, near.y, near.z, b.goal.x, b.goal.z, this.floorNear(b.goal.x, b.goal.z));
            if (rest) {
              b.path = [...first, ...rest.slice(1)];
              b.pathIdx = 0;
            }
          }
          if (b.path.length === 0) {
            b.path = [{ x: near.x, z: near.z, y: near.y }];
            b.pathIdx = 0;
            b.repathT = 0.5;
          }
        }
        if (b.mode === 'goto' && b.path.length === 0) b.mode = 'patrol';
      }
      b.lastX = c.pos.x;
      b.lastZ = c.pos.z;
      b.lastNodeD = dNow;
      b.stuckT = 0;
    }
  }

  private aiCombat(c: Combatant, b: Brain, dt: number): void {
    const t = b.targetId !== null ? this.combatants[b.targetId] : null;
    if (!t || !t.alive) {
      b.mode = 'patrol';
      return;
    }
    const d = dist2D(c.pos.x, c.pos.z, t.pos.x, t.pos.z);
    // 瞄准
    const targetY = t.pos.y + 1.3;
    const dx = t.pos.x - c.pos.x, dz = t.pos.z - c.pos.z;
    const wantYaw = Math.atan2(-dx, -dz);
    const eyeY = c.pos.y + PHYS.eye;
    const wantPitch = Math.atan2(targetY - eyeY, d || 1);
    if (b.reactT > 0) {
      b.reactT -= dt;
      b.aimError = 0.09;
    } else {
      b.aimError = Math.max(0.016, b.aimError - dt * 0.16);
    }
    c.yaw = turnToward(c.yaw, wantYaw, AI.aimSpeed * dt);
    c.pitch = turnToward(c.pitch, wantPitch, AI.aimSpeed * dt);
    // 与玩家一致：不射击时准星扩散回落
    {
      const w0 = this.curWeapon(c);
      if (w0) c.spread = Math.max(w0.spreadBase, c.spread - dt * 0.22);
    }
    // 走位：左右横移，保持距离
    b.strafeT -= dt;
    if (b.strafeT <= 0) {
      b.strafeT = 0.5 + this.rng() * 0.9;
      b.strafeDir = this.rng() < 0.5 ? -1 : 1;
    }
    // 卡住检测：横移无进展则朝目标推进
    b.stuckT += dt;
    if (b.stuckT > 0.8) {
      const moved = dist2D(c.pos.x, c.pos.z, b.lastX, b.lastZ);
      if (moved < 0.6) b.strafeDir *= -1;
      b.lastX = c.pos.x;
      b.lastZ = c.pos.z;
      b.stuckT = 0;
    }
    let wx = 0, wz = 0;
    const w = this.curWeapon(c);
    const ideal = w && w.id === 'awp' ? 14 : 7;
    const shootingNow = this.time - b.lastFireT < 0.6; // 开火中站定，保证命中
    if (shootingNow) {
      wx = 0;
      wz = 0;
    } else if (d > ideal + 5) { wx = dx / d; wz = dz / d; }
    else if (d < ideal - 3) { wx = -dx / d; wz = -dz / d; }
    else {
      const px = -dz / d, pz = dx / d;
      wx = px * b.strafeDir;
      wz = pz * b.strafeDir;
    }
    this.moveEntity(c, dt, wx, wz, d < 6 ? PHYS.botWalk : PHYS.botRun, false);
    // 开火
    if (b.reactT <= 0) {
      const canSeeNow = this.canSee(c, t);
      if (canSeeNow) {
        const aimOff = Math.abs(angleDelta(c.yaw, wantYaw)) + Math.abs(c.pitch - wantPitch) + b.aimError;
        if (aimOff < 0.085) {
          b.burstCd -= dt;
          if (b.burstCd <= 0) {
            this.tryFire(c, false);
            b.lastFireT = this.time;
            b.burstN++;
            if (w && w.id === 'awp') {
              b.burstCd = 1.4 + this.rng() * 0.6;
            } else if (b.burstN >= 4 + Math.floor(this.rng() * 4)) {
              b.burstN = 0;
              b.burstCd = 0.4 + this.rng() * 0.5;
            } else {
              b.burstCd = 60 / (w ? w.rpm : 400);
            }
          }
        }
      }
    }
    // 换弹
    const am = w ? c.ammo[w.id] : undefined;
    if (w && am && am.mag <= 0) this.startReload(c);
    // 若距离过远且无视野持续，回巡逻
    if (b.lastSeen && this.time - b.lastSeen.t > 3.5) {
      b.mode = 'goto';
      b.goal = { x: b.lastSeen.x, z: b.lastSeen.z };
      this.setPath(c, b, b.goal);
    }
  }

  private aiGoto(c: Combatant, b: Brain, dt: number): void {
    if (!b.goal) { b.mode = 'patrol'; return; }
    const d = dist2D(c.pos.x, c.pos.z, b.goal.x, b.goal.z);
    if (d < 1.6) {
      b.goal = null;
      b.mode = 'patrol';
      return;
    }
    if (b.path.length === 0) {
      if (b.repathT <= 0) this.setPath(c, b, b.goal);
      else b.repathT -= dt;
      return;
    }
    // 到达炸弹点后：T 拾包 / CT 拆包
    if (this.bomb.state === 'planted' && c.team === 'CT' && dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z) < 1.4) {
      b.mode = 'defuse';
      b.goal = null;
      b.path = [];
      return;
    }
    if (this.bomb.state === 'dropped' && c.team === 'T' && dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z) < 1.2) {
      this.pickupBomb(c);
      b.goal = null;
      b.mode = 'goto';
      const site = this.tSite;
      const pp = plantPoints[site][Math.floor(this.rng() * plantPoints[site].length)];
      b.goal = pp;
      this.setPath(c, b, b.goal);
      b.mode = 'plant';
      return;
    }
    this.aiMoveAlong(c, b, dt, PHYS.botRun, true);
  }

  private aiPlant(c: Combatant, b: Brain, dt: number): void {
    if (!c.carriesBomb) {
      b.mode = 'goto';
      const pp = plantPoints[this.tSite][Math.floor(this.rng() * plantPoints[this.tSite].length)];
      b.goal = pp;
      this.setPath(c, b, b.goal);
      return;
    }
    const site = inSite(c.pos.x, c.pos.z, 'A') ? 'A' : inSite(c.pos.x, c.pos.z, 'B') ? 'B' : null;
    if (!site) {
      // 沿路线链推进
      const goal = this.advanceChain(c, b);
      if (!b.goal || (b.goal.x !== goal.x || b.goal.z !== goal.z)) {
        b.goal = { ...goal };
        this.setPath(c, b, b.goal);
      } else if (b.path.length === 0 && b.repathT <= 0) {
        this.setPath(c, b, b.goal);
      }
      this.aiMoveAlong(c, b, dt, PHYS.botRun, true);
      return;
    }
    // 在点内：下包
    c.anim.state = 'plant';
    c.plantT += dt;
    this.moveEntity(c, dt, 0, 0, 0, false);
    if (c.plantT >= ROUND.plantTime) {
      this.plantBomb(c);
      b.mode = 'hold';
      b.goal = null;
    }
    for (const e of this.combatants) {
      if (e.team !== c.team && e.alive && dist2D(c.pos.x, c.pos.z, e.pos.x, e.pos.z) < 5 && this.canSee(c, e)) {
        c.anim.state = 'idle';
        c.plantT = 0;
        b.mode = 'combat';
        b.targetId = e.id;
        b.reactT = 0.2;
        return;
      }
    }
  }

  private aiDefuse(c: Combatant, b: Brain, dt: number): void {
    if (this.bomb.state !== 'planted') { b.mode = 'patrol'; return; }
    const d = dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z);
    if (d > 1.4) {
      b.goal = { x: this.bomb.x, z: this.bomb.z };
      this.setPath(c, b, b.goal);
      b.mode = 'goto';
      return;
    }
    c.anim.state = 'defuse';
    c.defuseT += dt;
    this.moveEntity(c, dt, 0, 0, 0, false);
    if (c.defuseT >= ROUND.defuseTime) {
      this.defuseBomb(c);
      b.mode = 'hold';
      return;
    }
    if (c.hurtT > 0.2 && b.lastSeen !== null && this.time - b.lastSeen.t < 1) {
      // 受伤中断：打敌人
    }
  }

  private aiHold(c: Combatant, b: Brain, dt: number): void {
    if (!b.goal) {
      const site = inSite(this.bomb.x, this.bomb.z, 'A') ? 'A' : 'B';
      const hp = holdPoints[site === 'A' ? 'aSite' : 'bSite'];
      b.goal = hp[Math.floor(this.rng() * hp.length)];
      this.setPath(c, b, b.goal);
      return;
    }
    const d = dist2D(c.pos.x, c.pos.z, b.goal.x, b.goal.z);
    if (d < 2) {
      // 就位：环视
      c.yaw += dt * 0.6;
      this.moveEntity(c, dt, 0, 0, 0, false);
      if (this.rng() < dt * 0.3) {
        b.goal = null;
      }
      return;
    }
    this.aiMoveAlong(c, b, dt, PHYS.botRun, true);
  }

  private aiPatrol(c: Combatant, b: Brain, dt: number): void {
    if (this.phase === 'freeze') { this.moveEntity(c, dt, 0, 0, 0, false); return; }
    if (!b.goal) {
      // 选巡逻点
      b.wanderT -= dt;
      if (b.wanderT > 0) {
        this.moveEntity(c, dt, 0, 0, 0, false);
        c.yaw += dt * 0.5;
        return;
      }
      b.wanderT = 2 + this.rng() * 3;
      const zones = c.team === 'T'
        ? [...patrolPoints.tSpawn, ...patrolPoints.tMid, ...patrolPoints.aLong, ...patrolPoints.tunnels, ...patrolPoints.lower, ...patrolPoints.bSite]
        : [...patrolPoints.ctSpawn, ...patrolPoints.mid, ...patrolPoints.midToB, ...patrolPoints.bDoors, ...patrolPoints.aSite, ...patrolPoints.bSite];
      const anchor = b.holdPt ?? zones[Math.floor(this.rng() * zones.length)];
      const p = navGrid.randomPointNear(anchor.x, anchor.z, 9, this.rng);
      if (p) {
        b.goal = { x: p.x, z: p.z };
        this.setPath(c, b, b.goal);
      }
      return;
    }
    const d = dist2D(c.pos.x, c.pos.z, b.goal.x, b.goal.z);
    if (d < 1.5) {
      b.goal = null;
      b.path = [];
      return;
    }
    if (b.path.length === 0 && b.repathT <= 0) this.setPath(c, b, b.goal);
    this.aiMoveAlong(c, b, dt, PHYS.botWalk + this.rng() * 0.4, true);
  }

  // ================= 观战 =================
  private spectateTargets(): Combatant[] {
    const c = this.combatants[this.playerIdx];
    const alive = this.combatants.filter((x) => x.alive && x.team === c.team);
    return alive.length > 0 ? alive : this.combatants.filter((x) => x.alive);
  }

  cycleSpectate(): void {
    const list = this.spectateTargets();
    if (list.length === 0) return;
    this.specIdx = (this.specIdx + 1) % list.length;
  }

  private takeoverSpectate(): void {
    const c = this.combatants[this.playerIdx];
    const list = this.spectateTargets();
    const target = list[this.specIdx];
    if (target && target.team === c.team) {
      this.playerIdx = target.id;
      target.isPlayer = true;
      target.brain = null;
      this.specIdx = -1;
      this.emitHud();
    }
  }

  // ================= 主循环 =================
  update(dt: number): void {
    if (this.phase === 'menu' || this.phase === 'matchEnd') {
      this.emitHud();
      return;
    }
    dt = Math.min(dt, 0.05);
    this.time += dt;
    // 门
    this.updateDoors();
    // 炸弹
    if (this.bomb.state === 'carried') this.updateBombCarrier();
    if (this.bomb.state === 'planted' && this.phase === 'planted') {
      this.bomb.timer -= dt;
      this.bomb.beepT -= dt;
      if (this.bomb.beepT <= 0) {
        this.bomb.beepT = this.bomb.timer < 10 ? 0.4 : 1.0;
        this.events.push({ type: 'bombBeep', x: this.bomb.x, y: this.bomb.y, z: this.bomb.z });
      }
    }
    // 阶段计时
    if (this.phase === 'freeze') {
      this.freezeT -= dt;
      if (this.freezeT <= 0) {
        this.phase = 'live';
        this.freezeT = 0;
      }
    } else if (this.phase === 'live') {
      this.roundT -= dt;
      this.checkWin();
    } else if (this.phase === 'planted') {
      this.checkWin();
    } else if (this.phase === 'roundEnd') {
      this.endT -= dt;
      if (this.endT <= 0) {
        if (this.scoreT >= ROUND.winRounds || this.scoreCT >= ROUND.winRounds) {
          this.phase = 'matchEnd';
        } else {
          this.startRound();
        }
      }
    }
    // 命中反馈衰减
    this.hitmarkerT = Math.max(0, this.hitmarkerT - dt);
    this.hurtFlash = Math.max(0, this.hurtFlash - dt * 1.1);
    // 玩家
    this.updatePlayer(dt);
    // 阵亡玩家接管观战目标
    {
      const pc0 = this.combatants[this.playerIdx];
      if (pc0 && !pc0.alive && this.input.takePressed) {
        this.takeoverSpectate();
        this.input.takePressed = false;
      }
    }
    // 玩家索敌（小地图）
    const pc = this.combatants[this.playerIdx];
    if (pc && pc.alive) {
      for (const e of this.combatants) {
        if (e.team !== pc.team && e.alive) {
          if (this.canSee(pc, e)) this.spotted[e.id] = { x: e.pos.x, z: e.pos.z, t: this.time };
        }
      }
    }
    // 阵亡玩家观战
    if (pc && !pc.alive && this.phase === 'live' || (pc && !pc.alive && this.phase === 'planted')) {
      if (this.specIdx < 0) this.specIdx = 0;
    }
    // AI
    for (const c of this.combatants) {
      if (!c.alive) {
        if (c.anim.state === 'dead') c.anim.deadT += dt;
        continue;
      }
      c.fireCd -= dt;
      c.drawT -= dt;
      c.hurtT -= dt;
      if (c.reloading) {
        c.reloadT -= dt;
        if (c.reloadT <= 0) {
          const w = this.curWeapon(c);
          if (w && w.id !== 'knife') {
            const am = c.ammo[w.id]!;
            const need = w.magSize - am.mag;
            const take = Math.min(need, am.reserve);
            am.mag += take;
            am.reserve -= take;
          }
          c.reloading = false;
        }
      }
      if (c.anim.fireFlash > 0) c.anim.fireFlash -= dt;
      if (c.brain) {
        c.brain.tickT -= dt;
        if (c.brain.tickT <= 0) {
          c.brain.tickT = AI.tick;
          this.aiTickBrain(c, c.brain, dt);
        }
        // 每帧推进 AI 移动
        const b = c.brain;
        switch (b.mode) {
          case 'combat': this.aiCombat(c, b, dt); break;
          case 'goto': this.aiGoto(c, b, dt); break;
          case 'plant': this.aiPlant(c, b, dt); break;
          case 'defuse': this.aiDefuse(c, b, dt); break;
          case 'hold': this.aiHold(c, b, dt); break;
          default: this.aiPatrol(c, b, dt); break;
        }
      }
    }
    // HUD
    this.hudTimer -= dt;
    if (this.hudTimer <= 0) {
      this.hudTimer = 0.04;
      this.emitHud();
    }
    // 事件清理交给渲染层 drain
  }

  private updateDoors(): void {
    if (this.doorOpen) return;
    for (const c of this.combatants) {
      if (!c.alive) continue;
      const cx = (doorDef.x0 + doorDef.x1) / 2;
      const cz = (doorDef.z0 + doorDef.z1) / 2;
      if (dist2D(c.pos.x, c.pos.z, cx, cz) < 2.4) {
        this.doorOpen = true;
        this.colliders = this.colliders.filter((b) => b !== doorCollider);
        this.events.push({ type: 'door' });
        return;
      }
    }
  }

  // ================= HUD =================
  getHud(): HudState {
    const c = this.combatants[this.playerIdx];
    const w = c ? this.curWeapon(c) : null;
    const am = c && w ? c.ammo[w.id] : undefined;
    let timer = 0;
    let timerLabel = '';
    if (this.phase === 'freeze') { timer = this.freezeT; timerLabel = '冻结时间'; }
    else if (this.phase === 'live') { timer = this.roundT; timerLabel = '回合时间'; }
    else if (this.phase === 'planted') { timer = Math.max(0, this.bomb.timer); timerLabel = 'C4 倒计时'; }
    const spectateList = this.combatants.filter((x) => x.team === c?.team).map((x) => ({ id: x.id, name: x.name, alive: x.alive, hp: x.hp }));
    const bombVisible = this.bomb.state !== 'carried' || this.spotted[this.bomb.carrierId] !== undefined;
    return {
      phase: this.phase,
      hp: c ? Math.max(0, Math.round(c.hp)) : 0,
      armor: c ? Math.round(c.armor) : 0,
      weaponName: w ? w.name : '—',
      mag: am ? am.mag : 0,
      reserve: am ? am.reserve : 0,
      slots: SLOT_ORDER.filter((s) => s !== 'bomb' || (c && c.carriesBomb)).map((s) => ({
        key: s,
        label: SLOT_LABEL[s],
        has: !!c?.slots[s],
        cur: c?.curSlot === s,
      })),
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      roundNum: this.roundNum,
      timer,
      timerLabel,
      bombCarried: c ? c.carriesBomb : false,
      bombDropped: this.bomb.state === 'dropped',
      bombPlanted: this.bomb.state === 'planted',
      bombX: this.bomb.x,
      bombZ: this.bomb.z,
      siteHint: this.siteHint(),
      killfeed: [...this.killfeed],
      spectate: c && !c.alive ? {
        name: this.spectateTargets()[this.specIdx]?.name ?? '—',
        index: Math.max(0, this.specIdx),
        list: spectateList,
        takeover: this.spectateTargets()[this.specIdx]?.team === c.team,
      } : null,
      dead: c ? !c.alive : false,
      hitmarkerT: this.hitmarkerT,
      hitHead: this.hitHead,
      hurtFlash: this.hurtFlash,
      roundEndText: this.roundEndText,
      matchEnd: this.phase === 'matchEnd' ? { scoreT: this.scoreT, scoreCT: this.scoreCT, winner: this.scoreT >= ROUND.winRounds ? 'T' : 'CT' } : null,
      interact: this.interactInfo(c),
      minimap: {
        px: c ? c.pos.x : 0,
        pz: c ? c.pos.z : 0,
        pyaw: c ? c.yaw : 0,
        teammates: this.combatants.filter((x) => x.team === c?.team && x.alive && x.id !== c?.id).map((x) => ({ x: x.pos.x, z: x.pos.z, id: x.id, hp: x.hp })),
        enemies: this.combatants.filter((x) => x.team !== c?.team && x.alive && this.spotted[x.id] && this.time - this.spotted[x.id].t < 3.5).map((x) => ({ x: x.pos.x, z: x.pos.z })),
        bomb: bombVisible && this.bomb.state !== 'carried' ? { x: this.bomb.x, z: this.bomb.z, carried: false, planted: this.bomb.state === 'planted' } : null,
        carrierId: this.bomb.carrierId,
      },
      spread: c ? c.spread : 0,
      zoom: c ? c.zoom : 0,
      kills: c ? c.kills : 0,
      deaths: c ? c.deaths : 0,
      playersAlive: {
        t: this.combatants.filter((x) => x.team === 'T' && x.alive).length,
        ct: this.combatants.filter((x) => x.team === 'CT' && x.alive).length,
      },
    };
  }

  private siteHint(): string {
    const c = this.combatants[this.playerIdx];
    if (!c) return '';
    if (this.bomb.state === 'planted') return c.team === 'CT' ? 'C4 已安放 — 立即拆除！' : 'C4 已安放 — 守住！';
    if (c.carriesBomb) return '携带 C4 — 前往 A点 / B点，按 4 装备后按住左键安放';
    if (c.team === 'T' && this.bomb.state === 'dropped') return 'C4 掉落 — 前往拾取！';
    if (c.team === 'T') return '跟随 C4 推点';
    return '阻止 T 方安放 C4';
  }

  private interactInfo(c: Combatant | undefined): { label: string; progress: number } | null {
    if (!c || !c.alive) return null;
    if (c.team === 'CT' && this.bomb.state === 'planted' && dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z) < 1.3) {
      return { label: '按住 E 拆除 C4', progress: c.defuseT / ROUND.defuseTime };
    }
    if (c.team === 'T' && this.bomb.state === 'dropped' && dist2D(c.pos.x, c.pos.z, this.bomb.x, this.bomb.z) < 1.0) {
      return { label: '拾取 C4', progress: 0 };
    }
    return null;
  }

  private emitHud(): void {
    this.hud = this.getHud();
    this.onHud?.(this.hud);
  }

  hud: HudState = this.getHud();
  onHud: ((h: HudState) => void) | null = null;

  // ================= 事件消费 =================
  drainEvents(): EffectEvent[] {
    const evs = this.events;
    this.events = [];
    return evs;
  }

  /** 观战视角目标（渲染层使用） */
  viewCombatant(): Combatant | null {
    const c = this.combatants[this.playerIdx];
    if (!c) return null;
    if (c.alive) return c;
    const list = this.spectateTargets();
    if (list.length === 0) return c;
    return list[Math.max(0, this.specIdx) % list.length];
  }
}
