import * as THREE from 'three';
import { Team, WeaponId } from './types';

/**
 * Procedural 3D weapon geometry factory shared by First-Person Viewmodels and Third-Person World Models.
 */
export function createWeaponMesh(weaponId: WeaponId): THREE.Group {
  const g = new THREE.Group();

  const gunmetal = new THREE.MeshStandardMaterial({ color: 0x2a2d32, roughness: 0.42, metalness: 0.72 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: 0x1e2024, roughness: 0.72, metalness: 0.25 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x7b4a24, roughness: 0.65, metalness: 0.08 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xc8cfd6, roughness: 0.26, metalness: 0.88 });
  const olive = new THREE.MeshStandardMaterial({ color: 0x4b5d3f, roughness: 0.68, metalness: 0.2 });
  const lensBlue = new THREE.MeshStandardMaterial({ color: 0x2b6ca3, roughness: 0.15, metalness: 0.9 });
  const steelBlade = new THREE.MeshStandardMaterial({ color: 0xb7c2cc, roughness: 0.22, metalness: 0.92 });
  const c4Tan = new THREE.MeshStandardMaterial({ color: 0xc2aa70, roughness: 0.8 });
  const c4Green = new THREE.MeshStandardMaterial({ color: 0x2e4a34, roughness: 0.6 });
  const c4Screen = new THREE.MeshBasicMaterial({ color: 0x6dff88 });
  const c4Led = new THREE.MeshBasicMaterial({ color: 0xff2b2b });

  const addPart = (
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    rx = 0,
    ry = 0,
    rz = 0
  ) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    g.add(m);
    return m;
  };

  // All weapons point forward along -Z!
  if (weaponId === 'ak47') {
    // Receiver
    addPart(new THREE.BoxGeometry(0.055, 0.085, 0.34), gunmetal, 0, 0.01, -0.02);
    // Wooden stock
    addPart(new THREE.BoxGeometry(0.048, 0.095, 0.24), wood, 0, -0.015, 0.25, 0.12, 0, 0);
    // Wooden lower & upper handguard
    addPart(new THREE.BoxGeometry(0.056, 0.068, 0.21), wood, 0, 0.012, -0.29);
    // Barrel & gas tube
    addPart(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 10), gunmetal, 0, 0.015, -0.49, Math.PI / 2);
    addPart(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 8), gunmetal, 0, 0.042, -0.35, Math.PI / 2);
    // Front sight post
    addPart(new THREE.BoxGeometry(0.014, 0.048, 0.018), gunmetal, 0, 0.048, -0.66);
    // Curved iconic AK banana magazine (two angled segments)
    addPart(new THREE.BoxGeometry(0.036, 0.14, 0.068), wood, 0, -0.085, -0.11, 0.22, 0, 0);
    addPart(new THREE.BoxGeometry(0.034, 0.12, 0.064), wood, 0, -0.19, -0.155, 0.48, 0, 0);
    // Pistol grip
    addPart(new THREE.BoxGeometry(0.038, 0.11, 0.048), wood, 0, -0.075, 0.09, -0.28, 0, 0);
    // Charging handle
    addPart(new THREE.BoxGeometry(0.03, 0.014, 0.022), chrome, 0.036, 0.028, -0.06);
  } else if (weaponId === 'm4a4') {
    // Upper + lower receiver
    addPart(new THREE.BoxGeometry(0.056, 0.092, 0.3), darkPolymer, 0, 0.012, -0.02);
    // Top Picatinny rail + rear iron sight
    addPart(new THREE.BoxGeometry(0.032, 0.016, 0.44), gunmetal, 0, 0.064, -0.14);
    addPart(new THREE.BoxGeometry(0.032, 0.036, 0.035), darkPolymer, 0, 0.085, 0.06);
    // Telescoping stock
    addPart(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8), darkPolymer, 0, 0.02, 0.2, Math.PI / 2);
    addPart(new THREE.BoxGeometry(0.046, 0.105, 0.12), darkPolymer, 0, -0.005, 0.28);
    // Quad-rail tactical handguard
    addPart(new THREE.BoxGeometry(0.058, 0.064, 0.24), gunmetal, 0, 0.018, -0.29);
    // Barrel & flash hider
    addPart(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 10), gunmetal, 0, 0.018, -0.52, Math.PI / 2);
    addPart(new THREE.CylinderGeometry(0.017, 0.015, 0.06, 8), darkPolymer, 0, 0.018, -0.68, Math.PI / 2);
    // Classic M4 A-frame front sight
    addPart(new THREE.BoxGeometry(0.016, 0.058, 0.034), gunmetal, 0, 0.058, -0.45);
    // STANAG Magazine
    addPart(new THREE.BoxGeometry(0.034, 0.17, 0.066), gunmetal, 0, -0.095, -0.1, 0.12, 0, 0);
    // Grip
    addPart(new THREE.BoxGeometry(0.036, 0.11, 0.046), darkPolymer, 0, -0.075, 0.08, -0.26, 0, 0);
  } else if (weaponId === 'awp') {
    // Olive green Arctic Warfare chassis
    addPart(new THREE.BoxGeometry(0.06, 0.082, 0.56), olive, 0, 0.0, -0.14);
    addPart(new THREE.BoxGeometry(0.052, 0.105, 0.28), olive, 0, -0.018, 0.24);
    // Cheek rest
    addPart(new THREE.BoxGeometry(0.046, 0.03, 0.13), darkPolymer, 0, 0.045, 0.22);
    // Long heavy sniper barrel + muzzle brake
    addPart(new THREE.CylinderGeometry(0.016, 0.019, 0.62, 12), gunmetal, 0, 0.028, -0.68, Math.PI / 2);
    addPart(new THREE.BoxGeometry(0.04, 0.034, 0.075), darkPolymer, 0, 0.028, -1.0);
    // Scope mounts + iconic sniper optic
    addPart(new THREE.BoxGeometry(0.028, 0.042, 0.025), darkPolymer, 0, 0.068, -0.02);
    addPart(new THREE.BoxGeometry(0.028, 0.042, 0.025), darkPolymer, 0, 0.068, -0.18);
    addPart(new THREE.CylinderGeometry(0.022, 0.022, 0.34, 14), darkPolymer, 0, 0.105, -0.12, Math.PI / 2);
    addPart(new THREE.CylinderGeometry(0.032, 0.024, 0.08, 14), darkPolymer, 0, 0.105, -0.32, Math.PI / 2);
    addPart(new THREE.CylinderGeometry(0.028, 0.028, 0.01, 14), lensBlue, 0, 0.105, -0.36, Math.PI / 2);
    // Bolt handle
    addPart(new THREE.CylinderGeometry(0.008, 0.008, 0.055, 8), chrome, 0.045, 0.025, 0.04, 0, 0, Math.PI / 2);
    // Magazine
    addPart(new THREE.BoxGeometry(0.038, 0.095, 0.08), darkPolymer, 0, -0.075, -0.12);
    // Bipod folded under barrel
    addPart(new THREE.CylinderGeometry(0.009, 0.009, 0.22, 8), gunmetal, -0.028, -0.035, -0.44, Math.PI / 2);
    addPart(new THREE.CylinderGeometry(0.009, 0.009, 0.22, 8), gunmetal, 0.028, -0.035, -0.44, Math.PI / 2);
  } else if (weaponId === 'glock') {
    addPart(new THREE.BoxGeometry(0.038, 0.044, 0.22), darkPolymer, 0, 0.032, -0.06);
    addPart(new THREE.BoxGeometry(0.034, 0.026, 0.2), gunmetal, 0, 0.002, -0.05);
    addPart(new THREE.BoxGeometry(0.034, 0.115, 0.052), darkPolymer, 0, -0.055, 0.02, -0.22, 0, 0);
    addPart(new THREE.BoxGeometry(0.012, 0.014, 0.014), chrome, 0, 0.058, -0.155);
  } else if (weaponId === 'usp') {
    addPart(new THREE.BoxGeometry(0.038, 0.044, 0.22), gunmetal, 0, 0.032, -0.05);
    addPart(new THREE.BoxGeometry(0.034, 0.026, 0.21), darkPolymer, 0, 0.002, -0.05);
    addPart(new THREE.BoxGeometry(0.034, 0.115, 0.05), darkPolymer, 0, -0.055, 0.025, -0.2, 0, 0);
    // Iconic USP-S matte-black suppressor
    addPart(new THREE.CylinderGeometry(0.018, 0.018, 0.21, 12), darkPolymer, 0, 0.028, -0.26, Math.PI / 2);
  } else if (weaponId === 'deagle') {
    // Massive iconic silver Desert Eagle slide + triangular heavy barrel
    addPart(new THREE.BoxGeometry(0.046, 0.056, 0.29), chrome, 0, 0.036, -0.09);
    addPart(new THREE.BoxGeometry(0.042, 0.028, 0.23), gunmetal, 0, 0.002, -0.06);
    addPart(new THREE.BoxGeometry(0.04, 0.125, 0.062), darkPolymer, 0, -0.058, 0.02, -0.22, 0, 0);
    addPart(new THREE.BoxGeometry(0.014, 0.016, 0.02), darkPolymer, 0, 0.068, -0.21);
  } else if (weaponId === 'knife') {
    // Handle + finger guard
    addPart(new THREE.BoxGeometry(0.026, 0.038, 0.13), darkPolymer, 0, -0.01, 0.02);
    addPart(new THREE.BoxGeometry(0.036, 0.064, 0.014), gunmetal, 0, 0.0, -0.048);
    // Tapered combat tanto blade
    addPart(new THREE.BoxGeometry(0.008, 0.04, 0.18), steelBlade, 0, 0.006, -0.14);
    addPart(new THREE.ConeGeometry(0.022, 0.07, 4), steelBlade, 0, 0.006, -0.26, -Math.PI / 2, Math.PI / 4, 0);
  } else if (weaponId === 'c4') {
    // Explosive charge brick + circuit + screen + blinking LED
    addPart(new THREE.BoxGeometry(0.22, 0.11, 0.15), c4Tan, 0, 0, -0.08);
    addPart(new THREE.BoxGeometry(0.18, 0.025, 0.11), c4Green, 0, 0.06, -0.08);
    addPart(new THREE.BoxGeometry(0.085, 0.012, 0.038), c4Screen, -0.025, 0.074, -0.095);
    const led = addPart(new THREE.SphereGeometry(0.012, 8, 8), c4Led, 0.055, 0.076, -0.095);
    led.name = 'c4_led';
    // Straps
    addPart(new THREE.BoxGeometry(0.022, 0.118, 0.156), darkPolymer, -0.065, 0, -0.08);
    addPart(new THREE.BoxGeometry(0.022, 0.118, 0.156), darkPolymer, 0.065, 0, -0.08);
  }

  return g;
}

/**
 * First-person viewmodel controller attached to the camera with faction arms, sway, bob, recoil & reload animation.
 */
export class FirstPersonViewmodel {
  public readonly root = new THREE.Group();
  private weaponPivot = new THREE.Group();
  private currentWeaponGroup: THREE.Group | null = null;
  private armsGroup = new THREE.Group();
  private muzzleLight: THREE.PointLight;
  private muzzleFlashMesh: THREE.Mesh;

  private activeWeapon: WeaponId = 'usp';
  private activeTeam: Team = 'CT';

  private bobPhase = 0;
  private recoilZ = 0;
  private recoilPitch = 0;
  private swingPhase = 0;
  private drawOffset = 0;
  private swayX = 0;
  private swayY = 0;
  private muzzleTimer = 0;

  constructor() {
    this.root.add(this.weaponPivot);
    this.buildArms('CT');
    this.weaponPivot.add(this.armsGroup);

    this.muzzleLight = new THREE.PointLight(0xffb84d, 0, 7);
    this.muzzleLight.position.set(0.18, -0.08, -0.95);
    this.root.add(this.muzzleLight);

    const flashGeo = new THREE.OctahedronGeometry(0.07, 0);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffe28a,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
    });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.visible = false;
    this.weaponPivot.add(this.muzzleFlashMesh);

    this.setWeapon('usp', 'CT');
  }

  private buildArms(team: Team): void {
    while (this.armsGroup.children.length > 0) {
      this.armsGroup.remove(this.armsGroup.children[0]);
    }
    const sleeveColor = team === 'CT' ? 0x293b52 : 0x7b6647;
    const gloveColor = team === 'CT' ? 0x1e2228 : 0x3b2c20;
    const sleeveMat = new THREE.MeshStandardMaterial({ color: sleeveColor, roughness: 0.85 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: gloveColor, roughness: 0.78 });

    // Right forearm & hand gripping weapon
    const rForearm = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.082, 0.36), sleeveMat);
    rForearm.position.set(0.09, -0.13, 0.24);
    rForearm.rotation.set(0.28, -0.18, 0);
    this.armsGroup.add(rForearm);

    const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.072, 0.1), gloveMat);
    rHand.position.set(0.02, -0.065, 0.07);
    this.armsGroup.add(rHand);

    // Left support forearm & hand
    const lForearm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.38), sleeveMat);
    lForearm.position.set(-0.22, -0.15, 0.08);
    lForearm.rotation.set(0.22, 0.56, 0.12);
    this.armsGroup.add(lForearm);

    const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.068, 0.1), gloveMat);
    lHand.position.set(-0.04, -0.055, -0.16);
    this.armsGroup.add(lHand);
  }

  public setWeapon(weaponId: WeaponId, team: Team): void {
    if (this.activeTeam !== team) {
      this.activeTeam = team;
      this.buildArms(team);
    }
    if (this.activeWeapon === weaponId && this.currentWeaponGroup) return;
    this.activeWeapon = weaponId;

    if (this.currentWeaponGroup) {
      this.weaponPivot.remove(this.currentWeaponGroup);
    }
    this.currentWeaponGroup = createWeaponMesh(weaponId);
    this.weaponPivot.add(this.currentWeaponGroup);
    this.drawOffset = 1.0;

    // Position muzzle flash according to barrel length
    const muzzleZ =
      weaponId === 'awp'
        ? -1.05
        : weaponId === 'ak47' || weaponId === 'm4a4'
        ? -0.74
        : weaponId === 'usp'
        ? -0.38
        : -0.26;
    this.muzzleFlashMesh.position.set(0, 0.025, muzzleZ);
  }

  public triggerFire(weaponId: WeaponId): void {
    if (weaponId === 'knife') {
      this.swingPhase = 1.0;
      return;
    }
    if (weaponId === 'c4') return;

    const heavy = weaponId === 'awp' ? 2.4 : weaponId === 'deagle' ? 1.8 : weaponId === 'ak47' ? 1.35 : 0.85;
    this.recoilZ = Math.min(0.16, this.recoilZ + 0.055 * heavy);
    this.recoilPitch = Math.min(0.32, this.recoilPitch + 0.085 * heavy);
    if (weaponId !== 'usp') {
      this.muzzleTimer = 0.045;
      this.muzzleFlashMesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      const scale = weaponId === 'awp' ? 1.55 : weaponId === 'ak47' ? 1.15 : 0.85;
      this.muzzleFlashMesh.scale.setScalar(scale);
    }
  }

  public addLookSway(dx: number, dy: number): void {
    this.swayX = Math.max(-0.04, Math.min(0.04, this.swayX - dx * 0.00018));
    this.swayY = Math.max(-0.03, Math.min(0.03, this.swayY + dy * 0.00018));
  }

  public update(
    dt: number,
    moveSpeed: number,
    onGround: boolean,
    reloading: boolean,
    reloadProgress: number,
    scoped: boolean
  ): void {
    // Hide 3D gun when looking down AWP scope
    this.root.visible = !scoped;

    // Recover sway, recoil, draw, swing
    const decay = Math.exp(-dt * 12);
    this.swayX *= decay;
    this.swayY *= decay;
    this.recoilZ *= Math.exp(-dt * 16);
    this.recoilPitch *= Math.exp(-dt * 14);
    this.drawOffset = Math.max(0, this.drawOffset - dt * 4.5);
    this.swingPhase = Math.max(0, this.swingPhase - dt * 3.8);

    // Walk bob
    if (onGround && moveSpeed > 0.4) {
      this.bobPhase += dt * (5.5 + moveSpeed * 1.1);
    } else {
      this.bobPhase += dt * 1.3;
    }
    const bobAmp = onGround ? Math.min(1, moveSpeed / 5.5) : 0.08;
    const bobX = Math.cos(this.bobPhase) * 0.011 * bobAmp;
    const bobY = Math.abs(Math.sin(this.bobPhase)) * 0.012 * bobAmp;

    // Reload dip & roll
    const reloadWave = reloading ? Math.sin(reloadProgress * Math.PI) : 0;

    // Base resting position per weapon category
    const baseX = this.activeWeapon === 'c4' ? 0.04 : this.activeWeapon === 'knife' ? 0.22 : 0.24;
    const baseY = this.activeWeapon === 'c4' ? -0.26 : -0.21;
    const baseZ = this.activeWeapon === 'awp' ? -0.44 : this.activeWeapon === 'knife' ? -0.38 : -0.46;

    // Knife slash lunge
    const slashX = this.activeWeapon === 'knife' ? -Math.sin(this.swingPhase * Math.PI) * 0.24 : 0;
    const slashZ = this.activeWeapon === 'knife' ? -Math.sin(this.swingPhase * Math.PI) * 0.16 : 0;
    const slashRotY = this.activeWeapon === 'knife' ? Math.sin(this.swingPhase * Math.PI) * 1.1 : 0;

    this.weaponPivot.position.set(
      baseX + bobX + this.swayX + slashX,
      baseY - bobY + this.swayY - this.drawOffset * 0.24 - reloadWave * 0.14,
      baseZ + this.recoilZ + slashZ
    );

    this.weaponPivot.rotation.set(
      this.recoilPitch - this.drawOffset * 0.45 - reloadWave * 0.42,
      slashRotY + (this.activeWeapon === 'knife' ? 0.25 : 0.03),
      -this.swayX * 1.6 + reloadWave * 0.35
    );

    // Blink C4 LED when held
    if (this.activeWeapon === 'c4' && this.currentWeaponGroup) {
      const led = this.currentWeaponGroup.getObjectByName('c4_led');
      if (led) {
        led.visible = Math.floor(performance.now() / 350) % 2 === 0;
      }
    }

    // Muzzle flash
    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt;
      this.muzzleFlashMesh.visible = true;
      this.muzzleLight.intensity = 6.5;
    } else {
      this.muzzleFlashMesh.visible = false;
      this.muzzleLight.intensity = 0;
    }
  }
}
