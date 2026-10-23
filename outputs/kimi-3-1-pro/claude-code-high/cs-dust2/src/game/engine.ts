import * as THREE from 'three';
import { SoundSystem } from './audio';
import { createDustMap, type MapData } from './map';
import { createCharacter, createWeaponModel, updateCharacterRig, type CharacterRig } from './models';
import { Navigator } from './navigation';
import { hasLineOfSight, moveWithCollisions, rayEntity, rayWorld, updateVertical, type EntityRayHit } from './physics';
import type { HudSnapshot, KillEvent, PlayerEntity, Slot, Team, WeaponId, WeaponSpec } from './types';
import { BUY_ITEMS, DEFAULT_PISTOL, WEAPONS, makeWeapon } from './weapons';

const PLAYER_HEIGHT = 1.76;
const ROUND_TIME = 105;
const BOMB_TIME = 40;
const PLANT_TIME = 3;
const DEFUSE_TIME = 5;
const BOT_NAMES = ['Rook', 'Viper', 'Slate', 'Ghost', 'Falcon', 'Nomad', 'Hex', 'Sable', 'Flint'];

interface Effect {
  object: THREE.Object3D;
  life: number;
  maxLife: number;
}

function angleDifference(a: number, b: number) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

function aimDirection(entity: PlayerEntity) {
  const cp = Math.cos(entity.pitch);
  return new THREE.Vector3(-Math.sin(entity.yaw) * cp, Math.sin(entity.pitch), -Math.cos(entity.yaw) * cp);
}

function eyePosition(entity: PlayerEntity) {
  return new THREE.Vector3(entity.pos.x, entity.pos.y + 1.58, entity.pos.z);
}

function makeEntity(id: number, team: Team, name: string, isBot: boolean): PlayerEntity {
  return {
    id, team, name, isBot, alive: true,
    pos: new THREE.Vector3(), velocity: new THREE.Vector3(), yaw: team === 'CT' ? Math.PI : 0, pitch: 0,
    radius: 0.4, height: PLAYER_HEIGHT, hp: 100, armor: 0, money: 800, kills: 0, deaths: 0,
    weapons: { secondary: makeWeapon(DEFAULT_PISTOL[team]), melee: makeWeapon('knife') }, slot: 'secondary',
    reloadLeft: 0, fireCooldown: 0, bloom: 0, hasBomb: false, grounded: true, stepDistance: 0, actionProgress: 0,
    bot: {
      state: 'advance', targetId: null, targetVisible: false, reaction: 0, thinkLeft: Math.random() * 0.2,
      repathLeft: 0, path: [], pathIndex: 0, destination: null, site: id % 2 ? 'A' : 'B', strafe: 1,
      strafeLeft: 0, burst: 0, stuckTime: 0, lastPos: new THREE.Vector3(),
    },
  };
}

export class GameEngine {
  readonly map: MapData;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(74, 1, 0.045, 180);
  private renderer: THREE.WebGLRenderer;
  private navigator: Navigator;
  private sound = new SoundSystem();
  private entities: PlayerEntity[] = [];
  private rigs = new Map<number, CharacterRig>();
  private controlledId: number;
  private spectatingId: number | null = null;
  private keys = new Set<string>();
  private fireHeld = false;
  private firePressed = false;
  private scopeHeld = false;
  private scoped = false;
  private locked = false;
  private animationFrame = 0;
  private lastFrame = performance.now();
  private accumulator = 0;
  private gameTime = 0;
  private publishTime = 0;
  private spotTime = 0;
  private spotted = new Set<number>();
  private effects: Effect[] = [];
  private viewWeapon: WeaponId | null = null;
  private viewModel = new THREE.Group();
  private muzzleFlash = new THREE.PointLight(0xffb45c, 0, 4);
  private recoilKick = 0;
  private phase: 'freeze' | 'live' | 'ended' = 'freeze';
  private freezeLeft = 3;
  private endedLeft = 0;
  private round = 1;
  private roundTime = ROUND_TIME;
  private buyTime = 12;
  private score: Record<Team, number> = { CT: 0, T: 0 };
  private attackSite: 'A' | 'B' = 'A';
  private roundMessage = 'PISTOL ROUND';
  private killfeed: KillEvent[] = [];
  private killId = 0;
  private hitMarkerUntil = 0;
  private buyOpen = false;
  private bomb = {
    status: 'carried' as 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded',
    carrierId: null as number | null,
    pos: new THREE.Vector3(), site: null as 'A' | 'B' | null, timer: BOMB_TIME,
  };
  private nextBombBeep = 0;
  private snapshot: HudSnapshot;
  private listeners = new Set<() => void>();
  private resizeObserver: ResizeObserver;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement, playerTeam: Team) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(0x9eafb2);
    this.scene.fog = new THREE.Fog(0xa9b1aa, 55, 145);
    this.scene.add(new THREE.HemisphereLight(0xd8e6e7, 0x66513a, 2.0));
    const sun = new THREE.DirectionalLight(0xffe5bd, 3.1);
    sun.position.set(-32, 55, 24);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 140;
    sun.shadow.bias = -0.00035;
    this.scene.add(sun);

    this.map = createDustMap(this.scene);
    this.navigator = new Navigator(this.map.colliders, this.map.bounds);
    for (const team of ['CT', 'T'] as Team[]) {
      for (let i = 0; i < 5; i++) {
        const id = team === 'CT' ? i : i + 5;
        const player = team === playerTeam && i === 0;
        const entity = makeEntity(id, team, player ? 'YOU' : BOT_NAMES[(id + (team === 'T' ? 2 : 0)) % BOT_NAMES.length], !player);
        this.entities.push(entity);
        const rig = createCharacter(entity, team === playerTeam && !player);
        this.rigs.set(id, rig);
        this.scene.add(rig.root);
      }
    }
    this.controlledId = playerTeam === 'CT' ? 0 : 5;
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);
    this.camera.add(this.viewModel);
    this.camera.add(this.muzzleFlash);
    this.muzzleFlash.position.set(0.25, -0.2, -0.8);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.resize();
    this.bindInput();
    this.resetRound();
    this.snapshot = this.makeSnapshot();
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  get controlled() { return this.entities[this.controlledId]; }
  get viewEntity() {
    if (this.controlled.alive) return this.controlled;
    return this.spectatingId === null ? this.controlled : this.entities[this.spectatingId];
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  getSnapshot = () => this.snapshot;

  private publish() {
    this.snapshot = this.makeSnapshot();
    this.listeners.forEach(listener => listener());
  }

  private makeSnapshot(): HudSnapshot {
    const view = this.viewEntity;
    const weapon = view.weapons[view.slot] ?? view.weapons.secondary!;
    const spec = WEAPONS[weapon.id];
    const controlled = this.controlled;
    let action: HudSnapshot['action'] = null;
    let hint = '';
    if (controlled.alive && this.phase === 'live') {
      if (controlled.hasBomb && this.siteAt(controlled.pos)) hint = '按住 E 安放 C4';
      else if (controlled.team === 'CT' && this.bomb.status === 'planted' && controlled.pos.distanceTo(this.bomb.pos) < 1.8) hint = '按住 E 拆除 C4';
      else if (controlled.team === 'T' && this.bomb.status === 'dropped' && controlled.pos.distanceTo(this.bomb.pos) < 3) hint = '靠近 C4 自动拾取';
      if (controlled.actionProgress > 0) {
        const planting = controlled.hasBomb;
        const total = planting ? PLANT_TIME : DEFUSE_TIME;
        action = { label: planting ? '正在安放 C4' : '正在拆除 C4', progress: controlled.actionProgress / total };
      }
    }
    const bombPos = this.bomb.status === 'carried' && this.bomb.carrierId !== null
      ? this.entities[this.bomb.carrierId].pos : this.bomb.pos;
    return {
      phase: this.phase, round: this.round, roundTime: this.phase === 'freeze' ? this.freezeLeft : this.phase === 'ended' ? this.endedLeft : this.roundTime,
      buyTime: this.buyTime, score: { ...this.score }, controlledId: this.controlledId, spectatingId: this.spectatingId,
      hp: Math.ceil(view.hp), armor: Math.ceil(view.armor), money: controlled.money,
      weapon: spec.name, weaponId: spec.id, slot: view.slot, ammo: weapon.ammo, reserve: weapon.reserve,
      reloading: view.reloadLeft > 0, reloadProgress: view.reloadLeft > 0 ? 1 - view.reloadLeft / spec.reload : 0,
      scoped: this.scoped, crosshair: 7 + view.bloom * 1050 + Math.hypot(view.velocity.x, view.velocity.z) * 1.4,
      hitMarker: this.gameTime < this.hitMarkerUntil,
      players: this.entities.map(e => ({ id: e.id, name: e.name, team: e.team, alive: e.alive, hp: e.hp, armor: e.armor, kills: e.kills, deaths: e.deaths, x: e.pos.x, z: e.pos.z, yaw: e.yaw, hasBomb: e.hasBomb })),
      spotted: [...this.spotted],
      bomb: { status: this.bomb.status, x: bombPos.x, z: bombPos.z, timer: this.bomb.timer, site: this.bomb.site },
      action, hint, killfeed: [...this.killfeed], buyOpen: this.buyOpen,
      canBuy: this.buyTime > 0 && this.phase !== 'ended', roundMessage: this.roundMessage,
      locked: this.locked, alive: controlled.alive, team: controlled.team,
    };
  }

  private bindInput() {
    this.canvas.addEventListener('click', this.onCanvasClick);
    this.canvas.addEventListener('contextmenu', this.onContextMenu);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLock);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private onCanvasClick = () => {
    this.sound.resume();
    if (!this.locked && !this.buyOpen) this.canvas.requestPointerLock();
  };
  private onContextMenu = (event: Event) => event.preventDefault();
  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Tab') event.preventDefault();
    if (event.code === 'KeyB' && !event.repeat) { this.toggleBuy(); return; }
    if (!this.controlled.alive && !event.repeat) {
      if (event.code === 'Space') { event.preventDefault(); this.cycleSpectate(); return; }
      if (event.code === 'KeyF') { this.takeover(); return; }
    }
    this.keys.add(event.code);
    if (event.repeat || this.buyOpen) return;
    if (event.code === 'Digit1') this.switchSlot('primary');
    if (event.code === 'Digit2') this.switchSlot('secondary');
    if (event.code === 'Digit3') this.switchSlot('melee');
    if (event.code === 'KeyR') this.startReload(this.controlled);
  };
  private onKeyUp = (event: KeyboardEvent) => { this.keys.delete(event.code); };
  private onMouseDown = (event: MouseEvent) => {
    if (!this.locked || this.buyOpen) return;
    if (event.button === 0) { this.fireHeld = true; this.firePressed = true; }
    if (event.button === 2) this.scopeHeld = true;
  };
  private onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) this.fireHeld = false;
    if (event.button === 2) this.scopeHeld = false;
  };
  private onMouseMove = (event: MouseEvent) => {
    if (!this.locked || !this.controlled.alive || this.buyOpen) return;
    const sensitivity = this.scoped ? 0.00095 : 0.00205;
    this.controlled.yaw -= event.movementX * sensitivity;
    this.controlled.pitch -= event.movementY * sensitivity;
    this.controlled.pitch = THREE.MathUtils.clamp(this.controlled.pitch, -1.45, 1.45);
  };
  private onPointerLock = () => {
    this.locked = document.pointerLockElement === this.canvas;
    if (!this.locked) {
      this.keys.clear();
      this.fireHeld = false;
      this.scopeHeld = false;
    }
    this.publish();
  };
  private onWheel = (event: WheelEvent) => {
    if (!this.locked) return;
    event.preventDefault();
    const slots: Slot[] = ['primary', 'secondary', 'melee'];
    const current = slots.indexOf(this.controlled.slot);
    for (let i = 1; i <= 3; i++) {
      const slot = slots[(current + (event.deltaY > 0 ? i : 4 - i)) % 3];
      if (this.controlled.weapons[slot]) { this.switchSlot(slot); break; }
    }
  };

  private resize = () => {
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  };

  private switchSlot(slot: Slot) {
    const entity = this.controlled;
    if (!entity.alive || !entity.weapons[slot] || entity.slot === slot) return;
    entity.slot = slot;
    entity.reloadLeft = 0;
    entity.fireCooldown = Math.max(entity.fireCooldown, 0.22);
    this.scoped = false;
  }

  private startReload(entity: PlayerEntity) {
    const weapon = entity.weapons[entity.slot];
    if (!weapon || entity.slot === 'melee' || entity.reloadLeft > 0) return;
    const spec = WEAPONS[weapon.id];
    if (weapon.ammo >= spec.magazine || weapon.reserve <= 0) return;
    entity.reloadLeft = spec.reload;
    this.sound.reload(entity.id === this.controlledId ? 0 : entity.pos.distanceTo(this.viewEntity.pos));
  }

  private finishReload(entity: PlayerEntity) {
    const weapon = entity.weapons[entity.slot];
    if (!weapon) return;
    const spec = WEAPONS[weapon.id];
    const needed = spec.magazine - weapon.ammo;
    const loaded = Math.min(needed, weapon.reserve);
    weapon.ammo += loaded;
    weapon.reserve -= loaded;
  }

  private resetRound() {
    this.phase = 'freeze';
    this.freezeLeft = 3;
    this.roundTime = ROUND_TIME;
    this.buyTime = 12;
    this.buyOpen = false;
    this.attackSite = Math.random() < 0.5 ? 'A' : 'B';
    this.roundMessage = this.round === 1 ? 'PISTOL ROUND' : `ROUND ${this.round}`;
    this.bomb.status = 'carried';
    this.bomb.site = null;
    this.bomb.timer = BOMB_TIME;
    this.bomb.pos.set(0, 0, 0);
    this.map.bombSite.visible = false;
    this.killfeed = [];
    for (const entity of this.entities) {
      entity.isBot = entity.id !== this.controlledId;
      const primary = entity.alive && this.round > 1 ? entity.weapons.primary : undefined;
      const secondary = entity.alive && this.round > 1 ? entity.weapons.secondary : undefined;
      const armor = entity.alive && this.round > 1 ? entity.armor : 0;
      entity.weapons = { primary, secondary: secondary ?? makeWeapon(DEFAULT_PISTOL[entity.team]), melee: makeWeapon('knife') };
      entity.slot = primary ? 'primary' : 'secondary';
      entity.armor = armor;
      entity.hp = 100;
      entity.alive = true;
      entity.velocity.set(0, 0, 0);
      entity.reloadLeft = 0;
      entity.fireCooldown = 0;
      entity.bloom = 0;
      entity.hasBomb = false;
      entity.actionProgress = 0;
      entity.yaw = entity.team === 'CT' ? Math.PI : 0;
      entity.pitch = 0;
      const spawn = this.map.spawns[entity.team][entity.id % 5];
      entity.pos.copy(spawn);
      entity.bot.path = [];
      entity.bot.pathIndex = 0;
      entity.bot.destination = null;
      entity.bot.targetId = null;
      entity.bot.targetVisible = false;
      entity.bot.state = 'advance';
      entity.bot.repathLeft = 0;
      entity.bot.thinkLeft = Math.random() * 0.3;
      entity.bot.site = entity.team === 'T' ? this.attackSite : entity.id % 5 < 2 ? 'A' : 'B';
      entity.bot.lastPos.copy(spawn);
    }
    const carriers = this.entities.filter(e => e.team === 'T');
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    carrier.hasBomb = true;
    this.bomb.carrierId = carrier.id;
    this.spectatingId = null;
    if (this.round > 1) {
      for (const bot of this.entities.filter(e => e.isBot)) this.autoBuy(bot);
    }
    this.publish();
  }

  private autoBuy(entity: PlayerEntity) {
    if (!entity.weapons.primary) {
      if (entity.money >= 4750 && entity.id % 5 === 2) this.purchase(entity, 'awp');
      else if (entity.money >= (entity.team === 'T' ? 2700 : 3100)) this.purchase(entity, entity.team === 'T' ? 'ak47' : 'm4a4');
    }
    if (!entity.weapons.primary && entity.money >= 700 && entity.id % 3 === 0) this.purchase(entity, 'deagle');
    if (entity.money >= 650 && entity.armor < 50) this.purchase(entity, 'armor');
  }

  purchaseItem(id: WeaponId | 'armor') {
    const success = this.purchase(this.controlled, id);
    this.publish();
    return success;
  }

  private purchase(entity: PlayerEntity, id: WeaponId | 'armor') {
    if (this.buyTime <= 0 || this.phase === 'ended' || !entity.alive) return false;
    const item = BUY_ITEMS.find(entry => entry.id === id);
    if (!item || entity.money < item.price) return false;
    if (id !== 'armor') {
      const spec = WEAPONS[id];
      if (spec.team && spec.team !== entity.team) return false;
      entity.weapons[spec.slot] = makeWeapon(id);
      entity.slot = spec.slot;
      entity.reloadLeft = 0;
    } else {
      entity.armor = 100;
    }
    entity.money -= item.price;
    return true;
  }

  toggleBuy() {
    if (!this.buyOpen && (!this.controlled.alive || this.buyTime <= 0 || this.phase === 'ended')) return;
    this.buyOpen = !this.buyOpen;
    this.fireHeld = false;
    if (this.buyOpen && document.pointerLockElement) document.exitPointerLock();
    this.publish();
  }

  closeBuy() {
    this.buyOpen = false;
    this.publish();
  }

  cycleSpectate() {
    if (this.controlled.alive) return;
    const teammates = this.entities.filter(e => e.team === this.controlled.team && e.alive);
    if (!teammates.length) return;
    const index = teammates.findIndex(e => e.id === this.spectatingId);
    this.spectatingId = teammates[(index + 1) % teammates.length].id;
    this.viewWeapon = null;
    this.publish();
  }

  takeover() {
    if (this.controlled.alive || this.spectatingId === null) return;
    const target = this.entities[this.spectatingId];
    if (!target.alive) return;
    target.isBot = false;
    this.controlledId = target.id;
    this.spectatingId = null;
    this.viewWeapon = null;
    this.publish();
  }

  private siteAt(pos: THREE.Vector3): 'A' | 'B' | null {
    for (const site of ['A', 'B'] as const) {
      const zone = this.map.sites[site];
      if (Math.hypot(pos.x - zone.x, pos.z - zone.z) < zone.radius) return site;
    }
    return null;
  }

  private updateTimers(dt: number) {
    if (this.phase === 'freeze') {
      this.freezeLeft -= dt;
      this.buyTime -= dt;
      if (this.freezeLeft <= 0) {
        this.phase = 'live';
        this.roundMessage = this.bomb.carrierId === this.controlledId ? 'CARRY THE BOMB' : 'ROUND LIVE';
      }
    } else if (this.phase === 'live') {
      this.roundTime -= dt;
      this.buyTime -= dt;
      if (this.buyOpen && this.buyTime <= 0) this.buyOpen = false;
      if (this.bomb.status === 'planted') {
        this.bomb.timer -= dt;
        const interval = THREE.MathUtils.clamp(this.bomb.timer / 35, 0.13, 1);
        if (this.gameTime >= this.nextBombBeep) {
          this.sound.bombBeep(this.bomb.timer < 10);
          this.nextBombBeep = this.gameTime + interval;
        }
        if (this.bomb.timer <= 0) {
          this.bomb.status = 'exploded';
          this.sound.explosion();
          this.endRound('T', 'C4 DETONATED');
        }
      } else if (this.roundTime <= 0) {
        this.endRound('CT', 'TIME EXPIRED');
      }
      if (this.phase === 'live') this.checkElimination();
    } else {
      this.endedLeft -= dt;
      if (this.endedLeft <= 0) {
        this.round++;
        this.resetRound();
      }
    }
  }

  private checkElimination() {
    const ctAlive = this.entities.some(e => e.team === 'CT' && e.alive);
    const tAlive = this.entities.some(e => e.team === 'T' && e.alive);
    if (!ctAlive) this.endRound('T', 'ENEMY TEAM ELIMINATED');
    else if (!tAlive && this.bomb.status !== 'planted') this.endRound('CT', 'ENEMY TEAM ELIMINATED');
  }

  private endRound(winner: Team, reason: string) {
    if (this.phase === 'ended') return;
    this.phase = 'ended';
    this.endedLeft = 4.5;
    this.score[winner]++;
    this.roundMessage = `${winner} WIN  //  ${reason}`;
    this.buyOpen = false;
    this.fireHeld = false;
    for (const entity of this.entities) entity.money = Math.min(16000, entity.money + (entity.team === winner ? 3250 : 1900));
    this.publish();
  }

  private updatePlayer(entity: PlayerEntity, dt: number) {
    if (!entity.alive || this.phase !== 'live' || this.buyOpen) return;
    const forwardAmount = Number(this.keys.has('KeyW')) - Number(this.keys.has('KeyS'));
    const rightAmount = Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA'));
    const forward = new THREE.Vector3(-Math.sin(entity.yaw), 0, -Math.cos(entity.yaw));
    const right = new THREE.Vector3(Math.cos(entity.yaw), 0, -Math.sin(entity.yaw));
    const desired = forward.multiplyScalar(forwardAmount).add(right.multiplyScalar(rightAmount));
    if (desired.lengthSq() > 1) desired.normalize();
    const weapon = entity.weapons[entity.slot]!;
    const speed = weapon.id === 'knife' ? 6.0 : weapon.id === 'awp' ? 4.35 : 5.25;
    desired.multiplyScalar(speed * (this.scoped ? 0.48 : 1));
    entity.velocity.x = THREE.MathUtils.damp(entity.velocity.x, desired.x, entity.grounded ? 13 : 2.2, dt);
    entity.velocity.z = THREE.MathUtils.damp(entity.velocity.z, desired.z, entity.grounded ? 13 : 2.2, dt);
    if (this.keys.has('Space') && entity.grounded) {
      entity.velocity.y = 6.0;
      entity.grounded = false;
    }
    const oldX = entity.pos.x;
    const oldZ = entity.pos.z;
    moveWithCollisions(entity, new THREE.Vector3(entity.velocity.x * dt, 0, entity.velocity.z * dt), this.map.colliders);
    updateVertical(entity, dt, this.map.colliders);
    entity.stepDistance += Math.hypot(entity.pos.x - oldX, entity.pos.z - oldZ);
    if (entity.stepDistance > 2.05 && entity.grounded) {
      entity.stepDistance = 0;
      this.sound.footstep(0, Math.random() > 0.5);
    }
    if (this.fireHeld && (WEAPONS[weapon.id].automatic || this.firePressed)) this.fireWeapon(entity);
    if (this.keys.has('KeyE') && entity.actionProgress > 0) {
      entity.velocity.x *= 0.75;
      entity.velocity.z *= 0.75;
    }
  }

  private perceive(bot: PlayerEntity) {
    const eye = eyePosition(bot);
    const facing = aimDirection(bot);
    let best: PlayerEntity | null = null;
    let bestDistance = Infinity;
    for (const enemy of this.entities) {
      if (!enemy.alive || enemy.team === bot.team) continue;
      const target = eyePosition(enemy).add(new THREE.Vector3(0, -0.3, 0));
      const offset = target.clone().sub(eye);
      const distance = offset.length();
      if (distance > 58 || distance >= bestDistance) continue;
      if (distance > 5 && facing.dot(offset.clone().normalize()) < 0.25) continue;
      if (!hasLineOfSight(eye, target, this.map.colliders)) continue;
      best = enemy;
      bestDistance = distance;
    }
    const oldTarget = bot.bot.targetId;
    bot.bot.targetId = best?.id ?? null;
    bot.bot.targetVisible = !!best;
    if (best && oldTarget !== best.id) bot.bot.reaction = 0.18 + Math.random() * 0.38;
    if (best) bot.bot.state = 'combat';
    else if (bot.bot.state === 'combat') bot.bot.state = 'advance';
  }

  private setBotDestination(bot: PlayerEntity, destination: THREE.Vector3 | null) {
    const changed = (!destination !== !bot.bot.destination) || (destination && bot.bot.destination && destination.distanceToSquared(bot.bot.destination) > 4);
    bot.bot.destination = destination?.clone() ?? null;
    if (destination && (changed || bot.bot.repathLeft <= 0 || !bot.bot.path.length)) {
      bot.bot.path = this.navigator.findPath(bot.pos, destination);
      bot.bot.pathIndex = 0;
      bot.bot.repathLeft = 1.3 + Math.random() * 0.8;
    }
  }

  private updateBotObjective(bot: PlayerEntity) {
    let destination: THREE.Vector3 | null = null;
    if (bot.team === 'T') {
      if (this.bomb.status === 'dropped') {
        const closest = this.entities.filter(e => e.alive && e.team === 'T').sort((a, b) => a.pos.distanceToSquared(this.bomb.pos) - b.pos.distanceToSquared(this.bomb.pos))[0];
        if (closest?.id === bot.id) {
          bot.bot.state = 'retrieve';
          destination = this.bomb.pos;
        }
      }
      if (!destination && this.bomb.status === 'planted') {
        bot.bot.state = 'guard';
        const angle = bot.id * 2.2;
        destination = this.bomb.pos.clone().add(new THREE.Vector3(Math.sin(angle) * 4, 0, Math.cos(angle) * 4));
      } else if (!destination && bot.hasBomb && this.bomb.status === 'carried') {
        const site = this.map.sites[bot.bot.site];
        const inSite = this.siteAt(bot.pos) === bot.bot.site;
        if (inSite && !bot.bot.targetVisible) {
          bot.bot.state = 'plant';
          destination = null;
        } else {
          destination = new THREE.Vector3(site.x + 1.2, 0, site.z + 0.8);
        }
      } else if (!destination && this.bomb.status === 'carried') {
        const site = this.map.sites[this.attackSite];
        const formation = (bot.id % 5 - 2) * 1.7;
        destination = new THREE.Vector3(site.x + formation, 0, site.z + (bot.id % 2 ? 4 : -3));
        if (bot.pos.distanceTo(destination) < 4) {
          bot.bot.state = 'guard';
          destination = bot.pos.clone();
        }
      }
    } else if (this.bomb.status === 'planted') {
      const distance = bot.pos.distanceTo(this.bomb.pos);
      if (distance < 1.55 && (!bot.bot.targetVisible || this.bomb.timer < 12)) {
        bot.bot.state = 'defuse';
        destination = null;
      } else {
        bot.bot.state = 'advance';
        destination = this.bomb.pos;
      }
    } else {
      const assigned = bot.id % 5;
      if (assigned === 4) {
        destination = new THREE.Vector3(0, 0, -5);
        bot.bot.state = 'guard';
      } else {
        const site = this.map.sites[bot.bot.site];
        destination = new THREE.Vector3(site.x + (assigned % 2 ? -4 : 4), 0, site.z + 3);
        bot.bot.state = bot.pos.distanceTo(destination) < 3 ? 'guard' : 'advance';
      }
    }
    if (bot.bot.state !== 'combat') this.setBotDestination(bot, destination);
  }

  private followBotPath(bot: PlayerEntity, dt: number) {
    const path = bot.bot.path;
    if (!path.length || bot.bot.pathIndex >= path.length) {
      bot.velocity.x = THREE.MathUtils.damp(bot.velocity.x, 0, 9, dt);
      bot.velocity.z = THREE.MathUtils.damp(bot.velocity.z, 0, 9, dt);
      return;
    }
    let target = path[bot.bot.pathIndex];
    if (Math.hypot(target.x - bot.pos.x, target.z - bot.pos.z) < 0.62) {
      bot.bot.pathIndex++;
      if (bot.bot.pathIndex >= path.length) { bot.bot.path = []; return; }
      target = path[bot.bot.pathIndex];
    }
    const dx = target.x - bot.pos.x;
    const dz = target.z - bot.pos.z;
    const length = Math.max(0.001, Math.hypot(dx, dz));
    const speed = bot.bot.state === 'guard' ? 2.4 : 4.15;
    bot.velocity.x = THREE.MathUtils.damp(bot.velocity.x, dx / length * speed, 9, dt);
    bot.velocity.z = THREE.MathUtils.damp(bot.velocity.z, dz / length * speed, 9, dt);
    const desiredYaw = Math.atan2(-dx, -dz);
    bot.yaw += THREE.MathUtils.clamp(angleDifference(bot.yaw, desiredYaw), -4.5 * dt, 4.5 * dt);
    bot.pitch = THREE.MathUtils.damp(bot.pitch, 0, 6, dt);
  }

  private updateBot(bot: PlayerEntity, dt: number) {
    if (!bot.alive || this.phase !== 'live') return;
    bot.bot.thinkLeft -= dt;
    bot.bot.repathLeft -= dt;
    bot.bot.reaction -= dt;
    bot.bot.strafeLeft -= dt;
    if (bot.bot.thinkLeft <= 0) {
      this.perceive(bot);
      this.updateBotObjective(bot);
      bot.bot.thinkLeft = 0.12 + Math.random() * 0.09;
    }
    const target = bot.bot.targetId === null ? null : this.entities[bot.bot.targetId];
    const canDefuse = bot.bot.state === 'defuse' && this.bomb.status === 'planted';
    const canPlant = bot.bot.state === 'plant' && bot.hasBomb;
    if (target?.alive && bot.bot.targetVisible && !canDefuse && !canPlant) {
      bot.bot.state = 'combat';
      const eye = eyePosition(bot);
      const targetPoint = target.pos.clone().add(new THREE.Vector3(0, 1.2 + Math.random() * 0.18, 0));
      const delta = targetPoint.sub(eye);
      const desiredYaw = Math.atan2(-delta.x, -delta.z);
      const desiredPitch = Math.atan2(delta.y, Math.hypot(delta.x, delta.z));
      const turn = 5.5;
      bot.yaw += THREE.MathUtils.clamp(angleDifference(bot.yaw, desiredYaw), -turn * dt, turn * dt);
      bot.pitch = THREE.MathUtils.clamp(bot.pitch + THREE.MathUtils.clamp(desiredPitch - bot.pitch, -turn * dt, turn * dt), -1.3, 1.3);
      if (bot.bot.strafeLeft <= 0) {
        bot.bot.strafe = Math.random() < 0.5 ? -1 : 1;
        bot.bot.strafeLeft = 0.5 + Math.random() * 1.1;
      }
      const right = new THREE.Vector3(Math.cos(bot.yaw), 0, -Math.sin(bot.yaw));
      const distance = bot.pos.distanceTo(target.pos);
      const strafeSpeed = distance < 8 ? 2.1 : 1.25;
      bot.velocity.x = THREE.MathUtils.damp(bot.velocity.x, right.x * bot.bot.strafe * strafeSpeed, 8, dt);
      bot.velocity.z = THREE.MathUtils.damp(bot.velocity.z, right.z * bot.bot.strafe * strafeSpeed, 8, dt);
      const aimError = Math.abs(angleDifference(bot.yaw, desiredYaw)) + Math.abs(bot.pitch - desiredPitch);
      if (bot.bot.reaction <= 0 && aimError < 0.16) this.fireWeapon(bot);
    } else if (!canDefuse && !canPlant) {
      this.followBotPath(bot, dt);
    } else {
      bot.velocity.x = THREE.MathUtils.damp(bot.velocity.x, 0, 12, dt);
      bot.velocity.z = THREE.MathUtils.damp(bot.velocity.z, 0, 12, dt);
    }
    const before = bot.pos.clone();
    moveWithCollisions(bot, new THREE.Vector3(bot.velocity.x * dt, 0, bot.velocity.z * dt), this.map.colliders);
    updateVertical(bot, dt, this.map.colliders);
    const intended = Math.hypot(bot.velocity.x, bot.velocity.z);
    bot.bot.stuckTime = intended > 0.8 && before.distanceToSquared(bot.pos) < 0.00001 ? bot.bot.stuckTime + dt : 0;
    if (bot.bot.stuckTime > 0.65) {
      bot.bot.path = [];
      bot.bot.repathLeft = 0;
      bot.bot.stuckTime = 0;
    }
    bot.stepDistance += before.distanceTo(bot.pos);
    if (bot.stepDistance > 2.15) {
      bot.stepDistance = 0;
      this.sound.footstep(bot.pos.distanceTo(this.viewEntity.pos), Math.random() > 0.5);
    }
    const weapon = bot.weapons[bot.slot]!;
    if (weapon.ammo === 0 && weapon.reserve > 0) this.startReload(bot);
    if (weapon.ammo === 0 && weapon.reserve === 0 && bot.slot === 'primary') {
      bot.slot = 'secondary';
      bot.reloadLeft = 0;
    }
  }

  private fireWeapon(entity: PlayerEntity) {
    if (this.phase !== 'live' || !entity.alive || entity.fireCooldown > 0 || entity.reloadLeft > 0 || entity.actionProgress > 0) return;
    const weapon = entity.weapons[entity.slot];
    if (!weapon) return;
    const spec = WEAPONS[weapon.id];
    if (entity.slot !== 'melee' && weapon.ammo <= 0) { this.startReload(entity); return; }
    entity.fireCooldown = 60 / spec.rpm;
    if (entity.slot !== 'melee') weapon.ammo--;
    entity.bloom = Math.min(0.085, entity.bloom + spec.bloom);
    const isView = entity.id === this.viewEntity.id;
    this.sound.weapon(spec.id, isView ? 0 : entity.pos.distanceTo(this.viewEntity.pos));
    const recoilScale = entity.isBot ? 0.24 : 1;
    entity.pitch = THREE.MathUtils.clamp(entity.pitch + spec.recoil * recoilScale * (0.85 + Math.random() * 0.3), -1.45, 1.45);
    entity.yaw += (Math.random() - 0.5) * spec.recoil * 0.45 * recoilScale;
    if (isView) {
      this.recoilKick = Math.min(0.12, this.recoilKick + spec.recoil * 1.6);
      this.muzzleFlash.intensity = spec.id === 'awp' ? 7 : 4;
    }
    const origin = eyePosition(entity);
    const direction = aimDirection(entity);
    const speed = Math.hypot(entity.velocity.x, entity.velocity.z);
    let spread = spec.spread + entity.bloom + spec.moveSpread * speed / 5;
    if (spec.id === 'awp' && isView && this.scoped) spread = 0.0007 + entity.bloom * 0.025 + speed * 0.001;
    if (spec.id === 'awp' && entity.isBot) spread = 0.0035 + entity.bloom * 0.04 + speed * 0.001;
    if (entity.isBot) spread += 0.0035;
    const radius = Math.sqrt(Math.random()) * spread;
    const angle = Math.random() * Math.PI * 2;
    const right = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, direction).normalize();
    direction.addScaledVector(right, Math.cos(angle) * radius).addScaledVector(up, Math.sin(angle) * radius).normalize();
    const worldHit = rayWorld(origin, direction, this.map.colliders, spec.range);
    let maxDistance = worldHit?.distance ?? spec.range;
    let entityHit: EntityRayHit | null = null;
    for (const target of this.entities) {
      if (target.id === entity.id || !target.alive) continue;
      const hit = rayEntity(origin, direction, target, maxDistance);
      if (hit && hit.distance < maxDistance) {
        maxDistance = hit.distance;
        entityHit = hit;
      }
    }
    const end = origin.clone().addScaledVector(direction, maxDistance);
    if (entityHit) {
      if (entityHit.entity.team !== entity.team) this.applyDamage(entity, entityHit.entity, entityHit.zone, spec);
      end.copy(entityHit.point);
    } else if (worldHit) {
      this.addImpact(worldHit.point, worldHit.normal);
    }
    if (spec.id !== 'knife') this.addTracer(origin.clone().addScaledVector(direction, 0.4), end, entity.team);
  }

  private applyDamage(attacker: PlayerEntity, victim: PlayerEntity, zone: 'head' | 'chest' | 'stomach' | 'arms' | 'legs', spec: WeaponSpec) {
    const multipliers = { head: 2, chest: 1, stomach: 0.9, arms: 0.7, legs: 0.65 };
    let damage = spec.damage * multipliers[zone];
    if (victim.armor > 0 && spec.id !== 'knife') {
      damage *= spec.id === 'awp' ? 0.85 : zone === 'head' ? 0.54 : 0.52;
      victim.armor = Math.max(0, victim.armor - spec.damage * 0.32);
    }
    victim.hp = Math.max(0, victim.hp - damage);
    if (attacker.id === this.controlledId) {
      this.hitMarkerUntil = this.gameTime + 0.14;
      this.sound.hit(victim.hp <= 0);
    }
    if (victim.hp <= 0) this.killEntity(attacker, victim, spec.name, zone === 'head');
  }

  private killEntity(killer: PlayerEntity, victim: PlayerEntity, weapon: string, headshot: boolean) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.deaths++;
    victim.hp = 0;
    victim.velocity.set(0, 0, 0);
    victim.actionProgress = 0;
    killer.kills++;
    killer.money = Math.min(16000, killer.money + 300);
    this.killfeed.push({ id: ++this.killId, killer: killer.name, victim: victim.name, killerTeam: killer.team, victimTeam: victim.team, weapon, headshot });
    this.killfeed = this.killfeed.slice(-5);
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bomb.status = 'dropped';
      this.bomb.carrierId = null;
      this.bomb.pos.copy(victim.pos);
      this.bomb.pos.y += 0.08;
      this.map.bombSite.position.copy(this.bomb.pos);
      this.map.bombSite.visible = true;
    }
    if (victim.id === this.controlledId) {
      this.buyOpen = false;
      this.fireHeld = false;
      this.scopeHeld = false;
      const teammate = this.entities.find(e => e.team === victim.team && e.alive);
      this.spectatingId = teammate?.id ?? null;
      this.viewWeapon = null;
    } else if (victim.id === this.spectatingId) {
      this.cycleSpectate();
    }
    this.publish();
  }

  private updateBombInteractions(dt: number) {
    if (this.phase !== 'live') return;
    for (const entity of this.entities) {
      if (!entity.alive) continue;
      if (entity.team === 'T' && this.bomb.status === 'dropped' && entity.pos.distanceTo(this.bomb.pos) < 1.45) {
        this.bomb.status = 'carried';
        this.bomb.carrierId = entity.id;
        entity.hasBomb = true;
        this.map.bombSite.visible = false;
      }
      let acting = false;
      if (entity.hasBomb && this.bomb.status === 'carried' && this.siteAt(entity.pos)) {
        acting = entity.isBot ? entity.bot.state === 'plant' : this.keys.has('KeyE');
        if (acting) {
          entity.actionProgress += dt;
          if (entity.actionProgress >= PLANT_TIME) this.plantBomb(entity);
        }
      } else if (entity.team === 'CT' && this.bomb.status === 'planted' && entity.pos.distanceTo(this.bomb.pos) < 1.6) {
        acting = entity.isBot ? entity.bot.state === 'defuse' : this.keys.has('KeyE');
        if (acting) {
          entity.actionProgress += dt;
          if (entity.actionProgress >= DEFUSE_TIME) {
            this.bomb.status = 'defused';
            this.sound.defuse();
            this.endRound('CT', 'BOMB DEFUSED');
          }
        }
      }
      if (!acting) entity.actionProgress = 0;
    }
  }

  private plantBomb(entity: PlayerEntity) {
    const site = this.siteAt(entity.pos);
    if (!site || !entity.hasBomb) return;
    entity.hasBomb = false;
    entity.actionProgress = 0;
    this.bomb.status = 'planted';
    this.bomb.carrierId = null;
    this.bomb.site = site;
    this.bomb.timer = BOMB_TIME;
    this.bomb.pos.copy(entity.pos);
    this.bomb.pos.y += 0.08;
    this.map.bombSite.position.copy(this.bomb.pos);
    this.map.bombSite.visible = true;
    this.nextBombBeep = this.gameTime;
    this.sound.plant();
    this.roundMessage = `BOMB PLANTED AT ${site}`;
    for (const bot of this.entities) {
      if (bot.isBot) { bot.bot.repathLeft = 0; bot.bot.thinkLeft = 0; }
    }
  }

  private addTracer(start: THREE.Vector3, end: THREE.Vector3, team: Team) {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: team === 'CT' ? 0xb9e6ff : 0xffd28a, transparent: true, opacity: 0.6 });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.effects.push({ object: line, life: 0.065, maxLife: 0.065 });
  }

  private addImpact(point: THREE.Vector3, normal: THREE.Vector3) {
    const spark = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.045), new THREE.MeshBasicMaterial({ color: 0xffd08a, transparent: true }));
    spark.position.copy(point).addScaledVector(normal, 0.025);
    this.scene.add(spark);
    this.effects.push({ object: spark, life: 0.18, maxLife: 0.18 });
  }

  private updateEffects(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.life -= dt;
      if (effect.life <= 0) {
        this.scene.remove(effect.object);
        if (effect.object instanceof THREE.Line || effect.object instanceof THREE.Mesh) {
          effect.object.geometry.dispose();
          (effect.object.material as THREE.Material).dispose();
        }
        this.effects.splice(i, 1);
      } else {
        const material = (effect.object as THREE.Mesh).material as THREE.Material & { opacity?: number };
        if (material && 'opacity' in material) material.opacity = effect.life / effect.maxLife;
      }
    }
  }

  private updateSpotted() {
    this.spotted.clear();
    const team = this.controlled.team;
    const viewers = this.entities.filter(e => e.alive && e.team === team);
    for (const enemy of this.entities) {
      if (!enemy.alive || enemy.team === team) continue;
      for (const viewer of viewers) {
        const eye = eyePosition(viewer);
        const target = eyePosition(enemy);
        const delta = target.clone().sub(eye);
        if (delta.length() > 62) continue;
        if (aimDirection(viewer).dot(delta.normalize()) < 0.15) continue;
        if (hasLineOfSight(eye, target, this.map.colliders)) {
          this.spotted.add(enemy.id);
          break;
        }
      }
    }
  }

  private updateView(dt: number) {
    const view = this.viewEntity;
    const speed = Math.hypot(view.velocity.x, view.velocity.z);
    const bob = view.alive && view.grounded ? Math.sin(this.gameTime * 11) * Math.min(0.025, speed * 0.004) : 0;
    this.camera.position.set(view.pos.x, view.pos.y + 1.58 + bob, view.pos.z);
    this.camera.rotation.set(view.pitch - this.recoilKick * 0.25, view.yaw, 0);
    this.recoilKick = THREE.MathUtils.damp(this.recoilKick, 0, 11, dt);
    const weapon = view.weapons[view.slot]!;
    const spec = WEAPONS[weapon.id];
    const wantsScope = this.scopeHeld && this.controlled.alive && spec.id === 'awp' && view.reloadLeft <= 0;
    if (wantsScope !== this.scoped) {
      this.scoped = wantsScope;
      if (wantsScope) this.sound.scope();
    }
    const targetFov = this.scoped ? WEAPONS.awp.zoom! : 74;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 16, dt);
    this.camera.updateProjectionMatrix();
    if (this.viewWeapon !== weapon.id) {
      this.viewModel.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      this.viewModel.clear();
      const model = createWeaponModel(weapon.id, true);
      this.viewModel.add(model);
      const sleeve = new THREE.MeshStandardMaterial({ color: view.team === 'CT' ? 0x344b5c : 0x807355, roughness: 0.9 });
      const glove = new THREE.MeshStandardMaterial({ color: 0x292b28, roughness: 0.9 });
      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.42), sleeve);
      rightArm.position.set(0.08, -0.15, 0.2);
      rightArm.rotation.x = -0.35;
      this.viewModel.add(rightArm);
      const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.13, 0.16), glove);
      rightHand.position.set(0.02, -0.1, 0.02);
      this.viewModel.add(rightHand);
      if (spec.slot === 'primary') {
        const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.45), sleeve);
        leftArm.position.set(-0.18, -0.13, -0.25);
        leftArm.rotation.z = -0.35;
        this.viewModel.add(leftArm);
        const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.12, 0.16), glove);
        leftHand.position.set(-0.055, -0.065, -0.37);
        this.viewModel.add(leftHand);
      }
      this.viewWeapon = weapon.id;
    }
    this.viewModel.visible = view.alive && !this.scoped;
    this.viewModel.position.set(0.32 + Math.sin(this.gameTime * 5) * speed * 0.0015, -0.29 - bob * 1.8 - this.recoilKick * 0.3, -0.54 + this.recoilKick);
    this.viewModel.rotation.set(-0.03 - this.recoilKick * 0.7, -0.04, 0);
    this.viewModel.scale.setScalar(spec.slot === 'secondary' ? 0.85 : 0.72);
    this.muzzleFlash.intensity = THREE.MathUtils.damp(this.muzzleFlash.intensity, 0, 35, dt);
    for (const entity of this.entities) {
      const rig = this.rigs.get(entity.id)!;
      updateCharacterRig(rig, entity, this.gameTime);
      rig.root.visible = entity.id !== view.id;
    }
    if (this.bomb.status === 'planted') {
      const light = this.map.bombSite.getObjectByName('bombLight');
      if (light) light.visible = Math.sin(this.gameTime * (this.bomb.timer < 10 ? 24 : 8)) > 0;
    }
  }

  private fixedUpdate(dt: number) {
    this.gameTime += dt;
    this.updateTimers(dt);
    for (const entity of this.entities) {
      entity.fireCooldown = Math.max(0, entity.fireCooldown - dt);
      entity.bloom = Math.max(0, entity.bloom - dt * 0.032);
      if (entity.reloadLeft > 0) {
        entity.reloadLeft -= dt;
        if (entity.reloadLeft <= 0) { entity.reloadLeft = 0; this.finishReload(entity); }
      }
    }
    if (this.phase === 'live') {
      const player = this.controlled;
      if (player.alive) this.updatePlayer(player, dt);
      for (const entity of this.entities) {
        if (entity.isBot && entity.id !== this.controlledId) this.updateBot(entity, dt);
      }
      this.updateBombInteractions(dt);
    }
    this.updateEffects(dt);
    this.spotTime -= dt;
    if (this.spotTime <= 0) { this.updateSpotted(); this.spotTime = 0.16; }
    this.firePressed = false;
    this.publishTime -= dt;
    if (this.publishTime <= 0) { this.publish(); this.publishTime = 0.06; }
  }

  private animate = (now: number) => {
    if (this.disposed) return;
    const frameDt = Math.min(0.1, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.accumulator += frameDt;
    while (this.accumulator >= 1 / 60) {
      this.fixedUpdate(1 / 60);
      this.accumulator -= 1 / 60;
    }
    this.updateView(frameDt);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener('click', this.onCanvasClick);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLock);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.sound.dispose();
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite) {
        if ('geometry' in object && object.geometry) object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      }
    });
    this.renderer.dispose();
  }
}
