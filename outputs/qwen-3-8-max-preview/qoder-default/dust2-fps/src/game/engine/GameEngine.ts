import * as THREE from 'three';
import {
  GameState, CharacterState, Vec3, Team, WeaponSlot, WeaponId,
  WEAPONS, HITZONE_MULTIPLIERS, HitZone, KillFeedEntry,
  GRAVITY, JUMP_FORCE, MOVE_SPEED, PLAYER_HEIGHT, PLAYER_RADIUS,
  C4_PLANT_TIME, C4_DEFUSE_TIME, C4_EXPLODE_TIME, FREEZE_TIME
} from '../types';
import { Dust2Map } from '../world/Dust2Map';
import { Pathfinder } from '../ai/Pathfinder';
import { InputManager } from './InputManager';
import { audioManager } from './AudioManager';
import { CharacterModel } from '../render/CharacterModel';
import { WeaponViewModel } from '../render/WeaponViewModel';

export class GameEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  map: Dust2Map;
  pathfinder: Pathfinder;
  input: InputManager;
  state: GameState;
  characterModels: Map<number, CharacterModel> = new Map();
  weaponViewModel: WeaponViewModel;
  private clock = new THREE.Clock();
  private animationId = 0;
  private footstepTimer = 0;
  private c4BeepTimer = 0;
  private onStateChange: ((state: GameState) => void) | null = null;
  private muzzleFlash: THREE.PointLight;
  private scopeOverlay: boolean = false;
  private roundEndTimer = 0;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    // Setup Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 60, 120);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xfff5e0, 0.8);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    this.scene.add(sun);

    // Muzzle flash light
    this.muzzleFlash = new THREE.PointLight(0xffaa00, 0, 8);
    this.scene.add(this.muzzleFlash);

    // Build map
    this.map = new Dust2Map(this.scene);
    this.pathfinder = new Pathfinder(this.map);

    // Input
    this.input = new InputManager();
    this.input.attach(this.renderer.domElement);

    // Weapon view model
    this.weaponViewModel = new WeaponViewModel(this.scene, this.camera);

    // Initialize game state
    this.state = this.createInitialState();
    this.spawnCharacters();

    // Input bindings
    this.setupInputBindings();

    // Handle resize
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private createInitialState(): GameState {
    return {
      characters: [],
      round: {
        phase: 'playing',
        roundNumber: 1,
        ctScore: 0,
        tScore: 0,
        roundStartTime: performance.now() / 1000,
        roundEndMessage: '',
        freezeTime: true
      },
      c4: {
        planted: false,
        plantPosition: null,
        plantTime: 0,
        explodeTime: 0,
        defuseProgress: 0,
        defuserId: null,
        carrierId: null,
        dropped: false,
        dropPosition: null
      },
      killFeed: [],
      playerCharacterId: 0,
      spectatingId: null
    };
  }

  private spawnCharacters() {
    const characters: CharacterState[] = [];
    const ctNames = ['Bot Alpha', 'Bot Bravo', 'Bot Charlie', 'Bot Delta', 'Bot Echo'];
    const tNames = ['Bot Fox', 'Bot Golf', 'Bot Hotel', 'Bot India', 'Bot Juliet'];

    // Player is on CT team (id 0)
    for (let i = 0; i < 5; i++) {
      const spawn = this.map.spawnPoints.CT[i];
      characters.push(this.createCharacter(i, 'CT', i === 0 ? 'Player' : ctNames[i - 1], i === 0, spawn));
    }
    for (let i = 0; i < 5; i++) {
      const spawn = this.map.spawnPoints.T[i];
      characters.push(this.createCharacter(i + 5, 'T', tNames[i], false, spawn));
    }

    // Give C4 to a random T
    const c4Carrier = 5 + Math.floor(Math.random() * 5);
    characters[c4Carrier].hasC4 = true;
    this.state.c4.carrierId = c4Carrier;

    this.state.characters = characters;

    // Create 3D models for non-player characters
    for (const char of characters) {
      if (!char.isPlayer) {
        const model = new CharacterModel(this.scene, char.team);
        model.setPosition(char.position);
        this.characterModels.set(char.id, model);
      }
    }
  }

  private createCharacter(id: number, team: Team, name: string, isPlayer: boolean, spawn: Vec3): CharacterState {
    const pistol: WeaponId = team === 'CT' ? 'usp' : 'glock';
    return {
      id, team, name, isPlayer,
      isAlive: true,
      health: 100,
      armor: 0, // Pistol round - no armor
      position: { ...spawn },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: team === 'CT' ? Math.PI : 0,
      pitch: 0,
      currentWeapon: 'secondary',
      weapons: {
        secondary: { id: pistol, ammo: WEAPONS[pistol].magazineSize, reserve: WEAPONS[pistol].reserveAmmo },
        melee: { id: 'knife', ammo: Infinity, reserve: 0 }
      },
      hasC4: false,
      isGrounded: true,
      isScoped: false,
      isReloading: false,
      reloadTimer: 0,
      fireTimer: 0,
      aiState: 'patrol',
      aiTarget: null,
      aiTargetEntity: null,
      aiPath: [],
      aiPathIndex: 0,
      lastShotTime: 0,
      recoilOffset: { x: 0, y: 0 },
      kills: 0,
      deaths: 0
    };
  }

  private setupInputBindings() {
    // Weapon switching
    this.input.onKeyPress('Digit1', () => this.switchWeapon('primary'));
    this.input.onKeyPress('Digit2', () => this.switchWeapon('secondary'));
    this.input.onKeyPress('Digit3', () => this.switchWeapon('melee'));
    // Reload
    this.input.onKeyPress('KeyR', () => this.startReload());
    // Jump
    this.input.onKeyPress('Space', () => this.playerJump());
    // Spectate switch
    this.input.onKeyPress('KeyE', () => this.nextSpectate());
    // Plant/Defuse
    this.input.onKeyPress('KeyF', () => this.playerInteract());
  }

  setStateChangeCallback(cb: (state: GameState) => void) {
    this.onStateChange = cb;
  }

  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  start() {
    audioManager.init();
    this.clock.start();
    this.gameLoop();
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.input.detach();
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }

  private gameLoop = () => {
    this.animationId = requestAnimationFrame(this.gameLoop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private update(dt: number) {
    if (this.state.round.phase === 'roundEnd') {
      this.roundEndTimer -= dt;
      if (this.roundEndTimer <= 0) {
        this.startNewRound();
      }
      return;
    }

    // Freeze time
    if (this.state.round.freezeTime) {
      const elapsed = performance.now() / 1000 - this.state.round.roundStartTime;
      if (elapsed >= FREEZE_TIME) {
        this.state.round.freezeTime = false;
      }
    }

    const player = this.getPlayer();

    // Update player
    if (player && player.isAlive) {
      this.updatePlayer(player, dt);
    }

    // Update AI
    for (const char of this.state.characters) {
      if (!char.isPlayer && char.isAlive) {
        this.updateAI(char, dt);
      }
    }

    // Update C4
    this.updateC4(dt);

    // Update character models
    this.updateModels();

    // Update camera
    this.updateCamera();

    // Update weapon view model
    const activeChar = this.getActiveCharacter();
    if (activeChar) {
      this.weaponViewModel.update(dt, activeChar);
    }

    // Muzzle flash decay
    if (this.muzzleFlash.intensity > 0) {
      this.muzzleFlash.intensity *= 0.8;
      if (this.muzzleFlash.intensity < 0.1) this.muzzleFlash.intensity = 0;
    }

    // Recoil recovery
    if (player) {
      player.recoilOffset.x *= 0.92;
      player.recoilOffset.y *= 0.92;
    }

    // Clean old kill feed
    const now = performance.now() / 1000;
    this.state.killFeed = this.state.killFeed.filter(k => now - k.time < 5);

    this.notifyStateChange();
  }

  private getPlayer(): CharacterState | undefined {
    return this.state.characters.find(c => c.id === this.state.playerCharacterId);
  }

  private getActiveCharacter(): CharacterState | undefined {
    const player = this.getPlayer();
    if (player && player.isAlive) return player;
    if (this.state.spectatingId !== null) {
      return this.state.characters.find(c => c.id === this.state.spectatingId);
    }
    return player;
  }

  private updatePlayer(player: CharacterState, dt: number) {
    if (this.state.round.freezeTime) return;

    // Mouse look
    const { dx, dy } = this.input.consumeMouseDelta();
    const sensitivity = player.isScoped ? 0.001 : 0.002;
    player.rotation -= dx * sensitivity;
    player.pitch -= dy * sensitivity;
    player.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, player.pitch));

    // Movement
    const forward = new THREE.Vector3(-Math.sin(player.rotation), 0, -Math.cos(player.rotation));
    const right = new THREE.Vector3(Math.cos(player.rotation), 0, -Math.sin(player.rotation));
    const moveDir = new THREE.Vector3(0, 0, 0);

    if (this.input.isKeyDown('KeyW')) moveDir.add(forward);
    if (this.input.isKeyDown('KeyS')) moveDir.sub(forward);
    if (this.input.isKeyDown('KeyD')) moveDir.add(right);
    if (this.input.isKeyDown('KeyA')) moveDir.sub(right);

    if (moveDir.length() > 0) {
      moveDir.normalize();
      const speed = MOVE_SPEED * (player.isScoped ? 0.5 : 1);
      player.velocity.x = moveDir.x * speed;
      player.velocity.z = moveDir.z * speed;

      // Footsteps
      this.footstepTimer += dt;
      if (this.footstepTimer > 0.4) {
        this.footstepTimer = 0;
        audioManager.playFootstep();
      }
    } else {
      player.velocity.x *= 0.8;
      player.velocity.z *= 0.8;
    }

    // Gravity
    player.velocity.y += GRAVITY * dt;

    // Apply velocity
    player.position.x += player.velocity.x * dt;
    player.position.y += player.velocity.y * dt;
    player.position.z += player.velocity.z * dt;

    // Ground check
    if (player.position.y <= 0) {
      player.position.y = 0;
      player.velocity.y = 0;
      player.isGrounded = true;
    }

    // Collision
    const resolved = this.map.checkCollision(player.position, PLAYER_RADIUS, PLAYER_HEIGHT);
    player.position = resolved;

    // Shooting
    player.fireTimer -= dt;
    if (this.input.mouseDown && !player.isReloading) {
      this.tryFire(player);
    }

    // Scope (right click)
    const weapon = this.getCurrentWeaponData(player);
    if (weapon && weapon.scopeZoom > 1) {
      if (this.input.rightMouseDown && !player.isScoped) {
        player.isScoped = true;
        audioManager.playScope();
      } else if (!this.input.rightMouseDown && player.isScoped) {
        player.isScoped = false;
      }
    }

    // Reload timer
    if (player.isReloading) {
      player.reloadTimer -= dt;
      if (player.reloadTimer <= 0) {
        this.completeReload(player);
      }
    }
  }

  private playerJump() {
    const player = this.getPlayer();
    if (player && player.isAlive && player.isGrounded && !this.state.round.freezeTime) {
      player.velocity.y = JUMP_FORCE;
      player.isGrounded = false;
    }
  }

  private switchWeapon(slot: WeaponSlot) {
    const player = this.getPlayer();
    if (!player || !player.isAlive) return;
    if (player.weapons[slot]) {
      player.currentWeapon = slot;
      player.isScoped = false;
      player.isReloading = false;
      this.weaponViewModel.switchWeapon(slot, player.weapons[slot]!.id);
    }
  }

  private startReload() {
    const player = this.getPlayer();
    if (!player || !player.isAlive || player.isReloading) return;
    const weaponState = player.weapons[player.currentWeapon];
    if (!weaponState) return;
    const weaponData = WEAPONS[weaponState.id];
    if (weaponState.ammo >= weaponData.magazineSize || weaponState.reserve <= 0) return;
    if (weaponData.magazineSize === Infinity) return;

    player.isReloading = true;
    player.isScoped = false;
    player.reloadTimer = weaponData.reloadTime;
    audioManager.playReload();
  }

  private completeReload(char: CharacterState) {
    const weaponState = char.weapons[char.currentWeapon];
    if (!weaponState) return;
    const weaponData = WEAPONS[weaponState.id];
    const needed = weaponData.magazineSize - weaponState.ammo;
    const available = Math.min(needed, weaponState.reserve);
    weaponState.ammo += available;
    weaponState.reserve -= available;
    char.isReloading = false;
  }

  private getCurrentWeaponData(char: CharacterState) {
    const ws = char.weapons[char.currentWeapon];
    if (!ws) return null;
    return WEAPONS[ws.id];
  }

  private tryFire(char: CharacterState) {
    const weaponData = this.getCurrentWeaponData(char);
    if (!weaponData) return;
    if (char.fireTimer > 0) return;

    const weaponState = char.weapons[char.currentWeapon]!;
    if (weaponState.ammo <= 0 && weaponData.magazineSize !== Infinity) {
      // Auto reload
      if (char.isPlayer) this.startReload();
      return;
    }

    // Fire!
    char.fireTimer = 60 / weaponData.fireRate;
    if (weaponData.magazineSize !== Infinity) {
      weaponState.ammo--;
    }

    // Sound
    audioManager.playFireSound(weaponData.id);

    // Muzzle flash
    if (char.isPlayer || this.isNearPlayer(char, 30)) {
      this.muzzleFlash.position.set(
        char.position.x,
        char.position.y + PLAYER_HEIGHT - 0.2,
        char.position.z
      );
      this.muzzleFlash.intensity = 3;
    }

    // Recoil
    const recoilMult = char.isScoped ? 0.5 : 1;
    char.recoilOffset.x += (Math.random() - 0.5) * weaponData.recoilX * 0.01 * recoilMult;
    char.recoilOffset.y += weaponData.recoilY * 0.01 * recoilMult;
    if (char.isPlayer) {
      char.pitch += weaponData.recoilY * 0.003 * recoilMult;
      char.rotation += (Math.random() - 0.5) * weaponData.recoilX * 0.003 * recoilMult;
    }

    // Hit detection - raycast
    this.performHitScan(char, weaponData);
  }

  private performHitScan(shooter: CharacterState, weaponData: typeof WEAPONS[WeaponId]) {
    const spread = weaponData.spread * (shooter.isScoped ? 0.1 : 1) * (shooter.isGrounded ? 1 : 2);
    const dirX = -Math.sin(shooter.rotation) + (Math.random() - 0.5) * spread + shooter.recoilOffset.x;
    const dirY = Math.sin(shooter.pitch) + (Math.random() - 0.5) * spread - shooter.recoilOffset.y;
    const dirZ = -Math.cos(shooter.rotation) + (Math.random() - 0.5) * spread;

    const origin: Vec3 = {
      x: shooter.position.x,
      y: shooter.position.y + PLAYER_HEIGHT - 0.1,
      z: shooter.position.z
    };
    const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
    const dir: Vec3 = { x: dirX / len, y: dirY / len, z: dirZ / len };

    // Check map collision first
    const mapHit = this.map.raycast(origin, dir, 100);

    // Check character hits
    let closestHit: { char: CharacterState; zone: HitZone; dist: number } | null = null;

    for (const target of this.state.characters) {
      if (target.id === shooter.id || !target.isAlive || target.team === shooter.team) continue;

      const hitResult = this.checkCharacterHit(origin, dir, target, mapHit.distance);
      if (hitResult && (!closestHit || hitResult.dist < closestHit.dist)) {
        closestHit = hitResult;
      }
    }

    if (closestHit) {
      this.applyDamage(shooter, closestHit.char, closestHit.zone, weaponData);
    }
  }

  private checkCharacterHit(origin: Vec3, dir: Vec3, target: CharacterState, maxDist: number): { char: CharacterState; zone: HitZone; dist: number } | null {
    const tp = target.position;
    // Simplified hitbox - cylinder approximation with zones
    const dx = tp.x - origin.x;
    const dy = (tp.y + PLAYER_HEIGHT / 2) - origin.y;
    const dz = tp.z - origin.z;

    // Project onto ray
    const t = dx * dir.x + dy * dir.y + dz * dir.z;
    if (t < 0 || t > maxDist) return null;

    // Closest point on ray to target center
    const closestX = origin.x + dir.x * t;
    const closestY = origin.y + dir.y * t;
    const closestZ = origin.z + dir.z * t;

    const distX = closestX - tp.x;
    const distZ = closestZ - tp.z;
    const horizontalDist = Math.sqrt(distX * distX + distZ * distZ);

    if (horizontalDist > 0.4) return null; // Miss

    // Determine hit zone based on height
    const hitHeight = closestY - tp.y;
    let zone: HitZone;
    if (hitHeight > 1.5) zone = 'head';
    else if (hitHeight > 1.1) zone = 'chest';
    else if (hitHeight > 0.8) zone = 'stomach';
    else if (hitHeight > 0.4) zone = 'leg';
    else zone = 'leg';

    // Arms check (wider hitbox at chest height)
    if (hitHeight > 1.0 && hitHeight < 1.4 && horizontalDist > 0.25) {
      zone = 'arm';
    }

    return { char: target, zone, dist: t };
  }

  private applyDamage(shooter: CharacterState, target: CharacterState, zone: HitZone, weaponData: typeof WEAPONS[WeaponId]) {
    let damage = weaponData.damage * HITZONE_MULTIPLIERS[zone];

    // Armor reduction
    if (target.armor > 0 && zone !== 'head') {
      damage *= 0.5;
      target.armor = Math.max(0, target.armor - damage * 0.5);
    } else if (target.armor > 0 && zone === 'head') {
      damage *= 0.75;
      target.armor = Math.max(0, target.armor - damage * 0.25);
    }

    target.health -= damage;

    // Hit feedback
    if (shooter.isPlayer) {
      if (zone === 'head') audioManager.playHeadshot();
      else audioManager.playHitmarker();
    }

    if (target.health <= 0) {
      this.killCharacter(shooter, target, weaponData.id, zone === 'head');
    }
  }

  private killCharacter(killer: CharacterState, victim: CharacterState, weapon: WeaponId, headshot: boolean) {
    victim.isAlive = false;
    victim.health = 0;
    victim.deaths++;
    killer.kills++;
    victim.aiState = 'dead';

    // Drop C4 if carrier died
    if (victim.hasC4) {
      victim.hasC4 = false;
      this.state.c4.carrierId = null;
      this.state.c4.dropped = true;
      this.state.c4.dropPosition = { ...victim.position };
    }

    // Kill feed
    this.state.killFeed.push({
      killer: killer.name,
      victim: victim.name,
      weapon,
      headshot,
      time: performance.now() / 1000,
      killerTeam: killer.team,
      victimTeam: victim.team
    });

    audioManager.playKill();
    if (victim.isPlayer) {
      audioManager.playDeath();
      // Switch to spectating
      this.state.spectatingId = this.findAliveTeammate(victim.team, victim.id);
    }

    // Hide character model
    const model = this.characterModels.get(victim.id);
    if (model) model.setVisible(false);

    // Check round end
    this.checkRoundEnd();
  }

  private findAliveTeammate(team: Team, excludeId: number): number | null {
    const mate = this.state.characters.find(c => c.team === team && c.isAlive && c.id !== excludeId);
    return mate ? mate.id : null;
  }

  private nextSpectate() {
    const player = this.getPlayer();
    if (!player || player.isAlive) return;
    const teammates = this.state.characters.filter(c => c.team === player.team && c.isAlive);
    if (teammates.length === 0) return;
    const currentIdx = teammates.findIndex(c => c.id === this.state.spectatingId);
    const nextIdx = (currentIdx + 1) % teammates.length;
    this.state.spectatingId = teammates[nextIdx].id;
  }

  private checkRoundEnd() {
    const ctAlive = this.state.characters.filter(c => c.team === 'CT' && c.isAlive).length;
    const tAlive = this.state.characters.filter(c => c.team === 'T' && c.isAlive).length;

    if (ctAlive === 0 && !this.state.c4.planted) {
      this.endRound('T', 'Terrorists Win!');
    } else if (tAlive === 0 && !this.state.c4.planted) {
      this.endRound('CT', 'Counter-Terrorists Win!');
    } else if (ctAlive === 0 && this.state.c4.planted) {
      // C4 still ticking, T wins when it explodes
    } else if (tAlive === 0 && this.state.c4.planted) {
      // CT can still defuse
    }
  }

  private endRound(winner: Team, message: string) {
    this.state.round.phase = 'roundEnd';
    this.state.round.roundEndMessage = message;
    if (winner === 'CT') this.state.round.ctScore++;
    else this.state.round.tScore++;
    this.roundEndTimer = 5;

    const player = this.getPlayer();
    const playerWon = player && player.team === winner;
    audioManager.playRoundEnd(!!playerWon);
  }

  private startNewRound() {
    this.state.round.roundNumber++;
    this.state.round.phase = 'playing';
    this.state.round.freezeTime = true;
    this.state.round.roundStartTime = performance.now() / 1000;
    this.state.round.roundEndMessage = '';
    this.state.spectatingId = null;

    // Reset C4
    this.state.c4 = {
      planted: false, plantPosition: null, plantTime: 0, explodeTime: 0,
      defuseProgress: 0, defuserId: null, carrierId: null, dropped: false, dropPosition: null
    };

    // Respawn all characters
    for (const char of this.state.characters) {
      const spawnIdx = char.id % 5;
      const spawn = char.team === 'CT' ? this.map.spawnPoints.CT[spawnIdx] : this.map.spawnPoints.T[spawnIdx];
      char.isAlive = true;
      char.health = 100;
      char.armor = 0;
      char.position = { ...spawn };
      char.velocity = { x: 0, y: 0, z: 0 };
      char.currentWeapon = 'secondary';
      char.isReloading = false;
      char.isScoped = false;
      char.aiState = 'patrol';
      char.aiTarget = null;
      char.aiTargetEntity = null;
      char.aiPath = [];
      char.recoilOffset = { x: 0, y: 0 };

      // Reset weapons (pistol round every round for simplicity)
      const pistol: WeaponId = char.team === 'CT' ? 'usp' : 'glock';
      char.weapons = {
        secondary: { id: pistol, ammo: WEAPONS[pistol].magazineSize, reserve: WEAPONS[pistol].reserveAmmo },
        melee: { id: 'knife', ammo: Infinity, reserve: 0 }
      };
      delete char.weapons.primary;

      // Show model
      const model = this.characterModels.get(char.id);
      if (model) {
        model.setVisible(true);
        model.setPosition(char.position);
      }
    }

    // Give C4 to random T
    const tChars = this.state.characters.filter(c => c.team === 'T');
    const carrier = tChars[Math.floor(Math.random() * tChars.length)];
    carrier.hasC4 = true;
    this.state.c4.carrierId = carrier.id;

    audioManager.playRoundStart();
  }

  private playerInteract() {
    const player = this.getPlayer();
    if (!player || !player.isAlive) return;

    if (player.team === 'T' && player.hasC4 && !this.state.c4.planted) {
      // Try plant
      const site = this.map.isInSite(player.position);
      if (site) {
        this.plantC4(player);
      }
    } else if (player.team === 'T' && this.state.c4.dropped && !this.state.c4.planted) {
      // Pick up dropped C4
      const dp = this.state.c4.dropPosition;
      if (dp) {
        const dist = Math.sqrt(
          (player.position.x - dp.x) ** 2 + (player.position.z - dp.z) ** 2
        );
        if (dist < 2) {
          player.hasC4 = true;
          this.state.c4.carrierId = player.id;
          this.state.c4.dropped = false;
          this.state.c4.dropPosition = null;
        }
      }
    } else if (player.team === 'CT' && this.state.c4.planted) {
      // Start defuse
      const cp = this.state.c4.plantPosition;
      if (cp) {
        const dist = Math.sqrt(
          (player.position.x - cp.x) ** 2 + (player.position.z - cp.z) ** 2
        );
        if (dist < 2.5) {
          this.state.c4.defuserId = player.id;
        }
      }
    }
  }

  private plantC4(char: CharacterState) {
    char.hasC4 = false;
    this.state.c4.planted = true;
    this.state.c4.plantPosition = { ...char.position };
    this.state.c4.plantTime = performance.now() / 1000;
    this.state.c4.explodeTime = this.state.c4.plantTime + C4_EXPLODE_TIME;
    this.state.c4.carrierId = null;
    audioManager.playC4Plant();
  }

  private updateC4(dt: number) {
    if (!this.state.c4.planted) return;

    const now = performance.now() / 1000;

    // Beep
    this.c4BeepTimer -= dt;
    const timeLeft = this.state.c4.explodeTime - now;
    const beepInterval = timeLeft > 20 ? 1.0 : timeLeft > 10 ? 0.5 : 0.25;
    if (this.c4BeepTimer <= 0) {
      this.c4BeepTimer = beepInterval;
      audioManager.playC4Beep();
    }

    // Defuse progress
    if (this.state.c4.defuserId !== null) {
      const defuser = this.state.characters.find(c => c.id === this.state.c4.defuserId);
      if (defuser && defuser.isAlive && this.state.c4.plantPosition) {
        const dist = Math.sqrt(
          (defuser.position.x - this.state.c4.plantPosition.x) ** 2 +
          (defuser.position.z - this.state.c4.plantPosition.z) ** 2
        );
        if (dist < 2.5) {
          this.state.c4.defuseProgress += dt;
          if (this.state.c4.defuseProgress >= C4_DEFUSE_TIME) {
            this.endRound('CT', 'Bomb Defused! CT Win!');
            return;
          }
        } else {
          this.state.c4.defuserId = null;
          this.state.c4.defuseProgress = 0;
        }
      } else {
        this.state.c4.defuserId = null;
        this.state.c4.defuseProgress = 0;
      }
    }

    // Explosion
    if (now >= this.state.c4.explodeTime) {
      audioManager.playC4Explosion();
      this.endRound('T', 'Bomb Exploded! T Win!');
    }
  }

  private isNearPlayer(char: CharacterState, dist: number): boolean {
    const player = this.getPlayer();
    if (!player) return false;
    const dx = char.position.x - player.position.x;
    const dz = char.position.z - player.position.z;
    return Math.sqrt(dx * dx + dz * dz) < dist;
  }

  // ============ AI SYSTEM ============
  private updateAI(char: CharacterState, dt: number) {
    if (this.state.round.freezeTime) return;

    char.fireTimer -= dt;
    if (char.isReloading) {
      char.reloadTimer -= dt;
      if (char.reloadTimer <= 0) this.completeReload(char);
      return;
    }

    // Vision check - find nearest visible enemy
    const enemy = this.findVisibleEnemy(char);

    if (enemy) {
      char.aiState = 'attack';
      char.aiTargetEntity = enemy.id;
      this.aiAttack(char, enemy, dt);
    } else {
      char.aiTargetEntity = null;
      // Objective-based behavior
      this.aiObjective(char, dt);
    }

    // Movement along path
    this.aiMove(char, dt);

    // Recoil recovery
    char.recoilOffset.x *= 0.9;
    char.recoilOffset.y *= 0.9;
  }

  private findVisibleEnemy(char: CharacterState): CharacterState | null {
    let closest: CharacterState | null = null;
    let closestDist = Infinity;
    const eyePos: Vec3 = { x: char.position.x, y: char.position.y + 1.5, z: char.position.z };

    for (const other of this.state.characters) {
      if (other.team === char.team || !other.isAlive) continue;
      const dist = Math.sqrt(
        (other.position.x - char.position.x) ** 2 +
        (other.position.z - char.position.z) ** 2
      );
      if (dist > 50) continue; // Vision range increased

      const targetEye: Vec3 = { x: other.position.x, y: other.position.y + 1.2, z: other.position.z };
      if (this.map.hasLineOfSight(eyePos, targetEye)) {
        if (dist < closestDist) {
          closestDist = dist;
          closest = other;
        }
      }
    }
    return closest;
  }

  private aiAttack(char: CharacterState, enemy: CharacterState, dt: number) {
    // Face enemy
    const dx = enemy.position.x - char.position.x;
    const dz = enemy.position.z - char.position.z;
    char.rotation = Math.atan2(-dx, -dz);

    // Aim with some inaccuracy
    const dist = Math.sqrt(dx * dx + dz * dz);
    char.pitch = Math.atan2((enemy.position.y + 1.2) - (char.position.y + 1.5), dist);

    // Shoot
    if (char.fireTimer <= 0) {
      // Add AI inaccuracy
      char.recoilOffset.x = (Math.random() - 0.5) * 0.03;
      char.recoilOffset.y = (Math.random() - 0.5) * 0.02;
      this.tryFire(char);

      // AI reload check
      const ws = char.weapons[char.currentWeapon];
      if (ws && ws.ammo <= 0) {
        char.isReloading = true;
        char.reloadTimer = WEAPONS[ws.id].reloadTime;
      }
    }

    // Strafe during combat
    if (dist > 5) {
      // Move towards enemy
      char.aiPath = [];
      const speed = MOVE_SPEED * 0.7;
      char.velocity.x = (dx / dist) * speed;
      char.velocity.z = (dz / dist) * speed;
    } else {
      // Strafe
      const strafeDir = Math.sin(performance.now() / 500 + char.id) > 0 ? 1 : -1;
      char.velocity.x = (-dz / dist) * MOVE_SPEED * 0.4 * strafeDir;
      char.velocity.z = (dx / dist) * MOVE_SPEED * 0.4 * strafeDir;
    }
  }

  private aiObjective(char: CharacterState, dt: number) {
    // Determine objective
    if (char.team === 'T') {
      if (char.hasC4 && !this.state.c4.planted) {
        // Go to plant site
        char.aiState = 'plant';
        const targetSite = Math.random() > 0.5 ? this.map.POSITIONS.A_SITE : this.map.POSITIONS.B_SITE;
        if (char.aiPath.length === 0 || char.aiPathIndex >= char.aiPath.length) {
          char.aiPath = this.pathfinder.findPath(char.position, targetSite);
          char.aiPathIndex = 0;
        }
        // Check if at site
        if (this.map.isInSite(char.position)) {
          this.plantC4(char);
        }
      } else if (this.state.c4.dropped && !this.state.c4.planted) {
        // Go pick up C4
        char.aiState = 'patrol';
        if (char.aiPath.length === 0 || char.aiPathIndex >= char.aiPath.length) {
          char.aiPath = this.pathfinder.findPath(char.position, this.state.c4.dropPosition!);
          char.aiPathIndex = 0;
        }
        const dp = this.state.c4.dropPosition;
        if (dp) {
          const dist = Math.sqrt((char.position.x - dp.x) ** 2 + (char.position.z - dp.z) ** 2);
          if (dist < 2) {
            char.hasC4 = true;
            this.state.c4.carrierId = char.id;
            this.state.c4.dropped = false;
            this.state.c4.dropPosition = null;
          }
        }
      } else {
        // Patrol / push
        char.aiState = 'patrol';
        if (char.aiPath.length === 0 || char.aiPathIndex >= char.aiPath.length) {
          const target = this.pathfinder.getRandomPatrolPoint(char.position, 'T');
          char.aiPath = this.pathfinder.findPath(char.position, target);
          char.aiPathIndex = 0;
        }
      }
    } else {
      // CT
      if (this.state.c4.planted && this.state.c4.plantPosition) {
        // Go defuse
        char.aiState = 'defuse';
        if (char.aiPath.length === 0 || char.aiPathIndex >= char.aiPath.length) {
          char.aiPath = this.pathfinder.findPath(char.position, this.state.c4.plantPosition);
          char.aiPathIndex = 0;
        }
        const cp = this.state.c4.plantPosition;
        const dist = Math.sqrt((char.position.x - cp.x) ** 2 + (char.position.z - cp.z) ** 2);
        if (dist < 2.5) {
          this.state.c4.defuserId = char.id;
        }
      } else {
        // Hold positions / patrol
        char.aiState = 'patrol';
        if (char.aiPath.length === 0 || char.aiPathIndex >= char.aiPath.length) {
          const target = this.pathfinder.getRandomPatrolPoint(char.position, 'CT');
          char.aiPath = this.pathfinder.findPath(char.position, target);
          char.aiPathIndex = 0;
        }
      }
    }
  }

  private aiMove(char: CharacterState, dt: number) {
    if (char.aiState === 'attack') {
      // Movement handled in aiAttack
    } else if (char.aiPath.length > 0 && char.aiPathIndex < char.aiPath.length) {
      const target = char.aiPath[char.aiPathIndex];
      const dx = target.x - char.position.x;
      const dz = target.z - char.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 1.5) {
        char.aiPathIndex++;
      } else {
        const speed = MOVE_SPEED * 0.8;
        char.velocity.x = (dx / dist) * speed;
        char.velocity.z = (dz / dist) * speed;
        char.rotation = Math.atan2(-dx, -dz);
      }
    } else {
      char.velocity.x *= 0.8;
      char.velocity.z *= 0.8;
    }

    // Apply physics
    char.velocity.y += GRAVITY * dt;
    char.position.x += char.velocity.x * dt;
    char.position.y += char.velocity.y * dt;
    char.position.z += char.velocity.z * dt;

    if (char.position.y <= 0) {
      char.position.y = 0;
      char.velocity.y = 0;
      char.isGrounded = true;
    }

    // Collision
    const resolved = this.map.checkCollision(char.position, PLAYER_RADIUS, PLAYER_HEIGHT);
    char.position = resolved;
  }

  private updateModels() {
    for (const char of this.state.characters) {
      if (char.isPlayer) continue;
      const model = this.characterModels.get(char.id);
      if (model && char.isAlive) {
        model.setPosition(char.position);
        model.setRotation(char.rotation);
        model.setMoving(Math.abs(char.velocity.x) > 0.5 || Math.abs(char.velocity.z) > 0.5);
        model.update(this.clock.getElapsedTime());
      }
    }
  }

  private updateCamera() {
    const activeChar = this.getActiveCharacter();
    if (!activeChar) return;

    this.camera.position.set(
      activeChar.position.x,
      activeChar.position.y + PLAYER_HEIGHT - 0.1,
      activeChar.position.z
    );

    const pitch = activeChar.pitch + activeChar.recoilOffset.y;
    const yaw = activeChar.rotation + activeChar.recoilOffset.x;

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = yaw;
    this.camera.rotation.x = pitch;

    // Scope zoom
    const weapon = this.getCurrentWeaponData(activeChar);
    if (activeChar.isScoped && weapon && weapon.scopeZoom > 1) {
      this.camera.fov = 75 / weapon.scopeZoom;
      this.scopeOverlay = true;
    } else {
      this.camera.fov = 75;
      this.scopeOverlay = false;
    }
    this.camera.updateProjectionMatrix();
  }

  getScopeOverlay(): boolean {
    return this.scopeOverlay;
  }

  requestPointerLock() {
    this.input.requestLock();
  }

  isPointerLocked(): boolean {
    return this.input.isLocked;
  }
}
