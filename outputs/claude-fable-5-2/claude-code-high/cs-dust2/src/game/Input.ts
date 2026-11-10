// Keyboard / mouse / pointer-lock handling. Holds raw state; the Game translates it into
// ActorInput once per physics tick. Mouse-look deltas are delivered immediately through a
// callback so view rotation never waits for a tick.

export class Input {
  readonly down = new Set<string>();
  /** Keys pressed since the last `endFrame()` (edge triggers). */
  readonly pressed = new Set<string>();
  mouseL = false;
  mouseR = false;
  pressedL = false;
  pressedR = false;
  wheel = 0;
  locked = false;
  onLook: (dx: number, dy: number) => void = () => {};
  onLockChange: (locked: boolean) => void = () => {};

  private el: HTMLElement;
  private disposers: (() => void)[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const on = (target: Document | HTMLElement | Window, type: string, fn: (e: any) => void, opts?: AddEventListenerOptions) => {
      const listener = fn as EventListener;
      target.addEventListener(type, listener, opts);
      this.disposers.push(() => target.removeEventListener(type, listener, opts));
    };
    on(document, 'keydown', (e: KeyboardEvent) => {
      if (!this.locked) return;
      // keep the browser from scrolling / opening menus while playing
      if (['Space', 'Tab', 'ControlLeft', 'AltLeft', 'F1', 'F3', 'Quote', 'Slash'].includes(e.code) || e.ctrlKey) e.preventDefault();
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
    });
    on(document, 'keyup', (e: KeyboardEvent) => {
      this.down.delete(e.code);
    });
    on(document, 'mousemove', (e: MouseEvent) => {
      if (!this.locked) return;
      // guard against the occasional huge spurious delta some browsers report
      const dx = Math.max(-400, Math.min(400, e.movementX || 0));
      const dy = Math.max(-400, Math.min(400, e.movementY || 0));
      this.onLook(dx, dy);
    });
    on(document, 'mousedown', (e: MouseEvent) => {
      if (!this.locked) return;
      if (e.button === 0) {
        this.mouseL = true;
        this.pressedL = true;
      } else if (e.button === 2) {
        this.mouseR = true;
        this.pressedR = true;
      }
    });
    on(document, 'mouseup', (e: MouseEvent) => {
      if (e.button === 0) this.mouseL = false;
      else if (e.button === 2) this.mouseR = false;
    });
    on(
      document,
      'wheel',
      (e: WheelEvent) => {
        if (!this.locked) return;
        this.wheel += Math.sign(e.deltaY);
      },
      { passive: true },
    );
    on(document, 'contextmenu', (e: Event) => {
      if (this.locked) e.preventDefault();
    });
    on(document, 'pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.el;
      if (!this.locked) this.clear();
      this.onLockChange(this.locked);
    });
    on(window, 'blur', () => this.clear());
  }

  requestLock(): void {
    if (document.pointerLockElement === this.el) return;
    try {
      const r = this.el.requestPointerLock() as unknown;
      if (r && typeof (r as Promise<void>).catch === 'function') (r as Promise<void>).catch(() => {});
    } catch {
      /* the browser refused (e.g. no user gesture) */
    }
  }

  exitLock(): void {
    if (document.pointerLockElement === this.el) document.exitPointerLock();
  }

  clear(): void {
    this.down.clear();
    this.pressed.clear();
    this.mouseL = false;
    this.mouseR = false;
    this.pressedL = false;
    this.pressedR = false;
    this.wheel = 0;
  }

  /** Clears key edges after the per-frame key handling consumed them. */
  endKeys(): void {
    this.pressed.clear();
    this.wheel = 0;
  }

  /** Clears mouse-button edges once a physics tick has seen them. */
  endMouse(): void {
    this.pressedL = false;
    this.pressedR = false;
  }

  dispose(): void {
    for (const d of this.disposers) d();
    this.disposers = [];
    this.exitLock();
  }
}
