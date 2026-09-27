// Tiny DOM / Canvas2D / WebAudio stand-ins so the client can run in Node for smoke tests.

const listeners = new Map();
const addL = (target) => (type, fn) => {
  const key = `${target}:${type}`;
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
};
const remL = (target) => (type, fn) => listeners.get(`${target}:${type}`)?.delete(fn);
export const fire = (target, type, ev = {}) => {
  for (const fn of listeners.get(`${target}:${type}`) ?? []) fn({ preventDefault() {}, ...ev });
};
export const listenerCount = () => [...listeners.values()].reduce((a, s) => a + s.size, 0);

// Canvas 2D context: a permissive object; drawing calls are no-ops.
function make2d(canvas) {
  const grad = { addColorStop() {} };
  const ctx = {
    canvas,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    globalAlpha: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'top',
    shadowColor: '',
    shadowBlur: 0,
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    putImageData() {},
    createRadialGradient: () => grad,
    createLinearGradient: () => grad,
  };
  return new Proxy(ctx, {
    get(t, p) {
      if (p in t) return t[p];
      return () => undefined;
    },
    set(t, p, v) {
      t[p] = v;
      return true;
    },
  });
}

function makeCanvas() {
  const c = {
    width: 300,
    height: 150,
    style: {},
    className: '',
    remove() {},
    getContext: () => make2d(c),
    requestPointerLock() {
      globalThis.document.pointerLockElement = c;
      queueMicrotask(() => fire('document', 'pointerlockchange'));
      return Promise.resolve();
    },
  };
  return c;
}

// ---- WebAudio
const checkTime = (t, what) => {
  if (!Number.isFinite(t) || t < 0) throw new Error(`audio: bad time for ${what}: ${t}`);
};
function param(v = 0) {
  return {
    value: v,
    setValueAtTime(val, t) {
      if (!Number.isFinite(val)) throw new Error('audio: setValueAtTime non-finite');
      checkTime(t, 'setValueAtTime');
    },
    linearRampToValueAtTime(val, t) {
      if (!Number.isFinite(val)) throw new Error('audio: linearRamp non-finite');
      checkTime(t, 'linearRamp');
    },
    exponentialRampToValueAtTime(val, t) {
      if (!Number.isFinite(val) || val === 0) throw new Error(`audio: exponentialRamp invalid value ${val}`);
      checkTime(t, 'expRamp');
    },
  };
}
let audioNodes = 0;
const node = (extra = {}) => {
  audioNodes++;
  return { connect(n) { if (!n) throw new Error('audio: connect(undefined)'); return n; }, disconnect() {}, ...extra };
};
const source = (extra) =>
  node({
    started: false,
    start(t = 0, off = 0) {
      if (this.started) throw new Error('audio: start twice');
      this.started = true;
      checkTime(t, 'start');
      checkTime(off, 'start offset');
    },
    stop(t = 0) {
      checkTime(t, 'stop');
    },
    ...extra,
  });

class FakeAudioContext {
  constructor() {
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.state = 'running';
    this.destination = node();
  }
  createGain() {
    return node({ gain: param(1) });
  }
  createBiquadFilter() {
    return node({ type: 'lowpass', frequency: param(350), Q: param(1) });
  }
  createStereoPanner() {
    return node({ pan: param(0) });
  }
  createConvolver() {
    return node({ buffer: null });
  }
  createDynamicsCompressor() {
    return node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() });
  }
  createOscillator() {
    return source({ type: 'sine', frequency: param(440) });
  }
  createBufferSource() {
    return source({ buffer: null, loop: false });
  }
  createBuffer(ch, len) {
    const data = Array.from({ length: ch }, () => new Float32Array(len));
    return { getChannelData: (i) => data[i] };
  }
  resume() {
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
}
export const audioNodeCount = () => audioNodes;

let rafCb = null;
export const takeRaf = () => {
  const cb = rafCb;
  rafCb = null;
  return cb;
};

export function installDom() {
  globalThis.document = {
    pointerLockElement: null,
    createElement: (tag) => (tag === 'canvas' ? makeCanvas() : { style: {} }),
    addEventListener: addL('document'),
    removeEventListener: remL('document'),
    exitPointerLock() {
      globalThis.document.pointerLockElement = null;
      queueMicrotask(() => fire('document', 'pointerlockchange'));
    },
  };
  globalThis.window = {
    devicePixelRatio: 1,
    addEventListener: addL('window'),
    removeEventListener: remL('window'),
    AudioContext: FakeAudioContext,
  };
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  globalThis.requestAnimationFrame = (cb) => {
    rafCb = cb;
    return 1;
  };
  globalThis.cancelAnimationFrame = () => {
    rafCb = null;
  };
}
