// Client runtime: owns the renderer, input, audio and the fixed-step loop that
// drives the Sim. Bridges the simulation to React via a throttled HUD store.
//
//   requestAnimationFrame ─┬─ input → controlled entity intent
//                          ├─ fixed 60 Hz sim.step() (accumulator)
//                          ├─ drain sim.events → audio / fx / killfeed
//                          ├─ interpolate + render world & viewmodel
//                          └─ every ~33 ms publish HudState → React

import * as THREE from 'three';
import { AudioEngine } from '../audio/sound.ts';
import { DEFUSE_RANGE, DEFUSE_TIME, EYE_HEIGHT, PLANT_TIME, TICK } from '../core/constants.ts';
import type { Difficulty } from '../core/constants.ts';
import type { Entity, Team } from '../core/entity.ts';
import { regionAt, siteAt } from '../core/map.ts';
import { clamp, dist, wrapAngle } from '../core/math.ts';
import { Sim } from '../core/sim.ts';
import { ROUND_CONFIG, WEAPONS } from '../core/weapons.ts';
import type { Slot, WeaponId } from '../core/weapons.ts';
import { CharacterView } from '../render/character.ts';
import { Effects } from '../render/effects.ts';
import { buildBomb } from '../render/gunModels.ts';
import { buildMapView, buildSky } from '../render/mapView.ts';
import { muzzleFlashTexture } from '../render/textures.ts';
import { ViewModel } from '../render/viewModel.ts';
import { Store } from './store.ts';
import type { HudState, KillfeedEntry, ScoreRow } from './store.ts';

export interface GameOptions {
  team: Team;
  difficulty: Difficulty;
  pistolStart: boolean;
  winsToMatch: number;
  sensitivity: number;
  volume: number;
  playerName: string;
}

const BASE_FOV = 78;
const SLOT_ORDER: Slot[] = ['primary', 'secondary', 'melee'];

export class Game {
  readonly sim: Sim;
  readonly store: Store<HudState>;
  readonly opts: GameOptions;
  readonly audio: AudioEngine;
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private vm: ViewModel;
  private fx: Effects;
  private chars = new Map<number, CharacterView>();
  private bombModel: THREE.Group;
  private keys = new Set<string>();
  private mouseLeft = false;
  private locked = false;
  private buyOpen = false;
  private showScores = false;
  private specId = -1;
  private acc = 0;
  private lastT = 0;
  private raf = 0;
  private lastHud = 0;
  private killfeed: KillfeedEntry[] = [];
  private kfKey = 0;
  private hitmarkerAt = -1e4;
  private hitmarkerHead = false;
  private killmarkerAt = -1e4;
  private damageAt = -1e4;
  private banner: HudState['banner'] = null;
  private bannerUntil = 0;
  private disposed = false;
  private tmp = new THREE.Vector3();
  private listeners: [EventTarget, string, EventListener, AddEventListenerOptions?][] = [];

  constructor(container: HTMLElement, opts: GameOptions) {
    this.opts = opts;
    this.container = container;
    this.sim = new Sim({
      playerTeam: opts.team,
      difficulty: opts.difficulty,
      startWithPistolRound: opts.pistolStart,
      winsToMatch: opts.winsToMatch,
      playerName: opts.playerName,
    });

    // renderer
    const r = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setSize(container.clientWidth, container.clientHeight);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.autoClear = false;
    r.domElement.style.display = 'block';
    container.appendChild(r.domElement);
    this.renderer = r;

    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(BASE_FOV, aspect, 0.05, 1200);
    this.camera.rotation.order = 'YXZ';

    // world
    const sky = 0xe8d6b4;
    this.scene.background = new THREE.Color(sky);
    this.scene.fog = new THREE.Fog(sky, 80, 340);
    this.scene.add(buildSky());
    this.scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x9a7b55, 1.25));
    const sun = new THREE.DirectionalLight(0xfff0d0, 2.4);
    sun.position.set(45, 90, 30);
    sun.target.position.set(0, 0, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -80;
    sc.right = 80;
    sc.top = 80;
    sc.bottom = -80;
    sc.near = 1;
    sc.far = 260;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.05;
    this.scene.add(sun, sun.target);
    this.scene.add(buildMapView(this.sim.map));

    const flashMat = new THREE.MeshBasicMaterial({
      map: muzzleFlashTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    for (const e of this.sim.entities) {
      const cv = new CharacterView(e.team, flashMat);
      this.scene.add(cv.root);
      this.chars.set(e.id, cv);
    }
    this.bombModel = buildBomb();
    this.bombModel.visible = false;
    this.scene.add(this.bombModel);

    this.vm = new ViewModel(aspect);
    this.fx = new Effects(this.scene);
    this.audio = new AudioEngine(opts.volume);
    this.store = new Store<HudState>(this.buildHud(0));

    this.bindInput();
    this.raf = requestAnimationFrame(this.frame);
  }

  // ------------------------------------------------------------------ input

  private on(target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) {
    target.addEventListener(type, fn, opts);
    this.listeners.push([target, type, fn, opts]);
  }

  private requestLock() {
    const c = this.renderer.domElement;
    try {
      const p = c.requestPointerLock() as unknown as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* ignore */
    }
  }

  private bindInput() {
    const canvas = this.renderer.domElement;
    this.on(canvas, 'click', () => {
      this.audio.unlock();
      if (!this.buyOpen && !this.locked) this.requestLock();
    });
    this.on(canvas, 'contextmenu', (e) => e.preventDefault());
    this.on(document, 'pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      if (!this.locked) {
        this.mouseLeft = false;
        this.keys.clear();
      }
      this.publish();
    });
    this.on(document, 'mousemove', (ev) => {
      if (!this.locked) return;
      const m = ev as MouseEvent;
      this.look(m.movementX, m.movementY);
    });
    this.on(document, 'mousedown', (ev) => {
      if (!this.locked) return;
      const m = ev as MouseEvent;
      if (m.button === 0) {
        this.mouseLeft = true;
        if (!this.sim.controlled.alive) this.cycleSpectate(1);
      } else if (m.button === 2) {
        if (this.sim.controlled.alive) this.sim.controlled.input.alt = true;
        else this.cycleSpectate(-1);
      }
    });
    this.on(document, 'mouseup', (ev) => {
      if ((ev as MouseEvent).button === 0) this.mouseLeft = false;
    });
    this.on(
      document,
      'wheel',
      (ev) => {
        if (!this.locked) return;
        this.cycleWeapon((ev as WheelEvent).deltaY > 0 ? 1 : -1);
      },
      { passive: true },
    );
    this.on(window, 'keydown', (ev) => {
      const k = ev as KeyboardEvent;
      if (k.code === 'Tab') {
        k.preventDefault();
        this.showScores = true;
        this.publish();
        return;
      }
      if (k.code === 'KeyB' && !k.repeat) {
        this.toggleBuy();
        return;
      }
      if (k.code === 'Escape' && this.buyOpen) {
        this.closeBuy();
        return;
      }
      if (!this.locked) return;
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyR'].includes(k.code)) k.preventDefault();
      if (k.repeat) return;
      this.keys.add(k.code);
      const c = this.sim.controlled;
      switch (k.code) {
        case 'Digit1':
          c.input.switchSlot = 'primary';
          break;
        case 'Digit2':
          c.input.switchSlot = 'secondary';
          break;
        case 'Digit3':
          c.input.switchSlot = 'melee';
          break;
        case 'KeyQ':
          c.input.switchSlot = c.prevSlot;
          break;
        case 'KeyR':
          c.input.reload = true;
          break;
        case 'KeyE':
          if (!c.alive) this.takeover();
          break;
      }
    });
    this.on(window, 'keyup', (ev) => {
      const k = ev as KeyboardEvent;
      this.keys.delete(k.code);
      if (k.code === 'Tab') {
        this.showScores = false;
        this.publish();
      }
    });
    this.on(window, 'resize', () => this.resize());
    this.on(window, 'blur', () => {
      this.keys.clear();
      this.mouseLeft = false;
    });
  }

  private look(dx: number, dy: number) {
    const e = this.sim.controlled;
    if (!e.alive || this.buyOpen) return;
    const s = 0.0022 * this.opts.sensitivity * (this.camera.fov / BASE_FOV);
    e.yaw = wrapAngle(e.yaw - dx * s);
    e.pitch = clamp(e.pitch - dy * s, -1.5, 1.5);
    this.vm.addLook(dx, dy);
  }

  private cycleWeapon(dir: number) {
    const e = this.sim.controlled;
    if (!e.alive) return;
    let i = SLOT_ORDER.indexOf(e.slot);
    for (let k = 0; k < 3; k++) {
      i = (i + dir + 3) % 3;
      if (e.weapons[SLOT_ORDER[i]]) {
        e.input.switchSlot = SLOT_ORDER[i];
        return;
      }
    }
  }

  private cycleSpectate(dir: number) {
    const c = this.sim.spectateCandidates();
    if (!c.length) return;
    const i = c.findIndex((e) => e.id === this.specId);
    this.specId = c[(i + dir + c.length) % c.length].id;
  }

  private takeover() {
    const v = this.viewEntity();
    if (v && v.id !== this.sim.controlledId && this.sim.takeOver(v.id)) this.publish();
  }

  toggleBuy() {
    if (this.buyOpen) this.closeBuy();
    else if (this.sim.canBuy()) {
      this.buyOpen = true;
      if (document.pointerLockElement) document.exitPointerLock();
      this.publish();
    }
  }

  closeBuy() {
    this.buyOpen = false;
    this.requestLock();
    this.publish();
  }

  buy(id: WeaponId) {
    this.audio.unlock();
    if (this.sim.buy(id)) this.audio.switchWeapon();
    this.publish();
  }

  restartMatch() {
    this.sim.restartMatch();
    this.killfeed = [];
    this.publish();
  }

  resumePlay() {
    this.audio.unlock();
    this.requestLock();
  }

  private applyInput() {
    const e = this.sim.controlled;
    const inp = e.input;
    if (!e.alive || !this.locked || this.buyOpen) {
      inp.moveF = 0;
      inp.moveR = 0;
      inp.fire = false;
      inp.jump = false;
      inp.use = false;
      inp.walk = false;
      return;
    }
    const k = this.keys;
    inp.moveF = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    inp.moveR = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    inp.jump = k.has('Space');
    inp.walk = k.has('ShiftLeft') || k.has('ShiftRight');
    inp.fire = this.mouseLeft;
    inp.use = k.has('KeyE');
  }

  // ------------------------------------------------------------------ loop

  private frame = (t: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = this.lastT ? Math.min(0.1, (t - this.lastT) / 1000) : 0;
    this.lastT = t;
    this.applyInput();
    this.acc += dt;
    let n = 0;
    while (this.acc >= TICK && n < 6) {
      this.sim.step(TICK);
      this.acc -= TICK;
      n++;
    }
    if (n === 6) this.acc = 0;
    this.handleEvents(t);
    this.render(dt, this.acc / TICK);
    if (t - this.lastHud > 33) {
      this.lastHud = t;
      this.publish();
    }
  };

  /** Entity whose eyes we are looking through (null = death cam / overview). */
  viewEntity(): Entity | null {
    const sim = this.sim;
    const c = sim.controlled;
    if (c.alive) return c;
    if (sim.time - c.deathTime < 2 && sim.phase !== 'freeze') return null;
    const cands = sim.spectateCandidates();
    if (!cands.length) return null;
    let t = cands.find((e) => e.id === this.specId);
    if (!t) {
      t = cands[0];
      this.specId = t.id;
    }
    return t;
  }

  private handleEvents(now: number) {
    const sim = this.sim;
    const view = this.viewEntity();
    const viewId = view ? view.id : -1;
    for (const ev of sim.events) {
      switch (ev.type) {
        case 'shot': {
          const own = ev.shooter === viewId;
          this.audio.gunshot(ev.sound, ev.origin, own);
          const from = this.tmp;
          if (own) {
            this.vm.onShot();
            this.vm.muzzleWorld(this.camera, from);
          } else {
            const cv = this.chars.get(ev.shooter);
            if (cv) {
              cv.onShot();
              cv.muzzleWorld(from);
            } else from.set(ev.origin.x, ev.origin.y, ev.origin.z);
          }
          if (ev.weapon !== 'usp' || Math.random() < 0.5) this.fx.tracer(from, ev.end);
          if (ev.weapon !== 'usp') this.fx.flashLight(from, own ? 2.5 : 5, 0.05);
          if (ev.wallNormal) this.fx.impact(ev.end, ev.wallNormal);
          break;
        }
        case 'knife': {
          const e = sim.byId.get(ev.shooter)!;
          if (ev.shooter === viewId) this.vm.onKnife(ev.stab);
          this.audio.knifeSwish(ev.shooter === viewId ? null : e.pos, ev.hit);
          break;
        }
        case 'damage':
          this.fx.blood(ev.point);
          if (ev.attacker === viewId) {
            this.hitmarkerAt = now;
            this.hitmarkerHead = ev.group === 'head';
            this.audio.hitMarker(ev.group === 'head');
          }
          if (ev.victim === viewId) {
            this.damageAt = now;
            this.audio.hurt();
            this.fx.addShake(0.12);
          }
          break;
        case 'kill': {
          const killer = ev.killer >= 0 ? sim.byId.get(ev.killer)! : null;
          const victim = sim.byId.get(ev.victim)!;
          this.killfeed.push({
            key: this.kfKey++,
            killer: killer ? killer.name : null,
            killerTeam: killer ? killer.team : null,
            victim: victim.name,
            victimTeam: victim.team,
            weapon: ev.weapon,
            headshot: ev.headshot,
            mine: ev.killer === sim.controlledId || ev.victim === sim.controlledId,
            time: now,
          });
          if (this.killfeed.length > 6) this.killfeed.shift();
          if (ev.killer === viewId) {
            this.killmarkerAt = now;
            this.audio.killConfirm(ev.headshot);
          }
          break;
        }
        case 'reload': {
          const e = sim.byId.get(ev.id)!;
          const own = ev.id === viewId;
          if (own || dist(e.pos, this.camera.position) < 25) this.audio.reload(e.pos, own, ev.time);
          break;
        }
        case 'dryfire':
          if (ev.id === viewId) this.audio.dryFire(true);
          break;
        case 'switch':
          if (ev.id === viewId) this.audio.switchWeapon();
          break;
        case 'scope':
          if (ev.id === viewId) this.audio.scope(ev.level);
          break;
        case 'footstep':
          this.audio.footstep(ev.pos, ev.id === viewId, ev.loud);
          break;
        case 'land':
          this.audio.land(ev.pos, ev.id === viewId);
          break;
        case 'plantStart':
          this.audio.plantTyping(ev.id === viewId ? null : ev.pos);
          break;
        case 'planted':
          this.audio.planted();
          this.showBanner('炸弹已安放', `${ev.site} 点 · 40 秒后爆炸`, 'T', 2600);
          break;
        case 'defuseStart':
          this.audio.defuseStart(ev.id === viewId ? null : ev.pos);
          break;
        case 'defused':
          this.audio.defused();
          break;
        case 'bombBeep':
          this.audio.bombBeep(ev.pos, ev.urgency);
          break;
        case 'explode':
          this.fx.explosion(ev.pos);
          this.audio.explosion(ev.pos, dist(ev.pos, this.camera.position));
          break;
        case 'bombPickup':
          if (ev.id === sim.controlledId) this.audio.bombPickup();
          break;
        case 'roundStart': {
          const conf = ROUND_CONFIG[ev.roundType];
          this.showBanner(`第 ${ev.round} 回合`, `${conf.label} · ${ev.roundType === 'pistol' ? '仅默认手枪，无护甲' : '步枪 + 全甲'} · 按 B 选择武器`, null, 3000);
          this.audio.roundStart();
          this.killfeed = [];
          this.specId = -1;
          if (this.buyOpen) this.publish();
          break;
        }
        case 'roundLive':
          this.showBanner('GO!', sim.cfg.playerTeam === 'T' ? '进攻：安放 C4 或消灭全部 CT' : '防守：守住包点，阻止或拆除 C4', null, 1500);
          break;
        case 'roundEnd': {
          const pt = sim.cfg.playerTeam;
          this.showBanner(ev.winner === 'CT' ? '反恐精英 (CT) 获胜' : '恐怖分子 (T) 获胜', ev.reason, ev.winner, 5000);
          this.audio.roundEnd(ev.winner === pt);
          break;
        }
        case 'matchOver':
          this.showBanner(`比赛结束 — ${ev.winner} 获胜`, `${sim.score.T} : ${sim.score.CT}`, ev.winner, 99999);
          break;
        case 'takeover':
          this.showBanner('已接管队友', sim.byId.get(ev.id)!.name, null, 1500);
          break;
        default:
          break;
      }
    }
    sim.events.length = 0;
    if (this.buyOpen && !sim.canBuy()) {
      this.buyOpen = false;
      this.publish();
    }
  }

  private showBanner(title: string, sub: string, team: Team | null, ms: number) {
    this.banner = { title, sub, team };
    this.bannerUntil = performance.now() + ms;
  }

  // ------------------------------------------------------------------ render

  private render(dt: number, alpha: number) {
    const sim = this.sim;
    const view = this.viewEntity();
    const cam = this.camera;

    for (const e of sim.entities) {
      const cv = this.chars.get(e.id)!;
      const x = e.prevPos.x + (e.pos.x - e.prevPos.x) * alpha;
      const y = e.prevPos.y + (e.pos.y - e.prevPos.y) * alpha;
      const z = e.prevPos.z + (e.pos.z - e.prevPos.z) * alpha;
      cv.root.visible = !(view && e.id === view.id);
      cv.update(e, x, y, z, dt, cam, sim.currentWeapon(e).def.id);
    }

    // bomb
    const b = sim.bomb;
    const showBomb = b.state === 'dropped' || b.state === 'planted' || b.state === 'defused';
    this.bombModel.visible = showBomb;
    if (showBomb) {
      this.bombModel.position.set(b.pos.x, b.pos.y + 0.01, b.pos.z);
      const led = this.bombModel.getObjectByName('led');
      if (led) {
        const period = b.state === 'planted' ? Math.max(0.12, (b.timeLeft / 40) * 1.0) : 1e9;
        led.visible = b.state === 'planted' && sim.time % period < period * 0.4;
      }
    }

    // camera
    if (view) {
      const x = view.prevPos.x + (view.pos.x - view.prevPos.x) * alpha;
      const y = view.prevPos.y + (view.pos.y - view.prevPos.y) * alpha;
      const z = view.prevPos.z + (view.pos.z - view.prevPos.z) * alpha;
      const crouch = view.planting || view.defusing ? -0.55 : 0;
      cam.position.set(x, y + EYE_HEIGHT + crouch, z);
      cam.rotation.set(view.pitch + view.recoilPitch, view.yaw + view.recoilYaw, 0);
    } else {
      const c = sim.controlled;
      if (!c.alive && sim.time - c.deathTime < 2) {
        // death cam: look at the killer from above the body
        cam.position.set(c.pos.x, c.pos.y + 2.4, c.pos.z);
        const k = sim.byId.get(c.lastAttackerId);
        if (k && k.id !== c.id) cam.lookAt(k.pos.x, k.pos.y + 1.4, k.pos.z);
        else cam.lookAt(c.pos.x, c.pos.y, c.pos.z - 2);
      } else {
        cam.position.set(0, 120, 45);
        cam.lookAt(0, 0, -2);
      }
    }
    const shake = this.fx.update(dt);
    if (shake > 0) {
      cam.position.x += (Math.random() - 0.5) * shake * 0.25;
      cam.position.y += (Math.random() - 0.5) * shake * 0.25;
    }

    // FOV / scope
    const w = view ? sim.currentWeapon(view) : null;
    let fov = BASE_FOV;
    if (view && w && w.def.scopeFov && view.scope > 0) fov = w.def.scopeFov[view.scope - 1];
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    cam.updateMatrixWorld();

    // viewmodel
    if (view && w) {
      const now = sim.time;
      const reloadFrac = view.reloadUntil > 0 ? clamp((now - view.reloadStart) / (view.reloadUntil - view.reloadStart), 0, 1) : null;
      const drawDur = w.def.drawTime * 0.7;
      const drawFrac = view.drawUntil > now ? 1 - (view.drawUntil - now) / drawDur : 1;
      this.vm.update(dt, {
        weapon: w.def.id,
        team: view.team,
        speed: Math.hypot(view.vel.x, view.vel.z),
        onGround: view.onGround,
        reloadFrac,
        drawFrac: clamp(drawFrac, 0, 1),
        hidden: view.scope > 0 || !view.alive,
        planting: view.planting || view.defusing,
      });
    } else {
      this.vm.update(dt, {
        weapon: 'knife',
        team: sim.cfg.playerTeam,
        speed: 0,
        onGround: true,
        reloadFrac: null,
        drawFrac: 1,
        hidden: true,
        planting: false,
      });
    }

    // audio listener
    const fwd = this.tmp.set(0, 0, -1).applyQuaternion(cam.quaternion);
    this.audio.setListener(cam.position, fwd);

    const r = this.renderer;
    r.clear();
    r.render(this.scene, cam);
    r.clearDepth();
    r.render(this.vm.scene, this.vm.camera);
  }

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
    this.vm.setAspect(w / Math.max(1, h));
  }

  // ------------------------------------------------------------------ HUD

  publish() {
    if (this.disposed) return;
    this.store.set(this.buildHud(performance.now()));
  }

  private buildHud(now: number): HudState {
    const sim = this.sim;
    const c = sim.controlled;
    const view = this.viewEntity() ?? c;
    const w = sim.currentWeapon(view);
    const def = w.def;
    const alive: Record<Team, number> = { T: 0, CT: 0 };
    for (const e of sim.entities) if (e.alive) alive[e.team]++;

    // crosshair gap from current spread
    let gap = 4;
    if (view.alive && def.slot !== 'melee') {
      const spread = sim.spreadOf(view);
      const h = this.container.clientHeight || 800;
      gap = 3 + (Math.tan(spread) / Math.tan(((this.camera.fov * Math.PI) / 180) / 2)) * (h / 2);
    }

    const b = sim.bomb;
    let hint: string | null = null;
    const site = siteAt(c.pos.x, c.pos.z);
    if (c.alive) {
      if (c.team === 'T' && c.hasBomb) hint = site && sim.phase === 'live' ? `按住 E 在 ${site} 点安放 C4` : '你携带着 C4：前往 A 点或 B 点安放';
      else if (c.team === 'CT' && b.state === 'planted' && Math.hypot(c.pos.x - b.pos.x, c.pos.z - b.pos.z) < DEFUSE_RANGE) hint = '按住 E 拆除 C4';
      else if (c.team === 'T' && b.state === 'dropped') hint = 'C4 已掉落 — 走过去即可拾取';
      else if (sim.canBuy()) hint = '按 B 打开武器选择';
    }
    const spectating = !c.alive && view.id !== c.id;
    if (spectating) hint = '左键 / 右键 切换队友视角 · 按 E 接管该队友';

    const scores: ScoreRow[] = sim.entities
      .map((e) => ({
        id: e.id,
        name: e.name,
        team: e.team,
        kills: e.kills,
        deaths: e.deaths,
        alive: e.alive,
        isPlayer: e.id === sim.playerId,
        isControlled: e.id === sim.controlledId,
        hp: Math.max(0, e.hp),
      }))
      .sort((a, b2) => (a.team === b2.team ? b2.kills - a.kills : a.team === 'CT' ? -1 : 1));

    if (this.banner && now > this.bannerUntil && !sim.matchWinner) this.banner = null;
    this.killfeed = this.killfeed.filter((k) => now - k.time < 7000);

    const reg = regionAt(view.pos.x, view.pos.z);
    const conf = ROUND_CONFIG[sim.roundType];
    return {
      ready: true,
      locked: this.locked,
      phase: sim.phase,
      round: sim.round,
      roundTypeLabel: conf.label,
      isPistolRound: sim.roundType === 'pistol',
      score: { ...sim.score },
      winsToMatch: sim.cfg.winsToMatch,
      timeLeft: sim.roundTimeLeft(),
      bombState: b.state,
      bombTime: sim.bombTimeLeft(),
      bombSite: b.site,
      playerTeam: sim.cfg.playerTeam,
      aliveCount: alive,
      viewName: view.name,
      viewTeam: view.team,
      spectating,
      controlledIsPlayer: sim.controlledId === sim.playerId,
      canTakeover: spectating,
      deathCam: !c.alive && view === c,
      hp: Math.max(0, Math.ceil(view.hp)),
      armor: Math.round(view.armor),
      helmet: view.helmet,
      hasBomb: view.hasBomb,
      location: reg ? reg.name : '',
      weaponId: def.id,
      weaponName: def.name,
      mag: w.mag,
      magSize: def.magSize,
      reserve: w.reserve,
      isMelee: def.slot === 'melee',
      reloadFrac: view.reloadUntil > 0 ? clamp((sim.time - view.reloadStart) / (view.reloadUntil - view.reloadStart), 0, 1) : null,
      slots: {
        primary: view.weapons.primary ? view.weapons.primary.def.name : null,
        secondary: view.weapons.secondary ? view.weapons.secondary.def.name : null,
        melee: WEAPONS.knife.name,
        active: view.slot,
      },
      crosshairGap: gap,
      scoped: view.alive && view.scope > 0,
      plantProgress: view.planting ? clamp(view.plantProgress / PLANT_TIME, 0, 1) : null,
      defuseProgress: b.state === 'planted' && b.defuserId === view.id ? clamp(b.defuseProgress / DEFUSE_TIME, 0, 1) : null,
      hint,
      killfeed: this.killfeed.slice(),
      hitmarkerAt: this.hitmarkerAt,
      hitmarkerHead: this.hitmarkerHead,
      killmarkerAt: this.killmarkerAt,
      damageAt: this.damageAt,
      now,
      banner: this.banner,
      buyOpen: this.buyOpen,
      canBuy: sim.canBuy(),
      buyAllowPrimary: conf.allowPrimary,
      prefs: { ...sim.playerPrefs },
      showScores: this.showScores || sim.phase === 'over',
      scores,
      matchWinner: sim.matchWinner,
    };
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const [t, type, fn, o] of this.listeners) t.removeEventListener(type, fn, o);
    this.listeners = [];
    if (document.pointerLockElement) document.exitPointerLock();
    this.audio.dispose();
    for (const cv of this.chars.values()) cv.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
