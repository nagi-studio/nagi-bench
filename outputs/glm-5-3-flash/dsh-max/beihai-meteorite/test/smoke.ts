/**
 * 无头冒烟测试：在 Node/Bun 里伪造 DOM canvas，逐帧驱动整条时间轴，
 * 覆盖所有镜头 update、环境 update、cue 调度与随机跳转，捕获运行时异常。
 */

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

/* ---------------- 测试本体 ---------------- */

const { CinematicPlayer, validateVoiceCues } = await import("@agentbench/cinematic-player");
const { createCast } = await import("../src/core/cast");
const { voiceCues } = await import("../src/core/voice");
const { soundCues } = await import("../src/core/sound");
const { DURATION, buildShots, fadeOpacity, scopeOpacity } = await import("../src/core/timeline");
const { makeAlley, makeBase, makeRoom, makeShop } = await import("../src/world/ground");
const { makeSpace } = await import("../src/world/space");

const t0 = Date.now();
const cast = createCast();
const alley = makeAlley(cast);
const room = makeRoom(cast);
const shop = makeShop(cast);
const base = makeBase(cast);
const space = makeSpace(cast);
console.log(`environments built in ${Date.now() - t0} ms`);

const scene = { background: null, fog: null } as unknown as import("three").Scene;
const camera = new (await import("three")).PerspectiveCamera(40, 1, 0.05, 250000);
const rendererStub = { toneMappingExposure: 1 } as unknown as import("three").WebGLRenderer;

const context = {
  scene,
  camera,
  renderer: rendererStub,
  env: { alley, room, shop, base, space },
};

validateVoiceCues(voiceCues, DURATION);
// 声音 cue 的时间也要落在片长内
for (const cue of [...voiceCues, ...soundCues]) {
  if (cue.start < 0 || cue.end > DURATION || cue.end <= cue.start) {
    throw new Error(`cue ${cue.id} out of range: ${cue.start}..${cue.end}`);
  }
}
// 台词不许互相重叠（后期逐条配音的前提）
const sorted = [...voiceCues].sort((a, b) => a.start - b.start);
for (let i = 1; i < sorted.length; i++) {
  if (sorted[i]!.start < sorted[i - 1]!.end) {
    throw new Error(`voice cues overlap: ${sorted[i - 1]!.id} & ${sorted[i]!.id}`);
  }
}

const pending: Array<(ts: number) => void> = [];
const player = new CinematicPlayer<typeof context>({
  duration: DURATION,
  context,
  shots: buildShots(context as never),
  cues: [...voiceCues, ...soundCues],
  requestFrame: (cb) => {
    pending.push(cb);
    return pending.length;
  },
  cancelFrame: () => {},
});

function step(dtMs: number): void {
  const cbs = pending.splice(0);
  const ts = lastTs + dtMs;
  lastTs = ts;
  for (const cb of cbs) cb(ts);
}

let lastTs = 0;
player.play();

// 1) 全片连续播放（0.1 s 步长）
let frames = 0;
let lastCamera = { x: NaN, y: NaN, z: NaN };
while (player.state !== "ended" && frames < 6000) {
  step(100);
  frames++;
  if (!Number.isFinite(camera.position.x + camera.position.y + camera.position.z)) {
    throw new Error(`camera NaN at t=${player.currentTime}`);
  }
  lastCamera = camera.position.clone() as never;
  const f = fadeOpacity(player.currentTime);
  const s = scopeOpacity(player.currentTime);
  if (!Number.isFinite(f) || !Number.isFinite(s)) throw new Error(`overlay NaN at ${player.currentTime}`);
}
if (player.state !== "ended") throw new Error("playback did not reach the end");
console.log(`full playback ok: ${frames} frames, t=${player.currentTime.toFixed(1)}s`);

// 2) 跳转扫描：每 7 秒一处，前后各一帧
for (let t = 0; t < DURATION; t += 7) {
  player.seek(t);
  step(16);
  player.seek(Math.min(DURATION, t + 0.5));
  step(16);
  if (!Number.isFinite(camera.position.x)) throw new Error(`seek NaN at ${t}`);
}
console.log("seek sweep ok");

// 3) 关键时刻逐帧检查（击发、命中、面罩碎裂、人群返回）
const criticals = [206.3, 212, 239.0, 239.3, 245.2, 248.7, 251.3, 257.5, 263.3, 267.0, 302, 327.5];
for (const c of criticals) {
  for (let dt = -0.2; dt <= 0.4; dt += 0.05) {
    player.seek(Math.max(0, Math.min(DURATION, c + dt)));
    step(16);
  }
}
console.log("critical moments ok");

// 4) 暂停/恢复与 sustain 重启路径
player.seek(100);
player.pause();
player.play();
step(16);
step(200);
player.pause();
console.log("pause/resume ok");

console.log(`camera ended at`, lastCamera);
console.log("SMOKE OK");
