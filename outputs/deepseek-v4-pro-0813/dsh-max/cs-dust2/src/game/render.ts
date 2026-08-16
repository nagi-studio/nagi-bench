// 渲染层：three.js 场景同步（地图、人形动画、第一人称手持、弹道、特效、观战镜头）
import * as THREE from 'three';
import { WEAPONS } from './config';
import { Combatant, EffectEvent, Game, HudState } from './engine';
import { doorDef, doorPanels, renderBoxes, sites } from './map';
import { buildBombModel, buildHumanoid, Humanoid } from './models';
import { buildBombViewmodel, buildViewmodel, Viewmodel } from './viewmodel';

interface Tracer {
  mesh: THREE.Mesh;
  life: number;
  max: number;
}
interface Blood {
  mesh: THREE.Mesh;
  life: number;
}
interface Flash {
  mesh: THREE.Mesh;
  life: number;
}

const SKY = 0x9fc4de;
const GROUND = 0x8f8a72;
const FOG = 0xb9c6c8;

export class Renderer {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  private game: Game;
  private wrap = new Map<number, { wrap: THREE.Group; humanoid: Humanoid; lastY: number; deadT: number }>();
  private viewmodels = new Map<string, Viewmodel>();
  private vmHolder: THREE.Group;
  private vmBomb: THREE.Group;
  private doorGroup!: THREE.Group;
  private doorRot = 0;
  private bombMesh!: THREE.Group;
  private bombLight!: THREE.Mesh;
  private tracers: Tracer[] = [];
  private bloods: Blood[] = [];
  private flashes: Flash[] = [];
  private explosion: THREE.Mesh;
  private explosionLight: THREE.PointLight;
  private explosionT = -1;
  private sun: THREE.DirectionalLight;
  private camShake = 0;
  private shakeX = 0;
  private shakeY = 0;
  private time = 0;
  private fog: THREE.Fog;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.game = game;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SKY);
    this.fog = new THREE.Fog(FOG, 40, 140);
    this.scene.fog = this.fog;
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.08, 300);
    this.camera.rotation.order = 'YXZ';
    this.scene.add(this.camera);

    // 灯光
    const hemi = new THREE.HemisphereLight(0xcfe4f2, 0x6d6350, 0.85);
    this.scene.add(hemi);
    this.sun = new THREE.DirectionalLight(0xfff1d6, 1.35);
    this.sun.position.set(40, 70, 20);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -90;
    this.sun.shadow.camera.right = 90;
    this.sun.shadow.camera.top = 90;
    this.sun.shadow.camera.bottom = -90;
    this.sun.shadow.camera.far = 260;
    this.sun.shadow.bias = -0.0004;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.buildWorld();

    // 第一人称手持
    this.vmHolder = new THREE.Group();
    this.camera.add(this.vmHolder);
    this.vmBomb = buildBombViewmodel();
    this.vmBomb.visible = false;
    this.vmHolder.add(this.vmBomb);

    // 爆炸特效
    this.explosion = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.9, depthWrite: false })
    );
    this.explosion.visible = false;
    this.scene.add(this.explosion);
    this.explosionLight = new THREE.PointLight(0xff8a30, 0, 40);
    this.scene.add(this.explosionLight);
  }

  private buildWorld(): void {
    // 静态墙体
    for (const b of renderBoxes) {
      const w = b.x1 - b.x0, h = b.y1 - b.y0, d = b.z1 - b.z0;
      if (w <= 0.001 || h <= 0.001 || d <= 0.001) continue;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ color: new THREE.Color(b.color) })
      );
      mesh.position.set((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.z0 + b.z1) / 2);
      mesh.castShadow = !b.step;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    // 地面
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 240),
      new THREE.MeshLambertMaterial({ color: GROUND })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(3, -0.06, 0);
    ground.receiveShadow = true;
    this.scene.add(ground);
    // 包点地面标识
    for (const key of ['A', 'B'] as const) {
      const s = sites[key];
      const pad = new THREE.Mesh(
        new THREE.PlaneGeometry(s.x1 - s.x0, s.z1 - s.z0),
        new THREE.MeshBasicMaterial({ color: key === 'A' ? 0xc39a4a : 0x4a7ac3, transparent: true, opacity: 0.35, depthWrite: false })
      );
      pad.rotation.x = -Math.PI / 2;
      pad.position.set((s.x0 + s.x1) / 2, 1.205, (s.z0 + s.z1) / 2);
      this.scene.add(pad);
    }
    // 中门（双开）
    this.doorGroup = new THREE.Group();
    const doorMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(doorDef.color) });
    for (const p of doorPanels) {
      const pivot = new THREE.Group();
      const w = p.x1 - p.x0;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, doorDef.y1 - doorDef.y0, 0.09), doorMat);
      mesh.position.set(w / 2, (doorDef.y0 + doorDef.y1) / 2, 0);
      mesh.castShadow = true;
      pivot.add(mesh);
      pivot.position.set(p.x0, 0, (doorDef.z0 + doorDef.z1) / 2);
      this.doorGroup.add(pivot);
      (pivot.userData as { hinge: number }).hinge = p.hinge;
      this.doorGroup.userData.pivots = this.doorGroup.userData.pivots || [];
      (this.doorGroup.userData.pivots as THREE.Group[]).push(pivot);
    }
    this.scene.add(this.doorGroup);
    // C4
    this.bombMesh = buildBombModel();
    this.bombLight = this.bombMesh.children[1] as THREE.Mesh;
    this.bombMesh.visible = false;
    this.scene.add(this.bombMesh);
    // 人形
    for (const c of this.game.combatants) this.addCombatant(c);
    // 特效池
    const tracerMat = new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.85, depthWrite: false });
    for (let i = 0; i < 48; i++) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.022, 1), tracerMat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.tracers.push({ mesh, life: 0, max: 0.09 });
    }
    const bloodMat = new THREE.MeshBasicMaterial({ color: 0xb02218, transparent: true, opacity: 0.9, depthWrite: false });
    for (let i = 0; i < 48; i++) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), bloodMat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.bloods.push({ mesh, life: 0 });
    }
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffe8a0, transparent: true, opacity: 0.95, depthWrite: false });
    for (let i = 0; i < 24; i++) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), flashMat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.flashes.push({ mesh, life: 0 });
    }
  }

  private addCombatant(c: Combatant): void {
    const humanoid = buildHumanoid(c.team);
    const wrap = new THREE.Group();
    wrap.add(humanoid.group);
    this.scene.add(wrap);
    this.wrap.set(c.id, { wrap, humanoid, lastY: c.pos.y, deadT: 0 });
  }

  /** 复用画布与场景：切换到一局新比赛 */
  reset(game: Game): void {
    for (const [, w] of this.wrap) this.scene.remove(w.wrap);
    this.wrap.clear();
    for (const c of game.combatants) this.addCombatant(c);
    this.game = game;
    this.bombMesh.visible = false;
    this.vmHolder.visible = false;
    this.doorRot = 0;
    this.explosionT = -1;
    this.explosion.visible = false;
    this.explosionLight.intensity = 0;
    this.camShake = 0;
  }

  resize(w: number, h: number): void {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private curWeapon(c: Combatant) {
    const id = c.slots[c.curSlot];
    return id ? WEAPONS[id] : null;
  }

  private getViewmodel(id: string): Viewmodel {
    let vm = this.viewmodels.get(id);
    if (!vm) {
      vm = buildViewmodel(id as never);
      this.viewmodels.set(id, vm);
      this.vmHolder.add(vm.group);
      vm.group.visible = false;
    }
    return vm;
  }

  addShake(amount: number): void {
    this.camShake = Math.min(0.6, this.camShake + amount);
  }

  private spawnEffects(events: EffectEvent[], pc: Combatant | null): void {
    const rng = Math.random;
    for (const ev of events) {
      switch (ev.type) {
        case 'tracer': {
          const x0 = ev.x, y0 = ev.y ?? 0, z0 = ev.z ?? 0;
          const x1 = ev.x2, y1 = ev.y2 ?? y0, z1 = ev.z2;
          if (x0 === undefined || x1 === undefined || z1 === undefined) break;
          const t = this.tracers.find((x) => x.life <= 0) ?? this.tracers[0];
          const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
          const len = Math.hypot(dx, dy, dz) || 1;
          t.mesh.scale.set(1, 1, len);
          t.mesh.position.set(x0 + dx / 2, y0 + dy / 2, z0 + dz / 2);
          t.mesh.lookAt(x1, y1, z1);
          t.mesh.visible = true;
          t.life = t.max;
          break;
        }
        case 'blood': {
          if (ev.x === undefined) break;
          const b = this.bloods.find((x) => x.life <= 0) ?? this.bloods[0];
          b.mesh.position.set(ev.x, ev.y ?? 1.2, ev.z ?? 0);
          b.mesh.rotation.set(rng() * Math.PI, rng() * Math.PI, 0);
          b.mesh.visible = true;
          b.life = 0.5;
          break;
        }
        case 'muzzle': {
          if (ev.x === undefined) break;
          const f = this.flashes.find((x) => x.life <= 0) ?? this.flashes[0];
          f.mesh.position.set(ev.x, ev.y ?? 1.5, ev.z ?? 0);
          f.mesh.rotation.z = rng() * Math.PI;
          f.mesh.visible = true;
          f.life = 0.06;
          break;
        }
        case 'explosion': {
          if (ev.x !== undefined) {
            this.explosion.position.set(ev.x, ev.y ?? 1, ev.z ?? 0);
            this.explosionLight.position.set(ev.x, (ev.y ?? 1) + 1.5, ev.z ?? 0);
            this.explosion.visible = true;
            this.explosionT = 0;
            this.addShake(0.5);
          }
          break;
        }
        default:
          break;
      }
    }
    // 自己开枪：枪口火光 + 后坐镜头
    if (pc) {
      const w = this.curWeapon(pc);
      if (w && pc.anim.fireFlash > 0) {
        const vm = this.getViewmodel(w.id);
        if (vm) vm.flash.visible = pc.anim.fireFlash > 0;
      }
    }
  }

  frame(dt: number, hud: HudState, events: EffectEvent[]): void {
    this.time += dt;
    const game = this.game;
    const view = game.viewCombatant();
    const isPlayer = view !== null && view.isPlayer && view.alive;
    const pc = game.combatants[game.playerIdx] ?? null;

    // 中门摆动
    const targetRot = game.doorOpen ? 1.25 : 0;
    this.doorRot += (targetRot - this.doorRot) * Math.min(1, dt * 6);
    const pivots = (this.doorGroup.userData.pivots as THREE.Group[]) ?? [];
    for (const p of pivots) {
      p.rotation.y = (p.userData as { hinge: number }).hinge === -1 ? -this.doorRot : this.doorRot;
    }

    // 人形同步
    for (const c of game.combatants) {
      const w = this.wrap.get(c.id);
      if (!w) continue;
      // 第一人称时隐藏玩家自身模型（避免头部遮挡镜头）
      w.wrap.visible = !(c.isPlayer && c.alive);
      w.wrap.position.set(c.pos.x, c.pos.y, c.pos.z);
      w.wrap.rotation.y = c.yaw;
      const h = w.humanoid;
      if (c.alive) {
        h.group.rotation.x = 0;
        h.group.position.y = 0;
        w.deadT = 0;
        // 移动动画
        const speed = c.anim.speed;
        const amp = Math.min(1, speed / 5) * 0.7;
        const ph = c.anim.movePhase;
        h.legL.rotation.x = Math.sin(ph) * amp;
        h.legR.rotation.x = -Math.sin(ph) * amp;
        h.shinL.rotation.x = Math.max(0, -Math.sin(ph)) * amp * 0.8;
        h.shinR.rotation.x = Math.max(0, Math.sin(ph)) * amp * 0.8;
        h.armL.rotation.x = 0.4 * amp * Math.sin(ph + Math.PI);
        h.armR.rotation.x = -0.4 * amp * Math.sin(ph + Math.PI);
        // 瞄准
        h.torso.rotation.x = c.pitch * 0.75;
        // 下蹲（下包/拆包）
        const crouch = Math.max(c.anim.crouch, c.anim.state === 'plant' || c.anim.state === 'defuse' ? 1 : 0);
        h.group.scale.y = 1 - crouch * 0.22;
        h.group.position.y = -crouch * 0.32;
        h.headlight.visible = false;
      } else {
        w.deadT = Math.min(1, w.deadT + dt * 2.5);
        h.group.rotation.x = -w.deadT * Math.PI * 0.5;
        h.group.scale.y = 1;
        h.group.position.y = 0;
        h.headlight.visible = c.team !== game.combatants[game.playerIdx]?.team;
      }
      // 头顶标记（队友）
      if (c.alive && c.team === (pc ? pc.team : 'T') && !c.isPlayer) {
        h.headlight.visible = true;
      }
    }

    // C4
    const bomb = game.bomb;
    if (bomb.state === 'carried') {
      const carrier = game.combatants.find((c) => c.id === bomb.carrierId);
      if (carrier) {
        this.bombMesh.visible = true;
        this.bombMesh.position.set(
          carrier.pos.x + Math.sin(carrier.yaw) * 0.22,
          carrier.pos.y + 1.05,
          carrier.pos.z + Math.cos(carrier.yaw) * 0.22
        );
        this.bombMesh.rotation.y = carrier.yaw;
        (this.bombLight.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.15;
      }
    } else {
      this.bombMesh.visible = true;
      this.bombMesh.position.set(bomb.x, bomb.y, bomb.z);
      this.bombMesh.rotation.y += dt * 0.5;
      const blink = bomb.state === 'planted' && Math.sin(this.time * 8) > 0;
      (this.bombLight.material as THREE.MeshLambertMaterial).emissiveIntensity = blink ? 2.2 : 0.6;
    }

    // 特效
    this.spawnEffects(events, pc);
    this.updateEffects(dt);

    // 镜头
    let eyePos = view ? { x: view.pos.x, y: view.pos.y + 1.62, z: view.pos.z } : { x: 0, y: 1.6, z: 0 };
    let yaw = view ? view.yaw : 0;
    let pitch = view ? view.pitch : 0;
    if (!view) {
      // 无观察对象（比赛未开始）：菜单镜头俯瞰中路
      eyePos = { x: 0, y: 18, z: -20 };
      yaw = 0;
      pitch = -0.6;
    } else if (!isPlayer) {
      // 死亡观战：第三人称跟随
      const dist = 3.4;
      const fx = -Math.sin(view.yaw), fz = -Math.cos(view.yaw);
      eyePos = {
        x: view.pos.x - fx * dist,
        y: view.pos.y + 1.9,
        z: view.pos.z - fz * dist,
      };
      yaw = view.yaw;
      pitch = Math.atan2((view.pos.y + 1.4) - eyePos.y, dist);
    }
    // 相机抖动
    if (this.camShake > 0) {
      this.camShake = Math.max(0, this.camShake - dt * 2.2);
      this.shakeX = (Math.random() - 0.5) * this.camShake * 0.5;
      this.shakeY = (Math.random() - 0.5) * this.camShake * 0.5;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
    this.camera.position.set(eyePos.x + this.shakeX, eyePos.y + this.shakeY, eyePos.z);
    this.camera.rotation.y = yaw;
    this.camera.rotation.x = pitch;
    // AWP 开镜 FOV
    const w = view ? this.curWeapon(view) : null;
    const baseFov = 75;
    let fov = baseFov;
    if (w && w.id === 'awp' && view && view.zoom > 0 && w.zoomFovs) {
      const zf = w.zoomFovs[Math.min(view.zoom, w.zoomFovs.length - 1)];
      fov += (zf - fov) * Math.min(1, dt * 14);
    } else {
      fov += (baseFov - fov) * Math.min(1, dt * 10);
    }
    if (Math.abs(fov - this.camera.fov) > 0.01) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }

    // 第一人称手持
    if (isPlayer && view) {
      this.vmHolder.visible = true;
      const wp = this.curWeapon(view);
      const vm = wp ? this.getViewmodel(wp.id) : null;
      for (const v of this.viewmodels.values()) v.group.visible = false;
      if (vm) {
        vm.group.visible = true;
        vm.group.visible = view.curSlot !== 'bomb';
      }
      this.vmBomb.visible = view.curSlot === 'bomb' && view.carriesBomb;
      if (vm) {
        // 后坐与摆动
        const rec = view.recoil;
        const sway = Math.sin(this.time * 1.7) * 0.004;
        const sway2 = Math.cos(this.time * 1.3) * 0.003;
        const speed = Math.hypot(view.vel.x, view.vel.z);
        vm.group.position.set(
          0.24 + sway + Math.min(0.04, speed * 0.006) * Math.sin(this.time * 9),
          -0.24 + sway2 + Math.min(0.04, speed * 0.006) * Math.cos(this.time * 8),
          -0.42 + rec * 0.02
        );
        vm.group.rotation.set(rec * 0.03, 0, 0);
        vm.flash.visible = view.anim.fireFlash > 0;
        // 换弹：下压
        if (view.reloading) {
          vm.group.rotation.x += 0.7;
          vm.group.position.y -= 0.08;
        }
      }
      // 开镜时隐藏手持（狙击镜内只有准星）
      if (w && w.id === 'awp' && view.zoom > 0) this.vmHolder.visible = false;
    } else {
      this.vmHolder.visible = false;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private updateEffects(dt: number): void {
    for (const t of this.tracers) {
      if (t.life > 0) {
        t.life -= dt;
        (t.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, t.life / t.max) * 0.85;
        if (t.life <= 0) t.mesh.visible = false;
      }
    }
    for (const b of this.bloods) {
      if (b.life > 0) {
        b.life -= dt;
        (b.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, b.life / 0.5) * 0.9;
        b.mesh.position.y -= dt * 0.3;
        if (b.life <= 0) b.mesh.visible = false;
      }
    }
    for (const f of this.flashes) {
      if (f.life > 0) {
        f.life -= dt;
        (f.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, f.life / 0.06);
        if (f.life <= 0) f.mesh.visible = false;
      }
    }
    if (this.explosionT >= 0) {
      this.explosionT += dt;
      const k = this.explosionT / 0.8;
      if (k >= 1) {
        this.explosion.visible = false;
        this.explosionLight.intensity = 0;
        this.explosionT = -1;
      } else {
        const s = 1 + k * 9;
        this.explosion.scale.setScalar(s);
        (this.explosion.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - k);
        this.explosionLight.intensity = (1 - k) * 22;
      }
    }
  }

  /** 瞄准线命中点（供准星判定） */
  dispose(): void {
    this.renderer.dispose();
  }
}
