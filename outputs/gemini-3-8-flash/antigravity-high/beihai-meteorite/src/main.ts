import * as THREE from "three";
import {
  CinematicPlayer,
  ThreeStage,
  mountCinematicControls,
} from "@agentbench/cinematic-player";

import { FILM_DURATION, voiceCues, soundCues } from "./manifest";
import { setupAudioBus } from "./audio";
import { assembleCharacters, type CharacterSet } from "./characters";
import {
  createPistolWithScope,
  createScopeProp,
  createMeteoriteProp,
  createMeteoriteCylinderProp,
  createCaselessBulletProp,
  createBeefTargetBundle,
  createTeacupProp,
  createSpaceCameraProp,
} from "./props";
import {
  createCourtyardScene,
  createWorkshopScene,
  createBasementScene,
  createOrbitScene,
} from "./environments";
import {
  createGasPlumeEffect,
  createBloodCrystalEffect,
  createMuzzleFlashEffect,
  type ParticleEmitter,
} from "./effects";
import { createShots } from "./shots";

export interface CinematicContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  characters: CharacterSet;
  props: {
    pistol: THREE.Group;
    scope: THREE.Group;
    meteorites: THREE.Group[];
    cylinders: THREE.Group[];
    caselessAmmo: THREE.Group[];
    beefTarget: THREE.Group;
    teacups: THREE.Group[];
    spaceCamera: THREE.Group;
  };
  environments: {
    courtyard: THREE.Group;
    workshop: THREE.Group;
    basement: THREE.Group;
    orbit: THREE.Group;
  };
  effects: {
    gasPlume: ParticleEmitter;
    bloodCrystals: ParticleEmitter;
    muzzleFlash: ReturnType<typeof createMuzzleFlashEffect>;
  };
}

function initCinematic(): void {
  // 1. Scene & Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020408);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.set(0, 5, 20);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // 2. Build Characters
  const characters = assembleCharacters();
  // Add all figure roots to scene
  scene.add(characters.beihaiUniform.root);
  scene.add(characters.beihaiSpacesuit.root);
  scene.add(characters.collector.root);
  characters.delegates.forEach((d) => scene.add(d.root));
  scene.add(characters.photographer.root);

  // 3. Build Props
  const pistol = createPistolWithScope();
  const scope = createScopeProp();
  const meteorites = [
    createMeteoriteProp(1.1),
    createMeteoriteProp(0.9),
    createMeteoriteProp(1.3),
  ];
  const cylinders = Array.from({ length: 12 }, () => createMeteoriteCylinderProp());
  const caselessAmmo = Array.from({ length: 6 }, () => createCaselessBulletProp());
  const beefTarget = createBeefTargetBundle();
  const teacups = [createTeacupProp(), createTeacupProp()];
  const spaceCamera = createSpaceCameraProp();

  // 4. Build Environments
  const courtyard = createCourtyardScene();
  const workshop = createWorkshopScene();
  const basement = createBasementScene();
  const orbit = createOrbitScene();

  scene.add(courtyard);
  scene.add(workshop);
  scene.add(basement);
  scene.add(orbit);

  // 5. Build VFX
  const gasPlume = createGasPlumeEffect(0xf8fafc, 80);
  const bloodCrystals = createBloodCrystalEffect(60);
  const muzzleFlash = createMuzzleFlashEffect();

  scene.add(gasPlume.group);
  scene.add(bloodCrystals.group);
  scene.add(muzzleFlash.group);

  // 6. Context Assembly
  const context: CinematicContext = {
    scene,
    camera,
    characters,
    props: {
      pistol,
      scope,
      meteorites,
      cylinders,
      caselessAmmo,
      beefTarget,
      teacups,
      spaceCamera,
    },
    environments: {
      courtyard,
      workshop,
      basement,
      orbit,
    },
    effects: {
      gasPlume,
      bloodCrystals,
      muzzleFlash,
    },
  };

  // 7. Shots & Master Player
  const shots = createShots();

  const player = new CinematicPlayer<CinematicContext>({
    duration: FILM_DURATION,
    context,
    shots,
    cues: [...voiceCues, ...soundCues],
  });

  // 8. Mount ThreeStage
  const stage = new ThreeStage({
    player,
    renderer,
    scene,
    camera: () => context.camera,
    container: document.querySelector("#stage")!,
    maxPixelRatio: Math.min(window.devicePixelRatio, 2),
  });

  // 9. Setup Audio Bus with CC0 samples and procedural synthesis
  const audio = setupAudioBus(player);

  // 10. Mount Cinematic Controls & Subtitles
  const controls = mountCinematicControls({
    player,
    audio,
    container: document.body,
    showFullscreen: true,
  });

  // 11. Add Cinematic Overlay (HUD Scope & Widescreen Scope Reticle)
  const overlay = document.createElement("div");
  overlay.className = "ab-cinematic-hud";
  overlay.innerHTML = `
    <style>
      .ab-cinematic-hud {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 10;
        overflow: hidden;
      }
      .ab-scope-crosshair {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 320px;
        height: 320px;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(56, 189, 248, 0.4);
        border-radius: 50%;
        display: none;
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);
      }
      .ab-scope-crosshair::before, .ab-scope-crosshair::after {
        content: '';
        position: absolute;
        background: rgba(56, 189, 248, 0.6);
      }
      .ab-scope-crosshair::before {
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
      }
      .ab-scope-crosshair::after {
        left: 50%;
        top: 0;
        bottom: 0;
        width: 1px;
      }
      .ab-title-card {
        position: absolute;
        top: 18%;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: #f8fafc;
        font-family: ui-sans-serif, system-ui, sans-serif;
        text-shadow: 0 4px 16px rgba(0, 0, 0, 0.9);
        opacity: 0;
        transition: opacity 1.2s ease;
        pointer-events: none;
      }
      .ab-title-main {
        font-size: clamp(26px, 3.8vw, 54px);
        font-weight: 800;
        letter-spacing: 0.18em;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      .ab-title-sub {
        font-size: clamp(13px, 1.4vw, 18px);
        letter-spacing: 0.28em;
        color: #94a3b8;
      }
    </style>
    <div class="ab-scope-crosshair"></div>
    <div class="ab-title-card">
      <div class="ab-title-main">陨 石 子 弹</div>
      <div class="ab-title-sub">METEORITE BULLETS · 三体程序化3D电影</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const scopeElem = overlay.querySelector<HTMLElement>(".ab-scope-crosshair")!;
  const titleElem = overlay.querySelector<HTMLElement>(".ab-title-card")!;

  // Dynamic HUD updates synchronized with player timeline
  player.addTypedEventListener("frame", ({ detail }) => {
    const t = detail.time;

    // Title card visibility during opening prologue
    if (t >= 1.5 && t <= 12.0) {
      titleElem.style.opacity = "1";
    } else {
      titleElem.style.opacity = "0";
    }

    // Sniper scope crosshairs during Shot 8 (t = 176..200)
    if (t >= 176 && t < 200) {
      scopeElem.style.display = "block";
    } else {
      scopeElem.style.display = "none";
    }
  });

  // Initial refresh
  player.refresh();

  console.log("Cinematic initialized successfully. Total Duration:", FILM_DURATION);
}

window.addEventListener("DOMContentLoaded", () => {
  initCinematic();
});
