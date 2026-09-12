import * as THREE from 'three';
import { clamp, damp, lerp, yawToDir } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { Actor } from '../game/actor.ts';
import { activeDef } from '../game/actor.ts';
import type { GameEngine } from '../game/engine.ts';
import { PLAYER_EYE } from '../game/hitbox.ts';
import { WEAPONS } from '../game/weapons.ts';
import { CharacterRig } from './character.ts';
import { Effects } from './effects.ts';
import { buildMapMesh, buildSky } from './mapMesh.ts';
import { PALETTE } from './materials.ts';
import { ViewModel } from './viewmodel.ts';

const BASE_FOV = 90;

/**
 * Owns the THREE side of the game: scene graph, camera, per-actor character
 * rigs and the first-person view model. It never mutates simulation state —
 * every frame it samples the engine and reacts to its event bus.
 */
export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private engine: GameEngine;
  private rigs = new Map<number, CharacterRig>();
  private effects: Effects;
  private viewModel = new ViewModel();
  private sun: THREE.DirectionalLight;
  private bombGroup = new THREE.Group();
  private bombLed: THREE.Mesh | null = null;
  private unsubscribes: (() => void)[] = [];
  private fov = BASE_FOV;
  private shakeTime = 0;
  private shakeAmount = 0;
  private lastCamPos = new THREE.Vector3();
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, engine: GameEngine) {
    this.engine = engine;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.autoClear = false;

    this.camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.06, 600);
    this.camera.rotation.order = 'YXZ';

    this.scene.fog = new THREE.Fog(0xd8c7a4, 70, 300);
    this.scene.add(buildSky());

    // ---- lighting --------------------------------------------------------
    // Sun + sky bounce, kept modest so ACES tone mapping does not wash the
    // sand-coloured surfaces out to white.
    const hemi = new THREE.HemisphereLight(0xbcd6f5, 0xb08d5c, 0.9);
    this.scene.add(hemi);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    this.sun = new THREE.DirectionalLight(0xfff1d4, 2.2);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 220;
    this.sun.shadow.camera.left = -55;
    this.sun.shadow.camera.right = 55;
    this.sun.shadow.camera.top = 55;
    this.sun.shadow.camera.bottom = -55;
    this.sun.shadow.bias = -0.0009;
    this.sun.shadow.normalBias = 0.03;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    // ---- level -----------------------------------------------------------
    this.scene.add(buildMapMesh(engine.world));
    this.effects = new Effects(this.scene);
    this.buildBomb();

    for (const actor of engine.actors) this.ensureRig(actor);
    this.bindEvents();
    this.resize();
  }

  // --------------------------------------------------------------- plumbing

  private ensureRig(actor: Actor): CharacterRig {
    let rig = this.rigs.get(actor.id);
    if (!rig) {
      rig = new CharacterRig(actor.team);
      this.scene.add(rig.root);
      this.rigs.set(actor.id, rig);
    }
    return rig;
  }

  private buildBomb(): void {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.16, 0.24),
      new THREE.MeshLambertMaterial({ color: PALETTE.bomb }),
    );
    body.position.y = 0.08;
    body.castShadow = true;
    this.bombGroup.add(body);
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.02, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x50565e }),
    );
    panel.position.set(0, 0.17, 0);
    this.bombGroup.add(panel);
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 6),
      new THREE.MeshBasicMaterial({ color: PALETTE.bombLight }),
    );
    led.position.set(0.09, 0.18, 0);
    this.bombGroup.add(led);
    this.bombLed = led;
    this.bombGroup.visible = false;
    this.scene.add(this.bombGroup);
  }

  private bindEvents(): void {
    const bus = this.engine.bus;
    this.unsubscribes.push(
      bus.on('shot', ({ actorId, origin, end, firstPerson, weaponId }) => {
        const def = WEAPONS[weaponId];
        let from: Vec3 = origin;
        if (firstPerson) {
          // Start the tracer at the view model's muzzle, not the eye.
          const dir = new THREE.Vector3();
          this.camera.getWorldDirection(dir);
          const right = new THREE.Vector3().crossVectors(dir, this.camera.up).normalize();
          from = {
            x: this.camera.position.x + dir.x * 0.55 + right.x * 0.12,
            y: this.camera.position.y + dir.y * 0.55 - 0.09,
            z: this.camera.position.z + dir.z * 0.55 + right.z * 0.12,
          };
          this.viewModel.onFire(def.recoilPitch);
        } else {
          // Put the flash out at the other guy's muzzle rather than his face.
          const actor = this.engine.actorById(actorId);
          if (actor) {
            const d = yawToDir(actor.yaw, actor.pitch);
            this.effects.spawnMuzzleFlash({
              x: origin.x + d.x * 0.6,
              y: origin.y + d.y * 0.6 - 0.12,
              z: origin.z + d.z * 0.6,
            });
          }
        }
        this.effects.spawnTracer(from, end, def.slot === 'primary' ? 1.2 : 0.9);
        if (firstPerson) this.addShake(def.recoilPitch * 1.6, 0.08);
      }),
    );
    this.unsubscribes.push(
      bus.on('impact', ({ point, normal, surface }) => this.effects.spawnImpact(point, normal, surface)),
    );
    this.unsubscribes.push(
      bus.on('death', ({ pos }) => this.effects.spawnBlood({ x: pos.x, y: pos.y + 1.1, z: pos.z })),
    );
    this.unsubscribes.push(
      bus.on('knifeSwing', ({ firstPerson }) => {
        if (firstPerson) this.viewModel.onKnifeSwing();
      }),
    );
    this.unsubscribes.push(
      bus.on('bombExploded', ({ pos }) => {
        this.effects.spawnExplosion(pos);
        this.addShake(0.5, 1.4);
      }),
    );
    this.unsubscribes.push(
      bus.on('roundStart', () => {
        for (const rig of this.rigs.values()) rig.resetDeath();
      }),
    );
  }

  addShake(amount: number, time: number): void {
    this.shakeAmount = Math.max(this.shakeAmount, amount);
    this.shakeTime = Math.max(this.shakeTime, time);
  }

  // ------------------------------------------------------------------ frame

  render(dt: number): void {
    if (this.disposed) return;
    const engine = this.engine;
    const view = engine.viewActor;

    // ---- characters -------------------------------------------------------
    for (const actor of engine.actors) {
      const rig = this.ensureRig(actor);
      rig.update(actor, dt, engine.time);
      // Hide the body we are looking through (first person / spectating).
      const firstPerson = view && actor.id === view.id && actor.alive;
      rig.root.visible = !firstPerson;
      if (actor.team === engine.localActor?.team && actor.alive) {
        rig.enableTeamMarker(actor.team === 'CT' ? 0x63b3ff : 0xffc663);
      }
    }

    this.updateCamera(view, dt);
    this.updateBomb(dt);
    // While spectating we look through a team-mate, so their weapon is shown.
    this.viewModel.update(view && view.alive ? view : null, dt, engine.time);
    this.effects.update(dt);

    // Keep the shadow frustum tight around the viewer.
    const p = this.camera.position;
    this.sun.position.set(p.x + 42, p.y + 78, p.z + 30);
    this.sun.target.position.set(p.x, p.y, p.z);
    this.sun.target.updateMatrixWorld();

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.viewModel.scene, this.viewModel.camera);
  }

  private updateCamera(view: Actor | null, dt: number): void {
    if (!view) return;
    const engine = this.engine;
    const def = activeDef(view);

    // Field of view: scoped weapons zoom in smoothly.
    const targetFov = view.scoped && def.scope ? def.scope.fov : BASE_FOV;
    this.fov += (targetFov - this.fov) * damp(18, dt);
    if (Math.abs(this.camera.fov - this.fov) > 0.01) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }

    const eyeY = view.pos.y + PLAYER_EYE * view.heightScale;
    if (view.alive) {
      this.camera.position.set(view.pos.x, eyeY, view.pos.z);
      this.camera.rotation.set(
        clamp(view.pitch + view.punchPitch, -1.55, 1.55),
        view.yaw + view.punchYaw,
        0,
      );
      // Subtle landing / walking motion.
      const bob = Math.sin(engine.time * 9) * clamp(view.speed2D / 5.2, 0, 1) * 0.018;
      this.camera.position.y += bob;
    } else {
      // Death cam: pull up and back from the corpse.
      const t = clamp((engine.time - view.deathTime) / 1.6, 0, 1);
      const back = 1.4 + t * 1.4;
      const yaw = view.deathYaw;
      this.camera.position.set(
        view.pos.x + Math.sin(yaw) * back,
        lerp(eyeY, view.pos.y + 2.6, t),
        view.pos.z + Math.cos(yaw) * back,
      );
      this.camera.rotation.set(lerp(0, -0.55, t), yaw, 0);
    }

    if (this.shakeTime > 0) {
      this.shakeTime -= dt;
      const k = clamp(this.shakeTime, 0, 1) * this.shakeAmount;
      this.camera.rotation.x += (Math.random() - 0.5) * k;
      this.camera.rotation.y += (Math.random() - 0.5) * k;
      this.camera.rotation.z += (Math.random() - 0.5) * k * 0.5;
      if (this.shakeTime <= 0) this.shakeAmount = 0;
    }
    this.lastCamPos.copy(this.camera.position);
  }

  private updateBomb(dt: number): void {
    const b = this.engine.bomb;
    const show = b.phase === 'dropped' || b.phase === 'planted';
    this.bombGroup.visible = show;
    if (!show) return;
    this.bombGroup.position.set(b.pos.x, b.pos.y + 0.02, b.pos.z);
    if (this.bombLed) {
      const mat = this.bombLed.material as THREE.MeshBasicMaterial;
      if (b.phase === 'planted') {
        // Blink faster as the fuse burns down.
        const rate = clamp(b.fuse / 40, 0.12, 1) * 1.2;
        const on = (this.engine.time % rate) < rate * 0.45;
        mat.color.setHex(on ? 0xff2b1c : 0x400b08);
        this.bombGroup.rotation.y = 0;
      } else {
        mat.color.setHex(0x8a1810);
        this.bombGroup.rotation.y += dt * 0.6;
      }
    }
  }

  resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.viewModel.resize(w / h);
  }

  dispose(): void {
    this.disposed = true;
    for (const un of this.unsubscribes) un();
    this.unsubscribes = [];
    for (const rig of this.rigs.values()) rig.dispose();
    this.rigs.clear();
    this.viewModel.dispose();
    this.renderer.dispose();
  }
}
