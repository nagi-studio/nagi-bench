import * as THREE from 'three';
import {
  CharacterState,
  C4State,
  GameScore,
  KillEvent,
  RoundPhase,
  RoundWinReason,
  Team,
  WeaponType
} from '../types/game';
import { WEAPON_DEFINITIONS, HITBOX_MULTIPLIERS, WeaponMeshBuilder } from './Weapons';
import { Dust2Map } from './Dust2Map';
import { PhysicsEngine } from './Physics';
import { CharacterMeshBuilder } from './CharacterMesh';
import { AIBotController } from './AIBot';
import { sound } from '../audio/SoundSystem';

export class GameEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public map: Dust2Map;

  // Game Engine States
  public player: CharacterState;
  public spectatedCharacterId: string;
  public bots: AIBotController[] = [];
  public allCharacters: CharacterState[] = [];
  public c4State: C4State;
  public score: GameScore;
  public roundPhase: RoundPhase = 'FREEZE_TIME';
  public roundTimer: number = 150; // 2.5 minutes
  public freezeTimer: number = 5;
  public roundWinnerBanner: string | null = null;

  public killfeed: KillEvent[] = [];

  // Input states
  private keys: Record<string, boolean> = {};
  public isPointerLocked: boolean = false;

  // Viewmodels & 3D character meshes map
  private characterMeshes: Map<string, ReturnType<typeof CharacterMeshBuilder.createHumanoid>> = new Map();
  private firstPersonWeaponGroup: THREE.Group = new THREE.Group();
  private c4Mesh: THREE.Mesh;

  // Recoil pitch & yaw recovery state
  public recoilPitch: number = 0;
  public recoilYaw: number = 0;
  public crosshairSpread: number = 0;

  private onStateChangeCallback?: () => void;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7eb5e6);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);

    // Build map
    this.map = new Dust2Map();
    this.scene.add(this.map.sceneGroup);

    // First person weapon camera rig
    this.camera.add(this.firstPersonWeaponGroup);
    this.scene.add(this.camera);

    // C4 3D Model mesh
    const c4Geo = new THREE.BoxGeometry(0.3, 0.15, 0.4);
    const c4Mat = new THREE.MeshStandardMaterial({ color: 0xaa2222, roughness: 0.4 });
    this.c4Mesh = new THREE.Mesh(c4Geo, c4Mat);
    this.scene.add(this.c4Mesh);

    // Init state structures
    this.score = { ct: 0, t: 0, currentRound: 1, isPistolRound: false };
    this.player = this.createDefaultPlayer('Player', 'CT');
    this.spectatedCharacterId = this.player.id;

    this.c4State = {
      isPlanted: false,
      isDropped: false,
      position: new THREE.Vector3(0, -100, 0),
      plantProgress: 0,
      defuseProgress: 0,
      timer: 40
    };

    this.setupInputs();
    this.startNewRound(true);
  }

  public setOnStateChange(cb: () => void) {
    this.onStateChangeCallback = cb;
  }

  private triggerStateChange() {
    if (this.onStateChangeCallback) this.onStateChangeCallback();
  }

  private createDefaultPlayer(name: string, team: Team): CharacterState {
    const isPistol = this.score.isPistolRound;
    return {
      id: 'player_1',
      name,
      team,
      isBot: false,
      hp: 100,
      maxHp: 100,
      armor: isPistol ? 0 : 100,
      hasHelmet: !isPistol,
      position: new THREE.Vector3(0, 0, -42),
      rotation: new THREE.Euler(0, 0, 0),
      yaw: 0,
      pitch: 0,
      velocity: new THREE.Vector3(),
      isGrounded: true,
      isCrouching: false,
      isScoping: false,
      currentWeapon: isPistol ? (team === 'CT' ? 'usp' : 'glock') : (team === 'CT' ? 'm4a4' : 'ak47'),
      primaryWeapon: isPistol ? undefined : (team === 'CT' ? 'm4a4' : 'ak47'),
      secondaryWeapon: team === 'CT' ? 'usp' : 'glock',
      ammoInClip: {
        ak47: 30, m4a4: 30, awp: 5, glock: 20, usp: 12, deagle: 7, knife: 1
      },
      ammoReserve: {
        ak47: 90, m4a4: 90, awp: 30, glock: 120, usp: 100, deagle: 35, knife: 0
      },
      isReloading: false,
      reloadTimer: 0,
      isPlantingC4: false,
      plantTimer: 0,
      isDefusingC4: false,
      defuseTimer: 0,
      hasC4: false,
      isDead: false,
      killCount: 0,
      deathCount: 0,
      walkCycle: 0
    };
  }

  public togglePistolRound(enabled: boolean) {
    this.score.isPistolRound = enabled;
    this.startNewRound(true);
  }

  public startNewRound(resetScores: boolean = false) {
    if (resetScores) {
      this.score.ct = 0;
      this.score.t = 0;
      this.score.currentRound = 1;
    }

    this.roundPhase = 'FREEZE_TIME';
    this.freezeTimer = 5;
    this.roundTimer = 150;
    this.roundWinnerBanner = null;

    // Reset C4
    this.c4State = {
      isPlanted: false,
      isDropped: false,
      position: new THREE.Vector3(0, -100, 0),
      plantProgress: 0,
      defuseProgress: 0,
      timer: 40
    };

    // Clean existing meshes
    for (const meshObj of this.characterMeshes.values()) {
      this.scene.remove(meshObj.group);
    }
    this.characterMeshes.clear();
    this.bots = [];
    this.allCharacters = [];

    const isPistol = this.score.isPistolRound;

    // Respawn Player
    this.player.hp = 100;
    this.player.isDead = false;
    this.player.armor = isPistol ? 0 : 100;
    this.player.hasHelmet = !isPistol;
    this.player.currentWeapon = isPistol ? (this.player.team === 'CT' ? 'usp' : 'glock') : (this.player.team === 'CT' ? 'm4a4' : 'ak47');
    this.player.primaryWeapon = isPistol ? undefined : (this.player.team === 'CT' ? 'm4a4' : 'ak47');
    this.player.ammoInClip = { ak47: 30, m4a4: 30, awp: 5, glock: 20, usp: 12, deagle: 7, knife: 1 };
    this.player.position.set(this.player.team === 'CT' ? 0 : 0, 0, this.player.team === 'CT' ? -42 : 60);
    this.player.hasC4 = false;

    this.spectatedCharacterId = this.player.id;
    this.allCharacters.push(this.player);

    // Spawn 9 Bots (4 Teammates, 5 Enemies)
    let botIdCounter = 1;

    // Spawn CT Bots
    const ctSpawns = [
      new THREE.Vector3(-10, 0, -42),
      new THREE.Vector3(10, 0, -42),
      new THREE.Vector3(-20, 0, -35),
      new THREE.Vector3(20, 0, -35),
      new THREE.Vector3(0, 0, -35)
    ];

    // Spawn T Spawns
    const tSpawns = [
      new THREE.Vector3(-15, 0, 60),
      new THREE.Vector3(15, 0, 60),
      new THREE.Vector3(-25, 0, 55),
      new THREE.Vector3(25, 0, 58),
      new THREE.Vector3(0, 0, 55)
    ];

    let ctSpawnIdx = this.player.team === 'CT' ? 1 : 0;
    let tSpawnIdx = this.player.team === 'T' ? 1 : 0;

    for (let i = 0; i < 9; i++) {
      const isCT = (i < 4 && this.player.team === 'CT') || (i >= 4 && this.player.team === 'T');
      const team: Team = isCT ? 'CT' : 'T';
      const pos = isCT ? ctSpawns[ctSpawnIdx++] : tSpawns[tSpawnIdx++];

      const botState: CharacterState = {
        id: `bot_${botIdCounter++}`,
        name: `${team} Bot ${botIdCounter}`,
        team,
        isBot: true,
        hp: 100,
        maxHp: 100,
        armor: isPistol ? 0 : 100,
        hasHelmet: !isPistol,
        position: pos.clone(),
        rotation: new THREE.Euler(0, 0, 0),
        yaw: 0,
        pitch: 0,
        velocity: new THREE.Vector3(),
        isGrounded: true,
        isCrouching: false,
        isScoping: false,
        currentWeapon: isPistol ? (team === 'CT' ? 'usp' : 'glock') : (team === 'CT' ? (Math.random() > 0.3 ? 'm4a4' : 'awp') : (Math.random() > 0.3 ? 'ak47' : 'awp')),
        primaryWeapon: isPistol ? undefined : (team === 'CT' ? 'm4a4' : 'ak47'),
        secondaryWeapon: team === 'CT' ? 'usp' : 'glock',
        ammoInClip: { ak47: 30, m4a4: 30, awp: 5, glock: 20, usp: 12, deagle: 7, knife: 1 },
        ammoReserve: { ak47: 90, m4a4: 90, awp: 30, glock: 120, usp: 100, deagle: 35, knife: 0 },
        isReloading: false,
        reloadTimer: 0,
        isPlantingC4: false,
        plantTimer: 0,
        isDefusingC4: false,
        defuseTimer: 0,
        hasC4: false,
        isDead: false,
        killCount: 0,
        deathCount: 0,
        walkCycle: 0
      };

      this.allCharacters.push(botState);
      this.bots.push(new AIBotController(botState));
    }

    // Give C4 to a random T player/bot
    const tCharacters = this.allCharacters.filter(c => c.team === 'T');
    const c4Carrier = tCharacters[Math.floor(Math.random() * tCharacters.length)];
    if (c4Carrier) {
      c4Carrier.hasC4 = true;
    }

    // Create 3D meshes for all 10 characters
    for (const char of this.allCharacters) {
      const meshObj = CharacterMeshBuilder.createHumanoid(char.team);
      this.scene.add(meshObj.group);
      this.characterMeshes.set(char.id, meshObj);
    }

    this.updateFirstPersonWeaponModel();
    this.triggerStateChange();
  }

  private setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Weapon switching numbers
      if (e.code === 'Digit1') this.switchWeapon('primary');
      if (e.code === 'Digit2') this.switchWeapon('secondary');
      if (e.code === 'Digit3') this.switchWeapon('knife');
      if (e.code === 'Digit4' && this.player.team === 'T' && this.player.hasC4) this.switchWeapon('c4');

      if (e.code === 'KeyR') this.reloadWeapon(this.player);

      // Spectator bot takeover spacebar
      if (e.code === 'Space' && this.player.isDead) {
        this.switchSpectateTarget();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;

      const activeChar = this.getActiveSpectatedChar();
      if (activeChar.isDead) return;

      const sensitivity = activeChar.isScoping ? 0.0008 : 0.0022;
      activeChar.yaw -= e.movementX * sensitivity;
      activeChar.pitch -= e.movementY * sensitivity;

      // Clamp pitch to avoid full camera flip
      activeChar.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, activeChar.pitch));
    });

    window.addEventListener('mousedown', (e) => {
      sound.unlock();
      if (e.button === 0 && this.isPointerLocked) {
        // Left click shoot
        this.fireWeapon(this.getActiveSpectatedChar());
      }
      if (e.button === 2 && this.isPointerLocked) {
        // Right click scope toggle for AWP
        const activeChar = this.getActiveSpectatedChar();
        if (activeChar.currentWeapon === 'awp' && !activeChar.isDead) {
          activeChar.isScoping = !activeChar.isScoping;
          sound.playScope();
        }
      }
    });
  }

  private switchSpectateTarget() {
    const aliveTeammates = this.allCharacters.filter(c => !c.isDead && c.team === this.player.team);
    if (aliveTeammates.length > 0) {
      const idx = aliveTeammates.findIndex(c => c.id === this.spectatedCharacterId);
      const nextIdx = (idx + 1) % aliveTeammates.length;
      this.spectatedCharacterId = aliveTeammates[nextIdx].id;
    }
  }

  public takeoverSpectatedBot() {
    const target = this.allCharacters.find(c => c.id === this.spectatedCharacterId && !c.isDead && c.isBot);
    if (target) {
      // Transfer player state onto bot
      target.isBot = false;
      this.player.isDead = true;
      this.spectatedCharacterId = target.id;
      this.triggerStateChange();
    }
  }

  private getActiveSpectatedChar(): CharacterState {
    const char = this.allCharacters.find(c => c.id === this.spectatedCharacterId);
    return char || this.player;
  }

  private switchWeapon(category: 'primary' | 'secondary' | 'knife' | 'c4') {
    const char = this.player;
    if (char.isDead) return;

    if (category === 'primary' && char.primaryWeapon) {
      char.currentWeapon = char.primaryWeapon;
    } else if (category === 'secondary') {
      char.currentWeapon = char.secondaryWeapon;
    } else if (category === 'knife') {
      char.currentWeapon = 'knife';
    }
    char.isScoping = false;
    this.updateFirstPersonWeaponModel();
  }

  private reloadWeapon(char: CharacterState) {
    if (char.isDead || char.isReloading) return;
    const weaponData = WEAPON_DEFINITIONS[char.currentWeapon];
    if (char.ammoReserve[char.currentWeapon] <= 0 || char.ammoInClip[char.currentWeapon] >= weaponData.clipSize) return;

    char.isReloading = true;
    char.reloadTimer = weaponData.reloadTime;
    sound.playReload();
  }

  private updateFirstPersonWeaponModel() {
    while (this.firstPersonWeaponGroup.children.length > 0) {
      this.firstPersonWeaponGroup.remove(this.firstPersonWeaponGroup.children[0]);
    }
    const mesh = WeaponMeshBuilder.createWeaponMesh(this.player.currentWeapon);
    mesh.position.set(0.2, -0.18, -0.4);
    mesh.rotation.y = Math.PI / 16;
    this.firstPersonWeaponGroup.add(mesh);
  }

  public fireWeapon(char: CharacterState, targetHitPos?: THREE.Vector3) {
    if (char.isDead || char.isReloading || this.roundPhase === 'FREEZE_TIME') return;

    const weaponData = WEAPON_DEFINITIONS[char.currentWeapon];
    if (char.ammoInClip[char.currentWeapon] <= 0) {
      this.reloadWeapon(char);
      return;
    }

    // Decrement clip ammo
    char.ammoInClip[char.currentWeapon]--;
    sound.playGunshot(char.currentWeapon, !char.isBot);

    // Apply recoil to camera / aim pitch climb
    if (!char.isBot) {
      this.recoilPitch += weaponData.recoil * 0.04;
      this.crosshairSpread = Math.min(1.0, this.crosshairSpread + 0.3);
    }

    // Raycast Shooting logic
    let rayOrigin: THREE.Vector3;
    let rayDir: THREE.Vector3;

    if (targetHitPos) {
      rayOrigin = char.position.clone().add(new THREE.Vector3(0, 1.5, 0));
      rayDir = targetHitPos.clone().sub(rayOrigin).normalize();
    } else {
      rayOrigin = this.camera.position.clone();
      rayDir = new THREE.Vector3();
      this.camera.getWorldDirection(rayDir);
    }

    const raycaster = new THREE.Raycaster(rayOrigin, rayDir, 0.1, 150);

    // Check hitboxes of all enemy characters
    const enemyHitboxes: { hitbox: (typeof CharacterMeshBuilder.createHumanoid)['hitboxes'][0]; char: CharacterState }[] = [];
    for (const target of this.allCharacters) {
      if (target.isDead || target.team === char.team) continue;
      const meshObj = this.characterMeshes.get(target.id);
      if (!meshObj) continue;

      for (const hb of meshObj.hitboxes) {
        enemyHitboxes.push({ hitbox: hb, char: target });
      }
    }

    const intersects = raycaster.intersectObjects(enemyHitboxes.map(item => item.hitbox.mesh));

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const hitItem = enemyHitboxes.find(item => item.hitbox.mesh === hitMesh);

      if (hitItem) {
        const victim = hitItem.char;
        const isHeadshot = hitItem.hitbox.zone === 'head';
        const rawDamage = weaponData.damage * hitItem.hitbox.multiplier;

        // Armor mitigation
        const armorReduction = victim.armor > 0 ? (isHeadshot && !victim.hasHelmet ? 1.0 : 0.7) : 1.0;
        const finalDamage = Math.round(rawDamage * armorReduction);

        victim.hp -= finalDamage;
        if (victim.armor > 0) victim.armor = Math.max(0, victim.armor - Math.round(finalDamage * 0.2));

        if (!char.isBot) sound.playHit(isHeadshot);

        if (victim.hp <= 0) {
          victim.hp = 0;
          victim.isDead = true;
          char.killCount++;
          victim.deathCount++;

          if (!char.isBot) sound.playKill();

          // Check if victim was carrying C4
          if (victim.hasC4) {
            victim.hasC4 = false;
            this.c4State.isDropped = true;
            this.c4State.position.copy(victim.position);
          }

          // Register killfeed event
          this.killfeed.unshift({
            id: `kill_${Date.now()}_${Math.random()}`,
            killerName: char.name,
            killerTeam: char.team,
            victimName: victim.name,
            victimTeam: victim.team,
            weapon: char.currentWeapon,
            isHeadshot,
            timestamp: Date.now()
          });

          if (this.killfeed.length > 5) this.killfeed.pop();
        }
      }
    }
  }

  public update(dt: number) {
    // 1. Round Phase Timers
    if (this.roundPhase === 'FREEZE_TIME') {
      this.freezeTimer -= dt;
      if (this.freezeTimer <= 0) {
        this.roundPhase = 'IN_PROGRESS';
      }
    } else if (this.roundPhase === 'IN_PROGRESS') {
      if (this.c4State.isPlanted) {
        this.c4State.timer -= dt;
        if (Math.floor(this.c4State.timer * 4) % 4 === 0) {
          sound.playC4Beep();
        }
        if (this.c4State.timer <= 0) {
          this.endRound('C4_EXPLODED');
        }
      } else {
        this.roundTimer -= dt;
        if (this.roundTimer <= 0) {
          this.endRound('TIME_RAN_OUT');
        }
      }

      this.checkRoundWinConditions();
    }

    // 2. Player Input Movement & Physics Update
    const activeChar = this.getActiveSpectatedChar();
    if (!activeChar.isDead && this.roundPhase !== 'FREEZE_TIME') {
      this.updatePlayerMovement(dt, activeChar);
    }

    // 3. AI Bots Logic Update
    for (const bot of this.bots) {
      bot.update(dt, this.allCharacters, this.c4State, (b, tPos) => this.fireWeapon(b, tPos));
    }

    // 4. Update 3D Character Meshes & Animations
    for (const char of this.allCharacters) {
      const meshObj = this.characterMeshes.get(char.id);
      if (!meshObj) continue;

      if (char.isDead) {
        meshObj.group.visible = false;
        continue;
      }

      meshObj.group.visible = char.id !== this.camera.parent?.id; // Hide character mesh if camera attached
      meshObj.group.position.copy(char.position);
      meshObj.group.rotation.y = char.yaw;

      CharacterMeshBuilder.animateWalk(
        meshObj.leftLeg,
        meshObj.rightLeg,
        char.walkCycle,
        char.velocity.lengthSq() > 0.01
      );
    }

    // 5. C4 Mesh rendering position
    if (this.c4State.isDropped || this.c4State.isPlanted) {
      this.c4Mesh.visible = true;
      this.c4Mesh.position.copy(this.c4State.position);
    } else {
      this.c4Mesh.visible = false;
    }

    // 6. Camera Position & FOV (AWP Scope zoom)
    if (!activeChar.isDead) {
      this.camera.position.copy(activeChar.position).add(new THREE.Vector3(0, 1.5, 0));
      this.camera.rotation.set(activeChar.pitch + this.recoilPitch, activeChar.yaw, 0, 'YXZ');
      this.camera.fov = activeChar.isScoping ? 20 : 75;
      this.camera.updateProjectionMatrix();
    }

    // Decay recoil pitch & spread
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, 0.1);
    this.crosshairSpread = THREE.MathUtils.lerp(this.crosshairSpread, 0, 0.08);

    this.triggerStateChange();
  }

  private updatePlayerMovement(dt: number, char: CharacterState) {
    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.z -= 1;
    if (this.keys['KeyS']) moveDir.z += 1;
    if (this.keys['KeyA']) moveDir.x -= 1;
    if (this.keys['KeyD']) moveDir.x += 1;

    moveDir.normalize();
    moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), char.yaw);

    const speed = char.isCrouching ? 2.2 : (char.isScoping ? 2.5 : 5.0);
    char.velocity.set(moveDir.x * speed * dt, 0, moveDir.z * speed * dt);

    const newPos = PhysicsEngine.collideAndSlide(char.position, char.velocity);
    char.position.copy(newPos);

    if (moveDir.lengthSq() > 0) {
      char.walkCycle += dt;
      if (Math.sin(char.walkCycle * 12) > 0.95) sound.playFootstep();
    }

    // Plant / Defuse C4 Action
    const plantZone = this.map.isPositionInPlantZone(char.position);
    if (this.keys['KeyE']) {
      if (char.team === 'T' && char.hasC4 && plantZone && !this.c4State.isPlanted) {
        this.c4State.plantProgress += dt / 3.2;
        if (this.c4State.plantProgress >= 1.0) {
          this.c4State.isPlanted = true;
          this.c4State.position.copy(char.position);
          char.hasC4 = false;
          sound.playC4Plant();
        }
      } else if (char.team === 'CT' && this.c4State.isPlanted && char.position.distanceTo(this.c4State.position) < 2.5) {
        this.c4State.defuseProgress += dt / 5.0;
        if (this.c4State.defuseProgress >= 1.0) {
          sound.playC4Defuse();
          this.endRound('C4_DEFUSED');
        }
      }
    }
  }

  private checkRoundWinConditions() {
    const aliveCT = this.allCharacters.filter(c => !c.isDead && c.team === 'CT');
    const aliveT = this.allCharacters.filter(c => !c.isDead && c.team === 'T');

    if (aliveCT.length === 0) {
      this.endRound('CT_ELIMINATED');
    } else if (aliveT.length === 0 && !this.c4State.isPlanted) {
      this.endRound('T_ELIMINATED');
    }
  }

  private endRound(reason: RoundWinReason) {
    if (this.roundPhase === 'ENDED') return;
    this.roundPhase = 'ENDED';

    if (reason === 'CT_ELIMINATED' || reason === 'C4_EXPLODED') {
      this.score.t++;
      this.roundWinnerBanner = 'TERRORISTS WIN';
      if (reason === 'C4_EXPLODED') sound.playC4Explosion();
    } else {
      this.score.ct++;
      this.roundWinnerBanner = 'COUNTER-TERRORISTS WIN';
    }

    setTimeout(() => {
      this.score.currentRound++;
      this.startNewRound(false);
    }, 4000);
  }
}
