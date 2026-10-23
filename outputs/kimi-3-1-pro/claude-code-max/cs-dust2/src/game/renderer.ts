import * as THREE from 'three';
import { createCharacter, createViewArms, createWeaponModel, disposeCharacterShared } from './characters';
import type { CharacterRig } from './characters';
import type { MapData } from './map';
import { eyePosition } from './physics';
import type { Actor, BombState, Team, WeaponId } from './types';
import { WEAPONS, weaponForSlot } from './weapons';

interface Tracer {
  line: THREE.Line;
  life: number;
  maxLife: number;
}

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  gravity: number;
}

export class WorldRenderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(72, 1, 0.05, 180);
  private viewScene = new THREE.Scene();
  private viewCamera = new THREE.PerspectiveCamera(68, 1, 0.01, 12);
  private viewRoot = new THREE.Group();
  private viewWeapon: THREE.Group | null = null;
  private viewWeaponCache = new Map<WeaponId, THREE.Group>();
  private viewWeaponId: WeaponId | null = null;
  private viewTeam: Team | null = null;
  private viewArms: ReturnType<typeof createViewArms> | null = null;
  private muzzleFlash: THREE.Mesh;
  private muzzleLight: THREE.PointLight;
  private rigs = new Map<string, CharacterRig>();
  private bombModel = new THREE.Group();
  private bombLight: THREE.Mesh;
  private tracers: Tracer[] = [];
  private particles: Particle[] = [];
  private weaponKick = 0;
  private muzzleTime = 0;
  private shake = 0;
  private currentViewId = '';
  private particleGeometry = new THREE.BoxGeometry(0.045, 0.045, 0.045);

  constructor(private container: HTMLElement, private map: MapData) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;
    this.renderer.domElement.id = 'game-canvas';
    this.renderer.domElement.setAttribute('aria-label', 'Sandline Strike 3D game view');
    container.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0x8eabb6);
    this.scene.fog = new THREE.Fog(0xb5b09c, 50, 125);
    this.scene.add(map.group);
    const hemisphere = new THREE.HemisphereLight(0xc9e5f2, 0x695136, 2.0);
    this.scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xffdfae, 3.1);
    sun.position.set(-32, 54, 24);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -58;
    sun.shadow.camera.right = 58;
    sun.shadow.camera.top = 58;
    sun.shadow.camera.bottom = -58;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 130;
    sun.shadow.bias = -0.00022;
    this.scene.add(sun);

    // Sparse procedural skyline beyond the playable perimeter.
    const skylineMaterial = new THREE.MeshStandardMaterial({ color: 0x9b835e, roughness: 1 });
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 66 + (i % 4) * 6;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(7 + (i % 3) * 3, 9 + (i % 5) * 2, 8), skylineMaterial);
      tower.position.set(Math.cos(angle) * radius, tower.geometry.parameters.height / 2 - 1, Math.sin(angle) * radius);
      tower.rotation.y = angle + 0.4;
      tower.receiveShadow = true;
      this.scene.add(tower);
    }

    this.viewScene.add(new THREE.HemisphereLight(0xe8f2f4, 0x4c3c2b, 2.5));
    const viewLight = new THREE.DirectionalLight(0xffe2b7, 2.4);
    viewLight.position.set(-2, 3, 2);
    this.viewScene.add(viewLight);
    this.viewScene.add(this.viewRoot);
    this.muzzleFlash = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.11, 0),
      new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true, opacity: 0.95 }),
    );
    this.muzzleFlash.scale.set(0.7, 0.7, 2.5);
    this.muzzleFlash.visible = false;
    this.muzzleLight = new THREE.PointLight(0xffa13a, 0, 2.5);
    this.viewScene.add(this.muzzleLight);

    const c4Body = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.20, 0.34),
      new THREE.MeshStandardMaterial({ color: 0x3d4635, roughness: 0.72, metalness: 0.18 }),
    );
    c4Body.castShadow = true;
    this.bombModel.add(c4Body);
    const c4Panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.025, 0.20),
      new THREE.MeshStandardMaterial({ color: 0x171d19, roughness: 0.5 }),
    );
    c4Panel.position.y = 0.115;
    this.bombModel.add(c4Panel);
    this.bombLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.035, 0.045),
      new THREE.MeshBasicMaterial({ color: 0xff3d24 }),
    );
    this.bombLight.position.set(0.12, 0.14, 0);
    this.bombModel.add(this.bombLight);
    for (const x of [-0.14, -0.07, 0]) {
      const wire = new THREE.Mesh(
        new THREE.TorusGeometry(0.10 + x * 0.1, 0.009, 5, 12, Math.PI),
        new THREE.MeshStandardMaterial({ color: x === -0.14 ? 0xc64232 : 0xd1b34d, roughness: 0.6 }),
      );
      wire.rotation.x = Math.PI / 2;
      wire.position.set(x, 0.1, 0.14);
      this.bombModel.add(wire);
    }
    this.scene.add(this.bombModel);
    this.resize();
  }

  resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.viewCamera.aspect = width / height;
    this.viewCamera.updateProjectionMatrix();
  }

  notifyShot(actor: Actor) {
    if (actor.id !== this.currentViewId) return;
    this.weaponKick = 1;
    this.muzzleTime = weaponForSlot(actor.inventory).id === 'knife' ? 0 : 0.055;
  }

  notifyDamage() {
    this.shake = Math.max(this.shake, 0.13);
  }

  spawnTracer(from: THREE.Vector3, to: THREE.Vector3, color: number) {
    const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
    const material = new THREE.LineBasicMaterial({
      color, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    this.tracers.push({ line, life: 0.085, maxLife: 0.085 });
  }

  spawnImpact(point: THREE.Vector3, blood = false) {
    const color = blood ? 0x8f2820 : 0xd1b585;
    for (let i = 0; i < (blood ? 5 : 3); i++) {
      const material = new THREE.MeshBasicMaterial({ color, transparent: true });
      const mesh = new THREE.Mesh(this.particleGeometry, material);
      mesh.position.copy(point);
      mesh.scale.setScalar(0.6 + Math.random());
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 2.2, Math.random() * 1.9, (Math.random() - 0.5) * 2.2),
        life: 0.28 + Math.random() * 0.25,
        gravity: 6,
      });
    }
  }

  explosion(position: THREE.Vector3) {
    this.shake = 1.25;
    const light = new THREE.PointLight(0xff6b20, 45, 32, 2);
    light.position.copy(position).add(new THREE.Vector3(0, 1.2, 0));
    this.scene.add(light);
    window.setTimeout(() => this.scene.remove(light), 180);
    for (let i = 0; i < 70; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x3c3329 : i % 2 === 0 ? 0xffb136 : 0xe65424,
        transparent: true,
      });
      const mesh = new THREE.Mesh(this.particleGeometry, material);
      mesh.position.copy(position).add(new THREE.Vector3(0, 0.3, 0));
      mesh.scale.setScalar(2 + Math.random() * 5);
      this.scene.add(mesh);
      const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9 + 0.15, Math.random() - 0.5).normalize();
      this.particles.push({ mesh, velocity: direction.multiplyScalar(5 + Math.random() * 13), life: 0.8 + Math.random() * 1.4, gravity: 7 });
    }
  }

  private updateViewWeapon(actor: Actor, spectating: boolean) {
    const state = weaponForSlot(actor.inventory);
    if (state.id !== this.viewWeaponId || actor.team !== this.viewTeam) {
      if (this.viewWeapon) this.viewRoot.remove(this.viewWeapon);
      if (actor.team !== this.viewTeam) {
        if (this.viewArms) this.viewRoot.remove(this.viewArms.group);
        this.viewArms = createViewArms(actor.team);
        this.viewRoot.add(this.viewArms.group);
      }
      let model = this.viewWeaponCache.get(state.id);
      if (!model) {
        model = createWeaponModel(state.id);
        this.viewWeaponCache.set(state.id, model);
      }
      this.viewWeapon = model;
      this.viewRoot.add(this.viewWeapon);
      this.viewWeapon.add(this.muzzleFlash);
      this.muzzleFlash.position.copy(this.viewWeapon.userData.muzzle as THREE.Vector3);
      this.viewWeaponId = state.id;
      this.viewTeam = actor.team;
    }
    this.viewRoot.visible = actor.alive && !spectating;
  }

  sync(
    actors: Actor[], bomb: BombState, viewActor: Actor, spectating: boolean,
    scoped: boolean, dt: number, time: number,
  ) {
    this.currentViewId = viewActor.id;
    const aliveIds = new Set(actors.map((actor) => actor.id));
    for (const [id, rig] of this.rigs) {
      if (!aliveIds.has(id)) {
        this.scene.remove(rig.group);
        this.rigs.delete(id);
      }
    }
    for (const actor of actors) {
      let rig = this.rigs.get(actor.id);
      if (rig && rig.group.userData.team !== actor.team) {
        this.scene.remove(rig.group);
        this.rigs.delete(actor.id);
        rig = undefined;
      }
      if (!rig) {
        rig = createCharacter(actor);
        rig.group.userData.team = actor.team;
        this.rigs.set(actor.id, rig);
        this.scene.add(rig.group);
      }
      const weaponId = weaponForSlot(actor.inventory).id;
      if (rig.weaponId !== weaponId) {
        let model = rig.weaponModels.get(weaponId);
        if (!model) {
          model = createWeaponModel(weaponId);
          rig.weaponModels.set(weaponId, model);
        }
        rig.weaponAnchor.clear();
        rig.weaponAnchor.add(model);
        rig.weaponId = weaponId;
      }
      rig.group.visible = actor.id !== viewActor.id || !actor.alive;
      rig.setNameVisible(actor.alive && actor.id !== viewActor.id && actor.team === viewActor.team);
      rig.update(actor, time, dt);
    }

    const bobAmount = viewActor.grounded ? Math.min(1, viewActor.velocity.length() / 4) : 0;
    const bobY = Math.abs(Math.sin(viewActor.walkPhase)) * 0.025 * bobAmount;
    const bobX = Math.sin(viewActor.walkPhase * 0.5) * 0.015 * bobAmount;
    eyePosition(viewActor, this.camera.position);
    this.camera.position.y += bobY;
    this.camera.position.x += Math.cos(viewActor.yaw) * bobX;
    this.camera.position.z -= Math.sin(viewActor.yaw) * bobX;
    if (this.shake > 0.001) {
      this.camera.position.add(new THREE.Vector3(
        (Math.random() - 0.5) * this.shake * 0.14,
        (Math.random() - 0.5) * this.shake * 0.12,
        (Math.random() - 0.5) * this.shake * 0.14,
      ));
    }
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(viewActor.pitch, viewActor.yaw, Math.sin(viewActor.walkPhase * 0.5) * 0.003 * bobAmount);
    const targetFov = scoped ? 20 : 72;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 14, dt);
    this.camera.updateProjectionMatrix();
    this.shake = THREE.MathUtils.damp(this.shake, 0, 5, dt);

    this.updateViewWeapon(viewActor, spectating);
    this.weaponKick = THREE.MathUtils.damp(this.weaponKick, 0, 18, dt);
    this.muzzleTime = Math.max(0, this.muzzleTime - dt);
    this.muzzleFlash.visible = this.muzzleTime > 0 && !scoped;
    this.muzzleFlash.rotation.z += dt * 35;
    this.muzzleLight.intensity = this.muzzleTime > 0 && !scoped ? 1.6 : 0;
    if (this.viewWeapon) {
      this.muzzleLight.position.copy(this.muzzleFlash.position).add(this.viewRoot.position);
    }
    const rifle = viewActor.inventory.active === 'primary';
    const knife = viewActor.inventory.active === 'melee';
    const baseX = rifle ? 0.27 : 0.30;
    const baseY = rifle ? -0.29 : -0.30;
    const baseZ = knife ? -0.40 : -0.50;
    const reloadRemaining = Math.max(0, viewActor.reloadEndsAt - time);
    const reloadDuration = WEAPONS[weaponForSlot(viewActor.inventory).id].reloadTime;
    const reloadPhase = reloadRemaining > 0 && reloadDuration > 0 ? 1 - reloadRemaining / reloadDuration : 0;
    const reloadCurve = reloadRemaining > 0 ? Math.sin(reloadPhase * Math.PI) : 0;
    const switchCurve = Math.min(1, Math.max(0, viewActor.switchEndsAt - time) / 0.35);
    this.viewRoot.position.set(
      baseX + bobX * 1.8,
      baseY - Math.abs(bobY) * 1.5 - reloadCurve * 0.22 - switchCurve * 0.35,
      baseZ + this.weaponKick * (viewActor.inventory.active === 'primary' ? 0.13 : 0.08),
    );
    this.viewRoot.rotation.set(
      this.weaponKick * 0.08 + reloadCurve * 0.35,
      reloadCurve * -0.25,
      knife ? -0.15 + this.weaponKick * 0.8 : reloadCurve * 0.25,
    );
    if (this.viewArms) {
      this.viewArms.left.visible = !knife;
      this.viewArms.right.visible = true;
    }
    this.viewRoot.visible = this.viewRoot.visible && !scoped;

    if (bomb.status === 'carried' && bomb.carrierId) {
      const carrier = actors.find((actor) => actor.id === bomb.carrierId);
      if (carrier) {
        this.bombModel.visible = carrier.id !== viewActor.id;
        this.bombModel.position.set(
          carrier.position.x + Math.sin(carrier.yaw) * 0.29,
          carrier.position.y + 1.22,
          carrier.position.z + Math.cos(carrier.yaw) * 0.29,
        );
        this.bombModel.rotation.set(0.2, carrier.yaw, 0);
      }
    } else {
      this.bombModel.visible = bomb.status === 'dropped' || bomb.status === 'planted';
      this.bombModel.position.copy(bomb.position);
      this.bombModel.position.y += 0.15;
      this.bombModel.rotation.set(0, bomb.status === 'dropped' ? time * 0.6 : 0, 0);
    }
    const blinkRate = bomb.status === 'planted' ? Math.max(2, 16 - bomb.timer * 0.25) : 2;
    this.bombLight.visible = this.bombModel.visible && Math.sin(time * blinkRate) > -0.2;

    this.updateEffects(dt);
  }

  private updateEffects(dt: number) {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tracer = this.tracers[i];
      tracer.life -= dt;
      const material = tracer.line.material as THREE.LineBasicMaterial;
      material.opacity = Math.max(0, tracer.life / tracer.maxLife) * 0.72;
      if (tracer.life <= 0) {
        this.scene.remove(tracer.line);
        tracer.line.geometry.dispose();
        material.dispose();
        this.tracers.splice(i, 1);
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life -= dt;
      particle.velocity.y -= particle.gravity * dt;
      particle.mesh.position.addScaledVector(particle.velocity, dt);
      particle.mesh.rotation.x += dt * 8;
      particle.mesh.rotation.y += dt * 6;
      (particle.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(1, particle.life * 3);
      if (particle.life <= 0) {
        this.scene.remove(particle.mesh);
        (particle.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    if (this.viewRoot.visible) {
      this.renderer.clearDepth();
      this.renderer.render(this.viewScene, this.viewCamera);
    }
  }

  dispose() {
    for (const tracer of this.tracers) {
      tracer.line.geometry.dispose();
      (tracer.line.material as THREE.Material).dispose();
    }
    for (const particle of this.particles) (particle.mesh.material as THREE.Material).dispose();
    this.particleGeometry.dispose();
    this.map.dispose();
    disposeCharacterShared();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.rigs.clear();
  }
}
