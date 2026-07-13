// Keyboard + mouse + pointer-lock input. Movement/aim are polled each frame;
// discrete actions (weapon switch, reload, jump) use edge-triggered presses.

export class Input {
  keys = new Set<string>();
  private justPressed = new Set<string>();
  mouseDX = 0;
  mouseDY = 0;
  left = false;
  right = false;
  leftJustPressed = false;
  wheel = 0;
  locked = false;
  private el: HTMLElement;
  private handlers: Array<[EventTarget, string, EventListenerOrEventListenerObject]> = [];

  constructor(el: HTMLElement) {
    this.el = el;
    const gameKeys = new Set([
      'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'KeyR', 'KeyE', 'KeyG',
      'KeyF', 'Digit1', 'Digit2', 'Digit3', 'Tab', 'KeyB',
    ]);

    const onKeyDown = (e: KeyboardEvent) => {
      if (gameKeys.has(e.code)) e.preventDefault();
      if (!e.repeat && !this.keys.has(e.code)) this.justPressed.add(e.code);
      this.keys.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (!this.locked) return;
      if (e.button === 0) {
        this.left = true;
        this.leftJustPressed = true;
      } else if (e.button === 2) {
        this.right = true;
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) this.left = false;
      else if (e.button === 2) this.right = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!this.locked) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    };
    const onContext = (e: Event) => e.preventDefault();
    const onWheel = (e: WheelEvent) => {
      if (this.locked) {
        e.preventDefault();
        this.wheel += Math.sign(e.deltaY);
      }
    };
    const onLockChange = () => {
      this.locked = document.pointerLockElement === this.el;
      if (!this.locked) {
        this.keys.clear();
        this.left = this.right = false;
      }
    };

    this.add(window, 'keydown', onKeyDown as EventListener);
    this.add(window, 'keyup', onKeyUp as EventListener);
    this.add(window, 'mousedown', onMouseDown as EventListener);
    this.add(window, 'mouseup', onMouseUp as EventListener);
    this.add(window, 'mousemove', onMouseMove as EventListener);
    this.add(el, 'contextmenu', onContext);
    this.add(el, 'wheel', onWheel as EventListener, { passive: false } as AddEventListenerOptions);
    this.add(document, 'pointerlockchange', onLockChange);
  }

  private add(
    target: EventTarget, type: string, fn: EventListenerOrEventListenerObject,
    opts?: AddEventListenerOptions,
  ): void {
    target.addEventListener(type, fn, opts);
    this.handlers.push([target, type, fn]);
  }

  requestLock(): void {
    // Pointer lock can be unavailable (sandboxed iframe, unfocused document).
    // Swallow both sync throws and promise rejections; keyboard control still
    // works and the game keeps running in that degraded mode.
    try {
      const r = this.el.requestPointerLock?.() as unknown as Promise<void> | undefined;
      if (r && typeof r.catch === 'function') r.catch(() => {});
    } catch {
      /* ignore */
    }
  }

  down(code: string): boolean {
    return this.keys.has(code);
  }

  pressed(code: string): boolean {
    return this.justPressed.has(code);
  }

  // call at end of each frame after inputs consumed
  endFrame(): void {
    this.justPressed.clear();
    this.leftJustPressed = false;
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
  }

  dispose(): void {
    for (const [t, type, fn] of this.handlers) t.removeEventListener(type, fn);
    this.handlers = [];
  }
}
