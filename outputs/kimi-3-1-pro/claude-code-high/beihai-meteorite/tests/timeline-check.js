import * as THREE from "three";
import { CinematicPlayer, validateVoiceCues } from "@agentbench/cinematic-player";

function canvasStub() {
  const context = {
    fillStyle: "", strokeStyle: "", lineWidth: 1, textAlign: "", textBaseline: "", font: "", imageSmoothingEnabled: false,
    fillRect() {}, clearRect() {}, strokeRect() {}, fillText() {},
    getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4) }; },
    putImageData() {},
  };
  return { width: 0, height: 0, getContext: () => context };
}
globalThis.document = { createElement: (tag) => { if (tag !== "canvas") throw new Error(`Unexpected element ${tag}`); return canvasStub(); } };

const { createWorlds } = await import("../src/worlds.js");
const { createFilm } = await import("../src/film.js");
const { voiceCues, soundCues, shotTimes } = await import("../src/cues.js");
const { registerAudio } = await import("../src/audio.js");
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const uiElement = () => ({ style: {}, textContent: "", querySelector: () => ({ textContent: "" }) });
const ui = Object.fromEntries(["title", "location", "scope", "hud", "hudTime", "flight", "credits", "fade"].map(key => [key, uiElement()]));
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(42, 1, .025, 420);
const worlds = createWorlds(scene); const film = createFilm({ scene, camera, worlds, ui });
validateVoiceCues(voiceCues, 336);
assert(voiceCues.every(cue => Object.keys(cue).sort().join(",") === "delivery,end,id,kind,speaker,start,text"), "Voice cue fields must be exactly the required seven");
assert(shotTimes.length === 30 && soundCues.filter(cue => cue.sound === "suitGun").length === 30, "Exactly thirty space shots");
const factories = new Set(); registerAudio({ define(name) { factories.add(name); return this; } });
for (const cue of soundCues) assert(factories.has(cue.sound), `Missing audio factory: ${cue.sound}`);
const player = new CinematicPlayer({ duration: 336, context: {}, shots: film.shots, cues: [...voiceCues, ...soundCues] });
const times = [0, 3, 13.99, 14, 28, 47, 64, 75.9, 76, 86, 104, 118, 128, 148, 156.2, 164, 178, 198, 208, 216, 232, 246, 250, ...shotTimes, 266, 270, 274.8, 276, 284, 292, 306, 312, 326, 335.9, 336];
for (const time of times) {
  player.seek(time); film.updateUI(time);
  const active = player.getShots().filter(shot => time >= shot.start && (time < shot.end || time === 336 && shot.end === 336));
  assert(active.length === 1, `Expected one active shot at ${time}, got ${active.map(s => s.id)}`);
  assert(worlds.roots.filter(root => root.visible).length === 1, `Expected one visible world at ${time}`);
  for (const value of [...camera.position.toArray(), camera.fov]) assert(Number.isFinite(value), `Invalid camera at ${time}`);
}
// Exercise backward and discontinuous seeks, not only chronological playback.
for (const time of [330, 220, 40, 280, 110, 255, 0, 160, 202, 75, 300, 130]) {
  player.seek(time); film.updateUI(time);
  assert(worlds.roots.filter(root => root.visible).length === 1, `World state failed after seek to ${time}`);
}
player.seek(40); assert(worlds.home.zhang.root.visible, "Zhang must be restored when seeking from epilogue to tea");
player.seek(202); assert(worlds.space.zhang.root.visible, "Zhang must be restored on a direct seek to orbit");
player.seek(270); assert(worlds.space.bullets.visible, "Bullet flight must survive direct seek");
player.seek(156.25); assert(worlds.basement.holes.every(hole => hole.visible), "Test shot holes must appear after impact");
player.seek(124); assert(!worlds.workshop.cutter.visible, "CNC cutter must be physically removed");
camera.aspect = 16 / 9; camera.updateProjectionMatrix();
function framed(time, object, label) {
  player.seek(time); scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
  const p = object.getWorldPosition(new THREE.Vector3()).project(camera);
  assert(Number.isFinite(p.x) && Math.abs(p.x) < 1.05 && Math.abs(p.y) < 1.05 && p.z > -1 && p.z < 1, `${label} outside camera at ${time}: ${p.toArray()}`);
}
framed(50, worlds.home.benchMeteors[1], "Chosen meteor");
framed(110, worlds.workshop.pieces[0], "Machined cylinder");
framed(160, worlds.basement.target, "Ballistic target");
framed(180, worlds.space.zhang.parts.head, "Orbital Zhang");
framed(228, worlds.space.attendees[3].figure.parts.head, "Central target");
framed(270, worlds.space.bulletMeshes[29], "Bullet camera subject");
framed(280, worlds.space.attendees[3].figure.parts.head, "Impact target");
framed(320, worlds.home.radio, "Epilogue radio");
let frameCallback;
const transport = new CinematicPlayer({ duration: 336, context: {}, shots: film.shots, requestFrame(callback) { frameCallback = callback; return 1; }, cancelFrame() { frameCallback = undefined; } });
transport.play(); frameCallback(0); frameCallback(32); frameCallback(64);
assert(transport.currentTime > .05 && transport.isPlaying, "Play must advance absolute time");
transport.pause(); const pausedAt = transport.currentTime; assert(transport.state === "paused" && pausedAt > 0, "Pause must retain time");
transport.seek(240); assert(transport.currentTime === 240 && worlds.space.pistol.visible, "Seek while paused must rebuild the gun preparation shot");
transport.seek(335.9); transport.play(); frameCallback(0); frameCallback(200);
assert(transport.currentTime === 336 && transport.state === "ended", "Film must end at exactly 336 seconds");
console.log(`Timeline OK: ${film.shots.length} shots, ${voiceCues.length} voice cues, ${soundCues.length} sound cues, ${factories.size} synthesizers.`);
