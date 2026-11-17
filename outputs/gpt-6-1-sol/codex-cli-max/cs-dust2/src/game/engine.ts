import * as THREE from 'three';
import type { Actor, Bomb, FeedItem, Phase, Point, Settings, Slot, Snapshot, Team, WeaponId } from './types';
import { World, ROUTES, SPAWNS } from './world';
import { Navigation } from './navigation';
import { BotDirector } from './bots';
import { SynthAudio } from './audio';
import { createBomb, createCharacter, createViewModel, setCharacterWeapon } from './models';
import { calculateDamage, equipped, WEAPONS } from './weapons';
import { angleDelta, clamp, distance, lerp } from './math';
import { EYE_HEIGHT, moveCharacter } from './physics';
import { intersectActor } from './hitboxes';

export const DEFAULT_SETTINGS: Settings = { team: 'CT', pistolOpening: false, primary: 'm4a4', sidearm: 'default', sensitivity: 1, volume: .6 };
const NAMES = ['ROOK', 'VIPER', 'SABLE', 'GHOST', 'NOMAD', 'KESTREL', 'ATLAS', 'ECHO', 'FALCON', 'WOLF'];
interface Effect { object: THREE.Object3D; until: number; velocity?: THREE.Vector3 }

/** Imperative fixed-step simulation + rendering, with immutable 10 Hz snapshots for React. */
export class Engine {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(78, 1, .06, 220);
  readonly renderer: THREE.WebGLRenderer;
  readonly world: World;
  readonly navigation: Navigation;
  readonly audio = new SynthAudio();
  readonly actors: Actor[] = [];
  readonly spotted = new Map<number, number>();
  private lastKnownPositions = new Map<number, Point>();
  readonly bots: BotDirector;
  settings: Settings = { ...DEFAULT_SETTINGS };
  phase: Phase = 'menu';
  time = 0;
  round = 1;
  paused = false;
  started = false;
  attackSite: 'A' | 'B' = 'A';
  bomb: Bomb = { state: 'carried', carrier: 0, x: 0, y: 0, z: -39, site: null, plantedAt: 0, explodeAt: 0, actionActor: null, progress: 0, nextBeep: 0 };
  controlId: number | null = null;
  viewId = 5;
  scoreT = 0;
  scoreCT = 0;
  pistol = false;
  private scoreFeed: FeedItem[] = [];
  private winner: Team | null = null;
  private reason = '';
  private freezeEnd = 3;
  private roundEnd = 118;
  private nextRound = Infinity;
  private scoped = false;
  private hitUntil = 0;
  private hitHead = false;
  private hurtUntil = 0;
  private feedId = 0;
  private input = { keys: new Set<string>(), fire: false, pressed: false };
  private locked = false;
  private interacted = new Set<number>();
  private listeners = new Set<() => void>();
  private snapshot!: Snapshot;
  private frameId = 0;
  private disposed = false;
  private lastFrame = performance.now();
  private accumulator = 0;
  private lastPublish = 0;
  private nextSpot = 0;
  private fps = 60;
  private frameCount = 0;
  private fpsTime = performance.now();
  private lastResolutionChange = 0;
  private lastShadow = -1;
  private softwareRenderer = false;
  private softwareMaterials = new Map<THREE.Material, THREE.MeshBasicMaterial>();
  private softwareGeometry = new WeakSet<THREE.BufferGeometry>();
  private effects: Effect[] = [];
  private flashes = new Map<number, number>();
  private bombMesh = createBomb();
  private viewScene = new THREE.Scene();
  private viewCamera = new THREE.PerspectiveCamera(65, 1, .01, 10);
  private viewModel: ReturnType<typeof createViewModel> | null = null;
  private viewModels = new Map<string, ReturnType<typeof createViewModel>>();
  private currentViewWeapon = '';
  private muzzleLight = new THREE.PointLight(0xffbe65, 0, 6, 2);
  private resizeObserver: ResizeObserver;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    const gl = this.renderer.getContext(), debug = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : '';
    this.softwareRenderer = /swiftshader|llvmpipe|software/i.test(rendererName);
    if (this.softwareRenderer) { this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, .85)); this.renderer.shadowMap.enabled = false; }
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.setAttribute('aria-label', 'Dust II 3D 游戏画面');
    this.renderer.domElement.tabIndex = 0;
    host.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0xc4d2d5); this.scene.fog = new THREE.Fog(0xc4d2d5, 48, 135);
    this.scene.add(new THREE.HemisphereLight(0xe3f0ff, 0xa4916a, 2.25));
    const sun = new THREE.DirectionalLight(0xffedcf, 3.2); sun.position.set(-34, 55, -20); sun.castShadow = true;
    sun.shadow.mapSize.set(this.softwareRenderer ? 1024 : 2048, this.softwareRenderer ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -61, right: 61, top: 61, bottom: -61, near: 1, far: 150 }); sun.shadow.bias = -.00045; sun.shadow.normalBias = .025; this.scene.add(sun);
    this.world = new World(this.scene); this.navigation = new Navigation(this.world); this.bots = new BotDirector(this);
    this.scene.add(this.bombMesh, this.muzzleLight);
    this.viewScene.add(new THREE.HemisphereLight(0xf2f3ed, 0x6c6958, 2.8));
    const viewLight = new THREE.DirectionalLight(0xffe1b2, 3); viewLight.position.set(-3, 6, -2); this.viewScene.add(viewLight);
    this.makeActors(); this.setupRound(); this.phase = 'menu'; this.controlId = null;
    // A small, motionless fireteam provides scale in the briefing's live 3D backdrop.
    for (const [id, x, z, yaw] of [[5, 33, 15, .8], [6, 24.5, 21, -1], [0, 34.5, 3, 2.8]]) {
      const a = this.actors[id]; a.x = x; a.z = z; a.y = this.world.heightAt(x, z); a.yaw = yaw;
    }
    this.optimizeSoftwareMaterials(this.scene);
    this.resizeObserver = new ResizeObserver(this.resize); this.resizeObserver.observe(host); this.resize();
    document.addEventListener('keydown', this.keydown); document.addEventListener('keyup', this.keyup);
    document.addEventListener('mousemove', this.mousemove); document.addEventListener('pointerlockchange', this.pointerlockchange);
    document.addEventListener('pointerlockerror', this.pointerlockerror); window.addEventListener('blur', this.blur);
    this.renderer.domElement.addEventListener('mousedown', this.mousedown); document.addEventListener('mouseup', this.mouseup);
    this.renderer.domElement.addEventListener('contextmenu', this.contextmenu); this.renderer.domElement.addEventListener('wheel', this.wheel, { passive: false });
    this.publish(); this.frameId = requestAnimationFrame(this.frame);
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  getSnapshot = () => this.snapshot;

  start(settings: Settings) {
    this.settings = { ...settings }; this.audio.setVolume(settings.volume); void this.audio.unlock();
    this.scoreT = 0; this.scoreCT = 0; this.round = 1; this.time = 0; this.started = true;
    for (const a of this.actors) { a.kills = 0; a.deaths = 0; }
    this.scoreFeed = []; this.setupRound(); this.resume(); this.publish();
  }
  resume() {
    void this.audio.unlock();
    try { const result = this.renderer.domElement.requestPointerLock(); if (result) void result.catch(() => this.pointerlockerror()); }
    catch { this.pointerlockerror(); }
  }
  pause() { if (document.pointerLockElement) document.exitPointerLock(); this.paused = true; this.clearInput(); this.publish(); }
  updateSettings(settings: Settings) { this.settings = { ...settings }; this.audio.setVolume(settings.volume); }
  restartRound() { this.setupRound(); this.resume(); }
  returnToMenu() {
    this.started = false; this.phase = 'menu'; this.controlId = null; this.paused = false; this.scoped = false;
    this.muzzleLight.intensity = 0; this.camera.fov = 78; this.camera.updateProjectionMatrix(); this.clearEffects(); this.clearInput();
    if (document.pointerLockElement) document.exitPointerLock(); this.publish();
  }
  private pointerlockerror = () => { this.paused = true; this.publish(); };
  private pointerlockchange = () => { this.locked = document.pointerLockElement === this.renderer.domElement; this.paused = this.started && !this.locked; this.clearInput(); this.publish(); };
  private blur = () => { if (this.started) this.pause(); };
  private contextmenu = (event: Event) => event.preventDefault();
  private clearInput() { this.input.keys.clear(); this.input.fire = false; this.input.pressed = false; }
  private keydown = (event: KeyboardEvent) => {
    if (!this.started) return;
    if (['Space', 'Tab', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) event.preventDefault();
    if (!this.locked) return;
    this.input.keys.add(event.code);
    if (event.repeat) return;
    const a = this.controlId === null ? null : this.actors[this.controlId];
    if (event.code === 'KeyE' && this.controlId === null) this.takeOver();
    if (['BracketRight', 'BracketLeft'].includes(event.code) && this.controlId === null) this.cycleSpectator(event.code === 'BracketLeft' ? -1 : 1);
    if (!a?.alive) return;
    if (event.code === 'KeyR') this.reload(a);
    if (event.code === 'Digit1') this.equip(a, 'primary');
    if (event.code === 'Digit2') this.equip(a, 'secondary');
    if (event.code === 'Digit3') this.equip(a, 'melee');
    if (event.code === 'KeyQ') this.equip(a, a.slot === 'primary' ? 'secondary' : a.primary ? 'primary' : 'melee');
    if (event.code === 'Space' && a.grounded && this.phase === 'live') { a.vy = 6.8; a.grounded = false; }
  };
  private keyup = (event: KeyboardEvent) => { this.input.keys.delete(event.code); };
  private mousemove = (event: MouseEvent) => {
    if (!this.locked || this.controlId === null) return;
    const a = this.actors[this.controlId]; if (!a.alive) return;
    const sensitivity = .0021 * this.settings.sensitivity * (this.scoped ? .38 : 1);
    a.yaw -= event.movementX * sensitivity; a.pitch = clamp(a.pitch - event.movementY * sensitivity, -1.4, 1.4);
  };
  private mousedown = (event: MouseEvent) => {
    if (!this.started) return;
    if (!this.locked) { this.resume(); return; }
    if (event.button === 0) { this.input.fire = true; this.input.pressed = true; }
    if (event.button === 2 && this.controlId !== null && equipped(this.actors[this.controlId]) === 'awp' && !this.actors[this.controlId].reloading) { this.scoped = !this.scoped; this.audio.scope(); this.publish(); }
  };
  private mouseup = (event: MouseEvent) => { if (event.button === 0) this.input.fire = false; };
  private wheel = (event: WheelEvent) => {
    if (!this.locked || this.controlId === null) return; event.preventDefault();
    const a = this.actors[this.controlId], slots: Slot[] = a.primary ? ['primary', 'secondary', 'melee'] : ['secondary', 'melee'];
    this.equip(a, slots[(slots.indexOf(a.slot) + (event.deltaY > 0 ? 1 : slots.length - 1)) % slots.length]);
  };

  private makeActors() {
    for (let id = 0; id < 10; id++) {
      const team = id < 5 ? 'T' : 'CT';
      const actor: Actor = {
        id, team, name: NAMES[id], x: 0, y: 0, z: 0, prevX: 0, prevY: 0, prevZ: 0, yaw: 0, pitch: 0, vy: 0, grounded: true,
        hp: 100, armor: 100, alive: true, primary: team === 'T' ? 'ak47' : 'm4a4', secondary: team === 'T' ? 'glock' : 'usp', slot: 'primary', ammo: {},
        nextShot: 0, reloadEnd: 0, reloading: null, bloom: 0, recoil: 0, walk: 0, step: 0, moving: false, kills: 0, deaths: 0, damage: 0,
        state: 'advance', path: [], pathIndex: 0, repathAt: 0, destination: null, route: [], routeIndex: 0, target: null, reactionAt: 0, thinkAt: 0, strafe: 0, actionProgress: 0, lastHurt: -10, lastSeen: -10,
        visual: createCharacter(team, team === 'T' ? 'ak47' : 'm4a4'),
      };
      this.actors.push(actor); this.scene.add(actor.visual.root);
    }
  }
  private setupRound() {
    this.clearEffects();
    this.pistol = this.settings.pistolOpening && this.round === 1;
    this.attackSite = this.round % 2 ? 'A' : 'B';
    const playerId = this.settings.team === 'T' ? 0 : 5;
    this.controlId = playerId; this.viewId = playerId; this.scoped = false; this.winner = null; this.reason = ''; this.spotted.clear(); this.lastKnownPositions.clear();
    this.freezeEnd = this.time + 3; this.roundEnd = this.freezeEnd + 115; this.nextRound = Infinity; this.phase = 'freeze';
    this.hitUntil = 0; this.hurtUntil = 0;
    for (const a of this.actors) {
      const spawn = SPAWNS[a.team], index = a.id % 5;
      a.x = spawn.x + (index - 2) * 1.5; a.z = spawn.z + (index % 2) * 1.8; a.y = this.world.heightAt(a.x, a.z); a.prevX = a.x; a.prevZ = a.z; a.prevY = a.y;
      a.name = a.id === playerId ? 'YOU' : NAMES[a.id];
      a.yaw = a.team === 'T' ? Math.PI : 0; a.pitch = 0; a.vy = 0; a.grounded = true; a.hp = 100; a.armor = this.pistol ? 0 : 100; a.alive = true;
      a.primary = this.pistol ? null : a.id === playerId ? this.settings.primary : index === 3 ? 'awp' : a.team === 'T' ? 'ak47' : 'm4a4';
      a.secondary = !this.pistol && a.id === playerId && this.settings.sidearm === 'deagle' ? 'deagle' : a.team === 'T' ? 'glock' : 'usp';
      a.slot = a.primary ? 'primary' : 'secondary'; a.ammo = {};
      for (const id of [a.primary, a.secondary]) if (id) a.ammo[id] = { mag: WEAPONS[id].magazine, reserve: WEAPONS[id].reserve };
      a.nextShot = this.time; a.reloadEnd = 0; a.reloading = null; a.bloom = 0; a.recoil = 0; a.walk = 0; a.step = 0; a.moving = false;
      a.state = 'advance'; a.path = []; a.pathIndex = 0; a.repathAt = 0; a.destination = null; a.routeIndex = 0; a.target = null; a.reactionAt = 0; a.thinkAt = 0; a.actionProgress = 0; a.lastHurt = -10; a.lastSeen = -10;
      if (a.team === 'T') {
        const keys = this.attackSite === 'A' ? ['long', 'long', 'short', 'short', 'tunnels'] : ['tunnels', 'tunnels', 'mid', 'long', 'tunnels'];
        a.route = ROUTES[keys[index]].map(p => ({ ...p }));
      } else {
        const routes = [[{ x: -15, z: 20 }, { x: -30, z: 13 }], [{ x: 0, z: 12 }, { x: 0, z: 7 }], [{ x: 19, z: 25 }, { x: 27, z: 16 }, { x: 18, z: 7 }], [{ x: 28, z: 25 }, { x: 34, z: 15 }], [{ x: -14, z: 20 }, { x: -24, z: 18 }]];
        a.route = routes[index];
      }
      a.visual.root.rotation.set(0, a.yaw, 0); setCharacterWeapon(a.visual, equipped(a));
      this.optimizeSoftwareMaterials(a.visual.root);
    }
    const carrier = this.actors[0];
    this.bomb = { state: 'carried', carrier: carrier.id, x: carrier.x, y: carrier.y, z: carrier.z, site: null, plantedAt: 0, explodeAt: 0, actionActor: null, progress: 0, nextBeep: 0 };
    this.flashes.clear(); this.clearInput(); this.lastShadow = -1; this.publish();
  }

  equip(a: Actor, slot: Slot) {
    if (slot === 'primary' && !a.primary) return;
    if (a.slot === slot) return;
    a.slot = slot; a.reloading = null; a.reloadEnd = 0; a.bloom = 0;
    if (a.id === this.controlId) { this.scoped = false; this.audio.scope(); }
    setCharacterWeapon(a.visual, equipped(a));
    this.optimizeSoftwareMaterials(a.visual.root);
  }
  reload(a: Actor) {
    const id = equipped(a), w = WEAPONS[id], ammo = a.ammo[id];
    if (!a.alive || a.reloading || !ammo || ammo.mag >= w.magazine || ammo.reserve <= 0) return;
    a.reloading = id; a.reloadEnd = this.time + w.reload;
    if (a.id === this.controlId) this.scoped = false;
    const sound = this.soundAt(a); this.audio.reload(sound.volume * (a.id === this.viewId ? 1 : .45));
  }
  move(a: Actor, velocity: Point, dt: number) {
    moveCharacter(a, velocity, dt, this.world);
    if (a.step > 2.05 && a.grounded) { a.step = 0; const sound = this.soundAt(a); this.audio.step(sound.volume * (a.id === this.viewId ? .6 : .8), sound.pan); }
  }

  shoot(a: Actor, botTarget?: Actor) {
    const id = equipped(a), w = WEAPONS[id], ammo = a.ammo[id];
    if (this.phase !== 'live' || !a.alive || a.reloading || this.time < a.nextShot || a.actionProgress > 0) return;
    if (ammo && ammo.mag <= 0) { if (a.id === this.controlId && this.input.pressed) this.audio.dry(); this.reload(a); return; }
    if (ammo) ammo.mag--;
    a.nextShot = this.time + w.interval * (botTarget ? 1.25 + Math.random() * .35 : 1);
    const origin = new THREE.Vector3(a.x, a.y + EYE_HEIGHT, a.z);
    let direction: THREE.Vector3;
    if (botTarget) {
      const head = Math.random() < .14;
      direction = new THREE.Vector3(botTarget.x + (Math.random() - .5) * .18, botTarget.y + (head ? 1.77 : 1.26), botTarget.z).sub(origin).normalize();
      const error = id === 'awp' ? .009 : .015 + (a.moving ? .009 : 0);
      direction.x += (Math.random() - .5) * error * 2; direction.y += (Math.random() - .5) * error * 1.6; direction.z += (Math.random() - .5) * error * 2; direction.normalize();
      if (Math.random() < .12) a.nextShot += .35;
    } else {
      const spread = (id === 'awp' && this.scoped ? .00055 : w.spread) + a.bloom + (a.moving ? .007 : 0) + (!a.grounded ? .025 : 0);
      const yaw = a.yaw + (Math.random() - .5) * spread * 2, pitch = a.pitch + a.recoil + (Math.random() - .5) * spread * 2;
      direction = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
      a.recoil = Math.min(.28, a.recoil + w.recoil); a.bloom = Math.min(.07, a.bloom + w.recoil * .29);
      if (id === 'awp') this.scoped = false;
    }
    const wallDistance = this.world.raycast(origin, direction, w.range);
    let hit: { actor: Actor; zone: Parameters<typeof calculateDamage>[1]; distance: number } | null = null;
    let nearest = wallDistance;
    // Teammates block bullets without taking damage, preventing shots through their bodies.
    for (const victim of this.actors) {
      if (!victim.alive || victim.id === a.id) continue;
      const result = intersectActor(origin, direction, victim, nearest);
      if (result && result.distance < nearest) { nearest = result.distance; hit = { actor: victim, zone: result.zone, distance: result.distance }; }
    }
    const end = origin.clone().addScaledVector(direction, nearest);
    const sound = this.soundAt(a); this.audio.shot(id, sound.volume, sound.pan); this.flashes.set(a.id, this.time + .055);
    if (id !== 'knife') this.tracer(origin.clone().addScaledVector(direction, .7).add(new THREE.Vector3(0, -.13, 0)), end);
    if (hit && hit.actor.team !== a.team) {
      const amount = calculateDamage(w, hit.zone, hit.actor.armor);
      hit.actor.armor = Math.max(0, hit.actor.armor - amount.armorDamage); hit.actor.hp = Math.max(0, hit.actor.hp - amount.damage); hit.actor.lastHurt = this.time; a.damage += amount.damage;
      this.impact(end, 0xa85339, .14);
      if (a.id === this.controlId) { this.hitUntil = this.time + .18; this.hitHead = hit.zone === 'head'; this.audio.hit(this.hitHead); }
      if (hit.actor.id === this.controlId) this.hurtUntil = this.time + .5;
      if (hit.actor.hp <= 0) this.kill(hit.actor, a, id, hit.zone === 'head');
    } else if (nearest < w.range) this.impact(end, 0xcab895, .1);
  }

  private kill(victim: Actor, killer: Actor | null, weapon: WeaponId | 'c4', headshot = false) {
    if (!victim.alive) return;
    victim.alive = false; victim.hp = 0; victim.deaths++; victim.actionProgress = 0; victim.reloading = null;
    if (killer) killer.kills++;
    this.scoreFeed.unshift({ id: ++this.feedId, killer: killer?.name ?? 'C4', victim: victim.name, team: killer?.team ?? 'T', weapon, headshot, at: this.time, player: killer?.id === this.controlId || victim.id === this.controlId });
    this.scoreFeed = this.scoreFeed.slice(0, 6);
    if (killer?.id === this.controlId) this.audio.kill();
    if (this.bomb.carrier === victim.id) {
      this.bomb.state = 'dropped'; this.bomb.carrier = null; this.bomb.x = victim.x; this.bomb.z = victim.z; this.bomb.y = victim.y; this.bomb.vy = 0; this.bomb.progress = 0; this.bomb.actionActor = null;
    }
    if (victim.id === this.controlId) {
      this.controlId = null; this.scoped = false; this.clearInput();
      const ally = this.actors.find(a => a.team === this.settings.team && a.alive);
      if (ally) this.viewId = ally.id;
    }
  }
  takeOver(id = this.viewId) {
    const a = this.actors[id]; if (!a?.alive || a.team !== this.settings.team) return;
    this.controlId = a.id; this.viewId = a.id; this.scoped = false; this.clearInput(); this.publish();
  }
  private cycleSpectator(direction: number) {
    const living = this.actors.filter(a => a.alive && a.team === this.settings.team);
    if (!living.length) return;
    const at = living.findIndex(a => a.id === this.viewId); this.viewId = living[(at + direction + living.length) % living.length].id; this.publish();
  }

  interact(a: Actor, dt: number) {
    if (!a.alive || !a.grounded || a.moving || a.reloading || this.phase !== 'live') return;
    const b = this.bomb;
    if (b.actionActor !== null && b.actionActor !== a.id && this.interacted.has(b.actionActor)) return;
    if (a.team === 'T' && b.state === 'carried' && b.carrier === a.id && this.world.siteAt(a.x, a.z)) {
      this.interacted.add(a.id); b.actionActor = a.id; a.actionProgress += dt / 3.2; b.progress = a.actionProgress;
      if (a.actionProgress >= 1) {
        b.state = 'planted'; b.carrier = null; b.x = a.x; b.z = a.z; b.y = a.y; b.site = this.world.siteAt(a.x, a.z); b.plantedAt = this.time; b.explodeAt = this.time + 40; b.nextBeep = this.time + .5; b.actionActor = null; b.progress = 0; a.actionProgress = 0; this.audio.plant();
        for (const ct of this.actors.filter(x => x.team === 'CT')) { ct.repathAt = 0; ct.target = null; }
      }
    } else if (a.team === 'CT' && b.state === 'planted' && distance(a, b) < 1.8 && Math.abs(a.y - b.y) < 1.8) {
      this.interacted.add(a.id); b.actionActor = a.id; a.actionProgress += dt / (this.pistol ? 10 : 5); b.progress = a.actionProgress;
      if (a.actionProgress >= 1) { b.state = 'defused'; b.progress = 1; a.actionProgress = 0; this.audio.defuse(); this.finish('CT', 'C4 已成功拆除'); }
    }
  }
  private updateBomb(dt: number) {
    const b = this.bomb;
    for (const a of this.actors) if (!this.interacted.has(a.id)) a.actionProgress = 0;
    if (b.actionActor !== null && !this.interacted.has(b.actionActor)) { b.actionActor = null; b.progress = 0; }
    if (b.carrier !== null) { const a = this.actors[b.carrier]; b.x = a.x; b.z = a.z; b.y = a.y; }
    if (b.state === 'dropped') {
      let ground = this.world.heightAt(b.x, b.z);
      for (const box of this.world.colliders) if (box.maxY <= b.y + .1 && Math.abs(b.x - box.x) < box.w / 2 && Math.abs(b.z - box.z) < box.d / 2) ground = Math.max(ground, box.maxY);
      b.vy = (b.vy ?? 0) - dt * 18; b.y = Math.max(ground, b.y + b.vy * dt); if (b.y <= ground) b.vy = 0;
      const pickup = this.actors.find(a => a.alive && a.team === 'T' && distance(a, b) < 1.25 && Math.abs(a.y - b.y) < 1.8);
      if (pickup) { b.state = 'carried'; b.carrier = pickup.id; pickup.route = ROUTES[this.attackSite === 'A' ? 'long' : 'tunnels'].map(p => ({ ...p })); pickup.routeIndex = pickup.route.length - 1; pickup.repathAt = 0; }
    }
    if (b.state === 'planted') {
      if (this.time >= b.nextBeep) { b.nextBeep = this.time + Math.max(.12, (b.explodeAt - this.time) / 40 * 1.15); this.audio.beep(Math.max(.12, this.soundAt(b).volume)); }
      if (this.time >= b.explodeAt) {
        b.state = 'exploded'; b.progress = 0; this.audio.explosion();
        for (let i = 0; i < 25; i++) {
          const object = new THREE.Mesh(new THREE.IcosahedronGeometry(.3 + Math.random() * .6), new THREE.MeshBasicMaterial({ color: i < 9 ? 0xffbd59 : 0x797666, transparent: true, opacity: .8 }));
          object.position.set(b.x, b.y + .2, b.z); this.scene.add(object); this.effects.push({ object, until: this.time + 2.8, velocity: new THREE.Vector3((Math.random() - .5) * 11, Math.random() * 9, (Math.random() - .5) * 11) });
        }
        for (const a of this.actors) if (a.alive && distance(a, b) < 24) this.kill(a, null, 'c4');
        this.finish('T', 'C4 爆炸 · 目标已摧毁');
      }
    }
  }
  private finish(team: Team, reason: string) {
    if (this.phase !== 'live') return;
    this.phase = 'over'; this.winner = team; this.reason = reason; this.nextRound = this.time + 7;
    if (team === 'T') this.scoreT++; else this.scoreCT++;
    this.audio.win(); this.scoped = false; this.publish();
  }

  private updatePlayer(a: Actor, dt: number) {
    let x = 0, z = 0;
    if (this.input.keys.has('KeyW')) z--;
    if (this.input.keys.has('KeyS')) z++;
    if (this.input.keys.has('KeyA')) x--;
    if (this.input.keys.has('KeyD')) x++;
    const magnitude = Math.hypot(x, z); if (magnitude > 0) { x /= magnitude; z /= magnitude; }
    let speed = WEAPONS[equipped(a)].speed * (this.input.keys.has('ShiftLeft') ? .48 : 1) * (this.scoped ? .52 : 1);
    if (this.input.keys.has('KeyE') && this.bomb.carrier === a.id && this.world.siteAt(a.x, a.z) && magnitude === 0) speed = 0;
    const c = Math.cos(a.yaw), s = Math.sin(a.yaw);
    this.move(a, { x: (x * c + z * s) * speed, z: (z * c - x * s) * speed }, dt);
    if (this.input.keys.has('KeyE')) this.interact(a, dt);
    const w = WEAPONS[equipped(a)];
    if (w.automatic ? this.input.fire : this.input.pressed) this.shoot(a);
    if (this.time > this.nextSpot) {
      this.nextSpot = this.time + .15;
      const eye = new THREE.Vector3(a.x, a.y + EYE_HEIGHT, a.z);
      for (const enemy of this.actors) {
        if (!enemy.alive || enemy.team === a.team || distance(a, enemy) > 65) continue;
        const yaw = Math.atan2(-(enemy.x - a.x), -(enemy.z - a.z));
        if (Math.abs(angleDelta(yaw, a.yaw)) < 1 && this.world.visible(eye, new THREE.Vector3(enemy.x, enemy.y + 1.4, enemy.z))) this.spotEnemy(enemy);
      }
    }
  }
  spotEnemy(enemy: Actor) { this.spotted.set(enemy.id, this.time + 2.4); this.lastKnownPositions.set(enemy.id, { x: enemy.x, z: enemy.z }); }
  private fixedUpdate(dt: number) {
    this.time += dt;
    for (const a of this.actors) {
      a.prevX = a.x; a.prevY = a.y; a.prevZ = a.z; a.moving = false;
      a.recoil *= Math.exp(-5.2 * dt); a.bloom *= Math.exp(-2.8 * dt);
      if (a.reloading && this.time >= a.reloadEnd) {
        const ammo = a.ammo[a.reloading]!, wanted = WEAPONS[a.reloading].magazine - ammo.mag, amount = Math.min(wanted, ammo.reserve);
        ammo.mag += amount; ammo.reserve -= amount; a.reloading = null;
      }
    }
    if (this.phase === 'freeze') { if (this.time >= this.freezeEnd) this.phase = 'live'; this.input.pressed = false; return; }
    if (this.phase === 'over') { if (this.time >= this.nextRound) { this.round++; this.setupRound(); } return; }
    if (this.phase !== 'live') return;
    this.interacted.clear();
    for (const a of this.actors) {
      if (!a.alive) continue;
      if (a.id === this.controlId) this.updatePlayer(a, dt); else this.bots.update(a, dt);
    }
    this.input.pressed = false;
    this.updateBomb(dt);
    if (this.phase !== 'live') return;
    const aliveT = this.actors.some(a => a.team === 'T' && a.alive), aliveCT = this.actors.some(a => a.team === 'CT' && a.alive);
    if (!aliveCT) this.finish('T', '全部反恐精英已被消灭');
    else if (!aliveT && this.bomb.state !== 'planted') this.finish('CT', '全部恐怖分子已被消灭');
    else if (this.time >= this.roundEnd && this.bomb.state !== 'planted') this.finish('CT', '回合时间结束 · 目标已守住');
  }

  private soundAt(point: Point) {
    const viewer = this.actors[this.viewId], d = distance(viewer, point);
    const angle = Math.atan2(point.x - viewer.x, -(point.z - viewer.z)) + viewer.yaw;
    return { volume: d < 1 ? 1 : Math.max(.015, 1 / (1 + (d / 10) ** 1.65)), pan: Math.sin(angle) * .85 };
  }
  private tracer(from: THREE.Vector3, to: THREE.Vector3) {
    if (from.distanceTo(to) > 100) to = from.clone().add(to.sub(from).normalize().multiplyScalar(100));
    const object = new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), new THREE.LineBasicMaterial({ color: 0xffd692, transparent: true, opacity: .7 }));
    this.scene.add(object); this.effects.push({ object, until: this.time + .045 });
  }
  private impact(at: THREE.Vector3, color: number, size: number) {
    const object = new THREE.Mesh(new THREE.OctahedronGeometry(size), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .7 })); object.position.copy(at); this.scene.add(object); this.effects.push({ object, until: this.time + .18 });
  }
  private clearEffects() {
    for (const effect of this.effects) {
      this.scene.remove(effect.object); const mesh = effect.object as THREE.Mesh;
      mesh.geometry?.dispose(); if (mesh.material instanceof THREE.Material) mesh.material.dispose();
    }
    this.effects.length = 0;
  }
  private updateEffects(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      if (this.time >= e.until) { this.scene.remove(e.object); const renderable = e.object as THREE.Mesh; renderable.geometry?.dispose(); if (renderable.material instanceof THREE.Material) renderable.material.dispose(); this.effects.splice(i, 1); continue; }
      if (e.velocity) { e.object.position.addScaledVector(e.velocity, dt); e.velocity.y -= dt * 4; e.object.scale.multiplyScalar(1 + dt * .7); (e.object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>).material.opacity = Math.min(.8, (e.until - this.time) * .35); }
    }
  }
  private optimizeSoftwareMaterials(root: THREE.Object3D) {
    if (!this.softwareRenderer) return;
    // CPU WebGL gets inexpensive, vertex-lit geometry. Hardware keeps PBR lighting.
    const sun = new THREE.Vector3(-.55, .8, -.3).normalize(), normal = new THREE.Vector3();
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshStandardMaterial)) return;
      const source = object.material, geometry = object.geometry;
      if (!this.softwareGeometry.has(geometry)) {
        const normals = geometry.getAttribute('normal'), previous = source.vertexColors ? geometry.getAttribute('color') : null;
        if (normals) {
          const colors = new Float32Array(normals.count * 3);
          for (let i = 0; i < normals.count; i++) {
            normal.fromBufferAttribute(normals, i); const light = .62 + Math.max(0, normal.dot(sun)) * .48;
            colors[i * 3] = (previous?.getX(i) ?? 1) * light;
            colors[i * 3 + 1] = (previous?.getY(i) ?? 1) * light;
            colors[i * 3 + 2] = (previous?.getZ(i) ?? 1) * light;
          }
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        }
        this.softwareGeometry.add(geometry);
      }
      let basic = this.softwareMaterials.get(source);
      if (!basic) { basic = new THREE.MeshBasicMaterial({ color: source.color, vertexColors: true, side: source.side, transparent: source.transparent, opacity: source.opacity }); this.softwareMaterials.set(source, basic); }
      object.material = basic;
    });
  }
  private render(alpha: number, dt: number) {
    if (this.lastShadow < 0 || (this.started && !this.paused && this.time - this.lastShadow > (this.softwareRenderer ? .4 : .1))) { this.renderer.shadowMap.needsUpdate = true; this.lastShadow = this.time; }
    for (const a of this.actors) {
      const v = a.visual; v.root.visible = !this.started || a.id !== this.viewId;
      v.root.position.set(lerp(a.prevX, a.x, alpha), lerp(a.prevY, a.y, alpha), lerp(a.prevZ, a.z, alpha));
      if (!a.alive) { v.root.rotation.set(0, a.yaw, Math.PI / 2); v.root.position.y += .16; v.flash.visible = false; continue; }
      v.root.rotation.set(0, a.yaw, 0);
      const swing = a.moving ? Math.sin(a.walk) * .48 : 0;
      v.leftLeg.rotation.x = swing; v.rightLeg.rotation.x = -swing; v.weapon.rotation.x = a.pitch * .65;
      v.flash.visible = (this.flashes.get(a.id) ?? 0) > this.time;
    }
    this.bombMesh.visible = this.bomb.state === 'dropped' || this.bomb.state === 'planted' || this.bomb.state === 'defused';
    this.bombMesh.position.set(this.bomb.x, this.bomb.y + .02, this.bomb.z);
    this.bombMesh.rotation.set(0, 0, 0);
    if (this.bomb.state === 'carried' && this.bomb.carrier !== null) {
      const carrier = this.actors[this.bomb.carrier];
      this.bombMesh.visible = !this.started || carrier.id !== this.viewId;
      this.bombMesh.position.set(carrier.x + Math.sin(carrier.yaw) * .26, carrier.y + 1.08, carrier.z + Math.cos(carrier.yaw) * .26);
      this.bombMesh.rotation.set(Math.PI / 2, carrier.yaw, 0, 'YXZ');
    }
    const led = this.bombMesh.getObjectByName('led'); if (led) led.visible = this.bomb.state === 'planted' && Math.sin(this.time * 10) > 0;
    if (!this.started) {
      const t = this.reducedMotion ? 0 : performance.now() * .000055;
      this.camera.position.set(36.5 + Math.sin(t) * .8, 7.5, 25.4 + Math.cos(t) * .6); this.camera.lookAt(23, 3.2, -1);
    } else {
      const a = this.actors[this.viewId];
      const bob = a.moving && a.grounded ? Math.sin(a.walk) * .035 : 0;
      this.camera.position.set(lerp(a.prevX, a.x, alpha), lerp(a.prevY, a.y, alpha) + EYE_HEIGHT + bob, lerp(a.prevZ, a.z, alpha));
      this.camera.rotation.set(a.pitch + a.recoil, a.yaw, 0, 'YXZ');
      const fov = this.scoped ? 25 : 78; this.camera.fov = lerp(this.camera.fov, fov, Math.min(1, dt * 15)); this.camera.updateProjectionMatrix();
      const id = equipped(a), cacheKey = `${a.team}/${id}`;
      if (this.currentViewWeapon !== cacheKey) {
        if (this.viewModel) this.viewScene.remove(this.viewModel.root);
        let model = this.viewModels.get(cacheKey); if (!model) { model = createViewModel(id, a.team); this.optimizeSoftwareMaterials(model.root); this.viewModels.set(cacheKey, model); }
        this.viewModel = model; this.viewScene.add(model.root); this.currentViewWeapon = cacheKey;
      }
      if (this.viewModel) {
        const reload = a.reloading ? clamp((a.reloadEnd - this.time) / WEAPONS[a.reloading].reload, 0, 1) : 0;
        const reloadDip = Math.sin((1 - reload) * Math.PI) * (a.reloading ? 1 : 0);
        this.viewModel.root.position.set(.24 + (a.moving ? Math.sin(a.walk * .5) * .011 : 0), -.25 - reloadDip * .22 + bob * .25, -.45 + a.recoil * 1.5);
        this.viewModel.root.rotation.set(a.recoil * .7 - reloadDip * .35, reloadDip * -.25, reloadDip * -.4);
        this.viewModel.flash.visible = (this.flashes.get(a.id) ?? 0) > this.time;
        this.viewModel.root.visible = a.alive && !this.scoped;
        this.muzzleLight.intensity = this.viewModel.flash.visible ? 12 : 0; this.muzzleLight.position.copy(this.camera.position).add(new THREE.Vector3(0, -.25, -.6).applyEuler(this.camera.rotation));
      }
    }
    this.renderer.autoClear = true; this.renderer.render(this.scene, this.camera);
    if (this.started && this.viewModel?.root.visible) { this.renderer.autoClear = false; this.renderer.clearDepth(); this.renderer.render(this.viewScene, this.viewCamera); }
  }
  private frame = (now: number) => {
    if (this.disposed) return;
    const dt = Math.min((now - this.lastFrame) / 1000, .25); this.lastFrame = now;
    if (this.started && !this.paused) {
      this.accumulator += dt;
      while (this.accumulator >= 1 / 60) { this.fixedUpdate(1 / 60); this.accumulator -= 1 / 60; }
      this.updateEffects(dt);
    }
    this.render(this.started && !this.paused ? this.accumulator * 60 : 1, dt);
    this.frameCount++;
    if (now - this.fpsTime > 1000) {
      this.fps = Math.round(this.frameCount * 1000 / (now - this.fpsTime)); this.frameCount = 0; this.fpsTime = now;
      if (this.softwareRenderer && now - this.lastResolutionChange > 1500) {
        const ratio = this.renderer.getPixelRatio();
        const next = this.fps < 26 ? Math.max(.65, ratio * .78) : this.fps > 53 ? Math.min(.85, ratio * 1.08) : ratio;
        if (Math.abs(next - ratio) > .005) { this.renderer.setPixelRatio(next); this.lastResolutionChange = now; }
      }
    }
    if (now - this.lastPublish > 85) { this.publish(); this.lastPublish = now; }
    this.frameId = requestAnimationFrame(this.frame);
  };
  private resize = () => {
    const w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.viewCamera.aspect = w / h; this.viewCamera.updateProjectionMatrix();
  };
  private publish() {
    const a = this.actors[this.viewId]; if (!a) return;
    const id = equipped(a), ammo = a.ammo[id], b = this.bomb;
    let hint = '';
    if (a.alive && this.controlId !== null) {
      if (b.carrier === a.id) hint = this.world.siteAt(a.x, a.z) ? '长按 E 安放 C4 · 保持静止' : '你携带 C4 · 前往 A 或 B 点';
      else if (b.state === 'planted' && a.team === 'CT' && distance(a, b) < 2.3) hint = '长按 E 拆除 C4 · 保持静止';
      else if (b.state === 'dropped' && a.team === 'T' && distance(a, b) < 5) hint = '靠近掉落的 C4 以拾取';
    }
    this.snapshot = {
      phase: this.phase, paused: this.paused, started: this.started, time: this.time, round: this.round,
      timer: Math.max(0, this.phase === 'freeze' ? this.freezeEnd - this.time : this.phase === 'over' ? this.nextRound - this.time : b.state === 'planted' ? b.explodeAt - this.time : this.roundEnd - this.time),
      scoreT: this.scoreT, scoreCT: this.scoreCT, team: this.settings.team, aliveT: this.actors.filter(p => p.alive && p.team === 'T').length, aliveCT: this.actors.filter(p => p.alive && p.team === 'CT').length,
      player: { id: a.id, name: a.name, hp: a.hp, armor: a.armor, x: a.x, z: a.z, yaw: a.yaw, zone: this.world.zoneAt(a.x, a.z), weapon: id, primary: a.primary, secondary: a.secondary, slot: a.slot, mag: ammo?.mag ?? 0, reserve: ammo?.reserve ?? 0, reloading: !!a.reloading, reloadProgress: a.reloading ? 1 - (a.reloadEnd - this.time) / WEAPONS[a.reloading].reload : 0, hasBomb: b.carrier === a.id, scoped: this.scoped, spread: a.bloom * 520 + (a.moving ? 5 : 0) },
      actors: this.actors.map(p => { const known = p.team === this.settings.team ? p : this.lastKnownPositions.get(p.id) ?? p; return { id: p.id, name: p.name, team: p.team, x: known.x, z: known.z, yaw: p.yaw, hp: p.hp, alive: p.alive, visible: p.team === this.settings.team || (this.spotted.get(p.id) ?? 0) > this.time, kills: p.kills, deaths: p.deaths, weapon: equipped(p) }; }),
      feed: [...this.scoreFeed.filter(f => this.time - f.at < 8)], bomb: { ...b }, spectating: this.controlId === null, winner: this.winner, reason: this.reason,
      action: a.actionProgress > 0 ? { label: a.team === 'T' ? '正在安放 C4' : '正在拆除 C4', progress: a.actionProgress } : null,
      hint, hitMarker: Math.max(0, this.hitUntil - this.time), headshot: this.hitHead, hurt: Math.max(0, this.hurtUntil - this.time), fps: this.fps, pistol: this.pistol,
    };
    for (const listener of this.listeners) listener();
  }
  dispose() {
    this.disposed = true; cancelAnimationFrame(this.frameId); this.resizeObserver.disconnect();
    document.removeEventListener('keydown', this.keydown); document.removeEventListener('keyup', this.keyup); document.removeEventListener('mousemove', this.mousemove); document.removeEventListener('pointerlockchange', this.pointerlockchange); document.removeEventListener('pointerlockerror', this.pointerlockerror); window.removeEventListener('blur', this.blur); document.removeEventListener('mouseup', this.mouseup);
    this.renderer.domElement.removeEventListener('mousedown', this.mousedown); this.renderer.domElement.removeEventListener('contextmenu', this.contextmenu); this.renderer.domElement.removeEventListener('wheel', this.wheel);
    if (document.pointerLockElement === this.renderer.domElement) document.exitPointerLock();
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    const collect = (object: THREE.Object3D) => { const mesh = object as THREE.Mesh; if (mesh.geometry) geometries.add(mesh.geometry); if (Array.isArray(mesh.material)) mesh.material.forEach(m => materials.add(m)); else if (mesh.material) materials.add(mesh.material); };
    this.scene.traverse(collect); this.viewScene.traverse(collect); this.viewModels.forEach(m => m.root.traverse(collect));
    this.actors.forEach(a => (a.visual.root.userData.weaponCache as Map<WeaponId, THREE.Group>).forEach(g => g.traverse(collect)));
    this.softwareMaterials.forEach((basic, source) => { materials.add(basic); materials.add(source); });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    this.renderer.dispose(); this.renderer.domElement.remove(); this.audio.dispose(); this.listeners.clear();
  }
}
