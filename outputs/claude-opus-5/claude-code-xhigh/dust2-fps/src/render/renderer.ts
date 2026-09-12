/**
 * 渲染层：把引擎状态映射到 three.js 场景。
 *
 * 与模拟层的耦合只有两条单向通道：
 *   1. 每帧读引擎的 actors/bomb 做插值绘制（只读，不写）
 *   2. 消费 engine.drainEvents() 产生特效
 * 所以模拟层完全不知道渲染层的存在，headless 跑测试才成立。
 *
 * 第一人称手持模型放在独立的 scene/camera 里，用 clearDepth 分两趟渲染，
 * 这样贴墙时枪不会插进墙里。
 */

import * as THREE from 'three';
import { clamp, damp, lerp, wrapAngle } from '../core/math.ts';
import type { GameEngine } from '../game/engine.ts';
import type { Actor } from '../game/actor.ts';
import { activeWeapon, activeWeaponDef } from '../game/actor.ts';
import type { GameEvent } from '../game/events.ts';
import { WEAPONS } from '../game/weapons.ts';
import type { WeaponDef } from '../game/weapons.ts';
import { buildMapMeshes, buildEnvironment } from './mapMesh.ts';
import type { MapMeshes } from './mapMesh.ts';
import { PALETTES, createCharacter, poseCharacter, setCharacterWeapon } from './character.ts';
import type { Character } from './character.ts';
import { buildPlantedBomb, buildViewHands, buildWeaponModel } from './weaponModel.ts';
import { EffectSystem } from './effects.ts';
import { skyTexture } from './textures.ts';

export interface RenderSettings {
  fov: number;
  shadows: boolean;
  viewmodel: boolean;
}

export const DEFAULT_SETTINGS: RenderSettings = {
  fov: 90,
  shadows: true,
  viewmodel: true,
};

interface ViewModelState {
  group: THREE.Group;
  weaponHolder: THREE.Group;
  hands: THREE.Group | null;
  flash: THREE.Mesh;
  flashTimer: number;
  weaponId: string;
  /** 后坐力位移/旋转 */
  kick: number;
  kickRot: number;
  bobPhase: number;
  swayX: number;
  swayY: number;
  lastYaw: number;
  lastPitch: number;
  reloadAnim: number;
}

export class GameRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private viewScene = new THREE.Scene();
  private viewCamera: THREE.PerspectiveCamera;
  private mapMeshes: MapMeshes;
  private effects = new EffectSystem();
  private characters = new Map<number, Character>();
  private vm: ViewModelState;
  private bombGroup: THREE.Group;
  private bombLight: THREE.Mesh;
  private sun: THREE.DirectionalLight;
  private settings: RenderSettings;

  /** 受击/爆炸时的镜头抖动 */
  private shake = 0;
  private shakeSeed = 0;
  /** 平滑后的开镜程度，用于 FOV 过渡 */
  private scopeBlend = 0;
  private time = 0;

  constructor(canvas: HTMLCanvasElement, engine: GameEngine, settings = DEFAULT_SETTINGS) {
    this.settings = { ...settings };

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = this.settings.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.camera = new THREE.PerspectiveCamera(this.settings.fov, 1, 0.06, 500);
    this.camera.rotation.order = 'YXZ';

    this.viewCamera = new THREE.PerspectiveCamera(65, 1, 0.01, 8);

    // ---- 场景 ----
    this.scene.background = new THREE.Color(0x9dbdd8);
    this.scene.fog = new THREE.Fog(0xc9b184, 70, 260);

    // 亮度标定：three r155+ 之后灯光是物理正确的，强度直接相乘。
    // 沙地反射率约 0.78，向上表面收到的总照度控制在 ~1.2 左右，
    // 这样受光面接近 0.9 不过曝，背光面约 0.36 仍有层次。
    const hemi = new THREE.HemisphereLight(0xaed3f0, 0xb08d5f, 0.5);
    this.scene.add(hemi);
    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    this.scene.add(ambient);

    this.sun = new THREE.DirectionalLight(0xffeccd, 1.0);
    this.sun.position.set(70, 110, 45);
    this.sun.castShadow = this.settings.shadows;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -85;
    sc.right = 85;
    sc.top = 85;
    sc.bottom = -85;
    sc.near = 20;
    sc.far = 300;
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.03;
    // 改了正交视锥参数之后必须自己刷新投影矩阵，
    // 否则阴影相机会一直用默认的 ±5 米范围，只有脚下一小块有阴影
    sc.updateProjectionMatrix();
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.mapMeshes = buildMapMeshes(engine.map.world);
    this.scene.add(this.mapMeshes.group);
    this.scene.add(buildEnvironment(skyTexture()));
    this.scene.add(this.effects.group);

    const bomb = buildPlantedBomb();
    this.bombGroup = bomb.group;
    this.bombLight = bomb.light;
    this.bombGroup.visible = false;
    this.scene.add(this.bombGroup);

    // ---- 第一人称模型 ----
    // 手持模型单独打光：枪身颜色很深，需要比场景亮一些才看得清细节
    this.viewScene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const vmLight = new THREE.DirectionalLight(0xfff0d8, 1.2);
    vmLight.position.set(-0.6, 1.2, 0.8);
    this.viewScene.add(vmLight);
    const vmBack = new THREE.DirectionalLight(0x99b6d8, 0.35);
    vmBack.position.set(0.8, -0.4, -1);
    this.viewScene.add(vmBack);

    const group = new THREE.Group();
    const weaponHolder = new THREE.Group();
    group.add(weaponHolder);
    this.viewScene.add(group);

    const flashGeo = new THREE.PlaneGeometry(0.3, 0.3);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffd08a,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.visible = false;
    weaponHolder.add(flash);

    this.vm = {
      group,
      weaponHolder,
      hands: null,
      flash,
      flashTimer: 0,
      weaponId: '',
      kick: 0,
      kickRot: 0,
      bobPhase: 0,
      swayX: 0,
      swayY: 0,
      lastYaw: 0,
      lastPitch: 0,
      reloadAnim: 0,
    };
  }

  applySettings(s: Partial<RenderSettings>): void {
    Object.assign(this.settings, s);
    this.camera.fov = this.settings.fov;
    this.camera.updateProjectionMatrix();
    this.renderer.shadowMap.enabled = this.settings.shadows;
    this.sun.castShadow = this.settings.shadows;
    this.vm.group.visible = this.settings.viewmodel;
    // 切换阴影后需要重编材质
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!m) return;
      if (Array.isArray(m)) m.forEach((x) => (x.needsUpdate = true));
      else m.needsUpdate = true;
    });
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.viewCamera.aspect = width / height;
    this.viewCamera.updateProjectionMatrix();
  }

  /* ------------------------------------------------------------------ */

  /**
   * 每个渲染帧调用一次。
   * events 由外层游戏循环统一 drain 之后分发给渲染和音频，
   * 避免两个消费者互相把事件抢空。
   */
  sync(engine: GameEngine, dt: number, events: GameEvent[]): void {
    this.time += dt;
    const alpha = engine.alpha;
    const view = engine.viewActor;

    this.consumeEvents(engine, events, view);
    this.syncCharacters(engine, alpha, view);
    this.syncBomb(engine);
    this.syncCamera(engine, view, alpha, dt);
    this.syncViewModel(engine, view, dt);
    this.effects.update(dt);

    // 阴影相机跟着玩家走，保证附近阴影精度
    if (view) {
      this.sun.target.position.set(view.pos.x, 0, view.pos.z);
      this.sun.position.set(view.pos.x + 70, 110, view.pos.z + 45);
      this.sun.target.updateMatrixWorld();
    }
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
    if (this.settings.viewmodel) {
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.viewScene, this.viewCamera);
      this.renderer.autoClear = true;
    }
  }

  /* ------------------------------------------------------------------ */

  private consumeEvents(engine: GameEngine, events: GameEvent[], view: Actor | null): void {
    for (const e of events) {
      switch (e.type) {
        case 'shot': {
          if (e.actorId === view?.id) {
            const def = WEAPONS[e.weapon];
            this.vm.kick = Math.min(1, this.vm.kick + (def.recoilV > 0.03 ? 1 : 0.55));
            this.vm.kickRot = Math.min(1, this.vm.kickRot + 0.8);
            if (def.slot !== 'melee') this.triggerViewFlash(def);
            this.shake = Math.min(0.6, this.shake + (def.id === 'awp' ? 0.5 : 0.16));
          } else if (WEAPONS[e.weapon].slot !== 'melee') {
            this.effects.muzzle(e.x, e.y, e.z, e.dx, e.dy, e.dz);
          }
          break;
        }
        case 'tracer':
          this.effects.tracers.spawn(e.x0, e.y0, e.z0, e.x1, e.y1, e.z1);
          break;
        case 'impact':
          this.effects.impact(e.x, e.y, e.z, e.nx, e.ny, e.nz, e.surface);
          break;
        case 'hit': {
          const dir = this.hitDir(engine, e.attackerId, e.x, e.y, e.z);
          this.effects.blood(e.x, e.y, e.z, dir.x, dir.y, dir.z);
          if (e.victimId === view?.id) this.shake = Math.min(0.9, this.shake + e.damage / 90);
          break;
        }
        case 'bomb':
          if (e.kind === 'exploded') {
            this.effects.explosion(e.x, e.y, e.z);
            this.shake = 1.4;
          }
          break;
        default:
          break;
      }
    }
  }

  private tmpDir = new THREE.Vector3();

  private hitDir(engine: GameEngine, attackerId: number, x: number, y: number, z: number) {
    const at = engine.actorById(attackerId);
    if (!at) return this.tmpDir.set(0, 1, 0);
    return this.tmpDir.set(x - at.pos.x, y - (at.pos.y + at.eyeHeight), z - at.pos.z).normalize();
  }

  private syncCharacters(engine: GameEngine, alpha: number, view: Actor | null): void {
    for (const a of engine.actors) {
      let c = this.characters.get(a.id);
      if (!c) {
        c = createCharacter(a.team);
        this.characters.set(a.id, c);
        this.scene.add(c.root);
      }
      // 自己的模型不画（第一人称就在他脑袋里）
      const isView = view != null && a.id === view.id;
      c.root.visible = !isView;
      if (isView) continue;

      const x = lerp(a.prevPos.x, a.pos.x, alpha);
      const y = lerp(a.prevPos.y, a.pos.y, alpha);
      const z = lerp(a.prevPos.z, a.pos.z, alpha);
      c.root.position.set(x, y, z);
      c.root.rotation.y = a.prevYaw + wrapAngle(a.yaw - a.prevYaw) * alpha;

      const def = activeWeaponDef(a);
      setCharacterWeapon(c, def);

      poseCharacter(c, {
        speed: a.speed,
        maxSpeed: def.moveSpeed,
        animPhase: a.animPhase,
        pitch: clamp(a.pitch, -0.9, 0.9),
        crouch: clamp((1.8 - a.height) / 0.48, 0, 1),
        alive: a.alive,
        deathTime: a.deathTime,
        time: this.time,
      });
    }
  }

  private syncBomb(engine: GameEngine): void {
    const b = engine.bomb;
    const show = b.phase === 'planted' || b.phase === 'dropped' || b.phase === 'defused';
    this.bombGroup.visible = show;
    if (!show) return;
    this.bombGroup.position.set(b.pos.x, b.pos.y, b.pos.z);
    const mat = this.bombLight.material as THREE.MeshBasicMaterial;
    if (b.phase === 'planted') {
      // 越接近爆炸闪得越快
      const rate = b.timer > 20 ? 1.2 : b.timer > 10 ? 3 : b.timer > 4 ? 6 : 12;
      const on = Math.sin(this.time * rate * Math.PI) > 0;
      mat.color.setHex(on ? 0xff2020 : 0x401010);
    } else if (b.phase === 'defused') {
      mat.color.setHex(0x20ff40);
    } else {
      mat.color.setHex(0x808080);
    }
  }

  private syncCamera(engine: GameEngine, view: Actor | null, alpha: number, dt: number): void {
    if (!view) return;
    const def = activeWeaponDef(view);

    const x = lerp(view.prevPos.x, view.pos.x, alpha);
    const y = lerp(view.prevPos.y, view.pos.y, alpha);
    const z = lerp(view.prevPos.z, view.pos.z, alpha);

    // 开镜 FOV 过渡
    const targetScope = view.scoped && def.scope ? 1 : 0;
    this.scopeBlend = damp(this.scopeBlend, targetScope, 22, dt);
    const scopeFov = def.scope ? def.scope.fov : this.settings.fov;
    this.camera.fov = lerp(this.settings.fov, scopeFov, this.scopeBlend);
    this.camera.updateProjectionMatrix();

    // 抖动
    this.shake = Math.max(0, this.shake - dt * 3.2);
    this.shakeSeed += dt * 47;
    const sh = this.shake * this.shake * 0.05;
    const sx = Math.sin(this.shakeSeed * 1.7) * sh;
    const sy = Math.cos(this.shakeSeed * 2.3) * sh;

    this.camera.position.set(x + sx, y + view.eyeHeight + sy, z);
    this.camera.rotation.set(
      clamp(view.pitch + view.punchPitch, -1.55, 1.55) + sy * 0.4,
      view.yaw + view.punchYaw + sx * 0.4,
      0,
    );
  }

  private ensureViewWeapon(def: WeaponDef, team: 'T' | 'CT'): void {
    if (this.vm.weaponId === def.id) return;
    this.vm.weaponId = def.id;
    // 清掉旧的（保留 flash）
    for (const child of [...this.vm.weaponHolder.children]) {
      if (child !== this.vm.flash) this.vm.weaponHolder.remove(child);
    }
    const model = buildWeaponModel(def, false);
    this.vm.weaponHolder.add(model);
    const pal = PALETTES[team];
    const hands = buildViewHands(pal.glove, pal.uniform);
    this.vm.hands = hands;
    this.vm.weaponHolder.add(hands);
    this.vm.flash.position.set(def.muzzle[0], def.muzzle[1], def.muzzle[2] - 0.08);
  }

  private triggerViewFlash(def: WeaponDef): void {
    const f = this.vm.flash;
    f.visible = true;
    f.rotation.z = Math.random() * Math.PI;
    const s = def.slot === 'primary' ? 1.15 : 0.75;
    f.scale.setScalar(s * (0.85 + Math.random() * 0.4));
    (f.material as THREE.MeshBasicMaterial).opacity = 1;
    this.vm.flashTimer = 0.045;
  }

  private syncViewModel(engine: GameEngine, view: Actor | null, dt: number): void {
    const vm = this.vm;
    if (!view || !view.alive) {
      vm.group.visible = false;
      return;
    }
    vm.group.visible = this.settings.viewmodel;

    const def = activeWeaponDef(view);
    const ws = activeWeapon(view);
    this.ensureViewWeapon(def, view.team);

    // 枪口闪光衰减
    if (vm.flashTimer > 0) {
      vm.flashTimer -= dt;
      const m = vm.flash.material as THREE.MeshBasicMaterial;
      m.opacity = Math.max(0, vm.flashTimer / 0.045);
      if (vm.flashTimer <= 0) vm.flash.visible = false;
    }

    // 走路摇晃
    const moveAmt = clamp(view.speed / Math.max(1, def.moveSpeed), 0, 1);
    vm.bobPhase += dt * (4 + moveAmt * 9);
    const bobX = Math.sin(vm.bobPhase) * 0.012 * moveAmt;
    const bobY = Math.abs(Math.cos(vm.bobPhase)) * 0.014 * moveAmt;

    // 转视角时的滞后
    const dYaw = wrapAngle(view.yaw - vm.lastYaw);
    const dPitch = view.pitch - vm.lastPitch;
    vm.lastYaw = view.yaw;
    vm.lastPitch = view.pitch;
    vm.swayX = damp(vm.swayX, clamp(-dYaw * 2.2, -0.09, 0.09), 9, dt);
    vm.swayY = damp(vm.swayY, clamp(-dPitch * 2.2, -0.09, 0.09), 9, dt);

    // 后坐力回落
    vm.kick = damp(vm.kick, 0, 13, dt);
    vm.kickRot = damp(vm.kickRot, 0, 11, dt);

    // 换弹动作
    const reloadTarget = view.reloadTimer > 0 ? 1 : 0;
    vm.reloadAnim = damp(vm.reloadAnim, reloadTarget, 9, dt);
    const deploy = clamp(view.deployTimer / Math.max(0.01, def.deployTime), 0, 1);

    // 开镜时把枪拉到屏幕中间并缩小（2D 镜面遮罩由 UI 层负责）
    const scope = this.scopeBlend;
    const base = def.viewOffset;
    const px = lerp(base[0], 0, scope) + bobX + vm.swayX;
    const py = lerp(base[1], -0.055, scope) + bobY + vm.swayY - vm.kick * 0.02
      - vm.reloadAnim * 0.16 - deploy * 0.2;
    const pz = base[2] + vm.kick * 0.06 + scope * 0.14;

    vm.group.position.set(px, py, pz);
    vm.group.rotation.set(
      -vm.kickRot * 0.14 + vm.reloadAnim * 0.55 + deploy * 0.7,
      vm.swayX * 1.4 + vm.reloadAnim * 0.35,
      vm.swayY * 0.8 + vm.reloadAnim * 0.3,
    );
    // 开镜到一定程度后隐藏模型，避免挡住镜片
    vm.group.visible = this.settings.viewmodel && scope < 0.72;

    if (vm.hands) vm.hands.visible = def.slot !== 'bomb';
    void ws;
  }

  /* ------------------------------------------------------------------ */

  dispose(): void {
    this.mapMeshes.dispose();
    this.effects.dispose();
    this.renderer.dispose();
    this.characters.clear();
  }
}
