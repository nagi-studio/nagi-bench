import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { lerp, lerpAngle } from '../core/math';
import type { Actor } from '../sim/Actor';
import type { World } from '../sim/World';
import { WEAPONS } from '../weapons/WeaponDefs';
import { Effects } from './Effects';
import { buildMapMeshes } from './MapMeshes';
import { ViewModel, type ViewModelState } from './ViewModel';
import { createWeaponModel } from './WeaponModels';

export interface CameraView {
  pos: THREE.Vector3;
  yaw: number;
  pitch: number;
  roll: number;
  fov: number;
  /** Actor rendered in first person (body hidden, shadow kept). */
  firstPerson: Actor | null;
}

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SKY_FRAG = /* glsl */ `
  uniform vec3 top;
  uniform vec3 horizon;
  uniform vec3 ground;
  uniform vec3 sunDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = h > 0.0 ? mix(horizon, top, pow(clamp(h, 0.0, 1.0), 0.5)) : mix(horizon, ground, pow(clamp(-h, 0.0, 1.0), 0.35));
    float s = max(0.0, dot(d, sunDir));
    col += vec3(1.0, 0.86, 0.62) * (pow(s, 900.0) * 6.0 + pow(s, 16.0) * 0.22 + pow(s, 3.0) * 0.06);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const MAP_CENTER = new THREE.Vector3(54, 0, 52);
const SUN_DIR = new THREE.Vector3(-0.52, 0.74, 0.42).normalize();

const LAYER_FIRST_PERSON = 1;

/**
 * Owns the WebGL renderer and scene graph. Each frame it interpolates every actor between the
 * last two simulation ticks, syncs dropped items / bomb, updates effects, and renders the world
 * pass followed by the first-person view-model pass.
 */
export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(74, 1, 0.05, 700);
  readonly viewModel = new ViewModel();
  readonly effects = new Effects();
  readonly sun: THREE.DirectionalLight;
  private readonly sky: THREE.Mesh;
  private mapGroup: THREE.Group | null = null;
  private world: World | null = null;
  private readonly actorRoot = new THREE.Group();
  private readonly itemRoot = new THREE.Group();
  private readonly droppedMeshes = new Map<number, THREE.Object3D>();
  private readonly bombObj: THREE.Group;
  private readonly bombLed: THREE.Mesh;
  private readonly nameTags = new Map<number, THREE.Sprite>();
  private hiddenActor: Actor | null = null;
  private height = 1;
  private readonly tmpPos = new THREE.Vector3();

  constructor(canvas: HTMLCanvasElement, readonly quality: 'high' | 'low' = 'high') {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = quality === 'high';
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    const horizon = new THREE.Color(0xd9d6c8);
    this.scene.background = horizon.clone();
    this.scene.fog = new THREE.Fog(horizon, 90, 300);

    // sky dome follows the camera
    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(500, 32, 16),
      new THREE.ShaderMaterial({
        uniforms: {
          top: { value: new THREE.Color(0x3d7fd8) },
          horizon: { value: horizon },
          ground: { value: new THREE.Color(0xb59d78) },
          sunDir: { value: SUN_DIR },
        },
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    this.sky.renderOrder = -10;
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);

    // lighting
    const hemi = new THREE.HemisphereLight(0xc7dcf5, 0xa8835a, 1.15);
    this.scene.add(hemi);
    this.sun = new THREE.DirectionalLight(0xffefd4, 3.1);
    this.sun.position.copy(MAP_CENTER).addScaledVector(SUN_DIR, 120);
    this.sun.target.position.copy(MAP_CENTER);
    this.sun.castShadow = true;
    const maxTex = this.renderer.capabilities.maxTextureSize;
    const size = maxTex >= 8192 ? 4096 : 2048;
    this.sun.shadow.mapSize.set(size, size);
    const sc = this.sun.shadow.camera;
    sc.left = -78;
    sc.right = 78;
    sc.top = 78;
    sc.bottom = -78;
    sc.near = 20;
    sc.far = 260;
    sc.layers.enable(LAYER_FIRST_PERSON);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.045;
    this.scene.add(this.sun, this.sun.target);
    this.camera.layers.set(0);

    this.scene.add(this.actorRoot, this.itemRoot, this.effects.group);

    // procedural image-based lighting so metallic surfaces (guns, barrels, car) are not black
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = env;
    this.scene.environmentIntensity = 0.3;
    this.viewModel.scene.environment = env;
    this.viewModel.scene.environmentIntensity = 0.75;

    // bomb object (dropped / planted)
    const c4 = createWeaponModel('c4');
    this.bombObj = new THREE.Group();
    c4.root.scale.setScalar(1.4);
    c4.root.position.y = 0.06;
    this.bombObj.add(c4.root);
    this.bombLed = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
    this.bombLed.position.set(0.05, 0.13, -0.05);
    this.bombObj.add(this.bombLed);
    this.bombObj.visible = false;
    this.scene.add(this.bombObj);
  }

  /** Attach a new match. The static map is built once and reused. */
  setWorld(world: World): void {
    if (this.world) {
      for (const a of this.world.actors) {
        this.actorRoot.remove(a.model.root);
        a.model.dispose();
      }
      for (const s of this.nameTags.values()) {
        s.material.map?.dispose();
        s.material.dispose();
      }
      this.nameTags.clear();
    }
    this.world = world;
    this.hiddenActor = null;
    if (!this.mapGroup) {
      this.mapGroup = buildMapMeshes(world.level).group;
      this.scene.add(this.mapGroup);
    }
    for (const a of world.actors) {
      this.actorRoot.add(a.model.root);
      if (a.team === world.human.team && a !== world.human) {
        const tag = makeNameTag(a.name, a.team === 'CT' ? '#8fc1ff' : '#ffd27a');
        a.model.root.add(tag);
        tag.position.set(0, 2.15, 0);
        this.nameTags.set(a.id, tag);
      }
    }
    this.clearTransient();
    this.compileShaders();
  }

  /** Pre-compile programs to avoid hitches on first sight of materials. */
  private compileShaders(): void {
    try {
      this.renderer.compile(this.scene, this.camera);
      this.renderer.compile(this.viewModel.scene, this.viewModel.camera);
    } catch {
      // compile is an optimisation only
    }
  }

  clearTransient(): void {
    this.effects.clear();
    for (const m of this.droppedMeshes.values()) this.itemRoot.remove(m);
    this.droppedMeshes.clear();
  }

  resize(width: number, height: number, pixelRatio: number): void {
    this.height = height;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.viewModel.setAspect(width / height);
    this.effects.setViewport(height * pixelRatio, this.camera.fov);
  }

  private setFirstPerson(a: Actor | null): void {
    if (this.hiddenActor === a) return;
    if (this.hiddenActor) this.hiddenActor.model.setLayer(0);
    this.hiddenActor = a;
    if (a) a.model.setLayer(LAYER_FIRST_PERSON);
    // tags live under model roots; keep them on the normal layer for others
    for (const [id, tag] of this.nameTags) tag.layers.set(a && a.id === id ? LAYER_FIRST_PERSON : 0);
  }

  /** Interpolate actors between ticks and draw a frame. */
  render(dt: number, alpha: number, view: CameraView, vm: ViewModelState | null): void {
    const world = this.world;
    if (!world) return;

    // ---- actors
    for (const a of world.actors) {
      const p = this.tmpPos.lerpVectors(a.prevPos, a.pos, alpha);
      const yaw = a.isBot ? lerpAngle(a.prevYaw, a.yaw, alpha) : a.yaw;
      const pitch = a.isBot ? lerp(a.prevPitch, a.pitch, alpha) : a.pitch;
      world.poseActor(a, p, yaw, pitch);
      const tag = this.nameTags.get(a.id);
      if (tag) tag.visible = a.alive;
    }
    this.setFirstPerson(view.firstPerson);

    // ---- items
    this.syncItems(world);

    // ---- camera
    const cam = this.camera;
    cam.position.copy(view.pos);
    cam.rotation.set(view.pitch, view.yaw, view.roll, 'YXZ');
    if (Math.abs(cam.fov - view.fov) > 0.01) {
      cam.fov = view.fov;
      cam.updateProjectionMatrix();
      this.effects.setViewport(this.height * this.renderer.getPixelRatio(), cam.fov);
    }
    cam.updateMatrixWorld();
    this.sky.position.copy(cam.position);

    this.effects.update(dt, cam);

    const r = this.renderer;
    r.autoClear = true;
    r.render(this.scene, cam);
    if (vm) {
      this.viewModel.update(dt, vm);
      r.autoClear = false;
      r.clearDepth();
      r.render(this.viewModel.scene, this.viewModel.camera);
      r.autoClear = true;
    }
  }

  private syncItems(world: World): void {
    // dropped guns
    const alive = new Set<number>();
    for (const it of world.dropped) {
      alive.add(it.id);
      let m = this.droppedMeshes.get(it.id);
      if (!m) {
        const model = createWeaponModel(it.inst.def.id);
        m = new THREE.Group();
        model.root.rotation.set(0, 0, Math.PI / 2);
        model.root.position.y = 0.04;
        m.add(model.root);
        if (WEAPONS[it.inst.def.id].kind === 'rifle' || WEAPONS[it.inst.def.id].kind === 'sniper') model.root.scale.setScalar(0.92);
        this.droppedMeshes.set(it.id, m);
        this.itemRoot.add(m);
      }
      m.position.copy(it.pos);
      m.rotation.y = it.yaw;
    }
    for (const [id, m] of this.droppedMeshes) {
      if (!alive.has(id)) {
        this.itemRoot.remove(m);
        this.droppedMeshes.delete(id);
      }
    }
    // bomb
    const b = world.bomb;
    const show = b.state === 'dropped' || b.state === 'planted' || b.state === 'defused';
    this.bombObj.visible = show;
    if (show) {
      this.bombObj.position.copy(b.pos);
      const blink = b.state === 'planted' && world.time % Math.max(0.12, Math.min(1, b.timeLeft / 40)) < 0.06;
      (this.bombLed.material as THREE.MeshBasicMaterial).color.setHex(b.state === 'defused' ? 0x20ff40 : blink ? 0xff3030 : 0x401010);
    }
  }

  /** True if the point is in the sun's shadow (used to light the view model). */
  inShadow(p: THREE.Vector3): boolean {
    const w = this.world;
    if (!w) return false;
    return !w.collision.lineClear(p.x, p.y, p.z, p.x + SUN_DIR.x * 60, p.y + SUN_DIR.y * 60, p.z + SUN_DIR.z * 60);
  }

  dispose(): void {
    this.effects.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

function makeNameTag(name: string, color: string): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = 'bold 30px "Segoe UI", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,0.75)';
  ctx.strokeText(name, 128, 32);
  ctx.fillStyle = color;
  ctx.fillText(name, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, sizeAttenuation: false }));
  s.scale.set(0.09, 0.0225, 1);
  s.renderOrder = 5;
  return s;
}
