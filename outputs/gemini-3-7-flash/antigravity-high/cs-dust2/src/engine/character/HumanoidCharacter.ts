import * as THREE from 'three';
import { getUniformTexture, getAK47WoodTexture } from '../procedural/textures';

export type HitboxZone = 'head' | 'chest' | 'stomach' | 'arm_left' | 'arm_right' | 'leg_left' | 'leg_right';

export interface HitboxHit {
  zone: HitboxZone;
  distance: number;
  point: THREE.Vector3;
  multiplier: number;
}

export class HumanoidCharacter {
  public group: THREE.Group;
  public team: 'CT' | 'T';

  // Body Parts for hierarchy and animation
  public headGroup: THREE.Group;
  public chestGroup: THREE.Group;
  public stomachMesh: THREE.Mesh;
  public leftUpperArm: THREE.Group;
  public rightUpperArm: THREE.Group;
  public leftForearm: THREE.Group;
  public rightForearm: THREE.Group;
  public leftThigh: THREE.Group;
  public rightThigh: THREE.Group;
  public leftCalf: THREE.Group;
  public rightCalf: THREE.Group;
  public weaponMesh: THREE.Group;

  // Hitbox geometry references in world space
  private hitboxMeshes: { zone: HitboxZone; mesh: THREE.Mesh; multiplier: number }[] = [];

  // Animation state
  public isDead: boolean = false;
  private deathProgress: number = 0;
  private deathFallDir: THREE.Vector3 = new THREE.Vector3();
  private walkTime: number = 0;
  public isMoving: boolean = false;
  public isCrouching: boolean = false;
  public aimPitch: number = 0; // Look up/down in radians

  constructor(team: 'CT' | 'T') {
    this.team = team;
    this.group = new THREE.Group();

    // Textures & Materials
    const uniformTex = getUniformTexture(team);
    const uniformMat = new THREE.MeshStandardMaterial({
      map: uniformTex,
      roughness: 0.8,
      metalness: 0.1
    });

    const vestColor = team === 'CT' ? 0x182433 : 0x4a3c2c;
    const vestMat = new THREE.MeshStandardMaterial({
      color: vestColor,
      roughness: 0.7,
      metalness: 0.2
    });

    const skinColor = team === 'CT' ? 0xdcb28e : 0xc6966d;
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.6
    });

    const gloveMat = new THREE.MeshStandardMaterial({
      color: 0x1f2326,
      roughness: 0.9
    });

    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x15181a,
      roughness: 0.85
    });

    // Helper for creating transparent hitbox mesh
    const createHitbox = (geo: THREE.BufferGeometry, zone: HitboxZone, mult: number): THREE.Mesh => {
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const mesh = new THREE.Mesh(geo, hitMat);
      this.hitboxMeshes.push({ zone, mesh, multiplier: mult });
      return mesh;
    };

    // ==========================================
    // 1. PELVIS & STOMACH (Base at y: ~0.9m)
    // ==========================================
    this.stomachMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.22, 0.24),
      uniformMat
    );
    this.stomachMesh.position.set(0, 0.95, 0);
    this.stomachMesh.castShadow = true;
    this.group.add(this.stomachMesh);

    // Tactical Belt & Pouches
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.08, 0.26),
      gloveMat
    );
    belt.position.set(0, -0.06, 0);
    this.stomachMesh.add(belt);

    // Stomach Hitbox
    const stomachHitbox = createHitbox(new THREE.BoxGeometry(0.4, 0.26, 0.28), 'stomach', 1.25);
    this.stomachMesh.add(stomachHitbox);

    // ==========================================
    // 2. CHEST & TACTICAL VEST (y: ~1.2m)
    // ==========================================
    this.chestGroup = new THREE.Group();
    this.chestGroup.position.set(0, 0.16, 0);
    this.stomachMesh.add(this.chestGroup);

    // Torso Base
    const torsoMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.36, 0.26),
      uniformMat
    );
    torsoMesh.position.set(0, 0.18, 0);
    torsoMesh.castShadow = true;
    this.chestGroup.add(torsoMesh);

    // Tactical Plate Carrier Vest (Bulky front and back armor)
    const vestFront = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.32, 0.14),
      vestMat
    );
    vestFront.position.set(0, 0.18, 0.09);
    this.chestGroup.add(vestFront);

    // Ammo Mag Pouches on front
    for (let i = -1; i <= 1; i++) {
      const magPouch = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.14, 0.06),
        gloveMat
      );
      magPouch.position.set(i * 0.11, 0.12, 0.18);
      this.chestGroup.add(magPouch);
    }

    // Chest Hitbox
    const chestHitbox = createHitbox(new THREE.BoxGeometry(0.48, 0.38, 0.32), 'chest', 1.0);
    chestHitbox.position.set(0, 0.18, 0);
    this.chestGroup.add(chestHitbox);

    // ==========================================
    // 3. HEAD, HELMET / BALACLAVA, GOGGLES (y: ~1.65m)
    // ==========================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.38, 0);
    this.chestGroup.add(this.headGroup);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 8), skinMat);
    neck.position.set(0, 0.05, 0);
    this.headGroup.add(neck);

    // Head base
    const headMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.26, 0.24),
      skinMat
    );
    headMesh.position.set(0, 0.2, 0);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    if (team === 'CT') {
      // CT Tactical PASGT Kevlar Helmet
      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 10),
        new THREE.MeshStandardMaterial({ color: 0x1c2b3a, roughness: 0.6 })
      );
      helmet.position.set(0, 0.24, -0.02);
      helmet.scale.set(1.05, 0.9, 1.1);
      this.headGroup.add(helmet);

      // Tactical Visor / Goggles
      const goggles = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x112233, roughness: 0.2, metalness: 0.8 })
      );
      goggles.position.set(0, 0.22, 0.11);
      this.headGroup.add(goggles);

      // Headset / Comms on ear
      const headset = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.06), gloveMat);
      headset.position.set(0, 0.2, 0);
      this.headGroup.add(headset);
    } else {
      // T Guerilla Headband / Shemagh Wrap
      const headwrap = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.12, 0.26),
        new THREE.MeshStandardMaterial({ color: 0x822a22, roughness: 0.9 }) // Red guerilla band
      );
      headwrap.position.set(0, 0.28, 0);
      this.headGroup.add(headwrap);

      // Sunglasses / Aviator shades
      const shades = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.05, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.9 })
      );
      shades.position.set(0, 0.22, 0.13);
      this.headGroup.add(shades);
    }

    // Head Hitbox (2.0x body / 4.0x headshot crit multiplier)
    const headHitbox = createHitbox(new THREE.SphereGeometry(0.22, 8, 8), 'head', 2.0);
    headHitbox.position.set(0, 0.2, 0);
    this.headGroup.add(headHitbox);

    // ==========================================
    // 4. ARMS & WEAPON HOLDING STANCE
    // ==========================================
    // Left Shoulder & Arm
    this.leftUpperArm = new THREE.Group();
    this.leftUpperArm.position.set(-0.28, 0.3, 0);
    this.chestGroup.add(this.leftUpperArm);

    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.12), uniformMat);
    leftArmMesh.position.set(0, -0.13, 0);
    this.leftUpperArm.add(leftArmMesh);

    this.leftForearm = new THREE.Group();
    this.leftForearm.position.set(0, -0.26, 0);
    this.leftUpperArm.add(this.leftForearm);

    const leftForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.1), uniformMat);
    leftForearmMesh.position.set(0, -0.12, 0);
    this.leftForearm.add(leftForearmMesh);

    const leftGlove = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), gloveMat);
    leftGlove.position.set(0, -0.24, 0);
    this.leftForearm.add(leftGlove);

    const leftArmHitbox = createHitbox(new THREE.BoxGeometry(0.16, 0.54, 0.16), 'arm_left', 0.8);
    leftArmHitbox.position.set(0, -0.25, 0);
    this.leftUpperArm.add(leftArmHitbox);

    // Right Shoulder & Arm
    this.rightUpperArm = new THREE.Group();
    this.rightUpperArm.position.set(0.28, 0.3, 0);
    this.chestGroup.add(this.rightUpperArm);

    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.12), uniformMat);
    rightArmMesh.position.set(0, -0.13, 0);
    this.rightUpperArm.add(rightArmMesh);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.set(0, -0.26, 0);
    this.rightUpperArm.add(this.rightForearm);

    const rightForearmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.1), uniformMat);
    rightForearmMesh.position.set(0, -0.12, 0);
    this.rightForearm.add(rightForearmMesh);

    const rightGlove = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), gloveMat);
    rightGlove.position.set(0, -0.24, 0);
    this.rightForearm.add(rightGlove);

    const rightArmHitbox = createHitbox(new THREE.BoxGeometry(0.16, 0.54, 0.16), 'arm_right', 0.8);
    rightArmHitbox.position.set(0, -0.25, 0);
    this.rightUpperArm.add(rightArmHitbox);

    // Default Hold Weapon Pose
    this.rightUpperArm.rotation.x = -Math.PI / 3;
    this.rightUpperArm.rotation.y = -0.3;
    this.rightForearm.rotation.x = -Math.PI / 4;

    this.leftUpperArm.rotation.x = -Math.PI / 2.6;
    this.leftUpperArm.rotation.y = 0.6;
    this.leftForearm.rotation.x = -Math.PI / 5;

    // Attached 3D Weapon Model on Right Hand
    this.weaponMesh = this.buildHeldWeaponMesh();
    this.weaponMesh.position.set(0, -0.25, 0.15);
    this.weaponMesh.rotation.x = Math.PI / 2;
    this.rightForearm.add(this.weaponMesh);

    // ==========================================
    // 5. LEGS & COMBAT BOOTS
    // ==========================================
    // Left Leg
    this.leftThigh = new THREE.Group();
    this.leftThigh.position.set(-0.12, -0.06, 0);
    this.stomachMesh.add(this.leftThigh);

    const leftThighMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.38, 0.16), uniformMat);
    leftThighMesh.position.set(0, -0.19, 0);
    leftThighMesh.castShadow = true;
    this.leftThigh.add(leftThighMesh);

    this.leftCalf = new THREE.Group();
    this.leftCalf.position.set(0, -0.38, 0);
    this.leftThigh.add(this.leftCalf);

    const leftCalfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.14), uniformMat);
    leftCalfMesh.position.set(0, -0.19, 0);
    this.leftCalf.add(leftCalfMesh);

    // Knee pad
    const leftKneepad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), gloveMat);
    leftKneepad.position.set(0, -0.04, 0.08);
    this.leftCalf.add(leftKneepad);

    // Boot
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.22), bootMat);
    leftBoot.position.set(0, -0.42, 0.04);
    this.leftCalf.add(leftBoot);

    const leftLegHitbox = createHitbox(new THREE.BoxGeometry(0.18, 0.88, 0.22), 'leg_left', 0.75);
    leftLegHitbox.position.set(0, -0.42, 0);
    this.leftThigh.add(leftLegHitbox);

    // Right Leg
    this.rightThigh = new THREE.Group();
    this.rightThigh.position.set(0.12, -0.06, 0);
    this.stomachMesh.add(this.rightThigh);

    const rightThighMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.38, 0.16), uniformMat);
    rightThighMesh.position.set(0, -0.19, 0);
    rightThighMesh.castShadow = true;
    this.rightThigh.add(rightThighMesh);

    // Drop Holster on right thigh
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.1), gloveMat);
    holster.position.set(0.09, -0.16, 0);
    this.rightThigh.add(holster);

    this.rightCalf = new THREE.Group();
    this.rightCalf.position.set(0, -0.38, 0);
    this.rightThigh.add(this.rightCalf);

    const rightCalfMesh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.14), uniformMat);
    rightCalfMesh.position.set(0, -0.19, 0);
    this.rightCalf.add(rightCalfMesh);

    const rightKneepad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), gloveMat);
    rightKneepad.position.set(0, -0.04, 0.08);
    this.rightCalf.add(rightKneepad);

    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.22), bootMat);
    rightBoot.position.set(0, -0.42, 0.04);
    this.rightCalf.add(rightBoot);

    const rightLegHitbox = createHitbox(new THREE.BoxGeometry(0.18, 0.88, 0.22), 'leg_right', 0.75);
    rightLegHitbox.position.set(0, -0.42, 0);
    this.rightThigh.add(rightLegHitbox);
  }

  private buildHeldWeaponMesh(): THREE.Group {
    const gun = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ map: getAK47WoodTexture(), roughness: 0.7 });

    // Gun receiver & barrel
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.35), metalMat);
    gun.add(receiver);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3), metalMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, 0.3);
    gun.add(barrel);

    // Wood Handguard & Stock
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.2), woodMat);
    handguard.position.set(0, -0.01, 0.2);
    gun.add(handguard);

    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.22), woodMat);
    stock.position.set(0, -0.03, -0.26);
    gun.add(stock);

    // Curved Magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.08), metalMat);
    mag.position.set(0, -0.1, 0.06);
    mag.rotation.x = 0.25;
    gun.add(mag);

    gun.scale.set(0.9, 0.9, 0.9);
    return gun;
  }

  /**
   * Update character walk/run animations, aim pitch, and death ragdoll collapse
   */
  public update(delta: number, isMoving: boolean, speed: number, aimPitch: number) {
    if (this.isDead) {
      if (this.deathProgress < 1.0) {
        this.deathProgress = Math.min(1.0, this.deathProgress + delta * 2.5);
        const p = this.deathProgress;

        // Fall backward/sideways, collapse knees and drop head
        this.group.position.y = Math.max(0.15, this.group.position.y - delta * 2.0);
        this.group.rotation.x = -Math.PI / 2 * p;
        this.headGroup.rotation.x = -0.4 * p;
        this.leftThigh.rotation.x = 0.5 * p;
        this.rightThigh.rotation.x = 0.3 * p;
        this.leftUpperArm.rotation.z = -0.8 * p;
        this.rightUpperArm.rotation.z = 0.8 * p;
      }
      return;
    }

    this.isMoving = isMoving;
    this.aimPitch = aimPitch;

    // Pitch aiming (head and upper torso follow vertical aim)
    this.chestGroup.rotation.x = this.aimPitch * 0.7;
    this.headGroup.rotation.x = this.aimPitch * 0.3;

    // Walk / Run leg swing cycle
    if (isMoving) {
      this.walkTime += delta * speed * 3.5;
      const legAngle = Math.sin(this.walkTime) * 0.6;
      this.leftThigh.rotation.x = legAngle;
      this.rightThigh.rotation.x = -legAngle;

      this.leftCalf.rotation.x = Math.max(0, -Math.sin(this.walkTime) * 0.5);
      this.rightCalf.rotation.x = Math.max(0, Math.sin(this.walkTime) * 0.5);

      // Subtle torso bob
      this.stomachMesh.position.y = 0.95 + Math.abs(Math.sin(this.walkTime * 2)) * 0.04;
    } else {
      // Idle breathing pose
      this.walkTime += delta * 1.5;
      this.leftThigh.rotation.x = THREE.MathUtils.lerp(this.leftThigh.rotation.x, 0, delta * 10);
      this.rightThigh.rotation.x = THREE.MathUtils.lerp(this.rightThigh.rotation.x, 0, delta * 10);
      this.leftCalf.rotation.x = THREE.MathUtils.lerp(this.leftCalf.rotation.x, 0, delta * 10);
      this.rightCalf.rotation.x = THREE.MathUtils.lerp(this.rightCalf.rotation.x, 0, delta * 10);

      this.chestGroup.position.y = 0.16 + Math.sin(this.walkTime) * 0.01;
    }
  }

  public triggerDeath(bulletDir?: THREE.Vector3) {
    this.isDead = true;
    this.deathProgress = 0;
    if (bulletDir) {
      this.deathFallDir.copy(bulletDir).normalize();
    }
  }

  /**
   * Raycast against individual character hitboxes to determine exact hit zone
   */
  public testHitboxes(ray: THREE.Ray): HitboxHit | null {
    if (this.isDead) return null;

    let closestHit: HitboxHit | null = null;
    const inverseMatrix = new THREE.Matrix4();
    const localRay = new THREE.Ray();

    for (const { zone, mesh, multiplier } of this.hitboxMeshes) {
      mesh.updateWorldMatrix(true, false);
      inverseMatrix.copy(mesh.matrixWorld).invert();
      localRay.copy(ray).applyMatrix4(inverseMatrix);

      // Check intersection against geometry bounding box
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      const bbox = mesh.geometry.boundingBox!;

      const hitPoint = localRay.intersectBox(bbox, new THREE.Vector3());
      if (hitPoint) {
        // Convert hit point back to world space
        hitPoint.applyMatrix4(mesh.matrixWorld);
        const dist = ray.origin.distanceTo(hitPoint);

        if (!closestHit || dist < closestHit.distance) {
          closestHit = {
            zone,
            distance: dist,
            point: hitPoint,
            multiplier
          };
        }
      }
    }

    return closestHit;
  }
}
