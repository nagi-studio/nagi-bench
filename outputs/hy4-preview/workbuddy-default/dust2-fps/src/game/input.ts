/**
 * Keyboard / mouse capture with pointer lock. Writes into a shared
 * InputState that the engine consumes every simulation step.
 */

import type { InputState } from './game';
import type { Slot } from './weapons';

export interface ControlActions {
  onPauseToggle?: () => void;
  onLockChange?: (locked: boolean) => void;
}

export class InputController {
  readonly state: InputState;
  private keys = new Set<string>();
  private el: HTMLElement | null = null;
  private actions: ControlActions;
  locked = false;
  enabled = true;
  sensitivity = 1.0;

  constructor(state: InputState, actions: ControlActions = {}) {
    this.state = state;
    this.actions = actions;
  }

  attach(el: HTMLElement): void {
    this.el = el;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('wheel', this.onWheel, { passive: true });
    window.addEventListener('contextmenu', this.onContextMenu);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    window.addEventListener('blur', this.onBlur);
  }

  detach(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('contextmenu', this.onContextMenu);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    window.removeEventListener('blur', this.onBlur);
    this.el = null;
  }

  requestLock(): void {
    if (this.el && !this.locked) this.el.requestPointerLock();
  }

  releaseLock(): void {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  private onBlur = (): void => {
    this.keys.clear();
    this.state.fire = false;
    this.state.ads = false;
    this.state.use = false;
    this.state.jump = false;
  };

  private onContextMenu = (e: Event): void => { e.preventDefault(); };

  private onPointerLockChange = (): void => {
    this.locked = document.pointerLockElement === this.el;
    this.actions.onLockChange?.(this.locked);
    if (!this.locked) this.onBlur();
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') return;
    // don't swallow typing in the freeze-time buy panel etc.
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (!this.keys.has(e.code)) {
      switch (e.code) {
        case 'Digit1': this.state.slotRequest = 'primary' as Slot; break;
        case 'Digit2': this.state.slotRequest = 'secondary' as Slot; break;
        case 'Digit3': this.state.slotRequest = 'melee' as Slot; break;
        case 'KeyR': this.state.reload = true; break;
        case 'KeyF': this.state.takeControl = true; break;
        default: break;
      }
    }
    this.keys.add(e.code);
    if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'Tab'].includes(e.code)) e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.locked || !this.enabled) return;
    if (e.button === 0) { this.state.fire = true; this.state.firePressed = true; }
    if (e.button === 2) this.state.ads = true;
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.state.fire = false;
    if (e.button === 2) this.state.ads = false;
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked || !this.enabled) return;
    this.state.mouseDX += e.movementX * this.sensitivity;
    this.state.mouseDY += e.movementY * this.sensitivity;
  };

  private onWheel = (e: WheelEvent): void => {
    if (!this.enabled) return;
    this.state.cycleSpectate += e.deltaY > 0 ? 1 : -1;
  };

  /** Poll discrete keys once per frame. */
  poll(): void {
    const k = this.keys;
    const s = this.state;
    s.forward = (k.has('KeyW') ? 1 : 0) + (k.has('KeyS') ? -1 : 0);
    s.strafe = (k.has('KeyD') ? 1 : 0) + (k.has('KeyA') ? -1 : 0);
    s.jump = k.has('Space');
    s.use = k.has('KeyE');
    s.walk = k.has('ShiftLeft') || k.has('ShiftRight');
    if (!this.enabled) {
      s.forward = 0; s.strafe = 0; s.jump = false; s.use = false;
      s.fire = false; s.ads = false; s.walk = false;
    }
  }
}
