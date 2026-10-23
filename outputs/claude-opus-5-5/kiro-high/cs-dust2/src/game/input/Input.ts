// Keyboard / mouse / pointer-lock input. Raw events are buffered; edge-triggered
// presses are consumed once by the fixed-step simulation, mouse deltas once per frame.

export class Input {
  private held = new Set<string>();
  private pressed = new Set<string>();
  private mouseHeld = [false, false, false];
  private mousePressed = [false, false, false];
  private wheel = 0;
  dx = 0;
  dy = 0;
  locked = false;
  private el: HTMLElement;
  onLockChange: ((locked: boolean) => void) | null = null;
  /** Called for every keydown (used by UI-level hotkeys). */
  onKey: ((code: string) => void) | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.blur);
    document.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mouseup', this.mouseUp);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('wheel', this.onWheel, { passive: false });
    document.addEventListener('pointerlockchange', this.lockChange);
    document.addEventListener('contextmenu', this.ctxMenu);
  }

  dispose() {
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
    window.removeEventListener('blur', this.blur);
    document.removeEventListener('mousedown', this.mouseDown);
    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('pointerlockchange', this.lockChange);
    document.removeEventListener('contextmenu', this.ctxMenu);
    if (document.pointerLockElement === this.el) document.exitPointerLock();
  }

  requestLock() {
    if (document.pointerLockElement !== this.el) {
      const p = this.el.requestPointerLock() as unknown as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') p.catch(() => undefined);
    }
  }

  private keyDown = (e: KeyboardEvent) => {
    if (this.locked && (e.code === 'Tab' || e.code === 'Space' || e.code.startsWith('Digit') || e.code === 'KeyB')) e.preventDefault();
    if (!e.repeat) {
      this.pressed.add(e.code);
      this.onKey?.(e.code);
    }
    this.held.add(e.code);
  };
  private keyUp = (e: KeyboardEvent) => {
    this.held.delete(e.code);
  };
  private blur = () => {
    this.held.clear();
    this.mouseHeld = [false, false, false];
  };
  private mouseDown = (e: MouseEvent) => {
    if (!this.locked) return;
    if (e.button < 3) {
      this.mouseHeld[e.button] = true;
      this.mousePressed[e.button] = true;
    }
  };
  private mouseUp = (e: MouseEvent) => {
    if (e.button < 3) this.mouseHeld[e.button] = false;
  };
  private mouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    // clamp absurd spikes some browsers emit on lock
    if (Math.abs(e.movementX) > 400 || Math.abs(e.movementY) > 400) return;
    this.dx += e.movementX;
    this.dy += e.movementY;
  };
  private onWheel = (e: WheelEvent) => {
    if (!this.locked) return;
    e.preventDefault();
    this.wheel += Math.sign(e.deltaY);
  };
  private lockChange = () => {
    this.locked = document.pointerLockElement === this.el;
    if (!this.locked) {
      this.mouseHeld = [false, false, false];
      this.held.clear();
    }
    this.onLockChange?.(this.locked);
  };
  private ctxMenu = (e: Event) => e.preventDefault();

  isDown(code: string): boolean {
    return this.held.has(code);
  }

  /** Edge-triggered: returns true once per physical press. */
  take(code: string): boolean {
    if (this.pressed.has(code)) {
      this.pressed.delete(code);
      return true;
    }
    return false;
  }

  mouseDown0(): boolean {
    return this.mouseHeld[0];
  }

  takeMouse(button: number): boolean {
    if (this.mousePressed[button]) {
      this.mousePressed[button] = false;
      return true;
    }
    return false;
  }

  takeWheel(): number {
    const w = this.wheel;
    this.wheel = 0;
    return w;
  }

  takeLook(): [number, number] {
    const r: [number, number] = [this.dx, this.dy];
    this.dx = 0;
    this.dy = 0;
    return r;
  }

  clearEdges() {
    this.pressed.clear();
    this.mousePressed = [false, false, false];
    this.wheel = 0;
  }
}
