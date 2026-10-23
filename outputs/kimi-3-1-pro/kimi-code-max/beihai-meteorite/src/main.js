import "./style.css";
import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { DURATION, soundCues, voiceCues } from "./data.js";
import { buildWorld, sceneGroups, updateWorld } from "./world.js";
import { registerAudio } from "./audio.js";

const container = document.querySelector("#stage");
const film = document.querySelector("#film");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02050a);
const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 1200);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x02050a, 1);

const world = buildWorld(scene);
const groups = sceneGroups(world);
for (const group of Object.values(groups)) group.visible = false;

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => v * v * (3 - 2 * v);
const vec = (v) => new THREE.Vector3(...v);
const shots = [];

function shot(id, start, end, sceneKey, from, to, look, fov = 40, options = {}) {
  shots.push({
    id,
    start,
    end,
    sceneKey,
    from: vec(from),
    to: vec(to),
    look: vec(look),
    lookTo: options.lookTo ? vec(options.lookTo) : null,
    fovFrom: Array.isArray(fov) ? fov[0] : fov,
    fovTo: Array.isArray(fov) ? fov[1] : fov,
    ...options,
  });
}

shot("cold-open", 0, 14, "space", [3.8, 2.4, -5.6], [2.8, 1.9, -4.1], [0, 1.15, 0], [37, 32]);
shot("small-world", 14, 26, "home", [5.1, 3.1, 6.8], [4.4, 2.8, 5.8], [0, 1.5, -1], 43);
shot("two-soldiers", 26, 36, "home", [-3.8, 2.3, 4.2], [-3.2, 2.1, 3.5], [-0.3, 1.45, -1.1], 39);
shot("tea-universe", 36, 50, "home", [2.8, 2.4, 3.4], [2.3, 2.1, 2.6], [-0.3, 1.25, -0.6], 37);
shot("three-irons", 50, 61, "home", [-0.3, 3.8, 2.2], [-0.6, 3.2, 1.5], [-0.2, 1.15, -0.4], 39);
shot("no-bargain", 61, 74, "home", [0, 2.1, -1.5], [0.25, 1.95, -1.15], [1.35, 1.4, 1.1], [37, 33]);
shot("the-coast", 74, 84, "space", [85, 45, 35], [65, 32, 15], [10, 0, -110], 43);
shot("empty-workshop", 84, 95, "workshop", [5.8, 3.6, 6.5], [4.8, 3.1, 5.4], [0, 1.5, -0.8], 42);
shot("cutting", 95, 105, "workshop", [2.8, 2.5, 2.4], [2.1, 2.15, 1.8], [0, 1.7, -0.7], [34, 30]);
shot("thirty-six", 105, 114, "workshop", [6.2, 6.2, 5], [5.4, 5.4, 4.3], [3.6, 1.1, 2.5], 36);
shot("clean-room", 114, 122, "workshop", [-3.8, 2.7, 3.6], [-3.1, 2.4, 3], [0.4, 1.4, -0.6], 38);
shot("new-warheads", 122, 133, "basement", [2.7, 3.4, 3.1], [2.1, 3, 2.6], [0.3, 1, 0.4], 38);
shot("four-rounds", 133, 140, "basement", [3.4, 2.1, 3.6], [2.9, 1.9, 3.1], [1, 1.3, 1.5], 33);
shot("test-fire", 140, 146, "basement", [-0.8, 2.1, 3.8], [-0.65, 2, 3.55], [-1.3, 1.35, -1.4], 46, { shake: true });
shot("fragments", 146, 158, "basement", [0.8, 2.2, 2.2], [0.55, 1.85, 1.75], [0.2, 1.1, 0.4], [32, 28]);
shot("locator", 158, 169, "base", [2.8, 2.3, 3.7], [2.2, 2, 3.1], [-0.6, 1.1, -0.6], 40);
shot("airlock-departure", 169, 179, "base", [-1.7, 2.2, 2.8], [-1.2, 1.95, 2.2], [0.8, 1.7, -2.9], 43);
shot("independent-existence", 179, 194, "space", [25, 10, 24], [18, 7, 18], [-8, 0, -82], 43);
shot("conference-over", 194, 207, "space", [7, 5, -48], [4, 3.5, -53], [0, 2, -80], [34, 30]);
shot("sunset-ring", 207, 212, "space", [-12, 4, 18], [-17, 3, 14], [-60, -15, -190], [38, 34]);
shot("group-photo", 212, 218, "space", [0, 3, 1], [0, 3.4, 0.4], [0, 3.8, -71], [13, 9], { scope: true });
shot("sunset-preparation", 218, 229, "space", [-3.2, 2.1, -3.8], [-2.3, 1.7, -2.6], [0, 1.15, 0], [38, 32]);
shot("volley-one", 229, 231.5, "space", [0.1, 1.6, 0.8], [0.1, 1.62, 0.75], [-2.05, 5.2, -70], 7.5, { scope: true });
shot("volley-two", 231.5, 234, "space", [2.4, 1.6, -1.8], [2.1, 1.5, -1.5], [0, 1.2, -0.2], 32);
shot("volley-three", 234, 236.5, "space", [0.1, 1.6, 0.8], [0.1, 1.62, 0.75], [2.05, 5.2, -70], 7.2, { scope: true });
shot("ten-seconds", 236.5, 240.4, "space", [1, 1, 1], [1, 1, 1], [0, 0, -70], 40, { ballistic: true });
shot("impact-one", 240.4, 243, "space", [4.5, 6, -57], [4, 5.8, -59], [-2, 5, -70], 22);
shot("impact-two", 243, 245.4, "space", [-5, 5.5, -58], [-4.4, 5.3, -60], [0, 5, -70], 20);
shot("meteor-rain", 245.4, 252, "space", [9, 7, -52], [7, 6.2, -55], [0, 4, -74], 29);
shot("return-to-airlock", 252, 263, "space", [-12, 8, -48], [-16, 9, -43], [0, 3, -82], 35);
shot("cold-and-calm", 263, 277, "space", [4, 2, 5], [-1, 3, -9], [0, 1, 0], [39, 34], { lookTo: [0, 1, -18] });
shot("no-record", 277, 289, "base", [-2.8, 2.1, 2.7], [-2.2, 1.9, 2.2], [-0.7, 1.1, -0.8], 38);
shot("future-command", 289, 295, "chamber", [6, 3.8, 8], [3.8, 3, 6], [0, 1.8, -0.5], 39);
shot("hibernation", 295, 300, "chamber", [1.4, 2.2, 2.8], [0.7, 1.9, 2], [0, 1.65, -0.5], [34, 30]);
shot("end", 300, DURATION, "space", [-20, 2, 30], [-22, 3, 33], [-49, -20, -183], 36);

let activeScene = "";
function setActiveScene(key) {
  if (activeScene === key) return;
  activeScene = key;
  for (const [name, group] of Object.entries(groups)) group.visible = name === key;
}

const timelineShots = shots.map((item) => ({
  id: item.id,
  start: item.start,
  end: item.end,
  enter: () => setActiveScene(item.sceneKey),
  update: ({ time, localTime }) => {
    updateWorld(world, time);
    const p = smooth(clamp(localTime / (item.end - item.start)));
    camera.position.lerpVectors(item.from, item.to, p);
    const target = item.lookTo ? item.look.clone().lerp(item.lookTo, p) : item.look.clone();
    if (item.ballistic) {
      const bullet = world.space.flightBullets[0];
      camera.position.copy(bullet.position).add(new THREE.Vector3(1.35, 0.5, 2.65));
      target.copy(bullet.position).add(new THREE.Vector3(0, 0.05, -8));
    }
    camera.lookAt(target);
    camera.fov = item.fovFrom + (item.fovTo - item.fovFrom) * p;
    if (item.shake) {
      let impulse = 0;
      for (const at of [140.1, 140.95, 141.8, 142.65]) {
        const age = time - at;
        if (age >= 0 && age < 0.45) impulse += Math.exp(-age * 15) * 0.055;
      }
      camera.position.x += Math.sin(time * 113) * impulse;
      camera.position.y += Math.cos(time * 97) * impulse * 0.6;
      camera.lookAt(target);
    }
    camera.updateProjectionMatrix();
  },
}));

validateVoiceCues(voiceCues, DURATION);
const player = new CinematicPlayer({
  duration: DURATION,
  context: { scene, camera, world },
  shots: timelineShots,
  cues: [...voiceCues, ...soundCues],
});
const audio = new WebAudioCueBus(player);
registerAudio(audio);
const controls = mountCinematicControls({ player, audio, container: film });
const stage = new ThreeStage({ player, renderer, scene, camera, container, maxPixelRatio: 1.6 });

player.addTypedEventListener("statechange", () => {
  audio.setGroupGain("music", 0.72);
  audio.setGroupGain("ambience", 0.72);
  audio.setGroupGain("machinery", 0.78);
  audio.setGroupGain("ballistics", 0.72);
  audio.setGroupGain("suit", 0.82);
  audio.setGroupGain("radio", 0.68);
});

const title = document.querySelector("#title-card");
const chapter = document.querySelector("#chapter-card");
const fade = document.querySelector("#fade");
const scope = document.querySelector("#scope");
const ballistics = document.querySelector("#ballistics");
const endCard = document.querySelector("#end-card");
const soundNote = document.querySelector("#sound-note");
const chapters = [
  { start: 14.5, end: 21, text: "Ⅰ  ·  小世界" },
  { start: 84.5, end: 91, text: "Ⅱ  ·  三十六" },
  { start: 158.5, end: 165, text: "Ⅲ  ·  没有记录" },
  { start: 179.5, end: 186.5, text: "Ⅳ  ·  五公里" },
  { start: 289.3, end: 294, text: "Ⅴ  ·  增援未来" },
];
let chapterText = "";

function windowOpacity(t, start, end, feather = 0.8) {
  return clamp(Math.min((t - start) / feather, (end - t) / feather));
}

player.addTypedEventListener("frame", ({ detail }) => {
  const t = detail.time;
  title.style.opacity = String(windowOpacity(t, -1.5, 10.2, 1.4));
  const currentChapter = chapters.find((item) => t >= item.start && t < item.end);
  const nextText = currentChapter?.text ?? "";
  if (nextText !== chapterText) {
    chapterText = nextText;
    chapter.textContent = nextText;
  }
  chapter.style.opacity = currentChapter ? String(windowOpacity(t, currentChapter.start, currentChapter.end, 0.7)) : "0";
  fade.style.opacity = String(Math.max(0.32 * (1 - smooth(clamp(t / 2.1))), smooth(clamp((t - 299.4) / 1.2)) * 0.45));
  const active = shots.find((item) => t >= item.start && t < item.end);
  scope.style.opacity = active?.scope ? "1" : "0";
  ballistics.style.opacity = String(windowOpacity(t, 236.8, 240.25, 0.45));
  endCard.style.opacity = String(smooth(clamp((t - 300.3) / 1.5)));
  soundNote.style.opacity = String(0.8 * (1 - smooth(clamp((t - 8) / 4))));
  film.dataset.scene = activeScene;
  film.dataset.time = t.toFixed(2);
});

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;
  if (event.code === "Space") {
    event.preventDefault();
    void audio.unlock().then(() => player.isPlaying ? player.pause() : player.play());
  } else if (event.code === "ArrowRight") player.seek(Math.min(DURATION, player.currentTime + 5));
  else if (event.code === "ArrowLeft") player.seek(Math.max(0, player.currentTime - 5));
});

player.refresh();
window.__METEOR_RAIN__ = { player, audio, controls, stage, renderer, voiceCues, soundCues, shots, world };
