import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  fadeEnvelope,
} from "@agentbench/cinematic-player";
import "./style.css";
import { buildWorld } from "./world";
import { buildShots } from "./shots";
import { voiceCues, soundCues, DURATION } from "./cues";
import { defineSounds } from "./audio";
import { createPost } from "./post";
import type { Ctx } from "./context";

export { voiceCues };

validateVoiceCues(voiceCues, DURATION);

const container = document.querySelector<HTMLElement>("#stage")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.005, 400000);

const W = buildWorld(scene, camera, renderer);
const { shots } = buildShots(W);
const ctx: Ctx = W.ctx;

const player = new CinematicPlayer<Ctx>({
  duration: DURATION,
  context: ctx,
  shots,
  cues: [...voiceCues, ...soundCues],
});

const post = createPost(renderer, scene, () => ctx.camera);
// ThreeStage owns sizing and the per-frame render call; the wrapper routes it through post.
const stageRenderer = {
  domElement: renderer.domElement,
  setSize(w: number, h: number, style?: boolean) {
    renderer.setSize(w, h, style);
    post.setSize(w, h);
  },
  setPixelRatio(r: number) {
    renderer.setPixelRatio(r);
    post.setPixelRatio(r);
  },
  render() {
    post.render(ctx.fx);
  },
  dispose() {
    renderer.dispose();
  },
};

const stage = new ThreeStage<Ctx>({
  player,
  renderer: stageRenderer,
  scene,
  camera: () => ctx.camera,
  container,
  maxPixelRatio: 1.5,
});

const audio = new WebAudioCueBus<Ctx>(player);
defineSounds(audio as unknown as WebAudioCueBus<unknown>);
const controls = mountCinematicControls({ player, audio, container: document.body });

/* ---------------- title & location cards (not speech) ---------------- */
interface Card { start: number; end: number; html: string; cls: string }
const cards: Card[] = [
  { start: 6.2, end: 11.5, cls: "loc", html: "地球同步轨道<br><span>距黄河空间站 五公里</span>" },
  { start: 38.2, end: 43.2, cls: "title", html: "陨石" },
  { start: 43.0, end: 45.2, cls: "loc center", html: "四个月前 · 北京" },
  { start: 163.6, end: 167.8, cls: "loc", html: "太空军某研究所<br><span>模型车间 · 下班后</span>" },
  { start: 185.6, end: 189.4, cls: "loc", html: "某处地下室" },
  { start: 226.8, end: 231.0, cls: "loc", html: "地球同步轨道<br><span>太空军一号基地</span>" },
  { start: 353.4, end: 358, cls: "title end", html: "陨石<small>改编自刘慈欣《三体Ⅱ·黑暗森林》片段<br>全部画面与声音均为运行时程序化生成</small>" },
];
const cardRoot = document.querySelector<HTMLElement>("#cards")!;
const cardEls = cards.map((c) => {
  const el = document.createElement("div");
  el.className = `card ${c.cls}`;
  el.innerHTML = c.html;
  cardRoot.appendChild(el);
  return el;
});
const splash = document.querySelector<HTMLElement>("#splash")!;

player.addTypedEventListener("frame", ({ detail }) => {
  const t = detail.time;
  cards.forEach((c, i) => {
    const o = fadeEnvelope(t, c.start, c.end, 0.8, 0.8);
    cardEls[i]!.style.opacity = o.toFixed(3);
  });
});
player.addTypedEventListener("statechange", ({ detail }) => {
  if (detail.state === "playing") splash.classList.add("hidden");
});
player.refresh();

// debug/inspection handle (seek, state) without debug-only scene entry points
(window as unknown as { __film: unknown }).__film = { player, stage, audio, controls, W };
