import { installDom } from "./dom-stub";
installDom();
const THREE = await import("three");
const { CinematicPlayer } = await import("@agentbench/cinematic-player");
const { buildWorld } = await import("../src/world");
const { buildShots } = await import("../src/shots");
const { voiceCues, soundCues, DURATION } = await import("../src/cues");
const { headWorld } = await import("../src/blocking");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.005, 400000);
const fake = { domElement: { width: 480, height: 270 }, toneMappingExposure: 1 } as unknown as import("three").WebGLRenderer;
const world = buildWorld(scene, camera, fake);
const { shots, B } = buildShots(world);
const player = new CinematicPlayer({ duration: DURATION, context: world.ctx, shots, cues: [...voiceCues, ...soundCues], requestFrame: () => 0, cancelFrame: () => {} });
const t = Number(process.argv[2] ?? 330);
player.seek(t);
const c = world.ctx.camera;
console.log("cam", c.position.toArray().map((x) => x.toFixed(2)), "fov", c.fov);
const fig = B.centre.actor.fig;
console.log("centre root", fig.root.position.toArray().map((x) => x.toFixed(2)), "rot", fig.root.rotation.toArray().slice(0, 3));
console.log("centre head", headWorld(fig).toArray().map((x) => x.toFixed(2)));
for (const m of world.crowd) {
  const d = m.actor.fig.root.position.distanceTo(c.position);
  if (d < 2.5 && m.actor.fig.root.visible) console.log("near crowd", m.row, m.idx, d.toFixed(2), m.actor.fig.root.position.toArray().map((x) => x.toFixed(2)));
}
