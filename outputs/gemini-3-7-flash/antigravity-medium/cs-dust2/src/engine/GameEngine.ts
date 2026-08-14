import * as THREE from 'three';
import {
  CharacterState,
  Team,
  WeaponId,
  WeaponSlot,
  RoundState,
  KillFeedEntry,
  TracerLine,
  HitboxZone,
} from '../types/game';
import { Dust2Map } from '../map/Dust2Map';
import { NavGraph } from '../navigation/NavGraph';
import { HumanoidModel } from '../entities/HumanoidModel';
import { BotController } from '../ai/BotController';
import { ViewModel } from '../weapons/ViewModel';
import { WEAPON_CONFIGS } from '../weapons/WeaponConfig';
import { soundManager } from '../audio/SoundManager';
import { ProceduralTextures } from '../textures/ProceduralTextures';

export interface GameEngineCallbacks {
  onStateUpdate: (state: {
    player: CharacterState;
    round: RoundState;
    allEntities: CharacterState[];
    spectatingEntity: CharacterState | null;
    isSpectating: boolean;
  }) => void;
  onKillFeed: (entry: KillFeedEntry) => void;
  onDamageTaken: (amount: number, isHeadshot: boolean) => void;
  onPlantProgress: (progress: number) => void;
  onDefuseProgress: (progress: number) => void;
}

export class GameEngine {
  public container: HTMLElement;
  public callbacks: GameEngineCallbacks;

  // Three.js Core
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private animFrameId: number = 0;
  private clock: THREE.Clock;

  // Map & Systems
  public map: Dust2Map;
  public navGraph: NavGraph;
  public viewModel: ViewModel;

  // Entities
  public player: CharacterState;
  public playerModel: HumanoidModel;
  public bots: BotController[] = [];
  public allEntities: CharacterState[] = [];

  // Round State
  public roundState: RoundState;

  // Visual Effects
  private tracers: { line: THREE.Line; life: number; maxLife: number }[] = [];
  private particles: { mesh: THREE.Mesh; vel: THREE.Vector3; life: number }[] = [];
  private plantedC4Mesh: THREE.Group | null = null;
  private c4BeepTimer = 0;
  private c4Light: THREE.PointLight | null = null;

  // Controls & Input
  private isPointerLocked = false;
  private keys: Record<string, boolean> = {};
  private mouseButtons: Record<number, boolean> = {};
  private mouseDelta = { x: 0, y: 0 };
  private playerEyeHeight = 1.65;
  private playerRecoilPitch = 0;
  private playerRecoilYaw = 0;
  private shootTimer = 0;
  private actionTimer = 0; // plant / defuse holding timer

  // Spectating
  public isSpectating = false;
  public spectatingTargetId: string | null = null;

  // Screen shake
  private screenShake = 0;

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4e6f1);
    this.scene.fog = new THREE.FogExp2(0xd4e6f1, 0.005);

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.05,
      300
    );
    this.camera.position.set(0, 1.65, 50);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // Build Map & Navigation
    this.map = new Dust2Map();
    this.scene.add(this.map.group);

    this.navGraph = new NavGraph();

    // Setup Lighting & Sky
    this.setupLighting();

    // Player State
    this.player = this.createPlayerState('CT');
    this.playerModel = new HumanoidModel('CT', true);
    this.playerModel.root.visible = false; // invisible in 1st person
    this.scene.add(this.playerModel.root);

    // Viewmodel
    this.viewModel = new ViewModel(this.camera, 'CT');
    this.camera.add(this.viewModel.group);
    this.scene.add(this.camera);

    // Round State
    this.roundState = {
      roundNumber: 1,
      scoreCT: 0,
      scoreT: 0,
      status: 'freezetime',
      timer: 5,
      maxRoundTime: 115,
      bombState: {
        isPlanted: false,
        site: null,
        position: null,
        timer: 40,
        planterId: null,
        carrierId: null,
        isDropped: false,
        droppedPosition: null,
        defusingPlayerId: null,
        defuseProgress: 0,
      },
      winner: null,
      winReason: null,
      isPistolRound: true,
    };

    // Initialize 9 AI Bots (4 CT Teammates, 5 T Enemies)
    this.initBots();

    // Bind event listeners
    this.bindEvents();

    // Start Round 1
    this.startRound(true);

    // Start Render Loop
    this.loop();
  }

  // Beautiful Desert Sun Lighting
  private setupLighting() {
    const ambient = new THREE.HemisphereLight(0xfff6e5, 0x8a795d, 0.7);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffaed, 1.4);
    sun.position.set(45, 80, 45);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 250;
    sun.shadow.camera.left = -90;
    sun.shadow.camera.right = 90;
    sun.shadow.camera.top = 90;
    sun.shadow.camera.bottom = -90;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);
  }

  // Create initial player state
  private createPlayerState(team: Team): CharacterState {
    return {
      id: 'player_0',
      name: 'Player (You)',
      team,
      isPlayer: true,
      isAlive: true,
      health: 100,
      maxHealth: 100,
      armor: 0,
      hasHelmet: false,
      hasDefuseKit: team === 'CT',
      position: new THREE.Vector3(0, 0, -52),
      velocity: new THREE.Vector3(),
      rotation: { yaw: 0, pitch: 0 },
      isGrounded: true,
      isCrouching: false,
      isPlanting: false,
      isDefusing: false,
      isReloading: false,
      isScoped: false,
      currentWeapon: team === 'CT' ? 'usp' : 'glock',
      inventory: {
        primary: null,
        secondary: team === 'CT' ? 'usp' : 'glock',
        knife: 'knife',
        c4: false,
        currentSlot: 'secondary',
        ammo: {
          ak47: { current: 30, reserve: 90 },
          m4a4: { current: 30, reserve: 90 },
          awp: { current: 5, reserve: 30 },
          deagle: { current: 7, reserve: 35 },
          glock: { current: 20, reserve: 120 },
          usp: { current: 12, reserve: 24 },
          knife: { current: 1, reserve: 1 },
          c4: { current: 1, reserve: 1 },
        },
      },
      kills: 0,
      deaths: 0,
      assists: 0,
      score: 0,
      ping: 5,
    };
  }

  // Initialize 4 CT Bots + 5 T Bots
  private initBots() {
    this.bots = [];

    const ctNames = ['Ghost', 'Viper', 'Razor', 'Echo'];
    const tNames = ['Boris', 'Ivan', 'Dimitri', 'Viktor', 'Nikolai'];

    // 4 CT Teammates
    for (let i = 0; i < 4; i++) {
      const bot = new BotController(
        `bot_ct_${i + 1}`,
        ctNames[i],
        'CT',
        new THREE.Vector3(-6 + i * 4, 0, -52),
        this.navGraph,
        this.map
      );
      this.bots.push(bot);
      this.scene.add(bot.model.root);
    }

    // 5 T Enemies
    for (let i = 0; i < 5; i++) {
      const bot = new BotController(
        `bot_t_${i + 1}`,
        tNames[i],
        'T',
        new THREE.Vector3(-8 + i * 4, 0, 58),
        this.navGraph,
        this.map
      );
      this.bots.push(bot);
      this.scene.add(bot.model.root);
    }
  }

  // Start / Reset Round
  public startRound(isPistol: boolean = false) {
    this.roundState.isPistolRound = isPistol;
    this.roundState.status = 'freezetime';
    this.roundState.timer = 5;
    this.roundState.winner = null;
    this.roundState.winReason = null;
    this.roundState.bombState = {
      isPlanted: false,
      site: null,
      position: null,
      timer: 40,
      planterId: null,
      carrierId: null,
      isDropped: false,
      droppedPosition: null,
      defusingPlayerId: null,
      defuseProgress: 0,
    };

    if (this.plantedC4Mesh) {
      this.scene.remove(this.plantedC4Mesh);
      this.plantedC4Mesh = null;
    }
    if (this.c4Light) {
      this.scene.remove(this.c4Light);
      this.c4Light = null;
    }

    // Reset Player
    this.player.isAlive = true;
    this.player.health = 100;
    this.player.armor = isPistol ? 0 : 100;
    this.player.hasHelmet = !isPistol;
    this.player.isPlanting = false;
    this.player.isDefusing = false;
    this.player.isReloading = false;
    this.player.isScoped = false;
    this.isSpectating = false;
    this.spectatingTargetId = null;

    if (this.player.team === 'CT') {
      this.player.position.set(0, 0, -52);
      this.player.rotation.yaw = 0;
      this.player.rotation.pitch = 0;
      if (isPistol) {
        this.player.inventory.primary = null;
        this.player.inventory.secondary = 'usp';
        this.player.inventory.currentSlot = 'secondary';
        this.player.currentWeapon = 'usp';
      }
    } else {
      this.player.position.set(0, 0, 56);
      this.player.rotation.yaw = Math.PI;
      this.player.rotation.pitch = 0;
      if (isPistol) {
        this.player.inventory.primary = null;
        this.player.inventory.secondary = 'glock';
        this.player.inventory.currentSlot = 'secondary';
        this.player.currentWeapon = 'glock';
      }
    }

    // Reset Weapon Ammo
    const pw = this.player.currentWeapon;
    const pCfg = WEAPON_CONFIGS[pw];
    this.player.inventory.ammo[pw] = { current: pCfg.magSize, reserve: pCfg.maxReserve };
    this.viewModel.setWeapon(pw);

    // Pick T strategy & bomb carrier
    const chosenSite: 'A' | 'B' = Math.random() < 0.55 ? 'A' : 'B';
    const tBots = this.bots.filter((b) => b.state.team === 'T');
    const carrierIndex = Math.floor(Math.random() * tBots.length);

    // Reset CT & T Bots
    this.bots.forEach((bot) => {
      const isCT = bot.state.team === 'CT';
      const isCarrier = !isCT && tBots.indexOf(bot) === carrierIndex;

      if (isCT) {
        const idx = this.bots.indexOf(bot);
        bot.state.position.set(-6 + idx * 4, 0, -52);
      } else {
        const idx = tBots.indexOf(bot);
        bot.state.position.set(-8 + idx * 4, 0, 58);
      }

      bot.initRoundStrategy(isPistol, isCarrier, chosenSite);
    });

    // Update entity list
    this.updateEntityList();
  }

  // Switch player weapon
  public setPlayerWeapon(weaponId: WeaponId) {
    if (!this.player.isAlive || this.player.isReloading) return;
    const config = WEAPON_CONFIGS[weaponId];
    this.player.currentWeapon = weaponId;
    this.player.inventory.currentSlot = config.slot;
    this.player.isScoped = false;
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    this.viewModel.setWeapon(weaponId);
    soundManager.playScope(0.2); // weapon draw click
  }

  // Buy weapon / equipment
  public buyWeapon(weaponId: WeaponId) {
    if (this.roundState.status !== 'freezetime' && this.roundState.timer < this.roundState.maxRoundTime - 20) {
      // Allowed during freezetime or first 20s
    }
    const config = WEAPON_CONFIGS[weaponId];
    if (config.slot === 'primary') {
      this.player.inventory.primary = weaponId;
    } else if (config.slot === 'secondary') {
      this.player.inventory.secondary = weaponId;
    }

    this.player.inventory.ammo[weaponId] = { current: config.magSize, reserve: config.maxReserve };
    this.setPlayerWeapon(weaponId);
  }

  // Buy Armor / Helmet / Kit
  public buyGear(type: 'armor' | 'helmet' | 'kit') {
    if (type === 'armor') {
      this.player.armor = 100;
    } else if (type === 'helmet') {
      this.player.armor = 100;
      this.player.hasHelmet = true;
    } else if (type === 'kit') {
      this.player.hasDefuseKit = true;
    }
  }

  // Bind keyboard & mouse events
  private bindEvents() {
    window.addEventListener('resize', this.onWindowResize);

    const dom = this.renderer.domElement;
    dom.addEventListener('click', () => {
      soundManager.unlockAudio();
      if (!this.isPointerLocked) {
        dom.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === dom;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;
      this.mouseDelta.x += e.movementX;
      this.mouseDelta.y += e.movementY;
      this.viewModel.addSway(e.movementX, e.movementY);
    });

    window.addEventListener('mousedown', (e) => {
      soundManager.unlockAudio();
      this.mouseButtons[e.button] = true;

      // Right Click Scope toggle
      if (e.button === 2 && this.isPointerLocked && this.player.isAlive) {
        const config = WEAPON_CONFIGS[this.player.currentWeapon];
        if (config.hasScope) {
          this.player.isScoped = !this.player.isScoped;
          this.camera.fov = this.player.isScoped ? config.scopeZoomFov : 75;
          this.camera.updateProjectionMatrix();
          soundManager.playScope();
        }
      }

      // Spectator click to switch teammate or take over
      if (!this.player.isAlive && this.isSpectating) {
        if (e.button === 0) {
          this.cycleSpectatorTarget();
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseButtons[e.button] = false;
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (!this.player.isAlive) {
        // [E] or Space to Take Control of Bot teammate!
        if (e.code === 'KeyE' || e.code === 'Space') {
          this.takeOverBot();
        }
        return;
      }

      // Weapon Slots (1, 2, 3, 4)
      if (e.code === 'Digit1' && this.player.inventory.primary) {
        this.setPlayerWeapon(this.player.inventory.primary);
      } else if (e.code === 'Digit2') {
        this.setPlayerWeapon(this.player.inventory.secondary);
      } else if (e.code === 'Digit3') {
        this.setPlayerWeapon('knife');
      } else if (e.code === 'Digit4' && this.player.inventory.c4) {
        this.setPlayerWeapon('c4');
      }

      // Reload (R)
      if (e.code === 'KeyR') {
        this.reloadPlayerWeapon();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // Reload player weapon
  public reloadPlayerWeapon() {
    const w = this.player.currentWeapon;
    const config = WEAPON_CONFIGS[w];
    const ammoInfo = this.player.inventory.ammo[w];

    if (this.player.isReloading || ammoInfo.current >= config.magSize || ammoInfo.reserve <= 0 || w === 'knife' || w === 'c4') {
      return;
    }

    this.player.isReloading = true;
    this.player.isScoped = false;
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();

    this.viewModel.triggerReload(config.reloadTime);
    soundManager.playReload(0.8);

    setTimeout(() => {
      if (this.player.isAlive) {
        const needed = config.magSize - ammoInfo.current;
        const toLoad = Math.min(needed, ammoInfo.reserve);
        ammoInfo.current += toLoad;
        ammoInfo.reserve -= toLoad;
        this.player.isReloading = false;
      }
    }, config.reloadTime * 1000);
  }

  // Spectate next alive teammate
  private cycleSpectatorTarget() {
    const aliveTeammates = this.bots.filter((b) => b.state.team === this.player.team && b.state.isAlive);
    if (aliveTeammates.length === 0) return;

    let nextIdx = 0;
    if (this.spectatingTargetId) {
      const currIdx = aliveTeammates.findIndex((b) => b.state.id === this.spectatingTargetId);
      nextIdx = (currIdx + 1) % aliveTeammates.length;
    }
    this.spectatingTargetId = aliveTeammates[nextIdx].state.id;
  }

  // Take over bot teammate
  public takeOverBot() {
    const targetBot = this.bots.find((b) => b.state.id === this.spectatingTargetId && b.state.isAlive);
    if (!targetBot) return;

    // Transfer bot state into player
    this.player.isAlive = true;
    this.player.health = targetBot.state.health;
    this.player.armor = targetBot.state.armor;
    this.player.hasHelmet = targetBot.state.hasHelmet;
    this.player.position.copy(targetBot.state.position);
    this.player.velocity.copy(targetBot.state.velocity);
    this.player.rotation.yaw = targetBot.state.rotation.yaw;
    this.player.rotation.pitch = targetBot.state.rotation.pitch;
    this.player.inventory = { ...targetBot.state.inventory };
    this.player.currentWeapon = targetBot.state.currentWeapon;

    this.viewModel.setWeapon(this.player.currentWeapon);

    // Disable bot
    targetBot.state.isAlive = false;
    targetBot.model.root.visible = false;

    this.isSpectating = false;
    this.spectatingTargetId = null;
  }

  // Firing bullet logic for player and AI
  public fireBullet(
    shooter: CharacterState,
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    weaponId: WeaponId
  ) {
    const config = WEAPON_CONFIGS[weaponId];
    const isPlayer = shooter.isPlayer;

    // Raycast against all enemies' hitboxes
    let closestDist = 200;
    let hitResult: {
      entity: CharacterState;
      bot?: BotController;
      hitbox: HitboxZone;
      point: THREE.Vector3;
      multiplier: number;
    } | null = null;

    const ray = new THREE.Ray(origin, direction);
    const hitPoint = new THREE.Vector3();

    // Check hit against player (if bot shooter)
    if (!isPlayer && this.player.isAlive && this.player.team !== shooter.team) {
      this.playerModel.updateHitboxes();
      for (const hb of this.playerModel.hitboxes) {
        if (ray.intersectBox(hb.box, hitPoint)) {
          const dist = origin.distanceTo(hitPoint);
          if (dist < closestDist) {
            closestDist = dist;
            hitResult = {
              entity: this.player,
              hitbox: hb.zone,
              point: hitPoint.clone(),
              multiplier: hb.multiplier,
            };
          }
        }
      }
    }

    // Check hit against bots
    for (const bot of this.bots) {
      if (!bot.state.isAlive || bot.state.team === shooter.team) continue;

      for (const hb of bot.model.hitboxes) {
        if (ray.intersectBox(hb.box, hitPoint)) {
          const dist = origin.distanceTo(hitPoint);
          if (dist < closestDist) {
            closestDist = dist;
            hitResult = {
              entity: bot.state,
              bot,
              hitbox: hb.zone,
              point: hitPoint.clone(),
              multiplier: hb.multiplier,
            };
          }
        }
      }
    }

    // Check map wall collision
    const mapHit = this.map.raycast(origin, direction, closestDist);
    let bulletEndPoint = origin.clone().add(direction.clone().multiplyScalar(150));

    if (mapHit && (!hitResult || mapHit.distance < closestDist)) {
      // Hit wall / obstacle
      bulletEndPoint = mapHit.point;
      this.createWallImpact(mapHit.point, mapHit.normal, mapHit.materialType);
      soundManager.playRicochet(0.4);
    } else if (hitResult) {
      // Hit enemy character!
      bulletEndPoint = hitResult.point;
      const isHeadshot = hitResult.hitbox === 'head';
      const baseDmg = config.damage * hitResult.multiplier;

      this.createBloodImpact(hitResult.point);

      if (isHeadshot) {
        soundManager.playHeadshotDink(1.0);
      } else {
        soundManager.playHitFlesh(0.8);
      }

      if (hitResult.entity.isPlayer) {
        // Player damaged
        let dmg = baseDmg;
        if (this.player.armor > 0) {
          const armoredDmg = dmg * config.armorPenetration;
          this.player.armor = Math.max(0, this.player.armor - (dmg - armoredDmg) * 0.5);
          dmg = armoredDmg;
        }
        this.player.health = Math.max(0, this.player.health - Math.round(dmg));
        this.callbacks.onDamageTaken(Math.round(dmg), isHeadshot);

        if (this.player.health <= 0) {
          this.player.isAlive = false;
          this.player.deaths++;
          this.isSpectating = true;
          this.cycleSpectatorTarget();

          this.callbacks.onKillFeed({
            id: `kf_${Date.now()}_${Math.random()}`,
            killerId: shooter.id,
            killerName: shooter.name,
            killerTeam: shooter.team,
            victimId: this.player.id,
            victimName: this.player.name,
            victimTeam: this.player.team,
            weapon: weaponId,
            isHeadshot,
            isWallbang: false,
            isNoScope: false,
            timestamp: Date.now(),
          });
        }
      } else if (hitResult.bot) {
        // Bot damaged
        const result = hitResult.bot.takeDamage(baseDmg, shooter, hitResult.hitbox);

        if (isPlayer) {
          this.screenShake = isHeadshot ? 0.05 : 0.02;
        }

        if (result.isKilled) {
          shooter.kills++;
          shooter.score += 2;
          if (isPlayer) soundManager.playKillFeedback();

          // Drop C4 if carrier
          if (hitResult.bot.state.inventory.c4) {
            this.roundState.bombState.isDropped = true;
            this.roundState.bombState.droppedPosition = hitResult.bot.state.position.clone();
          }

          this.callbacks.onKillFeed({
            id: `kf_${Date.now()}_${Math.random()}`,
            killerId: shooter.id,
            killerName: shooter.name,
            killerTeam: shooter.team,
            victimId: hitResult.bot.state.id,
            victimName: hitResult.bot.state.name,
            victimTeam: hitResult.bot.state.team,
            weapon: weaponId,
            isHeadshot,
            isWallbang: false,
            isNoScope: weaponId === 'awp' && !shooter.isScoped,
            timestamp: Date.now(),
          });
        }
      }
    }

    // Spawn visual tracer line
    this.createTracer(origin, bulletEndPoint);
  }

  // Create tracer line
  private createTracer(start: THREE.Vector3, end: THREE.Vector3) {
    const points = [start.clone(), end.clone()];
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffd27d,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });
    const line = new THREE.Line(geom, mat);
    this.scene.add(line);
    this.tracers.push({ line, life: 0.08, maxLife: 0.08 });
  }

  // Create wall spark & dust
  private createWallImpact(pos: THREE.Vector3, normal: THREE.Vector3, matType: string) {
    const pMat = new THREE.MeshBasicMaterial({ color: 0xffcc44 });
    const pGeom = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(pGeom, pMat);
      p.position.copy(pos);
      const vel = normal.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 2, (Math.random() - 0.5) * 2)).normalize().multiplyScalar(4 + Math.random() * 4);
      this.scene.add(p);
      this.particles.push({ mesh: p, vel, life: 0.25 });
    }
  }

  // Create blood splatter
  private createBloodImpact(pos: THREE.Vector3) {
    const bMat = new THREE.MeshBasicMaterial({ color: 0x990000 });
    const bGeom = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(bGeom, bMat);
      p.position.copy(pos);
      const vel = new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3);
      this.scene.add(p);
      this.particles.push({ mesh: p, vel, life: 0.35 });
    }
  }

  // Plant C4 in 3D world
  private spawnPlantedC4(pos: THREE.Vector3, site: 'A' | 'B') {
    this.roundState.bombState.isPlanted = true;
    this.roundState.bombState.site = site;
    this.roundState.bombState.position = pos.clone();
    this.roundState.bombState.timer = 40;
    this.roundState.status = 'bomb_planted';

    soundManager.playBombPlanted();

    // 3D Planted C4 Model
    this.plantedC4Mesh = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.15, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x8a6e4b, roughness: 0.9 })
    );
    body.position.y = 0.075;
    this.plantedC4Mesh.add(body);

    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.03, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    pad.position.set(0, 0.16, -0.04);
    this.plantedC4Mesh.add(pad);

    this.plantedC4Mesh.position.copy(pos);
    this.scene.add(this.plantedC4Mesh);

    // Beeping LED Light
    this.c4Light = new THREE.PointLight(0xff0000, 0, 10);
    this.c4Light.position.set(pos.x, pos.y + 0.3, pos.z);
    this.scene.add(this.c4Light);
  }

  // Detonate C4
  private detonateC4() {
    soundManager.playC4Explosion();
    this.screenShake = 0.4;

    if (this.plantedC4Mesh) {
      this.scene.remove(this.plantedC4Mesh);
      this.plantedC4Mesh = null;
    }
    if (this.c4Light) {
      this.scene.remove(this.c4Light);
      this.c4Light = null;
    }

    // Kill players in blast radius
    const bombPos = this.roundState.bombState.position;
    if (bombPos) {
      if (this.player.isAlive && this.player.position.distanceTo(bombPos) < 45) {
        this.player.health = 0;
        this.player.isAlive = false;
        this.player.deaths++;
      }
      this.bots.forEach((b) => {
        if (b.state.isAlive && b.state.position.distanceTo(bombPos) < 45) {
          b.state.health = 0;
          b.state.isAlive = false;
          b.state.deaths++;
          b.model.kill();
        }
      });
    }

    this.endRound('T', 'Target Bombed');
  }

  // Defuse C4 completed
  private defuseC4Success() {
    if (this.plantedC4Mesh) {
      this.scene.remove(this.plantedC4Mesh);
      this.plantedC4Mesh = null;
    }
    if (this.c4Light) {
      this.scene.remove(this.c4Light);
      this.c4Light = null;
    }
    this.endRound('CT', 'Bomb Defused');
  }

  // End Round
  private endRound(winner: Team, reason: string) {
    this.roundState.status = 'round_end';
    this.roundState.winner = winner;
    this.roundState.winReason = reason;

    if (winner === 'CT') {
      this.roundState.scoreCT++;
      soundManager.playRoundWin(true);
    } else {
      this.roundState.scoreT++;
      soundManager.playRoundWin(false);
    }

    // Reset for next round after 5 seconds
    setTimeout(() => {
      this.roundState.roundNumber++;
      this.startRound(false); // standard buy rounds after pistol
    }, 5000);
  }

  // Update loop
  private loop = () => {
    this.animFrameId = requestAnimationFrame(this.loop);
    const dt = Math.min(0.1, this.clock.getDelta());

    this.updateRoundLogic(dt);
    this.updatePlayer(dt);
    this.updateBots(dt);
    this.updateVisualEffects(dt);
    this.updateCamera(dt);

    this.updateEntityList();

    // Broadcast state to React UI
    const spectatingEntity = this.isSpectating
      ? this.bots.find((b) => b.state.id === this.spectatingTargetId)?.state || null
      : null;

    this.callbacks.onStateUpdate({
      player: this.player,
      round: this.roundState,
      allEntities: this.allEntities,
      spectatingEntity,
      isSpectating: this.isSpectating,
    });

    this.renderer.render(this.scene, this.camera);
  };

  // Update Round timer & win checks
  private updateRoundLogic(dt: number) {
    if (this.roundState.status === 'freezetime') {
      this.roundState.timer -= dt;
      if (this.roundState.timer <= 0) {
        this.roundState.status = 'live';
        this.roundState.timer = this.roundState.maxRoundTime;
      }
      return;
    }

    if (this.roundState.status === 'live') {
      this.roundState.timer -= dt;
      if (this.roundState.timer <= 0) {
        // Time ran out -> CT Wins
        this.endRound('CT', 'Time Expired');
        return;
      }

      // Check Team Elimination
      const aliveCT = (this.player.team === 'CT' && this.player.isAlive ? 1 : 0) +
        this.bots.filter((b) => b.state.team === 'CT' && b.state.isAlive).length;
      const aliveT = (this.player.team === 'T' && this.player.isAlive ? 1 : 0) +
        this.bots.filter((b) => b.state.team === 'T' && b.state.isAlive).length;

      if (aliveT === 0) {
        this.endRound('CT', 'Terrorists Eliminated');
        return;
      }
      if (aliveCT === 0) {
        this.endRound('T', 'Counter-Terrorists Eliminated');
        return;
      }
    }

    if (this.roundState.status === 'bomb_planted') {
      this.roundState.bombState.timer -= dt;

      // Beeping rate increases as timer decreases
      const remaining = this.roundState.bombState.timer;
      const beepInterval = Math.max(0.12, remaining / 40.0 * 1.0);
      this.c4BeepTimer += dt;
      if (this.c4BeepTimer >= beepInterval) {
        this.c4BeepTimer = 0;
        soundManager.playC4Beep(0.8);
        if (this.c4Light) {
          this.c4Light.intensity = 3.0;
          setTimeout(() => {
            if (this.c4Light) this.c4Light.intensity = 0;
          }, 60);
        }
      }

      if (this.roundState.bombState.timer <= 0) {
        this.detonateC4();
        return;
      }

      // Check if all CTs eliminated post-plant
      const aliveCT = (this.player.team === 'CT' && this.player.isAlive ? 1 : 0) +
        this.bots.filter((b) => b.state.team === 'CT' && b.state.isAlive).length;
      if (aliveCT === 0) {
        // Even if all CTs dead, wait for bomb to explode or declare T victory
      }
    }
  }

  // Update Player controls & physics
  private updatePlayer(dt: number) {
    if (!this.player.isAlive || this.isSpectating) return;

    const isFrozen = this.roundState.status === 'freezetime';

    // Mouse Look (Yaw & Pitch)
    if (this.isPointerLocked) {
      const sens = 0.0022;
      this.player.rotation.yaw -= this.mouseDelta.x * sens;
      this.player.rotation.pitch -= this.mouseDelta.y * sens;
      this.player.rotation.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.player.rotation.pitch));
      this.mouseDelta.x = 0;
      this.mouseDelta.y = 0;
    }

    // WASD Movement
    let moveForward = 0;
    let moveRight = 0;

    if (!isFrozen) {
      if (this.keys['KeyW']) moveForward += 1;
      if (this.keys['KeyS']) moveForward -= 1;
      if (this.keys['KeyA']) moveRight -= 1;
      if (this.keys['KeyD']) moveRight += 1;
    }

    const isCrouching = this.keys['ControlLeft'] || this.keys['KeyC'];
    const isSprinting = this.keys['ShiftLeft'];
    this.player.isCrouching = isCrouching;

    let baseSpeed = 5.2; // CS run speed ~250 units/s
    if (isCrouching) baseSpeed = 2.4;
    else if (isSprinting) baseSpeed = 3.0; // walking

    const moveVec = new THREE.Vector2(moveRight, moveForward);
    if (moveVec.lengthSq() > 0) moveVec.normalize();

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.rotation.yaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.player.rotation.yaw);

    const targetVelX = (forward.x * moveVec.y + right.x * moveVec.x) * baseSpeed;
    const targetVelZ = (forward.z * moveVec.y + right.z * moveVec.x) * baseSpeed;

    // Smooth movement acceleration
    const accel = this.player.isGrounded ? 15 : 2.5;
    this.player.velocity.x += (targetVelX - this.player.velocity.x) * accel * dt;
    this.player.velocity.z += (targetVelZ - this.player.velocity.z) * accel * dt;

    // Jumping
    if (this.keys['Space'] && this.player.isGrounded && !isFrozen) {
      this.player.velocity.y = 6.2;
      this.player.isGrounded = false;
      soundManager.playFootstep(0.6);
    }

    // Gravity
    this.player.velocity.y -= 19.6 * dt;

    // Position step & World Collision
    const nextPos = this.player.position.clone();
    nextPos.x += this.player.velocity.x * dt;
    nextPos.y += this.player.velocity.y * dt;
    nextPos.z += this.player.velocity.z * dt;

    const col = this.map.checkEntityCollision(nextPos, 0.45, isCrouching ? 1.2 : 1.8);
    this.player.position.copy(col.position);
    this.player.isGrounded = col.isGrounded;

    if (col.isGrounded && this.player.velocity.y < 0) {
      this.player.velocity.y = 0;
    }

    // Weapon Firing (Left Mouse Click)
    this.shootTimer -= dt;
    if (this.mouseButtons[0] && this.isPointerLocked && !isFrozen) {
      this.handlePlayerFire();
    }

    // Objective Interactions: Plant C4 / Defuse C4 (Hold E)
    this.handlePlayerInteractions(dt);

    // Update Viewmodel
    const speed = new THREE.Vector2(this.player.velocity.x, this.player.velocity.z).length();
    this.viewModel.update(dt, speed, this.player.isGrounded, this.player.isScoped);
  }

  // Handle player firing weapon
  private handlePlayerFire() {
    const weaponId = this.player.currentWeapon;
    const config = WEAPON_CONFIGS[weaponId];
    const ammoInfo = this.player.inventory.ammo[weaponId];

    if (this.player.isReloading || this.shootTimer > 0) return;

    if (weaponId === 'knife') {
      this.shootTimer = 1.0 / config.fireRate;
      soundManager.playKnifeSlash();
      this.viewModel.triggerShoot(0.02, 0.01);

      // Melee stab raycast
      const origin = this.camera.position.clone();
      const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      this.fireBullet(this.player, origin, dir, 'knife');
      return;
    }

    if (weaponId === 'c4') return; // C4 is planted with E key

    if (ammoInfo.current <= 0) {
      this.reloadPlayerWeapon();
      return;
    }

    // Fire bullet
    ammoInfo.current--;
    this.shootTimer = 1.0 / config.fireRate;

    // Recoil kickback to camera
    this.player.rotation.pitch += config.recoilPitch * 0.4;
    this.player.rotation.yaw += (Math.random() - 0.5) * config.recoilYaw * 0.4;

    this.viewModel.triggerShoot(config.recoilPitch, config.recoilYaw);
    soundManager.playWeaponShot(weaponId);

    // Calculate spread based on movement & scoping
    const speed = new THREE.Vector2(this.player.velocity.x, this.player.velocity.z).length();
    let spread = config.spreadBase + (speed > 1 ? config.spreadMove : 0);
    if (this.player.isScoped) spread = config.scopedSpread;

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    dir.x += (Math.random() - 0.5) * spread;
    dir.y += (Math.random() - 0.5) * spread;
    dir.z += (Math.random() - 0.5) * spread;
    dir.normalize();

    this.fireBullet(this.player, this.camera.position.clone(), dir, weaponId);
  }

  // Handle Plant / Defuse holding [E]
  private handlePlayerInteractions(dt: number) {
    const holdingE = this.keys['KeyE'] && this.isPointerLocked;

    // 1. T Player Planting C4
    if (this.player.team === 'T' && this.player.inventory.c4 && !this.roundState.bombState.isPlanted) {
      const site = this.map.getBombSiteAt(this.player.position);
      if (site && holdingE) {
        this.player.isPlanting = true;
        this.actionTimer += dt;
        soundManager.playC4Planting(0.4);
        this.callbacks.onPlantProgress(this.actionTimer / 3.0);

        if (this.actionTimer >= 3.0) {
          // Plant Complete!
          this.player.isPlanting = false;
          this.player.inventory.c4 = false;
          this.actionTimer = 0;
          this.callbacks.onPlantProgress(0);
          this.spawnPlantedC4(this.player.position.clone(), site);
        }
        return;
      }
    }

    // 2. CT Player Defusing C4
    if (this.player.team === 'CT' && this.roundState.bombState.isPlanted && this.roundState.bombState.position) {
      const dist = this.player.position.distanceTo(this.roundState.bombState.position);
      if (dist < 2.8 && holdingE) {
        this.player.isDefusing = true;
        this.actionTimer += dt;
        soundManager.playC4Defusing(0.5);

        const goal = this.player.hasDefuseKit ? 5.0 : 10.0;
        this.callbacks.onDefuseProgress(this.actionTimer / goal);

        if (this.actionTimer >= goal) {
          // Defusal Complete!
          this.player.isDefusing = false;
          this.actionTimer = 0;
          this.callbacks.onDefuseProgress(0);
          this.defuseC4Success();
        }
        return;
      }
    }

    this.player.isPlanting = false;
    this.player.isDefusing = false;
    if (this.actionTimer > 0) {
      this.actionTimer = 0;
      this.callbacks.onPlantProgress(0);
      this.callbacks.onDefuseProgress(0);
    }
  }

  // Update AI Bots
  private updateBots(dt: number) {
    const bombPlanted = this.roundState.bombState.isPlanted;
    const bombPos = this.roundState.bombState.position;

    this.bots.forEach((bot) => {
      bot.update(
        dt,
        this.allEntities,
        bombPlanted,
        bombPos,
        (shooter, origin, dir, weaponId) => {
          this.fireBullet(shooter, origin, dir, weaponId);
        }
      );

      // Check if bot completed plant
      if (bot.state.isPlanting && bot.actionTimer >= 3.0) {
        const site = this.map.getBombSiteAt(bot.state.position) || 'A';
        this.spawnPlantedC4(bot.state.position.clone(), site);
      }

      // Check if bot completed defuse
      if (bot.state.isDefusing) {
        const goal = bot.state.hasDefuseKit ? 5.0 : 10.0;
        if (bot.actionTimer >= goal) {
          this.defuseC4Success();
        }
      }
    });
  }

  // Update Particles & Bullet Tracers
  private updateVisualEffects(dt: number) {
    // Tracers decay
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      const mat = t.line.material as THREE.LineBasicMaterial;
      mat.opacity = t.life / t.maxLife;
      if (t.life <= 0) {
        this.scene.remove(t.line);
        this.tracers.splice(i, 1);
      }
    }

    // Particles physics & decay
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= 9.8 * dt;
      p.mesh.scale.multiplyScalar(0.95);
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }

    // Screen Shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 1.5);
    }
  }

  // Update Camera position (First person / Spectator)
  private updateCamera(dt: number) {
    if (this.isSpectating) {
      const targetBot = this.bots.find((b) => b.state.id === this.spectatingTargetId && b.state.isAlive);
      if (targetBot) {
        // Smooth 3rd person chase camera over teammate shoulder
        const targetPos = targetBot.state.position.clone().add(new THREE.Vector3(0, 1.8, 0));
        const rotY = targetBot.state.rotation.yaw;
        const camOffset = new THREE.Vector3(0.5, 0.4, 2.2).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
        this.camera.position.copy(targetPos.clone().add(camOffset));
        this.camera.lookAt(targetPos);
      } else {
        this.cycleSpectatorTarget();
      }
      return;
    }

    // Player first person camera
    const eyeY = this.player.position.y + (this.player.isCrouching ? 1.1 : this.playerEyeHeight);
    this.camera.position.set(this.player.position.x, eyeY, this.player.position.z);

    // Apply Screen Shake
    if (this.screenShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.screenShake;
      this.camera.position.y += (Math.random() - 0.5) * this.screenShake;
      this.camera.position.z += (Math.random() - 0.5) * this.screenShake;
    }

    // Euler rotation for FPS camera
    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.y = this.player.rotation.yaw;
    this.camera.rotation.x = this.player.rotation.pitch;
  }

  // Update consolidated entity list for UI
  private updateEntityList() {
    this.allEntities = [this.player, ...this.bots.map((b) => b.state)];
  }

  // Cleanup
  public destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }
}
