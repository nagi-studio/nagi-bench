export class Input {
  keys: Record<string, boolean> = {};
  mouseDown = false;
  rightDown = false;
  dx = 0;
  dy = 0;
  locked = false;
  wheel = 0;
  onKeyPress?: (code: string) => void;

  private el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onLockChange);
    window.addEventListener('wheel', this.onWheel, { passive: true });
  }

  requestLock() {
    this.el.requestPointerLock();
  }

  private onLockChange = () => {
    this.locked = document.pointerLockElement === this.el;
  };

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    this.onKeyPress?.(e.code);
    if (['Space', 'Tab'].includes(e.code)) e.preventDefault();
  };
  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };
  private onMouseMove = (e: MouseEvent) => {
    if (!this.locked) return;
    this.dx += e.movementX;
    this.dy += e.movementY;
  };
  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) this.mouseDown = true;
    if (e.button === 2) this.rightDown = true;
  };
  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) this.mouseDown = false;
    if (e.button === 2) this.rightDown = false;
  };
  private onWheel = (e: WheelEvent) => {
    this.wheel += Math.sign(e.deltaY);
  };

  consumeMouse() {
    const dx = this.dx;
    const dy = this.dy;
    this.dx = 0;
    this.dy = 0;
    return { dx, dy };
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    window.removeEventListener('wheel', this.onWheel);
  }
}
