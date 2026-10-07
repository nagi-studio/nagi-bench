import * as THREE from 'three';
import {
  Team,
  WeaponId,
  WeaponSlot,
  HitboxZone,
  RoundPhase,
  KillfeedEntry,
  PlayerInventory,
  C4State,
  MinimapEntity,
  GameStats,
} from '../types/game';
import { Dust2Map } from '../map/Dust2Map';
import { WaypointGraph } from '../ai/WaypointGraph';
import { AIBot } from '../ai/AIBot';
import { WEAPON_CONFIGS, WeaponFactory } from '../procedural/weapons';
import { soundSynth } from '../audio/SoundSynthesizer';
import { HitboxUserData } from '../procedural/character';

export interface GameEngineCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onInventoryUpdate: (inventory: PlayerInventory) => void;
  onPlayerHealthUpdate: (hp: number, armor: number) => void;
  onKillfeedAdd: (entry: KillfeedEntry) => void;
  onHitmarker: (isHeadshot: boolean) => void;
  onScopeChange: (isScoped: boolean) => void;
  onMinimapUpdate: (entities: MinimapEntity[]) => void;
  onSpectateChange: (spectatingBotName: string | null) => void;
}

export class GameEngine {
  private container: HTMLElement;
  private callbacks: GameEngineCallbacks;

  // Three.js Core
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;

  // Map & Navigation
  public map: Dust2Map;
  public navGraph: WaypointGraph;

  // Player State
  public playerTeam: Team = 'CT';
  public playerPosition: THREE.Vector3 = new THREE.Vector3();
  public playerVelocity: THREE.Vector3 = new THREE.Vector3();
  public playerRotation: { pitch: number; yaw: number } = { pitch: 0, yaw: 0 };
  public playerHealth: number = 100;
  public playerArmor: number = 100;
  public isPlayerAlive: boolean = true;
  public isPlayerOnGround: boolean = true;
  public isScoped: boolean = false;

  // Player Inventory
  public inventory: PlayerInventory = {
    primary: 'm4a4',
    secondary: 'usp',
    knife: 'knife',
    c4: false,
    currentSlot: 'primary',
    ammo: {
      ak47: { current: 30, reserve: 90 },
      m4a4: { current: 30, reserve: 90 },
      awp: { current: 5, reserve: 30 },
      glock: { current: 20, reserve: 120 },
      usp: { current: 12, reserve: 24 },
      deagle: { current: 7, reserve: 35 },
      knife: { current: 1, reserve: 1 },
      c4: { current: 1, reserve: 1 },
    },
  };

  // First-Person Viewmodel
  private viewmodelCamera: THREE.PerspectiveCamera;
  private viewmodelScene: THREE.Scene;
  private viewmodelGroup: THREE.Group;
  private currentViewmodelMesh: THREE.Group | null = null;
  private muzzleFlashLight: THREE.PointLight;
  private muzzleFlashMesh: THREE.Mesh;
  private muzzleFlashTimer: number = 0;
  private viewmodelSway: { x: number; y: number } = { x: 0, y: 0 };
  private recoilPitch: number = 0;
  private recoilYaw: number = 0;
  private walkBobTimer: number = 0;

  // 5v5 Bots (4 Teammates, 5 Enemies)
  public bots: AIBot[] = [];

  // Match & Round Management
  public roundPhase: RoundPhase = 'freeze';
  public roundNumber: number = 1;
  public isPistolRound: boolean = true;
  public roundTimeLeft: number = 115; // 1:55
  public scoreCT: number = 0;
  public scoreT: number = 0;
  public winner: Team | null = null;
  public winReason: string = '';

  // C4 Bomb State
  public c4State: C4State = {
    status: 'carried',
    position: new THREE.Vector3(),
    plantedSite: null,
    carrierId: null,
    timer: 40,
    maxTimer: 40,
    plantProgress: 0,
    defuseProgress: 0,
  };
  private droppedC4Mesh: THREE.Group | null = null;
  private plantedC4Mesh: THREE.Group | null = null;
  private c4BeepTimer: number = 0;

  // Spectator State
  public spectatingBotIndex: number = 0;

  // Input & Controls
  private keys: { [key: string]: boolean } = {};
  private isPointerLocked: boolean = false;
  private isMouseDown: boolean = false;
  private shootCooldown: number = 0;
  private reloadTimer: number = 0;
  private isPlanting: boolean = false;
  private isDefusing: boolean = false;
  private animationFrameId: number | null = null;

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Initialize Main Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.FogExp2(0xbeaf9e, 0.0035);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 400);

    // 2. Initialize Viewmodel Scene & Camera (renders on top of world without clipping)
    this.viewmodelScene = new THREE.Scene();
    this.viewmodelCamera = new THREE.PerspectiveCamera(65, aspect, 0.01, 10);
    this.viewmodelGroup = new THREE.Group();
    this.viewmodelScene.add(this.viewmodelGroup);

    // Viewmodel lighting
    const vmLight = new THREE.DirectionalLight(0xffffff, 1.2);
    vmLight.position.set(1, 2, 2);
    this.viewmodelScene.add(vmLight);
    const vmAmbient = new THREE.AmbientLight(0xfff5ea, 0.8);
    this.viewmodelScene.add(vmAmbient);

    // Muzzle Flash
    this.muzzleFlashLight = new THREE.PointLight(0xffa500, 0, 10);
    this.viewmodelScene.add(this.muzzleFlashLight);
    const flashGeo = new THREE.DodecahedronGeometry(0.04);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.visible = false;
    this.viewmodelGroup.add(this.muzzleFlashMesh);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    container.appendChild(this.renderer.domElement);

    // 4. Procedural Map & NavGraph
    this.map = new Dust2Map(this.scene);
    this.navGraph = new WaypointGraph();

    // 5. Initialize Bots
    this.initBots();

    // 6. Setup Controls & Listeners
    this.setupEventListeners();

    // 7. Start Round 1
    this.startRound(true);

    // 8. Start Game Loop
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  // Initialize 9 AI Bots (4 Teammates, 5 Enemies)
  private initBots() {
    const ctNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
    const tNames = ['Phoenix', 'Viper', 'Kobra', 'Raven', 'Ghost'];

    let botIdx = 1;
    // Teammates & Enemies
    const ctBotsCount = this.playerTeam === 'CT' ? 4 : 5;
    const tBotsCount = this.playerTeam === 'T' ? 4 : 5;

    for (let i = 0; i < ctBotsCount; i++) {
      const name = `Bot ${ctNames[i]}`;
      const bot = new AIBot(`bot_ct_${i}`, name, 'CT', this.scene, 'usp');
      bot.targetSite = i % 2 === 0 ? 'A' : 'B';
      this.bots.push(bot);
    }

    for (let i = 0; i < tBotsCount; i++) {
      const name = `Bot ${tNames[i]}`;
      const bot = new AIBot(`bot_t_${i}`, name, 'T', this.scene, 'glock');
      bot.targetSite = i % 2 === 0 ? 'A' : 'B';
      this.bots.push(bot);
    }
  }

  // Setup Event Listeners for Keyboard, Mouse, PointerLock
  private setupEventListeners() {
    // Pointer Lock
    this.container.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        this.container.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.container;
    });

    // Mouse Move (Look around)
    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;

      const sensitivity = this.isScoped ? 0.0008 : 0.0022;
      this.playerRotation.yaw -= e.movementX * sensitivity;
      this.playerRotation.pitch -= e.movementY * sensitivity;

      // Clamp pitch (-89 to +89 degrees)
      this.playerRotation.pitch = Math.max(-Math.PI / 2.05, Math.min(Math.PI / 2.05, this.playerRotation.pitch));

      // Viewmodel Sway
      this.viewmodelSway.x -= e.movementX * 0.0003;
      this.viewmodelSway.y -= e.movementY * 0.0003;
    });

    // Mouse Click (Fire / Scope)
    window.addEventListener('mousedown', (e) => {
      soundSynth.init();
      if (!this.isPointerLocked) return;

      if (e.button === 0) {
        this.isMouseDown = true;
        this.handlePlayerFire();
      } else if (e.button === 2) {
        // Right Click: AWP Scope toggle
        e.preventDefault();
        const currentWeapon = this.getCurrentWeaponId();
        if (currentWeapon === 'awp') {
          this.toggleScope();
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Slot switching
      if (e.code === 'Digit1') this.switchSlot('primary');
      if (e.code === 'Digit2') this.switchSlot('secondary');
      if (e.code === 'Digit3') this.switchSlot('knife');
      if (e.code === 'Digit5' && this.inventory.c4) this.switchSlot('c4');

      // Reload
      if (e.code === 'KeyR') this.reloadCurrentWeapon();

      // Bot takeover on death (E key)
      if (e.code === 'KeyE' && !this.isPlayerAlive) {
        this.takeoverSpectatedBot();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Window resize
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.viewmodelCamera.aspect = w / h;
      this.viewmodelCamera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // Get currently held weapon ID
  public getCurrentWeaponId(): WeaponId {
    const slot = this.inventory.currentSlot;
    if (slot === 'primary' && this.inventory.primary) return this.inventory.primary;
    if (slot === 'secondary') return this.inventory.secondary;
    if (slot === 'knife') return 'knife';
    if (slot === 'c4' && this.inventory.c4) return 'c4';
    return this.inventory.secondary;
  }

  // Switch Active Weapon Slot
  public switchSlot(slot: WeaponSlot) {
    if (slot === 'primary' && !this.inventory.primary) return;
    if (slot === 'c4' && !this.inventory.c4) return;

    if (this.isScoped) {
      this.toggleScope(); // Unscope when switching
    }

    this.inventory.currentSlot = slot;
    this.updateViewmodelMesh();
    this.callbacks.onInventoryUpdate({ ...this.inventory });
  }

  // Buy or Select Weapon (AK47, M4A4, AWP, Deagle)
  public buyWeapon(weaponId: WeaponId) {
    const config = WEAPON_CONFIGS[weaponId];
    if (config.slot === 'primary') {
      this.inventory.primary = weaponId;
      this.inventory.ammo[weaponId] = {
        current: config.magazineSize,
        reserve: config.maxReserveAmmo,
      };
      this.switchSlot('primary');
    } else if (config.slot === 'secondary') {
      this.inventory.secondary = weaponId;
      this.inventory.ammo[weaponId] = {
        current: config.magazineSize,
        reserve: config.maxReserveAmmo,
      };
      this.switchSlot('secondary');
    }
    soundSynth.playReload(weaponId);
    this.callbacks.onInventoryUpdate({ ...this.inventory });
  }

  // Update Procedural 3D First-Person Viewmodel Mesh
  private updateViewmodelMesh() {
    const weaponId = this.getCurrentWeaponId();
    if (this.currentViewmodelMesh) {
      this.viewmodelGroup.remove(this.currentViewmodelMesh);
    }

    const mesh = WeaponFactory.createWeaponModel(weaponId, true);
    // Position comfortably in right hand in first person
    if (weaponId === 'knife') {
      mesh.position.set(0.18, -0.18, -0.35);
      mesh.rotation.set(0.2, -0.2, 0);
    } else if (weaponId === 'awp') {
      mesh.position.set(0.22, -0.24, -0.42);
      mesh.rotation.set(0.05, -0.05, 0);
    } else {
      mesh.position.set(0.2, -0.22, -0.38);
      mesh.rotation.set(0.08, -0.05, 0);
    }

    this.viewmodelGroup.add(mesh);
    this.currentViewmodelMesh = mesh;
  }

  // AWP Right-Click Scope Zoom
  private toggleScope() {
    this.isScoped = !this.isScoped;
    soundSynth.playScopeZoom();
    this.camera.fov = this.isScoped ? 20 : 75;
    this.camera.updateProjectionMatrix();

    // Hide viewmodel when looking through scope
    if (this.currentViewmodelMesh) {
      this.currentViewmodelMesh.visible = !this.isScoped;
    }
    this.callbacks.onScopeChange(this.isScoped);
  }

  // Player Firing Mechanics
  private handlePlayerFire() {
    if (!this.isPlayerAlive || this.roundPhase === 'freeze' || this.roundPhase === 'ended') return;

    const weaponId = this.getCurrentWeaponId();
    const config = WEAPON_CONFIGS[weaponId];
    const ammoData = this.inventory.ammo[weaponId];

    if (this.shootCooldown > 0) return;

    // Knife attack
    if (weaponId === 'knife') {
      this.shootCooldown = 1 / config.fireRate;
      soundSynth.playGunshot('knife');
      this.performRaycastShot(weaponId, config);
      return;
    }

    // C4 item selected
    if (weaponId === 'c4') {
      return; // C4 is planted via hold E
    }

    // Out of ammo
    if (ammoData.current <= 0) {
      this.reloadCurrentWeapon();
      return;
    }

    // Fire bullet
    ammoData.current--;
    this.shootCooldown = 1 / config.fireRate;

    // Viewmodel Recoil Impulse & Camera Kick
    this.recoilPitch += config.recoilVertical;
    this.recoilYaw += (Math.random() - 0.5) * config.recoilHorizontal;
    this.viewmodelSway.y += 0.025;

    // Trigger Muzzle Flash
    this.triggerMuzzleFlash();

    // Play Procedural Web Audio Gunshot
    soundSynth.playGunshot(weaponId);

    // Hitbox Raycast Shot
    this.performRaycastShot(weaponId, config);

    // Update React HUD ammo
    this.callbacks.onInventoryUpdate({ ...this.inventory });

    // AWP bolt action unscope briefly
    if (weaponId === 'awp' && this.isScoped) {
      this.toggleScope();
    }
  }

  // Muzzle flash flash effect
  private triggerMuzzleFlash() {
    this.muzzleFlashLight.intensity = 4;
    this.muzzleFlashMesh.visible = true;
    this.muzzleFlashTimer = 0.05;
  }

  // Raycast Hit Detection against Enemy Hitboxes
  private performRaycastShot(weaponId: WeaponId, config: typeof WEAPON_CONFIGS[WeaponId]) {
    // Ray direction with spread
    const spreadAngle = (this.isPlayerOnGround ? 1 : 3.5) * (this.isScoped ? 0.1 : 1.0) * config.spread;
    const spreadX = (Math.random() - 0.5) * spreadAngle;
    const spreadY = (Math.random() - 0.5) * spreadAngle;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), this.camera);
    raycaster.far = config.range;

    // Collect all enemy bot hitbox meshes
    const enemyHitboxes: THREE.Mesh[] = [];
    this.bots.forEach((bot) => {
      if (bot.isAlive && bot.team !== this.playerTeam) {
        enemyHitboxes.push(...bot.character.hitboxMeshes);
      }
    });

    const intersects = raycaster.intersectObjects(enemyHitboxes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitboxMesh = hit.object as THREE.Mesh;
      const userData = hitboxMesh.userData as HitboxUserData;

      // Verify line of sight (no wall in front)
      const hitDistance = hit.distance;
      const wallCheckClear = this.map.checkLineOfSight(this.camera.position, hit.point);

      if (wallCheckClear) {
        const targetBot = this.bots.find((b) => b.id === userData.characterId);
        if (targetBot && targetBot.isAlive) {
          const isHeadshot = userData.zone === 'head';
          const multiplier = isHeadshot ? config.headshotMultiplier : userData.multiplier;
          const rawDamage = config.damage * multiplier;

          const result = targetBot.takeDamage(rawDamage, config.armorPenetration);

          // Hit marker audio feedback
          soundSynth.playHitMarker(isHeadshot);
          this.callbacks.onHitmarker(isHeadshot);

          if (result.fatal) {
            // Kill confirmed!
            soundSynth.playKillSound();
            this.callbacks.onKillfeedAdd({
              id: `kill_${Date.now()}_${Math.random()}`,
              killerName: 'You',
              killerTeam: this.playerTeam,
              victimName: targetBot.name,
              victimTeam: targetBot.team,
              weapon: weaponId,
              isHeadshot,
              timestamp: Date.now(),
            });

            // If carrier died, drop C4
            if (targetBot.hasC4) {
              this.dropC4(targetBot.position);
            }
          }
        }
      }
    }
  }

  // Reload current weapon
  public reloadCurrentWeapon() {
    const weaponId = this.getCurrentWeaponId();
    const config = WEAPON_CONFIGS[weaponId];
    const ammoData = this.inventory.ammo[weaponId];

    if (ammoData.current >= config.magazineSize || ammoData.reserve <= 0 || this.reloadTimer > 0) return;

    this.reloadTimer = config.reloadTime;
    soundSynth.playReload(weaponId);

    // Slight viewmodel reload dip
    this.viewmodelSway.y -= 0.08;
  }

  // Round Initialization
  public startRound(isPistol: boolean = false) {
    this.roundPhase = 'freeze';
    this.isPistolRound = isPistol;
    this.roundTimeLeft = 115;
    this.winner = null;
    this.winReason = '';
    this.isScoped = false;
    this.camera.fov = 75;
    this.camera.updateProjectionMatrix();
    this.callbacks.onScopeChange(false);

    // Reset C4 state
    this.c4State.status = 'carried';
    this.c4State.timer = 40;
    this.c4State.plantProgress = 0;
    this.c4State.defuseProgress = 0;
    this.c4State.plantedSite = null;
    if (this.droppedC4Mesh) this.scene.remove(this.droppedC4Mesh);
    if (this.plantedC4Mesh) this.scene.remove(this.plantedC4Mesh);

    // 1. Spawn Player
    this.playerHealth = 100;
    this.playerArmor = 100;
    this.isPlayerAlive = true;

    const spawns = this.playerTeam === 'CT' ? this.map.ctSpawns : this.map.tSpawns;
    this.playerPosition.copy(spawns[0]);
    this.playerRotation.pitch = 0;
    this.playerRotation.yaw = this.playerTeam === 'CT' ? Math.PI : 0; // CT faces South, T faces North
    this.camera.position.set(this.playerPosition.x, this.playerPosition.y + 1.65, this.playerPosition.z);

    // Setup inventory based on round type
    if (isPistol) {
      this.inventory.primary = null;
      this.inventory.secondary = this.playerTeam === 'CT' ? 'usp' : 'glock';
      this.inventory.currentSlot = 'secondary';
    } else {
      this.inventory.primary = this.playerTeam === 'CT' ? 'm4a4' : 'ak47';
      this.inventory.secondary = this.playerTeam === 'CT' ? 'usp' : 'glock';
      this.inventory.currentSlot = 'primary';
    }

    const secConfig = WEAPON_CONFIGS[this.inventory.secondary];
    this.inventory.ammo[this.inventory.secondary] = {
      current: secConfig.magazineSize,
      reserve: secConfig.maxReserveAmmo,
    };
    if (this.inventory.primary) {
      const primConfig = WEAPON_CONFIGS[this.inventory.primary];
      this.inventory.ammo[this.inventory.primary] = {
        current: primConfig.magazineSize,
        reserve: primConfig.maxReserveAmmo,
      };
    }

    this.updateViewmodelMesh();

    // 2. Spawn Bots
    let ctIdx = 1;
    let tIdx = this.playerTeam === 'T' ? 1 : 0;

    this.bots.forEach((bot) => {
      if (bot.team === 'CT') {
        const spawnPos = this.map.ctSpawns[ctIdx % this.map.ctSpawns.length];
        ctIdx++;
        bot.setLoadout(isPistol ? null : 'm4a4', 'usp');
        bot.spawn(spawnPos, Math.PI);
      } else {
        const spawnPos = this.map.tSpawns[tIdx % this.map.tSpawns.length];
        tIdx++;
        bot.setLoadout(isPistol ? null : 'ak47', 'glock');
        bot.spawn(spawnPos, 0);
      }
    });

    // 3. Assign C4 Bomb to a Terrorist
    if (this.playerTeam === 'T') {
      this.inventory.c4 = true;
      this.c4State.carrierId = 'player';
    } else {
      this.inventory.c4 = false;
      const tBots = this.bots.filter((b) => b.team === 'T');
      if (tBots.length > 0) {
        tBots[0].hasC4 = true;
        this.c4State.carrierId = tBots[0].id;
      }
    }

    soundSynth.playRoundStart();
    this.callbacks.onPlayerHealthUpdate(this.playerHealth, this.playerArmor);
    this.callbacks.onInventoryUpdate({ ...this.inventory });
  }

  // Drop physical C4 on ground
  public dropC4(pos: THREE.Vector3) {
    this.c4State.status = 'dropped';
    this.c4State.position.copy(pos);
    this.c4State.carrierId = null;

    if (!this.droppedC4Mesh) {
      this.droppedC4Mesh = WeaponFactory.createWeaponModel('c4', false);
    }
    this.droppedC4Mesh.position.copy(pos);
    this.droppedC4Mesh.position.y = 0.05;
    this.scene.add(this.droppedC4Mesh);
  }

  // Plant C4 at Site
  public plantC4(site: 'A' | 'B', pos: THREE.Vector3) {
    this.c4State.status = 'planted';
    this.c4State.plantedSite = site;
    this.c4State.position.copy(pos);
    this.c4State.timer = 40;
    this.roundPhase = 'planted';

    if (this.droppedC4Mesh) this.scene.remove(this.droppedC4Mesh);

    if (!this.plantedC4Mesh) {
      this.plantedC4Mesh = WeaponFactory.createWeaponModel('c4', false);
    }
    this.plantedC4Mesh.position.copy(pos);
    this.plantedC4Mesh.position.y = pos.y + 0.05;
    this.scene.add(this.plantedC4Mesh);

    soundSynth.playC4Beep();
  }

  // Defuse C4
  public defuseC4() {
    this.c4State.status = 'defused';
    this.endRound('CT', 'Bomb Defused');
  }

  // Detonate C4
  private detonateC4() {
    this.c4State.status = 'exploded';
    soundSynth.playC4Explosion();

    // Damage all players in radius
    const c4Pos = this.c4State.position;
    const distToPlayer = this.playerPosition.distanceTo(c4Pos);
    if (distToPlayer < 40 && this.isPlayerAlive) {
      this.playerHealth = 0;
      this.isPlayerAlive = false;
      this.callbacks.onPlayerHealthUpdate(0, 0);
    }

    this.bots.forEach((bot) => {
      if (bot.isAlive && bot.position.distanceTo(c4Pos) < 40) {
        bot.takeDamage(500, 1.0);
      }
    });

    this.endRound('T', 'Target Bombed');
  }

  // End Round & check scores
  public endRound(winner: Team, reason: string) {
    if (this.roundPhase === 'ended') return;

    this.roundPhase = 'ended';
    this.winner = winner;
    this.winReason = reason;

    if (winner === 'CT') this.scoreCT++;
    else this.scoreT++;

    soundSynth.playRoundWin(winner);

    // Schedule next round in 5 seconds
    setTimeout(() => {
      this.roundNumber++;
      this.startRound(false); // weapon rounds after pistol round
    }, 5000);
  }

  // Take over spectated teammate bot when player is dead
  public takeoverSpectatedBot() {
    const livingTeammates = this.bots.filter((b) => b.team === this.playerTeam && b.isAlive);
    if (livingTeammates.length === 0) return;

    const bot = livingTeammates[this.spectatingBotIndex % livingTeammates.length];
    if (!bot) return;

    // Transfer bot state to player
    this.playerPosition.copy(bot.position);
    this.playerHealth = bot.health;
    this.playerArmor = bot.armor;
    this.isPlayerAlive = true;

    this.inventory.primary = bot.primaryWeapon;
    this.inventory.secondary = bot.secondaryWeapon;
    this.inventory.currentSlot = bot.primaryWeapon ? 'primary' : 'secondary';
    this.inventory.c4 = bot.hasC4;

    // Despawn bot mesh as player takes it over
    this.scene.remove(bot.character.root);
    bot.isAlive = false;

    this.updateViewmodelMesh();
    this.callbacks.onPlayerHealthUpdate(this.playerHealth, this.playerArmor);
    this.callbacks.onInventoryUpdate({ ...this.inventory });
    this.callbacks.onSpectateChange(null);
  }

  // Main Game Loop (Physics, Controls, AI, Audio, Render)
  public loop() {
    const dt = Math.min(this.clock.getDelta(), 0.08); // clamp delta time

    // 1. Update Match State & Timers
    if (this.roundPhase === 'freeze') {
      this.roundTimeLeft -= dt;
      if (this.roundTimeLeft <= 111) {
        this.roundPhase = 'live';
      }
    } else if (this.roundPhase === 'live') {
      this.roundTimeLeft -= dt;
      if (this.roundTimeLeft <= 0) {
        this.endRound('CT', 'Time Expired');
      }
    } else if (this.roundPhase === 'planted') {
      this.c4State.timer -= dt;
      // Accelerating beep intervals
      const beepInterval = Math.max(0.15, this.c4State.timer / 30);
      this.c4BeepTimer += dt;
      if (this.c4BeepTimer >= beepInterval) {
        this.c4BeepTimer = 0;
        soundSynth.playC4Beep();
      }

      if (this.c4State.timer <= 0) {
        this.detonateC4();
      }
    }

    // 2. Update Player Controls & Movement
    if (this.isPlayerAlive && this.roundPhase !== 'freeze') {
      this.updatePlayerMovement(dt);
    } else if (!this.isPlayerAlive) {
      // Spectate alive teammates
      this.updateSpectatorCamera(dt);
    }

    // 3. Viewmodel sway, recoil recovery, and reload timer
    this.updateViewmodel(dt);

    // 4. Update Bots
    this.updateBots(dt);

    // 5. Check Objective Interactivity (C4 Plant & Defuse)
    this.updateObjectives(dt);

    // 6. Check Win Conditions
    this.checkWinConditions();

    // 7. Update Minimap Entities
    this.updateMinimap();

    // 8. Render Scene
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.viewmodelScene, this.viewmodelCamera);

    // 9. Sync HUD callbacks
    this.callbacks.onStatsUpdate({
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      roundNumber: this.roundNumber,
      isPistolRound: this.isPistolRound,
      roundPhase: this.roundPhase,
      roundTimeLeft: Math.max(0, this.roundTimeLeft),
      c4: { ...this.c4State },
      winner: this.winner,
      winReason: this.winReason,
    });

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  // Player First-Person Physics Movement
  private updatePlayerMovement(dt: number) {
    const isShift = this.keys['ShiftLeft'] || this.keys['ShiftRight'];
    const isCtrl = this.keys['ControlLeft'] || this.keys['ControlRight'];
    const speed = isCtrl ? 2.5 : (isShift ? 3.5 : 6.0);

    // Input Direction Vector
    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.z += 1;
    if (this.keys['KeyS']) moveDir.z -= 1;
    if (this.keys['KeyA']) moveDir.x -= 1;
    if (this.keys['KeyD']) moveDir.x += 1;
    moveDir.normalize();

    // Transform by Camera Yaw
    const forward = new THREE.Vector3(Math.sin(this.playerRotation.yaw), 0, Math.cos(this.playerRotation.yaw));
    const right = new THREE.Vector3(Math.cos(this.playerRotation.yaw), 0, -Math.sin(this.playerRotation.yaw));

    const targetVelX = (right.x * moveDir.x + forward.x * moveDir.z) * speed;
    const targetVelZ = (right.z * moveDir.x + forward.z * moveDir.z) * speed;

    this.playerVelocity.x += (targetVelX - this.playerVelocity.x) * 15 * dt;
    this.playerVelocity.z += (targetVelZ - this.playerVelocity.z) * 15 * dt;

    // Gravity & Jump
    if (this.isPlayerOnGround) {
      this.playerVelocity.y = 0;
      if (this.keys['Space']) {
        this.playerVelocity.y = 5.2; // Jump impulse
        this.isPlayerOnGround = false;
      }
    } else {
      this.playerVelocity.y -= 18.0 * dt; // Gravity
    }

    // Apply movement delta
    this.playerPosition.x += this.playerVelocity.x * dt;
    this.playerPosition.y += this.playerVelocity.y * dt;
    this.playerPosition.z += this.playerVelocity.z * dt;

    // Footstep audio
    const horizSpeed = Math.hypot(this.playerVelocity.x, this.playerVelocity.z);
    if (horizSpeed > 1.5 && this.isPlayerOnGround) {
      this.walkBobTimer += dt * horizSpeed * 2.5;
      if (Math.sin(this.walkBobTimer) > 0.98) {
        soundSynth.playFootstep();
      }
    }

    // Physics collision resolution against Dust2 map
    const eyeHeight = isCtrl ? 1.15 : 1.65;
    const resolved = this.map.resolveCollision(this.playerPosition, 0.45, eyeHeight);
    this.playerPosition.copy(resolved.position);
    this.isPlayerOnGround = resolved.onGround;

    // Update Camera Position & Orientation
    this.camera.position.set(this.playerPosition.x, this.playerPosition.y + eyeHeight, this.playerPosition.z);

    // Combine player look pitch and recoil pitch
    const totalPitch = this.playerRotation.pitch + this.recoilPitch;
    const totalYaw = this.playerRotation.yaw + this.recoilYaw;

    this.camera.rotation.set(0, 0, 0);
    this.camera.rotation.y = totalYaw;
    this.camera.rotation.x = totalPitch;

    // Continuous automatic fire when holding left click
    const weaponId = this.getCurrentWeaponId();
    const config = WEAPON_CONFIGS[weaponId];
    if (this.isMouseDown && config.automatic) {
      this.handlePlayerFire();
    }
  }

  // Update Viewmodel swaying & bobbing
  private updateViewmodel(dt: number) {
    this.shootCooldown = Math.max(0, this.shootCooldown - dt);

    // Muzzle flash timer
    if (this.muzzleFlashTimer > 0) {
      this.muzzleFlashTimer -= dt;
      if (this.muzzleFlashTimer <= 0) {
        this.muzzleFlashLight.intensity = 0;
        this.muzzleFlashMesh.visible = false;
      }
    }

    // Recoil recovery
    this.recoilPitch = Math.max(0, this.recoilPitch - dt * 0.4);
    this.recoilYaw *= 0.85;

    // Reload timer
    if (this.reloadTimer > 0) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        const weaponId = this.getCurrentWeaponId();
        const config = WEAPON_CONFIGS[weaponId];
        const ammo = this.inventory.ammo[weaponId];
        const needed = config.magazineSize - ammo.current;
        const take = Math.min(needed, ammo.reserve);
        ammo.current += take;
        ammo.reserve -= take;
        this.callbacks.onInventoryUpdate({ ...this.inventory });
      }
    }

    // Smooth sway decay
    this.viewmodelSway.x *= 0.88;
    this.viewmodelSway.y *= 0.88;

    // Movement bobbing
    const horizSpeed = Math.hypot(this.playerVelocity.x, this.playerVelocity.z);
    const bobX = Math.cos(this.walkBobTimer * 0.5) * 0.005 * horizSpeed;
    const bobY = Math.sin(this.walkBobTimer) * 0.006 * horizSpeed;

    this.viewmodelGroup.position.set(this.viewmodelSway.x + bobX, this.viewmodelSway.y + bobY, 0);
  }

  // Spectator mode camera update when dead
  private updateSpectatorCamera(dt: number) {
    const livingTeammates = this.bots.filter((b) => b.team === this.playerTeam && b.isAlive);
    if (livingTeammates.length === 0) return;

    const bot = livingTeammates[this.spectatingBotIndex % livingTeammates.length];
    if (!bot) return;

    this.callbacks.onSpectateChange(bot.name);

    // Position camera just behind bot's head
    const targetPos = bot.position.clone().add(new THREE.Vector3(0, 1.65, 0));
    this.camera.position.lerp(targetPos, 10 * dt);
    this.camera.rotation.y = bot.rotationY;
    this.camera.rotation.x = -0.05;
  }

  // Update AI Bots
  private updateBots(dt: number) {
    // Collect all living players and bots for targeting
    const allLivingEntities: {
      id: string;
      position: THREE.Vector3;
      team: Team;
      isAlive: boolean;
      takeDamage: (dmg: number, pen: number) => { fatal: boolean };
    }[] = [];

    if (this.isPlayerAlive) {
      allLivingEntities.push({
        id: 'player',
        position: this.playerPosition,
        team: this.playerTeam,
        isAlive: true,
        takeDamage: (dmg: number, pen: number) => {
          let finalDmg = dmg;
          if (this.playerArmor > 0) {
            const absorbed = dmg * (1 - pen);
            finalDmg = dmg * pen;
            this.playerArmor = Math.max(0, this.playerArmor - absorbed * 0.5);
          }
          finalDmg = Math.round(finalDmg);
          this.playerHealth = Math.max(0, this.playerHealth - finalDmg);
          this.callbacks.onPlayerHealthUpdate(this.playerHealth, this.playerArmor);

          if (this.playerHealth <= 0) {
            this.isPlayerAlive = false;
            if (this.inventory.c4) {
              this.inventory.c4 = false;
              this.dropC4(this.playerPosition);
            }
            return { fatal: true };
          }
          return { fatal: false };
        },
      });
    }

    this.bots.forEach((bot) => {
      if (bot.isAlive) {
        allLivingEntities.push({
          id: bot.id,
          position: bot.position,
          team: bot.team,
          isAlive: true,
          takeDamage: (dmg, pen) => bot.takeDamage(dmg, pen),
        });
      }
    });

    // Update each bot
    this.bots.forEach((bot) => {
      if (!bot.isAlive) return;

      // Scan perception
      bot.updatePerception(allLivingEntities, this.map);

      // Execute behavior tree & movement
      bot.update(
        dt,
        this.navGraph,
        this.map,
        this.c4State,
        allLivingEntities,
        (firingBot, hitPlayerId, zone) => {
          if (!hitPlayerId) return;

          const target = allLivingEntities.find((e) => e.id === hitPlayerId);
          if (target && target.isAlive) {
            const config = WEAPON_CONFIGS[firingBot.equippedWeapon];
            const isHeadshot = zone === 'head';
            const mult = isHeadshot ? config.headshotMultiplier : 1.0;
            const res = target.takeDamage(config.damage * mult, config.armorPenetration);

            if (res.fatal) {
              const victimName = target.id === 'player' ? 'You' : this.bots.find((b) => b.id === target.id)?.name || 'Bot';
              this.callbacks.onKillfeedAdd({
                id: `kill_${Date.now()}_${Math.random()}`,
                killerName: firingBot.name,
                killerTeam: firingBot.team,
                victimName,
                victimTeam: target.team,
                weapon: firingBot.equippedWeapon,
                isHeadshot,
                timestamp: Date.now(),
              });
            }
          }
        },
        () => {
          // Bot planted C4!
          const site = this.map.getPlantSiteAt(bot.position) || 'A';
          this.plantC4(site, bot.position);
        },
        () => {
          // Bot defused C4!
          this.defuseC4();
        }
      );
    });
  }

  // Check C4 Interaction (Planting, Defusing, Dropped C4 Pickup)
  private updateObjectives(dt: number) {
    // 1. Pick up dropped C4
    if (this.c4State.status === 'dropped') {
      const distToPlayer = this.playerPosition.distanceTo(this.c4State.position);
      if (distToPlayer < 2.0 && this.isPlayerAlive && this.playerTeam === 'T') {
        this.inventory.c4 = true;
        this.c4State.status = 'carried';
        this.c4State.carrierId = 'player';
        if (this.droppedC4Mesh) this.scene.remove(this.droppedC4Mesh);
        this.callbacks.onInventoryUpdate({ ...this.inventory });
      }

      // Bots picking up dropped C4
      this.bots.forEach((bot) => {
        if (bot.team === 'T' && bot.isAlive && this.c4State.status === 'dropped') {
          if (bot.position.distanceTo(this.c4State.position) < 2.0) {
            bot.hasC4 = true;
            this.c4State.status = 'carried';
            this.c4State.carrierId = bot.id;
            if (this.droppedC4Mesh) this.scene.remove(this.droppedC4Mesh);
          }
        }
      });
    }

    // 2. Player Planting C4
    const isHoldingE = this.keys['KeyE'] || (this.isMouseDown && this.inventory.currentSlot === 'c4');
    const plantSite = this.map.getPlantSiteAt(this.playerPosition);

    if (this.isPlayerAlive && this.playerTeam === 'T' && this.inventory.c4 && plantSite && isHoldingE) {
      this.isPlanting = true;
      this.c4State.plantProgress = Math.min(1.0, this.c4State.plantProgress + dt / 3.2);
      soundSynth.playC4ButtonPress();

      if (this.c4State.plantProgress >= 1.0) {
        this.inventory.c4 = false;
        this.plantC4(plantSite, this.playerPosition.clone());
        this.c4State.plantProgress = 0;
        this.switchSlot('primary');
      }
    } else if (this.isPlanting && !isHoldingE) {
      this.isPlanting = false;
      this.c4State.plantProgress = 0;
    }

    // 3. Player Defusing C4
    if (this.isPlayerAlive && this.playerTeam === 'CT' && this.c4State.status === 'planted') {
      const distToC4 = this.playerPosition.distanceTo(this.c4State.position);
      if (distToC4 < 2.6 && this.keys['KeyE']) {
        this.isDefusing = true;
        this.c4State.defuseProgress = Math.min(1.0, this.c4State.defuseProgress + dt / 5.0);
        if (Math.random() < 0.2) soundSynth.playDefuseCut();

        if (this.c4State.defuseProgress >= 1.0) {
          this.defuseC4();
          this.c4State.defuseProgress = 0;
        }
      } else if (this.isDefusing && !this.keys['KeyE']) {
        this.isDefusing = false;
        this.c4State.defuseProgress = 0;
      }
    }
  }

  // Check Round Elimination Win Conditions
  private checkWinConditions() {
    if (this.roundPhase !== 'live') return;

    let livingCT = this.playerTeam === 'CT' && this.isPlayerAlive ? 1 : 0;
    let livingT = this.playerTeam === 'T' && this.isPlayerAlive ? 1 : 0;

    this.bots.forEach((b) => {
      if (b.isAlive) {
        if (b.team === 'CT') livingCT++;
        else livingT++;
      }
    });

    if (livingCT === 0) {
      this.endRound('T', 'Counter-Terrorists Eliminated');
    } else if (livingT === 0 && this.c4State.status !== 'planted') {
      this.endRound('CT', 'Terrorists Eliminated');
    }
  }

  // Update Minimap (Radar) data
  private updateMinimap() {
    const entities: MinimapEntity[] = [];

    // Player
    if (this.isPlayerAlive) {
      entities.push({
        id: 'player',
        position: this.playerPosition,
        rotationY: this.playerRotation.yaw,
        team: this.playerTeam,
        isAlive: true,
        isPlayer: true,
        isSpotted: true,
        hasC4: this.inventory.c4,
      });
    }

    // Bots
    this.bots.forEach((bot) => {
      const isTeammate = bot.team === this.playerTeam;
      // Enemy is spotted if any teammate or player has line of sight
      let isSpotted = isTeammate;
      if (!isTeammate && bot.isAlive) {
        if (this.isPlayerAlive && this.map.checkLineOfSight(this.camera.position, bot.position)) {
          isSpotted = true;
        }
      }

      entities.push({
        id: bot.id,
        position: bot.position,
        rotationY: bot.rotationY,
        team: bot.team,
        isAlive: bot.isAlive,
        isPlayer: false,
        isSpotted,
        hasC4: bot.hasC4,
      });
    });

    this.callbacks.onMinimapUpdate(entities);
  }

  // Cleanup
  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }
}
