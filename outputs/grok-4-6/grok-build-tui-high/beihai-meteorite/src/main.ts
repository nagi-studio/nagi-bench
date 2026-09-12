import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
} from "@agentbench/cinematic-player";
import { DURATION } from "./constants";
import { voiceCues } from "./cues/voice";
import { registerSounds, soundCues } from "./cues/sound";
import { overlayState, createShots } from "./shots";
import { createWorld } from "./world";
import { perform } from "./performance";

const stageEl = document.querySelector<HTMLElement>("#stage")!;
const titleEl = document.querySelector<HTMLElement>("#title-card")!;
const endEl = document.querySelector<HTMLElement>("#end-card")!;
const fadeEl = document.querySelector<HTMLElement>("#fade-black")!;
const scopeEl = document.querySelector<HTMLElement>("#scope")!;

const world = createWorld(stageEl);
validateVoiceCues(voiceCues, DURATION);

const player = new CinematicPlayer({
  duration: DURATION,
  context: world,
  shots: createShots(),
  cues: [...voiceCues, ...soundCues],
});

const stage = new ThreeStage({
  player,
  renderer: world.renderer as unknown as ConstructorParameters<typeof ThreeStage>[0]["renderer"],
  scene: world.scene,
  camera: () => world.camera,
  container: stageEl,
  maxPixelRatio: 2,
});

const audio = new WebAudioCueBus(player);
registerSounds(audio);
audio.setMasterGain(0.8);
audio.setGroupGain("amb", 0.9);
audio.setGroupGain("gun", 1.15);
audio.setGroupGain("suit", 1.0);
audio.setGroupGain("space", 0.85);
audio.setGroupGain("radio", 0.9);

const controls = mountCinematicControls({
  player,
  audio,
  container: stageEl,
});

function applyOverlays(time: number): void {
  const o = overlayState(time);
  titleEl.style.opacity = String(o.title);
  endEl.style.opacity = String(o.end);
  fadeEl.style.opacity = String(o.fade);
  scopeEl.style.opacity = o.scope ? "1" : "0";
}

player.addTypedEventListener("frame", ({ detail }) => {
  applyOverlays(detail.time);
});

perform(world, 0);
applyOverlays(0);
player.refresh();

void stage;
void controls;
