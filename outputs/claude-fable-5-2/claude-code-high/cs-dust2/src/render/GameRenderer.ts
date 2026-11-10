// Owns the three.js scene. It never mutates the simulation: every frame it reads actor state
// (interpolated between the two most recent physics ticks) and reacts to simulation events.

import * as THREE from 'three';
import type { Actor } from '../sim/actor';
import { lerp, lerpAngle } from '../sim/math';
import type { SimEvent, Simulation } from '../sim/sim';
import { WEAPONS } from '../sim/weapons';
import { CharacterModel } from './character';
import { Effects } from './effects';
import { MapMeshes, buildMapMeshes } from './mapMesh';
import { TextureSet, createTextures, disposeTextures } from './textures';
import { ViewModel } from './viewModel';

export const BASE_FOV = 74;

export interface ViewState {
  /** Actor whose eyes we look through (null = free/orbit camera). */
  actor: Actor | null;
  /** Orbit camera target when there is nobody to look through. */
  orbit: { x: number; y: number; z: number; angle: number } | null;
  /** Team whose name tags are shown. */
  team: 'atk' | 'def';
}

const _v = new THREE.Vector3();
const _m = new THREE.Vector3();

export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.06, 900);
  private tex: TextureSet;
  private mapMeshes: MapMeshes;
  private characters: CharacterModel[] = [];
  private effects: Effects;
  private viewModel: ViewModel;
  private sun: THREE.DirectionalLight;
  private fov = BASE_FOV;
  private viewActorId = -1;
  private shakeT = 0;
  /** Extra view kick when the viewed actor gets hit. */
  private hurtKick = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private sim: Simulation,
  ) {
    const map = sim.map;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.autoClear = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const sd = map.sunDir;
    this.tex = createTextures(Math.atan2(sd.z, sd.x) / (Math.PI * 2) + 0.5, Math.asin(sd.y));
    this.scene.background = this.tex.sky;
    this.scene.fog = new THREE.Fog(0xc4d6e2, 90, 520);

    // --- lighting: sky/ground hemisphere fill + a shadow-casting sun
    const hemi = new THREE.HemisphereLight(0xcfe2f5, 0x8a8170, 1.55);
    this.scene.add(hemi);
    this.sun = new THREE.DirectionalLight(0xfff0d6, 2.9);
    const cx = (map.minX + map.maxX) / 2;
    const cz = (map.minZ + map.maxZ) / 2;
    this.sun.position.set(cx + sd.x * 120, sd.y * 120, cz + sd.z * 120);
    this.sun.target.position.set(cx, 0, cz);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(4096, 4096);
    const sc = this.sun.shadow.camera;
    sc.left = -72;
    sc.right = 72;
    sc.top = 72;
    sc.bottom = -72;
    sc.near = 10;
    sc.far = 260;
    sc.updateProjectionMatrix();
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.06;
    this.scene.add(this.sun, this.sun.target);

    this.mapMeshes = buildMapMeshes(map, this.tex);
    this.scene.add(this.mapMeshes.group);

    for (const a of sim.actors) {
      const c = new CharacterModel(a.team, a.name);
      this.characters.push(c);
      this.scene.add(c.root);
    }
    this.effects = new Effects(this.tex);
    this.scene.add(this.effects.group);
    this.viewModel = new ViewModel(this.tex);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);
  }

  resize(w: number, h: number): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
    this.viewModel.setAspect(w / Math.max(1, h));
  }

  /** Visual reaction to a simulation event. */
  handleEvent(e: SimEvent): void {
    const sim = this.sim;
    const fx = this.effects;
    switch (e.type) {
      case 'shot': {
        const def = WEAPONS[e.weapon];
        const first = e.actor === this.viewActorId;
        let ox = e.ox;
        let oy = e.oy;
        let oz = e.oz;
        if (first) {
          this.viewModel.onShot(e.weapon);
          // start the tracer below-right of the eye, roughly where the barrel is on screen
          const a = sim.actors[e.actor];
          const yaw = a.yaw;
          ox += Math.cos(yaw) * 0.12 - Math.sin(yaw) * 0.5;
          oz += -Math.sin(yaw) * 0.12 - Math.cos(yaw) * 0.5;
          oy -= 0.12;
        } else {
          const c = this.characters[e.actor];
          c.kick(0.5 + def.viewKick * 0.4);
          c.getMuzzle(_m);
          ox = _m.x;
          oy = _m.y;
          oz = _m.z;
          fx.muzzleFlash(ox, oy, oz, def.kind === 'sniper' ? 0.9 : def.kind === 'pistol' ? 0.4 : 0.6);
        }
        fx.tracer(ox, oy, oz, e.ex, e.ey, e.ez, def.kind === 'sniper' ? 0.03 : 0.014);
        if (e.hit === 1) fx.impact(e.ex, e.ey, e.ez, e.nx, e.ny, e.nz);
        break;
      }
      case 'hit': {
        if (e.attacker >= 0) {
          const at = sim.actors[e.attacker];
          _v.set(e.x - at.pos.x, 0, e.z - at.pos.z).normalize();
          fx.blood(e.x, e.y, e.z, _v.x * 0.6, 0.2, _v.z * 0.6, e.zone === 'head' || e.killed);
        }
        if (e.victim === this.viewActorId) this.hurtKick = Math.min(0.06, this.hurtKick + 0.02 + e.damage * 0.0004);
        break;
      }
      case 'land':
        if (e.actor === this.viewActorId) this.viewModel.onLand(e.speed);
        break;
      case 'bomb':
        if (e.kind === 'beep' || e.kind === 'planted') fx.bombBeep();
        if (e.kind === 'exploded') fx.explode(e.x, e.y, e.z);
        break;
      case 'round':
        if (e.kind === 'start') fx.clearRound();
        break;
      default:
        break;
    }
  }

  /**
   * Draws one frame. `alpha` is the interpolation factor between the previous and the current
   * physics state; `humanId` is the actor whose view angles come straight from the mouse.
   */
  render(alpha: number, dt: number, view: ViewState, humanId: number): void {
    const sim = this.sim;
    const now = sim.time;
    const va = view.actor;
    this.viewActorId = va ? va.id : -1;

    // --- characters
    for (let i = 0; i < sim.actors.length; i++) {
      const a = sim.actors[i];
      const c = this.characters[i];
      const x = lerp(a.prevPos.x, a.pos.x, alpha);
      const y = lerp(a.prevPos.y, a.pos.y, alpha);
      const z = lerp(a.prevPos.z, a.pos.z, alpha);
      const direct = a.id === humanId;
      const yaw = direct ? a.yaw : lerpAngle(a.prevYaw, a.yaw, alpha);
      const pitch = direct ? a.pitch : lerp(a.prevPitch, a.pitch, alpha);
      c.root.visible = !(va && va.id === a.id && a.alive);
      c.update(a, x, y, z, yaw, pitch + a.punchPitch, dt, now);
      c.setTagVisible(a.alive && a.team === view.team && !(va && va.id === a.id));
    }

    // --- camera
    const fx = this.effects;
    fx.update(dt);
    this.hurtKick *= Math.exp(-dt * 8);
    let targetFov = BASE_FOV;
    let vmYaw = 0;
    let vmPitch = 0;
    if (va && va.alive) {
      const direct = va.id === humanId;
      const yaw = (direct ? va.yaw : lerpAngle(va.prevYaw, va.yaw, alpha)) + va.punchYaw;
      const pitch = (direct ? va.pitch : lerp(va.prevPitch, va.pitch, alpha)) + va.punchPitch + this.hurtKick;
      this.camera.position.set(lerp(va.prevPos.x, va.pos.x, alpha), lerp(va.prevPos.y, va.pos.y, alpha) + va.eyeHeight, lerp(va.prevPos.z, va.pos.z, alpha));
      this.camera.rotation.set(Math.max(-1.55, Math.min(1.55, pitch)), yaw, 0);
      const def = va.def;
      if (def.zoom && va.zoom > 0) targetFov = def.zoom.fovs[Math.min(va.zoom, def.zoom.fovs.length) - 1];
      vmYaw = yaw;
      vmPitch = pitch;
    } else if (view.orbit) {
      const o = view.orbit;
      this.camera.position.set(o.x + Math.sin(o.angle) * 5.5, o.y + 4.2, o.z + Math.cos(o.angle) * 5.5);
      this.camera.rotation.set(0, 0, 0);
      this.camera.lookAt(o.x, o.y + 0.8, o.z);
    }
    if (fx.shake > 0) {
      this.shakeT += dt * 38;
      this.camera.rotation.x += Math.sin(this.shakeT * 1.3) * 0.02 * fx.shake;
      this.camera.rotation.z += Math.cos(this.shakeT) * 0.025 * fx.shake;
    }
    // snap into the scope quickly, relax back a little slower
    const k = 1 - Math.exp(-dt * (targetFov < this.fov ? 26 : 16));
    this.fov = lerp(this.fov, targetFov, k);
    if (Math.abs(this.camera.fov - this.fov) > 0.01) {
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }

    // --- bomb in the world
    const bomb = sim.round.bomb;
    const showBomb = bomb.status === 'dropped' || bomb.status === 'planted' || bomb.status === 'defused';
    fx.setBomb(showBomb, bomb.pos.x, bomb.pos.y, bomb.pos.z, bomb.status !== 'dropped', now);

    this.viewModel.update(va && va.alive ? va : null, !!va, vmYaw, vmPitch, dt, now);

    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    if (va && va.alive) {
      this.renderer.clearDepth();
      this.renderer.render(this.viewModel.scene, this.viewModel.camera);
    }
  }

  dispose(): void {
    for (const c of this.characters) c.dispose();
    this.effects.dispose();
    this.viewModel.dispose();
    this.mapMeshes.dispose();
    disposeTextures(this.tex);
    this.renderer.dispose();
  }
}
