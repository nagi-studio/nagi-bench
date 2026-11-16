import * as THREE from 'three';
import type { GameCore } from '../core/core.ts';
import type { Entity, Vec3 } from '../core/types.ts';
import type { MapData } from '../core/map.ts';
import type { AudioEngine } from '../audio.ts';
import type { HudStore } from '../../store.ts';
import { CFG } from '../core/config.ts';
import { CharacterRig } from './character.ts';
import { Viewmodel } from './viewmodel.ts';
import { EffectsManager } from './effects.ts';
import { makeSandstone, makeFloor, makeCrate, makeMetal, makeWoodDoor, makeSkyGradient } from './textures.ts';
import { activeWeapon } from '../core/entities.ts';
import { WEAPONS } from '../core/weapons.ts';

function siteTexture(letter: string, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = color;
  ctx.font = 'bold 96px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 64, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private core: GameCore;
  private audio: AudioEngine;
  private store: HudStore;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private vmScene: THREE.Scene;
  private vmCamera: THREE.PerspectiveCamera;
  private rigs = new Map<number, CharacterRig>();
  private viewmodel: Viewmodel;
  private effects: EffectsManager;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private hudAcc = 0;
  private fpsAcc = 0;
  private fpsFrames = 0;
  private disposed = false;
  private sun: THREE.DirectionalLight;

  constructor(canvas: HTMLCanvasElement, core: GameCore, audio: AudioEngine, store: HudStore) {
    this.canvas = canvas;
    this.core = core;
    this.audio = audio;
    this.store = store;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbcd0e0);
    this.scene.fog = new THREE.Fog(0xc7d2d8, 60, 180);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.05, 400);
    this.camera.rotation.order = 'YXZ';

    this.vmScene = new THREE.Scene();
    this.vmCamera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
    this.vmScene.add(new THREE.HemisphereLight(0xffffff, 0x6a5a44, 1.1));
    const vmDir = new THREE.DirectionalLight(0xfff2dd, 1.4);
    vmDir.position.set(0.5, 1, 0.8);
    this.vmScene.add(vmDir);

    // Lighting
    const hemi = new THREE.HemisphereLight(0xcfe4f2, 0x9a8458, 0.9);
    this.scene.add(hemi);
    this.sun = new THREE.DirectionalLight(0xfff0d8, 1.6);
    this.sun.position.set(40, 80, 30);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -80; sc.right = 80; sc.top = 80; sc.bottom = -80; sc.near = 1; sc.far = 220;
    this.sun.shadow.bias = -0.0004;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    // Sky dome
    const skyGeo = new THREE.SphereGeometry(300, 24, 16);
    const skyMat = new THREE.MeshBasicMaterial({ map: makeSkyGradient(), side: THREE.BackSide, fog: false });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);

    this.buildMap(this.core.map);
    this.viewmodel = new Viewmodel(this.vmScene);
    this.effects = new EffectsManager(this.scene);

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private buildMap(map: MapData): void {
    const sand = makeSandstone();
    const floorTex = makeFloor();
    const crateTex = makeCrate();
    const metalTex = makeMetal();
    const doorTex = makeWoodDoor();
    const wallMat = new THREE.MeshStandardMaterial({ map: sand, color: 0xd8c8a0, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, color: 0xcabfa0, roughness: 0.95 });
    const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, color: 0xb09060, roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: crateTex, color: 0x9a7a4a, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ map: metalTex, color: 0x9aa0a8, roughness: 0.5, metalness: 0.5 });
    const doorMat = new THREE.MeshStandardMaterial({ map: doorTex, color: 0xa8825a, roughness: 0.8 });

    // Floors
    for (const r of map.floors) {
      const w = r.x2 - r.x1, d = r.z2 - r.z1;
      const geo = new THREE.BoxGeometry(w, 0.2, d);
      const m = new THREE.Mesh(geo, floorMat);
      m.position.set((r.x1 + r.x2) / 2, (r.h ?? 0) - 0.1, (r.z1 + r.z2) / 2);
      m.receiveShadow = true;
      this.scene.add(m);
    }
    // Surrounding ground apron
    const apron = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0xb09a6e, roughness: 1 }),
    );
    apron.rotation.x = -Math.PI / 2;
    apron.position.y = -0.25;
    apron.receiveShadow = true;
    this.scene.add(apron);

    // Colliders (walls / doors / crates)
    for (const c of map.colliders) {
      const w = c.max.x - c.min.x, h = c.max.y - c.min.y, d = c.max.z - c.min.z;
      const geo = new THREE.BoxGeometry(w, h, d);
      let mat = wallMat;
      if (c.tag === 'midDoor' || c.tag === 'longDoor' || c.tag === 'bDoor') mat = doorMat;
      else if (c.material === 'crate') mat = crateMat;
      else if (c.material === 'wood') mat = woodMat;
      else if (c.material === 'metal') mat = metalMat;
      const m = new THREE.Mesh(geo, mat);
      m.position.set((c.min.x + c.max.x) / 2, (c.min.y + c.max.y) / 2, (c.min.z + c.max.z) / 2);
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    }

    // Site markers
    const addSite = (r: { x1: number; z1: number; x2: number; z2: number }, letter: string, color: string) => {
      const tex = siteTexture(letter, color);
      const size = Math.min(r.x2 - r.x1, r.z2 - r.z1) * 0.5;
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(size, size),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.5, depthWrite: false }),
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.set((r.x1 + r.x2) / 2, 0.02, (r.z1 + r.z2) / 2);
      this.scene.add(plane);
    };
    addSite(map.sites.A, 'A', '#e0b040');
    addSite(map.sites.B, 'B', '#e07040');
  }

  resize = (): void => {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.vmCamera.aspect = w / h;
    this.vmCamera.updateProjectionMatrix();
  };

  addViewSway(dx: number, dy: number): void {
    this.viewmodel.addSway(dx, dy);
  }

  start(): void {
    this.last = performance.now();
    const loop = (now: number) => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      let dt = (now - this.last) / 1000;
      this.last = now;
      if (dt > 0.1) dt = 0.1;

      // FPS
      this.fpsAcc += dt;
      this.fpsFrames++;
      if (this.fpsAcc >= 0.5) {
        this.core.fps = Math.round(this.fpsFrames / this.fpsAcc);
        this.fpsAcc = 0;
        this.fpsFrames = 0;
      }

      // Fixed-step simulation
      this.acc += dt;
      let steps = 0;
      while (this.acc >= CFG.fixedDt && steps < 5) {
        this.core.update(CFG.fixedDt);
        this.acc -= CFG.fixedDt;
        steps++;
      }
      if (steps === 5) this.acc = 0;

      // Release the mouse at match end so the result screen is clickable.
      if (this.core.matchWinner && document.pointerLockElement === this.canvas) {
        document.exitPointerLock();
      }

      // Drain events -> effects + audio
      const events = this.core.drainEvents();
      const view = this.core.view;
      const listener = {
        pos: view ? { x: view.pos.x, y: view.pos.y + CFG.eyeHeight, z: view.pos.z } : { x: 0, y: 0, z: 0 },
        yaw: view ? view.yaw : 0,
        playerTeam: this.core.playerTeam,
        controlledId: this.core.controlledId,
      };
      for (const ev of events) {
        this.effects.handle(ev);
        if (ev.type === 'shot' && ev.entityId === this.core.controlledId) {
          this.viewmodel.kick(ev.weapon === 'awp' ? 1.4 : ev.weapon === 'deagle' ? 1.0 : ev.weapon === 'ak47' ? 0.8 : 0.5);
        } else if (ev.type === 'knife' && ev.entityId === this.core.controlledId) {
          this.viewmodel.doSlash();
        }
      }
      this.audio.handle(events, listener);

      this.syncCharacters();
      this.updateCamera(dt);
      this.updateViewmodel(dt);
      this.effects.update(dt, this.core.time, this.core.bomb);

      // Render
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
      this.renderer.render(this.vmScene, this.vmCamera);

      // HUD snapshot
      this.hudAcc += dt;
      if (this.hudAcc >= 1 / CFG.hudHz) {
        this.hudAcc = 0;
        this.store.publish(this.core.getSnapshot());
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  private syncCharacters(): void {
    for (const e of this.core.entities) {
      let rig = this.rigs.get(e.id);
      if (!rig) {
        rig = new CharacterRig(e.team);
        this.scene.add(rig.root);
        this.rigs.set(e.id, rig);
      }
      rig.update(e, this.core.time);
      // hide the rig of the entity we are viewing in first person (avoid seeing own body)
      rig.root.visible = e.id !== this.core.viewId || !e.alive;
    }
  }

  private updateCamera(dt: number): void {
    const view = this.core.view;
    if (!view) return;
    const eyeY = view.pos.y + CFG.eyeHeight;
    const shake = this.effects.shake;
    const sx = (Math.random() - 0.5) * shake * 0.3;
    const sy = (Math.random() - 0.5) * shake * 0.3;
    this.camera.position.set(view.pos.x + sx, eyeY + sy, view.pos.z);
    this.camera.rotation.y = -view.yaw;
    this.camera.rotation.x = view.pitch;
    const w = activeWeapon(view);
    const def = WEAPONS[w.id];
    const targetFov = view.scoped && def.scoped ? def.zoomFov : 75;
    if (Math.abs(this.camera.fov - targetFov) > 0.1) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 14);
      this.camera.updateProjectionMatrix();
    }
    // sun follows view for tight shadows
    this.sun.position.set(view.pos.x + 40, 80, view.pos.z + 30);
    this.sun.target.position.set(view.pos.x, 0, view.pos.z);
  }

  private updateViewmodel(dt: number): void {
    const ce = this.core.controlled;
    const show = ce && ce.alive && !this.core.spectating;
    if (!show) {
      this.viewmodel.group.visible = false;
      return;
    }
    const w = activeWeapon(ce);
    this.viewmodel.setWeapon(w.id);
    this.viewmodel.update({
      dt,
      walkPhase: ce.walkPhase,
      speed: ce.speed,
      reloading: w.reloading,
      reloadProgress: w.reloading ? 1 - w.reloadT / WEAPONS[w.id].reloadTime : 0,
      scoped: ce.scoped,
      time: this.core.time,
    });
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    for (const rig of this.rigs.values()) rig.dispose();
    this.renderer.dispose();
  }
}
