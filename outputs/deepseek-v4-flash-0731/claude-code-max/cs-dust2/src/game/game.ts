// 游戏主类：引擎 + 渲染器 + 输入 + 主循环 + HUD 桥接

import * as THREE from 'three';
import { GameEngine, type InputState } from './engine';
import { Renderer } from './render';
import { SoundManager } from './audio';
import { WEAPONS } from './weapons';
import { EYE_HEIGHT, type GameEvent, type HudState, type KillEvent } from './types';

export type KillfeedItem = KillEvent;

export class Game {
  engine: GameEngine;
  renderer: Renderer;
  audio = new SoundManager();
  private canvas: HTMLCanvasElement;
  private keys = new Set<string>();
  private mouseDown = new Set<number>();
  private raf = 0;
  private lastT = 0;
  private time = 0;
  private locked = false;
  private started = false;
  private hudCb: ((s: HudState) => void) | null = null;
  private snapT = 0;
  private killfeed: KillfeedItem[] = [];
  private kfId = 0;
  private hitmarkT = 0;
  private damageFlashT = 0;
  private sens = 0.0021;
  private scopeFov = 24;
  private baseFov = 84;
  private pendingSlot: 'primary' | 'secondary' | 'melee' | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.engine = new GameEngine(this.audio, (e) => this.handleEvent(e));
    this.bindInput();
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      this.renderer.resize(w, h);
    };
    resize();
    window.addEventListener('resize', resize);
  }

  onHud(cb: (s: HudState) => void): void {
    this.hudCb = cb;
  }

  private handleEvent(e: GameEvent): void {
    switch (e.type) {
      case 'kill': {
        const killer = this.engine.players[e.killer];
        const victim = this.engine.players[e.victim];
        const item: KillfeedItem = {
          id: ++this.kfId,
          time: this.time,
          killer: e.killer,
          victim: e.victim,
          weapon: e.weapon,
          headshot: e.headshot,
          killerName: `${killer.team === 1 ? 'T' : 'CT'}-${(e.killer % 5) + 1}`,
          victimName: `${victim.team === 1 ? 'T' : 'CT'}-${(e.victim % 5) + 1}`,
          weaponName: WEAPONS[e.weapon].name,
        };
        this.killfeed.push(item);
        if (this.killfeed.length > 8) this.killfeed.shift();
        break;
      }
      case 'hit':
        if (e.fatal) this.hitmarkT = 0.5;
        else this.hitmarkT = 0.22;
        break;
      case 'roundStart':
        this.killfeed = [];
        break;
      default:
        break;
    }
  }

  // ---------------- 输入 ----------------
  private bindInput(): void {
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'F2') { this.engine.cycleSpectate(); return; }
      if (ev.code === 'KeyM') { this.audio.setMuted(!this.audio.muted); return; }
      this.keys.add(ev.code);
      if (!this.started || !this.locked) return;
      switch (ev.code) {
        case 'KeyR': this.engine.input.reload = true; break;
        case 'Space': this.engine.input.jump = true; break;
        case 'KeyE': this.engine.input.interact = true; break;
        case 'KeyQ': this.engine.input.cycleSlot = -1; break;
        case 'Digit1': this.pendingSlot = 'primary'; break;
        case 'Digit2': this.pendingSlot = 'secondary'; break;
        case 'Digit3': this.pendingSlot = 'melee'; break;
      }
    });
    window.addEventListener('keyup', (ev) => {
      this.keys.delete(ev.code);
      if (ev.code === 'Space') this.engine.input.jump = false;
      if (ev.code === 'KeyE') this.engine.input.interact = false;
    });
    this.canvas.addEventListener('mousedown', (ev) => {
      if (!this.started) return;
      this.mouseDown.add(ev.button);
      if (ev.button === 0) this.engine.input.fire = true;
      if (ev.button === 2) this.engine.setZoom(true);
    });
    window.addEventListener('mouseup', (ev) => {
      this.mouseDown.delete(ev.button);
      if (ev.button === 0) this.engine.input.fire = false;
      if (ev.button === 2) this.engine.setZoom(false);
    });
    window.addEventListener('mousemove', (ev) => {
      if (!this.locked) return;
      const s = this.sens;
      this.engine.input.mx += ev.movementX * s;
      this.engine.input.mz += ev.movementY * s;
    });
    this.canvas.addEventListener('wheel', (ev) => {
      if (!this.locked) return;
      this.engine.input.cycleSlot = ev.deltaY > 0 ? 1 : -1;
    });
    this.canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());
    window.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      if (!this.locked) {
        this.engine.input.fire = false;
        this.engine.input.zoom = false;
        this.mouseDown.clear();
      }
    });
  }

  requestStart(): void {
    this.audio.ensure();
    this.started = true;
    this.canvas.requestPointerLock();
  }

  private updateInput(): void {
    const inp = this.engine.input as InputState;
    const has = (code: string) => this.keys.has(code);
    const up = has('KeyW') || has('ArrowUp');
    const down = has('KeyS') || has('ArrowDown');
    const left = has('KeyA') || has('ArrowLeft');
    const right = has('KeyD') || has('ArrowRight');
    inp.moveX = (right ? 1 : 0) - (left ? 1 : 0);
    inp.moveZ = (up ? 1 : 0) - (down ? 1 : 0);
    inp.run = !has('ShiftLeft') && !has('ShiftRight');
    if (this.pendingSlot) {
      inp.slotSelect = this.pendingSlot;
      this.pendingSlot = null;
    }
  }

  // ---------------- 主循环 ----------------
  start(): void {
    this.lastT = performance.now();
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      let dt = (now - this.lastT) / 1000;
      this.lastT = now;
      if (dt > 0.05) dt = 0.05;
      this.time += dt;
      this.update(dt);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private update(dt: number): void {
    this.updateInput();
    // 开始界面或指针解锁（暂停）时不推进模拟，仅渲染
    const paused = !this.started || !this.locked;
    if (!paused) this.engine.update(dt);

    const cam = this.engine.players[this.engine.camIndex];
    const r = this.renderer;
    const camera = r.camera;

    // 相机同步（世界前向 F=(cos yaw, sin yaw)，映射到 three 相机前向 -Z）
    camera.position.set(cam.x, EYE_HEIGHT, cam.z);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = -(cam.yaw + Math.PI / 2);
    const kick = cam.recoilKick * 0.55;
    camera.rotation.x = cam.pitch + kick;

    // 开镜
    const zooming = this.engine.playerZoom && WEAPONS[cam.activeWeapon].scope;
    const targetFov = zooming ? this.scopeFov : this.baseFov;
    camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 12);
    camera.updateProjectionMatrix();

    // 角色同步
    for (const p of this.engine.players) {
      const m = r.modelFor(p.index, p.team);
      r.syncEntity(p, m, dt, this.time);
      // 示踪
      if (p.emit) {
        const e = p.emit;
        r.spawnTracer(p.x, EYE_HEIGHT, p.z, e.dx, e.dy, e.dz, 90);
        p.emit = null;
      }
    }

    // 炸弹
    r.syncBomb(
      this.engine.bombPlanted,
      this.engine.bombDropped,
      this.engine.bombX,
      this.engine.bombZ,
      this.time,
      this.engine.bombTime,
    );

    // 第一人称武器
    const firing = cam.firingAnim > 0.4;
    const reloading = cam.reloading;
    r.setViewWeapon(cam.activeWeapon);
    r.update(dt, this.time, firing, kick, reloading, zooming);

    // 受击红色覆盖
    if (cam.hitFlash > 0.5) this.damageFlashT = 0.25;
    this.damageFlashT = Math.max(0, this.damageFlashT - dt);
    this.hitmarkT = Math.max(0, this.hitmarkT - dt);

    r.render();

    // HUD 快照（10Hz）
    this.snapT -= dt;
    if (this.snapT <= 0) {
      this.snapT = 0.1;
      if (this.hudCb) {
        const snap = this.engine.buildSnapshot();
        snap.killfeed = this.killfeed.map((i) => ({ ...i }));
        this.hudCb({ ...snap, hitmark: this.hitmarkT, damageFlash: this.damageFlashT });
      }
    }
  }

  reset(): void {
    this.engine.resetGame();
  }

  destroy(): void {
    cancelAnimationFrame(this.raf);
  }
}
