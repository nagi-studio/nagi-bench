import * as THREE from 'three';
import { WeaponId } from './WeaponTypes';
import { getAK47WoodTexture, getC4KeypadTexture } from '../procedural/textures';

export class Viewmodel {
  public group: THREE.Group;
  private weaponMeshes: Map<WeaponId, THREE.Group> = new Map();
  public currentWeaponId: WeaponId = 'ak47';

  // Animation state
  private recoilPitch: number = 0;
  private recoilOffset: number = 0;
  private bobTime: number = 0;
  private swayX: number = 0;
  private swayY: number = 0;
  private reloadProgress: number = -1; // -1 if not reloading
  private reloadDuration: number = 2.0;
  private drawProgress: number = 1.0;

  // Muzzle flash
  private muzzleFlashMesh: THREE.Mesh;
  private muzzleFlashLight: THREE.PointLight;
  private muzzleFlashTimer: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0.24, -0.22, -0.42); // Default bottom-right FPS view position

    // Setup Muzzle Flash
    const flashGeo = new THREE.PlaneGeometry(0.18, 0.18);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.visible = false;
    this.group.add(this.muzzleFlashMesh);

    this.muzzleFlashLight = new THREE.PointLight(0xffaa22, 0, 8);
    this.group.add(this.muzzleFlashLight);

    // Build procedural 3D weapon viewmodels
    this.buildAK47();
    this.buildM4A4();
    this.buildAWP();
    this.buildGlock();
    this.buildUSP();
    this.buildDeagle();
    this.buildKnife();
    this.buildC4();

    this.setWeapon('ak47');
  }

  private createHands(): THREE.Group {
    const hands = new THREE.Group();
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0x1f2326, roughness: 0.85 });
    const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x2b3e50, roughness: 0.8 });

    // Right Arm & Hand
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.35, 8), sleeveMat);
    rightArm.rotation.x = -Math.PI / 3;
    rightArm.position.set(0.12, -0.15, 0.15);
    hands.add(rightArm);

    const rightGlove = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.1), gloveMat);
    rightGlove.position.set(0.08, -0.05, 0.02);
    hands.add(rightGlove);

    // Left Arm & Hand
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.35, 8), sleeveMat);
    leftArm.rotation.x = -Math.PI / 4;
    leftArm.rotation.y = 0.5;
    leftArm.position.set(-0.16, -0.18, 0.12);
    hands.add(leftArm);

    const leftGlove = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.09), gloveMat);
    leftGlove.position.set(-0.06, -0.04, -0.15);
    hands.add(leftGlove);

    return hands;
  }

  // --- 1. AK-47 VIEWMODEL ---
  private buildAK47() {
    const g = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x24282c, roughness: 0.4, metalness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ map: getAK47WoodTexture(), roughness: 0.65 });

    // Receiver
    const rec = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.32), metalMat);
    g.add(rec);

    // Barrel & Gas Tube
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 8), metalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.015, -0.28);
    g.add(barrel);

    const muzzleBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8), metalMat);
    muzzleBrake.rotation.x = Math.PI / 2;
    muzzleBrake.position.set(0, 0.015, -0.43);
    g.add(muzzleBrake);

    // Wood Furniture
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.06, 0.18), woodMat);
    handguard.position.set(0, 0.01, -0.18);
    g.add(handguard);

    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.22), woodMat);
    stock.position.set(0, -0.02, 0.25);
    g.add(stock);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.1, 0.05), woodMat);
    grip.position.set(0, -0.08, 0.08);
    grip.rotation.x = 0.35;
    g.add(grip);

    // Curved Banana Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.07), metalMat);
    mag.position.set(0, -0.1, -0.04);
    mag.rotation.x = 0.25;
    g.add(mag);

    // Sights
    const frontSight = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.035, 0.01), metalMat);
    frontSight.position.set(0, 0.045, -0.4);
    g.add(frontSight);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('ak47', g);
  }

  // --- 2. M4A4 VIEWMODEL ---
  private buildM4A4() {
    const g = new THREE.Group();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1a1e22, roughness: 0.5, metalness: 0.7 });
    const tanMat = new THREE.MeshStandardMaterial({ color: 0x5a5042, roughness: 0.7 });

    // Upper/Lower Receiver
    const rec = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.28), darkMetal);
    g.add(rec);

    // Quad Rail Handguard
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.054, 0.054, 0.22), darkMetal);
    handguard.position.set(0, 0.01, -0.22);
    g.add(handguard);

    // Barrel & Flash Hider
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), darkMetal);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, -0.38);
    g.add(barrel);

    // Tactical Stock
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.09, 0.2), tanMat);
    stock.position.set(0, -0.01, 0.22);
    g.add(stock);

    // Straight STANAG Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.06), darkMetal);
    mag.position.set(0, -0.09, -0.05);
    mag.rotation.x = 0.1;
    g.add(mag);

    // Carry Handle / Top Sight
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.035, 0.16), darkMetal);
    sight.position.set(0, 0.055, 0.02);
    g.add(sight);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('m4a4', g);
  }

  // --- 3. AWP VIEWMODEL ---
  private buildAWP() {
    const g = new THREE.Group();
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x3d4e38, roughness: 0.6 }); // Olive Drab
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x181a1d, roughness: 0.4, metalness: 0.85 });

    // Chassis & Stock
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.5), greenMat);
    body.position.set(0, 0, 0);
    g.add(body);

    const thumbholeStock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.28), greenMat);
    thumbholeStock.position.set(0, -0.02, 0.32);
    g.add(thumbholeStock);

    // Heavy Sniper Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.45, 8), metalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, -0.45);
    g.add(barrel);

    // Muzzle Brake
    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 0.08), metalMat);
    muzzle.position.set(0, 0.02, -0.7);
    g.add(muzzle);

    // Large Optical Scope
    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.3, 12), metalMat);
    scopeTube.rotation.x = Math.PI / 2;
    scopeTube.position.set(0, 0.08, -0.05);
    g.add(scopeTube);

    // Scope Mounts
    const scopeMount1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.03), metalMat);
    scopeMount1.position.set(0, 0.055, 0.04);
    g.add(scopeMount1);
    const scopeMount2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.03), metalMat);
    scopeMount2.position.set(0, 0.055, -0.14);
    g.add(scopeMount2);

    // Bolt handle
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06), metalMat);
    bolt.rotation.z = Math.PI / 2.5;
    bolt.position.set(0.04, 0.04, 0.08);
    g.add(bolt);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('awp', g);
  }

  // --- 4. GLOCK-18 VIEWMODEL ---
  private buildGlock() {
    const g = new THREE.Group();
    const slideMat = new THREE.MeshStandardMaterial({ color: 0x1c1e21, roughness: 0.4, metalness: 0.7 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2a2d30, roughness: 0.9 });

    // Slide
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.04, 0.2), slideMat);
    slide.position.set(0, 0.02, -0.05);
    g.add(slide);

    // Lower Frame & Grip
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.03, 0.18), frameMat);
    frame.position.set(0, -0.01, -0.05);
    g.add(frame);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.12, 0.05), frameMat);
    grip.position.set(0, -0.07, 0.02);
    grip.rotation.x = 0.25;
    g.add(grip);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('glock', g);
  }

  // --- 5. USP-S VIEWMODEL ---
  private buildUSP() {
    const g = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x33383d, roughness: 0.35, metalness: 0.8 });
    const suppMat = new THREE.MeshStandardMaterial({ color: 0x1a1c1e, roughness: 0.6 });

    // Slide & Frame
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.042, 0.22), steelMat);
    slide.position.set(0, 0.02, -0.05);
    g.add(slide);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.13, 0.055), suppMat);
    grip.position.set(0, -0.07, 0.03);
    grip.rotation.x = 0.25;
    g.add(grip);

    // Suppressor (Silencer)
    const suppressor = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 12), suppMat);
    suppressor.rotation.x = Math.PI / 2;
    suppressor.position.set(0, 0.02, -0.25);
    g.add(suppressor);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('usp', g);
  }

  // --- 6. DESERT EAGLE VIEWMODEL ---
  private buildDeagle() {
    const g = new THREE.Group();
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x99a3ad, roughness: 0.2, metalness: 0.9 });
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.95 });

    // Massive Triangular Slide & Heavy Barrel
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.055, 0.26), chromeMat);
    slide.position.set(0, 0.025, -0.08);
    g.add(slide);

    // Large Hand Cannon Grip
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.14, 0.065), gripMat);
    grip.position.set(0, -0.07, 0.03);
    grip.rotation.x = 0.28;
    g.add(grip);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('deagle', g);
  }

  // --- 7. TACTICAL KNIFE VIEWMODEL ---
  private buildKnife() {
    const g = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xb5bcc4, roughness: 0.15, metalness: 0.95 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x1e2428, roughness: 0.9 });

    // Handle with finger grooves
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.14), handleMat);
    handle.position.set(0, -0.02, 0.06);
    g.add(handle);

    // Guard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.015), handleMat);
    guard.position.set(0, -0.01, -0.01);
    g.add(guard);

    // Curved Blade
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.045, 0.2), bladeMat);
    blade.position.set(0, 0.01, -0.11);
    blade.rotation.x = -0.08;
    g.add(blade);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('knife', g);
  }

  // --- 8. C4 EXPLOSIVE VIEWMODEL ---
  private buildC4() {
    const g = new THREE.Group();
    const c4Mat = new THREE.MeshStandardMaterial({ map: getC4KeypadTexture(), roughness: 0.7 });

    const c4Body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.24), c4Mat);
    c4Body.position.set(0, -0.02, -0.05);
    g.add(c4Body);

    g.add(this.createHands());
    g.visible = false;
    this.group.add(g);
    this.weaponMeshes.set('c4', g);
  }

  public setWeapon(weaponId: WeaponId) {
    this.currentWeaponId = weaponId;
    this.weaponMeshes.forEach((mesh, id) => {
      mesh.visible = id === weaponId;
    });

    // Reset draw animation
    this.drawProgress = 0;
    this.reloadProgress = -1;

    // Adjust muzzle flash anchor
    let muzzleZ = -0.45;
    if (weaponId === 'awp') muzzleZ = -0.72;
    else if (weaponId === 'glock' || weaponId === 'usp') muzzleZ = -0.32;
    else if (weaponId === 'deagle') muzzleZ = -0.35;
    this.muzzleFlashMesh.position.set(0, 0.02, muzzleZ);
    this.muzzleFlashLight.position.set(0, 0.02, muzzleZ);
  }

  public triggerRecoil(kickAmount: number = 0.04) {
    this.recoilPitch = Math.min(0.2, this.recoilPitch + kickAmount);
    this.recoilOffset = Math.min(0.08, this.recoilOffset + kickAmount * 0.7);

    // Trigger Muzzle Flash
    this.muzzleFlashMesh.visible = true;
    (this.muzzleFlashMesh.material as THREE.MeshBasicMaterial).opacity = 0.9;
    this.muzzleFlashMesh.rotation.z = Math.random() * Math.PI * 2;
    this.muzzleFlashLight.intensity = 3.0;
    this.muzzleFlashTimer = 0.06;
  }

  public triggerReload(duration: number) {
    this.reloadDuration = duration;
    this.reloadProgress = 0;
  }

  public addMouseSway(deltaX: number, deltaY: number) {
    this.swayX += deltaX * 0.0008;
    this.swayY += deltaY * 0.0008;
    this.swayX = THREE.MathUtils.clamp(this.swayX, -0.06, 0.06);
    this.swayY = THREE.MathUtils.clamp(this.swayY, -0.06, 0.06);
  }

  public update(delta: number, isMoving: boolean, speed: number, isScoped: boolean = false) {
    // Hide viewmodel when scoped in with AWP
    if (isScoped && this.currentWeaponId === 'awp') {
      this.group.visible = false;
      return;
    } else {
      this.group.visible = true;
    }

    // Muzzle Flash Fade
    if (this.muzzleFlashTimer > 0) {
      this.muzzleFlashTimer -= delta;
      if (this.muzzleFlashTimer <= 0) {
        this.muzzleFlashMesh.visible = false;
        this.muzzleFlashLight.intensity = 0;
      }
    }

    // Recoil recovery
    this.recoilPitch = THREE.MathUtils.lerp(this.recoilPitch, 0, delta * 12);
    this.recoilOffset = THREE.MathUtils.lerp(this.recoilOffset, 0, delta * 12);

    // Mouse Sway recovery
    this.swayX = THREE.MathUtils.lerp(this.swayX, 0, delta * 8);
    this.swayY = THREE.MathUtils.lerp(this.swayY, 0, delta * 8);

    // Walk Bobbing
    let bobX = 0;
    let bobY = 0;
    if (isMoving) {
      this.bobTime += delta * speed * 3.8;
      bobX = Math.cos(this.bobTime) * 0.015;
      bobY = Math.abs(Math.sin(this.bobTime)) * 0.018;
    } else {
      this.bobTime += delta * 1.5;
      bobY = Math.sin(this.bobTime) * 0.003;
    }

    // Draw Weapon Animation
    if (this.drawProgress < 1.0) {
      this.drawProgress = Math.min(1.0, this.drawProgress + delta * 3.5);
    }
    const drawYOffset = (1 - this.drawProgress) * -0.3;

    // Reload Animation (Tilt gun down, pull mag, reset)
    let reloadRotX = 0;
    let reloadRotZ = 0;
    let reloadOffsetY = 0;
    if (this.reloadProgress >= 0) {
      this.reloadProgress += delta / this.reloadDuration;
      if (this.reloadProgress >= 1.0) {
        this.reloadProgress = -1;
      } else {
        const p = this.reloadProgress;
        reloadRotX = Math.sin(p * Math.PI) * 0.4;
        reloadRotZ = Math.sin(p * Math.PI) * -0.3;
        reloadOffsetY = -Math.sin(p * Math.PI) * 0.08;
      }
    }

    // Apply combined transformations to viewmodel root
    const baseX = 0.24;
    const baseY = -0.22;
    const baseZ = -0.42;

    this.group.position.set(
      baseX - this.swayX + bobX,
      baseY - this.swayY + bobY + drawYOffset + reloadOffsetY,
      baseZ + this.recoilOffset
    );

    this.group.rotation.set(
      this.recoilPitch + this.swayY * 1.5 + reloadRotX,
      -this.swayX * 1.5,
      reloadRotZ
    );
  }
}
