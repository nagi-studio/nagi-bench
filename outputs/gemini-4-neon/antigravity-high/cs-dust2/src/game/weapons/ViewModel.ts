import * as THREE from 'three';
import { WeaponId } from '../types';

/**
 * First-person procedural 3D weapon viewmodel attached to the FPS camera.
 * Supports distinct procedural geometry for AK-47, M4A4, AWP, Glock, USP-S, Deagle, Knife, and C4,
 * with walk bob, recoil kick, reload animation, knife slash, equip raise, and dynamic muzzle flash.
 */
export class ViewModel {
  public readonly root: THREE.Group;
  private weaponPivot: THREE.Group;
  private models = new Map<WeaponId, THREE.Group>();
  private currentWeapon: WeaponId = 'glock';

  private muzzleMesh: THREE.Mesh;
  private muzzleLight: THREE.PointLight;
  private muzzleTimer = 0;

  private recoilKickZ = 0;
  private recoilKickPitch = 0;
  private equipAnim = 0;
  private slashAnim = 0;
  private walkBobPhase = 0;
  private c4Led: THREE.Mesh | null = null;
  private c4BlinkTimer = 0;

  constructor(camera: THREE.Camera) {
    this.root = new THREE.Group();
    this.weaponPivot = new THREE.Group();
    this.root.add(this.weaponPivot);
    camera.add(this.root);

    this.buildAllWeapons();

    // Dynamic first-person muzzle flash
    this.muzzleMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.075, 0),
      new THREE.MeshBasicMaterial({ color: '#ffd966', transparent: true, opacity: 0.92 })
    );
    this.muzzleMesh.visible = false;
    this.weaponPivot.add(this.muzzleMesh);

    this.muzzleLight = new THREE.PointLight('#ffb84d', 0, 5.5);
    this.muzzleLight.position.set(0.22, -0.1, -0.75);
    this.root.add(this.muzzleLight);

    this.setWeapon('usp', true);
  }

  private buildAllWeapons(): void {
    const darkMetal = new THREE.MeshStandardMaterial({ color: '#22262b', roughness: 0.42, metalness: 0.72 });
    const gunMetal = new THREE.MeshStandardMaterial({ color: '#393f47', roughness: 0.38, metalness: 0.78 });
    const chrome = new THREE.MeshStandardMaterial({ color: '#b8c0c8', roughness: 0.25, metalness: 0.9 });
    const wood = new THREE.MeshStandardMaterial({ color: '#8f5527', roughness: 0.72 });
    const awpGreen = new THREE.MeshStandardMaterial({ color: '#375436', roughness: 0.65 });
    const glove = new THREE.MeshStandardMaterial({ color: '#2c3138', roughness: 0.85 });
    const sleeve = new THREE.MeshStandardMaterial({ color: '#35485e', roughness: 0.88 });

    const addHands = (g: THREE.Group, leftPos: [number, number, number], rightPos: [number, number, number]) => {
      const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.085, 0.14), glove);
      rHand.position.set(...rightPos);
      const rArm = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.095, 0.26), sleeve);
      rArm.position.set(rightPos[0] + 0.05, rightPos[1] - 0.05, rightPos[2] + 0.16);
      rArm.rotation.y = -0.2;
      g.add(rHand, rArm);

      const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.075, 0.13), glove);
      lHand.position.set(...leftPos);
      const lArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.32), sleeve);
      lArm.position.set(leftPos[0] - 0.11, leftPos[1] - 0.08, leftPos[2] + 0.18);
      lArm.rotation.y = 0.42;
      lArm.rotation.x = 0.12;
      g.add(lHand, lArm);
    };

    // ==================== AK-47 ====================
    const ak = new THREE.Group();
    const akRec = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.095, 0.42), darkMetal);
    const akTop = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.04, 0.32), gunMetal);
    akTop.position.set(0, 0.055, 0.02);
    const akHandguard = new THREE.Mesh(new THREE.BoxGeometry(0.062, 0.075, 0.25), wood);
    akHandguard.position.set(0, 0.005, -0.32);
    const akStock = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.09, 0.24), wood);
    akStock.position.set(0, -0.025, 0.31);
    const akBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.016, 0.36, 10), darkMetal);
    akBarrel.rotation.x = Math.PI / 2;
    akBarrel.position.set(0, 0.02, -0.56);
    const akGas = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 8), gunMetal);
    akGas.rotation.x = Math.PI / 2;
    akGas.position.set(0, 0.045, -0.39);
    const akSight = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.045, 0.02), darkMetal);
    akSight.position.set(0, 0.052, -0.71);
    // Iconic curved banana magazine
    const akMag1 = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.14, 0.08), wood);
    akMag1.position.set(0, -0.10, -0.11);
    akMag1.rotation.x = 0.18;
    const akMag2 = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.13, 0.078), wood);
    akMag2.position.set(0, -0.21, -0.15);
    akMag2.rotation.x = 0.42;
    ak.add(akRec, akTop, akHandguard, akStock, akBarrel, akGas, akSight, akMag1, akMag2);
    addHands(ak, [-0.04, -0.04, -0.32], [0.02, -0.09, 0.09]);
    ak.position.set(0.24, -0.23, -0.44);
    this.models.set('ak47', ak);

    // ==================== M4A4 ====================
    const m4 = new THREE.Group();
    const m4Rec = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.10, 0.38), darkMetal);
    const m4Rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.44), gunMetal);
    m4Rail.position.set(0, 0.06, -0.12);
    const m4Handguard = new THREE.Mesh(new THREE.BoxGeometry(0.064, 0.078, 0.28), gunMetal);
    m4Handguard.position.set(0, 0.005, -0.32);
    const m4Barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.015, 0.34, 10), darkMetal);
    m4Barrel.rotation.x = Math.PI / 2;
    m4Barrel.position.set(0, 0.015, -0.55);
    const m4FrontSight = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.06, 0.04), darkMetal);
    m4FrontSight.position.set(0, 0.065, -0.47);
    const m4RearSight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.045, 0.08), darkMetal);
    m4RearSight.position.set(0, 0.08, 0.08);
    const m4Mag = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.19, 0.075), darkMetal);
    m4Mag.position.set(0, -0.13, -0.10);
    m4Mag.rotation.x = 0.1;
    const m4Stock = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.095, 0.24), darkMetal);
    m4Stock.position.set(0, -0.01, 0.28);
    m4.add(m4Rec, m4Rail, m4Handguard, m4Barrel, m4FrontSight, m4RearSight, m4Mag, m4Stock);
    addHands(m4, [-0.04, -0.04, -0.32], [0.02, -0.09, 0.09]);
    m4.position.set(0.24, -0.23, -0.44);
    this.models.set('m4a4', m4);

    // ==================== AWP ====================
    const awp = new THREE.Group();
    const awpChassis = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.098, 0.62), awpGreen);
    const awpStock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.105, 0.26), awpGreen);
    awpStock.position.set(0, -0.015, 0.36);
    const awpBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.021, 0.62, 10), darkMetal);
    awpBarrel.rotation.x = Math.PI / 2;
    awpBarrel.position.set(0, 0.025, -0.56);
    const awpMuzzle = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.036, 0.08), darkMetal);
    awpMuzzle.position.set(0, 0.025, -0.88);
    const awpScopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.022, 0.34, 12), darkMetal);
    awpScopeTube.rotation.x = Math.PI / 2;
    awpScopeTube.position.set(0, 0.105, -0.06);
    const awpScopeFront = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.026, 0.10, 12), darkMetal);
    awpScopeFront.rotation.x = Math.PI / 2;
    awpScopeFront.position.set(0, 0.105, -0.25);
    const awpMount1 = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.05, 0.03), gunMetal);
    awpMount1.position.set(0, 0.068, -0.14);
    const awpMount2 = awpMount1.clone();
    awpMount2.position.set(0, 0.068, 0.04);
    const awpBolt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.018), chrome);
    awpBolt.position.set(0.048, 0.03, 0.12);
    awp.add(awpChassis, awpStock, awpBarrel, awpMuzzle, awpScopeTube, awpScopeFront, awpMount1, awpMount2, awpBolt);
    addHands(awp, [-0.04, -0.04, -0.30], [0.02, -0.09, 0.10]);
    awp.position.set(0.24, -0.24, -0.44);
    this.models.set('awp', awp);

    // ==================== GLOCK-18 ====================
    const glock = new THREE.Group();
    const glSlide = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.056, 0.26), darkMetal);
    const glFrame = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.032, 0.24), gunMetal);
    glFrame.position.set(0, -0.036, 0.005);
    const glGrip = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.13, 0.068), darkMetal);
    glGrip.position.set(0, -0.095, 0.075);
    glGrip.rotation.x = -0.22;
    glock.add(glSlide, glFrame, glGrip);
    addHands(glock, [-0.03, -0.10, 0.06], [0.01, -0.10, 0.09]);
    glock.position.set(0.22, -0.22, -0.46);
    this.models.set('glock', glock);

    // ==================== USP-S ====================
    const usp = new THREE.Group();
    const uSlide = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.056, 0.25), darkMetal);
    const uSupp = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.24, 12), darkMetal);
    uSupp.rotation.x = Math.PI / 2;
    uSupp.position.set(0, 0.005, -0.24);
    const uGrip = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.13, 0.068), gunMetal);
    uGrip.position.set(0, -0.095, 0.075);
    uGrip.rotation.x = -0.2;
    usp.add(uSlide, uSupp, uGrip);
    addHands(usp, [-0.03, -0.10, 0.06], [0.01, -0.10, 0.09]);
    usp.position.set(0.22, -0.22, -0.46);
    this.models.set('usp', usp);

    // ==================== DESERT EAGLE ====================
    const deagle = new THREE.Group();
    const dSlide = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.072, 0.32), chrome);
    const dRib = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.018, 0.28), darkMetal);
    dRib.position.set(0, 0.04, -0.01);
    const dGrip = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.145, 0.076), darkMetal);
    dGrip.position.set(0, -0.10, 0.09);
    dGrip.rotation.x = -0.24;
    deagle.add(dSlide, dRib, dGrip);
    addHands(deagle, [-0.03, -0.10, 0.07], [0.01, -0.10, 0.10]);
    deagle.position.set(0.22, -0.22, -0.46);
    this.models.set('deagle', deagle);

    // ==================== TACTICAL KNIFE ====================
    const knife = new THREE.Group();
    const kBlade = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.048, 0.26), chrome);
    kBlade.position.set(0, 0.01, -0.13);
    const kEdge = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.09, 4), chrome);
    kEdge.rotation.x = -Math.PI / 2;
    kEdge.position.set(0, 0.01, -0.29);
    const kGuard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.025), darkMetal);
    kGuard.position.set(0, 0, 0.0);
    const kHandle = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.045, 0.14), darkMetal);
    kHandle.position.set(0, 0, 0.08);
    knife.add(kBlade, kEdge, kGuard, kHandle);
    addHands(knife, [-0.25, -0.14, 0.02], [0.01, -0.02, 0.10]);
    knife.position.set(0.24, -0.22, -0.42);
    knife.rotation.y = 0.22;
    knife.rotation.z = -0.15;
    this.models.set('knife', knife);

    // ==================== C4 EXPLOSIVE ====================
    const c4 = new THREE.Group();
    const c4Pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.09, 0.28),
      new THREE.MeshStandardMaterial({ color: '#7a725a', roughness: 0.85 })
    );
    const c4Screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.015, 0.06),
      new THREE.MeshBasicMaterial({ color: '#243a24' })
    );
    c4Screen.position.set(0, 0.048, -0.06);
    const c4Keypad = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.015, 0.11),
      darkMetal
    );
    c4Keypad.position.set(0, 0.048, 0.05);
    this.c4Led = new THREE.Mesh(
      new THREE.BoxGeometry(0.026, 0.02, 0.026),
      new THREE.MeshBasicMaterial({ color: '#ff2424' })
    );
    this.c4Led.position.set(0.075, 0.052, -0.06);
    c4.add(c4Pack, c4Screen, c4Keypad, this.c4Led);
    addHands(c4, [-0.12, -0.03, 0.02], [0.12, -0.03, 0.02]);
    c4.position.set(0.02, -0.26, -0.44);
    c4.rotation.x = 0.42;
    this.models.set('c4', c4);

    for (const [id, group] of this.models.entries()) {
      group.visible = false;
      this.weaponPivot.add(group);
    }
  }

  public setWeapon(id: WeaponId, instant = false): void {
    if (this.currentWeapon === id && !instant) return;
    const prev = this.models.get(this.currentWeapon);
    if (prev) prev.visible = false;
    this.currentWeapon = id;
    const next = this.models.get(id);
    if (next) next.visible = true;
    this.equipAnim = instant ? 0 : 1.0;

    // Position muzzle flash according to weapon barrel length
    const muzzleZ: Record<WeaponId, number> = {
      ak47: -1.16,
      m4a4: -1.15,
      awp: -1.35,
      glock: -0.68,
      usp: -0.84,
      deagle: -0.72,
      knife: -0.6,
      c4: -0.5,
    };
    this.muzzleMesh.position.set(0.23, -0.20, muzzleZ[id]);
  }

  public triggerFire(weapon: WeaponId): void {
    if (weapon === 'knife') {
      this.slashAnim = 1.0;
      return;
    }
    if (weapon === 'c4') return;

    const kickMap: Record<WeaponId, [number, number]> = {
      ak47: [0.085, 0.14],
      m4a4: [0.052, 0.08],
      awp: [0.15, 0.22],
      glock: [0.04, 0.08],
      usp: [0.035, 0.07],
      deagle: [0.11, 0.24],
      knife: [0, 0],
      c4: [0, 0],
    };
    const [zKick, pKick] = kickMap[weapon];
    this.recoilKickZ = Math.min(0.18, this.recoilKickZ + zKick);
    this.recoilKickPitch = Math.min(0.32, this.recoilKickPitch + pKick);

    if (weapon !== 'usp') {
      this.muzzleTimer = 0.045;
      this.muzzleMesh.visible = true;
      this.muzzleMesh.rotation.set(Math.random() * 4, Math.random() * 4, 0);
      this.muzzleMesh.scale.setScalar(weapon === 'awp' ? 1.55 : weapon === 'ak47' ? 1.15 : 0.9);
      this.muzzleLight.intensity = weapon === 'awp' ? 5.5 : 3.2;
    }
  }

  public update(
    dt: number,
    horizSpeed: number,
    grounded: boolean,
    reloading: boolean,
    reloadProgress: number,
    scoped: boolean,
    visible: boolean
  ): void {
    this.root.visible = visible && !scoped;

    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt;
      if (this.muzzleTimer <= 0) {
        this.muzzleMesh.visible = false;
        this.muzzleLight.intensity = 0;
      }
    }

    // Blink C4 LED
    if (this.c4Led && this.currentWeapon === 'c4') {
      this.c4BlinkTimer += dt;
      this.c4Led.visible = Math.floor(this.c4BlinkTimer * 3) % 2 === 0;
    }

    // Recover recoil & animations
    this.recoilKickZ = Math.max(0, this.recoilKickZ - dt * 0.55);
    this.recoilKickPitch = Math.max(0, this.recoilKickPitch - dt * 1.45);
    this.equipAnim = Math.max(0, this.equipAnim - dt * 4.2);
    this.slashAnim = Math.max(0, this.slashAnim - dt * 4.5);

    // Walk bob
    if (grounded && horizSpeed > 0.4) {
      this.walkBobPhase += dt * horizSpeed * 1.85;
    } else {
      this.walkBobPhase += dt * 1.1; // subtle breathing idle
    }

    const bobAmp = grounded && horizSpeed > 0.4 ? Math.min(0.018, horizSpeed * 0.0028) : 0.0025;
    const bobX = Math.cos(this.walkBobPhase) * bobAmp;
    const bobY = Math.abs(Math.sin(this.walkBobPhase)) * bobAmp * -1.2;

    // Reload dip & tilt animation
    let reloadY = 0;
    let reloadRotZ = 0;
    let reloadRotX = 0;
    if (reloading) {
      const wave = Math.sin(reloadProgress * Math.PI);
      reloadY = -0.14 * wave;
      reloadRotZ = 0.48 * wave;
      reloadRotX = -0.28 * wave;
    }

    // Knife slash lunge
    let slashZ = 0;
    let slashRotY = 0;
    let slashRotX = 0;
    if (this.slashAnim > 0) {
      const s = Math.sin(this.slashAnim * Math.PI);
      slashZ = -0.22 * s;
      slashRotY = 0.65 * s;
      slashRotX = -0.45 * s;
    }

    this.weaponPivot.position.set(
      bobX,
      bobY - this.equipAnim * 0.24 + reloadY,
      this.recoilKickZ + slashZ
    );
    this.weaponPivot.rotation.set(
      this.recoilKickPitch - this.equipAnim * 0.35 + reloadRotX + slashRotX,
      slashRotY,
      reloadRotZ
    );
  }
}
