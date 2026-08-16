import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type CinematicControlsHandle,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";

import { buildCast } from "./cast";
import { createScopeOverlay, createVisorOverlay } from "./lib/overlay";
import { mountScreen, type Screen } from "./lib/screen";
import { buildCourtyard } from "./sets/courtyard";
import { buildBasement, buildWorkshop } from "./sets/industry";
import { buildSpace } from "./sets/space";
import { buildShots, fadeAt, titleAt, type Ctx } from "./shots";
import { defineProcedural, defineSamples, soundCues } from "./sound";
import { DURATION } from "./timeline";
import { voiceCues } from "./voice";

export interface FilmOptions {
  container: HTMLElement;
  /** 注入渲染器，便于在无 WebGL 的环境里跑时间轴自检。 */
  renderer?: ThreeRendererLike;
  mountControls?: boolean;
  /** 注入画面之上的那一层；自检时用一个空实现。 */
  screen?: Screen;
}

export interface Film {
  player: CinematicPlayer<Ctx>;
  context: Ctx;
  audio: WebAudioCueBus<Ctx>;
  stage?: ThreeStage<Ctx>;
  controls?: CinematicControlsHandle;
  destroy(): void;
}

export function createFilm(options: FilmOptions): Film {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.05, 12_000);
  camera.position.set(0, 1.6, 6);
  scene.add(camera);

  const cast = buildCast();
  const yard = buildCourtyard();
  const shop = buildWorkshop();
  const cellar = buildBasement();
  const space = buildSpace(cast);

  scene.add(yard.exterior, yard.interior, shop.root, cellar.root, space.root);
  scene.add(cast.zhang.root, cast.collector.root);

  const scope = createScopeOverlay();
  const visor = createVisorOverlay();
  camera.add(scope.mesh, visor.mesh);

  const screen = options.screen ?? mountScreen(options.container);

  const context: Ctx = { scene, camera, cast, yard, shop, cellar, space, scope, visor, screen };

  const cues = validateVoiceCues(voiceCues, DURATION);
  assertNoOverlap(cues);

  const player = new CinematicPlayer<Ctx>({
    duration: DURATION,
    context,
    shots: buildShots(),
    cues: [...cues, ...soundCues],
  });

  const audio = new WebAudioCueBus(player);
  defineSamples(audio as unknown as WebAudioCueBus<unknown>);
  defineProcedural(audio as unknown as WebAudioCueBus<unknown>);
  audio.setMasterGain(0.8);

  // 画面之上的一层：黑场、片名、颗粒。全部是绝对时间的纯函数。
  const detachScreen = player.addTypedEventListener("frame", ({ detail }) => {
    const time = detail.time;
    screen.setFade(fadeAt(time));
    const title = titleAt(time);
    screen.setTitle(title.card ?? null, title.amount);
    screen.setGrain(0.055, time);
    const aspect = camera.aspect || 16 / 9;
    scope.update(camera, aspect);
    visor.update(camera, aspect);
  });

  const detachState = player.addTypedEventListener("statechange", ({ detail }) => {
    if (detail.state === "playing") screen.hidePoster();
  });

  let stage: ThreeStage<Ctx> | undefined;
  let controls: CinematicControlsHandle | undefined;

  if (options.renderer) {
    stage = new ThreeStage<Ctx>({
      player,
      renderer: options.renderer,
      scene,
      camera: () => context.camera,
      container: options.container,
      maxPixelRatio: 1.75,
    });
  }
  if (options.mountControls !== false) {
    controls = mountCinematicControls({ player, audio, container: options.container });
  }
  player.refresh();

  return {
    player,
    context,
    audio,
    stage,
    controls,
    destroy() {
      detachScreen();
      detachState();
      controls?.destroy();
      stage?.destroy(true);
      audio.destroy();
      player.destroy();
      screen.destroy();
      scope.dispose();
      visor.dispose();
      cast.dispose();
      yard.dispose();
      shop.dispose();
      cellar.dispose();
      space.dispose();
    },
  };
}

/** 同一时刻只允许一条字幕，否则底部会叠成两行。 */
function assertNoOverlap(cues: ReadonlyArray<{ id: string; start: number; end: number }>): void {
  const sorted = [...cues].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i += 1) {
    const previous = sorted[i - 1]!;
    const current = sorted[i]!;
    if (current.start < previous.end - 1e-6) {
      throw new Error(`语音提示重叠：${previous.id} (${previous.start}-${previous.end}) 与 ${current.id} (${current.start}-${current.end})`);
    }
  }
}
