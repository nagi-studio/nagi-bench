// ============================================================================
// 游戏引擎 —— 渲染循环 / 物理 / 战斗 / 回合 / C4 / 视角，所有系统在此整合
// ============================================================================
import * as THREE from 'three';
import { MAP, groundHeightAt, losBlocked, isPlantable, rayHitsAABB } from './map/dust2';
import { NavMesh } from './nav';
import { WEAPONS, DEFAULT_PISTOL, TEAM_RIFLE, BOT_T_NAMES, BOT_CT_NAMES, BUY_ITEMS } from './config';
import {
  EYE_STAND, EYE_CROUCH, PLAYER_RADIUS, MAX_STEP, GRAVITY, JUMP_VEL, RUN_SPEED, WALK_MUL, CROUCH_MUL,
  FOV_BASE, ROUND_TIME, FREEZE_TIME, FREEZE_TIME_FIRST, ROUND_END_DELAY, BOMB_TIMER, PLANT_TIME, DEFUSE_TIME,
  MATCH_WIN_ROUNDS, KILL_REWARD, WIN_REWARD, LOSS_REWARD_BASE, LOSS_REWARD_STEP, LOSS_REWARD_CAP,
  PLANT_REWARD, DEFUSE_REWARD, HITBOX_MULT, ARMOR_ABSORB, ARMOR_DRAIN, DOOR_PEN_MULT,
} from './types';
import type { HitRegion, Phase, Slot, Team, WeaponId, WeaponState, MinimapPlayer } from './types';
import { HudStore } from './store';
import { AudioEngine } from './audio';
import { Input } from './input';
import { BotAI } from './bots';
import { buildMapMeshes } from './render/mapRender';
import { buildCharacter, updateRig, setWeaponOnRig } from './render/characters';
import type { RigParts } from './render/characters';
import { buildViewModel } from './render/viewmodel';
import type { ViewModel } from './render/viewmodel';
import { Effects } from './render/effects';

export interface Ent {
  id: number;
  name: string;
  team: Team;
  isPlayer: boolean;
  controlled: boolean;
  isBot: boolean;
  alive: boolean;
  x: number; y: number; z: number;
  yaw: number; pitch: number; bodyYaw: number; spawnYaw: number;
  vx: number; vz: number; vy: number;
  grounded: boolean; crouch: boolean;
  hp: number; armor: number;
  money: number; kills: number; deaths: number;
  weapons: Partial<Record<Slot, WeaponState>>;
  currentSlot: Slot;
  deployT: number; reloadT: number; fireCd: number;
  bloom: number; recoil: number; recoilYaw: number;
  walkPhase: number; speedF: number; moving: number;
  deathT: number;
  lastDamageT: number;
  footstepT: number;
  hasBomb: boolean;
  zoomLevel: number;
  plantT: number;
  defuseT: number;
  attackT: number;
  aiMoveX: number; aiMoveZ: number;
  ai: BotAI | null;
  rig: RigParts | null;
  bombBack: THREE.Group | null;
  weaponSwitchT: number;
}

const V3A = new THREE.Vector3();
const V3B = new THREE.Vector3();

function eyeH(e: Ent): number { return e.crouch ? EYE_CROUCH : EYE_STAND; }

export class Game {
  // three
  renderer!: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  private viewModels = new Map<WeaponId, ViewModel>();
  private viewModel: ViewModel | null = null;
  effects!: Effects;
  private clock = new THREE.Clock();
  private raf = 0;
  private disposed = false;

  // logic
  nav = new NavMesh();
  audio = new AudioEngine();
  input = new Input();
  store = new HudStore();
  WEAPONS = WEAPONS;
  ents: Ent[] = [];
  selfTeam: Team = 'CT';
  playerEnt: Ent | null = null;
  controlled: Ent | null = null;
  time = 0;
  phase: Phase = 'menu';
  private phaseT = 0;
  round = 0;
  private roundTimeLeft = ROUND_TIME;
  scores = { t: 0, ct: 0 };
  private lossStreak = { T: 0, CT: 0 };
  private matchWinner: Team | null = null;

  // C4
  bombState: 'none' | 'carried' | 'dropped' | 'planted' = 'none';
  bombPos: [number, number] = [0, 0];
  private bombTimer = BOMB_TIMER;
  private bombCarrier: Ent | null = null;
  private nextBeep = 0;
  private bombModel: THREE.Group | null = null;
  private bombLight: THREE.PointLight | null = null;

  // AI 战术
  tStrategy = { site: 'A' as 'A' | 'B', spotIdx: 0, members: [] as number[] };
  ctAssign = new Map<number, string>();
  lastSeenBy = new Map<number, number>();
  heardShot: [number, number] | null = null;
  lastBotFired = false;
  private skillByEnt = new Map<number, number>();

  // 视角
  private spectateIdx = 0;
  private spectateList: Ent[] = [];
  private menuT = 0;
  private fov = FOV_BASE;
  private shakeT = 0;
  private shakeAmp = 0;

  // HUD 节流
  private hudT = 0;
  private bannerUntil = 0;
  private killId = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.camera = new THREE.PerspectiveCamera(FOV_BASE, 1, 0.05, 400);
    this.camera.rotation.order = 'YXZ';
  }

  initScene() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer = renderer;
    this.scene.background = new THREE.Color(0x9fc0d8);
    this.scene.fog = new THREE.Fog(0x9fc0d8, 40, 130);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    const hemi = new THREE.HemisphereLight(0xfff4dd, 0x8a7a58, 1.15);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff1d0, 1.35);
    sun.position.set(46, 80, 26);
    this.scene.add(sun);

    buildMapMeshes(this.scene);
    this.effects = new Effects(this.scene);

    // 炸弹模型
    this.bombModel = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.44), new THREE.MeshLambertMaterial({ color: 0x3a3f34 }));
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.1), new THREE.MeshLambertMaterial({ color: 0x555c50 }));
    panel.position.set(0, 0.1, 0);
    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff2222 }),
    );
    light.position.set(0.1, 0.02, 0.12);
    this.bombModel.add(body, panel, light);
    this.bombModel.visible = false;
    this.scene.add(this.bombModel);
    this.bombLight = new THREE.PointLight(0xff2020, 0, 6, 2);
    this.bombModel.add(this.bombLight);

    window.addEventListener('resize', this.onResize);
    document.addEventListener('pointerlockchange', this.onLockChange);
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private onLockChange = () => {
    const locked = document.pointerLockElement === this.canvas;
    this.store.mutate((s) => { s.lockHint = !locked && this.phase === 'live' && !!this.controlled && this.controlled.alive; });
    if (locked && this.phase === 'live') this.input.endFrame();
  };

  // ================= 匹配 / 实体 =================
  startMatch(team: Team) {
    this.selfTeam = team;
    this.audio.init();
    this.store.mutate((s) => { s.buyOpen = false; s.banner = null; });
    this.scores = { t: 0, ct: 0 };
    this.lossStreak = { T: 0, CT: 0 };
    this.matchWinner = null;
    this.round = 0;
    this.ents = [];
    this.skillByEnt.clear();
    const tNames = [...BOT_T_NAMES];
    const ctNames = [...BOT_CT_NAMES];
    let id = 0;
    const make = (name: string, t: Team, isPlayer: boolean): Ent => {
      const e: Ent = {
        id: id++, name, team: t, isPlayer, controlled: false, isBot: !isPlayer,
        alive: true, x: 0, y: 0, z: 0, yaw: 0, pitch: 0, bodyYaw: 0, spawnYaw: 0,
        vx: 0, vz: 0, vy: 0, grounded: true, crouch: false,
        hp: 100, armor: 0, money: 800, kills: 0, deaths: 0,
        weapons: {}, currentSlot: 1,
        deployT: 0, reloadT: 0, fireCd: 0, bloom: 0, recoil: 0, recoilYaw: 0,
        walkPhase: 0, speedF: 0, moving: 0, deathT: -1, lastDamageT: -10,
        footstepT: 0, hasBomb: false, zoomLevel: 0, plantT: 0, defuseT: 0, attackT: 0,
        aiMoveX: 0, aiMoveZ: 0,
        ai: null, rig: null, bombBack: null, weaponSwitchT: 0,
      };
      this.ents.push(e);
      return e;
    };
    // 玩家 + 队友
    const player = make('你', team, true);
    const myBots = (team === 'T' ? tNames : ctNames).slice(0, 4);
    for (const n of myBots) make(n, team, false);
    const enemyNames = team === 'T' ? ctNames : tNames;
    for (const n of enemyNames.slice(0, 5)) make(n, team === 'T' ? 'CT' : 'T', false);
    this.playerEnt = player;
    this.controlled = player;
    for (const e of this.ents) {
      if (e.isBot) {
        const skill = 0.35 + Math.random() * 0.6;
        this.skillByEnt.set(e.id, skill);
        e.ai = new BotAI(skill);
      }
      this.giveDefaultWeapons(e);
      e.rig = buildCharacter(e.team, e.name);
      this.scene.add(e.rig.root);
    }
    this.spectateIdx = 0;
    this.spectateList = [];
    this.resetRound(true);
    this.phase = 'freeze';
    this.phaseT = FREEZE_TIME_FIRST;
    this.requestLock();
    this.startLoop();
  }

  private giveDefaultWeapons(e: Ent) {
    const pistol = DEFAULT_PISTOL[e.team];
    e.weapons = {
      1: undefined,
      2: { def: WEAPONS[pistol], mag: WEAPONS[pistol].mag, reserve: WEAPONS[pistol].reserve },
      3: { def: WEAPONS.knife, mag: 1, reserve: 0 },
    };
    e.currentSlot = 2;
    e.weaponSwitchT = 0;
  }

  private requestLock() {
    try { this.canvas.requestPointerLock(); } catch { /* ignore */ }
  }

  lockPointer() {
    if (this.phase === 'live' || this.phase === 'freeze') this.requestLock();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.input.detach(this.canvas);
    this.renderer.dispose();
  }

  // ================= 主循环 =================
  private startLoop() {
    if (this.raf) return;
    this.clock.start();
    const loop = () => {
      if (this.disposed) return;
      const dt = Math.min(0.05, this.clock.getDelta());
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private update(dt: number) {
    this.time += dt;
    this.effects.update(dt);
    this.updatePhase(dt);

    if (this.phase === 'live') {
      this.updateInputs(dt);
      this.updateBots(dt);
      this.updateBomb(dt);
    }
    // 物理（所有存活的，包括 freeze 时的下落）
    this.separateEntities();
    for (const e of this.ents) {
      if (!e.alive) continue;
      this.physics(e, dt);
      this.updateWeaponTimers(e, dt);
    }
    this.updateRigs(dt);
    this.updateViewmodel(dt);
    this.updateCamera(dt);
    this.updateBombModel(dt);
    this.updateAudio(dt);

    // HUD
    this.hudT -= dt;
    if (this.hudT <= 0) {
      this.hudT = 0.05;
      this.syncHud();
    }
    this.input.endFrame();
    this.lastBotFired = false;
    this.heardShot = null;
  }

  private updatePhase(dt: number) {
    if (this.phase === 'freeze') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) {
        this.phase = 'live';
        this.roundTimeLeft = ROUND_TIME;
        this.store.mutate((s) => { s.buyOpen = false; });
        this.audio.roundStart();
        this.setBanner(`第 ${this.round} 回合开始`, this.round === 1 ? '手枪局：只有默认手枪' : this.selfTeam === 'T' ? '你是 T —— 进攻方' : '你是 CT —— 防守方');
        this.requestLock();
      }
    } else if (this.phase === 'live') {
      this.roundTimeLeft -= dt;
      if (this.roundTimeLeft <= 0) {
        this.roundTimeLeft = 0;
        this.endRound(this.bombState === 'planted' ? 'T' : 'CT', '时间耗尽');
      }
    } else if (this.phase === 'ended') {
      this.phaseT -= dt;
      if (this.phaseT <= 0) {
        if (this.matchWinner) {
          this.phase = 'matchover';
        } else {
          this.resetRound(false);
          this.phase = 'freeze';
          this.phaseT = FREEZE_TIME;
        }
      }
    }
  }

  private resetRound(first: boolean) {
    if (first) this.round = 0;
    this.round++;
    const pistol = this.round === 1;
    // 清除尸体
    for (const e of this.ents) {
      if (e.rig) {
        this.scene.remove(e.rig.root);
        e.rig = null;
      }
      if (e.bombBack) e.bombBack = null;
    }
    // 出生
    const tSpawns = MAP.spawns.T;
    const ctSpawns = MAP.spawns.CT;
    let ti = 0, ci = 0;
    const myBots = this.ents.filter((e) => e.isBot && e.team === this.selfTeam);
    const enemyBots = this.ents.filter((e) => e.isBot && e.team !== this.selfTeam);
    const orderT = [this.playerEnt?.team === 'T' ? this.playerEnt : null, ...myBots.filter((b) => b.team === 'T')];
    for (const e of orderT) {
      if (!e) continue;
      this.spawnEntity(e, tSpawns[ti % tSpawns.length], 0);
      ti++;
    }
    const orderCT = [this.playerEnt?.team === 'CT' ? this.playerEnt : null, ...myBots.filter((b) => b.team === 'CT')];
    for (const e of orderCT) {
      if (!e) continue;
      this.spawnEntity(e, ctSpawns[ci % ctSpawns.length], Math.PI);
      ci++;
    }
    for (const e of [...myBots.filter((b) => b.team === 'T'), ...enemyBots.filter((b) => b.team === 'T')]) {
      if (e.rig) continue; // 已出生
      this.spawnEntity(e, tSpawns[ti % tSpawns.length], 0);
      ti++;
    }
    for (const e of [...myBots.filter((b) => b.team === 'CT'), ...enemyBots.filter((b) => b.team === 'CT')]) {
      if (e.rig) continue;
      this.spawnEntity(e, ctSpawns[ci % ctSpawns.length], Math.PI);
      ci++;
    }
    // 武器：手枪局给默认手枪；非手枪局按购买
    for (const e of this.ents) {
      if (pistol) {
        this.giveDefaultWeapons(e);
        e.armor = 0;
      } else {
        this.refillAmmo(e);
        if (e.isBot) this.botBuy(e);
      }
    }
    // C4 分配
    const ts = this.ents.filter((e) => e.team === 'T' && e.alive);
    for (const e of this.ents) {
      e.hasBomb = false;
      delete e.weapons[5];
      if (e.currentSlot === 5) { e.currentSlot = 2; }
    }
    if (ts.length) {
      const carrier = ts[Math.floor(Math.random() * ts.length)];
      carrier.hasBomb = true;
      this.bombCarrier = carrier;
      this.bombState = 'carried';
      this.bombModel!.visible = false;
      this.updateBombBack(carrier);
    }
    // 战术
    this.tStrategy.site = Math.random() < 0.55 ? 'A' : 'B';
    this.tStrategy.spotIdx = Math.floor(Math.random() * MAP.plantSpots[this.tStrategy.site].length);
    const carrier = this.bombCarrier;
    const members = ts.map((e) => e.id);
    members.sort((a, b2) => (a === carrier?.id ? -1 : b2 === carrier?.id ? 1 : Math.random() - 0.5));
    this.tStrategy.members = members;
    const ctBots = this.ents.filter((e) => e.team === 'CT' && e.isBot);
    const roles = ['a1', 'a2', 'b1', 'b2', 'mid'];
    this.ctAssign.clear();
    const shuffled = ctBots.map((e) => e.id).sort(() => Math.random() - 0.5);
    shuffled.forEach((id, i) => this.ctAssign.set(id, roles[i % roles.length]));
    // AI 重置
    for (const e of this.ents) {
      if (e.ai) e.ai.reset();
    }
    // 视角回到玩家
    for (const e of this.ents) e.controlled = false;
    this.playerEnt!.controlled = true;
    this.controlled = this.playerEnt;
    this.syncViewmodel(this.playerEnt!);
    this.spectateIdx = 0;
    this.spectateList = [];
    this.bombTimer = BOMB_TIMER;
    this.nextBeep = 0;
    this.lastSeenBy.clear();
    this.effects.clear();
    this.setBanner(
      pistol ? '手枪局' : `第 ${this.round} 回合`,
      pistol ? '全员默认手枪 · 无护甲 · 无主武器' : '冻结时间内按 B 购买装备',
    );
  }

  private spawnEntity(e: Ent, spawn: [number, number], yaw: number) {
    e.alive = true;
    e.hp = 100;
    e.x = spawn[0];
    e.z = spawn[1];
    e.y = groundHeightAt(e.x, e.z);
    e.yaw = yaw;
    e.pitch = 0;
    e.bodyYaw = yaw;
    e.spawnYaw = yaw;
    e.vx = 0; e.vz = 0; e.vy = 0;
    e.grounded = true;
    e.crouch = false;
    e.deathT = -1;
    e.deployT = 0.2;
    e.reloadT = 0;
    e.fireCd = 0;
    e.bloom = 0;
    e.recoil = 0;
    e.recoilYaw = 0;
    e.zoomLevel = 0;
    e.plantT = 0;
    e.defuseT = 0;
    e.attackT = 0;
    e.weaponSwitchT = 0;
    e.hasBomb = false;
    if (!e.rig) {
      e.rig = buildCharacter(e.team, e.name);
      this.scene.add(e.rig.root);
    }
    setWeaponOnRig(e.rig, e.weapons[e.currentSlot]?.def.id || 'glock');
    e.rig.root.position.set(e.x, e.y, e.z);
    this.updateBombBack(e);
  }

  private refillAmmo(e: Ent) {
    for (const slot of [1, 2, 3] as Slot[]) {
      const w = e.weapons[slot];
      if (!w) continue;
      const total = w.mag + w.reserve;
      w.mag = Math.min(w.def.mag, total);
      w.reserve = total - w.mag;
    }
  }

  private updateBombBack(e: Ent) {
    if (e.bombBack) {
      e.rig!.root.remove(e.bombBack);
      e.bombBack = null;
    }
    if (e.hasBomb && e.rig) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.4), new THREE.MeshLambertMaterial({ color: 0x3a3f34 }));
      g.add(body);
      g.position.set(0, 1.25, -0.3);
      e.rig.root.add(g);
      e.bombBack = g;
      e.weapons[5] = { def: WEAPONS.c4, mag: 1, reserve: 0 };
    } else {
      delete e.weapons[5];
      if (e.currentSlot === 5) {
        e.currentSlot = 2;
        e.deployT = 0.3;
        e.weaponSwitchT = 0.3;
        if (e.controlled) this.syncViewmodel(e);
      }
    }
  }

  // ================= 玩家输入 =================
  private updateInputs(dt: number) {
    const c = this.controlled;
    const locked = document.pointerLockElement === this.canvas;
    if (!c || !c.alive) {
      this.handleDeadInput(dt);
      return;
    }
    // 购买菜单
    if (this.input.pressed('KeyB')) {
      if (this.phase === 'freeze') this.toggleBuy();
    }
    if (this.store.getSnapshot().buyOpen) return;

    const inp = this.input;
    // 记分板
    const tabDown = inp.down('Tab');
    const s0 = this.store.getSnapshot();
    if (tabDown !== s0.scoreboard) {
      this.store.mutate((s) => { s.scoreboard = tabDown; });
    }
    if (!locked) return;

    // 视角
    const sens = 0.0021 * (this.fov / FOV_BASE);
    c.yaw -= inp.mouseDX * sens;
    c.pitch -= inp.mouseDY * sens;
    c.pitch = Math.max(-1.45, Math.min(1.45, c.pitch));

    // 移动
    const fwd = inp.down('KeyW') ? 1 : 0;
    const back = inp.down('KeyS') ? 1 : 0;
    const left = inp.down('KeyA') ? 1 : 0;
    const right = inp.down('KeyD') ? 1 : 0;
    const walk = inp.down('ShiftLeft', 'ShiftRight');
    const crouch = inp.down('ControlLeft', 'KeyC');
    c.crouch = crouch;
    const fx = -(fwd - back);
    const rx = right - left;
    const forwardX = -Math.sin(c.yaw), forwardZ = -Math.cos(c.yaw);
    const rightX = Math.cos(c.yaw), rightZ = -Math.sin(c.yaw);
    let mx = forwardX * fx + rightX * rx;
    let mz = forwardZ * fx + rightZ * rx;
    const ml = Math.hypot(mx, mz);
    if (ml > 0.01) { mx /= ml; mz /= ml; }
    const speed = this.runSpeed(c) * (walk ? WALK_MUL : 1) * (crouch ? CROUCH_MUL : 1);
    this.applyMove(c, mx, mz, speed, dt);

    // 跳跃
    if (inp.pressed('Space') && c.grounded) {
      c.vy = JUMP_VEL;
      c.grounded = false;
      this.audio.jump();
    }

    // 武器切换
    if (inp.pressed('Digit1')) this.switchWeapon(c, 1);
    if (inp.pressed('Digit2')) this.switchWeapon(c, 2);
    if (inp.pressed('Digit3')) this.switchWeapon(c, 3);
    if (inp.pressed('Digit5')) if (c.hasBomb) this.switchWeapon(c, 5);
    // 换弹
    if (inp.pressed('KeyR')) this.startReload(c);
    // 丢包
    if (inp.pressed('KeyG') && c.hasBomb) this.dropBomb(c);

    const def = c.weapons[c.currentSlot]?.def;
    if (def) {
      // 开火 / 下包 / 拆包
      if (def.id === 'c4') {
        if (inp.mouseDown && this.bombState === 'carried' && c.hasBomb && this.siteAt(c.x, c.z) && !c.crouch) {
          c.plantT += dt;
          if (c.plantT >= PLANT_TIME) this.plantBomb(c);
        } else {
          c.plantT = Math.max(0, c.plantT - dt * 2);
        }
      } else if (def.id === 'knife') {
        if (inp.justClicked) this.knifeAttack(c, 40);
        if (inp.pressed('Mouse2')) { if (c.fireCd <= 0) this.knifeAttack(c, 65); }
      } else if (def.auto) {
        if (inp.mouseDown) this.tryFire(c, true);
      } else {
        if (inp.justClicked) this.tryFire(c, true);
      }
      // AWP 开镜（右键）
      if (def.id === 'awp' && inp.pressed('Mouse2')) {
        c.zoomLevel = (c.zoomLevel + 1) % (def.zoomFovs.length + 1);
        this.audio.zoom(c.zoomLevel > 0);
      }
      // 拆包（按住 E）
      if (c.team === 'CT' && this.bombState === 'planted') {
        const d = Math.hypot(this.bombPos[0] - c.x, this.bombPos[1] - c.z);
        if (d < 2.3 && inp.down('KeyE')) {
          c.defuseT += dt;
          if (c.defuseT >= DEFUSE_TIME) this.defused(c);
        } else {
          c.defuseT = 0;
        }
      }
    }
    // 玩家索敌（小地图）
    this.perceiveByEnt(c);
  }

  private handleDeadInput(_dt: number) {
    const inp = this.input;
    if (this.phase !== 'live') return;
    if (this.spectateList.length > 0 && (inp.justClicked || inp.pressed('Space'))) {
      this.spectateIdx = (this.spectateIdx + 1) % this.spectateList.length;
      this.syncHudNow();
    }
    if (inp.pressed('KeyE')) {
      this.takeover();
    }
  }

  private perceiveByEnt(viewer: Ent) {
    for (const o of this.ents) {
      if (!o.alive || o.team === this.selfTeam) continue;
      if (this.visibleTo(viewer, o)) this.lastSeenBy.set(o.id, this.time);
    }
  }

  // ================= 武器系统 =================
  switchWeapon(e: Ent, slot: Slot) {
    const w = e.weapons[slot];
    if (!w) return;
    if (e.currentSlot === slot) return;
    e.currentSlot = slot;
    e.deployT = w.def.deployTime;
    e.reloadT = 0;
    e.weaponSwitchT = 0.32;
    if (e.controlled) {
      this.syncViewmodel(e);
      this.audio.deploy();
    }
    if (e.rig) setWeaponOnRig(e.rig, w.def.id);
    this.syncHudNow();
  }

  startReload(e: Ent) {
    const w = e.weapons[e.currentSlot];
    if (!w || w.def.slot === 3 || w.def.id === 'c4') return;
    if (e.reloadT > 0 || w.mag >= w.def.mag || w.reserve <= 0) return;
    e.reloadT = w.def.reloadTime;
    if (e.controlled || e === this.playerEnt) this.audio.reload();
    else if (this.distToListener(e) < 18) this.audio.reload();
  }

  private updateWeaponTimers(e: Ent, dt: number) {
    e.deployT = Math.max(0, e.deployT - dt);
    e.fireCd = Math.max(0, e.fireCd - dt);
    e.attackT = Math.max(0, e.attackT - dt);
    e.bloom = Math.max(0, e.bloom - (e.weapons[e.currentSlot]?.def.bloomRecovery || 0.2) * dt);
    e.recoil = Math.max(0, e.recoil - dt * 0.09);
    e.recoilYaw *= Math.max(0, 1 - dt * 8);
    if (e.reloadT > 0) {
      e.reloadT -= dt;
      if (e.reloadT <= 0) {
        const w = e.weapons[e.currentSlot];
        if (w) {
          const need = w.def.mag - w.mag;
          const take = Math.min(need, w.reserve);
          w.mag += take;
          w.reserve -= take;
        }
        if (e.controlled) this.syncHudNow();
      }
    }
  }

  private tryFire(e: Ent, isPlayer: boolean): boolean {
    const w = e.weapons[e.currentSlot];
    if (!w || w.def.slot === 3 || w.def.id === 'c4') return false;
    if (e.deployT > 0 || e.reloadT > 0 || e.fireCd > 0) return false;
    if (w.mag <= 0) {
      this.startReload(e);
      return false;
    }
    const def = w.def;
    // 散布
    let spread = def.baseSpread + e.bloom;
    const spd = Math.hypot(e.vx, e.vz);
    spread += def.moveSpread * Math.min(1, spd / RUN_SPEED);
    if (e.crouch) spread *= def.crouchSpreadMul;
    if (def.id === 'awp') {
      if (e.zoomLevel > 0) spread = def.zoomSpread + def.moveSpread * Math.min(1, spd / RUN_SPEED) * 2;
      else spread = def.baseSpread;
    }
    // 后坐与弹道
    const yawJ = (Math.random() - 0.5) * 2 * spread;
    const pitchJ = (Math.random() - 0.5) * 2 * spread;
    const dirX = -Math.sin(e.yaw + yawJ) * Math.cos(e.pitch + pitchJ);
    const dirY = Math.sin(e.pitch + pitchJ);
    const dirZ = -Math.cos(e.yaw + yawJ) * Math.cos(e.pitch + pitchJ);
    const ox = e.x, oy = e.y + eyeH(e) - (e.crouch ? 0 : 0), oz = e.z;

    const hit = this.castRay(ox, oy, oz, dirX, dirY, dirZ, e, 200);

    // 特效 + 声音
    const end = hit.point;
    const muzzle = new THREE.Vector3(ox, oy - 0.12, oz).addScaledVector(new THREE.Vector3(dirX, dirY, dirZ), 0.5);
    this.effects.tracer(V3A.copy(muzzle), V3B.copy(end));
    this.effects.flash(muzzle, new THREE.Vector3(dirX, dirY, dirZ));
    const pan = this.panTo(e);
    const dist = this.distToListener(e);
    this.audio.shot(def.id, pan, dist);
    this.heardShot = [e.x, e.z];

    if (hit.ent) {
      const dmg = def.damage * HITBOX_MULT[hit.region!] * hit.pen;
      this.applyDamage(hit.ent, dmg, hit.region!, e, def);
      this.effects.blood(end, hit.region === 'head' ? 6 : 4);
      if (isPlayer && e.controlled) {
        this.store.mutate((s) => { s.hitmarker = performance.now(); });
        this.audio.hit(hit.ent!.armor > 0, hit.region === 'head');
      }
    } else {
      this.effects.sparks(end, 5);
    }

    // 后坐力
    e.recoil = Math.min(0.5, e.recoil + (def.recoilPitch * Math.PI) / 180);
    e.recoilYaw += (Math.random() - 0.5) * 2 * (def.recoilYaw * Math.PI) / 180;
    e.bloom = Math.min(def.bloomMax, e.bloom + def.bloomPerShot);
    w.mag--;
    e.fireCd = 60 / def.rpm;
    if (isPlayer && e.controlled) this.syncHudNow();
    if (w.mag <= 0 && e.isBot) this.startReload(e);
    return true;
  }

  private knifeAttack(e: Ent, dmg: number) {
    const w = e.weapons[e.currentSlot];
    if (!w || w.def.id !== 'knife') return;
    e.attackT = 0.3;
    e.fireCd = 0.66;
    const def = w.def;
    const dirX = -Math.sin(e.yaw) * Math.cos(e.pitch);
    const dirY = Math.sin(e.pitch);
    const dirZ = -Math.cos(e.yaw) * Math.cos(e.pitch);
    const hit = this.castRay(e.x, e.y + eyeH(e), e.z, dirX, dirY, dirZ, e, def.range + 0.4, true);
    this.audio.shot('knife', this.panTo(e), this.distToListener(e));
    if (hit.ent) {
      this.applyDamage(hit.ent, dmg, 'chest', e, def);
      this.effects.blood(hit.point, 3);
      if (e.controlled) {
        this.store.mutate((s) => { s.hitmarker = performance.now(); });
      }
    }
  }

  /** 射线命中：实体 Hitbox 优先，其次墙体/地板，门体穿透（门后实体不受衰减） */
  private castRay(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, shooter: Ent, maxDist: number, melee = false):
    { ent: Ent | null; region: HitRegion | null; point: THREE.Vector3; pen: number } {
    // 1) 最近实心体
    let solidT = Infinity;
    for (const b of MAP.colliders) {
      const tt = rayHitsAABB(ox, oy, oz, dx, dy, dz, b, maxDist);
      if (tt !== null && tt < solidT) solidT = tt;
    }
    for (const b of MAP.floorBoxes) {
      const tt = rayHitsAABB(ox, oy, oz, dx, dy, dz, b, maxDist);
      if (tt !== null && tt < solidT) solidT = tt;
    }
    // 2) 第一扇门距离（近战视为实心）
    let firstDoorT = Infinity;
    for (const b of MAP.doors) {
      const tt = rayHitsAABB(ox, oy, oz, dx, dy, dz, b, maxDist);
      if (tt !== null && tt < firstDoorT) firstDoorT = tt;
    }
    // 3) 实体命中
    const limit = melee ? Math.min(solidT, firstDoorT) : solidT;
    let hitEnt: Ent | null = null;
    let hitRegion: HitRegion | null = null;
    let entT = Infinity;
    for (const o of this.ents) {
      if (!o.alive || o === shooter || o.team === shooter.team) continue;
      const res = this.rayVsBody(ox, oy, oz, dx, dy, dz, o, limit);
      if (res && res.t < entT) {
        entT = res.t;
        hitEnt = o;
        hitRegion = res.region;
      }
    }
    // 4) 穿透衰减：只统计在命中点之前的门
    let pen = 1;
    if (!melee) {
      const stopT = Math.min(solidT, entT);
      let t = 0;
      let guard = 0;
      for (;;) {
        if (guard++ > 3) break;
        let doorT = Infinity;
        for (const b of MAP.doors) {
          const tt = rayHitsAABB(ox, oy, oz, dx, dy, dz, b, maxDist);
          if (tt !== null && tt > t + 1e-4 && tt < doorT) doorT = tt;
        }
        if (doorT < stopT) {
          t = doorT;
          pen *= DOOR_PEN_MULT;
          continue;
        }
        break;
      }
    }
    const stopT = Math.min(solidT, maxDist);
    const worldPoint = new THREE.Vector3(ox + dx * stopT, oy + dy * stopT, oz + dz * stopT);
    if (hitEnt) {
      return { ent: hitEnt, region: hitRegion, point: new THREE.Vector3(ox + dx * entT, oy + dy * entT, oz + dz * entT), pen };
    }
    return { ent: null, region: null, point: worldPoint, pen };
  }

  /** 射线 vs 角色分区 Hitbox（头部球 + 胸/腹/臂/腿盒，随身体朝向旋转） */
  private rayVsBody(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, e: Ent, maxDist: number):
    { t: number; region: HitRegion } | null {
    const cy = -e.bodyYaw;
    const cos = Math.cos(cy), sin = Math.sin(cy);
    const rx = ox - e.x, rz = oz - e.z;
    const lx = rx * cos - rz * sin;
    const lz = rx * sin + rz * cos;
    const ly = oy - e.y;
    const ldx = dx * cos - dz * sin;
    const ldz = dx * sin + dz * cos;
    const s = e.crouch ? 0.78 : 1;
    let bestT = Infinity;
    let bestRegion: HitRegion | null = null;
    const consider = (t: number, region: HitRegion) => {
      if (t > 0 && t < bestT && t < maxDist) { bestT = t; bestRegion = region; }
    };
    // 头（球）
    const hc = new THREE.Vector3(0, 1.55 * s, 0);
    const oc = new THREE.Vector3(lx - hc.x, ly - hc.y, lz - hc.z);
    const dd = new THREE.Vector3(ldx, dy, ldz);
    const r = 0.15;
    const b2 = oc.dot(dd);
    const c2 = oc.dot(oc) - r * r;
    const disc = b2 * b2 - c2;
    if (disc >= 0) {
      const t1 = -b2 - Math.sqrt(disc);
      consider(t1, 'head');
    }
    // 盒体
    const boxes: [number, number, number, number, number, number, HitRegion][] = [
      [0, 1.28 * s, 0, 0.19, 0.16, 0.13, 'chest'],
      [0, 1.02 * s, 0, 0.19, 0.12, 0.13, 'abdomen'],
      [-0.27, 1.18 * s, 0, 0.07, 0.24, 0.08, 'arm'],
      [0.27, 1.18 * s, 0, 0.07, 0.24, 0.08, 'arm'],
      [-0.11, 0.55 * s, 0, 0.09, 0.42, 0.11, 'leg'],
      [0.11, 0.55 * s, 0, 0.09, 0.42, 0.11, 'leg'],
    ];
    for (const [bx, by, bz, hx, hy, hz, region] of boxes) {
      const t = this.rayBox(lx, ly, lz, ldx, dy, ldz, bx - hx, by - hy, bz - hz, bx + hx, by + hy, bz + hz);
      if (t !== null) consider(t, region);
    }
    return bestRegion ? { t: bestT, region: bestRegion } : null;
  }

  private rayBox(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number,
    minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): number | null {
    return rayHitsAABB(ox, oy, oz, dx, dy, dz, { minX, maxX, minY, maxY, minZ, maxZ }, 400);
  }

  // ================= 伤害 / 击杀 =================
  applyDamage(target: Ent, dmg: number, region: HitRegion, attacker: Ent | null, weapon?: { killName: string }) {
    if (!target.alive || this.phase !== 'live') return;
    let d = dmg;
    if (target.armor > 0) {
      target.armor = Math.max(0, target.armor - d * ARMOR_DRAIN);
      d *= ARMOR_ABSORB;
    }
    target.hp -= d;
    target.lastDamageT = this.time;
    if (target.controlled) {
      this.shakeT = 0.25;
      this.shakeAmp = Math.min(1, d / 30) * 0.06;
      this.store.mutate((s) => {
        s.damageFlash = performance.now();
        if (attacker) {
          const ang = Math.atan2(attacker.x - target.x, attacker.z - target.z);
          s.damageDir = ang;
        }
      });
      this.audio.damaged();
    }
    if (target.hp <= 0) {
      this.kill(target, attacker, weapon?.killName || '击杀', region === 'head');
    }
  }

  private kill(victim: Ent, killer: Ent | null, weaponName: string, hs: boolean) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.deathT = 0;
    victim.deaths++;
    victim.defuseT = 0;
    victim.plantT = 0;
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.updateBombBack(victim);
      this.bombCarrier = null;
      this.bombState = 'dropped';
      this.bombPos = [victim.x, victim.z];
    }
    if (killer && killer.team !== victim.team) {
      killer.kills++;
      killer.money += KILL_REWARD;
    }
    const kName = killer ? killer.name : '';
    const entry = { id: ++this.killId, time: this.time, killer: kName, victim: victim.name, weapon: weaponName, hs };
    this.store.mutate((s) => {
      s.killfeed.push(entry);
      if (s.killfeed.length > 5) s.killfeed.shift();
    });
    if (victim.controlled || (killer && killer.controlled)) {
      this.audio.killConfirm();
    }
    if (victim.controlled) {
      this.enterSpectate();
    }
    if (victim.rig) {
      // 尸体保留，回合结束时清除
      victim.rig.shadow.visible = false;
    }
    this.checkRoundEnd();
  }

  private checkRoundEnd() {
    if (this.phase !== 'live') return;
    const tAlive = this.ents.some((e) => e.alive && e.team === 'T');
    const ctAlive = this.ents.some((e) => e.alive && e.team === 'CT');
    if (!ctAlive) {
      // T 清空 CT → T 胜（无论是否已下包）
      this.endRound('T', 'CT 全灭');
    } else if (!tAlive) {
      if (this.bombState !== 'planted') this.endRound('CT', 'T 全灭');
      // 炸弹已下：CT 仍需拆包，回合继续
    }
  }

  endRound(winner: Team, reason: string) {
    if (this.phase !== 'live') return;
    this.phase = 'ended';
    this.phaseT = ROUND_END_DELAY;
    if (winner === 'T') { this.scores.t++; this.lossStreak.CT++; this.lossStreak.T = 0; }
    else { this.scores.ct++; this.lossStreak.T++; this.lossStreak.CT = 0; }
    const winText = winner === this.selfTeam ? '胜利' : '失败';
    this.setBanner(`${winner === 'T' ? 'T' : 'CT'} 阵营胜 · ${reason}`, this.selfTeam === winner ? '你的阵营赢了这一回合' : '你的阵营输了这一回合');
    this.audio.roundWin(this.selfTeam === winner);
    for (const e of this.ents) {
      const lossStreak = winner === 'T' ? this.lossStreak.CT : this.lossStreak.T;
      if (e.team === winner) e.money += WIN_REWARD;
      else e.money += Math.min(LOSS_REWARD_CAP, LOSS_REWARD_BASE + LOSS_REWARD_STEP * Math.max(0, lossStreak - 1));
    }
    if (this.scores.t >= MATCH_WIN_ROUNDS || this.scores.ct >= MATCH_WIN_ROUNDS) {
      this.matchWinner = this.scores.t >= MATCH_WIN_ROUNDS ? 'T' : 'CT';
      this.setBanner(`比赛结束 · ${this.matchWinner === 'T' ? 'T' : 'CT'} 阵营获胜 ${this.scores.t} : ${this.scores.ct}`, '');
    }
    // 结束阶段让剩余玩家自由视角（无输入即可）
  }

  // ================= C4 =================
  private updateBomb(dt: number) {
    if (this.bombState === 'planted') {
      this.bombTimer -= dt;
      this.nextBeep -= dt;
      if (this.nextBeep <= 0) {
        const frac = Math.max(0, this.bombTimer / BOMB_TIMER);
        this.nextBeep = 0.1 + 1.15 * Math.pow(frac, 1.6);
        this.audio.plantTick();
      }
      if (this.bombTimer <= 0) {
        this.explode();
      }
    }
  }

  private plantBomb(c: Ent) {
    this.bombState = 'planted';
    c.hasBomb = false;
    c.plantT = 0;
    this.updateBombBack(c);
    this.bombCarrier = null;
    this.bombPos = [c.x, c.z];
    this.bombTimer = BOMB_TIMER;
    this.nextBeep = 0.2;
    c.money += PLANT_REWARD;
    this.audio.plant();
    this.setBanner('C4 已安放', 'CT 快去拆包！');
    // T 全部转防守
    for (const e of this.ents) {
      if (e.team === 'T' && e.isBot && e.ai) {
        e.ai.defendPos = [c.x + 3, c.z];
        e.ai.state = 'hold';
      }
    }
    this.syncHudNow();
  }

  private defused(c: Ent) {
    this.audio.defuseDone();
    c.money += DEFUSE_REWARD;
    this.endRound('CT', '拆弹成功');
  }

  private explode() {
    this.bombState = 'planted';
    this.bombModel!.visible = false;
    const bx = this.bombPos[0], bz = this.bombPos[1];
    this.effects.explode(new THREE.Vector3(bx, 1.2, bz));
    this.audio.explosion(this.panToPoint(bx, bz), Math.hypot(bx - (this.controlled?.x || 0), bz - (this.controlled?.z || 0)));
    if (this.controlled) this.shakeT = 0.6;
    this.shakeAmp = 0.12;
    for (const e of this.ents) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - bx, e.z - bz);
      if (d < 16) this.kill(e, null, 'C4', false);
      else if (d < 30) this.applyDamage(e, 100 * (1 - (d - 16) / 14), 'chest', null);
    }
    this.endRound('T', 'C4 爆炸');
  }

  private dropBomb(e: Ent) {
    if (!e.hasBomb) return;
    e.hasBomb = false;
    this.updateBombBack(e);
    this.bombCarrier = null;
    this.bombState = 'dropped';
    this.bombPos = [e.x, e.z];
  }

  private updateBombModel(dt: number) {
    const m = this.bombModel!;
    if (this.bombState === 'dropped' || this.bombState === 'planted') {
      m.visible = true;
      const gh = groundHeightAt(this.bombPos[0], this.bombPos[1]);
      m.position.set(this.bombPos[0], Math.max(0, gh) + (this.bombState === 'planted' ? 0.14 : 0.3), this.bombPos[1]);
      m.rotation.y += dt * 1.2;
      if (this.bombState === 'planted') {
        const frac = Math.max(0, this.bombTimer / BOMB_TIMER);
        this.bombLight!.intensity = 2.5 + 3 * (1 - frac);
        this.bombLight!.color.setHSL(0.02, 1, 0.5);
      } else {
        this.bombLight!.intensity = 1.2;
        this.bombLight!.color.setHSL(0.06, 1, 0.55);
      }
    } else if (this.bombState === 'carried') {
      m.visible = false;
    } else {
      m.visible = false;
    }
  }

  // ================= 物理 =================
  runSpeed(e: Ent): number {
    const w = e.weapons[e.currentSlot]?.def;
    return RUN_SPEED * (w ? w.moveSpeedMul : 1);
  }

  applyMove(e: Ent, mx: number, mz: number, speed: number, dt: number) {
    const accel = e.grounded ? 70 : 14;
    e.vx += (mx * speed - e.vx) * Math.min(1, accel * dt);
    e.vz += (mz * speed - e.vz) * Math.min(1, accel * dt);
  }

  aiMoveTo(e: Ent, mx: number, mz: number, speed: number, dt: number) {
    this.applyMove(e, mx, mz, speed, dt);
  }

  private physics(e: Ent, dt: number) {
    // 非战斗阶段：所有实体减速停住
    if (this.phase !== 'live') {
      e.vx *= Math.max(0, 1 - 10 * dt);
      e.vz *= Math.max(0, 1 - 10 * dt);
    }
    // 水平移动（子步碰撞）
    const moveX = e.vx * dt;
    const moveZ = e.vz * dt;
    const dist = Math.hypot(moveX, moveZ);
    if (dist > 0.0001) {
      const steps = Math.max(1, Math.ceil(dist / 0.3));
      for (let i = 0; i < steps; i++) {
        e.x += moveX / steps;
        e.z += moveZ / steps;
        this.collideWorld(e);
      }
    }
    // 垂直
    const gh = groundHeightAt(e.x, e.z);
    if (e.grounded) {
      if (gh > -1e8) {
        if (gh - e.y > MAX_STEP) {
          // 台阶太高（理论上被墙挡住）：回退
          e.x -= moveX;
          e.z -= moveZ;
          e.vx *= 0.4;
          e.vz *= 0.4;
        } else if (e.y < gh - 0.03) {
          e.y = gh;
        } else if (e.y > gh + 0.03) {
          // 下坡：小落差贴地，大落差坠落
          if (e.y - gh <= MAX_STEP) {
            e.y = gh;
          } else {
            e.grounded = false;
            e.vy = 0;
          }
        }
      } else {
        e.grounded = false;
        e.vy = 0;
      }
    }
    if (!e.grounded) {
      e.vy -= GRAVITY * dt;
      e.y += e.vy * dt;
      const gh2 = groundHeightAt(e.x, e.z);
      if (gh2 > -1e8 && e.y <= gh2) {
        const fallSpeed = -e.vy;
        if (fallSpeed > 9.5) {
          this.applyDamage(e, (fallSpeed - 9.5) * 14, 'leg', null);
        }
        if (e.y < gh2 - 1.2) {
          // 掉进虚空缝隙：安全传送回出生区
          if (e.y < -8) { this.kill(e, null, '坠落', false); return; }
        }
        e.y = gh2;
        e.vy = 0;
        e.grounded = true;
        if (fallSpeed > 4 && (e.controlled || this.distToListener(e) < 14)) this.audio.land();
      } else if (e.y < -10) {
        this.kill(e, null, '坠落', false);
        return;
      }
    }
    // 拾取 C4
    if (this.bombState === 'dropped' && e.alive && e.team === 'T' && !this.bombCarrier) {
      const d = Math.hypot(this.bombPos[0] - e.x, this.bombPos[1] - e.z);
      if (d < 1.1) {
        e.hasBomb = true;
        this.bombCarrier = e;
        this.bombState = 'carried';
        this.updateBombBack(e);
        if (e.controlled) this.audio.pickup();
      }
    }
    // 步态
    const spd = Math.hypot(e.vx, e.vz);
    e.speedF = Math.min(1, spd / RUN_SPEED);
    e.moving = e.grounded && spd > 0.4 ? e.speedF : 0;
    if (e.moving > 0.1) e.walkPhase += dt * (6 + spd * 5);
  }

  private collideWorld(e: Ent) {
    const r = PLAYER_RADIUS;
    for (let pass = 0; pass < 2; pass++) {
      for (const b of MAP.colliders) {
        // 仅考虑与脚部高度相交的碰撞体
        if (b.minY > e.y + 1.7 || b.maxY < e.y + 0.15) continue;
        const cx = Math.max(b.minX, Math.min(e.x, b.maxX));
        const cz = Math.max(b.minZ, Math.min(e.z, b.maxZ));
        const dx = e.x - cx;
        const dz = e.z - cz;
        const d2 = dx * dx + dz * dz;
        if (d2 < r * r) {
          if (d2 < 1e-9) {
            // 中心在箱内：优先向有可站立地面的方向推出
            const candidates: [number, number][] = [
              [b.minX - r - 0.02, e.z],
              [b.maxX + r + 0.02, e.z],
              [e.x, b.minZ - r - 0.02],
              [e.x, b.maxZ + r + 0.02],
            ];
            let best: [number, number] | null = null;
            let bestD = Infinity;
            for (const [cx2, cz2] of candidates) {
              const gh = groundHeightAt(cx2, cz2);
              const ok = gh > -1e8 && Math.abs(gh - e.y) <= MAX_STEP + 0.1;
              const dd = (cx2 - e.x) * (cx2 - e.x) + (cz2 - e.z) * (cz2 - e.z);
              if (ok && dd < bestD) { bestD = dd; best = [cx2, cz2]; }
            }
            if (best) { e.x = best[0]; e.z = best[1]; }
            else {
              const px = Math.min(e.x - b.minX, b.maxX - e.x);
              const pz = Math.min(e.z - b.minZ, b.maxZ - e.z);
              if (px < pz) e.x = e.x - b.minX < b.maxX - e.x ? b.minX - r : b.maxX + r;
              else e.z = e.z - b.minZ < b.maxZ - e.z ? b.minZ - r : b.maxZ + r;
            }
          } else {
            const d = Math.sqrt(d2);
            const push = (r - d) / d;
            e.x += dx * push;
            e.z += dz * push;
          }
        }
      }
    }
  }

  private separateEntities() {
    for (let i = 0; i < this.ents.length; i++) {
      const a = this.ents[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < this.ents.length; j++) {
        const b = this.ents[j];
        if (!b.alive) continue;
        const dx = b.x - a.x, dz = b.z - a.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.62 && d > 0.0001) {
          const push = (0.62 - d) / 2;
          const nx = dx / d, nz = dz / d;
          a.x -= nx * push;
          a.z -= nz * push;
          b.x += nx * push;
          b.z += nz * push;
        }
      }
    }
  }

  // ================= AI =================
  private updateBots(dt: number) {
    // 炸弹掉落引导
    if (this.bombState === 'dropped') {
      for (const e of this.ents) {
        if (!e.alive || e.team !== 'T' || e.isPlayer || e.hasBomb) continue;
        if (e.ai && (e.ai.state === 'goto' || e.ai.state === 'hold')) {
          const d = Math.hypot(this.bombPos[0] - e.x, this.bombPos[1] - e.z);
          if (d > 1.2 && this.time - (e.ai as BotAI & { lastBombGo?: number }).lastBombGo! > 1.2) {
            (e.ai as BotAI & { lastBombGo?: number }).lastBombGo = this.time;
            e.ai.goto(this, e, [this.bombPos[0], this.bombPos[1]]);
          }
        }
      }
    }
    for (const e of this.ents) {
      if (!e.isBot || !e.ai || !e.alive || e.controlled) continue;
      e.ai.update(dt, this, e);
      // AI 移动方向已在 ai 内写入 aiMoveX/Z？由 followPath 调用 aiMoveTo —— 但 combat 也直接调 aiMoveTo ✓
    }
  }

  botTryFire(e: Ent, extraErr: number, _dt: number) {
    const w = e.weapons[e.currentSlot];
    if (!w) { this.lastBotFired = false; return; }
    if (w.def.id === 'knife') {
      // 贴脸才用刀
      const t = e.ai?.target;
      if (t && Math.hypot(t.x - e.x, t.z - e.z) < 1.8 && e.fireCd <= 0) {
        this.knifeAttack(e, 40);
        this.lastBotFired = true;
      }
      return;
    }
    if (w.def.id === 'c4') { this.lastBotFired = false; return; }
    // 注入瞄准误差
    const jitterY = (Math.random() - 0.5) * 2 * extraErr;
    const jitterP = (Math.random() - 0.5) * 2 * extraErr * 0.7;
    const saveYaw = e.yaw, savePitch = e.pitch;
    e.yaw += jitterY;
    e.pitch += jitterP;
    const fired = this.tryFire(e, false);
    e.yaw = saveYaw;
    e.pitch = savePitch;
    this.lastBotFired = fired;
  }

  botPlant(e: Ent, dt: number) {
    if (this.bombState !== 'carried' || !e.hasBomb) return;
    e.plantT += dt;
    if (e.plantT >= PLANT_TIME) this.plantBomb(e);
  }

  botDefuse(e: Ent, dt: number) {
    if (this.bombState !== 'planted') return;
    e.defuseT += dt;
    if (e.defuseT >= DEFUSE_TIME) this.defused(e);
  }

  visibleTo(a: Ent, b: Ent): boolean {
    if (!a.alive || !b.alive) return false;
    const ax = a.x, ay = a.y + eyeH(a), az = a.z;
    const bx = b.x, by = b.y + (b.crouch ? EYE_CROUCH : EYE_STAND), bz = b.z;
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const d = Math.hypot(dx, dz);
    if (d > 62) return false;
    // FOV
    const fwdX = -Math.sin(a.yaw), fwdZ = -Math.cos(a.yaw);
    const dot = (dx / (d + 1e-6)) * fwdX + (dz / (d + 1e-6)) * fwdZ;
    if (dot < 0.42) return false;
    if (losBlocked(ax, ay, az, bx, by, bz)) return false;
    return true;
  }

  // ================= 视角 =================
  private enterSpectate() {
    this.spectateList = this.ents.filter((e) => e.alive && e.team === this.selfTeam);
    this.spectateIdx = 0;
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    this.syncHudNow();
  }

  takeover() {
    if (this.spectateList.length === 0) return;
    const target = this.spectateList[this.spectateIdx % this.spectateList.length];
    if (!target || !target.alive || !target.isBot) return;
    if (this.controlled) this.controlled.controlled = false;
    this.controlled = target;
    target.controlled = true;
    this.spectateList = [];
    this.requestLock();
    this.syncViewmodel(target);
    this.syncHudNow();
    this.setBanner(`已接管 ${target.name}`, '');
  }

  private updateCamera(dt: number) {
    const c = this.controlled;
    if (this.phase === 'menu' || this.phase === 'matchover') {
      this.menuT += dt;
      const cx = 27, cz = -19;
      const ang = this.menuT * 0.12;
      this.camera.position.set(cx + Math.cos(ang) * 26, 16 + Math.sin(this.menuT * 0.4) * 3, cz + Math.sin(ang) * 26);
      this.camera.lookAt(cx, 2, cz);
      this.fov = FOV_BASE;
      this.camera.fov = FOV_BASE;
      this.camera.updateProjectionMatrix();
      return;
    }
    if (c && c.alive) {
      // 目标 FOV（AWP 开镜）
      const w = c.weapons[c.currentSlot]?.def;
      const zoomFov = w && c.zoomLevel > 0 ? w.zoomFovs[Math.min(c.zoomLevel, w.zoomFovs.length) - 1] : FOV_BASE;
      this.fov += (zoomFov - this.fov) * Math.min(1, dt * 11);
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
      const pitch = c.pitch + c.recoil;
      this.camera.position.set(
        c.x + (Math.random() - 0.5) * this.shakeAmp * this.shakeT * 10,
        c.y + eyeH(c) + (Math.random() - 0.5) * this.shakeAmp * this.shakeT * 10,
        c.z + (Math.random() - 0.5) * this.shakeAmp * this.shakeT * 10,
      );
      this.camera.rotation.set(pitch, c.yaw + c.recoilYaw, 0);
    } else if (this.spectateList.length > 0) {
      const t = this.spectateList[this.spectateIdx % this.spectateList.length];
      if (t && t.alive) {
        this.fov = FOV_BASE;
        this.camera.fov = FOV_BASE;
        this.camera.updateProjectionMatrix();
        this.camera.position.set(t.x, t.y + eyeH(t), t.z);
        this.camera.rotation.set(t.pitch, t.yaw, 0);
      }
    }
    this.shakeT = Math.max(0, this.shakeT - dt);
  }

  // ================= 渲染角色 / 视角模型 =================
  private updateRigs(dt: number) {
    const t = this.time;
    for (const e of this.ents) {
      if (!e.rig) continue;
      if (e.alive) {
        e.rig.root.position.set(e.x, e.y, e.z);
        updateRig(e.rig, e.bodyYaw, e.pitch, e.walkPhase, e.speedF, e.crouch, -1, t);
        // 阴影贴地
        const gh = groundHeightAt(e.x, e.z);
        e.rig.shadow.position.y = Math.max(0, gh) - e.y + 0.02;
      } else {
        e.deathT += dt;
        updateRig(e.rig, e.bodyYaw, e.pitch, 0, 0, false, e.deathT, t);
      }
      // 名牌朝向相机
      e.rig.namePlane.quaternion.copy(this.camera.quaternion);
    }
    // 已安放炸弹处阴影（用炸弹模型即可）
  }

  syncViewmodel(e: Ent) {
    const id = e.weapons[e.currentSlot]?.def.id;
    if (!id) return;
    let vm = this.viewModels.get(id);
    if (!vm) {
      vm = buildViewModel(id, e.team);
      this.viewModels.set(id, vm);
    }
    if (this.viewModel !== vm) {
      if (this.viewModel) this.camera.remove(this.viewModel.group);
      this.viewModel = vm;
      this.camera.add(vm.group);
      vm.group.position.set(0.21, -0.2, -0.42);
    }
  }

  private updateViewmodel(dt: number) {
    if (!this.viewModel) return;
    const c = this.controlled;
    if (!c || !c.alive) { this.viewModel.group.visible = false; return; }
    const w = c.weapons[c.currentSlot]?.def;
    const zoomed = !!w && w.id === 'awp' && c.zoomLevel > 0;
    this.viewModel.update(
      dt, c.moving, c.reloadT > 0, c.reloadT, c.weaponSwitchT > 0, c.weaponSwitchT, this.time, zoomed, c.attackT > 0 ? 1 - c.attackT / 0.3 : 0,
    );
    c.weaponSwitchT = Math.max(0, c.weaponSwitchT - dt);
  }

  // ================= 音频 =================
  private distToListener(e: Ent): number {
    const c = this.controlled && this.controlled.alive ? this.controlled : null;
    if (!c) return 40;
    return Math.hypot(e.x - c.x, e.z - c.z);
  }

  private panTo(e: Ent): number {
    const c = this.controlled && this.controlled.alive ? this.controlled : null;
    if (!c) return 0;
    return this.panToPoint(e.x, e.z);
  }

  private panToPoint(x: number, z: number): number {
    const c = this.controlled && this.controlled.alive ? this.controlled : null;
    if (!c) return 0;
    const dx = x - c.x, dz = z - c.z;
    const d = Math.hypot(dx, dz) + 1e-6;
    const rightX = Math.cos(c.yaw), rightZ = -Math.sin(c.yaw);
    return (dx * rightX + dz * rightZ) / d;
  }

  private updateAudio(dt: number) {
    for (const e of this.ents) {
      if (!e.alive) continue;
      const spd = Math.hypot(e.vx, e.vz);
      if (e.grounded && spd > 0.5) {
        e.footstepT -= dt;
        if (e.footstepT <= 0) {
          e.footstepT = spd > RUN_SPEED * 0.7 ? 0.42 : 0.56;
          const dist = this.distToListener(e);
          if (dist < 30) this.audio.footstep(spd > RUN_SPEED * 0.7, this.panTo(e), dist);
        }
      }
    }
  }

  // ================= HUD 同步 =================
  setBanner(text: string, sub: string) {
    this.bannerUntil = this.time + 3.2;
    this.store.mutate((s) => { s.banner = { text, sub }; });
  }

  private syncHudNow() {
    this.hudT = 0;
    this.syncHud();
  }

  private syncHud() {
    const c = this.controlled;
    const w = c?.weapons[c?.currentSlot ?? 2];
    const spectateTarget = !c || !c.alive
      ? this.spectateList[this.spectateIdx % Math.max(1, this.spectateList.length)]
      : null;
    const players: MinimapPlayer[] = this.ents.map((e) => ({
      name: e.name,
      team: e.team,
      alive: e.alive,
      x: e.x, z: e.z, yaw: e.yaw,
      visible: e.team === this.selfTeam || (this.lastSeenBy.get(e.id) || 0) > this.time - 2.2,
      isSelf: e === c || e === this.playerEnt,
      isSpectate: e === spectateTarget,
      isCarrier: e.hasBomb,
    }));
    const zoomed = !!w && w.def.id === 'awp' && c!.zoomLevel > 0;
    let crosshairGap = 6;
    if (c && w) {
      const spd = Math.hypot(c.vx, c.vz);
      crosshairGap = 5 + c.bloom * 1100 + w.def.moveSpread * Math.min(1, spd / RUN_SPEED) * 2600;
    }
    this.store.mutate((s) => {
      s.phase = this.phase;
      s.phaseTimeLeft = this.phase === 'freeze' ? Math.ceil(this.phaseT) : 0;
      s.round = this.round;
      s.roundTimeLeft = Math.max(0, Math.ceil(this.roundTimeLeft));
      s.bombState = this.bombState;
      s.bombTimer = this.bombState === 'planted' ? Math.max(0, this.bombTimer) : 0;
      s.bombCarrierTeam = this.bombCarrier ? this.bombCarrier.team : null;
      s.bombWorld = this.bombState === 'dropped' || this.bombState === 'planted' ? { x: this.bombPos[0], z: this.bombPos[1] } : null;
      s.self = {
        team: this.selfTeam,
        alive: !!c && c.alive,
        hp: c ? Math.max(0, Math.round(c.hp)) : 0,
        armor: c ? Math.round(c.armor) : 0,
        weaponName: w ? w.def.name : '',
        slot: c ? c.currentSlot : 0,
        mag: w ? w.mag : 0,
        reserve: w ? w.reserve : 0,
        hasPrimary: !!c?.weapons[1],
        hasBomb: !!c?.hasBomb,
        money: c ? c.money : 0,
        zoomed,
        zoomLevel: c ? c.zoomLevel : 0,
        crosshairGap: Math.round(crosshairGap),
        reloading: !!c && c.reloadT > 0,
      };
      s.spectating = spectateTarget ? { name: spectateTarget.name, team: spectateTarget.team, hp: Math.round(spectateTarget.hp) } : null;
      s.killfeed = s.killfeed.filter((k) => this.time - k.time < 5.5);
      s.scores = { t: this.scores.t, ct: this.scores.ct };
      if (this.bannerUntil < this.time && s.banner) s.banner = null;
      s.players = players;
      s.pistolRound = this.round === 1;
      s.matchWinner = this.matchWinner;
      s.defusing = c && c.defuseT > 0 ? c.defuseT / DEFUSE_TIME : 0;
      s.planting = c && c.plantT > 0 ? c.plantT / PLANT_TIME : 0;
      s.lockHint = this.phase === 'live' && !!c && c.alive && document.pointerLockElement !== this.canvas && !s.buyOpen;
      if (this.phase !== 'live' || s.buyOpen) s.scoreboard = false;
    });
  }

  // ================= 购买系统 =================
  toggleBuy() {
    const s = this.store.getSnapshot();
    const c = this.controlled;
    if (this.phase !== 'freeze' || !c || !c.alive || this.round === 1) return;
    const open = !s.buyOpen;
    this.store.mutate((st) => { st.buyOpen = open; });
    if (open) {
      if (document.pointerLockElement === this.canvas) document.exitPointerLock();
      this.audio.ui();
    } else {
      this.requestLock();
    }
  }

  buyItem(itemId: string): boolean {
    const c = this.controlled;
    if (!c || !c.alive || this.phase !== 'freeze' || this.round === 1) return false;
    const item = BUY_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;
    if (c.money < item.price) return false;
    if (item.kind === 'armor') {
      if (c.armor >= 100) return false;
      c.money -= item.price;
      c.armor = 100;
    } else {
      const def = WEAPONS[item.weapon!];
      if (def.team !== 'both' && def.team !== c.team) return false;
      const slot = def.slot as Slot;
      const owned = c.weapons[slot];
      if (owned && owned.def.id === def.id) {
        // 补满备弹
        c.money -= item.price;
        owned.mag = def.mag;
        owned.reserve = def.reserve;
      } else {
        c.money -= item.price;
        c.weapons[slot] = { def, mag: def.mag, reserve: def.reserve };
        if (c.currentSlot !== slot && slot === 1) this.switchWeapon(c, 1);
        else if (c.currentSlot === slot && c.controlled) {
          this.syncViewmodel(c);
          if (c.rig) setWeaponOnRig(c.rig, def.id);
        }
      }
    }
    this.audio.ui();
    this.syncHudNow();
    return true;
  }

  private botBuy(e: Ent) {
    const rifle = TEAM_RIFLE[e.team];
    const rifleDef = WEAPONS[rifle];
    if (e.money >= rifleDef.price + 400) {
      if (!e.weapons[1] || e.weapons[1]!.def.id !== rifle) {
        e.money -= rifleDef.price;
        e.weapons[1] = { def: rifleDef, mag: rifleDef.mag, reserve: rifleDef.reserve };
      }
      if (e.money >= 1000 && e.armor < 100) { e.money -= 1000; e.armor = 100; }
      // 富余时偶尔起 AWP
      if (e.money >= 4800 && Math.random() < 0.2) {
        e.money -= WEAPONS.awp.price;
        e.weapons[1] = { def: WEAPONS.awp, mag: 5, reserve: 30 };
      }
    } else if (e.money >= 1750) {
      if (!e.weapons[2] || e.weapons[2]!.def.id !== 'deagle') {
        e.money -= WEAPONS.deagle.price;
        e.weapons[2] = { def: WEAPONS.deagle, mag: 7, reserve: 35 };
      }
      if (e.armor < 100 && e.money >= 1000) { e.money -= 1000; e.armor = 100; }
    } else if (e.money >= 1000) {
      if (e.armor < 100) { e.money -= 1000; e.armor = 100; }
    }
    this.refillAmmo(e);
  }

  siteAt(x: number, z: number): 'A' | 'B' | null {
    return isPlantable(x, z);
  }

  // ================= 外部查询（小地图等） =================
  /** 调试/测试：手动推进一帧（绕过 rAF 限速） */
  step(dt: number) {
    this.update(dt);
  }

  getMinimapStatic() {
    return {
      bounds: MAP.bounds,
      flats: MAP.flats,
      wallLines: MAP.wallLines,
      sites: MAP.sites,
    };
  }

  restartMatch() {
    // 回到菜单（重新选择阵营）
    this.phase = 'menu';
    this.matchWinner = null;
    this.spectateList = [];
    if (this.viewModel) { this.camera.remove(this.viewModel.group); this.viewModel = null; }
    for (const e of this.ents) {
      if (e.rig) { this.scene.remove(e.rig.root); e.rig = null; }
    }
    this.ents = [];
    this.bombState = 'none';
    this.bombModel!.visible = false;
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    this.syncHudNow();
  }
}
