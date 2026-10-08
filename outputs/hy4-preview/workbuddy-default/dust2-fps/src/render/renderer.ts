/**
 * three.js presentation layer. Owns the scene, the camera, the character rigs,
 * the first-person view model and the tracers; it reads the engine state but
 * never writes to it.
 */

import * as THREE from 'three';
import { GameEngine } from '../game/game';
import { CHARACTER, WEAPONS } from '../game/weapons';
import { dirFromAngles } from '../game/entities';
import { buildWorld, type WorldMeshes } from './worldMesh';
import { buildHumanoid, buildWeaponModel, updateRig, type CharacterRig } from './humanoid';
import { createViewModel, setViewModelWeapon, updateViewModel, type ViewModel } from './viewmodel';
import { worldTextures } from './textures';
import { SITES } from '../game/map/dust2';
import { clamp, damp, lerp } from '../game/mathUtils';

const BASE_FOV = 78;
const MAX_TRACERS = 48;
const TRACER_LIFE = 0.075;

interface RigEntry {
  rig: CharacterRig;
  weaponId: string;
}

export class SceneManager {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private world: WorldMeshes;
  private rigs = new Map<number, RigEntry>();
  private vm: ViewModel;
  private bombMesh: THREE.Group;
  private bombLed: THREE.Mesh;
  private tracerGeo: THREE.BufferGeometry;
  private tracerMesh: THREE.LineSegments;
  private sun: THREE.DirectionalLight;

  /** view bob state */
  private bobPhase = 0;
  private bobOffset = 0;
  private lastSpeed = 0;
  /** adaptive quality: software / weak GPUs drop shadows then resolution */
  private qualitySamples = 0;
  private qualityTime = 0;
  private shadowTier = 1;
  private pixelRatio = Math.min(window.devicePixelRatio, 1.75);
  fps = 0;
  /** smoothed camera recoil shake */
  private shake = 0;
  private lastFired = new Map<number, number>();

  constructor(canvas: HTMLCanvasElement, engine: GameEngine) {
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, powerPreference: 'high-performance', stencil: false,
    });
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.06, 400);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    // ---- sky + fog ----
    const tex = worldTextures();
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(320, 24, 16),
      new THREE.MeshBasicMaterial({ map: tex.sky, side: THREE.BackSide, fog: false, depthWrite: false }),
    );
    sky.name = 'sky';
    this.scene.add(sky);
    this.scene.fog = new THREE.Fog(0xcfc3ab, 70, 300);

    // ---- lights ----
    const hemi = new THREE.HemisphereLight(0xcfe2ff, 0xc0a87d, 0.85);
    this.scene.add(hemi);
    const amb = new THREE.AmbientLight(0xffffff, 0.28);
    this.scene.add(amb);
    this.sun = new THREE.DirectionalLight(0xfff2d6, 1.65);
    this.sun.position.set(48, 88, -34);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1536, 1536);
    const sc = this.sun.shadow.camera;
    sc.left = -78; sc.right = 78; sc.top = 62; sc.bottom = -62;
    sc.near = 1; sc.far = 260;
    this.sun.shadow.bias = -0.0009;
    this.sun.shadow.normalBias = 0.035;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    // ---- world ----
    this.world = buildWorld(engine.grid);
    this.scene.add(this.world.group);

    this.addSiteMarkers();
    this.addSpawnMarkers(engine);

    // ---- characters ----
    for (const c of engine.combatants) this.addRig(engine, c.id);

    // ---- view model ----
    this.vm = createViewModel(this.camera);
    const startWeapon = engine.currentWeaponId(engine.byId(engine.playerId)!);
    setViewModelWeapon(this.vm, startWeapon);

    // ---- bomb ----
    const bomb = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.16, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x1d2024, roughness: 0.7, metalness: 0.2 }),
    );
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.20, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x2b2f35, roughness: 0.5, metalness: 0.4 }),
    );
    panel.position.set(0, 0.02, -0.125);
    this.bombLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.032, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xff3020 }),
    );
    this.bombLed.position.set(0.10, 0.06, -0.13);
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6),
      new THREE.MeshStandardMaterial({ color: 0x555a60, roughness: 0.4, metalness: 0.6 }),
    );
    antenna.position.set(-0.13, 0.15, 0.06);
    bomb.add(body, panel, this.bombLed, antenna);
    bomb.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
    bomb.visible = false;
    this.bombMesh = bomb;
    this.scene.add(bomb);

    // ---- tracers ----
    this.tracerGeo = new THREE.BufferGeometry();
    const tp = new Float32Array(MAX_TRACERS * 2 * 3);
    const tc = new Float32Array(MAX_TRACERS * 2 * 3);
    this.tracerGeo.setAttribute('position', new THREE.BufferAttribute(tp, 3));
    this.tracerGeo.setAttribute('color', new THREE.BufferAttribute(tc, 3));
    this.tracerMesh = new THREE.LineSegments(
      this.tracerGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );
    this.tracerMesh.frustumCulled = false;
    this.scene.add(this.tracerMesh);

    window.addEventListener('resize', this.onResize);
  }

  private addSiteMarkers(): void {
    for (const s of SITES) {
      const w = s.x1 - s.x0;
      const d = s.z1 - s.z0;
      const geo = new THREE.PlaneGeometry(w, d);
      const mat = new THREE.MeshBasicMaterial({
        color: s.id === 'A' ? 0xd95f3c : 0x3ca0d9,
        transparent: true, opacity: 0.16, depthWrite: false,
      });
      const m = new THREE.Mesh(geo, mat);
      m.rotation.x = -Math.PI / 2;
      m.position.set((s.x0 + s.x1) / 2, 0.015, (s.z0 + s.z1) / 2);
      m.renderOrder = 1;
      this.scene.add(m);
    }
  }

  private addSpawnMarkers(engine: GameEngine): void {
    // subtle floor decals so spawn areas read as home territory
    const mk = (x: number, z: number, color: number) => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(2.2, 2.6, 20),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28, depthWrite: false }),
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.02, z);
      this.scene.add(m);
    };
    void engine;
    mk(-33, 30, 0xe0a04a);
    mk(40, -36, 0x6fa8dc);
  }

  private addRig(engine: GameEngine, id: number): void {
    const c = engine.byId(id);
    if (!c) return;
    const rig = buildHumanoid(c.team);
    this.scene.add(rig.root);
    this.rigs.set(id, { rig, weaponId: '' });
  }

  private syncWeapon(entry: RigEntry, weaponId: string): void {
    if (entry.weaponId === weaponId) return;
    entry.weaponId = weaponId;
    entry.rig.weapon.clear();
    const { group } = buildWeaponModel(weaponId as never, 1);
    entry.rig.weapon.add(group);
  }

  // -------------------------------------------------------------------------

  update(engine: GameEngine, dt: number, isLocalView: boolean): void {
    const now = engine.time;
    const cam = engine.cameraCombatant();

    // ---- characters ----
    for (const c of engine.combatants) {
      const entry = this.rigs.get(c.id);
      if (!entry) { this.addRig(engine, c.id); continue; }
      this.syncWeapon(entry, engine.currentWeaponId(c));
      // never render the body the camera is inside of
      const isCam = cam !== null && c.id === cam.id;
      entry.rig.root.visible = !isCam;
      const isMate = cam !== null && c.team === cam.team && c.id !== cam.id;
      updateRig(entry.rig, c, dt, now, isMate, !isCam);
    }

    // ---- camera ----
    if (cam) {
      const eyeY = cam.body.y + CHARACTER.eyeHeight;
      const speed = Math.hypot(cam.body.vx, cam.body.vz);
      this.lastSpeed = damp(this.lastSpeed, speed, 8, dt);
      if (cam.body.onGround && speed > 0.6) {
        this.bobPhase += speed * dt * 3.1;
        this.bobOffset = damp(this.bobOffset, Math.sin(this.bobPhase) * 0.026 * clamp(speed / 4.6, 0, 1.2), 18, dt);
      } else {
        this.bobOffset = damp(this.bobOffset, 0, 6, dt);
      }

      // small landing shake
      if (cam.body.onGround && this.lastSpeed > 3.5 && this.shake < 0.05) this.shake = 0.045;
      this.shake = Math.max(0, this.shake - dt * 0.35);

      this.camera.position.set(
        cam.body.x,
        eyeY + this.bobOffset + (Math.random() - 0.5) * this.shake * 0.5,
        cam.body.z,
      );
      this.camera.rotation.set(cam.pitch, cam.yaw, 0);

      // free-look roll while strafing
      const right = Math.cos(cam.yaw) * cam.body.vx - Math.sin(cam.yaw) * cam.body.vz;
      this.camera.rotation.z = damp(this.camera.rotation.z, -right * 0.006, 8, dt);
    }

    // ---- fov / ads ----
    if (cam) {
      const def = WEAPONS[engine.currentWeaponId(cam)];
      const target = def.ads ? lerp(BASE_FOV, def.ads.fov, cam.adsAmount) : BASE_FOV;
      if (Math.abs(this.camera.fov - target) > 0.01) {
        this.camera.fov = target;
        this.camera.updateProjectionMatrix();
      }
    }

    // ---- view model ----
    if (cam && isLocalView) {
      const ws = engine.currentState(cam);
      const def = WEAPONS[engine.currentWeaponId(cam)];
      setViewModelWeapon(this.vm, def.id);
      const last = this.lastFired.get(cam.id) ?? -99;
      const fired = now - last < 0.05;
      this.vm.root.visible = true;
      updateViewModel(this.vm, {
        dt,
        yaw: cam.yaw,
        pitch: cam.pitch,
        speed: Math.hypot(cam.body.vx, cam.body.vz),
        onGround: cam.body.onGround,
        adsAmount: cam.adsAmount,
        recoilPitch: cam.recoilPitch,
        reloading: ws ? ws.reloading : false,
        reloadProgress: ws && ws.reloading ? clamp(1 - (ws.reloadEnd - now) / def.reloadTime, 0, 1) : 0,
        drawing: ws ? now < ws.readyTime : false,
        firedThisFrame: fired,
      });
      // hide the gun while the AWP scope overlay takes over
      this.vm.root.visible = !(def.ads && def.ads.scope && cam.adsAmount > 0.92);
    } else {
      this.vm.root.visible = false;
    }

    // ---- record shots for muzzle flash ----
    if (cam && engine.tracers.length > 0) {
      const t = engine.tracers[engine.tracers.length - 1]!;
      if (now - t.time < 0.02) {
        const d = Math.hypot(t.x0 - cam.body.x, t.z0 - cam.body.z);
        if (d < 0.8) this.lastFired.set(cam.id, now);
      }
    }

    // ---- bomb ----
    const bomb = engine.bomb;
    if (bomb.state === 'dropped' || bomb.state === 'planted') {
      this.bombMesh.visible = true;
      this.bombMesh.position.set(bomb.x, bomb.state === 'planted' ? 0.08 : 0.09, bomb.z);
      this.bombMesh.rotation.y = bomb.state === 'planted' ? 0.4 : now * 0.4;
      const blink = bomb.state === 'planted'
        ? (Math.sin(now * (bomb.timer < 10 ? 22 : 9)) > 0 ? 1 : 0.12)
        : (Math.sin(now * 5) > 0 ? 1 : 0.2);
      (this.bombLed.material as THREE.MeshBasicMaterial).color.setRGB(blink, blink * 0.12, blink * 0.08);
    } else {
      this.bombMesh.visible = false;
    }

    // ---- tracers ----
    this.updateTracers(engine, now);

    // ---- sun follows the player so shadows stay crisp ----
    if (cam) {
      this.sun.position.set(cam.body.x + 48, 88, cam.body.z - 34);
      this.sun.target.position.set(cam.body.x, 0, cam.body.z);
      this.sun.target.updateMatrixWorld();
    }

    this.tickQuality(dt * 1000);
  }

  private updateTracers(engine: GameEngine, now: number): void {
    const pos = this.tracerGeo.getAttribute('position') as THREE.BufferAttribute;
    const col = this.tracerGeo.getAttribute('color') as THREE.BufferAttribute;
    const pa = pos.array as Float32Array;
    const ca = col.array as Float32Array;
    let n = 0;
    for (const t of engine.tracers) {
      if (n >= MAX_TRACERS) break;
      const age = (now - t.time) / TRACER_LIFE;
      if (age < 0 || age > 1) continue;
      const a = 1 - age;
      const i = n * 6;
      pa[i] = t.x0; pa[i + 1] = t.y0; pa[i + 2] = t.z0;
      pa[i + 3] = t.x1; pa[i + 4] = t.y1; pa[i + 5] = t.z1;
      const w = WEAPONS[t.weapon];
      const r = w.category === 'melee' ? 0.6 : 1.0;
      ca[i] = r * a; ca[i + 1] = (w.id === 'awp' ? 0.85 : 0.72) * a; ca[i + 2] = 0.42 * a;
      ca[i + 3] = r * a * 0.35; ca[i + 4] = 0.5 * a * 0.35; ca[i + 5] = 0.2 * a * 0.35;
      n++;
    }
    // collapse unused segments
    for (let k = n; k < MAX_TRACERS; k++) {
      const i = k * 6;
      pa[i] = 0; pa[i + 1] = -999; pa[i + 2] = 0;
      pa[i + 3] = 0; pa[i + 4] = -999; pa[i + 5] = 0;
      ca[i] = 0; ca[i + 1] = 0; ca[i + 2] = 0;
      ca[i + 3] = 0; ca[i + 4] = 0; ca[i + 5] = 0;
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    // drop expired tracers from the engine queue
    if (engine.tracers.length > 0 && now - engine.tracers[0]!.time > TRACER_LIFE * 4) {
      engine.tracers = engine.tracers.filter((t) => now - t.time <= TRACER_LIFE * 2);
    }
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Keep the frame budget healthy on weak hardware by dropping shadow quality
   * and then resolution when the frame time is consistently too high.
   */
  private tickQuality(frameMs: number): void {
    this.qualityTime += frameMs;
    this.qualitySamples++;
    if (this.qualitySamples < 90) return;
    const avg = this.qualityTime / this.qualitySamples;
    this.qualityTime = 0;
    this.qualitySamples = 0;
    this.fps = Math.round(1000 / Math.max(1, avg));
    if (avg > 26 && this.shadowTier === 1) {
      this.shadowTier = 0;
      this.sun.castShadow = false;
      this.renderer.shadowMap.enabled = false;
      this.renderer.shadowMap.needsUpdate = true;
    } else if (avg > 40 && this.pixelRatio > 1) {
      this.pixelRatio = 1;
      this.renderer.setPixelRatio(1);
      this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    }
  }

  private onResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  };

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }

  /** World position of the view-model muzzle (used for local audio panning). */
  muzzleWorld(out: THREE.Vector3): THREE.Vector3 {
    return this.vm.muzzle.getWorldPosition(out);
  }

  /** Forward direction of the camera. */
  forward(): { x: number; y: number; z: number } {
    return dirFromAngles(this.camera.rotation.y, this.camera.rotation.x);
  }
}
