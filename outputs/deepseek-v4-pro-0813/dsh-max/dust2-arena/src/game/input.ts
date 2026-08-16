// 键盘 / 鼠标输入状态
export class Input {
  keys = new Set<string>();
  justPressed = new Set<string>();
  mouseDX = 0;
  mouseDY = 0;
  mouseDown = false;
  justClicked = false;
  wheel = 0;

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    this.keys.add(e.code);
    this.justPressed.add(e.code);
  };
  private onKeyUp = (e: KeyboardEvent) => { this.keys.delete(e.code); };
  private onMouseDown = (e: MouseEvent) => {
    if (e.button === 0) { this.mouseDown = true; this.justClicked = true; }
    if (e.button === 2) this.justPressed.add('Mouse2');
  };
  private onMouseUp = (e: MouseEvent) => { if (e.button === 0) this.mouseDown = false; };
  private onMouseMove = (e: MouseEvent) => {
    this.mouseDX += e.movementX || 0;
    this.mouseDY += e.movementY || 0;
  };
  private onWheel = (e: WheelEvent) => { this.wheel += Math.sign(e.deltaY); };
  private onCtx = (e: Event) => e.preventDefault();

  attach(el: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('wheel', this.onWheel);
    el.addEventListener('contextmenu', this.onCtx);
  }
  detach(el: HTMLElement) {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('wheel', this.onWheel);
    el.removeEventListener('contextmenu', this.onCtx);
  }
  /** 每帧结束调用 */
  endFrame() {
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.justPressed.clear();
    this.justClicked = false;
    this.wheel = 0;
  }
  down(...codes: string[]): boolean { return codes.some((c) => this.keys.has(c)); }
  pressed(...codes: string[]): boolean { return codes.some((c) => this.justPressed.has(c)); }
}
