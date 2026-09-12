export class Input {
  keys = new Set<string>();
  mx = 0;
  my = 0;
  fireDown = false;
  firePressed = false;
  altDown = false;
  altPressed = false;
  interactDown = false;
  jumpPressed = false;
  reloadPressed = false;
  dropPressed = false;
  slot: 0 | 1 | 2 | null = null;
  cycleSpec = 0;
  takeoverPressed = false;
  scoreboard = false;
  locked = false;

  attach(canvas: HTMLCanvasElement): () => void {
    const kd = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      if (e.code === "Space") {
        e.preventDefault();
        this.jumpPressed = true;
      }
      if (e.code === "KeyR") this.reloadPressed = true;
      if (e.code === "KeyG") this.dropPressed = true;
      if (e.code === "Digit1") this.slot = 0;
      if (e.code === "Digit2") this.slot = 1;
      if (e.code === "Digit3") this.slot = 2;
      if (e.code === "KeyQ") this.cycleSpec = -1;
      if (e.code === "KeyF" || e.code === "KeyC") this.takeoverPressed = true;
      if (e.code === "Tab") {
        e.preventDefault();
        this.scoreboard = true;
      }
    };
    const ku = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
      if (e.code === "Tab") this.scoreboard = false;
    };
    const md = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
        return;
      }
      if (e.button === 0) {
        this.fireDown = true;
        this.firePressed = true;
      }
      if (e.button === 2) {
        this.altDown = true;
        this.altPressed = true;
      }
    };
    const mu = (e: MouseEvent) => {
      if (e.button === 0) this.fireDown = false;
      if (e.button === 2) this.altDown = false;
    };
    const mm = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      this.mx += e.movementX;
      this.my += e.movementY;
    };
    const lock = () => {
      this.locked = document.pointerLockElement === canvas;
    };
    const ctx = (e: Event) => e.preventDefault();
    const blur = () => {
      this.keys.clear();
      this.fireDown = false;
    };

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    canvas.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mu);
    window.addEventListener("mousemove", mm);
    document.addEventListener("pointerlockchange", lock);
    canvas.addEventListener("contextmenu", ctx);
    window.addEventListener("blur", blur);

    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      canvas.removeEventListener("mousedown", md);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("mousemove", mm);
      document.removeEventListener("pointerlockchange", lock);
      canvas.removeEventListener("contextmenu", ctx);
      window.removeEventListener("blur", blur);
    };
  }

  axis(): { x: number; z: number } {
    let x = 0;
    let z = 0;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) z -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) z += 1;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) x -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) x += 1;
    const len = Math.hypot(x, z);
    if (len > 0) {
      x /= len;
      z /= len;
    }
    return { x, z };
  }

  get interact(): boolean {
    return this.keys.has("KeyE");
  }

  get walk(): boolean {
    return this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
  }

  endFrame(): void {
    this.mx = 0;
    this.my = 0;
    this.firePressed = false;
    this.altPressed = false;
    this.jumpPressed = false;
    this.reloadPressed = false;
    this.dropPressed = false;
    this.slot = null;
    this.cycleSpec = 0;
    this.takeoverPressed = false;
  }
}