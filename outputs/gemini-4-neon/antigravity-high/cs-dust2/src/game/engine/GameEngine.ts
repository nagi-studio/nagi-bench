import * as THREE from 'three';
import { BotController } from '../ai/BotController';
import { SoundEngine } from '../audio/SoundEngine';
import { CAMERA_CONFIG, PHYSICS, ROUND_CONFIG, TEAM_NAMES } from '../config';
import { Combatant } from '../entities/Combatant';
import { buildDust2Scene } from '../map/dust2Builder';
import {
  createDust2MapData,
  Dust2MapData,
  getCalloutAt,
  getPlantZoneAt,
  isInBuyZone,
} from '../map/dust2Data';
import { NavGraph } from '../map/navGraph';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import {
  DamageIndicator,
  GameMode,
  HitboxZone,
  HudState,
  KillFeedEntry,
  RoundPhase,
  Team,
  WeaponId,
} from '../types';
import { ViewModel } from '../weapons/ViewModel';
import { WEAPONS } from '../weapons/weaponData';

interface TracerFX {
  line: THREE.Line;
  life: number;
  maxLife: number;
}

interface SparkFX {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
}

export class GameEngine {
  private container: HTMLElement;
  private onHudUpdate: (hud: HudState) => void;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private viewModel: ViewModel;
  private sound = new SoundEngine();

  public readonly mapData: Dust2MapData;
  private physics: PhysicsWorld;
  private nav: NavGraph;
  private botAI: BotController;

  private combatants: Combatant[] = [];
  private humanTeam: Team = 'CT';
  private gameMode: GameMode = 'competitive';
  private spectateId: string | null = null;

  // Match & Round state
  private started = false;
  private paused = false;
  private pointerLocked = false;
  private buyMenuOpen = false;
  private scoreboardOpen = false;

  private roundNumber = 1;
  private roundPhase: RoundPhase = 'freeze';
  private phaseTimer = ROUND_CONFIG.FREEZE_TIME;
  private liveElapsed = 0;
  private ctScore = 0;
  private tScore = 0;
  private tExecuteSite: 'A' | 'B' = 'A';
  private roundBanner: HudState['roundBanner'] = null;
  private announcement: string | null = null;
  private announcementTimer = 0;

  // C4 state & 3D prop
  private bombState: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded' = 'carried';
  private bombPos = new THREE.Vector3();
  private bombSite: 'A' | 'B' | null = null;
  private bombTimer = ROUND_CONFIG.BOMB_TIMER;
  private bombBeepTimer = 0;
  private bombWorldMesh: THREE.Group;
  private bombLedMesh: THREE.Mesh;
  private bombLight: THREE.PointLight;
  private explosionMesh: THREE.Mesh;
  private explosionLight: THREE.PointLight;
  private explosionTimer = 0;
  private screenShake = 0;

  // Player Input state
  private keys = new Set<string>();
  private mouseLeftDown = false;
  private mouseLeftJustPressed = false;
  private mouseSensitivity = CAMERA_CONFIG.DEFAULT_SENSITIVITY;
  private prevSlot: 'primary' | 'secondary' | 'melee' | 'c4' = 'secondary';
  private playerKeypadBeepTimer = 0;
  private playerDefuseSoundPlayed = false;

  // FX & UI feedback
  private raycaster = new THREE.Raycaster();
  private tracers: TracerFX[] = [];
  private sparks: SparkFX[] = [];
  private killFeed: KillFeedEntry[] = [];
  private killSeq = 0;
  private hitMarker = { active: false, headshot: false, kill: false, seq: 0, timer: 0 };
  private damageFlash = 0;
  private damageIndicators: DamageIndicator[] = [];
  private dmgIndSeq = 0;

  // Loop state
  private rafId = 0;
  private lastFrameTime = 0;
  private accumulator = 0;
  private simTime = 0;
  private hudEmitAccum = 0;
  private disposed = false;

  constructor(container: HTMLElement, onHudUpdate: (hud: HudState) => void) {
    this.container = container;
    this.onHudUpdate = onHudUpdate;

    // Setup Three.js WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.DEFAULT_FOV,
      container.clientWidth / Math.max(1, container.clientHeight),
      CAMERA_CONFIG.NEAR,
      CAMERA_CONFIG.FAR
    );
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    // First-person ViewModel
    this.viewModel = new ViewModel(this.camera);

    // Build Dust2 Map, Physics, NavGraph, AI
    this.mapData = createDust2MapData();
    buildDust2Scene(this.scene, this.mapData);
    this.physics = new PhysicsWorld(this.mapData);
    this.nav = new NavGraph();
    this.botAI = new BotController(this.nav, this.physics, this.mapData);

    // Build 3D C4 World Prop & Explosion FX
    const { group, led, light } = this.createWorldC4Prop();
    this.bombWorldMesh = group;
    this.bombLedMesh = led;
    this.bombLight = light;
    this.scene.add(this.bombWorldMesh);

    this.explosionMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 16),
      new THREE.MeshBasicMaterial({ color: '#ff8a24', transparent: true, opacity: 0.85 })
    );
    this.explosionMesh.visible = false;
    this.scene.add(this.explosionMesh);

    this.explosionLight = new THREE.PointLight('#ff9430', 0, 90);
    this.scene.add(this.explosionLight);

    // Initialize default 5v5 roster (idle preview until user starts)
    this.initTeams('CT', 'competitive');
    this.bindEvents();

    // Start loop
    this.lastFrameTime = performance.now();
    this.emitHud();
    this.loop(this.lastFrameTime);
  }

  private createWorldC4Prop() {
    const group = new THREE.Group();
    const pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.14, 0.42),
      new THREE.MeshStandardMaterial({ color: '#8a7e60', roughness: 0.82 })
    );
    pack.position.y = 0.07;
    pack.castShadow = true;

    const keypad = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.02, 0.16),
      new THREE.MeshStandardMaterial({ color: '#22262b', roughness: 0.5 })
    );
    keypad.position.set(0, 0.145, 0.06);

    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.03, 0.055),
      new THREE.MeshBasicMaterial({ color: '#ff2424' })
    );
    led.position.set(0.08, 0.155, -0.09);

    const light = new THREE.PointLight('#ff2020', 0, 9);
    light.position.set(0, 0.35, 0);

    group.add(pack, keypad, led, light);
    group.visible = false;
    return { group, led, light };
  }

  private initTeams(playerTeam: Team, mode: GameMode): void {
    // Clear existing combatants from scene
    for (const c of this.combatants) {
      this.scene.remove(c.model.root);
    }
    this.combatants = [];
    this.humanTeam = playerTeam;
    this.gameMode = mode;
    this.ctScore = 0;
    this.tScore = 0;
    this.roundNumber = 1;
    this.killFeed = [];

    const startMoney =
      mode === 'competitive'
        ? ROUND_CONFIG.PISTOL_ROUND_MONEY
        : ROUND_CONFIG.FULL_BUY_START_MONEY;

    (['CT', 'T'] as Team[]).forEach((team) => {
      for (let i = 0; i < 5; i++) {
        const isHuman = team === playerTeam && i === 0;
        const name = isHuman ? 'YOU' : `${team}-${TEAM_NAMES[team][i]}`;
        const c = new Combatant(`${team}_${i}`, name, team, isHuman);
        c.money = startMoney;
        this.combatants.push(c);
        this.scene.add(c.model.root);
      }
    });

    this.startRound(true);
  }

  public startMatch(team: Team, mode: GameMode): void {
    this.sound.unlock();
    this.started = true;
    this.paused = false;
    this.buyMenuOpen = false;
    this.initTeams(team, mode);
    this.requestPointerLock();
    this.emitHud();
  }

  public resumeGame(): void {
    this.sound.unlock();
    this.paused = false;
    this.buyMenuOpen = false;
    this.requestPointerLock();
    this.emitHud();
  }

  public restartMatch(): void {
    this.startMatch(this.humanTeam, this.gameMode);
  }

  public setMuted(muted: boolean): void {
    this.sound.setMuted(muted);
  }

  public setSensitivity(sens: number): void {
    this.mouseSensitivity = sens;
  }

  public requestPointerLock(): void {
    if (document.pointerLockElement !== this.renderer.domElement) {
      this.renderer.domElement.requestPointerLock?.();
    }
  }

  public closeBuyMenu(): void {
    this.buyMenuOpen = false;
    if (this.started && !this.paused) {
      this.requestPointerLock();
    }
    this.emitHud();
  }

  public buyItem(item: WeaponId | 'armor' | 'helmet'): boolean {
    const player = this.getHumanPlayer();
    if (!player || !player.alive) return false;
    if (!this.canPlayerBuy(player)) return false;

    const isPistolRound = this.isCurrentPistolRound();

    if (item === 'armor') {
      if (player.armor >= 100 || player.money < ROUND_CONFIG.ARMOR_COST) return false;
      player.money -= ROUND_CONFIG.ARMOR_COST;
      player.armor = 100;
      this.sound.playBuySound();
      this.emitHud();
      return true;
    }

    if (item === 'helmet') {
      if (isPistolRound) return false; // Pistol round: no helmet buy
      if (player.hasHelmet || player.armor <= 0 || player.money < ROUND_CONFIG.HELMET_COST) return false;
      player.money -= ROUND_CONFIG.HELMET_COST;
      player.hasHelmet = true;
      this.sound.playBuySound();
      this.emitHud();
      return true;
    }

    const cfg = WEAPONS[item];
    if (!cfg || cfg.price <= 0) return false;
    if (isPistolRound && cfg.slot === 'primary') return false; // Pistol round forbids primary weapons!
    if (player.money < cfg.price) return false;

    player.money -= cfg.price;
    player.equipWeapon(item);
    this.viewModel.setWeapon(player.getActiveWeaponId());
    this.sound.playBuySound();
    this.emitHud();
    return true;
  }

  private isCurrentPistolRound(): boolean {
    return this.gameMode === 'competitive' && this.roundNumber === 1;
  }

  private startRound(isFirstRound: boolean): void {
    const isPistol = this.isCurrentPistolRound();
    this.roundPhase = 'freeze';
    this.phaseTimer = ROUND_CONFIG.FREEZE_TIME;
    this.liveElapsed = 0;
    this.roundBanner = null;
    this.spectateId = null;
    this.tExecuteSite = Math.random() < 0.52 ? 'A' : 'B';

    // Reset C4
    this.bombState = 'carried';
    this.bombSite = null;
    this.bombTimer = ROUND_CONFIG.BOMB_TIMER;
    this.bombBeepTimer = 0;
    this.bombWorldMesh.visible = false;
    this.bombLight.intensity = 0;

    // Reset human identity to slot 0 of humanTeam every round so player starts fresh
    for (const c of this.combatants) {
      c.isHuman = c.id === `${this.humanTeam}_0`;
    }

    const ctList = this.combatants.filter((c) => c.team === 'CT');
    const tList = this.combatants.filter((c) => c.team === 'T');

    ctList.forEach((c, idx) => {
      const keep = !isFirstRound && c.alive && !isPistol;
      c.resetForRound(this.mapData.spawns.CT[idx], isPistol, keep);
    });

    tList.forEach((c, idx) => {
      const keep = !isFirstRound && c.alive && !isPistol;
      c.resetForRound(this.mapData.spawns.T[idx], isPistol, keep);
    });

    // If full_buy mode on round 1, give human a starter rifle + full armor immediately for instant action
    if (!isPistol && isFirstRound) {
      for (const c of this.combatants) {
        c.armor = 100;
        c.hasHelmet = true;
        if (c.isHuman) {
          c.equipWeapon(c.team === 'T' ? 'ak47' : 'm4a4');
        }
      }
    }

    // Assign C4 to a Terrorist (50% chance to human if T, else a T bot)
    const carrierIdx =
      this.humanTeam === 'T' && Math.random() < 0.55
        ? 0
        : Math.floor(Math.random() * tList.length);
    const carrier = tList[carrierIdx];
    carrier.hasC4 = true;
    this.bombPos.copy(carrier.pos);

    // Initialize AI roles & bot economy purchases
    this.botAI.resetForRound(this.combatants, isPistol, this.tExecuteSite);

    const human = this.getHumanPlayer();
    if (human) {
      this.viewModel.setWeapon(human.getActiveWeaponId(), true);
    }

    this.showAnnouncement(
      isPistol
        ? `第 ${this.roundNumber} 回合 · 手枪局 (PISTOL ROUND)`
        : `第 ${this.roundNumber} 回合 · 按 [B] 购买装备`
    );
    this.emitHud();
  }

  private getHumanPlayer(): Combatant | undefined {
    return this.combatants.find((c) => c.isHuman);
  }

  private getViewedCombatant(): Combatant | undefined {
    const human = this.getHumanPlayer();
    if (human && human.alive) return human;
    if (this.spectateId) {
      const s = this.combatants.find((c) => c.id === this.spectateId && c.alive);
      if (s) return s;
    }
    // Auto-pick an alive teammate
    const aliveMate = this.combatants.find((c) => c.team === this.humanTeam && c.alive);
    if (aliveMate) {
      this.spectateId = aliveMate.id;
      return aliveMate;
    }
    return human;
  }

  private cycleSpectate(delta = 1): void {
    const mates = this.combatants.filter((c) => c.team === this.humanTeam && c.alive);
    if (mates.length === 0) return;
    const curIdx = mates.findIndex((m) => m.id === this.spectateId);
    const nextIdx = (curIdx + delta + mates.length) % mates.length;
    this.spectateId = mates[nextIdx].id;
    const target = mates[nextIdx];
    this.viewModel.setWeapon(target.getActiveWeaponId(), true);
    this.emitHud();
  }

  private tryTakeoverSpectatedBot(): void {
    const human = this.getHumanPlayer();
    if (!human || human.alive) return;
    const target = this.combatants.find(
      (c) => c.id === this.spectateId && c.team === this.humanTeam && c.alive && !c.isHuman
    );
    if (!target) return;

    // Transfer player control to the alive bot!
    human.isHuman = false;
    target.isHuman = true;
    target.isPlanting = false;
    target.isDefusing = false;
    this.spectateId = null;
    this.viewModel.setWeapon(target.getActiveWeaponId(), true);
    this.showAnnouncement(`已接管队友 ${target.name}！`);
    this.sound.playBuySound();
    this.emitHud();
  }

  private canPlayerBuy(player: Combatant): boolean {
    if (this.roundPhase === 'round_end') return false;
    if (this.roundPhase === 'freeze') return true;
    if (this.roundPhase === 'live' && this.liveElapsed <= ROUND_CONFIG.BUY_WINDOW) {
      return isInBuyZone(this.mapData, player.team, player.pos.x, player.pos.z);
    }
    return false;
  }

  private showAnnouncement(text: string, duration = 3.2): void {
    this.announcement = text;
    this.announcementTimer = duration;
  }

  // ===========================================================================
  // MAIN GAME LOOP (Fixed Physics + Variable Render)
  // ===========================================================================
  private loop = (now: number): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);

    const frameDt = Math.min(PHYSICS.MAX_FRAME_DT, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    if (this.started && !this.paused) {
      this.accumulator += frameDt;
      while (this.accumulator >= PHYSICS.FIXED_DT) {
        this.fixedStep(PHYSICS.FIXED_DT);
        this.accumulator -= PHYSICS.FIXED_DT;
      }
      this.updateVisualFX(frameDt);
    } else if (!this.started) {
      // Gentle cinematic overview camera orbit on start menu
      const t = now * 0.00018;
      this.camera.position.set(Math.cos(t) * 28, 22, Math.sin(t) * 28 - 4);
      this.camera.lookAt(4, 2, -10);
      this.viewModel.root.visible = false;
    }

    this.renderer.render(this.scene, this.camera);

    // Emit HUD at ~25Hz
    this.hudEmitAccum += frameDt;
    if (this.hudEmitAccum >= 0.04) {
      this.hudEmitAccum = 0;
      this.emitHud();
    }
  };

  private fixedStep(dt: number): void {
    this.simTime += dt;

    if (this.announcementTimer > 0) {
      this.announcementTimer -= dt;
      if (this.announcementTimer <= 0) this.announcement = null;
    }

    // 1. Round Phase Timers
    if (this.roundPhase === 'freeze') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        this.roundPhase = 'live';
        this.phaseTimer = ROUND_CONFIG.ROUND_TIME;
        this.liveElapsed = 0;
        this.showAnnouncement('回合开始！GO GO GO!', 2.0);
      }
    } else if (this.roundPhase === 'live') {
      this.phaseTimer -= dt;
      this.liveElapsed += dt;
      if (this.phaseTimer <= 0) {
        this.finishRound('CT', '时间耗尽 · CT 守包成功');
      }
    } else if (this.roundPhase === 'bomb_planted') {
      this.bombTimer -= dt;
      this.phaseTimer = Math.max(0, this.bombTimer);
      this.updatePlantedBomb(dt);
      if (this.bombTimer <= 0) {
        this.detonateBomb();
      }
    } else if (this.roundPhase === 'round_end') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        this.roundNumber += 1;
        this.startRound(false);
        return;
      }
    }

    // 2. Update Human Player
    const human = this.getHumanPlayer();
    if (human && human.alive) {
      this.updateHumanPlayer(human, dt);
    }

    // 3. Update AI Bots
    const botCtx = {
      time: this.simTime,
      roundPhase: this.roundPhase,
      isPistolRound: this.isCurrentPistolRound(),
      combatants: this.combatants,
      bombState: this.bombState,
      bombPos: this.bombPos,
      bombSite: this.bombSite,
      tExecuteSite: this.tExecuteSite,
      onBotFire: (bot: Combatant, targetPoint: THREE.Vector3) => this.fireWeapon(bot, targetPoint),
      onBotPlantComplete: (bot: Combatant, site: 'A' | 'B') => this.completeBombPlant(bot, site),
      onBotDefuseComplete: (bot: Combatant) => this.completeBombDefuse(bot),
      onBotKeypadBeep: (pos: THREE.Vector3) => this.sound.playC4Keypad(pos),
      onBotDefuseStart: (pos: THREE.Vector3) => this.sound.playC4DefuseStart(pos),
    };

    for (const c of this.combatants) {
      if (!c.isHuman && c.alive) {
        this.botAI.updateBot(c, dt, botCtx);
        this.updateCombatantFootsteps(c, dt);
      }
    }

    // 4. Dropped C4 Pickup Check & Bomb Position Sync
    this.updateBombCarrierAndPickup();

    // 5. Human Team Radar Spotting (Human LOS marks enemies on minimap!)
    if (human && human.alive) {
      const eye = human.getEyePosition();
      const fwd = human.getLookDirection();
      for (const other of this.combatants) {
        if (!other.alive || other.team === human.team) continue;
        const target = other.pos.clone();
        target.y += 1.25;
        const to = target.clone().sub(eye);
        const dist = to.length();
        if (dist < 85 && fwd.dot(to.normalize()) > 0.35) {
          if (this.physics.hasLineOfSight(eye, target)) {
            other.lastSpottedTime = this.simTime;
          }
        }
      }
    }

    // 6. Check Elimination Win Conditions
    if (this.roundPhase === 'live' || this.roundPhase === 'bomb_planted') {
      const ctAlive = this.combatants.filter((c) => c.team === 'CT' && c.alive).length;
      const tAlive = this.combatants.filter((c) => c.team === 'T' && c.alive).length;

      if (ctAlive === 0) {
        this.finishRound('T', '反恐精英全军覆没 · T 获胜');
      } else if (tAlive === 0 && this.bombState !== 'planted') {
        this.finishRound('CT', '恐怖分子全部消灭 · CT 获胜');
      }
    }

    // 7. Update 3D Models & Camera
    const viewed = this.getViewedCombatant();
    for (const c of this.combatants) {
      const horizSpeed = Math.hypot(c.vel.x, c.vel.z);
      // Hide first-person model of whichever combatant camera is inside
      const isCameraInside = viewed?.id === c.id && c.alive;
      c.model.update(dt, c.pos, c.yaw, c.pitch, horizSpeed, c.crouching, !isCameraInside);
    }

    if (viewed) {
      const eye = viewed.getEyePosition();
      this.camera.position.copy(eye);
      if (this.screenShake > 0) {
        this.camera.position.x += (Math.random() - 0.5) * this.screenShake * 0.45;
        this.camera.position.y += (Math.random() - 0.5) * this.screenShake * 0.45;
      }
      this.camera.rotation.set(viewed.pitch, viewed.yaw, 0, 'YXZ');

      // Update FOV for AWP scope zoom
      const activeCfg = WEAPONS[viewed.getActiveWeaponId()];
      let targetFov = CAMERA_CONFIG.DEFAULT_FOV;
      if (activeCfg.canScope && viewed.scopeLevel > 0 && activeCfg.scopeFovs) {
        targetFov = activeCfg.scopeFovs[viewed.scopeLevel - 1] ?? 28;
      }
      if (Math.abs(this.camera.fov - targetFov) > 0.1) {
        this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 18);
        this.camera.updateProjectionMatrix();
      }

      // Sync audio listener
      this.sound.updateListener(eye, viewed.yaw);

      // Sync first-person viewmodel
      this.viewModel.setWeapon(viewed.getActiveWeaponId());
      const reloadProgress =
        viewed.reloading && viewed.reloadDuration > 0
          ? 1 - viewed.reloadTimer / viewed.reloadDuration
          : 0;
      this.viewModel.update(
        dt,
        Math.hypot(viewed.vel.x, viewed.vel.z),
        viewed.grounded,
        viewed.reloading,
        reloadProgress,
        viewed.scopeLevel > 0,
        viewed.alive
      );
    }

    this.mouseLeftJustPressed = false;
  }

  private updateHumanPlayer(player: Combatant, dt: number): void {
    if (player.fireCooldown > 0) player.fireCooldown -= dt;

    // Reload tick
    if (player.updateReload(dt)) {
      this.sound.playReload('end');
    }

    const activeId = player.getActiveWeaponId();
    const cfg = WEAPONS[activeId];

    // Recoil bloom recovery
    player.recoilSpread = Math.max(0, player.recoilSpread - cfg.recoilRecovery * 0.015 * dt);
    if (!this.mouseLeftDown) {
      player.shotsFiredBurst = Math.max(0, player.shotsFiredBurst - dt * 14);
      // Smooth slight vertical recoil recovery
      if (player.recoilPitchAccum > 0) {
        const recover = Math.min(player.recoilPitchAccum, dt * cfg.recoilRecovery * 0.06);
        player.pitch = Math.max(-1.45, player.pitch - recover * 0.45);
        player.recoilPitchAccum -= recover;
      }
    }

    // Freeze phase: cannot walk, still can look & buy
    const canMove = this.roundPhase !== 'freeze' && !this.buyMenuOpen;

    // Crouch & Walk flags
    player.crouching = this.keys.has('ControlLeft') || this.keys.has('KeyC');
    player.walking = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');

    // Bomb Planting (T holding E in plant zone OR holding LMB with C4 equipped in plant zone)
    const holdingE = this.keys.has('KeyE');
    const plantSite =
      player.team === 'T' &&
      player.hasC4 &&
      this.bombState === 'carried' &&
      this.roundPhase === 'live'
        ? getPlantZoneAt(this.mapData, player.pos.x, player.pos.y, player.pos.z)
        : null;

    const wantsPlant =
      canMove &&
      plantSite !== null &&
      (holdingE || (activeId === 'c4' && this.mouseLeftDown));

    if (wantsPlant && plantSite) {
      if (!player.isPlanting) {
        player.isPlanting = true;
        player.plantProgress = 0;
        player.switchSlot('c4');
        this.playerKeypadBeepTimer = 0.05;
      }
      player.plantProgress += dt / ROUND_CONFIG.PLANT_TIME;
      this.playerKeypadBeepTimer -= dt;
      if (this.playerKeypadBeepTimer <= 0) {
        this.sound.playC4Keypad();
        this.playerKeypadBeepTimer = 0.45;
      }
      player.vel.x = 0;
      player.vel.z = 0;
      player.crouching = true;
      if (player.plantProgress >= 1.0) {
        player.isPlanting = false;
        player.plantProgress = 0;
        this.completeBombPlant(player, plantSite);
      }
    } else if (player.isPlanting) {
      player.isPlanting = false;
      player.plantProgress = 0;
      if (player.primary) player.switchSlot('primary');
      else if (player.secondary) player.switchSlot('secondary');
    }

    // Bomb Defusing (CT holding E near planted C4)
    const canDefuse =
      canMove &&
      player.team === 'CT' &&
      this.bombState === 'planted' &&
      player.pos.distanceTo(this.bombPos) < 2.6;

    if (canDefuse && holdingE) {
      if (!player.isDefusing) {
        player.isDefusing = true;
        player.defuseProgress = 0;
        this.playerDefuseSoundPlayed = false;
      }
      if (!this.playerDefuseSoundPlayed) {
        this.sound.playC4DefuseStart();
        this.playerDefuseSoundPlayed = true;
      }
      player.defuseProgress += dt / ROUND_CONFIG.DEFUSE_TIME;
      player.vel.x = 0;
      player.vel.z = 0;
      player.crouching = true;
      if (player.defuseProgress >= 1.0) {
        player.isDefusing = false;
        player.defuseProgress = 0;
        this.completeBombDefuse(player);
      }
    } else if (player.isDefusing) {
      player.isDefusing = false;
      player.defuseProgress = 0;
    }

    // Movement (WASD + Jump)
    if (canMove && !player.isPlanting && !player.isDefusing) {
      let forwardInput = 0;
      let rightInput = 0;
      if (this.keys.has('KeyW')) forwardInput += 1;
      if (this.keys.has('KeyS')) forwardInput -= 1;
      if (this.keys.has('KeyD')) rightInput += 1;
      if (this.keys.has('KeyA')) rightInput -= 1;

      const sinY = Math.sin(player.yaw);
      const cosY = Math.cos(player.yaw);
      // Forward is (-sinY, -cosY), Right is (cosY, -sinY)
      let wishX = -sinY * forwardInput + cosY * rightInput;
      let wishZ = -cosY * forwardInput - sinY * rightInput;
      const wishLen = Math.hypot(wishX, wishZ);
      if (wishLen > 0.001) {
        wishX /= wishLen;
        wishZ /= wishLen;
      }

      let maxSpeed = PHYSICS.BASE_MOVE_SPEED * cfg.moveSpeedMult;
      if (player.scopeLevel > 0) maxSpeed *= 0.56;
      else if (player.crouching) maxSpeed *= PHYSICS.CROUCH_SPEED_MULT;
      else if (player.walking) maxSpeed *= PHYSICS.WALK_SPEED_MULT;

      if (player.grounded) {
        // Friction
        const speed = Math.hypot(player.vel.x, player.vel.z);
        if (speed > 0.01) {
          const drop = speed * PHYSICS.GROUND_FRICTION * dt;
          const newSpeed = Math.max(0, speed - drop) / speed;
          player.vel.x *= newSpeed;
          player.vel.z *= newSpeed;
        }
        // Accelerate
        if (wishLen > 0.001) {
          player.vel.x += wishX * PHYSICS.GROUND_ACCEL * dt;
          player.vel.z += wishZ * PHYSICS.GROUND_ACCEL * dt;
          const horiz = Math.hypot(player.vel.x, player.vel.z);
          if (horiz > maxSpeed) {
            player.vel.x = (player.vel.x / horiz) * maxSpeed;
            player.vel.z = (player.vel.z / horiz) * maxSpeed;
          }
        }
        // Jump
        if (this.keys.has('Space')) {
          player.vel.y = PHYSICS.JUMP_SPEED;
          player.grounded = false;
        }
      } else {
        // Subtle air control
        if (wishLen > 0.001) {
          player.vel.x += wishX * PHYSICS.AIR_ACCEL * dt;
          player.vel.z += wishZ * PHYSICS.AIR_ACCEL * dt;
          const horiz = Math.hypot(player.vel.x, player.vel.z);
          if (horiz > maxSpeed * 1.05) {
            player.vel.x = (player.vel.x / horiz) * maxSpeed * 1.05;
            player.vel.z = (player.vel.z / horiz) * maxSpeed * 1.05;
          }
        }
      }
    } else {
      player.vel.x *= 0.7;
      player.vel.z *= 0.7;
    }

    // Gravity & Collision
    player.vel.y -= PHYSICS.GRAVITY * dt;
    const height = player.crouching ? PHYSICS.PLAYER_CROUCH_HEIGHT : PHYSICS.PLAYER_HEIGHT;
    const res = this.physics.moveCharacter(player.pos, player.vel, dt, height);
    player.grounded = res.grounded;

    // Footstep sound
    this.updateCombatantFootsteps(player, dt);

    // Weapon Firing (LMB)
    if (
      this.pointerLocked &&
      !this.buyMenuOpen &&
      !player.isPlanting &&
      !player.isDefusing &&
      !player.reloading &&
      activeId !== 'c4' &&
      this.roundPhase !== 'freeze'
    ) {
      const triggerFire = cfg.automatic ? this.mouseLeftDown : this.mouseLeftJustPressed;
      if (triggerFire && player.fireCooldown <= 0) {
        this.fireWeapon(player);
      }
    }
  }

  private updateCombatantFootsteps(c: Combatant, dt: number): void {
    const horizSpeed = Math.hypot(c.vel.x, c.vel.z);
    if (c.grounded && horizSpeed > 1.6 && !c.walking && !c.crouching) {
      c.footstepAccum += horizSpeed * dt;
      if (c.footstepAccum >= 2.25) {
        c.footstepAccum = 0;
        const viewed = this.getViewedCombatant();
        const pos = viewed?.id === c.id ? undefined : c.pos;
        this.sound.playFootstep(pos, true);
      }
    } else {
      c.footstepAccum = 0;
    }
  }

  // ===========================================================================
  // WEAPON FIRING, HITBOX RAYCAST & DAMAGE SYSTEM
  // ===========================================================================
  private fireWeapon(shooter: Combatant, botTargetPoint?: THREE.Vector3, heavyKnife = false): void {
    const weaponId = shooter.getActiveWeaponId();
    const cfg = WEAPONS[weaponId];

    if (cfg.isBomb) return;

    // Melee Knife
    if (cfg.isMelee) {
      shooter.fireCooldown = heavyKnife ? 0.85 : 60 / cfg.fireRate;
      const viewed = this.getViewedCombatant();
      if (viewed?.id === shooter.id) {
        this.viewModel.triggerFire('knife');
        this.sound.playWeaponFire('knife');
      } else {
        this.sound.playWeaponFire('knife', shooter.pos);
      }

      const eye = shooter.getEyePosition();
      const dir = shooter.getLookDirection();
      const hit = this.raycastCombatants(shooter, eye, dir, cfg.range);
      if (hit) {
        const dmg = heavyKnife ? 65 : cfg.damage;
        this.applyCombatHit(shooter, hit.victim, hit.zone, dmg, cfg.armorPenetration, weaponId, hit.point);
      }
      return;
    }

    // Gun ammunition check
    const inst = shooter.getActiveWeaponInstance();
    if (!inst) return;
    if (inst.ammoInMag <= 0) {
      if (shooter.startReload()) {
        this.sound.playReload('start', shooter.isHuman ? undefined : shooter.pos);
      }
      return;
    }

    inst.ammoInMag -= 1;
    shooter.fireCooldown = 60 / cfg.fireRate;
    shooter.shotsFiredBurst += 1;

    // Sound & Muzzle Flash
    const viewed = this.getViewedCombatant();
    if (viewed?.id === shooter.id) {
      this.viewModel.triggerFire(weaponId);
      this.sound.playWeaponFire(weaponId);
    } else {
      shooter.model.triggerMuzzleFlash();
      this.sound.playWeaponFire(weaponId, shooter.pos);
    }

    // Compute exact ray direction with spread
    const eye = shooter.getEyePosition();
    let dir: THREE.Vector3;

    if (botTargetPoint) {
      dir = botTargetPoint.clone().sub(eye).normalize();
    } else {
      dir = shooter.getLookDirection();
    }

    const horizSpeed = Math.hypot(shooter.vel.x, shooter.vel.z);
    let spread = cfg.baseSpread + shooter.recoilSpread;
    if (!shooter.grounded) {
      spread += cfg.jumpSpread;
    } else if (horizSpeed > 1.2) {
      spread += cfg.moveSpread * Math.min(1, horizSpeed / PHYSICS.BASE_MOVE_SPEED);
    }
    if (shooter.crouching) spread *= 0.68;
    // Unscoped AWP has large hip-fire inaccuracy; scoped standing AWP is razor sharp
    if (weaponId === 'awp') {
      if (shooter.scopeLevel === 0 && shooter.isHuman) {
        spread += 0.065;
      } else if (shooter.scopeLevel > 0 && horizSpeed < 0.8 && shooter.grounded) {
        spread = 0.0004;
      }
    }

    // Apply random spread cone around ray
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, dir).normalize();
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * spread;
    dir.addScaledVector(right, Math.cos(angle) * radius);
    dir.addScaledVector(up, Math.sin(angle) * radius);
    dir.normalize();

    // 1. Raycast against Dust2 Map geometry first
    const wallHit = this.physics.raycastMap(eye, dir, cfg.range);
    const maxEnemyDist = wallHit ? wallHit.distance : cfg.range;

    // 2. Raycast against Enemy Hitbox Meshes (Head / Chest / Stomach / Arm / Leg)
    const enemyHit = this.raycastCombatants(shooter, eye, dir, maxEnemyDist);

    let tracerEnd: THREE.Vector3;
    if (enemyHit) {
      tracerEnd = enemyHit.point;
      this.applyCombatHit(
        shooter,
        enemyHit.victim,
        enemyHit.zone,
        cfg.damage,
        cfg.armorPenetration,
        weaponId,
        enemyHit.point
      );
      this.spawnImpactSpark(enemyHit.point, '#d92b2b');
    } else if (wallHit) {
      tracerEnd = wallHit.point;
      this.spawnImpactSpark(wallHit.point, '#f2d08a');
      const isMetal = wallHit.materialKind === 'door_metal' || wallHit.materialKind === 'car_metal';
      this.sound.playBulletImpact(wallHit.point, isMetal);
    } else {
      tracerEnd = eye.clone().addScaledVector(dir, cfg.range);
    }

    // Spawn visible bullet tracer
    const tracerStart = eye.clone().addScaledVector(dir, 0.55);
    tracerStart.y -= 0.06;
    this.spawnTracer(tracerStart, tracerEnd, weaponId === 'awp');

    // Apply Recoil Kick (Camera up-kick + horizontal spray + spread bloom)
    shooter.recoilSpread = Math.min(0.11, shooter.recoilSpread + cfg.recoilSpreadGain);
    if (shooter.isHuman) {
      // Fierce AK-47 upward & horizontal kick vs tame M4A4 vs AWP punch
      const burstScale = 1 + Math.min(1.2, shooter.shotsFiredBurst * 0.09);
      const pitchKick = cfg.recoilPitch * (0.85 + Math.random() * 0.3) * burstScale;
      const yawKick = (Math.random() - 0.5) * 2 * cfg.recoilYaw * burstScale;
      shooter.pitch = Math.min(1.45, shooter.pitch + pitchKick);
      shooter.yaw += yawKick;
      shooter.recoilPitchAccum += pitchKick;
    }

    // AWP auto-unscopes after firing bolt shot
    if (weaponId === 'awp' && shooter.scopeLevel > 0) {
      shooter.scopeLevel = 0;
    }

    // Auto-reload when mag hits 0
    if (inst.ammoInMag === 0 && inst.reserveAmmo > 0) {
      if (shooter.startReload()) {
        this.sound.playReload('start', shooter.isHuman ? undefined : shooter.pos);
      }
    }

    if (shooter.isHuman) this.emitHud();
  }

  private raycastCombatants(
    shooter: Combatant,
    origin: THREE.Vector3,
    dir: THREE.Vector3,
    maxDist: number
  ): { victim: Combatant; zone: HitboxZone; distance: number; point: THREE.Vector3 } | null {
    const candidateMeshes: THREE.Object3D[] = [];
    const byId = new Map<string, Combatant>();

    for (const c of this.combatants) {
      if (!c.alive || c.id === shooter.id || c.team === shooter.team) continue;
      // Quick bounding sphere pre-filter
      const center = c.pos.clone();
      center.y += 1.0;
      const toC = center.sub(origin);
      const proj = toC.dot(dir);
      if (proj < -0.5 || proj > maxDist + 1.0) continue;
      const perpSq = toC.lengthSq() - proj * proj;
      if (perpSq > 1.4) continue;

      byId.set(c.id, c);
      c.model.root.updateMatrixWorld(true);
      candidateMeshes.push(...c.model.hitboxMeshes);
    }

    if (candidateMeshes.length === 0) return null;

    this.raycaster.set(origin, dir);
    this.raycaster.near = 0.05;
    this.raycaster.far = maxDist;

    const hits = this.raycaster.intersectObjects(candidateMeshes, false);
    if (hits.length === 0) return null;

    const first = hits[0];
    const agentId = first.object.userData.agentId as string;
    const zone = (first.object.userData.hitboxZone as HitboxZone) || 'chest';
    const victim = byId.get(agentId);
    if (!victim) return null;

    return { victim, zone, distance: first.distance, point: first.point.clone() };
  }

  private applyCombatHit(
    attacker: Combatant,
    victim: Combatant,
    zone: HitboxZone,
    baseDamage: number,
    armorPenetration: number,
    weaponId: WeaponId,
    _hitPoint: THREE.Vector3
  ): void {
    const headshot = zone === 'head';
    const { killed } = victim.applyHitDamage(baseDamage, armorPenetration, zone);

    // Reveal attacker on victim team's radar briefly when shooting
    attacker.lastSpottedTime = this.simTime;

    // Feedback if human player is the attacker
    if (attacker.isHuman) {
      this.hitMarker = {
        active: true,
        headshot,
        kill: killed,
        seq: this.hitMarker.seq + 1,
        timer: killed ? 0.34 : 0.2,
      };
      this.sound.playHitFeedback(headshot);
      if (killed) this.sound.playKillChime(headshot);
    }

    // Feedback if human player is the victim
    if (victim.isHuman) {
      this.damageFlash = Math.min(1, this.damageFlash + (headshot ? 0.85 : 0.5));
      this.sound.playHurt();
      const dx = attacker.pos.x - victim.pos.x;
      const dz = attacker.pos.z - victim.pos.z;
      const worldAngle = Math.atan2(-dx, -dz);
      const relAngle = worldAngle - victim.yaw;
      this.damageIndicators.push({
        id: this.dmgIndSeq++,
        angle: relAngle,
        timestamp: performance.now(),
      });
    }

    if (killed) {
      attacker.kills += 1;
      attacker.money = Math.min(ROUND_CONFIG.MAX_MONEY, attacker.money + WEAPONS[weaponId].killReward);

      // Drop C4 if victim carried it!
      if (victim.hasC4 && this.bombState === 'carried') {
        victim.hasC4 = false;
        this.bombState = 'dropped';
        this.bombPos.copy(victim.pos);
        this.bombWorldMesh.position.copy(this.bombPos);
        this.bombWorldMesh.visible = true;
        this.bombLight.intensity = 1.6;
        this.showAnnouncement('C4 炸弹已掉落！', 2.4);
      }

      // Push live Killfeed entry
      this.killFeed.unshift({
        id: this.killSeq++,
        killerName: attacker.name,
        killerTeam: attacker.team,
        victimName: victim.name,
        victimTeam: victim.team,
        weaponName: WEAPONS[weaponId].shortName,
        headshot,
        timestamp: performance.now(),
      });
      if (this.killFeed.length > 6) this.killFeed.pop();

      // If human died, automatically switch to spectating an alive teammate
      if (victim.isHuman) {
        const aliveMate = this.combatants.find((c) => c.team === this.humanTeam && c.alive);
        if (aliveMate) {
          this.spectateId = aliveMate.id;
          this.showAnnouncement(`你已阵亡 · 按 [E] 接管队友 ${aliveMate.name}`, 4.5);
        }
      }

      this.emitHud();
    }
  }

  // ===========================================================================
  // C4 BOMB SYSTEM & ROUND RESOLUTION
  // ===========================================================================
  private updateBombCarrierAndPickup(): void {
    if (this.bombState === 'carried') {
      const carrier = this.combatants.find((c) => c.alive && c.hasC4);
      if (carrier) {
        this.bombPos.copy(carrier.pos);
        this.bombWorldMesh.visible = false;
      }
    } else if (this.bombState === 'dropped') {
      this.bombWorldMesh.visible = true;
      this.bombWorldMesh.position.copy(this.bombPos);
      // Any alive T walking within 1.8m picks up dropped C4
      for (const c of this.combatants) {
        if (c.alive && c.team === 'T' && c.pos.distanceTo(this.bombPos) < 1.85) {
          c.hasC4 = true;
          this.bombState = 'carried';
          this.bombWorldMesh.visible = false;
          this.bombLight.intensity = 0;
          this.showAnnouncement(`${c.name} 拾取了 C4 炸弹`, 2.2);
          break;
        }
      }
    }
  }

  private completeBombPlant(planter: Combatant, site: 'A' | 'B'): void {
    planter.hasC4 = false;
    planter.money = Math.min(ROUND_CONFIG.MAX_MONEY, planter.money + 300);
    if (planter.primary) planter.switchSlot('primary');
    else if (planter.secondary) planter.switchSlot('secondary');

    this.bombState = 'planted';
    this.bombSite = site;
    this.bombPos.copy(planter.pos);
    this.bombTimer = ROUND_CONFIG.BOMB_TIMER;
    this.bombBeepTimer = 0.05;
    this.roundPhase = 'bomb_planted';
    this.phaseTimer = this.bombTimer;

    this.bombWorldMesh.position.copy(this.bombPos);
    this.bombWorldMesh.visible = true;
    this.sound.playC4Planted();
    this.showAnnouncement(`C4 已在 ${site} 点安放！倒计时 ${ROUND_CONFIG.BOMB_TIMER} 秒`, 3.5);
    this.emitHud();
  }

  private updatePlantedBomb(dt: number): void {
    this.bombBeepTimer -= dt;
    const urgency = 1 - Math.max(0, this.bombTimer / ROUND_CONFIG.BOMB_TIMER);
    // Accelerating beep interval from 1.0s down to 0.14s
    const interval = Math.max(0.14, 1.05 - urgency * 0.92);

    if (this.bombBeepTimer <= 0) {
      this.bombBeepTimer = interval;
      this.sound.playC4Beep(this.bombPos, urgency);
      this.bombLedMesh.visible = true;
      this.bombLight.intensity = 4.5;
    } else if (this.bombBeepTimer < interval * 0.65) {
      this.bombLedMesh.visible = false;
      this.bombLight.intensity = 0.3;
    }
  }

  private completeBombDefuse(defuser: Combatant): void {
    this.bombState = 'defused';
    this.bombLight.intensity = 0;
    this.bombLedMesh.visible = false;
    defuser.money = Math.min(ROUND_CONFIG.MAX_MONEY, defuser.money + 300);
    this.sound.playC4Defused();
    this.finishRound('CT', `C4 已被 ${defuser.name} 成功拆除 · CT 获胜`);
  }

  private detonateBomb(): void {
    this.bombState = 'exploded';
    this.bombWorldMesh.visible = false;
    this.bombLight.intensity = 0;

    // Visual explosion sphere & light + camera shake
    this.explosionMesh.position.copy(this.bombPos);
    this.explosionMesh.scale.setScalar(1);
    this.explosionMesh.visible = true;
    this.explosionLight.position.set(this.bombPos.x, this.bombPos.y + 3, this.bombPos.z);
    this.explosionLight.intensity = 35;
    this.explosionTimer = 1.4;
    this.screenShake = 1.2;

    this.sound.playC4Explosion(this.bombPos);

    // Blast damage to anyone close to the explosion
    for (const c of this.combatants) {
      if (!c.alive) continue;
      const dist = c.pos.distanceTo(this.bombPos);
      if (dist < 24) {
        const dmg = Math.round((1 - dist / 24) * 260);
        c.applyHitDamage(dmg, 1.0, 'chest');
      }
    }

    this.finishRound('T', 'C4 炸弹引爆 · T 获胜');
  }

  private finishRound(winner: Team, subtitle: string): void {
    if (this.roundPhase === 'round_end') return;

    this.roundPhase = 'round_end';
    this.phaseTimer = ROUND_CONFIG.ROUND_END_TIME;
    if (winner === 'CT') this.ctScore += 1;
    else this.tScore += 1;

    // Distribute CS economy rewards
    const bombPlanted = this.bombState === 'planted' || this.bombState === 'exploded' || this.bombState === 'defused';
    for (const c of this.combatants) {
      let bonus = c.team === winner ? ROUND_CONFIG.WIN_REWARD : ROUND_CONFIG.LOSS_REWARD;
      if (c.team === 'T' && winner === 'CT' && bombPlanted) {
        bonus += ROUND_CONFIG.BOMB_PLANT_BONUS;
      }
      c.money = Math.min(ROUND_CONFIG.MAX_MONEY, c.money + bonus);
    }

    this.roundBanner = {
      title: winner === 'CT' ? '反恐精英胜利 (CT WIN)' : '恐怖分子胜利 (T WIN)',
      subtitle,
      team: winner,
    };
    this.sound.playRoundEnd(winner === this.humanTeam);
    this.emitHud();
  }

  // ===========================================================================
  // VISUAL FX (Tracers, Sparks, Explosion, Damage Flash)
  // ===========================================================================
  private spawnTracer(start: THREE.Vector3, end: THREE.Vector3, isAwp: boolean): void {
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({
      color: isAwp ? '#fff5c0' : '#ffdf88',
      transparent: true,
      opacity: isAwp ? 0.9 : 0.6,
    });
    const line = new THREE.Line(geom, mat);
    this.scene.add(line);
    const maxLife = isAwp ? 0.24 : 0.08;
    this.tracers.push({ line, life: maxLife, maxLife });
  }

  private spawnImpactSpark(point: THREE.Vector3, color: string): void {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.11, 0.11),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
    );
    mesh.position.copy(point);
    this.scene.add(mesh);
    this.sparks.push({ mesh, life: 0.22, maxLife: 0.22 });
  }

  private updateVisualFX(dt: number): void {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.scene.remove(t.line);
        t.line.geometry.dispose();
        (t.line.material as THREE.Material).dispose();
        this.tracers.splice(i, 1);
      } else {
        (t.line.material as THREE.LineBasicMaterial).opacity = (t.life / t.maxLife) * 0.75;
      }
    }

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.life -= dt;
      if (s.life <= 0) {
        this.scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        (s.mesh.material as THREE.Material).dispose();
        this.sparks.splice(i, 1);
      } else {
        s.mesh.scale.setScalar(1 + (1 - s.life / s.maxLife) * 1.4);
        (s.mesh.material as THREE.MeshBasicMaterial).opacity = s.life / s.maxLife;
      }
    }

    if (this.hitMarker.timer > 0) {
      this.hitMarker.timer -= dt;
      if (this.hitMarker.timer <= 0) this.hitMarker.active = false;
    }

    if (this.damageFlash > 0) {
      this.damageFlash = Math.max(0, this.damageFlash - dt * 2.2);
    }

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 1.1);
    }

    if (this.explosionTimer > 0) {
      this.explosionTimer -= dt;
      const p = 1 - Math.max(0, this.explosionTimer / 1.4);
      this.explosionMesh.scale.setScalar(1 + p * 22);
      (this.explosionMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - p) * 0.85);
      this.explosionLight.intensity = Math.max(0, (1 - p) * 35);
      if (this.explosionTimer <= 0) {
        this.explosionMesh.visible = false;
      }
    }

    // Prune old killfeed & damage indicators
    const now = performance.now();
    this.killFeed = this.killFeed.filter((k) => now - k.timestamp < 7500);
    this.damageIndicators = this.damageIndicators.filter((d) => now - d.timestamp < 1400);
  }

  // ===========================================================================
  // INPUT & POINTER LOCK BINDINGS
  // ===========================================================================
  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('wheel', this.handleWheel, { passive: true });
    window.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  private handleResize = (): void => {
    const w = this.container.clientWidth;
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private handlePointerLockChange = (): void => {
    this.pointerLocked = document.pointerLockElement === this.renderer.domElement;
    if (!this.pointerLocked && this.started && !this.buyMenuOpen) {
      this.paused = true;
      this.mouseLeftDown = false;
      this.keys.clear();
    } else if (this.pointerLocked) {
      this.paused = false;
      this.buyMenuOpen = false;
    }
    this.emitHud();
  };

  private handleContextMenu = (e: MouseEvent): void => {
    if (this.started) e.preventDefault();
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.pointerLocked || this.paused || this.buyMenuOpen) return;
    const player = this.getHumanPlayer();
    if (!player || !player.alive) return;

    // Lower sensitivity smoothly while scoped in AWP
    const zoomScale = player.scopeLevel === 2 ? 0.32 : player.scopeLevel === 1 ? 0.55 : 1.0;
    player.yaw -= e.movementX * this.mouseSensitivity * zoomScale;
    player.pitch -= e.movementY * this.mouseSensitivity * zoomScale;
    player.pitch = Math.max(-1.46, Math.min(1.46, player.pitch));
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (!this.started || this.paused || this.buyMenuOpen) return;
    this.sound.unlock();

    if (!this.pointerLocked) {
      this.requestPointerLock();
      return;
    }

    const human = this.getHumanPlayer();
    if (!human) return;

    // Spectating controls when dead
    if (!human.alive) {
      if (e.button === 0) this.cycleSpectate(1);
      else if (e.button === 2) this.cycleSpectate(-1);
      return;
    }

    if (e.button === 0) {
      this.mouseLeftDown = true;
      this.mouseLeftJustPressed = true;
    } else if (e.button === 2) {
      const activeId = human.getActiveWeaponId();
      const cfg = WEAPONS[activeId];
      if (cfg.canScope && !human.reloading) {
        // Cycle AWP zoom: 0 -> 1 -> 2 -> 0
        human.scopeLevel = (human.scopeLevel + 1) % 3;
        this.sound.playScope(human.scopeLevel);
        this.emitHud();
      } else if (cfg.isMelee && human.fireCooldown <= 0 && this.roundPhase !== 'freeze') {
        this.fireWeapon(human, undefined, true);
      }
    }
  };

  private handleMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.mouseLeftDown = false;
  };

  private handleWheel = (e: WheelEvent): void => {
    if (!this.pointerLocked || this.paused || this.buyMenuOpen) return;
    const player = this.getHumanPlayer();
    if (!player || !player.alive) return;

    const order: Array<'primary' | 'secondary' | 'melee' | 'c4'> = [];
    if (player.primary) order.push('primary');
    if (player.secondary) order.push('secondary');
    order.push('melee');
    if (player.hasC4) order.push('c4');

    const cur = order.indexOf(player.activeSlot);
    const next = (cur + (e.deltaY > 0 ? 1 : -1) + order.length) % order.length;
    this.switchPlayerSlot(player, order[next]);
  };

  private switchPlayerSlot(
    player: Combatant,
    slot: 'primary' | 'secondary' | 'melee' | 'c4'
  ): void {
    const old = player.activeSlot;
    if (player.switchSlot(slot)) {
      this.prevSlot = old;
      this.viewModel.setWeapon(player.getActiveWeaponId());
      this.emitHud();
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.started) return;

    if (e.code === 'Tab') {
      e.preventDefault();
      this.scoreboardOpen = true;
      this.emitHud();
      return;
    }

    if (e.code === 'KeyB' && !this.paused) {
      const player = this.getHumanPlayer();
      if (player && player.alive && this.canPlayerBuy(player)) {
        this.buyMenuOpen = !this.buyMenuOpen;
        if (this.buyMenuOpen) {
          document.exitPointerLock?.();
        } else {
          this.requestPointerLock();
        }
        this.emitHud();
      } else if (this.buyMenuOpen) {
        this.closeBuyMenu();
      }
      return;
    }

    if (e.code === 'Escape' && this.buyMenuOpen) {
      this.closeBuyMenu();
      return;
    }

    this.keys.add(e.code);

    const player = this.getHumanPlayer();
    if (!player) return;

    // Spectate bot takeover on E, cycle on Space
    if (!player.alive) {
      if (e.code === 'KeyE') this.tryTakeoverSpectatedBot();
      else if (e.code === 'Space') this.cycleSpectate(1);
      return;
    }

    if (this.paused || this.buyMenuOpen) return;

    if (e.code === 'Digit1') this.switchPlayerSlot(player, 'primary');
    else if (e.code === 'Digit2') this.switchPlayerSlot(player, 'secondary');
    else if (e.code === 'Digit3') this.switchPlayerSlot(player, 'melee');
    else if (e.code === 'Digit4' || e.code === 'Digit5') this.switchPlayerSlot(player, 'c4');
    else if (e.code === 'KeyQ') this.switchPlayerSlot(player, this.prevSlot);
    else if (e.code === 'KeyR') {
      if (player.startReload()) {
        this.sound.playReload('start');
        this.emitHud();
      }
    } else if (e.code === 'KeyG') {
      // Drop C4 if carrying it (useful for passing bomb to teammates)
      if (player.hasC4 && this.bombState === 'carried') {
        player.hasC4 = false;
        this.bombState = 'dropped';
        const dropOffset = player.getLookDirection().setY(0).normalize().multiplyScalar(1.4);
        this.bombPos.copy(player.pos).add(dropOffset);
        this.bombWorldMesh.position.copy(this.bombPos);
        this.bombWorldMesh.visible = true;
        if (player.activeSlot === 'c4') {
          player.switchSlot(player.primary ? 'primary' : 'secondary');
          this.viewModel.setWeapon(player.getActiveWeaponId());
        }
        this.showAnnouncement('已丢弃 C4 炸弹', 1.8);
        this.emitHud();
      }
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
    if (e.code === 'Tab') {
      this.scoreboardOpen = false;
      this.emitHud();
    }
  };

  // ===========================================================================
  // HUD SNAPSHOT SERIALIZATION (Synced cleanly to React)
  // ===========================================================================
  private emitHud(): void {
    const human = this.getHumanPlayer();
    const viewed = this.getViewedCombatant() ?? human;
    const activeId = viewed ? viewed.getActiveWeaponId() : 'usp';
    const activeCfg = WEAPONS[activeId];
    const activeInst = viewed?.getActiveWeaponInstance();

    const horizSpeed = viewed ? Math.hypot(viewed.vel.x, viewed.vel.z) : 0;
    const spreadRad =
      activeCfg.baseSpread +
      (viewed?.recoilSpread ?? 0) +
      (viewed && !viewed.grounded ? activeCfg.jumpSpread : (horizSpeed / PHYSICS.BASE_MOVE_SPEED) * activeCfg.moveSpread);
    const crosshairSpread = Math.min(48, Math.max(4, Math.round(spreadRad * 460)));

    const isSpectating = Boolean(human && !human.alive && viewed && viewed.id !== human.id);
    const canTakeoverBot = Boolean(isSpectating && viewed && viewed.alive && !viewed.isHuman);

    const plantZone =
      viewed && viewed.alive
        ? getPlantZoneAt(this.mapData, viewed.pos.x, viewed.pos.y, viewed.pos.z)
        : null;

    // Context action progress & prompt
    let actionProgress: HudState['actionProgress'] = null;
    let interactionPrompt: string | null = null;

    if (viewed && viewed.alive) {
      if (viewed.isPlanting) {
        actionProgress = { label: '正在安放 C4...', progress: viewed.plantProgress };
      } else if (viewed.isDefusing) {
        actionProgress = { label: '正在拆除 C4...', progress: viewed.defuseProgress };
      } else if (!isSpectating) {
        if (
          viewed.team === 'T' &&
          viewed.hasC4 &&
          this.bombState === 'carried' &&
          plantZone &&
          this.roundPhase === 'live'
        ) {
          interactionPrompt = `按住 [E] 在 ${plantZone} 点安放 C4`;
        } else if (
          viewed.team === 'CT' &&
          this.bombState === 'planted' &&
          viewed.pos.distanceTo(this.bombPos) < 2.8
        ) {
          interactionPrompt = '按住 [E] 拆除 C4 炸弹';
        }
      }
    }

    // Minimap agents (enemies only shown if spotted recently by player or AI teammates!)
    const minimapAgents = this.combatants.map((c) => {
      const isEnemy = c.team !== this.humanTeam;
      const sinceSpot = this.simTime - c.lastSpottedTime;
      const spotted = !isEnemy || sinceSpot < 2.2;
      const alpha = !isEnemy ? 1 : Math.max(0, 1 - sinceSpot / 2.2);
      return {
        id: c.id,
        team: c.team,
        x: c.pos.x,
        z: c.pos.z,
        yaw: c.yaw,
        alive: c.alive,
        isPlayer: c.isHuman,
        isSpectated: Boolean(isSpectating && viewed?.id === c.id),
        hasC4: c.hasC4,
        spotted,
        lastSpottedAlpha: alpha,
      };
    });

    // C4 visible on minimap for T team always, and for CT when planted or dropped within LOS
    const c4Visible =
      this.humanTeam === 'T' ||
      this.bombState === 'planted' ||
      (this.bombState === 'dropped' &&
        Boolean(viewed && this.physics.hasLineOfSight(viewed.getEyePosition(), this.bombPos)));

    const hud: HudState = {
      started: this.started,
      paused: this.paused,
      pointerLocked: this.pointerLocked,
      buyMenuOpen: this.buyMenuOpen,
      scoreboardOpen: this.scoreboardOpen,

      playerTeam: this.humanTeam,
      controlledName: human?.name ?? 'YOU',
      isSpectating,
      spectateTargetName: viewed?.name ?? '',
      canTakeoverBot,

      roundNumber: this.roundNumber,
      isPistolRound: this.isCurrentPistolRound(),
      roundPhase: this.roundPhase,
      phaseTimer: Math.max(0, this.phaseTimer),
      ctScore: this.ctScore,
      tScore: this.tScore,
      ctAlive: this.combatants.filter((c) => c.team === 'CT' && c.alive).length,
      tAlive: this.combatants.filter((c) => c.team === 'T' && c.alive).length,
      roundBanner: this.roundBanner,

      hp: viewed?.hp ?? 0,
      armor: viewed?.armor ?? 0,
      hasHelmet: viewed?.hasHelmet ?? false,
      money: viewed?.money ?? 0,
      alive: viewed?.alive ?? false,
      callout: viewed ? getCalloutAt(this.mapData, viewed.pos.x, viewed.pos.z) : 'Dust2',

      activeWeapon: activeId,
      activeWeaponName: activeCfg.name,
      ammoInMag: activeInst?.ammoInMag ?? 0,
      reserveAmmo: activeInst?.reserveAmmo ?? 0,
      reloading: viewed?.reloading ?? false,
      reloadProgress:
        viewed && viewed.reloading && viewed.reloadDuration > 0
          ? 1 - viewed.reloadTimer / viewed.reloadDuration
          : 0,
      scopeLevel: viewed?.scopeLevel ?? 0,
      crosshairSpread,
      slots: {
        primary: viewed?.primary?.id ?? null,
        secondary: viewed?.secondary?.id ?? null,
        melee: 'knife',
        c4: viewed?.hasC4 ?? false,
      },

      inBuyZone: human ? isInBuyZone(this.mapData, human.team, human.pos.x, human.pos.z) : false,
      canBuy: human ? this.canPlayerBuy(human) : false,
      inPlantZone: plantZone,
      bombState: this.bombState,
      bombPlantedSite: this.bombSite,
      bombTimeRemaining: this.bombTimer,
      actionProgress,
      interactionPrompt,

      hitMarker: {
        active: this.hitMarker.active,
        headshot: this.hitMarker.headshot,
        kill: this.hitMarker.kill,
        seq: this.hitMarker.seq,
      },
      damageFlash: this.damageFlash,
      damageIndicators: [...this.damageIndicators],
      killFeed: [...this.killFeed],
      minimapAgents,
      minimapBomb: {
        state: this.bombState,
        x: this.bombPos.x,
        z: this.bombPos.z,
        site: this.bombSite ?? undefined,
        visible: c4Visible,
      },
      scoreboard: this.combatants.map((c) => ({
        id: c.id,
        name: c.name,
        team: c.team,
        alive: c.alive,
        isHuman: c.isHuman,
        kills: c.kills,
        deaths: c.deaths,
        assists: c.assists,
        money: c.money,
        hp: c.hp,
        hasC4: c.hasC4,
        weaponShort: WEAPONS[c.getActiveWeaponId()].shortName,
      })),
      announcement: this.announcement,
    };

    this.onHudUpdate(hud);
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
