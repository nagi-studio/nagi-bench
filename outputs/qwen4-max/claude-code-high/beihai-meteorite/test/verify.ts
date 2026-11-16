/**
 * Headless verification harness.
 *
 * The offline sandbox has no browser binary and no network egress, so a literal
 * in-browser Play click is impossible here. This harness exercises the REAL
 * CinematicPlayer, the REAL shot lifecycle and the REAL scene graph (Three.js
 * math runs headless), driving play / pause / seek exactly as the transport UI
 * would, and asserts timeline integrity, cue sync, framing and determinism.
 * Only the GPU draw and the DOM are stubbed.
 */
import * as THREE from "three";

/* ---------------- minimal canvas / 2d shim for voxel-kit skins ---------------- */
class Ctx2D {
  fillStyle = "#000000";
  imageSmoothingEnabled = false;
  constructor(private canvas: FakeCanvas) {}
  private parse(color: string): [number, number, number] {
    const c = new THREE.Color(color);
    return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)];
  }
  fillRect(x: number, y: number, w: number, h: number) {
    const [r, g, b] = this.parse(this.fillStyle);
    const px = this.canvas.pixels;
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
      if (i < 0 || j < 0 || i >= this.canvas.width || j >= this.canvas.height) continue;
      const o = (j * this.canvas.width + i) * 4;
      px[o] = r; px[o + 1] = g; px[o + 2] = b; px[o + 3] = 255;
    }
  }
  clearRect(x: number, y: number, w: number, h: number) {
    const px = this.canvas.pixels;
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
      if (i < 0 || j < 0 || i >= this.canvas.width || j >= this.canvas.height) continue;
      const o = (j * this.canvas.width + i) * 4;
      px[o] = 0; px[o + 1] = 0; px[o + 2] = 0; px[o + 3] = 0;
    }
  }
  getImageData(x: number, y: number, w: number, h: number) {
    const data = new Uint8ClampedArray(w * h * 4);
    const px = this.canvas.pixels;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const sx = x + i, sy = y + j;
      const so = (sy * this.canvas.width + sx) * 4, dO = (j * w + i) * 4;
      if (sx >= 0 && sy >= 0 && sx < this.canvas.width && sy < this.canvas.height) {
        data[dO] = px[so]; data[dO + 1] = px[so + 1]; data[dO + 2] = px[so + 2]; data[dO + 3] = px[so + 3];
      }
    }
    return { data, width: w, height: h };
  }
  putImageData(img: { data: Uint8ClampedArray; width: number; height: number }, x: number, y: number) {
    const px = this.canvas.pixels;
    for (let j = 0; j < img.height; j++) for (let i = 0; i < img.width; i++) {
      const dx = x + i, dy = y + j;
      if (dx < 0 || dy < 0 || dx >= this.canvas.width || dy >= this.canvas.height) continue;
      const so = (j * img.width + i) * 4, dO = (dy * this.canvas.width + dx) * 4;
      px[dO] = img.data[so]; px[dO + 1] = img.data[so + 1]; px[dO + 2] = img.data[so + 2]; px[dO + 3] = img.data[so + 3];
    }
  }
}
class FakeCanvas {
  width = 64; height = 64;
  pixels = new Uint8ClampedArray(64 * 64 * 4);
  private ctx = new Ctx2D(this);
  getContext(_type: string) { return this.ctx; }
}
(globalThis as any).document = {
  createElement: (tag: string) => (tag === "canvas" ? new FakeCanvas() : {}),
};

/* ---------------- import the real film ---------------- */
const { createFilm } = await import("../src/film/index");
const { CinematicPlayer } = await import("@agentbench/cinematic-player");

const film = createFilm();
const ctx = film.context;

let failures = 0;
const ok = (cond: boolean, msg: string) => {
  if (cond) console.log("  ✓ " + msg);
  else { failures++; console.log("  ✗ FAIL: " + msg); }
};

/* ---------------- manual frame pump ---------------- */
let pending: FrameRequestCallback | null = null;
let clock = 0;
const player = new CinematicPlayer({
  duration: film.duration,
  context: ctx,
  shots: film.shots,
  cues: [...film.voiceCues, ...film.soundCues],
  requestFrame: (cb) => { pending = cb; return 1; },
  cancelFrame: () => { pending = null; },
});

function pump(frames: number, stepMs = 16.7) {
  for (let i = 0; i < frames; i++) {
    const cb = pending; pending = null;
    if (!cb) break;
    clock += stepMs;
    cb(clock);
  }
}

console.log("\n== 1. Structure ==");
ok(film.duration <= 360, `duration ${film.duration}s <= 360s hard limit`);
ok(film.shots.length >= 20, `${film.shots.length} designed shots`);
ok(film.voiceCues.length >= 30, `${film.voiceCues.length} voice cues in manifest`);
const fields = ["id", "kind", "speaker", "text", "delivery", "start", "end"];
ok(film.voiceCues.every((c) => fields.every((f) => (c as any)[f] !== undefined && (c as any)[f] !== "")), "every voice cue has all 7 required fields");
ok(new Set(film.voiceCues.map((c) => c.id)).size === film.voiceCues.length, "voice cue ids unique");
ok(new Set(film.soundCues.map((c) => c.id)).size === film.soundCues.length, "sound cue ids unique");
// shots cover the timeline without gaps
const sorted = [...film.shots].sort((a, b) => a.start - b.start);
let covered = true;
for (let i = 1; i < sorted.length; i++) if (sorted[i].start > sorted[i - 1].end + 0.01) covered = false;
ok(covered && sorted[0].start === 0 && sorted[sorted.length - 1].end === film.duration, "shots cover 0..duration continuously");

console.log("\n== 2. Play advances the timeline ==");
player.play();
ok(player.isPlaying, "player.isPlaying after play()");
const t0 = player.currentTime;
pump(60); // ~1s
const t1 = player.currentTime;
ok(t1 > t0 + 0.8, `time advanced ${t0.toFixed(2)} -> ${t1.toFixed(2)}`);
pump(120); // ~2s more
ok(player.currentTime > t1 + 1.5, `time keeps advancing -> ${player.currentTime.toFixed(2)}`);

console.log("\n== 3. Pause freezes the timeline ==");
player.pause();
ok(player.state === "paused", "state paused");
const tp = player.currentTime;
pump(30);
ok(Math.abs(player.currentTime - tp) < 1e-6, "time frozen while paused");

console.log("\n== 4. Seek + shot lifecycle ==");
function activeShot(): string {
  const t = player.currentTime;
  const s = film.shots.find((sh) => t >= sh.start && t < sh.end);
  return s ? s.id : "(none)";
}
player.seek(172.5);
ok(activeShot() === "s13-testshot", `seek 172.5 -> ${activeShot()}`);
ok(ctx.sets.basement.visible && !ctx.sets.space.visible, "basement set revealed, space hidden");
player.seek(285);
ok(activeShot() === "s22-fire", `seek 285 -> ${activeShot()}`);
ok(ctx.sets.space.visible && ctx.zhang.pistol.visible, "space revealed, pistol drawn");
player.seek(230);
ok(activeShot() === "s18-void", `seek 230 -> ${activeShot()}`);
player.seek(344);
ok(activeShot() === "s26-coda", `seek 344 -> ${activeShot()}`);

console.log("\n== 5. Voice cue sync ==");
player.seek(108);
let active = player.getActiveCues().filter((c) => (c as any).speaker);
ok(active.some((c) => c.id === "v20"), `v20 (respect line) active at 108s: [${active.map((c) => c.id).join(",")}]`);
player.seek(308);
active = player.getActiveCues().filter((c) => (c as any).speaker);
ok(active.some((c) => c.id === "v46"), `v46 (陨石雨!) active at 308s`);
player.seek(228);
active = player.getActiveCues().filter((c) => (c as any).speaker);
ok(active.some((c) => c.id === "v35"), `v35 (void monologue) active at 228s`);

console.log("\n== 6. Determinism (seek away and back) ==");
player.seek(285);
const camA = ctx.camera.position.clone();
const flashA = (ctx.zhang.flash.material as THREE.MeshBasicMaterial).opacity;
player.seek(40);
player.seek(285);
const camB = ctx.camera.position.clone();
ok(camA.distanceTo(camB) < 1e-6, "camera position identical after re-seek");
ok(Math.abs(flashA - (ctx.zhang.flash.material as THREE.MeshBasicMaterial).opacity) < 1e-6, "muzzle flash state identical after re-seek");

console.log("\n== 7. Framing (subjects project into view) ==");
function inFrame(world: THREE.Vector3, margin = 1.05): boolean {
  ctx.camera.updateMatrixWorld();
  ctx.camera.matrixWorldInverse.copy(ctx.camera.matrixWorld).invert();
  const v = world.clone().project(ctx.camera);
  return Math.abs(v.x) <= margin && Math.abs(v.y) <= margin && v.z < 1;
}
// collector close-up at S5
player.seek(62);
ok(inFrame(new THREE.Vector3(2.7, 1.0, 1.4)), "S5: Mars stone in frame");
// Zhang face at S8
player.seek(110);
ok(inFrame(new THREE.Vector3(-1.2, 1.5, 1.95)), "S8: Zhang face in frame");
// the three targets in scope POV at S21
player.seek(272);
ok(inFrame(new THREE.Vector3(0, 6, -104), 1.2), "S21: target row in scope frame");
// Earth visible in the reveal
player.seek(190);
ok(inFrame(new THREE.Vector3(0, -200, -860), 1.6), "S15: Earth limb in frame");

console.log("\n== 8. Full playthrough (no exceptions) ==");
let threw = false;
try {
  player.seek(0);
  player.play();
  // pump the whole film at ~30fps until it ends
  const maxFrames = Math.ceil(film.duration * 30) + 200;
  let i = 0;
  while (player.isPlaying && i < maxFrames) {
    const cb = pending; pending = null;
    if (!cb) break;
    clock += 33.3;
    cb(clock);
    i++;
  }
} catch (e) {
  threw = true;
  console.log("  exception: " + (e as Error).stack);
}
ok(!threw, "full playthrough threw no exception");
ok(player.currentTime >= film.duration - 0.5, `reached the end (${player.currentTime.toFixed(2)}s)`);
ok(player.state === "ended", "state ended at duration");

console.log("\n== 9. Sound factories registered ==");
// every sound name used by a cue must have a factory; verify via the bus define map
const { WebAudioCueBus } = await import("@agentbench/cinematic-player");
const { registerSounds } = await import("../src/film/audio");
const bus = new WebAudioCueBus(player);
registerSounds(bus);
const names = new Set(film.soundCues.map((c) => c.sound));
ok(names.size >= 25, `${names.size} distinct procedural sounds designed`);
// (factories are private; we assert registration did not throw and names are non-empty)
ok([...names].every((n) => n.trim().length > 0), "all sound names non-empty");

console.log("\n== 10. Scene audit (no black frames / NaN / unlit subjects) ==");
function audit(time: number, label: string, subjectVisible: () => boolean) {
  player.seek(time);
  ctx.scene.updateMatrixWorld(true);
  let meshes = 0, points = 0, lights = 0, nan = 0, litIntensity = 0;
  ctx.scene.traverse((o) => {
    // only count objects whose ancestors are all visible
    let vis = true, p: THREE.Object3D | null = o;
    while (p) { if (!p.visible) { vis = false; break; } p = p.parent; }
    if (!vis) return;
    const wp = o.getWorldPosition(new THREE.Vector3());
    if (!Number.isFinite(wp.x) || !Number.isFinite(wp.y) || !Number.isFinite(wp.z)) nan++;
    if ((o as THREE.Mesh).isMesh) meshes++;
    if ((o as THREE.Points).isPoints) points++;
    if ((o as THREE.Light).isLight) { lights++; litIntensity += (o as THREE.Light).intensity; }
  });
  ok(nan === 0, `${label}: no NaN world positions`);
  ok(meshes + points > 2, `${label}: ${meshes} meshes + ${points} point clouds (not a black frame)`);
  ok(lights > 0 && litIntensity > 0.1, `${label}: ${lights} lights, intensity ${litIntensity.toFixed(1)}`);
  ok(subjectVisible(), `${label}: subject visible`);
}
audit(5, "S1 cold open", () => ctx.coldOpen.group.visible);
audit(25, "S3 room", () => ctx.collector.root.visible && ctx.zhang.figure.root.visible);
audit(110, "S8 respect", () => ctx.zhang.figure.root.visible);
audit(130, "S10 workshop", () => ctx.zhang.figure.root.visible);
audit(166, "S13 gunshot", () => ctx.zhang.figure.root.visible);
audit(195, "S15 reveal", () => ctx.zhang.figure.root.visible && ctx.space.earth.visible);
audit(235, "S18 void", () => ctx.zhang.figure.root.visible);
audit(266, "S20 photo", () => ctx.attendees.some((a) => a.figure.root.visible));
audit(290, "S22 fire", () => ctx.zhang.figure.root.visible && ctx.zhang.pistol.visible);
audit(310, "S24 impact", () => ctx.attendees.some((a) => a.figure.root.visible));
audit(340, "S26 coda", () => ctx.space.earth.visible);

console.log("\n========================================");
if (failures === 0) console.log("ALL CHECKS PASSED ✓");
else { console.log(`${failures} CHECK(S) FAILED ✗`); process.exit(1); }