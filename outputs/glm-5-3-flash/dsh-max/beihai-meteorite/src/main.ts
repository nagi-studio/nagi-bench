import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  WebAudioCueBus,
  mountCinematicControls,
  validateVoiceCues,
  type ThreeRendererLike,
} from "@agentbench/cinematic-player";
import { createCast } from "./core/cast";
import { defineSounds, soundCues } from "./core/sound";
import { voiceCues } from "./core/voice";
import { DURATION, buildShots, fadeOpacity, scopeOpacity, type FilmContext } from "./core/timeline";
import { makeAlley, makeBase, makeRoom, makeShop } from "./world/ground";
import { makeSpace } from "./world/space";

/* ------------------------------------------------------------------ */
/* 《陨石子弹》—— 程序化三维短片                                        */
/* 改编自《三体Ⅱ·黑暗森林》增援未来段落。全片 328 秒。                  */
/* ------------------------------------------------------------------ */

function main(): void {
  const container = document.querySelector<HTMLDivElement>("#stage")!;
  const fast = new URLSearchParams(location.search).has("fast"); // 无头截图/低性能设备用

  const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !fast;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 250000);
  scene.add(camera);

  // ---- 演员与环境 ----
  const cast = createCast();
  const alley = makeAlley(cast);
  const room = makeRoom(cast);
  const shop = makeShop(cast);
  const base = makeBase(cast);
  const space = makeSpace(cast);
  scene.add(alley.group, room.group, shop.group, base.group, space.group);

  const context: FilmContext = {
    scene,
    camera,
    renderer,
    env: { alley, room, shop, base, space },
  };

  // ---- 时间轴 ----
  const shots = buildShots(context);
  validateVoiceCues(voiceCues, DURATION);
  const player = new CinematicPlayer<FilmContext>({
    duration: DURATION,
    context,
    shots,
    cues: [...voiceCues, ...soundCues],
  });

  // ---- 舞台 ----
  const stage = new ThreeStage({
    player,
    renderer: renderer as unknown as ThreeRendererLike,
    scene,
    camera: () => camera,
    container,
    maxPixelRatio: fast ? 1 : 1.75,
  });

  // ---- 声音 ----
  const audio = new WebAudioCueBus(player);
  defineSounds(audio as WebAudioCueBus<unknown>);
  audio.setMasterGain(0.8);
  audio.setGroupGain("amb", 0.9);
  audio.setGroupGain("sfx", 1.0);
  audio.setGroupGain("music", 0.8);

  // ---- 控制条与字幕 ----
  // 无声环境（自动播放被拒/无音频设备）下 unlock 可能挂起：
  // 给控制条一个带超时的 unlock 包装，保证画面永远能开始播放。
  const unlockSafe = async (): Promise<AudioContext | undefined> => {
    try {
      return await Promise.race([
        audio.unlock(),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 350)),
      ]);
    } catch {
      return undefined;
    }
  };
  const controls = mountCinematicControls({
    player,
    audio: { unlock: unlockSafe, setMasterGain: (v: number) => void audio.setMasterGain(v) } as never,
  });
  document.querySelector("#loading")?.remove();

  // ---- 电影化叠加层 ----
  const ui = document.createElement("div");
  ui.innerHTML = `
    <style>
      .film-layer{position:fixed;inset:0;pointer-events:none;z-index:10}
      .film-bar{position:fixed;left:0;right:0;height:clamp(44px,6.2vh,86px);background:#000;z-index:12;pointer-events:none}
      .film-bar.top{top:0}.film-bar.bottom{bottom:0}
      .film-vignette{background:radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.42) 100%)}
      .film-fade{background:#000;z-index:9}
      .film-grain{z-index:11;opacity:.07;mix-blend-mode:overlay}
      .film-title{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:13;pointer-events:none;color:#e8e2d4;text-align:center}
      .film-title .t-main{font-family:"Songti SC","STSong","SimSun",serif;font-size:clamp(34px,5.4vw,74px);letter-spacing:.42em;text-indent:.42em;text-shadow:0 2px 18px rgba(0,0,0,.85)}
      .film-title .t-sub{margin-top:1.1em;font-size:clamp(11px,1.2vw,15px);letter-spacing:.5em;text-indent:.5em;color:#b9b0a0}
      .film-title .t-en{margin-top:.5em;font-size:clamp(10px,1vw,13px);letter-spacing:.34em;color:#8b8478}
      .film-end .t-main{font-size:clamp(26px,3.6vw,50px)}
      .film-scope{position:fixed;inset:0;z-index:11;pointer-events:none;opacity:0}
      .film-scope .mask{position:absolute;inset:0;background:radial-gradient(circle at center, rgba(0,0,0,0) 31.5%, rgba(0,0,0,.92) 33.5%, rgba(0,0,0,.98) 100%)}
      .film-scope .cross-h{position:absolute;top:50%;left:8%;right:8%;height:1px;background:rgba(190,230,210,.5)}
      .film-scope .cross-v{position:absolute;left:50%;top:8%;bottom:8%;width:1px;background:rgba(190,230,210,.5)}
      .film-scope .ring{position:absolute;left:50%;top:50%;width:63vh;height:63vh;transform:translate(-50%,-50%);border:1px solid rgba(190,230,210,.28);border-radius:50%}
      .film-scope .dot{position:absolute;left:50%;top:50%;width:5px;height:5px;transform:translate(-50%,-50%);border-radius:50%;background:rgba(220,60,50,.85)}
      .film-scope .read{position:absolute;left:50%;top:calc(50% + 34vh);transform:translateX(-50%);color:rgba(190,230,210,.55);font:11px/1 ui-monospace,monospace;letter-spacing:.2em}
    </style>
    <div class="film-layer film-vignette"></div>
    <div class="film-layer film-grain"></div>
    <div class="film-bar top"></div>
    <div class="film-bar bottom"></div>
    <div class="film-layer film-scope">
      <div class="mask"></div><div class="ring"></div>
      <div class="cross-h"></div><div class="cross-v"></div><div class="dot"></div>
      <div class="read">ZOOM ×24 · 10.0 km</div>
    </div>
    <div class="film-title" id="filmTitle"></div>
    <div class="film-layer film-fade"></div>
  `;
  document.body.appendChild(ui);
  const fadeEl = ui.querySelector<HTMLElement>(".film-fade")!;
  const grainEl = ui.querySelector<HTMLElement>(".film-grain")!;
  const scopeEl = ui.querySelector<HTMLElement>(".film-scope")!;
  const titleEl = ui.querySelector<HTMLElement>("#filmTitle")!;

  // 胶片颗粒（运行时生成，无外部素材）
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 160;
  grainCanvas.height = 160;
  {
    const gctx = grainCanvas.getContext("2d")!;
    const img = gctx.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 90 + Math.random() * 130;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    gctx.putImageData(img, 0, 0);
  }
  const grainURL = grainCanvas.toDataURL();
  grainEl.style.backgroundImage = `url(${grainURL})`;

  interface TitleSpan {
    t0: number;
    t1: number;
    main: string;
    sub?: string;
    en?: string;
    end?: boolean;
  }
  const titles: TitleSpan[] = [
    { t0: 8.6, t1: 13.3, main: "陨石子弹", sub: "增援未来 · 序章", en: "M E T E O R   B U L L E T S" },
    { t0: 319.5, t1: 328, main: "剧 终", sub: "陨石子弹 · 完", en: "改编自刘慈欣《三体Ⅱ·黑暗森林》", end: true },
  ];

  player.addTypedEventListener("frame", ({ detail }) => {
    const t = detail.time;
    fadeEl.style.opacity = String(fadeOpacity(t));
    scopeEl.style.opacity = String(scopeOpacity(t));
    grainEl.style.backgroundPosition = `${Math.floor(t * 24) % 5 * 37}px ${Math.floor(t * 17) % 7 * 23}px`;
    const active = titles.find((s) => t >= s.t0 && t <= s.t1);
    if (active) {
      const span = active.t1 - active.t0;
      const u = (t - active.t0) / span;
      const opacity = Math.min(1, u / 0.16) * Math.min(1, (1 - u) / 0.16);
      titleEl.className = `film-title${active.end ? " film-end" : ""}`;
      titleEl.style.opacity = String(Math.max(0, opacity));
      titleEl.innerHTML = `
        <div class="t-main">${active.main}</div>
        ${active.sub ? `<div class="t-sub">${active.sub}</div>` : ""}
        ${active.en ? `<div class="t-en">${active.en}</div>` : ""}`;
    } else {
      titleEl.style.opacity = "0";
    }
  });

  // 供外部驱动/调试使用
  (window as unknown as Record<string, unknown>).__abPlayer = player;
  (window as unknown as Record<string, unknown>).__abThree = THREE;

  // 音量：把主增益接到音量滑条
  const detachState = player.addTypedEventListener("statechange", ({ detail }) => {
    if (detail.state === "ended") {
      // 结束后停在末帧
    }
  });
  void detachState;
  void controls;
  void stage;
}

main();
