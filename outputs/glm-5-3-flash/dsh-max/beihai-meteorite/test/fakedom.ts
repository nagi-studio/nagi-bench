/* ---------------- 最小 DOM 伪造 ---------------- */

class FakeGradient {
  addColorStop(): void {}
}

class FakeImageData {
  data: Uint8ClampedArray;
  constructor(w: number, h: number) {
    this.data = new Uint8ClampedArray(w * h * 4);
  }
}

class FakeCtx2D {
  fillStyle = "";
  strokeStyle = "";
  globalAlpha = 1;
  imageSmoothingEnabled = false;
  font = "";
  fillRect(): void {}
  clearRect(): void {}
  strokeRect(): void {}
  beginPath(): void {}
  arc(): void {}
  fill(): void {}
  stroke(): void {}
  save(): void {}
  restore(): void {}
  translate(): void {}
  scale(): void {}
  drawImage(): void {}
  createRadialGradient(): FakeGradient {
    return new FakeGradient();
  }
  createLinearGradient(): FakeGradient {
    return new FakeGradient();
  }
  createImageData(w: number, h: number): FakeImageData {
    return new FakeImageData(w, h);
  }
  getImageData(x: number, y: number, w: number, h: number): FakeImageData {
    return new FakeImageData(w, h);
  }
  putImageData(): void {}
  fillText(): void {}
}

class FakeCanvas {
  width = 64;
  height = 64;
  style: Record<string, string> = {};
  getContext(): FakeCtx2D {
    return new FakeCtx2D();
  }
  toDataURL(): string {
    return "data:image/png;base64,AAAA";
  }
  addEventListener(): void {}
  removeEventListener(): void {}
  appendChild(): void {}
  setAttribute(): void {}
}

class FakeElement extends FakeCanvas {
  innerHTML = "";
  textContent = "";
  className = "";
  opacity = "";
  children: FakeElement[] = [];
  querySelector(): FakeElement {
    return new FakeElement();
  }
  querySelectorAll(): FakeElement[] {
    return [];
  }
}

const g = globalThis as unknown as Record<string, unknown>;
g.document = {
  createElement: (tag: string): FakeElement | FakeCanvas => (tag === "canvas" ? new FakeCanvas() : new FakeElement()),
  querySelector: (): FakeElement => new FakeElement(),
  createElementNS: (): FakeElement => new FakeElement(),
  body: new FakeElement(),
  addEventListener: (): void => {},
};
g.window = { addEventListener: (): void => {}, devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720 };
g.requestFullscreen = (): void => {};
g.HTMLCanvasElement = FakeCanvas;

