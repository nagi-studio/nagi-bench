import * as THREE from 'three';
import { WeaponId, Team } from '../types/game';
import { ProceduralTextures } from '../textures/ProceduralTextures';

export class ViewModel {
  public group: THREE.Group;
  public camera: THREE.PerspectiveCamera;
  public team: Team;

  // Viewmodel arms and gun mounts
  private weaponRoot: THREE.Group;
  private weaponMeshes: Map<WeaponId, THREE.Group> = new Map();
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private currentWeaponId: WeaponId = 'ak47';

  // Animation values
  private bobTime = 0;
  private swayPitch = 0;
  private swayYaw = 0;
  private recoilOffset = new THREE.Vector3();
  private recoilRot = new THREE.Euler();
  private reloadProgress = 0;
  private isReloading = false;
  private reloadDuration = 2.0;

  // Muzzle flash
  private muzzleFlashLight: THREE.PointLight;
  private muzzleFlashSprite: THREE.Sprite;
  private flashTimer = 0;

  constructor(camera: THREE.PerspectiveCamera, team: Team) {
    this.camera = camera;
    this.team = team;
    this.group = new THREE.Group();

    this.weaponRoot = new THREE.Group();
    this.weaponRoot.position.set(0.22, -0.22, -0.42);
    this.group.add(this.weaponRoot);

    this.leftArmGroup = new THREE.Group();
    this.rightArmGroup = new THREE.Group();
    this.weaponRoot.add(this.leftArmGroup);
    this.weaponRoot.add(this.rightArmGroup);

    // Muzzle Flash
    this.muzzleFlashLight = new THREE.PointLight(0xffaa33, 0, 8);
    this.muzzleFlashLight.position.set(0.22, -0.15, -0.85);
    this.group.add(this.muzzleFlashLight);

    const flashMat = new THREE.SpriteMaterial({
      map: ProceduralTextures.getMuzzleFlash(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0,
    });
    this.muzzleFlashSprite = new THREE.Sprite(flashMat);
    this.muzzleFlashSprite.scale.set(0.4, 0.4, 0.4);
    this.muzzleFlashSprite.position.set(0.22, -0.15, -0.85);
    this.group.add(this.muzzleFlashSprite);

    this.buildArms();
    this.buildWeaponModels();
    this.setWeapon('ak47');
  }

  // First person tactical arms
  private buildArms() {
    const sleeveColor = this.team === 'CT' ? 0x273746 : 0x5d6d3f;
    const sleeveMat = new THREE.MeshStandardMaterial({ color: sleeveColor, roughness: 0.8 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });

    // Right Arm (Holding handle/trigger)
    const rightForearm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.35), sleeveMat);
    rightForearm.position.set(0.06, -0.06, 0.15);
    rightForearm.rotation.x = 0.2;
    this.rightArmGroup.add(rightForearm);

    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.1), gloveMat);
    rightHand.position.set(0.06, -0.04, -0.02);
    this.rightArmGroup.add(rightHand);

    // Left Arm (Holding foregrip)
    const leftForearm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.38), sleeveMat);
    leftForearm.position.set(-0.24, -0.08, 0.12);
    leftForearm.rotation.set(0.3, 0.5, -0.2);
    this.leftArmGroup.add(leftForearm);

    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.1), gloveMat);
    leftHand.position.set(-0.1, -0.01, -0.18);
    leftHand.rotation.set(0.2, 0.4, 0);
    this.leftArmGroup.add(leftHand);
  }

  // Detailed first-person weapon meshes
  private buildWeaponModels() {
    const gunMetalMat = new THREE.MeshStandardMaterial({ color: 0x222629, roughness: 0.35, metalness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x733d1b, roughness: 0.65 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x3d4a36, roughness: 0.5, metalness: 0.4 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xc0c5c8, roughness: 0.2, metalness: 0.95 });
    const c4Mat = new THREE.MeshStandardMaterial({ color: 0x8a6e4b, roughness: 0.9 });
    const c4LcdMat = new THREE.MeshBasicMaterial({ color: 0x33ff33 });

    // 1. AK-47 Viewmodel
    const ak = new THREE.Group();
    // Receiver
    const akReceiver = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.32), gunMetalMat);
    ak.add(akReceiver);
    // Barrel
    const akBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12), gunMetalMat);
    akBarrel.rotation.x = Math.PI / 2;
    akBarrel.position.set(0, 0.01, -0.3);
    ak.add(akBarrel);
    // Gas Tube
    const akGas = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 12), gunMetalMat);
    akGas.rotation.x = Math.PI / 2;
    akGas.position.set(0, 0.03, -0.25);
    ak.add(akGas);
    // Wood Handguard
    const akWood = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.06, 0.18), woodMat);
    akWood.position.set(0, 0.01, -0.2);
    ak.add(akWood);
    // Wood Stock
    const akStock = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.09, 0.22), woodMat);
    akStock.position.set(0, -0.02, 0.25);
    ak.add(akStock);
    // Curved Mag
    const akMag = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.07), gunMetalMat);
    akMag.position.set(0, -0.1, -0.06);
    akMag.rotation.x = 0.25;
    ak.add(akMag);
    // Iron Sight
    const akSight = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.025, 0.01), gunMetalMat);
    akSight.position.set(0, 0.045, -0.44);
    ak.add(akSight);
    this.weaponMeshes.set('ak47', ak);

    // 2. M4A4 Viewmodel
    const m4 = new THREE.Group();
    const m4Rec = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.35), gunMetalMat);
    m4.add(m4Rec);
    const m4Bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.3, 12), gunMetalMat);
    m4Bar.rotation.x = Math.PI / 2;
    m4Bar.position.set(0, 0.01, -0.3);
    m4.add(m4Bar);
    const m4Guard = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.06, 0.2), gunMetalMat);
    m4Guard.position.set(0, 0.01, -0.22);
    m4.add(m4Guard);
    const m4Stock = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.09, 0.2), gunMetalMat);
    m4Stock.position.set(0, -0.01, 0.25);
    m4.add(m4Stock);
    const m4Mag = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.15, 0.06), gunMetalMat);
    m4Mag.position.set(0, -0.09, -0.04);
    m4.add(m4Mag);
    const m4Carry = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.15), gunMetalMat);
    m4Carry.position.set(0, 0.055, 0.02);
    m4.add(m4Carry);
    this.weaponMeshes.set('m4a4', m4);

    // 3. AWP Viewmodel
    const awp = new THREE.Group();
    const awpRec = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.45), greenMat);
    awp.add(awpRec);
    const awpBar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 12), gunMetalMat);
    awpBar.rotation.x = Math.PI / 2;
    awpBar.position.set(0, 0.01, -0.4);
    awp.add(awpBar);
    const awpScope = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.28, 12), gunMetalMat);
    awpScope.rotation.x = Math.PI / 2;
    awpScope.position.set(0, 0.08, -0.05);
    awp.add(awpScope);
    const awpStock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.28), greenMat);
    awpStock.position.set(0, -0.02, 0.32);
    awp.add(awpStock);
    this.weaponMeshes.set('awp', awp);

    // 4. Deagle Viewmodel
    const deagle = new THREE.Group();
    const dSlide = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.065, 0.24), silverMat);
    dSlide.position.set(0, 0.03, -0.06);
    deagle.add(dSlide);
    const dFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.2), gunMetalMat);
    dFrame.position.set(0, 0.01, -0.05);
    deagle.add(dFrame);
    const dGrip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.12, 0.06), gunMetalMat);
    dGrip.position.set(0, -0.06, 0.02);
    dGrip.rotation.x = -0.2;
    deagle.add(dGrip);
    this.weaponMeshes.set('deagle', deagle);

    // 5. Glock Viewmodel
    const glock = new THREE.Group();
    const gSlide = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.05, 0.2), gunMetalMat);
    gSlide.position.set(0, 0.02, -0.05);
    glock.add(gSlide);
    const gGrip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.11, 0.055), gunMetalMat);
    gGrip.position.set(0, -0.05, 0.02);
    gGrip.rotation.x = -0.18;
    glock.add(gGrip);
    this.weaponMeshes.set('glock', glock);

    // 6. USP-S Viewmodel
    const usp = new THREE.Group();
    const uSlide = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.05, 0.2), gunMetalMat);
    uSlide.position.set(0, 0.02, -0.05);
    usp.add(uSlide);
    const uSilencer = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12), gunMetalMat);
    uSilencer.rotation.x = Math.PI / 2;
    uSilencer.position.set(0, 0.02, -0.23);
    usp.add(uSilencer);
    const uGrip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.11, 0.055), gunMetalMat);
    uGrip.position.set(0, -0.05, 0.02);
    uGrip.rotation.x = -0.18;
    usp.add(uGrip);
    this.weaponMeshes.set('usp', usp);

    // 7. Knife Viewmodel
    const knife = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.05, 0.24), silverMat);
    blade.position.set(0, 0.02, -0.15);
    knife.add(blade);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.12), gunMetalMat);
    handle.position.set(0, 0, 0.02);
    knife.add(handle);
    this.weaponMeshes.set('knife', knife);

    // 8. C4 Viewmodel
    const c4 = new THREE.Group();
    const c4B = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.22), c4Mat);
    c4.add(c4B);
    const c4Pad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.12), gunMetalMat);
    c4Pad.position.set(0, 0.05, -0.02);
    c4.add(c4Pad);
    const c4Scr = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.035), c4LcdMat);
    c4Scr.rotation.x = -Math.PI / 2;
    c4Scr.position.set(0, 0.062, 0.05);
    c4.add(c4Scr);
    this.weaponMeshes.set('c4', c4);
  }

  // Switch displayed viewmodel
  public setWeapon(weaponId: WeaponId) {
    this.currentWeaponId = weaponId;
    this.weaponMeshes.forEach((mesh) => {
      this.weaponRoot.remove(mesh);
    });

    const mesh = this.weaponMeshes.get(weaponId);
    if (mesh) {
      this.weaponRoot.add(mesh);
    }

    // Adjust arm posture per weapon type
    if (weaponId === 'knife') {
      this.leftArmGroup.visible = false;
      this.rightArmGroup.position.set(0, 0, 0);
    } else if (weaponId === 'glock' || weaponId === 'usp' || weaponId === 'deagle') {
      this.leftArmGroup.visible = true;
      this.leftArmGroup.position.set(0.12, 0.02, -0.1);
      this.rightArmGroup.position.set(0, 0, 0);
    } else if (weaponId === 'c4') {
      this.leftArmGroup.visible = true;
      this.leftArmGroup.position.set(0.08, 0.04, -0.08);
      this.rightArmGroup.position.set(0, 0, 0);
    } else {
      // Rifles / AWP
      this.leftArmGroup.visible = true;
      this.leftArmGroup.position.set(0, 0, 0);
      this.rightArmGroup.position.set(0, 0, 0);
    }
  }

  // Trigger fire recoil kick
  public triggerShoot(recoilPitch: number, recoilYaw: number) {
    this.recoilOffset.z += 0.045; // Kick back
    this.recoilRot.x -= recoilPitch * 0.8;
    this.recoilRot.y += (Math.random() - 0.5) * recoilYaw;

    // Flash light & sprite
    this.muzzleFlashLight.intensity = 3.0;
    this.muzzleFlashSprite.material.opacity = 1.0;
    this.flashTimer = 0.04;
  }

  // Trigger reload sequence
  public triggerReload(duration: number) {
    this.isReloading = true;
    this.reloadDuration = duration;
    this.reloadProgress = 0;
  }

  // Add mouse sway to viewmodel
  public addSway(deltaYaw: number, deltaPitch: number) {
    this.swayYaw -= deltaYaw * 0.0012;
    this.swayPitch -= deltaPitch * 0.0012;

    // Clamp sway
    this.swayYaw = Math.max(-0.06, Math.min(0.06, this.swayYaw));
    this.swayPitch = Math.max(-0.06, Math.min(0.06, this.swayPitch));
  }

  // Update viewmodel position & animation every frame
  public update(dt: number, speed: number, isGrounded: boolean, isScoped: boolean) {
    // Hide viewmodel when scoped with AWP
    this.group.visible = !isScoped;

    // Muzzle flash decay
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.muzzleFlashLight.intensity = 0;
        this.muzzleFlashSprite.material.opacity = 0;
      }
    }

    // Weapon sway recovery
    this.swayYaw *= 0.85;
    this.swayPitch *= 0.85;

    // Recoil recovery
    this.recoilOffset.multiplyScalar(0.8);
    this.recoilRot.x *= 0.82;
    this.recoilRot.y *= 0.82;

    // Walking / Running Bobbing
    let bobX = 0;
    let bobY = 0;
    if (speed > 0.5 && isGrounded) {
      this.bobTime += dt * speed * 2.6;
      bobX = Math.sin(this.bobTime) * 0.015;
      bobY = Math.abs(Math.sin(this.bobTime * 2)) * 0.012;
    } else {
      // Idle breathing bob
      this.bobTime += dt * 1.5;
      bobX = Math.sin(this.bobTime) * 0.002;
      bobY = Math.cos(this.bobTime * 2) * 0.002;
    }

    // Reload animation dip
    let reloadY = 0;
    let reloadRotX = 0;
    if (this.isReloading) {
      this.reloadProgress += dt / this.reloadDuration;
      if (this.reloadProgress >= 1.0) {
        this.isReloading = false;
      } else {
        // Dip down then up
        const t = this.reloadProgress;
        reloadY = -Math.sin(t * Math.PI) * 0.12;
        reloadRotX = Math.sin(t * Math.PI) * 0.35;
      }
    }

    // Apply combined transforms to weapon root
    const basePos = new THREE.Vector3(0.22, -0.22, -0.42);
    this.weaponRoot.position.set(
      basePos.x + bobX + this.swayYaw + this.recoilOffset.x,
      basePos.y + bobY + this.swayPitch + this.recoilOffset.y + reloadY,
      basePos.z + this.recoilOffset.z
    );

    this.weaponRoot.rotation.set(
      this.swayPitch * 1.5 + this.recoilRot.x + reloadRotX,
      this.swayYaw * 1.5 + this.recoilRot.y,
      this.swayYaw * 0.8
    );
  }
}
