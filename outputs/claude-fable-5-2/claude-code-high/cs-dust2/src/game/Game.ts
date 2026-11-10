// The engine: glues simulation, renderer, audio, input and the UI store together.
//
// Timing model
//   * requestAnimationFrame drives everything.
//   * The simulation advances in fixed 1/60 s ticks through an accumulator (deterministic physics,
//     independent of the display refresh rate).
//   * Rendering interpolates actor transforms between the last two ticks; the local player's view
//     angles are applied directly from mouse events so aiming has zero added latency.
//   * React is updated through the `hud` store ~12 times a second (plus immediately on discrete
//     events), and through `hudRefs` every frame for crosshair / hit marker / minimap visuals.

import { AudioEngine } from '../audio/AudioEngine';
import { BASE_FOV, GameRenderer, ViewState } from '../render/GameRenderer';
import { Actor, Team, resetInput } from '../sim/actor';
import { CELL, siteAt, zoneName } from '../sim/map';
import { angleDiff, clamp, dist2D, wrapAngle, yawTo } from '../sim/math';
import { RULES } from '../sim/round';
import { SimEvent, Simulation, TICK } from '../sim/sim';
import { SLOT_ORDER, Slot, WEAPONS, WeaponId } from '../sim/weapons';
import { KillEntry, ScoreRow, Settings, SlotInfo, hud, hudRefs } from '../state/store';
import { Input } from './Input';
import { MinimapPainter } from './minimap';

const TEAM_LABEL: Record<Team, string> = { atk: '攻方', def: '守方' };
const SLOT_KEY: Record<Slot, string> = { primary: '1', secondary: '2', melee: '3' };
export const BUY_PRIMARY: WeaponId[] = ['ak47', 'm4a1', 'awp'];
export const BUY_SECONDARY: WeaponId[] = ['glock', 'usp', 'deagle'];

export class Game {
  readonly sim: Simulation;
  private renderer: GameRenderer;
  private audio = new AudioEngine();
  private input: Input;
  private canvas: HTMLCanvasElement;
  private container: HTMLElement;
  private minimap: MinimapPainter;
  private settings: Settings;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private disposed = false;
  private autoplay = false;
  private resizeObs: ResizeObserver | null = null;

  private pendingSwitch: Slot | null = null;
  private pendingDrop = false;
  private spectateId = -1;
  private orbitAngle = 0;
  private buyOpen = false;

  private killSeq = 0;
  private killfeed: KillEntry[] = [];
  private noticeUntil = 0;
  private hudAt = 0;
  private frames = 0;
  private fpsAt = 0;
  private fps = 0;
  private slotsKey = '';
  private slots: SlotInfo[] = [];
  private frameNo = 0;

  // per-frame feedback (written straight to DOM refs)
  private hitAt = -10;
  private hitHead = false;
  private hitKill = false;
  private hurtAt = -10;
  private hurtAngle = 0;
  private flashAt = -10;

  constructor(container: HTMLElement, settings: Settings) {
    this.container = container;
    this.settings = settings;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'game-canvas';
    container.appendChild(this.canvas);
    this.autoplay = typeof location !== 'undefined' && location.search.includes('autoplay');

    this.sim = new Simulation({ humanTeam: settings.team, mode: settings.mode, difficulty: settings.difficulty });
    const primary: WeaponId = settings.team === 'atk' ? 'ak47' : 'm4a1';
    const secondary: WeaponId = settings.team === 'atk' ? 'glock' : 'usp';
    this.sim.loadout.primary = primary;
    this.sim.loadout.secondary = secondary;
    this.renderer = new GameRenderer(this.canvas, this.sim);
    this.minimap = new MinimapPainter(this.sim.map);
    this.audio.setVolume(settings.volume);

    this.input = new Input(this.canvas);
    this.input.onLook = this.onLook;
    this.input.onLockChange = (locked) => {
      hud.set({ locked });
      if (locked) this.audio.resume();
      else if (!this.autoplay) this.audio.suspend();
    };

    const resize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      this.renderer.resize(w, h);
    };
    resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(resize);
      this.resizeObs.observe(container);
    } else {
      window.addEventListener('resize', resize);
    }

    hud.set({
      screen: 'game',
      team: settings.team,
      killfeed: [],
      banner: null,
      matchOver: '',
      notice: '',
      buyOpen: false,
      loadoutPrimary: primary,
      loadoutSecondary: secondary,
      locked: false,
    });
    this.processEvents();
    this.syncHud(true);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  // ------------------------------------------------------------------ public controls (used by React)
  /** Called from a click: grabs the mouse and unlocks audio. */
  resume(): void {
    this.audio.resume();
    this.input.requestLock();
  }

  setVolume(v: number): void {
    this.settings.volume = v;
    this.audio.setVolume(v);
  }

  setSensitivity(v: number): void {
    this.settings.sensitivity = v;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObs?.disconnect();
    this.input.dispose();
    this.audio.dispose();
    this.renderer.dispose();
    try {
      this.renderer.renderer.forceContextLoss();
    } catch {
      /* ignore */
    }
    if (this.canvas.parentElement) this.canvas.parentElement.removeChild(this.canvas);
  }

  // ------------------------------------------------------------------ input
  private onLook = (dx: number, dy: number): void => {
    const h = this.sim.human;
    if (!h || !h.alive) {
      this.orbitAngle -= dx * 0.004;
      return;
    }
    let s = 0.0022 * this.settings.sensitivity;
    const z = h.def.zoom;
    if (z && h.zoom > 0) s *= z.fovs[Math.min(h.zoom, z.fovs.length) - 1] / BASE_FOV;
    h.yaw = wrapAngle(h.yaw - dx * s);
    h.pitch = clamp(h.pitch - dy * s, -1.5, 1.5);
  };

  /** Edge-triggered keys, handled once per rendered frame. */
  private handleKeys(): void {
    const inp = this.input;
    const sim = this.sim;
    const h = sim.human;
    const p = inp.pressed;
    const showScores = inp.down.has('Tab');
    if (showScores !== hud.get().showScores) hud.set({ showScores, scores: this.buildScores() });
    if (!h) return;

    if (h.alive) {
      const canBuy = sim.round.phase === 'freeze' && !sim.round.pistol;
      if (this.buyOpen && !canBuy) this.setBuy(false);
      if (p.has('KeyB') && canBuy) this.setBuy(!this.buyOpen);
      if (this.buyOpen) {
        for (let i = 0; i < 3; i++) {
          if (p.has(`Digit${i + 1}`)) this.buy(BUY_PRIMARY[i], null);
          if (p.has(`Digit${i + 4}`)) this.buy(null, BUY_SECONDARY[i]);
        }
      } else {
        if (p.has('Digit1')) this.pendingSwitch = 'primary';
        if (p.has('Digit2')) this.pendingSwitch = 'secondary';
        if (p.has('Digit3')) this.pendingSwitch = 'melee';
        if (p.has('KeyQ') && h.hasSlot(h.lastSlot)) this.pendingSwitch = h.lastSlot;
        if (inp.wheel !== 0) {
          const have = SLOT_ORDER.filter((s) => h.hasSlot(s));
          const idx = have.indexOf(h.active);
          this.pendingSwitch = have[(idx + (inp.wheel > 0 ? 1 : have.length - 1)) % have.length];
        }
      }
      if (p.has('KeyG')) this.pendingDrop = true;
    } else {
      if (this.buyOpen) this.setBuy(false);
      // dead: cycle teammates, take one over
      if (inp.pressedL) this.cycleSpectate(1);
      if (inp.pressedR) this.cycleSpectate(-1);
      if (p.has('KeyF') || p.has('KeyE') || p.has('Space')) {
        const target = this.spectateTarget();
        if (target && sim.takeOver(target.id)) {
          this.notice(`已接管队友 ${target.name}`);
          this.syncHud(true);
        }
      }
      inp.endMouse();
    }
  }

  private setBuy(open: boolean): void {
    this.buyOpen = open;
    hud.set({ buyOpen: open });
  }

  private buy(primary: WeaponId | null, secondary: WeaponId | null): void {
    this.sim.setLoadout(primary, secondary);
    this.audio.uiClick();
    hud.set({
      loadoutPrimary: this.sim.loadout.primary ?? 'ak47',
      loadoutSecondary: this.sim.loadout.secondary ?? 'glock',
    });
  }

  /** Fills the human actor's input for the next physics tick. */
  private applyInput(): void {
    const h = this.sim.human;
    if (!h) return;
    const i = h.input;
    if (!h.alive) {
      resetInput(i);
      return;
    }
    const inp = this.input;
    const k = inp.down;
    i.moveZ = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    i.moveX = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    i.jump = k.has('Space');
    i.crouch = k.has('ControlLeft') || k.has('KeyC');
    i.walk = k.has('ShiftLeft') || k.has('ShiftRight');
    i.fire = (inp.mouseL || inp.pressedL) && !this.buyOpen;
    i.fire2 = inp.mouseR || inp.pressedR;
    i.reload = k.has('KeyR');
    i.use = k.has('KeyE');
    i.switchTo = this.pendingSwitch;
    i.drop = this.pendingDrop;
    this.pendingSwitch = null;
    this.pendingDrop = false;
  }

  // ------------------------------------------------------------------ spectating
  private spectateTarget(): Actor | null {
    const list = this.sim.spectateCandidates();
    if (list.length === 0) return null;
    const cur = list.find((a) => a.id === this.spectateId);
    if (cur) return cur;
    this.spectateId = list[0].id;
    return list[0];
  }

  private cycleSpectate(dir: number): void {
    const list = this.sim.spectateCandidates();
    if (list.length === 0) return;
    const idx = list.findIndex((a) => a.id === this.spectateId);
    const next = list[(idx + dir + list.length) % list.length];
    this.spectateId = next.id;
    this.audio.uiClick();
  }

  private currentView(): ViewState {
    const sim = this.sim;
    const h = sim.human;
    const team = this.settings.team;
    if (h && h.alive) return { actor: h, orbit: null, team };
    const t = this.spectateTarget();
    if (t) return { actor: t, orbit: null, team };
    const home = sim.actors[sim.homeId] ?? sim.actors[0];
    return { actor: null, orbit: { x: home.pos.x, y: home.pos.y, z: home.pos.z, angle: this.orbitAngle }, team };
  }

  // ------------------------------------------------------------------ main loop
  private frame = (t: number): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.1, Math.max(0, (t - this.last) / 1000));
    this.last = t;
    const sim = this.sim;
    const playing = (this.input.locked || this.autoplay) && sim.round.phase !== 'matchover';

    this.handleKeys();
    this.input.endKeys();

    if (playing) {
      this.acc += dt;
      let steps = 0;
      while (this.acc >= TICK && steps < 5) {
        this.applyInput();
        sim.tick(TICK);
        this.input.endMouse();
        this.processEvents();
        this.acc -= TICK;
        steps++;
      }
      if (this.acc > TICK * 5) this.acc = 0; // tab was in the background: drop the backlog
    }
    const alpha = playing ? clamp(this.acc / TICK, 0, 1) : 1;

    const view = this.currentView();
    this.renderer.render(alpha, dt, view, sim.humanId);
    const cam = this.renderer.camera;
    this.audio.setListener(cam.position.x, cam.position.y, cam.position.z, view.actor ? view.actor.yaw : 0);

    this.frames++;
    this.frameNo++;
    if (t - this.fpsAt > 500) {
      this.fps = Math.round((this.frames * 1000) / (t - this.fpsAt));
      this.frames = 0;
      this.fpsAt = t;
    }
    this.updateFastHud(t / 1000, view);
    if (t - this.hudAt > 80) {
      this.hudAt = t;
      this.syncHud(false);
    }
  };

  // ------------------------------------------------------------------ simulation events -> audio / fx / UI
  private viewedId(): number {
    const h = this.sim.human;
    if (h && h.alive) return h.id;
    const t = this.sim.spectateCandidates().find((a) => a.id === this.spectateId);
    return t ? t.id : -1;
  }

  private notice(text: string): void {
    this.noticeUntil = performance.now() + 3200;
    hud.set({ notice: text });
  }

  private processEvents(): void {
    const sim = this.sim;
    const events = sim.events;
    if (events.length === 0) return;
    const viewed = this.viewedId();
    const humanId = sim.humanId;
    const team = this.settings.team;
    const nowReal = performance.now() / 1000;
    for (let n = 0; n < events.length; n++) {
      const e: SimEvent = events[n];
      this.renderer.handleEvent(e);
      switch (e.type) {
        case 'shot': {
          const own = e.actor === viewed;
          this.audio.shot(e.weapon, e.ox, e.oy, e.oz, own);
          if (own && e.weapon === 'awp') this.audio.bolt();
          break;
        }
        case 'melee': {
          const a = sim.actors[e.actor];
          this.audio.knife(e.hit, a.pos.x, a.pos.y + 1.4, a.pos.z, e.actor === viewed);
          break;
        }
        case 'hit': {
          if (e.attacker === humanId && e.attacker >= 0 && e.victim !== humanId) {
            this.audio.hitMarker(e.zone === 'head');
            this.hitAt = nowReal;
            this.hitHead = e.zone === 'head';
            this.hitKill = e.killed;
          }
          if (e.victim === humanId) {
            this.audio.hurt();
            this.hurtAt = nowReal;
            const v = sim.actors[e.victim];
            if (e.attacker >= 0) {
              const at = sim.actors[e.attacker];
              // angle of the attacker relative to where we look (clockwise on screen)
              this.hurtAngle = -angleDiff(yawTo(v.pos, at.pos), v.yaw);
            }
          }
          break;
        }
        case 'kill': {
          const victim = sim.actors[e.victim];
          const killer = e.killer >= 0 ? sim.actors[e.killer] : null;
          const weapon = e.weapon === 'c4' ? 'C4 爆炸' : e.weapon === 'fall' ? '坠落' : WEAPONS[e.weapon].name;
          const label = (a: Actor) => (a.isHuman || a.id === sim.homeId ? (a.id === sim.homeId ? '你' : `${a.name}(你)`) : a.name);
          this.killfeed = [
            ...this.killfeed,
            {
              id: ++this.killSeq,
              killer: killer ? label(killer) : '',
              killerTeam: killer ? killer.team : null,
              victim: label(victim),
              victimTeam: victim.team,
              weapon,
              headshot: e.headshot,
              mine: e.killer === humanId || e.victim === humanId,
              time: performance.now(),
            },
          ].slice(-6);
          hud.set({ killfeed: this.killfeed });
          if (e.killer === humanId && e.killer !== e.victim) this.audio.kill(e.headshot);
          if (e.victim === humanId) {
            this.audio.death();
            this.spectateId = -1;
            this.setBuy(false);
          }
          break;
        }
        case 'reload': {
          const a = sim.actors[e.actor];
          this.audio.reload(e.weapon, WEAPONS[e.weapon].reloadTime, a.pos.x, a.pos.y + 1.3, a.pos.z, e.actor === viewed);
          break;
        }
        case 'switch':
          if (e.actor === viewed) this.audio.draw(e.weapon);
          break;
        case 'zoom':
          if (e.actor === viewed) this.audio.zoom(e.level);
          break;
        case 'dry':
          if (e.actor === viewed) this.audio.dryFire();
          break;
        case 'footstep': {
          const a = sim.actors[e.actor];
          const map = sim.map;
          const cx = Math.floor(a.pos.x - map.minX);
          const cz = Math.floor(a.pos.z - map.minZ);
          const indoor = cx >= 0 && cz >= 0 && cx < map.cols && cz < map.rows && map.cells[cz * map.cols + cx] === CELL.Interior;
          this.audio.footstep(a.pos.x, a.pos.y, a.pos.z, e.actor === viewed, indoor);
          break;
        }
        case 'jump':
          if (e.actor === viewed) this.audio.jump();
          break;
        case 'land': {
          const a = sim.actors[e.actor];
          this.audio.land(a.pos.x, a.pos.y, a.pos.z, e.actor === viewed, e.speed);
          break;
        }
        case 'bomb': {
          const who = e.actor >= 0 ? sim.actors[e.actor] : null;
          switch (e.kind) {
            case 'plantStart':
              this.audio.plantStart(e.x, e.y, e.z, e.actor === viewed);
              break;
            case 'planted':
              this.audio.planted();
              this.notice(`C4 已安放于 ${sim.round.bomb.site ?? ''} 点 — ${RULES.bombTime} 秒后引爆`);
              break;
            case 'beep': {
              const left = sim.round.bomb.explodeAt - sim.time;
              this.audio.bombBeep(e.x, e.y, e.z, 1 - clamp(left / RULES.bombTime, 0, 1));
              break;
            }
            case 'defuseStart':
              this.audio.defuseStart(e.x, e.y, e.z, e.actor === viewed);
              if (team === 'atk') this.notice('敌人正在拆除 C4！');
              break;
            case 'defused':
              this.audio.defused();
              break;
            case 'exploded':
              this.audio.explosion(e.x, e.y, e.z);
              this.flashAt = nowReal;
              break;
            case 'pickup':
              if (team === 'atk') {
                this.audio.pickup();
                this.notice(who && who.id === humanId ? '你拾取了 C4' : `${who ? who.name : '队友'} 拾取了 C4`);
              }
              break;
            case 'drop':
              if (team === 'atk') this.notice('C4 已掉落');
              break;
          }
          break;
        }
        case 'round': {
          if (e.kind === 'start') {
            this.audio.roundStart();
            this.killfeed = [];
            this.spectateId = -1;
            hud.set({ banner: null, killfeed: this.killfeed, notice: '' });
          } else if (e.kind === 'end' && e.winner) {
            const won = e.winner === team;
            const reasonText: Record<string, string> = {
              elim: e.winner === 'atk' ? '守方全员阵亡' : '攻方全员阵亡',
              time: '回合时间耗尽',
              bomb: 'C4 已引爆',
              defuse: 'C4 已被拆除',
            };
            this.audio.roundEnd(won);
            hud.set({
              banner: {
                title: `${TEAM_LABEL[e.winner]}赢得本回合`,
                sub: reasonText[e.reason ?? 'elim'],
                tone: won ? 'win' : 'lose',
              },
            });
          } else if (e.kind === 'match' && e.winner) {
            hud.set({ matchOver: e.winner === team ? 'win' : 'lose', scores: this.buildScores(), banner: null });
            this.input.exitLock();
          }
          break;
        }
        case 'takeover':
          this.audio.pickup();
          break;
      }
    }
    events.length = 0;
  }

  // ------------------------------------------------------------------ HUD
  private buildScores(): ScoreRow[] {
    const sim = this.sim;
    const showBomb = this.settings.team === 'atk';
    return sim.actors.map((a) => ({
      id: a.id,
      name: a.id === sim.homeId ? '你' : a.name,
      team: a.team,
      kills: a.kills,
      deaths: a.deaths,
      alive: a.alive,
      you: a.id === sim.humanId,
      bomb: showBomb && a.hasBomb,
    }));
  }

  /** Low-frequency state for React. */
  private syncHud(force: boolean): void {
    const sim = this.sim;
    const round = sim.round;
    const view = this.currentView();
    const h = sim.human;
    const a = view.actor ?? h ?? sim.actors[0];
    const humanAlive = !!h && h.alive;
    const w = a.weapon;
    const def = w.def;
    const bomb = round.bomb;

    // weapon slots (only rebuilt when they actually change)
    let key = '';
    for (const s of SLOT_ORDER) {
      const ws = a.weapons[s];
      key += ws ? `${ws.def.id}${a.active === s ? '*' : ''}|` : '-|';
    }
    if (key !== this.slotsKey) {
      this.slotsKey = key;
      this.slots = [];
      for (const s of SLOT_ORDER) {
        const ws = a.weapons[s];
        if (ws) this.slots.push({ slot: s, key: SLOT_KEY[s], name: ws.def.name, active: a.active === s });
      }
    }

    // contextual hint + progress bar
    let hint = '';
    let progress = -1;
    let progressLabel = '';
    const site = siteAt(sim.map, a.pos.x, a.pos.z);
    if (humanAlive && h) {
      if (bomb.planter === h.id) {
        progress = h.useTime / RULES.plantTime;
        progressLabel = '正在安放 C4';
      } else if (bomb.defuser === h.id) {
        progress = h.useTime / round.defuseNeeded(h);
        progressLabel = h.hasKit ? '正在拆除 C4（拆弹钳）' : '正在拆除 C4';
      } else if (round.phase === 'freeze') {
        hint = round.pistol ? '手枪局 — 准备时间' : '准备时间 — 按 B 选择装备';
      } else if (h.team === 'atk' && h.hasBomb && round.phase === 'live') {
        hint = site ? `按住 E 在 ${site} 点安放 C4` : '你携带着 C4 — 前往 A 点或 B 点安放（G 丢弃）';
      } else if (h.team === 'def' && round.phase === 'planted') {
        const near = dist2D(h.pos, bomb.pos) < 1.5 && Math.abs(h.pos.y - bomb.pos.y) < 1.3;
        if (near && bomb.defuser < 0) hint = '按住 E 拆除 C4';
        else if (near) hint = '队友正在拆除 C4 — 掩护他';
      }
    } else if (h && !h.alive) {
      const t = view.actor;
      hint = t ? '鼠标左/右键 切换队友视角 · 按 F 接管该队友' : '全队阵亡 — 等待下一回合';
    }

    let notice = hud.get().notice;
    if (notice && performance.now() > this.noticeUntil) notice = '';
    // drop kill-feed lines after a few seconds
    const cutoff = performance.now() - 7000;
    if (this.killfeed.length && this.killfeed[0].time < cutoff) {
      this.killfeed = this.killfeed.filter((k) => k.time >= cutoff);
    }

    const state = hud.get();
    hud.set({
      phase: round.phase,
      roundNum: round.num,
      pistol: round.pistol,
      scoreAtk: round.score.atk,
      scoreDef: round.score.def,
      timer: Math.ceil(round.timeLeft()),
      bombPlanted: bomb.status === 'planted',
      aliveAtk: sim.aliveCount('atk'),
      aliveDef: sim.aliveCount('def'),
      alive: humanAlive,
      hp: Math.max(0, Math.ceil(a.hp)),
      armor: Math.ceil(a.armor),
      helmet: a.helmet,
      weaponId: def.id,
      weaponName: def.name,
      ammo: w.ammo,
      reserve: w.reserve,
      magSize: def.magSize,
      reloading: a.reloading,
      melee: def.kind === 'melee',
      slots: this.slots,
      zoom: def.zoom && a.alive ? a.zoom : 0,
      hasBomb: a.hasBomb,
      hasKit: a.hasKit,
      zone: zoneName(sim.map, a.pos.x, a.pos.z),
      hint,
      progress: progress < 0 ? -1 : Math.round(clamp(progress, 0, 1) * 100) / 100,
      progressLabel,
      notice,
      killfeed: this.killfeed,
      spectating: !humanAlive && view.actor ? view.actor.name : '',
      canTakeover: !humanAlive && !!view.actor,
      attackSite: this.settings.team === 'atk' && (round.phase === 'live' || round.phase === 'freeze') ? sim.tactics.atk.site : '',
      scores: state.showScores || force ? this.buildScores() : state.scores,
      fps: this.fps,
    });
  }

  /** Per-frame visuals written directly to the DOM (no React involvement). */
  private updateFastHud(now: number, view: ViewState): void {
    const a = view.actor;
    const ch = hudRefs.crosshair;
    if (ch) {
      const show = !!a && a.alive && !(a.def.zoom && a.zoom > 0) && !(a.def.zoom && a.rezoomAt > 0);
      if (show && a) {
        const cam = this.renderer.camera;
        const pxPerRad = this.container.clientHeight / 2 / Math.tan((cam.fov * Math.PI) / 360);
        const gap = a.def.kind === 'melee' ? 5 : 3 + a.inaccuracy() * pxPerRad;
        ch.style.setProperty('--gap', `${Math.min(140, gap).toFixed(1)}px`);
        ch.style.opacity = a.def.kind === 'sniper' ? '0.35' : '1';
      } else {
        ch.style.opacity = '0';
      }
    }
    const hm = hudRefs.hitmarker;
    if (hm) {
      const t = now - this.hitAt;
      const dur = this.hitKill ? 0.45 : 0.22;
      if (t >= 0 && t < dur) {
        hm.style.opacity = String(1 - t / dur);
        hm.style.transform = `translate(-50%, -50%) scale(${1 + (1 - t / dur) * 0.35})`;
        hm.dataset.kind = this.hitKill ? 'kill' : this.hitHead ? 'head' : 'body';
      } else if (hm.style.opacity !== '0') {
        hm.style.opacity = '0';
      }
    }
    const h = this.sim.human;
    const vg = hudRefs.vignette;
    if (vg) {
      const t = now - this.hurtAt;
      let o = t >= 0 && t < 0.7 ? 0.75 * (1 - t / 0.7) : 0;
      if (h && h.alive && h.hp <= 30) o = Math.max(o, 0.28 + Math.sin(now * 5) * 0.06);
      vg.style.opacity = o.toFixed(3);
    }
    const da = hudRefs.dmgArrow;
    if (da) {
      const t = now - this.hurtAt;
      if (t >= 0 && t < 1.1 && h && h.alive) {
        da.style.opacity = String(1 - t / 1.1);
        da.style.transform = `translate(-50%, -50%) rotate(${this.hurtAngle}rad)`;
      } else if (da.style.opacity !== '0') {
        da.style.opacity = '0';
      }
    }
    const fl = hudRefs.flash;
    if (fl) {
      const t = now - this.flashAt;
      fl.style.opacity = t >= 0 && t < 1.2 ? String(0.85 * (1 - t / 1.2)) : '0';
    }
    const mm = hudRefs.minimap;
    if (mm && this.frameNo % 2 === 0) {
      const viewer = a ?? null;
      this.minimap.draw(mm, this.sim, viewer, this.settings.team, this.sim.time);
    }
  }
}
