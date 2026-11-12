/**
 * Game engine: owns the three.js renderer, the fixed-ish simulation loop, round state machine,
 * combat resolution, C4 logic, player input and the HUD snapshot store consumed by React.
 *
 * Data flow:
 *   requestAnimationFrame → Game.frame(dt)
 *     → input → simulation (agents/AI/physics/bomb/round) → render (WebGL + minimap canvas)
 *     → every ~33ms publish an immutable HudSnapshot → React (useSyncExternalStore)
 *   React → Game only via explicit commands (start, chooseTeam, resume).
 */
import * as THREE from 'three';
import { Agent, EYE } from './agent';
import { BotBrain, type BombInfo, type WorldAPI } from './ai';
import { audio } from './audio';
import { CELL, GameMap, GH, GW, Kind } from './map';
import { buildViewModel, setViewModelWeapon, buildGun, type ViewModel } from './models';
import { GUN_ROUND, Inventory, PISTOL_ROUND, WEAPONS, BUY_MENU, type Slot, type Team, type HitZone } from './weapons';
import { buildWorld, Effects } from './world';

export const FREEZE_TIME = 5;
export const ROUND_TIME = 115;
export const POST_TIME = 6;
export const BOMB_TIME = 40;
export const PLANT_TIME = 3.2;
export const DEFUSE_TIME = 7;
export const WIN_ROUNDS = 8;

export interface KillEntry {
  id: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  t: number;
}

export interface HudSnapshot {
  started: boolean;
  locked: boolean;
  phase: 'freeze' | 'live' | 'post';
  timeLeft: number;
  round: number;
  pistolRound: boolean;
  scoreT: number;
  scoreCT: number;
  playerTeam: Team;
  alive: boolean;
  controlledName: string;
  spectating: string | null;
  canTakeOver: boolean;
  health: number;
  armor: number;
  helmet: boolean;
  weaponName: string;
  weaponId: string;
  slot: Slot;
  slots: { slot: Slot; name: string; key: string }[];
  mag: number;
  reserve: number;
  magSize: number;
  reloading: boolean;
  reloadFrac: number;
  crosshairGap: number;
  scoped: boolean;
  killfeed: KillEntry[];
  aliveT: number;
  aliveCT: number;
  bombState: BombInfo['state'];
  bombSite: 'A' | 'B' | null;
  bombTimeLeft: number;
  hasBomb: boolean;
  inSite: 'A' | 'B' | null;
  actionLabel: string | null;
  actionFrac: number;
  message: string | null;
  messageColor: string;
  hitmarker: number; // timestamp of last hit (performance.now-based)
  hitHead: boolean;
  damageDirs: { angle: number; t: number }[];
  canBuy: boolean;
  matchOver: Team | null;
  scoreboard: { name: string; team: Team; kills: number; deaths: number; alive: boolean; isPlayer: boolean }[];
  showScores: boolean;
  fps: number;
}

const T_NAMES = ['Viper', 'Jackal', 'Cobra', 'Raven'];
const CT_NAMES = ['Falcon', 'Hawk', 'Sentry', 'Warden'];

type Listener = () => void;

export class Game implements WorldAPI {
  // ---- engine
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  vmScene = new THREE.Scene();
  vmCamera: THREE.PerspectiveCamera;
  vm: ViewModel;
  vmTeam: Team = 'CT';
  effects: Effects;
  map = new GameMap();
  container: HTMLElement;
  minimap: HTMLCanvasElement | null = null;
  minimapBg: HTMLCanvasElement | null = null;
  raf = 0;
  lastT = 0;

  // ---- world state
  agents: Agent[] = [];
  me!: Agent; // the human's own agent
  controlled!: Agent; // agent currently driven by input (may be a taken-over bot)
  spectateIdx = 0;
  now = 0;
  phase: 'freeze' | 'live' | 'post' = 'freeze';
  phaseEnd = 0;
  round = 1;
  scoreT = 0;
  scoreCT = 0;
  matchOver: Team | null = null;
  playerTeam: Team = 'CT';
  tPlan: 'A' | 'B' = 'A';
  bomb: BombInfo = { state: 'carried', pos: new THREE.Vector3(), site: null, carrier: null, defuser: null };
  bombExplodeAt = 0;
  plantProgress = 0;
  plantFrameAgent: Agent | null = null;
  plantTouched = false;
  defuseProgress = 0;
  defuseTouched = false;
  nextBeep = 0;
  bombMesh: THREE.Group;
  bombLight: THREE.Mesh;
  started = false;

  // ---- input
  keys = new Set<string>();
  mouseDown = false;
  locked = false;
  punchPitch = 0;
  punchYaw = 0;
  vmKick = 0;
  vmSwitch = 0;
  fov = 75;
  showScores = false;

  // ---- HUD
  killfeed: KillEntry[] = [];
  killId = 0;
  message: string | null = null;
  messageColor = '#fff';
  messageUntil = 0;
  hitmarker = 0;
  hitHead = false;
  damageDirs: { angle: number; t: number }[] = [];
  private listeners = new Set<Listener>();
  private snapshot: HudSnapshot;
  private hudTimer = 0;
  private fpsAcc = 0;
  private fpsFrames = 0;
  private fps = 0;
  private lastPlayerSpot = 0;
  private flashUntil = new Map<Agent, number>();
  private flashMeshes = new Map<Agent, THREE.Mesh>();

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(this.fov, aspect, 0.05, 400);
    this.vmCamera = new THREE.PerspectiveCamera(62, aspect, 0.01, 10);
    this.vmScene.add(new THREE.HemisphereLight(0xffffff, 0x8a7350, 1.6));
    const vmSun = new THREE.DirectionalLight(0xfff1d6, 1.6);
    vmSun.position.set(1, 2, 1);
    this.vmScene.add(vmSun);
    this.vm = buildViewModel('CT');
    this.vmScene.add(this.vm.root);

    buildWorld(this.scene, this.map);
    this.effects = new Effects(this.scene);

    // C4 model
    this.bombMesh = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.22), new THREE.MeshStandardMaterial({ color: 0x4b4a32 }));
    body.position.y = 0.06;
    body.castShadow = true;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.1), new THREE.MeshStandardMaterial({ color: 0x1c2a1c }));
    panel.position.set(0.04, 0.13, 0);
    this.bombLight = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
    this.bombLight.position.set(-0.1, 0.14, 0.05);
    for (let i = 0; i < 3; i++) {
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0xb06b30 }));
      stick.rotation.z = Math.PI / 2;
      stick.position.set(0, 0.06, -0.07 + i * 0.07);
      this.bombMesh.add(stick);
    }
    this.bombMesh.add(body, panel, this.bombLight);
    this.bombMesh.visible = false;
    this.scene.add(this.bombMesh);

    this.snapshot = this.buildSnapshot();
    this.bindInput();
    window.addEventListener('resize', this.onResize);
    this.raf = requestAnimationFrame(this.loop);
  }

  // ================================================================ public API (React → Game)

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  getSnapshot = () => this.snapshot;

  setMinimapCanvas(c: HTMLCanvasElement | null) {
    this.minimap = c;
    if (c && !this.minimapBg) this.minimapBg = this.renderMinimapBg(c.width, c.height);
  }

  startMatch(team: Team) {
    audio.init();
    this.playerTeam = team;
    // remove old agents
    for (const a of this.agents) this.scene.remove(a.rig.root);
    this.agents = [];
    this.flashMeshes.clear();
    this.me = new Agent('你', team);
    this.me.isPlayer = true;
    this.me.brain = new BotBrain(this.me);
    this.agents.push(this.me);
    const mates = team === 'T' ? T_NAMES : CT_NAMES;
    const foes = team === 'T' ? CT_NAMES : T_NAMES;
    const foeNames = [...foes, team === 'T' ? 'Bastion' : 'Mamba'];
    for (const n of mates) this.addBot(n, team);
    for (const n of foeNames) this.addBot(n, team === 'T' ? 'CT' : 'T');
    for (const a of this.agents) this.scene.add(a.rig.root);
    this.vmScene.remove(this.vm.root);
    this.vm = buildViewModel(team);
    this.vmTeam = team;
    this.vmScene.add(this.vm.root);
    this.round = 1;
    this.scoreT = this.scoreCT = 0;
    this.matchOver = null;
    this.killfeed = [];
    this.started = true;
    this.startRound();
    this.requestLock();
  }

  requestLock() {
    audio.init();
    const el = this.renderer.domElement;
    // pointer lock can throw if requested too quickly after exit; ignore failures
    try {
      const p = el.requestPointerLock() as unknown as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* noop */
    }
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.unbindInput();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ================================================================ setup helpers

  private addBot(name: string, team: Team) {
    const a = new Agent(name, team);
    a.brain = new BotBrain(a);
    this.agents.push(a);
  }

  private flashFor(a: Agent) {
    let m = this.flashMeshes.get(a);
    if (!m) {
      m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffd27a }));
      m.visible = false;
      a.rig.gunMount.add(m);
      this.flashMeshes.set(a, m);
    }
    return m;
  }

  private startRound() {
    const pistol = this.round === 1;
    this.phase = 'freeze';
    this.phaseEnd = this.now + FREEZE_TIME;
    this.effects.clear();
    this.tPlan = Math.random() < 0.5 ? 'A' : 'B';
    this.bomb = { state: 'carried', pos: new THREE.Vector3(), site: null, carrier: null, defuser: null };
    this.plantProgress = this.defuseProgress = 0;
    this.bombMesh.visible = false;
    this.punchPitch = this.punchYaw = 0;
    this.fov = 75;

    const ts = this.agents.filter((a) => a.team === 'T');
    const cts = this.agents.filter((a) => a.team === 'CT');
    const place = (list: Agent[], spawns: { x: number; z: number }[], yaw: number) =>
      list.forEach((a, i) => {
        const s = spawns[i % spawns.length];
        a.reset(s.x, s.z, yaw);
        a.isPlayer = a === this.me;
        a.brain?.resetRound();
      });
    place(ts, this.map.tSpawns, 0); // facing -Z (north, toward CT side)
    place(cts, this.map.ctSpawns, Math.PI); // facing +Z
    this.controlled = this.me;
    this.me.isPlayer = true;

    // loadouts
    const awpT = pistol ? null : ts.filter((a) => a !== this.me)[(Math.random() * 4) | 0];
    const awpCT = pistol ? null : cts.filter((a) => a !== this.me)[(Math.random() * 4) | 0];
    for (const a of this.agents) {
      const cfg = pistol ? PISTOL_ROUND[a.team] : GUN_ROUND[a.team];
      a.inv = new Inventory();
      a.inv.give('knife');
      a.inv.give(cfg.secondary);
      if (cfg.primary) a.inv.give(a === awpT || a === awpCT ? 'awp' : cfg.primary);
      a.armor = cfg.armor;
      a.helmet = cfg.helmet;
      a.inv.current = a.inv.best();
      a.setWeaponModel();
      this.flashFor(a);
    }

    // bomb to a random T (bots prefer giving it to a bot unless player is T: 50%)
    const carrier = ts[(Math.random() * ts.length) | 0];
    carrier.hasBomb = true;
    this.bomb.carrier = carrier;

    this.assignRoutes(ts, cts);
    this.showMessage(pistol ? '手枪局 — 只有默认手枪' : `第 ${this.round} 回合`, '#ffd34d', 3);
    audio.roundStart();
  }

  private assignRoutes(ts: Agent[], cts: Agent[]) {
    const P = this.map.points;
    const jitter = (p: { x: number; z: number }) => this.map.randomWalkableNear(p, 1);
    const tBots = ts.filter((a) => a.brain);
    const carrier = this.bomb.carrier!;
    // T routes based on plan
    const routesA = [
      [P.outsideLong, P.longMid, P.longCorner, P.siteA],
      [P.outsideLong, P.longMid, P.longCorner, P.holdA2],
      [P.midDoors, P.catwalk, P.holdA1],
      [P.outsideLong, P.longMid, P.longCorner, P.holdA3],
      [P.midDoors, P.midTop],
    ];
    const routesB = [
      [P.tunnel, P.tunnelExit, P.siteB],
      [P.tunnel, P.tunnelExit, P.holdB1],
      [P.tunnel, P.tunnelExit, P.holdB2],
      [P.midDoors, P.lowerTunnel, P.tunnelExit, P.holdB3],
      [P.midDoors, P.midTop],
    ];
    const routes = this.tPlan === 'A' ? routesA : routesB;
    let i = 0;
    for (const a of tBots) {
      const r = a === carrier ? routes[0] : routes[(i++ % (routes.length - 1)) + 1];
      a.brain!.mapRef = this.map;
      a.brain!.setRoute(r.map(jitter));
    }
    // CT setups: 2 A, 1 mid, 2 B
    const ctRoutes = [[P.holdA1], [P.holdB1], [P.holdMid], [P.holdA2], [P.holdB2]];
    cts.forEach((a, k) => {
      a.brain!.mapRef = this.map;
      a.brain!.setRoute(ctRoutes[k % ctRoutes.length].map(jitter));
    });
  }

  private showMessage(text: string, color: string, dur: number) {
    this.message = text;
    this.messageColor = color;
    this.messageUntil = this.now + dur;
  }

  // ================================================================ WorldAPI (also used by player)

  switchWeapon(a: Agent, slot: Slot) {
    if (a.inv.select(slot, this.now)) {
      a.scoped = false;
      a.setWeaponModel();
      if (a === this.controlled) {
        audio.switchWeapon();
        this.vmSwitch = 1;
      }
    }
  }

  reload(a: Agent) {
    if (a.inv.weapon.startReload(this.now)) {
      a.scoped = false;
      audio.reload(a === this.controlled ? undefined : a.pos);
    }
  }

  tryFire(a: Agent): boolean {
    if (!a.alive || this.phase === 'freeze') return false;
    const w = a.inv.weapon;
    if (this.now < a.inv.switchUntil) return false;
    if (!w.canFire(this.now)) {
      if (w.def.slot !== 'melee' && w.mag === 0 && !w.reloading && this.now >= w.nextFire) {
        if (a === this.controlled) audio.dryFire();
        w.nextFire = this.now + 0.25;
        this.reload(a);
      }
      return false;
    }
    const isMe = a === this.controlled;
    const spread = w.currentSpread(a.moveFrac, !a.onGround, a.scoped);
    w.onFire(this.now);
    audio.shot(w.def.sound, isMe ? undefined : a.pos);

    // aim direction (player includes view punch)
    const pitch = a.pitch + (isMe ? this.punchPitch : 0);
    const yaw = a.yaw + (isMe ? this.punchYaw : 0);
    const cp = Math.cos(pitch);
    const dir = new THREE.Vector3(-Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp);
    // random cone
    if (spread > 0) {
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const up = new THREE.Vector3().crossVectors(right, dir).normalize();
      const r = Math.sqrt(Math.random()) * spread;
      const th = Math.random() * Math.PI * 2;
      dir.addScaledVector(right, Math.cos(th) * r).addScaledVector(up, Math.sin(th) * r).normalize();
    }
    const origin = a.eye;

    // recoil (player)
    if (isMe) {
      const n = w.shotsInSpray;
      const climb = w.def.recoilPitch * (n < 8 ? 1 + n * 0.08 : 1.2);
      this.punchPitch += climb;
      const side = n > 4 ? (Math.sin(n * 0.7) > 0 ? 1 : -1) : Math.random() - 0.5;
      this.punchYaw += side * w.def.recoilYaw * (n > 4 ? 1.4 : 0.6);
      this.vmKick = Math.min(1, this.vmKick + (w.def.id === 'awp' || w.def.id === 'deagle' ? 1 : 0.55));
      this.vm.flash.visible = w.def.slot !== 'melee';
      this.vm.flash.rotation.z = Math.random() * Math.PI;
      this.vm.flashLight.intensity = w.def.slot !== 'melee' ? 3 : 0;
      if (w.def.scope) {
        a.scoped = false;
      }
    } else if (w.def.slot !== 'melee') {
      const fm = this.flashFor(a);
      fm.position.set(0, 0.06, -0.8 * (w.def.slot === 'primary' ? 1 : 0.3));
      fm.visible = true;
      this.flashUntil.set(a, this.now + 0.05);
    }

    // world hit
    const range = w.def.reach ?? w.def.range;
    const tWorld = this.map.raycast(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, range);
    // agent hits
    let best: { a: Agent; t: number; zone: HitZone } | null = null;
    for (const o of this.agents) {
      if (o === a || !o.alive) continue;
      const h = o.rayHit(origin, dir, Math.min(range, tWorld));
      if (h && (!best || h.t < best.t)) best = { a: o, t: h.t, zone: h.zone };
    }
    const endT = best ? best.t : Math.min(tWorld, range);
    const hitPoint = origin.clone().addScaledVector(dir, endT);

    if (w.def.slot !== 'melee') {
      // tracer from (approx) muzzle
      if (Math.random() < (isMe ? 0.5 : 0.7)) {
        const right = new THREE.Vector3(Math.cos(a.yaw), 0, -Math.sin(a.yaw));
        const muzzle = origin.clone().addScaledVector(right, 0.15).add(new THREE.Vector3(0, -0.12, 0)).addScaledVector(dir, 0.6);
        this.effects.tracer(muzzle, hitPoint);
      }
      if (!best && tWorld < range) this.effects.impact(hitPoint.clone().addScaledVector(dir, -0.03));
    } else if (isMe) this.vmKick = 1;

    if (best) {
      if (best.a.team !== a.team) {
        this.applyDamage(best.a, a, w.def.id, best.zone, best.t);
      }
      this.effects.blood(hitPoint);
    }

    // sound propagation: bots hear gunshots
    if (w.def.slot !== 'melee')
      for (const o of this.agents)
        if (o.alive && o.brain && o.team !== a.team && o.pos.distanceTo(a.pos) < 50) o.brain.hear({ x: a.pos.x, z: a.pos.z }, this.now);
    // firing reveals on radar
    if (w.def.slot !== 'melee' && w.def.id !== 'usp') a.spottedUntil = Math.max(a.spottedUntil, this.now + 0.4);
    return true;
  }

  private applyDamage(victim: Agent, attacker: Agent | null, weaponId: string, zone: HitZone, dist: number) {
    const def = WEAPONS[weaponId];
    const [hp, ap] = Inventory.computeDamage(def, zone, dist, victim.armor, victim.helmet);
    this.damageAgent(victim, attacker, hp, ap, weaponId, zone === 'head');
  }

  private damageAgent(victim: Agent, attacker: Agent | null, hp: number, ap: number, weaponId: string, headshot: boolean) {
    if (!victim.alive) return;
    victim.health -= hp;
    victim.armor = Math.max(0, victim.armor - ap);
    victim.lastDamagedBy = attacker;
    if (attacker === this.controlled) {
      this.hitmarker = performance.now();
      this.hitHead = headshot;
      audio.hit(headshot);
    }
    if (victim === this.controlled) {
      audio.hurt();
      if (attacker) {
        const ang = Math.atan2(-(attacker.pos.x - victim.pos.x), -(attacker.pos.z - victim.pos.z)) - victim.yaw;
        this.damageDirs.push({ angle: ang, t: performance.now() });
      }
      this.punchPitch += 0.01;
    }
    if (victim.brain && attacker) victim.brain.hear({ x: attacker.pos.x, z: attacker.pos.z }, this.now, attacker);
    if (victim.health <= 0) this.killAgent(victim, attacker, weaponId, headshot);
  }

  private killAgent(victim: Agent, killer: Agent | null, weaponId: string, headshot: boolean) {
    victim.health = 0;
    victim.alive = false;
    victim.deathTime = this.now;
    victim.deaths++;
    victim.scoped = false;
    if (killer && killer !== victim) killer.kills++;
    this.killfeed.push({
      id: ++this.killId,
      killer: killer ? killer.name : '',
      killerTeam: killer ? killer.team : victim.team,
      victim: victim.name,
      victimTeam: victim.team,
      weapon: weaponId === 'c4' ? 'C4' : WEAPONS[weaponId]?.name ?? weaponId,
      headshot,
      t: this.now,
    });
    if (this.killfeed.length > 6) this.killfeed.shift();
    if (killer === this.controlled && victim.team !== killer.team) audio.kill();
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bomb.state = 'dropped';
      this.bomb.carrier = null;
      this.bomb.pos.set(victim.pos.x, victim.pos.y, victim.pos.z);
      if (this.playerTeam === 'T') this.showMessage('炸弹已掉落！', '#ff9f43', 2);
    }
    if (this.bomb.defuser === victim) {
      this.bomb.defuser = null;
      this.defuseProgress = 0;
    }
    if (victim === this.controlled) {
      this.spectateIdx = 0;
      this.showMessage(killer ? `你被 ${killer.name} 击杀（${WEAPONS[weaponId]?.name ?? weaponId}）` : '你阵亡了', '#ff6b6b', 3);
    }
  }

  actPlant(a: Agent, dt: number): boolean {
    if (this.phase !== 'live' || !a.alive || !a.hasBomb || !a.onGround) return false;
    const site = this.map.siteAt(a.pos.x, a.pos.z);
    if (!site) return false;
    if (this.plantFrameAgent !== a) {
      this.plantFrameAgent = a;
      this.plantProgress = 0;
    }
    this.plantTouched = true;
    const before = this.plantProgress;
    this.plantProgress += dt;
    if (Math.floor(before * 3) !== Math.floor(this.plantProgress * 3) && a === this.controlled) audio.plantTick();
    if (this.plantProgress >= PLANT_TIME) {
      a.hasBomb = false;
      this.bomb.state = 'planted';
      this.bomb.carrier = null;
      this.bomb.site = site;
      this.bomb.pos.set(a.pos.x, a.pos.y, a.pos.z);
      this.bombExplodeAt = this.now + BOMB_TIME;
      this.nextBeep = this.now;
      this.plantProgress = 0;
      this.plantFrameAgent = null;
      audio.planted();
      this.showMessage(`炸弹已安放在 ${site} 点！`, '#ff5252', 3);
      for (const o of this.agents) if (o.brain && o.team === 'CT' && !o.isPlayer && o.brain.state !== 'ENGAGE') o.brain.state = 'IDLE';
      return false;
    }
    return true;
  }

  actDefuse(a: Agent, dt: number): boolean {
    if (this.phase !== 'live' || !a.alive || a.team !== 'CT' || this.bomb.state !== 'planted') return false;
    const d = Math.hypot(a.pos.x - this.bomb.pos.x, a.pos.z - this.bomb.pos.z);
    if (d > 1.6) return false;
    if (this.bomb.defuser && this.bomb.defuser !== a && this.bomb.defuser.alive) return false;
    if (this.bomb.defuser !== a) {
      this.bomb.defuser = a;
      this.defuseProgress = 0;
    }
    this.defuseTouched = true;
    const before = this.defuseProgress;
    this.defuseProgress += dt;
    if (Math.floor(before * 2) !== Math.floor(this.defuseProgress * 2)) {
      if (a === this.controlled || a.pos.distanceTo(this.controlled.pos) < 20) audio.defuseTick();
    }
    if (this.defuseProgress >= DEFUSE_TIME) {
      this.bomb.state = 'defused';
      this.bomb.defuser = null;
      audio.defused();
      this.killfeed.push({
        id: ++this.killId, killer: a.name, killerTeam: 'CT', victim: 'C4', victimTeam: 'T', weapon: '拆除', headshot: false, t: this.now,
      });
      this.endRound('CT', '炸弹已被拆除 — 反恐精英胜利');
      return false;
    }
    return true;
  }

  // ================================================================ round logic

  private updateRound() {
    if (this.phase === 'freeze') {
      if (this.now >= this.phaseEnd) {
        this.phase = 'live';
        this.phaseEnd = this.now + ROUND_TIME;
        this.showMessage('开始行动！', '#7bed9f', 1.5);
      }
      return;
    }
    if (this.phase === 'post') {
      if (this.now >= this.phaseEnd && !this.matchOver) {
        this.round++;
        this.startRound();
      }
      return;
    }
    // live
    const aliveT = this.agents.some((a) => a.alive && a.team === 'T');
    const aliveCT = this.agents.some((a) => a.alive && a.team === 'CT');
    if (this.bomb.state === 'planted') {
      if (this.now >= this.bombExplodeAt) {
        this.explodeBomb();
        return;
      }
      if (!aliveCT) return this.endRound('T', '反恐精英全灭 — 恐怖分子胜利');
      // beeps
      if (this.now >= this.nextBeep) {
        const left = this.bombExplodeAt - this.now;
        const urg = 1 - left / BOMB_TIME;
        audio.bombBeep(this.bomb.pos, urg);
        this.nextBeep = this.now + Math.max(0.12, 1.0 - urg * 0.9);
      }
    } else {
      if (!aliveCT) return this.endRound('T', '反恐精英全灭 — 恐怖分子胜利');
      if (!aliveT) return this.endRound('CT', '恐怖分子全灭 — 反恐精英胜利');
      if (this.now >= this.phaseEnd) return this.endRound('CT', '时间耗尽 — 反恐精英胜利');
    }
  }

  private explodeBomb() {
    this.bomb.state = 'exploded';
    audio.explosion(this.bomb.pos);
    this.effects.explosion(this.bomb.pos);
    this.bombMesh.visible = false;
    for (const a of this.agents) {
      if (!a.alive) continue;
      const d = a.pos.distanceTo(this.bomb.pos);
      const dmg = Math.round(Math.max(0, 260 * (1 - d / 24)));
      if (dmg > 0) this.damageAgent(a, null, dmg, 0, 'c4', false);
    }
    this.punchPitch += 0.08;
    this.endRound('T', 'C4 已爆炸 — 恐怖分子胜利');
  }

  private endRound(winner: Team, text: string) {
    if (this.phase === 'post') return;
    this.phase = 'post';
    this.phaseEnd = this.now + POST_TIME;
    if (winner === 'T') this.scoreT++;
    else this.scoreCT++;
    this.showMessage(text, winner === 'T' ? '#f5b041' : '#5dade2', POST_TIME);
    audio.roundEnd(winner === this.playerTeam);
    if (this.scoreT >= WIN_ROUNDS || this.scoreCT >= WIN_ROUNDS) {
      this.matchOver = winner;
      this.showMessage(winner === this.playerTeam ? '比赛胜利！' : '比赛失败', winner === 'T' ? '#f5b041' : '#5dade2', 9999);
    }
  }

  // ================================================================ input

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.started) return;
    this.keys.add(e.code);
    if (e.code === 'Tab') {
      e.preventDefault();
      this.showScores = true;
    }
    const c = this.controlled;
    if (!c) return;
    if (e.code === 'KeyF' && !this.me.alive) this.takeOver();
    if (e.code === 'Enter' && this.matchOver) this.startMatch(this.playerTeam);
    if (!c.alive || !c.isPlayer) return;
    switch (e.code) {
      case 'Digit1':
        this.switchWeapon(c, 'primary');
        break;
      case 'Digit2':
        this.switchWeapon(c, 'secondary');
        break;
      case 'Digit3':
        this.switchWeapon(c, 'melee');
        break;
      case 'KeyQ':
        this.switchWeapon(c, c.inv.has(c.inv.lastSlot) ? c.inv.lastSlot : c.inv.best());
        break;
      case 'KeyR':
        this.reload(c);
        break;
    }
    if (this.canBuy()) {
      const item = BUY_MENU.find((b) => `Digit${b.key}` === e.code);
      if (item) this.buy(item.id);
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    if (e.code === 'Tab') this.showScores = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.locked || !this.started) return;
    const c = this.controlled;
    if (!c || !c.alive || !c.isPlayer) return;
    const sens = 0.0022 * (this.fov / 75);
    c.yaw -= e.movementX * sens;
    c.pitch -= e.movementY * sens;
    c.pitch = Math.max(-1.5, Math.min(1.5, c.pitch));
  };

  private onMouseDown = (e: MouseEvent) => {
    if (!this.started) return;
    if (!this.locked) {
      this.requestLock();
      return;
    }
    const c = this.controlled;
    if (!c.alive || !c.isPlayer) {
      // spectator: cycle targets
      const mates = this.spectateCandidates();
      if (mates.length) this.spectateIdx = (this.spectateIdx + (e.button === 2 ? -1 : 1) + mates.length) % mates.length;
      return;
    }
    if (e.button === 0) this.mouseDown = true;
    if (e.button === 2) {
      const w = c.inv.weapon;
      if (w.def.scope && !w.reloading && this.now >= c.inv.switchUntil) {
        c.scoped = !c.scoped;
        audio.scope();
      }
    }
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.mouseDown = false;
  };

  private onLockChange = () => {
    this.locked = document.pointerLockElement === this.renderer.domElement;
    if (!this.locked) {
      this.mouseDown = false;
      this.keys.clear();
    }
    this.publish();
  };

  private onContext = (e: Event) => e.preventDefault();

  private bindInput() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('contextmenu', this.onContext);
    document.addEventListener('pointerlockchange', this.onLockChange);
  }
  private unbindInput() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('contextmenu', this.onContext);
    document.removeEventListener('pointerlockchange', this.onLockChange);
  }

  private onResize = () => {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = this.vmCamera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.vmCamera.updateProjectionMatrix();
  };

  canBuy() {
    return this.phase === 'freeze' && this.controlled === this.me && this.me.alive;
  }

  private buy(id: string) {
    const c = this.me;
    const def = WEAPONS[id];
    if (this.round === 1 && def.slot === 'primary') {
      this.showMessage('手枪局无法购买主武器', '#ff6b6b', 1.5);
      return;
    }
    c.inv.give(id);
    c.inv.current = def.slot;
    c.scoped = false;
    c.setWeaponModel();
    audio.switchWeapon();
    this.showMessage(`已购买 ${def.name}`, '#7bed9f', 1.2);
  }

  private spectateCandidates() {
    return this.agents.filter((a) => a.alive && a.team === this.playerTeam && a !== this.controlled);
  }

  /** take control of the currently spectated living teammate bot */
  private takeOver() {
    const mates = this.spectateCandidates();
    if (!mates.length) return;
    const t = mates[this.spectateIdx % mates.length];
    this.controlled.isPlayer = false;
    this.controlled = t;
    t.isPlayer = true;
    t.scoped = false;
    this.showMessage(`已接管 ${t.name}`, '#7bed9f', 2);
  }

  // ================================================================ main loop

  private loop = (t: number) => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (t - (this.lastT || t)) / 1000);
    this.lastT = t;
    this.fpsAcc += dt;
    this.fpsFrames++;
    if (this.fpsAcc > 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsAcc);
      this.fpsAcc = 0;
      this.fpsFrames = 0;
    }
    if (this.started) this.update(dt);
    this.render(dt);
    this.hudTimer -= dt;
    if (this.hudTimer <= 0) {
      this.hudTimer = 1 / 30;
      this.publish();
    }
  };

  private update(dt: number) {
    this.now += dt;
    this.updateRound();
    this.plantTouched = false;
    this.defuseTouched = false;

    // ---- controlled agent (human)
    const c = this.controlled;
    if (c.alive && c.isPlayer) this.updatePlayer(c, dt);

    // ---- bots
    for (const a of this.agents) {
      if (a.isPlayer || !a.brain) continue;
      if (!a.alive) continue;
      const cmd = a.brain.update(this, dt);
      a.inv.weapon.update(this.now, dt);
      const landed = a.physics(this.map, cmd.wishX, cmd.wishZ, cmd.jump, cmd.walk, dt);
      void landed;
      a.stepAccum += a.speed * dt;
      if (a.stepAccum > 2.4 && a.onGround && a.speed > 3.5) {
        a.stepAccum = 0;
        if (a.pos.distanceTo(this.controlled.pos) < 30) audio.footstep(a.pos, 1);
        // enemies hear footsteps
        for (const o of this.agents)
          if (o.alive && o.brain && !o.isPlayer && o.team !== a.team && o.pos.distanceTo(a.pos) < 18)
            o.brain.hear({ x: a.pos.x, z: a.pos.z }, this.now);
      }
    }

    // ---- reset plant/defuse progress if no one is acting this frame
    if (!this.plantTouched) {
      this.plantProgress = 0;
      this.plantFrameAgent = null;
    }
    if (!this.defuseTouched && this.bomb.state === 'planted') {
      this.defuseProgress = 0;
      this.bomb.defuser = null;
    }

    // ---- separation between living agents
    const alive = this.agents.filter((a) => a.alive);
    for (let i = 0; i < alive.length; i++)
      for (let j = i + 1; j < alive.length; j++) {
        const a = alive[i], b = alive[j];
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        const min = 0.7;
        if (d < min && d > 1e-4 && Math.abs(a.pos.y - b.pos.y) < 1.5) {
          const push = (min - d) / 2;
          this.map.moveBody(a.pos, (-dx / d) * push, (-dz / d) * push, 0.32);
          this.map.moveBody(b.pos, (dx / d) * push, (dz / d) * push, 0.32);
        }
      }

    // ---- bomb carry / pickup
    if (this.bomb.state === 'carried' && this.bomb.carrier) this.bomb.pos.copy(this.bomb.carrier.pos);
    if (this.bomb.state === 'dropped') {
      for (const a of this.agents) {
        if (!a.alive || a.team !== 'T') continue;
        if (Math.hypot(a.pos.x - this.bomb.pos.x, a.pos.z - this.bomb.pos.z) < 1.1) {
          a.hasBomb = true;
          this.bomb.state = 'carried';
          this.bomb.carrier = a;
          if (a === this.controlled) this.showMessage('你捡起了 C4', '#ff9f43', 2);
          if (a.brain && !a.isPlayer) a.brain.state = 'IDLE';
          break;
        }
      }
    }

    // ---- player-team spotting (for minimap): enemies visible from controlled agent's view
    if (this.now - this.lastPlayerSpot > 0.15) {
      this.lastPlayerSpot = this.now;
      const v = this.controlled;
      if (v.alive) {
        for (const o of this.agents) {
          if (!o.alive || o.team === v.team) continue;
          const dx = o.pos.x - v.pos.x, dz = o.pos.z - v.pos.z;
          const d = Math.hypot(dx, dz);
          const fx = -Math.sin(v.yaw), fz = -Math.cos(v.yaw);
          if (d > 3 && (fx * dx + fz * dz) / d < 0.5) continue;
          if (this.map.visible(v.pos.x, v.pos.y + EYE, v.pos.z, o.pos.x, o.pos.y + 1.4, o.pos.z)) o.spottedUntil = this.now + 1;
        }
      }
    }

    // ---- bot muzzle flashes
    for (const [a, until] of this.flashUntil) {
      if (this.now > until) {
        const m = this.flashMeshes.get(a);
        if (m) m.visible = false;
        this.flashUntil.delete(a);
      }
    }

    // ---- animate rigs
    for (const a of this.agents) {
      a.animate(dt, this.now);
      if (a.rig.gunId !== a.inv.weapon.def.id) a.setWeaponModel();
    }

    // ---- bomb mesh
    const showBomb = this.bomb.state === 'dropped' || this.bomb.state === 'planted' || this.bomb.state === 'defused';
    this.bombMesh.visible = showBomb;
    if (showBomb) {
      this.bombMesh.position.copy(this.bomb.pos);
      const blink = this.bomb.state === 'planted' && this.nextBeep - this.now < 0.15;
      (this.bombLight.material as THREE.MeshBasicMaterial).color.setHex(blink ? 0xff0000 : 0x330000);
    }

    if (this.message && this.now > this.messageUntil) this.message = null;
    // expire killfeed
    this.killfeed = this.killfeed.filter((k) => this.now - k.t < 7);
    this.effects.update(dt);
  }

  private updatePlayer(c: Agent, dt: number) {
    const k = this.keys;
    const frozen = this.phase === 'freeze';
    let f = 0, s = 0;
    if (k.has('KeyW')) f += 1;
    if (k.has('KeyS')) f -= 1;
    if (k.has('KeyD')) s += 1;
    if (k.has('KeyA')) s -= 1;
    const using = k.has('KeyE') && this.phase === 'live';
    let acting = false;
    if (using) {
      if (c.hasBomb && this.map.siteAt(c.pos.x, c.pos.z)) acting = this.actPlant(c, dt);
      else if (c.team === 'CT' && this.bomb.state === 'planted') acting = this.actDefuse(c, dt);
    }
    if (frozen || acting) f = s = 0;
    const fx = -Math.sin(c.yaw), fz = -Math.cos(c.yaw);
    const rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);
    const wishX = fx * f + rx * s, wishZ = fz * f + rz * s;
    const walk = k.has('ShiftLeft') || k.has('ShiftRight');
    const landed = c.physics(this.map, wishX, wishZ, k.has('Space') && !frozen && !acting, walk, dt);
    if (landed) audio.land();
    c.stepAccum += c.speed * dt;
    if (c.stepAccum > 2.2 && c.onGround) {
      c.stepAccum = 0;
      if (!walk) audio.footstep(undefined, 0.8);
    }
    c.inv.weapon.update(this.now, dt);
    // weapon fire
    const w = c.inv.weapon;
    if (this.mouseDown && !acting && this.locked) {
      const fired = this.tryFire(c);
      if (fired && !w.def.auto) this.mouseDown = false;
    }
    // recoil recovery
    const rec = Math.exp(-dt * (this.mouseDown && w.def.auto ? 2.0 : 7));
    this.punchPitch *= rec;
    this.punchYaw *= rec;
    // scope fov
    const targetFov = c.scoped && w.def.scope ? w.def.scope.fov : 75;
    this.fov += (targetFov - this.fov) * Math.min(1, dt * 18);
    if (w.reloading) c.scoped = false;
  }

  // ================================================================ rendering

  private render(dt: number) {
    const r = this.renderer;
    r.clear();
    let viewAgent: Agent | null = null;
    if (this.started) {
      const c = this.controlled;
      viewAgent = c.alive ? c : this.spectateCandidates()[this.spectateIdx % Math.max(1, this.spectateCandidates().length)] ?? null;
      if (!c.alive && !viewAgent) viewAgent = null;
    }
    for (const a of this.agents) a.rig.root.visible = a !== viewAgent;
    if (viewAgent) {
      const isSelf = viewAgent === this.controlled;
      this.camera.position.set(viewAgent.pos.x, viewAgent.pos.y + EYE, viewAgent.pos.z);
      const bob = isSelf && viewAgent.onGround ? Math.sin(viewAgent.walkPhase * 2) * 0.03 * viewAgent.moveFrac : 0;
      this.camera.position.y += bob;
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.set(viewAgent.pitch + (isSelf ? this.punchPitch : 0), viewAgent.yaw + (isSelf ? this.punchYaw : 0), 0);
      this.camera.fov = isSelf ? this.fov : 75;
    } else if (this.started) {
      // overview camera when the whole team is dead
      this.camera.position.set((GW * CELL) / 2, 110, (GH * CELL) / 2 + 40);
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.set(-1.2, 0, 0);
      this.camera.fov = 75;
    } else {
      // menu: slow orbit
      const t = performance.now() / 1000;
      this.camera.position.set(60 + Math.sin(t * 0.1) * 60, 45, 70 + Math.cos(t * 0.1) * 70);
      this.camera.lookAt(60, 0, 70);
      this.camera.fov = 70;
    }
    this.camera.updateProjectionMatrix();
    audio.listener = { x: this.camera.position.x, z: this.camera.position.z, yaw: viewAgent ? viewAgent.yaw : 0 };
    r.render(this.scene, this.camera);

    // ---- view model
    if (viewAgent && !(viewAgent.scoped && viewAgent.inv.weapon.def.scope)) {
      if (this.vmTeam !== viewAgent.team) {
        this.vmScene.remove(this.vm.root);
        this.vm = buildViewModel(viewAgent.team);
        this.vmTeam = viewAgent.team;
        this.vmScene.add(this.vm.root);
      }
      this.updateViewModel(viewAgent, dt);
      r.clearDepth();
      r.render(this.vmScene, this.vmCamera);
    }
    this.drawMinimap(viewAgent);
  }

  private updateViewModel(a: Agent, dt: number) {
    const vm = this.vm;
    const w = a.inv.weapon;
    setViewModelWeapon(vm, w.def.id);
    const isPistol = w.def.slot === 'secondary';
    const isKnife = w.def.slot === 'melee';
    const base = isKnife ? new THREE.Vector3(0.22, -0.24, -0.4) : isPistol ? new THREE.Vector3(0.17, -0.2, -0.42) : new THREE.Vector3(0.16, -0.19, -0.36);
    this.vmKick *= Math.exp(-dt * 12);
    this.vmSwitch *= Math.exp(-dt * 8);
    const bobT = a.walkPhase;
    const mv = a.onGround ? a.moveFrac : 0;
    vm.root.position.set(
      base.x + Math.sin(bobT) * 0.012 * mv,
      base.y + Math.abs(Math.cos(bobT)) * 0.01 * mv - this.vmSwitch * 0.25 - (a.onGround ? 0 : 0.02),
      base.z + this.vmKick * (isKnife ? -0.15 : 0.06)
    );
    let rx = this.vmKick * (isKnife ? -0.6 : 0.12);
    let ry = isKnife ? 0.5 : 0;
    // reload animation: tilt down and roll
    if (w.reloading) {
      const t = 1 - (w.reloadUntil - this.now) / w.def.reloadTime;
      const k = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
      rx -= k * 0.6;
      vm.root.rotation.z = k * 0.4;
    } else vm.root.rotation.z = 0;
    vm.root.rotation.x = rx;
    vm.root.rotation.y = ry;
    if (isKnife) vm.gunHolder.rotation.set(0, 0, 0);
    // muzzle flash fade
    if (vm.flash.visible) {
      vm.flashLight.intensity *= 0.5;
      if (vm.flashLight.intensity < 0.1) {
        vm.flash.visible = false;
        vm.flashLight.intensity = 0;
      }
    }
    this.vmCamera.updateProjectionMatrix();
  }

  // ================================================================ minimap

  private renderMinimapBg(w: number, h: number) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d')!;
    const sx = w / GW, sz = h / GH;
    g.fillStyle = 'rgba(20,18,14,0.85)';
    g.fillRect(0, 0, w, h);
    for (let z = 0; z < GH; z++)
      for (let x = 0; x < GW; x++) {
        const k = this.map.kindAt(x, z);
        if (k === Kind.Floor) g.fillStyle = '#b89c6a';
        else if (k === Kind.Crate) g.fillStyle = '#6e5636';
        else if (k === Kind.Door) g.fillStyle = '#4a3420';
        else continue;
        g.fillRect(x * sx, z * sz, Math.ceil(sx), Math.ceil(sz));
      }
    for (const zone of [this.map.siteA, this.map.siteB]) {
      g.fillStyle = 'rgba(220,50,30,0.25)';
      g.fillRect(zone.x0 * sx, zone.z0 * sz, (zone.x1 - zone.x0 + 1) * sx, (zone.z1 - zone.z0 + 1) * sz);
      const p = zone.name === 'A' ? this.map.points.siteA : this.map.points.siteB;
      g.fillStyle = 'rgba(180,20,20,0.9)';
      g.font = 'bold 22px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(zone.name, (p.x / CELL) * sx, (p.z / CELL) * sz);
    }
    g.font = '10px sans-serif';
    g.fillStyle = 'rgba(30,20,10,0.9)';
    g.textAlign = 'center';
    for (const co of this.map.callouts) {
      if (co.name.endsWith('点')) continue;
      g.fillText(co.name, (co.x / CELL) * sx, (co.z / CELL) * sz);
    }
    return c;
  }

  private drawMinimap(view: Agent | null) {
    const c = this.minimap;
    if (!c || !this.minimapBg || !this.started) return;
    const g = c.getContext('2d')!;
    const sx = c.width / (GW * CELL), sz = c.height / (GH * CELL);
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(this.minimapBg, 0, 0);
    const team = this.playerTeam;
    const dot = (x: number, z: number, color: string, r: number, yaw?: number, outline = '#000') => {
      const px = x * sx, pz = z * sz;
      g.fillStyle = color;
      g.strokeStyle = outline;
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(px, pz, r, 0, Math.PI * 2);
      g.fill();
      g.stroke();
      if (yaw !== undefined) {
        g.beginPath();
        g.moveTo(px, pz);
        g.lineTo(px - Math.sin(yaw) * (r + 6), pz - Math.cos(yaw) * (r + 6));
        g.strokeStyle = color;
        g.lineWidth = 2;
        g.stroke();
      }
    };
    for (const a of this.agents) {
      if (a.team === team) {
        if (!a.alive) {
          g.strokeStyle = 'rgba(255,255,255,0.5)';
          g.lineWidth = 1.5;
          const px = a.pos.x * sx, pz = a.pos.z * sz;
          g.beginPath();
          g.moveTo(px - 3, pz - 3);
          g.lineTo(px + 3, pz + 3);
          g.moveTo(px + 3, pz - 3);
          g.lineTo(px - 3, pz + 3);
          g.stroke();
          continue;
        }
        if (a === view) continue;
        dot(a.pos.x, a.pos.z, team === 'CT' ? '#5dade2' : '#f5b041', 3.5, a.yaw);
      } else if (a.alive && a.spottedUntil > this.now) {
        dot(a.pos.x, a.pos.z, '#ff3b3b', 3.5);
      }
    }
    if (view) dot(view.pos.x, view.pos.z, '#ffffff', 4.5, view.yaw, '#000');
    // bomb
    const b = this.bomb;
    const showBomb =
      b.state === 'planted' || b.state === 'defused' || (team === 'T' && (b.state === 'dropped' || b.state === 'carried')) ||
      (b.state === 'dropped' && team === 'CT' && this.anyTeamSees(b.pos));
    if (showBomb) {
      const px = b.pos.x * sx, pz = b.pos.z * sz;
      const blink = b.state !== 'planted' || Math.sin(this.now * 10) > 0;
      g.fillStyle = blink ? '#ff8c1a' : '#7a3a00';
      g.strokeStyle = '#000';
      g.lineWidth = 1;
      g.fillRect(px - 4, pz - 4, 8, 8);
      g.strokeRect(px - 4, pz - 4, 8, 8);
      g.fillStyle = '#000';
      g.font = 'bold 7px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('C4', px, pz + 0.5);
    }
  }

  private anyTeamSees(p: THREE.Vector3) {
    return this.agents.some((a) => a.alive && a.team === this.playerTeam && a.pos.distanceTo(p) < 15);
  }

  // ================================================================ HUD store

  private publish() {
    this.snapshot = this.buildSnapshot();
    for (const l of this.listeners) l();
  }

  private buildSnapshot(): HudSnapshot {
    const started = this.started && !!this.controlled;
    const c = started ? this.controlled : null;
    const view = c && c.alive ? c : started ? this.spectateCandidates()[this.spectateIdx % Math.max(1, this.spectateCandidates().length)] ?? null : null;
    const hudAgent = view ?? c;
    const w = hudAgent?.inv.weapon;
    const spread = hudAgent && w ? w.currentSpread(hudAgent.moveFrac, !hudAgent.onGround, hudAgent.scoped) : 0;
    const h = this.container.clientHeight || 800;
    const gapPx = (Math.tan(spread) / Math.tan(THREE.MathUtils.degToRad(this.fov / 2))) * (h / 2);
    let actionLabel: string | null = null;
    let actionFrac = 0;
    if (this.plantFrameAgent && this.plantFrameAgent === c && this.plantProgress > 0) {
      actionLabel = '正在安放 C4…';
      actionFrac = this.plantProgress / PLANT_TIME;
    } else if (this.bomb.defuser && this.bomb.defuser === hudAgent && this.defuseProgress > 0) {
      actionLabel = '正在拆除 C4…';
      actionFrac = this.defuseProgress / DEFUSE_TIME;
    }
    const nowMs = performance.now();
    this.damageDirs = this.damageDirs.filter((d) => nowMs - d.t < 1200);
    const slotKeys: Record<Slot, string> = { primary: '1', secondary: '2', melee: '3' };
    return {
      started,
      locked: this.locked,
      phase: this.phase,
      timeLeft:
        this.phase === 'live' && this.bomb.state === 'planted'
          ? Math.max(0, this.bombExplodeAt - this.now)
          : Math.max(0, this.phaseEnd - this.now),
      round: this.round,
      pistolRound: this.round === 1,
      scoreT: this.scoreT,
      scoreCT: this.scoreCT,
      playerTeam: this.playerTeam,
      alive: !!c?.alive,
      controlledName: c?.name ?? '',
      spectating: c && !c.alive && view ? view.name : null,
      canTakeOver: !!(c && !c.alive && view && view.team === this.playerTeam),
      health: Math.max(0, Math.round(hudAgent?.health ?? 0)),
      armor: Math.round(hudAgent?.armor ?? 0),
      helmet: !!hudAgent?.helmet,
      weaponName: w?.def.name ?? '',
      weaponId: w?.def.id ?? '',
      slot: hudAgent?.inv.current ?? 'secondary',
      slots: hudAgent
        ? (['primary', 'secondary', 'melee'] as Slot[])
            .filter((s) => hudAgent.inv.slots[s])
            .map((s) => ({ slot: s, name: hudAgent.inv.slots[s]!.def.name, key: slotKeys[s] }))
        : [],
      mag: w?.mag ?? 0,
      reserve: w?.reserve ?? 0,
      magSize: w?.def.magSize ?? 0,
      reloading: !!w?.reloading,
      reloadFrac: w && w.reloading ? 1 - (w.reloadUntil - this.now) / w.def.reloadTime : 0,
      crosshairGap: Math.max(3, gapPx),
      scoped: !!(hudAgent?.scoped && w?.def.scope && hudAgent === c),
      killfeed: this.killfeed.slice(),
      aliveT: this.agents.filter((a) => a.alive && a.team === 'T').length,
      aliveCT: this.agents.filter((a) => a.alive && a.team === 'CT').length,
      bombState: this.bomb.state,
      bombSite: this.bomb.site,
      bombTimeLeft: Math.max(0, this.bombExplodeAt - this.now),
      hasBomb: !!hudAgent?.hasBomb,
      inSite: hudAgent ? this.map.siteAt(hudAgent.pos.x, hudAgent.pos.z) : null,
      actionLabel,
      actionFrac,
      message: this.message,
      messageColor: this.messageColor,
      hitmarker: this.hitmarker,
      hitHead: this.hitHead,
      damageDirs: this.damageDirs.slice(),
      canBuy: started && this.canBuy(),
      matchOver: this.matchOver,
      scoreboard: this.agents.map((a) => ({ name: a.name, team: a.team, kills: a.kills, deaths: a.deaths, alive: a.alive, isPlayer: a === this.controlled })),
      showScores: this.showScores || this.phase === 'post' && !!this.matchOver,
      fps: this.fps,
    };
  }
}

// keep tree-shakers from dropping the gun builder used for menu previews
export { buildGun };
