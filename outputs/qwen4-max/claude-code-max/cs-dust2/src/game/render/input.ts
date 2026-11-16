import type { GameCore } from '../core/core.ts';
import type { Renderer } from './renderer.ts';
import type { Slot } from '../core/types.ts';
import { BUY_ITEMS } from '../core/weapons.ts';
import { clamp } from '../core/vecmath.ts';

export interface InputCallbacks {
  onLock(locked: boolean): void;
  onScoreboard(open: boolean): void;
}

export class InputController {
  private canvas: HTMLCanvasElement;
  private core: GameCore;
  private renderer: Renderer;
  private cb: InputCallbacks;
  private keys = new Set<string>();
  private locked = false;
  buyMode = false;
  sensitivity = 0.0022;

  constructor(canvas: HTMLCanvasElement, core: GameCore, renderer: Renderer, cb: InputCallbacks) {
    this.canvas = canvas;
    this.core = core;
    this.renderer = renderer;
    this.cb = cb;
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('pointerlockchange', this.onLockChange);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    // Wait for the first pointer-lock click before the simulation runs.
    this.core.paused = true;
  }

  requestLock(): void {
    if (this.core.running && !this.locked) {
      void this.canvas.requestPointerLock();
    }
  }

  private onClick = (): void => {
    if (this.core.spectating) {
      this.core.takeControl();
      return;
    }
    if (!this.locked && !this.buyMode) this.requestLock();
  };

  private onLockChange = (): void => {
    this.locked = document.pointerLockElement === this.canvas;
    if (this.locked) {
      this.buyMode = false;
      this.core.paused = false;
    } else {
      this.core.paused = true;
      this.core.input.fire = false;
      this.keys.clear();
      this.updateMove();
    }
    this.cb.onLock(this.locked);
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.locked) return;
    if (this.core.spectating) {
      if (e.button === 0) this.core.takeControl();
      else if (e.button === 2) this.core.cycleSpectate(1);
      return;
    }
    if (e.button === 0) {
      this.core.input.fire = true;
      this.core.input.firePressed = true;
    } else if (e.button === 2) {
      this.core.input.ads = true;
      this.core.input.adsPressed = true;
    }
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.core.input.fire = false;
    else if (e.button === 2) this.core.input.ads = false;
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked) return;
    const ce = this.core.controlled;
    if (!ce || !ce.alive || this.core.spectating) return;
    const dx = e.movementX * this.sensitivity;
    const dy = e.movementY * this.sensitivity;
    ce.yaw += dx;
    ce.pitch = clamp(ce.pitch - dy, -1.5, 1.5);
    this.renderer.addViewSway(dx * 0.6, dy * 0.6);
  };

  private onWheel = (e: WheelEvent): void => {
    if (!this.locked) return;
    e.preventDefault();
    this.core.input.quickSwitch = true;
  };

  private updateMove(): void {
    const k = this.keys;
    this.core.input.forward = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    this.core.input.right = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    this.core.input.walk = k.has('ShiftLeft') || k.has('ShiftRight');
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Tab') {
      e.preventDefault();
      this.cb.onScoreboard(true);
      return;
    }
    if (this.buyMode && this.core.buyOpen) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= BUY_ITEMS.length) {
        this.core.buy(BUY_ITEMS[n - 1].id);
        return;
      }
      if (e.code === 'KeyB' || e.code === 'Escape') {
        this.closeBuy();
        return;
      }
    }
    if (!this.locked) {
      if (e.code === 'KeyB' && this.core.buyAllowed()) {
        this.openBuy();
      }
      return;
    }
    if (e.repeat) {
      this.keys.add(e.code);
      this.updateMove();
      return;
    }
    this.keys.add(e.code);
    this.updateMove();
    const inp = this.core.input;
    switch (e.code) {
      case 'Space': inp.jump = true; e.preventDefault(); break;
      case 'KeyR': inp.reload = true; break;
      case 'KeyE': inp.use = true; inp.usePressed = true; break;
      case 'KeyQ': inp.quickSwitch = true; break;
      case 'Digit1': inp.slot = 'primary' as Slot; break;
      case 'Digit2': inp.slot = 'secondary' as Slot; break;
      case 'Digit3': inp.slot = 'melee' as Slot; break;
      case 'KeyB':
        if (this.core.buyAllowed()) this.openBuy();
        break;
      case 'BracketLeft': this.core.cycleSpectate(-1); break;
      case 'BracketRight': this.core.cycleSpectate(1); break;
      case 'Enter': if (this.core.spectating) this.core.takeControl(); break;
      default: break;
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Tab') {
      this.cb.onScoreboard(false);
      return;
    }
    this.keys.delete(e.code);
    this.updateMove();
    if (e.code === 'KeyE') this.core.input.use = false;
  };

  private onBlur = (): void => {
    this.keys.clear();
    this.updateMove();
    this.core.input.fire = false;
    this.core.input.use = false;
  };

  openBuy(): void {
    this.core.buyOpen = true;
    this.buyMode = true;
    this.core.paused = true;
    this.core.input.fire = false;
    if (this.locked) document.exitPointerLock();
  }
  closeBuy(): void {
    this.core.buyOpen = false;
    this.buyMode = false;
    this.cb.onLock(false);
    this.requestLock();
  }

  dispose(): void {
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('pointerlockchange', this.onLockChange);
  }
}
