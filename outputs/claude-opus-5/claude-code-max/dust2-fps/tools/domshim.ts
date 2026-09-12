/**
 * Minimal browser shim so the render layer can be exercised in Node (dev only).
 * Provides just enough canvas/window surface for the procedural texture helpers.
 */

interface FakeContext {
  createImageData(w: number, h: number): { data: Uint8ClampedArray };
  putImageData(): void;
  createRadialGradient(): { addColorStop(): void };
  fillRect(): void;
  clearRect(): void;
  fillText(): void;
  fillStyle: string;
  font: string;
  textAlign: string;
  textBaseline: string;
}

function makeContext(): FakeContext {
  return {
    createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    putImageData: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    fillRect: () => {},
    clearRect: () => {},
    fillText: () => {},
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
  };
}

const g = globalThis as unknown as Record<string, unknown>;

if (!g.document) {
  g.document = {
    createElement(tag: string) {
      if (tag !== 'canvas') return {};
      return { width: 0, height: 0, getContext: () => makeContext() };
    },
  };
}

if (!g.window) {
  g.window = { devicePixelRatio: 1, innerWidth: 1280, innerHeight: 720 };
}

if (!g.performance) {
  g.performance = { now: () => Date.now() };
}

export {};
