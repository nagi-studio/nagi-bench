import * as THREE from 'three';
import { HitboxZone, Team, WeaponId } from '../types';

/**
 * Procedural articulated humanoid character with distinct Head, Torso (Chest + Abdomen),
 * Dual Arms, Dual Legs, faction-specific tactical gear (CT vs T), animated stride,
 * weapon-aiming upper body, and explicit HitboxZone tagging for every body part.
 */
export class HumanoidModel {
  public readonly root: THREE.Group;
  public readonly upperBody: THREE.Group;
  public readonly headGroup: THREE.Group;
  public readonly leftLeg: THREE.Group;
  public readonly rightLeg: THREE.Group;
  public readonly weaponMount: THREE.Group;
  public readonly hitboxMeshes: THREE.Mesh[] = [];

  private weaponMeshes = new Map<WeaponId, THREE.Group>();
  private currentWeapon: WeaponId = 'glock';
  private walkPhase = 0;
  private deadProgress = 0;
  private isDead = false;
  private muzzleFlash: THREE.Mesh;
  private muzzleTimer = 0;

  constructor(agentId: string, team: Team) {
    this.root = new THREE.Group();
    this.root.name = `Humanoid_${agentId}`;

    // Faction palettes — unmistakably distinct at any distance
    const isCT = team === 'CT';
    const skinMat = new THREE.MeshStandardMaterial({ color: '#d9a782', roughness: 0.75 });
    const shirtMat = new THREE.MeshStandardMaterial({
      color: isCT ? '#243a54' : '#7a6345',
      roughness: 0.85,
    });
    const vestMat = new THREE.MeshStandardMaterial({
      color: isCT ? '#1a2736' : '#4a3d2d',
      roughness: 0.78,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: isCT ? '#3e7cb1' : '#c97b32',
      roughness: 0.7,
    });
    const pantsMat = new THREE.MeshStandardMaterial({
      color: isCT ? '#223142' : '#9c8663',
      roughness: 0.88,
    });
    const bootMat = new THREE.MeshStandardMaterial({ color: '#1b1d20', roughness: 0.8 });
    const gearMat = new THREE.MeshStandardMaterial({
      color: isCT ? '#2b3c4f' : '#3a2d20',
      roughness: 0.72,
    });

    const tagHitbox = (mesh: THREE.Mesh, zone: HitboxZone) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { agentId, hitboxZone: zone };
      this.hitboxMeshes.push(mesh);
      return mesh;
    };

    // =========================================================================
    // LEGS (Left & Right articulated hip pivots at Y = 0.86)
    // =========================================================================
    const buildLeg = (side: -1 | 1): THREE.Group => {
      const leg = new THREE.Group();
      leg.position.set(side * 0.135, 0.86, 0);

      // Thigh
      const thigh = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.175, 0.42, 0.19), pantsMat),
        'leg'
      );
      thigh.position.set(0, -0.21, 0);
      leg.add(thigh);

      // Knee pad
      const knee = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.10, 0.05), gearMat);
      knee.position.set(0, -0.40, -0.09);
      leg.add(knee);

      // Shin
      const shin = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.36, 0.16), pantsMat),
        'leg'
      );
      shin.position.set(0, -0.58, 0.01);
      leg.add(shin);

      // Tactical Boot
      const boot = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.26), bootMat),
        'leg'
      );
      boot.position.set(0, -0.79, -0.04);
      leg.add(boot);

      return leg;
    };

    this.leftLeg = buildLeg(-1);
    this.rightLeg = buildLeg(1);
    this.root.add(this.leftLeg, this.rightLeg);

    // =========================================================================
    // UPPER BODY (Waist pivot at Y = 0.86)
    // =========================================================================
    this.upperBody = new THREE.Group();
    this.upperBody.position.set(0, 0.86, 0);
    this.root.add(this.upperBody);

    // Pelvis / Belt
    const belt = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 0.25), gearMat),
      'stomach'
    );
    belt.position.set(0, 0.05, 0);
    this.upperBody.add(belt);

    // Stomach / Abdomen (distinct hitbox zone!)
    const abdomen = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.22, 0.24), shirtMat),
      'stomach'
    );
    abdomen.position.set(0, 0.21, 0);
    this.upperBody.add(abdomen);

    // Chest / Tactical Armor Vest (distinct hitbox zone!)
    const chest = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.28), vestMat),
      'chest'
    );
    chest.position.set(0, 0.47, 0);
    this.upperBody.add(chest);

    // Shoulder pads & Faction Stripe / Chest Rig details
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.07, 0.295), accentMat);
    stripe.position.set(0, 0.56, 0);
    this.upperBody.add(stripe);

    // Ammo pouches on chest
    for (let i = -1; i <= 1; i++) {
      const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.06), gearMat);
      pouch.position.set(i * 0.11, 0.37, -0.15);
      this.upperBody.add(pouch);
    }

    // Back tactical pack (CT radio pack / T desert pack)
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.32, 0.13), gearMat);
    pack.position.set(0, 0.45, 0.18);
    this.upperBody.add(pack);
    if (isCT) {
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.32, 6), bootMat);
      antenna.position.set(0.11, 0.72, 0.20);
      this.upperBody.add(antenna);
    }

    // =========================================================================
    // HEAD & FACTION HEADGEAR (Neck pivot at Y = 0.66 relative to upperBody -> 1.52 world)
    // =========================================================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.66, 0);
    this.upperBody.add(this.headGroup);

    const neck = tagHitbox(
      new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.078, 0.09, 8), skinMat),
      'head'
    );
    neck.position.set(0, 0.04, 0);
    this.headGroup.add(neck);

    // Skull / Face
    const headMesh = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.24), isCT ? skinMat : skinMat),
      'head'
    );
    headMesh.position.set(0, 0.19, 0);
    this.headGroup.add(headMesh);

    if (isCT) {
      // CT Ballistic Kevlar Helmet + Tactical Visor + Balaclava Mask
      const mask = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.248, 0.16, 0.248), gearMat),
        'head'
      );
      mask.position.set(0, 0.14, 0);
      this.headGroup.add(mask);

      const helmet = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.29), new THREE.MeshStandardMaterial({ color: '#1f334a', roughness: 0.55 })),
        'head'
      );
      helmet.position.set(0, 0.27, 0.01);
      this.headGroup.add(helmet);

      // Goggles on visor
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.075, 0.05),
        new THREE.MeshStandardMaterial({ color: '#58b4e8', roughness: 0.2, metalness: 0.5 })
      );
      visor.position.set(0, 0.20, -0.125);
      this.headGroup.add(visor);
    } else {
      // T Shemagh Headwrap / Desert Cap + Sunglasses + Scarf
      const wrap = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.265, 0.12, 0.265), accentMat),
        'head'
      );
      wrap.position.set(0, 0.28, 0.01);
      this.headGroup.add(wrap);

      const bandana = tagHitbox(
        new THREE.Mesh(new THREE.BoxGeometry(0.255, 0.10, 0.255), new THREE.MeshStandardMaterial({ color: '#8f4c1f', roughness: 0.85 })),
        'head'
      );
      bandana.position.set(0, 0.12, -0.005);
      this.headGroup.add(bandana);

      const shades = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 0.055, 0.04),
        new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.25, metalness: 0.4 })
      );
      shades.position.set(0, 0.20, -0.125);
      this.headGroup.add(shades);
    }

    // =========================================================================
    // DUAL ARMS (Posed in authentic two-handed rifle/weapon firing stance!)
    // =========================================================================
    const armAimGroup = new THREE.Group();
    armAimGroup.position.set(0, 0.54, 0);
    this.upperBody.add(armAimGroup);

    // Right Arm (trigger hand side, extended forward along -Z)
    const rShoulder = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.15), shirtMat),
      'arm'
    );
    rShoulder.position.set(0.29, 0.0, -0.02);
    armAimGroup.add(rShoulder);

    const rUpperArm = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.30), shirtMat),
      'arm'
    );
    rUpperArm.position.set(0.27, -0.08, -0.16);
    rUpperArm.rotation.x = 0.22;
    rUpperArm.rotation.y = 0.14;
    armAimGroup.add(rUpperArm);

    const rForearm = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.28), shirtMat),
      'arm'
    );
    rForearm.position.set(0.20, -0.10, -0.37);
    rForearm.rotation.y = 0.26;
    armAimGroup.add(rForearm);

    const rHand = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.10), skinMat),
      'arm'
    );
    rHand.position.set(0.15, -0.10, -0.49);
    armAimGroup.add(rHand);

    // Left Arm (support hand reaching forward to weapon handguard)
    const lShoulder = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.15), shirtMat),
      'arm'
    );
    lShoulder.position.set(-0.29, 0.0, -0.02);
    armAimGroup.add(lShoulder);

    const lUpperArm = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.32), shirtMat),
      'arm'
    );
    lUpperArm.position.set(-0.24, -0.08, -0.20);
    lUpperArm.rotation.y = -0.35;
    armAimGroup.add(lUpperArm);

    const lForearm = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.32), shirtMat),
      'arm'
    );
    lForearm.position.set(-0.04, -0.10, -0.44);
    lForearm.rotation.y = -0.62;
    armAimGroup.add(lForearm);

    const lHand = tagHitbox(
      new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.10), skinMat),
      'arm'
    );
    lHand.position.set(0.12, -0.10, -0.62);
    armAimGroup.add(lHand);

    // =========================================================================
    // WORLD WEAPON MOUNT (Follows character aim direction!)
    // =========================================================================
    this.weaponMount = new THREE.Group();
    this.weaponMount.position.set(0.16, -0.07, -0.50);
    armAimGroup.add(this.weaponMount);

    this.buildWorldWeapons();
    this.setWeapon(isCT ? 'usp' : 'glock');

    // Muzzle flash sphere
    this.muzzleFlash = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.MeshBasicMaterial({ color: '#ffcf5c', transparent: true, opacity: 0.92 })
    );
    this.muzzleFlash.visible = false;
    this.muzzleFlash.position.set(0, 0.04, -0.62);
    this.weaponMount.add(this.muzzleFlash);
  }

  private buildWorldWeapons(): void {
    const darkMetal = new THREE.MeshStandardMaterial({ color: '#24272c', roughness: 0.45, metalness: 0.65 });
    const lightMetal = new THREE.MeshStandardMaterial({ color: '#8a929a', roughness: 0.35, metalness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: '#8a552a', roughness: 0.78 });
    const awpGreen = new THREE.MeshStandardMaterial({ color: '#395238', roughness: 0.65 });
    const c4Mat = new THREE.MeshStandardMaterial({ color: '#7a725c', roughness: 0.85 });

    // AK-47
    const ak = new THREE.Group();
    const akBody = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.10, 0.44), darkMetal);
    const akStock = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.09, 0.24), woodMat);
    akStock.position.set(0, -0.02, 0.30);
    const akGuard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.22), woodMat);
    akGuard.position.set(0, 0.0, -0.26);
    const akBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.32, 8), darkMetal);
    akBarrel.rotation.x = Math.PI / 2;
    akBarrel.position.set(0, 0.02, -0.48);
    const akMag = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.21, 0.08), woodMat);
    akMag.position.set(0, -0.14, -0.08);
    akMag.rotation.x = 0.26;
    ak.add(akBody, akStock, akGuard, akBarrel, akMag);
    this.weaponMeshes.set('ak47', ak);

    // M4A4
    const m4 = new THREE.Group();
    const m4Body = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.11, 0.42), darkMetal);
    const m4Stock = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.10, 0.24), darkMetal);
    m4Stock.position.set(0, -0.01, 0.28);
    const m4Barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.38, 8), darkMetal);
    m4Barrel.rotation.x = Math.PI / 2;
    m4Barrel.position.set(0, 0.02, -0.36);
    const m4Mag = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.18, 0.075), darkMetal);
    m4Mag.position.set(0, -0.12, -0.08);
    m4Mag.rotation.x = 0.12;
    m4.add(m4Body, m4Stock, m4Barrel, m4Mag);
    this.weaponMeshes.set('m4a4', m4);

    // AWP
    const awp = new THREE.Group();
    const awpBody = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.11, 0.62), awpGreen);
    const awpStock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.26), awpGreen);
    awpStock.position.set(0, -0.01, 0.36);
    const awpBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.56, 8), darkMetal);
    awpBarrel.rotation.x = Math.PI / 2;
    awpBarrel.position.set(0, 0.03, -0.54);
    const awpScope = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.30, 8), darkMetal);
    awpScope.rotation.x = Math.PI / 2;
    awpScope.position.set(0, 0.10, -0.04);
    awp.add(awpBody, awpStock, awpBarrel, awpScope);
    this.weaponMeshes.set('awp', awp);

    // Glock
    const glock = new THREE.Group();
    const glSlide = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.06, 0.22), darkMetal);
    const glGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), darkMetal);
    glGrip.position.set(0, -0.07, 0.06);
    glGrip.rotation.x = -0.2;
    glock.add(glSlide, glGrip);
    this.weaponMeshes.set('glock', glock);

    // USP-S
    const usp = new THREE.Group();
    const uSlide = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.06, 0.22), darkMetal);
    const uSupp = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.19, 8), darkMetal);
    uSupp.rotation.x = Math.PI / 2;
    uSupp.position.set(0, 0.005, -0.20);
    const uGrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.06), darkMetal);
    uGrip.position.set(0, -0.07, 0.06);
    usp.add(uSlide, uSupp, uGrip);
    this.weaponMeshes.set('usp', usp);

    // Deagle
    const deagle = new THREE.Group();
    const dSlide = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.075, 0.28), lightMetal);
    const dGrip = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.13, 0.07), darkMetal);
    dGrip.position.set(0, -0.08, 0.08);
    dGrip.rotation.x = -0.22;
    deagle.add(dSlide, dGrip);
    this.weaponMeshes.set('deagle', deagle);

    // Knife
    const knife = new THREE.Group();
    const kBlade = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.045, 0.22), lightMetal);
    kBlade.position.set(0, 0, -0.10);
    const kHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.11), darkMetal);
    kHandle.position.set(0, 0, 0.06);
    knife.add(kBlade, kHandle);
    this.weaponMeshes.set('knife', knife);

    // C4
    const c4 = new THREE.Group();
    const c4Body = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.24), c4Mat);
    const c4Led = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.02, 0.04),
      new THREE.MeshBasicMaterial({ color: '#ff2b2b' })
    );
    c4Led.position.set(0.04, 0.045, -0.04);
    c4.add(c4Body, c4Led);
    this.weaponMeshes.set('c4', c4);

    for (const [id, mesh] of this.weaponMeshes.entries()) {
      mesh.visible = id === this.currentWeapon;
      this.weaponMount.add(mesh);
    }
  }

  public setWeapon(id: WeaponId): void {
    if (this.currentWeapon === id) return;
    const prev = this.weaponMeshes.get(this.currentWeapon);
    if (prev) prev.visible = false;
    this.currentWeapon = id;
    const next = this.weaponMeshes.get(id);
    if (next) next.visible = true;
  }

  public triggerMuzzleFlash(): void {
    this.muzzleTimer = 0.055;
    this.muzzleFlash.visible = true;
    this.muzzleFlash.rotation.set(Math.random() * 3, Math.random() * 3, 0);
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
    if (!dead) {
      this.deadProgress = 0;
      this.root.rotation.x = 0;
      this.root.rotation.z = 0;
      this.root.visible = true;
    }
  }

  public update(
    dt: number,
    pos: THREE.Vector3,
    yaw: number,
    pitch: number,
    horizSpeed: number,
    crouching: boolean,
    visible: boolean
  ): void {
    this.root.visible = visible;
    this.root.position.copy(pos);

    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt;
      if (this.muzzleTimer <= 0) {
        this.muzzleFlash.visible = false;
      }
    }

    if (this.isDead) {
      this.deadProgress = Math.min(1, this.deadProgress + dt * 4.5);
      // Smooth topple backwards onto the ground
      this.root.rotation.set(-this.deadProgress * (Math.PI * 0.48), yaw, 0, 'YXZ');
      this.root.position.y = pos.y + 0.12 * this.deadProgress;
      return;
    }

    // Character faces -Z in local space when yaw = 0
    this.root.rotation.set(0, yaw, 0, 'YXZ');

    // Crouch offset
    const targetUpperY = crouching ? 0.60 : 0.86;
    this.upperBody.position.y += (targetUpperY - this.upperBody.position.y) * Math.min(1, dt * 14);
    // Subtle pitch tracking of head & upper torso
    this.upperBody.rotation.x = Math.max(-0.45, Math.min(0.45, pitch * 0.55));
    this.headGroup.rotation.x = Math.max(-0.45, Math.min(0.45, pitch * 0.45));

    // Leg stride cycle when moving
    if (horizSpeed > 0.35) {
      this.walkPhase += dt * horizSpeed * 2.1;
      const swing = Math.sin(this.walkPhase) * Math.min(0.65, horizSpeed * 0.11);
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
    } else {
      this.leftLeg.rotation.x *= Math.max(0, 1 - dt * 10);
      this.rightLeg.rotation.x *= Math.max(0, 1 - dt * 10);
    }
  }
}
