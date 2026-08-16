import * as THREE from 'three';
import { Dust2Map } from '../map/Dust2Map';
import { HumanoidCharacter } from '../character/HumanoidCharacter';
import { CollisionSystem } from '../physics/CollisionSystem';
import { BotAIManager, BotEntity } from '../ai/BotAI';
import { ParticleSystem } from '../effects/ParticleSystem';
import { soundManager } from '../audio/SoundSynthesizer';
import { Viewmodel } from '../weapon/Viewmodel';
import { WeaponId, WEAPON_REGISTRY } from '../weapon/WeaponTypes';

export interface KillFeedEntry {
  id: string;
  killerName: string;
  killerTeam: 'CT' | 'T';
  victimName: string;
  victimTeam: 'CT' | 'T';
  weapon: WeaponId;
  isHeadshot: boolean;
  timestamp: number;
}

export interface GameStateData {
  round: number;
  scoreCT: number;
  scoreT: number;
  roundPhase: 'FREEZE' | 'LIVE' | 'ENDED';
  roundTimeLeft: number;
  winner: 'CT' | 'T' | null;
  winReason: string;
  isPistolRound: boolean;
  playerEntity: BotEntity | null;
  c4: {
    isPlanted: boolean;
    isDropped: boolean;
    carrierId: string | null;
    position: THREE.Vector3 | null;
    plantedSite: 'A' | 'B' | null;
    fuseTimeLeft: number;
    plantProgress: number;
    defuseProgress: number;
  };
  spectatingBot: BotEntity | null;
  killFeed: KillFeedEntry[];
}

export class GameManager {
  public map: Dust2Map;
  public collision: CollisionSystem;
  public botAI: BotAIManager;
  public particles: ParticleSystem;
  public viewmodel: Viewmodel;

  // Scene & Camera
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Players (10 total: 1 Human + 9 Bots)
  public players: BotEntity[] = [];
  public playerTeam: 'CT' | 'T' = 'CT';
  public playerEntity: BotEntity | null = null;
  public spectatingBot: BotEntity | null = null;

  // Round State
  public round: number = 1;
  public scoreCT: number = 0;
  public scoreT: number = 0;
  public roundPhase: 'FREEZE' | 'LIVE' | 'ENDED' = 'FREEZE';
  public roundTimeLeft: number = 115;
  public freezeTimeLeft: number = 5;
  public endRoundTimer: number = 0;
  public winner: 'CT' | 'T' | null = null;
  public winReason: string = '';
  public isPistolRound: boolean = true;

  // C4 Bomb State
  public c4Mesh: THREE.Group | null = null;
  public c4Light: THREE.PointLight | null = null;
  public c4IsPlanted: boolean = false;
  public c4IsDropped: boolean = false;
  public c4CarrierId: string | null = null;
  public c4Position: THREE.Vector3 | null = null;
  public c4PlantedSite: 'A' | 'B' | null = null;
  public c4FuseTimeLeft: number = 40;
  public c4BeepTimer: number = 1.0;
  public plantProgress: number = 0;
  public defuseProgress: number = 0;
  public isPlayerPlanting: boolean = false;
  public isPlayerDefusing: boolean = false;

  // Killfeed
  public killFeed: KillFeedEntry[] = [];

  // Player FPS Controls & Recoil
  public playerPitch: number = 0;
  public playerYaw: number = 0;
  public isScoped: boolean = false;
  public recoilOffsetPitch: number = 0;
  public recoilOffsetYaw: number = 0;
  public fireCooldown: number = 0;
  public isReloading: boolean = false;
  public reloadTimer: number = 0;

  // Input states
  public keys: Record<string, boolean> = {};
  public mouseButtons: Record<number, boolean> = {};

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, playerTeam: 'CT' | 'T' = 'CT') {
    this.scene = scene;
    this.camera = camera;
    this.playerTeam = playerTeam;

    // Subsystems
    this.map = new Dust2Map();
    this.scene.add(this.map.scene);

    this.collision = new CollisionSystem(this.map);
    this.botAI = new BotAIManager(this.map, this.collision);
    this.particles = new ParticleSystem();
    this.scene.add(this.particles.scene);

    this.viewmodel = new Viewmodel();
    this.camera.add(this.viewmodel.group);
    this.scene.add(this.camera);

    this.createC4Mesh();
    this.initMatch();
  }

  private createC4Mesh() {
    this.c4Mesh = new THREE.Group();
    const c4Geo = new THREE.BoxGeometry(0.5, 0.25, 0.4);
    const c4Mat = new THREE.MeshStandardMaterial({ color: 0x997755, roughness: 0.8 });
    const box = new THREE.Mesh(c4Geo, c4Mat);
    box.castShadow = true;
    this.c4Mesh.add(box);

    this.c4Light = new THREE.PointLight(0xff0000, 0, 4);
    this.c4Light.position.set(0, 0.2, 0);
    this.c4Mesh.add(this.c4Light);

    this.c4Mesh.visible = false;
    this.scene.add(this.c4Mesh);
  }

  public initMatch() {
    this.round = 1;
    this.scoreCT = 0;
    this.scoreT = 0;
    this.isPistolRound = true;
    this.setupRoster();
    this.startRound();
  }

  private setupRoster() {
    // Clean up existing character meshes
    this.players.forEach(p => {
      this.scene.remove(p.character.group);
    });
    this.players = [];

    const ctNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
    const tNames = ['Phoenix', 'Leet', 'Guerilla', 'Anarchist', 'Balkan'];

    // 5 CT Players
    for (let i = 0; i < 5; i++) {
      const isHuman = (this.playerTeam === 'CT' && i === 0);
      const char = new HumanoidCharacter('CT');
      this.scene.add(char.group);

      const bot: BotEntity = {
        id: `ct_${i}`,
        name: isHuman ? 'You (CT)' : `CT ${ctNames[i]}`,
        team: 'CT',
        isPlayer: isHuman,
        character: char,
        position: this.map.spawnCT[i].clone(),
        velocity: new THREE.Vector3(),
        rotationY: Math.PI,
        pitch: 0,
        health: 100,
        armor: 100,
        hasHelmet: !this.isPistolRound,
        hasDefuseKit: !this.isPistolRound && (i % 2 === 0),
        hasC4: false,
        money: this.isPistolRound ? 800 : 3500,
        kills: 0,
        deaths: 0,
        assists: 0,
        damageDealt: 0,
        score: 0,
        primaryWeapon: this.isPistolRound ? null : 'm4a4',
        secondaryWeapon: 'usp',
        currentWeapon: this.isPistolRound ? 'usp' : 'm4a4',
        ammo: {
          ak47: { clip: 30, reserve: 90 },
          m4a4: { clip: 30, reserve: 90 },
          awp: { clip: 5, reserve: 30 },
          glock: { clip: 20, reserve: 120 },
          usp: { clip: 12, reserve: 24 },
          deagle: { clip: 7, reserve: 35 },
          knife: { clip: 1, reserve: 0 },
          c4: { clip: 1, reserve: 0 }
        },
        state: 'PATROL',
        targetWaypointId: null,
        path: [],
        targetEnemy: null,
        reactionTimer: 0.3,
        fireCooldown: 0,
        burstCount: 0,
        burstPauseTimer: 0,
        strafeDir: 1,
        strafeTimer: 1.0,
        plantDefuseTimer: 0
      };

      if (isHuman) this.playerEntity = bot;
      this.players.push(bot);
    }

    // 5 T Players
    for (let i = 0; i < 5; i++) {
      const isHuman = (this.playerTeam === 'T' && i === 0);
      const char = new HumanoidCharacter('T');
      this.scene.add(char.group);

      const bot: BotEntity = {
        id: `t_${i}`,
        name: isHuman ? 'You (T)' : `T ${tNames[i]}`,
        team: 'T',
        isPlayer: isHuman,
        character: char,
        position: this.map.spawnT[i].clone(),
        velocity: new THREE.Vector3(),
        rotationY: 0,
        pitch: 0,
        health: 100,
        armor: 100,
        hasHelmet: !this.isPistolRound,
        hasDefuseKit: false,
        hasC4: false,
        money: this.isPistolRound ? 800 : 3500,
        kills: 0,
        deaths: 0,
        assists: 0,
        damageDealt: 0,
        score: 0,
        primaryWeapon: this.isPistolRound ? null : 'ak47',
        secondaryWeapon: 'glock',
        currentWeapon: this.isPistolRound ? 'glock' : 'ak47',
        ammo: {
          ak47: { clip: 30, reserve: 90 },
          m4a4: { clip: 30, reserve: 90 },
          awp: { clip: 5, reserve: 30 },
          glock: { clip: 20, reserve: 120 },
          usp: { clip: 12, reserve: 24 },
          deagle: { clip: 7, reserve: 35 },
          knife: { clip: 1, reserve: 0 },
          c4: { clip: 1, reserve: 0 }
        },
        state: 'PATROL',
        targetWaypointId: null,
        path: [],
        targetEnemy: null,
        reactionTimer: 0.3,
        fireCooldown: 0,
        burstCount: 0,
        burstPauseTimer: 0,
        strafeDir: 1,
        strafeTimer: 1.0,
        plantDefuseTimer: 0
      };

      if (isHuman) this.playerEntity = bot;
      this.players.push(bot);
    }
  }

  public startRound() {
    this.roundPhase = 'FREEZE';
    this.freezeTimeLeft = 4.0;
    this.roundTimeLeft = 115;
    this.winner = null;
    this.winReason = '';
    this.c4IsPlanted = false;
    this.c4IsDropped = false;
    this.c4Position = null;
    this.c4PlantedSite = null;
    this.c4FuseTimeLeft = 40;
    this.c4BeepTimer = 1.0;
    this.plantProgress = 0;
    this.defuseProgress = 0;
    this.isPlayerPlanting = false;
    this.isPlayerDefusing = false;
    if (this.c4Mesh) this.c4Mesh.visible = false;

    // Reset players to spawns
    let ctIdx = 0;
    let tIdx = 0;
    const tPlayers = this.players.filter(p => p.team === 'T');

    this.players.forEach(p => {
      p.health = 100;
      p.armor = 100;
      p.hasC4 = false;
      p.character.isDead = false;
      p.character.group.visible = true;
      p.character.group.rotation.set(0, 0, 0);
      p.state = 'PATROL';
      p.path = [];
      p.targetEnemy = null;
      p.plantDefuseTimer = 0;

      // Restore ammo
      Object.keys(p.ammo).forEach(wKey => {
        const wid = wKey as WeaponId;
        p.ammo[wid].clip = WEAPON_REGISTRY[wid].magazineSize;
        p.ammo[wid].reserve = WEAPON_REGISTRY[wid].maxReserveAmmo;
      });

      if (p.team === 'CT') {
        p.position.copy(this.map.spawnCT[ctIdx % this.map.spawnCT.length]);
        p.rotationY = Math.PI;
        ctIdx++;
      } else {
        p.position.copy(this.map.spawnT[tIdx % this.map.spawnT.length]);
        p.rotationY = 0;
        tIdx++;
      }
      p.velocity.set(0, 0, 0);
    });

    // Assign C4 to random T (or human T)
    const bombCarrier = (this.playerTeam === 'T' && this.playerEntity) ? this.playerEntity : tPlayers[Math.floor(Math.random() * tPlayers.length)];
    bombCarrier.hasC4 = true;
    this.c4CarrierId = bombCarrier.id;

    // Setup player viewmodel
    if (this.playerEntity) {
      this.viewmodel.setWeapon(this.playerEntity.currentWeapon);
      this.playerYaw = this.playerEntity.rotationY;
      this.playerPitch = 0;
    }

    soundManager.playRadio('round_start');
  }

  public endRound(winner: 'CT' | 'T', reason: string) {
    if (this.roundPhase === 'ENDED') return;
    this.roundPhase = 'ENDED';
    this.winner = winner;
    this.winReason = reason;
    this.endRoundTimer = 6.0;

    if (winner === 'CT') {
      this.scoreCT++;
      soundManager.playRadio('ct_win');
    } else {
      this.scoreT++;
      soundManager.playRadio('t_win');
    }

    // Award round economy
    this.players.forEach(p => {
      if (p.team === winner) {
        p.money = Math.min(16000, p.money + 3250);
      } else {
        p.money = Math.min(16000, p.money + 1900);
      }
    });

    this.isPistolRound = false;
  }

  // --- WEAPON PURCHASE ---
  public buyWeapon(weaponId: WeaponId): boolean {
    if (!this.playerEntity || this.roundPhase !== 'FREEZE') return false;
    const def = WEAPON_REGISTRY[weaponId];

    if (this.playerEntity.money < def.price) return false;
    if (def.teamExclusive && def.teamExclusive !== this.playerEntity.team) return false;

    this.playerEntity.money -= def.price;
    if (def.slot === 'primary') {
      this.playerEntity.primaryWeapon = weaponId;
      this.playerEntity.currentWeapon = weaponId;
    } else if (def.slot === 'secondary') {
      this.playerEntity.secondaryWeapon = weaponId;
      this.playerEntity.currentWeapon = weaponId;
    }
    this.viewmodel.setWeapon(weaponId);
    return true;
  }

  public buyEquipment(item: 'armor' | 'helmet' | 'kit'): boolean {
    if (!this.playerEntity || this.roundPhase !== 'FREEZE') return false;
    if (item === 'armor' && this.playerEntity.money >= 650) {
      this.playerEntity.money -= 650;
      this.playerEntity.armor = 100;
      return true;
    } else if (item === 'helmet' && this.playerEntity.money >= 1000) {
      this.playerEntity.money -= 1000;
      this.playerEntity.armor = 100;
      this.playerEntity.hasHelmet = true;
      return true;
    } else if (item === 'kit' && this.playerEntity.team === 'CT' && this.playerEntity.money >= 400) {
      this.playerEntity.money -= 400;
      this.playerEntity.hasDefuseKit = true;
      return true;
    }
    return false;
  }

  // --- PLAYER ACTIONS ---
  public switchWeaponSlot(slot: 'primary' | 'secondary' | 'melee' | 'bomb') {
    if (!this.playerEntity || this.playerEntity.health <= 0) return;

    if (slot === 'primary' && this.playerEntity.primaryWeapon) {
      this.playerEntity.currentWeapon = this.playerEntity.primaryWeapon;
      this.viewmodel.setWeapon(this.playerEntity.primaryWeapon);
      this.isScoped = false;
    } else if (slot === 'secondary') {
      this.playerEntity.currentWeapon = this.playerEntity.secondaryWeapon;
      this.viewmodel.setWeapon(this.playerEntity.secondaryWeapon);
      this.isScoped = false;
    } else if (slot === 'melee') {
      this.playerEntity.currentWeapon = 'knife';
      this.viewmodel.setWeapon('knife');
      this.isScoped = false;
    } else if (slot === 'bomb' && this.playerEntity.hasC4) {
      this.playerEntity.currentWeapon = 'c4';
      this.viewmodel.setWeapon('c4');
      this.isScoped = false;
    }
  }

  public reloadPlayer() {
    if (!this.playerEntity || this.playerEntity.health <= 0 || this.isReloading) return;
    const wid = this.playerEntity.currentWeapon;
    const def = WEAPON_REGISTRY[wid];
    const ammo = this.playerEntity.ammo[wid];

    if (ammo.clip < def.magazineSize && ammo.reserve > 0) {
      this.isReloading = true;
      this.reloadTimer = def.reloadTime;
      this.viewmodel.triggerReload(def.reloadTime);
      soundManager.playReload('mag_out');
      setTimeout(() => soundManager.playReload('mag_in'), def.reloadTime * 450);
      setTimeout(() => soundManager.playReload('bolt'), def.reloadTime * 850);
    }
  }

  public handlePlayerFire() {
    if (!this.playerEntity || this.playerEntity.health <= 0 || this.roundPhase === 'FREEZE' || this.isReloading) return;
    if (this.fireCooldown > 0) return;

    const wid = this.playerEntity.currentWeapon;
    const def = WEAPON_REGISTRY[wid];
    const ammo = this.playerEntity.ammo[wid];

    if (wid === 'knife') {
      this.fireCooldown = def.fireRate;
      soundManager.playKnifeSlash();
      this.performKnifeAttack();
      return;
    }

    if (wid === 'c4') return;

    if (ammo.clip <= 0) {
      this.reloadPlayer();
      return;
    }

    // Spend Ammo
    ammo.clip--;
    this.fireCooldown = def.fireRate;

    // Viewmodel Recoil & Sound
    this.viewmodel.triggerRecoil(def.recoilClimb);
    soundManager.playGunshot(wid as 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle');

    // Camera Recoil Punch
    this.recoilOffsetPitch += def.recoilClimb;
    this.recoilOffsetYaw += (Math.random() - 0.5) * def.recoilSpread;

    // Bullet Raycast Calculation
    this.performBulletShot(this.playerEntity, wid, true);
  }

  private performKnifeAttack() {
    if (!this.playerEntity) return;
    const rayOrigin = this.camera.position.clone();
    const rayDir = new THREE.Vector3();
    this.camera.getWorldDirection(rayDir);

    const knifeRay = new THREE.Ray(rayOrigin, rayDir);
    const enemies = this.players.filter(p => p.team !== this.playerEntity!.team && p.health > 0);

    let hitEnemy: BotEntity | null = null;
    let closestDist = 2.5; // Knife range

    for (const enemy of enemies) {
      const hit = enemy.character.testHitboxes(knifeRay);
      if (hit && hit.distance < closestDist) {
        closestDist = hit.distance;
        hitEnemy = enemy;
      }
    }

    if (hitEnemy) {
      soundManager.playKnifeHit(true);
      this.applyDamage(hitEnemy, this.playerEntity, 55, 'knife', false);
      this.particles.addBloodSpurt(hitEnemy.position.clone().add(new THREE.Vector3(0, 1.2, 0)), false);
    }
  }

  private performBulletShot(shooter: BotEntity, weaponId: WeaponId, isPlayer: boolean) {
    const def = WEAPON_REGISTRY[weaponId];
    const rayOrigin = isPlayer
      ? this.camera.position.clone()
      : shooter.position.clone().add(new THREE.Vector3(0, 1.5, 0));

    const rayDir = new THREE.Vector3();
    if (isPlayer) {
      this.camera.getWorldDirection(rayDir);
      // Recoil & movement inaccuracy
      const isMoving = Math.hypot(shooter.velocity.x, shooter.velocity.z) > 0.5;
      const spread = (isMoving ? def.spreadMovingPenalty : 0) + this.recoilOffsetPitch * 0.4;
      rayDir.x += (Math.random() - 0.5) * spread;
      rayDir.y += (Math.random() - 0.5) * spread;
      rayDir.z += (Math.random() - 0.5) * spread;
      rayDir.normalize();
    } else {
      rayDir.set(Math.sin(shooter.rotationY), Math.sin(shooter.pitch), Math.cos(shooter.rotationY)).normalize();
    }

    const bulletRay = new THREE.Ray(rayOrigin, rayDir);

    // 1. Raycast against Map Geometry
    const mapHit = this.collision.raycastMap(rayOrigin, rayDir, 120);

    // 2. Raycast against Enemy Hitboxes
    const enemies = this.players.filter(p => p.team !== shooter.team && p.health > 0);
    let closestHitEnemy: BotEntity | null = null;
    let closestHitInfo: { dist: number; mult: number; zone: string; point: THREE.Vector3 } | null = null;
    let maxDist = mapHit.hit ? mapHit.distance : 120;

    for (const enemy of enemies) {
      const hit = enemy.character.testHitboxes(bulletRay);
      if (hit && hit.distance < maxDist) {
        maxDist = hit.distance;
        closestHitEnemy = enemy;
        closestHitInfo = { dist: hit.distance, mult: hit.multiplier, zone: hit.zone, point: hit.point };
      }
    }

    const endPoint = closestHitInfo ? closestHitInfo.point : (mapHit.hit ? mapHit.point : rayOrigin.clone().add(rayDir.clone().multiplyScalar(60)));
    this.particles.addBulletTracer(rayOrigin, endPoint);

    if (closestHitEnemy && closestHitInfo) {
      // Enemy Hit!
      const isHeadshot = closestHitInfo.zone === 'head';
      let damage = def.damage * closestHitInfo.mult;

      // Armor mitigation
      if (closestHitEnemy.armor > 0 && closestHitInfo.zone !== 'leg_left' && closestHitInfo.zone !== 'leg_right') {
        const armorReduction = 1 - def.armorPenetration;
        const mitigated = damage * armorReduction;
        closestHitEnemy.armor = Math.max(0, closestHitEnemy.armor - (mitigated * 0.5));
        damage -= mitigated * 0.5;
      }

      if (isPlayer) {
        soundManager.playHit(isHeadshot);
      }

      this.particles.addBloodSpurt(closestHitInfo.point, isHeadshot, rayDir);
      this.applyDamage(closestHitEnemy, shooter, Math.round(damage), weaponId, isHeadshot);
    } else if (mapHit.hit) {
      // Wall / Crate Impact
      this.particles.addImpactSparks(mapHit.point, mapHit.normal);
    }
  }

  private applyDamage(victim: BotEntity, attacker: BotEntity, damage: number, weapon: WeaponId, isHeadshot: boolean) {
    victim.health -= damage;
    attacker.damageDealt += damage;

    if (victim.health <= 0) {
      victim.health = 0;
      victim.deaths++;
      attacker.kills++;
      attacker.score += isHeadshot ? 3 : 2;
      attacker.money = Math.min(16000, attacker.money + WEAPON_REGISTRY[weapon].killReward);

      victim.character.triggerDeath();

      // C4 Drop Check
      if (victim.hasC4) {
        victim.hasC4 = false;
        this.c4IsDropped = true;
        this.c4Position = victim.position.clone();
        if (this.c4Mesh) {
          this.c4Mesh.position.copy(this.c4Position);
          this.c4Mesh.visible = true;
        }
      }

      // Record Killfeed
      const killEntry: KillFeedEntry = {
        id: `${Date.now()}_${Math.random()}`,
        killerName: attacker.name,
        killerTeam: attacker.team,
        victimName: victim.name,
        victimTeam: victim.team,
        weapon,
        isHeadshot,
        timestamp: Date.now()
      };
      this.killFeed.unshift(killEntry);
      if (this.killFeed.length > 6) this.killFeed.pop();

      if (attacker.isPlayer) {
        soundManager.playKillSound();
      }

      // Check Team Wipeout Conditions
      this.checkRoundWinConditions();
    }
  }

  private checkRoundWinConditions() {
    if (this.roundPhase === 'ENDED') return;

    const aliveCT = this.players.filter(p => p.team === 'CT' && p.health > 0).length;
    const aliveT = this.players.filter(p => p.team === 'T' && p.health > 0).length;

    if (aliveT === 0 && !this.c4IsPlanted) {
      this.endRound('CT', 'TERRORISTS ELIMINATED');
    } else if (aliveCT === 0 && !this.c4IsPlanted) {
      this.endRound('T', 'COUNTER-TERRORISTS ELIMINATED');
    } else if (aliveCT === 0 && this.c4IsPlanted) {
      // Ts will win when bomb explodes or CTs are all dead
    }
  }

  public takeOverBot(botId: string) {
    const bot = this.players.find(p => p.id === botId && p.health > 0 && p.team === this.playerTeam);
    if (!bot) return;

    if (this.playerEntity) {
      this.playerEntity.isPlayer = false;
    }
    bot.isPlayer = true;
    this.playerEntity = bot;
    this.spectatingBot = null;
    this.viewmodel.setWeapon(bot.currentWeapon);
    this.playerYaw = bot.rotationY;
    this.playerPitch = 0;
  }

  // --- MASTER UPDATE LOOP ---
  public update(delta: number) {
    this.particles.update(delta);

    // 1. Freeze Time & Round Timer
    if (this.roundPhase === 'FREEZE') {
      this.freezeTimeLeft -= delta;
      if (this.freezeTimeLeft <= 0) {
        this.roundPhase = 'LIVE';
      }
    } else if (this.roundPhase === 'LIVE') {
      if (!this.c4IsPlanted) {
        this.roundTimeLeft -= delta;
        if (this.roundTimeLeft <= 0) {
          this.endRound('CT', 'TIME EXPIRED');
        }
      }
    } else if (this.roundPhase === 'ENDED') {
      this.endRoundTimer -= delta;
      if (this.endRoundTimer <= 0) {
        this.round++;
        this.startRound();
      }
    }

    // 2. C4 Bomb Planted Countdown & Beeps
    if (this.c4IsPlanted) {
      this.c4FuseTimeLeft -= delta;

      // Accelerated beep interval (from 1.0s down to 0.1s)
      const beepInterval = Math.max(0.12, (this.c4FuseTimeLeft / 40) * 0.9 + 0.1);
      this.c4BeepTimer -= delta;
      if (this.c4BeepTimer <= 0) {
        this.c4BeepTimer = beepInterval;
        soundManager.playC4Beep();
        if (this.c4Light) {
          this.c4Light.intensity = 4.0;
          setTimeout(() => { if (this.c4Light) this.c4Light.intensity = 0; }, 80);
        }
      }

      if (this.c4FuseTimeLeft <= 0) {
        // C4 DETONATION
        this.c4IsPlanted = false;
        if (this.c4Position) {
          this.particles.addC4Explosion(this.c4Position);
          soundManager.playC4Explosion();

          // Kill everyone near explosion
          this.players.forEach(p => {
            if (p.health > 0 && this.c4Position) {
              const dist = p.position.distanceTo(this.c4Position);
              if (dist < 28) {
                p.health = 0;
                p.character.triggerDeath();
              }
            }
          });
        }
        this.endRound('T', 'TARGET DESTROYED');
      }
    }

    // 3. Update Human Player Movement & Camera
    this.updateHumanPlayer(delta);

    // 4. Update Bot AI
    const c4Context = {
      isPlanted: this.c4IsPlanted,
      position: this.c4Position,
      plantedSite: this.c4PlantedSite
    };

    this.players.forEach(bot => {
      this.botAI.updateBot(
        bot,
        this.players,
        c4Context,
        delta,
        (b, hit) => {
          this.performBulletShot(b, b.currentWeapon, false);
        },
        (b) => {
          // Bot planting
        },
        (b) => {
          // Bot completed plant
          this.c4IsPlanted = true;
          this.c4Position = b.position.clone();
          this.c4PlantedSite = this.map.plantZones[0].site;
          if (this.c4Mesh) {
            this.c4Mesh.position.copy(this.c4Position);
            this.c4Mesh.visible = true;
          }
          soundManager.playRadio('bomb_planted');
        },
        (b) => {
          // Bot defusing
        },
        (b) => {
          // Bot completed defuse
          this.c4IsPlanted = false;
          soundManager.playRadio('bomb_defused');
          this.endRound('CT', 'BOMB DEFUSED');
        }
      );
    });

    // 5. C4 Drop Pickup Check
    if (this.c4IsDropped && this.c4Position) {
      const aliveTs = this.players.filter(p => p.team === 'T' && p.health > 0);
      for (const t of aliveTs) {
        if (t.position.distanceTo(this.c4Position) < 2.0) {
          t.hasC4 = true;
          this.c4IsDropped = false;
          this.c4Position = null;
          if (this.c4Mesh) this.c4Mesh.visible = false;
          break;
        }
      }
    }
  }

  private updateHumanPlayer(delta: number) {
    if (!this.playerEntity) return;

    if (this.playerEntity.health <= 0) {
      // Spectator Mode
      const aliveTeammates = this.players.filter(p => p.team === this.playerTeam && p.health > 0);
      if (aliveTeammates.length > 0) {
        if (!this.spectatingBot || this.spectatingBot.health <= 0) {
          this.spectatingBot = aliveTeammates[0];
        }
        // Smooth Follow Camera
        const targetPos = this.spectatingBot.position.clone().add(new THREE.Vector3(0, 1.8, 0));
        this.camera.position.lerp(targetPos, delta * 8);
        this.camera.rotation.set(0, this.spectatingBot.rotationY, 0);
      }
      return;
    }

    // Cooldown timers
    if (this.fireCooldown > 0) this.fireCooldown -= delta;
    if (this.isReloading) {
      this.reloadTimer -= delta;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const wid = this.playerEntity.currentWeapon;
        const def = WEAPON_REGISTRY[wid];
        const ammo = this.playerEntity.ammo[wid];
        const needed = def.magazineSize - ammo.clip;
        const add = Math.min(needed, ammo.reserve);
        ammo.clip += add;
        ammo.reserve -= add;
      }
    }

    // Recoil Recovery
    this.recoilOffsetPitch = THREE.MathUtils.lerp(this.recoilOffsetPitch, 0, delta * 5);
    this.recoilOffsetYaw = THREE.MathUtils.lerp(this.recoilOffsetYaw, 0, delta * 5);

    // Continuous Automatic Firing
    const currentDef = WEAPON_REGISTRY[this.playerEntity.currentWeapon];
    if (this.mouseButtons[0] && currentDef.isAutomatic) {
      this.handlePlayerFire();
    }

    // WASD Movement
    const moveInput = new THREE.Vector3();
    if (this.keys['KeyW']) moveInput.z -= 1;
    if (this.keys['KeyS']) moveInput.z += 1;
    if (this.keys['KeyA']) moveInput.x -= 1;
    if (this.keys['KeyD']) moveInput.x += 1;

    let speed = 5.2; // Base run speed
    if (this.keys['ShiftLeft']) speed = 2.6; // Shift walk
    if (this.keys['ControlLeft']) speed = 2.2; // Crouch

    if (moveInput.length() > 0) {
      moveInput.normalize();
      const sin = Math.sin(this.playerYaw);
      const cos = Math.cos(this.playerYaw);

      this.playerEntity.velocity.x = (moveInput.x * cos + moveInput.z * sin) * speed;
      this.playerEntity.velocity.z = (-moveInput.x * sin + moveInput.z * cos) * speed;

      // Play Footsteps
      if (Math.random() < delta * 2.8 && !this.keys['ShiftLeft']) {
        soundManager.playFootstep();
      }
    }

    // Jump
    if (this.keys['Space']) {
      // Simple jump check
      if (this.playerEntity.position.y <= 0.1) {
        this.playerEntity.velocity.y = 7.0;
        soundManager.playJump();
      }
    }

    // Physics Movement Resolution
    const moveRes = this.collision.moveEntity(this.playerEntity.position, this.playerEntity.velocity, delta, 0.35, 1.8);
    this.playerEntity.position.copy(moveRes.pos);
    this.playerEntity.velocity.copy(moveRes.velocity);
    this.playerEntity.rotationY = this.playerYaw;

    // Camera Placement (Eye level)
    const crouchOffset = this.keys['ControlLeft'] ? -0.4 : 0;
    const eyeHeight = 1.65 + crouchOffset;
    this.camera.position.set(
      this.playerEntity.position.x,
      this.playerEntity.position.y + eyeHeight,
      this.playerEntity.position.z
    );

    // Apply pitch/yaw + recoil offset
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.playerYaw + this.recoilOffsetYaw;
    this.camera.rotation.x = THREE.MathUtils.clamp(this.playerPitch + this.recoilOffsetPitch, -Math.PI / 2.2, Math.PI / 2.2);

    // Camera Screen Shake
    if (this.particles.screenShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.particles.screenShake * 0.4;
      this.camera.position.y += (Math.random() - 0.5) * this.particles.screenShake * 0.4;
    }

    // Update First Person Viewmodel
    const isMoving = Math.hypot(this.playerEntity.velocity.x, this.playerEntity.velocity.z) > 0.4;
    const moveSpeed = Math.hypot(this.playerEntity.velocity.x, this.playerEntity.velocity.z);
    this.viewmodel.update(delta, isMoving, moveSpeed, this.isScoped);

    // C4 Plant & Defuse Interactions
    this.handleBombKeyHold(delta);
  }

  private handleBombKeyHold(delta: number) {
    if (!this.playerEntity) return;

    if (this.keys['KeyE']) {
      if (this.playerEntity.team === 'T' && this.playerEntity.hasC4 && !this.c4IsPlanted) {
        // Test if in A or B Plant Zone
        const inZone = this.map.plantZones.some(z => {
          return (
            this.playerEntity!.position.x >= z.min.x && this.playerEntity!.position.x <= z.max.x &&
            this.playerEntity!.position.z >= z.min.z && this.playerEntity!.position.z <= z.max.z
          );
        });

        if (inZone) {
          this.isPlayerPlanting = true;
          this.plantProgress = Math.min(1.0, this.plantProgress + delta / 3.2);
          if (this.plantProgress >= 1.0) {
            this.c4IsPlanted = true;
            this.playerEntity.hasC4 = false;
            this.c4Position = this.playerEntity.position.clone();
            this.c4PlantedSite = this.map.plantZones[0].site;
            if (this.c4Mesh) {
              this.c4Mesh.position.copy(this.c4Position);
              this.c4Mesh.visible = true;
            }
            soundManager.playRadio('bomb_planted');
            this.isPlayerPlanting = false;
            this.plantProgress = 0;
          }
        }
      } else if (this.playerEntity.team === 'CT' && this.c4IsPlanted && this.c4Position) {
        const dist = this.playerEntity.position.distanceTo(this.c4Position);
        if (dist < 2.5) {
          this.isPlayerDefusing = true;
          const defuseGoal = this.playerEntity.hasDefuseKit ? 5.0 : 10.0;
          this.defuseProgress = Math.min(1.0, this.defuseProgress + delta / defuseGoal);
          if (this.defuseProgress >= 1.0) {
            this.c4IsPlanted = false;
            soundManager.playRadio('bomb_defused');
            this.endRound('CT', 'BOMB DEFUSED');
            this.isPlayerDefusing = false;
            this.defuseProgress = 0;
          }
        }
      }
    } else {
      this.isPlayerPlanting = false;
      this.plantProgress = 0;
      this.isPlayerDefusing = false;
      this.defuseProgress = 0;
    }
  }

  public getGameState(): GameStateData {
    return {
      round: this.round,
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      roundPhase: this.roundPhase,
      roundTimeLeft: this.roundTimeLeft,
      winner: this.winner,
      winReason: this.winReason,
      isPistolRound: this.isPistolRound,
      playerEntity: this.playerEntity,
      c4: {
        isPlanted: this.c4IsPlanted,
        isDropped: this.c4IsDropped,
        carrierId: this.c4CarrierId,
        position: this.c4Position,
        plantedSite: this.c4PlantedSite,
        fuseTimeLeft: this.c4FuseTimeLeft,
        plantProgress: this.plantProgress,
        defuseProgress: this.defuseProgress
      },
      spectatingBot: this.spectatingBot,
      killFeed: [...this.killFeed]
    };
  }
}
