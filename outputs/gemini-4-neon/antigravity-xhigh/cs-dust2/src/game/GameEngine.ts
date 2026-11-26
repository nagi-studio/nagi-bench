import * as THREE from 'three';
import {
  BombState,
  GameMode,
  HitboxZone,
  HudSnapshot,
  KillfeedEntry,
  MinimapActor,
  RoundPhase,
  ScoreboardAgent,
  Team,
  Vec3,
  WeaponAmmoState,
  WeaponId,
  WeaponSlot,
} from './types';
import { buildDust2Map, Dust2MapData, getCalloutAt } from './dust2Map';
import {
  EYE_HEIGHT_CROUCH,
  EYE_HEIGHT_STAND,
  getSupportFloorY,
  hasLineOfSight,
  JUMP_VELOCITY,
  PhysicsBody,
  raycastMap,
  stepPhysicsBody,
} from './physics';
import {
  calculateHitDamage,
  getDefaultPistolForTeam,
  getDefaultRifleForTeam,
  WEAPONS,
} from './weapons';
import { raycastCharacterHitboxes } from './hitboxes';
import { HumanoidCharacterRig } from './characterMesh';
import { FirstPersonViewmodel } from './viewmodel';
import { Dust2NavGraph } from './navgraph';
import { AIActorView, BotBrain, RoundTacticsContext } from './ai';
import { ProceduralAudioEngine } from './audio';
import { EffectsManager } from './effects';

const FIXED_DT = 1 / 60;
const BASE_MOVE_SPEED = 5.9;
const WALK_MULTIPLIER = 0.56;
const CROUCH_MULTIPLIER = 0.52;
const PLANT_DURATION = 3.2;
const DEFUSE_DURATION = 5.0;
const BOMB_FUSE_TIME = 40.0;
const ROUND_TIME = 115.0;
const FREEZE_TIME = 2.2;
const ROUND_END_DELAY = 4.4;

const CT_NAMES = ['Alpha', 'Bravo', 'Viper', 'Ghost', 'Sentinel'];
const T_NAMES = ['Kobra', 'Vandal', 'Reaper', 'Mirage', 'Jackal'];

interface Agent {
  id: string;
  name: string;
  team: Team;
  slotIndex: number;
  isHuman: boolean;
  alive: boolean;
  body: PhysicsBody;
  yaw: number;
  pitch: number;
  hp: number;
  armor: number;
  hasHelmet: boolean;
  money: number;
  kills: number;
  deaths: number;

  slots: {
    primary: WeaponId | null;
    secondary: WeaponId | null;
    melee: WeaponId;
    c4: boolean;
  };
  activeSlot: WeaponSlot;
  lastSlot: WeaponSlot;
  ammo: Partial<Record<WeaponId, WeaponAmmoState>>;

  fireCooldown: number;
  reloading: boolean;
  reloadTimer: number;
  recoilSpread: number;
  recoilKickPitch: number;
  shotCount: number;
  semiAutoLatch: boolean;
  stepAccum: number;
  spottedUntil: number;

  rig: HumanoidCharacterRig;
  brain: BotBrain;
}

export class Dust2GameEngine {
  private container: HTMLElement;
  private onHudUpdate: (snap: HudSnapshot) => void;

  public readonly mapData: Dust2MapData;
  private nav: Dust2NavGraph;
  private audio = new ProceduralAudioEngine();
  private effects = new EffectsManager();
  private viewmodel = new FirstPersonViewmodel();

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private agents: Agent[] = [];
  private controlledAgentId = '';
  private spectatedAgentId = '';
  private playerTeam: Team = 'CT';
  private gameMode: GameMode = 'standard';

  // Match & Round state
  private started = false;
  private paused = false;
  private pointerLocked = false;
  private buyMenuOpen = false;
  private scoreboardOpen = false;
  private roundNumber = 1;
  private roundPhase: RoundPhase = 'freezetime';
  private roundTimer = FREEZE_TIME;
  private scoreCT = 0;
  private scoreT = 0;
  private roundWinner: Team | null = null;
  private roundWinReason = '';
  private announcement = '';
  private announcementTimer = 0;

  // Bomb state
  private bombState: BombState = 'carried';
  private bombSite: 'A' | 'B' | null = null;
  private bombPos: Vec3 | null = null;
  private bombTimer = BOMB_FUSE_TIME;
  private bombBeepAccum = 0;
  private bombLedOn = false;
  private bombLedTimer = 0;
  private roundTargetSite: 'A' | 'B' = 'A';

  // Planting / Defusing state
  private activePlanterId: string | null = null;
  private plantProgress = 0;
  private plantKeySoundTimer = 0;
  private activeDefuserId: string | null = null;
  private defuseProgress = 0;

  // Player camera & feedback state
  private scopeLevel: 0 | 1 | 2 = 0;
  private unscopeBoltTimer = 0;
  private currentFov = 75;
  private cameraShake = 0;
  private hitmarkerTime = 0;
  private hitmarkerHeadshot = false;
  private hitmarkerKill = false;
  private damageIndicatorAngle: number | null = null;
  private damageIndicatorTimer = 0;
  private damageFlashAlpha = 0;
  private lastHitZone: HitboxZone | null = null;
  private lastHitDamage = 0;

  private killfeed: KillfeedEntry[] = [];
  private nextKillId = 1;

  // Settings
  private sensitivity = 1.0;
  private volume = 0.75;

  // Input state
  private keys = new Set<string>();
  private mouseLeftDown = false;
  private mouseRightClicked = false;

  // Loop timing
  private rafId = 0;
  private lastFrameTime = 0;
  private accumulator = 0;
  private elapsed = 0;
  private hudEmitAccum = 0;
  private disposed = false;

  constructor(container: HTMLElement, onHudUpdate: (snap: HudSnapshot) => void) {
    this.container = container;
    this.onHudUpdate = onHudUpdate;

    // Scene & warm desert atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xc9dced);
    this.scene.fog = new THREE.FogExp2(0xd8ccb5, 0.0068);

    // Camera
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.06, 260);
    this.camera.rotation.order = 'YXZ';
    this.camera.add(this.viewmodel.root);
    this.scene.add(this.camera);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Lighting: warm golden Moroccan sunlight + sky/sand bounce
    const hemi = new THREE.HemisphereLight(0xfff3dc, 0xb89668, 0.92);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff0d4, 1.85);
    sun.position.set(42, 68, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 175;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);

    const rimFill = new THREE.DirectionalLight(0x9bc4e8, 0.35);
    rimFill.position.set(-45, 30, -40);
    this.scene.add(rimFill);

    // Build Dust2 Map, NavGraph & Effects
    this.mapData = buildDust2Map();
    this.scene.add(this.mapData.group);
    this.scene.add(this.effects.group);
    this.nav = new Dust2NavGraph();

    this.createAgents();
    this.setupRound(true);
    this.bindEvents();

    this.lastFrameTime = performance.now();
    this.emitHudSnapshot();
    this.loop(this.lastFrameTime);
  }

  private createAgents(): void {
    // Clean old meshes if re-creating
    for (const a of this.agents) {
      this.scene.remove(a.rig.root);
    }
    this.agents = [];

    const makeAgent = (team: Team, idx: number, isHuman: boolean): Agent => {
      const id = `${team}_${idx}`;
      const names = team === 'CT' ? CT_NAMES : T_NAMES;
      const rig = new HumanoidCharacterRig(team);
      this.scene.add(rig.root);
      return {
        id,
        name: isHuman ? 'YOU' : names[idx],
        team,
        slotIndex: idx,
        isHuman,
        alive: true,
        body: {
          pos: { x: 0, y: 0, z: 0 },
          vel: { x: 0, y: 0, z: 0 },
          onGround: true,
          crouching: false,
        },
        yaw: 0,
        pitch: 0,
        hp: 100,
        armor: 100,
        hasHelmet: false,
        money: 800,
        kills: 0,
        deaths: 0,
        slots: {
          primary: null,
          secondary: getDefaultPistolForTeam(team),
          melee: 'knife',
          c4: false,
        },
        activeSlot: 'secondary',
        lastSlot: 'melee',
        ammo: {},
        fireCooldown: 0,
        reloading: false,
        reloadTimer: 0,
        recoilSpread: 0,
        recoilKickPitch: 0,
        shotCount: 0,
        semiAutoLatch: false,
        stepAccum: 0,
        spottedUntil: 0,
        rig,
        brain: new BotBrain(idx, team),
      };
    };

    for (let i = 0; i < 5; i++) {
      const ctHuman = this.playerTeam === 'CT' && i === 0;
      const a = makeAgent('CT', i, ctHuman);
      this.agents.push(a);
      if (ctHuman) this.controlledAgentId = a.id;
    }
    for (let i = 0; i < 5; i++) {
      const tHuman = this.playerTeam === 'T' && i === 0;
      const a = makeAgent('T', i, tHuman);
      this.agents.push(a);
      if (tHuman) this.controlledAgentId = a.id;
    }
    this.spectatedAgentId = this.controlledAgentId;
  }

  private isCurrentRoundPistol(): boolean {
    if (this.gameMode === 'pistol_only') return true;
    if (this.gameMode === 'full_buy') return false;
    return this.roundNumber === 1;
  }

  private initWeaponAmmo(agent: Agent, weaponId: WeaponId): void {
    const cfg = WEAPONS[weaponId];
    agent.ammo[weaponId] = { mag: cfg.magSize, reserve: cfg.reserveMax };
  }

  private setupRound(resetMatch = false): void {
    if (resetMatch) {
      this.roundNumber = 1;
      this.scoreCT = 0;
      this.scoreT = 0;
      this.killfeed = [];
      for (const a of this.agents) {
        a.kills = 0;
        a.deaths = 0;
      }
    }

    const pistolRound = this.isCurrentRoundPistol();
    this.roundPhase = 'freezetime';
    this.roundTimer = FREEZE_TIME;
    this.roundWinner = null;
    this.roundWinReason = '';
    this.scopeLevel = 0;
    this.unscopeBoltTimer = 0;
    this.activePlanterId = null;
    this.plantProgress = 0;
    this.activeDefuserId = null;
    this.defuseProgress = 0;
    this.effects.clearRoundDecals();

    // Reset human ownership back to original slot 0 agent
    for (const a of this.agents) {
      a.isHuman = a.team === this.playerTeam && a.slotIndex === 0;
      if (a.isHuman) {
        a.name = 'YOU';
        this.controlledAgentId = a.id;
        this.spectatedAgentId = a.id;
      } else {
        a.name = (a.team === 'CT' ? CT_NAMES : T_NAMES)[a.slotIndex];
      }
    }

    // Choose round target bombsite for T team AI
    this.roundTargetSite = Math.random() < 0.55 ? 'A' : 'B';

    // Select T bomb carrier (give player C4 on R1 if T, otherwise random T)
    const tAgents = this.agents.filter((a) => a.team === 'T');
    const bombCarrier =
      this.playerTeam === 'T' && this.roundNumber === 1
        ? tAgents[0]
        : tAgents[Math.floor(Math.random() * tAgents.length)];

    this.bombState = 'carried';
    this.bombSite = null;
    this.bombPos = null;
    this.bombTimer = BOMB_FUSE_TIME;
    this.bombBeepAccum = 0;

    // Equip and position all 10 agents
    for (const a of this.agents) {
      const spawns = a.team === 'CT' ? this.mapData.spawnsCT : this.mapData.spawnsT;
      const sp = spawns[a.slotIndex % spawns.length];
      a.alive = true;
      a.hp = 100;
      a.body.pos = { x: sp.x, y: sp.y, z: sp.z };
      a.body.vel = { x: 0, y: 0, z: 0 };
      a.body.onGround = true;
      a.body.crouching = false;
      // CT faces South (+Z => yaw = PI), T faces North (-Z => yaw = 0)
      a.yaw = a.team === 'CT' ? Math.PI : 0;
      a.pitch = 0;
      a.fireCooldown = 0;
      a.reloading = false;
      a.reloadTimer = 0;
      a.recoilSpread = 0;
      a.recoilKickPitch = 0;
      a.shotCount = 0;
      a.spottedUntil = 0;
      a.slots.c4 = a.id === bombCarrier.id;

      const defaultPistol = getDefaultPistolForTeam(a.team);
      a.ammo = {};

      if (pistolRound) {
        // Strict CS Pistol Round: ONLY default pistol + knife + Kevlar Vest (no helmet), NO primary
        a.armor = 100;
        a.hasHelmet = false;
        a.money = 800;
        a.slots.primary = null;
        a.slots.secondary = defaultPistol;
        this.initWeaponAmmo(a, defaultPistol);
        a.activeSlot = 'secondary';
        a.lastSlot = 'melee';
      } else {
        // Full-Buy Round: Kevlar + Helmet, primary rifle/AWP + pistol
        a.armor = 100;
        a.hasHelmet = true;
        a.money = Math.max(a.money, 10000);
        const primary: WeaponId =
          !a.isHuman && a.slotIndex === 2 ? 'awp' : getDefaultRifleForTeam(a.team);
        const secondary: WeaponId = !a.isHuman && a.slotIndex === 3 ? 'deagle' : defaultPistol;
        a.slots.primary = primary;
        a.slots.secondary = secondary;
        this.initWeaponAmmo(a, primary);
        this.initWeaponAmmo(a, secondary);
        a.activeSlot = 'primary';
        a.lastSlot = 'secondary';
      }

      a.rig.resetAlive();
      a.rig.setWeapon(this.getActiveWeaponId(a));
    }

    const tactics = this.getTacticsContext();
    for (const a of this.agents) {
      a.brain.resetForRound(tactics);
    }

    this.showAnnouncement(
      pistolRound
        ? `第 ${this.roundNumber} 回合 · 手枪局 (PISTOL ROUND)`
        : `第 ${this.roundNumber} 回合 · 全枪局 — 按 [B] 自由选枪`,
      3.0
    );

    const controlled = this.getViewedAgent();
    if (controlled) {
      this.viewmodel.setWeapon(this.getActiveWeaponId(controlled), controlled.team);
    }
    this.emitHudSnapshot();
  }

  private getTacticsContext(): RoundTacticsContext {
    // Pick nearest living CT to planted bomb as designated defuser
    let defuserId: string | null = null;
    if (this.bombState === 'planted' && this.bombPos) {
      let bestDist = Infinity;
      for (const a of this.agents) {
        if (!a.alive || a.team !== 'CT' || a.isHuman) continue;
        const d = Math.hypot(a.body.pos.x - this.bombPos.x, a.body.pos.z - this.bombPos.z);
        if (d < bestDist) {
          bestDist = d;
          defuserId = a.id;
        }
      }
    }
    return {
      targetSite: this.roundTargetSite,
      bombState: this.bombState,
      bombPos: this.bombPos,
      bombSite: this.bombSite,
      siteACenter: this.mapData.bombsites[0].center,
      siteBCenter: this.mapData.bombsites[1].center,
      defuserId,
    };
  }

  private getAgent(id: string): Agent | undefined {
    return this.agents.find((a) => a.id === id);
  }

  private getControlledAgent(): Agent | undefined {
    return this.getAgent(this.controlledAgentId);
  }

  private getViewedAgent(): Agent | undefined {
    const ctrl = this.getControlledAgent();
    if (ctrl && ctrl.alive) return ctrl;
    const spec = this.getAgent(this.spectatedAgentId);
    if (spec && spec.alive) return spec;
    const aliveMate = this.agents.find((a) => a.team === this.playerTeam && a.alive);
    if (aliveMate) {
      this.spectatedAgentId = aliveMate.id;
      return aliveMate;
    }
    return ctrl ?? this.agents[0];
  }

  private getActiveWeaponId(a: Agent): WeaponId {
    if (a.activeSlot === 'primary' && a.slots.primary) return a.slots.primary;
    if (a.activeSlot === 'secondary' && a.slots.secondary) return a.slots.secondary;
    if (a.activeSlot === 'c4' && a.slots.c4) return 'c4';
    return 'knife';
  }

  private switchSlot(a: Agent, slot: WeaponSlot): void {
    if (slot === 'primary' && !a.slots.primary) return;
    if (slot === 'secondary' && !a.slots.secondary) return;
    if (slot === 'c4' && !a.slots.c4) return;
    if (a.activeSlot === slot) return;

    a.lastSlot = a.activeSlot;
    a.activeSlot = slot;
    a.reloading = false;
    a.reloadTimer = 0;
    a.fireCooldown = Math.max(a.fireCooldown, 0.22);
    if (a.isHuman) {
      this.scopeLevel = 0;
      this.viewmodel.setWeapon(this.getActiveWeaponId(a), a.team);
    }
    a.rig.setWeapon(this.getActiveWeaponId(a));
  }

  private showAnnouncement(msg: string, duration = 2.8): void {
    this.announcement = msg;
    this.announcementTimer = duration;
  }

  // =========================================================================
  // PUBLIC API FOR REACT UI
  // =========================================================================
  public startGame(team: Team, mode: GameMode): void {
    this.audio.unlock();
    const needRecreate = this.playerTeam !== team;
    this.playerTeam = team;
    this.gameMode = mode;
    this.started = true;
    this.paused = false;
    this.buyMenuOpen = false;
    if (needRecreate) {
      this.createAgents();
    }
    this.setupRound(true);
    this.requestPointerLock();
  }

  public resumeGame(): void {
    this.audio.unlock();
    this.paused = false;
    this.buyMenuOpen = false;
    this.requestPointerLock();
    this.emitHudSnapshot();
  }

  public togglePause(): void {
    if (!this.started) return;
    this.paused = !this.paused;
    if (this.paused) {
      this.buyMenuOpen = false;
      this.exitPointerLock();
    } else {
      this.requestPointerLock();
    }
    this.emitHudSnapshot();
  }

  public setTeamAndRestart(team: Team): void {
    this.playerTeam = team;
    this.createAgents();
    this.setupRound(true);
    this.paused = false;
    this.buyMenuOpen = false;
    this.requestPointerLock();
  }

  public setGameModeAndRestart(mode: GameMode): void {
    this.gameMode = mode;
    this.setupRound(true);
    this.paused = false;
    this.buyMenuOpen = false;
    this.requestPointerLock();
  }

  public skipToFullBuyRound(): void {
    if (this.gameMode === 'pistol_only') {
      this.gameMode = 'standard';
    }
    this.roundNumber = Math.max(2, this.roundNumber + 1);
    this.setupRound(false);
    this.paused = false;
    this.buyMenuOpen = false;
    this.requestPointerLock();
  }

  public setSensitivity(s: number): void {
    this.sensitivity = Math.max(0.2, Math.min(3.0, s));
    this.emitHudSnapshot();
  }

  public setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    this.audio.setVolume(this.volume);
    this.emitHudSnapshot();
  }

  public closeBuyMenu(): void {
    this.buyMenuOpen = false;
    if (this.started && !this.paused) {
      this.requestPointerLock();
    }
    this.emitHudSnapshot();
  }

  public buyWeapon(weaponId: WeaponId): boolean {
    const a = this.getControlledAgent();
    if (!a || !a.alive) return false;
    const cfg = WEAPONS[weaponId];
    if (!cfg || cfg.slot === 'melee' || cfg.slot === 'c4') return false;

    const pistolRound = this.isCurrentRoundPistol();
    if (pistolRound && cfg.slot === 'primary') {
      this.showAnnouncement('手枪局禁止购买主武器！', 1.8);
      this.emitHudSnapshot();
      return false;
    }

    if (a.money < cfg.price) {
      this.showAnnouncement(`资金不足 ($${cfg.price})`, 1.6);
      this.emitHudSnapshot();
      return false;
    }

    a.money -= cfg.price;
    if (cfg.slot === 'primary') {
      a.slots.primary = weaponId;
      this.initWeaponAmmo(a, weaponId);
      this.switchSlot(a, 'primary');
    } else if (cfg.slot === 'secondary') {
      a.slots.secondary = weaponId;
      this.initWeaponAmmo(a, weaponId);
      this.switchSlot(a, 'secondary');
    }

    this.audio.playReload();
    this.showAnnouncement(`已装备 ${cfg.name}`, 1.4);
    this.emitHudSnapshot();
    return true;
  }

  public buyArmor(withHelmet: boolean): boolean {
    const a = this.getControlledAgent();
    if (!a || !a.alive) return false;
    if (this.isCurrentRoundPistol() && withHelmet) {
      this.showAnnouncement('手枪局护甲配置为防弹衣（无头盔）', 1.8);
      return false;
    }
    const cost = withHelmet ? 1000 : 650;
    if (a.money < cost) {
      this.showAnnouncement('资金不足', 1.4);
      return false;
    }
    a.money -= cost;
    a.armor = 100;
    if (withHelmet) a.hasHelmet = true;
    this.emitHudSnapshot();
    return true;
  }

  public takeoverSpectatedBot(): boolean {
    const ctrl = this.getControlledAgent();
    if (!ctrl || ctrl.alive) return false;
    const spec = this.getAgent(this.spectatedAgentId);
    if (!spec || !spec.alive || spec.team !== this.playerTeam) return false;

    ctrl.isHuman = false;
    spec.isHuman = true;
    const oldBotName = spec.name;
    spec.name = `YOU (${oldBotName})`;
    this.controlledAgentId = spec.id;
    this.scopeLevel = 0;
    this.viewmodel.setWeapon(this.getActiveWeaponId(spec), spec.team);
    this.showAnnouncement(`已接管存活队友 ${oldBotName}！`, 2.2);
    this.emitHudSnapshot();
    return true;
  }

  public cycleSpectator(dir: 1 | -1): void {
    const aliveMates = this.agents.filter((a) => a.team === this.playerTeam && a.alive);
    if (aliveMates.length === 0) return;
    const idx = aliveMates.findIndex((a) => a.id === this.spectatedAgentId);
    const next = aliveMates[(idx + dir + aliveMates.length) % aliveMates.length];
    this.spectatedAgentId = next.id;
    this.viewmodel.setWeapon(this.getActiveWeaponId(next), next.team);
    this.emitHudSnapshot();
  }

  public requestPointerLock(): void {
    const el = this.renderer.domElement;
    if (document.pointerLockElement !== el && el.requestPointerLock) {
      try {
        el.requestPointerLock();
      } catch {
        // Ignore browser rejections when not triggered by user gesture
      }
    }
  }

  private exitPointerLock(): void {
    if (document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================
  private handleResize = () => {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private handlePointerLockChange = () => {
    this.pointerLocked = document.pointerLockElement === this.renderer.domElement;
    if (!this.pointerLocked && this.started && !this.buyMenuOpen) {
      this.paused = true;
      this.keys.clear();
      this.mouseLeftDown = false;
    } else if (this.pointerLocked) {
      this.paused = false;
      this.buyMenuOpen = false;
    }
    this.emitHudSnapshot();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.pointerLocked || !this.started || this.paused || this.buyMenuOpen) return;
    const a = this.getControlledAgent();
    if (!a || !a.alive) return;

    const zoomScale = this.scopeLevel === 2 ? 0.22 : this.scopeLevel === 1 ? 0.42 : 1.0;
    const sens = 0.0021 * this.sensitivity * zoomScale;
    a.yaw -= e.movementX * sens;
    a.pitch = Math.max(-1.46, Math.min(1.46, a.pitch - e.movementY * sens));
    this.viewmodel.addLookSway(e.movementX, e.movementY);
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (!this.started || this.paused || this.buyMenuOpen) return;
    this.audio.unlock();
    if (!this.pointerLocked) {
      this.requestPointerLock();
      return;
    }

    const ctrl = this.getControlledAgent();
    if (ctrl && !ctrl.alive) {
      if (e.button === 0) this.cycleSpectator(1);
      if (e.button === 2) this.cycleSpectator(-1);
      return;
    }

    if (e.button === 0) {
      this.mouseLeftDown = true;
    } else if (e.button === 2) {
      this.mouseRightClicked = true;
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      this.mouseLeftDown = false;
      const ctrl = this.getControlledAgent();
      if (ctrl) ctrl.semiAutoLatch = false;
    }
  };

  private handleWheel = (e: WheelEvent) => {
    if (!this.pointerLocked || !this.started || this.paused) return;
    const a = this.getControlledAgent();
    if (!a || !a.alive) return;
    const available: WeaponSlot[] = [];
    if (a.slots.primary) available.push('primary');
    if (a.slots.secondary) available.push('secondary');
    available.push('melee');
    if (a.slots.c4) available.push('c4');
    const idx = available.indexOf(a.activeSlot);
    const nextIdx = (idx + (e.deltaY > 0 ? 1 : -1) + available.length) % available.length;
    this.switchSlot(a, available[nextIdx]);
    this.emitHudSnapshot();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    const code = e.code;
    if (code === 'Tab') {
      e.preventDefault();
      this.scoreboardOpen = true;
      this.emitHudSnapshot();
      return;
    }

    if (!this.started) return;

    if (code === 'KeyB') {
      if (!this.paused) {
        this.buyMenuOpen = !this.buyMenuOpen;
        if (this.buyMenuOpen) {
          this.exitPointerLock();
          this.keys.clear();
          this.mouseLeftDown = false;
        } else {
          this.requestPointerLock();
        }
        this.emitHudSnapshot();
      }
      return;
    }

    if (code === 'Escape') {
      if (this.buyMenuOpen) {
        this.closeBuyMenu();
      }
      return;
    }

    this.keys.add(code);

    if (this.paused || this.buyMenuOpen) return;

    const a = this.getControlledAgent();
    if (!a) return;

    if (!a.alive) {
      if (code === 'KeyE') {
        this.takeoverSpectatedBot();
      } else if (code === 'KeyA' || code === 'ArrowLeft') {
        this.cycleSpectator(-1);
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        this.cycleSpectator(1);
      }
      return;
    }

    if (code === 'Digit1') this.switchSlot(a, 'primary');
    else if (code === 'Digit2') this.switchSlot(a, 'secondary');
    else if (code === 'Digit3') this.switchSlot(a, 'melee');
    else if (code === 'Digit4' || code === 'Digit5') this.switchSlot(a, 'c4');
    else if (code === 'KeyQ') this.switchSlot(a, a.lastSlot);
    else if (code === 'KeyR') this.startReload(a);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Tab') {
      e.preventDefault();
      this.scoreboardOpen = false;
      this.emitHudSnapshot();
      return;
    }
    this.keys.delete(e.code);
  };

  private handleContextMenu = (e: MouseEvent) => e.preventDefault();

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('wheel', this.handleWheel, { passive: true });
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.renderer.domElement.addEventListener('contextmenu', this.handleContextMenu);
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.renderer.domElement.removeEventListener('contextmenu', this.handleContextMenu);
    this.renderer.dispose();
  }

  // =========================================================================
  // MAIN SIMULATION & RENDER LOOP
  // =========================================================================
  private loop = (now: number) => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);

    const frameDt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTime) / 1000));
    this.lastFrameTime = now;

    if (this.started && !this.paused) {
      this.accumulator += frameDt;
      while (this.accumulator >= FIXED_DT) {
        this.fixedUpdate(FIXED_DT);
        this.accumulator -= FIXED_DT;
      }
      this.effects.update(frameDt);
      this.updateCameraAndViewmodel(frameDt);
    } else {
      // Idle scenic camera flyover over Dust2 Mid/A Site on title screen before match starts
      if (!this.started) {
        this.elapsed += frameDt;
        const ang = this.elapsed * 0.14;
        this.camera.position.set(Math.cos(ang) * 28 + 8, 16.5, Math.sin(ang) * 26 - 6);
        this.camera.lookAt(8, 2.2, -10);
        this.viewmodel.root.visible = false;
      }
    }

    this.renderer.render(this.scene, this.camera);

    this.hudEmitAccum += frameDt;
    if (this.hudEmitAccum >= 0.04) {
      this.hudEmitAccum = 0;
      this.emitHudSnapshot();
    }
  };

  private fixedUpdate(dt: number): void {
    this.elapsed += dt;

    // Decay HUD feedback timers
    this.hitmarkerTime = Math.max(0, this.hitmarkerTime - dt);
    this.damageFlashAlpha = Math.max(0, this.damageFlashAlpha - dt * 1.9);
    this.cameraShake = Math.max(0, this.cameraShake - dt * 2.5);
    if (this.damageIndicatorTimer > 0) {
      this.damageIndicatorTimer -= dt;
      if (this.damageIndicatorTimer <= 0) this.damageIndicatorAngle = null;
    }
    if (this.announcementTimer > 0) {
      this.announcementTimer -= dt;
      if (this.announcementTimer <= 0) this.announcement = '';
    }
    if (this.unscopeBoltTimer > 0) {
      this.unscopeBoltTimer -= dt;
    }

    // Expire old killfeed entries (> 6.5s)
    const nowSec = this.elapsed;
    if (this.killfeed.length > 0 && nowSec - this.killfeed[0].timestamp > 6.5) {
      this.killfeed = this.killfeed.filter((k) => nowSec - k.timestamp <= 6.5);
    }

    // Round phase timer
    this.roundTimer = Math.max(0, this.roundTimer - dt);
    if (this.roundPhase === 'freezetime') {
      if (this.roundTimer <= 0) {
        this.roundPhase = 'live';
        this.roundTimer = ROUND_TIME;
      }
    } else if (this.roundPhase === 'round_end') {
      if (this.roundTimer <= 0) {
        this.roundNumber++;
        this.setupRound(false);
        return;
      }
    } else if (this.roundPhase === 'live') {
      if (this.bombState !== 'planted' && this.roundTimer <= 0) {
        this.endRound('CT', '时间耗尽 · CT 防守成功');
      }
    }

    // Build shared read-only AI view list
    const aiViews: AIActorView[] = this.agents.map((a) => {
      const wid = this.getActiveWeaponId(a);
      const ammo = a.ammo[wid];
      return {
        id: a.id,
        team: a.team,
        alive: a.alive,
        pos: a.body.pos,
        yaw: a.yaw,
        pitch: a.pitch,
        hasBomb: a.slots.c4,
        hp: a.hp,
        isReloading: a.reloading,
        activeMag: ammo ? ammo.mag : -1,
        hasPrimary: a.slots.primary !== null,
        primaryWeaponId: a.slots.primary,
      };
    });

    const tactics = this.getTacticsContext();

    // Update all 10 agents
    for (let i = 0; i < this.agents.length; i++) {
      const a = this.agents[i];
      this.updateAgentTimers(a, dt);

      if (!a.alive) {
        a.rig.update(dt, a.body.pos, a.yaw, a.pitch, 0, false, false, false, false, false);
        continue;
      }

      if (a.isHuman) {
        this.updateHumanAgent(a, dt);
      } else {
        this.updateBotAgent(a, dt, aiViews, tactics);
      }

      // Check dropped C4 auto-pickup for living Terrorists
      if (
        a.team === 'T' &&
        this.bombState === 'dropped' &&
        this.bombPos &&
        Math.hypot(a.body.pos.x - this.bombPos.x, a.body.pos.z - this.bombPos.z) < 1.55 &&
        Math.abs(a.body.pos.y - this.bombPos.y) < 1.4
      ) {
        a.slots.c4 = true;
        this.bombState = 'carried';
        this.bombPos = null;
        if (a.isHuman) {
          this.showAnnouncement('你已拾取 C4 炸弹！前往 A点 或 B点 安放', 2.4);
        }
      }

      // Update visual rig
      const horizSpeed = Math.hypot(a.body.vel.x, a.body.vel.z);
      const viewed = this.getViewedAgent();
      const hideRig = viewed?.id === a.id;
      const showAlly = a.team === this.playerTeam && !hideRig;
      a.rig.setWeapon(this.getActiveWeaponId(a));
      a.rig.update(
        dt,
        a.body.pos,
        a.yaw,
        a.pitch,
        horizSpeed,
        a.body.crouching,
        a.alive,
        a.slots.c4,
        showAlly,
        hideRig
      );
    }

    // Update player's own LOS enemy spotting for minimap
    this.updatePlayerSpotting();

    // Update planted C4 timer, beep & explosion
    this.updateBombLogic(dt);

    // Update 3D C4 world prop visibility & blink
    const showProp = this.bombState === 'dropped' || this.bombState === 'planted';
    this.effects.updateC4Prop(
      showProp,
      this.bombPos,
      this.bombState === 'planted',
      this.bombLedOn,
      this.elapsed
    );

    // Update spatial audio listener
    const viewed = this.getViewedAgent();
    if (viewed) {
      this.audio.updateListener(
        {
          x: viewed.body.pos.x,
          y: viewed.body.pos.y + (viewed.body.crouching ? EYE_HEIGHT_CROUCH : EYE_HEIGHT_STAND),
          z: viewed.body.pos.z,
        },
        viewed.yaw
      );
    }

    this.mouseRightClicked = false;
  }

  private updateAgentTimers(a: Agent, dt: number): void {
    a.fireCooldown = Math.max(0, a.fireCooldown - dt);
    a.recoilSpread = Math.max(0, a.recoilSpread - dt * 0.14);
    a.recoilKickPitch *= Math.exp(-dt * 11);
    if (a.recoilSpread < 0.002) a.shotCount = 0;

    if (a.reloading) {
      const cfg = WEAPONS[this.getActiveWeaponId(a)];
      a.reloadTimer -= dt;
      if (a.reloadTimer <= 0) {
        a.reloading = false;
        const ammo = a.ammo[cfg.id];
        if (ammo && cfg.magSize > 0) {
          const need = cfg.magSize - ammo.mag;
          const transfer = Math.min(need, ammo.reserve);
          ammo.mag += transfer;
          ammo.reserve -= transfer;
        }
      }
    }
  }

  private updateHumanAgent(a: Agent, dt: number): void {
    const canMove = this.roundPhase !== 'freezetime';
    const wid = this.getActiveWeaponId(a);
    const cfg = WEAPONS[wid];

    // Crouch & Walk
    a.body.crouching = this.keys.has('ControlLeft') || this.keys.has('ControlRight') || this.keys.has('KeyC');
    const walking = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');

    // Right click: AWP scope or Knife heavy stab
    if (this.mouseRightClicked && !this.buyMenuOpen) {
      if (cfg.canScope && !a.reloading && this.unscopeBoltTimer <= 0) {
        this.scopeLevel = ((this.scopeLevel + 1) % 3) as 0 | 1 | 2;
        this.audio.playScopeZoom();
      } else if (cfg.isMelee && this.roundPhase === 'live') {
        this.tryFireWeapon(a, true);
      }
    }

    // Handle C4 Plant / Defuse with E (or Left-Click when holding C4)
    const holdingE = this.keys.has('KeyE');
    const site = this.getBombsiteAt(a.body.pos);
    const wantsPlant =
      this.roundPhase === 'live' &&
      a.team === 'T' &&
      a.slots.c4 &&
      site !== null &&
      this.bombState === 'carried' &&
      (holdingE || (wid === 'c4' && this.mouseLeftDown));

    const wantsDefuse =
      this.roundPhase === 'live' &&
      a.team === 'CT' &&
      this.bombState === 'planted' &&
      this.bombPos !== null &&
      holdingE &&
      Math.hypot(a.body.pos.x - this.bombPos.x, a.body.pos.z - this.bombPos.z) < 2.65 &&
      Math.abs(a.body.pos.y - this.bombPos.y) < 1.6;

    if (wantsPlant && site) {
      a.body.crouching = true;
      a.body.vel.x = 0;
      a.body.vel.z = 0;
      this.advancePlant(a, site.id, dt);
      stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);
      return;
    } else if (this.activePlanterId === a.id) {
      this.activePlanterId = null;
      this.plantProgress = 0;
    }

    if (wantsDefuse) {
      a.body.crouching = true;
      a.body.vel.x = 0;
      a.body.vel.z = 0;
      this.advanceDefuse(a, dt);
      stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);
      return;
    } else if (this.activeDefuserId === a.id) {
      this.activeDefuserId = null;
      this.defuseProgress = 0;
    }

    // WASD Movement
    let fwd = 0;
    let right = 0;
    if (canMove && !this.buyMenuOpen) {
      if (this.keys.has('KeyW')) fwd += 1;
      if (this.keys.has('KeyS')) fwd -= 1;
      if (this.keys.has('KeyD')) right += 1;
      if (this.keys.has('KeyA')) right -= 1;
    }

    const inputLen = Math.hypot(fwd, right);
    if (inputLen > 0) {
      fwd /= inputLen;
      right /= inputLen;
    }

    let speed = BASE_MOVE_SPEED * cfg.moveSpeedMultiplier;
    if (this.scopeLevel > 0) speed *= 0.56;
    else if (a.body.crouching) speed *= CROUCH_MULTIPLIER;
    else if (walking) speed *= WALK_MULTIPLIER;

    // World velocity from yaw (forward = (-sin(yaw), -cos(yaw)), right = (cos(yaw), -sin(yaw)))
    const fx = -Math.sin(a.yaw);
    const fz = -Math.cos(a.yaw);
    const rx = Math.cos(a.yaw);
    const rz = -Math.sin(a.yaw);

    const targetVx = (fx * fwd + rx * right) * speed;
    const targetVz = (fz * fwd + rz * right) * speed;
    const accel = a.body.onGround ? 18 : 4.5;
    a.body.vel.x += (targetVx - a.body.vel.x) * Math.min(1, accel * dt);
    a.body.vel.z += (targetVz - a.body.vel.z) * Math.min(1, accel * dt);

    // Jump
    if (canMove && !this.buyMenuOpen && this.keys.has('Space') && a.body.onGround) {
      a.body.vel.y = JUMP_VELOCITY;
      a.body.onGround = false;
    }

    const { landedSpeed } = stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);
    if (landedSpeed > 4.2) {
      this.audio.playFootstep(undefined, true);
    }

    // Footstep cadence (silent when Shift-walking or crouching)
    const horizSpeed = Math.hypot(a.body.vel.x, a.body.vel.z);
    if (a.body.onGround && horizSpeed > 3.2 && !walking && !a.body.crouching) {
      a.stepAccum += horizSpeed * dt;
      if (a.stepAccum >= 2.15) {
        a.stepAccum = 0;
        this.audio.playFootstep(undefined, false);
      }
    }

    // Weapon firing
    if (this.mouseLeftDown && this.roundPhase === 'live' && !this.buyMenuOpen && wid !== 'c4') {
      if (cfg.automatic || !a.semiAutoLatch) {
        this.tryFireWeapon(a, false);
        if (!cfg.automatic) a.semiAutoLatch = true;
      }
    }
  }

  private updateBotAgent(
    a: Agent,
    dt: number,
    aiViews: AIActorView[],
    tactics: RoundTacticsContext
  ): void {
    const selfView = aiViews.find((v) => v.id === a.id)!;
    const cmd = a.brain.update(dt, selfView, aiViews, this.nav, this.mapData.colliders, tactics);

    // Record spotted enemies for minimap if bot is on player's team!
    if (a.team === this.playerTeam) {
      for (const eid of cmd.spottedEnemyIds) {
        const enemy = this.getAgent(eid);
        if (enemy) enemy.spottedUntil = Math.max(enemy.spottedUntil, this.elapsed + 1.4);
      }
    }

    a.yaw = cmd.targetYaw;
    a.pitch = cmd.targetPitch;
    a.body.crouching = cmd.crouch;

    if (this.roundPhase === 'freezetime') {
      a.body.vel.x = 0;
      a.body.vel.z = 0;
      stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);
      return;
    }

    // Bot planting / defusing C4
    if (cmd.wantPlant && a.team === 'T' && a.slots.c4 && this.bombState === 'carried') {
      const site = this.getBombsiteAt(a.body.pos);
      if (site) {
        a.body.vel.x = 0;
        a.body.vel.z = 0;
        this.advancePlant(a, site.id, dt);
        stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);
        return;
      }
    } else if (this.activePlanterId === a.id) {
      this.activePlanterId = null;
      this.plantProgress = 0;
    }

    if (cmd.wantDefuse && a.team === 'CT' && this.bombState === 'planted' && this.bombPos) {
      a.body.vel.x = 0;
      a.body.vel.z = 0;
      this.advanceDefuse(a, dt);
      stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);
      return;
    } else if (this.activeDefuserId === a.id) {
      this.activeDefuserId = null;
      this.defuseProgress = 0;
    }

    // Bot weapon selection (prefer primary if has ammo, else secondary)
    if (a.slots.primary) {
      const pAmmo = a.ammo[a.slots.primary];
      if (pAmmo && (pAmmo.mag > 0 || pAmmo.reserve > 0)) {
        if (a.activeSlot !== 'primary') this.switchSlot(a, 'primary');
      } else if (a.slots.secondary && a.activeSlot !== 'secondary') {
        this.switchSlot(a, 'secondary');
      }
    }

    const wid = this.getActiveWeaponId(a);
    const cfg = WEAPONS[wid];
    const moveSpeed = BASE_MOVE_SPEED * 0.88 * cfg.moveSpeedMultiplier * (cmd.crouch ? 0.55 : 1);

    a.body.vel.x += (cmd.moveX * moveSpeed - a.body.vel.x) * Math.min(1, 14 * dt);
    a.body.vel.z += (cmd.moveZ * moveSpeed - a.body.vel.z) * Math.min(1, 14 * dt);

    stepPhysicsBody(a.body, dt, this.mapData.colliders, this.mapData.ramps);

    // Spatialized AI footsteps
    const hSpeed = Math.hypot(a.body.vel.x, a.body.vel.z);
    if (a.body.onGround && hSpeed > 2.8) {
      a.stepAccum += hSpeed * dt;
      if (a.stepAccum >= 2.3) {
        a.stepAccum = 0;
        this.audio.playFootstep(a.body.pos, false);
      }
    }

    if (cmd.reload) {
      this.startReload(a);
    }
    if (cmd.fire && this.roundPhase === 'live') {
      this.tryFireWeapon(a, false);
    }
  }

  private startReload(a: Agent): void {
    const wid = this.getActiveWeaponId(a);
    const cfg = WEAPONS[wid];
    if (a.reloading || cfg.magSize <= 0) return;
    const ammo = a.ammo[wid];
    if (!ammo || ammo.mag >= cfg.magSize || ammo.reserve <= 0) return;

    a.reloading = true;
    a.reloadTimer = cfg.reloadTime;
    if (a.isHuman) {
      this.scopeLevel = 0;
      this.audio.playReload();
    } else {
      this.audio.playReload(a.body.pos);
    }
  }

  private tryFireWeapon(shooter: Agent, heavyMelee: boolean): void {
    if (shooter.fireCooldown > 0 || shooter.reloading) return;
    const wid = this.getActiveWeaponId(shooter);
    const cfg = WEAPONS[wid];
    if (cfg.isUtility) return;

    const ammo = shooter.ammo[wid];
    if (!cfg.isMelee && ammo) {
      if (ammo.mag <= 0) {
        if (shooter.isHuman) this.audio.playDryFire();
        this.startReload(shooter);
        return;
      }
      ammo.mag--;
    }

    shooter.fireCooldown = heavyMelee && cfg.heavyInterval ? cfg.heavyInterval : cfg.fireInterval;
    shooter.shotCount++;

    // Viewmodel / rig / audio feedback
    const viewed = this.getViewedAgent();
    const isViewedShooter = viewed?.id === shooter.id;
    if (isViewedShooter) {
      this.viewmodel.triggerFire(wid);
      this.audio.playWeaponFire(wid);
    } else {
      this.audio.playWeaponFire(wid, shooter.body.pos);
    }
    shooter.rig.triggerFire(cfg.suppressed);

    // Eye origin
    const eyeH = shooter.body.crouching ? EYE_HEIGHT_CROUCH : EYE_HEIGHT_STAND;
    const origin: Vec3 = {
      x: shooter.body.pos.x,
      y: shooter.body.pos.y + eyeH,
      z: shooter.body.pos.z,
    };

    // Calculate angular spread based on movement, stance, weapon & AWP scope
    const horizSpeed = Math.hypot(shooter.body.vel.x, shooter.body.vel.z);
    const moveFactor = Math.min(1, horizSpeed / 5.5);
    let spread = cfg.baseSpread + cfg.moveSpread * moveFactor + shooter.recoilSpread;
    if (shooter.body.crouching) spread *= 0.72;
    if (!shooter.body.onGround) spread += 0.055;
    if (cfg.canScope) {
      if ((shooter.isHuman && this.scopeLevel > 0) || (!shooter.isHuman && horizSpeed < 1.2)) {
        spread = 0.001 + moveFactor * 0.012;
      }
    }
    if (!shooter.isHuman) {
      // Fair tactical AI spread so firefights feel authentic and rewarding
      spread += wid === 'awp' ? 0.018 : 0.026;
    }
    spread = Math.min(cfg.maxSpread + 0.05, spread);

    // Compute ray direction with spread & active recoil offset
    const spreadYaw = (Math.random() - 0.5) * 2 * spread;
    const spreadPitch = (Math.random() - 0.5) * 2 * spread;
    const shotYaw = shooter.yaw + spreadYaw;
    const shotPitch = Math.max(-1.48, Math.min(1.48, shooter.pitch + spreadPitch));

    const cosP = Math.cos(shotPitch);
    const dir: Vec3 = {
      x: -Math.sin(shotYaw) * cosP,
      y: Math.sin(shotPitch),
      z: -Math.cos(shotYaw) * cosP,
    };

    // Apply visible weapon recoil kick AFTER sampling this shot's vector
    if (!cfg.isMelee) {
      shooter.recoilSpread = Math.min(cfg.maxSpread, shooter.recoilSpread + cfg.recoilSpreadPerShot);
      if (shooter.isHuman) {
        // AK-47 climbs sharply; M4A4 is notably smoother; Deagle kicks hard
        const kickP = cfg.recoilPitch * (1 + Math.min(0.65, shooter.shotCount * 0.08));
        const kickY = (Math.random() - 0.5) * 2 * cfg.recoilYaw;
        shooter.pitch = Math.min(1.46, shooter.pitch + kickP);
        shooter.yaw += kickY;
        shooter.recoilKickPitch += kickP;
        if (wid === 'awp') {
          this.cameraShake = 0.25;
          if (this.scopeLevel > 0) {
            this.scopeLevel = 0;
            this.unscopeBoltTimer = 0.72;
          }
        }
      }
    }

    // 1. Raycast Map Geometry first
    const wallHit = raycastMap(origin, dir, cfg.range, this.mapData.colliders, false);
    let bestDist = wallHit ? wallHit.distance : cfg.range;

    // 2. Raycast ALL enemy articulated anatomical Hitboxes (head/chest/stomach/arm/leg)
    let hitTarget: Agent | null = null;
    let hitZone: HitboxZone = 'chest';
    let hitPoint: Vec3 = wallHit
      ? wallHit.point
      : {
          x: origin.x + dir.x * bestDist,
          y: origin.y + dir.y * bestDist,
          z: origin.z + dir.z * bestDist,
        };

    for (let i = 0; i < this.agents.length; i++) {
      const target = this.agents[i];
      if (!target.alive || target.id === shooter.id || target.team === shooter.team) continue;
      const res = raycastCharacterHitboxes(
        origin,
        dir,
        bestDist,
        target.body.pos,
        target.yaw,
        target.body.crouching
      );
      if (res && res.distance < bestDist) {
        bestDist = res.distance;
        hitTarget = target;
        hitZone = res.zone;
        hitPoint = res.point;
      }
    }

    // Visual bullet tracer (non-melee)
    if (!cfg.isMelee) {
      const tracerStart: Vec3 = {
        x: origin.x + dir.x * 0.65 + Math.cos(shooter.yaw) * 0.14,
        y: origin.y + dir.y * 0.65 - 0.1,
        z: origin.z + dir.z * 0.65 - Math.sin(shooter.yaw) * 0.14,
      };
      this.effects.spawnTracer(
        tracerStart,
        hitPoint,
        wid === 'awp' ? 0xfff5c2 : wid === 'ak47' ? 0xffcc66 : 0xffe49e
      );
    }

    if (hitTarget) {
      // Check knife backstab bonus
      let overrideBase = heavyMelee && cfg.heavyDamage ? cfg.heavyDamage : undefined;
      if (cfg.isMelee && heavyMelee) {
        const targetFwdX = -Math.sin(hitTarget.yaw);
        const targetFwdZ = -Math.cos(hitTarget.yaw);
        const dot = dir.x * targetFwdX + dir.z * targetFwdZ;
        if (dot > 0.55) overrideBase = 135; // Classic CS backstab!
      }

      const dmg = calculateHitDamage(
        cfg,
        hitZone,
        hitTarget.armor,
        hitTarget.hasHelmet,
        bestDist,
        overrideBase
      );

      this.applyDamage(shooter, hitTarget, dmg.hpDamage, dmg.armorDamage, hitZone, wid, hitPoint);
    } else if (wallHit && !cfg.isMelee) {
      this.effects.spawnWallImpact(
        wallHit.point,
        wallHit.normal,
        wallHit.material === 'metal' || wallHit.material === 'door'
      );
    }

    // Auto-reload when magazine hits 0
    if (!cfg.isMelee && ammo && ammo.mag === 0 && ammo.reserve > 0) {
      this.startReload(shooter);
    }
  }

  private applyDamage(
    attacker: Agent | null,
    victim: Agent,
    hpDamage: number,
    armorDamage: number,
    zone: HitboxZone,
    weaponId: WeaponId,
    hitPoint: Vec3
  ): void {
    if (!victim.alive) return;

    victim.hp = Math.max(0, victim.hp - hpDamage);
    victim.armor = Math.max(0, victim.armor - armorDamage);
    const headshot = zone === 'head';
    const killed = victim.hp <= 0;

    this.effects.spawnBloodImpact(hitPoint, headshot);

    // Notify bot AI when shot
    if (attacker && !victim.isHuman) {
      victim.brain.notifyDamageFrom(attacker.body.pos);
    }

    // Feedback if human player dealt the hit
    if (attacker && attacker.isHuman) {
      this.hitmarkerTime = killed ? 0.34 : 0.2;
      this.hitmarkerHeadshot = headshot;
      this.hitmarkerKill = killed;
      this.lastHitZone = zone;
      this.lastHitDamage = hpDamage;
      this.audio.playHitFeedback(headshot, killed);
    }

    // Feedback if human player (or viewed agent) took damage
    if (victim.isHuman) {
      this.damageFlashAlpha = Math.min(0.65, this.damageFlashAlpha + (headshot ? 0.45 : 0.28));
      this.cameraShake = Math.max(this.cameraShake, headshot ? 0.24 : 0.12);
      this.audio.playDamageTaken(headshot);
      if (attacker) {
        const dx = attacker.body.pos.x - victim.body.pos.x;
        const dz = attacker.body.pos.z - victim.body.pos.z;
        const worldAngle = Math.atan2(dx, -dz); // 0 = North (-Z)
        // Relative to player's look direction
        this.damageIndicatorAngle = worldAngle + victim.yaw;
        this.damageIndicatorTimer = 1.1;
      }
    }

    if (killed) {
      this.handleAgentDeath(victim, attacker, weaponId, headshot);
    }
  }

  private handleAgentDeath(
    victim: Agent,
    killer: Agent | null,
    weaponId: WeaponId,
    headshot: boolean
  ): void {
    victim.alive = false;
    victim.deaths++;
    victim.reloading = false;

    if (this.activePlanterId === victim.id) {
      this.activePlanterId = null;
      this.plantProgress = 0;
    }
    if (this.activeDefuserId === victim.id) {
      this.activeDefuserId = null;
      this.defuseProgress = 0;
    }

    // Drop C4 onto floor if victim was carrying it!
    if (victim.slots.c4 && this.bombState === 'carried') {
      victim.slots.c4 = false;
      const floorY = getSupportFloorY(
        victim.body.pos.x,
        victim.body.pos.z,
        victim.body.pos.y,
        0.3,
        this.mapData.colliders,
        this.mapData.ramps
      );
      this.bombState = 'dropped';
      this.bombPos = { x: victim.body.pos.x, y: floorY, z: victim.body.pos.z };
      if (this.playerTeam === 'T') {
        this.showAnnouncement('C4 炸弹已掉落！前往小地图标记处拾取', 2.8);
      }
    }

    if (killer) {
      killer.kills++;
      killer.money = Math.min(16000, killer.money + WEAPONS[weaponId].killReward);
    }

    // Append Killfeed entry
    this.killfeed.push({
      id: this.nextKillId++,
      killerName: killer ? killer.name : 'C4 爆炸',
      killerTeam: killer ? killer.team : 'T',
      victimName: victim.name,
      victimTeam: victim.team,
      weapon: weaponId,
      headshot,
      timestamp: this.elapsed,
    });
    if (this.killfeed.length > 6) {
      this.killfeed.shift();
    }

    // If controlled human died, switch immediately to spectating a living teammate
    if (victim.isHuman) {
      this.scopeLevel = 0;
      const aliveMate = this.agents.find((a) => a.team === this.playerTeam && a.alive);
      if (aliveMate) {
        this.spectatedAgentId = aliveMate.id;
        this.viewmodel.setWeapon(this.getActiveWeaponId(aliveMate), aliveMate.team);
      }
    }

    this.checkEliminationWinCondition();
    this.emitHudSnapshot();
  }

  private checkEliminationWinCondition(): void {
    if (this.roundPhase !== 'live') return;
    const ctAlive = this.agents.filter((a) => a.team === 'CT' && a.alive).length;
    const tAlive = this.agents.filter((a) => a.team === 'T' && a.alive).length;

    if (ctAlive === 0) {
      this.endRound('T', 'CT 全员阵亡 · 恐怖分子获胜');
    } else if (tAlive === 0 && this.bombState !== 'planted') {
      this.endRound('CT', 'T 全员阵亡 · 反恐精英获胜');
    }
  }

  private getBombsiteAt(pos: Vec3) {
    for (const s of this.mapData.bombsites) {
      if (
        pos.x >= s.minX &&
        pos.x <= s.maxX &&
        pos.y >= s.minY &&
        pos.y <= s.maxY &&
        pos.z >= s.minZ &&
        pos.z <= s.maxZ
      ) {
        return s;
      }
    }
    return null;
  }

  private advancePlant(planter: Agent, siteId: 'A' | 'B', dt: number): void {
    if (this.activePlanterId !== planter.id) {
      this.activePlanterId = planter.id;
      this.plantProgress = 0;
      this.plantKeySoundTimer = 0;
    }
    this.plantProgress += dt / PLANT_DURATION;
    this.plantKeySoundTimer -= dt;
    if (this.plantKeySoundTimer <= 0 && planter.isHuman) {
      this.plantKeySoundTimer = 0.34;
      this.audio.playC4PlantKey();
    }

    if (this.plantProgress >= 1) {
      this.activePlanterId = null;
      this.plantProgress = 0;
      planter.slots.c4 = false;
      if (planter.activeSlot === 'c4') {
        this.switchSlot(planter, planter.slots.primary ? 'primary' : 'secondary');
      }
      const floorY = getSupportFloorY(
        planter.body.pos.x,
        planter.body.pos.z,
        planter.body.pos.y,
        0.3,
        this.mapData.colliders,
        this.mapData.ramps
      );
      this.bombState = 'planted';
      this.bombSite = siteId;
      this.bombPos = { x: planter.body.pos.x, y: floorY, z: planter.body.pos.z };
      this.bombTimer = BOMB_FUSE_TIME;
      this.bombBeepAccum = 0;
      planter.money = Math.min(16000, planter.money + 300);
      this.audio.playC4Beep(this.bombPos);
      this.showAnnouncement(`警告：C4 炸弹已安放在 ${siteId} 点！`, 3.4);
      this.emitHudSnapshot();
    }
  }

  private advanceDefuse(defuser: Agent, dt: number): void {
    if (this.activeDefuserId !== defuser.id) {
      this.activeDefuserId = defuser.id;
      this.defuseProgress = 0;
      if (defuser.isHuman) {
        this.audio.playC4DefuseStart();
      }
    }
    this.defuseProgress += dt / DEFUSE_DURATION;
    if (this.defuseProgress >= 1) {
      this.activeDefuserId = null;
      this.defuseProgress = 0;
      this.bombState = 'defused';
      this.audio.playC4Defused();
      defuser.money = Math.min(16000, defuser.money + 300);
      this.endRound('CT', 'C4 炸弹已成功拆除 · 反恐精英获胜');
    }
  }

  private updateBombLogic(dt: number): void {
    if (this.bombState !== 'planted' || !this.bombPos) return;
    if (this.roundPhase !== 'live') return;

    this.bombTimer = Math.max(0, this.bombTimer - dt);

    // Accelerating C4 beep cadence as countdown approaches zero
    const beepInterval =
      this.bombTimer > 15 ? 1.0 : this.bombTimer > 5 ? 0.45 : Math.max(0.14, this.bombTimer * 0.08);
    this.bombBeepAccum += dt;
    if (this.bombBeepAccum >= beepInterval) {
      this.bombBeepAccum = 0;
      this.bombLedOn = true;
      this.bombLedTimer = 0.1;
      this.audio.playC4Beep(this.bombPos);
    }
    if (this.bombLedTimer > 0) {
      this.bombLedTimer -= dt;
      if (this.bombLedTimer <= 0) this.bombLedOn = false;
    }

    if (this.bombTimer <= 0) {
      this.bombState = 'exploded';
      this.audio.playC4Explosion();
      this.effects.triggerExplosion(this.bombPos);
      this.cameraShake = 0.85;

      // Apply explosion blast damage to everyone nearby
      for (const a of this.agents) {
        if (!a.alive) continue;
        const d = Math.hypot(
          a.body.pos.x - this.bombPos.x,
          a.body.pos.y - this.bombPos.y,
          a.body.pos.z - this.bombPos.z
        );
        if (d < 24) {
          const blastDmg = Math.round((1 - d / 24) * 260);
          this.applyDamage(null, a, blastDmg, 0, 'chest', 'c4', a.body.pos);
        }
      }

      this.endRound('T', 'C4 炸弹成功引爆 · 恐怖分子获胜');
    }
  }

  private endRound(winner: Team, reason: string): void {
    if (this.roundPhase === 'round_end') return;
    this.roundPhase = 'round_end';
    this.roundTimer = ROUND_END_DELAY;
    this.roundWinner = winner;
    this.roundWinReason = reason;
    if (winner === 'CT') this.scoreCT++;
    else this.scoreT++;

    // Economy awards
    for (const a of this.agents) {
      a.money = Math.min(16000, a.money + (a.team === winner ? 3250 : 2400));
    }
    this.emitHudSnapshot();
  }

  private updatePlayerSpotting(): void {
    const viewer = this.getViewedAgent();
    if (!viewer || !viewer.alive) return;
    const eye: Vec3 = {
      x: viewer.body.pos.x,
      y: viewer.body.pos.y + (viewer.body.crouching ? EYE_HEIGHT_CROUCH : EYE_HEIGHT_STAND),
      z: viewer.body.pos.z,
    };
    const fwdX = -Math.sin(viewer.yaw);
    const fwdZ = -Math.cos(viewer.yaw);

    for (const other of this.agents) {
      if (!other.alive || other.team === this.playerTeam) continue;
      const dx = other.body.pos.x - eye.x;
      const dz = other.body.pos.z - eye.z;
      const horiz = Math.hypot(dx, dz) + 0.001;
      const dot = (dx * fwdX + dz * fwdZ) / horiz;
      if (dot < 0.3) continue;
      const chest: Vec3 = { x: other.body.pos.x, y: other.body.pos.y + 1.25, z: other.body.pos.z };
      const head: Vec3 = { x: other.body.pos.x, y: other.body.pos.y + 1.62, z: other.body.pos.z };
      if (
        hasLineOfSight(eye, chest, this.mapData.colliders) ||
        hasLineOfSight(eye, head, this.mapData.colliders)
      ) {
        other.spottedUntil = Math.max(other.spottedUntil, this.elapsed + 1.6);
      }
    }
  }

  private updateCameraAndViewmodel(dt: number): void {
    const viewed = this.getViewedAgent();
    if (!viewed) return;

    const targetFov =
      viewed.isHuman && this.scopeLevel === 2
        ? 13
        : viewed.isHuman && this.scopeLevel === 1
        ? 28
        : 75;
    this.currentFov += (targetFov - this.currentFov) * Math.min(1, dt * 20);
    if (Math.abs(this.camera.fov - this.currentFov) > 0.05) {
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }

    const eyeH = viewed.body.crouching ? EYE_HEIGHT_CROUCH : EYE_HEIGHT_STAND;
    const shakeX = this.cameraShake > 0 ? (Math.random() - 0.5) * this.cameraShake * 0.25 : 0;
    const shakeY = this.cameraShake > 0 ? (Math.random() - 0.5) * this.cameraShake * 0.25 : 0;

    if (viewed.alive) {
      this.camera.position.set(
        viewed.body.pos.x + shakeX,
        viewed.body.pos.y + eyeH + shakeY,
        viewed.body.pos.z
      );
      this.camera.rotation.set(viewed.pitch, viewed.yaw, 0);
    } else {
      // Elevated death camera overview
      this.camera.position.set(viewed.body.pos.x, viewed.body.pos.y + 3.2, viewed.body.pos.z + 2.8);
      this.camera.lookAt(viewed.body.pos.x, viewed.body.pos.y + 0.5, viewed.body.pos.z);
    }

    const wid = this.getActiveWeaponId(viewed);
    const cfg = WEAPONS[wid];
    const reloadProg =
      viewed.reloading && cfg.reloadTime > 0
        ? Math.max(0, Math.min(1, 1 - viewed.reloadTimer / cfg.reloadTime))
        : 0;

    this.viewmodel.setWeapon(wid, viewed.team);
    this.viewmodel.update(
      dt,
      Math.hypot(viewed.body.vel.x, viewed.body.vel.z),
      viewed.body.onGround,
      viewed.reloading,
      reloadProg,
      !viewed.alive || (viewed.isHuman && this.scopeLevel > 0)
    );
  }

  // =========================================================================
  // SNAPSHOT GENERATION FOR REACT HUD
  // =========================================================================
  private emitHudSnapshot(): void {
    const ctrl = this.getControlledAgent();
    const viewed = this.getViewedAgent() ?? ctrl ?? this.agents[0];
    const isSpectating = Boolean(ctrl && !ctrl.alive);
    const wid = this.getActiveWeaponId(viewed);
    const cfg = WEAPONS[wid];
    const ammo = viewed.ammo[wid];

    const site = this.getBombsiteAt(viewed.body.pos);
    const canPlant =
      !isSpectating &&
      this.roundPhase === 'live' &&
      viewed.team === 'T' &&
      viewed.slots.c4 &&
      site !== null &&
      this.bombState === 'carried';

    const canDefuse =
      !isSpectating &&
      this.roundPhase === 'live' &&
      viewed.team === 'CT' &&
      this.bombState === 'planted' &&
      this.bombPos !== null &&
      Math.hypot(viewed.body.pos.x - this.bombPos.x, viewed.body.pos.z - this.bombPos.z) < 2.65;

    let actionType: 'none' | 'planting' | 'defusing' = 'none';
    let actionProgress = 0;
    if (this.activePlanterId === viewed.id) {
      actionType = 'planting';
      actionProgress = Math.min(1, this.plantProgress);
    } else if (this.activeDefuserId === viewed.id) {
      actionType = 'defusing';
      actionProgress = Math.min(1, this.defuseProgress);
    }

    // Dynamic crosshair pixel bloom
    const hSpeed = Math.hypot(viewed.body.vel.x, viewed.body.vel.z);
    const dynamicSpread =
      (cfg.baseSpread + cfg.moveSpread * Math.min(1, hSpeed / 5.5) + viewed.recoilSpread) * 420;

    // Bomb visibility on minimap
    let bombPosForMap: Vec3 | null = this.bombPos;
    let bombVisible = false;
    if (this.bombState === 'planted') {
      bombVisible = true;
    } else if (this.bombState === 'dropped') {
      bombVisible = this.playerTeam === 'T' || this.isPointSeenByPlayerTeam(this.bombPos);
    } else if (this.bombState === 'carried') {
      const carrier = this.agents.find((a) => a.slots.c4 && a.alive);
      if (carrier) {
        bombPosForMap = carrier.body.pos;
        bombVisible = this.playerTeam === 'T' || carrier.spottedUntil > this.elapsed;
      }
    }

    const minimapActors: MinimapActor[] = this.agents.map((a) => ({
      id: a.id,
      team: a.team,
      x: a.body.pos.x,
      z: a.body.pos.z,
      yaw: a.yaw,
      alive: a.alive,
      isControlled: a.id === viewed.id,
      hasBomb: a.slots.c4,
      visible: a.team === this.playerTeam || (a.alive && a.spottedUntil > this.elapsed),
    }));

    const scoreboard: ScoreboardAgent[] = this.agents.map((a) => ({
      id: a.id,
      name: a.name,
      team: a.team,
      isHuman: a.isHuman,
      alive: a.alive,
      hp: a.hp,
      armor: a.armor,
      hasHelmet: a.hasHelmet,
      kills: a.kills,
      deaths: a.deaths,
      money: a.money,
      weapon: this.getActiveWeaponId(a),
      hasBomb: a.slots.c4,
    }));

    const ctRoster = this.agents.filter((a) => a.team === 'CT').map((a) => a.alive);
    const tRoster = this.agents.filter((a) => a.team === 'T').map((a) => a.alive);

    const snapshot: HudSnapshot = {
      started: this.started,
      paused: this.paused,
      pointerLocked: this.pointerLocked,
      buyMenuOpen: this.buyMenuOpen,
      scoreboardOpen: this.scoreboardOpen,
      gameMode: this.gameMode,
      playerTeam: this.playerTeam,
      roundNumber: this.roundNumber,
      isPistolRound: this.isCurrentRoundPistol(),
      roundPhase: this.roundPhase,
      roundTimer: this.roundTimer,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      roundWinner: this.roundWinner,
      roundWinReason: this.roundWinReason,

      controlledId: viewed.id,
      controlledName: viewed.name,
      isSpectating,
      canTakeover: isSpectating && viewed.alive && viewed.team === this.playerTeam,
      alive: viewed.alive,
      hp: viewed.hp,
      armor: viewed.armor,
      hasHelmet: viewed.hasHelmet,
      money: viewed.money,
      callout: getCalloutAt(viewed.body.pos.x, viewed.body.pos.z, this.mapData.callouts),

      activeSlot: viewed.activeSlot,
      activeWeapon: wid,
      activeWeaponName: cfg.name,
      mag: ammo ? ammo.mag : -1,
      reserve: ammo ? ammo.reserve : -1,
      reloading: viewed.reloading,
      reloadProgress:
        viewed.reloading && cfg.reloadTime > 0
          ? Math.max(0, Math.min(1, 1 - viewed.reloadTimer / cfg.reloadTime))
          : 0,
      scopeLevel: viewed.isHuman ? this.scopeLevel : 0,
      crosshairSpread: Math.max(4, Math.min(48, dynamicSpread)),
      slots: { ...viewed.slots },

      bombState: this.bombState,
      bombSite: this.bombSite,
      bombTimer: this.bombTimer,
      bombPos: bombPosForMap,
      bombVisibleToPlayer: bombVisible,
      inBombsite: site ? site.id : null,
      canPlant,
      canDefuse,
      actionType,
      actionProgress,

      hitmarkerTime: this.hitmarkerTime,
      hitmarkerHeadshot: this.hitmarkerHeadshot,
      hitmarkerKill: this.hitmarkerKill,
      damageIndicatorAngle: this.damageIndicatorAngle,
      damageFlashAlpha: this.damageFlashAlpha,
      lastHitZone: this.lastHitZone,
      lastHitDamage: this.lastHitDamage,
      announcement: this.announcement,

      killfeed: [...this.killfeed],
      minimapActors,
      scoreboard,
      ctAliveCount: ctRoster.filter(Boolean).length,
      tAliveCount: tRoster.filter(Boolean).length,
      ctRosterAlive: ctRoster,
      tRosterAlive: tRoster,

      sensitivity: this.sensitivity,
      volume: this.volume,
    };

    this.onHudUpdate(snapshot);
  }

  private isPointSeenByPlayerTeam(pt: Vec3 | null): boolean {
    if (!pt) return false;
    const target: Vec3 = { x: pt.x, y: pt.y + 0.35, z: pt.z };
    for (const a of this.agents) {
      if (!a.alive || a.team !== this.playerTeam) continue;
      const eye: Vec3 = { x: a.body.pos.x, y: a.body.pos.y + 1.55, z: a.body.pos.z };
      if (hasLineOfSight(eye, target, this.mapData.colliders)) return true;
    }
    return false;
  }
}
