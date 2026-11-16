import * as THREE from 'three';
import { Soldier, WeaponId } from '../types';
import { Dust2Map } from './Dust2Map';
import { WEAPON_SPECS, SoundManager } from './WeaponSystem';

export class PlayerController {
  public camera: THREE.PerspectiveCamera;
  public viewModelGroup: THREE.Group;
  public vmGunBody: THREE.Mesh;
  public vmBarrel: THREE.Mesh;
  public vmMuzzleFlash: THREE.Mesh;
  public isScoped = false;
  public isPointerLocked = false;
  public crosshairSpread = 12;

  private map: Dust2Map;
  private domElement: HTMLElement;
  private human: Soldier | null = null;
  private keys: Record<string, boolean> = {};
  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private walkBob = 0;
  private baseFov = 75;
  private targetRecoilPitch = 0;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, map: Dust2Map) {
    this.camera = camera;
    this.domElement = domElement;
    this.map = map;

    // Build first-person weapon viewmodel
    this.viewModelGroup = new THREE.Group();
    this.camera.add(this.viewModelGroup);

    this.vmGunBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.16, 0.72),
      new THREE.MeshLambertMaterial({ color: 0x92400e })
    );
    this.vmGunBody.position.set(0.28, -0.24, -0.52);

    this.vmBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.55, 12),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    this.vmBarrel.rotation.x = Math.PI / 2;
    this.vmBarrel.position.set(0.28, -0.19, -0.82);

    this.vmMuzzleFlash = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfde047 })
    );
    this.vmMuzzleFlash.position.set(0.28, -0.19, -1.12);
    this.vmMuzzleFlash.visible = false;

    this.viewModelGroup.add(this.vmGunBody, this.vmBarrel, this.vmMuzzleFlash);

    this.setupListeners();
  }

  public setHumanSoldier(soldier: Soldier | null): void {
    if (this.human) {
      this.human.isHuman = false;
      this.human.root.visible = true;
    }
    this.human = soldier;
    if (this.human) {
      this.human.isHuman = true;
      this.human.root.visible = false;
      this.updateViewModelColor();
    }
  }

  public getHumanSoldier(): Soldier | null {
    return this.human;
  }

  private updateViewModelColor(): void {
    if (!this.human) return;
    const spec = WEAPON_SPECS[this.human.weaponId];
    if (spec) {
      (this.vmGunBody.material as THREE.MeshLambertMaterial).color.setHex(spec.color);
    }
  }

  public setScope(active: boolean): void {
    this.isScoped = active;
    this.camera.fov = active ? 24 : this.baseFov;
    this.camera.updateProjectionMatrix();
    this.viewModelGroup.visible = !active;
  }

  public switchWeapon(wepId: WeaponId): void {
    if (!this.human || !this.human.alive) return;
    const spec = WEAPON_SPECS[wepId];
    if (!spec) return;

    if (wepId === 'c4' && !this.human.hasC4) return;

    this.human.weaponId = wepId;
    this.human.mag = spec.magSize;
    this.human.reserve = spec.reserve;
    this.human.reloadTimer = 0;
    this.setScope(false);
    this.updateViewModelColor();
  }

  public reload(): void {
    if (!this.human || !this.human.alive) return;
    const spec = WEAPON_SPECS[this.human.weaponId];
    if (!spec || spec.isMelee || spec.isC4) return;
    if (this.human.mag >= spec.magSize || this.human.reserve <= 0) return;
    if (this.human.reloadTimer > 0) return;

    this.human.reloadTimer = spec.reloadTime;
    SoundManager.play('reload');
  }

  public triggerRecoil(kick: number): void {
    if (!this.human) return;
    this.targetRecoilPitch += kick;
    this.human.yaw += (Math.random() - 0.5) * kick * 0.45;

    // Viewmodel kickback animation
    this.vmGunBody.position.z = -0.44;
    this.vmMuzzleFlash.visible = true;
    setTimeout(() => {
      this.vmGunBody.position.z = -0.52;
      this.vmMuzzleFlash.visible = false;
    }, 55);

    this.crosshairSpread = Math.min(32, this.crosshairSpread + kick * 220);
  }

  private setupListeners(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    });

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    this.keys[e.code] = true;
    if (e.code === 'Digit1') this.switchWeapon('ak47');
    else if (e.code === 'Digit2') this.switchWeapon('m4a4');
    else if (e.code === 'Digit3') this.switchWeapon('awp');
    else if (e.code === 'Digit4') this.switchWeapon('deagle');
    else if (e.code === 'Digit5') this.switchWeapon('usp');
    else if (e.code === 'Digit6') this.switchWeapon('knife');
    else if (e.code === 'Digit7') this.switchWeapon('c4');
    else if (e.code === 'KeyR') this.reload();
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys[e.code] = false;
  };

  private onMouseDown = (e: MouseEvent): void => {
    if (e.button === 2) {
      if (this.human && WEAPON_SPECS[this.human.weaponId]?.isSniper) {
        this.setScope(!this.isScoped);
      }
      return;
    }
    if (e.button === 0 && !this.isPointerLocked) {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    if (!this.human) return;
    const sens = this.isScoped ? 0.0009 : 0.0024;

    if (this.isPointerLocked) {
      this.human.yaw -= e.movementX * sens;
      this.human.pitch = Math.max(-1.42, Math.min(1.42, this.human.pitch - e.movementY * sens));
    } else if (this.isDragging) {
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.human.yaw -= dx * 0.004;
      this.human.pitch = Math.max(-1.42, Math.min(1.42, this.human.pitch - dy * 0.004));
    }
  };

  private onMouseUp = (): void => {
    this.isDragging = false;
  };

  public isActionKeyPressed(): boolean {
    return !!this.keys['KeyE'];
  }

  public update(dt: number): void {
    if (!this.human || !this.human.alive) return;

    // Smoothly apply and recover recoil
    if (this.targetRecoilPitch > 0) {
      const step = Math.min(this.targetRecoilPitch, dt * 1.8);
      this.human.pitch = Math.min(1.45, this.human.pitch + step);
      this.targetRecoilPitch -= step;
    } else {
      this.crosshairSpread = Math.max(12, this.crosshairSpread - dt * 25);
    }

    // WASD Movement
    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0;
    if (isMoving) {
      moveDir.normalize();
      const moveSpeed = this.isScoped ? 3.0 : 6.2;

      // Transform direction based on camera yaw
      const forward = new THREE.Vector3(-Math.sin(this.human.yaw), 0, -Math.cos(this.human.yaw));
      const right = new THREE.Vector3(Math.cos(this.human.yaw), 0, -Math.sin(this.human.yaw));

      const deltaX = (right.x * moveDir.x + forward.x * -moveDir.z) * moveSpeed * dt;
      const deltaZ = (right.z * moveDir.x + forward.z * -moveDir.z) * moveSpeed * dt;

      // Collision handling
      if (!this.map.checkWallCollision(this.human.pos.x + deltaX, this.human.pos.z, 0.45)) {
        this.human.pos.x += deltaX;
      }
      if (!this.map.checkWallCollision(this.human.pos.x, this.human.pos.z + deltaZ, 0.45)) {
        this.human.pos.z += deltaZ;
      }

      // Viewmodel walking bob
      this.walkBob += dt * 11;
      this.viewModelGroup.position.x = Math.sin(this.walkBob) * 0.015;
      this.viewModelGroup.position.y = Math.cos(this.walkBob * 2) * 0.012;
      this.crosshairSpread = Math.max(this.crosshairSpread, 18);
    } else {
      this.walkBob = 0;
      this.viewModelGroup.position.set(0, 0, 0);
    }

    // Jumping & Gravity
    if (this.keys['Space'] && this.human.pos.y <= 0.05) {
      this.human.velY = 4.8;
      this.crosshairSpread = 28;
    }

    this.human.pos.y += this.human.velY * dt;
    if (this.human.pos.y > 0) {
      this.human.velY -= 15.0 * dt; // gravity
    } else {
      this.human.pos.y = 0;
      this.human.velY = 0;
    }

    // Position Camera at eye level (1.68m)
    this.camera.position.set(
      this.human.pos.x,
      this.human.pos.y + 1.68,
      this.human.pos.z
    );

    // Apply rotation
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.human.yaw;
    this.camera.rotation.x = this.human.pitch;

    // Handle reload completion
    if (this.human.reloadTimer > 0) {
      this.human.reloadTimer -= dt;
      if (this.human.reloadTimer <= 0) {
        const spec = WEAPON_SPECS[this.human.weaponId];
        const needed = spec.magSize - this.human.mag;
        const taken = Math.min(needed, this.human.reserve);
        this.human.mag += taken;
        this.human.reserve -= taken;
      }
    }

    if (this.human.fireCooldown > 0) {
      this.human.fireCooldown -= dt;
    }
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
}
