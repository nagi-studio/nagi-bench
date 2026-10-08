/**
 * First-person view model: a procedural gun (or knife) parented to the camera.
 * Handles sway, walk bob, recoil kick, reload animation, draw animation and
 * ADS alignment.
 */

import * as THREE from 'three';
import { WEAPONS, type WeaponDef, type WeaponId } from '../game/weapons';
import { clamp, damp, lerp } from '../game/mathUtils';

export interface ViewModel {
  root: THREE.Group;
  /** the swap-able gun container */
  gun: THREE.Group;
  muzzle: THREE.Object3D;
  flash: THREE.Mesh;
  flashLight: THREE.PointLight;
  hands: THREE.Group;
  /** current weapon id */
  id: WeaponId | null;
  /** internal animation state */
  kick: number;
  kickVel: number;
  swayX: number;
  swayY: number;
  bobPhase: number;
  reloadT: number;
  drawT: number;
  lastYaw: number;
  lastPitch: number;
}

const HAND_COLOR = 0x2a2622;

function box(w: number, h: number, d: number, color: number, rough = 0.6, metal = 0.1): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }),
  );
  m.castShadow = false;
  m.receiveShadow = false;
  return m;
}

/** Build the detailed first-person model for a weapon. */
export function buildViewModel(id: WeaponId): { group: THREE.Group; muzzle: THREE.Object3D } {
  const def: WeaponDef = WEAPONS[id];
  const vm = def.viewModel;
  const g = new THREE.Group();

  if (vm.blade) {
    const handle = box(0.035, 0.045, 0.15, vm.bodyColor, 0.85);
    handle.position.set(0, 0, 0.04);
    const blade = box(0.016, 0.075, 0.24, vm.metalColor, 0.18, 0.9);
    blade.position.set(0, 0.045, -0.16);
    blade.rotation.x = -0.08;
    const guard = box(0.055, 0.016, 0.02, vm.accentColor, 0.4, 0.6);
    guard.position.set(0, 0.012, -0.035);
    g.add(handle, blade, guard);
    const muzzle = new THREE.Object3D();
    muzzle.position.set(0, 0.06, -0.26);
    g.add(muzzle);
    return { group: g, muzzle };
  }

  const bodyMat = new THREE.MeshStandardMaterial({ color: vm.bodyColor, roughness: 0.62, metalness: 0.22 });
  const metalMat = new THREE.MeshStandardMaterial({ color: vm.metalColor, roughness: 0.32, metalness: 0.75 });
  const accentMat = new THREE.MeshStandardMaterial({ color: vm.accentColor, roughness: 0.75, metalness: 0.1 });

  const mk = (geo: THREE.BufferGeometry, m: THREE.Material) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.castShadow = false;
    return mesh;
  };

  // receiver
  const recvLen = vm.length * 0.44;
  const receiver = mk(new THREE.BoxGeometry(0.085, 0.115, recvLen), bodyMat);
  receiver.position.set(0, 0, 0);
  g.add(receiver);

  // top rail
  const rail = mk(new THREE.BoxGeometry(0.055, 0.016, recvLen * 0.85), accentMat);
  rail.position.set(0, 0.062, -0.01);
  g.add(rail);

  // barrel + front sight
  const barrel = mk(new THREE.CylinderGeometry(0.022, 0.022, vm.barrel, 10), metalMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.028, -(recvLen / 2 + vm.barrel / 2));
  g.add(barrel);

  if (id === 'awp') {
    const shroud = mk(new THREE.CylinderGeometry(0.032, 0.032, vm.barrel * 0.35, 10), metalMat);
    shroud.rotation.x = Math.PI / 2;
    shroud.position.set(0, 0.028, -(recvLen / 2 + vm.barrel * 0.16));
    g.add(shroud);
  }

  // hand guard
  const guard = mk(new THREE.BoxGeometry(0.07, 0.07, Math.max(0.10, vm.barrel * 0.5)), bodyMat);
  guard.position.set(0, 0.012, -(recvLen / 2 + Math.max(0.10, vm.barrel * 0.5) / 2 + 0.01));
  g.add(guard);

  // magazine
  if (vm.magSize > 0) {
    const mag = mk(new THREE.BoxGeometry(0.062, vm.magSize, 0.085), id === 'ak47' ? bodyMat : accentMat);
    mag.position.set(0, -0.07 - vm.magSize / 2, 0.03);
    mag.rotation.x = -0.14;
    g.add(mag);
  }

  // pistol grip
  const grip = mk(new THREE.BoxGeometry(0.058, 0.13, 0.07), accentMat);
  grip.position.set(0, -0.085, recvLen * 0.26);
  grip.rotation.x = 0.3;
  g.add(grip);

  // stock
  if (vm.hasStock) {
    const stock = mk(new THREE.BoxGeometry(0.072, 0.10, vm.length * 0.24), accentMat);
    stock.position.set(0, -0.015, recvLen / 2 + vm.length * 0.11);
    g.add(stock);
    const butt = mk(new THREE.BoxGeometry(0.085, 0.13, 0.04), accentMat);
    butt.position.set(0, -0.015, recvLen / 2 + vm.length * 0.23);
    g.add(butt);
  } else {
    // pistol: beaver tail + slide
    const slide = mk(new THREE.BoxGeometry(0.072, 0.055, recvLen * 0.75), metalMat);
    slide.position.set(0, 0.07, -0.02);
    g.add(slide);
  }

  // scope
  if (vm.hasScope) {
    const scope = mk(new THREE.CylinderGeometry(0.038, 0.038, 0.24, 12), metalMat);
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.105, -0.03);
    g.add(scope);
    const lens = mk(new THREE.CylinderGeometry(0.036, 0.036, 0.012, 12),
      new THREE.MeshStandardMaterial({ color: 0x101418, roughness: 0.1, metalness: 0.4 }));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0.105, -0.152);
    g.add(lens);
    const ring = mk(new THREE.CylinderGeometry(0.042, 0.042, 0.02, 12), accentMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.105, 0.088);
    g.add(ring);
  }

  // rear sight
  const rear = mk(new THREE.BoxGeometry(0.05, 0.022, 0.02), metalMat);
  rear.position.set(0, 0.078, 0.02);
  g.add(rear);

  // hands
  const right = mk(new THREE.BoxGeometry(0.085, 0.085, 0.10),
    new THREE.MeshStandardMaterial({ color: HAND_COLOR, roughness: 0.95 }));
  right.position.set(0.01, -0.10, recvLen * 0.30);
  right.rotation.set(0.25, 0, 0.1);
  g.add(right);

  const left = mk(new THREE.BoxGeometry(0.09, 0.09, 0.11),
    new THREE.MeshStandardMaterial({ color: HAND_COLOR, roughness: 0.95 }));
  left.position.set(-0.035, -0.02, -(recvLen * 0.18 + (vm.barrel > 0 ? vm.barrel * 0.2 : 0.05)));
  left.rotation.set(-0.15, 0.1, -0.2);
  g.add(left);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.028, -(recvLen / 2 + vm.barrel));
  g.add(muzzle);

  // FPS view models read much better scaled down a touch
  g.scale.setScalar(0.82);
  return { group: g, muzzle };
}

export function createViewModel(camera: THREE.Camera): ViewModel {
  const root = new THREE.Group();
  camera.add(root);

  const gun = new THREE.Group();
  root.add(gun);

  const flashGeo = new THREE.ConeGeometry(0.09, 0.26, 6);
  const flashMat = new THREE.MeshBasicMaterial({
    color: 0xffd08a, transparent: true, opacity: 0, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const flash = new THREE.Mesh(flashGeo, flashMat);
  flash.rotation.x = -Math.PI / 2;
  flash.visible = false;
  root.add(flash);

  const flashLight = new THREE.PointLight(0xffbb66, 0, 6, 2);
  root.add(flashLight);

  const hands = new THREE.Group();
  root.add(hands);

  // base placement in camera space (camera looks down -Z)
  root.position.set(0.255, -0.25, -0.57);
  root.rotation.set(0, 0.10, 0);

  return {
    root, gun, muzzle: new THREE.Object3D(), flash, flashLight, hands,
    id: null, kick: 0, kickVel: 0, swayX: 0, swayY: 0, bobPhase: 0,
    reloadT: 0, drawT: 0, lastYaw: 0, lastPitch: 0,
  };
}

export function setViewModelWeapon(v: ViewModel, id: WeaponId): void {
  if (v.id === id) return;
  v.id = id;
  v.gun.clear();
  const { group, muzzle } = buildViewModel(id);
  v.gun.add(group);
  v.muzzle = muzzle;
  v.drawT = 1;
}

/** Resting position of the view model per weapon + ADS state. */
function restPose(id: WeaponId, ads: number): { x: number; y: number; z: number; rx: number; ry: number; rz: number } {
  const scoped = WEAPONS[id].ads !== null;
  const hipX = id === 'knife' ? 0.30 : 0.255;
  const hipY = id === 'knife' ? -0.26 : -0.25;
  const hipZ = id === 'knife' ? -0.48 : -0.57;
  const hipRy = id === 'knife' ? 0.22 : 0.10;
  if (scoped) {
    // bring the scope up to the eye
    return {
      x: lerp(hipX, 0.0, ads),
      y: lerp(hipY, -0.078, ads),
      z: lerp(hipZ, -0.26, ads),
      rx: lerp(0.0, 0, ads),
      ry: lerp(hipRy, 0, ads),
      rz: 0,
    };
  }
  return {
    x: lerp(hipX, 0.10, ads),
    y: lerp(hipY, -0.145, ads),
    z: lerp(hipZ, -0.42, ads),
    rx: lerp(0.0, 0.0, ads),
    ry: lerp(hipRy, 0.03, ads),
    rz: 0,
  };
}

export interface ViewModelInput {
  dt: number;
  yaw: number;
  pitch: number;
  speed: number;
  onGround: boolean;
  adsAmount: number;
  /** recoil punch accumulated by the engine */
  recoilPitch: number;
  reloading: boolean;
  reloadProgress: number;
  /** weapon not ready (draw animation) */
  drawing: boolean;
  firedThisFrame: boolean;
}

export function updateViewModel(v: ViewModel, input: ViewModelInput): void {
  const dt = input.dt;
  const id = v.id ?? 'knife';

  // ---- recoil kick (spring) ----
  v.kickVel += -v.kick * 260 * dt - v.kickVel * 26 * dt;
  if (input.firedThisFrame) {
    const def = WEAPONS[id];
    v.kickVel += def.recoil.punch * 9.5;
    v.flash.visible = true;
    (v.flash.material as THREE.MeshBasicMaterial).opacity = 0.95;
    v.flashLight.intensity = 7.5;
    v.flash.scale.setScalar(def.audio.gain);
  }
  v.kick += v.kickVel * dt;
  v.kick = clamp(v.kick, -0.02, 0.16);

  // muzzle flash placement + decay
  if (v.flash.visible) {
    const mat = v.flash.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, mat.opacity - dt * 26);
    v.flashLight.intensity = Math.max(0, v.flashLight.intensity - dt * 130);
    if (mat.opacity <= 0.01) v.flash.visible = false;
    const wp = new THREE.Vector3();
    v.muzzle.getWorldPosition(wp);
    v.root.worldToLocal(wp);
    v.flash.position.copy(wp);
    v.flashLight.position.copy(wp);
  }

  // ---- look sway ----
  const dYaw = input.yaw - v.lastYaw;
  const dPitch = input.pitch - v.lastPitch;
  v.lastYaw = input.yaw;
  v.lastPitch = input.pitch;
  const swayScale = 1 - input.adsAmount * 0.75;
  v.swayX = damp(v.swayX, clamp(-dYaw * 2.2, -0.06, 0.06), 12, dt) * swayScale;
  v.swayY = damp(v.swayY, clamp(-dPitch * 2.2, -0.06, 0.06), 12, dt) * swayScale;

  // ---- walk bob ----
  const moving = input.onGround && input.speed > 0.5;
  const bobSpeed = 6.2 + input.speed * 1.15;
  v.bobPhase += input.speed * dt * bobSpeed * 0.35;
  const bobAmp = moving ? clamp(input.speed / 5.0, 0, 1) * 0.022 * (1 - input.adsAmount * 0.8) : 0;
  const bobX = Math.cos(v.bobPhase) * bobAmp;
  const bobY = Math.abs(Math.sin(v.bobPhase)) * bobAmp * 0.9;

  // ---- reload animation ----
  const targetReload = input.reloading ? 1 : 0;
  v.reloadT = damp(v.reloadT, targetReload, input.reloading ? 12 : 9, dt);
  const reloadDip = Math.sin(input.reloadProgress * Math.PI) * v.reloadT;

  // ---- draw animation ----
  v.drawT = damp(v.drawT, input.drawing ? 1 : 0, 9, dt);

  // ---- compose ----
  const pose = restPose(id, input.adsAmount);
  const r = v.root;
  r.position.x = pose.x + v.swayX + bobX;
  r.position.y = pose.y + v.swayY + bobY - reloadDip * 0.16 - v.drawT * 0.22;
  r.position.z = pose.z + v.kick * 0.55;
  r.rotation.x = pose.rx - v.kick * 1.5 + reloadDip * 0.5 + v.drawT * 0.5;
  r.rotation.y = pose.ry + v.swayX * 1.6 + reloadDip * 0.35;
  r.rotation.z = pose.rz + v.swayX * 0.8 + reloadDip * 0.45 + v.drawT * 0.3;

  // recoil tilts the muzzle up
  v.gun.rotation.x = -input.recoilPitch * 1.6;
  v.gun.position.z = 0;
}
