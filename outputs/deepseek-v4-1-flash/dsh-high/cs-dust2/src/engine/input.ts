import type { ActorInput } from '../game/types';

export class InputManager {
  private keys = new Set<string>();
  private justPressed = new Set<string>();
  private mouseDX = 0;
  private mouseDY = 0;
  fireHeld = false;
  firePressed = false;
  scopePressed = false;
  locked = false;
  sensitivity = 0.0022;

  private canvas: HTMLCanvasElement | null = null;
  private onLockChange?: (locked: boolean) => void;

  attach(canvas: HTMLCanvasElement, onLockChange?: (locked: boolean) => void) {
    this.canvas = canvas;
    this.onLockChange = onLockChange;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    document.addEventListener('pointerlockchange', this.handleLockChange);
    canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('contextmenu', this.handleContextMenu);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    document.removeEventListener('pointerlockchange', this.handleLockChange);
    this.canvas?.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('contextmenu', this.handleContextMenu);
  }

  requestLock() {
    try {
      const p = this.canvas?.requestPointerLock() as unknown as Promise<void> | undefined;
      if (p && typeof p.catch === 'function') p.catch(() => undefined);
    } catch {
      /* pointer lock unavailable (e.g. headless) */
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (['Space', 'Tab', 'ControlLeft', 'KeyC'].includes(e.code)) e.preventDefault();
    if (!this.keys.has(e.code)) this.justPressed.add(e.code);
    this.keys.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private handleBlur = () => {
    this.keys.clear();
    this.fireHeld = false;
  };

  private handleLockChange = () => {
    this.locked = document.pointerLockElement === this.canvas;
    this.onLockChange?.(this.locked);
    if (!this.locked) {
      this.keys.clear();
      this.fireHeld = false;
    }
  };

  private handleMouseDown = (e: MouseEvent) => {
    if (!this.locked) return;
    if (e.button === 0) {
      if (!this.fireHeld) this.firePressed = true;
      this.fireHeld = true;
    } else if (e.button === 2) {
      this.scopePressed = true;
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.fireHeld = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    this.mouseDX += e.movementX;
    this.mouseDY += e.movementY;
  };

  private handleContextMenu = (e: Event) => e.preventDefault();

  consumeLook(): { dx: number; dy: number } {
    const dx = this.mouseDX;
    const dy = this.mouseDY;
    this.mouseDX = 0;
    this.mouseDY = 0;
    return { dx, dy };
  }

  wasPressed(code: string): boolean {
    return this.justPressed.has(code);
  }

  endFrame() {
    this.justPressed.clear();
    this.firePressed = false;
    this.scopePressed = false;
  }

  buildInput(): ActorInput {
    const f = (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0);
    const s = (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
    return {
      moveX: s,
      moveZ: f,
      jump: this.keys.has('Space'),
      crouch: this.keys.has('ControlLeft') || this.keys.has('KeyC'),
      fire: this.fireHeld,
      reload: this.wasPressed('KeyR'),
      use: this.keys.has('KeyE'),
      scope: this.scopePressed,
    };
  }
}
