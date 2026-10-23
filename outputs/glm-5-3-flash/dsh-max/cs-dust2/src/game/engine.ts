/**
 * engine.ts — the game: scene, render loop, physics tick, round & C4 logic,
 * bullets / damage, spectating, and HUD (React) synchronisation.
 */

import * as THREE from 'three';
import { World } from './world';
import { POINTS, inSite } from './mapdata';
import { Character } from './character';
import { BotBrain } from './bot';
import { buildStaticWorld, buildDoors, StaticWorld } from './render';
import { Effects } from './effects';
import { ViewModel } from './viewmodel';
import { PlayerInput } from './player';
import { MinimapRenderer } from './minimap';
import { Bridge, HudSnapshot, KillEvent, Phase } from './bridge';
import { WEAPONS, WeaponDef, loadoutForRound } from './weapons';
import { audio } from './audio';
import { clamp, rayAABB } from './util';
import { rayHitbox } from './character';

const FREEZE_TIME = 5;
const ROUND_TIME = 115;
const BOMB_TIME = 40;
const OVER_TIME = 5.5;
const PLANT_TIME = 3.2;
const DEFUSE_TIME = 10;
const WIN_ROUNDS = 8;

const T_ROUTES_A = [['long_doors', 'long_hall', 'a_cross'], ['top_mid', 'catwalk', 'short']];
const T_ROUTES_B = [['upper_tunnels', 'b_tunnels', 'b_tunnel_mouth']];
const CT_SPOTS = { A: ['a_hold_1', 'a_hold_2', 'short_hold'], MID: ['mid_ct_hold'], B: ['b_hold_1', 'b_hold_2', 'b_doors'] };

export interface GameOptions {
  canvas: HTMLCanvasElement;
  minimap: HTMLCanvasElement;
  crosshair: HTMLElement | null;
  bridge: Bridge;
  team: 'T' | 'CT';
}

export class Game {
  world = new World();
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  bridge: Bridge;
  opts: GameOptions;

  characters: Character[] = [];
  player!: Character;
  controlled!: Character;
  brains: BotBrain[] = [];

  time = 0;
  phase: Phase = 'freeze';
  phaseEnd = FREEZE_TIME;
  round = 1;
  scoreT = 0;
  scoreCT = 0;
  roundResult: 'T' | 'CT' | null = null;
  roundReason = '';
  tacticSite: 'A' | 'B' = 'A';

  bomb = {
    state: 'none' as 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded' | 'none',
    carrier: null as Character | null,
    x: 0, y: 0, z: 0,
    site: null as 'A' | 'B' | null,
    timer: 0,
    nextBeep: 0,
  };

  killfeed: (KillEvent & { t: number })[] = [];
  message: string | null = null;
  messageSub: string | null = null;
  messageUntil = 0;
  private killId = 1;

  private staticWorld: StaticWorld;
  private effects: Effects;
  private viewModel: ViewModel;
  input: PlayerInput;
  private minimap: MinimapRenderer;
  private bombMesh: THREE.Group;
  private packMesh: THREE.Group;
  private raf = 0;
  private watchdog = 0;
  private lastFrame = 0;
  private hudAccum = 0;
  private fps = 60;
  private shake = 0;
  /** simulation speed (1 = real time); >1 runs several physics steps per frame */
  speed = 1;
  /** disable rendering + minimap for head-less AI simulations */
  renderEnabled = true;
  /** statistics used by the offline simulation tests */
  stats = { plants: 0, defuses: 0, kills: 0, explosions: 0, timeOuts: 0, wipes: 0 };

  routes = new Map<Character, string[]>();
  defence = new Map<Character, string>();
  private specTarget: Character | null = null;

  constructor(opts: GameOptions) {
    this.opts = opts;
    this.bridge = opts.bridge;

    this.renderer = new THREE.WebGLRenderer({ canvas: opts.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(78, 1, 0.06, 700);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    this.staticWorld = buildStaticWorld(this.scene, this.world);
    buildDoors(this.scene, this.world);
    this.effects = new Effects(this.scene);

    this.input = new PlayerInput(opts.canvas);
    this.viewModel = new ViewModel(this.camera);
    this.minimap = new MinimapRenderer(opts.minimap, this.world);

    // ---- C4 model ----
    this.bombMesh = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.26), new THREE.MeshLambertMaterial({ color: 0x2b2b28 }));
    body.position.y = 0.07;
    body.castShadow = true;
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.06), new THREE.MeshBasicMaterial({ color: 0xff2200 }));
    led.position.set(0.1, 0.16, 0);
    const wires = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.03), new THREE.MeshLambertMaterial({ color: 0xaa2222 }));
    wires.position.set(-0.02, 0.15, 0.08);
    this.bombMesh.add(body, led, wires);
    this.bombMesh.visible = false;
    this.bombMesh.userData.led = led;
    this.scene.add(this.bombMesh);

    // ---- C4 carried on the back ----
    this.packMesh = new THREE.Group();
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.36, 0.14), new THREE.MeshLambertMaterial({ color: 0x5a4632 }));
    pack.position.set(0, 0.05, -0.2);
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.06, 0.15), new THREE.MeshLambertMaterial({ color: 0x2e2519 }));
    this.packMesh.add(pack, strap);
    this.packMesh.visible = false;

    this.setupTeams();
    this.startRound(true);
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  /* ================================================================ */
  /* setup / rounds                                                    */
  /* ================================================================ */

  private onResize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private setupTeams() {
    const myTeam = this.opts.team;
    const enemyTeam = myTeam === 'T' ? 'CT' : 'T';
    this.player = new Character(myTeam, 'You');
    this.player.isPlayer = true;
    this.characters.push(this.player);
    for (let i = 0; i < 4; i++) this.characters.push(this.makeBot(myTeam, i));
    for (let i = 0; i < 5; i++) this.characters.push(this.makeBot(enemyTeam, i + 5));
    for (const c of this.characters) this.scene.add(c.humanoid.root);
    this.controlled = this.player;
  }

  private makeBot(team: 'T' | 'CT', i: number): Character {
    const names = team === 'T'
      ? ['Phoenix', 'Viper', 'Blaze', 'Wolf', 'Cobra', 'Ghost']
      : ['Falcon', 'Rex', 'Storm', 'Havoc', 'Dagger', 'Ace'];
    const c = new Character(team, `${names[i % names.length]}`);
    const brain = new BotBrain(c, this);
    c.brain = brain;
    this.brains.push(brain);
    return c;
  }

  private spawnPoint(team: 'T' | 'CT', index: number): { x: number; z: number } {
    const names = team === 'T'
      ? ['t_spawn_1', 't_spawn_2', 't_spawn_3', 't_spawn_4', 't_spawn_2']
      : ['ct_spawn_1', 'ct_spawn_2', 'ct_spawn_3', 'ct_spawn_4', 'ct_spawn_1'];
    const p = POINTS[names[index % names.length]];
    const jit = this.world.randomOpenPoint(p.x, p.z, 5);
    return jit ?? { x: p.x, z: p.z };
  }

  startRound(first = false) {
    this.phase = 'freeze';
    this.phaseEnd = this.time + (first ? FREEZE_TIME + 1.5 : FREEZE_TIME);
    this.roundResult = null;
    this.roundReason = '';
    this.stats.timeOuts += 0;
    this.bomb = { state: 'none', carrier: null, x: 0, y: 0, z: 0, site: null, timer: 0, nextBeep: 0 };
    this.effects.clear();
    this.specTarget = null;
    this.controlled = this.player;
    this.viewModel.setWeapon('');

    // team tactics
    this.tacticSite = Math.random() < 0.5 ? 'A' : 'B';
    const ts = this.characters.filter(c => c.team === 'T');
    const cts = this.characters.filter(c => c.team === 'CT');
    this.routes.clear();
    this.defence.clear();
    const routeSet = this.tacticSite === 'A' ? T_ROUTES_A : T_ROUTES_B;
    ts.forEach((c, i) => this.routes.set(c, routeSet[i % routeSet.length]));
    const ctOrder = ['A', 'A', 'MID', 'B', 'B'];
    cts.forEach((c, i) => {
      const area = ctOrder[i % ctOrder.length];
      const spots = CT_SPOTS[area as 'A' | 'MID' | 'B'];
      this.defence.set(c, spots[i % spots.length]);
    });

    // loadouts & placement
    const botTs = this.characters.filter(c => c.team === 'T' && c.brain);
    const carrier = botTs[Math.floor(Math.random() * botTs.length)];
    let ti = 0, ci = 0;
    for (const c of this.characters) {
      const load = loadoutForRound(c.team, this.round);
      c.giveLoadout(load.primary, load.secondary, load.armor, load.helmet);
      c.hasC4 = false;
      c.health = 100;
      c.alive = true;
      c.deadTime = 0;
      c.busyAction = 'none';
      c.plantProgress = 0;
      c.crouch = false;
      c.crouchAmt = 0;
      c.walk = false;
      c.scoped = false;
      c.vx = c.vy = c.vz = 0;
      c.firing = false;
      c.humanoid.clearFlash();
      const sp = this.spawnPoint(c.team, c.team === 'T' ? ti++ : ci++);
      c.x = sp.x; c.z = sp.z;
      c.y = this.world.groundBaseAt(c.x, c.z) + 0.02;
      c.yaw = c.team === 'T' ? Math.PI * 0.05 : Math.PI;   // face the enemy side
      c.pitch = 0;
      c.humanoid.root.visible = true;
      if (c.brain) {
        c.brain.reset();
        c.brain.holdSpotName = this.defence.get(c) ?? c.brain.holdSpotName;
      }
    }
    for (const b of this.brains) b.paused = false;
    carrier.hasC4 = true;
    this.bomb.state = 'carried';
    this.bomb.carrier = carrier;
    this.bombMesh.visible = false;
    this.packMesh.visible = true;

    this.showMessage(`第 ${this.round} 回合`, this.round === 1 ? '手枪局 — 只有手枪与刀' : (this.opts.team === 'T' ? `进攻 ${this.tacticSite} 点` : '防守 A / B'), 3.2);
    audio.roundStart();
    this.pushHud(true);
  }

  endRound(winner: 'T' | 'CT', reason: string) {
    if (this.phase === 'over' || this.phase === 'matchover') return;
    this.phase = 'over';
    this.phaseEnd = this.time + OVER_TIME;
    this.roundResult = winner;
    this.roundReason = reason;
    if (winner === 'T') this.scoreT++; else this.scoreCT++;
    for (const c of this.characters) { c.busyAction = 'none'; c.firing = false; }
    const weWon = winner === this.opts.team;
    if (weWon) audio.win(); else audio.lose();
    this.showMessage(winner === 'T' ? '恐怖分子获胜' : '反恐精英获胜', reason, 4.5);
    if (this.scoreT >= WIN_ROUNDS || this.scoreCT >= WIN_ROUNDS) {
      this.phase = 'matchover';
    }
    this.pushHud(true);
  }

  restartMatch() {
    this.scoreT = 0;
    this.scoreCT = 0;
    this.round = 1;
    this.startRound(true);
  }

  showMessage(text: string, sub: string | null, dur: number) {
    this.message = text;
    this.messageSub = sub;
    this.messageUntil = this.time + dur;
  }

  /* ================================================================ */
  /* main loop                                                         */
  /* ================================================================ */

  start() {
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.loopFn);
    // watchdog: keeps the simulation alive when rAF is suspended
    // (background tab, head-less browser, occluded window)
    this.watchdog = window.setInterval(this.watchFn, 16);
  }

  private loopFn = (now: number) => {
    this.raf = requestAnimationFrame(this.loopFn);
    let dt = (now - this.lastFrame) / 1000;
    this.lastFrame = now;
    if (dt <= 0) return;
    this.runFrame(dt);
  };

  private watchFn = () => {
    const now = performance.now();
    if (now - this.lastFrame < 90) return;   // rAF is alive
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.runFrame(dt);
  };

  private runFrame(dt: number) {
    if (dt > 0.05) dt = 0.05;
    this.fps = this.fps * 0.92 + (1 / dt) * 0.08;
    const steps = Math.max(1, Math.min(10, Math.round(this.speed)));
    for (let i = 0; i < steps; i++) this.update(dt);
    if (this.renderEnabled) this.renderer.render(this.scene, this.camera);
  }

  stop() {
    cancelAnimationFrame(this.raf);
    clearInterval(this.watchdog);
    window.removeEventListener('resize', this.onResize);
    this.input.dispose();
    this.staticWorld.dispose();
    this.renderer.dispose();
  }

  update(dt: number) {
    this.time += dt;
    const prevPhase = this.phase;

    // phase transitions
    if (this.phase === 'freeze' && this.time >= this.phaseEnd) {
      this.phase = 'live';
      this.phaseEnd = this.time + ROUND_TIME;
      this.showMessage('开始行动', null, 1.6);
    } else if (this.phase === 'live' && this.time >= this.phaseEnd) {
      if (this.bomb.state !== 'planted') this.endRound('CT', '回合时间耗尽');
    } else if ((this.phase === 'over') && this.time >= this.phaseEnd) {
      if (this.phase === 'over') { this.round++; this.startRound(); }
    }

    const frozen = this.phase === 'freeze' || this.phase === 'over' || this.phase === 'matchover';

    this.handlePlayerInput(dt, frozen);

    // bots
    for (const b of this.brains) {
      if (!b.paused) b.update(dt, this.time);
    }

    // characters: physics + shooting
    for (const c of this.characters) {
      if (frozen) { c.moveFwd = 0; c.moveSide = 0; c.firing = false; c.wantJump = false; }
      if (c.alive && !frozen) c.tryFire(this.time, this);
      c.update(dt, this.world, this.time);
      c.syncModel(dt);
    }
    this.separateBodies();

    this.updateActions(dt);
    this.updateBomb(dt);
    this.checkRoundState();

    // carried C4 pack follows its owner
    const carrier = this.characters.find(c => c.hasC4 && c.alive);
    if (carrier && this.packMesh.parent !== carrier.humanoid.body) {
      carrier.humanoid.body.add(this.packMesh);
      this.packMesh.visible = true;
    } else if (!carrier) {
      this.packMesh.visible = false;
    }

    // pickups (dropped bomb)
    if (this.bomb.state === 'dropped') {
      for (const c of this.characters) {
        if (!c.alive || c.team !== 'T') continue;
        if (Math.hypot(c.x - this.bomb.x, c.z - this.bomb.z) < 1.3) {
          this.pickupBomb(c);
          break;
        }
      }
    }

    // spectate handling when the controlled body is dead
    if (!this.controlled.alive) {
      if (this.controlled !== this.player && this.controlled.brain) this.controlled.brain.paused = false;
      this.controlled = this.player;
      this.cycleSpectate(1);
    }

    this.effects.update(dt);
    this.updateCamera(dt);
    if (this.renderEnabled) this.minimap.draw(this);

    // HUD
    this.hudAccum += dt;
    if (this.hudAccum > 0.1 || prevPhase !== this.phase) {
      this.hudAccum = 0;
      this.pushHud();
    }

    if (prevPhase !== this.phase) this.pushHud(true);
  }

  /* ================================================================ */
  /* player input                                                      */
  /* ================================================================ */

  private lastSlot: 'primary' | 'secondary' | 'melee' = 'secondary';

  private handlePlayerInput(dt: number, frozen: boolean) {
    const input = this.input;
    const pressed = input.consumePressed();
    const c = this.controlled;

    if (!c.alive) {
      c.firing = false;
      if (input.consumeFire()) this.cycleSpectate(1);
      if (pressed.has('KeyF')) this.possessSpecTarget();
      if (pressed.has('Space')) this.cycleSpectate(1);
      return;
    }

    // mouse look
    const [dx, dy] = input.consumeMouse();
    this.lookDX = dx; this.lookDY = dy;
    const sensMult = c.scoped && c.weaponDef.scope ? c.weaponDef.scope.sensMult : 1;
    c.yaw -= dx * sensMult;
    c.pitch = clamp(c.pitch - dy * sensMult, -1.45, 1.45);

    if (frozen) { c.moveFwd = 0; c.moveSide = 0; c.firing = false; return; }

    // movement
    const k = input.keys;
    c.moveFwd = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    c.moveSide = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    c.walk = k.has('ShiftLeft') || k.has('ShiftRight');
    c.crouch = k.has('ControlLeft') || k.has('KeyC');
    if (pressed.has('Space')) c.wantJump = true;

    // weapons
    if (pressed.has('Digit1') && c.hasSlot('primary')) { this.lastSlot = c.slot; c.switchSlot('primary', this.time); }
    if (pressed.has('Digit2') && c.hasSlot('secondary')) { this.lastSlot = c.slot; c.switchSlot('secondary', this.time); }
    if (pressed.has('Digit3')) { this.lastSlot = c.slot; c.switchSlot('melee', this.time); }
    if (pressed.has('KeyQ')) { const t = this.lastSlot; this.lastSlot = c.slot; c.switchSlot(t, this.time); }
    const wheel = input.consumeWheel();
    if (wheel !== 0) { this.lastSlot = c.slot; c.nextSlot(wheel > 0 ? 1 : -1, this.time); }
    if (pressed.has('KeyR')) c.startReload(this.time);

    // scope
    const def = c.weaponDef;
    if (input.consumeRmb()) {
      if (def.scope) {
        c.scoped = !c.scoped;
        if (c.scoped) audio.scopeIn(); else audio.scopeOut();
      }
    }
    if (!def.scope && c.scoped) c.scoped = false;
    if (c.slot !== 'primary' && c.scoped) { c.scoped = false; audio.scopeOut(); }

    // plant / defuse with E
    const holdingE = k.has('KeyE');
    if (this.canPlant(c) && holdingE) {
      if (c.busyAction !== 'plant') { c.busyAction = 'plant'; c.plantProgress = 0; }
    } else if (this.canDefuse(c) && holdingE) {
      if (c.busyAction !== 'defuse') { c.busyAction = 'defuse'; c.plantProgress = 0; }
    } else if (!c.brain && c.busyAction !== 'none') {
      c.busyAction = 'none';
      c.plantProgress = 0;
    }

    // fire
    c.firing = input.fireHeld;
    if (input.consumeFire()) c.semiLatch = false;

    // view model bookkeeping
    if (this.viewModel.id !== c.current().id) {
      this.viewModel.setWeapon(c.current().id);
      this.vmDrawStart = this.time;
    }
  }

  private vmDrawStart = -9;
  private lookDX = 0;
  private lookDY = 0;

  /* ================================================================ */
  /* actions: plant / defuse                                           */
  /* ================================================================ */

  canPlant(c: Character): boolean {
    return c.alive && c.team === 'T' && c.hasC4 && this.phase === 'live' && inSite(c.x, c.z) !== null;
  }
  canDefuse(c: Character): boolean {
    return c.alive && c.team === 'CT' && this.bomb.state === 'planted'
      && Math.hypot(c.x - this.bomb.x, c.z - this.bomb.z) < 2.0;
  }
  inSiteOf(c: Character): 'A' | 'B' | null { return inSite(c.x, c.z); }

  private updateActions(dt: number) {
    for (const c of this.characters) {
      if (c.busyAction === 'none' || !c.alive) { if (!c.alive) c.busyAction = 'none'; continue; }
      if (c.busyAction === 'plant') {
        if (!this.canPlant(c)) { c.busyAction = 'none'; c.plantProgress = 0; continue; }
        c.plantProgress += dt / PLANT_TIME;
        if (Math.floor(c.plantProgress * 8) !== Math.floor((c.plantProgress - dt / PLANT_TIME) * 8)) audio.plantBeep();
        if (c.plantProgress >= 1) this.plantBomb(c);
      } else if (c.busyAction === 'defuse') {
        if (!this.canDefuse(c)) { c.busyAction = 'none'; c.plantProgress = 0; continue; }
        const before = c.plantProgress;
        c.plantProgress += dt / DEFUSE_TIME;
        if (Math.floor(c.plantProgress * 6) !== Math.floor(before * 6)) audio.defuseTick();
        if (c.plantProgress >= 1) this.defuseBomb(c);
      }
    }
  }

  private plantBomb(c: Character) {
    this.stats.plants++;
    c.busyAction = 'none';
    c.plantProgress = 0;
    c.hasC4 = false;
    c.crouch = false;
    this.bomb.state = 'planted';
    this.bomb.site = inSite(c.x, c.z);
    this.bomb.x = c.x + Math.sin(c.yaw) * 0.5;
    this.bomb.z = c.z + Math.cos(c.yaw) * 0.5;
    this.bomb.y = this.world.groundBaseAt(this.bomb.x, this.bomb.z);
    this.bomb.timer = BOMB_TIME;
    this.bomb.nextBeep = this.time;
    this.bombMesh.position.set(this.bomb.x, this.bomb.y, this.bomb.z);
    this.bombMesh.visible = true;
    this.phase = 'planted';
    this.phaseEnd = this.time + BOMB_TIME;
    audio.bombPlanted();
    this.showMessage('C4 已安放', `${this.bomb.site} 点 — 40 秒`, 3);
    this.pushHud(true);
  }

  private defuseBomb(c: Character) {
    this.stats.defuses++;
    c.busyAction = 'none';
    c.plantProgress = 0;
    this.bomb.state = 'defused';
    this.bombMesh.visible = false;
    audio.bombDefused();
    this.endRound('CT', 'C4 已被拆除');
  }

  private explodeBomb() {
    this.stats.explosions++;
    this.bomb.state = 'exploded';
    this.bombMesh.visible = false;
    this.effects.explosion(this.bomb.x, this.bomb.y, this.bomb.z);
    audio.explosion(this.bomb.x, this.bomb.z);
    this.shake = 1.2;
    // area damage
    for (const c of this.characters) {
      if (!c.alive) continue;
      const d = Math.hypot(c.x - this.bomb.x, c.z - this.bomb.z);
      if (d < 16) {
        const dmg = 520 * (1 - d / 16);
        if (dmg > 0) c.takeDamage(dmg, 'chest', null, 'ak47', this.time);
      }
    }
    this.endRound('T', 'C4 爆炸');
  }

  private pickupBomb(c: Character) {
    this.bomb.state = 'carried';
    this.bomb.carrier = c;
    c.hasC4 = true;
    this.bombMesh.visible = false;
    audio.draw();
    if (c === this.controlled) this.showMessage('已拾取 C4', null, 1.5);
  }

  private updateBomb(dt: number) {
    const b = this.bomb;
    if (b.state === 'planted') {
      b.timer -= dt;
      const frac = 1 - b.timer / BOMB_TIME;
      if (this.time >= b.nextBeep) {
        audio.bombBeep(b.x, b.z, frac > 0.7);
        b.nextBeep = this.time + Math.max(0.12, 1.0 - frac * 0.88);
      }
      const led = this.bombMesh.userData.led as THREE.Mesh;
      const mat = led.material as THREE.MeshBasicMaterial;
      mat.color.setHex(Math.sin(this.time * (6 + frac * 22)) > 0 ? 0xff2200 : 0x330000);
      if (b.timer <= 0) this.explodeBomb();
    } else if (b.state === 'dropped') {
      this.bombMesh.visible = true;
      this.bombMesh.position.set(b.x, b.y, b.z);
    }
  }

  /* ================================================================ */
  /* bullets & damage                                                  */
  /* ================================================================ */

  fireBullet(shooter: Character, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, def: WeaponDef) {
    const maxT = 400;
    let bestT = maxT;
    let hitChar: Character | null = null;
    let hitRegion: 'head' | 'chest' | 'stomach' | 'arm' | 'leg' = 'chest';

    // world geometry
    for (const b of this.world.colliders) {
      const t = rayAABB(ox, oy, oz, dx, dy, dz, b, bestT);
      if (t !== null && t < bestT) { bestT = t; hitChar = null; }
    }
    // characters (no friendly fire)
    for (const c of this.characters) {
      if (!c.alive || c === shooter || c.team === shooter.team) continue;
      const dc = Math.hypot(c.x - ox, c.z - oz);
      if (dc > Math.min(bestT + 2, 120)) continue;
      for (const hb of c.hitboxes()) {
        const t = rayHitbox(ox, oy, oz, dx, dy, dz, hb, bestT);
        if (t !== null && t < bestT) { bestT = t; hitChar = c; hitRegion = hb.region; }
      }
    }

    const hx = ox + dx * bestT, hy = oy + dy * bestT, hz = oz + dz * bestT;

    // tracer from a point slightly in front of the shooter
    const muzzleY = oy - 0.1;
    this.effects.tracer(
      new THREE.Vector3(ox + dx * 0.7, muzzleY + dy * 0.7, oz + dz * 0.7),
      new THREE.Vector3(hx, hy, hz),
    );

    if (hitChar) {
      const falloff = Math.pow(def.rangeMod, bestT / 10);
      const dmg = def.damage * falloff * def.mult[hitRegion];
      const wasAlive = hitChar.alive;
      const killed = hitChar.takeDamage(dmg, hitRegion, shooter, def.id, this.time);
      this.effects.blood(hx, hy, hz, hitRegion === 'head' || hitRegion === 'chest');
      audio.blood(hx, hz);
      if (shooter === this.controlled) {
        audio.hitConfirm(hitRegion === 'head');
        if (killed && wasAlive) audio.kill();
      }
      if (killed) this.onKill(shooter, hitChar, def, hitRegion === 'head');
      if (hitChar === this.controlled) { audio.hurt(); this.shake = Math.min(0.5, this.shake + dmg * 0.004); }
      if (hitChar.brain && hitChar.brain.target == null) hitChar.brain.lastKnownEnemy = { x: shooter.x, z: shooter.z };
    } else if (bestT < maxT) {
      this.effects.impact(hx, hy, hz);
      audio.bulletImpact(hx, hz);
    }

    // near miss whizz for the local player
    if (shooter !== this.controlled) {
      const px = this.controlled.x - ox, py = this.controlled.eyeY() - oy, pz = this.controlled.z - oz;
      const tProj = px * dx + py * dy + pz * dz;
      if (tProj > 0 && tProj < bestT) {
        const cxp = ox + dx * tProj - this.controlled.x;
        const cyp = oy + dy * tProj - this.controlled.eyeY();
        const czp = oz + dz * tProj - this.controlled.z;
        if (Math.hypot(cxp, cyp, czp) < 1.4) audio.bulletWhizz();
      }
    }
  }

  meleeAttack(c: Character, def: WeaponDef) {
    audio.knifeSwing();
    if (c === this.controlled) this.viewModel.onSwing();
    const [dx, dy, dz] = c.aimDir();
    let best: Character | null = null;
    let bestD = def.melee!.range;
    for (const o of this.characters) {
      if (!o.alive || o === c || o.team === c.team) continue;
      const vx = o.x - c.x, vy = (o.y + 1.2) - c.eyeY(), vz = o.z - c.z;
      const d = Math.hypot(vx, vy, vz);
      if (d > bestD) continue;
      const dot = (vx * dx + vy * dy + vz * dz) / Math.max(0.001, d);
      if (dot < 0.55) continue;
      best = o; bestD = d;
    }
    if (best) {
      const killed = best.takeDamage(def.damage, 'chest', c, def.id, this.time);
      this.effects.blood(best.x, best.y + 1.2, best.z);
      audio.knifeHit(best.x, best.z);
      if (c === this.controlled) { audio.hitConfirm(false); if (killed) audio.kill(); }
      if (killed) this.onKill(c, best, def, false);
      if (best.brain && !best.brain.target) best.brain.lastKnownEnemy = { x: c.x, z: c.z };
    }
  }

  onShotFired(c: Character, def: WeaponDef) {
    if (c === this.controlled) {
      this.viewModel.onShot();
      this.viewModel.flash();
    } else {
      const [dx, dy, dz] = c.aimDir();
      this.effects.muzzle(c.x + dx * 0.7, c.eyeY() - 0.12 + dy * 0.7, c.z + dz * 0.7, def.id === 'awp' ? 1.4 : 1);
    }
    // shooting reveals you on the radar & to nearby bots
    this.markSpotted(c);
    c.spottedAt = this.time;
  }

  private onKill(killer: Character | null, victim: Character, def: WeaponDef, headshot: boolean) {
    victim.hasC4 = false;
    if (this.bomb.state === 'carried' && this.bomb.carrier === victim) {
      // drop the C4
      this.bomb.state = 'dropped';
      this.bomb.carrier = null;
      this.bomb.x = victim.x;
      this.bomb.z = victim.z;
      this.bomb.y = this.world.groundBaseAt(victim.x, victim.z) + 0.02;
      this.bombMesh.position.set(this.bomb.x, this.bomb.y, this.bomb.z);
      this.bombMesh.visible = true;
      this.packMesh.visible = false;
    }
    this.stats.kills++;
    this.killfeed.push({
      id: this.killId++,
      killer: killer ? killer.name : 'C4',
      killerTeam: killer ? killer.team : victim.team === 'T' ? 'CT' : 'T',
      victim: victim.name,
      victimTeam: victim.team,
      weapon: def.name,
      headshot,
      t: this.time,
    });
    if (this.killfeed.length > 6) this.killfeed.shift();
  }

  /* ================================================================ */
  /* vision / helpers used by the AI                                   */
  /* ================================================================ */

  canSee(a: Character, b: Character): boolean {
    if (!b.alive) return false;
    const d = Math.hypot(b.x - a.x, b.z - a.z);
    if (d > 58) return false;
    return this.world.losClear(a.x, a.eyeY(), a.z, b.x, b.eyeY(), b.z);
  }

  markSpotted(c: Character) { c.spottedAt = this.time; }

  nearestTToBomb(): Character | null {
    let best: Character | null = null, bd = Infinity;
    for (const c of this.characters) {
      if (!c.alive || c.team !== 'T' || c.hasC4) continue;
      const d = Math.hypot(c.x - this.bomb.x, c.z - this.bomb.z);
      if (d < bd) { bd = d; best = c; }
    }
    return best;
  }

  nextRouteWaypoint(c: Character): { x: number; z: number } | null {
    const route = this.routes.get(c);
    if (!route) return null;
    for (const name of route) {
      const p = POINTS[name];
      if (Math.hypot(c.x - p.x, c.z - p.z) > 9) return { x: p.x, z: p.z };
    }
    return null;
  }

  assignDefenceSpot(c: Character): string {
    return this.defence.get(c) ?? 'mid_ct_hold';
  }

  private separateBodies() {
    const list = this.characters.filter(c => c.alive);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const dx = b.x - a.x, dz = b.z - a.z;
        const d = Math.hypot(dx, dz);
        if (d > 0.78 || d < 0.0001) continue;
        const push = (0.78 - d) * 0.5;
        const nx = dx / d, nz = dz / d;
        if (this.world.fits(a.x - nx * push, a.z - nz * push, a.y)) { a.x -= nx * push; a.z -= nz * push; }
        if (this.world.fits(b.x + nx * push, b.z + nz * push, b.y)) { b.x += nx * push; b.z += nz * push; }
      }
    }
  }

  private checkRoundState() {
    if (this.phase !== 'live' && this.phase !== 'planted') return;
    const aliveT = this.characters.filter(c => c.team === 'T' && c.alive).length;
    const aliveCT = this.characters.filter(c => c.team === 'CT' && c.alive).length;
    if (aliveCT === 0) { this.stats.wipes++; this.endRound('T', '所有反恐精英被消灭'); }
    else if (aliveT === 0 && this.bomb.state !== 'planted') { this.stats.wipes++; this.endRound('CT', '所有恐怖分子被消灭'); }
  }

  /* ================================================================ */
  /* camera / spectating                                               */
  /* ================================================================ */

  cycleSpectate(dir: number) {
    const mates = this.characters.filter(c => c.team === this.player.team && c.alive && c !== this.player);
    if (!mates.length) { this.specTarget = null; return; }
    let i = this.specTarget ? mates.indexOf(this.specTarget) : -1;
    i = (i + dir + mates.length) % mates.length;
    this.specTarget = mates[i];
    if (this.controlled !== this.player && this.controlled !== this.specTarget && this.controlled.brain) {
      this.controlled.brain.paused = false;
      this.controlled = this.player;
    }
  }

  possessSpecTarget() {
    const t = this.specTarget;
    if (!t || !t.alive) return;
    if (this.controlled.brain) this.controlled.brain.paused = false;
    this.controlled = t;
    if (t.brain) t.brain.paused = true;
    t.scoped = false;
    audio.ui();
  }

  private updateCamera(dt: number) {
    const c = this.controlled;
    const spectating = !c.alive || (c !== this.player && this.player.alive === false);
    let target: Character = c;
    if (!c.alive) {
      target = this.specTarget && this.specTarget.alive ? this.specTarget : c;
      if (!this.specTarget || !this.specTarget.alive) this.cycleSpectate(1);
    }
    const eyeY = target.alive ? target.eyeY() : target.y + 0.4;
    this.camera.position.set(target.x, eyeY, target.z);

    const yaw = target.yaw + target.recoilY * 0.6;
    const pitch = clamp(target.pitch + target.recoilX * 0.8, -1.45, 1.45);
    const cp = Math.cos(pitch);
    const look = new THREE.Vector3(Math.sin(yaw) * cp, Math.sin(pitch), Math.cos(yaw) * cp);
    this.camera.lookAt(this.camera.position.clone().add(look));

    // shake
    if (this.shake > 0.001) {
      this.shake = Math.max(0, this.shake - dt * 2.2);
      const s = this.shake * 0.14;
      this.camera.position.x += (Math.random() - 0.5) * s;
      this.camera.position.y += (Math.random() - 0.5) * s;
      this.camera.position.z += (Math.random() - 0.5) * s;
    }

    // fov / scope
    const def = target.weaponDef;
    const wantFov = target.scoped && def.scope ? def.scope.fov : 78;
    if (Math.abs(this.camera.fov - wantFov) > 0.05) {
      this.camera.fov += (wantFov - this.camera.fov) * Math.min(1, dt * 16);
      this.camera.updateProjectionMatrix();
    }

    // view model follows the *controlled* character
    const vmOn = this.controlled.alive && !target.scoped;
    this.viewModel.root.visible = vmOn;
    if (this.controlled.alive) {
      this.viewModel.update(dt, {
        speed: Math.hypot(this.controlled.vx, this.controlled.vz),
        grounded: this.controlled.grounded,
        scoped: this.controlled.scoped,
        reloadProgress: this.controlled.reloadEnd > 0
          ? clamp((this.time - this.controlled.reloadStart) / Math.max(0.01, this.controlled.reloadEnd - this.controlled.reloadStart), 0, 1)
          : -1,
        drawProgress: clamp((this.time - this.vmDrawStart) / 0.42, 0, 1),
        kick: 0,
        swing: 0,
        swayX: this.lookDX * 0.9,
        swayY: this.lookDY * 0.9,
        crouch: this.controlled.crouchAmt,
      });
    }

    // first person: the body we are inside must not be rendered
    for (const ch of this.characters) {
      ch.humanoid.root.visible = ch.alive ? ch !== target : true;
    }

    // audio listener
    audio.setListener(this.camera.position.x, this.camera.position.y, this.camera.position.z, yaw);

    // crosshair spread (direct DOM write — no React re-render)
    if (this.opts.crosshair) {
      const spread = target.alive && !target.scoped ? target.totalSpread() : 0;
      const gap = 6 + spread * 900;
      this.opts.crosshair.style.setProperty('--gap', `${gap.toFixed(1)}px`);
      this.opts.crosshair.style.opacity = target.scoped ? '0' : '1';
    }
    void spectating;
  }

  /* ================================================================ */
  /* HUD sync                                                          */
  /* ================================================================ */

  pushHud(force = false) {
    void force;
    const c = this.controlled;
    const st = c.current();
    const def = WEAPONS[st.id];
    const now = this.time;
    const timeLeft = Math.max(0,
      this.phase === 'freeze' ? this.phaseEnd - now
        : this.phase === 'planted' ? this.bomb.timer
          : this.phase === 'live' ? this.phaseEnd - now : 0);
    const aliveT = this.characters.filter(x => x.team === 'T' && x.alive).length;
    const aliveCT = this.characters.filter(x => x.team === 'CT' && x.alive).length;

    let prompt: string | null = null;
    if (c.alive) {
      if (this.canPlant(c)) prompt = c.busyAction === 'plant' ? '正在安放 C4…' : '按住 [E] 安放 C4';
      else if (this.canDefuse(c)) prompt = c.busyAction === 'defuse' ? '正在拆除 C4…' : '按住 [E] 拆除 C4';
      else if (this.bomb.state === 'dropped' && c.team === 'T' && Math.hypot(c.x - this.bomb.x, c.z - this.bomb.z) < 6) prompt = '靠近即可拾取 C4';
    }

    const progress = c.busyAction !== 'none' ? clamp(c.plantProgress, 0, 1) : 0;

    const snap: HudSnapshot = {
      phase: this.phase,
      round: this.round,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      timeLeft,
      bombState: this.bomb.state,
      bombSite: this.bomb.site,
      bombTimer: Math.max(0, this.bomb.timer),
      hp: Math.ceil(c.health),
      armor: Math.ceil(c.armor),
      helmet: c.helmet,
      alive: c.alive,
      team: c.team,
      weaponName: def.name,
      weaponSlot: def.slot,
      mag: st.mag,
      reserve: st.reserve,
      reloading: c.reloadEnd > now,
      scoped: c.scoped,
      hasC4: c.hasC4,
      prompt,
      progress,
      progressLabel: c.busyAction === 'plant' ? '安放中' : c.busyAction === 'defuse' ? '拆除中' : null,
      kills: this.player.kills,
      deaths: this.player.deaths,
      aliveT,
      aliveCT,
      killfeed: this.killfeed.filter(k => now - k.t < 7),
      message: now < this.messageUntil ? this.message : null,
      messageSub: now < this.messageUntil ? this.messageSub : null,
      spectating: !this.player.alive
        ? (c !== this.player ? `接管中: ${c.name}` : (this.specTarget ? `观战: ${this.specTarget.name}` : '无存活队友'))
        : null,
      canTakeOver: !!(this.specTarget && this.specTarget.alive && c === this.player),
      players: this.characters.map(x => ({
        name: x.name, team: x.team, kills: x.kills, deaths: x.deaths,
        alive: x.alive, isPlayer: x === this.player, hasC4: x.hasC4, money: x.money,
      })),
      roundResult: this.roundResult,
      roundReason: this.roundReason,
      owned: c === this.player,
      fps: Math.round(this.fps),
    };
    this.bridge.push(snap);
  }
}

