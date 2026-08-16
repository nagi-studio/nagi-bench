import { installDomShim } from "./dom-shim";

installDomShim();

const { createFilm } = await import("../src/film");
const { voiceCues } = await import("../src/voice");
const { soundCues } = await import("../src/sound");
const { DURATION, T } = await import("../src/timeline");

const problems: string[] = [];
const note = (message: string): void => {
  problems.push(message);
  console.error(`✗ ${message}`);
};

// ── 时间轴结构 ────────────────────────────────────────────────────────
const entries = Object.entries(T) as Array<[string, readonly [number, number]]>;
let cursor = 0;
for (const [key, [start, end]] of entries) {
  if (Math.abs(start - cursor) > 1e-6) note(`分镜 ${key} 起点 ${start} 与上一镜结尾 ${cursor} 不连续`);
  if (end <= start) note(`分镜 ${key} 时长非正`);
  cursor = end;
}
if (Math.abs(cursor - DURATION) > 1e-6) note(`分镜总长 ${cursor} 与片长 ${DURATION} 不符`);
if (DURATION > 360) note(`片长 ${DURATION} 超过 360 秒硬上限`);

// ── 语音清单 ──────────────────────────────────────────────────────────
const FIELDS = ["id", "kind", "speaker", "text", "delivery", "start", "end"] as const;
for (const cue of voiceCues) {
  const keys = Object.keys(cue).sort().join(",");
  if (keys !== [...FIELDS].sort().join(",")) note(`语音 ${cue.id} 字段不是固定的七个：${keys}`);
  if (cue.end > DURATION) note(`语音 ${cue.id} 超出片长`);
  if (cue.end - cue.start < 1.2) note(`语音 ${cue.id} 只有 ${(cue.end - cue.start).toFixed(2)} 秒，来不及读`);
  const rate = cue.text.length / (cue.end - cue.start);
  if (rate > 8.5) note(`语音 ${cue.id} 每秒 ${rate.toFixed(1)} 字，太快：${cue.text}`);
}

// ── 声音清单 ──────────────────────────────────────────────────────────
const soundIds = new Set<string>();
for (const cue of soundCues) {
  if (soundIds.has(cue.id)) note(`声音 id 重复：${cue.id}`);
  soundIds.add(cue.id);
  if (cue.end > DURATION) note(`声音 ${cue.id} 超出片长`);
  if (cue.end <= cue.start) note(`声音 ${cue.id} 区间非法`);
}
// 真空段落里绝不允许出现舱外的实声
const EXTERNAL = new Set(["shot-crack", "shot-body", "room-slap", "meat-hit", "hatch", "depressurise", "cloth", "step-wood", "step-stone", "glass-case", "cup-down", "lathe-loop", "cut-bite", "gate", "basement-door"]);
for (const cue of soundCues) {
  if (cue.start >= T.s1[0] && EXTERNAL.has(cue.sound)) {
    note(`真空段落里出现了舱外实声 ${cue.sound}（${cue.id} @ ${cue.start}）`);
  }
}

// ── 把整条时间轴跑一遍 ────────────────────────────────────────────────
const container = (globalThis as unknown as { document: { createElement(tag: string): unknown } }).document
  .createElement("div") as HTMLElement;

// 画面之上的那一层用真实实现跑，不用桩：它是本项目自己的 DOM 代码。
const started = performance.now();
const film = createFilm({
  container,
  mountControls: false,
});
console.log(`场景构建：${(performance.now() - started).toFixed(0)} ms`);

const camera = film.context.camera;
const samples: Array<{ t: number; pos: string; fov: number }> = [];
const step = 1 / 30;
let frames = 0;
for (let t = 0; t <= DURATION + 1e-9; t += step) {
  const time = Math.min(DURATION, Number(t.toFixed(4)));
  try {
    film.player.seek(time);
  } catch (error) {
    note(`t=${time.toFixed(2)} 抛出异常：${(error as Error).message}\n${(error as Error).stack}`);
    break;
  }
  frames += 1;
  if (!Number.isFinite(camera.position.x + camera.position.y + camera.position.z)) {
    note(`t=${time.toFixed(2)} 机位不是有限值`);
    break;
  }
  if (!Number.isFinite(camera.fov) || camera.fov <= 0 || camera.fov > 120) {
    note(`t=${time.toFixed(2)} 焦距异常：${camera.fov}`);
    break;
  }
  if (Math.abs(time * 2 - Math.round(time * 2)) < 1e-6) {
    samples.push({
      t: time,
      pos: `${camera.position.x.toFixed(2)},${camera.position.y.toFixed(2)},${camera.position.z.toFixed(2)}`,
      fov: Number(camera.fov.toFixed(2)),
    });
  }
}
console.log(`逐帧扫描：${frames} 帧，${(performance.now() - started).toFixed(0)} ms`);

// ── 确定性：同一时刻两次求值必须完全一致 ──────────────────────────────
const probes = [3, 27, 58, 96, 112, 140, 170, 185, 199, 210, 236, 250, 268, 285, 297, 310, 330, 345, 356];
for (const probe of probes) {
  film.player.seek(0);
  film.player.seek(probe);
  const a = `${camera.position.toArray().map((v) => v.toFixed(4)).join(",")}|${camera.fov.toFixed(4)}|${camera.quaternion.toArray().map((v) => Number(v).toFixed(4)).join(",")}`;
  film.player.seek(DURATION);
  film.player.seek(probe);
  const b = `${camera.position.toArray().map((v) => v.toFixed(4)).join(",")}|${camera.fov.toFixed(4)}|${camera.quaternion.toArray().map((v) => Number(v).toFixed(4)).join(",")}`;
  if (a !== b) note(`t=${probe} 不确定：\n  A ${a}\n  B ${b}`);
}

// ── 每个镜头至少有一格是"有东西可看的" ────────────────────────────────
for (const [key, [start, end]] of entries) {
  film.player.seek((start + end) / 2);
  const visible = countVisible(film.context.scene);
  if (visible < 6) note(`分镜 ${key} 中点只有 ${visible} 个可见对象`);
}

function countVisible(root: { children: unknown[]; visible?: boolean }): number {
  let total = 0;
  const walk = (node: { children?: unknown[]; visible?: boolean; type?: string }): void => {
    if (node.visible === false) return;
    if (node.type === "Mesh" || node.type === "Points" || node.type === "Sprite") total += 1;
    for (const child of node.children ?? []) walk(child as never);
  };
  walk(root as never);
  return total;
}

console.log(`机位采样 ${samples.length} 个，例如 t=${samples[40]?.t} → ${samples[40]?.pos} fov ${samples[40]?.fov}`);
console.log(`语音 ${voiceCues.length} 条，声音 ${soundCues.length} 条，分镜 ${entries.length} 个，片长 ${DURATION}s`);

film.destroy();

if (problems.length > 0) {
  console.error(`\n共 ${problems.length} 个问题`);
  process.exit(1);
}
console.log("\n✓ 全部通过");
