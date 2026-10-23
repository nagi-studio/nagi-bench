import * as THREE from 'three';
import { AudioSystem } from './audio';
import { createBombModel, createCharacter, createWeaponModel } from './models';
import type { CharacterModel } from './models';
import { bombSiteAt, createMap, hasLineOfSight, locationAt, moveWithCollisions, raycastWorld, supportHeight } from './map';
import type { GameMap } from './map';
import { choosePatrolTarget, findPath } from './navigation';
import { applyDamage, createWeapon, defaultPistol, defaultRifle, WEAPONS } from './weapons';
import type { WeaponRuntime } from './weapons';
import type { GamePhase, GameSnapshot, HitZone, KillFeedItem, PlayerSnapshot, Team, WeaponId, WeaponSlot, WeaponSnapshot } from './types';

interface Actor {
  id: number;
  name: string;
  team: Team;
  position: THREE.Vector3;
  velocityY: number;
  yaw: number;
  pitch: number;
  recoilPitch: number;
  recoilYaw: number;
  health: number;
  armor: number;
  alive: boolean;
  onGround: boolean;
  moving: boolean;
  moveAmount: number;
  kills: number;
  deaths: number;
  weapons: Partial<Record<WeaponSlot, WeaponRuntime>>;
  slot: WeaponSlot;
  cooldown: number;
  switchCooldown: number;
  bloom: number;
  scoped: boolean;
  firingFlash: number;
  stepDistance: number;
  interaction: 'plant' | 'defuse' | null;
  interactionProgress: number;
  model: CharacterModel;
  ai: {
    think: number;
    reaction: number;
    targetId: number | null;
    lastSeen: THREE.Vector3 | null;
    goal: THREE.Vector3;
    path: THREE.Vector3[];
    pathIndex: number;
    repath: number;
    strafe: number;
    strafeTimer: number;
    stuck: number;
    lastPosition: THREE.Vector3;
  };
}

interface BombState {
  status: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  carrierId: number | null;
  position: THREE.Vector3;
  site: 'A' | 'B' | null;
  timer: number;
}

interface Tracer {
  line: THREE.Line;
  life: number;
}

interface Impact {
  mesh: THREE.Mesh;
  life: number;
}

const UP = new THREE.Vector3(0, 1, 0);
const EYE_HEIGHT = 1.62;
const ACTOR_RADIUS = 0.34;
const PLANT_TIME = 3.2;
const DEFUSE_TIME = 5;
const ROUND_TIME = 105;
const BOT_NAMES = ['Vex', 'Rook', 'Sable', 'Ghost', 'Khan', 'Flint', 'Nova', 'Ash', 'Bolt'];
const HITBOXES: Array<{ zone: HitZone; center: THREE.Vector3; size: THREE.Vector3 }> = [
  { zone: 'head', center: new THREE.Vector3(0, 1.62, 0), size: new THREE.Vector3(0.29, 0.32, 0.27) },
  { zone: 'chest', center: new THREE.Vector3(0, 1.25, 0), size: new THREE.Vector3(0.46, 0.42, 0.3) },
  { zone: 'stomach', center: new THREE.Vector3(0, 0.96, 0), size: new THREE.Vector3(0.4, 0.22, 0.28) },
  { zone: 'arm', center: new THREE.Vector3(-0.31, 1.19, -0.13), size: new THREE.Vector3(0.17, 0.5, 0.22) },
  { zone: 'arm', center: new THREE.Vector3(0.31, 1.19, -0.13), size: new THREE.Vector3(0.17, 0.5, 0.22) },
  { zone: 'leg', center: new THREE.Vector3(-0.12, 0.45, 0), size: new THREE.Vector3(0.18, 0.82, 0.22) },
  { zone: 'leg', center: new THREE.Vector3(0.12, 0.45, 0), size: new THREE.Vector3(0.18, 0.82, 0.22) },
];

function angleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function eyeOf(actor: Actor) {
  return actor.position.clone().add(new THREE.Vector3(0, EYE_HEIGHT, 0));
}

function forwardOf(actor: Actor) {
  return new THREE.Vector3(-Math.sin(actor.yaw), 0, -Math.cos(actor.yaw));
}

function formatWeaponSnapshot(runtime: WeaponRuntime): WeaponSnapshot {
  const spec = WEAPONS[runtime.id];
  return {
    id: runtime.id,
    name: spec.name,
    slot: spec.slot,
    ammo: runtime.ammo,
    reserve: runtime.reserve,
    reloading: runtime.reloadRemaining > 0,
    reloadProgress: runtime.reloadRemaining > 0 ? 1 - runtime.reloadRemaining / spec.reloadTime : 0,
  };
}

export class Game {
  private readonly container: HTMLDivElement;
  private readonly onSnapshot: (snapshot: GameSnapshot) => void;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(74, 1, 0.035, 190);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly map: GameMap = createMap();
  private readonly audio = new AudioSystem();
  private readonly actors: Actor[] = [];
  private readonly keys = new Set<string>();
  private readonly viewRig = new THREE.Group();
  private readonly bombModel = createBombModel();
  private readonly tracers: Tracer[] = [];
  private readonly impacts: Impact[] = [];
  private bomb: BombState = { status: 'carried', carrierId: null, position: new THREE.Vector3(), site: null, timer: 40 };
  private viewWeapon: THREE.Group | null = null;
  private muzzleFlash: THREE.Mesh;
  private controlledId = 0;
  private spectatorId: number | null = null;
  private playerTeam: Team = 'CT';
  private phase: GamePhase = 'menu';
  private paused = false;
  private disposed = false;
  private frameId = 0;
  private previousTime = performance.now();
  private accumulator = 0;
  private elapsed = 0;
  private roundElapsed = 0;
  private snapshotTimer = 0;
  private round = 0;
  private roundTime = ROUND_TIME;
  private score = { CT: 0, T: 0 };
  private roundWinner: Team | null = null;
  private roundReason = '';
  private killfeed: KillFeedItem[] = [];
  private killfeedTimes: number[] = [];
  private feedId = 0;
  private notice = '';
  private noticeAt = 0;
  private hitMarkerAt = 0;
  private damageAt = 0;
  private mouseDown = false;
  private mousePressed = false;
  private mouseReadyAt = 0;
  private skipNextMouseMove = true;
  private bobPhase = 0;
  private viewKick = 0;
  private switchKick = 0;
  private interaction: { label: string; progress: number } | null = null;
  private visibleEnemies: number[] = [];
  private visibilityTimer = 0;
  private resizeObserver: ResizeObserver;

  constructor(container: HTMLDivElement, onSnapshot: (snapshot: GameSnapshot) => void) {
    this.container = container;
    this.onSnapshot = onSnapshot;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute('aria-label', '第一人称 3D 战场');
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x9dada9);
    this.scene.fog = new THREE.Fog(0xb3b2a0, 55, 145);
    const hemisphere = new THREE.HemisphereLight(0xd9ecf0, 0x6d5940, 2.15);
    this.scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xffe3b5, 3.15);
    sun.position.set(-35, 58, 22);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -62;
    sun.shadow.camera.right = 62;
    sun.shadow.camera.top = 62;
    sun.shadow.camera.bottom = -62;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 135;
    sun.shadow.bias = -0.0003;
    this.scene.add(sun);
    const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe4b0, fog: false }));
    sunDisc.position.set(-72, 72, -115);
    this.scene.add(sunDisc);
    this.scene.add(this.map.group);
    this.scene.add(this.bombModel.group);
    this.bombModel.group.visible = false;
    this.scene.add(this.camera);
    this.camera.add(this.viewRig);
    this.createViewArms();
    this.muzzleFlash = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.065, 0),
      new THREE.MeshBasicMaterial({ color: 0xffd58a, transparent: true, opacity: 0.95, depthTest: false }),
    );
    this.muzzleFlash.visible = false;
    this.viewRig.add(this.muzzleFlash);

    this.createActors();
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    this.resize();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('pointerlockerror', this.onPointerLockError);
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    this.renderer.domElement.addEventListener('contextmenu', this.onContextMenu);
    this.renderer.domElement.addEventListener('click', this.onCanvasClick);
    this.camera.position.set(44, 35, 46);
    this.camera.lookAt(0, 0, 0);
    this.emitSnapshot();
    this.frameId = requestAnimationFrame(this.animate);
  }

  private createViewArms() {
    const sleeve = new THREE.MeshStandardMaterial({ color: 0x344b52, roughness: 0.95, depthTest: false });
    const glove = new THREE.MeshStandardMaterial({ color: 0x262b29, roughness: 0.9, depthTest: false });
    const addArm = (
      position: [number, number, number],
      rotation: [number, number, number],
      handPosition: [number, number, number],
    ) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.42), sleeve);
      arm.position.set(...position);
      arm.rotation.set(...rotation);
      arm.renderOrder = 20;
      this.viewRig.add(arm);
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.075, 0.12), glove);
      hand.position.set(...handPosition);
      hand.rotation.set(-0.18, 0, 0);
      hand.renderOrder = 20;
      this.viewRig.add(hand);
    };
    addArm([0.38, -0.5, -0.2], [-0.5, 0.18, -0.12], [0.26, -0.35, -0.43]);
    addArm([0.01, -0.49, -0.34], [-0.34, -0.5, 0.28], [0.18, -0.31, -0.61]);
  }

  private createActors() {
    for (const actor of this.actors) this.scene.remove(actor.model.group);
    this.actors.length = 0;
    for (let id = 0; id < 10; id++) {
      const team: Team = id < 5 ? 'CT' : 'T';
      const model = createCharacter(team);
      this.scene.add(model.group);
      const actor: Actor = {
        id,
        name: id === 0 || id === 5 ? 'YOU' : BOT_NAMES[id - (id > 5 ? 1 : 0)],
        team,
        position: new THREE.Vector3(),
        velocityY: 0,
        yaw: team === 'CT' ? Math.PI : 0,
        pitch: 0,
        recoilPitch: 0,
        recoilYaw: 0,
        health: 100,
        armor: 0,
        alive: true,
        onGround: true,
        moving: false,
        moveAmount: 0,
        kills: 0,
        deaths: 0,
        weapons: { secondary: createWeapon(defaultPistol(team)), knife: createWeapon('knife') },
        slot: 'secondary',
        cooldown: 0,
        switchCooldown: 0,
        bloom: 0,
        scoped: false,
        firingFlash: 0,
        stepDistance: 0,
        interaction: null,
        interactionProgress: 0,
        model,
        ai: {
          think: Math.random() * 0.2,
          reaction: 0.25,
          targetId: null,
          lastSeen: null,
          goal: new THREE.Vector3(),
          path: [],
          pathIndex: 0,
          repath: 0,
          strafe: id % 2 ? 1 : -1,
          strafeTimer: 1,
          stuck: 0,
          lastPosition: new THREE.Vector3(),
        },
      };
      this.actors.push(actor);
    }
    this.resetActorPositions();
  }

  private resetActorPositions() {
    for (const actor of this.actors) {
      const teamIndex = actor.id % 5;
      actor.position.copy(this.map.spawns[actor.team][teamIndex]);
      actor.model.group.position.copy(actor.position);
      actor.model.group.rotation.set(0, actor.yaw, 0);
      actor.model.group.visible = this.phase === 'menu';
    }
  }

  start(team: Team, mode: 'pistol' | 'rifle') {
    this.audio.resume();
    this.playerTeam = team;
    this.controlledId = team === 'CT' ? 0 : 5;
    this.spectatorId = null;
    this.round = 0;
    this.score = { CT: 0, T: 0 };
    this.killfeed = [];
    this.killfeedTimes = [];
    for (const actor of this.actors) {
      actor.kills = 0;
      actor.deaths = 0;
    }
    this.startRound(mode === 'rifle');
    this.requestPointerLock();
  }

  nextRound() {
    if (this.phase !== 'roundEnd') return;
    this.audio.resume();
    this.startRound(true);
    this.requestPointerLock();
  }

  private startRound(withRifles: boolean) {
    this.round += 1;
    this.phase = 'playing';
    this.paused = false;
    this.roundWinner = null;
    this.roundReason = '';
    this.roundTime = ROUND_TIME;
    this.roundElapsed = 0;
    this.spectatorId = null;
    this.notice = withRifles ? '主武器已配发 · 购买时段可更换装备' : '手枪局 · 全员无护甲，仅配备默认手枪';
    this.noticeAt = Math.max(0.001, this.elapsed);
    this.interaction = null;
    this.visibleEnemies = [];
    this.hitMarkerAt = 0;
    this.damageAt = 0;
    this.mouseDown = false;
    this.mousePressed = false;
    for (const actor of this.actors) {
      actor.position.copy(this.map.spawns[actor.team][actor.id % 5]);
      actor.velocityY = 0;
      actor.yaw = actor.team === 'CT' ? Math.PI : 0;
      actor.pitch = 0;
      actor.recoilPitch = 0;
      actor.recoilYaw = 0;
      actor.health = 100;
      actor.armor = withRifles ? 100 : 0;
      actor.alive = true;
      actor.onGround = true;
      actor.moving = false;
      actor.weapons = { secondary: createWeapon(defaultPistol(actor.team)), knife: createWeapon('knife') };
      if (withRifles) {
        const primary = actor.id % 5 === 3 ? 'awp' : defaultRifle(actor.team);
        actor.weapons.primary = createWeapon(primary);
      }
      actor.slot = withRifles ? 'primary' : 'secondary';
      actor.cooldown = 0;
      actor.switchCooldown = 0;
      actor.bloom = 0;
      actor.scoped = false;
      actor.firingFlash = 0;
      actor.interaction = null;
      actor.interactionProgress = 0;
      actor.ai.targetId = null;
      actor.ai.lastSeen = null;
      actor.ai.path = [];
      actor.ai.pathIndex = 0;
      actor.ai.repath = 0;
      actor.ai.think = Math.random() * 0.15;
      actor.ai.goal.copy(choosePatrolTarget(this.map, actor.team, Math.random));
      actor.ai.lastPosition.copy(actor.position);
      actor.model.group.visible = true;
      actor.model.group.rotation.set(0, actor.yaw, 0);
      actor.model.setWeapon(actor.weapons[actor.slot]!.id);
    }
    const carrier = this.actors.filter((actor) => actor.team === 'T')[Math.floor(Math.random() * 5)];
    this.bomb = { status: 'carried', carrierId: carrier.id, position: carrier.position.clone(), site: null, timer: 40 };
    this.bombModel.group.visible = true;
    this.updateViewWeapon();
    this.updateControlledModelVisibility();
    this.updateCamera(0);
    this.emitSnapshot();
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'Tab', 'KeyE'].includes(event.code)) event.preventDefault();
    if (event.code === 'KeyM' && !event.repeat) {
      this.toggleMute();
      return;
    }
    if (this.phase !== 'playing') return;
    if (this.paused) {
      if (event.code === 'Escape' && !event.repeat) this.resume();
      return;
    }
    this.keys.add(event.code);
    if (event.repeat) return;
    if (event.code === 'Escape') {
      if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
      else {
        this.paused = true;
        this.onBlur();
        this.emitSnapshot();
      }
      return;
    }
    const actor = this.controlled;
    if (event.code === 'KeyF' && !actor.alive) {
      this.takeoverNext();
      return;
    }
    if (!actor.alive) return;
    if (event.code === 'KeyR') this.startReload(actor);
    if (event.code === 'Digit1') this.switchWeapon(actor, 'primary');
    if (event.code === 'Digit2') this.switchWeapon(actor, 'secondary');
    if (event.code === 'Digit3') this.switchWeapon(actor, 'knife');
    if (event.code === 'KeyB' && this.canBuy()) this.cyclePrimary(actor);
    if (event.code === 'KeyN' && this.canBuy()) this.cyclePistol(actor);
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code);
  };

  private onBlur = () => {
    this.keys.clear();
    this.mouseDown = false;
    this.mousePressed = false;
  };

  private onMouseMove = (event: MouseEvent) => {
    if (document.pointerLockElement !== this.renderer.domElement || this.paused || this.phase !== 'playing' || performance.now() < this.mouseReadyAt) return;
    if (this.skipNextMouseMove) {
      this.skipNextMouseMove = false;
      return;
    }
    if (Math.abs(event.movementX) > 240 || Math.abs(event.movementY) > 240) return;
    const actor = this.controlled;
    if (!actor.alive) return;
    const sensitivity = actor.scoped ? 0.00105 : 0.00215;
    const movementX = event.movementX;
    const movementY = event.movementY;
    actor.yaw -= movementX * sensitivity;
    actor.pitch = THREE.MathUtils.clamp(actor.pitch - movementY * sensitivity, -1.42, 1.42);
  };

  private onMouseDown = (event: MouseEvent) => {
    if (this.phase !== 'playing') return;
    if (document.pointerLockElement !== this.renderer.domElement) {
      this.resume();
      return;
    }
    if (this.paused || !this.controlled.alive) return;
    if (event.button === 0) {
      this.mouseDown = true;
      this.mousePressed = true;
    }
    if (event.button === 2) {
      const actor = this.controlled;
      if (actor.weapons[actor.slot]?.id === 'awp' && actor.switchCooldown <= 0) {
        actor.scoped = !actor.scoped;
        this.audio.scope();
      }
    }
  };

  private onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) this.mouseDown = false;
  };

  private onContextMenu = (event: Event) => event.preventDefault();

  private onCanvasClick = () => {
    if (this.phase === 'playing' && this.paused) this.resume();
  };

  private onPointerLockChange = () => {
    if (this.disposed || this.phase !== 'playing') return;
    if (document.pointerLockElement === this.renderer.domElement) {
      this.paused = false;
      this.mouseReadyAt = performance.now() + 140;
      this.skipNextMouseMove = true;
      this.audio.resume();
    } else {
      this.paused = true;
      this.onBlur();
    }
    this.emitSnapshot();
  };

  private onPointerLockError = () => {
    if (this.phase === 'playing') {
      this.paused = true;
      this.emitSnapshot();
    }
  };

  private requestPointerLock() {
    try {
      const result = this.renderer.domElement.requestPointerLock();
      if (result) void result.catch(() => {
        this.paused = true;
        this.emitSnapshot();
      });
    } catch {
      this.paused = true;
    }
  }

  resume() {
    if (this.phase !== 'playing') return;
    this.audio.resume();
    this.paused = false;
    this.requestPointerLock();
    this.emitSnapshot();
  }

  toggleMute() {
    this.audio.setMuted(!this.audio.isMuted());
    this.emitSnapshot();
  }

  private canBuy() {
    return this.roundElapsed < 12 && Boolean(this.controlled.weapons.primary) && this.phase === 'playing';
  }

  private cyclePrimary(actor: Actor) {
    const options: WeaponId[] = [defaultRifle(actor.team), defaultRifle(actor.team === 'CT' ? 'T' : 'CT'), 'awp'];
    const current = actor.weapons.primary?.id;
    const next = options[(options.indexOf(current ?? options[0]) + 1) % options.length];
    actor.weapons.primary = createWeapon(next);
    actor.slot = 'primary';
    actor.switchCooldown = 0.45;
    actor.scoped = false;
    this.switchKick = 1;
    this.setNotice(`已配备 ${WEAPONS[next].name}`);
    this.audio.reload(0);
    this.updateViewWeapon();
  }

  private cyclePistol(actor: Actor) {
    const next = actor.weapons.secondary?.id === 'deagle' ? defaultPistol(actor.team) : 'deagle';
    actor.weapons.secondary = createWeapon(next);
    actor.slot = 'secondary';
    actor.switchCooldown = 0.35;
    actor.scoped = false;
    this.setNotice(`已配备 ${WEAPONS[next].name}`);
    this.audio.reload(0);
    this.updateViewWeapon();
  }

  private switchWeapon(actor: Actor, slot: WeaponSlot) {
    if (!actor.weapons[slot] || actor.slot === slot) return;
    actor.slot = slot;
    actor.switchCooldown = slot === 'knife' ? 0.28 : 0.42;
    actor.scoped = false;
    actor.interaction = null;
    actor.interactionProgress = 0;
    if (actor.id === this.controlledId) {
      this.switchKick = 1;
      this.updateViewWeapon();
    }
    actor.model.setWeapon(actor.weapons[slot]!.id);
  }

  private updateViewWeapon() {
    if (this.viewWeapon) {
      this.viewRig.remove(this.viewWeapon);
      this.viewWeapon.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.dispose();
      });
      this.viewWeapon = null;
    }
    const actor = this.cameraActor;
    const weapon = actor.weapons[actor.slot];
    if (!weapon) return;
    this.viewWeapon = createWeaponModel(weapon.id, true);
    this.viewWeapon.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.renderOrder = 21;
        object.material = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.depthTest = false;
      }
    });
    this.viewRig.add(this.viewWeapon);
    actor.model.setWeapon(weapon.id);
  }

  cycleSpectator() {
    if (this.controlled.alive) return;
    const teammates = this.actors.filter((actor) => actor.team === this.playerTeam && actor.alive);
    if (!teammates.length) return;
    const current = teammates.findIndex((actor) => actor.id === this.spectatorId);
    this.spectatorId = teammates[(current + 1) % teammates.length].id;
    this.updateViewWeapon();
    this.emitSnapshot();
  }

  private takeoverNext() {
    const teammates = this.actors.filter((actor) => actor.team === this.playerTeam && actor.alive);
    if (!teammates.length) return;
    const current = teammates.findIndex((actor) => actor.id === this.spectatorId);
    const target = teammates[(current + 1) % teammates.length];
    this.controlledId = target.id;
    this.spectatorId = null;
    this.playerTeam = target.team;
    this.setNotice(`已接管 ${target.name} · 继续作战`);
    this.updateControlledModelVisibility();
    this.updateViewWeapon();
    this.emitSnapshot();
  }

  private get controlled() {
    return this.actors[this.controlledId];
  }

  private get cameraActor() {
    if (this.controlled.alive || this.spectatorId === null) return this.controlled;
    return this.actors[this.spectatorId] ?? this.controlled;
  }

  private updateControlledModelVisibility() {
    for (const actor of this.actors) actor.model.group.visible = actor.id !== this.cameraActor.id || !actor.alive;
  }

  private animate = (time: number) => {
    if (this.disposed) return;
    const frameDelta = Math.min(0.08, Math.max(0, (time - this.previousTime) / 1000));
    this.previousTime = time;
    if (this.phase === 'playing' && !this.paused) {
      this.accumulator += frameDelta;
      const step = 1 / 60;
      let iterations = 0;
      while (this.accumulator >= step && iterations < 6) {
        this.fixedUpdate(step);
        this.accumulator -= step;
        iterations++;
      }
    }
    this.updateVisuals(frameDelta);
    this.updateCamera(frameDelta);
    this.renderer.render(this.scene, this.camera);
    this.snapshotTimer -= frameDelta;
    if (this.snapshotTimer <= 0) {
      this.emitSnapshot();
      this.snapshotTimer = 0.065;
    }
    this.frameId = requestAnimationFrame(this.animate);
  };

  private fixedUpdate(dt: number) {
    if (this.phase !== 'playing') return;
    this.elapsed += dt;
    this.roundElapsed += dt;
    if (this.bomb.status !== 'planted') this.roundTime = Math.max(0, this.roundTime - dt);
    this.interaction = null;

    for (const actor of this.actors) {
      actor.cooldown = Math.max(0, actor.cooldown - dt);
      actor.switchCooldown = Math.max(0, actor.switchCooldown - dt);
      actor.firingFlash = Math.max(0, actor.firingFlash - dt);
      actor.recoilPitch = THREE.MathUtils.damp(actor.recoilPitch, 0, 7.5, dt);
      actor.recoilYaw = THREE.MathUtils.damp(actor.recoilYaw, 0, 8, dt);
      actor.bloom = Math.max(0, actor.bloom - dt * 1.35);
      for (const runtime of Object.values(actor.weapons)) {
        if (runtime.reloadRemaining <= 0) continue;
        runtime.reloadRemaining = Math.max(0, runtime.reloadRemaining - dt);
        if (runtime.reloadRemaining === 0) {
          const spec = WEAPONS[runtime.id];
          const needed = spec.magazine - runtime.ammo;
          const loaded = Math.min(needed, runtime.reserve);
          runtime.ammo += loaded;
          runtime.reserve -= loaded;
        }
      }
    }

    const human = this.controlled;
    if (human.alive) this.updateHuman(human, dt);
    for (const actor of this.actors) {
      if (actor.alive && actor.id !== this.controlledId) this.updateBot(actor, dt);
      if (this.phase !== 'playing') return;
    }
    this.mousePressed = false;
    this.pickupBomb();
    this.updateBomb(dt);
    this.visibilityTimer -= dt;
    if (this.visibilityTimer <= 0) {
      this.updateVisibleEnemies();
      this.visibilityTimer = 0.14;
    }
    while (this.killfeedTimes.length && this.elapsed - this.killfeedTimes[0] > 5.5) {
      this.killfeedTimes.shift();
      this.killfeed.shift();
    }
    this.checkRoundEnd();
  }

  private updateHuman(actor: Actor, dt: number) {
    const runtime = actor.weapons[actor.slot]!;
    const spec = WEAPONS[runtime.id];
    let forward = 0;
    let right = 0;
    if (this.keys.has('KeyW')) forward += 1;
    if (this.keys.has('KeyS')) forward -= 1;
    if (this.keys.has('KeyD')) right += 1;
    if (this.keys.has('KeyA')) right -= 1;
    const length = Math.hypot(forward, right) || 1;
    forward /= length;
    right /= length;
    let speed = spec.moveSpeed;
    if (actor.scoped) speed *= 0.48;
    if (actor.interaction) speed = 0;
    const dx = (-Math.sin(actor.yaw) * forward + Math.cos(actor.yaw) * right) * speed * dt;
    const dz = (-Math.cos(actor.yaw) * forward - Math.sin(actor.yaw) * right) * speed * dt;
    if (this.keys.has('Space') && actor.onGround && !actor.interaction) {
      actor.velocityY = 6.15;
      actor.onGround = false;
    }
    this.applyMovement(actor, dx, dz, dt);
    this.updateHumanInteraction(actor, dt);
    const wantsFire = spec.automatic ? this.mouseDown : this.mousePressed;
    if (wantsFire && !actor.interaction) this.tryFire(actor, false);
    if (this.mouseDown && runtime.ammo === 0 && runtime.reloadRemaining <= 0) this.startReload(actor);
  }

  private applyMovement(actor: Actor, dx: number, dz: number, dt: number) {
    const oldX = actor.position.x;
    const oldZ = actor.position.z;
    moveWithCollisions(this.map, actor.position, dx, dz, ACTOR_RADIUS);
    const moved = Math.hypot(actor.position.x - oldX, actor.position.z - oldZ);
    actor.moving = moved > 0.0001;
    actor.moveAmount = moved / Math.max(dt, 0.001);
    if (actor.onGround && actor.velocityY <= 0) actor.velocityY = -2;
    actor.velocityY -= 18 * dt;
    const nextY = actor.position.y + actor.velocityY * dt;
    const support = supportHeight(this.map, actor.position, nextY, ACTOR_RADIUS * 0.85);
    if (actor.velocityY <= 0 && nextY <= support) {
      actor.position.y = support;
      actor.velocityY = 0;
      actor.onGround = true;
    } else {
      actor.position.y = nextY;
      actor.onGround = false;
    }
    actor.stepDistance += moved;
    const stride = actor.weapons[actor.slot]?.id === 'knife' ? 1.75 : 2.05;
    if (actor.stepDistance > stride && actor.onGround) {
      actor.stepDistance = 0;
      const distance = actor.id === this.cameraActor.id ? 0 : actor.position.distanceTo(this.cameraActor.position);
      if (distance < 30) this.audio.footstep(distance);
    }
  }

  private updateHumanInteraction(actor: Actor, dt: number) {
    const holding = this.keys.has('KeyE');
    const site = bombSiteAt(this.map, actor.position.x, actor.position.z);
    const canPlant = actor.team === 'T' && this.bomb.status === 'carried' && this.bomb.carrierId === actor.id && site !== null;
    const bombDistance = actor.position.distanceTo(this.bomb.position);
    const canDefuse = actor.team === 'CT' && this.bomb.status === 'planted' && bombDistance < 2.15;
    if (holding && (canPlant || canDefuse) && !actor.moving && actor.onGround) {
      const kind = canPlant ? 'plant' : 'defuse';
      if (actor.interaction !== kind) {
        actor.interaction = kind;
        actor.interactionProgress = 0;
      }
      const duration = canPlant ? PLANT_TIME : DEFUSE_TIME;
      actor.interactionProgress += dt;
      this.interaction = { label: canPlant ? `正在 ${site} 点安放 C4` : '正在拆除 C4', progress: Math.min(1, actor.interactionProgress / duration) };
      if (actor.interactionProgress >= duration) {
        if (canPlant) this.plantBomb(actor, site!);
        else this.defuseBomb(actor);
        actor.interaction = null;
        actor.interactionProgress = 0;
      }
    } else {
      actor.interaction = null;
      actor.interactionProgress = 0;
      if (holding && canPlant && actor.moving) this.interaction = { label: '保持静止以安放 C4', progress: 0 };
      else if (holding && canDefuse && actor.moving) this.interaction = { label: '保持静止以拆包', progress: 0 };
    }
  }

  private startReload(actor: Actor) {
    const runtime = actor.weapons[actor.slot];
    if (!runtime) return;
    const spec = WEAPONS[runtime.id];
    if (spec.slot === 'knife' || runtime.reloadRemaining > 0 || runtime.ammo >= spec.magazine || runtime.reserve <= 0) return;
    runtime.reloadRemaining = spec.reloadTime;
    actor.scoped = false;
    actor.interaction = null;
    actor.interactionProgress = 0;
    const distance = actor.id === this.cameraActor.id ? 0 : actor.position.distanceTo(this.cameraActor.position);
    if (distance < 32) this.audio.reload(distance);
  }

  private updateVisuals(dt: number) {
    for (const actor of this.actors) {
      actor.model.group.position.copy(actor.position);
      if (actor.alive) actor.model.group.rotation.y = actor.yaw;
      actor.model.update(dt, {
        moving: actor.moving,
        speed: actor.moveAmount,
        pitch: actor.pitch + actor.recoilPitch,
        dead: !actor.alive,
        firing: actor.firingFlash > 0,
      });
    }
    this.bombModel.update(this.elapsed + performance.now() / 1000);
    if (this.bomb.status === 'carried') {
      const carrier = this.bomb.carrierId === null ? null : this.actors[this.bomb.carrierId];
      if (carrier?.alive) {
        this.bomb.position.copy(carrier.position);
        this.bombModel.group.position.copy(carrier.position).add(new THREE.Vector3(0, 1.14, 0));
        const back = forwardOf(carrier).multiplyScalar(-0.19);
        this.bombModel.group.position.add(back);
        this.bombModel.group.rotation.set(0.25, carrier.yaw, 0);
      }
    } else {
      this.bombModel.group.position.copy(this.bomb.position);
      this.bombModel.group.rotation.set(0, 0, 0);
    }
    this.bombModel.group.visible = this.phase !== 'menu' && this.bomb.status !== 'defused' && this.bomb.status !== 'exploded';

    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tracer = this.tracers[i];
      tracer.life -= dt;
      const material = tracer.line.material as THREE.LineBasicMaterial;
      material.opacity = Math.max(0, tracer.life / 0.085);
      if (tracer.life <= 0) {
        this.scene.remove(tracer.line);
        tracer.line.geometry.dispose();
        material.dispose();
        this.tracers.splice(i, 1);
      }
    }
    for (let i = this.impacts.length - 1; i >= 0; i--) {
      const impact = this.impacts[i];
      impact.life -= dt;
      impact.mesh.scale.multiplyScalar(1 + dt * 4);
      if (impact.life <= 0) {
        this.scene.remove(impact.mesh);
        impact.mesh.geometry.dispose();
        (impact.mesh.material as THREE.Material).dispose();
        this.impacts.splice(i, 1);
      }
    }
  }

  private updateCamera(dt: number) {
    if (this.phase === 'menu') {
      const time = performance.now() * 0.000055;
      this.camera.position.set(Math.cos(time) * 59, 38, Math.sin(time) * 59);
      this.camera.lookAt(0, 0, -2);
      this.camera.fov = 58;
      this.camera.updateProjectionMatrix();
      this.viewRig.visible = false;
      return;
    }
    const actor = this.cameraActor;
    const bob = actor.moving && actor.onGround ? Math.sin(this.bobPhase) * 0.025 : 0;
    this.bobPhase += dt * (actor.moving ? 10.5 : 3);
    this.camera.position.copy(actor.position).add(new THREE.Vector3(0, EYE_HEIGHT + bob, 0));
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = actor.yaw + actor.recoilYaw;
    this.camera.rotation.x = actor.pitch + actor.recoilPitch;
    this.camera.rotation.z = 0;
    const targetFov = actor.scoped && actor.weapons[actor.slot]?.id === 'awp' ? 23 : 74;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 15, dt);
    this.camera.updateProjectionMatrix();
    this.viewRig.visible = actor.alive && !actor.scoped;
    this.viewKick = THREE.MathUtils.damp(this.viewKick, 0, 15, dt);
    this.switchKick = THREE.MathUtils.damp(this.switchKick, 0, 9, dt);
    if (this.viewWeapon) {
      const reloading = (actor.weapons[actor.slot]?.reloadRemaining ?? 0) > 0;
      this.viewWeapon.position.set(0.25 + Math.sin(this.bobPhase * 0.5) * (actor.moving ? 0.009 : 0), -0.23 + bob * 0.65 - this.switchKick * 0.23 - (reloading ? 0.09 : 0), -0.46 + this.viewKick * 0.12);
      this.viewWeapon.rotation.set(this.viewKick * 0.12 + (reloading ? 0.2 : 0), 0, reloading ? 0.22 : -this.viewKick * 0.025);
      const id = actor.weapons[actor.slot]?.id;
      const length = id === 'awp' ? 1.05 : id === 'ak47' ? 0.82 : id === 'm4a4' ? 0.76 : id === 'knife' ? 0.2 : 0.23;
      this.muzzleFlash.position.set(0.25, -0.22, -0.46 - length);
      this.muzzleFlash.rotation.z += dt * 24;
      this.muzzleFlash.visible = actor.firingFlash > 0 && id !== 'knife' && !actor.scoped;
    }
  }

  private updateBot(actor: Actor, dt: number) {
    actor.ai.think -= dt;
    actor.ai.repath -= dt;
    actor.ai.strafeTimer -= dt;
    if (actor.ai.think <= 0) {
      this.thinkBot(actor);
      actor.ai.think = 0.12 + Math.random() * 0.1;
    }

    let enemy = actor.ai.targetId === null ? null : this.actors[actor.ai.targetId];
    if (enemy && (!enemy.alive || !hasLineOfSight(this.map, eyeOf(actor), eyeOf(enemy)))) {
      actor.ai.lastSeen = enemy.position.clone();
      actor.ai.targetId = null;
      enemy = null;
      actor.ai.repath = 0;
    }

    if (enemy) {
      actor.ai.reaction -= dt;
      const delta = enemy.position.clone().sub(actor.position);
      const distance = delta.length();
      const targetYaw = Math.atan2(-delta.x, -delta.z);
      actor.yaw += angleDelta(actor.yaw, targetYaw) * Math.min(1, dt * 10);
      const targetPitch = Math.atan2(EYE_HEIGHT - 0.25 - EYE_HEIGHT, Math.max(0.1, Math.hypot(delta.x, delta.z)));
      actor.pitch = THREE.MathUtils.damp(actor.pitch, targetPitch, 9, dt);
      actor.scoped = actor.weapons[actor.slot]?.id === 'awp' && distance > 10;
      if (actor.ai.strafeTimer <= 0) {
        actor.ai.strafe *= -1;
        actor.ai.strafeTimer = 0.65 + Math.random() * 1.25;
      }
      const forward = forwardOf(actor);
      const right = new THREE.Vector3(-forward.z, 0, forward.x);
      const speed = WEAPONS[actor.weapons[actor.slot]!.id].moveSpeed;
      let advance = distance > 17 && actor.weapons[actor.slot]?.id !== 'awp' ? 0.48 : distance < 4 ? -0.3 : 0;
      if (actor.weapons[actor.slot]?.reloadRemaining) advance = -0.2;
      const movement = right.multiplyScalar(actor.ai.strafe * speed * 0.42 * dt).add(forward.multiplyScalar(advance * speed * dt));
      this.applyMovement(actor, movement.x, movement.z, dt);
      if (actor.ai.reaction <= 0 && Math.abs(angleDelta(actor.yaw, targetYaw)) < 0.16) this.tryFire(actor, true);
      if (actor.weapons[actor.slot]!.ammo === 0) this.startReload(actor);
      return;
    }

    actor.scoped = false;
    actor.ai.reaction = Math.max(0.08, actor.ai.reaction);
    const runtime = actor.weapons[actor.slot]!;
    if (runtime.ammo < WEAPONS[runtime.id].magazine * 0.35 && runtime.reloadRemaining <= 0) this.startReload(actor);

    const site = bombSiteAt(this.map, actor.position.x, actor.position.z);
    const canPlant = actor.team === 'T' && this.bomb.status === 'carried' && this.bomb.carrierId === actor.id && site !== null;
    const canDefuse = actor.team === 'CT' && this.bomb.status === 'planted' && actor.position.distanceTo(this.bomb.position) < 2.05;
    if (canPlant || canDefuse) {
      const kind = canPlant ? 'plant' : 'defuse';
      if (actor.interaction !== kind) {
        actor.interaction = kind;
        actor.interactionProgress = 0;
      }
      actor.interactionProgress += dt;
      actor.moving = false;
      actor.moveAmount = 0;
      const duration = canPlant ? PLANT_TIME : DEFUSE_TIME;
      if (actor.interactionProgress >= duration) {
        if (canPlant) this.plantBomb(actor, site!);
        else this.defuseBomb(actor);
        actor.interaction = null;
        actor.interactionProgress = 0;
      }
      return;
    }
    actor.interaction = null;
    actor.interactionProgress = 0;

    if (!actor.ai.path.length || actor.ai.repath <= 0) {
      actor.ai.path = findPath(this.map, actor.position, actor.ai.goal);
      actor.ai.pathIndex = 0;
      actor.ai.repath = 1.4 + Math.random() * 0.7;
    }
    let target = actor.ai.path[actor.ai.pathIndex];
    while (target && actor.position.distanceTo(target) < 0.72) {
      actor.ai.pathIndex++;
      target = actor.ai.path[actor.ai.pathIndex];
    }
    if (!target) {
      actor.moving = false;
      actor.moveAmount = 0;
      if (actor.ai.lastSeen) actor.ai.lastSeen = null;
      return;
    }
    const delta = target.clone().sub(actor.position);
    delta.y = 0;
    const distance = delta.length();
    if (distance < 0.001) return;
    delta.multiplyScalar(1 / distance);
    const targetYaw = Math.atan2(-delta.x, -delta.z);
    actor.yaw += angleDelta(actor.yaw, targetYaw) * Math.min(1, dt * 7);
    actor.pitch = THREE.MathUtils.damp(actor.pitch, 0, 5, dt);
    const actualForward = forwardOf(actor);
    const speed = WEAPONS[runtime.id].moveSpeed * 0.82;
    let dx = actualForward.x * speed * dt;
    let dz = actualForward.z * speed * dt;
    for (const teammate of this.actors) {
      if (teammate.id === actor.id || !teammate.alive || teammate.team !== actor.team) continue;
      const separation = actor.position.clone().sub(teammate.position);
      separation.y = 0;
      const d = separation.length();
      if (d > 0.01 && d < 0.9) {
        dx += separation.x / d * (0.9 - d) * dt * 3;
        dz += separation.z / d * (0.9 - d) * dt * 3;
      }
    }
    this.applyMovement(actor, dx, dz, dt);
    if (actor.moveAmount < 0.25) actor.ai.stuck += dt;
    else actor.ai.stuck = Math.max(0, actor.ai.stuck - dt * 2);
    if (actor.ai.stuck > 0.7) {
      actor.ai.path = [];
      actor.ai.repath = 0;
      actor.ai.stuck = 0;
      actor.yaw += actor.ai.strafe * 0.65;
    }
    actor.ai.lastPosition.copy(actor.position);
  }

  private thinkBot(actor: Actor) {
    const visible = this.findVisibleEnemy(actor);
    if (visible) {
      if (actor.ai.targetId !== visible.id) actor.ai.reaction = 0.18 + Math.random() * 0.3;
      actor.ai.targetId = visible.id;
      actor.ai.lastSeen = visible.position.clone();
      return;
    }
    actor.ai.targetId = null;
    if (actor.ai.lastSeen && actor.position.distanceTo(actor.ai.lastSeen) > 2) {
      actor.ai.goal.copy(actor.ai.lastSeen);
      return;
    }

    if (this.bomb.status === 'planted') {
      if (actor.team === 'CT') {
        actor.ai.goal.copy(this.bomb.position);
      } else {
        const siteNode = this.map.nodes.find((node) => node.id === (this.bomb.site === 'A' ? 'aCross' : 'b'))!;
        actor.ai.goal.copy(siteNode.position);
        if (actor.position.distanceTo(this.bomb.position) < 7 && Math.random() < 0.25) actor.ai.goal.copy(choosePatrolTarget(this.map, 'CT', Math.random));
      }
      return;
    }
    if (this.bomb.status === 'dropped' && actor.team === 'T') {
      actor.ai.goal.copy(this.bomb.position);
      return;
    }
    if (actor.team === 'T') {
      if (this.bomb.carrierId === actor.id) {
        actor.ai.goal.copy(this.map.nodes.find((node) => node.id === (actor.id % 2 ? 'a' : 'b'))!.position);
      } else {
        const carrier = this.bomb.carrierId === null ? null : this.actors[this.bomb.carrierId];
        if (carrier && actor.id % 3 === 0) actor.ai.goal.copy(carrier.position);
        else if (actor.position.distanceTo(actor.ai.goal) < 2 || Math.random() < 0.08) actor.ai.goal.copy(choosePatrolTarget(this.map, 'T', Math.random));
      }
      return;
    }
    const guardIds = ['a', 'longA', 'cat', 'b', 'bExit'];
    const assigned = this.map.nodes.find((node) => node.id === guardIds[actor.id % 5])!;
    if (actor.position.distanceTo(actor.ai.goal) < 1.7 || actor.ai.goal.lengthSq() === 0) {
      actor.ai.goal.copy(Math.random() < 0.72 ? assigned.position : choosePatrolTarget(this.map, 'CT', Math.random));
    }
  }

  private findVisibleEnemy(actor: Actor) {
    const eye = eyeOf(actor);
    const forward = forwardOf(actor);
    let best: Actor | null = null;
    let bestDistance = Infinity;
    for (const candidate of this.actors) {
      if (!candidate.alive || candidate.team === actor.team) continue;
      const delta = candidate.position.clone().sub(actor.position);
      const distance = delta.length();
      if (distance > 52 || distance >= bestDistance) continue;
      delta.y = 0;
      if (distance > 3 && delta.normalize().dot(forward) < 0.34) continue;
      if (!hasLineOfSight(this.map, eye, eyeOf(candidate))) continue;
      best = candidate;
      bestDistance = distance;
    }
    return best;
  }

  private updateVisibleEnemies() {
    const friendlies = this.actors.filter((actor) => actor.team === this.playerTeam && actor.alive);
    const visible = new Set<number>();
    for (const friendly of friendlies) {
      const eye = eyeOf(friendly);
      for (const enemy of this.actors) {
        if (!enemy.alive || enemy.team === this.playerTeam || visible.has(enemy.id)) continue;
        if (friendly.position.distanceTo(enemy.position) > 55) continue;
        if (hasLineOfSight(this.map, eye, eyeOf(enemy))) visible.add(enemy.id);
      }
    }
    this.visibleEnemies = [...visible];
  }

  private tryFire(actor: Actor, bot: boolean) {
    if (!actor.alive || actor.cooldown > 0 || actor.switchCooldown > 0 || actor.interaction) return;
    const runtime = actor.weapons[actor.slot];
    if (!runtime || runtime.reloadRemaining > 0) return;
    const spec = WEAPONS[runtime.id];
    if (spec.slot !== 'knife' && runtime.ammo <= 0) {
      this.startReload(actor);
      return;
    }
    actor.cooldown = spec.interval;
    actor.firingFlash = spec.slot === 'knife' ? 0.12 : 0.055;
    if (spec.slot !== 'knife') runtime.ammo -= 1;

    const pitch = actor.pitch + actor.recoilPitch;
    const yaw = actor.yaw + actor.recoilYaw;
    const direction = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ')).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(UP, yaw);
    const up = new THREE.Vector3().crossVectors(right, direction).normalize();
    let spread = spec.spread + actor.bloom * (spec.automatic ? 0.018 : 0.01) + (actor.moving ? 0.004 : 0) + (!actor.onGround ? 0.018 : 0);
    if (spec.id === 'awp') spread = actor.scoped && !actor.moving ? 0.00022 : 0.045;
    if (bot) spread += 0.0045 + actor.id % 3 * 0.0012;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * spread;
    direction.addScaledVector(right, Math.cos(angle) * radius).addScaledVector(up, Math.sin(angle) * radius).normalize();
    actor.recoilPitch = Math.min(0.24, actor.recoilPitch + spec.recoil * (0.82 + Math.random() * 0.35));
    actor.recoilYaw = THREE.MathUtils.clamp(actor.recoilYaw + (Math.random() - 0.5) * spec.recoil * 0.5, -0.08, 0.08);
    actor.bloom = Math.min(1, actor.bloom + (spec.automatic ? 0.17 : 0.24));
    if (actor.id === this.cameraActor.id) this.viewKick = Math.min(1.5, this.viewKick + (spec.id === 'awp' ? 1.1 : 0.42));

    const origin = eyeOf(actor);
    const worldHit = raycastWorld(this.map, origin, direction, spec.range);
    let nearestDistance = worldHit?.distance ?? spec.range;
    let victim: Actor | null = null;
    let hitZone: HitZone | null = null;
    let hitPoint = worldHit?.point ?? null;
    if (spec.slot === 'knife' || runtime.ammo >= 0) {
      for (const candidate of this.actors) {
        if (!candidate.alive || candidate.team === actor.team || candidate.id === actor.id) continue;
        const hit = this.intersectActor(origin, direction, candidate, nearestDistance);
        if (hit && hit.distance < nearestDistance) {
          nearestDistance = hit.distance;
          victim = candidate;
          hitZone = hit.zone;
          hitPoint = hit.point;
        }
      }
    }
    if (!hitPoint) hitPoint = origin.clone().addScaledVector(direction, spec.range);

    const listenerDistance = actor.id === this.cameraActor.id ? 0 : actor.position.distanceTo(this.cameraActor.position);
    if (listenerDistance < 80) this.audio.shot(spec.id, listenerDistance);
    if (spec.slot !== 'knife') this.spawnTracer(origin.clone().addScaledVector(direction, 0.55).add(new THREE.Vector3(0, -0.12, 0)), hitPoint, spec.tracer);
    if (victim && hitZone) {
      const result = applyDamage(spec.damage, hitZone, victim.armor, nearestDistance, spec.range, spec.id === 'awp' ? 0.9 : 0.5);
      victim.armor = result.armor;
      victim.health = Math.max(0, victim.health - result.damage);
      if (actor.id === this.controlledId) {
        this.hitMarkerAt = this.elapsed;
        this.audio.hit();
      }
      if (victim.id === this.controlledId) this.damageAt = this.elapsed;
      this.spawnImpact(hitPoint, 0xb95542, 0.035);
      if (victim.health <= 0) this.handleKill(actor, victim, spec.id, hitZone === 'head');
    } else if (worldHit) {
      this.spawnImpact(hitPoint, 0xd4bd8d, 0.028);
    }
  }

  private intersectActor(origin: THREE.Vector3, direction: THREE.Vector3, actor: Actor, maxDistance: number) {
    const localOrigin = origin.clone().sub(actor.position).applyAxisAngle(UP, -actor.yaw);
    const localDirection = direction.clone().applyAxisAngle(UP, -actor.yaw);
    const ray = new THREE.Ray(localOrigin, localDirection);
    let closest = maxDistance;
    let zone: HitZone | null = null;
    let localPoint: THREE.Vector3 | null = null;
    for (const hitbox of HITBOXES) {
      const half = hitbox.size.clone().multiplyScalar(0.5);
      const box = new THREE.Box3(hitbox.center.clone().sub(half), hitbox.center.clone().add(half));
      const point = ray.intersectBox(box, new THREE.Vector3());
      if (!point) continue;
      const distance = point.distanceTo(localOrigin);
      if (distance < closest && distance > 0.02) {
        closest = distance;
        zone = hitbox.zone;
        localPoint = point;
      }
    }
    if (!zone || !localPoint) return null;
    const point = localPoint.applyAxisAngle(UP, actor.yaw).add(actor.position);
    return { distance: closest, zone, point };
  }

  private spawnTracer(start: THREE.Vector3, end: THREE.Vector3, color: number) {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.82, depthWrite: false, blending: THREE.AdditiveBlending });
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 4;
    this.scene.add(line);
    this.tracers.push({ line, life: 0.085 });
    if (this.tracers.length > 55) {
      const oldest = this.tracers.shift()!;
      this.scene.remove(oldest.line);
      oldest.line.geometry.dispose();
      (oldest.line.material as THREE.Material).dispose();
    }
  }

  private spawnImpact(point: THREE.Vector3, color: number, size: number) {
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(size, 0), material);
    mesh.position.copy(point);
    this.scene.add(mesh);
    this.impacts.push({ mesh, life: 0.16 });
  }

  private handleKill(killer: Actor, victim: Actor, weapon: WeaponId, headshot: boolean) {
    if (!victim.alive) return;
    victim.alive = false;
    victim.health = 0;
    victim.deaths += 1;
    victim.scoped = false;
    victim.interaction = null;
    victim.interactionProgress = 0;
    victim.moving = false;
    killer.kills += 1;
    this.killfeed.push({ id: ++this.feedId, killer: killer.id === this.controlledId ? 'YOU' : killer.name, killerTeam: killer.team, victim: victim.id === this.controlledId ? 'YOU' : victim.name, victimTeam: victim.team, weapon, headshot });
    this.killfeedTimes.push(this.elapsed);
    if (killer.id === this.controlledId) this.audio.kill();
    if (this.bomb.status === 'carried' && this.bomb.carrierId === victim.id) {
      this.bomb.status = 'dropped';
      this.bomb.carrierId = null;
      this.bomb.position.copy(victim.position);
      this.bomb.position.y = Math.max(0.04, victim.position.y + 0.04);
      this.setNotice('C4 已掉落 · T 阵营可拾取');
    }
    if (victim.id === this.controlledId) {
      const teammate = this.actors.find((actor) => actor.team === victim.team && actor.alive);
      this.spectatorId = teammate?.id ?? null;
      this.setNotice('你已阵亡 · F 接管存活队友');
      this.updateControlledModelVisibility();
      this.updateViewWeapon();
    } else if (victim.id === this.spectatorId) {
      const teammate = this.actors.find((actor) => actor.team === this.playerTeam && actor.alive);
      this.spectatorId = teammate?.id ?? null;
      this.updateControlledModelVisibility();
      this.updateViewWeapon();
    }
  }

  private pickupBomb() {
    if (this.bomb.status !== 'dropped') return;
    for (const actor of this.actors) {
      if (!actor.alive || actor.team !== 'T' || actor.position.distanceTo(this.bomb.position) > 1.35) continue;
      this.bomb.status = 'carried';
      this.bomb.carrierId = actor.id;
      this.bomb.site = null;
      this.setNotice(actor.id === this.controlledId ? '你已拾取 C4 · 前往 A 点或 B 点安放' : `${actor.name} 已拾取 C4`);
      this.audio.ui();
      break;
    }
  }

  private plantBomb(actor: Actor, site: 'A' | 'B') {
    if (this.bomb.status !== 'carried' || this.bomb.carrierId !== actor.id || this.phase !== 'playing') return;
    const forward = forwardOf(actor);
    this.bomb.status = 'planted';
    this.bomb.carrierId = null;
    this.bomb.site = site;
    this.bomb.timer = 40;
    this.bomb.position.copy(actor.position).addScaledVector(forward, 0.65);
    this.bomb.position.y = actor.position.y + 0.035;
    this.setNotice(`C4 已在 ${site} 点安放 · 40 秒后引爆`);
    this.audio.plant();
    for (const bot of this.actors) bot.ai.repath = 0;
  }

  private defuseBomb(actor: Actor) {
    if (this.bomb.status !== 'planted' || actor.team !== 'CT' || this.phase !== 'playing') return;
    this.bomb.status = 'defused';
    this.audio.defuse();
    this.endRound('CT', `${actor.name} 成功拆除 C4`);
  }

  private updateBomb(dt: number) {
    if (this.bomb.status !== 'planted' || this.phase !== 'playing') return;
    this.bomb.timer = Math.max(0, this.bomb.timer - dt);
    if (this.bomb.timer > 0) return;
    this.bomb.status = 'exploded';
    this.audio.explosion();
    this.spawnExplosion();
    for (const actor of this.actors) {
      if (!actor.alive) continue;
      const distance = actor.position.distanceTo(this.bomb.position);
      if (distance < 11) {
        actor.health = Math.max(0, actor.health - Math.round(160 * (1 - distance / 13)));
        if (actor.health <= 0) {
          const carrier = this.actors.find((candidate) => candidate.team === 'T' && candidate.alive) ?? this.actors[5];
          this.handleKill(carrier, actor, 'deagle', false);
        }
      }
    }
    this.endRound('T', `C4 在 ${this.bomb.site} 点引爆`);
  }

  private spawnExplosion() {
    const light = new THREE.PointLight(0xff8a38, 45, 32, 2);
    light.position.copy(this.bomb.position).add(new THREE.Vector3(0, 1.2, 0));
    this.scene.add(light);
    window.setTimeout(() => {
      if (!this.disposed) this.scene.remove(light);
    }, 350);
    for (let i = 0; i < 28; i++) {
      const point = this.bomb.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 3, (Math.random() - 0.5) * 5));
      this.spawnImpact(point, i % 2 ? 0xff7b2f : 0x463c30, 0.09 + Math.random() * 0.13);
    }
  }

  private checkRoundEnd() {
    if (this.phase !== 'playing') return;
    const ctAlive = this.actors.some((actor) => actor.team === 'CT' && actor.alive);
    const tAlive = this.actors.some((actor) => actor.team === 'T' && actor.alive);
    if (!ctAlive) {
      this.endRound('T', 'T 阵营已清空 CT 防守力量');
      return;
    }
    if (!tAlive && this.bomb.status !== 'planted') {
      this.endRound('CT', 'CT 阵营已清空 T 进攻力量');
      return;
    }
    if (this.roundTime <= 0 && this.bomb.status !== 'planted') this.endRound('CT', '回合时间耗尽 · CT 成功守住目标');
  }

  private endRound(winner: Team, reason: string) {
    if (this.phase !== 'playing') return;
    this.score[winner] += 1;
    this.roundWinner = winner;
    this.roundReason = reason;
    this.phase = 'roundEnd';
    this.paused = false;
    this.mouseDown = false;
    this.keys.clear();
    this.setNotice(`${winner} 阵营获胜`);
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
    this.emitSnapshot();
  }

  private setNotice(text: string) {
    this.notice = text;
    this.noticeAt = this.elapsed;
  }

  private emitSnapshot() {
    if (this.disposed || !this.actors.length) return;
    const controlled = this.controlled;
    const cameraActor = this.cameraActor;
    const current = cameraActor.weapons[cameraActor.slot] ?? createWeapon('knife');
    const players: PlayerSnapshot[] = this.actors.map((actor) => ({
      id: actor.id,
      name: actor.id === this.controlledId ? 'YOU' : actor.name,
      team: actor.team,
      health: actor.health,
      armor: actor.armor,
      alive: actor.alive,
      x: actor.position.x,
      y: actor.position.y,
      z: actor.position.z,
      yaw: actor.yaw,
      kills: actor.kills,
      deaths: actor.deaths,
      controlled: actor.id === this.controlledId,
      hasBomb: this.bomb.status === 'carried' && this.bomb.carrierId === actor.id,
      weapon: actor.weapons[actor.slot]?.id ?? 'knife',
    }));
    const weapons: Partial<Record<WeaponSlot, WeaponSnapshot>> = {};
    for (const [slot, runtime] of Object.entries(cameraActor.weapons) as Array<[WeaponSlot, WeaponRuntime]>) weapons[slot] = formatWeaponSnapshot(runtime);
    const carrierVisible = this.bomb.carrierId !== null && (this.actors[this.bomb.carrierId].team === this.playerTeam || this.visibleEnemies.includes(this.bomb.carrierId));
    const spec = WEAPONS[current.id];
    const snapshot: GameSnapshot = {
      phase: this.phase,
      paused: this.paused,
      round: this.round,
      roundTime: this.roundTime,
      score: { ...this.score },
      players,
      controlledId: this.controlledId,
      spectatorId: this.spectatorId,
      health: controlled.health,
      armor: controlled.armor,
      alive: controlled.alive,
      team: this.playerTeam,
      position: { x: cameraActor.position.x, y: cameraActor.position.y, z: cameraActor.position.z },
      yaw: cameraActor.yaw,
      location: locationAt(this.map, cameraActor.position.x, cameraActor.position.z),
      weapon: formatWeaponSnapshot(current),
      weapons,
      kills: controlled.kills,
      deaths: controlled.deaths,
      scoped: controlled.alive && controlled.scoped,
      spread: spec.spread + controlled.bloom * (spec.automatic ? 0.018 : 0.01) + (controlled.moving ? 0.004 : 0),
      hitMarkerAt: this.hitMarkerAt,
      damageAt: this.damageAt,
      killfeed: this.killfeed.map((item) => ({ ...item })),
      notice: this.elapsed - this.noticeAt < 3.4 ? this.notice : '',
      noticeAt: this.noticeAt,
      roundWinner: this.roundWinner,
      roundReason: this.roundReason,
      bomb: {
        status: this.bomb.status,
        carrierId: this.bomb.carrierId,
        x: this.bomb.position.x,
        y: this.bomb.position.y,
        z: this.bomb.position.z,
        site: this.bomb.site,
        timer: this.bomb.timer,
        visiblePosition: this.bomb.status === 'planted' || this.bomb.status === 'dropped' || carrierVisible,
      },
      interaction: this.interaction ? { ...this.interaction } : null,
      visibleEnemies: [...this.visibleEnemies],
      muted: this.audio.isMuted(),
      canBuy: this.canBuy(),
    };
    this.onSnapshot(snapshot);
  }

  getMinimapShapes() {
    return this.map.colliders.filter(({ kind }) => kind !== 'roof').map(({ box, kind }) => ({
      x: (box.min.x + box.max.x) / 2,
      z: (box.min.z + box.max.z) / 2,
      width: box.max.x - box.min.x,
      depth: box.max.z - box.min.z,
      kind,
    }));
  }

  private resize = () => {
    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.resizeObserver.disconnect();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('pointerlockerror', this.onPointerLockError);
    this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.renderer.domElement.removeEventListener('contextmenu', this.onContextMenu);
    this.renderer.domElement.removeEventListener('click', this.onCanvasClick);
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
    this.audio.dispose();
    this.map.group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) if (material.map) material.map.dispose();
      }
    });
    for (const tracer of this.tracers) {
      tracer.line.geometry.dispose();
      (tracer.line.material as THREE.Material).dispose();
    }
    for (const impact of this.impacts) {
      impact.mesh.geometry.dispose();
      (impact.mesh.material as THREE.Material).dispose();
    }
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
