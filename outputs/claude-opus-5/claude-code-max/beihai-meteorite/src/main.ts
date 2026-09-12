import * as THREE from "three";

import { createFilm } from "./film";
import "./style.css";

const container = document.querySelector<HTMLElement>("#stage")!;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 1);

const film = createFilm({ container, renderer });

// 空格键播放/暂停，左右键跳转 —— 检片时用得上。
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (film.player.isPlaying) film.player.pause();
    else void film.audio.unlock().then(() => film.player.play());
  }
  if (event.code === "ArrowRight") film.player.seek(Math.min(film.player.duration, film.player.currentTime + 5));
  if (event.code === "ArrowLeft") film.player.seek(Math.max(0, film.player.currentTime - 5));
});

Object.assign(window as unknown as Record<string, unknown>, { film });
