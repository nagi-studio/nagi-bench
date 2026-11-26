import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { SuSongClockPhysics } from './physics/clockPhysics';
import { createTowerMaterials } from './materials';
import { TowerVisuals } from './scene/buildTowerVisuals';
import {
  ACT_START_TIMES,
  CALLOUT_SPECS,
  FILM_DURATION,
  evaluateCameraPose,
  getActiveSubtitle,
} from './director/choreography';
import { ProceduralSoundEngine } from './audio/soundEngine';

const FIXED_DT = 1 / 120;

interface SimDebugHandle {
  getState: () => {
    filmTime: number;
    simTime: number;
    wheelDeg: number;
    tianZhuDeg: number;
    globeDeg: number;
    tickCount: number;
    shichen: string;
    bellSwingDeg: number;
    events: Record<string, number>;
  };
  seek: (t: number) => void;
}

declare global {
  interface Window {
    __SIM__?: SimDebugHandle;
  }
}

async function bootstrap(): Promise<void> {
  await RAPIER.init();

  const canvas = document.getElementById('viewport') as HTMLCanvasElement;
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
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2.0;
  controls.maxDistance = 20.0;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.enabled = false;

  const materials = createTowerMaterials(renderer);
  let physics = new SuSongClockPhysics();
  const visuals = new TowerVisuals(scene, materials, physics.maxDroplets);
  const sound = new ProceduralSoundEngine();
  sound.init();

  // Unlock Web Audio cleanly on first user interaction if browser initially suspended it
  const unlockOnce = () => {
    sound.unlock();
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
  };
  window.addEventListener('pointerdown', unlockOnce);
  window.addEventListener('keydown', unlockOnce);

  // DOM Elements
  const titleCard = document.getElementById('title-card') as HTMLElement;
  const subtitleBox = document.getElementById('subtitle-box') as HTMLElement;
  const subtitleTag = document.getElementById('subtitle-tag') as HTMLElement;
  const subtitleText = document.getElementById('subtitle-text') as HTMLElement;
  const calloutLayer = document.getElementById('callout-layer') as HTMLElement;
  const timelineFill = document.getElementById('timeline-fill') as HTMLElement;
  const timelineWrap = document.getElementById('timeline-wrap') as HTMLElement;
  const timeReadout = document.getElementById('time-readout') as HTMLElement;
  const telShichen = document.getElementById('tel-shichen') as HTMLElement;
  const telTicks = document.getElementById('tel-ticks') as HTMLElement;
  const btnPlay = document.getElementById('btn-play') as HTMLButtonElement;
  const btnReplay = document.getElementById('btn-replay') as HTMLButtonElement;
  const btnOrbit = document.getElementById('btn-orbit') as HTMLButtonElement;
  const btnAudio = document.getElementById('btn-audio') as HTMLButtonElement;
  const chainButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.chain-step'));

  // Build floating 3D-tracked callout DOM nodes
  const calloutNodes = CALLOUT_SPECS.map((spec) => {
    const el = document.createElement('div');
    el.className = 'callout';
    const accentCls =
      spec.accent === 'water' ? 'accent-water' : spec.accent === 'action' ? 'accent-action' : '';
    el.innerHTML = `
      <div class="callout-chip ${accentCls}">
        <span>${spec.title}</span>
        ${spec.sub ? `<span class="callout-sub">${spec.sub}</span>` : ''}
      </div>
      <div class="callout-stem"></div>
      <div class="callout-dot"></div>
    `;
    calloutLayer.appendChild(el);
    return { spec, el };
  });

  // Playback & Camera State
  let playing = true;
  let freeOrbit = false;
  let filmTime = 0;
  let physicsAccum = 0;
  let lastPerfMs = performance.now();
  const eventCounts: Record<string, number> = {
    droplet: 0,
    latch_lift: 0,
    latch_catch: 0,
    gear_engage: 0,
    bell_strike: 0,
    drum_strike: 0,
  };

  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const projVec = new THREE.Vector3();

  // Initialize camera & visual meshes immediately at t=0
  evaluateCameraPose(0, camPos, camLook);
  camera.position.copy(camPos);
  camera.lookAt(camLook);
  controls.target.copy(camLook);
  visuals.syncFromPhysics(physics, 0, 0);

  function setFreeOrbit(enabled: boolean): void {
    freeOrbit = enabled;
    controls.enabled = enabled;
    btnOrbit.classList.toggle('active', enabled);
    btnOrbit.textContent = enabled ? '返回导演镜头' : '自由视角';
    if (enabled) {
      controls.target.copy(camLook);
      controls.update();
    }
  }

  function formatTime(sec: number): string {
    const clamped = Math.max(0, Math.min(FILM_DURATION, sec));
    const m = Math.floor(clamped / 60);
    const s = Math.floor(clamped % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // UI Event Handlers
  btnPlay.addEventListener('click', () => {
    sound.unlock();
    playing = !playing;
    btnPlay.textContent = playing ? '⏸' : '▶';
    lastPerfMs = performance.now();
  });

  btnReplay.addEventListener('click', () => {
    sound.unlock();
    physics.dispose();
    physics = new SuSongClockPhysics();
    filmTime = 0;
    physicsAccum = 0;
    playing = true;
    btnPlay.textContent = '⏸';
    setFreeOrbit(false);
    sound.resetTimeline(0);
    for (const k of Object.keys(eventCounts)) eventCounts[k] = 0;
    visuals.syncFromPhysics(physics, 0, 0);
  });

  btnOrbit.addEventListener('click', () => {
    sound.unlock();
    setFreeOrbit(!freeOrbit);
  });

  btnAudio.addEventListener('click', () => {
    sound.unlock();
    sound.setMuted(!sound.muted);
    btnAudio.textContent = sound.muted ? '🔇' : '🔊';
  });

  timelineWrap.addEventListener('click', (e) => {
    sound.unlock();
    const rect = timelineWrap.querySelector('.timeline-track')!.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    filmTime = frac * FILM_DURATION;
    setFreeOrbit(false);
    sound.resetTimeline(filmTime);
  });

  for (const btn of chainButtons) {
    btn.addEventListener('click', () => {
      sound.unlock();
      const act = Number(btn.dataset.act ?? 1);
      filmTime = ACT_START_TIMES[act] ?? 0;
      setFreeOrbit(false);
      sound.resetTimeline(filmTime);
    });
  }

  // Dragging canvas enters free-orbit inspection seamlessly
  let dragStartX = 0;
  let dragStartY = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons === 1 && !freeOrbit) {
      if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 10) {
        setFreeOrbit(true);
      }
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Expose live Rapier3D physics telemetry for automated checks
  window.__SIM__ = {
    getState: () => ({
      filmTime,
      simTime: physics.simTime,
      wheelDeg: (physics.wheelAngleAccum * 180) / Math.PI,
      tianZhuDeg: (physics.tianZhuAngleAccum * 180) / Math.PI,
      globeDeg: (physics.globeAngleAccum * 180) / Math.PI,
      tickCount: physics.tickCount,
      shichen: physics.getCurrentShichen(),
      bellSwingDeg: (Math.abs(physics.getBodyAngleZ(physics.bellBody)) * 180) / Math.PI,
      events: { ...eventCounts },
    }),
    seek: (t: number) => {
      filmTime = Math.max(0, t);
      setFreeOrbit(false);
      sound.resetTimeline(filmTime);
    },
  };

  function updateHUD(t: number): void {
    // Opening Title Card (0.0s .. 2.7s)
    titleCard.classList.toggle('hidden', t > 2.7);

    // Subtitle & Active Highlight Target
    const cue = getActiveSubtitle(t);
    if (cue && !freeOrbit) {
      subtitleBox.classList.remove('empty');
      subtitleTag.textContent = cue.tag;
      subtitleText.textContent = cue.text;
      visuals.setHighlight(cue.highlight, t);
    } else if (t > FILM_DURATION && !freeOrbit) {
      subtitleBox.classList.remove('empty');
      subtitleTag.textContent = '水运仪象台 · 实时物理运转中';
      subtitleText.textContent = '点击上方步骤或拖动画面，可近距离自由观察每一处机械联动。';
      visuals.setHighlight('none', t);
    } else {
      subtitleBox.classList.add('empty');
      visuals.setHighlight('none', t);
    }

    // Top Causal Chain Stepper Highlight
    const activeAct = cue ? cue.act : t >= FILM_DURATION ? 5 : 0;
    for (const btn of chainButtons) {
      const actNum = Number(btn.dataset.act ?? 0);
      btn.classList.toggle('active', actNum === activeAct);
      btn.classList.toggle('done', activeAct > actNum);
    }

    // Timeline Scrubber & Live Physics Telemetry
    const pct = Math.min(100, (t / FILM_DURATION) * 100);
    timelineFill.style.width = `${pct.toFixed(2)}%`;
    timeReadout.textContent = `${formatTime(t)} / ${formatTime(FILM_DURATION)}`;
    telShichen.textContent = physics.getCurrentShichen();
    telTicks.textContent = String(physics.tickCount);

    // 3D-Tracked Callout Projection
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (const { spec, el } of calloutNodes) {
      const show = !freeOrbit && t >= spec.start && t <= spec.end;
      if (!show) {
        el.classList.remove('visible');
        continue;
      }
      const anchor = visuals.anchors[spec.anchorKey];
      if (!anchor) continue;
      anchor.getWorldPosition(projVec);
      projVec.project(camera);

      const inFront = projVec.z >= -1 && projVec.z <= 1;
      const sx = (projVec.x * 0.5 + 0.5) * w;
      const sy = (-projVec.y * 0.5 + 0.5) * h - (spec.offsetY ?? 0);

      if (inFront && sx > 60 && sx < w - 60 && sy > 76 && sy < h - 135) {
        el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -100%)`;
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    }
  }

  function animate(nowMs: number): void {
    requestAnimationFrame(animate);

    const rawDt = Math.max(0, (nowMs - lastPerfMs) / 1000);
    lastPerfMs = nowMs;
    // Allow up to 0.35s catch-up per rendered frame so software WebGL stays synced with real-time wall clock
    const frameDt = Math.min(rawDt, 0.35);

    if (playing) {
      filmTime += frameDt;
      physicsAccum += frameDt;

      // Fixed-timestep Rapier3D physics stepping (120 Hz)
      let substeps = 0;
      const maxSubsteps = 44;
      while (physicsAccum >= FIXED_DT && substeps < maxSubsteps) {
        physics.step(FIXED_DT);
        physicsAccum -= FIXED_DT;
        substeps++;
      }

      // Dispatch all real physics events to procedural Web Audio & soundwave ripples
      for (const ev of physics.pendingEvents) {
        eventCounts[ev.type] = (eventCounts[ev.type] ?? 0) + 1;
        sound.triggerPhysicsEvent(ev);
        if (ev.type === 'bell_strike') {
          visuals.spawnSoundRipple(ev.position, '#ffd974');
        } else if (ev.type === 'drum_strike') {
          visuals.spawnSoundRipple(ev.position, '#ff6d4a');
        }
      }
      physics.pendingEvents.length = 0;

      // Sync every mechanical mesh 1-to-1 from Rapier3D rigid bodies
      visuals.syncFromPhysics(physics, frameDt, filmTime);
    }

    // Update Camera (Director choreography OR user Free Orbit)
    if (!freeOrbit) {
      evaluateCameraPose(filmTime, camPos, camLook);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
    } else {
      controls.update();
    }

    // Update procedural music score & water ambience level
    const waterFocus = filmTime >= 4.2 && filmTime <= 10.5 ? 1.0 : 0.25;
    sound.updateTimeline(filmTime, playing, waterFocus);

    // Update HUD, subtitles, and 3D-projected callouts
    updateHUD(filmTime);

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
}

bootstrap().catch((err) => {
  console.error('Failed to start Su Song Water-Driven Clock Tower simulation:', err);
});
