/* Headless timeline check + preview renders. Usage: bun tools/check.ts [sweep] [t1,t2,...] [out.png] */
import { installDom } from "./dom-stub";
installDom();

const THREE = await import("three");
const { CinematicPlayer } = await import("@agentbench/cinematic-player");
const { buildWorld } = await import("../src/world");
const { buildShots } = await import("../src/shots");
const { voiceCues, soundCues, DURATION } = await import("../src/cues");
const { renderPreview, contactSheet } = await import("./raster");
import { writeFileSync } from "node:fs";

const W = 480, H = 270;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.005, 400000);
const fakeRenderer = { domElement: { width: W, height: H }, toneMappingExposure: 1 } as unknown as import("three").WebGLRenderer;
const t0 = performance.now();
const world = buildWorld(scene, camera, fakeRenderer);
const { shots } = buildShots(world);
console.log(`world built in ${(performance.now() - t0).toFixed(0)} ms, ${shots.length} shots`);
const player = new CinematicPlayer({ duration: DURATION, context: world.ctx, shots, cues: [...voiceCues, ...soundCues], requestFrame: () => 0, cancelFrame: () => {} });

const args = process.argv.slice(2);
if (args.includes("sweep")) {
  // coverage: every instant must belong to exactly one cut
  const sorted = [...shots].sort((a, b) => a.start - b.start);
  let prev = 0;
  for (const s of sorted) {
    if (Math.abs(s.start - prev) > 1e-6) console.log(`GAP/OVERLAP before ${s.id}: ${prev} -> ${s.start}`);
    prev = s.end;
  }
  if (prev !== DURATION) console.log(`timeline ends at ${prev}, duration ${DURATION}`);
  let errors = 0;
  const t1 = performance.now();
  for (let t = 0; t <= DURATION; t += 0.2) {
    try {
      player.seek(t);
      const p = world.ctx.camera.position;
      if (!Number.isFinite(p.x + p.y + p.z)) { console.log(`non-finite camera at ${t.toFixed(1)}`); errors++; }
      const q = world.ctx.camera.quaternion;
      if (!Number.isFinite(q.x + q.y + q.z + q.w)) { console.log(`non-finite camera rotation at ${t.toFixed(1)}`); errors++; }
    } catch (e) {
      errors++;
      if (errors < 10) console.log(`error at ${t.toFixed(2)}:`, (e as Error).stack);
    }
  }
  // backwards seeks and a mid-film jump must also be safe
  for (const t of [300, 12, 157, 205.3, 358, 0, 322.5]) player.seek(t);
  console.log(`sweep done in ${(performance.now() - t1).toFixed(0)} ms, errors: ${errors}`);
  // overlapping voice cues
  const vs = [...voiceCues].sort((a, b) => a.start - b.start);
  for (let i = 1; i < vs.length; i++) if (vs[i]!.start < vs[i - 1]!.end) console.log(`voice overlap ${vs[i - 1]!.id} / ${vs[i]!.id}`);
  for (const v of vs) {
    const cps = v.text.length / (v.end - v.start);
    if (cps > 8.5) console.log(`fast subtitle ${v.id}: ${cps.toFixed(1)} chars/s`);
  }
}

const timesArg = args.find((a) => /^[\d.,]+$/.test(a));
if (timesArg) {
  const times = timesArg.split(",").map(Number);
  const out = args.find((a) => a.endsWith(".png")) ?? "preview.png";
  const frames: Uint8Array[] = [];
  for (const t of times) {
    player.seek(t);
    const tr = performance.now();
    const fx = world.ctx.fx;
    frames.push(renderPreview(scene, world.ctx.camera, W, H, { exposure: fakeRenderer.toneMappingExposure, fx }));
    const active = shots.filter((s) => t >= s.start && t < s.end).map((s) => s.id).join(",");
    console.log(`t=${t} [${active}] rendered in ${(performance.now() - tr).toFixed(0)} ms`);
  }
  const cols = Math.min(3, frames.length);
  const { png } = contactSheet(frames, W, H, cols);
  writeFileSync(out, png);
  console.log(`wrote ${out}`);
}
