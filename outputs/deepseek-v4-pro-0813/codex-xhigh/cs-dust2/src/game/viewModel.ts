import * as THREE from 'three';
import { createWeaponModel } from './weaponModels';
import { WeaponId } from './types';
import { clamp } from './math';

export class FirstPersonViewModel {
  readonly root = new THREE.Group();
  private model: THREE.Group | null = null;
  private weapon: WeaponId | null = null;
  private bobPhase = 0;
  private recoilOffset = 0;
  private switchOffset = 0;
  private flash: THREE.Mesh;
  private flashLight: THREE.PointLight;
  private flashTimer = 0;

  constructor(private readonly camera: THREE.PerspectiveCamera) {
    this.flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd487, transparent: true, opacity: 0.95 }),
    );
    this.flash.visible = false;
    this.flashLight = new THREE.PointLight(0xffc573, 3, 5, 2);
    this.flashLight.visible = false;
    this.root.add(this.flash, this.flashLight);
    camera.add(this.root);
  }

  setWeapon(id: WeaponId) {
    if (this.weapon === id) return;
    this.weapon = id;
    if (this.model) {
      this.root.remove(this.model);
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
      });
    }
    this.model = createWeaponModel(id);
    this.model.name = 'first-person-weapon';
    this.root.add(this.model);
    this.switchOffset = 0.32;
    this.recoilOffset = 0;
  }

  fire(weaponId: WeaponId) {
    const kick = weaponId === 'awp' ? 0.58 : weaponId === 'deagle' ? 0.28 : weaponId === 'knife' ? 0.08 : 0.14;
    this.recoilOffset = kick;
    if (weaponId !== 'knife') {
      this.flash.visible = true;
      this.flashLight.visible = true;
      this.flashTimer = 0.055;
    }
  }

  update(dt: number, moving: boolean, speed: number, reloading: boolean, aiming: boolean) {
    if (moving) this.bobPhase += dt * Math.max(6.5, speed * 4.5);
    const bobX = moving ? Math.sin(this.bobPhase) * 0.018 : 0;
    const bobY = moving ? Math.abs(Math.cos(this.bobPhase)) * 0.025 : 0;
    this.recoilOffset = Math.max(0, this.recoilOffset - dt * 3.4);
    this.switchOffset = Math.max(0, this.switchOffset - dt * 1.8);

    if (this.weapon === 'awp' && aiming) {
      this.root.position.set(0, -0.205, -0.62);
      this.root.rotation.set(0, 0, 0);
    } else if (this.weapon === 'knife') {
      this.root.position.set(0.29, -0.34, -0.62 + this.switchOffset + this.recoilOffset);
      this.root.rotation.set(-0.2 + this.recoilOffset * 0.4, -0.06, 0.12);
    } else {
      this.root.position.set(
        0.31 + bobX,
        -0.31 + bobY - this.switchOffset * 0.6,
        -0.62 + this.switchOffset + this.recoilOffset * 0.35,
      );
      this.root.rotation.set(-0.05 + this.recoilOffset * 0.35, -0.045, 0.025);
    }

    if (reloading && this.model) {
      this.root.rotation.x -= 0.52;
      this.root.position.y -= 0.08;
      this.root.position.z += 0.1;
    }

    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.flash.visible = false;
        this.flashLight.visible = false;
      }
    }
    this.flash.position.set(0, 0.02, -0.65);
    this.flashLight.position.set(0, 0.08, -0.6);
  }

  dispose() {
    this.camera.remove(this.root);
    if (this.model) this.model.traverse((child) => child instanceof THREE.Mesh && child.geometry.dispose());
    this.flash.geometry.dispose();
  }
}
