// Keyboard / mouse / pointer-lock input. Held state + per-frame edge queues.

export interface FrameInput {
  dx: number;
  dy: number;
  pressed: Set<string>;
  mousePressed: Set<number>;
  wheel: number;
}

export class Input {
  readonly keys = new Set<string>();
  readonly mouse = new Set<number>();
  locked = false;
  private dx = 0;
  private dy = 0;
  private wheel = 0;
  private pressed = new Set<string>();
  private mousePressed = new Set<number>();
  private el: HTMLElement;
  onLockChange: ((locked: boolean) => void) | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('wheel', this.onWheel, { passive: false });
    document.addEventListener('contextmenu', this.onContext);
    document.addEventListener('pointerlockchange', this.onLock);
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('wheel', this.onWheel);
    document.removeEventListener('contextmenu', this.onContext);
    document.removeEventListener('pointerlockchange', this.onLock);
    if (document.pointerLockElement === this.el) document.exitPointerLock();
  }

  requestLock() {
    if (document.pointerLockElement === this.el) return;
    try {
      // unadjustedMovement = raw mouse input where supported
      const p = (this.el.requestPointerLock as (o?: unknown) => Promise<void> | void).call(this.el, { unadjustedMovement: true });
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch(() => {
          try {
            const p2 = this.el.requestPointerLock() as unknown as Promise<void> | undefined;
            p2?.catch?.(() => undefined);
          } catch {
            /* ignored: browser refused (e.g. too soon after ESC) */
          }
        });
      }
    } catch {
      try {
        this.el.requestPointerLock();
      } catch {
        /* ignored */
      }
    }
  }

  exitLock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  consume(): FrameInput {
    const out: FrameInput = {
      dx: this.dx,
      dy: this.dy,
      pressed: this.pressed,
      mousePressed: this.mousePressed,
      wheel: this.wheel,
    };
    this.dx = 0;
    this.dy = 0;
    this.wheel = 0;
    this.pressed = new Set();
    this.mousePressed = new Set();
    return out;
  }

  down(code: string) {
    return this.keys.has(code);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'Backquote'].includes(e.code) || (this.locked && e.code.startsWith('Digit'))) e.preventDefault();
    if (e.ctrlKey && e.code === 'KeyW') e.preventDefault();
    if (!this.keys.has(e.code)) this.pressed.add(e.code);
    this.keys.add(e.code);
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };
  private onBlur = () => {
    this.keys.clear();
    this.mouse.clear();
  };
  private onMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    // guard against the occasional huge spike some browsers emit on lock
    if (Math.abs(e.movementX) > 400 || Math.abs(e.movementY) > 400) return;
    this.dx += e.movementX;
    this.dy += e.movementY;
  };
  private onMouseDown = (e: MouseEvent) => {
    if (!this.locked) return;
    this.mouse.add(e.button);
    this.mousePressed.add(e.button);
  };
  private onMouseUp = (e: MouseEvent) => {
    this.mouse.delete(e.button);
  };
  private onWheel = (e: WheelEvent) => {
    if (!this.locked) return;
    e.preventDefault();
    this.wheel += Math.sign(e.deltaY);
  };
  private onContext = (e: Event) => e.preventDefault();
  private onLock = () => {
    this.locked = document.pointerLockElement === this.el;
    if (!this.locked) {
      this.mouse.clear();
      this.keys.clear();
    }
    this.onLockChange?.(this.locked);
  };
}
