import type { SlotId } from '../core/types.ts';
import type { GameEngine } from '../game/engine.ts';

export interface InputCallbacks {
  onLockChange(locked: boolean): void;
  onToggleScoreboard(show: boolean): void;
  onToggleBuy(): void;
  onToggleMute(): void;
  onFirstInteraction(): void;
}

const SLOT_KEYS: Record<string, SlotId> = {
  Digit1: 'primary',
  Digit2: 'secondary',
  Digit3: 'melee',
  Digit5: 'bomb',
};

/**
 * Keyboard + mouse binding. Writes straight into the engine's input struct;
 * the engine consumes it on its next fixed tick, so input never drives the
 * simulation at an uneven rate.
 */
export class InputController {
  private engine: GameEngine;
  private canvas: HTMLCanvasElement;
  private cb: InputCallbacks;
  private keys = new Set<string>();
  private locked = false;
  private interacted = false;
  sensitivity = 0.0022;
  private bound: Array<[EventTarget, string, EventListenerOrEventListenerObject]> = [];

  constructor(engine: GameEngine, canvas: HTMLCanvasElement, cb: InputCallbacks) {
    this.engine = engine;
    this.canvas = canvas;
    this.cb = cb;
  }

  attach(): void {
    const on = (target: EventTarget, type: string, fn: EventListenerOrEventListenerObject) => {
      target.addEventListener(type, fn);
      this.bound.push([target, type, fn]);
    };
    on(window, 'keydown', this.onKeyDown as EventListener);
    on(window, 'keyup', this.onKeyUp as EventListener);
    on(window, 'mousemove', this.onMouseMove as EventListener);
    on(window, 'mousedown', this.onMouseDown as EventListener);
    on(window, 'mouseup', this.onMouseUp as EventListener);
    on(window, 'wheel', this.onWheel as EventListener);
    on(document, 'pointerlockchange', this.onPointerLockChange as EventListener);
    on(window, 'blur', this.releaseAll as EventListener);
    on(this.canvas, 'contextmenu', this.preventDefault as EventListener);
  }

  detach(): void {
    for (const [target, type, fn] of this.bound) target.removeEventListener(type, fn);
    this.bound = [];
    this.releaseAll();
  }

  requestLock(): void {
    if (!this.interacted) {
      this.interacted = true;
      this.cb.onFirstInteraction();
    }
    this.canvas.requestPointerLock?.();
  }

  exitLock(): void {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  get isLocked(): boolean {
    return this.locked;
  }

  private preventDefault = (e: Event): void => {
    e.preventDefault();
  };

  private onPointerLockChange = (): void => {
    this.locked = document.pointerLockElement === this.canvas;
    if (!this.locked) this.releaseAll();
    this.cb.onLockChange(this.locked);
  };

  private releaseAll = (): void => {
    this.keys.clear();
    const inp = this.engine.input;
    inp.forward = 0;
    inp.strafe = 0;
    inp.jump = false;
    inp.crouch = false;
    inp.walk = false;
    inp.fire = false;
    inp.altFire = false;
    inp.use = false;
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked) return;
    this.engine.applyMouse(e.movementX, e.movementY, this.sensitivity);
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.locked) return;
    if (e.button === 0) {
      this.engine.input.fire = true;
      this.engine.input.firePressed = true;
      // Dead players use the fire button to cycle spectator targets.
      if (!this.engine.controlledActor()) this.engine.spectateNext();
    } else if (e.button === 2) {
      this.engine.input.altFire = true;
      this.engine.input.altFirePressed = true;
    }
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.engine.input.fire = false;
    else if (e.button === 2) this.engine.input.altFire = false;
  };

  private onWheel = (e: WheelEvent): void => {
    if (!this.locked) return;
    const a = this.engine.controlledActor();
    if (!a) return;
    const order: SlotId[] = ['primary', 'secondary', 'melee'];
    const owned = order.filter((s) => a.weapons[s]);
    if (owned.length < 2) return;
    const i = owned.indexOf(a.activeSlot);
    const next = owned[(i + (e.deltaY > 0 ? 1 : owned.length - 1)) % owned.length];
    this.engine.input.slotRequest = next;
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.repeat) {
      if (e.code === 'Tab') e.preventDefault();
      return;
    }
    this.keys.add(e.code);
    const inp = this.engine.input;

    switch (e.code) {
      case 'Tab':
        e.preventDefault();
        this.cb.onToggleScoreboard(true);
        return;
      case 'KeyB':
        this.cb.onToggleBuy();
        return;
      case 'KeyM':
        this.cb.onToggleMute();
        return;
      case 'KeyR':
        inp.reload = true;
        break;
      case 'KeyF':
        // Take over the team-mate we are spectating.
        if (!this.engine.controlledActor()) this.engine.takeControl();
        break;
      case 'Space':
        if (!this.engine.controlledActor()) this.engine.spectateNext();
        break;
      default:
        break;
    }
    const slot = SLOT_KEYS[e.code];
    if (slot) inp.slotRequest = slot;
    this.syncMovement();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
    if (e.code === 'Tab') {
      e.preventDefault();
      this.cb.onToggleScoreboard(false);
    }
    this.syncMovement();
  };

  /** Fold the pressed-key set into the engine's movement intent. */
  private syncMovement(): void {
    const k = this.keys;
    const inp = this.engine.input;
    inp.forward = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    inp.strafe = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    inp.jump = k.has('Space');
    inp.crouch = k.has('ControlLeft') || k.has('ControlRight') || k.has('KeyC');
    inp.walk = k.has('ShiftLeft') || k.has('ShiftRight');
    inp.use = k.has('KeyE');
  }
}
