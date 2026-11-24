import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ClocktowerPhysics } from './physics/ClocktowerPhysics';
import { ClocktowerScene } from './scene/ClocktowerScene';
import { FILM_DURATION, FilmDirector } from './director/FilmDirector';
import { ClocktowerAudio } from './audio';
import { SHICHEN_NAMES } from './textures';

async function bootstrap(): Promise<void> {
  const canvas = document.getElementById('scene-canvas') as HTMLCanvasElement;
  const subtitleText = document.getElementById('subtitle-text') as HTMLElement;
  const introTitle = document.getElementById('intro-title') as HTMLElement;
  const stepNumEl = document.getElementById('step-num') as HTMLElement;
  const stepTitleEl = document.getElementById('step-title') as HTMLElement;
  const stepMetricsEl = document.getElementById('step-metrics') as HTMLElement;
  const progressFill = document.getElementById('progress-fill') as HTMLElement;
  const progressTrack = document.getElementById('progress-track') as HTMLElement;
  const timeReadout = document.getElementById('time-readout') as HTMLElement;
  const calloutsLayer = document.getElementById('callouts-layer') as HTMLElement;
  const btnPlay = document.getElementById('btn-play') as HTMLButtonElement;
  const btnReplay = document.getElementById('btn-replay') as HTMLButtonElement;
  const btnAudio = document.getElementById('btn-audio') as HTMLButtonElement;
  const btnCam = document.getElementById('btn-cam') as HTMLButtonElement;
  const chapterBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.chap-btn'));

  // Renderer setup — crisp quality while staying smooth even on software WebGL
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(6.8, 6.2, 11.4);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0.3, 5.1, -0.5);
  controls.minDistance = 2.6;
  controls.maxDistance = 22.0;
  controls.maxPolarAngle = Math.PI * 0.49;

  // Procedural Web Audio API synthesizer
  const audio = new ClocktowerAudio();
  audio.init();
  const unlockAudio = () => {
    audio.init();
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  // Real-time Rapier3D physics engine
  const physics = new ClocktowerPhysics({
    onWaterDrop: (s) => audio.playWaterDrop(s),
    onEscapementTrip: () => audio.playEscapementClack(false),
    onEscapementLock: () => audio.playEscapementClack(true),
    onGearMesh: () => audio.playGearMesh(),
    onWaterSplash: () => audio.playWaterSplash(),
    onBellStrike: (s) => audio.playBronzeBell(s),
    onDrumStrike: (s) => audio.playDrum(s),
  });
  await physics.init();

  // Three.js visual scene strictly bound to Rapier3D bodies
  const clockScene = new ClocktowerScene(physics);
  const director = new FilmDirector();
  director.mountCallouts(calloutsLayer);

  let playing = true;
  let guidedCamera = true;
  let filmTime = 0;
  let physAccumulator = 0;
  const fixedDt = 1 / 120;

  // Allow user drag to seamlessly switch to free orbit camera
  controls.addEventListener('start', () => {
    if (guidedCamera) {
      guidedCamera = false;
      btnCam.textContent = '自由视角';
      btnCam.classList.add('active');
    }
  });

  btnPlay.addEventListener('click', () => {
    playing = !playing;
    btnPlay.textContent = playing ? '❚❚' : '▶';
  });

  const restartFilm = () => {
    physics.reset();
    filmTime = 0;
    physAccumulator = 0;
    playing = true;
    guidedCamera = true;
    btnPlay.textContent = '❚❚';
    btnCam.textContent = '导览镜头';
    btnCam.classList.remove('active');
    audio.resetScore(0);
  };

  btnReplay.addEventListener('click', restartFilm);

  btnAudio.addEventListener('click', () => {
    audio.init();
    const nextMuted = !audio.isMuted();
    audio.setMuted(nextMuted);
    btnAudio.textContent = nextMuted ? '🔇' : '🔊';
  });

  btnCam.addEventListener('click', () => {
    guidedCamera = !guidedCamera;
    btnCam.textContent = guidedCamera ? '导览镜头' : '自由视角';
    btnCam.classList.toggle('active', !guidedCamera);
  });

  // Jump camera & narrative to any chapter while keeping real physics running live
  const seekFilmTime = (targetSec: number) => {
    filmTime = Math.max(0, Math.min(FILM_DURATION, targetSec));
    guidedCamera = true;
    btnCam.textContent = '导览镜头';
    btnCam.classList.remove('active');
    audio.resetScore(filmTime);
  };

  for (const btn of chapterBtns) {
    btn.addEventListener('click', () => {
      const t = Number(btn.dataset.time ?? '0');
      seekFilmTime(t);
    });
  }

  progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekFilmTime(ratio * FILM_DURATION);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Expose lightweight debug telemetry on window for verification scripts
  (window as unknown as Record<string, unknown>).__CLOCKTOWER_DEBUG__ = {
    getState: () => ({
      filmTime,
      simTime: physics.simTime,
      telemetry: physics.getTelemetry(),
    }),
  };

  const camPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  let lastWallTime = performance.now();

  const formatTime = (sec: number): string => {
    const clamped = Math.max(0, Math.min(FILM_DURATION, sec));
    const s = Math.floor(clamped);
    return `00:${String(s).padStart(2, '0')}`;
  };

  function animate(now: number): void {
    requestAnimationFrame(animate);

    // Keep simulation synced 1:1 with wall-clock time even on slower software WebGL
    const rawDt = Math.min(0.3, Math.max(0, (now - lastWallTime) / 1000));
    lastWallTime = now;

    if (playing) {
      filmTime += rawDt;
      physAccumulator += rawDt;

      // Fixed-timestep Rapier3D stepping (120Hz) with generous substep cap so real-time stays 1:1
      let substeps = 0;
      const maxSubsteps = 36;
      while (physAccumulator >= fixedDt && substeps < maxSubsteps) {
        physics.stepFixed();
        physAccumulator -= fixedDt;
        substeps++;
      }
      if (substeps === maxSubsteps) {
        physAccumulator = 0;
      }

      audio.updateMusic(filmTime);
    }

    const cue = director.getCueAt(filmTime);
    audio.setWaterFocus(cue.stageIndex === 1 ? 1.0 : 0.25);

    // Update Three.js visuals strictly from Rapier3D transforms
    clockScene.syncFromPhysics(rawDt, cue.stageIndex);

    // Update guided camera or free OrbitControls
    if (guidedCamera) {
      director.evaluateCamera(filmTime, camPos, camTarget);
      camera.position.copy(camPos);
      controls.target.copy(camTarget);
      camera.lookAt(camTarget);
    } else {
      controls.update();
    }

    // Update UI subtitles, opening title card, telemetry & 3D leader callouts
    introTitle.classList.toggle('hidden', filmTime > 3.4);

    if (subtitleText.textContent !== cue.text) {
      subtitleText.textContent = cue.text;
    }
    stepNumEl.textContent = cue.stepBadge;
    stepTitleEl.textContent = cue.stepTitle;

    const tel = physics.getTelemetry();
    const shichen = SHICHEN_NAMES[tel.shichenIndex];
    stepMetricsEl.textContent = `枢轮步进 ${tel.stepCount} 格 · 报辰：${shichen} · 钟${tel.bellStrikes} 鼓${tel.drumStrikes}`;

    const pct = Math.min(100, (filmTime / FILM_DURATION) * 100);
    progressFill.style.width = `${pct.toFixed(2)}%`;
    timeReadout.textContent = `${formatTime(filmTime)} / 00:${String(Math.round(FILM_DURATION)).padStart(2, '0')}`;

    // Highlight active chapter pill
    const activeChap = Math.min(5, cue.stageIndex);
    for (let i = 0; i < chapterBtns.length; i++) {
      chapterBtns[i].classList.toggle('active', i === activeChap && filmTime <= FILM_DURATION);
    }

    director.updateCallouts(
      filmTime,
      camera,
      window.innerWidth,
      window.innerHeight,
      guidedCamera
    );

    renderer.render(clockScene.scene, camera);
  }

  // Initial sync before first paint so t=0 screenshot is already framed perfectly
  director.evaluateCamera(0, camPos, camTarget);
  camera.position.copy(camPos);
  controls.target.copy(camTarget);
  camera.lookAt(camTarget);
  clockScene.syncFromPhysics(0, 0);
  renderer.render(clockScene.scene, camera);

  lastWallTime = performance.now();
  requestAnimationFrame(animate);
}

bootstrap().catch((err) => {
  console.error('[Clocktower bootstrap error]', err);
});
