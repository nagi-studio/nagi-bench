// three.js 渲染器：场景构建（全程序化几何体）、角色模型、第一人称武器、C4

import * as THREE from 'three';
import { WALLS, BOXES, SITES } from './map';
import { TEAM_CT, type WeaponId, type Team } from './types';
import type { PlayerEntity } from './entity';

export interface CharacterModel {
  group: THREE.Group;
  head: THREE.Group;
  torso: THREE.Mesh;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  gun: THREE.Group;
  flash: THREE.PointLight;
  flashMesh: THREE.Mesh;
  nameLabel: THREE.Sprite;
  dead: boolean;
}

const MATS = {
  ctBody: new THREE.MeshStandardMaterial({ color: 0x2f4f8f, roughness: 0.7 }),
  ctArm: new THREE.MeshStandardMaterial({ color: 0x243f75, roughness: 0.7 }),
  ctLeg: new THREE.MeshStandardMaterial({ color: 0x1d3159, roughness: 0.8 }),
  ctHelm: new THREE.MeshStandardMaterial({ color: 0x1c3d6e, roughness: 0.4 }),
  tBody: new THREE.MeshStandardMaterial({ color: 0xc9a35a, roughness: 0.8 }),
  tArm: new THREE.MeshStandardMaterial({ color: 0xad8c4a, roughness: 0.8 }),
  tLeg: new THREE.MeshStandardMaterial({ color: 0x8a6f3c, roughness: 0.85 }),
  tHead: new THREE.MeshStandardMaterial({ color: 0xd9b98a, roughness: 0.6 }),
  head: new THREE.MeshStandardMaterial({ color: 0xd9b98a, roughness: 0.6 }),
  gunDark: new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.35, metalness: 0.6 }),
  gunWood: new THREE.MeshStandardMaterial({ color: 0x6d4c2f, roughness: 0.7 }),
  gunGreen: new THREE.MeshStandardMaterial({ color: 0x4a4f35, roughness: 0.5 }),
  bomb: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.5 }),
  flashMat: new THREE.MeshBasicMaterial({ color: 0xffdd66 }),
};

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

/** 构造一件武器的网格（世界模型，右手持） */
export function buildWeaponMesh(id: WeaponId): THREE.Group {
  const g = new THREE.Group();
  const dark = MATS.gunDark, wood = MATS.gunWood, green = MATS.gunGreen;
  switch (id) {
    case 'ak47': {
      const body = box(0.06, 0.09, 0.62, dark, 0, 0, -0.05);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.4, 8), dark);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.03, -0.42);
      const mag = box(0.05, 0.2, 0.1, wood, 0, -0.12, -0.08);
      const stock = box(0.05, 0.1, 0.24, wood, 0, -0.02, 0.32);
      const grip = box(0.04, 0.12, 0.05, wood, 0, -0.06, 0.16);
      const sight = box(0.01, 0.03, 0.05, dark, 0, 0.06, -0.25);
      g.add(body, barrel, mag, stock, grip, sight);
      break;
    }
    case 'm4a4': {
      const body = box(0.05, 0.08, 0.58, dark, 0, 0, -0.04);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 8), dark);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.025, -0.4);
      const mag = box(0.045, 0.16, 0.09, dark, 0, -0.1, -0.06);
      const stock = box(0.05, 0.09, 0.22, dark, 0, -0.01, 0.3);
      const handle = box(0.03, 0.05, 0.14, dark, 0, 0.05, -0.02);
      g.add(body, barrel, mag, stock, handle);
      break;
    }
    case 'awp': {
      const body = box(0.05, 0.07, 0.7, green, 0, 0, 0);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.75, 8), dark);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.02, -0.6);
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 10), dark);
      scope.rotation.x = Math.PI / 2;
      scope.position.set(0, 0.07, -0.1);
      const mag = box(0.04, 0.12, 0.14, dark, 0, -0.08, 0.05);
      const stock = box(0.045, 0.08, 0.26, green, 0, -0.01, 0.42);
      g.add(body, barrel, scope, mag, stock);
      break;
    }
    case 'glock':
    case 'usp':
    case 'deagle': {
      const body = box(0.035, 0.06, 0.2, dark, 0, 0, 0);
      const barrel = box(0.028, 0.04, 0.08, dark, 0, 0.005, -0.13);
      const grip = box(0.032, 0.1, 0.05, dark, 0, -0.07, 0.05);
      g.add(body, barrel, grip);
      break;
    }
    case 'knife': {
      const blade = box(0.012, 0.03, 0.22, new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }), 0, 0, -0.1);
      blade.rotation.x = 0.2;
      const handle = box(0.02, 0.035, 0.1, dark, 0, 0, 0.06);
      g.add(blade, handle);
      break;
    }
  }
  return g;
}

/** 类人型角色模型：头 / 躯干 / 双臂 / 双腿，持枪姿态 */
export function buildCharacter(team: Team): CharacterModel {
  const g = new THREE.Group();
  const isCT = team === TEAM_CT;
  const bodyM = isCT ? MATS.ctBody : MATS.tBody;
  const armM = isCT ? MATS.ctArm : MATS.tArm;
  const legM = isCT ? MATS.ctLeg : MATS.tLeg;

  // 躯干
  const torso = box(0.42, 0.58, 0.26, bodyM, 0, 1.0, 0);
  // 骨盆
  const pelvis = box(0.36, 0.2, 0.24, legM, 0, 0.68, 0);
  // 头 + 头饰（CT 头盔 / T 头巾）
  const head = new THREE.Group();
  head.position.set(0, 1.44, 0);
  const headMesh = box(0.24, 0.26, 0.26, isCT ? MATS.ctHelm : MATS.tHead, 0, 0.13, 0);
  const face = box(0.2, 0.14, 0.18, MATS.head, 0, -0.05, 0.02);
  if (isCT) {
    const visor = box(0.22, 0.05, 0.05, new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.1 }), 0, 0.12, 0.14);
    head.add(headMesh, visor);
  } else {
    const band = box(0.25, 0.06, 0.25, new THREE.MeshStandardMaterial({ color: 0x6d5a3a }), 0, 0.13, 0);
    head.add(headMesh, face, band);
  }
  // 武器挂在右手（由 torso 前方向前延伸的握持点）
  const gun = new THREE.Group();
  gun.position.set(0.24, 1.18, 0.1);
  gun.rotation.y = Math.PI / 2;

  // 左臂（上臂 + 前臂）
  const armL = new THREE.Group();
  armL.position.set(-0.27, 1.32, 0);
  const upL = box(0.11, 0.3, 0.11, armM, 0, -0.15, 0);
  const foreL = new THREE.Group();
  foreL.position.set(0, -0.3, 0.06);
  const loL = box(0.1, 0.28, 0.1, armM, 0, -0.13, 0);
  foreL.add(loL);
  armL.add(upL, foreL);

  // 右臂（持枪）
  const armR = new THREE.Group();
  armR.position.set(0.27, 1.32, 0);
  const upR = box(0.11, 0.3, 0.11, armM, 0, -0.15, 0);
  const foreR = new THREE.Group();
  foreR.position.set(0, -0.3, 0.08);
  const loR = box(0.1, 0.28, 0.1, armM, 0, -0.13, 0);
  foreR.add(loR);
  armR.add(upR, foreR);

  // 双腿（大腿 + 小腿）
  const legL = new THREE.Group();
  legL.position.set(-0.12, 0.68, 0);
  const thighL = box(0.13, 0.42, 0.14, legM, 0, -0.2, 0);
  const shinL = box(0.11, 0.4, 0.12, legM, 0, -0.6, 0);
  legL.add(thighL, shinL);
  const legR = new THREE.Group();
  legR.position.set(0.12, 0.68, 0);
  const thighR = box(0.13, 0.42, 0.14, legM, 0, -0.2, 0);
  const shinR = box(0.11, 0.4, 0.12, legM, 0, -0.6, 0);
  legR.add(thighR, shinR);

  // 开火闪光
  const flash = new THREE.PointLight(0xffcc66, 0, 7, 1.5);
  flash.position.set(0.3, 1.2, 0.4);
  const flashMesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), MATS.flashMat);
  flashMesh.visible = false;
  gun.add(flash, flashMesh);

  g.add(torso, pelvis, head, gun, armL, armR, legL, legR);
  g.rotation.order = 'YXZ';

  // 名牌
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = isCT ? 'rgba(70,130,255,0.9)' : 'rgba(255,190,80,0.9)';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isCT ? 'CT' : 'T', 64, 22);
  const tex = new THREE.CanvasTexture(canvas);
  const nameLabel = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  nameLabel.scale.set(0.7, 0.18, 1);
  nameLabel.position.set(0, 1.95, 0);

  return { group: g, head, torso, armL, armR, legL, legR, gun, flash, flashMesh, nameLabel, dead: false };
}

export class Renderer {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  private models = new Map<number, CharacterModel>();
  private viewModel = new THREE.Group();
  private viewGun = new THREE.Group();
  private muzzle = new THREE.PointLight(0xffcc66, 0, 8, 1.5);
  private muzzleMesh: THREE.Mesh;
  private tracer: THREE.Line | null = null;
  private tracerT = 0;
  private bombModel = new THREE.Group();
  private bombPlantedBeam: THREE.Mesh;
  private bombDroppedModel = new THREE.Group();
  private plantMarker: THREE.Group | null = null;
  private shakeT = 0;
  private floorMat: THREE.MeshStandardMaterial;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.05, 300);
    this.scene.fog = new THREE.Fog(0xcbb894, 60, 180);
    this.scene.background = new THREE.Color(0x9db4cc);
    this.floorMat = new THREE.MeshStandardMaterial({ color: 0xcbb894, roughness: 1 });
    this.muzzleMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), MATS.flashMat);
    this.muzzleMesh.visible = false;
    this.bombPlantedBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 6, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xff5533, transparent: true, opacity: 0.35 }),
    );
    this.buildStatic();
    this.buildViewModel();
  }

  resize(w: number, h: number): void {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  private buildStatic(): void {
    const light = new THREE.DirectionalLight(0xfff2dd, 1.6);
    light.position.set(30, 45, 20);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.left = -60;
    light.shadow.camera.right = 60;
    light.shadow.camera.top = 60;
    light.shadow.camera.bottom = -60;
    light.shadow.camera.far = 150;
    this.scene.add(light);
    this.scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x8a7a5c, 0.75));

    // 地面（程序化噪点纹理）
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#cbb894';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = `rgba(${120 + Math.random() * 60},${100 + Math.random() * 50},${70 + Math.random() * 40},${0.15 + Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 墙体
    for (const w of WALLS) {
      const cx = (w.x0 + w.x1) / 2, cz = (w.z0 + w.z1) / 2;
      const mesh = box(w.x1 - w.x0, w.height, w.z1 - w.z0, new THREE.MeshStandardMaterial({ color: w.color, roughness: 0.95 }), cx, w.height / 2, cz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    // 箱子
    for (const b of BOXES) {
      const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
      const h = b.stack >= 2 ? b.height * 2 : b.height;
      const mesh = box(b.x1 - b.x0, h, b.z1 - b.z0, new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.9 }), cx, h / 2, cz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    // 包点地面标记（A / B 大圆）
    for (const s of SITES) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(s.radius, s.radius + 0.35, 40),
        new THREE.MeshBasicMaterial({ color: s.name === 'A' ? 0x44bbff : 0xffaa33, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(s.x, 0.02, s.z);
      this.scene.add(ring);
      // 文字牌（canvas 纹理）
      const cv = document.createElement('canvas');
      cv.width = 128; cv.height = 128;
      const cx2 = cv.getContext('2d')!;
      cx2.fillStyle = 'rgba(0,0,0,0.55)';
      cx2.beginPath();
      cx2.arc(64, 64, 58, 0, Math.PI * 2);
      cx2.fill();
      cx2.fillStyle = s.name === 'A' ? '#55ccff' : '#ffbb44';
      cx2.font = 'bold 76px sans-serif';
      cx2.textAlign = 'center';
      cx2.textBaseline = 'middle';
      cx2.fillText(s.name, 64, 66);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true }));
      sprite.scale.set(3.4, 3.4, 1);
      sprite.position.set(s.x, 0.12, s.z);
      this.scene.add(sprite);
    }
    // 中门区域门框标记
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 2.7, 0.15),
      new THREE.MeshBasicMaterial({ color: 0x443322, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
    );
    door.position.set(8, 1.35, -18.4);
    door.rotation.y = 0;
    this.scene.add(door);

    // C4 模型（爆炸物盒子 + 天线）
    const c4box = box(0.28, 0.12, 0.22, MATS.bomb, 0, 0.06, 0);
    const led = box(0.06, 0.03, 0.06, new THREE.MeshBasicMaterial({ color: 0xff3300 }), 0, 0.13, 0);
    this.bombModel.add(c4box, led);
    this.bombModel.visible = false;
    this.scene.add(this.bombModel);
    this.bombPlantedBeam.position.y = 3;
    this.bombPlantedBeam.visible = false;
    this.scene.add(this.bombPlantedBeam);
    this.bombDroppedModel.add(c4box.clone(), led.clone());
    this.bombDroppedModel.visible = false;
    this.scene.add(this.bombDroppedModel);
  }

  /** 第一人称武器（挂在相机上） */
  private buildViewModel(): void {
    this.muzzle.position.set(0, -0.08, -0.85);
    this.muzzleMesh.position.set(0, -0.08, -0.95);
    this.viewGun.add(this.muzzle, this.muzzleMesh);
    this.viewGun.position.set(0.28, -0.26, -0.5);
    this.viewModel.add(this.viewGun);
    this.viewModel.position.set(0, 0, 0);
    this.camera.add(this.viewModel);
    this.scene.add(this.camera);
  }

  /** 设置当前手持武器模型 */
  setViewWeapon(id: WeaponId): void {
    this.viewGun.clear();
    this.viewGun.add(buildWeaponMesh(id));
    this.viewGun.add(this.muzzle, this.muzzleMesh);
    this.viewGun.rotation.set(0, 0, 0);
  }

  /** 注册/获取角色模型 */
  modelFor(index: number, team: Team): CharacterModel {
    let m = this.models.get(index);
    if (!m) {
      m = buildCharacter(team);
      this.scene.add(m.group);
      this.scene.add(m.nameLabel);
      this.models.set(index, m);
    }
    return m;
  }

  /** 每帧同步角色 */
  syncEntity(p: PlayerEntity, m: CharacterModel, dt: number, time: number): void {
    m.group.position.set(p.x, 0, p.z);
    // 模型内部前向为 -Z，旋转到世界前向 F=(cos yaw, sin yaw)
    m.group.rotation.y = -(p.yaw + Math.PI / 2);
    m.group.visible = p.alive;
    m.nameLabel.visible = p.alive;
    if (!p.alive) {
      // 死亡姿态：向侧倒
      if (!m.dead) {
        m.dead = true;
        m.group.rotation.x = Math.PI / 2;
        m.group.rotation.z = 0.6;
        m.group.position.y = 0.2;
      }
      return;
    }
    if (m.dead) { m.dead = false; m.group.rotation.x = 0; m.group.rotation.z = 0; m.group.position.y = 0; }
    // 走路摆动
    const moving = p.aiMoveX !== 0 || p.aiMoveZ !== 0 || p.moveAmount > 0.01;
    if (moving) p.walkPhase += dt * 9;
    const swing = moving ? Math.sin(p.walkPhase) * 0.55 : 0;
    m.legL.rotation.x = swing;
    m.legR.rotation.x = -swing;
    m.armL.rotation.x = -swing * 0.6;
    m.armR.rotation.x = swing * 0.6 + 0.2;
    // 开火后坐
    const kick = p.firingAnim * 0.18;
    m.gun.position.z = 0.1 + kick;
    m.gun.rotation.x = kick * 2.2;
    m.armR.rotation.x += kick * 1.4;
    // 受击闪红（躯干高光）
    (m.torso.material as THREE.MeshStandardMaterial).emissive.setRGB(p.hitFlash, p.hitFlash * 0.25, p.hitFlash * 0.12);
    // 枪口闪光
    m.flashMesh.visible = p.firingAnim > 0.5;
    m.flash.intensity = p.firingAnim > 0.5 ? 2.5 : 0;
  }

  /** 炸弹状态同步 */
  syncBomb(planted: boolean, dropped: boolean, bx: number, bz: number, time: number, fuseLeft: number): void {
    this.bombDroppedModel.visible = dropped;
    this.bombPlantedBeam.visible = planted;
    if (dropped) {
      this.bombDroppedModel.position.set(bx, 0.06, bz);
    }
    if (planted) {
      this.bombModel.visible = true;
      this.bombModel.position.set(bx, 0.06, bz);
      this.bombModel.rotation.y = time * 0.6;
      const urgency = 0.35 + 0.45 * (fuseLeft / 40);
      const blink = Math.sin(time * (2 + fuseLeft)) > 0 ? 1 : 0.2;
      (this.bombPlantedBeam.material as THREE.MeshBasicMaterial).opacity = (1 - urgency) * 0.55 * blink + 0.08;
    } else {
      this.bombModel.visible = false;
    }
  }

  /** 弹道示踪 */
  spawnTracer(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, dist: number): void {
    const pts = [
      new THREE.Vector3(ox + dx * 0.3, oy + dy * 0.3, oz + dz * 0.3),
      new THREE.Vector3(ox + dx * dist, oy + dy * dist, oz + dz * dist),
    ];
    if (this.tracer) { this.scene.remove(this.tracer); }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    this.tracer = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.8 }));
    this.scene.add(this.tracer);
    this.tracerT = 0.08;
  }

  update(dt: number, time: number, fire: boolean, viewRecoil: number, reloading: boolean, zooming: boolean): void {
    // 示踪淡出
    if (this.tracer) {
      this.tracerT -= dt;
      if (this.tracerT <= 0) {
        this.scene.remove(this.tracer);
        this.tracer = null;
      }
    }
    // 第一人称武器动画
    const bob = Math.sin(time * 7.5) * 0.012;
    const targetX = 0.28, targetY = -0.26;
    let tx = targetX + bob;
    let ty = targetY + Math.abs(Math.cos(time * 7.5)) * 0.01;
    let rz = 0;
    if (reloading) {
      tx -= 0.15;
      ty -= 0.2;
      rz = 0.6 * Math.sin(time * 16) * 0.4;
    }
    if (zooming) {
      tx = 0;
      ty = -0.17;
      rz = 0;
    }
    this.viewGun.position.x += (tx - this.viewGun.position.x) * Math.min(1, dt * 12);
    this.viewGun.position.y += (ty - this.viewGun.position.y) * Math.min(1, dt * 12);
    this.viewGun.rotation.z += (rz - this.viewGun.rotation.z) * Math.min(1, dt * 10);
    this.viewGun.rotation.x += (-viewRecoil * 0.8 - this.viewGun.rotation.x) * Math.min(1, dt * 14);
    this.viewGun.position.z += (0.08 * viewRecoil - this.viewGun.position.z) * Math.min(1, dt * 14);
    this.muzzleMesh.visible = fire;
    this.muzzle.intensity = fire ? 3 : 0;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
