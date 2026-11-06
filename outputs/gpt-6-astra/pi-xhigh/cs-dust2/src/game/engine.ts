import * as THREE from 'three';
import { WorldMap, ROUTES, SITES, SPAWNS, locationAt, siteAt } from './map';
import { Navigator } from './navigation';
import { characterModel, weaponModel, c4Model, disposeObject } from './models';
import { SynthAudio } from './audio';
import { HIT_MULTIPLIER, makeInventory, makeGun, WEAPONS } from './weapons';
import type { Actor, Bomb, Feed, RoundResult, Settings, Slot, Snapshot, Team, WeaponId, Zone } from './types';

const NAMES = ['NOMAD', 'VIPER', 'ROOK', 'GHOST', 'EMBER', 'ATLAS', 'FROST', 'ECHO', 'WOLF', 'SABLE'];
const UP = new THREE.Vector3(0, 1, 0);
const PLANT_TIME = 3.2, DEFUSE_TIME = 5, BOMB_TIME = 40, ROUND_TIME = 115;
interface Effect { object: THREE.Object3D; until: number; born: number; kind: 'trace' | 'impact' | 'blast' }

/** Owns all mutable simulation state. React receives immutable snapshots at 12.5Hz.
 * Simulation runs at 60Hz; presentation uses rAF. No React render drives physics. */
export class GameEngine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(80, 1, .035, 420);
  private readonly viewScene = new THREE.Scene();
  private readonly viewCamera = new THREE.PerspectiveCamera(80, 1, .02, 8);
  readonly map = new WorldMap();
  readonly navigator = new Navigator(this.map);
  readonly audio = new SynthAudio();
  readonly actors: Actor[] = [];
  readonly stats = Array.from({ length: 10 }, () => ({ kills: 0, deaths: 0 }));
  settings: Settings = { team: 'T', pistol: true, primary: 'ak', secondary: 'glock', volume: .55, sensitivity: 1 };
  mode: 'menu' | 'playing' = 'menu';
  playerId = 0;
  round = 1;
  time = 0;
  roundStart = 0;
  scores = { T: 0, CT: 0 };
  bomb: Bomb = { state: 'carried', carrier: 0, pos: new THREE.Vector3(), site: null, explodeAt: 0, actor: null, progress: 0, beepAt: 0 };
  result: RoundResult | null = null;
  locked = false;
  scoped = false;
  feed: Feed[] = [];
  private viewModel = new THREE.Group();
  private viewWeapon: WeaponId | null = null;
  private readonly bombModel = c4Model();
  private readonly bombLight = new THREE.PointLight('#ff5c24', 0, 6);
  private readonly flash: THREE.Mesh;
  private readonly keys = new Set<string>();
  private readonly ray = new THREE.Raycaster();
  private effects: Effect[] = [];
  private fireHeld = false;
  private firePressed = false;
  private lastFrame = 0;
  private accumulator = 0;
  private uiAt = 0;
  private senseAt = 0;
  private frameId = 0;
  private disposed = false;
  private endAt = 0;
  private hitUntil = 0;
  private hurtUntil = 0;
  private flashUntil = 0;
  private bob = 0;
  private fps = 60;
  private killCount = 0;
  private deathCount = 0;
  private spectatorId: number | null = null;
  private resizeObserver: ResizeObserver;
  private cleanup: (() => void)[] = [];
  private feedId = 0;
  private emptyAt = 0;
  private wallTime = 0;

  constructor(private container: HTMLElement, private onSnapshot: (snapshot: Snapshot) => void) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.12;
    this.renderer.domElement.setAttribute('aria-label', 'Dustline 3D game viewport');
    container.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color('#b7c9c8'); this.scene.fog = new THREE.Fog('#c5cfc8', 65, 190);
    this.scene.add(this.map.group, this.camera, this.bombModel, this.bombLight);
    this.scene.add(new THREE.HemisphereLight('#d4e4eb', '#96785a', 2.3));
    const sun = new THREE.DirectionalLight('#ffe2ae', 3.5); sun.position.set(-45, 85, 35); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -73; sun.shadow.camera.right = 73; sun.shadow.camera.top = 72; sun.shadow.camera.bottom = -72;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 220; sun.shadow.normalBias = .035; sun.shadow.bias = -.0002; this.scene.add(sun);
    this.camera.rotation.order = 'YXZ';
    this.viewScene.add(this.viewModel);
    this.viewScene.add(new THREE.HemisphereLight('#e6edee', '#a3a284', 2.4));
    const viewLight = new THREE.DirectionalLight('#ffe8cc', 3.2); viewLight.position.set(-2, 4, 1); this.viewScene.add(viewLight);
    this.flash = new THREE.Mesh(new THREE.OctahedronGeometry(.08), new THREE.MeshBasicMaterial({ color: '#fff4b1', transparent: true, opacity: .9, depthTest: false }));
    this.flash.visible = false; this.flash.renderOrder = 20; this.viewScene.add(this.flash);
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(container); this.resize();
    this.bindControls();
    this.pushSnapshot();
    this.frameId = requestAnimationFrame(this.frame);
  }
  get player() { return this.actors[this.playerId]; }
  get pistolRound() { return this.settings.pistol && this.round === 1; }
  get buyAllowed() { return !this.pistolRound && !this.result && this.time - this.roundStart < 20 && !!this.player?.alive && this.player.pos.distanceTo(SPAWNS[this.player.team]) < 16; }
  private resize() {
    const width = this.container.clientWidth, height = this.container.clientHeight;
    this.renderer.setSize(width, height); this.camera.aspect = width / Math.max(1, height); this.camera.updateProjectionMatrix();
    this.viewCamera.aspect = this.camera.aspect; this.viewCamera.updateProjectionMatrix();
  }
  private listen<K extends keyof DocumentEventMap>(type: K, listener: (event: DocumentEventMap[K]) => void) {
    document.addEventListener(type, listener); this.cleanup.push(() => document.removeEventListener(type, listener));
  }
  private bindControls() {
    this.listen('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.renderer.domElement;
      this.keys.clear(); this.fireHeld = this.firePressed = false;
      if (!this.locked) this.scoped = false;
      this.pushSnapshot();
    });
    this.listen('mousemove', e => {
      if (!this.locked || !this.player?.alive || this.result) return;
      this.player.yaw -= e.movementX * .002 * this.settings.sensitivity * (this.scoped ? .36 : 1);
      this.player.pitch = THREE.MathUtils.clamp(this.player.pitch - e.movementY * .002 * this.settings.sensitivity * (this.scoped ? .36 : 1), -1.4, 1.4);
    });
    this.listen('keydown', e => {
      if (!this.locked) return;
      if (e.code === 'Escape') { this.pause(); return; }
      if (['Space', 'Tab', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) e.preventDefault();
      this.keys.add(e.code);
      if (e.repeat) return;
      if (e.code === 'KeyR' && this.player) this.reload(this.player);
      if (e.code === 'Digit1') this.switchSlot('primary');
      if (e.code === 'Digit2') this.switchSlot('secondary');
      if (e.code === 'Digit3') this.switchSlot('melee');
      if (e.code === 'KeyV') this.takeover();
      if (e.code === 'Space' && !this.player?.alive) this.takeover();
    });
    this.listen('keyup', e => this.keys.delete(e.code));
    this.listen('mousedown', e => {
      if (!this.locked) return;
      if (e.button === 0) { this.fireHeld = true; this.firePressed = true; }
      if (e.button === 2 && this.player?.alive && this.player.inventory[this.player.slot]?.id === 'awp' && !this.player.reloadUntil) { this.scoped = !this.scoped; this.audio.scope(); }
    });
    this.listen('mouseup', e => { if (e.button === 0) this.fireHeld = false; });
    this.listen('contextmenu', e => { if (this.locked) e.preventDefault(); });
    this.listen('visibilitychange', () => { if (document.hidden) this.pause(); });
    const blur = () => this.pause(); window.addEventListener('blur', blur); this.cleanup.push(() => window.removeEventListener('blur', blur));
  }
  start(settings: Settings) {
    this.settings = { ...settings }; this.audio.setVolume(settings.volume); void this.audio.unlock();
    this.mode = 'playing'; this.round = 1; this.scores = { T: 0, CT: 0 }; this.time = 0;
    this.killCount = this.deathCount = 0; this.stats.forEach(s => { s.kills = 0; s.deaths = 0; });
    this.newRound(); this.lock();
  }
  lock() {
    if (this.disposed) return;
    void this.audio.unlock();
    const promise = this.renderer.domElement.requestPointerLock();
    if (promise) promise.catch(() => { this.locked = false; this.pushSnapshot(); });
  }
  pause() { if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock(); this.keys.clear(); this.fireHeld = false; }
  menu() { this.pause(); this.mode = 'menu'; this.scoped = false; this.viewModel.visible = false; this.pushSnapshot(); }
  updateSettings(volume: number, sensitivity: number) { this.settings.volume = volume; this.settings.sensitivity = sensitivity; this.audio.setVolume(volume); }
  buy(id: WeaponId) {
    if (!this.buyAllowed || WEAPONS[id].slot === 'melee') return;
    const slot = WEAPONS[id].slot;
    this.player.inventory[slot] = makeGun(id); this.player.slot = slot; this.player.reloadUntil = 0;
    this.changeActorWeapon(this.player); this.updateViewWeapon(); this.pushSnapshot();
  }
  private newRound() {
    for (const actor of this.actors) { this.scene.remove(actor.model.group); disposeObject(actor.model.group); }
    this.actors.length = 0;
    for (const e of this.effects) { this.scene.remove(e.object); disposeObject(e.object, true); } this.effects = [];
    this.result = null; this.roundStart = this.time; this.scoped = false; this.feed = []; this.spectatorId = null;
    this.playerId = this.settings.team === 'T' ? 0 : 5;
    const attackB = this.round % 2 === 0;
    for (let id = 0; id < 10; id++) {
      const team: Team = id < 5 ? 'T' : 'CT', index = id % 5;
      const inv = makeInventory(team, this.pistolRound, id === this.playerId ? this.settings.primary : index === 4 ? 'awp' : undefined, id === this.playerId ? this.settings.secondary : index === 3 && !this.pistolRound ? 'deagle' : undefined);
      const slot: Slot = inv.primary ? 'primary' : 'secondary';
      const model = characterModel(team, id, inv[slot]!.id);
      const pos = new THREE.Vector3([0, -3, 3, -6, 6][index], 0, team === 'T' ? 40 + index % 2 * 3 : -37 + index % 2 * 4);
      let route: number[][];
      if (team === 'T') route = index < 3 ? (attackB ? ROUTES.tunnels : ROUTES.long) : index === 3 ? ROUTES.cat : ROUTES.lower;
      else route = index < 2 ? [[-16, -30], [-38, -30], [-39, -17], [-34, -29]] : index < 4 ? [[17, -33], [34, -29], [44, -18], [29, -24]] : [[0, -22], [2, -17], [-3, -26]];
      const actor: Actor = {
        id, name: NAMES[id], team, pos, yaw: team === 'T' ? 0 : Math.PI, pitch: 0, velocityY: 0, grounded: true,
        hp: 100, armor: this.pistolRound ? 0 : 100, alive: true, inventory: inv, slot, reloadUntil: 0, nextShot: 0, recoil: 0,
        model, path: [], goal: null, repathAt: 0, target: null, task: 'advance', reactionAt: 0, moving: false, stepAt: 0, lastSeen: -10, lastAttacker: null,
        route: route.map(([x, z]) => new THREE.Vector3(x, 0, z)), routeIndex: 0, stuckTime: 0, oldPos: pos.clone(), personality: index / 5,
      };
      model.group.position.copy(pos); this.actors.push(actor); this.scene.add(model.group);
    }
    this.bomb = { state: 'carried', carrier: 0, pos: this.actors[0].pos.clone(), site: null, explodeAt: 0, actor: null, progress: 0, beepAt: 0 };
    this.bombModel.visible = false; this.bombLight.intensity = 0;
    this.changeActorWeapon(this.player); this.updateViewWeapon(); this.senseAt = 0; this.hitUntil = this.hurtUntil = 0;
    this.scene.updateMatrixWorld(true); this.pushSnapshot();
  }
  private switchSlot(slot: Slot) {
    const p = this.player;
    if (!p?.alive || !p.inventory[slot] || p.slot === slot || this.result) return;
    p.slot = slot; p.reloadUntil = 0; p.nextShot = Math.max(p.nextShot, this.time + .22); this.scoped = false;
    this.changeActorWeapon(p); this.updateViewWeapon(); this.audio.scope();
  }
  private changeActorWeapon(actor: Actor) {
    const old = actor.model.weapon; actor.model.group.remove(old); disposeObject(old);
    actor.model.weapon = weaponModel(actor.inventory[actor.slot]!.id); actor.model.weapon.position.set(.18, 1.22, -.42); actor.model.group.add(actor.model.weapon);
  }
  private updateViewWeapon() {
    const id = this.player?.inventory[this.player.slot]?.id;
    if (!id || id === this.viewWeapon) return;
    this.viewScene.remove(this.viewModel); disposeObject(this.viewModel, true);
    this.viewWeapon = id; this.viewModel = weaponModel(id, true); this.viewScene.add(this.viewModel);
  }
  takeover() {
    if (this.player?.alive || this.result) return;
    const next = this.actors.find(a => a.id === this.spectatorId && a.alive) ?? this.actors.find(a => a.alive && a.team === this.settings.team);
    if (!next) return;
    this.playerId = next.id; next.target = null; next.path = []; next.reloadUntil = 0; this.scoped = false; this.spectatorId = null;
    this.updateViewWeapon(); this.audio.scope(); this.pushSnapshot();
  }
  private frame = (now: number) => {
    if (this.disposed) return;
    const dt = this.lastFrame ? Math.min((now - this.lastFrame) / 1000, .1) : 1 / 60;
    this.lastFrame = now; this.wallTime += dt; this.fps += ((1 / Math.max(.001, dt)) - this.fps) * .03;
    if (this.mode === 'playing' && this.locked) {
      this.accumulator += dt;
      while (this.accumulator >= 1 / 60) { this.tick(1 / 60); this.accumulator -= 1 / 60; }
    } else this.accumulator = 0;
    this.present(dt);
    this.renderer.render(this.scene, this.camera);
    if (this.mode === 'playing' && this.viewModel.visible) {
      // A separate depth pass keeps arms in front of nearby walls, while retaining
      // correct self-occlusion and stable, readable first-person weapon lighting.
      this.renderer.autoClear = false; this.renderer.clearDepth();
      this.renderer.render(this.viewScene, this.viewCamera); this.renderer.autoClear = true;
    }
    if (now > this.uiAt) { this.uiAt = now + 80; this.pushSnapshot(); }
    this.frameId = requestAnimationFrame(this.frame);
  };
  private tick(dt: number) {
    this.time += dt;
    if (this.result) {
      if (this.time >= this.endAt) { this.round++; this.newRound(); }
      this.updateEffects(); return;
    }
    if (this.time >= this.senseAt) { this.senseAt = this.time + .17; this.sense(); }
    for (const actor of this.actors) {
      if (!actor.alive) continue;
      actor.recoil = Math.max(0, actor.recoil - dt * 2.2);
      if (actor.reloadUntil && this.time >= actor.reloadUntil) {
        const gun = actor.inventory[actor.slot]!;
        const amount = Math.min(WEAPONS[gun.id].magazine - gun.ammo, gun.reserve);
        gun.ammo += amount; gun.reserve -= amount; actor.reloadUntil = 0;
      }
      if (actor.id === this.playerId) this.movePlayer(actor, dt); else this.updateAI(actor, dt);
      this.gravity(actor, dt);
      if (actor.moving && actor.grounded && this.time > actor.stepAt) {
        actor.stepAt = this.time + (actor.id === this.playerId && this.keys.has('ShiftLeft') ? .48 : .34);
        const sound = this.spatial(actor.pos); if (sound.volume > .04 && !(actor.id === this.playerId && this.keys.has('ShiftLeft'))) this.audio.foot(sound.volume, sound.pan);
      }
      actor.model.group.position.copy(actor.pos); actor.model.group.rotation.y = actor.yaw;
    }
    this.separateActors();
    this.scene.updateMatrixWorld(true);
    const p = this.player;
    if (p.alive && (this.fireHeld || this.firePressed) && (!this.keys.has('KeyE') || !this.canInteract(p))) {
      const data = WEAPONS[p.inventory[p.slot]!.id];
      if (data.automatic ? this.fireHeld : this.firePressed) this.shoot(p);
    }
    this.firePressed = false;
    this.updateBomb(dt);
    const ts = this.actors.filter(a => a.alive && a.team === 'T').length, cts = this.actors.filter(a => a.alive && a.team === 'CT').length;
    if (!cts) this.endRound('T', '全部防守方已被消灭');
    else if (!ts && this.bomb.state !== 'planted') this.endRound('CT', '全部进攻方已被消灭');
    else if (this.time - this.roundStart >= ROUND_TIME && this.bomb.state !== 'planted') this.endRound('CT', '回合时间耗尽 · 区域已守住');
    this.updateEffects();
  }
  private movePlayer(p: Actor, dt: number) {
    const input = new THREE.Vector3(Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA')), 0, Number(this.keys.has('KeyS')) - Number(this.keys.has('KeyW')));
    p.moving = input.lengthSq() > 0;
    if (p.moving) {
      input.normalize().applyAxisAngle(UP, p.yaw);
      const speed = (this.keys.has('ShiftLeft') ? 2.7 : p.slot === 'melee' ? 6.5 : 5.5) * (this.scoped ? .55 : 1);
      this.map.move(p.pos, input.x * speed * dt, input.z * speed * dt);
    }
    if (this.keys.has('Space') && p.grounded) { p.velocityY = 7; p.grounded = false; }
  }
  private gravity(actor: Actor, dt: number) {
    const oldY = actor.pos.y;
    actor.velocityY -= 18 * dt; actor.pos.y += actor.velocityY * dt;
    if (actor.velocityY > 0 && this.map.collides(actor.pos.x, actor.pos.z, .32, actor.pos.y)) { actor.pos.y = oldY; actor.velocityY = 0; }
    const ground = this.map.support(actor.pos.x, actor.pos.z, oldY);
    if (actor.pos.y <= ground) { actor.pos.y = ground; actor.velocityY = 0; actor.grounded = true; } else actor.grounded = false;
  }
  private separateActors() {
    for (let i = 0; i < this.actors.length; i++) for (let j = i + 1; j < this.actors.length; j++) {
      const a = this.actors[i], b = this.actors[j]; if (!a.alive || !b.alive || Math.abs(a.pos.y - b.pos.y) > 1.6) continue;
      const x = a.pos.x - b.pos.x, z = a.pos.z - b.pos.z, dist = Math.hypot(x, z);
      if (dist > .02 && dist < .65) { const push = (.65 - dist) * .5; this.map.move(a.pos, x / dist * push, z / dist * push); this.map.move(b.pos, -x / dist * push, -z / dist * push); }
    }
  }
  private lineOfSight(a: Actor, b: Actor): boolean {
    const origin = a.pos.clone().add(new THREE.Vector3(0, 1.55, 0)), end = b.pos.clone().add(new THREE.Vector3(0, 1.25, 0));
    const delta = end.sub(origin), distance = delta.length();
    this.ray.set(origin, delta.normalize()); this.ray.far = distance;
    return this.ray.intersectObjects(this.map.solids, false).length === 0;
  }
  private sense() {
    for (const a of this.actors) {
      if (!a.alive) continue;
      let closest: Actor | null = null, best = 68;
      for (const b of this.actors) {
        if (!b.alive || b.team === a.team) continue;
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z, distance = Math.hypot(dx, dz);
        if (distance > best) continue;
        const facing = (-Math.sin(a.yaw) * dx - Math.cos(a.yaw) * dz) / Math.max(.1, distance);
        if (distance > 8 && facing < -.1 && a.lastAttacker !== b.id) continue;
        if (!this.lineOfSight(a, b)) continue;
        if (a.team === this.settings.team) b.lastSeen = this.time;
        closest = b; best = distance;
      }
      if (a.id !== this.playerId) {
        if (closest && a.target !== closest.id) a.reactionAt = this.time + .25 + Math.random() * .32;
        a.target = closest?.id ?? null;
      }
    }
  }
  private updateAI(a: Actor, dt: number) {
    const enemy = a.target !== null ? this.actors[a.target] : null;
    const gun = a.inventory[a.slot]!;
    if (!gun.ammo && !a.reloadUntil) {
      if (gun.reserve) this.reload(a);
      else if (a.slot === 'primary') { a.slot = 'secondary'; this.changeActorWeapon(a); }
      else { a.slot = 'melee'; this.changeActorWeapon(a); }
    }
    let goal: THREE.Vector3 | null = null;
    const isCarrier = this.bomb.state === 'carried' && this.bomb.carrier === a.id;
    const planting = isCarrier && !!siteAt(a.pos);
    const defusing = this.bomb.state === 'planted' && a.team === 'CT' && a.pos.distanceTo(this.bomb.pos) < 2.2;
    a.task = planting ? 'plant' : defusing ? 'defuse' : 'advance';
    if (this.bomb.state === 'dropped' && a.team === 'T') { goal = this.bomb.pos; a.task = 'recover'; }
    else if (this.bomb.state === 'planted') {
      if (a.team === 'CT') { goal = this.bomb.pos; a.task = 'defuse'; }
      else { a.task = 'guard'; goal = this.bomb.pos.clone().add(new THREE.Vector3((a.id % 3 - 1) * 3, 0, 4)); }
    } else {
      if (a.routeIndex < a.route.length && a.pos.distanceTo(a.route[a.routeIndex]) < 2.2) a.routeIndex++;
      if (a.routeIndex >= a.route.length) {
        if (a.team === 'CT') a.routeIndex = 1;
        else if (isCarrier) { goal = SITES[this.round % 2 === 0 ? 'B' : 'A']; }
        else { a.task = 'guard'; goal = a.route[a.route.length - 1]; }
      }
      if (!goal) goal = a.route[Math.min(a.routeIndex, a.route.length - 1)];
    }
    if (planting || defusing) goal = null;
    if (enemy?.alive && !planting && !defusing) {
      a.task = 'engage';
      const delta = enemy.pos.clone().sub(a.pos); a.yaw = Math.atan2(-delta.x, -delta.z);
      a.pitch = Math.atan2(enemy.pos.y - a.pos.y, Math.hypot(delta.x, delta.z));
      if (a.slot === 'melee') goal = delta.length() > 1.7 ? enemy.pos : null;
      else if (delta.length() < 26) goal = null;
      const effectiveRange = a.slot === 'melee' ? 2.1 : a.slot === 'secondary' ? 38 : 90;
      if (delta.length() < effectiveRange && this.time > a.reactionAt && this.time >= a.nextShot && this.lineOfSight(a, enemy)) this.shoot(a, enemy);
    }
    a.moving = false;
    if (goal && a.pos.distanceTo(goal) > .7) {
      if (!a.goal || a.goal.distanceTo(goal) > 1.5 || this.time > a.repathAt || !a.path.length) {
        a.path = this.navigator.find(a.pos, goal); a.goal = goal.clone(); a.repathAt = this.time + 1.5 + a.personality;
      }
      while (a.path.length && a.pos.distanceTo(a.path[0]) < .42) a.path.shift();
      const next = a.path[0];
      if (next) {
        const delta = next.clone().sub(a.pos); delta.y = 0; delta.normalize();
        if (!enemy?.alive) a.yaw = Math.atan2(-delta.x, -delta.z);
        this.map.move(a.pos, delta.x * 4.2 * dt, delta.z * 4.2 * dt); a.moving = true;
        if (a.pos.distanceToSquared(a.oldPos) < .00015) a.stuckTime += dt; else a.stuckTime = 0;
        if (a.stuckTime > .5) { a.path = []; a.repathAt = 0; a.stuckTime = 0; }
      }
    }
    a.oldPos.copy(a.pos);
  }
  private reload(a: Actor) {
    if (!a.alive || a.reloadUntil || this.result) return;
    const gun = a.inventory[a.slot]!, data = WEAPONS[gun.id];
    if (gun.id === 'knife' || gun.ammo >= data.magazine || !gun.reserve) return;
    a.reloadUntil = this.time + data.reload;
    if (a.id === this.playerId) { this.scoped = false; this.audio.reload(); }
  }
  private shoot(a: Actor, target?: Actor) {
    if (a.reloadUntil || this.time < a.nextShot || this.result || this.bomb.actor === a.id && this.bomb.progress > 0) return;
    const gun = a.inventory[a.slot]!, data = WEAPONS[gun.id];
    if (gun.id !== 'knife' && gun.ammo <= 0) {
      if (a.id === this.playerId && this.time > this.emptyAt) { this.emptyAt = this.time + .4; this.audio.scope(); this.reload(a); }
      return;
    }
    if (gun.id !== 'knife') gun.ammo--;
    a.nextShot = this.time + data.interval * (target && !data.automatic ? 1.3 : 1);
    const origin = a.pos.clone().add(new THREE.Vector3(0, 1.55, 0));
    let direction: THREE.Vector3;
    if (target) {
      const aim = target.pos.clone().add(new THREE.Vector3(0, Math.random() < .09 ? 1.65 : 1.12 + Math.random() * .22, 0));
      direction = aim.sub(origin).normalize();
      const inaccuracy = gun.id === 'awp' ? .009 : .012 + (a.moving ? .008 : 0);
      direction.add(new THREE.Vector3((Math.random() - .5) * inaccuracy * 2, (Math.random() - .5) * inaccuracy * 2, (Math.random() - .5) * inaccuracy * 2)).normalize();
    } else {
      const spread = data.spread + a.recoil * .0038 + (a.moving ? .009 : 0) + (gun.id === 'awp' && !this.scoped ? .045 : 0);
      const rotation = new THREE.Euler(a.pitch + (Math.random() - .5) * spread * 2, a.yaw + (Math.random() - .5) * spread * 2, 0, 'YXZ');
      direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation);
      a.pitch = Math.min(1.4, a.pitch + data.recoil); a.yaw += (Math.random() - .5) * data.recoil * .45;
      a.recoil = Math.min(7, a.recoil + (gun.id === 'ak' ? 1.3 : gun.id === 'm4' ? .5 : .8));
      this.flashUntil = this.time + .055;
      if (gun.id === 'awp') this.scoped = false;
    }
    const sound = this.spatial(a.pos); this.audio.shot(gun.id, sound.volume, sound.pan);
    this.ray.set(origin, direction); this.ray.far = data.range;
    const targets: THREE.Object3D[] = [...this.map.solids];
    for (const actor of this.actors) if (actor.alive && actor.id !== a.id) targets.push(...actor.model.hitboxes);
    const first = this.ray.intersectObjects(targets, false)[0];
    const end = first?.point ?? origin.clone().addScaledVector(direction, data.range);
    if (gun.id !== 'knife') this.tracer(origin.clone().addScaledVector(direction, .6), end);
    if (first) {
      const id = first.object.userData.actorId as number | undefined;
      if (id !== undefined && this.actors[id].team !== a.team) {
        const zone = first.object.userData.zone as Zone;
        this.damage(this.actors[id], a, data.damage * HIT_MULTIPLIER[zone], zone, gun.id);
        if (a.id === this.playerId) { this.hitUntil = this.time + .15; this.audio.hit(zone === 'head'); }
      }
      this.impact(end, id !== undefined ? '#c88654' : '#f1d5a0');
    }
  }
  private damage(victim: Actor, source: Actor, amount: number, zone: Zone, weapon: WeaponId) {
    if (!victim.alive) return;
    if (victim.armor > 0 && zone !== 'leg') {
      const absorbed = Math.min(victim.armor, amount * .32); victim.armor -= absorbed; amount -= absorbed;
    }
    victim.hp = Math.max(0, victim.hp - amount); victim.lastAttacker = source.id;
    if (victim.id === this.playerId) this.hurtUntil = this.time + .4;
    if (victim.hp > 0) return;
    victim.alive = false; victim.reloadUntil = 0; victim.moving = false;
    victim.model.group.rotation.z = -Math.PI / 2; victim.model.group.position.y = .28;
    this.stats[source.id].kills++; this.stats[victim.id].deaths++;
    this.feed.unshift({ id: this.feedId++, killer: source.name, victim: victim.name, team: source.team, weapon: WEAPONS[weapon].name, head: zone === 'head', at: this.time });
    this.feed = this.feed.slice(0, 5);
    if (source.id === this.playerId) { this.killCount++; this.audio.kill(); }
    if (victim.id === this.playerId) {
      this.deathCount++; this.scoped = false;
      this.spectatorId = this.actors.find(a => a.alive && a.team === victim.team)?.id ?? null;
    }
    if (this.bomb.carrier === victim.id && this.bomb.state === 'carried') {
      this.bomb.state = 'dropped'; this.bomb.carrier = null; this.bomb.pos.copy(victim.pos);
      this.bomb.pos.y = this.map.support(victim.pos.x, victim.pos.z, victim.pos.y);
      this.bomb.actor = null; this.bomb.progress = 0;
    }
  }
  private canInteract(a: Actor) {
    return (this.bomb.state === 'carried' && this.bomb.carrier === a.id && !!siteAt(a.pos)) || (this.bomb.state === 'planted' && a.team === 'CT' && a.pos.distanceTo(this.bomb.pos) < 2.4);
  }
  private updateBomb(dt: number) {
    const b = this.bomb;
    if (b.state === 'dropped') {
      const pickup = this.actors.find(a => a.alive && a.team === 'T' && a.pos.distanceTo(b.pos) < 1.5);
      if (pickup) {
        b.state = 'carried'; b.carrier = pickup.id;
        const closestSite = pickup.pos.distanceTo(SITES.A) < pickup.pos.distanceTo(SITES.B) ? SITES.A : SITES.B;
        pickup.route = [closestSite.clone()]; pickup.routeIndex = 0; pickup.path = []; pickup.repathAt = 0;
      }
    }
    let interacting: Actor | undefined;
    if (b.state === 'carried' && b.carrier !== null) {
      const carrier = this.actors[b.carrier]; b.pos.copy(carrier.pos);
      if (carrier.alive && siteAt(carrier.pos) && carrier.grounded && !carrier.moving && (carrier.id !== this.playerId || this.keys.has('KeyE'))) interacting = carrier;
    } else if (b.state === 'planted') {
      interacting = this.actors.find(a => a.alive && a.team === 'CT' && a.pos.distanceTo(b.pos) < 2.4 && !a.moving && (a.id !== this.playerId || this.keys.has('KeyE')));
      if (this.time >= b.explodeAt) {
        b.state = 'exploded'; b.actor = null; b.progress = 0; this.audio.explosion(); this.explosion(b.pos); this.endRound('T', 'C4 已引爆 · 目标区域被摧毁'); return;
      }
      if (this.time > b.beepAt) { b.beepAt = this.time + Math.max(.15, (b.explodeAt - this.time) / BOMB_TIME * 1.1); this.audio.beep(); }
    }
    if (interacting) {
      if (b.actor !== interacting.id) { b.actor = interacting.id; b.progress = 0; }
      b.progress += dt / (b.state === 'carried' ? PLANT_TIME : DEFUSE_TIME);
      if (b.progress >= 1) {
        if (b.state === 'carried') {
          b.state = 'planted'; b.site = siteAt(interacting.pos); b.pos.copy(interacting.pos); b.carrier = null; b.explodeAt = this.time + BOMB_TIME; b.beepAt = this.time;
          this.audio.plant(); this.actors.forEach(a => { a.repathAt = 0; a.path = []; });
        } else { b.state = 'defused'; this.audio.defuse(); this.endRound('CT', 'C4 已拆除 · 目标区域安全'); }
        b.actor = null; b.progress = 0;
      }
    } else { b.actor = null; b.progress = 0; }
  }
  private endRound(winner: Team, reason: string) {
    if (this.result) return;
    this.result = { winner, reason }; this.scores[winner]++; this.endAt = this.time + 7;
    this.scoped = false; this.fireHeld = false; this.audio.round(winner === this.settings.team); this.pushSnapshot();
  }
  private spatial(pos: THREE.Vector3) {
    const eye = this.player?.pos ?? this.camera.position;
    const distance = pos.distanceTo(eye);
    const direction = pos.clone().sub(eye).normalize();
    const right = new THREE.Vector3(Math.cos(this.player?.yaw ?? 0), 0, -Math.sin(this.player?.yaw ?? 0));
    return { volume: distance < 1 ? 1 : Math.min(.75, 16 / (distance + 8)), pan: direction.dot(right) * .8 };
  }
  private tracer(start: THREE.Vector3, end: THREE.Vector3) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), new THREE.LineBasicMaterial({ color: '#ffe8b8', transparent: true, opacity: .45 }));
    this.scene.add(line); this.effects.push({ object: line, born: this.time, until: this.time + .055, kind: 'trace' });
  }
  private impact(point: THREE.Vector3, color: string) {
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(.055), new THREE.MeshBasicMaterial({ color })); mesh.position.copy(point);
    this.scene.add(mesh); this.effects.push({ object: mesh, born: this.time, until: this.time + .16, kind: 'impact' });
  }
  private explosion(point: THREE.Vector3) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), new THREE.MeshBasicMaterial({ color: '#ffb450', transparent: true, opacity: .7 })); mesh.position.copy(point);
    this.scene.add(mesh); this.effects.push({ object: mesh, born: this.time, until: this.time + 1.4, kind: 'blast' });
  }
  private updateEffects() {
    this.effects = this.effects.filter(e => {
      if (this.time > e.until) { this.scene.remove(e.object); disposeObject(e.object, true); return false; }
      if (e.kind === 'blast') { e.object.scale.setScalar(1 + (this.time - e.born) * 22); ((e.object as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = .7 * (e.until - this.time) / 1.4; }
      return true;
    });
  }
  private present(dt: number) {
    if (this.mode === 'menu') {
      this.camera.position.set(49 + Math.sin(this.wallTime * .07) * 3, 13, 10);
      this.camera.lookAt(24, 1, -29); this.camera.fov = 64; this.camera.updateProjectionMatrix();
      this.viewModel.visible = false; this.flash.visible = false;
      return;
    }
    const p = this.player;
    let view = p;
    if (!p.alive) {
      if (this.spectatorId === null || !this.actors[this.spectatorId].alive) this.spectatorId = this.actors.find(a => a.alive && a.team === p.team)?.id ?? null;
      if (this.spectatorId !== null) view = this.actors[this.spectatorId];
    }
    if (this.locked && view.moving) this.bob += dt * 11;
    const bob = view.moving && view.grounded ? Math.sin(this.bob * 2) * .025 : 0;
    this.camera.position.copy(view.pos).add(new THREE.Vector3(0, view.alive ? 1.64 + bob : .7, 0));
    this.camera.rotation.set(view.pitch, view.yaw, 0, 'YXZ');
    const desiredFov = this.scoped ? 24 : 80;
    this.camera.fov += (desiredFov - this.camera.fov) * Math.min(1, dt * 15); this.camera.updateProjectionMatrix();
    this.updateViewWeapon(); this.viewModel.visible = p.alive && !this.scoped;
    const reloadProgress = p.reloadUntil ? 1 - (p.reloadUntil - this.time) / WEAPONS[p.inventory[p.slot]!.id].reload : 0;
    const reloadTilt = Math.sin(reloadProgress * Math.PI);
    this.viewModel.position.set(.23 + (p.moving ? Math.sin(this.bob) * .012 : 0), -.23 - reloadTilt * .24 + bob * .45, -.63 + p.recoil * .012);
    this.viewModel.rotation.set(reloadTilt * -.45 + p.recoil * .012, reloadTilt * -.32, reloadTilt * -.65);
    if (p.inventory[p.slot]!.id === 'knife' && this.time < p.nextShot) this.viewModel.rotation.z -= Math.sin((p.nextShot - this.time) / .55 * Math.PI) * .8;
    this.flash.visible = p.alive && this.time < this.flashUntil && !this.scoped && p.slot !== 'melee';
    this.flash.position.set(.23, -.21, this.viewWeapon === 'awp' ? -1.85 : p.slot === 'primary' ? -1.54 : -.94);
    this.flash.rotation.z = Math.random() * Math.PI;
    for (const actor of this.actors) {
      actor.model.group.visible = actor.id !== view.id || !actor.alive;
      if (!actor.alive) continue;
      actor.model.group.position.copy(actor.pos); actor.model.group.rotation.y = actor.yaw;
      const stride = actor.moving ? Math.sin(this.time * 11 + actor.id) * .5 : 0;
      actor.model.legs[0].rotation.x = stride; actor.model.legs[1].rotation.x = -stride;
      actor.model.head.rotation.x = actor.pitch * .6; actor.model.weapon.rotation.x = actor.pitch * .6;
    }
    this.bombModel.visible = this.bomb.state === 'dropped' || this.bomb.state === 'planted' || this.bomb.state === 'defused';
    this.bombModel.position.copy(this.bomb.pos); this.bombModel.position.y += .04;
    this.bombLight.position.copy(this.bomb.pos).y += .5;
    this.bombLight.intensity = this.bomb.state === 'planted' ? (Math.sin(this.time * 9) > .5 ? 3 : .1) : 0;
  }
  private prompt() {
    const p = this.player; if (!p || !p.alive || this.result) return '';
    if (this.bomb.state === 'carried' && this.bomb.carrier === p.id) return siteAt(p.pos) ? '按住 E 安放 C4 · 保持静止' : '你携带 C4 · 前往 A 或 B 点';
    if (this.bomb.state === 'planted' && p.team === 'CT') return p.pos.distanceTo(this.bomb.pos) < 2.4 ? '按住 E 拆除 C4 · 保持静止' : `C4 已安放 · 前往 ${this.bomb.site} 点拆除`;
    if (this.bomb.state === 'dropped' && p.team === 'T') return 'C4 已掉落 · 靠近自动拾取';
    return '';
  }
  private pushSnapshot() {
    if (this.disposed) return;
    const p = this.player, inv = p?.inventory ?? makeInventory('T', true), gun = inv[p?.slot ?? 'secondary']!;
    const reload = p?.reloadUntil ? Math.max(0, 1 - (p.reloadUntil - this.time) / WEAPONS[gun.id].reload) : 0;
    this.onSnapshot({
      mode: this.mode, locked: this.locked, round: this.round, time: this.time, timeLeft: Math.max(0, ROUND_TIME - (this.time - this.roundStart)), scores: { ...this.scores },
      playerId: this.playerId, hp: p?.hp ?? 100, armor: p?.armor ?? 0, weapon: gun.id, inventory: { primary: inv.primary ? { ...inv.primary } : null, secondary: { ...inv.secondary }, melee: { ...inv.melee } },
      ammo: gun.ammo, reserve: gun.reserve, reload, scoped: this.scoped, spread: 5 + (p?.recoil ?? 0) * 3 + (p?.moving ? 6 : 0), hit: this.time < this.hitUntil ? 1 : 0, hurt: this.time < this.hurtUntil ? (this.hurtUntil - this.time) / .4 : 0,
      kills: this.killCount, deaths: this.deathCount, fps: Math.round(this.fps),
      actors: this.actors.map(a => ({ id: a.id, name: a.name, team: a.team, x: a.pos.x, z: a.pos.z, yaw: a.yaw, alive: a.alive, hp: Math.ceil(a.hp), seen: this.time - a.lastSeen < 2.5, ...this.stats[a.id] })),
      feed: this.feed.filter(f => this.time - f.at < 7).map(f => ({ ...f })),
      bomb: { state: this.bomb.state, carrier: this.bomb.carrier, x: this.bomb.pos.x, z: this.bomb.pos.z, site: this.bomb.site, remaining: Math.max(0, this.bomb.explodeAt - this.time), progress: this.bomb.progress, action: this.bomb.actor !== null ? (this.bomb.state === 'carried' ? '正在安放 C4' : '正在拆除 C4') : '' },
      prompt: this.prompt(), location: p ? locationAt(p.pos.x, p.pos.z) : 'DUST II', result: this.result ? { ...this.result } : null,
      nextRound: Math.max(0, this.endAt - this.time), buyAllowed: this.buyAllowed,
    });
  }
  dispose() {
    this.disposed = true; cancelAnimationFrame(this.frameId); this.pause(); this.cleanup.forEach(fn => fn()); this.resizeObserver.disconnect();
    this.audio.dispose(); this.map.disposeCollisionGeometry(); disposeObject(this.viewScene, true); disposeObject(this.scene, true); this.renderer.dispose(); this.renderer.domElement.remove();
  }
}
