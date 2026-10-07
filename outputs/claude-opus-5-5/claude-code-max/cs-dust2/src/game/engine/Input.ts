/**
 * Raw keyboard / mouse state with pointer lock. Continuous state (held keys, buttons) is read
 * directly; discrete presses are queued as edges and consumed once per frame by the engine.
 */
export class Input {
  readonly down = new Set<string>();
  private readonly pressedQueue = new Set<string>();
  mouseButtons = 0;
  private dx = 0;
  private dy = 0;
  private wheel = 0;
  locked = false;
  private el: HTMLElement | null = null;
  onLockChange: ((locked: boolean) => void) | null = null;
  /** Keys typed while UI overlays are focused should not drive the game. */
  enabled = true;

  attach(el: HTMLElement): void {
    this.el = el;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('contextmenu', this.onContextMenu);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
  }

  detach(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('contextmenu', this.onContextMenu);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    if (document.pointerLockElement === this.el) document.exitPointerLock();
    this.el = null;
  }

  requestLock(): void {
    const el = this.el;
    if (!el || document.pointerLockElement === el) return;
    try {
      const p = el.requestPointerLock({ unadjustedMovement: true } as never) as unknown as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // some platforms reject unadjustedMovement: retry plain
          try {
            void (el.requestPointerLock() as unknown);
          } catch {
            /* ignore */
          }
        });
      }
    } catch {
      try {
        el.requestPointerLock();
      } catch {
        /* ignore */
      }
    }
  }

  exitLock(): void {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  /** Returns and clears the set of keys/buttons pressed since the last call. */
  consumePressed(): Set<string> {
    const s = new Set(this.pressedQueue);
    this.pressedQueue.clear();
    return s;
  }

  consumeMouse(): { dx: number; dy: number; wheel: number } {
    const r = { dx: this.dx, dy: this.dy, wheel: this.wheel };
    this.dx = 0;
    this.dy = 0;
    this.wheel = 0;
    return r;
  }

  clear(): void {
    this.down.clear();
    this.pressedQueue.clear();
    this.mouseButtons = 0;
    this.dx = this.dy = this.wheel = 0;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.enabled) return;
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;
    if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyB', 'Quote', 'Slash'].includes(e.code)) e.preventDefault();
    if (e.ctrlKey && this.locked) e.preventDefault();
    if (!e.repeat) this.pressedQueue.add(e.code);
    this.down.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.down.delete(e.code);
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (!this.enabled) return;
    if (!this.locked) return;
    this.mouseButtons |= 1 << e.button;
    this.pressedQueue.add(`Mouse${e.button}`);
  };

  private onMouseUp = (e: MouseEvent): void => {
    this.mouseButtons &= ~(1 << e.button);
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.locked) return;
    // guard against occasional huge spikes some browsers emit on lock
    if (Math.abs(e.movementX) > 600 || Math.abs(e.movementY) > 600) return;
    this.dx += e.movementX;
    this.dy += e.movementY;
  };

  private onWheel = (e: WheelEvent): void => {
    if (!this.locked) return;
    e.preventDefault();
    this.wheel += Math.sign(e.deltaY);
  };

  private onBlur = (): void => {
    this.down.clear();
    this.mouseButtons = 0;
  };

  private onContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  private onPointerLockChange = (): void => {
    this.locked = document.pointerLockElement === this.el && this.el !== null;
    if (!this.locked) {
      this.mouseButtons = 0;
      this.down.clear();
    }
    this.onLockChange?.(this.locked);
  };
}
