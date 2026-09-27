// Headless timeline sweep: runs every shot's update across the whole film,
// checks for exceptions / NaNs and verifies each shot's subject is in frame.
import * as THREE from "three";
import { CinematicPlayer, validateVoiceCues } from "@agentbench/cinematic-player";
import { buildShots, type Ctx } from "../src/shots";
import { SpaceSet, slot, TARGETS, HATCH, sunDir } from "../src/sets/space";
import { HutongSet } from "../src/sets/hutong";
import { RoomSet } from "../src/sets/room";
import { ShopSet, TRAY } from "../src/sets/shop";
import { BasementSet, TABLE, CRATE } from "../src/sets/basement";
import { voiceCues } from "../src/voice";
import { buildSoundCues } from "../src/sound";

const DURATION = 358;
const t0 = performance.now();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 2.39, 0.02, 300000);
const ctx: Ctx = {
  scene, camera, renderer: { toneMappingExposure: 1 } as any,
  space: new SpaceSet(), hutong: new HutongSet(), room: new RoomSet(), shop: new ShopSet(), basement: new BasementSet(),
  current: "", duskSky: new THREE.Texture(),
};
for (const g of [ctx.space.group, ctx.hutong.group, ctx.room.group, ctx.shop.group, ctx.basement.group]) scene.add(g);
console.log(`sets built in ${(performance.now() - t0).toFixed(0)} ms`);

validateVoiceCues(voiceCues, DURATION);
const sounds = buildSoundCues(DURATION);
const shots = buildShots();
const player = new CinematicPlayer<Ctx>({
  duration: DURATION, context: ctx, shots, cues: [...voiceCues, ...sounds],
  requestFrame: () => 0, cancelFrame: () => {},
});
console.log(`voice cues ${voiceCues.length}, sound cues ${sounds.length}, shots ${shots.length}`);

// Coverage: every instant must be covered by exactly one shot.
for (let t = 0; t < DURATION; t += 0.05) {
  const n = shots.filter((s) => t >= s.start && t < s.end).length;
  if (n !== 1) throw new Error(`coverage ${n} shots at ${t.toFixed(2)}`);
}
// Voice overlaps (subtitles should not stack).
const vs = [...voiceCues].sort((a, b) => a.start - b.start);
for (let i = 1; i < vs.length; i++) if (vs[i].start < vs[i - 1].end) console.warn(`voice overlap ${vs[i - 1].id} / ${vs[i].id}`);
// Reading speed: Chinese characters per second.
for (const v of voiceCues) {
  const cps = v.text.replace(/[，。？！、…—\s]/g, "").length / (v.end - v.start);
  if (cps > 6.5) console.warn(`fast subtitle ${v.id}: ${cps.toFixed(1)} chars/s`);
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const wp = (o: THREE.Object3D) => { o.updateWorldMatrix(true, false); return o.getWorldPosition(new THREE.Vector3()); };
const headOf = (o: { fig: any }) => wp(o.fig.anchors.head).add(V(0, -0.22, 0));
const S = ctx.space;

const subjects: Record<string, () => Array<[string, THREE.Vector3]>> = {
  "s01-void": () => [["zhang", V(0, 0.9, 0)]],
  "s02-profile": () => [["head", headOf(S.zhang)]],
  "s03-establish": () => [["zhang", V(0, 0.9, 0)], ["station", V(0, -800, -5150)]],
  "s04a-alley": () => [["zhang", wp(ctx.hutong.zhang.root).add(V(0, 1, 0))], ["gate", V(0, 1.5, -14)]],
  "s04b-gate": () => [["zhang", headOf(ctx.hutong.zhang)]],
  "s05a-room-wide": () => [["collector", headOf(ctx.room.collector)], ["zhang", wp(ctx.room.zhang.root).add(V(0, 1, 0))]],
  "s05b-cabinets": () => [["zhang", wp(ctx.room.zhang.root).add(V(0, 1.2, 0))]],
  "s06a-tea-two": () => [["c", headOf(ctx.room.collector)], ["z", headOf(ctx.room.zhang)]],
  "s06b-zhang": () => [["z", headOf(ctx.room.zhang)]],
  "s06c-collector": () => [["c", headOf(ctx.room.collector)]],
  "s07a-stone": () => [["c", headOf(ctx.room.collector)]],
  "s07b-cup": () => [["z", headOf(ctx.room.zhang)]],
  "s07c-laugh": () => [["c", headOf(ctx.room.collector)], ["z", headOf(ctx.room.zhang)]],
  "s08a-collector": () => [["c", headOf(ctx.room.collector)]],
  "s08b-zhang": () => [["z", headOf(ctx.room.zhang)]],
  "s08c-high": () => [["c", headOf(ctx.room.collector)], ["z", headOf(ctx.room.zhang)]],
  "s08d-iron-macro": () => [["iron", wp(ctx.room.irons[1])]],
  "s09a-top": () => ctx.room.irons.map((m, i) => [`iron${i}`, wp(m)] as [string, THREE.Vector3]),
  "s09b-price": () => [["c", headOf(ctx.room.collector)]],
  "s09c-phone": () => [["z", headOf(ctx.room.zhang)]],
  "s09d-awkward": () => [["c", headOf(ctx.room.collector)]],
  "s09e-firm": () => [["z", headOf(ctx.room.zhang)]],
  "s09f-respect": () => [["z", headOf(ctx.room.zhang)]],
  "s10a-limb": () => [["sun", sunDir(player.currentTime).multiplyScalar(1000).add(camera.position)]],
  "s10b-face": () => [["head", headOf(S.zhang)]],
  "s11a-shop": () => [["zhang", wp(ctx.shop.zhang.root).add(V(0, 1, 0))]],
  "s11b-chuck": () => [["chuck", V(-0.62 + 0.07, 1.3, -0.05)]],
  "s11c-screen": () => [["screen", V(1.45, 1.48, 0.57)]],
  "s11d-parting": () => [["rod", V(-0.5, 1.3, -0.05)]],
  "s11e-tray": () => [["tray", TRAY.clone()]],
  "s11f-cutter": () => [["zhang", wp(ctx.shop.zhang.root).add(V(0, 1.2, 0))]],
  "s12a-rounds": () => [["grid", V(TABLE.x - 0.14, TABLE.y, TABLE.z)]],
  "s12b-load": () => [["handR", wp(ctx.basement.zhang.fig.anchors.handR)], ["handL", wp(ctx.basement.zhang.fig.anchors.handL)]],
  "s12c-fire": () => [["zhang", headOf(ctx.basement.zhang)], ["bundle", V(CRATE.x, 0.6, CRATE.z)]],
  "s12d-holes": () => [["holes", V(CRATE.x, 0.63, CRATE.z + 0.28)]],
  "s12e-layers": () => [["beef", V(CRATE.x, 0.6, CRATE.z)]],
  "s12f-palm": () => [["palm", wp(ctx.basement.palmAnchor)]],
  "s13a-ring": () => [["head", headOf(S.zhang)]],
  "s13b-hatch-pov": () => [["hatch", HATCH.clone()]],
  "s14a-lineup-pov": () => [["t1", slot(TARGETS[1]).add(V(0, 0.9, 0))]],
  "s14b-visors-pov": () => [["t1", headOf(S.people[TARGETS[1]])]],
  "s14c-targets-pov": () => TARGETS.map((i) => [`t${i}`, headOf(S.people[i])] as [string, THREE.Vector3]),
  "s15a-glove": () => [["hand", wp(S.zhang.fig.anchors.handR)]],
  "s15b-sunhand": () => [["zhang", headOf(S.zhang)]],
  "s15c-magnet": () => [["hand", wp(S.zhang.fig.anchors.handR)]],
  "s16a-crosshair": () => [["t0", headOf(S.people[TARGETS[0]])]],
  "s16b-gun": () => [["hand", wp(S.zhang.fig.anchors.handR)]],
  "s16c-firefly": () => [["zhang", V(0, 1.2, 0)]],
  "s16d-face": () => [["head", headOf(S.zhang)]],
  "s17a-bullet": () => [["bullet", wp(S.bullet)]],
  "s17b-wait-pov": () => [["t1", headOf(S.people[TARGETS[1]])]],
  "s17c-smile": () => TARGETS.map((i) => [`t${i}`, headOf(S.people[i])] as [string, THREE.Vector3]),
  "s18a-impact-pov": () => [["t1", slot(TARGETS[1]).add(V(0, 0.9, 0))]],
  "s18b-chaos": () => [["group", V(0, -800, -4962)]],
  "s18c-pullback-pov": () => [["hatch", HATCH.clone()]],
  "s19a-turn": () => [["head", headOf(S.zhang)]],
  "s19b-home": () => (player.currentTime < 332 ? [["zhang", wp(S.zhang.root).add(V(0, 1, 0))]] : []),
  "s20a-radio": () => [["c", headOf(ctx.room.collector)]],
  "s20b-empty-shelf": () => [["shelf", V(0.3, 1.1, -2.5)]],
  "s20c-murmur": () => [["c", headOf(ctx.room.collector)]],
  "s21-end": () => [],
};

let problems = 0;
const sample = (t: number) => {
  player.seek(t);
  camera.updateMatrixWorld(true);
  const p = camera.position, q = camera.quaternion;
  if (![p.x, p.y, p.z, q.x, q.y, q.z, q.w, camera.fov].every(Number.isFinite)) {
    console.error(`non-finite camera at ${t}`);
    problems++;
  }
};

// Full sweep (seek) at 10 fps equivalent, then sequential steps like playback.
const sweep0 = performance.now();
for (let t = 0; t <= DURATION; t += 0.1) sample(Math.min(DURATION, t));
console.log(`seek sweep ok in ${((performance.now() - sweep0) / 1000).toFixed(1)} s`);
player.seek(0);
const step0 = performance.now();
let frames = 0;
while (player.currentTime < DURATION - 1e-6) {
  player.step(1 / 24);
  frames++;
}
console.log(`step sweep ok: ${frames} frames, ${((performance.now() - step0) / frames).toFixed(2)} ms/frame (update only)`);

// Framing check at 5 points per shot.
for (const s of shots) {
  const fn = subjects[s.id];
  if (!fn) { console.warn(`no subject for ${s.id}`); continue; }
  for (const f of [0.02, 0.25, 0.5, 0.75, 0.98]) {
    const t = s.start + (s.end - s.start) * f;
    player.seek(t);
    camera.updateMatrixWorld(true);
    for (const [name, pos] of fn()) {
      const ndc = pos.clone().project(camera);
      const inFront = pos.clone().applyMatrix4(camera.matrixWorldInverse).z < 0;
      const ok = inFront && Math.abs(ndc.x) <= 0.97 && Math.abs(ndc.y) <= 0.93;
      if (!ok) {
        problems++;
        console.warn(`${s.id} @${t.toFixed(2)} "${name}" off-frame ndc=(${ndc.x.toFixed(2)}, ${ndc.y.toFixed(2)}) front=${inFront}`);
      }
    }
  }
}

// Space perf probe: update cost at the busiest moments.
for (const t of [250, 309, 312, 330]) {
  const a = performance.now();
  for (let i = 0; i < 20; i++) player.seek(t + i * 0.01);
  console.log(`update @${t}: ${((performance.now() - a) / 20).toFixed(2)} ms`);
}
console.log(problems ? `${problems} problem(s)` : "all checks passed");
