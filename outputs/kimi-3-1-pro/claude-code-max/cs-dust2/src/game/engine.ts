import * as THREE from 'three';
import { updateBot } from './ai';
import type { AIContext } from './ai';
import { AudioSystem } from './audio';
import { createMap, zoneAt } from './map';
import type { MapData, MapLayout } from './map';
import { NavigationGrid } from './navigation';
import {
  directionFromAngles, eyePosition, floorHeightAt, hasLineOfSight, jump, moveActor,
  raycastActors, raycastMap,
} from './physics';
import { WorldRenderer } from './renderer';
import type {
  Actor, BombState, BuyItem, EngineSnapshot, HitZone, KillfeedEntry,
  RoundPhase, Team, WeaponId, WeaponSlot,
} from './types';
import { BUY_ITEMS, WEAPONS, createWeapon, weaponForSlot } from './weapons';

const BOT_NAMES = {
  CT: ['ROOK', 'SABLE', 'ECHO', 'FROST', 'ATLAS'],
  T: ['VIPER', 'JACKAL', 'NOMAD', 'HAVOC', 'RAZE'],
};
const FIXED_STEP = 1 / 60;
const ROUND_SECONDS = 105;
const PLANT_SECONDS = 3.2;
const DEFUSE_SECONDS = 5;
const BOMB_SECONDS = 40;

function createActor(id: string, name: string, team: Team, controlled: boolean): Actor {
  const secondary = createWeapon(team === 'T' ? 'glock' : 'usp');
  return {
    id, name, team, controlled,
    position: new THREE.Vector3(), velocity: new THREE.Vector3(),
    yaw: 0, pitch: 0, radius: 0.36, height: 1.80,
    health: 100, armor: 0, alive: true, grounded: true,
    money: 800, kills: 0, deaths: 0,
    inventory: { primary: null, secondary, melee: createWeapon('knife'), active: 'secondary', previous: 'melee', hasBomb: false },
    brain: {
      state: 'advance', path: [], pathIndex: 0, destination: null, targetId: null,
      nextThink: 0, nextPath: 0, reactionAt: 0, nextShot: 0, burstLeft: 0,
      strafeDirection: 1, strafeUntil: 0, preferredSite: Number(id.slice(1)) % 3 === 2 ? 'B' : 'A',
      objectiveStage: 0, stuckFor: 0, lastPosition: new THREE.Vector3(),
    },
    reloadEndsAt: 0, switchEndsAt: 0, nextShotAt: 0, lastShotAt: -10,
    weaponHeat: 0, walkPhase: 0, lastStepAt: 0, lastDamageAt: -10,
    lastAttackerId: null, action: null, actionStartedAt: 0,
  };
}

export class GameEngine {
  readonly map: MapData;
  readonly audio = new AudioSystem();
  private renderer: WorldRenderer;
  private navigation: NavigationGrid;
  private actors: Actor[] = [];
  private bomb: BombState;
  private controlledId = 'p0';
  private spectateId: string | null = null;
  private phase: RoundPhase = 'warmup';
  private round = 0;
  private roundTime = ROUND_SECONDS;
  private phaseTime = 0;
  private score: Record<Team, number> = { CT: 0, T: 0 };
  private winner: Team | null = null;
  private endReason = '';
  private started = false;
  private paused = false;
  private pointerLocked = false;
  private buyOpen = false;
  private muted = false;
  private time = 0;
  private lastFrame = 0;
  private accumulator = 0;
  private animationFrame = 0;
  private lastSnapshotAt = 0;
  private keys = new Set<string>();
  private triggerDown = false;
  private triggerQueued = false;
  private scopeDown = false;
  private scoped = false;
  private jumpQueued = false;
  private killfeed: KillfeedEntry[] = [];
  private killfeedId = 0;
  private hitMarkerAt = -10;
  private damageFlashAt = -10;
  private announcement = '';
  private announcementDetail = '';
  private announcementUntil = 0;
  private disposed = false;

  constructor(container: HTMLElement, private onSnapshot: (snapshot: EngineSnapshot) => void) {
    this.map = createMap();
    this.renderer = new WorldRenderer(container, this.map);
    this.navigation = new NavigationGrid(this.map);
    this.actors = this.createTeamActors('CT');
    this.bomb = this.emptyBomb();
    this.placeActors();
    this.bindInput();
    this.emitSnapshot();
    this.animationFrame = requestAnimationFrame(this.frame);
  }

  private emptyBomb(): BombState {
    return {
      status: 'carried', carrierId: null, planterId: null, position: new THREE.Vector3(),
      site: null, timer: BOMB_SECONDS, plantProgress: 0, defuseProgress: 0,
      actionActorId: null, nextBeepAt: 0,
    };
  }

  private createTeamActors(playerTeam: Team) {
    const actors: Actor[] = [];
    for (const team of ['CT', 'T'] as Team[]) {
      for (let index = 0; index < 5; index++) {
        const globalIndex = playerTeam === team ? index : index + 5;
        const controlled = team === playerTeam && index === 0;
        const name = controlled ? 'PLAYER' : BOT_NAMES[team][index];
        actors.push(createActor(`p${globalIndex}`, name, team, controlled));
      }
    }
    return actors;
  }

  private placeActors() {
    for (const actor of this.actors) {
      const teammates = this.actors.filter((candidate) => candidate.team === actor.team);
      const index = teammates.indexOf(actor);
      const spawn = actor.team === 'CT' ? this.map.ctSpawns[index] : this.map.tSpawns[index];
      actor.position.copy(spawn.position);
      actor.position.y = floorHeightAt(this.map, spawn.position.x, spawn.position.z);
      actor.velocity.set(0, 0, 0);
      actor.yaw = spawn.yaw;
      actor.pitch = 0;
      actor.brain.lastPosition.copy(actor.position);
    }
  }

  start(team: Team) {
    this.audio.unlock();
    this.started = true;
    this.paused = false;
    this.score = { CT: 0, T: 0 };
    this.round = 0;
    this.time = 0;
    this.controlledId = 'p0';
    this.spectateId = null;
    this.actors = this.createTeamActors(team);
    this.killfeed = [];
    this.resetRound();
    this.requestPointerLock();
    this.emitSnapshot();
  }

  private resetRound() {
    this.round++;
    this.phase = 'freeze';
    this.phaseTime = this.round === 1 ? 10 : 8;
    this.roundTime = ROUND_SECONDS;
    this.winner = null;
    this.endReason = '';
    this.bomb = this.emptyBomb();
    this.spectateId = null;
    this.scoped = false;
    this.triggerDown = false;
    this.triggerQueued = false;
    this.jumpQueued = false;
    for (const actor of this.actors) {
      actor.health = 100;
      actor.armor = 0;
      actor.alive = true;
      actor.grounded = true;
      actor.inventory.primary = null;
      actor.inventory.secondary = createWeapon(actor.team === 'T' ? 'glock' : 'usp');
      actor.inventory.melee = createWeapon('knife');
      actor.inventory.active = 'secondary';
      actor.inventory.previous = 'melee';
      actor.inventory.hasBomb = false;
      actor.reloadEndsAt = 0;
      actor.switchEndsAt = 0;
      actor.nextShotAt = 0;
      actor.lastShotAt = -10;
      actor.weaponHeat = 0;
      actor.action = null;
      actor.lastAttackerId = null;
      actor.brain.path = [];
      actor.brain.pathIndex = 0;
      actor.brain.destination = null;
      actor.brain.targetId = null;
      actor.brain.objectiveStage = 0;
      actor.brain.nextThink = this.time + Math.random() * 0.2;
      actor.brain.nextPath = 0;
      actor.brain.nextShot = 0;
      if (this.round > 1 && !actor.controlled) this.botBuy(actor);
    }
    this.placeActors();
    const carriers = this.actors.filter((actor) => actor.team === 'T');
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    carrier.inventory.hasBomb = true;
    this.bomb.status = 'carried';
    this.bomb.carrierId = carrier.id;
    this.bomb.position.copy(carrier.position);
    this.announce(
      `ROUND ${this.round}  //  ${this.round === 1 ? '手枪局' : '购买阶段'}`,
      this.round === 1 ? '默认手枪 · 无主武器 · 按 B 购买沙鹰或护甲' : '按 B 购买装备 · 准备推进',
      this.phaseTime,
    );
    this.emitSnapshot();
  }

  private botBuy(actor: Actor) {
    const index = Number(actor.id.slice(1));
    if (index % 5 === 2 && actor.money >= WEAPONS.awp.price) {
      actor.inventory.primary = createWeapon('awp');
      actor.money -= WEAPONS.awp.price;
    } else {
      const rifle = actor.team === 'T' ? WEAPONS.ak47 : WEAPONS.m4a4;
      if (actor.money >= rifle.price) {
        actor.inventory.primary = createWeapon(rifle.id);
        actor.money -= rifle.price;
      }
    }
    if (actor.money >= 650) {
      actor.armor = 100;
      actor.money -= 650;
    }
    if (!actor.inventory.primary && actor.money >= 700 && index % 2 === 0) {
      actor.inventory.secondary = createWeapon('deagle');
      actor.money -= 700;
    }
    actor.inventory.active = actor.inventory.primary ? 'primary' : 'secondary';
  }

  private frame = (milliseconds: number) => {
    if (this.disposed) return;
    const seconds = milliseconds / 1000;
    const dt = this.lastFrame === 0 ? 0 : Math.min(0.08, seconds - this.lastFrame);
    this.lastFrame = seconds;
    if (this.started && !this.paused) {
      this.accumulator = Math.min(0.15, this.accumulator + dt);
      while (this.accumulator >= FIXED_STEP) {
        this.fixedUpdate(FIXED_STEP);
        this.accumulator -= FIXED_STEP;
      }
    }
    const viewActor = this.getViewActor();
    this.renderer.sync(this.actors, this.bomb, viewActor, viewActor.id !== this.controlledId, this.scoped, dt, this.time);
    this.renderer.render();
    this.audio.setListener(this.renderer.camera.position, viewActor.yaw);
    if (seconds - this.lastSnapshotAt > 1 / 15) {
      this.lastSnapshotAt = seconds;
      this.emitSnapshot();
    }
    this.animationFrame = requestAnimationFrame(this.frame);
  };

  private fixedUpdate(dt: number) {
    this.time += dt;
    this.map.updateDoors(this.actors, dt);
    for (const actor of this.actors) {
      actor.weaponHeat = Math.max(0, actor.weaponHeat - dt * 4.5);
      if (actor.reloadEndsAt > 0 && this.time >= actor.reloadEndsAt) this.finishReload(actor);
    }

    if (this.phase === 'freeze') {
      this.phaseTime -= dt;
      this.updatePlayer(dt, false);
      if (this.phaseTime <= 0) {
        this.phase = 'live';
        this.announce('行动开始', this.actors.find((actor) => actor.id === this.controlledId)?.team === 'T' ? '突破防线，安放 C4' : '守住目标区域', 2.2);
      }
    } else if (this.phase === 'live') {
      this.updatePlayer(dt, true);
      const context: AIContext = {
        time: this.time, map: this.map, actors: this.actors, bomb: this.bomb,
        phase: this.phase, navigation: this.navigation,
        moveBot: (actor, direction, speed, step) => this.moveWorld(actor, direction, speed, step),
        fireBot: (actor) => this.fireWeapon(actor),
        reload: (actor) => this.startReload(actor),
        jumpBot: (actor) => { jump(actor); },
        setAction: (actor, action) => this.setAction(actor, action),
      };
      for (const actor of this.actors) {
        if (!actor.controlled) updateBot(actor, context, dt);
      }
      this.updateBomb(dt);
      if (this.bomb.status !== 'planted') {
        this.roundTime -= dt;
        if (this.roundTime <= 0) this.endRound('CT', '时间耗尽');
      }
      this.checkElimination();
    } else if (this.phase === 'roundEnd') {
      this.phaseTime -= dt;
      this.updatePlayer(dt, false);
      if (this.phaseTime <= 0) this.resetRound();
    }
    this.killfeed = this.killfeed.filter((entry) => entry.expiresAt > this.time);
  }

  private get controlled() {
    return this.actors.find((actor) => actor.id === this.controlledId) ?? this.actors[0];
  }

  private getViewActor() {
    if (this.controlled.alive) return this.controlled;
    const spectated = this.actors.find((actor) => actor.id === this.spectateId && actor.alive);
    return spectated ?? this.controlled;
  }

  private updatePlayer(dt: number, allowActions: boolean) {
    const actor = this.controlled;
    if (!actor.alive) {
      this.scoped = false;
      if (!this.getViewActor().alive || this.getViewActor().id === actor.id) this.cycleSpectate();
      return;
    }
    const wasScoped = this.scoped;
    this.scoped = allowActions && this.scopeDown && weaponForSlot(actor.inventory).id === 'awp'
      && actor.reloadEndsAt <= this.time && actor.switchEndsAt <= this.time && !actor.action;
    if (wasScoped !== this.scoped) this.audio.scope(this.scoped);

    if (allowActions && this.pointerLocked) {
      const zone = zoneAt(this.map, actor.position);
      if (this.keys.has('KeyE') && actor.team === 'T' && actor.inventory.hasBomb && (zone?.id === 'A' || zone?.id === 'B')) {
        this.setAction(actor, 'plant');
      } else if (this.keys.has('KeyE') && actor.team === 'CT' && this.bomb.status === 'planted'
        && actor.position.distanceTo(this.bomb.position) < 1.85) {
        this.setAction(actor, 'defuse');
      } else {
        this.setAction(actor, null);
      }
    } else {
      this.setAction(actor, null);
    }

    if (allowActions && !actor.action) {
      let forward = 0;
      let strafe = 0;
      if (this.keys.has('KeyW')) forward += 1;
      if (this.keys.has('KeyS')) forward -= 1;
      if (this.keys.has('KeyD')) strafe += 1;
      if (this.keys.has('KeyA')) strafe -= 1;
      const activeId = weaponForSlot(actor.inventory).id;
      let speed = activeId === 'knife' ? 5.0 : activeId === 'awp' ? 3.8 : actor.inventory.active === 'secondary' ? 4.55 : 4.2;
      if (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight')) speed *= 0.52;
      if (this.scoped) speed *= 0.55;
      const direction = new THREE.Vector3(
        -Math.sin(actor.yaw) * forward + Math.cos(actor.yaw) * strafe,
        0,
        -Math.cos(actor.yaw) * forward - Math.sin(actor.yaw) * strafe,
      );
      this.moveWorld(actor, direction, speed, dt);
      if (this.jumpQueued) jump(actor);
    } else {
      actor.velocity.x = THREE.MathUtils.damp(actor.velocity.x, 0, 15, dt);
      actor.velocity.z = THREE.MathUtils.damp(actor.velocity.z, 0, 15, dt);
      if (actor.alive && this.phase !== 'freeze') moveActor(actor, this.map, 0, 0, dt);
    }
    this.jumpQueued = false;

    const definition = WEAPONS[weaponForSlot(actor.inventory).id];
    const wantsFire = this.triggerDown && (definition.automatic || this.triggerQueued);
    if (allowActions && wantsFire && !actor.action && this.pointerLocked) this.fireWeapon(actor);
    this.triggerQueued = false;
  }

  private moveWorld(actor: Actor, direction: THREE.Vector3, speed: number, dt: number) {
    if (!actor.alive) return;
    if (actor.action) {
      direction.set(0, 0, 0);
      speed = 0;
    }
    direction.y = 0;
    if (direction.lengthSq() > 1) direction.normalize();
    const acceleration = actor.grounded ? 18 : 4.5;
    actor.velocity.x = THREE.MathUtils.damp(actor.velocity.x, direction.x * speed, acceleration, dt);
    actor.velocity.z = THREE.MathUtils.damp(actor.velocity.z, direction.z * speed, acceleration, dt);
    const oldX = actor.position.x;
    const oldZ = actor.position.z;
    moveActor(actor, this.map, actor.velocity.x * dt, actor.velocity.z * dt, dt);
    actor.velocity.x = (actor.position.x - oldX) / dt;
    actor.velocity.z = (actor.position.z - oldZ) / dt;
    const horizontalSpeed = Math.hypot(actor.velocity.x, actor.velocity.z);
    actor.walkPhase += horizontalSpeed * dt * 2.35;
    if (actor.grounded && horizontalSpeed > 1.1 && this.time - actor.lastStepAt > (horizontalSpeed > 3.8 ? 0.34 : 0.44)) {
      actor.lastStepAt = this.time;
      this.audio.footstep(actor.controlled ? undefined : actor.position, horizontalSpeed > 3.8);
    }
  }

  private fireWeapon(actor: Actor) {
    if (!actor.alive || this.phase !== 'live' || actor.action || this.time < actor.nextShotAt || this.time < actor.switchEndsAt) return false;
    if (actor.reloadEndsAt > this.time) return false;
    const state = weaponForSlot(actor.inventory);
    const definition = WEAPONS[state.id];
    if (state.id !== 'knife' && state.ammo <= 0) {
      if (actor.controlled) this.audio.dryFire();
      actor.nextShotAt = this.time + 0.25;
      this.startReload(actor);
      return false;
    }
    actor.nextShotAt = this.time + definition.fireInterval;
    actor.lastShotAt = this.time;
    actor.weaponHeat = Math.min(14, actor.weaponHeat + 1);
    if (state.id !== 'knife') state.ammo--;
    this.setAction(actor, null);
    this.renderer.notifyShot(actor);
    this.audio.weapon(state.id, actor.controlled ? undefined : actor.position);

    const origin = eyePosition(actor);
    const direction = directionFromAngles(actor.yaw, actor.pitch);
    let spread = definition.baseSpread + definition.heatSpread * actor.weaponHeat;
    const speed = Math.hypot(actor.velocity.x, actor.velocity.z);
    spread += definition.moveSpread * Math.min(1.4, speed / 4.2);
    if (!actor.grounded) spread += 0.035;
    if (state.id === 'awp' && (actor.controlled ? this.scoped : true)) spread = 0.0012 + speed * 0.004;
    if (state.id !== 'knife' && spread > 0) {
      const right = new THREE.Vector3(Math.cos(actor.yaw), 0, -Math.sin(actor.yaw));
      const up = new THREE.Vector3().crossVectors(right, direction).normalize();
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * spread;
      direction.addScaledVector(right, Math.cos(angle) * radius).addScaledVector(up, Math.sin(angle) * radius).normalize();
    }

    const mapHit = raycastMap(this.map, origin, direction, definition.range);
    const mapDistance = mapHit?.distance ?? definition.range;
    const actorHit = raycastActors(this.actors, origin, direction, mapDistance, actor.id);
    let end = mapHit?.point ?? origin.clone().addScaledVector(direction, definition.range);
    if (actorHit) {
      end = actorHit.point;
      if (actorHit.actor.team !== actor.team) {
        this.applyDamage(actorHit.actor, actor, definition.damage, actorHit.zone, state.id);
        this.renderer.spawnImpact(end, true);
      }
    } else if (mapHit) {
      this.renderer.spawnImpact(mapHit.point, false);
    }
    if (state.id !== 'knife') {
      const right = new THREE.Vector3(Math.cos(actor.yaw), 0, -Math.sin(actor.yaw));
      const tracerStart = origin.clone().addScaledVector(direction, 0.55).addScaledVector(right, actor.controlled ? 0.14 : 0.04);
      this.renderer.spawnTracer(tracerStart, end, definition.tracer);
    }
    if (actor.controlled) {
      actor.pitch = THREE.MathUtils.clamp(actor.pitch + definition.recoilPitch * (this.scoped ? 0.7 : 1), -1.45, 1.45);
      actor.yaw += (Math.random() - 0.5) * definition.recoilYaw * 2;
    } else {
      actor.pitch = THREE.MathUtils.clamp(actor.pitch + definition.recoilPitch * 0.1, -1.4, 1.4);
    }
    return true;
  }

  private applyDamage(target: Actor, attacker: Actor, baseDamage: number, zone: HitZone, weaponId: WeaponId | 'c4') {
    if (!target.alive) return;
    const definition = weaponId === 'c4' ? null : WEAPONS[weaponId];
    const multiplier = definition ? definition.zoneMultipliers[zone] : 1;
    let damage = baseDamage * multiplier;
    if (target.armor > 0 && zone !== 'legs') {
      damage *= definition?.armorPenetration ?? 0.75;
      target.armor = Math.max(0, target.armor - damage * 0.35);
    }
    const finalDamage = Math.max(1, Math.round(damage));
    target.health = Math.max(0, target.health - finalDamage);
    target.lastDamageAt = this.time;
    target.lastAttackerId = attacker.id;
    if (target.controlled) {
      this.damageFlashAt = this.time;
      this.renderer.notifyDamage();
    }
    if (attacker.controlled) {
      this.hitMarkerAt = this.time;
      this.audio.hit(zone === 'head');
    }
    if (target.health <= 0) this.killActor(target, attacker, weaponId, zone === 'head');
  }

  private killActor(victim: Actor, killer: Actor, weapon: WeaponId | 'c4', headshot: boolean) {
    victim.alive = false;
    victim.deaths++;
    victim.action = null;
    victim.velocity.set(0, 0, 0);
    killer.kills++;
    killer.money = Math.min(16000, killer.money + (weapon === 'knife' ? 1500 : weapon === 'awp' ? 100 : 300));
    this.killfeed.unshift({
      id: ++this.killfeedId, killer: killer.name, killerTeam: killer.team,
      victim: victim.name, victimTeam: victim.team, weapon, headshot,
      expiresAt: this.time + 5.5,
    });
    this.killfeed = this.killfeed.slice(0, 6);
    if (killer.controlled) this.audio.kill();
    if (victim.inventory.hasBomb) {
      victim.inventory.hasBomb = false;
      this.bomb.status = 'dropped';
      this.bomb.carrierId = null;
      this.bomb.position.copy(victim.position);
      this.bomb.position.y = floorHeightAt(this.map, victim.position.x, victim.position.z);
      this.bomb.plantProgress = 0;
      this.bomb.actionActorId = null;
      this.announce('C4 已掉落', 'T 可靠近拾取', 2.0);
    }
    if (victim.id === this.controlledId) {
      this.scoped = false;
      this.spectateId = null;
      this.cycleSpectate();
      this.announce('你已阵亡', 'F 切换队友视角  ·  G 接管当前队友', 4.0);
    } else if (victim.id === this.spectateId) {
      this.cycleSpectate();
    }
  }

  private startReload(actor: Actor) {
    const state = weaponForSlot(actor.inventory);
    const definition = WEAPONS[state.id];
    if (state.id === 'knife' || actor.reloadEndsAt > this.time || state.ammo >= definition.magazine || state.reserve <= 0 || !actor.alive) return;
    this.setAction(actor, null);
    actor.reloadEndsAt = this.time + definition.reloadTime;
    this.audio.reload(actor.controlled ? undefined : actor.position, definition.reloadTime > 3);
  }

  private finishReload(actor: Actor) {
    const state = weaponForSlot(actor.inventory);
    const definition = WEAPONS[state.id];
    const needed = definition.magazine - state.ammo;
    const transferred = Math.min(needed, state.reserve);
    state.ammo += transferred;
    state.reserve -= transferred;
    actor.reloadEndsAt = 0;
  }

  private switchWeapon(actor: Actor, slot: WeaponSlot) {
    if (slot === 'primary' && !actor.inventory.primary) return;
    if (actor.inventory.active === slot) return;
    actor.inventory.previous = actor.inventory.active;
    actor.inventory.active = slot;
    actor.reloadEndsAt = 0;
    actor.switchEndsAt = this.time + 0.38;
    actor.weaponHeat = 0;
    this.scoped = false;
    this.setAction(actor, null);
  }

  private setAction(actor: Actor, action: 'plant' | 'defuse' | null) {
    if (actor.action === action) return;
    if (actor.action && this.bomb.actionActorId === actor.id) {
      this.bomb.actionActorId = null;
      this.bomb.plantProgress = 0;
      this.bomb.defuseProgress = 0;
    }
    actor.action = null;
    if (!action || !actor.alive) return;
    if (this.bomb.actionActorId && this.bomb.actionActorId !== actor.id) return;
    if (action === 'plant') {
      const zone = zoneAt(this.map, actor.position);
      if (actor.team !== 'T' || !actor.inventory.hasBomb || this.bomb.status !== 'carried' || (zone?.id !== 'A' && zone?.id !== 'B')) return;
      this.bomb.plantProgress = 0;
    } else {
      if (actor.team !== 'CT' || this.bomb.status !== 'planted' || actor.position.distanceTo(this.bomb.position) > 1.9) return;
      this.bomb.defuseProgress = 0;
      this.audio.defuse(actor.controlled ? undefined : this.bomb.position);
    }
    actor.action = action;
    actor.actionStartedAt = this.time;
    this.bomb.actionActorId = actor.id;
  }

  private updateBomb(dt: number) {
    if (this.bomb.status === 'carried') {
      const carrier = this.actors.find((actor) => actor.id === this.bomb.carrierId && actor.alive);
      if (carrier) {
        this.bomb.position.copy(carrier.position);
        const actor = this.actors.find((candidate) => candidate.id === this.bomb.actionActorId);
        if (actor?.action === 'plant' && actor.alive && actor.id === carrier.id) {
          const zone = zoneAt(this.map, actor.position);
          if (zone?.id === 'A' || zone?.id === 'B') {
            this.bomb.plantProgress += dt / PLANT_SECONDS;
            if (this.bomb.plantProgress >= 1) {
              this.bomb.status = 'planted';
              this.bomb.site = zone.id;
              this.bomb.position.copy(actor.position);
              this.bomb.position.y = floorHeightAt(this.map, actor.position.x, actor.position.z);
              this.bomb.carrierId = null;
              this.bomb.planterId = actor.id;
              this.bomb.timer = BOMB_SECONDS;
              this.bomb.nextBeepAt = this.time;
              this.bomb.actionActorId = null;
              actor.action = null;
              actor.inventory.hasBomb = false;
              this.audio.plant(this.bomb.position);
              this.announce(`C4 已在 ${zone.id} 点安放`, '40 秒后爆炸', 3.0);
            }
          } else this.setAction(actor, null);
        }
      }
    } else if (this.bomb.status === 'dropped') {
      for (const actor of this.actors) {
        if (!actor.alive || actor.team !== 'T' || actor.position.distanceTo(this.bomb.position) > 1.45) continue;
        actor.inventory.hasBomb = true;
        this.bomb.status = 'carried';
        this.bomb.carrierId = actor.id;
        this.announce('C4 已拾取', actor.controlled ? '前往 A 点或 B 点安放' : `${actor.name} 回收了炸弹`, 1.8);
        break;
      }
    } else if (this.bomb.status === 'planted') {
      this.bomb.timer -= dt;
      if (this.time >= this.bomb.nextBeepAt) {
        this.audio.bombBeep(this.bomb.position, this.bomb.timer < 10);
        this.bomb.nextBeepAt = this.time + THREE.MathUtils.clamp(this.bomb.timer / 24, 0.09, 1.0);
      }
      const defuser = this.actors.find((actor) => actor.id === this.bomb.actionActorId && actor.action === 'defuse' && actor.alive);
      if (defuser && defuser.team === 'CT' && defuser.position.distanceTo(this.bomb.position) <= 1.95) {
        this.bomb.defuseProgress += dt / DEFUSE_SECONDS;
        if (this.bomb.defuseProgress >= 1) {
          this.bomb.status = 'defused';
          this.bomb.actionActorId = null;
          defuser.action = null;
          this.audio.defuse(this.bomb.position);
          this.endRound('CT', 'C4 已成功拆除');
          return;
        }
      } else if (this.bomb.actionActorId) {
        this.bomb.actionActorId = null;
        this.bomb.defuseProgress = 0;
      }
      if (this.bomb.timer <= 0) this.explodeBomb();
    }
  }

  private explodeBomb() {
    if (this.bomb.status !== 'planted') return;
    this.bomb.status = 'exploded';
    this.bomb.timer = 0;
    this.audio.explosion(this.bomb.position);
    this.renderer.explosion(this.bomb.position);
    const planter = this.actors.find((actor) => actor.id === this.bomb.planterId) ?? this.actors.find((actor) => actor.team === 'T')!;
    for (const actor of this.actors) {
      const distance = actor.position.distanceTo(this.bomb.position);
      if (actor.alive && distance < 23) this.applyDamage(actor, planter, 620 * (1 - distance / 25), 'chest', 'c4');
    }
    this.endRound('T', 'C4 爆炸');
  }

  private checkElimination() {
    if (this.phase !== 'live') return;
    const ctAlive = this.actors.some((actor) => actor.team === 'CT' && actor.alive);
    const tAlive = this.actors.some((actor) => actor.team === 'T' && actor.alive);
    if (!ctAlive) this.endRound('T', 'CT 全员阵亡');
    else if (!tAlive && this.bomb.status !== 'planted') this.endRound('CT', 'T 全员阵亡');
  }

  private endRound(winner: Team, reason: string) {
    if (this.phase === 'roundEnd') return;
    this.phase = 'roundEnd';
    this.winner = winner;
    this.endReason = reason;
    this.phaseTime = 5;
    this.score[winner]++;
    this.scoped = false;
    for (const actor of this.actors) {
      actor.action = null;
      actor.money = Math.min(16000, actor.money + (actor.team === winner ? 3250 : 1400));
    }
    this.bomb.actionActorId = null;
    this.announce(`${winner} 赢得本回合`, reason, 5);
    this.audio.round(winner === this.controlled.team);
    this.emitSnapshot();
  }

  private announce(text: string, detail: string, duration: number) {
    this.announcement = text;
    this.announcementDetail = detail;
    this.announcementUntil = this.time + duration;
  }

  private cycleSpectate() {
    if (this.controlled.alive) return;
    const teammates = this.actors.filter((actor) => actor.team === this.controlled.team && actor.alive && actor.id !== this.controlledId);
    if (teammates.length === 0) { this.spectateId = null; return; }
    const index = teammates.findIndex((actor) => actor.id === this.spectateId);
    this.spectateId = teammates[(index + 1) % teammates.length].id;
  }

  private takeover() {
    if (this.controlled.alive) return;
    const target = this.actors.find((actor) => actor.id === this.spectateId && actor.alive && actor.team === this.controlled.team);
    if (!target) return;
    target.controlled = true;
    this.controlledId = target.id;
    this.spectateId = null;
    target.brain.path = [];
    this.announce(`已接管 ${target.name}`, '继续完成本回合', 2.0);
    this.emitSnapshot();
  }

  private canBuy() {
    const actor = this.controlled;
    if (this.phase !== 'freeze' || !actor.alive) return false;
    const zone = zoneAt(this.map, actor.position);
    return actor.team === 'CT' ? zone?.id === 'CTSpawn' : zone?.id === 'TSpawn';
  }

  private toggleBuy() {
    if (this.buyOpen) { this.closeBuy(); return; }
    if (!this.canBuy()) return;
    this.buyOpen = true;
    this.paused = true;
    if (document.pointerLockElement) document.exitPointerLock();
    this.emitSnapshot();
  }

  closeBuy() {
    if (!this.buyOpen) return;
    this.buyOpen = false;
    this.paused = false;
    this.requestPointerLock();
    this.emitSnapshot();
  }

  buy(itemId: BuyItem['id']) {
    const actor = this.controlled;
    const item = BUY_ITEMS.find((candidate) => candidate.id === itemId);
    if (!item || !this.canBuy() || actor.money < item.price) return;
    actor.money -= item.price;
    if (item.id === 'armor') {
      actor.armor = 100;
    } else {
      const definition = WEAPONS[item.id];
      const weapon = createWeapon(item.id);
      if (definition.slot === 'primary') actor.inventory.primary = weapon;
      else actor.inventory.secondary = weapon;
      actor.inventory.active = definition.slot;
      actor.switchEndsAt = this.time + 0.25;
    }
    this.emitSnapshot();
  }

  resume() {
    this.audio.unlock();
    if (this.buyOpen) { this.closeBuy(); return; }
    this.paused = false;
    this.requestPointerLock();
  }

  private requestPointerLock() {
    const result = this.renderer.renderer.domElement.requestPointerLock() as unknown as Promise<void> | undefined;
    if (result) void result.catch(() => { this.paused = true; });
  }

  private bindInput() {
    const canvas = this.renderer.renderer.domElement;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('resize', this.onResize);
    document.addEventListener('pointerlockchange', this.onPointerLock);
    canvas.addEventListener('contextmenu', this.onContextMenu);
    canvas.addEventListener('click', this.onCanvasClick);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE'].includes(event.code)) event.preventDefault();
    if (event.code === 'KeyB' && !event.repeat && this.started) { this.toggleBuy(); return; }
    if (event.code === 'KeyM' && !event.repeat) {
      this.muted = !this.muted;
      this.audio.setMuted(this.muted);
      return;
    }
    if (this.paused || !this.started) return;
    this.keys.add(event.code);
    if (event.repeat) return;
    const actor = this.controlled;
    if (!actor.alive) {
      if (event.code === 'KeyF') this.cycleSpectate();
      if (event.code === 'KeyG' || event.code === 'Enter') this.takeover();
      return;
    }
    if (event.code === 'Space') this.jumpQueued = true;
    if (event.code === 'KeyR') this.startReload(actor);
    if (event.code === 'Digit1') this.switchWeapon(actor, 'primary');
    if (event.code === 'Digit2') this.switchWeapon(actor, 'secondary');
    if (event.code === 'Digit3') this.switchWeapon(actor, 'melee');
    if (event.code === 'KeyQ') this.switchWeapon(actor, actor.inventory.previous);
  };

  private onKeyUp = (event: KeyboardEvent) => { this.keys.delete(event.code); };
  private onMouseDown = (event: MouseEvent) => {
    if (!this.pointerLocked || this.paused) return;
    if (event.button === 0) { this.triggerDown = true; this.triggerQueued = true; }
    if (event.button === 2) this.scopeDown = true;
  };
  private onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) this.triggerDown = false;
    if (event.button === 2) { this.scopeDown = false; this.scoped = false; }
  };
  private onMouseMove = (event: MouseEvent) => {
    if (!this.pointerLocked || this.paused || !this.controlled.alive) return;
    const sensitivity = this.scoped ? 0.00085 : 0.0018;
    this.controlled.yaw -= event.movementX * sensitivity;
    this.controlled.pitch = THREE.MathUtils.clamp(this.controlled.pitch - event.movementY * sensitivity, -1.45, 1.45);
  };
  private onWheel = (event: WheelEvent) => {
    if (!this.pointerLocked || this.paused || !this.controlled.alive) return;
    event.preventDefault();
    const actor = this.controlled;
    const slots: WeaponSlot[] = actor.inventory.primary ? ['primary', 'secondary', 'melee'] : ['secondary', 'melee'];
    const index = slots.indexOf(actor.inventory.active);
    const direction = event.deltaY > 0 ? 1 : -1;
    this.switchWeapon(actor, slots[(index + direction + slots.length) % slots.length]);
  };
  private onResize = () => this.renderer.resize();
  private onContextMenu = (event: Event) => event.preventDefault();
  private onCanvasClick = () => {
    if (this.started && !this.buyOpen && !this.pointerLocked) this.resume();
  };
  private onPointerLock = () => {
    this.pointerLocked = document.pointerLockElement === this.renderer.renderer.domElement;
    if (this.pointerLocked) {
      this.paused = false;
    } else {
      this.keys.clear();
      this.triggerDown = false;
      this.scopeDown = false;
      this.scoped = false;
      if (this.started && !this.buyOpen) this.paused = true;
    }
    this.emitSnapshot();
  };

  private enemyVisibleToTeam(enemy: Actor, team: Team) {
    if (!enemy.alive) return false;
    for (const ally of this.actors) {
      if (!ally.alive || ally.team !== team) continue;
      const distance = ally.position.distanceTo(enemy.position);
      if (distance > 52) continue;
      const dx = (enemy.position.x - ally.position.x) / Math.max(0.01, distance);
      const dz = (enemy.position.z - ally.position.z) / Math.max(0.01, distance);
      if (dx * -Math.sin(ally.yaw) + dz * -Math.cos(ally.yaw) < -0.1) continue;
      if (hasLineOfSight(this.map, eyePosition(ally), eyePosition(enemy))) return true;
    }
    return false;
  }

  private getSnapshot(): EngineSnapshot {
    const actor = this.controlled;
    const weapon = weaponForSlot(actor.inventory);
    const definition = WEAPONS[weapon.id];
    const viewActor = this.getViewActor();
    const alive = {
      CT: this.actors.filter((candidate) => candidate.team === 'CT' && candidate.alive).length,
      T: this.actors.filter((candidate) => candidate.team === 'T' && candidate.alive).length,
    };
    const zone = zoneAt(this.map, actor.position);
    let contextPrompt = '';
    if (!actor.alive) contextPrompt = 'F 切换队友视角  ·  G 接管当前队友';
    else if (actor.team === 'T' && actor.inventory.hasBomb && (zone?.id === 'A' || zone?.id === 'B')) contextPrompt = '按住 E 安放 C4  ·  3.2 秒';
    else if (actor.team === 'CT' && this.bomb.status === 'planted' && actor.position.distanceTo(this.bomb.position) < 2.2) contextPrompt = '按住 E 拆除 C4  ·  5 秒';
    else if (actor.team === 'T' && this.bomb.status === 'dropped' && actor.position.distanceTo(this.bomb.position) < 4) contextPrompt = '靠近 C4 自动拾取';
    else if (this.canBuy()) contextPrompt = 'B 购买装备';
    const action = actor.action;
    const moving = Math.hypot(actor.velocity.x, actor.velocity.z);
    let spread = definition.baseSpread + definition.heatSpread * actor.weaponHeat + definition.moveSpread * Math.min(1.4, moving / 4.2);
    if (!actor.grounded) spread += 0.035;
    if (this.scoped) spread = 0;
    const bombCarrier = this.actors.find((candidate) => candidate.id === this.bomb.carrierId);
    const bombVisible = actor.team === 'T' || this.bomb.status === 'planted'
      || (!!bombCarrier && this.enemyVisibleToTeam(bombCarrier, actor.team))
      || (this.bomb.status === 'dropped' && this.actors.some((ally) => ally.team === actor.team && ally.alive && ally.position.distanceTo(this.bomb.position) < 20));
    return {
      started: this.started, paused: this.paused, pointerLocked: this.pointerLocked,
      phase: this.phase, round: this.round, roundTime: Math.max(0, this.roundTime), phaseTime: Math.max(0, this.phaseTime),
      score: { ...this.score }, winner: this.winner, endReason: this.endReason,
      announcement: this.time < this.announcementUntil ? this.announcement : '',
      announcementDetail: this.time < this.announcementUntil ? this.announcementDetail : '',
      player: {
        id: actor.id, name: actor.name, team: actor.team, alive: actor.alive,
        health: Math.ceil(actor.health), armor: Math.ceil(actor.armor),
        ammo: weapon.ammo, reserve: weapon.reserve, magazine: definition.magazine,
        weapon: weapon.id, weaponName: definition.name, slot: actor.inventory.active,
        hasPrimary: !!actor.inventory.primary, hasBomb: actor.inventory.hasBomb,
        reloading: actor.reloadEndsAt > this.time,
        reloadProgress: actor.reloadEndsAt > this.time ? 1 - (actor.reloadEndsAt - this.time) / definition.reloadTime : 0,
        money: actor.money, kills: actor.kills, deaths: actor.deaths,
        spectating: viewActor.id !== actor.id, spectatedName: viewActor.id !== actor.id ? viewActor.name : '',
      },
      actors: this.actors.map((candidate) => ({
        id: candidate.id, team: candidate.team, x: candidate.position.x, z: candidate.position.z,
        yaw: candidate.yaw, alive: candidate.alive, controlled: candidate.id === actor.id,
        visible: candidate.team === actor.team || this.enemyVisibleToTeam(candidate, actor.team),
      })),
      alive,
      bomb: {
        status: this.bomb.status, x: this.bomb.position.x, z: this.bomb.position.z,
        site: this.bomb.site, timer: Math.max(0, this.bomb.timer), visible: bombVisible,
        carrierTeam: this.bomb.status === 'carried' ? 'T' : null,
      },
      killfeed: this.killfeed.map((entry) => ({ ...entry })),
      scoped: this.scoped, spread: THREE.MathUtils.clamp(9 + spread * 850, 8, 65),
      hitMarkerAt: this.hitMarkerAt, damageFlashAt: this.damageFlashAt,
      buyOpen: this.buyOpen, canBuy: this.canBuy(), contextPrompt,
      actionProgress: action === 'plant' ? this.bomb.plantProgress : action === 'defuse' ? this.bomb.defuseProgress : 0,
      actionLabel: action === 'plant' ? '安放 C4' : action === 'defuse' ? '拆除 C4' : '',
      elapsed: this.time,
    };
  }

  private emitSnapshot() {
    this.onSnapshot(this.getSnapshot());
  }

  getLayout(): MapLayout { return this.map.layout; }
  getBuyItems() { return BUY_ITEMS; }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onPointerLock);
    const canvas = this.renderer.renderer.domElement;
    canvas.removeEventListener('contextmenu', this.onContextMenu);
    canvas.removeEventListener('click', this.onCanvasClick);
    this.audio.dispose();
    this.renderer.dispose();
  }
}
