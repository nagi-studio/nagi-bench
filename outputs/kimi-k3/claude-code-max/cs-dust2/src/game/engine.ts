// ---------------------------------------------------------------------------
// 游戏引擎：渲染循环 + 物理帧更新 + 战斗 + C4 + 回合系统 + 观战/接管
// React 通过 subscribe/getSnapshot 读取 HUD 快照（useSyncExternalStore）
// ---------------------------------------------------------------------------

import * as THREE from 'three';
import { AABB, BombState, HitPart, KillEntry, PART_MULTIPLIER, pointInRect, RoundEndReason, RoundPhase, Slot, Team } from './types';
import { buildMap, losClear, MapData, rayAABB, raycastWorld, WALL_H } from './mapData';
import { Entity, EYE, IDLE_CMD, MoveCmd } from './entities';
import { makeLoadout, WeaponInstance, WEAPONS } from './weapons';
import { audio } from './audio';
import { Brain } from './ai';
import {
  buildBombMesh, buildHumanoid, buildMapMeshes, buildViewModel,
  buildWeaponMesh, poseHumanoid, revivePose, setDeadPose, setViewModelWeapon, ViewModel,
} from './models';

const BOT_NAMES_CT = ['Raptor', 'Viper', 'Ghost', 'Falcon'];
const BOT_NAMES_T = ['Volk', 'Dmitri', 'Omar', 'Chen', 'Ivan'];

const ROUND_TIME = 115;
const FREEZE_TIME = 3;
const END_TIME = 5;
const BOMB_TIME = 40;
export const PLANT_TIME = 3;
export const DEFUSE_TIME = 5;

export interface FeedMsg { id: number; text: string; color: string; time: number }

export interface HudSnapshot {
  hp: number; armor: number; alive: boolean;
  weaponName: string; mag: number; reserve: number; reloading: boolean;
  slot: Slot; hasPrimary: boolean; primaryName: string; secondaryName: string;
  spreadPx: number; scoped: boolean; scoping: boolean;
  round: number; scoreCT: number; scoreT: number;
  phase: RoundPhase; timeLeft: number; phaseTimeLeft: number;
  kills: KillEntry[]; feed: FeedMsg[];
  hitAt: number; hitHead: boolean;
  bombState: BombState; bombTimer: number;
  plantT: number; defuseT: number; planting: boolean; defusing: boolean;
  banner: string; bannerSub: string; bannerKind: string;
  spectating: string | null; aliveCT: number; aliveT: number;
  playerTeam: Team; paused: boolean; hint: string;
  hasBomb: boolean; canPlant: boolean; canDefuse: boolean;
  spectateList: string[];
}

interface Tracer { line: THREE.Line; dieAt: number }
interface Spark { mesh: THREE.Mesh; dieAt: number; vel: THREE.Vector3 }

export class Game {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  map: MapData;

  entities: Entity[] = [];
  brains = new Map<number, Brain>();
  player!: Entity;
  controlled!: Entity;
  spectating: Entity | null = null;
  playerTeam: Team;

  now = 0;
  frame = 0;
  round = 1;
  scoreCT = 0;
  scoreT = 0;
  phase: RoundPhase = 'freeze';
  phaseEndsAt = 0;
  roundEndsAt = 0;
  winner: Team | null = null;
  endReason: RoundEndReason | null = null;

  bomb = {
    state: 'idle' as BombState,
    carrier: null as Entity | null,
    pos: new THREE.Vector3(),
    timer: BOMB_TIME,
    plantT: 0,
    defuseT: 0,
    plantStamp: -1,
    defuseStamp: -1,
    defuser: null as Entity | null,
    beepAcc: 0,
    mesh: buildBombMesh(),
    plantedSite: '' as string,
  };

  kills: KillEntry[] = [];
  feed: FeedMsg[] = [];
  private feedId = 1;
  private killId = 1;
  hitAt = -99;
  hitHead = false;

  banner = ''; bannerSub = ''; bannerKind = ''; bannerUntil = 0;

  // 输入
  keys = new Set<string>();
  mouseDown = false;
  mouse2Down = false;
  private clickEdge = false;
  pointerLocked = false;

  // 视口/手感
  private vm: ViewModel;
  private vmKick = 0;
  private baseFov = 75;
  private scoped = false;
  private bobT = 0;
  private muzzle: THREE.PointLight;
  private muzzleT = -99;
  private explosionMesh: THREE.Mesh | null = null;
  private explosionT = -99;

  private tracers: Tracer[] = [];
  private sparks: Spark[] = [];
  private tmpV = new THREE.Vector3();

  visibleEnemies = new Set<number>();
  private visAcc = 0;
  private hudAcc = 0;
  private listeners = new Set<() => void>();
  private snapshot: HudSnapshot;
  private raf = 0;
  private lastTs = 0;
  disposed = false;

  constructor(canvas: HTMLCanvasElement, playerTeam: Team) {
    this.playerTeam = playerTeam;
    this.map = buildMap();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(this.baseFov, window.innerWidth / window.innerHeight, 0.05, 300);
    this.camera.rotation.order = 'YXZ';

    // 场景氛围：沙漠午后
    this.scene.background = new THREE.Color(0x9fc3e0);
    this.scene.fog = new THREE.Fog(0xa8c0d4, 60, 180);
    const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a7a5c, 0.95);
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.35);
    sun.position.set(40, 70, 20);
    this.scene.add(hemi, sun);

    this.scene.add(buildMapMeshes(this.map));
    this.scene.add(this.bomb.mesh);
    this.bomb.mesh.visible = false;

    this.muzzle = new THREE.PointLight(0xffc060, 0, 9);
    this.scene.add(this.muzzle);

    // 第一人称手模挂在相机上
    this.vm = buildViewModel();
    this.camera.add(this.vm.group);
    this.scene.add(this.camera);

    this.spawnEntities();
    this.bindInput(canvas);
    this.startRound();

    this.snapshot = this.buildSnapshot();
    window.addEventListener('resize', this.onResize);
  }

  // ------------------------------------------------------------ 实体生成

  private spawnEntities() {
    const mk = (name: string, team: Team, isPlayer: boolean) => {
      const e = new Entity(name, team, isPlayer, buildHumanoid(team));
      e.onStep = () => {
        if (e === this.controlled) audio.step();
        else audio.step({ x: e.pos.x, z: e.pos.z }, e.stepAlt);
      };
      this.entities.push(e);
      this.scene.add(e.model.root);
      if (!isPlayer) this.brains.set(e.id, new Brain(e));
      return e;
    };
    const myBots = this.playerTeam === 'CT' ? BOT_NAMES_CT : BOT_NAMES_T.slice(0, 4);
    const foeBots = this.playerTeam === 'CT' ? BOT_NAMES_T : BOT_NAMES_CT.concat(['Sergei']);
    this.player = mk('你', this.playerTeam, true);
    for (const n of myBots) mk(n, this.playerTeam, false);
    const foeTeam: Team = this.playerTeam === 'CT' ? 'T' : 'CT';
    for (const n of foeBots) mk(n, foeTeam, false);
    this.controlled = this.player;
  }

  // ------------------------------------------------------------ 回合系统

  startRound() {
    this.phase = 'freeze';
    this.phaseEndsAt = this.now + FREEZE_TIME;
    this.winner = null;
    this.endReason = null;

    // 装备与站位
    let tIdx = 0, ctIdx = 0;
    const tPlayers = this.entities.filter(e => e.team === 'T');
    const awpT = tPlayers[tPlayers.length - 1];
    const cts = this.entities.filter(e => e.team === 'CT');
    const awpCT = cts[cts.length - 1];

    for (const e of this.entities) {
      const lo = makeLoadout(e.team, this.round, e === awpT || e === awpCT);
      e.weapons = [lo.primary, lo.secondary, lo.melee];
      e.slot = lo.primary ? Slot.Primary : Slot.Secondary;
      e.lastSlot = e.slot;
      e.hp = 100;
      e.armor = lo.armor;
      e.helmet = lo.helmet;
      e.alive = true;
      e.hasBomb = false;
      e.bloom = 0; e.recoilP = 0; e.recoilY = 0;
      e.vel.set(0, 0, 0);
      e.nextFireAt = 0;
      const spawns = this.map.spawns[e.team];
      const sp = spawns[(e.team === 'T' ? tIdx++ : ctIdx++) % spawns.length];
      e.pos.set(sp.x + (Math.random() - 0.5) * 1.5, 0, sp.z + (Math.random() - 0.5) * 1.5);
      e.yaw = e.team === 'T' ? Math.PI : 0; // 面向北方战场
      e.yaw = Math.atan2(-(0 - e.pos.x), -(-20 - e.pos.z));
      e.pitch = 0;
      revivePose(e.model);
      this.attachGun(e);
      const brain = this.brains.get(e.id);
      if (brain) {
        // 分配角色路线
        if (e.team === 'T') {
          const roll = Math.random();
          brain.role = roll < 0.4 ? 'A' : roll < 0.75 ? 'B' : 'mid';
        } else {
          const mates = this.entities.filter(x => x.team === 'CT' && this.brains.has(x.id));
          const i = mates.indexOf(e);
          brain.role = (['A', 'A', 'B', 'mid', 'B'] as const)[i % 5];
        }
      }
    }
    for (const [, b] of this.brains) b.assignRound(this);

    // C4 交给某个 T（玩家是 T 时优先给玩家体验下包）
    this.bomb.state = 'carried';
    this.bomb.timer = BOMB_TIME;
    this.bomb.plantT = 0;
    this.bomb.defuseT = 0;
    this.bomb.defuser = null;
    this.bomb.plantedSite = '';
    const carrier = this.playerTeam === 'T' && Math.random() < 0.6
      ? this.player
      : tPlayers[Math.floor(Math.random() * tPlayers.length)];
    carrier.hasBomb = true;
    this.bomb.carrier = carrier;
    this.bomb.mesh.visible = false;
    // 带包 bot 偏向跟大队
    const cb = this.brains.get(carrier.id);
    if (cb) cb.role = Math.random() < 0.5 ? 'A' : 'B';

    this.showBanner(
      `第 ${this.round} 回合`,
      this.round === 1 ? '手枪局 — 出击！' : '全线开战！',
      'round', this.now + FREEZE_TIME + 1.2,
    );
    if (carrier === this.controlled) this.pushFeed('你携带了 C4，前往 A 点或 B 点按 E 安放', '#ffd257');
    else if (this.playerTeam === 'T') this.pushFeed(`${carrier.name} 携带 C4`, '#ffd257');
  }

  private attachGun(e: Entity) {
    const w = e.weapon;
    if (e.model.gun) e.model.gunMount.remove(e.model.gun);
    const g = buildWeaponMesh(w.def.id);
    e.model.gun = g;
    e.model.gunMount.add(g);
  }

  private endRound(winner: Team, reason: RoundEndReason) {
    if (this.phase !== 'live') return;
    this.phase = 'end';
    this.phaseEndsAt = this.now + END_TIME;
    this.winner = winner;
    this.endReason = reason;
    if (winner === 'CT') this.scoreCT++; else this.scoreT++;
    const reasonText: Record<RoundEndReason, string> = {
      elimination_t: '歼灭了所有 CT',
      elimination_ct: '歼灭了所有 T',
      bomb_exploded: 'C4 成功引爆',
      bomb_defused: 'C4 被成功拆除',
      time_up: '时间耗尽，T 未能安放 C4',
    };
    this.showBanner(`${winner === 'CT' ? 'CT' : 'T'} 阵营胜利`, reasonText[reason], winner === this.playerTeam ? 'win' : 'lose', this.now + 4);
    audio.roundStinger(winner === this.playerTeam);
    // 取消进行中的通道
    this.bomb.plantT = 0;
    this.bomb.defuseT = 0;
  }

  private showBanner(text: string, sub: string, kind: string, until: number) {
    this.banner = text; this.bannerSub = sub; this.bannerKind = kind; this.bannerUntil = until;
  }

  pushFeed(text: string, color = '#c9d4e0') {
    this.feed.push({ id: this.feedId++, text, color, time: this.now });
    if (this.feed.length > 6) this.feed.shift();
  }

  // ------------------------------------------------------------ 主循环

  start() {
    const loop = (ts: number) => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, this.lastTs ? (ts - this.lastTs) / 1000 : 0.016);
      this.lastTs = ts;
      this.tick(dt);
      this.renderer.render(this.scene, this.camera);
    };
    this.raf = requestAnimationFrame(loop);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  tick(dt: number) {
    this.now += dt;
    this.frame++;

    // ---- 阶段推进 ----
    if (this.phase === 'freeze' && this.now >= this.phaseEndsAt) {
      this.phase = 'live';
      this.roundEndsAt = this.now + ROUND_TIME;
    } else if (this.phase === 'end' && this.now >= this.phaseEndsAt) {
      this.round++;
      this.startRound();
    }

    // ---- 玩家输入 -> 操控实体 ----
    this.applyPlayerInput(dt);

    // ---- AI ----
    for (const [, b] of this.brains) {
      if (b.ent === this.controlled) continue; // 被接管后不再由 AI 控制
      b.update(dt, this);
    }

    // ---- 物理 ----
    for (const e of this.entities) {
      const cmd = e === this.controlled ? this.playerCmd : (this.brains.get(e.id)?.cmd ?? IDLE_CMD);
      e.update(dt, this.phase === 'freeze' ? IDLE_CMD : cmd, this.map.colliders);
      this.syncModel(e, dt);
    }

    // ---- 自动开火（玩家） ----
    if (this.mouseDown && this.controlled.alive && this.phase === 'live') {
      const w = this.controlled.weapon;
      if (w.def.auto || this.clickEdge) this.entityFire(this.controlled);
    } else if (this.clickEdge && this.controlled.alive && this.phase === 'live') {
      this.entityFire(this.controlled); // 半自动单击
    }
    this.clickEdge = false;

    // ---- C4 ----
    this.updateBomb(dt);

    // ---- 胜负判定 ----
    if (this.phase === 'live') this.checkWinConditions();

    // ---- 观战 ----
    this.updateSpectate();

    // ---- 敌人可见性（小地图） ----
    this.visAcc += dt;
    if (this.visAcc > 0.25) {
      this.visAcc = 0;
      this.computeVisibility();
    }

    // ---- 相机与特效 ----
    this.updateCamera(dt);
    this.updateFx(dt);
    audio.setListener(this.camera.position.x, this.camera.position.z);

    // ---- HUD 同步（~15Hz） ----
    this.hudAcc += dt;
    if (this.hudAcc > 0.066) {
      this.hudAcc = 0;
      this.snapshot = this.buildSnapshot();
      for (const fn of this.listeners) fn();
    }
  }

  // ------------------------------------------------------------ 玩家输入

  private playerCmd: MoveCmd = { ...IDLE_CMD };

  private applyPlayerInput(dt: number) {
    void dt;
    const c = this.controlled;
    const cmd = this.playerCmd;
    cmd.mx = 0; cmd.mz = 0; cmd.jump = false; cmd.walk = false;
    if (!c.alive || this.phase !== 'live') return;
    if (this.keys.has('KeyW')) cmd.mz += 1;
    if (this.keys.has('KeyS')) cmd.mz -= 1;
    if (this.keys.has('KeyA')) cmd.mx -= 1;
    if (this.keys.has('KeyD')) cmd.mx += 1;
    cmd.jump = this.keys.has('Space');
    cmd.walk = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
  }

  private bindInput(canvas: HTMLCanvasElement) {
    canvas.addEventListener('click', () => {
      if (!this.pointerLocked) canvas.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === canvas;
      this.snapshot = this.buildSnapshot();
      for (const fn of this.listeners) fn();
    });
    document.addEventListener('mousemove', (ev) => {
      if (!this.pointerLocked) return;
      const sens = this.scoped ? 0.0011 : 0.0022;
      const c = this.controlled;
      if (c.alive) {
        c.yaw -= ev.movementX * sens;
        c.pitch = Math.max(-1.45, Math.min(1.45, c.pitch - ev.movementY * sens));
      }
    });
    document.addEventListener('mousedown', (ev) => {
      if (!this.pointerLocked) return;
      if (ev.button === 0) { this.mouseDown = true; this.clickEdge = true; }
      if (ev.button === 2) this.mouse2Down = true;
    });
    document.addEventListener('mouseup', (ev) => {
      if (ev.button === 0) this.mouseDown = false;
      if (ev.button === 2) this.mouse2Down = false;
    });
    document.addEventListener('contextmenu', (ev) => ev.preventDefault());
    document.addEventListener('keydown', (ev) => {
      if (ev.code === 'Space') ev.preventDefault();
      this.keys.add(ev.code);
      if (!this.pointerLocked || !this.controlled.alive) return;
      const c = this.controlled;
      if (ev.code === 'Digit1' && c.weapons[Slot.Primary]) c.switchSlot(Slot.Primary, this.now, () => this.onSwitchWeapon());
      if (ev.code === 'Digit2') c.switchSlot(Slot.Secondary, this.now, () => this.onSwitchWeapon());
      if (ev.code === 'Digit3') c.switchSlot(Slot.Melee, this.now, () => this.onSwitchWeapon());
      if (ev.code === 'KeyQ') c.switchSlot(c.lastSlot, this.now, () => this.onSwitchWeapon());
      if (ev.code === 'KeyR') this.startReload(c);
      if (ev.code === 'KeyF') this.takeover();
    });
    document.addEventListener('keyup', (ev) => this.keys.delete(ev.code));
  }

  private onSwitchWeapon() {
    audio.weaponSwitch();
    this.attachGun(this.controlled);
    setViewModelWeapon(this.vm, this.controlled.weapon.def.id, this.controlled.team);
  }

  // ------------------------------------------------------------ 射击系统

  entityFire(e: Entity) {
    const w = e.weapon;
    if (!w || !e.alive) return;
    if (this.now < e.nextFireAt) return;
    if (w.reloadEnd > 0) return;

    // 近战
    if (w.def.melee) {
      e.nextFireAt = this.now + 60 / w.def.rpm;
      e.swingUntil = this.now + 0.25;
      audio.shot('knife', e === this.controlled ? undefined : { x: e.pos.x, z: e.pos.z });
      this.meleeHit(e, w);
      return;
    }

    if (w.mag <= 0) {
      if (e === this.controlled) {
        audio.dryFire();
        this.startReload(e);
      } else this.startReload(e);
      e.nextFireAt = this.now + 0.3;
      return;
    }

    w.mag--;
    e.nextFireAt = this.now + 60 / w.def.rpm;
    e.bloom = Math.min(w.def.spreadMax, e.bloom + w.def.bloomPerShot);
    e.recoilP += w.def.recoilPitch;
    e.recoilY += (Math.random() - 0.5) * 2 * w.def.recoilYaw;
    if (e === this.controlled) this.vmKick = Math.min(0.12, this.vmKick + 0.05);

    // 散射方向
    const spreadRad = (e.currentSpread() * Math.PI) / 180;
    const yaw = e.yaw + (Math.random() - 0.5) * 2 * spreadRad;
    const pitch = e.pitch + (Math.random() - 0.5) * 2 * spreadRad;
    const cp = Math.cos(pitch);
    const dir = new THREE.Vector3(-Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp);

    this.fireRay(e, w, dir);
    audio.shot(w.def.sound, e === this.controlled ? undefined : { x: e.pos.x, z: e.pos.z });

    // 枪口火光
    const eye = e.eye();
    this.muzzle.position.set(eye.x + dir.x * 0.8, eye.y + dir.y * 0.8 - 0.08, eye.z + dir.z * 0.8);
    this.muzzle.intensity = 2.4;
    this.muzzleT = this.now;
  }

  private fireRay(shooter: Entity, w: WeaponInstance, dir: THREE.Vector3) {
    const eye = shooter.eye();
    const MAX = 120;
    const wallT = raycastWorld(this.map.colliders, eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, MAX);

    // 命中实体 hitbox
    let bestT = wallT;
    let bestEnt: Entity | null = null;
    let bestPart: HitPart | null = null;
    const boxes: ReturnType<Entity['hitboxes']> = [];
    for (const o of this.entities) {
      if (o === shooter || !o.alive || o.team === shooter.team) continue;
      o.hitboxes(boxes);
      for (const b of boxes) {
        const hit = rayAABB(eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, b, bestT);
        if (hit && hit.t < bestT) {
          bestT = hit.t;
          bestEnt = o;
          bestPart = b.part;
        }
      }
    }

    // 曳光
    const muzzlePos = new THREE.Vector3(
      eye.x + dir.x * 0.6 - Math.cos(shooter.yaw) * 0.12,
      eye.y + dir.y * 0.6 - 0.12,
      eye.z + dir.z * 0.6 + Math.sin(shooter.yaw) * 0.12,
    );
    const endPos = new THREE.Vector3(eye.x + dir.x * bestT, eye.y + dir.y * bestT, eye.z + dir.z * bestT);
    this.spawnTracer(muzzlePos, endPos, w.def.tracerColor);

    if (bestEnt && bestPart) {
      const mult = PART_MULTIPLIER[bestPart];
      this.damageEntity(bestEnt, w.def.damage * mult, bestPart, shooter, w.def.name);
      this.spawnSpark(endPos, 0xff6a4a);
    } else if (wallT < MAX) {
      this.spawnSpark(endPos, 0xd8c8a0);
    }
  }

  private meleeHit(e: Entity, w: WeaponInstance) {
    const eye = e.eye();
    const cp = Math.cos(e.pitch);
    const dir = new THREE.Vector3(-Math.sin(e.yaw) * cp, Math.sin(e.pitch), -Math.cos(e.yaw) * cp);
    const range = w.def.range ?? 2.2;
    const wallT = raycastWorld(this.map.colliders, eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, range);
    let bestT = wallT;
    let bestEnt: Entity | null = null;
    const boxes: ReturnType<Entity['hitboxes']> = [];
    for (const o of this.entities) {
      if (o === e || !o.alive || o.team === e.team) continue;
      o.hitboxes(boxes);
      for (const b of boxes) {
        const hit = rayAABB(eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, b, bestT);
        if (hit && hit.t < bestT) { bestT = hit.t; bestEnt = o; }
      }
    }
    if (bestEnt) {
      this.damageEntity(bestEnt, w.def.damage * 1.0, 'chest', e, w.def.name);
    }
  }

  startReload(e: Entity) {
    const w = e.weapon;
    if (!w || w.def.melee || w.reloadEnd > 0) return;
    if (w.mag >= w.def.magSize || w.reserve <= 0) return;
    w.reloadEnd = this.now + w.def.reloadTime;
    audio.reload(e === this.controlled ? undefined : { x: e.pos.x, z: e.pos.z });
  }

  private damageEntity(target: Entity, rawDmg: number, part: HitPart, attacker: Entity, weaponName: string) {
    if (!target.alive) return;
    let dmg = rawDmg;
    // 护甲减伤
    const protectedPart = part === 'chest' || part === 'stomach' || part === 'arm' || (part === 'head' && target.helmet);
    if (target.armor > 0 && protectedPart) {
      const pen = WEAPONS[attacker.weapon.def.id]?.armorPen ?? 0.7;
      dmg = rawDmg * pen;
      target.armor = Math.max(0, target.armor - rawDmg * 0.5);
    }
    dmg = Math.round(dmg);
    target.hp -= dmg;

    if (attacker === this.controlled) {
      this.hitAt = this.now;
      this.hitHead = part === 'head';
      audio.hit(part === 'head');
    }
    // AI 被打会转头索敌
    const brain = this.brains.get(target.id);
    if (brain && target.alive && target !== attacker) {
      brain.lastSeenPos.copy(attacker.pos);
      brain.lastSeenAt = this.now;
      if (!brain.target) {
        brain.target = attacker;
        brain.reactionAt = this.now + 0.25;
      }
    }
    if (target.hp <= 0) this.kill(target, attacker, weaponName, part === 'head');
  }

  private kill(victim: Entity, attacker: Entity, weaponName: string, headshot: boolean) {
    victim.alive = false;
    victim.hp = 0;
    victim.deathTime = this.now;
    setDeadPose(victim.model);
    this.kills.push({
      id: this.killId++, attacker: attacker.name, victim: victim.name,
      weapon: weaponName, headshot, atkTeam: attacker.team, vicTeam: victim.team, time: this.now,
    });
    if (this.kills.length > 6) this.kills.shift();
    if (attacker === this.controlled) audio.kill();

    // C4 掉落
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bomb.state = 'dropped';
      this.bomb.carrier = null;
      this.bomb.pos.set(victim.pos.x, victim.pos.y + 0.1, victim.pos.z);
      this.bomb.mesh.position.copy(this.bomb.pos);
      this.bomb.mesh.visible = true;
      this.pushFeed(`C4 掉落在 ${this.zoneName(victim.pos.x, victim.pos.z)}`, '#ffd257');
      audio.drop();
    }
  }

  zoneName(x: number, z: number): string {
    for (const zn of this.map.zones) {
      if (pointInRect(x, z, zn.rect)) return zn.label;
    }
    return '野外';
  }

  // ------------------------------------------------------------ C4 逻辑

  /** T 在包点内安放（每帧调用以推进） */
  channelPlant(e: Entity, dt: number) {
    if (this.bomb.state !== 'carried' || !e.hasBomb || !e.alive) return;
    const inSite = pointInRect(e.pos.x, e.pos.z, this.map.siteA) || pointInRect(e.pos.x, e.pos.z, this.map.siteB);
    if (!inSite || !e.onGround) return;
    if (this.bomb.plantT === 0) {
      this.pushFeed(`${e.name} 正在安放 C4…`, '#ffd257');
      audio.plantBeep();
    }
    this.bomb.plantT += dt;
    this.bomb.plantStamp = this.frame;
    if (this.bomb.plantT >= PLANT_TIME) {
      this.bomb.state = 'planted';
      this.bomb.carrier = null;
      e.hasBomb = false;
      this.bomb.pos.set(e.pos.x, 0.08, e.pos.z);
      this.bomb.mesh.position.copy(this.bomb.pos);
      this.bomb.mesh.visible = true;
      this.bomb.timer = BOMB_TIME;
      this.bomb.beepAcc = 0;
      this.bomb.plantT = 0;
      this.bomb.plantedSite = pointInRect(e.pos.x, e.pos.z, this.map.siteA) ? 'A' : 'B';
      this.pushFeed(`C4 已安放于 ${this.bomb.plantedSite} 点！`, '#ff8040');
      this.showBanner('C4 已安放', `${this.bomb.plantedSite} 点 — ${BOMB_TIME} 秒后引爆`, 'bomb', this.now + 2.5);
      audio.plantBeep();
    }
  }

  /** CT 拆除（每帧调用以推进） */
  channelDefuse(e: Entity, dt: number) {
    if (this.bomb.state !== 'planted' || !e.alive || e.team !== 'CT') return;
    const d = Math.hypot(e.pos.x - this.bomb.pos.x, e.pos.z - this.bomb.pos.z);
    if (d > 2.2) return;
    if (this.bomb.defuseT === 0) this.pushFeed(`${e.name} 正在拆除 C4…`, '#7ec8ff');
    this.bomb.defuser = e;
    this.bomb.defuseT += dt;
    this.bomb.defuseStamp = this.frame;
    if (Math.random() < dt * 6) audio.defuseClick(e === this.controlled ? undefined : { x: e.pos.x, z: e.pos.z });
    if (this.bomb.defuseT >= DEFUSE_TIME) {
      this.bomb.state = 'defused';
      this.pushFeed('C4 已被拆除！', '#7ec8ff');
      this.endRound('CT', 'bomb_defused');
    }
  }

  private updateBomb(dt: number) {
    const b = this.bomb;
    // 通道中断检测
    if (b.plantT > 0 && b.plantStamp < this.frame) b.plantT = 0;
    if (b.defuseT > 0 && b.defuseStamp < this.frame) { b.defuseT = 0; b.defuser = null; }

    // 玩家输入：E 安放 / 拆除
    const c = this.controlled;
    if (c.alive && this.phase === 'live' && this.keys.has('KeyE')) {
      if (c.team === 'T' && c.hasBomb) this.channelPlant(c, dt);
      else if (c.team === 'CT' && b.state === 'planted') this.channelDefuse(c, dt);
    }

    // 掉落拾取（T）
    if (b.state === 'dropped') {
      b.mesh.rotation.y += dt * 1.5;
      for (const e of this.entities) {
        if (!e.alive || e.team !== 'T') continue;
        if (Math.hypot(e.pos.x - b.pos.x, e.pos.z - b.pos.z) < 1.2) {
          e.hasBomb = true;
          b.state = 'carried';
          b.carrier = e;
          b.mesh.visible = false;
          this.pushFeed(`${e.name} 拾起了 C4`, '#ffd257');
          if (e === this.controlled) this.showBanner('你已拾起 C4', '前往 A 点或 B 点按 E 安放', 'bomb', this.now + 2);
          break;
        }
      }
    }

    // 已安放：倒计时 + 滴答
    if (b.state === 'planted' && this.phase === 'live') {
      b.timer -= dt;
      const urgency = 1 - Math.max(0, b.timer) / BOMB_TIME;
      b.beepAcc += dt;
      const interval = Math.max(0.18, 1.1 * (1 - urgency) + 0.18);
      if (b.beepAcc >= interval) {
        b.beepAcc = 0;
        audio.bombTick({ x: b.pos.x, z: b.pos.z }, urgency);
        // 闪烁
        (this.bomb.mesh.children[1] as THREE.Mesh).visible = Math.floor(this.now * 4) % 2 === 0;
      }
      if (b.timer <= 0) this.explodeBomb();
    }
  }

  private explodeBomb() {
    const b = this.bomb;
    b.state = 'exploded';
    b.mesh.visible = false;
    audio.explosion({ x: b.pos.x, z: b.pos.z });

    // 爆炸特效
    const geo = new THREE.SphereGeometry(1, 24, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.9 });
    this.explosionMesh = new THREE.Mesh(geo, mat);
    this.explosionMesh.position.copy(b.pos).setY(1.5);
    this.scene.add(this.explosionMesh);
    this.explosionT = this.now;
    this.muzzle.position.copy(b.pos).setY(2);
    this.muzzle.intensity = 30;
    this.muzzleT = this.now;

    // 范围伤害
    for (const e of this.entities) {
      if (!e.alive) continue;
      const d = e.pos.distanceTo(b.pos);
      if (d < 28) {
        const dmg = 420 * (1 - d / 28) ** 1.5;
        e.hp -= Math.round(dmg);
        if (e.hp <= 0) this.kill(e, e, 'C4', false);
      }
    }
    this.endRound('T', 'bomb_exploded');
  }

  // ------------------------------------------------------------ 胜负判定

  private checkWinConditions() {
    const aliveT = this.entities.filter(e => e.team === 'T' && e.alive).length;
    const aliveCT = this.entities.filter(e => e.team === 'CT' && e.alive).length;
    if (aliveCT === 0) return this.endRound('T', 'elimination_t');
    if (aliveT === 0 && this.bomb.state !== 'planted') return this.endRound('CT', 'elimination_ct');
    if (this.now >= this.roundEndsAt && this.bomb.state !== 'planted') return this.endRound('CT', 'time_up');
  }

  // ------------------------------------------------------------ 观战 / 接管

  private updateSpectate() {
    if (this.controlled.alive) {
      if (this.spectating) this.spectating = null;
      return;
    }
    // 找存活队友
    if (!this.spectating || !this.spectating.alive) {
      const mates = this.entities.filter(e => e.team === this.controlled.team && e.alive && e !== this.controlled);
      this.spectating = mates[0] ?? null;
    }
  }

  /** 接管正在观战的 bot */
  takeover() {
    if (this.controlled.alive || !this.spectating || !this.spectating.alive) return;
    const t = this.spectating;
    this.brains.delete(t.id);
    this.controlled = t;
    this.spectating = null;
    this.attachGun(t);
    setViewModelWeapon(this.vm, t.weapon.def.id, t.team);
    this.pushFeed(`你已接管 ${t.name}`, '#9fe08a');
    this.showBanner('已接管队友', `继续战斗，${t.name}！`, 'round', this.now + 1.5);
  }

  cycleSpectate(dir: number) {
    if (this.controlled.alive) return;
    const mates = this.entities.filter(e => e.team === this.controlled.team && e.alive && e !== this.controlled);
    if (!mates.length) return;
    const idx = this.spectating ? mates.indexOf(this.spectating) : -1;
    this.spectating = mates[(idx + dir + mates.length) % mates.length];
  }

  // ------------------------------------------------------------ 可见性（小地图）

  private computeVisibility() {
    this.visibleEnemies.clear();
    const myTeam = this.playerTeam;
    const foes = this.entities.filter(e => e.team !== myTeam && e.alive);
    const mates = this.entities.filter(e => e.team === myTeam && e.alive);
    for (const f of foes) {
      for (const m of mates) {
        const d = f.pos.distanceTo(m.pos);
        if (d > 55) continue;
        const fe = f.eye(), me = m.eye();
        if (losClear(this.map.colliders, me.x, me.y, me.z, fe.x, fe.y - 0.3, fe.z)) {
          this.visibleEnemies.add(f.id);
          break;
        }
      }
    }
  }

  nearestAliveTBot(x: number, z: number): Entity | null {
    let best: Entity | null = null;
    let bd = Infinity;
    for (const e of this.entities) {
      if (e.team !== 'T' || !e.alive || e === this.controlled || !this.brains.has(e.id)) continue;
      const d = Math.hypot(e.pos.x - x, e.pos.z - z);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  // ------------------------------------------------------------ 模型同步 / 相机

  private syncModel(e: Entity, dt: number) {
    const m = e.model;
    m.root.position.set(e.pos.x, e.pos.y, e.pos.z);
    if (e.alive) {
      m.root.rotation.y = e.yaw;
      const amp = Math.min(1, e.speed2D() / 4) * 0.55;
      poseHumanoid(m, { pitch: e.pitch, walkPhase: e.walkPhase, walkAmp: amp, dead: false, knife: e.weapon.def.melee === true });
      // 刀挥动
      if (e.swingUntil > this.now) {
        const k = 1 - (e.swingUntil - this.now) / 0.25;
        m.armR.rotation.x = -0.7 - Math.sin(k * Math.PI) * 1.1;
      }
    } else {
      // 尸体下沉
      if (this.now - e.deathTime > 4) m.root.position.y = e.pos.y - Math.min(0.5, (this.now - e.deathTime - 4) * 0.3);
    }
    // 自己操控/观战的角色隐藏第三人称模型（避免挡镜头）
    m.root.visible = !e.alive || (e !== this.controlled && e !== this.spectating);
    void dt;
  }

  private updateCamera(dt: number) {
    const c = this.controlled;
    const target = c.alive ? c : this.spectating;
    if (!target) return;

    const eye = target.eye();
    // 呼吸/走路摆动
    let bobY = 0, bobX = 0;
    if (target === c && c.alive && c.onGround && c.speed2D() > 0.5) {
      this.bobT += dt * c.speed2D() * 1.8;
      bobY = Math.sin(this.bobT * 2) * 0.025;
      bobX = Math.cos(this.bobT) * 0.018;
    }
    this.camera.position.set(
      eye.x + Math.cos(target.yaw) * bobX,
      eye.y + bobY,
      eye.z - Math.sin(target.yaw) * bobX,
    );

    // 后坐力衰减
    c.recoilP = Math.max(0, c.recoilP - dt * 14 * Math.max(0.4, c.recoilP / 3));
    c.recoilY *= Math.max(0, 1 - dt * 10);
    const rp = target === c ? (c.recoilP * Math.PI) / 180 : 0;
    const ry = target === c ? (c.recoilY * Math.PI) / 180 : 0;
    this.camera.rotation.set(target.pitch + rp, target.yaw + ry, 0);

    // AWP 开镜
    const wantScope = this.mouse2Down && c.alive && c.weapon.def.scope === true && c.weapon.reloadEnd <= 0;
    if (wantScope && !this.scoped) audio.scope();
    this.scoped = wantScope;
    const targetFov = this.scoped ? this.baseFov / (c.weapon.def.zoom ?? 4) : this.baseFov;
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 14);
    this.camera.updateProjectionMatrix();
    this.vm.group.visible = !this.scoped && c.alive;

    // 手模摆动与后坐上跳
    this.vmKick = Math.max(0, this.vmKick - dt * 0.5);
    this.vm.group.position.set(
      0.26 + Math.cos(this.bobT) * 0.006,
      -0.24 + Math.sin(this.bobT * 2) * 0.008,
      -0.45 + this.vmKick,
    );
    this.vm.group.rotation.x = this.vmKick * 1.6;
    // 刀挥动
    if (c.alive && c.weapon.def.melee && c.swingUntil > this.now) {
      const k = 1 - (c.swingUntil - this.now) / 0.25;
      this.vm.group.rotation.x = -Math.sin(k * Math.PI) * 1.2;
      this.vm.group.rotation.z = -Math.sin(k * Math.PI) * 0.5;
    } else {
      this.vm.group.rotation.z = 0;
    }
    // 换弹动画（手模下沉）
    if (c.alive && c.weapon.reloadEnd > 0) {
      const w = c.weapon;
      if (this.now >= w.reloadEnd) {
        const need = w.def.magSize - w.mag;
        const take = Math.min(need, w.reserve);
        w.mag += take;
        w.reserve -= take;
        w.reloadEnd = 0;
        audio.weaponSwitch();
      } else {
        const k = 1 - (w.reloadEnd - this.now) / w.def.reloadTime;
        this.vm.group.position.y = -0.24 - Math.sin(k * Math.PI) * 0.15;
        this.vm.group.rotation.x = -Math.sin(k * Math.PI) * 0.8;
      }
    }
    if (c.alive) setViewModelWeapon(this.vm, c.weapon.def.id, c.team);
  }

  // ------------------------------------------------------------ 特效

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3, color: number) {
    const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    this.tracers.push({ line, dieAt: this.now + 0.07 });
  }

  private sparkGeo = new THREE.SphereGeometry(0.05, 6, 5);

  private spawnSpark(at: THREE.Vector3, color: number) {
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(this.sparkGeo, new THREE.MeshBasicMaterial({ color }));
      m.position.copy(at);
      const vel = new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 2.5, (Math.random() - 0.5) * 3);
      this.scene.add(m);
      this.sparks.push({ mesh: m, dieAt: this.now + 0.25, vel });
    }
  }

  private updateFx(dt: number) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      if (this.now >= t.dieAt) {
        this.scene.remove(t.line);
        t.line.geometry.dispose();
        (t.line.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      }
    }
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      if (this.now >= s.dieAt) {
        this.scene.remove(s.mesh);
        this.sparks.splice(i, 1);
      } else {
        s.vel.y -= 12 * dt;
        s.mesh.position.addScaledVector(s.vel, dt);
      }
    }
    // 枪口光衰减
    if (this.muzzle.intensity > 0) {
      this.muzzle.intensity = Math.max(0, this.muzzle.intensity - dt * 60);
    }
    // 爆炸扩散
    if (this.explosionMesh) {
      const k = (this.now - this.explosionT) / 1.2;
      if (k >= 1) {
        this.scene.remove(this.explosionMesh);
        this.explosionMesh = null;
      } else {
        const s = 2 + k * 26;
        this.explosionMesh.scale.setScalar(s);
        (this.explosionMesh.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - k);
      }
    }
  }

  // ------------------------------------------------------------ HUD 快照

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  };

  getSnapshot = (): HudSnapshot => this.snapshot;

  private buildSnapshot(): HudSnapshot {
    const c = this.controlled;
    const w = c.weapon;
    const aliveCT = this.entities.filter(e => e.team === 'CT' && e.alive).length;
    const aliveT = this.entities.filter(e => e.team === 'T' && e.alive).length;
    const canPlant = c.alive && c.team === 'T' && c.hasBomb &&
      (pointInRect(c.pos.x, c.pos.z, this.map.siteA) || pointInRect(c.pos.x, c.pos.z, this.map.siteB));
    const canDefuse = c.alive && c.team === 'CT' && this.bomb.state === 'planted' &&
      Math.hypot(c.pos.x - this.bomb.pos.x, c.pos.z - this.bomb.pos.z) < 2.2;

    let hint = '';
    if (c.alive && this.phase === 'live') {
      if (canPlant) hint = '按住 E 安放 C4';
      else if (canDefuse) hint = '按住 E 拆除 C4';
      else if (c.hasBomb) hint = '携带 C4：前往 A / B 点安放';
    }

    return {
      hp: Math.max(0, Math.round(c.hp)),
      armor: Math.max(0, Math.round(c.armor)),
      alive: c.alive,
      weaponName: w.def.name,
      mag: w.mag,
      reserve: w.reserve,
      reloading: w.reloadEnd > 0,
      slot: c.slot,
      hasPrimary: !!c.weapons[Slot.Primary],
      primaryName: c.weapons[Slot.Primary]?.def.name ?? '—',
      secondaryName: c.weapons[Slot.Secondary]?.def.name ?? '—',
      spreadPx: 8 + c.currentSpread() * 9,
      scoped: this.scoped,
      scoping: c.weapon.def.scope === true,
      round: this.round,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      phase: this.phase,
      timeLeft: this.phase === 'live'
        ? (this.bomb.state === 'planted' ? this.bomb.timer : Math.max(0, this.roundEndsAt - this.now))
        : Math.max(0, this.phaseEndsAt - this.now),
      phaseTimeLeft: Math.max(0, this.phaseEndsAt - this.now),
      kills: [...this.kills],
      feed: [...this.feed],
      hitAt: this.hitAt,
      hitHead: this.hitHead,
      bombState: this.bomb.state,
      bombTimer: Math.max(0, this.bomb.timer),
      plantT: this.bomb.plantT,
      defuseT: this.bomb.defuseT,
      planting: this.bomb.plantT > 0,
      defusing: this.bomb.defuseT > 0,
      banner: this.now < this.bannerUntil ? this.banner : '',
      bannerSub: this.now < this.bannerUntil ? this.bannerSub : '',
      bannerKind: this.bannerKind,
      spectating: !c.alive && this.spectating ? this.spectating.name : null,
      aliveCT, aliveT,
      playerTeam: this.playerTeam,
      paused: !this.pointerLocked,
      hint,
      hasBomb: c.hasBomb,
      canPlant, canDefuse,
      spectateList: this.entities.filter(e => e.team === c.team && e.alive && e !== c).map(e => e.name),
    };
  }
}
