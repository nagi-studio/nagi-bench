// GameClient: owns the three.js renderer + the headless Sim, runs the loop
// (fixed 60 Hz simulation, interpolated rendering at display rate) and bridges to React.
import * as THREE from 'three';
import { Sim, TICK } from '../core/sim.ts';
import type { Difficulty, SimConfig } from '../core/sim.ts';
import type { Character, Team } from '../core/character.ts';
import { otherTeam } from '../core/character.ts';
import type { GameEvent } from '../core/events.ts';
import { WEAPONS } from '../core/weapons.ts';
import type { Slot, WeaponId } from '../core/weapons.ts';
import { clamp, DEG, dirFromAngles } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import { ROUND_CFG } from '../core/round.ts';
import { REGION_NAMES } from '../core/mapData.ts';
import { MapView } from './render/mapView.ts';
import { CharacterView } from './render/characterView.ts';
import { Viewmodel } from './render/viewmodel.ts';
import { Effects } from './render/effects.ts';
import { AudioEngine } from './audio/audio.ts';
import { Input } from './input.ts';
import type { FrameInput } from './input.ts';
import { HudStore } from './hudStore.ts';
import type { BuyItem, HudState, KillfeedEntry, ScoreRow } from './hudStore.ts';

export interface ClientOptions {
  team: Team;
  difficulty: Difficulty;
  allPistolRounds: boolean;
  sensitivity: number;
  volume: number;
  playerName: string;
  shadows: boolean;
}

const BASE_FOV_H = 90; // CS default horizontal FOV at 4:3
/** convert a CS-style horizontal FOV (4:3) into a vertical FOV */
const vfov = (h: number) => (2 * Math.atan(Math.tan((h * DEG) / 2) * 0.75)) / DEG;

const REASON_TEXT: Record<string, string> = {
  elimination: '全歼敌方',
  bomb_exploded: '炸弹已爆炸',
  bomb_defused: '炸弹已被拆除',
  time: '时间耗尽',
};

export interface MinimapDot {
  x: number;
  z: number;
  yaw: number;
  team: Team;
  kind: 'me' | 'mate' | 'enemy' | 'dead';
  bomb: boolean;
  label: string;
}

export class GameClient {
  readonly sim: Sim;
  readonly hud: HudStore;
  readonly opts: ClientOptions;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private viewmodel = new Viewmodel();
  private effects = new Effects();
  private views: CharacterView[] = [];
  private prevPos: THREE.Vector3[] = [];
  private input: Input;
  private audio: AudioEngine | null = null;
  private container: HTMLElement;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private disposed = false;
  private resizeObs: ResizeObserver;

  // view / spectate state
  private spectateId = -1;
  private deathCamUntil = 0;
  private camEyeY = 0;
  private fovCur = vfov(BASE_FOV_H);
  private shake = 0;
  private lightCheckAt = 0;
  private lightLevel = 1;
  private nextDefuseTick = 0;
  private lastMouse = { dx: 0, dy: 0 };
  private lastLookYaw = 0;

  // HUD bookkeeping
  private killfeed: KillfeedEntry[] = [];
  private kfId = 1;
  private msgId = 1;
  private message: HudState['message'] = null;
  private messageUntil = 0;
  private hit = { id: 0, head: false, kill: false };
  private damage = { id: 0, angle: 0 };
  private buyOpen = false;
  private scoreboard = false;
  private hudAt = 0;
  private fpsFrames = 0;
  private fpsAt = 0;
  private fps = 60;
  private matchOver: { winner: Team } | null = null;
  private started = false;

  constructor(container: HTMLElement, opts: ClientOptions) {
    this.container = container;
    this.opts = opts;
    const config: SimConfig = {
      playerTeam: opts.team,
      difficulty: opts.difficulty,
      allPistolRounds: opts.allPistolRounds,
      winsToMatch: 8,
      autopilot: false,
      playerName: opts.playerName,
    };
    this.sim = new Sim(config);

    // --- renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = opts.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.autoClear = false;
    this.renderer.domElement.className = 'game-canvas';
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(this.fovCur, container.clientWidth / container.clientHeight, 0.03, 1200);
    this.camera.rotation.order = 'YXZ';
    this.viewmodel.setAspect(container.clientWidth / container.clientHeight);

    // --- world
    this.scene.fog = new THREE.Fog(0xdccdb2, 70, 320);
    this.scene.background = new THREE.Color(0xa9c9e6);
    const hemi = new THREE.HemisphereLight(0xd3e4ff, 0xb39266, 1.35);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff0d8, 2.9);
    sun.position.set(-40, 90, 30);
    sun.target.position.set(-3, 0, -2);
    sun.castShadow = opts.shadows;
    sun.shadow.mapSize.set(4096, 4096);
    const sc = sun.shadow.camera;
    sc.left = -80;
    sc.right = 80;
    sc.top = 80;
    sc.bottom = -80;
    sc.near = 10;
    sc.far = 260;
    sc.updateProjectionMatrix();
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    this.scene.add(sun, sun.target);

    const map = new MapView(this.sim.world);
    this.scene.add(map.group);
    this.scene.add(this.effects.group);

    for (const c of this.sim.chars) {
      const v = new CharacterView(c, c.team === opts.team && c.id !== this.sim.playerId);
      this.views.push(v);
      this.scene.add(v.root);
      this.prevPos.push(new THREE.Vector3(c.pos.x, c.pos.y, c.pos.z));
    }

    this.input = new Input(this.renderer.domElement);
    this.input.onLockChange = (locked) => {
      if (locked) this.ensureAudio();
      this.publishHud(performance.now() / 1000, true);
    };

    this.hud = new HudStore(this.buildHud(0));
    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(container);

    this.sim.start();
    this.drainEvents();
    this.snapPrev();
    this.last = performance.now() / 1000;
    this.raf = requestAnimationFrame(this.frame);
  }

  // ------------------------------------------------------------------ public API (React)
  ensureAudio() {
    if (!this.audio) {
      try {
        this.audio = new AudioEngine();
        this.audio.setVolume(this.opts.volume);
        this.audio.occluded = (p: Vec3) => {
          const eye = this.cameraPos();
          return !this.sim.world.lineOfSight(eye.x, eye.y, eye.z, p.x, p.y + 0.3, p.z);
        };
      } catch {
        this.audio = null;
      }
    }
    this.audio?.resume();
  }

  requestLock() {
    this.started = true;
    this.ensureAudio();
    this.input.requestLock();
  }

  setVolume(v: number) {
    this.opts.volume = v;
    this.audio?.setVolume(v);
  }

  setSensitivity(s: number) {
    this.opts.sensitivity = s;
  }

  restartMatch() {
    this.matchOver = null;
    this.sim.round.score = { T: 0, CT: 0 };
    this.sim.round.number = 0;
    this.sim.round.matchWinner = null;
    for (const c of this.sim.chars) {
      c.kills = 0;
      c.deaths = 0;
      c.headshots = 0;
    }
    this.killfeed = [];
    this.sim.round.startRound();
    this.drainEvents();
    this.snapPrev();
  }

  buy(id: WeaponId) {
    const c = this.sim.controlled;
    if (!this.canBuy()) return;
    const def = WEAPONS[id];
    if (def.team && def.team !== c.team) return;
    if (def.slot === 'primary') this.sim.round.playerBuy.primary = id;
    if (def.slot === 'secondary') this.sim.round.playerBuy.secondary = id;
    c.give(id);
    this.sim.switchTo(c, def.slot);
    if (c.active !== def.slot) c.active = def.slot;
    this.audio?.pickup();
    this.publishHud(performance.now() / 1000, true);
  }

  closeBuy() {
    this.buyOpen = false;
  }

  /** Live data for the crosshair component (read every animation frame). */
  getCrosshair() {
    const c = this.viewChar();
    const def = c.def;
    const h = this.container.clientHeight;
    const spread = this.sim.computeSpread(c);
    const gap = (Math.tan(spread) / Math.tan((this.fovCur * DEG) / 2)) * (h / 2);
    const scoped = c.scope > 0;
    const sniper = !!def?.scope;
    return {
      gap: clamp(gap, 2, 120),
      visible: c.alive && !scoped && !(sniper && !scoped) && def?.slot !== 'bomb',
      dot: sniper && !scoped && c.alive,
      scoped,
      recoilY: 0,
    };
  }

  /** Live data for the minimap. */
  getMinimap(): { dots: MinimapDot[]; bomb: { x: number; z: number; state: string; blink: boolean } | null; viewYaw: number } {
    const me = this.viewChar();
    const myTeam = this.opts.team;
    const dots: MinimapDot[] = [];
    for (const c of this.sim.chars) {
      const isView = c.id === me.id;
      if (c.team === myTeam) {
        dots.push({
          x: c.pos.x,
          z: c.pos.z,
          yaw: c.yaw,
          team: c.team,
          kind: !c.alive ? 'dead' : isView ? 'me' : 'mate',
          bomb: c.alive && c.hasBomb(),
          label: c.name,
        });
      } else if (c.alive && this.sim.isSpottedBy(myTeam, c, 0.5)) {
        dots.push({ x: c.pos.x, z: c.pos.z, yaw: c.yaw, team: c.team, kind: 'enemy', bomb: c.hasBomb(), label: c.name });
      } else if (!c.alive && this.sim.time - c.deathTime < 6) {
        dots.push({ x: c.pos.x, z: c.pos.z, yaw: 0, team: c.team, kind: 'dead', bomb: false, label: c.name });
      }
    }
    const b = this.sim.bomb;
    let bomb: { x: number; z: number; state: string; blink: boolean } | null = null;
    const now = performance.now() / 1000;
    if (b.state === 'planted' || b.state === 'defused') bomb = { x: b.pos.x, z: b.pos.z, state: b.state, blink: Math.floor(now * 3) % 2 === 0 };
    else if (b.state === 'dropped') {
      // Ts always know where the dropped bomb is; CTs only when they can see it
      const cp = this.camera.position;
      const seen = myTeam === 'T' || this.sim.world.lineOfSight(cp.x, cp.y, cp.z, b.pos.x, b.pos.y + 0.2, b.pos.z);
      if (seen) bomb = { x: b.pos.x, z: b.pos.z, state: 'dropped', blink: false };
    } else if (b.state === 'carried' && myTeam === 'T') {
      const carrier = this.sim.chars[b.carrierId];
      if (carrier) bomb = { x: carrier.pos.x, z: carrier.pos.z, state: 'carried', blink: false };
    }
    return { dots, bomb, viewYaw: me.yaw };
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObs.disconnect();
    this.input.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry?.dispose();
    });
    if (this.audio) void this.audio.ctx.close();
  }

  // ------------------------------------------------------------------ helpers
  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.viewmodel.setAspect(w / h);
  }

  private viewChar(): Character {
    const c = this.sim.controlled;
    if (c.alive) return c;
    if (this.spectateId >= 0 && this.sim.chars[this.spectateId].alive) return this.sim.chars[this.spectateId];
    return c;
  }

  private cameraPos(): THREE.Vector3 {
    return this.camera.position;
  }

  private canBuy(): boolean {
    const c = this.sim.controlled;
    return c.alive && c.id === this.sim.playerId && this.sim.round.canBuy(c);
  }

  private snapPrev() {
    this.sim.chars.forEach((c, i) => this.prevPos[i].set(c.pos.x, c.pos.y, c.pos.z));
    const v = this.viewChar();
    this.camEyeY = v.eyeY;
  }

  private spectateCandidates(): Character[] {
    const mates = this.sim.chars.filter((c) => c.alive && c.team === this.opts.team);
    if (mates.length) return mates;
    return this.sim.chars.filter((c) => c.alive);
  }

  private cycleSpectate(dir: number) {
    const list = this.spectateCandidates();
    if (!list.length) {
      this.spectateId = -1;
      return;
    }
    const idx = list.findIndex((c) => c.id === this.spectateId);
    const next = list[(idx + dir + list.length) % list.length];
    this.spectateId = next.id;
    this.camEyeY = next.eyeY;
  }

  private showMessage(title: string, sub: string, color: string, dur = 3) {
    this.message = { id: this.msgId++, title, sub, color };
    this.messageUntil = performance.now() / 1000 + dur;
  }

  // ------------------------------------------------------------------ main loop
  private frame = (ms: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    const now = ms / 1000;
    let dt = now - this.last;
    this.last = now;
    if (dt > 0.1) dt = 0.1;
    if (dt < 0) dt = 0;
    const inp = this.input.consume();
    this.handleUiKeys(inp, now);
    const paused = !this.input.locked && !this.matchOver;
    if (!paused) {
      this.applyPlayerInput(inp);
      this.acc += dt;
      let steps = 0;
      while (this.acc >= TICK && steps < 6) {
        this.sim.chars.forEach((c, i) => this.prevPos[i].set(c.pos.x, c.pos.y, c.pos.z));
        this.sim.step(TICK);
        this.drainEvents();
        this.acc -= TICK;
        steps++;
      }
      if (steps >= 6) this.acc = 0;
    }
    this.lastMouse = { dx: paused ? 0 : inp.dx, dy: paused ? 0 : inp.dy };
    this.updateSpectate(now);
    this.render(dt, now, paused);
    this.fpsFrames++;
    if (now - this.fpsAt > 0.5) {
      this.fps = Math.round(this.fpsFrames / (now - this.fpsAt));
      this.fpsFrames = 0;
      this.fpsAt = now;
    }
    if (now - this.hudAt > 1 / 20) this.publishHud(now);
  };

  private handleUiKeys(inp: FrameInput, now: number) {
    const c = this.sim.controlled;
    const p = inp.pressed;
    this.scoreboard = this.input.down('Tab');
    if (p.has('KeyB')) {
      if (this.buyOpen) this.buyOpen = false;
      else if (this.canBuy()) this.buyOpen = true;
      this.publishHud(now, true);
    }
    if (this.buyOpen && !this.canBuy()) this.buyOpen = false;
    if (this.buyOpen) {
      const items = this.buyItems();
      for (const it of items) {
        if (p.has(`Digit${it.key}`)) {
          this.buy(it.id);
          p.delete(`Digit${it.key}`);
        }
      }
    }
    if (!c.alive && this.input.locked) {
      if (inp.mousePressed.has(0)) this.cycleSpectate(1);
      if (inp.mousePressed.has(2)) this.cycleSpectate(-1);
      if (p.has('KeyE') && this.spectateId >= 0) {
        const t = this.sim.chars[this.spectateId];
        if (t.alive && t.team === this.opts.team && this.sim.takeOver(t.id)) {
          this.showMessage(`已接管 ${t.name}`, '', '#9fe870', 2);
          this.spectateId = -1;
          this.audio?.pickup();
        }
      }
    }
  }

  private applyPlayerInput(inp: FrameInput) {
    const c = this.sim.controlled;
    if (!c.alive || c.isBot) return;
    const zoom = this.fovCur / vfov(BASE_FOV_H);
    const sens = 0.0022 * this.opts.sensitivity * zoom;
    c.yaw -= inp.dx * sens;
    c.pitch = clamp(c.pitch - inp.dy * sens, -89 * DEG, 89 * DEG);
    const k = (code: string) => this.input.down(code);
    const ci = c.input;
    ci.forward = (k('KeyW') ? 1 : 0) - (k('KeyS') ? 1 : 0);
    ci.right = (k('KeyD') ? 1 : 0) - (k('KeyA') ? 1 : 0);
    ci.jump = k('Space');
    ci.walk = k('ShiftLeft') || k('ShiftRight');
    ci.fire = this.input.mouse.has(0);
    ci.alt = this.input.mouse.has(2);
    ci.use = k('KeyE');
    const p = inp.pressed;
    if (p.has('KeyR')) ci.reload = true;
    if (!this.buyOpen) {
      const slotKeys: [string, Slot][] = [
        ['Digit1', 'primary'],
        ['Digit2', 'secondary'],
        ['Digit3', 'melee'],
        ['Digit4', 'bomb'],
        ['Digit5', 'bomb'],
      ];
      for (const [code, slot] of slotKeys) if (p.has(code)) ci.slot = slot;
    }
    if (p.has('KeyQ')) ci.lastWeapon = true;
    if (inp.wheel !== 0) {
      const order: Slot[] = ['primary', 'secondary', 'melee', 'bomb'];
      const owned = order.filter((s) => c.weapons[s]);
      const i = owned.indexOf(c.active);
      ci.slot = owned[(i + (inp.wheel > 0 ? 1 : -1) + owned.length) % owned.length];
    }
  }

  private updateSpectate(now: number) {
    const c = this.sim.controlled;
    if (c.alive) {
      this.spectateId = -1;
      return;
    }
    if (now < this.deathCamUntil) return;
    if (this.spectateId < 0 || !this.sim.chars[this.spectateId].alive) {
      const list = this.spectateCandidates();
      if (list.length) {
        this.spectateId = list[0].id;
        this.camEyeY = list[0].eyeY;
      } else this.spectateId = -1;
    }
  }

  // ------------------------------------------------------------------ events
  private drainEvents() {
    const evs = this.sim.events;
    for (const e of evs) this.onEvent(e);
    evs.length = 0;
  }

  private onEvent(e: GameEvent) {
    const sim = this.sim;
    const a = this.audio;
    const now = performance.now() / 1000;
    const view = this.viewChar();
    const me = sim.controlled;
    switch (e.type) {
      case 'shot': {
        const shooter = sim.chars[e.shooter];
        const def = WEAPONS[e.weapon];
        const self = shooter.id === view.id;
        a?.shot(def.sound, self ? undefined : e.from, self);
        const dir = dirFromAngles(shooter.yaw, shooter.pitch);
        let from: Vec3;
        if (self) {
          // approximate the viewmodel muzzle in world space
          const right = { x: Math.cos(shooter.yaw), z: -Math.sin(shooter.yaw) };
          from = {
            x: e.from.x + dir.x * 0.6 + right.x * 0.12,
            y: e.from.y + dir.y * 0.6 - 0.12,
            z: e.from.z + dir.z * 0.6 + right.z * 0.12,
          };
        } else from = { x: e.from.x + dir.x * 0.7, y: e.from.y - 0.35 + dir.y * 0.7, z: e.from.z + dir.z * 0.7 };
        if (e.tracer || (!self && shooter.team !== this.opts.team && Math.random() < 0.5)) this.effects.tracer(from, e.to);
        if (!def.silenced) this.effects.muzzleLight(from, self ? 0.6 : 1);
        if (e.normal) this.effects.impact(e.to, e.normal, 'world');
        break;
      }
      case 'melee': {
        const self = e.shooter === view.id;
        const pos = self ? undefined : sim.chars[e.shooter].pos;
        a?.knifeSwing(pos);
        if (e.hit) a?.knifeHit(true, pos);
        else if (e.hitWorld) a?.knifeHit(false, pos);
        break;
      }
      case 'damage': {
        this.effects.impact(e.pos, { x: 0, y: 0, z: 0 }, 'flesh');
        if (e.attacker === me.id && e.victim !== me.id) {
          this.hit = { id: this.hit.id + 1, head: e.group === 'head', kill: e.killed };
          a?.hitMarker(e.group === 'head', e.armorHit);
        }
        if (e.victim === view.id) {
          const att = sim.chars[e.attacker];
          const ang = Math.atan2(-(att.pos.x - view.pos.x), -(att.pos.z - view.pos.z)) - view.yaw;
          this.damage = { id: this.damage.id + 1, angle: -ang };
          a?.hurt(e.group === 'head');
          this.shake = Math.max(this.shake, 0.3);
        }
        break;
      }
      case 'kill': {
        const k = sim.chars[e.killer];
        const v = sim.chars[e.victim];
        this.killfeed.push({
          id: this.kfId++,
          killer: k.id === v.id ? '' : k.name,
          killerTeam: k.team,
          victim: v.name,
          victimTeam: v.team,
          weapon: WEAPONS[e.weapon].killIcon,
          headshot: e.headshot,
          involvesMe: k.id === me.id || v.id === me.id,
          time: now,
        });
        if (this.killfeed.length > 6) this.killfeed.shift();
        if (e.killer === me.id && e.victim !== me.id) a?.killConfirm(e.headshot);
        if (e.victim === me.id) {
          a?.death();
          this.deathCamUntil = now + 2.2;
          this.buyOpen = false;
        }
        if (e.victim === this.spectateId) this.deathCamUntil = now + 1.2;
        break;
      }
      case 'reload':
        if (e.who === view.id) a?.reload(e.weapon, e.duration, undefined);
        else a?.reload(e.weapon, e.duration, sim.chars[e.who].pos);
        break;
      case 'switch':
        if (e.who === view.id) a?.switchWeapon(undefined);
        break;
      case 'scope':
        if (e.who === view.id) a?.scope(e.level);
        break;
      case 'empty':
        if (e.who === view.id) a?.empty(undefined);
        break;
      case 'footstep':
        a?.footstep(e.who === view.id ? undefined : e.pos, e.who === view.id, e.foot);
        break;
      case 'jump':
        a?.jump(e.who === view.id ? undefined : e.pos);
        break;
      case 'land':
        a?.land(e.who === view.id ? undefined : e.pos, e.impact);
        if (e.who === view.id) this.viewmodel.onLand(e.impact);
        break;
      case 'bomb':
        this.onBombEvent(e, now);
        break;
      case 'round_start':
        this.effects.clearRound();
        this.spectateId = -1;
        this.deathCamUntil = 0;
        this.buyOpen = false;
        a?.roundStart();
        this.showMessage(
          `第 ${e.round} 回合`,
          e.pistol ? '手枪局 · 仅默认手枪 + 刀 · 无头盔' : `长枪局 · 按 B 打开购买菜单`,
          e.pistol ? '#ffd166' : '#e8e8e8',
          4,
        );
        this.snapPrev();
        break;
      case 'freeze_end':
        a?.goLive();
        break;
      case 'round_end': {
        const win = e.winner === this.opts.team;
        a?.roundEnd(win);
        this.showMessage(
          e.winner === 'CT' ? '反恐精英获胜' : '恐怖分子获胜',
          REASON_TEXT[e.reason] ?? '',
          e.winner === 'CT' ? '#6fb6ff' : '#ffb35c',
          ROUND_CFG.postTime,
        );
        break;
      }
      case 'match_end':
        this.matchOver = { winner: e.winner };
        this.input.exitLock();
        break;
    }
  }

  private onBombEvent(e: Extract<GameEvent, { type: 'bomb' }>, now: number) {
    const a = this.audio;
    const sim = this.sim;
    const me = sim.controlled;
    const who = e.who >= 0 ? sim.chars[e.who] : null;
    switch (e.action) {
      case 'given':
        break;
      case 'pickup':
        if (who && who.id === me.id) {
          a?.pickup();
          this.showMessage('你捡起了 C4', '前往 A 点或 B 点安放', '#ffb35c', 2.5);
        }
        break;
      case 'drop':
        if (this.opts.team === 'T') this.showMessage('C4 已掉落', who ? `${who.name} 阵亡` : '', '#ffb35c', 2);
        break;
      case 'plant_start':
        a?.plantStart(who && who.id === this.viewChar().id ? undefined : e.pos);
        break;
      case 'plant_abort':
        a?.cancel('plant');
        break;
      case 'planted':
        a?.planted(e.pos);
        this.showMessage('炸弹已安放', `${e.site ?? ''} 点 · ${ROUND_CFG.bombTime} 秒后爆炸`, '#ff5a4f', 3);
        break;
      case 'beep':
        a?.bombBeep(e.pos);
        this.effects.bombBeep(now);
        break;
      case 'defuse_start':
        if (who && (who.id === me.id || this.opts.team === 'CT')) this.showMessage(`${who.name} 正在拆除炸弹`, who.hasKit ? '使用拆弹器 5 秒' : '无拆弹器 10 秒', '#6fb6ff', 1.5);
        break;
      case 'defuse_abort':
        break;
      case 'defused':
        a?.defused(e.pos);
        break;
      case 'exploded':
        a?.explosion(e.pos);
        this.effects.explosion(e.pos);
        {
          const d = this.camera.position.distanceTo(new THREE.Vector3(e.pos.x, e.pos.y, e.pos.z));
          this.shake = Math.max(this.shake, clamp(2.5 - d / 25, 0.3, 2.5));
        }
        break;
    }
  }

  // ------------------------------------------------------------------ rendering
  private render(dt: number, now: number, paused: boolean) {
    const sim = this.sim;
    const alpha = paused ? 1 : clamp(this.acc / TICK, 0, 1);
    const view = this.viewChar();
    const me = sim.controlled;
    const tmp = new THREE.Vector3();

    // characters
    sim.chars.forEach((c, i) => {
      const v = this.views[i];
      tmp.set(c.pos.x, c.pos.y, c.pos.z);
      tmp.lerpVectors(this.prevPos[i], tmp, alpha);
      const firstPerson = c.id === view.id && c.alive && (me.alive || now >= this.deathCamUntil);
      v.root.visible = !firstPerson;
      if (v.root.visible) v.update(c, tmp, c.yaw, now, sim.time);
    });

    // camera
    const deathCam = !me.alive && (now < this.deathCamUntil || this.spectateId < 0);
    if (deathCam) {
      const idx = me.id;
      const p = this.prevPos[idx];
      const killer = me.killerId >= 0 ? sim.chars[me.killerId] : null;
      const tgt = new THREE.Vector3(p.x, p.y + 0.5, p.z);
      const camP = new THREE.Vector3(p.x, p.y + 2.3, p.z);
      // back off from the corpse (towards the killer's opposite side) when there is room
      if (killer && killer.id !== me.id) {
        const dx = p.x - killer.pos.x;
        const dz = p.z - killer.pos.z;
        const l = Math.hypot(dx, dz) || 1;
        const back = { x: (dx / l) * 2.2, z: (dz / l) * 2.2 };
        if (sim.world.lineOfSight(p.x, p.y + 2.3, p.z, p.x + back.x, p.y + 2.3, p.z + back.z)) {
          camP.x += back.x;
          camP.z += back.z;
        }
        if (killer.alive) tgt.set(killer.pos.x, killer.pos.y + 1.3, killer.pos.z);
      }
      this.camera.position.copy(camP);
      this.camera.lookAt(tgt);
    } else {
      const i = view.id;
      tmp.lerpVectors(this.prevPos[i], new THREE.Vector3(view.pos.x, view.pos.y, view.pos.z), alpha);
      const eye = tmp.y + (view.eyeY - view.pos.y);
      if (Math.abs(eye - this.camEyeY) > 0.6) this.camEyeY = eye;
      else this.camEyeY += (eye - this.camEyeY) * Math.min(1, dt * 20);
      // crouch-like dip while planting/defusing
      const dip = view.plantProgress >= 0 || view.defuseProgress >= 0 ? 0.45 : 0;
      this.camera.position.set(tmp.x, this.camEyeY - dip, tmp.z);
      let yaw = view.yaw;
      if (view.id !== me.id) {
        // smooth bot view when spectating
        let d = yaw - this.lastLookYaw;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        yaw = this.lastLookYaw + d * Math.min(1, dt * 14);
      }
      this.lastLookYaw = yaw;
      this.camera.rotation.set(view.pitch + view.punchPitch, yaw + view.punchYaw, 0);
    }
    if (this.shake > 0) {
      this.camera.rotation.x += (Math.random() - 0.5) * this.shake * 0.03;
      this.camera.rotation.y += (Math.random() - 0.5) * this.shake * 0.03;
      this.shake = Math.max(0, this.shake - dt * 2.5);
    }

    // FOV (AWP scope zoom)
    const def = view.def;
    let targetFov = vfov(BASE_FOV_H);
    if (view.alive && def?.scope && view.scope > 0) targetFov = vfov(def.scope.fovs[view.scope - 1]);
    this.fovCur += (targetFov - this.fovCur) * Math.min(1, dt * 25);
    if (Math.abs(this.fovCur - targetFov) < 0.05) this.fovCur = targetFov;
    if (Math.abs(this.camera.fov - this.fovCur) > 1e-3) {
      this.camera.fov = this.fovCur;
      this.camera.updateProjectionMatrix();
    }

    // bomb
    const b = sim.bomb;
    const showBomb = b.state === 'dropped' || b.state === 'planted' || b.state === 'defused';
    this.effects.setBomb(showBomb, b.pos, now, b.state === 'planted');
    if (b.state === 'planted' && b.defuserId >= 0 && now > this.nextDefuseTick) {
      this.nextDefuseTick = now + 0.32;
      this.audio?.defuseTick(b.pos);
    }
    this.effects.update(paused ? 0 : dt);

    // audio listener
    this.audio?.setListener({ x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z, yaw: this.camera.rotation.y });

    // viewmodel lighting: darker when under a roof (tunnels)
    if (now > this.lightCheckAt) {
      this.lightCheckAt = now + 0.2;
      const cp = this.camera.position;
      const roof = sim.world.raycast(cp.x, cp.y, cp.z, 0, 1, 0, 30);
      this.lightLevel = roof && roof.kind !== 'wall' ? 0.35 : roof ? 0.6 : 1;
    }
    this.viewmodel.setLightLevel(this.lightLevel);
    const vmVisible = !deathCam && view.alive && !(def?.scope && view.scope > 0);
    this.viewmodel.update(view, sim.time, now, dt, this.lastMouse.dx, this.lastMouse.dy, vmVisible);

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    if (vmVisible) {
      this.renderer.clearDepth();
      this.renderer.render(this.viewmodel.scene, this.viewmodel.camera);
    }
  }

  // ------------------------------------------------------------------ HUD
  private buyItems(): BuyItem[] {
    const c = this.sim.controlled;
    const team = c.team;
    const rifle: WeaponId = team === 'T' ? 'ak47' : 'm4a4';
    const pistol: WeaponId = team === 'T' ? 'glock' : 'usp';
    const list: [string, WeaponId][] = [
      ['1', rifle],
      ['2', 'awp'],
      ['3', 'deagle'],
      ['4', pistol],
    ];
    return list.map(([key, id]) => ({ key, id, name: WEAPONS[id].name, owned: c.weapons[WEAPONS[id].slot]?.def.id === id }));
  }

  private publishHud(now: number, force = false) {
    if (!force && now - this.hudAt < 1 / 20) return;
    this.hudAt = now;
    this.hud.set(this.buildHud(now));
  }

  private buildHud(now: number): HudState {
    const sim = this.sim;
    const view = this.viewChar();
    const me = sim.controlled;
    const r = sim.round;
    const w = view.weapon;
    const def = w?.def;
    const b = sim.bomb;
    if (this.message && now > this.messageUntil) this.message = null;
    this.killfeed = this.killfeed.filter((k) => now - k.time < 7);

    const inventory = (['primary', 'secondary', 'melee', 'bomb'] as Slot[])
      .filter((s) => view.weapons[s])
      .map((s) => ({
        slot: s,
        key: s === 'primary' ? '1' : s === 'secondary' ? '2' : s === 'melee' ? '3' : '5',
        name: view.weapons[s]!.def.name,
        active: view.active === s,
      }));

    let progress: HudState['progress'] = null;
    if (view.plantProgress >= 0) progress = { label: '正在安放 C4…', value: view.plantProgress, color: '#ff9f43' };
    else if (view.defuseProgress >= 0) progress = { label: view.hasKit ? '正在拆除（拆弹器）…' : '正在拆除…', value: view.defuseProgress, color: '#4fa3ff' };
    else if (view.reloading && def) progress = null;

    let hint: string | null = null;
    if (me.alive && !me.isBot) {
      if (me.hasBomb() && sim.siteAt(me.pos) && me.plantProgress < 0 && r.phase === 'live') hint = '按住 E（或按 5 后按住左键）安放 C4';
      else if (me.hasBomb() && r.phase !== 'over') {
        const region = sim.world.regionAt(me.pos.x, me.pos.z);
        hint = `你携带着 C4 · 当前位置：${region ? REGION_NAMES[region] : ''}`;
      } else if (me.team === 'CT' && b.state === 'planted' && me.defuseProgress < 0) {
        const d = Math.hypot(me.pos.x - b.pos.x, me.pos.z - b.pos.z);
        if (d < 1.5) hint = '按住 E 拆除 C4';
      }
      if (this.canBuy() && !this.buyOpen && r.phase === 'freeze') hint = hint ?? '按 B 打开购买菜单';
    } else if (!me.alive) {
      hint = this.spectateId >= 0 ? '左键 / 右键 切换观察对象' : null;
    }

    const rows: ScoreRow[] = sim.chars.map((c) => ({
      id: c.id,
      name: c.name,
      team: c.team,
      kills: c.kills,
      deaths: c.deaths,
      hs: c.headshots,
      alive: c.alive,
      me: c.id === me.id,
      bot: c.isBot,
      bomb: c.hasBomb() && c.team === this.opts.team,
    }));

    const spectating = !me.alive && this.spectateId >= 0;
    const specTarget = spectating ? sim.chars[this.spectateId] : null;

    return {
      started: this.started,
      locked: this.input?.locked ?? false,
      playerTeam: this.opts.team,
      round: r.number,
      pistol: r.isPistol,
      phase: r.phase,
      timeLeft: b.state === 'planted' ? Math.max(0, b.explodeTime - sim.time) : r.timeLeft(),
      score: { CT: r.score.CT, T: r.score.T },
      alive: { CT: sim.aliveCount('CT'), T: sim.aliveCount('T') },
      bomb: { state: b.state, site: b.site, timeLeft: Math.max(0, b.explodeTime - sim.time) },
      view: {
        name: view.name,
        team: view.team,
        self: view.id === me.id,
        alive: view.alive,
        health: Math.max(0, Math.round(view.health)),
        armor: Math.round(view.armor),
        helmet: view.helmet,
        kit: view.hasKit,
        weapon: def?.name ?? '',
        weaponId: def?.id ?? null,
        mag: w?.mag ?? 0,
        reserve: w?.reserve ?? 0,
        magSize: def?.magSize ?? 0,
        reloading: view.reloading,
        reloadP: view.reloading ? clamp((sim.time - view.reloadStart) / (view.reloadEnd - view.reloadStart), 0, 1) : 0,
        inventory,
        hasBomb: view.hasBomb(),
        scoped: view.scope > 0,
      },
      spectating,
      canTakeover: !!specTarget && specTarget.team === this.opts.team && specTarget.isBot,
      progress,
      message: this.message,
      killfeed: this.killfeed.slice(),
      hit: this.hit,
      damage: this.damage,
      buyOpen: this.buyOpen,
      canBuy: this.canBuy(),
      buyItems: this.buyItems(),
      scoreboard: this.scoreboard,
      rows,
      matchOver: this.matchOver,
      hint,
      fps: this.fps,
    };
  }
}

export const teamName = (t: Team) => (t === 'CT' ? '反恐精英' : '恐怖分子');
export const enemyOf = otherTeam;
