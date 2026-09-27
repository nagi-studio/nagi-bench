// Render preview stills of the real timeline with the software rasteriser.
// Usage: bun --preload ./test/shim-pix.ts test/render.ts <outDir> <t1> <t2> ...
import * as THREE from "three";
import { mkdirSync, writeFileSync } from "node:fs";
import { CinematicPlayer } from "@agentbench/cinematic-player";
import { buildShots, type Ctx } from "../src/shots";
import { SpaceSet } from "../src/sets/space";
import { HutongSet } from "../src/sets/hutong";
import { RoomSet } from "../src/sets/room";
import { ShopSet } from "../src/sets/shop";
import { BasementSet } from "../src/sets/basement";
import { canvasTex } from "../src/util";
import { Raster } from "./raster";

const args = process.argv.slice(2);
const wArg = args.find((a) => a.startsWith("--w="));
const [outDir, ...times] = args.filter((a) => !a.startsWith("--"));
mkdirSync(outDir, { recursive: true });
const W = wArg ? Number(wArg.slice(4)) : 480;
const H = Math.round(W / 2.39);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.02, 300000);
const duskSky = canvasTex(4, 256, (c) => {
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#0e1428");
  g.addColorStop(0.45, "#2a3456");
  g.addColorStop(0.72, "#6a5a70");
  g.addColorStop(0.88, "#c07a5a");
  g.addColorStop(1, "#d8a070");
  c.fillStyle = g;
  c.fillRect(0, 0, 4, 256);
});
const renderer = { toneMappingExposure: 1 } as any;
const ctx: Ctx = {
  scene, camera, renderer,
  space: new SpaceSet(), hutong: new HutongSet(), room: new RoomSet(), shop: new ShopSet(), basement: new BasementSet(),
  current: "", duskSky,
};
for (const g of [ctx.space.group, ctx.hutong.group, ctx.room.group, ctx.shop.group, ctx.basement.group]) {
  g.visible = false;
  scene.add(g);
}
const player = new CinematicPlayer<Ctx>({ duration: 358, context: ctx, shots: buildShots(), requestFrame: () => 0, cancelFrame: () => {} });
const shots = player.getShots();
for (const ts of times) {
  const t = Number(ts);
  player.seek(t);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  if (ctx.space.group.visible) ctx.space.follow(camera);
  const r = new Raster(W, H);
  const a = performance.now();
  r.render(scene, camera, renderer.toneMappingExposure);
  const id = shots.find((s) => t >= s.start && t < s.end)?.id ?? "none";
  const file = `${outDir}/${t.toFixed(1).padStart(6, "0")}_${id}.png`;
  writeFileSync(file, r.png());
  console.log(`${file} (${(performance.now() - a).toFixed(0)} ms)`);
}
