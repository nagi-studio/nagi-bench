// Input manager for keyboard and mouse
export class InputManager {
  keys: Set<string> = new Set();
  mouseX = 0;
  mouseY = 0;
  mouseDX = 0;
  mouseDY = 0;
  mouseDown = false;
  rightMouseDown = false;
  isLocked = false;
  private canvas: HTMLElement | null = null;
  private onKeyDown: (e: KeyboardEvent) => void;
  private onKeyUp: (e: KeyboardEvent) => void;
  private onMouseMove: (e: MouseEvent) => void;
  private onMouseDown: (e: MouseEvent) => void;
  private onMouseUp: (e: MouseEvent) => void;
  private onPointerLockChange: () => void;
  private keyPressCallbacks: Map<string, (() => void)[]> = new Map();

  constructor() {
    this.onKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      const cbs = this.keyPressCallbacks.get(e.code);
      if (cbs) cbs.forEach(cb => cb());
    };
    this.onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };
    this.onMouseMove = (e: MouseEvent) => {
      if (this.isLocked) {
        this.mouseDX += e.movementX;
        this.mouseDY += e.movementY;
      }
    };
    this.onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) this.mouseDown = true;
      if (e.button === 2) this.rightMouseDown = true;
    };
    this.onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) this.mouseDown = false;
      if (e.button === 2) this.rightMouseDown = false;
    };
    this.onPointerLockChange = () => {
      this.isLocked = document.pointerLockElement === this.canvas;
    };
  }

  attach(canvas: HTMLElement) {
    this.canvas = canvas;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  detach() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.onMouseDown);
    }
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
  }

  requestLock() {
    this.canvas?.requestPointerLock();
  }

  onKeyPress(code: string, callback: () => void) {
    if (!this.keyPressCallbacks.has(code)) {
      this.keyPressCallbacks.set(code, []);
    }
    this.keyPressCallbacks.get(code)!.push(callback);
  }

  consumeMouseDelta(): { dx: number; dy: number } {
    const d = { dx: this.mouseDX, dy: this.mouseDY };
    this.mouseDX = 0;
    this.mouseDY = 0;
    return d;
  }

  isKeyDown(code: string): boolean {
    return this.keys.has(code);
  }
}
