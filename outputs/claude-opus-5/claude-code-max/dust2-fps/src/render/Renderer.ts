/**
 * GameRenderer — the presentation half of the engine.
 *
 * It never mutates the simulation; it reads actor state and drains the world's event queue
 * once per frame. World geometry, characters, effects and the first person view model are
 * all built procedurally here.
 */

import * as THREE from 'three';
import { Vec3, clamp, damp } from '../core/math.ts';
import type { Actor } from '../game/actor.ts';
import type { GameWorld } from '../game/world.ts';
import { WEAPONS } from '../game/weapons.ts';
import { type CharacterRig, createCharacter, disposeCharacter, updateCharacter } from './character.ts';
import { EffectsSystem } from './effects.ts';
import { type MapMeshes, buildMapMeshes } from './mapMesh.ts';
import { ViewModel } from './viewmodel.ts';

export interface RendererOptions {
  shadows: boolean;
  fov: number;
}

const DEFAULT_OPTIONS: RendererOptions = { shadows: true, fov: 90 };

function createSky(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(400, 24, 16);
  const pos = geo.getAttribute('position');
  const colors = new Float32Array(pos.count * 3);
  const top = new THREE.Color().setHex(0x4f86c6, THREE.SRGBColorSpace);
  const horizon = new THREE.Color().setHex(0xd8d0b4, THREE.SRGBColorSpace);
  for (let i = 0; i < pos.count; i++) {
    const t = clamp((pos.getY(i) / 400) * 1.4 + 0.25, 0, 1);
    colors[i * 3] = horizon.r + (top.r - horizon.r) * t;
    colors[i * 3 + 1] = horizon.g + (top.g - horizon.g) * t;
    colors[i * 3 + 2] = horizon.b + (top.b - horizon.b) * t;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }),
  );
  mesh.name = 'sky';
  return mesh;
}

export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly viewModel = new ViewModel();
  readonly effects: EffectsSystem;

  private readonly options: RendererOptions;
  private readonly map: MapMeshes;
  private readonly characters = new Map<number, CharacterRig>();
  private readonly bombGroup = new THREE.Group();
  private readonly bombLight: THREE.PointLight;
  private readonly sun: THREE.DirectionalLight;

  private currentFov: number;
  private cameraShake = 0;
  private landDip = 0;
  private prevOnGround = true;

  /** Screen-space feedback the HUD reads back (hit marker flashes etc.). */
  hitMarkerTimer = 0;
  damageFlash = 0;
  damageDirection = 0;

  constructor(canvas: HTMLCanvasElement, world: GameWorld, options: Partial<RendererOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = this.options.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;

    this.currentFov = this.options.fov;
    this.camera = new THREE.PerspectiveCamera(this.currentFov, 1, 0.05, 500);
    this.camera.rotation.order = 'YXZ';

    this.scene.fog = new THREE.Fog(0xcfc09c, 70, 260);
    this.scene.add(createSky());

    // ---- lighting ---------------------------------------------------------
    const hemi = new THREE.HemisphereLight(0xbdd7f7, 0x9a7c4f, 1.15);
    this.scene.add(hemi);

    this.sun = new THREE.DirectionalLight(0xfff0d0, 2.5);
    this.sun.position.set(52, 78, -26);
    this.sun.target.position.set(-6, 0, -12);
    this.scene.add(this.sun.target);
    if (this.options.shadows) {
      this.sun.castShadow = true;
      this.sun.shadow.mapSize.set(2048, 2048);
      const cam = this.sun.shadow.camera;
      cam.left = -70;
      cam.right = 70;
      cam.top = 70;
      cam.bottom = -70;
      cam.near = 1;
      cam.far = 260;
      this.sun.shadow.bias = -0.0009;
      this.sun.shadow.normalBias = 0.02;
    }
    this.scene.add(this.sun);

    // ---- world ------------------------------------------------------------
    this.map = buildMapMeshes(world.collision, this.options.shadows);
    this.scene.add(this.map.root);

    this.effects = new EffectsSystem(this.scene);

    // ---- characters -------------------------------------------------------
    for (const actor of world.actors) {
      const rig = createCharacter(actor.team);
      this.characters.set(actor.id, rig);
      this.scene.add(rig.root);
    }

    // ---- the bomb ---------------------------------------------------------
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.2, 0.26),
      new THREE.MeshLambertMaterial({ color: 0x2f3a26 }),
    );
    body.castShadow = this.options.shadows;
    this.bombGroup.add(body);
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.09, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xff2a2a }),
    );
    panel.position.set(0, 0.11, 0);
    panel.rotation.x = -Math.PI / 2;
    this.bombGroup.add(panel);
    this.bombLight = new THREE.PointLight(0xff2020, 0, 9, 2);
    this.bombLight.position.y = 0.4;
    this.bombGroup.add(this.bombLight);
    this.bombGroup.visible = false;
    this.scene.add(this.bombGroup);
  }

  // ------------------------------------------------------------------ frame

  /** Pulls one frame of state out of the world. Call after `world.update()`. */
  sync(world: GameWorld, dt: number, mouseDx: number, mouseDy: number): void {
    const view = world.viewActor();

    this.consumeEvents(world, dt);

    // ---- characters -------------------------------------------------------
    for (const actor of world.actors) {
      const rig = this.characters.get(actor.id);
      if (!rig) continue;
      updateCharacter(rig, actor, dt);
      // Hide the body we are looking through.
      rig.root.visible = actor.id !== (view ? view.id : -1);
    }

    // ---- camera -----------------------------------------------------------
    if (view) {
      const eyeY = view.pos.y + view.eyeHeight;

      if (!this.prevOnGround && view.onGround) this.landDip = 0.09;
      this.prevOnGround = view.onGround;
      this.landDip = damp(this.landDip, 0, 9, dt);

      const bob = view.onGround ? Math.sin(view.stepPhase * Math.PI * 2) * 0.012 * Math.min(1, view.speed / 6) : 0;

      this.camera.position.set(view.pos.x, eyeY - this.landDip + bob, view.pos.z);
      this.camera.rotation.set(
        clamp(view.pitch + view.viewPunchPitch, -Math.PI / 2, Math.PI / 2),
        view.yaw + view.viewPunchYaw,
        0,
      );

      if (this.cameraShake > 0) {
        this.cameraShake = Math.max(0, this.cameraShake - dt * 2.2);
        const s = this.cameraShake * 0.035;
        this.camera.rotation.x += (Math.random() - 0.5) * s;
        this.camera.rotation.y += (Math.random() - 0.5) * s;
        this.camera.rotation.z = (Math.random() - 0.5) * s * 0.6;
      }

      // Scoped zoom.
      const def = view.weapon();
      const targetFov =
        view.scopeLevel > 0 && def.scope
          ? def.scope.fovs[view.scopeLevel - 1] ?? this.options.fov
          : this.options.fov;
      this.currentFov = damp(this.currentFov, targetFov, 22, dt);
      if (Math.abs(this.camera.fov - this.currentFov) > 0.01) {
        this.camera.fov = this.currentFov;
        this.camera.updateProjectionMatrix();
      }
    }

    // ---- bomb -------------------------------------------------------------
    const bomb = world.bomb;
    if (bomb.state === 'dropped' || bomb.state === 'planted' || bomb.state === 'defused') {
      this.bombGroup.visible = true;
      const ground = world.collision.groundAt(bomb.pos.x, bomb.pos.z, bomb.pos.y + 1, 2);
      this.bombGroup.position.set(bomb.pos.x, Math.max(ground, bomb.pos.y) + 0.1, bomb.pos.z);
      if (bomb.state === 'planted') {
        const urgency = 1 - clamp(bomb.timer / 40, 0, 1);
        const blink = Math.sin(performance.now() * 0.004 * (1 + urgency * 6));
        this.bombLight.intensity = blink > 0 ? 3 + urgency * 6 : 0;
        this.bombGroup.rotation.y = 0.4;
      } else {
        this.bombLight.intensity = bomb.state === 'defused' ? 0 : 1.2;
      }
    } else {
      this.bombGroup.visible = false;
    }

    // ---- effects and view model -------------------------------------------
    this.effects.update(dt, this.camera.position);

    const controlled = world.controlledActor();
    this.viewModel.update(dt, controlled && controlled.alive ? controlled : null, mouseDx, mouseDy);

    if (this.hitMarkerTimer > 0) this.hitMarkerTimer -= dt;
    if (this.damageFlash > 0) this.damageFlash = Math.max(0, this.damageFlash - dt * 1.6);
  }

  private consumeEvents(world: GameWorld, _dt: number): void {
    const view = world.viewActor();
    const tracerStart = new Vec3();

    for (const ev of world.events) {
      switch (ev.type) {
        case 'shot': {
          const def = WEAPONS[ev.weapon];
          if (def.slot !== 'melee') {
            const isView = view ? ev.actorId === view.id : false;
            // For our own shots, start the tracer past the camera so it does not smear
            // across the screen.
            if (isView) {
              tracerStart.set(
                ev.origin.x + ev.dir.x * 1.2,
                ev.origin.y + ev.dir.y * 1.2 - 0.06,
                ev.origin.z + ev.dir.z * 1.2,
              );
            } else {
              tracerStart.copy(ev.origin).addScaled(ev.dir, 0.4);
            }
            this.effects.spawnTracer(tracerStart, ev.end, ev.weapon === 'awp' ? 0.05 : 0.032);
            this.effects.spawnMuzzleFlash(
              ev.origin,
              ev.dir.x,
              ev.dir.y,
              ev.dir.z,
              ev.weapon === 'awp' ? 1.5 : def.slot === 'secondary' ? 0.75 : 1,
            );
            if (isView) {
              this.viewModel.punch(ev.weapon === 'awp' ? 2.6 : def.damage / 30);
              this.cameraShake = Math.max(this.cameraShake, ev.weapon === 'awp' ? 0.5 : 0.16);
            }
          }
          break;
        }
        case 'impact':
          this.effects.spawnImpact(ev.point, ev.normal, ev.surface);
          break;
        case 'hit':
          this.effects.spawnBlood(ev.point);
          if (ev.byPlayer) this.hitMarkerTimer = 0.22;
          if (ev.onPlayer) {
            this.damageFlash = Math.min(1, this.damageFlash + ev.damage / 60);
            this.cameraShake = Math.max(this.cameraShake, Math.min(0.8, ev.damage / 45));
            const from = world.actors[ev.attacker];
            if (from && view) {
              this.damageDirection = Math.atan2(
                -(from.pos.x - view.pos.x),
                -(from.pos.z - view.pos.z),
              ) - view.yaw;
            }
          }
          break;
        case 'reload':
          if (ev.firstPerson) this.viewModel.startReload(WEAPONS[ev.weapon].reloadTime);
          break;
        case 'explode':
          this.effects.spawnExplosion(ev.pos);
          this.cameraShake = 1.4;
          break;
        default:
          break;
      }
    }
  }

  render(): void {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.viewModel.scene, this.viewModel.camera);
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.viewModel.resize(width / height);
  }

  setShadows(enabled: boolean): void {
    this.renderer.shadowMap.enabled = enabled;
    this.sun.castShadow = enabled;
  }

  /** Camera basis vectors, used by the audio engine for stereo panning. */
  cameraState(): { pos: THREE.Vector3; yaw: number } {
    return { pos: this.camera.position, yaw: this.camera.rotation.y };
  }

  dispose(): void {
    for (const rig of this.characters.values()) {
      disposeCharacter(rig);
      this.scene.remove(rig.root);
    }
    this.characters.clear();
    this.map.dispose();
    this.effects.dispose();
    this.viewModel.dispose();
    this.renderer.dispose();
  }
}

/** Convenience for the HUD: is this actor visible to the player right now? */
export function actorIsVisibleTo(world: GameWorld, viewer: Actor, target: Actor): boolean {
  const eye = viewer.eyePos();
  const aim = new Vec3(target.pos.x, target.pos.y + 1.2, target.pos.z);
  return !world.collision.losBlocked(eye, aim);
}
