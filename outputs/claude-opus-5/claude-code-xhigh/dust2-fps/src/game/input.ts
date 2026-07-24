/**
 * 输入：指针锁定鼠标转视角 + 键盘填 Intent。
 * 输入只写"意图"，不直接改位置——和 AI 走同一条通道。
 */

import { clamp } from '../core/math.ts';
import type { Actor } from './actor.ts';
import { activeWeaponDef } from './actor.ts';
import type { WeaponSlot } from './weapons.ts';

export interface InputSettings {
  sensitivity: number;
  invertY: boolean;
  rawInput: boolean;
}

export const DEFAULT_INPUT: InputSettings = {
  sensitivity: 2.2,
  invertY: false,
  rawInput: true,
};

const SLOT_KEYS: Record<string, WeaponSlot> = {
  Digit1: 'primary',
  Digit2: 'secondary',
  Digit3: 'melee',
  Digit5: 'bomb',
  Digit4: 'bomb',
};

export type InputAction =
  | 'buy'
  | 'scoreboardOn'
  | 'scoreboardOff'
  | 'spectateNext'
  | 'spectatePrev'
  | 'takeControl'
  | 'menu';

export class InputSystem {
  settings: InputSettings = { ...DEFAULT_INPUT };
  private keys = new Set<string>();
  private mouseDX = 0;
  private mouseDY = 0;
  private wheel = 0;
  private mouseLeft = false;
  private mouseRight = false;
  private leftEdge = false;
  private prevLeft = false;
  locked = false;

  private element: HTMLElement | null = null;
  private onAction: (a: InputAction) => void = () => {};
  private onLockChange: (locked: boolean) => void = () => {};

  attach(
    element: HTMLElement,
    onAction: (a: InputAction) => void,
    onLockChange: (locked: boolean) => void,
  ): void {
    this.element = element;
    this.onAction = onAction;
    this.onLockChange = onLockChange;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('wheel', this.handleWheel, { passive: true });
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('pointerlockchange', this.handlePointerLock);
    element.addEventListener('contextmenu', this.preventContext);
  }

  detach(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('pointerlockchange', this.handlePointerLock);
    this.element?.removeEventListener('contextmenu', this.preventContext);
    this.element = null;
  }

  requestLock(): void {
    this.element?.requestPointerLock();
  }

  exitLock(): void {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  private preventContext = (e: Event) => e.preventDefault();

  private handlePointerLock = () => {
    this.locked = document.pointerLockElement === this.element;
    if (!this.locked) {
      this.keys.clear();
      this.mouseLeft = false;
      this.mouseRight = false;
    }
    this.onLockChange(this.locked);
  };

  private handleBlur = () => {
    this.keys.clear();
    this.mouseLeft = false;
    this.mouseRight = false;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Tab') e.preventDefault();
    if (e.repeat) {
      if (e.code === 'Tab') this.onAction('scoreboardOn');
      return;
    }
    this.keys.add(e.code);
    switch (e.code) {
      case 'KeyB':
        this.onAction('buy');
        break;
      case 'Tab':
        this.onAction('scoreboardOn');
        break;
      case 'Space':
        this.onAction('spectateNext');
        break;
      case 'KeyF':
        this.onAction('takeControl');
        break;
      case 'Escape':
        this.onAction('menu');
        break;
      default:
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    if (e.code === 'Tab') this.onAction('scoreboardOff');
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    this.mouseDX += e.movementX;
    this.mouseDY += e.movementY;
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (!this.locked) return;
    if (e.button === 0) this.mouseLeft = true;
    if (e.button === 2) this.mouseRight = true;
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.mouseLeft = false;
    if (e.button === 2) this.mouseRight = false;
  };

  private handleWheel = (e: WheelEvent) => {
    if (!this.locked) return;
    this.wheel += Math.sign(e.deltaY);
  };

  isDown(code: string): boolean {
    return this.keys.has(code);
  }

  /** 把累积的鼠标位移应用到视角上（在物理步之前调用，保证零延迟）。 */
  applyLook(actor: Actor): void {
    if (!this.locked) {
      this.mouseDX = 0;
      this.mouseDY = 0;
      return;
    }
    const def = activeWeaponDef(actor);
    const scopeSens = actor.scoped && def.scope ? def.scope.sens : 1;
    const s = this.settings.sensitivity * 0.00022 * scopeSens;
    actor.yaw -= this.mouseDX * s;
    const dy = this.settings.invertY ? -this.mouseDY : this.mouseDY;
    actor.pitch = clamp(actor.pitch - dy * s, -1.54, 1.54);
    // 保持 yaw 在合理范围，避免浮点累积
    if (actor.yaw > Math.PI * 4 || actor.yaw < -Math.PI * 4) {
      actor.yaw = ((actor.yaw + Math.PI) % (Math.PI * 2)) - Math.PI;
    }
    this.mouseDX = 0;
    this.mouseDY = 0;
  }

  /** 填充这一帧的操作意图。 */
  fillIntent(actor: Actor, allowInput: boolean): void {
    const it = actor.intent;
    if (!allowInput || !this.locked) {
      it.forward = 0;
      it.strafe = 0;
      it.jump = false;
      it.crouch = false;
      it.walk = false;
      it.fire = false;
      it.firePressed = false;
      it.reload = false;
      it.use = false;
      it.scope = false;
      it.switchTo = null;
      this.prevLeft = this.mouseLeft;
      return;
    }

    let f = 0;
    let s = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) f += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) f -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) s += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) s -= 1;
    it.forward = f;
    it.strafe = s;
    it.jump = this.keys.has('Space');
    it.crouch = this.keys.has('ControlLeft') || this.keys.has('ControlRight') || this.keys.has('KeyC');
    it.walk = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    it.reload = this.keys.has('KeyR');
    it.use = this.keys.has('KeyE');
    it.scope = this.mouseRight;

    it.fire = this.mouseLeft;
    this.leftEdge = this.mouseLeft && !this.prevLeft;
    // 只置位、不清零：高刷屏上一帧可能一个物理步都没跑（渲染 144Hz vs 物理 64Hz），
    // 这时如果这里把 firePressed 覆盖回 false，这一次点击就丢了。
    // 清零交给引擎在真正处理过之后做。
    if (this.leftEdge) it.firePressed = true;
    this.prevLeft = this.mouseLeft;

    // 数字键切枪
    let slot: WeaponSlot | null = null;
    for (const code in SLOT_KEYS) {
      if (this.keys.has(code)) {
        slot = SLOT_KEYS[code];
        break;
      }
    }
    // 滚轮切枪
    if (this.wheel !== 0) {
      const order: WeaponSlot[] = ['primary', 'secondary', 'melee', 'bomb'];
      const avail = order.filter((o) => actor.inventory[o]);
      if (avail.length > 0) {
        const idx = avail.indexOf(actor.activeSlot);
        const next = avail[(idx + (this.wheel > 0 ? 1 : -1) + avail.length * 2) % avail.length];
        slot = next;
      }
      this.wheel = 0;
    }
    // 同理：切枪指令也只置位，等引擎消费
    if (slot) it.switchTo = slot;
  }
}
