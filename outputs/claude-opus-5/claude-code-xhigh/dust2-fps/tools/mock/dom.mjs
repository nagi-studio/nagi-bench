/** 极简 DOM/Canvas 替身，让程序化贴图代码能在 Node 里跑。 */

class MockGradient {
  addColorStop() {}
}

class MockContext2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = '#000';
    this.strokeStyle = '#000';
    this.lineWidth = 1;
    this.font = '10px sans-serif';
    this.textAlign = 'left';
    this.globalAlpha = 1;
    this.ops = 0;
  }
  fillRect() {
    this.ops++;
  }
  clearRect() {}
  strokeRect() {
    this.ops++;
  }
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  bezierCurveTo() {}
  quadraticCurveTo() {}
  fill() {
    this.ops++;
  }
  stroke() {
    this.ops++;
  }
  fillText() {
    this.ops++;
  }
  setLineDash() {}
  save() {}
  restore() {}
  scale() {}
  translate() {}
  rotate() {}
  drawImage() {}
  createLinearGradient() {
    return new MockGradient();
  }
  createRadialGradient() {
    return new MockGradient();
  }
  getImageData(x, y, w, h) {
    return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h };
  }
  putImageData() {
    this.ops++;
  }
}

class MockCanvas {
  constructor() {
    this.width = 300;
    this.height = 150;
    this._ctx = null;
  }
  getContext(kind) {
    if (kind !== '2d') return null;
    if (!this._ctx) this._ctx = new MockContext2D(this);
    return this._ctx;
  }
  addEventListener() {}
  removeEventListener() {}
}

export function installDom() {
  const listeners = new Map();
  globalThis.document = {
    createElement(tag) {
      if (tag === 'canvas') return new MockCanvas();
      return { style: {}, addEventListener() {}, removeEventListener() {} };
    },
    addEventListener() {},
    removeEventListener() {},
    pointerLockElement: null,
    getElementById: () => null,
  };
  globalThis.window = {
    devicePixelRatio: 1,
    innerWidth: 1600,
    innerHeight: 900,
    addEventListener: (k, f) => listeners.set(k, f),
    removeEventListener: (k) => listeners.delete(k),
    requestAnimationFrame: (cb) => setTimeout(() => cb(performance.now()), 0),
    cancelAnimationFrame: (id) => clearTimeout(id),
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    AudioContext: undefined,
  };
  globalThis.requestAnimationFrame = globalThis.window.requestAnimationFrame;
  globalThis.cancelAnimationFrame = globalThis.window.cancelAnimationFrame;
  globalThis.HTMLCanvasElement = MockCanvas;
  return { MockCanvas };
}
