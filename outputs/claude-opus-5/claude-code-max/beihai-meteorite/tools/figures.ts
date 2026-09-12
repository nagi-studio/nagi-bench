import { mkdirSync, writeFileSync } from "node:fs";

import { installDomShim } from "./dom-shim";

installDomShim();

const THREE = await import("three");
const { applyPose } = await import("@agentbench/voxel-kit");
const { buildCast } = await import("../src/cast");
const { encodePng, renderScene } = await import("./render");

/** 体素规格要求：每个人都要正面和侧面各看一次。 */
const cast = buildCast();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1d22);
scene.add(new THREE.HemisphereLight(0x9fb2c8, 0x2a2620, 2.4));
const key = new THREE.DirectionalLight(0xfff2e0, 3.2);
key.position.set(3, 5, 6);
scene.add(key, key.target);
const rim = new THREE.DirectionalLight(0x9fc4e8, 1.6);
rim.position.set(-4, 3, -5);
scene.add(rim, rim.target);

const WIDTH = 420;
const HEIGHT = 520;
const camera = new THREE.PerspectiveCamera(24, WIDTH / HEIGHT, 0.05, 100);

mkdirSync("preview", { recursive: true });

const subjects: Array<[string, () => void]> = [
  ["zhang-civil", () => {
    cast.zhang.setClothes(cast.costumes.civil);
    cast.zhang.anchors.back.children.forEach((c) => { c.visible = false; });
  }],
  ["zhang-uniform", () => {
    cast.zhang.setClothes(cast.costumes.uniform);
    cast.zhang.anchors.back.children.forEach((c) => { c.visible = false; });
  }],
  ["zhang-suit", () => {
    cast.zhang.setClothes(cast.costumes.suit);
    cast.zhang.anchors.back.children.forEach((c) => { c.visible = true; });
  }],
  ["zhang-suit-bare", () => {
    cast.zhang.setClothes(cast.costumes.suitBareHand);
    cast.zhang.anchors.back.children.forEach((c) => { c.visible = true; });
  }],
];

scene.add(cast.zhang.root);
cast.zhang.root.visible = true;
applyPose(cast.zhang, {});

for (const [name, dress] of subjects) {
  dress();
  for (const [view, yaw] of [["front", 0], ["side", Math.PI / 2]] as const) {
    cast.zhang.root.rotation.y = yaw;
    camera.position.set(0, 0.95, 4.2);
    camera.lookAt(0, 0.95, 0);
    const pixels = renderScene(scene, camera, { width: WIDTH, height: HEIGHT });
    writeFileSync(`preview/fig-${name}-${view}.png`, encodePng(WIDTH, HEIGHT, pixels));
    console.log(`preview/fig-${name}-${view}.png`);
  }
}
cast.zhang.root.visible = false;

scene.add(cast.collector.root);
cast.collector.root.visible = true;
applyPose(cast.collector, {});
for (const [view, yaw] of [["front", 0], ["side", Math.PI / 2]] as const) {
  cast.collector.root.rotation.y = yaw;
  camera.position.set(0, 0.9, 4.2);
  camera.lookAt(0, 0.9, 0);
  const pixels = renderScene(scene, camera, { width: WIDTH, height: HEIGHT });
  writeFileSync(`preview/fig-collector-${view}.png`, encodePng(WIDTH, HEIGHT, pixels));
  console.log(`preview/fig-collector-${view}.png`);
}
cast.collector.root.visible = false;

// 合影里的三种面罩
const sample = cast.crowd[0]!;
scene.add(sample.root);
sample.root.visible = true;
sample.root.position.set(0, 0, 0);
applyPose(sample, {});
for (const [name, texture] of [
  ["mirror", cast.crowdVisor.mirror[0]!],
  ["clear", cast.crowdVisor.clear[0]!],
  ["hit", cast.crowdVisor.hit[0]!],
] as const) {
  sample.setClothes(texture);
  sample.root.rotation.y = 0;
  camera.position.set(0, 1.35, 1.5);
  camera.lookAt(0, 1.35, 0);
  const pixels = renderScene(scene, camera, { width: WIDTH, height: HEIGHT });
  writeFileSync(`preview/fig-visor-${name}.png`, encodePng(WIDTH, HEIGHT, pixels));
  console.log(`preview/fig-visor-${name}.png`);
}
