/**
 * player.ts — keyboard / mouse input layer (pointer lock based).
 */

export class PlayerInput {
  keys = new Set<string>();
  pressed = new Set<string>();     // keys pressed since last frame
  mouseDX = 0;
  mouseDY = 0;
  fireHeld = false;
  firePressed = false;
  rmbHeld = false;
  rmbPressed = false;
  wheel = 0;
  locked = false;
  sensitivity = 0.0021;
  enabled = true;

  private el: HTMLElement;
  private handlers: [string, EventListener][] = [];

  constructor(el: HTMLElement) {
    this.el = el;
    const add = (target: EventTarget, type: string, fn: EventListener) => {
      target.addEventListener(type, fn);
      this.handlers.push([type, fn]);
    };

    add(window, 'keydown', (e) => {
      const ev = e as KeyboardEvent;
      if (ev.repeat) return;
      const code = ev.code;
      if (['Tab', 'Space', 'KeyE'].includes(code)) ev.preventDefault();
      this.keys.add(code);
      this.pressed.add(code);
    });
    add(window, 'keyup', (e) => { this.keys.delete((e as KeyboardEvent).code); });
    add(window, 'blur', () => { this.keys.clear(); this.fireHeld = false; this.rmbHeld = false; });

    add(el, 'mousedown', (e) => {
      const ev = e as MouseEvent;
      if (!this.locked) return;
      if (ev.button === 0) { this.fireHeld = true; this.firePressed = true; }
      if (ev.button === 2) { this.rmbHeld = true; this.rmbPressed = true; }
    });
    add(window, 'mouseup', (e) => {
      const ev = e as MouseEvent;
      if (ev.button === 0) this.fireHeld = false;
      if (ev.button === 2) this.rmbHeld = false;
    });
    add(el, 'contextmenu', (e) => e.preventDefault());
    add(window, 'mousemove', (e) => {
      if (!this.locked || !this.enabled) return;
      const ev = e as MouseEvent;
      this.mouseDX += ev.movementX * this.sensitivity;
      this.mouseDY += ev.movementY * this.sensitivity;
    });
    const wheelFn = (e: Event) => {
      if (!this.locked) return;
      this.wheel += Math.sign((e as WheelEvent).deltaY);
      e.preventDefault();
    };
    el.addEventListener('wheel', wheelFn, { passive: false });
    this.wheelFn = wheelFn;

    add(document, 'pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.el;
      if (!this.locked) { this.keys.clear(); this.fireHeld = false; this.rmbHeld = false; }
    });
  }

  requestLock() {
    const p = this.el.requestPointerLock() as unknown as Promise<void> | undefined;
    if (p && typeof p.catch === 'function') p.catch(() => { /* ignore */ });
  }
  releaseLock() { if (document.pointerLockElement === this.el) document.exitPointerLock(); }

  consumeMouse(): [number, number] {
    const r: [number, number] = [this.mouseDX, this.mouseDY];
    this.mouseDX = 0; this.mouseDY = 0;
    return r;
  }
  consumePressed(): Set<string> {
    const p = new Set(this.pressed);
    this.pressed.clear();
    return p;
  }
  consumeFire() { const f = this.firePressed; this.firePressed = false; return f; }
  consumeRmb() { const r = this.rmbPressed; this.rmbPressed = false; return r; }
  consumeWheel() { const w = this.wheel; this.wheel = 0; return w; }

  private wheelFn: ((e: Event) => void) | null = null;

  dispose() {
    for (const [type, fn] of this.handlers) {
      (type === 'contextmenu' || type === 'mousedown' ? this.el : window).removeEventListener(type, fn);
    }
    if (this.wheelFn) this.el.removeEventListener('wheel', this.wheelFn);
    this.handlers = [];
  }
}
