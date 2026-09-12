/**
 * DOM input -> `PlayerInput`.
 *
 * Keyboard and mouse state is accumulated between frames; edge-triggered actions (a click,
 * a key press) are latched so they survive until the next frame reads them, no matter how
 * the browser batches events.
 */

import { type PlayerInput, emptyInput } from '../game/playerinput.ts';

const KEY_BINDINGS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  crouch: ['ControlLeft', 'ControlRight', 'KeyC'],
  walk: ['ShiftLeft', 'ShiftRight'],
  reload: ['KeyR'],
  use: ['KeyE'],
  slot1: ['Digit1'],
  slot2: ['Digit2'],
  slot3: ['Digit3'],
  takeover: ['KeyF'],
  spectateNext: ['Space'],
  scoreboard: ['Tab'],
} as const;

function matches(code: string, list: readonly string[]): boolean {
  return list.includes(code);
}

export interface InputCallbacks {
  onPointerLockChange?(locked: boolean): void;
  onScoreboard?(shown: boolean): void;
  onPause?(): void;
}

export class InputController {
  readonly input: PlayerInput = emptyInput();
  pointerLocked = false;
  scoreboardHeld = false;

  private readonly keys = new Set<string>();
  private readonly canvas: HTMLElement;
  private readonly callbacks: InputCallbacks;
  private mouseDx = 0;
  private mouseDy = 0;
  private firePressedLatch = false;
  private reloadLatch = false;
  private scopeLatch = false;
  private slotLatch = 0;
  private takeoverLatch = false;
  private spectateLatch = false;
  private disposed = false;

  constructor(canvas: HTMLElement, callbacks: InputCallbacks = {}) {
    this.canvas = canvas;
    this.callbacks = callbacks;

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  requestPointerLock(): void {
    if (!this.pointerLocked) void this.canvas.requestPointerLock();
  }

  exitPointerLock(): void {
    if (this.pointerLocked) document.exitPointerLock();
  }

  setSensitivity(value: number): void {
    this.input.sensitivity = value;
  }

  /** Fills the input struct for this frame. */
  beginFrame(): PlayerInput {
    const i = this.input;
    const held = (list: readonly string[]) => list.some((k) => this.keys.has(k));

    i.forward = (held(KEY_BINDINGS.forward) ? 1 : 0) - (held(KEY_BINDINGS.back) ? 1 : 0);
    i.right = (held(KEY_BINDINGS.right) ? 1 : 0) - (held(KEY_BINDINGS.left) ? 1 : 0);
    i.jump = held(KEY_BINDINGS.jump);
    i.crouch = held(KEY_BINDINGS.crouch);
    i.walk = held(KEY_BINDINGS.walk);
    i.use = held(KEY_BINDINGS.use);

    i.firePressed = this.firePressedLatch;
    i.reloadPressed = this.reloadLatch;
    i.scopePressed = this.scopeLatch;
    i.switchSlot = this.slotLatch;
    i.takeoverPressed = this.takeoverLatch;
    i.spectateNextPressed = this.spectateLatch;

    i.mouseDx = this.mouseDx;
    i.mouseDy = this.mouseDy;
    return i;
  }

  /** Clears per-frame latches. Call after the world has consumed the input. */
  endFrame(): void {
    this.mouseDx = 0;
    this.mouseDy = 0;
    this.firePressedLatch = false;
    this.reloadLatch = false;
    this.scopeLatch = false;
    this.slotLatch = 0;
    this.takeoverLatch = false;
    this.spectateLatch = false;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (matches(e.code, KEY_BINDINGS.scoreboard)) {
      e.preventDefault();
      if (!this.scoreboardHeld) {
        this.scoreboardHeld = true;
        this.callbacks.onScoreboard?.(true);
      }
      return;
    }
    if (e.code === 'Escape') {
      this.callbacks.onPause?.();
      return;
    }
    if (e.repeat) return;

    this.keys.add(e.code);
    if (matches(e.code, KEY_BINDINGS.jump)) e.preventDefault();
    if (matches(e.code, KEY_BINDINGS.reload)) this.reloadLatch = true;
    if (matches(e.code, KEY_BINDINGS.slot1)) this.slotLatch = 1;
    if (matches(e.code, KEY_BINDINGS.slot2)) this.slotLatch = 2;
    if (matches(e.code, KEY_BINDINGS.slot3)) this.slotLatch = 3;
    if (matches(e.code, KEY_BINDINGS.takeover)) this.takeoverLatch = true;
    if (matches(e.code, KEY_BINDINGS.spectateNext)) this.spectateLatch = true;
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (matches(e.code, KEY_BINDINGS.scoreboard)) {
      this.scoreboardHeld = false;
      this.callbacks.onScoreboard?.(false);
      return;
    }
    this.keys.delete(e.code);
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.pointerLocked) return;
    this.mouseDx += e.movementX;
    this.mouseDy += e.movementY;
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.pointerLocked) return;
    if (e.button === 0) {
      this.input.fire = true;
      this.firePressedLatch = true;
    } else if (e.button === 2) {
      this.scopeLatch = true;
    }
  };

  private onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.input.fire = false;
  };

  private onBlur = (): void => {
    this.keys.clear();
    this.input.fire = false;
  };

  private onContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  private onPointerLockChange = (): void => {
    this.pointerLocked = document.pointerLockElement === this.canvas;
    if (!this.pointerLocked) {
      this.keys.clear();
      this.input.fire = false;
    }
    this.callbacks.onPointerLockChange?.(this.pointerLocked);
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
  }
}
