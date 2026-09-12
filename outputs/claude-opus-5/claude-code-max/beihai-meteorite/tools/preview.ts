import { mkdirSync, writeFileSync } from "node:fs";

import { installDomShim } from "./dom-shim";

installDomShim();

const THREE = await import("three");
const { createFilm } = await import("../src/film");
const { encodePng, renderScene } = await import("./render");

const args = process.argv.slice(2);
const times = args.length > 0
  ? args.map(Number).filter((n) => Number.isFinite(n))
  : [2, 15, 25, 36, 46, 57, 67, 78, 89, 100, 112, 126, 139, 150, 161, 173, 184, 196, 208, 221, 236, 249, 260, 271, 283, 296, 308, 325, 333, 345, 354];

const WIDTH = Number(process.env.PREVIEW_WIDTH ?? 640);
const HEIGHT = Math.round(WIDTH / 2.39);

const container = (globalThis as unknown as { document: { createElement(tag: string): unknown } }).document
  .createElement("div") as HTMLElement;

const film = createFilm({
  container,
  mountControls: false,
  screen: {
    root: container,
    setFade() {},
    setFlash() {},
    setTitle() {},
    setGrain() {},
    hidePoster() {},
    destroy() {},
  } as never,
});

const camera = film.context.camera;
camera.aspect = WIDTH / HEIGHT;
camera.updateProjectionMatrix();

mkdirSync("preview", { recursive: true });
for (const time of times) {
  const started = performance.now();
  film.player.seek(time);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  const pixels = renderScene(film.context.scene as unknown as THREE.Scene, camera, {
    width: WIDTH,
    height: HEIGHT,
    exposure: Number(process.env.PREVIEW_EXPOSURE ?? 1.05),
  });
  const name = `preview/t${String(Math.round(time)).padStart(3, "0")}.png`;
  writeFileSync(name, encodePng(WIDTH, HEIGHT, pixels));
  console.log(`${name}  ${(performance.now() - started).toFixed(0)} ms`);
}
film.destroy();
