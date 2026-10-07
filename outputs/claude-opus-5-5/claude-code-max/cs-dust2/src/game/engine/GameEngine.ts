import * as THREE from 'three';
import type { AudioEngine, SoundPos } from '../audio/AudioEngine';
import { RULES, TICK_DT } from '../core/config';
import { clamp, damp, DEG, dirFromAngles, lerp, lerpAngle, wrapAngle, yawFromDir } from '../core/math';
import { ROUND_END_TEXT, TEAM_NAME, type MatchSettings, type Team } from '../core/types';
import { GameRenderer, type CameraView } from '../gfx/Renderer';
import type { ViewModelState } from '../gfx/ViewModel';
import type { Actor } from '../sim/Actor';
import { computeInaccuracy } from '../sim/Combat';
import { World } from '../sim/World';
import { SLOT_KEYS, WEAPONS, type WeaponId, type WeaponSlot } from '../weapons/WeaponDefs';
import { INITIAL_HUD, type Banner, type FastHud, type HudState, type KillfeedEntry, type Notice, type ScoreRow, type SlotInfo } from './HudState';
import { Input } from './Input';
import { Store } from './Store';

/** Buy-menu hotkeys (number row while the menu is open). */
export const BUY_KEYS: { key: string; code: string; item: WeaponId | 'armor' }[] = [
  { key: '1', code: 'Digit1', item: 'ak47' },
  { key: '2', code: 'Digit2', item: 'm4a4' },
  { key: '3', code: 'Digit3', item: 'awp' },
  { key: '4', code: 'Digit4', item: 'glock' },
  { key: '5', code: 'Digit5', item: 'usp' },
  { key: '6', code: 'Digit6', item: 'deagle' },
  { key: '7', code: 'Digit7', item: 'armor' },
];

export interface RadarActor {
  x: number;
  z: number;
  yaw: number;
  team: Team;
  alive: boolean;
  self: boolean;
  hasBomb: boolean;
  name: string;
  viewed: boolean;
}

export interface RadarState {
  actors: RadarActor[];
  bomb: { x: number; z: number; state: string } | null;
  team: Team;
}

const _v = new THREE.Vector3();
const _fwd = new THREE.Vector3();

/**
 * Orchestrates the three update domains:
 *  - simulation: fixed 64 Hz ticks of the World (accumulator, max catch-up)
 *  - rendering: requestAnimationFrame, interpolating actors between ticks, mouse look applied
 *    per frame for zero added latency
 *  - React: throttled immutable HUD snapshots (Store) + a mutable FastHud polled per frame
 * Also routes simulation events to audio, effects and the HUD, and runs spectator/takeover.
 */
export class GameEngine {
  world: World;
  readonly renderer: GameRenderer;
  readonly input = new Input();
  readonly hud = new Store<HudState>({ ...INITIAL_HUD });
  readonly fast: FastHud = {
    crosshairGap: 6,
    showCrosshair: true,
    hitMarker: 0,
    hitKill: false,
    hitHead: false,
    damageDirs: [],
    damageFlash: 0,
    flashbang: 0,
  };
  private settings: MatchSettings;
  private readonly audio: AudioEngine;
  private readonly canvas: HTMLCanvasElement;
  private raf = 0;
  private lastFrame = 0;
  private acc = 0;
  private disposed = false;
  private paused = true;
  private buyOpen = false;
  private scoreboardOpen = false;

  // spectating
  private spectateTarget: Actor | null = null;
  private deathCamActor: Actor | null = null;
  private deathCamUntil = 0;
  private deathCamAngle = 0;
  private viewActor: Actor | null = null;
  private lastViewYaw = 0;
  private lastViewPitch = 0;
  private shake = 0;
  private fovCurrent = 74;

  // hud bookkeeping
  private killfeed: KillfeedEntry[] = [];
  private feedId = 0;
  private banner: Banner | null = null;
  private bannerUntil = 0;
  private notices: Notice[] = [];
  private noticeId = 0;
  private nextPublish = 0;
  private frames = 0;
  private fpsTime = 0;
  private fps = 0;
  private slotsKey = '';
  private slotsCache: SlotInfo[] = [];
  private aliveKey = '';
  private aliveCache: { ct: boolean[]; t: boolean[] } = { ct: [], t: [] };
  private scoreKey = '';
  private scoreCache: ScoreRow[] = [];
  private historyLen = -1;
  private historyCache: HudState['history'] = [];
  private readonly unsubs: (() => void)[] = [];
  private readonly resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, settings: MatchSettings, audio: AudioEngine) {
    this.canvas = canvas;
    this.settings = settings;
    this.audio = audio;
    this.renderer = new GameRenderer(canvas, settings.quality);
    this.world = new World(settings, { humanControlled: true });
    this.renderer.setWorld(this.world);
    this.bindWorld();
    this.input.attach(canvas);
    this.input.onLockChange = (locked) => this.onLockChange(locked);
    this.audio.occlusion = (a, b) => this.world.collision.lineClear(a.x, a.y + 0.2, a.z, b.x, b.y, b.z);
    this.audio.setVolume(settings.volume);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.resize();
    this.hud.set({ ready: true, playerTeam: settings.playerTeam, showFps: settings.showFps });
  }

  // ================================================================== lifecycle

  start(): void {
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.input.detach();
    this.resizeObserver.disconnect();
    for (const u of this.unsubs) u();
    this.audio.stopLoop('plant');
    this.audio.stopLoop('defuse');
    this.renderer.dispose();
  }

  /** Request pointer lock (must be called from a user gesture). */
  resume(): void {
    this.audio.init();
    this.audio.resume();
    this.input.requestLock();
  }

  restartMatch(settings?: MatchSettings): void {
    if (settings) this.settings = settings;
    for (const u of this.unsubs) u();
    this.unsubs.length = 0;
    this.world = new World(this.settings, { humanControlled: true });
    this.renderer.setWorld(this.world);
    this.bindWorld();
    this.killfeed = [];
    this.notices = [];
    this.banner = null;
    this.spectateTarget = null;
    this.deathCamActor = null;
    this.hud.set({ matchWinner: null, killfeed: [], notices: [], banner: null });
  }

  /**
   * Development/automation hook: run without pointer lock (headless browsers cannot lock).
   * Mouse buttons are accepted as if locked.
   */
  debugForceRun(): void {
    this.input.locked = true;
    this.paused = false;
    this.audio.init();
    this.hud.set({ paused: false, locked: true, started: true });
  }

  setSensitivity(v: number): void {
    this.settings = { ...this.settings, sensitivity: v };
  }

  setVolume(v: number): void {
    this.settings = { ...this.settings, volume: v };
    this.audio.setVolume(v);
  }

  get currentSettings(): MatchSettings {
    return this.settings;
  }

  private onLockChange(locked: boolean): void {
    this.paused = !locked;
    if (locked) this.audio.resume();
    else {
      this.audio.suspend();
      this.buyOpen = false;
    }
    this.hud.set({ paused: this.paused, locked, buyOpen: this.buyOpen, ...(locked ? { started: true } : {}) });
  }

  private resize(): void {
    const parent = this.canvas.parentElement;
    const w = Math.max(1, parent ? parent.clientWidth : window.innerWidth);
    const h = Math.max(1, parent ? parent.clientHeight : window.innerHeight);
    const pr = this.settings.quality === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.resize(w, h, pr);
  }

  // ================================================================== frame loop

  private frame = (now: number): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000);
    this.lastFrame = now;

    this.frames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 0.5) {
      this.fps = Math.round(this.frames / this.fpsTime);
      this.frames = 0;
      this.fpsTime = 0;
    }

    const pressed = this.input.consumePressed();
    const mouse = this.input.consumeMouse();
    if (!this.paused) {
      this.handleGlobalKeys(pressed);
      this.applyLook(mouse.dx, mouse.dy);
      this.applyControls(pressed, mouse.wheel);
      this.acc += dt;
      let steps = 0;
      while (this.acc >= TICK_DT && steps < 8) {
        this.world.tick(TICK_DT);
        this.acc -= TICK_DT;
        steps++;
      }
      if (steps === 8) this.acc = 0;
    }
    const alpha = clamp(this.acc / TICK_DT, 0, 1);

    const { view, vm } = this.computeView(alpha, dt);
    this.renderer.viewModel.setLighting(this.renderer.inShadow(view.pos), dt);
    this.renderer.render(this.paused ? 0 : dt, alpha, view, vm);
    dirFromAngles(view.yaw, view.pitch, _fwd);
    this.audio.updateListener(view.pos, _fwd);
    this.updateFastHud(dt, view);
    if (now >= this.nextPublish) {
      this.nextPublish = now + 50;
      this.publishHud();
    }
  };

  // ================================================================== input

  private handleGlobalKeys(pressed: Set<string>): void {
    const w = this.world;
    if (pressed.has('KeyB')) {
      if (this.buyOpen) this.buyOpen = false;
      else if (w.controlled?.alive && w.canBuy()) this.buyOpen = true;
    }
    if (this.buyOpen && (!w.canBuy() || !w.controlled?.alive)) this.buyOpen = false;
    if (this.buyOpen) {
      for (const b of BUY_KEYS) {
        if (pressed.has(b.code)) {
          this.buy(b.item);
          pressed.delete(b.code);
        }
      }
      if (pressed.has('Escape')) this.buyOpen = false;
    }
    this.scoreboardOpen = this.input.isDown('Tab');
  }

  buy(item: WeaponId | 'armor'): boolean {
    const a = this.world.controlled;
    if (!a) return false;
    const ok = item === 'armor' ? this.world.buyArmor(a) : this.world.buy(a, item);
    if (ok) this.audio.pickup();
    else this.audio.uiClick();
    return ok;
  }

  closeBuy(): void {
    this.buyOpen = false;
  }

  private sensitivityScale(): number {
    // CS: degrees per count = sensitivity * m_yaw(0.022); zoomed sensitivity follows FOV ratio
    const a = this.world.controlled;
    let s = this.settings.sensitivity * 0.022 * DEG;
    if (a && a.scopeLevel > 0) {
      const def = a.weapon?.def;
      if (def?.scope) s *= def.scope.fovs[a.scopeLevel - 1] / 74;
    }
    return s;
  }

  private applyLook(dx: number, dy: number): void {
    const a = this.world.controlled;
    if (!a || !a.alive) return;
    const s = this.sensitivityScale();
    a.yaw = wrapAngle(a.yaw - dx * s);
    a.pitch = clamp(a.pitch - dy * s, -89 * DEG, 89 * DEG);
  }

  private applyControls(pressed: Set<string>, wheel: number): void {
    const w = this.world;
    const a = w.controlled;
    const inp = this.input;
    if (a && a.alive) {
      const i = a.input;
      i.forward = (inp.isDown('KeyW') ? 1 : 0) - (inp.isDown('KeyS') ? 1 : 0);
      i.right = (inp.isDown('KeyD') ? 1 : 0) - (inp.isDown('KeyA') ? 1 : 0);
      i.jump = inp.isDown('Space');
      i.walk = inp.isDown('ShiftLeft') || inp.isDown('ShiftRight');
      i.crouch = inp.isDown('KeyC');
      const blockFire = this.buyOpen;
      i.fire = !blockFire && (inp.mouseButtons & 1) !== 0;
      i.alt = (inp.mouseButtons & 4) !== 0;
      if (!blockFire && pressed.has('Mouse0')) i.firePressed = true;
      if (pressed.has('Mouse2')) i.altPressed = true;
      if (pressed.has('KeyR')) i.reload = true;
      i.use = inp.isDown('KeyE');
      if (pressed.has('KeyE')) i.usePressed = true;
      if (pressed.has('KeyG')) i.drop = true;
      if (pressed.has('KeyQ')) i.lastWeapon = true;
      if (!this.buyOpen) {
        SLOT_KEYS.forEach((k, slot) => {
          if (pressed.has(`Digit${k}`)) i.slot = slot as WeaponSlot;
        });
        if (pressed.has('Digit4') && a.weapons[3]) i.slot = 3;
      }
      if (wheel !== 0) {
        const order: WeaponSlot[] = [0, 1, 2, 3];
        const avail = order.filter((s) => a.weapons[s]);
        const idx = avail.indexOf(a.slot);
        if (avail.length > 1) i.slot = avail[(idx + (wheel > 0 ? 1 : -1) + avail.length) % avail.length];
      }
      return;
    }
    // ---- spectator controls
    if (this.deathCamActor && w.time < this.deathCamUntil) {
      if (pressed.has('Mouse0') || pressed.has('Space')) this.deathCamUntil = 0;
      return;
    }
    if (pressed.has('Mouse0') || pressed.has('ArrowRight')) this.cycleSpectate(1);
    if (pressed.has('Mouse2') || pressed.has('ArrowLeft')) this.cycleSpectate(-1);
    if (pressed.has('KeyE')) {
      const t = this.spectateTarget;
      if (t && t.alive && t.team === w.human.team && w.takeOver(t)) {
        t.input.forward = 0;
        this.pushNotice(`你已接管 ${t.name}`, 'neutral');
        this.audio.uiClick();
      }
    }
  }

  private spectateCandidates(): Actor[] {
    const w = this.world;
    const mates = w.actors.filter((x) => x.alive && x.team === w.human.team);
    return mates.length ? mates : w.actors.filter((x) => x.alive);
  }

  private cycleSpectate(dir: number): void {
    const list = this.spectateCandidates();
    if (!list.length) return;
    const idx = this.spectateTarget ? list.indexOf(this.spectateTarget) : -1;
    this.spectateTarget = list[(idx + dir + list.length) % list.length];
  }

  // ================================================================== camera

  private computeView(alpha: number, dt: number): { view: CameraView; vm: ViewModelState | null } {
    const w = this.world;
    const ctrl = w.controlled;
    let actor: Actor | null = null;
    if (ctrl && ctrl.alive) {
      actor = ctrl;
      this.deathCamActor = null;
    } else if (this.deathCamActor && w.time < this.deathCamUntil) {
      actor = null;
    } else {
      if (!this.spectateTarget || !this.spectateTarget.alive) {
        this.spectateTarget = null;
        this.cycleSpectate(1);
      }
      actor = this.spectateTarget;
    }
    this.viewActor = actor;
    this.shake = damp(this.shake, 0, 3, dt);
    const shakeX = (Math.random() - 0.5) * this.shake * 0.05;
    const shakeY = (Math.random() - 0.5) * this.shake * 0.05;

    if (!actor) {
      // third-person death cam orbiting the corpse (or a free overview if nobody is alive)
      const corpse = this.deathCamActor;
      const center = corpse ? _v.copy(corpse.pos) : _v.set(54, 0, 52);
      center.y += corpse ? 0.8 : 30;
      this.deathCamAngle += dt * 0.35;
      const dist = corpse ? 3.6 : 40;
      const off = new THREE.Vector3(Math.sin(this.deathCamAngle) * dist, corpse ? 2.2 : 25, Math.cos(this.deathCamAngle) * dist);
      const desired = center.clone().add(off);
      if (corpse) {
        const d = desired.clone().sub(center);
        const len = d.length();
        d.normalize();
        const col = w.collision;
        let t = len;
        for (let s = 0.4; s <= len; s += 0.2) {
          if (!col.lineClear(center.x, center.y, center.z, center.x + d.x * s, center.y + d.y * s, center.z + d.z * s)) {
            t = Math.max(0.6, s - 0.3);
            break;
          }
        }
        desired.copy(center).addScaledVector(d, t);
      }
      const dir = center.clone().sub(desired);
      const yaw = yawFromDir(dir.x, dir.z);
      const pitch = Math.atan2(dir.y, Math.hypot(dir.x, dir.z));
      this.fovCurrent = damp(this.fovCurrent, 74, 10, dt);
      return { view: { pos: desired, yaw, pitch, roll: 0, fov: this.fovCurrent, firstPerson: null }, vm: null };
    }

    const human = !actor.isBot;
    const pos = new THREE.Vector3().lerpVectors(actor.prevPos, actor.pos, alpha);
    pos.y += actor.eyeHeight;
    let yaw = human ? actor.yaw : lerpAngle(actor.prevYaw, actor.yaw, alpha);
    let pitch = human ? actor.pitch : lerp(actor.prevPitch, actor.pitch, alpha);
    const def = actor.weapon?.def;
    if (def) {
      pitch += actor.recoilPitch * def.recoil.viewPunch * DEG;
      yaw -= actor.recoilYaw * def.recoil.viewPunch * DEG;
    }
    pitch += shakeY;
    yaw += shakeX;
    let targetFov = 74;
    if (def?.scope && actor.scopeLevel > 0) targetFov = def.scope.fovs[actor.scopeLevel - 1];
    this.fovCurrent = actor.scopeLevel > 0 ? targetFov : damp(this.fovCurrent, targetFov, 18, dt);

    const dYaw = wrapAngle(yaw - this.lastViewYaw);
    const dPitch = pitch - this.lastViewPitch;
    this.lastViewYaw = yaw;
    this.lastViewPitch = pitch;

    const renderTime = w.time - TICK_DT + alpha * TICK_DT;
    let vm: ViewModelState | null = null;
    if (actor.alive) {
      const wdef = actor.weapon?.def;
      vm = {
        weapon: actor.weaponId,
        team: actor.team,
        time: renderTime,
        drawStart: actor.drawEnd - (wdef?.drawTime ?? 0.5),
        drawEnd: actor.drawEnd,
        reloading: actor.reloading,
        reloadStart: actor.reloadStart,
        reloadEnd: actor.reloadEnd,
        kick: actor.kick,
        scoped: actor.scopeLevel > 0,
        busy: actor.planting || actor.defusing,
        speed: Math.hypot(actor.vel.x, actor.vel.z),
        maxSpeed: actor.maxSpeed(),
        onGround: actor.onGround,
        dYaw: Math.abs(dYaw) > 0.5 ? 0 : dYaw,
        dPitch: Math.abs(dPitch) > 0.5 ? 0 : dPitch,
      };
    }
    return { view: { pos, yaw, pitch, roll: 0, fov: this.fovCurrent, firstPerson: actor }, vm };
  }

  private updateFastHud(dt: number, view: CameraView): void {
    const f = this.fast;
    const a = this.viewActor;
    f.hitMarker = Math.max(0, f.hitMarker - dt * 3.5);
    f.damageFlash = Math.max(0, f.damageFlash - dt * 1.8);
    for (const d of f.damageDirs) d.alpha -= dt * 0.7;
    f.damageDirs = f.damageDirs.filter((d) => d.alpha > 0);
    if (!a || !a.alive) {
      f.showCrosshair = false;
      return;
    }
    const def = a.weapon?.def;
    f.showCrosshair = !!def && !(def.kind === 'sniper') && a.scopeLevel === 0;
    if (def) {
      const inacc = computeInaccuracy(a, def);
      const h = this.canvas.clientHeight || 800;
      const px = (h / 2) * (Math.tan(inacc * DEG) / Math.tan((view.fov * DEG) / 2));
      f.crosshairGap = clamp(3 + px * 0.9 + a.kick * 5, 3, 140);
    }
  }

  // ================================================================== world events -> audio / fx / hud

  private isViewed(a: Actor): boolean {
    return this.viewActor === a;
  }

  private spatial(a: Actor): SoundPos | null {
    return this.isViewed(a) ? null : { x: a.pos.x, y: a.pos.y + 1.5, z: a.pos.z };
  }

  private bindWorld(): void {
    const ev = this.world.events;
    const fx = this.renderer.effects;
    const on = <K extends Parameters<typeof ev.on>[0]>(k: K, fn: Parameters<typeof ev.on<K>>[1]) => this.unsubs.push(ev.on(k, fn));

    on('shot', (e) => {
      const def = WEAPONS[e.weapon];
      if (this.isViewed(e.actor)) {
        this.renderer.viewModel.onShot();
        const cam = this.renderer.camera;
        const right = _v.set(1, 0, 0).applyQuaternion(cam.quaternion);
        const start = cam.position.clone().addScaledVector(dirFromAngles(e.actor.yaw, e.actor.pitch, _fwd), 0.9).addScaledVector(right, 0.12);
        start.y -= 0.12;
        if (def.id !== 'usp' && Math.random() < 0.6) fx.tracer(start, e.end);
        this.audio.gunshot(def.sound, null);
        if (def.id !== 'usp') fx.flashLight(start, 10, 6, 0.05);
      } else {
        const muzzle = e.actor.model.muzzleWorld(new THREE.Vector3());
        if (def.id !== 'usp') fx.muzzleFlash(muzzle, def.kind === 'sniper' ? 0.7 : def.kind === 'pistol' ? 0.32 : 0.45);
        if (def.id !== 'usp' || Math.random() < 0.3) fx.tracer(muzzle, e.end);
        this.audio.gunshot(def.sound, { x: e.origin.x, y: e.origin.y, z: e.origin.z });
      }
    });
    on('impact', (e) => fx.impact(e.point, e.normal, e.material));
    on('damage', (e) => {
      // no blood cloud inside the first-person camera
      if (e.group !== null && !this.isViewed(e.victim)) fx.blood(e.point, e.dir, e.group === 'head');
      const ctrl = this.world.controlled;
      if (this.isViewed(e.victim)) {
        this.fast.damageFlash = Math.min(1, this.fast.damageFlash + 0.35 + e.amount / 120);
        const src = e.attacker ? e.attacker.pos : e.victim.pos.clone().sub(e.dir);
        const yawTo = yawFromDir(src.x - e.victim.pos.x, src.z - e.victim.pos.z);
        this.fast.damageDirs.push({ angle: wrapAngle(e.victim.yaw - yawTo), alpha: 1 });
        if (this.fast.damageDirs.length > 6) this.fast.damageDirs.shift();
        this.shake = Math.min(1.2, this.shake + e.amount / 60);
        this.audio.hurt();
      }
      if (ctrl && e.attacker === ctrl && e.victim !== ctrl) {
        this.fast.hitMarker = 1;
        this.fast.hitHead = e.group === 'head';
        this.fast.hitKill = false;
        this.audio.hitMarker(e.group === 'head');
      }
    });
    on('kill', (e) => {
      const ctrl = this.world.controlled;
      const human = this.world.human;
      this.killfeed = [
        ...this.killfeed.slice(-5),
        {
          id: ++this.feedId,
          killer: e.killer ? e.killer.name : null,
          killerTeam: e.killer ? e.killer.team : null,
          victim: e.victim.name,
          victimTeam: e.victim.team,
          weapon: e.weapon === 'c4' ? 'C4' : e.weapon === 'fall' ? '坠落' : WEAPONS[e.weapon].feed,
          headshot: e.headshot,
          time: performance.now(),
          mine: e.killer === ctrl || e.victim === ctrl || e.killer === human || e.victim === human,
        },
      ];
      if (ctrl && e.killer === ctrl && e.victim !== ctrl) {
        this.fast.hitKill = true;
        this.fast.hitMarker = 1;
        this.audio.killConfirm(e.headshot);
      }
      if (this.viewActor === e.victim || e.victim === ctrl) {
        // controlled (or spectated) actor died: short death cam, then spectate a teammate
        this.deathCamActor = e.victim;
        this.deathCamUntil = this.world.time + 2.6;
        this.deathCamAngle = e.victim.yaw + Math.PI;
        this.spectateTarget = null;
      }
      if (e.victim === ctrl) {
        if (e.weapon === 'c4') this.pushNotice('你被 C4 爆炸炸死', 'warn');
        else if (e.killer) this.pushNotice(`你被 ${e.killer.name}（${WEAPONS[e.weapon as WeaponId]?.name ?? e.weapon}${e.headshot ? '，爆头' : ''}）击杀`, 'warn');
        else this.pushNotice('你阵亡了', 'warn');
      }
    });
    on('reload', (e) => this.audio.reload(WEAPONS[e.weapon].kind, WEAPONS[e.weapon].reloadTime, this.spatial(e.actor)));
    on('draw', (e) => {
      if (this.isViewed(e.actor)) this.audio.draw(WEAPONS[e.weapon].kind, null);
    });
    on('dryFire', (e) => {
      if (this.isViewed(e.actor)) this.audio.dryFire();
    });
    on('scope', (e) => {
      if (this.isViewed(e.actor)) this.audio.scope(e.level);
    });
    on('footstep', (e) => this.audio.footstep(this.isViewed(e.actor) ? null : { x: e.pos.x, y: e.pos.y + 0.1, z: e.pos.z }));
    on('land', (e) => {
      this.audio.land(this.spatial(e.actor), e.speed);
      if (this.isViewed(e.actor)) this.renderer.viewModel.onLand(e.speed);
    });
    on('knife', (e) => {
      this.audio.knife(this.spatial(e.actor), e.hit);
      if (this.isViewed(e.actor)) this.renderer.viewModel.onKnife(e.alt);
    });
    on('pickup', (e) => {
      if (e.actor === this.world.controlled) {
        this.audio.pickup();
        this.pushNotice(`拾取了 ${WEAPONS[e.weapon].name}`, 'neutral');
      }
    });
    on('bombPickup', (e) => {
      if (e.actor === this.world.controlled) this.audio.pickup();
      if (this.world.human.team === 'T') this.pushNotice(`${e.actor.name} 拾取了 C4 炸弹`, 't');
    });
    on('bombDrop', (e) => {
      if (this.world.human.team === 'T') this.pushNotice(`${e.actor.name} 丢下了 C4 炸弹！`, 'warn');
    });
    on('plantStart', (e) => this.audio.plantSequence(this.spatial(e.actor), RULES.plantTime));
    on('plantAbort', () => this.audio.stopLoop('plant'));
    on('bombPlanted', (e) => {
      this.audio.bombPlanted(this.isViewed(e.actor) ? null : { x: e.pos.x, y: e.pos.y, z: e.pos.z });
      this.showBanner(`炸弹已安放在 ${e.site} 点`, `${RULES.bombTimer} 秒后爆炸 —— 反恐精英需要拆除炸弹`, 'warn', 3.5);
    });
    on('bombBeep', (e) => this.audio.c4Beep({ x: e.pos.x, y: e.pos.y + 0.2, z: e.pos.z }, e.urgency));
    on('defuseStart', (e) => {
      this.audio.defuseLoop(this.spatial(e.actor), e.kit ? RULES.defuseKitTime : RULES.defuseTime);
      if (this.world.human.team === 'CT' && !this.isViewed(e.actor)) this.pushNotice(`${e.actor.name} 正在拆除炸弹${e.kit ? '（拆弹器）' : ''}`, 'ct');
    });
    on('defuseAbort', () => this.audio.stopLoop('defuse'));
    on('bombDefused', () => this.audio.bombDefused());
    on('bombExploded', (e) => {
      fx.explosion(e.pos);
      this.audio.explosion({ x: e.pos.x, y: e.pos.y + 1, z: e.pos.z });
      const d = this.viewActor ? this.viewActor.pos.distanceTo(e.pos) : 30;
      this.shake = Math.max(this.shake, clamp(2.5 - d / 25, 0.3, 2.5));
    });
    on('roundStart', (e) => {
      this.renderer.clearTransient();
      this.audio.stopLoop('plant');
      this.audio.stopLoop('defuse');
      this.spectateTarget = null;
      this.deathCamActor = null;
      this.showBanner(
        e.pistol ? `第 ${e.round} 回合 · 手枪局` : `第 ${e.round} 回合`,
        e.pistol
          ? '全员仅持默认手枪（T: Glock-18 / CT: USP-S），无主武器 · 按 B 购买手枪'
          : '长枪局：全甲 + 主武器 · 冻结时间内按 B 打开购买菜单',
        'neutral',
        RULES.freezeTime,
      );
      const h = this.world.human;
      if (h.hasBomb) this.pushNotice('你携带着 C4！前往 A 点或 B 点，按住 E（或切到 5 号位按住左键）安放', 't');
    });
    on('roundLive', () => {
      this.banner = null;
      this.pushNotice('回合开始！', 'neutral');
    });
    on('roundEnd', (e) => {
      const humanTeam = this.world.human.team;
      this.showBanner(`${TEAM_NAME[e.winner]}获胜！`, ROUND_END_TEXT[e.reason], e.winner === 'CT' ? 'ct' : 't', RULES.postRoundTime);
      this.audio.roundJingle(e.winner === humanTeam);
    });
    on('matchEnd', (e) => {
      this.hud.set({ matchWinner: e.winner });
    });
  }

  private showBanner(title: string, sub: string | undefined, tone: Banner['tone'], seconds: number): void {
    this.banner = { key: Date.now() + Math.random(), title, sub, tone };
    this.bannerUntil = performance.now() + seconds * 1000;
  }

  private pushNotice(text: string, tone: Notice['tone']): void {
    this.notices = [...this.notices.slice(-3), { key: ++this.noticeId, text, tone }];
    const key = this.noticeId;
    setTimeout(() => {
      this.notices = this.notices.filter((n) => n.key !== key);
    }, 4200);
  }

  // ================================================================== HUD publishing

  private publishHud(): void {
    const w = this.world;
    const a = this.viewActor;
    const ctrl = w.controlled;
    const now = performance.now();
    if (this.banner && now > this.bannerUntil) this.banner = null;
    this.killfeed = this.killfeed.filter((k) => now - k.time < 7000);

    // alive pips
    const ct = w.actors.filter((x) => x.team === 'CT').map((x) => x.alive);
    const t = w.actors.filter((x) => x.team === 'T').map((x) => x.alive);
    const ak = ct.join() + '|' + t.join();
    if (ak !== this.aliveKey) {
      this.aliveKey = ak;
      this.aliveCache = { ct, t };
    }

    // slots
    let slots = this.slotsCache;
    if (a) {
      const sk = a.weapons.map((x) => x?.def.id ?? '-').join() + a.slot;
      if (sk !== this.slotsKey) {
        this.slotsKey = sk;
        slots = [];
        a.weapons.forEach((wi, i) => {
          if (wi) slots.push({ slot: i, key: SLOT_KEYS[i], id: wi.def.id, name: wi.def.name, active: a.slot === i });
        });
        this.slotsCache = slots;
      }
    }

    // scoreboard rows (only while open)
    let scoreboard = this.scoreCache;
    if (this.scoreboardOpen || w.phase === 'over') {
      const rows: ScoreRow[] = w.actors.map((x) => ({
        id: x.id,
        name: x.name,
        team: x.team,
        alive: x.alive,
        kills: x.kills,
        deaths: x.deaths,
        headshots: x.headshots,
        damage: x.damageDealt,
        isHuman: x.isHumanSlot,
        isControlled: x === ctrl,
        hasBomb: x.hasBomb && x.team === w.human.team,
      }));
      const key = JSON.stringify(rows);
      if (key !== this.scoreKey) {
        this.scoreKey = key;
        this.scoreCache = rows;
        scoreboard = rows;
      }
    }

    if (w.history.length !== this.historyLen) {
      this.historyLen = w.history.length;
      this.historyCache = [...w.history];
    }

    const wi = a?.weapon;
    const site = a && a.alive && a.hasBomb ? w.level.bombsiteAt(a.pos.x, a.pos.z) : null;
    let actionHint: string | null = null;
    if (ctrl && ctrl.alive) {
      if (ctrl.hasBomb && site && w.phase === 'live' && !ctrl.planting) actionHint = `你在 ${site.id} 炸弹安放区 —— 按住 E 安放 C4`;
      else if (ctrl.team === 'CT' && w.bomb.state === 'planted' && w.inBombReach(ctrl) && !ctrl.defusing) actionHint = `按住 E 拆除炸弹${ctrl.hasKit ? '（拆弹器 5 秒）' : '（10 秒）'}`;
      else if (ctrl.hasBomb && w.phase === 'live') actionHint = null;
    } else if (!ctrl && this.spectateTarget && this.spectateTarget.alive && this.spectateTarget.team === w.human.team && !(this.deathCamActor && w.time < this.deathCamUntil)) {
      actionHint = null;
    }
    const spectating = !ctrl || !ctrl.alive;
    const deathCam = !!this.deathCamActor && w.time < this.deathCamUntil;
    const canTakeover = spectating && !deathCam && !!this.spectateTarget && this.spectateTarget.alive && this.spectateTarget.team === w.human.team && w.phase !== 'over';

    this.hud.set({
      paused: this.paused,
      phase: w.phase,
      round: w.roundNumber,
      pistolRound: w.isPistolRound,
      clock: Math.ceil(w.clock),
      bombPlanted: w.bomb.state === 'planted',
      scoreCT: w.score.CT,
      scoreT: w.score.T,
      aliveCT: this.aliveCache.ct,
      aliveT: this.aliveCache.t,
      playerTeam: w.human.team,
      viewName: a ? a.name : deathCam && this.deathCamActor ? this.deathCamActor.name : '',
      viewTeam: a ? a.team : w.human.team,
      spectating,
      deathCam,
      canTakeover,
      controllingBot: ctrl && ctrl !== w.human ? ctrl.name : null,
      health: a ? a.health : 0,
      armor: a ? a.armor : 0,
      helmet: a ? a.helmet : false,
      hasKit: a ? a.hasKit : false,
      hasBomb: a ? a.hasBomb : false,
      weapon: wi
        ? { id: wi.def.id, name: wi.def.name, kind: wi.def.kind, ammo: wi.ammo, mag: wi.def.magSize, reserve: wi.reserve }
        : null,
      slots,
      reloading: a ? a.reloading : false,
      scoped: a ? a.scopeLevel > 0 : false,
      inBombsite: site ? site.id : null,
      plantProgress: a && a.planting ? Math.min(1, a.plantProgress / RULES.plantTime) : null,
      defuseProgress: a && a.defusing ? Math.min(1, a.defuseProgress / (a.hasKit ? RULES.defuseKitTime : RULES.defuseTime)) : null,
      actionHint,
      location: a ? w.level.zoneAt(a.pos.x, a.pos.z) : '',
      killfeed: this.killfeed,
      banner: this.banner,
      notices: this.notices,
      buyOpen: this.buyOpen,
      canBuy: w.canBuy() && !!ctrl?.alive,
      scoreboardOpen: this.scoreboardOpen,
      scoreboard,
      matchWinner: w.matchWinner && w.phase === 'over' ? w.matchWinner : null,
      history: this.historyCache,
      fps: this.fps,
      lastRoundEnd: w.lastWinner && w.lastReason ? (w.phase === 'post' ? { winner: w.lastWinner, reason: w.lastReason } : null) : null,
    });
  }

  // ================================================================== radar

  radar(): RadarState {
    const w = this.world;
    const team = w.human.team;
    const actors: RadarActor[] = [];
    const ctrl = w.controlled;
    for (const x of w.actors) {
      const mate = x.team === team;
      if (!mate && !w.isSpottedBy(x, team)) continue;
      actors.push({
        x: x.pos.x,
        z: x.pos.z,
        yaw: x.yaw,
        team: x.team,
        alive: x.alive,
        self: x === ctrl || (!ctrl && x === w.human),
        hasBomb: x.hasBomb && (mate || w.isSpottedBy(x, team)),
        name: x.name,
        viewed: x === this.viewActor,
      });
    }
    const b = w.bomb;
    let bomb: RadarState['bomb'] = null;
    if (b.state === 'planted' || b.state === 'defused' || b.state === 'exploded') bomb = { x: b.pos.x, z: b.pos.z, state: b.state };
    else if (b.state === 'dropped' && team === 'T') bomb = { x: b.pos.x, z: b.pos.z, state: 'dropped' };
    else if (b.state === 'carried' && b.carrier && (team === 'T' || w.isSpottedBy(b.carrier, team))) bomb = { x: b.pos.x, z: b.pos.z, state: 'carried' };
    return { actors, bomb, team };
  }
}
